/*
 * Tests du moteur de révision. Lancer avec :  node --test
 * (aucune dépendance : on utilise le lanceur de tests intégré à Node).
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const E = require('../js/engine.js');

const G = E.GRADE;

test('dates : addDays et diffDays traversent les mois et les années', () => {
  assert.equal(E.addDays('2026-12-31', 1), '2027-01-01');
  assert.equal(E.addDays('2026-03-01', -1), '2026-02-28');
  assert.equal(E.diffDays('2026-10-20', '2026-11-11'), 22);
  // Changement d'heure (25 octobre 2026) : aucun jour sauté ni doublé.
  assert.equal(E.addDays('2026-10-24', 2), '2026-10-26');
});

test('espacement : suite « Bien » = 1 jour, 3 jours, puis × facilité', () => {
  let c = E.review(undefined, G.BIEN, '2026-11-11', 1);
  assert.equal(c.ivl, 1);
  assert.equal(c.due, '2026-11-12');
  c = E.review(c, G.BIEN, '2026-11-12', 2);
  assert.equal(c.ivl, 3);
  c = E.review(c, G.BIEN, '2026-11-15', 3);
  assert.equal(c.ivl, 8); // 3 × 2,5 = 7,5 arrondi à 8
  assert.equal(c.ease, 2.5);
  assert.equal(c.due, '2026-11-23');
});

test('espacement : « Raté » ramène au lendemain et baisse la facilité', () => {
  let c = { ivl: 20, ease: 2.5, reps: 4, due: '2026-11-11', lapses: 0, last: 0 };
  c = E.review(c, G.RATE, '2026-11-11', 5);
  assert.equal(c.ivl, 1);
  assert.equal(c.reps, 0);
  assert.equal(c.lapses, 1);
  assert.equal(c.ease, 2.3);
  assert.equal(c.due, '2026-11-12');
});

test('espacement : la facilité ne descend jamais sous 1,3', () => {
  let c;
  for (let i = 0; i < 20; i++) c = E.review(c, G.RATE, '2026-11-11', i);
  assert.equal(c.ease, 1.3);
});

test('espacement : « Facile » et « Difficile »', () => {
  let c = E.review(undefined, G.FACILE, '2026-11-11', 1);
  assert.equal(c.ivl, 3);
  assert.equal(c.ease, 2.65);
  c = E.review({ ivl: 10, ease: 2.5, reps: 3, due: 'x', lapses: 0, last: 0 }, G.DIFFICILE, '2026-11-11', 1);
  assert.equal(c.ivl, 12);
  assert.equal(c.ease, 2.35);
});

test('espacement : review ne modifie pas la carte reçue', () => {
  const c = Object.freeze({ ivl: 3, ease: 2.5, reps: 2, due: '2026-11-11', lapses: 0, last: 0 });
  E.review(c, G.BIEN, '2026-11-11', 1);
  assert.equal(c.ivl, 3);
});

test('échéances : tri par retard puis par nombre d\'oublis', () => {
  const cards = {
    a: { due: '2026-11-10', lapses: 0 },
    b: { due: '2026-11-08', lapses: 0 },
    c: { due: '2026-11-10', lapses: 3 },
    d: { due: '2026-11-12', lapses: 0 }, // pas encore due
    e: { due: null, lapses: 0 } // jamais vue
  };
  assert.deepEqual(E.dueIds(cards, '2026-11-11'), ['b', 'c', 'a']);
});

test('maîtrise : seuils 7 et 30 jours', () => {
  assert.equal(E.mastery([]), 'nouvelle');
  assert.equal(E.mastery([{ due: 'x', ivl: 3 }]), 'apprentissage');
  assert.equal(E.mastery([{ due: 'x', ivl: 8 }, { due: 'x', ivl: 20 }]), 'consolidee');
  assert.equal(E.mastery([{ due: 'x', ivl: 45 }]), 'maitrisee');
});

/** Fabrique un journal où les jours listés sont validés (100 points, objectif 100). */
function logOf(days) {
  const log = {};
  days.forEach((d) => { log[d] = { xp: 100, n: 10, ok: 10, goal: 100 }; });
  return log;
}

/** n jours consécutifs à partir de start. */
function run(start, n) {
  return Array.from({ length: n }, (_, i) => E.addDays(start, i));
}

test('série : jours consécutifs, aujourd\'hui inclus', () => {
  const s = E.computeStreak(logOf(run('2026-11-09', 3)), 100, '2026-11-11');
  assert.equal(s.current, 3);
  assert.equal(s.todayDone, true);
});

test('série : aujourd\'hui non encore validé ne casse pas la série', () => {
  const s = E.computeStreak(logOf(run('2026-11-08', 3)), 100, '2026-11-11');
  assert.equal(s.current, 3);
  assert.equal(s.todayDone, false);
});

test('série : un jour manqué sans gel remet à zéro, la meilleure série reste', () => {
  const days = run('2026-11-01', 4).concat(['2026-11-06']);
  const s = E.computeStreak(logOf(days), 100, '2026-11-06');
  assert.equal(s.current, 1);
  assert.equal(s.best, 4);
});

