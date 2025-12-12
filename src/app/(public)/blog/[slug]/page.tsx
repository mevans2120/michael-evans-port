import React from 'react';
import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cachedSanityFetch } from '@/sanity/lib/fetch';
import { productionClient } from '@/sanity/lib/client';
import { blogPostBySlugQuery } from '@/lib/sanity/queries/blog';
import { BlogLayout, BlogHero, BlogContent } from '@/components/blog';
import { RelatedPosts } from '@/components/related-posts';
import type { Blog } from '@/types/blog';
import { generateSanityMetadata } from '@/lib/sanity/metadata';
import { generateBlogPostingSchema, generateBreadcrumbSchema, type StructuredDataBlogPost, type StructuredDataProfile } from '@/lib/structured-data';
import { JsonLd } from '@/components/JsonLd';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = await productionClient.fetch<{ slug: string }[]>(
    `*[_type == "blog" && defined(slug.current)]{ "slug": slug.current }`
  );

  return slugs.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { data: post }: { data: Blog | null } = await cachedSanityFetch({
    query: blogPostBySlugQuery,
    params: { slug },
    tags: ['blog', `blog-${slug}`],
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

// Query to get minimal profile data for structured data author info
const profileNameQuery = `*[_type == "profile"][0]{ name }`;

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const [{ data: post }, { data: profile }] = await Promise.all([
    cachedSanityFetch({
      query: blogPostBySlugQuery,
      params: { slug },
      tags: ['blog', `blog-${slug}`],
    }) as Promise<{ data: Blog | null }>,
    cachedSanityFetch({
      query: profileNameQuery,
      tags: ['profile'],
    }) as Promise<{ data: { name: string } | null }>,
  ]);

  if (!post) {
    notFound();
  }

  // Generate BlogPosting structured data
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://michael-evans.com';
  const blogPostData: StructuredDataBlogPost = {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    featuredImage: post.featuredImage ? {
      asset: { url: post.featuredImage.asset?.url },
      alt: post.featuredImage.alt,
    } : undefined,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    author: post.author,
  };
  const authorProfile: StructuredDataProfile = {
    name: profile?.name || 'Michael Evans',
  };
  const blogPostingSchema = generateBlogPostingSchema(blogPostData, siteUrl, authorProfile);
  const breadcrumbSchema = generateBreadcrumbSchema(
    [
      { name: 'Home', url: '/' },
      { name: 'Blog', url: '/blog' },
      { name: post.title },
    ],
    siteUrl
  );

  return (
    <>
      <JsonLd data={[blogPostingSchema, breadcrumbSchema]} />
      <BlogLayout>
        <BlogHero
          heroSection={post.heroSection}
          title={post.title}
          featuredImage={post.featuredImage}
          asciiArtType={post.asciiArt}
          publishedAt={post.publishedAt}
          author={post.author}
        />

        <BlogContent content={post.content} />

        {/* Related Posts Section */}
        <RelatedPosts currentSlug={slug} />
      </BlogLayout>
    </>
  );
}
