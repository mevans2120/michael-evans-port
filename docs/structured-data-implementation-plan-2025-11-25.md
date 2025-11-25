# Structured Data Implementation Plan

**Date:** November 25, 2025
**Related:** [Structured Data Research](./structured-data-research-2025-11-25.md)

## Overview

This document outlines a phased approach to implementing structured data (schema.org/JSON-LD) across the portfolio site, with all data sourced from Sanity CMS.

---

## CMS Field Audit

### Current Fields Available

| Schema Need | CMS Field | Location | Status |
|-------------|-----------|----------|--------|
| Person name | `name` | profile | Ready |
| Person image | `profileImage` | profile | Ready |
| Person jobTitle | `heroHeadline` or `title` | profile | Ready |
| Person description | `heroSubheadline` or `bio` | profile | Ready |
| Person email | `social.email` | profile | Ready |
| Person sameAs (social) | `social.github`, `social.linkedin`, `social.twitter`, `social.bluesky` | profile | Ready |
| Person skills/knowsAbout | `skills` | profile | Ready (legacy) |
| Person worksFor | `experience` (with `current: true`) | profile | Ready |
| Site name | `siteName` | seoSettings | Ready |
| Site URL | `siteUrl` | seoSettings | Ready |
| Site description | `defaultMetaDescription` | seoSettings | Ready |
| Blog headline | `title` | blog | Ready |
| Blog description | `excerpt` | blog | Ready |
| Blog image | `featuredImage` | blog | Ready |
| Blog datePublished | `publishedAt` | blog | Ready |
| Blog dateModified | `updatedAt` | blog | Ready |
| Blog author | `author` | blog | Ready |
| Case study headline | `title` | project | Ready |
| Case study description | `featuredDescription` | project | Ready |
| Case study image | `featuredImage` | project | Ready |
| Case study datePublished | `publishedAt` | project | Ready |

### New Fields Needed

| Schema Need | Suggested Field | Location | Priority |
|-------------|-----------------|----------|----------|
| Person alumniOf | `education` array | profile | Low |
| Case study dateModified | `updatedAt` | project | Medium |
| Case study author | `author` (default to profile) | project | Low |

---

## Phase 1: Core Identity (High Priority) ✅

**Goal:** Establish site-wide Person schema for brand identity and potential Knowledge Panel.

### 1.1 Create Shared Structured Data Utilities

**File:** `src/lib/structured-data.ts`

```typescript
import type { WithContext, Person, WebSite, ProfilePage, BlogPosting, Article, BreadcrumbList } from 'schema-dts';

// Type for Sanity profile data
interface SanityProfile {
  name: string;
  profileImage?: { asset: { url: string } };
  heroHeadline?: string;
  title?: string;
  heroSubheadline?: string;
  social?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    bluesky?: string;
    email?: string;
  };
  skills?: Array<{ category: string; skills: string[] }>;
  experience?: Array<{
    company: string;
    role: string;
    current?: boolean;
  }>;
}

interface SanitySeoSettings {
  siteName: string;
  siteUrl: string;
  defaultMetaDescription?: string;
  author?: string;
}

export function generatePersonSchema(
  profile: SanityProfile,
  siteUrl: string
): WithContext<Person> {
  const sameAs: string[] = [];
  if (profile.social?.github) sameAs.push(profile.social.github);
  if (profile.social?.linkedin) sameAs.push(profile.social.linkedin);
  if (profile.social?.twitter) sameAs.push(profile.social.twitter);
  if (profile.social?.bluesky) sameAs.push(profile.social.bluesky);

  // Extract skills as knowsAbout topics
  const knowsAbout = profile.skills?.flatMap(s => s.skills) || [];

  // Find current employer
  const currentJob = profile.experience?.find(e => e.current);

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.heroHeadline || profile.title,
    description: profile.heroSubheadline,
    url: siteUrl,
    image: profile.profileImage?.asset?.url,
    email: profile.social?.email,
    sameAs: sameAs.length > 0 ? sameAs : undefined,
    knowsAbout: knowsAbout.length > 0 ? knowsAbout : undefined,
    worksFor: currentJob ? {
      "@type": "Organization",
      name: currentJob.company,
    } : undefined,
  };
}

export function generateWebSiteSchema(
  seoSettings: SanitySeoSettings,
  personName: string
): WithContext<WebSite> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: seoSettings.siteName,
    url: seoSettings.siteUrl,
    description: seoSettings.defaultMetaDescription,
    author: {
      "@type": "Person",
      name: personName,
    },
  };
}
```

