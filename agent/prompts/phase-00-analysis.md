# PHASE 0 — Project Analysis & Preparation

> Paste this entire file into Antigravity as one task. Do not start Phase 1 until the Definition of Done is met and the owner approves the Final Report.

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
Analyse every provided artifact, establish the repository's knowledge base (`docs/`, `agent/context/`), and produce a written implementation analysis (sections, islands, interactions, assets, assumptions). **No application code is written in this phase.**

## 2. Context
Greenfield repo. The owner provides: the approved prototype (`index.html`, single-file, v2.1), the CV PDF, `DESIGN-SYSTEM.md`, `IMPLEMENTATION-PLAN.md` (rev 1.1). The plan is the source of truth for stack/architecture; the prototype is the source of truth for UI/UX. Hard constraints: no project names anywhere in portfolio content; CV is the only factual source; Vercel Hobby tier only; runtime deps = `next, react, react-dom` only.

## 3. Tasks
- [ ] Inventory the workspace; record what exists vs what is missing.
- [ ] Create `docs/` and place: `docs/prototype/index.html` (frozen prototype), `docs/DESIGN-SYSTEM.md`, `docs/IMPLEMENTATION-PLAN.md`, `docs/cv/Prince_Gupta_Frontend_Engineer.pdf`.
- [ ] Read the prototype end-to-end. Produce in `agent/context/prototype-notes.md`: (a) list of all sections in order (01 Hero, 02 Numbers, 03 Expertise + 03·B Wiring, 04 Exhibit, 05 Experience, 06 Principles, 07 Stack, 08 Background, 09 Contact, footer); (b) every interaction with its parameters (hero role-cycle 2.9s super→admin→company→partner; rotator 5 words @3.6s scramble; counters 1.5s; marquee 42s duplicated set; wiring auto-cycle 4.6s with permanent handover; exhibit audit lines 150ms stagger max 7; preloader once/session; theme dark default + light "paper"); (c) the two approved deviations (cookie theme, lazy palette).
- [ ] Extract the CV text into `agent/context/cv-source.md` with line references. Mark it **internal-only, never rendered, never imported by app code** (it legitimately contains project names; the content-policy scan scope excludes `agent/context/` but includes a guard test that no app/content file imports or inlines it).
- [ ] Create `agent/README.md` (folder contract + session-start checklist), `agent/artifacts/`, `agent/scratch/` (both gitignored), and copy this prompt set into `agent/prompts/`.
- [ ] Write `agent/artifacts/<date>-phase-00/analysis.md`: section→component map (server vs client island per plan §2.3), asset list (CV PDF, favicon.svg, og.png 1200×630 to be produced in Phase 8, noise = CSS data-URI), assumptions list (canonical domain placeholder via `NEXT_PUBLIC_SITE_URL`; no forms; no analytics except Speed Insights in Phase 12; email/phone/links public per CV), open questions for the owner.
- [ ] Confirm in writing (inside the analysis): "Project names must NOT appear in portfolio content; enforcement = `tests/content-policy.test.ts` + `agent/tools/content-scan.ts` (Phase 3/4)."

## 4. Technical Requirements
- Markdown-only deliverables; zero dependencies installed; zero app code.
- Every claim in the analysis must cite its source file (prototype section / plan § / CV line).

## 5. Files / Folders
Create: `docs/**`, `agent/README.md`, `agent/context/cv-source.md`, `agent/context/prototype-notes.md`, `agent/prompts/**` (this set), `agent/artifacts/<date>-phase-00/analysis.md`, `agent/scratch/`, `.gitignore` (repo init allowed: git only).
Modify: nothing else.

## 6. Agent Folder
**Created in this phase.** This is the only phase that bootstraps `agent/`. Keep everything agent-specific here; `docs/` holds shared human+agent references.

## 7. Restrictions
- Do NOT initialize the Next.js app, install packages, or write any `app/`, `components/`, `content/` code.
- Do NOT paraphrase CV facts into new claims (extract verbatim only).
- Do NOT publish/commit project names outside `agent/context/cv-source.md` and `docs/cv/`.
- Do NOT make design decisions — record questions instead.

## 8. Validation
- `git status` shows only the files listed in §5.
- Analysis file lists ≥ 9 sections, ≥ 12 interactions with parameters, ≥ 3 assets, ≥ 5 assumptions.
- Owner reads `analysis.md` and answers the open questions.

## 9. Definition of Done
- [ ] `docs/` complete and frozen (prototype hash recorded in analysis).
- [ ] `agent/context/` contains cv-source + prototype-notes.
- [ ] Analysis approved by owner (explicit "proceed to Phase 1").
- [ ] Final Report returned.

## 10. FINAL REPORT (fill in and return)
- Completed: …
- Files created: …
- Files modified: …
- Dependencies added: … (expected: none)
- Important technical decisions: …
- Validation performed (commands + results): …
- Remaining issues: …
- Requires my approval: … (open questions list)
- Artifact path: agent/artifacts/<date>-phase-00/
