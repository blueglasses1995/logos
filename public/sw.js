/// <reference lib="webworker" />

const CACHE_VERSION = "v1";
const CACHE_NAMES = {
  static: `static-${CACHE_VERSION}`,
  chapters: `chapters-${CACHE_VERSION}`,
  images: `images-${CACHE_VERSION}`,
  resources: `resources-${CACHE_VERSION}`,
};

const MAX_ENTRIES = {
  static: 50,
  chapters: 50,
  images: 50,
  resources: 50,
};

const MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAMES.static)
      .then((cache) => {
        return cache.addAll([
          "/",
          "/offline",
          "/manifest.json",
        ]);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => {
              return (
                !Object.values(CACHE_NAMES).includes(name) &&
                name.startsWith("static-") ||
                name.startsWith("chapters-") ||
                name.startsWith("images-") ||
                name.startsWith("resources-")
              );
            })
            .map((name) => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

async function cleanupCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();

  if (keys.length > maxEntries) {
    const sortedKeys = keys.sort((a, b) => {
      const aTime = parseInt(a.url.split("?t=")[1] || "0");
      const bTime = parseInt(b.url.split("?t=")[1] || "0");
      return aTime - bTime;
    });

    const keysToDelete = sortedKeys.slice(0, keys.length - maxEntries);
    await Promise.all(keysToDelete.map((key) => cache.delete(key)));
  }

  // Remove expired entries
  const now = Date.now();
  for (const request of keys) {
    const response = await cache.match(request);
    const cachedTime = parseInt(
      new URL(request.url).searchParams.get("t") || "0"
    );

    if (now - cachedTime > MAX_AGE) {
      await cache.delete(request);
    }
  }
}

async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(cacheName);

    const urlWithTimestamp = new URL(request.url);
    urlWithTimestamp.searchParams.set("t", Date.now().toString());

    cache.put(
      new Request(urlWithTimestamp.toString()),
      response.clone()
    );

    await cleanupCache(cacheName, MAX_ENTRIES[cacheName.split("-")[0]]);

    return response;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

async function cacheFirst(request, cacheName) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const response = await fetch(request);
    const cache = await caches.open(cacheName);

    const urlWithTimestamp = new URL(request.url);
    urlWithTimestamp.searchParams.set("t", Date.now().toString());

    cache.put(
      new Request(urlWithTimestamp.toString()),
      response.clone()
    );

    await cleanupCache(cacheName, MAX_ENTRIES[cacheName.split("-")[0]]);

    return response;
  } catch (error) {
    throw error;
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cachedResponse = await caches.match(request);

  const fetchPromise = fetch(request)
    .then(async (response) => {
      const cache = await caches.open(cacheName);

      const urlWithTimestamp = new URL(request.url);
      urlWithTimestamp.searchParams.set("t", Date.now().toString());

      cache.put(
        new Request(urlWithTimestamp.toString()),
        response.clone()
      );

      await cleanupCache(cacheName, MAX_ENTRIES[cacheName.split("-")[0]]);

      return response;
    })
    .catch(() => {});

  return cachedResponse || fetchPromise;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Chapter pages - NetworkFirst
  if (url.pathname.startsWith("/chapters/")) {
    event.respondWith(networkFirst(request, CACHE_NAMES.chapters));
    return;
  }

  // Static assets - CacheFirst
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.match(/\.(css|js|woff2?)$/)
  ) {
    event.respondWith(
      cacheFirst(request, CACHE_NAMES.static).catch(() =>
        caches.match("/offline")
      )
    );
    return;
  }

  // Images - CacheFirst
  if (url.pathname.match(/\.(png|jpg|jpeg|svg|gif|webp)$/i)) {
    event.respondWith(
      cacheFirst(request, CACHE_NAMES.images).catch(() =>
        caches.match("/offline")
      )
    );
    return;
  }

  // Other resources - StaleWhileRevalidate
  event.respondWith(
    staleWhileRevalidate(request, CACHE_NAMES.resources).catch(() =>
      caches.match("/offline")
    )
  );
});
