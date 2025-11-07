# Sanity Presentation Mode Refresh Issue - Deep Dive Analysis

**Date:** November 7, 2025  
**Status:** Active Investigation  
**Severity:** Medium - Functional but degraded UX

## Executive Summary

Despite implementing three phases of fixes (browserToken, location resolvers, and ISR removal), Sanity Presentation mode is **still showing page refreshes**. The root cause is a **critical client configuration conflict**: the codebase has **TWO separate Sanity clients** with different configurations, and the wrong client is being used for draft mode enabling and static params generation.

### Primary Root Cause

**Two Competing Client Configurations:**

1. **`/src/sanity/lib/client.ts`** - from `next-sanity` package
   - `useCdn: true` (ALWAYS, even in draft mode)
   - No perspective set
   - Used by: draft-mode API route

2. **`/src/lib/sanity/client.ts`** - from `@sanity/client` package  
   - `useCdn: process.env.NODE_ENV === 'production'`
   - `perspective: 'published'`
   - Used by: generateStaticParams, image URLs, most components

**The Problem:** The draft-mode API route uses a client with `useCdn: true`, which causes CDN caching (up to 60 seconds) to interfere with live preview. When Presentation mode enables draft mode, it gets stale cached data instead of fresh drafts.

---

## Technical Analysis

### 1. Client Configuration Conflict

**File: `/src/sanity/lib/client.ts`**
```typescript
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // ❌ PROBLEM: Always true, even for drafts
})
```

**File: `/src/lib/sanity/client.ts`**
```typescript
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '5n331bys',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production', // ❌ Also problematic for drafts
  perspective: 'published', // ❌ Forces published perspective
})
```

**Impact:**
- Draft mode uses client with CDN caching enabled
- CDN cache can be up to 60 seconds old
- Changes made in Sanity Studio may not reflect immediately
- Triggers full page refreshes to bypass cache

### 2. Draft Mode API Route Configuration

**File: `/src/app/api/draft-mode/enable/route.ts`**
```typescript
import { client } from '@/sanity/lib/client' // ❌ Wrong client

export const { GET } = defineEnableDraftMode({
  client: client.withConfig({
    token: process.env.SANITY_AUTH_TOKEN,
  }),
})
```

**Problem:** Uses the client with `useCdn: true`, which is incompatible with draft/preview modes.

**Official Sanity Guidance:**
> "When perspective is 'previewDrafts', you should set `useCdn: false` to avoid caching issues in live preview."

### 3. sanityFetch with Live Updates

**File: `/src/sanity/lib/live.ts`**
```typescript
export const { sanityFetch, SanityLive } = defineLive({
  client: client.withConfig({
    useCdn: false, // ✅ Correct
    stega: {
      enabled: true,
      studioUrl: process.env.NEXT_PUBLIC_SITE_URL
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/studio`
        : '/studio',
    },
  }),
  serverToken: process.env.SANITY_AUTH_TOKEN,
  browserToken: process.env.SANITY_AUTH_TOKEN, // ✅ Fixed in Phase 1
});
```

**Status:** ✅ Correctly configured BUT uses the base client that has `useCdn: true`

### 4. Aggressive Default Refresh Strategy

**Known Issue:** [#1649](https://github.com/sanity-io/next-sanity/issues/1649) - "VisualEditing's default revalidation strategy is a bit too aggressive"

**Problem:** 
- VisualEditing component revalidates the root layout on every mutation
- This purges the entire Vercel data cache
- Draft edits trigger cache purges for published content
- Results in full page refreshes

**Current Implementation:**
```typescript
// src/components/VisualEditingWrapper.tsx
export function VisualEditingWrapper() {
  return <VisualEditing />
}
```

**Missing:** Custom `refresh` handler to control revalidation scope

### 5. generateStaticParams Using Wrong Client

**Files:**
- `/src/app/(public)/blog/[slug]/page.tsx`
- `/src/app/(public)/case-studies/[slug]/page.tsx`

```typescript
import { client } from '@/lib/sanity/client'; // ❌ Uses @sanity/client

