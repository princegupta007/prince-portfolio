# `agent/` — Coding-Agent Workspace (isolated from application code)

Everything in this folder exists for the AI coding agent (Antigravity / Arena). **None of it is imported, bundled, rendered, or deployed by the application.** Isolation is enforced by ESLint `no-restricted-imports` (app dirs may not import `agent/**`) and by `agent/tools/bundle-check.ts` (Phase 9, asserts zero agent references in build output).

## Contract

| Path | Purpose | Git |
|---|---|---|
| `README.md` (this file) | Folder contract + session checklist | committed |
| `rules/00…50-*.md` | Priority-ordered binding rules (project, content policy, design system, performance, accessibility, code style) — Phase 1 | committed |
| `context/cv-source.md` | Verbatim CV extract — **internal only, never rendered/imported** | committed |
| `context/prototype-notes.md` | Sections, interaction parameters, approved deviations | committed |
| `context/decisions.md` | Durable decisions log (append-only) | committed |
| `prompts/phase-*.md` | Copy-paste phase execution prompts (0–13) + protocol README | committed |
| `workflows/*.md` | Repeatable playbooks (implement-section, visual-parity-check, a11y-pass, perf-audit, seo-checklist, release, rollback, final-audit) — created in their phases | committed |
| `tools/*.ts` | Validation scripts run via `pnpm agent:*` (content-scan, screenshot-grid, link-check, bundle-check, secret-scan, smoke-prod) — created in their phases | committed |
| `artifacts/<date>-phase-NN/` | Per-phase evidence (screenshots, reports, task lists) | **gitignored** |
| `scratch/` | Throwaway experiments, OG template, drill flags | **gitignored** |

Root `AGENTS.md` is a thin pointer (≤30 lines) to this folder — it contains no rules itself.

## Session-start checklist (every agent session)

1. Read `/AGENTS.md` → `agent/rules/*` in numeric order (00 highest priority).
2. Read `agent/context/decisions.md` (latest entries matter most).
3. Read the current phase prompt in `agent/prompts/` — it is the task contract.
4. Verify branch: work happens ONLY on `phase/NN-<slug>` cut from `develop`. Never commit to `develop`/`main` directly.
5. During work: durable conclusions → append to `decisions.md`; evidence → `artifacts/<date>-phase-NN/`; junk → `scratch/`.
6. Before finishing: run the phase's Validation commands, fill the Final Report, commit with trailer `Agent: <name> (phase-NN)`.
