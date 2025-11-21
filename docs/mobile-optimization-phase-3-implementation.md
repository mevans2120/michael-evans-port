# Mobile Optimization Phase 3 Implementation Plan

**Date**: November 20, 2025
**Status**: Ready for Implementation
**Target**: Improve mobile Lighthouse score from current baseline to 90+

## Overview

This plan implements the remaining high-impact mobile optimizations in priority order, excluding image modifications per user request.

**Implementation Order:**
1. Resource Hints (Quick Win - 30 min)
2. Font Optimization (Medium Impact - 1-2 hours)
3. Bundle Analysis & Optimization (High Impact - 2-4 hours)
4. Server-Side Rendering Optimization (Medium Impact - 2-3 hours)

**Total Estimated Time**: 6-10 hours

---

## Phase 3.1: Resource Hints (PRIORITY 1)

**Goal**: Reduce DNS lookup and connection time for external resources
**Estimated Time**: 30 minutes
**Impact**: 50-100ms improvement in LCP
**Risk**: Very Low

### Current State
- No resource hints configured
- DNS lookup and connection happens on-demand
- Sanity CDN images require connection establishment

### Implementation

**File**: `/src/app/layout.tsx`

**Add to `<head>` section** (after metadata):

```tsx
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // ... existing code ...

  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${newsreader.variable}`}
      suppressHydrationWarning
      style={{
        '--accent': accentColors.accent,
        '--accent-light': accentColors.accentLight,
        '--accent-foreground': accentColors.accentForeground,
        '--color-button-primary': accentColors.buttonPrimary,
      } as React.CSSProperties}
    >
      <head>
        {/* DNS Prefetch for external domains */}
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://vitals.vercel-insights.com" />

        {/* Preconnect for critical external resources */}
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />

        {/* Prefetch Google Fonts if needed */}
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      </head>
      <body className="font-sans overflow-hidden">
        {/* ... rest of body ... */}
      </body>
    </html>
  );
}
```

### Alternative Approach (Using Next.js Metadata API)

If adding `<head>` directly causes issues, use metadata:

```tsx
export const metadata: Metadata = {
  title: "Michael Evans | AI/ML Portfolio",
  description: "Portfolio showcasing AI/ML expertise, creative technology solutions, and professional case studies",
  other: {
    'dns-prefetch': 'https://cdn.sanity.io',
    'preconnect': 'https://cdn.sanity.io',
  },
};
```

**Note**: The direct `<head>` approach is preferred for resource hints.

### What These Do

- **`dns-prefetch`**: Resolves DNS early (before resource needed)
- **`preconnect`**: Establishes full connection (DNS + TCP + TLS handshake)
- **`crossOrigin="anonymous"`**: Required for CORS resources like CDN images

### Testing

```bash
# 1. Start dev server
npm run dev

# 2. Open DevTools → Network tab
# 3. Look for early connections to cdn.sanity.io
# 4. Check timing for Sanity images (should see reduced "Waiting (TTFB)")
```

### Expected Impact
- 50-100ms faster image loading
- Reduced network latency for Sanity CDN
- Slight improvement in LCP

### Success Criteria
- [ ] Resource hints visible in page source
- [ ] Network tab shows early connection to cdn.sanity.io
- [ ] Sanity images load faster (check Network timing)
- [ ] No console errors or warnings
- [ ] Build succeeds

---

## Phase 3.2: Font Optimization (PRIORITY 2)

**Goal**: Eliminate font-related layout shifts and reduce payload
**Estimated Time**: 1-2 hours
**Impact**: Reduce CLS, faster perceived performance
**Risk**: Low

### Current State

```tsx
// src/app/layout.tsx (lines 19-34)
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});
```

### Implementation

**File**: `/src/app/layout.tsx`

**Update font configurations:**

```tsx
// DM Sans - Primary UI font (critical)
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // REMOVED: 300 (rarely used)
  variable: "--font-sans",
  display: "swap",
  preload: true, // ADDED: Preload critical font
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'], // ADDED: Better fallback
  adjustFontFallback: true, // ADDED: Reduce layout shift
});

