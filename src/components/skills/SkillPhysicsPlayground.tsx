"use client";

import {
  useRef,
  useState,
} from "react";

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
    skills: SKILLS,
  });

  return (
    <div className="skills-playground-wrap">
      <div className="skills-playground-toolbar">
        <div>
          <p className="skills-playground-title">
            Skill tray
          </p>

          <p className="skills-playground-subtitle">
            {hasInteracted
              ? "Make your own stack."
              : "Grab a card and throw it around."}
          </p>
        </div>

        <button
          type="button"
          className="skills-reset"
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
        className="skills-playground"
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
            event as React.PointerEvent<HTMLButtonElement>
          );
        }}
      >
        <div
          className="skills-playground-grid"
          aria-hidden="true"
        />

        <div
          className="skills-playground-glow"
          aria-hidden="true"
        />

        <div
          className="skills-playground-hint"
          data-hidden={hasInteracted}
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
          className="skills-tray-floor"
          aria-hidden="true"
        >
          <span>
            BUILD YOUR STACK
          </span>
          <span>·</span>
          <span>
            KEEP EXPERIMENTING
          </span>
        </div>
      </div>
    </div>
  );
}
