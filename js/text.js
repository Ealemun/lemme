/*
 * Lemme — mise en forme des textes du contenu.
 *
 * Les textes des fiches et des questions utilisent une mini-syntaxe :
 *   $...$    formule en ligne           $$...$$  formule centrée
 *   **...**  gras                       saut de ligne = nouveau paragraphe
 *
 * LemmeText.html(texte) renvoie du HTML sûr : tout le texte est échappé,
 * seules les formules (rendues par KaTeX) et les balises produites ici
 * sont insérées telles quelles.
 */
(function (root) {
  'use strict';

  /** Échappe les caractères spéciaux du HTML. */
  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /*
   * En MathML natif, les navigateurs ignorent l'attribut mathvariant : sans correction,
   * \mathbb{R} s'afficherait comme un simple R. On remplace donc chaque lettre ajourée
   * ou calligraphique par son caractère Unicode (ℝ, ℂ, 𝕂, ℒ, ℳ…).
   */
  const BB_SPECIAL = { C: '\u2102', H: '\u210D', N: '\u2115', P: '\u2119', Q: '\u211A', R: '\u211D', Z: '\u2124' };
  const SCRIPT_SPECIAL = { B: '\u212C', E: '\u2130', F: '\u2131', H: '\u210B', I: '\u2110', L: '\u2112', M: '\u2133', R: '\u211B' };

  function unicodeVariants(mathml) {
    return mathml.replace(/<mi mathvariant="(double-struck|script)">([A-Z])<\/mi>/g, function (_, variant, ch) {
      const special = variant === 'double-struck' ? BB_SPECIAL : SCRIPT_SPECIAL;
      const base = variant === 'double-struck' ? 0x1D538 : 0x1D49C; // début des alphabets mathématiques
      const out = special[ch] || String.fromCodePoint(base + ch.charCodeAt(0) - 65);
      return '<mi mathvariant="normal">' + out + '</mi>';
    });
  }

  /** Rend une formule avec KaTeX ; en cas d'échec, affiche le LaTeX brut. */
  function math(tex, display) {
    try {
      // LEMME_MATH_OUTPUT = 'mathml' : rendu natif du navigateur, sans polices KaTeX
      // (pour un hébergement qui ne peut pas embarquer ces polices).
      const output = root.LEMME_MATH_OUTPUT === 'mathml' ? 'mathml' : 'htmlAndMathml';
      const html = root.katex.renderToString(tex, { displayMode: display, throwOnError: false, output: output });
      return output === 'mathml' ? unicodeVariants(html) : html;
    } catch (e) {
      return '<code>' + esc(tex) + '</code>';
    }
  }

  /** Texte courant hors formule : échappement, gras, sauts de ligne. */
  function plain(s) {
    return esc(s)
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }

  /**
   * Convertit un texte du contenu en HTML.
   * Les formules sont d'abord mises de côté (remplacées par un repère), pour que
   * le gras puisse entourer un passage qui contient une formule : **Cas $r = 2$.**
   */
  function html(text) {
    if (!text) return '';
    const formulas = [];
    const re = /\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g;
    const marked = text.replace(re, function (_, block, inline) {
      formulas.push(block !== undefined
        // Formule centrée : dans un conteneur qui défile horizontalement si elle est trop large.
        ? '<span class="math-block">' + math(block, true) + '</span>'
        : '<span class="math-inline">' + math(inline, false) + '</span>');
      return '\u0000' + (formulas.length - 1) + '\u0000'; // repère : caractère absent de tout contenu
    });
    return plain(marked).replace(/\u0000(\d+)\u0000/g, function (_, i) { return formulas[Number(i)]; });
  }

  root.LemmeText = { html: html, esc: esc };
})(window);
