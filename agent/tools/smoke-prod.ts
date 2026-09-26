export {};

/**
 * Phase 10 · production smoke: statuses, styled 404, security+cache headers.
 * Runnable: `pnpm agent:smoke` against a running `next start`.
 */
const BASE = process.env.BASE_URL ?? "http://127.0.0.1:3100";
const fails: string[] = [];
function check(name: string, ok: boolean, detail = "") {
  console.log(`  ${ok ? "✓" : "✗"} ${name}${detail ? " — " + detail : ""}`);
  if (!ok) fails.push(name);
}
async function main() {
  const routes: [string, number][] = [
    ["/", 200],
    ["/sitemap.xml", 200],
    ["/robots.txt", 200],
    ["/cv/Prince_Gupta_Frontend_Engineer.pdf", 200],
    ["/og.png", 200],
    ["/favicon.svg", 200],
    ["/definitely-not-a-route", 404],
  ];
  for (const [r, want] of routes) {
    const res = await fetch(BASE + r);
    check(`GET ${r} → ${want}`, res.status === want, `got ${res.status}`);
  }
  const nf = await (await fetch(BASE + "/definitely-not-a-route")).text();
  check("404 page styled (nf-title present)", nf.includes("nf-title"));
  check("404 keeps nav index", nf.includes("Section index"));

  const home = await fetch(BASE + "/");
  // cache headers are vercel.json-driven; locally assert absence of powered-by
  check("no x-powered-by", !home.headers.has("x-powered-by"));
  const staticRes = await fetch(BASE + "/favicon.svg");
  check("favicon served", staticRes.status === 200);

  console.log(fails.length ? `\n[smoke] FAIL: ${fails.join(", ")}` : "\n[smoke] all green");
  process.exit(fails.length ? 1 : 0);
}
main();
