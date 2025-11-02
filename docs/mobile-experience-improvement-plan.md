# Mobile Experience Improvement Plan

**Date:** November 1, 2025
**Author:** Claude Code
**Context:** Next.js 15 portfolio site with Tailwind CSS, responsive breakpoint at 768px (md:)

---

## Executive Summary

This plan addresses mobile UX improvements for Michael Evans' portfolio website. The site currently has basic responsive support but lacks mobile-specific optimizations for touch interactions, spacing, typography, and performance. The analysis identified **37 specific improvements** across 10 areas, prioritized by impact and complexity.

**Key Findings:**
- Navigation works on mobile but lacks touch-optimized tap targets (current: 24px icons)
- Horizontal scroll components need touch indicators and better scroll physics
- Text sizing is responsive but line heights could improve readability
- Spacing needs mobile-specific adjustments (excessive padding on small screens)
- No apparent performance issues, but image optimization could be enhanced

**Estimated Total Effort:** 3-5 days (spread across 4 phases)

---

## Current State Analysis

### Breakpoint Strategy
- **Primary breakpoint:** `md:` at 768px (Tailwind default)
- **Desktop detection:** `useIsDesktop()` hook using `(min-width: 768px)`
- **Mobile-first approach:** Base styles are mobile, desktop overrides with `md:`

### Mobile Layout Behavior
1. **Navigation Panel:** Bottom-fixed on mobile (`bottom-0 left-0 w-full`)
2. **Chat Section:** Expandable overlay from bottom (50vh height when expanded)
3. **Main Content:** 200px bottom padding on mobile to accommodate fixed navigation
4. **Horizontal Scrolls:** Snap scrolling enabled with `overflow-x-auto snap-x`

### Components Analyzed
- Navigation: `NavigationPanel.tsx`, `NavigationMenu.tsx`, `ChatSection.tsx`
- Pages: `page.tsx` (home), `case-studies/page.tsx`
- Case Studies: `FeaturedCaseStudies.tsx`, `CaseStudiesHero.tsx`
- AI Showcase: `HeroSlide.tsx`, `HorizontalTimelineSlide.tsx`, `ProjectCard.tsx`, etc.
- Utilities: `useMediaQuery.ts` hook

---

## Priority Framework

**P0 (Critical):** Accessibility blockers, broken interactions
**P1 (High):** Significant UX issues affecting most users
**P2 (Medium):** Nice-to-have improvements, polish
**P3 (Low):** Future enhancements, edge cases

---

## Improvement Areas

### 1. Touch Targets and Tap Areas

#### Current Issues
- Navigation icons: 16px (w-4 h-4) - below 44x44px accessibility minimum
- Chat chevron toggle: 16px icon in small button
- Suggested prompt buttons: Adequate padding but could be larger
- Theme toggle: Unknown size (in separate component)

#### Improvements

| Task | Priority | Component | Complexity |
|------|----------|-----------|------------|
| Increase navigation icon touch targets to 44x44px minimum | P0 | `NavigationMenu.tsx` | Low |
| Increase chat expand/collapse button to 44x44px | P0 | `ChatSection.tsx` | Low |
| Add larger tap targets for case study cards on mobile | P1 | `FeaturedCaseStudies.tsx` | Low |
| Increase theme toggle size on mobile | P1 | `ui/theme-toggle.tsx` | Low |
| Add visible tap/press states for all interactive elements | P1 | Global CSS | Medium |

**Implementation:**
```tsx
// NavigationMenu.tsx - increase icon container size
<Link className="flex items-center gap-4 px-4 py-3">
  <Icon className="w-6 h-6" /> {/* was w-4 h-4 */}
  {isExpanded && <span className="hidden md:inline">{item.label}</span>}
</Link>

// Add mobile-specific tap target sizing
className={cn(
  "p-2 md:p-1.5",  // Larger padding on mobile
  "touch-manipulation" // CSS property for better touch
)}
```

**Testing Strategy:**
- Test with physical devices (iPhone, Android)
- Use Chrome DevTools mobile emulation
- Verify 44x44px minimum with browser inspector

---

### 2. Mobile Navigation UX

