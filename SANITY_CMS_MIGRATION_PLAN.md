# Sanity CMS Migration Plan

## Executive Summary

This document provides a comprehensive roadmap for migrating all hardcoded content (AI projects and case studies) from the Michael Evans portfolio website to Sanity CMS. The migration will centralize content management, enable real-time updates, and provide a scalable foundation for future content growth.

**Current State:**
- 4 AI projects with rich, complex data structures (hardcoded in `/src/data/aiProjects.ts`)
- 4 case studies with simpler data structures (hardcoded in individual page components)
- Sanity CMS configured but NOT actively used
- Basic project schema exists but lacks AI-specific fields

**Target State:**
- All content managed through Sanity Studio
- Single source of truth for all portfolio content
- Dynamic data fetching replacing hardcoded content
- Extensible schema supporting future content types

**Timeline:** 2-3 weeks
**Effort Level:** Medium complexity
**Risk Level:** Low (existing content remains as fallback during migration)

---

## 1. Gap Analysis

### 1.1 Current Sanity Setup

**What Exists:**
- Sanity client configured (`/src/lib/sanity/client.ts`)
- Basic project schema (`/sanity/schemas/project.ts`) with:
  - Basic fields: title, slug, category, heroImage, summary, description
  - Simple arrays: metrics, achievements, technologies
  - Portable text: content field
  - URLs: liveUrl, githubUrl
  - Metadata: publishedAt, featured, order

**Project IDs:** There's a discrepancy - CLAUDE.md mentions Project ID `5n331bys` but `/sanity/sanity.config.ts` shows `vc89ievx`. This needs verification.

### 1.2 Missing Capabilities for AI Projects

The current schema **lacks** support for:

1. **AI-Specific Fields:**
   - `subtitle` (used prominently in AI projects)
   - `status` enum ('Live', 'In Progress', 'Coming Soon')
   - `links` object with optional live/github (current schema has separate fields)
   - `category` values don't include AI project categories

2. **Complex Nested Objects:**
   - `overview` object (problem, solution, role, timeline)
   - `aiComponents` array of objects (name, description, technology)
   - `developmentProcess` array of objects with nested `outcomes` array
   - `learnings` array of strings
   - `images` array with caption support

3. **Data Modeling Challenges:**
   - No support for nested arrays (developmentProcess.outcomes)
   - No image caption field in schema
   - No structured overview section
   - Tech stack is simple string array (good) but needs validation

### 1.3 Case Studies Analysis

**Current Implementation:**
- 4 case study pages: VirginAmerica, CasaBonita, BeforeLauncher, Peddle
- Each has hardcoded JSX with:
  - Title and subtitle
  - Project overview text
  - 3 key metrics (with labels and values)
  - Key achievements bullet list
  - Simple, consistent structure

**Compatibility with Current Schema:**
- ✅ Basic fields match well (title, summary)
- ✅ Metrics already supported
- ✅ Achievements already supported
- ❌ Missing subtitle field
- ❌ No distinction from AI projects in UI

### 1.4 Should Everything Migrate Together?

**Recommendation: Phased Migration**

**Phase 1 (Week 1):** AI Projects
- More complex schema requirements
- Establish patterns for nested data
- Tests Sanity's limits with complex structures
- Lower risk (fewer pages, newer content)

**Phase 2 (Week 2):** Case Studies
- Leverage learnings from AI migration
- Simpler data structures = faster migration
- Can reuse schema patterns

**Reasoning:**
- AI projects are newer, more experimental
- Case studies are established, client-facing content
- Phased approach allows testing and iteration
- Can validate Sanity workflow before full migration

---

## 2. Schema Design

### 2.1 Enhanced Project Schema

