# Next.js Image Component with Sanity CDN - Troubleshooting Guide

**Date:** 2025-11-13
**Context:** Research into why Next.js Image components with Sanity CDN images might not render visually

## Problem Statement

Next.js Image components with Sanity CDN images may not display visually even though:
1. The image element exists in the DOM
2. The src URL is valid and points to cdn.sanity.io
3. No console errors appear
4. The opacity is set to a visible value

## Current Configuration Status

### Next.js Config - CORRECTLY CONFIGURED ✓

**File:** `/next.config.ts`

```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'cdn.sanity.io',
    },
  ],
  formats: ['image/avif', 'image/webp'],
}
```

**Status:** Sanity CDN hostname is properly whitelisted. This is NOT the issue.

## Common Issues and Solutions

### 1. Missing `.url()` Call on urlFor() Builder

**MOST COMMON ISSUE** ⚠️

**Problem:** The `urlFor()` function returns an `ImageUrlBuilder` object, not a string. You MUST call `.url()` at the end.

**Bad:**
```tsx
// ❌ WRONG - Returns ImageUrlBuilder object
<Image src={urlFor(image)} alt="..." fill />
```

**Good:**
```tsx
// ✅ CORRECT - Returns string URL
<Image src={urlFor(image).width(800).url()} alt="..." fill />
```

**Codebase Status:** ✓ Most components correctly use `.url()`

### 2. Parent Container Missing `position: relative`

**CRITICAL FOR `fill` PROP** ⚠️

**Problem:** When using `fill` prop, Next.js Image uses `position: absolute`. The parent container MUST have `position: relative` (or `fixed`/`absolute`).

**Bad:**
```tsx
// ❌ WRONG - No position styling
<div>
  <Image src="..." alt="..." fill />
</div>
```

**Good:**
```tsx
// ✅ CORRECT - Parent has relative positioning
<div className="relative w-full h-64">
  <Image src="..." alt="..." fill />
</div>
```

**Codebase Status:** ✓ Most components use `relative` class on parent containers

### 3. Parent Container Missing Explicit Dimensions

**CRITICAL FOR `fill` PROP** ⚠️

**Problem:** Parent container needs explicit width AND height. Using `height: auto` or `height: 100%` often fails.

**Bad:**
```tsx
// ❌ WRONG - No explicit height
<div className="relative w-full">
  <Image src="..." alt="..." fill />
</div>
```

**Good Options:**

```tsx
// ✅ Option 1: Fixed dimensions
<div className="relative w-full h-64">
  <Image src="..." alt="..." fill />
</div>

// ✅ Option 2: Aspect ratio (preferred for responsive)
<div className="relative w-full aspect-video">
  <Image src="..." alt="..." fill />
</div>

// ✅ Option 3: Min-height
<div className="relative w-full min-h-[400px]">
  <Image src="..." alt="..." fill />
</div>
```

**Codebase Status:** ✓ Most components use `aspect-[16/9]` or `aspect-video` patterns

### 4. Z-Index Conflicts

**Problem:** Image might be rendered but hidden behind other elements.

**Check for:**
- Parent or sibling elements with higher z-index
- Negative z-index on image container
- Stacking context issues

**Solution:**
```tsx
// Ensure image is visible in stacking order
<div className="relative z-10">
  <Image src="..." alt="..." fill />
</div>

// Or for background images
<div className="absolute inset-0 -z-10">
  <Image src="..." alt="..." fill />
</div>
```

### 5. Missing `object-fit` Styling

**Problem:** Image might render but appear distorted or not fill the container properly.

**Solution:**
```tsx
// Add className with object-fit
<Image 
  src="..." 
  alt="..." 
  fill 
  className="object-cover" // or object-contain
/>
```

**Common object-fit values:**
- `object-cover` - Fills container, crops if needed (most common)
- `object-contain` - Fits entire image, may have letterboxing
- `object-fill` - Stretches to fill (distorts aspect ratio)

### 6. Opacity Too Low

**Problem:** Image rendered but opacity is so low it appears invisible.

**Check:**
```tsx
// Verify opacity value is visible
<Image 
  src="..." 
  alt="..." 
  fill 
  className="opacity-[0.12]" // This is very faint!
/>
```

**Recommended opacity ranges:**
- Background images: `opacity-10` to `opacity-30` (0.1 to 0.3)
- Featured images: `opacity-100` (1.0)
- Dark mode adjustments: Increase opacity by 5-10%

### 7. Duplicate Image URL Helpers

