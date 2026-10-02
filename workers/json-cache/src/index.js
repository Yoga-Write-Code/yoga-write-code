/**
 * Cloudflare Worker that caches successful JSON API responses for 5 minutes.
 *
 * It uses the Workers Cache API (`caches.default`), which only stores GET
 * responses and honors the `Cache-Control` header on the stored response.
 *
 * Local dev:   npx wrangler dev
 * Deploy:      npx wrangler deploy
 */

/** Five minutes, in seconds. */
const TTL_SECONDS = 300;

export default {
  async fetch(request, env, ctx) {
    // The Cache API only stores GET responses, so let everything else through.
    if (request.method !== "GET") {
      return fetch(request);
    }

    const cache = caches.default;
    // The URL (including query string) is the cache key. Rewrapping as a plain
    // GET request keeps per-request headers out of the key.
    const cacheKey = new Request(request.url, { method: "GET" });

    const cached = await cache.match(cacheKey);
    if (cached) {
      return withCacheStatus(cached, "HIT");
    }

    const response = await fetch(request);

    const contentType = response.headers.get("content-type") ?? "";
    const isJson = contentType.includes("application/json");
    if (!response.ok || !isJson) {
      // Don't cache errors or non-JSON payloads.
      return withCacheStatus(response, "BYPASS");
    }

    // Clone the body because it can only be consumed once; rewrap so the stored
    // copy keeps the origin's headers, then override the caching directive.
    const cacheable = new Response(response.clone().body, response);
    cacheable.headers.set(
      "Cache-Control",
      `public, s-maxage=${TTL_SECONDS}, stale-while-revalidate=60`,
    );

    // Store in the background so the client isn't kept waiting.
    ctx.waitUntil(cache.put(cacheKey, cacheable.clone()));

    return withCacheStatus(response, "MISS");
  },
};

function withCacheStatus(response, status) {
  const result = new Response(response.body, response);
  result.headers.set("X-Cache", status);
  return result;
}
