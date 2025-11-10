import React from 'react';
import { Metadata } from 'next';
import { sanityFetch } from '@/sanity/lib/live';
import { allBlogPostsQuery } from '@/lib/sanity/queries/blog';
import { blogIndexPageQuery } from '@/lib/sanity/queries';
import { BlogPostCard } from '@/components/blog';
import type { BlogListItem } from '@/types/blog';
import { generateSanityMetadata } from '@/lib/sanity/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const { data: pageData } = await sanityFetch({
    query: blogIndexPageQuery,
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
    sanityFetch({ query: allBlogPostsQuery }),
    sanityFetch({ query: blogIndexPageQuery }),
  ]);

  const title = pageData?.title || 'Posts';
  const description = pageData?.description || 'Insights on AI, creative technology, and building with AI-powered tools';

  return (
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
  );
}
