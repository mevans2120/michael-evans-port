# Phase 2.5: Mobile LCP Optimization Plan

**Status**: Ready for implementation
**Target**: Improve mobile Lighthouse performance from 67 to 90+
**Context**: Phase 1 improved desktop scores significantly, mobile needs targeted optimization

## Background

**Current Performance:**
- Desktop: Significantly improved after Phase 1 (Tailwind optimization, cssnano advanced, lazy-loaded admin)
- Mobile: 67 performance score (needs improvement)
- Phase 1 Impact: Admin bundle 77% smaller (6.27 kB → 1.45 kB), build time 14.7s → 13.3s

**Why Mobile is Different:**
- Slower CPUs (JavaScript execution bottleneck)
- Variable network conditions (3G/4G vs broadband)
- Smaller viewports (different critical CSS)
- Touch interactions (different user patterns)
- Battery/thermal constraints (performance degradation)

## Mobile LCP Bottleneck Analysis

Based on typical Next.js portfolio mobile performance issues:

### Likely Culprits (Priority Order):

1. **JavaScript Bundle Size** (Highest Impact)
   - Mobile CPUs 4-6x slower than desktop
   - Heavy React hydration blocking render
   - Unused code in initial bundle

2. **Image Optimization** (High Impact)
   - Large images not optimized for mobile viewports
   - Missing `sizes` attribute causing oversized downloads
   - Lazy loading not aggressive enough

3. **Font Loading** (Medium-High Impact)
   - FOIT/FOUT causing layout shifts
   - Multiple font weights loading unnecessarily
   - No font subsetting for mobile

4. **CSS Delivery** (Medium Impact)
   - Full CSS bundle loading even for mobile-only views
   - Unused CSS for desktop-only components
   - No critical CSS extraction

5. **Third-Party Scripts** (Variable Impact)
   - Analytics, chatbot, or other integrations
   - Blocking main thread execution
   - Not deferred properly

## Implementation Plan

### 2.5.1: JavaScript Bundle Optimization (Highest Priority)

**Goal**: Reduce JavaScript execution time on mobile by 40-50%

**Actions:**

1. **Route-based code splitting for mobile-heavy pages**

```tsx
// src/app/(public)/page.tsx
'use client';

import dynamic from 'next/dynamic';
import { useIsDesktop } from '@/hooks/useMediaQuery';

// Lazy load heavy components only needed after initial paint
const HeavyInteractiveSection = dynamic(
  () => import('@/components/homepage/HeavyInteractiveSection'),
  {
    ssr: false, // Skip SSR for mobile-only interactivity
    loading: () => <div className="h-[400px]" />, // Prevent layout shift
  }
);

export default function HomePage() {
  const isDesktop = useIsDesktop();

  return (
    <>
      {/* Critical content renders immediately */}
      <HeroSection />
      <AboutSection />

      {/* Defer heavy components */}
      <HeavyInteractiveSection />
    </>
  );
}
```

2. **Analyze and remove unused dependencies**

```bash
# Install bundle analyzer
npm install --save-dev @next/bundle-analyzer

# Analyze current bundle
ANALYZE=true npm run build
```

Create `next.config.ts` update:

```typescript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // existing config
});
```

**Action Items:**
- [ ] Add bundle analyzer to project
- [ ] Run analysis and identify top 5 largest dependencies
- [ ] Evaluate if heavy libraries can be replaced with lighter alternatives
- [ ] Consider dynamic imports for rarely-used utilities

3. **Optimize React Query configuration for mobile**

```tsx
// src/app/providers.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mobile-optimized query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes - reduce refetches on slow connections
      gcTime: 1000 * 60 * 10,   // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false, // Reduce unnecessary refetches on mobile
      refetchOnReconnect: true,    // But refetch when connection restored
      retry: 1,                     // Reduce retry attempts on mobile
    },
  },
});
```

**Expected Impact:**
- 30-40% reduction in JavaScript execution time
- Faster Time to Interactive (TTI)
- Lower CPU usage on mobile devices

---

### 2.5.2: Mobile-Specific Image Optimization (High Priority)

**Goal**: Reduce image payload by 60-70% for mobile viewports

