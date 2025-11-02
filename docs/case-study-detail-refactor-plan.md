# Case Study Detail Page - Refactoring Plan

**Date:** November 1, 2025
**Component:** `/src/app/(public)/case-studies/[slug]/page.tsx`
**Current State:** 428 lines, 40+ inline styles, ZERO dark mode support
**Priority:** HIGH - Key portfolio content

## Executive Summary

The case study detail page needs a complete refactor to:
1. **Eliminate 40+ inline styles** with hardcoded HSL colors
2. **Add comprehensive dark mode support**
3. **Extract reusable components** for better maintainability
4. **Standardize with design system** (use Tailwind + design tokens)
5. **Improve code quality** and reduce duplication

**Estimated Time:** 2-3 hours
**Complexity:** Medium-High
**Impact:** HIGH - Affects all case study detail pages

---

## Current State Analysis

### Problems

1. **Inline Styles Everywhere**
   - 40+ inline `style={}` objects with hardcoded values
   - HSL colors like `hsl(280, 100%, 80%)`
   - RGBA values like `rgba(199, 128, 245, 0.1)`
   - Pixel values, gradients, fonts all hardcoded

2. **No Dark Mode Support**
   - All colors are fixed
   - No light/dark variants
   - Will look broken in dark mode

3. **No Component Reuse**
   - 428 lines in a single file
   - Repeated patterns (badges, cards, gradients)
   - Hard to maintain and test

4. **Inconsistent with Design System**
   - Uses custom colors instead of design tokens
   - Doesn't use `bg-background`, `text-foreground`, etc.
   - Different from rest of site

### Current Structure

```
CaseStudyPage
├── Atmospheric blur orbs (inline styles)
├── Hero Section (inline styles)
│   ├── Category badge
│   ├── Hero title with gradient
│   ├── Subtitle
│   └── Tech tags
├── Dynamic Sections (loop)
│   ├── Section label
│   ├── Heading with underline
│   ├── PortableText content
│   ├── Annotation box
│   └── Screenshots (grid & large)
├── Metrics Section
│   ├── Section header
│   └── Metrics grid
├── Achievements Section
│   ├── Section header
│   └── Achievements list
└── CTA button
```

---

## Refactoring Goals

### ⚠️ CRITICAL PRIORITY: PRESERVE EXISTING DESIGN

**The existing case study design must remain PIXEL-PERFECT identical in light mode.**

This is a **code refactor ONLY**, not a redesign. We are:
- ✅ Converting inline styles to Tailwind (same visual output)
- ✅ Adding dark mode variants (NEW functionality)
- ✅ Extracting components (same visual output)
- ❌ NOT changing any colors, spacing, fonts, or layouts in light mode

### Primary Goals (In Priority Order)

1. 🎯 **PRESERVE EXACT VISUAL APPEARANCE** - Light mode must look identical (pixel-perfect)
2. ✅ **Convert inline styles to Tailwind** - Same visual output, cleaner code
3. ✅ **Add dark mode support** - NEW feature, doesn't affect light mode
4. ✅ **Extract reusable components** - Better organization, same visual output
5. ✅ **Use design system tokens** - Where possible without changing appearance

### Secondary Goals

- Improve accessibility (without changing design)
- Reduce file size and complexity
- Make components testable
- Better TypeScript types

---

## Component Architecture

### New Component Structure

```
/src/components/case-studies/
├── detail/
│   ├── CaseStudyHero.tsx          (Hero section with badge, title, tags)
│   ├── CaseStudySection.tsx       (Generic section wrapper)
│   ├── CaseStudySectionHeader.tsx (Label + Heading with underline)
│   ├── CaseStudyAnnotation.tsx    (Annotation/callout box)
│   ├── CaseStudyScreenshots.tsx   (Already exists - may need updates)
│   ├── CaseStudyMetrics.tsx       (Metrics grid)
│   ├── CaseStudyAchievements.tsx  (Achievements list)
│   └── CaseStudyCTA.tsx           (Bottom CTA button)
└── CaseStudyBackground.tsx        (Already exists - may need updates)
```

### Component Details

#### 1. CaseStudyHero.tsx

**Purpose:** Hero section with category, title, subtitle, and tech tags

**Props:**
```tsx
interface CaseStudyHeroProps {
  category?: string
  title: string
  subtitle?: string
  technologies?: string[]
}
```

**Replaces:** Lines 191-253 (63 lines → ~50 lines)

