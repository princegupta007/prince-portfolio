"use client";

import { useEffect } from "react";
import { isFinePointer, isReduced } from "@/hooks/useReducedMotion";

/**
 * Hero pointer effects (prototype parity):
 *  - accent glow follows the cursor: --gx/--gy on #heroGlow
 *  - depth parallax: [data-depth] layers inside #heroVisual get --tx/--ty
 *    (CSS composes them into their transforms)
 *  - specimen canvas tilt: --rx/--ry deg on #heroCanvas (composed with its
 *    static base rotation in CSS)
 * pointer:fine only; inert under reduced motion; rAF-throttled.
 */
export function HeroFx() {
  useEffect(() => {
    if (isReduced() || !isFinePointer()) return;
    const hero = document.getElementById("hero");
    const glow = document.getElementById("heroGlow");
    const visual = document.getElementById("heroVisual");
    const canvas = document.getElementById("heroCanvas");
    if (!hero) return;
    const layers = visual ? Array.from(visual.querySelectorAll<HTMLElement>("[data-depth]")) : [];

    let ticking = false;
    let cx = 0;
    let cy = 0;
    const paint = () => {
      ticking = false;
      if (glow) {
        glow.style.setProperty("--gx", `${(cx * 100).toFixed(2)}%`);
        glow.style.setProperty("--gy", `${(cy * 100).toFixed(2)}%`);
      }
      if (visual && visual.getBoundingClientRect().top < window.innerHeight) {
        for (const el of layers) {
          const d = Number(el.dataset.depth) || 10;
          el.style.setProperty("--tx", `${((cx - 0.5) * d * -1.4).toFixed(1)}px`);
          el.style.setProperty("--ty", `${((cy - 0.5) * d * -1.1).toFixed(1)}px`);
        }
        if (canvas) {
          canvas.style.setProperty("--rx", `${((cx - 0.5) * 7).toFixed(2)}deg`);
          canvas.style.setProperty("--ry", `${((cy - 0.5) * -5).toFixed(2)}deg`);
        }
      }
    };
    const onMove = (e: PointerEvent) => {
      const r = hero.getBoundingClientRect();
      cx = (e.clientX - r.left) / r.width;
      cy = (e.clientY - r.top) / r.height;
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(paint);
      }
    };
    hero.addEventListener("pointermove", onMove, { passive: true });
    return () => hero.removeEventListener("pointermove", onMove);
  }, []);
  return null;
}