```typescript
// sanity/schemas/project.ts
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'project',
  title: 'Projects & Case Studies',
  type: 'document',
  groups: [
    { name: 'basic', title: 'Basic Info', default: true },
    { name: 'overview', title: 'Overview' },
    { name: 'content', title: 'Content' },
    { name: 'ai', title: 'AI Components' },
    { name: 'process', title: 'Development Process' },
    { name: 'metrics', title: 'Metrics & Achievements' },
    { name: 'media', title: 'Media' },
    { name: 'meta', title: 'Metadata' },
  ],
  fields: [
    // BASIC INFO
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'basic',
      validation: (Rule) => Rule.required().max(100),
      description: 'Project title (e.g., "Post Pal")',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      group: 'basic',
      validation: (Rule) => Rule.max(150),
      description: 'One-line description (e.g., "AI-Powered Social Media Content Assistant")',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'basic',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: input => input
          .toLowerCase()
          .replace(/\s+/g, '-')
          .slice(0, 96)
      },
      validation: (Rule) => Rule.required(),
      description: 'URL-friendly version of title',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'basic',
      options: {
        list: [
          { title: 'Medical Mobile & Web', value: 'medical-mobile-web' },
          { title: 'Lead Management & Product Marketing', value: 'lead-management' },
          { title: 'Research Automation', value: 'research-automation' },
          { title: 'Case Study', value: 'case-study' },
          { title: 'Open Source', value: 'open-source' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'projectType',
      title: 'Project Type',
      type: 'string',
      group: 'basic',
      options: {
        list: [
          { title: 'AI Project', value: 'ai-project' },
          { title: 'Case Study', value: 'case-study' },
          { title: 'Research', value: 'research' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
      description: 'Determines which route group this project belongs to',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'basic',
      options: {
        list: [
          { title: 'Live', value: 'Live' },
          { title: 'In Progress', value: 'In Progress' },
          { title: 'Coming Soon', value: 'Coming Soon' },
          { title: 'Completed', value: 'Completed' },
        ],
        layout: 'radio',
      },
      initialValue: 'Live',
      description: 'Current status of the project',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      group: 'basic',
      rows: 4,
      validation: (Rule) => Rule.max(500),
      description: '2-3 sentence overview for cards and meta descriptions',
    }),

    // OVERVIEW SECTION (structured for AI projects)
    defineField({
      name: 'overview',
      title: 'Overview',
      type: 'object',
      group: 'overview',
      fields: [
        defineField({
          name: 'problem',
          title: 'Problem',
          type: 'text',
          rows: 3,
          description: 'What problem does this project solve?',
        }),
        defineField({
          name: 'solution',
          title: 'Solution',
          type: 'text',
          rows: 3,
          description: 'How does this project solve it?',
        }),
        defineField({
          name: 'role',
          title: 'Role',
          type: 'string',
          description: 'Your role in the project',
        }),
        defineField({
          name: 'timeline',
          title: 'Timeline',
          type: 'string',
          description: 'Project duration (e.g., "6 months")',
        }),
      ],
      description: 'Structured overview section (primarily for AI projects)',
    }),

    // LINKS
    defineField({
      name: 'links',
      title: 'Links',
      type: 'object',
      group: 'basic',
      fields: [
        { name: 'live', title: 'Live URL', type: 'url' },
        { name: 'github', title: 'GitHub URL', type: 'url' },
      ],
    }),

    // METRICS
    defineField({
      name: 'metrics',
      title: 'Key Metrics',
      type: 'array',
      group: 'metrics',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'label',
              type: 'string',
              title: 'Label',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'value',
              type: 'string',
              title: 'Value',
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'value',
            },
          },
        },
      ],
      validation: (Rule) => Rule.max(6),
      description: 'Key metrics to display (max 6)',
    }),

    // TECH STACK
    defineField({
      name: 'techStack',
      title: 'Tech Stack',
      type: 'array',
      group: 'content',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      description: 'Technologies used (e.g., "React", "TypeScript", "OpenAI GPT-4")',
    }),

    // AI COMPONENTS (for AI projects only)
    defineField({
      name: 'aiComponents',
      title: 'AI Components',
      type: 'array',
      group: 'ai',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Component Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
            },
            {
              name: 'technology',
              title: 'Technology',
              type: 'string',
              description: 'AI technology/model used',
            },
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'technology',
            },
          },
        },
      ],
      description: 'AI/ML components in the project',
      hidden: ({ document }) => document?.projectType !== 'ai-project',
    }),

    // DEVELOPMENT PROCESS
    defineField({
      name: 'developmentProcess',
      title: 'Development Process',
      type: 'array',
      group: 'process',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'phase',
              title: 'Phase Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
            },
            {
              name: 'outcomes',
              title: 'Key Outcomes',
              type: 'array',
              of: [{ type: 'string' }],
              description: 'Bullet points of outcomes achieved',
            },
          ],
          preview: {
            select: {
              title: 'phase',
              subtitle: 'description',
            },
          },
        },
      ],
      description: 'Development phases with outcomes',
    }),

    // LEARNINGS
    defineField({
      name: 'learnings',
      title: 'Key Learnings',
      type: 'array',
      group: 'metrics',
      of: [{ type: 'text', rows: 2 }],
      description: 'Lessons learned during the project',
    }),

    // ACHIEVEMENTS
    defineField({
      name: 'achievements',
      title: 'Key Achievements',
      type: 'array',
      group: 'metrics',
      of: [{ type: 'string' }],
      description: 'Major achievements and results',
    }),

    // HERO IMAGE
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      group: 'media',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
          validation: (Rule) => Rule.required(),
        },
      ],
    }),

    // ADDITIONAL IMAGES
    defineField({
      name: 'images',
      title: 'Additional Images',
      type: 'array',
      group: 'media',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'alt',
              type: 'string',
              title: 'Alt Text',
              validation: (Rule) => Rule.required(),
            },
          ],
        },
      ],
      description: 'Gallery images with captions',
    }),

    // RICH CONTENT (for case studies or detailed content)
    defineField({
      name: 'content',
      title: 'Rich Content',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Code', value: 'code' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  { name: 'href', type: 'url', title: 'URL' },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', type: 'string', title: 'Alt Text' },
            { name: 'caption', type: 'string', title: 'Caption' },
          ],
        },
        {
          type: 'code',
          options: {
            language: 'javascript',
            languageAlternatives: [
              { title: 'JavaScript', value: 'javascript' },
              { title: 'TypeScript', value: 'typescript' },
              { title: 'Python', value: 'python' },
              { title: 'HTML', value: 'html' },
              { title: 'CSS', value: 'css' },
              { title: 'JSON', value: 'json' },
              { title: 'Bash', value: 'bash' },
            ],
          },
        },
      ],
      description: 'Long-form content with rich text, images, and code blocks',
    }),

    // METADATA
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      group: 'meta',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured Project',
      type: 'boolean',
      group: 'meta',
      initialValue: false,
      description: 'Show on homepage or featured sections',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      group: 'meta',
      validation: (Rule) => Rule.integer().positive(),
      description: 'Lower numbers appear first',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      media: 'heroImage',
      status: 'status',
      projectType: 'projectType',
    },
    prepare(selection) {
      const { title, subtitle, media, status, projectType } = selection
      return {
        title,
        subtitle: `${projectType} | ${status} | ${subtitle}`,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Published Date (Newest)',
      name: 'publishedDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
})
```

### 2.2 Image Handling Strategy

**Current State:** AI projects use URL strings (e.g., Unsplash URLs)
**Target State:** Sanity image assets with proper optimization

**Migration Options:**

**Option A: Keep External URLs (Fastest)**
- Store URLs as strings in Sanity
- No image migration needed
- Loses Sanity CDN benefits
- ⚠️ External dependencies

**Option B: Import to Sanity (Recommended)**
- Download images and upload to Sanity
- Use Sanity's image pipeline
- Better performance with CDN
- Full control over assets
- Migration script needed

**Recommendation:** Option B for long-term benefits

**Image Migration Script:**
```javascript
// scripts/migrateImages.js
import { createClient } from '@sanity/client'
import fetch from 'node-fetch'

const client = createClient({
  projectId: 'your-project-id',
  dataset: 'production',
  token: 'your-token-with-write-access',
  useCdn: false,
})

async function uploadImage(imageUrl, filename) {
  const response = await fetch(imageUrl)
  const buffer = await response.buffer()

  return client.assets.upload('image', buffer, {
    filename,
  })
}

// Usage:
// const asset = await uploadImage(
//   'https://images.unsplash.com/photo-123',
//   'post-pal-hero.jpg'
// )
```

