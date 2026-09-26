"use client";

import { useEffect } from "react";
import { isReduced } from "@/hooks/useReducedMotion";

/**
 * Experience rail fill — lime line grows with scroll through .tl-right.
 *
 * The visual rail has an 8px cap at either end. Keep the fill tied to the
 * measured rail height rather than a one-time viewport measurement: font
 * loading, wrapped role copy, and responsive column changes can all alter the
 * timeline after hydration. The scroll handler remains rAF-throttled.
 */
export function TimelineFill() {
  useEffect(() => {
    const rail = document.getElementById("tlRight");
    const fill = document.getElementById("tlFill");
    if (!rail || !fill) return;

    const cap = 16;
    const reduced = isReduced();
    let frame = 0;

    const usableHeight = () =>
      Math.max(0, rail.getBoundingClientRect().height - cap);
    const paint = () => {
      frame = 0;
      const bounds = rail.getBoundingClientRect();
      const progress = reduced
        ? 1
        : Math.max(
            0,
            Math.min(
              1,
              (window.innerHeight * 0.55 - bounds.top) / (bounds.height || 1),
            ),
          );
      fill.style.height = `${progress * usableHeight()}px`;
    };
    const requestPaint = () => {
      if (!frame) frame = window.requestAnimationFrame(paint);
    };

    const resizeObserver = new ResizeObserver(requestPaint);
    resizeObserver.observe(rail);
    document.fonts?.ready.then(requestPaint).catch(() => undefined);
    requestPaint();

    if (reduced) {
      return () => {
        resizeObserver.disconnect();
        if (frame) window.cancelAnimationFrame(frame);
      };
    }

    window.addEventListener("scroll", requestPaint, { passive: true });
    window.addEventListener("resize", requestPaint, { passive: true });
    return () => {
      resizeObserver.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestPaint);
      window.removeEventListener("resize", requestPaint);
    };
  }, []);
  return null;
}
