/*
 * Lemme — comptes et synchronisation avec un projet Supabase (hébergé en Europe).
 *
 * Aucune bibliothèque : on appelle directement les deux interfaces HTTP du projet.
 *   /auth/v1  : connexion par code à usage unique envoyé par e-mail (pas de mot de passe) ;
 *   /rest/v1  : lecture et écriture de la ligne « progression » de la personne connectée.
 *
 * Ce fichier expose window.LemmeAccount :
 *   configured            vrai si js/config.js contient une adresse et une clé
 *   email()               adresse de la personne connectée, ou null
 *   requestCode(email)    envoie un code de connexion par e-mail
 *   verifyCode(email, c)  échange le code contre une session
 *   signOut()             ferme la session sur cet appareil
 *   adapter               adaptateur de synchronisation attendu par LemmeStore
 *
 * Les fonctions rejettent avec un objet Error dont le message, en français,
 * peut être affiché tel quel.
 */
(function (root) {
  'use strict';

  const cfg = root.LEMME_CONFIG || {};
  const BASE = String(cfg.supabaseUrl || '').replace(/\/+$/, '');
  const KEY = String(cfg.supabaseKey || '');
  const configured = !!(BASE && KEY);
  const SESSION_KEY = 'lemme.session.v1';

  /* ------------------------------------------------------------------ */
  /* Session : jetons gardés sur l'appareil                              */
  /* ------------------------------------------------------------------ */

  // { access_token, refresh_token, expires_at (secondes), user: { id, email } }
  let session = null;
  try { session = JSON.parse(root.localStorage.getItem(SESSION_KEY) || 'null'); } catch (e) { session = null; }

  function saveSession(s) {
    session = s;
    try {
      if (s) root.localStorage.setItem(SESSION_KEY, JSON.stringify(s));
      else root.localStorage.removeItem(SESSION_KEY);
    } catch (e) { /* stockage indisponible : la session ne durera que le temps de la page */ }
  }

  /** Transforme la réponse de connexion du service en session. */
  function toSession(body) {
    const now = Math.floor(Date.now() / 1000);
    return {
      access_token: body.access_token,
      refresh_token: body.refresh_token,
      expires_at: body.expires_at || now + (body.expires_in || 3600),
      user: { id: body.user && body.user.id, email: body.user && body.user.email }
    };
  }

  /* ------------------------------------------------------------------ */
  /* Appels HTTP                                                         */
  /* ------------------------------------------------------------------ */

  /**
   * Appelle le service. Rejette avec une erreur portant `status`
   * (0 = réseau injoignable) pour que l'appelant puisse choisir son message.
   */
  async function call(path, options) {
    const opt = options || {};
    const headers = Object.assign({ apikey: KEY, 'Content-Type': 'application/json' }, opt.headers || {});
    headers.Authorization = 'Bearer ' + (opt.token || KEY);
    let response;
    try {
      response = await fetch(BASE + path, {
        method: opt.method || 'GET',
        headers: headers,
        body: opt.body === undefined ? undefined : JSON.stringify(opt.body)
      });
    } catch (e) {
      const err = new Error('Connexion impossible. Vérifiez le réseau, puis réessayez.');
      err.status = 0;
      throw err;
    }
    const text = await response.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch (e) { data = null; }
    if (!response.ok) {
      const err = new Error('Le service a refusé la demande (erreur ' + response.status + ').');
      err.status = response.status;
      throw err;
    }
    return data;
  }

  /**
   * Renvoie un jeton d'accès valide, en le renouvelant s'il expire dans moins d'une minute.
   * Renvoie null si personne n'est connecté ou si la session n'est plus acceptée.
   */
  async function freshToken() {
    if (!session) return null;
    const now = Math.floor(Date.now() / 1000);
    if (session.expires_at - now > 60) return session.access_token;
    try {
      const body = await call('/auth/v1/token?grant_type=refresh_token', {
        method: 'POST', body: { refresh_token: session.refresh_token }
      });
      saveSession(toSession(body));
      return session.access_token;
    } catch (e) {
      // Session refusée par le service : il faudra se reconnecter. Une panne de réseau, elle, n'efface rien.
      if (e.status >= 400 && e.status < 500) saveSession(null);
      throw e;
    }
  }

  /* ------------------------------------------------------------------ */
  /* Connexion par code reçu par e-mail                                  */
  /* ------------------------------------------------------------------ */

  async function requestCode(email) {
    try {
      await call('/auth/v1/otp', { method: 'POST', body: { email: email, create_user: true } });
    } catch (e) {
      if (e.status === 429) throw new Error('Trop de demandes. Attendez une minute avant de redemander un code.');
      if (e.status >= 400 && e.status < 500) throw new Error('Adresse refusée. Vérifiez-la, puis réessayez.');
      throw e;
    }
  }

  async function verifyCode(email, code) {
    try {
      const body = await call('/auth/v1/verify', { method: 'POST', body: { type: 'email', email: email, token: code } });
      saveSession(toSession(body));
    } catch (e) {
      if (e.status >= 400 && e.status < 500) throw new Error('Code incorrect ou expiré. Vérifiez-le ou demandez-en un nouveau.');
      throw e;
    }
  }

  async function signOut() {
    const token = session && session.access_token;
    saveSession(null);
    // On prévient le service, sans bloquer : la session locale est déjà fermée.
    if (token) { try { await call('/auth/v1/logout', { method: 'POST', token: token }); } catch (e) { /* sans conséquence */ } }
  }

  /* ------------------------------------------------------------------ */
  /* Adaptateur de synchronisation (voir js/store.js)                    */
  /* ------------------------------------------------------------------ */

  const adapter = {
    /** Vrai si une personne est connectée sur cet appareil. */
    connect: async function () {
      if (!configured || !session) return false;
      try { return !!(await freshToken()); } catch (e) { return !!session; } // hors ligne : on réessaiera à la prochaine écriture
    },

    /** Progression enregistrée sur le compte, ou null s'il n'y en a pas encore. */
    pull: async function () {
      const token = await freshToken();
      if (!token) throw new Error('Session expirée.');
      const rows = await call('/rest/v1/progress?select=data&user_id=eq.' + encodeURIComponent(session.user.id), { token: token });
      return rows && rows.length ? rows[0].data : null;
    },

    /** Écrit la progression : crée la ligne ou remplace celle qui existe. */
    push: async function (progress) {
      const token = await freshToken();
      if (!token) throw new Error('Session expirée.');
      await call('/rest/v1/progress?on_conflict=user_id', {
        method: 'POST',
        token: token,
        headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
        body: { user_id: session.user.id, data: progress, updated_at: new Date().toISOString() }
      });
    }
  };

  root.LemmeAccount = {
    configured: configured,
    email: function () { return session && session.user ? session.user.email : null; },
    requestCode: requestCode,
    verifyCode: verifyCode,
    signOut: signOut,
    adapter: adapter
  };
})(window);
