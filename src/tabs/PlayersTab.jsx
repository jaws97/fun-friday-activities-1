import { useState, useEffect } from "react";

/* Live list of everyone who scanned the QR and joined. Polls the registry
   so names appear as they come in. Admin can drop a stray entry or clear
   the lot; this list is the base for team allocation and player points. */
export function PlayersTab({ admin }) {
  const [players, setPlayers] = useState([]);
  const [confirmClear, setConfirmClear] = useState(false);

  const load = async () => {
    try {
      const r = await fetch("/api/players");
      if (r.ok && r.headers.get("x-event-state")) setPlayers(await r.json());
    } catch (e) { /* backend unreachable — keep last list */ }
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 3000);
    return () => clearInterval(id);
  }, []);

  const remove = async (id) => {
    try { await fetch(`/api/players?id=${id}`, { method: "DELETE" }); } catch (e) { /* retry next poll */ }
    load();
  };
  const clearAll = async () => {
    try { await fetch("/api/players", { method: "DELETE" }); } catch (e) { /* retry next poll */ }
    setConfirmClear(false);
    load();
  };

  return (
    <div className="panel" key="players">
      <h2>Players <span className="super-tag" style={{ background: "#2F9BD6" }}>{players.length} JOINED</span></h2>
      <p className="hint">
        Hit the QR button up top and put it on the big screen. Everyone scans, types a name, and shows up
        here live — the raw material for team allocation and individual points.
      </p>
      {players.length === 0 ? (
        <div className="deck-meta">Nobody yet — show the QR and watch this fill up.</div>
      ) : (
        <div className="player-grid">
          {players.map((p, i) => (
            <div key={p.id} className="player-chip">
              <span className="player-num">{String(i + 1).padStart(2, "0")}</span>
              <span className="player-name">{p.name}</span>
              {admin && <button className="player-x" title="Remove" onClick={() => remove(p.id)}>✕</button>}
            </div>
          ))}
        </div>
      )}
      {admin && players.length > 0 && (
        <div style={{ marginTop: 22, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          {confirmClear ? (
            <>
              <span style={{ fontSize: 13, color: "#FF97A6", fontWeight: 700 }}>Remove all {players.length} players?</span>
              <button className="btn danger" onClick={clearAll}>Yes, clear the list</button>
              <button className="btn ghost" onClick={() => setConfirmClear(false)}>Cancel</button>
            </>
          ) : (
            <button className="btn danger" onClick={() => setConfirmClear(true)}>Clear all players</button>
          )}
        </div>
      )}
    </div>
  );
}