### 2.3 Relationship Modeling

**Current:** No relationships between entities
**Future Considerations:**

1. **Tags/Categories System:**
   - Create separate `category` document type
   - Reference from projects
   - Enables category pages and filtering

2. **Author/Profile:**
   - Already exists (`profile` schema)
   - Could reference from projects
   - Enables multi-author portfolios

**Recommendation:** Keep simple for initial migration, add relationships in Phase 3

---

## 3. Migration Strategy

### 3.1 Overall Approach: Parallel Implementation with Feature Flags

**Key Principle:** Run dual systems (hardcoded + Sanity) during transition

**Implementation:**
```typescript
// src/config/features.ts
export const FEATURE_FLAGS = {
  USE_SANITY_AI_PROJECTS: import.meta.env.VITE_USE_SANITY_AI_PROJECTS === 'true',
  USE_SANITY_CASE_STUDIES: import.meta.env.VITE_USE_SANITY_CASE_STUDIES === 'true',
}

// In components:
import { FEATURE_FLAGS } from '@/config/features'
import { getHardcodedProjects } from '@/data/aiProjects'
import { getSanityProjects } from '@/lib/sanity/queries'

const projects = FEATURE_FLAGS.USE_SANITY_AI_PROJECTS
  ? await getSanityProjects()
  : getHardcodedProjects()
```

**Benefits:**
- Zero downtime migration
- Easy rollback if issues arise
- Test Sanity in production before full cutover
- Gradual migration (project by project if needed)

### 3.2 Phase 1: AI Projects Migration (Week 1)

**Why AI Projects First:**
- Most complex data structure (tests Sanity capabilities)
- Newer content (less risk)
- Establishes patterns for case studies

**Steps:**

1. **Schema Update** (2 hours)
   - Update `/sanity/schemas/project.ts` with enhanced schema
   - Deploy schema changes to Sanity
   - Test in Studio

2. **Data Transformation** (4 hours)
   - Create migration script to transform `/src/data/aiProjects.ts` to Sanity format
   - Handle nested objects and arrays
   - Generate proper slugs

3. **Image Migration** (3 hours)
   - Download all Unsplash images
   - Upload to Sanity with proper metadata
   - Update references in project data

4. **Content Import** (2 hours)
   - Use Sanity CLI or API to import projects
   - Verify in Studio
   - Check all nested data

5. **Frontend Data Layer** (6 hours)
   - Create TypeScript types matching Sanity schema
   - Write GROQ queries for AI projects
   - Create `useAIProjects` hook with feature flag
   - Implement fallback to hardcoded data

6. **Component Updates** (4 hours)
   - Update `/src/pages/ai-projects/*.tsx` to use Sanity data
   - Add loading states
   - Add error handling with fallback
   - Update BentoImageBehind to work with both data sources

7. **Testing** (3 hours)
   - Test all 4 AI project detail pages
   - Test image loading and optimization
   - Test nested data rendering
   - Verify metrics, tech stack, AI components display correctly

**Total Effort:** ~24 hours (3 working days)

### 3.3 Phase 2: Case Studies Migration (Week 2)

**Why Case Studies Second:**
- Simpler data structure
- Leverage learnings from AI migration
- More established content (requires careful handling)

**Steps:**

1. **Data Extraction** (3 hours)
   - Extract hardcoded data from VirginAmerica, CasaBonita, BeforeLauncher, Peddle pages
   - Create structured data files
   - Note: These use different structure than AI projects

2. **Content Import** (2 hours)
   - Import to Sanity using same schema (projectType: 'case-study')
   - Set appropriate categories
   - Add to Studio

3. **Component Consolidation** (5 hours)
   - Create generic `CaseStudyDetail` component
   - Replace individual page components
   - Support both Sanity and hardcoded data during transition

4. **Routing Updates** (2 hours)
   - Potentially consolidate routes if desired
   - Ensure URLs remain the same (SEO)
   - Update App.tsx

5. **Testing** (2 hours)
   - Test all 4 case study pages
   - Verify metrics display
   - Check achievements rendering

**Total Effort:** ~14 hours (2 working days)

### 3.4 Phase 3: Cutover and Cleanup (Week 2-3)

1. **Production Testing** (1-2 days)
   - Enable Sanity in production with feature flag
   - Monitor for errors
   - Compare Sanity vs hardcoded rendering
   - Gather feedback

2. **Full Cutover** (1 day)
   - Remove feature flags
   - Delete hardcoded data files
   - Update components to only use Sanity
   - Deploy

3. **Documentation** (1 day)
   - Update README with Sanity content management instructions
   - Create content editor guide
   - Document GROQ queries
   - Update CLAUDE.md

**Total Effort:** ~3-5 days

### 3.5 Rollback Plan

**If Issues Arise:**

1. **During Development:**
   - Keep hardcoded data intact
   - Feature flag toggles back to hardcoded

2. **In Production:**
   - Set `VITE_USE_SANITY_*` environment variables to `false`
   - Redeploy (instant rollback)
   - Debug Sanity issues in staging

3. **Data Loss Prevention:**
   - Export Sanity data regularly: `sanity dataset export production backup.tar.gz`
   - Keep hardcoded data files until 2 weeks post-migration
   - Version control all changes

---

## 4. Implementation Roadmap

### Week 1: AI Projects Migration

| Day | Task | Time | Status |
|-----|------|------|--------|
| Mon | Schema design & deployment | 2h | 🔲 Pending |
| Mon | Setup migration scripts | 3h | 🔲 Pending |
| Mon | Image download & upload | 3h | 🔲 Pending |
| Tue | Data transformation & import | 3h | 🔲 Pending |
| Tue | Create TypeScript types | 2h | 🔲 Pending |
| Tue | Write GROQ queries | 2h | 🔲 Pending |
| Wed | Create data hooks with feature flags | 2h | 🔲 Pending |
| Wed | Update AI project detail pages | 4h | 🔲 Pending |
| Thu | Testing & bug fixes | 3h | 🔲 Pending |
| Thu | Documentation updates | 2h | 🔲 Pending |
| Fri | Buffer for issues | 4h | 🔲 Pending |

