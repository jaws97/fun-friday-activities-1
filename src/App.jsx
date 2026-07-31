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

  const go = (p) => {
    window.history.pushState({}, "", p);
    setPath(p);
  };

  if (path === "/join") return <JoinPage />;
  if (SPECTATOR || path === "/board" || path === "/console")
    return <IcebreakerConsole onBackToSlides={() => go("/")} />;
  return <SlideDeck onStartEvent={() => go("/console")} />;
}
