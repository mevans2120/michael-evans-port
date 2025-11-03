# Case Study Editorial Format Proposal

**Date:** November 3, 2025
**Purpose:** Adapt case studies (like Before Launcher) to use the editorial magazine template from AI Showcase articles

---

## Current State Analysis

### AI Showcase Template (Editorial, Max 3 Pages)

**Schema:** `aiShowcase.ts`

**Structure:**
1. **Hero Section** - Badge, title, subtitle, summary
2. **Content Slides** - Flowing article sections with:
   - Section labels (e.g., "Phase 01 — Discovery")
   - Headings
   - Portable Text content (rich text blocks)
   - Optional pull quotes
   - Comparison boxes (Problem/Solution, Before/After)
   - Visual cards (images with captions)
   - Tech pills (technology tags)
3. **Metrics Section** - "The Results" with key metrics
4. **CTA** - Final call to action

**Key Features:**
- Editorial typography (flowing article)
- Clean, magazine-style layout
- Maximum 3 pages
- Focused narrative
- Visual emphasis on comparisons and quotes

### Case Study Template (Current, No Page Limit)

**Schema:** `project.ts`

**Structure:**
1. **Overview Section** - Role, company, timeline
2. **Hero** - Title, summary, description
3. **Key Metrics** - Achievement metrics
4. **Content Sections** - Array of sections with:
   - Section labels
   - Headings
   - Portable Text content
   - Screenshots array (with captions and layout options)
   - Design annotations
5. **Technologies** - Technology tags
6. **Links** - Live URL, GitHub URL

**Key Features:**
- Comprehensive project documentation
- Multiple screenshot galleries per section
- Design annotations
- No length constraints
- Technical depth

---

## Proposed Adaptation Strategy

### Option 1: Create New "Editorial Case Study" Schema

Create a separate `editorialCaseStudy` schema that mirrors the AI Showcase structure but with case study-specific fields.

**Pros:**
- Preserves existing case studies unchanged
- Editorial format is opt-in
- Can coexist with detailed case studies
- Clear separation of concerns

**Cons:**
- Schema duplication
- Need to maintain two case study types
- Content creators need to choose format

### Option 2: Add "Editorial Mode" to Project Schema

Add a boolean `editorialFormat` field to the existing `project` schema that changes rendering and content structure.

**Pros:**
- Single schema to maintain
- Can toggle format per project
- Flexible approach

**Cons:**
- Schema becomes more complex
- Conditional field visibility
- Potential for confusion

### Option 3: Migrate All Case Studies to Editorial Format (RECOMMENDED)

Simplify the `project` schema to match the AI Showcase editorial approach, with a migration path for existing content.

**Pros:**
- Single, clean schema
- Consistent editorial experience across all case studies
- Forces concise, impactful storytelling
- Easier to maintain

**Cons:**
- Requires content migration
- Some detailed projects might need condensing
- Breaking change for existing case studies

---

## Recommended Approach: Option 3 - Editorial Format for All

### New Project Schema Structure

```typescript
{
  // Meta
  title: string
  slug: slug
  category: string (dropdown)
  featured: boolean
  order: number
  publishedAt: datetime

  // Hero Section (like AI Showcase)
  heroSection: {
    badge?: string           // e.g., "Case Study"
    title: string            // Large hero title
    subtitle?: text          // Tagline
    summary: text            // Brief overview (2-3 sentences)
  }

  // Project Context
  overview: {
    role: string            // "Lead Product Manager"
    company: string         // "Work & Co"
    timeline: string        // "~1 year (2014-2015)"
  }

  // Content Slides (like AI Showcase)
  slides: [
    {
      sectionLabel?: string     // "Phase 01 — The Challenge"
      heading: string           // Main section heading
      content: portable text    // Rich text with embedded images
      quoteBox?: {             // Pull quotes
        quote: text
        attribution: string
      }
      comparisonBoxes?: [      // Problem/Solution, Before/After
        {
          label: string        // "The Problem", "The Solution"
          title?: string
          text: text
          stat?: string        // "30-40% reduction"
          icon?: string        // Emoji or icon
        }
      ]
      visualCards?: [          // Screenshots/images
        {
          image: image
          placeholderText?: text
          caption?: string
        }
      ]
      annotation?: {           // Design decision callouts
        title: string
        content: text
      }
    }
  ]

  // Results
  metrics: [
    {
      value: string           // "30-40%", "1000+"
      label: string           // "Fewer Phone Opens"
      description?: string    // Optional context
    }
  ]

  // Tech Stack
  technologies: string[]      // Technology pills

  // Links & CTA
  liveUrl?: url
  githubUrl?: url
  callToAction?: {
    text: string
    link: string
  }
}
```

