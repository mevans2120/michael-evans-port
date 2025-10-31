# Case Studies Landing Page Implementation Plan
**Design:** Minimal Variant A - Visible Background Image
**Date:** October 31, 2025
**Status:** Planning

---

## Executive Summary

Implement a new case studies landing page (`/case-studies`) based on the "Minimal Variant A" design concept. The design features a dramatic hero section with a subtle background image showcasing featured work, followed by a grid of all case studies. This creates a compelling entry point to the portfolio's case study content.

---

## Design Overview

### Minimal Variant A Strategy
The design integrates imagery as a visible background element that adds context and atmosphere while remaining secondary to content. The hero screenshot sits behind content at 25% opacity with subtle blur and slight grayscale, creating depth and showing the work without competing with typography.

### Key Design Elements

1. **Hero Section (75vh min-height)**
   - Background image layer (25% opacity, 4px blur, 20% grayscale)
   - Multi-directional gradient overlay (135deg, 75-80% opacity)
   - Subtle purple blur orb for depth
   - Large typography with gradient text
   - Featured case study content
   - CTA button

2. **Content Section**
   - Section separator with gradient line
   - "All Case Studies" header
   - Reuse existing FeaturedCaseStudies component

3. **Typography**
   - Hero title: 48-80px (Crimson Pro, font-weight 300)
   - Metric: 24px purple with decorative line
   - Description: 20px with 1.7 line-height
   - Label: 14px uppercase, letterspaced

4. **Colors**
   - Background gradient: #0f172a → #050510
   - Primary purple: #c084fc, #a855f7
   - Text: #f3f4f6, #e5e7eb
   - Subtle: #9ca3af

---

## File Structure

### New Files to Create
```
src/
├── app/
│   └── (public)/
│       └── case-studies/
│           └── page.tsx                 # NEW - Landing page
│
└── components/
    └── case-studies/
        ├── CaseStudiesHero.tsx          # NEW - Hero section
        ├── CaseStudyBackground.tsx      # NEW - Background image layer
        └── SectionSeparator.tsx         # NEW - Gradient separator
```

### Existing Files to Modify
```
src/
├── components/
│   └── FeaturedCaseStudies.tsx          # MODIFY - Extract for reuse
│
└── lib/
    └── sanity/
        └── queries.ts                    # MODIFY - Add query for featured case study
```

---

## Implementation Steps

### Phase 1: Data Layer & Queries (30 min)

#### 1.1 Create Featured Case Study Query
**File:** `src/lib/sanity/queries.ts`

```typescript
// Add new query
export const FEATURED_CASE_STUDY_QUERY = groq`
  *[_type == "project" && category == "case-study" && featured == true]
  | order(order asc)[0] {
    _id,
    title,
    slug,
    summary,
    description,
    metrics[] {
      label,
      value,
      description
    },
    heroImage {
      asset->{
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      },
      alt,
      caption
    },
    order
  }
`;

// Add helper function
export async function getFeaturedCaseStudy() {
  return await client.fetch(FEATURED_CASE_STUDY_QUERY);
}
```

**Testing:**
- Verify query returns correct case study
- Test with no featured case studies
- Test with multiple featured (should return first by order)

---

### Phase 2: Component Development (2 hours)

#### 2.1 Background Image Component
**File:** `src/components/case-studies/CaseStudyBackground.tsx`

