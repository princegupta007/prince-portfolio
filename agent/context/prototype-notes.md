# Prototype Notes — `docs/prototype/index.html` (FROZEN, sha256 `839584ca…ca8f5e`)

Source of truth for UI/UX. Do not modify the prototype file; port from it.

## A. Section order (top → bottom)

1. Preloader (overlay, once per session)
2. Header (fixed): brand monogram "PG", name + mono subtitle, nav 02–08 (7 links, underline wipe + scrollspy active), ⌘K search button, theme toggle (sun/moon), lime "Download CV" button, burger ≤1080
3. Mobile menu (full-screen clip-path circle from burger; staggered big links 02–09 + CTA row + meta)
4. Dot rail (fixed right, 9 dots, hover labels, active lime ring, hidden <1280)
5. Scroll progress bar (2px lime, top)
6. **01 Hero** — pills, kicker, h1 (solid "Frontend" + outline "Engineer" + lime period), scramble rotator line, lede, CTA row (Explore / Download CV / Email), link chips, product-window canvas (role demo) + 3 float chips + pointer glow
7. **Marquee** — duplicated tech set, edge masks
8. **02 Numbers** — divided 6-cell metric strip (counters)
9. **03 Expertise** — bento 7 tiles (spans 8/4 · 4/4/4 · 6/6), icons, evidence chips, feature tile with role mini-grid
10. **03·B Wiring schematic** — 10 nodes / 3 bands (3·4·3), bus chips + flow dots, sticky master–detail panel
11. **04 Exhibit (RoleLens)** — 4 role tabs, capability matrix (✓/◐/—), mock admin window (10-module sidebar nav, url/scope/title/note bar, approve control, masked contacts), audit console, illustrative note
12. **05 Experience** — sticky left rail facts + timeline (scroll-fill lime rail), 3 roles, diamond bullets, context chips (type + region only), tech tags, current-role pulse badge
13. **06 Principles** — 4 cards, outline numerals, evidence arrows
14. **07 Stack** — 6 group cards, primary "chip-key" highlights
15. **08 Background** — 2 education cards + trajectory note
16. **09 Contact** — line-mask h2, highlighter-hover giant mailto, CTA row, availability strip, contact rows with copy buttons + hover hint
17. Footer — brand col, 2-col section index (02–09), socials, back-to-top, colophon ("Typeset in Bricolage Grotesque, Inter & JetBrains Mono"), dynamic year
18. Command palette (⌘K overlay), Toast host, Noise overlay (CSS data-URI)

## B. Interactions & exact parameters

| # | Interaction | Parameters |
|---|---|---|
| 1 | Preloader | count 000→100 in 780 ms, then curtain wipe; `sessionStorage` once-per-session (try/catch); skipped under reduced motion; body scroll-lock while visible |
| 2 | Header stuck state | after 10px scroll: blur + bottom border + height 72→64 (≤760: 64 base) |
| 3 | Scrollspy | rAF-throttled; drives nav active underline + dot-rail active ring |
| 4 | Mobile menu | clip-path circle from burger coords; links staggered via `--i`; Esc + link-click close; focus returns to burger; body lock; `aria-expanded/hidden`; breakpoint ≤1080 |
| 5 | Theme toggle | dark default; light "paper" (`#F5F4ED` bg, olive accent-text `#546E0B`); persists in **cookie `pg-theme`** (deviation #1); toasts "Dark theme · engineering hours" / "Light theme · paper mode" |
| 6 | Hero rotator | 5 words, scramble-decode, cycle 3.6 s; pauses on `document.hidden`; reduced-motion → static first word |
| 7 | Hero canvas | role cycle **2.9 s** super→admin→company→partner (IO pause off-screen); scanline 6 s; float chips floaty 7.5 s; pointer parallax depths 14/24/34/42; canvas tilt `--rx/--ry`; outline h1 word fills on hero hover (CSS) |
| 8 | Marquee | duplicated set, 42 s linear infinite; pause on hover; edge fade masks |
| 9 | Counters | start at IO 50%, once; **1.5 s easeOutQuart**; formats: `3.5+` (1 decimal), `7`, `5,000+` (grouped), `~30%`, `4`, `8` |
| 10 | Reveal system | single shared IO (threshold .12, rootMargin −6%); `.8s var(--ease-atelier)`; stagger via `--d`; line-mask headings `1.0s var(--ease-out-expo)` (`.lines .ln>span`) |
| 11 | Card glow + magnetism | delegated `pointermove` → radial glow vars `--mx/--my` on cards; magnetic buttons ±6 px translate, `pointer:fine` only |
| 12 | Wiring diagram | click + ←/→ select; auto-cycle **4.6 s** (IO pause off-screen); **permanent handover** on first user interaction — hint swaps to "Manual mode — ← → keys also move between nodes"; `aria-pressed` node buttons; bands 3/4/3; bus flow dots; reduced-motion static |
| 13 | RoleLens (Exhibit) | 4 roles; nav visibility arrays (10 items): super all; admin `[1,1,1,1,1,1,0,1,0,0]`; company `[1,1,1,1,1,0,0,0,0,0]` + masked contacts + "write own"; partner `[1,1,0,0,0,0,0,0,0,0]` read-only; caps: admin {users 2, pricing 1, approve 2, contacts 2, write 2}; audit console lines append **150 ms stagger, max 7**; approve control disabled per role |
| 14 | Timeline fill | lime rail fill = f(scroll through section), rAF-throttled |
| 15 | Copy contact | clipboard API → hidden-textarea fallback → toast (with literal value if both fail); hover shows copy hint; focus-visible parity |
| 16 | Command palette | ⌘K / Ctrl+K / click / hover-intent; **lazy-loaded chunk** (deviation #2); commands: 9 section jumps + CV + copy email + theme + GitHub + LinkedIn + mailto; filter, ↑↓↵Esc, backdrop close, `cmdIn .38s`, focus restore |
| 17 | Back-to-top | smooth scroll (auto under reduced motion) |
| 18 | Dot rail | hover labels; active ring; hidden <1280 |
| 19 | Scroll progress | width = scrolled / scrollable, passive listener + rAF |
| 20 | Toasts | single host; show/hide animation; `aria-live` only here |

Keyframes inventory: `pulse, mq, scan, floaty, busflow, ldPop, wpIn, audIn, cmdIn`. Easings: `--ease-atelier: cubic-bezier(.22,.72,.2,1)`, `--ease-out-expo`.

## C. Approved deviations (plan rev 1.1)

1. **Theme persistence via cookie** `pg-theme` read in `layout.tsx` at SSR (prototype uses localStorage) → eliminates FOUC. Cookie: 1y, `SameSite=Lax`, `Path=/`, JS-readable.
2. **Command palette lazy chunk** via `next/dynamic` (prototype has it inline) → keeps it out of initial JS budget.

## D. Content guardrails

- Zero client/project names anywhere rendered (see `cv-source.md` mappings).
- All facts CV-backed; metrics list frozen in `cv-source.md`.
- Email `princegupta98299@gmail.com`, phone `+91 99828 44166` rendered in plain text (old prototype's Cloudflare obfuscation is NOT carried over).
