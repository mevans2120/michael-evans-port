# Mobile Navigation Breakpoint Analysis

**Date:** November 9, 2025  
**Issue:** Content layout issues when navigation and content widths are similar  
**User Request:** Switch to mobile navigation earlier to prevent layout conflicts

---

## Executive Summary

The portfolio currently switches from mobile to desktop navigation at **768px** (Tailwind's `md:` breakpoint). At this breakpoint, the desktop navigation panel is 81px wide (collapsed) or 320px wide (expanded), leaving limited space for content. This creates layout issues where content doesn't fit properly, especially in the 768px-900px range.

**Recommended Solution:** Increase the mobile-to-desktop breakpoint to **1024px** (Tailwind's `lg:` breakpoint) to provide more horizontal space for content before switching to desktop navigation.

---

## 1. Current Breakpoint Configuration

### Primary Breakpoint Definition

**File:** `/src/hooks/useMediaQuery.ts`  
**Lines:** 64-66

```typescript
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 768px)');
}
```

This is the **single source of truth** for desktop/mobile detection across the entire application.

### Tailwind Breakpoint Reference

The project uses Tailwind CSS default breakpoints (no custom breakpoints defined in `tailwind.config.ts`):

| Breakpoint | Min-Width | Usage |
|------------|-----------|-------|
| `sm:` | 640px | Small devices |
| **`md:`** | **768px** | **Current desktop nav** |
| `lg:` | 1024px | Large screens |
| `xl:` | 1280px | Extra large screens |
| `2xl:` | 1536px | 2x extra large |

---

## 2. Affected Components

All navigation components rely on either the `useIsDesktop()` hook or `md:` Tailwind classes:

### 2.1 Core Navigation Components

| Component | File | Breakpoint Usage |
|-----------|------|------------------|
| **NavigationPanel** | `/src/components/navigation/NavigationPanel.tsx` | `useIsDesktop()` hook + `md:` classes |
| **NavigationMenu** | `/src/components/navigation/NavigationMenu.tsx` | `md:` classes only |
| **MobileHeader** | `/src/components/navigation/MobileHeader.tsx` | `md:hidden` class |
| **MobileChatFooter** | `/src/components/navigation/MobileChatFooter.tsx` | `md:hidden` class |
| **ChatSection** | `/src/components/navigation/ChatSection.tsx` | `useIsDesktop()` hook + `md:` classes |
| **HamburgerMenu** | `/src/components/navigation/HamburgerMenu.tsx` | `md:hidden` class |

### 2.2 Detailed Component Analysis

#### NavigationPanel (`NavigationPanel.tsx`)

**JavaScript Breakpoint:**
- Line 15: `const isDesktop = useIsDesktop();`
- Used for conditional rendering and width calculations

**CSS Breakpoints (all using `md:`):**
- Line 62, 65, 67: Width classes `md:w-[81px]`, `md:w-[320px]`, `md:w-[455px]`
- Line 75-84: Layout classes `fixed md:relative`, `bottom-0 md:bottom-auto`, etc.

#### NavigationMenu (`NavigationMenu.tsx`)

**CSS Breakpoints:**
- Line 29: `py-4 md:border-b border-navigation-border h-auto md:h-[66%]`
- Line 32: `flex flex-row md:flex-col gap-2 md:gap-8 h-full overflow-x-auto md:overflow-y-auto`
- Line 37: `hidden md:flex` (logo visibility)
- Line 61: `hidden md:flex` (nav items visibility)
- Line 68: `hidden md:inline` (nav labels visibility)

#### ChatSection (`ChatSection.tsx`)

**JavaScript Breakpoint:**
- Line 6: `const isDesktop = useIsDesktop();`
- Used for conditional rendering and height calculations

**CSS Breakpoints:**
- Line 78: `md:h-full` and `md:h-[34%]`
- Line 273-283: Responsive text content

#### Mobile-Only Components

These components use `md:hidden` to hide on desktop:
- **MobileHeader** (line 19): `md:hidden`
- **MobileChatFooter** (lines 21, 29): `md:hidden`
- **HamburgerMenu** (lines 28, 34): `md:hidden`

### 2.3 Layout Component

**File:** `/src/app/(public)/layout.tsx`  
**Line 27:** `<div className="flex h-screen w-screen bg-background overflow-hidden pt-16 md:pt-0">`

This adds top padding on mobile (64px) to account for the mobile header.

---

## 3. Layout Issue Analysis

### Current Desktop Navigation Widths

At 768px breakpoint, the NavigationPanel has these widths:

| State | Width | Remaining Content Width @ 768px |
|-------|-------|----------------------------------|
| Collapsed | 81px | 687px (89.5%) |
| Expanded (nav only) | 320px | 448px (58.3%) |
| Expanded (chat focused) | 455px | 313px (40.8%) |

### Problem Zones

**768px - 900px (Critical Zone):**
- Desktop nav appears but leaves minimal content space
- 320px nav width leaves only 448-580px for content
- Content designed for full-width mobile or wider desktop gets squeezed
- Typography, images, and layouts don't have room to breathe

**900px - 1024px (Suboptimal Zone):**
- Better than critical zone but still cramped
- Content starts to feel more comfortable around 1024px
- At 1024px with 320px nav = 704px content (good minimum)

### Root Cause

The 768px breakpoint is **too early** to switch to desktop navigation. It's Tailwind's default "tablet" breakpoint, which assumes sidebars will be narrow or collapsible. Our navigation panel:
- Takes up significant horizontal space (320-455px when expanded)
- Is always visible on desktop (not collapsible to 0)
- Minimum width of 81px even when collapsed

---

## 4. All Breakpoint References

### JavaScript References

**Primary Definition:**
- `/src/hooks/useMediaQuery.ts` line 65: `useMediaQuery('(min-width: 768px)')`

**Component Usage (via `useIsDesktop()` hook):**
- `/src/components/navigation/NavigationPanel.tsx` line 15
- `/src/components/navigation/ChatSection.tsx` line 6

**Tests:**
- `/src/hooks/__tests__/useMediaQuery.test.ts` (multiple references)

### CSS References (all using `md:` prefix)

**Navigation Components:**
- NavigationPanel.tsx: 14 occurrences
- NavigationMenu.tsx: 9 occurrences
- ChatSection.tsx: 6 occurrences
- MobileHeader.tsx: 1 occurrence
- MobileChatFooter.tsx: 2 occurrences
- HamburgerMenu.tsx: 2 occurrences
- NavigationProgress.tsx: (if any)

**Layout:**
- `/src/app/(public)/layout.tsx` line 27: 1 occurrence

### Total Count

- **JavaScript:** 1 primary definition (useIsDesktop hook)
- **Hook usage:** 2 components
- **CSS classes:** ~35 `md:` prefixed classes across navigation components

---

## 5. Proposed Solution

### Recommendation: Switch to `lg:` Breakpoint (1024px)

**Benefits:**
1. **More content space:** Minimum 704px for content (vs 448px currently)
2. **Better UX:** Mobile nav on tablets provides full-width content
3. **Cleaner breakpoint:** 1024px is traditional "desktop" breakpoint
4. **Less cramping:** Content designed for wider screens gets adequate space

**Trade-offs:**
1. **Tablets see mobile nav:** iPad (768px) and similar devices use mobile navigation
2. **Desktop nav appears later:** Only on screens 1024px+ (most laptops/desktops)

### Why 1024px is Better

| Screen Size | Current (768px) | Proposed (1024px) | Benefit |
|-------------|-----------------|-------------------|---------|
| iPad Portrait (768px) | Desktop nav (cramped) | Mobile nav | More content space |
| iPad Landscape (1024px) | Desktop nav | Desktop nav | Same |
| Small Laptops (1280px) | Desktop nav | Desktop nav | Same |
| Desktop (1920px+) | Desktop nav | Desktop nav | Same |

**Key Insight:** Most users on 768-1023px devices (tablets) will benefit from mobile navigation, which provides full-width content. Desktop navigation is better suited for 1024px+ devices.

---

## 6. Implementation Changes

### Single-Line Change: Update Hook

**File:** `/src/hooks/useMediaQuery.ts`  
**Line 65:**

```typescript
// Current
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 768px)');
}

// Proposed
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)');
}
```

### Global Find-Replace: Update CSS Classes

Replace all `md:` prefixes with `lg:` in navigation components:

**Files requiring changes:**
1. `/src/components/navigation/NavigationPanel.tsx`
2. `/src/components/navigation/NavigationMenu.tsx`
3. `/src/components/navigation/ChatSection.tsx`
4. `/src/components/navigation/MobileHeader.tsx`
5. `/src/components/navigation/MobileChatFooter.tsx`
6. `/src/components/navigation/HamburgerMenu.tsx`
7. `/src/app/(public)/layout.tsx`

**Example changes:**
```tsx
// Before
<div className="hidden md:flex">

// After
<div className="hidden lg:flex">
```

```tsx
// Before
<div className="fixed md:relative">

// After
<div className="fixed lg:relative">
```

### Update Documentation

**File:** `/src/hooks/useMediaQuery.ts`  
**Lines 55-58:** Update JSDoc comments

```typescript
/**
 * Convenience hook for checking if viewport is desktop size or larger
 *
 * Uses Tailwind's 'lg' breakpoint (1024px) for consistency across the app.
 * This is the recommended way to check for desktop viewports.
 *
 * @returns true if viewport width >= 1024px, false otherwise
 *
 * @example
 * const isDesktop = useIsDesktop()
 * return isDesktop ? <DesktopNav /> : <MobileNav />
 */
```

### Update Tests

**File:** `/src/hooks/__tests__/useMediaQuery.test.ts`

Update all test references from 768px to 1024px:
- Line 128: Test description
- Line 131: Assertion
- Line 148: Test description
- All other hardcoded 768px references in tests

---

## 7. Complete File List

### Files Requiring Updates

| Category | File Path | Changes Needed |
|----------|-----------|----------------|
| **Hook** | `/src/hooks/useMediaQuery.ts` | Update breakpoint: 768px → 1024px<br>Update JSDoc comments |
| **Tests** | `/src/hooks/__tests__/useMediaQuery.test.ts` | Update all 768px references to 1024px |
| **Navigation** | `/src/components/navigation/NavigationPanel.tsx` | Replace `md:` → `lg:` (14 occurrences) |
| **Navigation** | `/src/components/navigation/NavigationMenu.tsx` | Replace `md:` → `lg:` (9 occurrences) |
| **Navigation** | `/src/components/navigation/ChatSection.tsx` | Replace `md:` → `lg:` (6 occurrences) |
| **Navigation** | `/src/components/navigation/MobileHeader.tsx` | Replace `md:hidden` → `lg:hidden` (1) |
| **Navigation** | `/src/components/navigation/MobileChatFooter.tsx` | Replace `md:hidden` → `lg:hidden` (2) |
| **Navigation** | `/src/components/navigation/HamburgerMenu.tsx` | Replace `md:hidden` → `lg:hidden` (2) |
| **Layout** | `/src/app/(public)/layout.tsx` | Replace `md:pt-0` → `lg:pt-0` (1) |

**Total Files:** 9  
**Total Changes:** ~35 class replacements + 1 hook update + test updates

---

## 8. Risk Assessment

### Low Risk ✅

**Why this change is safe:**

1. **Centralized breakpoint:** Single source of truth in `useIsDesktop()` hook
2. **Consistent pattern:** All components use same breakpoint (md: or useIsDesktop)
3. **No custom breakpoints:** Not affecting any other breakpoints in the system
4. **Tailwind standard:** `lg:` is a standard Tailwind breakpoint
5. **No layout shifts:** Same layout modes, just different trigger point
6. **Testable:** Can verify visually at different screen sizes

**Potential Issues (minimal):**

1. **User surprise:** Desktop users at 768-1023px see mobile nav (but this is actually better UX)
2. **Testing needed:** Verify behavior at 1023px, 1024px, 1025px
3. **Screenshots/tests:** Any hardcoded viewport tests at 768px need updating

### Testing Checklist

- [ ] Verify mobile nav appears at 1023px and below
- [ ] Verify desktop nav appears at 1024px and above
- [ ] Test navigation panel collapse/expand at 1024px+
- [ ] Test chat section expand/collapse at 1024px+
- [ ] Test mobile header visibility (< 1024px)
- [ ] Test mobile chat footer visibility (< 1024px)
- [ ] Test hamburger menu functionality (< 1024px)
- [ ] Verify no visual regressions on desktop (1280px+)
- [ ] Verify improved layout on tablets (768px-1023px)
- [ ] Run unit tests and update snapshots if needed

---

## 9. Alternative Solutions (Not Recommended)

### Option A: Custom Breakpoint (975px)

**Why not recommended:**
- Adds complexity with custom breakpoint
- Not a standard Tailwind breakpoint
- Requires theme extension in tailwind.config.ts
- Less semantic than using `lg:`

### Option B: Keep md: but adjust nav width

**Why not recommended:**
- Doesn't solve the fundamental issue
- Narrower nav panel would be less usable
- Still cramped content at 768-900px
- Chat section needs width for usability

### Option C: Collapsible-only nav at md:

**Why not recommended:**
- Poor UX - force users to expand nav
- Defeats purpose of persistent navigation
- Requires significant component refactoring

---

## 10. Conclusion

**Recommended Action:** Update breakpoint from `md:` (768px) to `lg:` (1024px)

**Implementation Time:** ~30 minutes
- 5 min: Update hook and tests
- 20 min: Find/replace `md:` → `lg:` in 7 navigation files
- 5 min: Manual testing

**Impact:** 
- ✅ Immediate improvement in content layout on tablets
- ✅ Better UX for 768-1023px viewports
- ✅ More intuitive breakpoint (1024px = traditional desktop)
- ✅ No breaking changes or regressions expected

**Next Steps:**
1. Get user approval on 1024px breakpoint
2. Create feature branch
3. Update `useIsDesktop()` hook
4. Find/replace `md:` → `lg:` in navigation components
5. Update tests
6. Manual testing at key breakpoints
7. Deploy and monitor

---

## Appendix: Grep Results

### All md: occurrences in navigation files

```
NavigationPanel.tsx:
- Line 62, 65, 67: Width classes
- Line 75: fixed md:relative
- Line 76: bottom-0 md:bottom-auto  
- Line 77: left-0 md:left-auto
- Line 80: h-auto md:h-full
- Line 82: flex md:flex-shrink-0
- Line 84: border-t md:border-t-0

NavigationMenu.tsx:
- Line 29: py-4 md:border-b ... h-auto md:h-[66%]
- Line 32: flex-row md:flex-col gap-2 md:gap-8 ... overflow-x-auto md:overflow-y-auto justify-around md:justify-start px-2 md:px-0
- Line 37: hidden md:flex
- Line 61: hidden md:flex  
- Line 68: hidden md:inline

ChatSection.tsx:
- Line 78: md:h-full ... md:h-[34%]
- Line 273: md:ml-0
- Line 275: md:hidden
- Line 283: hidden md:inline

MobileHeader.tsx:
- Line 19: md:hidden

MobileChatFooter.tsx:
- Line 21: md:hidden
- Line 29: md:hidden

HamburgerMenu.tsx:
- Line 28: md:hidden
- Line 34: md:hidden

layout.tsx:
- Line 27: pt-16 md:pt-0
```

---

**End of Analysis**

---

## 11. IMPORTANT: Scope Clarification

### Only Change Navigation-Related Breakpoints

**CRITICAL:** This change should ONLY affect navigation components. Do NOT replace all `md:` breakpoints in the entire codebase.

**Reason:** Content components (blog posts, case studies, UI elements, etc.) should continue using `md:` (768px) for their responsive behavior. They are designed to work within the available content area, regardless of navigation state.

### What Changes

Only these navigation-related files should have `md:` → `lg:` replacements:

1. `/src/hooks/useMediaQuery.ts` - The `useIsDesktop()` hook
2. `/src/components/navigation/NavigationPanel.tsx`
3. `/src/components/navigation/NavigationMenu.tsx`
4. `/src/components/navigation/ChatSection.tsx`
5. `/src/components/navigation/MobileHeader.tsx`
6. `/src/components/navigation/MobileChatFooter.tsx`
7. `/src/components/navigation/HamburgerMenu.tsx`
8. `/src/app/(public)/layout.tsx` - Only the `pt-16 md:pt-0` for mobile header spacing
9. `/src/hooks/__tests__/useMediaQuery.test.ts`

### What Does NOT Change

All other components keep their `md:` breakpoints:
- Blog components (`/src/components/blog/*`)
- Case study components (`/src/components/case-study*/*`)
- About page components (`/src/components/about/*`)
- UI components (`/src/components/ui/*`)
- Page layouts (`/src/app/(public)/*/page.tsx`)
- Any other non-navigation components

**Why:** These components are designed to be responsive within the content area. They will automatically benefit from the larger content area on tablets (768-1023px) when mobile navigation is shown, without needing their own breakpoint changes.

### Example: Blog Post Layout

A blog post uses `md:` breakpoints for its internal layout (2-column vs 1-column, text size, etc.):
- At 768px with mobile nav: Full-width content area, blog uses md: breakpoints normally
- At 768px with desktop nav (current): Cramped content area, blog md: breakpoints may not work well
- At 1024px with desktop nav: Good content area, blog md: breakpoints work well

By changing only the navigation breakpoint, we give content components more space to use their existing responsive design.

---

## 12. Updated File Count

### Actual Files to Change: 9

| # | File | Type |
|---|------|------|
| 1 | `/src/hooks/useMediaQuery.ts` | Hook definition + docs |
| 2 | `/src/hooks/__tests__/useMediaQuery.test.ts` | Tests |
| 3 | `/src/components/navigation/NavigationPanel.tsx` | Navigation |
| 4 | `/src/components/navigation/NavigationMenu.tsx` | Navigation |
| 5 | `/src/components/navigation/ChatSection.tsx` | Navigation |
| 6 | `/src/components/navigation/MobileHeader.tsx` | Navigation |
| 7 | `/src/components/navigation/MobileChatFooter.tsx` | Navigation |
| 8 | `/src/components/navigation/HamburgerMenu.tsx` | Navigation |
| 9 | `/src/app/(public)/layout.tsx` | Layout (nav spacing only) |

### Files to NOT Change: ~50+

All content, UI, and page components keep their existing `md:` breakpoints.

