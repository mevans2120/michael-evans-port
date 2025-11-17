# Sanity Cache Revalidation Plan

**Status:** Planning Phase
**Created:** November 16, 2025
**Author:** Claude Code

---

## Executive Summary

This plan details the implementation of smart, targeted cache revalidation for the Michael Evans portfolio site. When content is published in Sanity CMS, the site will automatically revalidate only the affected pages, ensuring fresh content without the nuclear "revalidate everything" approach.

**Key Principles:**
- Publish-only triggers (ignore draft saves)
- Surgical revalidation (only affected paths)
- Type-specific logic (different content types → different paths)
- Maintains existing chatbot sync functionality

---

## Current State Analysis

### Existing Webhook Implementation

**File:** `/src/app/api/webhooks/sanity/route.ts`

**Current Behavior:**
- ✅ Signature verification working
- ✅ Filters for supported types: `project`, `profile`, `aiProject`
- ✅ Syncs to vector database (chatbot)
- ❌ No cache revalidation
- ❌ No publish/draft filtering

**Environment:**
- `SANITY_WEBHOOK_SECRET` configured in `.env.example`
- Webhook URL: `/api/webhooks/sanity`

### Existing Revalidation Infrastructure

**File:** `/src/app/actions/revalidate.ts`

**Current Usage:**
- Only used by Presentation Mode (visual editing)
- Uses `revalidateTag()` for document types
- Not connected to webhook

### Sanity Content Types

Based on schema analysis, the site has:

**Documents:**
1. `project` - Case studies (has slug)
2. `blog` - Blog posts (has slug)
3. `profile` - About page content (singleton)
4. `homepageHero` - Homepage content (singleton)
5. `contactPage` - Contact page content (singleton)
6. `blogIndexPage` - Blog listing page config (singleton)
7. `caseStudiesIndexPage` - Case studies listing config (singleton)
8. `footer` - Footer content (singleton)
9. `seoSettings` - Global SEO settings (singleton)
10. `chatPrompts` - Chatbot configuration (singleton)
11. `viewMoreProjectsSettings` - Project navigation (singleton)

**Note:** The webhook currently only processes `project`, `profile`, and `aiProject` for chatbot sync, but should revalidate ALL types that affect the website.

---

## Path-to-Content-Type Mapping

This table shows which pages need revalidation when each content type is published:

### Individual Documents (with slugs)

| Content Type | Affected Paths | Reasoning |
|--------------|----------------|-----------|
| `project` | `/case-studies/[slug]`<br>`/case-studies`<br>`/` (if featured) | Direct page + listings + homepage featured |
| `blog` | `/blog/[slug]`<br>`/blog`<br>`/` (if featured) | Direct page + listings + homepage featured |

### Singleton Documents (no slug)

| Content Type | Affected Paths | Reasoning |
|--------------|----------------|-----------|
| `profile` | `/about` | Profile page |
| `homepageHero` | `/` | Homepage hero section |
| `contactPage` | `/contact` | Contact page |
| `blogIndexPage` | `/blog` | Blog listing page |
| `caseStudiesIndexPage` | `/case-studies` | Case studies listing |
| `footer` | `/`<br>`/about`<br>`/blog`<br>`/case-studies`<br>`/contact`<br>`/case-studies/[all]`<br>`/blog/[all]` | Footer appears on all pages |
| `seoSettings` | `/`<br>`/about`<br>`/blog`<br>`/case-studies`<br>`/contact`<br>`/case-studies/[all]`<br>`/blog/[all]` | Global SEO affects all pages |
| `chatPrompts` | None | Chatbot only, no page revalidation |
| `viewMoreProjectsSettings` | `/case-studies/[all]` | Appears on case study pages |

### Special Cases

**Featured Projects:**
- When a `project` is published with `featured: true`, must revalidate `/` (homepage)
- Homepage queries: `*[_type == "project" && featured == true]`

**Featured Blog Posts:**
- When a `blog` post is published with `featured: true`, must revalidate `/` (homepage)
- Homepage queries: Featured blog post query

---

## Phased Implementation Plan

### Phase 1: Webhook Enhancement - Publish Detection

**Goal:** Filter webhook to only process publish events (not drafts)

