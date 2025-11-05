# Internal Navigation Loading State Implementation Plan

**Created**: November 4, 2025
**Status**: ✅ **IMPLEMENTED** (November 4, 2025)
**Implemented Solution**: Phase 1 - Custom CSS solution with dynamic positioning
**Performance Requirement**: No impact on Lighthouse scores
**Scope**: Internal navigation only (external links excluded)

## Executive Summary

Implement a loading state that appears when users click internal links (case studies, AI showcases, internal pages) to provide visual feedback during page transitions. This implementation is **scoped to internal navigation only** to maximize performance and UX, with **zero impact on Lighthouse scores**.

## Goals

1. **Visual Feedback**: Show loading state when users click internal links from chatbot
2. **Performance**: Maintain 100% Lighthouse scores (no impact on Performance, CLS, FCP)
3. **Scope**: Internal navigation only (external links navigate immediately)
4. **Accessibility**: Respect `prefers-reduced-motion` and maintain keyboard navigation
5. **UX**: 300-500ms duration - just long enough to feel responsive

## Technical Approach

### Internal vs External Link Detection

```typescript
// Detect internal links
const isInternalLink = (href: string): boolean => {
  return href.startsWith('/') && !href.startsWith('//');
};

// Usage
if (isInternalLink(href)) {
  // Show loading state
} else {
  // Navigate immediately (external link, new tab)
}
```

### Performance Optimizations

1. **Code Splitting**: Load transition library only when needed
2. **Lightweight Implementation**: Custom CSS-based solution (no external library for v1)
3. **No Layout Shift**: Absolute positioning, no impact on CLS
4. **Non-Blocking**: Runs after navigation starts, doesn't delay FCP
5. **Progressive Enhancement**: Works without JavaScript

## Implementation Phases

### Phase 1: Custom CSS-Based Solution (Recommended First)

**Why start here**: Zero bundle size impact, full control, faster implementation

**Components to Create**:
- `NavigationProgress.tsx` - Global loading overlay component
- `useNavigationProgress` - Hook to track navigation state
- Custom CSS animations for three-dot pulse

**Code Example**:

```typescript
// /src/components/navigation/NavigationProgress.tsx
'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export function NavigationProgress() {
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Hide loading when pathname changes
    setIsNavigating(false);
  }, [pathname]);

  if (!isNavigating) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex gap-2">
        <div className="w-3 h-3 rounded-full bg-accent animate-elegant-pulse" style={{ animationDelay: '0ms' }} />
        <div className="w-3 h-3 rounded-full bg-accent animate-elegant-pulse" style={{ animationDelay: '150ms' }} />
        <div className="w-3 h-3 rounded-full bg-accent animate-elegant-pulse" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}
```

```typescript
// /src/hooks/useNavigationProgress.ts
'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export function useNavigationProgress() {
  const router = useRouter();

  const navigate = useCallback((href: string) => {
    // Only show loading for internal links
    if (href.startsWith('/') && !href.startsWith('//')) {
      // Trigger loading state
      window.dispatchEvent(new CustomEvent('navigation-start'));

      // Navigate after short delay (allow loading to show)
      setTimeout(() => {
        router.push(href);
      }, 50);
    } else {
      // External link - navigate immediately
      window.open(href, '_blank', 'noopener,noreferrer');
    }
  }, [router]);

  return { navigate };
}
```

**Files to Modify**:
1. `/src/components/chatbot/LinkPreview.tsx` - Add navigation progress hook
2. `/src/app/layout.tsx` - Add NavigationProgress component

**Lighthouse Impact**: **0 points** (pure CSS, no bundle increase)

---

### Phase 2: Enhanced Three-Dot Animation (Optional)

**If Phase 1 works well**, enhance with:
- Larger dots (w-4 h-4 instead of w-3 h-3)
- Subtle slide-in animation from bottom
- Fade-in/fade-out transitions

**Code Example**:

