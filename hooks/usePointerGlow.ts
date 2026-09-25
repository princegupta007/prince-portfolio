"use client";

import { useEffect } from "react";
import { isFinePointer, isReduced } from "./useReducedMotion";

const GLOW_SEL = ".bento .card, .pr, .stack-card, .edu";
const MAGNET_SEL = ".magnetic";
const MAGNET_MAX = 6; // ±6px per plan

/**
 * ONE delegated pointermove (pointer:fine only, off under reduced motion):
 *  - card spotlight: sets --mx/--my on the hovered glow-card
 *  - magnetic buttons: translate toward the cursor, clamped to ±6px,
 *    released on pointerout
 */
export function usePointerGlow(): void {
  useEffect(() => {
    if (isReduced() || !isFinePointer()) return;

    let lastMagnet: HTMLElement | null = null;
    const release = (el: HTMLElement) => {
      el.style.transform = "";
    };

    const onMove = (e: PointerEvent) => {
      const t = e.target as Element | null;
      const card = t?.closest?.(GLOW_SEL) as HTMLElement | null;
      if (card) {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      }
      const magnet = t?.closest?.(MAGNET_SEL) as HTMLElement | null;
      if (magnet !== lastMagnet) {
        if (lastMagnet) release(lastMagnet);
        lastMagnet = magnet;
      }
      if (magnet) {
        const r = magnet.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const clamp = (v: number) => Math.max(-MAGNET_MAX, Math.min(MAGNET_MAX, v));
        magnet.style.transform = `translate(${clamp(dx * 0.14).toFixed(1)}px, ${clamp(dy * 0.22).toFixed(1)}px)`;
      }
    };
    const onOut = (e: PointerEvent) => {
      const t = e.target as Element | null;
      const magnet = t?.closest?.(MAGNET_SEL) as HTMLElement | null;
      if (magnet && !(e.relatedTarget as Element | null)?.closest?.(MAGNET_SEL)) {
        release(magnet);
        if (lastMagnet === magnet) lastMagnet = null;
      }
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerout", onOut, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerout", onOut);
      if (lastMagnet) release(lastMagnet);
    };
  }, []);
}
