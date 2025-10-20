# CMS Implementation Plan

**Date:** 2025-10-14
**Project:** Michael Evans Portfolio - Sanity CMS Integration
**Timeline:** ~2 weeks
**Status:** Ready for Implementation

---

## Executive Summary

This plan provides a step-by-step roadmap to integrate Sanity CMS with the Michael Evans portfolio, based on the comprehensive analysis in `CMS_FEATURE_ANALYSIS.md`. The implementation follows a phased approach, starting with quick wins and building toward complete CMS integration.

### Scope Overview

**Content to Migrate:**
- 4 AI Projects (complex data structures)
- Homepage content (hero, about preview, featured work)
- Contact information (currently placeholder data)
- 4 Case Studies (simpler structures)
- Navigation and site settings

**Current State:**
- AI Project schema exists but NOT registered ❌
- Feature flag system: ✅ Ready
- useAIProject hook: ✅ Ready
- 4 AI projects already in hardcoded format, ready to migrate

**Target State:**
- All content managed through Sanity Studio
- Zero hardcoded content in components
- Content updates without code deployment
- SEO metadata for all pages

### Key Milestones

| Phase | Duration | Focus |
|-------|----------|-------|
| Phase 0 | 15 min | Register AI Project schema |
| Phase 1 | 1-2 days | Critical content (Contact, Hero, SiteSettings) |
| Phase 2 | 1-2 days | AI Projects (enable feature flags, migrate data) |
| Phase 3 | 1-2 days | Navigation & About page |
| Phase 4 | 3-4 days | Case Studies migration |
| Phase 5 | 1-2 days | Cleanup and documentation |

**Total Timeline:** ~2 weeks (10 working days)

---

## Phase 0: Immediate Fix (15 minutes)

### Critical Issue
The AI Project schema exists at `/sanity/schemas/aiProject.ts` but is NOT registered in the Sanity configuration, making it unavailable in Sanity Studio.

### Tasks

#### Task 0.1: Register AI Project Schema (5 minutes)

**File:** `/src/sanity.config.ts`

**Current Code:**
```typescript
import project from './sanity-schemas/project'
import profile from './sanity-schemas/profile'
import capability from './sanity-schemas/capability'

export const schemaTypes = [project, profile, capability]
```

**Required Changes:**

**Option A:** Import from `/sanity/schemas/` (current location)
```typescript
import project from './sanity-schemas/project'
import profile from './sanity-schemas/profile'
import capability from './sanity-schemas/capability'
import aiProject from '../sanity/schemas/aiProject'  // ADD THIS

export const schemaTypes = [project, profile, capability, aiProject]  // ADD aiProject
```

**Option B:** Move schema to `/src/sanity-schemas/` (cleaner organization)
```bash
mv /sanity/schemas/aiProject.ts /src/sanity-schemas/aiProject.ts
```
```typescript
import aiProject from './sanity-schemas/aiProject'  // ADD THIS
export const schemaTypes = [project, profile, capability, aiProject]  // ADD aiProject
```

**Recommendation:** Use Option A initially (faster), refactor to Option B during cleanup phase.

#### Task 0.2: Verify Registration (5 minutes)

**Commands:**
```bash
npm run sanity
```

**Expected Result:**
- Sanity Studio opens at `http://localhost:3333`
- "AI Projects" document type appears in Studio
- Can create test AI project document

**Validation Checklist:**
- [ ] Studio loads without errors
- [ ] AI Project document type visible
- [ ] All fields render correctly (title, subtitle, overview, metrics, etc.)
- [ ] Can save draft AI project

#### Task 0.3: Document Project ID (5 minutes)

**Action:** Verify which Project ID is correct

**Check Files:**
1. `/src/sanity.config.ts` - Look for `projectId`
2. `.env.local` - Look for `VITE_SANITY_PROJECT_ID`
3. `CLAUDE.md` - Currently states `5n331bys`

**Update:** Ensure all files use the same Project ID

---

## Phase 1: Critical Content (1-2 days)

Priority: HIGH - Fixes placeholder data and enables homepage management

### Task 1.1: Create Contact Schema (30 minutes)

**Create File:** `/src/sanity-schemas/contact.ts`

```typescript
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'contact',
  title: 'Contact Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: "Let's Create Something Exceptional",
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(300),
    }),
    defineField({
      name: 'primaryCta',
      title: 'Primary CTA',
      type: 'object',
      fields: [
        { name: 'text', type: 'string', title: 'Button Text', initialValue: 'Start a Project' },
        { name: 'link', type: 'url', title: 'Button Link' },
      ],
    }),
    defineField({
      name: 'secondaryCta',
      title: 'Secondary CTA',
      type: 'object',
      fields: [
        { name: 'text', type: 'string', title: 'Button Text', initialValue: 'Schedule a Call' },
        { name: 'link', type: 'url', title: 'Button Link' },
      ],
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'linkedin',
      title: 'LinkedIn',
      type: 'object',
      fields: [
        { name: 'url', type: 'url', title: 'LinkedIn URL' },
        { name: 'text', type: 'string', title: 'Link Text', initialValue: 'Connect with me' },
      ],
    }),
    defineField({
      name: 'location',
      title: 'Location Text',
      type: 'string',
      initialValue: 'Available Worldwide',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Contact Settings',
      }
    },
  },
})
```

