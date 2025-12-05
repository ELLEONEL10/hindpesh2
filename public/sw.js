const CACHE_NAME = 'hindpesh-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  // Skip cross-origin requests (like Google Fonts, etc.) or API calls if you don't want to cache them yet
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).catch(error => {
          // Network request failed (offline or server down)
          console.log('Fetch failed:', event.request.url);
          throw error;
        });
      })
  );
});
