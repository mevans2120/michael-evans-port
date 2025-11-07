# Presentation Mode ISR Conflict Fix

**Date:** 2025-11-07
**Issue:** Page refreshes still occurring in Sanity Presentation mode after browserToken fix
**Status:** RESOLVED

## Problem

After implementing Phase 1 & 2 of the Presentation mode fix (enabling `browserToken` and adding location resolvers), the user still reported seeing page refreshes when editing content in Presentation mode.

WebSocket logs showed the connection was working correctly:
```
<SanityLive /> revalidated tag: sanity:s1:W5V1Pg
<SanityLive /> revalidated tag: sanity:s1:dwozqA
```

## Root Cause

**Conflicting caching strategies:**

The blog and case-studies pages had `export const revalidate = 3600` (time-based ISR), while also using `sanityFetch` which implements tag-based revalidation via `defineLive`.

According to [Sanity documentation](https://github.com/sanity-io/next-sanity):
> "if `tags` are supplied, the `revalidate` setting will be set to `false` (cache indefinitely)"

This conflict between time-based ISR and tag-based revalidation was causing Next.js to perform server-side revalidation on content changes, triggering visible page refreshes.

## Solution

**Remove time-based `revalidate` exports when using `sanityFetch`**

### Files Modified

1. **`/src/app/(public)/blog/[slug]/page.tsx`**
   - Removed: `export const revalidate = 3600;`

2. **`/src/app/(public)/case-studies/[slug]/page.tsx`**
   - Removed: `export const revalidate = 3600`

### Why This Works

- `sanityFetch` (from `defineLive`) handles cache invalidation via tags
- WebSocket updates trigger `revalidateTag()` for instant updates
- No time-based revalidation = no server-side page refreshes
- Pages still use SSG (Static Site Generation) via `generateStaticParams()`
- Cache updates happen seamlessly via tag-based revalidation

## Caching Strategy

**Before (BROKEN):**
```typescript
// Mixed strategies - causes conflicts
export const revalidate = 3600;  // Time-based ISR
const { data } = await sanityFetch({ query }); // Tag-based revalidation
```

**After (FIXED):**
```typescript
// Pure tag-based revalidation
const { data } = await sanityFetch({ query }); // Handles all caching
// No export const revalidate needed
```

## Verification

Build output confirms pages are still statically generated:
```
● /blog/[slug]                         2.11 kB         168 kB
● /case-studies/[slug]                 2.27 kB         181 kB
```

The ● marker indicates SSG with `generateStaticParams()`, while cache invalidation is now fully handled by Sanity's tag-based system.

## Complete Fix Summary

The full Presentation mode fix required three changes:

1. **Phase 1:** Enable `browserToken` in `/src/sanity/lib/live.ts` (enables WebSocket)
2. **Phase 2:** Add location resolvers in `/src/sanity/presentation.ts` (UX enhancement)
3. **Phase 3 (this fix):** Remove conflicting `revalidate` exports (prevents refreshes)

## Related Documentation

- `/docs/sanity-presentation-mode-fix.md` - Original Phase 1 & 2 fix
- `/docs/SANITY-PRESENTATION-MODE-QUICK-FIX.md` - Quick reference guide
- [Sanity next-sanity docs](https://github.com/sanity-io/next-sanity) - Tag-based revalidation

## Testing

To verify the fix:
1. Open Presentation mode in Sanity Studio
2. Edit content (e.g., blog post title)
3. Content should update instantly without page refresh
4. Check browser network tab - no full page reload should occur
5. Server logs should show `<SanityLive /> revalidated tag` messages
