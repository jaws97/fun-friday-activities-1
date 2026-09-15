import { useState, useEffect } from "react";

/* Live list of everyone who scanned the QR and joined. Polls the registry
   so names appear as they come in. Admin can shuffle everyone randomly
   into the teams (round-robin, so sizes stay even), drop a stray entry,
   or clear the lot. Assignments live in the shared event state, so they
   survive refresh and show up on each player's own /join page. */
export function PlayersTab({ admin, teams, playerTeams, setPlayerTeams }) {
  const [players, setPlayers] = useState([]);
  const [confirmClear, setConfirmClear] = useState(false);

  const load = async () => {
    try {
      const r = await fetch("/api/players", { cache: "no-store" });
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
    setPlayerTeams({});
    load();
  };

  const shuffle = () => {
    const order = [...players];
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    const next = {};
    order.forEach((p, i) => { next[p.id] = teams[i % teams.length].id; });
    setPlayerTeams(next);
  };

  const assigned = players.some((p) => playerTeams[p.id] !== undefined);
  const late = players.filter((p) => playerTeams[p.id] === undefined);

  /* Late joiners: drop each one into whichever team is currently smallest,
     so existing teams are never reshuffled. */
  const seatLate = () => {
    const next = { ...playerTeams };
    const size = Object.fromEntries(teams.map((t) => [t.id, 0]));
    players.forEach((p) => { if (next[p.id] !== undefined && size[next[p.id]] !== undefined) size[next[p.id]] += 1; });
    late.forEach((p) => {
      const smallest = teams.reduce((a, b) => (size[b.id] < size[a.id] ? b : a));
      next[p.id] = smallest.id;
      size[smallest.id] += 1;
    });
    setPlayerTeams(next);
  };
  const seatOne = (playerId, teamId) => setPlayerTeams({ ...playerTeams, [playerId]: teamId });

  const chip = (p, i, pick) => (
    <div key={p.id} className="player-chip">
      <span className="player-num">{String(i + 1).padStart(2, "0")}</span>
      <span className="player-name">{p.name}</span>
      {admin && pick === true && (
        <select className="player-pick" value="" title="Seat on a team" onChange={(e) => seatOne(p.id, Number(e.target.value))}>
          <option value="" disabled>Team…</option>
          {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      )}
      {admin && <button className="player-x" title="Remove" onClick={() => remove(p.id)}>✕</button>}
    </div>
  );

  return (
    <div className="panel" key="players">
      <h2>Players <span className="super-tag" style={{ background: "#2F9BD6" }}>{players.length} JOINED</span></h2>
      <p className="hint">
        Hit the QR button up top and put it on the big screen. Everyone scans, types a name, and shows up
        here live. Shuffle deals the room evenly into the ten teams — each player's phone reveals their
        team the moment you do.
      </p>
      {admin && players.length > 0 && (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18 }}>
          <button className="btn gold" onClick={shuffle}>{assigned ? "Re-shuffle teams" : "Shuffle into teams"}</button>
          {assigned && late.length > 0 && (
            <button className="btn gold" onClick={seatLate}>Seat {late.length} late {late.length === 1 ? "joiner" : "joiners"}</button>
          )}
          {assigned && <button className="btn ghost" onClick={() => setPlayerTeams({})}>Clear assignments</button>}
        </div>
      )}
      {players.length === 0 ? (
        <div className="deck-meta">Nobody yet — show the QR and watch this fill up.</div>
      ) : !assigned ? (
        <div className="player-grid">{players.map(chip)}</div>
      ) : (
        <>
          {teams.map((t) => {
            const members = players.filter((p) => playerTeams[p.id] === t.id);
            return (
              <div key={t.id} style={{ marginBottom: 6 }}>
                <div className="subhead" style={{ color: t.color }}>{t.name} · {members.length}</div>
                <div className="player-grid">{members.map(chip)}</div>
              </div>
            );
          })}
          {late.length > 0 && (
            <div style={{ marginBottom: 6 }}>
              <div className="subhead" style={{ color: "var(--mut)" }}>Joined after the shuffle · pick a team or hit Seat</div>
              <div className="player-grid">{late.map((p, i) => chip(p, i, true))}</div>
            </div>
          )}
        </>
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
