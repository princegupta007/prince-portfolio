# PHASE 8 — SEO & Discoverability

> Paste this entire file into Antigravity as one task. Phase 7 must be approved. Do not start Phase 9 until the Definition of Done is met and the owner approves the Final Report.

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
Complete SEO architecture per plan §2.8: metadata (title/description/canonical/OG/Twitter/theme-color), Person JSON-LD, `sitemap.ts`, `robots.ts`, semantic/heading/anchor audit, OG image asset, and link integrity tooling.

## 2. Context
Phases 1–7 delivered accessible responsive page. Copy for metadata comes from prototype `<head>` (title, description, OG strings — project-name-free). Canonical domain: `NEXT_PUBLIC_SITE_URL` (owner will set; placeholder `https://princegupta.dev`). Social handles/links verbatim from CV. No images except OG + favicon.

## 3. Tasks
- [ ] `app/layout.tsx` metadata export: `title` ("Prince Gupta — Frontend Engineer · React.js, Next.js, TypeScript"), `description` (prototype copy), `metadataBase` + `alternates.canonical`, `openGraph` (type profile, title, description, url, imageName og.png, 1200×630), `twitter` (summary_large_image + title/description), `robots` meta (index,follow), `theme-color` per scheme, `authors/creator` fields.
- [ ] `components/seo/JsonLd.tsx`: Person schema (name, jobTitle, email, telephone, address Jaipur/Rajasthan/IN, sameAs github+linkedin, worksFor Konstant Infosolutions Pvt Ltd, alumniOf JECRC + University of Rajasthan, knowsAbout list from CV skills) — **no project names**; render as server component `<script type="application/ld+json">`.
- [ ] `app/sitemap.ts`: `/` with canonical + lastmod build date; `app/robots.ts`: allow all + sitemap URL.
- [ ] Heading/semantic audit script output in artifact: exactly one h1; h2 per section (9 + wiring h3); no skipped levels; every section `aria-labelledby` matches.
- [ ] Anchor/text audit: descriptive link texts (no "click here"); external links `rel="noopener noreferrer"`; CV links `download` + meaningful text; tel/mailto correct formats.
- [ ] OG image: create `public/og.png` 1200×630 using existing Playwright (render a local HTML template styled with design tokens: name, title, mono skill line, lime accent; screenshot to PNG). No new deps. Also `public/favicon.svg` (PG monogram, prototype data-URI design as file).
- [ ] `agent/tools/link-check.ts`: internal anchors exist (all `href="#…"` targets present), external URLs reachable (HEAD, allow-list github/linkedin/mailto/tel skipped appropriately), CV asset 200; wire `pnpm agent:link-check`.
- [ ] `agent/workflows/seo-checklist.md` authored (metadata crawl, JSON-LD parse, sitemap/robots fetch, heading audit, OG debugger steps for owner).
- [ ] Verify SSR HTML contains metadata + JSON-LD (curl), and that client islands do not render metadata-critical content.

## 4. Technical Requirements
- Metadata via Next `metadata` API only (no manual `<title>` tags).
- JSON-LD must be valid JSON (parse check in validation) and identical across themes.
- OG/PNG generated once and committed (not runtime-generated).
- No SEO spam: single canonical, no keyword stuffing beyond prototype copy.

## 5. Files / Folders
Create/modify: `app/layout.tsx` (metadata), `components/seo/JsonLd.tsx`, `app/sitemap.ts`, `app/robots.ts`, `public/og.png`, `public/favicon.svg`, `agent/tools/link-check.ts`, `agent/workflows/seo-checklist.md`, artifact (curl head dumps, JSON-LD parse, heading audit, OG preview screenshot).
Do not touch: sections' visual code, tokens, a11y attributes (except anchor texts if audit demands).

## 6. Agent Folder
**Modified:** new tool `link-check.ts` + workflow `seo-checklist.md`; OG template stored under `agent/scratch/og-template.html` (gitignored) with output committed to `public/`.

## 7. Restrictions
- Do not add meta keywords, hidden text, or schema types beyond Person (+WebSite if owner approves).
- Do not fetch third-party SEO services.
- Do not change visible copy for SEO reasons without owner approval.
- Do not generate OG at runtime (static asset only).

## 8. Validation
- `pnpm lint && pnpm tsc --noEmit && pnpm build` green; `pnpm agent:link-check` exit 0.
- `curl -s localhost:3000 | head -60`: title/description/canonical/OG/Twitter/theme-color present; JSON-LD parses via `node -e JSON.parse` extraction.
- `/sitemap.xml` + `/robots.txt` return 200 with correct URLs (env-driven).
- Heading audit: 1×h1, 9×h2 (+wiring h3), no skips.
- Owner runs OG debugger / Rich Results test on preview URL in Phase 12 (note as pending).

## 9. Definition of Done
- [ ] Metadata + JSON-LD + sitemap + robots live and validated; OG/favicon committed.
- [ ] Link-check green; heading/anchor audits clean.
- [ ] `seo-checklist.md` workflow committed; PR approved with Final Report.

## 10. FINAL REPORT (fill in and return)
- Completed: …
- Files created: …
- Files modified: …
- Dependencies added: … (expected: none)
- Important technical decisions: … (canonical placeholder handling, OG generation method)
- Validation performed (commands + results): …
- Remaining issues: … (owner-side debugger checks pending Phase 12)
- Requires my approval: …
- Artifact path: agent/artifacts/<date>-phase-08/
