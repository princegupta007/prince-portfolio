import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Content policy (agent/rules/10-content-policy.md):
 *   1. Client/project names must NEVER appear in shipped source
 *      (content/, app/, components/, lib/) — UI, JS, meta or aria.
 *      Products are communicated by TYPE + REGION + FACT only.
 *   2. Nothing in shipped source may import the agent context folder
 *      (agent/context/cv-source.md is research material, not a runtime dep).
 * Employer names (Konstant Infosolutions, SSTPL) are allowed — they appear
 * on the CV itself.
 */

const FORBIDDEN = [
  "match creatorz",
  "fivra",
  "einfrasouq",
  "aqar360",
  "tpge",
  "hakuba",
  "listeners connect",
];

const SCAN_DIRS = ["content", "app", "components", "lib"];
const SCAN_EXT = new Set([".ts", ".tsx", ".css", ".js", ".mjs", ".json"]);

const ROOT = join(__dirname, "..");

function* walk(dir: string): Generator<string> {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry.startsWith(".")) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) yield* walk(full);
    else if (SCAN_EXT.has(entry.slice(entry.lastIndexOf(".")))) yield full;
  }
}

function scannedFiles(): string[] {
  const files: string[] = [];
  for (const d of SCAN_DIRS) {
    const abs = join(ROOT, d);
    if (statSync(abs).isDirectory()) files.push(...walk(abs));
  }
  return files;
}

describe("content policy", () => {
  const files = scannedFiles();

  it("scans a meaningful set of files", () => {
    expect(files.length).toBeGreaterThan(20);
  });

  it.each(FORBIDDEN)(
    "forbidden project name %j appears nowhere in shipped source",
    (name) => {
      const hits: string[] = [];
      for (const file of files) {
        const text = readFileSync(file, "utf8").toLowerCase();
        if (text.includes(name)) hits.push(relative(ROOT, file));
      }
      expect(hits, `found "${name}" in: ${hits.join(", ")}`).toEqual([]);
    },
  );

  it("no shipped source imports agent context material", () => {
    const hits: string[] = [];
    for (const file of files) {
      const text = readFileSync(file, "utf8");
      if (
        /(?:from|import)\s*\(?\s*["'][^"']*(?:agent\/context|cv-source)/.test(
          text,
        )
      ) {
        hits.push(relative(ROOT, file));
      }
    }
    expect(hits, `agent-context imports in: ${hits.join(", ")}`).toEqual([]);
  });
});
