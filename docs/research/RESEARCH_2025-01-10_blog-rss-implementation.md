# Research: Blog RSS Implementation

**Date:** 2025-01-10
**Tags:** blog, rss, feed, next.js, sanity

## Summary

Implementing an RSS feed for the blog requires creating a Route Handler at `/feed.xml` that generates XML from Sanity blog posts. The recommended approach uses the `feed` library with ISR (Incremental Static Regeneration) for optimal performance. Implementation is straightforward with the existing blog queries and types.

## Key Questions

- How should RSS feeds be implemented in Next.js 15 App Router?
- Which library is best for RSS generation?
- Should the feed include only blog posts or also case studies?
- How do we handle feed discovery (auto-discovery links)?

---

## Findings

### 1. Implementation Approach

Next.js App Router uses **Route Handlers** for RSS feeds. The feed is generated as a static file at build time (or with ISR).

**Route Location:** `/src/app/feed.xml/route.ts`
**URL:** `https://michael-evans.com/feed.xml`

**Generation Strategy Options:**

| Strategy | Pros | Cons | Recommended |
|----------|------|------|-------------|
| Static (default) | Fastest, no server load | Only updates on deploy | No |
| ISR (revalidate) | Updates periodically | Unnecessary regeneration | No |
| On-demand (tags) | Only updates on publish | Requires webhook setup | **Yes** |

**Recommendation:** Use **on-demand revalidation via tags**. The site already has Sanity webhooks configured (`/api/webhooks/sanity`) that call `revalidateTag('blog')` when blog content changes. The RSS feed just needs to use the same tag - no timer needed.

---

### 2. Library Comparison

| Library | TypeScript | Formats | Maintenance | Recommendation |
|---------|------------|---------|-------------|----------------|
| `feed` | Excellent | RSS, Atom, JSON | Active (1.3k stars) | **Recommended** |
| `rss` | Limited | RSS only | Less active | Alternative |
| Manual XML | N/A | Any | N/A | Not recommended |

**`feed` library advantages:**
- Full TypeScript support
- Generates RSS 2.0, Atom 1.0, and JSON Feed 1.0 from same data
- Clean, intuitive API
- Handles XML escaping automatically

**Installation:**
```bash
npm install feed
```

---

### 3. Existing Infrastructure

The blog already has everything needed:

**Sanity Query (from `/src/lib/sanity/queries/blog.ts`):**
```typescript
export const allBlogPostsQuery = groq`
  *[_type == "blog"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    author,
    featuredImage {
      asset,
      crop,
      hotspot,
      alt
    },
    ...
  }
`;
```

**TypeScript Types (from `/src/types/blog.ts`):**
```typescript
export interface BlogListItem {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  publishedAt: string;
  author?: string;
  featuredImage?: BlogImage;
}
```

**Site URL:** Available via `process.env.NEXT_PUBLIC_SITE_URL` or fallback to `https://michael-evans.com`

---

### 4. RSS 2.0 Field Mapping

| RSS Field | Source | Notes |
|-----------|--------|-------|
| `<title>` | `post.title` | Required |
| `<link>` | `${siteUrl}/blog/${post.slug.current}` | Required |
| `<description>` | `post.excerpt` | Required (can be empty string) |
| `<pubDate>` | `post.publishedAt` | RFC 822 format |
| `<guid>` | Same as `<link>` | Unique identifier |
| `<author>` | `post.author` | Optional |
| `<enclosure>` | `post.featuredImage?.asset?.url` | Optional (for images) |

---

### 5. Feed Discovery

Browsers and RSS readers find feeds via `<link>` tags in the HTML `<head>`. Next.js handles this through the metadata API.

**Current layout.tsx metadata:**
```typescript
export const metadata: Metadata = {
  title: "Michael Evans | AI/ML Portfolio",
  description: "...",
};
```

**Required addition:**
```typescript
export const metadata: Metadata = {
  title: "Michael Evans | AI/ML Portfolio",
  description: "...",
  alternates: {
    types: {
      "application/rss+xml": [
        { title: "Michael Evans RSS Feed", url: "/feed.xml" },
      ],
    },
  },
};
```

**Generates:**
```html
<link rel="alternate" type="application/rss+xml" title="Michael Evans RSS Feed" href="/feed.xml" />
```

