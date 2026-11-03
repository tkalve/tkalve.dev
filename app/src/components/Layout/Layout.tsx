import { useState, type ReactNode } from 'react'
import { Header } from '../Header/Header'
import { HeaderActionsContext } from '../Header/headerActionsContext'
import { Footer } from '../Footer/Footer'
import styles from './Layout.module.css'

export function Layout({ children }: { children: ReactNode }) {
  const [actionsEl, setActionsEl] = useState<HTMLElement | null>(null)
  return (
    <HeaderActionsContext.Provider value={actionsEl}>
      <div className={styles.shell}>
        <Header actionsRef={setActionsEl} />
        <main className={styles.main}>{children}</main>
        <Footer />
      </div>
    </HeaderActionsContext.Provider>
  )
}

interface ContainerProps {
  children: ReactNode
  className?: string
  /** Full-width (no max-width) — used by workbench-style tool pages. */
  wide?: boolean
}

export function Container({ children, className, wide = false }: ContainerProps) {
  return (
    <div className={[styles.container, wide && styles.wide, className].filter(Boolean).join(' ')}>
      {children}
    </div>
  )
}
