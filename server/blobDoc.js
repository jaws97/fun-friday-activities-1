import * as realBlob from "@vercel/blob";

/* One JSON document in one blob, overwritten in place.

   Budget notes for the Hobby plan (2k "advanced" ops a month for put/list,
   10k "simple" ops for reads): a read here is one simple op and a write is
   one advanced op; no list() is involved.

   Freshness: the public store serves reads through a CDN cache with a
   60-second floor, and neither useCache:false nor a cache-busting query
   string gets past it (measured live). So a read can lag a write by up to
   a minute. That's fine for the event state — the host console holds the
   truth locally and saves; phones and the board read on demand and may be
   a little behind. Anything that can't tolerate the lag (the player
   registry) must not live in an overwritten document. */

const PUT_OPTS = {
  access: "public",
  contentType: "application/json",
  addRandomSuffix: false,
  allowOverwrite: true,
  cacheControlMaxAge: 60,
};

export const makeDoc = (pathname, blob = realBlob) => ({
  /* -> { value } or null when the document doesn't exist yet. */
  async read() {
    const r = await blob.get(pathname, { access: "public", useCache: false });
    if (!r || r.statusCode !== 200) return null;
    const text = await new Response(r.stream).text();
    return { value: JSON.parse(text) };
  },

  async write(value) {
    await blob.put(pathname, JSON.stringify(value), PUT_OPTS);
  },

  async remove() {
    await blob.del(pathname);
  },
});
