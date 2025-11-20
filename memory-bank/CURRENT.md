# Google Analytics Localhost Filtering (2025-11-20)

## Context
Google Analytics was firing on localhost during development, causing test traffic to appear in production analytics data. User wanted to prevent GA from tracking on localhost.

## Problem Analysis
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` was set in `.env.local` file
- Existing code checked if measurement ID existed, but didn't check environment
- GA was tracking all localhost development activity as production traffic

## Solution Implemented
Added environment-based filtering in `src/app/layout.tsx`:

```typescript
// Before:
const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// After:
const gaId = process.env.NODE_ENV === 'production'
  ? process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  : undefined;
```

## Impact
- ✅ GA now only fires in production environment (`NODE_ENV === 'production'`)
- ✅ Localhost development traffic no longer tracked
- ✅ Preview deployments on Vercel won't track (they use `NODE_ENV === 'development'` or `NODE_ENV === 'preview'`)
- ✅ Measurement ID can stay in `.env.local` for convenience
- ✅ Code-level protection prevents accidental tracking

## Testing
- Verified with Omnibug browser extension on localhost
- No GA requests to `googletagmanager.com` on localhost:3000
- Vercel Analytics still works (separate system)

## Files Modified
- `src/app/layout.tsx` (lines 60-63)

## Related Research
- Created comprehensive research document at `/docs/google-analytics-test-traffic-filtering-research.md`
- Covers 6 filtering strategies, Next.js implementation patterns, and Vercel configuration

---

# Blog Image Display Optimization (2025-11-19 Late Evening)

## Context
After fixing case study images, user requested review of blog images to check for similar aspect ratio constraint issues.

## Problem Analysis
Found blog images were using regular `<img>` tags instead of Next.js Image component, missing out on optimization benefits (lazy loading, format conversion). Also found one aspect ratio constraint in BlogPostCard.

## Changes Made

### 1. BlogContent.tsx - Converted to Next.js Image
Updated all image variants to use Next.js Image component:
- **Full width**: `Image` with `width={1200} height={800}` + `className="w-full h-auto"`
- **Float left/right**: `Image` with `width={800} height={600}` + `className="w-full h-auto"`
- **Float portrait**: `Image` with `width={400} height={600}` + `className="w-full h-auto"`

### 2. BlogPostCard.tsx - Fixed Featured Images
- Removed `aspect-[4/3]` constraint
- Changed from `<img>` to Next.js `Image` component
- Using `width={600} height={450}` with `className="w-full h-auto"`

## Technical Pattern
Consistent with case study solution:
```tsx
// ✅ GOOD: Next.js Image with explicit dimensions + flexible height
<Image
  width={800}
  height={600}
  className="w-full h-auto object-cover"
/>

