import type { ToolMeta } from '../types'
import { CubePreview } from './components/CubePreview/CubePreview'

export const materializerMeta: ToolMeta = {
  slug: 'materializer',
  name: 'Materializer',
  tagline: 'Open a model, tweak its materials, export it back.',
  description:
    'Open a glTF model, browse its scene graph, and edit materials in place. Everything runs in your browser.',
  category: 'Tool / 3D',
  cta: 'Open Materializer',
  preview: <CubePreview />,
  previewTone: 'teal',
  accepts: ['.glb', '.gltf', '.zip'],
  load: () => import('./components/Materializer/Materializer'),
}
