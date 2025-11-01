# Color Reference Guide

## Centralized "One Place" Color System

All site colors are defined using **CORE COLOR TOKENS** in `/src/app/globals.css`. Change these core tokens to update colors across the entire site.

## 🎨 Core Color Tokens (Single Source of Truth)

### Light Mode
```css
:root {
  /* Change THESE to update entire site */
  --color-text: 0 0% 3.1%;           /* Vampire black #080808 - ALL text */
  --color-bg: 0 0% 98%;              /* Off-white #FAFAFA - ALL backgrounds */
  --color-border: 280 15% 85%;       /* Light gray - ALL borders/strokes */
  --color-accent: 276 70% 45%;       /* Darker purple for light mode */
}
```

### Dark Mode
```css
.dark {
  /* Change THESE to update entire site */
  --color-text: 0 0% 98%;            /* White text - ALL text */
  --color-bg: 240 10% 3%;            /* Very dark - ALL backgrounds */
  --color-border: 240 5% 20%;        /* Dark gray - ALL borders/strokes */
  --color-accent: 276 100% 75%;      /* Bright purple for dark mode */
}
```

## How It Works

1. **Core tokens** (`--color-*`) are the ONLY place you need to change colors
2. **Semantic tokens** (`--foreground`, `--border`, etc.) reference core tokens using `var(--color-*)`
3. **All components** use semantic tokens, which automatically get updated when core tokens change

```
Core Tokens (--color-*)
    ↓
Semantic Tokens (--foreground, --border, etc.) via var(--color-*)
    ↓
Tailwind Classes (text-foreground, border-border, etc.)
    ↓
Components (automatically themed)
```

## Quick Updates

### Change ALL Text Color
```css
:root {
  --color-text: 0 0% 10%;  /* Darker text */
}
```
→ Updates: body text, headings, navigation links, card text, sidebar text, ALL text everywhere (except inverted chat)

### Change ALL Background Color
```css
:root {
  --color-bg: 0 0% 100%;  /* Pure white */
}
```
→ Updates: page background, all component backgrounds (except navigation and inverted chat)

### Change ALL Borders/Strokes
```css
:root {
  --color-border: 240 10% 80%;  /* Darker borders */
}
```
→ Updates: all borders, all strokes, input borders, card borders, ALL borders everywhere (except inverted chat)

### Change Purple Accent
```css
:root {
  --color-accent: 280 70% 50%;  /* Different purple */
}
```
→ Updates: links, buttons, focus rings, ALL purple accents everywhere

## Special Cases (Manually Defined)

### Navigation Background
**Why**: Needs to contrast with page background

```css
:root {
  --navigation-background: 0 0% 96%;   /* Light mode: light gray */
}
.dark {
  --navigation-background: 240 6% 10%; /* Dark mode: dark gray */
}
```

### AI Assistant Chat - INVERTED COLORS
**Why**: Always opposite of main theme

```css
:root {
  /* Light mode has DARK chat */
  --chat-background: 240 6% 10%;        /* Dark gray */
  --chat-foreground: 0 0% 98%;          /* White text */
  --chat-border: 240 5% 20%;            /* Dark borders */
}

.dark {
  /* Dark mode has LIGHT chat */
  --chat-background: 0 0% 95%;          /* Light gray */
  --chat-foreground: 0 0% 3.1%;         /* Dark text */
  --chat-border: 280 15% 85%;           /* Light borders */
}
```

## Complete Token Reference

### Tokens That Reference Core Colors
These automatically update when you change core tokens:

**Text:**
- `--foreground` → `var(--color-text)`
- `--card-foreground` → `var(--color-text)`
- `--navigation-foreground` → `var(--color-text)`
- `--popover-foreground` → `var(--color-text)`
- `--secondary-foreground` → `var(--color-text)`
- `--muted-foreground` → `var(--color-text)`
- `--sidebar-foreground` → `var(--color-text)`

**Backgrounds:**
- `--background` → `var(--color-bg)`

**Borders:**
- `--border` → `var(--color-border)`
- `--input` → `var(--color-border)`
- `--navigation-border` → `var(--color-border)`
- `--sidebar-border` → `var(--color-border)`

**Accent:**
- `--accent` → `var(--color-accent)`
- `--primary` → `var(--color-accent)`
- `--ring` → `var(--color-accent)`
- `--sidebar-primary` → `var(--color-accent)`
- `--sidebar-ring` → `var(--color-accent)`

## Examples

### Example 1: Make Text True Black
```css
:root {
  --color-text: 0 0% 0%;  /* Pure black */
}
```
→ All text across the site becomes pure black (except inverted chat)

### Example 2: Make Borders Blue
```css
:root {
  --color-border: 220 70% 70%;  /* Blue borders */
}
.dark {
  --color-border: 220 70% 40%;  /* Darker blue for dark mode */
}
```
→ All borders across the site become blue (except inverted chat)

### Example 3: Change Purple to Green
```css
:root {
  --color-accent: 150 70% 45%;  /* Green accent */
}
.dark {
  --color-accent: 150 100% 60%;  /* Brighter green for dark mode */
}
```
→ All purple elements become green everywhere

## Color Format: HSL

All colors use HSL format without `hsl()` wrapper:

```css
--color-text: 0 0% 3.1%;
/* Breaks down to: */
/* Hue: 0 (no hue) */
/* Saturation: 0% (grayscale) */
/* Lightness: 3.1% (very dark, almost black) */
```

### Why HSL?
- Easy to adjust lightness (make colors lighter/darker)
- Easy to adjust saturation (make colors more/less vibrant)
- Better for creating color variants than RGB or HEX

## Testing Color Changes

1. Open `http://localhost:3000` in your browser
2. Click the moon icon (top right) to toggle between light/dark modes
3. Verify both modes look correct
4. Test hover states by hovering over links and buttons
5. Use browser DevTools to toggle `.dark` class on `<html>` element

## Summary

**To change colors site-wide:**
1. Open `/src/app/globals.css`
2. Find the `/* 🎨 CORE COLOR SOURCES */` section
3. Update the 4 core tokens: `--color-text`, `--color-bg`, `--color-border`, `--color-accent`
4. Save - colors update everywhere automatically!

**Special cases (optional):**
- `--navigation-background` - Navigation panel background (needs contrast with page)
- `--chat-*` tokens - AI Assistant chat (always inverted)
- `--muted-foreground` - Secondary text in dark mode (kept at 70% for readability)

**Result**: True single-source color management with minimal exceptions!
