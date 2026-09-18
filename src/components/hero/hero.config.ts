export const HERO_CONFIG = {
  typewriter: {
    initialDelayMs: 420,
    characterDelayMs: 52,
  },

  intro: {
    waveDelayMs: 350,
    waveDurationMs: 2200,
  },

  scene: {
    /*
     * Coordinates are percentages of the cropped 1024×710
     * hero scene asset.
     */
    handClip:
      "polygon(43% 29%, 54% 28%, 58% 36%, 58% 49%, 55% 53%, 48% 50%, 43% 42%)",

    typingHandClip:
      "polygon(59% 65%, 74% 65%, 78% 82%, 62% 84%)",

    catClip:
      "polygon(0% 65%, 31% 65%, 34% 91%, 0% 91%)",
  },
} as const;
