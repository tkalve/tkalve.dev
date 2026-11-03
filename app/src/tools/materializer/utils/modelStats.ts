import type * as THREE from 'three'

export interface ModelStats {
  meshes: number
  triangles: number
  materials: number
}

export function computeStats(root: THREE.Object3D): ModelStats {
  let meshes = 0
  let triangles = 0
  const materials = new Set<string>()
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh
    if (!mesh.isMesh) return
    meshes++
    const geometry = mesh.geometry
    if (geometry) {
      const position = geometry.getAttribute('position')
      triangles += geometry.index
        ? geometry.index.count / 3
        : Math.floor((position?.count ?? 0) / 3)
    }
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
    mats.forEach((m) => m && materials.add(m.uuid))
  })
  return { meshes, triangles, materials: materials.size }
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function formatLabel(fileName: string): string {
  const ext = fileName.slice(fileName.lastIndexOf('.') + 1).toLowerCase()
  if (ext === 'glb') return 'glTF binary'
  if (ext === 'gltf') return 'glTF'
  if (ext === 'zip') return 'glTF archive'
  return ext.toUpperCase()
}
