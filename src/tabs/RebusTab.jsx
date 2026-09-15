import { useState } from "react";
import { PUZZLES } from "../data/puzzles.jsx";
import { TimerRing } from "../components/TimerRing.jsx";

const TRIALS = PUZZLES.filter((p) => p.trial).length;
const REAL = PUZZLES.length - TRIALS;

export function RebusTab({ admin, teams, addPoints, timer, puzzleIdx, setPuzzleIdx }) {
  const [revealed, setRevealed] = useState(false);
  const puzzle = PUZZLES[puzzleIdx];
  /* Trials count as T1, T2…; real puzzles number from 01 after them. */
  const number = puzzle.trial ? puzzleIdx + 1 : puzzleIdx + 1 - TRIALS;
  const stageTag = puzzle.superOver ? "SUPER OVER" : `${puzzle.trial ? "TRIAL" : "PUZZLE"} ${String(number).padStart(2, "0")}`;
  return (
    <div className="panel" key="rebus">
      <h2>
        Wait, What?
        {puzzle.superOver
          ? <span className="super-tag">SUPER OVER</span>
          : puzzle.trial
            ? <span className="super-tag" style={{ background: "#2FBF71" }}>TRIAL {number} / {TRIALS}</span>
            : <span className="super-tag" style={{ background: "#2F9BD6" }}>PUZZLE {number} / {REAL}</span>}
      </h2>
      <p className="hint">
        Thirty seconds, answers on paper, raised together. +10 correct, +5 first correct.
        {puzzle.trial && " Trial run: no points, just to show how it works."}
        {puzzle.superOver && " Super Over: fifteen seconds, top two teams only."}
      </p>
      <TimerRing timer={timer} presets={puzzle.superOver ? [15] : [30, 15]} />
      <div className="jump">
        {PUZZLES.map((p, i) => (
          <button key={p.id} className={`jumpbtn ${i === puzzleIdx ? "on" : ""}`} onClick={() => { setPuzzleIdx(i); setRevealed(false); }}>
            {p.trial ? `T${i + 1}` : i + 1 - TRIALS}
          </button>
        ))}
      </div>
      <div className="rebus-stage">
        <span className="rebus-tag">{stageTag}</span>
        <div className="rebus-inner" key={puzzleIdx}>{puzzle.render}</div>
      </div>
      <div className="rebus-nav">
        <button className="btn ghost" disabled={puzzleIdx === 0} onClick={() => { setPuzzleIdx((i) => i - 1); setRevealed(false); }}>Prev</button>
        <button className="btn ghost" disabled={puzzleIdx === PUZZLES.length - 1} onClick={() => { const ni = puzzleIdx + 1; setPuzzleIdx(ni); setRevealed(false); timer.start(PUZZLES[ni].superOver ? 15 : 30); }}>Next</button>
        <button className="btn gold" onClick={() => setRevealed((r) => !r)}>{revealed ? "Hide answer" : "Reveal answer"}</button>
        {revealed && <div className="answer">{puzzle.answer}</div>}
      </div>
      {admin && !puzzle.trial && (
        <div className="score-grid">
          {teams.map((t) => (
            <div key={t.id} className="score-cell" style={{ "--cellcolor": t.color }}>
              <div className="nm">{t.name}</div>
              <div className="row">
                <button className="btn gold mini" onClick={() => addPoints(t.id, 10)}>+10</button>
                <button className="btn gold mini" onClick={() => addPoints(t.id, 5)}>+5 FIRST</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
