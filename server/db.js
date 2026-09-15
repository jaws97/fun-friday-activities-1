import postgres from "postgres";

/* Storage for the two API routes: Postgres (Supabase, via Vercel's
   Marketplace integration, which injects POSTGRES_URL).

   Why Postgres after Vercel Blob: Blob's Hobby tier allows 2,000 listing/
   write operations a month and then locks the store for 30 days, and its
   reads lag writes by up to a minute. Supabase's free tier has no request
   cap, reads are immediately consistent, and unique names / concurrent
   joins are handled by the database itself.

   Everything below is written against a tiny `query(text, params)` adapter
   so the same logic runs on postgres.js in production and on an in-process
   Postgres (PGlite) in tests. */

const SCHEMA = `
  create table if not exists players (
    id        text primary key,
    name      text not null,
    name_key  text not null unique,
    joined_at bigint not null
  );
  create table if not exists event_state (
    id         int primary key default 1 check (id = 1),
    value      jsonb not null,
    updated_at timestamptz not null default now()
  );
`;

const nameKey = (name) => name.trim().toLowerCase();
const isUniqueViolation = (e) => e?.code === "23505" || /unique|duplicate key/i.test(String(e?.message ?? e));

/* The store: plain functions over `query`, schema created on first use. */
export const makeStore = (query) => {
  let ready = null;
  const ensure = () => (ready ??= query(SCHEMA, []).then(() => true));
  const q = async (text, params = []) => { await ensure(); return query(text, params); };
  const row = (r) => ({ id: r.id, name: r.name, joinedAt: Number(r.joined_at) });

  return {
    async listPlayers() {
      const rows = await q("select id, name, joined_at from players order by joined_at asc, id asc");
      return rows.map(row);
    },

    /* -> player, or null when the name is already taken (case-insensitive). */
    async addPlayer(name) {
      const now = Date.now();
      const id = `${now}-${Math.random().toString(36).slice(2, 8)}`;
      const rows = await q(
        "insert into players (id, name, name_key, joined_at) values ($1, $2, $3, $4) on conflict (name_key) do nothing returning id, name, joined_at",
        [id, name, nameKey(name), now]
      );
      return rows.length ? row(rows[0]) : null;
    },

    /* -> { player } | { notFound } | { taken } */
    async renamePlayer(id, name) {
      try {
        const rows = await q(
          "update players set name = $2, name_key = $3 where id = $1 returning id, name, joined_at",
          [id, name, nameKey(name)]
        );
        return rows.length ? { player: row(rows[0]) } : { notFound: true };
      } catch (e) {
        if (isUniqueViolation(e)) return { taken: true };
        throw e;
      }
    },

    async removePlayer(id) { await q("delete from players where id = $1", [id]); },
    async removeAllPlayers() { await q("delete from players"); },

    async readState() {
      const rows = await q("select value from event_state where id = 1");
      return rows.length ? rows[0].value : null;
    },
    async writeState(value) {
      await q(
        "insert into event_state (id, value) values (1, $1::jsonb) on conflict (id) do update set value = excluded.value, updated_at = now()",
        [JSON.stringify(value)]
      );
    },
    async removeState() { await q("delete from event_state where id = 1"); },
  };
};

/* Production adapter: postgres.js over the pooled Supabase URL. One shared
   connection per function instance; `prepare: false` because the pooler
   runs in transaction mode. */
let sqlClient = null;
const sql = () => {
  if (sqlClient) return sqlClient;
  const url = process.env.POSTGRES_URL || process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
  if (!url) throw new Error("No database configured: set POSTGRES_URL (Vercel → Storage → Supabase)");
  sqlClient = postgres(url, {
    prepare: false,
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
    ...(url.includes("sslmode=") ? {} : { ssl: "require" }),
  });
  return sqlClient;
};

export const store = makeStore((text, params) => sql().unsafe(text, params));
