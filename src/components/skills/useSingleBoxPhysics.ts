"use client";

import { useEffect, useRef, type RefObject } from "react";

type Physics = {
  x: number; y: number; vx: number; vy: number;
  angle: number; spin: number; sleeping: boolean;
};

type Sample = { x: number; y: number; time: number };

type Args = {
  trayRef: RefObject<HTMLDivElement | null>;
  boxRef: RefObject<HTMLButtonElement | null>;
  onDraggingChange: (dragging: boolean) => void;
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

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

export function useSingleBoxPhysics({
  trayRef,
  boxRef,
  onDraggingChange,
}: Args) {
  const state = useRef<Physics>({
    x: 0, y: 0, vx: 0, vy: 0,
    angle: 0, spin: 0, sleeping: true,
  });
  const drag = useRef<{
    pointerId: number;
    offsetX: number;
    offsetY: number;
    samples: Sample[];
  } | null>(null);
  const lastPress = useRef<Sample | null>(null);

  useEffect(() => {
    const tray = trayRef.current;
    const box = boxRef.current;
    if (!tray || !box) return;

    let trayW = 0, trayH = 0, boxW = 0, boxH = 0;
    let raf = 0, lastFrame = performance.now();
    const p = state.current;

    const measure = () => {
      const tr = tray.getBoundingClientRect();
      const br = box.getBoundingClientRect();
      trayW = tr.width; trayH = tr.height;
      boxW = br.width; boxH = br.height;
      p.x = clamp(p.x, 0, Math.max(0, trayW - boxW));
      p.y = clamp(p.y, 0, floor());
    };

    const floor = () =>
      Math.max(0, trayH - boxH - FLOOR_GAP);

    const point = (e: PointerEvent): Sample => {
      const r = tray.getBoundingClientRect();
      return {
        x: e.clientX - r.left,
        y: e.clientY - r.top,
        time: performance.now(),
      };
    };

    const render = () => {
      box.style.transform =
        `translate3d(${p.x}px,${p.y}px,0) rotate(${p.angle}rad)`;
    };

    const release = (e: PointerEvent) => {
      const d = drag.current;
      if (!d || d.pointerId !== e.pointerId) return;

      const samples = [...d.samples, point(e)];
      const first = samples[0];
      const last = samples[samples.length - 1];
      const dt = Math.max(16, last.time - first.time);

      p.vx = clamp(
        ((last.x - first.x) / dt) * 1000,
        -MAX_SPEED, MAX_SPEED
      );
      p.vy = clamp(
        ((last.y - first.y) / dt) * 1000,
        -MAX_SPEED, MAX_SPEED
      );
      p.spin = clamp(
        p.vx * 0.00042,
        -0.7, 0.7
      );
      p.sleeping = false;
      drag.current = null;
      lastPress.current = null;

      try { box.releasePointerCapture(e.pointerId); } catch {}
      box.style.zIndex = "";
      onDraggingChange(false);
    };

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      measure();

      const q = point(e);
      const last = lastPress.current;
      const isDouble =
        !!last &&
        q.time - last.time <= DOUBLE_PRESS_MS &&
        Math.hypot(q.x - last.x, q.y - last.y) <= DOUBLE_PRESS_DISTANCE;

      lastPress.current = q;
      if (!isDouble) return;

      const inside =
        q.x >= p.x && q.x <= p.x + boxW &&
        q.y >= p.y && q.y <= p.y + boxH;
      if (!inside) return;

      e.preventDefault();
      p.vx = 0; p.vy = 0; p.spin = 0; p.sleeping = false;
      drag.current = {
        pointerId: e.pointerId,
        offsetX: q.x - p.x,
        offsetY: q.y - p.y,
        samples: [q],
      };

      box.setPointerCapture?.(e.pointerId);
      box.style.zIndex = "10";
      onDraggingChange(true);
    };

    const onMove = (e: PointerEvent) => {
      const d = drag.current;
      if (!d || d.pointerId !== e.pointerId) return;

      const q = point(e);
      p.x = clamp(q.x - d.offsetX, 0, Math.max(0, trayW - boxW));
      p.y = clamp(q.y - d.offsetY, 0, floor());

      d.samples.push(q);
      const cutoff = q.time - 90;
      while (d.samples.length > 1 && d.samples[0].time < cutoff) {
        d.samples.shift();
      }
      render();
    };

    const resize = new ResizeObserver(() => {
      measure(); render();
    });
    resize.observe(tray);

    box.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);

    measure();
    p.x = Math.max(0, (trayW - boxW) * 0.22);
    p.y = Math.max(0, floor() - 42);
    p.vx = 0; p.vy = 0; p.angle = 0; p.spin = 0; p.sleeping = true;
    render();

    const tick = (time: number) => {
      const dt = Math.min(0.032, Math.max(0, (time - lastFrame) / 1000));
      lastFrame = time;

      if (!drag.current && !p.sleeping) {
        p.vy += GRAVITY * dt;
        p.vx *= Math.pow(AIR_DRAG, dt * 60);
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.angle += p.spin * dt;

        const maxX = Math.max(0, trayW - boxW);
        const fy = floor();

        if (p.x < 0) {
          p.x = 0; p.vx = Math.abs(p.vx) * WALL_BOUNCE;
        } else if (p.x > maxX) {
          p.x = maxX; p.vx = -Math.abs(p.vx) * WALL_BOUNCE;
        }

        if (p.y >= fy) {
          p.y = fy;
          if (Math.abs(p.vy) > 40) {
            p.vy = -Math.abs(p.vy) * BOUNCE;
            p.vx *= FLOOR_FRICTION;
            p.spin = clamp(p.spin + p.vx * 0.0002, -0.7, 0.7);
          } else {
            p.vy = 0; p.vx *= 0.64; p.spin *= 0.5;
          }
        }

        if (
          Math.abs(p.vx) < SLEEP_SPEED &&
          Math.abs(p.vy) < SLEEP_SPEED &&
          Math.abs(p.spin) < 0.03 &&
          p.y >= fy - 0.5
        ) {
          p.vx = 0; p.vy = 0; p.spin = 0; p.y = fy; p.sleeping = true;
        }

        render();
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
      box.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
      drag.current = null;
    };
  }, [boxRef, onDraggingChange, trayRef]);
}
