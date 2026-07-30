/* ── timer ring ── */
export function TimerRing({ timer, presets }) {
  const R = 50, C = 2 * Math.PI * R;
  const frac = timer.total ? timer.seconds / timer.total : 0;
  const danger = timer.seconds <= 5 && timer.seconds > 0;
  const up = timer.seconds === 0 && !timer.running && timer.total > 0;
  return (
    <div className="timerbar">
      <div className={`ringwrap ${danger ? "danger" : ""}`}>
        <svg width="128" height="128" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r={R} fill="none" stroke="rgba(232,181,77,0.12)" strokeWidth="7" />
          <circle
            cx="64" cy="64" r={R} fill="none"
            stroke={danger ? "#E4374F" : "url(#goldstroke)"}
            strokeWidth="7" strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={C * (1 - frac)}
            transform="rotate(-90 64 64)"
            style={{ transition: "stroke-dashoffset 0.95s linear" }}
          />
          <defs>
            <linearGradient id="goldstroke" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#F6DC8E" />
              <stop offset="1" stopColor="#C99334" />
            </linearGradient>
          </defs>
        </svg>
        <div className="ringnum">{timer.seconds}</div>
      </div>
      <div className="timerside">
        <div className="timer-label">{up ? "TIME UP" : timer.running ? "ON THE CLOCK" : "TIMER"}</div>
        <div className="timer-controls">
          {presets.map((p) => (
            <button key={p} className="btn ghost" onClick={() => timer.start(p)}>{p}s</button>
          ))}
          {timer.running
            ? <button className="btn ghost" onClick={timer.stop}>Pause</button>
            : <button className="btn ghost" onClick={timer.resume} disabled={timer.seconds === 0}>Resume</button>}
          <button className="btn ghost" onClick={timer.reset} disabled={timer.seconds === 0}>Reset</button>
        </div>
      </div>
    </div>
  );
}
