# Release & Rollback Runbook

## Branch model (kept simple)
- `main` = production. `develop` = integration/staging.
- Work branches: `phase/NN-*` (build phases, now closed), then
  `feat/* · fix/* · content/* · chore/*` from `develop`; squash-merge back.
- Hotfixes: `hotfix/*` cut from `main`, fixed, merged to `main` (tag) AND back
  to `develop` immediately.

## Launching a release (owner-executed on GitHub/Vercel)
1. Ensure `develop` is green in CI (ci.yml: typecheck, unit, content, links,
   build, budgets, e2e, axe).
2. PR `develop → main`, squash-merge, tag `v1.0.0` on the merge commit.
3. Vercel: production branch = `main` → the tag push auto-deploys production.
   Preview deployments come from `develop` and PRs automatically.
4. Post-deploy smoke (5 min): open prod URL; ⌘K palette; theme flip + reload
   persistence; /cv PDF; one bad URL → styled 404; curl -I for CSP headers.

## Rollback (fastest → cleanest)
1. Vercel dashboard → Deployments → previous production deploy → ⋯ →
   Promote to Production. Instant, no git changes. (~30 s)
2. If the bad commit is tagged: `git revert -m 1 <merge-sha>` on `main` via PR,
   or reset `main` to the previous tag force-push (only if no later commits).
3. Content-only regressions: revert the single squash commit on `develop`,
   ride the normal PR train.
Never roll forward blindly: reproduce locally with `pnpm build && pnpm exec next start -p 3100`
and run `pnpm test:e2e` before re-shipping.

## Cadence & guards
- Release when `develop` has ≥1 merged, validated change set; no scheduled trains.
- Tags are immutable; every production state maps to a tag or a Vercel deploy ID.
- Free-tier guardrails: keep build minutes < 60/mo (one build ≈ 1–2 min),
  bandwidth < 100 GB/mo (static site ≈ KB/visit).
