/* ── ticker tape ── */
export function Ticker({ teams, captainsCall, drawLog }) {
  const leader = [...teams].sort((a, b) => b.points - a.points)[0];
  const plus4 = drawLog.find((d) => d.cardType === "plus4");
  const plus4Team = plus4 ? teams.find((t) => t.id === plus4.teamId) : null;
  const msgs = [
    `${leader.name.toUpperCase()} TOP THE TABLE · ${leader.points} PTS`,
    plus4Team ? `THE +4 HAS DROPPED ON ${plus4Team.name.toUpperCase()}` : "THE +4 IS STILL IN THE DECK",
    captainsCall.holder === null
      ? "CAPTAIN'S CALL: NOT YET AWARDED"
      : captainsCall.used
        ? "CAPTAIN'S CALL: SPENT"
        : `${teams.find((t) => t.id === captainsCall.holder).name.toUpperCase()} HOLD THE CAPTAIN'S CALL`,
    `${drawLog.length} FORFEIT CARD${drawLog.length === 1 ? "" : "S"} DRAWN SO FAR`,
    "WRONG ANSWERS HAVE CONSEQUENCES · KARELA AWAITS",
  ];
  const line = msgs.join("   ◆   ");
  return (
    <div className="ticker">
      <div className="ticker-tag">LIVE</div>
      <div className="ticker-view">
        <div className="ticker-run">
          <span>{line}   ◆   </span>
          <span>{line}   ◆   </span>
        </div>
      </div>
    </div>
  );
}
