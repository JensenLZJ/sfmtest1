// NO CACHE VERSION - Clear all caches immediately
const CACHE_NAME = 'samudrafm-no-cache-v' + Date.now();

self.addEventListener('install', (event) => {
  event.waitUntil(
    // Don't cache anything - just clear all existing caches
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      console.log('All caches cleared on install');
      return self.skipWaiting();
    })
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

// NO CACHE - Always fetch from network
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
      // Always fetch from network with no-cache headers
      fetch(req, {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      }).then((response) => {
        return response;
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


