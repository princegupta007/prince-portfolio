"use client";

import { Icon } from "@/components/ui/Icon";

/** Smooth scroll-to-top; instant under prefers-reduced-motion (rule 40). */
export function BackToTop() {
  return (
    <button
      type="button"
      className="to-top"
      aria-label="Back to top"
      onClick={() => {
        const reduce = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      }}
    >
      <Icon name="arrow-up" size={16} />
    </button>
  );
}
