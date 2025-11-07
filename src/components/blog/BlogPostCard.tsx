'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import type { BlogListItem } from '@/types/blog';
import { urlFor } from '@/lib/sanity/client';
import { CalendarIcon, ClockIcon } from 'lucide-react';

interface BlogPostCardProps {
  post: BlogListItem;
}

/**
 * BlogPostCard Component
 *
 * Card for blog listing page with:
 * - Featured image
 * - Title and excerpt
 * - Published date and reading time
 * - Click/tap to navigate
 */
export function BlogPostCard({ post }: BlogPostCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/blog/${post.slug.current}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <article
      className="group cursor-pointer border-b border-border pb-8 transition-smooth hover:opacity-80"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`Read blog post: ${post.title}`}
    >
      {/* Featured Image */}
      {post.featuredImage && (
        <div className="mb-6 overflow-hidden rounded-lg">
          <img
            src={urlFor(post.featuredImage.asset).width(800).url()}
            alt={post.featuredImage.alt}
            className="w-full h-[240px] object-cover transition-transform duration-slower group-hover:scale-105"
          />
        </div>
      )}

      {/* Title */}
      <h2 className="text-2xl md:text-3xl font-semibold font-sans mb-3 text-foreground transition-colors duration-normal group-hover:text-accent-light">
        {post.title}
      </h2>

      {/* Excerpt */}
      {post.excerpt && (
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-serif mb-4">
          {post.excerpt}
        </p>
      )}

      {/* Metadata */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground font-sans">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4" />
          <time dateTime={post.publishedAt}>
            {formatDate(post.publishedAt)}
          </time>
        </div>

        {post.readingTime && (
          <div className="flex items-center gap-2">
            <ClockIcon className="w-4 h-4" />
            <span>{post.readingTime} min</span>
          </div>
        )}
      </div>
    </article>
  );
}
