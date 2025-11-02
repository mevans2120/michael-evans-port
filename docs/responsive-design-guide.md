# Responsive Design Guide

**Last Updated:** November 2, 2025
**Status:** Complete - Phase 7 Refactoring

---

## Overview

This guide explains when to use CSS vs. JavaScript for responsive behavior, based on the decision framework established in Phase 7.

## Table of Contents

1. [Decision Framework](#decision-framework)
2. [Breakpoints](#breakpoints)
3. [CSS Patterns](#css-patterns)
4. [JavaScript Patterns](#javascript-patterns)
5. [Migration Guide](#migration-guide)
6. [Examples](#examples)

---

## Decision Framework

### Use Tailwind CSS For:

**Visibility/Layout Control**

```tsx
// ✅ GOOD: CSS handles visibility
<div className="hidden md:block">Desktop only</div>
<div className="block md:hidden">Mobile only</div>
```

**Responsive Dimensions**

```tsx
// ✅ GOOD: CSS handles sizing
<div className="w-full md:w-[320px]">
<div className="h-auto md:h-[66%]">
```

**Responsive Spacing**

```tsx
// ✅ GOOD: CSS handles spacing
<div className="px-4 md:px-8 py-6 md:py-12">
```

**Responsive Typography**

```tsx
// ✅ GOOD: CSS handles text sizing
<h1 className="text-4xl md:text-5xl lg:text-6xl">
```

### Use JavaScript For:

**Behavioral Logic**

```tsx
// ✅ GOOD: JavaScript handles behavior
const handleClick = isMobile ? expandThenNavigate : navigateImmediately;
```

**Complex State Calculations**

```tsx
// ✅ GOOD: JavaScript for state logic
const showContent = isDesktop ? isExpanded : chatExpanded;
```

**Conditional Event Handlers**

```tsx
// ✅ GOOD: JavaScript for event logic
const onMouseEnter = isDesktop ? handleHover : undefined;
```

**Dynamic Element Rendering**

```tsx
// ✅ GOOD: JavaScript when elements differ significantly
{isDesktop ? (
  <DesktopInteractiveFeature />
) : (
  <MobileTapFeature />
)}
```

---

## Breakpoints

### Tailwind Defaults

```typescript
// tailwind.config.ts
screens: {
  'sm': '640px',    // Small devices (rarely used)
  'md': '768px',    // Tablets (PRIMARY BREAKPOINT)
  'lg': '1024px',   // Desktops
  'xl': '1280px',   // Large desktops
  '2xl': '1536px'   // Extra large (rarely used)
}
```

### Our Usage

**Primary: `md` (768px)**
- Most responsive changes happen here
- Separates mobile from desktop

**Occasional: `lg` (1024px)**
- Used for larger text/spacing on big screens
- Grid column increases

**Rarely: `sm`, `xl`, `2xl`**
- Only when specific granularity needed

### Mobile-First

Always style mobile first, then add `md:` and larger:

```tsx
// ✅ GOOD: Mobile-first
<div className="w-full md:w-[320px] lg:w-[400px]">

// ❌ AVOID: Desktop-first
<div className="w-[400px] lg:w-[320px] md:w-full">
```

---

## CSS Patterns

### Visibility

```tsx
// Desktop only
<div className="hidden md:block">
<div className="hidden md:flex">
<div className="hidden md:inline">

// Mobile only
<div className="block md:hidden">
<div className="flex md:hidden">

// Different display modes
<div className="flex md:grid">  // Flex on mobile, grid on desktop
```

### Width

```tsx
// Full width mobile, fixed desktop
<div className="w-full md:w-[320px]">
<div className="w-full md:w-[56px]">

// Percentage widths
<div className="w-full md:w-1/2 lg:w-1/3">

// Max widths
<div className="w-full max-w-7xl">
```

### Height

```tsx
// Auto mobile, fixed desktop
<div className="h-auto md:h-[66%]">
<div className="h-auto md:h-full">

// Viewport heights
<div className="h-[50vh] md:h-full">

// Min/max heights
<div className="min-h-screen md:min-h-0">
```

### Flex Direction

```tsx
// Stack on mobile, row on desktop
<div className="flex flex-col md:flex-row">

// Reverse on desktop
<div className="flex flex-col md:flex-row-reverse">
```

### Grid Columns

```tsx
// 1 column mobile, 2 tablet, 3 desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

// Auto-fill responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
```

### Spacing

```tsx
// Padding
<div className="px-4 md:px-8 lg:px-12">
<div className="py-6 md:py-12">

// Gap
<div className="gap-4 md:gap-8">

// Margin
<div className="mb-4 md:mb-8 lg:mb-12">
```

### Typography

```tsx
// Text size
<h1 className="text-4xl md:text-5xl lg:text-6xl">

// Line height
<p className="leading-relaxed md:leading-loose">

// Text alignment
<div className="text-center md:text-left">
```

---

## JavaScript Patterns

### When JavaScript is Needed

#### 1. Tap vs. Click Behavior

```tsx
// FeaturedCaseStudies.tsx example
const isMobile = useMediaQuery('(max-width: 768px)');

const handleClick = (id: string, slug: string) => {
  if (isMobile) {
    // Mobile: First tap expands, second tap navigates
    if (expandedId === id) {
      router.push(`/case-studies/${slug}`);
    } else {
      setExpandedId(id);
    }
  } else {
    // Desktop: Click navigates immediately
    router.push(`/case-studies/${slug}`);
  }
};
```

**Why JavaScript:** Different behaviors, not just different styles.

#### 2. Complex State Logic

```tsx
// ChatSection.tsx example
const isDesktop = useIsDesktop();
const showChatContent = isDesktop ? isExpanded : chatExpanded;
```

**Why JavaScript:** State depends on device type.

#### 3. Conditional Event Handlers

```tsx
// NavigationPanel.tsx example
const isDesktop = useIsDesktop();

<div onClick={panelState === 'partial' ? handleClick : undefined}>
  {/* Only clickable in partial state on desktop */}
</div>
```

**Why JavaScript:** Event handler existence changes.

#### 4. Element Rendering

```tsx
// When elements are fundamentally different
{isDesktop && (
  <button
    className="absolute right-0 top-1/2"
    onClick={handleBorderClick}
  >
    <ChevronLeft />
  </button>
)}
```

**Why JavaScript:** Element doesn't exist on mobile (not just hidden).

### Hooks

#### useIsDesktop()

```tsx
import { useIsDesktop } from '@/hooks/useMediaQuery';

const isDesktop = useIsDesktop();  // true when width >= 768px
```

#### useMediaQuery()

```tsx
import { useMediaQuery } from '@/hooks/useMediaQuery';

const isMobile = useMediaQuery('(max-width: 768px)');
const isLarge = useMediaQuery('(min-width: 1024px)');
```

---

## Migration Guide

### Converting JavaScript to CSS

#### Before: JavaScript Visibility

```tsx
{isDesktop && <div>Desktop content</div>}
{!isDesktop && <div>Mobile content</div>}
```

#### After: CSS Visibility

```tsx
<div className="hidden md:block">Desktop content</div>
<div className="block md:hidden">Mobile content</div>
```

### Converting CSS to JavaScript

#### When Behavior Differs

```tsx
// ❌ INCORRECT: Can't express with CSS
<div className="md:onClick={handleDesktopClick}">

// ✅ CORRECT: Use JavaScript
<div onClick={isDesktop ? handleDesktopClick : handleMobileClick}>
```

### Hybrid Approach

Sometimes you need both:

```tsx
const isDesktop = useIsDesktop();

<div className="hidden md:flex items-center gap-2">
  {/* CSS: Visibility */}

  <button onClick={isDesktop ? quickAction : slowAction}>
    {/* JavaScript: Behavior */}
  </button>
</div>
```

---

## Examples

### Example 1: Navigation Logo

**Before (Phase 6):**
```tsx
{isDesktop && (
  <Link href="/" className="flex items-center gap-2">
    <Logo />
  </Link>
)}
```

**After (Phase 7):**
```tsx
<Link href="/" className="hidden md:flex items-center gap-2">
  <Logo />
</Link>
```

**Why:** Only visibility changed, no behavioral difference.

### Example 2: Navigation Labels

**Before:**
```tsx
<Icon className="w-4 h-4" />
{isExpanded && isDesktop && <span>{label}</span>}
```

**After:**
```tsx
<Icon className="w-4 h-4" />
{isExpanded && <span className="hidden md:inline">{label}</span>}
```

**Why:** Visibility control moved to CSS, expansion state stays in JavaScript.

### Example 3: Panel Height

**Before (Inline Style):**
```tsx
const heightStyle = isDesktop
  ? (chatExpanded ? '100%' : '34%')
  : (chatExpanded ? '50vh' : 'auto');

<div style={{ height: heightStyle }}>
```

**After (Tailwind Arbitrary):**
```tsx
const getHeightClasses = () => {
  if (!isDesktop) {
    return chatExpanded ? 'h-[50vh]' : 'h-auto';
  }
  return chatExpanded ? 'md:h-full' : 'md:h-[34%]';
};

<div className={getHeightClasses()}>
```

**Why:** Dynamic values, but using Tailwind classes instead of inline styles.

### Example 4: Case Study Interaction

**Stays JavaScript:**
```tsx
const isMobile = useMediaQuery('(max-width: 768px)');

const handleClick = (id: string, slug: string) => {
  if (isMobile) {
    // Tap to expand, tap again to navigate
    expandedId === id ? navigate(slug) : expand(id);
  } else {
    // Click to navigate immediately
    navigate(slug);
  }
};
```

**Why:** Completely different interaction patterns - can't be expressed in CSS.

---

## Performance Considerations

### CSS Advantages

**Faster Initial Render:**
- No JavaScript execution needed
- Styles apply immediately
- No hydration mismatch

**Better SSR:**
- Correct layout on first paint
- No flash of incorrect content
- SEO-friendly

**Smaller Bundle:**
- Less JavaScript to download
- Fewer hooks imported
- Simpler component logic

### JavaScript When Needed

**Complex Logic:**
- State calculations
- Event handler variations
- Behavioral differences

**Don't Optimize Prematurely:**
- Use JavaScript when it makes sense
- Don't contort code to avoid hooks
- Balance simplicity vs. performance

---

## Testing

### Visual Testing

Test all breakpoints:

```bash
npm run test:visual  # Tests desktop/tablet/mobile
```

### Manual Testing

1. **Resize browser** from mobile → desktop
2. **Test interactions** at each breakpoint
3. **Check for flashes** on load (indicates hydration issue)
4. **Verify animations** work smoothly

### Responsive Test Checklist

- [ ] Mobile view (< 768px) works
- [ ] Tablet view (768px - 1024px) works
- [ ] Desktop view (> 1024px) works
- [ ] No content flash on load
- [ ] Transitions smooth between breakpoints
- [ ] Interactive elements work on all sizes
- [ ] No horizontal scroll
- [ ] Touch targets adequate on mobile (min 44x44px)

---

## Common Patterns

### Navigation

```tsx
// Mobile: Bottom nav, Desktop: Side nav
<nav className="
  fixed bottom-0 left-0 right-0 w-full
  md:relative md:left-auto md:bottom-auto md:w-[320px]
">
```

### Modals

```tsx
// Mobile: Full screen, Desktop: Centered card
<div className="
  fixed inset-0 w-full h-full
  md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2
  md:w-[600px] md:h-auto md:rounded-lg
">
```

### Cards

```tsx
// Mobile: Stack, Desktop: Grid
<div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
  {items.map(item => (
    <Card key={item.id} className="w-full" />
  ))}
</div>
```

### Images

```tsx
// Mobile: Full width, Desktop: Constrained
<Image
  src={src}
  alt={alt}
  className="w-full md:w-auto md:max-w-3xl"
/>
```

---

## Troubleshooting

### Problem: Flash of wrong layout

**Cause:** JavaScript hook evaluates after initial render

**Solution:** Use CSS responsive classes instead

```tsx
// ❌ CAUSES FLASH
{isDesktop && <DesktopNav />}
{!isDesktop && <MobileNav />}

// ✅ NO FLASH
<nav className="hidden md:block"><DesktopNav /></nav>
<nav className="block md:hidden"><MobileNav /></nav>
```

### Problem: Touch targets too small

**Cause:** Desktop sizing used on mobile

**Solution:** Increase size on mobile

```tsx
// ✅ GOOD
<button className="p-4 md:p-2">  // Larger padding on mobile
```

### Problem: Horizontal scroll on mobile

**Cause:** Fixed widths exceed viewport

**Solution:** Use `w-full` or `max-w-full` on mobile

```tsx
// ❌ BAD
<div className="w-[500px]">

// ✅ GOOD
<div className="w-full md:w-[500px]">
```

---

## Related Documentation

- [Component Styling Patterns](./component-styling-patterns.md)
- [Animation System Guide](./animation-system.md)
- [CSS Phase 7: Responsive Logic Complete](./css-remaining-enhancements-plan.md)

---

## File Locations

- **Responsive Hooks**: `/src/hooks/useMediaQuery.ts`
- **Breakpoint Config**: `/tailwind.config.ts`

---

## Version History

- **v2.0** (Nov 2, 2025) - Phase 7 decision framework
- **v1.0** (Initial) - Basic responsive setup
