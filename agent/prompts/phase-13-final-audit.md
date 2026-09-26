# PHASE 13 — Final Production Audit & Handoff

> Paste this entire file into Antigravity as one task. Phase 12 must be approved. This is the final phase — nothing ships to "done" until this report is signed off by the owner.

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
Run a complete final audit of the LIVE production site against every standard in the plan (content integrity, visual/prototype parity, UX, responsive, a11y, SEO, performance, browser compat, security, error handling, agent hygiene, deploy readiness), fix or formally record every finding, then produce the owner sign-off pack and tag v1.0.0.

## 2. Context
Phases 0–12 complete: app deployed on Vercel Hobby, CI green, artifacts archived per phase. This phase audits the PRODUCTION URL (plus fresh local build for source-level checks). Plan §10 (agent hygiene) and §13 (deliverables) are checklists for this audit.

## 3. Tasks
- [ ] Author `agent/workflows/final-audit.md` (the 15-area checklist below, executable order, evidence requirements), then execute it in full:
  1. **Content integrity:** every fact traced to CV (metrics, dates, companies, education, contacts, availability, notice line); zero invented claims; email/phone/links verbatim.
  2. **Project anonymity:** `agent:content-scan` on prod HTML + assets; forbidden names absent in UI/JS/meta/aria/alt; company names correctly limited to Konstant/SSTPL/JECRC/Rajasthan Univ.
  3. **Visual/prototype parity:** run `visual-parity-check` workflow (screenshot-grid) prod vs frozen prototype shots; owner reviews any diffs.
  4. **Interaction parity:** exhibit roles, wiring handover, palette commands, copy, theme, preloader-once, back-to-top — all behaviors match prototype notes.
  5. **Responsive:** overflow spec re-run against prod (11 viewports × 2 themes); touch ergonomics spot checks.
  6. **Accessibility:** axe prod both themes + open states; keyboard journey; reduced-motion full static pass; Lighthouse a11y ≥ 95.
  7. **SEO:** prod metadata/canonical/OG/Twitter/JSON-LD parse/sitemap/robots/heading structure; Rich Results + OG debugger owner-run confirmed; favicon/og.png resolve on prod host.
  8. **Performance:** Lighthouse mobile median ×3 ≥ 95 on prod; bundle-check final table ≤ 70 KB gz; Speed Insights beacon = only third-party script; cache headers live (curl -I).
  9. **Browser compatibility:** Chromium/Firefox/WebKit (Playwright engines) + Safari-mobile emulation: no console errors, layout intact, palette/copy/theme work.
  10. **Security:** security headers + CSP enforced clean on prod; `agent:secret-scan` on repo; no credentials anywhere; external links noopener; CV served without directory listing.
  11. **Error handling:** prod 404 styled + status 404; island fallbacks verified by re-running drill against local build (prod untouched); retry path works.
  12. **Cost safety:** re-verify Hobby-only state (Vercel dashboard: no Pro features, usage within limits) — update cost report if limits changed since Phase 12.
  13. **Agent hygiene (plan §10):** app code imports nothing from `agent/`; no `cv-source` content beyond CV-public facts; rules/ workflows/ tools/ consistent with final implementation; decisions.md complete (all 24+ decisions); artifacts exported per phase; scratch/ not committed.
  14. **CI/CD:** CI green on main; branch protection documented for owner; release + rollback workflows executable as written (dry-read); tag hygiene.
  15. **Documentation:** root README (setup, scripts, agent usage, deploy), `docs/` current (plan rev, design system), `agent/README.md` matches actual structure; CV PDF present and linked everywhere expected.
- [ ] Fix every finding that is fixable now; formally record accepted exceptions with owner signature in `agent/artifacts/<date>-phase-13/exceptions.md`.
- [ ] Produce **sign-off pack** artifact: audit checklist (all 15 areas: pass/evidence links), final metrics table (Lighthouse ×3 median, bundle sizes, axe results, overflow results), known-issues list, maintenance guide (content edit workflow, redeploy steps, agent session protocol, branch model for post-launch work); fixes follow the normal flow (`phase/13-final-audit` → `develop`), then final release merge `develop → main` + tag `v1.0.0`.

## 4. Technical Requirements
- Audit runs against production URL; source checks against fresh local build (parity of artifacts proven).
- No new dependencies; no feature work in this phase (audit + fixes only; fixes require owner pre-approval if they change visuals/copy).

## 5. Files / Folders
Create/modify: `agent/workflows/final-audit.md`, artifact pack, README/docs touch-ups, bug fixes if any (listed individually), tag `v1.0.0`.
Do not touch: anything not flagged by the audit.

## 6. Agent Folder
**Modified:** final-audit workflow + sign-off pack archived; decisions.md closed out; any rule/workflow drift corrected (single source of truth restored).

## 7. Restrictions
- Do not "improve" the site beyond audit findings (scope creep = new change request).
- Do not delete agent artifacts/decisions history.
- Do not close exceptions without owner sign-off.
- Do not tag v1.0.0 before every area is pass-or-approved-exception.

## 8. Validation
- Final-audit workflow fully executed with evidence per area; CI green; prod Lighthouse median ≥ 95; axe 0; overflow 0; content-scan 0; secret-scan 0; bundle ≤ budget.
- Sign-off pack reviewed by owner; exceptions (if any) signed.
- Tag v1.0.0 pushed; deployment verified serving tagged build.

## 9. Definition of Done
- [ ] 15/15 areas pass or carry signed exceptions.
- [ ] Sign-off pack + maintenance guide archived; owner approves.
- [ ] v1.0.0 tagged and live. Project complete.

## 10. FINAL REPORT (fill in and return)
- Completed: …
- Files created: …
- Files modified: …
- Dependencies added: … (expected: none)
- Important technical decisions: … (exceptions, fixes applied)
- Validation performed (commands + results): … (final metrics table)
- Remaining issues: … (signed exceptions)
- Requires my approval: … (final sign-off)
- Artifact path: agent/artifacts/<date>-phase-13/
