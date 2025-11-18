# Image Utility Refactor Plan

**Created:** 2025-11-17
**Status:** Planning
**Goal:** Centralize image sizing logic to improve maintainability and prevent inconsistencies

## Problem Statement

Currently, image sizing logic is duplicated across 8+ components, each with its own `urlFor()` call and parameters:

1. **EditorialHero** - `urlFor(image).width(1920).height(900).fit('crop').crop('top').quality(85).auto('format')`
2. **ArticleContent** - `urlFor(value).url()` (no sizing - causes huge images!)
3. **PortraitImageList** - `urlFor(image).url()` (no sizing)
4. **VisualCards** - `urlFor(image).width(800).quality(85).auto('format')`
5. **BlogContent** - `urlFor(value).width(1200).quality(85).auto('format')`
6. **BlogPostCard** - `urlFor(image).width(600).height(450).fit('crop').crop('top').quality(85).auto('format')`
7. **ImageGrid** - Various implementations
8. **HomePage** - `urlFor(image).width(600).height(450).fit('crop').crop('top').quality(85).auto('format')`

**Pain Points:**
- No single source of truth for image sizing
- Inconsistent quality/format settings
- Some components missing size constraints (causing huge images)
- Hard to make global changes (must update 8+ places)
- Easy to miss places during updates
- No standardization of presets

## Proposed Solution

Create a centralized image utility with predefined presets:

```typescript
// src/lib/sanity/image-builder.ts

import { urlFor } from '@/sanity/lib/client'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

export type ImagePreset =
  | 'hero'              // Large hero images (1920x900, crop top)
  | 'card'              // Card thumbnails (600x450, crop top)
  | 'article-full'      // Full-width article images (1200w)
  | 'article-float'     // Floating article images (800w)
  | 'portrait'          // Portrait images (800w)
  | 'visual-card'       // Visual cards (800w)
  | 'grid'              // Grid images (800w)

interface PresetConfig {
  width?: number
  height?: number
  fit?: 'clip' | 'crop' | 'fill' | 'fillmax' | 'max' | 'scale' | 'min'
  crop?: 'top' | 'bottom' | 'left' | 'right' | 'center'
  quality?: number
  auto?: 'format'
}

const PRESET_CONFIGS: Record<ImagePreset, PresetConfig> = {
  'hero': {
    width: 1920,
    height: 900,
    fit: 'crop',
    crop: 'top',
    quality: 85,
    auto: 'format'
  },
  'card': {
    width: 600,
    height: 450,
    fit: 'crop',
    crop: 'top',
    quality: 85,
    auto: 'format'
  },
  'article-full': {
    width: 1200,
    quality: 85,
    auto: 'format'
  },
  'article-float': {
    width: 800,
    quality: 85,
    auto: 'format'
  },
  'portrait': {
    width: 800,
    quality: 85,
    auto: 'format'
  },
  'visual-card': {
    width: 800,
    quality: 85,
    auto: 'format'
  },
  'grid': {
    width: 800,
    quality: 85,
    auto: 'format'
  }
}

export function buildImageUrl(
  image: SanityImageSource,
  preset: ImagePreset
): string {
  const config = PRESET_CONFIGS[preset]
  let builder = urlFor(image)

  if (config.width) builder = builder.width(config.width)
  if (config.height) builder = builder.height(config.height)
  if (config.fit) builder = builder.fit(config.fit)
  if (config.crop) builder = builder.crop(config.crop)
  if (config.quality) builder = builder.quality(config.quality)
  if (config.auto) builder = builder.auto(config.auto)

  return builder.url()
}

// Convenience exports for common patterns
export const getHeroImageUrl = (image: SanityImageSource) => buildImageUrl(image, 'hero')
export const getCardImageUrl = (image: SanityImageSource) => buildImageUrl(image, 'card')
export const getArticleImageUrl = (image: SanityImageSource, floating = false) =>
  buildImageUrl(image, floating ? 'article-float' : 'article-full')
```

**Benefits:**
- Single source of truth for all image sizing
- Easy to make global changes (update preset config)
- Consistent quality/format across site
- Self-documenting presets
- Type-safe preset names
- Prevents missing size constraints

## Implementation Plan

### Phase 1: Create Utility (30 min)
**Files to create:**
- `/src/lib/sanity/image-builder.ts` - Core utility with presets

**Tasks:**
1. Create image-builder.ts with preset configs
2. Export buildImageUrl() function
3. Export convenience functions
4. Add JSDoc comments
5. Test utility in isolation

**Verification:**
```typescript
import { buildImageUrl } from '@/lib/sanity/image-builder'
console.log(buildImageUrl(someImage, 'hero'))
// Should output: https://cdn.sanity.io/...?w=1920&h=900&fit=crop&crop=top&q=85&auto=format
```

### Phase 2: Update Case Study Components (45 min)
**Files to update:**
- `/src/components/case-study-editorial/EditorialHero.tsx`
- `/src/components/case-study-editorial/VisualCards.tsx`
- `/src/components/case-study-flowing/ArticleContent.tsx`
- `/src/components/case-study-flowing/PortraitImageList.tsx`

**Changes:**
```typescript
// BEFORE
const imageUrl = urlFor(value).url()

// AFTER
import { buildImageUrl } from '@/lib/sanity/image-builder'
const imageUrl = buildImageUrl(value, 'article-full')
```

