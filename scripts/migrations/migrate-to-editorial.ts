import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Initialize Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN!,
  apiVersion: '2024-01-01',
  useCdn: false,
})

interface EditorialSpec {
  metadata: {
    title: string
    slug: string
    category: string
    featured: boolean
    order: number
    publishedAt: string
  }
  heroSection: {
    badge: string
    title: string
    subtitle: string
    summary: string
  }
  overview: {
    role: string
    company: string
    timeline: string
  }
  metrics: Array<{
    value: string
    label: string
    description?: string
  }>
  technologies: string[]
  callToAction?: {
    text: string
    link: string
  }
}

interface SlideContent {
  sectionLabel?: string
  heading?: string
  content?: string
  quoteBox?: {
    quote: string
    attribution: string
  }
  comparisonBoxes?: Array<{
    label: string
    title?: string
    text: string
    stat?: string
    icon?: string
  }>
  visualCards?: Array<{
    placeholderText: string
    caption: string
  }>
  annotation?: {
    title: string
    content: string
  }
}

/**
 * Parse editorial spec markdown file
 */
function parseEditorialSpec(filePath: string): {
  spec: EditorialSpec
  slides: SlideContent[]
} {
  const content = fs.readFileSync(filePath, 'utf-8')

  // Extract YAML blocks
  const spec = extractSpecFromMarkdown(content)

  // Extract narrative content as slides
  const slides = extractSlidesFromMarkdown(content)

  return { spec, slides }
}

/**
 * Extract metadata and spec from markdown YAML blocks
 */
function extractSpecFromMarkdown(content: string): EditorialSpec {
  const spec: any = {
    metadata: {},
    heroSection: {},
    overview: {},
    metrics: [],
    technologies: [],
  }

  // Extract all YAML code blocks
  const yamlRegex = /```yaml\n([\s\S]*?)\n```/g
  let match

  while ((match = yamlRegex.exec(content)) !== null) {
    try {
      const yamlContent = match[1]
      const parsed = yaml.load(yamlContent) as any

      // Determine which section this belongs to based on keys
      if (parsed.title && parsed.slug) {
        spec.metadata = parsed
      } else if (parsed.heroSection) {
        spec.heroSection = parsed.heroSection
      } else if (parsed.overview) {
        spec.overview = parsed.overview
      } else if (Array.isArray(parsed.metrics)) {
        spec.metrics = parsed.metrics
      } else if (Array.isArray(parsed.technologies)) {
        spec.technologies = parsed.technologies
      } else if (parsed.callToAction) {
        spec.callToAction = parsed.callToAction
      }
    } catch (error) {
      console.warn('Failed to parse YAML block:', error)
    }
  }

  return spec as EditorialSpec
}

/**
 * Extract slides from "The Story" narrative section
 */
function extractSlidesFromMarkdown(content: string): SlideContent[] {
  const slides: SlideContent[] = []

  // Find "The Story" section
  const storyMatch = content.match(/##\s+The Story.*?\n([\s\S]*?)(?=\n##\s+Technologies|$)/i)
  if (!storyMatch) {
    console.warn('No "The Story" section found in markdown')
    return slides
  }

  const storyContent = storyMatch[1]

  // Split by ### headings
  const subsections = storyContent.split(/\n###\s+/)

  subsections.forEach((section, index) => {
    if (index === 0) return // Skip first empty element

    const lines = section.split('\n')
    const heading = lines[0].trim()

    const slide: SlideContent = {
      heading,
    }

    // Extract content paragraphs (everything not in YAML blocks or component markers)
    const contentLines: string[] = []
    let inYamlBlock = false
    let skipNext = false

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i]

      // Track YAML blocks
      if (line.trim().startsWith('```yaml')) {
        inYamlBlock = true
        continue
      }
      if (line.trim().startsWith('```') && inYamlBlock) {
        inYamlBlock = false
        continue
      }

      // Skip YAML content
      if (inYamlBlock) continue

      // Skip component markers
      if (
        line.includes('**Quote Box:**') ||
        line.includes('**Comparison Boxes:**') ||
        line.includes('**Visual Cards:**') ||
        line.includes('**Annotation:**')
      ) {
        skipNext = true
        continue
      }

      if (skipNext && line.trim() === '') {
        skipNext = false
        continue
      }

      // Collect content
      if (line.trim() && !line.startsWith('#')) {
        contentLines.push(line)
      }
    }

    slide.content = contentLines.join('\n').trim()

    // Extract editorial components from YAML blocks in this section
    slide.quoteBox = extractYamlComponent(section, 'quoteBox')
    slide.comparisonBoxes = extractYamlComponent(section, 'comparisonBoxes')
    slide.visualCards = extractYamlComponent(section, 'visualCards')
    slide.annotation = extractYamlComponent(section, 'annotation')

    if (slide.heading || slide.content) {
      slides.push(slide)
    }
  })

  return slides
}

