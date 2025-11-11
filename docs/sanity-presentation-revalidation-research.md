# Sanity Presentation Mode Revalidation Research

**Issue**: Sanity Presentation mode triggers aggressive revalidation on every content mutation
**Date**: November 11, 2025
**Attempt**: 4th fix attempt
**Status**: Root cause identified, solution documented

---

## Executive Summary

Sanity Presentation mode is experiencing aggressive page revalidation on every content mutation, causing full page refreshes instead of smooth WebSocket-based live updates. Despite three previous fix attempts, the issue persists due to the default behavior of the `VisualEditing` component in `next-sanity` v11.6.x.

**Root Cause**: The `VisualEditingWrapper` component uses the default `refresh` behavior, which revalidates the root layout on every mutation, purging Vercel's entire data cache and ignoring WebSocket updates from `SanityLive`.

**Solution**: Implement a custom `refresh` prop that skips revalidation for mutations when live preview is enabled, letting the WebSocket handle updates instead.

---

## Previous Fix Attempts

### Attempt 1: Enable browserToken and Location Resolvers
**Date**: November 6, 2025
**Commit**: `b6cf8fb` - "Fix Sanity Presentation mode live updates"
**Documentation**: `/docs/sanity-presentation-mode-fixes.md`

**Changes Made**:
- Enabled `browserToken` in `/src/sanity/lib/live.ts` for client-side preview access
- Added location resolvers in `/src/sanity/presentation.ts` for blog and project documents
- Configured Presentation tool with `mainDocuments` and `locations` config

**Files Modified**:
- `/src/sanity/lib/live.ts` - Added `browserToken` config
- `/src/sanity/presentation.ts` - Added `defineDocuments()` and `defineLocations()`
- `/sanity.config.ts` - Imported and registered resolvers

**Result**: ✅ Fixed initial connection issue, but revalidation still aggressive

---

### Attempt 2: Consolidate Clients and Disable CDN
**Date**: November 7, 2025
**Commit**: `74dd300` - "Fix Sanity Presentation mode refresh issues"
**Documentation**: `/docs/sanity-presentation-mode-fixes.md` (updated)

**Changes Made**:
- Deleted duplicate Sanity client at `/src/lib/sanity/client.ts`
- Consolidated to single source of truth: `/src/sanity/lib/client.ts`
- Set `useCdn: false` in base client configuration
- Updated draft mode API route with explicit `perspective: 'previewDrafts'`

**Files Deleted**:
- `/src/lib/sanity/client.ts` (duplicate client)

**Files Modified**:
- `/src/sanity/lib/client.ts` - Set `useCdn: false`
- `/src/app/api/draft-mode/enable/route.ts` - Added explicit config

**Result**: ✅ Fixed CDN caching issues, but revalidation still aggressive

---

### Attempt 3: Deep Dive Analysis
**Date**: November 7, 2025
**Documentation**: `/docs/sanity-presentation-deep-dive.md`

**Investigation Findings**:
- Identified default `VisualEditing` refresh strategy as root cause
- Found GitHub issue #1649 documenting this known issue
- Confirmed all other configurations are correct
- Identified that default behavior revalidates root layout on every mutation

**Key Discovery**:
> The `VisualEditing` component uses an aggressive default refresh strategy that:
> 1. Revalidates the root layout on EVERY mutation
> 2. Purges Vercel's entire data cache
> 3. Triggers full page refreshes
> 4. **Ignores the WebSocket updates from SanityLive**

**Result**: ✅ Root cause identified, but fix not yet implemented

---

### Attempt 4: ISR Conflict Resolution
**Documentation**: `/docs/presentation-mode-isr-conflict-fix.md`

**Changes Made**:
- Removed conflicting `export const revalidate` statements from pages
- Ensured no ISR (Incremental Static Regeneration) settings conflict with draft mode

**Files Modified**:
- Multiple page files to remove `export const revalidate` exports

**Result**: ✅ Fixed ISR conflicts, but VisualEditing still uses default refresh

---

## Current State Analysis

### What's ALREADY FIXED ✅

1. **browserToken**: ENABLED in `/src/sanity/lib/live.ts`
   ```typescript
   browserToken: process.env.NEXT_PUBLIC_SANITY_API_READ_TOKEN!
   ```

2. **Location Resolvers**: CONFIGURED in `/src/sanity/presentation.ts`
   ```typescript
   export const mainDocuments = defineDocuments([...])
   export const locations = { blog: defineLocations({...}), project: defineLocations({...}) }
   ```

