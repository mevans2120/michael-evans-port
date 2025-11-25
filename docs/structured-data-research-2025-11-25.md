# Structured Data Research for Portfolio Website

**Date:** November 25, 2025
**Purpose:** Research structured data (schema.org) markup options to improve SEO and search result appearance

## Executive Summary

For a professional portfolio website like this one, there are **6 key structured data types** to consider implementing:

| Schema Type | Priority | Where to Use | Benefit |
|-------------|----------|--------------|---------|
| **Person** | High | Site-wide (layout) | Knowledge panel, brand identity |
| **ProfilePage** | High | About page | Enhanced author/creator visibility |
| **Article/BlogPosting** | High | Blog posts | Rich results with images, dates, author |
| **WebSite** | Medium | Homepage | Site name, search features |
| **BreadcrumbList** | Medium | All pages | Navigation in search results |
| **CreativeWork** | Low | Case studies | Project/work attribution |

## Detailed Analysis

### 1. Person Schema (High Priority)

**Purpose:** Establishes your professional identity and can power Google Knowledge Panels.

**Where to implement:** Site-wide in the root layout (`layout.tsx`)

**Key properties:**
- `name` - Full name
- `jobTitle` - Professional title (e.g., "AI/ML Engineer & Creative Technologist")
- `description` - Professional bio/summary
- `image` - Professional headshot
- `url` - This website
- `sameAs` - Array of social profile URLs (LinkedIn, GitHub, Twitter, etc.)
- `email` - Contact email
- `knowsAbout` - Areas of expertise
- `alumniOf` - Education
- `worksFor` - Current employer/organization

**Example JSON-LD:**
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Michael Evans",
  "jobTitle": "AI/ML Engineer & Creative Technologist",
  "description": "Professional bio here...",
  "url": "https://michael-evans.com",
  "image": "https://michael-evans.com/headshot.jpg",
  "sameAs": [
    "https://linkedin.com/in/michael-evans",
    "https://github.com/michael-evans",
    "https://twitter.com/michael_evans"
  ],
  "knowsAbout": ["AI/ML", "Creative Technology", "Product Design"],
  "email": "contact@michael-evans.com"
}
```

**SEO benefit:** Helps Google understand who you are as an entity, potentially enabling a Knowledge Panel and improving E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) signals.

**Source:** [Schema.org Person](https://schema.org/Person)

---

### 2. ProfilePage Schema (High Priority)

**Purpose:** Identifies a page as being about a specific person/creator.

**Where to implement:** About page (`/about`)

**Key properties:**
- `mainEntity` - The Person this page is about
- `dateCreated` / `dateModified` - Page timestamps
- `description` - Page description

**Example JSON-LD:**
```json
{
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "dateModified": "2025-11-25T00:00:00Z",
  "mainEntity": {
    "@type": "Person",
    "name": "Michael Evans",
    "description": "AI/ML Engineer & Creative Technologist",
    "image": "https://michael-evans.com/headshot.jpg",
    "sameAs": [
      "https://linkedin.com/in/michael-evans",
      "https://github.com/michael-evans"
    ]
  }
}
```

**SEO benefit:** Google shows enhanced results for profile pages in "Discussions and Forums" and author-related features.

**Source:** [Google ProfilePage Documentation](https://developers.google.com/search/docs/appearance/structured-data/profile-page)

---

### 3. Article / BlogPosting Schema (High Priority)

**Purpose:** Marks up blog posts for rich results with images, dates, and author info.

**Where to implement:** Individual blog post pages (`/blog/[slug]`)

**Key properties:**
- `headline` - Article title
- `description` - Summary/excerpt
- `image` - Featured image(s) - recommend multiple aspect ratios (16:9, 4:3, 1:1)
- `datePublished` / `dateModified` - ISO 8601 timestamps
- `author` - Person schema for the author
- `publisher` - Organization or Person

**Example JSON-LD:**
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Building AI-Powered Creative Tools",
  "description": "A deep dive into creating AI tools for creative professionals...",
  "image": [
    "https://michael-evans.com/blog/ai-tools-16x9.jpg",
    "https://michael-evans.com/blog/ai-tools-4x3.jpg",
    "https://michael-evans.com/blog/ai-tools-1x1.jpg"
  ],
  "datePublished": "2025-11-20T08:00:00Z",
  "dateModified": "2025-11-22T10:30:00Z",
  "author": {
    "@type": "Person",
    "name": "Michael Evans",
    "url": "https://michael-evans.com/about"
  },
  "publisher": {
    "@type": "Person",
    "name": "Michael Evans",
    "url": "https://michael-evans.com"
  }
}
```

**SEO benefit:** Can display enhanced search results with larger images, publication dates, and author info. Important for Google News and Google Discover visibility.