// ❌ BAD: Regular img or fixed aspect ratios
<img className="w-full h-full" />
<div className="aspect-[4/3]">
```

## Benefits
- ✅ Next.js optimizations retained (lazy loading, WebP/AVIF conversion)
- ✅ Sanity crop/hotspot settings respected
- ✅ Images display at natural dimensions
- ✅ Consistent implementation across case studies and blog

## Files Modified
- `src/components/blog/BlogContent.tsx`
- `src/components/blog/BlogPostCard.tsx`

## Verification
- ✅ Build successful
- ✅ Dev server running
- ✅ All image variants use Next.js Image component
- ✅ No aspect ratio constraints forcing image dimensions

---

# Mobile Performance Optimization: JS Bundle Reduction (2025-11-19)

## Context
As part of Phase 2.5.1 of the mobile LCP optimization plan, we identified and fixed a critical performance issue where the `@sanity/ui` library (~841KB) was being included in the main client bundle, even though it's only needed when Draft Mode is enabled.

## Changes Made

### 1. Bundle Analysis
**Tool**: `@next/bundle-analyzer`

**Findings**:
- `@sanity/ui`: 841KB (loaded via `VisualEditingWrapper`)
- `react-dom`: 877KB
- Shared bundle: 103KB

### 2. Lazy Loading Implementation
**Files**:
- `src/components/SanityVisualEditingLoader.tsx` (NEW)
- `src/app/layout.tsx`

**Changes**:
- Created `SanityVisualEditingLoader` client component that uses `next/dynamic` to lazy load `VisualEditingWrapper` with `ssr: false`
- Updated `layout.tsx` to use the new loader component instead of direct import
- Sanity visual editing UI now loads asynchronously only when Draft Mode is enabled

**Impact**:
- Removed ~841KB from the initial client bundle
- `@sanity/ui` now in separate async chunk, loaded on demand
- Regular site visitors save nearly 1MB of JavaScript on initial load

### 3. Build Error Resolution
**Issue**: Discovered duplicate `VisualEditingWrapper` import in `layout.tsx` (lines 14 and 18)

**Fix**: Removed duplicate import, ensuring clean module resolution

## Verification
- ✅ Build passes successfully (`npm run build`)
- ✅ All unit tests pass (41 tests across 4 files)
- ✅ Dev server runs without errors
- ✅ Manual verification: site functions normally

## Files Modified
- `src/components/SanityVisualEditingLoader.tsx` (created)
- `src/app/layout.tsx`
- `next.config.ts` (temporarily for analysis, reverted)

## Performance Impact
**Before**: Sanity UI included in shared bundle (103KB shared)
**After**: Sanity UI in separate async chunk (~1MB), loaded only when needed

---

# Case Study Image Display Fix (2025-11-19 Evening)

## Context
Case study images were being cropped/constrained by fixed aspect ratio containers instead of allowing containers to expand to fit image content. This affected portrait images like the Aesop case study design.

## Problem Analysis

### Root Cause
Commit `f824bb0` ("Complete Phase 2 & 3: Optimize all images for performance") introduced:
- Fixed aspect ratios (`aspect-[16/9]`, `aspect-[4/3]`, etc.) on image containers
- Next.js `<Image fill>` prop which requires container dimensions
- This forced all images into predetermined shapes regardless of their actual dimensions

### Discovery Process
1. Initially thought Sanity crops were the issue
2. Discovered containers were constraining images after crops applied
3. Found working pattern in `PortraitImageList` component (commit `69a1687`)

## Solution Pattern

Used the PortraitImageList approach:
```tsx
<Image
  width={800}      // Explicit dimensions for Next.js optimization
  height={600}     // These are hints, not constraints
  className="w-full h-auto object-cover"  // h-auto lets height flex!
/>
```

Key insight: **`h-auto` or `w-auto` allows one dimension to adjust** while respecting Sanity crops.

## Changes Made

### 1. ArticleContent.tsx - Fixed all floating image variants
- **floatLeft**: Removed `aspect-[4/3]`, switched from `fill` to explicit dimensions
- **floatRight**: Removed `aspect-[4/3]`, switched from `fill` to explicit dimensions
- **floatRightPortrait**: Removed `aspect-[3/4]`, switched from `fill` to explicit dimensions

### 2. EditorialHero.tsx - Fixed hero image
- Removed `aspect-[4/3]` from hero image container
- Changed from `<Image fill>` to `<Image width={600} height={800}>`
- Added `className="w-full h-auto object-contain"`

### 3. Query Fix - Added crop/hotspot data
- Updated `article` field query to properly expand image objects
- Ensures crop/hotspot data from Sanity Studio is fetched and applied

## Technical Details

### Before (Broken)
```tsx
<div className="relative w-full aspect-[16/9]">
  <Image fill className="object-contain" />
</div>
```

### After (Fixed)
```tsx
<div className="relative w-full">
  <Image width={800} height={600} className="w-full h-auto object-cover" />
</div>
```

## Benefits
- ✅ Keeps Next.js Image optimizations (lazy loading, format conversion)
- ✅ Respects Sanity crop/hotspot settings
- ✅ Containers adapt to image content dimensions
- ✅ No complex dimension calculations needed

## Files Modified
- `src/components/case-study-flowing/ArticleContent.tsx`
- `src/components/case-study-editorial/EditorialHero.tsx`
- `src/app/(public)/case-studies/[slug]/page.tsx` (query update)

## Verification
- ✅ Build successful (`npm run build`)
- ✅ Portrait images display at full height
- ✅ Landscape images display correctly
- ✅ Sanity crop/hotspot settings are respected

## Lessons Learned
1. Next.js `Image fill` requires fixed container dimensions
2. Using explicit width/height with `h-auto` or `w-auto` provides flexibility
3. Always check if containers are constraining content before assuming source issues
4. Look for working patterns in the codebase before implementing new solutions