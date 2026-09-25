# Rule 20 — Design System

Sources of truth (in order): `docs/DESIGN-SYSTEM.md` → prototype computed styles (`docs/prototype/index.html`) → this file. Do not invent token values; port exact hex/easing/radius/spacing.

## Tokens (Phase 2 establishes in `app/globals.css` `@theme`)

- **Dark (default):** bg `#0A0B0D` · ink `#F2F1EA` · accent lime `#CBF24C` · accent-fg (on lime) `#0A0B0D`
- **Light "paper":** bg `#F5F4ED` · accent `#C6F04E` · accent TEXT in light theme is olive `#546E0B` — **lime is never used as text color on light backgrounds**
- Radii: xl 24 / lg 18 / md 12 / sm 8 · Easings: `--ease-atelier: cubic-bezier(.22,.72,.2,1)`, `--ease-out-expo` · full color set (bg-2/bg-3/panel/line/ink-2/ink-3/good/…) per DESIGN-SYSTEM §2.
- **Breakpoints (custom):** xs 420 · sm 640 · md 760 · lg 1080 · xl 1280 — use tokens, never ad-hoc px media queries.

## Typography

- Display: **Bricolage Grotesque** (variable opsz/wdth/wght) — headings, hero, section numbers
- Body: **Inter** — everything else · Mono: **JetBrains Mono** — labels, kickers, code-ish chrome, meta
- Font wiring: `next/font/google` variables `--font-bricolage/--font-inter/--font-jetbrains` → `@theme inline` → utilities `font-display/font-sans/font-mono`.

## Theming

- Two themes via `<html data-theme>`; dark default; light = "paper".
- Persistence: **cookie `pg-theme`** read at SSR in `app/layout.tsx` (approved deviation D1 — no localStorage, no FOUC). Cookie: 1y, `SameSite=Lax`, `Path=/`, JS-readable.

## Component conventions

- `@layer components` ONLY for classes used ≥2× (`.btn .chip .pill .card .section-head .tag .marquee .ev-chip .tech`); everything else = utilities.
- Keyframes inventory (Phase 2): `pulse, mq, scan, floaty, busflow, ldPop, wpIn, audIn, cmdIn` — exact parameters in `agent/context/prototype-notes.md` §B.
- Icons: in-house `<Icon>` registry (`components/ui/Icon.tsx`), inline SVG ported from prototype, `aria-hidden` by default.
- UI primitives (Phase 2): Button, Chip, Pill, Card, SectionHead, Tag, Icon, Toast — typed props, `cn()` for variants.
- Noise overlay = CSS data-URI (feTurbulence), theme-specific opacity; never an image file.

## Motion design language (parameters frozen — Phase 5)

All motion values come from `prototype-notes.md` §B (2.9s canvas cycle, 4.6s wiring auto-cycle with permanent handover, 3.6s scramble, 42s marquee, 1.5s counters easeOutQuart, .8s reveals, 1.0s line-masks, 150ms audit stagger, 780ms preloader). Transform/opacity only. Motion is decoration — content must be complete and readable without it.
