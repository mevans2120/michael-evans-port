# About Page Implementation Plan

**Created:** October 28, 2025
**Status:** Ready for implementation
**Estimated Time:** 4-6 hours

---

## Overview

Implement the About page based on the content spec (`/docs/content-specs/profile-about-content-spec.md`) and the dark refined design concept (`/docs/design/concepts-batch-1-102825/concept-dark-refined.html`).

---

## Phase 1: CMS Schema Updates (1-2 hours)

### 1.1 Expand Profile Schema

**File:** `/sanity/schemas/profile.ts`

**Add new fields:**

```typescript
// Quick Facts
quickFacts: array of objects {
  label: string
  value: string
}

// Hero Section
heroHeadline: string (e.g., "Product Manager • UX Strategist • AI Builder")
heroSubheadline: string (e.g., "20 years solving complex problems...")
heroIntro: text (2-3 sentence brief introduction)

// Capabilities
capabilities: array of objects {
  title: string
  description: string
  isNew: boolean (for "(new!)" badge)
}

// Content Sections
sections: array of objects {
  heading: string
  slug: string (for anchoring)
  content: block content (rich text)
  subsections: array of objects {
    heading: string
    content: block content
  }
}

// Selected Projects (different from case studies)
selectedProjects: array of objects {
  title: string
  metric: string
  description: text
  order: number
}

// Technologies (for tech stack section)
technologies: object {
  frontend: array of strings
  mobile: array of strings
  backend: array of strings
  cms: array of strings
  data: array of strings
  aiMl: array of strings
  deployment: array of strings
  enterprise: array of strings
}

// Availability & CTA
availability: boolean
availabilityText: text
ctaText: string
ctaButtonText: string
```

**Keep existing fields:**
- name
- title
- tagline (might be redundant with heroHeadline)
- bio (might be redundant with sections)
- profileImage ✓ (already in use)
- skills (might be redundant with capabilities)
- experience (for resume/CV purposes)
- social

**Decision:** Since this is a singleton document, keep all fields and migrate content. Fields not used on the about page can still be used elsewhere.

---

### 1.2 Update Profile Schema Preview

Update the preview to show the hero headline instead of just name:

```typescript
preview: {
  select: {
    title: 'name',
    subtitle: 'heroHeadline',
    media: 'profileImage',
  },
}
```

---

## Phase 2: Page Implementation (2-3 hours)

### 2.1 Create About Page Component

**File:** `/src/app/about/page.tsx`

**Structure:**
```typescript
'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { client } from '@/lib/sanity/client'
import { PortableText } from '@portabletext/react'

interface AboutData {
  name: string
  profileImage: string
  heroHeadline: string
  heroSubheadline: string
  heroIntro: string
  quickFacts: Array<{ label: string; value: string }>
  capabilities: Array<{ title: string; description: string; isNew: boolean }>
  sections: Array<{
    heading: string
    slug: string
    content: any
    subsections?: Array<{ heading: string; content: any }>
  }>
  selectedProjects: Array<{
    title: string
    metric: string
    description: string
  }>
  availability: boolean
  availabilityText: string
  ctaText: string
  ctaButtonText: string
}

export default function AboutPage() {
  const [data, setData] = useState<AboutData | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch data from Sanity
  // Render sections based on data
}
```

---

### 2.2 Sanity Query

**Query to fetch all about page data:**

```groq
*[_type == "profile"] | order(_updatedAt desc)[0] {
  name,
  "profileImage": profileImage.asset->url,
  heroHeadline,
  heroSubheadline,
  heroIntro,
  quickFacts,
  capabilities,
  sections,
  selectedProjects[] | order(order asc),
  availability,
  availabilityText,
  ctaText,
  ctaButtonText
}
```

---

### 2.3 Page Layout Sections

Based on the design concept, implement these sections:

1. **Hero with Photo**
   - Name (Crimson Pro, 64px)
   - Headline/tagline (DM Sans, 24px)
   - Intro paragraph (DM Sans, 21px)
   - Profile image (200px circle, border with purple accent)
   - Flexbox layout (photo on right, content on left)

2. **Quick Facts Grid**
   - 2-3 column grid
   - Label (uppercase, 12px, gray)
   - Value (18px, white, medium weight)
   - Fade-in animation with stagger

3. **Dynamic Content Sections**
   - Map over `sections` array
   - H2 headings (Crimson Pro, 42px)
   - Gradient underline accent
   - Subsections with H3 (Crimson Pro, 28px, purple)
   - PortableText for rich content

4. **Capabilities List**
   - Styled list with purple dash bullets
   - Hover effects
   - "(new!)" badge for new capabilities

5. **Selected Projects**
   - Project title (Crimson Pro, 32px)
   - Metric (purple, 16px)
   - Description (gray, 18px)
   - Border bottom on hover

6. **CTA Section**
   - Gradient button
   - Shadow on hover
   - Link to /contact

---

### 2.4 Styling Approach

**Use existing design system:**
- Colors from current site (gray-900, gray-950, purple gradients)
- Tailwind classes
- Match existing component patterns

**Typography:**
- Import Crimson Pro via Google Fonts (already done globally or add to layout)
- Use DM Sans for body (already in use)
- Create typography utilities in globals.css if needed:
  ```css
  .font-crimson {
    font-family: 'Crimson Pro', serif;
  }
  ```

**Responsive:**
- Mobile: Stack hero vertically, single column facts grid
- Tablet: 2 column facts grid
- Desktop: Side-by-side hero, 3 column facts grid

---

## Phase 3: Content Entry in Sanity (1-2 hours)

### 3.1 Prepare Content

Convert content spec into structured data ready for Sanity entry.

