import Image from "next/image";
import Link from "next/link";

import styles from "./Header.module.css";

const NAV_ITEMS = [
  { label: "Projects", href: "#projects" },
  { label: "Work", href: "#work" },
  { label: "Playground", href: "#playground" },
  { label: "Community", href: "#community" },
] as const;

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.leftCluster}>
        <Link
          href="#home"
          className={styles.identity}
          aria-label="Ayush Kant — Home"
        >
          <span className={styles.avatarFrame}>
            <Image
              src="/profile/avatar-pixel.webp"
              alt=""
              fill
              priority
              sizes="52px"
              className={styles.avatar}
            />
          </span>

          <span className={styles.name}>
            Ayush Kant
          </span>
        </Link>
      </div>

      <nav
        className={styles.navShell}
        aria-label="Primary navigation"
      >
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={styles.navItem}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className={styles.rightCluster}>
        <Link
          href="#contact"
          className={styles.connectButton}
        >
          <span>Let&apos;s Connect</span>
          <span
            className={styles.arrow}
            aria-hidden="true"
          >
            →
          </span>
        </Link>
      </div>
    </header>
  );
}
