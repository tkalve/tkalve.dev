import * as THREE from 'three'

export const MATERIAL_TYPES = [
  'MeshStandardMaterial',
  'MeshPhysicalMaterial',
  'MeshPhongMaterial',
  'MeshLambertMaterial',
  'MeshBasicMaterial',
  'MeshToonMaterial',
] as const

export type MaterialType = (typeof MATERIAL_TYPES)[number]

export const MATERIAL_TYPE_LABELS: Record<MaterialType, string> = {
  MeshStandardMaterial: 'Standard (PBR)',
  MeshPhysicalMaterial: 'Physical (PBR+)',
  MeshPhongMaterial: 'Phong',
  MeshLambertMaterial: 'Lambert',
  MeshBasicMaterial: 'Basic (unlit)',
  MeshToonMaterial: 'Toon',
}

const CONSTRUCTORS: Record<MaterialType, new () => THREE.Material> = {
  MeshStandardMaterial: THREE.MeshStandardMaterial,
  MeshPhysicalMaterial: THREE.MeshPhysicalMaterial,
  MeshPhongMaterial: THREE.MeshPhongMaterial,
  MeshLambertMaterial: THREE.MeshLambertMaterial,
  MeshBasicMaterial: THREE.MeshBasicMaterial,
  MeshToonMaterial: THREE.MeshToonMaterial,
}

// Properties copied across when they exist on both source and target.
const SHARED_PROPS = [
  'name',
  'color',
  'emissive',
  'emissiveIntensity',
  'map',
  'emissiveMap',
  'normalMap',
  'normalScale',
  'aoMap',
  'aoMapIntensity',
  'alphaMap',
  'bumpMap',
  'bumpScale',
  'displacementMap',
  'envMap',
  'roughness',
  'roughnessMap',
  'metalness',
  'metalnessMap',
  'opacity',
  'transparent',
  'alphaTest',
  'side',
  'depthWrite',
  'depthTest',
  'vertexColors',
  'flatShading',
  'wireframe',
] as const

export function convertMaterial(
  source: THREE.Material,
  type: MaterialType,
): THREE.Material {
  if (source.type === type) return source

  const target = new CONSTRUCTORS[type]()
  const src = source as unknown as Record<string, unknown>
  const dst = target as unknown as Record<string, unknown>

  for (const key of SHARED_PROPS) {
    if (!(key in src) || !(key in dst)) continue
    const value = src[key]
    if (value === undefined || value === null) continue
    if (value instanceof THREE.Color) {
      ;(dst[key] as THREE.Color).copy(value)
    } else if (value instanceof THREE.Vector2) {
      ;(dst[key] as THREE.Vector2).copy(value)
    } else {
      dst[key] = value
    }
  }

  target.userData = { ...source.userData }
  target.needsUpdate = true
  return target
}
