# Research: Lighthouse Performance Optimization

**Date:** 2025-12-01
**Tags:** performance, lighthouse, web vitals, optimization, time-theme

## Summary

Analysis of Lighthouse mobile performance score (62) for mevans.space portfolio site. Identified key bottlenecks in font loading, CSS transitions, and JavaScript bundle size. Recommendations preserve the time theme functionality (day/night accent colors) and existing imagery while targeting 78-85 performance score.

## Key Questions

- What is causing the 6.5s Largest Contentful Paint (LCP)?
- How can we reduce render-blocking resources (780ms estimated savings)?
- Can we improve Total Blocking Time (280ms) without breaking time theme?
- What's causing the 2,620ms element render delay?

## Current Lighthouse Metrics (Mobile)

| Metric | Score | Status |
|--------|-------|--------|
| Performance | 62 | Needs Improvement |
| Accessibility | 100 | Excellent |
| Best Practices | 96 | Good |
| SEO | 100 | Excellent |

### Core Web Vitals

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| First Contentful Paint (FCP) | 3.0s | <1.8s | Poor |
| Largest Contentful Paint (LCP) | 6.5s | <2.5s | Poor |
| Total Blocking Time (TBT) | 280ms | <200ms | Needs Improvement |
| Speed Index | 5.5s | <3.4s | Poor |
| Cumulative Layout Shift (CLS) | 0 | <0.1 | Excellent |

## Findings

### Finding 1: Font Loading Strategy

**Location:** `/src/app/layout.tsx` lines 24-44

**Current Implementation:**
```typescript
DM_Sans: {
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],  // 5 weights preloaded
  preload: true,
}
```

**Issue:** Preloading 5 font weights when only 2-3 are used on the critical rendering path. Lighthouse reports the font file (woff2) at 57.34 KiB with 576ms critical path latency.

**Impact:** +1.2-1.5s added to FCP/LCP

**Pros:**
- All weights immediately available
- No flash of fallback font for any weight

**Cons:**
- Massive critical path penalty
- Most weights unused on initial render
- Delays LCP element (hero text)

### Finding 2: Universal CSS Transitions (Critical)

**Location:** `/src/app/globals.css` lines 206-210

**Current Implementation:**
```css
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
```

**Issue:** This applies transitions to EVERY element in the DOM, causing forced reflows during initial render. Lighthouse reports 60ms total reflow time.

**Impact:** 60ms forced reflow + rendering delays

**Pros:**
- Smooth color transitions everywhere when theme changes

**Cons:**
- Causes layout thrashing on every page load
- Unnecessary for non-interactive elements
- Major performance penalty

### Finding 3: SunCalc Library Duplication

**Location:**
- `/src/app/layout.tsx` line 16 (server-side)
- `/src/components/providers/TimeThemeProvider.tsx` line 4 (client-side)

**Issue:** SunCalc (121 KB) is imported in both server and client bundles. The client-side import is used for 5-minute recalculation intervals, but this is unnecessary since the server already calculates correct theme on each request.

**Impact:** +121 KB client bundle, +280ms TBT

**Pros:**
- Live theme updates without page refresh

**Cons:**
- Adds 121 KB to client JavaScript
- Theme rarely changes while user is actively on page
- Unnecessary main thread blocking

### Finding 4: Render-Blocking CSS

**From Lighthouse Report:**

| CSS File | Size | Duration |
|----------|------|----------|
| Main CSS bundle | 23.4 KiB | 1,490ms |
| 22b9cb4aa9ee984b.css | 20.4 KiB | 830ms |
| 94ee5f215a9ce476.css | 1.4 KiB | 170ms |
| 0f1ee9b626367d05.css | 1.5 KiB | 500ms |

**Issue:** 4 CSS files blocking initial render with combined 780ms estimated savings.

**Impact:** Delays FCP by 780ms

### Finding 5: LCP Element Render Delay

**From Lighthouse Report:**
- Time to first byte: 0 ms (excellent)
- Element render delay: 2,620 ms (critical issue)

**LCP Element:** Hero text paragraph with class `.text-xl .md:text-2xl .font-serif`

**Root Cause:** Combination of font loading, CSS parsing, and JavaScript execution blocking the render of hero content.

