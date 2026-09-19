import type { SimpleIcon } from "simple-icons";

import {
  siAmazonwebservices,
  siCss3,
  siDocker,
  siJava,
  siJavascript,
  siKubernetes,
  siLangchain,
  siLanggraph,
  siMongodb,
  siNodedotjs,
  siNextdotjs,
  siOllama,
  siPostgresql,
  siPydantic,
  siPython,
  siQdrant,
  siReact,
  siRedis,
  siTailwindcss,
  siTypescript,
} from "simple-icons";

export type SkillDefinition = {
  id: string;
  name: string;
  category: string;
  icon: SimpleIcon;
};

export const SKILLS: SkillDefinition[] = [
  { id: "java", name: "Java", category: "Languages", icon: siJava },
  { id: "python", name: "Python", category: "Languages", icon: siPython },
  {
    id: "javascript",
    name: "JavaScript",
    category: "Languages",
    icon: siJavascript,
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "Languages",
    icon: siTypescript,
  },
  {
    id: "react",
    name: "React",
    category: "Frontend",
    icon: siReact,
  },
  {
    id: "nextjs",
    name: "Next.js",
    category: "Frontend",
    icon: siNextdotjs,
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    category: "Frontend",
    icon: siTailwindcss,
  },
  {
    id: "css",
    name: "CSS",
    category: "Frontend",
    icon: siCss3,
  },
  {
    id: "nodejs",
    name: "Node.js",
    category: "Backend",
    icon: siNodedotjs,
  },
  {
    id: "mongodb",
    name: "MongoDB",
    category: "Data",
    icon: siMongodb,
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    category: "Data",
    icon: siPostgresql,
  },
  {
    id: "redis",
    name: "Redis",
    category: "Infrastructure",
    icon: siRedis,
  },
  {
    id: "docker",
    name: "Docker",
    category: "Infrastructure",
    icon: siDocker,
  },
  {
    id: "kubernetes",
    name: "Kubernetes",
    category: "Infrastructure",
    icon: siKubernetes,
  },
  {
    id: "aws",
    name: "AWS",
    category: "Cloud",
    icon: siAmazonwebservices,
  },
  {
    id: "langchain",
    name: "LangChain",
    category: "AI",
    icon: siLangchain,
  },
  {
    id: "langgraph",
    name: "LangGraph",
    category: "AI",
    icon: siLanggraph,
  },
  {
    id: "qdrant",
    name: "Qdrant",
    category: "AI",
    icon: siQdrant,
  },
  {
    id: "pydantic",
    name: "Pydantic",
    category: "AI",
    icon: siPydantic,
  },
  {
    id: "ollama",
    name: "Ollama",
    category: "AI",
    icon: siOllama,
  },
];
