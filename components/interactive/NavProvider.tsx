"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { SECTION_IDS } from "@/content/nav";
import { useScrolled } from "@/hooks/useScrolled";
import { useScrollSpy } from "@/hooks/useScrollSpy";

/**
 * One shared scroll listener pair for the whole shell (rule 30):
 * header stuck-state + scrollspy active id, consumed by HeaderNav/DotRail.
 */
type NavState = { active: string; scrolled: boolean };

const NavContext = createContext<NavState>({ active: "", scrolled: false });

export function useNav(): NavState {
  return useContext(NavContext);
}

export function NavProvider({ children }: { children: ReactNode }) {
  const active = useScrollSpy(SECTION_IDS);
  const scrolled = useScrolled(10);
  return (
    <NavContext.Provider value={{ active, scrolled }}>
      {children}
    </NavContext.Provider>
  );
}
