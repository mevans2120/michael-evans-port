# Project Card Subtext Visibility Enhancement Plan

**Date:** November 6, 2025
**Component:** FeaturedCaseStudies.tsx
**Objective:** Make description (subtext) visible on initial load while maintaining hover effects and vertical centering

---

## Current State Analysis

### Component Location
- **File:** `/src/components/FeaturedCaseStudies.tsx`
- **Lines of Interest:** 89-119 (card container and content)

### Current Behavior
**Layout (Desktop):**
- Title ("Casa Bonita") positioned on the left
- Metric ("Cultural icon revival") positioned on the right
- Description hidden by default, revealed on hover
- Uses flexbox with `justify-between` for left/right alignment

**Animation System:**
- Description uses grid-based reveal: `grid-rows-[0fr]` → `grid-rows-[1fr]`
- Opacity transition: `opacity-0` → `opacity-100`
- Duration: `duration-slowest` (1200ms)
- Easing: `ease-out`

**Interactive States:**
- Desktop: Hover reveals description
- Mobile: First tap expands, second tap navigates

---

## Requirements (Confirmed)

Based on user clarification:

1. ✅ **Vertical Centering:** Keep title on left and metric on right, but center them vertically within the component height
2. ✅ **Subtext Visibility:** Make description visible on initial load
3. ✅ **Hover Effects:** Maintain existing visual hover effects (grid expansion, opacity changes)
4. ✅ **Metric Position:** Keep "Cultural icon revival" on the right side

---

## Implementation Plan

### Phase 1: Modify Description Initial State

**File:** `src/components/FeaturedCaseStudies.tsx` (Lines 109-119)

**Current Code:**
```tsx
<div className={`
  grid transition-[grid-template-rows,opacity] duration-slowest ease-out
  ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 group-hover:grid-rows-[1fr] group-hover:opacity-100'}
`}>
```

**Changes Needed:**
1. Change initial state from `grid-rows-[0fr] opacity-0` to `grid-rows-[1fr] opacity-100`
2. Keep hover state effects for visual feedback
3. Consider adding alternative hover effects (e.g., scale, color shift, or emphasis)

**New Code (Option A - Remove collapse animation, keep other hover effects):**
```tsx
<div className="grid grid-rows-[1fr] opacity-100 transition-smooth">
  <div className="overflow-hidden">
    <p className="text-lg md:text-xl leading-relaxed text-muted-foreground max-w-3xl transition-colors group-hover:text-foreground">
      {study.description}
    </p>
  </div>
</div>
```

**New Code (Option B - Keep subtle expansion on hover):**
```tsx
<div className={`
  grid transition-[grid-template-rows,opacity] duration-slowest ease-out
  ${isExpanded ? 'grid-rows-[1fr] opacity-100 scale-105' : 'grid-rows-[1fr] opacity-100 group-hover:scale-105'}
`}>
  <div className="overflow-hidden">
    <p className="text-lg md:text-xl leading-relaxed text-muted-foreground max-w-3xl group-hover:text-foreground transition-colors">
      {study.description}
    </p>
  </div>
</div>
```

**Recommendation:** Option B maintains interactive feedback while keeping content visible.

---

### Phase 2: Adjust Title/Metric Vertical Alignment

**File:** `src/components/FeaturedCaseStudies.tsx` (Lines 91-107)

**Current Code:**
```tsx
<div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4 md:gap-10">
```

**Issue:** Already has `md:items-center` which should vertically center content, but the title block (`flex-1`) may be causing misalignment.

**Changes Needed:**
1. Ensure both title block and metric are vertically centered
2. Remove or adjust `flex-1` if it's causing imbalance
3. Add explicit centering utilities if needed

**New Code:**
```tsx
<div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4 md:gap-10">
  <div className="md:flex-1 md:flex md:flex-col md:justify-center">
    <div className="text-xs md:text-sm font-semibold text-accent tracking-wider uppercase mb-3 md:mb-5">
      {study.category}
    </div>
    <h3 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight">
      {study.title}
    </h3>
  </div>
  <div className="text-lg md:text-xl font-semibold whitespace-nowrap opacity-60 md:flex md:items-center">
    {study.metric}
  </div>
</div>
```

**Changes Explained:**
- Added `md:flex md:flex-col md:justify-center` to title block for vertical centering
- Added `md:flex md:items-center` to metric for consistent alignment
- Maintained responsive behavior (mobile stacking)

---

### Phase 3: Update Mobile Interaction Logic

**File:** `src/components/FeaturedCaseStudies.tsx` (Lines 70-87)

**Current Behavior:**
- First tap: Expands description (sets `expandedId`)
- Second tap: Navigates to detail page

**Issue:** Since description is now always visible, the first tap behavior needs adjustment.

