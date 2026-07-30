import { useLayoutEffect, useRef } from "react";

/* ── FLIP reorder animation for standings rows ── */
export function useFlip(depKey) {
  const nodes = useRef(new Map());
  const prev = useRef(new Map());
  useLayoutEffect(() => {
    nodes.current.forEach((el, key) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const p = prev.current.get(key);
      if (p) {
        const dx = p.left - rect.left, dy = p.top - rect.top;
        if (dx || dy)
          el.animate(
            [{ transform: `translate(${dx}px,${dy}px)` }, { transform: "none" }],
            { duration: 520, easing: "cubic-bezier(0.22,1,0.36,1)" }
          );
      }
      prev.current.set(key, rect);
    });
  }, [depKey]);
  return (key) => (el) => { if (el) nodes.current.set(key, el); };
}
