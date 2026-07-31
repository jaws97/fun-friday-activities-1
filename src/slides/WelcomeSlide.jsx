export function WelcomeSlide({ onNext }) {
  return (
    <div className="slide center">
      <div className="sl-kicker">FUN FRIDAY PRESENTS</div>
      <div className="sl-mast">Once Upon a Thursday</div>
      <div className="sl-sub">The Happiest League on Earth</div>
      <div className="sl-meta">30 PLAYERS · 5 TEAMS · ONE TROPHY</div>
      <button className="btn gold sl-cta" onClick={onNext}>LET'S GO →</button>
    </div>
  );
}
