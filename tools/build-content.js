/*
 * Lemme — vérification et fabrication du contenu.
 *
 *   node tools/build-content.js
 *
 * 1. assemble chaque chapitre à partir de son dossier content-src/<chapitre>/ :
 *      cours.js        fiches, leçons et questions de cours
 *      complements.js  exemples, prérequis et démonstrations de chaque fiche
 *      prerequis.js    leçon facultative de prérequis (fichier optionnel)
 *      exercices.js    exercices d'application à étapes ;
 * 2. vérifie la structure (identifiants uniques sur l'ensemble des chapitres,
 *    réponses valides, renvois existants) ;
 * 3. compile chaque formule avec KaTeX pour détecter toute erreur de LaTeX ;
 * 4. écrit content/contenu.json (format d'échange, relisible)
 *    et content/contenu.js (même contenu, chargé par la page via une balise script).
 *
 * Pour ajouter un chapitre : créer son dossier, puis l'ajouter à CHAPTERS ci-dessous.
 * Les identifiants (leçons, notions, questions, exercices, sources) doivent être
 * uniques dans toute l'application : préfixer ceux d'un nouveau chapitre.
 *
 * Le script s'arrête avec un code d'erreur si une vérification échoue :
 * aucun contenu invalide ne peut donc être publié.
 */
const fs = require('fs');
const path = require('path');
const katex = require('../vendor/katex/katex.min.js');

const root = path.join(__dirname, '..');

/** Chapitres, dans l'ordre du parcours. */
const CHAPTERS = ['reduction', 'suites-fonctions'];

const errors = [];
const fail = (msg) => errors.push(msg);

/* ---------- Assemblage ---------- */

/** Charge un chapitre et renvoie ses morceaux, chaque leçon portant l'identifiant du chapitre. */
function loadChapter(dir) {
  const folder = path.join(root, 'content-src', dir);
  const base = require(path.join(folder, 'cours.js'));
  const complements = require(path.join(folder, 'complements.js'));
  const exercises = require(path.join(folder, 'exercices.js'));
  const prereqFile = path.join(folder, 'prerequis.js');
  const prereq = fs.existsSync(prereqFile) ? require(prereqFile) : { lesson: null, notions: [], questions: [] };

  // Chaque fiche du chapitre reçoit ses compléments (listes vides par défaut).
  const chapterNotions = base.notions.map((n) => {
    const extra = complements[n.id] || {};
    return Object.assign({}, n, {
      examples: extra.examples || [],
      prereqs: extra.prereqs || [],
      proofSteps: extra.proof || null
    });
  });
  Object.keys(complements).forEach((id) => {
    if (!base.notions.some((n) => n.id === id)) fail(dir + ' : complément pour une notion inconnue « ' + id + ' »');
  });
  const prereqNotions = prereq.notions.map((n) => Object.assign({ examples: [], prereqs: [], proofSteps: null }, n));

  // Chaque étape d'exercice devient une question ordinaire, rattachée à son exercice.
  const exerciseQuestions = [];
  const exerciseIndex = exercises.map((ex) => {
    const stepIds = ex.steps.map((step, k) => {
      const id = ex.id + '-s' + (k + 1);
      exerciseQuestions.push(Object.assign({ id: id, lesson: ex.lesson, notion: ex.notion, tag: 'application', exercise: ex.id, step: k + 1 }, step));
      return id;
    });
    return { id: ex.id, lesson: ex.lesson, level: ex.level, notion: ex.notion, title: ex.title, origin: ex.origin || null, statement: ex.statement, steps: stepIds };
  });

  const lessons = (prereq.lesson ? [prereq.lesson] : []).concat(base.lessons)
    .map((l) => Object.assign({ chapter: base.id }, l));

  return {
    chapter: { id: base.id, title: base.title, review: base.review, frame: base.frame, sources: base.sources },
    lessons: lessons,
    notions: prereqNotions.concat(chapterNotions),
    questions: prereq.questions.concat(base.questions, exerciseQuestions),
    exercises: exerciseIndex
  };
}

