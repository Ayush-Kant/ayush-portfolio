export const JAVASCRIPT_SKILL = {
  id: "javascript",
  name: "JavaScript",
  logo: "JS",
  color: "#F7DF1E",
  detail: {
    eyebrow: "Where I use it",
    title: "JavaScript is one of my everyday tools.",
    summary:
      "I use it across interactive frontends, API-driven web apps and backend services.",
    highlights: [
      "React interfaces and browser interactions",
      "Node.js and Express API development",
      "Next.js applications and full-stack features",
    ],
  },
} as const;

export const TYPESCRIPT_SKILL = {
  id: "typescript",
  name: "TypeScript",
  logo: "TS",
  color: "#3178C6",
  detail: {
    eyebrow: "Why I use it",
    title: "TypeScript keeps larger codebases predictable.",
    summary:
      "I use TypeScript for typed React, Next.js and backend code where explicit contracts make changes safer.",
    highlights: [
      "Typed React and Next.js components",
      "Safer API and service contracts",
      "Refactoring with compiler feedback",
    ],
  },
} as const;

export type SkillBoxKind =
  | "javascript"
  | "typescript";
