/*
 * Lemme — interface.
 *
 * Organisation du fichier :
 *   1. Accès au contenu et à la progression
 *   2. Séances (file de questions, correction, points)
 *   3. Rendu des écrans (accueil, parcours, bibliothèque, profil)
 *   4. Rendu des vues plein écran (leçon, fiche, séance, bilan)
 *   5. Gestion des clics et démarrage
 *
 * L'interface est redessinée entièrement à chaque changement d'état :
 * l'état vit dans `ui` (affichage) et dans LemmeStore (progression).
 */
(function () {
  'use strict';

  const E = window.LemmeEngine;
  const T = window.LemmeText;
  const Store = window.LemmeStore;
  const C = window.LEMME_CONTENT;
  const G = E.GRADE;

  /* ================================================================== */
  /* 1. Contenu et progression                                           */
  /* ================================================================== */

  // Index pour retrouver une question ou une notion par son identifiant.
  const QUESTIONS = {};
  C.questions.forEach(function (q) { QUESTIONS[q.id] = q; });
  const NOTIONS = {};
  C.notions.forEach(function (n) { NOTIONS[n.id] = n; });
  const SOURCES = {};
  C.sources.forEach(function (s) { SOURCES[s.id] = s; });
  const EXERCISES = {};
  C.exercises.forEach(function (e) { EXERCISES[e.id] = e; });

  /** État d'affichage (rien ici n'est enregistré). */
  const ui = {
    tab: 'home', // onglet courant : home | path | library | profile
    overlay: null, // vue plein écran : {type:'lesson'|'notion'|'session'|'summary', id?}
    back: [], // vues plein écran précédentes, pour le bouton retour (fiche ouverte depuis une leçon)
    session: null, // séance en cours
    search: '', // filtre de la bibliothèque
    confirmReset: false, // demande de confirmation avant effacement
    copied: false // retour visuel après « Copier mes données »
  };

  const today = function () { return E.dayKey(new Date()); };
  const progress = function () {
    const p = Store.get();
    if (!p.exercises) p.exercises = {}; // progression enregistrée par une version antérieure
    if (!p.lessons) p.lessons = {};
    return p;
  };
  const goal = function () { return (progress().settings && progress().settings.goal) || 100; };

  /** Questions de cours d'une leçon (les étapes d'exercices sont comptées à part). */
  const lessonQuestions = function (lessonId) {
    return C.questions.filter(function (q) { return q.lesson === lessonId && !q.exercise; });
  };
  const lessonExercises = function (lessonId) {
    return C.exercises.filter(function (e) { return e.lesson === lessonId; });
  };

  /** Libellé d'une leçon : « Prérequis » pour la leçon facultative, « Leçon k » sinon. */
  function lessonLabel(lesson) {
    if (lesson.optional) return 'Prérequis';
    const rank = C.lessons.filter(function (l) { return !l.optional; }).indexOf(lesson) + 1;
    return 'Leçon ' + rank;
  }
  const lessonNotions = function (lessonId) {
    return C.notions.filter(function (n) { return n.lesson === lessonId; });
  };

  /**
   * État d'une leçon : 'done', 'open' (disponible) ou 'locked'.
   * Une leçon facultative est toujours disponible et ne bloque pas la suivante :
   * une leçon s'ouvre quand la leçon obligatoire qui la précède est terminée.
   */
  function lessonState(index) {
    const p = progress();
    const lesson = C.lessons[index];
    if (p.lessons[lesson.id]) return 'done';
    if (lesson.optional) return 'open';
    for (let i = index - 1; i >= 0; i--) {
      if (!C.lessons[i].optional) return p.lessons[C.lessons[i].id] ? 'open' : 'locked';
    }
    return 'open';
  }

  /** Première leçon obligatoire disponible et non terminée (null si tout est fait). */
  function nextLesson() {
    for (let i = 0; i < C.lessons.length; i++) {
      if (!C.lessons[i].optional && lessonState(i) === 'open') return { lesson: C.lessons[i], index: i };
    }
    return null;
  }

  /**
   * État d'un exercice : 'done', 'open' ou 'locked'.
   * Progression imposée : les questions de la leçon d'abord, puis les exercices
   * dans l'ordre (niveau croissant).
   */
  function exerciseState(ex) {
    const p = progress();
    if (p.exercises[ex.id]) return 'done';
    if (!p.lessons[ex.lesson]) return 'locked';
    const list = lessonExercises(ex.lesson);
    const k = list.indexOf(ex);
    return k === 0 || p.exercises[list[k - 1].id] ? 'open' : 'locked';
  }

  /** Premier exercice disponible et non fait, dans l'ordre du parcours (null s'il n'y en a pas). */
  function nextExercise() {
    for (let i = 0; i < C.exercises.length; i++) {
      if (exerciseState(C.exercises[i]) === 'open') return C.exercises[i];
    }
    return null;
  }

  const LEVEL_LABEL = { 1: 'Niveau 1 · application directe', 2: 'Niveau 2 · plusieurs notions', 3: 'Niveau 3 · type concours' };

  /** Questions à réviser aujourd'hui (on ignore les identifiants disparus du contenu). */
  function dueQuestionIds() {
    return E.dueIds(progress().cards, today()).filter(function (id) { return QUESTIONS[id]; });
  }

  /** Niveau de maîtrise d'une notion. */
  function notionMastery(notionId) {
    const cards = C.questions
      .filter(function (q) { return q.notion === notionId; })
      .map(function (q) { return progress().cards[q.id]; });
    return E.mastery(cards);
  }

  const MASTERY_LABEL = {
    nouvelle: 'À découvrir',
    apprentissage: 'En apprentissage',
    consolidee: 'Consolidée',
    maitrisee: 'Maîtrisée'
  };

  const TAG_LABEL = {
    hypotheses: 'Hypothèses',
    piege: 'Piège',
    cadre: 'Cadre',
    notation: 'Notation',
    demo: 'Démonstration',
    application: 'Application',
    restitution: 'Restitution'
  };

  /* ================================================================== */
  /* 2. Séances                                                          */
  /* ================================================================== */

  /** Mélange une liste (Fisher-Yates) sans modifier l'original. */
  function shuffle(list) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  const range = function (n) { return Array.from({ length: n }, function (_, i) { return i; }); };

  /** Prépare l'état d'affichage de la question courante (ordre des options tiré au hasard). */
  function prepareCurrent(s) {
    const item = s.queue[s.pos];
    const q = QUESTIONS[item.id];
    const cur = { answered: false, correct: null, grade: null };
    if (q.type === 'mcq') { cur.order = shuffle(range(q.options.length)); cur.picked = null; }
    if (q.type === 'multi') { cur.order = shuffle(range(q.options.length)); cur.picked = []; }
    if (q.type === 'tf') { cur.picked = null; }
    if (q.type === 'order') {
      // On retire jusqu'à obtenir un ordre différent de la solution.
      let pool = shuffle(range(q.steps.length));
      while (pool.every(function (v, i) { return v === i; })) pool = shuffle(pool);
      cur.pool = pool;
      cur.chosen = [];
    }
    if (q.type === 'card') { cur.revealed = false; }
    s.cur = cur;
  }

  /**
   * Démarre une séance.
   * @param {'lesson'|'review'|'pitfalls'|'exercise'|'notion'} mode
   * @param {string[]} ids      identifiants des questions, dans l'ordre
   * @param {string}  [targetId] leçon (mode 'lesson') ou exercice (mode 'exercise') concerné
   */
  function startSession(mode, ids, targetId) {
    if (!ids.length) return;
    ui.back = [];
    ui.session = {
      mode: mode,
      lessonId: mode === 'lesson' ? targetId : null,
      exerciseId: mode === 'exercise' ? targetId : null,
      queue: ids.map(function (id) { return { id: id, tries: 0 }; }),
      pos: 0,
      firstTotal: ids.length, // nombre de questions hors rattrapages
      firstOk: 0, // réussites du premier coup
      xp: 0,
      missed: [], // notions à revoir, pour le bilan
      cur: null
    };
    prepareCurrent(ui.session);
    ui.overlay = { type: 'session' };
    render();
  }

  /**
   * Enregistre la réponse à la question courante.
   * @param {boolean} correct  réponse juste ?
   * @param {number}  grade    note transmise au moteur d'espacement
   */
  function recordAnswer(correct, grade) {
    const s = ui.session;
    const item = s.queue[s.pos];
    const q = QUESTIONS[item.id];
    const p = JSON.parse(JSON.stringify(progress())); // copie de travail
    const first = item.tries === 0;
    let xp = 0;

    if (first) {
      // Seule la première tentative modifie le calendrier de révision.
      p.cards[q.id] = E.review(p.cards[q.id], grade, today(), Date.now());
      if (correct) {
        xp = q.type === 'card' ? E.XP.CARD : E.XP.ANSWER;
        s.firstOk += 1;
      } else if (s.missed.indexOf(q.notion) === -1) {
        s.missed.push(q.notion);
      }
      p.log = E.addXp(p.log, today(), xp, correct, goal());
    } else if (correct) {
      // Rattrapage réussi : moitié des points, sans compter dans le taux de réussite.
      xp = E.XP.RETRY;
      p.log = E.addXp(p.log, today(), xp, null, goal());
    }

    // Une erreur revient en fin de séance (deux rattrapages au plus par question).
    if (!correct && item.tries < 2) s.queue.push({ id: q.id, tries: item.tries + 1 });

    s.xp += xp;
    s.cur.answered = true;
    s.cur.correct = correct;
    s.cur.grade = grade;
    Store.save(p);
  }

  /** Passe à la question suivante, ou termine la séance. */
  function advance() {
    const s = ui.session;
    if (s.pos + 1 < s.queue.length) {
      s.pos += 1;
      prepareCurrent(s);
      render();
      return;
    }
    // Fin de séance : une leçon terminée pour la première fois rapporte un bonus.
    if (s.mode === 'lesson' && !progress().lessons[s.lessonId]) {
      const p = JSON.parse(JSON.stringify(progress()));
      p.lessons[s.lessonId] = Date.now();
      p.log = E.addXp(p.log, today(), E.XP.LESSON_BONUS, null, goal());
      s.xp += E.XP.LESSON_BONUS;
      s.bonus = 'lesson';
      Store.save(p);
    }
    // Même principe pour un exercice terminé pour la première fois.
    if (s.mode === 'exercise' && !progress().exercises[s.exerciseId]) {
      const p = JSON.parse(JSON.stringify(progress()));
      p.exercises[s.exerciseId] = Date.now();
      p.log = E.addXp(p.log, today(), E.XP.LESSON_BONUS, null, goal());
      s.xp += E.XP.LESSON_BONUS;
      s.bonus = 'exercise';
      Store.save(p);
    }
    ui.overlay = { type: 'summary' };
    render();
  }

  /** Corrige la question courante d'après les choix faits à l'écran. */
  function checkCurrent() {
    const s = ui.session;
    const q = QUESTIONS[s.queue[s.pos].id];
    const cur = s.cur;
    let correct = false;
    if (q.type === 'mcq') correct = cur.picked === q.answer;
    if (q.type === 'multi') {
      const a = cur.picked.slice().sort().join(',');
      const b = q.answers.slice().sort().join(',');
      correct = a === b;
    }
    if (q.type === 'tf') correct = cur.picked === q.answer;
    if (q.type === 'order') correct = cur.chosen.every(function (v, i) { return v === i; });
    recordAnswer(correct, correct ? G.BIEN : G.RATE);
    render();
  }

  /* ================================================================== */
  /* 3. Écrans à onglets                                                 */
  /* ================================================================== */

  /* --- Petites icônes en SVG (tracés simples, couleur héritée du texte) --- */
  const ICON = {
    flame: '<svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true"><path fill="currentColor" d="M12 2c.6 3.2 2.3 4.9 4 6.800C17.800 10.800 19 12.800 19 15.200 19 19 15.900 22 12 22s-7-3-7-6.800c0-2.300 1-4.200 2.500-5.700.2 1.600.9 2.700 2 3.300C9.200 9.400 10 5.200 12 2z"/></svg>',
    snow: '<svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M12 3v18M4.200 7.500l15.600 9M19.800 7.500l-15.600 9"/></svg>',
    back: '<svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.200" stroke-linecap="round" stroke-linejoin="round" d="M15 5l-7 7 7 7"/></svg>',
    close: '<svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.200" stroke-linecap="round" d="M6 6l12 12M18 6L6 18"/></svg>',
    check: '<svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.600" stroke-linecap="round" stroke-linejoin="round" d="M5 12.500l4.500 4.500L19 7.500"/></svg>',
    lock: '<svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M7 11V8a5 5 0 0110 0v3M6 11h12v9H6z"/></svg>'
  };

  const WEEKDAYS = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

  /** Clé de jour -> objet Date à midi local (pour lire le jour de la semaine). */
  function keyToDate(key) {
    const p = key.split('-').map(Number);
    return new Date(p[0], p[1] - 1, p[2], 12);
  }

  function plural(n, one, many) { return n + ' ' + (n > 1 ? many : one); }

  /* --- Accueil --- */
  function renderHome() {
    const p = progress();
    const t = today();
    const st = E.computeStreak(p.log, goal(), t);
    const xpToday = (p.log[t] && p.log[t].xp) || 0;
    const pct = Math.min(100, Math.round((xpToday / goal()) * 100));
    const due = dueQuestionIds();
    const next = nextLesson();
    const mainLessons = C.lessons.filter(function (l) { return !l.optional; });
    const doneCount = mainLessons.filter(function (l) { return p.lessons[l.id]; }).length;
    const nextEx = nextExercise();
    const exDone = C.exercises.filter(function (e) { return p.exercises[e.id]; }).length;

    // Bandeau des 7 derniers jours.
    let week = '';
    for (let i = 6; i >= 0; i--) {
      const d = E.addDays(t, -i);
      const ok = E.dayValidated(p.log[d], goal());
      const frozen = st.frozenDays.indexOf(d) !== -1;
      const cls = ok ? 'ok' : frozen ? 'frozen' : '';
      week += '<li class="day ' + cls + (i === 0 ? ' is-today' : '') + '">' +
        '<span class="dot">' + (ok ? ICON.check : frozen ? ICON.snow : '') + '</span>' +
        '<span class="wd">' + WEEKDAYS[keyToDate(d).getDay()] + '</span></li>';
    }

    // Message d'état de la journée.
    let status;
    if (st.todayDone) status = 'Objectif du jour atteint. Série protégée.';
    else if (st.current > 0) status = 'Encore ' + (goal() - xpToday) + ' points pour prolonger la série.';
    else status = 'Atteignez ' + goal() + ' points pour allumer la série.';

    // Action principale : les révisions dues passent avant les nouveautés.
    let actions = '';
    if (due.length) {
      actions += '<button class="btn primary" data-act="start-review">' +
        '<span>Réviser</span><small>' + plural(due.length, 'question due', 'questions dues') + '</small></button>';
    }
    if (next) {
      actions += '<button class="btn ' + (due.length ? 'ghost' : 'primary') + '" data-act="open-lesson" data-id="' + next.lesson.id + '">' +
        '<span>' + lessonLabel(next.lesson) + ' · ' + T.esc(next.lesson.title) + '</span><small>Découvrir, puis ' +
        lessonQuestions(next.lesson.id).length + ' questions</small></button>';
    }
    if (nextEx) {
      actions += '<button class="btn ' + (due.length || next ? 'ghost' : 'primary') + '" data-act="start-exercise" data-id="' + nextEx.id + '">' +
        '<span>Exercice · ' + T.esc(nextEx.title) + '</span><small>' + LEVEL_LABEL[nextEx.level] + '</small></button>';
    }
    if (!due.length && !next && !nextEx) {
      actions += '<p class="quiet">Tout est à jour. Les prochaines révisions arriveront à leur échéance ; vous pouvez retravailler les pièges depuis la bibliothèque.</p>';
    }

    // Répartition des notions par niveau de maîtrise.
    const counts = { nouvelle: 0, apprentissage: 0, consolidee: 0, maitrisee: 0 };
    C.notions.forEach(function (n) { counts[notionMastery(n.id)] += 1; });
    const bar = ['maitrisee', 'consolidee', 'apprentissage', 'nouvelle'].map(function (k) {
      return counts[k] ? '<span class="seg m-' + k + '" style="flex:' + counts[k] + '" title="' + MASTERY_LABEL[k] + ' : ' + counts[k] + '"></span>' : '';
    }).join('');
    const legend = ['maitrisee', 'consolidee', 'apprentissage', 'nouvelle'].map(function (k) {
      return '<li><span class="key m-' + k + '"></span>' + MASTERY_LABEL[k] + ' <b>' + counts[k] + '</b></li>';
    }).join('');

    return '' +
      '<section class="panel today">' +
        '<div class="today-head">' +
          '<div class="streak ' + (st.current > 0 ? 'lit' : '') + '">' + ICON.flame +
            '<span class="n">' + st.current + '</span>' +
            '<span class="l">' + (st.current > 1 ? 'jours de série' : 'jour de série') + '</span></div>' +
          '<div class="freezes" title="Un gel protège un jour manqué">' + ICON.snow +
            '<span>' + plural(st.freezes, 'gel', 'gels') + '</span></div>' +
        '</div>' +
        '<div class="goal" role="progressbar" aria-valuemin="0" aria-valuemax="' + goal() + '" aria-valuenow="' + Math.min(xpToday, goal()) + '" aria-label="Objectif du jour">' +
          '<span style="width:' + pct + '%"></span></div>' +
        '<p class="goal-text"><b>' + xpToday + '</b> / ' + goal() + ' points aujourd\'hui</p>' +
        '<ul class="week">' + week + '</ul>' +
        '<p class="status">' + status + '</p>' +
      '</section>' +
      '<section class="actions">' + actions + '</section>' +
      '<section class="panel">' +
        '<h2>' + T.esc(C.title) + '</h2>' +
        '<p class="meta">' + doneCount + ' leçon' + (doneCount > 1 ? 's' : '') + ' sur ' + mainLessons.length + ' terminée' + (doneCount > 1 ? 's' : '') +
          ' · ' + exDone + ' exercice' + (exDone > 1 ? 's' : '') + ' sur ' + C.exercises.length + ' · ' + C.notions.length + ' notions</p>' +
        '<div class="mastery-bar">' + bar + '</div>' +
        '<ul class="legend">' + legend + '</ul>' +
      '</section>';
  }

  /* --- Parcours --- */
  function renderPath() {
    const items = C.lessons.map(function (l, i) {
      const state = lessonState(i);
      const nQ = lessonQuestions(l.id).length;
      const nN = lessonNotions(l.id).length;
      const exs = lessonExercises(l.id);
      const exOk = exs.filter(function (e) { return progress().exercises[e.id]; }).length;
      const label = lessonLabel(l);
      const mark = state === 'done' ? ICON.check : state === 'locked' ? ICON.lock : l.optional ? 'P' : label.replace('Leçon ', '');
      const hint = state === 'done' ? 'Terminée' + (exs.length ? ' · exercices ' + exOk + ' / ' + exs.length : ' · revoir la leçon')
        : state === 'open' ? (l.optional ? 'Facultatif · ' : '') + plural(nN, 'notion', 'notions') + ' · ' + nQ + ' questions' +
          (exs.length ? ' · ' + plural(exs.length, 'exercice', 'exercices') : '')
        : 'Terminez la leçon précédente';
      return '<li class="step ' + state + '">' +
        '<button class="step-btn" data-act="open-lesson" data-id="' + l.id + '"' + (state === 'locked' ? ' disabled' : '') + '>' +
          '<span class="node">' + mark + '</span>' +
          '<span class="step-body"><span class="step-title">' + (l.optional ? '' : label + ' · ') + T.esc(l.title) + '</span>' +
          '<span class="step-blurb">' + T.esc(l.blurb) + '</span>' +
          '<span class="step-hint">' + hint + '</span></span>' +
        '</button></li>';
    }).join('');

    const sources = C.sources.map(function (s) {
      return '<li><a href="' + T.esc(s.url) + '" target="_blank" rel="noopener">' + T.esc(s.label) + '</a></li>';
    }).join('');

    return '' +
      '<section class="panel">' +
        '<p class="eyebrow">Parcours MP et agrégation · chapitre pilote</p>' +
        '<h2>' + T.esc(C.title) + '</h2>' +
        '<p class="frame">' + T.html(C.frame) + '</p>' +
      '</section>' +
      '<ol class="steps">' + items + '</ol>' +
      '<section class="panel">' +
        '<h3>Sources du chapitre</h3>' +
        '<ul class="sources">' + sources + '</ul>' +
        '<p class="meta">Contenu en cours de relecture par un enseignant.</p>' +
      '</section>';
  }

  /* --- Bibliothèque --- */

  /** Texte en minuscules sans accents, pour une recherche tolérante. */
  function fold(s) {
    return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  function renderLibraryList() {
    const needle = fold(ui.search.trim());
    let html = '';
    C.lessons.forEach(function (l) {
      const rows = lessonNotions(l.id).filter(function (n) {
        return !needle || fold(n.title + ' ' + n.kind).indexOf(needle) !== -1;
      }).map(function (n) {
        const m = notionMastery(n.id);
        return '<li><button class="row" data-act="open-notion" data-id="' + n.id + '">' +
          '<span class="row-main"><span class="kind">' + T.esc(n.kind) +
            (n.level === 'agreg' ? ' · agrégation' : '') + '</span>' +
          '<span class="row-title">' + T.html(n.title) + '</span></span>' +
          '<span class="pill m-' + m + '">' + MASTERY_LABEL[m] + '</span></button></li>';
      }).join('');
      if (rows) html += '<h3 class="group">' + (l.optional ? '' : lessonLabel(l) + ' · ') + T.esc(l.title) + '</h3><ul class="rows">' + rows + '</ul>';
    });
    return html || '<p class="quiet">Aucune notion ne correspond à cette recherche.</p>';
  }

  /** Questions « piège » ou « cadre » déjà rencontrées, pour une révision ciblée. */
  function seenPitfallIds() {
    return C.questions.filter(function (q) {
      return (q.tag === 'piege' || q.tag === 'cadre') && progress().cards[q.id];
    }).map(function (q) { return q.id; });
  }

  function renderLibrary() {
    const pit = seenPitfallIds();
    return '' +
      '<section class="panel">' +
        '<label class="search-label" for="lib-search">Rechercher une notion</label>' +
        '<input id="lib-search" class="search" type="search" placeholder="Cayley-Hamilton, nilpotent…" value="' + T.esc(ui.search) + '" autocomplete="off">' +
        (pit.length
          ? '<button class="btn ghost" data-act="start-pitfalls"><span>Retravailler les pièges</span><small>' +
            plural(pit.length, 'question déjà vue', 'questions déjà vues') + '</small></button>'
          : '<p class="quiet">Les pièges rencontrés en leçon pourront être retravaillés ici.</p>') +
      '</section>' +
      '<div id="lib-list">' + renderLibraryList() + '</div>';
  }

  /* --- Profil --- */
  function renderProfile() {
    const p = progress();
    const t = today();
    const st = E.computeStreak(p.log, goal(), t);
    const tot = E.totals(p.log);
    const seen = Object.keys(p.cards).filter(function (id) { return QUESTIONS[id]; }).length;
    const sync = Store.status();

    // Calendrier des 5 dernières semaines, aligné sur le lundi.
    const dow = (keyToDate(t).getDay() + 6) % 7; // 0 = lundi
    let cells = '';
    for (let i = 28 + dow; i >= dow - 6; i--) {
      const d = E.addDays(t, -i);
      if (i < 0) { cells += '<span class="cell future"></span>'; continue; }
      const ok = E.dayValidated(p.log[d], goal());
      const some = p.log[d] && p.log[d].xp > 0;
      const frozen = st.frozenDays.indexOf(d) !== -1;
      cells += '<span class="cell ' + (ok ? 'ok' : frozen ? 'frozen' : some ? 'some' : '') + (i === 0 ? ' is-today' : '') +
        '" title="' + d + ' : ' + ((p.log[d] && p.log[d].xp) || 0) + ' points"></span>';
    }

    const goals = [50, 100, 200].map(function (g) {
      const label = g === 50 ? '5 min' : g === 100 ? '10 min' : '20 min';
      return '<button class="seg-btn' + (goal() === g ? ' on' : '') + '" data-act="set-goal" data-goal="' + g + '" aria-pressed="' + (goal() === g) + '">' +
        '<b>' + g + '</b><small>points · ' + label + '</small></button>';
    }).join('');

    const syncText = {
      local: 'Progression enregistrée sur cet appareil uniquement. Aucun compte n\'est disponible dans cette vue.',
      syncing: 'Synchronisation en cours…',
      synced: 'Progression synchronisée avec votre compte.',
      error: 'Synchronisation impossible pour le moment. La progression reste enregistrée sur cet appareil et sera renvoyée au prochain enregistrement.'
    }[sync.sync];

    return '' +
      '<section class="panel">' +
        '<h2>Statistiques</h2>' +
        '<dl class="stats">' +
          '<div><dt>Série en cours</dt><dd>' + st.current + '</dd></div>' +
          '<div><dt>Meilleure série</dt><dd>' + st.best + '</dd></div>' +
          '<div><dt>Points</dt><dd>' + tot.xp + '</dd></div>' +
          '<div><dt>Réussite</dt><dd>' + (tot.rate === null ? '–' : Math.round(tot.rate * 100) + ' %') + '</dd></div>' +
          '<div><dt>Questions vues</dt><dd>' + seen + ' / ' + C.questions.length + '</dd></div>' +
          '<div><dt>Gels en réserve</dt><dd>' + st.freezes + '</dd></div>' +
        '</dl>' +
        '<h3>Cinq dernières semaines</h3>' +
        '<div class="cal-head"><span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span><span>D</span></div>' +
        '<div class="cal">' + cells + '</div>' +
      '</section>' +
      '<section class="panel">' +
        '<h2>Objectif quotidien</h2>' +
        '<div class="segmented">' + goals + '</div>' +
        '<p class="quiet">Un jour compte pour la série quand l\'objectif est atteint. Un gel est gagné tous les ' + E.FREEZE_EVERY + ' jours de série (' + E.FREEZE_MAX + ' en réserve au plus).</p>' +
      '</section>' +
      '<section class="panel">' +
        '<h2>Compte et données</h2>' +
        '<p class="sync s-' + sync.sync + '"><span class="sync-dot"></span>' + syncText + '</p>' +
        (sync.localOk ? '' : '<p class="warn-text">Le stockage de ce navigateur est indisponible : la progression sera perdue à la fermeture de la page.</p>') +
        '<div class="stack">' +
          '<button class="btn ghost" data-act="copy-data"><span>' + (ui.copied ? 'Données copiées' : 'Copier mes données') + '</span><small>Export au format JSON dans le presse-papiers</small></button>' +
          (ui.confirmReset
            ? '<div class="confirm"><p>Effacer toute la progression, sur cet appareil et sur le compte ? Cette action est définitive.</p>' +
              '<div class="confirm-row"><button class="btn danger" data-act="reset-yes"><span>Effacer</span></button>' +
              '<button class="btn ghost" data-act="reset-no"><span>Annuler</span></button></div></div>'
            : '<button class="btn ghost danger-text" data-act="reset-ask"><span>Effacer ma progression</span></button>') +
        '</div>' +
      '</section>';
  }

  /* ================================================================== */
  /* 4. Vues plein écran                                                 */
  /* ================================================================== */

  /** Bloc titré d'une fiche, affiché seulement s'il a du contenu. */
  function ficheList(title, items, cls) {
    if (!items || !items.length) return '';
    return '<div class="fiche-sec ' + (cls || '') + '"><h4>' + title + '</h4><ul>' +
      items.map(function (t) { return '<li>' + T.html(t) + '</li>'; }).join('') + '</ul></div>';
  }

  /** Fiche de découverte d'une notion. */
  function renderFiche(n) {
    const badges = [];
    if (n.status === 'hors-programme') badges.push('<span class="badge hp">Hors programme en MP</span>');
    if (n.level === 'agreg') badges.push('<span class="badge ag">Agrégation</span>');
    if (n.proof === 'non-exigible') badges.push('<span class="badge">Démonstration non exigible en MP</span>');
    const src = SOURCES[n.source];
    const m = notionMastery(n.id);
    const nQ = C.questions.filter(function (q) { return q.notion === n.id; }).length;

    // Prérequis : chaque pastille ouvre la fiche correspondante, avec son niveau de maîtrise.
    const prereqs = (n.prereqs || []).map(function (id) {
      const pm = notionMastery(id);
      return '<button class="prereq m-' + pm + '" data-act="open-notion" data-id="' + id + '">' +
        '<span class="prereq-title">' + T.html(NOTIONS[id].title) + '</span>' +
        '<span class="prereq-state">' + MASTERY_LABEL[pm] + '</span></button>';
    }).join('');

    // Démonstration complète, repliée par défaut pour laisser chercher avant de lire.
    const proof = n.proofSteps && n.proofSteps.length
      ? '<details class="proof"><summary>Démonstration</summary><ol>' +
        n.proofSteps.map(function (t) { return '<li>' + T.html(t) + '</li>'; }).join('') + '</ol></details>'
      : '';

    return '<article class="fiche">' +
      '<p class="kind">' + T.esc(n.kind) + '</p>' +
      '<h3>' + T.html(n.title) + '</h3>' +
      (badges.length ? '<p class="badges">' + badges.join('') + '</p>' : '') +
      '<div class="statement">' + T.html(n.statement) + '</div>' +
      ficheList('Hypothèses à ne pas oublier', n.hypotheses, 'hyp') +
      (n.idea ? '<div class="fiche-sec"><h4>Idée clé</h4><p>' + T.html(n.idea) + '</p></div>' : '') +
      proof +
      ficheList('Exemples', n.examples, 'ex') +
      ficheList('Contre-exemples', n.counterexamples) +
      ficheList('Pièges', n.pitfalls, 'pit') +
      ficheList('Notations', n.notations) +
      (prereqs ? '<div class="fiche-sec"><h4>Prérequis à maîtriser</h4><div class="prereqs">' + prereqs + '</div></div>' : '') +
      '<button class="btn ghost" data-act="start-notion" data-id="' + n.id + '"><span>Retravailler cette notion</span>' +
        '<small>' + plural(nQ, 'question', 'questions') + ' · ' + MASTERY_LABEL[m].toLowerCase() + '</small></button>' +
      (src ? '<p class="src">Source : <a href="' + T.esc(src.url) + '" target="_blank" rel="noopener">' + T.esc(src.label) + '</a></p>' : '') +
      '</article>';
  }

  /** En-tête commun aux vues plein écran. */
  function overlayHead(title, act, icon) {
    return '<header class="ov-head"><button class="icon-btn" data-act="' + act + '" aria-label="Retour">' + icon + '</button>' +
      '<h2>' + title + '</h2></header>';
  }

  function renderLessonOverlay(lessonId) {
    const idx = C.lessons.findIndex(function (l) { return l.id === lessonId; });
    const l = C.lessons[idx];
    const n = lessonQuestions(lessonId).length;
    const done = !!progress().lessons[lessonId];
    // Exercices de la leçon, par niveau croissant, débloqués l'un après l'autre.
    const exRows = lessonExercises(lessonId).map(function (ex) {
      const st = exerciseState(ex);
      const pill = st === 'done' ? '<span class="pill m-maitrisee">Fait</span>'
        : st === 'open' ? '<span class="pill m-consolidee">Disponible</span>'
        : '<span class="pill">' + (done ? 'Après le précédent' : 'Après les questions') + '</span>';
      return '<li><button class="row" data-act="start-exercise" data-id="' + ex.id + '"' + (st === 'locked' ? ' disabled' : '') + '>' +
        '<span class="row-main"><span class="kind">' + LEVEL_LABEL[ex.level] + '</span>' +
        '<span class="row-title">' + T.html(ex.title) + '</span>' +
        '<span class="row-sub">' + ex.steps.length + ' étapes' + (ex.origin ? ' · ' + T.esc(ex.origin) : '') + '</span></span>' + pill + '</button></li>';
    }).join('');

    return overlayHead((l.optional ? '' : lessonLabel(l) + ' · ') + T.esc(l.title), 'close-overlay', ICON.back) +
      '<div class="ov-body">' +
        '<p class="frame">' + T.html(C.frame) + '</p>' +
        lessonNotions(lessonId).map(renderFiche).join('') +
        (exRows ? '<h3 class="group">Exercices d\'application</h3><ul class="rows">' + exRows + '</ul>' : '') +
      '</div>' +
      '<footer class="ov-foot"><button class="btn primary" data-act="start-lesson" data-id="' + lessonId + '">' +
        '<span>' + (done ? 'Refaire les questions' : 'Passer aux questions') + '</span><small>' + n + ' questions</small></button></footer>';
  }

  function renderNotionOverlay(notionId) {
    const n = NOTIONS[notionId];
    return overlayHead('Fiche', 'close-overlay', ICON.back) +
      '<div class="ov-body">' + renderFiche(n) + '</div>';
  }

  /* --- Séance --- */

  /** Zone de réponse selon le type de question. */
  function renderAnswerArea(q, cur) {
    if (q.type === 'mcq' || q.type === 'multi') {
      const multi = q.type === 'multi';
      const good = multi ? q.answers : [q.answer];
      const opts = cur.order.map(function (i) {
        const picked = multi ? cur.picked.indexOf(i) !== -1 : cur.picked === i;
        let cls = 'opt' + (picked ? ' picked' : '');
        if (cur.answered) {
          if (good.indexOf(i) !== -1) cls += ' good';
          else if (picked) cls += ' bad';
        }
        return '<li><button class="' + cls + '" data-act="pick" data-i="' + i + '"' + (cur.answered ? ' disabled' : '') +
          ' aria-pressed="' + picked + '"><span class="mark ' + (multi ? 'box' : 'radio') + '"></span>' +
          '<span class="opt-text">' + T.html(q.options[i]) + '</span></button></li>';
      }).join('');
      return (multi ? '<p class="hint">Plusieurs réponses possibles.</p>' : '') + '<ul class="opts">' + opts + '</ul>';
    }

    if (q.type === 'tf') {
      return '<div class="tf">' + [true, false].map(function (v) {
        let cls = 'opt tf-btn' + (cur.picked === v ? ' picked' : '');
        if (cur.answered) {
          if (q.answer === v) cls += ' good';
          else if (cur.picked === v) cls += ' bad';
        }
        return '<button class="' + cls + '" data-act="pick-tf" data-v="' + v + '"' + (cur.answered ? ' disabled' : '') + '>' +
          (v ? 'Vrai' : 'Faux') + '</button>';
      }).join('') + '</div>';
    }

    if (q.type === 'order') {
      if (cur.answered) {
        // Après correction : la démonstration dans le bon ordre.
        return '<ol class="order-solution">' + q.steps.map(function (s) { return '<li>' + T.html(s) + '</li>'; }).join('') + '</ol>';
      }
      const chosen = cur.chosen.map(function (i, k) {
        return '<li><button class="opt placed" data-act="unplace" data-k="' + k + '"><span class="num">' + (k + 1) + '</span>' +
          '<span class="opt-text">' + T.html(q.steps[i]) + '</span></button></li>';
      }).join('');
      const pool = cur.pool.filter(function (i) { return cur.chosen.indexOf(i) === -1; }).map(function (i) {
        return '<li><button class="opt" data-act="place" data-i="' + i + '"><span class="opt-text">' + T.html(q.steps[i]) + '</span></button></li>';
      }).join('');
      return '<p class="hint">Touchez les étapes dans l\'ordre de la démonstration. Touchez une étape placée pour la retirer.</p>' +
        (chosen ? '<ol class="opts chosen">' + chosen + '</ol>' : '') +
        (pool ? '<ul class="opts pool">' + pool + '</ul>' : '');
    }

    // Carte de restitution.
    if (!cur.revealed) {
      return '<p class="hint">Répondez de tête ou sur papier, puis comparez.</p>';
    }
    return '<div class="card-back"><h4>Réponse attendue</h4><div class="statement">' + T.html(q.back) + '</div></div>';
  }

  /** Bas de l'écran de séance : bouton d'action ou retour après réponse. */
  function renderSessionFoot(q, cur, s) {
    if (cur.answered) {
      const last = s.pos + 1 >= s.queue.length;
      let verdict;
      if (q.type === 'card') {
        verdict = ['À revoir', 'Difficile', 'Bien', 'Facile'][cur.grade];
      } else {
        verdict = cur.correct ? 'Juste' : 'Faux';
      }
      const next = cur.correct ? '' : ' Cette question reviendra en fin de séance, puis demain.';
      return '<div class="feedback ' + (cur.correct ? 'good' : 'bad') + '">' +
        '<p class="verdict">' + (cur.correct ? ICON.check : ICON.close) + '<span>' + verdict + '</span></p>' +
        '<div class="explain">' + T.html(q.explain) + (cur.correct || s.queue[s.pos].tries >= 2 ? '' : '<span class="again">' + next + '</span>') + '</div>' +
        '<p class="about">Notion : ' + T.html(NOTIONS[q.notion].title) + '</p>' +
        '<button class="btn primary" data-act="next"><span>' + (last ? 'Voir le bilan' : 'Continuer') + '</span></button></div>';
    }
    if (q.type === 'tf') return '';
    if (q.type === 'card') {
      if (!cur.revealed) return '<button class="btn primary" data-act="reveal"><span>Afficher la réponse</span></button>';
      return '<p class="hint center">Comment était votre réponse ?</p><div class="grades">' +
        '<button class="grade g0" data-act="grade" data-g="0">À revoir</button>' +
        '<button class="grade g1" data-act="grade" data-g="1">Difficile</button>' +
        '<button class="grade g2" data-act="grade" data-g="2">Bien</button>' +
        '<button class="grade g3" data-act="grade" data-g="3">Facile</button></div>';
    }
    let ready = false;
    if (q.type === 'mcq') ready = cur.picked !== null;
    if (q.type === 'multi') ready = cur.picked.length > 0;
    if (q.type === 'order') ready = cur.chosen.length === q.steps.length;
    return '<button class="btn primary" data-act="check"' + (ready ? '' : ' disabled') + '><span>Vérifier</span></button>';
  }

  function renderSessionOverlay() {
    const s = ui.session;
    const item = s.queue[s.pos];
    const q = QUESTIONS[item.id];
    const cur = s.cur;
    const done = s.pos + (cur.answered ? 1 : 0);
    const pct = Math.round((done / s.queue.length) * 100);
    const title = { lesson: 'Leçon', review: 'Révision', pitfalls: 'Pièges', exercise: 'Exercice', notion: 'Notion' }[s.mode];
    // Une étape d'exercice garde son énoncé sous les yeux, y compris en révision.
    const ex = q.exercise ? EXERCISES[q.exercise] : null;
    const context = ex
      ? '<div class="context"><p class="kind">' + LEVEL_LABEL[ex.level] + '</p><h3>' + T.html(ex.title) + '</h3>' +
        '<div class="context-text">' + T.html(ex.statement) + '</div>' +
        '<p class="meta">Étape ' + q.step + ' sur ' + ex.steps.length + '</p></div>'
      : '';
    return '<header class="ov-head session-head">' +
        '<button class="icon-btn" data-act="quit-session" aria-label="Quitter la séance">' + ICON.close + '</button>' +
        '<div class="bar" role="progressbar" aria-label="Avancement de la séance" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '"><span style="width:' + pct + '%"></span></div>' +
        '<span class="xp">' + s.xp + ' pts</span>' +
      '</header>' +
      '<div class="ov-body question">' +
        '<p class="tags"><span class="tag t-' + q.tag + '">' + TAG_LABEL[q.tag] + '</span>' +
          '<span class="tag plain">' + title + '</span>' +
          (item.tries > 0 ? '<span class="tag retry">Rattrapage</span>' : '') + '</p>' +
        context +
        '<div class="prompt">' + T.html(q.prompt) + '</div>' +
        renderAnswerArea(q, cur) +
      '</div>' +
      '<footer class="ov-foot">' + renderSessionFoot(q, cur, s) + '</footer>';
  }

  /* --- Bilan de fin de séance --- */
  function renderSummaryOverlay() {
    const s = ui.session;
    const st = E.computeStreak(progress().log, goal(), today());
    const xpToday = (progress().log[today()] && progress().log[today()].xp) || 0;
    const missed = s.missed.map(function (id) {
      return '<li><button class="row" data-act="open-notion-from-summary" data-id="' + id + '">' +
        '<span class="row-main"><span class="kind">' + T.esc(NOTIONS[id].kind) + '</span>' +
        '<span class="row-title">' + T.html(NOTIONS[id].title) + '</span></span><span class="pill">Relire</span></button></li>';
    }).join('');
    return '<div class="ov-body summary">' +
        '<p class="eyebrow">Séance terminée</p>' +
        '<h2>' + s.firstOk + ' sur ' + s.firstTotal + ' du premier coup</h2>' +
        '<dl class="stats">' +
          '<div><dt>Points gagnés</dt><dd>+' + s.xp + '</dd></div>' +
          '<div><dt>Aujourd\'hui</dt><dd>' + xpToday + ' / ' + goal() + '</dd></div>' +
          '<div><dt>Série</dt><dd class="' + (st.todayDone ? 'lit' : '') + '">' + st.current + '</dd></div>' +
        '</dl>' +
        (s.bonus === 'lesson' ? '<p class="note">Leçon terminée : ' + E.XP.LESSON_BONUS + ' points de bonus. Ses questions reviendront en révision à partir de demain, et ses exercices sont maintenant accessibles.</p>' : '') +
        (s.bonus === 'exercise' ? '<p class="note">Exercice terminé : ' + E.XP.LESSON_BONUS + ' points de bonus. Ses étapes reviendront en révision.</p>' : '') +
        (st.todayDone ? '<p class="note good">Objectif du jour atteint.</p>'
          : '<p class="note">Encore ' + Math.max(0, goal() - xpToday) + ' points pour valider la journée.</p>') +
        (missed ? '<h3>À relire</h3><ul class="rows">' + missed + '</ul>' : '') +
      '</div>' +
      '<footer class="ov-foot"><button class="btn primary" data-act="finish"><span>Terminer</span></button></footer>';
  }

  /* ================================================================== */
  /* 5. Rendu général, clics, démarrage                                  */
  /* ================================================================== */

  const $view = document.getElementById('view');
  const $overlay = document.getElementById('overlay');
  const $streak = document.getElementById('head-streak');

  function render() {
    // En-tête : série courante.
    const st = E.computeStreak(progress().log, goal(), today());
    $streak.className = 'chip' + (st.todayDone ? ' lit' : '');
    $streak.innerHTML = ICON.flame + '<span>' + st.current + '</span>';
    $streak.setAttribute('aria-label', 'Série : ' + plural(st.current, 'jour', 'jours'));

    // Onglets.
    document.querySelectorAll('.tab').forEach(function (b) {
      const on = b.dataset.tab === ui.tab;
      b.classList.toggle('on', on);
      b.setAttribute('aria-current', on ? 'page' : 'false');
    });

    // Écran courant.
    if (ui.tab === 'home') $view.innerHTML = renderHome();
    if (ui.tab === 'path') $view.innerHTML = renderPath();
    if (ui.tab === 'library') $view.innerHTML = renderLibrary();
    if (ui.tab === 'profile') $view.innerHTML = renderProfile();

    // Vue plein écran éventuelle.
    if (!ui.overlay) {
      $overlay.hidden = true;
      $overlay.innerHTML = '';
      document.body.classList.remove('has-overlay');
      return;
    }
    let html = '';
    if (ui.overlay.type === 'lesson') html = renderLessonOverlay(ui.overlay.id);
    if (ui.overlay.type === 'notion') html = renderNotionOverlay(ui.overlay.id);
    if (ui.overlay.type === 'session') html = renderSessionOverlay();
    if (ui.overlay.type === 'summary') html = renderSummaryOverlay();
    $overlay.innerHTML = html;
    $overlay.hidden = false;
    document.body.classList.add('has-overlay');
  }

  /** Revient en haut de la vue plein écran (nouvelle question, nouvelle fiche). */
  function scrollOverlayTop() {
    const body = $overlay.querySelector('.ov-body');
    if (body) body.scrollTop = 0;
  }

  /** Table des actions : une fonction par valeur de data-act. */
  const ACTIONS = {
    'tab': function (el) { ui.tab = el.dataset.tab; ui.confirmReset = false; render(); window.scrollTo(0, 0); },

    'open-lesson': function (el) { ui.back = []; ui.overlay = { type: 'lesson', id: el.dataset.id }; render(); scrollOverlayTop(); },
    // Ouvrir une fiche depuis une leçon ou une autre fiche : on mémorise la vue courante pour y revenir.
    'open-notion': function (el) {
      if (ui.overlay) ui.back.push(ui.overlay);
      ui.overlay = { type: 'notion', id: el.dataset.id };
      render(); scrollOverlayTop();
    },
    'open-notion-from-summary': function (el) { ui.session = null; ui.back = []; ui.overlay = { type: 'notion', id: el.dataset.id }; render(); scrollOverlayTop(); },
    'close-overlay': function () { ui.overlay = ui.back.pop() || null; render(); },

    'start-lesson': function (el) {
      startSession('lesson', lessonQuestions(el.dataset.id).map(function (q) { return q.id; }), el.dataset.id);
    },
    'start-review': function () { startSession('review', dueQuestionIds().slice(0, 20)); },
    'start-exercise': function (el) { startSession('exercise', EXERCISES[el.dataset.id].steps, el.dataset.id); },
    // Retravailler une notion : ses questions de cours dans le désordre, puis ses étapes d'exercices.
    'start-notion': function (el) {
      const all = C.questions.filter(function (q) { return q.notion === el.dataset.id; });
      const course = shuffle(all.filter(function (q) { return !q.exercise; }));
      const steps = all.filter(function (q) { return q.exercise; });
      startSession('notion', course.concat(steps).slice(0, 12).map(function (q) { return q.id; }));
    },
    'start-pitfalls': function () { startSession('pitfalls', shuffle(seenPitfallIds()).slice(0, 15)); },

    // Réponses : chaque geste met à jour l'état de la question courante.
    'pick': function (el) {
      const cur = ui.session.cur, i = Number(el.dataset.i);
      if (Array.isArray(cur.picked)) {
        const k = cur.picked.indexOf(i);
        if (k === -1) cur.picked.push(i); else cur.picked.splice(k, 1);
      } else {
        cur.picked = i;
      }
      render();
    },
    'pick-tf': function (el) { ui.session.cur.picked = el.dataset.v === 'true'; checkCurrent(); },
    'place': function (el) { ui.session.cur.chosen.push(Number(el.dataset.i)); render(); },
    'unplace': function (el) { ui.session.cur.chosen.splice(Number(el.dataset.k), 1); render(); },
    'reveal': function () { ui.session.cur.revealed = true; render(); },
    'grade': function (el) {
      const g = Number(el.dataset.g);
      recordAnswer(g !== G.RATE, g);
      render();
    },
    'check': function () { checkCurrent(); },
    'next': function () { advance(); scrollOverlayTop(); },
    'quit-session': function () { ui.session = null; ui.back = []; ui.overlay = null; render(); },
    'finish': function () { ui.session = null; ui.overlay = null; ui.tab = 'home'; render(); window.scrollTo(0, 0); },

    // Profil.
    'set-goal': function (el) {
      const p = JSON.parse(JSON.stringify(progress()));
      p.settings = { goal: Number(el.dataset.goal), updatedAt: Date.now() };
      Store.save(p);
      render();
    },
    'copy-data': function () {
      // L'écriture dans le presse-papiers n'est permise que depuis un clic et peut être refusée.
      const text = JSON.stringify(progress(), null, 2);
      const done = function () { ui.copied = true; render(); setTimeout(function () { ui.copied = false; render(); }, 2000); };
      try { navigator.clipboard.writeText(text).then(done, function () {}); } catch (e) { /* refusé : rien à signaler de plus */ }
    },
    'reset-ask': function () { ui.confirmReset = true; render(); },
    'reset-no': function () { ui.confirmReset = false; render(); },
    'reset-yes': function () { ui.confirmReset = false; Store.reset(); render(); }
  };

  // Un seul écouteur de clics pour toute la page.
  document.addEventListener('click', function (ev) {
    const el = ev.target.closest('[data-act]');
    if (!el || el.disabled) return;
    const fn = ACTIONS[el.dataset.act];
    if (fn) fn(el);
  });

  // Recherche de la bibliothèque : on ne redessine que la liste, pour garder le curseur dans le champ.
  document.addEventListener('input', function (ev) {
    if (ev.target.id !== 'lib-search') return;
    ui.search = ev.target.value;
    const list = document.getElementById('lib-list');
    if (list) list.innerHTML = renderLibraryList();
  });

  // Démarrage : progression locale d'abord, synchronisation ensuite.
  Store.init();
  Store.onChange(function () {
    // On ne redessine pas par-dessus une vue plein écran (cela ferait perdre la position
    // de lecture ou la réponse en cours), ni pendant une saisie dans la recherche.
    const typing = document.activeElement && document.activeElement.id === 'lib-search';
    if (!ui.overlay && !typing) render();
  });
  render();

  // Hors ligne : le service worker met l'application en cache (ignoré là où il est interdit).
  if ('serviceWorker' in navigator) {
    try { navigator.serviceWorker.register('sw.js').catch(function () {}); } catch (e) { /* cadre restreint */ }
  }
})();
