"use client";

import {
  useRef,
  useState,
} from "react";

import styles from "./SkillsSection.module.css";
import { JAVASCRIPT_SKILL } from "./skills.data";
import SkillBox from "./SkillBox";
import { useSingleBoxPhysics } from "./useSingleBoxPhysics";

type InteractionState =
  | "ready"
  | "armed"
  | "dragging";

export default function SkillPhysicsTray() {
  const trayRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const boxRef =
    useRef<HTMLButtonElement | null>(
      null
    );

  const [
    interaction,
    setInteraction,
  ] =
    useState<InteractionState>(
      "ready"
    );

  useSingleBoxPhysics({
    trayRef,
    boxRef,
    onStateChange:
      setInteraction,
  });

  return (
    <div
      className={
        styles.trayWrap
      }
    >
      <div
        className={
          styles.trayHeader
        }
      >
        <div>
          <p
            className={
              styles.trayTitle
            }
          >
            {JAVASCRIPT_SKILL.name}
          </p>

          <p
            className={
              styles.trayHint
            }
          >
            Double-click + hold
            {" · "}
            release to drop
          </p>
        </div>

        <span
          className={
            styles.trayStatus
          }
          data-state={
            interaction
          }
        >
          {interaction ===
          "dragging"
            ? "HELD"
            : interaction ===
                "armed"
              ? "CLICK AGAIN"
              : "READY"}
        </span>
      </div>

      <div
        ref={trayRef}
        className={
          styles.tray
        }
      >
        <div
          className={
            styles.trayGrid
          }
          aria-hidden="true"
        />

        <div
          className={
            styles.trayGlow
          }
          aria-hidden="true"
        />

        <div
          className={
            styles.trayWall
          }
          aria-hidden="true"
        />

        <div
          className={
            styles.trayInstruction
          }
          aria-hidden="true"
        >
          double-click
          {"  "}
          ·
          {"  "}
          move
          {"  "}
          ·
          {"  "}
          drop
        </div>

        <SkillBox
          ref={boxRef}
          isDragging={
            interaction ===
            "dragging"
          }
        />

        <div
          className={
            styles.trayFloor
          }
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
