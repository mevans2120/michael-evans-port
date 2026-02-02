# Navigation Hover-to-Expand Concepts

**Date:** February 1, 2026
**Feature:** Desktop left navigation hover-to-expand behavior
**Status:** Concept exploration

---

## Design Challenge

Transform the desktop navigation from a click-to-toggle system to a hover-responsive system that:
- Expands the collapsed nav on hover
- Handles timing to prevent accidental triggers
- Manages collapse behavior appropriately
- Maintains access to the AI chat feature
- Feels smooth and intentional, not jumpy

---

## Research Insights Informing These Concepts

1. **Chat is tightly coupled to expanded state** - The AI chat only appears when nav is fully expanded (320px)
2. **Current toggle affordance works well** - Purple border + chevron provides clear interaction
3. **No persistence currently** - State resets on navigation, so hover behavior won't conflict with saved preferences
4. **Icons are recognizable** - Users can navigate via collapsed icons without needing labels

---

## Concept Comparison

| Aspect | Concept 1: Delayed Intent | Concept 2: Edge Trigger | Concept 3: Peek Preview |
|--------|--------------------------|------------------------|------------------------|
| **Trigger** | Hover anywhere (600ms delay) | Hover edge zone only (instant) | Hover anywhere (100ms delay) |
| **Visual feedback** | Progress bar fills during delay | Glow effect on edge | "Preview" badge + intermediate width |
| **Collapse behavior** | Manual close required | Auto-collapse on leave | Peek auto-collapses; full expansion persists |
| **Chat access** | Shown immediately on expand | Shown immediately on expand | Requires explicit click from peek state |
| **States** | 2 (collapsed, expanded) | 2 (collapsed, expanded) | 3 (collapsed, peeking, expanded) |
| **Best for** | Users who want explicit feedback | Users who want quick icon clicks | Users who want progressive disclosure |

---

## Concept 1: Delayed Intent

**File:** `nav-hover-expand-concept-1-delayed-intent.html`

### Approach
Hover anywhere on the collapsed nav starts a 600ms timer. A visual progress indicator (purple bar filling from bottom to top) shows the user that expansion is pending. Moving the mouse away cancels the expansion.

### Strengths
- **Clear feedback**: Users always know what's happening
- **Forgiving**: Easy to cancel accidental triggers
- **Learnable**: Users quickly understand the timing
- **Simple mental model**: Hover = expand (with delay)

### Tradeoffs
- **Slower**: 600ms feels long for power users
- **Visual noise**: Progress indicator adds motion
- **Commitment required**: Must wait for full expansion to see chat

### Implementation Notes
```typescript
// Key timing constant
const HOVER_DELAY = 600; // ms

// Cancel on mouse leave
navPanel.addEventListener('mouseleave', () => {
  clearTimeout(hoverTimeout);
  navPanel.classList.remove('hover-pending');
});
```

---

## Concept 2: Edge Trigger Zone

**File:** `nav-hover-expand-concept-2-edge-trigger.html`

### Approach
Only hovering a specific zone (40px wide, along the right edge near the purple border) triggers expansion. Hovering the main nav body (icons) does NOT expand - safe for quick icon clicks.

### Strengths
- **Precise control**: Separates "quick navigation" from "exploration"
- **No accidental triggers**: Mouse passing over nav doesn't expand
- **Instant response**: No delay once trigger zone is entered
- **Familiar pattern**: Similar to macOS dock edge activation

### Tradeoffs
- **Hidden affordance**: Users must discover the trigger zone
- **Learning curve**: Not immediately obvious how to expand
- **Auto-collapse**: Nav closes when leaving, which may frustrate users wanting to keep it open

### Implementation Notes
```typescript
// Trigger zone extends beyond visible border
.edge-trigger {
  position: absolute;
  right: -20px;
  width: 40px;
}

// Visual indicator helps discoverability
.nav-panel.edge-hovered .edge-glow {
  background: linear-gradient(90deg, transparent, hsl(276 100% 75% / 0.3));
}
```