// Newsreader - Editorial font (non-critical)
const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "600"], // REMOVED: 300, italic (check usage first)
  style: ["normal"], // REMOVED: italic if not used
  variable: "--font-serif",
  display: "swap",
  preload: false, // ADDED: Don't preload secondary font
  fallback: ['Georgia', 'Cambria', 'Times New Roman', 'serif'], // ADDED: Better serif fallback
  adjustFontFallback: true, // ADDED: Reduce layout shift
});
```

### Font Weight Audit (Required First)

Before removing font weights, verify usage:

```bash
# Check DM Sans weight usage
grep -r "font-light" src/
grep -r "300" src/ | grep -i "font"

# Check Newsreader italic usage
grep -r "italic" src/ | grep -i "font\|newsreader"
```

**Decision Matrix:**
- If `font-light` (300) is used → Keep it
- If `italic` is used → Keep it
- If rarely used → Remove and update components to use available weights

### CSS Fallback Enhancement (Optional)

**File**: `/src/app/globals.css`

Add size-adjusted fallback fonts to reduce CLS:

```css
@layer base {
  /* DM Sans fallback with size adjustment */
  @font-face {
    font-family: 'DM Sans Fallback';
    src: local('Arial'), local('Helvetica'), local('sans-serif');
    size-adjust: 105%; /* Adjust to match DM Sans metrics */
    ascent-override: 92%;
    descent-override: 24%;
    line-gap-override: 0%;
  }

  /* Newsreader fallback with size adjustment */
  @font-face {
    font-family: 'Newsreader Fallback';
    src: local('Georgia'), local('Cambria'), local('serif');
    size-adjust: 98%;
    ascent-override: 88%;
    descent-override: 22%;
    line-gap-override: 0%;
  }
}
```

**Note**: `adjustFontFallback: true` in Next.js may handle this automatically. Add manual fallbacks only if CLS remains high.

### Testing

```bash
# 1. Build and start
npm run build && npm run start

# 2. Test in DevTools
# - Network tab: Check font file sizes (should be smaller)
# - Performance tab: Check CLS score
# - Lighthouse: Run mobile audit

# 3. Visual test
# - Check all pages for font rendering
# - Verify no missing bold/italic styles
# - Check fallback appearance (disable cache, throttle network)
```

### Expected Impact
- 20-30% reduction in font payload
- Eliminated or reduced CLS from font loading
- Faster text visibility (improved FCP)
- Better fallback experience

### Success Criteria
- [ ] Font weights verified and unused ones removed
- [ ] `adjustFontFallback: true` added to both fonts
- [ ] Build succeeds with no font errors
- [ ] All pages render correctly
- [ ] CLS improved or same (not worse)
- [ ] Font files smaller in Network tab

---

## Phase 3.3: Bundle Analysis & Optimization (PRIORITY 3)

**Goal**: Identify and reduce JavaScript bundle size
**Estimated Time**: 2-4 hours
**Impact**: 30-40% reduction in JavaScript execution time
**Risk**: Medium (requires careful analysis)

### Current Bundle Size

From earlier analysis:
- Shared bundle: **103 kB**
- Largest chunks:
  - `d8e9270f-c9a1f107fc67750e.js` - **2.3 MB** (likely Sanity Studio)
  - `6115-e030771ce8bb74ea.js` - **1.0 MB**
  - Several 200-500 KB chunks

### Step 1: Install Bundle Analyzer

```bash
npm install --save-dev @next/bundle-analyzer
```

### Step 2: Update Next.js Config

**File**: `/next.config.ts`

```typescript
import type { NextConfig } from "next";
import withBundleAnalyzer from '@next/bundle-analyzer';

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  // ... existing config (images, experimental, compiler)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // Performance optimizations
  experimental: {
    optimizeCss: process.env.NODE_ENV === 'production',
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
      '@radix-ui/react-accordion',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-popover',
      '@radix-ui/react-scroll-area',
      '@radix-ui/react-select',
      '@radix-ui/react-separator',
      '@radix-ui/react-tabs',
      '@radix-ui/react-toast',
    ],
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default bundleAnalyzer(nextConfig);
```

### Step 3: Run Bundle Analysis

```bash
# Analyze production bundle
ANALYZE=true npm run build

# This will:
# 1. Build the production bundle
# 2. Open two browser tabs showing:
#    - Client bundle analysis
#    - Server bundle analysis
# 3. Generate visual treemaps
```

### Step 4: Analyze Results

**Look for:**

1. **Large Dependencies (> 100 KB)**
   - Check if they're needed
   - Can they be replaced with lighter alternatives?
   - Can they be dynamically imported?

2. **Duplicate Dependencies**
   - Same package included multiple times
   - Different versions of same package

3. **Unused Code**
   - Icons loaded but not used
   - Utilities imported but not called
   - Component variations not needed

### Step 5: Common Optimizations

#### A. Dynamic Import Heavy Components

**Example**: If chatbot or modal components are large:

```tsx
// Before (loads immediately)
import { ChatInterface } from '@/components/chatbot/ChatInterface';

