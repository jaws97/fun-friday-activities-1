import { put, del, list } from "@vercel/blob";

/* Vercel serverless twin of the dev-server middleware in vite.config.js.
   Same /api/state contract, but the JSON lives in Vercel Blob storage
   (serverless functions have no persistent disk).

   Each save writes a NEW timestamped blob instead of overwriting one:
   Blob overwrites are eventually consistent (stale reads for up to ~60s),
   which made fresh scores vanish on refresh. New blobs are readable
   immediately. GET serves the newest; POST prunes the older ones. */

const PREFIX = "event-state/";

async function newestFirst() {
  const { blobs } = await list({ prefix: PREFIX });
  // Pathnames embed Date.now(), fixed 13 digits — string sort is time sort.
  return blobs.sort((a, b) => (a.pathname < b.pathname ? 1 : -1));
}

export default async function handler(req, res) {
  // Lets the client distinguish this API from a host's generic 404 page.
  res.setHeader("x-event-state", "1");
  try {
    if (req.method === "GET") {
      const blobs = await newestFirst();
      if (!blobs.length) {
        res.status(404).end();
        return;
      }
      const data = await fetch(blobs[0].url).then((r) => r.text());
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Cache-Control", "no-store");
      res.status(200).send(data);
      return;
    }
    if (req.method === "POST" || req.method === "PUT") {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      if (!body || typeof body !== "object") {
        res.status(400).send("invalid json");
        return;
      }
      const saved = await put(`${PREFIX}${Date.now()}.json`, JSON.stringify(body, null, 2), {
        access: "public",
        contentType: "application/json",
        addRandomSuffix: false,
        allowOverwrite: true,
      });
      try {
        const stale = (await newestFirst()).filter((b) => b.pathname !== saved.pathname);
        if (stale.length) await del(stale.map((b) => b.url));
      } catch (e) { /* cleanup is best-effort */ }
      res.status(200).send("ok");
      return;
    }
    if (req.method === "DELETE") {
      const blobs = await newestFirst();
      if (blobs.length) await del(blobs.map((b) => b.url));
      res.status(200).send("ok");
      return;
    }
    res.status(405).end();
  } catch (e) {
    res.status(500).send(String(e));
  }
}
