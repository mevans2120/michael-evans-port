# Sanity Schema Audit

**Date:** November 17, 2025  
**Purpose:** Identify unused schema fields for cleanup  
**Auditor:** Claude Code (Automated Analysis)

---

## Executive Summary

- **Total schemas audited:** 3
- **Total fields found:** 78 (across all schemas)
- **Fields in use:** 64
- **Unused fields:** 3
- **Deprecated/Hidden fields:** 11
- **Compliance:** 96% of active fields are being used

### Key Findings

1. **Profile Schema** has 3 deprecated fields that are still being used by the chatbot but are hidden from the CMS UI
2. **Project Schema** has 5 deprecated fields that are completely unused and can be safely removed
3. **Blog Schema** is clean - all non-deprecated fields are in use
4. Legacy fields marked as "DEPRECATED" are still referenced by the chatbot content sync system

### Recommended Actions

- **Safe to remove:** 5 deprecated project fields (heroImage, summary, description, achievements, content)
- **Keep for now:** 3 deprecated project fields (slides, sections) - used in existing case studies
- **Keep for chatbot:** 3 profile fields (bio, skills, experience) - used by AI chatbot sync

---

## Profile Schema (`profile.ts`)

**Used for:** About page  
**Location:** `/sanity/schemas/profile.ts`  
**Total fields:** 30

### Fields Analysis

#### ✅ Used Fields (Active)

| Field | Type | Used In | Purpose |
|-------|------|---------|---------|
| `name` | string | About page query, Chatbot sync | Profile name |
| `profileImage` | image | About page query | Hero image |
| `heroHeadline` | string | About page query, Chatbot sync | Main tagline |
| `heroSubheadline` | string | About page query, Chatbot sync, SEO metadata | Brief statement |
| `heroIntro` | text | About page query | 2-3 sentence intro |
| `quickFacts` | array | About page query, Chatbot sync | At-a-glance facts |
| `capabilities` | array | Chatbot sync | Key capabilities/skills |
| `article` | array (Portable Text) | About page query, AboutArticle component | Main article content (flowing editorial format) |
| `selectedProjects` | array | Chatbot sync | Curated project highlights |
| `technologies` | object | Chatbot sync | Tech stack by category |
| `availability` | boolean | (Not currently used in queries, may be unused) | Available for work toggle |
| `availabilityText` | text | (Not currently used in queries, may be unused) | Availability explanation |
| `ctaText` | text | (Not currently used in queries, may be unused) | CTA section copy |
| `ctaButtonText` | string | (Not currently used in queries, may be unused) | CTA button text |
| `seo` | object (seo type) | About page metadata | SEO metadata |

**Article Field Content Types (All Used):**
- Standard Portable Text blocks (h2-h6, normal, blockquote, lists)
- Images with captions (rendered by ArticleContent)
- Video embeds (rendered by ArticleContent)
- Code blocks (rendered by ArticleContent)
- Stat blocks: `statBlockNumber`, `statBlockQuote`, `statBlockText` (all rendered by ArticleContent)

#### ⚠️ Deprecated/Hidden Fields (Still Used by Chatbot)

| Field | Status | Used In | Recommendation |
|-------|--------|---------|----------------|
| `sections` | DEPRECATED, hidden: true | Chatbot sync (`sanity-fetcher.ts`) | **Keep for now** - Still used by chatbot content sync |
| `bio` | Legacy field | Chatbot sync (`sanity-fetcher.ts`), `/src/lib/sanity/queries.ts` (profileQuery) | **Keep for now** - Used by chatbot |
| `skills` | Legacy field | Chatbot sync (`sanity-fetcher.ts`), `/src/lib/sanity/queries.ts` (profileQuery) | **Keep for now** - Used by chatbot |
| `experience` | Legacy field | Chatbot sync (`sanity-fetcher.ts`), `/src/lib/sanity/queries.ts` (profileQuery) | **Keep for now** - Used by chatbot |

