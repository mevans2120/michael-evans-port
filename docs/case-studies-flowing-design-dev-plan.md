# Case Studies: Flowing Article Design & Development Plan
**Date:** November 5, 2025
**Goal:** Implement flowing magazine-style articles with inline stat blocks and rich WYSIWYG editing

---

## Executive Summary

This document outlines the **technical implementation** for transforming case studies from slide-based sections to flowing articles with inline stat blocks.

### Key Changes

**From**: Slide-based structure (`slides[]` array)
**To**: Single Portable Text field (`article`) with inline stat blocks

**Stat Blocks**: 3 types (Big Number, Quote, Free Text), inserted inline, limit 3-5 per article

**WYSIWYG Features**: H2-H6, bold, italic, underline, hyperlinks, images (with captions), pull quotes, video embeds, code blocks

**No Navigation**: Pure scrolling experience (no sticky TOC)

---

## Part 1: Schema Design

### Current Schema (slides-based)

```typescript
// Current: project.ts
defineField({
  name: 'slides',
  title: 'Content Slides (Editorial Format)',
  type: 'array',
  of: [{
    type: 'object',
    name: 'contentSlide',
    fields: [
      { name: 'sectionLabel', type: 'string' },
      { name: 'heading', type: 'string' },
      { name: 'content', type: 'array', of: [{ type: 'block' }, ...] },
      { name: 'quoteBox', type: 'object', ... },
      { name: 'comparisonBoxes', type: 'array', ... },
      { name: 'visualCards', type: 'array', ... },
      { name: 'annotation', type: 'object', ... }
    ]
  }]
})
```

---

### New Schema (flowing article)

```typescript
// New: project.ts
defineField({
  name: 'article',
  title: 'Article Content (Flowing Editorial)',
  type: 'array',
  description: 'Main article content with inline stat blocks',
  of: [
    // 1. Standard Portable Text blocks
    {
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        { title: 'H5', value: 'h5' },
        { title: 'H6', value: 'h6' },
        { title: 'Quote', value: 'blockquote' }
      ],
      marks: {
        decorators: [
          { title: 'Bold', value: 'strong' },
          { title: 'Italic', value: 'em' },
          { title: 'Underline', value: 'underline' },
          { title: 'Code', value: 'code' }
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              {
                name: 'href',
                type: 'url',
                title: 'URL',
                validation: (Rule) => Rule.uri({
                  scheme: ['http', 'https', 'mailto', 'tel']
                })
              },
              {
                name: 'newTab',
                type: 'boolean',
                title: 'Open in new tab',
                initialValue: false
              }
            ]
          }
        ]
      }
    },

    // 2. Images with captions
    {
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for accessibility',
          validation: (Rule) => Rule.required()
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Caption'
        }
      ]
    },

    // 3. Video embeds
    {
      type: 'object',
      name: 'videoEmbed',
      title: 'Video Embed',
      fields: [
        {
          name: 'url',
          type: 'url',
          title: 'Video URL',
          description: 'YouTube or Vimeo URL',
          validation: (Rule) => Rule.required().uri({
            scheme: ['http', 'https']
          })
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Caption'
        }
      ],
      preview: {
        select: {
          url: 'url',
          caption: 'caption'
        },
        prepare({ url, caption }) {
          return {
            title: caption || 'Video',
            subtitle: url
          }
        }
      }
    },

    // 4. Code blocks
    {
      type: 'code',
      name: 'codeBlock',
      title: 'Code Block',
      options: {
        language: 'javascript',
        languageAlternatives: [
          { title: 'JavaScript', value: 'javascript' },
          { title: 'TypeScript', value: 'typescript' },
          { title: 'Python', value: 'python' },
          { title: 'HTML', value: 'html' },
          { title: 'CSS', value: 'css' },
          { title: 'JSON', value: 'json' },
          { title: 'Bash', value: 'bash' }
        ],
        withFilename: true
      }
    },

    // 5. STAT BLOCK: Big Number
    {
      type: 'object',
      name: 'statBlockNumber',
      title: 'Stat Block: Big Number',
      fields: [
        {
          name: 'number',
          type: 'string',
          title: 'Number',
          description: 'e.g., "8%", "15", "2.5M"',
          validation: (Rule) => Rule.required().max(20)
        },
        {
          name: 'label',
          type: 'string',
          title: 'Label',
          description: 'Short context (max 5 words)',
          validation: (Rule) => Rule.required().max(50)
        }
      ],
      preview: {
        select: {
          number: 'number',
          label: 'label'
        },
        prepare({ number, label }) {
          return {
            title: `📊 ${number}`,
            subtitle: label
          }
        }
      }
    },

    // 6. STAT BLOCK: Quote
    {
      type: 'object',
      name: 'statBlockQuote',
      title: 'Stat Block: Quote',
      fields: [
        {
          name: 'quote',
          type: 'text',
          title: 'Quote Text',
          rows: 3,
          validation: (Rule) => Rule.required().max(200)
        },
        {
          name: 'attribution',
          type: 'string',
          title: 'Attribution',
          description: 'e.g., "— On design validation"',
          validation: (Rule) => Rule.max(80)
        }
      ],
      preview: {
        select: {
          quote: 'quote',
          attribution: 'attribution'
        },
        prepare({ quote, attribution }) {
          const truncatedQuote = quote?.length > 60
            ? quote.substring(0, 60) + '...'
            : quote
          return {
            title: `💬 "${truncatedQuote}"`,
            subtitle: attribution
          }
        }
      }
    },

    // 7. STAT BLOCK: Free Text
    {
      type: 'object',
      name: 'statBlockText',
      title: 'Stat Block: Free Text',
      fields: [
        {
          name: 'heading',
          type: 'string',
          title: 'Heading (optional)',
          description: 'Short heading for the callout',
          validation: (Rule) => Rule.max(60)
        },
        {
          name: 'text',
          type: 'text',
          title: 'Text Content',
          rows: 4,
          validation: (Rule) => Rule.required().max(400)
        }
      ],
      preview: {
        select: {
          heading: 'heading',
          text: 'text'
        },
        prepare({ heading, text }) {
          const truncatedText = text?.length > 60
            ? text.substring(0, 60) + '...'
            : text
          return {
            title: `📝 ${heading || 'Free Text'}`,
            subtitle: truncatedText
          }
        }
      }
    }
  ],
  validation: (Rule) => Rule.custom((value) => {
    if (!value || value.length === 0) return true

    // Count stat blocks
    const statBlocks = value.filter((block: any) =>
      ['statBlockNumber', 'statBlockQuote', 'statBlockText'].includes(block._type)
    )

    if (statBlocks.length > 5) {
      return 'Maximum 5 stat blocks per article. Consider which are most impactful.'
    }

    return true
  })
})
```

