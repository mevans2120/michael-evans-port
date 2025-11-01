# Light Mode: Hardcoded Colors Audit

**Date:** October 31, 2025

## Files to EXCLUDE (Intentionally Themed)
These are design concept showcase components that should remain dark-themed:

- `src/components/design-concepts/TerminalDark.tsx` - Intentional green terminal theme
- `src/components/design-concepts/MinimalProfessional.tsx` - Intentional dark professional theme
- `src/components/design-concepts/WarmDepth.tsx` - Intentional warm theme
- `src/components/ai-showcase/ContentSlide.tsx` - Uses `bg-[#050510]` for specific effect

## Files to FIX (Need Dark Mode Preservation)

### Navigation Components (HIGH PRIORITY)

#### `src/components/navigation/NavigationMenu.tsx`
- Line 71: `text-neutral-400 hover:text-white hover:bg-neutral-800`
- **Fix:** Add light mode equivalents, preserve dark mode with `dark:` prefix
- **Strategy:** Use semantic tokens or add explicit light/dark variants

#### `src/components/navigation/SuggestedPrompts.tsx`
- Line 36-37: `bg-neutral-800 hover:bg-neutral-750`
- **Fix:** Add `dark:` prefixes and light mode equivalents

#### `src/components/navigation/ChatSection.tsx` (MANY INSTANCES)
- Line 106: `border-neutral-800 bg-neutral-900`
- Line 122: `hover:bg-neutral-800/50`
- Line 159: `text-neutral-400 hover:text-white hover:bg-neutral-800`
- Line 169: `bg-neutral-900`
- Line 193: `bg-purple-600` (user) vs `bg-neutral-800` (assistant)
- Line 203: `bg-neutral-800`
- Line 217: `bg-neutral-800 text-white`
- Line 254: `bg-neutral-800/50 hover:bg-neutral-800 border-neutral-700`
- Line 315: `bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500`

**Fix Strategy:** This entire component needs comprehensive theming

## Theming Strategy

### Pattern to Follow:
```tsx
// BAD (loses dark mode):
className="bg-neutral-900 text-white"

// GOOD (preserves both):
className="bg-muted text-foreground dark:bg-neutral-900 dark:text-white"

// OR use semantic tokens:
className="bg-card text-card-foreground"
```

### Semantic Tokens Available:
- `bg-background` / `text-foreground` - Main page colors
- `bg-card` / `text-card-foreground` - Card/panel colors (navigation)
- `bg-muted` / `text-muted-foreground` - Secondary/muted elements
- `bg-accent` / `text-accent-foreground` - Purple accents
- `border-border` - Border colors

### Neutral Color Mappings:

**Dark Mode → Light Mode:**
- `bg-neutral-900` → `bg-card` (light gray) | `dark:bg-neutral-900`
- `bg-neutral-800` → `bg-muted` (lighter gray) | `dark:bg-neutral-800`
- `text-neutral-400` → `text-muted-foreground` | `dark:text-neutral-400`
- `text-white` → `text-foreground` | `dark:text-white`
- `border-neutral-800` → `border-border` | `dark:border-neutral-800`
- `border-neutral-700` → `border-border` | `dark:border-neutral-700`

## Implementation Checklist

### Phase 2: Navigation Components
- [ ] NavigationMenu.tsx - Links and hover states
- [ ] SuggestedPrompts.tsx - Prompt chips
- [ ] ChatSection.tsx - Entire component (25+ color instances)
  - [ ] Container backgrounds
  - [ ] Message bubbles (user vs assistant)
  - [ ] Input field
  - [ ] Buttons and controls
  - [ ] Follow-up suggestions
  - [ ] Borders and dividers

### Testing Requirements
- [ ] Verify dark mode looks identical to before
- [ ] Verify light mode is readable and accessible
- [ ] Test hover states in both modes
- [ ] Test focus states in both modes
- [ ] Test chat messages in both modes
- [ ] Test navigation states in both modes

## Notes
- Always test dark mode after changes to ensure nothing breaks
- Use browser DevTools to toggle `dark` class on `<html>` for testing
- Prioritize semantic tokens over hardcoded colors when possible
- Keep intentional design concept components unchanged
