# Blog Post Hero Icon Implementation

**Date**: November 20, 2025
**Status**: Planned

## Objective

Add a featured icon/image to the top right of blog post pages, matching the style used in case studies.

## Current State

### Case Study Hero (EditorialHero)
- ✅ Displays `featuredImage` on the right side (desktop) or below title (mobile)
- ✅ Located at: `/src/components/case-study-editorial/EditorialHero.tsx:74-88`
- ✅ Uses 1/3 width column on desktop
- ✅ Has shadow and border styling: `shadow-xl ring-1 ring-border/50`
- ✅ Top margin alignment: `md:mt-[42px]` to align with title

### Blog Post Hero (BlogHero)
- ❌ NO image display currently
- ❌ Only shows: badge, title, subtitle
- Location: `/src/components/blog/BlogHero.tsx`

### Data Availability
- ✅ Blog posts already have `featuredImage` field in Sanity
- ✅ Query already fetches it: `/src/lib/sanity/queries/blog.ts:46-52`
- ✅ Includes: asset, crop, hotspot, alt, caption

## Implementation Plan

### 1. Update BlogHero Component

**File**: `/src/components/blog/BlogHero.tsx`

**Changes needed**:

```tsx
'use client'

import React from 'react';
import Image from 'next/image';
import { buildImageUrl } from '@/lib/sanity/image-builder';
import type { BlogHero as BlogHeroType } from '@/types/blog';

interface BlogHeroProps {
  heroSection?: BlogHeroType;
  title: string;
  featuredImage?: {
    asset?: {
      _id: string;
      url: string;
    };
    crop?: {
      top: number;
      bottom: number;
      left: number;
      right: number;
    };
    hotspot?: {
      x: number;
      y: number;
      height: number;
      width: number;
    };
    alt?: string;
  };
}

export function BlogHero({ heroSection, title, featuredImage }: BlogHeroProps) {
  const { badge, subtitle } = heroSection || {};

  // Build image URL using 'hero' preset (same as case studies)
  const imageUrl = featuredImage?.asset
    ? buildImageUrl(featuredImage, 'hero')
    : null;

  return (
    <header className="space-y-6">
      {/* Content and Image Layout - Match Case Study Style */}
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
```

### 2. Update Blog Post Page

**File**: `/src/app/(public)/blog/[slug]/page.tsx`

**Changes needed**:

```tsx
// Line 62-65: Update BlogHero component call
<BlogHero
  heroSection={post.heroSection}
  title={post.title}
  featuredImage={post.featuredImage}  // ADD THIS LINE
/>
```

### 3. Update Blog Type Definition (if needed)

**File**: `/src/types/blog.ts`

Verify that the `Blog` type includes `featuredImage` field. If not present, add:

```tsx
export interface Blog {
  // ... existing fields
  featuredImage?: {
    asset?: {
      _id: string;
      url: string;
    };
    crop?: {
      top: number;
      bottom: number;
      left: number;
      right: number;
    };
    hotspot?: {
      x: number;
      y: number;
      height: number;
      width: number;
    };
    alt?: string;
    caption?: string;
  };
}
```

## Layout Behavior

### Desktop (md breakpoint and above)
```
┌────────────────────────────────────────────────────────┐
│  Badge                                    ┌─────────┐  │
│  Title (Large)                           │  Icon   │  │
│  Subtitle                                 │  Image  │  │
│                                            └─────────┘  │
└────────────────────────────────────────────────────────┘
```

### Mobile (below md breakpoint)
```
┌──────────────────────┐
│  Badge               │
│  Title (Large)       │
│  Subtitle            │
│  ┌────────────────┐  │
│  │  Icon Image    │  │
│  └────────────────┘  │
└──────────────────────┘
```

## Styling Details

Match case study styling exactly:

1. **Container**: `w-full md:w-1/3 flex-shrink-0`
2. **Top margin**: `md:mt-[42px]` (aligns with title baseline)
3. **Image wrapper**:
   - `relative rounded-lg overflow-hidden`
   - `bg-muted shadow-xl ring-1 ring-border/50`
4. **Image**:
   - `w-full h-auto object-contain`
   - `transition-opacity duration-normal`
   - Priority loading for above-fold content

## Testing Checklist

- [ ] Image displays on desktop (right side)
- [ ] Image displays on mobile (below text)
- [ ] Image has proper shadow and border
- [ ] Image alignment matches case studies
- [ ] No image shows gracefully (no broken layout)
- [ ] Image respects crop/hotspot from Sanity
- [ ] Dark mode styling works correctly
- [ ] Responsive breakpoints work as expected

## Files to Modify

1. `/src/components/blog/BlogHero.tsx` - Add image display
2. `/src/app/(public)/blog/[slug]/page.tsx` - Pass featuredImage prop
3. `/src/types/blog.ts` - Verify type definition (may already be correct)

## Notes

- The `featuredImage` data is already being fetched in the query
- Just need to wire it through to the component
- Uses same image builder utility as case studies (`buildImageUrl`)
- 'hero' preset: 1920x900, crop top, quality 85
- Image is optional - if not provided, layout remains text-only

## References

- Case Study Hero: `/src/components/case-study-editorial/EditorialHero.tsx:74-88`
- Blog Query: `/src/lib/sanity/queries/blog.ts:46-52`
- Image Builder: `/src/lib/sanity/image-builder.ts`
