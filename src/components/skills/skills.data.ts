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

export const NODEJS_SKILL = {
  id: "nodejs",
  name: "Node.js",
  logo: "Node.js",
  color: "#339933",
  detail: {
    eyebrow: "Where I build with it",
    title: "Node.js is my backend runtime for web applications.",
    summary:
      "I use Node.js for APIs, backend services and full-stack features that connect the frontend to real application logic.",
    highlights: [
      "Express APIs and backend services",
      "Authentication and data-layer integration",
      "Full-stack JavaScript applications",
    ],
  },
} as const;

export const EXPRESS_SKILL = {
  id: "express",
  name: "Express",
  logo: "express",
  color: "#2D2D2D",
  detail: {
    eyebrow: "Where I use it",
    title: "Express keeps my Node.js APIs focused and lightweight.",
    summary:
      "I use Express for REST APIs, middleware, routing and backend services that sit behind my web applications.",
    highlights: [
      "REST API routing and controllers",
      "Middleware and authentication flows",
      "Service integration with Node.js",
    ],
  },
} as const;

export type SkillBoxKind =
  | "javascript"
  | "typescript"
  | "nodejs"
  | "express";