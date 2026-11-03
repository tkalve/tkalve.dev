import { describe, expect, it } from 'vitest'
import * as THREE from 'three'
import { convertMaterial, MATERIAL_TYPES, MATERIAL_TYPE_LABELS } from './materialTypes'

describe('convertMaterial', () => {
  it('returns the same instance when the type is unchanged', () => {
    const m = new THREE.MeshStandardMaterial()
    expect(convertMaterial(m, 'MeshStandardMaterial')).toBe(m)
  })

  it('copies shared properties into the new type', () => {
    const src = new THREE.MeshStandardMaterial({
      name: 'Paint',
      color: 0xe07a5f,
      opacity: 0.5,
      transparent: true,
      side: THREE.DoubleSide,
      roughness: 0.2,
    })
    src.userData = { tag: 'x' }

    const out = convertMaterial(src, 'MeshPhongMaterial') as THREE.MeshPhongMaterial

    expect(out.type).toBe('MeshPhongMaterial')
    expect(out.name).toBe('Paint')
    expect(out.color.getHex()).toBe(0xe07a5f)
    expect(out.opacity).toBe(0.5)
    expect(out.transparent).toBe(true)
    expect(out.side).toBe(THREE.DoubleSide)
    expect(out.userData).toEqual({ tag: 'x' })
    // Phong has no roughness; it must simply be skipped.
    expect('roughness' in out).toBe(false)
  })

  it('does not alias Color instances between source and target', () => {
    const src = new THREE.MeshStandardMaterial({ color: 0x112233 })
    const out = convertMaterial(src, 'MeshBasicMaterial') as THREE.MeshBasicMaterial
    out.color.set(0xffffff)
    expect(src.color.getHex()).toBe(0x112233)
  })

  it('has a label for every supported type', () => {
    for (const t of MATERIAL_TYPES) expect(MATERIAL_TYPE_LABELS[t]).toBeTruthy()
  })
})
