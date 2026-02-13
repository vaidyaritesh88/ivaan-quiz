const CACHE_NAME = 'ivaan-quiz-v1';

const ASSETS = [
  './',
  './index.html',
  './css/styles.css',
  './css/animations.css',
  './js/app.js',
  './js/screens/home.js',
  './js/screens/topic-select.js',
  './js/screens/quiz-config.js',
  './js/screens/quiz.js',
  './js/screens/results.js',
  './js/screens/settings.js',
  './js/data/loader.js',
  './js/data/math-generator.js',
  './js/utils/shuffle.js',
  './js/utils/storage.js',
  './data/topics.json',
  './data/questions/authors.json',
  './data/questions/space.json',
  './data/questions/animals.json',
  './data/questions/indian-monuments.json',
  './data/questions/indian-states.json',
  './data/questions/oceans.json',
  './data/questions/indian-personalities.json',
  './manifest.json'
];

// Install: cache all assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: cache-first strategy
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});
