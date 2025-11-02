# Phase 4b: AI Showcase Dark Mode Audit

**Date:** November 1, 2025
**Status:** In Progress
**Components:** 11 files

## Overview

All AI Showcase detail page components have hardcoded purple colors with **ZERO dark mode variants**. This audit documents all instances that need dark mode support using our established color mapping strategy.

## Color Mapping Strategy

Following the established pattern from Phase 4a:

```
LIGHT MODE          DARK MODE
text-purple-600  →  text-purple-400
text-purple-400  →  text-purple-300
text-purple-300  →  text-purple-200
text-purple-200  →  text-purple-100

bg-purple-500    →  bg-purple-400
bg-purple-400    →  bg-purple-300

border-purple-500 →  border-purple-400
border-purple-400 →  border-purple-300
border-purple-300 →  border-purple-200
```

## Components Audit

### 1. AIShowcasePageClient.tsx
**Path:** `/src/app/(public)/ai-showcase/[slug]/AIShowcasePageClient.tsx`
**Instances:** 1

| Line | Element | Current | Needs Dark Variant |
|------|---------|---------|-------------------|
| 53 | PortableText prose | `prose-headings:text-purple-200` | `dark:prose-headings:text-purple-100` |

### 2. HeroSlide.tsx
**Path:** `/src/components/ai-showcase/HeroSlide.tsx`
**Instances:** 5

| Line | Element | Current | Needs Dark Variant |
|------|---------|---------|-------------------|
| 33 | Background gradient | `via-purple-950/20` | `dark:via-purple-900/20` |
| 43 | Badge bg | `bg-purple-500/10` | `dark:bg-purple-400/10` |
| 43 | Badge border | `border-purple-500/20` | `dark:border-purple-400/20` |
| 43 | Badge text | `text-purple-300` | `dark:text-purple-200` |
| 56 | Subtitle | `text-purple-200` | `dark:text-purple-100` |

### 3. ContentSlide.tsx
**Path:** `/src/components/ai-showcase/ContentSlide.tsx`
**Instances:** 4

| Line | Element | Current | Needs Dark Variant |
|------|---------|---------|-------------------|
| 29 | Default bg gradient | `via-purple-950/10` | `dark:via-purple-900/10` |
| 30 | Dark bg gradient | `via-purple-900/10` | `dark:via-purple-800/10` |
| 51 | Section label | `text-purple-400` | `dark:text-purple-300` |

**Note:** Background gradients use hardcoded hex values `#0a0a14` and `#050510` - these should remain as-is for now as they're intentional dark backgrounds.

### 4. MetricsSlide.tsx
**Path:** `/src/components/ai-showcase/MetricsSlide.tsx`
**Instances:** 6

| Line | Element | Current | Needs Dark Variant |
|------|---------|---------|-------------------|
| 35 | Section bg | `via-purple-950/20` | `dark:via-purple-900/20` |
| 54 | Card bg start | `from-purple-500/10` | `dark:from-purple-400/10` |
| 54 | Card bg end | `to-purple-900/5` | `dark:to-purple-800/5` |
| 55 | Card border | `border-purple-500/20` | `dark:border-purple-400/20` |
| 56 | Hover border | `hover:border-purple-500/40` | `dark:hover:border-purple-400/40` |
| 61 | Metric value | `text-purple-300` | `dark:text-purple-200` |

### 5. HorizontalTimelineSlide.tsx
**Path:** `/src/components/ai-showcase/HorizontalTimelineSlide.tsx`
**Instances:** 3

| Line | Element | Current | Needs Dark Variant |
|------|---------|---------|-------------------|
| 31 | Section bg | `via-purple-950/15` | `dark:via-purple-900/15` |
| 41 | Section label | `text-purple-400` | `dark:text-purple-300` |

### 6. TimelinePhase.tsx
**Path:** `/src/components/ai-showcase/TimelinePhase.tsx`
**Instances:** 9

| Line | Element | Current | Needs Dark Variant |
|------|---------|---------|-------------------|
| 35 | Timeline node bg | `bg-purple-400` | `dark:bg-purple-300` |
| 35 | Timeline node ring | `ring-purple-400/20` | `dark:ring-purple-300/20` |
| 36 | Timeline line | `bg-purple-500/30` | `dark:bg-purple-400/30` |
| 43 | Card bg start | `from-purple-500/10` | `dark:from-purple-400/10` |
| 43 | Card bg end | `to-purple-900/5` | `dark:to-purple-800/5` |
| 44 | Card border | `border-purple-500/20` | `dark:border-purple-400/20` |
| 45 | Hover border | `hover:border-purple-500/40` | `dark:hover:border-purple-400/40` |
| 51 | Phase label | `text-purple-400` | `dark:text-purple-300` |

### 7. WorkflowStep.tsx
**Path:** `/src/components/ai-showcase/WorkflowStep.tsx`
**Instances:** 8

| Line | Element | Current | Needs Dark Variant |
|------|---------|---------|-------------------|
| 39 | Card bg start | `from-purple-500/10` | `dark:from-purple-400/10` |
| 39 | Card bg end | `to-purple-900/5` | `dark:to-purple-800/5` |
| 40 | Card border | `border-purple-500/20` | `dark:border-purple-400/20` |
| 41 | Hover border | `hover:border-purple-500/40` | `dark:hover:border-purple-400/40` |
| 52 | Step number bg | `bg-purple-500/20` | `dark:bg-purple-400/20` |
| 52 | Step number border | `border-purple-400` | `dark:border-purple-300` |
| 54 | Step number text | `text-purple-300` | `dark:text-purple-200` |

