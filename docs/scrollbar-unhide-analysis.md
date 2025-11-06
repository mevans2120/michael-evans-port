# Scrollbar Unhide Analysis - November 6, 2025

## Executive Summary

The site currently hides scrollbars across multiple areas. With navigation now moved to the left side on desktop, the main page scrollbar should be revealed to improve usability and visual feedback. However, component-specific scrollbar hiding should be preserved where appropriate for horizontal scrolling and aesthetic purposes.

## Current State: Where Scrollbars Are Hidden

### 1. **Global Body Level** (ROOT CAUSE)
**Location:** `/src/app/layout.tsx:49`
```tsx
<body className="font-sans overflow-hidden">
```

**Impact:** This prevents the entire body from scrolling. All scrolling is delegated to the main content area.

**Analysis:** This is the architectural foundation - the body itself is locked, and scrolling happens only within the main content container.

---

### 2. **Main Content Area** (PRIMARY TARGET)
**Location:** `/src/app/(public)/layout.tsx:38`
```tsx
<main
  id="main-content"
  className="flex-1 h-full overflow-y-auto transition-all duration-300 pb-16 md:pb-0 hide-scrollbar relative"
>
```

**Impact:** This is where the user actually scrolls (content pages), but the scrollbar is hidden via the `hide-scrollbar` utility class.

**Analysis:** This is the **main target for unhiding**. Users need visual feedback when scrolling through case studies, about page, etc.

---

### 3. **Hide-Scrollbar Utility Class**
**Location:** `/src/app/globals.css:224-234`
```css
/* Hide scrollbar for navigation menu */
.hide-scrollbar,
.scrollbar-hide {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}

.hide-scrollbar::-webkit-scrollbar,
.scrollbar-hide::-webkit-scrollbar {
  display: none; /* Chrome/Safari/Opera */
}
```

**Note:** Comment says "for navigation menu" but this utility is used in multiple places.

---

### 4. **Component-Specific Scrollbar Hiding** (KEEP THESE)

#### a. Chat Messages Area
**Location:** `/src/components/navigation/ChatSection.tsx:312`
```tsx
<div
  className={`overflow-y-auto px-8 py-4 bg-chat hide-scrollbar ${
    !showChatContent && !chatExpanded ? 'hidden' : ''
  }`}
>
```
**Decision:** **KEEP** - Chat area should remain clean without visible scrollbar.

---

#### b. Navigation Menu
**Location:** `/src/components/navigation/NavigationMenu.tsx:32`
```tsx
<nav
  className="flex flex-row md:flex-col gap-2 md:gap-8 h-full overflow-x-auto md:overflow-y-auto justify-around md:justify-start px-2 md:px-0 hide-scrollbar"
>
```
**Decision:** **KEEP** - Navigation should not show scrollbars.

**Historical Context:** Commit `f7e3312` (Oct 27, 2025) changed `md:overflow-y-auto` to `md:overflow-hidden` to prevent unwanted scrollbar in the navigation panel. Current code shows `md:overflow-y-auto` with `hide-scrollbar`, suggesting the class was added later.

---

#### c. Horizontal Scrolling Components

**CaseStudySlideshow** (`/src/components/CaseStudySlideshow.tsx:95-102`)
```tsx
<div
  className={`flex overflow-x-auto overflow-y-hidden scroll-smooth`}
  style={{
    scrollSnapType: 'x mandatory',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  }}
>
```
Plus styled-jsx to hide webkit scrollbar.

**Decision:** **KEEP** - Horizontal scrolling UI pattern benefits from hidden scrollbar for cleaner look.

---

**HorizontalTimelineSlide** (`/src/components/ai-showcase/HorizontalTimelineSlide.tsx:55-60`)
```tsx
<div
  className={cn(
    "flex-1 overflow-x-auto overflow-y-hidden",
    "scroll-smooth snap-x snap-mandatory",
    "px-8 md:px-16 lg:px-24",
    // Hide scrollbar
    "scrollbar-hide"
  )}
>
```

**Decision:** **KEEP** - AI showcase horizontal timeline should remain clean.

---

## Historical Context & Rationale

### Original Design Intent
Based on the navigation refactor plan (`docs/roadmaps/NAVIGATION-LAYOUT-REFACTOR-PLAN.md:84`), the original design showed:
```tsx
className="flex-1 h-full overflow-y-auto transition-all duration-300 pb-[200px] md:pb-0 hide-scrollbar"
```

**Rationale (inferred):**
1. **Right-side navigation:** When navigation was on the right, hiding the main scrollbar prevented visual clutter between the content scrollbar and the navigation panel edge.
2. **Clean aesthetic:** The design prioritized a minimal, distraction-free reading experience.
3. **Fixed viewport:** The `overflow-hidden` on body ensures fixed viewport height (no double-scrollbars).

### Why Unhide Now?
1. **Navigation moved to left:** The main scrollbar would now appear on the right edge of the screen, away from the navigation panel.
2. **User feedback:** Scrollbars provide visual feedback about page length and current position.
3. **Accessibility:** Visible scrollbars help users understand scrollable content.