### 1.2 Create JSON-LD Component

**File:** `src/components/JsonLd.tsx`

```tsx
interface JsonLdProps {
  data: object | object[];
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(Array.isArray(data) ? data : data)
      }}
    />
  );
}
```

### 1.3 Add to Root Layout

**File:** `src/app/layout.tsx` (modify)

- Fetch profile and seoSettings from Sanity
- Generate Person + WebSite schemas
- Inject via `<JsonLd>` component in `<head>`

### 1.4 CMS Changes Required

**None for Phase 1** - All required fields exist.

### Implementation Tasks

- [x] Install `schema-dts` package for TypeScript types
- [x] Create `src/lib/structured-data.ts` with generator functions
- [x] Create `src/components/JsonLd.tsx` component
- [x] Create Sanity query for profile + seoSettings
- [x] Modify `src/app/layout.tsx` to include site-wide schemas
- [ ] Validate with Google Rich Results Test

---

## Phase 2: Profile Page (High Priority) ✅

**Goal:** Add ProfilePage schema to the About page.

### 2.1 Add ProfilePage Generator

**Add to:** `src/lib/structured-data.ts`

```typescript
export function generateProfilePageSchema(
  profile: SanityProfile,
  siteUrl: string,
  dateModified?: string
): WithContext<ProfilePage> {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    dateModified: dateModified,
    mainEntity: generatePersonSchema(profile, siteUrl),
  };
}
```

### 2.2 Modify About Page

**File:** `src/app/(public)/about/page.tsx`

- Import profile data (already fetched)
- Generate ProfilePage schema
- Add `<JsonLd>` component

### 2.3 CMS Changes Required

**None** - Uses existing profile data.

### Implementation Tasks

- [x] Add `generateProfilePageSchema` function
- [x] Modify about page to include ProfilePage schema
- [ ] Validate with Rich Results Test

---

## Phase 3: Blog Posts (High Priority) ✅

**Goal:** Add BlogPosting schema to all blog post pages.

### 3.1 Add BlogPosting Generator

**Add to:** `src/lib/structured-data.ts`

```typescript
interface SanityBlogPost {
  title: string;
  slug: { current: string };
  excerpt?: string;
  featuredImage?: {
    asset: { url: string };
    alt?: string;
  };
  publishedAt: string;
  updatedAt?: string;
  author?: string;
}

export function generateBlogPostingSchema(
  post: SanityBlogPost,
  siteUrl: string,
  authorProfile: SanityProfile
): WithContext<BlogPosting> {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage?.asset?.url,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    url: `${siteUrl}/blog/${post.slug.current}`,
    author: {
      "@type": "Person",
      name: post.author || authorProfile.name,
      url: `${siteUrl}/about`,
    },
    publisher: {
      "@type": "Person",
      name: authorProfile.name,
      url: siteUrl,
    },
  };
}
```

### 3.2 Modify Blog Post Page

**File:** `src/app/(public)/blog/[slug]/page.tsx`

- Fetch profile data for author info
- Generate BlogPosting schema
- Add `<JsonLd>` component

### 3.3 CMS Changes Required

**None** - All required fields exist in blog schema.

**Optional Enhancement:** Consider adding multiple image aspect ratios for featured images (16:9, 4:3, 1:1) for optimal rich results.

### Implementation Tasks

- [x] Add `generateBlogPostingSchema` function
- [x] Modify blog post page to include schema
- [ ] Validate with Rich Results Test

---

## Phase 4: Case Studies (Medium Priority) ✅

**Goal:** Add Article schema to case study pages.

### 4.1 Add Article Generator

**Add to:** `src/lib/structured-data.ts`

