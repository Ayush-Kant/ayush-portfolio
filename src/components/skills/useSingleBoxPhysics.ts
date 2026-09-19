"use client";

import {
  useEffect,
  useRef,
} from "react";

import type { RefObject } from "react";

type PhysicsState = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  spin: number;
  sleeping: boolean;
};

type PointerSample = {
  x: number;
  y: number;
  time: number;
};

type UseSingleBoxPhysicsArgs = {
  trayRef:
    RefObject<HTMLDivElement | null>;
  boxRef:
    RefObject<HTMLButtonElement | null>;
  onDraggingChange:
    (dragging: boolean) => void;
};

const GRAVITY = 1800;
const BOUNCE = 0.15;
const AIR_DRAG = 0.992;
const FLOOR_FRICTION = 0.72;
const WALL_BOUNCE = 0.3;
const FLOOR_GAP = 14;
const MAX_SPEED = 1500;
const SLEEP_SPEED = 16;
const DOUBLE_PRESS_MS = 320;
const DOUBLE_PRESS_DISTANCE = 18;

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
  onDraggingChange,
}: UseSingleBoxPhysicsArgs) {
  const stateRef =
    useRef<PhysicsState>({
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      angle: 0,
      spin: 0,
      sleeping: true,
    });

  const dragRef =
    useRef<{
      pointerId: number;
      offsetX: number;
      offsetY: number;
      samples: PointerSample[];
    } | null>(null);

  const lastPressRef =
    useRef<PointerSample | null>(
      null
    );

  useEffect(() => {
    const tray = trayRef.current;
    const box = boxRef.current;

    if (!tray || !box) return;

    const state = stateRef.current;
    let trayWidth = 0;
    let trayHeight = 0;
    let boxWidth = 0;
    let boxHeight = 0;
    let raf = 0;
    let lastFrame = performance.now();

    const measure = () => {
      const trayRect =
        tray.getBoundingClientRect();
      const boxRect =
        box.getBoundingClientRect();

      trayWidth = trayRect.width;
      trayHeight = trayRect.height;
      boxWidth = boxRect.width;
      boxHeight = boxRect.height;

      state.x = clamp(
        state.x,
        0,
        Math.max(0, trayWidth - boxWidth)
      );

      state.y = clamp(
        state.y,
        0,
        Math.max(
          0,
          trayHeight -
            boxHeight -
            FLOOR_GAP
        )
      );
    };

    const render = () => {
      box.style.transform =
        `translate3d(${state.x}px, ${state.y}px, 0) rotate(${state.angle}rad)`;
    };

    const floorY = () =>
      Math.max(
        0,
        trayHeight -
          boxHeight -
          FLOOR_GAP
      );

    const pointFromEvent = (
      event: PointerEvent
    ): PointerSample => {
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

    const release = (
      event: PointerEvent
    ) => {
      const drag = dragRef.current;

      if (
        !drag ||
        drag.pointerId !==
          event.pointerId
      ) {
        return;
      }

      const last =
        pointFromEvent(event);

      const samples = [
        ...drag.samples,
        last,
      ];

      const first =
        samples[0];

      const dt = Math.max(
        16,
        last.time - first.time
      );

      state.vx = clamp(
        ((last.x - first.x) /
          dt) *
          1000,
        -MAX_SPEED,
        MAX_SPEED
      );

      state.vy = clamp(
        ((last.y - first.y) /
          dt) *
          1000,
        -MAX_SPEED,
        MAX_SPEED
      );

      state.spin = clamp(
        state.vx * 0.00042,
        -0.7,
        0.7
      );

      state.sleeping = false;
      dragRef.current = null;
      lastPressRef.current = null;

      try {
        box.releasePointerCapture(
          event.pointerId
        );
      } catch {
        // Capture may already be released.
      }

      box.style.zIndex = "";
      onDraggingChange(false);
    };

    const onDown = (
      event: PointerEvent
    ) => {
      if (event.button !== 0) return;

      measure();

      const point =
        pointFromEvent(event);

      const last =
        lastPressRef.current;

      const doublePress =
        !!last &&
        point.time - last.time <=
          DOUBLE_PRESS_MS &&
        Math.hypot(
          point.x - last.x,
          point.y - last.y
        ) <=
          DOUBLE_PRESS_DISTANCE;

      lastPressRef.current =
        point;

      if (!doublePress) return;

      const inside =
        point.x >= state.x &&
        point.x <=
          state.x + boxWidth &&
        point.y >= state.y &&
        point.y <=
          state.y + boxHeight;

      if (!inside) return;

      event.preventDefault();

      state.vx = 0;
      state.vy = 0;
      state.spin = 0;
      state.sleeping = false;

      dragRef.current = {
        pointerId:
          event.pointerId,
        offsetX:
          point.x - state.x,
        offsetY:
          point.y - state.y,
        samples: [point],
      };

      box.setPointerCapture?.(
        event.pointerId
      );

      box.style.zIndex = "10";
      onDraggingChange(true);
    };

    const onMove = (
      event: PointerEvent
    ) => {
      const drag = dragRef.current;

      if (
        !drag ||
        drag.pointerId !==
          event.pointerId
      ) {
        return;
      }

      const point =
        pointFromEvent(event);

      state.x = clamp(
        point.x - drag.offsetX,
        0,
        Math.max(0, trayWidth - boxWidth)
      );

      state.y = clamp(
        point.y - drag.offsetY,
        0,
        floorY()
      );

      drag.samples.push(point);

      const cutoff =
        point.time - 90;

      while (
        drag.samples.length > 1 &&
        drag.samples[0].time < cutoff
      ) {
        drag.samples.shift();
      }

      render();
    };

    const onUp = (
      event: PointerEvent
    ) => release(event);

    const onResize =
      new ResizeObserver(() => {
        measure();
        render();
      });

    onResize.observe(tray);

    box.addEventListener(
      "pointerdown",
      onDown
    );

    window.addEventListener(
      "pointermove",
      onMove,
      { passive: true }
    );

    window.addEventListener(
      "pointerup",
      onUp
    );

    window.addEventListener(
      "pointercancel",
      onUp
    );

    measure();

    state.x =
      Math.max(
        0,
        (trayWidth - boxWidth) *
          0.22
      );

    state.y =
      Math.max(
        0,
        floorY() -
          42
      );

    render();

    const tick = (
      time: number
    ) => {
      const dt =
        Math.min(
          0.032,
          Math.max(
            0,
            (time - lastFrame) /
              1000
          )
        );

      lastFrame = time;

      if (!dragRef.current &&
          !state.sleeping) {
        state.vy +=
          GRAVITY * dt;

        state.vx *= Math.pow(
          AIR_DRAG,
          dt * 60
        );

        state.x +=
          state.vx * dt;

        state.y +=
          state.vy * dt;

        state.angle +=
          state.spin * dt;

        const maxX =
          Math.max(
            0,
            trayWidth - boxWidth
          );

        const floor =
          floorY();

        if (state.x < 0) {
          state.x = 0;
          state.vx =
            Math.abs(
              state.vx
            ) *
            WALL_BOUNCE;
        } else if (
          state.x > maxX
        ) {
          state.x = maxX;
          state.vx =
            -Math.abs(
              state.vx
            ) *
            WALL_BOUNCE;
        }

        if (state.y >= floor) {
          state.y = floor;

          if (
            Math.abs(state.vy) >
            40
          ) {
            state.vy =
              -Math.abs(
                state.vy
              ) *
              BOUNCE;

            state.vx *=
              FLOOR_FRICTION;

            state.spin =
              clamp(
                state.spin +
                  state.vx *
                    0.0002,
                -0.7,
                0.7
              );
          } else {
            state.vy = 0;
            state.vx *=
              0.64;
            state.spin *=
              0.5;
          }
        }

        if (
          Math.abs(state.vx) <
            SLEEP_SPEED &&
          Math.abs(state.vy) <
            SLEEP_SPEED &&
          Math.abs(state.spin) <
            0.03 &&
          state.y >=
            floor - 0.5
        ) {
          state.vx = 0;
          state.vy = 0;
          state.spin = 0;
          state.y = floor;
          state.sleeping = true;
        }

        render();
      }

      raf =
        requestAnimationFrame(
          tick
        );
    };

    raf =
      requestAnimationFrame(
        tick
      );

    return () => {
      cancelAnimationFrame(
        raf
      );

      onResize.disconnect();

      box.removeEventListener(
        "pointerdown",
        onDown
      );

      window.removeEventListener(
        "pointermove",
        onMove
      );

      window.removeEventListener(
        "pointerup",
        onUp
      );

      window.removeEventListener(
        "pointercancel",
        onUp
      );

      onDraggingChange(false);
    };
  }, [
    boxRef,
    onDraggingChange,
    trayRef,
  ]);
}