---

### Schema Migration Strategy

**Option 1: Keep Both Fields** (Recommended)
- Keep `slides` field but hide it (backward compatibility)
- Add new `article` field
- Migration script copies slides content into article format
- Benefits: Can roll back if needed, no data loss

**Option 2: Replace Field**
- Remove `slides` field entirely
- Add `article` field
- One-way migration
- Benefits: Cleaner schema
- Risks: No rollback option

**Recommendation**: Use Option 1 for safer migration.

---

## Part 2: Stat Block Design Concepts

### Type 1: Big Number

**Visual Design**:
```
┌──────────────────────────────────────┐
│                                      │
│            ┌─────┐                   │
│            │  8% │                   │  ← 72px font, accent color
│            └─────┘                   │
│                                      │
│     Conversion improvement           │  ← 16px font, muted color
│                                      │
└──────────────────────────────────────┘
     Subtle background or border
```

**Styling**:
- Background: `bg-accent/5` or `border-l-4 border-accent`
- Number: `text-7xl font-bold text-accent`
- Label: `text-base text-muted-foreground`
- Padding: `py-8 px-6`
- Max width: `max-w-md` (centered or left-aligned)

**When to use**:
- Quantitative impact (percentages, counts, revenue)
- Results that can be expressed as single number
- Moments where scale/magnitude matters

---

### Type 2: Quote

**Visual Design**:
```
┌──────────────────────────────────────┐
│  "                                   │  ← Opening quote mark
│                                      │
│   We needed to prove that design    │  ← 20px italic
│   could move metrics, not just      │
│   make things look better.          │
│                                      │
│   — On design validation             │  ← 14px, muted
│                                      │
│                                  "   │  ← Closing quote mark
└──────────────────────────────────────┘
```

**Styling**:
- Background: `bg-muted/50` or `border-l-4 border-accent`
- Quote text: `text-xl italic text-foreground`
- Attribution: `text-sm text-muted-foreground`
- Quote marks: `text-6xl text-accent/30` (decorative)
- Padding: `py-8 px-10`
- Max width: `max-w-2xl`

