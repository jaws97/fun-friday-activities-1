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
    num: "20%",
    unit: "FASTER TEAMS",
    claim: "A bank moved coffee breaks so colleagues could actually talk. Productivity jumped a fifth in three months. Worth $15 million a year.",
    src: "MIT · Pentland, Bank of America",
  },
  {
    num: "13%",
    unit: "MORE PRODUCTIVE",
    claim: "Happy workers get 13% more done. Same hours, better output. Tested on real call centres for six months.",
    src: "Oxford · Saïd Business School, 2019",
  },
  {
    num: "32%",
    unit: "LESS CORTISOL",
    claim: "Laughing drops your stress hormone by a third. Laughing with other people also releases endorphins. So, you're welcome.",
    src: "Meta-analysis, 2023 · Dunbar, Oxford",
  },
  {
    num: "3",
    unit: "EXPERIMENTS",
    claim: "People who do something together, even walking in step, cooperate more afterwards. Even when it costs them. Tonight counts.",
    src: "Stanford · Wiltermuth & Heath, 2009",
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
    <div className="slide center why-slide">
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
