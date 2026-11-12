/*
 * Lemme — contenu source du chapitre « Suites et séries de fonctions ».
 *
 * Même format que content-src/reduction/cours.js (voir son en-tête pour la
 * syntaxe des textes, les statuts et les types de questions).
 * Tous les identifiants de ce chapitre commencent par « sf- ».
 *
 * Le programme de MP place ce chapitre dans un cadre général (fonctions d'une
 * partie d'un espace de dimension finie vers un espace normé de dimension
 * finie). On se limite ici, comme le programme le recommande en pratique, aux
 * fonctions d'une variable réelle à valeurs réelles ou complexes.
 *
 * Tout le contenu est en statut « à relire » tant qu'un enseignant ne l'a pas validé.
 */
const R = String.raw;

module.exports = {
  id: 'suites-fonctions',
  title: 'Suites et séries de fonctions',
  review: 'a-relire',
  frame: R`Dans tout le chapitre, $A$ désigne une partie non vide de $\mathbb{R}$, $I$ un intervalle de $\mathbb{R}$ non réduit à un point, et $\mathbb{K}$ désigne $\mathbb{R}$ ou $\mathbb{C}$. Les fonctions $f_n$ et $f$ sont définies sur $A$ (ou sur $I$) et à valeurs dans $\mathbb{K}$.`,

  sources: [
    {
      id: 'sf-prog-mp',
      label: 'Programme de mathématiques de MP, section « Suites et séries de fonctions »',
      url: 'https://cahier-de-prepa.fr/mp2-montaigne/download?id=96'
    }
  ],

  /* ================================================================== */
  /* Notions                                                             */
  /* ================================================================== */
  notions: [
    /* ---------------- Leçon 1 : modes de convergence ---------------- */
    {
      id: 'sf-cvs', lesson: 'sf-l1', kind: 'Définition',
      title: 'Convergence simple',
      status: 'programme', level: 'cpge', proof: null, source: 'sf-prog-mp',
      statement: R`La suite $(f_n)$ **converge simplement** vers $f$ sur $A$ si, pour tout $x \in A$, la suite numérique $(f_n(x))$ converge vers $f(x)$ :
$$\begin{gathered} \forall x \in A,\ \forall \varepsilon > 0,\ \exists N \in \mathbb{N}, \\ \forall n \geq N,\ |f_n(x) - f(x)| \leq \varepsilon. \end{gathered}$$`,
      hypotheses: [R`Le rang $N$ dépend de $\varepsilon$ **et de $x$**.`],
      idea: R`On étudie la limite point par point : on fixe $x$, puis on fait tendre $n$ vers $+\infty$.`,
      counterexamples: [
        R`$f_n(x) = x^n$ sur $[0, 1]$ : la limite simple vaut $0$ sur $[0, 1[$ et $1$ en $1$. Chaque $f_n$ est continue, la limite ne l'est pas.`
      ],
      pitfalls: [
        R`La convergence simple ne transmet à la limite ni la continuité, ni la valeur de l'intégrale, ni la dérivabilité.`
      ],
      notations: [R`On abrège souvent en « CVS ».`]
    },
    {
      id: 'sf-cvu', lesson: 'sf-l1', kind: 'Définition',
      title: 'Convergence uniforme',
      status: 'programme', level: 'cpge', proof: 'exigible', source: 'sf-prog-mp',
      statement: R`La suite $(f_n)$ **converge uniformément** vers $f$ sur $A$ si
$$\begin{gathered} \forall \varepsilon > 0,\ \exists N \in \mathbb{N},\ \forall n \geq N, \\ \forall x \in A,\ |f_n(x) - f(x)| \leq \varepsilon. \end{gathered}$$
Cela équivaut à : $f_n - f$ est bornée sur $A$ à partir d'un certain rang et $\|f_n - f\|_{\infty, A} \to 0$, où
$$\|f_n - f\|_{\infty, A} = \sup_{x \in A} |f_n(x) - f(x)|.$$
La convergence uniforme entraîne la convergence simple.`,
      hypotheses: [
        R`Le rang $N$ ne dépend **que de $\varepsilon$** : le même $N$ convient pour tous les $x$ de $A$.`,
        R`La convergence uniforme est toujours relative à **un ensemble** : il faut dire sur quelle partie elle a lieu.`
      ],
      idea: R`Entre la convergence simple et la convergence uniforme, seule la place de « $\forall x \in A$ » change. À partir du rang $N$, le graphe de $f_n$ reste dans une bande de demi-largeur $\varepsilon$ autour de celui de $f$.`,
      counterexamples: [
        R`$f_n(x) = x^n$ sur $[0, 1[$ : la limite simple est nulle, mais $\sup_{[0,1[} x^n = 1$ pour tout $n$. La convergence n'est pas uniforme sur $[0, 1[$.`,
        R`$f_n(x) = \frac{x}{n}$ sur $\mathbb{R}$ : la limite simple est nulle, mais $f_n$ n'est pas bornée sur $\mathbb{R}$.`
      ],
      pitfalls: [
        R`« Uniforme sur tout segment de $I$ » n'entraîne pas « uniforme sur $I$ » : $x^n$ converge uniformément sur $[0, a]$ pour tout $a < 1$, mais pas sur $[0, 1[$.`
      ],
      notations: [
        R`$\|g\|_{\infty}$, $\|g\|_{\infty, A}$ ou $N_\infty(g)$ désignent $\sup_{x \in A} |g(x)|$, pour $g$ bornée sur $A$.`,
        R`On abrège souvent en « CVU ».`
      ]
    },
    {
      id: 'sf-methode-cvu', lesson: 'sf-l1', kind: 'Méthode',
      title: 'Prouver ou réfuter une convergence uniforme',
      status: 'programme', level: 'cpge', proof: 'exigible', source: 'sf-prog-mp',
      statement: R`On détermine d'abord la limite simple $f$.
**Pour prouver** la convergence uniforme sur $A$ : trouver une suite $(\alpha_n)$ de limite nulle, **indépendante de $x$**, telle que $|f_n(x) - f(x)| \leq \alpha_n$ pour tout $x \in A$. À défaut, calculer $\|f_n - f\|_{\infty, A}$ par une étude de variations.
**Pour réfuter** : trouver une suite $(x_n)$ de points de $A$ telle que $f_n(x_n) - f(x_n)$ ne tende pas vers $0$.`,
      hypotheses: [R`La majoration par $\alpha_n$ doit valoir pour **tous** les $x$ de $A$, avec $\alpha_n$ qui ne dépend pas de $x$.`],
      idea: R`Réfuter par une suite $(x_n)$ : si la convergence était uniforme, on aurait $|f_n(x_n) - f(x_n)| \leq \|f_n - f\|_{\infty, A} \to 0$.`,
      counterexamples: [],
      pitfalls: [
        R`Majorer $|f_n(x) - f(x)|$ par une quantité qui tend vers $0$ **à $x$ fixé** ne prouve que la convergence simple.`
      ],
      notations: []
    },

    /* ---------------- Leçon 2 : continuité, double limite ---------------- */
    {
      id: 'sf-continuite', lesson: 'sf-l2', kind: 'Théorème',
      title: 'Continuité de la limite uniforme',
      status: 'programme', level: 'cpge', proof: 'exigible', source: 'sf-prog-mp',
      statement: R`Soit $a \in A$. Si les $f_n$ sont continues en $a$ et si $(f_n)$ converge uniformément vers $f$ **sur un voisinage de $a$**, alors $f$ est continue en $a$.
**Conséquences.** Toute limite uniforme sur $A$ de fonctions continues sur $A$ est continue sur $A$. Sur un intervalle $I$, il suffit que la convergence soit uniforme **sur tout segment** de $I$.`,
      hypotheses: [
        R`Les $f_n$ sont **continues** en $a$.`,
        R`La convergence est **uniforme** au voisinage de $a$ (la convergence simple ne suffit pas).`
      ],
      idea: R`Découpage en trois : $f(x) - f(a) = \big(f(x) - f_N(x)\big) + \big(f_N(x) - f_N(a)\big) + \big(f_N(a) - f(a)\big)$. Les termes extrêmes sont petits par convergence uniforme, celui du milieu par continuité de $f_N$.`,
      counterexamples: [
        R`$f_n(x) = x^n$ sur $[0, 1]$ : fonctions continues, limite simple discontinue en $1$.`
      ],
      pitfalls: [
        R`La réciproque est fausse : une suite de fonctions continues peut converger simplement vers une fonction continue sans que la convergence soit uniforme, comme $f_n(x) = n x e^{-nx}$ sur $[0, +\infty[$.`,
        R`Ce théorème sert souvent par contraposée : fonctions continues et limite discontinue, donc pas de convergence uniforme.`
      ],
      notations: []
    },
    {
      id: 'sf-double-limite', lesson: 'sf-l2', kind: 'Théorème',
      title: 'Théorème de la double limite',
      status: 'programme', level: 'cpge', proof: 'non-exigible', source: 'sf-prog-mp',
      statement: R`Soit $a$ un point adhérent à $A$ (ou $a = \pm\infty$ si $A$ n'est pas majorée ou minorée). On suppose que $(f_n)$ converge **uniformément** vers $f$ sur $A$ et que chaque $f_n$ admet une limite finie $\ell_n$ en $a$. Alors la suite $(\ell_n)$ converge vers un nombre $\ell$, et $f(x) \to \ell$ quand $x \to a$ :
$$\lim_{x \to a}\ \lim_{n \to +\infty} f_n(x) = \lim_{n \to +\infty}\ \lim_{x \to a} f_n(x).$$`,
      hypotheses: [
        R`Convergence **uniforme sur $A$**, donc jusqu'au voisinage de $a$ : la convergence uniforme sur tout segment ne suffit pas quand $a$ est une borne exclue.`,
        R`Chaque $f_n$ a une limite **finie** en $a$.`
      ],
      idea: R`La démonstration n'est pas exigible. L'existence de la limite de $(\ell_n)$ fait partie de la conclusion : on n'a pas à la supposer.`,
      counterexamples: [
        R`$f_n(x) = x^n$ sur $[0, 1[$ avec $a = 1$ : $\ell_n = 1$, mais la limite simple est nulle, donc $f(x) \to 0$. Les deux limites diffèrent : la convergence n'est pas uniforme sur $[0, 1[$.`
      ],
      pitfalls: [
        R`Ce théorème sert aussi à **réfuter** une convergence uniforme : si l'interversion des limites échoue, la convergence n'est pas uniforme au voisinage de $a$.`
      ],
      notations: [R`On parle aussi de « théorème d'interversion des limites ».`]
    },
    {
      id: 'sf-weierstrass', lesson: 'sf-l2', kind: 'Théorème',
      title: 'Approximation uniforme',
      status: 'programme', level: 'cpge', proof: 'non-exigible', source: 'sf-prog-mp',
      statement: R`**Théorème de Weierstrass.** Toute fonction continue sur un **segment** $[a, b]$, à valeurs dans $\mathbb{K}$, est limite uniforme sur $[a, b]$ d'une suite de fonctions polynomiales.
**Fonctions en escalier.** Toute fonction continue par morceaux sur un segment est limite uniforme d'une suite de fonctions en escalier.`,
      hypotheses: [R`L'ensemble de départ est un **segment**.`],
      idea: R`La démonstration du théorème de Weierstrass n'est pas exigible. Usage type : remplacer une fonction continue par un polynôme, à $\varepsilon$ près en norme uniforme, pour se ramener à un calcul sur les monômes.`,
      counterexamples: [
        R`Sur $\mathbb{R}$ entier, c'est faux : une limite uniforme sur $\mathbb{R}$ de fonctions polynomiales est polynomiale, donc $\exp$ n'en est pas une.`
      ],
      pitfalls: [
        R`Le théorème donne des polynômes qui approchent $f$ ; il ne dit pas que le développement de Taylor de $f$ converge vers $f$.`
      ],
      notations: []
    },

    /* ---------------- Leçon 3 : intégration, dérivation ---------------- */
    {
      id: 'sf-integration', lesson: 'sf-l3', kind: 'Théorème',
      title: 'Intégration sur un segment',
      status: 'programme', level: 'cpge', proof: 'exigible', source: 'sf-prog-mp',
      statement: R`Si les $f_n$ sont **continues** sur le segment $[a, b]$ et si $(f_n)$ converge **uniformément** vers $f$ sur $[a, b]$, alors $f$ est continue et
$$\int_a^b f_n(t)\,\mathrm{d}t \xrightarrow[n \to +\infty]{} \int_a^b f(t)\,\mathrm{d}t.$$
Plus généralement, si la convergence est uniforme sur tout segment de $I$ et $c \in I$, alors $x \mapsto \int_c^x f_n$ converge uniformément vers $x \mapsto \int_c^x f$ sur tout segment de $I$.`,
      hypotheses: [
        R`On intègre sur un **segment**.`,
        R`La convergence est **uniforme** sur ce segment.`
      ],
      idea: R`$\left| \int_a^b f_n - \int_a^b f \right| \leq (b - a)\,\|f_n - f\|_{\infty, [a,b]}$.`,
      counterexamples: [
        R`$f_n(x) = n^2 x (1 - x)^n$ sur $[0, 1]$ : la limite simple est nulle, mais $\int_0^1 f_n = \frac{n^2}{(n+1)(n+2)} \to 1$.`,
        R`Sur un intervalle non borné, la convergence uniforme ne suffit plus : la fonction valant $\frac{1}{n}$ sur $[0, n]$ et $0$ ailleurs converge uniformément vers $0$ sur $[0, +\infty[$, alors que son intégrale vaut toujours $1$.`
      ],
      pitfalls: [
        R`Sur un intervalle quelconque, l'outil adapté est le théorème de convergence dominée, pas la convergence uniforme.`
      ],
      notations: []
    },
    {
      id: 'sf-derivation', lesson: 'sf-l3', kind: 'Théorème',
      title: 'Dérivation de la limite',
      status: 'programme', level: 'cpge', proof: 'exigible', source: 'sf-prog-mp',
      statement: R`On suppose que :
(i) chaque $f_n$ est de classe $\mathcal{C}^1$ sur l'intervalle $I$ ;
(ii) $(f_n)$ converge **simplement** vers $f$ sur $I$ ;
(iii) $(f_n')$ converge **uniformément sur tout segment** de $I$ vers une fonction $g$.
Alors $f$ est de classe $\mathcal{C}^1$ sur $I$, $f' = g$, et $(f_n)$ converge uniformément vers $f$ sur tout segment de $I$.
**Extension.** Pour des fonctions de classe $\mathcal{C}^k$ : convergence simple de $(f_n^{(j)})$ pour $0 \leq j \leq k - 1$ et convergence uniforme sur tout segment de $(f_n^{(k)})$.`,
      hypotheses: [
        R`La convergence uniforme porte sur la suite **des dérivées** $(f_n')$.`,
        R`Pour $(f_n)$ elle-même, la convergence **simple** suffit.`
      ],
      idea: R`On écrit $f_n(x) = f_n(a) + \int_a^x f_n'(t)\,\mathrm{d}t$ et on passe à la limite grâce au théorème d'intégration.`,
      counterexamples: [
        R`$f_n(x) = \sqrt{x^2 + \frac{1}{n}}$ : fonctions de classe $\mathcal{C}^1$ convergeant uniformément sur $\mathbb{R}$ vers $x \mapsto |x|$, qui n'est pas dérivable en $0$.`,
        R`$f_n(x) = \frac{\sin(nx)}{\sqrt{n}}$ : converge uniformément vers $0$ sur $\mathbb{R}$, mais $f_n'(0) = \sqrt{n}$ diverge.`
      ],
      pitfalls: [
        R`La convergence uniforme de $(f_n)$ ne dit rien sur la dérivabilité de la limite : c'est l'erreur la plus fréquente sur ce théorème.`
      ],
      notations: []
    },

    /* ---------------- Leçon 4 : séries de fonctions ---------------- */
    {
      id: 'sf-series-modes', lesson: 'sf-l4', kind: 'Définition',
      title: 'Convergences simple, uniforme et normale d\'une série',
      status: 'programme', level: 'cpge', proof: 'exigible', source: 'sf-prog-mp',
      statement: R`La série $\sum f_n$ converge simplement (resp. uniformément) sur $A$ si la suite de ses sommes partielles $S_n = \sum_{k=0}^{n} f_k$ converge simplement (resp. uniformément) sur $A$.
Elle converge uniformément sur $A$ si et seulement si elle converge simplement et si la suite de ses restes $R_n = \sum_{k=n+1}^{+\infty} f_k$ converge uniformément vers $0$.
Elle **converge normalement** sur $A$ si chaque $f_n$ est bornée sur $A$ et si la série numérique $\sum \|f_n\|_{\infty, A}$ converge.
**Théorème.** La convergence normale entraîne la convergence uniforme, et la convergence absolue en tout point.`,
      hypotheses: [
        R`Convergence normale : c'est la série des **bornes supérieures** $\|f_n\|_{\infty, A}$ qui doit converger.`
      ],
      idea: R`En pratique, pour la convergence normale, on cherche $\alpha_n$ indépendant de $x$ tel que $|f_n(x)| \leq \alpha_n$ pour tout $x \in A$, avec $\sum \alpha_n$ convergente.`,
      counterexamples: [
        R`$\sum_{n \geq 1} \frac{(-1)^n}{n + x}$ sur $[0, +\infty[$ converge uniformément (critère des séries alternées) mais pas normalement : $\|f_n\|_\infty = \frac{1}{n}$.`,
        R`$\sum x^n$ sur $]-1, 1[$ converge simplement, mais ni normalement ni uniformément : $\|x^n\|_{\infty} = 1$.`
      ],
      pitfalls: [
        R`La convergence de $\sum |f_n(x)|$ pour chaque $x$ (convergence absolue en tout point) n'est pas la convergence normale.`,
        R`Si $(f_n)$ ne converge pas uniformément vers $0$, la série $\sum f_n$ ne peut pas converger uniformément.`
      ],
      notations: [R`On abrège souvent en « CVN ».`]
    },
    {
      id: 'sf-series-theoremes', lesson: 'sf-l4', kind: 'Théorème',
      title: 'Régularité de la somme d\'une série de fonctions',
      status: 'programme', level: 'cpge', proof: 'exigible', source: 'sf-prog-mp',
      statement: R`Les théorèmes sur les suites s'appliquent à la suite des sommes partielles. On note $S = \sum_{n=0}^{+\infty} f_n$.
**Continuité.** Si les $f_n$ sont continues sur $I$ et si $\sum f_n$ converge uniformément sur tout segment de $I$, alors $S$ est continue sur $I$.
**Double limite.** Si $\sum f_n$ converge uniformément sur $A$ et si $f_n(x) \to \ell_n$ quand $x \to a$, alors $\sum \ell_n$ converge et $S(x) \to \sum_{n=0}^{+\infty} \ell_n$.
**Intégration terme à terme.** Si les $f_n$ sont continues sur $[a, b]$ et si $\sum f_n$ converge uniformément sur $[a, b]$, alors $\int_a^b S = \sum_{n=0}^{+\infty} \int_a^b f_n$.
**Dérivation terme à terme.** Si les $f_n$ sont de classe $\mathcal{C}^1$ sur $I$, si $\sum f_n$ converge simplement sur $I$ et si $\sum f_n'$ converge uniformément sur tout segment de $I$, alors $S$ est de classe $\mathcal{C}^1$ et $S' = \sum_{n=0}^{+\infty} f_n'$.`,
      hypotheses: [
        R`Dérivation : la convergence uniforme porte sur la **série des dérivées**.`,
        R`Intégration terme à terme : sur un **segment**.`
      ],
      idea: R`Dans la quasi-totalité des cas, la convergence uniforme requise s'obtient par convergence normale.`,
      counterexamples: [
        R`$\sum_{n \geq 1} \frac{\sin(nx)}{n^2}$ converge normalement sur $\mathbb{R}$, donc sa somme est continue. Mais la série des dérivées $\sum \frac{\cos(nx)}{n}$ diverge en $x = 0$ : le théorème de dérivation ne s'applique pas.`
      ],
      pitfalls: [
        R`Pour la fonction $\zeta(x) = \sum_{n \geq 1} \frac{1}{n^x}$ : convergence normale sur $[a, +\infty[$ pour tout $a > 1$, mais pas de convergence uniforme sur $]1, +\infty[$. Cela suffit pourtant à la continuité sur $]1, +\infty[$.`
      ],
      notations: []
    }
  ],

  /* ================================================================== */
  /* Leçons                                                              */
  /* ================================================================== */
  lessons: [
    { id: 'sf-l1', title: 'Modes de convergence', blurb: 'Convergence simple, convergence uniforme, et comment les distinguer.' },
    { id: 'sf-l2', title: 'Continuité et double limite', blurb: 'Ce que la convergence uniforme transmet à la limite.' },
    { id: 'sf-l3', title: 'Intégration et dérivation', blurb: 'Intervertir limite et intégrale, limite et dérivée.' },
    { id: 'sf-l4', title: 'Séries de fonctions', blurb: 'Convergence normale, régularité de la somme.' }
  ],

  /* ================================================================== */
  /* Questions                                                           */
  /* ================================================================== */
  questions: [
    /* ---------------- Leçon 1 ---------------- */
    {
      id: 'sf-l1-q1', lesson: 'sf-l1', notion: 'sf-cvu', type: 'mcq', tag: 'hypotheses',
      prompt: R`Laquelle de ces phrases traduit la convergence **uniforme** de $(f_n)$ vers $f$ sur $A$ ?`,
      options: [
        R`$\forall \varepsilon > 0,\ \exists N,\ \forall n \geq N,\ \forall x \in A,\ |f_n(x) - f(x)| \leq \varepsilon$`,
        R`$\forall \varepsilon > 0,\ \forall x \in A,\ \exists N,\ \forall n \geq N,\ |f_n(x) - f(x)| \leq \varepsilon$`,
        R`$\exists N,\ \forall \varepsilon > 0,\ \forall n \geq N,\ \forall x \in A,\ |f_n(x) - f(x)| \leq \varepsilon$`,
        R`$\forall x \in A,\ \exists \varepsilon > 0,\ \exists N,\ \forall n \geq N,\ |f_n(x) - f(x)| \leq \varepsilon$`
      ],
      answer: 0,
      explain: R`Dans la convergence uniforme, $N$ est choisi **avant** $x$ : il ne dépend que de $\varepsilon$. La deuxième phrase est la convergence simple. La troisième dirait que $f_n = f$ à partir d'un certain rang.`
    },
    {
      id: 'sf-l1-q2', lesson: 'sf-l1', notion: 'sf-cvu', type: 'tf', tag: 'restitution',
      prompt: R`Si $(f_n)$ converge uniformément vers $f$ sur $A$, alors $(f_n)$ converge simplement vers $f$ sur $A$.`,
      answer: true,
      explain: R`Pour $x \in A$ fixé, $|f_n(x) - f(x)| \leq \|f_n - f\|_{\infty, A}$, qui tend vers $0$.`
    },
    {
      id: 'sf-l1-q3', lesson: 'sf-l1', notion: 'sf-cvs', type: 'tf', tag: 'piege',
      prompt: R`Si des fonctions continues $f_n$ convergent simplement vers $f$ sur $A$, alors $f$ est continue sur $A$.`,
      answer: false,
      explain: R`$f_n(x) = x^n$ sur $[0, 1]$ : la limite simple vaut $0$ sur $[0, 1[$ et $1$ en $1$. C'est la convergence **uniforme** qui transmet la continuité.`
    },
    {
      id: 'sf-l1-q4', lesson: 'sf-l1', notion: 'sf-cvu', type: 'mcq', tag: 'cadre',
      prompt: R`On pose $f_n(x) = \dfrac{x}{n}$ pour $x \in \mathbb{R}$ et $n \geq 1$. Quelle affirmation est exacte ?`,
      options: [
        R`$(f_n)$ converge simplement vers $0$ sur $\mathbb{R}$, uniformément sur tout segment, mais pas uniformément sur $\mathbb{R}$`,
        R`$(f_n)$ converge uniformément vers $0$ sur $\mathbb{R}$`,
        R`$(f_n)$ ne converge pas simplement sur $\mathbb{R}$`,
        R`$(f_n)$ converge uniformément sur $\mathbb{R}$ mais pas sur les segments`
      ],
      answer: 0,
      explain: R`Sur $[-M, M]$ : $|f_n(x)| \leq \frac{M}{n} \to 0$. Sur $\mathbb{R}$ : $f_n$ n'est pas bornée, donc $\|f_n\|_{\infty, \mathbb{R}}$ n'est même pas définie. La convergence uniforme dépend de l'ensemble.`
    },
    {
      id: 'sf-l1-q5', lesson: 'sf-l1', notion: 'sf-cvu', type: 'tf', tag: 'piege',
      prompt: R`Si $(f_n)$ converge uniformément sur $[0, a]$ pour tout $a \in [0, 1[$, alors $(f_n)$ converge uniformément sur $[0, 1[$.`,
      answer: false,
      explain: R`$f_n(x) = x^n$ : sur $[0, a]$, $\sup x^n = a^n \to 0$ ; mais sur $[0, 1[$, $\sup x^n = 1$. Le rang $N$ dépend de $a$ et n'est pas borné quand $a \to 1$.`
    },
    {
      id: 'sf-l1-q6', lesson: 'sf-l1', notion: 'sf-methode-cvu', type: 'mcq', tag: 'application',
      prompt: R`$(f_n)$ converge simplement vers $f$ sur $A$. Pour montrer que la convergence n'est **pas** uniforme sur $A$, il suffit de trouver…`,
      options: [
        R`une suite $(x_n)$ de points de $A$ telle que $f_n(x_n) - f(x_n)$ ne tende pas vers $0$`,
        R`un point $x \in A$ tel que $f_n(x) \neq f(x)$ pour tout $n$`,
        R`une suite $(x_n)$ de points de $A$ telle que $f_n(x_n)$ ne tende pas vers $0$`,
        R`un entier $n$ tel que $\|f_n - f\|_{\infty, A} > 0$`
      ],
      answer: 0,
      explain: R`Si la convergence était uniforme, $|f_n(x_n) - f(x_n)| \leq \|f_n - f\|_{\infty, A} \to 0$. Attention à bien comparer $f_n(x_n)$ à $f(x_n)$, et non à $0$.`
    },
    {
      id: 'sf-l1-q7', lesson: 'sf-l1', notion: 'sf-methode-cvu', type: 'mcq', tag: 'application',
      prompt: R`On pose $f_n(x) = n x e^{-nx}$ sur $[0, +\infty[$. La limite simple est la fonction nulle, et $f_n\!\left(\frac{1}{n}\right) = e^{-1}$. Qu'en conclut-on ?`,
      options: [
        R`La convergence n'est pas uniforme sur $[0, +\infty[$`,
        R`La convergence est uniforme sur $[0, +\infty[$`,
        R`La suite ne converge pas simplement en $0$`,
        R`La limite simple vaut $e^{-1}$`
      ],
      answer: 0,
      explain: R`Avec $x_n = \frac{1}{n}$ : $f_n(x_n) - 0 = e^{-1}$ ne tend pas vers $0$, donc $\|f_n\|_\infty \geq e^{-1}$. La limite simple est bien nulle : à $x > 0$ fixé, $n x e^{-nx} \to 0$.`
    },
    {
      id: 'sf-l1-q8', lesson: 'sf-l1', notion: 'sf-cvu', type: 'mcq', tag: 'notation',
      prompt: R`Que désigne $\|f_n - f\|_{\infty, A}$ ?`,
      options: [
        R`$\sup_{x \in A} |f_n(x) - f(x)|$`,
        R`$\inf_{x \in A} |f_n(x) - f(x)|$`,
        R`$\lim_{x \to +\infty} |f_n(x) - f(x)|$`,
        R`$\int_A |f_n(x) - f(x)|\,\mathrm{d}x$`
      ],
      answer: 0,
      explain: R`C'est la norme uniforme (ou norme infinie) sur $A$, définie pour une fonction bornée sur $A$. Cette borne supérieure n'est pas toujours atteinte.`
    },
    {
      id: 'sf-l1-q9', lesson: 'sf-l1', notion: 'sf-cvu', type: 'card', tag: 'restitution',
      prompt: R`Écrivez avec des quantificateurs la convergence simple et la convergence uniforme de $(f_n)$ vers $f$ sur $A$. Quelle est la seule différence ?`,
      back: R`**Simple.** $\forall x \in A,\ \forall \varepsilon > 0,\ \exists N,\ \forall n \geq N,\ |f_n(x) - f(x)| \leq \varepsilon$.
**Uniforme.** $\forall \varepsilon > 0,\ \exists N,\ \forall n \geq N,\ \forall x \in A,\ |f_n(x) - f(x)| \leq \varepsilon$.
**Différence.** La place de « $\forall x \in A$ » : dans la convergence uniforme, $N$ ne dépend pas de $x$.`,
      explain: R`Formulation équivalente à connaître : $\|f_n - f\|_{\infty, A} \to 0$.`
    },

    /* ---------------- Leçon 2 ---------------- */
    {
      id: 'sf-l2-q1', lesson: 'sf-l2', notion: 'sf-continuite', type: 'multi', tag: 'hypotheses',
      prompt: R`On veut conclure que la limite $f$ est continue en un point $a$ de $A$. Cochez les hypothèses du théorème.`,
      options: [
        R`Chaque $f_n$ est continue en $a$`,
        R`$(f_n)$ converge uniformément vers $f$ sur un voisinage de $a$`,
        R`$(f_n)$ converge uniformément vers $f$ sur $A$ tout entier`,
        R`$A$ est un segment`
      ],
      answers: [0, 1],
      explain: R`La continuité est une propriété locale : la convergence uniforme au voisinage de $a$ suffit. La convergence uniforme sur $A$ entier est suffisante, mais ce n'est pas l'hypothèse minimale du théorème.`
    },
    {
      id: 'sf-l2-q2', lesson: 'sf-l2', notion: 'sf-continuite', type: 'tf', tag: 'restitution',
      prompt: R`Si les $f_n$ sont continues sur un intervalle $I$ et si $(f_n)$ converge uniformément vers $f$ sur tout segment de $I$, alors $f$ est continue sur $I$.`,
      answer: true,
      explain: R`Tout point de $I$ admet un voisinage dans $I$ qui est un segment de $I$ : la convergence y est uniforme, donc $f$ est continue en ce point.`
    },
    {
      id: 'sf-l2-q3', lesson: 'sf-l2', notion: 'sf-continuite', type: 'tf', tag: 'piege',
      prompt: R`Si des fonctions continues $f_n$ convergent simplement sur $A$ vers une fonction $f$ continue, alors la convergence est uniforme sur $A$.`,
      answer: false,
      explain: R`C'est la réciproque du théorème, et elle est fausse. $f_n(x) = n x e^{-nx}$ sur $[0, +\infty[$ : fonctions continues, limite nulle donc continue, mais $f_n\!\left(\frac{1}{n}\right) = e^{-1}$.`
    },
    {
      id: 'sf-l2-q4', lesson: 'sf-l2', notion: 'sf-continuite', type: 'mcq', tag: 'application',
      prompt: R`Quel est l'argument le plus rapide pour montrer que $f_n(x) = x^n$ ne converge pas uniformément sur $[0, 1]$ ?`,
      options: [
        R`Les $f_n$ sont continues sur $[0, 1]$ et la limite simple est discontinue en $1$`,
        R`Les $f_n$ ne sont pas bornées sur $[0, 1]$`,
        R`La suite $(f_n(1))$ diverge`,
        R`Les $f_n$ ne sont pas dérivables en $1$`
      ],
      answer: 0,
      explain: R`Contraposée du théorème de continuité. Les autres affirmations sont fausses : $|f_n| \leq 1$, $f_n(1) = 1$, et $f_n$ est polynomiale.`
    },
    {
      id: 'sf-l2-q5', lesson: 'sf-l2', notion: 'sf-double-limite', type: 'multi', tag: 'hypotheses',
      prompt: R`Cochez les hypothèses du théorème de la double limite en un point $a$.`,
      options: [
        R`$(f_n)$ converge uniformément vers $f$ sur $A$`,
        R`$a$ est adhérent à $A$ (ou $a = \pm\infty$)`,
        R`Chaque $f_n$ admet une limite finie $\ell_n$ en $a$`,
        R`Les $f_n$ sont continues sur $A$`,
        R`La suite $(\ell_n)$ converge`
      ],
      answers: [0, 1, 2],
      explain: R`La convergence de $(\ell_n)$ fait partie de la **conclusion**, pas des hypothèses. La continuité des $f_n$ n'est pas requise, et $a$ n'a pas besoin d'appartenir à $A$.`
    },
    {
      id: 'sf-l2-q6', lesson: 'sf-l2', notion: 'sf-double-limite', type: 'tf', tag: 'piege',
      prompt: R`$(f_n)$ converge uniformément sur tout segment de $[0, 1[$ et chaque $f_n$ tend vers $\ell_n$ en $1$. Alors la limite $f$ tend vers $\lim \ell_n$ en $1$.`,
      answer: false,
      explain: R`Il faut la convergence uniforme sur $[0, 1[$, c'est-à-dire jusqu'au voisinage de $1$. Contre-exemple : $f_n(x) = x^n$, où $\ell_n = 1$ alors que $f = 0$.`
    },
    {
      id: 'sf-l2-q7', lesson: 'sf-l2', notion: 'sf-weierstrass', type: 'tf', tag: 'cadre',
      prompt: R`Toute fonction continue sur $\mathbb{R}$ est limite uniforme sur $\mathbb{R}$ d'une suite de fonctions polynomiales.`,
      answer: false,
      explain: R`Le théorème de Weierstrass vaut sur un **segment**. Si $(P_n)$ converge uniformément sur $\mathbb{R}$, alors pour $n, m$ grands $P_n - P_m$ est un polynôme borné sur $\mathbb{R}$, donc constant : la limite est polynomiale. Ainsi $\exp$ n'est pas limite uniforme de polynômes sur $\mathbb{R}$.`
    },
    {
      id: 'sf-l2-q8', lesson: 'sf-l2', notion: 'sf-continuite', type: 'order', tag: 'demo',
      prompt: R`Remettez dans l'ordre la démonstration de la continuité en $a$ de la limite uniforme $f$ de fonctions $f_n$ continues en $a$.`,
      steps: [
        R`Soit $\varepsilon > 0$. Par convergence uniforme sur un voisinage $V$ de $a$, on fixe d'abord un entier $N$ tel que $|f_N(x) - f(x)| \leq \frac{\varepsilon}{3}$ pour tout $x \in V$.`,
        R`Cet entier $N$ étant fixé, la continuité de $f_N$ en $a$ fournit $\delta > 0$ tel que $|f_N(x) - f_N(a)| \leq \frac{\varepsilon}{3}$ pour tout $x \in V$ vérifiant $|x - a| \leq \delta$.`,
        R`Pour un tel $x$, on découpe : $f(x) - f(a) = \big(f(x) - f_N(x)\big) + \big(f_N(x) - f_N(a)\big) + \big(f_N(a) - f(a)\big)$.`,
        R`L'inégalité triangulaire donne alors $|f(x) - f(a)| \leq \frac{\varepsilon}{3} + \frac{\varepsilon}{3} + \frac{\varepsilon}{3} = \varepsilon$ : $f$ est continue en $a$.`
      ],
      explain: R`L'ordre des choix est essentiel : $N$ est fixé **avant** $\delta$, car $\delta$ dépend de $f_N$. Avec la seule convergence simple, $N$ dépendrait de $x$ et le découpage ne fonctionnerait plus.`
    },
    {
      id: 'sf-l2-q9', lesson: 'sf-l2', notion: 'sf-double-limite', type: 'card', tag: 'restitution',
      prompt: R`Énoncez le théorème de la double limite, puis donnez un exemple où l'interversion des limites échoue.`,
      back: R`**Énoncé.** Si $(f_n)$ converge uniformément vers $f$ sur $A$, si $a$ est adhérent à $A$ (ou $a = \pm\infty$) et si chaque $f_n$ a une limite finie $\ell_n$ en $a$, alors $(\ell_n)$ converge et $\lim_{x \to a} f(x) = \lim_{n \to +\infty} \ell_n$.
**Échec.** $f_n(x) = x^n$ sur $[0, 1[$ en $a = 1$ : $\lim_n \lim_{x \to 1} x^n = 1$ mais $\lim_{x \to 1} \lim_n x^n = 0$.`,
      explain: R`La démonstration n'est pas exigible en MP. La convergence de $(\ell_n)$ est une conclusion.`
    },

    /* ---------------- Leçon 3 ---------------- */
    {
      id: 'sf-l3-q1', lesson: 'sf-l3', notion: 'sf-integration', type: 'multi', tag: 'hypotheses',
      prompt: R`Cochez les hypothèses du théorème permettant d'écrire $\int_a^b f_n \to \int_a^b f$.`,
      options: [
        R`Les $f_n$ sont continues sur le segment $[a, b]$`,
        R`$(f_n)$ converge uniformément vers $f$ sur $[a, b]$`,
        R`$(f_n)$ converge simplement vers $f$ sur $[a, b]$, sans plus`,
        R`Les $f_n$ sont de classe $\mathcal{C}^1$`
      ],
      answers: [0, 1],
      explain: R`Continuité sur un segment et convergence uniforme. La convergence simple seule ne suffit pas, et aucune dérivabilité n'est requise.`
    },
    {
      id: 'sf-l3-q2', lesson: 'sf-l3', notion: 'sf-integration', type: 'tf', tag: 'piege',
      prompt: R`Si des fonctions continues $f_n$ convergent simplement sur $[0, 1]$ vers une fonction continue $f$, alors $\int_0^1 f_n \to \int_0^1 f$.`,
      answer: false,
      explain: R`$f_n(x) = n^2 x (1 - x)^n$ converge simplement vers $0$ sur $[0, 1]$, mais $\int_0^1 f_n = \frac{n^2}{(n+1)(n+2)} \to 1$.`
    },
    {
      id: 'sf-l3-q3', lesson: 'sf-l3', notion: 'sf-integration', type: 'mcq', tag: 'demo',
      prompt: R`Quelle majoration est au cœur de la preuve du théorème d'intégration sur le segment $[a, b]$ ?`,
      options: [
        R`$\left| \int_a^b f_n - \int_a^b f \right| \leq (b - a)\,\|f_n - f\|_{\infty, [a, b]}$`,
        R`$\left| \int_a^b f_n - \int_a^b f \right| \leq \|f_n - f\|_{\infty, [a, b]}$`,
        R`$\left| \int_a^b f_n - \int_a^b f \right| \leq (b - a)\,|f_n(a) - f(a)|$`,
        R`$\left| \int_a^b f_n - \int_a^b f \right| \leq \|f_n\|_{\infty} + \|f\|_{\infty}$`
      ],
      answer: 0,
      explain: R`$\left| \int_a^b (f_n - f) \right| \leq \int_a^b |f_n - f| \leq (b - a)\,\|f_n - f\|_\infty$. La longueur $b - a$ est finie : c'est là que sert le fait d'intégrer sur un segment.`
    },
    {
      id: 'sf-l3-q4', lesson: 'sf-l3', notion: 'sf-integration', type: 'tf', tag: 'cadre',
      prompt: R`Si des fonctions $f_n$ intégrables sur $[0, +\infty[$ convergent uniformément vers $0$ sur $[0, +\infty[$, alors $\int_0^{+\infty} f_n \to 0$.`,
      answer: false,
      explain: R`La fonction valant $\frac{1}{n}$ sur $[0, n]$ et $0$ ailleurs a pour norme uniforme $\frac{1}{n} \to 0$, et pour intégrale $1$. Sur un intervalle non borné, on utilise le théorème de convergence dominée.`
    },
    {
      id: 'sf-l3-q5', lesson: 'sf-l3', notion: 'sf-derivation', type: 'multi', tag: 'hypotheses',
      prompt: R`Cochez les hypothèses du théorème de dérivation de la limite d'une suite $(f_n)$ sur un intervalle $I$.`,
      options: [
        R`Chaque $f_n$ est de classe $\mathcal{C}^1$ sur $I$`,
        R`$(f_n)$ converge simplement sur $I$`,
        R`$(f_n')$ converge uniformément sur tout segment de $I$`,
        R`$(f_n)$ converge uniformément sur $I$`,
        R`$(f_n')$ converge simplement sur $I$, sans plus`
      ],
      answers: [0, 1, 2],
      explain: R`La convergence uniforme est exigée de la suite des **dérivées**. Pour $(f_n)$, la convergence simple suffit, et la convergence uniforme sur tout segment est alors une conclusion.`
    },
    {
      id: 'sf-l3-q6', lesson: 'sf-l3', notion: 'sf-derivation', type: 'tf', tag: 'piege',
      prompt: R`Si des fonctions $f_n$ de classe $\mathcal{C}^1$ convergent uniformément sur $\mathbb{R}$ vers $f$, alors $f$ est dérivable sur $\mathbb{R}$.`,
      answer: false,
      explain: R`$f_n(x) = \sqrt{x^2 + \frac{1}{n}}$ est de classe $\mathcal{C}^1$ et $0 \leq f_n(x) - |x| \leq \frac{1}{\sqrt{n}}$ : la convergence vers $|x|$ est uniforme sur $\mathbb{R}$, mais $|x|$ n'est pas dérivable en $0$.`
    },
    {
      id: 'sf-l3-q7', lesson: 'sf-l3', notion: 'sf-derivation', type: 'mcq', tag: 'piege',
      prompt: R`On pose $f_n(x) = \dfrac{\sin(nx)}{\sqrt{n}}$ sur $\mathbb{R}$. Que montre cet exemple ?`,
      options: [
        R`$(f_n)$ peut converger uniformément alors que $(f_n')$ ne converge même pas simplement`,
        R`Une suite de fonctions de classe $\mathcal{C}^1$ ne peut pas converger uniformément`,
        R`$(f_n)$ ne converge pas simplement`,
        R`$(f_n')$ converge uniformément vers $0$`
      ],
      answer: 0,
      explain: R`$|f_n(x)| \leq \frac{1}{\sqrt{n}}$ : convergence uniforme vers $0$. Mais $f_n'(x) = \sqrt{n} \cos(nx)$ et $f_n'(0) = \sqrt{n} \to +\infty$.`
    },
    {
      id: 'sf-l3-q8', lesson: 'sf-l3', notion: 'sf-derivation', type: 'order', tag: 'demo',
      prompt: R`Remettez dans l'ordre la démonstration du théorème de dérivation : $f_n$ de classe $\mathcal{C}^1$, $(f_n)$ converge simplement vers $f$, $(f_n')$ converge uniformément sur tout segment vers $g$.`,
      steps: [
        R`On fixe $a \in I$. Comme $f_n$ est de classe $\mathcal{C}^1$, on a pour tout $x \in I$ l'égalité $f_n(x) = f_n(a) + \int_a^x f_n'(t)\,\mathrm{d}t$, notée $(1)$.`,
        R`D'abord, $g$ est continue sur $I$ : c'est la limite, uniforme sur tout segment, des fonctions continues $f_n'$.`,
        R`Ensuite, le théorème d'intégration sur le segment d'extrémités $a$ et $x$ donne $\int_a^x f_n' \to \int_a^x g$.`,
        R`En passant à la limite dans $(1)$, grâce à la convergence simple de $(f_n)$ : $f(x) = f(a) + \int_a^x g(t)\,\mathrm{d}t$.`,
        R`Enfin, $g$ étant continue, le théorème fondamental de l'analyse montre que $f$ est de classe $\mathcal{C}^1$ et que $f' = g$.`
      ],
      explain: R`On ne dérive jamais directement la limite : on **intègre** les dérivées, ce qui ramène au théorème d'intégration. La convergence simple de $(f_n)$ ne sert qu'en deux points, $a$ et $x$.`
    },
    {
      id: 'sf-l3-q9', lesson: 'sf-l3', notion: 'sf-derivation', type: 'card', tag: 'restitution',
      prompt: R`Énoncez le théorème de dérivation de la limite d'une suite de fonctions : hypothèses et conclusions.`,
      back: R`**Hypothèses.** (i) Chaque $f_n$ est de classe $\mathcal{C}^1$ sur l'intervalle $I$. (ii) $(f_n)$ converge simplement vers $f$ sur $I$. (iii) $(f_n')$ converge uniformément sur tout segment de $I$ vers $g$.
**Conclusions.** $f$ est de classe $\mathcal{C}^1$ sur $I$, $f' = g$, et $(f_n)$ converge uniformément vers $f$ sur tout segment de $I$.`,
      explain: R`Vérifiez que vous avez bien placé la convergence uniforme sur $(f_n')$ et non sur $(f_n)$.`
    },

    /* ---------------- Leçon 4 ---------------- */
    {
      id: 'sf-l4-q1', lesson: 'sf-l4', notion: 'sf-series-modes', type: 'mcq', tag: 'hypotheses',
      prompt: R`Que signifie « la série $\sum f_n$ converge normalement sur $A$ » ?`,
      options: [
        R`Chaque $f_n$ est bornée sur $A$ et la série numérique $\sum \|f_n\|_{\infty, A}$ converge`,
        R`Pour tout $x \in A$, la série $\sum |f_n(x)|$ converge`,
        R`La somme $\sum f_n$ est bornée sur $A$`,
        R`La suite $(f_n)$ converge uniformément vers $0$ sur $A$`
      ],
      answer: 0,
      explain: R`La deuxième proposition est la convergence absolue en tout point, qui est plus faible : $\sum x^n$ converge absolument en tout point de $]-1, 1[$ sans converger normalement sur $]-1, 1[$.`
    },
    {
      id: 'sf-l4-q2', lesson: 'sf-l4', notion: 'sf-series-modes', type: 'multi', tag: 'restitution',
      prompt: R`La série $\sum f_n$ converge normalement sur $A$. Cochez tout ce qui en découle.`,
      options: [
        R`Elle converge uniformément sur $A$`,
        R`Elle converge absolument en tout point de $A$`,
        R`Elle converge simplement sur $A$`,
        R`Sa somme est dérivable sur $A$`
      ],
      answers: [0, 1, 2],
      explain: R`Normale $\Rightarrow$ uniforme $\Rightarrow$ simple, et normale $\Rightarrow$ absolue en tout point. Aucune régularité de la somme n'en découle sans hypothèse sur les $f_n$.`
    },
    {
      id: 'sf-l4-q3', lesson: 'sf-l4', notion: 'sf-series-modes', type: 'tf', tag: 'piege',
      prompt: R`Si une série de fonctions converge uniformément sur $A$, alors elle converge normalement sur $A$.`,
      answer: false,
      explain: R`$\sum_{n \geq 1} \frac{(-1)^n}{n + x}$ sur $[0, +\infty[$ : par le critère des séries alternées, $|R_n(x)| \leq \frac{1}{n + 1 + x} \leq \frac{1}{n+1}$, donc la convergence est uniforme. Mais $\|f_n\|_\infty = \frac{1}{n}$ et $\sum \frac{1}{n}$ diverge.`
    },
    {
      id: 'sf-l4-q4', lesson: 'sf-l4', notion: 'sf-series-modes', type: 'mcq', tag: 'cadre',
      prompt: R`Que dire de la série $\sum_{n \geq 0} x^n$ ?`,
      options: [
        R`Elle converge simplement sur $]-1, 1[$, normalement sur $[-a, a]$ pour tout $a \in [0, 1[$, mais pas normalement sur $]-1, 1[$`,
        R`Elle converge normalement sur $]-1, 1[$`,
        R`Elle converge uniformément sur $]-1, 1[$ mais pas normalement`,
        R`Elle ne converge normalement sur aucun intervalle`
      ],
      answer: 0,
      explain: R`Sur $[-a, a]$ : $\|x^n\|_\infty = a^n$, série géométrique convergente. Sur $]-1, 1[$ : $\|x^n\|_\infty = 1$. Il n'y a pas non plus convergence uniforme sur $]-1, 1[$, car le reste $\frac{x^{n+1}}{1 - x}$ n'y est pas borné.`
    },
    {
      id: 'sf-l4-q5', lesson: 'sf-l4', notion: 'sf-series-modes', type: 'mcq', tag: 'application',
      prompt: R`En pratique, pour prouver que $\sum f_n$ converge normalement sur $A$, on cherche…`,
      options: [
        R`une suite $(\alpha_n)$ indépendante de $x$ telle que $|f_n(x)| \leq \alpha_n$ pour tout $x \in A$, avec $\sum \alpha_n$ convergente`,
        R`pour chaque $x \in A$, une suite $(\alpha_n(x))$ telle que $|f_n(x)| \leq \alpha_n(x)$, avec $\sum \alpha_n(x)$ convergente`,
        R`un rang $N$ à partir duquel $f_n = 0$`,
        R`une constante $M$ telle que $|f_n(x)| \leq M$ pour tous $n$ et $x$`
      ],
      answer: 0,
      explain: R`Alors $\|f_n\|_{\infty, A} \leq \alpha_n$ et on conclut par comparaison de séries à termes positifs. Un majorant dépendant de $x$ ne donnerait que la convergence absolue en chaque point.`
    },
    {
      id: 'sf-l4-q6', lesson: 'sf-l4', notion: 'sf-series-theoremes', type: 'multi', tag: 'hypotheses',
      prompt: R`Cochez les hypothèses du théorème de dérivation terme à terme de $\sum f_n$ sur un intervalle $I$.`,
      options: [
        R`Chaque $f_n$ est de classe $\mathcal{C}^1$ sur $I$`,
        R`$\sum f_n$ converge simplement sur $I$`,
        R`$\sum f_n'$ converge uniformément sur tout segment de $I$`,
        R`$\sum f_n$ converge normalement sur $I$`,
        R`$\sum f_n'$ converge simplement sur $I$, sans plus`
      ],
      answers: [0, 1, 2],
      explain: R`Comme pour les suites : convergence simple de la série, convergence uniforme sur tout segment de la série **des dérivées**.`
    },
    {
      id: 'sf-l4-q7', lesson: 'sf-l4', notion: 'sf-series-theoremes', type: 'tf', tag: 'application',
      prompt: R`La somme de la série $\sum_{n \geq 1} \dfrac{x^n}{n^2}$ est continue sur $[-1, 1]$.`,
      answer: true,
      explain: R`Pour $x \in [-1, 1]$ : $\left| \frac{x^n}{n^2} \right| \leq \frac{1}{n^2}$, terme général d'une série convergente indépendante de $x$. La série converge normalement, donc uniformément, sur $[-1, 1]$ et ses termes sont continus.`
    },
    {
      id: 'sf-l4-q8', lesson: 'sf-l4', notion: 'sf-series-modes', type: 'mcq', tag: 'restitution',
      prompt: R`La série $\sum f_n$ converge uniformément sur $A$ si et seulement si…`,
      options: [
        R`elle converge simplement sur $A$ et la suite de ses restes converge uniformément vers $0$ sur $A$`,
        R`la suite $(f_n)$ converge uniformément vers $0$ sur $A$`,
        R`la série $\sum \|f_n\|_{\infty, A}$ converge`,
        R`la suite des sommes partielles est bornée sur $A$`
      ],
      answer: 0,
      explain: R`$S - S_n = R_n$. La convergence uniforme de $(f_n)$ vers $0$ est nécessaire mais pas suffisante ; la convergence de $\sum \|f_n\|_\infty$ est suffisante mais pas nécessaire.`
    },
    {
      id: 'sf-l4-q9', lesson: 'sf-l4', notion: 'sf-series-modes', type: 'tf', tag: 'piege',
      prompt: R`Si $(f_n)$ converge uniformément vers $0$ sur $A$, alors la série $\sum f_n$ converge uniformément sur $A$.`,
      answer: false,
      explain: R`Les fonctions constantes $f_n = \frac{1}{n}$ convergent uniformément vers $0$, mais $\sum \frac{1}{n}$ diverge : la série ne converge même pas simplement.`
    },
    {
      id: 'sf-l4-q10', lesson: 'sf-l4', notion: 'sf-series-modes', type: 'card', tag: 'restitution',
      prompt: R`Définissez la convergence normale, puis démontrez qu'elle entraîne la convergence uniforme.`,
      back: R`**Définition.** Chaque $f_n$ est bornée sur $A$ et $\sum \|f_n\|_{\infty, A}$ converge.
**Preuve.** Pour $x \in A$, $|f_n(x)| \leq \|f_n\|_\infty$ : par comparaison, $\sum f_n(x)$ converge absolument, donc converge. Puis $|R_n(x)| \leq \sum_{k > n} |f_k(x)| \leq \sum_{k > n} \|f_k\|_\infty$. Ce majorant est le reste d'une série convergente : il tend vers $0$ et ne dépend pas de $x$. Donc $(R_n)$ converge uniformément vers $0$.`,
      explain: R`Le point clé est que le majorant du reste est indépendant de $x$.`
    }
  ]
};
