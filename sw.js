'use strict';
const VERSION = 'PWA-TEST-0.1.0';
const PREFIX = 'pwa-delivery-test-cache-';
const CACHE = PREFIX + VERSION;
const ASSETS = ['./', './index.html', './styles.css', './app.js', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(ASSETS.map(path => new Request(new URL(path, self.registration.scope), { cache: 'reload' })));
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    await self.clients.claim();
    // Remove only this independent test's old caches. Never touch IndexedDB.
    const names = await caches.keys();
    await Promise.all(names.filter(name => name.startsWith(PREFIX) && name !== CACHE).map(name => caches.delete(name)));
  })());
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const scope = new URL(self.registration.scope);
  if (event.request.method !== 'GET' || url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname)) return;
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
