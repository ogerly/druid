const CACHE_NAME = 'druid-dev-v1';
const RUNTIME_CACHE = 'druid-runtime-dev';

// Development URLs (no /druid/ prefix)
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.dev.json'
];

// Tile URL pattern
const TILE_URL_PATTERN = /tile\.openstreetmap\.org/;

// Install: Cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW Dev] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW Dev] Caching app shell');
      return cache.addAll(urlsToCache);
    }).then(() => {
      console.log('[SW Dev] Installed successfully');
      return self.skipWaiting();
    })
  );
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW Dev] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log('[SW Dev] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[SW Dev] Activated');
      return self.clients.claim();
    })
  );
});

// Fetch: Cache-first for tiles, Network-first for API
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin && !TILE_URL_PATTERN.test(url.href)) {
    return;
  }

  // Cache-first strategy for Leaflet tiles
  if (TILE_URL_PATTERN.test(url.href)) {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          return fetch(request).then((networkResponse) => {
            // Only cache successful responses
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => {
            // Return placeholder tile on offline
            return new Response(
              '<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><rect fill="#f0f0f0" width="256" height="256"/><text x="50%" y="50%" text-anchor="middle" fill="#999" font-size="16">Offline</text></svg>',
              { headers: { 'Content-Type': 'image/svg+xml' } }
            );
          });
        });
      })
    );
    return;
  }

  // Network-first for everything else
  event.respondWith(
    fetch(request).catch(() => {
      return caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        // Fallback to index.html for navigation requests
        if (request.mode === 'navigate') {
          return caches.match('/index.html');
        }
        return new Response('Offline', { status: 503 });
      });
    })
  );
});
