# Plan: ASCII Art as Blog Featured Image (CMS-Driven)

**Created:** 2025-12-12
**Updated:** 2025-12-12
**Status:** Implemented

## Overview

Replace the standard featured image in BlogHero with ASCII art that uses the dynamic accent color from our design system. Content editors can select ASCII art type per blog post via Sanity CMS, making it flexible and maintainable without code changes.

## Requirements

- Single accent color (no gradient)
- Replace featured image position in BlogHero
- Static display (no animation)
- Responsive sizing
- CMS-controlled: editors choose ASCII art type per post
- Follows existing design system patterns

## Implementation Steps

### Step 1: Add ASCII Art Field to Sanity Blog Schema

**File:** `sanity/schemas/blog.ts`

Add a new field after `featuredImage`:

```ts
defineField({
  name: 'asciiArt',
  title: 'ASCII Art (Alternative to Image)',
  type: 'string',
  description: 'Display ASCII art instead of featured image. Leave empty to use featured image.',
  options: {
    list: [
      { title: 'None', value: 'none' },
      { title: 'Filing Cabinet', value: 'filing-cabinet' },
      // Add more options here as collection grows
    ],
    layout: 'radio',
  },
  initialValue: 'none',
}),
```

### Step 2: Update Blog Type Definition

**File:** `src/types/blog.ts`

Add the new field to the Blog type:

```ts
export interface Blog {
  // ... existing fields
  asciiArt?: 'none' | 'filing-cabinet';
}
```

### Step 3: Update GROQ Queries

**File:** `src/lib/sanity/queries/blog.ts`

Add `asciiArt` field to `blogPostBySlugQuery`:

```groq
*[_type == "blog" && slug.current == $slug][0] {
  // ... existing fields
  asciiArt,
  featuredImage {
    // ...
  },
  // ...
}
```

### Step 4: Create ASCII Art Registry Component

**File:** `src/components/blog/AsciiArt.tsx`

Create a component that maps type strings to ASCII art:

```tsx
'use client';

import React from 'react';
import { cn } from '@/lib/utils';

// ASCII Art Registry - add new art here
const ASCII_ART_REGISTRY: Record<string, { art: string; label: string }> = {
  'filing-cabinet': {
    art: `...`, // The filing cabinet ASCII
    label: 'ASCII art illustration of a filing cabinet with a lightbulb',
  },
  // Add more art types here
};

export type AsciiArtType = keyof typeof ASCII_ART_REGISTRY;

interface AsciiArtProps {
  type: AsciiArtType;
  className?: string;
}

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

// Helper to check if a type is valid
export function isValidAsciiArtType(type: string | undefined): type is AsciiArtType {
  return !!type && type !== 'none' && type in ASCII_ART_REGISTRY;
}
```

### Step 5: Update BlogHero Component

**File:** `src/components/blog/BlogHero.tsx`

Modify to accept `asciiArtType` string prop:

```tsx
import { AsciiArt, isValidAsciiArtType } from './AsciiArt';

interface BlogHeroProps {
  heroSection?: BlogHeroType;
  title: string;
  featuredImage?: BlogImage;
  asciiArtType?: string;  // From CMS: 'none' | 'filing-cabinet' | etc.
  publishedAt?: string;
  author?: string;
}

export function BlogHero({
  heroSection,
  title,
  featuredImage,
  asciiArtType,
  publishedAt,
  author
}: BlogHeroProps) {
  // ...

  const showAsciiArt = isValidAsciiArtType(asciiArtType);

  return (
    // ...
    {/* Right: ASCII Art or Featured Image */}
    {showAsciiArt ? (
      <div className="w-full md:w-1/3 flex-shrink-0">
        <div className="flex items-center justify-center p-4 rounded-lg bg-card/50 border border-border/50 overflow-x-auto">
          <AsciiArt type={asciiArtType} />
        </div>
      </div>
    ) : imageUrl && (
      // ... existing image code
    )}
  );
}
```

### Step 6: Update Blog Post Page

**File:** `src/app/(public)/blog/[slug]/page.tsx`

Pass the `asciiArt` field from CMS to BlogHero:

```tsx
<BlogHero
  heroSection={post.heroSection}
  title={post.title}
  featuredImage={post.featuredImage}
  asciiArtType={post.asciiArt}  // NEW: Pass CMS value
  publishedAt={post.publishedAt}
  author={post.author}
/>
```

### Step 7: Export from Blog Index

**File:** `src/components/blog/index.ts`

```tsx
export { AsciiArt, isValidAsciiArtType, type AsciiArtType } from './AsciiArt';
```

## File Changes Summary

| File | Change Type | Description |
|------|-------------|-------------|
| `sanity/schemas/blog.ts` | Modify | Add `asciiArt` field with options |
| `src/types/blog.ts` | Modify | Add `asciiArt` to Blog interface |
| `src/lib/sanity/queries/blog.ts` | Modify | Add `asciiArt` to query |
| `src/components/blog/AsciiArt.tsx` | Create | ASCII art registry component |
| `src/components/blog/BlogHero.tsx` | Modify | Accept `asciiArtType` prop |
| `src/components/blog/index.ts` | Modify | Export new component |
| `src/app/(public)/blog/[slug]/page.tsx` | Modify | Pass `asciiArt` to BlogHero |

## Adding New ASCII Art (Future)

To add new ASCII art options:

1. Add the art string to `ASCII_ART_REGISTRY` in `AsciiArt.tsx`
2. Add the option to `asciiArt.options.list` in `sanity/schemas/blog.ts`
3. Update the type union in `src/types/blog.ts`

## Testing Checklist

- [ ] ASCII art displays correctly on desktop
- [ ] ASCII art displays correctly on mobile (smaller font size)
- [ ] Accent color changes with time-of-day theme (coral/purple)
- [ ] Accent color changes with light/dark mode
- [ ] Component is accessible (has aria-label)
- [ ] No layout shift when loading
- [ ] CMS field appears in Sanity Studio
- [ ] Selecting "None" shows featured image as normal
- [ ] Selecting "Filing Cabinet" shows ASCII art instead of image
- [ ] Works when featured image is also present (ASCII art takes precedence)

## Content Editor Workflow

1. Open blog post in Sanity Studio
2. Scroll to "ASCII Art (Alternative to Image)" field
3. Select desired option:
   - **None** (default): Uses featured image
   - **Filing Cabinet**: Shows filing cabinet ASCII art
4. Publish changes
