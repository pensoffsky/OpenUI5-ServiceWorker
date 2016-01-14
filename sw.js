var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
    '/',
    '/dist/resources/sap-ui-custom.js',
    '/dist/resources/sap/m/library-preload.json',
    '/dist/resources/sap/ui/core/themes/sap_hcb/library.css',
    '/dist/resources/sap/m/themes/sap_hcb/library.css',
    '/dist/resources/sap/ui/core/themes/base/fonts/SAP-icons.ttf',
    '/dist/resources/sap/ui/thirdparty/unorm.js', //needed for safari
    '/dist/resources/sap/ui/thirdparty/unormdata.js' //needed for safari
];

//add handler that fires when the servicerWorker is installed
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


//handler for ASYNC http requests
self.addEventListener('fetch', function(event) {
    if(event.request.url.startsWith("https://query.yahooapis.com")){
        
        console.log('ServiceWorker: yahoo query: detected');
        //for yahoo queries: online first        
        var fetchRequest = event.request.clone();
        event.respondWith(fetch(fetchRequest).then(
          function(response) {
            // Check if we received a valid response
            if(response && response.status === 200 ) {
                console.log('ServiceWorker: yahoo query: fetch OK');
                var responseToCache = response.clone();
                //valid webrequest, clone and cache the result
                caches.open(CACHE_NAME).then(function(cache) {
                    console.log('ServiceWorker: yahoo query: added to cache');
                    cache.put(event.request, responseToCache);
                });
                return response;
            } else {
                console.log('ServiceWorker: yahoo query: fetch FAILED');
                //webrequest FAILED, try to answer from cache
                caches.match(event.request).then(function(response) {
                    //we dont care if the response was ok or NOT
                    console.log('ServiceWorker: yahoo query: answered from cache' + response);
                    return response;
                });;  
            }
          }
      ).catch(function(error){
          console.log('ServiceWorker: yahoo query: fetch EXCEPTION' + error.message);
          //webrequest FAILED, try to answer from cache
          return caches.match(event.request).then(function(response) {
              //we dont care if the response was ok or NOT
              console.log('ServiceWorker: yahoo query: answered from cache' + response);
              return response;
          });;  
      }));
        
    } else {
        //for all other requests: cache first
        event.respondWith(
            //check if the request can be answered from the offline cache
            caches.match(event.request).then(function(response) {
                if (response) {
                    // Cache hit - return response from cache
                    console.log('ServiceWorker: found:' + event.request.url);
                    return response;
                }

                console.log('ServiceWorker: NOT FOUND:' + event.request.url);
                return fetch(event.request);
            })
        );
    }
});