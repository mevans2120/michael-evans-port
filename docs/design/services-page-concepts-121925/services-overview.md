# Services Page Design Concepts

**Created:** December 19, 2025
**Fidelity:** Low-fi wireframes
**Purpose:** Initial exploration of services page approaches

---

## Design Challenge

Create a services page that:
- Presents consulting services (Product Strategy, AI/ML, Experience Design, Technical Leadership)
- Appeals to multiple audiences (CTOs, startups, enterprises)
- Supports a soft sell for visitors in the consideration phase
- Avoids pricing or hard lead capture
- Fits within the existing minimal, refined design system

---

## Concepts Overview

| Aspect | Concept 1: Minimal | Concept 2: Structured | Concept 3: Conversational |
|--------|-------------------|----------------------|--------------------------|
| **Layout** | Single column, numbered list | 2x2 grid, card-based | Dialogue/Q&A format |
| **Content density** | Very sparse | Moderate | Moderate |
| **Visual interest** | Low (typography-driven) | Medium (cards + icons) | High (unexpected format) |
| **Scan-ability** | High (linear) | High (grid) | Medium (requires reading) |
| **Risk level** | Safe | Safe | Experimental |

---

## Concept 1: Minimal

**File:** `services-concept-1-minimal.html`

### Approach
Maximum whitespace, single column, services as a simple numbered list. Pure typography hierarchy with no cards, icons, or visual flourishes.

### Strengths
- Matches your portfolio's refined aesthetic perfectly
- Fastest to scan for executives
- Premium, confident positioning
- Easy to implement

### Trade-offs
- Requires strong copywriting to carry interest
- Less visual differentiation between services
- May feel too sparse for some visitors

### Best for
Senior executives who value efficiency and are already predisposed to premium consultants.

---

## Concept 2: Structured

**File:** `services-concept-2-structured.html`

### Approach
2x2 service card grid with icons and tags, benefits section with icons, and a simple 3-step process overview. More visual structure while remaining refined.

### Strengths
- Clear visual separation between services
- Easy comparison for "shopping" visitors
- Tags add scannability and SEO value
- Process section adds credibility

### Trade-offs
- More content = more to maintain
- Slightly less premium than Concept 1
- Cards are a common pattern (less distinctive)

### Best for
Team leads comparing consultants, visitors who want to understand scope before reaching out.

---

## Concept 3: Conversational

**File:** `services-concept-3-conversational.html`

### Approach
Services presented as Q&A dialogue, mimicking a discovery conversation. Questions appear as visitor thoughts; answers reveal services naturally.

### Strengths
- Highly differentiated (no one else does this)
- Creates intimacy and personal connection
- Ties into your AI/chatbot theme
- Natural soft sell through conversation
- Multi-option CTA lets visitors self-select

### Trade-offs
- Very unconventional - may confuse some visitors
- Harder to scan quickly
- Requires strong conversational copy
- More complex to implement

### Best for
Forward-thinking companies who value innovation and personality. Visitors who are already curious about you.

---

## Recommendation

**For your portfolio:** I'd lean toward **Concept 1 (Minimal)** or **Concept 3 (Conversational)**.

- **Concept 1** is the safest choice that matches your existing aesthetic and positions you as premium. It's also the easiest to implement and maintain.

- **Concept 3** is riskier but more memorable. It differentiates you from every other consultant and ties into your AI expertise. It could be the thing people remember about your site.

**Concept 2** is solid but conventional - it doesn't add much to your story that the case studies don't already tell.

---

## Next Steps

1. **Review in browser** - Open the HTML files to see them with dark mode toggle
2. **Evaluate fit** - Which approach matches how you want to present yourself?
3. **Pick direction** - Choose one to refine to mid-fi
4. **Content pass** - Finalize service descriptions and benefits copy
5. **Implementation planning** - If proceeding to production

---

## Files

```
docs/design/services-page-concepts-121925/
├── services-concept-1-minimal.html        # Safe: Minimal/refined
├── services-concept-2-structured.html     # Safe: Card-based
├── services-concept-3-conversational.html # Experimental: Q&A dialogue
└── services-overview.md                   # This document
```

All concepts include dark mode toggle and annotation callouts explaining design decisions.