```typescript
'use client';

import Image from 'next/image';
import { urlForImage } from '@/lib/sanity/image';

interface CaseStudyBackgroundProps {
  image?: {
    asset?: {
      _id: string;
      url: string;
    };
    alt?: string;
  };
}

export function CaseStudyBackground({ image }: CaseStudyBackgroundProps) {
  if (!image?.asset) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 to-slate-800/50" />
    );
  }

  const imageUrl = urlForImage(image)
    .width(1920)
    .height(1080)
    .quality(75)
    .url();

  return (
    <>
      {/* Background image layer */}
      <div className="absolute inset-0 opacity-25">
        <Image
          src={imageUrl}
          alt={image.alt || ''}
          fill
          className="object-cover blur-[4px] grayscale-[20%]"
          priority
          quality={75}
        />
      </div>

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-slate-950/75 via-slate-900/80 to-slate-950/75"
        style={{
          backgroundImage: 'linear-gradient(135deg, rgba(5,5,16,0.75) 0%, rgba(15,23,42,0.80) 50%, rgba(5,5,16,0.75) 100%)'
        }}
      />

      {/* Blur orb */}
      <div
        className="absolute top-[20%] left-[10%] w-[400px] h-[400px] rounded-full pointer-events-none z-[1] blur-[100px]"
        style={{
          background: 'rgba(168, 85, 247, 0.15)'
        }}
      />
    </>
  );
}
```

**Key Features:**
- Fallback gradient if no image
- Next.js Image optimization
- Sanity image URL builder
- CSS filters (blur, grayscale)
- Purple blur orb for depth

---

#### 2.2 Section Separator Component
**File:** `src/components/case-studies/SectionSeparator.tsx`

```typescript
export function SectionSeparator() {
  return (
    <div className="h-px w-full my-20 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
  );
}
```

---

#### 2.3 Hero Section Component
**File:** `src/components/case-studies/CaseStudiesHero.tsx`

```typescript
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CaseStudyBackground } from './CaseStudyBackground';

interface CaseStudy {
  title: string;
  slug: { current: string };
  summary: string;
  description: string;
  metrics?: Array<{
    label: string;
    value: string;
    description?: string;
  }>;
  heroImage?: {
    asset?: {
      _id: string;
      url: string;
    };
    alt?: string;
  };
}

interface CaseStudiesHeroProps {
  caseStudy: CaseStudy;
}

export function CaseStudiesHero({ caseStudy }: CaseStudiesHeroProps) {
  // Get primary metric (first metric or custom logic)
  const primaryMetric = caseStudy.metrics?.[0];

  return (
    <section className="relative min-h-[75vh] flex items-center py-28 md:py-32 overflow-hidden">
      {/* Background layers */}
      <CaseStudyBackground image={caseStudy.heroImage} />

      {/* Content */}
      <div className="container relative z-10 max-w-5xl">
        <div className="max-w-[900px]">
          {/* Label */}
          <div className="inline-block text-sm font-semibold tracking-widest uppercase text-purple-300 mb-6">
            Featured Case Study
          </div>

          {/* Title */}
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-light leading-tight mb-8"
            style={{
              fontFamily: 'var(--font-crimson-pro)',
              background: 'linear-gradient(135deg, #c084fc 0%, #ffffff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            {caseStudy.title}
          </h1>

          {/* Primary Metric */}
          {primaryMetric && (
            <div className="flex items-center gap-4 text-2xl font-semibold text-purple-300 mb-6">
              <div className="w-10 h-0.5 bg-gradient-to-r from-purple-400 to-transparent" />
              {primaryMetric.value}
            </div>
          )}

          {/* Description */}
          <p className="text-xl leading-relaxed text-gray-200 max-w-[700px] mb-12">
            {caseStudy.description}
          </p>

          {/* CTA */}
          <Link
            href={`/case-studies/${caseStudy.slug.current}`}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-lg font-semibold text-black bg-gradient-to-br from-purple-500 to-purple-400 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300"
          >
            View Case Study
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
```

**Key Features:**
- Responsive text sizing (clamp)
- Gradient text effect
- Decorative metric line
- Hover effects on CTA
- Proper z-index layering

---

#### 2.4 Landing Page
**File:** `src/app/(public)/case-studies/page.tsx`

