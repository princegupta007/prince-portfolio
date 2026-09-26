"use client";

import { useEffect } from "react";
import { PROFILE } from "@/content/profile";
import { isReduced } from "@/hooks/useReducedMotion";

/**
 * Preloader — 000→100 count over 780ms (cubic ease-out), bar fill, curtain
 * wipe (.done → translateY(-100%)), once per session.
 *
 * Session gate lives in the inline head script (layout.tsx): it adds
 * `html.pg-pre` only when sessionStorage has no "pg-seen" flag, and the CSS
 * hides #loader unless that class is present — so returning visitors and
 * no-JS visitors never see the curtain. Reduced motion skips it entirely
 * (CSS + this island). Body scroll is locked only while the curtain runs.
 */
const DUR = 780;

export function Preloader() {
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const loader = document.getElementById("loader");
    const root = document.documentElement;
    if (!loader || !root.classList.contains("pg-pre") || isReduced()) {
      root.classList.remove("pg-pre");
      document.body.classList.remove("loading");
      return;
    }
    const bar = document.getElementById("ldBar");
    const num = document.getElementById("ldNum");
    document.body.classList.add("loading");

    let t0: number | null = null;
    let raf = 0;
    const frame = (ts: number) => {
      if (t0 === null) t0 = ts;
      const p = Math.min((ts - t0) / DUR, 1);
      const e = 1 - Math.pow(1 - p, 3);
      if (bar) bar.style.width = `${e * 100}%`;
      if (num) num.textContent = String(Math.round(e * 100)).padStart(3, "0");
      if (p < 1) raf = requestAnimationFrame(frame);
      else {
        timers.push(
          setTimeout(() => {
            loader.classList.add("done");
            document.body.classList.remove("loading");
            timers.push(
              setTimeout(() => {
                loader.style.display = "none";
                root.classList.remove("pg-pre");
              }, 850),
            );
          }, 140),
        );
      }
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      document.body.classList.remove("loading");
    };
  }, []);

  return (
    <div id="loader" aria-hidden="true">
      <div className="ld-core">
        <div className="ld-mark">{PROFILE.monogram}</div>
        <div className="ld-bar">
          <i id="ldBar" />
        </div>
        <div className="ld-count">
          <span id="ldNum">000</span> — FRONTEND ENGINEER
        </div>
      </div>
    </div>
  );
}
