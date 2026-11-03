import styles from './CubePreview.module.css'

/** Isometric cube illustration used on the Materializer tool card. */
export function CubePreview() {
  return (
    <div className={styles.wrap}>
      <svg viewBox="0 0 140 160" className={styles.cube} aria-hidden="true">
        <polygon points="70,10 130,45 70,80 10,45" fill="var(--teal)" stroke="var(--twilight-indigo)" strokeWidth="2" strokeLinejoin="round" />
        <polygon points="10,45 70,80 70,150 10,115" fill="var(--surface)" stroke="var(--twilight-indigo)" strokeWidth="2" strokeLinejoin="round" />
        <polygon points="130,45 70,80 70,150 130,115" fill="var(--surface)" stroke="var(--twilight-indigo)" strokeWidth="2" strokeLinejoin="round" />
      </svg>
      <span className={styles.coords}>X 0.00 / Y 0.00 / Z 0.00</span>
    </div>
  )
}
