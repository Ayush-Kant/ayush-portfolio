import styles from "./SkillsSection.module.css";

import SkillsIntro from "./SkillsIntro";
import SkillPhysicsPlayground from "./SkillPhysicsPlayground";

export default function SkillsSection() {
  return (
    <section
      id="skills"
      className={styles.section}
      aria-labelledby="skills-title"
    >
      <div className={styles.shell}>
        <SkillsIntro />
        <SkillPhysicsPlayground />
      </div>
    </section>
  );
}
