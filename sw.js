const CACHE_NAME = 'samudrafm-v' + Date.now();
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js'
  // Note: Images are now protected and cached differently
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Try to cache each asset individually to identify which ones fail
      return Promise.allSettled(
        CORE_ASSETS.map(asset => 
          cache.add(asset).catch(error => {
            console.warn(`Failed to cache asset: ${asset}`, error);
            return null; // Return null for failed assets
          })
        )
      ).then(() => {
        console.log('Service worker installation completed');
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

// Handle fetch events with proper error handling
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);
  
  // Only handle GET requests
  if (req.method !== 'GET') return;

  // Skip certain external resources that might cause issues
  if (url.hostname.includes('rss.app') || 
      url.hostname.includes('instagram.com') ||
      url.hostname.includes('mixcloud.com')) {
    // Let these external resources load normally without service worker interference
    return;
  }

  // Only handle same-origin requests
  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(req, {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      }).then((res) => {
        return res;
      }).catch((error) => {
        console.warn('Service worker fetch failed:', error);
        // Return a basic response instead of letting it fail
        return new Response('Network error - please refresh', { 
          status: 503,
          headers: { 'Content-Type': 'text/plain' }
        });
      })
    );
  }
});


