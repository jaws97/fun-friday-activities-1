import { useEffect, useRef } from "react";
import hostIntroVideo from "../assets/host-intro.mp4";

/* Step 0: the confession. Step 1: the clip that shows how the evening will go.
   The clip plays with sound — the arrow press that lands here counts as the
   user gesture browsers want; if autoplay with audio is still refused we fall
   back to muted so the slide never sits on a black frame. */
export function HostIntroSlide({ step }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    v.play().catch(() => {
      v.muted = true;
      v.play().catch(() => {});
    });
  }, [step]);

  if (step < 1) {
    return (
      <div className="slide center">
        <div className="sl-kicker">A QUICK DISCLAIMER</div>
        <div className="sl-mast" style={{ fontSize: "clamp(30px,4.8vw,60px)" }}>First Time Hosting</div>
        <div className="sl-sub">Please lower your expectations accordingly</div>
      </div>
    );
  }

  return (
    <div className="slide center">
      <div className="sl-kicker">AND THIS IS HOW I'LL BE ALL EVENING</div>
      <div className="crew-stage">
        <div className="crew-frame">
          <video ref={videoRef} className="host-intro-video" src={hostIntroVideo} autoPlay loop playsInline />
        </div>
      </div>
    </div>
  );
}
HostIntroSlide.steps = 1;
