# CSS LCP Optimization Plan
**Goal:** Reduce Largest Contentful Paint (LCP) without inlining CSS
**Date:** 2025-01-17
**Status:** Ready for Implementation

## Executive Summary

This plan implements proven strategies to optimize CSS loading and reduce LCP times. The approach focuses on critical CSS extraction, font optimization, and strategic lazy loading of non-critical components.

**Key Constraints:**
- ✅ Chat components are **CRITICAL** - must load immediately
- ⚠️ Admin components are **NOT CRITICAL** - can be lazy loaded
- ✅ Dark mode is the default theme
- ✅ No critical CSS inlining (maintain current architecture)

**Expected Impact:**
- 20-30% reduction in LCP
- Faster First Contentful Paint (FCP)
- Improved Time to Interactive (TTI)

---

## Phase 1: Quick Wins (Immediate Impact)
**Estimated Time:** 2-3 hours
**Impact:** High
**Risk:** Low

### 1.1 Optimize Tailwind Content Paths
**File:** `tailwind.config.ts`

**Current Issue:** Scanning unnecessary paths and generating unused utilities.

**Changes:**
```typescript
export default {
  darkMode: ["class"],
  content: [
    // Remove redundant paths, be specific
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./sanity/**/*.{ts,tsx}", // Only if using Tailwind in Sanity Studio
  ],
  // Rest of config...
} satisfies Config;
```

**Benefits:**
- Smaller CSS bundle size
- Faster Tailwind compilation
- Reduced unused CSS

---

### 1.2 Add PostCSS Optimization
**File:** `postcss.config.js` (CREATE NEW)

**Current Issue:** CSS not being optimized/minified beyond default Next.js settings.

**Implementation:**
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production' ? {
      cssnano: {
        preset: ['advanced', {
          discardComments: { removeAll: true },
          reduceIdents: false, // Preserve CSS variable names
          zindex: false, // Don't optimize z-index (breaks layering)
          normalizeWhitespace: true,
          colormin: true,
          minifyFontValues: true,
          minifySelectors: true,
        }]
      }
    } : {})
  }
}
```

**Benefits:**
- 15-25% smaller CSS files
- Faster download times
- Preserved CSS variable names for runtime theming

**Note:** `cssnano` is already in `package.json`, just needs configuration.

---

### 1.3 Optimize Typography Plugin
**File:** `tailwind.config.ts`

**Current Issue:** Generating all typography styles even if not used everywhere.

**Changes:**
```typescript
plugins: [
  require("tailwindcss-animate"),
  require("@tailwindcss/typography")({
    className: 'prose', // Only generate .prose classes, not global
    target: 'modern', // Don't generate legacy browser prefixes
  }),
],
```

**Benefits:**
- Smaller CSS bundle
- Faster parsing

---

### 1.4 Lazy Load Admin Components
**Files:** Any pages importing admin components

**Current Issue:** Admin dashboard CSS loading on every page.

**Example Implementation:**
```typescript
// src/app/admin/*/page.tsx or components importing admin-only UI

// ❌ BEFORE (loads immediately)
import { AdminDashboard } from '@/components/admin/AdminDashboard';

// ✅ AFTER (lazy load with loading state)
import dynamic from 'next/dynamic';

const AdminDashboard = dynamic(
  () => import('@/components/admin/AdminDashboard'),
  {
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-muted-foreground">
          Loading admin dashboard...
        </div>
      </div>
    ),
    ssr: true, // Keep SSR for admin (SEO doesn't matter, but initial HTML is fine)
  }
);
```

**Files to Update:**
- `src/app/admin/chat-logs/page.tsx`
- `src/app/admin/chatbot-content/page.tsx`
- Any other admin routes

**Benefits:**
- Admin CSS not loaded on public pages
- Faster initial page loads for visitors
- Better code splitting

---

## Phase 2: Font & Critical Resource Optimization
**Estimated Time:** 1-2 hours
**Impact:** Medium-High
**Risk:** Low

### 2.1 Enhance Font Loading Strategy
**File:** `src/app/layout.tsx`

**Current Issue:** Fonts load but could be optimized further.

**Changes:**
```typescript
// DM Sans - Primary font
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
  preload: true, // ✅ ADD: Preload critical font
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'], // ✅ IMPROVE: Better fallback chain
  adjustFontFallback: true, // ✅ ADD: Reduce layout shift
});

