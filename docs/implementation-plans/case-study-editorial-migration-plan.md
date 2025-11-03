# Case Study Editorial Migration - Implementation Plan

**Date:** November 3, 2025
**Goal:** Migrate case studies to editorial magazine format using Sanity CLI for automation

---

## Overview

This plan outlines the phased approach to:
1. Update the `project` schema to support editorial format
2. Create Sanity CLI migration scripts to automate content transformation
3. Build new magazine-style components
4. Migrate content from editorial specs
5. Clean up deprecated fields

---

## Phase 1: Schema Updates (Non-Breaking)

### Objective
Add new editorial fields to the `project` schema while keeping old fields for backward compatibility.

### Tasks

#### 1.1 Update `sanity/schemas/project.ts`

**Add new fields:**

```typescript
// Hero Section (NEW)
defineField({
  name: 'heroSection',
  title: 'Hero Section',
  type: 'object',
  fields: [
    {
      name: 'badge',
      title: 'Badge Text',
      type: 'string',
      description: 'Small badge above title (e.g., "Case Study")',
    },
    {
      name: 'title',
      title: 'Hero Title',
      type: 'string',
      description: 'Large hero title',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'subtitle',
      title: 'Subtitle',
      type: 'text',
      rows: 2,
      description: 'Tagline below title (1 sentence)',
    },
    {
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 4,
      description: 'Brief overview (2-3 sentences)',
    },
  ],
  validation: (Rule) => Rule.custom((heroSection, context) => {
    // Only require heroSection for new editorial format
    // Legacy projects can skip this
    return true;
  }),
}),

// Rename sections → slides
defineField({
  name: 'slides',
  title: 'Content Slides',
  type: 'array',
  description: 'Main content slides (editorial format)',
  of: [
    {
      type: 'object',
      name: 'contentSlide',
      title: 'Content Slide',
      fields: [
        {
          name: 'sectionLabel',
          title: 'Section Label',
          type: 'string',
          description: 'Small label (e.g., "Opening", "The Solution")',
        },
        {
          name: 'heading',
          title: 'Heading',
          type: 'string',
          description: 'Main slide heading',
        },
        {
          name: 'content',
          title: 'Content',
          type: 'array',
          of: [
            { type: 'block' },
            {
              type: 'image',
              options: { hotspot: true },
              fields: [
                {
                  name: 'caption',
                  type: 'string',
                  title: 'Caption',
                },
              ],
            },
          ],
        },
        {
          name: 'quoteBox',
          title: 'Quote Box',
          type: 'object',
          description: 'Optional pullquote',
          fields: [
            {
              name: 'quote',
              title: 'Quote Text',
              type: 'text',
              rows: 3,
            },
            {
              name: 'attribution',
              title: 'Attribution',
              type: 'string',
              description: 'Quote source (e.g., "— On building X")',
            },
          ],
        },
        {
          name: 'comparisonBoxes',
          title: 'Comparison Boxes',
          type: 'array',
          description: 'Problem/Solution or Before/After boxes',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'label',
                  title: 'Label',
                  type: 'string',
                  description: 'Box label (e.g., "The Problem")',
                },
                {
                  name: 'title',
                  title: 'Title',
                  type: 'string',
                },
                {
                  name: 'text',
                  title: 'Text Content',
                  type: 'text',
                  rows: 4,
                },
                {
                  name: 'stat',
                  title: 'Stat (optional)',
                  type: 'string',
                  description: 'Large stat to display',
                },
                {
                  name: 'icon',
                  title: 'Icon (optional)',
                  type: 'string',
                  description: 'Emoji or icon character',
                },
              ],
              preview: {
                select: {
                  title: 'title',
                  subtitle: 'label',
                },
              },
            },
          ],
        },
        {
          name: 'visualCards',
          title: 'Visual Cards',
          type: 'array',
          description: 'Screenshots or images',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'image',
                  title: 'Image',
                  type: 'image',
                  options: { hotspot: true },
                },
                {
                  name: 'placeholderText',
                  title: 'Placeholder Text',
                  type: 'text',
                  description: 'Text to show if no image',
                  rows: 2,
                },
                {
                  name: 'caption',
                  title: 'Caption',
                  type: 'string',
                },
              ],
              preview: {
                select: {
                  title: 'placeholderText',
                  subtitle: 'caption',
                  media: 'image',
                },
              },
            },
          ],
        },
        {
          name: 'annotation',
          title: 'Design Annotation',
          type: 'object',
          description: 'Optional annotation or design decision callout',
          fields: [
            {
              name: 'title',
              type: 'string',
              title: 'Annotation Title',
              description: 'e.g., "Technical Note"',
            },
            {
              name: 'content',
              type: 'text',
              title: 'Annotation Content',
              rows: 3,
            },
          ],
        },
      ],
      preview: {
        select: {
          title: 'heading',
          subtitle: 'sectionLabel',
        },
      },
    },
  ],
}),

// Call to Action (NEW)
defineField({
  name: 'callToAction',
  title: 'Call to Action',
  type: 'object',
  fields: [
    {
      name: 'text',
      title: 'Button Text',
      type: 'string',
      description: 'e.g., "View More Projects"',
    },
    {
      name: 'link',
      title: 'Link URL',
      type: 'string',
      description: 'Internal path or external URL',
    },
  ],
}),
```

