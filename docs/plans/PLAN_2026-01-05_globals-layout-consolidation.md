# Plan: Globals & Layout Consolidation

**Date:** January 5, 2026
**Status:** Ready for implementation

---

## Goal

Remove redundancies between globals.css and layout.tsx. Move element styles to layout.tsx where possible. Fix the incorrect heading font rule.

---

## Changes

### 1. Update layout.tsx

**File:** `src/app/layout.tsx`

**Change html element (line 110-121):**
```tsx
// Before
<html
  lang="en"
  className={`${dmSans.variable} ${newsreader.variable}`}
  ...
>

// After
<html
  lang="en"
  className={`${dmSans.variable} ${newsreader.variable} bg-background`}
  ...
>
```

**Change body element (line 135):**
```tsx
// Before
<body className="font-sans overflow-hidden">

// After
<body className="font-sans font-light bg-background text-foreground overflow-hidden">
```

---

### 2. Update globals.css

**File:** `src/app/globals.css`

**Remove html bg-background (lines 192-195):**
```css
// Before
html {
  @apply bg-background;
  scroll-behavior: smooth;
}

// After
html {
  scroll-behavior: smooth;
}
```

**Remove body rule entirely (lines 244-247):**
```css
// DELETE
body {
  @apply font-sans bg-background text-foreground;
  font-weight: 300;
}
```

**Remove heading rule entirely (lines 249-252):**
```css
// DELETE
/* Global heading styles - automatically apply Crimson Pro to all headings */
h1, h2, h3, h4, h5, h6 {
  @apply font-serif;
}
```

---

## Verification

After changes, run:

```bash
npm run build
```

Then visually verify:
- Homepage typography (headings sans, body serif)
- Dark mode still works
- Background colors correct in both themes

---

## Summary

| File | Action |
|------|--------|
| layout.tsx | Add `bg-background` to html, add `font-light bg-background text-foreground` to body |
| globals.css | Remove `bg-background` from html, delete body rule, delete h1-h6 rule |