**Actions:**

1. **Add mobile-optimized `sizes` attribute to all images**

```tsx
// Before (loading full-size images on mobile):
<Image
  src="/hero-image.jpg"
  alt="Hero"
  width={1920}
  height={1080}
  priority
/>

// After (mobile-optimized):
<Image
  src="/hero-image.jpg"
  alt="Hero"
  width={1920}
  height={1080}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  priority
/>
```

2. **Create mobile-specific image component wrapper**

```tsx
// src/components/ui/ResponsiveImage.tsx
import Image, { ImageProps } from 'next/image';
import { useIsDesktop } from '@/hooks/useMediaQuery';

interface ResponsiveImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  mobileSrc?: string; // Optional mobile-optimized version
  mobileWidth?: number;
  mobileHeight?: number;
}

export function ResponsiveImage({
  src,
  mobileSrc,
  mobileWidth,
  mobileHeight,
  ...props
}: ResponsiveImageProps) {
  const isDesktop = useIsDesktop();

  return (
    <Image
      src={isDesktop ? src : (mobileSrc || src)}
      width={isDesktop ? props.width : (mobileWidth || props.width)}
      height={isDesktop ? props.height : (mobileHeight || props.height)}
      {...props}
    />
  );
}
```

3. **Audit and optimize hero images**

```bash
# Find large images in public/
find public -type f \( -iname "*.jpg" -o -iname "*.png" \) -size +500k -exec ls -lh {} \;

# Use next/image's built-in optimization
# Ensure all images use next/image (not <img> tags)
```

4. **Enable aggressive lazy loading for below-fold images**

```tsx
// For images below the fold
<Image
  src="/project-screenshot.jpg"
  alt="Project"
  width={800}
  height={600}
  loading="lazy"
  sizes="(max-width: 768px) 100vw, 800px"
/>
```

**Expected Impact:**
- 50-60% reduction in image payload for mobile
- Faster LCP for image-heavy pages
- Reduced data usage on mobile networks

---

### 2.5.3: Font Loading Optimization (Medium-High Priority)

**Goal**: Eliminate font-related layout shifts and FOIT/FOUT

**Note**: User reported font preloading didn't help before. Focus on font-display and subsetting instead.

**Actions:**

1. **Update font-display strategy for mobile**

```tsx
// src/app/layout.tsx
import { Inter, Lora } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Prevent FOIT, allow FOUT (better for mobile)
  variable: '--font-sans',
  fallback: ['system-ui', 'sans-serif'], // Immediate fallback
  adjustFontFallback: true, // Reduce layout shift
});

const lora = Lora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
  fallback: ['Georgia', 'serif'],
  adjustFontFallback: true,
});
```

2. **Reduce font weights loaded (mobile-specific)**

```tsx
// Only load essential weights for mobile
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  weight: ['400', '600'], // Remove 700, 800 if not critical
});
```

3. **Add font-metric overrides to reduce CLS**

```css
/* src/app/globals.css */
@layer base {
  /* Size adjust fallback to match Inter metrics */
  @font-face {
    font-family: 'Inter Fallback';
    src: local('Arial');
    size-adjust: 107%;
    ascent-override: 90%;
    descent-override: 22%;
    line-gap-override: 0%;
  }

  body {
    font-family: var(--font-sans), 'Inter Fallback', system-ui, sans-serif;
  }
}
```

**Expected Impact:**
- Eliminate font-related CLS
- Faster perceived performance (text visible sooner)
- Reduced font payload by 30-40%

---

### 2.5.4: Mobile-Specific Critical CSS Extraction (Medium Priority)

**Goal**: Inline only mobile-critical CSS, defer the rest

**Actions:**

1. **Use Next.js experimental optimizeCss (if stable)**

```typescript
// next.config.ts
const nextConfig = {
  experimental: {
    optimizeCss: true, // Requires 'critters' package
  },
};
```

Install dependencies:
```bash
npm install --save-dev critters
```

2. **Manual critical CSS extraction for homepage (if needed)**

```bash
# Install critical CSS tool
npm install --save-dev critical

# Extract critical CSS for mobile
npx critical http://localhost:3000 \
  --base public \
  --inline \
  --minify \
  --width 375 \
  --height 667 \
  --target src/app/critical-mobile.css
```

