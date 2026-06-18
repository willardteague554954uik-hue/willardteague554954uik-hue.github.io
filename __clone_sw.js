
importScripts('/__clone_assets.js');
const MAP = self.__CLONE_MAP || {};
self.addEventListener('install', (e) => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', (e) => {
  let u;
  try { u = new URL(e.request.url); } catch (_) { return; }
  const key = u.protocol + '//' + u.host + u.pathname;
  const local = MAP[key];
  if (local) {
    e.respondWith(
      fetch(local).then((r) => (r && r.ok) ? r : fetch(e.request)).catch(() => fetch(e.request))
    );
  }
});
