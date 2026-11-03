/* This editor intentionally mutates the live Three.js material so the
   viewport updates in place; disable the no-prop-mutation lint for the file. */
/* oxlint-disable react/immutability */
import { useState } from 'react'
import * as THREE from 'three'
import {
  MATERIAL_TYPES,
  MATERIAL_TYPE_LABELS,
  convertMaterial,
  type MaterialType,
} from '../../utils/materialTypes'
import styles from './MaterialEditor.module.css'

interface StdMaterial extends THREE.Material {
  color?: THREE.Color
  emissive?: THREE.Color
  metalness?: number
  roughness?: number
}

const TEXTURE_SLOTS: [string, string][] = [
  ['map', 'Base color map'],
  ['normalMap', 'Normal map'],
  ['roughnessMap', 'Roughness map'],
  ['metalnessMap', 'Metalness map'],
  ['emissiveMap', 'Emissive map'],
  ['aoMap', 'Ambient occlusion map'],
  ['alphaMap', 'Alpha map'],
]

function ColorField({
  label,
  color,
  onChange,
}: {
  label: string
  color: THREE.Color
  onChange: () => void
}) {
  const hex = `#${color.getHexString()}`
  return (
    <div className={styles.row}>
      <span className={styles.key}>{label}</span>
      <span className={`${styles.val} ${styles.colorValue}`}>
        <input
          type="color"
          className={styles.colorInput}
          value={hex}
          onChange={(e) => {
            color.set(e.target.value)
            onChange()
          }}
        />
        <span className={styles.colorHex}>{hex}</span>
      </span>
    </div>
  )
}

function SliderField({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div className={styles.row}>
      <span className={styles.key}>{label}</span>
      <span className={`${styles.val} ${styles.sliderValue}`}>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
        />
        <span className={styles.sliderNum}>{value.toFixed(2)}</span>
      </span>
    </div>
  )
}

export function MaterialEditor({
  material,
  onChange,
  onReplace,
}: {
  material: THREE.Material
  onChange?: () => void
  onReplace?: (next: THREE.Material) => void
}) {
  const std = material as StdMaterial
  const [, setVersion] = useState(0)
  const bump = () => {
    setVersion((v) => v + 1)
    onChange?.()
  }

  const update = (fn: () => void, needsUpdate = false) => {
    fn()
    if (needsUpdate) material.needsUpdate = true
    bump()
  }

  const textures = TEXTURE_SLOTS.filter(([slot]) => (std as never)[slot])

  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <input
          type="text"
          className={styles.nameInput}
          value={material.name}
          placeholder="(unnamed material)"
          onChange={(e) => update(() => (material.name = e.target.value))}
          aria-label="Material name"
        />
        <select
          className={styles.typeSelect}
          value={material.type}
          onChange={(e) =>
            onReplace?.(convertMaterial(material, e.target.value as MaterialType))
          }
          aria-label="Material type"
          disabled={!onReplace}
        >
          {!MATERIAL_TYPES.includes(material.type as MaterialType) && (
            <option value={material.type}>{material.type}</option>
          )}
          {MATERIAL_TYPES.map((t) => (
            <option key={t} value={t}>
              {MATERIAL_TYPE_LABELS[t]}
            </option>
          ))}
        </select>
      </div>

      {std.color && (
        <ColorField label="Color" color={std.color} onChange={bump} />
      )}
      {std.emissive && (
        <ColorField label="Emissive" color={std.emissive} onChange={bump} />
      )}
      {typeof std.metalness === 'number' && (
        <SliderField
          label="Metalness"
          value={std.metalness}
          onChange={(v) => update(() => (std.metalness = v))}
        />
      )}
      {typeof std.roughness === 'number' && (
        <SliderField
          label="Roughness"
          value={std.roughness}
          onChange={(v) => update(() => (std.roughness = v))}
        />
      )}
      <SliderField
        label="Opacity"
        value={material.opacity}
        onChange={(v) =>
          update(() => {
            material.opacity = v
            material.transparent = v < 1
          }, true)
        }
      />
      <div className={styles.row}>
        <span className={styles.key}>Transparent</span>
        <span className={styles.val}>
          <input
            type="checkbox"
            checked={material.transparent}
            onChange={(e) =>
              update(() => (material.transparent = e.target.checked), true)
            }
          />
        </span>
      </div>
      <div className={styles.row}>
        <span className={styles.key}>Double-sided</span>
        <span className={styles.val}>
          <input
            type="checkbox"
            checked={material.side === THREE.DoubleSide}
            onChange={(e) =>
              update(
                () =>
                  (material.side = e.target.checked
                    ? THREE.DoubleSide
                    : THREE.FrontSide),
                true,
              )
            }
          />
        </span>
      </div>

      {textures.length > 0 && (
        <div className={styles.row}>
          <span className={styles.key}>Textures</span>
          <span className={`${styles.val} ${styles.textureList}`}>
            {textures.map(([slot, label]) => (
              <span key={slot} className={styles.tag}>
                {label}
              </span>
            ))}
          </span>
        </div>
      )}
    </div>
  )
}
