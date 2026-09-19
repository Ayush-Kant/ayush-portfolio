import styles from "./SkillsSection.module.css";

export default function SkillsIntro() {
  return (
    <div className={styles.introColumn}>
      <p className={styles.kicker}>
        <span aria-hidden="true">✦</span>
        The toolkit
      </p>

      <h2
        id="skills-title"
        className={styles.title}
      >
        My toolkit
        <br />
        is physical.
      </h2>

      <p className={styles.copy}>
        Pick up a skill, move it around, and
        drop it into the tray. The cards have
        weight, friction, and a little bounce.
      </p>

      <div
        className={styles.meta}
        aria-hidden="true"
      >
        <span>20 technologies</span>
        <span>drag · toss · stack</span>
      </div>
    </div>
  );
}
