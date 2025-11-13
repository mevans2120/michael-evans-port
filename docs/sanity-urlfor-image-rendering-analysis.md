# Sanity urlFor() Image Rendering Issue - Root Cause Analysis

**Date:** November 13, 2025  
**Component:** EditorialHero  
**Issue:** Image URL generates correctly but image doesn't render visually

## Problem Summary

The EditorialHero component is receiving a Sanity image object and generating a URL via `urlFor()`, but the image is not rendering on screen despite:
- URL being generated successfully (visible in console/DOM)
- No errors in browser console
- Next.js Image component receiving the URL

## Root Cause: Incorrect Data Structure Passed to urlFor()

### The Issue

**Current (BROKEN) Implementation:**
```tsx
// EditorialHero.tsx - Lines 32-34
const imageUrl = backgroundImage?.asset
  ? urlFor(backgroundImage).width(1920).height(1080).quality(85).url()
  //         ^^^^^^^^^^^^^^^^ WRONG - passes full image object with asset property
  : null
```

**What urlFor() Expects:**
```tsx
// From @sanity/image-url documentation
urlFor(source)
// source should be the asset reference directly, NOT an object containing an asset property
```

### Why This Fails

When you query Sanity with `asset->`, you get this structure:
```typescript
{
  asset: {
    _id: "image-abc123",
    url: "https://cdn.sanity.io/..."
  },
  alt: "Description"
}
```

**When you pass this entire object to urlFor():**
```tsx
urlFor(backgroundImage) // backgroundImage = { asset: {...}, alt: "..." }
```

The `@sanity/image-url` builder looks for image reference properties at the root level, but finds `asset` as a nested object instead. It fails silently and returns a malformed URL.

**What urlFor() needs:**
```tsx
urlFor(backgroundImage.asset) // Pass the asset object directly
```

## Working Examples from Codebase

### 1. CaseStudyBackground.tsx (CORRECT)
```tsx
// Lines 7-13 - Receives image with asset property
interface CaseStudyBackgroundProps {
  image?: {
    asset?: {
      _id: string
      url: string
    }
    alt?: string
  }
}

// Line 23 - Passes FULL image object to urlFor()
const imageUrl = urlFor(image)  // ✅ WORKS because image has asset at root
  .width(1920)
  .height(1080)
  .quality(75)
  .url()
```

**Why this works:** The `image` parameter itself is the container object with `asset` as a direct property, which is the expected structure.

### 2. ArticleContent.tsx (CORRECT)
```tsx
// Line 46 - Passes asset directly
const imageUrl = urlFor(value.asset).url()  // ✅ WORKS - passes asset reference
```

### 3. VisualCards.tsx (CORRECT)
```tsx
// Line 34 - Passes card.image (which contains asset at root)
src={urlFor(card.image).width(800).url()}  // ✅ WORKS
```

### 4. BlogPostCard.tsx (CORRECT)
```tsx
// Line 62 - Passes asset directly
src={urlFor(post.featuredImage.asset)  // ✅ WORKS - passes asset reference
  .width(600).height(450).fit('crop').quality(85).auto('format').url()}
```

## The Pattern: Two Valid Approaches

### Approach 1: Pass the Image Object (with asset at root)
```tsx
interface Props {
  image?: {
    asset?: { _id: string; url: string }
    alt?: string
  }
}

// Usage
urlFor(image).width(800).url()
```

### Approach 2: Pass the Asset Reference Directly
```tsx
interface Props {
  backgroundImage?: {
    asset?: { _id: string; url: string }
    alt?: string
  }
}

// Usage
urlFor(backgroundImage.asset).width(800).url()
```

## EditorialHero Issue: Type Confusion

**Current interface:**
```tsx
backgroundImage?: {
  asset?: {
    _id: string
    url: string
  }
  alt?: string
}
```

**Current usage:**
```tsx
urlFor(backgroundImage)  // ❌ WRONG - backgroundImage has asset nested
```

**The prop name `backgroundImage` suggests it's the image object, but the usage expects `asset` to be at the root level.**

