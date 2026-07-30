import { put, del, list } from "@vercel/blob";

/* Vercel serverless twin of the dev-server middleware in vite.config.js.
   Same /api/state contract, but the JSON lives in Vercel Blob storage
   (serverless functions have no persistent disk). */

const PATHNAME = "event-state.json";

export default async function handler(req, res) {
  // Lets the client distinguish this API from a host's generic 404 page.
  res.setHeader("x-event-state", "1");
  try {
    if (req.method === "GET") {
      const { blobs } = await list({ prefix: PATHNAME, limit: 1 });
      if (!blobs.length) {
        res.status(404).end();
        return;
      }
      // Unique query string bypasses the blob CDN cache so polls see fresh data.
      const data = await fetch(`${blobs[0].url}?t=${Date.now()}`).then((r) => r.text());
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
      await put(PATHNAME, JSON.stringify(body, null, 2), {
        access: "public",
        contentType: "application/json",
        addRandomSuffix: false,
        allowOverwrite: true,
      });
      res.status(200).send("ok");
      return;
    }
    if (req.method === "DELETE") {
      const { blobs } = await list({ prefix: PATHNAME, limit: 1 });
      if (blobs.length) await del(blobs[0].url);
      res.status(200).send("ok");
      return;
    }
    res.status(405).end();
  } catch (e) {
    res.status(500).send(String(e));
  }
}
