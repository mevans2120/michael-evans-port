# Contact Page Implementation Plan

**Date**: November 11, 2025
**Chosen Design**: Concept B - Split Layout (Header left, links right)

## Overview

Implement a production-ready contact page using the split layout design (Concept B), with full Sanity CMS integration following existing patterns from the portfolio.

## Phase 1: Archive Concept Work

**Goal**: Preserve design exploration work and clean up component folder

### Tasks

1. **Move design concepts to archive**
   - Create `/docs/design/contact-section-concepts-111125/archived-concepts/` folder
   - Move all three original concept files from `/src/components/contact-concepts/`:
     - `concept-1-minimal-buttons.tsx`
     - `concept-2-text-links.tsx`
     - `concept-3-icon-cards.tsx`
   - Move `concept-2a-simple-list.tsx` (not chosen)
   - Keep only `concept-2b-reversed-layout.tsx` for reference during implementation

2. **Archive preview page**
   - Move `/src/app/(public)/contact-concepts/page.tsx` to `/docs/design/contact-section-concepts-111125/archived-concepts/preview-page.tsx`
   - Delete the `/src/app/(public)/contact-concepts/` folder after archiving

3. **Update documentation**
   - Add note to `/docs/design/contact-section-concepts-111125/overview.md` indicating which concept was chosen and when implemented
   - Reference this implementation plan in the overview

## Phase 2: Sanity Schema Setup

**Goal**: Create Sanity schema following existing patterns (similar to homepage hero, profile singleton)

### Schema Design

**File**: `/sanity/schemas/contactPage.ts`

**Schema Type**: `document` (singleton pattern like `profile.ts`)

**Fields**:
```typescript
{
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  fields: [
    // Header Section (Left Side)
    {
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Main heading (e.g., "Get in touch")',
      validation: Rule => Rule.required()
    },
    {
      name: 'subheading',
      title: 'Subheading',
      type: 'text',
      rows: 3,
      description: 'Supporting text below heading',
      validation: Rule => Rule.required()
    },

    // Email Configuration
    {
      name: 'email',
      title: 'Contact Email',
      type: 'string',
      description: 'Email address for contact',
      validation: Rule => Rule.required().email()
    },
    {
      name: 'emailSubject',
      title: 'Email Subject Line',
      type: 'string',
      description: 'Default subject for email links',
      initialValue: 'Project Inquiry'
    },

    // Email Links (Right Side)
    {
      name: 'gmailLinkText',
      title: 'Gmail Link Text',
      type: 'string',
      initialValue: 'Email via Gmail'
    },
    {
      name: 'outlookLinkText',
      title: 'Outlook Link Text',
      type: 'string',
      initialValue: 'Email via Outlook'
    },
    {
      name: 'copyEmailLinkText',
      title: 'Copy Email Link Text',
      type: 'string',
      initialValue: 'Copy email address'
    },
    {
      name: 'copiedConfirmationText',
      title: 'Copied Confirmation Text',
      type: 'string',
      initialValue: 'Email copied!'
    },

    // Footer
    {
      name: 'responseTimeNote',
      title: 'Response Time Note',
      type: 'string',
      description: 'Text shown at bottom (e.g., "I typically respond within 24-48 hours")',
      initialValue: 'I typically respond within 24-48 hours'
    },

    // SEO
    {
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Page Title',
          type: 'string',
          description: 'Browser tab title and search results',
          validation: Rule => Rule.required()
        },
        {
          name: 'description',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
          description: 'Search engine description (150-160 characters)',
          validation: Rule => Rule.required().max(160)
        }
      ]
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Contact Page',
        subtitle: 'Singleton'
      }
    }
  }
}
```

### Tasks

1. **Create schema file**
   - Create `/sanity/schemas/contactPage.ts` with above schema
   - Follow TypeScript patterns from existing schemas

