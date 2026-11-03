import { describe, expect, it } from 'vitest'
import { findTool, TOOLS } from './registry'

describe('tool registry', () => {
  it('has unique, URL-safe slugs', () => {
    const slugs = TOOLS.map((t) => t.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9-]+$/)
  })

  it('finds tools by slug and returns undefined otherwise', () => {
    expect(findTool('materializer')?.name).toBe('Materializer')
    expect(findTool('nope')).toBeUndefined()
  })
})
