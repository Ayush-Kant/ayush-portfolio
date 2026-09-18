import Image from "next/image";

import styles from "./HeroScene.module.css";

export default function HeroScene() {
  return (
    <div
      className={styles.scene}
      aria-hidden="true"
    >
      <Image
        className={styles.image}
        src="/hero/hero-typing-scene.webp"
        alt=""
        fill
        priority
        sizes="(max-width: 900px) 100vw, 56vw"
      />

      <div className={styles.edgeBlend} />
      <div className={styles.bottomBlend} />
      <div className={styles.atmosphere} />
    </div>
  );
}