```typescript
interface SanityCaseStudy {
  title: string;
  slug: { current: string };
  featuredDescription?: string;
  featuredImage?: {
    asset: { url: string };
    alt?: string;
  };
  publishedAt?: string;
  updatedAt?: string;
  category?: string;
}

export function generateArticleSchema(
  caseStudy: SanityCaseStudy,
  siteUrl: string,
  authorProfile: SanityProfile
): WithContext<Article> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: caseStudy.title,
    description: caseStudy.featuredDescription,
    image: caseStudy.featuredImage?.asset?.url,
    datePublished: caseStudy.publishedAt,
    dateModified: caseStudy.updatedAt || caseStudy.publishedAt,
    url: `${siteUrl}/case-studies/${caseStudy.slug.current}`,
    author: {
      "@type": "Person",
      name: authorProfile.name,
      url: `${siteUrl}/about`,
    },
    about: caseStudy.category ? {
      "@type": "Thing",
      name: caseStudy.category,
    } : undefined,
  };
}
```

### 4.2 CMS Changes Required

**Add to project schema:**

```typescript
// In sanity/schemas/project.ts, add after publishedAt field:
defineField({
  name: 'updatedAt',
  title: 'Updated Date',
  type: 'datetime',
  description: 'When the case study was last updated (optional, for SEO)',
}),
```

**Priority:** Medium - Can implement schema without this field (will use publishedAt as fallback), but having updatedAt improves SEO signals.

### Implementation Tasks

- [ ] Add `updatedAt` field to project schema (optional)
- [x] Add `generateArticleSchema` function
- [x] Modify case study page to include schema
- [ ] Validate with Rich Results Test

---

## Phase 5: Breadcrumbs (Medium Priority) ✅

**Goal:** Add BreadcrumbList schema to all pages for improved navigation display.

### 5.1 Add BreadcrumbList Generator

**Add to:** `src/lib/structured-data.ts`

```typescript
interface BreadcrumbItem {
  name: string;
  url?: string; // undefined for current page (last item)
}

export function generateBreadcrumbSchema(
  items: BreadcrumbItem[],
  siteUrl: string
): WithContext<BreadcrumbList> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.url ? { item: `${siteUrl}${item.url}` } : {}),
    })),
  };
}
```

### 5.2 Usage Examples

```typescript
// Homepage - no breadcrumb needed

// About page
generateBreadcrumbSchema([
  { name: 'Home', url: '/' },
  { name: 'About' },
], siteUrl);

// Blog listing
generateBreadcrumbSchema([
  { name: 'Home', url: '/' },
  { name: 'Blog' },
], siteUrl);

// Individual blog post
generateBreadcrumbSchema([
  { name: 'Home', url: '/' },
  { name: 'Blog', url: '/blog' },
  { name: post.title },
], siteUrl);

// Case study
generateBreadcrumbSchema([
  { name: 'Home', url: '/' },
  { name: 'Case Studies', url: '/case-studies' },
  { name: caseStudy.title },
], siteUrl);
```

### 5.3 CMS Changes Required

**None** - Breadcrumbs are derived from page hierarchy.

### Implementation Tasks

- [x] Add `generateBreadcrumbSchema` function
- [x] Add breadcrumbs to about page
- [x] Add breadcrumbs to blog listing page
- [x] Add breadcrumbs to blog post pages
- [x] Add breadcrumbs to case studies listing page
- [x] Add breadcrumbs to case study pages
- [x] Add breadcrumbs to contact page
- [ ] Validate with Rich Results Test

---

## Phase 6: Future Enhancements (Low Priority)

### 6.1 Education/Alumni Information

**Add to profile schema:**

```typescript
defineField({
  name: 'education',
  title: 'Education',
  type: 'array',
  description: 'Educational background (for Person schema alumniOf)',
  of: [
    {
      type: 'object',
      fields: [
        { name: 'institution', type: 'string', title: 'Institution Name' },
        { name: 'degree', type: 'string', title: 'Degree/Certification' },
        { name: 'field', type: 'string', title: 'Field of Study' },
        { name: 'graduationYear', type: 'number', title: 'Graduation Year' },
      ],
    },
  ],
}),
```

### 6.2 Multiple Image Sizes

For optimal rich results, consider generating multiple aspect ratios for featured images:
- 16:9 (1200x675) - Primary
- 4:3 (1200x900) - Square-ish
- 1:1 (1200x1200) - Square

This could be handled via Sanity's image transformation API or at build time.

---

## Implementation Summary

