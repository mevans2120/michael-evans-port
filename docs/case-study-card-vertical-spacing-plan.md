# Case Study Card Vertical Spacing Plan

**Date:** November 6, 2025
**Component:** FeaturedCaseStudies.tsx
**Objective:** Create equal vertical padding above and below the card content that works with variable-length descriptions

---

## Problem Analysis

### Current Issue
Looking at the screenshot, the vertical spacing is unbalanced:
- **Top space** (above "Virgin America"): Smaller
- **Bottom space** (below description): Larger

The red arrows indicate that these should be equal.

### Why Current Approach Doesn't Work
The current structure has:
```
<div className="group cursor-pointer -my-8 py-8"> ← Creates buffer zones
  <div className="...mb-6">  ← Header with fixed margin-bottom
    Category (mb-3/mb-5)
    Title
  </div>
  <div>  ← Description (variable height)
    Text
  </div>
</div>
```

**Issues:**
1. The `-my-8 py-8` creates equal padding but the content inside has its own margins
2. Category has `mb-3 md:mb-5` pushing title down
3. Header has `mb-6` pushing description down
4. Description has no margin, making bottom space appear larger
5. All margins are absolute values, not relative to the content

### Design System Alignment
According to `/docs/css-quick-reference.md` and project guidelines:
- Use Tailwind utilities
- Avoid magic numbers
- Create responsive, content-aware spacing
- Follow mobile-first approach

---

## Proposed Solution

### Strategy: Use Flexbox with Equal Spacing

Instead of using margins between elements, use a flex column container with `gap` to create consistent spacing, and balance the top/bottom padding.

### Visual Goal
```
┌─────────────────────────────────────────┐
│  ← Equal padding top                     │
│  CASE STUDY                             │
│  Virgin America    15% conversion lift  │
│  Description text...                    │
│  ← Equal padding bottom                  │
└─────────────────────────────────────────┘
```

### Implementation Approach

**Option 1: Flex Column with Gap (Recommended)**
```tsx
<div className="group cursor-pointer py-8 flex flex-col gap-6">
  {/* Category */}
  <div className="text-xs md:text-sm font-semibold text-accent tracking-wider uppercase font-sans">
    {study.category}
  </div>

  {/* Header (Title + Metric) */}
  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-10">
    <h3>...</h3>
    <div>{study.metric}</div>
  </div>

  {/* Description */}
  <div>
    <p>...</p>
  </div>
</div>
```

**Benefits:**
- Equal spacing between all elements (`gap-6`)
- Equal padding top and bottom (`py-8`)
- Works with any description length
- Cleaner structure
- Responsive without extra media queries

**Option 2: Balanced Margins**
Keep current structure but balance margins:
```tsx
<div className="py-8">
  <div className="mb-6">Category</div>
  <div className="mb-6">Title + Metric</div>
  <div className="mb-6">Description</div>  ← Add bottom margin
</div>
```

**Issues:**
- Adds unnecessary margin at the bottom
- Doesn't solve the root problem
- Less flexible

---

## Recommended Changes

### Step 1: Restructure to Flex Column with Gap

**Current Structure:**
```tsx
<div className="group cursor-pointer -my-8 py-8">
  <div className="flex flex-col md:flex-row mb-6">
    <div>
      <div className="mb-3 md:mb-5">Category</div>
      <h3>Title</h3>
    </div>
    <div>Metric</div>
  </div>
  <div>Description</div>
</div>
```

**New Structure:**
```tsx
<div className="group cursor-pointer py-8 flex flex-col gap-6">
  {/* Category - Now standalone */}
  <div className="text-xs md:text-sm font-semibold text-accent tracking-wider uppercase font-sans">
    {study.category}
  </div>

  {/* Title + Metric - Single row */}
  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-10">
    <h3 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight font-sans transition-colors duration-600 group-hover:text-accent-light">
      {study.title}
    </h3>
    <div className="text-lg md:text-xl font-semibold font-sans whitespace-nowrap opacity-60">
      {study.metric}
    </div>
  </div>

  {/* Description */}
  <div className="grid grid-rows-[1fr] opacity-100">
    <div className="overflow-hidden">
      <p className="text-lg md:text-xl leading-relaxed text-muted-foreground max-w-3xl font-serif transition-colors group-hover:text-foreground">
        {study.description}
      </p>
    </div>
  </div>
</div>
```

### Step 2: Remove Unnecessary Margins

**Remove:**
- `mb-3 md:mb-5` from category (gap handles it)
- `mb-6` from header container (gap handles it)
- `-my-8` negative margin (no longer needed)

**Keep:**
- `py-8` for consistent vertical padding
- `gap-6` for equal spacing between sections
- `gap-4 md:gap-10` for title/metric spacing

### Step 3: Verify Spacing

After changes, the spacing will be:
- **Top padding:** `py-8` (32px/2rem)
- **Category → Title:** `gap-6` (24px/1.5rem)
- **Title → Description:** `gap-6` (24px/1.5rem)
- **Bottom padding:** `py-8` (32px/2rem)

This creates **equal top and bottom padding** regardless of description length.

---

## Design System Compliance

✅ **Uses Tailwind utilities:** `flex`, `flex-col`, `gap-6`, `py-8`
✅ **No magic numbers:** All spacing uses semantic Tailwind values
✅ **Responsive:** Works at all breakpoints
✅ **Content-aware:** Flexbox adapts to variable description lengths
✅ **Mobile-first:** Base styles work on mobile, enhanced for desktop

---

## Testing Checklist

After implementation:
- [ ] Equal spacing above title and below description
- [ ] Works with 2-line descriptions
- [ ] Works with 3-line descriptions
- [ ] Mobile layout still stacks correctly
- [ ] Desktop layout maintains left/right positioning
- [ ] Hover effects still work
- [ ] No layout shift or jumpiness

---

## Alternative: CSS Grid Approach

If flexbox doesn't achieve perfect balance, we could use CSS Grid:

```tsx
<div className="grid grid-rows-[auto_auto_auto_auto] gap-6 py-8">
  <div>{/* Category */}</div>
  <div>{/* Title + Metric */}</div>
  <div>{/* Description */}</div>
</div>
```

This provides the same benefits but with explicit grid rows.

---

## Recommendation

**Use Option 1: Flex Column with Gap**

This is the cleanest, most maintainable solution that:
1. Aligns with the design system
2. Creates truly equal top/bottom padding
3. Works with any content length
4. Requires minimal code changes
5. Easier to reason about

Next step: Implement and test the flex column approach.
