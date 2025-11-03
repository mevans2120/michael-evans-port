# Case Study Schema Replacement Plan

**Date:** November 3, 2025
**Goal:** Replace existing `project` schema with editorial magazine format (like AI Showcase)

---

## Current State Analysis

### Where Case Studies Are Used

1. **Homepage** (`src/app/(public)/page.tsx`)
   - Query: `*[_type == "project" && featured == true] | order(order asc)`
   - Fields used:
     - `_id`
     - `title`
     - `slug.current`
     - `category`
     - `featuredMetric`
     - `featuredDescription`
     - `order`

2. **FeaturedCaseStudies Component** (`src/components/FeaturedCaseStudies.tsx`)
   - Interface expects:
     ```typescript
     {
       id: string
       number: string (generated from index)
       category: string
       title: string
       metric: string (from featuredMetric)
       description: string (from featuredDescription)
       slug: string
       order: number
     }
     ```

3. **Case Study Detail Page** (`src/app/(public)/case-studies/[slug]/page.tsx`)
   - Query: `*[_type == "project" && slug.current == $slug][0]`
   - Fields used:
     - `title`
     - `summary` (as subtitle)
     - `description`
     - `category`
     - `heroImage`
     - `metrics[]` (label, value, description)
     - `achievements[]`
     - `technologies[]`
     - `overview` (role, company, timeline, problem, solution)
     - `sections[]` (sectionLabel, heading, content, screenshots, annotation)

---

## Field Mapping: Old Schema → New Editorial Schema

### ✅ Keep (Already Aligned with AI Showcase)

| Old Field | New Field | Notes |
|-----------|-----------|-------|
| `title` | `title` | No change |
| `slug` | `slug` | No change |
| `category` | `category` | No change |
| `featured` | `featured` | No change |
| `order` | `order` | No change |
| `publishedAt` | `publishedAt` | No change |
| `metrics[]` | `metrics[]` | Same structure (value, label, description) |
| `technologies[]` | `technologies[]` | No change |
| `overview` | `overview` | Keep for case study context |

### 🔄 Replace (Map to New Structure)

| Old Field | New Field | Migration |
|-----------|-----------|-----------|
| `summary` | `heroSection.summary` | Move to heroSection object |
| `description` | `heroSection.subtitle` | Move to heroSection object |
| `heroImage` | ❌ Remove | Not used in editorial format |
| `sections[]` | `slides[]` | Rename, keep same structure |
| `content` | ❌ Remove | Replaced by slides |
| `achievements[]` | ❌ Remove | Covered by metrics + content |

### ➕ Add (New Editorial Fields)

| New Field | Purpose | Default Value |
|-----------|---------|---------------|
| `heroSection.badge` | Category badge | "Case Study" |
| `heroSection.title` | Large hero title | From `title` |
| `heroSection.subtitle` | Tagline | From `description` |
| `heroSection.summary` | Brief overview | From `summary` |
| `slides[].quoteBox` | Pull quotes | New editorial component |
| `slides[].comparisonBoxes` | Before/after, problem/solution | New editorial component |
| `slides[].visualCards` | Screenshot galleries | Replace `screenshots[]` |
| `callToAction` | CTA at end | New editorial component |

### 🗑️ Deprecate (Track for Removal)

**Fields to mark as deprecated:**
- `heroImage` - Not used in editorial format
- `content` - Replaced by `slides[]`
- `achievements[]` - Covered by metrics + narrative
- `featuredMetric` - Can derive from `metrics[0].value`
- `featuredDescription` - Can derive from `heroSection.summary`

**Reason for deprecation:**
- Editorial format uses `slides[]` with portable text instead
- Homepage can derive featured fields from `heroSection` and `metrics`
- Simplifies schema and content management

---

## New Schema Structure

