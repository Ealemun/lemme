/*
 * Lemme — service worker (fonctionnement hors ligne).
 *
 * Stratégie : « cache d'abord, réseau ensuite ».
 *  - à l'installation, tous les fichiers de l'application sont mis en cache ;
 *  - chaque requête est servie depuis le cache si possible, sinon depuis le réseau
 *    (et la réponse est alors ajoutée au cache : c'est le cas des polices de l'interface).
 *  - les appels au service de comptes ne sont jamais mis en cache.
 *
 * Pour publier une nouvelle version de l'application ou du contenu,
 * changer VERSION : l'ancien cache est supprimé à l'activation.
 */
const VERSION = 'lemme-v3';

const FILES = [
  './',
  'index.html',
  'manifest.webmanifest',
  'css/app.css',
  'js/engine.js',
  'js/text.js',
  'js/config.js',
  'js/sync-supabase.js',
  'js/store.js',
  'js/app.js',
  'content/reduction.js',
  'vendor/katex/katex.min.js',
  'vendor/katex/katex.min.css',
  'icons/icon.svg',
  'icons/icon-192.png',
  // Polices des formules : sans elles, une leçon ouverte hors ligne pour la première fois serait illisible.
  'vendor/katex/fonts/KaTeX_AMS-Regular.woff2',
  'vendor/katex/fonts/KaTeX_Caligraphic-Bold.woff2',
  'vendor/katex/fonts/KaTeX_Caligraphic-Regular.woff2',
  'vendor/katex/fonts/KaTeX_Fraktur-Bold.woff2',
  'vendor/katex/fonts/KaTeX_Fraktur-Regular.woff2',
  'vendor/katex/fonts/KaTeX_Main-Bold.woff2',
  'vendor/katex/fonts/KaTeX_Main-BoldItalic.woff2',
  'vendor/katex/fonts/KaTeX_Main-Italic.woff2',
  'vendor/katex/fonts/KaTeX_Main-Regular.woff2',
  'vendor/katex/fonts/KaTeX_Math-BoldItalic.woff2',
  'vendor/katex/fonts/KaTeX_Math-Italic.woff2',
  'vendor/katex/fonts/KaTeX_SansSerif-Bold.woff2',
  'vendor/katex/fonts/KaTeX_SansSerif-Italic.woff2',
  'vendor/katex/fonts/KaTeX_SansSerif-Regular.woff2',
  'vendor/katex/fonts/KaTeX_Script-Regular.woff2',
  'vendor/katex/fonts/KaTeX_Size1-Regular.woff2',
  'vendor/katex/fonts/KaTeX_Size2-Regular.woff2',
  'vendor/katex/fonts/KaTeX_Size3-Regular.woff2',
  'vendor/katex/fonts/KaTeX_Size4-Regular.woff2',
  'vendor/katex/fonts/KaTeX_Typewriter-Regular.woff2'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return; // on ne met en cache que les lectures
  // Comptes et synchronisation : toujours le réseau, jamais une réponse périmée.
  if (/\/(auth|rest)\/v1\//.test(event.request.url)) return;
  event.respondWith(
    caches.match(event.request).then((hit) => {
      if (hit) return hit;
      return fetch(event.request).then((response) => {
        // Les polices de l'interface (Google Fonts) sont mises en cache à leur première utilisation.
        if (response.ok || response.type === 'opaque') {
          const copy = response.clone();
          caches.open(VERSION).then((cache) => cache.put(event.request, copy));
        }
        return response;
      });
    })
  );
});
