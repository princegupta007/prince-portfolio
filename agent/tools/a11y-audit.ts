/**
 * Phase 7 (moved in-repo phase 11) — axe-core audit.
 * 5 key routes/states × 2 themes; zero violations of impact serious/critical
 * is the gate (minor/moderate reported, not gating).
 * Run: pnpm exec tsx agent/tools/a11y-audit.ts   (server on :3100)
 */
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const BASE = process.env.BASE_URL ?? "http://127.0.0.1:3100";
const TARGETS: [string, string][] = [
  ["/", "home"],
  ["/#exhibit", "exhibit"],
  ["/#experience", "experience"],
  ["/#stack", "stack"],
  ["/#contact", "contact"],
];

async function main() {
  const browser = await chromium.launch();
  let serious = 0;
  let minor = 0;
  for (const theme of ["dark", "light"]) {
    for (const [path, name] of TARGETS) {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await ctx.newPage();
      await page.addInitScript((t) => { document.cookie = `pg-theme=${t}; path=/`; }, theme);
      await page.goto(BASE + path, { waitUntil: "load" });
      await page.waitForTimeout(2200);
      const res = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      const sc = res.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
      const mc = res.violations.length - sc.length;
      serious += sc.length;
      minor += mc;
      console.log(`${theme}/${name}: ${sc.length} serious, ${mc} minor`);
      sc.forEach((v) => console.log("   !", v.id, v.impact, v.nodes.length));
      await ctx.close();
    }
  }
  await browser.close();
  console.log(`\nAXE: ${serious} serious/critical, ${minor} minor across 10 states`);
  if (serious > 0) process.exit(1);
}
void main();
