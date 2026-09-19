"use client";

export type Project = {
  id: string;
  number: string;
  kind: string;
  title: string;
  description: string;
  stack: readonly string[];
  href: string;
  featured?: boolean;
};

export const PROJECTS: readonly Project[] = [
  {
    id: "pr-review-agent",
    number: "01",
    kind: "AI · Developer Infrastructure",
    title: "PR Review Agent",
    description:
      "A production-oriented GitHub pull-request review system built around event-driven intake, specialist review agents, durable orchestration, retrieval and human-in-the-loop control.",
    stack: [
      "Python",
      "FastAPI",
      "Redis / ARQ",
      "LangGraph",
      "GitHub",
    ],
    href: "https://github.com/Ayush-Kant/PR-Review-Agent",
    featured: true,
  },
  {
    id: "smart-pr-review-bot",
    number: "02",
    kind: "AI · Multi-agent Systems",
    title: "Smart PR Review Bot",
    description:
      "An autonomous multi-agent PR review system that indexes a codebase, reviews changes, hunts for bugs, raises GitHub issues and can draft fixes through an agent workflow.",
    stack: [
      "Python",
      "LangGraph",
      "FastAPI",
      "React",
      "ChromaDB",
      "GitHub MCP",
    ],
    href: "https://github.com/Ayush-Kant/Multiagent-PR-Review-System",
  },
  {
    id: "omnizon",
    number: "03",
    kind: "Full-stack · Ecommerce",
    title: "Omnizon",
    description:
      "A full-stack multi-vendor ecommerce application exploring product, vendor and customer flows with a modern Next.js stack and MongoDB-backed data layer.",
    stack: [
      "Next.js",
      "TypeScript",
      "MongoDB",
      "Mongoose",
      "Tailwind CSS",
    ],
    href: "https://github.com/Ayush-Kant/Omnizon",
  },
] as const;
