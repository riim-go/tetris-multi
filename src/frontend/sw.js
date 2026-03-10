const CACHE_NAME = 'tetris-pwa-v1';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './network/socket.js',
  './network/multiplayer.js',
  './ui/game_ui.js',
  './ui/menu.js',
  './icons/icon.svg',
  'https://cdn.socket.io/4.7.2/socket.io.min.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
