# Styling Exception Policy

**Last Updated:** November 2, 2025

This document defines when inline styles are acceptable and how to use the centralized Tailwind design system consistently across the portfolio.

---

## When to Use Inline Styles

Inline styles should be avoided in 99% of cases. Use Tailwind utilities or design system tokens instead.

### Acceptable Exceptions

Inline styles are acceptable ONLY in these scenarios:

#### 1. Complex Gradients

When a gradient composition is too complex for a utility class and used only once.

```tsx
// ✅ ACCEPTABLE (with documentation)
{/* Inline gradient required: Complex multi-stop composition used only in this component */}
<div style={{
  background: 'linear-gradient(135deg, rgba(255,0,0,0.5) 0%, rgba(0,255,0,0.3) 50%, rgba(0,0,255,0.2) 100%)'
}}>
```

**Note:** If the gradient is used 2+ times, create a utility class in `globals.css`.

#### 2. Dynamic Calculations

When values are calculated at runtime based on user data or component state.

```tsx
// ✅ ACCEPTABLE (runtime calculation)
<div style={{ width: `${percentage}%` }}>

// ✅ ACCEPTABLE (dynamic positioning)
<div style={{ transform: `translateX(${offsetX}px)` }}>
```

#### 3. Design Concepts

Components in `/src/components/design-concepts/` directory.

```tsx
/**
 * WarmDepth Design Concept
 *
 * NOTE: This is an experimental design concept with a custom orange theme.
 * It intentionally uses hardcoded colors NOT part of the main design system.
 *
 * STATUS: Non-production, demonstration only
 */
```

**Important:** These must be refactored before moving to production.

#### 4. Grid Template Columns

CSS Grid's `repeat(auto-fit, minmax(...))` syntax doesn't have a Tailwind equivalent.

```tsx
// ✅ ACCEPTABLE (no Tailwind alternative)
<div style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
```

---

## How to Document Exceptions

When inline styles are necessary, add a comment explaining why:

```tsx
{/* Inline style required: Dynamic calculation based on scroll position */}
<div style={{ opacity: scrollProgress }}>

{/* Inline gradient required: Complex composition not suitable for utility class */}
<div style={{ background: 'linear-gradient(...)' }}>

{/* No Tailwind alternative: CSS Grid auto-fit pattern */}
<div style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
```

---

## Color Usage Policy

All colors MUST use semantic tokens from the design system.

### ✅ CORRECT

```tsx
// Semantic tokens (preferred)
<div className="bg-accent text-foreground border-border">
<div className="bg-accent/10"> {/* Arbitrary opacity */}
<div className="text-muted-foreground"> {/* Semantic text color */}

// Component-specific tokens
<div className="bg-navigation text-navigation-foreground">
<div className="bg-chat text-chat-foreground">
<div className="bg-ai-card border-ai-card-border">

// Direct Tailwind colors with dark mode (acceptable)
<div className="text-purple-400 dark:text-purple-300">
```

### ❌ INCORRECT

```tsx
// Hardcoded hex colors
<div style={{ background: '#8B5CF6' }}>

// Hardcoded rgba values
<div style={{ color: 'rgba(199, 128, 245, 0.3)' }}>

// Tailwind colors without dark mode variant
<div className="bg-purple-500"> {/* Missing dark:bg-purple-400 */}

// Hardcoded HSL values
<div style={{ color: 'hsl(280, 100%, 80%)' }}>
```

**Why this matters:**
- Hardcoded colors don't adapt to dark mode
- Time-based theme changes won't work
- Design system updates won't propagate
- Inconsistent colors across the site

---

## Transition Usage Policy

Use semantic duration and easing tokens.

### ✅ CORRECT

```tsx
// Semantic transition utilities (preferred)
<div className="transition-smooth"> {/* 300ms, ease-smooth */}
<div className="transition-fast hover:scale-105"> {/* 150ms */}
<div className="transition-colors-smooth"> {/* 300ms colors only */}

// Explicit semantic tokens
<div className="transition-all duration-normal ease-smooth">
<div className="transition-transform duration-fast">
<div className="transition-opacity duration-slow">
```

### ❌ INCORRECT

```tsx
// Magic numbers
<div className="transition-all duration-300"> {/* Use duration-normal */}
<div className="transition-all duration-150"> {/* Use duration-fast */}

// Inline timing
<div style={{ transition: 'all 0.3s ease-out' }}>

// Non-semantic easing
<div className="ease-in-out"> {/* Use ease-smooth */}
```

**Available durations:**
- `duration-fast` - 150ms (quick interactions)
- `duration-normal` - 300ms (standard transitions)
- `duration-slow` - 400ms (noticeable changes)
- `duration-slower` - 600ms (major layout shifts)

**Available easings:**
- `ease-smooth` - cubic-bezier(0.4, 0, 0.2, 1)
- `ease-smooth` - cubic-bezier(0.25, 0.46, 0.45, 0.94)

---

## Sizing & Spacing Policy

Use Tailwind arbitrary values instead of inline styles.

### ✅ CORRECT

