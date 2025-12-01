# Plan: Lighthouse Performance Optimization — Portfolio Site

**Date:** 2025-12-01
**Tags:** performance, lighthouse, web vitals, optimization, fonts, css

## Objective

Improve the Lighthouse mobile performance score from 62 to 78-85 by optimizing font loading, CSS transitions, and JavaScript bundle size while preserving the time theme functionality (day/night accent colors) and all existing imagery.

## Background

The portfolio site (mevans.space) currently scores 62 on Lighthouse mobile performance with:
- FCP: 3.0s (target: <1.8s)
- LCP: 6.5s (target: <2.5s)
- TBT: 280ms (target: <200ms)
- Speed Index: 5.5s (target: <3.4s)

Key bottlenecks identified:
1. Preloading 5 font weights when only 2 are critical
2. Universal CSS transitions causing forced reflows
3. SunCalc library duplicated in server and client bundles
4. Render-blocking CSS files

## Requirements

### Must Have
- Reduce LCP to under 4.5s
- Reduce TBT to under 200ms
- Preserve time theme functionality (day/night accent colors)
- No changes to imagery or visual design
- All existing functionality continues to work

### Nice to Have
- LCP under 3.5s
- Performance score of 85+
- FCP under 2.0s

## Approach

Four-phase implementation with testing after each phase to measure improvement and catch regressions.

---

## Phase 1: Font Loading Optimization

**Estimated Time:** 15 minutes
**Expected Improvement:** +800-1200ms FCP/LCP

### Step 1.1: Modify Font Configuration

**File:** `/src/app/layout.tsx`

**Current code (lines 24-32):**
```typescript
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});
```

**Change to:**
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

### Step 1.2: Verify Font Usage

Before implementing, audit which font weights are actually used on critical path:
- Check hero section font weights
- Check navigation font weights
- Check above-the-fold content

### Step 1.3: Test Phase 1

```bash
# Build and run production server
npm run build
npm run start

# Run Lighthouse in separate terminal or browser DevTools
# Document FCP and LCP improvements
```

**Success Criteria:**
- [ ] FCP improved by 500ms+
- [ ] No visible font changes on homepage
- [ ] All text renders correctly

---

## Phase 2: CSS Transition Optimization

**Estimated Time:** 45 minutes
**Expected Improvement:** +60ms forced reflow elimination

### Step 2.1: Identify Elements Needing Transitions

Elements that need smooth color transitions for time theme:
- Navigation links and items
- Buttons and interactive elements
- Cards with hover states
- Form inputs
- Accent-colored text

### Step 2.2: Modify Global CSS

**File:** `/src/app/globals.css`

**Find (around lines 206-210):**
```css
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
```

**Replace with:**
```css
/* Selective transitions for interactive elements and theme-aware components */
a,
button,
[role="button"],
input,
textarea,
select,
nav,
.nav-item,
.card-interactive,
.interactive-scale,
.interactive-opacity,
.transition-smooth,
.transition-colors-smooth,
.transition-fast,
.transition-slow,
[data-theme-transition] {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Ensure accent-colored elements transition smoothly */
.text-accent,
.bg-accent,
.border-accent,
[class*="accent"] {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
```

### Step 2.3: Add data-theme-transition Attribute (if needed)

If any elements need transitions but aren't covered by the selectors above, add `data-theme-transition` attribute to them in the JSX.

### Step 2.4: Test Phase 2

```bash
npm run build
npm run start
```

**Manual Testing Checklist:**
- [ ] Navigate between pages - transitions smooth
- [ ] Hover over cards - transitions smooth
- [ ] Hover over navigation items - transitions smooth
- [ ] Hover over buttons - transitions smooth
- [ ] If possible, test at sunrise/sunset time (or modify system time)

**Success Criteria:**
- [ ] No forced reflows in Lighthouse
- [ ] Time theme color transitions still work
- [ ] All hover states have smooth transitions

---

## Phase 3: SunCalc Optimization

**Estimated Time:** 30 minutes
**Expected Improvement:** +280ms TBT, -121KB bundle

### Step 3.1: Analyze TimeThemeProvider

**File:** `/src/components/providers/TimeThemeProvider.tsx`

Current behavior:
- Imports SunCalc (121 KB)
- Sets up 5-minute interval to recalculate theme
- Updates CSS variables when time period changes

### Step 3.2: Remove Client-Side Recalculation

**Option A (Recommended): Remove interval entirely**

The server already calculates the correct theme on every page load in `layout.tsx`. Client-side recalculation is unnecessary unless users sit on the same page for hours.

**Modify TimeThemeProvider:**
```typescript
"use client";

import { createContext, useContext, type ReactNode } from "react";

// Remove SunCalc import entirely
// Remove interval-based recalculation

interface TimeThemeContextType {
  // Keep any needed context values, but no recalculation
}

const TimeThemeContext = createContext<TimeThemeContextType | null>(null);

export function TimeThemeProvider({ children }: { children: ReactNode }) {
  // Server has already set the CSS variables in layout.tsx
  // No client-side recalculation needed

  return (
    <TimeThemeContext.Provider value={{}}>
      {children}
    </TimeThemeContext.Provider>
  );
}

export function useTimeTheme() {
  const context = useContext(TimeThemeContext);
  if (!context) {
    throw new Error("useTimeTheme must be used within TimeThemeProvider");
  }
  return context;
}
```

