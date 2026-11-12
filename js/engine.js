/*
 * Lemme — moteur de révision.
 *
 * Ce fichier ne contient que des fonctions pures (aucun accès au DOM, au
 * stockage ou au réseau). Il est chargé tel quel par le navigateur et par
 * les tests Node (tests/engine.test.js).
 *
 * Trois calculs y vivent, ceux qui ne doivent jamais régresser :
 *   1. l'espacement des révisions (variante de SM-2 à quatre notes) ;
 *   2. la série de jours consécutifs (flammes) et les gels ;
 *   3. la fusion de deux progressions (synchronisation entre appareils).
 */
(function (root, factory) {
  // Export double : module CommonJS pour les tests, variable globale pour la page.
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.LemmeEngine = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* Constantes de réglage                                               */
  /* ------------------------------------------------------------------ */

  /** Les quatre notes possibles après une réponse. */
  const GRADE = { RATE: 0, DIFFICILE: 1, BIEN: 2, FACILE: 3 };

  /** Bornes et valeurs initiales de l'algorithme d'espacement. */
  const EASE_START = 2.5; // facteur de facilité d'une question neuve
  const EASE_MIN = 1.3; // plancher : une question ne devient jamais « impossible »

  /** Points gagnés (une réponse rattrapée après erreur rapporte moitié moins). */
  const XP = { ANSWER: 10, CARD: 15, RETRY: 5, LESSON_BONUS: 20 };

  /** Série : un gel gagné tous les 7 jours validés, 2 en réserve au plus. */
  const FREEZE_EVERY = 7;
  const FREEZE_MAX = 2;

  /* ------------------------------------------------------------------ */
  /* Dates : on manipule des clés « AAAA-MM-JJ » dans le fuseau local    */
  /* ------------------------------------------------------------------ */

  /** Clé du jour local d'un objet Date (ex. « 2026-11-11 »). */
  function dayKey(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + d;
  }

  /** Convertit une clé en nombre de jours depuis l'époque (calcul en UTC, sans heure d'été). */
  function keyToDays(key) {
    const p = key.split('-').map(Number);
    return Math.round(Date.UTC(p[0], p[1] - 1, p[2]) / 86400000);
  }

  /** Opération inverse de keyToDays. */
  function daysToKey(days) {
    const d = new Date(days * 86400000);
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(d.getUTCDate()).padStart(2, '0');
    return y + '-' + m + '-' + dd;
  }

  /** Ajoute n jours (n peut être négatif) à une clé de jour. */
  function addDays(key, n) {
    return daysToKey(keyToDays(key) + n);
  }

  /** Nombre de jours de a vers b (positif si b est après a). */
  function diffDays(a, b) {
    return keyToDays(b) - keyToDays(a);
  }

  /* ------------------------------------------------------------------ */
  /* 1. Répétition espacée                                               */
  /* ------------------------------------------------------------------ */

  /**
   * État de révision d'une question jamais vue.
   *  ivl    : intervalle courant, en jours
   *  ease   : facteur de facilité
   *  reps   : réussites consécutives
   *  due    : clé du jour de la prochaine révision (null = jamais vue)
   *  lapses : nombre d'oublis
   *  last   : horodatage (ms) de la dernière réponse, sert à la fusion
   */
  function newCard() {
    return { ivl: 0, ease: EASE_START, reps: 0, due: null, lapses: 0, last: 0 };
  }

  /**
   * Applique une note à une question et renvoie son nouvel état
   * (l'état reçu n'est pas modifié).
   *
   *  Raté      : retour à zéro, échéance au lendemain, facilité − 0,20
   *  Difficile : intervalle × 1,2 (au moins 1 jour), facilité − 0,15
   *  Bien      : 1 jour, puis 3 jours, puis intervalle × facilité
   *  Facile    : 3 jours, puis intervalle × facilité × 1,3, facilité + 0,15
   *
   * @param {object} card   état courant (ou undefined pour une question neuve)
   * @param {number} grade  une valeur de GRADE
   * @param {string} today  clé du jour local
   * @param {number} now    horodatage en ms
   */
  function review(card, grade, today, now) {
    const c = Object.assign(newCard(), card || {});
    if (grade === GRADE.RATE) {
      c.reps = 0;
      c.lapses += 1;
      c.ivl = 1;
      c.ease = Math.max(EASE_MIN, c.ease - 0.2);
    } else if (grade === GRADE.DIFFICILE) {
      c.ivl = Math.max(1, Math.round(c.ivl * 1.2));
      c.ease = Math.max(EASE_MIN, c.ease - 0.15);
      c.reps += 1;
    } else if (grade === GRADE.BIEN) {
      if (c.reps === 0) c.ivl = 1;
      else if (c.reps === 1) c.ivl = 3;
      else c.ivl = Math.max(c.ivl + 1, Math.round(c.ivl * c.ease));
      c.reps += 1;
    } else {
      // FACILE
      if (c.reps === 0) c.ivl = 3;
      else c.ivl = Math.max(c.ivl + 1, Math.round(c.ivl * c.ease * 1.3));
      c.ease = c.ease + 0.15;
      c.reps += 1;
    }
    // On arrondit la facilité pour éviter les 2.3499999 dans les données stockées.
    c.ease = Math.round(c.ease * 100) / 100;
    c.due = addDays(today, c.ivl);
    c.last = now;
    return c;
  }

  /** Vrai si la question doit être révisée aujourd'hui (ou est en retard). */
  function isDue(card, today) {
    return !!(card && card.due && card.due <= today);
  }

  /**
   * Identifiants des questions à réviser, les plus en retard d'abord ;
   * à retard égal, celles qui ont été le plus souvent oubliées passent devant.
   */
  function dueIds(cards, today) {
    return Object.keys(cards)
      .filter(function (id) { return isDue(cards[id], today); })
      .sort(function (a, b) {
        const ca = cards[a], cb = cards[b];
        if (ca.due !== cb.due) return ca.due < cb.due ? -1 : 1;
        if (ca.lapses !== cb.lapses) return cb.lapses - ca.lapses;
        return a < b ? -1 : 1; // ordre stable et reproductible
      });
  }

  /**
   * Niveau de maîtrise d'une notion à partir des états de ses questions.
   *  'nouvelle'      : aucune question vue
   *  'apprentissage' : intervalle moyen < 7 jours
   *  'consolidee'    : de 7 à 30 jours
   *  'maitrisee'     : plus de 30 jours
   */
  function mastery(cardList) {
    const seen = cardList.filter(function (c) { return c && c.due; });
    if (seen.length === 0) return 'nouvelle';
    const avg = seen.reduce(function (s, c) { return s + c.ivl; }, 0) / seen.length;
    if (avg < 7) return 'apprentissage';
    if (avg <= 30) return 'consolidee';
    return 'maitrisee';
  }

  /* ------------------------------------------------------------------ */
  /* 2. Journal quotidien et série de jours                              */
  /* ------------------------------------------------------------------ */

  /**
   * Ajoute des points au journal du jour et renvoie un nouveau journal.
   * Chaque entrée mémorise l'objectif en vigueur ce jour-là : changer
   * d'objectif plus tard ne réécrit pas le passé.
   *
   * @param {object} log      { 'AAAA-MM-JJ': { xp, n, ok, goal } }
   * @param {string} today    clé du jour
   * @param {number} xp       points gagnés
   * @param {boolean|null} correct  true/false pour une réponse, null pour un bonus
   * @param {number} goal     objectif quotidien courant
   */
  function addXp(log, today, xp, correct, goal) {
    const out = Object.assign({}, log);
    const e = Object.assign({ xp: 0, n: 0, ok: 0, goal: goal }, out[today] || {});
    e.xp += xp;
    if (correct !== null && correct !== undefined) {
      e.n += 1;
      if (correct) e.ok += 1;
    }
    e.goal = goal;
    out[today] = e;
    return out;
  }

  /** Un jour est validé quand les points atteignent l'objectif de ce jour. */
  function dayValidated(entry, fallbackGoal) {
    if (!entry) return false;
    return entry.xp >= (entry.goal || fallbackGoal);
  }

  /**
   * Calcule la série à partir du seul journal quotidien. La série n'est
   * jamais stockée : elle reste donc cohérente après une fusion.
   *
   * Règles :
   *  - un jour validé ajoute 1 à la série ;
   *  - tous les 7 jours de série, un gel est gagné (2 en réserve au plus) ;
   *  - un jour manqué consomme un gel s'il y en a, sinon remet la série à 0 ;
   *  - aujourd'hui ne casse jamais la série tant que la journée n'est pas finie.
   *
   * @returns {{current:number, best:number, freezes:number, todayDone:boolean, frozenDays:string[]}}
   */
  function computeStreak(log, goal, today) {
    const keys = Object.keys(log || {}).sort();
    const res = { current: 0, best: 0, freezes: 0, todayDone: false, frozenDays: [] };
    if (keys.length === 0) return res;
    const start = keys[0];
    const span = diffDays(start, today);
    for (let i = 0; i <= span; i++) {
      const d = addDays(start, i);
      if (dayValidated(log[d], goal)) {
        res.current += 1;
        if (res.current % FREEZE_EVERY === 0) res.freezes = Math.min(FREEZE_MAX, res.freezes + 1);
        if (res.current > res.best) res.best = res.current;
        if (d === today) res.todayDone = true;
      } else if (d === today) {
        // Journée en cours : rien n'est encore perdu.
      } else if (res.current > 0 && res.freezes > 0) {
        res.freezes -= 1; // le gel protège ce jour manqué
        res.frozenDays.push(d);
      } else {
        res.current = 0;
      }
    }
    return res;
  }

  /* ------------------------------------------------------------------ */
  /* 3. Progression complète et fusion                                   */
  /* ------------------------------------------------------------------ */

  /** Progression d'un nouvel utilisateur. */
  function emptyProgress(now) {
    return {
      v: 1,
      cards: {}, // état de révision par identifiant de question
      log: {}, // journal quotidien
      lessons: {}, // leçons terminées : { id: horodatage }
      exercises: {}, // exercices terminés : { id: horodatage }
      settings: { goal: 100, updatedAt: 0 },
      createdAt: now || 0
    };
  }

  /**
   * Fusionne deux progressions (deux appareils d'un même compte).
   *  - question par question : la révision la plus récente l'emporte ;
   *  - jour par jour : on garde le maximum de points (jamais la somme,
   *    pour ne pas compter deux fois une séance déjà synchronisée) ;
   *  - leçons et exercices terminés : union ;
   *  - réglages : les plus récents.
   * La fonction est commutative et idempotente (voir les tests).
   */
  function mergeProgress(a, b) {
    if (!a) return b;
    if (!b) return a;
    const out = emptyProgress(Math.min(a.createdAt || Infinity, b.createdAt || Infinity));
    if (!isFinite(out.createdAt)) out.createdAt = 0;

    const ids = new Set(Object.keys(a.cards || {}).concat(Object.keys(b.cards || {})));
    ids.forEach(function (id) {
      const ca = (a.cards || {})[id], cb = (b.cards || {})[id];
      if (!ca) out.cards[id] = cb;
      else if (!cb) out.cards[id] = ca;
      else out.cards[id] = (cb.last || 0) > (ca.last || 0) ? cb : ca;
    });

    const days = new Set(Object.keys(a.log || {}).concat(Object.keys(b.log || {})));
    days.forEach(function (d) {
      const ea = (a.log || {})[d], eb = (b.log || {})[d];
      if (!ea) out.log[d] = eb;
      else if (!eb) out.log[d] = ea;
      else {
        out.log[d] = {
          xp: Math.max(ea.xp || 0, eb.xp || 0),
          n: Math.max(ea.n || 0, eb.n || 0),
          ok: Math.max(ea.ok || 0, eb.ok || 0),
          // Objectif le plus bas des deux : un jour validé sur un appareil le reste.
          goal: Math.min(ea.goal || Infinity, eb.goal || Infinity)
        };
        if (!isFinite(out.log[d].goal)) delete out.log[d].goal;
      }
    });

    // Leçons et exercices terminés : union, en gardant la date la plus ancienne.
    ['lessons', 'exercises'].forEach(function (key) {
      const ma = a[key] || {}, mb = b[key] || {};
      new Set(Object.keys(ma).concat(Object.keys(mb))).forEach(function (id) {
        out[key][id] = Math.min(ma[id] || Infinity, mb[id] || Infinity);
      });
    });

    const sa = a.settings || { updatedAt: 0 }, sb = b.settings || { updatedAt: 0 };
    out.settings = Object.assign({}, (sb.updatedAt || 0) > (sa.updatedAt || 0) ? sb : sa);
    return out;
  }

  /** Total des points et taux de réussite sur tout le journal. */
  function totals(log) {
    let xp = 0, n = 0, ok = 0;
    Object.keys(log || {}).forEach(function (d) {
      xp += log[d].xp || 0;
      n += log[d].n || 0;
      ok += log[d].ok || 0;
    });
    return { xp: xp, n: n, ok: ok, rate: n ? ok / n : null };
  }

  return {
    GRADE: GRADE, XP: XP, FREEZE_EVERY: FREEZE_EVERY, FREEZE_MAX: FREEZE_MAX,
    dayKey: dayKey, addDays: addDays, diffDays: diffDays,
    newCard: newCard, review: review, isDue: isDue, dueIds: dueIds, mastery: mastery,
    addXp: addXp, dayValidated: dayValidated, computeStreak: computeStreak,
    emptyProgress: emptyProgress, mergeProgress: mergeProgress, totals: totals
  };
});
