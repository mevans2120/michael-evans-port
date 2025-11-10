# Featured Description Consolidation Plan
**Date:** November 10, 2025
**Status:** 📋 Planning

## Executive Summary

Consolidate `featuredDescription` and `heroSection.summary` into a single field to eliminate redundancy and simplify content management. **Recommendation: Keep `featuredDescription` as the primary field** and remove `heroSection.summary`.

## Current State Analysis

### Two Similar Fields

**1. `featuredDescription`** (Top-level field)
- **Location:** `project.featuredDescription`
- **Max Length:** 250 characters
- **Description:** "Brief description for homepage featured section"
- **Purpose:** Short, punchy description for cards/listings
- **Used In:**
  - Homepage featured case studies cards (src/app/(public)/page.tsx:87)
  - Case studies index page cards (src/app/(public)/case-studies/page.tsx:44)
  - Sanity queries for listings (src/lib/sanity/queries.ts:22)

**2. `heroSection.summary`** (Inside heroSection object)
- **Location:** `project.heroSection.summary`
- **Length:** 4 rows (longer, 2-3 sentences)
- **Description:** "Brief overview (2-3 sentences)"
- **Purpose:** Introductory text on detail page hero
- **Used In:**
  - Case study detail page metadata fallback (src/app/(public)/case-studies/[slug]/page.tsx:172)
  - AI Showcase detail page hero (src/app/(public)/ai-showcase/[slug]/AIShowcasePageMagazine.tsx:38-39)
  - Link metadata API (src/app/api/link-metadata/route.ts:168)
  - **NOT used in case study detail page UI** (uses `subtitle` instead)

### Current Fallback Chain

**Homepage/Listings:**
```typescript
description: project.featuredDescription || project.heroSection?.summary || ''
```

**Detail Page Metadata:**
```typescript
description: project.heroSection?.subtitle || project.heroSection?.summary
```

**Detail Page UI Hero:**
- Uses `heroSection.subtitle` (1 sentence tagline)
- Does **NOT** display `heroSection.summary` in current implementation

## Problem Statement

1. **Redundancy:** Two fields serving similar purposes (brief description)
2. **Confusion:** Unclear which field to fill out in CMS
3. **Inconsistent Usage:** `heroSection.summary` exists but isn't displayed in case study hero UI
4. **Length Confusion:** Different max lengths (250 chars vs 2-3 sentences) for similar content
5. **Metadata Overlap:** Both fields used in fallback chains for metadata

## Recommendation: Keep `featuredDescription`

### Why `featuredDescription` Over `heroSection.summary`?

✅ **Simpler Content Model**
- Top-level field, easier to find in CMS
- Not nested inside `heroSection` object
- Clear, specific name: "Featured Description"

✅ **Better Length Constraint**
- 250 character limit enforces conciseness
- Perfect for cards, listings, and meta descriptions (160 char recommended)
- Forces content editors to write punchy, compelling copy

✅ **Clear Purpose**
- Explicitly for featured/listing contexts
- Not ambiguous about when to use it

✅ **Less Breaking Changes**
- Already used in 3 active locations (homepage, case studies index, queries)
- `heroSection.summary` only used in fallbacks and AI Showcase (which can be updated)

✅ **SEO-Friendly**
- 250 chars fits well within meta description best practices (150-160 chars)
- Encourages writing descriptions optimized for search results

❌ **Why Not `heroSection.summary`?**
- Nested location harder to find
- Longer length (2-3 sentences) often too long for listings
- Not actually displayed in case study hero UI (dead field for case studies)
- Only actively used in AI Showcase hero (easy to migrate)

## Migration Plan

### Phase 1: Data Migration (Sanity Studio)

**Goal:** Copy `heroSection.summary` → `featuredDescription` where missing

**Migration Script:**
```javascript
// For each project:
// 1. If heroSection.summary exists and featuredDescription is empty
//    → Copy heroSection.summary to featuredDescription (truncate to 250 chars if needed)
// 2. Log any truncations for manual review
```

**Sanity Query to Find Projects:**
```groq
*[_type == "project" &&
  defined(heroSection.summary) &&
  (!defined(featuredDescription) || featuredDescription == "")
] {
  _id,
  title,
  "summary": heroSection.summary,
  "summaryLength": length(heroSection.summary),
  featuredDescription
}
```

### Phase 2: Code Updates

