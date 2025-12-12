'use client';

import React from 'react';
import { cn } from '@/lib/utils';

/**
 * ASCII Art Registry
 * Add new ASCII art options here. Each entry needs:
 * - art: The ASCII art string
 * - label: Accessible description for screen readers
 */
const ASCII_ART_REGISTRY = {
  'filing-cabinet': {
    art: `   ______________________________
  /                             |
 /                             /|
/_____________________________/ |
|     [______]           (o) |  |
|     [========]             |  |
|----------------------------| /|
|     [______]               |  |
|     [========]             |  |
|----------------------------| /|
|     [______]               |  |
|     [========]             |  |
|____________________________|/
   ███                   ███`,
    label: 'ASCII art illustration of a filing cabinet',
  },
  // Add more ASCII art options here
} as const;

export type AsciiArtType = keyof typeof ASCII_ART_REGISTRY;

interface AsciiArtProps {
  type: AsciiArtType;
  className?: string;
}

/**
 * AsciiArt Component
 *
 * Renders ASCII art from the registry using the dynamic accent color.
 * Used as an alternative to featured images in blog posts.
 */
export function AsciiArt({ type, className }: AsciiArtProps) {
  const artConfig = ASCII_ART_REGISTRY[type];

  if (!artConfig) {
    return null;
  }

  return (
    <pre
      className={cn(
        'text-accent font-mono text-[0.4rem] sm:text-[0.5rem] md:text-[0.6rem] leading-tight whitespace-pre select-none',
        className
      )}
      aria-label={artConfig.label}
      role="img"
    >
      {artConfig.art}
    </pre>
  );
}

/**
 * Type guard to check if a string is a valid ASCII art type
 */
export function isValidAsciiArtType(type: string | undefined): type is AsciiArtType {
  return !!type && type !== 'none' && type in ASCII_ART_REGISTRY;
}
