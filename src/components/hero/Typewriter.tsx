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
  startDelayMs =
    HERO_CONFIG.typewriter
      .initialDelayMs,
}: TypewriterProps) {
  const [visibleCharacters, setVisibleCharacters] =
    useState(0);

  useEffect(() => {
    const reducedMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

    if (reducedMotion) {
      setVisibleCharacters(
        text.length
      );

      return;
    }

    let timeoutId:
      | ReturnType<typeof setTimeout>
      | undefined;

    let intervalId:
      | ReturnType<typeof setInterval>
      | undefined;

    timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        setVisibleCharacters(
          (current) => {
            const next =
              current + 1;

            if (
              next >= text.length
            ) {
              if (intervalId) {
                clearInterval(
                  intervalId
                );
              }

              return text.length;
            }

            return next;
          }
        );
      }, HERO_CONFIG.typewriter.characterDelayMs);
    }, startDelayMs);

    return () => {
      if (timeoutId) {
        clearTimeout(
          timeoutId
        );
      }

      if (intervalId) {
        clearInterval(
          intervalId
        );
      }
    };
  }, [startDelayMs, text]);

  return (
    <>
      <span
        className={className}
        aria-hidden="true"
      >
        {text.slice(
          0,
          visibleCharacters
        )}

        {visibleCharacters <
          text.length && (
          <span
            className="hero-caret"
            aria-hidden="true"
          />
        )}
      </span>

      <span className="sr-only">
        {text}
      </span>
    </>
  );
}