**Options:**

**Option A - Direct Navigation (Recommended):**
Remove the expand/collapse logic entirely for mobile since description is always visible.

```tsx
const handleCardClick = (id: string, slug: string) => {
  router.push(`/case-studies/${slug}`);
};
```

**Option B - Keep Tap State for Visual Feedback:**
First tap highlights/emphasizes the card, second tap navigates.

```tsx
const handleCardClick = (id: string, slug: string) => {
  if (isDesktop) {
    router.push(`/case-studies/${slug}`);
    return;
  }

  if (expandedId === id) {
    router.push(`/case-studies/${slug}`);
  } else {
    setExpandedId(id);
  }
};
```

**Recommendation:** Option A (direct navigation) since the expand/collapse purpose is eliminated.

---

### Phase 4: Optional Hover Enhancement

**File:** `src/components/FeaturedCaseStudies.tsx` (Line 89)

**Current Code:**
```tsx
<div className="group cursor-pointer -my-8 py-8 active:scale-[0.99] md:active:scale-100">
```

**Optional Enhancements:**
1. Add subtle background color change on hover
2. Add border accent on hover
3. Add shadow elevation on hover

**Example Enhancement:**
```tsx
<div className="group cursor-pointer -my-8 py-8 active:scale-[0.99] md:active:scale-100 transition-smooth hover:bg-muted/5 rounded-lg">
```

---

## Visual Behavior Comparison

### Before (Current)
```
Desktop:
┌─────────────────────────────────────────────────┐
│ CASE STUDY                                      │
│ Casa Bonita          Cultural icon revival      │
│ [Description hidden - shows on hover]           │
└─────────────────────────────────────────────────┘

On Hover:
┌─────────────────────────────────────────────────┐
│ CASE STUDY                                      │
│ Casa Bonita          Cultural icon revival      │
│ Crafted a premium e-commerce experience...      │
└─────────────────────────────────────────────────┘
```

### After (Proposed)
```
Desktop (Initial Load):
┌─────────────────────────────────────────────────┐
│ CASE STUDY                                      │
│ Casa Bonita          Cultural icon revival      │
│ (vertically centered) (vertically centered)     │
│ Crafted a premium e-commerce experience...      │
└─────────────────────────────────────────────────┘

On Hover (Subtle Enhancement):
┌─────────────────────────────────────────────────┐
│ CASE STUDY                                      │
│ Casa Bonita          Cultural icon revival      │
│ (slightly emphasized via color/scale)           │
│ Crafted a premium e-commerce experience...      │
│ (text color brightens)                          │
└─────────────────────────────────────────────────┘
```

---

## Testing Checklist

After implementation, verify:

- [ ] Description is visible on initial page load
- [ ] Title and metric are vertically centered on desktop
- [ ] Mobile layout still stacks correctly
- [ ] Hover effects provide visual feedback
- [ ] Click/tap navigation works correctly
- [ ] Dark mode styling looks correct
- [ ] Animation transitions are smooth
- [ ] Accessibility (keyboard navigation, screen readers)
- [ ] Responsive behavior at all breakpoints (mobile, tablet, desktop)

---

## Rollback Plan

If issues arise, revert changes to:
1. `src/components/FeaturedCaseStudies.tsx` (Lines 89-119)
2. Git commit hash: `8b956cf` (current main branch)

---

## Estimated Impact

**Files Changed:** 1 file (`FeaturedCaseStudies.tsx`)
**Lines Modified:** ~30 lines
**Risk Level:** Low (isolated component change)
**Testing Time:** 10-15 minutes
**Build Impact:** None (no breaking changes)

---

## Notes

- **Styling Compliance:** All changes use Tailwind CSS utilities and semantic tokens per project guidelines
- **Animation System:** Leverages existing `duration-slowest` and `transition-smooth` utilities
- **Dark Mode:** No additional dark mode variants needed (inherits from semantic tokens)
- **Accessibility:** Maintains keyboard navigation and focus states
- **Mobile-First:** Preserves mobile layout and adds desktop enhancements

---

## Open Questions

1. **Hover Effect Preference:** Should we use Option A (static visible) or Option B (subtle scale on hover)?
2. **Mobile Navigation:** Should we use Option A (direct navigation) or Option B (keep tap emphasis)?
3. **Additional Effects:** Would you like any background color, border, or shadow changes on hover?

---

## Implementation Order

1. ✅ **Step 1:** Modify description initial visibility state
2. ✅ **Step 2:** Adjust title/metric vertical alignment
3. ✅ **Step 3:** Update mobile tap interaction logic
4. ✅ **Step 4:** Test across devices and breakpoints
5. ✅ **Step 5:** (Optional) Add hover enhancements based on feedback