/**
 * Extract a specific YAML component from a section
 */
function extractYamlComponent(section: string, componentName: string): any {
  const regex = new RegExp(
    `\\*\\*${componentName.charAt(0).toUpperCase() + componentName.slice(1).replace(/([A-Z])/g, ' $1')}:?\\*\\*\\s*\`\`\`yaml\\n([\\s\\S]*?)\\n\`\`\``,
    'i'
  )

  const match = section.match(regex)
  if (!match) return undefined

  try {
    const parsed = yaml.load(match[1]) as any
    return parsed[componentName]
  } catch (error) {
    console.warn(`Failed to parse ${componentName}:`, error)
    return undefined
  }
}

/**
 * Convert markdown text to Portable Text blocks
 */
function markdownToPortableText(markdown: string): any[] {
  if (!markdown || markdown.trim() === '') return []

  const paragraphs = markdown.split('\n\n').filter((p) => p.trim())

  return paragraphs.map((para) => {
    const trimmed = para.trim()

    // Handle bold text (**text**)
    if (trimmed.includes('**')) {
      const parts = trimmed.split('**')
      const children: any[] = []

      parts.forEach((part, index) => {
        if (!part) return
        if (index % 2 === 0) {
          // Regular text
          children.push({ _type: 'span', text: part, marks: [] })
        } else {
          // Bold text
          children.push({ _type: 'span', text: part, marks: ['strong'] })
        }
      })

      return {
        _type: 'block',
        _key: generateKey(),
        style: 'normal',
        children,
        markDefs: [],
      }
    }

    // Regular paragraph
    return {
      _type: 'block',
      _key: generateKey(),
      style: 'normal',
      children: [{ _type: 'span', text: trimmed, marks: [] }],
      markDefs: [],
    }
  })
}

/**
 * Generate unique key for Sanity documents
 */
function generateKey(): string {
  return Math.random().toString(36).substr(2, 9)
}

/**
 * Create or update project in Sanity
 */
