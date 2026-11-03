import { useContext, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { HeaderActionsContext } from './headerActionsContext'

/** Renders children into the Header's action slot (tool pages only). */
export function HeaderActions({ children }: { children: ReactNode }) {
  const target = useContext(HeaderActionsContext)
  if (!target) return null
  return createPortal(children, target)
}