// Newsreader - Secondary font
const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
  preload: false, // ✅ ADD: Don't preload secondary font (loaded async)
  fallback: ['Georgia', 'Cambria', 'Times New Roman', 'serif'], // ✅ IMPROVE: Better serif fallback
  adjustFontFallback: true, // ✅ ADD: Reduce layout shift
});
```

**Benefits:**
- Faster font loading for primary font
- Reduced Cumulative Layout Shift (CLS)
- Better fallback experience

---

### 2.2 Preload Critical CSS (Next.js Automatic)
**File:** `src/app/layout.tsx`

**Note:** Next.js 15 automatically preloads critical CSS. We can verify this is working by checking the HTML output.

**Verification Command:**
```bash
# After production build
npm run build && npm run start
# Visit http://localhost:3000
# View source and look for:
# <link rel="preload" href="/_next/static/css/..." as="style">
```

**If NOT present, manually add:**
```typescript
// In layout.tsx <head> section (requires Next.js metadata API)
export const metadata: Metadata = {
  // ... existing metadata
  other: {
    // Add preload hints
    'link': [
      { rel: 'preload', as: 'style', href: '/_next/static/css/app/layout.css' },
    ],
  },
};
```

---

## Phase 3: Theme & Provider Optimization
**Estimated Time:** 1 hour
**Impact:** Medium
**Risk:** Low

### 3.1 Optimize Theme Provider for Dark Mode Default
**File:** `src/app/layout.tsx`

**Current Issue:** Theme provider may cause slight delay in initial render.

**Changes:**
```typescript
<ThemeProvider
  attribute="class"
  defaultTheme="dark" // ✅ Already set correctly
  enableSystem={false} // ✅ CHANGE: Disable system detection (dark is always default)
  disableTransitionOnChange={true} // ✅ CHANGE: Faster initial render, no theme transition
  storageKey="michael-evans-portfolio-theme"
  forcedTheme={undefined} // ✅ Keep undefined to allow manual switching
>
```

**Rationale:**
- Since dark mode is default, we don't need system detection on initial load
- Disabling transitions on change speeds up first render
- Users can still manually switch themes

**Benefits:**
- Faster initial render
- No theme detection overhead
- Reduced JavaScript execution time

---

### 3.2 Review Provider Overhead
**File:** `src/app/layout.tsx`

**Current Providers:**
```typescript
<ThemeProvider>          // ✅ Critical - controls dark mode
  <QueryProvider>        // ✅ Critical - TanStack Query for data fetching
    <TimeThemeProvider>  // ❓ Review - Does this affect LCP element?
```

**Action Items:**
1. **Audit `TimeThemeProvider`:**
   - Does it modify styles on the LCP element (hero)?
   - Can time calculations be done server-side only?
   - Consider moving time-based theme logic to server component

2. **If TimeThemeProvider affects hero colors:**
   - Keep as-is (already server-side in layout.tsx lines 50-75)
   - The inline styles are optimal for preventing FOUC

**No changes needed if current server-side color calculation works well.**

---

## Phase 4: Advanced CSS Optimization
**Estimated Time:** 2-3 hours
**Impact:** Medium
**Risk:** Medium

### 4.1 Audit & Remove Unused CSS Variables
**File:** `src/app/globals.css`

**Current Situation:** Comprehensive design system with many CSS variables.

**Process:**
```bash
# 1. Find all CSS variable usage
grep -r "var(--" src/components src/app | \
  sed 's/.*var(--\([^)]*\)).*/--\1/' | \
  sort | uniq > /tmp/used-vars.txt

# 2. Find all CSS variable definitions
grep "^\s*--" src/app/globals.css | \
  sed 's/^\s*\(--[^:]*\).*/\1/' | \
  sort | uniq > /tmp/defined-vars.txt

