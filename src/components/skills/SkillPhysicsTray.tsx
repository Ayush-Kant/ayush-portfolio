"use client";

import {
  useMemo,
  useRef,
  useState,
} from "react";

import styles from "./SkillsSection.module.css";
import {
  EXPRESS_SKILL,
  JAVASCRIPT_SKILL,
  NODEJS_SKILL,
  TYPESCRIPT_SKILL,
} from "./skills.data";
import SkillBox from "./SkillBox";
import {
  type SkillPhysicsBodyConfig,
  useSkillPhysicsWorld,
} from "./useSkillPhysicsWorld";

type InteractionState =
  | "ready"
  | "dragging";

export default function SkillPhysicsTray() {
  const trayRef =
    useRef<HTMLDivElement | null>(null);

  const jsBoxRef =
    useRef<HTMLButtonElement | null>(null);

  const tsBoxRef =
    useRef<HTMLButtonElement | null>(null);

  const nodeBoxRef =
    useRef<HTMLButtonElement | null>(null);

  const expressBoxRef =
    useRef<HTMLButtonElement | null>(null);

  const [jsInteraction, setJsInteraction] =
    useState<InteractionState>("ready");

  const [tsInteraction, setTsInteraction] =
    useState<InteractionState>("ready");

  const [nodeInteraction, setNodeInteraction] =
    useState<InteractionState>("ready");

  const [expressInteraction, setExpressInteraction] =
    useState<InteractionState>("ready");

  const [activeSkill, setActiveSkill] =
    useState<
      | typeof JAVASCRIPT_SKILL
      | typeof TYPESCRIPT_SKILL
      | typeof NODEJS_SKILL
      | typeof EXPRESS_SKILL
      | null
    >(null);

  const physicsBodies =
    useMemo<readonly SkillPhysicsBodyConfig[]>(
      () => [
        {
          id: "javascript",
          boxRef: jsBoxRef,
          initialXPercent: 0.14,
          onStateChange: setJsInteraction,
        },
        {
          id: "typescript",
          boxRef: tsBoxRef,
          initialXPercent: 0.42,
          onStateChange: setTsInteraction,
        },
        {
          id: "nodejs",
          boxRef: nodeBoxRef,
          initialXPercent: 0.68,
          onStateChange: setNodeInteraction,
        },
        {
          id: "express",
          boxRef: expressBoxRef,
          initialXPercent: 0.84,
          onStateChange: setExpressInteraction,
        },
      ],
      []
    );

  useSkillPhysicsWorld({
    trayRef,
    bodies: physicsBodies,
  });

  const draggingSkill =
    jsInteraction === "dragging"
      ? JAVASCRIPT_SKILL.name
      : tsInteraction === "dragging"
        ? TYPESCRIPT_SKILL.name
        : nodeInteraction === "dragging"
          ? NODEJS_SKILL.name
          : expressInteraction === "dragging"
            ? EXPRESS_SKILL.name
            : null;

  return (
    <div className={styles.skillsPlayground}>
      <div className={styles.playgroundGrid}>
        <div className={styles.trayWrap}>
          <div className={styles.trayHeader}>
            <div>
              <p className={styles.trayTitle}>
                JavaScript + TypeScript + Node.js + Express
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
                ? draggingSkill + " HELD"
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

            <SkillBox
              ref={jsBoxRef}
              skill="javascript"
              isDragging={
                jsInteraction === "dragging"
              }
              onDoubleClick={() =>
                setActiveSkill(
                  JAVASCRIPT_SKILL
                )
              }
            />

            <SkillBox
              ref={tsBoxRef}
              skill="typescript"
              isDragging={
                tsInteraction === "dragging"
              }
              onDoubleClick={() =>
                setActiveSkill(
                  TYPESCRIPT_SKILL
                )
              }
            />

            <SkillBox
              ref={nodeBoxRef}
              skill="nodejs"
              isDragging={
                nodeInteraction === "dragging"
              }
              onDoubleClick={() =>
                setActiveSkill(
                  NODEJS_SKILL
                )
              }
            />

            <SkillBox
              ref={expressBoxRef}
              skill="express"
              isDragging={
                expressInteraction === "dragging"
              }
              onDoubleClick={() =>
                setActiveSkill(
                  EXPRESS_SKILL
                )
              }
            />

            <div
              className={styles.trayFloor}
              aria-hidden="true"
            />
          </div>
        </div>

        <aside
          className={styles.detailPanel}
          data-visible={
            activeSkill
              ? "true"
              : "false"
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
            <p
              className={styles.detailEyebrow}
            >
              {activeSkill
                ? activeSkill.detail.eyebrow
                : "Skill unlocked"}
            </p>

            <h3
              className={styles.detailTitle}
            >
              {activeSkill
                ? activeSkill.detail.title
                : "Double-click a box"}
            </h3>

            <p
              className={styles.detailSummary}
            >
              {activeSkill
                ? activeSkill.detail.summary
                : "Double-click JavaScript, TypeScript, Node.js or Express to reveal how I use it."}
            </p>

            <div
              className={styles.detailList}
            >
              {(
                activeSkill
                  ? activeSkill.detail.highlights
                  : [
                      "JavaScript, TypeScript, Node.js and Express",
                      "Press + hold to move",
                      "Release to drop",
                    ]
              ).map(
                (item) => (
                  <span
                    key={item}
                    className={styles.detailItem}
                  >
                    {item}
                  </span>
                )
              )}
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