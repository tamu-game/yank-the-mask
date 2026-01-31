try {
  importScripts("/sw-version.js");
} catch {}

try {
  importScripts("/sw-precache-urls.js");
} catch {}

const CACHE_VERSION = self.__SW_VERSION || "v1";
const PRECACHE_NAME = `precache-${CACHE_VERSION}`;
const RUNTIME_NAME = `runtime-${CACHE_VERSION}`;
const PRECACHE_URLS = Array.isArray(self.__PRECACHE_URLS) ? self.__PRECACHE_URLS : [];
const MAX_RUNTIME_ENTRIES = 200;
const OFFLINE_FALLBACK_URL = "/index.html";

const ASSET_EXTENSIONS = new Set([
  "png",
  "jpg",
  "jpeg",
  "webp",
  "svg",
  "gif",
  "mp3",
  "wav",
  "ogg",
  "m4a",
  "aac",
  "woff",
  "woff2",
  "ttf",
  "otf"
]);

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(precache());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(cleanupOldCaches());
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) {
    return;
  }

  if (request.mode === "navigate" || request.destination === "document") {
    event.respondWith(networkFirst(request));
    return;
  }

  if (isAssetRequest(request, url)) {
    event.respondWith(cacheFirst(request));
  }
});

const precache = async () => {
  if (PRECACHE_URLS.length === 0) {
    return;
  }
  const cache = await caches.open(PRECACHE_NAME);
  await cache.addAll(PRECACHE_URLS);
};

const cleanupOldCaches = async () => {
  const keys = await caches.keys();
  await Promise.all(
    keys
      .filter((key) => key !== PRECACHE_NAME && key !== RUNTIME_NAME)
      .map((key) => caches.delete(key))
  );
  await self.clients.claim();
};

const isAssetRequest = (request, url) => {
  if (url.pathname.startsWith("/assets/")) {
    return true;
  }

  const destination = request.destination;
  if (destination === "image" || destination === "audio" || destination === "font") {
    return true;
  }

  const ext = url.pathname.split(".").pop();
  return ext ? ASSET_EXTENSIONS.has(ext.toLowerCase()) : false;
};

const cacheFirst = async (request) => {
  const cache = await caches.open(RUNTIME_NAME);
  const cached = await cache.match(request);
  if (cached) {
    return cached;
  }

  const response = await fetch(request);
  if (response && response.status === 200) {
    await cache.put(request, response.clone());
    await enforceRuntimeLimit(cache);
  }

  return response;
};

const networkFirst = async (request) => {
  const cache = await caches.open(RUNTIME_NAME);
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      await cache.put(request, response.clone());
      await enforceRuntimeLimit(cache);
    }
    return response;
  } catch {
    const cached =
      (await cache.match(request)) ||
      (await caches.match(OFFLINE_FALLBACK_URL)) ||
      (await caches.match("/"));

    if (cached) {
      return cached;
    }
    return new Response("Offline", { status: 503, statusText: "Offline" });
  }
};

const enforceRuntimeLimit = async (cache) => {
  const keys = await cache.keys();
  if (keys.length <= MAX_RUNTIME_ENTRIES) {
    return;
  }

  const overflow = keys.length - MAX_RUNTIME_ENTRIES;
  for (let i = 0; i < overflow; i += 1) {
    await cache.delete(keys[i]);
  }
};