#### Current Issues
- Bottom navigation blocks content (200px padding applied but feels excessive)
- Horizontal layout works but icons could use labels
- No haptic feedback or animation feedback on tap
- Chat overlay takes 50vh - may be too much on small phones

#### Improvements

| Task | Priority | Component | Complexity |
|------|----------|-----------|------------|
| Optimize bottom padding (test 160px instead of 200px) | P1 | `(public)/layout.tsx` | Low |
| Add brief labels below icons on mobile nav | P2 | `NavigationMenu.tsx` | Low |
| Reduce chat expanded height to 45vh on small screens | P1 | `ChatSection.tsx` | Low |
| Add subtle scale animation on tap (active:scale-95) | P2 | `NavigationMenu.tsx` | Low |
| Consider sticky chat header when scrolling messages | P2 | `ChatSection.tsx` | Medium |

**Implementation:**
```tsx
// ChatSection.tsx - responsive height
const getHeightClasses = () => {
  if (!isDesktop) {
    return chatExpanded ? 'h-[45vh] sm:h-[50vh]' : 'h-auto';
  }
  return chatExpanded ? 'md:h-full' : 'md:h-[34%]';
};

// NavigationMenu.tsx - add labels
<Link className="flex flex-col md:flex-row items-center gap-1 md:gap-4">
  <Icon className="w-6 h-6" />
  <span className="text-xs md:hidden">{item.label}</span>
  {isExpanded && <span className="hidden md:inline text-lg">{item.label}</span>}
</Link>
```

---

### 3. Text Readability

#### Current Issues
- Hero text is very large on mobile (5xl = 48px) - may overflow on small screens
- Line heights are default - could be optimized for mobile reading
- Some long case study titles may break awkwardly

#### Improvements

| Task | Priority | Component | Complexity |
|------|----------|-----------|------------|
| Adjust hero title sizing: 4xl mobile → 5xl tablet → 7xl desktop | P1 | `page.tsx`, `CaseStudiesHero.tsx` | Low |
| Increase line heights for body text on mobile (1.6 → 1.7) | P2 | `globals.css` | Low |
| Add word-break utilities for long titles | P2 | `FeaturedCaseStudies.tsx` | Low |
| Ensure minimum 16px font size for body text | P1 | Audit all components | Medium |
| Reduce chat message font to 14px on mobile | P2 | `ChatSection.tsx` | Low |

**Implementation:**
```tsx
// page.tsx - adjust hero sizing
<h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-light leading-tight">
  <span className="text-gradient">Michael Evans</span> {tagline}
</h1>

// globals.css - mobile-optimized line heights
@layer base {
  @media (max-width: 767px) {
    body {
      line-height: 1.7;
    }
    h1, h2, h3, h4, h5, h6 {
      line-height: 1.3;
    }
  }
}
```

---

### 4. Viewport Usage (Spacing & Margins)

#### Current Issues
- Horizontal padding inconsistent: Some use `px-6`, others `px-8 md:px-16`
- Negative margins (`-mx-6 md:mx-0`) used to break out of containers
- Hero section uses min-h-[85vh] which may be too tall on mobile
- Some components have excessive top/bottom padding on mobile

#### Improvements

| Task | Priority | Component | Complexity |
|------|----------|-----------|------------|
| Standardize horizontal padding: `px-4 sm:px-6 md:px-8` | P1 | Multiple components | Medium |
| Reduce hero min-height to 70vh on mobile | P1 | `page.tsx` | Low |
| Remove negative margin hack, use container properly | P2 | `page.tsx`, `case-studies/page.tsx` | Medium |
| Reduce section padding: py-16 mobile → py-20 desktop | P1 | Multiple components | Low |
| Add safe-area-inset for notched devices | P2 | `globals.css` | Low |

**Implementation:**
```tsx
// Standardized spacing system
<section className="px-4 sm:px-6 md:px-8 lg:px-12 py-12 md:py-20">

// Hero height adjustment
<section className="min-h-[70vh] sm:min-h-[80vh] md:min-h-[85vh]">

// Safe area insets (globals.css)
@supports (padding: max(0px)) {
  body {
    padding-left: max(0px, env(safe-area-inset-left));
    padding-right: max(0px, env(safe-area-inset-right));
  }
}
```

---

### 5. Image Optimization for Mobile

