import {
  forwardRef,
  type MouseEventHandler,
} from "react";

import styles from "./SkillsSection.module.css";
import type { SkillBoxKind } from "./skills.data";

type SkillBoxProps = {
  skill: SkillBoxKind;
  isDragging: boolean;
  onDoubleClick:
    MouseEventHandler<HTMLButtonElement>;
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
  const isTypeScript =
    skill === "typescript";
  const isNode =
    skill === "nodejs";

  const skillName =
    isNode
      ? "Node.js"
      : isTypeScript
        ? "TypeScript"
        : "JavaScript";

  return (
    <button
      ref={ref}
      type="button"
      className={styles.skillBox}
      data-skill={skill}
      data-dragging={
        isDragging
          ? "true"
          : "false"
      }
      onDoubleClick={
        onDoubleClick
      }
      aria-label={
        skillName +
        " skill box. " +
        "Press and hold to move it. " +
        "Double-click to view details."
      }
    >
      {isNode ? (
        <span
          className={styles.nodeWordmark}
          aria-hidden="true"
        >
          node
        </span>
      ) : (
        <span
          className={styles.jsIcon}
          aria-hidden="true"
        >
          <span>
            {isTypeScript
              ? "TS"
              : "JS"}
          </span>
        </span>
      )}
    </button>
  );
});

SkillBox.displayName = "SkillBox";

export default SkillBox;