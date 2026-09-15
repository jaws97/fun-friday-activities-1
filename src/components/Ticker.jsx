/* ── ticker tape ── */
export function Ticker({ teams }) {
  const sorted = [...teams].sort((a, b) => b.points - a.points);
  const leader = sorted[0];
  const second = sorted[1];
  const gap = second ? leader.points - second.points : 0;
  const msgs = [
    `${leader.name.toUpperCase()} TOP THE TABLE · ${leader.points} PTS`,
    second
      ? gap === 0
        ? `LEVEL AT THE TOP WITH ${second.name.toUpperCase()}`
        : `${second.name.toUpperCase()} ${gap} PT${gap === 1 ? "" : "S"} BEHIND`
      : `${teams.length} TEAMS · ONE TROPHY`,
    `${teams.length} TEAMS · ONE TROPHY`,
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
