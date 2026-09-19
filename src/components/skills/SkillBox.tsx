import {
  forwardRef,
  type PointerEventHandler,
} from "react";

import styles from "./SkillsSection.module.css";

type SkillBoxProps = {
  isDragging: boolean;
  onPointerDown:
    PointerEventHandler<HTMLButtonElement>;
};

const SkillBox = forwardRef<
  HTMLButtonElement,
  SkillBoxProps
>(function SkillBox(
  {
    isDragging,
    onPointerDown,
  },
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
      onPointerDown={onPointerDown}
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
