"use client";

import { useEffect, useRef } from "react";
import { HERO_CONFIG } from "./hero.config";

export const useHeroIntro = () => {
  const heroRef =
    useRef<HTMLElement | null>(null);

  useEffect(() => {
    const hero =
      heroRef.current;

    if (!hero) return;

    const reducedMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

    if (reducedMotion) {
      hero.dataset.motion =
        "reduced";
      return;
    }

    hero.dataset.motion =
      "full";

    const timeoutId =
      window.setTimeout(() => {
        hero.dataset.intro =
          "complete";
      }, HERO_CONFIG.intro.waveDurationMs +
        HERO_CONFIG.intro.waveDelayMs +
        HERO_CONFIG.intro.finishDelayMs);

    return () =>
      window.clearTimeout(timeoutId);
  }, []);

  return heroRef;
};
