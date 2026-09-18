export const HERO_CONFIG = {
  typewriter: {
    initialDelayMs: 320,
    characterDelayMs: 58,
    caretBlinkMs: 560,
  },

  intro: {
    waveDelayMs: 650,
    waveDurationMs: 1450,
    waveRepeats: 2,
    finishDelayMs: 100,
  },

  cat: {
    breathDurationMs: 3000,
    scaleY: 1.018,
  },

  typing: {
    keyTravelPx: 1.4,
    bodyShiftPx: 0.55,
    cycleMs: 720,
  },

  scene: {
    handClip: "polygon(54% 38%, 63% 37%, 65% 43%, 65% 55%, 63% 58%, 57% 56%, 54% 50%)",
    typingHandClip: "polygon(62% 67%, 78% 67%, 81% 84%, 65% 85%)",
    catClip: "polygon(0% 67%, 31% 67%, 34% 92%, 0% 92%)",
  },
} as const;
