/**
 * Polis Export Script
 *
 * Fetches published blog posts from Sanity CMS, converts Portable Text
 * to Markdown, and publishes them via the Polis CLI. After publishing,
 * syncs the output to public/ for Vercel deployment.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/polis/export.ts
 *   npx tsx --env-file=.env.local scripts/polis/export.ts --dry-run
 *
 * Requires:
 *   - POLIS_BASE_URL env var (e.g., https://mevans.space)
 *   - NEXT_PUBLIC_SANITY_PROJECT_ID env var
 *   - NEXT_PUBLIC_SANITY_DATASET env var (defaults to 'production')
 *   - Polis CLI installed and in PATH
 *   - Polis initialized in project root (polis init)
 */

import { createClient } from 'next-sanity'
import { execSync } from 'child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync, cpSync } from 'fs'
import { join } from 'path'
import { portableTextToMarkdown } from './portable-text-to-md'

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const PROJECT_ROOT = join(import.meta.dirname, '..', '..')
const METADATA_DIR = join(PROJECT_ROOT, 'metadata')
const PUBLIC_DIR = join(PROJECT_ROOT, 'public')
const TEMP_DIR = join(PROJECT_ROOT, '.polis', 'export-temp')

const DRY_RUN = process.argv.includes('--dry-run')

const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const POLIS_BASE_URL = process.env.POLIS_BASE_URL

if (!SANITY_PROJECT_ID) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID env var')
  process.exit(1)
}

if (!POLIS_BASE_URL) {
  console.error('Missing POLIS_BASE_URL env var (e.g., https://mevans.space)')
  process.exit(1)
}

// ---------------------------------------------------------------------------
// Sanity client
// ---------------------------------------------------------------------------

const sanity = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: '2025-10-28',
  useCdn: true,
})

const FULL_POST_QUERY = `*[_type == "blog"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  publishedAt,
  excerpt,
  content[] {
    ...,
    _type == "image" => {
      ...,
      asset->{ _id, url },
      crop, hotspot, alt, caption, style
    },
    _type == "imageGrid" => {
      ...,
      images[] { ..., asset->{ _id, url }, alt, caption }
    },
    _type == "portraitImageList" => {
      ...,
      images[] { ..., asset->{ _id, url }, alt, caption }
    }
  },
  featuredImage {
    asset->{ _id, url },
    crop, hotspot, alt, caption
  }
}`

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SanityPost {
  _id: string
  title: string
  slug: { current: string }
  publishedAt: string
  excerpt?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any[]
  featuredImage?: {
    asset?: { _id?: string; url?: string }
    alt?: string
    caption?: string
  }
}

interface IndexEntry {
  type: string
  path: string
  title: string
  published: string
  current_version: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Read the JSONL index and build a title → file path map */
function buildTitleIndex(): Map<string, string> {
  const indexPath = join(METADATA_DIR, 'public.jsonl')
  const map = new Map<string, string>()
  if (!existsSync(indexPath)) return map

  const content = readFileSync(indexPath, 'utf-8').trim()
  if (!content) return map

  for (const line of content.split('\n')) {
    if (!line.trim()) continue
    try {
      const entry = JSON.parse(line) as IndexEntry
      if (entry.type === 'post') {
        map.set(entry.title, entry.path)
      }
    } catch {
      // skip malformed lines
    }
  }

  return map
}

/** Extract the body (everything after YAML frontmatter) from a Polis post file */
function extractBody(filePath: string): string {
  const content = readFileSync(filePath, 'utf-8')
  const match = content.match(/^---\n[\s\S]*?\n---\n\n?([\s\S]*)$/)
  return normalizeWhitespace(match?.[1] ?? content)
}

/** Normalize trailing whitespace per line for consistent comparison.
 *  Polis canonicalizes content by stripping trailing whitespace from lines. */
function normalizeWhitespace(text: string): string {
  return text
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .trim()
}

function buildMarkdown(post: SanityPost): string {
  const parts: string[] = []

  // Add featured image as leading image if present
  if (post.featuredImage?.asset?.url) {
    const url = `${post.featuredImage.asset.url}?w=1200&q=80&auto=format`
    const alt = (post.featuredImage.alt || post.title).replace(/\]/g, '\\]')
    parts.push(`![${alt}](${url})`)
  }

  // Title as first heading (Polis extracts title from this)
  parts.push(`# ${post.title}`)

  // Convert body
  if (post.content?.length) {
    parts.push(portableTextToMarkdown(post.content))
  }

  return parts.join('\n\n')
}

