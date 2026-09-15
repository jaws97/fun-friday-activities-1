import { useState, useEffect } from "react";

/* Live list of everyone who scanned the QR and joined. Polls the registry
   so names appear as they come in. Admin can shuffle everyone randomly
   into the teams (round-robin, so sizes stay even), drop a stray entry,
   or clear the lot. Assignments live in the shared event state, so they
   survive refresh and show up on each player's own /join page. */
export function PlayersTab({ admin, teams, playerTeams, setPlayerTeams, resizeRoster, maxTeams }) {
  const [players, setPlayers] = useState([]);
  /* How many teams the next shuffle deals into. Until the host picks a count
     or a size, it follows the room: five per team, from however many have
     joined so far. */
  const [chosenCount, setChosenCount] = useState(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [newName, setNewName] = useState("");
  const [addError, setAddError] = useState("");
  const [adding, setAdding] = useState(false);

  const load = async () => {
    try {
      const r = await fetch("/api/players", { cache: "no-store" });
      if (r.ok && r.headers.get("x-event-state")) setPlayers(await r.json());
    } catch (e) { /* backend unreachable — keep last list */ }
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 10000); // one storage read per poll: keep it slow
    return () => clearInterval(id);
  }, []);

  /* Host adds someone who has no phone or won't scan. Goes through the same
     registry as the QR flow, so they show up unassigned and can be seated. */
  const addByName = async (e) => {
    e.preventDefault();
    const clean = newName.trim();
    if (!clean || adding) return;
    setAdding(true);
    setAddError("");
    try {
      const r = await fetch("/api/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: clean }),
      });
      if (r.status === 409) setAddError("That name's already on the list");
      else if (!r.ok) setAddError("Couldn't add — try again");
      else setNewName("");
    } catch (err) {
      setAddError("Couldn't add — check the connection");
    }
    setAdding(false);
    load();
  };

  const remove = async (id) => {
    try { await fetch(`/api/players?id=${id}`, { method: "DELETE" }); } catch (e) { /* retry next poll */ }
    setPlayerTeams(({ [id]: _dropped, ...rest }) => rest);
    load();
  };
  const clearAll = async () => {
    try { await fetch("/api/players", { method: "DELETE" }); } catch (e) { /* retry next poll */ }
    setConfirmClear(false);
    setPlayerTeams({});
    load();
  };

  const DEFAULT_SIZE = 5;
  const clampCount = (n) => Math.max(2, Math.min(maxTeams, n));
  const teamCount = chosenCount ?? clampCount(Math.ceil(players.length / DEFAULT_SIZE));
  const setTeamCount = setChosenCount;

  const shuffle = () => {
    const roster = resizeRoster(teamCount);
    const order = [...players];
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    const next = {};
    order.forEach((p, i) => { next[p.id] = roster[i % roster.length].id; });
    setPlayerTeams(next);
  };

  /* Team size is the other way of saying team count: pick 5 per team with
     48 players and you get 10 teams (two of them a player short). */
  const sizeFor = (count) => Math.ceil(players.length / count);
  const teamSize = players.length ? sizeFor(teamCount) : 0;
  const sizeOptions = players.length ? [...new Set(Array.from({ length: maxTeams - 1 }, (_, i) => sizeFor(i + 2)))].sort((a, b) => a - b) : [];
  const pickSize = (size) => setTeamCount(clampCount(Math.ceil(players.length / size)));
  const lo = players.length ? Math.floor(players.length / teamCount) : 0;
  const hi = players.length ? Math.ceil(players.length / teamCount) : 0;

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

  /* Once the shuffle has run, every chip carries a team picker: unseated
     players get a blank "Team…" prompt, seated players show their current
     team and can be moved to another with one change. */
  const chip = (p, i, pick) => (
    <div key={p.id} className="player-chip">
      <span className="player-num">{String(i + 1).padStart(2, "0")}</span>
      <span className="player-name">{p.name}</span>
      {admin && (pick === true || playerTeams[p.id] !== undefined) && (
        <select
          className="player-pick"
          value={playerTeams[p.id] ?? ""}
          title={pick === true ? "Seat on a team" : "Move to another team"}
          onChange={(e) => seatOne(p.id, Number(e.target.value))}
        >
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
      {admin && (
        <form className="add-player" onSubmit={addByName}>
          <input
            className="join-input add-player-input"
            placeholder="Add someone by name (no phone?)"
            value={newName}
            maxLength={40}
            onChange={(e) => { setNewName(e.target.value); setAddError(""); }}
          />
          <button className="btn ghost" type="submit" disabled={adding || !newName.trim()}>{adding ? "ADDING…" : "ADD"}</button>
          {addError && <span className="join-error">{addError}</span>}
        </form>
      )}
      {admin && players.length > 0 && (
        <div className="shuffle-setup">
          <label className="shuffle-field">
            <span>TEAMS</span>
            <select value={teamCount} onChange={(e) => setTeamCount(Number(e.target.value))}>
              {Array.from({ length: maxTeams - 1 }, (_, i) => i + 2).map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
          <label className="shuffle-field">
            <span>PER TEAM</span>
            <select value={teamSize} onChange={(e) => pickSize(Number(e.target.value))}>
              {sizeOptions.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
          <span className="deck-meta">
            {players.length} players → {teamCount} teams of {lo === hi ? lo : `${lo}–${hi}`}
            {teamCount !== teams.length && ` · roster goes from ${teams.length} to ${teamCount} on shuffle`}
          </span>
        </div>
      )}
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
