"use client";

import { useEffect, useRef } from "react";
import { isReduced } from "./useReducedMotion";

/**
 * Auto-cycle driver (hero canvas 2.9s, wiring 4.6s, role visual 1.7s).
 * Guarantees from the plan: pauses off-screen (IntersectionObserver) AND on
 * document.hidden; interval cleaned on unmount; never runs under reduced
 * motion; `handoff()` permanently stops the cycle after user interaction.
 */
export function useAutoCycle(
  ms: number,
  tick: () => void,
  watch: Element | null,
  threshold = 0.15,
): { handoff: () => void } {
  const stopped = useRef(false);
  const tickRef = useRef(tick);
  const stopRef = useRef<() => void>(() => {});

  // keep the latest tick without writing refs during render
  useEffect(() => {
    tickRef.current = tick;
  });

  useEffect(() => {
    if (isReduced() || !watch) return;

    let timer: ReturnType<typeof setInterval> | null = null;
    const start = () => {
      if (stopped.current || timer) return;
      timer = setInterval(() => {
        if (!document.hidden) tickRef.current();
      }, ms);
    };
    const stop = () => {
      if (timer) clearInterval(timer);
      timer = null;
    };
    stopRef.current = stop;

    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);

    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver((en) => (en[0]?.isIntersecting ? start() : stop()), {
        threshold,
      });
      io.observe(watch);
    } else {
      start();
    }

    return () => {
      stop();
      io?.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [ms, watch, threshold]);

  return {
    handoff: () => {
      stopped.current = true;
      stopRef.current();
    },
  };
}