export async function generateStaticParams() {
  const projects = await client.fetch<{ slug: string }[]>(
    `*[_type == "project" && category == "Case Study"]{ "slug": slug.current }`
  )
  return projects.map((project) => ({
    slug: project.slug,
  }))
}
```

**Problem:** Uses the client with `perspective: 'published'` and `useCdn: true` in production

### 6. Package Versions

**File: `package.json`**
```json
{
  "next": "15.5.6",
  "next-sanity": "^11.6.2", // Latest (Nov 4, 2025)
  "@sanity/visual-editing": "^4.0.0",
  "sanity": "^4.11.0",
  "react": "19.1.0"
}
```

**Status:** ✅ All packages are current

**Recent next-sanity changes (v11.6.x):**
- Upgraded to @sanity/visual-editing v4
- Added experimental "use cache:remote" support
- Fixed revalidateTag warning with Next.js v16
- Multiple dependency updates to visual editing packages

---

## Root Causes Identified

### 1. **PRIMARY: useCdn: true in Draft Mode** (CRITICAL)
- **Where:** `/src/sanity/lib/client.ts` and `/src/app/api/draft-mode/enable/route.ts`
- **Impact:** 60-second CDN cache prevents immediate updates
- **Result:** Forces page refreshes to bypass cache

### 2. **SECONDARY: Dual Client Configuration** (HIGH)
- **Where:** Two separate client files with different configs
- **Impact:** Inconsistent behavior across the app
- **Result:** Some parts use CDN, some don't; confusion and bugs

### 3. **TERTIARY: Aggressive Default Refresh Strategy** (MEDIUM)
- **Where:** `VisualEditingWrapper` using default refresh behavior
- **Impact:** Full page revalidation on every mutation
- **Result:** Unnecessary refreshes even with browserToken working

### 4. **MINOR: No Perspective Switching** (LOW)
- **Where:** Clients don't switch perspective based on draft mode
- **Impact:** May fetch published instead of draft documents
- **Result:** Potentially stale content in preview

### 5. **MINOR: React 19 Strict Mode** (INFORMATIONAL)
- **Where:** Development mode double-mounting
- **Impact:** Extra renders during development
- **Result:** May appear as refreshes in dev (not production issue)

---

## Recommended Fixes (Priority Order)

### Fix 1: Consolidate to Single Client Configuration (CRITICAL)

**Goal:** Use one client configuration that adapts based on context

**Implementation:**

```typescript
// src/sanity/lib/client.ts
import { createClient } from 'next-sanity'
import { draftMode } from 'next/headers'
import { apiVersion, dataset, projectId } from '../env'

// Base client for all uses
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Always false for compatibility with live preview
})

// For draft mode contexts (use in API routes, page fetches)
export async function getClientForContext() {
  const isDraft = (await draftMode()).isEnabled
  
  return client.withConfig({
    perspective: isDraft ? 'previewDrafts' : 'published',
    useCdn: false, // Must be false for drafts
    ...(isDraft && { token: process.env.SANITY_AUTH_TOKEN }),
  })
}
```

**Files to Update:**
- `/src/sanity/lib/client.ts` - Update base client
- `/src/app/api/draft-mode/enable/route.ts` - Use new client
- `/src/lib/sanity/client.ts` - DELETE or merge
- All imports from `/src/lib/sanity/client` - Switch to `/src/sanity/lib/client`

**Impact:** 
- ✅ Eliminates CDN caching in draft mode
- ✅ Single source of truth for client config
- ✅ Proper perspective switching
- ⚠️ Requires updating ~20 import statements

### Fix 2: Add Custom Refresh Handler (HIGH)

**Goal:** Prevent aggressive full-page revalidation

**Implementation:**

```typescript
// src/components/VisualEditingWrapper.tsx
'use client'

