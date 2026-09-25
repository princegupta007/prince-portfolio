# PHASE 12 — Vercel Deployment (Hobby free tier)

> Paste this entire file into Antigravity as one task. Phase 11 must be approved. Do not start Phase 13 until the Definition of Done is met and the owner approves the Final Report.

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

Deploy to Vercel entirely within the Hobby free tier: project link, env config, preview + production pipelines, Speed Insights, cache/header verification on live URLs, rollback drill, and an explicit **cost-identification report** naming anything that could ever incur cost.

## 2. Context

Phases 1–11 delivered CI-green app. Plan §7 is binding: static prerender, zero serverless functions, zero DB/middleware/cron; Hobby limits to respect (verify live at kickoff and record): ~100 GB/mo transfer, 6,000 build min/mo, 1–2 concurrent builds, 1k optimized images/mo (unused), Speed Insights free on Hobby. Site weight ~2–4 MB/visit ⇒ huge headroom.

## 3. Tasks

- [ ] Owner performs one-time account/GitHub connect (agent documents steps; agent never handles credentials). Project import: framework Next.js detected; root dir repo root; Node 20; pnpm.
- [ ] Environment variables: `NEXT_PUBLIC_SITE_URL` (production value; preview env left unset → code falls back to `VERCEL_URL` for canonical/OG on previews); no secrets exist — assert `.env*` never committed.
- [ ] Release merge: open `develop → main` PR (merge commit, title "release: launch candidate v1.0.0-rc1"); Vercel project settings confirm production branch = `main`, develop = persistent preview.
- [ ] Verify `vercel.json` behaviors live: security headers present on `/` (curl -I), cache headers on `/_next/static/*`, `/cv/*.pdf`, `/og.png`; redirects (none expected) documented.
- [ ] Preview deployments: PR from a trivial branch → preview URL auto-created; run `agent/tools/smoke-prod.ts` + link-check against preview; confirm canonical/OG use preview host fallback (no prod canonical leak on previews).
- [ ] Production deploy from `main`; post-deploy checklist executed on prod URL: 200s (`/`, sitemap, robots, CV), JSON-LD parse, OG debugger + Rich Results (owner-run, agent provides steps + expected values), Lighthouse mobile ≥ 95 median ×3, axe scan, link sweep, theme/reduced-motion spot checks, cache headers, HSTS present on prod domain.
- [ ] Enable **Vercel Speed Insights** (free on Hobby); confirm beacon loads (~2 KB) and dashboard receives data; document it as the ONLY third-party script.
- [ ] **Cost-identification report** in artifact + Final Report: table of every enabled Vercel feature → tier → limit → current usage estimate → what would push it paid (e.g., Deployment Protection = Pro, Vercel Analytics events = plan-dependent → NOT enabled, image optimization beyond 1k/mo, bandwidth > 100 GB, function GB-hrs > 0 only if someone adds functions). Explicit statement: no paid feature enabled.
- [ ] Rollback drill: `vercel promote <previous-deployment>` on production, verify old build serves, then promote current back; document exact commands + dashboard path in `agent/workflows/rollback.md`; author `agent/workflows/release.md` (pre-merge checks, PR body template, tagging `v1.0.0` at Phase 13).
- [ ] Custom domain (if owner provides): add domain + DNS steps documented; canonical/OG switch verified; HSTS/SSL auto confirmed. (Optional; placeholder domain acceptable.)
- [ ] Tag repo `v1.0.0-rc1` after prod verification.

## 4. Technical Requirements

- Zero serverless functions/middleware/edge/cron/blob in final config (assert via `vercel.json` + build output "no functions").
- Previews public (content is public); do NOT enable Deployment Protection (paid) — owner approval required if ever desired.
- All verification scripts run against HTTPS prod/preview URLs; no local-only assumptions.

## 5. Files / Folders

Create/modify: `agent/workflows/{release,rollback}.md`, artifact (cost report, header dumps, checklist results, rollback drill log), repo tag. Possibly `vercel.json` tweaks if live checks diverge.
Do not touch: app code (except config fixes demanded by live checks — list them).

## 6. Agent Folder

**Modified:** release + rollback workflows authored; cost report archived; decisions.md updated with live-verified Hobby limits (date-stamped).

## 7. Restrictions

- Do not enable ANY paid feature (Analytics events, Pro bandwidth, Deployment Protection, Vercel Firewall paid tiers) without explicit owner approval in writing.
- Do not store credentials/tokens in repo or agent files; CLI login happens in owner session.
- Do not add serverless API routes "for later".
- Do not declare done before rollback drill succeeds both directions.

## 8. Validation

- Prod URL passes full post-deploy checklist (evidence in artifact).
- Preview pipeline proven on a real PR; canonical fallback proven.
- `curl -I` prod: security + cache headers + HSTS present.
- Speed Insights dashboard shows data; network tab confirms single beacon.
- Rollback drill log complete; cost report signed by owner.

## 9. Definition of Done

- [ ] Production live + verified; previews working; env config correct.
- [ ] Cost report approved (confirms Hobby-only).
- [ ] release/rollback workflows committed; tag created; PR/Final Report approved.

## 10. FINAL REPORT (fill in and return)

- Completed: …
- Files created: …
- Files modified: …
- Dependencies added: … (expected: none)
- Important technical decisions: … (domain handling, preview canonical strategy)
- Validation performed (commands + results): …
- Remaining issues: …
- Requires my approval: … (cost report sign-off, optional custom domain)
- Artifact path: agent/artifacts/<date>-phase-12/
