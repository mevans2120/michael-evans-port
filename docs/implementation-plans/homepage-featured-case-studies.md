# Homepage Featured Case Studies - Implementation Plan

**Date**: October 28, 2025
**Design Concept**: Minimal Vertical Cards (Concept 1)
**Status**: Ready for Implementation

## Overview

Replace the current 3-column grid of case study cards on the homepage with a vertical stacked layout featuring large typography, generous spacing, and progressive disclosure. The new design aligns with the narrative scroll aesthetic used in individual case study pages.

## Goals

1. **Brand Consistency**: Match the elevated aesthetic of full case study pages
2. **Content Clarity**: Emphasize impact and storytelling over visual decoration
3. **Mobile Excellence**: Provide a tap-once-to-expand, tap-again-to-navigate interaction pattern
4. **Accessibility**: Maintain keyboard navigation and screen reader support
5. **Performance**: Smooth animations without jank

## Featured Case Studies

1. **Virgin America** - First responsive airline website (15% conversion lift)
2. **Casa Bonita** - Restaurant with immersive entertainment (Cultural icon revival)
3. **Before Launcher** - Minimalist Android launcher (100K+ users)

## Technical Requirements

### Dependencies
- Next.js 15.5+ with App Router
- React 18.3+
- TypeScript 5.8+
- Tailwind CSS 3.4+
- Existing font configuration (DM Sans + Crimson Pro)

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 10+)

### Performance Targets
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Lighthouse Performance: > 90

## Content Requirements

### Data Structure

Each case study needs:
```typescript
interface FeaturedCaseStudy {
  id: string;              // e.g., "virgin-america"
  number: string;          // e.g., "01"
  category: string;        // e.g., "UX Design"
  title: string;           // e.g., "Virgin America"
  metric: string;          // e.g., "15% conversion lift"
  description: string;     // ~150-200 characters
  slug: string;            // URL slug for detail page
  order: number;           // Display order (1, 2, 3)
}
```

### Content Migration

#### Option 1: Hardcoded in Component (Recommended for Phase 1)
**File**: `/src/app/(public)/page.tsx`

**Current State**:
```typescript
const caseStudies = [
  {
    title: "Virgin America",
    description: "First responsive airline website",
    metric: "15% conversion lift",
    link: "/case-studies/virgin-america",
    tag: "UX Design"
  },
  // ... more studies
];
```

**New State**:
```typescript
const featuredCaseStudies = [
  {
    id: "virgin-america",
    number: "01",
    category: "UX Design",
    title: "Virgin America",
    metric: "15% conversion lift",
    description: "Created the first responsive airline website, reimagining booking flows by focusing on decisions rather than clicks — achieving industry recognition and measurable business impact.",
    slug: "virgin-america",
    order: 1
  },
  {
    id: "casa-bonita",
    number: "02",
    category: "Experience Design",
    title: "Casa Bonita",
    metric: "Cultural icon revival",
    description: "Revived a beloved Colorado landmark by reimagining the customer experience, balancing nostalgia with modern hospitality design — from reservation flows to in-venue wayfinding.",
    slug: "casa-bonita",
    order: 2
  },
  {
    id: "before-launcher",
    number: "03",
    category: "Mobile Product",
    title: "Before Launcher",
    metric: "100K+ users",
    description: "Built a minimalist Android launcher focused on intentionality over distraction, reducing phone time through thoughtful UX and becoming a finalist for App of the Year.",
    slug: "before-launcher",
    order: 3
  }
];
```

#### Option 2: Sanity CMS Integration (Phase 2 - Future Enhancement)

**Schema**: `/sanity/schemas/project.ts`

Add fields to existing project schema:
```typescript
{
  name: 'featured',
  title: 'Featured on Homepage',
  type: 'boolean',
  description: 'Show this case study on the homepage'
},
{
  name: 'featuredOrder',
  title: 'Featured Order',
  type: 'number',
  description: 'Order on homepage (1, 2, 3, etc.)',
  validation: Rule => Rule.min(1)
},
{
  name: 'featuredMetric',
  title: 'Featured Metric',
  type: 'string',
  description: 'Short metric for homepage (e.g., "15% conversion lift")'
},
{
  name: 'featuredDescription',
  title: 'Featured Description',
  type: 'text',
  description: 'Description for homepage card (150-200 characters)',
  validation: Rule => Rule.max(250)
}
```

