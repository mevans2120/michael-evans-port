# Case Study Performance Improvement Plan

**Date:** November 17, 2025
**Current RES:** 38 (Poor)
**Target RES:** 90+ (Great)
**Page:** `/case-studies/[slug]`

---

## Current Metrics (Vercel Speed Insights)

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| **Real Experience Score** | 38 | >90 | ❌ CRITICAL |
| **First Contentful Paint** | 3.48s | <1.8s | ❌ CRITICAL |
| **Largest Contentful Paint** | 7.22s | <2.5s | ❌ CRITICAL |
| **Cumulative Layout Shift** | 0.54 | <0.1 | ❌ CRITICAL |
| Interaction to Next Paint | 48ms | <200ms | ✅ GOOD |
| First Input Delay | 5ms | <100ms | ✅ GOOD |
| Time to First Byte | 0.77s | <0.6s | ⚠️ ACCEPTABLE |

---

## Performance Drop Timeline

Looking at the Speed Insights graph:
- **Nov 10-12:** RES was 90 (Great) ✅
- **Nov 13:** Score dropped to ~40 ❌
- **Nov 14-17:** Score remains at 38-40 ❌

**Analysis:** The drop coincides with deployment around Nov 13. Need to investigate what changed in that deployment.

---

## Root Cause Analysis

### 1. LCP: 7.22s (Hero Images)

**Problem:** Hero images taking 7+ seconds to become fully visible.

**Causes:**
- ✅ **FIXED:** Using `<img>` instead of Next.js `<Image>` component (EditorialHero.tsx)
- TODO: Other image components may have same issue
- Image size not optimized at CDN level
- No priority loading for above-the-fold images

### 2. CLS: 0.54 (Layout Shift)

**Problem:** Content shifting significantly during page load.

**Causes:**
- Images loading without explicit dimensions
- Font swapping causing text reflow
- Dynamic content insertion
- Missing aspect ratios on image containers

### 3. FCP: 3.48s (Render Blocking)

**Problem:** Blank page for 3.5 seconds before any content appears.

**Causes:**
- CSS bundle size (19.8 KB from Lighthouse report)
- Render-blocking font loading
- No critical CSS inlined
- JavaScript bundle blocking initial paint

---

## Implementation Plan

### ✅ Phase 1: Fix Hero Image (COMPLETED)

**Status:** DONE (Nov 17, 2025)

**Changes:**
- Replaced `<img>` with `<Image>` in EditorialHero.tsx
- Added `priority` flag for preloading
- Added explicit `aspect-[4/3]` for CLS prevention
- Added responsive `sizes` attribute

**Expected Impact:**
- LCP: 7.22s → 3-4s (50% improvement)
- CLS: 0.54 → 0.3 (45% improvement)

---

### Phase 2: Fix All Image Components ⚠️ HIGH PRIORITY

**Target Files:**
1. `src/components/case-study-flowing/ArticleContent.tsx` - Article images
2. `src/components/case-study-flowing/PortraitImageList.tsx` - Portrait images
3. `src/components/case-study-editorial/VisualCards.tsx` - Visual card images
4. Any other components using `<img>` tags

**Action Items:**
1. Replace all `<img>` with Next.js `<Image>`
2. Add explicit dimensions or `aspect-ratio`
3. Add `loading="lazy"` for below-fold images
4. Add `priority` only for above-fold images
5. Use appropriate `sizes` attribute

**Expected Impact:**
- CLS: 0.3 → 0.05 (83% improvement)
- LCP: Minor improvement from lazy loading

---

### Phase 3: Optimize Image Delivery ⚠️ HIGH PRIORITY

**Problem:** Sanity images may not be optimally sized/compressed.

**Action Items:**

1. **Review Image Presets** (image-builder.ts)
   ```typescript
   // Current hero preset
   hero: {
     width: 1200,
     quality: 85,
     auto: 'format',
   }

   // Consider:
   - Reduce quality to 80 (visual diff minimal)
   - Add WebP/AVIF format via auto: 'format'
   - Implement responsive srcset
   ```

2. **Add Blur Placeholders**
   ```typescript
   <Image
     src={imageUrl}
     blurDataURL={metadata.lqip}
     placeholder="blur"
   />
   ```

3. **Implement Responsive Images**
   - Use Next.js `srcset` for different viewport sizes
   - Serve smaller images on mobile

**Expected Impact:**
- LCP: 3-4s → 2-2.5s (25% improvement)
- Smaller image payloads

---

### Phase 4: Critical CSS Inlining ⭐ MEDIUM PRIORITY

**Problem:** 19.8 KB CSS bundle blocking initial render.

**Action Items:**

1. **Extract Critical CSS**
   - Identify above-the-fold styles
   - Hero section styles
   - Font declarations
   - Layout styles

2. **Inline Critical CSS** in `app/case-studies/[slug]/page.tsx`:
   ```typescript
   export default async function CaseStudyPage({ params }) {
     return (
       <>
         <style dangerouslySetInnerHTML={{__html: `
           /* Critical styles */
           .hero { /* ... */ }
           /* etc */
         `}} />
         <EditorialHero ... />
       </>
     )
   }
   ```

