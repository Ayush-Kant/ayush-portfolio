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
  { isDragging },
  ref
) {
  return (
    <button
      ref={ref}
      type="button"
      className={styles.skillBox}
      data-dragging={
        isDragging ? "true" : "false"
      }
      aria-label="JavaScript skill box. Double-click and hold to move it."
    >
      <span
        className={styles.jsMark}
        aria-hidden="true"
      >
        JS
      </span>
    </button>
  );
});

export default SkillBox;
