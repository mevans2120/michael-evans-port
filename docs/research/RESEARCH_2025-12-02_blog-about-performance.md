# Research: Blog & About Page Performance Issues

**Date:** 2025-12-02
**Tags:** performance, lighthouse, lcp, images, optimization

## Summary

Investigation into poor Vercel Speed Insights scores for `/about` (41) and `/blog` (34) pages. Root causes identified: missing image `sizes` attributes, non-optimized images, lack of lazy loading, and client-side navigation patterns. The homepage scores 94 while these pages significantly underperform.

## Key Questions

- Why are `/about` and `/blog` scoring 41 and 34 respectively in Vercel Speed Insights?
- What is causing the high LCP (5.27s) and FCP (3.49s)?
- What optimizations can bring these pages to 90+ RES scores?

## Current Performance Metrics

| Metric | Value | Status |
|--------|-------|--------|
| Real Experience Score | 56 | Needs Improvement |
| First Contentful Paint | 3.49s | Poor |
| Largest Contentful Paint | 5.27s | Poor |
| Interaction to Next Paint | 400ms | Moderate |
| Cumulative Layout Shift | 0 | Good |
| Time to First Byte | 0.22s | Good |

**Route Breakdown:**
| Route | Score | Status |
|-------|-------|--------|
| `/` | 94 | Great |
| `/case-studies/[slug]` | 100 | Great |
| `/blog/[slug]` | 56 | Needs Improvement |
| `/case-studies` | 61 | Needs Improvement |
| `/about` | 41 | Poor |
| `/blog` | 34 | Poor |

## Findings

### Finding 1: /about Page - Missing Image `sizes` Attributes

**Location:** `/src/components/about/AboutHero.tsx`, line 69

The profile image uses `fill` layout without a `sizes` prop:
```tsx
<Image
  src={builder.image(profileImage).width(384).height(384).fit('crop').url()}
  alt={name}
  fill
  className="rounded-full object-cover..."
  priority
/>
```

**Impact:** Browser downloads oversized images on mobile devices.

**Fix:** Add `sizes="(max-width: 768px) 192px, (max-width: 1024px) 240px, 288px"`

---

### Finding 2: /about Page - PortraitImageList Missing `sizes`

**Location:** `/src/components/case-study-flowing/PortraitImageList.tsx`, lines 38-45

```tsx
<Image
  src={imageUrl}
  alt={image.alt || ''}
  width={375}
  height={500}
  loading="lazy"
  className="h-[500px] w-auto..."
/>
```

**Impact:** Mobile users download desktop-sized images.

**Fix:** Add `sizes="(max-width: 768px) 100vw, 375px"`

---

### Finding 3: /about Page - Plain `<img>` for fullWidth Images

**Location:** `/src/components/case-study-flowing/ArticleContent.tsx`, lines 64-68

```tsx
<img
  src={imageUrl}
  alt={value.alt || ''}
  loading="lazy"
  className="w-full h-auto..."
/>
```

**Impact:** No Next.js Image optimization, no WebP conversion, no responsive sizing.

**Fix:** Convert to Next/Image with proper `width`, `height`, and `sizes` props.

---

### Finding 4: /about Page - ImageCarouselLightbox Fixed 1920x1080

**Location:** `/src/components/ImageCarouselLightbox.tsx`, lines 166-170

```tsx
const imageUrl = urlFor(image)
  .width(1920)
  .height(1080)
  .fit('max')
  .url()
```

**Impact:** Always loads high-res 1920x1080 images regardless of device. Missing `.auto('format')` for modern format optimization.

**Fix:** Add `.auto('format')` and consider responsive breakpoints.

---

### Finding 5: /blog Page - Missing Lazy Loading on Cards

**Location:** `/src/components/blog/BlogPostCard.tsx`, lines 62-69

```tsx
<Image
  src={buildImageUrl(post.featuredImage, 'card')}
  alt={post.featuredImage.alt || ''}
  width={600}
  height={450}
  sizes="(max-width: 768px) 100vw, 33vw"
  className="..."
/>
```

**Impact:** All featured images load immediately, even below-fold images.

**Fix:** Add `loading="lazy"` except for the first 1-2 cards.

---

### Finding 6: /blog Page - Client Component for Navigation

**Location:** `/src/components/blog/BlogPostCard.tsx`, line 1

The entire card component is marked `'use client'` just for `useRouter().push()` navigation.

**Impact:**
- Card rendered client-side, not streamed
- Requires hydration for simple navigation
- Could use Next.js `<Link>` component instead

**Fix:** Replace useRouter with wrapping in `<Link>` component.

---

### Finding 7: /blog Page - No Pagination

**Location:** `/src/lib/sanity/queries/blog.ts`, line 8

```groq
*[_type == "blog"] | order(publishedAt desc) {...}
```

**Impact:** Fetches ALL blog posts without limit. As blog grows, all images must download.

**Fix (Future):** Add pagination or limit query, implement infinite scroll.

## Recommendations

### Priority 1: Quick Wins (High Impact, Low Effort)

1. **Add `loading="lazy"` to BlogPostCard images** - `/src/components/blog/BlogPostCard.tsx`
2. **Add `sizes` to AboutHero profile image** - `/src/components/about/AboutHero.tsx`
3. **Add `sizes` to PortraitImageList images** - `/src/components/case-study-flowing/PortraitImageList.tsx`

### Priority 2: Image Optimization (Medium Effort)

4. **Convert fullWidth `<img>` to Next/Image** - `/src/components/case-study-flowing/ArticleContent.tsx`
5. **Add `.auto('format')` to ImageCarouselLightbox** - `/src/components/ImageCarouselLightbox.tsx`

### Priority 3: Structural Improvements (Higher Effort)

6. **Replace useRouter with Link in BlogPostCard** - `/src/components/blog/BlogPostCard.tsx`
7. **Consider blog pagination** - Future optimization for scale

## Next Steps

- [ ] Add `loading="lazy"` to BlogPostCard featured images (except first 2)
- [ ] Add `sizes` attribute to AboutHero profile image
- [ ] Add `sizes` attribute to PortraitImageList images
- [ ] Convert fullWidth article images from `<img>` to Next/Image
- [ ] Add `.auto('format')` to ImageCarouselLightbox
- [ ] Refactor BlogPostCard to use Link instead of useRouter
- [ ] Deploy and re-test with Vercel Speed Insights

## Critical Files to Modify

| File | Changes |
|------|---------|
| `/src/components/blog/BlogPostCard.tsx` | Add lazy loading, convert to Link |
| `/src/components/about/AboutHero.tsx` | Add sizes attribute |
| `/src/components/case-study-flowing/PortraitImageList.tsx` | Add sizes attribute |
| `/src/components/case-study-flowing/ArticleContent.tsx` | Convert img to Next/Image |
| `/src/components/ImageCarouselLightbox.tsx` | Add .auto('format') |

## References

- [Next.js Image Optimization](https://nextjs.org/docs/pages/building-your-application/optimizing/images)
- [Web.dev LCP Guide](https://web.dev/lcp/)
