// Service Worker for DRUID PWA
const CACHE_NAME = 'druid-v1';
const RUNTIME_CACHE = 'druid-runtime';

// Assets to cache on install
const STATIC_ASSETS = [
  '/druid/',
  '/druid/index.html',
  '/druid/manifest.json'
];

// Leaflet tile URL pattern
const TILE_URL_PATTERN = /tile\.openstreetmap\.org/;

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Strategy 1: Cache-first for Leaflet tiles (offline maps)
  if (TILE_URL_PATTERN.test(url.href)) {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Fetch and cache tile
          return fetch(request).then((networkResponse) => {
            // Only cache successful responses
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => {
            // Return offline tile placeholder if available
            return new Response(
              '<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><rect fill="#ddd" width="256" height="256"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999">Offline</text></svg>',
              { headers: { 'Content-Type': 'image/svg+xml' } }
            );
          });
        });
      })
    );
    return;
  }

  // Strategy 2: Network-first for API calls and dynamic content
  if (url.pathname.includes('/api/') || url.search.includes('?')) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          return caches.open(RUNTIME_CACHE).then((cache) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          });
        })
        .catch(() => {
          return caches.match(request);
        })
    );
    return;
  }

  // Strategy 3: Cache-first for static assets (JS, CSS, images)
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        // Fetch from network and cache
        return fetch(request).then((networkResponse) => {
          // Only cache successful responses
          if (networkResponse && networkResponse.status === 200) {
            return caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, networkResponse.clone());
              return networkResponse;
            });
          }
          return networkResponse;
        });
      })
      .catch(() => {
        // Fallback for navigation requests
        if (request.mode === 'navigate') {
          return caches.match('/druid/index.html');
        }
      })
  );
});

// Background sync for offline data (future enhancement)
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  if (event.tag === 'sync-tracks') {
    event.waitUntil(syncTracks());
  }
});

async function syncTracks() {
  // TODO: Implement track synchronization with backend
  console.log('[SW] Syncing tracks...');
}
