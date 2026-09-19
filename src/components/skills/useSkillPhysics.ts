"use client";

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
  Events,
  Query,
  type IEventCollision,
  type IEventMouse,
} from "matter-js";

import { PHYSICS } from "./physics.config";
import type { SkillDefinition } from "./skills.data";

type Rect = {
  width: number;
  height: number;
};

type PointerSample = {
  x: number;
  y: number;
  time: number;
};

type SkillBody = {
  element: HTMLElement;
  body: Body;
  width: number;
  height: number;
};

type UseSkillPhysicsArgs = {
  stageRef: React.RefObject<HTMLDivElement | null>;
  skills: SkillDefinition[];
};

export function useSkillPhysics({
  stageRef,
  skills,
}: UseSkillPhysicsArgs) {
  const engineRef =
    useRef<Engine | null>(null);

  const bodiesRef =
    useRef<Map<string, SkillBody>>(
      new Map()
    );

  const wallRef =
    useRef<Body[]>([]);

  const dragRef =
    useRef<{
      id: string;
      body: Body;
      anchor: Body;
      constraint: Constraint;
      pointerId: number;
      history: PointerSample[];
    } | null>(null);

  const rafRef =
    useRef<number | null>(null);

  const visibleRef =
    useRef(true);

  const pageVisibleRef =
    useRef(true);

  const readyRef =
    useRef(false);

  const initialStateRef =
    useRef<
      Map<
        string,
        {
          x: number;
          y: number;
          angle: number;
        }
      >
    >(new Map());

  const setCardRef =
    useCallback(
      (id: string) =>
        (node: HTMLButtonElement | null) => {
          if (!node) {
            bodiesRef.current.delete(
              id
            );
            return;
          }

          const existing =
            bodiesRef.current.get(id);

          if (existing) {
            existing.element =
              node;
          } else {
            bodiesRef.current.set(
              id,
              {
                element: node,
                body: null as never,
                width:
                  PHYSICS.cardWidth,
                height:
                  PHYSICS.cardHeight,
              }
            );
          }
        },
      []
    );

  const renderBodies =
    useCallback(() => {
      for (const item of bodiesRef.current.values()) {
        item.element.style.transform =
          "translate3d(" +
          (item.body.position.x -
            item.width / 2) +
          "px, " +
          (item.body.position.y -
            item.height / 2) +
          "px, 0) rotate(" +
          item.body.angle +
          "rad)";
      }
    }, []);

  const stageSize =
    useCallback((): Rect | null => {
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

  const buildWalls =
    useCallback(() => {
      const engine =
        engineRef.current;

      const size =
        stageSize();

      if (!engine || !size) {
        return;
      }

      if (
        wallRef.current.length
      ) {
        Composite.remove(
          engine.world,
          wallRef.current
        );
      }

      const floorY =
        size.height -
        PHYSICS.floorGap;

      wallRef.current = [
        Bodies.rectangle(
          size.width / 2,
          floorY +
            PHYSICS.wallThickness / 2,
          size.width +
            PHYSICS.wallThickness * 2,
          PHYSICS.wallThickness,
          {
            isStatic: true,
            friction:
              PHYSICS.friction,
            restitution:
              PHYSICS.restitution,
          }
        ),
        Bodies.rectangle(
          -PHYSICS.wallThickness / 2,
          size.height / 2,
          PHYSICS.wallThickness,
          size.height,
          {
            isStatic: true,
          }
        ),
        Bodies.rectangle(
          size.width +
            PHYSICS.wallThickness / 2,
          size.height / 2,
          PHYSICS.wallThickness,
          size.height,
          {
            isStatic: true,
          }
        ),
      ];

      Composite.add(
        engine.world,
        wallRef.current
      );
    }, [stageSize]);

  const clampBodies =
    useCallback(() => {
      const size =
        stageSize();

      if (!size) return;

      const floorY =
        size.height -
        PHYSICS.floorGap;

      for (const item of bodiesRef.current.values()) {
        const halfWidth =
          item.width / 2;
        const halfHeight =
          item.height / 2;

        const x = Math.min(
          Math.max(
            item.body.position.x,
            halfWidth + 4
          ),
          size.width -
            halfWidth -
            4
        );

        const y = Math.min(
          Math.max(
            item.body.position.y,
            halfHeight + 4
          ),
          floorY -
            halfHeight -
            4
        );

        Body.setPosition(
          item.body,
          { x, y }
        );
      }
    }, [stageSize]);

  const installBodies =
    useCallback(() => {
      const engine =
        engineRef.current;

      const size =
        stageSize();

      if (!engine || !size) {
        return;
      }

      for (const item of bodiesRef.current.values()) {
        if (
          item.body
        ) {
          Composite.remove(
            engine.world,
            item.body
          );
        }
      }

      bodiesRef.current.forEach(
        (item, index) => {
          const width =
            Math.max(
              PHYSICS.cardWidth,
              Math.min(
                178,
                86 +
                  item.element
                    .textContent!
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
              92 +
                column *
                  (width + 14),
              size.width -
                width /
                  2 -
                18
            );

          const y =
            88 +
            row *
              (height + 16);

          const body =
            Bodies.rectangle(
              x,
              Math.min(
                y,
                size.height *
                  0.58
              ),
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

          initialStateRef.current.set(
            item.element
              .dataset.skillId!,
            {
              x,
              y,
              angle: 0,
            }
          );

          Composite.add(
            engine.world,
            body
          );
        }
      );

      buildWalls();
      readyRef.current = true;
      clampBodies();
      renderBodies();
    }, [
      buildWalls,
      clampBodies,
      renderBodies,
      stageSize,
    ]);

  const releaseDrag =
    useCallback(() => {
      const drag =
        dragRef.current;

      const engine =
        engineRef.current;

      if (
        !drag ||
        !engine
      ) {
        return;
      }

      const history =
        drag.history;

      const first =
        history[0];

      const last =
        history[
          history.length - 1
        ];

      const dt = Math.max(
        16,
        last.time -
          first.time
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

      const clamp =
        (value: number) =>
          Math.max(
            -PHYSICS.maxReleaseVelocity,
            Math.min(
              PHYSICS.maxReleaseVelocity,
              value
            )
          );

      Body.setVelocity(
        drag.body,
        {
          x: clamp(vx),
          y: clamp(vy),
        }
      );

      Body.setAngularVelocity(
        drag.body,
        Math.max(
          -PHYSICS.maxAngularVelocity,
          Math.min(
            PHYSICS.maxAngularVelocity,
            vx * 0.00012
          )
        )
      );

      Composite.remove(
        engine.world,
        drag.anchor
      );

      Composite.remove(
        engine.world,
        drag.constraint
      );

      dragRef.current =
        null;
    }, []);

  const handlePointerDown =
    useCallback(
      (
        id: string,
        event: React.PointerEvent<HTMLButtonElement>
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

        const hit =
          Query.point(
            [item.body],
            point
          );

        if (!hit.length) {
          return;
        }

        event.currentTarget.setPointerCapture(
          event.pointerId
        );

        Body.setAngularVelocity(
          item.body,
          0
        );

        Body.setVelocity(
          item.body,
          {
            x: 0,
            y: 0,
          }
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
          id,
          body: item.body,
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
      [stageRef]
    );

  useEffect(() => {
    const stage =
      stageRef.current;

    if (!stage) {
      return;
    }

    const engine =
      Engine.create({
        enableSleeping:
          true,
      });

    engine.gravity.y =
      PHYSICS.gravity;

    engine.timing.timeScale =
      1;

    engineRef.current =
      engine;

    const resizeObserver =
      new ResizeObserver(() => {
        if (!readyRef.current) {
          installBodies();
          return;
        }

        buildWalls();
        clampBodies();
      });

    resizeObserver.observe(stage);

    const intersectionObserver =
      new IntersectionObserver(
        ([entry]) => {
          visibleRef.current =
            entry.isIntersecting;

          if (
            entry.isIntersecting &&
            !readyRef.current
          ) {
            installBodies();
          }
        },
        {
          threshold: 0.05,
        }
      );

    intersectionObserver.observe(
      stage
    );

    const onVisibilityChange =
      () => {
        pageVisibleRef.current =
          document.visibilityState ===
          "visible";
      };

    document.addEventListener(
      "visibilitychange",
      onVisibilityChange
    );

    const onPointerMove =
      (event: PointerEvent) => {
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

        const now =
          performance.now();

        drag.history.push({
          x: point.x,
          y: point.y,
          time: now,
        });

        if (
          drag.history.length >
          6
        ) {
          drag.history.shift();
        }
      };

    const onPointerUp =
      (event: PointerEvent) => {
        const drag =
          dragRef.current;

        if (
          !drag ||
          event.pointerId !==
            drag.pointerId
        ) {
          return;
        }

        releaseDrag();
      };

    window.addEventListener(
      "pointermove",
      onPointerMove,
      {
        passive: true,
      }
    );

    window.addEventListener(
      "pointerup",
      onPointerUp
    );

    const onCollision =
      (
        event: IEventCollision<Engine>
      ) => {
        for (const pair of event.pairs) {
          if (
            pair.bodyA.isStatic ||
            pair.bodyB.isStatic
          ) {
            continue;
          }
        }
      };

    Events.on(
      engine,
      "collisionStart",
      onCollision
    );

    let lastTime =
      performance.now();

    const tick =
      (time: number) => {
        rafRef.current =
          requestAnimationFrame(
            tick
          );

        const active =
          visibleRef.current &&
          pageVisibleRef.current;

        if (!active) {
          lastTime = time;
          return;
        }

        const delta =
          Math.min(
            32,
            time -
              lastTime
          );

        lastTime = time;

        Engine.update(
          engine,
          delta || 16.667
        );

        renderBodies();
      };

    rafRef.current =
      requestAnimationFrame(tick);

    return () => {
      if (
        rafRef.current !==
        null
      ) {
        cancelAnimationFrame(
          rafRef.current
        );
      }

      releaseDrag();

      intersectionObserver.disconnect();
      resizeObserver.disconnect();

      document.removeEventListener(
        "visibilitychange",
        onVisibilityChange
      );

      window.removeEventListener(
        "pointermove",
        onPointerMove
      );

      window.removeEventListener(
        "pointerup",
        onPointerUp
      );

      Events.off(
        engine,
        "collisionStart",
        onCollision
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
    buildWalls,
    clampBodies,
    installBodies,
    releaseDrag,
    renderBodies,
    stageRef,
  ]);

  const reset =
    useCallback(() => {
      const engine =
        engineRef.current;

      if (!engine) return;

      releaseDrag();

      for (const [
        id,
        item,
      ] of bodiesRef.current) {
        const start =
          initialStateRef.current.get(
            id
          );

        if (!start) continue;

        Body.setPosition(
          item.body,
          {
            x: start.x,
            y: start.y,
          }
        );

        Body.setAngle(
          item.body,
          start.angle
        );

        Body.setVelocity(
          item.body,
          {
            x: 0,
            y: 0,
          }
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

      renderBodies();
    }, [
      releaseDrag,
      renderBodies,
    ]);

  return {
    setCardRef,
    handlePointerDown,
    reset,
  };
}
