/* The justification, staged one study at a time.
   Step 0: the question. Steps 1–3: a card per study, accumulating.
   Step 4: the punchline. Sources are real; the framing is not serious. */

const STUDIES = [
  {
    num: "180",
    unit: "TEAMS",
    claim: "Google studied 180 of its own teams. The best weren't the smartest. They were the ones who felt safe looking silly together.",
    src: "Google · Project Aristotle",
  },
  {
    num: "7×",
    unit: "MORE ENGAGED",
    claim: "People with a close friend at work are seven times more engaged. Only two in ten actually have one.",
    src: "Gallup · Q12 Engagement Survey",
  },
  {
    num: "13%",
    unit: "MORE PRODUCTIVE",
    claim: "Happy workers get 13% more done. Same hours, better output. Tested on real call centres for six months.",
    src: "Oxford · Saïd Business School, 2019",
  },
];

export function WhySlide({ step }) {
  if (step < 1) {
    return (
      <div className="slide center">
        <div className="sl-kicker">BUT SERIOUSLY · WHY ARE WE DOING THIS?</div>
        <div className="sl-mast" style={{ fontSize: "clamp(30px,4.8vw,60px)" }}>Science Made Me</div>
        <div className="sl-sub">Yes, there are actual studies</div>
      </div>
    );
  }

  const shown = STUDIES.slice(0, Math.min(step, STUDIES.length));
  return (
    <div className="slide center">
      <div className="sl-kicker">BUT SERIOUSLY · WHY ARE WE DOING THIS?</div>
      <div className="why-grid">
        {shown.map((s, i) => (
          <div key={i} className={`why-card ${i === shown.length - 1 && step <= STUDIES.length ? "fresh" : ""}`}>
            <div className="why-num">{s.num}</div>
            <div className="why-unit">{s.unit}</div>
            <div className="why-claim">{s.claim}</div>
            <div className="why-src">{s.src}</div>
          </div>
        ))}
      </div>
      {step > STUDIES.length && (
        <div className="sl-stamp why-stamp">SO TECHNICALLY, THIS IS A PRODUCTIVITY INITIATIVE</div>
      )}
    </div>
  );
}
WhySlide.steps = STUDIES.length + 1;
