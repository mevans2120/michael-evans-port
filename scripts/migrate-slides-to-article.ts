#!/usr/bin/env tsx
/**
 * Migration Script: Slides → Flowing Article
 *
 * Converts existing slide-based case studies to flowing article format.
 * Preserves all content, converts structure to flowing narrative.
 */

import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

// Create write-enabled client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '5n331bys',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

interface Project {
  _id: string
  title: string
  slides?: any[]
  article?: any[]
}

function generateKey() {
  return Math.random().toString(36).substring(2, 15)
}

async function convertSlidesToArticle(slides: any[]): Promise<any[]> {
  const article: any[] = []

  for (const slide of slides) {
    // Add section heading as H2
    if (slide.heading) {
      article.push({
        _type: 'block',
        _key: `h2-${generateKey()}`,
        style: 'h2',
        children: [{
          _type: 'span',
          _key: generateKey(),
          text: slide.heading,
          marks: []
        }],
        markDefs: []
      })
    }

    // Add existing content blocks
    if (slide.content && slide.content.length > 0) {
      for (const block of slide.content) {
        // Re-key blocks to ensure uniqueness
        const reKeyedBlock = {
          ...block,
          _key: `${block._type}-${generateKey()}`,
        }

        // Re-key children if they exist
        if (block.children && Array.isArray(block.children)) {
          reKeyedBlock.children = block.children.map((child: any) => ({
            ...child,
            _key: generateKey()
          }))
        }

        article.push(reKeyedBlock)
      }
    }

    // Convert quote box to stat block
    if (slide.quoteBox?.quote) {
      article.push({
        _type: 'statBlockQuote',
        _key: `quote-${generateKey()}`,
        quote: slide.quoteBox.quote,
        attribution: slide.quoteBox.attribution || undefined
      })
    }
  }

  return article
}

async function migrateProject(projectId: string) {
  console.log(`\n🔵 Migrating ${projectId}...`)

  const project = await client.fetch<Project>(`
    *[_id == $id][0]{
      _id,
      title,
      slides,
      article
    }
  `, { id: projectId })

  if (!project) {
    console.log('❌ Project not found')
    return false
  }

  if (project.article && project.article.length > 0) {
    console.log(`⚠️  ${project.title} already has article content, skipping`)
    return true
  }

  if (!project.slides || project.slides.length === 0) {
    console.log(`⚠️  ${project.title} has no slides to migrate`)
    return true
  }

  console.log(`   Converting ${project.slides.length} slides to article format...`)

  const article = await convertSlidesToArticle(project.slides)

  try {
    await client
      .patch(project._id)
      .set({ article })
      .commit()

    console.log(`✅ ${project.title} migrated successfully`)
    console.log(`   - Created article with ${article.length} blocks`)
    return true
  } catch (error) {
    console.error(`❌ Error migrating ${project.title}:`, error)
    return false
  }
}

async function main() {
  console.log('═══════════════════════════════════════════════')
  console.log('Project Migration: Slides → Flowing Article')
  console.log('═══════════════════════════════════════════════')

  // Get all projects with slides
  const projects = await client.fetch<string[]>(`
    *[_type == "project"]._id
  `)

  console.log(`\nFound ${projects.length} projects to migrate\n`)

  let successCount = 0
  for (const projectId of projects) {
    const success = await migrateProject(projectId)
    if (success) successCount++
  }

  console.log('\n═══════════════════════════════════════════════')
  console.log(`Migration Complete: ${successCount}/${projects.length} successful`)
  console.log('═══════════════════════════════════════════════\n')

  if (successCount === projects.length) {
    console.log('🎉 All migrations successful!')
    console.log('\nNext steps:')
    console.log('  1. Review migrated content in Sanity Studio')
    console.log('  2. Test project pages on localhost')
    console.log('  3. Begin content rewriting as needed\n')
    process.exit(0)
  } else {
    console.log('⚠️  Some migrations failed. Review errors above.\n')
    process.exit(1)
  }
}

main()