# 3. Find unused variables
comm -23 /tmp/defined-vars.txt /tmp/used-vars.txt
```

**Action:**
- Review unused variables
- Comment out (don't delete) unused variables with `/* UNUSED: */` prefix
- Monitor for 1 week to ensure no issues
- Permanently remove after verification

**Benefits:**
- Smaller CSS file
- Faster parsing
- Cleaner codebase

---

### 4.2 Split Critical CSS (Optional - Advanced)
**File:** `src/app/critical.css` (NEW)

**Concept:** Extract only above-the-fold styles into a separate file loaded first.

**Implementation:**
```css
/* src/app/critical.css */
@tailwind base;

@layer base {
  /* Only :root and .dark variables needed for hero/header */
  :root {
    --background: 0 0% 98%;
    --foreground: 0 0% 3.1%;
    --accent: 276 70% 45%;
    --accent-light: 280 80% 65%;
    /* ... only critical variables */
  }

  .dark {
    --background: 240 15% 6%;
    --foreground: 0 0% 98%;
    --accent: 270 80% 60%;
    --accent-light: 270 70% 70%;
    /* ... only critical variables */
  }
}

/* Only critical component styles */
@layer components {
  .hero-title { /* ... */ }
  .navigation { /* ... */ }
}
```

**Then in layout.tsx:**
```typescript
import "./critical.css";  // Load first
import "./globals.css";   // Load after
```

**⚠️ Warning:** This is complex. Only implement if LCP is still high after Phases 1-3.

---

## Phase 5: Enhanced Critters Configuration
**Estimated Time:** 30 minutes
**Impact:** Low-Medium
**Risk:** Low

### 5.1 Advanced optimizeCss Configuration
**File:** `next.config.ts`

**Current:**
```typescript
optimizeCss: process.env.NODE_ENV === 'production',
```

**Enhanced:**
```typescript
optimizeCss: process.env.NODE_ENV === 'production' ? {
  // Critters options
  preload: 'swap', // Preload non-critical CSS with font-display: swap behavior
  pruneSource: false, // Keep original CSS files (don't remove after inlining critical CSS)
  mergeStylesheets: true, // Combine multiple stylesheets
  additionalStylesheets: [], // Add additional stylesheets to process
  reduceInlineStyles: true, // Reduce size of inline styles (use classes instead)
  inlineFonts: false, // Don't inline fonts (keep them external)
  logLevel: 'info', // Show what Critters is doing
} : false,
```

**Benefits:**
- More aggressive critical CSS extraction
- Better font loading strategy
- Improved stylesheet merging

---

## Phase 6: Monitoring & Measurement
**Estimated Time:** Ongoing
**Impact:** Informational
**Risk:** None

### 6.1 Establish Baseline Metrics

**Before implementing changes, measure:**
```bash
# Option 1: Lighthouse CLI
npx lighthouse http://localhost:3000 --view \
  --only-categories=performance \
  --output=html \
  --output-path=./lighthouse-baseline.html

# Option 2: WebPageTest
# Visit https://www.webpagetest.org/
# Test production URL: https://your-vercel-url.vercel.app

