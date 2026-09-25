"use client";

import { useEffect } from "react";
import { isReduced } from "@/hooks/useReducedMotion";

/**
 * Experience rail fill — lime line grows with scroll through .tl-right
 * (prototype formula, rAF-throttled passive scroll). Reduced motion: the
 * fill stays at full height so the timeline reads complete and static.
 */
export function TimelineFill() {
  useEffect(() => {
    const rail = document.getElementById("tlRight");
    const fill = document.getElementById("tlFill");
    if (!rail || !fill) return;

    if (isReduced()) {
      fill.style.height = `${rail.getBoundingClientRect().height - 16}px`;
      return;
    }

    let ticking = false;
    const paint = () => {
      const r = rail.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, (window.innerHeight * 0.55 - r.top) / (r.height || 1)));
      fill.style.height = `${p * (r.height - 16)}px`;
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(paint);
      }
    };
    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return null;
}
