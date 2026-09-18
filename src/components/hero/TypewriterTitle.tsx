"use client";

import { useEffect, useState } from "react";

const FIRST_LINE = "Hi, I'm";
const NAME_LINE = "Ayush Kant";

const START_DELAY_MS = 420;
const CHARACTER_DELAY_MS = 68;

export default function TypewriterTitle() {
  const [visibleCount, setVisibleCount] =
    useState(0);

  const totalLength =
    FIRST_LINE.length +
    1 +
    NAME_LINE.length;

  useEffect(() => {
    const prefersReducedMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

    if (prefersReducedMotion) {
      setVisibleCount(
        totalLength
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
        setVisibleCount(
          (current) => {
            const next =
              current + 1;

            if (
              next >=
              totalLength
            ) {
              if (intervalId) {
                clearInterval(
                  intervalId
                );
              }

              return totalLength;
            }

            return next;
          }
        );
      }, CHARACTER_DELAY_MS);
    }, START_DELAY_MS);

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
  }, [totalLength]);

  const firstLineCount =
    Math.min(
      visibleCount,
      FIRST_LINE.length
    );

  const nameCount =
    Math.max(
      0,
      Math.min(
        visibleCount -
          FIRST_LINE.length -
          1,
        NAME_LINE.length
      )
    );

  const isTyping =
    visibleCount <
    totalLength;

  return (
    <h1
      id="hero-title"
      className="hero-title"
      aria-label="Hi, I'm Ayush Kant"
    >
      <span
        className="hero-title-line"
        aria-hidden="true"
      >
        <span className="hero-title-muted">
          {FIRST_LINE.slice(
            0,
            firstLineCount
          )}
        </span>

        {isTyping &&
          visibleCount <=
            FIRST_LINE.length && (
            <span
              className="hero-title-caret"
              aria-hidden="true"
            />
          )}
      </span>

      <span
        className="hero-title-line hero-title-accent"
        aria-hidden="true"
      >
        {NAME_LINE.slice(
          0,
          nameCount
        )}

        {isTyping &&
          visibleCount >
            FIRST_LINE.length && (
            <span
              className="hero-title-caret"
              aria-hidden="true"
            />
          )}
      </span>

      <span className="sr-only">
        Hi, I&apos;m Ayush Kant
      </span>
    </h1>
  );
}
