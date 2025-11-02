# Animation System Documentation

*Last Updated: November 2, 2025*

## Overview

This portfolio uses a standardized animation system built on Tailwind CSS with custom durations, timing functions, and reusable utility classes. The system provides semantic naming, accessibility support, and consistent motion throughout the application.

## Core Principles

1. **Semantic Naming**: Use descriptive names like `duration-normal` instead of magic numbers
2. **Accessibility First**: Respects `prefers-reduced-motion` for users with vestibular disorders
3. **Consistent Timing**: Standardized durations create cohesive user experience
4. **Reusable Utilities**: Pre-built classes reduce duplication and ensure consistency
5. **Progressive Enhancement**: Animations enhance but don't block functionality

---

## Transition Durations

Defined in `tailwind.config.ts`:

```typescript
transitionDuration: {
  'fast': '150ms',      // Quick interactions (hover, focus)
  'normal': '300ms',    // Standard transitions (modals, dropdowns)
  'slow': '400ms',      // Noticeable changes (layout shifts)
  'slower': '600ms',    // Major layout transitions
}
```

### Usage Examples

```tsx
// Quick hover effects
<button className="transition-colors duration-fast hover:bg-purple-500">
  Click me
</button>

// Standard modal transition
<div className="transition-opacity duration-normal">
  Modal content
</div>

// Layout shift with noticeable transition
<div className="transition-all duration-slow">
  Expanding panel
</div>

// Major layout change
<nav className="transition-[width] duration-slower">
  Navigation panel
</nav>
```

### When to Use Each Duration

| Duration | Use Case | Examples |
|----------|----------|----------|
| `fast` | Quick interactions, hover states | Button hover, link hover, focus rings |
| `normal` | Standard UI transitions | Modals, dropdowns, tooltips, color changes |
| `slow` | Noticeable layout changes | Panel expansion, height changes, opacity fades |
| `slower` | Major structural shifts | Navigation width, sidebar collapse, page transitions |

---

## Timing Functions

Defined in `tailwind.config.ts`:

```typescript
transitionTimingFunction: {
  'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',           // Default ease-in-out
  'ease-smooth': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // Custom smooth curve
}
```

### Usage Examples

```tsx
// Default smooth timing
<div className="transition-all duration-normal ease-smooth">
  Smooth transition
</div>

// Combine with duration utilities
<div className="transition-transform duration-fast ease-smooth hover:scale-105">
  Interactive element
</div>
```

---

## Animation Delays

Support staggered animations with incremental delays (100ms - 800ms):

```typescript
animationDelay: {
  '100': '100ms',
  '200': '200ms',
  '300': '300ms',
  '400': '400ms',
  '500': '500ms',
  '600': '600ms',
  '700': '700ms',
  '800': '800ms',
}
```

### Usage Example

```tsx
// Manual stagger control
<div className="animate-fade-in delay-100">First</div>
<div className="animate-fade-in delay-200">Second</div>
<div className="animate-fade-in delay-300">Third</div>

// Or use the .animate-stagger utility (automatic delays)
<div className="grid grid-cols-3">
  <div className="animate-stagger">First (0ms delay)</div>
  <div className="animate-stagger">Second (100ms delay)</div>
  <div className="animate-stagger">Third (200ms delay)</div>
</div>
```

---

## Utility Classes

Pre-built utility classes in `globals.css` for common patterns.

### Layout Utilities

```css
.flex-center         /* flex items-center justify-center */
.flex-between        /* flex items-center justify-between */
.absolute-center     /* absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 */
```

**Usage Examples:**

```tsx
// Centering content
<div className="flex-center h-screen">
  <h1>Centered Content</h1>
</div>

// Header with space between
<header className="flex-between px-8 py-4">
  <Logo />
  <Navigation />
</header>

// Absolutely centered modal
<div className="absolute-center z-50">
  <Modal />
</div>
```

### Transition Utilities

```css
.transition-smooth         /* transition-all duration-normal ease-smooth */
.transition-fast          /* transition-all duration-fast ease-smooth */
.transition-slow          /* transition-all duration-slow ease-smooth */
.transition-colors-smooth /* transition-colors duration-normal ease-smooth */
```

**Usage Examples:**

