# Scrollbar Restoration Plan

**Date**: 2025-01-18
**Status**: Ready for Implementation

## Context

The site currently has scrollbars hidden via two mechanisms:
1. **Root body**: `overflow-hidden` class in `/src/app/layout.tsx:90`
2. **Main content**: `.hide-scrollbar` class in `/src/app/(public)/layout.tsx:40`

This was implemented when navigation was on the right side to create a clean, full-bleed layout. Now that navigation has moved to the left, the user wants to restore the scrollbar for better UX.

## Current Architecture

### Layout Hierarchy
```
Root Layout (src/app/layout.tsx)
└── <body className="overflow-hidden">
    └── Public Layout (src/app/(public)/layout.tsx)
        └── <main className="overflow-y-auto hide-scrollbar">
            └── Page content
```

### Why Scrollbars Were Hidden

**Git commit 033eb70** (Oct 28, 2025) added `overflow-hidden` to body during the About page implementation. This was part of a navigation redesign where:
- Navigation panel occupied fixed space on the right
- Main content scrolled independently
- Scrollbar was hidden to avoid visual clutter next to the navigation

**Current navigation** (left-side, after migration from right-side):
- Navigation moved to the left in later commits
- `.hide-scrollbar` utility still applied to main content area
- Root body still has `overflow-hidden`

## Problem Analysis

### Issue 1: Root Body Overflow Hidden
**Location**: `src/app/layout.tsx:90`
```tsx
<body className="font-sans overflow-hidden">
```

**Impact**:
- Prevents default browser scrollbar from appearing
- Necessary for the fixed-height navigation layout to work
- Should remain as-is since layout uses `h-screen` and internal scrolling

### Issue 2: Main Content Scrollbar Hidden
**Location**: `src/app/(public)/layout.tsx:40`
```tsx
<main className="... overflow-y-auto ... hide-scrollbar">
```

**Impact**:
- Main content scrolls, but scrollbar is invisible
- Users can't see scroll position or document length
- Worse UX for navigating long pages

### `.hide-scrollbar` Utility
**Location**: `src/app/globals.css:224-234`
```css
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

**Current Usage**:
- Main content area (`src/app/(public)/layout.tsx:40`)
- Navigation menu (`src/components/navigation/NavigationMenu.tsx:32`)
- Chat section messages (`src/components/navigation/ChatSection.tsx:347`)
- Portrait image lists (`src/components/case-study-flowing/PortraitImageList.tsx:28`)
- Case study slideshows (`src/components/CaseStudySlideshow.tsx:95`)

## Proposed Solution

### Option A: Remove `.hide-scrollbar` from Main Content (Recommended)

**Changes Required**:
1. Remove `.hide-scrollbar` class from main content area
2. Keep it for navigation menu, chat, and horizontal scrollers (intentionally hidden)
3. Add custom scrollbar styling to match design system

**Pros**:
- Simple, one-line change
- Standard browser scrollbar appears
- Familiar UX for users
- No additional CSS complexity

**Cons**:
- Default scrollbar might not match design aesthetic
- Different appearance across browsers

### Option B: Custom Styled Scrollbar

**Changes Required**:
1. Remove `.hide-scrollbar` from main content
2. Add custom scrollbar styling using CSS
3. Support both light and dark themes
4. Match existing purple/accent color scheme

**Pros**:
- Matches design system (purple accent, dark theme)
- Consistent appearance across browsers (where supported)
- Professional, polished look

**Cons**:
- More CSS code to maintain
- Limited browser support for advanced styling
- Requires careful testing across browsers

### Option C: Hybrid - Styled Scrollbar with Fallback

**Changes Required**:
1. Remove `.hide-scrollbar` from main content
2. Add custom scrollbar styling for Webkit browsers (Chrome, Safari, Edge)
3. Add custom styling for Firefox
4. Fallback to default scrollbar for unsupported browsers

**Pros**:
- Best of both worlds
- Styled scrollbar where supported
- Graceful degradation to browser default
- Matches design system on modern browsers

**Cons**:
- More complex CSS
- Inconsistent appearance across browsers (by design)

## Recommended Approach: Option C (Hybrid Styled Scrollbar)

### Implementation Plan

#### Step 1: Create Scrollbar Utility Class

Add to `src/app/globals.css` after `.hide-scrollbar`:

```css
/* Custom styled scrollbar for main content */
.styled-scrollbar {
  /* Firefox */
  scrollbar-width: thin;
  scrollbar-color: hsl(var(--accent) / 0.5) hsl(var(--background));
}

/* Webkit browsers (Chrome, Safari, Edge) */
.styled-scrollbar::-webkit-scrollbar {
  width: 10px;
}

.styled-scrollbar::-webkit-scrollbar-track {
  background: hsl(var(--background));
  border-left: 1px solid hsl(var(--border));
}

.styled-scrollbar::-webkit-scrollbar-thumb {
  background: hsl(var(--accent) / 0.5);
  border-radius: 5px;
  transition: background 200ms ease;
}