**2.1 Update Fallback Chains**

**File:** `/src/app/(public)/case-studies/page.tsx`
```typescript
// BEFORE
description: project.featuredDescription
  || project.heroSection?.summary
  || ''

// AFTER
description: project.featuredDescription || ''
```

**File:** `/src/app/(public)/page.tsx`
```typescript
// BEFORE (line 87)
description: project.featuredDescription || ''

// AFTER (no change, already correct)
description: project.featuredDescription || ''
```

**File:** `/src/app/(public)/case-studies/[slug]/page.tsx`
```typescript
// BEFORE (line 172) - generateMetadata
description: project.heroSection?.subtitle || project.heroSection?.summary

// AFTER
description: project.heroSection?.subtitle || project.featuredDescription
```

**File:** `/src/app/api/link-metadata/route.ts`
```typescript
// BEFORE (line 168)
description = ('summary' in data.heroSection ? data.heroSection.summary : data.heroSection.subtitle) || '';

// AFTER
description = data.heroSection?.subtitle || data.featuredDescription || '';
```

**2.2 Update AI Showcase (Special Case)**

AI Showcase **does** display `heroSection.summary` in the hero UI. Need to decide:

**Option A: Keep AI Showcase Using Summary**
- AI Showcase is different content type
- Can keep `heroSection.summary` for AI Showcase
- Only remove from `project` schema

**Option B: Use `featuredDescription` for AI Showcase Too**
- Consistency across content types
- Update AI Showcase schema to have `featuredDescription`
- Update hero component to use `featuredDescription`

**Recommendation: Option A** - AI Showcase is a different content type with different needs. Keep its `heroSection.summary` separate.

### Phase 3: Schema Cleanup

**3.1 Update Project Schema**

**File:** `/sanity/schemas/project.ts`

**Update `featuredDescription` field (lines 173-179):**
```typescript
defineField({
  name: 'featuredDescription',
  title: 'Featured Description',
  type: 'text',
  description: 'Brief description for listings, cards, and meta descriptions (used on homepage, case studies index, and SEO). Keep it punchy and compelling!',
  rows: 3,
  validation: (Rule) => Rule.required().max(250), // Make it required
}),
```

**Deprecate `heroSection.summary` field (lines 50-56):**
```typescript
{
  name: 'summary',
  title: 'Summary (DEPRECATED)',
  type: 'text',
  rows: 4,
  description: '⚠️ DEPRECATED: Use Featured Description instead (top-level field)',
  hidden: true, // Hide from UI
},
```

**3.2 Update Queries**

**File:** `/src/lib/sanity/queries.ts`

Ensure `featuredDescription` is included in all relevant queries:

```groq
// Already included (line 22):
featuredDescription,

// Verify it's in:
- projectsQuery ✅
- featuredProjectsQuery (add it)
- projectQuery ✅
- allFeaturedCaseStudiesQuery (verify)
```

### Phase 4: Metadata Optimization

**Goal:** Ensure `featuredDescription` serves all metadata needs effectively

**4.1 SEO Metadata Helper**

The `generateSanityMetadata()` helper already handles this well:

```typescript
// Priority chain (already implemented):
// 1. seo.metaDescription (custom SEO override)
// 2. description parameter (featuredDescription)
// 3. globalSettings.defaultMetaDescription
```

**4.2 Verify Metadata Usage**

**Detail Pages:**
```typescript
// Case Study Detail (recommended update)
generateSanityMetadata({
  seo: project.seo,
  title: `${project.title} | Michael Evans`,
  description: project.heroSection?.subtitle || project.featuredDescription, // ← Use featuredDescription as fallback
  path: `/case-studies/${slug}`,
  featuredImage: project.featuredImage,
})
```

**4.3 Content Guidance**

Update CMS help text to guide content editors:

**Featured Description Field:**
```
"Brief description for this project (250 chars max).

Used for:
• Homepage featured section
• Case studies listing page
• SEO meta description (if no custom SEO description set)
• Social sharing previews

Tips:
• Focus on the outcome or transformation
• Lead with the most compelling aspect
• Keep it under 160 chars for optimal SEO
• Make every word count!"
```

## Migration Impact Assessment

### Files to Update (Code)

