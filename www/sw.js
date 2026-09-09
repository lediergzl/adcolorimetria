const CACHE = 'colorpro-v1';
const CORE = ['./','./index.html','./styles.css','./manifest.json','./assets/js/app.js','./assets/js/core/colorimetry-engine.js','./assets/js/core/formula-engine.js','./assets/js/core/diagnosis-engine.js','./assets/js/core/quantity-engine.js','./assets/js/core/workflow-service.js','./assets/js/storage/db.js'];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', event => { if (event.request.method !== 'GET') return; event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => { const copy=response.clone(); caches.open(CACHE).then(c=>c.put(event.request,copy)); return response; }).catch(()=>caches.match('./index.html')))); });
