# Complete Migration Plan: Deprecated Fields to Editorial Format

**Date:** November 4, 2025
**Goal:** Remove all deprecated fields from Project schema and migrate to new editorial format
**Strategy:** Complete the migration (Option 1 from analysis document)

---

## Executive Summary

This plan ensures all deprecated fields used on the **homepage**, **case studies landing page**, and **case study detail pages** are properly migrated to their new editorial equivalents before being removed from the schema.

### Current Status:
- ✅ **Homepage** already uses new fields (`featuredMetric`, `featuredDescription`)
- ❌ **Case Studies Hero** uses deprecated fields (`summary`, `description`, `heroImage`)
- ❌ **Queries** still fetch deprecated fields
- ❌ **Schema** has ~180 lines of deprecated code

---

## Migration Scope

### Pages Affected:

1. **Homepage (`/`)** - Featured case studies section
2. **Case Studies Landing (`/case-studies`)** - Hero with featured case study
3. **Case Study Detail (`/case-studies/[slug]`)** - Full editorial layout

### Deprecated Fields to Remove:

| Field | Replacement | Used On |
|-------|-------------|---------|
| `heroImage` | `featuredImage` | Case Studies Hero |
| `summary` | `heroSection.summary` (if exists, else `featuredDescription`) | Case Studies Hero |
| `description` | `heroSection.subtitle` (if exists, else fallback to `summary`) | Case Studies Hero |
| `achievements` | `metrics` | Detail pages (slides) |
| `content` | `slides` | Detail pages |
| `sections` | `slides` | Detail pages (already renamed) |

---

## Pre-Migration: Data Audit

Before making any changes, we need to audit what data exists in Sanity.

### Step 1: Run Sanity Queries to Check Data

```bash
# In Sanity Studio or via CLI
cd /Users/michaelevans/repos/michael-evans-port-main

# Check which projects use old vs new fields
npx sanity documents query '*[_type == "project"]{
  _id,
  title,
  "hasHeroImage": defined(heroImage),
  "hasFeaturedImage": defined(featuredImage),
  "hasSummary": defined(summary),
  "hasHeroSection": defined(heroSection),
  "hasDescription": defined(description),
  "hasAchievements": defined(achievements),
  "hasContent": defined(content),
  "hasSections": defined(sections),
  "hasSlides": defined(slides)
}'
```

**Expected Results:**
- If `hasHeroImage: true` and `hasFeaturedImage: false` → Need to migrate image
- If `hasSummary: true` and `hasHeroSection: false` → Need to migrate text
- If `hasContent: true` and `hasSlides: false` → Need to migrate content

### Step 2: Document Current State

Create a checklist of which projects need migration:

```markdown
**Projects Requiring Migration:**
- [ ] Aesop (check all fields)
- [ ] Lyft (check all fields)
- [ ] Before Launcher (check all fields)
- [ ] Casa Bonita (check all fields)
- [ ] Peddle (check all fields)
- [ ] Target (check all fields)
- [ ] Virgin America (check all fields)
```

---

## Migration Plan: 4 Phases

---

## Phase 1: Update Queries with Fallbacks (Risk-Free)

**Goal:** Make queries fetch BOTH old and new fields, prefer new

**Why First?** This makes the site work with either data format, zero risk

### Files to Update:

#### 1.1 Update `/src/lib/sanity/queries.ts`

##### `featuredCaseStudyQuery` (Lines 194-220)

**Current:**
```groq
*[_type == "project" && category == "case-study" && featured == true] | order(order asc)[0] {
  _id,
  title,
  slug,
  summary,
  description,
  metrics[] {
    label,
    value,
    description
  },
  heroImage {
    asset->{
      _id,
      url,
      metadata {
        dimensions,
        lqip
      }
    },
    alt,
    caption
  },
  order
}
```

**Updated:**
```groq
*[_type == "project" && featured == true] | order(order asc)[0] {
  _id,
  title,
  slug,

  // Prefer new editorial fields, fallback to old
  heroSection {
    badge,
    title,
    subtitle,
    summary
  },

  // Keep old fields as fallback
  summary,
  description,

  metrics[] {
    label,
    value,
    description
  },

  // Prefer featuredImage, fallback to heroImage
  featuredImage {
    asset->{
      _id,
      url,
      metadata {
        dimensions,
        lqip
      }
    },
    alt
  },

  heroImage {
    asset->{
      _id,
      url,
      metadata {
        dimensions,
        lqip
      }
    },
    alt,
    caption
  },

  order
}
```

