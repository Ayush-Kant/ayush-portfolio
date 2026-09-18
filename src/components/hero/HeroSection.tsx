"use client";

import { useHeroIntro } from "./useHeroIntro";
import HeroText from "./HeroText";
import HeroScene from "./HeroScene";

export default function HeroSection() {
  const heroRef =
    useHeroIntro();

  return (
    <section
      id="home"
      ref={heroRef}
      className="hero-section"
      aria-labelledby="hero-title"
    >
      <div className="hero-shell">
        <div className="hero-text-column">
          <HeroText />
        </div>

        <div className="hero-scene-column">
          <HeroScene />
        </div>
      </div>

      <div className="hero-scroll-cue">
        <span className="hero-scroll-dot" />
        <span>
          Scroll to explore
        </span>
        <span aria-hidden="true">
          ↓
        </span>
      </div>
    </section>
  );
}
