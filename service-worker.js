// Udi's Hold'em Trainer — service worker
// Strategy:
//   - Precache the app shell on install.
//   - For same-origin GET requests: cache-first, fall back to network, then update cache in the background.
//   - For the JSONBin leaderboard API and Stripe links: always go to the network (no caching).
// Bump CACHE_VERSION whenever you ship a meaningful change so old clients pick up the new shell.

const CACHE_VERSION = 'v1-2026-04-23';
const CACHE_NAME = 'uh-trainer-' + CACHE_VERSION;

const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon.svg',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
  './favicon-32.png',
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(PRECACHE_URLS).catch((err) => {
        // If any single asset fails (e.g. 404), keep going with what we got.
        console.warn('[sw] precache partial failure:', err);
      })
    )
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k.startsWith('uh-trainer-') && k !== CACHE_NAME)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Never cache the JSONBin leaderboard API or Stripe checkout links.
  const isApi =
    url.hostname.includes('jsonbin.io') ||
    url.hostname.includes('stripe.com') ||
    url.hostname.includes('buy.stripe.com');
  if (isApi) return; // let it hit the network untouched

  // Only handle same-origin requests; ignore cross-origin (fonts, CDNs, etc).
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(req).then((cached) => {
      const networkFetch = fetch(req)
        .then((res) => {
          // Only cache successful, basic responses.
          if (res && res.status === 200 && res.type === 'basic') {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          }
          return res;
        })
        .catch(() => cached); // offline fallback
      return cached || networkFetch;
    })
  );
});

// Allow the page to ask us to activate immediately after an update.
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
