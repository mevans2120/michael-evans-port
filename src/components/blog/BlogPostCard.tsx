'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import type { BlogListItem } from '@/types/blog';
import { buildImageUrl } from '@/lib/sanity/image-builder';
import { CalendarIcon, ClockIcon } from 'lucide-react';

interface BlogPostCardProps {
  post: BlogListItem;
  index?: number;
}

/**
 * BlogPostCard Component
 *
 * Card for blog listing page with:
 * - Featured image
 * - Title and excerpt
 * - Published date and reading time
 * - Click/tap to navigate
 * - Alternating image position (left/right) on desktop
 */
export function BlogPostCard({ post, index = 0 }: BlogPostCardProps) {
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

  // Alternate image position: even indices on left, odd indices on right
  const isImageRight = index % 2 === 1;

  return (
    <article
      className="group cursor-pointer border-b border-border pb-12 mb-12 transition-smooth hover:opacity-90"
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
      <div className={`flex flex-col gap-8 items-start ${isImageRight ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
        {/* Featured Image */}
        {post.featuredImage && (
          <div className="w-full md:w-1/3 flex-shrink-0">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted">
              <img
                src={buildImageUrl(post.featuredImage.asset, 'card')}
                alt={post.featuredImage.alt}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-normal group-hover:opacity-90"
              />
            </div>
          </div>
        )}

        {/* Text Content */}
        <div className="flex-1">
          {/* Title */}
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-sans font-light leading-tight mb-4 text-foreground transition-colors duration-normal group-hover:text-accent-light">
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
        </div>
      </div>
    </article>
  );
}
