import { useState } from "react";
import { CountUp } from "../components/CountUp.jsx";

export function TeamsTab({ admin, teams, addPoints, rename, resetEvent }) {
  const [confirmReset, setConfirmReset] = useState(false);
  return (
    <div className="panel" key="teams">
      <h2>Teams & Points</h2>
      <p className="hint">
        After the sticker shuffle, each team invents its own name. Two-minute deadline, and the name must
        come from their Act 1 labels. Type it in as they announce, then enter their carried-over points.
        The standings above reorder live as scores change.
      </p>
      {teams.map((t) => (
        <div key={t.id} className="team-row">
          <div className="dot" style={{ background: t.color }} />
          <input className="team-input" value={t.name} readOnly={!admin} onChange={(e) => admin && rename(t.id, e.target.value)} />
          {admin && (
            <div className="ptbtns">
              <button className="btn ghost mini" onClick={() => addPoints(t.id, -5)}>−5</button>
              <button className="btn gold mini" onClick={() => addPoints(t.id, 5)}>+5</button>
              <button className="btn gold mini" onClick={() => addPoints(t.id, 10)}>+10</button>
            </div>
          )}
          <div className="pts"><CountUp value={t.points} /></div>
        </div>
      ))}
      {admin && <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        {confirmReset ? (
          <>
            <span style={{ fontSize: 13, color: "#FF97A6", fontWeight: 700 }}>Wipe all scores, names, draws, and the Captain's Call?</span>
            <button className="btn danger" onClick={() => { resetEvent(); setConfirmReset(false); }}>Yes, reset everything</button>
            <button className="btn ghost" onClick={() => setConfirmReset(false)}>Cancel</button>
          </>
        ) : (
          <>
            <button className="btn danger" onClick={() => setConfirmReset(true)}>Reset entire event</button>
            <span className="deck-meta">Progress autosaves and survives refresh</span>
          </>
        )}
      </div>}
    </div>
  );
}
