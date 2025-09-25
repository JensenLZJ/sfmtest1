const CACHE_NAME = 'samudrafm-v1';
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/assets/mixcloud-cache.json'
  // Note: Images are now protected and cached differently
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

// Cache-first for same-origin GET requests, network-first for JSON from Mixcloud cache
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method !== 'GET') return;

  if (url.origin === self.location.origin) {
    // Special handling for protected assets (images, etc.)
    if (url.pathname.startsWith('/images/') || url.pathname.startsWith('/assets/')) {
      event.respondWith(
        caches.match(req).then((cached) => {
          if (cached) {
            return cached;
          }
          // For protected assets, try to fetch with proper referer
          return fetch(req, {
            headers: {
              'Referer': self.location.origin
            }
          }).then((res) => {
            if (res.ok) {
              const resClone = res.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
            }
            return res;
          }).catch(() => {
            // If fetch fails due to protection, return a placeholder or error
            return new Response('Asset access denied', { status: 403 });
          });
        })
      );
    } else {
      // Normal handling for other assets
      event.respondWith(
        caches.match(req).then((cached) => cached || fetch(req).then((res) => {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          return res;
        }).catch(() => caches.match('/index.html')))
      );
    }
  }
});


