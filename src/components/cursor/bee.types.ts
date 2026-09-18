export type Point = {
  x: number;
  y: number;
};

export type BeeMode =
  | "flying"
  | "landing"
  | "resting";

export type BeeMotionState = {
  position: Point;
  velocity: Point;
  direction: Point;
  wobblePhase: number;
  lastPointerMoveAt: number;
  mode: BeeMode;
  landingProgress: number;
  rotation: number;
  wingPhase: number;
};

export type BeeMotionInput = {
  pointer: Point;
  pointerVelocity: Point;
  time: number;
  deltaSeconds: number;
};

export type BeeMotionOutput = {
  position: Point;
  rotation: number;
  mode: BeeMode;
  speed: number;
  distanceToPointer: number;
  wingSpeed: number;
  wingAmount: number;
};