**Changes:**
1. Update webhook payload interface to include `_rev` and published status
2. Add publish detection logic
3. Add logging to show draft vs. publish events

**Implementation:**

```typescript
// Enhanced payload interface
interface SanityWebhookPayload {
  _id: string;
  _type: string;
  _rev: string;
  slug?: {
    current: string;
  };
  title?: string;
  // Sanity includes these on publish
  _createdAt?: string;
  _updatedAt?: string;
}

// Publish detection
function isPublishEvent(payload: SanityWebhookPayload): boolean {
  // Sanity doesn't send explicit "event type" in webhook body
  // but we can detect draft IDs (they start with "drafts.")
  const isDraft = payload._id.startsWith('drafts.');
  
  // Only process if it's NOT a draft
  return !isDraft;
}
```

**Testing:**
1. Save a project as draft → webhook should log but skip processing
2. Publish a project → webhook should process normally

**Files Modified:**
- `/src/app/api/webhooks/sanity/route.ts`

---

### Phase 2: Revalidation Logic - Core Implementation

**Goal:** Add targeted revalidation based on content type

**Changes:**
1. Create revalidation mapping function
2. Integrate `revalidatePath()` into webhook
3. Add detailed logging

**Implementation:**

```typescript
import { revalidatePath } from 'next/cache';

/**
 * Determine which paths to revalidate based on document type and content
 */
async function getRevalidationPaths(
  documentType: string,
  documentId: string,
  payload: SanityWebhookPayload
): Promise<string[]> {
  const paths: string[] = [];

  switch (documentType) {
    case 'project':
      // Always revalidate the specific project page
      if (payload.slug?.current) {
        paths.push(`/case-studies/${payload.slug.current}`);
      }
      
      // Always revalidate case studies index
      paths.push('/case-studies');
      
      // Check if featured (requires additional query)
      // For Phase 2, we'll revalidate homepage for ALL projects
      // Phase 3 will optimize this
      paths.push('/');
      break;

    case 'blog':
      if (payload.slug?.current) {
        paths.push(`/blog/${payload.slug.current}`);
      }
      paths.push('/blog');
      paths.push('/'); // Featured posts on homepage
      break;

    case 'profile':
      paths.push('/about');
      break;

    case 'homepageHero':
      paths.push('/');
      break;

    case 'contactPage':
      paths.push('/contact');
      break;

    case 'blogIndexPage':
      paths.push('/blog');
      break;

    case 'caseStudiesIndexPage':
      paths.push('/case-studies');
      break;

    case 'footer':
    case 'seoSettings':
      // These affect all pages - revalidate key pages
      paths.push('/');
      paths.push('/about');
      paths.push('/blog');
      paths.push('/case-studies');
      paths.push('/contact');
      break;

    case 'viewMoreProjectsSettings':
      // Appears on all case study detail pages
      // For now, just revalidate the index
      // Phase 4 will handle dynamic pages
      paths.push('/case-studies');
      break;

    case 'chatPrompts':
      // No page revalidation needed
      break;

    default:
      logger.log(`   ⚠️  Unknown document type for revalidation: ${documentType}`);
  }

  return paths;
}
```

**Testing:**
1. Publish a project → verify `/case-studies/[slug]`, `/case-studies`, `/` revalidated
2. Publish blog post → verify `/blog/[slug]`, `/blog`, `/` revalidated
3. Update footer → verify all main pages revalidated
4. Check logs show which paths were revalidated

**Files Modified:**
- `/src/app/api/webhooks/sanity/route.ts`

---

### Phase 3: Smart Featured Detection

**Goal:** Only revalidate homepage when actually necessary

**Problem:** Phase 2 revalidates homepage for ALL project/blog changes, even if not featured

**Solution:** Query Sanity to check if document is featured before revalidating homepage

**Implementation:**

```typescript
import { client } from '@/sanity/lib/client';

async function isDocumentFeatured(
  documentId: string,
  documentType: string
): Promise<boolean> {
  try {
    const result = await client.fetch(
      `*[_id == $id && _type == $type][0].featured`,
      { id: documentId, type: documentType }
    );
    return result === true;
  } catch (error) {
    logger.error('Error checking featured status:', error);
    // Default to true (revalidate to be safe)
    return true;
  }
}

// Updated revalidation logic
case 'project':
case 'blog':
  if (payload.slug?.current) {
    paths.push(`/${documentType === 'project' ? 'case-studies' : 'blog'}/${payload.slug.current}`);
  }
  
  paths.push(documentType === 'project' ? '/case-studies' : '/blog');
  
  // SMART: Only revalidate homepage if featured
  const featured = await isDocumentFeatured(documentId, documentType);
  if (featured) {
    paths.push('/');
  }
  break;
```

