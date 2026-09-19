export type SkillBoxKind =
  | "javascript"
  | "typescript"
  | "java"
  | "python"
  | "react"
  | "nextjs"
  | "tailwindcss"
  | "css"
  | "nodejs"
  | "mongodb"
  | "postgresql"
  | "redis"
  | "docker"
  | "kubernetes"
  | "aws"
  | "express"
  | "git"
  | "github";

export type SkillDefinition = {
  id: SkillBoxKind;
  name: string;
  logo: string;
  color: string;
  detail: {
    eyebrow: string;
    title: string;
    summary: string;
    highlights: readonly string[];
  };
};

export const SKILL_LOGOS: Record<SkillBoxKind, string> = {
  javascript: "/skill-icons-complete/common/JavaScript.svg",
  typescript: "/skill-icons-complete/common/TypeScript.svg",
  java: "/skill-icons-complete/dark/Java-Dark.svg",
  python: "/skill-icons-complete/dark/Python-Dark.svg",
  react: "/skill-icons-complete/dark/React-Dark.svg",
  nextjs: "/skill-icons-complete/dark/NextJS-Dark.svg",
  tailwindcss: "/skill-icons-complete/dark/TailwindCSS-Dark.svg",
  css: "/skill-icons-complete/common/CSS.svg",
  nodejs: "/skill-icons-complete/dark/NodeJS-Dark.svg",
  mongodb: "/skill-icons-complete/common/MongoDB.svg",
  postgresql: "/skill-icons-complete/dark/PostgreSQL-Dark.svg",
  redis: "/skill-icons-complete/dark/Redis-Dark.svg",
  docker: "/skill-icons-complete/common/Docker.svg",
  kubernetes: "/skill-icons-complete/common/Kubernetes.svg",
  aws: "/skill-icons-complete/dark/AWS-Dark.svg",
  express: "/skill-icons-complete/dark/ExpressJS-Dark.svg",
  git: "/skill-icons-complete/common/Git.svg",
  github: "/skill-icons-complete/dark/Github-Dark.svg",
};

export const JAVASCRIPT_SKILL = {
  id: "javascript",
  name: "JavaScript",
  logo: "JavaScript",
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
} as const satisfies SkillDefinition;

export const TYPESCRIPT_SKILL = {
  id: "typescript",
  name: "TypeScript",
  logo: "TypeScript",
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
} as const satisfies SkillDefinition;

export const JAVA_SKILL = {
  id: "java",
  name: "Java",
  logo: "Java",
  color: "#F58219",
  detail: {
    eyebrow: "Where I use it",
    title: "Java is part of my backend and programming toolkit.",
    summary:
      "I use Java for object-oriented programming, backend concepts and interview-oriented problem solving.",
    highlights: [
      "Object-oriented programming",
      "Backend and service fundamentals",
      "Interview and DSA practice",
    ],
  },
} as const satisfies SkillDefinition;

export const PYTHON_SKILL = {
  id: "python",
  name: "Python",
  logo: "Python",
  color: "#387EB8",
  detail: {
    eyebrow: "Where I use it",
    title: "Python is my primary language for AI and data work.",
    summary:
      "I use Python for backend services, machine learning workflows, automation and AI applications.",
    highlights: [
      "FastAPI and Flask services",
      "Machine learning and data workflows",
      "AI and automation tooling",
    ],
  },
} as const satisfies SkillDefinition;

export const REACT_SKILL = {
  id: "react",
  name: "React",
  logo: "React",
  color: "#00D8FF",
  detail: {
    eyebrow: "Where I use it",
    title: "React powers my interactive frontend work.",
    summary:
      "I use React to build reusable, component-driven interfaces with predictable state and interaction patterns.",
    highlights: [
      "Reusable component architecture",
      "State management and interactive UI",
      "Frontend applications and dashboards",
    ],
  },
} as const satisfies SkillDefinition;

export const NEXTJS_SKILL = {
  id: "nextjs",
  name: "Next.js",
  logo: "Next.js",
  color: "#FFFFFF",
  detail: {
    eyebrow: "Where I build with it",
    title: "Next.js helps me build full-stack web applications.",
    summary:
      "I use Next.js for production-oriented React applications with routing, server features and structured full-stack architecture.",
    highlights: [
      "App Router and full-stack features",
      "Server and client components",
      "Production-ready React applications",
    ],
  },
} as const satisfies SkillDefinition;

export const TAILWINDCSS_SKILL = {
  id: "tailwindcss",
  name: "Tailwind CSS",
  logo: "Tailwind",
  color: "#14C6B7",
  detail: {
    eyebrow: "Where I style with it",
    title: "Tailwind CSS keeps my UI work fast and systematic.",
    summary:
      "I use utility-first styling to build responsive interfaces without scattering component styles across large stylesheets.",
    highlights: [
      "Responsive utility-first styling",
      "Fast component-level iteration",
      "Consistent design primitives",
    ],
  },
} as const satisfies SkillDefinition;

export const CSS_SKILL = {
  id: "css",
  name: "CSS",
  logo: "CSS",
  color: "#0277BD",
  detail: {
    eyebrow: "Frontend foundation",
    title: "CSS gives me precise control over interface behavior.",
    summary:
      "I use CSS for layout, responsive behavior, animation, visual states and the detailed styling behind interactive interfaces.",
    highlights: [
      "Responsive layouts and positioning",
      "Transitions and keyframe animation",
      "Component-level visual systems",
    ],
  },
} as const satisfies SkillDefinition;