#### Current Issues
- Images use Next.js Image component (good!)
- No explicit `sizes` prop - defaults may not be optimal
- No priority hints for above-fold images on mobile
- Screenshot component uses fixed aspect ratios that may not suit mobile

#### Improvements

| Task | Priority | Component | Complexity |
|------|----------|-----------|------------|
| Add responsive `sizes` prop to all images | P1 | `CaseStudyScreenshots.tsx`, etc. | Medium |
| Add `priority` prop to hero images | P1 | `CaseStudiesHero.tsx` | Low |
| Use `loading="lazy"` for below-fold images | P1 | All image components | Low |
| Adjust screenshot aspect ratios for mobile (16/10 → 4/3) | P2 | `CaseStudyScreenshots.tsx` | Low |
| Add blur placeholders for better perceived performance | P2 | Image components | Medium |

**Implementation:**
```tsx
// CaseStudyScreenshots.tsx
<Image
  src={imageUrl}
  alt={screenshot.caption || ''}
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  loading={index < 2 ? "eager" : "lazy"}
  priority={index === 0}
  className="object-cover"
/>

// Responsive aspect ratios
<div className="aspect-[4/3] md:aspect-[16/10]">
```

---

### 6. Performance on Mobile Devices

#### Current Issues
- Build output shows no obvious performance issues
- Framer Motion used for animations (could be heavy on older devices)
- Many components client-side ("use client") - bundle size impact
- No apparent code splitting beyond Next.js defaults

#### Improvements

| Task | Priority | Component | Complexity |
|------|----------|-----------|------------|
| Implement route-based code splitting for admin pages | P2 | `app/(admin)/**` | Low |
| Add `will-change` CSS for animated elements | P2 | `globals.css` | Low |
| Defer loading of chat components until interaction | P2 | `ChatSection.tsx` | High |
| Optimize bundle: analyze with `@next/bundle-analyzer` | P1 | Build config | Low |
| Add performance monitoring (Web Vitals) | P3 | `app/layout.tsx` | Medium |

**Implementation:**
```tsx
// Lazy load chat
const ChatSection = dynamic(() => import('./ChatSection'), {
  loading: () => <div className="h-[34%] bg-chat" />,
  ssr: false
});

// globals.css - optimize animations
.transition-smooth {
  will-change: transform, opacity;
}
```

---

### 7. Horizontal Scrolling Issues

#### Current Issues
- Horizontal scroll works with snap points (good!)
- No visual indicators that content is scrollable
- Scroll physics could be smoother
- Cards have min-width but may overflow on very small screens

#### Improvements

| Task | Priority | Component | Complexity |
|------|----------|-----------|------------|
| Add scroll indicators (dots or fade-out gradient) | P1 | `HorizontalTimelineSlide.tsx` | Medium |
| Reduce min-width on small phones (350px → 280px) | P1 | `ProjectCard.tsx`, `WorkflowStep.tsx`, etc. | Low |
| Add touch swipe momentum (CSS scroll-behavior) | P2 | Already implemented | N/A |
| Show partial next card to indicate scrollability | P2 | `HorizontalTimelineSlide.tsx` | Low |
| Add "Swipe to see more" hint on first visit | P3 | `HorizontalTimelineSlide.tsx` | Medium |

**Implementation:**
```tsx
// Reduce min-width for very small screens
className="min-w-[280px] sm:min-w-[350px] md:min-w-[400px] lg:min-w-[450px]"

// Add fade-out gradient indicator
<div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent pointer-events-none md:hidden" />

// Padding to show partial next card
<div className="flex gap-8 h-full pb-8 pr-8">
  {/* Partial right padding shows next card edge */}
```

---

### 8. Interactive Element Spacing

#### Current Issues
- Chat input has adequate padding
- Suggested prompts well-spaced (px-4 py-3)
- Case study cards have good vertical spacing (gap-16)
- Navigation items slightly tight on mobile

#### Improvements

| Task | Priority | Component | Complexity |
|------|----------|-----------|------------|
| Increase navigation item vertical spacing on mobile | P2 | `NavigationMenu.tsx` | Low |
| Add more breathing room in chat messages | P2 | `ChatSection.tsx` | Low |
| Increase gap between case study cards (16 → 20) | P3 | `FeaturedCaseStudies.tsx` | Low |
| Add horizontal padding to chat input on mobile | P2 | `ChatSection.tsx` | Low |

