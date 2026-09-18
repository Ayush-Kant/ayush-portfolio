"use client";

import { useEffect, useRef } from "react";

type Point = {
  x: number;
  y: number;
};

const lerp = (
  current: number,
  target: number,
  amount: number
) => current + (target - current) * amount;

const clamp = (
  value: number,
  min: number,
  max: number
) => Math.min(Math.max(value, min), max);

export default function BeeCursor() {
  const beeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const bee = beeRef.current;

    if (!bee) return;

    const desktopPointer = window.matchMedia(
      "(pointer: fine)"
    ).matches;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!desktopPointer || reducedMotion) {
      bee.style.display = "none";
      return;
    }

    const target: Point = {
      x: window.innerWidth * 0.5,
      y: window.innerHeight * 0.5,
    };

    const current: Point = {
      x: target.x,
      y: target.y,
    };

    const previous: Point = {
      x: current.x,
      y: current.y,
    };

    let lastPointerMove = performance.now();
    let previousTime = performance.now();

    let speed = 0;
    let angle = 0;
    let animationFrame = 0;

    let hasMoved = false;
    let isLanded = false;

    const handlePointerMove = (
      event: PointerEvent
    ) => {
      if (event.pointerType !== "mouse") {
        return;
      }

      target.x = event.clientX;
      target.y = event.clientY;

      lastPointerMove = performance.now();
      hasMoved = true;
      isLanded = false;

      bee.classList.remove("bee-landed");
      bee.classList.add("bee-flying");
    };

    const animate = (time: number) => {
      const delta = Math.min(
        time - previousTime,
        32
      );

      previousTime = time;

      /*
       * --------------------------------------------------
       * SLOW FOLLOW
       * --------------------------------------------------
       *
       * Pointer moves immediately.
       * Bee catches up slowly.
       */
      previous.x = current.x;
      previous.y = current.y;

      current.x = lerp(
        current.x,
        target.x,
        0.075
      );

      current.y = lerp(
        current.y,
        target.y,
        0.075
      );

      const velocityX =
        current.x - previous.x;

      const velocityY =
        current.y - previous.y;

      speed = Math.sqrt(
        velocityX * velocityX +
          velocityY * velocityY
      );

      /*
       * --------------------------------------------------
       * DETERMINE FLIGHT / LANDING
       * --------------------------------------------------
       */

      const distance = Math.sqrt(
        Math.pow(target.x - current.x, 2) +
          Math.pow(target.y - current.y, 2)
      );

      const idleTime =
        time - lastPointerMove;

      if (
        hasMoved &&
        distance < 3.5 &&
        idleTime > 180
      ) {
        if (!isLanded) {
          isLanded = true;

          bee.classList.remove("bee-flying");
          bee.classList.remove("bee-landed");

          /*
           * Force re-trigger of landing animation.
           */
          void bee.offsetWidth;

          bee.classList.add("bee-landed");
        }
      } else if (speed > 0.05) {
        isLanded = false;

        bee.classList.remove("bee-landed");
        bee.classList.add("bee-flying");
      }

      /*
       * --------------------------------------------------
       * DIRECTION
       * --------------------------------------------------
       *
       * Bee rotates toward horizontal movement,
       * but only slightly.
       */
      if (speed > 0.12) {
        const targetAngle =
          clamp(
            velocityX * 2.0,
            -16,
            16
          );

        angle = lerp(
          angle,
          targetAngle,
          0.08
        );
      } else {
        angle = lerp(
          angle,
          0,
          0.08
        );
      }

      /*
       * --------------------------------------------------
       * ORGANIC FLIGHT MOTION
       * --------------------------------------------------
       *
       * The bee doesn't simply follow a straight
       * mathematical line.
       */
      const movementStrength = clamp(
        speed / 5,
        0,
        1
      );

      const horizontalDrift =
        Math.sin(time * 0.006) *
        2.8 *
        movementStrength;

      const verticalDrift =
        Math.sin(time * 0.009) *
        2.2 *
        movementStrength;

      /*
       * Small perpendicular wandering.
       */
      const sideDrift =
        Math.cos(time * 0.0045) *
        1.7 *
        movementStrength;

      /*
       * --------------------------------------------------
       * LANDING POSITION
       * --------------------------------------------------
       *
       * The bee sits ABOVE the cursor and overlaps
       * the upper half of it.
       */
      const cursorXOffset = 3;
      const cursorYOffset = -10;

      /*
       * While moving:
       * organic floating.
       *
       * While landed:
       * settle closer to cursor.
       */
      let x =
        current.x +
        cursorXOffset +
        horizontalDrift +
        sideDrift;

      let y =
        current.y +
        cursorYOffset +
        verticalDrift;

      /*
       * Landing makes the bee drop slightly onto
       * the cursor before settling.
       */
      if (isLanded) {
        const landingBob =
          Math.sin(time * 0.0045) *
          0.65;

        x =
          current.x +
          cursorXOffset;

        y =
          current.y -
          8 +
          landingBob;
      }

      /*
       * --------------------------------------------------
       * CSS VARIABLES
       * --------------------------------------------------
       */

      bee.style.setProperty(
        "--bee-x",
        `${x}px`
      );

      bee.style.setProperty(
        "--bee-y",
        `${y}px`
      );

      bee.style.setProperty(
        "--bee-rotation",
        `${angle}deg`
      );

      /*
       * Wing speed:
       *
       * flying fast  → rapid flap
       * flying slow  → gentle flap
       * landed       → almost resting flutter
       */
      let wingSpeed = "0.17s";

      if (isLanded) {
        wingSpeed = "0.42s";
      } else if (speed > 4) {
        wingSpeed = "0.07s";
      } else if (speed > 2) {
        wingSpeed = "0.10s";
      } else {
        wingSpeed = "0.15s";
      }

      bee.style.setProperty(
        "--wing-speed",
        wingSpeed
      );

      /*
       * Tiny body tilt according to movement.
       */
      bee.style.setProperty(
        "--flight-intensity",
        `${movementStrength}`
      );

      void delta;

      animationFrame =
        requestAnimationFrame(animate);
    };

    window.addEventListener(
      "pointermove",
      handlePointerMove,
      {
        passive: true,
      }
    );

    animationFrame =
      requestAnimationFrame(animate);

    return () => {
      window.removeEventListener(
        "pointermove",
        handlePointerMove
      );

      cancelAnimationFrame(
        animationFrame
      );
    };
  }, []);

  return (
    <div
      ref={beeRef}
      className="bee-cursor"
      aria-hidden="true"
    >
      <svg
        className="bee-svg"
        viewBox="0 0 30 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* BACK WING */}
        <ellipse
          className="bee-wing bee-wing-back"
          cx="10"
          cy="7"
          rx="4.7"
          ry="3.1"
          transform="rotate(-28 10 7)"
          fill="rgba(221, 211, 255, 0.55)"
          stroke="rgba(255,255,255,0.72)"
          strokeWidth="0.55"
        />

        {/* FRONT WING */}
        <ellipse
          className="bee-wing bee-wing-front"
          cx="15"
          cy="5.5"
          rx="4.9"
          ry="2.9"
          transform="rotate(20 15 5.5)"
          fill="rgba(235, 227, 255, 0.62)"
          stroke="rgba(255,255,255,0.76)"
          strokeWidth="0.55"
        />

        {/* ANTENNA LEFT */}
        <path
          d="M10.5 8C8.5 5.4 8.4 3.1 9.8 1.9"
          stroke="#F5C84B"
          strokeWidth="0.7"
          strokeLinecap="round"
        />

        {/* ANTENNA RIGHT */}
        <path
          d="M13 7.8C12.7 5.2 13.7 3.3 15.5 2.3"
          stroke="#F5C84B"
          strokeWidth="0.7"
          strokeLinecap="round"
        />

        {/* ANTENNA DOTS */}
        <circle
          cx="10"
          cy="1.8"
          r="0.65"
          fill="#F5C84B"
        />

        <circle
          cx="15.7"
          cy="2.1"
          r="0.65"
          fill="#F5C84B"
        />

        {/* BEE BODY */}
        <g className="bee-body">
          <ellipse
            cx="15"
            cy="13"
            rx="6.8"
            ry="5"
            fill="#F6C94A"
            stroke="#211B27"
            strokeWidth="0.8"
          />

          {/* STRIPES */}
          <path
            d="M11.7 9.4C10.9 11.7 11 15.2 12.2 17.2"
            stroke="#211B27"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          <path
            d="M15.4 8.1C14.9 11.2 15 15.4 15.8 17.9"
            stroke="#211B27"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          <path
            d="M19 9C18.2 11.3 18.3 14.3 19 16.4"
            stroke="#211B27"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* FACE */}
          <circle
            cx="19.4"
            cy="11.2"
            r="0.7"
            fill="#211B27"
          />

          <circle
            cx="21"
            cy="11.8"
            r="0.7"
            fill="#211B27"
          />

          {/* LITTLE SMILE */}
          <path
            d="M19.5 13.3C20.2 14.2 21.2 14.2 21.8 13.5"
            stroke="#211B27"
            strokeWidth="0.55"
            strokeLinecap="round"
          />

          {/* CHEEK */}
          <circle
            cx="18.8"
            cy="13.5"
            r="0.7"
            fill="#E993A4"
            opacity="0.6"
          />
        </g>

        {/* TINY STINGER */}
        <path
          d="M8.5 14.3L5.8 15.2L8.7 16"
          fill="#211B27"
        />
      </svg>
    </div>
  );
}