# Navigation: Collapsed-by-Default Exploration

**Date:** February 1, 2026
**Author:** Claude (AI Analysis)
**Status:** Exploration / Recommendations

---

## Executive Summary

This document explores changing the desktop left navigation from **expanded-by-default** to **collapsed-by-default** state. The current implementation expands the nav on the homepage and collapses it on other pages. A collapsed-by-default approach would give more screen real estate to content while still providing clear navigation affordances.

---

## Current Implementation Analysis

### State Management

The navigation state is managed in `src/contexts/NavigationContext.tsx`:

```typescript
// Current logic (line 33-35)
const getInitialState = (): PanelState => {
  return pathname === '/' ? 'expanded' : 'partial';
};
```

**Three panel states exist:**
| State | Width | Displays |
|-------|-------|----------|
| `collapsed` | 0px | Nothing (fully hidden) |
| `partial` | 81px | Icons only |
| `expanded` | 320px (455px with chat) | Full nav + labels + chat |

### Key Files

| File | Purpose |
|------|---------|
| `src/contexts/NavigationContext.tsx` | State management, initial state logic |
| `src/components/navigation/NavigationPanel.tsx` | Panel container, width transitions |
| `src/components/navigation/NavigationMenu.tsx` | Menu items, icon/label display |

### Current Behavior

1. **Homepage (`/`)**: Starts expanded (320px) - shows full logo, nav labels, and chat
2. **All other routes**: Starts collapsed/partial (81px) - shows icons only
3. **User interaction**: Clicking the purple border or chevron toggles state
4. **No persistence**: State resets to route-default on navigation

---

## Observations

### 1. Content Space vs. Navigation Prominence

**Current expanded state takes 320px** - roughly 20% of a 1440px viewport. On the homepage, this is intentional to showcase the chat feature and establish brand presence. However:

- The expanded nav competes with hero content for attention
- First-time visitors may focus on the nav rather than the main content
- The chat feature, while prominent, requires explanation

**Collapsed state (81px)** - roughly 5% of viewport:
- Icons are recognizable (Home, User, Briefcase, Pen)
- Purple accent border provides clear interaction affordance
- Hover reveals chevron toggle - discoverability is good

### 2. Chat Feature Coupling

The chat section is **tightly coupled** to the expanded state:

```typescript
// NavigationPanel.tsx lines 26-31
useEffect(() => {
  if (panelState === 'partial') {
    setChatExpanded(false);
    setChatInputFocused(false);
  }
}, [panelState, setChatExpanded, setChatInputFocused]);
```

**Implication:** Collapsed-by-default means the AI chat is hidden by default. This is significant since the chat is a portfolio differentiator.

### 3. Logo Display Modes

The logo adapts to state:
- **Expanded**: "M Evans" (full brand)
- **Collapsed**: "ME" (abbreviated)

Both are readable and branded, so collapsed state doesn't lose identity.

### 4. Interaction Affordances

The toggle system is well-designed:
- Purple accent border (2px) visible in both states
- Chevron button appears on hover OR when collapsed
- Clickable area extends 85px from border for easy targeting
- Accessible with keyboard (focus-visible ring)

### 5. No User Preference Persistence

Currently, state doesn't persist to localStorage. The CLAUDE.md mentions this as a planned feature:

> "User's manual toggle preference saved to localStorage and takes precedence"

This is relevant: if you go collapsed-by-default, returning users who prefer expanded would need persistence to avoid frustration.

---

## Insights

### Why Collapsed-by-Default Could Work

1. **Content-first approach**: Visitors come to see your work, not navigate. Let the case studies and portfolio pieces take center stage.

2. **Progressive disclosure**: The collapsed nav is not hidden - it's a persistent icon strip that's always available. Users who want more can expand.

3. **Modern pattern**: Many portfolio sites (Dribbble profiles, Behance) use minimal side navigation. Users expect icon-based nav.

4. **Mobile parity**: Your mobile nav is hidden behind a hamburger. Collapsed desktop nav creates more consistency in mental model.

5. **Chat as discovery**: Instead of chat being visible immediately, it becomes a discovery moment when users expand. This can create delight.

### Why Expanded-by-Default Has Merit

1. **Chat is a differentiator**: The AI assistant is unique to your portfolio. Hiding it by default loses immediate impact.

2. **First impression**: New visitors see the full navigation context, understand site structure immediately.

3. **Brand presence**: "M Evans" full logo establishes identity better than "ME".

4. **Reduced friction**: One less interaction to access full navigation.

### The Core Tension

**Collapsed-by-default** prioritizes: content focus, screen real estate, modern minimalism

