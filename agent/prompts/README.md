# Agent Prompts — Sequential Phase Execution (Antigravity)

This folder contains **one copy-paste-ready execution prompt per phase** (Phase 0 → Phase 13).
Source of truth: `docs/IMPLEMENTATION-PLAN.md` (rev 1.1) · visual spec: `docs/prototype/index.html` ·
tokens: `docs/DESIGN-SYSTEM.md` · content truth: `agent/context/cv-source.md` (CV extract).

## Protocol (owner + agent)

1. **One phase per Antigravity session/PR.** Paste the entire phase file as a single task. Do not split, do not merge phases.
2. The agent works on a phase branch (`phase/NN-<slug>`, matching this file's slug, cut from `develop`), commits with trailer `Agent: Antigravity (<session>)`, pushes and opens a PR **into `develop`** naming this workflow. The agent never commits directly to `develop` or `main`.
3. Agent exports its Agent Manager artifacts (task list / plan / walkthrough) to `agent/artifacts/<YYYY-MM-DD>-phase-NN/` and links them in the PR.
4. Agent returns the **Final Report** block filled in. Owner reviews report + evidence.
5. **Owner approves → only then** paste the next phase file. A phase that fails its Validation or Definition of Done is re-run in a follow-up session on the same branch, never skipped.
6. Durable conclusions are promoted to `agent/context/decisions.md`; everything else expires in gitignored `artifacts/`.

## Git branch model (simple — two long-lived branches)

- **`main`** — production. Vercel production deployments + release tags (`v1.0.0`, …). Only touched by `develop → main` release PRs and `hotfix/*` branches. During the build (Phases 0–11) it stays untouched.
- **`develop`** — integration / ongoing development. Vercel persistent preview = staging. Every phase PR lands here (squash merge → one commit per phase; branch deleted after merge).
- **`phase/NN-<slug>`** — one per phase file: `phase/00-analysis` … `phase/13-final-audit`. Always cut from `develop`, always merged back into `develop`, never into `main` directly.
- **Post-launch:** `feat/<slug>`, `fix/<slug>`, `content/<slug>`, `chore/<slug>` from `develop`; `hotfix/<slug>` from `main` for production-only fixes (then immediately merge `main → develop`).
- **Release:** `develop → main` PR (merge commit) + tag. Planned during the build: once at Phase 12 (launch) and once after Phase 13 sign-off (`v1.0.0`).

## Files

| File                         | Phase                                                  |
| ---------------------------- | ------------------------------------------------------ |
| `phase-00-analysis.md`       | Project analysis & preparation                         |
| `phase-01-foundation.md`     | Project foundation + agent scaffold                    |
| `phase-02-design-system.md`  | Architecture & design system                           |
| `phase-03-global-layout.md`  | Global layout (header/nav/footer/theme)                |
| `phase-04-sections.md`       | Portfolio sections (server-rendered, content-complete) |
| `phase-05-advanced-uiux.md`  | Motion & micro-interaction layer                       |
| `phase-06-responsive.md`     | Responsive pass                                        |
| `phase-07-accessibility.md`  | Accessibility pass                                     |
| `phase-08-seo.md`            | SEO & discoverability                                  |
| `phase-09-performance.md`    | Performance pass                                       |
| `phase-10-error-handling.md` | Error handling & production readiness                  |
| `phase-11-testing-qa.md`     | Testing & QA + CI                                      |
| `phase-12-vercel.md`         | Vercel deployment (Hobby tier)                         |
| `phase-13-final-audit.md`    | Final production audit                                 |
