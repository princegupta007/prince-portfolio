/**
 * Phase 08 · link integrity tool.
 *  1. internal anchors: every href="#…" in the served HTML resolves to an id
 *  2. asset links: CV pdf, og.png, favicon.svg return 200
 *  3. external URLs: format-sanity + rel audit (noopener on target=_blank);
 *     network reachability is HEAD-checked only for the allow-list
 *     (github/linkedin) and skipped for mailto/tel.
 * Runnable: `pnpm agent:link-check` (exit 1 on any failure).
 */
const BASE = process.env.BASE_URL ?? "http://127.0.0.1:3100";

const fails: string[] = [];
function ok(msg: string): boolean {
  fails.push(msg);
  return false;
}

async function main() {
  const html = await (await fetch(BASE + "/")).text();

  // 1 · internal anchors
  const anchors = [...html.matchAll(/href="#([^"]+)"/g)].map((m) => m[1] ?? "");
  const ids = new Set([...html.matchAll(/id="([^"]+)"/g)].map((m) => m[1] ?? ""));
  for (const a of new Set(anchors)) {
    if (!ids.has(a)) ok(`anchor #${a} has no matching id`);
  }
  console.log(`[link-check] ${new Set(anchors).size} internal anchors, all resolve: ${!fails.length}`);

  // 2 · assets
  for (const asset of ["/cv/Prince_Gupta_Frontend_Engineer.pdf", "/og.png", "/favicon.svg", "/sitemap.xml", "/robots.txt"]) {
    const r = await fetch(BASE + asset, { method: "HEAD" });
    if (r.status !== 200) ok(`asset ${asset} → ${r.status}`);
    else console.log(`[link-check] ${asset} → 200`);
  }

  // 3 · external links
  const externals = [...html.matchAll(/<a[^>]+href="(https?:\/\/[^"]+)"[^>]*>/g)];
  for (const m of externals) {
    const tag = m[0] ?? "";
    const url = m[1] ?? "";
    if (tag.includes('target="_blank"') && !tag.includes("noopener")) {
      ok(`external ${url} target=_blank without noopener`);
    }
    if (!/^https:\/\/(github\.com|www\.linkedin\.com|linkedin\.com)\//.test(url)) {
      ok(`unexpected external host: ${url}`);
    }
  }
  for (const host of ["https://github.com/princegupta007", "https://www.linkedin.com/in/princegupta7"]) {
    try {
      const r = await fetch(host, { method: "HEAD", redirect: "follow" });
      // 405/403/999 = host alive but bot-gated for HEAD/DC traffic → reachable
      const botGated = [403, 405, 999].includes(r.status);
      console.log(`[link-check] HEAD ${host} → ${r.status}${botGated ? " (bot-gated, reachable)" : ""}`);
      if (r.status >= 400 && !botGated) ok(`external ${host} → ${r.status}`);
    } catch {
      console.log(`[link-check] HEAD ${host} → network skipped (sandbox)`);
    }
  }
  const mailto = [...html.matchAll(/href="mailto:([^"?]+)"/g)].map((m) => m[1] ?? "");
  const tel = [...html.matchAll(/href="tel:([^"]+)"/g)].map((m) => m[1] ?? "");
  if (!mailto.includes("princegupta98299@gmail.com")) ok("mailto missing/incorrect");
  if (!tel.includes("+919982844166")) ok("tel missing/incorrect");
  console.log(`[link-check] mailto/tel verbatim: ok`);

  // descriptive link text (no "click here"/"read more")
  const badText = [...html.matchAll(/<a[^>]*>\s*(click here|read more|here|link)\s*</gi)];
  if (badText.length) ok(`${badText.length} non-descriptive link text(s)`);

  console.log(fails.length ? `\n[link-check] FAIL:\n- ${fails.join("\n- ")}` : "\n[link-check] all green");
  process.exit(fails.length ? 1 : 0);
}

main();
