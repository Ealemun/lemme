/*
 * Lemme — contenu source du chapitre pilote « Réduction des endomorphismes ».
 *
 * Ce fichier est la version que l'on édite. Il est écrit en JavaScript
 * uniquement pour pouvoir taper le LaTeX sans doubler les antislashs
 * (grâce à String.raw, abrégé en R). La commande
 *     node tools/build-content.js
 * le vérifie puis produit content/reduction.json (format d'échange)
 * et content/reduction.js (chargé par l'application).
 *
 * Conventions d'écriture des textes :
 *   $...$    formule en ligne          $$...$$  formule centrée
 *   **...**  mise en gras              \n       nouveau paragraphe
 *
 * Statuts d'une notion :
 *   status : 'programme' (exigible en MP) | 'hors-programme' (hors programme MP)
 *   level  : 'cpge' | 'agreg'
 *   proof  : 'exigible' | 'non-exigible' | null
 *
 * Types de questions :
 *   mcq   : une seule bonne réponse      -> options[], answer (indice)
 *   multi : plusieurs bonnes réponses    -> options[], answers[] (indices)
 *   tf    : vrai ou faux                 -> answer (booléen)
 *   order : étapes à remettre en ordre   -> steps[] (écrites dans le bon ordre)
 *   card  : restitution auto-évaluée     -> back (réponse attendue)
 * Étiquette tag : 'hypotheses' | 'piege' | 'cadre' | 'notation' | 'demo' | 'application' | 'restitution'
 *
 * Tout le contenu est en statut « à relire » tant qu'un enseignant ne l'a pas validé.
 */
const R = String.raw;

/* Matrices réutilisées dans plusieurs fiches. */
const ROT = R`\begin{pmatrix}0&-1\\1&0\end{pmatrix}`; // rotation d'angle pi/2
const JOR = R`\begin{pmatrix}1&1\\0&1\end{pmatrix}`; // bloc de Jordan 2x2 de valeur propre 1

