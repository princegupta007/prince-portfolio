# PHASE 9 — Performance Optimization

> Paste this entire file into Antigravity as one task. Phase 8 must be approved. Do not start Phase 10 until the Definition of Done is met and the owner approves the Final Report.

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

Dedicated performance pass to plan §5 targets: initial client JS ≤ 70 KB gz (palette lazy counted separately), LCP < 1.8 s lab, CLS 0, INP < 200 ms, Lighthouse ≥ 95 all categories mobile; caching headers; zero third-party runtime scripts; efficient animations verified.

## 2. Context

Phases 1–8 delivered SEO-complete accessible page. Islands currently: ThemeToggle, MobileMenu, ScrollSpy, ScrollProgress, DotRail, HeroCanvas, WiringDiagram, RoleLens, CopyButton, Reveal-wrapped clients, Counter, ScrambleWord, Preloader, InteractionLayer, Toast + lazy CommandPalette. Rendering: single static route (prerendered). Assets: fonts (next/font), CV PDF, og.png, favicon.

## 3. Tasks

- [ ] `agent/tools/bundle-check.ts`: parse `next build` output / `.next` manifest → (a) assert zero chunks referencing `agent/`; (b) report first-load JS of `/` vs 70 KB gz budget; (c) list island chunks with sizes; wire `pnpm agent:bundle-check`; add `budget.json` (resourceSizes: script 80 KB, total 350 KB).
- [ ] Code-split audit: `CommandPalette` confirmed `next/dynamic` lazy; convert below-fold heavy islands (`RoleLens`, `WiringDiagram`, `HeroCanvas`) to `next/dynamic` **with `ssr: true`** (keeps SEO, splits client JS) ONLY if measurable first-load reduction without hydration flash; document decision either way.
- [ ] Hydration audit: no island does layout-affecting work post-mount (CLS sources): counters reserve width (tabular-nums + min-width), preloader is fixed overlay, reveal hidden-state strategy verified no-shift, fonts fallback metrics (next/font auto) confirmed via CLS 0 in Lighthouse.
- [ ] Animation efficiency: grep transitions/keyframes for layout properties (width/height/top/left/margin) → replace with transform/opacity or justify in decisions.md; confirm `will-change` only on canvas/chips; IO observers shared (no per-element observers except singletons documented).
- [ ] Long-task audit (4× throttle trace): scroll hero→exhibit→contact; any task > 50 ms → fix (batch DOM writes: audit console single append; delegated listeners already single; rAF-throttle scroll handlers verified).
- [ ] Font audit: 3 families, used weights/axes minimal (drop unused axis requests), `preload` behavior from next/font verified, no duplicate subset downloads.
- [ ] CSS audit: purge check (built CSS size reported), no unused keyframes (tree list in artifact), noise data-URI not duplicated across themes.
- [ ] Caching: `vercel.json` headers — `/_next/static/*`: `public, max-age=31536000, immutable`; `/cv/*.pdf`: `public, max-age=86400, stale-while-revalidate=604800`; `/og.png`,`/favicon.svg`: 7d + immutable after etag; HTML: rely on Vercel static CDN defaults (document).
- [ ] Third-party audit: zero runtime external scripts/styles (fonts self-hosted; Speed Insights added in Phase 12 only); document the single allowed future beacon.
- [ ] Lighthouse: run mobile (4G, 4× CPU) ×3 median via CLI on production build (`next start`); record JSON in artifact; fix regressions until targets met.
- [ ] `agent/workflows/perf-audit.md` authored (budget check + lighthouse + trace steps).

## 4. Technical Requirements

- No new runtime deps; no images introduced; no SSR disabled anywhere.
- Budget failures fail CI (bundle-check wired later in Phase 11 CI).
- Every optimization must keep no-JS readability and SEO intact (verify curl after splits).

## 5. Files / Folders

Create/modify: `agent/tools/bundle-check.ts`, `budget.json`, `vercel.json` (cache headers), island dynamic-import changes (if justified), `agent/workflows/perf-audit.md`, artifact (lighthouse JSON ×3, trace summary, CSS/JS size table).
Do not touch: copy, visuals, a11y attributes, SEO metadata.

## 6. Agent Folder

**Modified:** new tool + workflow; budget decisions logged in `decisions.md` (e.g., whether RoleLens split applied).

## 7. Restrictions

- Do not disable/defer content visibility for scores (no lazy text).
- Do not add service worker/PWA (not needed; adds complexity).
- Do not inline large CSS/JS manually (Next handles critical CSS).
- Do not accept Lighthouse < 95 in any category without owner-approved written exception.

## 8. Validation

- `pnpm agent:bundle-check` exit 0 with first-load table in report.
- `pnpm lint && pnpm tsc --noEmit && pnpm build` green; `curl` no-JS content check still passes post-splits.
- Lighthouse mobile median: Perf ≥ 95, A11y ≥ 95, BP ≥ 95, SEO ≥ 95; LCP < 1.8 s; CLS 0; TBT < 150 ms.
- Trace: zero long tasks > 50 ms during scroll journey (4× throttle).
- `curl -I` on static assets shows intended cache headers (local header emulation or post-deploy check noted for Phase 12).

## 9. Definition of Done

- [ ] Budgets green; lighthouse targets met (median of 3); trace clean.
- [ ] Cache headers committed; third-party list = empty.
- [ ] `perf-audit.md` workflow committed; PR approved with Final Report.

## 10. FINAL REPORT (fill in and return)

- Completed: …
- Files created: …
- Files modified: …
- Dependencies added: … (expected: none)
- Important technical decisions: … (split decisions, budget table)
- Validation performed (commands + results): …
- Remaining issues: …
- Requires my approval: …
- Artifact path: agent/artifacts/<date>-phase-09/