### Week 2: Case Studies Migration

| Day | Task | Time | Status |
|-----|------|------|--------|
| Mon | Extract case study data | 3h | 🔲 Pending |
| Mon | Import to Sanity | 2h | 🔲 Pending |
| Mon | Create generic CaseStudy component | 3h | 🔲 Pending |
| Tue | Update all case study pages | 4h | 🔲 Pending |
| Tue | Update routing if needed | 2h | 🔲 Pending |
| Wed | Testing all case studies | 2h | 🔲 Pending |
| Wed | Production testing with feature flags | 4h | 🔲 Pending |
| Thu | Monitor and iterate | 4h | 🔲 Pending |
| Fri | Full cutover preparation | 3h | 🔲 Pending |

### Week 3: Cutover & Optimization

| Day | Task | Time | Status |
|-----|------|------|--------|
| Mon | Enable Sanity in production | 2h | 🔲 Pending |
| Mon | Monitor for 24 hours | - | 🔲 Pending |
| Tue | Remove feature flags & hardcoded data | 2h | 🔲 Pending |
| Tue | Component cleanup | 2h | 🔲 Pending |
| Wed | Update documentation | 3h | 🔲 Pending |
| Wed | Create content editor guide | 3h | 🔲 Pending |
| Thu | Performance optimization | 4h | 🔲 Pending |
| Fri | Final testing & polish | 3h | 🔲 Pending |

**Total Estimated Time:** 75 hours (~2 weeks with 8-hour days, 3 weeks with 5-hour days)

### Dependencies

```
Schema Design
    ↓
Image Migration ←─── Data Transformation
    ↓                      ↓
Content Import ←──────────┘
    ↓
TypeScript Types & GROQ Queries
    ↓
Data Hooks (with feature flags)
    ↓
Component Updates (AI Projects) → Component Updates (Case Studies)
    ↓                                      ↓
Testing ←──────────────────────────────────┘
    ↓
Production Cutover
    ↓
Cleanup & Documentation
```

---

## 5. Studio Configuration

### 5.1 Studio Structure Improvements

**Current:** Basic Studio setup
**Enhancements Needed:**

```typescript
// sanity/sanity.config.ts
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

export default defineConfig({
  name: 'default',
  title: 'Michael Evans Portfolio',
  projectId: 'your-project-id',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // AI Projects
            S.listItem()
              .title('AI Projects')
              .child(
                S.documentTypeList('project')
                  .title('AI Projects')
                  .filter('_type == "project" && projectType == "ai-project"')
              ),
            // Case Studies
            S.listItem()
              .title('Case Studies')
              .child(
                S.documentTypeList('project')
                  .title('Case Studies')
                  .filter('_type == "project" && projectType == "case-study"')
              ),
            S.divider(),
            // Other content types
            S.documentTypeListItem('profile').title('Profile'),
            S.documentTypeListItem('capability').title('Capabilities'),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
```

### 5.2 Custom Input Components

**For Tech Stack:** Tag input with autocomplete

```typescript
// sanity/components/TechStackInput.tsx
import { Stack, Autocomplete } from '@sanity/ui'
import { useState } from 'react'

const commonTechnologies = [
  'React', 'TypeScript', 'Node.js', 'Next.js', 'OpenAI GPT-4',
  'Anthropic Claude', 'Python', 'TensorFlow', 'PostgreSQL',
  'AWS Lambda', 'Vercel', 'Tailwind CSS', 'Sanity CMS',
]

export function TechStackInput(props) {
  const [suggestions, setSuggestions] = useState(commonTechnologies)

  // Custom autocomplete logic
  return (
    <Autocomplete
      options={suggestions}
      {...props}
    />
  )
}
```

**For Status:** Visual status badges

```typescript
// sanity/components/StatusInput.tsx
export function StatusInput(props) {
  const statusColors = {
    'Live': 'green',
    'In Progress': 'blue',
    'Coming Soon': 'orange',
    'Completed': 'gray',
  }

  return (
    <RadioGroup {...props}>
      {/* Custom styled radio buttons with colors */}
    </RadioGroup>
  )
}
```

### 5.3 Preview Functionality

**Live Preview Integration:**

```typescript
// src/components/PreviewProvider.tsx
import { definePreview } from 'next-sanity/preview'

const usePreview = definePreview({
  projectId: 'your-project-id',
  dataset: 'production',
})

export function PreviewProvider({ children, token }) {
  const { data, loading } = usePreview(token, query)

  return (
    <PreviewContext.Provider value={{ data, loading }}>
      {children}
    </PreviewContext.Provider>
  )
}
```

**Draft Mode:**
- Enable draft.js support
- Add "Preview" button in Studio
- Show unpublished changes in dev mode

---

## 6. Code Changes Required

### 6.1 Data Fetching Architecture

**Pattern: Custom Hooks with Feature Flags**

```typescript
// src/hooks/useProjects.ts
import { useQuery } from '@tanstack/react-query'
import { client } from '@/lib/sanity/client'
import { projectsQuery } from '@/lib/sanity/queries'
import { FEATURE_FLAGS } from '@/config/features'
import { allAIProjects } from '@/data/aiProjects' // fallback
import type { AIProjectData } from '@/types/project'

export function useProjects(projectType: 'ai-project' | 'case-study') {
  return useQuery({
    queryKey: ['projects', projectType],
    queryFn: async () => {
      if (FEATURE_FLAGS[`USE_SANITY_${projectType.toUpperCase()}`]) {
        return client.fetch(projectsQuery(projectType))
      }
      // Fallback to hardcoded data
      return projectType === 'ai-project'
        ? allAIProjects
        : getHardcodedCaseStudies()
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 30, // 30 minutes
  })
}

export function useProject(slug: string, projectType: string) {
  return useQuery({
    queryKey: ['project', slug],
    queryFn: async () => {
      if (FEATURE_FLAGS[`USE_SANITY_${projectType.toUpperCase()}`]) {
        return client.fetch(projectQuery, { slug })
      }
      // Fallback
      return getProjectBySlug(slug)
    },
  })
}
```

### 6.2 GROQ Queries

