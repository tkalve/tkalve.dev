import { useState } from 'react'
import type { Object3D } from 'three'
import styles from './SceneTree.module.css'

interface TreeNodeProps {
  object: Object3D
  depth: number
  selectedId: string | null
  onSelect: (object: Object3D) => void
}

function nodeLabel(object: Object3D): string {
  const name = object.name?.trim()
  return name && name.length > 0 ? name : `(${object.type})`
}

function TreeNode({ object, depth, selectedId, onSelect }: TreeNodeProps) {
  const [open, setOpen] = useState(depth < 2)
  const children = object.children
  const hasChildren = children.length > 0
  const isSelected = object.uuid === selectedId

  return (
    <li>
      <div
        className={`${styles.row}${isSelected ? ` ${styles.selected}` : ''}`}
        style={{ paddingLeft: depth * 14 + 8 }}
        onClick={() => onSelect(object)}
      >
        {hasChildren ? (
          <button
            type="button"
            className={styles.toggle}
            onClick={(e) => {
              e.stopPropagation()
              setOpen((v) => !v)
            }}
            aria-label={open ? 'Collapse' : 'Expand'}
          >
            {open ? '▾' : '▸'}
          </button>
        ) : (
          <span className={`${styles.toggle} ${styles.leaf}`}>•</span>
        )}
        <span className={styles.label}>{nodeLabel(object)}</span>
        <span className={styles.type}>{object.type}</span>
      </div>
      {hasChildren && open && (
        <ul className={styles.children}>
          {children.map((child) => (
            <TreeNode
              key={child.uuid}
              object={child}
              depth={depth + 1}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

interface SceneTreeProps {
  root: Object3D | null
  selectedId: string | null
  onSelect: (object: Object3D) => void
}

export function SceneTree({ root, selectedId, onSelect }: SceneTreeProps) {
  if (!root) {
    return <p className={styles.empty}>Open a model to see its scene graph.</p>
  }
  return (
    <ul className={styles.root}>
      <TreeNode object={root} depth={0} selectedId={selectedId} onSelect={onSelect} />
    </ul>
  )
}