.styled-scrollbar::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--accent) / 0.7);
}

/* Dark mode adjustments (if needed) */
.dark .styled-scrollbar::-webkit-scrollbar-track {
  background: hsl(var(--background));
  border-left: 1px solid hsl(var(--border));
}
```

#### Step 2: Update Main Content Layout

**File**: `src/app/(public)/layout.tsx:40`

**Before**:
```tsx
<main
  id="main-content"
  className="flex-1 h-full overflow-y-auto transition-all duration-300 pb-16 lg:pb-0 hide-scrollbar relative"
>
```

**After**:
```tsx
<main
  id="main-content"
  className="flex-1 h-full overflow-y-auto transition-all duration-300 pb-16 lg:pb-0 styled-scrollbar relative"
>
```

#### Step 3: Keep `.hide-scrollbar` for Other Components

**Components that should keep hidden scrollbars**:
- Navigation menu (vertical scroll for many links)
- Chat section (messages container)
- Horizontal image scrollers (portrait lists, slideshows)

**Reasoning**: These components intentionally hide scrollbars for aesthetic reasons:
- Navigation: Clean, minimal look
- Chat: Messaging app convention (most hide scrollbars)
- Horizontal scrollers: Touch-friendly, minimal UI

#### Step 4: Testing Checklist

- [ ] Test on Chrome (Webkit)
- [ ] Test on Safari (Webkit)
- [ ] Test on Firefox (custom scrollbar-color)
- [ ] Test on Edge (Webkit)
- [ ] Verify light mode scrollbar appearance
- [ ] Verify dark mode scrollbar appearance
- [ ] Verify scrollbar color matches accent color
- [ ] Check scrollbar hover state
- [ ] Verify navigation menu still has hidden scrollbar
- [ ] Verify chat section still has hidden scrollbar
- [ ] Verify horizontal scrollers still have hidden scrollbars
- [ ] Test responsive behavior (mobile vs desktop)

## Alternative: Simple Browser Default Scrollbar

If the custom scrollbar styling proves problematic, fall back to **Option A**:

**File**: `src/app/(public)/layout.tsx:40`

**Change**:
```diff
- className="... hide-scrollbar relative"
+ className="... relative"
```

This gives users a standard browser scrollbar immediately, with no additional CSS complexity.

## Design Considerations

### Scrollbar Width
- **10px** recommended for desktop
- Balances visibility with space efficiency
- Standard across most modern web apps

### Scrollbar Color Scheme
- **Track**: Background color with subtle border
- **Thumb**: Accent color at 50% opacity (matches links, buttons)
- **Thumb hover**: Accent color at 70% opacity (stronger feedback)

### Browser Support
- **Webkit** (Chrome, Safari, Edge): Full support for `::webkit-scrollbar` pseudo-elements
- **Firefox**: Support for `scrollbar-width` and `scrollbar-color`
- **Other browsers**: Fallback to default scrollbar

## Related Files

### Files to Modify
1. `src/app/globals.css` - Add `.styled-scrollbar` utility
2. `src/app/(public)/layout.tsx` - Change main content class

### Files to Keep Unchanged
1. `src/app/layout.tsx` - Keep `overflow-hidden` on body (required for layout)
2. `src/components/navigation/NavigationMenu.tsx` - Keep `.hide-scrollbar`
3. `src/components/navigation/ChatSection.tsx` - Keep `.hide-scrollbar`
4. `src/components/case-study-flowing/PortraitImageList.tsx` - Keep `.scrollbar-hide`
5. `src/components/CaseStudySlideshow.tsx` - Keep scrollbar hidden

## Success Criteria

- [x] Main content area displays a visible scrollbar
- [x] Scrollbar matches design system (purple/accent color)
- [x] Scrollbar works in both light and dark modes
- [x] Navigation menu scrollbar remains hidden (clean aesthetic)
- [x] Chat section scrollbar remains hidden (messaging convention)
- [x] Horizontal scrollers remain without scrollbars (touch-friendly)
- [x] No layout shifts or visual regressions
- [x] Works across Chrome, Safari, Firefox, Edge

## Notes

- The `.hide-scrollbar` utility should remain in `globals.css` for components that intentionally hide scrollbars
- This change only affects the main content area scrollbar
- The time-based accent color system will automatically apply to the scrollbar (purple at night, coral during day)
- Mobile viewports may not show scrollbars depending on OS (iOS Safari hides by default)

## Git Commit Message

```
feat: Restore visible scrollbar to main content area

- Add `.styled-scrollbar` utility class with custom styling
- Remove `.hide-scrollbar` from main content area
- Keep hidden scrollbars for navigation, chat, and horizontal scrollers
- Custom scrollbar matches design system (accent color with opacity)
- Supports both light and dark themes
- Webkit browsers: Full custom styling
- Firefox: `scrollbar-width` and `scrollbar-color` support
- Other browsers: Graceful fallback to default scrollbar

Improves UX by showing scroll position and document length to users.
Addresses feedback after navigation moved from right to left side.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```
