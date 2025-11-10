# AI Showcase Deprecation Plan (Simplified)
**Date:** November 10, 2025
**Status:** 📋 Planning
**Reason:** All AI Showcase content has been migrated to the Blog

## Executive Summary

The AI Showcase was created to highlight AI-assisted development projects. All content has been migrated to Blog, and the site is **not yet live**, so no redirects are needed. This plan focuses on removing AI Showcase infrastructure cleanly.

## Current State

**Content Migration:** ✅ Complete - All AI Showcase content is now in Blog

**Homepage:** Already configured correctly
- Featured showcase section displays blog posts (links to `/blog/[slug]`)
- "View all" CTA already points to `/blog`
- Just needs AI Showcase naming/variables cleaned up

## What Needs to Be Removed

### 1. Pages & Routes
- `src/app/(public)/ai-showcase/` - Entire directory (landing page + detail pages)

### 2. Sanity Schemas
- `sanity/schemas/aiShowcase.ts` - Schema definition
- `sanity/schemas/homepageHero.ts` - Remove `aiShowcaseSection` field
- `sanity/schemas/index.ts` - Remove aiShowcase import/registration

### 3. Queries
- `src/lib/sanity/queries.ts` - Remove AI Showcase queries
- `src/lib/sanity/queries/aiShowcase.ts` - Delete file (if exists)

### 4. API Routes
- `src/app/api/link-metadata/route.ts` - Remove aiShowcase type support

### 5. Homepage
- `src/app/(public)/page.tsx` - Rename "AI Showcase" section to "Featured Post" or similar
- Update variable names from `aiShowcase` to something generic
- Keep the display logic (it already works with blog!)

### 6. Components
- Check `src/components/chatbot/LinkPreview.tsx` for AI Showcase references

### 7. Scripts (Archive)
- `scripts/migrate-showcase-to-blog.ts`
- `scripts/migrate-ai-showcases.ts`
- `scripts/import-showcases/`
- `scripts/migrate-showcases.ndjson`

## Simple 3-Phase Plan

### Phase 1: Remove Code (1 hour)

**1.1 Delete AI Showcase Routes**
```bash
rm -rf src/app/\(public\)/ai-showcase/
```

**1.2 Update Homepage**

**File:** `src/app/(public)/page.tsx`

Changes needed:
1. Remove `featuredShowcase` from parallel fetch (line 28) - OR keep it if you want featured blog on homepage
2. Rename variables from `aiShowcase` to `featuredPost` or `latestPost`
3. Update section heading from "AI Showcase" to "Latest Post" or "Featured Post"
4. Keep all the display logic (it already works!)

**1.3 Remove from Link Metadata API**

**File:** `src/app/api/link-metadata/route.ts`

Remove:
- `SanityAIShowcase` interface (lines ~28-40)
- `type !== 'aiShowcase'` from validation (line 89)
- AI Showcase query block (lines ~116-132)
- `SanityAIShowcase` from type union (line 97)

**1.4 Remove Queries**

**File:** `src/lib/sanity/queries.ts`

Remove:
- `allAIShowcasesQuery` (lines ~224-237)
- `featuredAIShowcaseQuery` (lines ~240-260)

Delete if exists:
```bash
rm -f src/lib/sanity/queries/aiShowcase.ts
```

**1.5 Check Chatbot Component**

**File:** `src/components/chatbot/LinkPreview.tsx`

Search for and remove any AI Showcase link handling.

### Phase 2: Clean Up Sanity (30 minutes)

**2.1 Delete AI Showcase Documents (Optional)**

Since content is migrated to blog, you can delete the old AI Showcase documents:

```bash
# In Sanity Studio, or via script:
*[_type == "aiShowcase"] | delete
```

Or just leave them - they won't show up anywhere without the schema/pages.

**2.2 Remove Schema**

**File:** `sanity/schemas/index.ts`

Remove:
```typescript
import aiShowcase from './aiShowcase'

// Remove from array:
aiShowcase,
```

**File:** `sanity/schemas/aiShowcase.ts`

Move to archive or delete:
```bash
mkdir -p sanity/schemas/_archive
mv sanity/schemas/aiShowcase.ts sanity/schemas/_archive/
```

**2.3 Update Homepage Hero Schema**

**File:** `sanity/schemas/homepageHero.ts`

Remove `aiShowcaseSection` field entirely (lines ~157-240).

Remove `/ai-showcase` from internal link options (line 62):
```typescript
list: [
  { title: 'About', value: '/about' },
  { title: 'Blog', value: '/blog' },
  { title: 'Case Studies', value: '/case-studies' },
  { title: 'Home', value: '/' },
],
```

**2.4 Update Homepage Query**

**File:** `src/lib/sanity/queries.ts`

Remove `aiShowcaseSection` from `homepageHeroQuery`:
```groq
*[_type == "homepageHero"][0] {
  _id,
  tagline,
  description,
  heroCta { ... },
  selectedWorkSection { ... },
  // Remove: aiShowcaseSection { ... },
  seo { ... }
}
```

### Phase 3: Archive & Verify (30 minutes)

**3.1 Archive Scripts**
```bash
mkdir -p scripts/_archive
mv scripts/migrate-showcase-to-blog.ts scripts/_archive/
mv scripts/migrate-ai-showcases.ts scripts/_archive/
mv scripts/import-showcases/ scripts/_archive/
mv scripts/migrate-showcases.ndjson scripts/_archive/
```

**3.2 Build & Verify**
```bash
npm run build
```

Check for:
- No TypeScript errors
- All routes build successfully
- No references to aiShowcase remain

**3.3 Search for Remaining References**
```bash
grep -r "aiShowcase" src/
grep -r "ai-showcase" src/
grep -r "AI Showcase" src/
```

## Files Summary

### Delete
- `src/app/(public)/ai-showcase/` (entire directory)
- `src/lib/sanity/queries/aiShowcase.ts` (if exists)
- `src/types/aiShowcase.ts` (if exists)

### Archive
- `sanity/schemas/aiShowcase.ts` → `sanity/schemas/_archive/`
- `scripts/migrate-showcase-to-blog.ts` → `scripts/_archive/`
- `scripts/migrate-ai-showcases.ts` → `scripts/_archive/`
- `scripts/import-showcases/` → `scripts/_archive/`
- `scripts/migrate-showcases.ndjson` → `scripts/_archive/`

### Modify
- `src/app/(public)/page.tsx` - Rename AI Showcase section variables
- `src/lib/sanity/queries.ts` - Remove AI Showcase queries + homepageHeroQuery field
- `src/app/api/link-metadata/route.ts` - Remove aiShowcase type
- `sanity/schemas/homepageHero.ts` - Remove aiShowcaseSection field + link option
- `sanity/schemas/index.ts` - Remove aiShowcase import/registration

## Timeline: 2 hours total

- Phase 1: Remove Code (1 hour)
- Phase 2: Clean Up Sanity (30 min)
- Phase 3: Archive & Verify (30 min)

## Success Criteria

✅ Build succeeds with no errors
✅ No references to `aiShowcase` in active codebase
✅ Homepage displays correctly (featured post section works)
✅ Sanity Studio works without AI Showcase schema
✅ Old scripts archived for reference
