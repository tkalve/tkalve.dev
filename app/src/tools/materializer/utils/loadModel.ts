import JSZip from 'jszip'
import * as THREE from 'three'
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

function makeLoader(manager?: THREE.LoadingManager): GLTFLoader {
  const loader = new GLTFLoader(manager)
  const draco = new DRACOLoader()
  draco.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/')
  loader.setDRACOLoader(draco)
  return loader
}

async function loadFromArrayBuffer(buffer: ArrayBuffer): Promise<GLTF> {
  const loader = makeLoader()
  return loader.parseAsync(buffer, '')
}

async function loadFromZip(file: File): Promise<GLTF> {
  const zip = await JSZip.loadAsync(file)

  const entries = Object.values(zip.files).filter((f) => !f.dir)
  const gltfEntry = entries.find((f) => /\.gltf$/i.test(f.name))
  const glbEntry = entries.find((f) => /\.glb$/i.test(f.name))

  if (!gltfEntry && !glbEntry) {
    throw new Error('No .gltf or .glb file found inside the archive.')
  }

  // A standalone .glb inside the zip needs no external resources.
  if (glbEntry && !gltfEntry) {
    const buffer = await glbEntry.async('arraybuffer')
    return loadFromArrayBuffer(buffer)
  }

  const gltf = gltfEntry!
  // Build blob URLs for every archive entry so relative references resolve.
  const baseDir = gltf.name.includes('/')
    ? gltf.name.slice(0, gltf.name.lastIndexOf('/') + 1)
    : ''

  const blobUrls = new Map<string, string>()
  await Promise.all(
    entries.map(async (entry) => {
      const blob = await entry.async('blob')
      blobUrls.set(entry.name, URL.createObjectURL(blob))
    }),
  )

  const manager = new THREE.LoadingManager()
  manager.setURLModifier((url) => {
    // Normalize the requested URL to an archive-relative path.
    let path = decodeURIComponent(url)
    path = path.replace(/^\.?\//, '')
    const candidates = [path, baseDir + path]
    for (const candidate of candidates) {
      const normalized = candidate.replace(/^\.\//, '')
      if (blobUrls.has(normalized)) return blobUrls.get(normalized)!
    }
    // Fall back to matching by file name only.
    const fileName = path.slice(path.lastIndexOf('/') + 1)
    for (const [name, blobUrl] of blobUrls) {
      if (name.slice(name.lastIndexOf('/') + 1) === fileName) return blobUrl
    }
    return url
  })

  try {
    const loader = makeLoader(manager)
    const json = await gltf.async('string')
    return await loader.parseAsync(json, baseDir)
  } finally {
    // Revoke after parsing completes to avoid leaking object URLs.
    setTimeout(() => {
      for (const blobUrl of blobUrls.values()) URL.revokeObjectURL(blobUrl)
    }, 0)
  }
}

export async function loadModel(file: File): Promise<GLTF> {
  const name = file.name.toLowerCase()
  if (name.endsWith('.zip')) return loadFromZip(file)
  if (name.endsWith('.glb') || name.endsWith('.gltf')) {
    const buffer = await file.arrayBuffer()
    return loadFromArrayBuffer(buffer)
  }
  throw new Error('Unsupported file. Please upload a .glb, .gltf, or .zip file.')
}