**Testing:**
1. Publish non-featured project → verify homepage NOT revalidated
2. Publish featured project → verify homepage IS revalidated
3. Change project from featured to non-featured → verify homepage revalidated

**Files Modified:**
- `/src/app/api/webhooks/sanity/route.ts`

---

### Phase 4: Dynamic Path Revalidation

**Goal:** Revalidate ALL dynamic pages for global content changes

**Problem:** When `footer` or `seoSettings` change, we need to revalidate not just index pages, but ALL blog posts and case studies

**Challenges:**
- Can't enumerate all possible paths (hundreds of posts)
- Next.js has no "revalidate all pages with pattern" API

**Solutions (Pick One):**

**Option A: Revalidate on-demand (recommended)**
- Keep Phase 3 implementation
- Accept that dynamic pages won't update until someone visits them
- Next.js ISR will regenerate on first visit after cache expiry
- Set reasonable revalidation timers on pages (e.g., 3600 seconds)

**Option B: Query and revalidate all slugs**
```typescript
case 'footer':
case 'seoSettings':
  // Revalidate all main pages
  paths.push('/', '/about', '/blog', '/case-studies', '/contact');
  
  // Query all blog slugs
  const blogSlugs = await client.fetch(`*[_type == "blog"]{"slug": slug.current}`);
  blogSlugs.forEach((post: any) => paths.push(`/blog/${post.slug}`));
  
  // Query all project slugs
  const projectSlugs = await client.fetch(`*[_type == "project"]{"slug": slug.current}`);
  projectSlugs.forEach((project: any) => paths.push(`/case-studies/${project.slug}`));
  break;
```

**Option C: Hybrid approach**
- Use Option A for most changes
- Add a manual "Clear All Caches" button in admin dashboard for rare global changes
- Use `revalidateTag()` if we tag all pages with content type tags

**Recommendation:** Start with Option A, add Option C if needed

**Testing:**
1. Update footer → verify main pages revalidated
2. Visit old blog post → verify it shows updated footer on next visit
3. Monitor performance and decide if Option B needed

**Files Modified:**
- `/src/app/api/webhooks/sanity/route.ts`
- (Optional) Admin dashboard for manual cache clear

---

### Phase 5: Error Handling & Monitoring

**Goal:** Robust error handling and observability

**Changes:**
1. Wrap revalidation in try-catch blocks
2. Log successes and failures separately
3. Return detailed status in webhook response
4. Add retry logic for failed revalidations

**Implementation:**

```typescript
interface RevalidationResult {
  path: string;
  success: boolean;
  error?: string;
}

async function revalidatePathsWithLogging(
  paths: string[]
): Promise<RevalidationResult[]> {
  const results: RevalidationResult[] = [];

  for (const path of paths) {
    try {
      await revalidatePath(path);
      results.push({ path, success: true });
      logger.log(`   ✅ Revalidated: ${path}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      results.push({ path, success: false, error: errorMessage });
      logger.error(`   ❌ Failed to revalidate ${path}:`, errorMessage);
    }
  }

  return results;
}

