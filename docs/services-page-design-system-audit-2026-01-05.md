# Services Page Design System Audit

**Date:** January 5, 2026
**Reference:** Site-wide typography convention

---

## Files Reviewed

- `src/app/(public)/services/page.tsx`
- `src/components/services/ServicesHero.tsx`
- `src/components/services/ServiceEntry.tsx`
- `src/components/services/ServicesInterlude.tsx`

---

## Summary of Issues

| Issue | Location | Severity |
|-------|----------|----------|
| Typography reversed | All components | High |
| Inline styles for animation delays | page.tsx:90, ServicesInterlude.tsx:11 | Medium |

---

## Issue 1: Typography is Reversed

**Site-wide convention:**
- **Headings**: `font-sans` (DM Sans)
- **Body copy**: `font-serif` (Crimson Pro) - must be explicit, not inherited

**Current services page implementation:**
- **Headings**: `font-serif` (wrong)
- **Body copy**: no font class, falls back to `font-sans` from body element (wrong)

### Specific Problems

**ServicesHero.tsx:9**
```tsx
// Current (wrong)
<h1 className="font-serif text-[clamp(2rem,4vw,3rem)] font-light ...">

// Should be
<h1 className="font-sans text-[clamp(2rem,4vw,3rem)] font-light ...">
```

**ServiceEntry.tsx:21**
```tsx
// Current (wrong) - lead-in quote
<p className="font-serif text-[1.375rem] ...">

// Should be
<p className="font-serif text-[1.375rem] ...">  // This one is actually correct - quotes are body copy
```

**ServiceEntry.tsx:35**
```tsx
// Current (wrong) - service title (this is a heading)
<h3 className="font-serif text-xl font-medium ...">

// Should be
<h3 className="font-sans text-xl font-medium ...">
```

**ServiceEntry.tsx:39-44** - answer paragraphs have no explicit font, inheriting sans from body. Should have `font-serif` for body copy.

**ServicesInterlude.tsx:16**
```tsx
// Current (wrong) - interlude quote (this is body copy, so actually correct)
<p className="font-serif text-lg font-light ...">

// This is correct - quotes/body text should be serif
```

### Reference: Site-wide Examples

```tsx
// Homepage, About, Case Studies - headings use sans
<h1 className="... font-sans font-light ...">
<h2 className="... font-sans ...">
<h3 className="... font-sans ...">

// Homepage, About, Blog, Case Studies - body copy uses serif (explicit)
<p className="... font-serif ...">
```

Note: `globals.css` sets `body { font-sans }` as a fallback. Body copy must explicitly use `font-serif`.

---

## Issue 2: Inline Styles for Animation Delays

**Current:**
```tsx
// page.tsx:90
style={{ animationDelay: '0.1s' }}

// ServicesInterlude.tsx:11
style={{ animationDelay: '0.2s' }}
```

**Problem:** The `animate-stagger` utility in `globals.css` handles delays for list items. For sections, we can use the same `animate-in fade-in duration-700` without delays, or create Tailwind utilities for section delays.

**Fix options:**
1. Remove the delays (sections animate together)
2. Add utilities: `[animation-delay:0.1s]` `[animation-delay:0.2s]` (Tailwind arbitrary property)

---

## What's Correct

| Element | Status |
|---------|--------|
| Animation pattern (`animate-in fade-in duration-700`) | Matches Homepage |
| Semantic color tokens | Correct |
| Dark mode support | Correct |
| `transition-colors-smooth` utility | Correct |
| Atmospheric blur orbs | Matches About page |

---

## Fixes Required

### ServicesHero.tsx

```tsx
// Line 9: Change font-serif to font-sans
<h1 className="font-sans text-[clamp(2rem,4vw,3rem)] font-light leading-[1.3] mb-6">
```

### ServiceEntry.tsx

```tsx
// Line 35: Change font-serif to font-sans for heading
<h3 className="font-sans text-xl font-medium text-foreground mb-3">

// Lines 39-44: Add font-serif to body paragraphs
<p className="font-serif text-muted-foreground leading-[1.7] mb-3 last:mb-0">
```

### page.tsx

```tsx
// Line 90: Replace inline style with Tailwind arbitrary property
<div className="flex flex-col gap-12 animate-in fade-in duration-700 [animation-delay:0.1s]">
```

### ServicesInterlude.tsx

```tsx
// Line 10-11: Replace inline style
<section className="py-[60px] text-center animate-in fade-in duration-700 [animation-delay:0.2s]">
```

---

## Design Spec Conflict Note

The services page design spec (`docs/design/services-page-concepts-121925/services-hifi-iteration-plan.md`) documents:
- `font-serif` for headlines
- `font-sans` for body text

This is the **opposite** of the site-wide convention. The design spec should be updated to match the established pattern.
