// Innovación & Disrupción · service worker (app instalable y notificaciones)
const VERSION = 'id-1.2.0';
const SHELL = ['./', 'index.html', 'app.css', 'app.js', 'config.js', 'manifest.webmanifest', 'icono-192.png', 'icono-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
// Primero la red (siempre la versión más reciente) y, sin conexión, la copia guardada
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(fetch(new Request(e.request, { cache: 'no-cache' })).then(r => { const c = r.clone(); caches.open(VERSION).then(x => x.put(e.request, c)); return r; }).catch(() => caches.match(e.request).then(r => r || caches.match('index.html'))));
});
self.addEventListener('push', e => {
  let d = {}; try { d = e.data.json(); } catch (x) { d = { title: 'Innovación & Disrupción', body: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.title || 'Innovación & Disrupción', { body: d.body || '', icon: 'icono-192.png', badge: 'icono-192.png', tag: d.tag, data: { url: d.url || './' } }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(ws => { for (const w of ws) { if ('focus' in w) return w.focus(); } return clients.openWindow(e.notification.data.url || './'); }));
});
