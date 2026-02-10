const CACHE_NAME = 'stress-check-v2';
const urlsToCache = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/i18n.js',
    '/js/data.js',
    '/js/app.js',
    '/manifest.json',
    '/icon-192.svg',
    '/icon-512.svg',
    '/js/locales/ko.json',
    '/js/locales/en.json',
    '/js/locales/zh.json',
    '/js/locales/hi.json',
    '/js/locales/ru.json',
    '/js/locales/ja.json',
    '/js/locales/es.json',
    '/js/locales/pt.json',
    '/js/locales/id.json',
    '/js/locales/tr.json',
    '/js/locales/de.json',
    '/js/locales/fr.json'
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

self.addEventListener('fetch', e => {
    e.respondWith(
        fetch(e.request).then(r => {
            const c = r.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(e.request, c));
            return r;
        }).catch(() => caches.match(e.request))
    );
});
