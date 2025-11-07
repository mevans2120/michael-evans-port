# Sanity Presentation Mode Fix Guide

**Date:** 2025-11-06
**Status:** 🔴 BROKEN - Live editing not working
**Priority:** CRITICAL

---

## Executive Summary

Sanity Presentation mode is **not working seamlessly** due to three critical configuration issues. The primary issue is `browserToken: false` in the live configuration, which completely disables live WebSocket updates and forces page refreshes instead of real-time content updates.

**TL;DR:** The smoking gun is a single line: `browserToken: false` in `/src/sanity/lib/live.ts`. This one setting is preventing all live updates.

---

## What's Broken

### 🔴 Critical Issue: No Live Updates (browserToken: false)

**File:** `/src/sanity/lib/live.ts`

**Current (BROKEN):**
```typescript
export const { sanityFetch, SanityLive } = defineLive({
  client: client.withConfig({
    useCdn: false,
    stega: {
      enabled: true,
      studioUrl: process.env.NEXT_PUBLIC_SITE_URL
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/studio`
        : '/studio',
    },
  }),
  serverToken: process.env.SANITY_AUTH_TOKEN,
  browserToken: false,  // ❌ THIS IS THE PROBLEM
});
```

**Why This Breaks Everything:**

The comment says: `// Explicitly disable browserToken - we use VisualEditing component instead which handles live updates via WebSocket`

**This comment is WRONG.** Here's the truth:

- `VisualEditing` component = Click-to-edit overlays only
- `browserToken` + `SanityLive` = Live WebSocket content updates
- **Both are required** for the complete visual editing experience

By setting `browserToken: false`, we've disabled the WebSocket connection that enables real-time content updates. This is why:
- ✅ Click-to-edit overlays work (VisualEditing handles this)
- ❌ Live content updates don't work (requires browserToken)
- ❌ Publishing causes page refresh (trying to show updated content)

**From Sanity Docs:**
> "The browserToken is only used when Draft Mode is enabled and initiated by Presentation Tool."
>
> "**Ensure that browserToken is setup if you want draft content that isn't yet published to also update live.**"

---

### 🟡 High Priority: Missing Location Resolvers

**File:** `/sanity.config.ts`

**Current (INCOMPLETE):**
```typescript
presentationTool({
  previewUrl: {
    origin: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    draftMode: {
      enable: '/api/draft-mode/enable',
    }
  },
}),
```

**Missing:**
- No `resolve.locations` configuration
- No `resolve.mainDocuments` configuration

**Impact:**
- Presentation tool doesn't know how to map documents → URLs
- Can't show "Used on X pages" banner
- Navigation between documents and previews is suboptimal
- May open wrong preview URLs

---

### 🟢 Medium Priority: Base Client Missing Stega

**File:** `/src/sanity/lib/client.ts`

**Current:**
```typescript
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  // ❌ No stega configuration
})
```

**Impact:**
- Visual editing overlays may be inconsistent
- Stega encoding only configured in live.ts client, not base client
- Click-to-edit may not work reliably in all contexts

---

## How Presentation Mode SHOULD Work

### The Ideal Flow

1. **Editor opens Presentation mode**
   - Sanity calls `/api/draft-mode/enable`
   - Next.js enables draft mode
   - Layout renders both `<SanityLive />` and `<VisualEditingWrapper />`

2. **WebSocket connection established**
   - `SanityLive` uses `browserToken` to connect to Sanity
   - Listens for content changes via WebSocket
   - Ready for live updates

3. **Editor makes changes**
   - Types in Sanity Studio
   - WebSocket sends change events
   - `SanityLive` receives events and updates queries
   - **Content updates in real-time WITHOUT page refresh**

4. **Editor publishes**
   - Content already visible in preview (was live updating)
   - Publish just changes draft → published status
   - **No refresh needed - already seeing latest content**

### The Current Broken Flow

1. **Editor opens Presentation mode** ✅
   - Draft mode enabled correctly

2. **No WebSocket connection** ❌
   - `browserToken: false` prevents WebSocket setup
   - No live event listening

3. **Editor makes changes** ❌
   - Types in Sanity Studio
   - No WebSocket events sent/received
   - Preview shows stale content

