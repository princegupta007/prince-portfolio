# PHASE 5 — Advanced UI/UX (motion & micro-interaction layer)

> Paste this entire file into Antigravity as one task. Phase 4 must be approved. Do not start Phase 6 until the Definition of Done is met and the owner approves the Final Report.

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

Add the approved motion layer on top of the content-complete page: reveal system, animated counters, scramble rotator, marquee flow, preloader, hero canvas cycle + parallax, pointer glow/magnetism, auto-cycles with handover, audit stagger, timeline fill, toast/palette animation, and the lazy command palette — all transform/opacity-only and fully collapsed under `prefers-reduced-motion`.

## 2. Context

Phase 4 delivered static-state sections + interactive cores. Motion parameters come from `agent/context/prototype-notes.md` (extracted in Phase 0): reveal .8s `--ease-atelier` + stagger `--d`; line-mask 1.0s `--ease-out-expo`; counters 1.5s easeOutQuart with formats (3.5→1 decimal, 5000→grouped); scramble 5 words @3.6s; marquee 42s; hero canvas cycle 2.9s (super→admin→company→partner) + scanline 6s + floaty 7.5s; wiring auto-cycle 4.6s with PERMANENT handover on first user interaction + hint swap; audit lines 150ms stagger max 7; preloader 780ms count + curtain, once per session; timeline fill = f(scroll through section); palette `cmdIn` .38s.

## 3. Tasks

- [ ] `hooks/useReveal.ts`: module-level shared IntersectionObserver (threshold .12, rootMargin -6%); `Reveal` client wrapper adds `.in`; line-mask heading support (`.lines .ln>span`); SSR renders hidden-safe (content visible without JS via `<noscript>`-free approach: hidden state applied only after mount OR via CSS that no-JS never triggers — choose and document).
- [ ] `hooks/useCountUp.ts` + wire `Counter` (starts on 50% visibility, once).
- [ ] `hooks/useScramble.ts` + `ScrambleWord` (rotator; pauses on `document.hidden`).
- [ ] Marquee animation on (duplicate set already present); pause on hover.
- [ ] `Preloader` client island: 000→100 (780ms) + bar + curtain wipe; `sessionStorage` once-per-session (try/catch); skipped under reduced motion; body scroll lock only while visible.
- [ ] `HeroCanvas` upgrade: role cycle 2.9s (IO pause off-screen), scanline, floaty chips, mouse parallax depths (14/24/34/42) + canvas `--rx/--ry` tilt, hero pointer glow (`#heroGlow` equivalent), outline-word fill on hero hover.
- [ ] `InteractionLayer` client island: ONE delegated `pointermove` → card glow vars (`--mx/--my` on `.bento .card, .pr, .stack-card, .edu`) + magnetic translate on `.magnetic` buttons (±6px, pointer:fine only).
- [ ] `WiringDiagram`: auto-cycle 4.6s (IO pause; permanent handover on click/keys; hint text swaps to "Manual mode — ← → keys also move between nodes"); bus flow dots animation.
- [ ] `RoleLens`: audit console staggered appends (150ms, max 7 lines) on role change; nav/mask transitions.
- [ ] `TimelineFill`: scroll-driven lime fill on experience rail (rAF-throttled).
- [ ] `DotRail/ScrollProgress/Header` animations verified (already CSS) + nav underline wipes active.
- [ ] Toast show/hide animation; `CommandPalette` implemented now via `next/dynamic` (lazy on first ⌘K/click/hover-intent): full command list (9 sections + CV + copy email + theme + GitHub + LinkedIn + mailto), filter, ↑↓↵esc, empty state, backdrop click close, focus management.
- [ ] Reduced-motion audit: every new effect collapses (reveals shown, cycles static-all-lit, marquee/scan/floaty off, preloader skipped, magnetic/glow off).

## 4. Technical Requirements

- Animations: transform/opacity only; no layout-triggering properties; `will-change` limited to canvas/chips.
- New client JS for this phase ≤ +12 KB gz (measure; palette counted separately as lazy).
- Auto-cycles must pause off-screen AND on `document.hidden`; intervals cleaned on unmount.
- No animation library introduced.

## 5. Files / Folders

Create/modify: `hooks/{useReveal,useCountUp,useScramble,useAutoCycle,usePointerGlow,useReducedMotion}.ts`, `components/interactive/{Preloader,ScrambleWord,InteractionLayer,CommandPalette}.tsx`, updates to `HeroCanvas/WiringDiagram/RoleLens/Counter/Reveal/Toast`, `app/globals.css` (animation utilities only).
Do not touch: content modules (except wiring hint string), layout shell logic, tokens.

## 6. Agent Folder

**Modified:** append motion-gating decisions to `agent/context/decisions.md`; artifact with before/after interaction notes + JS delta measurement.

## 7. Restrictions

- Do not change section copy, layout, or content (visual parity must hold).
- Do not add GSAP/Framer/Motion or any animation dependency.
- Do not make any content invisible without JS (reveal hidden-state strategy must be no-JS-safe).
- Do not run auto-cycles when reduced motion is set or section off-screen.

## 8. Validation

- `pnpm lint && pnpm tsc --noEmit && pnpm build` green; JS delta reported.
- Playwright interaction specs: role switch updates audit with stagger; wiring auto-advances then stops forever after click; palette opens via ⌘K and executes "Copy email" (toast) and a section jump; preloader appears once per session only; counters reach exact final strings.
- Reduced-motion run (emulated): page fully static AND complete; screenshot equals no-motion baseline.
- 4× CPU throttle: no long task > 50ms during scroll through hero+exhibit; INP < 200ms lab.
- Zero console errors; screenshot grid 1440/390 both themes for owner.

## 9. Definition of Done

- [ ] All prototype motions present with correct parameters; palette lazy + keyboard-complete.
- [ ] Reduced-motion + no-JS + throttle checks pass.
- [ ] JS budget respected; PR approved with Final Report + owner motion review.

## 10. FINAL REPORT (fill in and return)

- Completed: …
- Files created: …
- Files modified: …
- Dependencies added: … (expected: none)
- Important technical decisions: … (reveal no-JS strategy, JS delta)
- Validation performed (commands + results): …
- Remaining issues: …
- Requires my approval: …
- Artifact path: agent/artifacts/<date>-phase-05/