```typescript
// src/lib/sanity/queries.ts
import { groq } from 'next-sanity'

export const projectsQuery = (projectType: string) => groq`
  *[_type == "project" && projectType == $projectType] | order(order asc, publishedAt desc) {
    _id,
    title,
    subtitle,
    slug,
    category,
    status,
    description,
    "heroImage": heroImage.asset->url,
    "heroImageAlt": heroImage.alt,
    links,
    metrics,
    techStack,
    featured,
    publishedAt
  }
`

export const projectQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    subtitle,
    slug,
    category,
    projectType,
    status,
    description,
    overview,
    links,
    metrics,
    techStack,
    aiComponents,
    developmentProcess,
    learnings,
    achievements,
    "heroImage": heroImage.asset->url,
    "heroImageAlt": heroImage.alt,
    images[] {
      "url": asset->url,
      caption,
      alt
    },
    content[] {
      ...,
      _type == "image" => {
        "url": asset->url,
        alt,
        caption,
        "dimensions": asset->metadata.dimensions
      }
    },
    publishedAt,
    featured
  }
`

export const featuredProjectsQuery = groq`
  *[_type == "project" && featured == true] | order(order asc)[0...3] {
    _id,
    title,
    subtitle,
    slug,
    category,
    status,
    description,
    "heroImage": heroImage.asset->url,
    links
  }
`
```

### 6.3 TypeScript Types

```typescript
// src/lib/sanity/types.ts
export interface SanityProject {
  _id: string
  title: string
  subtitle?: string
  slug: { current: string }
  category: string
  projectType: 'ai-project' | 'case-study' | 'research'
  status: 'Live' | 'In Progress' | 'Coming Soon' | 'Completed'
  description: string
  overview?: {
    problem?: string
    solution?: string
    role?: string
    timeline?: string
  }
  links?: {
    live?: string
    github?: string
  }
  metrics?: Array<{
    label: string
    value: string
  }>
  techStack?: string[]
  aiComponents?: Array<{
    name: string
    description: string
    technology: string
  }>
  developmentProcess?: Array<{
    phase: string
    description: string
    outcomes: string[]
  }>
  learnings?: string[]
  achievements?: string[]
  heroImage?: string
  heroImageAlt?: string
  images?: Array<{
    url: string
    caption: string
    alt: string
  }>
  content?: any[] // Portable Text
  publishedAt?: string
  featured?: boolean
}

// Adapter function to convert Sanity data to existing AIProjectData format
export function sanityToAIProject(sanityProject: SanityProject): AIProjectData {
  return {
    slug: sanityProject.slug.current,
    title: sanityProject.title,
    subtitle: sanityProject.subtitle || '',
    description: sanityProject.description,
    heroImage: sanityProject.heroImage || '',
    category: sanityProject.category,
    status: sanityProject.status as 'Live' | 'In Progress' | 'Coming Soon',
    links: sanityProject.links || {},
    overview: sanityProject.overview || {
      problem: '',
      solution: '',
      role: '',
      timeline: '',
    },
    metrics: sanityProject.metrics || [],
    techStack: sanityProject.techStack || [],
    aiComponents: sanityProject.aiComponents || [],
    developmentProcess: sanityProject.developmentProcess || [],
    learnings: sanityProject.learnings || [],
    achievements: sanityProject.achievements || [],
    images: sanityProject.images || [],
  }
}
```

### 6.4 Component Updates

**Example: AI Project Detail Page**

```typescript
// src/pages/ai-projects/PostPal.tsx (before)
import { postPalData } from '@/data/aiProjects'

const PostPal = () => {
  const project = postPalData
  // ... render project
}

// src/pages/ai-projects/PostPal.tsx (after)
import { useProject } from '@/hooks/useProjects'
import { sanityToAIProject } from '@/lib/sanity/types'

const PostPal = () => {
  const { data: sanityProject, isLoading, error } = useProject('post-pal', 'ai-project')

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />
  if (!sanityProject) return <NotFound />

  const project = sanityToAIProject(sanityProject)
  // ... existing render logic works unchanged!
}
```

**Generic AI Project Page:**

```typescript
// src/pages/ai-projects/AIProjectDetail.tsx
import { useParams } from 'react-router-dom'
import { useProject } from '@/hooks/useProjects'

const AIProjectDetail = () => {
  const { slug } = useParams()
  const { data: project, isLoading, error } = useProject(slug!, 'ai-project')

  // Universal render logic for all AI projects
  return (
    <div>
      <Hero image={project.heroImage} title={project.title} />
      <Overview {...project.overview} />
      <Metrics metrics={project.metrics} />
      <TechStack stack={project.techStack} />
      <AIComponents components={project.aiComponents} />
      <DevelopmentProcess process={project.developmentProcess} />
      <Learnings learnings={project.learnings} />
      <Achievements achievements={project.achievements} />
      <ImageGallery images={project.images} />
    </div>
  )
}
```

### 6.5 Error Handling & Fallbacks

```typescript
// src/hooks/useProjects.ts (enhanced)
export function useProject(slug: string, projectType: string) {
  return useQuery({
    queryKey: ['project', slug],
    queryFn: async () => {
      try {
        if (FEATURE_FLAGS[`USE_SANITY_${projectType.toUpperCase()}`]) {
          const sanityData = await client.fetch(projectQuery, { slug })
          if (!sanityData) {
            console.warn(`Project ${slug} not found in Sanity, falling back to hardcoded data`)
            return getHardcodedProject(slug)
          }
          return sanityData
        }
        return getHardcodedProject(slug)
      } catch (error) {
        console.error('Error fetching from Sanity:', error)
        // Graceful fallback
        return getHardcodedProject(slug)
      }
    },
    retry: 1,
    retryDelay: 1000,
  })
}
```

### 6.6 Build-time vs Runtime Considerations

**Current:** Vite with React (CSR - Client-Side Rendering)
**Implication:** All data fetched at runtime

**Options:**

1. **Keep Current Approach (Runtime):**
   - ✅ Simple, works with current architecture
   - ✅ Always fresh data
   - ❌ Slower initial page load
   - ❌ Not SEO-optimal

2. **Add Static Generation:**
   - Switch to Next.js with ISR (Incremental Static Regeneration)
   - Pre-render project pages at build time
   - ✅ Better performance and SEO
   - ❌ Major architecture change

**Recommendation:** Keep runtime fetching for initial migration, consider Next.js migration as separate Phase 4

**Optimization Strategy:**
```typescript
// src/App.tsx - Prefetch on mount
import { useEffect } from 'react'
import { queryClient } from '@/lib/queryClient'
import { projectsQuery } from '@/lib/sanity/queries'

