"use client";

import { useEffect, useRef } from "react";

import { BEE_CONFIG } from "./bee.config";
import {
  advanceBeeMotion,
  createBeeMotionState,
} from "./bee.motion";
import type {
  BeeMotionOutput,
  Point,
} from "./bee.types";

export const useBeeCursor = () => {
  const rootRef =
    useRef<HTMLDivElement | null>(null);

  const snapshotRef =
    useRef<BeeMotionOutput | null>(null);

  useEffect(() => {
    const root =
      rootRef.current;

    if (!root) return;

    const finePointer =
      window.matchMedia(
        "(pointer: fine)"
      ).matches;

    const reducedMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

    if (
      !finePointer ||
      reducedMotion
    ) {
      root.dataset.enabled =
        "false";
      return;
    }

    let pointer: Point = {
      x: 0,
      y: 0,
    };

    let previousPointer: Point = {
      x: 0,
      y: 0,
    };

    let pointerVelocity: Point = {
      x: 0,
      y: 0,
    };

    let state =
      createBeeMotionState(
        pointer
      );

    let initialized = false;
    let running = false;
    let animationFrame = 0;

    let lastFrameTime =
      performance.now();

    let lastPointerSampleTime =
      performance.now();

    let lastDebugMode =
      state.mode;

    const debugEnabled =
      process.env.NODE_ENV !==
        "production" &&
      new URLSearchParams(
        window.location.search
      ).get("debug") ===
        "bee";

    const setVariable = (
      name: string,
      value: string
    ) => {
      root.style.setProperty(
        name,
        value
      );
    };

    const startAnimation = () => {
      if (running) return;

      running = true;
      lastFrameTime =
        performance.now();

      animationFrame =
        requestAnimationFrame(
          renderFrame
        );
    };

    const handleMouseMove = (
      event: MouseEvent
    ) => {
      const nextPointer: Point = {
        x: event.clientX,
        y: event.clientY,
      };

      const now =
        performance.now();

      if (!initialized) {
        pointer =
          nextPointer;

        previousPointer =
          nextPointer;

        pointerVelocity = {
          x: 0,
          y: 0,
        };

        state =
          createBeeMotionState(
            pointer
          );

        state.lastPointerMoveAt =
          now;

        lastPointerSampleTime =
          now;

        initialized = true;

        root.dataset.visible =
          "true";

        startAnimation();
        return;
      }

      const elapsedSeconds =
        Math.max(
          now -
            lastPointerSampleTime,
          8
        ) / 1000;

      const rawVelocity = {
        x:
          (
            nextPointer.x -
            previousPointer.x
          ) /
          elapsedSeconds,

        y:
          (
            nextPointer.y -
            previousPointer.y
          ) /
          elapsedSeconds,
      };

      const rawSpeed =
        Math.hypot(
          rawVelocity.x,
          rawVelocity.y
        );

      const maxVelocity =
        BEE_CONFIG.pointer
          .maxVelocity;

      const velocityScale =
        rawSpeed > maxVelocity
          ? maxVelocity /
            rawSpeed
          : 1;

      const clampedVelocity = {
        x:
          rawVelocity.x *
          velocityScale,
        y:
          rawVelocity.y *
          velocityScale,
      };

      const smoothing =
        BEE_CONFIG.pointer
          .velocitySmoothing;

      pointerVelocity = {
        x:
          pointerVelocity.x *
            (1 - smoothing) +
          clampedVelocity.x *
            smoothing,

        y:
          pointerVelocity.y *
            (1 - smoothing) +
          clampedVelocity.y *
            smoothing,
      };

      pointer =
        nextPointer;

      previousPointer =
        nextPointer;

      state.lastPointerMoveAt =
        now;

      lastPointerSampleTime =
        now;

      startAnimation();
    };

    function renderFrame(
      time: number
    ) {
      if (
        document.hidden
      ) {
        animationFrame =
          requestAnimationFrame(
            renderFrame
          );
        return;
      }

      const deltaSeconds =
        Math.min(
          (
            time -
            lastFrameTime
          ) / 1000,
          0.033
        );

      lastFrameTime =
        time;

      const decay =
        Math.exp(
          -BEE_CONFIG.pointer
            .velocityDecay *
            deltaSeconds
        );

      pointerVelocity = {
        x:
          pointerVelocity.x *
          decay,
        y:
          pointerVelocity.y *
          decay,
      };

      const output =
        advanceBeeMotion(
          state,
          {
            pointer,
            pointerVelocity,
            time,
            deltaSeconds,
          }
        );

      snapshotRef.current =
        output;

      setVariable(
        "--bee-x",
        String(
          output.position.x +
          BEE_CONFIG.visual
            .cursorOffsetX
        ) +
          "px"
      );

      setVariable(
        "--bee-y",
        String(
          output.position.y +
          BEE_CONFIG.visual
            .cursorOffsetY
        ) +
          "px"
      );

      setVariable(
        "--bee-rotation",
        String(
          output.rotation
        ) +
          "deg"
      );

      setVariable(
        "--wing-duration",
        String(
          1 /
            output.wingSpeed
        ) +
          "s"
      );

      setVariable(
        "--wing-amount",
        String(
          output.wingAmount
        )
      );

      root.dataset.state =
        output.mode;

      if (debugEnabled) {
        root.dataset.speed =
          output.speed.toFixed(
            1
          );

        root.dataset.distance =
          output.distanceToPointer.toFixed(
            1
          );

        if (
          output.mode !==
          lastDebugMode
        ) {
          console.debug(
            "[BeeCursor]",
            lastDebugMode,
            "→",
            output.mode,
            {
              speed:
                Number(
                  output.speed.toFixed(
                    1
                  )
                ),
              distance:
                Number(
                  output.distanceToPointer.toFixed(
                    1
                  )
                ),
            }
          );

          lastDebugMode =
            output.mode;
        }
      }

      animationFrame =
        requestAnimationFrame(
          renderFrame
        );
    }

    root.dataset.enabled =
      "true";

    root.dataset.visible =
      "false";

    window.addEventListener(
      "mousemove",
      handleMouseMove,
      {
        passive: true,
      }
    );

    return () => {
      running = false;

      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      cancelAnimationFrame(
        animationFrame
      );
    };
  }, []);

  return {
    rootRef,
    snapshotRef,
  };
};
