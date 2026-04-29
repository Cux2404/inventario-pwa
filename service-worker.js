const CACHE_NAME = "inventario-cache-v1";

const archivos = [
  "index.html",
  "style.css",
  "app.js",
  "manifest.json"
];

self.addEventListener("install", evento => {
  evento.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(archivos);
    })
  );
});

self.addEventListener("fetch", evento => {
  evento.respondWith(
    caches.match(evento.request).then(respuesta => {
      return respuesta || fetch(evento.request);
    })
  );
});