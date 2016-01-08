var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
  '/',
  '/dist/resources/sap-ui-custom.js',
  '/dist/resources/sap/m/library-preload.json',
  '/dist/resources/sap/ui/core/themes/sap_hcb/library.css',
  '/dist/resources/sap/m/themes/sap_hcb/library.css',
  '/dist/resources/sap/ui/core/themes/base/fonts/SAP-icons.ttf'
  // '/view/Main.view.xml',
  // '/view/Main.controller.js',
  // '/view/AnimatedSprite.js',
  // '/view/AnimatedSpriteRenderer.js',
  // '/view/sprite.png'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          console.log('ServiceWorker: NOT FOUND:' + event.request.url);
          return response;
        }

        console.log('ServiceWorker: found:' + event.request.url);
        return fetch(event.request);
      }
    )
  );
});