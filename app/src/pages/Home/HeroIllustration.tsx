import styles from './HeroIllustration.module.css'

/** Isometric chair on a grid, echoing the Figma home hero. */
export function HeroIllustration() {
  return (
    <div className={styles.panel} aria-hidden="true">
      <span className={styles.chip}>
        <svg viewBox="0 0 16 16" width="14" height="14">
          <path
            d="M8 1.5 14 5v6l-6 3.5L2 11V5l6-3.5Zm0 1.2L3.2 5.5 8 8.3l4.8-2.8L8 2.7ZM3 6.6v3.8l4.5 2.6V9.2L3 6.6Zm10 0L8.5 9.2V13L13 10.4V6.6Z"
            fill="currentColor"
          />
        </svg>
        little-chair.glb
      </span>

      <svg viewBox="0 0 320 320" className={styles.chair}>
        <ellipse cx="160" cy="276" rx="92" ry="16" fill="rgba(61,64,91,0.08)" />
        {/* back */}
        <polygon points="120,32 200,78 200,170 120,124" fill="#c86a50" />
        <polygon points="200,78 214,70 214,162 200,170" fill="#b85c45" />
        <polygon points="120,32 134,24 214,70 200,78" fill="#e07a5f" />
        {/* seat */}
        <polygon points="60,156 160,100 260,156 160,212" fill="#f0a88e" />
        <polygon points="60,156 160,212 160,236 60,180" fill="#c86a50" />
        <polygon points="160,212 260,156 260,180 160,236" fill="#b85c45" />
        {/* legs */}
        <rect x="62" y="178" width="12" height="60" fill="#b85c45" />
        <rect x="246" y="178" width="12" height="60" fill="#b85c45" />
        <rect x="154" y="234" width="12" height="54" fill="#a85040" />
      </svg>

      <span className={styles.sticker}>made to tinker</span>
      <span className={styles.caption}>
        <span className={styles.dot} />
        Small ideas, taking shape.
      </span>
      <span className={styles.axes}>X / Y / Z</span>
    </div>
  )
}