2. **Register schema**
   - Add to `/sanity.config.ts` schema array:
     ```typescript
     import contactPage from './sanity/schemas/contactPage'

     // In schemaTypes array
     schemaTypes: [profile, homepageHero, contactPage, project, ...]
     ```

3. **Create initial document in Sanity Studio**
   - Navigate to http://localhost:3000/studio
   - Create singleton "Contact Page" document
   - Populate with initial content:
     - Heading: "Get in touch"
     - Subheading: "I'm currently available for new projects and collaborations."
     - Email: actual email address
     - All other fields use default values
     - SEO title: "Contact - Michael Evans"
     - SEO description: "Get in touch about new projects and collaborations."

## Phase 3: GROQ Query

**Goal**: Create type-safe query following existing patterns

### Query Design

**File**: `/src/lib/sanity/queries.ts`

**Add to existing queries**:
```typescript
// Contact Page (singleton)
export const contactPageQuery = groq`
  *[_type == "contactPage"][0] {
    heading,
    subheading,
    email,
    emailSubject,
    gmailLinkText,
    outlookLinkText,
    copyEmailLinkText,
    copiedConfirmationText,
    responseTimeNote,
    seo {
      title,
      description
    }
  }
`
```

### TypeScript Type

**File**: `/src/types/sanity.ts` (or create if doesn't exist)

**Add type**:
```typescript
export interface ContactPageData {
  heading: string
  subheading: string
  email: string
  emailSubject: string
  gmailLinkText: string
  outlookLinkText: string
  copyEmailLinkText: string
  copiedConfirmationText: string
  responseTimeNote: string
  seo: {
    title: string
    description: string
  }
}
```

### Tasks

1. Add query to `/src/lib/sanity/queries.ts`
2. Add TypeScript type to types file
3. Test query in Sanity Vision to verify data structure

## Phase 4: Production Contact Component

**Goal**: Create production-ready component using Sanity data

### Component Design

**File**: `/src/components/ContactSection.tsx`

**Props**: `{ data: ContactPageData }`

**Implementation**:
```typescript
'use client'

import React, { useState } from 'react'
import type { ContactPageData } from '@/types/sanity'

interface ContactSectionProps {
  data: ContactPageData
}

export default function ContactSection({ data }: ContactSectionProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(data.email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleGmailClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const gmailUrl = `https://mail.google.com/mail/?view=cm&to=${data.email}&su=${encodeURIComponent(data.emailSubject)}`
    window.open(gmailUrl, '_blank', 'noopener,noreferrer')
  }

  const handleOutlookClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const outlookUrl = `https://outlook.live.com/mail/0/deeplink/compose?to=${data.email}&subject=${encodeURIComponent(data.emailSubject)}`
    window.open(outlookUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <section className="w-full max-w-5xl mx-auto px-6 py-20 md:py-32">
      <div className="flex flex-col md:flex-row gap-12 md:gap-16">
        {/* Left: Header */}
        <div className="md:w-1/2">
          <h1 className="text-4xl md:text-5xl font-serif font-light text-foreground mb-4 leading-tight">
            {data.heading}
          </h1>
          <p className="text-lg text-muted-foreground">
            {data.subheading}
          </p>
        </div>

        {/* Right: Email Links */}
        <div className="md:w-1/2 space-y-4">
          {/* Gmail Link */}
          <a
            href="#"
            onClick={handleGmailClick}
            className="block text-lg font-sans text-foreground hover:text-accent transition-colors duration-normal underline decoration-transparent hover:decoration-accent underline-offset-4"
            aria-label={data.gmailLinkText}
          >
            {data.gmailLinkText}
          </a>

          {/* Outlook Link */}
          <a
            href="#"
            onClick={handleOutlookClick}
            className="block text-lg font-sans text-foreground hover:text-accent transition-colors duration-normal underline decoration-transparent hover:decoration-accent underline-offset-4"
            aria-label={data.outlookLinkText}
          >
            {data.outlookLinkText}
          </a>

          {/* Copy Email Link */}
          <button
            onClick={handleCopyEmail}
            className="block text-lg font-sans text-foreground hover:text-accent transition-colors duration-normal underline decoration-transparent hover:decoration-accent underline-offset-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded"
            aria-label={copied ? data.copiedConfirmationText : data.copyEmailLinkText}
          >
            {copied ? data.copiedConfirmationText : data.copyEmailLinkText}
          </button>

          {/* Response Time Note */}
          <div className="pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              {data.responseTimeNote}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
```

### Tasks

1. Create `/src/components/ContactSection.tsx`
2. Implement component with Sanity data props
3. Use existing design system classes (no new styles needed)
4. Ensure accessibility (aria-labels, focus states, keyboard navigation)
5. Test interaction states (hover, copy, email link clicks)

## Phase 5: Contact Page Route

**Goal**: Create production contact page at `/contact` route

### Page Design

**File**: `/src/app/(public)/contact/page.tsx`

**Implementation**:
```typescript
import React from 'react'
import { Metadata } from 'next'
import ContactSection from '@/components/ContactSection'
import { sanityFetch } from '@/lib/sanity/client'
import { contactPageQuery } from '@/lib/sanity/queries'
import type { ContactPageData } from '@/types/sanity'

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await sanityFetch<ContactPageData>({
    query: contactPageQuery,
    tags: ['contactPage']
  })

  if (!data) {
    return {
      title: 'Contact',
      description: 'Get in touch'
    }
  }

  return {
    title: data.seo.title,
    description: data.seo.description,
    openGraph: {
      title: data.seo.title,
      description: data.seo.description,
      type: 'website'
    }
  }
}