3. **Conditionally inline critical CSS for mobile**

```tsx
// src/app/layout.tsx
import { headers } from 'next/headers';

export default function RootLayout({ children }) {
  const headersList = headers();
  const userAgent = headersList.get('user-agent') || '';
  const isMobile = /mobile/i.test(userAgent);

  return (
    <html>
      <head>
        {isMobile && (
          <style
            dangerouslySetInnerHTML={{
              __html: `/* Critical mobile CSS */`,
            }}
          />
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}
```

**Expected Impact:**
- 20-30% faster initial paint for mobile
- Reduced render-blocking CSS

---

### 2.5.5: Third-Party Script Optimization (Variable Impact)

**Goal**: Defer or eliminate third-party scripts blocking mobile LCP

**Actions:**

1. **Audit all third-party scripts**

```tsx
// Find all <Script> tags in the app
// Check if they're blocking or defer/async
```

2. **Move analytics to post-hydration**

```tsx
// src/app/layout.tsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}

        {/* Load analytics AFTER page interactive */}
        <Script
          src="https://analytics.example.com/script.js"
          strategy="lazyOnload" // Not "beforeInteractive"
        />
      </body>
    </html>
  );
}
```

3. **Conditionally disable heavy scripts on mobile (if appropriate)**

```tsx
'use client';

import { useIsDesktop } from '@/hooks/useMediaQuery';
import { useEffect } from 'react';

export function ConditionalAnalytics() {
  const isDesktop = useIsDesktop();

  useEffect(() => {
    // Only load heavy analytics on desktop
    if (isDesktop && typeof window !== 'undefined') {
      // Load analytics
    }
  }, [isDesktop]);

  return null;
}
```

**Expected Impact:**
- 10-20% improvement in TTI
- Lower main thread blocking time

---

### 2.5.6: Server-Side Rendering Optimization (Medium Priority)

**Goal**: Reduce TTFB and improve initial HTML delivery for mobile

**Actions:**

1. **Enable static generation where possible**

```tsx
// For pages that don't change often
export const revalidate = 3600; // Revalidate every hour (ISR)

// Or full static generation
export const dynamic = 'force-static';
```

2. **Optimize Sanity queries for mobile**

```typescript
// src/lib/sanity/queries/blog.ts
// Only fetch fields needed for mobile view
export const blogPostBySlugQueryMobile = groq`
  *[_type == "blog" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    // Exclude heavy fields like body on mobile
  }
`;
```

3. **Add streaming SSR for slow sections**

```tsx
// src/app/(public)/page.tsx
import { Suspense } from 'react';

export default function HomePage() {
  return (
    <>
      <HeroSection />

      {/* Stream in slower content */}
      <Suspense fallback={<LoadingSkeleton />}>
        <SlowDataSection />
      </Suspense>
    </>
  );
}
```

**Expected Impact:**
- 15-25% reduction in TTFB
- Faster First Contentful Paint (FCP)

---

## Implementation Sequence

### Week 1: High-Impact Quick Wins
1. **Day 1-2**: JavaScript bundle optimization (2.5.1)
   - Add bundle analyzer
   - Identify and lazy-load heavy components
   - Optimize React Query config
2. **Day 3-4**: Image optimization (2.5.2)
   - Add `sizes` attribute to all images
   - Create ResponsiveImage wrapper
   - Audit hero images
3. **Day 5**: Test and measure
   - Run Lighthouse mobile tests
   - Compare before/after metrics
   - Document improvements

### Week 2: Font & Script Optimization
1. **Day 1-2**: Font loading (2.5.3)
   - Update font-display strategy
   - Reduce font weights
   - Add fallback metrics
2. **Day 3**: Third-party scripts (2.5.5)
   - Audit and defer scripts
   - Move analytics to lazyOnload
3. **Day 4-5**: Test and measure
   - Full mobile Lighthouse audit
   - Real-device testing (if possible)

### Week 3: Advanced Optimizations (If Needed)
1. **Day 1-3**: Critical CSS (2.5.4)
   - Extract critical mobile CSS
   - Test inline strategy
