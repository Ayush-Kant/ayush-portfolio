import {
  forwardRef,
  type MouseEventHandler,
} from "react";

import styles from "./SkillsSection.module.css";
import {
  SKILL_LOGOS,
  type SkillBoxKind,
} from "./skills.data";

type SkillBoxProps = {
  skill: SkillBoxKind;
  isDragging: boolean;
  onDoubleClick: MouseEventHandler<HTMLButtonElement>;
};

const SkillBox = forwardRef<
  HTMLButtonElement,
  SkillBoxProps
>(function SkillBox(
  {
    skill,
    isDragging,
    onDoubleClick,
  },
  ref
) {
  return (
    <button
      ref={ref}
      type="button"
      className={styles.skillBox}
      data-skill={skill}
      data-dragging={isDragging ? "true" : "false"}
      onDoubleClick={onDoubleClick}
      aria-label={
        skill.replaceAll("-", " ") +
        " skill box. Press and hold to move it. Double-click to view details."
      }
    >
      <img
        src={SKILL_LOGOS[skill]}
        alt=""
        className={styles.skillLogo}
        draggable={false}
      />
    </button>
  );
});

SkillBox.displayName = "SkillBox";

export default SkillBox;
