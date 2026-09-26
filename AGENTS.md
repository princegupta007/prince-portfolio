<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# Repo agent guide (thin pointer — the rules live in `agent/`)

You are working on Prince Gupta's portfolio (Next.js App Router, single static route).
Before ANY change, in this order:

1. `agent/README.md` — folder contract + session-start checklist.
2. `agent/rules/*` in numeric order — `00-project` has highest priority.
3. `agent/context/decisions.md` — latest entries matter most.
4. Current task contract: the active file in `agent/prompts/` (phase 0–13).

Workflow: work ONLY on a `phase/NN-<slug>` branch cut from `develop`; never commit to
`develop` or `main`; squash-merge via PR after owner approval; evidence goes to
`agent/artifacts/<date>-phase-NN/` (gitignored); durable decisions get appended to
`agent/context/decisions.md`.

Hard bans: no client/project names in any rendered surface (`agent/rules/10-content-policy.md`) ·
no imports from `agent/` in app code (ESLint-enforced) · no runtime deps beyond
next/react/react-dom · no paid Vercel features · never modify `docs/prototype/index.html`.
