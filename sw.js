const CACHE_NAME = 'samudrafm-v' + Date.now();
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
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS).catch((error) => {
        console.warn('Failed to cache some assets:', error);
        // Continue with installation even if some assets fail to cache
        return Promise.resolve();
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      // Delete ALL existing caches to force fresh content
      return Promise.all(keys.map((k) => caches.delete(k)));
    }).then(() => self.clients.claim())
  );
});

// Force network-first for all requests to prevent caching
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method !== 'GET') return;

  if (url.origin === self.location.origin) {
    // Always fetch from network first, never use cache
    event.respondWith(
      fetch(req, {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Referer': self.location.origin
        }
      }).then((res) => {
        // Don't cache anything - always get fresh content
        return res;
      }).catch(() => {
        // If network fails, return a basic response
        return new Response('Network error - please refresh', { 
          status: 503,
          headers: { 'Content-Type': 'text/plain' }
        });
      })
    );
  } else {
    // For external resources, also force no-cache
    event.respondWith(
      fetch(req, {
        cache: 'no-cache'
      }).catch(() => {
        // If external resource fails, let it fail naturally
        return fetch(req);
      })
    );
  }
});