4. **Editor publishes** ❌
   - Page refreshes to show updated content
   - **This is what you're experiencing**

---

## The Fix (3 Phases)

### Phase 1: Enable Live Updates (CRITICAL) - 5 minutes

**File:** `/src/sanity/lib/live.ts`

**Change this line:**
```typescript
browserToken: false,
```

**To this:**
```typescript
browserToken: process.env.SANITY_AUTH_TOKEN,
```

**Full corrected code:**
```typescript
export const { sanityFetch, SanityLive } = defineLive({
  client: client.withConfig({
    useCdn: false,
    stega: {
      enabled: true,
      studioUrl: process.env.NEXT_PUBLIC_SITE_URL
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/studio`
        : '/studio',
    },
  }),
  serverToken: process.env.SANITY_AUTH_TOKEN,
  browserToken: process.env.SANITY_AUTH_TOKEN, // ✅ ENABLE THIS
});
```

**Note:** It's safe to use the same token for both `serverToken` and `browserToken`. The browserToken is only exposed to the browser when Draft Mode is enabled, which requires authentication.

**Test:**
1. Save the file
2. Refresh Sanity Studio
3. Open Presentation mode
4. Edit a blog post title
5. **Expected:** Title updates live without page refresh

---

### Phase 2: Add Location Resolvers (HIGH) - 15 minutes

#### Step 1: Create new file

**File:** `/src/sanity/presentation.ts` (NEW FILE)

```typescript
import { defineDocuments, defineLocations } from 'sanity/presentation'

// Tell Presentation how to navigate to document previews
export const mainDocuments = defineDocuments([
  {
    route: '/blog/:slug',
    filter: `_type == "blog" && slug.current == $slug`,
  },
  {
    route: '/case-studies/:slug',
    filter: `_type == "project" && slug.current == $slug`,
  },
  {
    route: '/ai-showcase/:slug',
    filter: `_type == "aiShowcase" && slug.current == $slug`,
  },
])

// Tell editors where their content is used
export const locations = {
  blog: defineLocations({
    select: {
      title: 'title',
      slug: 'slug.current',
    },
    resolve: (doc) => ({
      locations: [
        {
          title: doc?.title || 'Untitled',
          href: `/blog/${doc?.slug}`,
        },
      ],
    }),
  }),
  project: defineLocations({
    select: {
      title: 'title',
      slug: 'slug.current',
    },
    resolve: (doc) => ({
      locations: [
        {
          title: doc?.title || 'Untitled',
          href: `/case-studies/${doc?.slug}`,
        },
      ],
    }),
  }),
  aiShowcase: defineLocations({
    select: {
      title: 'title',
      slug: 'slug.current',
    },
    resolve: (doc) => ({
      locations: [
        {
          title: doc?.title || 'Untitled',
          href: `/ai-showcase/${doc?.slug}`,
        },
      ],
    }),
  }),
}
```

#### Step 2: Update sanity.config.ts

**File:** `/sanity.config.ts`

**Add import at top:**
```typescript
import { mainDocuments, locations } from './src/sanity/presentation'
```

**Update presentationTool:**
```typescript
presentationTool({
  previewUrl: {
    origin: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    draftMode: {
      enable: '/api/draft-mode/enable',
    }
  },
  resolve: {
    mainDocuments,
    locations,
  },
}),
```

**Test:**
1. Save both files
2. Refresh Sanity Studio
3. Open a blog document
4. Look for "Used on X pages" banner at top
5. Click "Open preview" - should navigate to correct URL

---

### Phase 3: Optimize Base Client (MEDIUM) - 5 minutes

**File:** `/src/sanity/lib/client.ts`

**Add stega configuration:**
```typescript
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  stega: {
    enabled: process.env.NODE_ENV === 'development',
    studioUrl: '/studio',
  },
})
```

**This ensures:**
- Stega encoding works consistently across all client usage
- Visual editing overlays work reliably
- Click-to-edit functionality is stable

---

## Testing Checklist

After implementing Phase 1 (browserToken fix):

### Live Updates Test
- [ ] Open Presentation mode in Sanity Studio
- [ ] Select a blog post
- [ ] Edit the title in the form
- [ ] **Expected:** Title updates in preview WITHOUT page refresh
- [ ] Edit the content
- [ ] **Expected:** Content updates live
- [ ] Click "Publish"
- [ ] **Expected:** No page refresh (content already visible)

### Visual Editing Test
- [ ] In Presentation mode, click on a text element in the preview
- [ ] **Expected:** Sanity Studio focuses the correct field
- [ ] Make an edit
- [ ] **Expected:** Preview updates immediately

### Navigation Test (after Phase 2)
- [ ] Open a blog document in Sanity
- [ ] Check for "Used on X pages" banner
- [ ] Click "Open preview"
- [ ] **Expected:** Opens `/blog/[slug]` in Presentation mode

---

## Environment Variables Required

Ensure `.env.local` contains:

```bash
# Required for both server-side and browser-side draft mode
SANITY_AUTH_TOKEN=your-token-here

