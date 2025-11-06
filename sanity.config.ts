import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { presentationTool } from 'sanity/presentation'
import { codeInput } from '@sanity/code-input'
import { schemaTypes } from './sanity/schemas'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '5n331bys'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
  name: 'default',
  title: 'Michael Evans Portfolio',
  basePath: '/studio',

  projectId,
  dataset,

  plugins: [
    structureTool(),
    visionTool(),
    codeInput(),
    presentationTool({
      previewUrl: {
        origin: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        previewMode: {
          enable: '/api/draft-mode/enable',
        }
      },
    }),
  ],

  schema: {
    types: schemaTypes as any,
  },
})
