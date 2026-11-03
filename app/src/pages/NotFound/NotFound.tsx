import { Container } from '../../components/Layout/Layout'
import { Eyebrow } from '../../components/Eyebrow/Eyebrow'
import { LinkButton } from '../../components/Button/Button'
import styles from './NotFound.module.css'

export function NotFoundPage() {
  return (
    <Container>
      <div className={styles.wrap}>
        <Eyebrow>404</Eyebrow>
        <h1 className={styles.title}>Nothing on this bench.</h1>
        <p className={styles.text}>The page you’re after doesn’t exist, or it wandered off.</p>
        <LinkButton to="/" variant="secondary">
          Back home
        </LinkButton>
      </div>
    </Container>
  )
}
