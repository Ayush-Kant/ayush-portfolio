import HeroAnimation from "./HeroAnimation";

export default function HeroScene() {
  return (
    <div
      className="hero-scene"
      aria-hidden="true"
    >
      <HeroAnimation />

      <div
        className="hero-scene-glow"
      />
    </div>
  );
}
