const CACHE_NAME = "dreamforge-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/css/main.css",
  "/js/main.js",
  "/js/components/preloader.js",
  "/js/components/notification.js",
  "/js/components/threejs-galaxy.js",
  "/js/utils/performance.js",
  "/js/utils/audio.js",
  "/js/utils/dom.js",
  "/js/data/translations.js",
  "/js/data/artifacts.js",
  "https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)).catch(err => console.error("Cache install failed:", err))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request).catch(() => caches.match("/index.html")))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
  );
});