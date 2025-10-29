import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '5n331bys',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_AUTH_TOKEN,
})

// Old duplicate IDs to delete (these have no narrative sections)
const duplicatesToDelete = [
  'project-virgin-america',
  'project-casa-bonita',
  'project-before-launcher',
  'project-peddle',
]

async function cleanupDuplicates() {
  console.log('🧹 Cleaning up duplicate project documents...\n')

  for (const docId of duplicatesToDelete) {
    try {
      console.log(`🗑️  Deleting ${docId}...`)
      await client.delete(docId)
      console.log(`✅ Deleted ${docId}`)
    } catch (error: any) {
      if (error.statusCode === 404) {
        console.log(`⚠️  ${docId} already deleted or doesn't exist`)
      } else {
        console.error(`❌ Failed to delete ${docId}:`, error.message)
      }
    }
  }

  console.log('\n🎉 Cleanup complete!')
  console.log('\nRemaining projects should be:')
  console.log('  - virgin-america (with 8 narrative sections)')
  console.log('  - target (with 6 narrative sections)')
  console.log('  - casa-bonita (with 4 narrative sections)')
  console.log('  - before-launcher (with 4 narrative sections)')
  console.log('  - pedal (with 4 narrative sections)')
}

cleanupDuplicates()
