# Phase 4c: Case Studies Dark Mode Audit

**Date:** November 1, 2025
**Status:** In Progress
**Priority:** HIGH - Case study detail page has 40+ inline styles

## Overview

The case study detail page (`/src/app/(public)/case-studies/[slug]/page.tsx`) is using extensive **inline styles** with hardcoded HSL color values. This needs significant refactoring to:
1. Convert inline styles to Tailwind classes
2. Add dark mode variants for all purple colors
3. Replace hardcoded backgrounds with design system tokens

## Critical Issues

### 1. Case Study Detail Page (page.tsx)
**Status:** 🔴 **CRITICAL** - 40+ inline styles, ZERO dark mode support

This is the biggest problem. The entire page uses inline `style={}` objects with hardcoded HSL values.

#### Inline Styles to Convert:

| Line | Element | Current Inline Style | Needs Tailwind |
|------|---------|---------------------|----------------|
| 147-149 | PortableText strong | `color: 'hsl(280, 100%, 80%)'` | `text-purple-300 dark:text-purple-200` |
| 161 | Page background | `bg-gradient-to-b from-[#0a0a14] to-[#050510]` | `bg-background` |
| 171-174 | Blur orb 1 | Inline style object | Tailwind utilities |
| 177-188 | Blur orb 2 | Inline style object | Tailwind utilities |
| 198-202 | Category badge | Background, border, color all inline | Tailwind with dark: variants |
| 210-217 | Hero title gradient | Gradient with HSL values | Tailwind gradient |
| 226-230 | Hero subtitle | Font size & color inline | Tailwind classes |
| 242-245 | Tech tags | Background & border inline | Tailwind with dark: variants |
| 257 | Section background | `rgba(199, 128, 245, 0.03)` | `bg-purple-500/5 dark:bg-purple-400/5` |
| 263 | Section label | `color: 'hsl(280, 100%, 80%)'` | `text-purple-300 dark:text-purple-200` |
| 270 | Heading underline | Gradient inline | Tailwind gradient |
| 284 | Annotation box | Background, border, color inline | Tailwind with dark: variants |
| 286-288 | Annotation title | Color inline | Tailwind classes |
| 304 | Screenshot container | Background & border inline | Tailwind classes |
| 308-309 | Screenshot placeholder | Gradient & color inline | Tailwind gradient |
| 314 | Screenshot caption | Color inline | `text-muted-foreground` |
| 329 | Large screenshot | Background & border inline | Tailwind classes |
| 333-334 | Large placeholder | Gradient & color inline | Tailwind gradient |
| 339 | Large caption | Color inline | `text-muted-foreground` |
| 355 | Metrics section bg | `rgba(199, 128, 245, 0.03)` | `bg-purple-500/5 dark:bg-purple-400/5` |
| 357 | Metrics label | `color: 'hsl(280, 100%, 80%)'` | `text-purple-300 dark:text-purple-200` |
| 363 | Metrics underline | Gradient inline | Tailwind gradient |
| 368 | Metric card | Background & border inline | Tailwind with dark: variants |
| 369 | Metric value | Gradient inline | Tailwind gradient |
| 376 | Metric description | Color inline | `text-muted-foreground` |
| 391 | Achievements label | Color inline | `text-purple-300 dark:text-purple-200` |
| 397 | Achievements underline | Gradient inline | Tailwind gradient |
| 403 | Achievement bullet | Background inline | `bg-purple-400 dark:bg-purple-300` |
| 404 | Achievement text | Color inline | `text-foreground` |
| 419 | CTA button | Gradient inline | Tailwind gradient with dark: variants |

**Total:** 30+ inline styles that need conversion

### 2. FeaturedCaseStudies.tsx
**Status:** 🟡 Medium Priority - 4 instances

| Line | Element | Current | Needs Dark Variant |
|------|---------|---------|-------------------|
| 80 | Focus ring | `ring-purple-400` | `dark:ring-purple-300` |
| 94 | Accent bar gradient | `from-purple-400 to-purple-300` | `dark:from-purple-300 dark:to-purple-200` |
| 102 | Category label | `text-purple-400` | `dark:text-purple-300` |
| 108 | Title gradient | `from-purple-400 to-white` | `dark:from-purple-300 dark:to-white` |