**When to use**:
- Human perspective or insight
- Memorable sound bite
- Stakeholder/user validation
- Team learnings or philosophy

---

### Type 3: Free Text

**Visual Design**:
```
┌──────────────────────────────────────┐
│                                      │
│  Why localization mattered           │  ← Optional heading
│  ────                                │  ← Subtle accent line
│                                      │
│  Each state has different driver     │  ← 16px regular text
│  licensing requirements. By creating │
│  state-specific content, we reduced  │
│  drop-off during the application     │
│  process and positioned Lyft for     │
│  faster expansion into new markets.  │
│                                      │
└──────────────────────────────────────┘
```

**Styling**:
- Background: `bg-muted/30` or `border-l-2 border-border`
- Heading: `text-sm font-semibold uppercase tracking-wide text-accent`
- Text: `text-base text-foreground`
- Padding: `py-6 px-6`
- Max width: `max-w-3xl`

**When to use**:
- Technical context or methodology
- "Why this approach" explanations
- Process insights that don't fit main narrative
- Background information readers might need

---

## Part 3: Design Recommendations

### Recommendation: Vertical Stacking Only

**Why vertical-only?**
1. **Mobile-first**: Side-by-side doesn't work on mobile
2. **Readability**: Preserves reading flow
3. **Simplicity**: Easier to implement and maintain
4. **Accessibility**: Better screen reader experience

**Implementation**:
```tsx
// Stat blocks always full width
<div className="max-w-3xl mx-auto space-y-16">
  {/* Article paragraphs */}
  <p>...</p>

  {/* Stat block (full width of text column) */}
  <StatBlockNumber number="8%" label="Conversion improvement" />

  {/* More paragraphs */}
  <p>...</p>
</div>
```

---

### Recommendation: Visual Hierarchy

**Page Structure**:
```
Hero Section (existing)
  ↓
[Spacing: 80px]
  ↓
Article Content (max-w-3xl, centered)
  ├─ Paragraph
  ├─ Paragraph
  ├─ [Stat Block 1] ← max-w-md, left-aligned
  ├─ Paragraph
  ├─ Image (full width of text column)
  ├─ Paragraph
  ├─ [Stat Block 2] ← max-w-2xl, centered
  ├─ Paragraph
  ├─ [Stat Block 3] ← max-w-3xl, full width
  ├─ Paragraph
  ↓
[Spacing: 80px]
  ↓
Technologies Section (if exists)
  ↓
Call to Action
```

**Spacing**:
- Between paragraphs: `space-y-6` (24px)
- Before/after stat blocks: `my-12` (48px)
- Before/after images: `my-16` (64px)

---

## Part 4: Component Architecture

### Frontend Components

**File Structure**:
```
/src/components/case-study-flowing/
├── index.ts                          # Barrel exports
├── FlowingArticle.tsx                # Main wrapper
├── ArticleContent.tsx                # Portable Text renderer
├── StatBlockNumber.tsx               # Big number block
├── StatBlockQuote.tsx                # Quote block
├── StatBlockText.tsx                 # Free text block
├── ArticleImage.tsx                  # Image with caption
├── ArticleVideo.tsx                  # Video embed
└── ArticleCode.tsx                   # Code block
```

---

### FlowingArticle.tsx

```typescript
import { PortableText } from '@portabletext/react'
import { ArticleComponents } from './ArticleContent'

interface FlowingArticleProps {
  content: any[] // Portable Text array
}

export function FlowingArticle({ content }: FlowingArticleProps) {
  return (
    <article className="max-w-3xl mx-auto px-6 py-16">
      <PortableText
        value={content}
        components={ArticleComponents}
      />
    </article>
  )
}
```

---

### ArticleContent.tsx

