import { put, del, list } from "@vercel/blob";

/* Player registry for the /join QR flow. Each join writes its OWN blob
   under players/, so simultaneous signups never race each other.
   GET    /api/players        -> all players, oldest first
   POST   /api/players        -> {name} adds a player, returns the record
   PUT    /api/players        -> {id, name} renames; returns the new record
                                 (fresh blob + delete old — overwriting an
                                 existing blob would serve stale reads)
   DELETE /api/players?id=X   -> removes one player (no id: removes all) */

const PREFIX = "players/";

export default async function handler(req, res) {
  res.setHeader("x-event-state", "1");
  try {
    if (req.method === "GET") {
      const { blobs } = await list({ prefix: PREFIX });
      const players = await Promise.all(
        blobs.map((b) => fetch(b.url).then((r) => r.json()).catch(() => null))
      );
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Cache-Control", "no-store");
      res.status(200).json(players.filter(Boolean).sort((a, b) => a.joinedAt - b.joinedAt));
      return;
    }
    if (req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const name = String(body?.name ?? "").trim().slice(0, 40);
      if (!name) {
        res.status(400).send("name required");
        return;
      }
      const player = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, name, joinedAt: Date.now() };
      await put(`${PREFIX}${player.id}.json`, JSON.stringify(player), {
        access: "public",
        contentType: "application/json",
        addRandomSuffix: false,
      });
      res.status(200).json(player);
      return;
    }
    if (req.method === "PUT") {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const name = String(body?.name ?? "").trim().slice(0, 40);
      const id = String(body?.id ?? "");
      if (!name || !id) {
        res.status(400).send("id and name required");
        return;
      }
      const { blobs } = await list({ prefix: `${PREFIX}${id}.json` });
      if (!blobs.length) {
        res.status(404).send("player not found");
        return;
      }
      const existing = await fetch(blobs[0].url).then((r) => r.json()).catch(() => null);
      const player = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name,
        joinedAt: existing?.joinedAt ?? Date.now(),
      };
      await put(`${PREFIX}${player.id}.json`, JSON.stringify(player), {
        access: "public",
        contentType: "application/json",
        addRandomSuffix: false,
      });
      await del(blobs.map((b) => b.url));
      res.status(200).json(player);
      return;
    }
    if (req.method === "DELETE") {
      const id = req.query?.id;
      const { blobs } = await list({ prefix: id ? `${PREFIX}${id}.json` : PREFIX });
      if (blobs.length) await del(blobs.map((b) => b.url));
      res.status(200).send("ok");
      return;
    }
    res.status(405).end();
  } catch (e) {
    res.status(500).send(String(e));
  }
}
