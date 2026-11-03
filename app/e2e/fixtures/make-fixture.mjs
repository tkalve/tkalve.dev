// Generates cube.glb: one mesh named "Cube" with a MeshStandardMaterial "Red".
// Run: node e2e/fixtures/make-fixture.mjs
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import * as THREE from 'three'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'

globalThis.FileReader ??= class {
  readAsArrayBuffer(blob) { blob.arrayBuffer().then((b) => { this.result = b; this.onloadend?.() }) }
  readAsDataURL(blob) { blob.arrayBuffer().then((b) => { this.result = 'data:application/octet-stream;base64,' + Buffer.from(b).toString('base64'); this.onloadend?.() }) }
}

const scene = new THREE.Scene()
const material = new THREE.MeshStandardMaterial({ color: 0xe07a5f, name: 'Red' })
const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material)
mesh.name = 'Cube'
scene.add(mesh)

const buffer = await new GLTFExporter().parseAsync(scene, { binary: true })
const out = join(dirname(fileURLToPath(import.meta.url)), 'cube.glb')
writeFileSync(out, Buffer.from(buffer))
console.log('wrote', out, buffer.byteLength, 'bytes')
