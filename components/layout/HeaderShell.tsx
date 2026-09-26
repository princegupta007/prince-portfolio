"use client";

import type { ReactNode } from "react";
import { useNav } from "@/components/interactive/NavProvider";
import { cn } from "@/lib/cn";

/** Applies the blurred/bordered stuck state after 10px of scroll (shared spy). */
export function HeaderShell({ children }: { children: ReactNode }) {
  const { scrolled } = useNav();
  return <header className={cn("hdr", scrolled && "stuck")}>{children}</header>;
}
