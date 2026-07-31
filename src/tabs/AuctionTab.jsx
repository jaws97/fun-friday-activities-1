import { TimerRing } from "../components/TimerRing.jsx";

export function AuctionTab({ admin, teams, addPoints, timer, auctionRound, setAuctionRound }) {
  return (
    <div className="panel" key="auction">
      <h2>Too Good to be True <span className="super-tag" style={{ background: "#2F9BD6" }}>ROUND {auctionRound} / 5</span></h2>
      <p className="hint">
        Read the fact. Every team stands one claimant, four of them lying. Sixty seconds of interrogation,
        then simultaneous written votes; the owner casts a discarded decoy. +5 correct guess · +5 per team a
        fake fooled · +10 owner jackpot if the majority missed.
      </p>
      <TimerRing timer={timer} presets={[60, 30]} />
      {admin && (
        <>
          <div className="score-grid">
            {teams.map((t) => (
              <div key={t.id} className="score-cell" style={{ "--cellcolor": t.color }}>
                <div className="nm">{t.name}</div>
                <div className="row">
                  <button className="btn gold mini" onClick={() => addPoints(t.id, 5)}>+5</button>
                  <button className="btn gold mini" onClick={() => addPoints(t.id, 10)}>+10</button>
                  <button className="btn ghost mini" onClick={() => addPoints(t.id, -5)}>−5</button>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button className="btn ghost" disabled={auctionRound <= 1} onClick={() => setAuctionRound((r) => r - 1)}>Prev round</button>
            <button className="btn gold" disabled={auctionRound >= 5} onClick={() => setAuctionRound((r) => r + 1)}>Next round</button>
            <button className="btn danger" disabled={auctionRound === 1} onClick={() => setAuctionRound(1)}>Reset to round 1</button>
          </div>
        </>
      )}
    </div>
  );
}