### 3. SectionSeparator.tsx
**Status:** 🟢 Easy Fix - 1 instance

| Line | Element | Current | Needs Dark Variant |
|------|---------|---------|-------------------|
| 3 | Gradient line | `via-purple-500/30` | `dark:via-purple-400/30` |

### 4. CaseStudiesHero.tsx
**Status:** ✅ Already Fixed (Phase 4a)

## Recommended Approach

### Phase 1: Fix Simple Components First
1. ✅ SectionSeparator.tsx (1 line)
2. ✅ FeaturedCaseStudies.tsx (4 instances)

### Phase 2: Tackle Case Study Detail Page
**This is a BIG refactoring job** - the entire page needs to be rewritten.

**Strategy:**
1. Create a new component-based structure
2. Extract reusable components (HeroSection, MetricsGrid, AchievementsList, etc.)
3. Convert all inline styles to Tailwind
4. Add dark mode variants throughout
5. Use design system tokens (`bg-background`, `text-foreground`, etc.)

**Example conversion:**

```tsx
// BEFORE (inline styles)
<div
  className="inline-block px-6 py-2 mb-8"
  style={{
    background: 'rgba(199, 128, 245, 0.1)',
    border: '1px solid rgba(199, 128, 245, 0.3)',
    color: 'hsl(280, 100%, 80%)',
  }}
>
  {category}
</div>

// AFTER (Tailwind with dark mode)
<div className="inline-block px-6 py-2 mb-8 rounded-full bg-purple-500/10 dark:bg-purple-400/10 border border-purple-500/30 dark:border-purple-400/30 text-purple-300 dark:text-purple-200 text-xs font-semibold uppercase tracking-widest">
  {category}
</div>
```

## Color Mapping for Case Studies

Following established pattern:

```
INLINE STYLE                    TAILWIND
hsl(280, 100%, 80%)       →     text-purple-300 dark:text-purple-200
rgba(199, 128, 245, 0.1)  →     bg-purple-500/10 dark:bg-purple-400/10
rgba(199, 128, 245, 0.3)  →     border-purple-500/30 dark:border-purple-400/30
rgba(199, 128, 245, 0.03) →     bg-purple-500/5 dark:bg-purple-400/5

Gradients:
linear-gradient(135deg, hsl(280, 100%, 80%), hsl(0, 0%, 98%))
  → bg-gradient-to-br from-purple-300 dark:from-purple-200 to-white

Backgrounds:
from-[#0a0a14] to-[#050510]  →  bg-background
```

## Timeline Estimate

- Simple components (SectionSeparator, FeaturedCaseStudies): **15 minutes**
- Case study detail page refactor: **2-3 hours** (due to extensive inline styles)
  - Extract components: 45 min
  - Convert inline styles: 60 min
  - Add dark mode variants: 30 min
  - Testing: 15 min

**Total:** 2.5-3.5 hours

## User Impact

**HIGH** - Case study detail pages are key portfolio pieces. They currently:
- Have NO dark mode support
- Use brittle inline styles that are hard to maintain
- Don't follow the design system

This refactor will:
- Enable dark mode for all case studies
- Standardize styling across the site
- Make the code more maintainable
- Improve visual consistency

## Next Steps

1. Fix SectionSeparator (trivial)
2. Fix FeaturedCaseStudies (easy)
3. Decide on approach for detail page:
   - **Option A:** Quick fix - convert inline styles to Tailwind in place
   - **Option B:** Proper refactor - extract components and restructure

**Recommendation:** Option B (proper refactor) - this is important portfolio content and deserves proper treatment.

## Related Documentation

- `/docs/css-phase4a-navigation-dark-mode-complete.md`
- `/docs/css-phase4b-ai-showcase-complete.md`
- `/docs/css-architecture-analysis-2025-11-01.md`
