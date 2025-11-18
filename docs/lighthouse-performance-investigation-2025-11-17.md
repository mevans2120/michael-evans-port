# Lighthouse Performance Investigation

**Date:** November 17, 2025
**Score:** 67 (down from 80)
**Page:** Homepage (Mobile)
**Test Conditions:** Slow 4G, Moto G Power emulation

---

## Summary

The performance score dropped from 80 to 67 primarily due to a **3-second Element Render Delay** for the hero text content. This is NOT an image loading issue - it's a render-blocking CSS/font issue.

---

## Key Metrics

| Metric | Score | Target | Status |
|--------|-------|--------|--------|
| **Largest Contentful Paint** | 6.6s | < 2.5s | ❌ CRITICAL |
| First Contentful Paint | 2.7s | < 1.8s | ⚠️ WARNING |
| Speed Index | 5.5s | < 3.4s | ⚠️ WARNING |
| Total Blocking Time | 130ms | < 200ms | ✅ GOOD |
| Cumulative Layout Shift | 0 | < 0.1 | ✅ PERFECT |

---

## Root Cause Analysis

### 1. Element Render Delay: 3,000ms ❌

**What:** The hero text ("builds products" + description) is ready but blocked from rendering for 3 seconds.

**LCP Element:**
- **NOT the featured blog image** (below the fold)
- **IS the hero section text** (first visible content)

**Why it's delayed:**
- Browser has the HTML but waits to paint
- CSS and fonts must load before text renders
- Even with `font-display: swap`, there's a delay

### 2. Render-Blocking Resources: 380ms potential savings

**Blocking requests:**
- `mevans.space` (1st Party): 22.7 KiB, **1,490ms** 🔴
- CSS file: 1.5 KiB, 500ms
- CSS file: 1.4 KiB, 170ms
- CSS file: **19.8 KiB, 830ms** 🔴

**Issue:** One CSS bundle is 19.8 KiB and takes 830ms to download on slow 4G, blocking the initial render.

---

## Current Font Configuration

### ✅ GOOD: Using next/font/google

**DM Sans (Sans-serif):**
```typescript
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],  // 5 weights
  variable: "--font-sans",
  display: "swap",  // ✅ Correct
});
```

**Newsreader (Serif):**
```typescript
const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["300", "400", "600"],  // 3 weights + 2 styles
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",  // ✅ Correct
});
```

### Font Weight Usage (Actual)

All loaded font weights ARE being used in the codebase:

| Weight | Tailwind Class | Usage Count | Status |
|--------|----------------|-------------|--------|
| 300 | `font-light` | 29 | ✅ Used |
| 400 | `font-normal` | 8 | ✅ Used |
| 500 | `font-medium` | 59 | ✅ Used (most common) |
| 600 | `font-semibold` | 53 | ✅ Used |
| 700 | `font-bold` | 48 | ✅ Used |

**Total:** 197 font weight declarations across the codebase.

**Verdict:** No unused fonts to remove. All weights are necessary.

---

## CSS Analysis

### globals.css Size
- **16,072 bytes** (16 KB)
- Contains Tailwind base, components, utilities
- Includes extensive CSS custom properties for design system
- Size is reasonable and expected for a Tailwind project

### Potential Issues

1. **CSS Bundle Size (19.8 KiB file)**
   - Takes 830ms to load on slow 4G
   - Blocking initial render
   - Could be optimized with code splitting

2. **Font Loading Strategy**
   - Using `display: swap` (correct)
   - But still experiencing 3s delay
   - May need preloading strategy

3. **No Critical CSS Inlining**
   - All CSS loaded externally
   - Could inline critical above-the-fold CSS

---

## Recommendations

### Priority 1: Critical CSS Inlining ⭐⭐⭐

**Problem:** All CSS is external, blocking render.

**Solution:** Inline critical CSS for hero section.

```typescript
// In app/layout.tsx or page.tsx
export default function Page() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        /* Critical hero styles */
        .hero-text { font-family: var(--font-sans); }
        /* Add other critical styles */
      `}} />
      {/* Rest of page */}
    </>
  )
}
```

**Expected Impact:** Reduce Element Render Delay from 3s to < 1s

---

### Priority 2: Preload Critical Fonts ⭐⭐

**Problem:** Fonts loaded after CSS, delaying text render.

**Solution:** Add font preloading in layout.

```typescript
// In app/layout.tsx
<head>
  <link
    rel="preload"
    href="/_next/static/media/dm-sans-regular.woff2"
    as="font"
    type="font/woff2"
    crossOrigin="anonymous"
  />
  <link
    rel="preload"
    href="/_next/static/media/newsreader-regular.woff2"
    as="font"
    type="font/woff2"
    crossOrigin="anonymous"
  />
