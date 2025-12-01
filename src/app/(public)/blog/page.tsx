import React from 'react';
import { type Metadata } from 'next';
import { cachedSanityFetch } from '@/sanity/lib/fetch';
import { allBlogPostsQuery } from '@/lib/sanity/queries/blog';
import { blogIndexPageQuery } from '@/lib/sanity/queries';
import { BlogPostCard } from '@/components/blog';
import type { BlogListItem } from '@/types/blog';
import { generateSanityMetadata } from '@/lib/sanity/metadata';
import { generateBreadcrumbSchema } from '@/lib/structured-data';
import { JsonLd } from '@/components/JsonLd';

// Type for blog index page data from Sanity
interface BlogIndexPageData {
  _id: string;
  title?: string;
  description?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    twitterCard?: 'summary' | 'summary_large_image';
    canonicalUrl?: string;
    noIndex?: boolean;
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const { data: pageData } = await cachedSanityFetch<BlogIndexPageData | null>({
    query: blogIndexPageQuery,
    tags: ['blog'],
  });

  return generateSanityMetadata({
    seo: pageData?.seo,
    title: 'Posts | Michael Evans',
    description: pageData?.description || 'Insights on AI, creative technology, and building with AI-powered tools',
    path: '/blog',
  });
}

export default async function BlogPage() {
  const [{ data: posts }, { data: pageData }] = await Promise.all([
    cachedSanityFetch<BlogListItem[]>({ query: allBlogPostsQuery, tags: ['blog'] }),
    cachedSanityFetch<BlogIndexPageData | null>({ query: blogIndexPageQuery, tags: ['blog'] }),
  ]);

  const title = pageData?.title || 'Posts';
  const description = pageData?.description || 'Insights on AI, creative technology, and building with AI-powered tools';

  // Generate breadcrumb structured data
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://michael-evans.com';
  const breadcrumbSchema = generateBreadcrumbSchema(
    [
      { name: 'Home', url: '/' },
      { name: 'Blog' },
    ],
    siteUrl
  );

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <main className="w-full max-w-[920px] mx-auto px-6 md:px-8 py-16 md:py-20">
      {/* Header */}
      <header className="mb-16">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold font-sans mb-6 text-foreground">
          {title}
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground font-serif max-w-2xl">
          {description}
        </p>
      </header>

      {/* Blog Posts */}
      {posts && posts.length > 0 ? (
        <div className="space-y-12">
          {posts.map((post: BlogListItem, index: number) => (
            <BlogPostCard key={post._id} post={post} index={index} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-lg text-muted-foreground">
            No posts yet. Check back soon!
          </p>
        </div>
      )}
    </main>
    </>
  );
}