## Time Theme Implementation (Must Preserve)

**How it works:**
1. Server-side (`layout.tsx`): Calculates sunrise/sunset times for Portland using SunCalc
2. Injects CSS variables into `<html>` element on initial render (prevents FOUC)
3. Client-side (`TimeThemeProvider`): Recalculates every 5 minutes and updates CSS variables
4. CSS variables: `--accent`, `--accent-light`, `--accent-foreground`, `--color-button-primary`
5. Day mode: Coral (#F46A25), Evening mode: Purple (#8B5CF6)

**What's safe to change:**
- Remove client-side recalculation (server handles initial theme)
- Replace SunCalc with smaller library
- Optimize how transitions are applied

**What must NOT change:**
- Server-side theme calculation in layout.tsx
- CSS variable system for accent colors
- Color values for day/evening modes

## Recommendations

### Priority 1: Reduce Preloaded Font Weights (High Impact, Easy)

**Change in `/src/app/layout.tsx`:**
```typescript
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],  // Only critical weights
  variable: "--font-sans",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});
```

**Expected Improvement:** +800-1200ms FCP/LCP
**Risk:** None - other weights load on demand
**Effort:** 5 minutes

### Priority 2: Make Transitions Selective (High Impact, Medium)

**Change in `/src/app/globals.css`:**
```css
/* Replace universal selector with specific interactive elements */
a, button, [role="button"], input, textarea, select,
.interactive-scale, .card-interactive, .transition-smooth,
.transition-colors-smooth, nav, .nav-item {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
```

**Expected Improvement:** +60ms forced reflow elimination
**Risk:** Low - time theme transitions still work on interactive elements
**Effort:** 30 minutes (includes testing)

### Priority 3: Remove/Replace Client-Side SunCalc (High Impact, Medium)

**Option A (Recommended): Remove client-side recalculation entirely**
- Delete the `useEffect` interval in TimeThemeProvider
- Keep server-side calculation (works on every page load)
- **Savings:** 121 KB, 280ms TBT

**Option B: Replace with smaller library**
- Use `sunrise-sunset-js` (3 KB) instead of `suncalc` (121 KB)
- **Savings:** 118 KB, ~250ms TBT

**Expected Improvement:** +280ms TBT, -121KB bundle
**Risk:** Theme won't auto-update while user sits on same page (acceptable tradeoff)
**Effort:** 20-30 minutes

### Priority 4: Add Preconnect Hints (Low Impact, Easy)

**Add to `/src/app/layout.tsx` head:**
```tsx
<link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
<link rel="dns-prefetch" href="https://cdn.sanity.io" />
```

**Expected Improvement:** +50-100ms for Sanity assets
**Risk:** None
**Effort:** 5 minutes

### Priority 5: Consider Critical CSS Inlining (Medium Impact, Complex)

Use `critters` package to inline critical CSS and defer rest.

**Expected Improvement:** +200-300ms FCP
**Risk:** Medium - requires build config changes
**Effort:** 2-3 hours

## Expected Results After Optimization

| Metric | Before | After (Est.) | Change |
|--------|--------|--------------|--------|
| Performance Score | 62 | 78-85 | +16-23 |
| FCP | 3.0s | 1.8-2.2s | -800ms to -1.2s |
| LCP | 6.5s | 3.5-4.5s | -2s to -3s |
| TBT | 280ms | 100-150ms | -130ms to -180ms |
| Speed Index | 5.5s | 3.5-4.0s | -1.5s to -2s |

## Next Steps

- [x] Document findings in research file
- [ ] Implement Priority 1: Reduce font weights (5 min)
- [ ] Implement Priority 2: Selective transitions (30 min)
- [ ] Implement Priority 3: Remove client SunCalc (20 min)
- [ ] Implement Priority 4: Add preconnect hints (5 min)
- [ ] Run Lighthouse test to verify improvements
- [ ] Test time theme still works correctly at day/evening transition

## References

- [Lighthouse Performance Scoring](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring/)
- [Next.js Font Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
- [Web Vitals](https://web.dev/vitals/)
- [Render-Blocking Resources](https://developer.chrome.com/docs/lighthouse/performance/render-blocking-resources/)
- [Critical CSS](https://web.dev/extract-critical-css/)
