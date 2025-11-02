# Component Styling Patterns

**Last Updated:** November 2, 2025
**Status:** Complete - Phase 4-7 Refactoring

---

## Overview

This guide documents the styling patterns and conventions used throughout the portfolio. Following these patterns ensures consistency, maintainability, and accessibility.

## Table of Contents

1. [Dark Mode Support](#dark-mode-support)
2. [Color Patterns](#color-patterns)
3. [Responsive Patterns](#responsive-patterns)
4. [Component Patterns](#component-patterns)
5. [Animation Patterns](#animation-patterns)
6. [Accessibility Patterns](#accessibility-patterns)
7. [Anti-Patterns](#anti-patterns)

---

## Dark Mode Support

### Color Mapping (Phase 4)

All purple colors have dark mode variants following this mapping:

```tsx
// Light mode → Dark mode
text-purple-400  →  dark:text-purple-300
text-purple-500  →  dark:text-purple-400
bg-purple-500    →  dark:bg-purple-400
border-purple-500 → dark:border-purple-400
```

### Pattern

```tsx
// ✅ GOOD: Always include dark mode variant
<div className="text-purple-400 dark:text-purple-300">

// ❌ AVOID: No dark mode support
<div className="text-purple-400">
```

### Rationale

- **Lighter in dark mode**: Prevents eye strain
- **Consistent mapping**: Easy to remember and apply
- **80+ colors updated**: Entire codebase follows this pattern

---

## Color Patterns

### Core Colors (Design System)

Defined in `globals.css`:

```css
:root {
  --color-text: 0 0% 3.1%;           /* Vampire black #080808 */
  --color-bg: 0 0% 98%;              /* Off-white #FAFAFA */
  --color-border: 280 15% 85%;       /* Light gray */
  --color-accent: 276 70% 45%;       /* Purple (light mode) */
}

.dark {
  --color-text: 0 0% 98%;            /* White */
  --color-bg: 240 10% 3%;            /* Very dark */
  --color-border: 240 5% 20%;        /* Dark borders */
  --color-accent: 276 100% 75%;      /* Bright purple (dark mode) */
}
```

### Semantic Tokens

Use semantic names, not raw colors:

```tsx
// ✅ GOOD: Semantic tokens
<div className="bg-background text-foreground border-border">

// ❌ AVOID: Hardcoded colors
<div className="bg-white text-black border-gray-300">
```

### Purple Accents

Purple is the primary accent color:

```tsx
// Buttons
<button className="bg-button-primary hover:bg-button-primary/90">

// Text highlights
<span className="text-purple-400 dark:text-purple-300">

// Borders and dividers
<div className="border-purple-500 dark:border-purple-400">

// Gradients
<h1 className="bg-gradient-to-br from-purple-400 dark:from-purple-300 to-white bg-clip-text text-transparent">
```

---

## Responsive Patterns

### Decision Framework (Phase 7)

**Use Tailwind CSS when controlling visibility/layout:**

```tsx
// ✅ GOOD: Pure CSS
<div className="hidden md:block">Desktop only</div>
<div className="block md:hidden">Mobile only</div>
<div className="w-full md:w-[320px]">Responsive width</div>
```

**Use JavaScript when controlling behavior/state:**

```tsx
// ✅ GOOD: Behavioral logic
const handleClick = isMobile ? expandThenNavigate : navigateImmediately;

// ✅ GOOD: Complex state
const showContent = isDesktop ? isExpanded : chatExpanded;
```

### Breakpoints

```typescript
// Tailwind defaults (tailwind.config.ts)
sm: '640px'   // Small devices
md: '768px'   // Tablets (our primary breakpoint)
lg: '1024px'  // Desktops
xl: '1280px'  // Large desktops
```

### Mobile-First Approach

```tsx
// ✅ GOOD: Mobile-first (base = mobile, md = desktop)
<div className="w-full md:w-[320px]">

// ❌ AVOID: Desktop-first
<div className="w-[320px] sm:w-full">
```

### Common Patterns

```tsx
// Flex direction
<div className="flex flex-col md:flex-row">

// Grid columns
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

// Padding/spacing
<div className="px-4 md:px-8 py-6 md:py-12">

// Text sizes
<h1 className="text-4xl md:text-5xl lg:text-6xl">

// Visibility
<nav className="hidden md:flex">          // Desktop only
<div className="block md:hidden">         // Mobile only
```

---

## Component Patterns

### Navigation Components

#### NavigationPanel

```tsx
// Dynamic width based on state
const getWidthClasses = () => {
  if (!isDesktop) return 'w-full';
  switch (panelState) {
    case 'partial': return 'md:w-[56px]';
    case 'expanded': return shouldBeWide ? 'md:w-[455px]' : 'md:w-[320px]';
  }
};

<div className={cn(
  "fixed md:relative",
  getWidthClasses(),
  hasInteracted && "transition-[width] duration-normal ease-smooth"
)}>
```

**Key Points:**
- Responsive width via helper function
- Conditional transitions (only after user interaction)
- Uses Phase 5 animation utilities

#### ChatSection

```tsx
// Dynamic height based on state
const getHeightClasses = () => {
  if (!isDesktop) {
    return chatExpanded ? 'h-[50vh]' : 'h-auto';
  }
  return chatExpanded ? 'md:h-full' : 'md:h-[34%]';
};

<div className={cn(
  "grid grid-rows-[auto_1fr_auto]",
  getHeightClasses()
)}>
```

**Key Points:**
- Mobile vs. desktop height logic
- Grid layout for header/content/footer
- Arbitrary values for specific dimensions

#### NavigationMenu

```tsx
// Pure Tailwind responsive (Phase 7)
<div className="h-auto md:h-[66%]">
  <Link className="hidden md:flex">    // Desktop only logo
    {/* Logo */}
  </Link>

  {isExpanded && (
    <span className="hidden md:inline">{label}</span>  // Desktop only labels
  )}
</div>
```

**Key Points:**
- No `useIsDesktop` hook needed
- Pure CSS visibility control
- JavaScript only for expansion state

### Card Components

```tsx
// Base card
<div className="card-base">
  {content}
</div>

// Interactive card
<div className="card-interactive group">
  <h3 className="transition-colors-smooth group-hover:text-purple-400 dark:group-hover:text-purple-300">
    {title}
  </h3>
</div>

// Elevated card
<div className="card-elevated">
  {content}
</div>
```

### Case Study Components (Phase 4)

Created 7 reusable components with clean APIs:

```tsx
import {
  CaseStudyHero,
  CaseStudySectionHeader,
  CaseStudySection,
  CaseStudyAnnotation,
  CaseStudyMetrics,
  CaseStudyAchievements,
  CaseStudyCTA
} from '@/components/case-studies/detail';

// Usage
<CaseStudyHero
  category="E-Commerce"
  title="Aesop"
  metric="+12% Conversion"
  description="Luxury e-commerce redesign"
  imageUrl="/images/aesop-hero.jpg"
/>

<CaseStudySection
  title="The Challenge"
  content="Lorem ipsum..."
  variant="default"
/>
```

**Benefits:**
- Consistent styling across case studies
- Type-safe props
- Built-in dark mode support
- Reduced duplication (428 → 307 lines, -28%)

---

## Animation Patterns

### Utility-First

```tsx
// ✅ GOOD: Use utility classes
<div className="transition-smooth hover:opacity-80">

// ❌ AVOID: Manual classes
<div className="transition-all duration-300 ease-out hover:opacity-80">
```

### Stagger Animations

```tsx
// Animate list items sequentially
<div className="space-y-4">
  {items.map((item) => (
    <div key={item.id} className="animate-stagger">
      {item.content}
    </div>
  ))}
</div>
```

**Limitations:** Max 20 children

### Interactive States

```tsx
// Scale on hover, shrink on active
<button className="interactive-scale">

// Opacity fade
<a className="interactive-opacity">

// Combined effects
<div className="interactive-scale transition-colors-smooth hover:bg-purple-500">
```

### Conditional Transitions

```tsx
// Only transition after user interaction (prevents flash on mount)
const [hasInteracted, setHasInteracted] = useState(false);

<div className={cn(
  "w-full md:w-[320px]",
  hasInteracted && "transition-[width] duration-normal ease-smooth"
)}>
```

---

## Accessibility Patterns

### Focus States

```tsx
// Always include focus states
<button className="focus-outline">
  {/* Uses consistent purple ring */}
</button>

// Custom focus (if needed)
<button className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 dark:focus-visible:ring-purple-300">
```

### ARIA Labels

```tsx
// Descriptive labels for interactive elements
<button aria-label={isExpanded ? 'Collapse chat' : 'Expand chat'}>
  <ChevronDown />
</button>

// State communication
<div aria-expanded={isExpanded} role="region">
```

### Motion Preferences

```tsx
// ✅ AUTOMATIC: Handled globally via globals.css
<div className="transition-smooth">
  {/* Respects prefers-reduced-motion automatically */}
</div>

// ❌ AVOID: Forcing animations
<div style={{ animation: 'spin 1s infinite' }}>
```

### Keyboard Navigation

```tsx
// Tab index for interactive elements
<div
  tabIndex={0}
  role="button"
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }}
>
```

---

## Anti-Patterns

### ❌ Inline Styles

```tsx
// ❌ BAD: Inline styles
<div style={{ width: '320px', transition: 'all 0.3s' }}>

// ✅ GOOD: Tailwind arbitrary values
<div className="w-[320px] transition-smooth">
```

### ❌ Magic Numbers

```tsx
// ❌ BAD: Magic numbers
<div className="duration-300">

// ✅ GOOD: Semantic names
<div className="duration-normal">
```

### ❌ No Dark Mode

```tsx
// ❌ BAD: Light mode only
<div className="text-purple-400">

// ✅ GOOD: Dark mode support
<div className="text-purple-400 dark:text-purple-300">
```

### ❌ JavaScript for Visibility

```tsx
// ❌ BAD: JavaScript for simple visibility
{isDesktop && <div>Desktop only</div>}

// ✅ GOOD: CSS responsive classes
<div className="hidden md:block">Desktop only</div>

// ✅ EXCEPTION: JavaScript for behavior
const action = isDesktop ? clickAction : tapAction;
```

### ❌ Hardcoded Colors

```tsx
// ❌ BAD: Hardcoded hex/rgb
<div className="text-[#8B5CF6]">

// ✅ GOOD: Tailwind colors with dark mode
<div className="text-purple-400 dark:text-purple-300">
```

### ❌ !important Declarations

```tsx
// ❌ BAD: Using !important
<div className="!text-purple-400">

// ✅ GOOD: Fix specificity issues properly
<div className="text-purple-400">
```

**Note:** All `!important` declarations were removed in Phase 1.

---

## Best Practices Summary

### ✅ DO

1. **Use semantic class names** (`duration-normal` not `duration-300`)
2. **Include dark mode variants** for all colors
3. **Use utility classes** from `globals.css`
4. **Use CSS for visibility**, JavaScript for behavior
5. **Include focus states** on all interactive elements
6. **Test with motion preferences** reduced
7. **Use helper functions** for dynamic classes
8. **Follow mobile-first** responsive approach

### ❌ DON'T

1. **Use inline styles** (use Tailwind arbitrary values instead)
2. **Skip dark mode variants** on colored elements
3. **Use JavaScript for visibility** (use Tailwind responsive instead)
4. **Use `!important`** (fix specificity properly)
5. **Use magic numbers** (use semantic duration names)
6. **Hardcode colors** (use design system tokens)
7. **Force animations** (respect motion preferences)
8. **Repeat class strings** (create utilities instead)

---

## Code Review Checklist

When reviewing component styling:

- [ ] Dark mode variants on all colored elements
- [ ] Semantic duration/easing names
- [ ] Utility classes used where applicable
- [ ] No inline styles (except dynamic values that can't be in Tailwind)
- [ ] Responsive classes (not JavaScript hooks) for visibility
- [ ] Focus states on interactive elements
- [ ] ARIA labels for accessibility
- [ ] No `!important` declarations
- [ ] Mobile-first responsive approach
- [ ] Motion preferences respected

---

## Migration Examples

### Example 1: Button Component

**Before (Phase 1-3):**
```tsx
<button
  style={{
    backgroundColor: '#8B5CF6',
    padding: '12px 24px',
    transition: 'all 0.3s ease-out'
  }}
  className="rounded-lg !text-white"
>
  Click me
</button>
```

**After (Phase 4-7):**
```tsx
<button className="
  bg-purple-500 dark:bg-purple-400
  px-6 py-3
  rounded-lg
  text-white
  transition-smooth
  hover:bg-purple-600 dark:hover:bg-purple-500
  focus-outline
">
  Click me
</button>
```

### Example 2: Responsive Card

**Before:**
```tsx
{isDesktop ? (
  <div style={{ width: '320px', transition: 'all 300ms' }}>
    <h3 style={{ color: '#8B5CF6' }}>{title}</h3>
    {content}
  </div>
) : (
  <div style={{ width: '100%' }}>
    <h3>{title}</h3>
    {content}
  </div>
)}
```

**After:**
```tsx
<div className="w-full md:w-[320px] card-interactive">
  <h3 className="text-purple-400 dark:text-purple-300 transition-colors-smooth group-hover:text-purple-500">
    {title}
  </h3>
  {content}
</div>
```

---

## Related Documentation

- [Animation System Guide](./animation-system.md)
- [Responsive Design Guide](./responsive-design-guide.md)
- [CSS Phase 4: Dark Mode Complete](./css-phase4-dark-mode-complete.md)
- [CSS Phase 5: Animation Standardization](./css-phase5-animation-standardization-progress.md)

---

## File Locations

- **Design System**: `/src/app/globals.css` - Core colors and utilities
- **Tailwind Config**: `/tailwind.config.ts` - Theme customization
- **Component Utils**: `/src/lib/utils.ts` - `cn()` helper
- **Case Study Components**: `/src/components/case-studies/detail/`

---

## Version History

- **v2.0** (Nov 2, 2025) - Phase 4-7 refactoring complete
- **v1.0** (Initial) - Basic component setup