2. **Day 4-5**: SSR optimization (2.5.6)
   - Enable static generation
   - Add streaming for slow sections

## Success Criteria

### Target Metrics (Mobile)

| Metric | Current | Target | Phase Responsible |
|--------|---------|--------|-------------------|
| Performance Score | 67 | 90+ | All phases |
| LCP | Unknown | < 2.5s | 2.5.1, 2.5.2 |
| FCP | Unknown | < 1.8s | 2.5.3, 2.5.6 |
| TTI | Unknown | < 3.8s | 2.5.1, 2.5.5 |
| Total Blocking Time | Unknown | < 200ms | 2.5.1 |
| CLS | Unknown | < 0.1 | 2.5.3 |

### Measurement Strategy

```bash
# Run mobile Lighthouse before each phase
npx lighthouse http://localhost:3000 \
  --only-categories=performance \
  --preset=desktop \
  --view

# Mobile-specific test
npx lighthouse http://localhost:3000 \
  --only-categories=performance \
  --preset=mobile \
  --throttling.cpuSlowdownMultiplier=4 \
  --view

# Test on real mobile device (best practice)
# 1. Deploy to Vercel preview
# 2. Test on actual Android/iOS device
# 3. Use Chrome DevTools remote debugging
```

## Rollback Plan

If any phase causes issues:

1. **Immediate rollback**: `git revert <commit-hash>`
2. **Restore previous config**: Keep backups of modified configs
3. **Staged deployment**: Test each phase in Vercel preview before merging to main

## Dependencies

**Required packages** (might need installation):
```bash
npm install --save-dev @next/bundle-analyzer
npm install --save-dev critters  # If using experimental.optimizeCss
```

**No changes needed** (already in project):
- `next/image` (already used)
- `next/dynamic` (already used for admin)
- `@/hooks/useMediaQuery` (already exists)

## Files Modified (Estimated)

### Phase 2.5.1 (JavaScript)
- `next.config.ts` - Bundle analyzer
- `src/app/(public)/page.tsx` - Dynamic imports
- `src/app/providers.tsx` - React Query config

### Phase 2.5.2 (Images)
- `src/components/ui/ResponsiveImage.tsx` - NEW file
- All components using `<Image>` - Add `sizes` attribute (estimate: 10-15 files)

### Phase 2.5.3 (Fonts)
- `src/app/layout.tsx` - Font configuration
- `src/app/globals.css` - Fallback metrics

### Phase 2.5.4 (Critical CSS)
- `next.config.ts` - optimizeCss flag
- `src/app/layout.tsx` - Conditional inline CSS (if manual)

### Phase 2.5.5 (Scripts)
- `src/app/layout.tsx` - Script strategy changes
- Any components with third-party integrations

### Phase 2.5.6 (SSR)
- Route pages with `export const revalidate` or `dynamic`
- `src/lib/sanity/queries/blog.ts` - Mobile-optimized queries (optional)

## Testing Checklist

Before considering phase complete:

- [ ] Mobile Lighthouse score improved by at least 10 points
- [ ] No new console errors or warnings
- [ ] Visual regression test passes (mobile viewport)
- [ ] All interactive features still work on mobile
- [ ] Build succeeds without errors
- [ ] Preview deployment loads correctly on real mobile device
- [ ] No increase in CLS or other Core Web Vitals degradation

## Notes

- **Phase 1 success**: Desktop scores already improved via Tailwind optimization
- **Font preloading caveat**: User reported no benefit before - focus on `font-display` and subsetting
- **Mobile vs Desktop**: Different bottlenecks require different strategies
- **Progressive enhancement**: Each phase should improve scores incrementally
- **Real device testing**: Lighthouse mobile simulation ≠ actual device performance

## Related Documentation

- Phase 1 Complete: `/memory-bank/CURRENT.md`
- Original Plan: `/docs/css-lcp-optimization-plan.md` (Phases 1-6)
- Next.js Image Optimization: https://nextjs.org/docs/pages/building-your-application/optimizing/images
- Bundle Analyzer: https://www.npmjs.com/package/@next/bundle-analyzer
- Core Web Vitals: https://web.dev/vitals/
