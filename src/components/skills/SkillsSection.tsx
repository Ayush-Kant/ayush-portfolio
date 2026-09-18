import { SKILL_GROUPS } from "./skills.data";

export default function SkillsSection() {
  return (
    <section
      id="skills"
      className="skills-section"
      aria-labelledby="skills-title"
    >
      <div className="skills-shell">
        <div className="skills-heading">
          <p className="skills-kicker">
            <span aria-hidden="true">✦</span>
            The toolkit
          </p>

          <h2
            id="skills-title"
            className="skills-title"
          >
            Things I use
            <br />
            to build.
          </h2>

          <p className="skills-intro">
            A practical stack I use to turn ideas
            into interfaces, products, and
            working systems.
          </p>
        </div>

        <div className="skills-groups">
          {SKILL_GROUPS.map((group) => (
            <div
              className="skills-group"
              key={group.label}
            >
              <p className="skills-group-label">
                {group.label}
              </p>

              <div className="skills-list">
                {group.skills.map((skill) => (
                  <span
                    className="skill-chip"
                    key={skill}
                  >
                    <span
                      className="skill-chip-dot"
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