```tsx
// Smooth all-property transition
<div className="transition-smooth hover:scale-105">
  Hover me
</div>

// Fast interactive element
<button className="transition-fast hover:bg-purple-500">
  Quick hover
</button>

// Color-only transition (better performance)
<div className="transition-colors-smooth hover:text-purple-400">
  Text color change
</div>
```

**Performance Note:** Use `.transition-colors-smooth` instead of `.transition-smooth` when only colors change - it's more performant as it doesn't trigger layout recalculations.

### Card Utilities

```css
.card-base        /* bg-card border border-border rounded-lg */
.card-interactive /* card-base + hover state + cursor-pointer */
.card-elevated    /* card-base + shadow */
```

**Usage Examples:**

```tsx
// Basic card
<div className="card-base p-6">
  <h3>Card Title</h3>
  <p>Card content</p>
</div>

// Interactive card with hover state
<div className="card-interactive p-6" onClick={handleClick}>
  <h3>Clickable Card</h3>
</div>

// Card with shadow elevation
<div className="card-elevated p-6">
  <h3>Elevated Card</h3>
</div>
```

### Interactive State Utilities

```css
.interactive-scale   /* transition-transform duration-fast hover:scale-105 active:scale-95 */
.interactive-opacity /* transition-opacity duration-normal hover:opacity-80 */
```

**Usage Examples:**

```tsx
// Scale on hover/click
<button className="interactive-scale">
  Scale Button
</button>

// Opacity on hover
<img src="..." className="interactive-opacity" />
```

### Focus Utilities

```css
.focus-outline /* focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 */
```

**Usage Example:**

```tsx
// Accessible focus state
<button className="focus-outline">
  Keyboard accessible
</button>
```

---

## Pre-built Animations

Defined in `globals.css` with keyframes.

### Fade In

```css
.animate-fade-in /* Fades in with 20px upward motion over 0.8s */
```

**Keyframe:**
```css
@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

**Usage:**
```tsx
<div className="animate-fade-in">
  <h1>Fades in from below</h1>
</div>
```

### Slide Up

```css
.animate-slide-up /* Slides up 40px with fade over 0.8s */
```

**Keyframe:**
```css
@keyframes slide-up {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}
```

**Usage:**
```tsx
<div className="animate-slide-up">
  <h1>Slides up from further below</h1>
</div>
```

### Stagger Animation

```css
.animate-stagger /* Automatically staggers children with 100ms incremental delay */
```

**Supports up to 20 children** with automatic delays:
- 1st child: 0ms
- 2nd child: 100ms
- 3rd child: 200ms
- ...
- 20th child: 1900ms

**Usage:**
```tsx
<div>
  {items.map(item => (
    <div key={item.id} className="animate-stagger">
      {item.content}
    </div>
  ))}
</div>
```

**Before Phase 5:** Only supported 5 children
**After Phase 5:** Supports 20 children (4× increase)

### Slow Pulse

```css
.animate-slow-pulse /* Gentle opacity pulse over 4 seconds, infinite */
```

**Keyframe:**
```css
@keyframes slow-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
```

**Usage:**
```tsx
<div className="animate-slow-pulse">
  <LoadingSpinner />
</div>
```

---

## Accessibility

### Prefers Reduced Motion

The animation system **automatically respects** user motion preferences:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**What this means:**
- Users who enable "Reduce Motion" in their OS settings will see instant transitions
- Animations complete in 0.01ms (effectively instant)
- Scroll behavior becomes immediate (no smooth scrolling)
- Meets **WCAG 2.1 Success Criterion 2.3.3** (Animation from Interactions)

**You don't need to do anything** - this is automatic for all animations.

---

## Best Practices

### 1. Choose the Right Duration

```tsx
// ✅ GOOD: Fast hover effects
<button className="transition-colors duration-fast hover:bg-purple-500">
  Hover me
</button>

// ❌ BAD: Slow hover effects feel sluggish
<button className="transition-colors duration-slower hover:bg-purple-500">
  Feels slow
</button>
```

### 2. Use Color Transitions for Performance

```tsx
// ✅ GOOD: Only animate colors
<div className="transition-colors-smooth hover:text-purple-400">
  Better performance
</div>

// ❌ ACCEPTABLE: Animates all properties (including layout)
<div className="transition-smooth hover:text-purple-400">
  Slightly worse performance
