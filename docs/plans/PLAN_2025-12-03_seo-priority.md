# Plan: SEO OG Image Priority Fix

**Date:** 2025-12-03
**Tags:** seo, metadata, og-image, social-sharing

## Objective

Update the metadata generation logic to prioritize `seo.ogImage` when set, allowing custom Open Graph images to override the default `featuredImage`.

## Background

Currently, when a user sets a custom OG image in the SEO section of a blog post or case study, it is ignored. The `generateSanityMetadata` function in `src/lib/sanity/metadata.ts` only checks:

1. `featuredImage` (from the document)
2. `globalSettings.defaultOgImage` (from global SEO settings)
3. Hardcoded fallback

The `seo.ogImage` field exists in the Sanity schema and is passed to the function, but never used in the image priority chain.

## Requirements

### Must Have
- `seo.ogImage` should take priority when explicitly set
- Existing fallback chain should remain intact for when `seo.ogImage` is not set

### Nice to Have
- No breaking changes to existing pages that rely on `featuredImage`

## Approach

Update `src/lib/sanity/metadata.ts` to add `seo.ogImage` as the first priority in the fallback chain:

**Current (lines 102-109):**
```typescript
let socialImageUrl: string | undefined = defaultImage

if (featuredImage?.asset) {
  socialImageUrl = urlFor(featuredImage).width(1200).height(630).url()
} else if (globalSettings.defaultOgImage?.asset) {
  socialImageUrl = urlFor(globalSettings.defaultOgImage).width(1200).height(630).url()
}
```

**Proposed:**
```typescript
let socialImageUrl: string | undefined = defaultImage

if (seo?.ogImage?.asset) {
  // Priority 1: Custom SEO OG image (explicit override)
  socialImageUrl = urlFor(seo.ogImage).width(1200).height(630).url()
} else if (featuredImage?.asset) {
  // Priority 2: Featured image from document
  socialImageUrl = urlFor(featuredImage).width(1200).height(630).url()
} else if (globalSettings.defaultOgImage?.asset) {
  // Priority 3: Global default OG image
  socialImageUrl = urlFor(globalSettings.defaultOgImage).width(1200).height(630).url()
}
```

Also update the alt text fallback to include `seo?.ogImage?.alt`:
```typescript
alt: seo?.ogImage?.alt || featuredImage?.alt || globalSettings.defaultOgImage?.alt || metaTitle,
```

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Breaking existing pages | Low | Low | Only affects pages where seo.ogImage is explicitly set |
| Schema mismatch | Low | Med | Verify seo.ogImage follows same structure as other images |

## Success Criteria
- [ ] Custom OG image set in Sanity SEO section appears in page meta tags
- [ ] Pages without custom OG image continue to use featuredImage
- [ ] Pages without either fall back to global default

## Open Questions
- None - straightforward priority chain update

## Files to Modify

| File | Change |
|------|--------|
| `src/lib/sanity/metadata.ts` | Add seo.ogImage to priority chain (lines 102-109, 148) |
