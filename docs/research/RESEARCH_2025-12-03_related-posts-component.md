# Research: Related Posts Component for Blog Detail Pages

**Date:** 2025-12-03
**Tags:** blog, components, related-posts, ux, navigation

## Summary

Research for adding a "Related Posts" component to blog detail pages, modeled after the existing `ViewMoreProjects` component on case study pages. The current implementation is well-architected with CMS-configurable settings, multiple selection strategies, and reusable UI patterns that can be adapted for blog posts with minimal effort.

## Key Questions

- What is the current implementation pattern for case study related content?
- What changes are needed for blog posts?
- Should we share code or create separate components?
- What selection strategies make sense for blog posts?

## Findings

### 1. Current ViewMoreProjects Architecture

The case study "related content" feature uses a well-designed pattern:

**Components:**
- `ViewMoreProjects.tsx` - Server component that fetches settings and projects
- `ViewMoreProjectsClient.tsx` - Client component that renders the UI
- Uses `LinkPreview` component for consistent card treatment

**Sanity Schema:**
- `viewMoreProjectsSettings.ts` - Singleton document for CMS configuration
- Supports: heading, subheading, project count (1-6), layout style, selection strategy
- Selection strategies: random, related (by category), recent, curated
- Optional CTA button with customizable text/link/style
- Animation settings (stagger delay)

**Selection Logic:**
- `src/lib/project-selection.ts` - Sophisticated selection algorithms
- Uses seeded random for consistent results per page
- Supports priority weighting and exclusions

**Pros:**
- Fully CMS-configurable
- Multiple selection strategies
- Reusable patterns
- Good separation of concerns (server/client components)

**Cons:**
- Tightly coupled to "project" content type
- Would need adaptation for blog posts

### 2. Blog Page Current State

**File:** `src/app/(public)/blog/[slug]/page.tsx`

The blog detail page currently:
- Renders `BlogLayout` > `BlogHero` > `BlogContent`
- Has no related posts section at the end
- Uses `cachedSanityFetch` for data fetching

**Blog Schema Fields Available for Matching:**
- `title` - Post title
- `heroSection.badge` - Category/topic badge (e.g., "AI Showcase")
- `publishedAt` - For recency-based selection
- `featured` - Boolean for featured posts
- `order` - Manual sort order
- `author` - Author name

### 3. Implementation Approaches

#### Option A: Reusable Shared Component (Recommended)

Create a generic `RelatedContent` component system that works for both projects and blog posts.

**Approach:**
1. Create `RelatedPosts.tsx` (server) + `RelatedPostsClient.tsx` (client)
2. Create `relatedPostsSettings` Sanity schema (similar to viewMoreProjectsSettings)
3. Create `src/lib/blog-selection.ts` with blog-specific selection logic
4. Add to blog detail page after `BlogContent`

**Pros:**
- Follows established patterns
- Full CMS control
- Consistent UX with case studies
- Can evolve independently if needed

**Cons:**
- Some code duplication (could abstract later)

#### Option B: Fully Generic System

Abstract the existing system to work with any content type.

**Pros:**
- DRY principle
- Single source of truth

**Cons:**
- Over-engineering for 2 content types
- More complex abstraction
- Harder to customize per content type

#### Option C: Simpler Hard-Coded Version

Skip Sanity settings, hard-code behavior in component.

**Pros:**
- Fastest to implement
- Less CMS complexity

**Cons:**
- No editorial control
- Inconsistent with case study pattern
- Harder to adjust later

### 4. Selection Strategies for Blog

For blog posts, these strategies make sense:

| Strategy | Description | Use Case |
|----------|-------------|----------|
| **Recent** | Most recently published | Default - keep readers engaged with fresh content |
| **Related by Badge** | Same `heroSection.badge` | Topic clusters (e.g., all "AI Showcase" posts) |
| **Featured** | Posts with `featured: true` | Highlight best content |
| **Random** | Seeded random selection | Variety, discovery |
| **Curated** | Manual selection | Editorial control |

**Recommendation:** Default to "Recent" with fallback to "Random" (blogs benefit from recency more than case studies).

### 5. Visual Design Considerations

The `ViewMoreProjectsClient` uses:
- Atmospheric blur orbs (accent color)
- Section header with gradient line ornament
- `LinkPreview` cards for consistent treatment
- Optional `OrnamentalCTA` button
- Stagger animations

For blog posts:
- Same visual pattern should work well
- `LinkPreview` already supports any URL path
- May want different default heading ("Continue Reading" vs "Explore More Work")

## Recommendations

### Recommended Approach: Option A (Parallel Implementation)

1. **Create new Sanity schema**: `relatedPostsSettings.ts`
   - Mirror `viewMoreProjectsSettings` structure
   - Change references from `project` to `blog`
   - Adjust default heading: "Continue Reading" or "More Posts"
   - Default strategy: `recent` (not `random`)

2. **Create blog selection logic**: `src/lib/blog-selection.ts`
   - Adapt `project-selection.ts` for blog content type
   - Use `heroSection.badge` for "related" matching (instead of category)
   - Add `featured` strategy option

3. **Create components**:
   - `src/components/related-posts/RelatedPosts.tsx` (server)
   - `src/components/related-posts/RelatedPostsClient.tsx` (client)
   - Can largely copy ViewMoreProjects structure

4. **Update blog page**:
   - Add `<RelatedPosts currentSlug={slug} />` after `BlogContent`

5. **Register schema**: Add to `sanity.config.ts`

### Estimated Effort

| Task | Complexity | Notes |
|------|------------|-------|
| Sanity schema | Low | Copy + adapt viewMoreProjectsSettings |
| Selection logic | Medium | Adapt project-selection.ts |
| Server component | Low | Copy + adapt ViewMoreProjects |
| Client component | Low | Copy + adapt ViewMoreProjectsClient |
| Blog page integration | Low | Add single component |
| **Total** | Medium | ~2-3 hours |

## Next Steps

- [ ] Create `sanity/schemas/relatedPostsSettings.ts`
- [ ] Register schema in `sanity.config.ts`
- [ ] Create `src/lib/sanity/queries/relatedPosts.ts`
- [ ] Create `src/lib/blog-selection.ts`
- [ ] Create `src/components/related-posts/RelatedPosts.tsx`
- [ ] Create `src/components/related-posts/RelatedPostsClient.tsx`
- [ ] Create `src/components/related-posts/index.ts`
- [ ] Add component to `src/app/(public)/blog/[slug]/page.tsx`
- [ ] Configure default settings in Sanity Studio

## References

- Existing implementation: `src/components/view-more-projects/`
- Sanity schema: `sanity/schemas/viewMoreProjectsSettings.ts`
- Selection logic: `src/lib/project-selection.ts`
- Blog page: `src/app/(public)/blog/[slug]/page.tsx`