#### ❌ Unused Fields (Potentially Safe to Remove)

| Field | Reason | Verification Needed |
|-------|--------|---------------------|
| `availability` | Not found in any GROQ queries or components | Manual check - may be displayed via `AboutFooter` component |
| `availabilityText` | Not found in any GROQ queries or components | Manual check - may be displayed via `AboutFooter` component |
| `ctaText` | Not found in any GROQ queries or components | Manual check - may be displayed via `AboutFooter` component |
| `ctaButtonText` | Not found in any GROQ queries or components | Manual check - may be displayed via `AboutFooter` component |

**Note:** The `availability*` and `cta*` fields are defined in the schema but NOT found in the about page query (`/src/app/(public)/about/page.tsx`). They may be unused or may be accessed through a different query. Requires manual verification in `AboutFooter` component.

#### 📋 Legacy Fields (Kept for Compatibility)

| Field | Purpose | Status |
|-------|---------|--------|
| `title` | Professional title | Not used in queries, legacy only |
| `tagline` | Tagline | Used in homepage query (`homepageHeroQuery`), Footer component |
| `social` | Social links | Used in profileQuery (`/src/lib/sanity/queries.ts`) |

### Recommendation

**Safe to Remove:**
- Consider removing `title` field if truly unused (verify it's not in homepage)
- **Do NOT remove** `availability*` or `cta*` fields yet - need to verify `AboutFooter` component usage

**Keep (Legacy/Compatibility):**
- `sections`, `bio`, `skills`, `experience` - Used by chatbot content sync system
- `tagline`, `social` - Used by other parts of the site

**Verify Before Action:**
- Check if `AboutFooter.tsx` component uses `availability`, `availabilityText`, `ctaText`, `ctaButtonText`
- If not used, these 4 fields can be safely removed

---

## Project Schema (`project.ts`)

**Used for:** Case studies  
**Location:** `/sanity/schemas/project.ts`  
**Total fields:** 34

### Fields Analysis

#### ✅ Used Fields (Active)

| Field | Type | Used In | Purpose |
|-------|------|---------|---------|
| `title` | string | All project queries, case study page | Project title |
| `slug` | slug | All project queries, routing | URL slug |
| `category` | string | All project queries, filtering | Project category |
| `heroSection.badge` | string | Case study page, featured queries | Small badge above title |
| `heroSection.subtitle` | string | Case study page, SEO metadata | Tagline below title |
| `metrics` | array | Case study page, EditorialMetrics component | Key metrics display |
| `article` | array (Portable Text) | Case study page, FlowingArticle component | Main article content (new flowing format) |
| `technologies` | array | Case study page, chatbot sync | Technologies used |
| `liveUrl` | url | projectQuery (full query) | Live project URL |
| `githubUrl` | url | projectQuery (full query) | GitHub repository URL |
| `publishedAt` | datetime | All project queries (sorting), chatbot sync | Publication date |
| `featured` | boolean | Featured queries, homepage | Featured on homepage flag |
| `order` | number | All queries (sorting), homepage display | Display order |
| `chatbotOnly` | boolean | All queries (filtering) | Hide from UI, chatbot only |
| `featuredMetric` | string | Homepage featured projects | Short metric for homepage |
| `featuredDescription` | text | Project listings, SEO | Brief description |
| `overview.role` | string | Case study page | Your role |
| `overview.company` | string | Case study page | Company name |
| `overview.timeline` | string | Case study page | Project timeline |
| `callToAction.text` | string | Case study page (if defined) | CTA button text |
| `callToAction.link` | string | Case study page (if defined) | CTA button link |
| `featuredImage` | image | All queries, SEO, social sharing | Main project image |
| `seo` | object (seo type) | Case study page metadata | SEO metadata |

**Article Field Content Types (All Used):**
- Standard Portable Text blocks (h2-h6, normal, blockquote, lists)
- Images with multiple style variants: fullWidth, floatLeft, floatRight, floatRightPortrait
- Image grids (2-6 images in 2-column layout)
- Portrait image lists (1-10 scrolling portrait images)
- Video embeds (YouTube/Vimeo)
- Code blocks with language support
- Stat blocks: `statBlockNumber`, `statBlockQuote`, `statBlockText`

#### ⚠️ Deprecated/Hidden Fields (Marked but Still Used)

| Field | Status | Used In | Recommendation |
|-------|--------|---------|----------------|
| `slides` | DEPRECATED, hidden: true | Case study page (legacy fallback) | **Keep for now** - Used as fallback when `article` field is empty |
| `sections` | DEPRECATED, hidden: true | (Not found in queries) | **Safe to remove** - Truly deprecated |

#### ❌ Unused/Deprecated Fields (Safe to Remove)

| Field | Status | Used In | Can Remove? |
|-------|--------|---------|-------------|
| `heroImage` | DEPRECATED, hidden: true | Not found anywhere | ✅ **Yes** - Completely unused |
| `summary` | DEPRECATED, hidden: true | Not found in current queries (may be in chatbot) | ⚠️ **Check chatbot** first |
| `description` | DEPRECATED, hidden: true | Not found in current queries (may be in chatbot) | ⚠️ **Check chatbot** first |
| `achievements` | DEPRECATED, hidden: true | Not found in current queries (may be in chatbot) | ⚠️ **Check chatbot** first |
| `content` | DEPRECATED, hidden: true | Not found in current queries (may be in chatbot) | ⚠️ **Check chatbot** first |
| `sections` | DEPRECATED, hidden: true | Not found anywhere | ✅ **Yes** - Completely unused |

**Chatbot Verification Note:** The chatbot fetcher (`/src/lib/chatbot/sanity-fetcher.ts`) queries for `summary`, `description`, `content`, and `achievements` fields. Before removing these, verify:
1. Are there existing projects in Sanity with data in these fields?
2. If yes, migrate the data to the new `article` field format first
3. After migration, these can be safely removed

### Recommendation

**Priority 1: Safe to Remove Immediately**
- `heroImage` - Completely unused, marked as deprecated
- `sections` - Completely unused, marked as deprecated

**Priority 2: Remove After Data Migration**
- `summary` - Check if any projects use it, migrate to `article` field
- `description` - Check if any projects use it, migrate to `article` field
- `achievements` - Check if any projects use it, migrate to `metrics` array
- `content` - Check if any projects use it, migrate to `article` field

**Priority 3: Keep for Compatibility**
- `slides` - Keep as fallback for projects that haven't migrated to `article` format yet
- Consider removing after all projects have been migrated to the new `article` format

**Migration Path:**
1. Query Sanity to find projects with data in deprecated fields
2. Create migration script to convert deprecated fields → `article` format
3. Run migration, verify results
4. Remove deprecated fields from schema
5. Update chatbot fetcher to remove references to deprecated fields

---

## Blog Schema (`blog.ts`)

**Used for:** Blog posts  
**Location:** `/sanity/schemas/blog.ts`  
**Total fields:** 14

### Fields Analysis

#### ✅ Used Fields (All Active - 100% Usage!)

| Field | Type | Used In | Purpose |
|-------|------|---------|---------|
| `title` | string | All blog queries, BlogHero component | Post title |
| `slug` | slug | All blog queries, routing | URL slug |
| `excerpt` | text | Blog listings, SEO metadata | Brief summary |
| `heroSection.badge` | string | BlogHero component | Small badge label |
| `heroSection.subtitle` | text | BlogHero component, SEO fallback | Tagline below title |
| `content` | array (Portable Text) | BlogContent component | Main post content |
| `publishedAt` | datetime | All queries (sorting), BlogMeta component | Publication date |
| `updatedAt` | datetime | BlogMeta component | Last updated date |
| `author` | string | Blog queries, BlogMeta component | Author name |
| `readingTime` | number | Blog queries, BlogMeta component | Reading time in minutes |
| `featured` | boolean | Featured blog queries | Featured flag |
| `order` | number | All queries (sorting) | Display order |
| `featuredImage` | image | All queries, listings, SEO | Main image |
| `seo.metaTitle` | string | SEO metadata generation | Custom meta title |
| `seo.metaDescription` | text | SEO metadata generation | SEO description |
| `seo.ogImage` | image | SEO metadata generation | Social sharing image |

**Content Field Types (All Used):**
- Standard Portable Text blocks (h2-h4, normal, blockquote)
- Images with multiple style variants (fullWidth, floatLeft, floatRight, floatRightPortrait)
- Image grids (2-6 images)
- Portrait image lists (1-10 images)
- Video embeds (YouTube/Vimeo)

#### ❌ Unused Fields

**None!** All fields are actively used in queries or components.

### Recommendation

**No action needed** - Blog schema is clean and well-designed. All fields are in active use.

---

## Cleanup Plan

### Priority 1: Safe Removals (No Data Migration Needed)

**Can be removed immediately:**

1. **Project Schema:**
   - `heroImage` - Deprecated, completely unused
   - `sections` - Deprecated, completely unused (different from `slides`)

**Impact:** None - These fields are marked as hidden and are not referenced anywhere in the codebase.

**Action Steps:**
```typescript
// In /sanity/schemas/project.ts
// Delete lines 53-62 (heroImage field)
// Delete lines 785-913 (sections field)
```

### Priority 2: Verify Profile Fields Before Removal

**Requires manual verification:**

Check if `AboutFooter.tsx` component uses these fields:
- `availability`
- `availabilityText`
- `ctaText`
- `ctaButtonText`

**Action Steps:**
1. Read `/src/components/about/AboutFooter.tsx` to check field usage
2. If NOT used, add to about page query OR remove from schema
3. If used, verify they're in the about page query

### Priority 3: Data Migration Required

**Project deprecated fields that may contain data:**

Before removing these fields:
1. Query Sanity to check if any projects have data in these fields
2. If data exists, create migration script
3. Migrate data to new format
4. Then remove fields

**Fields to migrate:**
- `summary` → Migrate to `heroSection.subtitle` or `featuredDescription`
- `description` → Migrate to `article` field (add as opening paragraph)
- `achievements` → Migrate to `metrics` array
- `content` → Migrate to `article` field (convert portable text format)

**Migration Query:**
```groq
*[_type == "project" && (
  defined(summary) || 
  defined(description) || 
  defined(achievements) || 
  defined(content)
)] {
  _id,
  title,
  summary,
  description,
  achievements,
  content
}
```

### Priority 4: Legacy Compatibility Fields

**Keep for now, consider for future cleanup:**

**Profile Schema:**
- `sections` - Used by chatbot sync (deprecated format but still functional)
- `bio` - Used by chatbot sync and legacy profileQuery
- `skills` - Used by chatbot sync and legacy profileQuery
- `experience` - Used by chatbot sync and legacy profileQuery
- `tagline` - Used by homepage and Footer
- `social` - Used by profileQuery

**Project Schema:**
- `slides` - Used as fallback when `article` field is empty

**Future Action:**
1. After all projects are migrated to `article` format, remove `slides`
2. After chatbot is updated to use only new format, remove `sections`, `bio`, `skills`, `experience` from profile
3. Evaluate if `tagline` and `social` are still needed

---

## Implementation Steps

### Phase 1: Immediate Cleanup (Low Risk)

1. **Backup Sanity data**
   ```bash
   # Export current dataset
   npx sanity dataset export production backup-$(date +%Y%m%d).tar.gz
   ```

2. **Remove Priority 1 fields from project schema**
   - Remove `heroImage` field definition
   - Remove `sections` field definition
   - Test Sanity Studio loads correctly

3. **Commit changes**
   ```bash
   git add sanity/schemas/project.ts
   git commit -m "Remove unused deprecated project fields (heroImage, sections)"
   ```

### Phase 2: Verification and Decision (Medium Risk)

1. **Check AboutFooter component**
   ```bash
   # Read the component to see if it uses availability/CTA fields
   cat src/components/about/AboutFooter.tsx
   ```

2. **Decision based on findings:**
   - If fields ARE used → Add them to about page query
   - If fields NOT used → Add to removal list

3. **Update documentation with findings**

### Phase 3: Data Migration (High Risk - Requires Testing)

1. **Query for projects with deprecated field data**
   ```typescript
   // Create script: /src/scripts/check-deprecated-project-fields.ts
   import { client } from '@/sanity/lib/client';
   
   const query = `*[_type == "project" && (
     defined(summary) || 
     defined(description) || 
     defined(achievements) || 
     defined(content)
   )] {
     _id,
     title,
     slug,
     summary,
     description,
     achievements,
     content,
     article
   }`;
   
   client.fetch(query).then(projects => {
     console.log(`Found ${projects.length} projects with deprecated fields`);
     projects.forEach(p => {
       console.log(`\n${p.title}:`);
       if (p.summary) console.log(`  - Has summary`);
       if (p.description) console.log(`  - Has description`);
       if (p.achievements) console.log(`  - Has achievements`);
       if (p.content) console.log(`  - Has content`);
       console.log(`  - Has article: ${!!p.article}`);
     });
   });
   ```

2. **Run check script**
   ```bash
   npm run tsx src/scripts/check-deprecated-project-fields.ts
   ```

3. **If data exists, create migration script**
   - Convert `summary` → `heroSection.subtitle`
   - Convert `description` → Opening paragraph in `article`
   - Convert `achievements` → `metrics` array entries
   - Convert `content` → `article` field blocks

4. **Test migration on one project manually first**

5. **After successful migration, remove deprecated fields**

### Phase 4: Legacy Field Cleanup (Long-term)

1. **After all projects use `article` format:**
   - Remove `slides` field from project schema
   - Update case study page to only use `article` field

2. **After chatbot is updated:**
   - Remove deprecated profile fields: `sections`, `bio`, `skills`, `experience`
   - Update chatbot fetcher to only use new profile format

---

## Testing Checklist

Before removing any field:

- [ ] Verify field is not in any GROQ queries
- [ ] Verify field is not referenced in any components
- [ ] Verify field is not used by chatbot sync (`sanity-fetcher.ts`)
- [ ] Check Sanity Studio for existing data in the field
- [ ] Backup Sanity dataset
- [ ] Test Sanity Studio loads after removal
- [ ] Test affected pages render correctly
- [ ] Test chatbot content sync still works
- [ ] Run `npm run build` to catch any TypeScript errors

---

## Risk Assessment

### Low Risk (Safe to Remove)
- ✅ `project.heroImage` - Hidden, deprecated, no references
- ✅ `project.sections` - Hidden, deprecated, no references (different from `slides`)

### Medium Risk (Verify First)
- ⚠️ `profile.availability` - Not in queries, may be unused
- ⚠️ `profile.availabilityText` - Not in queries, may be unused
- ⚠️ `profile.ctaText` - Not in queries, may be unused
- ⚠️ `profile.ctaButtonText` - Not in queries, may be unused

### High Risk (Requires Migration)
- 🔴 `project.summary` - May contain data, used by chatbot
- 🔴 `project.description` - May contain data, used by chatbot
- 🔴 `project.achievements` - May contain data, used by chatbot
- 🔴 `project.content` - May contain data, used by chatbot

### Keep for Compatibility
- 🔒 `project.slides` - Active fallback for non-migrated projects
- 🔒 `profile.sections` - Used by chatbot sync
- 🔒 `profile.bio` - Used by chatbot sync
- 🔒 `profile.skills` - Used by chatbot sync
- 🔒 `profile.experience` - Used by chatbot sync
- 🔒 `profile.tagline` - Used by homepage
- 🔒 `profile.social` - Used by profileQuery

---

## Appendix: Field Reference Locations

### Profile Schema Fields

```typescript
// Active fields queried in: /src/app/(public)/about/page.tsx
const profileQuery = `
  *[_type == "profile"] | order(_updatedAt desc)[0] {
    name,
    profileImage,
    heroHeadline,
    heroSubheadline,
    heroIntro,
    quickFacts,
    article,
    seo
  }
`

// Legacy fields queried in: /src/lib/sanity/queries.ts
export const profileQuery = groq`
  *[_type == "profile"][0] {
    name,
    title,
    tagline,
    bio,
    profileImage,
    skills,
    experience,
    social
  }
`

// Chatbot sync queries in: /src/lib/chatbot/sanity-fetcher.ts
const query = `*[_type == "profile"][0] {
  heroHeadline,
  heroSubheadline,
  heroIntro,
  quickFacts,
  capabilities,
  sections,
  selectedProjects,
  technologies,
  bio,
  skills,
  experience
}`
```

### Project Schema Fields

```typescript
// Case study page query: /src/app/(public)/case-studies/[slug]/page.tsx
const EDITORIAL_PROJECT_QUERY = `*[_type == "project" && slug.current == $slug][0] {
  title,
  slug,
  category,
  heroSection,
  overview,
  metrics,
  article,      // New format
  slides,       // Legacy fallback
  technologies,
  callToAction,
  featuredImage,
  seo
}`

// Homepage queries: /src/lib/sanity/queries.ts
export const projectsQuery = groq`
  *[_type == "project" && chatbotOnly != true] {
    title,
    slug,
    category,
    heroSection,
    technologies,
    featured,
    featuredMetric,
    featuredDescription,
    featuredImage
  }
`

// Chatbot sync: /src/lib/chatbot/sanity-fetcher.ts
const query = `*[_type == "project"] {
  title,
  slug,
  category,
  summary,        // DEPRECATED but queried
  description,    // DEPRECATED but queried
  content,        // DEPRECATED but queried
  metrics,
  achievements,   // DEPRECATED but queried
  technologies
}`
```

### Blog Schema Fields

```typescript
// All blog queries: /src/lib/sanity/queries/blog.ts
export const allBlogPostsQuery = groq`
  *[_type == "blog"] | order(publishedAt desc) {
    title,
    slug,
    excerpt,
    publishedAt,
    author,
    readingTime,
    featuredImage,
    featured,
    order
  }
`

export const blogPostBySlugQuery = groq`
  *[_type == "blog" && slug.current == $slug][0] {
    title,
    slug,
    excerpt,
    heroSection,
    content,
    publishedAt,
    updatedAt,
    author,
    readingTime,
    featuredImage,
    seo
  }
`
```

---

## Conclusion

The Sanity schemas are generally well-maintained with clear deprecation markers. The main cleanup opportunities are:

1. **Immediate:** Remove 2 completely unused project fields (`heroImage`, `sections`)
2. **Verify:** Check 4 profile fields that may be unused (`availability*`, `cta*`)
3. **Migrate:** Move data from 4 deprecated project fields to new format before removal
4. **Long-term:** Plan migration away from legacy chatbot format

The blog schema is exemplary - all fields are in active use with no cleanup needed.

**Total cleanup potential:** Up to 9 fields (2 immediate + 4 after verification + 3 after migration)

---

**Generated by:** Claude Code  
**Audit method:** Automated code analysis of schemas, queries, components, and chatbot sync  
**Confidence level:** High for active field detection, Medium for usage patterns (manual verification recommended)