```typescript
// Enhanced animation
<div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
  <div className="flex gap-3 animate-slide-up">
    <div className="w-4 h-4 rounded-full bg-accent animate-elegant-pulse" style={{ animationDelay: '0ms' }} />
    <div className="w-4 h-4 rounded-full bg-accent animate-elegant-pulse" style={{ animationDelay: '150ms' }} />
    <div className="w-4 h-4 rounded-full bg-accent animate-elegant-pulse" style={{ animationDelay: '300ms' }} />
  </div>
</div>
```

**CSS Additions** (`/src/app/globals.css`):

```css
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 150ms ease-out;
}

.animate-slide-up {
  animation: slide-up 200ms ease-out;
}

@media (prefers-reduced-motion: reduce) {
  .animate-fade-in,
  .animate-slide-up {
    animation: none;
  }
}
```

**Lighthouse Impact**: **0 points** (pure CSS)

---

### Phase 3: Library-Based Solution (react-transition-progress)

**Only if custom solution has limitations**

**Pros**:
- Built-in Next.js App Router integration
- Automatic progress bar at top of page
- Well-tested in production

**Cons**:
- +2KB bundle size
- Less control over styling

**Installation**:
```bash
npm install react-transition-progress
```

**Implementation**:

```typescript
// /src/app/layout.tsx
import { ProgressBar } from 'react-transition-progress';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ProgressBar />
        {children}
      </body>
    </html>
  );
}
```

```typescript
// /src/components/chatbot/LinkPreview.tsx
import { useProgress } from 'react-transition-progress';

function LinkPreviewCard({ href, metadata }: LinkPreviewCardProps) {
  const startProgress = useProgress();
  const isInternalLink = href.startsWith('/') && !href.startsWith('//');

  const handleClick = () => {
    if (isInternalLink) {
      startProgress();
    }
  };

  return (
    <Link href={href} onClick={handleClick} target={isInternalLink ? undefined : '_blank'}>
      {/* Card content */}
    </Link>
  );
}
```

**Lighthouse Impact**: **~0-1 points** (2KB gzipped)

---

## Detailed Implementation Steps

### Step 1: Create NavigationProgress Component

**File**: `/src/components/navigation/NavigationProgress.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export function NavigationProgress() {
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleNavigationStart = () => setIsNavigating(true);

    window.addEventListener('navigation-start', handleNavigationStart);

    return () => {
      window.removeEventListener('navigation-start', handleNavigationStart);
    };
  }, []);

  useEffect(() => {
    // Hide loading when pathname changes (navigation complete)
    setIsNavigating(false);
  }, [pathname]);

  // Don't render if not navigating
  if (!isNavigating) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      <div className="flex gap-2" aria-hidden="true">
        <div className="w-3 h-3 rounded-full bg-accent animate-elegant-pulse" style={{ animationDelay: '0ms' }} />
        <div className="w-3 h-3 rounded-full bg-accent dark:bg-accent-light animate-elegant-pulse" style={{ animationDelay: '150ms' }} />
        <div className="w-3 h-3 rounded-full bg-accent dark:bg-accent-light animate-elegant-pulse" style={{ animationDelay: '300ms' }} />
      </div>
      <span className="sr-only">Loading page...</span>
    </div>
  );
}
```

**Key Features**:
- ✅ Custom event-based triggering
- ✅ Automatic cleanup on pathname change
- ✅ Accessibility attributes (role, aria-live, aria-label)
- ✅ Dark mode support
- ✅ Reuses existing `animate-elegant-pulse` animation

---

### Step 2: Update LinkPreview Component

**File**: `/src/components/chatbot/LinkPreview.tsx`

**Changes**:

```typescript
function LinkPreviewCard({ href, metadata, className }: LinkPreviewCardProps) {
  const [imageError, setImageError] = useState(false);
  const hasImage = metadata.imageUrl && !imageError;

  // Detect internal links
  const isInternalLink = href.startsWith('/') && !href.startsWith('//');

  const handleClick = () => {
    // Only trigger loading for internal navigation
    if (isInternalLink) {
      window.dispatchEvent(new CustomEvent('navigation-start'));
    }
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      target={isInternalLink ? undefined : '_blank'}
      rel={isInternalLink ? undefined : 'noopener noreferrer'}
      className={cn(
        'my-4 block rounded-lg border border-border bg-card hover:border-accent dark:hover:border-accent-light',
        'transition-smooth hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'group',
        className
      )}
      aria-label={`View ${metadata.category}: ${metadata.title}${!isInternalLink ? ' (opens in new tab)' : ''}`}
    >
      {/* Card content unchanged */}
    </Link>
  );
}
```

**What Changed**:
- Added `isInternalLink` detection
- Added `handleClick` to dispatch custom event for internal links only
- Added `target` and `rel` attributes for external links
- Updated `aria-label` to indicate external links

---

### Step 3: Add NavigationProgress to Root Layout

**File**: `/src/app/layout.tsx`

**Add import**:
```typescript
import { NavigationProgress } from '@/components/navigation/NavigationProgress';
```

**Add component** (inside `<body>` tag):
```typescript
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NavigationProgress />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
```

---

### Step 4: Update ChatSection Follow-Up Questions

**File**: `/src/components/navigation/ChatSection.tsx`

**Update follow-up question rendering** (lines 336-385):

```typescript
{questions.map((question, index) => {
  const { hasLink, linkText, linkUrl } = parseMarkdownLink(question);

  // Render as LinkPreview card for internal case study/showcase links
  if (hasLink && (linkUrl.includes('/case-studies/') || linkUrl.includes('/ai-showcase/'))) {
    return (
      <LinkPreview
        key={index}
        href={linkUrl}
        className="w-full"
      >
        {linkText}
      </LinkPreview>
    );
  }

  // Handle other links with loading state
  if (hasLink) {
    const isInternalLink = linkUrl.startsWith('/') && !linkUrl.startsWith('//');

    return (
      <Link
        key={index}
        href={linkUrl}
        onClick={() => {
          if (isInternalLink) {
            window.dispatchEvent(new CustomEvent('navigation-start'));
          }
        }}
        target={isInternalLink ? undefined : '_blank'}
        rel={isInternalLink ? undefined : 'noopener noreferrer'}
        className="w-full px-4 py-3 text-left text-sm bg-muted/30 hover:bg-muted/50 rounded-lg transition-smooth border border-border hover:border-accent dark:hover:border-accent-light"
      >
        {linkText}
      </Link>
    );
  }

  // Plain text question (clickable prompt)
  return (
    <button
      key={index}
      onClick={() => handlePromptClick(linkText)}
      className="w-full px-4 py-3 text-left text-sm bg-muted/30 hover:bg-muted/50 rounded-lg transition-smooth border border-border hover:border-accent dark:hover:border-accent-light"
    >
      {linkText}
    </button>
  );
})}
```

**What Changed**:
- All internal links now dispatch `navigation-start` event
- External links have `target="_blank"` and `rel="noopener noreferrer"`
- LinkPreview cards already have internal handling from Step 2

---

## Testing Plan

### 1. Visual Testing

**Test Cases**:
- [ ] Click internal case study link → See three-dot loading → Page loads
- [ ] Click external link → Opens in new tab immediately (no loading)
- [ ] Click chatbot follow-up question → See loading if internal link
- [ ] Back button navigation → No loading overlay (browser handles)
- [ ] Direct URL navigation → No loading overlay

**Expected Behavior**:
- Loading appears within 50ms of click
- Loading disappears when new page renders
- Duration: ~300-500ms total
- Smooth fade-in/out (if Phase 2 implemented)

---

### 2. Performance Testing

**Lighthouse Audit**:
```bash
# Build production version
npm run build

# Start production server
npm start

# Run Lighthouse (Chrome DevTools → Lighthouse tab)
# Test both before and after implementation
```