**Quick Facts:**
```json
[
  { "label": "Location", "value": "Portland, Oregon" },
  { "label": "Experience", "value": "20 Years in Software" },
  { "label": "Approach", "value": "0-to-1 'Army of One'" },
  { "label": "Current Focus", "value": "AI/ML-Powered Products" },
  { "label": "Work Style", "value": "Remote (love on-site too)" },
  { "label": "Availability", "value": "Open to Opportunities" }
]
```

**Capabilities:**
```json
[
  { "title": "Strategy", "description": "Define what to build and why", "isNew": false },
  { "title": "UX Design", "description": "Create the interface and experience", "isNew": false },
  { "title": "Research", "description": "Understand users and validate ideas", "isNew": false },
  { "title": "Analysis", "description": "Make sense of data and metrics", "isNew": false },
  { "title": "Project Management", "description": "Ship things on time", "isNew": false },
  { "title": "Prioritization", "description": "Backlogs, roadmaps, feature lists", "isNew": false },
  { "title": "Development", "description": "Build and test with Claude Code", "isNew": true }
]
```

**Sections:**
Use the 10 sections from content spec, structured as:
- Section 1: Who I Am (At a Glance)
- Section 2: Background & Journey (From Yurts to Gigahertz)
- Section 3: Three Things (What I Bring)
- Section 4: AI & The New Way of Building
- Section 5: What Interests Me
- Section 6: How I Work
- Section 7: Philosophy & Principles
- Section 8: Selected Work (Projects I'm Proud Of)
- Section 9: Current Work & Availability
- Section 10: Personal (Beyond Work)

**Note:** Sections 8 and 9 may be rendered differently (project cards, CTA section) rather than as text blocks.

---

### 3.2 Enter Content in Sanity Studio

1. Navigate to http://localhost:3000/studio
2. Open Profile document (singleton)
3. Fill in all new fields with content from spec
4. Use rich text editor for section content
5. Add projects with metrics
6. Save and publish

---

## Phase 4: Testing & Refinement (30-60 min)

### 4.1 Visual QA

- [ ] Compare to design concept (concept-dark-refined.html)
- [ ] Check typography hierarchy
- [ ] Verify color consistency with existing site
- [ ] Test responsive breakpoints
- [ ] Verify animations work smoothly

### 4.2 Content QA

- [ ] All content from spec is present
- [ ] Links work correctly
- [ ] Images load properly (profile photo)
- [ ] Rich text renders correctly
- [ ] No typos or formatting issues

### 4.3 Performance

- [ ] Image optimization (Next.js Image component)
- [ ] Lazy load sections if page is long
- [ ] Check Lighthouse score

---

## Phase 5: Documentation & Deployment (15-30 min)

### 5.1 Update Documentation

- [ ] Add about page to site map
- [ ] Document CMS fields in CLAUDE.md or separate doc
- [ ] Note any design decisions made during implementation

### 5.2 Commit & Deploy

- [ ] Create feature branch: `feature/about-page`
- [ ] Commit schema changes
- [ ] Commit page implementation
- [ ] Test locally
- [ ] Create PR with screenshots
- [ ] Deploy to Vercel preview
- [ ] Review in production-like environment
- [ ] Merge to main

---

## Files to Create/Modify

### Create:
- `/src/app/about/page.tsx` - Main about page component
- `/docs/implementation-plans/about-page-implementation-plan.md` - This file

### Modify:
- `/sanity/schemas/profile.ts` - Add new fields
- `/src/app/globals.css` - Add Crimson Pro font import if needed
- `/CLAUDE.md` - Document new CMS fields and about page

---

## Dependencies & Considerations

### Required Packages (already installed):
- @portabletext/react - For rich text rendering
- @sanity/client - For data fetching
- next/image - For optimized images

### Design Tokens to Extract:
- Purple gradient: `linear-gradient(135deg, #c084fc, #a855f7)`
- Dark backgrounds: `#050510`, `#0a0a15`
- Text colors: `#fafafa`, `#d1d5db`, `#9ca3af`, `#6b7280`
- Accent color: `#c084fc`

### Accessibility:
- Proper heading hierarchy (h1 → h2 → h3)
- Alt text for profile image
- Sufficient color contrast (already good with design)
- Keyboard navigation for interactive elements

---

## Open Questions

1. **Should we use the existing `project` schema for selected projects or the inline array?**
   - Recommendation: Use inline array in profile for now, since "selected projects" is a curated subset with custom metrics
   - Full case studies can link to existing project documents

2. **How much of the content spec should be editable vs. hardcoded?**
   - Recommendation: Make everything editable in CMS for maximum flexibility
   - Client can update without code changes

3. **Should sections be optional/toggle-able?**
   - Recommendation: Yes, add a `visible: boolean` field to sections
   - Allows hiding sections without deleting content

4. **Font loading strategy?**
   - Recommendation: Add Crimson Pro to root layout `metadata` with `next/font/google`
   - Prevents flash of unstyled text

---

## Success Criteria

- [ ] About page matches design concept visually
- [ ] All content from spec is present and accurate
- [ ] Page is fully responsive (mobile, tablet, desktop)
- [ ] Content is editable in Sanity Studio
- [ ] Page loads quickly (<2s on 3G)
- [ ] Passes accessibility audit (Lighthouse)
- [ ] Integrates seamlessly with existing site nav
- [ ] Profile image displays correctly
- [ ] Typography uses Crimson Pro + DM Sans as designed

---

## Next Steps After Implementation

1. Create remaining case study pages (Virgin America, Before Launcher, etc.)
2. Add resume/CV download functionality
3. Create blog section for process/learnings posts
4. Add more interactive elements (timeline, skills viz, etc.)
5. Consider adding testimonials/recommendations section

---

*This plan is ready for implementation. Estimated total time: 4-6 hours including testing and deployment.*
