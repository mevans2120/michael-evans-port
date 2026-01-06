# Services Page Implementation Plan

**Date:** December 30, 2025
**Base Concept:** Concept 3b (Refined Conversational)
**Status:** Ready for implementation

---

## Overview

This plan implements the Services page using Concept 3b - a conversational Q&A format where visitor questions are paired with service-focused answers. The implementation follows existing codebase patterns for animations, styling, and Sanity CMS integration.

---

## Design System Compliance

All styles map to existing design system tokens and utilities:

| Concept 3b Element | Design System Token/Utility |
|-------------------|----------------------------|
| Page background | `bg-background` |
| Text color | `text-foreground` |
| Question text (accent) | `text-accent dark:text-accent-light` |
| Answer card background | `bg-card` |
| Answer card border | `border-l-[3px] border-accent dark:border-accent-light` |
| Answer title | `font-sans text-foreground` |
| Answer body text | `font-serif text-muted-foreground` |
| Question label | `text-muted-foreground text-xs uppercase tracking-wider` |
| Hero lead text | `text-muted-foreground` |
| Interlude gradient line | `bg-gradient-to-b from-transparent via-accent to-transparent` |
| Card hover transition | `transition-colors-smooth` |
| Page load animation | `animate-in fade-in duration-700` |
| Staggered section animation | `animate-in fade-in` with `animation-delay` |
| Blur orbs | `bg-accent/15 blur-[100px]` (matches About page) |

---

## Phase 1: Sanity Schema

### File: `/sanity/schemas/servicesPage.ts`

```typescript
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'servicesPage',
  title: 'Services Page',
  type: 'document',
  fields: [
    // Hero Section
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      description: 'Main headline for the services page',
      initialValue: 'The best partnerships start with good questions',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'text',
      rows: 2,
      description: 'Supporting text below the headline',
      initialValue: 'Here are the ones I hear most often from teams considering working together.',
      validation: (Rule) => Rule.max(200),
    }),

    // Service Entries (with optional lead-in quote)
    defineField({
      name: 'serviceEntries',
      title: 'Service Entries',
      type: 'array',
      description: 'Each entry is a service, optionally introduced by a quote or testimonial',
      of: [
        {
          type: 'object',
          name: 'serviceEntry',
          title: 'Service Entry',
          fields: [
            // Optional lead-in (quote, testimonial, or question)
            defineField({
              name: 'leadInText',
              title: 'Lead-in Text (Optional)',
              type: 'text',
              rows: 2,
              description: 'Optional quote, testimonial, or question shown before the service. Leave empty to show service card alone.',
              validation: (Rule) => Rule.max(150),
            }),
            defineField({
              name: 'leadInAttribution',
              title: 'Lead-in Attribution (Optional)',
              type: 'string',
              description: 'Attribution for the quote (e.g., "VP Product, Fintech Startup"). Leave empty for no attribution.',
            }),
            defineField({
              name: 'serviceTitle',
              title: 'Service Title',
              type: 'string',
              description: 'The service name (e.g., "Product Strategy")',
              validation: (Rule) => Rule.required().max(50),
            }),
            defineField({
              name: 'answerParagraphs',
              title: 'Answer Paragraphs',
              type: 'array',
              description: 'One or more paragraphs explaining the service',
              of: [{ type: 'text', rows: 3 }],
              validation: (Rule) => Rule.required().min(1).max(4),
            }),
          ],
          preview: {
            select: {
              title: 'serviceTitle',
              subtitle: 'leadInText',
            },
            prepare({ title, subtitle }) {
              return {
                title: title || 'Untitled Service',
                subtitle: subtitle ? `"${subtitle.slice(0, 50)}..."` : '(No lead-in)',
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1).max(8),
    }),

    // Interlude Section
    defineField({
      name: 'interludeText',
      title: 'Interlude Quote',
      type: 'string',
      description: 'Quote displayed between services and footer',
      initialValue: 'Every project starts with a conversation like this.',
      validation: (Rule) => Rule.max(100),
    }),

    // SEO
    defineField({
      name: 'seo',
      title: 'SEO & Social',
      type: 'seo',
      description: 'Search engine and social media settings',
    }),
  ],

  preview: {
    prepare() {
      return {
        title: 'Services Page',
        subtitle: 'Singleton document',
      }
    },
  },
})
```

### Register Schema

**File:** `/sanity/schemas/index.ts`

Add to the schemas array:
```typescript
import servicesPage from './servicesPage'

export const schemaTypes = [
  // ... existing schemas
  servicesPage,
]
```

---

## Phase 2: Sanity Query

### File: `/src/lib/sanity/queries.ts`

