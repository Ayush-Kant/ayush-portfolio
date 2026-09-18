import Link from "next/link";

export default function HeroText() {
  return (
    <div className="hero-copy">
      <p className="hero-kicker">
        <span className="hero-terminal-prompt">
          &gt;
        </span>
        HELLO WORLD!
        <span
          className="hero-kicker-star"
          aria-hidden="true"
        >
          ✦
        </span>
      </p>

      <h1
        id="hero-title"
        className="hero-title"
      >
        <span className="hero-title-line">
          Hi, I&apos;m
        </span>

        <span className="hero-title-line hero-title-accent">
          Ayush Kant
        </span>
      </h1>

      <p className="hero-role">
        Full Stack Developer
        <span aria-hidden="true">
          {" "}·{" "}
        </span>
        Builder
        <span aria-hidden="true">
          {" "}·{" "}
        </span>
        Problem Solver
      </p>

      <p className="hero-description">
        I build scalable web experiences,
        intelligent products, and tools that
        turn ideas into something people can
        actually use.
      </p>

      <div
        className="hero-proof"
        aria-label="Highlights"
      >
        <span>SIH Finalist</span>
        <span>2× Hackathon Winner</span>
        <span>Lead</span>
      </div>

      <div className="hero-actions">
        <Link
          href="#projects"
          className="hero-button hero-button-primary"
        >
          View My Work
          <span aria-hidden="true">
            →
          </span>
        </Link>

        <Link
          href="#about"
          className="hero-button hero-button-secondary"
        >
          About Me
          <span aria-hidden="true">
            ↗
          </span>
        </Link>
      </div>

      <p className="hero-signature">
        Building with curiosity.
        <br />
        Shipping with intention.
      </p>
    </div>
  );
}
