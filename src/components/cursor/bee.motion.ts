import { BEE_CONFIG } from "./bee.config";
import type {
  BeeMode,
  BeeMotionInput,
  BeeMotionOutput,
  BeeMotionState,
  Point,
} from "./bee.types";

const clamp = (
  value: number,
  minimum: number,
  maximum: number
) => Math.min(Math.max(value, minimum), maximum);

const magnitude = (x: number, y: number) =>
  Math.hypot(x, y);

const normalize = (
  x: number,
  y: number,
  fallback: Point
): Point => {
  const length = magnitude(x, y);

  if (length < 0.0001) {
    return {
      x: fallback.x,
      y: fallback.y,
    };
  }

  return {
    x: x / length,
    y: y / length,
  };
};

const lerp = (
  current: number,
  target: number,
  amount: number
) =>
  current +
  (target - current) * amount;

const getDistance = (
  a: Point,
  b: Point
) =>
  magnitude(
    a.x - b.x,
    a.y - b.y
  );

const getMode = (
  state: BeeMotionState,
  input: BeeMotionInput,
  distanceToPointer: number
): BeeMode => {
  const idleFor =
    input.time -
    state.lastPointerMoveAt;

  const pointerSpeed =
    magnitude(
      input.pointerVelocity.x,
      input.pointerVelocity.y
    );

  if (
    pointerSpeed >
    BEE_CONFIG.pointer.motionThreshold
  ) {
    return "flying";
  }

  if (
    idleFor <
    BEE_CONFIG.landing.startAfterMs
  ) {
    return "flying";
  }

  if (
    distanceToPointer >
    BEE_CONFIG.landing.startDistance
  ) {
    return "flying";
  }

  if (
    state.landingProgress > 0.72 &&
    distanceToPointer <
      BEE_CONFIG.landing.settleDistance
  ) {
    return "resting";
  }

  return "landing";
};

const updateDirection = (
  state: BeeMotionState,
  pointerVelocity: Point
) => {
  const speed =
    magnitude(
      pointerVelocity.x,
      pointerVelocity.y
    );

  if (speed < 1) return;

  const next =
    normalize(
      pointerVelocity.x,
      pointerVelocity.y,
      state.direction
    );

  state.direction.x = lerp(
    state.direction.x,
    next.x,
    0.08
  );

  state.direction.y = lerp(
    state.direction.y,
    next.y,
    0.08
  );

  const normalized =
    normalize(
      state.direction.x,
      state.direction.y,
      { x: 1, y: 0 }
    );

  state.direction.x =
    normalized.x;

  state.direction.y =
    normalized.y;
};

const updateLandingProgress = (
  state: BeeMotionState,
  mode: BeeMode
) => {
  const target =
    mode === "flying"
      ? 0
      : 1;

  const response =
    target === 1
      ? BEE_CONFIG.landing.progressIn
      : BEE_CONFIG.landing.progressOut;

  state.landingProgress +=
    (target - state.landingProgress) *
    response;

  state.landingProgress =
    clamp(
      state.landingProgress,
      0,
      1
    );
};

const getFlightTarget = (
  state: BeeMotionState,
  input: BeeMotionInput
): Point => {
  const pointerSpeed =
    magnitude(
      input.pointerVelocity.x,
      input.pointerVelocity.y
    );

  const speedFactor =
    clamp(
      pointerSpeed /
        BEE_CONFIG.pointer.maxVelocity,
      0,
      1
    );

  const perpendicular = {
    x: -state.direction.y,
    y: state.direction.x,
  };

  const curveAmount =
    (
      BEE_CONFIG.flight.minimumCurve +
      (
        BEE_CONFIG.flight.maximumCurve -
        BEE_CONFIG.flight.minimumCurve
      ) *
        speedFactor
    ) *
    (1 - state.landingProgress);

  /*
   * Two slow, bounded waves create a loose curved path.
   * They are intentionally small so the bee wanders without
   * turning into an orbit around the pointer.
   */
  const primaryWave =
    Math.sin(
      input.time *
        BEE_CONFIG.flight.frequency +
        state.wobblePhase
    ) *
    curveAmount;

  const secondaryWave =
    Math.cos(
      input.time *
        BEE_CONFIG.flight.secondaryFrequency +
        state.wobblePhase *
          0.73
    ) *
    BEE_CONFIG.flight.secondaryAmplitude *
    (1 - state.landingProgress);

  const trailingDistance =
    (
      BEE_CONFIG.flight.trailingDistance +
      speedFactor *
        BEE_CONFIG.flight.maximumTrail
    ) *
    (1 - state.landingProgress);

  return {
    x:
      input.pointer.x +
      perpendicular.x *
        (primaryWave + secondaryWave) -
      state.direction.x *
        trailingDistance,

    y:
      input.pointer.y +
      perpendicular.y *
        (primaryWave + secondaryWave) -
      state.direction.y *
        trailingDistance,
  };
};

