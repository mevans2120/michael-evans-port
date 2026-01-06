# Globals & Layout Consolidation Audit

**Date:** January 5, 2026
**Goal:** Identify redundancies and move element styles to layout.tsx where possible

---

## Summary

| Issue | Type | Action |
|-------|------|--------|
| `body` styles duplicated | Redundancy | Consolidate to layout.tsx |
| `h1-h6 { font-serif }` global rule | **Wrong** | Remove entirely |
| `html { bg-background }` | Could move | Move to layout.tsx |

---

## Issue 1: Body Styles Duplicated

**globals.css:244-247**
```css
body {
  @apply font-sans bg-background text-foreground;
  font-weight: 300;
}
```

**layout.tsx:135**
```tsx
<body className="font-sans overflow-hidden">
```

### Fix

Remove body rule from globals.css. Update layout.tsx:

```tsx
<body className="font-sans font-light bg-background text-foreground overflow-hidden">
```

---

## Issue 2: Heading Rule is Wrong

**globals.css:249-252**
```css
/* Global heading styles - automatically apply Crimson Pro to all headings */
h1, h2, h3, h4, h5, h6 {
  @apply font-serif;
}
```

**Problem:** This applies `font-serif` to ALL headings globally, but the site-wide convention is:
- Headings: `font-sans`
- Body copy: `font-serif`

Every page that follows the convention has to explicitly override this with `font-sans` on headings. This rule creates the opposite default.

### Fix

**Remove this rule entirely.** Headings should explicitly declare their font where needed. No global default.

---

## Issue 3: HTML Background

**globals.css:192-195**
```css
html {
  @apply bg-background;
  scroll-behavior: smooth;
}
```

### Fix

Move `bg-background` to layout.tsx html element. Keep `scroll-behavior: smooth` in CSS (no Tailwind equivalent).

```tsx
// layout.tsx
<html
  lang="en"
  className={`${dmSans.variable} ${newsreader.variable} bg-background`}
  ...
>
```

**globals.css** (keep only):
```css
html {
  scroll-behavior: smooth;
}
```

---

## What Must Stay in globals.css

These cannot be Tailwind classes and must remain in CSS:

| Rule | Reason |
|------|--------|
| `:root` / `.dark` variables | CSS custom properties for design tokens |
| `@keyframes` | Animation definitions |
| `scroll-behavior: smooth` | No Tailwind equivalent |
| Accent color transitions (lines 197-242) | Complex selectors for time-based theme |
| `* { @apply border-border }` | shadcn/ui convention |
| `*:focus-visible` styles | Global accessibility |
| `@media (prefers-reduced-motion)` | Accessibility |
| `.prose-custom` nested selectors | CSS nesting for Portable Text |
| Utility classes (`.flex-center`, `.card-base`, etc.) | Reusable component utilities |

---

## Recommended Changes

### 1. layout.tsx - Update body and html

```tsx
<html
  lang="en"
  className={`${dmSans.variable} ${newsreader.variable} bg-background`}
  suppressHydrationWarning
  style={{...}}
>
  ...
  <body className="font-sans font-light bg-background text-foreground overflow-hidden">
```

### 2. globals.css - Remove/simplify

**Remove entirely:**
```css
/* DELETE - wrong convention */
h1, h2, h3, h4, h5, h6 {
  @apply font-serif;
}

/* DELETE - moved to layout.tsx */
body {
  @apply font-sans bg-background text-foreground;
  font-weight: 300;
}
```

**Simplify:**
```css
html {
  scroll-behavior: smooth;
}
```

---

## After Changes

**layout.tsx** will be the single source of truth for:
- Font family defaults (`font-sans`)
- Font weight (`font-light`)
- Background color (`bg-background`)
- Text color (`text-foreground`)
- Overflow behavior (`overflow-hidden`)

**globals.css** will only contain:
- CSS custom properties (design tokens)
- Things that can't be Tailwind (keyframes, scroll-behavior, complex selectors)
- Reusable utility/component classes