**Expanded-by-default** prioritizes: feature discovery (chat), navigation clarity, brand presence

---

## Recommendations

### Option A: Collapsed-by-Default with Smart Expansion (Recommended)

Make collapsed the default, but add intelligent expansion triggers:

```typescript
const getInitialState = (): PanelState => {
  // Always start collapsed
  return 'partial';
};
```

**Enhancements:**
1. **Persist user preference**: If user manually expands, remember it
2. **Expand on hover with delay**: After 800ms hover on collapsed nav, expand
3. **First-visit tooltip**: Show a one-time tooltip: "Expand for AI assistant"

**Implementation complexity:** Medium
**Risk:** Users may never discover chat

### Option B: Collapsed-by-Default, Everywhere

Simple change - collapsed on all routes:

```typescript
const getInitialState = (): PanelState => 'partial';
```

**Pros:** Consistent, simple, content-focused
**Cons:** Chat discovery suffers, brand presence reduced

**Implementation complexity:** Low (single line change)
**Risk:** Chat becomes invisible to many users

### Option C: Homepage Expanded, Others Collapsed (Current)

Keep current behavior. It's already route-aware and makes the homepage a "full experience" while other pages prioritize content.

**Pros:** Already implemented, homepage gets special treatment
**Cons:** Inconsistent behavior between pages

**Implementation complexity:** None (already done)
**Risk:** None (current state)

### Option D: Collapsed-by-Default with Chat CTA

Collapsed by default, but add a floating CTA or pulse animation on the chat icon when collapsed:

```typescript
// Add visual indicator that chat exists
{panelState === 'partial' && (
  <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
    <span className="animate-pulse text-accent text-xs">AI</span>
  </div>
)}
```

**Pros:** Best of both worlds - content focus + chat discovery
**Cons:** Additional visual element, animation could be annoying

**Implementation complexity:** Medium
**Risk:** Over-engineering a simple interaction

### Option E: A/B Test or User Setting

Add a user-facing toggle in settings or footer:
- "Compact navigation" toggle
- Persists to localStorage
- Default can be either state

**Pros:** User choice, data-driven decision
**Cons:** More UI complexity, decision fatigue

**Implementation complexity:** High
**Risk:** Over-complicating the experience

---

## Implementation Path (If Pursuing Option A)

### Phase 1: Simple Default Change
1. Change `getInitialState()` to return `'partial'`
2. Test all pages load correctly
3. Verify chat behavior when nav expanded manually

### Phase 2: Preference Persistence
1. Implement `@/lib/navigation-storage.ts` utilities
2. Save toggle state to localStorage
3. Load preference on mount (after hydration)

### Phase 3: Discovery Enhancement
1. Add first-visit indicator for chat
2. Track if user has ever expanded nav
3. Show subtle prompt if not

### Files to Modify

| File | Change |
|------|--------|
| `src/contexts/NavigationContext.tsx` | `getInitialState()` logic |
| `src/lib/navigation-storage.ts` | New file for localStorage utils |
| `src/components/navigation/NavigationPanel.tsx` | Optional: hover-expand logic |
| `src/components/navigation/NavigationMenu.tsx` | Optional: chat indicator |

---

## UX Considerations

### Accessibility
- Collapsed state maintains full keyboard navigation
- Icons have proper labels in NavigationMenu
- Toggle button has `aria-label`
- Focus indicators work in both states

### Screen Sizes
- Navigation only shows on desktop (1024px+)
- Mobile has separate hamburger menu
- No changes needed for mobile

### Animation
- Width transitions already smooth (300ms)
- `hasInteracted` flag prevents initial animation jank
- Reducing default width won't affect transition quality

---

## Questions to Consider

1. **How important is the AI chat to first impressions?** If critical, keep expanded-by-default on homepage at minimum.

2. **What do analytics show?** Do users interact with the chat? If low engagement, collapsed-by-default loses little.

3. **What's the typical user journey?** If most users land on case studies (not homepage), collapsed-by-default affects more visitors.

4. **Is persistence a must-have?** Without it, users who prefer expanded will be frustrated every page load.

---

## Next Steps

1. **Decide on approach** based on priorities (content focus vs. chat discovery)
2. **Prototype the change** - literally one line to test the feel
3. **Implement persistence** if going collapsed-by-default
4. **Add discovery mechanism** for chat if needed
5. **Test with real users** or gather feedback

---

## Appendix: Quick Test

To quickly test collapsed-by-default, change line 34 in `NavigationContext.tsx`:

```typescript
// FROM
return pathname === '/' ? 'expanded' : 'partial';

// TO
return 'partial';
```

This single change will show collapsed nav on all pages, letting you feel the difference immediately.
