# Rule 00 — Project (highest priority; overrides all other rules on conflict)

## Identity

Personal portfolio of **Prince Gupta — Frontend Engineer** (React.js, Next.js, TypeScript), Jaipur, India. Single-page marketing site, no backend, no auth, no forms, no database. Goal: recruiters understand capability in <60s; Lighthouse ≥95; zero client/project names leaked.

## Stack (pinned — do not change without owner approval)

- Next.js **16.x** App Router (satisfies plan's "15+"), React 19, TypeScript strict + `noUncheckedIndexedAccess`
- Tailwind CSS **v4** (CSS-first `@theme`; no tailwind.config theme duplication)
- ESLint 9 flat config (`eslint-config-next`) + Prettier (+ tailwindcss plugin)
- pnpm, Node 20+
- Runtime dependencies: **`next`, `react`, `react-dom` — nothing else, ever** (dev deps per-phase prompts only)
- No animation library, no icon package, no component library, no state library.

### Next 16 specifics (this is NOT the Next.js in your training data)

Read `node_modules/next/dist/docs/` before using unfamiliar APIs. Known deltas that affect this repo: Turbopack is the default bundler (dev+build); `middleware.ts` is renamed `proxy.ts` (we use neither — headers live in `vercel.json`); request-time APIs (`cookies()`, `headers()`) are async; Next no longer overrides CSS `scroll-behavior` during navigation (single-route app: plain CSS smooth scroll is safe); root `AGENTS.md` contains a tool-managed block — never delete it.

## References (read-only, hash-frozen — decisions.md D7)

- UI/UX truth: `docs/prototype/index.html` · tokens: `docs/DESIGN-SYSTEM.md` · architecture/phases: `docs/IMPLEMENTATION-PLAN.md` (rev 1.1)
- Facts truth: `agent/context/cv-source.md` (internal only) · interaction parameters: `agent/context/prototype-notes.md`
- Task contract: current file in `agent/prompts/` · durable decisions: `agent/context/decisions.md` (append-only)

## Git conventions (decisions.md D3–D5)

- `main` = production (untouched during build) · `develop` = integration · work ONLY on `phase/NN-<slug>` cut from `develop`; squash-merge back; delete branch. Releases: `develop → main` PR + tag.
- Commits: imperative, scoped — `feat(hero): …`, `docs(phase-00): …`, `fix(wiring): …` — with trailer `Agent: Arena-Agent (phase-NN)`.
- Never commit: `.env*` (except `.env.example`), secrets, `agent/artifacts/`, `agent/scratch/`.

## Isolation guarantees (plan §2.13)

1. App code (`app/ components/ content/ hooks/ lib/ tests/`) never imports from `agent/` — ESLint-enforced.
2. `agent/tools/*` touch the app only through public surfaces (built output, localhost HTTP, source globs).
3. `agent/artifacts/` + `agent/scratch/` are gitignored, ephemeral.
4. `agent/context/cv-source.md` is never rendered/imported by app code (guard test, Phase 4).
5. Root `AGENTS.md` is a thin pointer (≤30 lines) — rules live here, not there.
6. Deployed bundle contains zero `agent/` references — asserted by `agent/tools/bundle-check.ts` (Phase 9).

## Escalation

Unclear or destructive → STOP and ask the owner (Critical Rule 16). Prototype↔plan conflict → identify before architectural change (Rule 7), log in `decisions.md`.
