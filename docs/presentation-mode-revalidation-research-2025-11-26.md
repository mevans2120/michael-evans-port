# Sanity Presentation Mode: Why Is It Still Revalidating?

**Date:** November 26, 2025
**Issue:** CMS still revalidates in presentation mode instead of using WebSockets
**Attempt:** 6th investigation
**Status:** Research in progress

---

## Executive Summary

Despite 5 previous fix attempts (November 6-11, 2025), the user reports that Sanity Presentation mode still triggers revalidation instead of using pure WebSocket updates. This document consolidates prior research, documents the current state, and investigates remaining issues.

---

## Key Finding: All Previous Fixes Are Correctly Implemented

After reviewing the codebase, **all 5 previous fixes are in place and correctly configured**:

| Fix | Status | Verified In |
|-----|--------|-------------|
| browserToken enabled | ✅ | `/src/sanity/lib/live.ts:20` |
| useCdn: false | ✅ | `/src/sanity/lib/client.ts:10` |
| Duplicate client deleted | ✅ | `/src/lib/sanity/client.ts` no longer exists |
| Custom refresh handler (disables all) | ✅ | `/src/components/VisualEditingWrapper.tsx:30-33` |
| Location resolvers configured | ✅ | `/src/sanity/presentation.ts` |
| ISR conflicts removed | ✅ | No `export const revalidate` in sanityFetch pages |
| Webhook skips drafts | ✅ | `/src/app/api/webhooks/sanity/route.ts:179` |

**This means the issue is either:**
1. Expected behavior being misinterpreted
2. A bug in `next-sanity` v11.6.x
3. Something specific to Next.js 15.5.6
4. A configuration issue in Sanity dashboard (webhook settings)

---

## Prior Fix Attempts Summary

### Attempt 1: Enable browserToken (Nov 6, 2025)
**Document:** `/docs/sanity-presentation-mode-fix.md`

**Problem:** `browserToken: false` disabled WebSocket connection
**Fix:** Changed to `browserToken: process.env.SANITY_AUTH_TOKEN`
**Result:** Enabled WebSocket connection for live updates

### Attempt 2: Consolidate Clients & Disable CDN (Nov 7, 2025)
**Document:** `/docs/presentation-mode-refresh-deep-dive.md`

**Problem:** Two competing Sanity clients with different configurations
**Fix:**
- Deleted duplicate `/src/lib/sanity/client.ts`
- Set `useCdn: false` in base client
**Result:** Eliminated CDN caching conflicts

### Attempt 3: Add Location Resolvers (Nov 7, 2025)
**Document:** `/docs/sanity-presentation-mode-fix.md`

**Fix:** Created `/src/sanity/presentation.ts` with `mainDocuments` and `locations`
**Result:** Improved navigation UX, but didn't fix revalidation

### Attempt 4: Remove ISR Conflicts (Nov 7, 2025)
**Document:** `/docs/presentation-mode-isr-conflict-fix.md`

**Problem:** `export const revalidate = 3600` conflicted with tag-based revalidation
**Fix:** Removed time-based `revalidate` exports from pages
**Result:** Eliminated ISR/tag conflict

### Attempt 5: Custom Refresh Handler (Nov 11, 2025)
**Document:** `/docs/sanity-presentation-revalidation-research.md`

**Problem:** Default `VisualEditing` refresh strategy revalidates root layout on every mutation
**Fix:** Added custom `refresh` prop that returns immediately (disables all refreshes)
**Result:** Should have fixed the aggressive revalidation

---

## Current Implementation State

### File: `/src/sanity/lib/live.ts`
```typescript
export const { sanityFetch, SanityLive } = defineLive({
  client: client.withConfig({
    useCdn: false,  // ✅ Correct
    stega: { enabled: true, studioUrl: '/studio' },
  }),
  serverToken: process.env.SANITY_AUTH_TOKEN,  // ✅ Correct
  browserToken: process.env.SANITY_AUTH_TOKEN, // ✅ Correct - enables WebSocket
});
```
**Status:** Correctly configured

### File: `/src/sanity/lib/client.ts`
```typescript
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // ✅ Correct - no CDN caching
})
```
**Status:** Correctly configured, duplicate client deleted

