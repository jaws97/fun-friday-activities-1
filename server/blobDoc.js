import * as realBlob from "@vercel/blob";

/* One JSON document in one blob, read fresh and written with optimistic
   concurrency. Built for the Hobby plan's budget: a read is a single
   origin fetch (a "simple" operation, 10k/month included) and a write is a
   single put (an "advanced" operation, 2k/month). Never a list(), which
   is also an advanced operation and was being spent on every poll.

   Overwrites are safe because reads bypass the CDN cache (useCache:false),
   and lost updates are prevented by ifMatch: a put only lands if the blob
   still carries the ETag we read, otherwise the caller re-reads and retries. */

const PUT_OPTS = {
  access: "public",
  contentType: "application/json",
  addRandomSuffix: false,
  allowOverwrite: true,
  cacheControlMaxAge: 60,
};

const isConflict = (e, blob) =>
  (blob.BlobPreconditionFailedError && e instanceof blob.BlobPreconditionFailedError) ||
  /precondition|etag|already exists/i.test(String(e));

export const makeDoc = (pathname, blob = realBlob) => ({
  /* -> { value, etag } or null when the document doesn't exist yet. */
  async read() {
    const r = await blob.get(pathname, { access: "public", useCache: false });
    if (!r || r.statusCode !== 200) return null;
    const text = await new Response(r.stream).text();
    return { value: JSON.parse(text), etag: r.blob.etag };
  },

  /* Unconditional write (state saves: last write wins). */
  async write(value) {
    await blob.put(pathname, JSON.stringify(value), PUT_OPTS);
  },

  /* Read-modify-write with retry. `mutate(current)` returns the next value,
     or undefined to leave the document alone (the caller has already
     decided what to answer). `current` is null when nothing exists yet. */
  async update(mutate, attempts = 40) {
    for (let i = 0; i < attempts; i++) {
      const cur = await this.read();
      const next = await mutate(cur ? cur.value : null);
      if (next === undefined) return { ok: true, value: cur ? cur.value : null, unchanged: true };
      try {
        /* Existing doc: land only if unchanged since our read. New doc: refuse
           to overwrite, so two simultaneous first writes can't clobber each other. */
        await blob.put(pathname, JSON.stringify(next), cur ? { ...PUT_OPTS, ifMatch: cur.etag } : { ...PUT_OPTS, allowOverwrite: false });
        return { ok: true, value: next };
      } catch (e) {
        if (!isConflict(e, blob)) throw e;
        /* Contention (a burst of scans at once): back off a little more each
           round, with jitter so the contenders spread out. */
        await new Promise((r) => setTimeout(r, Math.min(600, 30 * (i + 1)) + Math.random() * 150));
      }
    }
    return { ok: false };
  },

  async remove() {
    await blob.del(pathname);
  },
});