# Option 3: Vercel Speed Insights
# Already installed - check dashboard at vercel.com
```

**Key Metrics to Track:**
- **LCP (Largest Contentful Paint):** Target < 2.5s
- **FCP (First Contentful Paint):** Target < 1.8s
- **CLS (Cumulative Layout Shift):** Target < 0.1
- **TBT (Total Blocking Time):** Target < 300ms
- **CSS Bundle Size:** Track reduction after each phase

---

### 6.2 A/B Testing Strategy

**For each phase:**
1. Deploy to Vercel preview branch
2. Compare metrics with production
3. Verify no visual regressions
4. Check all interactive components work
5. Merge to main if metrics improve

**Testing Checklist:**
- [ ] Homepage hero loads correctly
- [ ] Chat interface works (CRITICAL)
- [ ] Navigation works
- [ ] Dark/light theme switching works
- [ ] All case study pages load
- [ ] Blog posts render correctly
- [ ] Admin dashboard works (lazy loaded)
- [ ] Mobile responsive design intact

---

## Implementation Order (Recommended)

### Week 1: Foundation
1. ✅ Phase 1.1: Optimize Tailwind content paths
2. ✅ Phase 1.2: Add PostCSS optimization
3. ✅ Phase 1.3: Optimize Typography plugin
4. ✅ Measure & deploy

### Week 2: Fonts & Lazy Loading
1. ✅ Phase 2.1: Enhance font loading
2. ✅ Phase 1.4: Lazy load admin components
3. ✅ Measure & deploy

### Week 3: Theme Optimization
1. ✅ Phase 3.1: Optimize theme provider
2. ✅ Phase 3.2: Review provider overhead
3. ✅ Measure & deploy

### Week 4: Advanced (If Needed)
1. ⚠️ Phase 4.1: Audit unused CSS variables (optional)
2. ⚠️ Phase 4.2: Split critical CSS (only if still needed)
3. ✅ Phase 5.1: Enhanced Critters config
4. ✅ Final measurement & optimization

---

## Rollback Plan

**If any phase causes issues:**

1. **Immediate Rollback:**
   ```bash
   git revert <commit-hash>
   git push
   ```

2. **Vercel Instant Rollback:**
   - Visit Vercel Dashboard
   - Click "Rollback" on previous deployment

3. **Specific Phase Rollback:**
   - Each phase should be a separate commit
   - Revert only the problematic commit
   - Re-test remaining optimizations

---

## Success Criteria

**Phase 1 Success:**
- [ ] CSS bundle size reduced by 10-15%
- [ ] Build time improved or same
- [ ] No visual regressions

**Phase 2 Success:**
- [ ] LCP improved by 10-20%
- [ ] FCP improved by 10-15%
- [ ] Admin pages load on-demand

**Phase 3 Success:**
- [ ] Theme switching still works
- [ ] Dark mode is instant on load
- [ ] No FOUC (Flash of Unstyled Content)

**Overall Success:**
- [ ] LCP < 2.5s on 4G connection
- [ ] LCP < 1.5s on Cable/Wifi
- [ ] 90+ Lighthouse Performance score
- [ ] No broken functionality
- [ ] Chat interface loads immediately (CRITICAL)

---

## File Change Summary

### Files to Modify:
1. `tailwind.config.ts` - Content paths, typography plugin
2. `src/app/layout.tsx` - Font optimization, theme provider
3. `next.config.ts` - Enhanced Critters config
4. `src/app/admin/*/page.tsx` - Lazy load admin components

### Files to Create:
1. `postcss.config.js` - CSS optimization
2. `docs/css-lcp-baseline-metrics.md` - Before/after metrics (optional)

### Files to Audit (No Changes):
1. `src/app/globals.css` - Review unused variables (Phase 4)
2. `src/components/providers/*` - Review overhead (Phase 3)

---

## Notes & Considerations

### Chat Interface (CRITICAL)
- **DO NOT lazy load** chat components
- **DO NOT delay** chat CSS loading
- Chat must be immediately available for users
- Consider chat as "above the fold" content

### Admin Dashboard (NOT CRITICAL)
- **Safe to lazy load** - not public-facing
- **Safe to defer** CSS loading
- Admin users can tolerate slight delay
- Significant bundle size reduction opportunity

### Dark Mode Default
- Server-side color calculation already optimal (layout.tsx:50-75)
- No FOUC with current implementation
- Theme provider optimization is low-risk

### Vercel Deployment
- Vercel automatically optimizes CSS delivery (HTTP/2, Brotli compression)
- Edge network reduces latency
- Speed Insights already tracking real user metrics

---

## Questions & Answers

**Q: Will this break theme switching?**
A: No. Disabling `enableSystem` only affects initial load. Manual theme switching still works.

**Q: What if LCP is still high after Phase 3?**
A: Proceed to Phase 4 (advanced CSS splitting) or investigate image optimization, JavaScript bundle size.

**Q: How do I verify CSS is optimized?**
A: Check Network tab in DevTools. Look for smaller CSS file sizes and `content-encoding: br` (Brotli compression).

**Q: Can I skip any phases?**
A: Phase 1 and 2 are recommended. Phase 3-5 are optional based on metrics.

---

## Additional Resources

- [Next.js Font Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
- [Critters Documentation](https://github.com/GoogleChromeLabs/critters)
- [Web.dev LCP Guide](https://web.dev/lcp/)
- [Tailwind CSS Optimization](https://tailwindcss.com/docs/optimizing-for-production)

---

**Last Updated:** 2025-01-17
**Next Review:** After Phase 3 completion
