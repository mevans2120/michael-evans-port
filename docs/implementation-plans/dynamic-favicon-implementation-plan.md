# Dynamic Favicon Implementation Plan

## Overview
Create a dynamic favicon system that displays the "ME" logo with:
- **Time-based theming**: Orange (coral) during day, purple at night
- **Mode detection**: White text on dark background (dark mode), black text on light background (light mode)
- **Design system compliance**: Leverages existing TimeThemeProvider and semantic color tokens
- **Clean, maintainable code**: Reusable components and proper separation of concerns

## Current State Analysis

**Existing Assets:**
- `/dist/Favicon_Light.png` - Dark text "ME" on light background
- `/dist/Favicon_Dark.png` - Light text "ME" on dark background
- Current favicon: `/src/app/favicon.ico` (static)

**Existing Infrastructure:**
- `TimeThemeProvider` - Already handles day/evening theme switching
- `ThemeProvider` - Already handles light/dark mode with system detection
- Color tokens: `--accent` (coral/purple based on time), semantic tokens in `globals.css`
- Navigation logo at `NavigationMenu.tsx:42-50` uses `.text-gradient` class

**Design System Colors:**
```tsx
// Day (Coral): hsl(20, 90%, 55%) #F46A25
// Evening (Purple): hsl(270, 80%, 60%)
// Light mode text: hsl(0, 0%, 3.1%) - near black
// Dark mode text: hsl(0, 0%, 98%) - near white
```

## Implementation Strategy

### Phase 1: SVG Favicon Generation Component
**Why SVG?** Allows dynamic color changes via CSS variables without generating multiple files.

**Create:** `/src/components/FaviconGenerator.tsx`
- Client component that listens to theme changes
- Generates SVG favicon with current accent color + mode
- Updates `<link rel="icon">` dynamically
- Uses canvas to convert SVG → PNG for better browser support

**Technical approach:**
```tsx
'use client';
import { useEffect } from 'react';
import { useTimeBasedTheme } from '@/hooks/useTimeBasedTheme';
import { useTheme } from 'next-themes';

// Generates favicon based on accent color and mode
// Uses DM Sans font (matches navigation logo)
// Returns data URL for dynamic favicon
```

### Phase 2: Favicon Update Hook
**Create:** `/src/hooks/useDynamicFavicon.ts`
- Encapsulates favicon update logic
- Listens to both time theme and color mode changes
- Updates favicon link element in `<head>`
- Handles fallback for browsers that don't support dynamic favicons

**Features:**
- Debounced updates (avoid flickering during transitions)
- Cleanup on unmount
- SSR-safe (only runs client-side)

### Phase 3: Integration with Root Layout
**Update:** `/src/app/layout.tsx`
- Add `<FaviconGenerator />` component to layout
- Remove static `favicon.ico` reference (Next.js auto-detects)
- Add proper metadata for PWA icons

**Changes needed:**
```tsx
// In RootLayout:
<TimeThemeProvider>
  <FaviconGenerator />
  {children}
</TimeThemeProvider>
```

### Phase 4: Fallback Static Favicons
**Create:** Multiple static fallback favicons for browsers/scenarios where dynamic updates don't work

**Files to generate:**
- `/public/favicon-coral-dark.svg` - Coral accent, white text
- `/public/favicon-coral-light.svg` - Coral accent, black text
- `/public/favicon-purple-dark.svg` - Purple accent, white text
- `/public/favicon-purple-light.svg` - Purple accent, black text
- `/public/favicon.ico` - Default fallback (purple, white text)

**Metadata updates:**
```tsx
export const metadata: Metadata = {
  icons: {
    icon: [
      { url: '/favicon-purple-dark.svg', media: '(prefers-color-scheme: dark)' },
      { url: '/favicon-purple-light.svg', media: '(prefers-color-scheme: light)' },
    ],
  },
}
```

## File Structure
```
/src
  /components
    FaviconGenerator.tsx          # Main dynamic favicon component
  /hooks
    useDynamicFavicon.ts          # Favicon update logic hook
  /app
    layout.tsx                     # Integration point
/public
  favicon-coral-dark.svg          # Static fallback
  favicon-coral-light.svg         # Static fallback
  favicon-purple-dark.svg         # Static fallback
  favicon-purple-light.svg        # Static fallback
  favicon.ico                      # Universal fallback
/dist
  Favicon_Light.png               # Reference (can be deleted after)
  Favicon_Dark.png                # Reference (can be deleted after)
```

## Design System Compliance

**Colors:**
- Uses `--accent` CSS variable (automatically updates via TimeThemeProvider)
- Uses `--foreground` for text color (automatically handles light/dark mode)
- No hardcoded colors - all semantic tokens

**Typography:**
- DM Sans font (matches navigation logo)
- Font weights: 500 for "M", 700 for "E" (matches collapsed nav logo)

**Transitions:**
- 300ms smooth transitions (matches `transition-smooth` utility)
- Respects `prefers-reduced-motion`

## Technical Considerations

**Browser Support:**
1. **Modern browsers** (Chrome, Firefox, Safari): Dynamic SVG favicons work perfectly
2. **Older browsers**: Fall back to static `favicon.ico`
3. **PWA/Mobile**: Provide apple-touch-icon and manifest icons

**Performance:**
- SVG generation happens client-side (no server load)
- Debounced updates prevent excessive re-renders
- Canvas conversion cached per color combination

**Accessibility:**
- High contrast maintained (WCAG AAA compliance)
- White text on dark backgrounds, black text on light backgrounds
- No reliance on color alone (shape is consistent)

## Testing Checklist

- [ ] Favicon updates when switching light/dark mode manually
- [ ] Favicon updates when system preference changes
- [ ] Favicon updates at sunrise/sunset (time-based theme)
- [ ] Fallback works when JavaScript disabled
- [ ] Proper icon in browser tabs (all browsers)
- [ ] Proper icon in bookmarks
- [ ] Proper icon when added to mobile home screen
- [ ] No console errors during theme transitions
- [ ] Smooth transitions (no flickering)

## Benefits

1. **Design System Integration**: Uses existing theme infrastructure, no duplicate logic
2. **Maintainability**: Single source of truth for colors (CSS variables)
3. **Performance**: Lightweight SVG, minimal JavaScript
4. **User Experience**: Favicon matches site appearance in real-time
5. **Accessibility**: High contrast maintained in all combinations
6. **Progressive Enhancement**: Works without JavaScript via static fallbacks

## Implementation Progress

### Phase 1: SVG Favicon Generation Component ✅
- [x] Create `useDynamicFavicon` hook
- [x] Build `FaviconGenerator` component
- [x] Integrate into root layout

### Phase 2: Static Fallback Favicons
- [ ] Generate SVG fallback files
- [ ] Update metadata configuration
- [ ] Test fallback scenarios

### Phase 3: Testing & Validation
- [ ] Cross-browser testing
- [ ] Theme transition testing
- [ ] Performance validation
