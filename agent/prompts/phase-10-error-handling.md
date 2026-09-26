# PHASE 10 — Error Handling & Production Readiness

> Paste this entire file into Antigravity as one task. Phase 9 must be approved. Do not start Phase 11 until the Definition of Done is met and the owner approves the Final Report.

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

Implement graceful-failure architecture per plan §6/§2.9 (route + global error boundaries, styled 404, reserved loading, island-level static fallbacks, clipboard/font/storage fallbacks), finalize security+cache headers, and prove production build/runtime behavior locally.

## 2. Context

Phases 1–9 delivered performant SEO-complete page. Failure surfaces are limited by design (no runtime fetching, no forms): client-hydration/island runtime errors, unknown routes, missing assets, clipboard denial, storage exceptions, font failure.

## 3. Tasks

- [ ] `app/error.tsx`: design-language card ("Something broke on this screen"), `reset()` retry button, mailto escape hatch; logs via `console.error` only (no external service).
- [ ] `app/global-error.tsx`: minimal self-contained shell (inline styles, no design-system import) + reload button; preserves `<html>` theme attribute.
- [ ] `app/not-found.tsx`: styled 404 (mono index chip "404", outline display line, section index links, back-to-top); unknown routes verified.
- [ ] `app/loading.tsx`: reserved trivial shell (header skeleton bar) documented as future-route placeholder; must NOT flash on current static route (verify).
- [ ] Island-level fallbacks: wrap `RoleLens`, `WiringDiagram`, `HeroCanvas`, `CommandPalette` mounts in small client `ErrorBoundary` components rendering STATIC variants (super-admin frame / all-nodes + node-01 panel / static canvas / plain palette button no-op) so a runtime error degrades content, never blanks it.
- [ ] Fallback audits: `CopyButton` clipboard→textarea→toast-with-literal chain tested with permissions denied; theme/`sessionStorage` try/catch verified (sandboxed iframe emulation); font failure → fallback stack (network-block test).
- [ ] `vercel.json` final: security headers (nosniff, referrer-policy, permissions-policy, frame-ancestors/DENY, CSP per plan §8 with `style-src 'self' 'unsafe-inline'`, no inline scripts exist) + Phase 9 cache headers merged; `poweredByHeader:false` in `next.config.ts`.
- [ ] Production runtime proof: `pnpm build && pnpm start`; smoke script hits `/`, `/sitemap.xml`, `/robots.txt`, CV PDF, `/definitely-not-a-route` (expect styled 404 + 404 status), HEAD checks for headers.
- [ ] Simulated island failure drill: temporary `?boom=1` dev-only flag throwing inside RoleLens → boundary static fallback renders, rest of page interactive; remove flag code path guarded to `process.env.NODE_ENV !== "production"` OR remove entirely after drill (choose removal; document).
- [ ] Document failure matrix coverage in `agent/context/decisions.md` (map plan §6 rows → implementation).

## 4. Technical Requirements

- Error UI must be accessible (focus moves to error card heading on route error; retry is a real button).
- CSP must not break Next inline styles or fonts; verify with CSP report-only run first, then enforce.
- No error-tracking SaaS added (free-tier discipline); console-only logging documented.

## 5. Files / Folders

Create/modify: `app/{error,global-error,not-found,loading}.tsx`, `components/interactive/IslandBoundary.tsx`, section island mounts, `vercel.json`, `next.config.ts`, smoke script `agent/tools/smoke-prod.ts` (or playwright spec), decisions.md.
Do not touch: content, visuals, budgets (error UI adds < 2 KB).

## 6. Agent Folder

**Modified:** smoke tool added (`agent:smoke`), failure-matrix decisions logged; artifact with 404/error screenshots + header dumps.

## 7. Restrictions

- Do not add Sentry/external monitoring (owner approval required; not now).
- Do not ship the `?boom` drill mechanism to production.
- Do not weaken CSP to silence warnings — fix the source instead.
- Do not mark done without the production-build smoke passing locally.

## 8. Validation

- `pnpm lint && pnpm tsc --noEmit && pnpm build && pnpm start` + `pnpm agent:smoke` green (all routes/statuses/headers asserted).
- `/definitely-not-a-route` → 404 status + styled page (screenshot).
- Island-failure drill (dev) → static fallback screenshot; page scroll/interactions elsewhere unaffected.
- Clipboard-denied emulation → toast shows literal email.
- CSP enforced with zero console CSP violations in both themes.

## 9. Definition of Done

- [ ] All boundary/fallback files committed; failure matrix fully mapped.
- [ ] Prod smoke green incl. headers + 404; CSP enforced clean.
- [ ] PR approved with Final Report + screenshots.

## 10. FINAL REPORT (fill in and return)

- Completed: …
- Files created: …
- Files modified: …
- Dependencies added: … (expected: none)
- Important technical decisions: … (CSP final form, drill removal)
- Validation performed (commands + results): …
- Remaining issues: …
- Requires my approval: …
- Artifact path: agent/artifacts/<date>-phase-10/
