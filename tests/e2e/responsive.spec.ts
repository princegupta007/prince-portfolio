/** Phase 11 — responsive overflow suite: 11 viewports × 2 themes, no horizontal scroll. */
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://127.0.0.1:3100";
const VPS: [number, number][] = [[320,568],[360,740],[390,844],[430,932],[600,900],[768,1024],[834,1112],[1024,768],[1280,800],[1440,900],[1920,1080]];
let pass = 0, fail = 0; const bad: string[] = [];
function check(name: string, ok: boolean, detail = "") {
  if (ok) { pass++; console.log("  ✓", name); } else { fail++; bad.push(name); console.log("  ✗", name, detail); }
}
async function main() {
  const browser = await chromium.launch();
  for (const theme of ["dark", "light"]) {
    for (const [w, h] of VPS) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: theme === "dark" ? "dark" : "light" });
      const page = await ctx.newPage();
      await page.addInitScript((t) => { document.cookie = `pg-theme=${t}; path=/`; }, theme);
      await page.goto(BASE + "/", { waitUntil: "load" });
      await page.waitForTimeout(1600);
      const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      check(`${theme} ${w}×${h} no h-overflow`, over <= 0, `+${over}px`);
      await ctx.close();
    }
  }
  await browser.close();
  console.log(`\nRESPONSIVE SUITE: ${pass}/${pass + fail}`);
  if (fail) { console.log("failed:", bad.join(", ")); process.exit(1); }
}
void main();