**Register Schema:**
```typescript
// src/sanity.config.ts
import contact from './sanity-schemas/contact'
export const schemaTypes = [project, profile, capability, aiProject, contact]
```

**Time Estimate:** 30 minutes

### Task 1.2: Create Hero Schema (1 hour)

**Create File:** `/src/sanity-schemas/hero.ts`

```typescript
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'hero',
  title: 'Homepage Hero',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      initialValue: 'Michael Evans',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroOptions',
      title: 'Hero Rotation Options',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {
            name: 'prefix',
            type: 'string',
            title: 'Prefix Text',
            description: 'Text before the dropdown (e.g., "shipped the first responsive")',
          },
          {
            name: 'dropdown',
            type: 'string',
            title: 'Dropdown Text',
            description: 'The highlighted text (e.g., "airline website")',
          },
          {
            name: 'link',
            type: 'string',
            title: 'Project Link',
            description: 'Relative URL (e.g., "/case-studies/virgin-america")',
          },
          {
            name: 'label',
            type: 'string',
            title: 'Full Label',
            description: 'Complete text for accessibility',
          },
          {
            name: 'description',
            type: 'text',
            title: 'Description',
            rows: 3,
            description: 'Project description for modal',
          },
          {
            name: 'image',
            type: 'image',
            title: 'Project Image',
            options: {
              hotspot: true,
            },
          },
          {
            name: 'tags',
            type: 'array',
            title: 'Tags',
            of: [{ type: 'string' }],
            options: {
              layout: 'tags',
            },
          },
          {
            name: 'colorGradient',
            type: 'string',
            title: 'Gradient Color',
            description: 'Tailwind gradient class (e.g., "from-purple-600 to-blue-600")',
          },
        ],
        preview: {
          select: {
            title: 'dropdown',
            subtitle: 'prefix',
            media: 'image',
          },
        },
      }],
      validation: (Rule) => Rule.required().min(1).max(6),
      description: 'Rotating hero options (recommended: 3-4 items)',
    }),
    defineField({
      name: 'aboutPreview',
      title: 'About Preview Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          type: 'string',
          title: 'Professional Title',
          initialValue: 'Product Strategist & Creative Technologist',
        },
        {
          name: 'bio',
          type: 'text',
          title: 'Bio Preview',
          rows: 4,
          description: 'Short bio for homepage preview',
        },
        {
          name: 'image',
          type: 'image',
          title: 'Profile Photo',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'ctaText',
          type: 'string',
          title: 'CTA Button Text',
          initialValue: 'Learn more about my background',
        },
        {
          name: 'ctaLink',
          type: 'string',
          title: 'CTA Link',
          initialValue: '/about',
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Homepage Hero Settings',
      }
    },
  },
})
```

**Register Schema:**
```typescript
// src/sanity.config.ts
import hero from './sanity-schemas/hero'
export const schemaTypes = [project, profile, capability, aiProject, contact, hero]
```

**Time Estimate:** 1 hour

### Task 1.3: Create Site Settings Schema (45 minutes)

**Create File:** `/src/sanity-schemas/siteSettings.ts`

```typescript
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    { name: 'general', title: 'General', default: true },
    { name: 'sections', title: 'Homepage Sections' },
    { name: 'seo', title: 'SEO Defaults' },
  ],
  fields: [
    // General Settings
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      group: 'general',
      initialValue: 'Michael Evans Portfolio',
    }),
    defineField({
      name: 'brandName',
      title: 'Brand Name',
      type: 'string',
      group: 'general',
      initialValue: 'MEvans',
      description: 'Short brand name for navigation',
    }),
    defineField({
      name: 'logoImage',
      title: 'Logo Image (Optional)',
      type: 'image',
      group: 'general',
      description: 'Upload logo to replace text brand',
    }),

    // Homepage Sections
    defineField({
      name: 'featuredWork',
      title: 'Featured Work Section',
      type: 'object',
      group: 'sections',
      fields: [
        {
          name: 'title',
          type: 'string',
          title: 'Section Title',
          initialValue: 'Selected Work',
        },
        {
          name: 'subtitle',
          type: 'string',
          title: 'Section Subtitle',
          initialValue: 'Case studies and product launches',
        },
        {
          name: 'projects',
          type: 'array',
          title: 'Featured Projects',
          of: [{ type: 'reference', to: [{ type: 'project' }] }],
          validation: (Rule) => Rule.max(3),
          description: 'Select up to 3 case studies to feature',
        },
      ],
    }),
    defineField({
      name: 'aiProjectsSection',
      title: 'AI Projects Section',
      type: 'object',
      group: 'sections',
      fields: [
        {
          name: 'title',
          type: 'string',
          title: 'Section Title',
          initialValue: 'AI Projects',
        },
        {
          name: 'subtitle',
          type: 'string',
          title: 'Section Subtitle',
          initialValue: 'Production apps and experiments',
        },
        {
          name: 'projects',
          type: 'array',
          title: 'Featured AI Projects',
          of: [{ type: 'reference', to: [{ type: 'aiProject' }] }],
          validation: (Rule) => Rule.max(4),
          description: 'Select up to 4 AI projects to feature',
        },
      ],
    }),

    // SEO Defaults
    defineField({
      name: 'seoDefaultTitle',
      title: 'Default SEO Title',
      type: 'string',
      group: 'seo',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'seoDefaultDescription',
      title: 'Default SEO Description',
      type: 'text',
      group: 'seo',
      rows: 3,
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'ogDefaultImage',
      title: 'Default OG Image',
      type: 'image',
      group: 'seo',
      description: 'Default social media share image',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Site Settings',
      }
    },
  },
})
```