function App() {
  useEffect(() => {
    // Prefetch projects data on app load
    queryClient.prefetchQuery({
      queryKey: ['projects', 'ai-project'],
      queryFn: () => client.fetch(projectsQuery('ai-project')),
    })
  }, [])

  return <Routes />
}
```

---

## 7. Next Immediate Steps

### Step 1: Verify Sanity Project ID (5 minutes)

**Action:**
```bash
cd /Users/michaelevans/michael-evans-port-main
cat .env.local | grep SANITY
```

**Verify:**
- Is Project ID `5n331bys` or `vc89ievx`?
- Update CLAUDE.md and configs to match

### Step 2: Update Schema (1 hour)

**Action:**
1. Backup existing schema: `cp sanity/schemas/project.ts sanity/schemas/project.backup.ts`
2. Replace with enhanced schema from Section 2.1
3. Test in Studio: `npm run sanity`
4. Create one test project manually

**Validation:**
- All field groups appear
- Nested objects work (overview, aiComponents, developmentProcess)
- Image upload works
- Arrays work correctly

### Step 3: Create Migration Script (2 hours)

**Action:**
Create `/scripts/migrateAIProjects.ts`:

```typescript
import { createClient } from '@sanity/client'
import { allAIProjects } from '../src/data/aiProjects'

const client = createClient({
  projectId: 'your-project-id',
  dataset: 'production',
  token: process.env.SANITY_WRITE_TOKEN, // Get from sanity.io
  useCdn: false,
})

async function migrateProjects() {
  for (const project of allAIProjects) {
    console.log(`Migrating ${project.title}...`)

    const sanityProject = {
      _type: 'project',
      title: project.title,
      subtitle: project.subtitle,
      slug: { _type: 'slug', current: project.slug },
      category: project.category,
      projectType: 'ai-project',
      status: project.status,
      description: project.description,
      overview: project.overview,
      links: project.links,
      metrics: project.metrics,
      techStack: project.techStack,
      aiComponents: project.aiComponents,
      developmentProcess: project.developmentProcess,
      learnings: project.learnings,
      achievements: project.achievements,
      publishedAt: new Date().toISOString(),
      featured: false,
    }

    // Note: Images handled separately
    await client.create(sanityProject)
    console.log(`✓ Migrated ${project.title}`)
  }
}

migrateProjects().catch(console.error)
```

**Run:**
```bash
SANITY_WRITE_TOKEN=your-token npx tsx scripts/migrateAIProjects.ts
```

### Step 4: Create Feature Flag Infrastructure (30 minutes)

**Action:**
Create `/src/config/features.ts`:

```typescript
export const FEATURE_FLAGS = {
  USE_SANITY_AI_PROJECTS: import.meta.env.VITE_USE_SANITY_AI_PROJECTS === 'true',
  USE_SANITY_CASE_STUDIES: import.meta.env.VITE_USE_SANITY_CASE_STUDIES === 'true',
} as const
```

Add to `.env.local`:
```env
VITE_USE_SANITY_AI_PROJECTS=false
VITE_USE_SANITY_CASE_STUDIES=false
```

### Step 5: Implement First Hook (1 hour)

**Action:**
Create `/src/hooks/useProjects.ts` (from Section 6.1)

**Test:**
```typescript
// In any component
import { useProjects } from '@/hooks/useProjects'

