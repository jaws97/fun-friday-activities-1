import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";

const STATE_FILE = path.resolve(process.cwd(), "event-state.json");
const PLAYERS_FILE = path.resolve(process.cwd(), "players.json");

const readBody = (req) =>
  new Promise((resolve) => {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => resolve(body));
  });

const readPlayers = () =>
  fs.existsSync(PLAYERS_FILE) ? JSON.parse(fs.readFileSync(PLAYERS_FILE, "utf8")) : [];

/* Dev twins of the Vercel functions in api/: persists the event state and
   the /join player registry as real JSON files on disk.
   GET/POST/DELETE /api/state    <-> event-state.json
   GET/POST/DELETE /api/players  <-> players.json */
function eventApi() {
  const handler = async (req, res, next) => {
    const [url, query] = req.url.split("?");
    if (url !== "/api/state" && url !== "/api/players") return next();
    res.setHeader("x-event-state", "1");

    if (url === "/api/state") {
      if (req.method === "GET") {
        if (fs.existsSync(STATE_FILE)) {
          res.setHeader("Content-Type", "application/json");
          res.end(fs.readFileSync(STATE_FILE));
        } else {
          res.statusCode = 404;
          res.end();
        }
        return;
      }
      if (req.method === "POST" || req.method === "PUT") {
        try {
          fs.writeFileSync(STATE_FILE, JSON.stringify(JSON.parse(await readBody(req)), null, 2));
          res.end("ok");
        } catch (e) {
          res.statusCode = 400;
          res.end("invalid json");
        }
        return;
      }
      if (req.method === "DELETE") {
        fs.rmSync(STATE_FILE, { force: true });
        res.end("ok");
        return;
      }
    }

    if (url === "/api/players") {
      if (req.method === "GET") {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(readPlayers()));
        return;
      }
      if (req.method === "POST") {
        try {
          const { name } = JSON.parse(await readBody(req));
          const clean = String(name ?? "").trim().slice(0, 40);
          if (!clean) {
            res.statusCode = 400;
            res.end("name required");
            return;
          }
          const players = readPlayers();
          if (players.some((p) => p.name.toLowerCase() === clean.toLowerCase())) {
            res.statusCode = 409;
            res.end("name taken");
            return;
          }
          const player = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, name: clean, joinedAt: Date.now() };
          fs.writeFileSync(PLAYERS_FILE, JSON.stringify([...players, player], null, 2));
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(player));
        } catch (e) {
          res.statusCode = 400;
          res.end("invalid json");
        }
        return;
      }
      if (req.method === "PUT") {
        try {
          const { id, name } = JSON.parse(await readBody(req));
          const clean = String(name ?? "").trim().slice(0, 40);
          const players = readPlayers();
          const target = players.find((p) => p.id === id);
          if (!clean || !target) {
            res.statusCode = target ? 400 : 404;
            res.end(target ? "name required" : "player not found");
            return;
          }
          target.name = clean;
          fs.writeFileSync(PLAYERS_FILE, JSON.stringify(players, null, 2));
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(target));
        } catch (e) {
          res.statusCode = 400;
          res.end("invalid json");
        }
        return;
      }
      if (req.method === "DELETE") {
        const id = new URLSearchParams(query || "").get("id");
        if (id) fs.writeFileSync(PLAYERS_FILE, JSON.stringify(readPlayers().filter((p) => p.id !== id), null, 2));
        else fs.rmSync(PLAYERS_FILE, { force: true });
        res.end("ok");
        return;
      }
    }

    res.statusCode = 405;
    res.end();
  };
  return {
    name: "event-api",
    configureServer(server) { server.middlewares.use(handler); },
    configurePreviewServer(server) { server.middlewares.use(handler); },
  };
}

export default defineConfig({
  plugins: [react(), eventApi()],
  server: {
    port: Number(process.env.PORT) || 5199,
    strictPort: true,
    host: true,
  },
});