**Register Schema:**
```typescript
// src/sanity.config.ts
import siteSettings from './sanity-schemas/siteSettings'
export const schemaTypes = [project, profile, capability, aiProject, contact, hero, siteSettings]
```

**Time Estimate:** 45 minutes

### Task 1.4: Populate Initial Content (1 hour)

**Actions:**
1. Start Sanity Studio: `npm run sanity`
2. Create single "Contact Settings" document
3. Create single "Homepage Hero" document
4. Create single "Site Settings" document
5. Fill in current hardcoded values

**Validation:**
- [ ] Contact document created with real email/LinkedIn
- [ ] Hero document created with 4 hero options
- [ ] Site Settings created with section titles

**Time Estimate:** 1 hour

### Task 1.5: Update HomePage Component (2 hours)

**Create Query File:** `/src/lib/sanity/queries/homepage.ts`

```typescript
import { groq } from 'next-sanity'

export const heroQuery = groq`
  *[_type == "hero"][0] {
    name,
    heroOptions[] {
      prefix,
      dropdown,
      link,
      label,
      description,
      "image": image.asset->url,
      tags,
      colorGradient
    },
    aboutPreview {
      title,
      bio,
      "image": image.asset->url,
      ctaText,
      ctaLink
    }
  }
`

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    siteName,
    brandName,
    "logoImage": logoImage.asset->url,
    featuredWork {
      title,
      subtitle,
      projects[]-> {
        title,
        slug,
        description,
        category,
        "heroImage": heroImage.asset->url,
        metrics
      }
    },
    aiProjectsSection {
      title,
      subtitle,
      projects[]-> {
        title,
        slug,
        description,
        category,
        status,
        "heroImage": heroImage.asset->url
      }
    }
  }
`

export const contactQuery = groq`
  *[_type == "contact"][0] {
    heading,
    description,
    primaryCta,
    secondaryCta,
    email,
    linkedin,
    location
  }
`
```

**Update Component:** `/src/pages/HomeMinimal.tsx`

```typescript
// Add imports
import { useQuery } from '@tanstack/react-query'
import { client } from '@/lib/sanity/client'
import { heroQuery, siteSettingsQuery } from '@/lib/sanity/queries/homepage'

// Add data fetching hook
function HomeMinimal() {
  const { data: heroData, isLoading: heroLoading } = useQuery({
    queryKey: ['hero'],
    queryFn: () => client.fetch(heroQuery),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: () => client.fetch(siteSettingsQuery),
    staleTime: 1000 * 60 * 5,
  })

  // Add loading state
  if (heroLoading || settingsLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      Loading...
    </div>
  }

  // Use data from Sanity instead of hardcoded
  const heroOptions = heroData?.heroOptions || []
  const aboutPreview = heroData?.aboutPreview || {}
  const featuredWork = settings?.featuredWork || {}

  // Rest of component remains the same, using fetched data
}
```

**Time Estimate:** 2 hours

### Task 1.6: Update Contact Component (1 hour)

**Update Component:** `/src/components/Contact.tsx`

```typescript
import { useQuery } from '@tanstack/react-query'
import { client } from '@/lib/sanity/client'
import { contactQuery } from '@/lib/sanity/queries/homepage'

