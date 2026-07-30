import { useEffect } from "react";

/* ── +4 takeover ── */
export function Plus4Overlay({ team, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2600);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="p4-overlay" onClick={onDone}>
      <div className="p4-card">
        <div className="p4-big">+4</div>
        <div className="p4-line">THE WILD CARD HAS DROPPED</div>
        <div className="p4-team" style={{ color: team.color }}>{team.name}</div>
        <div className="p4-sub">ENTIRE TEAM DRINKS · NO MERCY</div>
      </div>
    </div>
  );
}
