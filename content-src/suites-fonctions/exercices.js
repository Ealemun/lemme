/*
 * Lemme — exercices d'application du chapitre « Suites et séries de fonctions ».
 * Même format que content-src/reduction/exercices.js : un énoncé, puis des étapes ;
 * dans une leçon, les exercices sont rangés par niveau croissant.
 */
const R = String.raw;

module.exports = [
  /* ================= Leçon 1 ================= */
  {
    id: 'sf-ex-l1-a', lesson: 'sf-l1', level: 1, notion: 'sf-cvu',
    title: 'La suite des puissances',
    statement: R`On pose $f_n(x) = x^n$ pour $x \in [0, 1]$ et $n \in \mathbb{N}$.`,
    steps: [
      {
        type: 'mcq', prompt: R`Quelle est la limite simple $f$ de $(f_n)$ sur $[0, 1]$ ?`,
        options: [
          R`$f(x) = 0$ si $x \in [0, 1[$ et $f(1) = 1$`,
          R`La fonction nulle sur $[0, 1]$`,
          R`La fonction constante égale à $1$`,
          R`$f(x) = x$`
        ], answer: 0,
        explain: R`Pour $0 \leq x < 1$, la suite géométrique $(x^n)$ tend vers $0$ ; en $x = 1$, elle est constante égale à $1$.`
      },
      {
        type: 'mcq', prompt: R`Que vaut $\sup_{x \in [0, 1[} |f_n(x) - f(x)|$ ?`,
        options: [R`$1$, pour tout $n$`, R`$0$`, R`$\frac{1}{n}$`, R`$\frac{1}{2^n}$`], answer: 0,
        explain: R`Sur $[0, 1[$, $f_n(x) - f(x) = x^n$, qui est strictement inférieur à $1$ mais tend vers $1$ quand $x \to 1$. La borne supérieure vaut $1$ et n'est pas atteinte.`
      },
      {
        type: 'tf', prompt: R`La suite $(f_n)$ converge uniformément sur $[0, 1[$.`,
        answer: false,
        explain: R`$\|f_n - f\|_{\infty, [0, 1[} = 1$ ne tend pas vers $0$.`
      },
      {
        type: 'mcq', prompt: R`Soit $a \in\, ]0, 1[$. Que dire de la convergence sur $[0, a]$ ?`,
        options: [
          R`Elle est uniforme, car $\|f_n\|_{\infty, [0, a]} = a^n \to 0$`,
          R`Elle n'est pas uniforme, car $\|f_n\|_{\infty, [0, a]} = 1$`,
          R`Elle est uniforme seulement si $a \leq \frac{1}{2}$`,
          R`On ne peut pas conclure`
        ], answer: 0,
        explain: R`$x \mapsto x^n$ est croissante sur $[0, a]$ : son maximum est $a^n$, qui tend vers $0$ car $0 < a < 1$. Convergence uniforme sur tout $[0, a]$, mais pas sur $[0, 1[$.`
      }
    ]
  },
  {
    id: 'sf-ex-l1-b', lesson: 'sf-l1', level: 2, notion: 'sf-methode-cvu',
    title: 'Une bosse qui se déplace',
    statement: R`On pose $f_n(x) = \dfrac{n x}{1 + n^2 x^2}$ pour $x \in [0, +\infty[$ et $n \geq 1$.`,
    steps: [
      {
        type: 'mcq', prompt: R`Quelle est la limite simple de $(f_n)$ sur $[0, +\infty[$ ?`,
        options: [R`La fonction nulle`, R`La fonction constante $\frac{1}{2}$`, R`$x \mapsto \frac{1}{x}$`, R`La suite ne converge pas simplement`], answer: 0,
        explain: R`$f_n(0) = 0$, et pour $x > 0$ fixé, $f_n(x) \leq \frac{n x}{n^2 x^2} = \frac{1}{n x} \to 0$.`
      },
      {
        type: 'mcq', prompt: R`Que vaut $\|f_n\|_{\infty, [0, +\infty[}$ ?`,
        options: [R`$\frac{1}{2}$`, R`$1$`, R`$\frac{1}{n}$`, R`$\frac{n}{2}$`], answer: 0,
        explain: R`L'inégalité $1 + n^2 x^2 \geq 2 n x$ donne $f_n(x) \leq \frac{1}{2}$, avec égalité en $x = \frac{1}{n}$.`
      },
      {
        type: 'tf', prompt: R`La suite $(f_n)$ converge uniformément sur $[0, +\infty[$.`,
        answer: false,
        explain: R`$\|f_n - 0\|_\infty = \frac{1}{2}$ ne tend pas vers $0$. La « bosse » de hauteur $\frac{1}{2}$ se déplace vers $0$ sans s'aplatir.`
      },
      {
        type: 'tf', prompt: R`Pour tout $a > 0$, la suite $(f_n)$ converge uniformément sur $[a, +\infty[$.`,
        answer: true,
        explain: R`Pour $x \geq a$ : $0 \leq f_n(x) \leq \frac{1}{n x} \leq \frac{1}{n a}$, majorant indépendant de $x$ et de limite nulle.`
      }
    ]
  },

  /* ================= Leçon 2 ================= */
  {
    id: 'sf-ex-l2-a', lesson: 'sf-l2', level: 1, notion: 'sf-continuite',
    title: 'Une limite discontinue',
    statement: R`On pose $f_n(x) = \arctan(n x)$ pour $x \in \mathbb{R}$ et $n \in \mathbb{N}$.`,
    steps: [
      {
        type: 'mcq', prompt: R`Quelle est la limite simple $f$ de $(f_n)$ sur $\mathbb{R}$ ?`,
        options: [
          R`$f(x) = \frac{\pi}{2}$ si $x > 0$, $f(0) = 0$, $f(x) = -\frac{\pi}{2}$ si $x < 0$`,
          R`La fonction constante $\frac{\pi}{2}$`,
          R`La fonction nulle`,
          R`$f(x) = \arctan(x)$`
        ], answer: 0,
        explain: R`Pour $x > 0$, $n x \to +\infty$ donc $\arctan(nx) \to \frac{\pi}{2}$ ; pour $x < 0$, la limite est $-\frac{\pi}{2}$ ; et $f_n(0) = 0$.`
      },
      {
        type: 'tf', prompt: R`La suite $(f_n)$ converge uniformément sur $\mathbb{R}$.`,
        answer: false,
        explain: R`Les $f_n$ sont continues et la limite simple est discontinue en $0$ : par contraposée du théorème de continuité, la convergence n'est uniforme sur aucun voisinage de $0$.`
      },
      {
        type: 'tf', prompt: R`Pour tout $a > 0$, la suite $(f_n)$ converge uniformément sur $[a, +\infty[$.`,
        answer: true,
        explain: R`Pour $t > 0$, $\frac{\pi}{2} - \arctan(t) = \arctan\!\left(\frac{1}{t}\right) \leq \frac{1}{t}$. Donc pour $x \geq a$ et $n \geq 1$ : $\left| f_n(x) - \frac{\pi}{2} \right| \leq \frac{1}{n x} \leq \frac{1}{n a}$.`
      },
      {
        type: 'tf', prompt: R`La suite $(f_n)$ converge uniformément sur $]0, +\infty[$.`,
        answer: false,
        explain: R`Théorème de la double limite en $0$ : $f_n(x) \to 0$ quand $x \to 0$, donc $\ell_n = 0$. Si la convergence était uniforme sur $]0, +\infty[$, on aurait $f(x) \to 0$ en $0$ ; or $f = \frac{\pi}{2}$ sur $]0, +\infty[$.`
      }
    ]
  },
  {
    id: 'sf-ex-l2-b', lesson: 'sf-l2', level: 3, notion: 'sf-weierstrass',
    title: 'Moments nuls',
    origin: 'Exercice classique d\'oral',
    statement: R`Soit $f : [0, 1] \to \mathbb{R}$ une fonction continue telle que $\int_0^1 f(t)\,t^n\,\mathrm{d}t = 0$ pour tout $n \in \mathbb{N}$. On veut montrer que $f = 0$.`,
    steps: [
      {
        type: 'mcq', prompt: R`Que donne l'hypothèse, par linéarité de l'intégrale ?`,
        options: [
          R`$\int_0^1 f(t)\,P(t)\,\mathrm{d}t = 0$ pour toute fonction polynomiale $P$`,
          R`$\int_0^1 f(t)\,\mathrm{d}t = 0$ et rien de plus`,
          R`$f$ est une fonction polynomiale`,
          R`$\int_0^1 P(t)\,\mathrm{d}t = 0$ pour toute fonction polynomiale $P$`
        ], answer: 0,
        explain: R`Un polynôme est une combinaison linéaire finie de monômes $t^n$.`
      },
      {
        type: 'mcq', prompt: R`Quel théorème fournit une suite $(P_n)$ de fonctions polynomiales convergeant uniformément vers $f$ sur $[0, 1]$ ?`,
        options: [
          R`Le théorème de Weierstrass`,
          R`Le théorème de la double limite`,
          R`Le théorème de Bolzano-Weierstrass`,
          R`Le théorème de convergence dominée`
        ], answer: 0,
        explain: R`$f$ est continue sur le segment $[0, 1]$ : c'est exactement le cadre du théorème d'approximation de Weierstrass.`
      },
      {
        type: 'mcq', prompt: R`Vers quoi tend $\int_0^1 f(t)\,P_n(t)\,\mathrm{d}t$ quand $n \to +\infty$ ?`,
        options: [R`$\int_0^1 f(t)^2\,\mathrm{d}t$`, R`$\int_0^1 f(t)\,\mathrm{d}t$`, R`$\|f\|_\infty$`, R`On ne peut pas le savoir`], answer: 0,
        explain: R`$\|f P_n - f^2\|_\infty \leq \|f\|_\infty\,\|P_n - f\|_\infty \to 0$ : la suite $(f P_n)$ converge uniformément vers $f^2$ sur $[0, 1]$, et on applique le théorème d'intégration sur un segment.`
      },
      {
        type: 'mcq', prompt: R`Chaque intégrale $\int_0^1 f P_n$ est nulle, donc $\int_0^1 f^2 = 0$. Pourquoi peut-on conclure que $f = 0$ ?`,
        options: [
          R`$f^2$ est continue, positive, et d'intégrale nulle sur un segment : elle est nulle`,
          R`Toute fonction d'intégrale nulle est nulle`,
          R`$f^2$ est positive, ce qui suffit même sans continuité`,
          R`Parce que $f$ est polynomiale`
        ], answer: 0,
        explain: R`Les trois hypothèses comptent : continuité, positivité, intégrale nulle. Sans continuité, une fonction positive non nulle peut avoir une intégrale nulle (par exemple nulle sauf en un point).`
      }
    ]
  },

  /* ================= Leçon 3 ================= */
  {
    id: 'sf-ex-l3-a', lesson: 'sf-l3', level: 1, notion: 'sf-integration',
    title: 'Une intégrale qui ne suit pas',
    statement: R`On pose $h_n(x) = n^2 x (1 - x)^n$ pour $x \in [0, 1]$ et $n \geq 1$. On admet que $\int_0^1 x (1 - x)^n\,\mathrm{d}x = \dfrac{1}{(n+1)(n+2)}$.`,
    steps: [
      {
        type: 'mcq', prompt: R`Quelle est la limite simple de $(h_n)$ sur $[0, 1]$ ?`,
        options: [R`La fonction nulle`, R`La fonction constante $1$`, R`$x \mapsto x$`, R`La suite ne converge pas simplement`], answer: 0,
        explain: R`$h_n(0) = h_n(1) = 0$. Pour $x \in\, ]0, 1[$, $n^2 (1 - x)^n \to 0$ par croissances comparées, puisque $0 < 1 - x < 1$.`
      },
      {
        type: 'mcq', prompt: R`Que vaut $\int_0^1 h_n(x)\,\mathrm{d}x$ ?`,
        options: [R`$\frac{n^2}{(n+1)(n+2)}$`, R`$\frac{1}{(n+1)(n+2)}$`, R`$\frac{n}{n+1}$`, R`$0$`], answer: 0,
        explain: R`Par linéarité : $n^2 \times \frac{1}{(n+1)(n+2)}$.`
      },
      {
        type: 'mcq', prompt: R`Quelle est la limite de $\int_0^1 h_n$ ?`,
        options: [R`$1$`, R`$0$`, R`$+\infty$`, R`$\frac{1}{2}$`], answer: 0,
        explain: R`$\frac{n^2}{(n+1)(n+2)} \to 1$, alors que l'intégrale de la limite simple vaut $0$ : on ne peut pas intervertir limite et intégrale ici.`
      },
      {
        type: 'tf', prompt: R`La suite $(h_n)$ converge uniformément sur $[0, 1]$.`,
        answer: false,
        explain: R`Sinon, les $h_n$ étant continues sur le segment $[0, 1]$, le théorème d'intégration donnerait $\int_0^1 h_n \to \int_0^1 0 = 0$, ce qui contredit la limite $1$.`
      }
    ]
  },
  {
    id: 'sf-ex-l3-b', lesson: 'sf-l3', level: 2, notion: 'sf-derivation',
    title: 'Une limite uniforme non dérivable',
    statement: R`On pose $f_n(x) = \sqrt{x^2 + \dfrac{1}{n}}$ pour $x \in \mathbb{R}$ et $n \geq 1$.`,
    steps: [
      {
        type: 'mcq', prompt: R`Quelle est la limite simple de $(f_n)$ sur $\mathbb{R}$ ?`,
        options: [R`$x \mapsto |x|$`, R`$x \mapsto x$`, R`$x \mapsto x^2$`, R`La fonction nulle`], answer: 0,
        explain: R`$x^2 + \frac{1}{n} \to x^2$ et la racine carrée est continue : $f_n(x) \to \sqrt{x^2} = |x|$.`
      },
      {
        type: 'tf', prompt: R`La convergence est uniforme sur $\mathbb{R}$.`,
        answer: true,
        explain: R`Pour $u, v \geq 0$, $\sqrt{u + v} \leq \sqrt{u} + \sqrt{v}$. Donc $0 \leq f_n(x) - |x| \leq \frac{1}{\sqrt{n}}$ pour tout $x$ : majorant indépendant de $x$, de limite nulle.`
      },
      {
        type: 'tf', prompt: R`Chaque $f_n$ est de classe $\mathcal{C}^1$ sur $\mathbb{R}$.`,
        answer: true,
        explain: R`$x^2 + \frac{1}{n} > 0$ sur $\mathbb{R}$ et la racine carrée est de classe $\mathcal{C}^1$ sur $]0, +\infty[$. On a $f_n'(x) = \frac{x}{\sqrt{x^2 + 1/n}}$.`
      },
      {
        type: 'mcq', prompt: R`La limite $x \mapsto |x|$ n'est pas dérivable en $0$. Quelle hypothèse du théorème de dérivation est en défaut ?`,
        options: [
          R`$(f_n')$ ne converge uniformément sur aucun segment contenant $0$ dans son intérieur`,
          R`$(f_n)$ ne converge pas simplement`,
          R`Les $f_n$ ne sont pas de classe $\mathcal{C}^1$`,
          R`$\mathbb{R}$ n'est pas un intervalle`
        ], answer: 0,
        explain: R`$f_n'(x) = \frac{x}{\sqrt{x^2 + 1/n}}$ converge simplement vers $1$ si $x > 0$, $0$ si $x = 0$, $-1$ si $x < 0$. Les $f_n'$ sont continues et cette limite est discontinue en $0$ : la convergence de $(f_n')$ n'est pas uniforme au voisinage de $0$.`
      }
    ]
  },

  /* ================= Leçon 4 ================= */
  {
    id: 'sf-ex-l4-a', lesson: 'sf-l4', level: 1, notion: 'sf-series-theoremes',
    title: 'Continue, mais dérivable terme à terme ?',
    statement: R`On considère la série de fonctions $\sum_{n \geq 1} f_n$ avec $f_n(x) = \dfrac{\sin(n x)}{n^2}$ pour $x \in \mathbb{R}$, et on note $S$ sa somme.`,
    steps: [
      {
        type: 'mcq', prompt: R`Que vaut $\|f_n\|_{\infty, \mathbb{R}}$ ?`,
        options: [R`$\frac{1}{n^2}$`, R`$\frac{1}{n}$`, R`$1$`, R`$n$`], answer: 0,
        explain: R`$|\sin(nx)| \leq 1$, avec égalité en $x = \frac{\pi}{2n}$.`
      },
      {
        type: 'tf', prompt: R`La série converge normalement sur $\mathbb{R}$.`,
        answer: true,
        explain: R`$\sum \|f_n\|_\infty = \sum \frac{1}{n^2}$ est une série de Riemann convergente.`
      },
      {
        type: 'tf', prompt: R`La somme $S$ est continue sur $\mathbb{R}$.`,
        answer: true,
        explain: R`Les $f_n$ sont continues et la série converge normalement, donc uniformément, sur $\mathbb{R}$.`
      },
      {
        type: 'tf', prompt: R`Le théorème de dérivation terme à terme s'applique sur $\mathbb{R}$ et donne $S'(x) = \sum_{n \geq 1} \dfrac{\cos(n x)}{n}$.`,
        answer: false,
        explain: R`La série des dérivées $\sum \frac{\cos(nx)}{n}$ diverge en $x = 0$ (série harmonique) : elle ne converge donc uniformément sur aucun segment contenant $0$. Le théorème ne s'applique pas.`
      }
    ]
  },
  {
    id: 'sf-ex-l4-b', lesson: 'sf-l4', level: 2, notion: 'sf-series-theoremes',
    title: 'La fonction zêta de Riemann',
    statement: R`Pour $x > 1$, on pose $\zeta(x) = \sum_{n \geq 1} \dfrac{1}{n^x}$, et $f_n(x) = \dfrac{1}{n^x}$.`,
    steps: [
      {
        type: 'mcq', prompt: R`Soit $a > 1$. Que vaut $\|f_n\|_{\infty, [a, +\infty[}$ ?`,
        options: [R`$\frac{1}{n^a}$`, R`$\frac{1}{n}$`, R`$1$`, R`$\frac{1}{a^n}$`], answer: 0,
        explain: R`Pour $n \geq 1$, $x \mapsto \frac{1}{n^x} = e^{-x \ln n}$ est décroissante : son maximum sur $[a, +\infty[$ est atteint en $a$.`
      },
      {
        type: 'tf', prompt: R`Pour tout $a > 1$, la série converge normalement sur $[a, +\infty[$.`,
        answer: true,
        explain: R`$\sum \frac{1}{n^a}$ est une série de Riemann convergente, car $a > 1$.`
      },
      {
        type: 'tf', prompt: R`La série converge normalement sur $]1, +\infty[$.`,
        answer: false,
        explain: R`$\|f_n\|_{\infty, ]1, +\infty[} = \frac{1}{n}$ (borne supérieure non atteinte), et $\sum \frac{1}{n}$ diverge.`
      },
      {
        type: 'tf', prompt: R`La fonction $\zeta$ est continue sur $]1, +\infty[$.`,
        answer: true,
        explain: R`Tout segment de $]1, +\infty[$ est inclus dans un intervalle $[a, +\infty[$ avec $a > 1$ : la convergence est uniforme sur tout segment, et les $f_n$ sont continues.`
      },
      {
        type: 'mcq', prompt: R`Quelle est la limite de $\zeta(x)$ quand $x \to +\infty$ ?`,
        options: [R`$1$`, R`$0$`, R`$+\infty$`, R`$\frac{\pi^2}{6}$`], answer: 0,
        explain: R`La convergence est uniforme sur $[2, +\infty[$. Quand $x \to +\infty$ : $f_1(x) = 1$ et $f_n(x) \to 0$ pour $n \geq 2$. Le théorème de la double limite donne $\zeta(x) \to 1 + 0 + 0 + \dots = 1$.`
      }
    ]
  },
  {
    id: 'sf-ex-l4-c', lesson: 'sf-l4', level: 3, notion: 'sf-series-modes',
    title: 'Uniforme sans être normale',
    origin: 'Exercice classique d\'oral',
    statement: R`On considère la série $\sum_{n \geq 1} f_n$ avec $f_n(x) = \dfrac{(-1)^n}{n + x}$ pour $x \in [0, +\infty[$, et on note $S$ sa somme.`,
    steps: [
      {
        type: 'tf', prompt: R`La série converge normalement sur $[0, +\infty[$.`,
        answer: false,
        explain: R`$\|f_n\|_\infty = \frac{1}{n}$, atteint en $x = 0$, et $\sum \frac{1}{n}$ diverge.`
      },
      {
        type: 'mcq', prompt: R`Quel outil permet de majorer le reste $R_n(x)$ indépendamment de $x$ ?`,
        options: [
          R`Le critère des séries alternées : $|R_n(x)| \leq \frac{1}{n + 1 + x} \leq \frac{1}{n + 1}$`,
          R`La comparaison à une série de Riemann convergente`,
          R`La règle de d'Alembert`,
          R`Le théorème de convergence dominée`
        ], answer: 0,
        explain: R`À $x \geq 0$ fixé, la suite $\left(\frac{1}{n + x}\right)_n$ est décroissante de limite nulle : la série converge et son reste est majoré en valeur absolue par son premier terme.`
      },
      {
        type: 'tf', prompt: R`La série converge uniformément sur $[0, +\infty[$.`,
        answer: true,
        explain: R`Elle converge simplement et $\|R_n\|_\infty \leq \frac{1}{n + 1} \to 0$ : la suite des restes converge uniformément vers $0$.`
      },
      {
        type: 'mcq', prompt: R`Quelle est la limite de $S(x)$ quand $x \to +\infty$ ?`,
        options: [R`$0$`, R`$-\ln 2$`, R`$-1$`, R`La limite n'existe pas`], answer: 0,
        explain: R`La convergence est uniforme sur $[0, +\infty[$ et chaque $f_n(x)$ tend vers $0$ en $+\infty$ : par double limite, $S(x) \to \sum 0 = 0$. La valeur $-\ln 2$ est celle de $S(0)$.`
      }
    ]
  }
];
