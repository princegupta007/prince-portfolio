"use client";

import { useEffect, useRef } from "react";
import { startScrambleCycle } from "@/hooks/useScramble";
import { isReduced } from "@/hooks/useReducedMotion";

/**
 * Hero rotator word. SSR renders words[0]; the scramble cycle (3.6s) starts
 * after mount, pauses on document.hidden, and never runs under reduced
 * motion (the first word simply stays).
 */
export function ScrambleWord({ words }: { words: readonly string[] }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || isReduced()) return;
    return startScrambleCycle(el, words);
  }, [words]);

  return (
    <span className="rot" id="rotator" ref={ref}>
      {words[0]}
    </span>
  );
}
