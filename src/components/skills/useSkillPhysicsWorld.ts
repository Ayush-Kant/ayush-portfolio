
"use client";

import {
  useEffect,
} from "react";

import type {
  RefObject,
} from "react";

import {
  applyWorldBounds,
  detectCollision,
  integrateBody,
  PHYSICS,
  resolveCollision,
  updateSleeping,
  type PhysicsSample,
  type SkillPhysicsBody,
} from "./skillPhysics";

export type SkillPhysicsBodyConfig = {
  id: string;
  boxRef:
    RefObject<HTMLButtonElement | null>;
  initialXPercent: number;
  onStateChange: (
    state:
      | "ready"
      | "dragging"
  ) => void;
};

type Args = {
  trayRef:
    RefObject<HTMLDivElement | null>;
  bodies: readonly SkillPhysicsBodyConfig[];
};

export function useSkillPhysicsWorld({
  trayRef,
  bodies: bodyConfigs,
}: Args) {
  useEffect(() => {
    const tray = trayRef.current;

    if (!tray) {
      return;
    }

    const entries = bodyConfigs
      .map((config) => {
        const element =
          config.boxRef.current;

        if (!element) {
          return null;
        }

        return {
          config,
          element,
        };
      })
      .filter(
        (
          value
        ): value is {
          config: SkillPhysicsBodyConfig;
          element: HTMLButtonElement;
        } =>
          Boolean(value)
      );

    const bodies: SkillPhysicsBody[] =
      entries.map(
        ({
          element,
        }) => ({
          id: "",
          width:
            element.offsetWidth,
          height:
            element.offsetHeight,
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          angle: 0,
          spin: 0,
          sleeping: true,
          dragging: false,
          dragPointerId: null,
          dragOffsetX: 0,
          dragOffsetY: 0,
          samples: [],
          touching: false,
        })
      );

    entries.forEach(
      (
        entry,
        index
      ) => {
        const body = bodies[index];

        if (body) {
          body.id =
            entry.config.id;
        }
      }
    );

    if (!bodies.length) {
      return;
    }

    const getTraySize = () => ({
      width: tray.clientWidth,
      height: tray.clientHeight,
    });

    const getEntry = (
      body: SkillPhysicsBody
    ) =>
      entries.find(
        (entry) =>
          entry.config.id === body.id
      );

    const renderBody = (
      body: SkillPhysicsBody
    ) => {
      const entry =
        getEntry(body);

      if (!entry) {
        return;
      }

      entry.element.style.transform =
        "translate3d(" +
        body.x +
        "px, " +
        body.y +
        "px, 0) rotate(" +
        body.angle +
        "rad)";
    };

    const measureAndPlace = () => {
      const traySize =
        getTraySize();

      bodies.forEach(
        (body, index) => {
          const entry =
            entries[index];

          if (!entry) {
            return;
          }

          body.width =
            entry.element.offsetWidth;

          body.height =
            entry.element.offsetHeight;

          body.x = clamp(
            body.x,
            0,
            Math.max(
              0,
              traySize.width -
                body.width
            )
          );

          body.y = clamp(
            body.y,
            0,
            Math.max(
              0,
              traySize.height -
                body.height
            )
          );
        }
      );
    };

    const pointerPoint = (
      event: PointerEvent
    ): PhysicsSample => {
      const rect =
        tray.getBoundingClientRect();

      return {
        x:
          event.clientX -
          rect.left,
        y:
          event.clientY -
          rect.top,
        time: performance.now(),
      };
    };

    const findBodyByPointer =
      (pointerId: number) =>
        bodies.find(
          (body) =>
            body.dragPointerId ===
            pointerId
        );

    const notify = (
      body: SkillPhysicsBody,
      state:
        | "ready"
        | "dragging"
    ) => {
      getEntry(
        body
      )?.config.onStateChange(
        state
      );
    };

    const startDrag = (
      body: SkillPhysicsBody,
      event: PointerEvent
    ) => {
      const point =
        pointerPoint(event);

      const inside =
        point.x >= body.x &&
        point.x <=
          body.x +
            body.width &&
        point.y >= body.y &&
        point.y <=
          body.y +
            body.height;

      if (!inside) {
        return;
      }

      event.preventDefault();

      body.vx = 0;
      body.vy = 0;
      body.spin = 0;
      body.sleeping = false;
      body.dragging = true;
      body.dragPointerId =
        event.pointerId;
      body.dragOffsetX =
        point.x - body.x;
      body.dragOffsetY =
        point.y - body.y;
      body.samples = [point];

      const entry = getEntry(
        body
      );

      if (entry) {
        entry.element.style.zIndex =
          "20";

        try {
          entry.element.setPointerCapture(
            event.pointerId
          );
        } catch {
          // Pointer capture is optional.
        }
      }

      notify(body, "dragging");
    };

    const stopDrag = (
      body: SkillPhysicsBody,
      event: PointerEvent
    ) => {
      if (
        body.dragPointerId !==
        event.pointerId
      ) {
        return;
      }

      const last =
        pointerPoint(event);

      const samples = [
        ...body.samples,
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

      body.vx = clamp(
        ((last.x - first.x) /
          dt) *
          1000,
        -PHYSICS.maxReleaseSpeed,
        PHYSICS.maxReleaseSpeed
      );

      body.vy = clamp(
        ((last.y - first.y) /
          dt) *
          1000,
        -PHYSICS.maxReleaseSpeed,
        PHYSICS.maxReleaseSpeed
      );

      body.spin = clamp(
        body.vx * 0.0005,
        -PHYSICS.maxSpin,
        PHYSICS.maxSpin
      );

      body.sleeping = false;
      body.dragging = false;
      body.dragPointerId =
        null;
      body.samples = [];

      const entry = getEntry(
        body
      );

      if (entry) {
        entry.element.style.zIndex =
          "";

        try {
          entry.element.releasePointerCapture(
            event.pointerId
          );
        } catch {
          // Pointer capture can already be gone.
        }
      }

      notify(body, "ready");
    };

    const onPointerMove = (
      event: PointerEvent
    ) => {
      const body =
        findBodyByPointer(
          event.pointerId
        );

      if (!body) {
        return;
      }

      const point =
        pointerPoint(event);

      const traySize =
        getTraySize();

      body.x = clamp(
        point.x -
          body.dragOffsetX,
        0,
        Math.max(
          0,
          traySize.width -
            body.width
        )
      );

      body.y = clamp(
        point.y -
          body.dragOffsetY,
        0,
        Math.max(
          0,
          traySize.height -
            body.height
        )
      );

      body.samples.push(
        point
      );

      const cutoff =
        point.time - 100;

      while (
        body.samples.length >
          1 &&
        body.samples[0].time <
          cutoff
      ) {
        body.samples.shift();
      }

      renderBody(body);
    };

    const onPointerUp = (
      event: PointerEvent
    ) => {
      const body =
        findBodyByPointer(
          event.pointerId
        );

      if (body) {
        stopDrag(
          body,
          event
        );
      }
    };

    const onPointerCancel = (
      event: PointerEvent
    ) => {
      const body =
        findBodyByPointer(
          event.pointerId
        );

      if (!body) {
        return;
      }

      body.vx = 0;
      body.vy = 0;
      body.spin = 0;
      body.sleeping = true;
      body.dragging = false;
      body.dragPointerId =
        null;
      body.samples = [];

      const entry = getEntry(
        body
      );

      if (entry) {
        entry.element.style.zIndex =
          "";

        try {
          entry.element.releasePointerCapture(
            event.pointerId
          );
        } catch {
          // Pointer capture can already be gone.
        }
      }

      notify(body, "ready");
    };

    const pointerDownHandlers =
      new Map<
        SkillPhysicsBody,
        (event: PointerEvent) => void
      >();

    entries.forEach(
      (
        entry,
        index
      ) => {
        const body = bodies[index];

        if (!body) {
          return;
        }

        const handler = (
          event: PointerEvent
        ) => {
          if (event.button !== 0) {
            return;
          }

          startDrag(
            body,
            event
          );
        };

        pointerDownHandlers.set(
          body,
          handler
        );

        entry.element.addEventListener(
          "pointerdown",
          handler
        );
      }
    );

    const initialTraySize =
      getTraySize();

    entries.forEach(
      (
        entry,
        index
      ) => {
        const body = bodies[index];

        if (!body) {
          return;
        }

        body.x =
          Math.max(
            0,
            (initialTraySize.width -
              body.width) *
              entry.config
                .initialXPercent
          );

        body.y =
          Math.max(
            0,
            initialTraySize.height -
              body.height
          );

        body.vx = 0;
        body.vy = 0;
        body.angle = 0;
        body.spin = 0;
        body.sleeping = true;

        renderBody(body);

        entry.config.onStateChange(
          "ready"
        );
      }
    );

    const resize =
      new ResizeObserver(() => {
        measureAndPlace();

        bodies.forEach(
          renderBody
        );
      });

    resize.observe(tray);

    let frame = 0;
    let previousTime =
      performance.now();

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

      const traySize =
        getTraySize();

      bodies.forEach(
        (body) => {
          body.touching = false;

          integrateBody(
            body,
            dt
          );

          applyWorldBounds(
            body,
            traySize.width,
            traySize.height
          );
        }
      );

      for (
        let iteration = 0;
        iteration <
        PHYSICS.solverIterations;
        iteration += 1
      ) {
        for (
          let i = 0;
          i < bodies.length;
          i += 1
        ) {
          for (
            let j = i + 1;
            j < bodies.length;
            j += 1
          ) {
            const a = bodies[i];
            const b = bodies[j];

            if (!a || !b) {
              continue;
            }

            const collision =
              detectCollision(
                a,
                b
              );

            if (collision) {
              resolveCollision(
                a,
                b,
                collision
              );
            }
          }
        }
      }

      bodies.forEach(
        (body) => {
          applyWorldBounds(
            body,
            traySize.width,
            traySize.height
          );

          updateSleeping(body);
          renderBody(body);
        }
      );

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

    return () => {
      cancelAnimationFrame(
        frame
      );

      resize.disconnect();

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

      entries.forEach(
        (
          entry,
          index
        ) => {
          const body = bodies[index];

          if (!body) {
            return;
          }

          const handler =
            pointerDownHandlers.get(
              body
            );

          if (handler) {
            entry.element.removeEventListener(
              "pointerdown",
              handler
            );
          }
        }
      );
    };
  }, [
    bodyConfigs,
    trayRef,
  ]);
}

function clamp(
  value: number,
  min: number,
  max: number
) {
  return Math.max(
    min,
    Math.min(max, value)
  );
}
