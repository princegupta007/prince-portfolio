# PHASE 11 — Testing & QA + CI

> Paste this entire file into Antigravity as one task. Phase 10 must be approved. Do not start Phase 12 until the Definition of Done is met and the owner approves the Final Report.

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

Complete the practical test pyramid (plan §9): unit, component, a11y, responsive, e2e smoke, plus a GitHub Actions CI pipeline that enforces lint/type/unit/e2e/build/agent-tools on every PR. Fix everything the tests find — reporting without fixing is not acceptance.

## 2. Context

Phases 1–10 delivered hardened app. Existing specs: `content-policy.test.ts` (P4), `a11y.spec.ts` (P7), interaction checks written ad-hoc in P5/P6 must now be consolidated into permanent specs. Tools available: `agent/tools/{content-scan,screenshot-grid,link-check,bundle-check,secret-scan,smoke-prod}.ts`.

## 3. Tasks

- [ ] **Unit (Vitest):** `lib/format.ts` counter formats (decimals/grouping/prefix/suffix); nav/anchor integrity (every nav/rail/footer href has a matching section id); content-policy test retained.
- [ ] **Component (Vitest + RTL):** `RoleLens` (each role → nav on/off counts, mask cells, matrix highlight, approve-disabled for partner); `WiringDiagram` (select, arrow keys, permanent handover, panel fields); `CommandPalette` (filter, enter executes, esc closes, empty state); `CopyButton` (clipboard success + denial fallback); `ThemeToggle` (cookie write + icon swap).
- [ ] **e2e (Playwright) `tests/e2e/smoke.spec.ts`:** load → zero console errors → header stuck on scroll → anchor nav to exhibit → role switch to company (contacts masked) → wiring auto-cycle observed then handover on click → copy toast → CV link status 200 → footer back-to-top.
- [ ] **Responsive spec** consolidated from P6 (overflow assertions 11 viewports × 2 themes).
- [ ] **A11y spec** retained from P7 (axe states + keyboard journey).
- [ ] **SEO validation spec:** metadata/JSON-LD/sitemap/robots assertions via route fetches (parse, not string-match where possible).
- [ ] **CI:** `.github/workflows/ci.yml` — jobs: `lint-type` (eslint + tsc), `unit` (vitest), `e2e` (playwright with browser cache action), `build` (next build), `agent-tools` (content-scan, link-check, bundle-check, secret-scan); triggers: PR + push to main; Node 20 + pnpm cache; e2e runs against `next start` of the built app.
- [ ] Run entire suite locally; fix all failures (including flakes: stabilize waits with selectors/`expect.poll`, never sleeps).
- [ ] Browser QA matrix: screenshots at 1440/834/390 dark+light reviewed by owner one final time pre-deploy.
- [ ] Lighthouse re-run (post all phases) median recorded in artifact.

## 4. Technical Requirements

- Test deps dev-only: vitest, @testing-library/react, @testing-library/jest-dom (RTL pairing), jsdom or happy-dom, existing playwright + axe.
- No snapshot tests for layout (brittle); assert behavior + a11y + overflow instead.
- CI runtime target < 10 min; parallel jobs; playwright browsers cached.
- Flaky test policy: quarantine with owner-visible note, fix within this phase, unquarantine before DoD.

## 5. Files / Folders

Create/modify: `tests/unit/*`, `tests/components/*`, `tests/e2e/{smoke,responsive,a11y,seo}.spec.ts`, `vitest.config.ts`, `.github/workflows/ci.yml`, `playwright.config.ts` (webServer next start), package scripts (`test`, `test:e2e`).
Do not touch: app behavior (except bug fixes found by tests — list each in report).

## 6. Agent Folder

**Modified:** CI wiring references `agent/tools/*` (production-adjacent enforcement, intentionally outside `agent/`); artifact with suite summary + flake log + final screenshot matrix + lighthouse median.

## 7. Restrictions

- Do not weaken assertions to pass (no `skip`/loose timeouts as fixes).
- Do not add coverage thresholds gate (portfolio scale; keep signal, not bureaucracy).
- Do not run CI against external preview URLs (local build only at this phase).
- Do not leave quarantined tests at phase end.

## 8. Validation

- Local: `pnpm lint && pnpm tsc --noEmit && pnpm test && pnpm test:e2e && pnpm build` all green.
- CI: push branch, open PR, all jobs green (owner can view run).
- Suite runtime reported; zero skipped tests; zero console errors in e2e.
- Owner screenshot matrix sign-off.

## 9. Definition of Done

- [ ] Pyramid complete per §3; CI green on PR.
- [ ] All findings fixed (bug-fix list in report, each with test proving fix).
- [ ] PR approved with Final Report.

## 10. FINAL REPORT (fill in and return)

- Completed: …
- Files created: …
- Files modified: …
- Dependencies added: … (dev-only list with justification)
- Important technical decisions: … (quarantine log, flake fixes)
- Validation performed (commands + results): …
- Remaining issues: …
- Requires my approval: …
- Artifact path: agent/artifacts/<date>-phase-11/
