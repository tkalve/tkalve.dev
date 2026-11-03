import { Link, type LinkProps } from '@tanstack/react-router'
import styles from './Breadcrumb.module.css'

export interface Crumb {
  label: string
  to?: LinkProps['to']
}

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
      {items.map((item, i) => (
        <span key={item.label} className={styles.item}>
          {i > 0 && <span className={styles.sep}>/</span>}
          {item.to ? (
            <Link to={item.to} className={styles.link}>
              {item.label}
            </Link>
          ) : (
            <span aria-current="page">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