**Key Features:**
- Category badge with purple accent
- Large gradient title
- Subtitle with muted text
- Tech tags grid

---

#### 2. CaseStudySectionHeader.tsx

**Purpose:** Reusable section label + heading with purple underline

**Props:**
```tsx
interface CaseStudySectionHeaderProps {
  label?: string
  heading: string
  className?: string
}
```

**Replaces:** Repeated pattern (lines 262-271, 357-364, 391-398)

**Key Features:**
- Optional purple section label
- Large heading with purple gradient underline
- Consistent spacing

---

#### 3. CaseStudySection.tsx

**Purpose:** Generic section wrapper with optional background

**Props:**
```tsx
interface CaseStudySectionProps {
  children: React.ReactNode
  variant?: 'default' | 'alternate'  // Alternating backgrounds
  className?: string
}
```

**Replaces:** Repeated section pattern (lines 260-351)

**Key Features:**
- Consistent padding and max-width
- Alternating backgrounds (transparent vs subtle purple)
- Proper z-index layering

---

#### 4. CaseStudyAnnotation.tsx

**Purpose:** Callout/annotation box for important notes

**Props:**
```tsx
interface CaseStudyAnnotationProps {
  title?: string
  content: string
  className?: string
}
```

**Replaces:** Lines 282-292 (11 lines → ~20 lines component)

**Key Features:**
- Purple left border
- Subtle purple background
- Optional title in purple
- Italic body text

---

#### 5. CaseStudyMetrics.tsx

**Purpose:** Metrics grid with large numbers

**Props:**
```tsx
interface Metric {
  label: string
  value: string
  description?: string
}

interface CaseStudyMetricsProps {
  metrics: Metric[]
  heading?: string
}
```

**Replaces:** Lines 353-385 (33 lines → ~40 lines component)

**Key Features:**
- Responsive grid (1-3 columns)
- Large gradient numbers
- Metric labels and descriptions
- Cards with subtle borders

---

#### 6. CaseStudyAchievements.tsx

**Purpose:** Bulleted achievements list

**Props:**
```tsx
interface CaseStudyAchievementsProps {
  achievements: string[]
  heading?: string
}
```

**Replaces:** Lines 387-412 (26 lines → ~35 lines component)

**Key Features:**
- Purple bullet points
- Large readable text
- Consistent spacing

---

#### 7. CaseStudyCTA.tsx

**Purpose:** Bottom call-to-action button

**Props:**
```tsx
interface CaseStudyCTAProps {
  href: string
  children: React.ReactNode
}
```

**Replaces:** Lines 414-424 (11 lines → ~15 lines component)

**Key Features:**
- Purple gradient button
- Hover effects
- Proper accessibility

---

## Design Preservation Strategy

### How We'll Ensure Pixel-Perfect Preservation

1. **Take "Before" Screenshots First**
   - Capture all case study pages in light mode
   - Multiple breakpoints (mobile, tablet, desktop)
   - Document current colors, spacing, fonts

2. **Exact Color Mapping**
   - Every inline color has an exact Tailwind equivalent
   - Document mapping in code comments
   - Example: `hsl(280, 100%, 80%)` = `#c084fc` = `text-purple-300`

3. **Conservative Conversion Approach**
   - Convert ONE component at a time
   - Test in browser after each conversion
   - If Tailwind doesn't match exactly, keep inline style temporarily
   - Use arbitrary values `[#c084fc]` if needed for exact match

4. **Side-by-Side Comparison**
   - Keep original page open in one tab
   - Refactored page in another tab
   - Toggle between them to spot differences
   - Use browser dev tools to compare computed styles

5. **Incremental Git Commits**
   - Commit after each component extraction
   - Easy to revert if something goes wrong
   - Clear history of changes

6. **Tailwind Arbitrary Values as Fallback**
   - If standard Tailwind class doesn't match exactly
   - Use arbitrary value: `bg-[rgba(199,128,245,0.1)]`
   - Document why arbitrary value was needed
   - Can refine later if needed

### Exact Color Reference

For precision, here are the EXACT hex values from the inline styles:

