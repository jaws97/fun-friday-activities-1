import { useFlip } from "../hooks/useFlip.js";
import { CountUp } from "./CountUp.jsx";

/* ── standings strip ── */
export function ScoreStrip({ teams }) {
  const sorted = [...teams].sort((a, b) => b.points - a.points);
  const orderKey = sorted.map((t) => t.id).join("-") + sorted.map((t) => t.points).join(",");
  const setRef = useFlip(orderKey);
  return (
    <div className="strip">
      {sorted.map((t, i) => (
        <div key={t.id} ref={setRef(t.id)} className={`slab ${i === 0 ? "lead" : ""}`}>
          <div className="slab-color" style={{ background: t.color }} />
          <div className="slab-body">
            <div className="slab-rank">{String(i + 1).padStart(2, "0")}</div>
            <div className="slab-name">{t.name}</div>
            <div className="slab-pts"><CountUp value={t.points} /></div>
          </div>
          {i === 0 && <div className="shine" />}
        </div>
      ))}
    </div>
  );
}
