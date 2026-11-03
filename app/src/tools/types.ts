import type { ComponentType, ReactNode } from 'react'

export interface ToolMeta {
  /** URL segment under /tools/ */
  slug: string
  name: string
  tagline: string
  description: string
  category: string
  cta: string
  /** Decorative preview rendered on cards; keep it light. */
  preview: ReactNode
  previewTone: 'teal' | 'peach' | 'sand'
  /** Lowercase file extensions accepted, for display. */
  accepts?: string[]
  /** Lazily loads the tool's root component so heavy deps stay out of the main bundle. */
  load: () => Promise<{ default: ComponentType }>
}