```
INLINE STYLE VALUE           HEX VALUE    CLOSEST TAILWIND     EXACT MATCH
hsl(280, 100%, 80%)          #c084fc      purple-300           ✅ EXACT
hsl(276, 100%, 75%)          #b845fc      purple-400           ✅ EXACT
rgba(199, 128, 245, 0.1)     #c780f51a    purple-500/10        ✅ EXACT
rgba(199, 128, 245, 0.3)     #c780f54d    purple-500/30        ✅ EXACT
rgba(199, 128, 245, 0.03)    #c780f508    purple-500/[0.03]    ⚠️ USE ARBITRARY
rgba(199, 128, 245, 0.05)    #c780f50d    purple-500/[0.05]    ⚠️ USE ARBITRARY
rgba(255, 255, 255, 0.05)    #ffffff0d    white/5              ✅ EXACT
rgba(255, 255, 255, 0.1)     #ffffff1a    white/10             ✅ EXACT
#a0a0a0                      #a0a0a0      gray-400             ⚠️ CLOSE (#9ca3af)
#fafafa                      #fafafa      gray-50              ⚠️ CLOSE (#f9fafb)
```

**Decision:** Use arbitrary values `purple-500/[0.03]` for exact opacity matches when standard Tailwind steps don't align perfectly.

### What If We Find a Mismatch?

**Scenario:** After converting a component, colors look slightly different

**Action Plan:**
1. **STOP** - Don't continue to next component
2. **Investigate** using browser DevTools
   - Compare computed styles (before vs after)
   - Check exact color values
   - Verify opacity levels
3. **Fix Options (in order of preference):**
   - a) Find correct Tailwind class (may have used wrong purple shade)
   - b) Use arbitrary value for exact match: `text-[#c084fc]`
   - c) Keep inline style temporarily with `// TODO: convert to Tailwind`
4. **Document** why arbitrary value or inline style was kept
5. **Test again** to confirm visual match
6. **Continue** only when EXACT match is confirmed

**Example Fix:**
```tsx
// BEFORE: Mismatch found
className="text-purple-400"  // Too bright!

// AFTER: Fixed with correct shade
className="text-purple-300"  // Exact match to hsl(280, 100%, 80%)

// OR: Use arbitrary if no Tailwind class matches
className="text-[#c084fc]"  // Guaranteed exact match
```

### Validation Checklist Before Proceeding

Before moving to the next component, verify:
- ✅ Component renders without errors
- ✅ Colors match exactly in light mode
- ✅ Spacing and layout identical
- ✅ Fonts and text sizes unchanged
- ✅ Borders and shadows match
- ✅ Responsive behavior preserved
- ✅ No console errors or warnings

**Only proceed when ALL checkboxes are ✅**

---

## Implementation Plan

### Phase 1: Setup & Preparation (15 min)

1. **Create component directory structure**
   ```bash
   mkdir -p src/components/case-studies/detail
   ```

2. **Review existing components**
   - `CaseStudyBackground.tsx` - Keep as-is
   - `CaseStudyScreenshots.tsx` - Already refactored in Phase 3
   - `CaseStudiesHero.tsx` - Different component (landing page)

3. **Document color mappings**
   ```
   hsl(280, 100%, 80%)           → text-purple-300 dark:text-purple-200
   rgba(199, 128, 245, 0.1)      → bg-purple-500/10 dark:bg-purple-400/10
   rgba(199, 128, 245, 0.3)      → border-purple-500/30 dark:border-purple-400/30
   rgba(199, 128, 245, 0.03)     → bg-purple-500/5 dark:bg-purple-400/5
   rgba(199, 128, 245, 0.05)     → bg-purple-500/10 dark:bg-purple-400/10
   rgba(255, 255, 255, 0.05)     → bg-white/5
   rgba(255, 255, 255, 0.1)      → border-white/10
   #a0a0a0                       → text-muted-foreground
   #fafafa                       → text-foreground
   from-[#0a0a14] to-[#050510]   → bg-background
   ```

---

### Phase 2: Extract Components (60-75 min)

**Order of extraction (bottom-up approach):**

#### Step 1: CaseStudyCTA.tsx (5 min)
- Simplest component
- Lines 414-424
- Convert gradient button to Tailwind
- Add dark mode variants

#### Step 2: CaseStudySectionHeader.tsx (10 min)
- Extract repeated pattern
- Lines 262-271 (first occurrence)
- Purple label + heading + underline gradient
- Reusable across multiple sections

#### Step 3: CaseStudyAnnotation.tsx (10 min)
- Lines 282-292
- Purple border-left, background, optional title
- Dark mode variants for all colors

#### Step 4: CaseStudyAchievements.tsx (15 min)
- Lines 387-412
- Include section header
- Bulleted list with purple bullets
- Responsive text sizing

