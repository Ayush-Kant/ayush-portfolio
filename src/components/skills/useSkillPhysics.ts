"use client";

import type { PointerEvent as ReactPointerEvent, RefObject } from "react";
import {
  useCallback,
  useEffect,
  useRef,
} from "react";

import {
  Bodies,
  Body,
  Composite,
  Constraint,
  Engine,
  Query,
} from "matter-js";

import { PHYSICS } from "./physics.config";

type PointerSample = {
  x: number;
  y: number;
  time: number;
};

type SkillBody = {
  element: HTMLElement;
  body: Body | null;
  width: number;
  height: number;
};

type UseSkillPhysicsArgs = {
  stageRef: RefObject<HTMLDivElement | null>;
};

export function useSkillPhysics({
  stageRef,
}: UseSkillPhysicsArgs) {
  const engineRef =
    useRef<Engine | null>(null);

  const bodiesRef =
    useRef<Map<string, SkillBody>>(
      new Map()
    );

  const wallsRef =
    useRef<Body[]>([]);

  const dragRef =
    useRef<{
      body: Body;
      anchor: Body;
      constraint: Constraint;
      pointerId: number;
      history: PointerSample[];
    } | null>(null);

  const initialRef =
    useRef(
      new Map<
        string,
        {
          x: number;
          y: number;
        }
      >()
    );

  const readyRef =
    useRef(false);

  const visibleRef =
    useRef(false);

  const pageVisibleRef =
    useRef(
      typeof document === "undefined" ||
        document.visibilityState ===
          "visible"
    );

  const setCardRef =
    useCallback(
      (id: string) =>
        (node: HTMLButtonElement | null) => {
          if (!node) {
            bodiesRef.current.delete(id);
            return;
          }

          const existing =
            bodiesRef.current.get(id);

          bodiesRef.current.set(id, {
            element: node,
            body:
              existing?.body ??
              null,
            width:
              existing?.width ??
              PHYSICS.cardWidth,
            height:
              existing?.height ??
              PHYSICS.cardHeight,
          });
        },
      []
    );

  const getSize =
    useCallback(() => {
      const stage =
        stageRef.current;

      if (!stage) return null;

      const rect =
        stage.getBoundingClientRect();

      return {
        width: rect.width,
        height: rect.height,
      };
    }, [stageRef]);

  const render =
    useCallback(() => {
      bodiesRef.current.forEach(
        (item) => {
          if (!item.body) return;

          const x =
            item.body.position.x -
            item.width / 2;

          const y =
            item.body.position.y -
            item.height / 2;

          item.element.style.transform =
            `translate3d(${x}px, ${y}px, 0) rotate(${item.body.angle}rad)`;
        }
      );
    }, []);

  const createWalls =
    useCallback(() => {
      const engine =
        engineRef.current;

      const size =
        getSize();

      if (!engine || !size) {
        return;
      }

      Composite.remove(
        engine.world,
        wallsRef.current
      );

      const thickness =
        PHYSICS.wallThickness;

      const floorY =
        size.height -
        PHYSICS.floorGap;

      wallsRef.current = [
        Bodies.rectangle(
          size.width / 2,
          floorY +
            thickness / 2,
          size.width +
            thickness * 2,
          thickness,
          {
            isStatic: true,
            friction:
              PHYSICS.friction,
            restitution:
              PHYSICS.restitution,
          }
        ),
        Bodies.rectangle(
          -thickness / 2,
          size.height / 2,
          thickness,
          size.height,
          { isStatic: true }
        ),
        Bodies.rectangle(
          size.width +
            thickness / 2,
          size.height / 2,
          thickness,
          size.height,
          { isStatic: true }
        ),
      ];

      Composite.add(
        engine.world,
        wallsRef.current
      );
    }, [getSize]);

  const initialize =
    useCallback(() => {
      const engine =
        engineRef.current;

      const size =
        getSize();

      if (!engine || !size) {
        return;
      }

      bodiesRef.current.forEach(
        (item, index) => {
          const width =
            Math.max(
              PHYSICS.cardWidth,
              Math.min(
                178,
                86 +
                  item.element.textContent!
                    .trim()
                    .length *
                    6.2
              )
            );

          const height =
            PHYSICS.cardHeight;

          const columns =
            Math.max(
              3,
              Math.floor(
                size.width /
                  (width + 14)
              )
            );

          const row =
            Math.floor(
              index / columns
            );

          const column =
            index % columns;

          const x =
            Math.min(
              82 +
                column *
                  (width + 14),
              size.width -
                width / 2 -
                18
            );

          const y =
            Math.min(
              72 +
                row *
                  (height + 16),
              size.height * 0.58
            );

          const body =
            Bodies.rectangle(
              x,
              y,
              width,
              height,
              {
                restitution:
                  PHYSICS.restitution,
                friction:
                  PHYSICS.friction,
                frictionAir:
                  PHYSICS.frictionAir,
                density:
                  PHYSICS.density,
                chamfer: {
                  radius: 12,
                },
              }
            );

          item.body = body;
          item.width = width;
          item.height = height;

          initialRef.current.set(
            item.element.dataset.skillId!,
            { x, y }
          );

          Composite.add(
            engine.world,
            body
          );
        }
      );

      createWalls();
      readyRef.current = true;
      render();
    }, [
      createWalls,
      getSize,
      render,
    ]);

  const release =
    useCallback(() => {
      const drag =
        dragRef.current;

      const engine =
        engineRef.current;

      if (!drag || !engine) {
        return;
      }

      const samples =
        drag.history;

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

      const clamp =
        (value: number) =>
          Math.max(
            -PHYSICS.maxReleaseVelocity,
            Math.min(
              PHYSICS.maxReleaseVelocity,
              value
            )
          );

      const vx =
        ((last.x - first.x) /
          dt) *
        1000 *
        PHYSICS.releaseVelocityScale;

      const vy =
        ((last.y - first.y) /
          dt) *
        1000 *
        PHYSICS.releaseVelocityScale;

      Body.setVelocity(
        drag.body,
        {
          x: clamp(vx),
          y: clamp(vy),
        }
      );

      Body.setAngularVelocity(
        drag.body,
        clamp(
          vx * 0.00012
        )
      );

      Composite.remove(
        engine.world,
        drag.constraint
      );

      Composite.remove(
        engine.world,
        drag.anchor
      );

      dragRef.current =
        null;
    }, []);

  const pointerDown =
    useCallback(
      (
        id: string,
        event: globalThis.PointerEvent
      ) => {
        const engine =
          engineRef.current;

        const stage =
          stageRef.current;

        const item =
          bodiesRef.current.get(id);

        if (
          !engine ||
          !stage ||
          !item?.body ||
          event.button !== 0
        ) {
          return;
        }

        const rect =
          stage.getBoundingClientRect();

        const point = {
          x:
            event.clientX -
            rect.left,
          y:
            event.clientY -
            rect.top,
        };

        if (
          !Query.point(
            [item.body],
            point
          ).length
        ) {
          return;
        }

        release();

        Body.setVelocity(
          item.body,
          { x: 0, y: 0 }
        );

        Body.setAngularVelocity(
          item.body,
          0
        );

        Body.setSleeping(
          item.body,
          false
        );

        const anchor =
          Bodies.circle(
            point.x,
            point.y,
            3,
            {
              isStatic: true,
              collisionFilter: {
                mask: 0,
              },
            }
          );

        const constraint =
          Constraint.create({
            bodyA: item.body,
            bodyB: anchor,
            length: 0,
            stiffness:
              PHYSICS.stiffness,
            damping:
              PHYSICS.damping,
          });

        Composite.add(
          engine.world,
          [
            anchor,
            constraint,
          ]
        );

        dragRef.current = {
          body:
            item.body,
          anchor,
          constraint,
          pointerId:
            event.pointerId,
          history: [
            {
              x: point.x,
              y: point.y,
              time:
                performance.now(),
            },
          ],
        };
      },
      [release, stageRef]
    );

  useEffect(() => {
    const stage =
      stageRef.current;

    if (!stage) return;

    const engine =
      Engine.create({
        enableSleeping:
          true,
      });

    engine.gravity.y =
      PHYSICS.gravity;

    engineRef.current =
      engine;

    const start =
      () => {
        if (
          readyRef.current ||
          !visibleRef.current
        ) {
          return;
        }

        initialize();
      };

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          visibleRef.current =
            entry.isIntersecting;

          start();
        },
        {
          threshold: 0.05,
        }
      );

    observer.observe(stage);

    const resize =
      new ResizeObserver(() => {
        if (!readyRef.current) {
          start();
          return;
        }

        createWalls();
      });

    resize.observe(stage);

    const onVisibility =
      () => {
        pageVisibleRef.current =
          document.visibilityState ===
          "visible";
      };

    document.addEventListener(
      "visibilitychange",
      onVisibility
    );

    const onMove =
      (event: globalThis.PointerEvent) => {
        const drag =
          dragRef.current;

        const stage =
          stageRef.current;

        if (
          !drag ||
          !stage ||
          event.pointerId !==
            drag.pointerId
        ) {
          return;
        }

        const rect =
          stage.getBoundingClientRect();

        const point = {
          x:
            event.clientX -
            rect.left,
          y:
            event.clientY -
            rect.top,
        };

        Body.setPosition(
          drag.anchor,
          point
        );

        drag.history.push({
          x: point.x,
          y: point.y,
          time:
            performance.now(),
        });

        if (
          drag.history.length > 6
        ) {
          drag.history.shift();
        }
      };

    const onUp =
      (event: globalThis.PointerEvent) => {
        const drag =
          dragRef.current;

        if (
          !drag ||
          drag.pointerId !==
            event.pointerId
        ) {
          return;
        }

        release();
      };

    window.addEventListener(
      "pointermove",
      onMove,
      { passive: true }
    );

    window.addEventListener(
      "pointerup",
      onUp
    );

    let raf = 0;
    let last = performance.now();

    const tick =
      (time: number) => {
        raf =
          requestAnimationFrame(
            tick
          );

        if (
          !visibleRef.current ||
          !pageVisibleRef.current
        ) {
          last = time;
          return;
        }

        const delta =
          Math.min(
            32,
            time - last
          );

        last = time;

        Engine.update(
          engine,
          delta || 16.667
        );

        render();
      };

    raf =
      requestAnimationFrame(
        tick
      );

    return () => {
      cancelAnimationFrame(
        raf
      );

      release();

      observer.disconnect();
      resize.disconnect();

      document.removeEventListener(
        "visibilitychange",
        onVisibility
      );

      window.removeEventListener(
        "pointermove",
        onMove
      );

      window.removeEventListener(
        "pointerup",
        onUp
      );

      Composite.clear(
        engine.world,
        false
      );

      Engine.clear(engine);
      engineRef.current =
        null;
    };
  }, [
    createWalls,
    initialize,
    release,
    render,
    stageRef,
  ]);

  const reset =
    useCallback(() => {
      release();

      bodiesRef.current.forEach(
        (item) => {
          const start =
            initialRef.current.get(
              item.element.dataset.skillId!
            );

          if (
            !start ||
            !item.body
          ) {
            return;
          }

          Body.setPosition(
            item.body,
            start
          );

          Body.setAngle(
            item.body,
            0
          );

          Body.setVelocity(
            item.body,
            { x: 0, y: 0 }
          );

          Body.setAngularVelocity(
            item.body,
            0
          );

          Body.setSleeping(
            item.body,
            false
          );
        }
      );

      render();
    }, [release, render]);

  return {
    setCardRef,
    handlePointerDown:
      pointerDown as (
        id: string,
        event: ReactPointerEvent<HTMLButtonElement>
      ) => void,
    reset,
  };
}
