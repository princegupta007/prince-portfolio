/**
 * agent/tools/content-scan.ts — CI-ready content-policy scanner.
 *
 * Same policy as tests/content-policy.test.ts, runnable standalone:
 *   pnpm agent:content-scan        (tsx agent/tools/content-scan.ts)
 *
 * Scope: content/, app/, components/, lib/ — EXCLUDES agent/context/
 * (research material where real names legitimately live). Also asserts
 * nothing in shipped source imports agent-context files.
 *
 * Exit 0 = clean, exit 1 = violations (prints file:line for each).
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

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
const ROOT = process.cwd();

function* walk(dir: string): Generator<string> {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry.startsWith(".")) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) yield* walk(full);
    else if (SCAN_EXT.has(entry.slice(entry.lastIndexOf(".")))) yield full;
  }
}

let violations = 0;
let scanned = 0;

for (const d of SCAN_DIRS) {
  const abs = join(ROOT, d);
  if (!statSync(abs).isDirectory()) continue;
  for (const file of walk(abs)) {
    scanned++;
    const rel = relative(ROOT, file);
    const lines = readFileSync(file, "utf8").split("\n");
    lines.forEach((line, i) => {
      const lower = line.toLowerCase();
      for (const name of FORBIDDEN) {
        if (lower.includes(name)) {
          console.error(`✖ forbidden name "${name}" — ${rel}:${i + 1}`);
          violations++;
        }
      }
      if (
        /agent\/context|cv-source/.test(line) &&
        !/^\s*(\/\/|\*|\/\*)/.test(line)
      ) {
        console.error(`✖ agent-context reference — ${rel}:${i + 1}`);
        violations++;
      }
    });
  }
}

if (violations > 0) {
  console.error(
    `\ncontent-scan: ${violations} violation(s) in ${scanned} files.`,
  );
  process.exit(1);
}
console.log(`content-scan: clean — ${scanned} files, 0 violations.`);
