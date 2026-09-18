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
        sizes="100vw"
      />

      <div className={styles.leftBlend} />
      <div className={styles.topBlend} />
      <div className={styles.bottomBlend} />
      <div className={styles.colorAtmosphere} />
    </div>
  );
}