// Le contenu complet : la liste des chapitres, puis tout le reste à plat.
const content = { chapters: [], lessons: [], notions: [], questions: [], exercises: [] };
CHAPTERS.forEach((dir) => {
  const part = loadChapter(dir);
  content.chapters.push(part.chapter);
  ['lessons', 'notions', 'questions', 'exercises'].forEach((k) => { content[k] = content[k].concat(part[k]); });
});
const chapter = content; // nom utilisé par les vérifications ci-dessous

/* ---------- Vérification du LaTeX ---------- */

/** Extrait les formules d'un texte ($...$ et $$...$$) et les compile. */
function checkMath(text, where) {
  if (typeof text !== 'string') return fail(where + ' : texte manquant');
  // Un nombre impair de « $ » trahit une formule non refermée.
  const dollars = (text.match(/\$/g) || []).length;
  if (dollars % 2 !== 0) fail(where + ' : nombre impair de $');
  const re = /\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const tex = m[1] !== undefined ? m[1] : m[2];
    try {
      katex.renderToString(tex, { throwOnError: true, displayMode: m[1] !== undefined, strict: 'error' });
    } catch (e) {
      fail(where + ' : LaTeX invalide « ' + tex + ' » (' + e.message + ')');
    }
  }
}

/* ---------- Vérification de la structure ---------- */

const ids = new Set();
function unique(id, where) {
  if (!id) fail(where + ' : identifiant manquant');
  if (ids.has(id)) fail(where + ' : identifiant en double « ' + id + ' »');
  ids.add(id);
}

const lessonIds = new Set(chapter.lessons.map((l) => l.id));
const notionIds = new Set(chapter.notions.map((n) => n.id));
const sourceIds = new Set();
chapter.chapters.forEach((c) => c.sources.forEach((src) => { unique(src.id, 'source'); sourceIds.add(src.id); }));

chapter.chapters.forEach((c) => { unique(c.id, 'chapitre'); checkMath(c.frame, 'cadre du chapitre ' + c.id); });
chapter.lessons.forEach((l) => unique(l.id, 'leçon'));

chapter.notions.forEach((n) => {
  const w = 'notion ' + n.id;
  unique(n.id, w);
  if (!lessonIds.has(n.lesson)) fail(w + ' : leçon inconnue ' + n.lesson);
  if (n.source !== null && !sourceIds.has(n.source)) fail(w + ' : source inconnue ' + n.source);
  (n.prereqs || []).forEach((id) => {
    if (!notionIds.has(id)) fail(w + ' : prérequis inconnu ' + id);
    if (id === n.id) fail(w + ' : une notion ne peut pas être son propre prérequis');
  });
  (n.proofSteps || []).forEach((t, i) => checkMath(t, w + ' (démonstration, étape ' + (i + 1) + ')'));
  if (!['programme', 'hors-programme'].includes(n.status)) fail(w + ' : statut invalide');
  if (!['cpge', 'agreg'].includes(n.level)) fail(w + ' : niveau invalide');
  checkMath(n.title, w + ' (titre)');
  checkMath(n.statement, w + ' (énoncé)');
  checkMath(n.idea, w + ' (idée)');
  ['hypotheses', 'examples', 'counterexamples', 'pitfalls', 'notations'].forEach((k) => {
    if (!Array.isArray(n[k])) return fail(w + ' : champ ' + k + ' manquant');
    n[k].forEach((t, i) => checkMath(t, w + ' (' + k + ' ' + i + ')'));
  });
});

const TYPES = ['mcq', 'multi', 'tf', 'order', 'card'];
const TAGS = ['hypotheses', 'piege', 'cadre', 'notation', 'demo', 'application', 'restitution'];

