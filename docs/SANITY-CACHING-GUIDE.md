# Sanity CMS Caching Guide

**Last Updated:** October 27, 2025

---

## TL;DR - Why Production Shows Different Content

**Root Cause:** Sanity CDN caches content for up to 60 seconds in production.

**Solution Applied:** Changed `/src/lib/sanity/client.ts` to:
```typescript
useCdn: process.env.NODE_ENV === 'production',
```

**Result:**
- **Local dev:** No CDN caching = instant updates
- **Production:** CDN caching = 60-second delay but faster performance

---

## How Sanity Caching Works

### The CDN Cache

When `useCdn: true`, Sanity serves content from their global CDN:

```
Update Content in Studio → Sanity DB (instant)
                              ↓
                         CDN Cache (up to 60s delay)
                              ↓
                         Your Production Site
```

**Cache Duration:** Up to 60 seconds
**Benefits:** Fast global delivery, reduced API costs
**Drawback:** Content updates take up to 60s to appear

### Perspective Setting

Your client is configured with:
```typescript
perspective: 'published',
```

**This means:**
- ✅ Published documents appear on the site
- ❌ Draft documents do NOT appear
- ❌ Unpublished changes do NOT appear

**To see content on your site:**
1. Make changes in Sanity Studio
2. Click **"Publish"** (not just Save)
3. Wait up to 60 seconds for production CDN cache to clear

---

## Current Configuration

### Before (Old Behavior)
```typescript
useCdn: true, // Always used CDN, even in local dev
```

**Result:**
- Local dev had caching delays
- Production had caching delays
- Hard to see if content updates worked

### After (New Behavior)
```typescript
useCdn: process.env.NODE_ENV === 'production',
```

**Result:**
- **Local (`npm run dev`):** `useCdn: false` → Instant updates, no cache
- **Production (Vercel):** `useCdn: true` → Fast CDN delivery, 60s cache

---

## Troubleshooting Different Content

### Issue 1: "Production shows old content"

**Likely Cause:** CDN cache hasn't expired yet

**Solutions:**
1. **Wait 60 seconds** after publishing in Sanity Studio
2. **Hard refresh browser:** `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
3. **Force revalidate Vercel:** Trigger a new deployment

**To force immediate refresh:**
```bash
# Trigger new Vercel deployment (bypasses CDN cache)
git commit --allow-empty -m "Force Vercel revalidation"
git push
```

### Issue 2: "Local shows content, production doesn't"

**Likely Causes:**
1. **Content is in draft state** (not published)
2. **Environment variables are different**
3. **Browser caching**

**Solution:**
```bash
# 1. Check Sanity Studio
# Make sure document status shows "Published" (green dot)

# 2. Verify it's published
# In Sanity Studio → Select document → Check top right for "Published"

# 3. Force publish
# Click "Publish" again even if it says it's published
```

### Issue 3: "Local shows different data than production"

**Likely Causes:**
1. **Different datasets** (e.g., production vs. development)
2. **Environment variable mismatch**
3. **CDN cache on production**

**Check configuration:**
```bash
# Check local env
cat .env.local | grep SANITY

# Should show:
# NEXT_PUBLIC_SANITY_PROJECT_ID=5n331bys
# NEXT_PUBLIC_SANITY_DATASET=production

# Check production env (Vercel dashboard)
# Settings → Environment Variables
# Make sure they match!
```

---

## How to Force Immediate Updates

### Option 1: Disable CDN Completely (Not Recommended)

```typescript
// In src/lib/sanity/client.ts
useCdn: false,
```

**Pros:** Instant updates everywhere
**Cons:** Slower queries, higher Sanity API costs

### Option 2: Use Draft Mode (Recommended for Previews)

Next.js has a "Draft Mode" feature for content previews:

```typescript
// Create src/app/api/draft/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')

  if (secret !== process.env.SANITY_PREVIEW_SECRET) {
    return new Response('Invalid secret', { status: 401 })
  }

  // Enable Draft Mode
  draftMode().enable()
  return redirect('/')
}
```

Then in your Sanity Studio, add preview button that links to:
```
https://your-site.vercel.app/api/draft?secret=YOUR_SECRET&slug=/
```

### Option 3: Webhook Revalidation (Advanced)

Set up Sanity webhook to trigger Vercel revalidation on publish:

1. **Create webhook endpoint:**
```typescript
// src/app/api/revalidate/route.ts
export async function POST(request: Request) {
  const body = await request.json()

  // Revalidate specific paths
  await revalidatePath('/')
  await revalidatePath('/ai-showcase')

  return Response.json({ revalidated: true })
}
```

2. **Configure Sanity webhook:**
- Go to https://www.sanity.io/manage/project/5n331bys/api/webhooks
- Add webhook URL: `https://your-site.vercel.app/api/revalidate`
- Trigger: On publish
- Secret: Add to `.env.local`

---

## Best Practices

### For Content Updates

1. **Make changes in Sanity Studio**
2. **Click "Publish"** (not just save as draft)
3. **Wait 60 seconds** for CDN cache to expire
4. **Hard refresh browser** if needed

### For Development

1. **Use local dev** (`npm run dev`) to see instant updates
2. **Test on production** after publishing to verify
3. **Set up webhooks** if you need instant production updates

### For Emergency Updates

If you need an immediate update in production:

```bash
# Option 1: Force Vercel redeploy (2-3 minutes)
git commit --allow-empty -m "Emergency cache bust"
git push

# Option 2: Temporarily disable CDN
# Edit src/lib/sanity/client.ts → useCdn: false
# Commit and push
# Remember to re-enable CDN after!
```

---

## Environment Variable Checklist

Make sure these match in both local and production:

### Local (`.env.local`)
```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=5n331bys
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
```

### Production (Vercel Dashboard)
```
Settings → Environment Variables → Production

NEXT_PUBLIC_SANITY_PROJECT_ID=5n331bys
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
```

**Verify they match:**
```bash
# After deployment, check production
curl https://michael-evans-port.vercel.app/api/check-env

# Should return same project ID and dataset
```

---

## Quick Reference

| Scenario | CDN Cache | Update Speed | Use Case |
|----------|-----------|--------------|----------|
| Local dev | ❌ Off | Instant | Development |
| Production | ✅ On | 60s delay | Public site |
| Draft mode | ❌ Off | Instant | Content preview |
| Force redeploy | Bypassed | 2-3 min | Emergency updates |

---

## Summary

**The change made:**
```diff
- useCdn: true, // Always cached
+ useCdn: process.env.NODE_ENV === 'production', // Only cache in production
```

**What this means:**
- Local dev shows instant updates
- Production has 60-second cache (acceptable trade-off for speed)
- Both environments use the same Sanity dataset

**To see updates in production:**
1. Publish in Sanity Studio
2. Wait 60 seconds
3. Hard refresh browser

**For instant updates:**
- Use local dev environment
- Or trigger Vercel redeploy
- Or set up webhook revalidation

---

**Need help?** Check:
- Sanity docs: https://www.sanity.io/docs/caching
- Next.js revalidation: https://nextjs.org/docs/app/building-your-application/data-fetching/revalidating
- Vercel environment variables: https://vercel.com/docs/environment-variables
