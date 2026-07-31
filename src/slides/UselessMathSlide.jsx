import { useState, useEffect } from "react";
import peter from "../assets/peter-griffin.jpg";

/* The joke, staged:
   TWO + ELEVEN − ONE  →  strike the O (from TWO), the N and middle E
   (from ELEVEN) against the letters of ONE — the survivors literally
   read T W E L V E in order.
   Phases: 1 strike O·O, 2 strike N·N, 3 strike E·E,
   4 survivors go gold, 5 TWELVE reveals, 6 stamp. */

const WORDS = [
  { word: [{ c: "T" }, { c: "W" }, { c: "O", strike: 1 }], delay: 0.15 },
  { op: "+", delay: 0.35 },
  { word: [{ c: "E" }, { c: "L" }, { c: "E", strike: 3 }, { c: "V" }, { c: "E" }, { c: "N", strike: 2 }], delay: 0.55 },
  { op: "−", delay: 0.75 },
  { word: [{ c: "O", strike: 1 }, { c: "N", strike: 2 }, { c: "E", strike: 3 }], delay: 0.95 },
  { op: "=", delay: 1.15 },
];

const PHASE_TIMES = [1900, 2800, 3700, 4600, 5300, 6500];

export function UselessMathSlide() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const timers = PHASE_TIMES.map((t, i) => setTimeout(() => setPhase(i + 1), t));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="slide center">
      <div className="sl-kicker">BEFORE ANYTHING ELSE · INFORMATION THAT WILL NEVER BE USEFUL</div>
      <div className="eq-row">
        {WORDS.map((w, i) =>
          w.op ? (
            <span key={i} className="eq-word op" style={{ animationDelay: `${w.delay}s` }}>{w.op}</span>
          ) : (
            <span key={i} className="eq-word" style={{ animationDelay: `${w.delay}s` }}>
              {w.word.map((l, j) => (
                <span
                  key={j}
                  className={`eq-l ${l.strike && phase >= l.strike ? "struck" : ""} ${!l.strike && phase >= 4 ? "keep" : ""}`}
                >
                  {l.c}
                </span>
              ))}
            </span>
          )
        )}
        {phase < 5 ? (
          <span className="eq-word op eq-q" style={{ animationDelay: "1.35s" }}>?</span>
        ) : (
          <span className="eq-word result">
            {"TWELVE".split("").map((c, i) => (
              <span key={i} className="eq-r" style={{ animationDelay: `${i * 0.09}s` }}>{c}</span>
            ))}
          </span>
        )}
      </div>
      {phase >= 6 && <div className="sl-stamp">CHECKS OUT</div>}
      <figure className="peter" style={{ animationDelay: "0.8s" }}>
        <div className="peter-img" style={{ backgroundImage: `url(${peter})` }} />
        <figcaption>MATH CONSULTANT</figcaption>
      </figure>
    </div>
  );
}