Add the following query:

```typescript
// Services Page (Singleton)
export const servicesPageQuery = groq`
  *[_type == "servicesPage"][0] {
    _id,
    heroTitle,
    heroSubtitle,
    serviceEntries[] {
      _key,
      leadInText,
      leadInAttribution,
      serviceTitle,
      answerParagraphs
    },
    interludeText,
    seo {
      metaTitle,
      metaDescription,
      keywords,
      twitterCard,
      canonicalUrl,
      noIndex
    }
  }
`
```

---

## Phase 3: TypeScript Types

### File: `/src/lib/sanity/types.ts` (or inline in page)

```typescript
export interface ServiceEntry {
  _key: string
  leadInText?: string        // Optional quote/testimonial
  leadInAttribution?: string // Optional attribution (e.g., "VP Product, Fintech")
  serviceTitle: string
  answerParagraphs: string[]
}

export interface ServicesPageData {
  _id: string
  heroTitle: string
  heroSubtitle?: string
  serviceEntries: ServiceEntry[]
  interludeText?: string
  seo?: {
    metaTitle?: string
    metaDescription?: string
    keywords?: string[]
    twitterCard?: string
    canonicalUrl?: string
    noIndex?: boolean
  }
}
```

---

## Phase 4: React Components

### Component Structure

```
/src/components/services/
├── ServiceEntry.tsx         # Single service with optional lead-in quote
├── ServicesHero.tsx         # Hero section
└── ServicesInterlude.tsx    # Interlude quote section
```

### 4.1 ServiceEntry Component

**File:** `/src/components/services/ServiceEntry.tsx`

```tsx
'use client'

interface ServiceEntryProps {
  leadInText?: string        // Optional quote/testimonial
  leadInAttribution?: string // Optional attribution
  serviceTitle: string
  answerParagraphs: string[]
}

export function ServiceEntry({
  leadInText,
  leadInAttribution,
  serviceTitle,
  answerParagraphs,
}: ServiceEntryProps) {
  return (
    <div className="flex flex-col gap-5">
      {/* Optional Lead-in (quote/testimonial) - right-aligned */}
      {leadInText && (
        <div className="self-end max-w-[85%] text-right">
          <p className="font-serif text-[1.375rem] font-normal text-accent dark:text-accent-light italic">
            "{leadInText}"
          </p>
          {leadInAttribution && (
            <p className="text-[0.6875rem] uppercase tracking-[0.12em] text-muted-foreground mt-1.5">
              — {leadInAttribution}
            </p>
          )}
        </div>
      )}

      {/* Service card (left-aligned, or full-width if no lead-in) */}
      <div className={leadInText ? "self-start max-w-[90%]" : "w-full"}>
        <div className="bg-card border-l-[3px] border-accent dark:border-accent-light px-7 py-6 transition-colors-smooth hover:border-purple-700 dark:hover:border-purple-300">
          <h3 className="font-sans text-xl font-medium text-foreground mb-3">
            {serviceTitle}
          </h3>
          {answerParagraphs.map((paragraph, index) => (
            <p
              key={index}
              className="font-serif text-muted-foreground leading-[1.7] mb-3 last:mb-0"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
```

### 4.2 ServicesHero Component

**File:** `/src/components/services/ServicesHero.tsx`

```tsx
interface ServicesHeroProps {
  title: string
  subtitle?: string
}

export function ServicesHero({ title, subtitle }: ServicesHeroProps) {
  return (
    <section className="min-h-[50vh] flex flex-col justify-center pt-[120px] pb-[60px] animate-in fade-in duration-700">
      <h1 className="font-sans text-[clamp(2rem,4vw,3rem)] font-light leading-[1.3] mb-6">
        {title}
      </h1>
      {subtitle && (
        <p className="font-serif text-lg text-muted-foreground">
          {subtitle}
        </p>
      )}
    </section>
  )
}
```

### 4.3 ServicesInterlude Component

**File:** `/src/components/services/ServicesInterlude.tsx`

```tsx
interface ServicesInterludeProps {
  text?: string
}

export function ServicesInterlude({ text }: ServicesInterludeProps) {
  if (!text) return null

  return (
    <section className="py-[60px] text-center animate-in fade-in duration-700" style={{ animationDelay: '0.2s' }}>
      {/* Gradient line */}
      <div className="w-px h-12 mx-auto mb-6 bg-gradient-to-b from-transparent via-accent dark:via-accent-light to-transparent" />

      <p className="font-serif text-lg font-light text-muted-foreground italic">
        "{text}"
      </p>
    </section>
  )
}
```

---