**Implementation:**
```tsx
// NavigationMenu.tsx
<nav className="flex flex-row md:flex-col gap-1 md:gap-8">

// ChatSection.tsx - message spacing
<div className="overflow-y-auto px-6 py-6 md:px-4 md:py-4">

// FeaturedCaseStudies.tsx
<div className="flex flex-col gap-20 md:gap-16">
```

---

### 9. Forms and Input Fields

#### Current Issues
- Only form is chat input (well-implemented)
- Input has good focus states
- Placeholder text readable
- No auto-zoom issues (16px font size prevents iOS zoom)

#### Improvements

| Task | Priority | Component | Complexity |
|------|----------|-----------|------------|
| Add autocomplete="off" to chat input (prevent suggestions) | P3 | `ChatSection.tsx` | Low |
| Ensure input type="text" (not "search" which adds cancel button) | P3 | `ChatSection.tsx` | Low |
| Add inputMode="text" for better mobile keyboards | P2 | `ChatSection.tsx` | Low |
| Test iOS keyboard covers input (adjust scroll behavior) | P1 | `ChatSection.tsx` | Medium |

**Implementation:**
```tsx
<input
  type="text"
  inputMode="text"
  autoComplete="off"
  autoCorrect="off"
  autoCapitalize="sentences"
  // Ensures 16px minimum to prevent iOS auto-zoom
  className="text-base"
/>
```

---

### 10. Mobile-Specific Animations

#### Current Issues
- Animations use CSS transitions and Tailwind
- Respect `prefers-reduced-motion` (good!)
- Framer Motion used in navigation (could be heavy)
- No progressive enhancement for animations

#### Improvements

| Task | Priority | Component | Complexity |
|------|----------|-----------|------------|
| Simplify/remove animations on slower devices | P2 | Detect performance | High |
| Reduce animation duration on mobile (300ms → 200ms) | P2 | `tailwind.config.ts` | Low |
| Replace Framer Motion with CSS in NavigationMenu | P3 | `NavigationMenu.tsx` | Medium |
| Add loading skeleton states for better perceived perf | P2 | Multiple components | Medium |

**Implementation:**
```tsx
// tailwind.config.ts - mobile-specific durations
transitionDuration: {
  'mobile': '200ms',
  'desktop': '300ms',
}

// Use in components
className="transition-all duration-mobile md:duration-desktop"
```

---

## Implementation Phases

### Phase 1: Critical Fixes (P0 + High-Impact P1)
**Effort:** 1 day
**Focus:** Accessibility and major UX issues

- [ ] Increase all touch targets to 44x44px minimum
- [ ] Adjust hero title sizing (4xl → 5xl → 7xl)
- [ ] Reduce hero min-height to 70vh on mobile
- [ ] Standardize horizontal padding across components
- [ ] Add `sizes` prop to all images
- [ ] Optimize bottom nav padding (200px → 160px)
- [ ] Reduce chat height (50vh → 45vh on small screens)
- [ ] Add scroll indicators to horizontal scrolls
- [ ] Reduce horizontal card min-widths (350px → 280px)

**Testing:**
- Test on iPhone SE (375px) and iPhone 14 Pro Max (430px)
- Test on Android device (360px common width)
- Verify all interactive elements meet 44x44px

### Phase 2: Mobile Polish (Remaining P1 + High-Value P2)
**Effort:** 1-2 days
**Focus:** UX improvements and visual refinement

- [ ] Add tap/press states for all interactive elements
- [ ] Add labels below navigation icons
- [ ] Increase line heights for mobile readability
- [ ] Ensure 16px minimum body text size
- [ ] Add `priority` to hero images
- [ ] Implement lazy loading for below-fold images
- [ ] Add safe-area-inset support
- [ ] Optimize bundle with analyzer
- [ ] Add breathing room in chat messages
- [ ] Test iOS keyboard behavior with chat input

**Testing:**
- Visual regression tests on mobile viewports
- Test with slower network (throttle to 3G)
- Verify keyboard doesn't obscure input