**Verification:**
- Visit `/case-studies/aesop`
- Verify all images are properly sized
- Check that huge portrait image is now constrained
- Test all image styles (fullWidth, floatLeft, floatRight, floatRightPortrait)

### Phase 3: Update Blog Components (30 min)
**Files to update:**
- `/src/components/blog/BlogContent.tsx`
- `/src/components/blog/BlogPostCard.tsx`

**Changes:**
```typescript
// BlogPostCard - use 'card' preset
const imageUrl = buildImageUrl(post.featuredImage.asset, 'card')

// BlogContent - use 'article-full' or 'article-float'
const imageUrl = buildImageUrl(value, style === 'floatLeft' || style === 'floatRight' ? 'article-float' : 'article-full')
```

**Verification:**
- Visit `/blog`
- Check blog listing cards
- Visit individual blog posts
- Test all image styles

### Phase 4: Update Homepage (15 min)
**Files to update:**
- `/src/app/(public)/page.tsx`

**Changes:**
```typescript
// Featured blog image
import { buildImageUrl } from '@/lib/sanity/image-builder'
const imageUrl = buildImageUrl(featuredShowcase.featuredImage, 'card')
```

**Verification:**
- Visit homepage
- Check featured blog image
- Verify hero images (if any)

### Phase 5: Update Remaining Components (30 min)
**Files to update:**
- `/src/components/case-study-flowing/ImageGrid.tsx` (if exists)
- Any other components using `urlFor()`

**Strategy:**
- Search codebase for `urlFor(` to find all usages
- Update each to use buildImageUrl with appropriate preset
- Consider creating new presets if needed

**Search command:**
```bash
grep -r "urlFor(" src/components --include="*.tsx" --include="*.ts"
```

**Verification:**
- Visit all pages with images
- Check browser console for image loading errors
- Verify no broken images

### Phase 6: Clean Up and Documentation (20 min)
**Tasks:**
1. Remove unused imports of urlFor from components (if fully replaced)
2. Update component comments to reference presets
3. Add examples to image-builder.ts JSDoc
4. Update CLAUDE.md with new pattern
5. Consider deprecating direct urlFor usage in components

**Documentation to add to CLAUDE.md:**
```markdown
## Image Handling

Use the centralized image utility instead of calling `urlFor()` directly:

```typescript
import { buildImageUrl } from '@/lib/sanity/image-builder'

// Use predefined presets
const url = buildImageUrl(image, 'hero')      // Hero images
const url = buildImageUrl(image, 'card')       // Card thumbnails
const url = buildImageUrl(image, 'article-full') // Full-width article images

// Available presets: hero, card, article-full, article-float, portrait, visual-card, grid
```

This ensures consistent sizing, quality, and format across all images.
```

### Phase 7: Testing (30 min)
**Test matrix:**

| Page | Component | Image Type | Expected Size | Status |
|------|-----------|------------|---------------|--------|
| /case-studies/aesop | EditorialHero | Hero | 1920x900 | ⏳ |
| /case-studies/aesop | ArticleContent | Float Right | 800w | ⏳ |
| /case-studies/aesop | ArticleContent | Full Width | 1200w | ⏳ |
| /case-studies/aesop | PortraitImageList | Portrait | 800w | ⏳ |
| /blog | BlogPostCard | Card | 600x450 | ⏳ |
| /blog/[slug] | BlogContent | Full Width | 1200w | ⏳ |
| / | Featured Blog | Card | 600x450 | ⏳ |

**Manual testing:**
1. Visual inspection - no huge images
2. DevTools - check actual image dimensions loaded
3. Network tab - verify Sanity URLs have correct parameters
4. Multiple case studies and blog posts
5. Different image orientations (landscape, portrait, square)

**Automated testing (optional):**
```bash
npm run build  # Verify no TypeScript errors
```

## Rollback Plan

If issues arise:

1. **Partial rollback:** Revert specific component
   ```bash
   git checkout HEAD -- src/components/path/to/Component.tsx
   ```

2. **Full rollback:** Revert all changes
   ```bash
   git checkout HEAD -- src/lib/sanity/image-builder.ts
   git checkout HEAD -- src/components/
   ```

3. **Keep utility, don't use it yet:** Keep image-builder.ts but don't update components yet

## Success Criteria

- ✅ All images have appropriate size constraints
- ✅ No more huge images (like the Aesop portrait issue)
- ✅ Consistent quality (85) and auto-format across all images
- ✅ Single source of truth for image sizing
- ✅ Easy to make global changes (update preset, not 8+ components)
- ✅ Type-safe preset selection
- ✅ All existing functionality preserved
- ✅ Build passes with no errors

## Future Enhancements

1. **Responsive presets:** Different sizes for mobile/desktop
2. **WebP/AVIF support:** Leverage Sanity's auto-format more
3. **Lazy loading:** Add loading strategy hints
4. **Image component:** Wrap in a React component for easier usage
5. **Blur placeholder:** Generate low-quality placeholders
6. **Art direction:** Different crops for different breakpoints

## Notes

- Original issue: ArticleContent and PortraitImageList had no size constraints, causing huge images
- Previous fix attempt added sizing inline, but was fragmented and hard to maintain
- This refactor addresses the root cause: lack of centralized image handling
- All Sanity crop/hotspot data is preserved (already in queries from Phase 1 of previous attempt)
