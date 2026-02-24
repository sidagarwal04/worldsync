// Bump this version when deploying to trigger update prompt for installed users
const CACHE_NAME = 'tz-convert-v2'
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/favicon-32.png',
  '/favicon-16.png',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png',
]

// Install event - cache all essential assets
// Don't call skipWaiting() here - let the app prompt the user to update
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...')
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching app shell')
      return cache.addAll(URLS_TO_CACHE).catch((error) => {
        console.log('[Service Worker] Cache addAll error:', error)
        // Continue even if some assets fail to cache
        return Promise.resolve()
      })
    })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...')
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Fetch event - Network-First with Cache fallback
self.addEventListener('fetch', (event) => {
  const { request } = event

  // Skip non-GET requests and Chrome extensions
  if (request.method !== 'GET' || request.url.includes('chrome-extension://')) {
    return
  }

  // For document requests (HTML pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful responses
          if (response && response.status === 200) {
            const cacheResponse = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, cacheResponse)
            })
          }
          return response
        })
        .catch(() => {
          // Return cached version or offline page
          return caches.match(request).then((response) => {
            return (
              response ||
              caches.match('/').then((homePage) => {
                return (
                  homePage ||
                  new Response('Offline - Application not available', {
                    status: 503,
                    statusText: 'Service Unavailable',
                    headers: new Headers({
                      'Content-Type': 'text/plain',
                    }),
                  })
                )
              })
            )
          })
        })
    )
    return
  }

  // For API, CSS, JS, and image requests - Network-First
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful responses
        if (response && response.status === 200) {
          const cacheResponse = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, cacheResponse)
          })
        }
        return response
      })
      .catch(() => {
        // Return cached response if network fails
        return caches.match(request).then((response) => {
          if (response) {
            return response
          }

          // Return placeholder based on request type
          if (request.destination === 'image') {
            return new Response(
              '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="#ddd" width="200" height="200"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999">Offline</text></svg>',
              { headers: { 'Content-Type': 'image/svg+xml' } }
            )
          }

          return new Response('Offline - Resource not available', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain',
            }),
          })
        })
      })
  )
})

// Message handler for cache updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  if (event.data && event.data.type === 'CACHE_URLS') {
    const urls = event.data.payload
    caches.open(CACHE_NAME).then((cache) => {
      urls.forEach((url) => {
        cache.add(url).catch((error) => {
          console.log('[Service Worker] Failed to cache:', url, error)
        })
      })
    })
  }
})

console.log('[Service Worker] Loaded successfully')
