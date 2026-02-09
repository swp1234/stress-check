const CACHE_NAME = 'stress-check-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/i18n.js',
    '/js/data.js',
    '/js/app.js',
    '/manifest.json',
    '/icon-192.svg',
    '/icon-512.svg'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
            .catch(() => {})
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
            .catch(() => {})
    );
});
