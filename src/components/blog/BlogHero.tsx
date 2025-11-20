'use client'

import React from 'react';
import Image from 'next/image';
import { buildImageUrl } from '@/lib/sanity/image-builder';
import type { BlogHero as BlogHeroType, BlogImage } from '@/types/blog';

interface BlogHeroProps {
  heroSection?: BlogHeroType;
  title: string;
  featuredImage?: BlogImage;
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
export function BlogHero({ heroSection, title, featuredImage }: BlogHeroProps) {
  const { badge, subtitle } = heroSection || {};

  // Build image URL using 'hero' preset (same as case studies)
  const imageUrl = featuredImage?.asset
    ? buildImageUrl(featuredImage, 'hero')
    : null;

  return (
    <header className="space-y-6">
      {/* Content and Image Layout */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight font-sans text-foreground transition-colors duration-slower hover:text-accent-light mb-6">
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

        {/* Right: Featured Image (Icon) */}
        {imageUrl && (
          <div className="w-full md:w-1/3 flex-shrink-0 md:mt-[42px]">
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
    </header>
  );
}
