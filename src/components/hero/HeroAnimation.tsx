"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
} from "react";

import styles from "./HeroScene.module.css";

type PlaybackPhase = "fallback" | "intro" | "idle";

const INTRO_SOURCES = [
  {
    src: "/hero/hero-intro.webm",
    type: "video/webm",
  },
  {
    src: "/hero/hero-intro.mp4",
    type: "video/mp4",
  },
] as const;

const IDLE_SOURCES = [
  {
    src: "/hero/hero-idle.webm",
    type: "video/webm",
  },
  {
    src: "/hero/hero-idle.mp4",
    type: "video/mp4",
  },
] as const;

export default function HeroAnimation() {
  const introRef =
    useRef<HTMLVideoElement | null>(null);

  const idleRef =
    useRef<HTMLVideoElement | null>(null);

  const [phase, setPhase] =
    useState<PlaybackPhase>("intro");

  const [introReady, setIntroReady] =
    useState(false);

  const [introFinished, setIntroFinished] =
    useState(false);

  const [introFailed, setIntroFailed] =
    useState(false);

  const [idleReady, setIdleReady] =
    useState(false);

  const [reducedMotion, setReducedMotion] =
    useState(false);

  useEffect(() => {
    const mediaQuery =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      );

    const syncPreference = () => {
      setReducedMotion(
        mediaQuery.matches
      );
    };

    syncPreference();

    mediaQuery.addEventListener(
      "change",
      syncPreference
    );

    return () => {
      mediaQuery.removeEventListener(
        "change",
        syncPreference
      );
    };
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setPhase("fallback");
      introRef.current?.pause();
      idleRef.current?.pause();
      return;
    }

    const intro = introRef.current;
    const idle = idleRef.current;

    if (!intro || !idle) {
      return;
    }

    intro.muted = true;
    idle.muted = true;

    /*
     * The idle clip is intentionally requested early so the
     * transition after the greeting can happen without a second
     * network wait.
     */
    idle.load();

    intro
      .play()
      .catch(() => {
        setIntroFailed(true);
      });
  }, [reducedMotion]);

  useEffect(() => {
    if (
      reducedMotion ||
      !introFinished ||
      !idleReady
    ) {
      return;
    }

    setPhase("idle");

    const idle =
      idleRef.current;

    idle?.play().catch(() => {
      setPhase("fallback");
    });
  }, [
    idleReady,
    introFinished,
    reducedMotion,
  ]);

  useEffect(() => {
    if (
      reducedMotion ||
      !introFailed
    ) {
      return;
    }

    if (idleReady) {
      setPhase("idle");

      idleRef.current
        ?.play()
        .catch(() => {
          setPhase("fallback");
        });
    } else {
      setPhase("fallback");
    }
  }, [
    idleReady,
    introFailed,
    reducedMotion,
  ]);

  const handleIntroReady = () => {
    setIntroReady(true);

    introRef.current
      ?.play()
      .catch(() => {
        setIntroFailed(true);
      });
  };

  const handleIntroEnded = () => {
    setIntroFinished(true);
  };

  const handleIdleReady = () => {
    setIdleReady(true);
  };

  const handleIntroError = () => {
    setIntroFailed(true);
  };

  const handleIdleError = () => {
    if (phase === "idle") {
      setPhase("fallback");
    }
  };

  return (
    <div
      className={styles.media}
      data-phase={phase}
      data-intro-ready={
        introReady ? "true" : "false"
      }
      data-idle-ready={
        idleReady ? "true" : "false"
      }
      aria-hidden="true"
    >
      <Image
        className={styles.poster}
        src="/hero/hero-typing-scene.webp"
        alt=""
        fill
        priority
        sizes="(max-width: 900px) 100vw, 58vw"
      />

      {!reducedMotion && (
        <>
          <video
            ref={introRef}
            className={[
              styles.video,
              styles.intro,
            ].join(" ")}
            autoPlay
            muted
            playsInline
            preload="auto"
            poster="/hero/hero-typing-scene.webp"
            onLoadedData={
              handleIntroReady
            }
            onEnded={
              handleIntroEnded
            }
            onError={
              handleIntroError
            }
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
            className={[
              styles.video,
              styles.idle,
            ].join(" ")}
            muted
            playsInline
            preload="metadata"
            loop
            poster="/hero/hero-typing-scene.webp"
            onCanPlay={
              handleIdleReady
            }
            onError={
              handleIdleError
            }
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