## Phase 5: Page Route

### File: `/src/app/(public)/services/page.tsx`

```tsx
import { Metadata } from 'next'
import { cachedSanityFetch } from '@/sanity/lib/fetch'
import { servicesPageQuery } from '@/lib/sanity/queries'
import { generateSanityMetadata } from '@/lib/sanity/metadata'
import { JsonLd } from '@/components/JsonLd'
import { generateBreadcrumbSchema } from '@/lib/structured-data'
import { ServicesHero } from '@/components/services/ServicesHero'
import { ServiceEntry } from '@/components/services/ServiceEntry'
import { ServicesInterlude } from '@/components/services/ServicesInterlude'

interface ServiceEntryData {
  _key: string
  leadInText?: string
  leadInAttribution?: string
  serviceTitle: string
  answerParagraphs: string[]
}

interface ServicesPageData {
  _id: string
  heroTitle: string
  heroSubtitle?: string
  serviceEntries: ServiceEntryData[]
  interludeText?: string
  seo?: {
    metaTitle?: string
    metaDescription?: string
    keywords?: string[]
    twitterCard?: string
    canonicalUrl?: string
    noIndex?: boolean
  }
}

// Fallback content if CMS is empty
const fallbackContent: ServicesPageData = {
  _id: 'fallback',
  heroTitle: 'Services',
  heroSubtitle: 'How I help teams build better products.',
  serviceEntries: [
    {
      _key: '1',
      leadInText: 'Michael helped us see what we couldn\'t.',
      leadInAttribution: 'VP Product, Fintech Startup',
      serviceTitle: 'Product Strategy',
      answerParagraphs: [
        'I work with teams to translate ambition into actionable plans. We\'ll clarify your vision, validate market opportunities, and create a roadmap that aligns your team and stakeholders.',
        'This usually means deep discovery, competitive analysis, and helping you prioritize ruthlessly so you can ship what matters most.',
      ],
    },
    {
      _key: '2',
      // No leadInText - shows service card alone
      serviceTitle: 'AI/ML Implementation',
      answerParagraphs: [
        'Start with the business problem, not the technology. I help teams identify where AI can genuinely add value - then build practical solutions that actually ship to production.',
      ],
    },
    // ... additional fallback entries
  ],
  interludeText: 'Every project starts with a conversation.',
}

export async function generateMetadata(): Promise<Metadata> {
  const { data: pageData } = await cachedSanityFetch<ServicesPageData | null>({
    query: servicesPageQuery,
    tags: ['services'],
  })

  return generateSanityMetadata({
    seo: pageData?.seo,
    title: 'Services | Michael Evans',
    description: pageData?.heroSubtitle || 'Product strategy, AI/ML implementation, experience design, and technical leadership consulting.',
    path: '/services',
  })
}

export default async function ServicesPage() {
  const { data: pageData } = await cachedSanityFetch<ServicesPageData | null>({
    query: servicesPageQuery,
    tags: ['services'],
  })

  const content = pageData || fallbackContent
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://michael-evans.dev'

  // Structured data for SEO
  const breadcrumbSchema = generateBreadcrumbSchema(
    [{ name: 'Home', url: '/' }, { name: 'Services' }],
    siteUrl
  )

  return (
    <>
      <JsonLd data={[breadcrumbSchema]} />

      <div className="min-h-screen bg-background text-foreground relative">
        {/* Atmospheric blur orbs (matches About page) */}
        <div className="fixed top-[10%] left-[10%] w-[400px] h-[400px] bg-accent/15 rounded-full blur-[100px] pointer-events-none -z-10" />
        <div className="fixed bottom-[20%] right-[10%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] pointer-events-none -z-10" />

        <main className="max-w-[700px] mx-auto px-6">
          {/* Hero */}
          <ServicesHero
            title={content.heroTitle}
            subtitle={content.heroSubtitle}
          />

          {/* Services Section */}
          <section className="pt-10 pb-20">
            <div
              className="flex flex-col gap-12 animate-in fade-in duration-700"
              style={{ animationDelay: '0.1s' }}
            >
              {content.serviceEntries.map((entry) => (
                <ServiceEntry
                  key={entry._key}
                  leadInText={entry.leadInText}
                  leadInAttribution={entry.leadInAttribution}
                  serviceTitle={entry.serviceTitle}
                  answerParagraphs={entry.answerParagraphs}
                />
              ))}
            </div>
          </section>

          {/* Interlude */}
          <ServicesInterlude text={content.interludeText} />
        </main>
      </div>
    </>
  )
}
```

---

## Phase 6: Soft Launch Strategy

