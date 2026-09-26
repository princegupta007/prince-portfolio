/**
 * Phase 07 · screen-reader spot audit + semantic assertions.
 * Dumps accessible names/roles for header controls, exhibit tabs, wiring
 * nodes and contact rows; asserts heading order, landmark uniqueness,
 * table/list semantics and that no icon-only control is unnamed.
 * Runnable: `pnpm exec tsx agent/tools/sr-dump.ts` → writes sr-dump.md.
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.BASE_URL ?? "http://127.0.0.1:3100";
const OUT = path.join(
  "agent/artifacts",
  `${new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Kolkata" })}-phase-07`,
  "sr-dump.md",
);

let fails = 0;
const log: string[] = [];
function check(name: string, ok: boolean, detail = "") {
  if (!ok) fails++;
  log.push(`${ok ? "✓" : "✗"} ${name}${detail ? " — " + detail : ""}`);
}

export async function main() {
  const browser = await chromium.launch();
  const pg = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await pg.goto(BASE, { waitUntil: "networkidle" });
  await pg.waitForTimeout(2200);

  const pick = (sel: string) =>
    pg.$$eval(sel, (els) =>
      els.map((e) => {
        const lbl =
          e.getAttribute("aria-label") ||
          e.textContent?.trim().replace(/\s+/g, " ").slice(0, 40) ||
          "(unnamed)";
        const tagRole =
          e.tagName === "A"
            ? "link"
            : e.tagName === "BUTTON"
              ? "button"
              : e.tagName === "TABLE"
                ? "table"
                : e.tagName === "NAV"
                  ? "navigation"
                  : e.tagName.toLowerCase();
        return `${e.getAttribute("role") || tagRole} · "${lbl}"`;
      }),
    );

  const dump = {
    header: await pick("header button, header a"),
    tabs: await pick(".role-tab"),
    wiring: await pick(".w-node"),
    contact: await pick(".crow"),
    heads: await pg.$$eval("h1,h2,h3,h4,h5,h6", (els) =>
      els.map((h) => Number(h.tagName[1])),
    ),
    landmarks: await pg.$$eval("header,nav,main,footer,aside", (els) =>
      els.map((e) => `${e.tagName.toLowerCase()}:${e.getAttribute("aria-label") ?? ""}`),
    ),
    tables: await pg.$$eval("table", (els) =>
      els.map((t) => ({
        label: t.getAttribute("aria-label"),
        caption: !!t.querySelector("caption"),
      })),
    ),
    badLists: await pg.$$eval("ul,ol,[role=list]", (els) =>
      els.filter((l) =>
        [...l.children].some(
          (c) =>
            !["LI", "SCRIPT", "TEMPLATE"].includes(c.tagName) &&
            c.getAttribute("role") !== "listitem" &&
            c.getAttribute("role") !== "none",
        ),
      ).length,
    ),
    unnamed: await pg.$$eval("button, a", (els) =>
      els
        .filter((e) => {
          const n = e.getAttribute("aria-label") || e.textContent?.trim().slice(0, 40) || "";
          return (e as HTMLElement).getBoundingClientRect().height > 0 && n === "";
        })
        .map((e) => e.className.toString().slice(0, 30)),
    ),
  };

  // heading order: never skip a level going down
  let orderOk = true;
  for (let i = 1; i < dump.heads.length; i++) {
    if (dump.heads[i]! > dump.heads[i - 1]! + 1) orderOk = false;
  }
  check("heading order h1→h2→h3 no skips", orderOk && dump.heads[0] === 1, dump.heads.join(","));
  check("h1 exactly once", dump.heads.filter((h) => h === 1).length === 1);

  // landmarks unique per type+label
  const seen = new Set<string>();
  let landOk = true;
  for (const l of dump.landmarks) {
    if (seen.has(l)) landOk = false;
    seen.add(l);
  }
  check("landmarks unique (type+label)", landOk, dump.landmarks.join(" | "));

  check("tables labelled or captioned", dump.tables.every((t) => t.label || t.caption), JSON.stringify(dump.tables));
  check("list containers hold only list items", dump.badLists === 0, `${dump.badLists} bad`);
  check("no unnamed visible buttons/links", dump.unnamed.length === 0, dump.unnamed.join(","));

  log.push("", "## SR name dump", "", "### header", ...dump.header.map((s) => "- " + s),
    "", "### exhibit role tabs", ...dump.tabs.map((s) => "- " + s),
    "", "### wiring nodes", ...dump.wiring.map((s) => "- " + s),
    "", "### contact rows", ...dump.contact.map((s) => "- " + s));

  await browser.close();
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, `# Phase-07 SR / semantic audit\n\n${log.join("\n")}\n`);
  console.log(log.join("\n"));
  console.log(`\n[sr-dump] ${fails} failure(s) → ${OUT}`);
  process.exit(fails ? 1 : 0);
}

if (process.argv[1]?.endsWith("sr-dump.ts")) main();
