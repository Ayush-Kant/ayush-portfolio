"use client";

import type {
  PointerEventHandler,
  RefObject,
} from "react";
import {
  useEffect,
  useRef,
} from "react";

type BoxPhysics = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  angularVelocity: number;
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

const GRAVITY = 2200;
const RESTITUTION = 0.16;
const AIR_DRAG = 0.995;
const FLOOR_FRICTION = 0.82;
const WALL_BOUNCE = 0.32;
const MAX_SPEED = 1500;
const SLEEP_SPEED = 18;
const DOUBLE_PRESS_MS = 320;
const DOUBLE_PRESS_DISTANCE = 18;
const FLOOR_GAP = 14;

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
  const physicsRef =
    useRef<BoxPhysics>({
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      angle: 0,
      angularVelocity: 0,
      sleeping: true,
    });

  const draggingRef =
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

  const frameRef =
    useRef<number | null>(null);

  const sizeRef =
    useRef({
      trayWidth: 0,
      trayHeight: 0,
      boxWidth: 96,
      boxHeight: 96,
    });

  useEffect(() => {
    const tray =
      trayRef.current;

    const box =
      boxRef.current;

    if (!tray || !box) {
      return;
    }

    const physics =
      physicsRef.current;

    const syncSize = () => {
      const trayRect =
        tray.getBoundingClientRect();

      const boxRect =
        box.getBoundingClientRect();

      sizeRef.current = {
        trayWidth:
          trayRect.width,
        trayHeight:
          trayRect.height,
        boxWidth:
          boxRect.width,
        boxHeight:
          boxRect.height,
      };

      physics.x =
        clamp(
          physics.x,
          0,
          Math.max(
            0,
            trayRect.width -
              boxRect.width
          )
        );

      physics.y =
        clamp(
          physics.y,
          0,
          Math.max(
            0,
            trayRect.height -
              boxRect.height -
              FLOOR_GAP
          )
        );
    };

    const render = () => {
      box.style.transform =
        "translate3d(" +
        physics.x +
        "px, " +
        physics.y +
        "px, 0) rotate(" +
        physics.angle +
        "rad)";
    };

    const settleInitialPosition =
      () => {
        const {
          trayWidth,
          trayHeight,
          boxWidth,
          boxHeight,
        } = sizeRef.current;

        physics.x =
          Math.max(
            0,
            (trayWidth -
              boxWidth) *
              0.24
          );

        physics.y =
          Math.max(
            0,
            trayHeight * 0.26
          );

        physics.vx = 0;
        physics.vy = 0;
        physics.angle = 0;
        physics.angularVelocity = 0;
        physics.sleeping = true;

        render();
      };

    syncSize();
    settleInitialPosition();

    const resizeObserver =
      new ResizeObserver(() => {
        syncSize();
        render();
      });

    resizeObserver.observe(tray);

    const recordSample = (
      event: PointerEvent
    ) => {
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

    const beginDrag = (
      event: PointerEvent
    ) => {
      if (
        event.button !== 0
      ) {
        return;
      }

      const sample =
        recordSample(event);

      const last =
        lastPressRef.current;

      const isDoublePress =
        !!last &&
        sample.time -
          last.time <=
          DOUBLE_PRESS_MS &&
        Math.hypot(
          sample.x - last.x,
          sample.y - last.y
        ) <=
          DOUBLE_PRESS_DISTANCE;

      lastPressRef.current =
        sample;

      if (!isDoublePress) {
        return;
      }

      const pointInside =
        sample.x >= physics.x &&
        sample.x <=
          physics.x +
            sizeRef.current.boxWidth &&
        sample.y >= physics.y &&
        sample.y <=
          physics.y +
            sizeRef.current.boxHeight;

      if (!pointInside) {
        return;
      }

      event.preventDefault();

      const dragging =
        {
          pointerId:
            event.pointerId,
          offsetX:
            sample.x -
            physics.x,
          offsetY:
            sample.y -
            physics.y,
          samples: [sample],
        };

      draggingRef.current =
        dragging;

      physics.vx = 0;
      physics.vy = 0;
      physics.angularVelocity = 0;
      physics.sleeping = false;

      box.setPointerCapture?.(
        event.pointerId
      );

      box.style.zIndex = "10";

      onDraggingChange(true);
    };

    const moveDrag = (
      event: PointerEvent
    ) => {
      const dragging =
        draggingRef.current;

      if (
        !dragging ||
        dragging.pointerId !==
          event.pointerId
      ) {
        return;
      }

      const sample =
        recordSample(event);

      const {
        trayWidth,
        trayHeight,
        boxWidth,
        boxHeight,
      } = sizeRef.current;

      physics.x =
        clamp(
          sample.x -
            dragging.offsetX,
          0,
          Math.max(
            0,
            trayWidth -
              boxWidth
          )
        );

      physics.y =
        clamp(
          sample.y -
            dragging.offsetY,
          0,
          Math.max(
            0,
            trayHeight -
              boxHeight -
              FLOOR_GAP
          )
        );

      dragging.samples.push(
        sample
      );

      const cutoff =
        sample.time - 90;

      dragging.samples =
        dragging.samples.filter(
          (item) =>
            item.time >= cutoff
        );

      render();
    };

    const releaseDrag = (
      event: PointerEvent
    ) => {
      const dragging =
        draggingRef.current;

      if (
        !dragging ||
        dragging.pointerId !==
          event.pointerId
      ) {
        return;
      }

      const sample =
        recordSample(event);

      const samples = [
        ...dragging.samples,
        sample,
      ];

      const first =
        samples[0];

      const last =
        samples[
          samples.length - 1
        ];

      const dt =
        Math.max(
          16,
          last.time -
            first.time
        );

      const velocityScale =
        1000 / dt;

      physics.vx =
        clamp(
          (last.x - first.x) *
            velocityScale,
          -MAX_SPEED,
          MAX_SPEED
        );

      physics.vy =
        clamp(
          (last.y - first.y) *
            velocityScale,
          -MAX_SPEED,
          MAX_SPEED
        );

      physics.angularVelocity =
        clamp(
          physics.vx * 0.00045,
          -0.7,
          0.7
        );

      physics.sleeping = false;

      draggingRef.current =
        null;

      box.releasePointerCapture?.(
        event.pointerId
      );

      box.style.zIndex = "";

      lastPressRef.current =
        null;

      onDraggingChange(false);
    };

    let lastFrame =
      performance.now();

    const tick = (
      time: number
    ) => {
      frameRef.current =
        requestAnimationFrame(
          tick
        );

      const dt =
        Math.min(
          0.032,
          Math.max(
            0,
            (time -
              lastFrame) /
              1000
          )
        );

      lastFrame = time;

      if (
        draggingRef.current
      ) {
        render();
        return;
      }

      if (physics.sleeping) {
        return;
      }

      physics.vy +=
        GRAVITY * dt;

      physics.vx *= Math.pow(
        AIR_DRAG,
        dt * 60
      );

      physics.x +=
        physics.vx * dt;

      physics.y +=
        physics.vy * dt;

      physics.angle +=
        physics.angularVelocity *
        dt;

      const {
        trayWidth,
        trayHeight,
        boxWidth,
        boxHeight,
      } = sizeRef.current;

      const maxX =
        Math.max(
          0,
          trayWidth -
            boxWidth
        );

      const floorY =
        Math.max(
          0,
          trayHeight -
            boxHeight -
            FLOOR_GAP
        );

      if (physics.x < 0) {
        physics.x = 0;
        physics.vx =
          Math.abs(
            physics.vx
          ) *
          WALL_BOUNCE;
      }

      if (
        physics.x >
        maxX
      ) {
        physics.x = maxX;
        physics.vx =
          -Math.abs(
            physics.vx
          ) *
          WALL_BOUNCE;
      }

      if (physics.y < 0) {
        physics.y = 0;
        physics.vy =
          Math.abs(
            physics.vy
          ) *
          WALL_BOUNCE;
      }

      if (
        physics.y >=
        floorY
      ) {
        physics.y = floorY;

        if (
          Math.abs(
            physics.vy
          ) >
          42
        ) {
          physics.vy =
            -Math.abs(
              physics.vy
            ) *
            RESTITUTION;

          physics.vx *=
            FLOOR_FRICTION;

          physics.angularVelocity =
            clamp(
              physics.angularVelocity +
                physics.vx *
                  0.00025,
              -0.75,
              0.75
            );
        } else {
          physics.vy = 0;

          physics.vx *=
            0.72;

          physics.angularVelocity *=
            0.55;
        }
      }

      if (
        Math.abs(
          physics.vx
        ) <
          SLEEP_SPEED &&
        Math.abs(
          physics.vy
        ) <
          SLEEP_SPEED &&
        Math.abs(
          physics.angularVelocity
        ) <
          0.035 &&
        physics.y >=
          floorY -
            0.5
      ) {
        physics.vx = 0;
        physics.vy = 0;
        physics.angularVelocity = 0;
        physics.y = floorY;
        physics.sleeping = true;
      }

      render();
    };

    frameRef.current =
      requestAnimationFrame(
        tick
      );

    window.addEventListener(
      "pointermove",
      moveDrag,
      { passive: true }
    );

    window.addEventListener(
      "pointerup",
      releaseDrag
    );

    window.addEventListener(
      "pointercancel",
      releaseDrag
    );

    box.addEventListener(
      "pointerdown",
      beginDrag
    );

    return () => {
      resizeObserver.disconnect();

      window.removeEventListener(
        "pointermove",
        moveDrag
      );

      window.removeEventListener(
        "pointerup",
        releaseDrag
      );

      window.removeEventListener(
        "pointercancel",
        releaseDrag
      );

      box.removeEventListener(
        "pointerdown",
        beginDrag
      );

      if (
        frameRef.current !==
        null
      ) {
        cancelAnimationFrame(
          frameRef.current
        );
      }

      draggingRef.current =
        null;
      onDraggingChange(false);
    };
  }, [
    boxRef,
    onDraggingChange,
    trayRef,
  ]);

  const onPointerDown:
    PointerEventHandler<HTMLButtonElement> =
    () => {
      // The hook owns the native
      // pointer listener so that
      // the drag lifecycle stays
      // outside the presentational
      // component.
    };

  return {
    onPointerDown,
  };
}