**Query**:
```typescript
const featuredCaseStudies = await client.fetch(`
  *[_type == "project" && featured == true] | order(featuredOrder asc) {
    _id,
    title,
    category,
    slug,
    featuredMetric,
    featuredDescription,
    featuredOrder
  }
`);
```

## Implementation Phases

### Phase 1: Component Development (2-3 days)

#### 1.1 Create FeaturedCaseStudies Component

**File**: `/src/components/FeaturedCaseStudies.tsx`

```typescript
'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface CaseStudy {
  id: string;
  number: string;
  category: string;
  title: string;
  metric: string;
  description: string;
  slug: string;
  order: number;
}

interface FeaturedCaseStudiesProps {
  studies: CaseStudy[];
}

export function FeaturedCaseStudies({ studies }: FeaturedCaseStudiesProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleClick = (id: string, slug: string) => {
    if (isMobile) {
      // Mobile: First tap expands, second tap navigates
      if (expandedId === id) {
        // Already expanded, navigate to detail page
        window.location.href = `/case-studies/${slug}`;
      } else {
        // Not expanded, expand it
        setExpandedId(id);
      }
    } else {
      // Desktop: Click navigates immediately
      window.location.href = `/case-studies/${slug}`;
    }
  };

  return (
    <div className="flex flex-col gap-16">
      {studies.map((study) => (
        <article
          key={study.id}
          className={`
            group relative py-14 border-b border-white/8 last:border-b-0
            cursor-pointer transition-all duration-400 ease-out
            hover:pl-8
            ${expandedId === study.id ? 'pl-8' : ''}
          `}
          onClick={() => handleClick(study.id, study.slug)}
        >
          {/* Purple accent bar */}
          <div className={`
            absolute left-0 top-1/2 -translate-y-1/2 w-1 bg-gradient-to-b
            from-purple-400 to-purple-300 rounded-full transition-all duration-400
            ${expandedId === study.id || 'group-hover:h-30'}
            ${expandedId === study.id ? 'h-30' : 'h-0'}
          `} />

          {/* Header */}
          <div className="flex justify-between items-center mb-6 gap-10">
            <div className="flex-1">
              <div className="text-sm font-semibold text-purple-400 tracking-wider uppercase mb-5 font-sans">
                {study.number} — {study.category}
              </div>
              <h3 className={`
                text-5xl md:text-6xl font-semibold leading-tight mb-4
                transition-all duration-300 font-sans
                ${expandedId === study.id || 'group-hover:bg-gradient-to-br group-hover:from-purple-400 group-hover:to-white group-hover:bg-clip-text group-hover:text-transparent'}
                ${expandedId === study.id ? 'bg-gradient-to-br from-purple-400 to-white bg-clip-text text-transparent' : ''}
              `}>
                {study.title}
              </h3>
            </div>
            <div className={`
              text-xl font-semibold font-sans whitespace-nowrap
              transition-opacity duration-300
              ${expandedId === study.id ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}
            `}>
              {study.metric}
            </div>
          </div>

          {/* Description - Expands on hover (desktop) or tap (mobile) */}
          <p className={`
            text-xl leading-relaxed text-gray-300 max-w-3xl
            transition-all duration-400 ease-out overflow-hidden
            ${expandedId === study.id || 'group-hover:max-h-48 group-hover:opacity-100 group-hover:mt-6'}
            ${expandedId === study.id ? 'max-h-48 opacity-100 mt-6' : 'max-h-0 opacity-0'}
          `}>
            {study.description}
          </p>
        </article>
      ))}
    </div>
  );
}
```

#### 1.2 Create useMediaQuery Hook

**File**: `/src/hooks/useMediaQuery.ts`

