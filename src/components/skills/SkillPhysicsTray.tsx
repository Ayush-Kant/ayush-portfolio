"use client";

import {
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";

import styles from "./SkillsSection.module.css";
import {
  SKILLS,
  type SkillBoxKind,
  type SkillDefinition,
} from "./skills.data";
import SkillBox from "./SkillBox";
import {
  type SkillPhysicsBodyConfig,
  useSkillPhysicsWorld,
} from "./useSkillPhysicsWorld";

type InteractionState = "ready" | "dragging";

const INITIAL_STACK_LAYOUT = [
  { xPercent: 0.035, level: 0 },
  { xPercent: 0.09, level: 1 },
  { xPercent: 0.045, level: 2 },

  { xPercent: 0.19, level: 0 },
  { xPercent: 0.155, level: 1 },
  { xPercent: 0.21, level: 2 },

  { xPercent: 0.365, level: 0 },
  { xPercent: 0.41, level: 1 },
  { xPercent: 0.385, level: 2 },

  { xPercent: 0.545, level: 0 },
  { xPercent: 0.505, level: 1 },
  { xPercent: 0.57, level: 2 },

  { xPercent: 0.72, level: 0 },
  { xPercent: 0.675, level: 1 },
  { xPercent: 0.745, level: 2 },

  { xPercent: 0.885, level: 0 },
  { xPercent: 0.845, level: 1 },
  { xPercent: 0.91, level: 2 },
] as const;

export default function SkillPhysicsTray() {
  const trayRef = useRef<HTMLDivElement | null>(null);

  const boxRefs = useRef<
    Partial<Record<SkillBoxKind, HTMLButtonElement | null>>
  >({});

  const setBoxRefs = useMemo(
    () =>
      Object.fromEntries(
        SKILLS.map((skill) => [
          skill.id,
          (node: HTMLButtonElement | null) => {
            boxRefs.current[skill.id] = node;
          },
        ])
      ) as Record<
        SkillBoxKind,
        (node: HTMLButtonElement | null) => void
      >,
    []
  );

  const boxRefObjects = useMemo(
    () =>
      Object.fromEntries(
        SKILLS.map((skill) => [
          skill.id,
          {
            get current() {
              return boxRefs.current[skill.id] ?? null;
            },
          },
        ])
      ) as Record<
        SkillBoxKind,
        RefObject<HTMLButtonElement | null>
      >,
    []
  );

  const [draggingSkill, setDraggingSkill] =
    useState<SkillDefinition | null>(null);

  const [activeSkill, setActiveSkill] =
    useState<SkillDefinition | null>(null);

  const physicsBodies =
    useMemo<readonly SkillPhysicsBodyConfig[]>(
      () =>
        SKILLS.map((skill, index) => ({
          id: skill.id,
          boxRef: boxRefObjects[skill.id],
          initialXPercent:
            INITIAL_STACK_LAYOUT[index]?.xPercent ??
            0.5,
          initialStackLevel:
            INITIAL_STACK_LAYOUT[index]?.level ?? 0,
          onStateChange: (
            state: InteractionState
          ) => {
            setDraggingSkill(
              state === "dragging"
                ? skill
                : null
            );
          },
        })),
      [boxRefObjects]
    );

  useSkillPhysicsWorld({
    trayRef,
    bodies: physicsBodies,
  });

  return (
    <div className={styles.skillsPlayground}>
      <div className={styles.playgroundGrid}>
        <div className={styles.trayWrap}>
          <div className={styles.trayHeader}>
            <div>
              <p className={styles.trayTitle}>
                Full-stack tech stack
              </p>

              <p className={styles.trayHint}>
                Press + hold to move
              </p>
            </div>

            <span
              className={styles.trayStatus}
              data-state={
                draggingSkill
                  ? "dragging"
                  : "ready"
              }
            >
              {draggingSkill
                ? draggingSkill.name + " HELD"
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
              hold · move · release
            </div>

            {SKILLS.map((skill) => (
              <SkillBox
                key={skill.id}
                ref={setBoxRefs[skill.id]}
                skill={skill.id}
                isDragging={
                  draggingSkill?.id === skill.id
                }
                onDoubleClick={() =>
                  setActiveSkill(skill)
                }
              />
            ))}

            <div
              className={styles.trayFloor}
              aria-hidden="true"
            />
          </div>
        </div>

        <aside
          className={styles.detailPanel}
          data-visible={
            activeSkill ? "true" : "false"
          }
          style={{
            ["--skill-accent" as string]:
              activeSkill?.color ??
              "#b994ff",
          }}
          aria-live="polite"
        >
          <div
            className={styles.detailSummon}
            aria-hidden="true"
          />

          <div
            className={styles.detailPanelInner}
          >
            <p className={styles.detailEyebrow}>
              {activeSkill
                ? activeSkill.detail.eyebrow
                : "Skill unlocked"}
            </p>

            <h3 className={styles.detailTitle}>
              {activeSkill
                ? activeSkill.detail.title
                : "Double-click a box"}
            </h3>

            <p className={styles.detailSummary}>
              {activeSkill
                ? activeSkill.detail.summary
                : "Double-click any skill box to reveal how I use it."}
            </p>

            <div className={styles.detailList}>
              {(
                activeSkill
                  ? activeSkill.detail.highlights
                  : [
                      "Frontend, backend, cloud and infrastructure",
                      "Press + hold to move",
                      "Release to drop",
                    ]
              ).map((item) => (
                <span
                  key={item}
                  className={styles.detailItem}
                >
                  {item}
                </span>
              ))}
            </div>

            {activeSkill && (
              <button
                type="button"
                className={styles.detailClose}
                onClick={() =>
                  setActiveSkill(null)
                }
              >
                Close details
              </button>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
