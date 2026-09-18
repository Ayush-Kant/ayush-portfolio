import HeroText from "./HeroText";
import HeroScene from "./HeroScene";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="hero-section"
      aria-labelledby="hero-title"
    >
      <div className="hero-shell">
        <div className="hero-text-column">
          <HeroText />
        </div>
      </div>

      <div className="hero-scene-column">
        <HeroScene />
      </div>

      <div
        className="hero-scroll-cue"
        aria-hidden="true"
      >
        <span className="hero-scroll-dot" />
        <span>Scroll to explore</span>
        <span>↓</span>
      </div>
    </section>
  );
}
