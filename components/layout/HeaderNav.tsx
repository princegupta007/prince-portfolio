"use client";

import { useNav } from "@/components/interactive/NavProvider";
import { HEADER_NAV } from "@/content/nav";

/** Inline nav (≥1080). Active underline wipe driven by the shared scrollspy. */
export function HeaderNav() {
  const { active } = useNav();
  return (
    <nav className="nav" aria-label="Sections">
      {HEADER_NAV.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={active === item.id ? "active" : undefined}
          aria-current={active === item.id ? "true" : undefined}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