```typescript
// sanity/schemas/caseStudy.ts (or update project.ts)

export default defineType({
  name: 'project',
  title: 'Case Studies',
  type: 'document',
  fields: [
    // ===== Meta =====
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'Project category (e.g., "Case Study", "UX Design")',
    }),
    defineField({
      name: 'featured',
      title: 'Featured on Homepage',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
    }),

    // ===== Hero Section (NEW) =====
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
          description: 'Large hero title (usually same as document title)',
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
      validation: (Rule) => Rule.required(),
    }),

    // ===== Project Context =====
    defineField({
      name: 'overview',
      title: 'Project Overview',
      type: 'object',
      fields: [
        {
          name: 'role',
          title: 'Your Role',
          type: 'string',
          description: 'e.g., "Founder, Product Lead, Designer"',
        },
        {
          name: 'company',
          title: 'Company',
          type: 'string',
          description: 'e.g., "Beforelab (Startup)"',
        },
        {
          name: 'timeline',
          title: 'Timeline',
          type: 'string',
          description: 'e.g., "~2 years (2017-2019)"',
        },
      ],
    }),

    // ===== Content Slides (Renamed from sections) =====
    defineField({
      name: 'slides',
      title: 'Content Slides',
      type: 'array',
      description: 'Main content slides (max 3 for editorial format)',
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
              description: 'Small uppercase label (e.g., "The Challenge")',
            },
            {
              name: 'heading',
              title: 'Heading',
              type: 'string',
              description: 'Main slide heading',
              validation: (Rule) => Rule.required(),
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
              description: 'Screenshots or images (max 2-3 per slide)',
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

    // ===== Metrics =====
    defineField({
      name: 'metrics',
      title: 'Metrics',
      type: 'array',
      description: 'Key metrics for the results section',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'value',
              type: 'string',
              title: 'Value',
              description: 'e.g., "30-40%", "1000+"',
            },
            {
              name: 'label',
              type: 'string',
              title: 'Label',
              description: 'e.g., "Fewer Phone Opens"',
            },
            {
              name: 'description',
              type: 'string',
              title: 'Description',
              description: 'Optional context',
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
    }),

    // ===== Tech Stack =====
    defineField({
      name: 'technologies',
      title: 'Technologies Used',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),

    // ===== Call to Action =====
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

    // ===== DEPRECATED FIELDS (Keep for migration) =====
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
      of: [{ type: 'object', fields: [] }],
      description: '⚠️ Deprecated: Renamed to slides',
      hidden: true,
    }),
  ],
})
```

---

## Query Updates Needed

### 1. Homepage Query (Derive Featured Fields)

**Before:**
```groq
*[_type == "project" && featured == true] | order(order asc) {
  _id,
  title,
  "slug": slug.current,
  category,
  featuredMetric,
  featuredDescription,
  order
}
```

**After:**
```groq
*[_type == "project" && featured == true] | order(order asc) {
  _id,
  title,
  "slug": slug.current,
  category,
  "featuredMetric": coalesce(featuredMetric, metrics[0].value),
  "featuredDescription": coalesce(featuredDescription, heroSection.summary),
  order
}
```

**Notes:**
- Uses `coalesce()` for backward compatibility during migration
- After migration complete, can simplify to just `metrics[0].value` and `heroSection.summary`

### 2. Case Study Detail Query

**Before:**
```groq
*[_type == "project" && slug.current == $slug][0] {
  title,
  "subtitle": summary,
  description,
  category,
  heroImage,
  metrics,
  achievements,
  technologies,
  overview,
  sections
}
```

**After:**
```groq
*[_type == "project" && slug.current == $slug][0] {
  title,
  heroSection,
  category,
  metrics,
  technologies,
  overview,
  slides
}
```

**Notes:**
- Remove `heroImage` (not used in editorial)
- Remove `achievements` (covered by metrics + narrative)
- `sections` → `slides` rename
- Add `heroSection` object

---

## Component Updates Needed

### 1. Homepage - No Changes Required

The `FeaturedCaseStudies` component interface remains the same. Data mapping in `page.tsx` just needs to use new query (see Query Updates above).

### 2. Case Study Detail Page - Create New Magazine Layout

**New component:** `src/app/(public)/case-studies/[slug]/CaseStudyPageMagazine.tsx`

