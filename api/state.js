import { makeDoc } from "../server/blobDoc.js";

/* Vercel serverless twin of the dev-server middleware in vite.config.js.
   Same /api/state contract; the JSON lives in one Vercel Blob document,
   overwritten in place and read fresh from origin (see server/blobDoc.js). */

export const makeHandler = (doc = makeDoc("event-state.json")) => async (req, res) => {
  res.setHeader("x-event-state", "1");
  res.setHeader("Cache-Control", "no-store");
  try {
    if (req.method === "GET") {
      const cur = await doc.read();
      if (!cur) {
        res.status(404).end();
        return;
      }
      res.setHeader("Content-Type", "application/json");
      if (cur.url) res.setHeader("x-blob-url", cur.url);
      res.status(200).send(JSON.stringify(cur.value));
      return;
    }
    if (req.method === "POST" || req.method === "PUT") {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      if (!body || typeof body !== "object") {
        res.status(400).send("invalid json");
        return;
      }
      await doc.write(body);
      res.status(200).send("ok");
      return;
    }
    if (req.method === "DELETE") {
      try { await doc.remove(); } catch (e) { /* nothing saved yet */ }
      res.status(200).send("ok");
      return;
    }
    res.status(405).end();
  } catch (e) {
    res.status(503).send(String(e));
  }
};

export default makeHandler();
