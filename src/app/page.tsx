import HeroSection from "@/components/hero/HeroSection";

export default function Home() {
  return (
    <main>
      <HeroSection />

      <section
        id="projects"
        className="placeholder-section"
        aria-label="Projects"
      >
        <p>Projects</p>
      </section>

      <section
        id="about"
        className="placeholder-section"
        aria-label="About"
      >
        <p>About</p>
      </section>
    </main>
  );
}
