import { CARD_TYPES } from "../data/cards.js";

export function ForfeitsTab({ teams, drawLog, logDraw, undoDraw }) {
  const drawCount = (id) => drawLog.filter((d) => d.teamId === id).length;
  return (
    <div className="panel" key="uno">
      <h2>Forfeit Tracker</h2>
      <p className="hint">
        The deck is physical, shuffled in front of the room. When someone draws, tap their team and the card
        pulled. The count feeds the tiebreaker (fewest cards drawn), and the ticker below keeps everyone
        informed of exactly one thing: whether the +4 is still out there.
      </p>
      <div className="cardkey">
        {CARD_TYPES.map((c) => (
          <div key={c.type} className="cardkey-item" style={{ "--kc": c.color }}>
            <span className="cardkey-label">{c.label}</span>
            <span className="cardkey-verdict">{c.verdict}</span>
          </div>
        ))}
      </div>
      <div className="subhead">Log a draw</div>
      <div className="score-grid">
        {teams.map((t) => (
          <div key={t.id} className="score-cell" style={{ "--cellcolor": t.color }}>
            <div className="nm">
              {t.name}
              <span className="draw-count">{drawCount(t.id)} DRAWN</span>
            </div>
            <div className="row">
              {CARD_TYPES.map((c) => (
                <button key={c.type} className="btn mini" style={{ background: c.color, color: "#06080F" }} onClick={() => logDraw(t.id, c.type)}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      {drawLog.length > 0 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 18 }}>
            <button className="btn danger" onClick={undoDraw}>Undo last draw</button>
            <span className="deck-meta">{drawLog.length} total draw{drawLog.length === 1 ? "" : "s"} logged</span>
          </div>
          <div className="history">
            {drawLog.map((d, i) => {
              const team = teams.find((t) => t.id === d.teamId);
              const card = CARD_TYPES.find((c) => c.type === d.cardType);
              return (
                <span key={drawLog.length - i} className="hist-chip" style={{ background: card.color }}>
                  {team.name.split(" ")[0]} · {card.label}
                </span>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
