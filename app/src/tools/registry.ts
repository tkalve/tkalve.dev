import type { ToolMeta } from './types'
import { materializerMeta } from './materializer/meta'

export const TOOLS: ToolMeta[] = [materializerMeta]

export function findTool(slug: string): ToolMeta | undefined {
  return TOOLS.find((t) => t.slug === slug)
}
