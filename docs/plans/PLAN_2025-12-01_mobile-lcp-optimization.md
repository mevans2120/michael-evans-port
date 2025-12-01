# Plan: Mobile LCP Optimization — Two-Phase Approach

**Date:** 2025-12-01
**Tags:** performance, mobile, lighthouse, lcp, fonts, critical-css
**Target:** Improve mobile Lighthouse from 70 to 85+

## Objective

Address the mobile LCP bottleneck (2,620ms element render delay) through two incremental improvements, tested and deployed separately to measure impact.

## Background

### Current State
- Desktop: 99 (excellent)
- Mobile: 70 (needs improvement)

### Root Cause (from PageSpeed)
- **LCP Element:** Hero description `<p class="font-serif">`
- **Render Delay:** 2,620 ms
- **Critical Path:** HTML → CSS (222ms) → Font/57KB (576ms) → CSS (313ms)
- **Render Blocking CSS:** 780ms potential savings

### Why Two Phases
- Isolate the impact of each change
- Easier rollback if issues arise
- Clear before/after measurement per change

---

## Phase 1: Preload Newsreader Font

**Goal:** Reduce LCP by preloading the font used for the LCP element

### Current Configuration
```typescript
// src/app/layout.tsx
const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
  preload: false,  // ← Currently not preloaded
  fallback: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
  adjustFontFallback: true,
});
```

### Change Required
```typescript
const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
  preload: true,   // ← Enable preloading
  fallback: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
  adjustFontFallback: true,
});
```

### Rationale
- The LCP element uses `font-serif` (Newsreader)
- Currently `preload: false` means the font loads late in the cascade
- Preloading moves the font request earlier, reducing render delay
- `display: "swap"` ensures text is visible immediately with fallback

### Expected Impact
- 400-600ms reduction in LCP
- Font loads in parallel with CSS instead of after
- Mobile score improvement: 70 → 75-80

### Validation Steps
1. Run `npm run build` to verify no errors
2. Deploy to Vercel preview
3. Run PageSpeed Insights on preview URL
4. Compare LCP breakdown before/after
5. If improved, merge to main and re-test production

### Rollback
```typescript
preload: false  // Revert to original
```

---

## Phase 2: Enable Critical CSS Extraction

**Goal:** Eliminate render-blocking CSS by inlining critical styles

### Prerequisite
- Install critters package (required by Next.js optimizeCss)

### Changes Required

**1. Install dependency:**
```bash
npm install --save-dev critters
```

**2. Update next.config.ts:**
```typescript
const nextConfig = {
  // ... existing config
  experimental: {
    optimizeCss: true,
  },
};
```

### How It Works
- Critters analyzes the page HTML
- Extracts CSS rules needed for above-the-fold content
- Inlines critical CSS in `<head>`
- Defers non-critical CSS loading
- Result: Initial paint doesn't wait for full CSS download

### Expected Impact
- 500-780ms reduction in render-blocking time
- Faster First Contentful Paint (FCP)
- Mobile score improvement: 75-80 → 85-90

### Validation Steps
1. Run `npm run build` to verify critters integration works
2. Inspect built HTML to confirm inline styles present
3. Deploy to Vercel preview
4. Run PageSpeed Insights
5. Verify "Render blocking requests" warning reduced/eliminated
6. If improved, merge to main

### Rollback
```typescript
// next.config.ts - remove or set to false
experimental: {
  optimizeCss: false,
},
```

And remove the package:
```bash
npm uninstall critters
```

---

## Implementation Checklist

### Phase 1: Font Preloading
- [ ] Update `preload: true` in layout.tsx
- [ ] Run `npm run build`
- [ ] Commit: "perf: preload Newsreader font for faster LCP"
- [ ] Push and deploy
- [ ] Run PageSpeed Insights (mobile)
- [ ] Document results

### Phase 2: Critical CSS
- [ ] Run `npm install --save-dev critters`
- [ ] Add `optimizeCss: true` to next.config.ts
- [ ] Run `npm run build`
- [ ] Verify inline styles in built HTML
- [ ] Commit: "perf: enable critical CSS extraction via critters"
- [ ] Push and deploy
- [ ] Run PageSpeed Insights (mobile)
- [ ] Document results

---

## Success Criteria

| Metric | Before | After Phase 1 | After Phase 2 |
|--------|--------|---------------|---------------|
| Mobile Score | 70 | 75-80 | 85+ |
| LCP | ~3.5s | ~2.5s | ~2.0s |
| Render Blocking | 780ms | 780ms | <200ms |

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Font preload increases initial HTML size | Low | Low | Minimal increase, browser handles well |
| Critters breaks build | Medium | Medium | Test thoroughly before merging |
| Critical CSS misses some styles | Low | Medium | Visual review of deployed site |
| Performance regression | Low | High | Test each phase separately, easy rollback |

---

## Files Modified

### Phase 1
- `src/app/layout.tsx` (1 line change)

### Phase 2
- `package.json` (add critters)
- `next.config.ts` (add experimental flag)

---

## Related Documentation

- [Phase 2.5 Mobile Optimization Plan](../css-lcp-optimization-phase-2.5-mobile.md)
- [Sanity Caching Architecture](./PLAN_2025-12-01_sanity-caching-architecture.md)
- [Next.js CSS Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/css)
- [Critters Package](https://github.com/GoogleChromeLabs/critters)
