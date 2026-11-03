import { describe, expect, it } from 'vitest'
import * as THREE from 'three'
import { computeStats, formatBytes, formatLabel } from './modelStats'

function mesh(name: string, material: THREE.Material | THREE.Material[]) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material)
  m.name = name
  return m
}

describe('computeStats', () => {
  it('counts meshes, indexed triangles and unique materials', () => {
    const shared = new THREE.MeshStandardMaterial()
    const root = new THREE.Group()
    root.add(mesh('a', shared), mesh('b', shared), mesh('c', new THREE.MeshBasicMaterial()))

    // BoxGeometry is indexed: 6 faces × 2 triangles.
    expect(computeStats(root)).toEqual({ meshes: 3, triangles: 36, materials: 2 })
  })

  it('handles non-indexed geometry and material arrays', () => {
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(9 * 3), 3))
    const m = new THREE.Mesh(geometry, [new THREE.MeshBasicMaterial(), new THREE.MeshBasicMaterial()])
    const root = new THREE.Group()
    root.add(m)

    expect(computeStats(root)).toEqual({ meshes: 1, triangles: 3, materials: 2 })
  })

  it('returns zeros for an empty scene', () => {
    expect(computeStats(new THREE.Group())).toEqual({ meshes: 0, triangles: 0, materials: 0 })
  })
})

describe('formatBytes', () => {
  it('picks the right unit', () => {
    expect(formatBytes(512)).toBe('512 B')
    expect(formatBytes(84_200)).toBe('82.2 KB')
    expect(formatBytes(3 * 1024 * 1024)).toBe('3.0 MB')
  })
})

describe('formatLabel', () => {
  it('maps known extensions and falls back to uppercase', () => {
    expect(formatLabel('chair.glb')).toBe('glTF binary')
    expect(formatLabel('chair.GLTF')).toBe('glTF')
    expect(formatLabel('chair.zip')).toBe('glTF archive')
    expect(formatLabel('chair.obj')).toBe('OBJ')
  })
})
