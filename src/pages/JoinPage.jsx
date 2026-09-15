import { useState, useEffect } from "react";

const savedPlayer = () => {
  try { return JSON.parse(localStorage.getItem("funfriday-player")); } catch (e) { return null; }
};

/* The page behind the QR code: asks for a name, registers it with
   /api/players, and remembers the registration on this phone. Registered
   players can rename themselves; if the host removed them meanwhile,
   the page falls back to the join form. */
export function JoinPage() {
  const [player, setPlayer] = useState(savedPlayer);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [myTeam, setMyTeam] = useState(null);

  /* Once registered, the phone syncs only when the page is opened or
     brought back to the foreground, at most once a minute — never a
     background poll, to stay inside the Hobby-plan storage budget.
     Each visit reads the shared state (to reveal the team) and the
     registry (to notice if the host removed this player). A missing entry
     is confirmed with a second read a few seconds later, so a momentary
     hiccup right after joining can't kick a real player out. */
  useEffect(() => {
    if (!player) return;
    let last = 0;
    let cancelled = false;
    const readTeam = async () => {
      const r = await fetch("/api/state", { cache: "no-store" });
      if (r.ok && r.headers.get("x-event-state")) {
        const s = await r.json();
        const teamId = s.playerTeams?.[player.id];
        setMyTeam(teamId !== undefined ? s.teams?.find((t) => t.id === teamId) ?? null : null);
      }
    };
    const stillListed = async () => {
      const r = await fetch("/api/players", { cache: "no-store" });
      if (!r.ok || !r.headers.get("x-event-state")) return true;
      return (await r.json()).some((p) => p.id === player.id);
    };
    const sync = async () => {
      if (document.visibilityState !== "visible" || Date.now() - last < 60000) return;
      last = Date.now();
      try {
        await readTeam();
        if (await stillListed()) return;
        await new Promise((res) => setTimeout(res, 3000));
        if (cancelled || (await stillListed())) return;
        localStorage.removeItem("funfriday-player");
        setPlayer(null);
        setEditing(false);
        setMyTeam(null);
        setError("The host removed your entry — join again");
      } catch (e) { /* offline — try again next visit */ }
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => { cancelled = true; document.removeEventListener("visibilitychange", sync); };
  }, [player?.id]);

  const submit = async (e) => {
    e.preventDefault();
    const clean = name.trim();
    if (!clean || busy) return;
    setBusy(true);
    setError("");
    try {
      const renaming = editing && player;
      const r = await fetch("/api/players", {
        method: renaming ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(renaming ? { id: player.id, name: clean } : { name: clean }),
      });
      if (r.status === 404 && renaming) {
        localStorage.removeItem("funfriday-player");
        setPlayer(null);
        setEditing(false);
        setError("The host removed your entry — join again");
        setBusy(false);
        return;
      }
      if (r.status === 409) {
        setError("That name's already taken — add a surname or a nickname");
        setBusy(false);
        return;
      }
      if (!r.ok) throw new Error(await r.text());
      const p = await r.json();
      localStorage.setItem("funfriday-player", JSON.stringify(p));
      setPlayer(p);
      setEditing(false);
      setName("");
    } catch (err) {
      setError("Something went wrong — check the Wi-Fi and try again");
    }
    setBusy(false);
  };

  const showForm = !player || editing;
  return (
    <div className="deck">
      <div className="deck-slide">
        {showForm ? (
          <form className="slide center" onSubmit={submit}>
            <div className="sl-kicker">ONCE UPON A WEDNESDAY</div>
            <div className="sl-mast" style={{ fontSize: "clamp(28px,5vw,56px)" }}>
              {editing ? "Change your name" : "Enter the league"}
            </div>
            <input
              className="join-input"
              placeholder={editing ? player.name : "Your name"}
              value={name}
              maxLength={40}
              autoFocus
              onChange={(e) => setName(e.target.value)}
            />
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
              <button className="btn gold sl-cta" type="submit" disabled={busy || !name.trim()}>
                {busy ? "SAVING…" : editing ? "UPDATE →" : "I'M IN →"}
              </button>
              {editing && (
                <button className="btn ghost sl-cta" type="button" onClick={() => { setEditing(false); setName(""); setError(""); }}>
                  CANCEL
                </button>
              )}
            </div>
            {error && <div className="join-error">{error}</div>}
          </form>
        ) : (
          <div className="slide center">
            <div className="sl-kicker">YOU'RE ON THE TEAMSHEET</div>
            <div className="sl-mast" style={{ fontSize: "clamp(30px,6vw,64px)" }}>{player.name}</div>
            {myTeam ? (
              <>
                <div className="sl-sub">Your team</div>
                <div className="join-team" style={{ borderColor: myTeam.color, color: myTeam.color }}>{myTeam.name}</div>
              </>
            ) : (
              <>
                <div className="sl-sub">Registration confirmed</div>
                <div className="sl-meta">HANG TIGHT · TEAMS DROP ON THIS SCREEN</div>
              </>
            )}
            <button className="btn ghost" onClick={() => { setEditing(true); setName(player.name); }}>
              Change my name
            </button>
            {error && <div className="join-error">{error}</div>}
          </div>
        )}
      </div>
    </div>
  );
}
