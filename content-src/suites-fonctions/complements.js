/*
 * Lemme — compléments des fiches du chapitre « Suites et séries de fonctions » :
 * exemples, prérequis et démonstrations complètes (même format que
 * content-src/reduction/complements.js).
 */
const R = String.raw;

module.exports = {
  /* ---------------- Leçon 1 ---------------- */
  'sf-cvs': {
    prereqs: ['sfp-quantificateurs'],
    examples: [
      R`$f_n(x) = \frac{x}{n}$ sur $\mathbb{R}$ : pour $x$ fixé, $\frac{x}{n} \to 0$. La suite converge simplement vers la fonction nulle.`,
      R`$f_n(x) = \left(1 + \frac{x}{n}\right)^n$ sur $\mathbb{R}$ converge simplement vers $x \mapsto e^x$.`
    ]
  },
  'sf-cvu': {
    prereqs: ['sf-cvs', 'sfp-sup', 'sfp-quantificateurs'],
    examples: [
      R`$f_n(x) = \frac{\sin(nx)}{n}$ sur $\mathbb{R}$ : $|f_n(x)| \leq \frac{1}{n}$ pour tout $x$, donc $\|f_n\|_{\infty, \mathbb{R}} \leq \frac{1}{n} \to 0$. La convergence vers $0$ est uniforme sur $\mathbb{R}$.`,
      R`$f_n(x) = x^n$ sur $[0, a]$ avec $0 \leq a < 1$ : $\|f_n\|_{\infty, [0, a]} = a^n \to 0$. La convergence vers $0$ est uniforme sur $[0, a]$.`
    ],
    proof: [
      R`**Équivalence avec la norme.** Si la propriété quantifiée est vraie, alors pour $n \geq N$ la fonction $f_n - f$ est bornée par $\varepsilon$ sur $A$, donc $\|f_n - f\|_{\infty, A} \leq \varepsilon$ : cela exprime que $\|f_n - f\|_{\infty, A} \to 0$. Réciproquement, si $\|f_n - f\|_{\infty, A} \leq \varepsilon$ pour $n \geq N$, alors $|f_n(x) - f(x)| \leq \varepsilon$ pour tout $x \in A$, puisqu'une borne supérieure majore.`,
      R`**Uniforme entraîne simple.** Soit $x \in A$. Pour $n$ assez grand, $|f_n(x) - f(x)| \leq \|f_n - f\|_{\infty, A}$, et le majorant tend vers $0$. Donc $f_n(x) \to f(x)$.`
    ]
  },
  'sf-methode-cvu': {
    prereqs: ['sf-cvu', 'sfp-sup'],
    examples: [
      R`**Prouver.** $f_n(x) = \frac{x}{1 + n x^2}$ sur $\mathbb{R}$ : comme $1 + n x^2 \geq 2\sqrt{n}\,|x|$, on a $|f_n(x)| \leq \frac{1}{2\sqrt{n}}$ pour tout $x$. La convergence vers $0$ est uniforme sur $\mathbb{R}$.`,
      R`**Réfuter.** $f_n(x) = n x e^{-nx}$ sur $[0, +\infty[$ : la limite simple est nulle, et $f_n\!\left(\frac{1}{n}\right) = e^{-1}$ ne tend pas vers $0$. La convergence n'est pas uniforme.`
    ],
    proof: [
      R`**Majoration uniforme.** Si $|f_n(x) - f(x)| \leq \alpha_n$ pour tout $x \in A$, alors $\alpha_n$ est un majorant de l'ensemble $\{|f_n(x) - f(x)| \,;\, x \in A\}$, donc $\|f_n - f\|_{\infty, A} \leq \alpha_n$. Comme $\alpha_n \to 0$, la convergence est uniforme.`,
      R`**Réfutation par une suite.** Supposons la convergence uniforme sur $A$ et soit $(x_n)$ une suite de points de $A$. Pour $n$ assez grand, $|f_n(x_n) - f(x_n)| \leq \|f_n - f\|_{\infty, A}$, qui tend vers $0$. Par contraposée, si $f_n(x_n) - f(x_n)$ ne tend pas vers $0$, la convergence n'est pas uniforme.`
    ]
  },

  /* ---------------- Leçon 2 ---------------- */
  'sf-continuite': {
    prereqs: ['sf-cvu', 'sfp-quantificateurs'],
    examples: [
      R`$f_n(x) = \frac{\sin(nx)}{n}$ : fonctions continues convergeant uniformément sur $\mathbb{R}$ vers $0$, qui est bien continue.`,
      R`$f_n(x) = \sum_{k=0}^{n} \frac{x^k}{k!}$ converge uniformément vers $\exp$ sur tout segment de $\mathbb{R}$ (mais pas sur $\mathbb{R}$) : cela suffit pour retrouver la continuité de $\exp$ sur $\mathbb{R}$.`
    ],
    proof: [
      R`Par hypothèse, il existe un voisinage $V$ de $a$ dans $A$ sur lequel $(f_n)$ converge uniformément vers $f$. Soit $\varepsilon > 0$.`,
      R`**Choix de $N$.** Par convergence uniforme sur $V$, il existe un entier $N$ tel que $|f_N(x) - f(x)| \leq \frac{\varepsilon}{3}$ pour tout $x \in V$. En particulier, comme $a \in V$ : $|f_N(a) - f(a)| \leq \frac{\varepsilon}{3}$.`,
      R`**Choix de $\delta$.** L'entier $N$ étant fixé, $f_N$ est continue en $a$ : il existe $\delta > 0$ tel que, pour tout $x \in V$ vérifiant $|x - a| \leq \delta$, on ait $|f_N(x) - f_N(a)| \leq \frac{\varepsilon}{3}$.`,
      R`**Conclusion.** Pour un tel $x$, l'inégalité triangulaire donne $$\begin{aligned} |f(x) - f(a)| \leq{} & |f(x) - f_N(x)| \\ & + |f_N(x) - f_N(a)| \\ & + |f_N(a) - f(a)| \leq \varepsilon. \end{aligned}$$ Comme $V$ est un voisinage de $a$ dans $A$, cela prouve la continuité de $f$ en $a$.`,
      R`**Sur tout segment.** Si $I$ est un intervalle et $a \in I$, il existe un segment $S \subset I$ qui est un voisinage de $a$ dans $I$. La convergence uniforme sur $S$ donne la continuité de $f$ en $a$.`
    ]
  },
  'sf-double-limite': {
    prereqs: ['sf-cvu', 'sf-continuite'],
    examples: [
      R`$f_n(x) = \frac{x}{n(1 + x)}$ sur $[0, +\infty[$ : $|f_n(x)| \leq \frac{1}{n}$, donc la convergence vers $0$ est uniforme. En $+\infty$ : $\ell_n = \frac{1}{n} \to 0$, et la limite de la fonction nulle en $+\infty$ est bien $0$.`
    ]
  },
  'sf-weierstrass': {
    prereqs: ['sf-cvu', 'sf-continuite'],
    examples: [
      R`Sur $[-1, 1]$, la fonction $x \mapsto |x|$, qui n'est pas dérivable en $0$, est pourtant limite uniforme d'une suite de polynômes.`,
      R`Application classique : si $f$ est continue sur $[0, 1]$ et si $\int_0^1 f(t)\,t^n\,\mathrm{d}t = 0$ pour tout $n \in \mathbb{N}$, alors $f = 0$.`
    ]
  },

  /* ---------------- Leçon 3 ---------------- */
  'sf-integration': {
    prereqs: ['sf-cvu', 'sf-continuite'],
    examples: [
      R`$\int_0^1 \frac{\sin(nx)}{n}\,\mathrm{d}x \to 0$, car $\frac{\sin(nx)}{n}$ converge uniformément vers $0$ sur $[0, 1]$.`,
      R`Sur $[0, \frac{1}{2}]$, $x^n$ converge uniformément vers $0$ : $\int_0^{1/2} x^n\,\mathrm{d}x \to 0$.`
    ],
    proof: [
      R`**L'intégrale de $f$ a un sens.** $f$ est limite uniforme sur $[a, b]$ de fonctions continues, donc continue sur $[a, b]$ (théorème de continuité).`,
      R`**Majoration.** Pour $n$ assez grand, $f_n - f$ est bornée sur $[a, b]$ et, pour tout $t \in [a, b]$, $|f_n(t) - f(t)| \leq \|f_n - f\|_{\infty, [a, b]}$. Donc $$\begin{aligned} \left| \int_a^b f_n - \int_a^b f \right| & \leq \int_a^b |f_n(t) - f(t)|\,\mathrm{d}t \\ & \leq (b - a)\,\|f_n - f\|_{\infty, [a, b]}. \end{aligned}$$`,
      R`**Conclusion.** Le majorant tend vers $0$, donc $\int_a^b f_n \to \int_a^b f$.`,
      R`**Primitives.** Soit $S$ un segment de $I$ ; quitte à l'agrandir, on suppose $c \in S$, et on note $L$ sa longueur. Pour $x \in S$, le segment d'extrémités $c$ et $x$ est inclus dans $S$, donc $\left| \int_c^x f_n - \int_c^x f \right| \leq L\,\|f_n - f\|_{\infty, S}$. Ce majorant ne dépend pas de $x$ et tend vers $0$.`
    ]
  },
  'sf-derivation': {
    prereqs: ['sf-integration', 'sf-continuite'],
    examples: [
      R`$f_n(x) = \frac{\sin(nx)}{n^2}$ : $(f_n)$ converge simplement vers $0$ et $f_n'(x) = \frac{\cos(nx)}{n}$ converge uniformément vers $0$ sur $\mathbb{R}$. Le théorème s'applique, avec $f = 0$ et $g = 0$.`
    ],
    proof: [
      R`**Continuité de $g$.** Les $f_n'$ sont continues sur $I$ et convergent uniformément vers $g$ sur tout segment de $I$ : $g$ est continue sur $I$.`,
      R`**Formule intégrale.** On fixe $a \in I$. Pour tout $n$ et tout $x \in I$, comme $f_n$ est de classe $\mathcal{C}^1$ : $f_n(x) = f_n(a) + \int_a^x f_n'(t)\,\mathrm{d}t$ $(1)$.`,
      R`**Passage à la limite.** Soit $x \in I$. La suite $(f_n')$ converge uniformément vers $g$ sur le segment d'extrémités $a$ et $x$, donc $\int_a^x f_n' \to \int_a^x g$ (théorème d'intégration). Par convergence simple, $f_n(x) \to f(x)$ et $f_n(a) \to f(a)$. En passant à la limite dans $(1)$ : $f(x) = f(a) + \int_a^x g(t)\,\mathrm{d}t$ $(2)$.`,
      R`**Régularité.** $g$ étant continue, le théorème fondamental de l'analyse et $(2)$ montrent que $f$ est de classe $\mathcal{C}^1$ sur $I$ et que $f' = g$.`,
      R`**Convergence uniforme de $(f_n)$ sur tout segment.** Soit $S$ un segment de $I$ ; quitte à l'agrandir, on suppose $a \in S$, et on note $L$ sa longueur. En soustrayant $(2)$ de $(1)$, pour $x \in S$ : $$\begin{aligned} |f_n(x) - f(x)| \leq{} & |f_n(a) - f(a)| \\ & + L\,\|f_n' - g\|_{\infty, S}. \end{aligned}$$ Le majorant ne dépend pas de $x$ et tend vers $0$.`
    ]
  },

  /* ---------------- Leçon 4 ---------------- */
  'sf-series-modes': {
    prereqs: ['sf-cvu', 'sfp-series', 'sfp-sup'],
    examples: [
      R`$\sum_{n \geq 1} \frac{\sin(nx)}{n^2}$ converge normalement sur $\mathbb{R}$ : $\left| \frac{\sin(nx)}{n^2} \right| \leq \frac{1}{n^2}$.`,
      R`$\sum_{n \geq 0} \frac{x^n}{n!}$ converge normalement sur $[-a, a]$ pour tout $a > 0$ : $\left| \frac{x^n}{n!} \right| \leq \frac{a^n}{n!}$, terme général d'une série convergente.`
    ],
    proof: [
      R`**Caractérisation par les restes.** Si la série converge simplement de somme $S$, alors $S - S_n = R_n$. Donc $(S_n)$ converge uniformément vers $S$ si et seulement si $(R_n)$ converge uniformément vers $0$.`,
      R`**Normale entraîne absolue en tout point.** Soit $x \in A$. Pour tout $n$, $0 \leq |f_n(x)| \leq \|f_n\|_{\infty, A}$. Par comparaison de séries à termes positifs, $\sum |f_n(x)|$ converge. La série $\sum f_n(x)$ converge donc absolument, donc converge : la série de fonctions converge simplement sur $A$.`,
      R`**Normale entraîne uniforme.** Pour $x \in A$ et $n \in \mathbb{N}$ : $$\begin{aligned} |R_n(x)| & \leq \sum_{k=n+1}^{+\infty} |f_k(x)| \\ & \leq \sum_{k=n+1}^{+\infty} \|f_k\|_{\infty, A} = \rho_n. \end{aligned}$$ Le nombre $\rho_n$ est le reste d'ordre $n$ d'une série convergente : il tend vers $0$, et il ne dépend pas de $x$. Donc $\|R_n\|_{\infty, A} \leq \rho_n \to 0$.`
    ]
  },
  'sf-series-theoremes': {
    prereqs: ['sf-series-modes', 'sf-continuite', 'sf-double-limite', 'sf-integration', 'sf-derivation'],
    examples: [
      R`**Continuité de $\zeta$.** Pour $a > 1$ et $x \geq a$ : $0 < \frac{1}{n^x} \leq \frac{1}{n^a}$, et $\sum \frac{1}{n^a}$ converge. La série converge normalement sur $[a, +\infty[$. Tout segment de $]1, +\infty[$ est inclus dans un tel intervalle : $\zeta$ est continue sur $]1, +\infty[$.`,
      R`**Limite de $\zeta$ en $+\infty$.** La série converge uniformément sur $[2, +\infty[$ ; quand $x \to +\infty$, $\frac{1}{n^x} \to 0$ pour $n \geq 2$ et $\frac{1}{1^x} = 1$. Par le théorème de la double limite, $\zeta(x) \to 1$.`
    ],
    proof: [
      R`On applique chaque théorème sur les suites à la suite des sommes partielles $S_n = \sum_{k=0}^{n} f_k$, qui hérite des propriétés des $f_k$ par somme finie.`,
      R`**Continuité.** Chaque $S_n$ est continue comme somme finie de fonctions continues, et $(S_n)$ converge uniformément vers $S$ sur tout segment.`,
      R`**Double limite.** $S_n(x) \to \sum_{k=0}^{n} \ell_k$ quand $x \to a$, par somme finie de limites. Le théorème sur les suites donne la convergence de la suite $\left(\sum_{k=0}^{n} \ell_k\right)_n$, c'est-à-dire de la série $\sum \ell_n$, et l'égalité des limites.`,
      R`**Intégration.** $\int_a^b S_n = \sum_{k=0}^{n} \int_a^b f_k$ par linéarité de l'intégrale, et $\int_a^b S_n \to \int_a^b S$.`,
      R`**Dérivation.** Chaque $S_n$ est de classe $\mathcal{C}^1$ et $S_n' = \sum_{k=0}^{n} f_k'$ ; la suite $(S_n)$ converge simplement et $(S_n')$ converge uniformément sur tout segment.`
    ]
  }
};
