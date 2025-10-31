/**
 * Master import script for all AI Showcase content
 * Runs all three showcase imports in sequence
 */

import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

const scripts = [
  { name: 'AI Workflow', file: 'import-ai-workflow.ts' },
  { name: 'PostPal', file: 'import-postpal.ts' },
  { name: 'Marketing Sites', file: 'import-marketing-sites.ts' },
]

async function runScript(scriptPath: string) {
  const { stdout, stderr } = await execAsync(`tsx ${scriptPath}`)
  if (stdout) console.log(stdout)
  if (stderr) console.error(stderr)
}

async function importAll() {
  console.log('=' .repeat(60))
  console.log('🚀 AI SHOWCASE CONTENT IMPORT')
  console.log('=' .repeat(60))
  console.log()

  const startTime = Date.now()
  let successCount = 0
  let failCount = 0

  for (const script of scripts) {
    console.log(`\n${'─'.repeat(60)}`)
    console.log(`📦 Importing: ${script.name}`)
    console.log('─'.repeat(60))

    try {
      const scriptPath = `./scripts/import-showcases/${script.file}`
      await runScript(scriptPath)
      successCount++
    } catch (error) {
      console.error(`❌ Failed to import ${script.name}:`, error)
      failCount++
    }
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2)

  console.log()
  console.log('='.repeat(60))
  console.log('📊 IMPORT SUMMARY')
  console.log('='.repeat(60))
  console.log(`✅ Successful: ${successCount}`)
  console.log(`❌ Failed: ${failCount}`)
  console.log(`⏱️  Duration: ${duration}s`)
  console.log('='.repeat(60))

  if (failCount > 0) {
    process.exit(1)
  }
}

importAll().catch((error) => {
  console.error('\n💥 Fatal error:', error)
  process.exit(1)
})
