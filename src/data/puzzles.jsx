import React from "react";

/* `trial: true` marks a warm-up: shown first, labelled as a trial, no scoring. */
export const PUZZLES = [
  { id: 2, answer: "To-do list (two DOs)", trial: true, render: <span className="rb rb-m">DODO&nbsp;LIST</span> },
  { id: 5, answer: "One in a million", trial: true, render: <span className="rb rb-m">MILL1ON</span> },
  {
    id: 1, answer: "Inside job",
    render: (<div style={{ border: "5px solid #1A1D16", padding: "28px 54px", display: "inline-block" }}><span className="rb">JOB</span></div>),
  },
  {
    id: 3, answer: "The underdogs",
    render: (<div className="stack"><span style={{ fontSize: 58 }}>🐕🐕</span><span className="rb rb-m">THE</span></div>),
  },
  {
    id: 4, answer: "Hole in one",
    render: (<div style={{ position: "relative", display: "inline-block", fontSize: "clamp(100px,18vw,170px)", lineHeight: 1 }}>
      <span className="rb" style={{ fontSize: "1em" }}>1</span>
      {/* A punched hole: same colour as the stage, sized to sit inside the stem. */}
      <span style={{ position: "absolute", top: "48.5%", left: "60.5%", transform: "translate(-50%,-50%)", width: "0.12em", height: "0.12em", borderRadius: "50%", background: "#F4F1E6" }} />
    </div>),
  },
  {
    id: 54, answer: "Eye shadow (EYE casting a shadow)",
    render: (<div style={{ position: "relative", display: "inline-block", lineHeight: 1, paddingBottom: "0.7em", fontSize: "clamp(48px,9vw,92px)" }}>
      <span className="rb" style={{ position: "relative", zIndex: 1 }}>EYE</span>
      {/* The shadow: a copy flipped over the baseline, squashed, slanted and faded. */}
      <span className="rb" aria-hidden="true" style={{ position: "absolute", left: 0, top: 0, transformOrigin: "bottom left", transform: "scaleY(-0.55) skewX(-40deg)", color: "rgba(26,29,22,0.28)", filter: "blur(1.2px)" }}>EYE</span>
    </div>),
  },
  {
    id: 55, answer: "Eiffel Tower (I FELL, stacked into a tower)",
    render: (<div className="stack" style={{ gap: 2 }}>
      {[15, 19, 24, 30, 37, 45, 54].map((size, i) => (
        <span key={i} className="rb" style={{ fontSize: `clamp(${Math.round(size * 0.7)}px, ${(size / 10).toFixed(1)}vw, ${size}px)`, lineHeight: 1.05, letterSpacing: "0.06em" }}>I FELL</span>
      ))}
    </div>),
  },
  {
    id: 56, answer: "Piece of cake (only a piece of CAKE is left)",
    render: (<div style={{ display: "inline-block", lineHeight: 1 }}>
      {/* Top slice of the word, with a wedge cut out of the middle. */}
      <span className="rb" style={{ display: "inline-block", fontSize: "clamp(64px,12vw,120px)", letterSpacing: "0.06em", clipPath: "polygon(0 0, 100% 0, 100% 58%, 60% 58%, 52% 30%, 46% 58%, 0 58%)" }}>CAKE</span>
    </div>),
  },
  {
    id: 57, answer: "That's beside the point (THAT beside a point)",
    render: (<div style={{ display: "inline-flex", alignItems: "center", gap: "0.5em", fontSize: "clamp(40px,7vw,80px)" }}>
      <span className="rb" style={{ fontSize: "1em" }}>THAT</span>
      <span aria-hidden="true" style={{ width: "0.22em", height: "0.22em", borderRadius: "50%", background: "#1A1D16" }} />
      <span className="rb" style={{ fontSize: "1em" }}>THAT</span>
    </div>),
  },
  {
    id: 58, answer: "Go for it (GO, four ITs)",
    render: (<div style={{ display: "inline-flex", alignItems: "baseline", gap: "0.45em", fontSize: "clamp(40px,7vw,80px)" }}>
      <span className="rb" style={{ fontSize: "1em" }}>GO</span>
      <span className="rb" style={{ fontSize: "1em", letterSpacing: "0.12em" }}>IT IT IT IT</span>
    </div>),
  },
  {
    id: 6, answer: "You're under arrest",
    render: (<div className="stack"><span className="rb rb-m">ARREST</span><div className="hline" /><span className="rb rb-m">YOU'RE</span></div>),
  },
  {
    id: 7, answer: "Last but not least",
    render: (<span className="rb">L<span style={{ position: "relative", display: "inline-block" }}>E<span className="rb-cross">✕</span></span>AST</span>),
  },
  { id: 8, answer: "Robin Hood (ROB in HOOD)", render: <span className="rb">HOROBOD</span> },
  {
    id: 9, answer: "Drinks are on me",
    render: (<div className="stack" style={{ gap: 0 }}>
      <div style={{ display: "grid", gridTemplateColumns: "auto auto", gap: "2px 18px", justifyItems: "center", marginBottom: -58, position: "relative", zIndex: 1 }}>
        {["WATER", "WINE", "SODA", "BEER"].map((d) => <span key={d} className="rb rb-xs red">{d}</span>)}
      </div>
      <span className="rb" style={{ fontSize: "clamp(84px,16vw,150px)", lineHeight: 0.95 }}>ME</span>
    </div>),
  },
  {
    id: 10, answer: "Crossroads",
    render: (<div style={{ position: "relative", width: 320, height: 240 }}>
      <span className="rb rb-m" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%) rotate(45deg)", letterSpacing: "0.12em" }}>ROADS</span>
      <span className="rb rb-m" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%) rotate(-45deg)", letterSpacing: "0.12em" }}>RO<span style={{ opacity: 0 }}>A</span>DS</span>
    </div>),
  },
  {
    id: 11, answer: "Just between you and me (shared U)",
    render: (<div style={{ display: "grid", gridTemplateColumns: "auto auto auto", justifyItems: "center", alignItems: "center", rowGap: 2 }}>
      <span className="rb rb-m" style={{ gridColumn: 2, gridRow: 1 }}>J</span>
      <span className="rb rb-m" style={{ gridColumn: 1, gridRow: 2 }}>YO</span>
      <span className="rb rb-m" style={{ gridColumn: 2, gridRow: 2 }}>U</span>
      <span className="rb rb-m" style={{ gridColumn: 3, gridRow: 2 }}>ME</span>
      <span className="rb rb-m" style={{ gridColumn: 2, gridRow: 3 }}>S</span>
      <span className="rb rb-m" style={{ gridColumn: 2, gridRow: 4 }}>T</span>
    </div>),
  },
  {
    id: 12, answer: "Stand by me",
    render: (<div style={{ display: "inline-flex", alignItems: "center", gap: 30 }}>
      <div className="vword">{"STAND".split("").map((c, i) => <span key={i}>{c}</span>)}</div>
      <span className="rb rb-m">ME</span>
    </div>),
  },
  {
    id: 13, answer: "Top secret",
    render: (<div className="stack" style={{ gap: 2 }}>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <span key={i} className="rb rb-s" style={i === 0 ? { border: "3px solid #C42B40", borderRadius: "50%", padding: "0 16px" } : {}}>SECRET</span>
      ))}
    </div>),
  },
  {
    id: 14, answer: "Backwards (WARDS written backward)",
    render: (<span className="rb rb-m" style={{ letterSpacing: "0.1em" }}>SDRAW</span>),
  },
  {
    id: 15, answer: "Back to square one (backward 2, 1 in a square)",
    render: (<div style={{ display: "inline-flex", alignItems: "center" }}>
      <span className="rb rb-m" style={{ transform: "scaleX(-1)", display: "inline-block", marginRight: 16 }}>2</span>
      <span style={{ border: "5px solid #1A1D16", padding: "10px 26px", background: "#F4F1E6", position: "relative" }}><span className="rb rb-m">1</span></span>
    </div>),
  },
  {
    id: 16, answer: "Once upon a time (ones upon TIME)",
    render: (<div className="stack" style={{ gap: 4 }}>
      <span className="rb rb-m" style={{ letterSpacing: "0.06em" }}>11111111</span>
      <span className="rb rb-m">TIME</span>
    </div>),
  },
  {
    id: 17, answer: "Blood is thicker than water",
    render: (<div className="stack"><span className="rb rb-m" style={{ fontWeight: 900 }}>BLOOD</span><span className="rb rb-s" style={{ fontWeight: 400, letterSpacing: "0.06em" }}>WATER</span></div>),
  },
  {
    id: 18, answer: "Too big to ignore (2 BIG, 2 IGNORE)",
    render: (<div className="stack" style={{ gap: 10 }}>
      <span className="rb">BIG&nbsp;&nbsp;BIG</span>
      <span className="rb rb-xs" style={{ fontWeight: 600, letterSpacing: "0.08em" }}>IGNORE&nbsp;&nbsp;IGNORE</span>
    </div>),
  },
  {
    id: 19, answer: "Up for grabs (four GRABs reading up)",
    render: (<div className="stack" style={{ gap: 0, lineHeight: 1.05 }}>
      {["BBBB", "AAAA", "RRRR", "GGGG"].map((row) => (
        <span key={row} className="rb rb-m" style={{ letterSpacing: "0.3em", paddingLeft: "0.3em" }}>{row}</span>
      ))}
    </div>),
  },
  {
    id: 20, answer: "Falling in love",
    render: (<div style={{ position: "relative", width: 290, height: 220 }}>
      {"LOVE".split("").map((c, i) => (
        <span key={i} className="rb rb-m" style={{ position: "absolute", left: i * 62, top: i * 48, transform: `rotate(${12 + i * 9}deg)` }}>{c}</span>
      ))}
    </div>),
  },
  {
    id: 21, answer: "Misunderstood (miss under STOOD)",
    render: (<div className="stack"><span className="rb rb-m">STOOD</span><div className="hline" /><span style={{ fontSize: 54, lineHeight: 1 }}>👩</span></div>),
  },
  {
    id: 22, answer: "Scrambled eggs",
    render: (<div style={{ position: "relative", width: 300, height: 190 }}>
      {[["GEGS", 10, 8, -14], ["SEGG", 158, 26, 11], ["EGSG", 34, 100, 7], ["GGES", 168, 118, -9]].map(([w, x, y, r], i) => (
        <span key={i} className="rb rb-s" style={{ position: "absolute", left: x, top: y, transform: `rotate(${r}deg)` }}>{w}</span>
      ))}
    </div>),
  },
  {
    id: 23, answer: "Missing you (no U)",
    render: (<span className="rb rb-s" style={{ letterSpacing: "0.14em", maxWidth: 580, display: "inline-block", lineHeight: 1.6 }}>ABCDEFGHIJKLM NOPQRSTVWXYZ</span>),
  },
  {
    id: 24, answer: "For once in my life (four 1s)",
    render: (<span className="rb rb-m">M1Y&nbsp;&nbsp;L1I1F1E</span>),
  },
  {
    id: 25, answer: "Long time no see (no C)",
    render: (<div className="stack" style={{ gap: 18 }}>
      <span className="rb rb-m" style={{ letterSpacing: "0.9em", paddingLeft: "0.9em" }}>TIME</span>
      <span className="rb rb-m">ABD</span>
    </div>),
  },
  {
    id: 26, answer: "Downhill",
    render: (<div className="vword">{"HILL".split("").map((c, i) => <span key={i}>{c}</span>)}</div>),
  },
  {
    id: 27, answer: "Tennis shoes (ten ISSUES)",
    render: (<div style={{ display: "grid", gridTemplateColumns: "auto auto", gap: "4px 36px" }}>
      {Array.from({ length: 10 }).map((_, i) => <span key={i} className="rb rb-xs">ISSUES</span>)}
    </div>),
  },
  {
    id: 28, answer: "Spaceship (blank space + SHIP)",
    render: (<span className="rb rb-m"><span style={{ display: "inline-block", width: 170, borderBottom: "5px solid #1A1D16" }}>&nbsp;</span>&nbsp;SHIP</span>),
  },
  {
    id: 29, answer: "Beat around the bush",
    render: (<div style={{ position: "relative", width: 300, height: 220, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span className="rb rb-m">BUSH</span>
      <span className="rb rb-s" style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)" }}>B</span>
      <span className="rb rb-s" style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>E</span>
      <span className="rb rb-s" style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)" }}>A</span>
      <span className="rb rb-s" style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)" }}>T</span>
    </div>),
  },
  {
    id: 30, answer: "No one understands (no 1 under STANDS)",
    render: (<div className="stack"><span className="rb rb-m">STANDS</span><span className="rb rb-m" style={{ letterSpacing: "0.2em" }}>02345</span></div>),
  },
  {
    id: 31, answer: "Metaphor (META x four)",
    render: (<div style={{ position: "relative", width: 320, height: 210 }}>
      {[{ top: 0, left: 0 }, { top: 0, right: 0 }, { bottom: 0, left: 0 }, { bottom: 0, right: 0 }].map((pos, i) => (
        <span key={i} className="rb rb-s" style={{ position: "absolute", ...pos }}>META</span>
      ))}
    </div>),
  },
  {
    id: 32, answer: "Foreign language (four in LANGUAGE)",
    render: (<span className="rb rb-m">LANGU4AGE</span>),
  },
  {
    id: 33, answer: "Microscope",
    render: (<span style={{ fontFamily: "var(--body)", fontWeight: 800, fontSize: 9, color: "#1A1D16", letterSpacing: "0.02em" }}>SCOPE</span>),
  },
  {
    id: 34, answer: "Sunny side up (SUNNY, on the side, reading up)",
    render: (<div className="rb-wide" style={{ position: "relative", height: 240 }}>
      <div className="vword" style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
        {"YNNUS".split("").map((c, i) => <span key={i}>{c}</span>)}
      </div>
    </div>),
  },
  {
    id: 35, answer: "Tuna fish (two NAFISH)",
    render: (<div className="stack" style={{ gap: 4 }}><span className="rb rb-m">NAFISH</span><span className="rb rb-m">NAFISH</span></div>),
  },
  {
    id: 36, answer: "Excuse me (crossed Q = ex-Q)",
    render: (<span className="rb rb-m"><span style={{ position: "relative", display: "inline-block" }}>Q<span className="rb-cross">✕</span></span>&nbsp;&nbsp;&nbsp;ME</span>),
  },
  {
    id: 37, answer: "Middle age",
    render: (<div className="stack" style={{ gap: 4 }}>
      <span className="rb rb-s">AGE</span>
      <span className="rb rb-s" style={{ border: "3px solid #C42B40", padding: "0 16px" }}>AGE</span>
      <span className="rb rb-s">AGE</span>
    </div>),
  },
  {
    id: 38, answer: "Potato (POT + eight Os)",
    render: (<div style={{ display: "inline-flex", alignItems: "center", gap: 26 }}>
      <span className="rb rb-m">POT</span>
      <div style={{ display: "grid", gridTemplateColumns: "auto auto", gap: "0 8px" }}>
        {Array.from({ length: 8 }).map((_, i) => <span key={i} className="rb rb-xs">O</span>)}
      </div>
    </div>),
  },
  {
    id: 39, answer: "Travel overseas (TRAVEL over Cs)",
    render: (<div className="stack"><span className="rb rb-m">TRAVEL</span><div className="hline" /><span className="rb rb-s" style={{ letterSpacing: "0.1em" }}>CCCCCC</span></div>),
  },
  {
    id: 40, answer: "Take IT from ME",
    render: (<div style={{ display: "inline-flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
      <span className="rb rb-m">ME</span>
      <span className="rb rb-m">&minus;IT</span>
      <div className="hline" style={{ width: 160 }} />
    </div>),
  },
  {
    id: 41, answer: "Try to understand (TRY, 2 under STAND)",
    render: (<div style={{ display: "inline-flex", alignItems: "center", gap: 26 }}>
      <span className="rb rb-m">TRY</span>
      <div className="stack" style={{ gap: 4 }}>
        <span className="rb rb-m">STAND</span>
        <div className="hline" />
        <span className="rb rb-m">2</span>
      </div>
    </div>),
  },
  {
    id: 42, answer: "One foot in the door (one FT in DOOR)",
    render: (<span className="rb rb-m">DO<span style={{ fontSize: "0.38em", verticalAlign: "0.05em", letterSpacing: "0.02em" }}>ft</span>OR</span>),
  },
  {
    id: 43, answer: "Blanket (blank + ET)",
    render: (<span className="rb rb-m"><span style={{ display: "inline-block", width: 190, borderBottom: "5px solid #1A1D16" }}>&nbsp;</span>ET</span>),
  },
  {
    id: 44, answer: "Headquarters (head + 25%)",
    render: (<div style={{ display: "inline-flex", alignItems: "center", gap: 44 }}>
      <span style={{ fontSize: 96, lineHeight: 1, filter: "grayscale(1) brightness(0.15)" }}>👤</span>
      <span className="rb rb-m">25%</span>
    </div>),
  },
  {
    id: 45, answer: "Read between the lines",
    render: (<div style={{ display: "inline-flex", alignItems: "center", gap: 22 }}>
      <div style={{ width: 5, height: 76, background: "#1A1D16" }} />
      <span className="rb rb-m">READ</span>
      <div style={{ width: 5, height: 76, background: "#1A1D16" }} />
    </div>),
  },
  {
    id: 46, answer: "Feeling under the weather",
    render: (<div className="stack"><span className="rb rb-m">WEATHER</span><div className="hline" /><span style={{ fontFamily: "var(--body)", fontWeight: 800, fontSize: 32, color: "#1A1D16", letterSpacing: "0.2em" }}>:) :( :3</span></div>),
  },
  {
    id: 47, answer: "Writer's block",
    render: (<div style={{ display: "inline-flex", alignItems: "center", gap: 20 }}>
      <span className="rb rb-m">WRITER'S</span>
      <div style={{ width: 48, height: 48, background: "#1A1D16" }} />
    </div>),
  },
  {
    id: 48, answer: "Ice cube (water cubed)",
    render: (<span className="rb rb-m">H<span style={{ fontSize: "0.5em", verticalAlign: "-0.25em" }}>2</span>O<span style={{ fontSize: "0.5em", verticalAlign: "0.55em" }}>3</span></span>),
  },
  {
    id: 49, answer: "Long Island iced tea (stretched ISLAND + T)",
    render: (<span className="rb rb-s" style={{ letterSpacing: "0.75em", transform: "scaleX(1.25)", display: "inline-block" }}>ISLANDT</span>),
  },
  {
    id: 50, answer: "What goes up must come down",
    render: (<div style={{ display: "grid", gridTemplateColumns: "auto auto", columnGap: 34, rowGap: 0, justifyItems: "center", lineHeight: 1.05 }}>
      {[["T", "D"], ["A", "O"], ["H", "W"], ["W", "N"]].map(([l, r], i) => (
        <React.Fragment key={i}>
          <span className="rb rb-m">{l}</span>
          <span className="rb rb-m">{r}</span>
        </React.Fragment>
      ))}
    </div>),
  },
  {
    id: 51, answer: "Cornerstone (STONE forming a corner)",
    render: (<div className="rb-wide" style={{ position: "relative", height: 280 }}>
      <div style={{ position: "absolute", top: -28, right: -18, display: "grid", gridTemplateColumns: "auto auto", justifyItems: "center", lineHeight: 1.05 }}>
        <span className="rb rb-m" style={{ gridColumn: 1, gridRow: 1 }}>S</span>
        <span className="rb rb-m" style={{ gridColumn: 2, gridRow: 1 }}>T</span>
        <span className="rb rb-m" style={{ gridColumn: 2, gridRow: 2 }}>O</span>
        <span className="rb rb-m" style={{ gridColumn: 2, gridRow: 3 }}>N</span>
        <span className="rb rb-m" style={{ gridColumn: 2, gridRow: 4 }}>E</span>
      </div>
    </div>),
  },
  {
    id: 52, answer: "Multiple choice (25 CHOICEs)",
    render: (<div style={{ display: "grid", gridTemplateColumns: "repeat(5, auto)", gap: "5px 18px" }}>
      {Array.from({ length: 25 }).map((_, i) => (
        <span key={i} style={{ fontFamily: "var(--body)", fontWeight: 800, fontSize: 14, color: "#1A1D16" }}>CHOICE</span>
      ))}
    </div>),
  },
  {
    id: 53, answer: "Seasoning (Cs + ON + ING)", superOver: true,
    render: (<div style={{ display: "inline-flex", flexDirection: "column", alignItems: "flex-start" }}>
      <span className="rb rb-m" style={{ letterSpacing: "0.08em" }}>CCCCCC</span>
      <div className="vword" style={{ marginLeft: 130, fontSize: "clamp(20px,3vw,30px)" }}>{"ING".split("").map((c, i) => <span key={i}>{c}</span>)}</div>
    </div>),
  },
];
