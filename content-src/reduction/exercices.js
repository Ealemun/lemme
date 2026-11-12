/*
 * Lemme — exercices d'application du chapitre « Réduction des endomorphismes ».
 *
 * Un exercice est un énoncé suivi de plusieurs étapes ; chaque étape est une
 * question (mêmes types que dans cours.js : mcq, multi, tf).
 * L'énoncé reste affiché au-dessus de chaque étape.
 *
 *   level  : 1 (application directe), 2 (plusieurs notions), 3 (type concours)
 *   notion : notion principale travaillée (sert au suivi de la maîtrise)
 *
 * Dans une leçon, les exercices se débloquent dans l'ordre où ils sont écrits :
 * les ranger par niveau croissant.
 */
const R = String.raw;

module.exports = [
  /* ================= Leçon 1 ================= */
  {
    id: 'ex-l1-a', lesson: 'l1', level: 1, notion: 'n-elements-propres',
    title: 'Éléments propres d\'une matrice 2 × 2',
    statement: R`On considère $A = \begin{pmatrix}4&1\\2&3\end{pmatrix} \in \mathcal{M}_2(\mathbb{R})$.`,
    steps: [
      {
        type: 'mcq', prompt: R`Quel est le polynôme caractéristique de $A$ ?`,
        options: [R`$X^2 - 7X + 10$`, R`$X^2 + 7X + 10$`, R`$X^2 - 7X + 12$`, R`$X^2 - 7X - 10$`], answer: 0,
        explain: R`En dimension 2, $\chi_A = X^2 - \operatorname{tr}(A)\,X + \det(A)$ avec $\operatorname{tr}(A) = 7$ et $\det(A) = 12 - 2 = 10$.`
      },
      {
        type: 'mcq', prompt: R`Quel est le spectre de $A$ ?`,
        options: [R`$\{2, 5\}$`, R`$\{-2, -5\}$`, R`$\{3, 4\}$`, R`$\{1, 10\}$`], answer: 0,
        explain: R`$X^2 - 7X + 10 = (X - 2)(X - 5)$.`
      },
      {
        type: 'mcq', prompt: R`Quel est le sous-espace propre $E_5(A)$ ?`,
        options: [R`$\operatorname{Vect}((1, 1))$`, R`$\operatorname{Vect}((1, -1))$`, R`$\operatorname{Vect}((1, 2))$`, R`$\operatorname{Vect}((2, 1))$`], answer: 0,
        explain: R`$A - 5I_2 = \begin{pmatrix}-1&1\\2&-2\end{pmatrix}$ : le système se réduit à $-x + y = 0$.`
      },
      {
        type: 'mcq', prompt: R`Quel est le sous-espace propre $E_2(A)$ ?`,
        options: [R`$\operatorname{Vect}((1, -2))$`, R`$\operatorname{Vect}((1, 2))$`, R`$\operatorname{Vect}((2, -1))$`, R`$\operatorname{Vect}((1, 1))$`], answer: 0,
        explain: R`$A - 2I_2 = \begin{pmatrix}2&1\\2&1\end{pmatrix}$ : le système se réduit à $2x + y = 0$. Les deux droites propres sont en somme directe et engendrent $\mathbb{R}^2$.`
      }
    ]
  },
  {
    id: 'ex-l1-b', lesson: 'l1', level: 2, notion: 'n-elements-propres',
    title: 'Valeurs propres de u², de l\'inverse',
    statement: R`Soient $u \in \mathcal{L}(E)$, $\lambda \in \mathbb{K}$ et $x \neq 0$ tels que $u(x) = \lambda x$.`,
    steps: [
      {
        type: 'mcq', prompt: R`Que peut-on dire de $x$ vis-à-vis de $u^2 = u \circ u$ ?`,
        options: [
          R`$x$ est vecteur propre de $u^2$ pour la valeur propre $\lambda^2$`,
          R`$x$ est vecteur propre de $u^2$ pour la valeur propre $2\lambda$`,
          R`$x$ est vecteur propre de $u^2$ pour la valeur propre $\lambda$`,
          R`$x$ n'est pas forcément vecteur propre de $u^2$`
        ], answer: 0,
        explain: R`$u^2(x) = u(\lambda x) = \lambda\,u(x) = \lambda^2 x$, et $x \neq 0$.`
      },
      {
        type: 'tf', prompt: R`Si $u$ est inversible, alors $\lambda \neq 0$ et $x$ est vecteur propre de $u^{-1}$ pour la valeur propre $1/\lambda$.`,
        answer: true,
        explain: R`Si $\lambda = 0$, alors $x \in \operatorname{Ker} u$ avec $x \neq 0$, ce qui contredit l'injectivité. Puis, en appliquant $u^{-1}$ à $u(x) = \lambda x$ : $x = \lambda\,u^{-1}(x)$, donc $u^{-1}(x) = \frac{1}{\lambda} x$.`
      },
      {
        type: 'tf', prompt: R`On prend $\mathbb{K} = \mathbb{R}$. Toute valeur propre de $u^2$ est le carré d'une valeur propre de $u$.`,
        answer: false,
        explain: R`Pour $u$ de matrice $\begin{pmatrix}0&-1\\1&0\end{pmatrix}$, on a $u^2 = -\mathrm{Id}_E$ : $-1$ est valeur propre de $u^2$, alors que $u$ n'a aucune valeur propre réelle. Seule l'inclusion $\{\lambda^2 \mid \lambda \in \operatorname{Sp}(u)\} \subset \operatorname{Sp}(u^2)$ est vraie en général.`
      },
      {
        type: 'mcq', prompt: R`On suppose de plus que $u^2 = u$. Quelles sont les valeurs possibles de $\lambda$ ?`,
        options: [R`$\lambda \in \{0, 1\}$`, R`$\lambda = 1$ uniquement`, R`$\lambda \in \{-1, 1\}$`, R`$\lambda$ quelconque`], answer: 0,
        explain: R`$\lambda^2 x = u^2(x) = u(x) = \lambda x$ et $x \neq 0$, donc $\lambda^2 = \lambda$.`
      }
    ]
  },

  /* ================= Leçon 2 ================= */
  {
    id: 'ex-l2-a', lesson: 'l2', level: 1, notion: 'n-multiplicites',
    title: 'Multiplicité et dimension',
    statement: R`On considère $A = \begin{pmatrix}1&2&0\\0&1&0\\0&0&3\end{pmatrix} \in \mathcal{M}_3(\mathbb{R})$.`,
    steps: [
      {
        type: 'mcq', prompt: R`Quel est le polynôme caractéristique de $A$ ?`,
        options: [R`$(X-1)^2 (X-3)$`, R`$(X-1)(X-3)$`, R`$(X-1)(X-2)(X-3)$`, R`$(X-1)(X-3)^2$`], answer: 0,
        explain: R`$A$ est triangulaire supérieure : $\chi_A$ est le produit des $X - a_{ii}$, de degré 3.`
      },
      {
        type: 'mcq', prompt: R`Quelle est la dimension de $E_1(A)$ ?`,
        options: [R`$1$`, R`$2$`, R`$3$`, R`$0$`], answer: 0,
        explain: R`$A - I_3 = \begin{pmatrix}0&2&0\\0&0&0\\0&0&2\end{pmatrix}$ est de rang 2, donc son noyau est de dimension $3 - 2 = 1$ (théorème du rang).`
      },
      {
        type: 'tf', prompt: R`La matrice $A$ est diagonalisable.`,
        answer: false,
        explain: R`$\dim E_1(A) = 1 < 2 = m(1)$ : la somme des dimensions des sous-espaces propres vaut $1 + 1 = 2 < 3$.`
      },
      {
        type: 'mcq', prompt: R`Que valent $\operatorname{tr}(A)$ et $\det(A)$ ?`,
        options: [
          R`$\operatorname{tr}(A) = 5$ et $\det(A) = 3$`,
          R`$\operatorname{tr}(A) = 4$ et $\det(A) = 3$`,
          R`$\operatorname{tr}(A) = 5$ et $\det(A) = 6$`,
          R`$\operatorname{tr}(A) = 7$ et $\det(A) = 3$`
        ], answer: 0,
        explain: R`Somme et produit des racines de $\chi_A$ comptées avec multiplicité : $1 + 1 + 3 = 5$ et $1 \times 1 \times 3 = 3$. On le lit aussi sur la diagonale.`
      }
    ]
  },
  {
    id: 'ex-l2-b', lesson: 'l2', level: 2, notion: 'n-poly-car',
    title: 'Matrice compagnon',
    statement: R`Pour $a, b, c \in \mathbb{R}$, on pose $C = \begin{pmatrix}0&0&-c\\1&0&-b\\0&1&-a\end{pmatrix}$.`,
    steps: [
      {
        type: 'mcq', prompt: R`Quel est le polynôme caractéristique de $C$ ?`,
        options: [R`$X^3 + aX^2 + bX + c$`, R`$X^3 - aX^2 - bX - c$`, R`$X^3 + cX^2 + bX + a$`, R`$(X+a)(X+b)(X+c)$`], answer: 0,
        explain: R`On développe $\det(X I_3 - C) = \begin{vmatrix}X&0&c\\-1&X&b\\0&-1&X+a\end{vmatrix}$ selon la première ligne : $X\big(X(X+a) + b\big) + c \times 1$.`
      },
      {
        type: 'mcq', prompt: R`Pour quel triplet $(a, b, c)$ la matrice $C$ a-t-elle pour polynôme caractéristique $X^3 - 1$ ?`,
        options: [R`$(0, 0, -1)$`, R`$(0, 0, 1)$`, R`$(-1, 0, 0)$`, R`$(1, 1, 1)$`], answer: 0,
        explain: R`Par identification avec $X^3 + aX^2 + bX + c$. Toute famille de coefficients est ainsi réalisée : tout polynôme unitaire est un polynôme caractéristique.`
      },
      {
        type: 'tf', prompt: R`Pour ce triplet, $C$ est diagonalisable sur $\mathbb{R}$.`,
        answer: false,
        explain: R`$X^3 - 1 = (X - 1)(X^2 + X + 1)$ n'est pas scindé sur $\mathbb{R}$ : $C$ n'est même pas trigonalisable sur $\mathbb{R}$.`
      },
      {
        type: 'tf', prompt: R`Pour ce triplet, $C$ est diagonalisable sur $\mathbb{C}$.`,
        answer: true,
        explain: R`Sur $\mathbb{C}$, $X^3 - 1$ a trois racines distinctes $1$, $j$ et $j^2$ : trois valeurs propres distinctes en dimension 3.`
      }
    ]
  },

  /* ================= Leçon 3 ================= */
  {
    id: 'ex-l3-a', lesson: 'l3', level: 1, notion: 'n-diagonalisable',
    title: 'Diagonaliser et calculer une puissance',
    statement: R`On considère $A = \begin{pmatrix}1&2\\2&1\end{pmatrix} \in \mathcal{M}_2(\mathbb{R})$.`,
    steps: [
      {
        type: 'mcq', prompt: R`Quel est le spectre de $A$ ?`,
        options: [R`$\{-1, 3\}$`, R`$\{1, 2\}$`, R`$\{1, -3\}$`, R`$\{1, 3\}$`], answer: 0,
        explain: R`$\chi_A = X^2 - 2X - 3 = (X - 3)(X + 1)$.`
      },
      {
        type: 'mcq', prompt: R`Laquelle de ces matrices $P$ vérifie $P^{-1} A P = \begin{pmatrix}3&0\\0&-1\end{pmatrix}$ ?`,
        options: [
          R`$\begin{pmatrix}1&1\\1&-1\end{pmatrix}$`,
          R`$\begin{pmatrix}1&1\\-1&1\end{pmatrix}$`,
          R`$\begin{pmatrix}1&2\\2&1\end{pmatrix}$`,
          R`$\begin{pmatrix}3&0\\0&-1\end{pmatrix}$`
        ], answer: 0,
        explain: R`Les colonnes de $P$ sont des vecteurs propres, **dans l'ordre** des valeurs propres de la matrice diagonale : $(1,1)$ pour $3$, puis $(1,-1)$ pour $-1$. La deuxième proposition donne $\operatorname{diag}(-1, 3)$.`
      },
      {
        type: 'mcq', prompt: R`Que vaut $A^n$ pour $n \in \mathbb{N}$ ?`,
        options: [
          R`$\dfrac{1}{2}\begin{pmatrix}3^n + (-1)^n & 3^n - (-1)^n\\ 3^n - (-1)^n & 3^n + (-1)^n\end{pmatrix}$`,
          R`$\begin{pmatrix}3^n + (-1)^n & 3^n - (-1)^n\\ 3^n - (-1)^n & 3^n + (-1)^n\end{pmatrix}$`,
          R`$\begin{pmatrix}1 & 2^n\\ 2^n & 1\end{pmatrix}$`,
          R`$\dfrac{1}{2}\begin{pmatrix}3^n - (-1)^n & 3^n + (-1)^n\\ 3^n + (-1)^n & 3^n - (-1)^n\end{pmatrix}$`
        ], answer: 0,
        explain: R`$A^n = P \begin{pmatrix}3^n&0\\0&(-1)^n\end{pmatrix} P^{-1}$ avec $P^{-1} = \frac{1}{2}\begin{pmatrix}1&1\\1&-1\end{pmatrix}$. Vérification pour $n = 0$ et $n = 1$ : on retrouve $I_2$ et $A$.`
      }
    ]
  },
  {
    id: 'ex-l3-b', lesson: 'l3', level: 2, notion: 'n-diagonalisable',
    title: 'Diagonalisabilité selon un paramètre',
    statement: R`Pour $a \in \mathbb{R}$, on pose $M_a = \begin{pmatrix}1&a&0\\0&1&0\\0&0&2\end{pmatrix}$.`,
    steps: [
      {
        type: 'mcq', prompt: R`Quel est le polynôme caractéristique de $M_a$ ?`,
        options: [R`$(X-1)^2 (X-2)$, pour tout $a$`, R`$(X-1)(X-2)$, pour tout $a$`, R`$(X-1)(X-a)(X-2)$`, R`Il dépend de $a$ de façon plus compliquée`], answer: 0,
        explain: R`$M_a$ est triangulaire supérieure : $\chi_{M_a}$ ne dépend que de sa diagonale. Il est scindé, donc tout se joue sur $\dim E_1(M_a)$.`
      },
      {
        type: 'mcq', prompt: R`Quel est le rang de $M_a - I_3$ ?`,
        options: [R`$2$ si $a \neq 0$, et $1$ si $a = 0$`, R`$2$ pour tout $a$`, R`$1$ pour tout $a$`, R`$1$ si $a \neq 0$, et $2$ si $a = 0$`], answer: 0,
        explain: R`$M_a - I_3 = \begin{pmatrix}0&a&0\\0&0&0\\0&0&1\end{pmatrix}$ : les colonnes non nulles sont $(a, 0, 0)$ et $(0, 0, 1)$.`
      },
      {
        type: 'mcq', prompt: R`Pour quelles valeurs de $a$ la matrice $M_a$ est-elle diagonalisable ?`,
        options: [R`Uniquement pour $a = 0$`, R`Pour tout $a$`, R`Pour aucun $a$`, R`Pour tout $a \neq 0$`], answer: 0,
        explain: R`$\dim E_1(M_a) = 3 - \operatorname{rg}(M_a - I_3)$ vaut $m(1) = 2$ si et seulement si $a = 0$, et $\dim E_2(M_a) = 1 = m(2)$ dans tous les cas.`
      }
    ]
  },
  {
    id: 'ex-l3-c', lesson: 'l3', level: 3, notion: 'n-diagonalisable',
    title: 'Matrices de rang 1',
    origin: 'Exercice classique d\'oral',
    statement: R`Soient $n \geq 2$ et $A \in \mathcal{M}_n(\mathbb{K})$ une matrice de rang $1$. On écrit $A = C L$ où $C$ est une colonne non nulle et $L$ une ligne non nulle.`,
    steps: [
      {
        type: 'mcq', prompt: R`Quelle est la dimension de $E_0(A) = \operatorname{Ker} A$ ?`,
        options: [R`$n - 1$`, R`$1$`, R`$n$`, R`$0$`], answer: 0,
        explain: R`Théorème du rang : $\dim \operatorname{Ker} A = n - \operatorname{rg}(A) = n - 1$. Donc $0$ est valeur propre, de multiplicité au moins $n - 1$.`
      },
      {
        type: 'mcq', prompt: R`Que vaut le produit $A\,C$ ?`,
        options: [R`$\operatorname{tr}(A)\, C$`, R`$0$`, R`$C$`, R`$\det(A)\, C$`], answer: 0,
        explain: R`$A C = C (L C)$, où $LC$ est un scalaire. Or $LC = \operatorname{tr}(LC) = \operatorname{tr}(CL) = \operatorname{tr}(A)$.`
      },
      {
        type: 'mcq', prompt: R`À quelle condition $A$ est-elle diagonalisable ?`,
        options: [R`Si et seulement si $\operatorname{tr}(A) \neq 0$`, R`Toujours`, R`Jamais`, R`Si et seulement si $A$ est symétrique`], answer: 0,
        explain: R`Si $\operatorname{tr}(A) \neq 0$ : $C$ est vecteur propre pour $\operatorname{tr}(A) \neq 0$, donc $\dim E_0 + \dim E_{\operatorname{tr}(A)} \geq (n-1) + 1 = n$. Si $\operatorname{tr}(A) = 0$ : comme $m(0) \geq \dim E_0 = n - 1$, on a $\chi_A = X^{n-1}(X - \alpha)$, et le coefficient de $X^{n-1}$ donne $\alpha = \operatorname{tr}(A) = 0$. Donc $\chi_A = X^n$, la seule valeur propre est $0$ et $\dim E_0 = n - 1 < n$.`
      }
    ]
  },

  /* ================= Leçon 4 ================= */
  {
    id: 'ex-l4-a', lesson: 'l4', level: 1, notion: 'n-critere-annulateur',
    title: 'Exploiter un polynôme annulateur',
    statement: R`Soit $A \in \mathcal{M}_n(\mathbb{R})$ telle que $A^2 - 3A + 2I_n = 0$.`,
    steps: [
      {
        type: 'mcq', prompt: R`Que peut-on dire du spectre de $A$ ?`,
        options: [R`$\operatorname{Sp}(A) \subset \{1, 2\}$`, R`$\operatorname{Sp}(A) = \{1, 2\}$`, R`$\operatorname{Sp}(A) \subset \{-1, -2\}$`, R`$\operatorname{Sp}(A) \subset \{0, 3\}$`], answer: 0,
        explain: R`$X^2 - 3X + 2 = (X-1)(X-2)$ annule $A$, donc toute valeur propre en est racine. L'inclusion peut être stricte : $A = I_n$ convient et son spectre est $\{1\}$.`
      },
      {
        type: 'tf', prompt: R`$A$ est diagonalisable sur $\mathbb{R}$.`,
        answer: true,
        explain: R`$(X-1)(X-2)$ est un polynôme annulateur scindé sur $\mathbb{R}$ à racines simples.`
      },
      {
        type: 'tf', prompt: R`$A$ est inversible.`,
        answer: true,
        explain: R`$0$ n'est pas racine du polynôme annulateur, donc $0$ n'est pas valeur propre de $A$.`
      },
      {
        type: 'mcq', prompt: R`Quelle est l'expression de $A^{-1}$ ?`,
        options: [R`$\frac{1}{2}(3I_n - A)$`, R`$\frac{1}{2}(A - 3I_n)$`, R`$A - 3I_n$`, R`$2(3I_n - A)$`], answer: 0,
        explain: R`La relation s'écrit $A(3I_n - A) = 2I_n$.`
      }
    ]
  },
  {
    id: 'ex-l4-b', lesson: 'l4', level: 2, notion: 'n-poly-minimal',
    title: 'Polynôme minimal et similitude',
    statement: R`On considère $A = \begin{pmatrix}1&0&0\\0&1&0\\0&0&2\end{pmatrix}$ et $B = \begin{pmatrix}1&1&0\\0&1&0\\0&0&2\end{pmatrix}$.`,
    steps: [
      {
        type: 'mcq', prompt: R`Quel est le polynôme minimal de $A$ ?`,
        options: [R`$(X-1)(X-2)$`, R`$(X-1)^2(X-2)$`, R`$X - 1$`, R`$X - 2$`], answer: 0,
        explain: R`$A$ est diagonale de valeurs propres $1$ et $2$ : $(A - I_3)(A - 2I_3) = 0$, et aucun polynôme de degré 1 n'annule $A$ puisque $A$ n'est pas une homothétie.`
      },
      {
        type: 'mcq', prompt: R`Quel est le polynôme minimal de $B$ ?`,
        options: [R`$(X-1)^2(X-2)$`, R`$(X-1)(X-2)$`, R`$(X-1)^2$`, R`$(X-1)(X-2)^2$`], answer: 0,
        explain: R`$\pi_B$ divise $\chi_B = (X-1)^2(X-2)$ et admet $1$ et $2$ pour racines. Or $(B - I_3)(B - 2I_3) \neq 0$ : sa première ligne est $(0, -1, 0)$. Donc $\pi_B = \chi_B$.`
      },
      {
        type: 'tf', prompt: R`$A$ et $B$ ont le même polynôme caractéristique, mais ne sont pas semblables.`,
        answer: true,
        explain: R`Deux matrices semblables ont le même polynôme minimal, ce qui n'est pas le cas ici. Autre argument : $A$ est diagonalisable et $B$ ne l'est pas.`
      }
    ]
  },
  {
    id: 'ex-l4-c', lesson: 'l4', level: 3, notion: 'n-critere-annulateur',
    title: 'Un annulateur sans racine réelle',
    origin: 'Exercice classique d\'oral',
    statement: R`Soit $A \in \mathcal{M}_n(\mathbb{R})$ telle que $A^2 + A + I_n = 0$.`,
    steps: [
      {
        type: 'tf', prompt: R`$A$ possède au moins une valeur propre réelle.`,
        answer: false,
        explain: R`Une valeur propre réelle serait racine de $X^2 + X + 1$, dont le discriminant vaut $-3 < 0$.`
      },
      {
        type: 'mcq', prompt: R`Que peut-on en déduire sur $n$ ?`,
        options: [R`$n$ est pair`, R`$n$ est impair`, R`$n = 2$`, R`Rien`], answer: 0,
        explain: R`$\chi_A$ est un polynôme réel de degré $n$ sans racine réelle. Or un polynôme réel de degré impair a une racine réelle. Donc $n$ est pair.`
      },
      {
        type: 'tf', prompt: R`$A$ est diagonalisable sur $\mathbb{C}$.`,
        answer: true,
        explain: R`$X^2 + X + 1 = (X - j)(X - \bar{j})$ avec $j = e^{2i\pi/3}$ : annulateur scindé à racines simples sur $\mathbb{C}$.`
      },
      {
        type: 'mcq', prompt: R`Que vaut $\det(A)$ ?`,
        options: [R`$1$`, R`$-1$`, R`$0$`, R`Cela dépend de $A$`], answer: 0,
        explain: R`Les valeurs propres complexes de $A$ sont parmi $j$ et $\bar{j}$. Comme $\chi_A$ est à coefficients réels, $j$ et $\bar{j}$ ont la même multiplicité, soit $n/2$. Donc $\det(A) = (j\,\bar{j})^{n/2} = |j|^{n} = 1$.`
      }
    ]
  },

  /* ================= Leçon 5 ================= */
  {
    id: 'ex-l5-a', lesson: 'l5', level: 1, notion: 'n-trigonalisable',
    title: 'Trigonaliser une matrice 2 × 2',
    statement: R`On considère $A = \begin{pmatrix}2&1\\-1&0\end{pmatrix} \in \mathcal{M}_2(\mathbb{R})$.`,
    steps: [
      {
        type: 'mcq', prompt: R`Quel est le polynôme caractéristique de $A$ ?`,
        options: [R`$(X-1)^2$`, R`$X^2 - 2X - 1$`, R`$X(X-2)$`, R`$(X+1)^2$`], answer: 0,
        explain: R`$\operatorname{tr}(A) = 2$ et $\det(A) = 0 + 1 = 1$, donc $\chi_A = X^2 - 2X + 1$.`
      },
      {
        type: 'tf', prompt: R`$A$ est diagonalisable.`,
        answer: false,
        explain: R`Sa seule valeur propre est $1$ : si elle était diagonalisable, elle serait semblable à $I_2$, donc égale à $I_2$. Elle est en revanche trigonalisable, car $\chi_A$ est scindé.`
      },
      {
        type: 'mcq', prompt: R`Quel est le sous-espace propre $E_1(A)$ ?`,
        options: [R`$\operatorname{Vect}((1, -1))$`, R`$\operatorname{Vect}((1, 1))$`, R`$\operatorname{Vect}((1, 0))$`, R`$\mathbb{R}^2$`], answer: 0,
        explain: R`$A - I_2 = \begin{pmatrix}1&1\\-1&-1\end{pmatrix}$ : le système se réduit à $x + y = 0$.`
      },
      {
        type: 'mcq', prompt: R`On pose $e_1 = (1, -1)$ et $e_2 = (1, 0)$. Quelle est la matrice de l'endomorphisme canoniquement associé à $A$ dans la base $(e_1, e_2)$ ?`,
        options: [
          R`$\begin{pmatrix}1&1\\0&1\end{pmatrix}$`,
          R`$\begin{pmatrix}1&0\\1&1\end{pmatrix}$`,
          R`$\begin{pmatrix}1&2\\0&1\end{pmatrix}$`,
          R`$\begin{pmatrix}1&0\\0&1\end{pmatrix}$`
        ], answer: 0,
        explain: R`$A e_1 = e_1$ et $A e_2 = (2, -1) = e_1 + e_2$. Les colonnes de la matrice sont les coordonnées de $A e_1$ et $A e_2$ dans $(e_1, e_2)$.`
      }
    ]
  },
  {
    id: 'ex-l5-b', lesson: 'l5', level: 2, notion: 'n-nilpotent',
    title: 'Autour de I + N',
    statement: R`Soit $N \in \mathcal{M}_n(\mathbb{K})$ une matrice nilpotente.`,
    steps: [
      {
        type: 'mcq', prompt: R`Quel est le spectre de $N$ ?`,
        options: [R`$\{0\}$`, R`$\varnothing$`, R`$\{0, 1\}$`, R`Cela dépend de $N$`], answer: 0,
        explain: R`$\chi_N = X^n$ : la seule racine est $0$, et c'est bien une valeur propre puisque $n \geq 1$.`
      },
      {
        type: 'mcq', prompt: R`Que vaut $\det(I_n + N)$ ?`,
        options: [R`$1$`, R`$0$`, R`$(-1)^n$`, R`$n$`], answer: 0,
        explain: R`$N$ est semblable à une matrice triangulaire $T$ de diagonale nulle, donc $I_n + N$ est semblable à $I_n + T$, triangulaire de diagonale formée de $1$.`
      },
      {
        type: 'tf', prompt: R`$I_n + N$ est inversible, d'inverse $I_n - N + N^2 - \dots + (-1)^{n-1} N^{n-1}$.`,
        answer: true,
        explain: R`Le produit $(I_n + N)\sum_{k=0}^{n-1} (-1)^k N^k$ est télescopique et vaut $I_n - (-1)^n N^n = I_n$, car $N^n = 0$.`
      },
      {
        type: 'tf', prompt: R`Si $N \neq 0$, la matrice $I_n + N$ est diagonalisable.`,
        answer: false,
        explain: R`Sa seule valeur propre est $1$ : diagonalisable, elle serait égale à $I_n$, c'est-à-dire $N = 0$.`
      }
    ]
  },
  {
    id: 'ex-l5-c', lesson: 'l5', level: 3, notion: 'n-nilpotent',
    title: 'Noyaux itérés',
    origin: 'Niveau agrégation (leçon sur les endomorphismes nilpotents)',
    statement: R`Soit $u \in \mathcal{L}(E)$ avec $\dim E = n$. Pour $k \in \mathbb{N}$, on note $N_k = \operatorname{Ker}(u^k)$, avec $N_0 = \{0\}$.`,
    steps: [
      {
        type: 'tf', prompt: R`La suite $(N_k)_{k \in \mathbb{N}}$ est croissante pour l'inclusion.`,
        answer: true,
        explain: R`Si $u^k(x) = 0$, alors $u^{k+1}(x) = u(u^k(x)) = 0$.`
      },
      {
        type: 'mcq', prompt: R`On suppose que $N_k = N_{k+1}$ pour un certain $k$. Que peut-on affirmer, pour un endomorphisme $u$ quelconque ?`,
        options: [
          R`$N_{k+1} = N_{k+2}$ : la suite est stationnaire à partir du rang $k$`,
          R`$u^k = 0$`,
          R`$u$ est inversible`,
          R`$N_k = E$`
        ], answer: 0,
        explain: R`Si $x \in N_{k+2}$, alors $u(x) \in N_{k+1} = N_k$, donc $u^{k+1}(x) = 0$, soit $x \in N_{k+1}$. Les autres affirmations sont fausses en général : pour $u = \mathrm{Id}_E$, tous les $N_k$ valent $\{0\}$ alors que $u^k \neq 0$ ; pour $u = 0$ et $k = 1$, on a $N_1 = N_2 = E$ alors que $u$ n'est pas inversible.`
      },
      {
        type: 'mcq', prompt: R`On suppose $u$ nilpotent d'indice $p$. D'après l'étape précédente, la suite $(N_k)$ est strictement croissante pour $0 \leq k \leq p$. Qu'en déduit-on ?`,
        options: [R`$p \leq n$`, R`$p = n$`, R`$p \geq n$`, R`$\dim \operatorname{Ker} u = 1$`], answer: 0,
        explain: R`Si $N_k = N_{k+1}$ avec $k < p$, la suite stationnerait dès le rang $k$, d'où $N_k = N_p = E$ et $u^k = 0$ : impossible puisque $k < p$. Les dimensions vérifient donc $0 = \dim N_0 < \dim N_1 < \dots < \dim N_p = n$ : ce sont $p + 1$ entiers distincts entre $0$ et $n$, donc $p \leq n$.`
      },
      {
        type: 'mcq', prompt: R`Soit $N \in \mathcal{M}_3(\mathbb{K})$ nilpotente telle que $\dim \operatorname{Ker} N = 1$. Quel est son indice de nilpotence ?`,
        options: [R`$3$`, R`$2$`, R`$1$`, R`On ne peut pas conclure`], answer: 0,
        explain: R`L'application $u^k$ envoie $N_{k+1}$ dans $N_1$ et son noyau, restreint à $N_{k+1}$, est $N_k$ : par le théorème du rang, $\dim N_{k+1} - \dim N_k \leq \dim N_1 = 1$. Les dimensions croissent strictement par pas d'au plus 1 jusqu'à 3 : elles valent $1, 2, 3$, et l'indice est $3$.`
      }
    ]
  }
];