const { data, isLoading } = useProjects('ai-project')
console.log(data) // Should show hardcoded data
```

### Step 6: Update One Page (2 hours)

**Action:**
Choose simplest AI project (e.g., Department of Art)
Update `/src/pages/ai-projects/DepartmentOfArt.tsx` to use `useProject` hook

**Test:**
1. With flag OFF: Should show hardcoded data
2. With flag ON: Should show Sanity data (or fallback if not migrated)

### Step 7: Decision Point (30 minutes)

**Evaluate:**
- Does schema feel right?
- Is data fetching smooth?
- Are there any blockers?

**Go/No-Go for full migration**

---

## 8. Success Metrics

### Migration Success Criteria

1. **Data Completeness:**
   - ✅ All 4 AI projects migrated with 100% data fidelity
   - ✅ All 4 case studies migrated
   - ✅ All images successfully uploaded and optimized
   - ✅ No broken links or missing fields

2. **Functionality:**
   - ✅ All project detail pages render correctly
   - ✅ Images load with proper optimization
   - ✅ Nested data (AI components, dev process) displays correctly
   - ✅ Metrics and achievements render as expected

3. **Performance:**
   - ✅ Page load time < 2 seconds (3G connection)
   - ✅ Time to Interactive < 3 seconds
   - ✅ Images lazy load properly
   - ✅ No console errors

4. **Editor Experience:**
   - ✅ Content editors can add/edit projects without developer help
   - ✅ Studio interface is intuitive
   - ✅ Preview works in Studio
   - ✅ Content validation prevents errors

5. **Developer Experience:**
   - ✅ Clear documentation for adding new content types
   - ✅ Type-safe data fetching
   - ✅ Easy to add new fields
   - ✅ Good error messages

### Post-Migration Monitoring (First 2 Weeks)

**Metrics to Track:**

1. **Content Updates:**
   - Number of content edits made
   - Time from edit to publish
   - Errors encountered in Studio

2. **Frontend Performance:**
   - API response times
   - CDN cache hit rates
   - Image load times
   - Client-side errors

3. **Developer Velocity:**
   - Time to add new project
   - Time to add new field to schema
   - Questions from content editors (lower = better)

---

## 9. Quick Wins vs Long-term Work

### Quick Wins (Week 1)

1. **Schema Enhancement** (1 day)
   - Immediate value: Better content structure
   - Low risk, high impact

2. **Image Migration** (1 day)
   - Immediate value: Faster image loading via Sanity CDN
   - One-time effort, long-term benefits

3. **Feature Flags** (2 hours)
   - Immediate value: Risk-free testing in production
   - Enables gradual rollout

4. **First Project Migration** (4 hours)
   - Immediate value: Proof of concept
   - Validates entire approach

### Long-term Work (Week 2-3)

1. **Full Content Migration** (3-5 days)
   - Necessary but time-consuming
   - Can be done incrementally

2. **Component Refactoring** (2-3 days)
   - Nice to have: Cleaner code
   - Can be done over time

3. **Documentation** (1-2 days)
   - Essential for maintainability
   - Pays dividends long-term

### Future Enhancements (Phase 4+)

1. **Advanced Features:**
   - Content versioning and rollback
   - Multi-language support
   - Advanced preview modes
   - Content scheduling

2. **Performance Optimization:**
   - Switch to Next.js with ISR
   - Implement edge caching
   - Optimize GROQ queries
   - Add pagination

3. **Studio Enhancements:**
   - Custom input components
   - Workflow approval process
   - Content analytics dashboard
   - AI-assisted content writing

---

## 10. Recommended Order of Operations

### Phase 0: Preparation (Day 0)
1. ✅ Read and understand this plan
2. ✅ Verify Sanity project ID
3. ✅ Ensure local environment works (`npm run dev`, `npm run sanity`)
4. ✅ Create backup of current codebase
5. ✅ Set up git branch: `git checkout -b feature/sanity-migration`

### Phase 1: Foundation (Days 1-2)
1. Deploy enhanced schema to Sanity
2. Create feature flag infrastructure
3. Set up migration scripts
4. Create TypeScript types and GROQ queries
5. Implement data fetching hooks

### Phase 2: AI Projects (Days 3-5)
1. Migrate images to Sanity
2. Import AI project data
3. Update one project page as proof of concept
4. Update remaining AI project pages
5. Test thoroughly with feature flag

### Phase 3: Case Studies (Days 6-7)
1. Extract case study data
2. Import to Sanity
3. Create generic CaseStudy component
4. Update all case study pages
5. Test with feature flag

### Phase 4: Cutover (Days 8-10)
1. Enable feature flags in production
2. Monitor for 24-48 hours
3. Fix any issues discovered
4. Remove feature flags permanently
5. Delete hardcoded data files

### Phase 5: Optimization (Days 11-15)
1. Update documentation
2. Create content editor guide
3. Optimize performance
4. Clean up unused code
5. Final testing and polish

---

## 11. Risk Assessment & Mitigation

### High-Priority Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Data loss during migration** | Critical | Low | • Create backups before migration<br>• Keep hardcoded data until verified<br>• Use feature flags for gradual rollout<br>• Test in staging first |
| **Sanity API rate limiting** | High | Medium | • Use CDN for reads<br>• Implement client-side caching<br>• Monitor API usage<br>• Upgrade plan if needed |
| **Schema design doesn't support all data** | High | Low | • Thorough analysis completed (Section 1)<br>• Schema tested with sample data<br>• Iterative approach allows changes |
| **Images fail to migrate** | Medium | Low | • Script with error handling<br>• Fallback to URLs if needed<br>• Manual verification process |

### Medium-Priority Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Performance degradation** | Medium | Medium | • Use React Query for caching<br>• Monitor Core Web Vitals<br>• Optimize images with Sanity CDN<br>• Easy rollback with feature flags |
| **TypeScript type mismatches** | Medium | Medium | • Generate types from schema<br>• Adapter functions for compatibility<br>• Comprehensive testing |
| **Broken links after migration** | Medium | Low | • Keep same slugs<br>• Add redirects if needed<br>• Validate all links post-migration |
| **Content editor learning curve** | Low | High | • Create detailed guide<br>• Provide training session<br>• Good schema descriptions<br>• Custom input components |

### Low-Priority Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Studio customization challenges** | Low | Low | • Start with default Studio<br>• Iterate based on feedback |
| **GROQ query complexity** | Low | Low | • Use Vision tool for testing<br>• Document all queries<br>• Start simple, add complexity as needed |

---

## 12. Resources & References

### Essential Documentation

- [Sanity Schema Types](https://www.sanity.io/docs/schema-types)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
- [Sanity Image Pipeline](https://www.sanity.io/docs/image-url)
- [React Query Documentation](https://tanstack.com/query/latest/docs/react/overview)
- [TypeScript in Sanity](https://www.sanity.io/docs/typescript)

### Code Examples

- [Sanity + React Example](https://github.com/sanity-io/sanity-template-react-example)
- [Portfolio with Sanity](https://www.sanity.io/guides/build-your-first-blog-using-react)
- [Image Migration Script](https://www.sanity.io/docs/migrating-data)

### Tools

- [Sanity CLI](https://www.sanity.io/docs/cli)
- [GROQ Vision](https://www.sanity.io/docs/the-vision-plugin) - Query testing
- [Sanity Image Palette](https://www.sanity.io/docs/presenting-images) - Image optimization

### Support Channels

- [Sanity Slack Community](https://slack.sanity.io/)
- [GitHub Issues](https://github.com/sanity-io/sanity/issues)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/sanity)

---

## Appendix A: Migration Scripts

### A.1 Image Download Script

```typescript
// scripts/downloadImages.ts
import fetch from 'node-fetch'
import fs from 'fs/promises'
import path from 'path'
import { allAIProjects } from '../src/data/aiProjects'

async function downloadImage(url: string, filename: string) {
  const response = await fetch(url)
  const buffer = await response.buffer()
  const filepath = path.join(__dirname, '../assets/migrated-images', filename)
  await fs.mkdir(path.dirname(filepath), { recursive: true })
  await fs.writeFile(filepath, buffer)
  console.log(`Downloaded: ${filename}`)
}