test('série : un gel est gagné au 7e jour et protège un jour manqué', () => {
  // 7 jours validés (1 au 7), le 8 manqué, le 9 validé.
  const days = run('2026-11-01', 7).concat(['2026-11-09']);
  const s = E.computeStreak(logOf(days), 100, '2026-11-09');
  assert.equal(s.current, 8);
  assert.equal(s.freezes, 0);
  assert.deepEqual(s.frozenDays, ['2026-11-08']);
});

test('série : deux gels au plus en réserve', () => {
  const s = E.computeStreak(logOf(run('2026-10-01', 30)), 100, '2026-10-30');
  assert.equal(s.current, 30);
  assert.equal(s.freezes, 2);
});

test('série : points insuffisants = jour non validé', () => {
  const log = logOf(run('2026-11-09', 2));
  log['2026-11-11'] = { xp: 60, n: 6, ok: 6, goal: 100 };
  const s = E.computeStreak(log, 100, '2026-11-11');
  assert.equal(s.current, 2);
  assert.equal(s.todayDone, false);
});

test('série : simulation de 30 jours avec une absence longue', () => {
  // 10 jours, 5 jours d'absence, 15 jours : un seul gel disponible, la série repart.
  const days = run('2026-10-01', 10).concat(run('2026-10-16', 15));
  const s = E.computeStreak(logOf(days), 100, '2026-10-30');
  assert.equal(s.current, 15);
  assert.equal(s.best, 15);
});

test('journal : addXp cumule sans modifier le journal reçu', () => {
  const log0 = {};
  const log1 = E.addXp(log0, '2026-11-11', 10, true, 100);
  const log2 = E.addXp(log1, '2026-11-11', 0, false, 100);
  const log3 = E.addXp(log2, '2026-11-11', 20, null, 100); // bonus de leçon
  assert.deepEqual(log0, {});
  assert.deepEqual(log3['2026-11-11'], { xp: 30, n: 2, ok: 1, goal: 100 });
});

test('fusion : la révision la plus récente gagne, les points prennent le maximum', () => {
  const a = E.emptyProgress(10);
  const b = E.emptyProgress(20);
  a.cards.q1 = { ivl: 1, ease: 2.5, reps: 1, due: '2026-11-12', lapses: 0, last: 100 };
  b.cards.q1 = { ivl: 3, ease: 2.5, reps: 2, due: '2026-11-15', lapses: 0, last: 200 };
  a.cards.q2 = { ivl: 1, ease: 2.5, reps: 1, due: '2026-11-12', lapses: 0, last: 50 };
  a.log['2026-11-11'] = { xp: 40, n: 4, ok: 4, goal: 100 };
  b.log['2026-11-11'] = { xp: 110, n: 12, ok: 10, goal: 100 };
  b.log['2026-11-10'] = { xp: 100, n: 10, ok: 9, goal: 100 };
  a.lessons.l1 = 5;
  a.exercises['ex-1'] = 30;
  b.exercises['ex-1'] = 20;
  b.exercises['ex-2'] = 40;
  b.settings = { goal: 200, updatedAt: 99 };

  const m = E.mergeProgress(a, b);
  assert.equal(m.cards.q1.ivl, 3);
  assert.ok(m.cards.q2);
  assert.equal(m.log['2026-11-11'].xp, 110);
  assert.equal(m.log['2026-11-10'].xp, 100);
  assert.equal(m.lessons.l1, 5);
  assert.deepEqual(m.exercises, { 'ex-1': 20, 'ex-2': 40 });
  assert.equal(m.settings.goal, 200);
  assert.equal(m.createdAt, 10);
});

test('fusion : commutative et idempotente', () => {
  const a = E.emptyProgress(10);
  const b = E.emptyProgress(20);
  a.cards.q1 = { ivl: 1, ease: 2.5, reps: 1, due: '2026-11-12', lapses: 0, last: 100 };
  b.cards.q3 = { ivl: 8, ease: 2.6, reps: 3, due: '2026-11-19', lapses: 1, last: 300 };
  a.log['2026-11-11'] = { xp: 40, n: 4, ok: 4, goal: 50 };
  b.log['2026-11-11'] = { xp: 30, n: 5, ok: 2, goal: 100 };
  a.settings = { goal: 50, updatedAt: 7 };
  const ab = E.mergeProgress(a, b);
  const ba = E.mergeProgress(b, a);
  assert.deepEqual(ab, ba);
  assert.deepEqual(E.mergeProgress(ab, a), ab);
  assert.deepEqual(E.mergeProgress(ab, ab), ab);
});

test('fusion : une progression absente renvoie l\'autre', () => {
  const a = E.emptyProgress(1);
  assert.equal(E.mergeProgress(a, null), a);
  assert.equal(E.mergeProgress(undefined, a), a);
});

test('totaux : points et taux de réussite', () => {
  const t = E.totals({ a: { xp: 50, n: 5, ok: 4 }, b: { xp: 100, n: 15, ok: 11 } });
  assert.equal(t.xp, 150);
  assert.equal(t.rate, 0.75);
  assert.equal(E.totals({}).rate, null);
});

test('fusion : une progression ancienne sans exercices reste lisible', () => {
  const old = { v: 1, cards: {}, log: {}, lessons: { l1: 3 }, settings: { goal: 100, updatedAt: 0 }, createdAt: 1 };
  const m = E.mergeProgress(old, E.emptyProgress(2));
  assert.deepEqual(m.exercises, {});
  assert.equal(m.lessons.l1, 3);
});
