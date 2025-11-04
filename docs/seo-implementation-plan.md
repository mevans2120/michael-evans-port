# SEO Implementation Plan

**Project**: Add comprehensive SEO and social metadata to Michael Evans Portfolio
**Created**: November 4, 2025
**Status**: Planning

---

## Overview

This plan outlines the implementation of a comprehensive SEO and social metadata system using Sanity CMS. The work is broken into 5 phases that can be completed incrementally, with each phase building on the previous one.

**Goal**: Enable full control over SEO metadata (titles, descriptions, Open Graph, Twitter Cards) for all pages through Sanity Studio.

**Estimated Total Time**: 4-6 hours

---

## Phase 1: Foundation - Create SEO Schema (1 hour)

**Goal**: Set up the reusable SEO object schema in Sanity.

### Tasks

1. **Create SEO object schema** (`/sanity/schemas/objects/seo.ts`)
   - Basic SEO fields (metaTitle, metaDescription, keywords)
   - Open Graph fields (ogTitle, ogDescription, ogImage)
   - Twitter Card fields (twitterCard, twitterTitle, twitterDescription, twitterImage)
   - Advanced fields (canonicalUrl, noIndex)
   - Include validation rules and character limit warnings
   - Add preview configuration

2. **Create objects directory** (if doesn't exist)
   ```bash
   mkdir -p sanity/schemas/objects
   ```

3. **Register SEO schema**
   - Import `seoType` in `/sanity/schemas/index.ts`
   - Add to `schemaTypes` array

4. **Test schema in Sanity Studio**
   - Access Studio at `/studio`
   - Verify SEO schema appears (won't be usable yet)
   - Check field validation works

### Acceptance Criteria

- [ ] SEO schema file created with all fields
- [ ] Schema registered in index.ts
- [ ] No TypeScript errors
- [ ] Schema visible in Sanity Studio (in schema inspector)

### Files Modified

- `NEW: /sanity/schemas/objects/seo.ts` (~200 lines)
- `EDIT: /sanity/schemas/index.ts` (add import and registration)

---

## Phase 2: Document Schema Updates (30 minutes)

**Goal**: Add SEO field to all document types that need SEO control.

### Tasks

1. **Update Project schema** (`/sanity/schemas/project.ts`)
   ```typescript
   defineField({
     name: 'seo',
     title: 'SEO & Social',
     type: 'seo',
     description: 'Search engine and social media metadata for this project',
   }),
   ```

2. **Update AI Showcase schema** (`/sanity/schemas/aiShowcase.ts`)
   - Add same SEO field

3. **Update Homepage Hero schema** (`/sanity/schemas/homepageHero.ts`)
   - Add same SEO field

4. **Update Profile schema** (`/sanity/schemas/profile.ts`)
   - Add same SEO field

5. **Deploy schema changes**
   - Sanity schemas are deployed automatically on save in dev
   - Verify in Studio that SEO tab appears on documents

6. **Test in Sanity Studio**
   - Open a project document
   - Verify SEO field is visible and editable
   - Test field validation (character limits)

### Acceptance Criteria

- [ ] SEO field added to all 4 document types
- [ ] No TypeScript errors
- [ ] SEO field visible in Studio for each document type
- [ ] Field validation working (character limit warnings)

### Files Modified

- `EDIT: /sanity/schemas/project.ts` (add seo field)
- `EDIT: /sanity/schemas/aiShowcase.ts` (add seo field)
- `EDIT: /sanity/schemas/homepageHero.ts` (add seo field)
- `EDIT: /sanity/schemas/profile.ts` (add seo field)

---

## Phase 3: Metadata Helper Function (1 hour)

**Goal**: Create a reusable function to generate Next.js metadata from Sanity SEO data.

### Tasks

1. **Check if Sanity image helper exists**
   - Look for `urlFor` function in codebase
   - If missing, create image URL builder

2. **Create metadata helper** (`/src/lib/sanity/metadata.ts`)
   - `generateSanityMetadata()` function
   - Handle all metadata fields with fallbacks
   - Process images for social sharing
   - Generate Open Graph metadata
   - Generate Twitter Card metadata
   - Include TypeScript types for SEO data

3. **Add TypeScript types**
   - Create interface for `SanitySEO` type
   - Create interface for `GenerateMetadataOptions`
   - Export types for use in pages

4. **Test helper function**
   - Create simple test or manual verification
   - Ensure fallback logic works correctly

### Acceptance Criteria

- [ ] Helper function created with full TypeScript types
- [ ] Handles all SEO fields (basic, OG, Twitter)
- [ ] Proper fallback chain (seo → fallback → empty)
- [ ] Image URL generation working
- [ ] No TypeScript errors

### Files Modified

- `NEW: /src/lib/sanity/metadata.ts` (~150 lines)
- `EDIT: /src/lib/sanity/image.ts` (if urlFor needs to be created)

### Notes

- **Image URL Helper**: If `urlFor` doesn't exist, you'll need to create it using `@sanity/image-url`:
  ```typescript
  import imageUrlBuilder from '@sanity/image-url'
  import { client } from './client'

  const builder = imageUrlBuilder(client)
  export const urlFor = (source: any) => builder.image(source)
  ```

---

## Phase 4: Update Page Metadata (2-3 hours)

**Goal**: Replace hardcoded metadata with dynamic Sanity-powered metadata on all pages.

### 4A: Homepage (30 minutes)

1. **Update homepage query** (`/src/app/(public)/page.tsx`)
   - Add SEO fields to `homepageHeroQuery`

2. **Convert to generateMetadata**
   - Change from static `export const metadata` to async `generateMetadata` function
   - Fetch homepage data in metadata function
   - Use `generateSanityMetadata()` helper

3. **Test**
   - Check page source for meta tags
   - Verify Open Graph tags present
   - Test with browser dev tools

**Files**: `/src/app/(public)/page.tsx`

### 4B: About Page (30 minutes)

1. **Update profile query** (`/src/app/(public)/about/page.tsx`)
   - Add SEO fields to query

2. **Convert to generateMetadata**
   - Similar pattern to homepage

3. **Test**

**Files**: `/src/app/(public)/about/page.tsx`

### 4C: Case Studies Detail Page (30 minutes)

1. **Update project query** (`/src/app/(public)/case-studies/[slug]/page.tsx`)
   - Add SEO fields to `EDITORIAL_PROJECT_QUERY`

2. **Update existing generateMetadata**
   - Replace current simple implementation
   - Use `generateSanityMetadata()` helper

3. **Test with existing case study**

**Files**: `/src/app/(public)/case-studies/[slug]/page.tsx`

### 4D: Case Studies Index Page (30 minutes)

1. **Add static or dynamic metadata**
   - Determine if this needs CMS control
   - If yes, create a singleton schema for this page
   - If no, add static comprehensive metadata

**Files**: `/src/app/(public)/case-studies/page.tsx`

### 4E: AI Showcase Pages (30 minutes)

1. **Check if AI Showcase has detail pages**
   - Update query if needed
   - Add generateMetadata

2. **Update AI Showcase index page**
   - Add comprehensive metadata

**Files**:
- `/src/app/(public)/ai-showcase/page.tsx`
- `/src/app/(public)/ai-showcase/[slug]/page.tsx` (if exists)

### 4F: Root Layout (15 minutes)

1. **Update root metadata** (`/src/app/layout.tsx`)
   - Keep as fallback for pages without specific metadata
   - Ensure it's comprehensive

**Files**: `/src/app/layout.tsx`

### Acceptance Criteria

- [ ] All pages have generateMetadata or static metadata
- [ ] All pages include Open Graph fields
- [ ] All pages include Twitter Card fields
- [ ] No console errors
- [ ] Build completes successfully
- [ ] Meta tags visible in page source

### Files Modified

- `EDIT: /src/app/(public)/page.tsx`
- `EDIT: /src/app/(public)/about/page.tsx`
- `EDIT: /src/app/(public)/case-studies/[slug]/page.tsx`
- `EDIT: /src/app/(public)/case-studies/page.tsx`
- `EDIT: /src/app/(public)/ai-showcase/page.tsx`
- `EDIT: /src/app/layout.tsx`

---

## Phase 5: Content Population & Testing (1 hour)

**Goal**: Populate SEO data in Sanity Studio and validate implementation.

### Tasks

1. **Create default OG image**
   - Design 1200x630px default image for social sharing
   - Add to `/public/default-og-image.png`
   - Upload to Sanity as default

2. **Populate SEO data in Sanity Studio**
   - Homepage SEO fields
   - About page SEO fields
   - Each case study (at least top 3 priority)
   - AI Showcase pages

3. **Test with validation tools**
   - [ ] [Open Graph Preview](https://www.opengraph.xyz/) - Test each page
   - [ ] [Twitter Card Validator](https://cards-dev.twitter.com/validator) - Test each page
   - [ ] [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) - Test each page
   - [ ] [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) - Test each page

4. **Verify meta tags**
   - Check page source for all pages
   - Verify meta tags are correct
   - Verify images load properly

5. **Test fallback behavior**
   - Create a test page with NO SEO data
   - Verify fallbacks work correctly

6. **Performance check**
   - Run Lighthouse
   - Ensure metadata doesn't slow down page load
   - Check image sizes are optimized

### Acceptance Criteria

- [ ] Default OG image created and uploaded
- [ ] SEO data populated for all major pages
- [ ] All validation tools show correct previews
- [ ] Meta tags in page source match Sanity data
- [ ] Fallback behavior works correctly
- [ ] No performance regression

### Files Modified

- `NEW: /public/default-og-image.png`
- Sanity Studio content (no code changes)

---

## Optional: Phase 6 - Global SEO Settings (1 hour)

**Goal**: Create global SEO defaults that can be used as fallbacks site-wide.

### Tasks

1. **Create SEO Settings schema** (`/sanity/schemas/seoSettings.ts`)
   - Site name
   - Default meta description
   - Default OG image
   - Twitter handle
   - Default author

2. **Register schema**
   - Add to schema index
   - Configure as singleton

3. **Update metadata helper**
   - Fetch global settings
   - Use as ultimate fallback

4. **Populate in Studio**
   - Add global SEO defaults

### Acceptance Criteria

- [ ] Global SEO settings schema created
- [ ] Settings populated in Studio
- [ ] Helper function uses global defaults
- [ ] Fallback chain: page SEO → page defaults → global defaults

### Files Modified

- `NEW: /sanity/schemas/seoSettings.ts`
- `EDIT: /sanity/schemas/index.ts`
- `EDIT: /src/lib/sanity/metadata.ts`

---

## Implementation Order

### Recommended Sequence

```
Phase 1: SEO Schema
   ↓
Phase 2: Document Updates
   ↓
Phase 3: Metadata Helper
   ↓
Phase 4: Page Updates (do one page at a time)
   ↓
Phase 5: Content & Testing
   ↓
(Optional) Phase 6: Global Settings
```

### Can Be Done Incrementally

- Each phase can be completed and tested independently
- Phase 4 sub-phases can be done one at a time
- Can deploy after each phase (except Phase 1-2 which should be together)

---

## Testing Checklist

After each phase, verify:

- [ ] TypeScript compilation succeeds (`npm run build`)
- [ ] Dev server runs without errors (`npm run dev`)
- [ ] Sanity Studio accessible and functional
- [ ] No console errors in browser

After Phase 5:

- [ ] All pages have proper meta tags in source
- [ ] Open Graph preview tools show correct data
- [ ] Twitter Card preview tools show correct data
- [ ] Images load correctly in previews
- [ ] Fallback behavior works when SEO fields are empty
- [ ] Character limit warnings work in Sanity Studio

---

## Rollback Plan

If issues arise:

### After Phase 1-2
- Remove SEO schema from index.ts
- Delete seo.ts file
- Restart Sanity Studio

### After Phase 3
- Simply don't use the helper function
- No breaking changes

### After Phase 4
- Revert to static metadata on affected pages
- Keep SEO schema for future use

### After Phase 5
- Can simply not populate SEO data
- Pages will use fallbacks

---

## Success Metrics

- [ ] All major pages have custom SEO metadata
- [ ] Open Graph previews look professional
- [ ] Twitter Cards display correctly
- [ ] Google Search Console shows proper metadata
- [ ] Social shares show correct images and descriptions
- [ ] No performance regression
- [ ] Content team can easily update SEO without code changes

---

## Post-Implementation

### Documentation
- [ ] Update CLAUDE.md with SEO system documentation
- [ ] Document SEO best practices for content team
- [ ] Create guide for populating SEO fields in Studio

### Monitoring
- [ ] Set up Google Search Console (if not already)
- [ ] Monitor social sharing performance
- [ ] Track CTR improvements from better meta descriptions
- [ ] Set reminder to review/update SEO data quarterly

### Future Enhancements
- Structured data (JSON-LD)
- Automatic sitemap generation
- Automatic robots.txt management
- SEO preview in Sanity Studio (live preview of how it will look)
- AI-assisted meta description generation

---

## Resources

- [Next.js Metadata Documentation](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- Research document: `/docs/sanity-seo-research-2025-11-04.md`

---

## Dependencies

### Required
- Sanity Studio access
- Next.js 15+ with App Router
- `@sanity/image-url` package (check if installed)

### Nice to Have
- Image editing tool for creating OG images
- Access to Twitter/Facebook accounts for testing
- Google Search Console access

---

## Notes

- **No Breaking Changes**: This implementation is additive only. Existing pages will continue to work throughout.
- **Incremental Deployment**: Each phase can be deployed to production independently.
- **Content Population**: Phase 5 can be done gradually over time. Pages will use fallbacks until SEO data is populated.
- **Testing in Dev**: All testing can be done in development. Use tools that accept localhost URLs or deploy to preview branch.

---

## Questions to Resolve Before Starting

1. **OG Image Creation**: Who will create the default OG image and page-specific images?
2. **Twitter Handle**: What is the Twitter handle to use? (if applicable)
3. **Priority Pages**: Which pages are highest priority for SEO data population?
4. **Content Review**: Who should review SEO content before going live?
5. **Global Settings**: Do you want Phase 6 (global SEO settings) or skip it?

---

**Ready to Begin?** Start with Phase 1 when you're ready to implement.