async function downloadAllImages() {
  for (const project of allAIProjects) {
    // Hero image
    await downloadImage(
      project.heroImage,
      `${project.slug}-hero.jpg`
    )

    // Gallery images
    for (let i = 0; i < project.images.length; i++) {
      await downloadImage(
        project.images[i].url,
        `${project.slug}-${i + 1}.jpg`
      )
    }
  }
}

downloadAllImages().catch(console.error)
```

### A.2 Image Upload Script

```typescript
// scripts/uploadImages.ts
import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: 'production',
  token: process.env.SANITY_WRITE_TOKEN!,
  useCdn: false,
})

async function uploadImage(filepath: string) {
  const buffer = fs.readFileSync(filepath)
  const filename = path.basename(filepath)

  const asset = await client.assets.upload('image', buffer, {
    filename,
  })

  console.log(`Uploaded: ${filename} -> ${asset._id}`)
  return asset
}

async function uploadAllImages() {
  const imagesDir = path.join(__dirname, '../assets/migrated-images')
  const files = fs.readdirSync(imagesDir)

  const imageMap = new Map()

  for (const file of files) {
    const filepath = path.join(imagesDir, file)
    const asset = await uploadImage(filepath)
    imageMap.set(file, asset)
  }

  // Save mapping for migration script
  fs.writeFileSync(
    path.join(__dirname, 'image-mapping.json'),
    JSON.stringify(Object.fromEntries(imageMap), null, 2)
  )
}

uploadAllImages().catch(console.error)
```

### A.3 Complete Data Migration Script

```typescript
// scripts/migrateAIProjects.ts
import { createClient } from '@sanity/client'
import { allAIProjects } from '../src/data/aiProjects'
import imageMapping from './image-mapping.json'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: 'production',
  token: process.env.SANITY_WRITE_TOKEN!,
  useCdn: false,
})

async function migrateProject(project: typeof allAIProjects[0]) {
  console.log(`\nMigrating: ${project.title}`)

  // Get image references
  const heroImageRef = imageMapping[`${project.slug}-hero.jpg`]
  const imageRefs = project.images.map((_, i) =>
    imageMapping[`${project.slug}-${i + 1}.jpg`]
  )

  const sanityProject = {
    _type: 'project',
    title: project.title,
    subtitle: project.subtitle,
    slug: {
      _type: 'slug',
      current: project.slug,
    },
    category: project.category,
    projectType: 'ai-project',
    status: project.status,
    description: project.description,
    overview: project.overview,
    links: project.links,
    metrics: project.metrics,
    techStack: project.techStack,
    aiComponents: project.aiComponents,
    developmentProcess: project.developmentProcess,
    learnings: project.learnings,
    achievements: project.achievements,
    heroImage: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: heroImageRef._id,
      },
      alt: `${project.title} hero image`,
    },
    images: project.images.map((img, i) => ({
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: imageRefs[i]._id,
      },
      caption: img.caption,
      alt: img.caption,
    })),
    publishedAt: new Date().toISOString(),
    featured: false,
    order: allAIProjects.indexOf(project) + 1,
  }

  try {
    const result = await client.create(sanityProject)
    console.log(`✓ Successfully migrated: ${project.title}`)
    return result
  } catch (error) {
    console.error(`✗ Failed to migrate ${project.title}:`, error)
    throw error
  }
}

async function migrateAllProjects() {
  console.log('Starting AI Projects Migration...\n')

  for (const project of allAIProjects) {
    await migrateProject(project)
  }

  console.log('\n✓ Migration complete!')
}

migrateAllProjects().catch(console.error)
```

### A.4 Run Migration

```bash
# 1. Download images
npx tsx scripts/downloadImages.ts

# 2. Upload to Sanity
SANITY_PROJECT_ID=your-id SANITY_WRITE_TOKEN=your-token npx tsx scripts/uploadImages.ts

# 3. Migrate data
SANITY_PROJECT_ID=your-id SANITY_WRITE_TOKEN=your-token npx tsx scripts/migrateAIProjects.ts
```

---

## Appendix B: Content Editor Guide (Draft)

```markdown
# Content Management Guide

## Adding a New AI Project

1. Open Sanity Studio at `/studio`
2. Click "AI Projects" in the sidebar
3. Click "Create new project"
4. Fill in required fields (marked with *)
5. Click "Publish"

### Field Guide

**Basic Info:**
- **Title**: Project name (e.g., "Post Pal")
- **Subtitle**: One-line description
- **Slug**: URL-friendly version (auto-generated)
- **Category**: Choose from dropdown
- **Project Type**: Select "AI Project"
- **Status**: Live, In Progress, or Coming Soon

**Overview:**
- **Problem**: What problem does this solve?
- **Solution**: How does your project solve it?
- **Role**: Your role (e.g., "Lead Developer")
- **Timeline**: How long did it take?

**Metrics:**
- Add 3-4 key metrics
- Each metric has a label (e.g., "Active Users") and value (e.g., "2,500+")

**AI Components:**
- Add each AI feature as a separate component
- Include name, description, and technology used

### Tips

- Save drafts frequently
- Use "Preview" to see changes before publishing
- Upload high-quality images (recommended: 1600x900px)
- Add descriptive alt text for accessibility
```

---

## Conclusion

This migration plan provides a comprehensive, actionable roadmap for transitioning the Michael Evans portfolio from hardcoded content to Sanity CMS. The phased approach with feature flags ensures a low-risk migration with clear rollback options.

**Key Takeaways:**

1. **Phased Approach:** Migrate AI projects first (complex), then case studies (simple)
2. **Feature Flags:** Enable risk-free testing and gradual rollout
3. **Dual Systems:** Run hardcoded and Sanity in parallel during transition
4. **Enhanced Schema:** Comprehensive schema supports all current and future content needs
5. **Clear Timeline:** 2-3 weeks with well-defined milestones

**Next Steps:**

1. Review and approve this plan
2. Execute Step 1: Verify Sanity Project ID
3. Execute Step 2: Update schema
4. Execute Step 3: Create migration script
5. Proceed through roadmap systematically

**Success Criteria:** When content editors can add/edit projects through Sanity Studio without developer assistance, the migration is complete.

---

**Document Version:** 1.0
**Last Updated:** 2025-10-13
**Author:** Claude Code
**Status:** Ready for Review
