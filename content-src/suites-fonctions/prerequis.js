/*
 * Lemme — leçon de prérequis du chapitre « Suites et séries de fonctions ».
 * Notions de première année utilisées dans tout le chapitre (leçon facultative).
 * Même format que content-src/reduction/prerequis.js.
 */
const R = String.raw;

module.exports = {
  lesson: { id: 'sf-l0', optional: true, title: 'Prérequis', blurb: 'Quantificateurs, borne supérieure, séries numériques.' },

  notions: [
    {
      id: 'sfp-quantificateurs', lesson: 'sf-l0', kind: 'Rappels',
      title: 'Ordre des quantificateurs',
      status: 'programme', level: 'cpge', proof: null, source: null,
      statement: R`Dans une phrase mathématique, un objet introduit par « il existe » peut dépendre de **tous** les objets introduits avant lui, et d'aucun de ceux introduits après.
Ainsi « $\forall x,\ \exists N$ » autorise $N$ à dépendre de $x$, alors que « $\exists N,\ \forall x$ » impose le même $N$ pour tous les $x$.
**Continuité en $a$** d'une fonction $f$ définie sur $A$ : $\forall \varepsilon > 0,\ \exists \delta > 0,\ \forall x \in A,\ |x - a| \leq \delta \Rightarrow |f(x) - f(a)| \leq \varepsilon$.`,
      hypotheses: [],
      idea: R`Échanger « $\forall$ » et « $\exists$ » change le sens. Seul le sens « $\exists\,\forall \Rightarrow \forall\,\exists$ » est toujours vrai.`,
      examples: [
        R`« $\forall x \in \mathbb{R},\ \exists n \in \mathbb{N},\ n > x$ » est vraie. « $\exists n \in \mathbb{N},\ \forall x \in \mathbb{R},\ n > x$ » est fausse.`
      ],
      counterexamples: [],
      pitfalls: [
        R`« $\forall x \in A,\ \exists M,\ |f(x)| \leq M$ » est vraie pour toute fonction (prendre $M = |f(x)|$). « $f$ est bornée sur $A$ » s'écrit $\exists M,\ \forall x \in A,\ |f(x)| \leq M$.`
      ],
      notations: [],
      prereqs: []
    },
    {
      id: 'sfp-sup', lesson: 'sf-l0', kind: 'Rappels',
      title: 'Borne supérieure et norme uniforme',
      status: 'programme', level: 'cpge', proof: null, source: null,
      statement: R`Si $g$ est bornée sur $A$, on pose $\|g\|_{\infty, A} = \sup_{x \in A} |g(x)|$ : c'est le plus petit des majorants de $|g|$ sur $A$.
**Pour majorer** $\|g\|_{\infty, A}$ par $M$ : montrer que $|g(x)| \leq M$ pour **tout** $x \in A$.
**Pour minorer** $\|g\|_{\infty, A}$ : une seule valeur suffit, $|g(x_0)| \leq \|g\|_{\infty, A}$ pour tout $x_0 \in A$.`,
      hypotheses: [R`La fonction doit être **bornée** sur $A$ pour que la norme uniforme soit définie.`],
      idea: R`Quand $g$ est dérivable, un tableau de variations donne la valeur exacte de la borne supérieure.`,
      examples: [
        R`$\|x \mapsto x(1 - x)\|_{\infty, [0, 1]} = \frac{1}{4}$, atteint en $x = \frac{1}{2}$.`,
        R`$\|x \mapsto x^n\|_{\infty, [0, 1]} = 1$, atteint en $x = 1$.`
      ],
      counterexamples: [
        R`Sur $[0, 1[$, $\sup x = 1$ n'est pas atteint.`
      ],
      pitfalls: [
        R`Une inégalité stricte en chaque point ne passe pas à la borne supérieure : $x < 1$ pour tout $x \in [0, 1[$, et pourtant $\sup_{[0, 1[} x = 1$.`
      ],
      notations: [R`On rencontre aussi $\|g\|_\infty$ (quand l'ensemble est clair) et $N_\infty(g)$.`],
      prereqs: ['sfp-quantificateurs']
    },
    {
      id: 'sfp-series', lesson: 'sf-l0', kind: 'Rappels',
      title: 'Séries numériques',
      status: 'programme', level: 'cpge', proof: null, source: null,
      statement: R`La série $\sum u_n$ converge si la suite de ses sommes partielles converge. Son **reste** $R_n = \sum_{k=n+1}^{+\infty} u_k$ tend alors vers $0$.
**Convergence absolue.** Si $\sum |u_n|$ converge, alors $\sum u_n$ converge.
**Comparaison.** Si $0 \leq u_n \leq v_n$ et si $\sum v_n$ converge, alors $\sum u_n$ converge.
**Séries de référence.** $\sum \frac{1}{n^\alpha}$ converge si et seulement si $\alpha > 1$ ; $\sum q^n$ converge si et seulement si $|q| < 1$.
**Séries alternées.** Si $(a_n)$ est décroissante de limite nulle, alors $\sum (-1)^n a_n$ converge et $|R_n| \leq a_{n+1}$.`,
      hypotheses: [
        R`Comparaison : les termes sont **positifs**.`,
        R`Séries alternées : $(a_n)$ est **décroissante** et tend vers $0$.`
      ],
      idea: R`Dans ce chapitre, ces critères servent à majorer $\|f_n\|_\infty$ ou un reste par une quantité indépendante de $x$.`,
      examples: [
        R`$\sum \frac{1}{n^2}$ converge ; $\sum \frac{(-1)^n}{n}$ converge sans converger absolument.`
      ],
      counterexamples: [
        R`$\sum \frac{1}{n}$ diverge, bien que son terme général tende vers $0$.`
      ],
      pitfalls: [
        R`« $u_n \to 0$ » est nécessaire à la convergence de $\sum u_n$, mais pas suffisant.`
      ],
      notations: [],
      prereqs: []
    }
  ],

  questions: [
    {
      id: 'sf-l0-q1', lesson: 'sf-l0', notion: 'sfp-quantificateurs', type: 'mcq', tag: 'hypotheses',
      prompt: R`Dans laquelle de ces phrases l'entier $N$ est-il **le même pour tous les $x$** ?`,
      options: [
        R`$\exists N \in \mathbb{N},\ \forall x \in A,\ P(N, x)$`,
        R`$\forall x \in A,\ \exists N \in \mathbb{N},\ P(N, x)$`,
        R`Dans les deux`,
        R`Dans aucune des deux`
      ],
      answer: 0,
      explain: R`Un objet introduit par « il existe » peut dépendre de ce qui a été introduit avant lui. Dans la deuxième phrase, $N$ vient après $x$ : il peut en dépendre.`
    },
    {
      id: 'sf-l0-q2', lesson: 'sf-l0', notion: 'sfp-quantificateurs', type: 'tf', tag: 'piege',
      prompt: R`La phrase « $\forall x \in A,\ \exists M \in \mathbb{R},\ |f(x)| \leq M$ » signifie que $f$ est bornée sur $A$.`,
      answer: false,
      explain: R`Cette phrase est vraie pour toute fonction : il suffit de prendre $M = |f(x)|$. « $f$ bornée » s'écrit avec $M$ en premier : $\exists M,\ \forall x \in A,\ |f(x)| \leq M$.`
    },
    {
      id: 'sf-l0-q3', lesson: 'sf-l0', notion: 'sfp-sup', type: 'mcq', tag: 'application',
      prompt: R`Que vaut $\sup_{x \in [0, 1]} x(1 - x)$ ?`,
      options: [R`$\frac{1}{4}$`, R`$\frac{1}{2}$`, R`$1$`, R`$0$`],
      answer: 0,
      explain: R`$x \mapsto x - x^2$ a pour dérivée $1 - 2x$ : elle croît sur $[0, \frac{1}{2}]$ puis décroît, et vaut $\frac{1}{4}$ en $\frac{1}{2}$.`
    },
    {
      id: 'sf-l0-q4', lesson: 'sf-l0', notion: 'sfp-sup', type: 'tf', tag: 'piege',
      prompt: R`Si $|g(x)| < 1$ pour tout $x \in A$, alors $\|g\|_{\infty, A} < 1$.`,
      answer: false,
      explain: R`Pour $g(x) = x$ sur $A = [0, 1[$ : $|g(x)| < 1$ partout, mais $\|g\|_{\infty, A} = 1$. Les inégalités strictes deviennent larges en passant à la borne supérieure.`
    },
    {
      id: 'sf-l0-q5', lesson: 'sf-l0', notion: 'sfp-series', type: 'multi', tag: 'application',
      prompt: R`Cochez les séries convergentes.`,
      options: [R`$\sum \frac{1}{n^2}$`, R`$\sum \frac{(-1)^n}{n}$`, R`$\sum \frac{1}{n}$`, R`$\sum \frac{1}{\sqrt{n}}$`],
      answers: [0, 1],
      explain: R`Séries de Riemann : convergence si et seulement si l'exposant est strictement supérieur à $1$. La série $\sum \frac{(-1)^n}{n}$ converge par le critère des séries alternées.`
    },
    {
      id: 'sf-l0-q6', lesson: 'sf-l0', notion: 'sfp-series', type: 'tf', tag: 'piege',
      prompt: R`Si $u_n \to 0$, alors la série $\sum u_n$ converge.`,
      answer: false,
      explain: R`$\sum \frac{1}{n}$ diverge alors que $\frac{1}{n} \to 0$. La condition est nécessaire, pas suffisante.`
    },
    {
      id: 'sf-l0-q7', lesson: 'sf-l0', notion: 'sfp-series', type: 'mcq', tag: 'restitution',
      prompt: R`Soit $(a_n)$ une suite décroissante de limite nulle. Quelle majoration du reste $R_n = \sum_{k=n+1}^{+\infty} (-1)^k a_k$ donne le critère des séries alternées ?`,
      options: [R`$|R_n| \leq a_{n+1}$`, R`$|R_n| \leq a_0$`, R`$|R_n| \leq \frac{1}{n}$`, R`$|R_n| \leq \sum_{k > n} a_k$, sans mieux`],
      answer: 0,
      explain: R`Le reste est majoré en valeur absolue par son premier terme. C'est cette majoration qui permet d'obtenir des convergences uniformes sans convergence normale.`
    }
  ]
};
