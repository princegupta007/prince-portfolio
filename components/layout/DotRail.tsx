"use client";

import { useNav } from "@/components/interactive/NavProvider";
import { RAIL_ITEMS } from "@/content/nav";

/** Fixed right dot rail (≥1280): hover labels + active lime ring. */
export function DotRail() {
  const { active } = useNav();
  return (
    <nav className="rail" aria-label="Section navigation">
      {RAIL_ITEMS.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          data-sec={item.id}
          className={active === item.id ? "active" : undefined}
          aria-current={active === item.id ? "true" : undefined}
        >
          <span>{item.label}</span>
          <i />
        </a>
      ))}
    </nav>
  );
}