##### `projectsQuery` (Lines 4-19)

**Current:**
```groq
*[_type == "project"] | order(order asc, publishedAt desc) {
  _id,
  title,
  slug,
  category,
  summary,
  description,
  heroImage,
  technologies,
  featured,
  featuredMetric,
  featuredDescription,
  "imageUrl": heroImage.asset->url
}
```

**Updated:**
```groq
*[_type == "project"] | order(order asc, publishedAt desc) {
  _id,
  title,
  slug,
  category,

  // Editorial format (preferred)
  heroSection {
    badge,
    title,
    subtitle,
    summary
  },

  // Old fields (fallback)
  summary,
  description,

  technologies,
  featured,
  featuredMetric,
  featuredDescription,

  // Images - prefer featured, fallback to hero
  featuredImage {
    asset->{
      _id,
      url
    },
    alt
  },
  heroImage {
    asset->{
      _id,
      url
    }
  },

  // Computed field for backward compatibility
  "imageUrl": coalesce(featuredImage.asset->url, heroImage.asset->url)
}
```

##### `projectQuery` (Lines 35-60) - Detail Page Query

**Current:**
```groq
*[_type == "project" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  category,
  summary,
  description,
  heroImage,
  "imageUrl": heroImage.asset->url,
  metrics,
  achievements,
  content[] {
    ...,
    _type == "image" => {
      "url": asset->url,
      "dimensions": asset->metadata.dimensions
    }
  },
  technologies,
  liveUrl,
  githubUrl,
  publishedAt,
  featured
}
```

**Updated:**
```groq
*[_type == "project" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  category,

  // Editorial format (preferred)
  heroSection {
    badge,
    title,
    subtitle,
    summary
  },
  overview {
    role,
    company,
    timeline
  },

  // Old fields (fallback)
  summary,
  description,

  metrics[] {
    label,
    value,
    description
  },

  // Prefer slides, fallback to content
  slides[] {
    _key,
    sectionLabel,
    heading,
    content,
    quoteBox,
    comparisonBoxes,
    visualCards,
    annotation
  },
  content[] {
    ...,
    _type == "image" => {
      "url": asset->url,
      "dimensions": asset->metadata.dimensions
    }
  },

  // Images
  featuredImage {
    asset->{
      _id,
      url
    },
    alt
  },
  heroImage {
    asset->{
      _id,
      url
    }
  },
  "imageUrl": coalesce(featuredImage.asset->url, heroImage.asset->url),

  technologies,
  liveUrl,
  githubUrl,
  publishedAt,
  featured,

  callToAction {
    text,
    link
  },

  seo {
    metaTitle,
    metaDescription,
    keywords,
    twitterCard,
    canonicalUrl,
    noIndex
  }
}
```

##### `featuredProjectsQuery` (Lines 22-32)

**Current:**
```groq
*[_type == "project" && featured == true] | order(order asc, publishedAt desc)[0...4] {
  _id,
  title,
  slug,
  category,
  summary,
  heroImage,
  "imageUrl": heroImage.asset->url
}
```

**Updated:**
```groq
*[_type == "project" && featured == true] | order(order asc, publishedAt desc)[0...4] {
  _id,
  title,
  slug,
  category,

  // Editorial format
  heroSection {
    subtitle,
    summary
  },

  // Old fields (fallback)
  summary,

  // Images
  featuredImage {
    asset->{
      _id,
      url
    }
  },
  heroImage {
    asset->{
      _id,
      url
    }
  },
  "imageUrl": coalesce(featuredImage.asset->url, heroImage.asset->url)
}
```

##### `projectsByCategoryQuery` (Lines 63-74)

**Current:**
```groq
*[_type == "project" && category == $category] | order(order asc, publishedAt desc) {
  _id,
  title,
  slug,
  category,
  summary,
  heroImage,
  "imageUrl": heroImage.asset->url,
  technologies
}
```

**Updated:**
```groq
*[_type == "project" && category == $category] | order(order asc, publishedAt desc) {
  _id,
  title,
  slug,
  category,

  // Editorial format
  heroSection {
    summary
  },

  // Old fields (fallback)
  summary,

  // Images
  featuredImage {
    asset->{
      _id,
      url
    }
  },
  heroImage {
    asset->{
      _id,
      url
    }
  },
  "imageUrl": coalesce(featuredImage.asset->url, heroImage.asset->url),

  technologies
}
```

### Testing After Phase 1:

```bash
npm run build
npm run dev
```

