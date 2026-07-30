import { useState, useEffect, useRef } from "react";

/* ── countdown with total (for the ring) ── */
export function useCountdown() {
  const [seconds, setSeconds] = useState(0);
  const [total, setTotal] = useState(30);
  const [running, setRunning] = useState(false);
  const t = useRef(null);
  useEffect(() => {
    if (running && seconds > 0) t.current = setTimeout(() => setSeconds((s) => s - 1), 1000);
    else if (seconds === 0) setRunning(false);
    return () => clearTimeout(t.current);
  }, [running, seconds]);
  return {
    seconds, total, running,
    start: (s) => { setTotal(s); setSeconds(s); setRunning(true); },
    stop: () => setRunning(false),
    resume: () => seconds > 0 && setRunning(true),
    reset: () => { setRunning(false); setSeconds(0); },
  };
}
