import {
  forwardRef,
} from "react";

import styles from "./SkillsSection.module.css";

type SkillBoxProps = {
  isDragging: boolean;
};

const SkillBox = forwardRef<
  HTMLButtonElement,
  SkillBoxProps
>(function SkillBox(
  {
    isDragging,
  },
  ref
) {
  return (
    <button
      ref={ref}
      type="button"
      className={
        styles.skillBox
      }
      data-dragging={
        isDragging
          ? "true"
          : "false"
      }
      aria-label={
        "JavaScript skill box. " +
        "Double-click and hold " +
        "to pick it up."
      }
    >
      <span
        className={
          styles.jsIcon
        }
        aria-hidden="true"
      >
        <span>JS</span>
      </span>
    </button>
  );
});

export default SkillBox;
