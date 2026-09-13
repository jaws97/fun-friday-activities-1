import { useState, useEffect } from "react";
import { WelcomeSlide } from "./WelcomeSlide.jsx";
import { CrewSlide } from "./CrewSlide.jsx";
import { UselessMathSlide } from "./UselessMathSlide.jsx";
import { MigrationSlide } from "./MigrationSlide.jsx";

const SLIDES = [WelcomeSlide, CrewSlide, UselessMathSlide, MigrationSlide];

/* A slide may declare `Component.steps = N` to claim N in-slide build steps;
   arrow keys walk through the steps before moving between slides. */
const stepsFor = (i) => SLIDES[i].steps ?? 0;

export function SlideDeck({ onStartEvent }) {
  const [pos, setPos] = useState({ idx: 0, step: 0 });
  const last = pos.idx === SLIDES.length - 1 && pos.step === stepsFor(pos.idx);

  const next = () =>
    setPos(({ idx, step }) =>
      step < stepsFor(idx)
        ? { idx, step: step + 1 }
        : { idx: Math.min(idx + 1, SLIDES.length - 1), step: 0 }
    );
  const prev = () =>
    setPos(({ idx, step }) =>
      step > 0 ? { idx, step: step - 1 } : { idx: Math.max(idx - 1, 0), step: 0 }
    );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight" || e.key === "PageDown") next();
      if (e.key === "ArrowLeft" || e.key === "PageUp") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const Slide = SLIDES[pos.idx];
  return (
    <div className="deck">
      <div className="deck-slide" key={pos.idx}>
        <Slide step={pos.step} onNext={next} onStartEvent={onStartEvent} />
      </div>
      <button className="deck-skip" onClick={onStartEvent}>SKIP TO CONSOLE →</button>
      <div className="deck-nav">
        <button className="btn ghost" onClick={prev} disabled={pos.idx === 0 && pos.step === 0}>←</button>
        <div className="deck-dots">
          {SLIDES.map((_, i) => <span key={i} className={`deck-dot ${i === pos.idx ? "on" : ""}`} />)}
        </div>
        {last
          ? <button className="btn gold" onClick={onStartEvent}>START THE EVENT →</button>
          : <button className="btn ghost" onClick={next}>→</button>}
      </div>
    </div>
  );
}
