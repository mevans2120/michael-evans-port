'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface AsciiArtProps {
  art: string;
  label?: string;
  className?: string;
}

/**
 * AsciiArt Component
 *
 * Renders ASCII art from CMS using the dynamic accent color.
 * Used as an alternative to featured images in blog posts.
 */
export function AsciiArt({ art, label, className }: AsciiArtProps) {
  if (!art) {
    return null;
  }

  return (
    <pre
      className={cn(
        'font-mono whitespace-pre leading-[1.15]',
        'text-accent text-[0.6rem]',
        'select-none',
        className
      )}
      aria-label={label || 'ASCII art illustration'}
      role="img"
    >
      {art}
    </pre>
  );
}

/**
 * Type guard to check if ASCII art should be displayed
 */
export function hasAsciiArt(art: string | null | undefined): art is string {
  return !!art && art.trim().length > 0;
}
