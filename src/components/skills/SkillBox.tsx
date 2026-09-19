import {
  forwardRef,
  type MouseEventHandler,
} from "react";

import styles from "./SkillsSection.module.css";

type SkillBoxProps = {
  isDragging: boolean;
  onDoubleClick:
    MouseEventHandler<HTMLButtonElement>;
};

const SkillBox = forwardRef<
  HTMLButtonElement,
  SkillBoxProps
>(function SkillBox(
  {
    isDragging,
    onDoubleClick,
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
      onDoubleClick={
        onDoubleClick
      }
      aria-label={
        "JavaScript skill box. " +
        "Press and hold to move it. " +
        "Double-click to view details."
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
SkillBox.displayName = "SkillBox";

export default SkillBox;
