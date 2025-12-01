# Plan: Sanity Caching Architecture — Portfolio Site

**Date:** 2025-12-01
**Tags:** performance, caching, sanity, lighthouse, architecture

## Objective

Enable proper caching for Sanity CMS content so that:
1. Regular visitors get fast, CDN-cached responses
2. Content editors still get live preview updates
3. Cache invalidates automatically when CMS content changes

**Expected impact:** Significant Lighthouse performance improvement by eliminating server-side Sanity fetch latency on each page request.

## Background

### Current Problem

The site is configured for **live preview mode**, not production caching:

```typescript
// src/sanity/lib/live.ts
export const { sanityFetch, SanityLive } = defineLive({
  client: client.withConfig({ useCdn: false }),  // No CDN
  ...
})
```

**Result:** Every page request fetches fresh data from Sanity API:
- Homepage: 3 Sanity queries per request
- Every page: At least 1 query (footer) + page-specific queries
- No caching between requests
- ~200-500ms added latency per request

### Current Architecture

| Component | Location | Current Behavior |
|-----------|----------|------------------|
| `sanityFetch` | `src/sanity/lib/live.ts` | Always fetches fresh (no cache) |
| `client` | `src/sanity/lib/client.ts` | `useCdn: false` |
| Pages using fetch | 8 pages + 1 layout | All use `sanityFetch` |
| Webhook handler | `src/app/api/webhooks/sanity/route.ts` | Calls `revalidatePath()` but pages aren't cached |
| Draft mode | `src/app/api/draft-mode/enable/route.ts` | Exists but not utilized for caching decisions |

### Pages Affected

1. `src/app/(public)/page.tsx` - Homepage (3 queries)
2. `src/app/(public)/about/page.tsx` - About page
3. `src/app/(public)/blog/page.tsx` - Blog listing
4. `src/app/(public)/blog/[slug]/page.tsx` - Blog posts
5. `src/app/(public)/case-studies/page.tsx` - Case studies listing
6. `src/app/(public)/case-studies/[slug]/page.tsx` - Case study detail
7. `src/app/(public)/contact/page.tsx` - Contact page
8. `src/app/(public)/layout.tsx` - Public layout (footer query)

## Requirements

### Must Have
- CDN-cached responses for regular visitors
- Live preview still works for editors in draft mode
- Cache invalidates when CMS content changes (via webhook)
- No breaking changes to existing functionality
- Rollback path if issues arise

### Nice to Have
- Minimal code changes
- Clear separation of concerns
- Easy to understand caching behavior

## Approach Options

### Option A: Dual Client with Smart Fetch Helper

Create two Sanity clients and a helper that chooses based on draft mode:

```typescript
// Production client (CDN enabled)
export const productionClient = createClient({ useCdn: true })

// cachedSanityFetch - uses CDN for visitors, live for editors
export async function cachedSanityFetch({ query, params, tags }) {
  const isDraftMode = (await draftMode()).isEnabled

  if (isDraftMode) {
    return liveSanityFetch({ query, params })  // Real-time
  }

  return productionClient.fetch(query, params, {
    next: { tags: ['sanity', ...tags] }  // Cached
  })
}
```

**Pros:**
- Clear separation between production and preview
- Full control over caching behavior
- Works with existing webhook `revalidatePath()`

**Cons:**
- Need to update all 8 pages + layout to use new helper
- Two clients to maintain
- More code

### Option B: Configure defineLive with Caching

Modify the existing `defineLive` setup to enable caching:

```typescript
export const { sanityFetch, SanityLive } = defineLive({
  client: client.withConfig({
    useCdn: process.env.NODE_ENV === 'production',  // CDN in production
  }),
  ...
})
```

**Pros:**
- Minimal code changes
- No need to update pages

**Cons:**
- `defineLive` may override caching settings for live preview features
- Less control over behavior
- May not work as expected (needs testing)

### Option C: Use Route Segment Config

Add caching at the page level using Next.js route segment config:

```typescript
// In each page.tsx
export const revalidate = false  // Cache until webhook invalidates
```

**Pros:**
- No changes to Sanity setup
- Standard Next.js pattern

**Cons:**
- `sanityFetch` from `defineLive` may bypass this
- Need to add to every page
- Unclear interaction with live preview

## Recommended Approach: Option A (Dual Client)