# Optional: Site URL for production
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**To get your token:**
1. Go to https://sanity.io/manage/project/5n331bys/api
2. Create a token with "Viewer" permissions
3. Copy and paste into `.env.local`

---

## Current vs. Fixed Comparison

### Before (Broken)

```typescript
// src/sanity/lib/live.ts
browserToken: false,  // ❌ Disables live updates

// sanity.config.ts
presentationTool({
  previewUrl: { /* ... */ },
  // ❌ No resolve configuration
}),
```

**Behavior:**
- Edit in Studio → Preview shows stale content
- Publish → Page refreshes to show updates
- Click on preview → Nothing happens or wrong field focused

### After (Fixed)

```typescript
// src/sanity/lib/live.ts
browserToken: process.env.SANITY_AUTH_TOKEN,  // ✅ Enables live updates

// sanity.config.ts
presentationTool({
  previewUrl: { /* ... */ },
  resolve: {
    mainDocuments,
    locations,
  },
}),
```

**Behavior:**
- Edit in Studio → Preview updates **live** (no refresh)
- Publish → **No refresh** (already showing latest content)
- Click on preview → Studio focuses correct field
- "Used on X pages" banner shows where content is published

---

## Why This Wasn't Caught Earlier

The misleading comment in `live.ts` claimed that `VisualEditing` handles live updates via WebSocket. This is **incorrect**:

**What each component does:**

| Component | Purpose | Technology |
|-----------|---------|------------|
| `<SanityLive />` | Live content updates | WebSocket (requires browserToken) |
| `<VisualEditingWrapper />` | Click-to-edit overlays | Stega encoding + postMessage |

**Both are needed:**
- `SanityLive` → Content updates in real-time
- `VisualEditingWrapper` → Click on elements to edit them

Setting `browserToken: false` broke `SanityLive`, leaving only the click-to-edit overlays working.

---

## Package Versions (Verified)

From `package.json`:
- ✅ `next-sanity`: ^11.6.2 (current)
- ✅ `sanity`: ^4.11.0 (current)
- ✅ `@sanity/visual-editing`: ^4.0.0 (current)
- ✅ `next`: 15.5.6 (current)

All packages are up-to-date and support full Presentation mode functionality.

---

## Estimated Fix Time

| Phase | What | Time | Impact |
|-------|------|------|--------|
| Phase 1 | Enable browserToken | 5 min | ✅ Fixes live updates |
| Phase 2 | Add location resolvers | 15 min | ✅ Improves navigation |
| Phase 3 | Optimize base client | 5 min | ✅ Ensures consistency |
| **Total** | | **~25 min** | **Complete fix** |

---

## References

- [Sanity Visual Editing with Next.js App Router](https://www.sanity.io/docs/visual-editing/visual-editing-with-next-js-app-router)
- [Live Content API Guide](https://www.sanity.io/docs/live-content-guide)
- [Presentation Tool Configuration](https://www.sanity.io/docs/visual-editing/configuring-the-presentation-tool)
- [next-sanity GitHub](https://github.com/sanity-io/next-sanity)

---

## Summary

**The smoking gun:** `browserToken: false` in `/src/sanity/lib/live.ts`

**The fix:** Change it to `browserToken: process.env.SANITY_AUTH_TOKEN`

**Expected result:** Live editing works seamlessly without page refreshes

**Total time:** 25 minutes for complete fix (5 min for critical fix alone)
