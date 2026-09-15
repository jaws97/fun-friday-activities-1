import { useState, useEffect } from "react";
import { ART, MORPH_ART } from "./migrationArt.jsx";

export const LABELS = [
  { text: "Swiggy knows me better than my family" },
  { text: "I know Kannada", sub: "Entire vocabulary: “Kannada Gothilla”", subDelay: true },
  { text: "Cricket is my religion", sub: "And these are my gods", subDelay: true },
  { text: "Meghana's Biryani is overrated" },
  { text: "I am a MasterChef", sub: "Maggi. Only Maggi.", subDelay: true },
  { text: "There is nothing called Vegetable Biryani" },
  { text: "Breaking Bad > GoT" },
  { text: "Complains about traffic, drives alone anyway" },
  { text: "“One more episode” at 2am, work at 9" },
  { text: "Gym membership since January, been twice" },
  { text: "Says “quick sync” and takes 40 minutes" },
  { text: "I go to regional movies FDFS", sub: "6 AM show · Whistles ready", subDelay: true },
  { text: "I like exploring new food joints", sub: "Orders paneer butter masala. Everywhere.", subDelay: true },
  { text: "I like exploring new hobbies", sub: "Started: 11 · Still doing: 0", subDelay: true },
  { text: "I like reading books", sub: "Buying them counts, right?", subDelay: true },
  { text: "140 Chrome tabs of Stack Overflow, closes none, needs all of them" },
  { text: "Works well only when there is a deadline" },
  { text: "Reads documentation only after the third failure" },
  { text: "Will spend 4 hours automating a 10 minute task" },
  { text: "Puts “no meeting Friday” on calendar, schedules a meeting on Friday" },
  { text: "Serial Plant Killer" },
  { text: "“Recipe says 1 tsp” — adds 3, calls it intuition" },
  { text: "Buys trekking shoes; shoes have seen more malls than mountains" },
  { text: "Watches with subtitles on, in a language they speak fluently" },
  { text: "I'm a big Kafka fan", sub: "Franz. Not the message broker.", subDelay: true },
  { text: "I wish this meeting did not take place" },
  { text: "I like travelling", sub: "Begur → Bellandur", subDelay: true },
  { text: "It's not an adventure unless your heart skips a beat" },
  { text: "I am an alcoholic", morphTo: "I am a workaholic", morphArt: "workaholic" },
  { text: "I get bullied by Kavya" },
];

/* Advances one label per arrow press (deck step). Step 0 shows the rules;
   each step after that puts one label on the big stage with its doodle.
   `sub` renders a punchline under the text (add `subDelay: true` to have it
   land ~2s later on its own). `morphTo` plays in two beats: the text gets
   struck through at 2s, then replaced (with `morphArt`) at ~3.3s. */
export function MigrationSlide({ step }) {
  const current = step > 0 ? LABELS[step - 1] : null;
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    setPhase(0);
    const cur = step > 0 ? LABELS[step - 1] : null;
    if (!cur) return;
    const timers = [];
    if (cur.morphTo) {
      timers.push(setTimeout(() => setPhase(1), 2000));
      timers.push(setTimeout(() => setPhase(2), 3300));
    } else if (cur.subDelay) {
      timers.push(setTimeout(() => setPhase(1), 2000));
    }
    return () => timers.forEach(clearTimeout);
  }, [step]);

  return (
    <div className="slide center">
      <div className="sl-kicker">ACT 1 · THE GREAT MIGRATION</div>
      {step === 0 ? (
        <>
          <div className="sl-mast" style={{ fontSize: "clamp(30px,4.8vw,60px)" }}>If it's you, own it</div>
          <div className="sl-sub">A label appears · You walk to it · No hiding</div>
          <div className="sl-meta">FIRST TO MOVE +5 · OUTED HIDING −5 · WIN A DEBATE +10 · BEST ONE-LINER +10</div>
        </>
      ) : (
        <div className="mig-stage" key={step}>
          {phase >= 2 && current.morphArt ? MORPH_ART[current.morphArt] : ART[step - 1]}
          {current.morphTo && phase >= 2
            ? <div className="mig-current mig-morph">{current.morphTo}</div>
            : <div className={`mig-current ${current.morphTo && phase >= 1 ? "mig-struck" : ""}`}>{current.text}</div>}
          {current.sub && (!current.subDelay || phase >= 1) && <div className="mig-sub">{current.sub}</div>}
        </div>
      )}
      <div className="mig-count">{step} / {LABELS.length}</div>
    </div>
  );
}
MigrationSlide.steps = LABELS.length;