```typescript
import { Metadata } from 'next';
import { getFeaturedCaseStudy, getAllProjects } from '@/lib/sanity/queries';
import { CaseStudiesHero } from '@/components/case-studies/CaseStudiesHero';
import { SectionSeparator } from '@/components/case-studies/SectionSeparator';
import { FeaturedCaseStudies } from '@/components/FeaturedCaseStudies';

export const metadata: Metadata = {
  title: 'Case Studies | Michael Evans',
  description: 'Product launches, transformational projects, and measurable business impact across e-commerce, travel, and enterprise software.',
};

export default async function CaseStudiesPage() {
  const [featuredCaseStudy, allCaseStudies] = await Promise.all([
    getFeaturedCaseStudy(),
    getAllProjects()
  ]);

  // Filter for case studies only
  const caseStudies = allCaseStudies.filter(
    (project: any) => project.category === 'case-study'
  );

  return (
    <main>
      {/* Hero Section */}
      {featuredCaseStudy && (
        <CaseStudiesHero caseStudy={featuredCaseStudy} />
      )}

      {/* Separator */}
      <div className="container">
        <SectionSeparator />
      </div>

      {/* All Case Studies */}
      <section className="container pb-32">
        <div className="mb-16">
          <h2 className="text-3xl font-light text-gray-100 mb-2" style={{ fontFamily: 'var(--font-crimson-pro)' }}>
            All Case Studies
          </h2>
          <p className="text-gray-400">
            Product launches and transformational projects
          </p>
        </div>

        <FeaturedCaseStudies projects={caseStudies} />
      </section>
    </main>
  );
}
```

---

### Phase 3: Responsive Design & Polish (1 hour)

#### 3.1 Mobile Optimizations
**Breakpoints:**
- Mobile (< 768px):
  - Hero min-height: auto
  - Title: 48px
  - Description: 18px
  - Background opacity: 18% (less visible)
  - Padding adjustments

#### 3.2 Accessibility
- Proper heading hierarchy (h1 → h2)
- Alt text for background images
- Focus states on CTA
- Color contrast verification (WCAG AA)
- Keyboard navigation support

#### 3.3 Performance
- Hero image: Priority loading, quality 75
- Background blur: CSS filter (GPU accelerated)
- Gradient: CSS (no extra HTTP requests)
- Font loading: Already configured in layout

---

### Phase 4: Integration & Testing (1 hour)

#### 4.1 Navigation Updates
**Update main navigation to include /case-studies link**

**File:** `src/components/navigation/MainNav.tsx` (or equivalent)

```typescript
const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/case-studies', label: 'Case Studies' }, // ADD THIS
  { href: '/ai-showcase', label: 'AI Projects' },
];
```

#### 4.2 Homepage Link
**Update homepage to link to /case-studies**

Update "View All Projects" or similar CTAs to point to `/case-studies` instead of scrolling.

#### 4.3 Testing Checklist
- [ ] Featured case study displays correctly
- [ ] Background image loads and applies filters
- [ ] Gradient overlay ensures text readability
- [ ] Primary metric displays
- [ ] CTA links to correct case study detail page
- [ ] All case studies grid displays below hero
- [ ] Mobile responsive (test 375px, 768px, 1024px)
- [ ] Lighthouse score (Performance, Accessibility, SEO)
- [ ] Works with missing heroImage (fallback gradient)
- [ ] Works with no featured case study (skip hero)

---

## Technical Considerations

### Image Optimization
- Use Next.js Image component for automatic optimization
- Sanity CDN for image transformations
- WebP format with fallbacks
- Lazy loading for case study cards (not hero)
- LQIP (Low Quality Image Placeholder) support

### CSS Architecture
- Use Tailwind utilities where possible
- Inline styles for complex gradients
- CSS variables for font families
- Avoid !important
- Mobile-first approach

### TypeScript Types
```typescript
// Add to types file
export interface CaseStudyHero {
  title: string;
  slug: { current: string };
  summary: string;
  description: string;
  metrics?: Array<{
    label: string;
    value: string;
    description?: string;
  }>;
  heroImage?: {
    asset?: {
      _id: string;
      url: string;
    };
    alt?: string;
  };
}
```