### Phase 3: Performance & Advanced Features (P2)
**Effort:** 1 day
**Focus:** Performance optimization and nice-to-haves

- [ ] Add blur placeholders to images
- [ ] Defer chat component loading
- [ ] Add `will-change` CSS for animations
- [ ] Implement scroll indicator dots/gradients
- [ ] Show partial next card in horizontal scrolls
- [ ] Add word-break utilities for long titles
- [ ] Adjust screenshot aspect ratios (4/3 mobile)
- [ ] Add mobile-specific animation durations
- [ ] Increase interactive element spacing

**Testing:**
- Lighthouse mobile scores (target: 90+ performance)
- Test on iPhone 8 (older device)
- Measure Time to Interactive (TTI)

### Phase 4: Future Enhancements (P3)
**Effort:** 1 day
**Focus:** Edge cases and experimental features

- [ ] Add "Swipe to see more" hints
- [ ] Performance-based animation detection
- [ ] Replace Framer Motion with CSS
- [ ] Add loading skeleton states
- [ ] Web Vitals monitoring
- [ ] Advanced input attributes (autocomplete, etc.)

**Testing:**
- A/B test new features
- Monitor real user metrics

---

## Testing Strategy

### Device Coverage
**Minimum Test Devices:**
- iPhone SE (375px width) - small screen baseline
- iPhone 14 Pro (393px) - notch/dynamic island
- Android Pixel 5 (393px) - standard Android
- iPad Mini (768px) - tablet breakpoint
- Large Android phone (430px+)

### Testing Checklist
- [ ] All touch targets meet 44x44px minimum
- [ ] No horizontal scroll on any page (except intentional)
- [ ] Text is readable without zooming
- [ ] Images load quickly and at appropriate sizes
- [ ] Navigation doesn't block content
- [ ] Chat overlay works smoothly
- [ ] Forms don't trigger auto-zoom
- [ ] Animations are smooth (60fps)
- [ ] Works in portrait and landscape
- [ ] Safe areas respected on notched devices

### Automated Testing
```bash
# Visual regression (update baselines for mobile)
npm run test:visual -- --update

# Lighthouse mobile audit
npx lighthouse https://localhost:3000 --preset=mobile --view

# Playwright mobile tests
npm run test:e2e -- --project=mobile
```

### Manual Testing Script
1. Open site on mobile device
2. Test navigation: tap all 4 nav items
3. Open chat: verify 45vh height, test input
4. Scroll homepage: verify smooth scrolling
5. Test case studies: tap to expand, tap to navigate
6. Test horizontal scrolls: swipe, verify snap points
7. Test theme toggle: verify contrast
8. Rotate device: verify landscape mode
9. Test with slow network (throttle)
10. Check console for errors

---

## Success Metrics

### Performance Targets
- **Lighthouse Mobile Score:** 90+ (currently unknown, measure first)
- **Time to Interactive:** < 3.5s on 4G
- **Largest Contentful Paint:** < 2.5s
- **Cumulative Layout Shift:** < 0.1
- **First Input Delay:** < 100ms

### UX Targets
- **Touch Target Compliance:** 100% of interactive elements meet 44x44px
- **Text Readability:** No text smaller than 14px (16px for body)
- **Viewport Fit:** No horizontal scroll on pages (except intentional)
- **Image Load Time:** Hero images < 1s, others < 2s

### Business Metrics
- **Mobile Bounce Rate:** < 50% (if analytics available)
- **Mobile Session Duration:** Match or exceed desktop
- **Mobile Conversion:** (if applicable - e.g., contact form submissions)

---

## Risk Assessment

### Low Risk
- Touch target sizing (purely CSS changes)
- Text sizing adjustments (responsive scaling)
- Image optimization (Next.js handles well)
- Spacing standardization (visual only)

### Medium Risk
- Navigation restructuring (test thoroughly)
- Chat overlay height changes (may affect UX)
- Horizontal scroll modifications (verify on many devices)
- Animation changes (performance impact)

### High Risk
- Code splitting/lazy loading (can break features)
- Bundle optimization (requires careful testing)
- Safe area insets (device-specific issues)

