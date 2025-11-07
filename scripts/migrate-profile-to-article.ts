#!/usr/bin/env tsx

/**
 * Migration Script: Profile Sections → Article
 * Transforms nested sections/subsections structure into flat article array
 *
 * Usage:
 *   npm run migrate:profile           # Run migration (prompts for confirmation)
 *   npm run migrate:profile -- --dry-run  # Preview changes without applying
 */

import { createClient } from '@sanity/client'
import { config } from 'dotenv'
import { resolve } from 'path'
import * as fs from 'fs'
import * as readline from 'readline'

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

// Sanity client configuration
const client = createClient({
  projectId: '5n331bys',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_AUTH_TOKEN || process.env.SANITY_API_TOKEN,
  useCdn: false,
})

if (!client.config().token) {
  console.error('❌ No Sanity token found in environment variables')
  console.error('Please ensure SANITY_AUTH_TOKEN is set in .env.local')
  process.exit(1)
}

// Command-line flags
const isDryRun = process.argv.includes('--dry-run')

interface Block {
  _type: string
  _key?: string
  style?: string
  children?: Array<{ _type: string; text: string; marks?: string[] }>
  [key: string]: any
}

interface Subsection {
  heading: string
  content: Block[]
}

interface Section {
  heading: string
  slug?: { current: string }
  content: Block[]
  subsections?: Subsection[]
  visible?: boolean
}

interface Profile {
  _id: string
  _rev: string
  name: string
  sections: Section[]
  article?: Block[]
}

/**
 * Create a heading block
 */
function createHeadingBlock(text: string, style: 'h2' | 'h3'): Block {
  return {
    _type: 'block',
    _key: `heading_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    style,
    children: [
      {
        _type: 'span',
        text,
        marks: []
      }
    ],
    markDefs: []
  }
}

/**
 * Transform sections into article array
 */
function transformSectionsToArticle(sections: Section[]): Block[] {
  const article: Block[] = []

  for (const section of sections) {
    // Skip hidden sections
    if (section.visible === false) {
      console.log(`  ⊘ Skipping hidden section: "${section.heading}"`)
      continue
    }

    console.log(`  → Processing section: "${section.heading}"`)

    // Add section heading as H2
    article.push(createHeadingBlock(section.heading, 'h2'))

    // Add section content
    if (section.content && section.content.length > 0) {
      article.push(...section.content)
    }

    // Process subsections
    if (section.subsections && section.subsections.length > 0) {
      for (const subsection of section.subsections) {
        console.log(`    → Processing subsection: "${subsection.heading}"`)

        // Add subsection heading as H3
        article.push(createHeadingBlock(subsection.heading, 'h3'))

        // Add subsection content
        if (subsection.content && subsection.content.length > 0) {
          article.push(...subsection.content)
        }
      }
    }
  }

  return article
}

/**
 * Create backup of profile document
 */
function createBackup(profile: Profile): string {
  const backupDir = resolve(process.cwd(), 'backups')

  // Create backups directory if it doesn't exist
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true })
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
  const backupPath = resolve(backupDir, `profile-backup-${timestamp}.json`)

  fs.writeFileSync(backupPath, JSON.stringify(profile, null, 2))

  return backupPath
}

/**
 * Prompt user for confirmation
 */
async function promptConfirmation(message: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  return new Promise((resolve) => {
    rl.question(`${message} (y/n): `, (answer) => {
      rl.close()
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes')
    })
  })
}

/**
 * Main migration function
 */
async function migrateProfile() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📄 Profile Migration: Sections → Article')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  if (isDryRun) {
    console.log('🔍 DRY RUN MODE - No changes will be applied\n')
  }

  try {
    // Fetch current profile
    console.log('1️⃣  Fetching profile document...')
    const profile = await client.fetch<Profile>(`*[_type == "profile"][0] {
      _id,
      _rev,
      name,
      sections,
      article
    }`)

    if (!profile) {
      throw new Error('No profile document found')
    }

    console.log(`   ✓ Found profile: "${profile.name}" (ID: ${profile._id})`)

    // Check if sections exist
    if (!profile.sections || profile.sections.length === 0) {
      console.log('\n⚠️  No sections found in profile. Nothing to migrate.')
      return
    }

    console.log(`   ✓ Found ${profile.sections.length} section(s) to migrate\n`)

    // Check if article already exists
    if (profile.article && profile.article.length > 0) {
      console.log(`⚠️  Article field already contains ${profile.article.length} blocks.`)
      const overwrite = await promptConfirmation('Do you want to overwrite it?')

      if (!overwrite) {
        console.log('\n❌ Migration cancelled.')
        return
      }
    }

    // Create backup (unless dry run)
    if (!isDryRun) {
      console.log('\n2️⃣  Creating backup...')
      const backupPath = createBackup(profile)
      console.log(`   ✓ Backup saved: ${backupPath}\n`)
    }

    // Transform sections to article
    console.log(`${isDryRun ? '2️⃣' : '3️⃣'}  Transforming sections to article...\n`)
    const article = transformSectionsToArticle(profile.sections)

    console.log(`\n   ✓ Transformed into ${article.length} article blocks\n`)

    // Preview article structure
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📋 Article Preview (First 10 blocks):')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

    article.slice(0, 10).forEach((block, index) => {
      if (block._type === 'block') {
        const text = block.children?.[0]?.text || '(empty)'
        const truncated = text.length > 60 ? text.substring(0, 60) + '...' : text
        console.log(`${index + 1}. [${block.style || 'normal'}] ${truncated}`)
      } else {
        console.log(`${index + 1}. [${block._type}]`)
      }
    })

    if (article.length > 10) {
      console.log(`\n... and ${article.length - 10} more blocks`)
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

    // Save preview to file
    const previewPath = resolve(process.cwd(), 'backups', 'article-preview.json')
    if (!fs.existsSync(resolve(previewPath, '..'))) {
      fs.mkdirSync(resolve(previewPath, '..'), { recursive: true })
    }
    fs.writeFileSync(previewPath, JSON.stringify(article, null, 2))
    console.log(`📄 Full preview saved to: ${previewPath}\n`)

    // Apply migration (if not dry run)
    if (!isDryRun) {
      const confirmed = await promptConfirmation('\n4️⃣  Apply migration to Sanity?')

      if (!confirmed) {
        console.log('\n❌ Migration cancelled.')
        return
      }

      console.log('\n   Applying migration...')

      await client
        .patch(profile._id)
        .set({ article })
        .commit()

      console.log('   ✓ Migration applied successfully!\n')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('✅ Migration Complete!')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('\nNext steps:')
      console.log('  1. Check Sanity Studio to verify the article field')
      console.log('  2. Update page.tsx query to fetch article field')
      console.log('  3. Update AboutPageClient to use new components')
      console.log('  4. Test the new About page layout\n')
    } else {
      console.log('\n✅ Dry run complete! Review the preview above.\n')
      console.log('To apply the migration, run:')
      console.log('  npm run migrate:profile\n')
    }

  } catch (error) {
    console.error('\n❌ Migration failed:', error)
    process.exit(1)
  }
}

// Run migration
migrateProfile()