import { VisualEditing } from 'next-sanity/visual-editing'
import { revalidateTag } from 'next/cache'

export function VisualEditingWrapper() {
  return (
    <VisualEditing
      refresh={async (payload) => {
        'use server'
        
        // Only revalidate for manual refresh or when live preview is disabled
        if (payload.source === 'manual') {
          // Manual refresh - revalidate specific content type
          await revalidateTag(payload.document._type)
        }
        
        // For mutations with live preview enabled, let WebSocket handle it
        // No revalidation needed - browserToken handles live updates
        if (payload.source === 'mutation' && payload.livePreviewEnabled) {
          return // Skip revalidation
        }
        
        // For mutations without live preview, revalidate that document type
        if (payload.source === 'mutation' && !payload.livePreviewEnabled) {
          await revalidateTag(payload.document._type)
        }
      }}
    />
  )
}
```

**Impact:**
- ✅ Prevents full page refreshes on mutations
- ✅ Lets WebSocket updates handle live changes
- ✅ Only revalidates when actually needed
- ⚠️ Requires Next.js server actions

### Fix 3: Update Draft Mode API Route (MEDIUM)

**Goal:** Use correct client configuration for draft mode

**Implementation:**

```typescript
// src/app/api/draft-mode/enable/route.ts
import { defineEnableDraftMode } from 'next-sanity/draft-mode'
import { client } from '@/sanity/lib/client'