```typescript
'use client'

import React from 'react'
import { PortableText } from '@portabletext/react'
import type { CaseStudy } from '@/types/caseStudy'
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
  caseStudy: CaseStudy
}

export function CaseStudyPageMagazine({ caseStudy }: CaseStudyPageMagazineProps) {
  return (
    <MagazineLayout>
      {/* Hero */}
      <MagazineHero
        badge={caseStudy.heroSection.badge}
        title={caseStudy.heroSection.title}
        subtitle={caseStudy.heroSection.subtitle}
      />

      {/* Project Context */}
      {caseStudy.overview && (
        <MagazineOverview
          role={caseStudy.overview.role}
          company={caseStudy.overview.company}
          timeline={caseStudy.overview.timeline}
        />
      )}

      {/* Lede */}
      {caseStudy.heroSection.summary && (
        <MagazineLede>{caseStudy.heroSection.summary}</MagazineLede>
      )}

      <MagazineSeparator />

      {/* Content Slides */}
      {caseStudy.slides?.map((slide, index) => (
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

          {slide.sectionLabel && index < (caseStudy.slides?.length ?? 0) - 1 && (
            <MagazineSeparator />
          )}
        </React.Fragment>
      ))}

      {/* Metrics */}
      {caseStudy.metrics && (
        <>
          <MagazineSectionHeader>The Results</MagazineSectionHeader>
          <MagazineMetrics metrics={caseStudy.metrics} />
        </>
      )}

      {/* Tech Stack */}
      {caseStudy.technologies && (
        <MagazineTechStack technologies={caseStudy.technologies} />
      )}

      <MagazineSeparator />

      {/* CTA */}
      {caseStudy.callToAction && (
        <MagazineCTA
          text={caseStudy.callToAction.text}
          link={caseStudy.callToAction.link}
        />
      )}
    </MagazineLayout>
  )
}
```

### 3. New Components Needed

**Case Study Specific (in `src/components/case-study-magazine/`):**
- `MagazineOverview.tsx` - Display role, company, timeline
- `MagazineAnnotation.tsx` - Design decision callouts
- `MagazineVisualCards.tsx` - Screenshot galleries with captions
- `MagazineCTA.tsx` - Call to action section

**Reuse from AI Showcase (in `src/components/magazine/`):**
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

---

## Migration Path

### Phase 1: Add New Fields (Non-Breaking)
1. ✅ Add `heroSection` object to schema
2. ✅ Add `slides` array to schema (rename from sections)
3. ✅ Add `callToAction` object to schema
4. ✅ Mark old fields as deprecated and hidden
5. ✅ Deploy schema changes

**Status:** Schema is backward compatible. Old case studies still work.

### Phase 2: Update Queries (Non-Breaking)
1. ✅ Update homepage query to use `coalesce()` for backward compatibility
2. ✅ Update detail page query to include new fields
3. ✅ Deploy query updates

**Status:** Queries work with both old and new data.

### Phase 3: Build New Components
1. ✅ Create case study-specific magazine components
2. ✅ Create new `CaseStudyPageMagazine.tsx` layout
3. ✅ Add conditional rendering in detail page (if `heroSection` exists, use magazine layout)
4. ✅ Deploy component updates

**Status:** New case studies use editorial format. Old case studies use legacy format.

### Phase 4: Migrate Content
1. ✅ Create Before Launcher in new format
2. ✅ Test editorial rendering
3. ✅ Migrate remaining case studies
4. ✅ Verify all case studies use new format

**Status:** All content migrated to editorial format.

### Phase 5: Cleanup (Breaking)
1. ✅ Remove deprecated fields from schema
2. ✅ Simplify queries (remove `coalesce()`)
3. ✅ Delete old case study components
4. ✅ Deploy cleanup

**Status:** Clean schema with only editorial format supported.

---

## Deprecated Fields Tracking

### Fields to Remove After Migration

| Field | Used In | Replacement | Safe to Remove After |
|-------|---------|-------------|----------------------|
| `summary` | Detail page subtitle | `heroSection.summary` | All case studies migrated |
| `description` | Detail page | `heroSection.subtitle` | All case studies migrated |
| `heroImage` | Detail page hero | Not used | All case studies migrated |
| `content` | Detail page body | `slides[].content` | All case studies migrated |
| `achievements` | Detail page section | `metrics` + narrative | All case studies migrated |
| `featuredMetric` | Homepage cards | `metrics[0].value` | All case studies migrated |
| `featuredDescription` | Homepage cards | `heroSection.summary` | All case studies migrated |
| `sections` | Detail page body | `slides` | All case studies migrated |

