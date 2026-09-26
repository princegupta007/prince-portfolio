# Rule 40 — Accessibility (first-class requirement; WCAG 2.2 AA)

## Non-negotiables

- **axe-core: 0 violations** on `/` in both themes AND open states (mobile menu, command palette, exhibit after role switch). No suppressions without owner approval + filed reason.
- Full keyboard operability: every interactive reachable and operable; visible `:focus-visible` ring (2px accent, offset 3px) in BOTH themes, never clipped by overflow containers; focus restored after menu/palette close; no keyboard traps.
- `prefers-reduced-motion: reduce` collapses ALL motion to a complete static page (reveals shown, cycles frozen in informative states, marquee/scan/floaty/preloader off, magnetic/glow inert). Same for `pointer: coarse` on parallax/magnetism.

## Semantics & ARIA

- Landmarks: `header/nav/main/footer/aside`, each unique. Headings: exactly one `h1` → `h2` per section → `h3` per card/role; no skipped levels.
- ARIA minimalism: native HTML first; `aria-pressed` (role tabs, wiring nodes, theme where applicable), `aria-expanded` (burger), dialog semantics (palette), real `<table>` for the exhibit capability matrix, `role="region"` + `aria-label` for the wiring panel.
- Decorative SVGs/canvas/marquee: `aria-hidden="true"`; hero canvas gets an SR-only descriptive sentence.
- `aria-live` ONLY on: toast host + exhibit per-role SR summary (polite). Never on counters/marquee/auto-cycles.
- Icon-only controls (theme, burger, back-to-top, copy) require accessible names (SR-only text or aria-label).

## Contrast & sizing

- Contrast pairs verified per phase 7 table: body text ≥ 4.5:1, ≥24px display text ≥ 3:1, in both themes. Lime is never text-on-light (use olive `#546E0B`).
- Touch targets ≥ 44px on coarse pointers (≥38px desktop minimum). `scroll-padding-top` accounts for the fixed header.

## Screen-reader narratives

- Exhibit role switch announces outcome via the polite SR summary (e.g., "Company role: 5 of 10 modules visible, contacts masked, approvals read-only").
- Wiring selection announces node title via panel region label; auto-cycle hands over permanently on first user interaction (no fighting the user).