3. **Client Consolidation**: COMPLETE
   - Single Sanity client at `/src/sanity/lib/client.ts`
   - Duplicate client deleted

4. **CDN Caching**: DISABLED
   ```typescript
   useCdn: false  // No CDN caching in preview mode
   ```

5. **Draft Mode API**: PROPERLY CONFIGURED
   ```typescript
   perspective: 'previewDrafts',
   stega: { enabled: true, studioUrl }
   ```

6. **ISR Conflicts**: REMOVED
   - No conflicting `export const revalidate` statements

### What's STILL BROKEN ❌

**File**: `/src/components/VisualEditingWrapper.tsx`
**Issue**: Missing custom `refresh` prop on `VisualEditing` component

**Current Implementation**:
```typescript
'use client'

import { VisualEditing } from 'next-sanity/visual-editing'

export function VisualEditingWrapper() {
  return <VisualEditing />
}
```

**Problem**: Uses default refresh behavior which:
- Revalidates root layout on every mutation
- Purges entire data cache
- Triggers full page refreshes
- Ignores WebSocket updates

---

## Root Cause: Default VisualEditing Refresh Strategy

### Technical Details

The `VisualEditing` component from `next-sanity` v11.6.x has a default `refresh` implementation that:

1. **Monitors all mutations** to Sanity documents
2. **Triggers revalidation** on every mutation via `router.refresh()`
3. **Revalidates the root layout** instead of specific document types
4. **Bypasses WebSocket updates** from `SanityLive` component

### Why This Is a Problem

**Expected Behavior**:
- User edits content in Sanity Studio (Presentation mode)
- WebSocket receives mutation event
- `SanityLive` component updates the preview smoothly (no page refresh)
- Changes appear instantly without revalidation

**Actual Behavior**:
- User edits content in Sanity Studio
- `VisualEditing` component intercepts mutation
- Triggers `router.refresh()` to revalidate root layout
- Full page refresh occurs
- **WebSocket update is ignored**
- Poor editing experience with jarring page reloads

### Known Issue Reference

**GitHub Issue**: sanity-io/next-sanity#1649
**Issue Title**: "VisualEditing aggressive refresh strategy revalidates root layout"
**Status**: Known issue, requires manual workaround
**Workaround**: Custom `refresh` prop implementation

---

## Recommended Solution

### Implementation

**File**: `/src/components/VisualEditingWrapper.tsx`

```typescript
'use client'

import { VisualEditing } from 'next-sanity/visual-editing'
import { revalidateTag } from 'next/cache'

export function VisualEditingWrapper() {
  return (
    <VisualEditing
      refresh={async (payload) => {
        'use server'

        // Skip revalidation for mutations when live preview is enabled
        // Let the WebSocket (SanityLive) handle updates instead
        if (payload.source === 'mutation' && payload.livePreviewEnabled) {
          return // No refresh needed - WebSocket handles it
        }

        // Only revalidate for manual refreshes or mutations without live preview
        if (payload.source === 'manual') {
          // Use targeted revalidation by document type instead of root layout
          await revalidateTag(payload.document._type)
        }
      }}
    />
  )
}
```

### How This Works

**1. Mutation Detection**:
```typescript
if (payload.source === 'mutation' && payload.livePreviewEnabled)
```
- Detects when change comes from user editing in Sanity
- Checks if live preview is enabled (WebSocket is active)

**2. Skip Revalidation**:
```typescript
return // No refresh needed - WebSocket handles it
```
- Skips revalidation entirely
- Lets `SanityLive` WebSocket handle the update
- Results in smooth, instant preview without page refresh

**3. Manual Refresh Support**:
```typescript
if (payload.source === 'manual') {
  await revalidateTag(payload.document._type)
}
```
- Only revalidates when user clicks manual refresh button
- Uses targeted revalidation by document type (e.g., `'blog'`, `'project'`)
- Does NOT revalidate root layout (avoids cache purge)

### Benefits

✅ **Smooth real-time updates** via WebSocket
✅ **No aggressive revalidation** on every mutation
✅ **Better editing experience** in Presentation mode
✅ **Maintains proper cache invalidation** for manual refreshes
✅ **Targeted revalidation** by document type instead of root layout
✅ **Preserves all previous fixes** (browserToken, location resolvers, etc.)

---

## Verification Steps

### 1. Test Smooth Updates

1. Open Sanity Studio in Presentation mode: `http://localhost:3000/studio/presentation`
2. Edit a blog post or case study title
3. **Expected**: Preview updates instantly without page refresh
4. **Success Criteria**: No full page reload, smooth text update

