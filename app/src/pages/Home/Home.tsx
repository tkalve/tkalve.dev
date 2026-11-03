import { Container } from '../../components/Layout/Layout'
import { Eyebrow } from '../../components/Eyebrow/Eyebrow'
import { LinkButton } from '../../components/Button/Button'
import { ToolCard } from '../../components/ToolCard/ToolCard'
import { TOOLS } from '../../tools/registry'
import { HeroIllustration } from './HeroIllustration'
import styles from './Home.module.css'

export function HomePage() {
  return (
    <Container>
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <Eyebrow dot>A personal workshop on the web</Eyebrow>
          <h1 className={styles.title}>
            Useful things.
            <br />
            Playful detours.
          </h1>
          <p className={styles.lede}>
            Hi, I’m Thomas. I make little tools and write about what I learn along the way. Come
            have a look around.
          </p>
          <div className={styles.ctas}>
            <LinkButton to="/tools" size="lg" icon={<span aria-hidden="true">→</span>}>
              Explore the tools
            </LinkButton>
            <LinkButton to="/about" size="lg" variant="secondary">
              A bit about me
            </LinkButton>
          </div>
        </div>
        <HeroIllustration />
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div className={styles.sectionTitle}>
            <h2>On the workbench</h2>
            <Eyebrow>A few things to try</Eyebrow>
          </div>
          <LinkButton to="/tools" variant="ghost" iconRight={<span aria-hidden="true">↗</span>}>
            View everything
          </LinkButton>
        </div>
        <div className={styles.grid}>
          {TOOLS.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
          <div className={styles.note}>
            <Eyebrow>Not a product. A practice.</Eyebrow>
            <h3>A place for the things I make, not just the things I finish.</h3>
            <p>Built slowly. Shared freely. — Thomas</p>
          </div>
        </div>
      </section>
    </Container>
  )
}
