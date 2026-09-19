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
const DOUBLE_PRESS_WINDOW_MS = 550;
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

  const armTimerRef =
    useRef<ReturnType<
      typeof setTimeout
    > | null>(null);

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

    const clearArmedState = () => {
      if (
        armTimerRef.current !==
        null
      ) {
        clearTimeout(
          armTimerRef.current
        );
      }

      armTimerRef.current = null;
      pressRef.current = null;
      onStateChange("ready");
    };

    const armForDoubleClick = (
      point: Sample
    ) => {
      if (
        armTimerRef.current !==
        null
      ) {
        clearTimeout(
          armTimerRef.current
        );
      }

      pressRef.current =
        point;

      onStateChange("armed");

      armTimerRef.current =
        setTimeout(() => {
          armTimerRef.current =
            null;

          // Only expire if the user has not
          // already started dragging.
          if (!dragRef.current) {
            pressRef.current = null;
            onStateChange("ready");
          }
        }, DOUBLE_PRESS_WINDOW_MS);
    };

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

      if (
        armTimerRef.current !==
        null
      ) {
        clearTimeout(
          armTimerRef.current
        );
        armTimerRef.current =
          null;
      }

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

      if (
        armTimerRef.current !==
        null
      ) {
        clearTimeout(
          armTimerRef.current
        );
        armTimerRef.current =
          null;
      }

      pressRef.current = null;

      try {
        box.setPointerCapture(
          event.pointerId
        );
      } catch {
        // Some pointer types do not support capture.
      }

      box.style.zIndex = "20";

      onStateChange(
        "dragging"
      );
    };

    const onPointerDown = (
      event: PointerEvent
    ) => {
      if (
        event.button !== 0
      ) {
        return;
      }

      measure();

      const point =
        pointerPoint(event);

      const previous =
        pressRef.current;

      const isDouble =
        !!previous &&
        point.time -
          previous.time <=
          DOUBLE_PRESS_WINDOW_MS &&
        Math.hypot(
          point.x -
            previous.x,
          point.y -
            previous.y
        ) <=
          DOUBLE_PRESS_DISTANCE;

      if (isDouble) {
        startDrag(
          event,
          point
        );
        return;
      }

      // Any click that isn't a valid second click
      // becomes the new first click.
      armForDoubleClick(
        point
      );
    };

    const onPointerMove = (
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

      const point =
        pointerPoint(event);

      p.x = clamp(
        point.x -
          drag.offsetX,
        0,
        Math.max(
          0,
          trayWidth -
            boxWidth
        )
      );

      p.y = clamp(
        point.y -
          drag.offsetY,
        0,
        floorY()
      );

      drag.samples.push(
        point
      );

      const cutoff =
        point.time - 100;

      while (
        drag.samples.length >
          1 &&
        drag.samples[0].time <
          cutoff
      ) {
        drag.samples.shift();
      }

      render();
    };

    const onPointerUp = (
      event: PointerEvent
    ) => {
      stopDrag(event);
      // Do not clear "armed" here.
      // The first click is intentionally kept armed
      // until the second pointerdown or timeout.
    };

    const onPointerCancel = (
      event: PointerEvent
    ) => {
      const drag =
        dragRef.current;

      if (
        drag &&
        drag.pointerId ===
          event.pointerId
      ) {
        p.vx = 0;
        p.vy = 0;
        p.spin = 0;
        p.sleeping = true;
        dragRef.current = null;
        clearArmedState();
      }
    };

    const resize =
      new ResizeObserver(() => {
        measure();
        render();
      });

    resize.observe(tray);

    measure();

    // Start exactly on the floor.
    p.x =
      Math.max(
        0,
        (trayWidth -
          boxWidth) *
          0.22
      );

    p.y =
      floorY();

    p.vx = 0;
    p.vy = 0;
    p.angle = 0;
    p.spin = 0;
    p.sleeping = true;

    render();
    onStateChange("ready");

    const tick = (
      time: number
    ) => {
      const dt =
        Math.min(
          0.032,
          Math.max(
            0,
            (time -
              previousTime) /
              1000
          )
        );

      previousTime = time;

      if (
        !dragRef.current &&
        !p.sleeping
      ) {
        p.vy +=
          GRAVITY * dt;

        p.vx *= Math.pow(
          AIR_DRAG,
          dt * 60
        );

        p.x +=
          p.vx * dt;

        p.y +=
          p.vy * dt;

        p.angle +=
          p.spin * dt;

        const maxX =
          Math.max(
            0,
            trayWidth -
              boxWidth
          );

        const floor =
          floorY();

        if (
          p.x < 0
        ) {
          p.x = 0;

          p.vx =
            Math.abs(
              p.vx
            ) *
            WALL_RESTITUTION;
        } else if (
          p.x >
          maxX
        ) {
          p.x = maxX;

          p.vx =
            -Math.abs(
              p.vx
            ) *
            WALL_RESTITUTION;
        }

        if (
          p.y >=
          floor
        ) {
          p.y = floor;

          if (
            Math.abs(
              p.vy
            ) >
            36
          ) {
            p.vy =
              -Math.abs(
                p.vy
              ) *
              RESTITUTION;

            p.vx *=
              FLOOR_FRICTION;

            p.spin =
              clamp(
                p.spin +
                  p.vx *
                    0.00024,
                -0.9,
                0.9
              );
          } else {
            p.vy = 0;

            p.vx *=
              0.64;

            p.spin *=
              0.52;
          }
        }

        if (
          Math.abs(
            p.vx
          ) <
            SLEEP_SPEED &&
          Math.abs(
            p.vy
          ) <
            SLEEP_SPEED &&
          Math.abs(
            p.spin
          ) <
            0.03 &&
          p.y >=
            floor -
              0.5
        ) {
          p.vx = 0;
          p.vy = 0;
          p.spin = 0;
          p.y = floor;
          p.sleeping =
            true;
        }

        render();
      }

      frame =
        requestAnimationFrame(
          tick
        );
    };

    frame =
      requestAnimationFrame(
        tick
      );

    window.addEventListener(
      "pointermove",
      onPointerMove,
      { passive: true }
    );

    window.addEventListener(
      "pointerup",
      onPointerUp
    );

    window.addEventListener(
      "pointercancel",
      onPointerCancel
    );

    box.addEventListener(
      "pointerdown",
      onPointerDown
    );

    return () => {
      cancelAnimationFrame(
        frame
      );

      resize.disconnect();

      if (
        armTimerRef.current !==
        null
      ) {
        clearTimeout(
          armTimerRef.current
        );
      }

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
