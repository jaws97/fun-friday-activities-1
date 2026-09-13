import { useState, useEffect } from "react";

/* ─────────────────────────────────────────────────────────────
   WEDNESDAY PREMIER LEAGUE · Host Console
   Broadcast-graphics build: skewed gold slabs, condensed
   numerals, FLIP-animated standings, timer ring, ticker tape,
   full-screen +4 takeover. Physical Uno deck; console logs draws.
───────────────────────────────────────────────────────────── */

import "./styles.css";
import { DEFAULT_TEAMS, RESERVE_TEAMS } from "./data/teams.js";
import { store } from "./lib/store.js";
import { useCountdown } from "./hooks/useCountdown.js";
import { ScoreStrip } from "./components/ScoreStrip.jsx";
import { Ticker } from "./components/Ticker.jsx";
import { Plus4Overlay } from "./components/Plus4Overlay.jsx";
import { QROverlay } from "./components/QROverlay.jsx";
import { TeamsTab } from "./tabs/TeamsTab.jsx";
import { PlayersTab } from "./tabs/PlayersTab.jsx";
import { AuctionTab } from "./tabs/AuctionTab.jsx";
import { RebusTab } from "./tabs/RebusTab.jsx";
import { ForfeitsTab } from "./tabs/ForfeitsTab.jsx";
import { CaptainsCallTab } from "./tabs/CaptainsCallTab.jsx";

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
  const [drawLog, setDrawLog] = useState([]);
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const [captainsCall, setCaptainsCall] = useState({ holder: null, used: false, power: null });
  const [auctionRound, setAuctionRound] = useState(1);
  const [plus4Team, setPlus4Team] = useState(null);
  const [playerTeams, setPlayerTeams] = useState({});
  const [hydrated, setHydrated] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const timer = useCountdown();

  const applyState = (s) => {
    if (s.teams) setTeams(s.teams);
    if (s.drawLog) setDrawLog(s.drawLog);
    if (s.captainsCall) setCaptainsCall(s.captainsCall);
    if (s.auctionRound) setAuctionRound(s.auctionRound);
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
        .set("tpl-event-state", JSON.stringify({ teams, drawLog, captainsCall, auctionRound, puzzleIdx, playerTeams }))
        .catch(() => {});
    }, 400);
    return () => clearTimeout(t);
  }, [hydrated, teams, drawLog, captainsCall, auctionRound, puzzleIdx, playerTeams]);

  const resetEvent = async () => {
    setTeams(DEFAULT_TEAMS);
    setDrawLog([]);
    setCaptainsCall({ holder: null, used: false, power: null });
    setAuctionRound(1);
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
  const canRemoveLast =
    teams.length > 2 &&
    lastTeam.points === 0 &&
    !drawLog.some((d) => d.teamId === lastTeam.id) &&
    captainsCall.holder !== lastTeam.id;
  const removeLastTeam = () => {
    if (!canRemoveLast) return;
    setTeams((ts) => ts.slice(0, -1));
    setPlayerTeams((pt) =>
      Object.fromEntries(Object.entries(pt).filter(([, teamId]) => teamId !== lastTeam.id))
    );
  };

  const logDraw = (teamId, cardType) => {
    setDrawLog((l) => [{ teamId, cardType }, ...l]);
    if (cardType === "plus4") setPlus4Team(teams.find((t) => t.id === teamId));
  };
  const undoDraw = () => setDrawLog((l) => l.slice(1));

  const leader = [...teams].sort((a, b) => b.points - a.points)[0];

  const TABS = [
    ["teams", "TEAMS"],
    ["players", "PLAYERS"],
    ["auction", "TOO GOOD TO BE TRUE"],
    ["rebus", "WAIT, WHAT?"],
    ["uno", "FORFEITS"],
    ["call", "CAPTAIN'S CALL"],
  ];

  if (SPECTATOR)
    return (
      <div className="app">
        <div className="masthead">
          <div className="mast-slab">Once Upon a Wednesday</div>
          <div className="mast-meta">
            <span className="l1">LIVE STANDINGS</span>
            <span className="l2">Jaws & Friends · 50 players · 10 teams</span>
          </div>
        </div>
        <ScoreStrip teams={teams} captainsCall={captainsCall} />
        <Ticker teams={teams} captainsCall={captainsCall} drawLog={drawLog} />
      </div>
    );

  return (
    <div className="app">
      <div className="masthead">
        <div className="mast-slab">Once Upon a Wednesday</div>
        <div className="mast-meta">
          <span className="l1">HOST CONSOLE{!IS_ADMIN && <span className="view-chip">VIEW ONLY</span>}</span>
          <span className="l2">Jaws & Friends · 50 players · {teams.length} teams</span>
        </div>
        <div className="mast-actions">
          <button className="deck-skip" onClick={() => setShowQR(true)}>JOIN QR</button>
          {onBackToSlides && <button className="deck-skip" onClick={onBackToSlides}>← SLIDES</button>}
        </div>
      </div>

      <ScoreStrip teams={teams} captainsCall={captainsCall} />

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
      {tab === "auction" && <AuctionTab admin={IS_ADMIN} teams={teams} addPoints={addPoints} timer={timer} auctionRound={auctionRound} setAuctionRound={setAuctionRound} />}
      {tab === "rebus" && <RebusTab admin={IS_ADMIN} teams={teams} addPoints={addPoints} timer={timer} puzzleIdx={puzzleIdx} setPuzzleIdx={setPuzzleIdx} />}
      {tab === "uno" && <ForfeitsTab admin={IS_ADMIN} teams={teams} drawLog={drawLog} logDraw={logDraw} undoDraw={undoDraw} />}
      {tab === "call" && <CaptainsCallTab admin={IS_ADMIN} teams={teams} leader={leader} captainsCall={captainsCall} setCaptainsCall={setCaptainsCall} />}

      <Ticker teams={teams} captainsCall={captainsCall} drawLog={drawLog} />
      {plus4Team && <Plus4Overlay team={plus4Team} onDone={() => setPlus4Team(null)} />}
      {showQR && <QROverlay onClose={() => setShowQR(false)} />}
    </div>
  );
}
