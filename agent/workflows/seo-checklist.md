# Workflow · SEO checklist (regression)

Run after any metadata, content-section, routing or asset change.

1. **Metadata crawl** — `curl -s <url> | sed -n '1,60p'`:
   title · description · canonical · og:{type,title,description,url,image} ·
   twitter:card · theme-color (both schemes) · robots index,follow.
   Previews must canonicalise to their own host (VERCEL_URL fallback), never prod.
2. **JSON-LD** — extract `<script type="application/ld+json">` and
   `node -e "JSON.parse(require('fs').readFileSync(0))"`; assert `@type Person`,
   sameAs = github+linkedin, no project names (content-scan covers strings).
3. **sitemap/robots** — `curl -I` both: 200; sitemap URL == canonical origin;
   robots references the sitemap.
4. **Heading audit** — `pnpm exec tsx agent/tools/sr-dump.ts`: exactly one h1,
   h2 per section, no skipped levels, landmarks labelled.
5. **Link integrity** — `pnpm agent:link-check`: anchors resolve, assets 200,
   externals noopener + allow-listed hosts, mailto/tel verbatim, descriptive texts.
6. **OG preview (owner, post-deploy)** — paste prod/preview URL into
   `https://www.opengraph.xyz/` or Meta debugger; expect og.png 1200×630 + title.
   Rich Results test: Person detected, 0 errors.
7. **No accidental noindex** — grep built HTML for `noindex`; must be absent.
8. **Asset weight** — og.png < 120 KB, favicon.svg < 1 KB (report in perf table).
