import styles from "./SkillsSection.module.css";

import SkillPhysicsTray from "./SkillPhysicsTray";

export default function SkillsSection() {
  return (
    <section
      id="skills"
      className={styles.section}
      aria-labelledby="skills-title"
    >
      <div className={styles.sectionInner}>
        <header className={styles.heading}>
          <p className={styles.kicker}>
            <span aria-hidden="true">✦</span>
            The toolkit
          </p>

          <h2
            id="skills-title"
            className={styles.title}
          >
            Pick it up.
            <br />
            See what I built.
          </h2>

          <p className={styles.intro}>
            Press and hold the skill box to move it
            around the tray. Double-click it to summon
            the story behind the tool.
          </p>
        </header>

        <SkillPhysicsTray />
      </div>
    </section>
  );
}