**Critical (Must Update):**
1. `/src/app/(public)/case-studies/page.tsx` - Remove `heroSection.summary` fallback
2. `/src/app/(public)/case-studies/[slug]/page.tsx` - Use `featuredDescription` in metadata
3. `/src/app/api/link-metadata/route.ts` - Update description logic
4. `/sanity/schemas/project.ts` - Make `featuredDescription` required, hide `summary`

**Optional (Already Working, Can Optimize):**
5. `/src/lib/sanity/queries.ts` - Ensure all queries include `featuredDescription`

### Files to Update (Data)

**Sanity Studio:**
- Migrate existing `heroSection.summary` values to `featuredDescription` (script)
- Review any truncated values (manual)
- Validate all projects have `featuredDescription` filled

### Breaking Changes

**None** - All changes maintain backward compatibility:
- Old data still readable
- Fallback chains still work during migration
- Fields hidden, not removed

### Metadata Impact

**Before Migration:**
- Detail page metadata: `subtitle` → `summary` → (none)
- Listing metadata: `featuredDescription` → `summary` → (none)

**After Migration:**
- Detail page metadata: `subtitle` → `featuredDescription` → (none)
- Listing metadata: `featuredDescription` → (none)

**Improvement:**
✅ Single source of truth for descriptions
✅ Consistent metadata across detail and listing pages
✅ Better SEO (250 char limit encourages concise, keyword-rich descriptions)
✅ Clearer content workflow (one field to fill, not two)

## Testing Plan

### Pre-Migration Testing
1. **Audit current data:**
   - How many projects have `heroSection.summary`?
   - How many projects have `featuredDescription`?
   - How many have both?
   - Any conflicts or discrepancies?

2. **Test migration script:**
   - Run on staging dataset
   - Verify truncations are acceptable
   - Check for data loss

### Post-Migration Testing
1. **Visual regression:**
   - Homepage featured section
   - Case studies index page
   - Case study detail pages
   - AI Showcase pages (if updated)

2. **Metadata validation:**
   - Check meta descriptions in page source
   - Verify Open Graph descriptions
   - Test social sharing previews

3. **CMS usability:**
   - Verify `featuredDescription` is easy to find
   - Check help text is clear
   - Confirm validation works (required, max 250)

## Timeline Estimate

**Total: ~3-4 hours**

- **Phase 1: Data Migration** (1 hour)
  - Write migration script
  - Test on staging
  - Run on production
  - Manual review of truncations

- **Phase 2: Code Updates** (1.5 hours)
  - Update 4 files
  - Test locally
  - Build verification

- **Phase 3: Schema Cleanup** (0.5 hours)
  - Update schema
  - Deploy to Sanity Studio
  - Verify CMS UI

- **Phase 4: Testing** (1 hour)
  - Visual regression checks
  - Metadata validation
  - Production verification

## Risks & Mitigation

### Risk 1: Data Loss During Migration
**Mitigation:**
- Backup Sanity dataset before migration
- Only hide `heroSection.summary`, don't delete
- Keep fallback chains during transition period

### Risk 2: Truncated Descriptions
**Mitigation:**
- Log all truncations for manual review
- Flag any descriptions >250 chars before migration
- Content editor reviews and edits if needed

### Risk 3: SEO Impact
**Mitigation:**
- No SEO impact - meta descriptions staying the same length
- If anything, improvement (shorter = better for SEO)
- Monitor search console after deployment

### Risk 4: Breaking AI Showcase
**Mitigation:**
- Keep AI Showcase using `heroSection.summary` (different content type)
- Or migrate AI Showcase separately (optional)

## Success Criteria

✅ All projects have `featuredDescription` field filled
✅ No projects show broken/empty descriptions in listings
✅ Detail page metadata uses appropriate fallback chain
✅ Schema is cleaner (1 field instead of 2)
✅ CMS editors have clearer workflow
✅ No regressions in visual design
✅ SEO metadata remains effective

## Recommendation Summary

**Keep:** `featuredDescription` (top-level, 250 char limit, clear purpose)
**Deprecate:** `heroSection.summary` (nested, too long, not displayed in UI)

**Why This Makes Sense:**
- Simpler content model (one field, not two)
- Better length constraint (250 chars perfect for cards & SEO)
- Clearer purpose (explicitly for featured/listing contexts)
- Less breaking changes (already widely used)
- Improved content workflow (one place to edit)

**Next Steps:**
1. Get approval on this plan
2. Write data migration script
3. Test on staging
4. Execute migration
5. Update code
6. Deploy and verify
