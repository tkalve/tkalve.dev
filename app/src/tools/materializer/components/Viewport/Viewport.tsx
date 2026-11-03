import { useEffect, useRef, useState, type DragEvent, type ReactNode } from 'react'
import type * as THREE from 'three'
import { Viewer } from '../../utils/Viewer'
import styles from './Viewport.module.css'

interface ViewportProps {
  model: THREE.Object3D | null
  selected: THREE.Object3D | null
  onDropFile: (file: File) => void
  loading: boolean
  error: string | null
  statusLeft?: ReactNode
  statusRight?: ReactNode
}

export function Viewport({ model, selected, onDropFile, loading, error, statusLeft, statusRight }: ViewportProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<Viewer | null>(null)
  const [glError, setGlError] = useState<string | null>(null)

  useEffect(() => {
    if (!mountRef.current) return
    let viewer: Viewer
    try {
      viewer = new Viewer(mountRef.current)
    } catch {
      // Deferred so the failure surfaces as its own render rather than inside the effect.
      queueMicrotask(() =>
        setGlError('WebGL is not available in this browser, so the 3D view can’t be shown.'),
      )
      return
    }
    viewerRef.current = viewer
    return () => {
      viewer.dispose()
      viewerRef.current = null
    }
  }, [])

  useEffect(() => {
    if (model) viewerRef.current?.setModel(model)
  }, [model])

  useEffect(() => {
    viewerRef.current?.select(selected)
  }, [selected])

  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) onDropFile(file)
  }

  return (
    <div className={styles.viewport}>
      <div className={styles.stage} onDrop={onDrop} onDragOver={(e) => e.preventDefault()}>
        <span className={styles.corner}>Perspective / User view</span>
        <div ref={mountRef} className={styles.canvasHost} />
        {!model && !loading && (
          <div className={styles.dropHint}>
            <p>Drop a .glb, .gltf or .zip here</p>
            <p className={styles.muted}>or use “Open file”</p>
          </div>
        )}
        {loading && <div className={styles.overlay}>Loading…</div>}
        {(error ?? glError) && <div className={`${styles.overlay} ${styles.error}`}>{error ?? glError}</div>}
        <span className={styles.hint}>Drag to orbit · Scroll to zoom · Shift + drag to pan</span>
      </div>
      <div className={styles.statusBar}>
        <span>{statusLeft}</span>
        <span>{statusRight}</span>
      </div>
    </div>
  )
}
