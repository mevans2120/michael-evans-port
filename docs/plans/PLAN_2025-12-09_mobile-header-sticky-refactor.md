# Plan: Mobile Header Sticky Refactor

**Date**: December 9, 2025
**Goal**: Replace JS-driven scroll-to-hide header with CSS-only sticky positioning
**Expected Outcome**: Eliminate scroll stutter on mobile by removing JS/CSS animation competition

---

## Current Architecture

```
useScrollDirection (JS) → MobileHeader (React) → CSS transition
       ↓                         ↓                      ↓
  State updates            Re-renders              Animations
  every frame              on scroll               interrupted
```

**Files involved**:
- `src/hooks/useScrollDirection.ts` - Scroll detection hook
- `src/components/navigation/MobileHeader.tsx` - Header component
- `src/contexts/MobileHeaderContext.tsx` - Header visibility context
- `src/app/(public)/LayoutContent.tsx` - Layout with padding adjustment

---

## Target Architecture

```
CSS position: sticky → Browser handles visibility natively
       ↓
  No JS during scroll
  No React re-renders
  Smooth 60fps scrolling
```

---

## Implementation Phases

### Phase 1: Simplify MobileHeader Component

**File**: `src/components/navigation/MobileHeader.tsx`

**Changes**:
1. Remove `useScrollDirection` hook import and usage
2. Remove `useMobileHeader` context usage (or keep for other purposes)
3. Remove `shouldHide` logic
4. Change from `position: fixed` + `transform` to `position: sticky`

**Before**:
```tsx
export function MobileHeader({ onMenuClick, chatExpanded, mobileMenuOpen }: MobileHeaderProps) {
  const { scrollDirection, isAtTop } = useScrollDirection();
  const { setHeaderVisible } = useMobileHeader();

  const shouldHide = scrollDirection === 'down' && !isAtTop && !mobileMenuOpen;

  useEffect(() => {
    if (!chatExpanded) {
      setHeaderVisible(!shouldHide);
    }
  }, [shouldHide, setHeaderVisible, chatExpanded]);

  if (chatExpanded) {
    return null;
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 h-16 bg-background border-b border-border z-[60] lg:hidden",
        "transition-transform duration-normal ease-smooth",
        shouldHide ? "-translate-y-full" : "translate-y-0"
      )}
    >
      {/* ... */}
    </header>
  );
}
```

**After**:
```tsx
export function MobileHeader({ onMenuClick, chatExpanded, mobileMenuOpen }: MobileHeaderProps) {
  if (chatExpanded) {
    return null;
  }

  return (
    <header
      className={cn(
        "sticky top-0 h-16 bg-background border-b border-border z-[60] lg:hidden",
        // No transition needed - sticky is instant
      )}
    >
      {/* ... */}
    </header>
  );
}
```

---

### Phase 2: Update Layout Structure

**File**: `src/app/(public)/LayoutContent.tsx`

**Changes**:
1. Remove `headerVisible` from MobileHeaderContext usage (if no longer needed)
2. Remove padding transitions tied to header visibility
3. Ensure MobileHeader is positioned correctly within the DOM for sticky to work

**Key consideration**: For `position: sticky` to work, the header must be:
- A direct child of a scrollable container, OR
- At the top of the document flow

**Current structure** (may need adjustment):
```tsx
<div className="flex h-dvh ...">
  <MobileHeader /> {/* Fixed position */}
  <main id="main-content" className="overflow-y-auto">
    {/* Content */}
  </main>
</div>
```

**Target structure**:
```tsx
<div className="flex h-dvh ...">
  <main id="main-content" className="overflow-y-auto">
    <MobileHeader /> {/* Sticky - INSIDE scrollable container */}
    {/* Content */}
  </main>
</div>
```

---

### Phase 3: Clean Up Unused Code

**Files to modify**:

1. **`src/hooks/useScrollDirection.ts`**
   - Keep if used elsewhere, otherwise mark for removal
   - Check for other usages with: `grep -r "useScrollDirection" src/`

2. **`src/contexts/MobileHeaderContext.tsx`**
   - Remove `headerVisible` state if no longer needed
   - Or remove entire context if not used elsewhere

3. **`src/app/(public)/LayoutContent.tsx`**
   - Remove `headerVisible` prop consumption
   - Remove padding transition logic

---

### Phase 4: Handle Edge Cases

**Edge Case 1: Chat Expanded State**
- Current: Header returns `null` when chat is expanded
- Keep this behavior - it's not related to scroll

**Edge Case 2: Mobile Menu Open**
- Current: Header stays visible when menu is open
- With sticky, header is always visible - menu overlay works independently

**Edge Case 3: Keyboard Focus**
- Sticky headers can interfere with keyboard focus scrolling
- Test with Tab key navigation
- May need `scroll-padding-top: 64px` on `<html>` or scroll container

---

## Testing Plan

### Manual Testing

1. **iPhone Safari**
   - Scroll up/down quickly
   - Verify no stutter/jank
   - Test momentum scrolling (flick gesture)

2. **Android Chrome**
   - Same scroll tests
   - Test with "Show Layout Shift Regions" enabled in DevTools

3. **Edge Cases**
   - Open mobile menu while scrolled down
   - Expand chat while scrolled
   - Navigate between pages
   - Pull-to-refresh gesture (if applicable)

### Performance Testing

1. **Chrome DevTools Performance Tab**
   - Record 5 seconds of scrolling
   - Target: 0 long tasks > 50ms
   - Target: Consistent 60fps

2. **Safari Web Inspector**
   - Use Timeline to check for forced reflows
   - Monitor CPU usage during scroll

---

## Rollback Plan

If sticky positioning causes issues:

1. Revert MobileHeader.tsx to use `fixed` positioning
2. Keep scroll detection removed (use simpler visibility toggle)
3. Consider debounce approach as fallback

---

## Files to Modify

| File | Change Type | Priority |
|------|-------------|----------|
| `src/components/navigation/MobileHeader.tsx` | Major refactor | P0 |
| `src/app/(public)/LayoutContent.tsx` | Structural change | P0 |
| `src/contexts/MobileHeaderContext.tsx` | Simplify/remove | P1 |
| `src/hooks/useScrollDirection.ts` | Potential removal | P2 |

---

## Estimated Effort

- **Phase 1**: 15 minutes
- **Phase 2**: 30 minutes (layout restructuring may be tricky)
- **Phase 3**: 15 minutes
- **Phase 4**: 30 minutes (testing edge cases)

**Total**: ~1.5 hours

---

## Decision Points

Before implementation, confirm:

1. **Should header always be visible on scroll?**
   - Sticky = always visible at top
   - If hide-on-scroll is required, consider Option A (debounce) instead

2. **Is the scroll container structure flexible?**
   - Sticky requires being inside the scrollable container
   - Current layout may need restructuring

3. **Any other components using MobileHeaderContext?**
   - Check before removing

---

## Alternative: Hybrid Approach

If you want to keep scroll-to-hide behavior but improve performance:

**Use CSS `scroll-timeline` (experimental)**:
```css
@supports (animation-timeline: scroll()) {
  .mobile-header {
    animation: hide-header linear;
    animation-timeline: scroll();
  }

  @keyframes hide-header {
    0% { transform: translateY(0); }
    100% { transform: translateY(-100%); }
  }
}
```

This is purely CSS-based scroll-linked animation - no JS needed. However, browser support is limited (Chrome 115+, no Safari yet).

---

## Next Steps

1. Review this plan
2. Confirm desired behavior (always visible vs hide-on-scroll)
3. Begin Phase 1 implementation
4. Test on physical devices after each phase