```typescript
import { PortableTextComponents } from '@portabletext/react'
import { StatBlockNumber, StatBlockQuote, StatBlockText } from './index'
import { ArticleImage, ArticleVideo, ArticleCode } from './index'

export const ArticleComponents: PortableTextComponents = {
  // Block styles
  block: {
    normal: ({ children }) => (
      <p className="text-lg leading-relaxed text-foreground mb-6">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="text-4xl font-light text-foreground mt-16 mb-8">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-light text-foreground mt-12 mb-6">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-xl font-medium text-foreground mt-10 mb-4">
        {children}
      </h4>
    ),
    h5: ({ children }) => (
      <h5 className="text-lg font-medium text-foreground mt-8 mb-3">
        {children}
      </h5>
    ),
    h6: ({ children }) => (
      <h6 className="text-base font-semibold uppercase tracking-wide text-muted-foreground mt-6 mb-2">
        {children}
      </h6>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-accent pl-6 py-4 my-8 italic text-xl text-muted-foreground">
        {children}
      </blockquote>
    ),
  },

  // Marks (inline styles)
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="italic">{children}</em>
    ),
    underline: ({ children }) => (
      <span className="underline">{children}</span>
    ),
    code: ({ children }) => (
      <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    ),
    link: ({ value, children }) => {
      const target = value?.newTab ? '_blank' : undefined
      const rel = value?.newTab ? 'noopener noreferrer' : undefined
      return (
        <a
          href={value?.href}
          target={target}
          rel={rel}
          className="text-accent hover:text-accent-light underline transition-colors"
        >
          {children}
        </a>
      )
    },
  },

  // Custom types
  types: {
    image: ({ value }) => <ArticleImage value={value} />,
    videoEmbed: ({ value }) => <ArticleVideo value={value} />,
    codeBlock: ({ value }) => <ArticleCode value={value} />,
    statBlockNumber: ({ value }) => <StatBlockNumber {...value} />,
    statBlockQuote: ({ value }) => <StatBlockQuote {...value} />,
    statBlockText: ({ value }) => <StatBlockText {...value} />,
  },
}
```

---

### StatBlockNumber.tsx

```typescript
interface StatBlockNumberProps {
  number: string
  label: string
}

export function StatBlockNumber({ number, label }: StatBlockNumberProps) {
  return (
    <div className="my-12 max-w-md">
      <div className="border-l-4 border-accent pl-6 py-8 bg-accent/5 dark:bg-accent/10 rounded-r">
        <div className="text-7xl font-bold text-accent leading-none mb-3">
          {number}
        </div>
        <div className="text-base text-muted-foreground">
          {label}
        </div>
      </div>
    </div>
  )
}
```

---

### StatBlockQuote.tsx

```typescript
interface StatBlockQuoteProps {
  quote: string
  attribution?: string
}

export function StatBlockQuote({ quote, attribution }: StatBlockQuoteProps) {
  return (
    <div className="my-12 max-w-2xl mx-auto">
      <div className="relative py-10 px-12 bg-muted/50 dark:bg-muted/30 rounded-lg">
        {/* Opening quote mark */}
        <div className="absolute top-4 left-4 text-6xl text-accent/30 leading-none">
          "
        </div>

        {/* Quote text */}
        <p className="text-xl italic text-foreground leading-relaxed mb-4">
          {quote}
        </p>

        {/* Attribution */}
        {attribution && (
          <p className="text-sm text-muted-foreground">
            {attribution}
          </p>
        )}

        {/* Closing quote mark */}
        <div className="absolute bottom-4 right-6 text-6xl text-accent/30 leading-none">
          "
        </div>
      </div>
    </div>
  )
}
```

---

### StatBlockText.tsx

```typescript
interface StatBlockTextProps {
  heading?: string
  text: string
}

export function StatBlockText({ heading, text }: StatBlockTextProps) {
  return (
    <div className="my-12 max-w-3xl">
      <div className="border-l-2 border-border pl-6 py-6 bg-muted/30 dark:bg-muted/20 rounded-r">
        {heading && (
          <>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-accent mb-2">
              {heading}
            </h4>
            <div className="w-8 h-0.5 bg-accent/50 mb-4" />
          </>
        )}
        <p className="text-base text-foreground leading-relaxed">
          {text}
        </p>
      </div>
    </div>
  )
}
```

---

## Part 5: Sanity Studio Customization

### Inline Stat Block Insertion

Sanity's default block editor already supports inline insertion. To make it user-friendly:

**1. Custom Icons for Stat Blocks**

Create `/sanity/schemas/icons/statBlock.tsx`:
```tsx
import { TrendingUp, MessageSquareQuote, FileText } from 'lucide-react'

export const StatBlockNumberIcon = TrendingUp
export const StatBlockQuoteIcon = MessageSquareQuote
export const StatBlockTextIcon = FileText
```

Update schema to use icons:
```typescript
{
  type: 'object',
  name: 'statBlockNumber',
  title: 'Stat Block: Big Number',
  icon: StatBlockNumberIcon, // ← Add icon
  ...
}
```

