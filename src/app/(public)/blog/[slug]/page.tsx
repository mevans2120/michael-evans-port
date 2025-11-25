import React from 'react';
import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import { sanityFetch } from '@/sanity/lib/live';
import { client } from '@/sanity/lib/client';
import { blogPostBySlugQuery } from '@/lib/sanity/queries/blog';
import { BlogLayout, BlogHero, BlogMeta, BlogContent } from '@/components/blog';
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
  const slugs = await client.fetch<{ slug: string }[]>(
    `*[_type == "blog" && defined(slug.current)]{ "slug": slug.current }`
  );

  return slugs.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { data: post }: { data: Blog | null } = await sanityFetch({
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

// Query to get minimal profile data for structured data author info
const profileNameQuery = `*[_type == "profile"][0]{ name }`;

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const [{ data: post }, { data: profile }] = await Promise.all([
    sanityFetch({
      query: blogPostBySlugQuery,
      params: { slug },
    }) as Promise<{ data: Blog | null }>,
    sanityFetch({
      query: profileNameQuery,
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
        />

        <BlogMeta
          publishedAt={post.publishedAt}
          updatedAt={post.updatedAt}
          author={post.author}
        />

        <BlogContent content={post.content} />
      </BlogLayout>
    </>
  );
}
