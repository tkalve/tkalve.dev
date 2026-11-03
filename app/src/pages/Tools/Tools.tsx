import { Container } from '../../components/Layout/Layout'
import { PageHeader } from '../../components/PageHeader/PageHeader'
import { ToolCard } from '../../components/ToolCard/ToolCard'
import { TOOLS } from '../../tools/registry'
import styles from './Tools.module.css'

export function ToolsPage() {
  return (
    <Container>
      <PageHeader
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Tools' }]}
        title="Tools"
        subtitle="Small, focused utilities that run entirely in your browser."
      />
      <div className={styles.grid}>
        {TOOLS.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </Container>
  )
}
