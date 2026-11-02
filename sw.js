'use strict';
const VERSION = 'PWA-TEST-0.1.2';
const PREFIX = 'pwa-delivery-test-cache-';
const CACHE = PREFIX + VERSION;
const ASSETS = ['./', './index.html', './styles.css', './app.js', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(ASSETS.map(path => new Request(new URL(path, self.registration.scope), { cache: 'reload' })));
  })());
});
// Activation does not claim clients, remove caches, or touch IndexedDB.
// Existing pages retain their resources; ACTIVATE below remains user-initiated.
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const scope = new URL(self.registration.scope);
  if (event.request.method !== 'GET' || url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname)) return;
  // Online preview is a separate document; never substitute the PWA shell or
  // intercept media Range requests. No preview cache or database is created.
  const preview = new URL('./wordquest-audio-preview/', scope).pathname;
  if (url.pathname === preview.slice(0, -1) || url.pathname.startsWith(preview)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    if (event.request.mode === 'navigate') return (await cache.match('./index.html')) || fetch(event.request);
    return (await cache.match(event.request)) || fetch(event.request);
  })());
});
self.addEventListener('message', event => {
  if (event.data?.type === 'ACTIVATE') { event.waitUntil(self.skipWaiting()); return; }
  if (event.data?.type === 'INFO' && event.ports[0]) {
    event.waitUntil((async () => {
      const cache = await caches.open(CACHE);
      const matches = await Promise.all(ASSETS.map(path => cache.match(new URL(path, self.registration.scope))));
      event.ports[0].postMessage({ version: VERSION, cacheReady: matches.every(Boolean) });
    })());
  }
});