**CODEBASE-SPECIFIC ISSUE** ⚠️

**Problem:** This codebase has TWO `urlFor` implementations:

1. `/src/sanity/lib/client.ts` - Used by most components
2. `/src/sanity/lib/image.ts` - Uses proper TypeScript types

**Import inconsistency:**
```tsx
// Some components use:
import { urlFor } from '@/sanity/lib/client'

// Others use:
import { urlFor } from '@/sanity/lib/image'
```

**Recommendation:** Standardize on ONE implementation. The `/src/sanity/lib/image.ts` version has better TypeScript types.

## Working Examples from Codebase

### Example 1: CaseStudyScreenshots (Working Pattern)

```tsx
<div className="relative aspect-[16/10] rounded-xl overflow-hidden">
  <Image
    src={urlFor(screenshot.image.asset).url()}
    alt={screenshot.caption || ''}
    fill
    className="object-cover"
  />
</div>
```

**Why it works:**
✓ Parent has `relative` positioning
✓ Parent has explicit aspect ratio (`aspect-[16/10]`)
✓ `urlFor().url()` returns string
✓ `object-cover` ensures proper fill
✓ No z-index conflicts

### Example 2: AboutHero Profile Image (Working Pattern)

```tsx
<div className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48">
  <Image
    src={builder.image(profileImage).width(384).height(384).fit('crop').url()}
    alt={name}
    fill
    className="rounded-full object-cover"
    priority
  />
</div>
```

**Why it works:**
✓ Explicit width and height at all breakpoints
✓ `relative` positioning
✓ `.url()` called to get string
✓ `priority` for above-fold images
✓ Proper alt text

### Example 3: EditorialHero Background (Working Pattern)

```tsx
<div className="absolute inset-0 -z-10">
  <Image
    src={imageUrl}
    alt=""
    aria-hidden="true"
    fill
    priority
    className="object-cover opacity-[0.12] dark:opacity-[0.18]"
  />
  <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
</div>
```

**Why it works:**
✓ Parent stretches to fill (`absolute inset-0`)
✓ `-z-10` places it behind content
✓ `aria-hidden="true"` for decorative image
✓ Empty alt for decorative image
✓ Gradient overlay for readability

### Example 4: LinkPreview (Working Pattern)

```tsx
<div className="relative w-full md:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
  <Image
    src={metadata.imageUrl}
    alt={metadata.title}
    fill
    className="object-cover group-hover:scale-105 transition-transform duration-slow"
    onError={() => setImageError(true)}
  />
</div>
```

**Why it works:**
✓ Explicit width and height
✓ `relative` positioning
✓ Error handling with `onError`
✓ Background color fallback (`bg-muted`)
✓ Hover effect for interactivity

## Debugging Checklist

When an image doesn't render, check in this order:

1. **URL Format**
   ```bash
   # In browser console, check:
   console.log(imageUrl)
   # Should output: "https://cdn.sanity.io/images/..."
   # NOT: [object Object]
   ```

2. **Parent Container Computed Styles**
   ```javascript
   // In DevTools, select parent element and check:
   position: relative (or absolute/fixed)
   width: {some value} (not auto or 0)
   height: {some value} (not auto or 0)
   ```

3. **Image Element Computed Styles**
   ```javascript
   // In DevTools, select <img> element and check:
   position: absolute
   opacity: {visible value, e.g., 1 or 0.5}
   z-index: {reasonable value}
   width: {should fill parent}
   height: {should fill parent}
   ```

4. **Network Tab**
   - Check if image request was made
   - Check if request succeeded (200 status)
   - Check if image file size is reasonable

