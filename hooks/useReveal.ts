"use client";

/**
 * Shared reveal observer (prototype parameters: threshold .12, rootMargin
 * -6%). One module-level IntersectionObserver for every `.reveal` / `.lines`
 * element on the page; elements unobserve themselves once revealed.
 *
 * no-JS safety (documented decision D19): the hidden state lives behind an
 * `html.js` class that an inline head script adds before first paint, so
 * without JavaScript (or before hydration) nothing is ever invisible — the
 * CSS rules are `.js .reveal{…hidden…}` / `.js .lines .ln>span{…}`.
 */

let io: IntersectionObserver | null = null;

function observer(): IntersectionObserver | null {
  if (typeof window === "undefined" || !("IntersectionObserver" in window)) return null;
  if (!io) {
    io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io?.unobserve(en.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
  }
  return io;
}

/** Observe every reveal/line-mask element currently in the document. */
export function observeReveals(root: ParentNode = document): void {
  const o = observer();
  const els = root.querySelectorAll<HTMLElement>(".reveal, .lines");
  els.forEach((el) => {
    if (el.classList.contains("in")) return;
    if (o) o.observe(el);
    else el.classList.add("in");
  });
}