### Mitigation Strategies
1. **Feature Flags:** Implement mobile improvements behind flags for gradual rollout
2. **Visual Regression Tests:** Update baselines before/after changes
3. **Staged Rollout:** Deploy Phase 1 first, monitor, then proceed
4. **Rollback Plan:** Git branches for each phase, easy to revert
5. **User Testing:** Get feedback from 5+ users on mobile before final deploy

---

## Dependencies

### Required
- Existing Tailwind config (done)
- `useMediaQuery` hook (done)
- Visual regression test infrastructure (done)
- Next.js Image component (done)

### Optional
- `@next/bundle-analyzer` (install for Phase 2)
- Lighthouse CI (for automated performance testing)
- Real device lab access (BrowserStack, Sauce Labs)
- Analytics platform (measure success metrics)

---

## Next Steps

1. **Review this plan** with stakeholder (Michael Evans)
2. **Prioritize phases** - confirm Phase 1 scope
3. **Set up mobile testing** - acquire test devices or use emulators
4. **Create baseline metrics** - run Lighthouse, capture current state
5. **Create task branch** - `feature/mobile-ux-improvements`
6. **Begin Phase 1 implementation** - start with touch targets

---

## Appendix A: Component-Specific Notes

### NavigationPanel.tsx
- Works well on mobile (bottom-fixed is good pattern)
- Consider gesture to dismiss chat overlay
- Test edge case: rotating device with chat open

### ChatSection.tsx
- 50vh may be too much on iPhone SE (667px height)
- Consider max-height instead of fixed height
- Test keyboard pushing content up

### FeaturedCaseStudies.tsx
- Tap-to-expand pattern works well
- Second tap to navigate is good progressive disclosure
- Consider adding haptic feedback (if PWA)

### HorizontalTimelineSlide.tsx
- Snap scrolling works well
- Need visual indicator that more content exists
- Consider pagination dots for accessibility

### CaseStudiesHero.tsx
- Gradient text may have contrast issues on mobile
- Very large text (8xl) may overflow on small screens
- Test in landscape mode

---

## Appendix B: Responsive Breakpoint Reference

**Tailwind Breakpoints:**
- `sm:` 640px
- `md:` 768px (primary desktop breakpoint)
- `lg:` 1024px
- `xl:` 1280px
- `2xl:` 1536px

**Common Device Widths:**
- iPhone SE: 375px
- iPhone 12/13/14 Pro: 390px-393px
- iPhone 14 Pro Max: 430px
- iPad Mini: 768px (portrait)
- iPad Pro 11": 834px (portrait)

**Recommended Usage:**
```tsx
// Mobile-first responsive pattern
className="
  px-4        // Mobile: 16px padding
  sm:px-6     // Small: 24px padding
  md:px-8     // Tablet: 32px padding
  lg:px-12    // Desktop: 48px padding
"
```

---

## Appendix C: Code Snippets

### Mobile-Optimized Touch Target Utility

```tsx
// src/lib/utils.ts
export const touchTarget = (size: 'sm' | 'md' | 'lg' = 'md') => {
  const sizes = {
    sm: 'min-w-[40px] min-h-[40px]',
    md: 'min-w-[44px] min-h-[44px]',
    lg: 'min-w-[48px] min-h-[48px]',
  };
  return sizes[size];
};

// Usage
<button className={cn(touchTarget('md'), "p-2")}>
```

### Responsive Typography Hook

```tsx
// src/hooks/useResponsiveText.ts
export function useResponsiveText() {
  const isSmall = useMediaQuery('(max-width: 375px)');
  const isMobile = useMediaQuery('(max-width: 767px)');

  return {
    hero: isSmall ? 'text-3xl' : isMobile ? 'text-4xl' : 'text-5xl md:text-7xl',
    body: isMobile ? 'text-base' : 'text-lg',
    small: isMobile ? 'text-sm' : 'text-base',
  };
}
```

### Safe Area Inset CSS

```css
/* globals.css */
@layer utilities {
  .safe-area-padding {
    padding-left: max(1rem, env(safe-area-inset-left));
    padding-right: max(1rem, env(safe-area-inset-right));
    padding-top: max(1rem, env(safe-area-inset-top));
    padding-bottom: max(1rem, env(safe-area-inset-bottom));
  }
}
```

---

**Document Version:** 1.0
**Last Updated:** November 1, 2025
**Status:** Ready for Review
