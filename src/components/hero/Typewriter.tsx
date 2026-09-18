"use client";

import { useEffect, useState } from "react";
import { HERO_CONFIG } from "./hero.config";

type TypewriterProps = {
  text: string;
  className?: string;
  startDelayMs?: number;
};

export default function Typewriter({
  text,
  className,
  startDelayMs = HERO_CONFIG.typewriter.initialDelayMs,
}: TypewriterProps) {
  const [visibleCharacters, setVisibleCharacters] =
    useState(0);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let intervalId:
      | ReturnType<typeof setInterval>
      | undefined;

    timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        setVisibleCharacters((current) => {
          if (current >= text.length) {
            if (intervalId) {
              clearInterval(intervalId);
            }
            return current;
          }

          return current + 1;
        });
      }, HERO_CONFIG.typewriter.characterDelayMs);
    }, startDelayMs);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [startDelayMs, text]);

  return (
    <span
      className={className}
      aria-hidden="true"
    >
      {text.slice(0, visibleCharacters)}
      <span
        className="hero-caret"
        aria-hidden="true"
      />
    </span>
  );
}