module.exports = {
  id: 'reduction',
  title: 'Réduction des endomorphismes',
  review: 'a-relire',
  frame: R`Dans tout le chapitre, $\mathbb{K}$ désigne $\mathbb{R}$ ou $\mathbb{C}$, $E$ un $\mathbb{K}$-espace vectoriel de dimension finie $n \geq 1$ (sauf mention contraire), $u \in \mathcal{L}(E)$ et $A \in \mathcal{M}_n(\mathbb{K})$.`,

  sources: [
    {
      id: 'prog-mp',
      label: 'Programme de mathématiques de MP, section « Réduction des endomorphismes et des matrices carrées »',
      url: 'https://cahier-de-prepa.fr/mp2-montaigne/download?id=89'
    },
    {
      id: 'jury-2024',
      label: "Rapport du jury de l'agrégation externe de mathématiques, session 2024 (leçons 153 à 157)",
      url: 'https://devenirenseignant.gouv.fr/media/14767/download'
    }
  ],

  /* ================================================================== */
  /* Notions (fiches de découverte)                                      */
  /* ================================================================== */
  notions: [
    /* ---------------- Leçon 1 : éléments propres ---------------- */
    {
      id: 'n-elements-propres', lesson: 'l1', kind: 'Définition',
      title: 'Valeur propre, vecteur propre, sous-espace propre',
      status: 'programme', level: 'cpge', proof: null, source: 'prog-mp',
      statement: R`Un scalaire $\lambda \in \mathbb{K}$ est **valeur propre** de $u$ s'il existe un vecteur $x \neq 0$ tel que $u(x) = \lambda x$. Un tel $x$ est un **vecteur propre** associé à $\lambda$.
Le **sous-espace propre** associé est $E_\lambda(u) = \operatorname{Ker}(u - \lambda\,\mathrm{Id}_E)$. Le **spectre** $\operatorname{Sp}(u)$ est l'ensemble des valeurs propres.`,
      hypotheses: [
        R`Le vecteur propre est **non nul** : c'est dans la définition.`,
        R`La valeur propre est cherchée **dans le corps** $\mathbb{K}$.`
      ],
      idea: R`$\lambda$ est valeur propre si et seulement si $u - \lambda\,\mathrm{Id}_E$ n'est pas injectif, c'est-à-dire (en dimension finie) pas inversible.`,
      counterexamples: [
        R`La matrice $${ROT}$ (rotation d'angle $\pi/2$) n'a aucune valeur propre réelle, mais admet $i$ et $-i$ comme valeurs propres complexes.`
      ],
      pitfalls: [
        R`$E_\lambda(u)$ n'est pas « l'ensemble des vecteurs propres » : il contient aussi le vecteur nul.`,
        R`$0$ peut être valeur propre : c'est le cas exactement quand $u$ n'est pas injectif.`
      ],
      notations: [
        R`$E_\lambda(u)$, $\operatorname{Ker}(u - \lambda\,\mathrm{Id}_E)$ et $\operatorname{Ker}(\lambda\,\mathrm{Id}_E - u)$ désignent le même sous-espace.`,
        R`Pour une matrice on précise le corps : $\operatorname{Sp}_{\mathbb{R}}(A) \subset \operatorname{Sp}_{\mathbb{C}}(A)$.`
      ]
    },
    {
      id: 'n-somme-directe', lesson: 'l1', kind: 'Théorème',
      title: 'Les sous-espaces propres sont en somme directe',
      status: 'programme', level: 'cpge', proof: 'exigible', source: 'prog-mp',
      statement: R`Si $\lambda_1, \dots, \lambda_p$ sont des valeurs propres de $u$ **deux à deux distinctes**, alors la somme $E_{\lambda_1}(u) + \dots + E_{\lambda_p}(u)$ est directe.
**Corollaires.** Une famille de vecteurs propres associés à des valeurs propres deux à deux distinctes est libre. En dimension $n$, $u$ a au plus $n$ valeurs propres.`,
      hypotheses: [R`Les valeurs propres sont **deux à deux distinctes**.`],
      idea: R`Récurrence sur $p$ : on applique $u$ à une relation $x_1 + \dots + x_p = 0$, puis on retranche $\lambda_p$ fois la relation de départ pour éliminer $x_p$.`,
      counterexamples: [],
      pitfalls: [
        R`La somme est directe, mais elle n'est pas toujours égale à $E$ : l'égalité $E = \bigoplus_\lambda E_\lambda(u)$ caractérise les endomorphismes diagonalisables.`
      ],
      notations: []
    },
    {
      id: 'n-commutation', lesson: 'l1', kind: 'Proposition',
      title: 'Endomorphismes qui commutent',
      status: 'programme', level: 'cpge', proof: 'exigible', source: 'prog-mp',
      statement: R`Si $u \circ v = v \circ u$, alors tout sous-espace propre de $u$ est stable par $v$. Il en va de même de $\operatorname{Ker} u$ et de $\operatorname{Im} u$.`,
      hypotheses: [R`$u$ et $v$ **commutent**.`],
      idea: R`Si $u(x) = \lambda x$, alors $u(v(x)) = v(u(x)) = \lambda\, v(x)$, donc $v(x) \in E_\lambda(u)$.`,
      counterexamples: [],
      pitfalls: [
        R`Commuter ne signifie pas avoir les mêmes vecteurs propres : $\mathrm{Id}_E$ commute avec tout endomorphisme, et tout vecteur non nul est vecteur propre de $\mathrm{Id}_E$.`
      ],
      notations: []
    },

    /* ---------------- Leçon 2 : polynôme caractéristique ---------------- */
    {
      id: 'n-poly-car', lesson: 'l2', kind: 'Définition',
      title: 'Polynôme caractéristique',
      status: 'programme', level: 'cpge', proof: null, source: 'prog-mp',
      statement: R`Le polynôme caractéristique de $A$ est $\chi_A = \det(X I_n - A)$. Il est **unitaire de degré $n$** et
$$\chi_A = X^n - \operatorname{tr}(A)\,X^{n-1} + \dots + (-1)^n \det(A).$$
Deux matrices semblables ont le même polynôme caractéristique, ce qui permet de définir $\chi_u$.`,
      hypotheses: [],
      idea: R`Pour $n = 2$ : $\chi_A = X^2 - \operatorname{tr}(A)\,X + \det(A)$.`,
      counterexamples: [
        R`La réciproque est fausse : $I_2$ et $${JOR}$ ont le même polynôme caractéristique $(X-1)^2$ sans être semblables, car la seule matrice semblable à $I_2$ est $I_2$.`
      ],
      pitfalls: [
        R`Le terme constant est $(-1)^n \det(A)$ et non $\det(A)$ : il vaut $\chi_A(0) = \det(-A)$.`
      ],
      notations: [
        R`De nombreux ouvrages posent $\det(A - X I_n)$, qui vaut $(-1)^n \chi_A$ : mêmes racines, mais polynôme non unitaire quand $n$ est impair. Le programme actuel retient $\det(X I_n - A)$.`
      ]
    },
    {
      id: 'n-multiplicites', lesson: 'l2', kind: 'Théorème',
      title: 'Racines du polynôme caractéristique et multiplicités',
      status: 'programme', level: 'cpge', proof: 'exigible', source: 'prog-mp',
      statement: R`Les valeurs propres de $u$ sont exactement les racines de $\chi_u$ dans $\mathbb{K}$. Si $\lambda$ est valeur propre de multiplicité $m(\lambda)$ dans $\chi_u$, alors
$$1 \leq \dim E_\lambda(u) \leq m(\lambda).$$`,
      hypotheses: [R`Les racines sont prises **dans $\mathbb{K}$**.`],
      idea: R`$E_\lambda(u)$ est stable par $u$ et l'endomorphisme induit y est une homothétie : son polynôme caractéristique $(X - \lambda)^{\dim E_\lambda}$ divise $\chi_u$.`,
      counterexamples: [
        R`Pour $${JOR}$ : $m(1) = 2$ mais $\dim E_1 = 1$. L'inégalité peut être stricte.`
      ],
      pitfalls: [
        R`Ne pas confondre la multiplicité $m(\lambda)$ (dans $\chi_u$) et la dimension de $E_\lambda(u)$.`,
        R`Sur $\mathbb{C}$, toute matrice a au moins une valeur propre. Sur $\mathbb{R}$, c'est garanti seulement en dimension impaire.`
      ],
      notations: [R`On dit aussi multiplicité **algébrique** pour $m(\lambda)$ et multiplicité **géométrique** pour $\dim E_\lambda(u)$.`]
    },
    {
      id: 'n-cayley-hamilton', lesson: 'l2', kind: 'Théorème',
      title: 'Théorème de Cayley-Hamilton',
      status: 'programme', level: 'cpge', proof: 'non-exigible', source: 'prog-mp',
      statement: R`Le polynôme caractéristique annule l'endomorphisme : $\chi_u(u) = 0$, et de même $\chi_A(A) = 0$.`,
      hypotheses: [R`$E$ est de **dimension finie**.`],
      idea: R`La démonstration n'est pas exigible en MP. Conséquence à retenir : le polynôme minimal divise $\chi_u$, donc son degré est au plus $n$.`,
      counterexamples: [],
      pitfalls: [
        R`La « preuve » $\chi_A(A) = \det(A I_n - A) = \det(0) = 0$ est fausse : on ne peut pas remplacer $X$ par $A$ à l'intérieur du déterminant. D'ailleurs $\chi_A(A)$ est une matrice alors que $\det(\cdot)$ est un scalaire.`
      ],
      notations: []
    },

    /* ---------------- Leçon 3 : diagonalisation ---------------- */
    {
      id: 'n-diagonalisable', lesson: 'l3', kind: 'Théorème',
      title: 'Critères de diagonalisabilité',
      status: 'programme', level: 'cpge', proof: 'exigible', source: 'prog-mp',
      statement: R`$u$ est **diagonalisable** s'il existe une base de $E$ formée de vecteurs propres de $u$. Sont équivalents :
(i) $u$ est diagonalisable ;
(ii) $E = \bigoplus_{\lambda \in \operatorname{Sp}(u)} E_\lambda(u)$ ;
(iii) $\sum_{\lambda \in \operatorname{Sp}(u)} \dim E_\lambda(u) = n$ ;
(iv) $\chi_u$ est **scindé sur $\mathbb{K}$** et $\dim E_\lambda(u) = m(\lambda)$ pour toute valeur propre $\lambda$.`,
      hypotheses: [
        R`Dans (iv), les **deux** conditions comptent : $\chi_u$ scindé sur $\mathbb{K}$ **et** égalité des dimensions.`
      ],
      idea: R`La somme des sous-espaces propres est toujours directe ; elle vaut $E$ exactement quand les dimensions s'ajoutent à $n$.`,
      counterexamples: [
        R`Sans « scindé » : $${ROT}$ sur $\mathbb{R}$ n'a aucune valeur propre réelle, donc la condition sur les dimensions est vide, et pourtant la matrice n'est pas diagonalisable sur $\mathbb{R}$.`,
        R`Sans l'égalité des dimensions : $${JOR}$ a un polynôme caractéristique scindé mais n'est pas diagonalisable.`
      ],
      pitfalls: [
        R`« Diagonalisable » dépend du corps : $${ROT}$ est diagonalisable sur $\mathbb{C}$ mais pas sur $\mathbb{R}$. Le jury de l'agrégation demande de toujours préciser le corps.`
      ],
      notations: [
        R`Version matricielle : $A$ est diagonalisable s'il existe $P \in \mathrm{GL}_n(\mathbb{K})$ telle que $P^{-1} A P$ soit diagonale.`
      ]
    },
    {
      id: 'n-vp-distinctes', lesson: 'l3', kind: 'Proposition',
      title: 'Cas de n valeurs propres distinctes',
      status: 'programme', level: 'cpge', proof: 'exigible', source: 'prog-mp',
      statement: R`Si $u$ possède $n$ valeurs propres deux à deux distinctes (c'est-à-dire si $\chi_u$ est scindé à racines simples), alors $u$ est diagonalisable et chaque sous-espace propre est une droite.`,
      hypotheses: [R`**$n$** valeurs propres distinctes, où $n = \dim E$.`],
      idea: R`$n$ vecteurs propres associés à des valeurs propres distinctes forment une famille libre de $n$ vecteurs, donc une base.`,
      counterexamples: [],
      pitfalls: [
        R`C'est une condition **suffisante**, pas nécessaire : $\mathrm{Id}_E$ est diagonalisable avec une seule valeur propre.`
      ],
      notations: []
    },
    {
      id: 'n-exemples-diag', lesson: 'l3', kind: 'Exemples',
      title: 'Exemples à connaître',
      status: 'programme', level: 'cpge', proof: null, source: 'jury-2024',
      statement: R`Les **projecteurs** ($p \circ p = p$) et les **symétries** ($s \circ s = \mathrm{Id}_E$) sont diagonalisables, de spectres inclus dans $\{0, 1\}$ et $\{-1, 1\}$.
Toute matrice **symétrique réelle** est diagonalisable sur $\mathbb{R}$ (théorème spectral).`,
      hypotheses: [R`Pour le théorème spectral : coefficients **réels**.`],
      idea: R`Pour un projecteur, $E = \operatorname{Ker}(p) \oplus \operatorname{Im}(p)$ avec $\operatorname{Im}(p) = \operatorname{Ker}(p - \mathrm{Id}_E)$.`,
      counterexamples: [
        R`Une matrice symétrique **complexe** n'est pas toujours diagonalisable : $\begin{pmatrix}1&i\\i&-1\end{pmatrix}$ est non nulle et de carré nul.`
      ],
      pitfalls: [
        R`Une matrice triangulaire n'est pas forcément diagonalisable ; elle l'est si ses coefficients diagonaux sont deux à deux distincts.`
      ],
      notations: []
    },

    /* ---------------- Leçon 4 : polynômes annulateurs ---------------- */
    {
      id: 'n-poly-minimal', lesson: 'l4', kind: 'Définition',
      title: 'Polynôme annulateur, polynôme minimal',
      status: 'programme', level: 'cpge', proof: 'exigible', source: 'prog-mp',
      statement: R`$P \in \mathbb{K}[X]$ est **annulateur** de $u$ si $P(u) = 0$. En dimension finie, il existe un unique polynôme unitaire $\pi_u$, le **polynôme minimal**, tel que
$$P(u) = 0 \iff \pi_u \text{ divise } P.$$
Si $d = \deg \pi_u$, alors $(\mathrm{Id}_E, u, \dots, u^{d-1})$ est une base de $\mathbb{K}[u]$.`,
      hypotheses: [R`$E$ est de **dimension finie** (pour l'existence d'un annulateur non nul).`],
      idea: R`$P \mapsto P(u)$ est un morphisme d'algèbres de $\mathbb{K}[X]$ dans $\mathcal{L}(E)$. Son noyau est un idéal non nul, car $\mathcal{L}(E)$ est de dimension finie ; $\pi_u$ est son générateur unitaire.`,
      counterexamples: [
        R`En dimension infinie, la dérivation $D : P \mapsto P'$ sur $\mathbb{K}[X]$ n'a aucun polynôme annulateur non nul.`
      ],
      pitfalls: [
        R`Le polynôme minimal n'est pas toujours égal au polynôme caractéristique : pour $I_n$, $\pi = X - 1$ et $\chi = (X-1)^n$.`
      ],
      notations: [R`On rencontre $\pi_u$, $\mu_u$ ou $m_u$ selon les auteurs.`]
    },
    {
      id: 'n-vp-annulateur', lesson: 'l4', kind: 'Proposition',
      title: 'Valeurs propres et polynômes annulateurs',
      status: 'programme', level: 'cpge', proof: 'exigible', source: 'prog-mp',
      statement: R`Si $u(x) = \lambda x$, alors $P(u)(x) = P(\lambda)\,x$ pour tout polynôme $P$. En particulier, si $P$ annule $u$, **toute valeur propre de $u$ est racine de $P$**.
Les racines de $\pi_u$ dans $\mathbb{K}$ sont exactement les valeurs propres de $u$.`,
      hypotheses: [],
      idea: R`Par récurrence $u^k(x) = \lambda^k x$, puis on conclut par linéarité.`,
      counterexamples: [
        R`$X(X-1)$ annule $\mathrm{Id}_E$, mais $0$ n'est pas valeur propre de $\mathrm{Id}_E$.`
      ],
      pitfalls: [
        R`L'inclusion va dans un seul sens : $\operatorname{Sp}(u) \subset \{\text{racines de } P\}$. Une racine d'un polynôme annulateur n'est pas forcément valeur propre.`
      ],
      notations: []
    },
    {
      id: 'n-lemme-noyaux', lesson: 'l4', kind: 'Théorème',
      title: 'Lemme de décomposition des noyaux',
      status: 'programme', level: 'cpge', proof: 'exigible', source: 'prog-mp',
      statement: R`Soient $P_1, \dots, P_r \in \mathbb{K}[X]$ **deux à deux premiers entre eux** et $P = P_1 \cdots P_r$. Alors
$$\operatorname{Ker} P(u) = \bigoplus_{i=1}^{r} \operatorname{Ker} P_i(u).$$`,
      hypotheses: [R`Les $P_i$ sont **deux à deux premiers entre eux**.`],
      idea: R`Pour $r = 2$ : une relation de Bézout $A P_1 + B P_2 = 1$ donne $\mathrm{Id}_E = A(u) \circ P_1(u) + B(u) \circ P_2(u)$, qui fournit à la fois la décomposition et son unicité. Les projecteurs associés sont des polynômes en $u$.`,
      counterexamples: [
        R`Avec $P_1 = P_2 = X$ et $u$ nilpotent d'indice 2 : $\operatorname{Ker} u^2 = E$, alors que $\operatorname{Ker} u + \operatorname{Ker} u = \operatorname{Ker} u \neq E$.`
      ],
      pitfalls: [
        R`Le lemme ne demande ni que $P$ annule $u$, ni que $E$ soit de dimension finie.`
      ],
      notations: [R`On dit aussi « lemme des noyaux ».`]
    },
    {
      id: 'n-critere-annulateur', lesson: 'l4', kind: 'Théorème',
      title: 'Diagonalisabilité et polynômes annulateurs',
      status: 'programme', level: 'cpge', proof: 'exigible', source: 'prog-mp',
      statement: R`Sont équivalents :
(i) $u$ est diagonalisable ;
(ii) $u$ admet un polynôme annulateur **scindé sur $\mathbb{K}$ à racines simples** ;
(iii) $\pi_u$ est scindé sur $\mathbb{K}$ à racines simples.
**Conséquence.** Si $u$ est diagonalisable et $F$ est stable par $u$, l'endomorphisme induit $u_F$ est diagonalisable.`,
      hypotheses: [
        R`Le polynôme est **scindé sur $\mathbb{K}$**.`,
        R`Ses racines sont **simples**.`
      ],
      idea: R`Sens réciproque : le lemme des noyaux appliqué à $\prod (X - \lambda_i)$ donne $E = \bigoplus \operatorname{Ker}(u - \lambda_i \mathrm{Id}_E)$. Pour $u_F$ : $\pi_u$ annule $u_F$.`,
      counterexamples: [
        R`Scindé sans racines simples : $X^2$ annule un nilpotent d'indice 2, qui n'est pas diagonalisable.`,
        R`Racines simples sans être scindé sur $\mathbb{K}$ : $X^2 + 1$ annule $${ROT}$, qui n'est pas diagonalisable sur $\mathbb{R}$.`
      ],
      pitfalls: [
        R`Il suffit d'**un** polynôme annulateur scindé à racines simples ; nul besoin de calculer $\pi_u$ ou $\chi_u$.`
      ],
      notations: []
    },

    /* ---------------- Leçon 5 : trigonalisation, nilpotence ---------------- */
    {
      id: 'n-trigonalisable', lesson: 'l5', kind: 'Théorème',
      title: 'Trigonalisation',
      status: 'programme', level: 'cpge', proof: 'exigible', source: 'prog-mp',
      statement: R`$u$ est **trigonalisable** s'il existe une base dans laquelle sa matrice est triangulaire supérieure. C'est le cas **si et seulement si $\chi_u$ est scindé sur $\mathbb{K}$**. En particulier, tout endomorphisme d'un $\mathbb{C}$-espace vectoriel de dimension finie est trigonalisable.
Si $\chi_u = \prod_{i=1}^{n} (X - \lambda_i)$, alors $\operatorname{tr}(u) = \sum \lambda_i$ et $\det(u) = \prod \lambda_i$.`,
      hypotheses: [R`$\chi_u$ est **scindé sur $\mathbb{K}$**.`],
      idea: R`Récurrence sur $n$ : un polynôme scindé a une racine, donc $u$ a un vecteur propre ; on le complète en une base et on applique l'hypothèse de récurrence au bloc restant.`,
      counterexamples: [
        R`$${ROT}$ n'est pas trigonalisable sur $\mathbb{R}$ : son polynôme caractéristique $X^2 + 1$ n'a pas de racine réelle.`
      ],
      pitfalls: [
        R`Pour une matrice réelle, la trace est la somme des valeurs propres **complexes** comptées avec multiplicité, pas des seules valeurs propres réelles.`,
        R`En MP, la pratique de la trigonalisation n'est pas un objectif au-delà de cas simples ; la réduction de Jordan est hors programme.`
      ],
      notations: [R`Certains auteurs disent « triangularisable ».`]
    },
    {
      id: 'n-nilpotent', lesson: 'l5', kind: 'Théorème',
      title: 'Endomorphismes nilpotents',
      status: 'programme', level: 'cpge', proof: 'exigible', source: 'prog-mp',
      statement: R`$u$ est **nilpotent** s'il existe $p \geq 1$ tel que $u^p = 0$ ; le plus petit tel $p$ est son **indice**. Sont équivalents :
(i) $u$ est nilpotent ;
(ii) $u$ est trigonalisable et sa seule valeur propre est $0$ ;
(iii) $\chi_u = X^n$.
L'indice de nilpotence est au plus $n$ ; en particulier $u^n = 0$.`,
      hypotheses: [R`Dans (ii), « trigonalisable » ne peut pas être omis lorsque $\mathbb{K} = \mathbb{R}$.`],
      idea: R`Si $u^p = 0$, alors $X^p$ est annulateur : il est scindé et sa seule racine est $0$. Réciproquement, Cayley-Hamilton donne $u^n = 0$.`,
      counterexamples: [
        R`$\begin{pmatrix}0&0&0\\0&0&-1\\0&1&0\end{pmatrix}$ a pour seule valeur propre **réelle** $0$, mais son polynôme caractéristique est $X(X^2+1)$ : elle n'est pas nilpotente.`
      ],
      pitfalls: [
        R`Un endomorphisme nilpotent **et** diagonalisable est nul.`
      ],
      notations: []
    },
    {
      id: 'n-dunford', lesson: 'l5', kind: 'Théorème',
      title: 'Décomposition de Dunford',
      status: 'hors-programme', level: 'agreg', proof: 'exigible', source: 'jury-2024',
      statement: R`Si $\chi_u$ est scindé sur $\mathbb{K}$, il existe un unique couple $(d, \nu)$ d'endomorphismes de $E$, avec $d$ diagonalisable et $\nu$ nilpotent, tel que
$$u = d + \nu \quad \text{et} \quad d \circ \nu = \nu \circ d.$$
De plus, $d$ et $\nu$ sont des polynômes en $u$.`,
      hypotheses: [
        R`$\chi_u$ est **scindé sur $\mathbb{K}$**.`,
        R`$d$ et $\nu$ **commutent** : sans cette condition, il n'y a pas unicité.`
      ],
      idea: R`Le lemme des noyaux appliqué à $\chi_u = \prod (X - \lambda_i)^{m_i}$ décompose $E$ en sous-espaces caractéristiques $\operatorname{Ker}(u - \lambda_i \mathrm{Id}_E)^{m_i}$. Les projecteurs $p_i$ associés sont des polynômes en $u$ ; on pose $d = \sum \lambda_i p_i$ et $\nu = u - d$.`,
      counterexamples: [
        R`$\begin{pmatrix}1&1\\0&2\end{pmatrix} = \begin{pmatrix}1&0\\0&2\end{pmatrix} + \begin{pmatrix}0&1\\0&0\end{pmatrix}$ n'est **pas** la décomposition de Dunford : les deux termes ne commutent pas. La matrice est diagonalisable, donc $d$ est la matrice elle-même et $\nu = 0$.`
      ],
      pitfalls: [
        R`Hors programme en MP, mais attendue à l'agrégation : le jury rappelle que les composantes sont des polynômes en $u$.`
      ],
      notations: [R`On trouve aussi « décomposition de Jordan-Chevalley ».`]
    }
  ],

  /* ================================================================== */
  /* Leçons                                                              */
  /* ================================================================== */
  lessons: [
    { id: 'l1', title: 'Éléments propres', blurb: 'Valeurs propres, vecteurs propres, sous-espaces propres.' },
    { id: 'l2', title: 'Polynôme caractéristique', blurb: 'Définition, multiplicités, Cayley-Hamilton.' },
    { id: 'l3', title: 'Diagonalisation', blurb: 'Les critères, et ce qui casse sans leurs hypothèses.' },
    { id: 'l4', title: 'Polynômes annulateurs', blurb: 'Polynôme minimal, lemme des noyaux, critère de diagonalisabilité.' },
    { id: 'l5', title: 'Trigonalisation et nilpotence', blurb: 'Polynôme scindé, nilpotents, Dunford.' }
  ],

  /* ================================================================== */
  /* Questions                                                           */
  /* ================================================================== */
  questions: [
    /* ---------------- Leçon 1 ---------------- */
    {
      id: 'l1-q1', lesson: 'l1', notion: 'n-elements-propres', type: 'multi', tag: 'hypotheses',
      prompt: R`Cochez toutes les conditions qui figurent dans la définition de « $x$ est un vecteur propre de $u$ ».`,
      options: [
        R`$x \neq 0$`,
        R`Il existe $\lambda \in \mathbb{K}$ tel que $u(x) = \lambda x$`,
        R`Le scalaire $\lambda$ est non nul`,
        R`$u$ est injectif`
      ],
      answers: [0, 1],
      explain: R`Un vecteur propre est un vecteur **non nul** colinéaire à son image. La valeur propre peut être nulle, et $u$ n'a pas à être injectif.`
    },
    {
      id: 'l1-q2', lesson: 'l1', notion: 'n-elements-propres', type: 'tf', tag: 'piege',
      prompt: R`Le sous-espace propre $E_\lambda(u)$ est l'ensemble des vecteurs propres de $u$ associés à $\lambda$.`,
      answer: false,
      explain: R`$E_\lambda(u) = \operatorname{Ker}(u - \lambda\,\mathrm{Id}_E)$ contient aussi le vecteur nul, qui n'est jamais vecteur propre. L'ensemble des vecteurs propres n'est d'ailleurs pas un sous-espace vectoriel.`
    },
    {
      id: 'l1-q3', lesson: 'l1', notion: 'n-elements-propres', type: 'tf', tag: 'application',
      prompt: R`Si $0$ est valeur propre de $u$, alors $u$ n'est pas injectif.`,
      answer: true,
      explain: R`$0$ valeur propre signifie qu'il existe $x \neq 0$ avec $u(x) = 0$, c'est-à-dire $\operatorname{Ker} u \neq \{0\}$.`
    },
    {
      id: 'l1-q4', lesson: 'l1', notion: 'n-elements-propres', type: 'mcq', tag: 'cadre',
      prompt: R`Soit $A = ${ROT}$. Que vaut $\operatorname{Sp}_{\mathbb{R}}(A)$ ?`,
      options: [R`$\varnothing$`, R`$\{i, -i\}$`, R`$\{0\}$`, R`$\{1, -1\}$`],
      answer: 0,
      explain: R`$\chi_A = X^2 + 1$ n'a pas de racine réelle : le spectre réel est vide. Le spectre complexe est $\{i, -i\}$. Le spectre dépend du corps.`
    },
    {
      id: 'l1-q5', lesson: 'l1', notion: 'n-somme-directe', type: 'order', tag: 'demo',
      prompt: R`Remettez dans l'ordre la démonstration, par récurrence sur $p$, du fait que des sous-espaces propres associés à des valeurs propres distinctes $\lambda_1, \dots, \lambda_p$ sont en somme directe.`,
      steps: [
        R`On démontre par récurrence sur $p \geq 1$ la propriété $\mathcal{P}(p)$ : « si $x_1 + \dots + x_p = 0$ avec $x_i \in E_{\lambda_i}(u)$, les $\lambda_i$ étant deux à deux distincts, alors tous les $x_i$ sont nuls ». Pour $p = 1$, c'est immédiat.`,
        R`Soit $p \geq 2$ tel que $\mathcal{P}(p-1)$ soit vraie, et soit une relation $x_1 + \dots + x_p = 0$ comme ci-dessus, notée $(1)$.`,
        R`En appliquant $u$ à $(1)$, on obtient $\lambda_1 x_1 + \dots + \lambda_p x_p = 0$, notée $(2)$.`,
        R`La combinaison $(2) - \lambda_p \cdot (1)$ élimine $x_p$ : $\sum_{i < p} (\lambda_i - \lambda_p)\, x_i = 0$.`,
        R`Chaque $(\lambda_i - \lambda_p)\, x_i$ appartient à $E_{\lambda_i}(u)$ : d'après $\mathcal{P}(p-1)$, ces vecteurs sont nuls, donc $x_i = 0$ pour $i < p$ puisque $\lambda_i \neq \lambda_p$.`,
        R`En reportant dans $(1)$, il vient enfin $x_p = 0$ : $\mathcal{P}(p)$ est vraie.`
      ],
      explain: R`L'idée clé est d'éliminer $x_p$ en combinant la relation et son image par $u$. L'hypothèse « valeurs propres distinctes » sert à simplifier par $\lambda_i - \lambda_p \neq 0$. Ne pas oublier d'énoncer la propriété et de traiter l'initialisation.`
    },
    {
      id: 'l1-q6', lesson: 'l1', notion: 'n-somme-directe', type: 'tf', tag: 'piege',
      prompt: R`Si $\lambda_1, \dots, \lambda_p$ sont toutes les valeurs propres de $u$, alors $E = E_{\lambda_1}(u) \oplus \dots \oplus E_{\lambda_p}(u)$.`,
      answer: false,
      explain: R`La somme est toujours directe, mais elle n'est égale à $E$ que si $u$ est diagonalisable. Pour $${JOR}$, la seule valeur propre est $1$ et $E_1$ est une droite, pas le plan entier.`
    },
    {
      id: 'l1-q7', lesson: 'l1', notion: 'n-commutation', type: 'mcq', tag: 'application',
      prompt: R`On suppose que $u \circ v = v \circ u$. Quelle affirmation est toujours vraie ?`,
      options: [
        R`Tout sous-espace propre de $u$ est stable par $v$`,
        R`$u$ et $v$ ont les mêmes valeurs propres`,
        R`Tout vecteur propre de $u$ est vecteur propre de $v$`,
        R`$u \circ v$ est diagonalisable`
      ],
      answer: 0,
      explain: R`Si $u(x) = \lambda x$, alors $u(v(x)) = v(u(x)) = \lambda v(x)$. Les autres affirmations sont fausses : prendre $u = \mathrm{Id}_E$, qui commute avec tout $v$.`
    },
    {
      id: 'l1-q8', lesson: 'l1', notion: 'n-elements-propres', type: 'mcq', tag: 'notation',
      prompt: R`Laquelle de ces écritures ne désigne **pas** le sous-espace propre de $u$ associé à $\lambda$ ?`,
      options: [
        R`$\operatorname{Im}(u - \lambda\,\mathrm{Id}_E)$`,
        R`$\operatorname{Ker}(u - \lambda\,\mathrm{Id}_E)$`,
        R`$\operatorname{Ker}(\lambda\,\mathrm{Id}_E - u)$`,
        R`$\{x \in E \mid u(x) = \lambda x\}$`
      ],
      answer: 0,
      explain: R`Le sous-espace propre est un **noyau**. Changer le signe ne change pas le noyau, donc $\operatorname{Ker}(u - \lambda\,\mathrm{Id}_E) = \operatorname{Ker}(\lambda\,\mathrm{Id}_E - u)$.`
    },
    {
      id: 'l1-q9', lesson: 'l1', notion: 'n-somme-directe', type: 'card', tag: 'restitution',
      prompt: R`Énoncez le théorème sur la somme des sous-espaces propres, avec son hypothèse, puis ses deux corollaires.`,
      back: R`**Théorème.** Si $\lambda_1, \dots, \lambda_p$ sont des valeurs propres de $u$ deux à deux distinctes, la somme $E_{\lambda_1}(u) + \dots + E_{\lambda_p}(u)$ est directe.
**Corollaire 1.** Une famille de vecteurs propres associés à des valeurs propres deux à deux distinctes est libre.
**Corollaire 2.** En dimension $n$, $u$ a au plus $n$ valeurs propres.`,
      explain: R`Vérifiez que vous avez bien dit « deux à deux distinctes » et « directe » (et non « égale à $E$ »).`
    },

    /* ---------------- Leçon 2 ---------------- */
    {
      id: 'l2-q1', lesson: 'l2', notion: 'n-poly-car', type: 'mcq', tag: 'notation',
      prompt: R`Avec la convention $\chi_A = \det(X I_n - A)$, que vaut $\det(A - X I_n)$ pour $A \in \mathcal{M}_n(\mathbb{K})$ ?`,
      options: [R`$(-1)^n \chi_A$`, R`$\chi_A$`, R`$-\chi_A$`, R`$\chi_{-A}$`],
      answer: 0,
      explain: R`$A - X I_n = -(X I_n - A)$ et $\det(-M) = (-1)^n \det(M)$. Les deux conventions coïncident quand $n$ est pair et diffèrent d'un signe quand $n$ est impair.`
    },
    {
      id: 'l2-q2', lesson: 'l2', notion: 'n-poly-car', type: 'mcq', tag: 'restitution',
      prompt: R`Quel est le coefficient de $X^{n-1}$ dans $\chi_A = \det(X I_n - A)$ ?`,
      options: [R`$-\operatorname{tr}(A)$`, R`$\operatorname{tr}(A)$`, R`$(-1)^n \operatorname{tr}(A)$`, R`$\det(A)$`],
      answer: 0,
      explain: R`$\chi_A = X^n - \operatorname{tr}(A)\,X^{n-1} + \dots + (-1)^n \det(A)$. On le vérifie pour $n = 2$ : $X^2 - \operatorname{tr}(A) X + \det(A)$.`
    },
    {
      id: 'l2-q3', lesson: 'l2', notion: 'n-poly-car', type: 'mcq', tag: 'piege',
      prompt: R`Quel est le terme constant de $\chi_A = \det(X I_n - A)$ ?`,
      options: [R`$(-1)^n \det(A)$`, R`$\det(A)$`, R`$-\det(A)$`, R`$\operatorname{tr}(A)$`],
      answer: 0,
      explain: R`Le terme constant est $\chi_A(0) = \det(-A) = (-1)^n \det(A)$. L'oubli du signe est une erreur fréquente en dimension impaire.`
    },
    {
      id: 'l2-q4', lesson: 'l2', notion: 'n-poly-car', type: 'tf', tag: 'piege',
      prompt: R`Deux matrices de $\mathcal{M}_n(\mathbb{K})$ qui ont le même polynôme caractéristique sont semblables.`,
      answer: false,
      explain: R`$I_2$ et $${JOR}$ ont toutes deux $(X-1)^2$ pour polynôme caractéristique, mais la seule matrice semblable à $I_2$ est $I_2$. Seul le sens direct est vrai : semblables implique même polynôme caractéristique.`
    },
    {
      id: 'l2-q5', lesson: 'l2', notion: 'n-multiplicites', type: 'multi', tag: 'hypotheses',
      prompt: R`Soit $\lambda$ une valeur propre de $u$, de multiplicité $m(\lambda)$ dans $\chi_u$. Cochez les affirmations toujours vraies.`,
      options: [
        R`$\dim E_\lambda(u) \geq 1$`,
        R`$\dim E_\lambda(u) \leq m(\lambda)$`,
        R`$\dim E_\lambda(u) = m(\lambda)$`,
        R`$\dim E_\lambda(u) \geq m(\lambda)$`
      ],
      answers: [0, 1],
      explain: R`On a toujours $1 \leq \dim E_\lambda(u) \leq m(\lambda)$. L'égalité pour toutes les valeurs propres, jointe au caractère scindé de $\chi_u$, équivaut à la diagonalisabilité.`
    },
    {
      id: 'l2-q6', lesson: 'l2', notion: 'n-cayley-hamilton', type: 'mcq', tag: 'piege',
      prompt: R`Un étudiant écrit : « $\chi_A(A) = \det(A \cdot I_n - A) = \det(0) = 0$, ce qui prouve le théorème de Cayley-Hamilton. » Où est l'erreur ?`,
      options: [
        R`On ne peut pas substituer la matrice $A$ à $X$ à l'intérieur du déterminant ; d'ailleurs $\chi_A(A)$ est une matrice, pas un scalaire`,
        R`$\det(0)$ ne vaut pas $0$`,
        R`La conclusion est fausse : $\chi_A(A) \neq 0$ en général`,
        R`Il n'y a pas d'erreur, la preuve est correcte`
      ],
      answer: 0,
      explain: R`$\chi_A(A)$ s'obtient en développant d'abord le déterminant en un polynôme, puis en évaluant ce polynôme en $A$ : le résultat est une matrice de $\mathcal{M}_n(\mathbb{K})$. Le théorème est vrai, mais cet argument ne le prouve pas.`
    },
    {
      id: 'l2-q7', lesson: 'l2', notion: 'n-multiplicites', type: 'tf', tag: 'cadre',
      prompt: R`Toute matrice de $\mathcal{M}_3(\mathbb{R})$ possède au moins une valeur propre réelle.`,
      answer: true,
      explain: R`$\chi_A$ est un polynôme réel de degré 3, donc de degré impair : ses limites en $\pm\infty$ sont de signes opposés et il est continu, donc il admet une racine réelle (théorème des valeurs intermédiaires). C'est faux en dimension paire, comme le montre $${ROT}$.`
    },
    {
      id: 'l2-q8', lesson: 'l2', notion: 'n-poly-car', type: 'mcq', tag: 'application',
      prompt: R`Soit $A \in \mathcal{M}_2(\mathbb{R})$ avec $\operatorname{tr}(A) = 5$ et $\det(A) = 6$. Quel est le spectre de $A$ ?`,
      options: [R`$\{2, 3\}$`, R`$\{1, 6\}$`, R`$\{-2, -3\}$`, R`$\{5, 6\}$`],
      answer: 0,
      explain: R`$\chi_A = X^2 - 5X + 6 = (X - 2)(X - 3)$.`
    },
    {
      id: 'l2-q9', lesson: 'l2', notion: 'n-cayley-hamilton', type: 'card', tag: 'restitution',
      prompt: R`Énoncez le théorème de Cayley-Hamilton. Sa démonstration est-elle exigible en MP ? Quelle conséquence a-t-il pour le polynôme minimal ?`,
      back: R`**Énoncé.** En dimension finie, $\chi_u(u) = 0$ (et $\chi_A(A) = 0$).
**Statut.** La démonstration n'est pas exigible en MP.
**Conséquence.** $\pi_u$ divise $\chi_u$, donc $\deg \pi_u \leq n$.`,
      explain: R`À l'agrégation, en revanche, il faut savoir le démontrer.`
    },

    /* ---------------- Leçon 3 ---------------- */
    {
      id: 'l3-q1', lesson: 'l3', notion: 'n-diagonalisable', type: 'multi', tag: 'hypotheses',
      prompt: R`Soit $u \in \mathcal{L}(E)$ avec $\dim E = n$. Cochez toutes les conditions **équivalentes** à « $u$ est diagonalisable ».`,
      options: [
        R`$E$ est la somme directe des sous-espaces propres de $u$`,
        R`La somme des dimensions des sous-espaces propres vaut $n$`,
        R`$\chi_u$ est scindé sur $\mathbb{K}$ et $\dim E_\lambda(u) = m(\lambda)$ pour toute valeur propre $\lambda$`,
        R`$\chi_u$ est scindé sur $\mathbb{K}$`,
        R`$u$ possède $n$ valeurs propres deux à deux distinctes`
      ],
      answers: [0, 1, 2],
      explain: R`« $\chi_u$ scindé » seul caractérise la trigonalisabilité. Avoir $n$ valeurs propres distinctes est suffisant mais pas nécessaire (penser à $\mathrm{Id}_E$).`
    },
    {
      id: 'l3-q2', lesson: 'l3', notion: 'n-diagonalisable', type: 'tf', tag: 'piege',
      prompt: R`Soit $A \in \mathcal{M}_n(\mathbb{R})$. Si $\dim E_\lambda(A) = m(\lambda)$ pour toute valeur propre réelle $\lambda$ de $A$, alors $A$ est diagonalisable sur $\mathbb{R}$.`,
      answer: false,
      explain: R`Il manque l'hypothèse « $\chi_A$ scindé sur $\mathbb{R}$ ». La matrice $${ROT}$ n'a aucune valeur propre réelle : la condition est vide, donc vraie, et pourtant la matrice n'est pas diagonalisable sur $\mathbb{R}$.`
    },
    {
      id: 'l3-q3', lesson: 'l3', notion: 'n-vp-distinctes', type: 'tf', tag: 'piege',
      prompt: R`Si $u$ est diagonalisable, alors $u$ possède $n$ valeurs propres deux à deux distinctes.`,
      answer: false,
      explain: R`C'est la réciproque d'une condition suffisante, et elle est fausse : $\mathrm{Id}_E$ est diagonalisable avec une seule valeur propre.`
    },
    {
      id: 'l3-q4', lesson: 'l3', notion: 'n-diagonalisable', type: 'mcq', tag: 'application',
      prompt: R`La matrice $A = ${JOR}$ est-elle diagonalisable sur $\mathbb{C}$ ?`,
      options: [
        R`Non : sa seule valeur propre est $1$, donc si elle était diagonalisable elle serait semblable à $I_2$, donc égale à $I_2$`,
        R`Oui, car son polynôme caractéristique est scindé sur $\mathbb{C}$`,
        R`Oui, car elle est triangulaire`,
        R`Non, car elle n'est pas inversible`
      ],
      answer: 0,
      explain: R`Argument à retenir : une matrice diagonalisable ayant une seule valeur propre $\lambda$ est égale à $\lambda I_n$. Ici $\dim E_1 = 1 < 2 = m(1)$. La matrice est par ailleurs inversible.`
    },
    {
      id: 'l3-q5', lesson: 'l3', notion: 'n-vp-distinctes', type: 'mcq', tag: 'application',
      prompt: R`Quel est l'argument le plus rapide pour justifier que $A = \begin{pmatrix}2&0&0\\0&3&1\\0&0&5\end{pmatrix}$ est diagonalisable ?`,
      options: [
        R`Elle est triangulaire à coefficients diagonaux distincts : elle a trois valeurs propres distinctes en dimension 3`,
        R`Elle est triangulaire, et toute matrice triangulaire est diagonalisable`,
        R`Elle est symétrique réelle`,
        R`Elle est inversible`
      ],
      answer: 0,
      explain: R`Les valeurs propres d'une matrice triangulaire sont ses coefficients diagonaux : ici $2$, $3$ et $5$. Attention, une matrice triangulaire n'est pas toujours diagonalisable, et $A$ n'est pas symétrique.`
    },
    {
      id: 'l3-q6', lesson: 'l3', notion: 'n-exemples-diag', type: 'tf', tag: 'cadre',
      prompt: R`Toute matrice symétrique à coefficients complexes est diagonalisable.`,
      answer: false,
      explain: R`Le théorème spectral concerne les matrices symétriques **réelles**. La matrice $\begin{pmatrix}1&i\\i&-1\end{pmatrix}$ est symétrique, non nulle et de carré nul : elle est nilpotente, donc non diagonalisable.`
    },
    {
      id: 'l3-q7', lesson: 'l3', notion: 'n-diagonalisable', type: 'mcq', tag: 'application',
      prompt: R`Soit $A = \begin{pmatrix}3&1&0\\0&3&0\\0&0&3\end{pmatrix}$. Quelle est la dimension du sous-espace propre $E_3(A)$ ?`,
      options: [R`$2$`, R`$1$`, R`$3$`, R`$0$`],
      answer: 0,
      explain: R`$A - 3I_3$ a un seul coefficient non nul : elle est de rang 1, donc son noyau est de dimension 2. Comme $m(3) = 3$, la matrice n'est pas diagonalisable.`
    },
    {
      id: 'l3-q8', lesson: 'l3', notion: 'n-exemples-diag', type: 'mcq', tag: 'application',
      prompt: R`Soit $p$ un projecteur de $E$, c'est-à-dire $p \circ p = p$. Que peut-on affirmer ?`,
      options: [
        R`$p$ est diagonalisable et $\operatorname{Sp}(p) \subset \{0, 1\}$`,
        R`$p$ est diagonalisable seulement s'il est de rang 1`,
        R`$p$ n'est pas diagonalisable en général`,
        R`$p$ est diagonalisable et $\operatorname{Sp}(p) = \{0, 1\}$ dans tous les cas`
      ],
      answer: 0,
      explain: R`$E = \operatorname{Ker}(p) \oplus \operatorname{Ker}(p - \mathrm{Id}_E)$. L'inclusion du spectre peut être stricte : pour $p = \mathrm{Id}_E$ le spectre est $\{1\}$, pour $p = 0$ c'est $\{0\}$.`
    },
    {
      id: 'l3-q9', lesson: 'l3', notion: 'n-diagonalisable', type: 'card', tag: 'restitution',
      prompt: R`Donnez la définition d'un endomorphisme diagonalisable et trois caractérisations équivalentes.`,
      back: R`**Définition.** Il existe une base de $E$ formée de vecteurs propres de $u$.
**Caractérisations.**
(1) $E = \bigoplus_{\lambda} E_\lambda(u)$.
(2) $\sum_{\lambda} \dim E_\lambda(u) = n$.
(3) $\chi_u$ est scindé sur $\mathbb{K}$ et $\dim E_\lambda(u) = m(\lambda)$ pour toute valeur propre.
(4) $u$ admet un polynôme annulateur scindé à racines simples (leçon suivante).`,
      explain: R`Point de vigilance : dans (3), n'oubliez pas « scindé sur $\mathbb{K}$ ».`
    },

    /* ---------------- Leçon 4 ---------------- */
    {
      id: 'l4-q1', lesson: 'l4', notion: 'n-lemme-noyaux', type: 'multi', tag: 'hypotheses',
      prompt: R`Le lemme des noyaux affirme que $\operatorname{Ker}(P_1 P_2)(u) = \operatorname{Ker} P_1(u) \oplus \operatorname{Ker} P_2(u)$. Cochez les hypothèses dont l'énoncé a besoin.`,
      options: [
        R`$P_1$ et $P_2$ sont premiers entre eux`,
        R`$P_1 P_2$ est un polynôme annulateur de $u$`,
        R`$P_1$ et $P_2$ sont scindés`,
        R`$E$ est de dimension finie`
      ],
      answers: [0],
      explain: R`Une seule hypothèse : $P_1$ et $P_2$ premiers entre eux. Le lemme vaut en toute dimension et pour des polynômes quelconques. Quand de plus $P_1 P_2$ annule $u$, il donne une décomposition de $E$ tout entier.`
    },
    {
      id: 'l4-q2', lesson: 'l4', notion: 'n-lemme-noyaux', type: 'order', tag: 'demo',
      prompt: R`Remettez dans l'ordre la démonstration du lemme des noyaux pour deux polynômes $P_1$ et $P_2$ premiers entre eux.`,
      steps: [
        R`On commence par le théorème de Bézout : il existe $A, B \in \mathbb{K}[X]$ tels que $A P_1 + B P_2 = 1$.`,
        R`En évaluant cette relation en $u$, on obtient $\mathrm{Id}_E = A(u) \circ P_1(u) + B(u) \circ P_2(u)$, notée $(\ast)$.`,
        R`Somme directe d'abord : si $x \in \operatorname{Ker} P_1(u) \cap \operatorname{Ker} P_2(u)$, alors $(\ast)$ appliquée à $x$ donne $x = 0$.`,
        R`Inclusion $\supset$ ensuite : si $x \in \operatorname{Ker} P_1(u)$, alors $(P_1 P_2)(u)(x) = P_2(u)\big(P_1(u)(x)\big) = 0$ ; de même pour $\operatorname{Ker} P_2(u)$.`,
        R`Inclusion $\subset$ enfin : soit $x \in \operatorname{Ker}(P_1 P_2)(u)$. On pose $y = (B P_2)(u)(x)$ et $z = (A P_1)(u)(x)$ ; d'après $(\ast)$, $x = y + z$.`,
        R`Il reste à vérifier que $P_1(u)(y) = B(u)\big((P_1 P_2)(u)(x)\big) = 0$ et de même $P_2(u)(z) = 0$ : ainsi $y \in \operatorname{Ker} P_1(u)$ et $z \in \operatorname{Ker} P_2(u)$.`
      ],
      explain: R`Tout repose sur la relation de Bézout évaluée en $u$. Elle montre aussi que les projections $x \mapsto y$ et $x \mapsto z$ sont des polynômes en $u$. On utilise partout que deux polynômes en $u$ commutent.`
    },
    {
      id: 'l4-q3', lesson: 'l4', notion: 'n-vp-annulateur', type: 'tf', tag: 'piege',
      prompt: R`Si $P$ est un polynôme annulateur de $u$, alors toute racine de $P$ est valeur propre de $u$.`,
      answer: false,
      explain: R`$X(X - 1)$ annule $\mathrm{Id}_E$, mais $0$ n'est pas valeur propre de $\mathrm{Id}_E$. C'est le sens inverse qui est vrai. Seul le polynôme **minimal** a pour racines exactement les valeurs propres.`
    },
    {
      id: 'l4-q4', lesson: 'l4', notion: 'n-vp-annulateur', type: 'tf', tag: 'restitution',
      prompt: R`Si $P$ est un polynôme annulateur de $u$, alors toute valeur propre de $u$ est racine de $P$.`,
      answer: true,
      explain: R`Si $u(x) = \lambda x$ avec $x \neq 0$, alors $0 = P(u)(x) = P(\lambda)\,x$, donc $P(\lambda) = 0$.`
    },
    {
      id: 'l4-q5', lesson: 'l4', notion: 'n-critere-annulateur', type: 'mcq', tag: 'application',
      prompt: R`Soit $A \in \mathcal{M}_n(\mathbb{R})$ telle que $A^3 = A$. Que peut-on affirmer ?`,
      options: [
        R`$A$ est diagonalisable sur $\mathbb{R}$ et $\operatorname{Sp}(A) \subset \{-1, 0, 1\}$`,
        R`$A$ est un projecteur`,
        R`$A$ est inversible`,
        R`$A$ est diagonalisable sur $\mathbb{C}$, mais pas nécessairement sur $\mathbb{R}$`
      ],
      answer: 0,
      explain: R`$X^3 - X = X(X-1)(X+1)$ est annulateur, scindé sur $\mathbb{R}$ et à racines simples. Les valeurs propres sont parmi ses racines. $A = 0$ montre que $A$ n'est pas forcément inversible, et $A = -I_n$ qu'elle n'est pas forcément un projecteur.`
    },
    {
      id: 'l4-q6', lesson: 'l4', notion: 'n-critere-annulateur', type: 'mcq', tag: 'cadre',
      prompt: R`Soit $A \in \mathcal{M}_n(\mathbb{R})$ telle que $A^2 = -I_n$. Que peut-on affirmer ?`,
      options: [
        R`$A$ n'est pas diagonalisable sur $\mathbb{R}$, mais elle l'est sur $\mathbb{C}$`,
        R`$A$ est diagonalisable sur $\mathbb{R}$, car $X^2 + 1$ est à racines simples`,
        R`$A$ n'est diagonalisable ni sur $\mathbb{R}$ ni sur $\mathbb{C}$`,
        R`$A$ est nilpotente`
      ],
      answer: 0,
      explain: R`$X^2 + 1 = (X - i)(X + i)$ est scindé à racines simples sur $\mathbb{C}$ : $A$ est diagonalisable sur $\mathbb{C}$. Sur $\mathbb{R}$, toute valeur propre serait racine réelle de $X^2 + 1$ : il n'y en a aucune, donc $A$ n'est pas diagonalisable sur $\mathbb{R}$.`
    },
    {
      id: 'l4-q7', lesson: 'l4', notion: 'n-critere-annulateur', type: 'tf', tag: 'piege',
      prompt: R`Si $u$ admet un polynôme annulateur scindé sur $\mathbb{K}$, alors $u$ est diagonalisable.`,
      answer: false,
      explain: R`Il manque « à racines simples ». Un endomorphisme nilpotent non nul est annulé par $X^p$, qui est scindé, sans être diagonalisable. Un annulateur scindé donne seulement la trigonalisabilité.`
    },
    {
      id: 'l4-q8', lesson: 'l4', notion: 'n-poly-minimal', type: 'mcq', tag: 'application',
      prompt: R`Quel est le polynôme minimal de $A = ${JOR}$ ?`,
      options: [R`$(X - 1)^2$`, R`$X - 1$`, R`$X^2 - 1$`, R`$X(X - 1)$`],
      answer: 0,
      explain: R`$\pi_A$ divise $\chi_A = (X-1)^2$ et a pour racine $1$. Ce n'est pas $X - 1$ puisque $A \neq I_2$. Donc $\pi_A = (X-1)^2$, ce qui confirme que $A$ n'est pas diagonalisable.`
    },
    {
      id: 'l4-q9', lesson: 'l4', notion: 'n-critere-annulateur', type: 'mcq', tag: 'application',
      prompt: R`Soient $u$ diagonalisable et $F$ un sous-espace stable par $u$. Que dire de l'endomorphisme induit $u_F$ ?`,
      options: [
        R`Il est diagonalisable, car $\pi_u$, scindé à racines simples, annule aussi $u_F$`,
        R`Il n'est pas forcément diagonalisable`,
        R`Il est diagonalisable seulement si $F$ est un sous-espace propre de $u$`,
        R`Il est diagonalisable seulement si $F$ admet un supplémentaire stable`
      ],
      answer: 0,
      explain: R`Tout polynôme annulateur de $u$ annule $u_F$. Le jury de l'agrégation attend cette justification dans la leçon sur les endomorphismes diagonalisables.`
    },
    {
      id: 'l4-q10', lesson: 'l4', notion: 'n-poly-minimal', type: 'tf', tag: 'cadre',
      prompt: R`Tout endomorphisme d'un $\mathbb{K}$-espace vectoriel, de dimension finie ou non, admet un polynôme annulateur non nul.`,
      answer: false,
      explain: R`En dimension infinie, c'est faux. Pour la dérivation $D$ sur $\mathbb{K}[X]$ : si $P = \sum a_k X^k \neq 0$ et si $m$ est le plus petit indice tel que $a_m \neq 0$, alors $P(D)(X^m) = m!\,a_m \neq 0$.`
    },
    {
      id: 'l4-q11', lesson: 'l4', notion: 'n-critere-annulateur', type: 'card', tag: 'restitution',
      prompt: R`Énoncez le critère de diagonalisabilité par les polynômes annulateurs, puis donnez un contre-exemple pour chacune des deux hypothèses.`,
      back: R`**Critère.** $u$ est diagonalisable si et seulement s'il admet un polynôme annulateur scindé sur $\mathbb{K}$ à racines simples, si et seulement si $\pi_u$ est scindé sur $\mathbb{K}$ à racines simples.
**Sans « racines simples ».** Un nilpotent d'indice 2 est annulé par $X^2$ et n'est pas diagonalisable.
**Sans « scindé sur $\mathbb{K}$ ».** $${ROT}$ est annulée par $X^2 + 1$ et n'est pas diagonalisable sur $\mathbb{R}$.`,
      explain: R`Un seul polynôme annulateur scindé à racines simples suffit : inutile de calculer $\pi_u$.`
    },

    /* ---------------- Leçon 5 ---------------- */
    {
      id: 'l5-q1', lesson: 'l5', notion: 'n-trigonalisable', type: 'mcq', tag: 'hypotheses',
      prompt: R`$u$ est trigonalisable si et seulement si…`,
      options: [
        R`$\chi_u$ est scindé sur $\mathbb{K}$`,
        R`$\chi_u$ est scindé sur $\mathbb{K}$ à racines simples`,
        R`$u$ est inversible`,
        R`$\pi_u$ est à racines simples`
      ],
      answer: 0,
      explain: R`« Scindé » caractérise la trigonalisabilité. « Scindé à racines simples » pour $\chi_u$ est une condition suffisante de diagonalisabilité.`
    },
    {
      id: 'l5-q2', lesson: 'l5', notion: 'n-trigonalisable', type: 'tf', tag: 'cadre',
      prompt: R`Toute matrice de $\mathcal{M}_n(\mathbb{C})$ est trigonalisable.`,
      answer: true,
      explain: R`D'après le théorème de d'Alembert-Gauss, tout polynôme non constant est scindé sur $\mathbb{C}$ ; c'est donc le cas de $\chi_A$.`
    },
    {
      id: 'l5-q3', lesson: 'l5', notion: 'n-trigonalisable', type: 'tf', tag: 'piege',
      prompt: R`Pour $A \in \mathcal{M}_n(\mathbb{R})$, la trace de $A$ est la somme de ses valeurs propres réelles, comptées avec multiplicité.`,
      answer: false,
      explain: R`C'est vrai seulement si $\chi_A$ est scindé sur $\mathbb{R}$. En général, il faut prendre les valeurs propres **complexes**. La matrice $${ROT}$ a pour trace $0 = i + (-i)$ et aucune valeur propre réelle ; plus parlant, une rotation d'angle $\theta \notin \pi\mathbb{Z}$ a pour trace $2\cos\theta$ sans valeur propre réelle.`
    },
    {
      id: 'l5-q4', lesson: 'l5', notion: 'n-trigonalisable', type: 'mcq', tag: 'application',
      prompt: R`Soit $A \in \mathcal{M}_3(\mathbb{C})$ de polynôme caractéristique $(X-1)^2 (X-2)$. Que valent $\det(A)$ et $\operatorname{tr}(A)$ ?`,
      options: [
        R`$\det(A) = 2$ et $\operatorname{tr}(A) = 4$`,
        R`$\det(A) = 2$ et $\operatorname{tr}(A) = 3$`,
        R`$\det(A) = 3$ et $\operatorname{tr}(A) = 4$`,
        R`Cela dépend de la diagonalisabilité de $A$`
      ],
      answer: 0,
      explain: R`Les valeurs propres comptées avec multiplicité sont $1, 1, 2$ : produit $2$, somme $4$. Le résultat ne dépend pas de la diagonalisabilité, seulement de $\chi_A$.`
    },
    {
      id: 'l5-q5', lesson: 'l5', notion: 'n-nilpotent', type: 'multi', tag: 'hypotheses',
      prompt: R`Soit $u \in \mathcal{L}(E)$ avec $\dim E = n$ et $\mathbb{K} = \mathbb{R}$. Cochez toutes les conditions **équivalentes** à « $u$ est nilpotent ».`,
      options: [
        R`$\chi_u = X^n$`,
        R`$u^n = 0$`,
        R`$u$ est trigonalisable et sa seule valeur propre est $0$`,
        R`$\operatorname{Sp}_{\mathbb{R}}(u) = \{0\}$`,
        R`$u$ n'est pas inversible`
      ],
      answers: [0, 1, 2],
      explain: R`Sur $\mathbb{R}$, « seule valeur propre réelle $0$ » ne suffit pas : $\begin{pmatrix}0&0&0\\0&0&-1\\0&1&0\end{pmatrix}$ a pour polynôme caractéristique $X(X^2+1)$. Et « non inversible » signifie seulement que $0$ est valeur propre.`
    },
    {
      id: 'l5-q6', lesson: 'l5', notion: 'n-nilpotent', type: 'tf', tag: 'application',
      prompt: R`Un endomorphisme à la fois nilpotent et diagonalisable est nul.`,
      answer: true,
      explain: R`Sa seule valeur propre est $0$ ; étant diagonalisable, sa matrice dans une base de vecteurs propres est la matrice nulle.`
    },
    {
      id: 'l5-q7', lesson: 'l5', notion: 'n-nilpotent', type: 'mcq', tag: 'application',
      prompt: R`Quel est l'indice de nilpotence de $N = \begin{pmatrix}0&1&0\\0&0&1\\0&0&0\end{pmatrix}$ ?`,
      options: [R`$3$`, R`$2$`, R`$1$`, R`$N$ n'est pas nilpotente`],
      answer: 0,
      explain: R`$N^2 = \begin{pmatrix}0&0&1\\0&0&0\\0&0&0\end{pmatrix} \neq 0$ et $N^3 = 0$. C'est le cas d'indice maximal $n = 3$.`
    },
    {
      id: 'l5-q8', lesson: 'l5', notion: 'n-nilpotent', type: 'tf', tag: 'restitution',
      prompt: R`Si $u$ est nilpotent d'indice $p$ sur un espace de dimension $n$, alors $p \leq n$.`,
      answer: true,
      explain: R`$\chi_u = X^n$, donc $u^n = 0$ par Cayley-Hamilton. Autre preuve classique : si $u^{p-1}(x) \neq 0$, la famille $(x, u(x), \dots, u^{p-1}(x))$ est libre.`
    },
    {
      id: 'l5-q9', lesson: 'l5', notion: 'n-dunford', type: 'mcq', tag: 'piege',
      prompt: R`(Niveau agrégation) Quelle est la décomposition de Dunford $A = D + N$ de $A = \begin{pmatrix}1&1\\0&2\end{pmatrix}$ ?`,
      options: [
        R`$D = A$ et $N = 0$, car $A$ est diagonalisable`,
        R`$D = \begin{pmatrix}1&0\\0&2\end{pmatrix}$ et $N = \begin{pmatrix}0&1\\0&0\end{pmatrix}$`,
        R`Elle n'existe pas, car $A$ n'est pas diagonale`,
        R`$D = I_2$ et $N = \begin{pmatrix}0&1\\0&1\end{pmatrix}$`
      ],
      answer: 0,
      explain: R`$A$ a deux valeurs propres distinctes, donc elle est diagonalisable : par unicité, $D = A$ et $N = 0$. Le découpage « diagonale + reste » est un piège classique : ses deux termes ne commutent pas.`
    },
    {
      id: 'l5-q10', lesson: 'l5', notion: 'n-dunford', type: 'card', tag: 'restitution',
      prompt: R`(Niveau agrégation) Énoncez la décomposition de Dunford et expliquez pourquoi $d$ et $\nu$ sont des polynômes en $u$.`,
      back: R`**Énoncé.** Si $\chi_u$ est scindé sur $\mathbb{K}$, il existe un unique couple $(d, \nu)$ avec $u = d + \nu$, $d$ diagonalisable, $\nu$ nilpotent et $d \circ \nu = \nu \circ d$.
**Polynômes en $u$.** Avec $\chi_u = \prod (X - \lambda_i)^{m_i}$, le lemme des noyaux donne $E = \bigoplus \operatorname{Ker}(u - \lambda_i \mathrm{Id}_E)^{m_i}$, et les projecteurs $p_i$ associés sont des polynômes en $u$. Alors $d = \sum \lambda_i p_i$ et $\nu = u - d$ le sont aussi.`,
      explain: R`Hors programme en MP. À l'agrégation, le jury insiste sur le fait que les composantes sont des polynômes en $u$.`
    }
  ]
};
