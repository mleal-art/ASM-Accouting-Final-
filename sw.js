/* Service worker de ASM Accounting.
   Estrategia "red primero": si hay internet siempre carga la versión más nueva
   (así actualizar index.html en GitHub actualiza la app); sin internet usa la copia guardada.
   Los datos del club NO pasan por acá: viven en el almacenamiento del dispositivo. */
const CACHE = 'asm-v1';
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(clients.claim()); });
self.addEventListener('fetch', e => {
    if (e.request.method !== 'GET') return;
    e.respondWith(
        fetch(e.request).then(res => {
            if (res && (res.ok || res.type === 'opaque')) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => { }); }
            return res;
        }).catch(() => caches.match(e.request).then(r => r || caches.match('./')))
    );
});
self.addEventListener('notificationclick', e => {
    e.notification.close();
    e.waitUntil(clients.matchAll({ type: 'window' }).then(l => l.length ? l[0].focus() : clients.openWindow('./')));
});
