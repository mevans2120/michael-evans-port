# Plan: Related Posts Component — Blog Detail Pages

**Date:** 2025-12-03
**Tags:** blog, components, related-posts, ux, navigation, sanity

## Objective

Add a "Related Posts" section to blog detail pages that recommends other blog posts to readers, mirroring the functionality and visual design of the existing `ViewMoreProjects` component on case study pages.

## Background

Case study pages have a well-designed "View More Projects" section that:
- Is fully CMS-configurable via Sanity
- Supports multiple selection strategies (random, related, recent, curated)
- Uses consistent `LinkPreview` card treatment
- Includes optional CTA button and animations

Blog detail pages currently end abruptly after the content with no navigation to other posts. Adding a related posts section will:
- Increase reader engagement and time on site
- Help readers discover relevant content
- Create consistent UX between case studies and blog

## Requirements

### Must Have
- Related posts section at the bottom of blog detail pages
- CMS-configurable settings (heading, post count, selection strategy)
- At least 2 selection strategies: Recent and Random
- Visual consistency with ViewMoreProjects component
- Exclude current post from recommendations

### Nice to Have
- "Related by badge" strategy (match `heroSection.badge`)
- "Featured" strategy (posts with `featured: true`)
- Curated list option for manual selection
- Priority weighting for random selection
- Optional CTA button ("View All Posts")
- Stagger animations

## Approach

### Phase 1: Sanity Schema
Create `relatedPostsSettings` singleton document type mirroring `viewMoreProjectsSettings`.

### Phase 2: Selection Logic
Create `blog-selection.ts` adapting `project-selection.ts` for blog content.

### Phase 3: Components
Create server and client components following the ViewMoreProjects pattern.

### Phase 4: Integration
Add component to blog detail page and register Sanity schema.

## Files to Create

| File | Purpose |
|------|---------|
| `sanity/schemas/relatedPostsSettings.ts` | CMS settings schema |
| `src/lib/sanity/queries/relatedPosts.ts` | GROQ queries |
| `src/lib/blog-selection.ts` | Selection algorithms |
| `src/components/related-posts/RelatedPosts.tsx` | Server component |
| `src/components/related-posts/RelatedPostsClient.tsx` | Client component |
| `src/components/related-posts/index.ts` | Barrel export |

## Files to Modify

| File | Change |
|------|--------|
| `sanity.config.ts` | Register relatedPostsSettings schema |
| `src/app/(public)/blog/[slug]/page.tsx` | Add RelatedPosts component |

## Implementation Details

### 1. Sanity Schema (`relatedPostsSettings.ts`)

```typescript
// Key differences from viewMoreProjectsSettings:
- References 'blog' instead of 'project'
- Default heading: "Continue Reading"
- Default strategy: 'recent' (not 'random')
- Add 'featured' strategy option
- Match by 'heroSection.badge' for related strategy
```

### 2. Selection Strategies

| Strategy | Logic |
|----------|-------|
| `recent` | Order by `publishedAt` desc, exclude current |
| `random` | Seeded random based on current slug |
| `related` | Match `heroSection.badge`, fallback to recent |
| `featured` | Filter by `featured: true`, then by order |
| `curated` | Use manually selected references |

### 3. Component Structure

```
<RelatedPosts currentSlug={slug}>
  ├── Fetch settings from Sanity
  ├── Get posts based on strategy
  └── <RelatedPostsClient>
        ├── Section header with gradient ornament
        ├── Grid of LinkPreview cards
        └── Optional CTA button
```

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| No blog posts to show | Low | Low | Graceful null return if <2 posts exist |
| Performance impact | Low | Low | Use cachedSanityFetch with tags |
| Schema migration | Low | Med | Schema is additive, no breaking changes |
| Visual inconsistency | Low | Med | Reuse ViewMoreProjectsClient patterns exactly |

## Success Criteria

- [ ] Related posts section appears on all blog detail pages
- [ ] Settings configurable in Sanity Studio
- [ ] At least 3 selection strategies work correctly
- [ ] Current post is never shown in recommendations
- [ ] Visual design matches case study ViewMoreProjects
- [ ] Build passes with no TypeScript errors
- [ ] Component gracefully handles edge cases (no posts, disabled)

## Open Questions

- Should we share a generic `RelatedContent` component between blog and case studies? (Decision: No, keep separate for flexibility - can abstract later if patterns stabilize)
- Default number of posts to show? (Recommendation: 3, same as case studies)

## Related Research

- [RESEARCH_2025-12-03_related-posts-component.md](../research/RESEARCH_2025-12-03_related-posts-component.md) - Detailed analysis of existing ViewMoreProjects implementation and recommendations
