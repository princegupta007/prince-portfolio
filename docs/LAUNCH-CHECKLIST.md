# Launch Checklist — owner-executed steps

Repo-side work is complete and validated through v1.0.0-rc1. Everything below
needs the owner's GitHub/Vercel sessions (the agent never receives tokens).

## 1 · Push the repository
- `git push origin main develop` plus tags (`v1.0.0-rc1`, later `v1.0.0`).
- Confirm branch protection (optional): require CI green on `main` PRs.

## 2 · Import into Vercel (free tier)
- vercel.com → Add New → Project → import `princegupta007/prince-portfolio`.
- Framework preset: Next.js (auto-detected). Root: `/`. No env vars needed.
- Production branch: `main`. Preview branch: `develop`.
- Deploy → first production URL `prince-portfolio.vercel.app`.

## 3 · Verify on the live URL (10 min)
- `curl -I https://<url>/` → CSP, X-Content-Type-Options, Referrer-Policy,
  X-Frame-Options, Permissions-Policy present; no `x-powered-by`.
- Journey pass: ⌘K palette · theme flip + reload · /cv download · bad URL 404 ·
  mobile 390 px scroll (no sideways drift).
- Search: submit sitemap in Google Search Console (optional, recommended).

## 4 · Custom domain (optional)
- Vercel → Project → Settings → Domains → add apex or www; set A/CNAME at the
  registrar per Vercel's shown values; SSL issues automatically.
- Update `lib/constants.ts` SITE_URL + metadataBase, re-run `pnpm test:e2e`,
  ship as a `content/*` change (canonical/OG URLs follow).

## 5 · Post-launch hygiene
- Watch Vercel analytics-free basics: deploy log + Speed Insights (free plan)
  optional; Lighthouse from a real network once (expect 95+ perf).
- Future changes: branch → PR → CI green → squash into `develop` → preview
  check → release per docs/RELEASE-ROLLBACK-RUNBOOK.md.