**Mark deprecated fields as hidden:**

```typescript
// DEPRECATED FIELDS (keep for migration, hide from UI)
defineField({
  name: 'summary',
  title: '[DEPRECATED] Summary',
  type: 'text',
  description: '⚠️ Deprecated: Use heroSection.summary instead',
  hidden: true,
}),
defineField({
  name: 'description',
  title: '[DEPRECATED] Description',
  type: 'text',
  description: '⚠️ Deprecated: Use heroSection.subtitle instead',
  hidden: true,
}),
defineField({
  name: 'heroImage',
  title: '[DEPRECATED] Hero Image',
  type: 'image',
  description: '⚠️ Deprecated: Not used in editorial format',
  hidden: true,
}),
defineField({
  name: 'content',
  title: '[DEPRECATED] Content',
  type: 'array',
  of: [{ type: 'block' }, { type: 'image' }],
  description: '⚠️ Deprecated: Use slides instead',
  hidden: true,
}),
defineField({
  name: 'achievements',
  title: '[DEPRECATED] Achievements',
  type: 'array',
  of: [{ type: 'string' }],
  description: '⚠️ Deprecated: Use metrics and narrative instead',
  hidden: true,
}),
defineField({
  name: 'featuredMetric',
  title: '[DEPRECATED] Featured Metric',
  type: 'string',
  description: '⚠️ Deprecated: Derive from metrics[0].value',
  hidden: true,
}),
defineField({
  name: 'featuredDescription',
  title: '[DEPRECATED] Featured Description',
  type: 'text',
  description: '⚠️ Deprecated: Derive from heroSection.summary',
  hidden: true,
}),
defineField({
  name: 'sections',
  title: '[DEPRECATED] Sections',
  type: 'array',
  description: '⚠️ Deprecated: Renamed to slides',
  hidden: true,
}),
```

#### 1.2 Deploy Schema Changes

```bash
# From sanity directory
npm run deploy
```

**Verification:**
- [ ] Schema deployed successfully
- [ ] New fields appear in Sanity Studio
- [ ] Deprecated fields are hidden
- [ ] Existing projects still load correctly

**Estimated Time:** 2 hours

---

## Phase 2: Create Migration Scripts

### Objective
Create Sanity CLI migration scripts to automate the transformation of content from editorial specs to Sanity documents.

### Tasks

#### 2.1 Create Migration Script Directory

```bash
mkdir -p scripts/migrations
```

#### 2.2 Install Dependencies

```bash
npm install --save-dev @sanity/client dotenv js-yaml
```

#### 2.3 Create Base Migration Script

**File:** `scripts/migrations/migrate-to-editorial.ts`

