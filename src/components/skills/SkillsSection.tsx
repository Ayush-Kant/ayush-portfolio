import styles from "./SkillsSection.module.css";
import { SKILL_GROUPS } from "./skills.data";

export default function SkillsSection() {
  return (
    <section
      id="skills"
      className={styles.section}
      aria-labelledby="skills-title"
    >
      <div className={styles.shell}>
        <div className={styles.heading}>
          <p className={styles.kicker}>
            <span aria-hidden="true">✦</span>
            The toolkit
          </p>

          <h2
            id="skills-title"
            className={styles.title}
          >
            Things I use
            <br />
            to build.
          </h2>

          <p className={styles.intro}>
            A practical stack for turning ideas
            into interfaces, products, and
            working systems.
          </p>
        </div>

        <div className={styles.groups}>
          {SKILL_GROUPS.map((group) => (
            <div
              className={styles.group}
              key={group.label}
            >
              <p className={styles.label}>
                {group.label}
              </p>

              <div className={styles.list}>
                {group.skills.map((skill) => (
                  <span
                    className={styles.chip}
                    key={skill}
                  >
                    <span
                      className={styles.dot}
                      aria-hidden="true"
                    />
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