### Error Handling
- Graceful degradation if no featured case study
- Fallback gradient if no hero image
- Handle missing metrics
- Handle Sanity fetch failures

---

## Design Variations (Future Consideration)

The design file includes 3 variants. If Variant A doesn't test well, consider:

**Variant B - Offset Card**: Hero content in card with offset image
**Variant C - Inline Split**: Side-by-side layout with image

These can be implemented as alternatives with minimal changes to data layer.

---

## Timeline Estimate

| Phase | Task | Time | Cumulative |
|-------|------|------|------------|
| 1 | Data layer & queries | 30 min | 30 min |
| 2.1 | Background component | 30 min | 1h |
| 2.2 | Separator component | 15 min | 1h 15m |
| 2.3 | Hero component | 45 min | 2h |
| 2.4 | Landing page | 30 min | 2h 30m |
| 3 | Responsive & polish | 1h | 3h 30m |
| 4 | Integration & testing | 1h | 4h 30m |

**Total: ~4.5 hours** of focused development time

---

## Success Criteria

1. **Visual Fidelity**
   - Matches design concept 95%+
   - Background image visible but non-competing
   - Text perfectly readable
   - Purple gradient text renders correctly

2. **Performance**
   - Lighthouse Performance > 90
   - LCP < 2.5s
   - CLS < 0.1

3. **Functionality**
   - Hero displays featured case study
   - CTA navigates correctly
   - All case studies load below
   - Mobile responsive
   - Accessible (WCAG AA)

4. **Data Integration**
   - Pulls from Sanity correctly
   - Handles edge cases
   - Fast page loads (ISR/SSG)

---

## Dependencies

### Required
- Next.js Image component
- Sanity image URL builder
- Existing FeaturedCaseStudies component
- Lucide React icons
- Tailwind CSS configuration

### Optional
- Framer Motion (for scroll animations)
- Sharp (Next.js image optimization)

---

## Deployment Notes

1. **Environment Variables**: Ensure Sanity credentials are set
2. **Image Domains**: Add Sanity CDN to `next.config.ts` (already configured)
3. **Revalidation**: Consider ISR with 60s revalidate for semi-dynamic content
4. **Route**: New /case-studies route will be automatically generated

---

## Future Enhancements

1. **Animations**: Parallax on background image, fade-in on scroll
2. **Filtering**: Filter case studies by category, technology, metric
3. **Search**: Search functionality for finding specific case studies
4. **Analytics**: Track CTA clicks, scroll depth, time on page
5. **A/B Testing**: Test different hero images, CTA copy
6. **Dark Mode**: Already dark, but consider light variant
7. **Video Backgrounds**: Support video instead of static image

---

## Questions to Resolve

1. **Featured Logic**: Should featured be manual (flag) or automatic (highest order)?
   - **Recommendation**: Manual flag for control

2. **Hero Image**: Required or optional?
   - **Recommendation**: Optional with fallback gradient

3. **Metrics Display**: Show all metrics or just primary?
   - **Recommendation**: Just primary (first metric) for simplicity

4. **Mobile Background**: Remove on mobile or keep lighter?
   - **Recommendation**: Keep at 18% opacity (per design)

5. **Navigation**: Add to main nav or secondary?
   - **Recommendation**: Main nav (it's primary content)

---

## Related Files Reference

- Design file: `/docs/design/concepts-batch-3-102825/minimal-variant-a-background.html`
- Existing case study page: `/src/app/(public)/case-studies/[slug]/page.tsx`
- Featured component: `/src/components/FeaturedCaseStudies.tsx`
- Sanity queries: `/src/lib/sanity/queries.ts`

---

*Document created: October 31, 2025*
*Ready for implementation: Yes*
*Estimated effort: 4.5 hours*
