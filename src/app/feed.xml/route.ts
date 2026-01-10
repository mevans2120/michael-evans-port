import { Feed } from "feed";
import { client } from "@/sanity/lib/client";
import { allBlogPostsQuery } from "@/lib/sanity/queries/blog";
import type { BlogListItem } from "@/types/blog";

/**
 * RSS Feed Route Handler
 *
 * Generates an RSS 2.0 feed of blog posts.
 * Uses tag-based revalidation - regenerates only when blog content
 * changes via the Sanity webhook (revalidateTag('blog')).
 */
export async function GET() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://michael-evans.com";

  // Fetch blog posts with 'blog' tag for on-demand revalidation
  const posts = await client.fetch<BlogListItem[]>(
    allBlogPostsQuery,
    {},
    { next: { tags: ["blog"] } }
  );

  const feed = new Feed({
    title: "Michael Evans | Blog",
    description:
      "AI/ML insights, creative technology solutions, and professional case studies",
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