// After (lazy load)
import dynamic from 'next/dynamic';

const ChatInterface = dynamic(
  () => import('@/components/chatbot/ChatInterface'),
  {
    ssr: false, // Skip SSR if not needed for SEO
    loading: () => <div className="animate-pulse h-[400px]" />,
  }
);
```

#### B. Optimize Icon Imports

**If using many icons from lucide-react:**

```tsx
// ❌ BAD: Imports entire icon library
import * as Icons from 'lucide-react';

// ✅ GOOD: Import only needed icons
import { Menu, X, ChevronDown } from 'lucide-react';
```

#### C. Tree-shake Utilities

**Check if any utility libraries can be tree-shaken:**

```tsx
// ❌ BAD
import _ from 'lodash';

// ✅ GOOD
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
```

#### D. Code Split by Route

**Ensure route-based splitting is working:**

```tsx
// Each route in app/ should be automatically split
// Verify in bundle analyzer that each route has its own chunk
```

### Step 6: TanStack Query Optimization

**File**: `/src/components/providers/query-provider.tsx`

**Current**: Check if query client is optimized for mobile.

**Recommended config:**

```tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Mobile-optimized settings
            staleTime: 1000 * 60 * 5, // 5 min - reduce refetches
            gcTime: 1000 * 60 * 10,   // 10 min cache
            refetchOnWindowFocus: false, // Don't refetch on focus (mobile battery)
            refetchOnReconnect: true,    // But refetch when reconnected
            retry: 1, // Reduce retry attempts on mobile
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

### Expected Impact
- 20-30% reduction in JavaScript bundle
- Faster Time to Interactive (TTI)
- Lower CPU usage on mobile
- Improved initial load time

### Success Criteria
- [ ] Bundle analyzer installed and working
- [ ] Analysis completed and documented
- [ ] Top 3 heaviest dependencies identified
- [ ] At least 1-2 optimizations implemented
- [ ] Bundle size reduced (verify in analyzer)
- [ ] All features still work correctly

---

## Phase 3.4: Server-Side Rendering Optimization (PRIORITY 4) ✅ COMPLETE

**Goal**: Reduce TTFB and enable static generation where possible
**Estimated Time**: 2-3 hours
**Impact**: 15-25% reduction in TTFB
**Risk**: Low-Medium
**Status**: ✅ Completed November 20, 2025

### Current State
- All routes are currently SSR (server-rendered on demand)
- No static generation configured
- No ISR (Incremental Static Regeneration)

### Implementation Summary

**Added 6-hour ISR revalidation to all content pages:**
- ✅ Homepage: `/src/app/(public)/page.tsx`
- ✅ Blog posts: `/src/app/(public)/blog/[slug]/page.tsx`
- ✅ Case studies: `/src/app/(public)/case-studies/[slug]/page.tsx`
- ✅ About page: `/src/app/(public)/about/page.tsx`

**Revalidation Strategy:**
- 6-hour revalidation (`21600` seconds) serves as safety net
- Existing Sanity webhook provides instant updates (< 30 seconds) when publishing
- Best of both worlds: instant static pages + automatic updates

**Code Added to Each File:**
```tsx
// ISR: Revalidate every 6 hours (Phase 3.4)
// Webhook provides instant updates when publishing in Sanity
export const revalidate = 21600; // 6 hours
```

### Strategy

**Categorize routes by update frequency:**

1. **Static** (never/rarely changes): About, Case Studies
2. **ISR** (changes occasionally): Blog posts, Homepage
3. **Dynamic** (real-time): Chat, Admin

### Implementation

#### A. Static Generation for About Page

**File**: `/src/app/(public)/about/page.tsx`

Add:

```tsx
// Force static generation (no revalidation)
export const dynamic = 'force-static';

// OR with revalidation every 24 hours
export const revalidate = 86400; // 24 hours in seconds
```

#### B. ISR for Case Studies

**File**: `/src/app/(public)/case-studies/[slug]/page.tsx`

Already has `generateStaticParams` - add revalidation:

