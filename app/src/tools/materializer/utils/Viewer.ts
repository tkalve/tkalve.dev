import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export class Viewer {
  readonly scene: THREE.Scene
  private readonly camera: THREE.PerspectiveCamera
  private readonly renderer: THREE.WebGLRenderer
  private readonly controls: OrbitControls
  private readonly container: HTMLElement
  private readonly resizeObserver: ResizeObserver
  private model: THREE.Object3D | null = null
  private selection: THREE.BoxHelper | null = null
  private frameId = 0

  constructor(container: HTMLElement) {
    this.container = container

    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0xe8e5d6)

    this.camera = new THREE.PerspectiveCamera(50, 1, 0.01, 10000)
    this.camera.position.set(3, 2, 5)

    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    container.appendChild(this.renderer.domElement)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true

    const hemi = new THREE.HemisphereLight(0xffffff, 0xd8d4c4, 1.2)
    this.scene.add(hemi)
    const dir = new THREE.DirectionalLight(0xffffff, 2)
    dir.position.set(5, 10, 7.5)
    this.scene.add(dir)
    const grid = new THREE.GridHelper(10, 10, 0xb8b4a4, 0xcfcbbb)
    this.scene.add(grid)

    this.resizeObserver = new ResizeObserver(() => this.resize())
    this.resizeObserver.observe(container)
    this.resize()
    this.animate()
  }

  private resize() {
    const { clientWidth: w, clientHeight: h } = this.container
    if (w === 0 || h === 0) return
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(w, h, false)
  }

  private animate = () => {
    this.frameId = requestAnimationFrame(this.animate)
    this.controls.update()
    if (this.selection) this.selection.update()
    this.renderer.render(this.scene, this.camera)
  }

  setModel(object: THREE.Object3D) {
    this.clearModel()
    this.model = object
    this.scene.add(object)
    this.frameModel(object)
  }

  private frameModel(object: THREE.Object3D) {
    const box = new THREE.Box3().setFromObject(object)
    if (box.isEmpty()) return
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z) || 1

    this.controls.target.copy(center)
    const dist = maxDim * 2.2
    this.camera.position.copy(center).add(new THREE.Vector3(dist, dist * 0.6, dist))
    this.camera.near = maxDim / 100
    this.camera.far = maxDim * 100
    this.camera.updateProjectionMatrix()
    this.controls.update()
  }

  select(object: THREE.Object3D | null) {
    if (this.selection) {
      this.scene.remove(this.selection)
      this.selection.geometry.dispose()
      this.selection = null
    }
    if (object) {
      const helper = new THREE.BoxHelper(object, 0xe07a5f)
      this.scene.add(helper)
      this.selection = helper
    }
  }

  private clearModel() {
    this.select(null)
    if (this.model) {
      this.scene.remove(this.model)
      this.model.traverse((obj) => {
        const mesh = obj as THREE.Mesh
        if (mesh.geometry) mesh.geometry.dispose()
      })
      this.model = null
    }
  }

  dispose() {
    cancelAnimationFrame(this.frameId)
    this.resizeObserver.disconnect()
    this.clearModel()
    this.controls.dispose()
    this.renderer.dispose()
    this.renderer.domElement.remove()
  }
}
