import {Studio} from 'sanity'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from '../../sanity/schemas'

const config = defineConfig({
  name: 'default',
  title: 'Michael Evans Portfolio',
  projectId: 'vc89ievx',
  dataset: 'production',
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
  basePath: '/studio',
})

export default function StudioPage() {
  return <Studio config={config} />
}