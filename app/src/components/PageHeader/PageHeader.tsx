import type { ReactNode } from 'react'
import { Breadcrumb, type Crumb } from '../Breadcrumb/Breadcrumb'
import styles from './PageHeader.module.css'

interface PageHeaderProps {
  title: string
  subtitle?: string
  crumbs?: Crumb[]
  actions?: ReactNode
}

export function PageHeader({ title, subtitle, crumbs, actions }: PageHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.text}>
        {crumbs && <Breadcrumb items={crumbs} />}
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  )
}
