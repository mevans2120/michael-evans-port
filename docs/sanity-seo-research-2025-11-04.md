# Sanity SEO and Social Metadata Research

**Date**: November 4, 2025
**Purpose**: Research and documentation for implementing comprehensive SEO and social metadata in Sanity CMS for the Michael Evans portfolio site.

---

## Executive Summary

To enable full SEO and social metadata control across all pages on the site, you need to:

1. **Create a reusable SEO object schema** (`seo.ts`) with fields for Open Graph and Twitter Cards
2. **Add the SEO field to existing document types** (project, aiShowcase, homepageHero, profile)
3. **Update Next.js `generateMetadata` functions** to use the Sanity SEO data
4. **Optionally create global SEO defaults** for fallback values

---

## Current State Analysis

### What You Have Now

**Pages with metadata:**
- `/src/app/layout.tsx` - Root metadata (line 32-35)
- `/src/app/(public)/page.tsx` - Homepage (line 9-12)
- `/src/app/(public)/about/page.tsx` - About page (line 6-9)
- `/src/app/(public)/case-studies/page.tsx` - Case studies index
- `/src/app/(public)/ai-showcase/page.tsx` - AI showcase
- `/src/app/(public)/case-studies/[slug]/page.tsx` - Dynamic case studies (line 145-162)

**Current metadata implementation:**
```typescript
// Static metadata (most pages)
export const metadata: Metadata = {
  title: 'About | Michael Evans',
  description: 'Product Manager, UX Strategist, and AI Builder...',
}

// Dynamic metadata (case studies)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { data: project } = await sanityFetch({...})
  return {
    title: `${project.title} | Michael Evans`,
    description: project.heroSection?.subtitle || project.heroSection?.summary,
  }
}
```

**What's Missing:**
- No Open Graph fields (`og:image`, `og:type`, `og:url`, etc.)
- No Twitter Card metadata (`twitter:card`, `twitter:image`, etc.)
- No canonical URLs
- No Sanity CMS control over SEO metadata (hardcoded in pages)
- No image metadata for social sharing
- No keywords or author metadata

---

## Recommended Implementation

### Phase 1: Create Reusable SEO Schema

Create `/sanity/schemas/objects/seo.ts`:

```typescript
import { defineField, defineType } from 'sanity'

export const seoType = defineType({
  name: 'seo',
  title: 'SEO & Social',
  type: 'object',
  description: 'Search engine optimization and social media metadata',
  options: {
    collapsed: false,
    collapsible: true,
  },
  fields: [
    // Basic SEO
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description: 'SEO title (50-60 characters recommended). Leave blank to use page title.',
      validation: (Rule) =>
        Rule.max(60).warning('Titles longer than 60 characters may be truncated by search engines'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      description: 'SEO description (150-160 characters recommended)',
      validation: (Rule) =>
        Rule.max(160).warning('Descriptions longer than 160 characters may be truncated by search engines'),
    }),
    defineField({
      name: 'keywords',
      title: 'Keywords',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'SEO keywords (optional, less important than they used to be)',
      options: {
        layout: 'tags',
      },
    }),

    // Open Graph (Facebook, LinkedIn, etc.)
    defineField({
      name: 'ogTitle',
      title: 'Open Graph Title',
      type: 'string',
      description: 'Title for social sharing (Facebook, LinkedIn). Leave blank to use Meta Title.',
      validation: (Rule) =>
        Rule.max(60).warning('Titles longer than 60 characters may be truncated'),
    }),
    defineField({
      name: 'ogDescription',
      title: 'Open Graph Description',
      type: 'text',
      rows: 2,
      description: 'Description for social sharing. Leave blank to use Meta Description.',
      validation: (Rule) =>
        Rule.max(200).warning('Descriptions longer than 200 characters may be truncated'),
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      description: 'Image for social sharing (1200x630px recommended)',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for accessibility and SEO',
        },
      ],
    }),

    // Twitter Cards
    defineField({
      name: 'twitterCard',
      title: 'Twitter Card Type',
      type: 'string',
      description: 'The type of Twitter card to use',
      options: {
        list: [
          { title: 'Summary (default)', value: 'summary' },
          { title: 'Summary with Large Image', value: 'summary_large_image' },
        ],
        layout: 'radio',
      },
      initialValue: 'summary_large_image',
    }),
    defineField({
      name: 'twitterTitle',
      title: 'Twitter Title',
      type: 'string',
      description: 'Title for Twitter sharing. Leave blank to use OG Title.',
      validation: (Rule) =>
        Rule.max(70).warning('Titles longer than 70 characters may be truncated'),
    }),
    defineField({
      name: 'twitterDescription',
      title: 'Twitter Description',
      type: 'text',
      rows: 2,
      description: 'Description for Twitter sharing. Leave blank to use OG Description.',
      validation: (Rule) =>
        Rule.max(200).warning('Descriptions longer than 200 characters may be truncated'),
    }),
    defineField({
      name: 'twitterImage',
      title: 'Twitter Image',
      type: 'image',
      description: 'Image for Twitter sharing (1200x675px for summary_large_image). Leave blank to use OG Image.',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        },
      ],
    }),

    // Advanced
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL',
      type: 'url',
      description: 'The canonical URL for this page (optional, usually auto-generated)',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['http', 'https'],
        }),
    }),
    defineField({
      name: 'noIndex',
      title: 'No Index',
      type: 'boolean',
      description: 'Prevent search engines from indexing this page',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'metaTitle',
      description: 'metaDescription',
      image: 'ogImage',
    },
    prepare({ title, description, image }) {
      return {
        title: title || 'No meta title set',
        subtitle: description || 'No meta description set',
        media: image,
      }
    },
  },
})
```

