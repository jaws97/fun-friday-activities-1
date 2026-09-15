import { useState, useEffect } from "react";

/* ─────────────────────────────────────────────────────────────
   WEDNESDAY PREMIER LEAGUE · Host Console
   Broadcast-graphics build: skewed gold slabs, condensed
   numerals, FLIP-animated standings, timer ring, ticker tape.
───────────────────────────────────────────────────────────── */

import "./styles.css";
import { DEFAULT_TEAMS, RESERVE_TEAMS } from "./data/teams.js";
import { store } from "./lib/store.js";
import { useCountdown } from "./hooks/useCountdown.js";
import { ScoreStrip } from "./components/ScoreStrip.jsx";
import { Ticker } from "./components/Ticker.jsx";
import { QROverlay } from "./components/QROverlay.jsx";
import { TeamsTab } from "./tabs/TeamsTab.jsx";
import { PlayersTab } from "./tabs/PlayersTab.jsx";
import { RebusTab } from "./tabs/RebusTab.jsx";

/* Read-only spectator mode: open /board (or any URL with ?board) to watch
   the live standings without any host controls. */
const SPECTATOR = typeof window !== "undefined" &&
  (new URLSearchParams(window.location.search).has("board") || window.location.pathname === "/board");

/* Host gate: the console is view-only unless this localStorage key is set —
   run  localStorage.setItem('funfriday-admin', 'jaws')  once in DevTools.
   Non-admins also never autosave, so they can't overwrite shared scores. */
const IS_ADMIN = typeof window !== "undefined" && window.localStorage.getItem("funfriday-admin") === "jaws";

export default function IcebreakerConsole({ onBackToSlides }) {
  const [teams, setTeams] = useState(DEFAULT_TEAMS);
  const [tab, setTab] = useState("teams");
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const [playerTeams, setPlayerTeams] = useState({});
  const [hydrated, setHydrated] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const timer = useCountdown();

  const applyState = (s) => {
    if (s.teams) setTeams(s.teams);
    if (typeof s.puzzleIdx === "number") setPuzzleIdx(s.puzzleIdx);
    if (s.playerTeams) setPlayerTeams(s.playerTeams);
  };

  /* ── persistence: load once, then autosave ── */
  useEffect(() => {
    (async () => {
      try {
        const saved = await store.get("tpl-event-state");
        if (saved && saved.value) applyState(JSON.parse(saved.value));
      } catch (e) { /* no saved state yet */ }
      setHydrated(true);
    })();
  }, []);

  /* ── spectators and non-admin viewers poll the shared JSON for live updates ── */
  useEffect(() => {
    if (!SPECTATOR && IS_ADMIN) return;
    const id = setInterval(async () => {
      try {
        const saved = await store.get("tpl-event-state");
        if (saved && saved.value) applyState(JSON.parse(saved.value));
      } catch (e) { /* server unreachable — keep last known state */ }
    }, 2000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!hydrated || SPECTATOR || !IS_ADMIN) return;
    const t = setTimeout(() => {
      store
        .set("tpl-event-state", JSON.stringify({ teams, puzzleIdx, playerTeams }))
        .catch(() => {});
    }, 400);
    return () => clearTimeout(t);
  }, [hydrated, teams, puzzleIdx, playerTeams]);

  const resetEvent = async () => {
    setTeams(DEFAULT_TEAMS);
    setPuzzleIdx(0);
    setPlayerTeams({});
    try { await store.delete("tpl-event-state"); } catch (e) { /* nothing saved */ }
  };

  const addPoints = (id, d) =>
    setTeams((ts) => ts.map((t) => (t.id === id ? { ...t, points: t.points + d } : t)));
  const rename = (id, name) => setTeams((ts) => ts.map((t) => (t.id === id ? { ...t, name } : t)));

  /* Bench = every default or reserve name not already on the board, so a
     saved state from a smaller roster can still grow into the full lineup. */
  const BENCH = [...DEFAULT_TEAMS.map(({ name, color }) => ({ name, color })), ...RESERVE_TEAMS];
  const benchFor = (ts) => BENCH.filter((b) => !ts.some((t) => t.name === b.name));
  const MAX_TEAMS = BENCH.length;
  const nextReserve = benchFor(teams)[0];
  const addTeam = () =>
    setTeams((ts) => {
      const reserve = benchFor(ts)[0];
      if (!reserve) return ts;
      const nextId = Math.max(...ts.map((t) => t.id)) + 1;
      return [...ts, { id: nextId, name: reserve.name, points: 0, color: reserve.color }];
    });

  const lastTeam = teams[teams.length - 1];
  const canRemoveLast = teams.length > 2 && lastTeam.points === 0;
  const removeLastTeam = () => {
    if (!canRemoveLast) return;
    setTeams((ts) => ts.slice(0, -1));
    setPlayerTeams((pt) =>
      Object.fromEntries(Object.entries(pt).filter(([, teamId]) => teamId !== lastTeam.id))
    );
  };

  const TABS = [
    ["teams", "TEAMS"],
    ["players", "PLAYERS"],
    ["rebus", "WAIT, WHAT?"],
  ];

  if (SPECTATOR)
    return (
      <div className="app">
        <div className="masthead">
          <div className="mast-slab">Once Upon a Wednesday</div>
          <div className="mast-meta">
            <span className="l1">LIVE STANDINGS</span>
            <span className="l2">50 players · 10 teams</span>
          </div>
        </div>
        <ScoreStrip teams={teams} />
        <Ticker teams={teams} />
      </div>
    );

  return (
    <div className="app">
      <div className="masthead">
        <div className="mast-slab">Once Upon a Wednesday</div>
        <div className="mast-meta">
          <span className="l1">HOST CONSOLE{!IS_ADMIN && <span className="view-chip">VIEW ONLY</span>}</span>
          <span className="l2">50 players · {teams.length} teams</span>
        </div>
        <div className="mast-actions">
          <button className="deck-skip" onClick={() => setShowQR(true)}>JOIN QR</button>
          {onBackToSlides && <button className="deck-skip" onClick={onBackToSlides}>← SLIDES</button>}
        </div>
      </div>

      <ScoreStrip teams={teams} />

      <div className="tabs">
        {TABS.map(([key, label]) => (
          <button key={key} className={`tab ${tab === key ? "active" : ""}`} onClick={() => setTab(key)}>
            {label}
          </button>
        ))}
      </div>

      {tab === "teams" && (
        <TeamsTab
          admin={IS_ADMIN} teams={teams} addPoints={addPoints} rename={rename} resetEvent={resetEvent}
          addTeam={addTeam} canAddTeam={teams.length < MAX_TEAMS} nextTeamName={nextReserve?.name}
          removeLastTeam={removeLastTeam} canRemoveLast={canRemoveLast}
        />
      )}
      {tab === "players" && <PlayersTab admin={IS_ADMIN} teams={teams} playerTeams={playerTeams} setPlayerTeams={setPlayerTeams} />}
      {tab === "rebus" && <RebusTab admin={IS_ADMIN} teams={teams} addPoints={addPoints} timer={timer} puzzleIdx={puzzleIdx} setPuzzleIdx={setPuzzleIdx} />}

      <Ticker teams={teams} />
      {showQR && <QROverlay onClose={() => setShowQR(false)} />}
    </div>
  );
}
