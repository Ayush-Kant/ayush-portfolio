"use client";

import { useEffect, useRef } from "react";

type Point = {
  x: number;
  y: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const magnitude = (x: number, y: number) =>
  Math.hypot(x, y);

export default function BeeCursor() {
  const beeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const bee = beeRef.current;
    if (!bee) return;

    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!finePointer || reducedMotion) {
      bee.style.display = "none";
      return;
    }

    /*
     * --------------------------------------------------------
     * POINTER + BEE STATE
     * --------------------------------------------------------
     *
     * The pointer is the destination.
     * The bee follows a slowly moving, curved flight target.
     */
    const pointer: Point = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };

    const previousPointer: Point = {
      x: pointer.x,
      y: pointer.y,
    };

    const position: Point = {
      x: pointer.x,
      y: pointer.y,
    };

    const previousPosition: Point = {
      x: position.x,
      y: position.y,
    };

    /*
     * Direction of the POINTER, smoothed over time.
     * Used only to shape the curved path.
     */
    let directionX = 1;
    let directionY = 0;

    let pointerSpeed = 0;
    let beeSpeed = 0;

    let flightPhase = Math.random() * Math.PI * 2;

    let lastPointerMove = performance.now();
    let lastFrame = performance.now();

    let hasPointer = false;
    let landingProgress = 0;
    let currentRotation = 0;

    let raf = 0;

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;

      pointer.x = event.clientX;
      pointer.y = event.clientY;

      const dx = pointer.x - previousPointer.x;
      const dy = pointer.y - previousPointer.y;
      const rawPointerSpeed = magnitude(dx, dy);

      pointerSpeed = rawPointerSpeed;

      if (rawPointerSpeed > 0.1) {
        const rawDirectionX = dx / rawPointerSpeed;
        const rawDirectionY = dy / rawPointerSpeed;

        directionX +=
          (rawDirectionX - directionX) * 0.18;

        directionY +=
          (rawDirectionY - directionY) * 0.18;

        const directionLength = magnitude(
          directionX,
          directionY
        );

        if (directionLength > 0.001) {
          directionX /= directionLength;
          directionY /= directionLength;
        }
      }

      previousPointer.x = pointer.x;
      previousPointer.y = pointer.y;

      lastPointerMove = performance.now();
      hasPointer = true;

      /*
       * Moving immediately cancels the landing transition.
       */
      landingProgress = Math.max(
        0,
        landingProgress - 0.18
      );

      bee.classList.remove("bee-landed");
      bee.classList.add("bee-flying");
      bee.classList.add("bee-visible");
    };

    const tick = (time: number) => {
      const dt = Math.min(
        (time - lastFrame) / 1000,
        0.033
      );

      lastFrame = time;

      /*
       * Pointer velocity is an impulse rather than a permanent
       * state. Let it decay after the mouse stops so the bee can
       * eventually transition into its resting/landing behavior.
       */
      pointerSpeed *= Math.pow(0.0008, dt);

      const idleTime =
        time - lastPointerMove;

      /*
       * --------------------------------------------------------
       * WHEN TO LAND
       * --------------------------------------------------------
       *
       * The bee is allowed to land only after:
       *
       * 1. Pointer has stopped
       * 2. Bee is already close
       * 3. There has been enough idle time
       *
       * This prevents the bee from constantly switching
       * between flight and landing while the cursor moves.
       */
      const distanceToPointer = magnitude(
        pointer.x - position.x,
        pointer.y - position.y
      );

      const canLand =
        hasPointer &&
        idleTime > 760 &&
        pointerSpeed < 0.2 &&
        distanceToPointer < 26;

      /*
       * Smooth landing rather than a sudden state switch.
       */
      const landingTarget = canLand ? 1 : 0;

      const landingResponse = canLand
        ? 0.045
        : 0.14;

      landingProgress +=
        (landingTarget - landingProgress) *
        landingResponse;

      /*
       * --------------------------------------------------------
       * CURVED FLIGHT TARGET
       * --------------------------------------------------------
       *
       * We don't chase the pointer directly.
       *
       * A small perpendicular offset creates the characteristic
       * loose, curved bee path from the reference image.
       *
       * The curve grows with pointer motion but remains bounded,
       * so it never becomes a giant whirl.
       */
      const perpendicularX = -directionY;
      const perpendicularY = directionX;

      const flightStrength = clamp(
        pointerSpeed / 8,
        0,
        1
      );

      const curveAmount =
        (4 + flightStrength * 10) *
        (1 - landingProgress);

      const slowSway =
        Math.sin(
          time * (0.0028 + flightStrength * 0.001)
          + flightPhase
        ) * curveAmount;

      const gentleLoop =
        Math.sin(
          time * 0.0019 +
            flightPhase * 0.7
        ) *
        1.8 *
        flightStrength *
        (1 - landingProgress);

      /*
       * Add a tiny trailing offset opposite to movement.
       * This makes the bee feel like it has inertia.
       */
      const lagAmount =
        (5 + flightStrength * 12) *
        (1 - landingProgress);

      const flightTargetX =
        pointer.x +
        perpendicularX * (slowSway + gentleLoop) -
        directionX * lagAmount;

      const flightTargetY =
        pointer.y +
        perpendicularY * (slowSway + gentleLoop) -
        directionY * lagAmount;

      /*
       * While landed, the flight target collapses onto
       * the cursor. This is what removes sitting jitter.
       */
      const landingX =
        pointer.x + 2;

      const landingY =
        pointer.y - 6;

      const desiredX =
        flightTargetX *
          (1 - landingProgress) +
        landingX *
          landingProgress;

      const desiredY =
        flightTargetY *
          (1 - landingProgress) +
        landingY *
          landingProgress;

      /*
       * --------------------------------------------------------
       * SLOW FOLLOW
       * --------------------------------------------------------
       *
       * Deliberately slower than the pointer.
       *
       * Faster cursor movement makes the bee take longer to
       * arrive, while slow movement allows it to settle.
       */
      const follow =
        canLand
          ? 0.075
          : 0.028 + flightStrength * 0.010;

      previousPosition.x = position.x;
      previousPosition.y = position.y;

      position.x +=
        (desiredX - position.x) *
        follow;

      position.y +=
        (desiredY - position.y) *
        follow;

      const beeVX =
        position.x - previousPosition.x;

      const beeVY =
        position.y - previousPosition.y;

      beeSpeed = magnitude(
        beeVX,
        beeVY
      );

      /*
       * --------------------------------------------------------
       * NATURAL DIRECTION / TILT
       * --------------------------------------------------------
       *
       * Less exaggerated than before.
       */
      const targetRotation =
        canLand
          ? 0
          : clamp(
              beeVX * 1.25,
              -12,
              12
            );

      currentRotation +=
        (targetRotation - currentRotation) *
        0.055;

      /*
       * --------------------------------------------------------
       * WING FLUTTER
       * --------------------------------------------------------
       *
       * We drive it from requestAnimationFrame so:
       * - fast flight = faster wing beat
       * - slow flight = slower beat
       * - landed = very gentle flutter
       */
      const visualFlight =
        clamp(
          Math.max(
            pointerSpeed,
            beeSpeed * 1.8
          ) / 7,
          0,
          1
        );

      const wingFrequency =
        landingProgress > 0.7
          ? 2.1
          : 8.5 + visualFlight * 8.5;

      flightPhase +=
        dt *
        wingFrequency *
        Math.PI *
        2;

      const wingWave =
        Math.sin(flightPhase);

      const secondWingWave =
        Math.sin(
          flightPhase +
            Math.PI * 0.78
        );

      /*
       * Small body bob only while flying.
       * It disappears almost completely while landed.
       */
      const bodyBob =
        Math.sin(time * 0.0055 + flightPhase) *
        0.45 *
        visualFlight *
        (1 - landingProgress);

      bee.style.setProperty(
        "--bee-x",
        position.x + "px"
      );

      bee.style.setProperty(
        "--bee-y",
        position.y - 8 + bodyBob + "px"
      );

      bee.style.setProperty(
        "--bee-rotation",
        currentRotation + "deg"
      );

      bee.style.setProperty(
        "--wing-left-angle",
        -22 + wingWave * 25 + "deg"
      );

      bee.style.setProperty(
        "--wing-right-angle",
        22 - secondWingWave * 25 + "deg"
      );

      bee.style.setProperty(
        "--wing-scale",
        0.88 + visualFlight * 0.12 + ""
      );

      bee.style.setProperty(
        "--landing-progress",
        landingProgress + ""
      );

      bee.classList.toggle(
        "bee-flying",
        !canLand
      );

      bee.classList.toggle(
        "bee-landed",
        landingProgress > 0.72
      );

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener(
      "pointermove",
      onPointerMove,
      { passive: true }
    );

    /*
     * Don't show the bee until the visitor has actually
     * moved the pointer.
     */
    bee.style.opacity = "0";

    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener(
        "pointermove",
        onPointerMove
      );

      cancelAnimationFrame(raf);
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
        viewBox="0 0 48 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id="beeBodyGradient"
            x1="13"
            y1="9"
            x2="39"
            y2="27"
          >
            <stop
              offset="0"
              stopColor="#FFE875"
            />
            <stop
              offset="1"
              stopColor="#F0B52E"
            />
          </linearGradient>

          <linearGradient
            id="beeWingGradient"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop
              offset="0"
              stopColor="#FFFFFF"
              stopOpacity="0.9"
            />
            <stop
              offset="0.65"
              stopColor="#E9DEFF"
              stopOpacity="0.72"
            />
            <stop
              offset="1"
              stopColor="#B59AFF"
              stopOpacity="0.28"
            />
          </linearGradient>
        </defs>

        {/* --------------------------------------------------
            REAR WING
        -------------------------------------------------- */}
        <path
          className="bee-wing bee-wing-left"
          d="M18.2 11.5C11.7 5.6 6.8 6.1 5.5 9.8C4.2 13.5 8 17.3 15.9 16.8"
          fill="url(#beeWingGradient)"
          stroke="#FFFFFF"
          strokeOpacity="0.82"
          strokeWidth="0.9"
        />

        {/* --------------------------------------------------
            FRONT WING
        -------------------------------------------------- */}
        <path
          className="bee-wing bee-wing-right"
          d="M25.2 10.5C28.4 4.3 34.6 3.2 37.2 6.2C39.8 9.3 36.3 14.1 28.9 15.3"
          fill="url(#beeWingGradient)"
          stroke="#FFFFFF"
          strokeOpacity="0.85"
          strokeWidth="0.9"
        />

        {/* Wing detail */}
        <path
          d="M8.7 10.1C11.6 9.3 14.2 10.4 16.4 12.2"
          stroke="#FFFFFF"
          strokeOpacity="0.34"
          strokeWidth="0.65"
          strokeLinecap="round"
        />

        <path
          d="M32.9 6.8C31 8.1 29.7 10.3 28.8 12.8"
          stroke="#FFFFFF"
          strokeOpacity="0.34"
          strokeWidth="0.65"
          strokeLinecap="round"
        />

        {/* --------------------------------------------------
            ANTENNAE
        -------------------------------------------------- */}
        <path
          d="M20 9.6C17.3 6.8 17.5 3.7 19.7 2"
          stroke="#26202A"
          strokeWidth="1"
          strokeLinecap="round"
        />

        <path
          d="M24.3 8.5C23.8 5.6 25.1 3.2 27.4 2.5"
          stroke="#26202A"
          strokeWidth="1"
          strokeLinecap="round"
        />

        <circle
          cx="19.6"
          cy="1.9"
          r="1.15"
          fill="#26202A"
        />

        <circle
          cx="27.7"
          cy="2.4"
          r="1.15"
          fill="#26202A"
        />

        {/* --------------------------------------------------
            HEAD
        -------------------------------------------------- */}
        <circle
          cx="31.7"
          cy="15.8"
          r="5.1"
          fill="#28202A"
        />

        {/* --------------------------------------------------
            ABDOMEN
        -------------------------------------------------- */}
        <ellipse
          cx="21.7"
          cy="18.1"
          rx="11.8"
          ry="7.5"
          fill="url(#beeBodyGradient)"
          stroke="#28202A"
          strokeWidth="1"
        />

        {/* Black stripes */}
        <path
          d="M15 11.9C13.9 14.9 14 20.7 15.3 23.7"
          stroke="#28202A"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        <path
          d="M20.7 10.7C19.8 14.7 20 22.2 21.2 25.2"
          stroke="#28202A"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        <path
          d="M26.3 11C25.2 14.4 25.5 20.2 26.8 23.8"
          stroke="#28202A"
          strokeWidth="2.4"
          strokeLinecap="round"
        />

        {/* Face */}
        <circle
          cx="30.2"
          cy="14.8"
          r="0.85"
          fill="#FFFFFF"
        />

        <circle
          cx="33.4"
          cy="14.8"
          r="0.85"
          fill="#FFFFFF"
        />

        <circle
          cx="30.25"
          cy="14.85"
          r="0.37"
          fill="#28202A"
        />

        <circle
          cx="33.45"
          cy="14.85"
          r="0.37"
          fill="#28202A"
        />

        <path
          d="M30.1 18C30.9 18.8 32.3 18.8 33.1 18"
          stroke="#FFFFFF"
          strokeOpacity="0.9"
          strokeWidth="0.65"
          strokeLinecap="round"
        />

        {/* Cheek */}
        <ellipse
          cx="29.3"
          cy="18"
          rx="1.2"
          ry="0.65"
          fill="#F08FA3"
          opacity="0.7"
        />

        {/* --------------------------------------------------
            STINGER
        -------------------------------------------------- */}
        <path
          d="M9.8 17.7L5 18.8L9.8 20.4"
          fill="#28202A"
        />
      </svg>
    </div>
  );
}