### Step 3.3: Verify Server-Side Theme Still Works

**File:** `/src/app/layout.tsx`

Ensure the server-side SunCalc calculation remains intact:
```typescript
import * as SunCalc from 'suncalc';

// This stays - server-side calculation
function getTimeTheme() {
  // ... existing calculation logic
}
```

### Step 3.4: Test Phase 3

```bash
npm run build
npm run start
```

**Testing Checklist:**
- [ ] Homepage loads with correct theme (day or evening based on time)
- [ ] Navigate to other pages - theme persists
- [ ] Hard refresh - theme is correct
- [ ] Check bundle size in DevTools Network tab

**Success Criteria:**
- [ ] TBT reduced by 200ms+
- [ ] Client bundle size reduced by ~100KB+
- [ ] Theme still displays correctly on all pages

---

## Phase 4: Preconnect Hints

**Estimated Time:** 10 minutes
**Expected Improvement:** +50-100ms for external resources

### Step 4.1: Add Preconnect Links

**File:** `/src/app/layout.tsx`

Add to the `<head>` section (inside metadata or as link tags):

```typescript
export const metadata: Metadata = {
  // ... existing metadata
};

// In the RootLayout component, add:
<head>
  <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
  <link rel="dns-prefetch" href="https://cdn.sanity.io" />
</head>
```

Or if using Next.js metadata API:
```typescript
export const metadata: Metadata = {
  // ... existing metadata
  other: {
    'link': [
      { rel: 'preconnect', href: 'https://cdn.sanity.io', crossOrigin: 'anonymous' },
      { rel: 'dns-prefetch', href: 'https://cdn.sanity.io' },
    ],
  },
};
```

### Step 4.2: Test Phase 4

```bash
npm run build
npm run start
```

**Success Criteria:**
- [ ] Preconnect hints visible in page source
- [ ] Sanity images load faster (check Network waterfall)

---

## Phase 5: Final Verification

**Estimated Time:** 30 minutes

### Step 5.1: Full Lighthouse Audit

```bash
npm run build
npm run start

# Run Lighthouse from Chrome DevTools
# Test on mobile simulation
# Document all metrics
```

### Step 5.2: Time Theme Verification

**Testing Matrix:**

| Test | Expected Result |
|------|-----------------|
| Load page during day | Coral accent (#F46A25) |
| Load page during evening | Purple accent (#8B5CF6) |
| Page refresh | Theme persists correctly |
| Navigate between pages | Theme consistent |
| Hover on navigation | Smooth color transition |
| Hover on cards | Smooth color transition |
| Button hover states | Smooth color transition |

### Step 5.3: Visual Regression Check

- [ ] Homepage looks identical
- [ ] Navigation panel looks identical
- [ ] Case studies page looks identical
- [ ] About page looks identical
- [ ] Contact page looks identical
- [ ] Blog page looks identical

### Step 5.4: Document Results

Update the research document with final metrics:
- Before/after Lighthouse scores
- Before/after bundle sizes
- Any issues encountered

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Font weights missing on some pages | Low | Medium | Audit all pages for font usage before removing weights |
| Theme transitions break | Medium | High | Test thoroughly; add data-theme-transition fallback |
| SunCalc removal breaks edge case | Low | Medium | Keep server-side calculation; test at different times |
| CSS changes cause layout shift | Low | High | Run visual regression tests |
| Build fails after changes | Low | Low | Commit after each phase; easy rollback |

## Success Criteria

- [ ] Lighthouse Performance score: 78+ (target: 85)
- [ ] FCP: <2.2s (current: 3.0s)
- [ ] LCP: <4.5s (current: 6.5s)
- [ ] TBT: <200ms (current: 280ms)
- [ ] Speed Index: <4.0s (current: 5.5s)
- [ ] Time theme functions correctly
- [ ] No visual regressions
- [ ] All existing functionality works

## Rollback Plan

Each phase is independent. If issues arise:

1. **Phase 1 (Fonts):** Revert weight array to original 5 weights
2. **Phase 2 (CSS):** Revert to `*` selector (keep as backup)
3. **Phase 3 (SunCalc):** Restore client-side import and interval
4. **Phase 4 (Preconnect):** Remove link tags (no risk)

## Open Questions

- Should we consider lazy-loading the 300, 500, 700 font weights for pages that need them?
- Is there value in keeping a reduced client-side recalculation (e.g., every 30 minutes instead of 5)?
- Should we implement critical CSS inlining as a future enhancement?

## Related Research

- [Lighthouse Performance Optimization Research](../research/RESEARCH_2025-12-01_lighthouse-performance-optimization.md)

## Implementation Checklist

- [ ] **Phase 1:** Font loading optimization
  - [ ] Modify font weights in layout.tsx
  - [ ] Test and document improvement
- [ ] **Phase 2:** CSS transition optimization
  - [ ] Update globals.css with selective transitions
  - [ ] Test all hover states and theme transitions
- [ ] **Phase 3:** SunCalc optimization
  - [ ] Remove client-side SunCalc
  - [ ] Verify server-side theme still works
- [ ] **Phase 4:** Preconnect hints
  - [ ] Add preconnect for Sanity CDN
- [ ] **Phase 5:** Final verification
  - [ ] Run Lighthouse audit
  - [ ] Complete time theme testing matrix
  - [ ] Visual regression check
  - [ ] Document final results