**2. Preview in Studio**

Already included in schema via `preview` property, but enhance with better formatting:

```typescript
preview: {
  select: {
    number: 'number',
    label: 'label'
  },
  prepare({ number, label }) {
    return {
      title: number,
      subtitle: label,
      media: StatBlockNumberIcon // Show icon in preview
    }
  }
}
```

**3. Helpful Descriptions**

Add guidance directly in studio:
```typescript
description: '📊 Use for quantitative impact. Max 5 per article. Place at key moments.'
```

---

## Part 6: Page Template Updates

### Update case-studies/[slug]/page.tsx

**Current**:
```tsx
<ContentSlide key={slide._key} ... />
```

**New**:
```tsx
import { FlowingArticle } from '@/components/case-study-flowing'

...

{/* Flowing Article (replaces ContentSlide loop) */}
{project.article && (
  <FlowingArticle content={project.article} />
)}

{/* Keep backwards compatibility for old format */}
{!project.article && project.slides && (
  <>
    {project.slides.map((slide) => (
      <ContentSlide key={slide._key} {...slide} />
    ))}
  </>
)}
```

---

### Update Query

```groq
*[_type == "project" && slug.current == $slug][0] {
  title,
  slug,
  category,
  heroSection { ... },
  overview { ... },
  metrics[] { ... },

  // NEW: Flowing article
  article,

  // DEPRECATED: Keep for backwards compatibility
  slides[] { ... },

  technologies,
  callToAction { ... },
  featuredImage { ... },
  seo { ... }
}
```

---

## Part 7: Migration Script

### scripts/migrate-slides-to-article.ts

```typescript
#!/usr/bin/env tsx
/**
 * Migration Script: Slides → Flowing Article
 *
 * Converts existing slide-based case studies to flowing article format.
 * Strategy: Extract text content from slides, preserve structure.
 */

import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

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

async function convertSlidesToArticle(slides: any[]): Promise<any[]> {
  const article = []

  for (const slide of slides) {
    // Add section heading as H2
    if (slide.heading) {
      article.push({
        _type: 'block',
        _key: `heading-${slide._key}`,
        style: 'h2',
        children: [{
          _type: 'span',
          text: slide.heading
        }]
      })
    }

    // Add existing content blocks
    if (slide.content && slide.content.length > 0) {
      article.push(...slide.content.map((block: any) => ({
        ...block,
        _key: `content-${block._key}`
      })))
    }

    // Convert quote box to stat block
    if (slide.quoteBox?.quote) {
      article.push({
        _type: 'statBlockQuote',
        _key: `quote-${slide._key}`,
        quote: slide.quoteBox.quote,
        attribution: slide.quoteBox.attribution
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
    console.log('⚠️  Project already has article content, skipping')
    return true
  }

  if (!project.slides || project.slides.length === 0) {
    console.log('⚠️  Project has no slides to migrate')
    return true
  }

  console.log(`   Converting ${project.slides.length} slides to article format...`)

  const article = await convertSlidesToArticle(project.slides)

  try {
    await client
      .patch(project._id)
      .set({ article })
      .commit()

    console.log(`✅ Migrated ${project.title}`)
    console.log(`   - Created article with ${article.length} blocks`)
    return true
  } catch (error) {
    console.error(`❌ Error migrating ${project.title}:`, error)
    return false
  }
}

async function main() {
  console.log('═══════════════════════════════════════════════')
  console.log('Case Study Migration: Slides → Flowing Article')
  console.log('═══════════════════════════════════════════════')

  // Get all case studies
  const projects = await client.fetch<string[]>(`
    *[_type == "project" && category == "case-study"]._id
  `)

  console.log(`\nFound ${projects.length} case studies to migrate\n`)

  let successCount = 0
  for (const projectId of projects) {
    const success = await migrateProject(projectId)
    if (success) successCount++
  }

  console.log('\n═══════════════════════════════════════════════')
  console.log(`Migration Complete: ${successCount}/${projects.length} successful`)
  console.log('═══════════════════════════════════════════════\n')

  if (successCount === projects.length) {
    console.log('🎉 All migrations successful!\n')
    process.exit(0)
  } else {
    console.log('⚠️  Some migrations failed. Review errors above.\n')
    process.exit(1)
  }
}

main()
```

---

## Part 8: Implementation Checklist

