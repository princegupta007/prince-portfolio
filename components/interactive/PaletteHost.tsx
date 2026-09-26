"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { IslandBoundary } from "@/components/interactive/IslandBoundary";

/**
 * Palette host — the dialog chunk is fetched on FIRST invocation only
 * (⌘K / Ctrl+K, click on any [data-open-cmd] trigger, or hover-intent on
 * that trigger which preloads without opening), keeping it out of the
 * initial bundle. Delegated listeners mean the server-rendered header
 * button needs no client code of its own.
 */
const CommandPalette = dynamic(
  () => import("./CommandPalette").then((m) => m.CommandPalette),
  { ssr: false },
);

export function PaletteHost() {
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const req = () => {
      setLoaded(true);
      setOpen(true);
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        req();
      }
    };
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element | null)?.closest?.("[data-open-cmd]")) req();
    };
    let hoverTimer: ReturnType<typeof setTimeout> | null = null;
    const onOver = (e: PointerEvent) => {
      if (!(e.target as Element | null)?.closest?.("[data-open-cmd]")) return;
      if (hoverTimer) return;
      hoverTimer = setTimeout(() => setLoaded(true), 220); // preload intent
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    document.addEventListener("pointerover", onOver, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
      document.removeEventListener("pointerover", onOver);
      if (hoverTimer) clearTimeout(hoverTimer);
    };
  }, []);

  if (!loaded) return null;
  return (
    <IslandBoundary label="palette" fallback={null}>
      <CommandPalette open={open} onClose={() => setOpen(false)} />
    </IslandBoundary>
  );
}
