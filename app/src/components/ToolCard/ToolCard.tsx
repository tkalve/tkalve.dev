import { Link } from '@tanstack/react-router'
import type { ToolMeta } from '../../tools/types'
import styles from './ToolCard.module.css'

export function ToolCard({ tool }: { tool: ToolMeta }) {
  return (
    <Link to="/tools/$slug" params={{ slug: tool.slug }} className={styles.card}>
      <div className={`${styles.preview} ${styles[tool.previewTone]}`}>{tool.preview}</div>
      <div className={styles.body}>
        <span className={styles.category}>{tool.category}</span>
        <h3 className={styles.title}>{tool.name}</h3>
        <p className={styles.description}>{tool.description}</p>
        <span className={styles.cta}>
          {tool.cta}
          <span aria-hidden="true">↗</span>
        </span>
      </div>
    </Link>
  )
}
