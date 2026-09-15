import { useState } from "react";
import { QROverlay } from "../components/QROverlay.jsx";

/* Step 0: just the title. Step 1: the stakes line and the buttons. */
export function WelcomeSlide({ step, onNext }) {
  const [showQR, setShowQR] = useState(false);
  return (
    <div className="slide center">
      <div className="sl-mast">Once Upon a Wednesday</div>
      {step >= 1 && (
        <>
          <div className="sl-meta">50 PLAYERS · 10 TEAMS · ONE TROPHY</div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <button className="btn gold sl-cta" onClick={onNext}>LET'S GO →</button>
            <button className="btn ghost sl-cta" onClick={() => setShowQR(true)}>JOIN QR</button>
          </div>
        </>
      )}
      {showQR && <QROverlay onClose={() => setShowQR(false)} />}
    </div>
  );
}
WelcomeSlide.steps = 1;
