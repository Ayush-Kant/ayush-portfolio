"use client";

import styles from "./BeeCursor.module.css";
import BeeArtwork from "./BeeArtwork";
import { useBeeCursor } from "./useBeeCursor";

export default function BeeCursor() {
  const { rootRef } =
    useBeeCursor();

  return (
    <div
      ref={rootRef}
      className={styles.cursor}
      data-enabled="false"
      data-visible="false"
      data-state="flying"
      aria-hidden="true"
    >
      <div className={styles.artLayer}>
        <BeeArtwork />
      </div>
    </div>
  );
}
