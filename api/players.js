import { makeDoc } from "../server/blobDoc.js";

/* Player registry for the /join QR flow.
   GET    /api/players        -> all players, oldest first
   POST   /api/players        -> {name} adds a player, returns the record
   PUT    /api/players        -> {id, name} renames; same id, returns the record
   DELETE /api/players?id=X   -> removes one player (no id: removes all)

   All players live in ONE blob document (players.json). Simultaneous joins
   can't trample each other because every write is conditional on the
   ETag read moments before, and retries on conflict (see server/blobDoc.js).
   A failed read answers 503, never an empty list, so the console keeps
   what it last saw. Player ids never change, so team assignments keyed
   by id survive renames. */

const readJson = (req) => (typeof req.body === "string" ? JSON.parse(req.body) : req.body);
const cleanName = (v) => String(v ?? "").trim().slice(0, 40);
const sameName = (a, b) => a.toLowerCase() === b.toLowerCase();

export const makeHandler = (doc = makeDoc("players.json")) => async (req, res) => {
  res.setHeader("x-event-state", "1");
  res.setHeader("Cache-Control", "no-store");
  try {
    if (req.method === "GET") {
      const cur = await doc.read();
      const players = cur ? cur.value : [];
      res.status(200).json([...players].sort((a, b) => a.joinedAt - b.joinedAt));
      return;
    }

    if (req.method === "POST") {
      const name = cleanName(readJson(req)?.name);
      if (!name) {
        res.status(400).send("name required");
        return;
      }
      let taken = false;
      const now = Date.now();
      const player = { id: `${now}-${Math.random().toString(36).slice(2, 8)}`, name, joinedAt: now };
      const r = await doc.update((list) => {
        const players = list ?? [];
        if (players.some((p) => sameName(p.name, name))) { taken = true; return undefined; }
        return [...players, player];
      });
      if (taken) { res.status(409).send("name taken"); return; }
      if (!r.ok) { res.status(503).send("busy, try again"); return; }
      res.status(200).json(player);
      return;
    }

    if (req.method === "PUT") {
      const body = readJson(req);
      const name = cleanName(body?.name);
      const id = String(body?.id ?? "");
      if (!name || !id) {
        res.status(400).send("id and name required");
        return;
      }
      let status = 200;
      let updated = null;
      const r = await doc.update((list) => {
        const players = list ?? [];
        const existing = players.find((p) => p.id === id);
        if (!existing) { status = 404; return undefined; }
        if (players.some((p) => p.id !== id && sameName(p.name, name))) { status = 409; return undefined; }
        updated = { ...existing, name };
        if (existing.name === name) return undefined;
        return players.map((p) => (p.id === id ? updated : p));
      });
      if (status === 404) { res.status(404).send("player not found"); return; }
      if (status === 409) { res.status(409).send("name taken"); return; }
      if (!r.ok) { res.status(503).send("busy, try again"); return; }
      res.status(200).json(updated);
      return;
    }

    if (req.method === "DELETE") {
      const id = req.query?.id;
      if (!id) {
        try { await doc.remove(); } catch (e) { /* nothing to remove */ }
        res.status(200).send("ok");
        return;
      }
      const r = await doc.update((list) => {
        const players = list ?? [];
        return players.some((p) => p.id === String(id)) ? players.filter((p) => p.id !== String(id)) : undefined;
      });
      if (!r.ok) { res.status(503).send("busy, try again"); return; }
      res.status(200).send("ok");
      return;
    }

    res.status(405).end();
  } catch (e) {
    res.status(503).send(String(e));
  }
};

export default makeHandler();