export const { GET } = defineEnableDraftMode({
  client: client.withConfig({
    token: process.env.SANITY_AUTH_TOKEN,
    useCdn: false, // Explicit: no CDN for drafts
    perspective: 'previewDrafts', // Explicit: fetch drafts
  }),
})
```

**Impact:**
- ✅ Ensures draft mode API uses correct settings
- ✅ No CDN caching for draft content
- ✅ Proper perspective for preview

### Fix 4: Tag sanityFetch Calls for Targeted Revalidation (LOW)

**Goal:** Enable granular cache invalidation

**Implementation:**

```typescript
// In page.tsx files
const { data: post } = await sanityFetch({
  query: blogPostBySlugQuery,
  params: { slug },
  tags: ['blog', `blog:${slug}`], // Add specific tags
});
```

**Impact:**
- ✅ Allows revalidating specific pages/types
- ✅ Prevents over-revalidation
- ⚠️ Requires updating all sanityFetch calls

### Fix 5: Optimize Live.ts Configuration (OPTIONAL)

**Current Status:** ✅ Already correct, but verify

```typescript
// src/sanity/lib/live.ts - CURRENT (verify this is still correct after Fix 1)
export const { sanityFetch, SanityLive } = defineLive({
  client: client.withConfig({
    useCdn: false, // ✅ Correct
    stega: {
      enabled: true,
      studioUrl: process.env.NEXT_PUBLIC_SITE_URL
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/studio`
        : '/studio',
    },
  }),
  serverToken: process.env.SANITY_AUTH_TOKEN, // ✅ Correct
  browserToken: process.env.SANITY_AUTH_TOKEN, // ✅ Fixed in Phase 1
});
```

**Action:** Verify this still works after consolidating clients

---

## Testing Strategy

### Test 1: Draft Mode Client Configuration
```bash
# 1. Enable draft mode
curl http://localhost:3000/api/draft-mode/enable?secret=YOUR_SECRET

# 2. Check cookies in browser dev tools
# Should see: __prerender_bypass, __next_preview_data

# 3. Make change in Sanity Studio
# 4. Wait 5 seconds (should NOT need to wait 60 seconds)
# 5. Verify change appears without refresh
```

**Expected:** Changes appear within 5 seconds without page refresh

### Test 2: Visual Editing Refresh Handler
```bash
# 1. Open Presentation mode in Sanity Studio
# 2. Edit a blog post title
# 3. Watch Network tab in browser dev tools
# 4. Count full page refreshes
```

**Expected:** 
- With fix: 0 full page refreshes (WebSocket update only)
- Without fix: 1+ full page refreshes

### Test 3: CDN Caching Verification
```bash
# 1. Open Network tab
# 2. Look for Sanity API requests
# 3. Check response headers for cache indicators
```

**Expected:**
- In draft mode: `Cache-Control: no-cache` or similar
- No `cdn.sanity.io` requests in draft mode

### Test 4: Static Generation
```bash
npm run build
# Verify build completes without errors
# Check .next/server/app for pre-rendered pages
```

**Expected:** Static generation still works for blog/case-studies

### Test 5: Production Deployment
```bash
# Deploy to Vercel
# Test Presentation mode in production
# Verify no regressions
```

**Expected:** Same behavior as local development

---

## Known Limitations

### Expected Refreshes (NOT bugs)

1. **Manual "Refresh" button in Presentation Tool**
   - This SHOULD trigger a refresh
   - It's a feature, not a bug

2. **First-time draft mode activation**
   - Initial draft mode enable may refresh once
   - This is normal Next.js behavior

3. **Schema changes in Sanity Studio**
   - Changing schema may require refresh
   - Not related to content mutations

### Remaining Technical Debt

1. **Two separate API versions**
   - `/src/sanity/env.ts`: `2025-10-28`
   - `/src/lib/sanity/client.ts`: `2024-01-01`
   - Should be unified

2. **Mixed import patterns**
   - Some files import from `@/lib/sanity/client`
   - Some import from `@/sanity/lib/client`
   - Creates confusion

3. **No TypeScript guards for perspective**
   - No compile-time checks for correct perspective usage
   - Could add branded types

---

## Implementation Roadmap

### Phase 1: Critical Fix (1-2 hours)
- [ ] Update `/src/sanity/lib/client.ts` to `useCdn: false`
- [ ] Update `/src/app/api/draft-mode/enable/route.ts` with explicit config
- [ ] Test draft mode activation and content updates
- [ ] Verify no regressions in static generation

### Phase 2: Consolidation (2-3 hours)
- [ ] Create `getClientForContext()` helper
- [ ] Update all imports from `/src/lib/sanity/client` to `/src/sanity/lib/client`
- [ ] Delete `/src/lib/sanity/client.ts` (keep only urlFor helper)
- [ ] Update all `client.fetch()` calls to use context-aware client
- [ ] Test all pages still render correctly

### Phase 3: Refresh Optimization (1-2 hours)
- [ ] Implement custom refresh handler in VisualEditingWrapper
- [ ] Add tags to sanityFetch calls
- [ ] Test mutation updates don't trigger full refreshes
- [ ] Verify manual refresh button still works

### Phase 4: Verification (1 hour)
- [ ] Run all test scenarios
- [ ] Deploy to staging/preview
- [ ] User acceptance testing in Presentation mode
- [ ] Performance testing (compare before/after)

**Total Estimated Time:** 5-8 hours

---

## Success Metrics

### Before Fixes
- ❌ Page refreshes on every mutation in Presentation mode
- ❌ 60-second delay for CDN cache to clear
- ❌ Inconsistent behavior between dev and production
- ❌ Full page revalidation on all changes

### After Fixes
- ✅ No page refreshes on mutations (WebSocket updates only)
- ✅ Changes appear within 2-5 seconds
- ✅ Consistent behavior across environments
- ✅ Targeted revalidation for manual refreshes only

---

## Additional Research

### Relevant GitHub Issues
1. [#1649 - VisualEditing's default revalidation strategy is a bit too aggressive](https://github.com/sanity-io/next-sanity/issues/1649)
2. [#567 - Realtime updates don't work](https://github.com/sanity-io/visual-editing/issues/567) - Fixed in @sanity/react-loader 1.6.4

### Official Documentation
- [Visual Editing with Next.js App Router](https://www.sanity.io/docs/visual-editing/visual-editing-with-next-js-app-router)
- [Client API CDN configuration](https://www.sanity.io/docs/help/js-client-cdn-configuration)
- [Presentation Tool Guide](https://www.sanity.io/guides/sanity-presentation-with-nextjs)

---

## Conclusion

The persistent refresh issue in Sanity Presentation mode is caused by **multiple compounding factors**, with the **critical root cause** being CDN caching enabled for draft mode. The fix requires:

1. **Immediate:** Disable CDN for draft/preview contexts
2. **Short-term:** Consolidate client configurations
3. **Medium-term:** Implement custom refresh handler

All fixes are straightforward and well-documented. The primary complexity is in coordinating the changes across multiple files and ensuring no regressions in static generation.

**Recommendation:** Implement fixes in phases, testing thoroughly after each phase.

---

**Document Version:** 1.0  
**Last Updated:** November 7, 2025  
**Next Review:** After Phase 1 implementation

---

## Appendix A: Visual Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                     SANITY PRESENTATION MODE                        │
│                    (Studio iframe integration)                      │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             │ 1. Enable Draft Mode
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  /api/draft-mode/enable/route.ts                                    │
│  ┌────────────────────────────────────────────────────┐             │
│  │ import { client } from '@/sanity/lib/client'       │             │
│  │                                                    │             │
│  │ defineEnableDraftMode({                           │             │
│  │   client: client.withConfig({                     │             │
│  │     token: SANITY_AUTH_TOKEN,                     │             │
│  │   })                                              │             │
│  │ })                                                │             │
│  └────────────────────────────────────────────────────┘             │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             │ Uses client from...
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  /src/sanity/lib/client.ts  ❌ PROBLEM 1                            │
│  ┌────────────────────────────────────────────────────┐             │
│  │ createClient({                                     │             │
│  │   projectId,                                       │             │
│  │   dataset,                                         │             │
│  │   apiVersion,                                      │             │
│  │   useCdn: true,  ⚠️ ALWAYS TRUE - CAUSES CACHING   │             │
│  │ })                                                 │             │
│  └────────────────────────────────────────────────────┘             │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             │ Meanwhile, pages use...
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  /src/lib/sanity/client.ts  ❌ PROBLEM 2                            │
│  ┌────────────────────────────────────────────────────┐             │
│  │ createClient({                                     │             │
│  │   projectId,                                       │             │
│  │   dataset,                                         │             │
│  │   apiVersion: '2024-01-01',  ⚠️ DIFFERENT VERSION  │             │
│  │   useCdn: NODE_ENV === 'production',               │             │
│  │   perspective: 'published',  ⚠️ ALWAYS PUBLISHED   │             │
│  │ })                                                 │             │
│  └────────────────────────────────────────────────────┘             │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             │ Both feed into...
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  /src/sanity/lib/live.ts                                            │
│  ┌────────────────────────────────────────────────────┐             │
│  │ defineLive({                                       │             │
│  │   client: client.withConfig({                     │             │
│  │     useCdn: false,  ✅ CORRECT                     │             │
│  │     stega: { enabled: true }                      │             │
│  │   }),                                              │             │
│  │   serverToken: SANITY_AUTH_TOKEN,  ✅ CORRECT     │             │
│  │   browserToken: SANITY_AUTH_TOKEN, ✅ PHASE 1 FIX │             │
│  │ })                                                 │             │
│  └────────────────────────────────────────────────────┘             │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             │ Powers...
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Page Rendering with sanityFetch()                                  │
│  ┌────────────────────────────────────────────────────┐             │
│  │ const { data } = await sanityFetch({               │             │
│  │   query,                                           │             │
│  │   params,                                          │             │
│  │ })                                                 │             │
│  └────────────────────────────────────────────────────┘             │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             │ Rendered with...
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Client-side: <SanityLive /> + <VisualEditingWrapper />             │
│  ┌────────────────────────────────────────────────────┐             │
│  │ <SanityLive /> - WebSocket connection ✅           │             │
│  │ <VisualEditing /> - No custom refresh ❌           │             │
│  │                                                    │             │
│  │ Default behavior: Revalidate root layout on       │             │
│  │ every mutation ⚠️ PROBLEM 3                        │             │
│  └────────────────────────────────────────────────────┘             │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                         THE RESULT                                   │
│                                                                      │
│  1. User edits content in Studio ──────────────────┐                │
│  2. Mutation event fired                          │                │
│  3. VisualEditing triggers revalidateTag('/')  ◄──┘                │
│  4. Full page cache purged                                          │
│  5. Page refreshes to fetch new data                                │
│  6. WebSocket update arrives (too late)                             │
│                                                                      │
│  USER SEES: Flash/flicker as page reloads ❌                        │
│  USER EXPECTS: Smooth in-place update ✅                            │
└─────────────────────────────────────────────────────────────────────┘
```

## Appendix B: Data Flow Comparison

### CURRENT (Buggy) Flow

```
Studio Edit
    │
    ├──[WebSocket]────────────────────┐
    │                                 │
    └──[Mutation Event]               │
            │                         │
            ▼                         │
    VisualEditing.refresh()           │
            │                         │
            ▼                         │
    revalidateTag('/')                │
            │                         │
            ▼                         │
    FULL PAGE REFRESH ❌              │
            │                         │
            ▼                         ▼
    New data fetched            WebSocket update
    (from CDN cache 60s old)    (fresh data, too late)
```

### FIXED (Expected) Flow

```
Studio Edit
    │
    ├──[WebSocket]───────────────────────┐
    │                                    │
    └──[Mutation Event]                  │
            │                            │
            ▼                            │
    VisualEditing.refresh()              │
            │                            │
            ▼                            │
    Check: livePreviewEnabled? ✅        │
            │                            │
            ▼                            │
    SKIP revalidation                    │
    (let WebSocket handle it)            │
            │                            ▼
            └──────────────────> WebSocket update
                                  (fresh data, instant)
                                         │
                                         ▼
                                 IN-PLACE UPDATE ✅
                                 (no refresh)
```

---

## Appendix C: File Impact Matrix

### Files Requiring Changes

| File | Change Type | Priority | LOC | Risk |
|------|-------------|----------|-----|------|
| `/src/sanity/lib/client.ts` | Modify config | CRITICAL | 1 | Low |
| `/src/app/api/draft-mode/enable/route.ts` | Add explicit config | HIGH | 3 | Low |
| `/src/components/VisualEditingWrapper.tsx` | Add refresh handler | HIGH | 20 | Medium |
| `/src/lib/sanity/client.ts` | DELETE or merge | MEDIUM | -16 | Medium |
| `/src/app/(public)/blog/[slug]/page.tsx` | Change import | MEDIUM | 1 | Low |
| `/src/app/(public)/case-studies/[slug]/page.tsx` | Change import | MEDIUM | 1 | Low |
| All other imports (17 files) | Change import path | LOW | 17 | Low |

### Import Changes Required

```bash
# Find all files importing from old client
grep -r "from '@/lib/sanity/client'" --include="*.tsx" --include="*.ts" src/

# Expected count: ~20 files
```

**Strategy:** 
1. Update client config first (low risk)
2. Test draft mode works
3. Then migrate imports one-by-one
4. Delete old client last

---

## Appendix D: Environment Variables Checklist

Ensure these are set in `.env.local` and Vercel:

```bash
# Required for draft mode
SANITY_AUTH_TOKEN=sk...  # Viewer token (read + drafts)

# Required for Sanity client
NEXT_PUBLIC_SANITY_PROJECT_ID=5n331bys
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-10-28

# Required for Presentation Tool preview URL
NEXT_PUBLIC_SITE_URL=https://your-domain.com  # Or http://localhost:3000 for dev
```

**Verification:**
```bash
# Check all required env vars are set
node -e "console.log(process.env.SANITY_AUTH_TOKEN ? '✅ Token set' : '❌ Missing token')"
```

---

**End of Document**
