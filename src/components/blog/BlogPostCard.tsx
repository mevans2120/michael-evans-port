'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { BlogListItem } from '@/types/blog';
import { buildImageUrl } from '@/lib/sanity/image-builder';
import { CalendarIcon } from 'lucide-react';
import { AsciiArt, hasAsciiArt } from './AsciiArt';

interface BlogPostCardProps {
  post: BlogListItem;
  index?: number;
}

/**
 * BlogPostCard Component
 *
 * Card for blog listing page with:
 * - Featured image (lazy loaded for posts 3+)
 * - Title and excerpt
 * - Published date
 * - Click/tap to navigate via Link
 * - Alternating image position (left/right) on desktop
 */
export function BlogPostCard({ post, index = 0 }: BlogPostCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Alternate image position: even indices on left, odd indices on right
  const isImageRight = index % 2 === 1;
  const showAsciiArt = hasAsciiArt(post.asciiArt);

  return (
    <Link
      href={`/blog/${post.slug.current}`}
      className="block group"
      aria-label={`Read blog post: ${post.title}`}
    >
      <article className="cursor-pointer border-b border-border pb-12 mb-12 transition-smooth hover:opacity-90">
      <div className={`flex flex-col gap-8 items-start ${isImageRight ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
        {/* ASCII Art or Featured Image */}
        {showAsciiArt ? (
          <div className="w-full md:w-1/3 flex-shrink-0">
            <div className="flex items-center justify-center px-8 py-4 rounded-lg bg-card/50 border border-border/50">
              <AsciiArt art={post.asciiArt!} label={post.asciiArtLabel} className="text-[0.28rem] sm:text-[0.32rem] md:text-[0.38rem]" />
            </div>
          </div>
        ) : post.featuredImage?.asset && (
          <div className="w-full md:w-1/3 flex-shrink-0">
            <div className="relative rounded-lg overflow-hidden bg-muted">
              <Image
                src={buildImageUrl(post.featuredImage, 'card')}
                alt={post.featuredImage.alt || ''}
                width={600}
                height={450}
                sizes="(max-width: 768px) 100vw, 33vw"
                loading={index < 2 ? 'eager' : 'lazy'}
                className="w-full h-auto object-cover transition-opacity duration-normal group-hover:opacity-90"
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
          </div>
        </div>
      </div>
      </article>
    </Link>
  );
}
