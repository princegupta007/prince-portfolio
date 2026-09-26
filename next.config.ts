import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,/* config options here */
  // Phase 09+10 (D39): cache + security headers live here (single source,
  // locally testable) instead of vercel.json-only.
  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/cv/:file.pdf",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
      {
        source: "/(og.png|favicon.svg)",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, immutable" }],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Content-Security-Policy",
            // D39 + fix(console-hydration): production CSP stays strict —
            // React never eval()s in production. The dev runtime legitimately
            // needs unsafe-eval (component-stack reconstruction), so the dev
            // CSP widens script-src only; shipping the strict policy to dev
            // made React log "eval() is not supported" on every load.
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline'" +
              (process.env.NODE_ENV === "production" ? "" : " 'unsafe-eval'") +
              "; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
