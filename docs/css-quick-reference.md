# CSS Quick Reference

**Last Updated:** November 2, 2025
**Quick access guide for common styling patterns**

---

## Animation Utilities

```tsx
// Transitions
<div className="transition-smooth">           // All properties, 300ms
<div className="transition-fast">             // All properties, 150ms
<div className="transition-slow">             // All properties, 400ms
<div className="transition-colors-smooth">    // Colors only, 300ms

// Interactive
<button className="interactive-scale">        // Hover scale + active press
<a className="interactive-opacity">           // Hover opacity fade

// Stagger (max 20 children)
<div className="animate-stagger">
```

## Duration Scale

```tsx
duration-fast    // 150ms - Hover, focus
duration-normal  // 300ms - Standard transitions
duration-slow    // 400ms - Noticeable changes
duration-slower  // 600ms - Major layout shifts
```

## Layout Utilities

```tsx
<div className="flex-center">         // flex items-center justify-center
<div className="flex-between">        // flex items-center justify-between
<div className="absolute-center">     // Absolute centered with transform
```

## Card Utilities

```tsx
<div className="card-base">           // Base card with border
<div className="card-interactive">    // Clickable card with hover
<div className="card-elevated">       // Card with shadow
```

## Focus Utility

```tsx
<button className="focus-outline">    // Purple focus ring (dark mode aware)
```

## Dark Mode Colors

```tsx
// Text
text-purple-400 dark:text-purple-300
text-purple-500 dark:text-purple-400

// Background
bg-purple-500 dark:bg-purple-400

// Border
border-purple-500 dark:border-purple-400
```

## Responsive Patterns

```tsx
// Visibility
<div className="hidden md:block">              // Desktop only
<div className="block md:hidden">              // Mobile only
<div className="hidden md:flex">               // Desktop flex

// Dimensions
<div className="w-full md:w-[320px]">          // Full mobile, fixed desktop
<div className="h-auto md:h-[66%]">            // Auto mobile, 66% desktop

// Typography
<h1 className="text-4xl md:text-5xl lg:text-6xl">

// Spacing
<div className="px-4 md:px-8 py-6 md:py-12">

// Flex
<div className="flex flex-col md:flex-row">

// Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

## Decision Framework

### Use CSS When:
- Controlling visibility/layout only
- Responsive dimensions
- Simple state-based classes

```tsx
<div className="hidden md:block">
```

### Use JavaScript When:
- Different behaviors on mobile/desktop
- Complex state calculations
- Conditional event handlers

```tsx
const action = isMobile ? expandThen Navigate : navigateImmediately;
```

## Common Patterns

### Button

```tsx
<button className="
  bg-purple-500 dark:bg-purple-400
  px-6 py-3 rounded-lg
  transition-colors-smooth
  hover:bg-purple-600 dark:hover:bg-purple-500
  focus-outline
">
```

### Interactive Card

```tsx
<div className="card-interactive group">
  <h3 className="transition-colors-smooth group-hover:text-purple-400 dark:group-hover:text-purple-300">
    Title
  </h3>
</div>
```

### Staggered List

```tsx
<div className="space-y-4">
  {items.map(item => (
    <div key={item.id} className="animate-stagger card-elevated">
      {item.content}
    </div>
  ))}
</div>
```

### Responsive Navigation

```tsx
<nav className="
  fixed bottom-0 w-full
  md:relative md:w-[320px]
  transition-[width] duration-normal ease-smooth
">
```

## Do's and Don'ts

### ✅ DO

```tsx
// Semantic names
<div className="duration-normal">

// Dark mode
<div className="text-purple-400 dark:text-purple-300">

// Utility classes
<div className="transition-smooth">

// CSS for visibility
<div className="hidden md:block">
```

### ❌ DON'T

```tsx
// Magic numbers
<div className="duration-300">

// No dark mode
<div className="text-purple-400">

// Manual classes
<div className="transition-all duration-300 ease-out">

// JavaScript for visibility
{isDesktop && <div>}
```

## File Locations

- **Utilities**: `/src/app/globals.css`
- **Config**: `/tailwind.config.ts`
- **Helpers**: `/src/lib/utils.ts` (`cn()` function)
- **Hooks**: `/src/hooks/useMediaQuery.ts`

## Full Documentation

- [Animation System](./animation-system.md)
- [Component Styling Patterns](./component-styling-patterns.md)
- [Responsive Design Guide](./responsive-design-guide.md)