### 8. ProjectCard.tsx
**Path:** `/src/components/ai-showcase/ProjectCard.tsx`
**Instances:** 9

| Line | Element | Current | Needs Dark Variant |
|------|---------|---------|-------------------|
| 41 | Card bg start | `from-purple-500/10` | `dark:from-purple-400/10` |
| 41 | Card bg end | `to-purple-900/5` | `dark:to-purple-800/5` |
| 42 | Card border | `border-purple-500/20` | `dark:border-purple-400/20` |
| 43 | Hover border | `hover:border-purple-500/40` | `dark:hover:border-purple-400/40` |
| 57 | Project type | `text-purple-300` | `dark:text-purple-200` |
| 81 | Tech pill bg | `bg-purple-500/10` | `dark:bg-purple-400/10` |
| 81 | Tech pill border | `border-purple-500/30` | `dark:border-purple-400/30` |
| 82 | Tech pill text | `text-purple-200` | `dark:text-purple-100` |

### 9. QuoteBox.tsx
**Path:** `/src/components/ai-showcase/QuoteBox.tsx`
**Instances:** 5

| Line | Element | Current | Needs Dark Variant |
|------|---------|---------|-------------------|
| 21 | Box bg start | `from-purple-500/10` | `dark:from-purple-400/10` |
| 21 | Box bg end | `to-purple-900/5` | `dark:to-purple-800/5` |
| 22 | Left border | `border-purple-400` | `dark:border-purple-300` |
| 34 | Attribution | `text-purple-300` | `dark:text-purple-200` |

### 10. ComparisonGrid.tsx
**Path:** `/src/components/ai-showcase/ComparisonGrid.tsx`
**Instances:** 7

| Line | Element | Current | Needs Dark Variant |
|------|---------|---------|-------------------|
| 41 | Box bg start | `from-purple-500/10` | `dark:from-purple-400/10` |
| 41 | Box bg end | `to-purple-900/5` | `dark:to-purple-800/5` |
| 42 | Box border | `border-purple-500/20` | `dark:border-purple-400/20` |
| 43 | Hover border | `hover:border-purple-500/40` | `dark:hover:border-purple-400/40` |
| 49 | Label | `text-purple-400` | `dark:text-purple-300` |
| 59 | Stat | `text-purple-300` | `dark:text-purple-200` |

### 11. VisualGrid.tsx
**Path:** `/src/components/ai-showcase/VisualGrid.tsx`
**Instances:** 7

| Line | Element | Current | Needs Dark Variant |
|------|---------|---------|-------------------|
| 43 | Card bg start | `from-purple-500/10` | `dark:from-purple-400/10` |
| 43 | Card bg end | `to-purple-900/5` | `dark:to-purple-800/5` |
| 44 | Card border | `border-purple-500/20` | `dark:border-purple-400/20` |
| 45 | Hover border | `hover:border-purple-500/40` | `dark:hover:border-purple-400/40` |
| 50 | Placeholder bg | `bg-purple-950/20` | `dark:bg-purple-900/20` |
| 60 | Placeholder text | `text-purple-300/60` | `dark:text-purple-200/60` |

### 12. TechPills.tsx
**Path:** `/src/components/ai-showcase/TechPills.tsx`
**Instances:** 6

| Line | Element | Current | Needs Dark Variant |
|------|---------|---------|-------------------|
| 23 | Pill bg | `bg-purple-500/10` | `dark:bg-purple-400/10` |
| 23 | Pill border | `border-purple-500/30` | `dark:border-purple-400/30` |
| 24 | Pill text | `text-purple-200` | `dark:text-purple-100` |
| 25 | Hover bg | `hover:bg-purple-500/20` | `dark:hover:bg-purple-400/20` |
| 25 | Hover border | `hover:border-purple-500/50` | `dark:hover:border-purple-400/50` |

## Summary

- **Total Components:** 12
- **Total Instances:** 70+ hardcoded purple colors
- **Dark Mode Variants:** 0 (all need to be added)

## Implementation Strategy

1. Start with slide components (HeroSlide, ContentSlide, MetricsSlide, HorizontalTimelineSlide)
2. Then card components (TimelinePhase, WorkflowStep, ProjectCard)
3. Then content components (QuoteBox, ComparisonGrid, VisualGrid, TechPills)
4. Finally the main page client

## Pattern Examples

### Cards with gradient backgrounds:
```tsx
// Before
className="bg-gradient-to-br from-purple-500/10 to-purple-900/5"

// After
className="bg-gradient-to-br from-purple-500/10 to-purple-900/5 dark:from-purple-400/10 dark:to-purple-800/5"
```

### Borders with hover:
```tsx
// Before
className="border-purple-500/20 hover:border-purple-500/40"

// After
className="border-purple-500/20 dark:border-purple-400/20 hover:border-purple-500/40 dark:hover:border-purple-400/40"
```

### Text colors:
```tsx
// Before
className="text-purple-300"

// After
className="text-purple-300 dark:text-purple-200"
```

## Next Steps

1. ✅ Complete audit documentation
2. ⏳ Fix slide components (4 files)
3. ⏳ Fix card components (3 files)
4. ⏳ Fix content components (4 files)
5. ⏳ Fix main page client (1 file)
6. ⏳ Test on live site
7. ⏳ Update baselines if needed
