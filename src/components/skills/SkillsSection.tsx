import SkillsIntro from "./SkillsIntro";
import SkillPhysicsPlayground from "./SkillPhysicsPlayground";

export default function SkillsSection() {
  return (
    <section
      id="skills"
      className="skills-section"
      aria-labelledby="skills-title"
    >
      <div className="skills-shell">
        <SkillsIntro />
        <SkillPhysicsPlayground />
      </div>
    </section>
  );
}
