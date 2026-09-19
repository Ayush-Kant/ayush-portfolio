"use client";

import {
  useRef,
  useState,
} from "react";

import styles from "./SkillsSection.module.css";
import { JAVASCRIPT_SKILL } from "./skills.data";
import SkillBox from "./SkillBox";
import {
  useSingleBoxPhysics,
} from "./useSingleBoxPhysics";

export default function SkillPhysicsTray() {
  const trayRef =
    useRef<HTMLDivElement | null>(null);

  const boxRef =
    useRef<HTMLButtonElement | null>(null);

  const [isDragging, setIsDragging] =
    useState(false);

  const {
    onPointerDown,
  } = useSingleBoxPhysics({
    trayRef,
    boxRef,
    onDraggingChange:
      setIsDragging,
  });

  return (
    <div className={styles.trayWrap}>
      <div className={styles.trayHeader}>
        <div>
          <p className={styles.trayTitle}>
            {JAVASCRIPT_SKILL.name}
          </p>

          <p className={styles.trayHint}>
            Double-click + hold to move
          </p>
        </div>

        <span
          className={styles.trayStatus}
          data-dragging={
            isDragging ? "true" : "false"
          }
        >
          {isDragging
            ? "HELD"
            : "READY"}
        </span>
      </div>

      <div
        ref={trayRef}
        className={styles.tray}
      >
        <div
          className={styles.trayGrid}
          aria-hidden="true"
        />

        <div
          className={styles.trayGlow}
          aria-hidden="true"
        />

        <div
          className={styles.trayWall}
          aria-hidden="true"
        />

        <div
          className={styles.trayInstruction}
          aria-hidden="true"
        >
          Grab it · move it · drop it
        </div>

        <SkillBox
          ref={boxRef}
          isDragging={isDragging}
          onPointerDown={
            onPointerDown
          }
        />

        <div
          className={styles.trayFloor}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
