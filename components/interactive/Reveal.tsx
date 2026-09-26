"use client";

import { useEffect } from "react";
import { observeReveals } from "@/hooks/useReveal";
import { isReduced } from "@/hooks/useReducedMotion";

/**
 * Reveal root — mounts once (layout). Watches every `.reveal` / `.lines`
 * element with the shared IntersectionObserver and adds `.in` on entry.
 * Reduced motion or missing IO → everything is revealed immediately.
 * The hidden state itself is gated behind `html.js` (see hooks/useReveal.ts),
 * so server HTML and no-JS visitors always see complete content.
 */
export function Reveal() {
  useEffect(() => {
    if (isReduced()) {
      document
        .querySelectorAll<HTMLElement>(".reveal, .lines")
        .forEach((el) => el.classList.add("in"));
      return;
    }
    observeReveals();
  }, []);
  return null;
}