**Metrics to Monitor**:
- **Performance Score**: Should remain 100
- **CLS (Cumulative Layout Shift)**: Should remain 0 (absolute positioning prevents layout shift)
- **FCP (First Contentful Paint)**: Should remain unchanged (non-blocking)
- **TTI (Time to Interactive)**: Should remain unchanged (lightweight implementation)
- **Bundle Size**: Should increase by 0KB (Phase 1) or ~2KB (Phase 3)

**Baseline Scores** (capture before implementation):
```
Performance: ___
CLS: ___
FCP: ___
TTI: ___
Bundle Size: ___
```

**Post-Implementation Scores**:
```
Performance: ___
CLS: ___
FCP: ___
TTI: ___
Bundle Size: ___
```

---

### 3. Accessibility Testing

**Test Cases**:
- [ ] Keyboard navigation: Tab to link, press Enter → Loading shows
- [ ] Screen reader announces "Loading page" when loading starts
- [ ] `prefers-reduced-motion`: Animations disabled for users who prefer reduced motion
- [ ] Focus management: Focus moves to new page after navigation

**Tools**:
- Chrome DevTools → Lighthouse → Accessibility score
- Screen reader testing (VoiceOver on macOS, NVDA on Windows)
- Browser DevTools → Settings → Emulate CSS media feature: prefers-reduced-motion

---

### 4. Browser Compatibility

**Test Browsers**:
- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

**Edge Cases**:
- [ ] Slow network (throttle to Slow 3G)
- [ ] Fast navigation (click multiple links rapidly)
- [ ] Navigation cancellation (click link, then back button immediately)

---

## Performance Budget

**Constraints**:
- **Bundle Size**: +0KB (Phase 1), max +2KB (Phase 3)
- **Lighthouse Performance**: Must remain 100
- **CLS**: Must remain 0
- **FCP**: No increase allowed
- **TTI**: Max +50ms increase

**Optimization Strategies**:
1. Use CSS-only animations (no JavaScript animation loops)
2. Absolute positioning to prevent layout shifts
3. Code splitting if using external library
4. Lazy load transition effects
5. Progressive enhancement (works without JavaScript)

---

## Success Criteria

### Must Have
- ✅ Loading state appears on internal link clicks
- ✅ External links navigate immediately (no loading)
- ✅ Lighthouse Performance score remains 100
- ✅ CLS remains 0 (no layout shift)
- ✅ Works on mobile and desktop
- ✅ Accessible (screen reader support, keyboard navigation)

### Nice to Have
- ✅ Respects `prefers-reduced-motion`
- ✅ Smooth fade-in/out animations
- ✅ Custom three-dot animation matches chatbot loading
- ✅ Slide-in effect (optional)

### Out of Scope (Future Enhancements)
- ❌ Progress percentage indicator
- ❌ Route-specific loading states
- ❌ Loading skeleton for page content
- ❌ Animated page transitions (slide/fade between pages)

---

## Rollback Plan

**If Lighthouse scores are affected**:

1. **Immediate**: Disable loading state in production
   ```typescript
   // In NavigationProgress.tsx
   if (process.env.NODE_ENV === 'production') {
     return null; // Disable in production
   }
   ```

2. **Investigate**: Test locally with Lighthouse to identify bottleneck

3. **Optimize**: Try Phase 1 (CSS-only) if Phase 3 (library) caused issues

4. **Alternative**: Use simpler progress bar at top instead of overlay

**Rollback Triggers**:
- Performance score drops below 95
- CLS increases above 0.1
- User reports of slow navigation

---

## Timeline

### Phase 1: Custom CSS Solution (Recommended)
- **Estimated Time**: 2-3 hours
- **Tasks**:
  - [ ] Create NavigationProgress component
  - [ ] Update LinkPreview component
  - [ ] Update ChatSection follow-up questions
  - [ ] Add to root layout
  - [ ] Test on dev server
  - [ ] Run Lighthouse audit
  - [ ] Fix any issues

