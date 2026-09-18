"use client";

import { useEffect, useRef } from "react";

type Point = {
  x: number;
  y: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const distanceBetween = (a: Point, b: Point) =>
  Math.hypot(a.x - b.x, a.y - b.y);

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

    const pointer: Point = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };

    const position: Point = {
      x: pointer.x,
      y: pointer.y,
    };

    const lastPosition: Point = {
      x: position.x,
      y: position.y,
    };

    let hasPointer = false;
    let lastPointerMove = performance.now();
    let lastFrame = performance.now();
    let raf = 0;
    let flapTime = 0;
    let rotation = 0;
    let landingProgress = 0;

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;

      pointer.x = event.clientX;
      pointer.y = event.clientY;
      hasPointer = true;
      lastPointerMove = performance.now();
      landingProgress = 0;

      bee.classList.remove("bee-landed");
      bee.classList.add("bee-flying");
    };

    const tick = (time: number) => {
      const dt = Math.min((time - lastFrame) / 1000, 0.033);
      lastFrame = time;

      const idle = time - lastPointerMove;
      const distance = distanceBetween(position, pointer);
      const landingTarget = hasPointer && idle > 520 && distance < 18;

      landingProgress +=
        ((landingTarget ? 1 : 0) - landingProgress) *
        (landingTarget ? 0.055 : 0.18);

      const follow = landingTarget ? 0.085 : 0.055;

      position.x += (pointer.x - position.x) * follow;
      position.y += (pointer.y - position.y) * follow;

      const vx = position.x - lastPosition.x;
      const vy = position.y - lastPosition.y;

      lastPosition.x = position.x;
      lastPosition.y = position.y;

      const speed = Math.hypot(vx, vy);
      const flight = clamp(speed / 4.8, 0, 1);

      const wanderX =
        Math.sin(time * (0.0055 + flight * 0.0025)) *
        (2.2 + flight * 3.8);

      const wanderY =
        Math.cos(time * (0.0068 + flight * 0.0024)) *
        (1.6 + flight * 3.0);

      const microX =
        Math.sin(time * 0.0125) * (0.4 + flight * 0.8);

      const microY =
        Math.sin(time * 0.0091) * (0.35 + flight * 0.65);

      const desiredRotation =
        clamp(vx * 1.8, -17, 17) * (1 - landingProgress);

      rotation += (desiredRotation - rotation) * 0.08;

      const landingXOffset = 2;
      const flyingX = position.x + landingXOffset + wanderX + microX;
      const flyingY = position.y - 8 + wanderY + microY;

      const landedX = position.x + landingXOffset;
      const landedY =
        position.y -
        7 +
        Math.sin(time * 0.0045) * 0.45;

      const x =
        flyingX * (1 - landingProgress) +
        landedX * landingProgress;

      const y =
        flyingY * (1 - landingProgress) +
        landedY * landingProgress;

      const flightLift =
        Math.min(2.5, speed * 0.35) * (1 - landingProgress);

      const wingFrequency =
        landingProgress > 0.75 ? 2.5 : 9 + flight * 13;

      flapTime += dt * wingFrequency * Math.PI * 2;

      const wingPhase = Math.sin(flapTime);
      const wingPhaseOffset = Math.sin(
        flapTime + Math.PI * 0.85
      );

      bee.style.setProperty("--bee-x", x + "px");
      bee.style.setProperty(
        "--bee-y",
        y - flightLift + "px"
      );
      bee.style.setProperty(
        "--bee-rotation",
        rotation + "deg"
      );
      bee.style.setProperty(
        "--wing-angle",
        -48 + (wingPhase + 1) * 34 + "deg"
      );
      bee.style.setProperty(
        "--wing-angle-secondary",
        42 - (wingPhaseOffset + 1) * 28 + "deg"
      );
      bee.style.setProperty(
        "--wing-scale",
        0.72 + flight * 0.28 + ""
      );

      bee.classList.toggle("bee-flying", !landingTarget);
      bee.classList.toggle(
        "bee-landed",
        landingProgress > 0.72
      );

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onPointerMove, {
      passive: true,
    });

    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
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
        viewBox="0 0 44 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id="beeBodyGradient"
            x1="9"
            y1="7"
            x2="34"
            y2="28"
          >
            <stop offset="0" stopColor="#FFE36A" />
            <stop offset="1" stopColor="#F2B632" />
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
              stopColor="#F2EFFF"
              stopOpacity="0.78"
            />
            <stop
              offset="1"
              stopColor="#BDA8FF"
              stopOpacity="0.35"
            />
          </linearGradient>
        </defs>

        <ellipse
          className="bee-wing bee-wing-rear"
          cx="13"
          cy="9"
          rx="8"
          ry="4.8"
          transform="rotate(-28 13 9)"
          fill="url(#beeWingGradient)"
          stroke="#F8F5FF"
          strokeOpacity="0.75"
          strokeWidth="0.8"
        />

        <ellipse
          className="bee-wing bee-wing-front"
          cx="23"
          cy="7.5"
          rx="8.4"
          ry="4.9"
          transform="rotate(23 23 7.5)"
          fill="url(#beeWingGradient)"
          stroke="#FFFFFF"
          strokeOpacity="0.8"
          strokeWidth="0.8"
        />

        <path
          d="M16 10C13.8 6.6 13.5 4.3 15.7 2.8"
          stroke="#D8B23C"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          d="M21 9.6C20.8 6 22.3 3.8 24.6 3"
          stroke="#D8B23C"
          strokeWidth="1"
          strokeLinecap="round"
        />

        <circle cx="15.7" cy="2.7" r="1.05" fill="#F6D05B" />
        <circle cx="24.8" cy="2.9" r="1.05" fill="#F6D05B" />

        <g className="bee-body">
          <ellipse
            cx="21.5"
            cy="18"
            rx="12.2"
            ry="8"
            fill="url(#beeBodyGradient)"
            stroke="#241B22"
            strokeWidth="1.15"
          />

          <path
            d="M15 11.8C14 15.4 14.3 21 16.2 24"
            stroke="#241B22"
            strokeWidth="2.45"
            strokeLinecap="round"
          />
          <path
            d="M21 10.4C20.1 14.5 20.4 21.7 21.9 25.6"
            stroke="#241B22"
            strokeWidth="2.45"
            strokeLinecap="round"
          />
          <path
            d="M27 11.7C26 15 26.3 20.5 27.4 23.8"
            stroke="#241B22"
            strokeWidth="2.4"
            strokeLinecap="round"
          />

          <circle cx="29.5" cy="15.9" r="1.05" fill="#241B22" />
          <circle cx="32.2" cy="16.8" r="1.05" fill="#241B22" />

          <path
            d="M29.4 19.1C30.5 20.4 32.1 20.5 33.2 19.5"
            stroke="#241B22"
            strokeWidth="0.95"
            strokeLinecap="round"
          />

          <ellipse
            cx="28.6"
            cy="18.9"
            rx="1.15"
            ry="0.72"
            fill="#E891A2"
            opacity="0.65"
          />
        </g>

        <path
          d="M9.8 19.3L5.1 20.3L9.9 21.8"
          fill="#241B22"
        />
      </svg>
    </div>
  );
}