</div>
```

### 3. Limit Animated Properties

```tsx
// ✅ GOOD: Specific property transition
<div className="transition-[width] duration-normal">
  Only width animates
</div>

// ❌ LESS IDEAL: All properties animate
<div className="transition-all duration-normal">
  Everything animates (more expensive)
</div>
```

### 4. Use Utility Classes for Common Patterns

```tsx
// ✅ GOOD: Use pre-built utilities
<button className="transition-fast interactive-scale">
  Consistent pattern
</button>

// ❌ VERBOSE: Repeating the same classes everywhere
<button className="transition-transform duration-fast hover:scale-105 active:scale-95">
  Duplicate code
</button>
```

### 5. Stagger for Lists

```tsx
// ✅ GOOD: Automatic stagger
<div>
  {items.map(item => (
    <div key={item.id} className="animate-stagger">
      {item.content}
    </div>
  ))}
</div>

// ❌ MANUAL: Harder to maintain
<div className="animate-fade-in delay-100">Item 1</div>
<div className="animate-fade-in delay-200">Item 2</div>
<div className="animate-fade-in delay-300">Item 3</div>
```

### 6. Responsive Animations

```tsx
// ✅ GOOD: Only animate on larger screens
<div className="md:transition-smooth md:hover:scale-105">
  No animation on mobile (better performance)
</div>
```

### 7. Combine Utilities

```tsx
// ✅ EXCELLENT: Combining utilities for complex effects
<div className="card-interactive transition-slow interactive-scale">
  Card with smooth hover and scale
</div>
```

---

## Common Patterns

### Modal Fade In

```tsx
<div className={cn(
  "fixed inset-0 bg-black/50 transition-opacity duration-normal",
  isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
)}>
  <div className="absolute-center transition-transform duration-slow">
    <Modal />
  </div>
</div>
```

### Expandable Panel

```tsx
<div className={cn(
  "transition-[height] duration-slow overflow-hidden",
  isExpanded ? "h-auto" : "h-0"
)}>
  {content}
</div>
```

### Interactive Card Grid

```tsx
<div className="grid grid-cols-3 gap-6">
  {cards.map((card, i) => (
    <div key={card.id} className="card-interactive interactive-scale animate-stagger">
      {card.content}
    </div>
  ))}
</div>
```

### Button with Multiple States

```tsx
<button className={cn(
  "transition-fast focus-outline",
  isLoading && "opacity-50 pointer-events-none",
  !isLoading && "interactive-scale"
)}>
  {isLoading ? "Loading..." : "Submit"}
</button>
```

---

## Quick Reference

### Duration Scale
| Class | Duration | Use For |
|-------|----------|---------|
| `duration-fast` | 150ms | Hover, focus states |
| `duration-normal` | 300ms | Modals, dropdowns |
| `duration-slow` | 400ms | Layout changes |
| `duration-slower` | 600ms | Major transitions |

### Utility Classes
| Class | Purpose |
|-------|---------|
| `.transition-smooth` | All properties, normal duration |
| `.transition-fast` | All properties, fast duration |
| `.transition-slow` | All properties, slow duration |
| `.transition-colors-smooth` | Colors only (better performance) |
| `.card-base` | Basic card styling |
| `.card-interactive` | Card with hover state |
| `.card-elevated` | Card with shadow |
| `.interactive-scale` | Scale on hover/click |
| `.interactive-opacity` | Opacity on hover |
| `.focus-outline` | Accessible focus ring |
| `.flex-center` | Center content |
| `.flex-between` | Space between |
| `.absolute-center` | Absolute center positioning |

### Animations
| Class | Effect | Duration |
|-------|--------|----------|
| `.animate-fade-in` | Fade + 20px up | 0.8s |
| `.animate-slide-up` | Fade + 40px up | 0.8s |
| `.animate-stagger` | Auto-stagger children | 0.8s + delays |
| `.animate-slow-pulse` | Gentle opacity pulse | 4s (infinite) |

---

## Resources

- **Tailwind Config**: `/tailwind.config.ts` (lines 128-147)
- **Global CSS**: `/src/app/globals.css` (lines 188-383)
- **CSS Variables**: `/src/app/globals.css` (lines 10-164)
- **Phase 5 Documentation**: `/docs/css-phase5-animation-standardization-progress.md`
