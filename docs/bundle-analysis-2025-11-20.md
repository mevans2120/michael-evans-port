# Bundle Analysis Report

**Date**: November 20, 2025
**Tool**: @next/bundle-analyzer
**Build**: Production

## Summary

**Total Client Bundle**: ~4MB (uncompressed)
**Shared Bundle**: 103 kB

### Top 5 Largest Chunks:

1. **d8e9270f-c9a1f107fc67750e.js** - 2.3 MB (Sanity Studio)
2. **6115-e030771ce8bb74ea.js** - 1.0 MB
3. **a4634e51.b7fbc39e0fc043e6.js** - 500 KB
4. **4396.7f9af004b0323689.js** - 500 KB
5. **3054-07d6c90b96fbb3fa.js** - 316 KB

## Analysis

### Sanity Studio (2.3 MB)
- **Route**: `/studio/[[...tool]]`
- **Size**: 2.3 MB (largest chunk)
- **Status**: ✅ Already isolated to `/studio` route
- **Impact**: Admin-only, doesn't affect public pages
- **Action**: ✅ No optimization needed (already route-split)

### TanStack Query Configuration
- **Current**: Basic configuration (60s stale time)
- **Opportunity**: Optimize for mobile performance
- **Action**: Add mobile-optimized settings

### React & Framework (180 KB)
- **Status**: ✅ Optimal for Next.js application
- **Action**: No optimization needed

## Optimizations Implemented

### 1. TanStack Query Mobile Optimization

**File**: `/src/components/providers/query-provider.tsx`

**Before**:
```typescript
const [queryClient] = useState(() => new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
}))
```

**After**:
```typescript
const [queryClient] = useState(() => new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 min - reduce refetches on slow connections
      gcTime: 1000 * 60 * 10,   // 10 min cache (formerly cacheTime)
      refetchOnWindowFocus: false, // Don't refetch on focus (saves mobile battery)
      refetchOnReconnect: true,    // But refetch when reconnected
      retry: 1,                     // Reduce retry attempts on mobile (faster failures)
    },
  },
}))
```

**Benefits**:
- Reduced network requests on mobile
- Better battery life (fewer background refetches)
- Faster failure handling (1 retry vs 3 default)
- Longer cache times suitable for content that doesn't change often

### 2. Bundle Analyzer Integration

**File**: `/next.config.ts`

Added bundle analyzer wrapper:
```typescript
import withBundleAnalyzer from '@next/bundle-analyzer';

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default bundleAnalyzer(nextConfig);
```

**Usage**:
```bash
ANALYZE=true npm run build
# Opens browser with visual bundle analysis
```

## Key Findings

### ✅ Good News:

1. **Sanity Studio is properly isolated** - 2.3MB chunk only loads on `/studio` route
2. **Public pages are lightweight** - Homepage is only 182 KB first load
3. **Code splitting is working** - Each route has its own chunk
4. **Already optimized packages** - Using `optimizePackageImports` for Radix UI and lucide-react

### 🎯 Optimization Opportunities (Not Implemented):

1. **Dynamic imports for heavy components** - Could lazy load modals, chatbot
2. **Icon tree-shaking** - Verify lucide-react icons are tree-shaken
3. **Utility library optimization** - Check for heavy utility imports

### ⚠️ Low Priority:

1. **Framework chunk (180 KB)** - This is React/Next.js, cannot be reduced
2. **Shared chunks (103 KB)** - Optimal size for shared code

## Recommendations

### Immediate (Implemented)
- ✅ Optimize TanStack Query for mobile

### Short-term (Optional)
- 🔄 Dynamic import for ChatInterface component (if large)
- 🔄 Dynamic import for modals that aren't immediately visible

### Long-term (Monitor)
- 📊 Track bundle size over time
- 📊 Set up bundle size budgets
- 📊 Monitor First Load JS for each route

## Testing

### Before Optimization:
- First Load JS: 103 kB (shared)
- Homepage: 182 kB total

### After Optimization:
- No change in bundle size (QueryClient config doesn't affect bundle size)
- Expected performance improvement: Reduced network requests on mobile

## Metrics to Watch

| Metric | Current | Target | Notes |
|--------|---------|--------|-------|
| Shared Bundle | 103 kB | < 120 kB | ✅ Optimal |
| Homepage First Load | 182 kB | < 200 kB | ✅ Excellent |
| Blog Post | 204 kB | < 220 kB | ✅ Good |
| Case Study | 214 kB | < 250 kB | ✅ Good |
| Contact Page | 209 kB | < 220 kB | ✅ Good |

## Analysis Files

Bundle analyzer generated three reports:
- `.next/analyze/client.html` - Client-side bundles (most important)
- `.next/analyze/nodejs.html` - Server-side bundles
- `.next/analyze/edge.html` - Edge runtime bundles

## Conclusion

The bundle is already well-optimized:
- ✅ Sanity Studio properly isolated
- ✅ Public pages are lightweight
- ✅ Code splitting working correctly
- ✅ Package imports optimized

The TanStack Query optimization provides mobile performance benefits without reducing bundle size, focusing on runtime performance instead.

---

**Next Steps**: Monitor mobile Lighthouse scores to measure impact of QueryClient optimization.
