# Cost Report — Vercel Free (Hobby) Tier

## Monthly included limits vs expected usage
| Resource            | Free limit      | Expected usage             | Headroom |
|---------------------|-----------------|----------------------------|----------|
| Bandwidth           | 100 GB          | < 1 GB (≈200 KB/visit × 5k)| ~99%     |
| Build minutes       | 6,000 (100 h?)  | ~10 min (5–8 deploys/mo)   | ~99%     |
| Serverless invokes  | 100 GB-hr       | 0 (no functions)           | 100%     |
| Edge requests       | 1 M             | = page visits              | ~99%     |
| Domains / SSL       | included        | 1 domain + auto SSL        | —        |

(Hobby build minutes are 6,000/mo; a Turbopack build of this repo ≈ 60–120 s.)

## Why nothing paid is required
- No database, auth, analytics, email API, or CDN add-on — the site is a
  pre-rendered static page with client islands; Vercel Edge serves it as-is.
- Fonts self-hosted via next/font (no font-service requests or licences).
- Images: none raster — all visuals are CSS/SVG/canvas (zero asset bandwidth).
- CV is a committed PDF served from /public with swr caching.
- Headers/CSP live in next.config.ts — no paid firewall/WAF needed for a
  portfolio with no input surface (no forms posting anywhere).

## Cost triggers to watch (alerts, not actions)
- Bandwidth spike → hotlinking of /cv PDF; mitigate with cache headers (done).
- Build-minute spike → CI + Vercel double builds; Vercel skips unchanged
  previews automatically; keep CI on GitHub Actions free tier (2,000 min/mo).

## Total expected monthly cost: $0.
