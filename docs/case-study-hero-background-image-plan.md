# Implementation Plan: Social Image Background for Project Detail Hero

**Date:** November 11, 2025
**Status:** Planning Phase
**Goal:** Add social image as subtle background behind title text on case study detail pages

---

## Overview

Add the `featuredImage` as a subtle background layer behind the hero text on case study detail pages, similar to how featured case studies display on the homepage. This creates visual context while maintaining text readability.

---

## Research Summary

### Current State

**EditorialHero.tsx** (Case Study Detail):
- Clean text-focused hero (badge, title, subtitle, overview)
- No background image currently
- Magazine-style editorial layout
- Maximum width: 4xl (896px)

**Project Schema**:
- `featuredImage` - Main project image (line 878-893) with alt text
- Used for SEO/social sharing
- Already queried in case study page

**Case Study Page**:
- Query includes `featuredImage` (lines 124-127)
- Passes to metadata generation for social sharing
- Does NOT currently pass image to EditorialHero component

---

## Recommended Approach

### Image Field Selection

**Use: `featuredImage`**

**Rationale:**
1. Already exists in schema with proper structure (asset + alt text)
2. Already queried in case study page
3. Used for SEO/social sharing - perfect dual purpose
4. Avoids schema changes and migrations
5. Ensures consistency between social cards and hero visuals

---

## Implementation Steps

### 1. Update EditorialHero Component Interface

**File:** `/src/components/case-study-editorial/EditorialHero.tsx`

Add to interface:
```typescript
interface EditorialHeroProps {
  badge?: string
  title: string
  subtitle?: string
  overview?: {
    role?: string
    company?: string
    timeline?: string
  }
  // NEW: Add background image support
  backgroundImage?: {
    asset?: {
      _ref: string
      _type: string
    }
    alt?: string
  }
}
```

### 2. Update Component Structure

**Current:**
```tsx
<header className="max-w-4xl mx-auto px-6 pt-16 md:pt-24 pb-4 md:pb-6">
  {/* Content */}
</header>
```

**New:**
```tsx
<header className="relative overflow-hidden">
  {/* Background Image Layer - Decorative */}
  {backgroundImage?.asset && (
    <div className="absolute inset-0 -z-10">
      <Image
        src={urlFor(backgroundImage).width(1920).height(1080).fit('crop').quality(85).auto('format').url()}
        alt="" // Decorative image
        aria-hidden="true"
        fill
        priority
        className="object-cover opacity-10 md:opacity-15 dark:opacity-8 dark:md:opacity-10"
      />
      {/* Gradient Overlay - Ensures text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
    </div>
  )}

  {/* Content Layer */}
  <div className="relative max-w-4xl mx-auto px-6 pt-16 md:pt-24 pb-4 md:pb-6">
    {/* Existing content */}
  </div>
</header>
```

### 3. Update Case Study Page

**File:** `/src/app/(public)/case-studies/[slug]/page.tsx`

**Line ~196 - Add backgroundImage prop:**
```tsx
<EditorialHero
  badge={project.heroSection?.badge}
  title={project.title}
  subtitle={project.heroSection?.subtitle}
  overview={project.overview}
  backgroundImage={project.featuredImage} // ADD THIS LINE
/>
```

**Query:** Already includes `featuredImage` (lines 124-127) ✓ No changes needed

---

## CSS/Styling Details

### Image Layer
- `position: absolute` with `inset-0` (full coverage)
- `z-index: -10` (behind content)
- `object-fit: cover` (fill area, maintain aspect ratio)
- `opacity: 0.10` mobile → `0.15` desktop (light mode)
- `opacity: 0.08` mobile → `0.10` desktop (dark mode)
- Image dimensions: 1920x1080 (common hero ratio)

### Gradient Overlay
- `bg-gradient-to-b` (top to bottom)
- `from-background/60` → `via-background/80` → `to-background`
- Ensures text readability across all backgrounds
- Seamless transition to page content below

