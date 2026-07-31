import { useState } from "react";
import { QROverlay } from "../components/QROverlay.jsx";

export function WelcomeSlide({ onNext }) {
  const [showQR, setShowQR] = useState(false);
  return (
    <div className="slide center">
      <div className="sl-kicker">FUN FRIDAY PRESENTS</div>
      <div className="sl-mast">Once Upon a Thursday</div>
      <div className="sl-sub">The Happiest League on Earth</div>
      <div className="sl-meta">30 PLAYERS · 5 TEAMS · ONE TROPHY</div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <button className="btn gold sl-cta" onClick={onNext}>LET'S GO →</button>
        <button className="btn ghost sl-cta" onClick={() => setShowQR(true)}>JOIN QR</button>
      </div>
      {showQR && <QROverlay onClose={() => setShowQR(false)} />}
    </div>
  );
}
