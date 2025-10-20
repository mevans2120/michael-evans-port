import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'

// Import schemas
import project from './sanity-schemas/project'
import profile from './sanity-schemas/profile'
import capability from './sanity-schemas/capability'

export const schemaTypes = [project, profile, capability]

export default defineConfig({
  name: 'default',
  title: 'Michael Evans Portfolio',

  projectId: '5n331bys',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },

  basePath: '/studio',
})