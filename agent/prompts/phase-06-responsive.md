# PHASE 6 — Responsive Design Pass

> Paste this entire file into Antigravity as one task. Phase 5 must be approved. Do not start Phase 7 until the Definition of Done is met and the owner approves the Final Report.

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
Dedicated responsive pass across 320→1920px: adapt typography, navigation, grids, cards, spacing, animations, interactive elements, diagram behavior and CTA placement per component — NOT desktop-shrink. Zero horizontal overflow anywhere; touch ergonomics correct.

## 2. Context
Phases 1–5 delivered the full animated page. Breakpoint tokens: `xs 420 / sm 640 / md 760 / lg 1080 / xl 1280`. Behavior matrix (plan §3-P6) is binding:
- **DotRail**: visible ≥1280 only. **Header**: inline nav ≥1080; burger <1080; ≤760 search hidden + brand subtitle hidden + CV icon-only; ≤420 CTAs full-width.
- **Hero**: 2-col ≥1080 (parallax on); <1080 stacked, canvas flat (no tilt), chips repositioned (fc-a top -13%, fc-b bottom 14% left -8%, fc-c hidden ≤760).
- **Metrics**: 6-col ≥1080; 3-col 760–1079 (border recompute); 2-col ≤759 (nth-child border rules).
- **Bento**: 8/4·4³·6² ≥1080; feat 12 + halves 6 at 760–1079; all 12 ≤759.
- **Wiring**: diagram+panel ≥1080; panel below <1080; band c4→2 cols ≤1079; all bands 1 col ≤640; head wraps.
- **Exhibit**: 2-col ≥1080; role tabs horizontal scroller <1080; mock sidebar→top scroller ≤760; table compresses ≤760.
- **Timeline**: sticky rail ≥1080; stacked below; rail offset 30px ≤760.
- **Contact**: 2-col ≥1080; 1-col below; mailto `break-all`; ≤420 CTA stack.
- **Footer**: 3-col → 2-col ≤1079 → 1-col ≤760.

## 3. Tasks
- [ ] Implement `agent/tools/screenshot-grid.ts` (Playwright): viewports [320,360,390,414,640,768,834,1024,1280,1440,1920] × themes [dark,light], full-page + per-section clips into `agent/artifacts/<date>-phase-06/grid/`.
- [ ] Run grid; catalog every overflow/clipping/collision/affordance issue in `agent/artifacts/<date>-phase-06/findings.md`.
- [ ] Fix all findings per the matrix above; where prototype and matrix are silent, decide by principle (readability → touch → parity) and log in `decisions.md`.
- [ ] Touch ergonomics: targets ≥44px on coarse pointers (menu links, tabs, chips-as-buttons, palette rows); horizontal scrollers get `scrollbar-width: thin` + edge-fade affordance; `:hover`-only affordances get `:focus-visible`/touch equivalents (copy-hint visible on focus).
- [ ] Typography adaptation: hero clamp verification at 320 (no wrap-orphans in h1), section heads wrap rules (rule hidden ≤760), mono labels letter-spacing relaxation ≤420.
- [ ] Animation adaptation: parallax/magnetism disabled on coarse pointers; preloader unchanged; marquee speed unchanged but edge mask verified at 320.
- [ ] Diagram behavior: wiring bands stacking verified with panel reachable without excess scroll (panel directly after diagram <1080); exhibit tabs scroller keyboard-scrollable.
- [ ] CTA placement: hero CTAs wrap gracefully 320–480; contact CTAs stack ≤420; header CV remains reachable in every state.
- [ ] Re-run grid; produce before/after contact sheet for owner.

## 4. Technical Requirements
- Use breakpoint tokens only (no ad-hoc px media queries); mobile-first ordering in CSS.
- No new client components; responsive work is CSS + existing islands' guards (`pointer:fine`, width checks).
- Overflow assertion must include fixed layers (header, menu, rail, toast) at 320px.

## 5. Files / Folders
Create/modify: `agent/tools/screenshot-grid.ts`, section/island CSS+guards, `agent/context/decisions.md`, artifacts grid+findings+contact-sheet.
Do not touch: content copy, tokens, SEO/perf configs.

## 6. Agent Folder
**Modified:** new tool `screenshot-grid.ts`; workflow file `agent/workflows/visual-parity-check.md` authored (grid + diff-review steps) for reuse in Phase 13.

## 7. Restrictions
- Do not redesign components for mobile (adapt, don't reinvent); parity with prototype mobile shots is the bar.
- Do not disable content or interactions on small screens (only reposition/re-flow).
- Do not introduce horizontal scroll as a layout strategy outside the three approved scrollers (role tabs, mock sidebar, menu none).
- Do not proceed with any unfixed P0 finding (overflow/clipping of interactive elements).

## 8. Validation
- `pnpm lint && pnpm tsc --noEmit && pnpm build` green.
- Playwright overflow spec: `document.documentElement.scrollWidth === innerWidth` at all 11 viewports, both themes.
- Screenshot grid v2 clean: zero clipping/collision/overflow findings open; owner reviews contact sheet.
- Touch test (emulated): menu, tabs, palette, copy, theme all operable; scrollers swipe + keyboard.

## 9. Definition of Done
- [ ] Matrix fully implemented; findings.md all closed or explicitly accepted by owner.
- [ ] Overflow spec green at 11 viewports × 2 themes.
- [ ] `visual-parity-check.md` workflow committed; PR approved with Final Report.

## 10. FINAL REPORT (fill in and return)
- Completed: …
- Files created: …
- Files modified: …
- Dependencies added: … (expected: none)
- Important technical decisions: …
- Validation performed (commands + results): …
- Remaining issues: … (accepted findings list)
- Requires my approval: …
- Artifact path: agent/artifacts/<date>-phase-06/