```typescript
import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

// Initialize Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN!, // Add this to .env.local
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
 * Extracts YAML front matter and content sections
 */
function parseEditorialSpec(filePath: string): {
  spec: EditorialSpec
  slides: SlideContent[]
} {
  const content = fs.readFileSync(filePath, 'utf-8')

  // Extract YAML blocks (metadata, heroSection, overview, metrics, etc.)
  const yamlBlocks = extractYamlBlocks(content)

  // Extract narrative content and editorial components
  const slides = extractSlides(content)

  return {
    spec: {
      metadata: yamlBlocks.metadata,
      heroSection: yamlBlocks.heroSection,
      overview: yamlBlocks.overview,
      metrics: yamlBlocks.metrics,
      technologies: yamlBlocks.technologies,
      callToAction: yamlBlocks.callToAction,
    },
    slides,
  }
}

/**
 * Extract YAML blocks from markdown
 */
function extractYamlBlocks(content: string): any {
  const yamlRegex = /```yaml\n([\s\S]*?)\n```/g
  const blocks: any = {}

  let match
  while ((match = yamlRegex.exec(content)) !== null) {
    const yamlContent = match[1]
    const parsed = yaml.load(yamlContent)

    // Determine which block this is based on content
    if (parsed.title && parsed.slug) {
      blocks.metadata = parsed
    } else if (parsed.heroSection) {
      blocks.heroSection = parsed.heroSection
    } else if (parsed.overview) {
      blocks.overview = parsed.overview
    } else if (parsed.metrics) {
      blocks.metrics = parsed.metrics
    } else if (parsed.technologies) {
      blocks.technologies = parsed.technologies
    } else if (parsed.callToAction) {
      blocks.callToAction = parsed.callToAction
    }
  }

  return blocks
}

/**
 * Extract slides from markdown narrative
 * Looks for headings and editorial component YAML blocks
 */
function extractSlides(content: string): SlideContent[] {
  const slides: SlideContent[] = []

  // Split by ### headings in "The Story" section
  const storySection = content.match(/## The Story.*?(?=##|$)/s)?.[0] || ''
  const subsections = storySection.split(/###\s+/).slice(1) // Skip first empty element

  subsections.forEach(section => {
    const lines = section.split('\n')
    const heading = lines[0].trim()

    const slide: SlideContent = {
      heading,
      content: '',
    }

    // Extract content paragraphs
    const contentLines: string[] = []
    let inYamlBlock = false

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i]

      // Track YAML blocks
      if (line.includes('```yaml')) {
        inYamlBlock = true
        continue
      }
      if (line.includes('```') && inYamlBlock) {
        inYamlBlock = false
        continue
      }

      // Skip YAML block content
      if (inYamlBlock) continue

      // Skip markers for editorial components
      if (line.includes('**Quote Box:**') ||
          line.includes('**Comparison Boxes:**') ||
          line.includes('**Visual Cards:**') ||
          line.includes('**Annotation:**')) {
        continue
      }

      // Collect content
      if (line.trim() && !line.startsWith('#')) {
        contentLines.push(line)
      }
    }

    slide.content = contentLines.join('\n').trim()

    // Extract editorial components from YAML blocks in this section
    const sectionContent = section

    // Extract quoteBox
    const quoteMatch = sectionContent.match(/\*\*Quote Box:\*\*\s*```yaml\n([\s\S]*?)\n```/)
    if (quoteMatch) {
      const quoteData = yaml.load(quoteMatch[1]) as any
      slide.quoteBox = quoteData.quoteBox
    }

    // Extract comparisonBoxes
    const comparisonMatch = sectionContent.match(/\*\*Comparison Boxes:\*\*\s*```yaml\n([\s\S]*?)\n```/)
    if (comparisonMatch) {
      const comparisonData = yaml.load(comparisonMatch[1]) as any
      slide.comparisonBoxes = comparisonData.comparisonBoxes
    }

    // Extract visualCards
    const visualMatch = sectionContent.match(/\*\*Visual Cards:\*\*\s*```yaml\n([\s\S]*?)\n```/)
    if (visualMatch) {
      const visualData = yaml.load(visualMatch[1]) as any
      slide.visualCards = visualData.visualCards
    }

    // Extract annotation
    const annotationMatch = sectionContent.match(/\*\*Annotation:\*\*\s*```yaml\n([\s\S]*?)\n```/)
    if (annotationMatch) {
      const annotationData = yaml.load(annotationMatch[1]) as any
      slide.annotation = annotationData.annotation
    }

    slides.push(slide)
  })

  return slides
}

/**
 * Convert markdown content to Portable Text blocks
 */
function markdownToPortableText(markdown: string): any[] {
  // Simple conversion - can be enhanced with proper markdown parser
  const paragraphs = markdown.split('\n\n').filter(p => p.trim())

  return paragraphs.map(para => {
    // Handle bold text
    const hasBold = para.includes('**')

    if (hasBold) {
      const parts = para.split('**')
      const children: any[] = []

      parts.forEach((part, index) => {
        if (index % 2 === 0) {
          // Regular text
          if (part) children.push({ _type: 'span', text: part, marks: [] })
        } else {
          // Bold text
          if (part) children.push({ _type: 'span', text: part, marks: ['strong'] })
        }
      })

      return {
        _type: 'block',
        style: 'normal',
        children,
      }
    }

    return {
      _type: 'block',
      style: 'normal',
      children: [{ _type: 'span', text: para, marks: [] }],
    }
  })
}

/**
 * Create or update project in Sanity
 */
async function migrateProject(specPath: string, dryRun = true) {
  console.log(`\n📄 Processing: ${specPath}`)

  const { spec, slides } = parseEditorialSpec(specPath)

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

    slides: slides.map(slide => ({
      _type: 'contentSlide',
      _key: Math.random().toString(36).substr(2, 9),
      sectionLabel: slide.sectionLabel,
      heading: slide.heading,
      content: slide.content ? markdownToPortableText(slide.content) : undefined,
      quoteBox: slide.quoteBox,
      comparisonBoxes: slide.comparisonBoxes?.map(box => ({
        ...box,
        _key: Math.random().toString(36).substr(2, 9),
      })),
      visualCards: slide.visualCards?.map(card => ({
        ...card,
        _key: Math.random().toString(36).substr(2, 9),
      })),
      annotation: slide.annotation,
    })),
  }

  // Add _id if updating existing project
  if (existingProject) {
    projectDoc._id = existingProject._id
    console.log(`   ✏️  Updating existing project: ${existingProject._id}`)
  } else {
    console.log(`   ✨ Creating new project`)
  }

  if (dryRun) {
    console.log('   🔍 DRY RUN - Document structure:')
    console.log(JSON.stringify(projectDoc, null, 2))
  } else {
    const result = await client.createOrReplace(projectDoc)
    console.log(`   ✅ Migrated successfully: ${result._id}`)
  }
}

/**
 * Main migration function
 */
