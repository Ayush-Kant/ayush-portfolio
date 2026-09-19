export default function HeroScene() {
  return (
    <div
      className="hero-scene"
      aria-hidden="true"
    >
      <picture>
        <source
          media="(max-width: 900px)"
          srcSet="/hero/hero-typing-mobile.webp"
        />

        <img
          className="hero-scene-image"
          src="/hero/hero-typing-scene.webp"
          alt=""
          fetchPriority="high"
          loading="eager"
          decoding="async"
        />
      </picture>

      <div className="hero-scene-edge" />
      <div className="hero-scene-bottom" />
      <div className="hero-scene-atmosphere" />
    </div>
  );
}
