import { put, del, list } from "@vercel/blob";

/* Player registry for the /join QR flow — one blob per player.

   Why not one document for all players: the public Blob store serves reads
   up to a minute stale, so read-modify-write of a shared list collided
   under a burst of scans (1 of 18 survived in a live test). A blob per
   player has nothing to collide with; the only shared operation is the
   listing, and clients ask for it on demand rather than polling.
   GET    /api/players        -> all players, oldest first
   POST   /api/players        -> {name} adds a player, returns the record
   PUT    /api/players        -> {id, name} renames; same id, returns the record
   DELETE /api/players?id=X   -> removes one player (no id: removes all)

   Each player is one blob under players/, so simultaneous signups never
   race each other. The whole record lives in the PATHNAME:
       players/<id>~<base64url(name)>.json
   so a GET is a single list() call — no per-player fetch of blob bodies.
   The old shape (one fetch per player, with the name in the body) was
   fragile: any fetch that failed silently dropped that player, and if
   they all failed the response was an empty list. Now a failure is a
   503 and the client keeps what it last saw.

   The id never changes. A rename writes a new pathname (blob pathnames
   are immutable, and overwrites are cached for up to a minute) and
   deletes the old one; team assignments keyed by id survive it. */

const PREFIX = "players/";
const SEP = "~";

export const encodeName = (name) => Buffer.from(name, "utf8").toString("base64url");
export const decodeName = (b64) => Buffer.from(b64, "base64url").toString("utf8");

export const pathFor = (id, name) => `${PREFIX}${id}${SEP}${encodeName(name)}.json`;

/* players/<id>~<b64>.json -> {id, name, joinedAt}; null for anything else. */
export const parsePath = (pathname) => {
  if (!pathname.startsWith(PREFIX) || !pathname.endsWith(".json")) return null;
  const stem = pathname.slice(PREFIX.length, -".json".length);
  const at = stem.indexOf(SEP);
  if (at < 0) return null;
  const id = stem.slice(0, at);
  const name = decodeName(stem.slice(at + 1));
  const joinedAt = Number(id.split("-")[0]) || 0;
  return name ? { id, name, joinedAt } : null;
};

/* Every blob under the prefix, following pagination. */
async function allBlobs(prefix = PREFIX) {
  const out = [];
  let cursor;
  do {
    const page = await list({ prefix, cursor, limit: 1000 });
    out.push(...page.blobs);
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return out;
}

/* Blobs written before the pathname format carried the name still hold
   it in the body. Read those the old way; a failed read is an error, not
   a silently missing player. */
async function legacyPlayer(blob) {
  const r = await fetch(blob.url, { cache: "no-store" });
  if (!r.ok) throw new Error(`blob read failed: ${r.status}`);
  const p = await r.json();
  if (!p || !p.id || !p.name) throw new Error("blob body malformed");
  return { id: String(p.id), name: String(p.name), joinedAt: Number(p.joinedAt) || 0 };
}

async function loadPlayers() {
  const blobs = await allBlobs();
  const players = await Promise.all(blobs.map((b) => parsePath(b.pathname) ?? legacyPlayer(b)));
  players.sort((a, b) => a.joinedAt - b.joinedAt);
  return { players, blobs };
}

const blobsFor = (blobs, id) => blobs.filter((b) => {
  const p = parsePath(b.pathname);
  return p ? p.id === id : b.pathname === `${PREFIX}${id}.json`;
});

const writePlayer = (player) =>
  put(pathFor(player.id, player.name), JSON.stringify(player), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });

const readJson = (req) => (typeof req.body === "string" ? JSON.parse(req.body) : req.body);

export default async function handler(req, res) {
  res.setHeader("x-event-state", "1");
  res.setHeader("Cache-Control", "no-store");
  try {
    if (req.method === "GET") {
      const { players } = await loadPlayers();
      res.status(200).json(players);
      return;
    }
    if (req.method === "POST") {
      const name = String(readJson(req)?.name ?? "").trim().slice(0, 40);
      if (!name) {
        res.status(400).send("name required");
        return;
      }
      const { players } = await loadPlayers();
      if (players.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
        res.status(409).send("name taken");
        return;
      }
      const now = Date.now();
      const player = { id: `${now}-${Math.random().toString(36).slice(2, 8)}`, name, joinedAt: now };
      await writePlayer(player);
      res.status(200).json(player);
      return;
    }
    if (req.method === "PUT") {
      const body = readJson(req);
      const name = String(body?.name ?? "").trim().slice(0, 40);
      const id = String(body?.id ?? "");
      if (!name || !id) {
        res.status(400).send("id and name required");
        return;
      }
      const { players, blobs } = await loadPlayers();
      const existing = players.find((p) => p.id === id);
      if (!existing) {
        res.status(404).send("player not found");
        return;
      }
      if (players.some((p) => p.id !== id && p.name.toLowerCase() === name.toLowerCase())) {
        res.status(409).send("name taken");
        return;
      }
      const player = { id, name, joinedAt: existing.joinedAt };
      if (name !== existing.name) {
        await writePlayer(player);
        const old = blobsFor(blobs, id);
        if (old.length) await del(old.map((b) => b.url));
      }
      res.status(200).json(player);
      return;
    }
    if (req.method === "DELETE") {
      const id = req.query?.id;
      const blobs = id ? blobsFor(await allBlobs(), String(id)) : await allBlobs();
      if (blobs.length) await del(blobs.map((b) => b.url));
      res.status(200).send("ok");
      return;
    }
    res.status(405).end();
  } catch (e) {
    /* Never answer with a partial or empty list: the console keeps its
       last good copy on any non-2xx and retries on the next poll. */
    res.status(503).send(String(e));
  }
}
