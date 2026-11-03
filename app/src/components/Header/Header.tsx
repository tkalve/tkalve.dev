import { Link, useRouterState } from '@tanstack/react-router'
import monogram from '../../assets/monogram.svg'
import { findTool } from '../../tools/registry'
import { Breadcrumb } from '../Breadcrumb/Breadcrumb'
import styles from './Header.module.css'

const NAV = [
  { to: '/', label: 'Home' },
  { to: '/tools', label: 'Tools' },
  { to: '/about', label: 'About' },
] as const

interface HeaderProps {
  /** Receives the element tool pages portal their actions into. */
  actionsRef: (el: HTMLElement | null) => void
}

export function Header({ actionsRef }: HeaderProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const slug = pathname.match(/^\/tools\/([^/]+)/)?.[1]
  const tool = slug ? findTool(slug) : undefined

  return (
    <header className={`${styles.header} ${tool ? styles.toolMode : ''}`}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand} aria-label="tkalve.dev home">
          <img src={monogram} alt="" className={styles.logo} width={36} height={36} />
          {!tool && <span className={styles.name}>tkalve.dev</span>}
        </Link>

        {tool ? (
          <div className={styles.tool}>
            <div className={styles.toolTitle}>
              <Breadcrumb items={[{ label: 'Tools', to: '/tools' }, { label: tool.name }]} />
              <h1 className={styles.toolName}>{tool.name}</h1>
            </div>
            <span className={styles.divider} />
            <p className={styles.toolTagline}>{tool.tagline}</p>
          </div>
        ) : (
          <nav className={styles.nav} aria-label="Main">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={styles.navLink}
                activeProps={{ className: `${styles.navLink} ${styles.active}` }}
                activeOptions={{ exact: item.to === '/' }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        <div className={styles.actions} ref={actionsRef}>
          {!tool && (
            <a
              className={styles.source}
              href="https://github.com/tkalve/tkalve.dev"
              target="_blank"
              rel="noreferrer"
            >
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"
                />
              </svg>
              Source
            </a>
          )}
        </div>
      </div>
    </header>
  )
}