#### Step 5: CaseStudyMetrics.tsx (15 min)
- Lines 353-385
- Include section header
- Responsive grid
- Gradient numbers, card backgrounds

#### Step 6: CaseStudySection.tsx (10 min)
- Generic wrapper
- Alternating backgrounds
- Consistent padding/max-width

#### Step 7: CaseStudyHero.tsx (20 min)
- Most complex component
- Lines 191-253
- Badge, title gradient, subtitle, tech tags
- Multiple inline styles to convert

---

### Phase 3: Update Main Page (30 min)

1. **Import new components** (2 min)
   ```tsx
   import {
     CaseStudyHero,
     CaseStudySection,
     CaseStudySectionHeader,
     CaseStudyAnnotation,
     CaseStudyMetrics,
     CaseStudyAchievements,
     CaseStudyCTA,
   } from '@/components/case-studies/detail'
   ```

2. **Replace Hero section** (5 min)
   - Lines 191-253 → `<CaseStudyHero />`
   - Pass props from `project` data

3. **Refactor Dynamic Sections loop** (15 min)
   - Wrap in `<CaseStudySection>`
   - Use `<CaseStudySectionHeader>`
   - Keep PortableText
   - Use `<CaseStudyAnnotation>` conditionally
   - Keep screenshots (already has `<CaseStudyScreenshots>`)

4. **Replace Metrics section** (3 min)
   - Lines 353-385 → `<CaseStudyMetrics />`

5. **Replace Achievements section** (3 min)
   - Lines 387-412 → `<CaseStudyAchievements />`

6. **Replace CTA** (2 min)
   - Lines 414-424 → `<CaseStudyCTA />`

---

### Phase 4: Fix PortableText Component (10 min)

**Current issue:** Lines 145-150
```tsx
const portableTextComponents = {
  marks: {
    strong: ({ children }: any) => (
      <strong style={{ color: 'hsl(280, 100%, 80%)' }}>{children}</strong>
    ),
  },
};
```

**Fix:**
```tsx
const portableTextComponents = {
  marks: {
    strong: ({ children }: any) => (
      <strong className="text-purple-300 dark:text-purple-200">{children}</strong>
    ),
  },
};
```

---

### Phase 5: Fix Background & Atmosphere (10 min)

1. **Replace page background** (Line 161)
   ```tsx
   // Before
   <div className="min-h-screen bg-gradient-to-b from-[#0a0a14] to-[#050510] text-white">

   // After
   <div className="min-h-screen bg-background text-foreground">
   ```

2. **Refactor blur orbs** (Lines 163-188)
   - Convert inline styles to Tailwind classes
   - Add dark mode variants if needed
   - Or extract to separate component

   ```tsx
   // Option 1: Inline Tailwind
   <div className="fixed top-[10%] left-[10%] w-[400px] h-[400px] rounded-full bg-purple-500 dark:bg-purple-400 opacity-15 blur-[100px] pointer-events-none -z-10" />

   // Option 2: Extract component (recommended)
   <AtmosphericBlurOrbs />
   ```

---

### Phase 6: Testing & Refinement (15 min)

**CRITICAL: Design Preservation Validation**

1. **Visual regression testing** (MOST IMPORTANT)
   - Take "before" screenshots in light mode FIRST
   - Compare "after" screenshots in light mode
   - Light mode MUST be pixel-perfect identical
   - Dark mode should look good (new feature)
   - Test responsive breakpoints

2. **Specific visual checks in light mode:**
   - Hero gradient colors (purple to white)
   - Badge colors and backgrounds
   - Section heading underlines
   - Metric card gradients
   - Purple bullet points
   - All spacing and typography
   - Border colors and opacities
   - Background colors

3. **Check all case study pages**
   - Test with different content (short/long)
   - Verify metrics, achievements, annotations
   - Check screenshot layouts
   - Compare against production

4. **TypeScript checks**
   ```bash
   npm run build
   ```

5. **Update tests if needed**
   - May need to update selectors
   - Add new component tests

---

## Detailed Code Examples

### Example 1: CaseStudyHero Component

