import React from 'react';
import type { BlogHero as BlogHeroType } from '@/types/blog';

interface BlogHeroProps {
  heroSection?: BlogHeroType;
  fallbackTitle?: string;
}

/**
 * BlogHero Component
 *
 * Displays blog post hero with:
 * - Optional badge (category/type)
 * - Large title with gradient effect on hover
 * - Optional subtitle/tagline
 */
export function BlogHero({ heroSection, fallbackTitle }: BlogHeroProps) {
  const title = heroSection?.title || fallbackTitle;
  const { badge, subtitle } = heroSection || {};

  return (
    <header className="space-y-6">
      {/* Badge */}
      {badge && (
        <div className="text-xs md:text-sm font-semibold text-accent tracking-wider uppercase font-sans">
          {badge}
        </div>
      )}

      {/* Title */}
      {title && (
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight font-sans text-foreground transition-colors duration-slower hover:text-accent-light">
          {title}
        </h1>
      )}

      {/* Subtitle */}
      {subtitle && (
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-serif max-w-3xl">
          {subtitle}
        </p>
      )}
    </header>
  );
}
