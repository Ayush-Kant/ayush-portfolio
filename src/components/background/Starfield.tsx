"use client";

import { useEffect, useRef } from "react";

type Star = {
  radius: number;
  angle: number;
  size: number;
  baseAlpha: number;
  depth: number;
  twinkleSpeed: number;
  phase: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const randomAngle = () => Math.random() * Math.PI * 2;

const smoothstep = (edge0: number, edge1: number, value: number) => {
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
};

const createStar = (maxRadius: number): Star => {
  const depth = Math.random();

  return {
    // Start stars throughout the entire field.
    // This makes them visible immediately on first render.
    radius: Math.sqrt(Math.random()) * maxRadius * 1.08,

    angle: randomAngle(),

    // Mostly tiny stars with a few brighter/larger stars.
    size:
      Math.random() < 0.09
        ? 1.5 + Math.random() * 1.3
        : 0.45 + Math.random() * 0.95,

    baseAlpha:
      0.24 +
      Math.random() * 0.38 +
      depth * 0.18,

    // 0 = far away
    // 1 = close
    depth,

    twinkleSpeed: 0.35 + Math.random() * 1.5,
    phase: Math.random() * Math.PI * 2,
  };
};

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const context = canvas.getContext("2d", {
      alpha: true,
    });

    if (!context) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    let maxRadius = Math.hypot(width, height) * 0.68;

    let stars: Star[] = [];

    let animationFrame = 0;

    /*
     * Positive velocity = scrolling DOWN
     * Negative velocity = scrolling UP
     */
    let velocity = 0;
    let targetVelocity = 0;

    let lastScrollY = window.scrollY;

    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    let reducedMotion = reducedMotionQuery.matches;

    const getStarCount = () => {
      const areaBasedCount = Math.floor((width * height) / 6000);

      return clamp(
        areaBasedCount,
        width < 768 ? 130 : 190,
        430
      );
    };

    const createStars = () => {
      const count = getStarCount();

      stars = Array.from({ length: count }, () =>
        createStar(maxRadius)
      );
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      context.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
      );

      maxRadius = Math.hypot(width, height) * 0.68;

      createStars();
    };

    const onScroll = () => {
      const currentScrollY = window.scrollY;

      const delta = currentScrollY - lastScrollY;

      lastScrollY = currentScrollY;

      if (reducedMotion) {
        return;
      }

      /*
       * Deliberately much stronger than our first version.
       *
       * Small trackpad movement:
       *   noticeable movement
       *
       * Fast mouse-wheel:
       *   strong space-travel effect
       */
      targetVelocity = clamp(
        delta * 0.075,
        -8,
        8
      );
    };

    const onReducedMotionChange = (
      event: MediaQueryListEvent
    ) => {
      reducedMotion = event.matches;

      if (reducedMotion) {
        velocity = 0;
        targetVelocity = 0;
      }
    };

    const resetStar = (
      star: Star,
      direction: number
    ) => {
      star.angle = randomAngle();

      /*
       * DOWN:
       * Stars leave the outer boundary and
       * respawn near the center.
       *
       * UP:
       * Stars reach the center and respawn
       * near the outside.
       */
      if (direction > 0) {
        star.radius =
          maxRadius *
          (0.015 + Math.random() * 0.13);
      } else {
        star.radius =
          maxRadius *
          (0.98 + Math.random() * 0.18);
      }

      star.depth = Math.random();

      star.size =
        Math.random() < 0.09
          ? 1.5 + Math.random() * 1.3
          : 0.45 + Math.random() * 0.95;

      star.baseAlpha =
        0.24 +
        Math.random() * 0.38 +
        star.depth * 0.18;

      star.twinkleSpeed =
        0.35 + Math.random() * 1.5;

      star.phase =
        Math.random() * Math.PI * 2;
    };

    const draw = (time: number) => {
      context.clearRect(
        0,
        0,
        width,
        height
      );

      const centerX = width / 2;
      const centerY = height / 2;

      if (reducedMotion) {
        velocity = 0;
        targetVelocity = 0;
      } else {
        /*
         * Faster response to scrolling.
         */
        velocity +=
          (targetVelocity - velocity) *
          0.18;

        /*
         * Let the movement naturally decay
         * once scrolling stops.
         */
        targetVelocity *= 0.90;

        if (Math.abs(targetVelocity) < 0.01) {
          targetVelocity = 0;
        }
      }

      for (const star of stars) {
        const previousRadius = star.radius;

        /*
         * Near stars move much faster than
         * distant stars.
         */
        const depthMultiplier =
          0.75 + star.depth * 3.25;

        const movement =
          velocity * depthMultiplier;

        star.radius += movement;

        /*
         * ---------------------------------------
         * SCROLL DOWN → OUTWARD
         * ---------------------------------------
         */
        if (
          velocity > 0 &&
          star.radius > maxRadius * 1.12
        ) {
          resetStar(star, 1);
        }

        /*
         * ---------------------------------------
         * SCROLL UP → INWARD
         * ---------------------------------------
         */
        if (
          velocity < 0 &&
          star.radius < maxRadius * 0.025
        ) {
          resetStar(star, -1);
        }

        /*
         * Perspective:
         *
         * 0 = center
         * 1 = boundary
         *
         * This becomes the basis for brightness.
         */
        const radialProgress = clamp(
          star.radius / maxRadius,
          0,
          1
        );

        /*
         * Stars become progressively brighter
         * as they move toward the boundary.
         *
         * Center → subtle
         * Middle → visible
         * Edge → brightest
         */
        const edgeBrightness = smoothstep(
          0.20,
          1.0,
          radialProgress
        );

        /*
         * Gentle twinkle.
         */
        const twinkle =
          0.90 +
          Math.sin(
            time * 0.001 * star.twinkleSpeed +
              star.phase
          ) *
            0.10;

        /*
         * Combine:
         * base brightness
         * + depth
         * + boundary brightness
         * + twinkle
         */
        const brightness =
          0.65 +
          edgeBrightness * 0.60 +
          star.depth * 0.20;

        const alpha = clamp(
          star.baseAlpha *
            brightness *
            twinkle,
          0.12,
          0.98
        );

        const x =
          centerX +
          Math.cos(star.angle) *
            star.radius;

        const y =
          centerY +
          Math.sin(star.angle) *
            star.radius;

        /*
         * ---------------------------------------
         * MOTION TRAIL
         * ---------------------------------------
         *
         * Only noticeable at stronger speeds.
         */
        if (Math.abs(movement) > 0.9) {
          const previousX =
            centerX +
            Math.cos(star.angle) *
              previousRadius;

          const previousY =
            centerY +
            Math.sin(star.angle) *
              previousRadius;

          const trailStrength = clamp(
            Math.abs(movement) / 7,
            0,
            1
          );

          context.beginPath();

          context.moveTo(
            previousX,
            previousY
          );

          context.lineTo(x, y);

          context.lineWidth =
            Math.max(
              0.35,
              star.size * 0.7
            );

          context.strokeStyle = `rgba(
            255,
            255,
            255,
            ${alpha * 0.20 * trailStrength}
          )`;

          context.stroke();
        }

        /*
         * ---------------------------------------
         * STAR SIZE
         * ---------------------------------------
         */
        const sizeMultiplier =
          0.78 +
          star.depth * 0.60 +
          edgeBrightness * 0.35;

        const drawnSize =
          star.size * sizeMultiplier;

        /*
         * Main star.
         */
        context.beginPath();

        context.arc(
          x,
          y,
          drawnSize,
          0,
          Math.PI * 2
        );

        context.fillStyle = `rgba(
          255,
          255,
          255,
          ${alpha}
        )`;

        context.fill();

        /*
         * Larger / brighter stars get a
         * very subtle lavender glow.
         */
        if (
          drawnSize > 1.6 &&
          edgeBrightness > 0.55
        ) {
          context.beginPath();

          context.arc(
            x,
            y,
            drawnSize * 2.8,
            0,
            Math.PI * 2
          );

          context.fillStyle = `rgba(
            215,
            205,
            255,
            ${alpha * 0.07}
          )`;

          context.fill();
        }
      }

      animationFrame =
        requestAnimationFrame(draw);
    };

    /*
     * ---------------------------------------
     * INITIALIZATION
     * ---------------------------------------
     */

    resize();

    /*
     * Draw IMMEDIATELY once.
     *
     * This is important because we don't want
     * to wait for the first animation callback
     * just to display the initial stars.
     */
    draw(performance.now());

    window.addEventListener(
      "resize",
      resize
    );

    window.addEventListener(
      "scroll",
      onScroll,
      {
        passive: true,
      }
    );

    reducedMotionQuery.addEventListener(
      "change",
      onReducedMotionChange
    );

    return () => {
      cancelAnimationFrame(
        animationFrame
      );

      window.removeEventListener(
        "resize",
        resize
      );

      window.removeEventListener(
        "scroll",
        onScroll
      );

      reducedMotionQuery.removeEventListener(
        "change",
        onReducedMotionChange
      );
    };
  }, []);

  return (
    <div
      className="starfield-layer"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} />
    </div>
  );
}