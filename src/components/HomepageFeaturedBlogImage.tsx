'use client';

import React from 'react';
import Image from 'next/image';
import { AsciiArt, hasAsciiArt } from '@/components/blog/AsciiArt';

interface HomepageFeaturedBlogImageProps {
  featuredImage?: {
    asset?: {
      _id: string;
      url: string;
    };
    alt?: string;
  };
  asciiArt?: string | null;
  asciiArtLabel?: string;
  title: string;
  imageUrl?: string;
}

/**
 * Client component for homepage featured blog image/ASCII art
 * Handles the conditional rendering of ASCII art vs featured image
 */
export function HomepageFeaturedBlogImage({
  featuredImage,
  asciiArt,
  asciiArtLabel,
  title,
  imageUrl,
}: HomepageFeaturedBlogImageProps) {
  const showAsciiArt = hasAsciiArt(asciiArt);

  if (showAsciiArt) {
    return (
      <div className="w-full md:w-1/3 flex-shrink-0">
        <div className="w-full aspect-video flex items-center justify-center rounded-lg bg-card/50 border border-border/50">
          <AsciiArt art={asciiArt} label={asciiArtLabel} />
        </div>
      </div>
    );
  }

  if (featuredImage?.asset && imageUrl) {
    return (
      <div className="w-full md:w-1/3 flex-shrink-0">
        <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted">
          <Image
            src={imageUrl}
            alt={featuredImage.alt || title}
            fill
            className="object-cover transition-opacity duration-300 group-hover:opacity-90"
          />
        </div>
      </div>
    );
  }

  return null;
}