**Test URLs:**
- http://localhost:3000 (homepage - should still work)
- http://localhost:3000/case-studies (landing page - should still work)
- http://localhost:3000/case-studies/aesop (or any case study - should still work)

**Expected:** Everything works exactly as before because queries still fetch old fields.

---

## Phase 2: Update Components to Use New Fields

**Goal:** Make components prefer new fields, fallback to old

### Files to Update:

#### 2.1 Update `/src/components/case-studies/CaseStudiesHero.tsx`

**Current TypeScript Interface (Lines 5-22):**
```typescript
interface CaseStudy {
  title: string
  slug: { current: string }
  summary: string
  description: string
  metrics?: Array<{
    label: string
    value: string
    description?: string
  }>
  heroImage?: {
    asset?: {
      _id: string
      url: string
    }
    alt?: string
  }
}
```

**Updated Interface:**
```typescript
interface CaseStudy {
  title: string
  slug: { current: string }

  // New editorial format (preferred)
  heroSection?: {
    badge?: string
    title?: string
    subtitle?: string
    summary?: string
  }

  // Old fields (fallback)
  summary?: string
  description?: string

  metrics?: Array<{
    label: string
    value: string
    description?: string
  }>

  // New image (preferred)
  featuredImage?: {
    asset?: {
      _id: string
      url: string
      metadata?: {
        dimensions?: any
        lqip?: string
      }
    }
    alt?: string
  }

  // Old image (fallback)
  heroImage?: {
    asset?: {
      _id: string
      url: string
    }
    alt?: string
  }
}
```

**Updated Component Logic (Lines 28-78):**
```typescript
export function CaseStudiesHero({ caseStudy }: CaseStudiesHeroProps) {
  // Get primary metric (first metric or custom logic)
  const primaryMetric = caseStudy.metrics?.[0]

  // Prefer new editorial fields, fallback to old
  const displayTitle = caseStudy.heroSection?.title || caseStudy.title
  const displayDescription = caseStudy.heroSection?.subtitle
    || caseStudy.heroSection?.summary
    || caseStudy.description
    || caseStudy.summary
    || ''

  const displayImage = caseStudy.featuredImage || caseStudy.heroImage

  return (
    <section className="relative min-h-[75vh] flex items-center py-28 md:py-32 overflow-hidden">
      {/* Background layers */}
      <CaseStudyBackground image={displayImage} />

      {/* Content */}
      <div className="container relative z-10 max-w-5xl">
        <div className="max-w-[900px]">
          {/* Label */}
          <div className="inline-block text-sm font-semibold tracking-widest uppercase text-accent-light mb-6">
            {caseStudy.heroSection?.badge || 'Featured Case Study'}
          </div>

          {/* Title */}
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-light leading-tight mb-8 text-gradient"
          >
            {displayTitle}
          </h1>

          {/* Primary Metric */}
          {primaryMetric && (
            <div className="flex items-center gap-4 text-2xl font-semibold text-accent-light mb-6">
              <div className="w-10 h-0.5 bg-gradient-to-r from-accent to-transparent" />
              {primaryMetric.value}
            </div>
          )}

          {/* Description */}
          {displayDescription && (
            <p className="text-xl leading-relaxed text-gray-200 max-w-[700px] mb-12">
              {displayDescription}
            </p>
          )}

          {/* CTA */}
          <Link
            href={`/case-studies/${caseStudy.slug.current}`}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-lg font-semibold text-accent-foreground bg-gradient-to-br from-accent to-accent-light hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/40 transition-smooth"
          >
            View Case Study
            <ArrowRight className="w-5 h-5 transition-transform duration-normal group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}
```

#### 2.2 Update `/src/app/(public)/case-studies/page.tsx`

**Current (Lines 24-36):**
```typescript
const caseStudies = allProjects
  .map((project: any, index: number) => ({
    id: project._id,
    number: String(index + 1).padStart(2, '0'),
    category: project.category || 'Case Study',
    title: project.title,
    metric: project.featuredMetric || '',
    description: project.featuredDescription || project.summary || '',
    slug: project.slug?.current || project.slug,
    order: project.order || index + 1
  }))
```

**Updated:**
```typescript
const caseStudies = allProjects
  .map((project: any, index: number) => ({
    id: project._id,
    number: String(index + 1).padStart(2, '0'),
    category: project.category || 'Case Study',
    title: project.title,
    metric: project.featuredMetric || '',
    // Prefer featuredDescription, fallback to heroSection.summary, then old summary
    description: project.featuredDescription
      || project.heroSection?.summary
      || project.summary
      || '',
    slug: project.slug?.current || project.slug,
    order: project.order || index + 1
  }))
```

