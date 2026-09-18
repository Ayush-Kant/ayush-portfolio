import Link from "next/link";
import Typewriter from "./Typewriter";

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
          <span className="hero-title-muted">
            Hi, I&apos;m
          </span>
        </span>

        <span className="hero-title-line hero-title-accent">
          Ayush Kant
        </span>
      </h1>

      <p className="hero-description">
        <Typewriter
          text="I build digital products that create real impact."
        />
      </p>

      <div
        className="hero-badges"
        aria-label="Core focus"
      >
        <span className="hero-badge">
          <span aria-hidden="true">⌘</span>
          Full Stack
        </span>

        <span className="hero-badge">
          <span aria-hidden="true">✦</span>
          Problem Solver
        </span>

        <span className="hero-badge">
          <span aria-hidden="true">◈</span>
          Open Source
        </span>
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

      <div
        className="hero-proof"
        aria-label="Highlights"
      >
        <span>SIH Finalist</span>
        <span>2× Hackathon Winner</span>
        <span>Lead</span>
      </div>

      <p className="hero-signature">
        Building with curiosity.
        <br />
        Shipping with intention.
      </p>
    </div>
  );
}
