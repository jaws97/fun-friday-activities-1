export function CaptainsCallTab({ admin, teams, leader, captainsCall, setCaptainsCall }) {
  const holderTeam = captainsCall.holder !== null ? teams.find((t) => t.id === captainsCall.holder) : null;
  return (
    <div className="panel" key="call">
      <h2>Captain's Call</h2>
      <p className="hint">
        Awarded to the table topper after Too Good to be True. One use, any time in the picture round, never in the
        Super Over. Current leader: <strong style={{ color: leader.color }}>{leader.name}</strong> with {leader.points} pts.
      </p>
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <span style={{ fontSize: 13, color: "var(--mut)", fontWeight: 700, letterSpacing: "0.1em" }}>HOLDER</span>
        {admin ? (
          <>
            <select
              value={captainsCall.holder ?? ""}
              onChange={(e) => setCaptainsCall({ holder: e.target.value === "" ? null : Number(e.target.value), used: false, power: null })}
            >
              <option value="">Not awarded yet</option>
              {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <button className="btn gold" onClick={() => setCaptainsCall({ holder: leader.id, used: false, power: null })}>
              Award to current leader
            </button>
          </>
        ) : (
          <span style={{ fontWeight: 700, color: holderTeam ? holderTeam.color : "var(--mut)" }}>
            {holderTeam ? holderTeam.name : "Not awarded yet"}
          </span>
        )}
      </div>

      {captainsCall.holder !== null && !captainsCall.used && (
        <div className="call-choice">
          <div className={`power ${captainsCall.power === "timeout" ? "picked" : ""}`} onClick={() => admin && setCaptainsCall((c) => ({ ...c, power: "timeout" }))}>
            <h3>Strategic Timeout</h3>
            <p>Freeze a rival team's thirty seconds to zero. They answer immediately, no discussion. Choose the victim.</p>
          </div>
          <div className={`power ${captainsCall.power === "impact" ? "picked" : ""}`} onClick={() => admin && setCaptainsCall((c) => ({ ...c, power: "impact" }))}>
            <h3>Impact Player</h3>
            <p>Borrow anyone from any team for one puzzle. No refusals. This is the auction, they have been bought.</p>
          </div>
        </div>
      )}

      {admin && captainsCall.holder !== null && !captainsCall.used && captainsCall.power && (
        <button className="btn gold" style={{ marginTop: 18 }} onClick={() => setCaptainsCall((c) => ({ ...c, used: true }))}>
          Mark {captainsCall.power === "timeout" ? "Strategic Timeout" : "Impact Player"} as used
        </button>
      )}

      {captainsCall.used && <div className="used-stamp">CALL USED</div>}
    </div>
  );
}
