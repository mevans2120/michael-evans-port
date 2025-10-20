import { defineCliConfig } from 'sanity/cli'

const projectId = '5n331bys'
const dataset = 'production'

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
})