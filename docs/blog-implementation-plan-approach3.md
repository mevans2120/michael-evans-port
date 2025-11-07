# Blog Implementation Plan - Approach #3 + PostPal Migration

**Date**: November 6, 2025
**Author**: Claude Code
**Status**: Ready for Implementation

---

## Executive Summary

This document provides a comprehensive implementation plan for:

1. **Creating a new simple blog system** at `/blog` route (Approach #3)
2. **Migrating PostPal** from AI Showcase to Case Studies

**Key Decisions:**
- **Blog System**: New lightweight schema (150 lines) with 5 simple components
- **PostPal**: Move to case studies using existing project schema
- **Timeline**: 10-12 hours total
- **Files**: 11 new files, 7 modified files

**Why Approach #3?**
- Truly "exceptionally simple" - only what's needed for blog
- Clean separation from magazine/showcase system
- Future-proof for blog expansion
- Blog-specific features (publishedAt, author, reading time, excerpt)
- Maintainable, clear code intent

---

## Table of Contents

1. [Current State Analysis](#current-state-analysis)
2. [Blog System Architecture](#blog-system-architecture)
3. [PostPal Migration Strategy](#postpal-migration-strategy)
4. [Implementation Phases](#implementation-phases)
5. [File-by-File Changes](#file-by-file-changes)
6. [Complete Code Specifications](#complete-code-specifications)
7. [Testing & Verification](#testing--verification)
8. [Rollback Plan](#rollback-plan)
9. [Future Enhancements](#future-enhancements)

---

## Current State Analysis

### Existing AI Showcase System

**Routes:**
- `/ai-showcase` - Listing page
- `/ai-showcase/[slug]` - Detail pages

**Schema** (`/sanity/schemas/aiShowcase.ts`):
- 360+ lines
- Complex structure with hero, slides, timeline phases, workflow steps, metrics
- 3 categories: `ai-workflow`, `healthcare-ai`, `marketing-sites`
- Magazine-style content blocks

**Current Posts:**
1. **PostPal** (healthcare-ai) - Will move to case studies
2. **AI-Built Marketing Sites** (marketing-sites) - Will move to blog
3. **AI Workflow & Tools Evolution** (ai-workflow) - Will move to blog

**Components** (`/src/components/ai-showcase-magazine/`):
- 11 magazine-style components
- Complex rendering with slides, comparisons, timelines

### Existing Case Studies System

**Schema** (`/sanity/schemas/project.ts`):
- 828 lines
- Supports editorial format with sections
- Fields: heroSection, sections (array), techStack, metrics, cta, seo
- Already handles complex case study content

**Routes:**
- `/case-studies` - Listing page (uses FeaturedCaseStudies component)
- `/case-studies/[slug]` - Detail pages (uses ProjectPage component)

**PostPal Compatibility:**
- PostPal content structure maps well to project schema
- Can use existing editorial components
- Healthcare category already exists

---

## Blog System Architecture

### Schema Design

**Lightweight & Focused** (~150 lines vs 360+ for showcase)

```typescript
// /sanity/schemas/blog.ts
{
  name: 'blog',
  title: 'Blog',
  type: 'document',
  fields: [
    // Core
    title (string, required)
    slug (slug, required)
    excerpt (text, ~150 chars)

    // Hero
    heroSection {
      badge (string, optional)
      title (string)
      subtitle (string, optional)
    }

    // Content
    content (array: blocks + images)

    // Metadata
    publishedAt (datetime)
    updatedAt (datetime, auto)
    author (string)
    readingTime (number, calculated)

    // Organization
    featured (boolean)
    order (number)

    // Media
    featuredImage (image with alt)

    // SEO
    seo (object with meta tags)
  ]
}
```

**Key Differences from AI Showcase:**
- No slides, timeline phases, workflow steps, or project cards
- Single content array (not slide-based)
- Blog-specific fields: publishedAt, author, readingTime, excerpt
- Simpler hero section
- Smaller, focused schema

### Component Architecture

**5 Simple Components** (total ~220 lines):

```
/src/components/blog/
├── BlogLayout.tsx         (~40 lines) - Article wrapper
├── BlogHero.tsx           (~50 lines) - Title, badge, subtitle
├── BlogContent.tsx        (~30 lines) - PortableText renderer
├── BlogMeta.tsx           (~40 lines) - Date, author, time
├── BlogPostCard.tsx       (~60 lines) - Listing card
└── index.ts               (exports)
```

**Design Principles:**
- Single-purpose components (<100 lines)
- No complex state management
- Standard HTML structure
- Tailwind utility classes
- Mobile-first responsive design

### Route Structure

**Blog Listing** (`/blog/page.tsx`):
- Fetches all blog posts ordered by publishedAt DESC
- Displays BlogPostCard for each
- Generates metadata for SEO

**Blog Detail** (`/blog/[slug]/page.tsx`):
- Fetches single blog post by slug
- Renders BlogLayout → BlogHero → BlogMeta → BlogContent
- Generates dynamic metadata
- Static generation for all posts

### Data Flow

```
Sanity CMS (blog documents)
    ↓
GROQ Queries (blogPosts, blogPostBySlug)
    ↓
Next.js Routes (page.tsx, [slug]/page.tsx)
    ↓
Blog Components (Layout, Hero, Content, Meta)
    ↓
Rendered Blog Page
```

---

## PostPal Migration Strategy

### Current PostPal Structure

**In aiShowcase:**
- Category: `healthcare-ai`
- Hero: Badge, title, subtitle, summary
- Slides: Problem, Solution, Impact, Technology
- Content: Comparison boxes, tech stack, metrics
- Timeline: Workflow steps for patient journey

### Target Case Study Structure

**In project schema:**
- Category: `Healthcare` (or new `Healthcare AI`)
- heroSection: Same fields (compatible)
- sections: Convert slides to editorial sections
- techStack: Already exists
- metrics: Already exists
- Reuse existing ProjectPage component

### Content Transformation

**Slide 1: Problem → Section 1**
```
heading: "The Challenge"
content: [Problem description from slide]
comparisonBoxes: [Before state from comparison]
```

**Slide 2: Solution → Section 2**
```
heading: "The Solution"
content: [Solution description]
visualCards: [Architecture diagrams, screenshots]
techStack: [Technologies used]
```

**Slide 3: Impact → Section 3**
```
heading: "The Impact"
content: [Impact narrative]
metrics: [30-50% call reduction, etc.]
```

**Slide 4: Technology → Section 4**
```
heading: "Technical Implementation"
content: [Technical details]
codeBlocks: [If applicable]
```

### Migration Steps

1. **Export PostPal data** from Sanity (aiShowcase)
2. **Create new project document** in Sanity Studio
3. **Transform content**:
   - Map hero section (1:1)
   - Convert slides → sections array
   - Extract metrics → metrics field
   - Extract tech stack → techStack field
4. **Set metadata**:
   - category: "Healthcare AI"
   - publishedAt: Original date
   - featured: true
   - order: (appropriate value)
5. **Verify rendering** at `/case-studies/postpal`
6. **Delete from aiShowcase**

---

## Implementation Phases

### Phase 1: Planning Document (CURRENT)
**Time**: 5 minutes
**Status**: ✓ Complete

- [x] Create comprehensive plan at `/docs/blog-implementation-plan-approach3.md`

### Phase 2: Blog Schema & Types
**Time**: 1.5 hours
**Dependencies**: None

**Tasks:**
1. Create `/sanity/schemas/blog.ts` (30 min)
2. Create `/src/types/blog.ts` (20 min)
3. Create `/src/lib/sanity/queries/blog.ts` (20 min)
4. Update `/sanity/schemas/index.ts` (5 min)
5. Deploy schema to Sanity Studio (15 min)

**Verification:**
- [ ] Blog schema appears in Sanity Studio
- [ ] No TypeScript errors
- [ ] Can create test blog document

### Phase 3: Blog Components
**Time**: 2-3 hours
**Dependencies**: Phase 2 (types)

**Tasks:**
1. Create `/src/components/blog/` directory (1 min)
2. Create `BlogLayout.tsx` (30 min)
3. Create `BlogHero.tsx` (30 min)
4. Create `BlogContent.tsx` (20 min)
5. Create `BlogMeta.tsx` (30 min)
6. Create `BlogPostCard.tsx` (40 min)
7. Create `index.ts` (5 min)

**Verification:**
- [ ] All components compile without errors
- [ ] TypeScript types are correct
- [ ] Components follow Tailwind styling guidelines

### Phase 4: Blog Routes
**Time**: 2 hours
**Dependencies**: Phase 2, Phase 3

**Tasks:**
1. Create `/src/app/(public)/blog/page.tsx` (60 min)
2. Create `/src/app/(public)/blog/[slug]/page.tsx` (60 min)

**Verification:**
- [ ] Routes compile successfully
- [ ] Static generation works
- [ ] Metadata generation works
- [ ] Can view pages (even with no content)

### Phase 5: Navigation Integration
**Time**: 1-2 hours
**Dependencies**: Phase 4

**Tasks:**
1. Update `NavigationMenu.tsx` - Change "AI Showcase" to "Blog" (15 min)
2. Update homepage - Reference blog posts instead of showcases (30 min)
3. Update `/src/app/api/link-metadata/route.ts` - Add blog handling (20 min)
4. Update `/src/components/chatbot/LinkPreview.tsx` - Add blog detection (15 min)
5. Update `/src/app/api/chat/route.ts` - Update chatbot context (15 min)
6. Update query exports if needed (10 min)

**Verification:**
- [ ] Navigation shows "Blog" link
- [ ] Blog link works from navigation
- [ ] Homepage shows blog posts (if applicable)
- [ ] Chatbot recognizes blog links

### Phase 6: Blog Content Migration
**Time**: 1 hour
**Dependencies**: Phase 5

**Tasks:**
1. Create "AI-Built Marketing Sites" blog post in Sanity (30 min)
   - Extract content from aiShowcase
   - Transform to blog format
   - Set publishedAt date
   - Add featuredImage
   - Set author, excerpt

2. Create "AI Workflow & Tools Evolution" blog post in Sanity (30 min)
   - Flatten timeline content to narrative
   - Convert phases to prose
   - Set metadata

**Verification:**
- [ ] Both blog posts visible in Sanity Studio
- [ ] Blog listing shows both posts
- [ ] Detail pages render correctly
- [ ] Images load properly
- [ ] SEO metadata correct

### Phase 7: PostPal Case Study Migration
**Time**: 2-4 hours
**Dependencies**: Phase 6 (blog migration complete)

**Tasks:**
1. Analyze PostPal content in aiShowcase (30 min)
   - Document all content sections
   - Identify images and assets
   - Map fields to project schema

2. Create PostPal case study in Sanity (60-90 min)
   - Create new project document
   - Transform slides to sections
   - Add metrics, tech stack
   - Upload images
   - Set metadata

3. Verify rendering (30 min)
   - Test `/case-studies/postpal`
   - Check all sections render
   - Verify images load
   - Test responsive design

4. Delete from aiShowcase (10 min)

**Verification:**
- [ ] PostPal accessible at `/case-studies/postpal`
- [ ] All content sections present
- [ ] Images and media load correctly
- [ ] Metrics display properly
- [ ] Tech stack visible
- [ ] SEO metadata correct
- [ ] Mobile responsive

### Phase 8: Testing & Cleanup
**Time**: 1 hour
**Dependencies**: Phase 7

**Tasks:**
1. Test blog system (20 min)
   - [ ] Blog listing loads
   - [ ] Both blog posts accessible
   - [ ] Navigation works
   - [ ] Mobile responsive
   - [ ] Images load
   - [ ] Reading time calculated
   - [ ] SEO metadata present

2. Test PostPal case study (15 min)
   - [ ] Page loads
   - [ ] All sections render
   - [ ] Links work
   - [ ] Responsive design

3. Test integration points (15 min)
   - [ ] Chatbot handles blog links
   - [ ] Link previews work
   - [ ] API routes functional

4. Cleanup (10 min)
   - [ ] Archive aiShowcase documents (don't delete yet)
   - [ ] Remove unused AI Showcase references
   - [ ] Update any remaining links

**Final Verification:**
- [ ] No broken links
- [ ] No console errors
- [ ] Build succeeds: `npm run build`
- [ ] All pages render in production build

---

## File-by-File Changes

### New Files to Create (11)

#### 1. `/sanity/schemas/blog.ts` (~150 lines)
Blog schema definition with fields, previews, validation

#### 2. `/src/types/blog.ts` (~80 lines)
TypeScript interfaces for Blog, BlogHero, BlogMeta

#### 3. `/src/lib/sanity/queries/blog.ts` (~60 lines)
GROQ queries: allBlogPostsQuery, blogPostBySlugQuery, allBlogSlugsQuery

#### 4. `/src/components/blog/BlogLayout.tsx` (~40 lines)
Article wrapper with max-width and spacing

#### 5. `/src/components/blog/BlogHero.tsx` (~50 lines)
Badge, title, subtitle with gradient effects

#### 6. `/src/components/blog/BlogContent.tsx` (~30 lines)
PortableText renderer with custom serializers

#### 7. `/src/components/blog/BlogMeta.tsx` (~40 lines)
Published date, updated date, author, reading time

#### 8. `/src/components/blog/BlogPostCard.tsx` (~60 lines)
Card for blog listing with image, title, excerpt, date

#### 9. `/src/components/blog/index.ts` (~10 lines)
Export all blog components

#### 10. `/src/app/(public)/blog/page.tsx` (~200 lines)
Blog listing route with metadata generation

#### 11. `/src/app/(public)/blog/[slug]/page.tsx` (~150 lines)
Blog detail route with static generation

---

### Files to Modify (7)

#### 1. `/sanity/schemas/index.ts`
Add blog schema import and export

```typescript
import blog from './blog';

export const schemaTypes = [
  // ... existing schemas
  blog, // ADD THIS
];
```

#### 2. `/src/components/navigation/NavigationMenu.tsx`
Change AI Showcase to Blog

```typescript
// BEFORE:
{ href: '/ai-showcase', label: 'AI Showcase' }

// AFTER:
{ href: '/blog', label: 'Blog' }
```

#### 3. `/src/app/(public)/page.tsx` (Homepage)
Update to fetch blog posts instead of showcases (if homepage shows them)

```typescript
// Update query from aiShowcase to blog
const blogPosts = await sanityFetch({ query: allBlogPostsQuery });
```

#### 4. `/src/app/api/link-metadata/route.ts`
Add blog route detection

```typescript
// Add blog handling
if (pathname.startsWith('/blog/')) {
  const slug = pathname.replace('/blog/', '');
  const post = await sanityFetch({
    query: blogPostBySlugQuery,
    params: { slug }
  });
  // ... return metadata
}
```

#### 5. `/src/components/chatbot/LinkPreview.tsx`
Add blog link detection

```typescript
// Add regex for blog links
const isBlogLink = /^\/blog\/[^/]+$/.test(href);
```

#### 6. `/src/app/api/chat/route.ts`
Update chatbot context with blog information

```typescript
// Add blog posts to context
const blogPosts = await sanityFetch({ query: allBlogPostsQuery });
```

#### 7. `/src/lib/sanity/queries/index.ts` (if exists)
Export blog queries

```typescript
export * from './blog';
```

---

## Complete Code Specifications

### 1. Blog Schema (`/sanity/schemas/blog.ts`)

```typescript
import { defineType, defineField } from 'sanity';
import { BookOpenIcon } from '@sanity/icons';

export default defineType({
  name: 'blog',
  title: 'Blog',
  type: 'document',
  icon: BookOpenIcon,
  fields: [
    // Core fields
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Blog post title (used in listings and hero)',
      validation: (Rule) => Rule.required().max(100),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL-friendly version of title',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      description: 'Brief summary for listings and SEO (~150 characters)',
      rows: 3,
      validation: (Rule) => Rule.max(200),
    }),

    // Hero section
    defineField({
      name: 'heroSection',
      title: 'Hero Section',
      type: 'object',
      fields: [
        {
          name: 'badge',
          title: 'Badge',
          type: 'string',
          description: 'Small uppercase label (e.g., "AI Showcase")',
        },
        {
          name: 'title',
          title: 'Hero Title',
          type: 'string',
          description: 'Large display title (can differ from main title)',
        },
        {
          name: 'subtitle',
          title: 'Subtitle',
          type: 'text',
          rows: 2,
          description: 'Tagline below title',
        },
      ],
    }),

    // Content
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      description: 'Main blog post content',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
            { title: 'Quote', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
              { title: 'Code', value: 'code' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alt Text',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
          ],
        },
      ],
      validation: (Rule) => Rule.required(),
    }),

    // Metadata
    defineField({
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      description: 'When the post was published',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'updatedAt',
      title: 'Updated Date',
      type: 'datetime',
      description: 'When the post was last updated (optional)',
    }),

    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      description: 'Author name',
      initialValue: 'Michael Evans',
    }),

    defineField({
      name: 'readingTime',
      title: 'Reading Time (minutes)',
      type: 'number',
      description: 'Estimated reading time in minutes',
      validation: (Rule) => Rule.min(1).max(60),
    }),

    // Organization
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Show in featured listings',
      initialValue: false,
    }),

    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Sort order (lower numbers appear first)',
      initialValue: 0,
    }),

    // Media
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      description: 'Main image for listings and social sharing',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
          validation: (Rule) => Rule.required(),
        },
      ],
    }),

    // SEO
    defineField({
      name: 'seo',
      title: 'SEO Metadata',
      type: 'object',
      fields: [
        {
          name: 'metaTitle',
          type: 'string',
          title: 'Meta Title',
          description: 'Override default title for SEO (60 chars)',
          validation: (Rule) => Rule.max(60),
        },
        {
          name: 'metaDescription',
          type: 'text',
          title: 'Meta Description',
          rows: 3,
          description: 'SEO description (150-160 chars)',
          validation: (Rule) => Rule.max(160),
        },
        {
          name: 'ogImage',
          type: 'image',
          title: 'Open Graph Image',
          description: 'Custom image for social sharing',
        },
      ],
    }),
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'excerpt',
      media: 'featuredImage',
      publishedAt: 'publishedAt',
    },
    prepare({ title, subtitle, media, publishedAt }) {
      const date = publishedAt
        ? new Date(publishedAt).toLocaleDateString()
        : 'No date';
      return {
        title,
        subtitle: `${date} - ${subtitle || 'No excerpt'}`,
        media,
      };
    },
  },

  orderings: [
    {
      title: 'Published Date (Newest)',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Published Date (Oldest)',
      name: 'publishedAtAsc',
      by: [{ field: 'publishedAt', direction: 'asc' }],
    },
    {
      title: 'Title (A-Z)',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
});
```

### 2. Blog Types (`/src/types/blog.ts`)

```typescript
import { PortableTextBlock } from 'sanity';

export interface BlogHero {
  badge?: string;
  title?: string;
  subtitle?: string;
}

export interface BlogImage {
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt: string;
  caption?: string;
}

export interface BlogSEO {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: BlogImage;
}

export interface Blog {
  _id: string;
  _type: 'blog';
  _createdAt: string;
  _updatedAt: string;

  // Core
  title: string;
  slug: {
    current: string;
  };
  excerpt?: string;

  // Hero
  heroSection?: BlogHero;

  // Content
  content: PortableTextBlock[];

  // Metadata
  publishedAt: string;
  updatedAt?: string;
  author?: string;
  readingTime?: number;

  // Organization
  featured?: boolean;
  order?: number;

  // Media
  featuredImage?: BlogImage;

  // SEO
  seo?: BlogSEO;
}

export interface BlogListItem {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  excerpt?: string;
  publishedAt: string;
  author?: string;
  readingTime?: number;
  featuredImage?: BlogImage;
}
```

### 3. Blog Queries (`/src/lib/sanity/queries/blog.ts`)

```typescript
import { groq } from 'next-sanity';

/**
 * Query to fetch all blog posts for listing page
 * Ordered by publishedAt descending (newest first)
 */
export const allBlogPostsQuery = groq`
  *[_type == "blog"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    author,
    readingTime,
    featuredImage {
      asset,
      alt
    },
    featured,
    order
  }
`;

/**
 * Query to fetch a single blog post by slug
 * Includes all fields needed for rendering
 */
export const blogPostBySlugQuery = groq`
  *[_type == "blog" && slug.current == $slug][0] {
    _id,
    _createdAt,
    _updatedAt,
    title,
    slug,
    excerpt,
    heroSection {
      badge,
      title,
      subtitle
    },
    content,
    publishedAt,
    updatedAt,
    author,
    readingTime,
    featuredImage {
      asset,
      alt,
      caption
    },
    seo {
      metaTitle,
      metaDescription,
      ogImage {
        asset,
        alt
      }
    }
  }
`;

/**
 * Query to fetch all blog post slugs
 * Used for static generation (generateStaticParams)
 */
export const allBlogSlugsQuery = groq`
  *[_type == "blog" && defined(slug.current)] {
    "slug": slug.current
  }
`;

/**
 * Query to fetch featured blog posts
 * Useful for homepage or featured sections
 */
export const featuredBlogPostsQuery = groq`
  *[_type == "blog" && featured == true] | order(order asc, publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    author,
    readingTime,
    featuredImage {
      asset,
      alt
    }
  }
`;
```

### 4. BlogLayout Component

```typescript
// /src/components/blog/BlogLayout.tsx
import React from 'react';

interface BlogLayoutProps {
  children: React.ReactNode;
}

/**
 * BlogLayout Component
 *
 * Simple article wrapper providing:
 * - Centered column with max-width
 * - Appropriate padding and spacing
 * - Semantic HTML structure
 */
export function BlogLayout({ children }: BlogLayoutProps) {
  return (
    <article className="w-full max-w-[920px] mx-auto px-6 md:px-8 py-16 md:py-20">
      <div className="space-y-12">
        {children}
      </div>
    </article>
  );
}
```

### 5. BlogHero Component

```typescript
// /src/components/blog/BlogHero.tsx
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
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight font-sans transition-colors duration-slower group-hover:text-accent-light">
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
```

### 6. BlogMeta Component

```typescript
// /src/components/blog/BlogMeta.tsx
import React from 'react';
import { CalendarIcon, ClockIcon, UserIcon } from 'lucide-react';

interface BlogMetaProps {
  publishedAt: string;
  updatedAt?: string;
  author?: string;
  readingTime?: number;
}

/**
 * BlogMeta Component
 *
 * Displays blog post metadata:
 * - Published date
 * - Updated date (if different)
 * - Author
 * - Reading time estimate
 */
export function BlogMeta({ publishedAt, updatedAt, author, readingTime }: BlogMetaProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-muted-foreground font-sans">
      {/* Published Date */}
      <div className="flex items-center gap-2">
        <CalendarIcon className="w-4 h-4" />
        <time dateTime={publishedAt}>
          {formatDate(publishedAt)}
        </time>
      </div>

      {/* Author */}
      {author && (
        <div className="flex items-center gap-2">
          <UserIcon className="w-4 h-4" />
          <span>{author}</span>
        </div>
      )}

      {/* Reading Time */}
      {readingTime && (
        <div className="flex items-center gap-2">
          <ClockIcon className="w-4 h-4" />
          <span>{readingTime} min read</span>
        </div>
      )}

      {/* Updated Date (if different from published) */}
      {updatedAt && updatedAt !== publishedAt && (
        <div className="flex items-center gap-2 text-xs">
          <span>Updated {formatDate(updatedAt)}</span>
        </div>
      )}
    </div>
  );
}
```

### 7. BlogContent Component

```typescript
// /src/components/blog/BlogContent.tsx
import React from 'react';
import { PortableText, PortableTextComponents } from '@portabletext/react';
import type { PortableTextBlock } from 'sanity';
import { urlFor } from '@/lib/sanity/client';

interface BlogContentProps {
  content: PortableTextBlock[];
}

/**
 * BlogContent Component
 *
 * Renders blog post content using PortableText
 * with custom serializers for rich formatting
 */
export function BlogContent({ content }: BlogContentProps) {
  const components: PortableTextComponents = {
    block: {
      normal: ({ children }) => (
        <p className="text-lg leading-relaxed font-serif mb-6">
          {children}
        </p>
      ),
      h2: ({ children }) => (
        <h2 className="text-3xl md:text-4xl font-semibold font-sans mt-12 mb-6">
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3 className="text-2xl md:text-3xl font-semibold font-sans mt-10 mb-5">
          {children}
        </h3>
      ),
      h4: ({ children }) => (
        <h4 className="text-xl md:text-2xl font-semibold font-sans mt-8 mb-4">
          {children}
        </h4>
      ),
      blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-accent pl-6 my-8 text-xl italic text-muted-foreground">
          {children}
        </blockquote>
      ),
    },
    marks: {
      strong: ({ children }) => (
        <strong className="font-semibold text-foreground">{children}</strong>
      ),
      em: ({ children }) => (
        <em className="italic">{children}</em>
      ),
      code: ({ children }) => (
        <code className="bg-code-block px-2 py-1 rounded text-sm font-mono">
          {children}
        </code>
      ),
      link: ({ value, children }) => (
        <a
          href={value?.href}
          className="text-accent hover:text-accent-light underline transition-colors"
          target={value?.href?.startsWith('http') ? '_blank' : undefined}
          rel={value?.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        >
          {children}
        </a>
      ),
    },
    types: {
      image: ({ value }) => (
        <figure className="my-10">
          <img
            src={urlFor(value.asset).url()}
            alt={value.alt || ''}
            className="w-full rounded-lg"
          />
          {value.caption && (
            <figcaption className="text-sm text-muted-foreground text-center mt-3 font-sans">
              {value.caption}
            </figcaption>
          )}
        </figure>
      ),
    },
  };

  return (
    <div className="prose prose-lg max-w-none">
      <PortableText value={content} components={components} />
    </div>
  );
}
```

### 8. BlogPostCard Component

```typescript
// /src/components/blog/BlogPostCard.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import type { BlogListItem } from '@/types/blog';
import { urlFor } from '@/lib/sanity/client';
import { CalendarIcon, ClockIcon } from 'lucide-react';

interface BlogPostCardProps {
  post: BlogListItem;
}

/**
 * BlogPostCard Component
 *
 * Card for blog listing page with:
 * - Featured image
 * - Title and excerpt
 * - Published date and reading time
 * - Click/tap to navigate
 */
export function BlogPostCard({ post }: BlogPostCardProps) {
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

  return (
    <article
      className="group cursor-pointer border-b border-border pb-8 transition-smooth hover:opacity-80"
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
      {/* Featured Image */}
      {post.featuredImage && (
        <div className="mb-6 overflow-hidden rounded-lg">
          <img
            src={urlFor(post.featuredImage.asset).width(800).url()}
            alt={post.featuredImage.alt}
            className="w-full h-[240px] object-cover transition-transform duration-slower group-hover:scale-105"
          />
        </div>
      )}

      {/* Title */}
      <h2 className="text-2xl md:text-3xl font-semibold font-sans mb-3 transition-colors group-hover:text-accent-light">
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
    </article>
  );
}
```

### 9. Blog Listing Page

```typescript
// /src/app/(public)/blog/page.tsx
import React from 'react';
import { Metadata } from 'next';
import { sanityFetch } from '@/lib/sanity/client';
import { allBlogPostsQuery } from '@/lib/sanity/queries/blog';
import { BlogPostCard } from '@/components/blog';
import type { BlogListItem } from '@/types/blog';

export const metadata: Metadata = {
  title: 'Blog | Michael Evans',
  description: 'Insights on AI, creative technology, and building with AI-powered tools',
};

export default async function BlogPage() {
  const posts = await sanityFetch<BlogListItem[]>({
    query: allBlogPostsQuery,
  });

  return (
    <main className="w-full max-w-[920px] mx-auto px-6 md:px-8 py-16 md:py-20">
      {/* Header */}
      <header className="mb-16">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold font-sans mb-6">
          Blog
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground font-serif max-w-2xl">
          Insights on AI, creative technology, and building with AI-powered tools
        </p>
      </header>

      {/* Blog Posts */}
      {posts && posts.length > 0 ? (
        <div className="space-y-12">
          {posts.map((post) => (
            <BlogPostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-lg text-muted-foreground">
            No blog posts yet. Check back soon!
          </p>
        </div>
      )}
    </main>
  );
}
```

### 10. Blog Detail Page

```typescript
// /src/app/(public)/blog/[slug]/page.tsx
import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { sanityFetch } from '@/lib/sanity/client';
import { blogPostBySlugQuery, allBlogSlugsQuery } from '@/lib/sanity/queries/blog';
import { BlogLayout, BlogHero, BlogMeta, BlogContent } from '@/components/blog';
import type { Blog } from '@/types/blog';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const slugs = await sanityFetch<{ slug: string }[]>({
    query: allBlogSlugsQuery,
  });

  return slugs.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await sanityFetch<Blog>({
    query: blogPostBySlugQuery,
    params: { slug: params.slug },
  });

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const metaTitle = post.seo?.metaTitle || post.title;
  const metaDescription = post.seo?.metaDescription || post.excerpt || '';

  return {
    title: `${metaTitle} | Michael Evans`,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: post.author ? [post.author] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await sanityFetch<Blog>({
    query: blogPostBySlugQuery,
    params: { slug: params.slug },
  });

  if (!post) {
    notFound();
  }

  return (
    <BlogLayout>
      <BlogHero
        heroSection={post.heroSection}
        fallbackTitle={post.title}
      />

      <BlogMeta
        publishedAt={post.publishedAt}
        updatedAt={post.updatedAt}
        author={post.author}
        readingTime={post.readingTime}
      />

      <BlogContent content={post.content} />
    </BlogLayout>
  );
}
```

---

## Testing & Verification

### Unit Tests
- [ ] Blog schema validates correctly
- [ ] Blog queries return expected data
- [ ] Components render without errors
- [ ] TypeScript types are correct

### Integration Tests
- [ ] Blog listing page loads
- [ ] Blog detail pages load
- [ ] Navigation works
- [ ] Images load from Sanity CDN
- [ ] PortableText renders correctly

### Visual Tests
- [ ] Responsive design on mobile
- [ ] Responsive design on tablet
- [ ] Responsive design on desktop
- [ ] Dark mode support (if applicable)
- [ ] Typography hierarchy correct
- [ ] Spacing and layout consistent

### SEO Tests
- [ ] Meta tags generated correctly
- [ ] Open Graph metadata present
- [ ] Static generation works
- [ ] Page titles correct
- [ ] Descriptions present

### Performance Tests
- [ ] Build succeeds: `npm run build`
- [ ] No console errors
- [ ] Images optimized
- [ ] Static pages generated
- [ ] Fast page loads

---

## Rollback Plan

If issues arise during implementation:

### Phase 2-4 Rollback (Before Navigation Changes)
1. Delete new blog files
2. Remove blog schema from Sanity
3. No impact on existing site

### Phase 5-6 Rollback (After Navigation Changes)
1. Revert navigation changes
2. Restore AI Showcase references
3. Delete blog files
4. Remove blog schema
5. Keep aiShowcase intact

### Phase 7 Rollback (PostPal Migration Issues)
1. Leave PostPal in aiShowcase if migration fails
2. Blog system can still launch without it
3. Retry PostPal migration later

### Full Rollback
```bash
# Restore from git
git stash
git checkout main

# Or revert specific commit
git revert <commit-hash>
```

---

## Future Enhancements

### Blog Features (Post-Launch)
- [ ] Tags/categories system
- [ ] Related posts
- [ ] Search functionality
- [ ] RSS feed
- [ ] Comments system
- [ ] Author bios with multiple authors
- [ ] Blog series/collections
- [ ] Code syntax highlighting
- [ ] Table of contents
- [ ] Share buttons
- [ ] Reading progress indicator

### PostPal Enhancements
- [ ] Interactive demos
- [ ] Video embeds
- [ ] Client testimonials
- [ ] Detailed metrics dashboards

### Performance Optimizations
- [ ] Image optimization
- [ ] Lazy loading
- [ ] Prefetching
- [ ] Bundle size optimization

---

## Success Criteria

### Minimum Viable Product (MVP)
- [x] Planning document complete
- [ ] Blog system live at `/blog`
- [ ] 2 blog posts accessible
- [ ] PostPal live at `/case-studies/postpal`
- [ ] Navigation updated
- [ ] No broken links
- [ ] SEO metadata working
- [ ] Mobile responsive
- [ ] Build succeeds

### Full Success
- [ ] All MVP criteria met
- [ ] All tests passing
- [ ] No console errors
- [ ] Fast page loads (<2s)
- [ ] Chatbot integration working
- [ ] Link previews working
- [ ] User feedback positive
- [ ] Content easy to manage in Sanity

---

## Timeline Summary

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| 1. Planning | 5 min | None |
| 2. Schema & Types | 1.5 hrs | None |
| 3. Components | 2-3 hrs | Phase 2 |
| 4. Routes | 2 hrs | Phase 2, 3 |
| 5. Navigation | 1-2 hrs | Phase 4 |
| 6. Blog Migration | 1 hr | Phase 5 |
| 7. PostPal Migration | 2-4 hrs | Phase 6 |
| 8. Testing & Cleanup | 1 hr | Phase 7 |
| **TOTAL** | **10-12 hrs** | Sequential |

---

## Notes

- Keep aiShowcase schema/routes for now (don't delete until blog is stable)
- Take Sanity backup before migrations
- Test each phase before proceeding to next
- Document any deviations from this plan
- Update this document with actual timings

---

**End of Implementation Plan**
