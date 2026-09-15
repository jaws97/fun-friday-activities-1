import { useState, useEffect } from "react";
import "./styles.css";
import IcebreakerConsole from "./IcebreakerConsole.jsx";
import { SlideDeck } from "./slides/SlideDeck.jsx";
import { JoinPage } from "./pages/JoinPage.jsx";

/* Tiny path router:
   /         → slide deck
   /console  → host console
   /board    → read-only spectator standings (also reachable via ?board)
   /join     → QR landing page: register a player name */
const SPECTATOR = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("board");

export default function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  /* F toggles fullscreen on the host surfaces (deck, console, board).
     Skipped while typing in a field, and on the players' join page. */
  useEffect(() => {
    if (path === "/join") return;
    const onKey = (e) => {
      if (e.key !== "f" && e.key !== "F") return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable)) return;
      e.preventDefault();
      if (document.fullscreenElement) document.exitFullscreen?.();
      else document.documentElement.requestFullscreen?.().catch(() => {});
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [path]);

  const go = (p) => {
    window.history.pushState({}, "", p);
    setPath(p);
  };

  if (path === "/join") return <JoinPage />;
  if (SPECTATOR || path === "/board" || path === "/console")
    return <IcebreakerConsole onBackToSlides={() => go("/")} />;
  return <SlideDeck onStartEvent={() => go("/console")} />;
}
