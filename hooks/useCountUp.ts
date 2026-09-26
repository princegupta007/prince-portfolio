"use client";

/**
 * Count-up (prototype: 1.5s easeOutQuart, starts at 50% visibility, once).
 * Phase 5 animates; the SSR string stays the FINAL formatted value so the
 * page is correct without JS — the Counter island resets to 0 in a layout
 * effect only when the element is still below the fold (no visible flash).
 */

const DUR = 1500;

export function formatCount(v: number, dec: number): string {
  return dec ? v.toFixed(dec) : Math.round(v).toLocaleString("en-US");
}

export function runCountUp(
  el: HTMLElement,
  target: number,
  dec: number,
  onDone?: () => void,
): () => void {
  let t0: number | null = null;
  let raf = 0;
  const step = (ts: number) => {
    if (t0 === null) t0 = ts;
    const p = Math.min((ts - t0) / DUR, 1);
    const e = 1 - Math.pow(1 - p, 4); // easeOutQuart
    el.textContent = formatCount(target * e, dec);
    if (p < 1) raf = requestAnimationFrame(step);
    else onDone?.();
  };
  raf = requestAnimationFrame(step);
  return () => cancelAnimationFrame(raf);
}

/** One-shot IO at 50% visibility; returns a disconnect fn. */
export function onHalfVisible(el: Element, cb: () => void): () => void {
  if (!("IntersectionObserver" in window)) {
    cb();
    return () => {};
  }
  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((en) => en.isIntersecting)) {
        io.disconnect();
        cb();
      }
    },
    { threshold: 0.5 },
  );
  io.observe(el);
  return () => io.disconnect();
}
