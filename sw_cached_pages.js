// SERVICE WORKER CACHING SPECIFIC PAGES

const cacheName = 'v1';

const cacheAssets = ['index.html', 'blogs.html', 'css/styles.css', 'js/scripts.js'];

// Call install event on service worker
self.addEventListener('install', e => {
  console.log('Service Worker: Installed');
  // In service workers, waitUntil() tells the browser that work is ongoing until the promise settles,
  // and it shouldn't terminate the service worker if it wants that work to complete.
  // The install events in service workers use waitUntil() to hold the service worker in the installing phase until tasks complete.
  // If the promise passed to waitUntil() rejects, the install is considered a failure, and the installing service worker is discarded.
  e.waitUntil(
    caches.open(cacheName) // Open browser cache
    .then(cache => {
      console.log('Service Worker: Caching files');
      cache.addAll(cacheAssets); // Add files to cache
    })
    .then(() => self.skipWaiting()) // Forces the waiting service worker becomes the active service worker.
    // It returns a promise that immediately resolves with undefined.
  );
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

// Intercept any fetch calls from the browser
// This is invoked whenever the browser tries to fetch some resource
// It provides a event.respondWith() method, which allows us to provide a response to this fetch.
self.addEventListener('fetch', e => {
  console.log('Service Worker: Fetching');
  e.respondWith(
    fetch(e.request) // Try to fetch the initial request
    .catch(() => caches.match(e.request)) // In case of network faliure(offline mode) check the cache for response
  );
});
