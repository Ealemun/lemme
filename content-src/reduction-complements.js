/*
 * Lemme — compléments des fiches du chapitre « Réduction des endomorphismes ».
 *
 * Pour chaque notion (repérée par son identifiant défini dans reduction.js) :
 *   examples : exemples positifs (les contre-exemples restent dans reduction.js)
 *   prereqs  : identifiants des notions à maîtriser avant celle-ci
 *              (notions du chapitre ou de la leçon de prérequis)
 *   proof    : démonstration complète, une étape par élément du tableau.
 *              Absente quand la démonstration n'est pas exigible ou sans objet.
 *
 * Exigence de rédaction des démonstrations : chaque objet est introduit avant
 * d'être utilisé, chaque hypothèse est citée à l'endroit où elle sert, et les
 * résultats antérieurs invoqués sont nommés.
 */
const R = String.raw;

module.exports = {
  /* ---------------- Leçon 1 ---------------- */
  'n-elements-propres': {
    prereqs: ['p-sev', 'p-rang'],
    examples: [
      R`Pour $A = \begin{pmatrix}2&0\\0&3\end{pmatrix}$ : $e_1 = (1,0)$ est vecteur propre associé à $2$, $e_2 = (0,1)$ est vecteur propre associé à $3$, et $\operatorname{Sp}(A) = \{2, 3\}$.`,
      R`Pour une homothétie $\lambda\,\mathrm{Id}_E$ : tout vecteur non nul est vecteur propre, et le spectre est $\{\lambda\}$.`,
      R`Pour la projection $p$ sur $F$ parallèlement à $G$ (avec $F$ et $G$ non réduits à $\{0\}$) : $E_1(p) = F$ et $E_0(p) = G$.`
    ]
  },
  'n-somme-directe': {
    prereqs: ['p-recurrence', 'p-sev', 'n-elements-propres'],
    examples: [
      R`Pour $A = \begin{pmatrix}1&1\\0&2\end{pmatrix}$ : $(1,0)$ et $(1,1)$ sont vecteurs propres associés à $1$ et $2$. Ils forment une famille libre, donc une base de $\mathbb{K}^2$.`
    ],
    proof: [
      R`Pour $p \geq 1$, on note $\mathcal{P}(p)$ : « pour toutes valeurs propres $\lambda_1, \dots, \lambda_p$ de $u$ deux à deux distinctes et tous $x_1 \in E_{\lambda_1}(u), \dots, x_p \in E_{\lambda_p}(u)$, si $x_1 + \dots + x_p = 0$ alors $x_1 = \dots = x_p = 0$ ». C'est la définition d'une somme directe.`,
      R`**Initialisation.** $\mathcal{P}(1)$ est vraie : la relation se réduit à $x_1 = 0$.`,
      R`**Hérédité.** Soit $p \geq 2$ tel que $\mathcal{P}(p-1)$ soit vraie. Soient $\lambda_1, \dots, \lambda_p$ des valeurs propres deux à deux distinctes et $x_i \in E_{\lambda_i}(u)$ tels que $x_1 + \dots + x_p = 0$ $(1)$.`,
      R`En appliquant $u$, linéaire, à $(1)$ et en utilisant $u(x_i) = \lambda_i x_i$ : $\lambda_1 x_1 + \dots + \lambda_p x_p = 0$ $(2)$.`,
      R`La combinaison $(2) - \lambda_p \cdot (1)$ donne $\sum_{i=1}^{p-1} (\lambda_i - \lambda_p)\, x_i = 0$.`,
      R`Pour $i \leq p-1$, le vecteur $(\lambda_i - \lambda_p)\, x_i$ appartient à $E_{\lambda_i}(u)$, qui est un sous-espace vectoriel. D'après $\mathcal{P}(p-1)$, appliquée à $\lambda_1, \dots, \lambda_{p-1}$, on a donc $(\lambda_i - \lambda_p)\, x_i = 0$ pour tout $i \leq p-1$.`,
      R`Comme $\lambda_i \neq \lambda_p$, on en déduit $x_i = 0$ pour tout $i \leq p-1$. En reportant dans $(1)$ : $x_p = 0$. Donc $\mathcal{P}(p)$ est vraie, ce qui achève la récurrence.`,
      R`**Corollaires.** Si $x_1, \dots, x_p$ sont des vecteurs propres associés à des valeurs propres deux à deux distinctes et si $\sum a_i x_i = 0$, alors $a_i x_i = 0$ pour tout $i$ (somme directe), donc $a_i = 0$ puisque $x_i \neq 0$ : la famille est libre. Une famille libre de $E$ a au plus $n$ vecteurs, donc $u$ a au plus $n$ valeurs propres.`
    ]
  },
  'n-commutation': {
    prereqs: ['p-sev', 'n-elements-propres'],
    examples: [
      R`Tout polynôme en $u$ commute avec $u$ : les sous-espaces propres de $u$ sont donc stables par $P(u)$ pour tout $P \in \mathbb{K}[X]$.`
    ],
    proof: [
      R`Soient $\lambda$ une valeur propre de $u$ et $x \in E_\lambda(u)$, c'est-à-dire $u(x) = \lambda x$.`,
      R`Alors $u(v(x)) = v(u(x)) = v(\lambda x) = \lambda\, v(x)$, en utilisant $u \circ v = v \circ u$ puis la linéarité de $v$. Donc $v(x) \in E_\lambda(u)$ : le sous-espace $E_\lambda(u)$ est stable par $v$.`,
      R`**Noyau.** Si $x \in \operatorname{Ker} u$, alors $u(v(x)) = v(u(x)) = v(0) = 0$, donc $v(x) \in \operatorname{Ker} u$.`,
      R`**Image.** Si $y \in \operatorname{Im} u$, il existe $x \in E$ tel que $y = u(x)$ ; alors $v(y) = v(u(x)) = u(v(x)) \in \operatorname{Im} u$.`
    ]
  },

  /* ---------------- Leçon 2 ---------------- */
  'n-poly-car': {
    prereqs: ['p-determinant', 'p-polynomes'],
    examples: [
      R`Pour $A = \begin{pmatrix}1&2\\3&4\end{pmatrix}$ : $\operatorname{tr}(A) = 5$ et $\det(A) = -2$, donc $\chi_A = X^2 - 5X - 2$.`,
      R`Pour une matrice triangulaire de coefficients diagonaux $a_1, \dots, a_n$ : $\chi_A = \prod_{i=1}^{n} (X - a_i)$.`
    ]
  },
  'n-multiplicites': {
    prereqs: ['p-polynomes', 'p-determinant', 'n-poly-car'],
    examples: [
      R`Pour $A = \begin{pmatrix}1&0&0\\0&1&0\\0&0&2\end{pmatrix}$ : $m(1) = 2 = \dim E_1(A)$ et $m(2) = 1 = \dim E_2(A)$.`
    ],
    proof: [
      R`**Racines.** Soit $\lambda \in \mathbb{K}$. Comme $E$ est de dimension finie, $\lambda$ est valeur propre de $u$ si et seulement si $\lambda\,\mathrm{Id}_E - u$ n'est pas injectif, si et seulement s'il n'est pas inversible, si et seulement si $\det(\lambda\,\mathrm{Id}_E - u) = 0$, c'est-à-dire $\chi_u(\lambda) = 0$.`,
      R`**Minoration.** Si $\lambda$ est valeur propre, $E_\lambda(u) \neq \{0\}$, donc $d = \dim E_\lambda(u) \geq 1$.`,
      R`**Majoration.** On choisit une base $(e_1, \dots, e_d)$ de $E_\lambda(u)$, complétée en une base $\mathcal{B}$ de $E$. Comme $u(e_i) = \lambda e_i$ pour $i \leq d$, la matrice de $u$ dans $\mathcal{B}$ est triangulaire par blocs : $$M = \begin{pmatrix} \lambda I_d & B \\ 0 & C \end{pmatrix}, \quad C \in \mathcal{M}_{n-d}(\mathbb{K}).$$`,
      R`Le déterminant d'une matrice triangulaire par blocs est le produit des déterminants des blocs diagonaux : $\chi_u = \det(X I_n - M) = (X - \lambda)^d\, \chi_C$.`,
      R`Ainsi $(X - \lambda)^d$ divise $\chi_u$, donc $d \leq m(\lambda)$ par définition de la multiplicité.`
    ]
  },
  'n-cayley-hamilton': {
    prereqs: ['n-poly-car'],
    examples: [
      R`Pour $A = \begin{pmatrix}1&2\\3&4\end{pmatrix}$ : $\chi_A = X^2 - 5X - 2$, donc $A^2 - 5A - 2I_2 = 0$. On en tire $A(A - 5I_2) = 2I_2$, soit $A^{-1} = \tfrac{1}{2}(A - 5I_2)$.`
    ]
  },

  /* ---------------- Leçon 3 ---------------- */
  'n-diagonalisable': {
    prereqs: ['n-somme-directe', 'n-multiplicites'],
    examples: [
      R`Pour $A = \begin{pmatrix}1&1\\0&2\end{pmatrix}$ et $P = \begin{pmatrix}1&1\\0&1\end{pmatrix}$ (colonnes : vecteurs propres associés à $1$ et $2$) : $P^{-1} A P = \begin{pmatrix}1&0\\0&2\end{pmatrix}$.`
    ],
    proof: [
      R`On note $F = \sum_{\lambda \in \operatorname{Sp}(u)} E_\lambda(u)$. Cette somme est directe (théorème de la leçon 1), donc $\dim F = \sum_\lambda \dim E_\lambda(u)$.`,
      R`**(i) $\Rightarrow$ (ii).** Si $E$ possède une base de vecteurs propres, chaque vecteur de cette base appartient à un sous-espace propre, donc à $F$. Ainsi $F = E$, et la somme est directe.`,
      R`**(ii) $\Rightarrow$ (i).** En réunissant des bases des $E_\lambda(u)$, on obtient une base de $E$ adaptée à la somme directe ; elle est formée de vecteurs propres.`,
      R`**(ii) $\Leftrightarrow$ (iii).** $F$ est un sous-espace de $E$, donc $F = E$ si et seulement si $\dim F = n$, c'est-à-dire $\sum_\lambda \dim E_\lambda(u) = n$.`,
      R`**(i) $\Rightarrow$ (iv).** Dans une base de vecteurs propres, la matrice de $u$ est diagonale et chaque valeur propre $\lambda$ y figure exactement $\dim E_\lambda(u)$ fois. Donc $\chi_u = \prod_\lambda (X - \lambda)^{\dim E_\lambda(u)}$ : il est scindé sur $\mathbb{K}$ et $m(\lambda) = \dim E_\lambda(u)$.`,
      R`**(iv) $\Rightarrow$ (iii).** $\chi_u$ est scindé et de degré $n$, donc la somme des multiplicités de ses racines vaut $n$ : $\sum_\lambda \dim E_\lambda(u) = \sum_\lambda m(\lambda) = n$.`
    ]
  },
  'n-vp-distinctes': {
    prereqs: ['n-somme-directe', 'n-diagonalisable'],
    examples: [
      R`$\begin{pmatrix}0&1\\1&0\end{pmatrix}$ a pour polynôme caractéristique $X^2 - 1$ : deux valeurs propres distinctes $1$ et $-1$ en dimension 2, donc elle est diagonalisable.`
    ],
    proof: [
      R`Soient $\lambda_1, \dots, \lambda_n$ les valeurs propres, deux à deux distinctes, et pour chaque $i$ un vecteur propre $x_i$ associé à $\lambda_i$.`,
      R`La famille $(x_1, \dots, x_n)$ est libre (corollaire du théorème sur la somme directe des sous-espaces propres). Elle compte $n = \dim E$ vecteurs : c'est une base de $E$, formée de vecteurs propres. Donc $u$ est diagonalisable.`,
      R`Enfin $\dim E_{\lambda_i}(u) \geq 1$ pour tout $i$ et $\sum_i \dim E_{\lambda_i}(u) \leq n$ (somme directe dans $E$) : chaque dimension vaut exactement $1$.`
    ]
  },
  'n-exemples-diag': {
    prereqs: ['n-diagonalisable'],
    examples: [
      R`La symétrie $s : (x, y) \mapsto (y, x)$ de $\mathbb{R}^2$ : $E_1(s) = \operatorname{Vect}((1,1))$ et $E_{-1}(s) = \operatorname{Vect}((1,-1))$.`,
      R`$\begin{pmatrix}1&2\\2&1\end{pmatrix}$ est symétrique réelle, donc diagonalisable sur $\mathbb{R}$ ; ses valeurs propres sont $3$ et $-1$.`
    ]
  },

  /* ---------------- Leçon 4 ---------------- */
  'n-poly-minimal': {
    prereqs: ['p-polynomes', 'p-sev'],
    examples: [
      R`Pour un projecteur $p$ distinct de $0$ et de $\mathrm{Id}_E$ : $\pi_p = X^2 - X$.`,
      R`Pour un endomorphisme nilpotent d'indice $p$ : $\pi_u = X^p$.`
    ],
    proof: [
      R`**Existence d'un annulateur non nul.** $\mathcal{L}(E)$ est de dimension $n^2$, donc la famille $(\mathrm{Id}_E, u, u^2, \dots, u^{n^2})$, qui compte $n^2 + 1$ éléments, est liée : il existe $a_0, \dots, a_{n^2}$ non tous nuls tels que $\sum_k a_k u^k = 0$. Le polynôme $\sum_k a_k X^k$ est non nul et annule $u$.`,
      R`**Polynôme minimal.** L'ensemble $I$ des polynômes annulateurs est le noyau du morphisme d'algèbres $P \mapsto P(u)$ : c'est un idéal de $\mathbb{K}[X]$, non réduit à $\{0\}$. Tout idéal de $\mathbb{K}[X]$ étant engendré par un seul polynôme, $I$ possède un unique générateur unitaire, noté $\pi_u$. Par définition, $P(u) = 0$ si et seulement si $\pi_u$ divise $P$.`,
      R`**Famille génératrice.** Soit $P \in \mathbb{K}[X]$. La division euclidienne $P = \pi_u Q + R$ avec $\deg R < d$ donne $P(u) = R(u)$, combinaison linéaire de $\mathrm{Id}_E, u, \dots, u^{d-1}$.`,
      R`**Famille libre.** Une relation $\sum_{k < d} a_k u^k = 0$ à coefficients non tous nuls fournirait un polynôme annulateur non nul de degré strictement inférieur à $d$, donc non multiple de $\pi_u$ : contradiction.`
    ]
  },
  'n-vp-annulateur': {
    prereqs: ['n-elements-propres', 'n-poly-minimal', 'p-recurrence'],
    examples: [
      R`Si $A^2 = A$, alors $X^2 - X$ annule $A$, donc $\operatorname{Sp}(A) \subset \{0, 1\}$.`
    ],
    proof: [
      R`Soit $x$ tel que $u(x) = \lambda x$. Montrons par récurrence que $u^k(x) = \lambda^k x$ pour tout $k \in \mathbb{N}$. Pour $k = 0$ : $u^0(x) = x$. Si $u^k(x) = \lambda^k x$, alors $u^{k+1}(x) = u(\lambda^k x) = \lambda^k u(x) = \lambda^{k+1} x$.`,
      R`Pour $P = \sum_k a_k X^k$, la linéarité donne $P(u)(x) = \sum_k a_k u^k(x) = \sum_k a_k \lambda^k x = P(\lambda)\, x$.`,
      R`Si $P(u) = 0$ et si $\lambda$ est valeur propre, on choisit un vecteur propre $x \neq 0$ : $0 = P(u)(x) = P(\lambda)\,x$, donc $P(\lambda) = 0$.`,
      R`**Racines de $\pi_u$.** Par ce qui précède, toute valeur propre est racine de $\pi_u$. Réciproquement, soit $\lambda \in \mathbb{K}$ une racine de $\pi_u$ : $\pi_u = (X - \lambda)\,Q$ avec $Q \neq 0$ et $\deg Q < \deg \pi_u$. Si $\lambda$ n'était pas valeur propre, $u - \lambda\,\mathrm{Id}_E$ serait injectif, donc inversible (dimension finie) ; de $(u - \lambda\,\mathrm{Id}_E) \circ Q(u) = \pi_u(u) = 0$ on tirerait $Q(u) = 0$, ce qui contredit la minimalité du degré de $\pi_u$.`
    ]
  },
  'n-lemme-noyaux': {
    prereqs: ['p-polynomes', 'p-sev', 'p-recurrence'],
    examples: [
      R`Pour un projecteur $p$ : $X^2 - X = X(X - 1)$ annule $p$, et $X$ et $X - 1$ sont premiers entre eux. Donc $E = \operatorname{Ker} p \oplus \operatorname{Ker}(p - \mathrm{Id}_E)$.`,
      R`Si $u^3 = u$ : $X^3 - X = X(X-1)(X+1)$, donc $E = \operatorname{Ker} u \oplus \operatorname{Ker}(u - \mathrm{Id}_E) \oplus \operatorname{Ker}(u + \mathrm{Id}_E)$.`
    ],
    proof: [
      R`**Cas $r = 2$.** Soient $P_1, P_2$ premiers entre eux et $P = P_1 P_2$. D'après le théorème de Bézout, il existe $A, B \in \mathbb{K}[X]$ tels que $A P_1 + B P_2 = 1$. En évaluant en $u$ : $\mathrm{Id}_E = A(u) \circ P_1(u) + B(u) \circ P_2(u)$ $(\ast)$. On rappelle que deux polynômes en $u$ commutent.`,
      R`**Inclusion $\supset$.** Si $x \in \operatorname{Ker} P_1(u)$, alors $P(u)(x) = P_2(u)\big(P_1(u)(x)\big) = 0$. De même pour $\operatorname{Ker} P_2(u)$. Donc $\operatorname{Ker} P_1(u) + \operatorname{Ker} P_2(u) \subset \operatorname{Ker} P(u)$.`,
      R`**Somme directe.** Si $x \in \operatorname{Ker} P_1(u) \cap \operatorname{Ker} P_2(u)$, alors $(\ast)$ appliquée à $x$ donne $x = A(u)\big(P_1(u)(x)\big) + B(u)\big(P_2(u)(x)\big) = 0$.`,
      R`**Inclusion $\subset$.** Soit $x \in \operatorname{Ker} P(u)$. On pose $y = (B P_2)(u)(x)$ et $z = (A P_1)(u)(x)$. D'après $(\ast)$, $x = y + z$. De plus $P_1(u)(y) = B(u)\big(P(u)(x)\big) = 0$ et $P_2(u)(z) = A(u)\big(P(u)(x)\big) = 0$. Donc $y \in \operatorname{Ker} P_1(u)$ et $z \in \operatorname{Ker} P_2(u)$.`,
      R`**Cas général.** Par récurrence sur $r \geq 2$. Si $P_1, \dots, P_r$ sont deux à deux premiers entre eux, alors $P_1$ est premier avec le produit $P_2 \cdots P_r$. Le cas $r = 2$ donne $\operatorname{Ker} P(u) = \operatorname{Ker} P_1(u) \oplus \operatorname{Ker} (P_2 \cdots P_r)(u)$, et l'hypothèse de récurrence décompose le second terme.`
    ]
  },
  'n-critere-annulateur': {
    prereqs: ['n-lemme-noyaux', 'n-vp-annulateur', 'n-diagonalisable'],
    examples: [
      R`Si $A^3 = A$ : $X^3 - X = X(X-1)(X+1)$ est annulateur, scindé à racines simples. Donc $A$ est diagonalisable (sur $\mathbb{R}$ comme sur $\mathbb{C}$).`,
      R`Si $A \in \mathcal{M}_n(\mathbb{C})$ vérifie $A^p = I_n$ avec $p \geq 1$ : $X^p - 1$ a $p$ racines distinctes dans $\mathbb{C}$, donc $A$ est diagonalisable sur $\mathbb{C}$.`
    ],
    proof: [
      R`**(i) $\Rightarrow$ (iii).** Soient $\lambda_1, \dots, \lambda_r$ les valeurs propres distinctes de $u$, et $P = \prod_{i=1}^{r} (X - \lambda_i)$. Pour $x \in E_{\lambda_i}(u)$, on a $P(u)(x) = 0$ : les facteurs commutent et $(u - \lambda_i \mathrm{Id}_E)(x) = 0$. Comme $u$ est diagonalisable, $E = \bigoplus_i E_{\lambda_i}(u)$, donc $P(u) = 0$ par linéarité. Ainsi $\pi_u$ divise $P$ ; diviseur d'un polynôme scindé à racines simples, il l'est aussi.`,
      R`**(iii) $\Rightarrow$ (ii).** $\pi_u$ est lui-même un polynôme annulateur.`,
      R`**(ii) $\Rightarrow$ (i).** Soit $P = c \prod_{j=1}^{s} (X - \mu_j)$ un annulateur, avec $c \neq 0$ et les $\mu_j$ deux à deux distincts. Les polynômes $X - \mu_j$ sont deux à deux premiers entre eux. Le lemme des noyaux donne $E = \operatorname{Ker} P(u) = \bigoplus_{j} \operatorname{Ker}(u - \mu_j \mathrm{Id}_E)$.`,
      R`Chaque $\operatorname{Ker}(u - \mu_j \mathrm{Id}_E)$ non réduit à $\{0\}$ est un sous-espace propre de $u$. Donc $E$ est somme de sous-espaces propres : $u$ est diagonalisable.`,
      R`**Endomorphisme induit.** Si $F$ est stable par $u$, alors $P(u_F)$ est l'endomorphisme induit par $P(u)$ sur $F$, pour tout polynôme $P$. En particulier $\pi_u(u_F) = 0$ : $u_F$ admet un annulateur scindé à racines simples, donc est diagonalisable.`
    ]
  },

  /* ---------------- Leçon 5 ---------------- */
  'n-trigonalisable': {
    prereqs: ['p-recurrence', 'n-multiplicites', 'p-determinant'],
    examples: [
      R`$A = \begin{pmatrix}2&1\\-1&0\end{pmatrix}$ : $\chi_A = (X-1)^2$ est scindé. Avec $e_1 = (1,-1)$ (vecteur propre) et $e_2 = (1,0)$, on a $A e_2 = e_1 + e_2$ : dans la base $(e_1, e_2)$, la matrice devient $\begin{pmatrix}1&1\\0&1\end{pmatrix}$.`
    ],
    proof: [
      R`**Sens direct.** Si $u$ a une matrice triangulaire $T$ de coefficients diagonaux $t_1, \dots, t_n$, alors $\chi_u = \det(X I_n - T) = \prod_{i} (X - t_i)$ : il est scindé sur $\mathbb{K}$.`,
      R`**Réciproque, forme matricielle.** Pour $n \geq 1$, on note $\mathcal{P}(n)$ : « toute matrice de $\mathcal{M}_n(\mathbb{K})$ dont le polynôme caractéristique est scindé sur $\mathbb{K}$ est semblable à une matrice triangulaire supérieure ». $\mathcal{P}(1)$ est évidente.`,
      R`**Hérédité.** Soit $n \geq 2$ tel que $\mathcal{P}(n-1)$ soit vraie, et $A \in \mathcal{M}_n(\mathbb{K})$ avec $\chi_A$ scindé. Comme $\chi_A$ est scindé de degré $n \geq 1$, il a une racine $\lambda \in \mathbb{K}$, qui est valeur propre de $A$. On choisit un vecteur propre associé et on le complète en une base de $\mathbb{K}^n$ : $A$ est semblable à $$\begin{pmatrix} \lambda & L \\ 0 & A' \end{pmatrix}, \quad A' \in \mathcal{M}_{n-1}(\mathbb{K}).$$`,
      R`Par déterminant triangulaire par blocs, $\chi_A = (X - \lambda)\,\chi_{A'}$. Le quotient d'un polynôme scindé par $X - \lambda$ est scindé, donc $\chi_{A'}$ est scindé. D'après $\mathcal{P}(n-1)$, il existe $Q \in \mathrm{GL}_{n-1}(\mathbb{K})$ et $T'$ triangulaire supérieure telles que $Q^{-1} A' Q = T'$.`,
      R`Avec $R = \begin{pmatrix} 1 & 0 \\ 0 & Q \end{pmatrix}$, inversible, on calcule $R^{-1} \begin{pmatrix} \lambda & L \\ 0 & A' \end{pmatrix} R = \begin{pmatrix} \lambda & LQ \\ 0 & T' \end{pmatrix}$, triangulaire supérieure. Donc $\mathcal{P}(n)$ est vraie.`,
      R`**Trace et déterminant.** Deux matrices semblables ont même trace et même déterminant. Pour $T$ triangulaire, $\operatorname{tr}(T) = \sum t_i$ et $\det(T) = \prod t_i$, où les $t_i$ sont les racines de $\chi_u$ comptées avec multiplicité.`
    ]
  },
  'n-nilpotent': {
    prereqs: ['n-trigonalisable', 'n-cayley-hamilton', 'n-vp-annulateur'],
    examples: [
      R`$N = \begin{pmatrix}0&1\\0&0\end{pmatrix}$ est nilpotente d'indice 2.`,
      R`La dérivation $P \mapsto P'$ sur $\mathbb{K}_{n-1}[X]$, espace de dimension $n$, est nilpotente d'indice $n$.`
    ],
    proof: [
      R`On raisonne sur la matrice $A \in \mathcal{M}_n(\mathbb{K})$ de $u$ dans une base. Comme $\mathbb{K} \subset \mathbb{C}$, on peut voir $A$ dans $\mathcal{M}_n(\mathbb{C})$ ; son polynôme caractéristique est le même.`,
      R`**(i) $\Rightarrow$ (iii).** Supposons $A^p = 0$. Soit $\lambda \in \mathbb{C}$ une valeur propre complexe de $A$ : $X^p$ annule $A$, donc $\lambda^p = 0$, donc $\lambda = 0$. Or $\chi_A$ est scindé sur $\mathbb{C}$ et ses racines sont les valeurs propres complexes de $A$ : étant unitaire de degré $n$, $\chi_A = X^n$.`,
      R`**(iii) $\Rightarrow$ (ii).** $\chi_u = X^n$ est scindé sur $\mathbb{K}$, donc $u$ est trigonalisable ; ses valeurs propres sont les racines de $\chi_u$, donc $0$ seulement.`,
      R`**(ii) $\Rightarrow$ (i).** $u$ a une matrice triangulaire $T$ dont les coefficients diagonaux sont ses valeurs propres, donc tous nuls. Ainsi $\chi_u = X^n$, et le théorème de Cayley-Hamilton donne $u^n = 0$.`,
      R`**Indice.** On vient de voir que $u$ nilpotent entraîne $u^n = 0$ : l'indice de nilpotence est au plus $n$.`,
      R`**Nilpotent et diagonalisable.** Si $u$ est de plus diagonalisable, sa matrice dans une base de vecteurs propres est diagonale, de coefficients diagonaux tous égaux à la seule valeur propre $0$ : $u = 0$.`
    ]
  },
  'n-dunford': {
    prereqs: ['n-lemme-noyaux', 'n-nilpotent', 'n-critere-annulateur'],
    examples: [
      R`$\begin{pmatrix}1&1\\0&1\end{pmatrix} = I_2 + \begin{pmatrix}0&1\\0&0\end{pmatrix}$ : $I_2$ est diagonale, le second terme est nilpotent, et ils commutent. C'est la décomposition de Dunford.`
    ]
  }
};
