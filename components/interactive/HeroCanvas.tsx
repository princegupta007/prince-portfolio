"use client";

import type { CSSProperties } from "react";
import { Icon } from "@/components/ui/Icon";
import { HERO_CANVAS, HERO_FLOAT_CHIPS } from "@/content/hero";

/**
 * Hero specimen canvas — Phase 4 renders the STATIC super-admin state
 * (8 nav skeletons lit, scope "all records", 8/8 modules, contacts visible).
 * Client island per the phase island-map: Phase 5 adds the 2.9s role cycle
 * and pointer parallax inside this same shell (data already in content/hero.ts).
 * Purely decorative — the parent .hero-visual carries aria-hidden.
 */
export function HeroCanvas() {
  return (
    <div className="cv-wrap" data-depth="14">
      <div className="canvas" id="heroCanvas">
        <div className="scan" />
        <div className="cv-chrome">
          <span className="tl-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="cv-url">{HERO_CANVAS.badge}</span>
          <span className="cv-role" id="hcRole">
            {HERO_CANVAS.role}
          </span>
        </div>
        <div className="cv-body">
          <div className="cv-side" id="hcNav">
            {HERO_CANVAS.navSkels.map((w, i) => (
              <div
                key={i}
                className="nav-skel on"
                style={{ "--w": `${w}%` } as CSSProperties}
              />
            ))}
          </div>
          <div className="cv-main">
            <div className="cv-head">
              <span className="cv-title-bar" />
              <span className="cv-scope" id="hcScope">
                {HERO_CANVAS.scope}
              </span>
            </div>
            <div className="cv-rows">
              {HERO_CANVAS.rows.map((row) => (
                <div className="cv-row" key={row.st}>
                  <span
                    className="cv-cellbar"
                    style={{ "--w": row.w } as CSSProperties}
                  />
                  <span className={row.mut ? "cv-st mut" : "cv-st"}>
                    {row.st}
                  </span>
                  <span className="cv-contact hc-contact">
                    {HERO_CANVAS.contact}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="cv-foot">
          <span>{HERO_CANVAS.footLeft}</span>
          <span>
            <b id="hcMods">{HERO_CANVAS.mods}</b> {HERO_CANVAS.modsLabel}
          </span>
        </div>
      </div>
      {HERO_FLOAT_CHIPS.map((fc) => (
        <div
          key={fc.pos}
          className={`float-chip ${fc.pos}`}
          data-depth={fc.depth}
        >
          <span
            className="fc-ico"
            style={
              fc.good
                ? ({
                    background:
                      "color-mix(in srgb,var(--good) 12%,transparent)",
                    borderColor:
                      "color-mix(in srgb,var(--good) 38%,transparent)",
                    color: "var(--good)",
                  } as CSSProperties)
                : undefined
            }
          >
            <Icon name={fc.icon} size={15} />
          </span>
          <span>
            <b>{fc.b}</b>
            <small>{fc.small}</small>
          </span>
        </div>
      ))}
    </div>
  );
}
