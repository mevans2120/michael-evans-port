# Navigation Hover-to-Expand Implementation Plan

**Date:** February 1, 2026
**Status:** Ready for Implementation
**Prototype:** `/docs/design/nav-hover-expand-concepts-020126/nav-hover-expand-concept-1a-border-glow.html`

---

## Overview

Implement hover-to-expand behavior for the desktop left navigation with a cursor-following glow effect. The nav expands on hover (100ms delay), auto-collapses on mouse leave or nav click, but stays open when the chat input is focused.

### Key Behaviors

| Trigger | Action |
|---------|--------|
| Hover on collapsed nav (100ms) | Expand to 320px with cursor-following glow |
| Mouse leave | Collapse to 81px |
| Click nav link | Collapse to 81px |
| Focus chat input | Lock nav open (prevent collapse) |
| Blur chat input | Allow collapse (if mouse not over nav) |
| Click chevron | Toggle state (override all) |

### Integration with Existing Features

- **Route-based initial state**: **REMOVED** - Nav now starts collapsed (`partial`) on ALL pages including homepage
- **Chat coupling**: Chat section only visible when expanded - this remains unchanged
- **Mobile behavior**: No changes - mobile uses hamburger menu

---

## Design System Integration

### New CSS Custom Properties

Add to `/src/app/globals.css` in the `:root` and `.dark` sections:

```css
/* Navigation hover glow */
--navigation-glow-color: 276 100% 75%;
--navigation-glow-size: 200px;
--navigation-hover-delay: 100ms;
```

### New Tailwind Config Extensions

Add to `/tailwind.config.ts`:

```typescript
// In theme.extend
transitionDelay: {
  'hover-intent': '100ms',
},
```

### Utility Classes

Add to `/src/app/globals.css` in `@layer utilities`:

```css
@layer utilities {
  /* Cursor-following glow for navigation */
  .nav-cursor-glow {
    @apply pointer-events-none absolute opacity-0 transition-opacity duration-200;
    width: var(--navigation-glow-size);
    height: var(--navigation-glow-size);
    transform: translate(-50%, -50%);
    background: radial-gradient(
      circle at center,
      hsl(var(--navigation-glow-color) / 0.6) 0%,
      hsl(var(--navigation-glow-color) / 0.4) 20%,
      hsl(var(--navigation-glow-color) / 0.2) 40%,
      hsl(var(--navigation-glow-color) / 0.05) 60%,
      transparent 80%
    );
    filter: blur(12px);
    z-index: 5;
  }

  .nav-cursor-glow.visible {
    @apply opacity-100;
  }
}
```

---

## Implementation Tasks

### Phase 1: Context Updates

**File:** `/src/contexts/NavigationContext.tsx`

