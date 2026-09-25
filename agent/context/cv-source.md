# CV Source (INTERNAL ONLY — NEVER RENDERED, NEVER IMPORTED BY APP CODE)

> Verbatim text extraction of `docs/cv/Prince_Gupta_Frontend_Engineer.pdf`
> (sha256 `b5cdf31f…bf457a`, 1 page). This file legitimately contains client/project
> names because the CV does. **None of them may appear in `app/`, `components/`,
> `content/`, metadata, aria-labels, alt text, or any rendered output.**
> Enforcement: `tests/content-policy.test.ts` + `agent/tools/content-scan.ts` (Phase 4).
> The scan scope excludes `agent/context/` and `docs/cv/`, and a guard test asserts no
> app/content module imports or inlines this file.

## Verbatim CV text

PRINCE GUPTA
Frontend Engineer | React.js, Next.js, TypeScript | Node.js, NestJS, PostgreSQL
Jaipur, Rajasthan, India | +91 99828 44166 | princegupta98299@gmail.com
linkedin.com/in/princegupta7 | github.com/princegupta007 | prince-dev-portfolio.vercel.app

SUMMARY
Frontend engineer with full-stack delivery, 3.5+ years (Jan 2023 – present): React, Next.js, and TypeScript products with NestJS/Express APIs on PostgreSQL. Built server-enforced RBAC for 4 roles, subscription tiers with feature gating, and real-time bid and chat flows over WebSockets; cut Match Creatorz's initial bundle ~30%.

TECHNICAL SKILLS
- Languages: JavaScript (ES6+), TypeScript
- Frontend: React.js, Next.js (App Router, SSR), Zustand, TanStack Query, Material-UI, HTML5, CSS3, Tailwind CSS, responsive design, code-splitting and lazy loading
- Backend: Node.js, Express.js, NestJS, REST APIs, JWT authentication, RBAC, WebSockets, PostgreSQL with Prisma
- AI: AI-assisted development (Claude Code, Cursor)
- Testing: Jest, React Testing Library
- Tools: Git, GitHub, Vercel, Turborepo (monorepo), CI/CD, bundle optimisation

PROFESSIONAL EXPERIENCE

**Associate Software Developer | Konstant Infosolutions Pvt Ltd, Jaipur — Jul 2024 – Present**
- Match Creatorz — freelance hiring marketplace
  - Built the bid-to-hire transaction flow and buyer-freelancer chat in the authenticated React SPA (TypeScript, TanStack Query, Zustand) — freelancers bid on posted jobs and buyers accept, with bid and message state pushed over WebSockets using optimistic updates that roll back on server rejection.
  - Rebuilt the public marketing surface as a separate Next.js App Router app with SSR on Vercel so it could be crawled and cached independently of the SPA.
  - Cut the initial bundle by ~30% with route-based code-splitting, lazy loading, and dependency pruning.
- Fivra — multi-role task and operations platform
  - Built the RBAC model for 4 roles (Super Admin, Admin, Company, Partner), enforced strictly server-side on every API endpoint as well as in the UI, with separate dashboards and permission-based UI rendering for daily task management across 5,000+ active users.
- EinfraSouq — B2B construction-procurement marketplace, Oman/GCC
  - Delivered the seller and admin panels against REST APIs: a 6-step product-listing wizard, seller onboarding with 4 mandatory document uploads and admin approval, and order/RFQ management across 8 order and 6 RFQ statuses, with shared components extracted into a Turborepo monorepo reused across 3+ applications.
  - Implemented subscription screens in both panels: seller plan selection and renewal, plus admin plan and pricing configuration, with plan-based limits (10 / 100 / unlimited) and feature flags gating RFQ participation, sample requests, and listing visibility across 3 tiers.
