"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
} from "react";

type PlaybackPhase =
  | "fallback"
  | "intro"
  | "idle";

const INTRO_SOURCES = [
  {
    src: "/hero/hero-intro.webm",
    type: "video/webm",
  },
  {
    src: "/hero/hero-intro.mp4",
    type: "video/mp4",
  },
];

const IDLE_SOURCES = [
  {
    src: "/hero/hero-idle.webm",
    type: "video/webm",
  },
  {
    src: "/hero/hero-idle.mp4",
    type: "video/mp4",
  },
];

export default function HeroAnimation() {
  const introRef =
    useRef<HTMLVideoElement | null>(
      null
    );

  const idleRef =
    useRef<HTMLVideoElement | null>(
      null
    );

  const [phase, setPhase] =
    useState<PlaybackPhase>(
      "intro"
    );

  const [idleReady, setIdleReady] =
    useState(false);

  const [motionAllowed, setMotionAllowed] =
    useState(true);

  useEffect(() => {
    const mediaQuery =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      );

    const updatePreference = () => {
      setMotionAllowed(
        !mediaQuery.matches
      );
    };

    updatePreference();

    mediaQuery.addEventListener(
      "change",
      updatePreference
    );

    return () => {
      mediaQuery.removeEventListener(
        "change",
        updatePreference
      );
    };
  }, []);

  useEffect(() => {
    if (!motionAllowed) {
      setPhase("fallback");

      introRef.current?.pause();
      idleRef.current?.pause();

      return;
    }

    if (phase === "intro") {
      const intro =
        introRef.current;

      if (!intro) return;

      /*
       * Muted autoplay is intentionally requested through JS too.
       * This gives us an explicit failure path instead of silently
       * assuming autoplay succeeded.
       */
      intro.muted = true;

      const playPromise =
        intro.play();

      playPromise?.catch(() => {
        setPhase(
          idleReady
            ? "idle"
            : "fallback"
        );
      });

      return;
    }

    if (phase === "idle") {
      const idle =
        idleRef.current;

      if (!idle) return;

      idle.muted = true;

      const playPromise =
        idle.play();

      playPromise?.catch(() => {
        setPhase("fallback");
      });
    }
  }, [
    idleReady,
    motionAllowed,
    phase,
  ]);

  const handleIntroEnded =
    () => {
      if (idleReady) {
        setPhase("idle");
        return;
      }

      /*
       * The idle loop may still be decoding.
       * The intro remains visible until the idle
       * media is genuinely ready.
       */
    };

  const handleIdleReady =
    () => {
      setIdleReady(true);
    };

  useEffect(() => {
    if (!idleReady) return;

    const intro =
      introRef.current;

    const idle =
      idleRef.current;

    if (!intro || !idle) {
      return;
    }

    if (
      !intro.ended &&
      phase !== "idle"
    ) {
      return;
    }

    setPhase("idle");

    idle.currentTime = 0;
    idle.muted = true;

    const playPromise =
      idle.play();

    playPromise?.catch(() => {
      setPhase("fallback");
    });
  }, [idleReady, phase]);

  return (
    <div
      className="hero-media"
      data-phase={phase}
    >
      <Image
        className="hero-media-poster"
        src="/hero/hero-typing-scene.webp"
        alt=""
        fill
        priority
        sizes="(max-width: 900px) 100vw, 58vw"
      />

      {motionAllowed && (
        <>
          <video
            ref={introRef}
            className="hero-media-video hero-media-intro"
            autoPlay
            muted
            playsInline
            preload="auto"
            poster="/hero/hero-typing-scene.webp"
            onEnded={handleIntroEnded}
            onError={() => {
              if (idleReady) {
                setPhase("idle");
              } else {
                setPhase(
                  "fallback"
                );
              }
            }}
          >
            {INTRO_SOURCES.map(
              (source) => (
                <source
                  key={source.src}
                  src={source.src}
                  type={source.type}
                />
              )
            )}
          </video>

          <video
            ref={idleRef}
            className="hero-media-video hero-media-idle"
            muted
            playsInline
            preload="metadata"
            loop
            poster="/hero/hero-typing-scene.webp"
            onCanPlay={handleIdleReady}
            onError={() => {
              if (phase === "idle") {
                setPhase("fallback");
              }
            }}
          >
            {IDLE_SOURCES.map(
              (source) => (
                <source
                  key={source.src}
                  src={source.src}
                  type={source.type}
                />
              )
            )}
          </video>
        </>
      )}
    </div>
  );
}
