import { defineCliConfig } from 'sanity/cli'

const projectId = 'vc89ievx'
const dataset = 'production'

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
})