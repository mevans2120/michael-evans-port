# Plan: Blog & About Page Performance Optimization

**Date:** 2025-12-02
**Tags:** performance, images, lazy-loading, optimization

## Objective

Improve Vercel Speed Insights scores for `/about` (currently 41) and `/blog` (currently 34) pages to 80+ by implementing lazy loading and adding proper `sizes` attributes without changing existing image dimensions.

## Background

Investigation revealed poor LCP (5.27s) and FCP (3.49s) on these pages. Root causes:
1. Missing `loading="lazy"` on below-fold images
2. Missing `sizes` attributes causing browsers to download oversized images
3. Client-side navigation requiring hydration

**Important Constraint:** User wants to keep existing image dimensions - no cropping or resizing. The `sizes` attribute only tells the browser which image to download based on viewport; it doesn't crop images.

## Requirements

### Must Have
- Add `loading="lazy"` to BlogPostCard images (except first 1-2)
- Add `sizes` attribute to AboutHero profile image
- Add `sizes` attribute to PortraitImageList images
- Keep all existing image dimensions unchanged

### Nice to Have
- Convert BlogPostCard from useRouter to Link (removes client-side hydration requirement)
- Add `.auto('format')` to any missing image builders

## Approach

### Change 1: BlogPostCard - Add Lazy Loading

**File:** `/src/components/blog/BlogPostCard.tsx`

Add `loading` prop based on index (first 2 cards eager, rest lazy):

```tsx
<Image
  src={buildImageUrl(post.featuredImage, 'card')}
  alt={post.featuredImage.alt || ''}
  width={600}
  height={450}
  sizes="(max-width: 768px) 100vw, 33vw"
  loading={index < 2 ? 'eager' : 'lazy'}  // ADD THIS
  className="..."
/>
```

**Why this works:** First 2 posts are above-fold, need eager loading. Posts 3+ are below-fold and can lazy load.

---

### Change 2: AboutHero - Add Sizes Attribute

**File:** `/src/components/about/AboutHero.tsx`

Add `sizes` prop to match the existing CSS-controlled dimensions:

```tsx
<Image
  src={builder.image(profileImage).width(384).height(384).fit('crop').url()}
  alt={name}
  fill
  sizes="(max-width: 768px) 128px, (max-width: 1024px) 160px, 192px"  // ADD THIS
  className="rounded-full object-cover..."
  priority
/>
```

**Sizes calculation:**
- Mobile (`< 768px`): `w-32` = 128px
- Tablet (`768px-1024px`): `md:w-40` = 160px
- Desktop (`> 1024px`): `lg:w-48` = 192px

**Why this doesn't crop:** The image URL still requests 384x384 from Sanity CDN. The `sizes` attribute only tells the browser "the image will display at this size" so Next.js generates appropriately-sized srcset variants. Original aspect ratio preserved.

---

### Change 3: PortraitImageList - Add Sizes Attribute

**File:** `/src/components/case-study-flowing/PortraitImageList.tsx`

Add `sizes` prop:

```tsx
<Image
  src={imageUrl}
  alt={image.alt || ''}
  width={375}
  height={500}
  sizes="375px"  // ADD THIS - fixed width component
  loading="lazy"
  className="h-[500px] w-auto..."
/>
```

**Why 375px fixed:** The component uses `w-auto` with fixed `h-[500px]`, so the width is always approximately 375px regardless of viewport. This tells the browser to always use the ~375px variant.

---

### Optional Change 4: BlogPostCard - Convert to Link

**File:** `/src/components/blog/BlogPostCard.tsx`

Remove `'use client'` directive and convert from useRouter to Link:

```tsx
// Remove: 'use client'
import Link from 'next/link';
// Remove: import { useRouter } from 'next/navigation';

export function BlogPostCard({ post, index = 0 }: BlogPostCardProps) {
  // Remove: const router = useRouter();
  // Remove: const handleClick = () => { ... }

  return (
    <Link href={`/blog/${post.slug.current}`}>
      <article className="group cursor-pointer...">
        {/* ... existing content ... */}
      </article>
    </Link>
  );
}
```

**Impact:** Removes need for client-side hydration, enables server streaming.

## Files to Modify

| File | Change | Priority |
|------|--------|----------|
| `/src/components/blog/BlogPostCard.tsx` | Add `loading` prop, optionally convert to Link | High |
| `/src/components/about/AboutHero.tsx` | Add `sizes` attribute | High |
| `/src/components/case-study-flowing/PortraitImageList.tsx` | Add `sizes` attribute | Medium |

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Sizes attribute causes visual change | Low | Low | CSS controls actual display size; sizes only affects download |
| Lazy loading shows loading state | Low | Low | First 2 cards are eager; below-fold acceptable |
| Link refactor breaks keyboard nav | Low | Medium | Test thoroughly; Link has built-in accessibility |

## Success Criteria

- [ ] BlogPostCard images lazy load (verify in Network tab)
- [ ] AboutHero profile image downloads appropriate size for device
- [ ] PortraitImageList images download 375px variant
- [ ] No visual regression (images display same size as before)
- [ ] Build passes without errors
- [ ] Deploy and verify Vercel Speed Insights improves

## Open Questions

None - approach is straightforward and low-risk.

## Related Research

- [Blog & About Page Performance Research](/docs/research/RESEARCH_2025-12-02_blog-about-performance.md)
