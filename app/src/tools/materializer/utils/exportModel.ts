import * as THREE from 'three'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'

// GLTFLoader returns the model root as a Group. GLTFExporter treats any
// non-Scene input as a node and wraps it in a fresh scene, which adds an extra
// hierarchy level on every load/export round-trip. Re-host the model's children
// in a real THREE.Scene (cloning so the live scene is untouched) so they export
// as top-level scene nodes. Clones share geometry and material references, so
// material edits are preserved.
function toScene(root: THREE.Object3D): THREE.Scene {
  const scene = new THREE.Scene()
  scene.name = root.name
  scene.position.copy(root.position)
  scene.quaternion.copy(root.quaternion)
  scene.scale.copy(root.scale)
  for (const child of root.children) scene.add(child.clone())
  return scene
}

export async function exportGLB(root: THREE.Object3D): Promise<Blob> {
  const exporter = new GLTFExporter()
  const result = await exporter.parseAsync(toScene(root), { binary: true })
  return new Blob([result as ArrayBuffer], { type: 'model/gltf-binary' })
}

export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  anchor.click()
  setTimeout(() => URL.revokeObjectURL(url), 0)
}
