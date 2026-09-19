"use client";

import {
  useRef,
  useState,
} from "react";

import styles from "./SkillsSection.module.css";
import { SKILLS } from "./skills.data";
import SkillCard from "./SkillCard";
import { useSkillPhysics } from "./useSkillPhysics";

export default function SkillPhysicsPlayground() {
  const stageRef =
    useRef<HTMLDivElement | null>(null);

  const [
    hasInteracted,
    setHasInteracted,
  ] = useState(false);

  const {
    setCardRef,
    handlePointerDown,
    reset,
  } = useSkillPhysics({
    stageRef,
  });

  return (
    <div className={styles.playgroundWrap}>
      <div className={styles.toolbar}>
        <div>
          <p className={styles.playgroundTitle}>
            Skill tray
          </p>

          <p className={styles.playgroundSubtitle}>
            {hasInteracted
              ? "Make your own stack."
              : "Grab a card and throw it around."}
          </p>
        </div>

        <button
          type="button"
          className={styles.reset}
          onClick={() => {
            reset();
            setHasInteracted(false);
          }}
        >
          ↻ Reset
        </button>
      </div>

      <div
        ref={stageRef}
        className={styles.playground}
        onPointerDown={(event) => {
          const card =
            (
              event.target as HTMLElement
            ).closest<HTMLButtonElement>(
              "[data-skill-id]"
            );

          if (!card) return;

          const id =
            card.dataset.skillId;

          if (!id) return;

          setHasInteracted(true);
          handlePointerDown(
            id,
            event.nativeEvent
          );
        }}
      >
        <div
          className={styles.grid}
          aria-hidden="true"
        />

        <div
          className={styles.glow}
          aria-hidden="true"
        />

        <div
          className={styles.hint}
          data-hidden={
            hasInteracted
              ? "true"
              : "false"
          }
          aria-hidden="true"
        >
          ↖ grab a skill
        </div>

        {SKILLS.map((skill) => (
          <SkillCard
            key={skill.id}
            skill={skill}
            setRef={setCardRef}
          />
        ))}

        <div
          className={styles.trayFloor}
          aria-hidden="true"
        >
          <span>BUILD YOUR STACK</span>
          <span>·</span>
          <span>KEEP EXPERIMENTING</span>
        </div>
      </div>
    </div>
  );
}