// Updated webhook response
return NextResponse.json({
  success: true,
  documentId,
  documentType,
  chatbotSync: {
    added: result.added,
    updated: result.updated,
    deleted: result.deleted,
    unchanged: result.unchanged,
    totalChunks: result.totalChunks,
  },
  cacheRevalidation: {
    pathsRevalidated: revalidationResults.filter(r => r.success).length,
    pathsFailed: revalidationResults.filter(r => !r.success).length,
    details: revalidationResults,
  },
});
```

**Testing:**
1. Publish content → verify detailed response shows revalidation results
2. Simulate failure → verify error logged but webhook still succeeds
3. Check Vercel logs for revalidation events

**Files Modified:**
- `/src/app/api/webhooks/sanity/route.ts`

---

## Sanity Webhook Configuration

### Step 1: Access Sanity Project

1. Go to https://www.sanity.io/manage
2. Select project: `5n331bys`
3. Navigate to **API** → **Webhooks**

### Step 2: Create Webhook

**Settings:**
```
Name: Production Cache Revalidation
URL: https://your-production-domain.vercel.app/api/webhooks/sanity
Dataset: production
Trigger on: Create, Update, Delete
HTTP method: POST
HTTP Headers: (none required, signature in header)
Secret: [Use SANITY_WEBHOOK_SECRET from .env]
API version: v2021-03-25
```

**Filters (optional, but recommended):**
```groq
// Only trigger on published documents (not drafts)
!(_id in path("drafts.**"))
```

### Step 3: Verify Environment Variables

**Local (`.env.local`):**
```bash
SANITY_WEBHOOK_SECRET=your-webhook-secret-here
```

**Production (Vercel Dashboard):**
1. Go to Vercel project settings
2. Environment Variables
3. Add `SANITY_WEBHOOK_SECRET` with same value

### Step 4: Test Webhook

**In Sanity Dashboard:**
1. Go to webhook settings
2. Click **"Trigger"** to send test event
3. Check Vercel logs for response

**Manual Test:**
```bash
curl -X POST https://your-domain.vercel.app/api/webhooks/sanity \
  -H "Content-Type: application/json" \
  -H "sanity-webhook-signature: sha256=$(echo -n '{"_id":"test","_type":"project"}' | openssl dgst -sha256 -hmac 'your-secret' | cut -d' ' -f2)" \
  -d '{"_id":"test","_type":"project","slug":{"current":"test"}}'
```

### Step 5: Monitor

1. Check Vercel logs after publishing in Sanity
2. Look for revalidation success messages
3. Verify pages update within 30 seconds

---

## Testing Strategy

### Unit Tests

**Test Publish Detection:**
```typescript
describe('isPublishEvent', () => {
  it('should return false for draft IDs', () => {
    expect(isPublishEvent({ _id: 'drafts.abc123', _type: 'project' })).toBe(false);
  });

  it('should return true for published IDs', () => {
    expect(isPublishEvent({ _id: 'abc123', _type: 'project' })).toBe(true);
  });
});
```

**Test Path Mapping:**
```typescript
describe('getRevalidationPaths', () => {
  it('should return correct paths for project', async () => {
    const paths = await getRevalidationPaths('project', 'id', {
      _id: 'id',
      _type: 'project',
      slug: { current: 'test-project' }
    });
    expect(paths).toContain('/case-studies/test-project');
    expect(paths).toContain('/case-studies');
  });
});
```

### Integration Tests

**Phase 1 Test:**
1. Create draft project in Sanity
2. Save (don't publish)
3. Verify webhook logs "Draft detected, skipping revalidation"
4. Publish project
5. Verify webhook logs "Processing publish event"

**Phase 2 Test:**
1. Publish project with slug "test-case-study"
2. Check Vercel logs for:
   - "Revalidated: /case-studies/test-case-study"
   - "Revalidated: /case-studies"
   - "Revalidated: /"
3. Visit pages and verify content updated

**Phase 3 Test:**
1. Create non-featured project
2. Publish
3. Verify homepage NOT in revalidation logs
4. Create featured project
5. Publish
6. Verify homepage IS in revalidation logs

**Phase 4 Test:**
1. Update footer
2. Verify all main pages revalidated
3. Visit existing blog post
4. Verify footer updated

**Phase 5 Test:**
1. Simulate revalidation failure (temporary network issue)
2. Verify error logged but webhook returns success
3. Verify chatbot sync still works

### Manual QA Checklist

- [ ] Publish new case study → appears on listing within 30s
- [ ] Update existing case study → changes visible within 30s
- [ ] Publish blog post → appears on blog within 30s
- [ ] Update homepage hero → changes visible within 30s
- [ ] Update footer → all pages show new footer on next visit
- [ ] Save draft (don't publish) → no cache changes
- [ ] Delete published document → listing updates within 30s
- [ ] Check Vercel logs show revalidation events
- [ ] Check Sanity webhook delivery logs show 200 responses

---

## Rollback Plan

### Quick Rollback (Emergency)

**If revalidation causes issues:**

1. **Disable revalidation in webhook:**
   ```typescript
   // Comment out revalidation calls
   // const paths = await getRevalidationPaths(...);
   // await revalidatePathsWithLogging(paths);
   
   logger.log('   ⚠️  Revalidation temporarily disabled');
   ```

2. **Deploy immediately:**
   ```bash
   git add src/app/api/webhooks/sanity/route.ts
   git commit -m "Temporarily disable revalidation"
   git push
   ```

3. **Site continues working with:**
   - Chatbot sync still functional
   - Next.js ISR fallback (stale content, but working)
   - Manual revalidation via deployments

### Full Rollback

**If need to completely revert:**

```bash
# Revert to pre-implementation commit
git revert <commit-hash>
git push