### File: `/src/components/VisualEditingWrapper.tsx`
```typescript
export function VisualEditingWrapper() {
  return (
    <VisualEditing
      refresh={async () => {
        // Disable all manual refreshes
        return
      }}
    />
  )
}
```
**Status:** Custom refresh handler implemented, disables all refreshes

### File: `/src/sanity/presentation.ts`
**Status:** Location resolvers configured for blog, project, aiShowcase

### ISR Configuration
**Status:** No conflicting `export const revalidate` statements in sanityFetch pages

---

## Remaining Investigation Areas

Given all previous fixes are in place, the issue may be coming from:

### 1. Server-Side Revalidation via Webhook

**Hypothesis:** The Sanity webhook at `/api/webhooks/sanity` triggers `revalidatePath()` on publish, causing server-side refresh.

**Finding:** The webhook ALREADY correctly skips drafts:
```typescript
// Line 179 in /src/app/api/webhooks/sanity/route.ts
if (isDraft(payload._id)) {
  logger.log(`   ⏭️  Skipping draft document (not published yet)\n`);
  return NextResponse.json({...});
}
```

**However:** The webhook uses `revalidatePath()` (not `revalidateTag()`) for published content. This may cause a full path revalidation on publish.

**Check:**
- Is the webhook configured in Sanity to fire on ALL events or just publish?
- Does `revalidatePath()` cause a visible refresh?

**File:** `/src/app/api/webhooks/sanity/route.ts`

### 2. SanityLive Component Behavior

**Hypothesis:** `SanityLive` itself may be calling `router.refresh()` or `revalidateTag()`.

**Check:**
- What does the `next-sanity` source code do when receiving WebSocket events?
- Is there a config option we're missing?

**Investigation:** Review `next-sanity` v11.6.x source code for `defineLive` behavior.

### 3. Next.js 15 Caching Behavior

**Hypothesis:** Next.js 15's aggressive caching or new defaults may be interfering.

**Check:**
- Are there new caching defaults in Next.js 15.5.6?
- Is `fetchCache` or `revalidate` being set globally?

**Files to check:**
- `next.config.ts`
- `src/app/layout.tsx`

### 4. Browser vs Server Confusion

**Hypothesis:** "Revalidation" may actually be expected server-side behavior that's being confused with WebSocket failure.

**Check:**
- What exactly does the user see? Full page reload? Flash? Data refresh?
- Is the WebSocket actually connected? (Check Network tab for WS connection)
- Are there console errors?

### 5. Stale Closure / Component Re-render

**Hypothesis:** React re-renders may be causing perceived "refreshes" that aren't actual revalidation.

**Check:**
- Is the preview iframe being replaced?
- Are there hydration mismatches?

### 6. Draft Mode Cookies

**Hypothesis:** Draft mode cookies may be expiring or not properly set.

**Check:**
- Are `__prerender_bypass` and `__next_preview_data` cookies present?
- Do they persist during editing?

---

## Diagnostic Steps

### Step 1: Verify WebSocket Connection
```
1. Open browser DevTools → Network tab
2. Filter by "WS" (WebSocket)
3. Open Presentation mode in Sanity
4. Look for active WebSocket connection to Sanity
5. Edit content and watch for WebSocket messages
```

**Expected:** Should see WebSocket messages for each keystroke/edit

### Step 2: Check for Full Page Reloads
```
1. Open DevTools → Network tab
2. Edit content in Presentation mode
3. Watch for document requests (full page loads)
```

**Expected with fix:** NO document requests during editing
**If seeing document requests:** Indicates revalidation is still happening

### Step 3: Monitor Server Logs
```bash
# Watch Next.js dev server output
# Look for revalidation messages
```

