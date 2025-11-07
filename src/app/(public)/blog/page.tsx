import React from 'react';
import { Metadata } from 'next';
import { sanityFetch } from '@/sanity/lib/live';
import { allBlogPostsQuery } from '@/lib/sanity/queries/blog';
import { BlogPostCard } from '@/components/blog';
import type { BlogListItem } from '@/types/blog';
import { generateSanityMetadata } from '@/lib/sanity/metadata';

export async function generateMetadata(): Promise<Metadata> {
  return generateSanityMetadata({
    title: 'Posts | Michael Evans',
    description: 'Insights on AI, creative technology, and building with AI-powered tools',
    path: '/blog',
  });
}

export default async function BlogPage() {
  const { data: posts } = await sanityFetch({
    query: allBlogPostsQuery,
  });

  return (
    <main className="w-full max-w-[920px] mx-auto px-6 md:px-8 py-16 md:py-20">
      {/* Header */}
      <header className="mb-16">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold font-sans mb-6 text-foreground">
          Posts
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground font-serif max-w-2xl">
          Insights on AI, creative technology, and building with AI-powered tools
        </p>
      </header>

      {/* Blog Posts */}
      {posts && posts.length > 0 ? (
        <div className="space-y-12">
          {posts.map((post: BlogListItem) => (
            <BlogPostCard key={post._id} post={post} />
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