- Aqar360 — real-estate marketplace, Oman (Super Admin panel)
  - Built 22 modules across user management, property approval, enquiries, feedback, VIP requests, advertisements, notifications, and bilingual (English/Arabic) CMS content.
  - Implemented role-scoped permissions for Sub-Admin employees — access varies by assigned property and listing type, with seller contact details hidden from sub-admins on sale listings and visible on rentals.
  - Shipped backend alongside the panel — 20 REST endpoints in NestJS over PostgreSQL with Prisma, owning the queries and schema changes behind commission, reservation, and regional pricing configuration.
- TPGE Espresso — multi-site cafe platform, Western Australia
  - Shipped the admin panels: site provisioning, with new store locations created from the panel and given their own menu and stock; inventory and stock-movement logic covering intake, consumption, and adjustments; order management and role-based dashboards; component library reused across 5+ admin views with Jest and React Testing Library coverage.
- Hakuba Snow Sports (Japan) — ski-school booking & staff scheduling platform
  - Built the staff roster front end in React.js, pushing shift and availability updates live over WebSockets to ~40 seasonal instructors, backed by a NestJS REST API serving group, private, and kids lesson bookings.

**Freelance Full-Stack Developer (Independent) | Own product, concurrent with full-time role — Jun 2026 – Jul 2026**
- Listeners Connect — emotional-support & relationship platform
  - Delivered the platform end to end as sole developer, connecting users with listeners and experts across 8 support categories, taking the React.js admin panel, public site, and Node.js/Express API with JWT authentication to production within 8 weeks using AI-assisted development workflows (Claude Code, Cursor).

**Jr. Full Stack Developer | SSTPL (Sehaj Synergy Tech. Pvt. Ltd.), Jaipur — Jan 2023 – Jul 2024**
- Built an RFID employee check-in/check-out pipeline — reader events ingested and stored through a Django service, surfaced on a live React.js map dashboard processing 500+ events/day; extended it to a child-safety use case with alerts routed to designated staff.
- Implemented JWT authentication across 5+ internal tools — React login flow against Django REST endpoints — and built 10+ reusable React/Material-UI components covered by Jest and React Testing Library tests; also contributed to peer code reviews and CI/CD pipeline maintenance.
- Built data-entry forms that cut manual processing time ~25% for 50+ operations staff across 3 internal teams.

EDUCATION
- Master of Computer Applications (MCA) — Data Science and Data Analytics | JECRC University, Jaipur | 2021 – 2023
- Bachelor of Computer Applications (BCA) — Computer Science | University of Rajasthan, Jaipur | 2017 – 2021

## Render-safe transformations (approved mappings — CV name → portfolio wording)

| CV project name (BANNED in UI) | Portfolio-safe product TYPE wording |
|---|---|
| Match Creatorz | freelance hiring marketplace |
| Fivra | multi-role task & operations platform |
| EinfraSouq | B2B construction-procurement marketplace (Oman/GCC) |
| Aqar360 | real-estate marketplace (Oman) |
| TPGE Espresso | multi-site café platform (Western Australia) |
| Hakuba Snow Sports | ski-school booking & staff-scheduling platform (Japan) |
| Listeners Connect | emotional-support & relationship platform (own product) |

Employers **Konstant Infosolutions Pvt Ltd** and **SSTPL**, plus **JECRC University** and **University of Rajasthan**, ARE allowed (they are employers/educators, not client projects).

## Allowed metrics (render-safe, CV-backed)

3.5+ years (Jan 2023 – present) · ~30% initial bundle cut · 22 admin modules · 20 REST endpoints · 4-role server-enforced RBAC · 5,000+ active users · 500+ RFID events/day · ~25% manual-processing-time cut · 8 order + 6 RFQ statuses · 6-step listing wizard · plan limits 10/100/unlimited (3 tiers) · 4 mandatory document uploads · monorepo reused across 3+ apps · component library across 5+ admin views · JWT across 5+ internal tools · 10+ tested reusable components · 8 support categories · EN/AR bilingual CMS · 4 geographies (India, Oman/GCC, W. Australia, Japan) · 7 shipped products · ~40 seasonal instructors · 50+ operations staff / 3 internal teams · 8 weeks to production · notice 30 days (negotiable to 15) · open to opportunities.
