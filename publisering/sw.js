const CACHE_NAME = "treningsbuddy-flat-v181";
const APP_SHELL = ["./", "./index.html", "./app.css", "./workout-categories.js", "./description-loader.js", "./exerciseDescriptions.json", "./app.js", "./assets/icons/treningsbuddy-favicon-32.png", "./assets/icons/treningsbuddy-apple-touch-icon.png", "./assets/icons/treningsbuddy-pwa-icon-192.png", "./assets/icons/treningsbuddy-pwa-icon-512.png", "./assets/icons/treningsbuddy-pwa-maskable-192.png", "./assets/icons/treningsbuddy-pwa-maskable-512.png", "./assets/logos/treningsbuddy-home-logo.png", "./sounds/treningsbuddy-work.mp3", "./sounds/treningsbuddy-rest.mp3", "./sounds/treningsbuddy-complete.mp3", "./sounds/treningsbuddy-countdown.mp3", "./manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          caches.open(CACHE_NAME).then((cache) => cache.put("./index.html", response.clone()));
          return response;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  event.respondWith(
    fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request, { ignoreSearch: true }).then((cached) => cached || Response.error()))
  );
});