**Source:** [Google Article Documentation](https://developers.google.com/search/docs/appearance/structured-data/article)

---

### 4. WebSite Schema (Medium Priority)

**Purpose:** Provides site-level information and can enable sitelinks search box.

**Where to implement:** Homepage (`/`) or root layout

**Key properties:**
- `name` - Site name
- `url` - Site URL
- `description` - Site description
- `author` - Person or Organization

**Example JSON-LD:**
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Michael Evans - AI/ML & Creative Technology",
  "url": "https://michael-evans.com",
  "description": "Portfolio of Michael Evans, AI/ML Engineer & Creative Technologist",
  "author": {
    "@type": "Person",
    "name": "Michael Evans"
  }
}
```

**SEO benefit:** Helps Google understand your site's identity and may improve site name display in search results.

**Source:** [Schema.org WebSite](https://schema.org/WebSite)

---

### 5. BreadcrumbList Schema (Medium Priority)

**Purpose:** Shows page hierarchy in search results.

**Where to implement:** All pages with navigation hierarchy

**Key properties:**
- `itemListElement` - Array of ListItem objects with position, name, and item (URL)

**Example JSON-LD:**
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://michael-evans.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Blog",
      "item": "https://michael-evans.com/blog"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Building AI-Powered Creative Tools"
    }
  ]
}
```

**SEO benefit:** Search results show breadcrumb navigation instead of raw URL, improving click-through rates and user understanding of site structure.

**Source:** [Schema.org BreadcrumbList](https://schema.org/BreadcrumbList)

---

### 6. CreativeWork / Article for Case Studies (Lower Priority)

**Purpose:** Mark up case studies as professional creative work.

**Where to implement:** Individual case study pages (`/case-studies/[slug]`)

**Options:**
- `Article` - Works well, widely supported
- `Report` - For more formal case studies
- `CreativeWork` - Generic, but less feature-rich in search

**Recommended approach:** Use `Article` schema (same as blog posts) for case studies, as it has the best Google support and provides rich results.

**Example JSON-LD:**
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Redesigning the AI Onboarding Experience",
  "description": "Case study: How we improved user activation by 40%...",
  "image": "https://michael-evans.com/case-studies/ai-onboarding.jpg",
  "datePublished": "2025-10-15T00:00:00Z",
  "author": {
    "@type": "Person",
    "name": "Michael Evans"
  },
  "about": {
    "@type": "Thing",
    "name": "AI/ML User Experience Design"
  }
}
```

---

## Implementation Recommendations

### Phase 1: Core Identity (High Impact)
1. Add **Person** schema to root layout
2. Add **WebSite** schema to homepage
3. Add **ProfilePage** schema to about page

### Phase 2: Content Enhancement
4. Add **BlogPosting** schema to blog post pages
5. Add **Article** schema to case study pages

### Phase 3: Navigation
6. Add **BreadcrumbList** schema to all pages

### Next.js Implementation Notes

**Recommended approach:** Use JSON-LD in a `<script>` tag within page components.

```tsx
// Example component for structured data
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Usage in a page
export default function BlogPost({ post }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    // ... other properties
  };

  return (
    <>
      <JsonLd data={structuredData} />
      {/* Page content */}
    </>
  );
}
```

**TypeScript support:** Consider using the `schema-dts` npm package for type-safe structured data:
```bash
npm install schema-dts
```

```tsx
import type { Person, WithContext } from 'schema-dts';

const personData: WithContext<Person> = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Michael Evans",
  // TypeScript will validate all properties
};
```

### Validation Tools

Before deploying, validate structured data using:
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema Markup Validator](https://validator.schema.org/)

---

## What NOT to Implement

Based on 2024 Google updates, these schema types have been **deprecated or provide minimal value**:

- **FAQ Schema** - Deprecated for most sites (only shows for authoritative government/health sites)
- **HowTo Schema** - Deprecated rich results
- **Sitelinks Search Box** - Rarely displayed now

---

## Sources

- [Google Article Structured Data](https://developers.google.com/search/docs/appearance/structured-data/article)
- [Google ProfilePage Documentation](https://developers.google.com/search/docs/appearance/structured-data/profile-page)
- [Google Search Gallery - All Supported Types](https://developers.google.com/search/docs/appearance/structured-data/search-gallery)
- [Schema.org Person](https://schema.org/Person)
- [Schema.org CreativeWork](https://schema.org/CreativeWork)
- [Schema.org BreadcrumbList](https://schema.org/BreadcrumbList)
- [Next.js Structured Data Implementation](https://dev.to/khalisspasha/boost-your-websites-seo-with-structured-data-and-schema-in-nextjs-34pl)
- [Working With Structured Data in Next.js 14](https://craig.madethis.co.uk/2024/structured-data-next-14)
- [Web Almanac 2024 - Structured Data](https://almanac.httparchive.org/en/2024/structured-data)
- [Webmasters Stack Exchange - Portfolio Schema](https://webmasters.stackexchange.com/questions/104786/what-is-the-proper-schema-type-for-a-personal-portfolio)
