/** Phase 11 — SEO/assertion suite (served HTML only, no browser needed for most). */
const BASE = process.env.BASE_URL ?? "http://127.0.0.1:3100";
let pass = 0, fail = 0;
const bad: string[] = [];
function check(name: string, ok: boolean, detail = "") {
  if (ok) { pass++; console.log("  ✓", name); } else { fail++; bad.push(name); console.log("  ✗", name, detail); }
}
async function main() {
  const html = await (await fetch(BASE + "/")).text();
  check("title present", /<title>[^<]+Frontend Engineer[^<]*<\/title>/.test(html));
  check("meta description", /name="description"/.test(html));
  check("canonical", /rel="canonical"/.test(html));
  check("og:title+og:image", /property="og:title"/.test(html) && /property="og:image"/.test(html));
  check("twitter card", /name="twitter:card"/.test(html));
  check("JSON-LD Person", /application\/ld\+json/.test(html) && /"@type":"Person"/.test(html));
  check("theme-color meta", /name="theme-color"/.test(html));
  check("no banned project names", !/Match Creatorz|Fivra|EinfraSouq|Aqar360|TPGE|Hakuba|Listeners Connect/i.test(html));

  const robots = await (await fetch(BASE + "/robots.txt")).text();
  check("robots allows all + sitemap", /allow: \//i.test(robots) && /sitemap:/i.test(robots));
  const sitemap = await (await fetch(BASE + "/sitemap.xml")).text();
  check("sitemap lists /", /<loc>.*<\/loc>/.test(sitemap));
  const nf = await fetch(BASE + "/nope");
  check("404 status code", nf.status === 404);

  console.log(`\nSEO SUITE: ${pass}/${pass + fail}`);
  if (fail) { console.log("failed:", bad.join(", ")); process.exit(1); }
}
void main();