```tsx
// Tailwind arbitrary values
<div className="w-[320px] h-[66%]">
<div className="text-[1.25rem] leading-[1.7]">
<div className="tracking-[0.15em]">

// Responsive arbitrary values
<div className="text-[clamp(2rem,5vw,3.5rem)]">
<div className="w-[min(90%,1200px)]">
```

### ❌ INCORRECT

```tsx
// Inline styles
<div style={{ width: '320px', height: '66%' }}>
<div style={{ fontSize: '1.25rem', lineHeight: '1.7' }}>
<div style={{ letterSpacing: '0.15em' }}>
```

**Why use arbitrary values:**
- Consistent with Tailwind approach
- Easy to search and maintain
- No mixing of CSS-in-JS with utility classes
- Works with Tailwind IntelliSense

---

## Adding New Colors to Design System

If you need a color that doesn't exist in the design system:

### Step 1: Add to `globals.css`

```css
@layer base {
  :root {
    --new-feature-bg: 240 5% 95%;
    --new-feature-fg: 0 0% 3.1%;
  }

  .dark {
    --new-feature-bg: 240 10% 12%;
    --new-feature-fg: 0 0% 98%;
  }
}
```

### Step 2: Register in `tailwind.config.ts`

```typescript
export default {
  theme: {
    extend: {
      colors: {
        'new-feature': {
          DEFAULT: 'hsl(var(--new-feature-bg))',
          foreground: 'hsl(var(--new-feature-fg))'
        }
      }
    }
  }
} satisfies Config;
```

### Step 3: Use semantic token

```tsx
<div className="bg-new-feature text-new-feature-foreground">
```

---

## Enforcement

This policy is enforced through:

1. **Code Review** - PRs checked for violations using checklist
2. **Documentation** - This file and CLAUDE.md
3. **Periodic Audits** - Quarterly compliance audits
4. **Build Tooling** - ESLint rules (future enhancement)

---

## Review Checklist

Before merging code, verify:

- [ ] No inline `style` attributes (except documented exceptions)
- [ ] No hardcoded hex/rgba/hsl colors
- [ ] All colors use semantic tokens
- [ ] Transitions use semantic durations
- [ ] Dark mode variants on colored elements (or semantic tokens)
- [ ] Arbitrary Tailwind values instead of inline sizing
- [ ] TSDoc comments on any inline style exceptions

---

## Examples from Codebase

### Good Examples

**CaseStudyHero.tsx** (after Phase 2 refactor):
```tsx
// ✅ Uses gradient utility
<h1 className="gradient-hero-title">Title</h1>

// ✅ Uses semantic token with arbitrary opacity
<div className="bg-accent/[0.03]">

// ✅ Uses semantic foreground color
<p className="text-muted-foreground">Subtitle</p>

// ✅ Uses utility class
<span className="meta-info-item">Tag</span>
```

**MetricsSlide.tsx**:
```tsx
// ✅ Semantic tokens with arbitrary opacity
<div className="bg-gradient-to-br from-accent/10 to-accent/5">

// ✅ Utility class
<div className="transition-colors-smooth">
```

### Bad Examples (Fixed)

**Before Phase 1:**
```tsx
// ❌ Inline letter spacing
<div style={{ letterSpacing: '0.15em' }}>

// ❌ Hardcoded color
<p style={{ color: '#a0a0a0' }}>
```

**Before Phase 2:**
```tsx
// ❌ Hardcoded purple
<div style={{ background: 'rgba(199, 128, 245, 0.1)' }}>

// ❌ Hardcoded gradient
<h1 style={{
  background: 'linear-gradient(135deg, hsl(280, 100%, 80%), hsl(0, 0%, 98%))'
}}>
```

---

## Common Questions

### Q: Can I use Tailwind color classes like `bg-purple-500`?

**A:** Only if you include dark mode variant: `bg-purple-500 dark:bg-purple-400`.

**Better:** Use semantic token `bg-accent` which handles dark mode automatically.

### Q: When should I create a new utility class?

**A:** When you use the same pattern 3+ times across different components.

### Q: What if the design requires a color not in the system?

**A:**
1. First, check if a semantic token works
2. If not, add it to `globals.css` as a CSS variable
3. Register in `tailwind.config.ts`
4. Use as a semantic token

### Q: Can I use inline styles for animations?

**A:** Prefer Tailwind arbitrary values or keyframes in `globals.css`. Only use inline if the animation is truly dynamic (calculated at runtime).

### Q: What about third-party library styles?

**A:** Third-party libraries (like shadcn/ui, Radix) can have their own styles. Focus this policy on custom components only.

---

## Resources

- **Compliance Audit:** `/docs/tailwind-style-compliance-audit-2025-11-02.md`
- **Implementation Plan:** `/docs/tailwind-compliance-refactor-plan.md`
- **Quick Reference:** `/docs/css-quick-reference.md`
- **Animation System:** `/docs/animation-system.md`
- **Component Patterns:** `/docs/component-styling-patterns.md`

---

## Version History

| Date | Version | Changes |
|------|---------|---------|
| 2025-11-02 | 1.0.0 | Initial policy created as part of Phase 3 compliance refactor |

---

*This policy ensures consistency, maintainability, and proper integration with the time-based theme system.*