### Testing After Phase 2:

```bash
npm run build
npm run dev
```

**Test the same URLs:**
- Homepage should still work
- Case studies landing should show hero properly
- Case study detail pages should render

**Expected:** Everything works, components now prefer new fields but still use old ones if needed.

---

## Phase 3: Migrate Data in Sanity Studio (If Needed)

**Goal:** Move data from old fields to new fields in CMS

### Only Required If:
- Phase 1 audit showed projects with old fields but no new fields
- E.g., `hasHeroImage: true` but `hasFeaturedImage: false`

### Migration Options:

#### Option A: Manual Migration (Recommended for small number of projects)

For each project that needs migration:

1. Open in Sanity Studio: http://localhost:3000/studio
2. Navigate to the project
3. **Copy old field values:**
   - If `summary` exists but `heroSection.summary` doesn't → Copy to `heroSection.summary`
   - If `description` exists but `heroSection.subtitle` doesn't → Copy to `heroSection.subtitle`
   - If `heroImage` exists but `featuredImage` doesn't → Re-upload to `featuredImage`
4. Save

#### Option B: Automated Migration Script

If many projects need migration, create a script:

```typescript
// scripts/migrate-project-fields.ts
import { client } from '@/lib/sanity/client'

async function migrateProjects() {
  // Fetch projects with old fields
  const projects = await client.fetch(`
    *[_type == "project" && (
      (defined(summary) && !defined(heroSection.summary)) ||
      (defined(description) && !defined(heroSection.subtitle)) ||
      (defined(heroImage) && !defined(featuredImage))
    )] {
      _id,
      title,
      summary,
      description,
      heroImage,
      heroSection,
      featuredImage
    }
  `)

  console.log(`Found ${projects.length} projects to migrate`)

  for (const project of projects) {
    const patches: any = {}

    // Migrate summary to heroSection.summary
    if (project.summary && !project.heroSection?.summary) {
      patches['heroSection.summary'] = project.summary
    }

    // Migrate description to heroSection.subtitle
    if (project.description && !project.heroSection?.subtitle) {
      patches['heroSection.subtitle'] = project.description
    }

    // Migrate heroImage to featuredImage
    if (project.heroImage && !project.featuredImage) {
      patches.featuredImage = project.heroImage
    }

    if (Object.keys(patches).length > 0) {
      console.log(`Migrating ${project.title}...`, patches)
      await client.patch(project._id).set(patches).commit()
    }
  }

  console.log('Migration complete!')
}

migrateProjects()
```

Run with:
```bash
npx tsx scripts/migrate-project-fields.ts
```

### Testing After Phase 3:

1. Refresh Sanity Studio
2. Check that all projects now have new editorial fields populated
3. Test website again - should work identically

---

## Phase 4: Remove Fallbacks and Deprecated Fields

**Goal:** Clean up queries, components, and schema

### 4.1 Update Queries - Remove Old Fields

In `/src/lib/sanity/queries.ts`, remove all references to:
- `summary` (except when used as fallback for `featuredDescription`)
- `description`
- `heroImage`
- `achievements`
- `content`
- `sections`

**Example - `featuredCaseStudyQuery`:**
```groq
*[_type == "project" && featured == true] | order(order asc)[0] {
  _id,
  title,
  slug,
  heroSection {
    badge,
    title,
    subtitle,
    summary
  },
  metrics[] {
    label,
    value,
    description
  },
  featuredImage {
    asset->{
      _id,
      url,
      metadata {
        dimensions,
        lqip
      }
    },
    alt
  },
  order
}
```

### 4.2 Update Components - Remove Fallback Logic

In `/src/components/case-studies/CaseStudiesHero.tsx`:

