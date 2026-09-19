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

type InteractionState =
  | "ready"
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

  const [interaction, setInteraction] =
    useState<InteractionState>(
      "ready"
    );

  const [detailsVisible, setDetailsVisible] =
    useState(false);

  useSingleBoxPhysics({
    trayRef,
    boxRef,
    onStateChange:
      setInteraction,
  });

  return (
    <div
      className={
        styles.skillsPlayground
      }
    >
      <div
        className={
          styles.playgroundGrid
        }
      >
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
                Press + hold to move
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
              hold
              {" · "}
              move
              {" · "}
              release
            </div>

            <SkillBox
              ref={boxRef}
              isDragging={
                interaction ===
                "dragging"
              }
              onDoubleClick={() =>
                setDetailsVisible(
                  true
                )
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

        <aside
          className={
            styles.detailPanel
          }
          data-visible={
            detailsVisible
              ? "true"
              : "false"
          }
          aria-live="polite"
        >
          <div
            className={
              styles.detailSummon
            }
            aria-hidden="true"
          >
            <span />
          </div>

          <div
            className={
              styles.detailPanelInner
            }
          >
            <p
              className={
                styles.detailEyebrow
              }
            >
              {detailsVisible
                ? JAVASCRIPT_SKILL.detail.eyebrow
                : "Skill unlocked"}
            </p>

            <h3
              className={
                styles.detailTitle
              }
            >
              {detailsVisible
                ? JAVASCRIPT_SKILL.detail.title
                : "Double-click the box"}
            </h3>

            <p
              className={
                styles.detailSummary
              }
            >
              {detailsVisible
                ? JAVASCRIPT_SKILL.detail.summary
                : "I'll show you what I have built and worked with using this skill."}
            </p>

            <div
              className={
                styles.detailList
              }
            >
              {(
                detailsVisible
                  ? JAVASCRIPT_SKILL.detail.highlights
                  : [
                      "A closer look at my work",
                      "The tools I pair it with",
                      "Where it fits in my stack",
                    ]
              ).map(
                (item) => (
                  <span
                    key={item}
                    className={
                      styles.detailItem
                    }
                  >
                    {item}
                  </span>
                )
              )}
            </div>

            {detailsVisible && (
              <span
                className={
                  styles.detailClose
                }
                onClick={() =>
                  setDetailsVisible(
                    false
                  )
                }
                role="button"
                tabIndex={0}
                onKeyDown={(
                  event
                ) => {
                  if (
                    event.key ===
                      "Enter" ||
                    event.key ===
                      " "
                  ) {
                    setDetailsVisible(
                      false
                    );
                  }
                }}
              >
                Double-click again to replay
              </span>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