## The Fix

### Option 1: Pass asset directly (Recommended)
```tsx
const imageUrl = backgroundImage?.asset
  ? urlFor(backgroundImage.asset)  // ✅ Changed: pass .asset instead of full object
      .width(1920)
      .height(1080)
      .quality(85)
      .url()
  : null
```

### Option 2: Rename prop to match CaseStudyBackground pattern
```tsx
// Interface (rename backgroundImage to image)
interface EditorialHeroProps {
  image?: {  // Renamed from backgroundImage
    asset?: {
      _id: string
      url: string
    }
    alt?: string
  }
}

// Usage (keep as-is since it would now receive image at root)
const imageUrl = image?.asset
  ? urlFor(image).width(1920).height(1080).quality(85).url()
  : null
```

## Why Silent Failure?

The `@sanity/image-url` library doesn't throw errors for invalid input - it attempts to build a URL regardless. When the structure doesn't match expectations:
1. Builder tries to extract image reference from wrong location
2. Falls back to constructing a URL with missing/incorrect parameters
3. Returns a technically valid URL string
4. Browser attempts to load the URL but gets 404 or invalid response
5. Next.js Image component fails silently (shows nothing)

## Recommended Solution

**Use Option 1** (pass asset directly) because:
1. Minimal change required (one line)
2. Matches working patterns in ArticleContent, BlogPostCard, etc.
3. Prop interface stays semantic (`backgroundImage` is clear)
4. No caller changes needed
5. Consistent with how Sanity references work

## Implementation

**File:** `/src/components/case-study-editorial/EditorialHero.tsx`

**Change Line 33 from:**
```tsx
? urlFor(backgroundImage).width(1920).height(1080).quality(85).url()
```

**To:**
```tsx
? urlFor(backgroundImage.asset).width(1920).height(1080).quality(85).url()
```

**Complete fixed code:**
```tsx
export function EditorialHero({ badge, title, subtitle, overview, backgroundImage }: EditorialHeroProps) {
  // Build image URL - use urlFor helper which expects the asset reference
  const imageUrl = backgroundImage?.asset
    ? urlFor(backgroundImage.asset)  // ✅ FIXED: Pass asset reference, not full object
        .width(1920)
        .height(1080)
        .quality(85)
        .url()
    : null

  return (
    <header className="relative overflow-hidden min-h-[70vh] flex items-center">
      {/* Background Image Layer */}
      {imageUrl && (
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
      )}
      {/* ... rest of component */}
    </header>
  )
}
```

## Testing Checklist

After applying the fix:
- [ ] Clear Next.js cache: `rm -rf .next`
- [ ] Rebuild: `npm run build`
- [ ] Verify image renders in browser
- [ ] Check browser console for errors
- [ ] Inspect DOM to confirm valid image URL
- [ ] Test with multiple case studies
- [ ] Verify dark mode opacity works
- [ ] Check mobile responsiveness

## Key Learnings

1. **urlFor() expects specific data structure** - Either the full image object OR the asset reference directly, not an object containing asset
2. **CaseStudyBackground works because** it receives `image` prop which has `asset` at root level - semantic naming matched structure
3. **EditorialHero broke because** `backgroundImage` prop has nested `asset`, but code tried to pass full object instead of nested asset
4. **Always match the pattern**: If your data has `obj.asset`, pass `obj.asset` to urlFor(), not `obj`
5. **Silent failures are dangerous** - The URL generation "succeeds" but produces invalid URLs

## Related Files

- **Problem component:** `/src/components/case-study-editorial/EditorialHero.tsx`
- **Working reference:** `/src/components/case-studies/CaseStudyBackground.tsx`
- **Other working examples:** 
  - `/src/components/case-study-flowing/ArticleContent.tsx`
  - `/src/components/blog/BlogPostCard.tsx`
  - `/src/components/case-study-editorial/VisualCards.tsx`
- **urlFor() implementation:** `/src/sanity/lib/client.ts` (line 16)
- **Caller:** `/src/app/(public)/case-studies/[slug]/page.tsx` (line 204)