export const Contact: React.FC = () => {
  const { data: contact, isLoading } = useQuery({
    queryKey: ['contact'],
    queryFn: () => client.fetch(contactQuery),
    staleTime: 1000 * 60 * 10, // 10 minutes (changes infrequently)
  })

  if (isLoading) return null

  const {
    heading = "Let's Create Something Exceptional",
    description = '',
    primaryCta = {},
    secondaryCta = {},
    email = '',
    linkedin = {},
    location = 'Available Worldwide'
  } = contact || {}

  // Use fetched data in existing JSX
  return (
    <div className="...">
      <h2>{heading}</h2>
      <p>{description}</p>
      {/* ... rest of component */}
    </div>
  )
}
```

**Time Estimate:** 1 hour

**Phase 1 Total Time:** 6-8 hours (1 full working day)

---

## Phase 2: AI Projects (1-2 days)

Priority: HIGH - Enables feature flag system for AI content

### Task 2.1: Verify AI Project Schema (15 minutes)

**Action:** Confirm schema is registered from Phase 0

**Checklist:**
- [ ] AI Project document type visible in Sanity Studio
- [ ] Can create test AI project
- [ ] All nested fields work (overview, aiComponents, developmentProcess)
- [ ] Image upload works

### Task 2.2: Migrate AI Project Data (2 hours)

**Approach:** Manual migration via Sanity Studio (4 projects = manageable)

**For Each Project:**
1. Open `/src/data/aiProjects.ts` in editor
2. Open Sanity Studio in browser
3. Create new AI Project document
4. Copy data field-by-field

**Projects to Migrate:**
1. Post Pal
2. Karuna Gatton
3. AI Research Agent
4. Department of Art

**Field Mapping:**
```
aiProjects.ts → Sanity Studio
-----------------------------------
title → Title
subtitle → Subtitle
slug → Slug (auto-generate from title)
description → Description
category → Category
status → Status (select from dropdown)
heroImage (URL) → Hero Image (upload or save URL)
links.live → Live URL
links.github → GitHub URL
overview.problem → Overview > Problem
overview.solution → Overview > Solution
overview.role → Overview > Role
overview.timeline → Overview > Timeline
metrics[] → Metrics > Add items
techStack[] → Tech Stack > Add tags
aiComponents[] → AI Components > Add items
developmentProcess[] → Development Process > Add phases
learnings[] → Learnings > Add items
achievements[] → Achievements > Add items
```

**Image Handling:**

**Option A (Quick):** Keep external URLs
- Paste URL into image field
- Sanity will reference external image

**Option B (Better):** Upload to Sanity
- Download images locally
- Upload via Sanity Studio
- Better performance with Sanity CDN

**Recommendation:** Option A initially, upgrade to Option B in Phase 5

**Time Estimate:** 30 minutes per project × 4 = 2 hours

### Task 2.3: Enable Feature Flags (15 minutes)

**File:** `/src/lib/featureFlags.ts` (already exists)

**Update:**
```typescript
export const FEATURE_FLAGS = {
  USE_SANITY_FOR_AI_PROJECTS: true,  // Change to true
  USE_SANITY_FOR_POST_PAL: true,     // Change to true
  USE_SANITY_FOR_KARUNA_GATTON: true, // Change to true
  USE_SANITY_FOR_AI_RESEARCH_AGENT: true, // Change to true
  USE_SANITY_FOR_DEPARTMENT_OF_ART: true, // Change to true
  // ... rest unchanged
} as const;
```

**Time Estimate:** 15 minutes

### Task 2.4: Update AI Project Pages (2 hours)

**Files to Update:**
- `/src/pages/ai-projects/PostPal.tsx`
- `/src/pages/ai-projects/KarunaGatton.tsx`
- `/src/pages/ai-projects/AIResearchAgent.tsx`
- `/src/pages/ai-projects/DepartmentOfArt.tsx`

**Current Pattern:**
```typescript
import { postPalData } from '@/data/aiProjects'

const PostPal = () => {
  const project = postPalData
  // ... render
}
```

**New Pattern (using existing hook):**
```typescript
import { useAIProject } from '@/hooks/useAIProject'

const PostPal = () => {
  const { data: project, loading, error } = useAIProject('post-pal')

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!project) return <div>Project not found</div>

  // ... render (no changes needed, same data structure)
}
```

**Note:** The `useAIProject` hook already exists and handles:
- Feature flag checking
- Sanity fetching
- Fallback to hardcoded data
- Error handling

**Time Estimate:** 30 minutes per page × 4 = 2 hours

### Task 2.5: Update AIShowcase Page (30 minutes)

**File:** `/src/pages/AIShowcase.tsx`

**Create Query:**
```typescript
// src/lib/sanity/queries/aiProjects.ts
export const allAIProjectsQuery = groq`
  *[_type == "aiProject"] | order(order asc, publishedAt desc) {
    _id,
    title,
    slug,
    subtitle,
    description,
    category,
    status,
    "heroImage": heroImage.asset->url,
    links
  }
`
```

**Update Component:**
```typescript
import { useQuery } from '@tanstack/react-query'
import { client } from '@/lib/sanity/client'
import { allAIProjectsQuery } from '@/lib/sanity/queries/aiProjects'

const AIShowcase = () => {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['aiProjects'],
    queryFn: () => client.fetch(allAIProjectsQuery),
    staleTime: 1000 * 60 * 5,
  })

  // ... rest of component
}
```

**Time Estimate:** 30 minutes

### Task 2.6: Testing AI Projects (1 hour)

**Test Checklist:**
- [ ] All 4 AI project pages load from Sanity
- [ ] All sections render (overview, metrics, tech stack, AI components, process, learnings)
- [ ] Images display correctly
- [ ] Links work (live site, GitHub)
- [ ] Nested data displays (outcomes in process phases)
- [ ] No console errors
- [ ] Loading states work
- [ ] Error handling works (test by breaking Sanity connection)

**Test with Feature Flag OFF:**
- [ ] Pages still work with hardcoded data
- [ ] Verify fallback mechanism

**Time Estimate:** 1 hour

**Phase 2 Total Time:** 6-8 hours (1 full working day)

---

## Phase 3: Navigation & About (1-2 days)

Priority: MEDIUM - Completes profile integration

### Task 3.1: Integrate About Page (1 hour)

**File:** `/src/pages/About.tsx`

**Create Query:**
```typescript
// src/lib/sanity/queries/profile.ts
export const profileQuery = groq`
  *[_type == "profile"][0] {
    name,
    title,
    "profileImage": profileImage.asset->url,
    bio,
    tagline,
    skills,
    experience,
    social
  }
`
```

**Update Component:**
```typescript
import { useQuery } from '@tanstack/react-query'
import { client } from '@/lib/sanity/client'
import { profileQuery } from '@/lib/sanity/queries/profile'
import { PortableText } from '@portabletext/react'

