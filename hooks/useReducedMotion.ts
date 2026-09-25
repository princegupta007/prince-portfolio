"use client";

import { useSyncExternalStore } from "react";

/**
 * Reactive prefers-reduced-motion. Every motion effect in Phase 5 gates on
 * this; CSS additionally collapses everything under the media query, so a
 * reduced-motion visitor gets the complete static page even before hydration.
 */

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(cb: () => void): () => void {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

const get = (): boolean => window.matchMedia(QUERY).matches;
const getServer = (): boolean => false;

export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, get, getServer);
}

export function isReduced(): boolean {
  return typeof window !== "undefined" && window.matchMedia(QUERY).matches;
}

export function isFinePointer(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;
}
