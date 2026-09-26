"use client";

import { useEffect, useRef } from "react";
import { formatCount, onHalfVisible, runCountUp } from "@/hooks/useCountUp";
import { isReduced } from "@/hooks/useReducedMotion";

/**
 * Animated counter (02 · Numbers). SSR renders the final formatted value;
 * on mount, if motion is allowed and the metric is still below the fold, the
 * island resets to 0 before paint and counts up once at 50% visibility.
 * Reduced motion / no IO → the final value simply stays.
 */
export function Counter({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || isReduced()) return;
    const belowFold = el.getBoundingClientRect().top > window.innerHeight * 0.5;
    if (belowFold) el.textContent = formatCount(0, decimals);
    let cancel: () => void = () => {};
    const stop = onHalfVisible(el, () => {
      cancel = runCountUp(el, value, decimals);
    });
    return () => {
      stop();
      cancel();
    };
  }, [value, decimals]);

  return (
    <span ref={ref} data-count={value} data-dec={decimals || undefined}>
      {formatCount(value, decimals)}
    </span>
  );
}
