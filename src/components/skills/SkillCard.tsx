import type { CSSProperties } from "react";

import styles from "./SkillsSection.module.css";
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
      className={styles.card}
      style={style}
      aria-label={
        skill.name +
        " — " +
        skill.category
      }
    >
      <span className={styles.cardIcon}>
        <TechIcon
          icon={skill.icon}
          label={skill.name}
        />
      </span>

      <span className={styles.cardContent}>
        <span className={styles.cardName}>
          {skill.name}
        </span>

        <span className={styles.cardCategory}>
          {skill.category}
        </span>
      </span>

      <span
        className={styles.cardGrip}
        aria-hidden="true"
      >
        ⋮⋮
      </span>
    </button>
  );
}
