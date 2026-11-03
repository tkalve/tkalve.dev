/* Mesh material reassignment intentionally mutates the live Three.js object. */
/* oxlint-disable react/immutability */
import { useState } from 'react'
import * as THREE from 'three'
import { Button } from '../../../../components/Button/Button'
import { MaterialEditor } from '../MaterialEditor/MaterialEditor'
import styles from './InfoPanel.module.css'

function formatVec(v: THREE.Vector3 | THREE.Euler): string {
  const x = 'x' in v ? v.x : 0
  const y = 'y' in v ? v.y : 0
  const z = 'z' in v ? v.z : 0
  return `${x.toFixed(3)}, ${y.toFixed(3)}, ${z.toFixed(3)}`
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={styles.row}>
      <span className={styles.key}>{label}</span>
      <span className={styles.val}>{children}</span>
    </div>
  )
}

function collectMaterials(root: THREE.Object3D): THREE.Material[] {
  const map = new Map<string, THREE.Material>()
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh
    if (!mesh.isMesh || !mesh.material) return
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
    mats.forEach((m) => map.set(m.uuid, m))
  })
  return [...map.values()]
}

function materialLabel(m: THREE.Material): string {
  return `${m.name || '(unnamed)'} — ${m.type}`
}

function MaterialPicker({
  available,
  current,
  onAssign,
}: {
  available: THREE.Material[]
  current: THREE.Material
  onAssign: (material: THREE.Material) => void
}) {
  return (
    <select
      className={styles.select}
      value={current.uuid}
      onChange={(e) => {
        const next = available.find((m) => m.uuid === e.target.value)
        if (next) onAssign(next)
      }}
      aria-label="Assign material"
    >
      {available.map((m) => (
        <option key={m.uuid} value={m.uuid}>
          {materialLabel(m)}
        </option>
      ))}
    </select>
  )
}

export function InfoPanel({
  object,
  root,
  onChange,
}: {
  object: THREE.Object3D | null
  root: THREE.Object3D | null
  onChange?: () => void
}) {
  const [, setVersion] = useState(0)
  const bump = () => {
    setVersion((v) => v + 1)
    onChange?.()
  }

  if (!object) {
    return <p className={styles.empty}>Select an object in the tree to inspect it.</p>
  }

  const mesh = object as THREE.Mesh
  const geometry = mesh.isMesh ? mesh.geometry : null
  const materials: THREE.Material[] = mesh.isMesh
    ? Array.isArray(mesh.material)
      ? mesh.material
      : mesh.material
        ? [mesh.material]
        : []
    : []
  const isArray = Array.isArray(mesh.material)
  const available = root ? collectMaterials(root) : []

  const assign = (slot: number, material: THREE.Material) => {
    if (Array.isArray(mesh.material)) {
      mesh.material[slot] = material
    } else {
      mesh.material = material
    }
    bump()
  }

  const nextUniqueName = (base: string): string => {
    const names = new Set(available.map((m) => m.name))
    const stem = base || 'Material'
    if (!names.has(stem)) return stem
    for (let i = 2; ; i++) {
      const candidate = `${stem} ${i}`
      if (!names.has(candidate)) return candidate
    }
  }

  // Clone the slot's current material so this mesh gets its own editable copy
  // that no longer shares state with other meshes using the original.
  const createNew = (slot: number, from: THREE.Material) => {
    const copy = from.clone()
    copy.name = nextUniqueName(from.name ? `${from.name} copy` : 'Material')
    assign(slot, copy)
  }

  // Swap a material everywhere in the scene so meshes sharing it stay in sync.
  const replaceEverywhere = (from: THREE.Material, to: THREE.Material) => {
    const scope = root ?? object
    scope.traverse((obj) => {
      const m = obj as THREE.Mesh
      if (!m.isMesh || !m.material) return
      if (Array.isArray(m.material)) {
        m.material = m.material.map((x) => (x === from ? to : x))
      } else if (m.material === from) {
        m.material = to
      }
    })
    bump()
  }

  let vertexCount = 0
  let triangleCount = 0
  if (geometry) {
    const position = geometry.getAttribute('position')
    vertexCount = position ? position.count : 0
    triangleCount = geometry.index
      ? geometry.index.count / 3
      : Math.floor(vertexCount / 3)
  }

  return (
    <div className={styles.info}>
      <h3 className={styles.name}>{object.name || `(${object.type})`}</h3>

      <section className={styles.section}>
        <h4>Object</h4>
        <Row label="Type">{object.type}</Row>
        <Row label="UUID">
          <code>{object.uuid.slice(0, 8)}…</code>
        </Row>
        <Row label="Visible">{object.visible ? 'yes' : 'no'}</Row>
        <Row label="Children">{object.children.length}</Row>
        <Row label="Position">{formatVec(object.position)}</Row>
        <Row label="Rotation">{formatVec(object.rotation)}</Row>
        <Row label="Scale">{formatVec(object.scale)}</Row>
      </section>

      {geometry && (
        <section className={styles.section}>
          <h4>Geometry</h4>
          <Row label="Type">{geometry.type}</Row>
          <Row label="Vertices">{vertexCount.toLocaleString()}</Row>
          <Row label="Triangles">{triangleCount.toLocaleString()}</Row>
        </section>
      )}

      {materials.length > 0 && (
        <section className={styles.section}>
          <h4>Material{materials.length > 1 ? 's' : ''}</h4>
          {materials.map((material, slot) => (
            <div key={`${slot}-${material.uuid}`} className={styles.slot}>
              <div className={styles.assignRow}>
                <span className={styles.assignLabel}>
                  {isArray ? `Slot ${slot}` : 'Assigned'}
                </span>
                <MaterialPicker
                  available={available}
                  current={material}
                  onAssign={(next) => assign(slot, next)}
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => createNew(slot, material)}
                  title="Create a unique copy of this material for this mesh"
                >
                  New
                </Button>
              </div>
              <MaterialEditor
                material={material}
                onChange={bump}
                onReplace={(next) => replaceEverywhere(material, next)}
              />
            </div>
          ))}
        </section>
      )}
    </div>
  )
}
