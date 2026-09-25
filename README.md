# prince-portfolio

Personal portfolio for **Prince Gupta** — Frontend Engineer (React.js / Next.js / TypeScript).

Production portfolio: 3.5+ years of frontend work — admin platforms, marketplaces, and
operational dashboards.

## Stack

- **Next.js 15** (App Router, Server Components)
- **TypeScript** (strict)
- **Tailwind CSS**
- **Vercel** — hosting, preview deployments, Web Analytics, Speed Insights

No UI kit, no animation library, no runtime dependencies beyond React and Next.js.

## Features

- Static-first rendering — every section is a Server Component; only four small islands ship JS
- Interactive **role-lens** demo: switch between four user roles and watch navigation and
  data scope respond
- Command palette (`⌘K` / `Ctrl+K`) for navigation and quick actions
- Dark and light themes with no flash on load, respecting the OS preference
- Accessible: skip link, visible focus states, `aria-pressed` toggles, `aria-live`
  announcements, full keyboard support
- Reduced-motion support and a print stylesheet

## Running locally

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

```bash
pnpm build && pnpm start   # production build
```

## Structure

```
app/          routes, metadata, sitemap, robots, OG image
components/   sections and UI primitives
lib/content   all copy as typed constants — content lives here, not in JSX
public/cv     the downloadable CV PDF
```

## Contact

- Email: princegupta98299@gmail.com
- LinkedIn: [in/princegupta7](https://www.linkedin.com/in/princegupta7/)
- GitHub: [@princegupta007](https://github.com/princegupta007)

---

Code is MIT licensed. Written content, project descriptions, and design are © Prince Gupta.