async function runMigration() {
  const dryRun = process.argv.includes('--dry-run')
  const specificProject = process.argv.find(arg => arg.startsWith('--project='))?.split('=')[1]

  console.log('🚀 Starting Case Study Editorial Migration')
  console.log(`   Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}`)
  console.log('')

  // Define specs to migrate
  const specsDir = path.join(__dirname, '../../docs/content-specs/detailed-specs')
  const specs = [
    'virgin-america-editorial-spec.md',
    'before-launcher-editorial-spec.md',
    'casa-bonita-editorial-spec.md',
    'target-editorial-spec.md',
    'peddle-editorial-spec.md',
  ]

  // Filter if specific project requested
  const specsToMigrate = specificProject
    ? specs.filter(spec => spec.includes(specificProject))
    : specs

  // Run migrations
  for (const spec of specsToMigrate) {
    const specPath = path.join(specsDir, spec)

    if (!fs.existsSync(specPath)) {
      console.log(`   ⚠️  Spec not found: ${spec}`)
      continue
    }

    try {
      await migrateProject(specPath, dryRun)
    } catch (error) {
      console.error(`   ❌ Error migrating ${spec}:`, error)
    }
  }

  console.log('\n✅ Migration complete!')
  if (dryRun) {
    console.log('\n💡 Run without --dry-run to execute migration')
  }
}

// Run migration
runMigration().catch(console.error)
```

#### 2.4 Add Scripts to package.json

```json
{
  "scripts": {
    "migrate:case-studies": "tsx scripts/migrations/migrate-to-editorial.ts",
    "migrate:case-studies:dry-run": "tsx scripts/migrations/migrate-to-editorial.ts --dry-run",
    "migrate:case-study": "tsx scripts/migrations/migrate-to-editorial.ts --project="
  }
}
```

#### 2.5 Create .env.local Entry

Add to `.env.local`:

```bash
# Sanity API Token (create at https://sanity.io/manage)
# Needs Editor or Admin permissions
SANITY_API_TOKEN=your_token_here
```

**To create token:**
1. Go to https://sanity.io/manage
2. Select your project
3. Go to API → Tokens
4. Create new token with "Editor" or "Admin" permissions
5. Copy token to `.env.local`

**Verification:**
- [ ] Migration script created
- [ ] Dependencies installed
- [ ] Scripts added to package.json
- [ ] Sanity API token added to .env.local
- [ ] Dry run executes successfully

**Estimated Time:** 4-6 hours

---

## Phase 3: Test Migration (Dry Run)

### Objective
Test the migration script with dry runs to ensure content is parsed correctly.

### Tasks

#### 3.1 Run Dry Run for Single Project

```bash
npm run migrate:case-studies:dry-run -- --project=virgin-america
```

**Validate output:**
- [ ] heroSection populated correctly
- [ ] overview fields correct
- [ ] metrics array formatted properly
- [ ] slides array contains all content
- [ ] quoteBoxes, comparisonBoxes, visualCards extracted
- [ ] Portable Text conversion looks correct

#### 3.2 Run Dry Run for All Projects

```bash
npm run migrate:case-studies:dry-run
```

**Validate:**
- [ ] All 5 projects parse successfully
- [ ] No errors in console
- [ ] Document structure looks correct
- [ ] Field mappings are accurate

#### 3.3 Manual Review

Review the dry run output for each project:

1. **Virgin America**
   - Check "clicks vs decisions" quote
   - Verify comparison boxes (Problem/Constraint)
   - Check technical annotation

2. **Before Launcher**
   - Check product success vs business reality comparison
   - Verify metrics (30-40%, Thousands, #1)
   - Check quote about business viability

3. **Casa Bonita**
   - Check 40,000 queue metric
   - Verify handoff quote
   - Check platform migration comparison

4. **Target**
   - Check 20+ work streams metric
   - Verify "empower not replace" philosophy
   - Check strategy quote

5. **Peddle**
   - Check +15% and +5% metrics
   - Verify "ship faster" reflection
   - Check data infrastructure description

**Verification:**
- [ ] All content parsed correctly
- [ ] No data loss from specs
- [ ] Editorial components extracted properly
- [ ] Ready for live migration

**Estimated Time:** 2 hours

---

## Phase 4: Build Magazine Components

### Objective
Create React components for rendering editorial case studies.

### Tasks

#### 4.1 Create Magazine Component Directory

```bash
mkdir -p src/components/magazine
mkdir -p src/components/case-study-magazine
```

#### 4.2 Reuse AI Showcase Components

Copy/adapt from AI Showcase:

**Already exist (reuse as-is):**
- `MagazineLayout.tsx`
- `MagazineHero.tsx`
- `MagazineLede.tsx`
- `MagazineBody.tsx`
- `MagazinePullQuote.tsx`
- `MagazineMetrics.tsx`
- `MagazineSectionHeader.tsx`
- `MagazineComparisonGrid.tsx`
- `MagazineTechStack.tsx`
- `MagazineSeparator.tsx`

**Location:** `src/components/ai-showcase-magazine/`

**Action:** Create barrel export for magazine components

```typescript
// src/components/magazine/index.ts
export * from '../ai-showcase-magazine'
```

#### 4.3 Create Case Study-Specific Components

**File:** `src/components/case-study-magazine/MagazineOverview.tsx`

```typescript
'use client'