```tsx
// Current: generateStaticParams already exists ✅

// Add ISR revalidation
export const revalidate = 3600; // Revalidate every 1 hour

export async function generateStaticParams() {
  // ... existing code
}
```

**This enables:**
- Static build-time generation
- Automatic revalidation every hour
- Instant page loads for users
- Background regeneration on CMS updates

#### C. ISR for Blog Posts

**File**: `/src/app/(public)/blog/[slug]/page.tsx`

```tsx
// Add ISR revalidation
export const revalidate = 3600; // Revalidate every 1 hour

export async function generateStaticParams() {
  // ... existing code (already exists)
}
```

#### D. ISR for Homepage

**File**: `/src/app/(public)/page.tsx`

Check current implementation and add:

```tsx
// Revalidate homepage every 30 minutes
export const revalidate = 1800; // 30 minutes

export default async function HomePage() {
  // ... existing code
}
```

#### E. Keep Dynamic for Real-Time Routes

**Files to keep dynamic (no changes):**
- `/src/app/api/chat/route.ts` - Chat API
- `/src/app/admin/**/*` - Admin pages
- `/src/app/api/**/*` - API routes

### Sanity Webhook Integration (Advanced - Optional)

**For instant revalidation on CMS updates:**

**File**: `/src/app/api/revalidate/route.ts` (NEW)

```tsx
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');

  // Verify webhook secret
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { _type, slug } = body;

    // Revalidate based on content type
    if (_type === 'blog' && slug) {
      revalidatePath(`/blog/${slug.current}`);
      revalidatePath('/blog'); // List page
    } else if (_type === 'project' && slug) {
      revalidatePath(`/case-studies/${slug.current}`);
      revalidatePath('/case-studies'); // List page
      revalidatePath('/'); // Homepage (if showing projects)
    }

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error revalidating' },
      { status: 500 }
    );
  }
}
```

**Environment variable:**

Add to `.env.local`:
```
REVALIDATE_SECRET=your-random-secret-string
```

**Sanity webhook setup** (in Sanity Studio):
1. Go to Sanity dashboard → API → Webhooks
2. Add webhook URL: `https://your-site.com/api/revalidate?secret=your-secret`
3. Trigger on: Create, Update, Delete for `blog` and `project` types

### Testing

```bash
# 1. Build with static generation
npm run build

# Check output - should see:
# ● /blog/[slug] - Static with ISR (revalidate: 3600)
# ● /case-studies/[slug] - Static with ISR (revalidate: 3600)

# 2. Test locally
npm run start

# 3. Check .next/server/app/ directory
# Should see pre-rendered HTML files

# 4. Deploy to Vercel
# Verify ISR works in production
```

### Expected Impact
- 15-25% reduction in TTFB for static/ISR pages
- Instant page loads for most visitors
- Reduced server load
- Better caching at CDN edge

### Success Criteria
- [x] About page uses ISR (revalidate: 21600 / 6 hours)
- [x] Case studies use ISR (revalidate: 21600 / 6 hours)
- [x] Blog posts use ISR (revalidate: 21600 / 6 hours)
- [x] Homepage uses ISR (revalidate: 21600 / 6 hours)
- [ ] Build shows static/ISR in output (pending next build)
- [ ] Pages load instantly in production (pending deployment)
- [x] CMS updates reflect instantly via existing Sanity webhook

---

## Implementation Timeline

### Day 1: Resource Hints & Font Optimization (3-4 hours)
- **Morning**: Phase 3.1 - Resource Hints (30 min)
  - Add resource hints to layout
  - Test and verify
  - Commit and push
- **Afternoon**: Phase 3.2 - Font Optimization (2-3 hours)
  - Audit font weight usage
  - Update font configurations
  - Test across all pages
  - Commit and push

### Day 2: Bundle Analysis (4-5 hours)
- **Morning**: Phase 3.3 - Setup and Analysis (2 hours)
  - Install bundle analyzer
  - Run analysis
  - Document findings
- **Afternoon**: Phase 3.3 - Optimizations (2-3 hours)
  - Implement top 2-3 optimizations
  - Test thoroughly
  - Commit and push

### Day 3: SSR Optimization (2-3 hours)
- **Morning**: Phase 3.4 - Implementation (2 hours)
  - Add revalidation to routes
  - Update pages for ISR
  - Build and verify output
- **Afternoon**: Testing & Documentation (1 hour)
  - Deploy to Vercel preview
  - Test ISR in production
  - Update documentation
  - Final commit and push

