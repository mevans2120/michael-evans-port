# AI Showcase Magazine Editorial Redesign - Implementation Plan
**Date:** November 1, 2025
**Goal:** Reimplement AI Showcase detail pages with magazine editorial design using existing purple color scheme

---

## Audit Summary

### Current Architecture

**Page Structure:**
- Entry: `/src/app/(public)/ai-showcase/[slug]/page.tsx` (Server Component)
- Client: `/src/app/(public)/ai-showcase/[slug]/AIShowcasePageClient.tsx`
- Layout: `ScrollingSlidesLayout` (simple smooth-scroll container)
- Components: 13 slide/component files in `/src/components/ai-showcase/`

**Data Flow:**
- Sanity CMS → GROQ query → AIShowcase type → React components
- Schema supports: hero, slides (content/quote/comparison/visual/tech), horizontal timeline, metrics

**Current Design:**
- Purple gradient backgrounds (`from-[#0a0a14] via-purple-950/20`)
- Syne font for headings, system sans for body
- Slide-based layout with alternating dark backgrounds
- Horizontal scrolling timeline section
- Full-height slides with centered content

**Existing Colors (from globals.css):**
```css
/* Light mode */
--color-accent: 276 70% 45%;       /* Darker purple */
--color-bg: 0 0% 98%;              /* Off-white */
--color-text: 0 0% 3.1%;           /* Vampire black */

/* Dark mode */
--color-accent: 276 100% 75%;      /* Bright purple */
--color-bg: 240 10% 3%;            /* Very dark */
--color-text: 0 0% 98%;            /* White */
```

### Decision: Reimplement vs Update

**RECOMMENDATION: Reimplement**

**Why:**
1. **Fundamentally different layout philosophy**
   - Current: Full-height slides with gradients
   - Magazine: Flowing article with centered column

2. **Different content structure**
   - Current: Discrete slides with variants
   - Magazine: Continuous narrative flow

3. **Typography system change**
   - Current: Syne headings, system sans body
   - Magazine: Need serif fonts (Fraunces/Newsreader from concept)

4. **Cleaner codebase**
   - Start fresh avoids messy conditional logic
   - Easier to maintain two distinct approaches
   - Can A/B test or transition gradually

**What to keep:**
- Sanity schema (no changes needed!)
- Data fetching logic (queries work as-is)
- Component exports structure
- Existing purple color values

**What to replace:**
- All 13 component files in `/src/components/ai-showcase/`
- `AIShowcasePageClient.tsx`
- CSS approach (from slide-based to article-based)

---

## Implementation Plan

### Phase 1: Setup & Typography
**Goal:** Update to Newsreader for body text

#### 1.1 Update Serif Font to Newsreader
**File:** `/src/app/layout.tsx`

Replace Crimson Pro with Newsreader:

```typescript
import { DM_Sans, Newsreader } from 'next/font/google'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700'],
})

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-serif',  // Use existing --font-serif variable
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
})

// Update className (remove Crimson Pro and Syne)
className={`${dmSans.variable} ${newsreader.variable}`}
```

