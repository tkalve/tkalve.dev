import { createContext } from 'react'

/** Portal target in the Header where tool pages can mount their primary actions. */
export const HeaderActionsContext = createContext<HTMLElement | null>(null)
