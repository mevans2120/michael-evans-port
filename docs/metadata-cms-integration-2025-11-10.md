# Metadata CMS Integration - Index Pages
**Date:** November 10, 2025
**Status:** ✅ Complete

## Summary

Migrated hardcoded metadata values on Blog and Case Studies index pages to pull from Sanity CMS, ensuring all page content and SEO metadata is editable through the CMS.

## Problem

The `/blog` and `/case-studies` index pages had hardcoded title, description, and SEO metadata values. While they used the `generateSanityMetadata()` helper, they passed hardcoded strings instead of pulling from CMS.

**Before:**
```typescript
// Blog page - hardcoded
export async function generateMetadata(): Promise<Metadata> {
  return generateSanityMetadata({
    title: 'Posts | Michael Evans',
    description: 'Insights on AI, creative technology, and building with AI-powered tools',
    path: '/blog',
  });
}

// Case Studies page - hardcoded
export async function generateMetadata(): Promise<Metadata> {
  return generateSanityMetadata({
    title: 'Case Studies | Michael Evans',
    description: 'Product launches, transformational projects...',
    path: '/case-studies',
  })
}
```

## Solution

Created two new singleton schemas to store index page content and SEO metadata, following the same pattern as the existing `homepageHero` schema.

### New Schemas Created

#### 1. Blog Index Page Schema
**File:** `/sanity/schemas/blogIndexPage.ts`

**Fields:**
- `title` - Page heading (default: "Posts")
- `description` - Subtitle text
- `seo` - SEO & Social metadata object

**Preview:** Shows as "Blog Index Page" with subtitle "Content and SEO for /blog"

#### 2. Case Studies Index Page Schema
**File:** `/sanity/schemas/caseStudiesIndexPage.ts`

**Fields:**
- `allCaseStudiesHeading` - Section heading (default: "All Case Studies")
- `allCaseStudiesDescription` - Section description
- `seo` - SEO & Social metadata object

**Preview:** Shows as "Case Studies Index Page" with subtitle "Content and SEO for /case-studies"

### Sanity Queries Added

Added to `/src/lib/sanity/queries.ts`:

```typescript
// Get blog index page content (singleton)
export const blogIndexPageQuery = groq`
  *[_type == "blogIndexPage"][0] {
    _id,
    title,
    description,
    seo {
      metaTitle,
      metaDescription,
      keywords,
      twitterCard,
      canonicalUrl,
      noIndex
    }
  }
`

// Get case studies index page content (singleton)
export const caseStudiesIndexPageQuery = groq`
  *[_type == "caseStudiesIndexPage"][0] {
    _id,
    allCaseStudiesHeading,
    allCaseStudiesDescription,
    seo {
      metaTitle,
      metaDescription,
      keywords,
      twitterCard,
      canonicalUrl,
      noIndex
    }
  }
`
```

### Page Updates

#### Blog Index Page
**File:** `/src/app/(public)/blog/page.tsx`

**Changes:**
1. Import `blogIndexPageQuery`
2. Fetch page data in `generateMetadata()`
3. Pass `seo` object to `generateSanityMetadata()`
4. Fetch page data in component
5. Use CMS values for title and description with fallbacks

**After:**
```typescript
export async function generateMetadata(): Promise<Metadata> {
  const { data: pageData } = await sanityFetch({
    query: blogIndexPageQuery,
  });

  return generateSanityMetadata({
    seo: pageData?.seo,
    title: 'Posts | Michael Evans',
    description: pageData?.description || 'Insights on AI...',
    path: '/blog',
  });
}

export default async function BlogPage() {
  const [{ data: posts }, { data: pageData }] = await Promise.all([
    sanityFetch({ query: allBlogPostsQuery }),
    sanityFetch({ query: blogIndexPageQuery }),
  ]);

  const title = pageData?.title || 'Posts';
  const description = pageData?.description || 'Insights on AI...';

  return (
    <h1>{title}</h1>
    <p>{description}</p>
    // ... rest of component
  )
}
```

#### Case Studies Index Page
**File:** `/src/app/(public)/case-studies/page.tsx`

**Changes:**
1. Import `caseStudiesIndexPageQuery`
2. Fetch page data in `generateMetadata()`
3. Pass `seo` object to `generateSanityMetadata()`
4. Fetch page data in component (parallel with other queries)
5. Use CMS values for heading and description with fallbacks

## Files Modified

### Created (3 files)
1. `/sanity/schemas/blogIndexPage.ts` - Blog index page schema
2. `/sanity/schemas/caseStudiesIndexPage.ts` - Case studies index page schema
3. `/docs/metadata-cms-integration-2025-11-10.md` - This documentation

### Modified (4 files)
1. `/sanity/schemas/index.ts` - Registered new schemas
2. `/src/lib/sanity/queries.ts` - Added queries for new schemas
3. `/src/app/(public)/blog/page.tsx` - Updated to fetch from CMS
4. `/src/app/(public)/case-studies/page.tsx` - Updated to fetch from CMS

## Benefits

✅ **Fully CMS-driven metadata** - All index pages now pull SEO data from Sanity
✅ **Content editor control** - Headings, descriptions, and metadata editable in CMS
✅ **Consistent pattern** - Matches existing `homepageHero` singleton pattern
✅ **Fallback values** - Graceful degradation if CMS data not available
✅ **SEO object support** - Full access to metaTitle, metaDescription, keywords, Twitter cards, canonical URLs
✅ **Build successful** - No TypeScript errors, production build passes

## Next Steps for Content Editors

After deploying these changes:

1. Go to Sanity Studio (`/studio`)
2. Create new documents:
   - **Blog Index Page** - Set title, description, and SEO metadata
   - **Case Studies Index Page** - Set heading, description, and SEO metadata
3. Publish both documents
4. Changes will immediately reflect on the live site

## Technical Notes

- Schemas use `defineType()` for document types and `defineField()` for fields
- Queries use singleton pattern `[0]` to get first/only document
- Page components use `Promise.all()` for parallel data fetching
- SEO object follows existing `seo` schema type from `/sanity/schemas/objects/seo.ts`
- All changes maintain existing fallback values for backward compatibility

## Metadata Status After Changes

**Overall:** 9/10 - Excellent CMS integration

✅ Homepage - CMS-driven
✅ About - CMS-driven
✅ Blog Index - CMS-driven (NEW)
✅ Blog Detail - CMS-driven
✅ Case Studies Index - CMS-driven (NEW)
✅ Case Studies Detail - CMS-driven
⚠️ AI Showcase Detail - Basic metadata (not using helper, but not a priority per user)
✅ Global SEO Settings - Available in CMS
✅ Featured Images - Supported for social sharing
✅ Open Graph/Twitter Cards - Auto-generated from CMS data
