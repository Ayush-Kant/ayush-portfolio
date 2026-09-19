"use client";

import Link from "next/link";

import styles from "./ProjectsSection.module.css";
import { PROJECTS } from "./projects.data";

export default function ProjectsSection() {
  const [featured, ...secondary] = PROJECTS;

  return (
    <section
      id="projects"
      className={styles.section}
      aria-labelledby="projects-title"
    >
      <div className={styles.sectionInner}>
        <header className={styles.heading}>
          <div className={styles.headingMeta}>
            <span className={styles.kicker}>
              <span aria-hidden="true">✦</span>
              Selected work
            </span>

            <span className={styles.headingLine} aria-hidden="true" />
            <span className={styles.headingCount}>03 projects</span>
          </div>

          <h2 id="projects-title" className={styles.title}>
            Things I&apos;ve
            <br />
            <span>built for real.</span>
          </h2>

          <p className={styles.intro}>
            A mix of AI systems, developer infrastructure and full-stack
            products — each one built to solve a concrete problem.
          </p>
        </header>

        {featured && (
          <article
            className={
              styles.projectCard + " " + styles.featuredCard
            }
          >
            <div className={styles.cardBackdrop} aria-hidden="true">
              <span className={styles.backdropOrbOne} />
              <span className={styles.backdropOrbTwo} />
              <span className={styles.backdropGrid} />
            </div>

            <div className={styles.cardTopline}>
              <span className={styles.projectNumber}>
                {featured.number}
              </span>

              <span className={styles.projectKind}>
                {featured.kind}
              </span>
            </div>

            <div className={styles.featuredBody}>
              <div className={styles.featuredCopy}>
                <div className={styles.projectStatus}>
                  <span />
                  Featured project
                </div>

                <h3 className={styles.featuredTitle}>
                  {featured.title}
                </h3>

                <p className={styles.featuredDescription}>
                  {featured.description}
                </p>

                <div className={styles.stack}>
                  {featured.stack.map((item) => (
                    <span key={item} className={styles.stackItem}>
                      {item}
                    </span>
                  ))}
                </div>

                <Link
                  href={featured.href}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.projectLink}
                >
                  <span>View repository</span>
                  <span aria-hidden="true">↗</span>
                </Link>
              </div>

              <div className={styles.featuredVisual} aria-hidden="true">
                <div className={styles.terminalWindow}>
                  <div className={styles.terminalTopbar}>
                    <span />
                    <span />
                    <span />
                  </div>

                  <div className={styles.terminalBody}>
                    <p>
                      <b>review</b>
                      <span> → </span>
                      pull_request
                    </p>
                    <p>
                      <i>security</i>
                      <span> + </span>
                      <i>quality</i>
                      <span> + </span>
                      <i>tests</i>
                    </p>
                    <p>
                      <em>retrieve</em>
                      <span> → </span>
                      <em>reason</em>
                      <span> → </span>
                      <em>report</em>
                    </p>
                    <div className={styles.terminalProgress}>
                      <span />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        )}

        <div className={styles.secondaryGrid}>
          {secondary.map((project) => (
            <article
              key={project.id}
              className={
                styles.projectCard + " " + styles.secondaryCard
              }
            >
              <div className={styles.cardTopline}>
                <span className={styles.projectNumber}>
                  {project.number}
                </span>

                <span className={styles.projectKind}>
                  {project.kind}
                </span>
              </div>

              <div className={styles.secondaryBody}>
                <div>
                  <h3 className={styles.secondaryTitle}>
                    {project.title}
                  </h3>

                  <p className={styles.secondaryDescription}>
                    {project.description}
                  </p>
                </div>

                <div>
                  <div className={styles.stack}>
                    {project.stack.map((item) => (
                      <span key={item} className={styles.stackItem}>
                        {item}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={project.href}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.projectLink}
                  >
                    <span>Open project</span>
                    <span aria-hidden="true">↗</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className={styles.sectionFooter}>
          <span>More projects are on the way.</span>
          <Link
            href="https://github.com/Ayush-Kant?tab=repositories"
            target="_blank"
            rel="noreferrer"
          >
            Browse all repositories <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