### Cleanup Checklist

- [ ] All case studies have `heroSection` populated
- [ ] All case studies have `slides[]` instead of `sections[]`
- [ ] Homepage query derives featured fields from new schema
- [ ] Detail page uses magazine layout for all case studies
- [ ] Old components are no longer referenced
- [ ] Schema validation passes without deprecated fields
- [ ] Content editors understand new schema structure

---

## Implementation Checklist

### Schema Updates
- [ ] Update `sanity/schemas/project.ts` with new fields
- [ ] Add `heroSection` object
- [ ] Rename `sections` to `slides`
- [ ] Add `callToAction` object
- [ ] Add `quoteBox`, `comparisonBoxes`, `visualCards` to slides
- [ ] Mark deprecated fields as hidden
- [ ] Deploy to Sanity Studio

### Query Updates
- [ ] Update homepage query with `coalesce()` fallbacks
- [ ] Update detail page query to fetch new fields
- [ ] Test queries return expected data

### Component Development
- [ ] Create `MagazineOverview` component
- [ ] Create `MagazineAnnotation` component
- [ ] Create `MagazineVisualCards` component
- [ ] Create `MagazineCTA` component
- [ ] Create `CaseStudyPageMagazine` layout
- [ ] Add conditional rendering to detail page
- [ ] Test magazine layout rendering

### Content Migration
- [ ] Create Before Launcher in new format
- [ ] Verify editorial rendering
- [ ] Migrate remaining case studies
- [ ] Test all case studies render correctly

### Cleanup
- [ ] Remove deprecated fields from schema
- [ ] Simplify queries (remove fallbacks)
- [ ] Delete old components
- [ ] Update documentation
- [ ] Final deployment

---

## Testing Strategy

### Visual Testing
- [ ] Homepage featured cards display correctly
- [ ] Case study detail pages use magazine layout
- [ ] All editorial components render properly
- [ ] Responsive design works on mobile/desktop

### Content Testing
- [ ] Before Launcher displays with 3 slides
- [ ] Comparison boxes render correctly
- [ ] Pull quotes display properly
- [ ] Visual cards show images/placeholders
- [ ] Metrics section displays correctly
- [ ] CTA section works

### Migration Testing
- [ ] Old case studies still work during migration
- [ ] New case studies use editorial format
- [ ] Homepage handles mixed content (old + new)
- [ ] No console errors or warnings

---

## Rollback Plan

If issues arise during migration:

1. **Phase 1-2 Issues:** Deprecated fields are still present, old queries work
2. **Phase 3 Issues:** Conditional rendering allows falling back to old layout
3. **Phase 4 Issues:** Can restore case study content from Sanity history
4. **Phase 5 Issues:** Revert schema changes and re-add deprecated fields

**Key:** Always test in staging before production deployment.

---

## Success Criteria

- ✅ All case studies use editorial magazine format
- ✅ Maximum 3 pages per case study
- ✅ Homepage featured cards work correctly
- ✅ Detail pages render with magazine layout
- ✅ Deprecated fields removed from schema
- ✅ Content editors understand new workflow
- ✅ No broken links or missing content
- ✅ Performance metrics maintained or improved

---

## Next Steps

1. **Review this plan** - Confirm approach and timeline
2. **Update schema** - Implement Phase 1 changes
3. **Build components** - Create magazine layout components
4. **Migrate Before Launcher** - Test with real content
5. **Complete migration** - Roll out to all case studies
6. **Cleanup** - Remove deprecated fields

---

## Questions for Consideration

1. Should we keep the old case study layout as an option, or fully commit to editorial?
   - **Recommendation:** Fully commit to editorial for consistency

2. How many case studies need migration?
   - Need to check Sanity for current count

3. Timeline for migration?
   - **Recommendation:** 1-2 weeks for full migration

4. Should we create a migration script or manual content entry?
   - **Recommendation:** Manual for quality control (only a few case studies)
