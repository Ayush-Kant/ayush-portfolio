import styles from "./SkillsSection.module.css";

import SkillPhysicsTray from "./SkillPhysicsTray";

export default function SkillsSection() {
  return (
    <section
      id="skills"
      className={styles.section}
      aria-labelledby="skills-title"
    >
      <div className={styles.shell}>
        <header className={styles.heading}>
          <p className={styles.kicker}>
            <span aria-hidden="true">✦</span>
            The toolkit
          </p>

          <h2
            id="skills-title"
            className={styles.title}
          >
            Start with
            <br />
            one box.
          </h2>

          <p className={styles.intro}>
            Double-click and hold the JavaScript box,
            move it around the tray, then release it.
            It should fall, bounce once, and settle
            naturally.
          </p>
        </header>

        <SkillPhysicsTray />
      </div>
    </section>
  );
}
