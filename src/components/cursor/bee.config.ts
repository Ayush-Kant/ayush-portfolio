export const BEE_CONFIG = {
  visual: {
    width: 34,
    height: 28,
    cursorOffsetX: 2,
    cursorOffsetY: -7,
  },

  follow: {
    base: 0.026,
    speedGain: 0.006,
    maximum: 0.055,
    landing: 0.075,
  },

  flight: {
    minimumCurve: 3,
    maximumCurve: 10,
    trailingDistance: 5,
    maximumTrail: 14,
    frequency: 0.0035,
    secondaryFrequency: 0.0058,
    secondaryAmplitude: 1.5,
  },

  landing: {
    startAfterMs: 760,
    startDistance: 70,
    settleDistance: 14,
    progressIn: 0.045,
    progressOut: 0.18,
    restingBobAmplitude: 0.34,
    restingBobFrequency: 0.0036,
  },

  rotation: {
    maximum: 10,
    response: 0.055,
    damping: 0.08,
  },

  pointer: {
    velocitySmoothing: 0.42,
    velocityDecay: 9,
    maxVelocity: 1800,
    motionThreshold: 40,
  },

  wings: {
    slowBeatsPerSecond: 7,
    fastBeatsPerSecond: 15,
    restingBeatsPerSecond: 2.2,
  },
} as const;