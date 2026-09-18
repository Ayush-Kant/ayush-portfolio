import styles from "./HeroScene.module.css";
import HeroAnimation from "./HeroAnimation";

export default function HeroScene() {
  return (
    <div
      className={styles.scene}
      aria-hidden="true"
    >
      <HeroAnimation />
      <div className={styles.glow} />
    </div>
  );
}