export default async function ContactPage() {
  const { data } = await sanityFetch<ContactPageData>({
    query: contactPageQuery,
    tags: ['contactPage']
  })

  if (!data) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Contact page content not found.</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <ContactSection data={data} />
    </main>
  )
}
```

### Tasks

1. Create `/src/app/(public)/contact/page.tsx`
2. Implement with server component pattern (existing pattern)
3. Add metadata generation for SEO
4. Add Sanity cache tags for revalidation
5. Add error handling for missing data
6. Test page at http://localhost:3000/contact

## Phase 6: Navigation Integration

**Goal**: Add Contact link to site navigation

### Tasks

1. **Update navigation component**
   - Locate main navigation component (likely `/src/components/Navigation.tsx` or similar)
   - Add "Contact" link to navigation array:
     ```typescript
     { href: '/contact', label: 'Contact' }
     ```

2. **Update footer**
   - Update Contact link to footer navigation. It exists. 

3. **Test navigation**
   - Verify link appears in all navigation instances
   - Test navigation from all major pages (home, case studies, blog)
   - Verify active state styling (if applicable)

## Phase 7: Testing & Refinement

**Goal**: Ensure production-ready quality

### Manual Testing Checklist

**Functionality**:
- [ ] Gmail link opens compose window with correct email and subject
- [ ] Outlook link opens compose window with correct email and subject
- [ ] Copy email button copies email to clipboard
- [ ] Copy confirmation message appears and disappears after 2 seconds
- [ ] All links work on desktop and mobile

**Content Management**:
- [ ] Can edit all text fields in Sanity Studio
- [ ] Changes in Sanity appear on page (after revalidation)
- [ ] Email validation works (rejects invalid emails)
- [ ] SEO fields update page metadata

**Responsive Design**:
- [ ] Desktop: Two-column layout (header left, links right)
- [ ] Tablet: Layout adapts gracefully
- [ ] Mobile: Single column, header stacks above links
- [ ] Touch targets meet minimum size (44x44px)

**Accessibility**:
- [ ] Keyboard navigation works (Tab, Enter, Space)
- [ ] Focus states visible on all interactive elements
- [ ] Screen reader announces link purposes correctly
- [ ] Color contrast meets WCAG AA standards

**Performance**:
- [ ] Page loads quickly (check Lighthouse)
- [ ] No console errors or warnings
- [ ] Email links don't cause layout shift

### Build Testing

1. **Run production build**
   ```bash
   npm run build
   ```

2. **Verify no TypeScript errors**

3. **Test production build locally**
   ```bash
   npm run start
   ```

4. **Check for build warnings** related to contact page

## Phase 8: Deployment & Monitoring

**Goal**: Deploy to production and verify

### Pre-Deployment

1. **Create Sanity document in production dataset**
   - Access production Sanity Studio
   - Create Contact Page singleton with production content
   - Verify all fields populated correctly

2. **Environment variables**
   - Verify email address in production Sanity
   - Check any email-related env vars if applicable

### Deployment

1. **Commit all changes**
   ```bash
   git add .
   git commit -m "Add contact page with Sanity CMS integration

   - Create contactPage Sanity schema (singleton)
   - Add ContactSection component with split layout design
   - Create /contact page route with metadata
   - Archive design concept exploration files
   - Add contact link to navigation

   Design: Split layout with header left, email links right
   Follows existing Sanity patterns (profile, homepageHero)
   Fully responsive and accessible"

   git push
   ```

2. **Monitor deployment**
   - Watch Vercel deployment logs
   - Check for build errors
   - Verify deployment succeeds

### Post-Deployment Verification

1. **Test production contact page**
   - Visit production `/contact` page
   - Test all email links
   - Verify copy functionality
   - Check mobile responsiveness

2. **Verify Sanity integration**
   - Edit content in Sanity Studio
   - Verify changes appear on production (may need manual revalidation)
   - Check revalidation tags working

3. **Analytics setup (optional)**
   - Track contact link clicks if analytics configured
   - Monitor which email provider is most used

## Phase 9: Documentation & Cleanup

**Goal**: Document work and clean up temporary files

### Tasks

1. **Update memory bank**
   - Document contact page implementation in `/memory-bank/CURRENT.md`
   - Note any challenges or learnings

2. **Clean up temporary files**
   - Delete `/src/components/contact-concepts/` folder if not already done
   - Verify all concept work is archived in `/docs/design/contact-section-concepts-111125/archived-concepts/`

3. **Update project documentation**
   - Add Contact page to site map (if documented)
   - Update any relevant README files

4. **Close any related issues** (if using issue tracker)

## Success Criteria

- ✅ Contact page accessible at `/contact`
- ✅ All content managed through Sanity CMS
- ✅ Email links (Gmail, Outlook) work correctly
- ✅ Copy email functionality works
- ✅ Responsive design matches approved concept
- ✅ SEO metadata configured
- ✅ Navigation includes Contact link
- ✅ No console errors or build warnings
- ✅ Passes accessibility audit
- ✅ Design concept work archived
- ✅ Production deployment successful

## Timeline Estimate

- **Phase 1 (Archive)**: 15 minutes
- **Phase 2 (Sanity Schema)**: 30 minutes
- **Phase 3 (Query & Types)**: 20 minutes
- **Phase 4 (Component)**: 30 minutes
- **Phase 5 (Page Route)**: 20 minutes
- **Phase 6 (Navigation)**: 15 minutes
- **Phase 7 (Testing)**: 30 minutes
- **Phase 8 (Deployment)**: 20 minutes
- **Phase 9 (Documentation)**: 15 minutes

**Total estimated time**: ~3 hours

## Notes

- **Spam prevention**: User accepted manual spam filtering. No additional protection needed initially.
- **Email obfuscation**: Not implemented in v1. Can add later if spam becomes issue (see `/docs/contact-page-research.md` for strategies).
- **Form alternative**: This design intentionally avoids traditional forms for better UX.
- **mailto fallback**: Not included per user request. Gmail + Outlook + Copy covers majority of users.
- **Future enhancements**: Could add A/B testing to track which email provider links are most used.