Option A provides the clearest separation and most predictable behavior.

## Implementation Plan

### Phase 1: Create Caching Infrastructure

**Files to create/modify:**

1. **`src/sanity/lib/client.ts`** - Add production client
   ```typescript
   // Existing client stays for live preview
   export const client = createClient({ useCdn: false })

   // New production client with CDN
   export const productionClient = createClient({ useCdn: true })
   ```

2. **`src/sanity/lib/fetch.ts`** - Create smart fetch helper
   ```typescript
   export async function cachedSanityFetch<T>({
     query,
     params,
     tags
   }): Promise<{ data: T }> {
     const isDraftMode = (await draftMode()).isEnabled

     if (isDraftMode) {
       return sanityFetch({ query, params })
     }

     const data = await productionClient.fetch(query, params, {
       next: {
         revalidate: false,
         tags: ['sanity', ...tags]
       }
     })
     return { data }
   }
   ```

### Phase 2: Update Pages (One at a Time)

Update each page to use `cachedSanityFetch`:

```typescript
// Before
import { sanityFetch } from "@/sanity/lib/live"

// After
import { cachedSanityFetch } from "@/sanity/lib/fetch"
```

**Order of updates:**
1. Homepage (`page.tsx`) - Most impact, test thoroughly
2. Public layout (`layout.tsx`) - Affects all pages
3. About page
4. Case studies listing
5. Case study detail pages
6. Blog listing
7. Blog post detail pages
8. Contact page

### Phase 3: Update Webhook for Tag-Based Invalidation

Enhance webhook to use `revalidateTag()` in addition to `revalidatePath()`:

```typescript
import { revalidateTag } from 'next/cache'

// In revalidateForDocument():
revalidateTag('sanity')  // Invalidate all Sanity content
revalidateTag(`sanity-${documentType}`)  // Type-specific
```

### Phase 4: Testing & Verification

1. **Production caching test:**
   - Deploy to Vercel preview
   - Check response headers for caching
   - Verify page loads are fast (no Sanity fetch on each request)

2. **Draft mode test:**
   - Enable draft mode via Sanity Studio
   - Verify live updates still work
   - Confirm preview shows fresh content

3. **Webhook test:**
   - Update content in Sanity
   - Verify webhook fires
   - Confirm cache invalidates
   - Check updated content appears

4. **Lighthouse test:**
   - Run PageSpeed Insights
   - Compare before/after scores
   - Document improvement

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Draft mode stops working | Medium | High | Test thoroughly before deploying; keep live client available |
| Webhook fails to invalidate | Medium | Medium | Add fallback revalidation; monitor webhook logs |
| Stale content shown | Medium | Medium | Short `revalidate` time as fallback; clear documentation |
| Breaking changes to pages | Low | High | Update one page at a time; test each |
| CDN cache too aggressive | Low | Medium | Configure cache headers; add revalidate fallback |

## Rollback Plan

If issues arise:

1. **Immediate:** Change import back to `sanityFetch` from `live.ts`
2. **Quick fix:** Set `useCdn: false` in production client
3. **Full rollback:** Revert all changes via git

Keep the original `sanityFetch` from `live.ts` available throughout - only change imports, don't delete the live fetching capability.

## Success Criteria

- [ ] Lighthouse performance score improves (target: 75+)
- [ ] Regular page loads don't fetch from Sanity API
- [ ] Draft mode preview still works
- [ ] Content updates appear within 30 seconds of webhook
- [ ] No visual or functional regressions

## Open Questions

1. Should we add a time-based revalidation as fallback (e.g., `revalidate: 3600`)?
2. Do we need granular cache tags per page, or is `sanity` sufficient?
3. Should the footer be cached separately with its own tag?
4. How do we verify CDN caching is working in Vercel?

## Estimated Effort

| Phase | Estimated Time |
|-------|----------------|
| Phase 1: Infrastructure | 30 minutes |
| Phase 2: Update pages | 45 minutes |
| Phase 3: Webhook updates | 15 minutes |
| Phase 4: Testing | 1 hour |
| **Total** | ~2.5 hours |

## Related Documentation

- [Lighthouse Performance Research](../research/RESEARCH_2025-12-01_lighthouse-performance-optimization.md)
- [Next.js Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [next-sanity Documentation](https://github.com/sanity-io/next-sanity)
