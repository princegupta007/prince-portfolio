import type { StackGroup } from "./types";

/**
 * 07 · The toolbox — six group cards. `keys` render as chip-key primaries
 * (prototype highlights), `items` as plain chips. Everything here is a
 * shipped tool from the CV Technical Skills block — "shipped, not studied".
 */

export const STACK_HEAD = {
  idx: "07",
  title: "The toolbox",
  meta: "Everything below is shipped, not studied",
} as const;

// CV: Technical Skills — languages, frontend, backend, testing, tools, AI workflow
export const STACK_GROUPS: StackGroup[] = [
  {
    title: "Languages",
    keys: ["TypeScript", "JavaScript (ES6+)"],
    items: [],
  },
  {
    title: "Frontend",
    keys: ["React.js", "Next.js — App Router · SSR"],
    items: [
      "Zustand",
      "TanStack Query",
      "Material-UI",
      "Tailwind CSS",
      "HTML5",
      "CSS3",
      "Responsive design",
      "Code-splitting & lazy loading",
    ],
  },
  {
    title: "Backend",
    keys: ["Node.js", "NestJS", "PostgreSQL · Prisma"],
    items: [
      "Express.js",
      "REST APIs",
      "JWT authentication",
      "RBAC",
      "WebSockets",
    ],
  },
  {
    title: "Testing",
    keys: ["Jest", "React Testing Library"],
    items: [],
  },
  {
    title: "Tools & delivery",
    keys: [],
    items: [
      "Git",
      "GitHub",
      "Vercel",
      "Turborepo — monorepo",
      "CI/CD",
      "Bundle optimisation",
    ],
  },
  {
    title: "AI workflow",
    keys: [],
    items: ["AI-assisted development", "Claude Code", "Cursor"],
  },
];
