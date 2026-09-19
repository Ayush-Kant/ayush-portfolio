import type { CSSProperties } from "react";

import type { SkillDefinition } from "./skills.data";
import TechIcon from "./TechIcon";

type SkillCardProps = {
  skill: SkillDefinition;
  setRef: (
    id: string
  ) => (
    node: HTMLButtonElement | null
  ) => void;
};

export default function SkillCard({
  skill,
  setRef,
}: SkillCardProps) {
  const style = {
    "--skill-accent":
      "#" + skill.icon.hex,
  } as CSSProperties;

  return (
    <button
      type="button"
      ref={setRef(skill.id)}
      data-skill-id={skill.id}
      className="skill-card"
      style={style}
      aria-label={
        skill.name +
        " — " +
        skill.category
      }
    >
      <span className="skill-card-icon">
        <TechIcon
          icon={skill.icon}
          label={skill.name}
        />
      </span>

      <span className="skill-card-content">
        <span className="skill-card-name">
          {skill.name}
        </span>

        <span className="skill-card-category">
          {skill.category}
        </span>
      </span>

      <span
        className="skill-card-grip"
        aria-hidden="true"
      >
        ⋮⋮
      </span>
    </button>
  );
}
