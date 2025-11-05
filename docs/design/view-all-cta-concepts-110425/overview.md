# View All CTA Concepts

**Date**: November 4, 2025
**Context**: Refining the "View all case studies" CTA to feel more elegant and refined

## Design Challenge

The current CTA is a simple text link with arrow ("Learn more →"). We want to explore more refined variations that feel sophisticated without being heavy-handed. User prefers minimal or slightly ornamental approaches over brutalist design.

## Concepts

### Concept 1: Minimal Button
**File**: `concept-1-minimal-button.html`
**Approach**: Ultra-minimal ghost button with subtle purple border

**Strengths**:
- Most button-like without feeling heavy
- Clear affordance (border signals clickability)
- Subtle hover effects (background tint + lift)
- Professional and refined

**Tradeoffs**:
- More visual weight than pure text
- Might feel too "buttony" for editorial aesthetic

---

### Concept 2: Clean Text Treatment
**File**: `concept-2-clean-text.html`
**Approach**: Simple text link with animated underline

**Strengths**:
- Pure simplicity - no container, no background
- Animated underline draws in on hover
- Arrow slides for additional feedback
- Very lightweight, editorial feel

**Tradeoffs**:
- Least visual presence (could be missed)
- Relies on color and position for discovery

---

### Concept 3: Ornamental Text
**File**: `concept-3-ornamental-text.html`
**Approach**: Text with decorative gradient line and boxed arrow

**Strengths**:
- Slightly ornamental with editorial feel
- Decorative line adds visual interest
- Boxed arrow creates focal point
- More sophisticated than simple text

**Tradeoffs**:
- More complex markup/styling
- Highest visual weight of the three

## Recommendation

Based on the user's preference for minimal or slightly ornamental (not brutalist), and likely hesitation toward buttons:

**1st choice**: Concept 3 (Ornamental Text) - Strikes the best balance between sophistication and subtlety
**2nd choice**: Concept 2 (Clean Text) - Safest, most minimal option
**3rd choice**: Concept 1 (Minimal Button) - User indicated they probably won't like a button

## Next Steps

1. User reviews all three concepts
2. Select preferred direction
3. Implement chosen concept in production code
4. Apply to both homepage and case studies page

## Implementation Notes

All concepts:
- Use existing design system colors (--accent, --accent-light)
- Support dark mode
- Include hover/interaction states
- Fully accessible (keyboard nav, proper contrast)
- Responsive-ready
