import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import { RootComponent } from './components/Layout/RootComponent'
import { HomePage } from './pages/Home/Home'
import { ToolsPage } from './pages/Tools/Tools'
import { ToolPage } from './pages/Tool/Tool'
import { AboutPage } from './pages/About/About'
import { NotFoundPage } from './pages/NotFound/NotFound'

const rootRoute = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundPage,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

const toolsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tools',
  component: ToolsPage,
})

const toolRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tools/$slug',
  component: ToolPage,
})

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
})

const routeTree = rootRoute.addChildren([indexRoute, toolsRoute, toolRoute, aboutRoute])

export const router = createRouter({
  routeTree,
  scrollRestoration: true,
  defaultPreload: 'intent',
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