### Phase 2: Add SEO Field to Document Schemas

Update each document type to include the SEO field:

#### `/sanity/schemas/project.ts`

```typescript
import { seoType } from './objects/seo'

export default defineType({
  name: 'project',
  title: 'Projects',
  type: 'document',
  fields: [
    // ... existing fields ...

    // Add SEO field
    defineField({
      name: 'seo',
      title: 'SEO & Social',
      type: 'seo',
      description: 'Search engine and social media metadata for this project',
    }),
  ],
})
```

#### `/sanity/schemas/aiShowcase.ts`

```typescript
defineField({
  name: 'seo',
  title: 'SEO & Social',
  type: 'seo',
  description: 'Search engine and social media metadata for this showcase',
}),
```

#### `/sanity/schemas/homepageHero.ts`

```typescript
defineField({
  name: 'seo',
  title: 'SEO & Social',
  type: 'seo',
  description: 'Search engine and social media metadata for the homepage',
}),
```

#### `/sanity/schemas/profile.ts`

```typescript
defineField({
  name: 'seo',
  title: 'SEO & Social',
  type: 'seo',
  description: 'Search engine and social media metadata for the about page',
}),
```

### Phase 3: Register SEO Schema

Update `/sanity/schemas/index.ts`:

```typescript
import { seoType } from './objects/seo'

export const schemaTypes = [
  // Objects (reusable types)
  seoType,

  // Documents
  profile,
  homepageHero,
  project,
  aiShowcase,
  // ... rest
]
```

### Phase 4: Create Helper Function for Metadata Generation

Create `/src/lib/sanity/metadata.ts`:

