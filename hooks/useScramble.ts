"use client";

/**
 * Scramble rotator (prototype: 5 words @3.6s, glyph queue with random
 * start/end frames, opacity-.5 noise chars). Pauses while document.hidden;
 * reduced motion → static first word (no cycling at all).
 */

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&<>[]{}/=*+·";
const INTERVAL = 3600;

type Q = { from: string; to: string; start: number; end: number; ch: string | null };

export function scrambleTo(el: HTMLElement, text: string): () => void {
  const old = el.textContent ?? "";
  const len = Math.max(old.length, text.length);
  const queue: Q[] = [];
  for (let i = 0; i < len; i++) {
    queue.push({
      from: old[i] ?? "",
      to: text[i] ?? "",
      start: Math.floor(Math.random() * 12),
      end: Math.floor(Math.random() * 16) + 14,
      ch: null,
    });
  }
  let frame = 0;
  let raf = 0;
  const tick = () => {
    let out = "";
    let done = 0;
    for (const q of queue) {
      if (frame >= q.end) {
        out += q.to;
        done++;
      } else if (frame >= q.start) {
        if (!q.ch || Math.random() < 0.32) q.ch = CHARS[Math.floor(Math.random() * CHARS.length)] ?? "·";
        out += `<span style="opacity:.5">${q.ch}</span>`;
      } else {
        out += q.from;
      }
    }
    el.innerHTML = out;
    if (done < queue.length) {
      frame++;
      raf = requestAnimationFrame(tick);
    } else {
      el.textContent = text;
    }
  };
  tick();
  return () => cancelAnimationFrame(raf);
}

/** Cycles words on `el` every 3.6s; returns stop(). */
export function startScrambleCycle(el: HTMLElement, words: readonly string[]): () => void {
  let idx = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let cancelScramble: (() => void) | null = null;
  const next = () => {
    idx = (idx + 1) % words.length;
    cancelScramble = scrambleTo(el, words[idx] ?? words[0] ?? "");
    timer = setTimeout(next, INTERVAL);
  };
  const onVis = () => {
    if (timer) clearTimeout(timer);
    if (!document.hidden) timer = setTimeout(next, INTERVAL);
  };
  timer = setTimeout(next, INTERVAL);
  document.addEventListener("visibilitychange", onVis);
  return () => {
    if (timer) clearTimeout(timer);
    cancelScramble?.();
    document.removeEventListener("visibilitychange", onVis);
  };
}
