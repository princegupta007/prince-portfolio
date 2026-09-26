"use client";

import { usePointerGlow } from "@/hooks/usePointerGlow";

/**
 * Pointer micro-interaction layer: one delegated pointermove drives the
 * card spotlight vars (--mx/--my) and magnetic button translate (±6px).
 * pointer:fine only; fully inert under prefers-reduced-motion.
 */
export function InteractionLayer() {
  usePointerGlow();
  return null;
}