# Or restore previous version
git checkout <previous-commit> -- src/app/api/webhooks/sanity/route.ts
git commit -m "Rollback revalidation implementation"
git push
```

### Sanity Webhook Disable

**If webhook causing issues:**

1. Go to Sanity dashboard → Webhooks
2. Find "Production Cache Revalidation"
3. Click **"Disable"**
4. Site continues working (CDN cache only)

---

## Performance Considerations

### Revalidation Limits

**Next.js Limits:**
- No hard limit on `revalidatePath()` calls per request
- Each call is async, so sequential processing is slow

**Optimization:**
```typescript
// Run revalidations in parallel (Phase 5+)
await Promise.allSettled(
  paths.map(path => revalidatePath(path))
);
```

### Webhook Timeout

**Vercel Function Timeout:**
- Free tier: 10 seconds
- Pro tier: 60 seconds

**Current Webhook Time:**
- Signature verification: ~10ms
- Chatbot sync: ~500ms (single document)
- Revalidation: ~50ms per path

**Worst Case (Phase 4, Option B):**
- 100 blog posts + 50 case studies = 150 paths
- 150 × 50ms = 7.5 seconds
- Well within limits

### CDN Propagation

**After `revalidatePath()`:**
1. Next.js marks path as stale
2. Next request triggers regeneration
3. New page cached
4. CDN propagates (Vercel Edge: ~2-5 seconds globally)

**User Experience:**
- First visitor after publish: ~200-500ms (page regeneration)
- Subsequent visitors: <50ms (cached)

---

## Success Metrics

### Phase Completion Criteria

**Phase 1:** ✅ Draft events logged but ignored
**Phase 2:** ✅ All content types trigger correct path revalidation
**Phase 3:** ✅ Homepage only revalidated when necessary
**Phase 4:** ✅ Global changes revalidate appropriately
**Phase 5:** ✅ Errors logged, webhook still succeeds

### Production Metrics

**Target Performance:**
- Webhook response time: <2 seconds (95th percentile)
- Content freshness: <30 seconds from publish to visible
- Error rate: <1% of webhook calls
- Zero chatbot sync regressions

**Monitoring:**
- Vercel logs: Revalidation success/failure counts
- Sanity webhook logs: Delivery success rate
- User-facing: Content update latency

---

## Future Enhancements

### Post-Launch Improvements

1. **Tag-based revalidation**
   - Add `next: { tags: ['blog', 'project'] }` to fetch calls
   - Use `revalidateTag()` instead of `revalidatePath()`
   - More flexible and performant

2. **Admin dashboard integration**
   - Manual "Clear Cache" button
   - Show last revalidation time per page
   - Real-time webhook status

3. **Scheduled revalidation**
   - Daily full-site revalidation (off-peak hours)
   - Ensures no stale content accumulates

4. **Incremental Static Regeneration tuning**
   - Adjust per-page revalidation timers
   - Balance freshness vs. performance

5. **Preview mode integration**
   - Combine with existing draft mode
   - Real-time preview in Sanity Presentation

---

## Documentation Updates Needed

After implementation, update:

1. **CLAUDE.md**
   - Add cache revalidation to webhook documentation
   - Update content publishing workflow

2. **README.md**
   - Add webhook setup instructions
   - Document expected publish-to-live timing

3. **SANITY-CACHING-GUIDE.md**
   - Add automatic revalidation section
   - Update "How to Force Immediate Updates"

4. **New file: CACHE-REVALIDATION.md**
   - Complete technical documentation
   - Troubleshooting guide
   - Monitoring instructions

---

## Questions & Decisions

### Open Questions

1. **Phase 4 approach:** Option A, B, or C for global content changes?
   - **Recommendation:** Start with A, monitor, add C if needed

2. **Revalidation timing:** Sequential or parallel?
   - **Recommendation:** Parallel (Phase 5+)

3. **Error handling:** Fail webhook on revalidation error?
   - **Recommendation:** No, log and continue (revalidation is enhancement, not critical)

4. **Monitoring:** Add APM/monitoring service?
   - **Recommendation:** Start with Vercel logs, add Sentry/DataDog if needed

### Decisions Made

- ✅ Publish-only filtering (no draft revalidation)
- ✅ Path-based revalidation (not tag-based initially)
- ✅ Smart featured detection (Phase 3)
- ✅ Chatbot sync preserved (no breaking changes)
- ✅ Error logging without failing webhook

---

## Implementation Checklist

### Pre-Implementation

- [ ] Review this plan with stakeholder
- [ ] Confirm Sanity webhook URL (production domain)
- [ ] Verify `SANITY_WEBHOOK_SECRET` in Vercel env vars
- [ ] Create feature branch: `feature/cache-revalidation`

### Phase 1

- [ ] Update webhook payload interface
- [ ] Add publish detection logic
- [ ] Add draft filtering
- [ ] Add logging for draft vs. publish events
- [ ] Test with draft save (should skip)
- [ ] Test with publish (should process)
- [ ] Deploy to staging/preview
- [ ] Verify logs

### Phase 2

- [ ] Create `getRevalidationPaths()` function
- [ ] Add revalidation for all content types
- [ ] Add detailed logging
- [ ] Test each content type
- [ ] Deploy to staging/preview
- [ ] Verify paths revalidated correctly

### Phase 3

- [ ] Add `isDocumentFeatured()` helper
- [ ] Update project/blog revalidation logic
- [ ] Test featured vs. non-featured
- [ ] Deploy to staging/preview
- [ ] Verify homepage only revalidated when needed

### Phase 4

- [ ] Decide on approach (A, B, or C)
- [ ] Implement chosen approach
- [ ] Test global content changes
- [ ] Monitor performance
- [ ] Deploy to staging/preview

### Phase 5

- [ ] Add try-catch around revalidations
- [ ] Implement detailed result logging
- [ ] Update webhook response format
- [ ] Add error monitoring
- [ ] Deploy to staging/preview
- [ ] Simulate failures

### Production Deployment

- [ ] Merge to main
- [ ] Deploy to production
- [ ] Configure Sanity webhook
- [ ] Test end-to-end
- [ ] Monitor for 24 hours
- [ ] Update documentation

### Post-Launch

- [ ] Monitor Vercel logs for errors
- [ ] Check Sanity webhook delivery stats
- [ ] Gather user feedback on content freshness
- [ ] Document any issues
- [ ] Plan future enhancements

---

## Appendix: Code Reference

### Next.js Revalidation APIs

```typescript
// Revalidate specific path
import { revalidatePath } from 'next/cache';
await revalidatePath('/blog');

// Revalidate with layout option
await revalidatePath('/blog', 'page'); // Just the page
await revalidatePath('/blog', 'layout'); // Page + layout

// Revalidate by tag
import { revalidateTag } from 'next/cache';
await revalidateTag('blog-posts');
```

### Sanity Webhook Payload Example

```json
{
  "_id": "abc123",
  "_type": "project",
  "_rev": "v1-xyz",
  "slug": {
    "current": "work-and-co-virgin"
  },
  "title": "Virgin America Redesign",
  "_createdAt": "2025-11-16T10:30:00Z",
  "_updatedAt": "2025-11-16T12:45:00Z"
}
```

### Draft Document Example

```json
{
  "_id": "drafts.abc123",  // ← Note the "drafts." prefix
  "_type": "project",
  "_rev": "v1-xyz",
  "slug": {
    "current": "work-in-progress"
  },
  "title": "Draft Project"
}
```

---

**End of Plan**

**Ready for Implementation:** Yes
**Estimated Timeline:** 3-5 hours (all phases)
**Risk Level:** Low (non-breaking, incremental rollout)
**Dependencies:** None (uses existing infrastructure)
