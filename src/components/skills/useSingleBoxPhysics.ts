"use client";

import {
  useEffect,
  useRef,
} from "react";

import type {
  RefObject,
} from "react";

type Physics = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  spin: number;
  sleeping: boolean;
};

type Sample = {
  x: number;
  y: number;
  time: number;
};

type Args = {
  trayRef: RefObject<HTMLDivElement | null>;
  boxRef: RefObject<HTMLButtonElement | null>;
  onStateChange: (
    state:
      | "ready"
      | "armed"
      | "dragging"
  ) => void;
};

const GRAVITY = 1850;
const RESTITUTION = 0.18;
const AIR_DRAG = 0.994;
const FLOOR_FRICTION = 0.78;
const WALL_RESTITUTION = 0.32;
const MAX_RELEASE_SPEED = 1350;
const SLEEP_SPEED = 14;

// A forgiving double-click window that still feels
// like a normal mouse double-click.
const DOUBLE_PRESS_WINDOW_MS = 800;
const DOUBLE_PRESS_DISTANCE = 40;

const clamp = (
  value: number,
  min: number,
  max: number
) =>
  Math.max(
    min,
    Math.min(max, value)
  );

export function useSingleBoxPhysics({
  trayRef,
  boxRef,
  onStateChange,
}: Args) {
  const physicsRef =
    useRef<Physics>({
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      angle: 0,
      spin: 0,
      sleeping: true,
    });

  const pressRef =
    useRef<Sample | null>(null);

  const dragRef =
    useRef<{
      pointerId: number;
      offsetX: number;
      offsetY: number;
      samples: Sample[];
    } | null>(null);

  useEffect(() => {
    const tray = trayRef.current;
    const box = boxRef.current;

    if (!tray || !box) return;

    const p =
      physicsRef.current;

    let trayWidth = 0;
    let trayHeight = 0;
    let boxWidth = 0;
    let boxHeight = 0;
    let frame = 0;
    let previousTime =
      performance.now();

    const measure = () => {
      const trayRect =
        tray.getBoundingClientRect();

      const boxRect =
        box.getBoundingClientRect();

      trayWidth =
        trayRect.width;

      trayHeight =
        trayRect.height;

      boxWidth =
        boxRect.width;

      boxHeight =
        boxRect.height;

      p.x = clamp(
        p.x,
        0,
        Math.max(
          0,
          trayWidth -
            boxWidth
        )
      );

      p.y = clamp(
        p.y,
        0,
        floorY()
      );
    };

    const floorY = () =>
      Math.max(
        0,
        trayHeight -
          boxHeight
      );

    const pointerPoint = (
      event: PointerEvent
    ): Sample => {
      const rect =
        tray.getBoundingClientRect();

      return {
        x:
          event.clientX -
          rect.left,

        y:
          event.clientY -
          rect.top,

        time:
          performance.now(),
      };
    };

    const render = () => {
      box.style.transform =
        `translate3d(
          ${p.x}px,
          ${p.y}px,
          0
        ) rotate(
          ${p.angle}rad
        )`;
    };

    const stopDrag = (
      event: PointerEvent
    ) => {
      const drag =
        dragRef.current;

      if (
        !drag ||
        drag.pointerId !==
          event.pointerId
      ) {
        return;
      }

      const last =
        pointerPoint(event);

      const samples = [
        ...drag.samples,
        last,
      ];

      const first =
        samples[0];

      const dt =
        Math.max(
          16,
          last.time -
            first.time
        );

      p.vx = clamp(
        ((last.x - first.x) /
          dt) *
          1000,
        -MAX_RELEASE_SPEED,
        MAX_RELEASE_SPEED
      );

      p.vy = clamp(
        ((last.y - first.y) /
          dt) *
          1000,
        -MAX_RELEASE_SPEED,
        MAX_RELEASE_SPEED
      );

      p.spin = clamp(
        p.vx * 0.0005,
        -0.9,
        0.9
      );

      p.sleeping = false;

      dragRef.current = null;
      pressRef.current = null;

      try {
        box.releasePointerCapture(
          event.pointerId
        );
      } catch {
        // Pointer capture may already be gone.
      }

      box.style.zIndex = "";
      onStateChange("ready");
    };

    const startDrag = (
      event: PointerEvent,
      firstPoint: Sample
    ) => {
      const inside =
        firstPoint.x >= p.x &&
        firstPoint.x <=
          p.x + boxWidth &&
        firstPoint.y >= p.y &&
        firstPoint.y <=
          p.y + boxHeight;

      if (!inside) {
        return;
      }

      event.preventDefault();

      p.vx = 0;
      p.vy = 0;
      p.spin = 0;
      p.sleeping = false;

      dragRef.current = {
        pointerId:
          event.pointerId,

        offsetX:
          firstPoint.x - p.x,

        offsetY:
          firstPoint.y - p.y,

        samples: [
          firstPoint,
        ],
      };

      window.removeEventListener(
        "pointermove",
        onPointerMove
      );

      window.removeEventListener(
        "pointerup",
        onPointerUp
      );

      window.removeEventListener(
        "pointercancel",
        onPointerCancel
      );

      box.removeEventListener(
        "pointerdown",
        onPointerDown
      );

      dragRef.current = null;
      pressRef.current = null;
    };
  }, [
    boxRef,
    onStateChange,
    trayRef,
  ]);
}
