#!/usr/bin/env tsx
/**
 * Phase 3 Migration Script: Migrate Aesop and Lyft to New Editorial Format
 *
 * This script migrates two projects from the old field structure to the new editorial format:
 *
 * AESOP (70% work):
 * - Create heroSection from title/summary/description
 * - Rename sections → slides
 * - Convert achievements → metrics
 *
 * LYFT (40% work):
 * - Complete heroSection (only has badge currently)
 * - Rename sections → slides
 * - Convert achievements → metrics
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
  summary?: string
  description?: string
  achievements?: string[]
  sections?: any[]
  heroSection?: any
  slides?: any[]
}

async function migrateAesop() {
  console.log('\n🔵 Migrating Aesop...')

  const aesop = await client.fetch<Project>(`
    *[_id == "aesop"][0]{
      _id,
      title,
      summary,
      description,
      achievements,
      sections
    }
  `)

  if (!aesop) {
    console.log('❌ Aesop project not found')
    return false
  }

  console.log('   Current state:')
  console.log(`   - title: "${aesop.title}"`)
  console.log(`   - summary: "${aesop.summary || '(empty)'}"`)
  console.log(`   - description: "${aesop.description || '(empty)'}"`)
  console.log(`   - achievements: ${aesop.achievements?.length || 0} items`)
  console.log(`   - sections: ${aesop.sections?.length || 0} items`)

  // Build heroSection
  const heroSection = {
    badge: 'E-commerce Replatform',
    title: aesop.title || 'Aesop',
    subtitle: aesop.description || 'Global luxury skincare e-commerce platform',
    summary: aesop.summary || 'Led React front-end development for Aesop\'s global e-commerce replatform, featuring innovative shoppable navigation and product detail pages that replicate the in-store consultation experience.'
  }

  // Convert achievements to metrics
  const metrics = aesop.achievements?.map((achievement, index) => ({
    _key: `metric-${index}`,
    label: achievement.replace(/^(Improved|Won|Created|Built|Developed|Led|Managed|Translated)/, '').trim(),
    value: achievement.match(/\d+%/)?.[0] || '',
    description: achievement
  })) || []

  // Rename sections to slides
  const slides = aesop.sections || []

  try {
    await client
      .patch(aesop._id)
      .set({
        heroSection,
        slides,
        metrics
      })
      .commit()

    console.log('✅ Aesop migrated successfully')
    console.log(`   - Created heroSection with title: "${heroSection.title}"`)
    console.log(`   - Renamed ${slides.length} sections → slides`)
    console.log(`   - Created ${metrics.length} metrics from achievements`)
    return true
  } catch (error) {
    console.error('❌ Error migrating Aesop:', error)
    return false
  }
}

async function migrateLyft() {
  console.log('\n🔵 Migrating Lyft...')

  const lyft = await client.fetch<Project>(`
    *[_id == "lyft"][0]{
      _id,
      title,
      summary,
      description,
      achievements,
      sections,
      heroSection
    }
  `)

  if (!lyft) {
    console.log('❌ Lyft project not found')
    return false
  }

  console.log('   Current state:')
  console.log(`   - title: "${lyft.title}"`)
  console.log(`   - heroSection.badge: "${lyft.heroSection?.badge || '(missing)'}"`)
  console.log(`   - summary: "${lyft.summary || '(empty)'}"`)
  console.log(`   - description: "${lyft.description || '(empty)'}"`)
  console.log(`   - achievements: ${lyft.achievements?.length || 0} items`)
  console.log(`   - sections: ${lyft.sections?.length || 0} items`)

  // Complete heroSection (already has badge)
  const heroSection = {
    badge: lyft.heroSection?.badge || 'Website Replatform',
    title: lyft.title || 'Lyft',
    subtitle: lyft.description || 'Driver-focused website redesign and acquisition flow optimization',
    summary: lyft.summary || 'Led complete website rebrand and driver acquisition optimization, improving conversion by 8% through localized content strategy and multi-state signup flow redesign.'
  }

  // Convert achievements to metrics
  const metrics = lyft.achievements?.map((achievement, index) => ({
    _key: `metric-${index}`,
    // Removed _type - schema expects plain objects
    label: achievement.replace(/^(Improved|Transformed|Created|Rebuilt|Led|Applied)/, '').trim(),
    value: achievement.match(/\d+%/)?.[0] || '',
    description: achievement
  })) || []

  // Rename sections to slides
  const slides = lyft.sections || []

  try {
    await client
      .patch(lyft._id)
      .set({
        heroSection,
        slides,
        metrics
      })
      .commit()

    console.log('✅ Lyft migrated successfully')
    console.log(`   - Completed heroSection with title: "${heroSection.title}"`)
    console.log(`   - Renamed ${slides.length} sections → slides`)
    console.log(`   - Created ${metrics.length} metrics from achievements`)
    return true
  } catch (error) {
    console.error('❌ Error migrating Lyft:', error)
    return false
  }
}

async function main() {
  console.log('═══════════════════════════════════════════════')
  console.log('Phase 3: Migrate Aesop & Lyft to Editorial Format')
  console.log('═══════════════════════════════════════════════')

  const aesopSuccess = await migrateAesop()
  const lyftSuccess = await migrateLyft()

  console.log('\n═══════════════════════════════════════════════')
  console.log('Migration Summary:')
  console.log(`  Aesop: ${aesopSuccess ? '✅ Success' : '❌ Failed'}`)
  console.log(`  Lyft:  ${lyftSuccess ? '✅ Success' : '❌ Failed'}`)
  console.log('═══════════════════════════════════════════════\n')

  if (aesopSuccess && lyftSuccess) {
    console.log('🎉 All migrations completed successfully!\n')
    console.log('Next steps:')
    console.log('  1. Visit http://localhost:3000/case-studies to verify')
    console.log('  2. Check individual pages:')
    console.log('     - http://localhost:3000/case-studies/aesop')
    console.log('     - http://localhost:3000/case-studies/lyft')
    console.log('  3. Run Phase 4 to remove deprecated fields from schema\n')
    process.exit(0)
  } else {
    console.log('⚠️  Some migrations failed. Please review errors above.\n')
    process.exit(1)
  }
}

main()