5. **Console Errors**
   - Look for Next.js Image optimization errors
   - Look for CORS errors (shouldn't happen with proper config)
   - Look for Sanity client errors

## Quick Fixes

### Fix 1: Image Not Showing (Most Common)

```tsx
// Before (likely broken)
<div className="w-full">
  <Image src={urlFor(image).url()} alt="..." fill />
</div>

// After (working)
<div className="relative w-full aspect-video">
  <Image 
    src={urlFor(image).url()} 
    alt="..." 
    fill 
    className="object-cover"
  />
</div>
```

**Changes:**
- Added `relative` positioning
- Added `aspect-video` for explicit dimensions
- Added `object-cover` for proper fill behavior

### Fix 2: Image Too Faint

```tsx
// Before (barely visible)
<Image 
  src="..." 
  alt="..." 
  fill 
  className="opacity-[0.08]" 
/>

// After (visible)
<Image 
  src="..." 
  alt="..." 
  fill 
  className="opacity-20 dark:opacity-30" 
/>
```

### Fix 3: Image Hidden Behind Content

```tsx
// Before (behind other elements)
<div className="absolute inset-0">
  <Image src="..." alt="..." fill />
</div>

// After (properly layered)
<div className="absolute inset-0 -z-10">
  <Image src="..." alt="..." fill />
</div>
```

## Best Practices

### 1. Always Use Aspect Ratios for Responsive Images

```tsx
// ✅ Good - Maintains aspect ratio
<div className="relative w-full aspect-video">
  <Image src="..." alt="..." fill className="object-cover" />
</div>

// ✅ Good - Multiple aspect ratios for different layouts
<div className="relative w-full aspect-square md:aspect-video">
  <Image src="..." alt="..." fill className="object-cover" />
</div>
```

### 2. Optimize Image Parameters

```tsx
// ✅ Good - Appropriate sizing and quality
<Image 
  src={urlFor(image)
    .width(1200)
    .height(800)
    .quality(85)
    .auto('format')
    .url()
  } 
  alt="..." 
  fill 
/>
```

### 3. Use Priority for Above-the-Fold Images

```tsx
// ✅ Good - Prioritizes hero images
<Image 
  src="..." 
  alt="..." 
  fill 
  priority 
  className="object-cover"
/>
```

### 4. Provide Fallback Background Color

```tsx
// ✅ Good - Shows color while loading
<div className="relative w-full aspect-video bg-muted">
  <Image src="..." alt="..." fill className="object-cover" />
</div>
```

### 5. Handle Loading and Error States

```tsx
const [imageError, setImageError] = useState(false)

return (
  <div className="relative w-full aspect-video bg-muted">
    {!imageError ? (
      <Image 
        src={imageUrl} 
        alt="..." 
        fill 
        className="object-cover"
        onError={() => setImageError(true)}
      />
    ) : (
      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
        Failed to load image
      </div>
    )}
  </div>
)
```

## Codebase-Specific Recommendations

### 1. Standardize Image URL Helper

**Current:** Two implementations of `urlFor()`

**Recommendation:** 
```typescript
// Use /src/sanity/lib/image.ts consistently
import { urlFor } from '@/sanity/lib/image'
// NOT: import { urlFor } from '@/sanity/lib/client'
```

### 2. Create Reusable Image Wrapper Component

**Recommendation:**
```tsx
// /src/components/ui/sanity-image.tsx
interface SanityImageProps {
  image: SanityImageSource
  alt: string
  aspectRatio?: 'video' | 'square' | 'portrait' | 'wide'
  priority?: boolean
  className?: string
}

export function SanityImage({ 
  image, 
  alt, 
  aspectRatio = 'video',
  priority,
  className 
}: SanityImageProps) {
  const aspectClasses = {
    video: 'aspect-video',
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    wide: 'aspect-[21/9]'
  }
  
  return (
    <div className={cn("relative w-full", aspectClasses[aspectRatio])}>
      <Image
        src={urlFor(image).width(1200).quality(85).auto('format').url()}
        alt={alt}
        fill
        priority={priority}
        className={cn("object-cover", className)}
      />
    </div>
  )
}
```

### 3. Add Image Loading States to CaseStudyScreenshots

**Current:** No loading indicator

**Recommendation:** Add skeleton loader while images load

### 4. Increase Opacity for Dark Mode Background Images

**Current:** Some background images use `opacity-[0.12]`

**Recommendation:** Increase to `dark:opacity-[0.18]` or higher for better visibility

## Additional Resources

- [Next.js Image Component Docs](https://nextjs.org/docs/app/api-reference/components/image)
- [Sanity Image URL Builder](https://www.sanity.io/docs/image-url)
- [Next.js Image Optimization](https://nextjs.org/docs/pages/building-your-application/optimizing/images)

## Summary

**Most Common Issue:** Parent container missing `position: relative` and/or explicit dimensions.

**Quick Fix:**
```tsx
// Wrap your Image component in a container with:
<div className="relative w-full aspect-video">
  <Image src={imageUrl} alt="..." fill className="object-cover" />
</div>
```

**Key Requirements for `fill` Prop:**
1. Parent has `position: relative` (or `absolute`/`fixed`)
2. Parent has explicit width AND height (use `aspect-*` utilities)
3. Image src is a string URL (call `.url()` on `urlFor()`)
4. Image has `object-cover` or `object-contain` class
5. No z-index conflicts hiding the image