---

## Browser-Specific Implementations Found

The codebase uses multiple approaches to hide scrollbars:

1. **Tailwind utility class** (preferred): `.hide-scrollbar` or `.scrollbar-hide`
   - Defined in `globals.css`
   - Cross-browser support (Firefox, IE/Edge, Chrome/Safari/Opera)

2. **Inline styles** (older components):
   ```tsx
   style={{
     scrollbarWidth: 'none',  // Firefox
     msOverflowStyle: 'none', // IE/Edge
   }}
   ```

3. **Styled-jsx** (CaseStudySlideshow):
   ```tsx
   <style jsx>{`
     div::-webkit-scrollbar {
       display: none;
     }
   `}</style>
   ```

**Recommendation:** Standardize on the utility class approach when making changes.

---

## Recommendation Matrix

| Location | Current State | Recommendation | Reason |
|----------|--------------|----------------|---------|
| **Body element** | `overflow-hidden` | **KEEP** | Architectural: ensures fixed viewport |
| **Main content area** | `overflow-y-auto hide-scrollbar` | **REMOVE `hide-scrollbar`** | Users need scroll feedback for page content |
| **Chat messages** | `overflow-y-auto hide-scrollbar` | **KEEP** | Clean chat UI |
| **Navigation menu** | `overflow-x-auto md:overflow-y-auto hide-scrollbar` | **KEEP** | Navigation should be clean |
| **Horizontal scrollers** | Various implementations with hidden scrollbar | **KEEP** | UI pattern works better without visible scrollbar |

---

## Implementation Plan

### Phase 1: Main Content Scrollbar (Primary Change)

**File:** `/src/app/(public)/layout.tsx`

**Change:**
```diff
  <main
    id="main-content"
-   className="flex-1 h-full overflow-y-auto transition-all duration-300 pb-16 md:pb-0 hide-scrollbar relative"
+   className="flex-1 h-full overflow-y-auto transition-all duration-300 pb-16 md:pb-0 relative"
  >
```

**Impact:**
- Main page content will show a standard scrollbar on the right edge
- Scrollbar will be visible on: homepage, about page, case studies list, individual case studies, AI showcase
- No impact on navigation or chat areas (they remain hidden)

---

### Phase 2: Optional Scrollbar Styling

If the default browser scrollbar looks too heavy/jarring, add custom scrollbar styles:

**File:** `/src/app/globals.css`

```css
/* Custom scrollbar styles for main content */
main#main-content::-webkit-scrollbar {
  width: 8px;
}

main#main-content::-webkit-scrollbar-track {
  background: transparent;
}

main#main-content::-webkit-scrollbar-thumb {
  background: hsl(var(--border));
  border-radius: 4px;
}

main#main-content::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--accent));
}

/* Firefox */
main#main-content {
  scrollbar-width: thin;
  scrollbar-color: hsl(var(--border)) transparent;
}
```

**Benefits:**
- Thinner, more elegant scrollbar
- Matches site color scheme
- Better dark mode support

---

### Phase 3: Testing & Validation

**Test cases:**
1. **Desktop (>768px):**
   - [ ] Main content shows scrollbar when content overflows
   - [ ] Scrollbar appears on right edge, away from left navigation
   - [ ] Navigation panel does NOT show scrollbar
   - [ ] Chat messages area does NOT show scrollbar
   - [ ] Horizontal scrollers (case study slideshow, AI timeline) do NOT show scrollbar

2. **Mobile (<768px):**
   - [ ] Main content shows scrollbar when content overflows
   - [ ] No visual conflict with mobile navigation footer
   - [ ] Horizontal scrollers remain clean

3. **Dark mode:**
   - [ ] Scrollbar color contrasts appropriately with background
   - [ ] Custom scrollbar styles (if added) use theme-aware colors

4. **Browsers:**
   - [ ] Chrome/Edge (webkit)
   - [ ] Firefox (scrollbar-width)
   - [ ] Safari (webkit)

---

## Risk Assessment

### Low Risk
- **Main content scrollbar unhiding:** This is a visual change only, no behavioral changes.
- **Navigation/chat areas:** Not changing these, so no risk.

### Minimal Complexity
- Single line change in one file for core functionality
- Optional styling in CSS file (non-breaking)

### Potential Issues
1. **Visual surprise:** Users may find the scrollbar suddenly visible (but this is expected after navigation moved).
2. **Dark mode contrast:** Default browser scrollbar may not contrast well - easily fixed with custom styles.

---

## Conclusion

**Primary Action:** Remove `hide-scrollbar` class from the main content area in `/src/app/(public)/layout.tsx`.

**Keep Hidden:**
- Chat messages area
- Navigation menu
- Horizontal scrolling components (slideshow, timeline)

**Optional Enhancement:** Add custom scrollbar styling for a more polished look.

**Complexity:** Very low - single line change with optional styling enhancement.

**User Benefit:** Better visual feedback for page scrolling, especially important now that navigation is on the left side.
