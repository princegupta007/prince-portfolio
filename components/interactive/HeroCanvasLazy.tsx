"use client";

import dynamic from "next/dynamic";

/**
 * Phase-09 (D37): client-side lazy mount for the decorative canvas so its
 * chunk + animation boot land after hydration. Server components cannot use
 * next/dynamic with ssr:false, hence this thin client wrapper.
 */
export const HeroCanvasLazy = dynamic(
  () => import("@/components/interactive/HeroCanvas").then((m) => m.HeroCanvas),
  { ssr: false },
);
