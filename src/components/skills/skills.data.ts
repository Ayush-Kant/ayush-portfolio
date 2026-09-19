export type SkillGroup = {
  label: string;
  skills: string[];
};

export const SKILL_GROUPS: SkillGroup[] = [
  {
    label: "Frontend",
    skills: [
      "React",
      "Next.js",
      "JavaScript",
      "TypeScript",
      "Tailwind CSS",
    ],
  },
  {
    label: "Backend",
    skills: [
      "Node.js",
      "Express",
      "Spring Boot",
      "REST APIs",
      "MongoDB",
      "PostgreSQL",
    ],
  },
  {
    label: "Tools & Systems",
    skills: [
      "Git",
      "GitHub",
      "Docker",
      "Firebase",
      "Vite",
    ],
  },
  {
    label: "Currently Exploring",
    skills: [
      "AI Engineering",
      "System Design",
      "Cloud",
      "Developer Tools",
    ],
  },
];