**Note:**
- Remove Syne import and usage (we'll use DM Sans for everything that was Syne)
- Remove Crimson Pro import
- Keep existing `--font-sans` and `--font-serif` variable names for compatibility

#### 1.2 Tailwind Config
**File:** `/tailwind.config.ts`

No changes needed! Existing config already has:

```typescript
fontFamily: {
  sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
  serif: ['var(--font-serif)', 'Georgia', 'serif'],
}
```

Now `--font-sans` = DM Sans and `--font-serif` = Newsreader.

**Estimated time:** 15 minutes

---

### Phase 2: Create Magazine Components
**Goal:** Build new component library for magazine style

#### 2.1 Create Magazine Layout Component
**File:** `/src/components/ai-showcase-magazine/MagazineLayout.tsx`

```typescript
'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface MagazineLayoutProps {
  children: React.ReactNode
  className?: string
}

export function MagazineLayout({ children, className }: MagazineLayoutProps) {
  return (
    <article
      className={cn(
        "max-w-[920px] mx-auto",
        "px-8 md:px-10 py-16 md:py-20",
        "bg-background",
        className
      )}
    >
      {children}
    </article>
  )
}
```

#### 2.2 Create Magazine Components

**File Structure:**
```
/src/components/ai-showcase-magazine/
├── index.ts
├── MagazineLayout.tsx
├── MagazineHero.tsx
├── MagazineLede.tsx
├── MagazineBody.tsx
├── MagazinePullQuote.tsx
├── MagazineMetrics.tsx
├── MagazineTechStack.tsx
├── MagazineSeparator.tsx
└── MagazineSectionHeader.tsx
```

**Key components to create:**

**MagazineHero.tsx:**
```typescript
interface MagazineHeroProps {
  badge?: string
  title: string
  subtitle?: string
}

export function MagazineHero({ badge, title, subtitle }: MagazineHeroProps) {
  return (
    <header className="mb-12">
      {badge && (
        <span className="font-sans text-[11px] uppercase tracking-[2px] text-accent dark:text-accent font-semibold mb-8 inline-block pb-2 border-b-2 border-accent dark:border-accent">
          {badge}
        </span>
      )}
      <h1 className="font-sans text-[clamp(42px,6vw,68px)] font-bold leading-[1.1] text-foreground mb-6 tracking-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="font-serif text-[22px] leading-[1.5] text-muted-foreground font-light italic max-w-[680px]">
          {subtitle}
        </p>
      )}
    </header>
  )
}
```

**MagazineLede.tsx:**
```typescript
interface MagazineLedeProps {
  children: string
}

export function MagazineLede({ children }: MagazineLedeProps) {
  return (
    <p className="text-[20px] leading-[1.6] text-foreground mb-12 font-normal border-l-4 border-accent dark:border-accent pl-7 max-w-[720px]">
      {children}
    </p>
  )
}
```

**MagazinePullQuote.tsx:**
```typescript
interface MagazinePullQuoteProps {
  quote: string
  attribution?: string
}

export function MagazinePullQuote({ quote, attribution }: MagazinePullQuoteProps) {
  return (
    <blockquote className="font-sans text-[28px] leading-[1.4] font-semibold text-foreground my-14 p-10 bg-card dark:bg-card border-l-[6px] border-accent dark:border-accent shadow-card dark:shadow-card italic">
      {quote}
      {attribution && (
        <footer className="font-serif text-sm text-muted-foreground mt-4 not-italic font-normal">
          {attribution}
        </footer>
      )}
    </blockquote>
  )
}
```

**MagazineMetrics.tsx:**
```typescript
interface MagazineMetricsProps {
  metrics: Array<{
    value: string
    label: string
    description?: string
  }>
}

export function MagazineMetrics({ metrics }: MagazineMetricsProps) {
  return (
    <div className="bg-foreground dark:bg-foreground text-background dark:text-background p-12 my-16 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-8">
      {metrics.map((metric, index) => (
        <div key={index} className="text-center">
          <span className="font-sans text-[48px] font-bold text-accent dark:text-accent block mb-2">
            {metric.value}
          </span>
          <span className="font-serif text-sm uppercase tracking-[1px] opacity-80">
            {metric.label}
          </span>
        </div>
      ))}
    </div>
  )
}
```

**MagazineTechStack.tsx:**
```typescript
interface MagazineTechStackProps {
  technologies: string[]
}

export function MagazineTechStack({ technologies }: MagazineTechStackProps) {
  return (
    <div className="flex flex-wrap gap-3 my-10">
      {technologies.map((tech, index) => (
        <span
          key={index}
          className="font-sans text-[13px] px-4 py-2 bg-background dark:bg-card border-[1.5px] border-border dark:border-border text-foreground dark:text-foreground font-semibold transition-smooth hover:border-accent dark:hover:border-accent hover:text-accent dark:hover:text-accent hover:-translate-y-0.5 hover:shadow-md"
        >
          {tech}
        </span>
      ))}
    </div>
  )
}
```

**MagazineBody.tsx:**
```typescript
interface MagazineBodyProps {
  children: React.ReactNode
}

export function MagazineBody({ children }: MagazineBodyProps) {
  return (
    <div className="font-serif text-[18px] leading-[1.8] text-foreground [&>p]:mb-7">
      {children}
    </div>
  )
}
```

**MagazineSeparator.tsx:**
```typescript
export function MagazineSeparator() {
  return (
    <hr className="w-[60px] h-0.5 bg-accent dark:bg-accent border-0 my-16" />
  )
}
```

**MagazineSectionHeader.tsx:**
```typescript
interface MagazineSectionHeaderProps {
  children: string
}

export function MagazineSectionHeader({ children }: MagazineSectionHeaderProps) {
  return (
    <h2 className="font-sans text-sm uppercase tracking-[2px] text-accent dark:text-accent font-bold my-20 pt-20 border-t border-border dark:border-border">
      {children}
    </h2>
  )
}
```

**Estimated time:** 3-4 hours

---

### Phase 3: Create Magazine Page Client
**Goal:** New client component that uses magazine design

#### 3.1 Create Magazine Page Client
**File:** `/src/app/(public)/ai-showcase/[slug]/AIShowcasePageMagazine.tsx`

```typescript
'use client'

import React from 'react'
import { PortableText } from '@portabletext/react'
import type { AIShowcase } from '@/types/aiShowcase'
import {
  MagazineLayout,
  MagazineHero,
  MagazineLede,
  MagazineBody,
  MagazinePullQuote,
  MagazineMetrics,
  MagazineTechStack,
  MagazineSeparator,
  MagazineSectionHeader,
} from '@/components/ai-showcase-magazine'

interface AIShowcasePageMagazineProps {
  showcase: AIShowcase
}

export function AIShowcasePageMagazine({ showcase }: AIShowcasePageMagazineProps) {
  return (
    <MagazineLayout>
      {/* Hero */}
      <MagazineHero
        badge={showcase.heroSection.badge}
        title={showcase.heroSection.title}
        subtitle={showcase.heroSection.subtitle}
      />

      {/* Lede */}
      {showcase.heroSection.summary && (
        <MagazineLede>{showcase.heroSection.summary}</MagazineLede>
      )}

      <MagazineSeparator />

      {/* Content Slides → Flowing Article */}
      {showcase.slides?.map((slide, index) => (
        <React.Fragment key={index}>
          {/* Section Header */}
          {slide.sectionLabel && (
            <MagazineSectionHeader>{slide.sectionLabel}</MagazineSectionHeader>
          )}

          {/* Portable Text Content */}
          {slide.content && slide.content.length > 0 && (
            <MagazineBody>
              <PortableText value={slide.content} />
            </MagazineBody>
          )}

          {/* Quote Box */}
          {slide.quoteBox && (
            <MagazinePullQuote
              quote={slide.quoteBox.quote}
              attribution={slide.quoteBox.attribution}
            />
          )}

          {/* Tech Pills */}
          {slide.techPills && slide.techPills.length > 0 && (
            <MagazineTechStack technologies={slide.techPills} />
          )}

          {/* Add subtle separator between major sections */}
          {slide.sectionLabel && index < showcase.slides.length - 1 && (
            <MagazineSeparator />
          )}
        </React.Fragment>
      ))}

      {/* Metrics */}
      {showcase.metrics && showcase.metrics.length > 0 && (
        <>
          <MagazineSectionHeader>The Results</MagazineSectionHeader>
          <MagazineMetrics metrics={showcase.metrics} />
        </>
      )}

      {/* Final separator before CTA */}
      <MagazineSeparator />

      {/* CTA or closing text can go here */}
    </MagazineLayout>
  )
}
```

**Estimated time:** 1 hour

---

### Phase 4: Update Page Entry Point
**Goal:** Switch to magazine design

#### 4.1 Update page.tsx to use Magazine Client
**File:** `/src/app/(public)/ai-showcase/[slug]/page.tsx`

```typescript
import { notFound } from 'next/navigation'
import { client } from '@/lib/sanity/client'
import { aiShowcaseBySlugQuery, allAIShowcaseSlugsQuery } from '@/lib/sanity/queries/aiShowcase'
import type { AIShowcase } from '@/types/aiShowcase'
// Change import:
import { AIShowcasePageMagazine } from './AIShowcasePageMagazine'

// ... generateStaticParams and generateMetadata remain same ...

export default async function AIShowcasePage({ params }: PageProps) {
  const { slug } = await params
  const showcase = await client.fetch<AIShowcase>(aiShowcaseBySlugQuery, {
    slug,
  })

  if (!showcase) {
    notFound()
  }

  // Use magazine client:
  return <AIShowcasePageMagazine showcase={showcase} />
}
```

#### 4.2 Rename Old Client (Keep as Backup)
```bash
mv AIShowcasePageClient.tsx AIShowcasePageClient.OLD.tsx
```

**Estimated time:** 15 minutes

---

### Phase 5: Handle Special Cases
**Goal:** Address comparison boxes, visual cards, timeline

#### 5.1 Add Magazine Comparison Grid
**File:** `/src/components/ai-showcase-magazine/MagazineComparisonGrid.tsx`

For comparison boxes (if they exist in content), create magazine-style version:

```typescript
interface MagazineComparisonGridProps {
  boxes: Array<{
    label?: string
    title?: string
    text?: string
    stat?: string
    icon?: string
  }>
}

export function MagazineComparisonGrid({ boxes }: MagazineComparisonGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
      {boxes.map((box, index) => (
        <div
          key={index}
          className="p-8 bg-card dark:bg-card border border-border dark:border-border shadow-card"
        >
          {box.label && (
            <div className="font-sans text-xs uppercase tracking-[2px] text-accent dark:text-accent font-semibold mb-3">
              {box.label}
            </div>
          )}
          {box.stat && (
            <div className="font-sans text-[36px] font-bold text-foreground dark:text-foreground mb-2">
              {box.stat}
            </div>
          )}
          {box.title && (
            <h3 className="font-sans text-[20px] font-semibold text-foreground dark:text-foreground mb-3">
              {box.title}
            </h3>
          )}
          {box.text && (
            <p className="font-serif text-base text-muted-foreground leading-relaxed">
              {box.text}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
```

Add to AIShowcasePageMagazine.tsx:

```typescript
{/* Comparison Grid */}
{slide.comparisonBoxes && slide.comparisonBoxes.length > 0 && (
  <MagazineComparisonGrid boxes={slide.comparisonBoxes} />
)}
```

#### 5.2 Timeline/Horizontal Section Decision

**Option A: Skip Timeline (Simplest)**
Magazine format works best for continuous reading. Timeline might not fit well.

**Option B: Convert to Vertical Timeline**
Create `MagazineTimeline.tsx` that shows phases vertically in article flow.

**Option C: Keep Horizontal Scroll**
Add horizontal scroll section at end, styled to match magazine aesthetic.

**Recommendation:** Option A for initial implementation. Can add later if needed.

**Estimated time:** 2 hours

---

### Phase 6: Testing & Refinement
**Goal:** Ensure everything works and looks good

#### 6.1 Test Checklist
- [ ] Hero section renders correctly
- [ ] Lede paragraph has proper styling
- [ ] Body text flows naturally
- [ ] Pull quotes stand out appropriately
- [ ] Metrics grid displays correctly (2-3 columns)
- [ ] Tech stack tags are interactive
- [ ] Separators provide visual rhythm
- [ ] Section headers create hierarchy
- [ ] Responsive on mobile (test 375px, 768px, 1024px)
- [ ] Dark mode works correctly
- [ ] Fonts load properly (DM Sans, Newsreader)
- [ ] Purple accent color appears correctly
- [ ] PortableText renders rich content
- [ ] Images in content work (if any)

#### 6.2 Accessibility Check
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Heading hierarchy is logical (h1 → h2 → h3)
- [ ] Interactive elements have focus states
- [ ] Alt text on images
- [ ] Proper semantic HTML

#### 6.3 Performance
- [ ] Fonts load efficiently (using next/font optimization)
- [ ] No layout shift (CLS)
- [ ] Fast FCP and LCP

**Estimated time:** 2-3 hours

---

### Phase 7: Content Migration (Optional)
**Goal:** Update Sanity content to match new article format

#### 7.1 Sanity Content Changes

Current "ai-workflow" showcase likely has:
- Multiple discrete slides
- Comparison boxes
- Tech pills
- Timeline phases

Magazine format needs:
- Flowing narrative in fewer slides
- Quotes integrated naturally
- Metrics at end

**Action:** Review existing Sanity data, potentially consolidate slides into flowing narrative.

**Note:** Schema doesn't need changes - just how content is authored.

**Estimated time:** 1-2 hours (content editing)

---

## Total Estimated Time

| Phase | Time |
|-------|------|
| Phase 1: Setup & Typography | 15 min |
| Phase 2: Magazine Components | 3-4 hours |
| Phase 3: Magazine Page Client | 1 hour |
| Phase 4: Update Entry Point | 15 min |
| Phase 5: Special Cases | 2 hours |
| Phase 6: Testing & Refinement | 2-3 hours |
| Phase 7: Content Migration (optional) | 1-2 hours |
| **Total** | **10-13 hours** |

---

## Risks & Mitigation

### Risk 1: Color Adaptation
**Issue:** Magazine concept used warm orange (#c8510a), but we need purple
**Mitigation:** Already designed for this - use `accent` and `accent-light` variables throughout

### Risk 2: Typography Loading
**Issue:** Replacing Crimson Pro with Newsreader
**Mitigation:** Using next/font for optimization, fonts subset to Latin only. Only one font change needed.

### Risk 3: Breaking Existing Pages
**Issue:** Other AI showcase pages might break
**Mitigation:** Keep old components, only change page.tsx import. Can roll back easily.

### Risk 4: Mobile Experience
**Issue:** Magazine design might not work on small screens
**Mitigation:** Designed mobile-first, tested at 375px breakpoint

### Risk 5: Content Not Matching Format
**Issue:** Existing slide-based content doesn't flow as article
**Mitigation:** Phase 7 content migration, or keep hybrid approach per showcase

---

## Rollback Plan

If magazine design doesn't work:

1. **Revert page.tsx import:**
   ```typescript
   import { AIShowcasePageClient } from './AIShowcasePageClient.OLD'
   ```

2. **Remove new components** (can keep in repo as `/magazine/` subfolder)

3. **Restore fonts in layout** (restore Crimson Pro if needed)

**Rollback time:** 5 minutes

---

## Success Criteria

✅ Magazine design implemented with existing purple colors
✅ Article flows naturally (3-4 minute read)
✅ All content elements render correctly
✅ Responsive across devices
✅ Dark mode works perfectly
✅ Maintains existing Sanity schema
✅ No performance regression
✅ Accessible (WCAG AA)

---

## Next Steps After Implementation

1. **Get feedback** on magazine vs slide design
2. **A/B test** if needed (can serve different versions per showcase)
3. **Apply to other showcases** if successful
4. **Document patterns** for future showcase pages
5. **Consider landing page redesign** to match magazine aesthetic

---

## Notes

- Magazine design emphasizes **reading experience** over visual spectacle
- Better suited for **text-heavy content** (like AI workflow article)
- **Typography system:** DM Sans (headers) + Newsreader (body) for editorial quality
- **Purple accents** maintain brand consistency
- **Reusable components** can be applied to other pages
- **Sanity schema** unchanged - just presentation layer
- **Simplified fonts:** Only 2 fonts (down from 3), cleaner approach
