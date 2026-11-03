import { lazy, Suspense, type ComponentType } from 'react'
import { useParams } from '@tanstack/react-router'
import { TOOLS, findTool } from '../../tools/registry'
import { NotFoundPage } from '../NotFound/NotFound'
import styles from './Tool.module.css'

// lazy() defers the import until first render, so building these up front is cheap
// and keeps the component identity stable across renders.
const COMPONENTS: Record<string, ComponentType> = Object.fromEntries(
  TOOLS.map((tool) => [tool.slug, lazy(tool.load)]),
)

export function ToolPage() {
  const { slug } = useParams({ from: '/tools/$slug' })
  const tool = findTool(slug)
  const Component = COMPONENTS[slug]

  if (!tool || !Component) return <NotFoundPage />

  return (
    <Suspense fallback={<div className={styles.loading}>Loading {tool.name}…</div>}>
      <Component />
    </Suspense>
  )
}
