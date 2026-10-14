/**
 * JalSanjeevani (RouteGuard) Service Worker
 * Architecture: Offline-First PWA with Background Sync & Cache-First Fallback.
 *
 * 1. Pre-caches core app shell for zero-connectivity field operations.
 * 2. Caches all static assets & stylesheets.
 * 3. Supports Background Sync API to flush offline delivery receipts when connectivity returns.
 */

const CACHE_NAME = 'jalsanjeevani-offline-pwa-v8';
const PRECACHE_ASSETS = [
  './',
  './manifest.json',
  './index.html',
  './login.html',
  './dashboard.html',
  './driver.html',
  './panchayat.html',
  './presentation.html',
  './css/tailwind.min.css',
  './css/variables.css',
  './css/landing.css',
  './css/mobile.css',
  './css/dashboard.css',
  './css/login.css',
  './js/app.js',
  './js/auth.js',
  './js/auth-router.js',
  './js/offline-queue.js',
  './js/driver.js',
  './js/panchayat.js',
  './js/dashboard.js',
  './js/supabaseClient.js',
  './js/lang.js',
  './js/html5-qrcode.min.js',
  './js/qrcode.min.js',
  './assets/favicon.svg',
  './assets/logo.jpg'
];

// Install: Pre-cache core shell for offline readiness
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        PRECACHE_ASSETS.map((url) => cache.add(url))
      );
    }).then(() => self.skipWaiting())
  );
});

// Activate: Immediately claim all clients and remove old cache versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Network-First with Cache Fallback for dynamic updates
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Live APIs and external tile servers bypass SW cache
  if (
    url.hostname.includes('supabase.co') ||
    url.hostname.includes('onrender.com') ||
    url.pathname.startsWith('/api/')
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && (networkResponse.status === 200 || networkResponse.status === 0)) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(async () => {
        console.log('📶 [SW] Offline: serving from cache:', event.request.url);
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        if (event.request.mode === 'navigate') {
          const fallback = await caches.match('./panchayat.html') || await caches.match('./index.html') || await caches.match('./');
          if (fallback) return fallback;
        }

        return new Response('Offline: Resource cached when online.', {
          status: 503,
          statusText: 'Service Unavailable (Offline)',
          headers: new Headers({ 'Content-Type': 'text/plain' })
        });
      })
  );
});

// Background Sync: Flush pending delivery verifications
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-verifications') {
    event.waitUntil(
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: 'TRIGGER_OFFLINE_SYNC' });
        });
      })
    );
  }
});