```tsx
'use client'

import { cn } from '@/lib/utils'

interface CaseStudyHeroProps {
  category?: string
  title: string
  subtitle?: string
  technologies?: string[]
  className?: string
}

export function CaseStudyHero({
  category,
  title,
  subtitle,
  technologies,
  className
}: CaseStudyHeroProps) {
  return (
    <section className={cn(
      "hero relative min-h-screen flex items-center justify-center text-center px-8 py-32",
      className
    )}>
      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Category Badge */}
        {category && (
          <div className="inline-block px-6 py-2 mb-8 rounded-full bg-purple-500/10 dark:bg-purple-400/10 border border-purple-500/30 dark:border-purple-400/30 text-purple-300 dark:text-purple-200 text-xs font-semibold uppercase tracking-widest">
            {category}
          </div>
        )}

        {/* Hero Title with Gradient */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-semibold mb-8 leading-tight bg-gradient-to-br from-purple-300 dark:from-purple-200 to-white bg-clip-text text-transparent">
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-xl md:text-2xl lg:text-3xl font-light leading-relaxed max-w-3xl mx-auto mb-8 text-muted-foreground">
            {subtitle}
          </p>
        )}

        {/* Tech Tags */}
        {technologies && technologies.length > 0 && (
          <div className="flex flex-wrap gap-4 justify-center mt-12">
            {technologies.map((tech) => (
              <span
                key={tech}
                className="px-6 py-3 rounded-xl text-sm bg-white/5 border border-white/10 dark:border-white/5"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
```

### Example 2: CaseStudySectionHeader Component

```tsx
'use client'

import { cn } from '@/lib/utils'

interface CaseStudySectionHeaderProps {
  label?: string
  heading: string
  className?: string
}

export function CaseStudySectionHeader({
  label,
  heading,
  className
}: CaseStudySectionHeaderProps) {
  return (
    <header className={cn("mb-8", className)}>
      {/* Section Label */}
      {label && (
        <div className="text-xs font-bold uppercase tracking-widest text-purple-300 dark:text-purple-200 mb-8">
          {label}
        </div>
      )}

      {/* Heading with Underline */}
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-8 relative pb-4">
        {heading}
        <span className="absolute bottom-0 left-0 w-16 h-px bg-gradient-to-r from-purple-400 dark:from-purple-300 to-transparent" />
      </h2>
    </header>
  )
}
```

### Example 3: CaseStudyMetrics Component

