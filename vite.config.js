import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";

const STATE_FILE = path.resolve(process.cwd(), "event-state.json");

/* Serves and persists the event state as a real JSON file on disk.
   GET    /api/state  -> contents of event-state.json (404 if none yet)
   POST   /api/state  -> writes request body (validated JSON) to the file
   DELETE /api/state  -> removes the file */
function eventStateApi() {
  const handler = (req, res, next) => {
    if (!req.url.startsWith("/api/state")) return next();
    res.setHeader("x-event-state", "1");
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
      let body = "";
      req.on("data", (c) => (body += c));
      req.on("end", () => {
        try {
          fs.writeFileSync(STATE_FILE, JSON.stringify(JSON.parse(body), null, 2));
          res.end("ok");
        } catch (e) {
          res.statusCode = 400;
          res.end("invalid json");
        }
      });
      return;
    }
    if (req.method === "DELETE") {
      fs.rmSync(STATE_FILE, { force: true });
      res.end("ok");
      return;
    }
    next();
  };
  return {
    name: "event-state-api",
    configureServer(server) { server.middlewares.use(handler); },
    configurePreviewServer(server) { server.middlewares.use(handler); },
  };
}

export default defineConfig({
  plugins: [react(), eventStateApi()],
  server: {
    port: Number(process.env.PORT) || 5199,
    strictPort: true,
    host: true,
  },
});