```typescript
'use client'

import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    // Set initial value
    setMatches(media.matches);

    // Create event listener
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);

    // Add listener
    media.addEventListener('change', listener);

    // Cleanup
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}
```

#### 1.3 Update Homepage

**File**: `/src/app/(public)/page.tsx`

**Changes**:
1. Import new component
2. Replace existing case studies grid with FeaturedCaseStudies component
3. Update data structure

```typescript
import { FeaturedCaseStudies } from '@/components/FeaturedCaseStudies';

// ... inside component

const featuredCaseStudies = [
  // ... data from Content Migration section above
];

// ... in JSX, replace existing case studies section:

<section className="py-20 px-6 relative">
  <div className="absolute left-1/4 top-1/2 w-40 h-40 rounded-full blur-3xl bg-accent/20" />
  <div className="container mx-auto max-w-6xl relative z-10">
    <div className="mb-20 -mx-6 md:mx-0">
      <h2 className="text-2xl font-light mb-2 flex items-center gap-3 text-gray-100">
        Selected Work
        {/* SVG gradient line */}
      </h2>
      <p className="text-gray-400">Case studies and product launches</p>
    </div>

    <div className="-mx-6 md:mx-0">
      <FeaturedCaseStudies studies={featuredCaseStudies} />
    </div>
  </div>
</section>
```

### Phase 2: Styling & Animation Polish (1 day)

#### 2.1 Add Custom Animations

**File**: `/src/app/globals.css`

```css
/* Purple accent bar animation */
@keyframes slideIn {
  from {
    height: 0;
  }
  to {
    height: 120px;
  }
}

/* Smooth description reveal */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

#### 2.2 Fine-tune Responsive Behavior

**Breakpoints**:
- Mobile: < 768px - Tap to expand, tap again to navigate
- Tablet: 768px - 1023px - Hover to expand, click to navigate
- Desktop: 1024px+ - Hover to expand, click to navigate

### Phase 3: Testing (1 day)

#### 3.1 Interaction Testing

**Desktop**:
- ✅ Hover shows description smoothly
- ✅ Click navigates to case study page
- ✅ Purple bar animates on hover
- ✅ Title gradient animates on hover
- ✅ Metric opacity increases on hover

**Mobile**:
- ✅ First tap expands description
- ✅ Second tap navigates to detail page
- ✅ Purple bar appears on tap
- ✅ Title gradient appears on tap
- ✅ Description is readable and properly sized

#### 3.2 Accessibility Testing

- ✅ Keyboard navigation: Tab through case studies
- ✅ Enter key: Expands on first press, navigates on second (mobile behavior)
- ✅ Space key: Same as Enter
- ✅ Screen reader: Announces "clickable article, [category], [title], [metric]"
- ✅ Focus visible: Clear focus indicator on keyboard navigation
- ✅ Color contrast: All text meets WCAG AA standards (4.5:1 minimum)

#### 3.3 Browser Testing

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile Safari (iOS 14+)
- ✅ Chrome Mobile (Android 10+)

#### 3.4 Performance Testing

- ✅ Lighthouse audit: Performance > 90
- ✅ No layout shift on hover/tap
- ✅ Smooth 60fps animations
- ✅ No memory leaks (especially on mobile)

### Phase 4: Documentation (0.5 days)

#### 4.1 Component Documentation

Add JSDoc comments to FeaturedCaseStudies component explaining:
- Props interface
- Mobile vs desktop interaction behavior
- How to add/remove case studies
- How to customize styling

#### 4.2 Update Memory Bank

**File**: `/memory-bank/CURRENT.md`

Add section documenting:
- New homepage featured case studies implementation
- Mobile tap interaction pattern
- Component location and usage

## Mobile Interaction Specification

### Behavior

**First Tap**:
- Expand the tapped card
- Show description with fade-in animation
- Show purple accent bar
- Apply gradient to title
- Set metric to full opacity
- Collapse any other expanded cards

**Second Tap** (on same card):
- Navigate to case study detail page via Next.js Link

**Tap on Different Card**:
- Collapse currently expanded card
- Expand newly tapped card
- Show its description

### Implementation Notes

```typescript
const handleClick = (id: string, slug: string) => {
  if (isMobile) {
    if (expandedId === id) {
      // Already expanded - navigate
      router.push(`/case-studies/${slug}`);
    } else {
      // Not expanded - expand it
      setExpandedId(id);
    }
  } else {
    // Desktop - navigate immediately
    router.push(`/case-studies/${slug}`);
  }
};
```

### Visual Feedback

To indicate the card is tappable again:
- Subtle pulse animation on expanded card (optional)
- "Tap to view details" hint text appears after expansion (optional)
- Native touch feedback (iOS/Android system highlight)

## Accessibility Considerations

### Keyboard Navigation

```typescript
const handleKeyDown = (e: React.KeyboardEvent, id: string, slug: string) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    handleClick(id, slug);
  }
};