---

### 6. Content Scope Decision

**Option A: Blog posts only**
- Simpler implementation
- Clear content type
- Most common for personal blogs

**Option B: Blog posts + Case studies**
- Richer feed
- More content for subscribers
- Requires fetching both types

**Recommendation:** Start with **blog posts only**. Case studies can be added later if there's demand.

---

## Implementation Plan

### File: `/src/app/feed.xml/route.ts`

```typescript
import { Feed } from "feed";
import { client } from "@/sanity/lib/client";
import { allBlogPostsQuery } from "@/lib/sanity/queries/blog";
import type { BlogListItem } from "@/types/blog";

// No revalidate timer - uses on-demand revalidation via 'blog' tag
// When you publish in Sanity, the webhook calls revalidateTag('blog')

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://michael-evans.com";

  // Fetch blog posts from Sanity with 'blog' tag for on-demand revalidation
  const posts = await client.fetch<BlogListItem[]>(
    allBlogPostsQuery,
    {},
    { next: { tags: ['blog'] } }
  );

  const feed = new Feed({
    title: "Michael Evans | Blog",
    description: "AI/ML insights, creative technology solutions, and professional case studies",
    id: siteUrl,
    link: siteUrl,
    language: "en",
    image: `${siteUrl}/og-image.png`,
    favicon: `${siteUrl}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, Michael Evans`,
    updated: posts[0] ? new Date(posts[0].publishedAt) : new Date(),
    feedLinks: {
      rss2: `${siteUrl}/feed.xml`,
    },
    author: {
      name: "Michael Evans",
      link: siteUrl,
    },
  });

  // Add blog posts to feed
  posts.forEach((post) => {
    feed.addItem({
      title: post.title,
      id: `${siteUrl}/blog/${post.slug.current}`,
      link: `${siteUrl}/blog/${post.slug.current}`,
      description: post.excerpt || "",
      date: new Date(post.publishedAt),
      author: [{ name: post.author || "Michael Evans" }],
      image: post.featuredImage?.asset?.url,
    });
  });

  return new Response(feed.rss2(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
```

### Update: `/src/app/layout.tsx`

```typescript
export const metadata: Metadata = {
  title: "Michael Evans | AI/ML Portfolio",
  description: "Portfolio showcasing AI/ML expertise, creative technology solutions, and professional case studies",
  alternates: {
    types: {
      "application/rss+xml": [
        { title: "Michael Evans RSS Feed", url: "/feed.xml" },
      ],
    },
  },
};
```

---

## Validation

After implementation, validate with:

1. **W3C Feed Validator:** https://validator.w3.org/feed/
2. **RSS Board Validator:** https://www.rssboard.org/rss-validator/
3. **Test in readers:** Feedly, NetNewsWire, Inoreader

---

## Future Enhancements

| Enhancement | Complexity | Value |
|-------------|------------|-------|
| Atom feed (`/atom.xml`) | Low | Alternative format support |
| JSON Feed (`/feed.json`) | Low | Modern feed format |
| Category feeds (`/blog/ai/feed.xml`) | Medium | Filtered subscriptions |
| Full content in feed | Medium | Read without visiting site |
| Case studies in feed | Low | More content |

---

## Recommendations

1. **Install `feed` library** - Best TypeScript support, multi-format
2. **Create `/src/app/feed.xml/route.ts`** - Standard RSS location
3. **Use tag-based revalidation** - Feed regenerates only when blog content changes (via existing Sanity webhook)
4. **Add feed discovery to layout** - Enable auto-discovery
5. **Start with blog posts only** - Add case studies later if needed
6. **Validate after deployment** - Use W3C validator

---

## Next Steps

- [ ] Install `feed` package: `npm install feed`
- [ ] Create `/src/app/feed.xml/route.ts`
- [ ] Add `alternates` to layout.tsx metadata
- [ ] Test locally: `npm run dev` then visit `/feed.xml`
- [ ] Validate with W3C Feed Validator
- [ ] Add RSS link to site footer (optional)

---

## References

- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [feed library (npm)](https://www.npmjs.com/package/feed)
- [RSS 2.0 Specification](https://www.rssboard.org/rss-specification)
- [W3C Feed Validator](https://validator.w3.org/feed/)
