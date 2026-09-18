import Header from "@/components/header/Header";
import HeroSection from "@/components/hero/HeroSection";
import SkillsSection from "@/components/skills/SkillsSection";

export default function Home() {
  return (
    <>
      <Header />

      <main>
        <HeroSection />
        <SkillsSection />

        <section
          id="projects"
          className="placeholder-section"
          aria-label="Projects"
        >
          <p>Projects</p>
        </section>

        <section
          id="work"
          className="placeholder-section"
          aria-label="Work"
        >
          <p>Work</p>
        </section>

        <section
          id="playground"
          className="placeholder-section"
          aria-label="Playground"
        >
          <p>Playground</p>
        </section>

        <section
          id="community"
          className="placeholder-section"
          aria-label="Community"
        >
          <p>Community</p>
        </section>

        <section
          id="about"
          className="placeholder-section"
          aria-label="About"
        >
          <p>About</p>
        </section>

        <section
          id="contact"
          className="placeholder-section"
          aria-label="Contact"
        >
          <p>Contact</p>
        </section>
      </main>
    </>
  );
}
