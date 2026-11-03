import { Outlet, useRouterState } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Layout } from './Layout'
import { findTool } from '../../tools/registry'

const SITE = 'tkalve.dev'

export function RootComponent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  useEffect(() => {
    const slug = pathname.match(/^\/tools\/([^/]+)/)?.[1]
    const tool = slug ? findTool(slug) : undefined
    const page = tool?.name ?? { '/': null, '/tools': 'Tools', '/about': 'About' }[pathname]
    document.title = page ? `${page} · ${SITE}` : SITE
  }, [pathname])

  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}
