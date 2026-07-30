const API = "/api/state";

/* Storage adapter, in order of preference:
   1. The dev server's /api/state endpoint — persists to event-state.json on
      disk, so every browser that opens the link shares the same points.
   2. Claude artifact storage (window.storage) when running as an artifact.
   3. Browser localStorage as the last-resort local fallback. */
export const store = {
  async get(key) {
    try {
      const r = await fetch(API, { cache: "no-store" });
      // Only trust the response if it came from our API (the x-event-state
      // header) — a static host's generic 404 page must not shadow the
      // local fallbacks below.
      if (r.headers.get("x-event-state")) {
        if (r.ok) return { value: await r.text() };
        if (r.status === 404) return null;
      }
    } catch (e) { /* no server API — fall through */ }
    if (typeof window !== "undefined" && window.storage) return window.storage.get(key);
    const v = localStorage.getItem(key);
    return v !== null ? { value: v } : null;
  },
  async set(key, value) {
    try {
      const r = await fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: value });
      if (r.ok && r.headers.get("x-event-state")) return;
    } catch (e) { /* no server API — fall through */ }
    if (typeof window !== "undefined" && window.storage) return window.storage.set(key, value);
    localStorage.setItem(key, value);
  },
  async delete(key) {
    try {
      const r = await fetch(API, { method: "DELETE" });
      if (r.ok && r.headers.get("x-event-state")) return;
    } catch (e) { /* no server API — fall through */ }
    if (typeof window !== "undefined" && window.storage) return window.storage.delete(key);
    localStorage.removeItem(key);
  },
};
