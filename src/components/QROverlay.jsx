import { useState, useEffect } from "react";
import QRCode from "qrcode";

/* Full-screen QR pointing at /join — put it on the projector. */
export function QROverlay({ onClose }) {
  const [src, setSrc] = useState(null);
  const url = `${window.location.origin}/join`;

  useEffect(() => {
    QRCode.toDataURL(url, { width: 640, margin: 2, color: { dark: "#06080F", light: "#F2EFE6" } })
      .then(setSrc)
      .catch(() => {});
  }, [url]);

  return (
    <div className="p4-overlay" onClick={onClose}>
      <div className="qr-card" onClick={(e) => e.stopPropagation()}>
        <div className="sl-kicker">SCAN TO ENTER THE LEAGUE</div>
        {src && <img className="qr-img" src={src} alt={`QR code for ${url}`} />}
        <div className="qr-url">{url}</div>
        <button className="btn ghost" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
