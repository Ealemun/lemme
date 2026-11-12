/*
 * Lemme — stockage local et synchronisation.
 *
 * Principe « local d'abord » :
 *   - chaque réponse est écrite tout de suite sur l'appareil (localStorage) ;
 *   - si un service de synchronisation est disponible, la progression locale
 *     est fusionnée avec la progression distante (LemmeEngine.mergeProgress)
 *     puis renvoyée.
 *
 * Le reste de l'application ne connaît que LemmeStore. Le service de
 * synchronisation est un « adaptateur » fourni de l'extérieur : un objet
 *     connect() -> Promise<boolean>     vrai si un compte est disponible
 *     pull()    -> Promise<object|null> progression distante
 *     push(p)   -> Promise<void>        écrit la progression
 * passé à LemmeStore.init(adaptateur), ou déposé dans window.LEMME_SYNC_ADAPTER
 * par un script chargé avant celui-ci. Sans adaptateur, tout reste sur l'appareil.
 */
(function (root) {
  'use strict';

  const E = root.LemmeEngine;
  const KEY = 'lemme.progress.v1';

  /* ------------------------------------------------------------------ */
  /* Stockage local                                                      */
  /* ------------------------------------------------------------------ */

  let memory = null; // repli si localStorage est indisponible (navigation privée, cadre restreint)

  function loadLocal() {
    try {
      const raw = root.localStorage.getItem(KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* stockage indisponible ou données illisibles : on repart de la mémoire */ }
    return memory;
  }

  function saveLocal(progress) {
    memory = progress;
    try {
      root.localStorage.setItem(KEY, JSON.stringify(progress));
      return true;
    } catch (e) {
      return false;
    }
  }

  function clearLocal() {
    memory = null;
    try { root.localStorage.removeItem(KEY); } catch (e) { /* rien à faire */ }
  }

  /* ------------------------------------------------------------------ */
  /* Façade utilisée par l'application                                   */
  /* ------------------------------------------------------------------ */

  const listeners = [];
  const state = {
    progress: null,
    // 'local'   : aucun compte disponible, tout reste sur l'appareil
    // 'syncing' : échange en cours
    // 'synced'  : progression identique sur le compte
    // 'error'   : dernier envoi refusé ou réseau absent (nouvel essai au prochain enregistrement)
    sync: 'local',
    localOk: true
  };
  let adapter = null;
  let writing = Promise.resolve(); // file d'attente : une seule écriture distante à la fois
  let timer = null;

  function emit() {
    listeners.forEach(function (fn) { fn(state); });
  }

  /** Charge la progression locale, puis tente la synchronisation sans bloquer l'affichage. */
  function init(customAdapter) {
    state.progress = loadLocal() || E.emptyProgress(Date.now());
    // Ordre de priorité : adaptateur passé en argument, adaptateur de l'hébergeur,
    // puis comptes par e-mail s'ils sont configurés (js/config.js).
    const account = root.LemmeAccount && root.LemmeAccount.configured ? root.LemmeAccount.adapter : null;
    const candidate = customAdapter || root.LEMME_SYNC_ADAPTER || account;
    if (!candidate) return state.progress; // aucun service : mode local uniquement
    candidate.connect().then(function (ok) {
      if (!ok) return;
      adapter = candidate;
      return syncNow();
    }).catch(function () {
      state.sync = adapter ? 'error' : 'local';
      emit();
    });
    return state.progress;
  }

  /** Récupère la progression distante, fusionne, enregistre des deux côtés. */
  function syncNow() {
    if (!adapter) return Promise.resolve();
    state.sync = 'syncing';
    emit();
    writing = writing.then(async function () {
      try {
        const remote = await adapter.pull();
        const merged = E.mergeProgress(state.progress, remote);
        state.progress = merged;
        state.localOk = saveLocal(merged);
        // On n'écrit à distance que si la fusion apporte quelque chose de nouveau.
        if (JSON.stringify(merged) !== JSON.stringify(remote)) await adapter.push(merged);
        state.sync = 'synced';
      } catch (e) {
        state.sync = 'error';
      }
      emit();
    });
    return writing;
  }

  /**
   * Enregistre une nouvelle progression : immédiatement sur l'appareil,
   * puis à distance après une courte pause (pour regrouper une rafale de réponses).
   */
  function save(progress) {
    state.progress = progress;
    state.localOk = saveLocal(progress);
    if (adapter) {
      clearTimeout(timer);
      timer = setTimeout(syncNow, 2500);
    }
    emit();
  }

  /** Efface la progression sur l'appareil et, s'il y en a un, sur le compte. */
  function reset() {
    clearLocal();
    state.progress = E.emptyProgress(Date.now());
    saveLocal(state.progress);
    if (adapter) {
      writing = writing.then(function () {
        return adapter.push(state.progress).then(
          function () { state.sync = 'synced'; emit(); },
          function () { state.sync = 'error'; emit(); }
        );
      });
    }
    emit();
  }

  /** Branche un service après coup (connexion à un compte) et fusionne tout de suite. */
  function connect(newAdapter) {
    adapter = newAdapter;
    return syncNow();
  }

  /** Débranche le service (déconnexion) : la progression reste sur l'appareil. */
  function disconnect() {
    adapter = null;
    clearTimeout(timer);
    state.sync = 'local';
    emit();
  }

  root.LemmeStore = {
    init: init,
    connect: connect,
    disconnect: disconnect,
    save: save,
    reset: reset,
    syncNow: syncNow,
    get: function () { return state.progress; },
    status: function () { return { sync: state.sync, localOk: state.localOk, account: !!adapter }; },
    onChange: function (fn) { listeners.push(fn); }
  };
})(window);