const updatePosition = (
  state: BeeMotionState,
  target: Point,
  mode: BeeMode,
  pointerSpeed: number
) => {
  const speedFactor =
    clamp(
      pointerSpeed /
        BEE_CONFIG.pointer.maxVelocity,
      0,
      1
    );

  const follow =
    mode === "resting"
      ? BEE_CONFIG.follow.landing
      : clamp(
          BEE_CONFIG.follow.base +
            speedFactor *
              BEE_CONFIG.follow.speedGain,
          BEE_CONFIG.follow.base,
          BEE_CONFIG.follow.maximum
        );

  const previousX =
    state.position.x;

  const previousY =
    state.position.y;

  state.position.x +=
    (target.x -
      state.position.x) *
    follow;

  state.position.y +=
    (target.y -
      state.position.y) *
    follow;

  state.velocity.x =
    state.position.x -
    previousX;

  state.velocity.y =
    state.position.y -
    previousY;
};

const updateRotation = (
  state: BeeMotionState
) => {
  const targetRotation =
    clamp(
      state.velocity.x * 1.15,
      -BEE_CONFIG.rotation.maximum,
      BEE_CONFIG.rotation.maximum
    );

  state.rotation = lerp(
    state.rotation,
    targetRotation,
    BEE_CONFIG.rotation.response
  );

  if (
    Math.abs(
      state.velocity.x
    ) < 0.025
  ) {
    state.rotation = lerp(
      state.rotation,
      0,
      BEE_CONFIG.rotation.damping
    );
  }
};

export const createBeeMotionState = (
  initialPoint: Point
): BeeMotionState => ({
  position: {
    x: initialPoint.x,
    y: initialPoint.y,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  direction: {
    x: 1,
    y: 0,
  },
  wobblePhase:
    Math.random() *
    Math.PI *
    2,
  lastPointerMoveAt:
    performance.now(),
  mode: "flying",
  landingProgress: 0,
  rotation: 0,
  wingPhase: 0,
});

export const advanceBeeMotion = (
  state: BeeMotionState,
  input: BeeMotionInput
): BeeMotionOutput => {
  const distanceToPointer =
    getDistance(
      state.position,
      input.pointer
    );

  const mode =
    getMode(
      state,
      input,
      distanceToPointer
    );

  state.mode = mode;

  updateDirection(
    state,
    input.pointerVelocity
  );

  updateLandingProgress(
    state,
    mode
  );

  const flightTarget =
    getFlightTarget(
      state,
      input
    );

  const pointerSpeed =
    magnitude(
      input.pointerVelocity.x,
      input.pointerVelocity.y
    );

  const restingBob =
    Math.sin(
      input.time *
        BEE_CONFIG.landing.restingBobFrequency
    ) *
    BEE_CONFIG.landing.restingBobAmplitude;

  const target =
    mode === "resting"
      ? {
          x:
            input.pointer.x +
            BEE_CONFIG.visual.cursorOffsetX,

          y:
            input.pointer.y -
            BEE_CONFIG.visual.height *
              0.17 +
            restingBob,
        }
      : flightTarget;

  updatePosition(
    state,
    target,
    mode,
    pointerSpeed
  );

  updateRotation(state);

  const speed =
    magnitude(
      state.velocity.x,
      state.velocity.y
    );

  const flightAmount =
    clamp(
      Math.max(
        pointerSpeed,
        speed * 1.75
      ) /
        BEE_CONFIG.pointer.maxVelocity,
      0,
      1
    );

  const wingSpeed =
    mode === "resting"
      ? BEE_CONFIG.wings
          .restingBeatsPerSecond
      : BEE_CONFIG.wings
          .slowBeatsPerSecond +
        (
          BEE_CONFIG.wings
            .fastBeatsPerSecond -
          BEE_CONFIG.wings
            .slowBeatsPerSecond
        ) *
          flightAmount;

  state.wingPhase +=
    input.deltaSeconds *
    wingSpeed *
    Math.PI *
    2;

  return {
    position: {
      x: state.position.x,
      y: state.position.y,
    },
    rotation: state.rotation,
    mode,
    speed,
    distanceToPointer:
      getDistance(
        state.position,
        input.pointer
      ),
    wingSpeed,
    wingAmount:
      0.78 +
      flightAmount * 0.22,
  };
};
