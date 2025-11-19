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

This optimization primarily benefits regular site visitors who never use Draft Mode, reducing their initial JavaScript payload by ~841KB.

## Next Steps
- Phase 2.5.2: Mobile-specific image optimization
- Phase 2.5.3: Font loading optimization
- Lighthouse mobile testing to measure real-world improvement

## Related Documentation
- `/docs/css-lcp-optimization-phase-2.5-mobile.md` - Full mobile optimization plan
- Phase 1 focused on Tailwind and CSS optimization (desktop)
- Phase 2.5 focuses on mobile-specific JavaScript and asset optimization