const About = () => {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => client.fetch(profileQuery),
    staleTime: 1000 * 60 * 10,
  })

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      <h1>About {profile?.name}</h1>
      <img src={profile?.profileImage} alt={profile?.name} />
      <PortableText value={profile?.bio} />
      {/* ... rest of component */}
    </div>
  )
}
```

**Dependencies:**
```bash
npm install @portabletext/react
```

**Time Estimate:** 1 hour

### Task 3.2: Populate Profile Data (30 minutes)

**Action:**
1. Open Sanity Studio
2. Navigate to Profile document
3. Fill in:
   - Name: "Michael Evans"
   - Title: "Product Strategist & Creative Technologist"
   - Bio: Copy from current About page (6 paragraphs)
   - Profile Image: Upload photo
   - Social links: LinkedIn, email

**Time Estimate:** 30 minutes

### Task 3.3: Update Navigation (1 hour)

**Option A (Simple):** Keep hardcoded for now
- Navigation rarely changes
- Low ROI for CMS integration
- Defer to Phase 5

**Option B (Complete):** CMS-managed navigation
- Add navigation array to siteSettings schema
- Create custom Studio UI for menu builder
- Update Navigation component

**Recommendation:** Option A - focus on content-heavy areas first

**Time Estimate (if implemented):** 1 hour

**Phase 3 Total Time:** 2-3 hours

---

## Phase 4: Case Studies (3-4 days)

Priority: MEDIUM - Completes project content migration

### Task 4.1: Evaluate Schema Approach (30 minutes)

**Option A:** Use existing `project` schema with `projectType: 'case-study'`
- Pros: Single unified schema, leverages existing work
- Cons: Case studies don't use all AI project fields

**Option B:** Create separate `caseStudy` schema
- Pros: Cleaner, fields specific to case studies
- Cons: More schemas to maintain, duplicates some fields

**Recommendation:** Option A - extend `project` schema

**Action:**
1. Review `/sanity/schemas/project.ts`
2. Verify it has all needed fields:
   - ✅ title, subtitle (if exists), slug
   - ✅ description, overview
   - ✅ metrics, achievements
   - ✅ heroImage
   - ✅ category
3. Add conditional fields using `hidden` property

**Time Estimate:** 30 minutes

### Task 4.2: Migrate Case Study Data (2 hours)

**Projects to Migrate:**
1. Virgin America (`/src/pages/VirginAmerica.tsx`)
2. Casa Bonita (`/src/pages/CasaBonita.tsx`)
3. Before Launcher (`/src/pages/BeforeLauncher.tsx`)
4. Peddle (`/src/pages/Peddle.tsx`)

**Process per Case Study:**
1. Open component file
2. Extract hardcoded content:
   - Title and subtitle
   - Overview text
   - 3 metrics (label + value)
   - 5-6 achievements
3. Create Project document in Sanity Studio
4. Set `projectType: 'case-study'`
5. Fill in fields
6. Publish

**Field Mapping:**
```
Component → Sanity
-------------------
Page title → title
Subtitle → subtitle (or summary field)
Overview paragraph → description or overview.problem
Metrics → metrics array
Achievements → achievements array
```

**Time Estimate:** 30 minutes per case study × 4 = 2 hours

### Task 4.3: Create Case Study Query (30 minutes)

**Create File:** `/src/lib/sanity/queries/projects.ts`

```typescript
import { groq } from 'next-sanity'

export const allProjectsQuery = groq`
  *[_type == "project" && projectType == "case-study"] | order(order asc, publishedAt desc) {
    _id,
    title,
    subtitle,
    slug,
    description,
    category,
    "heroImage": heroImage.asset->url,
    metrics,
    achievements
  }
`

export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    subtitle,
    slug,
    description,
    overview,
    category,
    "heroImage": heroImage.asset->url,
    metrics,
    achievements,
    content,
    technologies,
    links,
    publishedAt
  }
`
```

**Time Estimate:** 30 minutes

### Task 4.4: Update Case Study Pages (2 hours)