| Phase | Schema Type | Pages | CMS Changes | Status |
|-------|-------------|-------|-------------|--------|
| 1 | Person + WebSite | Layout (all) | None | ✅ Complete |
| 2 | ProfilePage | /about | None | ✅ Complete |
| 3 | BlogPosting | /blog/[slug] | None | ✅ Complete |
| 4 | Article | /case-studies/[slug] | Add `updatedAt` (optional) | ✅ Complete |
| 5 | BreadcrumbList | All pages | None | ✅ Complete |
| 6 | Education, Images | Various | Add `education` array | Not Started |

---

## Validation Checklist

After each phase, validate using:

1. **Google Rich Results Test**: https://search.google.com/test/rich-results
2. **Schema Markup Validator**: https://validator.schema.org/
3. **Browser DevTools**: Check `<script type="application/ld+json">` in page source

### Common Issues to Watch

- Missing required `@context` and `@type`
- Invalid date formats (must be ISO 8601)
- Missing image URLs (check Sanity asset resolution)
- Broken sameAs URLs

---

## Dependencies

```bash
# Install TypeScript types for schema.org
npm install schema-dts
```

---

## File Structure After Implementation

```
src/
├── lib/
│   └── structured-data.ts    # All schema generators
├── components/
│   └── JsonLd.tsx            # Reusable JSON-LD component
└── app/
    ├── layout.tsx            # Person + WebSite (site-wide)
    └── (public)/
        ├── about/
        │   └── page.tsx      # + ProfilePage + Breadcrumb
        ├── blog/
        │   ├── page.tsx      # + Breadcrumb
        │   └── [slug]/
        │       └── page.tsx  # + BlogPosting + Breadcrumb
        ├── case-studies/
        │   ├── page.tsx      # + Breadcrumb
        │   └── [slug]/
        │       └── page.tsx  # + Article + Breadcrumb
        └── contact/
            └── page.tsx      # + Breadcrumb
```

---

---

## CMS Content Checklist

Fields marked with **SEO-only** are not displayed on the page - only used by search engines.

### Profile Fields (Sanity Studio → Profile)

| Field | Path in Studio | Purpose | Displayed? |
|-------|----------------|---------|------------|
| Name | Profile → Name | Person `name` | Yes (About page) |
| Hero Headline | Profile → Hero Headline | Person `jobTitle` | Yes (About page) |
| Hero Subheadline | Profile → Hero Subheadline | Person `description` | **SEO-only** |
| Social → GitHub | Profile → Social Links → GitHub | `sameAs` link | **SEO-only** |
| Social → LinkedIn | Profile → Social Links → LinkedIn | `sameAs` link | **SEO-only** |
| Social → Twitter | Profile → Social Links → Twitter | `sameAs` link | **SEO-only** |
| Social → Bluesky | Profile → Social Links → Bluesky | `sameAs` link | **SEO-only** |
| Social → Email | Profile → Social Links → Email | Person `email` | **SEO-only** |
| Skills | Profile → Skills | Person `knowsAbout` | **SEO-only** |
| Experience | Profile → Experience (with "Current" checked) | Person `worksFor` | **SEO-only** |

### SEO Settings (Sanity Studio → Global SEO Settings)

| Field | Purpose | Status |
|-------|---------|--------|
| Site Name | WebSite `name` | Required |
| Site URL | WebSite `url`, canonical URLs | Required |
| Default Meta Description | WebSite `description` | Recommended |

### Blog Posts (per post)

| Field | Purpose | Status |
|-------|---------|--------|
| Title | BlogPosting `headline` | Required |
| Excerpt | BlogPosting `description` | Recommended |
| Featured Image | BlogPosting `image` | Recommended |
| Published Date | BlogPosting `datePublished` | Required |
| Updated Date | BlogPosting `dateModified` | Optional |
| Author | BlogPosting `author` | Optional (defaults to profile) |

### Case Studies (per project)

| Field | Purpose | Status |
|-------|---------|--------|
| Title | Article `headline` | Required |
| Featured Description | Article `description` | Recommended |
| Featured Image | Article `image` | Recommended |
| Published At | Article `datePublished` | Recommended |
| Category | Article `about` | Optional |

---

## Sources

- [Google Structured Data Documentation](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
- [schema-dts NPM Package](https://www.npmjs.com/package/schema-dts)
- [Structured Data Research](./structured-data-research-2025-11-25.md)
