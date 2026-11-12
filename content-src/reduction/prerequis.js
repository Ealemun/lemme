/*
 * Lemme — leçon de prérequis du chapitre « Réduction des endomorphismes ».
 *
 * Ces notions de première année sont utilisées dans tout le chapitre. La leçon
 * est facultative (elle ne bloque pas la suite du parcours) et chaque notion
 * peut être retravaillée à tout moment depuis sa fiche.
 *
 * Même format que cours.js (notions et questions) ; les exemples sont
 * directement dans les fiches.
 */
const R = String.raw;

module.exports = {
  lesson: { id: 'l0', optional: true, title: 'Prérequis', blurb: 'Récurrence, sommes directes, rang, polynômes, déterminant.' },

  notions: [
    {
      id: 'p-recurrence', lesson: 'l0', kind: 'Méthode',
      title: 'Raisonnement par récurrence',
      status: 'programme', level: 'cpge', proof: null, source: null,
      statement: R`Pour démontrer « pour tout entier $n \geq n_0$, $\mathcal{P}(n)$ » :
**Initialisation.** On démontre $\mathcal{P}(n_0)$.
**Hérédité.** On fixe un entier $n \geq n_0$ **quelconque** tel que $\mathcal{P}(n)$ soit vraie, et on démontre $\mathcal{P}(n+1)$.
**Récurrence forte.** Dans l'hérédité, on peut supposer $\mathcal{P}(k)$ vraie pour tout $k$ tel que $n_0 \leq k \leq n$.`,
      hypotheses: [
        R`Les **deux** étapes sont indispensables.`,
        R`La propriété $\mathcal{P}(n)$ doit être **énoncée précisément** avant de commencer, quantificateurs compris.`
      ],
      idea: R`Dans ce chapitre, la récurrence porte souvent sur un nombre de valeurs propres ou sur la dimension de l'espace : il faut alors quantifier sur **tous** les objets de cette taille dans $\mathcal{P}(n)$.`,
      examples: [
        R`$\mathcal{P}(n)$ : « $\sum_{k=1}^{n} k = \frac{n(n+1)}{2}$ ». Initialisation : $1 = \frac{1 \times 2}{2}$. Hérédité : $\sum_{k=1}^{n+1} k = \frac{n(n+1)}{2} + (n+1) = \frac{(n+1)(n+2)}{2}$.`
      ],
      counterexamples: [
        R`Sans initialisation : pour $\mathcal{P}(n)$ : « $n = n + 1$ », l'implication $\mathcal{P}(n) \Rightarrow \mathcal{P}(n+1)$ est vraie pour tout $n$, alors que $\mathcal{P}(n)$ est toujours fausse.`
      ],
      pitfalls: [
        R`Écrire « supposons $\mathcal{P}(n)$ vraie pour tout $n$ » dans l'hérédité revient à supposer ce que l'on veut démontrer. On écrit : « soit $n \geq n_0$ tel que $\mathcal{P}(n)$ soit vraie ».`
      ],
      notations: [],
      prereqs: []
    },
    {
      id: 'p-sev', lesson: 'l0', kind: 'Définition',
      title: 'Somme et somme directe de sous-espaces',
      status: 'programme', level: 'cpge', proof: null, source: null,
      statement: R`Soient $F_1, \dots, F_p$ des sous-espaces vectoriels de $E$. Leur somme $F_1 + \dots + F_p$ est **directe** si tout vecteur de la somme s'écrit de manière unique $x_1 + \dots + x_p$ avec $x_i \in F_i$. Cela équivaut à : pour tous $x_1 \in F_1, \dots, x_p \in F_p$,
$$\sum_{i=1}^{p} x_i = 0 \implies \forall i,\ x_i = 0.$$
En dimension finie, la somme est directe si et seulement si
$$\dim \Big( \sum_{i=1}^{p} F_i \Big) = \sum_{i=1}^{p} \dim F_i.$$`,
      hypotheses: [],
      idea: R`Pour **deux** sous-espaces, la somme $F + G$ est directe si et seulement si $F \cap G = \{0\}$.`,
      examples: [
        R`$\mathbb{R}^2 = \operatorname{Vect}((1,0)) \oplus \operatorname{Vect}((0,1))$.`,
        R`$\mathcal{M}_n(\mathbb{R})$ est la somme directe du sous-espace des matrices symétriques et de celui des matrices antisymétriques.`
      ],
      counterexamples: [
        R`Dans $\mathbb{R}^2$, les trois droites $\operatorname{Vect}((1,0))$, $\operatorname{Vect}((0,1))$ et $\operatorname{Vect}((1,1))$ ont des intersections deux à deux réduites à $\{0\}$, mais leur somme n'est pas directe : $(1,0) + (0,1) - (1,1) = 0$.`
      ],
      pitfalls: [
        R`À partir de **trois** sous-espaces, « intersections deux à deux nulles » ne suffit pas pour avoir une somme directe.`
      ],
      notations: [R`On note $F_1 \oplus \dots \oplus F_p$ ou $\bigoplus_{i} F_i$ une somme directe.`],
      prereqs: []
    },
    {
      id: 'p-rang', lesson: 'l0', kind: 'Théorème',
      title: 'Théorème du rang',
      status: 'programme', level: 'cpge', proof: null, source: null,
      statement: R`Si $E$ est de dimension finie et $u \in \mathcal{L}(E, F)$, alors
$$\dim E = \dim \operatorname{Ker} u + \operatorname{rg}(u).$$
**Conséquence.** Pour un endomorphisme $u$ d'un espace de dimension finie : $u$ injectif $\iff$ $u$ surjectif $\iff$ $u$ bijectif.`,
      hypotheses: [R`L'espace de départ est de **dimension finie**.`],
      idea: R`$u$ induit un isomorphisme de tout supplémentaire de $\operatorname{Ker} u$ sur $\operatorname{Im} u$.`,
      examples: [
        R`Pour $u : (x, y) \mapsto (x, 0)$ sur $\mathbb{R}^2$ : $\operatorname{Ker} u = \operatorname{Vect}((0,1))$ et $\operatorname{rg}(u) = 1$ ; on a bien $2 = 1 + 1$.`
      ],
      counterexamples: [
        R`En dimension infinie, $P \mapsto XP$ sur $\mathbb{K}[X]$ est injectif mais pas surjectif, et la dérivation $P \mapsto P'$ est surjective mais pas injective.`
      ],
      pitfalls: [
        R`Le théorème ne dit pas que $E = \operatorname{Ker} u \oplus \operatorname{Im} u$ : pour $\begin{pmatrix}0&1\\0&0\end{pmatrix}$, le noyau et l'image sont la même droite.`
      ],
      notations: [],
      prereqs: ['p-sev']
    },
    {
      id: 'p-polynomes', lesson: 'l0', kind: 'Rappels',
      title: 'Polynômes : racines, polynôme scindé, Bézout',
      status: 'programme', level: 'cpge', proof: null, source: null,
      statement: R`$\lambda \in \mathbb{K}$ est **racine de multiplicité $m$** de $P$ si $(X - \lambda)^m$ divise $P$ et $(X - \lambda)^{m+1}$ ne le divise pas.
$P$ non constant est **scindé sur $\mathbb{K}$** s'il s'écrit $c \prod_{i} (X - \lambda_i)$ avec $c \in \mathbb{K}^*$ et $\lambda_i \in \mathbb{K}$ ; il est **à racines simples** si de plus les $\lambda_i$ sont deux à deux distincts.
**Théorème de Bézout.** $A$ et $B$ sont premiers entre eux si et seulement s'il existe $U, V \in \mathbb{K}[X]$ tels que $AU + BV = 1$.`,
      hypotheses: [R`« Scindé » dépend du corps : il faut toujours préciser **sur $\mathbb{K}$**.`],
      idea: R`Deux polynômes scindés sont premiers entre eux si et seulement s'ils n'ont aucune racine commune. Sur $\mathbb{C}$, tout polynôme non constant est scindé (théorème de d'Alembert-Gauss).`,
      examples: [
        R`$X^2 - 3X + 2 = (X-1)(X-2)$ est scindé à racines simples sur $\mathbb{R}$.`,
        R`$X - 1$ et $X - 2$ sont premiers entre eux : $(X - 1) - (X - 2) = 1$.`
      ],
      counterexamples: [
        R`$X^2 + 1$ est scindé sur $\mathbb{C}$ mais pas sur $\mathbb{R}$.`,
        R`$(X-1)^2$ est scindé mais n'est pas à racines simples.`
      ],
      pitfalls: [
        R`« Scindé » et « à racines simples » sont deux propriétés indépendantes : $X^2 + 1$ n'a que des racines simples (dans $\mathbb{C}$) sans être scindé sur $\mathbb{R}$.`
      ],
      notations: [],
      prereqs: []
    },
    {
      id: 'p-determinant', lesson: 'l0', kind: 'Rappels',
      title: 'Déterminant',
      status: 'programme', level: 'cpge', proof: null, source: null,
      statement: R`Pour $A, B \in \mathcal{M}_n(\mathbb{K})$ et $\lambda \in \mathbb{K}$ :
$\det(AB) = \det(A)\det(B)$ ; $\det(\lambda A) = \lambda^n \det(A)$ ; $A$ est inversible si et seulement si $\det(A) \neq 0$.
Le déterminant d'une matrice triangulaire est le produit de ses coefficients diagonaux. Pour une matrice triangulaire par blocs :
$$\det \begin{pmatrix} A & B \\ 0 & C \end{pmatrix} = \det(A)\,\det(C).$$`,
      hypotheses: [R`Dans la formule par blocs, $A$ et $C$ sont des blocs **carrés**.`],
      idea: R`Deux matrices semblables ont le même déterminant : $\det(P^{-1} A P) = \det(A)$.`,
      examples: [
        R`$\det \begin{pmatrix}1&2\\3&4\end{pmatrix} = 1 \times 4 - 2 \times 3 = -2$.`
      ],
      counterexamples: [
        R`Le déterminant n'est pas additif : $\det(I_2 + I_2) = 4$ alors que $\det(I_2) + \det(I_2) = 2$.`
      ],
      pitfalls: [
        R`$\det(\lambda A) = \lambda^n \det(A)$ et non $\lambda \det(A)$. En particulier $\det(-A) = (-1)^n \det(A)$.`
      ],
      notations: [],
      prereqs: []
    }
  ],

  questions: [
    {
      id: 'l0-q1', lesson: 'l0', notion: 'p-recurrence', type: 'tf', tag: 'piege',
      prompt: R`Pour démontrer que $\mathcal{P}(n)$ est vraie pour tout $n \in \mathbb{N}$, il suffit de démontrer que $\mathcal{P}(n) \Rightarrow \mathcal{P}(n+1)$ pour tout $n \in \mathbb{N}$.`,
      answer: false,
      explain: R`Il manque l'initialisation. Avec $\mathcal{P}(n)$ : « $n = n+1$ », l'hérédité est vraie pour tout $n$ et la propriété est pourtant toujours fausse.`
    },
    {
      id: 'l0-q2', lesson: 'l0', notion: 'p-recurrence', type: 'mcq', tag: 'piege',
      prompt: R`Un étudiant rédige : « Hérédité : supposons que $\mathcal{P}(n)$ est vraie pour tout $n \in \mathbb{N}$, et montrons $\mathcal{P}(n+1)$. » Quelle est l'erreur ?`,
      options: [
        R`Il suppose ce qu'il faut démontrer ; il faut écrire « soit $n \in \mathbb{N}$ tel que $\mathcal{P}(n)$ soit vraie »`,
        R`Il aurait dû supposer $\mathcal{P}(n+1)$ et montrer $\mathcal{P}(n)$`,
        R`Il n'y a pas d'erreur`,
        R`L'hérédité doit se démontrer avant l'initialisation`
      ],
      answer: 0,
      explain: R`Dans l'hérédité, $n$ est un entier fixé quelconque pour lequel on suppose $\mathcal{P}(n)$. Supposer $\mathcal{P}(n)$ « pour tout $n$ », c'est supposer la conclusion.`
    },
    {
      id: 'l0-q3', lesson: 'l0', notion: 'p-sev', type: 'tf', tag: 'piege',
      prompt: R`Si trois sous-espaces $F_1, F_2, F_3$ de $E$ vérifient $F_i \cap F_j = \{0\}$ pour $i \neq j$, alors la somme $F_1 + F_2 + F_3$ est directe.`,
      answer: false,
      explain: R`Trois droites distinctes de $\mathbb{R}^2$ ont des intersections deux à deux nulles, mais leur somme, de dimension 2, ne peut pas être directe (il faudrait une dimension 3).`
    },
    {
      id: 'l0-q4', lesson: 'l0', notion: 'p-sev', type: 'multi', tag: 'hypotheses',
      prompt: R`Soient $F$ et $G$ deux sous-espaces de $E$, de dimension finie. Cochez toutes les conditions **équivalentes** à « la somme $F + G$ est directe ».`,
      options: [
        R`$F \cap G = \{0\}$`,
        R`Tout vecteur de $F + G$ s'écrit de manière unique $x + y$ avec $x \in F$ et $y \in G$`,
        R`$\dim(F + G) = \dim F + \dim G$`,
        R`$F \cup G = E$`
      ],
      answers: [0, 1, 2],
      explain: R`Les trois premières conditions sont équivalentes (formule de Grassmann pour la troisième). La réunion $F \cup G$ n'est en général même pas un sous-espace vectoriel.`
    },
    {
      id: 'l0-q5', lesson: 'l0', notion: 'p-rang', type: 'mcq', tag: 'application',
      prompt: R`Soit $u$ un endomorphisme de $\mathbb{R}^5$ de rang $3$. Quelle est la dimension de $\operatorname{Ker} u$ ?`,
      options: [R`$2$`, R`$3$`, R`$5$`, R`$8$`],
      answer: 0,
      explain: R`Théorème du rang : $\dim \operatorname{Ker} u = 5 - 3 = 2$.`
    },
    {
      id: 'l0-q6', lesson: 'l0', notion: 'p-rang', type: 'tf', tag: 'cadre',
      prompt: R`Tout endomorphisme injectif d'un espace vectoriel est bijectif.`,
      answer: false,
      explain: R`C'est vrai en dimension finie, par le théorème du rang. En dimension infinie, $P \mapsto XP$ sur $\mathbb{K}[X]$ est injectif mais pas surjectif : aucun polynôme constant non nul n'est dans son image.`
    },
    {
      id: 'l0-q7', lesson: 'l0', notion: 'p-polynomes', type: 'multi', tag: 'cadre',
      prompt: R`Cochez les polynômes scindés **sur $\mathbb{R}$**.`,
      options: [R`$X^2 - 1$`, R`$(X-1)^2 (X+2)$`, R`$X^2 + 1$`, R`$X^3 - 1$`],
      answers: [0, 1],
      explain: R`$X^2 - 1 = (X-1)(X+1)$. En revanche $X^2 + 1$ n'a pas de racine réelle, et $X^3 - 1 = (X-1)(X^2 + X + 1)$ où $X^2 + X + 1$ a un discriminant strictement négatif.`
    },
    {
      id: 'l0-q8', lesson: 'l0', notion: 'p-polynomes', type: 'mcq', tag: 'application',
      prompt: R`Quelle est la multiplicité de la racine $1$ dans $P = (X-1)^2 (X+1)(X^2 - 1)$ ?`,
      options: [R`$3$`, R`$2$`, R`$1$`, R`$4$`],
      answer: 0,
      explain: R`$X^2 - 1 = (X-1)(X+1)$, donc $P = (X-1)^3 (X+1)^2$.`
    },
    {
      id: 'l0-q9', lesson: 'l0', notion: 'p-determinant', type: 'mcq', tag: 'piege',
      prompt: R`Soit $A \in \mathcal{M}_3(\mathbb{K})$. Que vaut $\det(2A)$ ?`,
      options: [R`$8 \det(A)$`, R`$2 \det(A)$`, R`$6 \det(A)$`, R`$\det(A) + 2$`],
      answer: 0,
      explain: R`$\det(\lambda A) = \lambda^n \det(A)$ : chacune des $n = 3$ colonnes est multipliée par $2$.`
    },
    {
      id: 'l0-q10', lesson: 'l0', notion: 'p-determinant', type: 'tf', tag: 'piege',
      prompt: R`Pour toutes matrices $A, B \in \mathcal{M}_n(\mathbb{K})$, $\det(A + B) = \det(A) + \det(B)$.`,
      answer: false,
      explain: R`Le déterminant est multiplicatif, pas additif : $\det(I_2 + I_2) = 4 \neq 2$.`
    }
  ]
};