### Key Changes from Current Schema

**Removed:**
- `description` field (redundant with heroSection.summary)
- `achievements` array (covered by metrics + content)
- Separate `content` field (replaced by slides)
- `sections` array (replaced by slides)
- `featuredMetric` and `featuredDescription` (use metrics + heroSection)

**Added:**
- `heroSection` object (matches AI Showcase)
- `slides` array with editorial components (quotes, comparisons, visual cards)
- Structured `annotation` objects (design decisions)
- `callToAction` object

**Preserved:**
- `overview` (role, company, timeline) - case study specific
- `metrics` - enhanced with description field
- `technologies` - unchanged
- `liveUrl`, `githubUrl` - unchanged

---

## Before Launcher Content Mapping

### Current Spec → Editorial Format

#### Hero Section
```yaml
heroSection:
  badge: "Case Study"
  title: "Before Launcher - Helping Thousands Focus"
  subtitle: "Intelligent notification filtering that helped thousands of people reduce phone opens by 30-40%"
  summary: "Founded Beforelab to create the Before Launcher, an Android home screen replacement that tackled phone distraction through intelligent notification filtering. Won Fast Company's Best App of 2019."
```

#### Overview
```yaml
overview:
  role: "Founder, Product Lead, Designer"
  company: "Beforelab (Startup)"
  timeline: "~2 years (2017-2019)"
```

#### Content Slides

**Slide 1: The Challenge**
```yaml
- sectionLabel: "The Challenge"
  heading: "The Phone Distraction Epidemic"
  content: [portable text from Section 1]
  comparisonBoxes:
    - label: "The Problem"
      text: "You open your phone to do something specific, but end up doing something completely different because of notifications or app icons"
      icon: "📱"
    - label: "The Question"
      text: "Could we keep the power of smartphones while eliminating the addiction?"
      icon: "💡"
```

**Slide 2: The Solution**
```yaml
- sectionLabel: "The Solution"
  heading: "Intelligent Filtering + Minimalist Design"
  content: [portable text explaining the two core innovations]
  visualCards:
    - image: [notification filter visual]
      caption: "Intelligent notification filtering separates important from unimportant"
    - image: [3-swipe interface]
      caption: "Simple 3-swipe interface replaces cluttered home screen"
```

**Slide 3: Technical Challenges**
```yaml
- sectionLabel: "Development"
  heading: "Building the Impossible"
  content: [portable text about platform limitations]
  annotation:
    title: "Technical Note"
    content: "The notification filter could only be built on Android. iOS doesn't allow this level of system access. We weren't even sure it was technically possible—the Android APIs were just flexible enough."
```

**Slide 4: Beta Testing**
```yaml
- sectionLabel: "Research"
  heading: "Beta Testing & Learnable Interfaces"
  content: [portable text about beta testing]
  quoteBox:
    quote: "Phone interfaces are different from airline booking flows. You use your phone hundreds of times per day, so it's fine—even good—to have features that are learnable over time."
    attribution: "— On designing for daily-use interfaces"
```

**Slide 5: ASO Insights**
```yaml
- sectionLabel: "Marketing"
  heading: "Data-Driven Discovery"
  content: [portable text about ASO learnings]
  comparisonBoxes:
    - label: "What Didn't Work"
      title: "Video"
      text: "A/B testing showed video performed worse than static screenshots"
      icon: "🎥"
    - label: "What Worked"
      title: "Imagery + Reviews"
      text: "Clear screenshots and cultivating 5-star reviews significantly improved conversion"
      icon: "⭐"
```

**Slide 6: Impact**
```yaml
- sectionLabel: "The Results"
  heading: "Meaningful Behavior Change"
  content: [portable text about user impact]
```

**Slide 7: Business Reality**
```yaml
- sectionLabel: "Lessons Learned"
  heading: "Product Success vs. Business Viability"
  content: [portable text about business challenges]
  quoteBox:
    quote: "You can have a product people love—Fast Company award, thousands of users, measurable behavior change—and still not have a viable business. The business model matters as much as the product."
    attribution: "— On startup lessons"
```

