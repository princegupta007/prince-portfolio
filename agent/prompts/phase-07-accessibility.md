# PHASE 7 — Accessibility Pass

> Paste this entire file into Antigravity as one task. Phase 6 must be approved. Do not start Phase 8 until the Definition of Done is met and the owner approves the Final Report.

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
Dedicated accessibility pass to plan §4 standard: semantic HTML, complete keyboard support, visible focus, minimal correct ARIA, screen-reader-friendly specimens, verified contrast, reduced-motion parity, accessible navigation — without degrading the visual design.

## 2. Context
Phases 1–6 delivered the responsive animated page. Known a11y design decisions already in place: skip link, landmarks, single h1 → h2 per section → h3 per card/role, `aria-pressed` role/wiring nodes, `aria-expanded` burger, dialog palette, `aria-live` toast only, decorative SVGs `aria-hidden`, exhibit mock is a real `<table>`, audit console `aria-hidden` (decorative duplicate). Contrast pairs per DESIGN-SYSTEM §2 (lime-on-light forbidden; olive `#546E0B` used for accent text in light).

## 3. Tasks
- [ ] Add `tests/e2e/a11y.spec.ts` with `@axe-core/playwright`: full-page scan of `/` in dark+light, plus open states (menu, palette, exhibit after role switch) — target **0 violations**.
- [ ] Semantic audit: landmarks unique (`header/nav/main/footer/aside`), list markup for metrics/chips/nav, table semantics for exhibit (caption or `aria-label`), headings order script check (h1→h2→h3 no skips), buttons-vs-links correctness (copy = button, CV = link with `download`).
- [ ] Keyboard journey spec: skip link first tab; header order brand→nav→search→theme→CV→(burger); every interactive reachable; palette focus trap + restore; menu esc + focus restore; wiring ←/→ + Tab; exhibit tabs Tab+Enter; footer back-to-top; no focus loss on lazy palette mount; no keyboard traps.
- [ ] Focus states: `:focus-visible` ring visible on EVERY interactive in both themes (screenshot evidence); ring not clipped by overflow containers (bento, tabs scroller, palette list).
- [ ] ARIA audit: remove any redundant/incorrect attributes; add SR-only summaries: exhibit matrix per-role textual summary updated on switch (`aria-live="polite"` small region), wiring panel `role="region"` + `aria-label`; hero canvas `aria-hidden` (decorative) with SR-only sentence describing it; marquee `aria-hidden`.
- [ ] Contrast verification: compute ratios for all token text pairs both themes (script in artifact): ink/ink-2/ink-3 on bg/panel, accent-fg both themes, lime-on-accent-ink buttons, chip/tag text; fix any < 4.5:1 (or < 3:1 for ≥24px text) by token adjustment only.
- [ ] Reduced motion: emulate; assert reveals visible, cycles static (all role cells lit, canvas super-admin), marquee/scan/floaty stopped, preloader absent, magnetic/glow inert; page still complete + navigable.
- [ ] Screen-reader spot script: dump accessible names/roles of header, exhibit tabs, wiring nodes, contact rows; verify names are meaningful (no "button button", no icon-only unnamed controls — theme/burger/top have labels).
- [ ] Motion sickness safety: parallax/tilt disabled under reduced motion AND `pointer:coarse`.
- [ ] Author `agent/workflows/a11y-pass.md` capturing this checklist for future regressions.

## 4. Technical Requirements
- Fix violations at the source (markup/tokens), never by axe suppression; suppressions require owner approval and a filed reason.
- No new dependencies beyond `@axe-core/playwright` (dev).
- Keep visual design unchanged except token-level contrast fixes (log deltas in decisions.md with before/after hex).

## 5. Files / Folders
Create/modify: `tests/e2e/a11y.spec.ts`, markup/ARIA fixes across sections/islands, token contrast fixes in `globals.css`, SR-only utility class, `agent/workflows/a11y-pass.md`, artifact (axe reports + focus screenshots + contrast table).
Do not touch: layout behavior, content copy, motion parameters.

## 6. Agent Folder
**Modified:** new workflow `a11y-pass.md`; contrast table + axe JSON reports exported to artifact.

## 7. Restrictions
- Do not add ARIA "just in case" (roles/labels only where HTML falls short).
- Do not weaken visual design to pass checks without logging the tradeoff; if a conflict is real (e.g., ink-3 meta text), fix via token, not per-element hacks.
- Do not skip open-state scans (menu/palette/exhibit) — most violations hide there.
- Do not mark phase done with any open axe violation unapproved.

## 8. Validation
- `pnpm lint && pnpm tsc --noEmit && pnpm build && pnpm test:e2e -- a11y` green; axe 0 violations in all scanned states/themes.
- Keyboard journey spec passes end-to-end; focus-ring screenshot grid reviewed.
- Contrast script table: all pairs pass WCAG AA (document any AAA misses).
- Lighthouse accessibility ≥ 95 (local run, mobile + desktop).
- Reduced-motion + coarse-pointer emulation checks pass.

## 9. Definition of Done
- [ ] Axe clean (5+ scanned states × 2 themes); keyboard journey green; SR names meaningful.
- [ ] Contrast table committed in artifact; token deltas logged.
- [ ] `a11y-pass.md` workflow committed; PR approved with Final Report.

## 10. FINAL REPORT (fill in and return)
- Completed: …
- Files created: …
- Files modified: …
- Dependencies added: … (expect: @axe-core/playwright dev only)
- Important technical decisions: … (token contrast deltas, SR summaries)
- Validation performed (commands + results): …
- Remaining issues: …
- Requires my approval: …
- Artifact path: agent/artifacts/<date>-phase-07/
