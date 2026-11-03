import { Container } from '../../components/Layout/Layout'
import { PageHeader } from '../../components/PageHeader/PageHeader'
import styles from './About.module.css'

export function AboutPage() {
  return (
    <Container>
      <PageHeader crumbs={[{ label: 'Home', to: '/' }, { label: 'About' }]} title="About" />
      <div className={styles.prose}>
        <p>
          Hi, I’m Thomas. tkalve.dev is my personal workshop on the web — a place to put small
          tools I build for myself and notes on what I learn along the way.
        </p>
        <p>
          Everything here runs in your browser. Files you open stay on your machine; nothing is
          uploaded.
        </p>
        <p>
          Found a bug or have an idea?{' '}
          <a href="https://github.com/tkalve/tkalve.dev" target="_blank" rel="noreferrer">
            Open an issue on GitHub ↗
          </a>
        </p>
      </div>
    </Container>
  )
}
