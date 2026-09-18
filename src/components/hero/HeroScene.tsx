import Image from "next/image";
import styles from "./HeroScene.module.css";
import { HERO_CONFIG } from "./hero.config";

export default function HeroScene() {
  return (
    <div
      className={styles.scene}
      aria-hidden="true"
    >
      <Image
        className={styles.baseImage}
        src="/hero/hero-typing.webp"
        alt=""
        fill
        priority
        sizes="(max-width: 900px) 100vw, 58vw"
      />

      <div
        className={
          styles.waveLayer
        }
        style={{
          clipPath:
            HERO_CONFIG.scene.handClip,
        }}
      >
        <Image
          className={styles.overlayImage}
          src="/hero/hero-wave.webp"
          alt=""
          fill
          priority
          sizes="(max-width: 900px) 100vw, 58vw"
        />
      </div>

      <div
        className={styles.typingHandLayer}
        style={{
          clipPath:
            HERO_CONFIG.scene
              .typingHandClip,
        }}
      >
        <Image
          className={styles.overlayImage}
          src="/hero/hero-typing.webp"
          alt=""
          fill
          sizes="(max-width: 900px) 100vw, 58vw"
        />
      </div>

      <div
        className={styles.catLayer}
        style={{
          clipPath:
            HERO_CONFIG.scene.catClip,
        }}
      >
        <Image
          className={styles.overlayImage}
          src="/hero/hero-typing.webp"
          alt=""
          fill
          sizes="(max-width: 900px) 100vw, 58vw"
        />
      </div>

      <div className={styles.sceneGlow} />
    </div>
  );
}