```typescript
import { Metadata } from 'next'
import { urlFor } from './image'

interface SanityImage {
  asset?: {
    _ref: string
    _type: string
  }
  alt?: string
}

interface SanitySEO {
  metaTitle?: string
  metaDescription?: string
  keywords?: string[]
  ogTitle?: string
  ogDescription?: string
  ogImage?: SanityImage
  twitterCard?: 'summary' | 'summary_large_image'
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: SanityImage
  canonicalUrl?: string
  noIndex?: boolean
}

interface GenerateMetadataOptions {
  seo?: SanitySEO
  title: string // Fallback title (e.g., page title)
  description?: string // Fallback description
  path?: string // Current page path for canonical URL
  defaultImage?: string // Default OG image URL
}

export function generateSanityMetadata({
  seo,
  title,
  description,
  path,
  defaultImage,
}: GenerateMetadataOptions): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://michael-evans-port.vercel.app'

  // Titles with fallbacks
  const metaTitle = seo?.metaTitle || title
  const ogTitle = seo?.ogTitle || seo?.metaTitle || title
  const twitterTitle = seo?.twitterTitle || seo?.ogTitle || seo?.metaTitle || title

  // Descriptions with fallbacks
  const metaDescription = seo?.metaDescription || description || ''
  const ogDescription = seo?.ogDescription || seo?.metaDescription || description || ''
  const twitterDescription = seo?.twitterDescription || seo?.ogDescription || seo?.metaDescription || description || ''

  // Images with fallbacks
  const ogImageUrl = seo?.ogImage
    ? urlFor(seo.ogImage).width(1200).height(630).url()
    : defaultImage
  const twitterImageUrl = seo?.twitterImage
    ? urlFor(seo.twitterImage).width(1200).height(675).url()
    : ogImageUrl

  // Canonical URL
  const canonical = seo?.canonicalUrl || (path ? `${baseUrl}${path}` : undefined)

  const metadata: Metadata = {
    title: metaTitle,
    description: metaDescription,

    // Robots
    ...(seo?.noIndex && { robots: { index: false, follow: false } }),

    // Keywords
    ...(seo?.keywords && seo.keywords.length > 0 && { keywords: seo.keywords }),

    // Canonical URL
    ...(canonical && { alternates: { canonical } }),

    // Open Graph
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonical,
      siteName: 'Michael Evans Portfolio',
      locale: 'en_US',
      type: 'website',
      ...(ogImageUrl && {
        images: [{
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: seo?.ogImage?.alt || ogTitle,
        }],
      }),
    },

    // Twitter
    twitter: {
      card: seo?.twitterCard || 'summary_large_image',
      title: twitterTitle,
      description: twitterDescription,
      ...(twitterImageUrl && {
        images: [twitterImageUrl],
      }),
      // Optional: Add your Twitter handle
      // creator: '@yourtwitterhandle',
      // site: '@yourtwitterhandle',
    },
  }

  return metadata
}
```

### Phase 5: Update Pages to Use SEO Data

#### Example: Case Study Page

Update `/src/app/(public)/case-studies/[slug]/page.tsx`:

```typescript
import { generateSanityMetadata } from '@/lib/sanity/metadata'

// Update query to include SEO field
const EDITORIAL_PROJECT_QUERY = `*[_type == "project" && slug.current == $slug][0] {
  title,
  slug,
  category,
  heroSection { ... },
  seo {
    metaTitle,
    metaDescription,
    keywords,
    ogTitle,
    ogDescription,
    ogImage {
      asset,
      alt
    },
    twitterCard,
    twitterTitle,
    twitterDescription,
    twitterImage {
      asset,
      alt
    },
    canonicalUrl,
    noIndex
  },
  // ... rest of query
}`

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const { data: project } = await sanityFetch({
    query: EDITORIAL_PROJECT_QUERY,
    params: { slug },
  })

  if (!project) {
    return { title: 'Case Study Not Found' }
  }

  return generateSanityMetadata({
    seo: project.seo,
    title: `${project.title} | Michael Evans`,
    description: project.heroSection?.subtitle || project.heroSection?.summary,
    path: `/case-studies/${slug}`,
  })
}
```

#### Example: Homepage

Update `/src/app/(public)/page.tsx`:

```typescript
import { generateSanityMetadata } from '@/lib/sanity/metadata'

// Update query to include SEO field
const homepageHeroQuery = `*[_type == "homepageHero"][0] {
  tagline,
  description,
  seo { ... },
  // ... rest
}`

export async function generateMetadata(): Promise<Metadata> {
  const { data: homepage } = await sanityFetch({ query: homepageHeroQuery })

  return generateSanityMetadata({
    seo: homepage?.seo,
    title: 'Michael Evans | AI/ML Portfolio',
    description: 'Portfolio showcasing AI/ML expertise, creative technology solutions, and professional case studies.',
    path: '/',
  })
}
```

