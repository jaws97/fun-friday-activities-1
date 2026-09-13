import dataEngineersVideo from "../assets/dataengineer.mp4";
import developersVideo from "../assets/developer.mp4";
import managersVideo from "../assets/manager.mp4";
import vpVideo from "../assets/vp.mp4";
import kavyaVideo from "../assets/kavya.mp4";

/* One entry per crew. To add another: drop the MP4 in src/assets,
   import it above, and add an entry here — the deck picks it up automatically. */
const CREW = [
  {
    role: "The Data Engineers",
    tagline: "We weld the pipes so your dashboards don't lie",
    video: dataEngineersVideo,
  },
  {
    role: "The Software Developers",
    tagline: "It works on my machine",
    video: developersVideo,
  },
  {
    role: "The Managers",
    tagline: "Bring us the knots",
    video: managersVideo,
  },
  {
    role: "The VP",
    tagline: "Already saw it coming",
    video: vpVideo,
  },
  {
    role: "Kavya",
    tagline: "The floor's renewable energy source",
    video: kavyaVideo,
  },
];

/* Step 0 is the "Who We Are" title card; each step after that is one crew,
   with its video rolling as soon as the slide lands. */
export function CrewSlide({ step }) {
  const crew = step > 0 ? CREW[step - 1] : null;
  return (
    <div className="slide center">
      <div className="sl-kicker">WHO WE ARE</div>
      {crew === null ? (
        <div className="sl-mast" style={{ fontSize: "clamp(30px,4.8vw,60px)" }}>Meet the Crew</div>
      ) : (
        <div className="crew-stage" key={step}>
          <div className="crew-frame">
            <video className="crew-video" src={crew.video} autoPlay loop muted playsInline />
          </div>
          <div className="sl-mast crew-mast">{crew.role}</div>
          <div className="crew-tag">{crew.tagline}</div>
        </div>
      )}
    </div>
  );
}
CrewSlide.steps = CREW.length;