### Content Layer
- `position: relative` (stays above background)
- `z-index: auto` (normal stacking)
- No changes to existing text styles needed

---

## Responsive Considerations

**Mobile (< 768px):**
- Image opacity: 0.10 (lighter to avoid overwhelming small screens)
- Stronger gradient: `from-background/70` → `to-background`

**Tablet (768px - 1024px):**
- Image opacity: 0.15 (standard)
- Standard gradient

**Desktop (> 1024px):**
- Image opacity: 0.15 (slightly more visible)

**Dark Mode:**
- Reduced opacity (0.08 mobile, 0.10 desktop)
- Background already dark, so image should be more subtle

---

## Accessibility Considerations

### 1. Decorative Image Pattern
```tsx
<Image
  src={...}
  alt="" // Empty alt - decorative background
  aria-hidden="true" // Hide from screen readers
  fill
  priority
/>
```

### 2. Text Contrast
- WCAG AA minimum: 4.5:1 for normal text, 3:1 for large text
- Gradient overlay ensures consistent contrast
- Works with both light and dark backgrounds

### 3. Performance
- Use `priority` prop for LCP optimization (hero image)
- Next.js Image component handles optimization
- Sanity CDN caching

---

## Files to Modify

### Required Changes

1. **`/src/components/case-study-editorial/EditorialHero.tsx`**
   - Add `backgroundImage` prop to interface
   - Add background image rendering layer
   - Add gradient overlay
   - Wrap existing content in relative positioned div

2. **`/src/app/(public)/case-studies/[slug]/page.tsx`**
   - Pass `backgroundImage={project.featuredImage}` to EditorialHero (line ~196)
   - No query changes needed (already fetches `featuredImage`)

### No Changes Required
- `/sanity/schemas/project.ts` - No schema changes needed
- All queries already include `featuredImage`

---

## Testing Checklist

### Visual Testing
- [ ] Test with portrait images (should crop appropriately)
- [ ] Test with landscape images (should fill width)
- [ ] Test with high contrast images (text readability)
- [ ] Test with low contrast images (gradient works)
- [ ] Test without image (graceful fallback)

### Accessibility Testing
- [ ] Screen reader testing (image properly hidden)
- [ ] Keyboard navigation (focus indicators visible)
- [ ] Color contrast testing (WCAG AA compliance)
- [ ] Test with Windows High Contrast mode

### Responsive Testing
- [ ] Mobile: 375px, 414px
- [ ] Tablet: 768px, 1024px
- [ ] Desktop: 1280px, 1920px

### Performance Testing
- [ ] Lighthouse audit (LCP < 2.5s)
- [ ] Network throttling (3G/4G)
- [ ] Image load time monitoring

---

## Rollback Plan

If issues arise:

1. **Quick Rollback:** Remove `backgroundImage` prop from EditorialHero call
   - Instant revert to text-only hero
   - No data loss

2. **Component Rollback:** Revert EditorialHero.tsx changes
   - Restore from git history
   - No downstream effects

3. **Performance Issues:** Adjust image settings
   - Reduce quality from 85 to 70
   - Change dimensions from 1920x1080 to 1200x675
   - Increase opacity of gradient overlay

---

## Benefits

- **Visual Context:** Background image provides subtle context about project
- **Consistency:** Same image used for social sharing and hero
- **No Data Changes:** Uses existing `featuredImage` field
- **Backward Compatible:** Works with projects that don't have images
- **Performance:** Next.js Image optimization, priority loading
- **Accessible:** WCAG AA compliant, screen reader friendly

---

## Success Metrics

1. **Visual Impact:** Hero feels more immersive while maintaining readability
2. **Performance:** LCP remains < 2.5s, no layout shift
3. **Accessibility:** WCAG AA compliance maintained
4. **Flexibility:** Works with/without images gracefully

---

## Next Steps

1. Review and approve this plan
2. Implement changes to EditorialHero component
3. Update case study page to pass featuredImage
4. Test with existing case studies
5. Monitor performance and gather feedback