async function migrateProject(specPath: string, dryRun = true): Promise<boolean> {
  console.log(`\n📄 Processing: ${path.basename(specPath)}`)

  try {
    const { spec, slides } = parseEditorialSpec(specPath)

    // Validate required fields
    if (!spec.metadata?.slug) {
      console.error('   ❌ Missing slug in metadata')
      return false
    }

    // Check if project exists
    const existingProject = await client.fetch(
      `*[_type == "project" && slug.current == $slug][0]`,
      { slug: spec.metadata.slug }
    )

    // Build Sanity document
    const projectDoc: any = {
      _type: 'project',
      title: spec.metadata.title,
      slug: {
        _type: 'slug',
        current: spec.metadata.slug,
      },
      category: spec.metadata.category,
      featured: spec.metadata.featured,
      order: spec.metadata.order,
      publishedAt: spec.metadata.publishedAt,

      heroSection: spec.heroSection,
      overview: spec.overview,
      metrics: spec.metrics,
      technologies: spec.technologies,
      callToAction: spec.callToAction,

      slides: slides.map((slide) => ({
        _type: 'contentSlide',
        _key: generateKey(),
        sectionLabel: slide.sectionLabel,
        heading: slide.heading,
        content: slide.content ? markdownToPortableText(slide.content) : undefined,
        quoteBox: slide.quoteBox,
        comparisonBoxes: slide.comparisonBoxes?.map((box) => ({
          ...box,
          _key: generateKey(),
        })),
        visualCards: slide.visualCards?.map((card) => ({
          ...card,
          _key: generateKey(),
        })),
        annotation: slide.annotation,
      })),
    }

    // Add _id if updating
    if (existingProject) {
      projectDoc._id = existingProject._id
      console.log(`   ✏️  Updating existing project: ${existingProject._id}`)
    } else {
      console.log(`   ✨ Creating new project`)
    }

    if (dryRun) {
      console.log('   🔍 DRY RUN - Would create/update:')
      console.log(`      Title: ${projectDoc.title}`)
      console.log(`      Slug: ${projectDoc.slug.current}`)
      console.log(`      Slides: ${projectDoc.slides?.length || 0}`)
      console.log(`      Metrics: ${projectDoc.metrics?.length || 0}`)

      // Show first slide as sample
      if (projectDoc.slides && projectDoc.slides.length > 0) {
        const firstSlide = projectDoc.slides[0]
        console.log(`\n      Sample slide:`)
        console.log(`        Heading: ${firstSlide.heading}`)
        console.log(`        Content blocks: ${firstSlide.content?.length || 0}`)
        console.log(`        Has quote: ${!!firstSlide.quoteBox}`)
        console.log(`        Comparison boxes: ${firstSlide.comparisonBoxes?.length || 0}`)
        console.log(`        Visual cards: ${firstSlide.visualCards?.length || 0}`)
      }
    } else {
      const result = await client.createOrReplace(projectDoc)
      console.log(`   ✅ Migrated successfully: ${result._id}`)
    }

    return true
  } catch (error) {
    console.error(`   ❌ Error:`, error)
    return false
  }
}

/**
 * Main migration function
 */
async function runMigration() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const projectArg = args.find((arg) => arg.startsWith('--project='))
  const specificProject = projectArg?.split('=')[1]

  console.log('🚀 Starting Case Study Editorial Migration')
  console.log(`   Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}`)
  console.log('')

  // Verify environment variables
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    console.error('❌ Missing NEXT_PUBLIC_SANITY_PROJECT_ID environment variable')
    process.exit(1)
  }
  if (!process.env.NEXT_PUBLIC_SANITY_DATASET) {
    console.error('❌ Missing NEXT_PUBLIC_SANITY_DATASET environment variable')
    process.exit(1)
  }
  if (!process.env.SANITY_API_TOKEN && !dryRun) {
    console.error('❌ Missing SANITY_API_TOKEN environment variable')
    console.error('   Create a token at https://sanity.io/manage')
    console.error('   Add to .env.local: SANITY_API_TOKEN=your_token_here')
    process.exit(1)
  }

  // Define specs to migrate
  const specsDir = path.join(__dirname, '../../docs/content-specs/detailed-specs')
  const allSpecs = [
    'virgin-america-editorial-spec.md',
    'before-launcher-editorial-spec.md',
    'casa-bonita-editorial-spec.md',
    'target-editorial-spec.md',
    'peddle-editorial-spec.md',
  ]

  // Filter if specific project requested
  const specsToMigrate = specificProject
    ? allSpecs.filter((spec) => spec.includes(specificProject))
    : allSpecs

  if (specsToMigrate.length === 0) {
    console.error(`❌ No specs found matching: ${specificProject}`)
    process.exit(1)
  }

  console.log(`📋 Migrating ${specsToMigrate.length} project(s):\n`)

  // Run migrations
  let successCount = 0
  let failCount = 0

  for (const spec of specsToMigrate) {
    const specPath = path.join(specsDir, spec)

    if (!fs.existsSync(specPath)) {
      console.log(`   ⚠️  Spec not found: ${spec}`)
      failCount++
      continue
    }

    const success = await migrateProject(specPath, dryRun)
    if (success) {
      successCount++
    } else {
      failCount++
    }
  }

  console.log(`\n${'='.repeat(50)}`)
  console.log(`✅ Migration complete!`)
  console.log(`   Success: ${successCount}`)
  console.log(`   Failed: ${failCount}`)

  if (dryRun) {
    console.log(`\n💡 Run without --dry-run to execute migration`)
    console.log(`   npm run migrate:case-studies`)
  }
}

// Run migration
runMigration().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