**Option A (Faster):** Update each page individually
```typescript
// src/pages/VirginAmerica.tsx
import { useQuery } from '@tanstack/react-query'
import { client } from '@/lib/sanity/client'
import { projectBySlugQuery } from '@/lib/sanity/queries/projects'

const VirginAmerica = () => {
  const { data: project, isLoading } = useQuery({
    queryKey: ['project', 'virgin-america'],
    queryFn: () => client.fetch(projectBySlugQuery, { slug: 'virgin-america' }),
  })

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      <h1>{project.title}</h1>
      <p>{project.subtitle}</p>
      {/* ... rest of component using project data */}
    </div>
  )
}
```

**Option B (Better):** Create generic CaseStudy component
```typescript
// src/pages/CaseStudyDetail.tsx
import { useParams } from 'react-router-dom'

const CaseStudyDetail = () => {
  const { slug } = useParams()
  const { data: project, isLoading } = useQuery({
    queryKey: ['project', slug],
    queryFn: () => client.fetch(projectBySlugQuery, { slug }),
  })

  // Universal template for all case studies
}

// Update App.tsx routes
<Route path="/case-studies/:slug" element={<CaseStudyDetail />} />
```

**Recommendation:** Option B for cleaner architecture

**Time Estimate:** 2 hours (includes creating generic component + testing)

### Task 4.5: Update Featured Projects (30 minutes)

**Action:** Update `siteSettings` in Sanity Studio
1. Navigate to Site Settings document
2. In "Featured Work Section"
3. Add references to 3 case study projects
4. Publish

**Verify:** Homepage shows correct featured projects

**Time Estimate:** 30 minutes

### Task 4.6: Testing Case Studies (1 hour)

**Test Checklist:**
- [ ] All 4 case study pages load from Sanity
- [ ] Title and subtitle render
- [ ] Overview text displays
- [ ] Metrics render correctly
- [ ] Achievements list displays
- [ ] Images work (if added)
- [ ] "Back to Portfolio" link works
- [ ] No console errors

**Time Estimate:** 1 hour

**Phase 4 Total Time:** 6-7 hours (1-2 working days)

---

## Phase 5: Cleanup & Documentation (1-2 days)

Priority: LOW - Polish and maintenance

### Task 5.1: Remove Feature Flags (1 hour)

**Once all content is verified in Sanity:**

1. Remove feature flag checks from code
2. Delete fallback to hardcoded data
3. Simplify hooks and components

**Files to Update:**
- `/src/lib/featureFlags.ts` - Delete file
- `/src/hooks/useAIProject.ts` - Remove flag checks
- AI project pages - Remove conditional logic

**Time Estimate:** 1 hour

### Task 5.2: Remove Hardcoded Data (30 minutes)

**Delete Files:**
- `/src/data/aiProjects.ts` (archive first)

**Update Components:**
- Remove unused imports
- Remove commented code

**Time Estimate:** 30 minutes

### Task 5.3: Image Optimization (2 hours)

**Optional but Recommended:**

Upload all images to Sanity for CDN benefits:
1. Download external images (Unsplash URLs)
2. Upload to Sanity via Studio
3. Update references in documents

**Script:**
```typescript
// scripts/uploadImagesToSanity.ts
import { createClient } from '@sanity/client'
import fetch from 'node-fetch'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: 'production',
  token: process.env.SANITY_TOKEN!,
  useCdn: false,
})

async function uploadImage(url: string, filename: string) {
  const response = await fetch(url)
  const buffer = await response.buffer()

  return client.assets.upload('image', buffer, {
    filename,
  })
}

// Run for each project's images
```

**Time Estimate:** 2 hours

### Task 5.4: Add SEO Fields (1 hour)

**Create Reusable SEO Object:**
```typescript
// src/sanity-schemas/objects/seo.ts
export const seo = {
  name: 'seo',
  type: 'object',
  title: 'SEO Settings',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'SEO Title',
      validation: (Rule) => Rule.max(60),
    },
    {
      name: 'description',
      type: 'text',
      title: 'SEO Description',
      rows: 3,
      validation: (Rule) => Rule.max(160),
    },
    {
      name: 'ogImage',
      type: 'image',
      title: 'Open Graph Image',
    },
  ],
}
```

**Add to Schemas:**
```typescript
// Add to aiProject.ts, project.ts, etc.
{
  name: 'seo',
  type: 'seo',
  title: 'SEO',
}
```

**Update Components:**
```typescript
// Add to page components
import { Helmet } from 'react-helmet-async'

<Helmet>
  <title>{project.seo?.title || project.title}</title>
  <meta name="description" content={project.seo?.description} />
  <meta property="og:image" content={project.seo?.ogImage} />
</Helmet>
```

**Time Estimate:** 1 hour

### Task 5.5: Update Documentation (2 hours)

**Update Files:**

1. **CLAUDE.md** - Update with Sanity integration info
```markdown
## Sanity CMS Configuration

- **Project ID**: [verified ID]
- **Dataset**: production
- **Studio Path**: `/studio`
- **Schemas**: project, aiProject, profile, contact, hero, siteSettings

## Content Management

All content is managed through Sanity Studio:
- AI Projects: Create/edit via Studio
- Case Studies: Create/edit via Studio
- Homepage: Update hero and featured sections
- Contact: Update contact information

To add new project:
1. Open Studio: `npm run sanity`
2. Create new AI Project or Project
3. Fill in fields and publish
4. Changes appear immediately on site
```

