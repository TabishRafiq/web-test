const CACHE = 'site-v3';
const ASSETS = [
  './new.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache); // Precaching the new version
      })
  );
  // Optional: Force the new SW to immediately activate, but be careful of content inconsistency.
  // self.skipWaiting(); 
});

// 2. Clear old caches during activation
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          // Delete caches that are not the current version
          return cacheName !== CACHE_NAME; 
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  );
  // Optional: Immediately claim clients to start intercepting requests.
  // self.clients.claim();
});

// 3. Cache-First strategy for serving resources
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return cached response
        if (response) {
          return response;
        }
        // Cache miss - fetch from network
        return fetch(event.request);
      })
  );
});