**Decision:** No feature flag needed. Page will be accessible at `/services` but not linked from navigation until ready.

### Launch Phases

1. **Development Phase** (current)
   - Build page components and Sanity schema
   - Page exists at `/services` but is unlisted
   - Test with direct URL access

2. **Content Phase**
   - Populate content in Sanity Studio
   - Review and refine copy
   - Internal review via direct link

3. **Launch Phase** (when ready)
   - Add "Services" to navigation (header/footer as appropriate)
   - Announce availability

### Why This Works
- Low traffic site — unlikely someone guesses `/services`
- No code changes needed to launch — just add nav link
- Can share direct link for feedback before public launch

---

## Phase 7: Cache Invalidation

### Webhook Tag

Add `'services'` to the cache invalidation webhook handler:

**File:** `/src/app/api/sanity/webhook/route.ts` (or similar)

Ensure the webhook recognizes `servicesPage` document type and invalidates the `services` tag.

---

## Implementation Checklist

### Phase 1: Schema
- [ ] Create `/sanity/schemas/servicesPage.ts`
- [ ] Register schema in `/sanity/schemas/index.ts`
- [ ] Verify schema appears in Sanity Studio
- [ ] Add initial content in Sanity Studio

### Phase 2: Data Layer
- [ ] Add `servicesPageQuery` to `/src/lib/sanity/queries.ts`
- [ ] Add TypeScript types

### Phase 3: Components
- [ ] Create `/src/components/services/ServiceEntry.tsx`
- [ ] Create `/src/components/services/ServicesHero.tsx`
- [ ] Create `/src/components/services/ServicesInterlude.tsx`

### Phase 4: Page Route
- [ ] Create `/src/app/(public)/services/page.tsx`
- [ ] Verify page loads at `/services`
- [ ] Test dark mode styling
- [ ] Verify loading animation matches homepage

### Phase 5: Polish
- [ ] Test responsive behavior (mobile/tablet/desktop)
- [ ] Verify SEO metadata renders correctly
- [ ] Add structured data (breadcrumbs)
- [ ] Configure cache invalidation webhook

### Phase 6: Soft Launch
- [ ] Share direct link (`/services`) for internal review
- [ ] Finalize content in Sanity
- [ ] When ready: Add "Services" to navigation

### Phase 7: Content
- [ ] Finalize service descriptions in Sanity
- [ ] Review copy for tone and clarity
- [ ] Test all content renders correctly

---

## Animation Timing Reference

| Element | Animation | Delay | Duration |
|---------|-----------|-------|----------|
| Hero section | `animate-in fade-in` | 0s | 700ms |
| Dialogue section | `animate-in fade-in` | 0.1s | 700ms |
| Interlude section | `animate-in fade-in` | 0.2s | 700ms |

This matches the Homepage hero pattern exactly.

---

## Files to Create/Modify

| Action | File Path |
|--------|-----------|
| **Create** | `/sanity/schemas/servicesPage.ts` |
| **Modify** | `/sanity/schemas/index.ts` |
| **Modify** | `/src/lib/sanity/queries.ts` |
| **Create** | `/src/components/services/ServiceEntry.tsx` |
| **Create** | `/src/components/services/ServicesHero.tsx` |
| **Create** | `/src/components/services/ServicesInterlude.tsx` |
| **Create** | `/src/app/(public)/services/page.tsx` |
| **Modify** (later) | Navigation component when ready to launch |
| **Modify** (optional) | Webhook handler for cache tags |

---

## Notes

1. **Container width:** Uses `max-w-[700px]` for focused reading experience (narrower than standard pages)

2. **No CTA section:** Footer handles contact/navigation (same as About page)

3. **Fallback content:** Hardcoded fallback ensures page renders even if Sanity is empty

4. **Animation pattern:** Uses exact same `animate-in fade-in duration-700` as Homepage for consistency

5. **Blur orbs:** Match About page pattern with `bg-accent/15` and `bg-accent/10` at different opacities

---

## Design Decisions (Updated January 5, 2026)

### Flexible Lead-in Format
- **Changed from:** Q&A format with required questions for each service
- **Changed to:** Optional lead-in text (quotes, testimonials, or nothing)
- **Rationale:** More flexibility to use client quotes when available, or show services standalone when not

### Schema Changes
- `dialogueExchanges` → `serviceEntries`
- `question` → `leadInText` (now optional)
- `questionLabel` → `leadInAttribution` (for quote attribution)

### Soft Launch Strategy
- **No feature flag** - page exists at `/services` but unlisted
- **Rationale:** Low traffic site, unlikely to be discovered before launch
- **Launch:** Simply add navigation link when content is ready