import React from 'react'

interface MagazineOverviewProps {
  role?: string
  company?: string
  timeline?: string
}

export function MagazineOverview({ role, company, timeline }: MagazineOverviewProps) {
  if (!role && !company && !timeline) return null

  return (
    <div className="max-w-3xl mx-auto mb-12 text-muted-foreground text-sm">
      <div className="flex flex-wrap gap-6">
        {role && (
          <div>
            <span className="font-semibold text-foreground">Role:</span> {role}
          </div>
        )}
        {company && (
          <div>
            <span className="font-semibold text-foreground">Company:</span> {company}
          </div>
        )}
        {timeline && (
          <div>
            <span className="font-semibold text-foreground">Timeline:</span> {timeline}
          </div>
        )}
      </div>
    </div>
  )
}
```

**File:** `src/components/case-study-magazine/MagazineAnnotation.tsx`

```typescript
'use client'

import React from 'react'

interface MagazineAnnotationProps {
  title?: string
  content: string
}

export function MagazineAnnotation({ title, content }: MagazineAnnotationProps) {
  return (
    <div className="my-12 max-w-3xl mx-auto">
      <div className="border-l-2 border-accent pl-6 py-4 bg-accent/5 rounded-r-lg">
        {title && (
          <div className="text-xs uppercase tracking-wider text-accent font-semibold mb-2">
            {title}
          </div>
        )}
        <div className="text-sm text-muted-foreground leading-relaxed">
          {content}
        </div>
      </div>
    </div>
  )
}
```

**File:** `src/components/case-study-magazine/MagazineVisualCards.tsx`

```typescript
'use client'

import React from 'react'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/client'

interface VisualCard {
  image?: any
  placeholderText?: string
  caption?: string
}

interface MagazineVisualCardsProps {
  cards: VisualCard[]
}