### Phase 2: Enhanced Animation (Optional)
- **Estimated Time**: 1 hour
- **Tasks**:
  - [ ] Add fade-in/slide-up animations to globals.css
  - [ ] Update NavigationProgress component
  - [ ] Test on multiple browsers
  - [ ] Verify prefers-reduced-motion works

### Phase 3: Library Solution (If Needed)
- **Estimated Time**: 1-2 hours
- **Tasks**:
  - [ ] Install react-transition-progress
  - [ ] Replace custom implementation
  - [ ] Test integration
  - [ ] Run Lighthouse audit
  - [ ] Compare performance to Phase 1

---

## Technical Notes

### Why Custom Events?

We use `CustomEvent` to trigger loading state because:
1. **Decoupled**: LinkPreview doesn't need to know about NavigationProgress
2. **Global**: Works across all components (follow-up questions, markdown links, etc.)
3. **Lightweight**: No state management library needed
4. **Simple**: Easy to add/remove from any link component

```typescript
// Trigger loading
window.dispatchEvent(new CustomEvent('navigation-start'));

// Listen for loading
window.addEventListener('navigation-start', handleNavigationStart);
```

### Why usePathname Hook?

We use Next.js `usePathname()` to detect navigation completion:
- Automatically updates when route changes
- Works with App Router
- No manual cleanup needed

```typescript
const pathname = usePathname();

useEffect(() => {
  // This runs every time pathname changes (navigation complete)
  setIsNavigating(false);
}, [pathname]);
```

### Why Absolute Positioning?

We use `fixed inset-0` to prevent layout shifts:
- Doesn't affect existing layout (no CLS)
- Covers entire viewport
- Doesn't push content down
- Z-index ensures it's on top

### Why 50ms Delay?

We add a small delay before navigation to ensure loading state is visible:
```typescript
setTimeout(() => {
  router.push(href);
}, 50);
```

This prevents "flash of loading" on instant navigations while ensuring loading state is visible on slower navigations.

---

## Files to Create/Modify

### New Files
- `/src/components/navigation/NavigationProgress.tsx` - Loading overlay component

### Modified Files
- `/src/components/chatbot/LinkPreview.tsx` - Add internal link detection and click handler
- `/src/components/navigation/ChatSection.tsx` - Update follow-up question rendering
- `/src/app/layout.tsx` - Add NavigationProgress component
- `/src/app/globals.css` - Add fade-in/slide-up animations (Phase 2)

### Documentation
- `/docs/implementation-plans/internal-navigation-loading-plan.md` - This file

---

## Questions & Decisions

### Decision Log

| Decision | Rationale | Date |
|----------|-----------|------|
| Internal navigation only | Better UX, no performance impact on external links | Nov 4, 2025 |
| Custom CSS-first approach | Zero bundle size, full control, faster | Nov 4, 2025 |
| 300-500ms duration | Long enough to feel responsive, not slow | Nov 4, 2025 |
| Three-dot animation | Matches chatbot loading, familiar pattern | Nov 4, 2025 |
| CustomEvent for triggering | Decoupled, global, lightweight | Nov 4, 2025 |

### Open Questions

- [ ] Should we add a minimum display time (e.g., 200ms) to prevent flash?
- [ ] Should we add a maximum display time (e.g., 3s) as a timeout?
- [ ] Should we animate the transition between pages (slide/fade)?
- [ ] Should we show different loading states for different page types?

---

## References

- [Next.js App Router Navigation](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating)
- [react-transition-progress](https://github.com/vercel/react-transition-progress)
- [Web Performance Metrics](https://web.dev/metrics/)
- [Lighthouse Performance Scoring](https://web.dev/performance-scoring/)
- [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)

---

## Version History

- **v1.0** (Nov 4, 2025): Initial plan with internal navigation scoping and performance focus
