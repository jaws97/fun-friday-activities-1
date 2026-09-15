import { store as db } from "../server/db.js";

/* Player registry for the /join QR flow, one Postgres row per player.
   GET    /api/players        -> all players, oldest first
   POST   /api/players        -> {name} adds a player, returns the record
   PUT    /api/players        -> {id, name} renames; same id, returns the record
   DELETE /api/players?id=X   -> removes one player (no id: removes all)

   Names are unique case-insensitively at the database level, so a burst of
   simultaneous scans can't collide or double-register. Ids never change,
   so team assignments keyed by id survive renames. A failed read answers
   503, never an empty list, so the console keeps what it last saw. */

const readJson = (req) => (typeof req.body === "string" ? JSON.parse(req.body) : req.body);
const cleanName = (v) => String(v ?? "").trim().slice(0, 40);

export const makeHandler = (store = db) => async (req, res) => {
  res.setHeader("x-event-state", "1");
  res.setHeader("Cache-Control", "no-store");
  try {
    if (req.method === "GET") {
      res.status(200).json(await store.listPlayers());
      return;
    }
    if (req.method === "POST") {
      const name = cleanName(readJson(req)?.name);
      if (!name) {
        res.status(400).send("name required");
        return;
      }
      const player = await store.addPlayer(name);
      if (!player) {
        res.status(409).send("name taken");
        return;
      }
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
      const r = await store.renamePlayer(id, name);
      if (r.notFound) { res.status(404).send("player not found"); return; }
      if (r.taken) { res.status(409).send("name taken"); return; }
      res.status(200).json(r.player);
      return;
    }
    if (req.method === "DELETE") {
      const id = req.query?.id;
      if (id) await store.removePlayer(String(id));
      else await store.removeAllPlayers();
      res.status(200).send("ok");
      return;
    }
    res.status(405).end();
  } catch (e) {
    res.status(503).send(String(e));
  }
};

export default makeHandler();
