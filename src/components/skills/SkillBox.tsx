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

const NODE_LOGO_PATH =
  "M11.998,24c-.321,0-.641-.084-.922-.247l-2.936-1.737c-.438-.245-.224-.332-.08-.383.585-.203.703-.25,1.328-.604.065-.037.151-.023.218.017l2.256,1.339c.082.045.197.045.272,0l8.795-5.076c.082-.047.134-.141.134-.238V6.921c0-.099-.053-.192-.137-.242l-8.791-5.072c-.081-.047-.189-.047-.271,0L3.075,6.68C2.99,6.729,2.936,6.825,2.936,6.921v10.15c0,.097.054.189.139.235l2.409,1.392c1.307.654,2.108-.116,2.108-.89V7.787c0-.142.114-.253.256-.253h1.115c.139,0,.255.112.255.253v10.021c0,1.745-.95,2.745-2.604,2.745-.508,0-.909,0-2.026-.551L2.28,18.675c-.57-.329-.922-.945-.922-1.604V6.921c0-.659.353-1.275.922-1.603l8.795-5.082c.557-.315,1.296-.315,1.848,0l8.794,5.082c.57.329.924.944.924,1.603v10.15c0,.659-.354,1.273-.924,1.604l-8.794,5.078c-.278.163-.597.247-.923.247ZM19.099,13.993c0-1.9-1.284-2.406-3.987-2.763-2.731-.361-3.009-.548-3.009-1.187,0-.528.235-1.233,2.258-1.233,1.807,0,2.473.389,2.747,1.607.024.115.129.199.247.199h1.141c.071,0,.138-.031.186-.081.048-.054.074-.123.067-.196-.177-2.098-1.571-3.076-4.388-3.076-2.508,0-4.004,1.058-4.004,2.833,0,1.925,1.488,2.457,3.895,2.695,2.88.282,3.103.703,3.103,1.269,0,.983-.789,1.402-2.642,1.402-2.327,0-2.839-.584-3.011-1.742-.02-.124-.126-.215-.253-.215h-1.137c-.141,0-.254.112-.254.253,0,1.482.806,3.248,4.655,3.248C17.501,17.007,19.099,15.91,19.099,13.993Z";

const EXPRESS_LOGO_PATH =
  "M12.262 16.666h1.146l6.975-9.325H19.22zm9.778 1.441v.004l-4.334-5.706-.557.74 4.873 6.682H.945V4.173h9.505l5.026 6.7.574-.772-4.374-5.928h.003l-.719-.945H0v17.544h24zM10.917 8.705a3.8 3.8 0 0 0-1.292-1.183q-.796-.45-1.916-.45c-.746 0-1.37.14-1.906.424a3.76 3.76 0 0 0-1.31 1.12 4.9 4.9 0 0 0-.75 1.581 7.17 7.17 0 0 0 0 3.696c.148.567.402 1.101.75 1.573a3.5 3.5 0 0 0 1.31 1.066q.803.39 1.906.389 1.77 0 2.739-.868.966-.867 1.328-2.457h-1.139q-.271 1.084-.977 1.734-.704.651-1.952.65-.812 0-1.392-.342a3.1 3.1 0 0 1-.957-.869 3.5 3.5 0 0 1-.551-1.182 5 5 0 0 1-.17-1.133 9 9 0 0 0-.015-.286 4.5 4.5 0 0 1 .015-.829c.047-.418.147-.83.296-1.223A3.7 3.7 0 0 1 5.54 9.05a2.9 2.9 0 0 1 .922-.742q.541-.28 1.246-.28c.47 0 .869.093 1.23.28q.541.281.922.742.379.461.587 1.057t.225 1.246H5.625l.004.957h6.182a7.3 7.3 0 0 0-.18-1.924 4.9 4.9 0 0 0-.715-1.68z";

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
  const isExpress =
    skill === "express";

  const skillName =
    isExpress
      ? "Express"
      : isNode
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
      {isNode && (
        <span
          className={styles.nodeIcon}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            role="presentation"
          >
            <path
              d={NODE_LOGO_PATH}
            />
          </svg>
        </span>
      )}

      {isExpress && (
        <span
          className={styles.expressIcon}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            role="presentation"
          >
            <path
              d={EXPRESS_LOGO_PATH}
            />
          </svg>
        </span>
      )}

      {!isNode && !isExpress && (
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