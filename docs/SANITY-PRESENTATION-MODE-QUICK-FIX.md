# Quick Fix: Sanity Presentation Mode Live Updates

**Problem:** Presentation mode refreshes pages instead of updating live
**Root Cause:** `browserToken: false` disables WebSocket updates
**Fix Time:** 5-20 minutes

---

## The Critical Fix (Required)

### File: `src/sanity/lib/live.ts` (or wherever you have `defineLive`)

**Change this:**
```typescript
export const { sanityFetch, SanityLive } = defineLive({
  client: client.withConfig({ /* ... */ }),
  serverToken: process.env.SANITY_AUTH_TOKEN,
  browserToken: false,  // ❌ THIS BREAKS LIVE UPDATES
});
```

**To this:**
```typescript
export const { sanityFetch, SanityLive } = defineLive({
  client: client.withConfig({ /* ... */ }),
  serverToken: process.env.SANITY_AUTH_TOKEN,
  browserToken: process.env.SANITY_AUTH_TOKEN,  // ✅ ENABLES LIVE UPDATES
});
```

**That's it!** This single change enables live WebSocket updates.

---

## Optional Enhancement: Location Resolvers

Adds "Used on X pages" banner and better navigation.

### 1. Create `src/sanity/presentation.ts`

```typescript
import { defineDocuments, defineLocations } from 'sanity/presentation'

// Map URL patterns to documents
export const mainDocuments = defineDocuments([
  {
    route: '/blog/:slug',
    filter: `_type == "blog" && slug.current == $slug`,
  },
  {
    route: '/projects/:slug',
    filter: `_type == "project" && slug.current == $slug`,
  },
  // Add your content types here
])

// Tell editors where content is used
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
          href: `/projects/${doc?.slug}`,
        },
      ],
    }),
  }),
  // Add your content types here
}
```

### 2. Update `sanity.config.ts`

```typescript
import { mainDocuments, locations } from './src/sanity/presentation'

// In your defineConfig:
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

---

## How to Test

1. Hard refresh Sanity Studio (Cmd+Shift+R)
2. Open a document
3. Switch to "Presentation" view
4. Edit content
5. **Expected:** Preview updates WITHOUT page refresh
6. Click "Publish"
7. **Expected:** No refresh (content already visible)

---

## What This Fixes

### Before:
- Edit content → Preview shows stale data
- Publish → Page refreshes
- No "Used on pages" banner

### After:
- Edit content → Preview updates **live**
- Publish → **No refresh** needed
- "Used on 1 page" banner shows up
- Better document navigation

---

## Environment Variables Required

```bash
# .env.local
SANITY_AUTH_TOKEN=your-token-with-viewer-permissions
```

Get token from: `https://sanity.io/manage/project/YOUR_PROJECT_ID/api`

---

## Why This Works

- `browserToken` enables WebSocket connection for live events
- `SanityLive` component uses this to listen for changes
- Location resolvers tell Presentation where to preview documents

**The Myth:** "VisualEditing handles WebSocket updates"
**The Truth:** VisualEditing = click-to-edit overlays only. browserToken = live updates.

---

## Troubleshooting

**Still refreshing?**
- Hard refresh Sanity Studio
- Check `.env.local` has `SANITY_AUTH_TOKEN`
- Look for `<SanityLive /> revalidated tag` in terminal (proves it's working)

**Overlays not working?**
- Make sure you're using `sanityFetch` (not `client.fetch`)
- Check that `SanityLive` component is in your layout
- Verify `VisualEditingWrapper` renders when draft mode is enabled

---

## Package Requirements

```json
{
  "next-sanity": "^11.0.0",
  "sanity": "^4.0.0",
  "@sanity/visual-editing": "^4.0.0"
}
```

All current versions support this configuration.

---

**Full documentation:** See `sanity-presentation-mode-fix.md` for comprehensive details.
