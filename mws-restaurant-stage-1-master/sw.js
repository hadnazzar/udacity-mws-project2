var staticCacheName = "restaurant-static-v1";
self.addEventListener("install", function (event) {
  var urlsToCache = [
    '/',
    '/css/styles.css',
    '/data/restaurants.json',
    '/js/dbhelper.js',
    '/js/main.js',
    '/js/restaurant_info.js',
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