**Slide 8: Legacy**
```yaml
- sectionLabel: "Impact"
  heading: "Proving the Concept"
  content: [portable text about legacy and lessons]
```

#### Metrics
```yaml
metrics:
  - value: "30-40%"
    label: "Fewer Phone Opens"
    description: "Measured behavior change"
  - value: "Thousands"
    label: "Users Helped"
  - value: "#1"
    label: "Fast Company Best App 2019"
  - value: "Android"
    label: "Platform"
```

#### Technologies
```yaml
technologies:
  - "Android"
  - "Custom Launcher API"
  - "Notification Management"
  - "App Store Optimization"
  - "A/B Testing"
```

---

## Content Guidelines for Editorial Format

### Length Constraints

**Total:** Maximum 3 pages when rendered
- **Hero + Summary:** ~1/4 page
- **Content Slides:** ~2 pages total (aim for 5-8 slides)
- **Metrics:** ~1/4 page
- **CTA:** ~1/4 page

### Content Slides Best Practices

1. **Each slide should stand alone** - Clear section label + heading
2. **One main idea per slide** - Don't try to cover everything
3. **Use visual components strategically:**
   - Comparison boxes for before/after, problem/solution
   - Pull quotes for impactful statements or lessons learned
   - Visual cards for screenshots (max 2-3 per slide)
   - Annotations for technical or design decisions

4. **Prioritize narrative flow** - Tell a story:
   - Challenge → Solution → Process → Results → Lessons

5. **Keep it editorial** - Write like an article, not documentation

### What to Cut

From the Before Launcher spec (9 sections), we'd condense to **6-7 slides:**

**Keep (as separate slides):**
1. The Challenge
2. The Solution
3. Development Process (combine Technical Challenges + Beta Testing)
4. ASO/Marketing Insights
5. Results & Impact
6. Business Reality + Lessons

**Combine or Embed:**
- Technical details → Annotations
- Quotes from sections → Pull quotes
- Legacy content → Weave into final slides

---

## Migration Path

### Phase 1: Schema Updates
1. Create new editorial schema fields in `project.ts`
2. Mark old fields as optional/deprecated
3. Update TypeScript types

### Phase 2: Component Updates
1. Create magazine-style case study components (can reuse AI Showcase components)
2. Build new case study page layout
3. Add conditional rendering for old vs. new format

### Phase 3: Content Migration
1. Create migration script for Before Launcher
2. Test editorial rendering
3. Migrate remaining case studies
4. Remove deprecated schema fields

### Phase 4: Cleanup
1. Remove old case study components
2. Update documentation
3. Update Sanity Studio UI

---

## Component Reuse Strategy

### Shared Components (from AI Showcase)

Can be reused directly:
- `MagazineLayout`
- `MagazineHero`
- `MagazineLede`
- `MagazineBody`
- `MagazinePullQuote`
- `MagazineMetrics`
- `MagazineSectionHeader`
- `MagazineComparisonGrid`
- `MagazineTechStack`
- `MagazineSeparator`

### New Components Needed

Case study specific:
- `MagazineOverview` - Display role, company, timeline
- `MagazineAnnotation` - Design decision callouts
- `MagazineVisualCards` - Screenshot galleries with captions
- `MagazineCTA` - Call to action section

---

## Example Implementation

### CaseStudyPageMagazine.tsx (New Component)

