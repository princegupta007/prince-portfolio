# PHASE 2 — Architecture & Design System

> Paste this entire file into Antigravity as one task. Phase 1 must be approved. Do not start Phase 3 until the Definition of Done is met and the owner approves the Final Report.

## CRITICAL AGENT RULES (binding for this phase)

1. Do not blindly implement. First inspect the existing project state and relevant files.
2. Do not overwrite working code unnecessarily.
3. Do not introduce unnecessary dependencies.
4. Do not invent information from my CV or profile.
5. Do not display project names anywhere on the portfolio.
6. Follow the approved prototype as the primary UI/UX reference.
7. If the prototype and implementation plan conflict, identify the conflict before making a major architectural change.
8. Keep the code production-ready.
9. Keep Server Components as the default in Next.js and use Client Components only when interaction requires them.
10. Treat performance as a first-class requirement.
11. Treat accessibility as a first-class requirement.
12. Do not use paid Vercel features without explicit approval.
13. Keep the application architecture clean and maintainable.
14. Keep Antigravity-specific files isolated inside the `agent` folder.
15. Do not move to the next phase until the current phase passes its validation and Definition of Done.
16. If something is unclear or potentially destructive, stop and ask for clarification instead of guessing.
17. After implementation, run the relevant checks and fix issues found during validation.

## 1. Objective

Establish the full design-token system (Tailwind v4 `@theme`, both themes), base styles, keyframes, and the reusable UI primitive set from DESIGN-SYSTEM.md §2–§5, verified visually against the prototype before any section exists.

## 2. Context

Phase 1 delivered configs, fonts, skeleton, agent rules. Token values live in `docs/DESIGN-SYSTEM.md` §2 (colors ×2 themes), §4 (spacing/radii/shadows), §6 (easings/keyframes); prototype CSS `:root`/`[data-theme="light"]` blocks are the exact hex source. Component inventory: DESIGN-SYSTEM §5.

## 3. Tasks

- [ ] `app/globals.css`: `@import "tailwindcss";` + `@theme` block: colors (`bg, bg-2, bg-3, term, panel, panel-2, panel-solid, line, line-2, grid-c, ink, ink-2, ink-3, accent, accent-2, accent-fg, accent-ink, accent-dim, accent-line, glow, glow-2, good, glass`), radii (`xl 24 / lg 18 / md 12 / sm 8`), shadows (`lg`, `sm`), easings (`--ease-atelier`, `--ease-out-expo`), custom breakpoints (`xs 26.25rem, sm 40rem, md 47.5rem, lg 67.5rem, xl 80rem`), font vars from Phase 1.
- [ ] `[data-theme="light"]` override block with exact light values (paper `#F5F4ED`, olive `--accent-fg #546E0B`, etc.).
- [ ] Base layer: body bg/ink, selection lime, scrollbar styling, `:focus-visible` ring (2px accent, offset 3px), `scroll-padding-top: calc(header 72px + 18px)`, reduced-motion collapse block (prototype §6 rules).
- [ ] Keyframes: `pulse, mq, scan, floaty, busflow, ldPop, wpIn, audIn, cmdIn` + noise overlay utility (data-URI feTurbulence, opacity token per theme).
- [ ] `@layer components` (used ≥2× each, else utilities): `.btn` (+primary shine sweep, ghost, sm), `.chip`/`.chip-key`, `.pill` (+pulse dot), `.card` (glow vars `--mx/--my`), `.section-head` (idx chip + rule + meta), `.tag` (+ok/live), `.marquee` track/item, `.ev-chip`, `.tech`.
- [ ] UI primitives in `components/ui/`: `Button.tsx` (variants, `magnetic` opt-in class hook for Phase 5), `Chip.tsx`, `Pill.tsx`, `Card.tsx`, `SectionHead.tsx` (props: idx, title, meta, lines?), `Tag.tsx`, `Icon.tsx` (registry: port ALL ~30 inline SVG glyphs from prototype — shield-check, grid, store, broadcast, bolt, sliders, db, lock, code, flask, cloud-up, mail, phone, github, linkedin, download, copy, search, sun, moon, arrow-*, info, cap, dots…; props `name,size`; `aria-hidden` default), `Toast.tsx` (client provider, instant show/hide now; animation in Phase 5).
- [ ] `content/types.ts` with interfaces from plan §2.5 (`Metric`, `WiringNode`, `RoleSpec`, `ExperienceRole`, `NavItem`, `StackGroup`, `EduItem`, `ContactRow`).
- [ ] Temporary verification route `app/dev/tokens/page.tsx` (server component) rendering every token class + primitive variant; screenshot both themes; **delete the route before phase end** (no dead code).
- [ ] Record token-port decisions (any hex rounding, naming) in `agent/context/decisions.md`.

## 4. Technical Requirements

- Tailwind v4 CSS-first only — no `tailwind.config.js` theme duplication.
- Primitives: Server Components by default; only `Toast` is `"use client"`.
- Every primitive typed, props minimal, `cn()` for variants; no prop drilling patterns yet.
- Contrast: keep pairs per DESIGN-SYSTEM §2 (lime never as text on light theme).

## 5. Files / Folders

Create/modify: `app/globals.css`, `components/ui/*`, `content/types.ts`, temporary `app/dev/tokens/page.tsx` (deleted before DoD).
Do not touch: `agent/rules`, configs, `docs/`.

## 6. Agent Folder

**Modified (content only):** append token decisions to `agent/context/decisions.md`; export phase artifact. No new structure.

## 7. Restrictions

- Do not build layout/sections/islands (Phases 3–5).
- Do not add component libraries, icon packages, or animation libraries.
- Do not invent token values — hex/easing/radius must match DESIGN-SYSTEM/prototype exactly.
- Do not leave the `/dev/tokens` route in the final commit.

## 8. Validation

- `pnpm lint && pnpm tsc --noEmit && pnpm build` green.
- Playwright script samples computed colors of 8 token classes in both themes → equals prototype hex values (list in artifact).
- Screenshot grid of `/dev/tokens` (dark+light) visually compared to prototype components; owner eyeball check.
- After deletion: `grep -r "dev/tokens" app` → zero hits; build green again.

## 9. Definition of Done

- [ ] Tokens + base + keyframes + components layer complete and color-verified.
- [ ] All primitives + full icon registry committed; `/dev/tokens` removed.
- [ ] PR with screenshot evidence approved by owner.

## 10. FINAL REPORT (fill in and return)

- Completed: …
- Files created: …
- Files modified: …
- Dependencies added: … (expected: none)
- Important technical decisions: …
- Validation performed (commands + results): …
- Remaining issues: …
- Requires my approval: …
- Artifact path: agent/artifacts/<date>-phase-02/