// Add to article element:
<article
  onKeyDown={(e) => handleKeyDown(e, study.id, study.slug)}
  tabIndex={0}
  role="button"
  aria-expanded={expandedId === study.id}
>
```

### Screen Reader Support

```tsx
<article
  aria-label={`Case study: ${study.title}. ${study.metric}. ${expandedId === study.id ? 'Expanded. Press Enter to view details.' : 'Press Enter to expand.'}`}
>
```

### Focus Management

- Clear focus indicator (2px purple outline)
- Focus stays on card after expansion (mobile)
- Focus moves to detail page on navigation

## Success Metrics

### Engagement Metrics
- **Click-through rate**: > 25% of users click a case study
- **Expansion rate** (mobile): > 40% of users expand at least one card
- **Time on page**: Increase by 15-20% vs. current grid

### Performance Metrics
- **Lighthouse Performance**: > 90
- **First Contentful Paint**: < 1.5s
- **Cumulative Layout Shift**: < 0.1

### Accessibility Metrics
- **Keyboard navigation**: 100% functional
- **Screen reader compatibility**: No critical issues
- **Color contrast**: WCAG AA compliant (4.5:1 minimum)

## Rollout Plan

### Phase 1: Development (Local)
1. Create component and hook
2. Update homepage
3. Test interactions locally

### Phase 2: Staging
1. Deploy to staging environment
2. QA testing (interactions, accessibility, performance)
3. Stakeholder review

### Phase 3: Production
1. Deploy to production
2. Monitor analytics (engagement, performance)
3. Gather user feedback
4. Iterate if needed

## Future Enhancements

### Phase 2 (Post-Launch)
- [ ] Migrate to Sanity CMS (dynamic featured case studies)
- [ ] Add image thumbnails (optional visual enhancement)
- [ ] Implement keyboard shortcuts (e.g., numbers 1-3 to jump to case studies)
- [ ] Add "View all case studies" link at bottom
- [ ] Analytics events for expansion vs. navigation

### Phase 3 (Advanced)
- [ ] Animated page transitions to case study detail pages
- [ ] Prefetch case study pages on hover/expansion
- [ ] A/B test different description lengths
- [ ] Add filters/tags for case study categories

## Risk Mitigation

### Potential Issues

1. **Mobile tap confusion**: Users may not understand two-tap pattern
   - **Mitigation**: Add subtle "Tap to view" hint after expansion
   - **Fallback**: A/B test single-tap navigation vs two-tap

2. **Performance on low-end devices**: Animations may lag
   - **Mitigation**: Use CSS transforms (GPU-accelerated)
   - **Fallback**: Detect device capabilities, reduce animations if needed

3. **Accessibility concerns**: Complex interaction for screen readers
   - **Mitigation**: Thorough ARIA labels and keyboard support
   - **Fallback**: Provide skip links to case study pages

## Questions for Stakeholder

- [ ] Confirm three featured case studies are correct
- [ ] Mobile two-tap interaction acceptable? (Or prefer single-tap navigation?)
- [ ] Timing for Phase 2 Sanity integration?
- [ ] Any specific analytics events to track?

---

**Last Updated**: October 28, 2025
**Created By**: Claude Code
**Status**: Ready for Development