chapter.questions.forEach((q) => {
  const w = 'question ' + q.id;
  unique(q.id, w);
  if (!lessonIds.has(q.lesson)) fail(w + ' : leçon inconnue');
  if (!notionIds.has(q.notion)) fail(w + ' : notion inconnue');
  if (!TYPES.includes(q.type)) fail(w + ' : type invalide');
  if (!TAGS.includes(q.tag)) fail(w + ' : étiquette invalide');
  checkMath(q.prompt, w + ' (énoncé)');
  checkMath(q.explain, w + ' (explication)');

  if (q.type === 'mcq') {
    if (!Array.isArray(q.options) || q.options.length < 3) fail(w + ' : au moins 3 options');
    if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) fail(w + ' : réponse hors limites');
  }
  if (q.type === 'multi') {
    if (!Array.isArray(q.options) || q.options.length < 3) fail(w + ' : au moins 3 options');
    if (!Array.isArray(q.answers) || q.answers.length === 0) fail(w + ' : aucune bonne réponse');
    (q.answers || []).forEach((a) => {
      if (!Number.isInteger(a) || a < 0 || a >= q.options.length) fail(w + ' : réponse hors limites');
    });
  }
  if (q.type === 'mcq' || q.type === 'multi') {
    (q.options || []).forEach((o, i) => checkMath(o, w + ' (option ' + i + ')'));
    if (new Set(q.options).size !== q.options.length) fail(w + ' : options en double');
  }
  if (q.type === 'tf' && typeof q.answer !== 'boolean') fail(w + ' : réponse vrai/faux manquante');
  if (q.type === 'order') {
    if (!Array.isArray(q.steps) || q.steps.length < 3) fail(w + ' : au moins 3 étapes');
    (q.steps || []).forEach((s, i) => checkMath(s, w + ' (étape ' + i + ')'));
  }
  if (q.type === 'card') checkMath(q.back, w + ' (verso)');
});

// Exercices : énoncé, niveau, au moins deux étapes, niveaux croissants dans une leçon.
const lastLevel = {};
chapter.exercises.forEach((ex) => {
  const w = 'exercice ' + ex.id;
  unique(ex.id, w);
  if (!lessonIds.has(ex.lesson)) fail(w + ' : leçon inconnue');
  if (!notionIds.has(ex.notion)) fail(w + ' : notion inconnue');
  if (![1, 2, 3].includes(ex.level)) fail(w + ' : niveau invalide');
  if (ex.level < (lastLevel[ex.lesson] || 1)) fail(w + ' : les exercices d\'une leçon doivent être rangés par niveau croissant');
  lastLevel[ex.lesson] = ex.level;
  if (ex.steps.length < 2) fail(w + ' : au moins deux étapes');
  checkMath(ex.title, w + ' (titre)');
  checkMath(ex.statement, w + ' (énoncé)');
});

// Chaque leçon doit avoir des notions et des questions ; chaque notion au moins une question.
chapter.lessons.forEach((l) => {
  if (!chapter.notions.some((n) => n.lesson === l.id)) fail('leçon ' + l.id + ' : aucune notion');
  if (!chapter.questions.some((q) => q.lesson === l.id)) fail('leçon ' + l.id + ' : aucune question');
});
chapter.notions.forEach((n) => {
  if (!chapter.questions.some((q) => q.notion === n.id)) fail('notion ' + n.id + ' : aucune question');
});

if (errors.length) {
  console.error('Contenu invalide :\n - ' + errors.join('\n - '));
  process.exit(1);
}

/* ---------- Écriture des fichiers ---------- */

fs.mkdirSync(path.join(root, 'content'), { recursive: true });
const json = JSON.stringify(chapter, null, 2);
fs.writeFileSync(path.join(root, 'content', 'contenu.json'), json + '\n');
fs.writeFileSync(
  path.join(root, 'content', 'contenu.js'),
  '/* Fichier généré par tools/build-content.js : ne pas modifier à la main. */\n' +
    'window.LEMME_CONTENT = ' + JSON.stringify(chapter) + ';\n'
);

const nCourse = chapter.questions.filter((q) => !q.exercise).length;
const byType = {};
chapter.questions.forEach((q) => { byType[q.type] = (byType[q.type] || 0) + 1; });
console.log(
  'Contenu valide : ' + chapter.chapters.length + ' chapitres, ' + chapter.lessons.length + ' leçons, ' + chapter.notions.length + ' notions, ' +
    nCourse + ' questions de cours, ' + chapter.exercises.length + ' exercices (' +
    (chapter.questions.length - nCourse) + ' étapes) ' + JSON.stringify(byType)
);