3. **Defer Non-Critical CSS**
   - Load full stylesheet after initial paint
   - Use `rel="preload" as="style"` pattern

**Expected Impact:**
- FCP: 3.48s → 1.5-2s (50% improvement)
- LCP: 2-2.5s → 1.8-2s (10% improvement)

---

### Phase 5: Font Optimization ⭐ LOW PRIORITY

**Current Status:** Already using `next/font/google` with `display: "swap"`

**Potential Improvements:**

1. **Add Font Subsetting**
   ```typescript
   const dmSans = DM_Sans({
     subsets: ["latin"],
     // Add specific character ranges if possible
   })
   ```

2. **Reduce Font Weights** (if possible)
   - Currently loading 5 weights for DM Sans
   - Audit which weights are actually used
   - Consider removing unused weights

3. **Preconnect to Font CDN**
   - Already handled by next/font

**Expected Impact:**
- Minor FCP improvement (100-200ms)

---

### Phase 6: Code Splitting & Bundle Optimization 🔍 INVESTIGATE

**Problem:** Case study page is 214 KB first load JS.

**Action Items:**

1. **Analyze Bundle**
   ```bash
   npm run build -- --analyze
   # Or use @next/bundle-analyzer
   ```

2. **Code Split Heavy Components**
   - ViewMoreProjects (might be heavy)
   - Chatbot components (if loaded on case studies)
   - Chart/visualization libraries

3. **Dynamic Imports** for below-fold components
   ```typescript
   const ViewMoreProjects = dynamic(() => import('@/components/view-more-projects'))
   ```

**Expected Impact:**
- TBD after analysis
- Potentially 10-20% JS bundle reduction

---

### Phase 7: Server Response Time 🔍 INVESTIGATE

**Current TTFB:** 0.77s (acceptable but could be better)

**Action Items:**

1. **Review Data Fetching**
   - Check if Sanity queries are optimized
   - Ensure proper caching headers
   - Consider ISR (Incremental Static Regeneration)

2. **Enable Edge Caching**
   - Vercel Edge Config
   - CDN caching for static content

3. **Database Query Optimization**
   - Review EDITORIAL_PROJECT_QUERY
   - Ensure indexes exist
   - Minimize data fetched

**Expected Impact:**
- TTFB: 0.77s → 0.3-0.5s (35-60% improvement)

---

## Testing & Validation

### Test Commands

```bash
# Production build
npm run build && npm start

# Lighthouse CLI (local)
npx lighthouse http://localhost:3000/case-studies/aesop --view

# Lighthouse CI (production)
npx lighthouse https://mevans.space/case-studies/aesop --view \
  --throttling-method=devtools \
  --throttling.cpuSlowdownMultiplier=4

# Check bundle sizes
npm run build && ls -lh .next/static/css/
```

### Success Criteria

| Metric | Target | Method |
|--------|--------|--------|
| RES | >90 | Vercel Speed Insights |
| LCP | <2.5s | Lighthouse + RUM |
| FCP | <1.8s | Lighthouse + RUM |
| CLS | <0.1 | Lighthouse + RUM |
| Lighthouse Score | >85 | Lighthouse CI |

---

## Monitoring

### Vercel Speed Insights

- Dashboard: https://vercel.com/mevans2120/analytics
- Filter by: `/case-studies/[slug]`
- Monitor RES trend over 7 days after each phase

### Lighthouse CI

Consider setting up automated Lighthouse testing:
- Run on every PR
- Track scores over time
- Alert on regressions

---

## Expected Results Summary

| Phase | Effort | Expected RES | Notes |
|-------|--------|--------------|-------|
| Phase 1 (Hero Image) | ✅ 30min | 55-60 | DONE |
| Phase 2 (All Images) | 1-2 hours | 70-75 | High priority |
| Phase 3 (Image Delivery) | 2-3 hours | 80-85 | High priority |
| Phase 4 (Critical CSS) | 3-4 hours | 85-90 | Medium priority |
| Phase 5 (Fonts) | 1 hour | +2-3 points | Low priority |
| Phase 6 (Bundle) | TBD | +2-5 points | Investigate first |
| Phase 7 (TTFB) | TBD | +2-5 points | Investigate first |

**Total Estimated Effort:** 7-10 hours for Phases 2-4
**Expected Final RES:** 85-95 (Great)

---

## Next Steps

1. ✅ Deploy Phase 1 (Hero Image fix) to production
2. Monitor Vercel Speed Insights for 24-48 hours
3. Implement Phase 2 (All Images)
4. Implement Phase 3 (Image Delivery)
5. Re-evaluate after Phase 3 - may hit target without Phase 4

---

## References

- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Web.dev: Optimize LCP](https://web.dev/articles/optimize-lcp)
- [Web.dev: Optimize CLS](https://web.dev/articles/optimize-cls)
- [Vercel Speed Insights](https://vercel.com/docs/speed-insights)
- [Sanity Image CDN](https://www.sanity.io/docs/image-urls)

---

## Notes

- RES score of 38 → 90 requires ~60 point improvement
- Each metric contributes to RES score
- LCP has highest weight, should be primary focus
- Real user data (Vercel) more reliable than synthetic (Lighthouse)
- Test on actual mobile devices for validation