2. **Create CONTENT_GUIDE.md** - For content editors
```markdown
# Content Management Guide

## Accessing Sanity Studio

1. Navigate to https://yoursite.com/studio
2. Sign in with your Sanity account
3. Choose document type to edit

## Adding a New AI Project

1. Click "AI Projects" → "Create new"
2. Fill in required fields (marked with *)
3. Add tech stack, metrics, AI components
4. Upload hero image
5. Click "Publish"

## Editing Contact Information

1. Click "Contact Settings"
2. Update email, LinkedIn, CTAs
3. Click "Publish"

## Updating Homepage

1. Click "Homepage Hero"
2. Edit hero options, about preview
3. Click "Publish"

Changes appear immediately on the live site.
```

3. **Update README.md** - Add Sanity commands
```markdown
## Content Management

```bash
npm run sanity     # Start Sanity Studio
npm run migrate    # Run migration script (if created)
```

## Environment Variables

Required in `.env.local`:
```
VITE_SANITY_PROJECT_ID=your-project-id
VITE_SANITY_DATASET=production
```
```

**Time Estimate:** 2 hours

### Task 5.6: Performance Optimization (1 hour)

**Optimizations:**

1. **Add prefetching:**
```typescript
// src/App.tsx
import { useEffect } from 'react'
import { queryClient } from '@/lib/queryClient'

useEffect(() => {
  // Prefetch critical data on app load
  queryClient.prefetchQuery({
    queryKey: ['hero'],
    queryFn: () => client.fetch(heroQuery),
  })
}, [])
```

2. **Optimize images in GROQ:**
```typescript
"heroImage": heroImage.asset->url + "?w=800&h=600&fit=crop"
```

3. **Add stale-while-revalidate:**
```typescript
const { data } = useQuery({
  queryKey: ['projects'],
  queryFn: () => client.fetch(query),
  staleTime: 1000 * 60 * 5,
  cacheTime: 1000 * 60 * 30,
})
```

**Time Estimate:** 1 hour

**Phase 5 Total Time:** 7-9 hours (1-2 working days)

---

## Schema Definitions

### Complete Contact Schema

See **Task 1.1** above for full implementation.

**Key Features:**
- Single document type (singleton)
- Structured CTA objects (text + link)
- Email validation
- Flexible social links
- Location text field

### Complete Hero Schema

See **Task 1.2** above for full implementation.

**Key Features:**
- Rotating hero options (array)
- Rich project previews (image, tags, description)
- About section integration
- Color gradient support
- Responsive image handling

### Complete Site Settings Schema

See **Task 1.3** above for full implementation.

**Key Features:**
- Grouped fields (General, Sections, SEO)
- Reference arrays for featured content
- Brand customization (name, logo)
- Section title management
- SEO defaults

---

## Next Steps

### Immediate Actions (Today)

1. **Execute Phase 0** (15 minutes)
   ```bash
   # Open sanity.config.ts
   # Add aiProject import
   # Save and test
   npm run sanity
   ```

2. **Verify Registration**
   - Check AI Project appears in Studio
   - Create test document
   - Validate all fields work

3. **Read Through Phase 1**
   - Understand Contact, Hero, SiteSettings schemas
   - Review component update requirements
   - Note time estimates

### Week 1 Sprint Plan

**Day 1 (8 hours):**
- Morning: Phase 0 + Phase 1.1-1.3 (Schema creation)
- Afternoon: Phase 1.4 (Populate content) + Phase 1.5 (HomePage update)

**Day 2 (8 hours):**
- Morning: Phase 1.6 (Contact component) + testing
- Afternoon: Phase 2.1-2.2 (Migrate AI projects to Sanity)

**Day 3 (8 hours):**
- Morning: Phase 2.3-2.5 (Enable flags, update pages)
- Afternoon: Phase 2.6 (Testing) + Phase 3 (About page)

**Day 4 (8 hours):**
- Morning: Phase 4.1-4.2 (Case study schema + migration)
- Afternoon: Phase 4.3-4.4 (Queries + component updates)

**Day 5 (8 hours):**
- Morning: Phase 4.5-4.6 (Featured projects + testing)
- Afternoon: Phase 5.1-5.3 (Cleanup + images)

**Week 2 (Buffer):**
- Phase 5.4-5.6 (SEO, docs, optimization)
- Additional testing
- Fix any issues discovered

### Success Criteria

**Completion Checklist:**
- [ ] All 4 AI projects load from Sanity
- [ ] All 4 case studies load from Sanity
- [ ] Homepage content managed via Studio
- [ ] Contact info accurate and editable
- [ ] About page uses profile data
- [ ] No hardcoded content in components
- [ ] All images display correctly
- [ ] No console errors
- [ ] Loading states work
- [ ] Documentation updated
- [ ] Content editor can add project without dev help

### Getting Started

**Prerequisites:**
```bash
# Verify environment
node --version  # Should be 18+
npm --version

# Verify Sanity CLI
npm run sanity  # Should start Studio

# Check environment variables
cat .env.local | grep SANITY
```

