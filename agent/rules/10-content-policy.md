# Rule 10 — Content Policy (binding, zero exceptions)

## 1. Banned everywhere in rendered output

The following client/project names must NEVER appear in UI text, JS bundles, metadata, JSON-LD, OG tags, aria-labels, alt text, titles, slugs, comments in app code, or file names under `app/ components/ content/ public/`:

**Match Creatorz · Fivra · EinfraSouq · Aqar360 · TPGE (Espresso) · Hakuba (Snow Sports) · Listeners Connect**

They legitimately exist ONLY in `agent/context/cv-source.md` and `docs/cv/*.pdf` (both excluded from scan scope; neither is ever imported/rendered).

## 2. Render-safe wording (use product TYPES)

| Banned             | Use instead                                             |
| ------------------ | ------------------------------------------------------- |
| Match Creatorz     | freelance hiring marketplace                            |
| Fivra              | multi-role task & operations platform                   |
| EinfraSouq         | B2B construction-procurement marketplace (Oman/GCC)     |
| Aqar360            | real-estate marketplace (Oman)                          |
| TPGE Espresso      | multi-site café platform (Western Australia)            |
| Hakuba Snow Sports | ski-school booking & staff-scheduling platform (Japan)  |
| Listeners Connect  | emotional-support & relationship platform (own product) |

## 3. Allowed proper nouns

Prince Gupta · Konstant Infosolutions Pvt Ltd · SSTPL (Sehaj Synergy Tech. Pvt. Ltd.) · JECRC University · University of Rajasthan · Jaipur/Rajasthan/India · github.com/princegupta007 · linkedin.com/in/princegupta7.

## 4. Facts discipline

- Every claim, metric, date, and number must trace to `agent/context/cv-source.md` (CV verbatim) — mark content-module entries with `// CV:` comments.
- **Never invent** employers, dates, metrics, technologies, or outcomes. Presentation polish is allowed; new "facts" are not.
- Frozen truths: 3.5+ years (Jan 2023 – present) · notice "30 days (negotiable to 15)" · "Open to opportunities" · freelance window Jun 2026 – Jul 2026 shown as concurrent with the full-time role.
- Allowed metrics list: `cv-source.md` §"Allowed metrics" — use those exact values.
- Contact details render as plain text (email `princegupta98299@gmail.com`, phone `+91 99828 44166`) — no obfuscation.

## 5. Enforcement

- `tests/content-policy.test.ts` (Phase 4, Vitest): fails the pipeline on any banned string in the rendered/bundled surface = `app/ components/ content/ hooks/ lib/ public/`. `agent/**` and `docs/**` are excluded from scope (they legitimately quote the ban list for enforcement purposes).
- `agent/tools/content-scan.ts` (Phase 4, `pnpm agent:content-scan`): same scan, CI-wired (Phase 11).
- Guard test: nothing under app dirs imports/inlines `agent/context/*`.
