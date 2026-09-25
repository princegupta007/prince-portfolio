"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { CSSProperties } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { INDEX_ITEMS } from "@/content/nav";
import { CONTACT, CV_PATH } from "@/lib/constants";
import { cn } from "@/lib/cn";

/**
 * Burger (≤1080) + full-screen clip-path menu.
 * A11y: aria-expanded/controls, `inert` while closed (no tab traps),
 * Esc closes, focus returns to the burger, body scroll locked while open.
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const burger = useRef<HTMLButtonElement>(null);

  const close = useCallback((refocus: boolean) => {
    setOpen(false);
    if (refocus) burger.current?.focus();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <>
      <button
        ref={burger}
        type="button"
        className={cn("burger", open && "on")}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((o) => !o)}
      >
        <i />
        <i />
      </button>

      <div
        id="mobile-menu"
        className={cn("menu", open && "open")}
        aria-hidden={!open}
        inert={!open}
      >
        <nav
          className="m-links"
          aria-label="Mobile sections"
          onClick={() => close(false)}
        >
          {INDEX_ITEMS.map((item, idx) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              style={{ "--i": idx } as CSSProperties}
            >
              <em>{item.num}</em>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="m-foot">
          <div className="m-cta">
            <Button
              href={CV_PATH}
              download
              icon={<Icon name="download" size={14} />}
            >
              Download CV
            </Button>
            <Button
              href={CONTACT.emailHref}
              variant="ghost"
              icon={<Icon name="mail" size={14} />}
            >
              Email me
            </Button>
          </div>
          <div className="m-meta">
            <a href={CONTACT.github} target="_blank" rel="noopener noreferrer">
              github.com/princegupta007
            </a>
            <br />
            <a
              href={CONTACT.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              linkedin.com/in/princegupta7
            </a>
            <br />
            {CONTACT.location} · {CONTACT.phone}
          </div>
        </div>
      </div>
    </>
  );
}