**Total: 9-12 hours across 3 days**

---

## Rollback Plan

### If Phase 3.1 (Resource Hints) Causes Issues
```bash
# Remove resource hints from layout.tsx
git revert <commit-hash>
```
**Risk**: Very low (resource hints are hints, not requirements)

### If Phase 3.2 (Font Optimization) Causes Issues
```bash
# Revert font changes
git revert <commit-hash>

# Or restore previous font config
```
**Risk**: Low (can always restore font weights)

### If Phase 3.3 (Bundle) Causes Issues
```bash
# Revert specific optimization
git revert <commit-hash>

# Keep bundle analyzer (doesn't affect production)
```
**Risk**: Medium (test thoroughly before committing)

### If Phase 3.4 (SSR) Causes Issues
```bash
# Remove revalidation from affected route
export const revalidate = false; // Back to full SSR
```
**Risk**: Low (ISR is backward compatible with SSR)

---

## Measurement & Success Criteria

### Baseline Metrics (Before)
Run before starting:

```bash
# Lighthouse mobile audit
npx lighthouse http://localhost:3000 \
  --preset=mobile \
  --only-categories=performance \
  --view

# Save output as baseline
```

**Record:**
- Performance Score: _____
- LCP: _____
- FCP: _____
- TTI: _____
- TBT: _____
- CLS: _____

### Target Metrics (After)

| Metric | Current | Target | Phase Responsible |
|--------|---------|--------|-------------------|
| Performance Score | ? | 90+ | All |
| LCP | ? | < 2.5s | 3.1, 3.4 |
| FCP | ? | < 1.8s | 3.2, 3.4 |
| TTI | ? | < 3.8s | 3.3 |
| TBT | ? | < 200ms | 3.3 |
| CLS | ? | < 0.1 | 3.2 |

### Measurement After Each Phase

```bash
# After each phase, run:
npm run build
npm run start

# Lighthouse mobile test
npx lighthouse http://localhost:3000 \
  --preset=mobile \
  --only-categories=performance \
  --output=html \
  --output-path=./lighthouse-phase-3-X.html

# Compare with baseline
```

---

## Files Modified Summary

### Phase 3.1 (Resource Hints)
- `/src/app/layout.tsx` - Add resource hints to head

### Phase 3.2 (Font Optimization)
- `/src/app/layout.tsx` - Update font configurations
- `/src/app/globals.css` - Optional fallback fonts (if needed)

### Phase 3.3 (Bundle)
- `/next.config.ts` - Add bundle analyzer
- `/package.json` - Add analyzer dependency
- Various component files - Dynamic imports (TBD after analysis)
- `/src/components/providers/query-provider.tsx` - Optimize query config

### Phase 3.4 (SSR)
- `/src/app/(public)/about/page.tsx` - Add static export
- `/src/app/(public)/case-studies/[slug]/page.tsx` - Add revalidation
- `/src/app/(public)/blog/[slug]/page.tsx` - Add revalidation
- `/src/app/(public)/page.tsx` - Add revalidation
- `/src/app/api/revalidate/route.ts` - NEW (optional webhook)

---

## Notes & Considerations

### Resource Hints
- Very low risk, high reward
- Browsers that don't support them ignore the hints
- No impact on older browsers

### Font Optimization
- Verify font weight usage before removing
- `adjustFontFallback` is a Next.js feature (works automatically)
- Manual fallback fonts only if CLS remains high

### Bundle Analysis
- Analyzer is dev-only (doesn't affect production)
- Take time to understand the analysis
- Don't optimize prematurely - measure first

### SSR/ISR
- ISR is ideal for content that updates occasionally
- Can always increase revalidation time if needed
- Sanity webhook integration is optional but recommended

### Testing
- Test each phase independently
- Use Vercel preview deployments
- Check mobile AND desktop
- Verify all interactive features work

---

## Related Documentation

- Original Plan: `/docs/css-lcp-optimization-phase-2.5-mobile.md`
- Phase 1 Complete: `/docs/css-lcp-optimization-plan.md`
- Next.js ISR: https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration
- Bundle Analyzer: https://www.npmjs.com/package/@next/bundle-analyzer
- Resource Hints: https://web.dev/preconnect-and-dns-prefetch/

---

**Ready to Start?** Begin with Phase 3.1 (Resource Hints) - it's the quickest win with lowest risk.
