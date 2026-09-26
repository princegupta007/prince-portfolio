/**
 * Phase 6 visual grid — 11 viewports × 2 themes.
 *
 * Captures full-page + per-section clips into
 * agent/artifacts/<date>-phase-06/grid/ AND asserts the overflow spec:
 * `document.documentElement.scrollWidth === innerWidth` plus every fixed
 * layer (header, rail, menu, toast host, loader) staying inside the
 * viewport — at every viewport × theme.
 *
 * Run: pnpm agent:screenshot-grid [--quick] [baseUrl]
 *   --quick → subset [320, 390, 768, 1080, 1440] for fast iteration
 * Exit code 1 if any overflow assertion fails.
 */
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const BASE = process.argv.find((a) => a.startsWith("http")) ?? "http://127.0.0.1:3100";
const QUICK = process.argv.includes("--quick");
const DATE = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Kolkata" });
const OUT = join(process.cwd(), "agent", "artifacts", `${DATE}-phase-06`, "grid");

const VIEWPORTS = QUICK ? [320, 390, 768, 1080, 1440] : [320, 360, 390, 414, 640, 768, 834, 1024, 1280, 1440, 1920];
const THEMES = ["dark", "light"] as const;
const SECTIONS = ["hero", "numbers", "expertise", "wiring", "exhibit", "experience", "principles", "stack", "background", "contact"];
const FIXED_LAYERS = [".hdr", ".rail", ".menu", ".toast-host", "#loader", "#progress"];

type Finding = { viewport: number; theme: string; kind: string; detail: string };

async function main() {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const findings: Finding[] = [];
  const summary: string[] = [];

  for (const theme of THEMES) {
    for (const width of VIEWPORTS) {
      const ctx = await browser.newContext({
        viewport: { width, height: 900 },
        deviceScaleFactor: 1,
        hasTouch: width < 1080,
        isMobile: width < 760,
      });
      await ctx.addCookies([
        { name: "pg-theme", value: theme, url: BASE },
      ]);
      const page = await ctx.newPage();
      await page.goto(BASE + "/", { waitUntil: "networkidle" });
      // let preloader/reveals settle without scrolling side-effects
      await page.waitForTimeout(1600);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(300);

      // ── overflow spec (document + fixed layers) ──
      const m = await page.evaluate((layers) => {
        const doc = document.documentElement;
        const over = doc.scrollWidth - window.innerWidth;
        const fixed: string[] = [];
        for (const sel of layers) {
          const el = document.querySelector(sel) as HTMLElement | null;
          if (!el) continue;
          const cs = getComputedStyle(el);
          if (cs.display === "none" || cs.visibility === "hidden") continue;
          const r = el.getBoundingClientRect();
          if (r.right > window.innerWidth + 1 || r.left < -1) {
            fixed.push(`${sel} L${Math.round(r.left)} R${Math.round(r.right)}`);
          }
        }
        // clipped content: elements wider than the viewport that are NOT in
        // an approved horizontal scroller / marquee (overflow:hidden parents
        // hide these from scrollWidth — the Phase-6 P0 blind spot)
        const clipped: string[] = [];
        document.querySelectorAll("body *").forEach((el) => {
          const r = (el as HTMLElement).getBoundingClientRect();
          if (r.right <= window.innerWidth + 1) return;
          if (el.closest(".mq, .role-tabs, .mock-side, .cmd-list")) return;
          const cs = getComputedStyle(el as HTMLElement);
          if (cs.position === "fixed") return;
          clipped.push(`${(el as HTMLElement).className?.toString().slice(0, 30) || el.tagName}=${Math.round(r.width)}`);
        });
        // widest offending element (helps diagnose)
        let worst: { sel: string; w: number } | null = null;
        if (over > 0) {
          document.querySelectorAll("body *").forEach((el) => {
            const r = (el as HTMLElement).getBoundingClientRect();
            if (r.right > window.innerWidth + 1 && (!worst || r.width > worst.w)) {
              worst = { sel: (el as HTMLElement).className?.toString().slice(0, 40) || el.tagName, w: r.width };
            }
          });
        }
        return { over, fixed, worst, clipped };
      }, FIXED_LAYERS);

      if (m.over > 0) {
        findings.push({ viewport: width, theme, kind: "h-overflow", detail: `scrollWidth +${m.over}px worst=${JSON.stringify(m.worst)}` });
      }
      if (m.fixed.length) {
        findings.push({ viewport: width, theme, kind: "fixed-layer-out", detail: m.fixed.join(" | ") });
      }
      if (m.clipped.length) {
        findings.push({ viewport: width, theme, kind: "clipped", detail: m.clipped.slice(0, 6).join(" | ") });
      }

      // ── captures ──
      const tag = `${theme}-${width}`;
      await page.screenshot({ path: join(OUT, `${tag}-full.png`), fullPage: true });
      for (const id of SECTIONS) {
        const el = page.locator(`#${id}`);
        if ((await el.count()) === 0) continue;
        try {
          await el.screenshot({ path: join(OUT, `${tag}-${id}.png`) });
        } catch {
          /* section taller than limit — full page already covers it */
        }
      }
      summary.push(`${tag}: over=${m.over} fixed=${m.fixed.length} clipped=${m.clipped.length}`);
      await ctx.close();
    }
  }

  await browser.close();
  writeFileSync(join(OUT, "overflow.json"), JSON.stringify({ findings, summary }, null, 2));
  console.log(summary.join("\n"));
  console.log(`\n[screenshot-grid] ${findings.length} overflow finding(s); artifacts → ${OUT}`);
  for (const f of findings) console.log(`  ✗ ${f.theme} @${f.viewport} ${f.kind}: ${f.detail}`);
  process.exit(findings.length ? 1 : 0);
}

main();