---

## Optional: Global SEO Defaults

Create a singleton for global SEO defaults that can be used as fallbacks.

### `/sanity/schemas/seoSettings.ts`

```typescript
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'seoSettings',
  title: 'Global SEO Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      initialValue: 'Michael Evans Portfolio',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'defaultMetaDescription',
      title: 'Default Meta Description',
      type: 'text',
      rows: 3,
      description: 'Fallback description when page-specific description is not set',
    }),
    defineField({
      name: 'defaultOgImage',
      title: 'Default Open Graph Image',
      type: 'image',
      description: 'Fallback image for social sharing (1200x630px)',
      options: { hotspot: true },
    }),
    defineField({
      name: 'twitterHandle',
      title: 'Twitter Handle',
      type: 'string',
      description: 'Your Twitter username (without @)',
    }),
    defineField({
      name: 'author',
      title: 'Default Author',
      type: 'string',
      initialValue: 'Michael Evans',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Global SEO Settings',
        subtitle: 'Site-wide SEO defaults',
      }
    },
  },
})
```

---

## Implementation Checklist

### Sanity Studio

- [ ] Create `/sanity/schemas/objects/seo.ts` with comprehensive SEO fields
- [ ] Add `seo` field to `project.ts` schema
- [ ] Add `seo` field to `aiShowcase.ts` schema
- [ ] Add `seo` field to `homepageHero.ts` schema
- [ ] Add `seo` field to `profile.ts` schema
- [ ] Register `seoType` in `/sanity/schemas/index.ts`
- [ ] (Optional) Create `seoSettings.ts` for global defaults
- [ ] Deploy Sanity schema changes
- [ ] Populate SEO data in Sanity Studio for existing pages

### Next.js Application

- [ ] Create `/src/lib/sanity/metadata.ts` helper function
- [ ] Update homepage query to fetch `seo` field
- [ ] Update homepage `generateMetadata` to use helper
- [ ] Update about page query to fetch `seo` field
- [ ] Update about page to use `generateMetadata` with helper
- [ ] Update case studies query to fetch `seo` field
- [ ] Update case studies `generateMetadata` to use helper
- [ ] Update AI showcase query to fetch `seo` field
- [ ] Update AI showcase `generateMetadata` to use helper
- [ ] Add default OG image to `/public` folder (1200x630px)
- [ ] Test metadata in browser dev tools
- [ ] Test Open Graph preview with [opengraph.xyz](https://www.opengraph.xyz/)
- [ ] Test Twitter Card preview with [cards-dev.twitter.com](https://cards-dev.twitter.com/validator)

---

## SEO Best Practices

### Image Sizes

- **Open Graph**: 1200x630px (1.91:1 ratio)
- **Twitter Summary**: 1200x1200px (1:1 ratio)
- **Twitter Large Image**: 1200x675px (16:9 ratio)

### Character Limits

- **Meta Title**: 50-60 characters (Google shows ~60)
- **Meta Description**: 150-160 characters (Google shows ~155-160)
- **Open Graph Title**: 60 characters max
- **Open Graph Description**: 200 characters max
- **Twitter Title**: 70 characters max
- **Twitter Description**: 200 characters max

### Testing Tools

- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [Open Graph Preview](https://www.opengraph.xyz/)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

---

## Next Steps

1. **Review this document** with stakeholders
2. **Create the SEO schema** in Sanity
3. **Add SEO fields to document types**
4. **Deploy schema changes** to Sanity
5. **Create the metadata helper function**
6. **Update pages** to use dynamic SEO metadata
7. **Populate SEO data** in Sanity Studio
8. **Test social sharing** with validation tools

---

## References

- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Sanity Schema Types](https://www.sanity.io/docs/schema-types)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- Sanity CLI Template: `/node_modules/@sanity/cli/templates/shopify/schemaTypes/objects/seoType.ts`
