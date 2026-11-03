import type { ReactNode } from 'react'
import styles from './Eyebrow.module.css'

export function Eyebrow({ children, dot = false }: { children: ReactNode; dot?: boolean }) {
  return (
    <span className={styles.eyebrow}>
      {dot && <span className={styles.dot} />}
      {children}
    </span>
  )
}