**First Commands:**
```bash
# Create feature branch
git checkout -b feature/cms-integration

# Open config file
code src/sanity.config.ts

# Add AI Project schema (see Phase 0)
# Save and test

# Start Studio
npm run sanity

# Verify in browser
open http://localhost:3333
```

### Questions Before Starting

1. **Project ID**: Which is correct - `5n331bys` or `vc89ievx`?
2. **Images**: Quick (keep URLs) or thorough (upload to Sanity)?
3. **Navigation**: CMS-managed or keep hardcoded?
4. **Timeline**: Prefer fast (1 week intense) or steady (2 weeks balanced)?

### Support Resources

- **Sanity Docs**: https://www.sanity.io/docs
- **GROQ Playground**: Use Vision plugin in Studio
- **This Analysis**: `CMS_FEATURE_ANALYSIS.md` (comprehensive reference)
- **Existing Code**: `useAIProject` hook, `featureFlags.ts` (already done!)

---

## Risk Mitigation

### Rollback Plan

If issues arise, rollback is simple:

**During Development:**
1. Feature flags control data source
2. Hardcoded data remains intact
3. Toggle flag to revert instantly

**In Production:**
1. Keep feature flags until fully tested
2. Verify each phase before proceeding
3. Always have working hardcoded fallback

### Data Safety

**Before Each Phase:**
1. Commit code to git
2. Export Sanity data: `sanity dataset export production backup.tar.gz`
3. Test in dev environment first

**During Migration:**
1. Keep hardcoded files until Phase 5
2. Verify data in Studio before deleting source
3. Screenshot Studio content as backup

### Common Issues

**Problem:** AI Project schema not appearing
**Solution:** Check import path, restart Studio

**Problem:** Images not displaying
**Solution:** Check CORS, verify asset URLs, check image field type

**Problem:** Query returns null
**Solution:** Use Vision plugin to test GROQ, check document exists

**Problem:** Performance slow
**Solution:** Add indexes, optimize queries, implement caching

---

## Appendix: Quick Reference

### Time Summary by Phase

| Phase | Focus | Time | Status |
|-------|-------|------|--------|
| Phase 0 | Register AI schema | 15 min | 🟡 Start Here |
| Phase 1 | Critical content | 6-8 hrs | 🔵 High Priority |
| Phase 2 | AI Projects | 6-8 hrs | 🔵 High Priority |
| Phase 3 | Navigation & About | 2-3 hrs | 🟢 Medium Priority |
| Phase 4 | Case Studies | 6-7 hrs | 🟢 Medium Priority |
| Phase 5 | Cleanup & Polish | 7-9 hrs | ⚪ Low Priority |
| **Total** | | **~30-35 hrs** | **~2 weeks** |

### Key Files Reference

**Schemas:**
- `/src/sanity-schemas/aiProject.ts` - AI projects (exists, needs registration)
- `/src/sanity-schemas/contact.ts` - Contact info (create in Phase 1)
- `/src/sanity-schemas/hero.ts` - Homepage hero (create in Phase 1)
- `/src/sanity-schemas/siteSettings.ts` - Site config (create in Phase 1)
- `/src/sanity-schemas/project.ts` - Case studies (exists)
- `/src/sanity-schemas/profile.ts` - About page (exists)

**Hooks:**
- `/src/hooks/useAIProject.ts` - AI project fetching (exists, ready to use)
- Create: `useQuery` hooks for other content

**Queries:**
- Create: `/src/lib/sanity/queries/homepage.ts`
- Create: `/src/lib/sanity/queries/aiProjects.ts`
- Create: `/src/lib/sanity/queries/projects.ts`
- Create: `/src/lib/sanity/queries/profile.ts`

**Feature Flags:**
- `/src/lib/featureFlags.ts` - Toggle system (exists, ready)

### Command Cheatsheet

```bash
# Development
npm run dev              # Start frontend (port 8080)
npm run sanity          # Start Sanity Studio (port 3333)

# Sanity Management
sanity dataset export production backup.tar.gz
sanity dataset import backup.tar.gz production
sanity documents query '*[_type == "aiProject"]'

# Git Workflow
git checkout -b feature/cms-integration
git add .
git commit -m "Phase X: [description]"
git push origin feature/cms-integration

# Testing
npm run build           # Verify builds
npm run preview         # Test production build
```

### GROQ Query Examples

```groq
// Get all AI projects
*[_type == "aiProject"]

// Get single project by slug
*[_type == "aiProject" && slug.current == "post-pal"][0]

// Get featured projects
*[_type == "project" && featured == true] | order(order asc)

// Get projects with images
*[_type == "aiProject"] {
  title,
  "heroImage": heroImage.asset->url
}
```

---

**End of Implementation Plan**

**Ready to Start:** Begin with Phase 0 (15 minutes) ✅
**Questions:** Review "Questions Before Starting" section
**Reference:** Keep `CMS_FEATURE_ANALYSIS.md` open for detailed context

Good luck! 🚀
