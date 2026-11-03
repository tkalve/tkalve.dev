import { Link } from '@tanstack/react-router'
import styles from './Footer.module.css'

const YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div>
          <div className={styles.brand}>tkalve.dev</div>
          <p className={styles.tagline}>A small corner of the internet, made by hand.</p>
        </div>
        <nav className={styles.links} aria-label="Footer">
          <Link to="/about">About</Link>
          <a href="https://github.com/tkalve" target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
        </nav>
        <div className={styles.copy}>© {YEAR} tkalve · Always tinkering</div>
      </div>
    </footer>
  )
}
