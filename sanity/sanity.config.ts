import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

const projectId = process.env.VITE_SANITY_PROJECT_ID || 'your-project-id'
const dataset = process.env.VITE_SANITY_DATASET || 'production'

export default defineConfig({
  name: 'default',
  title: 'Michael Evans Portfolio',

  projectId,
  dataset,

  plugins: [
    structureTool(),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})