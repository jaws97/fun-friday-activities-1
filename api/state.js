import { store as db } from "../server/db.js";

/* Vercel serverless twin of the dev-server middleware in vite.config.js.
   Same /api/state contract; the JSON lives in one Postgres row (Supabase)
   and reads are immediately consistent. */

export const makeHandler = (store = db) => async (req, res) => {
  res.setHeader("x-event-state", "1");
  res.setHeader("Cache-Control", "no-store");
  try {
    if (req.method === "GET") {
      const value = await store.readState();
      if (value === null) {
        res.status(404).end();
        return;
      }
      res.setHeader("Content-Type", "application/json");
      res.status(200).send(JSON.stringify(value));
      return;
    }
    if (req.method === "POST" || req.method === "PUT") {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      if (!body || typeof body !== "object") {
        res.status(400).send("invalid json");
        return;
      }
      await store.writeState(body);
      res.status(200).send("ok");
      return;
    }
    if (req.method === "DELETE") {
      await store.removeState();
      res.status(200).send("ok");
      return;
    }
    res.status(405).end();
  } catch (e) {
    res.status(503).send(String(e));
  }
};

export default makeHandler();
