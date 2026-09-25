import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Agent ephemeral dirs (gitignored anyway):
    "agent/artifacts/**",
    "agent/scratch/**",
  ]),
  // ISOLATION GUARANTEE (plan §2.13, agent/rules/00-project.md):
  // application code must never import from agent/.
  {
    files: [
      "app/**/*.{ts,tsx}",
      "components/**/*.{ts,tsx}",
      "content/**/*.ts",
      "hooks/**/*.{ts,tsx}",
      "lib/**/*.ts",
      "tests/**/*.{ts,tsx}",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "agent",
                "agent/*",
                "agent/**",
                "**/agent/**",
                "@/agent*",
                "@/../agent*",
                "../agent*",
                "../../agent*",
              ],
              message:
                "Application code must not import from agent/ — see agent/rules/00-project.md (isolation guarantees).",
            },
          ],
        },
      ],
    },
  },
  // agent/tools/* are Node-run TSX scripts (pnpm agent:*), not browser code.
  {
    files: ["agent/tools/**/*.ts"],
    languageOptions: {
      globals: {
        process: "readonly",
        console: "readonly",
        Buffer: "readonly",
        URL: "readonly",
        fetch: "readonly",
        __dirname: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setImmediate: "readonly",
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-require-imports": "off",
    },
  },
]);

export default eslintConfig;
