var staticCacheName = "restaurant-static-v2";
self.addEventListener("install", function (event) {
  var urlsToCache = [
    '/',
    '/imgSrc',
    '/dist/styles.css',
    '/data/restaurants.json',
    '/dist/dbhelper.js',
    '/dist/main.js',
    '/dist/restaurant_info.js',
    '/index.html',
    '/restaurant.html',
  ]

  event.waitUntil(
    caches.open(staticCacheName).then(function (cache) {
      console.log("all them cached");
      return cache.addAll(urlsToCache);
    })
  )
})

self.addEventListener('fetch', function (e) {
  if (e.pathname === '/') {
      e.respondWith(
          caches.open(dataCacheName).then(function (cache) {
              return fetch(e.request).then(function (response) {
                  cache.put(e.request.url, response.clone());
                  return response;
              });
          })
      );
  } else {
      e.respondWith(
          caches.match(e.request).then(function (response) {
              return response || fetch(e.request);
          })
      );
  }
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.filter(function (cacheName) {
          return cacheName.startsWith('restaurant-') && cacheName !== staticCacheName;
        }).map(function (cacheName) {
          return caches.delete(cacheName)
        })
      )
    })
  )
})