</head>
```

**Expected Impact:** Reduce font load delay by 500-1000ms

---

### Priority 3: Optimize CSS Delivery ⭐

**Options:**

**A. Enable Experimental CSS Optimization in Next.js**

```javascript
// next.config.ts
{
  experimental: {
    optimizeCss: true, // Requires critters package
  }
}
```

**B. Use CSS Code Splitting**
- Split CSS by route
- Load only what's needed per page

**C. Reduce CSS Bundle Size**
- Remove unused Tailwind classes (use purge properly)
- Tree-shake unused utilities

**Expected Impact:** Reduce CSS bundle from 19.8 KiB to ~12-15 KiB

---

### Priority 4: Font Subsetting (Optional) ⭐

**Problem:** Loading full character sets for Latin fonts.

**Solution:** Already using `subsets: ["latin"]` ✅

**Potential optimization:** Use `preload: true` with next/font:

```typescript
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
  preload: true,  // Add this
});
```

**Expected Impact:** Minor improvement (100-200ms)

---

## Implementation Plan

### Phase 1: Quick Wins (< 1 hour)
1. ✅ Add `preload: true` to font configurations
2. ✅ Verify font files are being preloaded in Network tab
3. ✅ Test Lighthouse score improvement

### Phase 2: Critical CSS (2-3 hours)
1. Identify critical above-the-fold CSS
2. Extract hero section styles
3. Inline critical CSS in layout/page
4. Test render timing

### Phase 3: CSS Optimization (1-2 hours)
1. Enable Next.js experimental CSS optimization
2. Audit Tailwind purge configuration
3. Run production build and measure bundle size

### Phase 4: Verify & Measure
1. Run Lighthouse test
2. Compare before/after metrics
3. Document improvements

---

## Expected Results

| Metric | Before | Target | Improvement |
|--------|--------|--------|-------------|
| LCP | 6.6s | 2.5s | -4.1s (-62%) |
| Element Render Delay | 3.0s | 0.5s | -2.5s (-83%) |
| Performance Score | 67 | 85+ | +18 points |

---

## Technical Notes

### Why Next.js Font Optimization Isn't Enough

While Next.js does optimize fonts automatically with `next/font`, it:
- ✅ Self-hosts fonts (no external requests)
- ✅ Eliminates layout shift
- ✅ Uses `font-display: swap`
- ❌ **Does NOT inline critical CSS**
- ❌ **Does NOT preload fonts by default**
- ❌ **Does NOT prevent render blocking**

**The 3s delay happens because:**
1. Browser downloads HTML (fast)
2. Browser downloads CSS bundle (830ms for 19.8 KiB file)
3. Browser parses CSS and sees font references
4. Browser downloads fonts (additional delay)
5. **ONLY THEN** does browser paint text (3s total)

---

## Monitoring & Testing

### Test Commands
```bash
# Production build
npm run build

# Check bundle sizes
npm run build && ls -lh .next/static/css/

# Run Lighthouse locally
npx lighthouse http://localhost:3000 --view

# Run Lighthouse with specific throttling
npx lighthouse http://localhost:3000 --throttling-method=devtools --throttling.cpuSlowdownMultiplier=4
```

### Files to Monitor
- `.next/static/css/*.css` - CSS bundle sizes
- Network waterfall in DevTools
- Lighthouse reports over time

---

## Questions to Investigate

1. ❓ Is the 19.8 KiB CSS file the compiled Tailwind output?
2. ❓ Are there unused Tailwind classes being bundled?
3. ❓ Could we defer non-critical CSS with `<link rel="preload" as="style">`?
4. ❓ Would route-based code splitting help?

---

## References

- [Next.js Font Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
- [Web.dev: Optimize LCP](https://web.dev/articles/optimize-lcp)
- [Web.dev: Critical CSS](https://web.dev/articles/extract-critical-css)
- [Tailwind CSS Production Optimization](https://tailwindcss.com/docs/optimizing-for-production)

---

## Conclusion

The performance drop from 80 to 67 is **NOT caused by images** - it's caused by **render-blocking CSS and fonts** creating a 3-second Element Render Delay for the hero text.

**Quick Win:** Add `preload: true` to fonts and test (~30 min, expect +5-10 points)
**Best Solution:** Implement critical CSS inlining (~2-3 hours, expect +15-20 points)

**Next.js font optimization IS working** - fonts are self-hosted and optimized. The issue is the CSS delivery and render-blocking, not the fonts themselves.
