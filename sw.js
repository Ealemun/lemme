/*
 * Lemme — service worker (fonctionnement hors ligne).
 *
 * Stratégie : « cache d'abord, réseau ensuite ».
 *  - à l'installation, tous les fichiers de l'application sont mis en cache ;
 *  - chaque requête est servie depuis le cache si possible, sinon depuis le réseau
 *    (et la réponse est alors ajoutée au cache : c'est le cas des polices).
 *
 * Pour publier une nouvelle version de l'application ou du contenu,
 * changer VERSION : l'ancien cache est supprimé à l'activation.
 */
const VERSION = 'lemme-v1';

const FILES = [
  './',
  'index.html',
  'manifest.webmanifest',
  'css/app.css',
  'js/engine.js',
  'js/text.js',
  'js/store.js',
  'js/app.js',
  'content/reduction.js',
  'vendor/katex/katex.min.js',
  'vendor/katex/katex.min.css',
  'icons/icon.svg',
  'icons/icon-192.png'
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
  event.respondWith(
    caches.match(event.request).then((hit) => {
      if (hit) return hit;
      return fetch(event.request).then((response) => {
        // Les polices (KaTeX et Google Fonts) sont mises en cache à leur première utilisation.
        if (response.ok || response.type === 'opaque') {
          const copy = response.clone();
          caches.open(VERSION).then((cache) => cache.put(event.request, copy));
        }
        return response;
      });
    })
  );
});