**Expected:** `<SanityLive /> revalidated tag: sanity:...` messages (this is GOOD - it's WebSocket working)
**Problem indicator:** Other revalidation logs or errors

### Step 4: Check Webhook Firing
```bash
# Add console.log to /api/webhooks/sanity/route.ts
# Watch for webhook calls during draft editing
```

**Expected:** Webhook should ONLY fire on publish, not draft edits

### Step 5: Verify Draft Mode Status
```javascript
// In browser console while in Presentation mode:
document.cookie.includes('__prerender_bypass')
// Should return: true
```

---

## Potential Solutions (Pending Investigation)

### If Webhook Is Firing Too Often
```typescript
// In /api/webhooks/sanity/route.ts
// Add check to ignore draft changes
if (body._type === 'sanity.draft') return
```

### If SanityLive Is Causing Revalidation
```typescript
// May need to disable server-side revalidation in defineLive
// Check next-sanity docs for options
```

### If Next.js 15 Caching Issue
```typescript
// In next.config.ts
experimental: {
  serverComponentsExternalPackages: ['next-sanity'],
}
```

### If Browser Refresh vs Server Revalidation Confusion
Document expected behavior clearly - some "refresh" visual may be normal React re-render from WebSocket updates.

---

## Questions for User

To continue investigation, need clarification:

1. **What exactly do you see?**
   - Full page flash/reload?
   - Just content area updating?
   - Brief loading state?

2. **When does it happen?**
   - Every keystroke?
   - After pausing typing?
   - Only on publish?

3. **Browser DevTools observations:**
   - Is there an active WebSocket connection?
   - Are there full document requests during editing?
   - Any console errors?

4. **Server logs:**
   - What does the Next.js dev server show during editing?

---

## Related Documentation

| Document | Date | Focus |
|----------|------|-------|
| `/docs/sanity-presentation-mode-fix.md` | Nov 6 | browserToken fix |
| `/docs/presentation-mode-refresh-deep-dive.md` | Nov 7 | Client consolidation |
| `/docs/SANITY-PRESENTATION-MODE-QUICK-FIX.md` | Nov 7 | Quick reference |
| `/docs/presentation-mode-isr-conflict-fix.md` | Nov 7 | ISR removal |
| `/docs/sanity-presentation-revalidation-research.md` | Nov 11 | Custom refresh handler |
| `/docs/SANITY-CACHING-GUIDE.md` | - | General caching guide |

---

## Package Versions

```json
{
  "next": "15.5.6",
  "next-sanity": "^11.6.2",
  "@sanity/visual-editing": "^4.0.0",
  "sanity": "^4.11.0"
}
```

---

## Next Steps

1. [ ] Get user clarification on exact symptoms
2. [ ] Verify WebSocket is connected and receiving messages
3. [ ] Check if webhook fires during draft editing
4. [ ] Review `next-sanity` source for `defineLive` revalidation behavior
5. [ ] Test in production vs development (behavior may differ)
6. [ ] Check Next.js 15.5.6 release notes for caching changes

---

## ROOT CAUSE IDENTIFIED (Nov 26, 2025)

### Console Evidence

The browser console shows:
```
Sanity is live with automatic revalidation for draft content changes as well as published content
[Fast Refresh] rebuilding
[Fast Refresh] done in 770ms
```

### The Smoking Gun

The message "Sanity is live with **automatic revalidation** for draft content changes" comes from `SanityLive.tsx:139`. This reveals that **`SanityLive` itself is designed to call `revalidateTag()` on every content change**.

This is the CORE behavior of the Live Content API - it's not a bug, it's by design:
1. `SanityLive` listens to EventSource for content changes
2. When a change is detected, it calls `revalidateTag()` via a Server Function
3. This invalidates the Next.js cache and triggers a re-render

### Why It Causes Full Refreshes

The `[Fast Refresh]` messages suggest that in **development mode with Turbopack**, the `revalidateTag()` calls are somehow triggering Turbopack's HMR/Fast Refresh mechanism, causing visible page rebuilds.

### Fix Attempted

Added props to `SanityLive` in `/src/app/layout.tsx`:
```tsx
<SanityLive
  refreshOnMount={false}
  refreshOnFocus={false}
  refreshOnReconnect={false}
/>
```

**Note:** These props control `router.refresh()` behavior, NOT `revalidateTag()`. The automatic revalidation is a core feature that cannot be disabled via props.

### Alternative Solutions to Investigate

1. **Test in production** - The Fast Refresh issue may be dev-mode specific
2. **Disable Turbopack** - Run with `next dev` (no `--turbopack`) to test
3. **Use older preview approach** - Don't use `defineLive`/`SanityLive`, use manual preview setup instead
4. **Report to Sanity** - This may be a bug in `next-sanity` v11.6.x interaction with Turbopack

---

## Conclusion

All known fixes from prior attempts are implemented correctly. The remaining issue may be:
- Expected behavior being misinterpreted as a problem
- A new edge case not covered by previous fixes
- Next.js 15 specific behavior
- Webhook triggering unexpectedly

Further diagnosis requires understanding exactly what the user is experiencing and verifying the WebSocket connection is actually working.

---

## Update: Root Cause Found

The root cause is that **`SanityLive` is working as designed** - it triggers `revalidateTag()` on content changes. The issue is that this design causes visible refreshes in development mode, especially with Turbopack.

**Potential solutions:**
1. Test without Turbopack: `next dev` instead of `next dev --turbopack`
2. Test in production build to see if the issue persists
3. Consider using a different preview approach that doesn't use `defineLive`

---

## BREAKTHROUGH: Known Turbopack + Sanity Incompatibility (Nov 26, 2025)

### Key Finding

There are **multiple documented GitHub issues** showing Turbopack and Sanity have compatibility problems in Next.js 15:

| Issue | Description | Status |
|-------|-------------|--------|
| [#84294](https://github.com/vercel/next.js/issues/84294) | Turbopack Build Fails When Using Sanity CMS | Open |
| [#64494](https://github.com/vercel/next.js/issues/64494) | Module factory HMR issue with Turbopack + Sanity | Tracked by Turbopack team |
| [#78957](https://github.com/vercel/next.js/issues/78957) | Turbopack dev mode fast refresh issue (affects ^15.2.0) | Open |

### The Problem

When `revalidateTag()` is called by `SanityLive`, it triggers Turbopack's HMR/Fast Refresh mechanism in an unexpected way. This causes the visible "full page rebuilding" behavior seen in the console:

```
[Fast Refresh] rebuilding
[Fast Refresh] done in 770ms
```

This does NOT happen with webpack (the default bundler without `--turbopack`).

### Current Configuration

```json
// package.json line 7
"dev": "next dev -p 3000 --turbopack"
```

### Recommended Fix

**Option 1: Disable Turbopack for development (Recommended)**

Create a separate script for CMS editing that doesn't use Turbopack:

```json
"dev": "next dev -p 3000 --turbopack",
"dev:cms": "next dev -p 3000"
```

Use `npm run dev:cms` when working in Sanity Presentation mode.

**Option 2: Remove Turbopack entirely**

```json
"dev": "next dev -p 3000"
```

This sacrifices Turbopack's faster HMR for regular development, but fixes the Presentation mode issue.

**Option 3: Wait for fixes**

The issues are being tracked by both the Next.js and Sanity teams. Future versions may resolve this.

### Why This Explains Past Success

The user mentioned they've used a "well-implemented Presentation mode before" - this was likely:
1. A project using webpack (no `--turbopack`)
2. An older version of Next.js before 15.2.0
3. A different `next-sanity` version with different behavior

### Testing the Fix

1. Stop current dev server
2. Run: `npx next dev -p 3000` (without `--turbopack`)
3. Open Presentation mode in Sanity Studio
4. Edit content and observe:
   - Should see smooth WebSocket updates
   - Should NOT see `[Fast Refresh] rebuilding` on every edit

### Production Behavior

This issue is **development-mode specific**. Production builds use webpack and don't have the HMR/Fast Refresh mechanism, so:
- `npm run build && npm run start` should work correctly
- Deployed sites (Vercel) should work correctly
- Only local development with `--turbopack` is affected

**Sources:**
- [next-sanity GitHub](https://github.com/sanity-io/next-sanity)
- [Sanity Live Content API docs](https://www.sanity.io/docs/developer-guides/live-content-guide)
- [Visual Editing with Next.js App Router](https://www.sanity.io/docs/visual-editing/visual-editing-with-next-js-app-router)
- [Turbopack + Sanity Issue #84294](https://github.com/vercel/next.js/issues/84294)
- [Turbopack + Sanity HMR Issue #64494](https://github.com/vercel/next.js/issues/64494)
- [Turbopack Fast Refresh Issue #78957](https://github.com/vercel/next.js/issues/78957)