```typescript
'use client'

import React from 'react'
import { PortableText } from '@portabletext/react'
import type { Project } from '@/types/project'
import {
  MagazineLayout,
  MagazineHero,
  MagazineLede,
  MagazineBody,
  MagazinePullQuote,
  MagazineMetrics,
  MagazineSectionHeader,
  MagazineComparisonGrid,
  MagazineTechStack,
  MagazineSeparator,
} from '@/components/magazine'
import {
  MagazineOverview,
  MagazineAnnotation,
  MagazineVisualCards,
  MagazineCTA
} from '@/components/case-study-magazine'

interface CaseStudyPageMagazineProps {
  project: Project
}

export function CaseStudyPageMagazine({ project }: CaseStudyPageMagazineProps) {
  return (
    <MagazineLayout>
      {/* Hero */}
      <MagazineHero
        badge={project.heroSection.badge}
        title={project.heroSection.title}
        subtitle={project.heroSection.subtitle}
      />

      {/* Project Context */}
      {project.overview && (
        <MagazineOverview
          role={project.overview.role}
          company={project.overview.company}
          timeline={project.overview.timeline}
        />
      )}

      {/* Lede */}
      {project.heroSection.summary && (
        <MagazineLede>{project.heroSection.summary}</MagazineLede>
      )}

      <MagazineSeparator />

      {/* Content Slides → Flowing Article */}
      {project.slides?.map((slide, index) => (
        <React.Fragment key={index}>
          {slide.sectionLabel && (
            <MagazineSectionHeader>{slide.sectionLabel}</MagazineSectionHeader>
          )}

          {slide.content && (
            <MagazineBody>
              <PortableText value={slide.content} />
            </MagazineBody>
          )}

          {slide.quoteBox && (
            <MagazinePullQuote
              quote={slide.quoteBox.quote}
              attribution={slide.quoteBox.attribution}
            />
          )}

          {slide.comparisonBoxes && (
            <MagazineComparisonGrid boxes={slide.comparisonBoxes} />
          )}

          {slide.visualCards && (
            <MagazineVisualCards cards={slide.visualCards} />
          )}

          {slide.annotation && (
            <MagazineAnnotation
              title={slide.annotation.title}
              content={slide.annotation.content}
            />
          )}

          {slide.sectionLabel && index < (project.slides?.length ?? 0) - 1 && (
            <MagazineSeparator />
          )}
        </React.Fragment>
      ))}

      {/* Metrics */}
      {project.metrics && (
        <>
          <MagazineSectionHeader>The Results</MagazineSectionHeader>
          <MagazineMetrics metrics={project.metrics} />
        </>
      )}

      {/* Tech Stack */}
      {project.technologies && (
        <MagazineTechStack technologies={project.technologies} />
      )}

      <MagazineSeparator />

      {/* CTA */}
      {project.callToAction && (
        <MagazineCTA
          text={project.callToAction.text}
          link={project.callToAction.link}
        />
      )}
    </MagazineLayout>
  )
}
```

---

## Comparison: Before vs. After

### Before (Current Project Schema)
- 9 detailed sections
- Multiple screenshot galleries per section
- No length constraints
- Technical documentation style
- Separate achievements array
- Complex nested structure

### After (Editorial Format)
- 6-7 focused slides
- Strategic use of visual cards
- Maximum 3 pages
- Magazine article style
- Metrics integrated into narrative
- Clean, flowing structure

---

## Benefits of Editorial Format

### For Users
- **Faster to read** - Concise, focused content
- **Better flow** - Magazine-style narrative
- **Visual hierarchy** - Clear sections and components
- **Mobile-friendly** - Optimized for scrolling

### For Content Creators
- **Easier to write** - Clear structure and constraints
- **Better storytelling** - Forced prioritization
- **Consistent quality** - Template ensures standards
- **Less maintenance** - Simpler schema

### For Developers
- **Component reuse** - Leverage AI Showcase components
- **Single pattern** - Consistent across all case studies
- **Easier testing** - Predictable structure
- **Better performance** - Optimized rendering

---

## Next Steps

1. **Review this proposal** - Confirm editorial format is desired direction
2. **Choose migration approach** - Option 3 recommended
3. **Update schema** - Modify `project.ts` to match editorial structure
4. **Build components** - Create case study-specific magazine components
5. **Migrate content** - Start with Before Launcher as proof of concept
6. **Test and iterate** - Ensure quality and performance
7. **Roll out** - Migrate remaining case studies

---

## Questions for Consideration

1. **Do we want to preserve detailed case studies?** Or is editorial format preferred for all?
2. **Should we keep both formats?** Editorial for featured, detailed for archives?
3. **What's the migration timeline?** All at once or phased?
4. **Do we need a content review process?** To ensure quality before migration?
5. **Should we update existing case studies?** Or only apply to new ones?

---

## Conclusion

The editorial format from AI Showcase articles provides a superior user experience through focused storytelling, visual hierarchy, and consistent quality. By adapting case studies like Before Launcher to this format, we create a more compelling portfolio while simplifying content management and development.

The recommended approach is to fully migrate to the editorial format, treating case studies as editorial articles with project-specific context (role, company, timeline). This creates a unified, high-quality experience across all project showcases.