```typescript
interface CaseStudy {
  title: string
  slug: { current: string }
  heroSection: {
    badge?: string
    title?: string
    subtitle?: string
    summary?: string
  }
  metrics?: Array<{
    label: string
    value: string
    description?: string
  }>
  featuredImage?: {
    asset?: {
      _id: string
      url: string
      metadata?: {
        dimensions?: any
        lqip?: string
      }
    }
    alt?: string
  }
}

export function CaseStudiesHero({ caseStudy }: CaseStudiesHeroProps) {
  const primaryMetric = caseStudy.metrics?.[0]

  return (
    <section className="relative min-h-[75vh] flex items-center py-28 md:py-32 overflow-hidden">
      <CaseStudyBackground image={caseStudy.featuredImage} />

      <div className="container relative z-10 max-w-5xl">
        <div className="max-w-[900px]">
          <div className="inline-block text-sm font-semibold tracking-widest uppercase text-accent-light mb-6">
            {caseStudy.heroSection.badge || 'Featured Case Study'}
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light leading-tight mb-8 text-gradient">
            {caseStudy.heroSection.title || caseStudy.title}
          </h1>

          {primaryMetric && (
            <div className="flex items-center gap-4 text-2xl font-semibold text-accent-light mb-6">
              <div className="w-10 h-0.5 bg-gradient-to-r from-accent to-transparent" />
              {primaryMetric.value}
            </div>
          )}

          {caseStudy.heroSection.subtitle && (
            <p className="text-xl leading-relaxed text-gray-200 max-w-[700px] mb-12">
              {caseStudy.heroSection.subtitle}
            </p>
          )}

          <Link
            href={`/case-studies/${caseStudy.slug.current}`}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-lg font-semibold text-accent-foreground bg-gradient-to-br from-accent to-accent-light hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/40 transition-smooth"
          >
            View Case Study
            <ArrowRight className="w-5 h-5 transition-transform duration-normal group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}
```

### 4.3 Remove Deprecated Fields from Schema

In `/sanity/schemas/project.ts`, delete lines:

- **Lines 65-92** - heroImage, summary, description (deprecated)
- **Lines 113-119** - achievements (deprecated)
- **Lines 121-133** - content (deprecated)
- **Lines 411-540** - sections (deprecated)

**Result:** ~180 lines removed, schema is 30% smaller!

### Testing After Phase 4:

```bash
# Full build test
npm run build

# Check for TypeScript errors
npx tsc --noEmit

# Test all pages
npm run dev
```

**Test thoroughly:**
- [ ] Homepage loads and shows featured case studies
- [ ] Case studies landing page shows hero properly
- [ ] All case study detail pages render correctly
- [ ] Images load on all pages
- [ ] Metrics display correctly
- [ ] Content slides display on detail pages

---

## Rollback Plan

If anything breaks:

### Quick Rollback:
```bash
# Revert last commit
git reset --hard HEAD~1

# Restart dev server
npm run dev
```

### Selective Rollback:
```bash
# Revert specific file
git checkout HEAD~1 -- src/lib/sanity/queries.ts
```

### Restore Sanity Data:
Sanity has built-in version history:
1. Go to Studio → Select document
2. Click "..." menu → "History"
3. Restore previous version

---

## Success Criteria

Migration is complete when:

- [ ] All deprecated fields removed from `/sanity/schemas/project.ts`
- [ ] All queries in `/src/lib/sanity/queries.ts` use new fields only
- [ ] All components use new fields only
- [ ] Homepage displays featured case studies correctly
- [ ] Case studies landing page hero works
- [ ] Case study detail pages render fully
- [ ] Production build succeeds with no TypeScript errors
- [ ] No console errors or warnings in browser

---

## Estimated Timeline

| Phase | Time Estimate | Notes |
|-------|---------------|-------|
| Phase 1: Update Queries | 30-45 min | Copy/paste, careful with syntax |
| Phase 2: Update Components | 30-45 min | Update interfaces and logic |
| Phase 3: Migrate Data | 15 min - 1 hour | Depends on how many projects |
| Phase 4: Remove Deprecated | 15-30 min | Delete lines, final testing |
| **Total** | **1.5-3 hours** | Includes testing at each phase |

---

## Post-Migration

### Monitor for Issues:

1. **Check analytics** - Any spike in 404s or errors?
2. **Test on mobile** - Responsive layouts still work?
3. **Verify SEO** - Meta tags still pulling correct data?

### Documentation:

Update `/sanity/schemas/project.ts` with a comment at the top:

```typescript
/**
 * Project Schema (Editorial Format)
 *
 * Migration completed: November 4, 2025
 * - Removed deprecated fields (heroImage, summary, description, etc.)
 * - All projects now use heroSection, featuredImage, slides
 * - See /docs/cms-migration-plan.md for migration history
 */
```

---

## Next Steps

1. **Choose when to execute** - Ideally during low-traffic time
2. **Run Phase 1 data audit** to understand current state
3. **Execute phases in order** - Don't skip phases!
4. **Test thoroughly** after each phase
5. **Commit after each phase** for easy rollback

---

## Questions Before Starting?

- Do you want me to run the Phase 1 data audit now?
- Should we execute Phase 1 (query updates) first to see how it goes?
- Any concerns about the approach?