---

## Concept 3: Peek Preview

**File:** `nav-hover-expand-concept-3-peek-preview.html`

### Approach
Introduces a three-state system: collapsed (81px) → peeking (180px) → expanded (320px). Hovering shows navigation labels in a preview state, but the AI chat requires explicit action (click "Expand for Chat" or the chevron).

### Strengths
- **Progressive disclosure**: Shows only what's needed at each level
- **Chat is intentional**: Users choose to access chat, not stumble into it
- **Best of both worlds**: Quick label preview without full expansion
- **Reduces visual shift**: Peek state is smaller, less disruptive to content

### Tradeoffs
- **More complexity**: Three states to understand
- **Chat hidden further**: Extra step to reach chat
- **State ambiguity**: "Peeking" vs "expanded" may confuse some users

### Implementation Notes
```typescript
// Three distinct width states
.nav-panel.collapsed { width: 81px; }
.nav-panel.peeking { width: 180px; }
.nav-panel.expanded { width: 320px; }

// Peek auto-collapses, expanded persists
navPanel.addEventListener('mouseleave', () => {
  if (currentState === 'peeking') {
    setState('collapsed');
  }
  // expanded state persists until explicit close
});
```

---

## Recommendation

**For this portfolio site, Concept 3 (Peek Preview) is recommended** for the following reasons:

1. **Chat as deliberate feature**: The AI chat is a differentiator, but shouldn't be forced on users. Peek state lets users see nav labels without committing to the full chat experience.

2. **Content focus**: The 180px peek state takes less space than full 320px expansion, keeping more attention on portfolio content.

3. **Progressive disclosure**: Matches how users explore - hover for quick info, click for deep engagement.

4. **Reduced cognitive load**: Users can quickly preview nav structure without triggering a major UI shift.

### Alternative Recommendation

If the AI chat is considered critical to first impressions, **Concept 1 (Delayed Intent)** is the safer choice - it guarantees chat visibility while still providing accidental-trigger protection via the delay.

---

## Implementation Path

### Phase 1: Add hover state to NavigationContext
```typescript
// New state values
export type PanelState = 'collapsed' | 'partial' | 'peeking' | 'expanded';

// Or simplified for Concept 1/2
export type PanelState = 'collapsed' | 'partial' | 'expanded';
```

### Phase 2: Update NavigationPanel hover handling
```typescript
// Add hover timeout management
const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

const handleMouseEnter = () => {
  if (panelState === 'partial') {
    // Implement chosen concept's logic here
  }
};
```

### Phase 3: Add visual feedback elements
- Concept 1: Progress indicator bar
- Concept 2: Edge glow effect
- Concept 3: "Preview" badge and intermediate width

### Phase 4: Test and tune timing
- Test with real users or self-testing
- Adjust delay values based on feedback
- Verify no conflicts with existing click behaviors

---

## Files

- `nav-hover-expand-concept-1-delayed-intent.html` - Delayed hover with progress indicator
- `nav-hover-expand-concept-2-edge-trigger.html` - Edge-zone-only trigger
- `nav-hover-expand-concept-3-peek-preview.html` - Three-state progressive disclosure
- `nav-hover-expand-overview.md` - This comparison document

---

## Open Questions

1. **Should hover behavior be user-configurable?** Some users prefer click-only interaction.
2. **How does this interact with future localStorage persistence?** If user collapses nav manually, should hover still expand it?
3. **Keyboard accessibility** - Should focus-within also trigger expansion?
4. **Touch devices** - These concepts are desktop-only; touch has no hover. Is that acceptable?

---

## Next Steps

1. **Review concepts** - Open the HTML files in a browser to interact with each prototype
2. **Choose direction** - Decide which concept (or hybrid) to pursue
3. **Create implementation plan** - If moving forward, create detailed tasks
4. **Implement and test** - Build in Next.js with proper React patterns