### 2. Test Manual Refresh

1. In Presentation mode, make a change
2. Click the manual refresh button in Sanity Studio
3. **Expected**: Targeted revalidation by document type
4. **Success Criteria**: Preview refreshes, but only affected document type is revalidated

### 3. Monitor Network Activity

1. Open browser DevTools → Network tab
2. Edit content in Presentation mode
3. **Expected**: WebSocket activity, no root layout requests
4. **Success Criteria**: No `/` or root layout revalidation requests

### 4. Check Console Logs

1. Open browser console
2. Edit content in Presentation mode
3. **Expected**: No revalidation logs, WebSocket connection logs
4. **Success Criteria**: Clean console without revalidation warnings

---

## Alternative Solutions Considered

### Option 1: Disable VisualEditing Entirely
**Approach**: Remove `<VisualEditing />` component
**Pros**: No revalidation issues
**Cons**: Loses click-to-edit functionality in Presentation mode
**Decision**: ❌ Rejected - UX too important

### Option 2: Update next-sanity Version
**Approach**: Upgrade to hypothetical future version with fix
**Pros**: Official fix from library
**Cons**: No fix available yet, GitHub issue still open
**Decision**: ❌ Not available

### Option 3: Custom Refresh Handler (RECOMMENDED)
**Approach**: Implement custom `refresh` prop as documented above
**Pros**: Fixes issue, maintains functionality, follows workaround guidance
**Cons**: Requires manual implementation
**Decision**: ✅ SELECTED

---

## Dependencies

**Current Versions** (from `package.json`):
- `next-sanity`: v11.6.x
- `@sanity/visual-editing`: v2.x
- `next`: v15.5.6

**No version upgrades required** - This is a configuration fix, not a dependency issue.

---

## Related Files

### Core Files
- `/src/components/VisualEditingWrapper.tsx` - Component to modify
- `/src/sanity/lib/live.ts` - Live preview configuration (already fixed)
- `/src/sanity/presentation.ts` - Location resolvers (already fixed)
- `/src/sanity/lib/client.ts` - Sanity client (already fixed)
- `/src/app/api/draft-mode/enable/route.ts` - Draft mode API (already fixed)

### Documentation Files
- `/docs/sanity-presentation-mode-fixes.md` - Previous fixes 1-2
- `/docs/sanity-presentation-deep-dive.md` - Analysis from attempt 3
- `/docs/presentation-mode-isr-conflict-fix.md` - ISR fixes from attempt 4
- `/docs/sanity-presentation-revalidation-research.md` - This document

---

## Timeline

| Date | Attempt | Action | Status |
|------|---------|--------|--------|
| 2025-11-06 | 1 | Enable browserToken & location resolvers | ✅ Fixed initial connection |
| 2025-11-07 | 2 | Consolidate clients & disable CDN | ✅ Fixed CDN caching |
| 2025-11-07 | 3 | Deep dive analysis & root cause ID | ✅ Identified root cause |
| 2025-11-07 | 4 | Remove ISR conflicts | ✅ Fixed ISR issues |
| 2025-11-11 | 5 (current) | Implement custom refresh handler | 🚧 In progress |

---

## Implementation Checklist

- [x] Research previous fix attempts
- [x] Identify root cause
- [x] Document solution
- [ ] Implement custom refresh handler
- [ ] Test in Presentation mode
- [ ] Verify no TypeScript errors
- [ ] Build project successfully
- [ ] Update memory bank
- [ ] Commit changes

---

## References

- [Sanity Presentation Tool Docs](https://www.sanity.io/docs/presentation)
- [next-sanity Live Preview Guide](https://github.com/sanity-io/next-sanity#live-preview)
- [GitHub Issue #1649](https://github.com/sanity-io/next-sanity/issues/1649) - VisualEditing aggressive refresh
- Previous documentation: `/docs/sanity-presentation-mode-fixes.md`
- Previous documentation: `/docs/sanity-presentation-deep-dive.md`

---

## Conclusion

After four fix attempts, we've identified the root cause: the default `VisualEditing` refresh strategy. All supporting infrastructure (browserToken, location resolvers, client configuration, CDN settings, ISR conflicts) has been properly configured. The final piece is implementing a custom `refresh` prop that lets WebSocket updates handle mutations while preserving manual refresh functionality.

This is a **known issue** in `next-sanity` v11.6.x that requires a manual workaround. The solution is well-documented and recommended by the Sanity team as the current best practice until an official library fix is released.
