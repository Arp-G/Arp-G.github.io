// SERVICE WORKER CACHING PAGES ON REQUEST

const cacheName = 'v2';

// Call install event on service worker
self.addEventListener('install', e => {
  console.log('Service Worker: Installed');
});

// Optional: Call activate event and delete all unwanted caches
self.addEventListener('activate', e => {
  console.log('Service Worker: Activated');
  // Remove unwanted caches
  e.waitUntil(
    caches
    .keys()
    .then(cacheNames => {
      // Returns a promise to delete all caches that are not the current cache
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== cacheName) {
            console.log('Service Worker: Clearing Old Cache');
            return caches.delete(cache);
          }
        })
      )
    })
  );
});

// Call Fetch Event
// This is invoked whenever the browser tries to fetch some resource
// It provides a event.respondWith() method, which allows us to provide a response to this fetch.
self.addEventListener('fetch', e => {
  console.log('Service Worker: Fetching');
  if (!(e.request.url.indexOf('http') === 0)) return; // Skip the request if request is not made with http protocol (example: some non http request made by a browser extension, etc)
  e.respondWith(
    fetch(e.request) // Try to fetch the initial request
    .then(res => {
      const resClone = res.clone(); // Make a copy/clone of the response
      caches
        .open(cacheName)
        .then(cache => {
          // Add response to cache
          cache.put(e.request, resClone); // In case of sucess, cache the response for this request
        })
      return res; // Return the original server response to fetch call
    })
    .catch(() =>
      caches.match(e.request)) // In case of network faliure(offline mode) check the cache for response
  );
});