export const NODEJS_SKILL = {
  id: "nodejs",
  name: "Node.js",
  logo: "Node.js",
  color: "#81CD39",
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
} as const satisfies SkillDefinition;

export const MONGODB_SKILL = {
  id: "mongodb",
  name: "MongoDB",
  logo: "MongoDB",
  color: "#10AA50",
  detail: {
    eyebrow: "Data layer",
    title: "MongoDB is one of my document-database choices.",
    summary:
      "I use MongoDB for application data where flexible document structures and rapid iteration fit the product.",
    highlights: [
      "Mongoose data modeling",
      "Document-based application data",
      "Backend persistence and querying",
    ],
  },
} as const satisfies SkillDefinition;

export const POSTGRESQL_SKILL = {
  id: "postgresql",
  name: "PostgreSQL",
  logo: "PostgreSQL",
  color: "#336791",
  detail: {
    eyebrow: "Data layer",
    title: "PostgreSQL is my relational database option.",
    summary:
      "I use PostgreSQL when applications need relational structure, strong constraints and dependable SQL querying.",
    highlights: [
      "Relational data modeling",
      "SQL querying and constraints",
      "Backend persistence and integrations",
    ],
  },
} as const satisfies SkillDefinition;

export const REDIS_SKILL = {
  id: "redis",
  name: "Redis",
  logo: "Redis",
  color: "#D82C20",
  detail: {
    eyebrow: "Performance layer",
    title: "Redis adds fast in-memory application data.",
    summary:
      "I use Redis for caching, session-oriented data and backend workflows that benefit from low-latency access.",
    highlights: [
      "Caching and fast lookups",
      "Session and temporary data",
      "Backend performance workflows",
    ],
  },
} as const satisfies SkillDefinition;

export const DOCKER_SKILL = {
  id: "docker",
  name: "Docker",
  logo: "Docker",
  color: "#2396ED",
  detail: {
    eyebrow: "Deployment tooling",
    title: "Docker makes my services easier to package and run.",
    summary:
      "I use containers to keep application environments reproducible across development and deployment.",
    highlights: [
      "Containerized application services",
      "Reproducible development environments",
      "Deployment and service packaging",
    ],
  },
} as const satisfies SkillDefinition;

export const KUBERNETES_SKILL = {
  id: "kubernetes",
  name: "Kubernetes",
  logo: "Kubernetes",
  color: "#326CE5",
  detail: {
    eyebrow: "Infrastructure",
    title: "Kubernetes is part of my container-orchestration toolkit.",
    summary:
      "I use Kubernetes concepts to understand how containerized services are deployed, scaled and managed.",
    highlights: [
      "Pods and workloads",
      "Service discovery and deployment",
      "Container orchestration concepts",
    ],
  },
} as const satisfies SkillDefinition;

export const AWS_SKILL = {
  id: "aws",
  name: "AWS",
  logo: "AWS",
  color: "#FF9900",
  detail: {
    eyebrow: "Cloud",
    title: "AWS is part of my deployment and infrastructure toolkit.",
    summary:
      "I use AWS services and cloud concepts when building and deploying backend-oriented applications.",
    highlights: [
      "Cloud deployment fundamentals",
      "Managed infrastructure services",
      "Backend hosting and integrations",
    ],
  },
} as const satisfies SkillDefinition;

export const EXPRESS_SKILL = {
  id: "express",
  name: "Express",
  logo: "Express",
  color: "#FFFFFF",
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
} as const satisfies SkillDefinition;

export const GIT_SKILL = {
  id: "git",
  name: "Git",
  logo: "Git",
  color: "#F03C2E",
  detail: {
    eyebrow: "Version control",
    title: "Git is how I manage changes and collaboration.",
    summary:
      "I use Git for branching, commits, merges, history and controlled project development.",
    highlights: [
      "Feature branches and pull requests",
      "Commit history and rollback",
      "Team collaboration workflows",
    ],
  },
} as const satisfies SkillDefinition;

export const GITHUB_SKILL = {
  id: "github",
  name: "GitHub",
  logo: "GitHub",
  color: "#FFFFFF",
  detail: {
    eyebrow: "Collaboration",
    title: "GitHub is where I manage and ship my repositories.",
    summary:
      "I use GitHub for source hosting, pull requests, code review and project collaboration.",
    highlights: [
      "Repositories and pull requests",
      "Code review and collaboration",
      "GitHub-based project workflows",
    ],
  },
} as const satisfies SkillDefinition;

export const SKILLS = [
  JAVASCRIPT_SKILL,
  TYPESCRIPT_SKILL,
  JAVA_SKILL,
  PYTHON_SKILL,
  REACT_SKILL,
  NEXTJS_SKILL,
  TAILWINDCSS_SKILL,
  CSS_SKILL,
  NODEJS_SKILL,
  MONGODB_SKILL,
  POSTGRESQL_SKILL,
  REDIS_SKILL,
  DOCKER_SKILL,
  KUBERNETES_SKILL,
  AWS_SKILL,
  EXPRESS_SKILL,
  GIT_SKILL,
  GITHUB_SKILL,
] as const;
