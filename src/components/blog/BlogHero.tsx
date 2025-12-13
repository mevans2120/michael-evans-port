'use client'

import React from 'react';
import Image from 'next/image';
import { CalendarIcon, UserIcon } from 'lucide-react';
import { buildImageUrl } from '@/lib/sanity/image-builder';
import type { BlogHero as BlogHeroType, BlogImage } from '@/types/blog';
import { AsciiArt, hasAsciiArt } from './AsciiArt';

interface BlogHeroProps {
  heroSection?: BlogHeroType;
  title: string;
  featuredImage?: BlogImage;
  asciiArt?: string | null;
  asciiArtLabel?: string;
  publishedAt?: string;
  author?: string;
}

/**
 * BlogHero Component
 *
 * Displays blog post hero with:
 * - Optional badge (category/type)
 * - Large title with gradient effect on hover
 * - Optional subtitle/tagline
 * - Optional featured image icon (top right on desktop)
 */
export function BlogHero({ heroSection, title, featuredImage, asciiArt, asciiArtLabel, publishedAt, author }: BlogHeroProps) {
  const { badge, subtitle } = heroSection || {};

  // Build image URL using 'hero' preset (same as case studies)
  const imageUrl = featuredImage?.asset
    ? buildImageUrl(featuredImage, 'hero')
    : null;

  // Check if we should show ASCII art instead of image
  const showAsciiArt = hasAsciiArt(asciiArt);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <header>
      {/* Content and Image Layout */}
      <div className="flex flex-col md:flex-row gap-2 md:gap-8 items-start">
        {/* Left: Text Content */}
        <div className="flex-1">
          {/* Badge */}
          {badge && (
            <div className="text-xs md:text-sm font-semibold text-accent tracking-wider uppercase font-sans mb-6">
              {badge}
            </div>
          )}

          {/* Title */}
          {title && (
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight font-sans text-foreground mb-6">
              {title}
            </h1>
          )}

          {/* Subtitle */}
          {subtitle && (
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-serif max-w-3xl">
              {subtitle}
            </p>
          )}
        </div>

        {/* Right: ASCII Art or Featured Image */}
        {showAsciiArt ? (
          <div className="flex-shrink-0 w-full md:w-auto flex justify-center md:justify-start">
            <div className="inline-flex items-center justify-center px-20 py-6 rounded-lg bg-card/50 border border-border/50">
              <AsciiArt art={asciiArt} label={asciiArtLabel} className="text-[0.38rem] sm:text-[0.45rem] md:text-[0.5rem]" />
            </div>
          </div>
        ) : imageUrl && (
          <div className="w-full md:w-1/3 flex-shrink-0">
            <div className="relative rounded-lg overflow-hidden bg-muted shadow-xl ring-1 ring-border/50">
              <Image
                src={imageUrl}
                alt={featuredImage?.alt || ""}
                width={600}
                height={800}
                priority
                sizes="(max-width: 768px) 100vw, 33vw"
                className="w-full h-auto object-contain transition-opacity duration-normal"
              />
            </div>
          </div>
        )}
      </div>

      {/* Byline - grouped with title, border below separates from body */}
      {publishedAt && (
        <div className="flex items-center gap-4 md:gap-6 text-sm text-muted-foreground font-sans pt-4 pb-4 mb-12 border-b border-border">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
          </div>
          {author && (
            <div className="flex items-center gap-2">
              <UserIcon className="w-4 h-4" />
              <span>{author}</span>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