1. Add `chatInputFocused` state (already exists, verify it's being used)
2. Add hover intent state management:

```typescript
// Add to NavigationContextType interface
isHoverPending: boolean;
setHoverPending: (pending: boolean) => void;

// Add state
const [isHoverPending, setHoverPending] = useState(false);
```

3. **Update `getInitialState()` to always return collapsed:**
```typescript
const getInitialState = (): PanelState => {
  // Universal collapsed state - hover to expand on all pages
  return 'partial';
};
```

4. **Remove pathname dependency** - the `usePathname()` import can be removed if no longer needed elsewhere

### Phase 2: NavigationPanel Updates

**File:** `/src/components/navigation/NavigationPanel.tsx`

1. Add cursor glow element
2. Add mouse tracking for glow position
3. Add hover-to-expand logic with 100ms delay
4. Add auto-collapse on mouse leave (respecting chat focus)
5. Add collapse on nav link click

```typescript
// Key additions
const [glowPosition, setGlowPosition] = useState({ x: 0, y: 0 });
const [isHoverPending, setIsHoverPending] = useState(false);
const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

const HOVER_DELAY = 100; // ms

// Mouse move handler for glow
const handleMouseMove = (e: React.MouseEvent) => {
  const rect = e.currentTarget.getBoundingClientRect();
  setGlowPosition({
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  });
};

// Mouse enter - start hover intent
const handleMouseEnter = () => {
  if (panelState === 'partial') {
    setIsHoverPending(true);
    hoverTimeoutRef.current = setTimeout(() => {
      setPanelState('expanded');
      setIsHoverPending(false);
    }, HOVER_DELAY);
  }
};

// Mouse leave - cancel or collapse
const handleMouseLeave = () => {
  if (hoverTimeoutRef.current) {
    clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = null;
  }
  setIsHoverPending(false);

  // Don't collapse if chat is focused
  if (!chatInputFocused && panelState === 'expanded') {
    setPanelState('partial');
  }
};

// Cleanup on unmount
useEffect(() => {
  return () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  };
}, []);
```

### Phase 3: NavigationMenu Updates

**File:** `/src/components/navigation/NavigationMenu.tsx`

1. Add click handler to nav links that collapses nav (when not chat-focused):

```typescript
const handleNavClick = () => {
  if (!chatInputFocused && panelState === 'expanded') {
    setPanelState('partial');
  }
};

// Apply to each nav item
<Link
  href={item.href}
  onClick={handleNavClick}
  // ... existing props
>
```

### Phase 4: ChatSection Updates

**File:** `/src/components/navigation/ChatSection.tsx`

1. Verify `chatInputFocused` state is being set on focus/blur
2. Add blur handler that checks if collapse should happen:

```typescript
const handleInputBlur = () => {
  setChatInputFocused(false);

  // Small delay to check if mouse is still over nav
  setTimeout(() => {
    // This will be handled by NavigationPanel's state
  }, 100);
};
```

### Phase 5: Cursor Glow Component

**New File:** `/src/components/navigation/CursorGlow.tsx`

```typescript
'use client';

import { cn } from '@/lib/utils';

interface CursorGlowProps {
  x: number;
  y: number;
  visible: boolean;
}

export function CursorGlow({ x, y, visible }: CursorGlowProps) {
  return (
    <div
      className={cn(
        'nav-cursor-glow',
        visible && 'visible'
      )}
      style={{
        left: x,
        top: y,
      }}
      aria-hidden="true"
    />
  );
}
```

---

## File Changes Summary

| File | Changes |
|------|---------|
| `/src/app/globals.css` | Add glow CSS variables and utility class |
| `/tailwind.config.ts` | Add `hover-intent` delay token |
| `/src/contexts/NavigationContext.tsx` | Verify chat focus state |
| `/src/components/navigation/NavigationPanel.tsx` | Add hover logic, glow tracking, collapse behavior |
| `/src/components/navigation/NavigationMenu.tsx` | Add click-to-collapse on nav links |
| `/src/components/navigation/ChatSection.tsx` | Verify focus/blur handlers |
| `/src/components/navigation/CursorGlow.tsx` | New component for glow effect |
| `/src/components/navigation/index.ts` | Export CursorGlow |

---

## Behavior Matrix

| Current State | Action | Chat Focused? | Result |
|---------------|--------|---------------|--------|
| Collapsed | Hover 100ms | N/A | Expand |
| Collapsed | Hover <100ms then leave | N/A | Stay collapsed |
| Expanded | Mouse leave | No | Collapse |
| Expanded | Mouse leave | Yes | Stay expanded |
| Expanded | Click nav link | No | Collapse |
| Expanded | Click nav link | Yes | Stay expanded |
| Expanded | Blur chat input | Mouse over nav | Stay expanded |
| Expanded | Blur chat input | Mouse not over nav | Collapse |
| Any | Click chevron | Any | Toggle |

---

## Universal Collapsed State (New Behavior)

**Remove the route-based logic entirely:**

```typescript
// In NavigationContext.tsx - BEFORE
const getInitialState = (): PanelState => {
  return pathname === '/' ? 'expanded' : 'partial';
};

// AFTER - Universal collapsed state
const getInitialState = (): PanelState => {
  return 'partial';
};
```

**New behavior:**
- **All pages**: Start collapsed (81px) - hover to expand
- **Homepage**: No longer special - same behavior as internal pages
- **Content focus**: Users land with maximum content visibility, nav expands on demand

**Benefits:**
- Consistent experience across all pages
- Content-first approach - portfolio work takes center stage
- Chat becomes a discovery feature (hover to reveal)
- Simpler mental model for users

---

## Accessibility Considerations

1. **Keyboard navigation**: Chevron toggle remains for keyboard users
2. **Reduced motion**: Respect `prefers-reduced-motion` - disable glow animation, keep instant expand/collapse
3. **Focus management**: Chat input focus lock prevents disorienting collapse
4. **Screen readers**: Glow is `aria-hidden="true"`

```css
@media (prefers-reduced-motion: reduce) {
  .nav-cursor-glow {
    display: none;
  }

  .nav-panel {
    transition: none;
  }
}
```

---

## Testing Checklist

### Unit Tests
- [ ] Hover intent timer starts on mouse enter
- [ ] Hover intent cancels on mouse leave before 100ms
- [ ] Collapse prevented when chat focused
- [ ] Collapse triggers on nav link click
- [ ] Chevron toggle overrides all states

### Integration Tests
- [ ] Universal collapsed initial state (collapsed on ALL pages including homepage)
- [ ] Glow follows cursor position
- [ ] Chat focus lock works across mouse leave
- [ ] Blur + mouse check works correctly

### E2E Tests
- [ ] Full hover-expand-collapse flow
- [ ] Navigate via nav link, verify collapse
- [ ] Type in chat, mouse away, verify stays open
- [ ] Reduced motion preference respected

---

## Rollout Plan

1. **Phase 1**: Implement in feature branch
2. **Phase 2**: Internal testing / QA
3. **Phase 3**: Deploy to staging
4. **Phase 4**: Verify on production

---

## Open Questions

1. ~~**Homepage behavior**: Should homepage also start collapsed for consistency?~~ **RESOLVED: Yes, universal collapsed state**
2. **Glow in light mode**: Should glow be visible in light mode or only dark? (Prototype is dark-only)
3. **Touch devices**: Hover doesn't exist - current click-to-toggle remains? (Yes, no changes for touch)

---

## Related Documentation

- `/docs/exploration/navigation-collapsed-default-exploration.md` - Initial exploration
- `/docs/design/nav-hover-expand-concepts-020126/` - All concept prototypes
- `/docs/navigation-default-state-feature-research.md` - Route-based state research (legacy - being replaced)

---

## Summary of Breaking Changes

| Aspect | Before | After |
|--------|--------|-------|
| Homepage initial state | Expanded (320px) | Collapsed (81px) |
| Internal pages initial state | Collapsed (81px) | Collapsed (81px) |
| Expand trigger | Click chevron only | Hover (100ms) + click chevron |
| Collapse trigger | Click chevron only | Mouse leave, nav click, or chevron |
| Chat visibility on load | Visible on homepage | Hidden until hover on all pages |
