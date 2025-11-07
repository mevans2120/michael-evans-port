import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { sanityFetch } from '@/sanity/lib/live';
import { client } from '@/lib/sanity/client';
import { blogPostBySlugQuery } from '@/lib/sanity/queries/blog';
import { BlogLayout, BlogHero, BlogMeta, BlogContent } from '@/components/blog';
import type { Blog } from '@/types/blog';
import { generateSanityMetadata } from '@/lib/sanity/metadata';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = await client.fetch<{ slug: string }[]>(
    `*[_type == "blog" && defined(slug.current)]{ "slug": slug.current }`
  );

  return slugs.map((item) => ({
    slug: item.slug,
  }));
}

// Revalidate every hour (ISR - Incremental Static Regeneration)
export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { data: post } = await sanityFetch({
    query: blogPostBySlugQuery,
    params: { slug },
  });

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return generateSanityMetadata({
    seo: post.seo,
    title: `${post.title} | Michael Evans`,
    description: post.excerpt || post.heroSection?.subtitle,
    path: `/blog/${slug}`,
    featuredImage: post.featuredImage,
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const { data: post } = await sanityFetch({
    query: blogPostBySlugQuery,
    params: { slug },
  });

  if (!post) {
    notFound();
  }

  return (
    <BlogLayout>
      <BlogHero
        heroSection={post.heroSection}
        fallbackTitle={post.title}
      />

      <BlogMeta
        publishedAt={post.publishedAt}
        updatedAt={post.updatedAt}
        author={post.author}
        readingTime={post.readingTime}
      />

      <BlogContent content={post.content} />
    </BlogLayout>
  );
}