```tsx
'use client'

import { cn } from '@/lib/utils'
import { CaseStudySectionHeader } from './CaseStudySectionHeader'

interface Metric {
  label: string
  value: string
  description?: string
}

interface CaseStudyMetricsProps {
  metrics: Metric[]
  heading?: string
  label?: string
  className?: string
}

export function CaseStudyMetrics({
  metrics,
  heading = "Quantifiable Impact",
  label = "Key Metrics",
  className
}: CaseStudyMetricsProps) {
  if (!metrics || metrics.length === 0) return null

  return (
    <section className={cn("py-32", className)}>
      <div className="container max-w-[1200px] mx-auto px-8">
        <CaseStudySectionHeader label={label} heading={heading} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="rounded-3xl px-8 py-12 text-center bg-white/3 dark:bg-white/5 border border-white/10 dark:border-white/5"
            >
              {/* Metric Value */}
              <div className="text-6xl font-bold mb-4 leading-none bg-gradient-to-br from-purple-400 dark:from-purple-300 to-purple-300 dark:to-purple-200 bg-clip-text text-transparent">
                {metric.value}
              </div>

              {/* Metric Label */}
              <div className="text-lg font-medium mb-2 text-foreground">
                {metric.label}
              </div>

              {/* Metric Description */}
              {metric.description && (
                <div className="text-sm text-muted-foreground">
                  {metric.description}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

---

## File Size Comparison

### Before Refactor
- **Main page:** 428 lines (all-in-one)
- **Total:** 428 lines

### After Refactor
- **Main page:** ~200 lines (orchestration)
- **CaseStudyHero:** ~50 lines
- **CaseStudySectionHeader:** ~25 lines
- **CaseStudySection:** ~20 lines
- **CaseStudyAnnotation:** ~25 lines
- **CaseStudyMetrics:** ~45 lines
- **CaseStudyAchievements:** ~40 lines
- **CaseStudyCTA:** ~15 lines
- **Total:** ~420 lines (split across 8 files)

**Benefits:**
- Better organization
- Reusable components
- Easier to test
- Easier to maintain
- Clear separation of concerns

---

## Risk Assessment

### Low Risk ✅

- **Component extraction:** Well-defined boundaries
- **Color conversion:** Clear mapping established
- **Existing tests:** Should still pass (selectors may need updates)

### Medium Risk ⚠️

- **Visual regressions:** Need careful testing
- **PortableText styling:** Need to verify rich text still looks good
- **Responsive behavior:** Need to test all breakpoints

### Mitigation Strategies

1. **Work incrementally:** Extract one component at a time
2. **Test frequently:** Check browser after each extraction
3. **Use git branches:** Easy to revert if needed
4. **Screenshot comparison:** Before/after visual testing
5. **Keep inline styles initially:** Convert after extraction works

---

## Timeline

### Conservative Estimate: 3 hours

| Phase | Task | Time |
|-------|------|------|
| 1 | Setup & Preparation | 15 min |
| 2a | Extract CTA component | 5 min |
| 2b | Extract SectionHeader component | 10 min |
| 2c | Extract Annotation component | 10 min |
| 2d | Extract Achievements component | 15 min |
| 2e | Extract Metrics component | 15 min |
| 2f | Extract Section wrapper | 10 min |
| 2g | Extract Hero component | 20 min |
| 3 | Update main page | 30 min |
| 4 | Fix PortableText | 10 min |
| 5 | Fix background & atmosphere | 10 min |
| 6 | Testing & refinement | 15 min |
| **Total** | | **2h 45min** |

### Optimistic Estimate: 2 hours
- If everything goes smoothly
- Minimal debugging needed
- No visual regressions

### Pessimistic Estimate: 4 hours
- Complex debugging
- Visual regressions require fixes
- TypeScript issues
- Need to adjust component APIs

---

## Success Criteria

### Must Have ✅

1. ✅ **Zero inline styles** in main page
2. ✅ **Full dark mode support** with proper color variants
3. ✅ **Identical visual appearance** in light mode
4. ✅ **No TypeScript errors** (`npm run build` passes)
5. ✅ **No broken links or functionality**

### Should Have 🎯

1. 🎯 **Clean component architecture** with clear responsibilities
2. 🎯 **Reusable components** that could be used elsewhere
3. 🎯 **Good dark mode appearance** (not just functional)
4. 🎯 **Improved accessibility** (better than before)

### Nice to Have 💫

1. 💫 **Component tests** for new components
2. 💫 **Storybook stories** for component showcase
3. 💫 **Better TypeScript types** than current `any`
4. 💫 **Documentation** for each component

---

## Post-Refactor Tasks

1. **Update visual regression baselines**
   ```bash
   npm run test:visual:update
   ```

2. **Document new components** in CLAUDE.md

3. **Create Storybook stories** (optional)

4. **Write component tests** (optional but recommended)

5. **Update any related documentation**

---

## Alternative Approaches

### Option A: Minimal Refactor (Quick Fix)
**Time:** 1 hour
**Approach:** Just convert inline styles to Tailwind, don't extract components
**Pros:** Fast, low risk
**Cons:** Still messy, hard to maintain

### Option B: Full Refactor (Recommended)
**Time:** 2-3 hours
**Approach:** Extract components + convert styles
**Pros:** Clean architecture, maintainable, reusable
**Cons:** More time, more complexity

### Option C: Hybrid Approach
**Time:** 1.5 hours
**Approach:** Extract 2-3 key components, convert rest inline
**Pros:** Balance of speed and quality
**Cons:** Inconsistent approach

**Recommendation:** **Option B (Full Refactor)** - Case studies are key portfolio pieces and deserve proper treatment.

---

## Questions to Resolve

1. **Component location:** Should detail components go in `/case-studies/detail/` or separate folder?
2. **Design system tokens:** Should we add more tokens to Tailwind config for case study-specific colors?
3. **Background gradient:** Keep hardcoded `#0a0a14` and `#050510` or use `bg-background`?
4. **Blur orbs:** Extract to component or keep inline?
5. **Testing priority:** Visual regression only, or add component tests too?

---

## Next Steps

1. **Get approval** for this plan
2. **Create git branch** for refactoring
3. **Start with Phase 1** (setup)
4. **Work through phases sequentially**
5. **Test frequently** throughout
6. **Submit for review** when complete

---

## Conclusion

This refactor will transform the case study detail page from a brittle, inline-style-heavy component into a clean, maintainable, dark-mode-ready architecture. The investment of 2-3 hours will pay dividends in:

- **Easier maintenance** going forward
- **Better dark mode experience** for users
- **Reusable components** for future case studies
- **Improved code quality** and developer experience

The case studies are a critical part of the portfolio, and this proper refactor will ensure they look professional in both light and dark modes while setting up a solid foundation for future work.