export function MagazineVisualCards({ cards }: MagazineVisualCardsProps) {
  if (!cards || cards.length === 0) return null

  return (
    <div className="my-12 max-w-5xl mx-auto">
      <div className={`grid gap-8 ${cards.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
        {cards.map((card, index) => (
          <div key={index} className="space-y-3">
            <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-muted border border-border">
              {card.image ? (
                <Image
                  src={urlFor(card.image).url()}
                  alt={card.caption || card.placeholderText || ''}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
                  <div className="text-muted-foreground">
                    {card.placeholderText || 'Visual placeholder'}
                  </div>
                </div>
              )}
            </div>
            {card.caption && (
              <div className="text-sm text-muted-foreground text-center">
                {card.caption}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
```

**File:** `src/components/case-study-magazine/MagazineCTA.tsx`

```typescript
'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface MagazineCTAProps {
  text?: string
  link?: string
}

export function MagazineCTA({ text = 'View More Projects', link = '/work' }: MagazineCTAProps) {
  return (
    <div className="max-w-3xl mx-auto text-center py-12">
      <Link
        href={link}
        className="inline-flex items-center gap-2 text-accent hover:text-accent-light transition-colors font-medium"
      >
        {text}
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  )
}
```

**File:** `src/components/case-study-magazine/index.ts`

```typescript
export { MagazineOverview } from './MagazineOverview'
export { MagazineAnnotation } from './MagazineAnnotation'
export { MagazineVisualCards } from './MagazineVisualCards'
export { MagazineCTA } from './MagazineCTA'
```

**Verification:**
- [ ] All components created
- [ ] TypeScript types defined
- [ ] Barrel exports created
- [ ] Components follow design system

**Estimated Time:** 3-4 hours

---

## Phase 5: Create Case Study Page Layout

### Objective
Build the magazine-style layout for case study detail pages.

### Tasks

#### 5.1 Create CaseStudyPageMagazine Component

**File:** `src/app/(public)/case-studies/[slug]/CaseStudyPageMagazine.tsx`

```typescript
'use client'

import React from 'react'
import { PortableText } from '@portabletext/react'
import type { Project } from '@/types/project'
import {
  MagazineLayout,
  MagazineHero,
  MagazineLede,
  MagazineBody,
  MagazinePullQuote,
  MagazineMetrics,
  MagazineSectionHeader,
  MagazineComparisonGrid,
  MagazineTechStack,
  MagazineSeparator,
} from '@/components/magazine'
import {
  MagazineOverview,
  MagazineAnnotation,
  MagazineVisualCards,
  MagazineCTA
} from '@/components/case-study-magazine'

interface CaseStudyPageMagazineProps {
  project: Project
}

export function CaseStudyPageMagazine({ project }: CaseStudyPageMagazineProps) {
  return (
    <MagazineLayout>
      {/* Hero */}
      <MagazineHero
        badge={project.heroSection?.badge}
        title={project.heroSection?.title || project.title}
        subtitle={project.heroSection?.subtitle}
      />

      {/* Project Context */}
      {project.overview && (
        <MagazineOverview
          role={project.overview.role}
          company={project.overview.company}
          timeline={project.overview.timeline}
        />
      )}

      {/* Lede */}
      {project.heroSection?.summary && (
        <MagazineLede>{project.heroSection.summary}</MagazineLede>
      )}

      <MagazineSeparator />

      {/* Content Slides */}
      {project.slides?.map((slide, index) => (
        <React.Fragment key={index}>
          {slide.sectionLabel && (
            <MagazineSectionHeader>{slide.sectionLabel}</MagazineSectionHeader>
          )}

          {slide.content && (
            <MagazineBody>
              <PortableText value={slide.content} />
            </MagazineBody>
          )}

          {slide.quoteBox && (
            <MagazinePullQuote
              quote={slide.quoteBox.quote}
              attribution={slide.quoteBox.attribution}
            />
          )}

          {slide.comparisonBoxes && (
            <MagazineComparisonGrid boxes={slide.comparisonBoxes} />
          )}

          {slide.visualCards && (
            <MagazineVisualCards cards={slide.visualCards} />
          )}

          {slide.annotation && (
            <MagazineAnnotation
              title={slide.annotation.title}
              content={slide.annotation.content}
            />
          )}

          {slide.sectionLabel && index < (project.slides?.length ?? 0) - 1 && (
            <MagazineSeparator />
          )}
        </React.Fragment>
      ))}

      {/* Metrics */}
      {project.metrics && (
        <>
          <MagazineSectionHeader>The Results</MagazineSectionHeader>
          <MagazineMetrics metrics={project.metrics} />
        </>
      )}

      {/* Tech Stack */}
      {project.technologies && (
        <MagazineTechStack technologies={project.technologies} />
      )}

      <MagazineSeparator />

      {/* CTA */}
      {project.callToAction && (
        <MagazineCTA
          text={project.callToAction.text}
          link={project.callToAction.link}
        />
      )}
    </MagazineLayout>
  )
}
```

#### 5.2 Update Case Study Detail Page

**File:** `src/app/(public)/case-studies/[slug]/page.tsx`

Update to use magazine layout when `heroSection` exists:

```typescript
import { CaseStudyPageMagazine } from './CaseStudyPageMagazine'

// ... existing imports and functions ...

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params
  const { data: project } = await sanityFetch<CaseStudyData>({
    query: PROJECT_QUERY,
    params: { slug }
  })

  if (!project) {
    notFound()
  }

  // Use magazine layout if heroSection exists (editorial format)
  if (project.heroSection) {
    return <CaseStudyPageMagazine project={project} />
  }

  // Otherwise use legacy layout
  return (
    // ... existing legacy layout ...
  )
}
```

#### 5.3 Update TypeScript Types

**File:** `src/types/project.ts`

```typescript
export interface Project {
  _id: string
  title: string
  slug: { current: string }
  category?: string
  featured?: boolean
  order?: number
  publishedAt?: string

  // Editorial format fields
  heroSection?: {
    badge?: string
    title: string
    subtitle?: string
    summary?: string
  }

  overview?: {
    role?: string
    company?: string
    timeline?: string
  }

  slides?: Array<{
    sectionLabel?: string
    heading?: string
    content?: any[] // Portable Text
    quoteBox?: {
      quote: string
      attribution?: string
    }
    comparisonBoxes?: Array<{
      label?: string
      title?: string
      text: string
      stat?: string
      icon?: string
    }>
    visualCards?: Array<{
      image?: any
      placeholderText?: string
      caption?: string
    }>
    annotation?: {
      title?: string
      content: string
    }
  }>

  metrics?: Array<{
    value: string
    label: string
    description?: string
  }>

  technologies?: string[]

  callToAction?: {
    text: string
    link: string
  }

  // Legacy fields (deprecated)
  summary?: string
  description?: string
  heroImage?: any
  content?: any[]
  achievements?: string[]
  sections?: any[]
}
```

**Verification:**
- [ ] Magazine layout component created
- [ ] Conditional rendering added to detail page
- [ ] TypeScript types updated
- [ ] No type errors in codebase

**Estimated Time:** 2-3 hours

---

## Phase 6: Update Homepage Query

### Objective
Update homepage query to derive featured fields from new schema.

### Tasks

#### 6.1 Update Homepage Query

**File:** `src/app/(public)/page.tsx`

```typescript
// Update featured case studies query
sanityFetch({
  query: `
    *[_type == "project" && featured == true] | order(order asc) {
      _id,
      title,
      "slug": slug.current,
      category,
      "featuredMetric": coalesce(
        featuredMetric,
        metrics[0].value
      ),
      "featuredDescription": coalesce(
        featuredDescription,
        heroSection.summary,
        summary
      ),
      order
    }
  `
})
```

**Explanation:**
- Uses `coalesce()` to try `featuredMetric` first, then fall back to `metrics[0].value`
- Same for `featuredDescription` - tries old field, then new field, then legacy field
- Provides backward compatibility during migration

**Verification:**
- [ ] Homepage loads correctly
- [ ] Featured case studies display
- [ ] Works with both old and new format projects
- [ ] No console errors

**Estimated Time:** 1 hour

---

## Phase 7: Run Live Migration

### Objective
Execute the migration script to create/update projects in Sanity.

### Tasks

#### 7.1 Backup Existing Data

```bash
# Export existing projects
npx sanity dataset export production backup-before-migration.tar.gz
```

#### 7.2 Run Migration for Single Project (Test)

```bash
npm run migrate:case-studies -- --project=virgin-america
```

**Verify in Sanity Studio:**
- [ ] Project created/updated
- [ ] heroSection populated
- [ ] slides contain all content
- [ ] Editorial components (quotes, comparisons, etc.) present
- [ ] Metrics correct
- [ ] Technologies listed

#### 7.3 View in Browser

Navigate to: `http://localhost:3000/case-studies/virgin-america`

**Verify:**
- [ ] Magazine layout renders
- [ ] Hero section displays
- [ ] Overview shows role/company/timeline
- [ ] Content flows naturally
- [ ] Pull quotes render
- [ ] Comparison boxes display
- [ ] Visual cards show placeholders
- [ ] Annotations appear
- [ ] Metrics section shows
- [ ] Tech stack displays
- [ ] CTA renders

#### 7.4 Run Full Migration

If single project test passes:

```bash
npm run migrate:case-studies
```

**Verify all 5 projects:**
- [ ] Virgin America
- [ ] Before Launcher
- [ ] Casa Bonita
- [ ] Target
- [ ] Peddle

#### 7.5 Test Homepage

Navigate to: `http://localhost:3000`

**Verify:**
- [ ] Featured case studies display
- [ ] Metrics show correctly
- [ ] Descriptions display
- [ ] Links work

**Verification:**
- [ ] All 5 case studies migrated successfully
- [ ] No errors in Sanity Studio
- [ ] All projects render correctly
- [ ] Homepage works with new format

**Estimated Time:** 2-3 hours

---

## Phase 8: Cleanup & Optimization

### Objective
Remove deprecated fields and optimize queries.

### Tasks

#### 8.1 Verify All Projects Use Editorial Format

```bash
# Query Sanity to check
npx sanity exec scripts/check-editorial-format.ts
```

**Script:** `scripts/check-editorial-format.ts`

```typescript
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: false,
})

async function checkFormat() {
  const projects = await client.fetch(`
    *[_type == "project"] {
      _id,
      title,
      "hasHeroSection": defined(heroSection),
      "hasSlides": defined(slides),
      "hasDeprecatedSections": defined(sections)
    }
  `)

  console.log('\n📊 Editorial Format Status:\n')

  projects.forEach((p: any) => {
    const status = p.hasHeroSection && p.hasSlides ? '✅' : '❌'
    console.log(`${status} ${p.title}`)
    if (!p.hasHeroSection) console.log('   ⚠️  Missing heroSection')
    if (!p.hasSlides) console.log('   ⚠️  Missing slides')
    if (p.hasDeprecatedSections) console.log('   📦 Has deprecated sections field')
  })
}

checkFormat()
```

#### 8.2 Remove Deprecated Fields from Schema

Once all projects are migrated, remove deprecated fields:

**File:** `sanity/schemas/project.ts`

Remove these fields entirely:
- `summary`
- `description`
- `heroImage`
- `content`
- `achievements`
- `featuredMetric`
- `featuredDescription`
- `sections`

#### 8.3 Simplify Homepage Query

**File:** `src/app/(public)/page.tsx`

```typescript
// Simplified query (no coalesce needed)
sanityFetch({
  query: `
    *[_type == "project" && featured == true] | order(order asc) {
      _id,
      title,
      "slug": slug.current,
      category,
      "featuredMetric": metrics[0].value,
      "featuredDescription": heroSection.summary,
      order
    }
  `
})
```

#### 8.4 Remove Legacy Components

Delete old case study components:
- `src/components/case-studies/detail/CaseStudyHero.tsx`
- `src/components/case-studies/detail/CaseStudySection.tsx`
- `src/components/case-studies/detail/CaseStudySectionHeader.tsx`
- `src/components/case-studies/detail/CaseStudyAnnotation.tsx`
- `src/components/case-studies/detail/CaseStudyMetrics.tsx`
- `src/components/case-studies/detail/CaseStudyAchievements.tsx`
- `src/components/case-studies/detail/CaseStudyCTA.tsx`

Remove conditional rendering from detail page (only use magazine layout).

#### 8.5 Update Documentation

Update `CLAUDE.md` and other docs to reflect new editorial format.

**Verification:**
- [ ] All projects use editorial format
- [ ] Deprecated fields removed from schema
- [ ] Homepage query simplified
- [ ] Legacy components deleted
- [ ] Documentation updated
- [ ] Build passes (`npm run build`)
- [ ] No TypeScript errors

**Estimated Time:** 2-3 hours

---

## Phase 9: Production Deployment

### Objective
Deploy editorial case studies to production.

### Tasks

#### 9.1 Final Testing

```bash
# Build production bundle
npm run build

# Test production build locally
npm run start
```

**Test all pages:**
- [ ] Homepage
- [ ] Case study index page
- [ ] All 5 case study detail pages
- [ ] Mobile responsive
- [ ] Dark mode (if applicable)

#### 9.2 Deploy to Production

```bash
# Deploy Sanity schema
cd sanity && npm run deploy

# Deploy Next.js app
vercel --prod
```

#### 9.3 Run Production Migration

**In production environment:**

```bash
# Set production env vars
export SANITY_API_TOKEN=prod_token_here

# Run migration
npm run migrate:case-studies
```

#### 9.4 Verify Production

**Check:**
- [ ] All case studies accessible
- [ ] Magazine layout renders correctly
- [ ] No console errors
- [ ] Images load (if any)
- [ ] Links work
- [ ] Analytics tracking works
- [ ] SEO meta tags correct

**Verification:**
- [ ] Production deployment successful
- [ ] All case studies migrated in production
- [ ] No errors or broken pages
- [ ] Performance acceptable

**Estimated Time:** 2 hours

---

## Rollback Plan

If issues arise:

### Phase 1-2: Schema Issues
- Revert schema changes via Sanity Studio history
- Redeploy previous schema version

### Phase 3-5: Component Issues
- Revert to previous git commit
- Redeploy

### Phase 6-7: Migration Issues
- Delete migrated projects in Sanity Studio
- Or restore from backup: `npx sanity dataset import backup-before-migration.tar.gz production`
- Remove `heroSection` and `slides` fields from affected documents

### Phase 8-9: Production Issues
- Rollback Vercel deployment
- Revert Sanity schema
- Restore data from backup

---

## Timeline Summary

| Phase | Description | Estimated Time |
|-------|-------------|----------------|
| 1 | Schema Updates | 2 hours |
| 2 | Migration Scripts | 4-6 hours |
| 3 | Test Migration (Dry Run) | 2 hours |
| 4 | Build Components | 3-4 hours |
| 5 | Case Study Page Layout | 2-3 hours |
| 6 | Update Homepage Query | 1 hour |
| 7 | Run Live Migration | 2-3 hours |
| 8 | Cleanup & Optimization | 2-3 hours |
| 9 | Production Deployment | 2 hours |
| **Total** | | **20-26 hours** |

**Recommended Schedule:**
- **Week 1:** Phases 1-3 (Schema, Scripts, Testing)
- **Week 2:** Phases 4-6 (Components, Layout, Queries)
- **Week 3:** Phases 7-9 (Migration, Cleanup, Deploy)

---

## Success Criteria

- [ ] All 5 case studies in editorial format
- [ ] Magazine layout renders correctly
- [ ] No deprecated fields in schema
- [ ] Homepage works with new format
- [ ] All editorial components display properly
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Build passes successfully
- [ ] Production deployment successful
- [ ] Performance maintained or improved

---

## Notes & Considerations

### Migration Script Enhancements

The base migration script can be enhanced with:

1. **Better Markdown Parsing:**
   - Use `remark` or `unified` for robust markdown → Portable Text conversion
   - Handle lists, links, code blocks, etc.

2. **Image Upload:**
   - Parse image references from specs
   - Upload images to Sanity
   - Link images in visualCards

3. **Validation:**
   - Validate document structure before creating
   - Check for required fields
   - Warn about missing content

4. **Progress Tracking:**
   - Show progress bar for batch migrations
   - Log detailed results
   - Generate migration report

### Alternative: Manual Entry

If migration script is too complex, content can be entered manually in Sanity Studio:

**Pros:**
- More control over content
- Can refine as you enter
- No parsing issues

**Cons:**
- Time-consuming (2-3 hours per case study)
- Higher risk of typos/errors
- Harder to reproduce

**Recommendation:** Start with automated migration, manually refine if needed.

### Content Refinement

After migration:
- Review each case study in browser
- Refine content flow
- Adjust editorial components
- Add images (replace placeholders)
- Fine-tune metrics and quotes

---

## Questions & Support

If you encounter issues:

1. **Schema errors:** Check Sanity Studio console, review field definitions
2. **Migration errors:** Check script output, validate editorial spec format
3. **Component errors:** Check browser console, review TypeScript types
4. **Query errors:** Check Sanity Vision, test GROQ queries

**Resources:**
- Sanity Docs: https://www.sanity.io/docs
- Sanity CLI: https://www.sanity.io/docs/cli
- GROQ Query Language: https://www.sanity.io/docs/groq
- Portable Text: https://www.sanity.io/docs/presenting-block-text

---

**Last Updated:** November 3, 2025
