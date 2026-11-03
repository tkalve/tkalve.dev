import { useCallback, useRef, useState, type ChangeEvent } from 'react'
import type * as THREE from 'three'
import { Button } from '../../../../components/Button/Button'
import { HeaderActions } from '../../../../components/Header/HeaderActions'
import { Container } from '../../../../components/Layout/Layout'
import { loadModel } from '../../utils/loadModel'
import { exportGLB, downloadBlob } from '../../utils/exportModel'
import { computeStats, formatBytes, formatLabel } from '../../utils/modelStats'
import { materializerMeta } from '../../meta'
import { SceneTree } from '../SceneTree/SceneTree'
import { InfoPanel } from '../InfoPanel/InfoPanel'
import { Viewport } from '../Viewport/Viewport'
import styles from './Materializer.module.css'

const FolderIcon = (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      d="M1.5 4.5v8a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1H8L6.5 3.5h-4a1 1 0 0 0-1 1Z"
    />
  </svg>
)

const DownloadIcon = (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 2v8m0 0 3-3m-3 3L5 7M2.5 11v2a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-2"
    />
  </svg>
)

const CubeIcon = (
  <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
    <path
      d="M8 1.5 14 5v6l-6 3.5L2 11V5l6-3.5Zm0 1.2L3.2 5.5 8 8.3l4.8-2.8L8 2.7ZM3 6.6v3.8l4.5 2.6V9.2L3 6.6Zm10 0L8.5 9.2V13L13 10.4V6.6Z"
      fill="currentColor"
    />
  </svg>
)

export function Materializer() {
  const inputRef = useRef<HTMLInputElement>(null)

  const [file, setFile] = useState<File | null>(null)
  const [root, setRoot] = useState<THREE.Object3D | null>(null)
  const [selected, setSelected] = useState<THREE.Object3D | null>(null)
  const [loading, setLoading] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [edited, setEdited] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = useCallback(async (file: File) => {
    setLoading(true)
    setError(null)
    try {
      const gltf = await loadModel(file)
      setFile(file)
      setRoot(gltf.scene)
      setSelected(null)
      setEdited(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
      setRoot(null)
      setSelected(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  const handleExport = useCallback(async () => {
    if (!root) return
    setExporting(true)
    setError(null)
    try {
      const blob = await exportGLB(root)
      const base = (file?.name ?? 'model').replace(/\.(glb|gltf|zip)$/i, '')
      downloadBlob(blob, `${base}-edited.glb`)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setExporting(false)
    }
  }, [root, file])

  const handleReset = () => {
    if (file) handleFile(file)
  }

  const markEdited = useCallback(() => setEdited(true), [])

  const stats = root ? computeStats(root) : null

  return (
    <>
      <HeaderActions>
        <Button variant="secondary" icon={FolderIcon} onClick={() => inputRef.current?.click()}>
          Open file
        </Button>
        <Button icon={DownloadIcon} onClick={handleExport} disabled={!root || exporting}>
          {exporting ? 'Exporting…' : 'Export GLB'}
        </Button>
      </HeaderActions>
      <input
        ref={inputRef}
        type="file"
        accept={materializerMeta.accepts?.join(',')}
        hidden
        onChange={onInputChange}
      />

      <Container wide className={styles.workbenchWrap}>
        <div className={styles.workbench}>
          <div className={styles.fileBar}>
            <span className={styles.fileInfo}>
              <span className={styles.fileIcon}>{CubeIcon}</span>
              <strong>{file?.name ?? 'No file open'}</strong>
              {root && (
                <span className={styles.fileState}>
                  <span className={edited ? styles.dotEdited : styles.dotClean} />
                  {edited ? 'Edited locally' : 'Unchanged'}
                </span>
              )}
            </span>
            <Button variant="ghost" size="sm" onClick={handleReset} disabled={!root || !edited}>
              Reset changes
            </Button>
          </div>

          <div className={styles.columns}>
            <aside className={styles.sidebar}>
              <div className={styles.panelHead}>
                <span>Objects</span>
                <span>{stats ? String(stats.meshes).padStart(2, '0') : '—'}</span>
              </div>
              <div className={styles.scroll}>
                <SceneTree root={root} selectedId={selected?.uuid ?? null} onSelect={setSelected} />
              </div>
              {file && stats && (
                <div className={styles.about}>
                  <div className={styles.panelHead}>About this file</div>
                  <dl className={styles.facts}>
                    <dt>Format</dt>
                    <dd>{formatLabel(file.name)}</dd>
                    <dt>Size</dt>
                    <dd>{formatBytes(file.size)}</dd>
                    <dt>Triangles</dt>
                    <dd>{stats.triangles.toLocaleString()}</dd>
                    <dt>Meshes</dt>
                    <dd>{stats.meshes}</dd>
                    <dt>Materials</dt>
                    <dd>{stats.materials}</dd>
                  </dl>
                </div>
              )}
            </aside>

            <Viewport
              model={root}
              selected={selected}
              onDropFile={handleFile}
              loading={loading}
              error={error}
              statusLeft={
                selected
                  ? `${selected.name || selected.type} selected`
                  : root
                    ? 'Nothing selected'
                    : 'Open a file to begin'
              }
              statusRight={stats ? `${stats.meshes} meshes · ${stats.materials} materials` : null}
            />

            <aside className={styles.inspector}>
              <div className={styles.panelHead}>Properties</div>
              <div className={styles.scroll}>
                <InfoPanel object={selected} root={root} onChange={markEdited} />
              </div>
            </aside>
          </div>
        </div>

        <div className={styles.footnote}>
          <span>🛡 Your files stay in your browser. Nothing is uploaded.</span>
          <span className={styles.footnoteMono}>
            Open {materializerMeta.accepts?.join(' ')} / Export .glb
          </span>
        </div>
      </Container>
    </>
  )
}

export default Materializer
