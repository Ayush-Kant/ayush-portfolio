import HeroText from "./HeroText";
import HeroScene from "./HeroScene";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="hero-section"
      aria-labelledby="hero-title"
    >
      <HeroScene />

      <div className="hero-content-shell">
        <HeroText />
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
