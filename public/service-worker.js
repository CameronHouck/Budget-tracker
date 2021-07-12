const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/assets/css/styles.css",
  "/assets/js/db.js",
  "/assets/js/index.js",
  "/service-worker.js",
  "/manifest.webmanifest",
  "/assets/icons/icon-192x192.png",
  "/assets/icons/icon-512x512.png",
];

self.addEventListener("install", function (e) {
  ev.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Successfully pre-cached files!");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function (ev) {
  ev.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log("Deleting old cache data", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function (ev) {
    if (ev.request.url.includes("/api/")) {
      ev.respondWith(
        caches
          .open(DATA_CACHE_NAME)
          .then((cache) => {
            return fetch(ev.request)
              .then((response) => {
                if (response.status === 200) {
                  cache.put(ev.request.url, response.clone());
                }
                return response;
              })
              .catch((err) => {
                return cache.match(e.request);
              });
          })
          .catch((err) => console.log(err))
      );
      return;
    }