function polisPost(tempFile: string): { success: boolean; path?: string; error?: string } {
  try {
    const result = execSync(
      `polis post "${tempFile}" --json`,
      { cwd: PROJECT_ROOT, encoding: 'utf-8', env: { ...process.env, POLIS_BASE_URL } }
    )
    return JSON.parse(result.trim().split('\n').pop()!)
  } catch (err) {
    const stderr = (err as { stderr?: string }).stderr || ''
    const msg = stderr || (err instanceof Error ? err.message : String(err))
    return { success: false, error: msg.trim().slice(0, 200) }
  }
}

function polisRepublish(postPath: string): { success: boolean; path?: string; error?: string } {
  try {
    const result = execSync(
      `polis republish "${postPath}" --json`,
      { cwd: PROJECT_ROOT, encoding: 'utf-8', env: { ...process.env, POLIS_BASE_URL } }
    )
    return JSON.parse(result.trim().split('\n').pop()!)
  } catch (err) {
    const stderr = (err as { stderr?: string }).stderr || ''
    const msg = stderr || (err instanceof Error ? err.message : String(err))
    return { success: false, error: msg.trim().slice(0, 200) }
  }
}

function syncToPublic() {
  const dirs = ['posts', 'metadata']
  for (const dir of dirs) {
    const src = join(PROJECT_ROOT, dir)
    const dest = join(PUBLIC_DIR, dir)
    if (existsSync(src)) {
      mkdirSync(dest, { recursive: true })
      cpSync(src, dest, { recursive: true })
    }
  }
  console.log('\nSynced posts/ and metadata/ to public/')
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('Polis Export')
  console.log('============')
  console.log(`Sanity: ${SANITY_PROJECT_ID}/${SANITY_DATASET}`)
  console.log(`Base URL: ${POLIS_BASE_URL}`)
  if (DRY_RUN) console.log('DRY RUN - no files will be published\n')

  // Fetch all posts from Sanity
  const posts: SanityPost[] = await sanity.fetch(FULL_POST_QUERY)
  console.log(`\nFetched ${posts.length} blog posts from Sanity\n`)

  // Build title → path index from existing Polis posts
  const titleIndex = buildTitleIndex()
  if (titleIndex.size > 0) {
    console.log(`Found ${titleIndex.size} existing Polis posts\n`)
  }

  // Ensure temp dir exists
  mkdirSync(TEMP_DIR, { recursive: true })

  let published = 0
  let updated = 0
  let skipped = 0
  let failed = 0

  for (const post of posts) {
    const slug = post.slug.current
    const markdown = buildMarkdown(post)
    const existingRelPath = titleIndex.get(post.title)
    const existingAbsPath = existingRelPath ? join(PROJECT_ROOT, existingRelPath) : null

    if (existingAbsPath && existsSync(existingAbsPath)) {
      // Post already published — check if content changed
      const existingBody = extractBody(existingAbsPath)
      const newBody = normalizeWhitespace(markdown)

      if (existingBody === newBody) {
        console.log(`  SKIP  ${slug} (unchanged)`)
        skipped++
        continue
      }

      // Content changed — write new body and republish
      if (DRY_RUN) {
        console.log(`  UPDATE (dry) ${slug}`)
        updated++
        continue
      }

      writeFileSync(existingAbsPath, markdown)
      const result = polisRepublish(existingRelPath!)
      if (result.success) {
        console.log(`  UPDATE ${slug} → ${result.path}`)
        updated++
      } else {
        console.log(`  FAIL   ${slug}: ${result.error}`)
        failed++
      }
    } else {
      // New post — write temp file and publish
      if (DRY_RUN) {
        console.log(`  NEW  (dry) ${slug}`)
        published++
        continue
      }

      const tempFile = join(TEMP_DIR, `${slug}.md`)
      writeFileSync(tempFile, markdown)

      const result = polisPost(tempFile)
      if (result.success) {
        console.log(`  NEW    ${slug} → ${result.path}`)
        // Update the title index so subsequent runs detect this post
        titleIndex.set(post.title, result.path!)
        published++
      } else {
        console.log(`  FAIL   ${slug}: ${result.error}`)
        failed++
      }
    }
  }

  console.log('\n--- Summary ---')
  console.log(`  New:       ${published}`)
  console.log(`  Updated:   ${updated}`)
  console.log(`  Skipped:   ${skipped}`)
  console.log(`  Failed:    ${failed}`)
  console.log(`  Total:     ${posts.length}`)

  if (!DRY_RUN && (published > 0 || updated > 0)) {
    syncToPublic()
  }
}

main().catch((err) => {
  console.error('Export failed:', err)
  process.exit(1)
})