### Phase 1: Schema & Studio (2-3 hours)
- [ ] Add `article` field to project schema
- [ ] Add stat block types (statBlockNumber, statBlockQuote, statBlockText)
- [ ] Add icons for stat blocks
- [ ] Hide `slides` field (mark as deprecated)
- [ ] Test in Sanity Studio (create test article)
- [ ] Verify validation (max 5 stat blocks)

### Phase 2: Components (3-4 hours)
- [ ] Create `/src/components/case-study-flowing/` directory
- [ ] Build FlowingArticle.tsx wrapper
- [ ] Build ArticleContent.tsx (Portable Text renderer)
- [ ] Build StatBlockNumber.tsx
- [ ] Build StatBlockQuote.tsx
- [ ] Build StatBlockText.tsx
- [ ] Build ArticleImage.tsx (with captions)
- [ ] Build ArticleVideo.tsx (embed support)
- [ ] Build ArticleCode.tsx (syntax highlighting)
- [ ] Create barrel export (index.ts)

### Phase 3: Page Integration (1 hour)
- [ ] Update case-studies/[slug]/page.tsx
- [ ] Add article query
- [ ] Add FlowingArticle component
- [ ] Keep backwards compatibility for slides
- [ ] Test with both formats
- [ ] Verify build passes

### Phase 4: Migration (1-2 hours)
- [ ] Create migration script
- [ ] Test on single project first
- [ ] Run full migration
- [ ] Verify all projects have article content
- [ ] Spot-check formatting and structure

### Phase 5: Content Rewriting (Separate Track)
- [ ] Complete questionnaires (see content plan)
- [ ] Rewrite articles (shorter, more focused)
- [ ] Add stat blocks strategically
- [ ] Add supporting media (images, videos)
- [ ] Review and publish

### Phase 6: Testing & Polish (1 hour)
- [ ] Visual testing on mobile/tablet/desktop
- [ ] Verify dark mode styling
- [ ] Test all stat block types
- [ ] Verify links work (internal/external, new tab)
- [ ] Test video embeds
- [ ] Test code blocks (syntax highlighting)
- [ ] Check accessibility (screen readers, keyboard nav)
- [ ] Performance check (page load, CLS)

---

## Part 9: Rollback Plan

If issues arise, we can roll back safely:

### Quick Rollback (Page Level Only)
```tsx
// In case-studies/[slug]/page.tsx
// Comment out new article rendering
{/* <FlowingArticle content={project.article} /> */}

// Uncomment old slide rendering
{project.slides?.map((slide) => (
  <ContentSlide key={slide._key} {...slide} />
))}
```

### Full Rollback (Schema Level)
1. Unhide `slides` field in schema
2. Hide `article` field in schema
3. Redeploy studio
4. Keep article data (don't delete) for future retry

---

## Part 10: Success Metrics

### Technical Metrics
- [ ] Build passing
- [ ] No TypeScript errors
- [ ] No console errors/warnings
- [ ] Lighthouse performance score maintained
- [ ] Accessibility score 90+

### UX Metrics
- [ ] Reading time: 2-4 minutes average
- [ ] Scroll depth: 60%+ reach end
- [ ] Bounce rate: <40%
- [ ] Mobile usability score: 95+

---

## Appendix: Design Tokens

### Typography Scale
- H2: `text-4xl font-light` (36px)
- H3: `text-2xl font-light` (24px)
- H4: `text-xl font-medium` (20px)
- H5: `text-lg font-medium` (18px)
- H6: `text-base font-semibold uppercase tracking-wide` (16px)
- Body: `text-lg leading-relaxed` (18px)

### Spacing Scale
- Paragraph spacing: `mb-6` (24px)
- Heading margin top: `mt-12` to `mt-16` (48px-64px)
- Stat block margin: `my-12` (48px)
- Image margin: `my-16` (64px)

### Color Tokens (from globals.css)
- Accent: `text-accent`, `bg-accent`, `border-accent`
- Foreground: `text-foreground`
- Muted: `text-muted-foreground`, `bg-muted`
- Border: `border-border`

---

## Next Steps

1. **Review this plan** and approve technical approach
2. **Choose stat block designs** (approve mockups)
3. **Prioritize implementation** (which phase first?)
4. **Coordinate with content team** (rewriting can happen in parallel)
5. **Set timeline** for development work

---

**Document Owner**: Claude
**Last Updated**: November 5, 2025
**Status**: Draft for Review
