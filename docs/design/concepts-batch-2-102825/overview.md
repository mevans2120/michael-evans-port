# Homepage Featured Case Studies - Design Concepts

**Date**: October 28, 2025
**Purpose**: Redesign the featured case studies section on the homepage to align with the narrative scroll case study aesthetic

## Context

The current homepage features a 3-column grid of case study cards with basic hover effects. The new full case study pages use a long-form narrative scroll design with dark backgrounds, purple accents, large typography (DM Sans + Crimson Pro), and atmospheric blur orbs.

**Goal**: Create a featured work section that:
- Matches the elevated aesthetic of the narrative scroll case studies
- Works seamlessly on mobile and desktop
- Showcases the work's impact immediately
- Invites users to explore individual case studies

## Design Concepts

### Concept 1: Minimal Vertical Cards

**File**: `concept-1-minimal-cards.html`

**Approach**: Large typography and generous spacing in a vertical stack. Information reveals gradually on hover.

**Strengths**:
- ✅ Scalable to any number of case studies without layout changes
- ✅ Editorial, premium feel through typography hierarchy
- ✅ Works beautifully on mobile with minimal adaptation
- ✅ Purple accent bar creates visual rhythm
- ✅ Progressive disclosure keeps interface clean

**Tradeoffs**:
- ❌ Requires more scrolling to see all three case studies
- ❌ Less visual/cinematic than image-first approaches
- ❌ Relies on strong copy rather than visuals

**Best For**: Portfolios with strong case study writing, minimal visual assets, or when emphasizing business impact over aesthetics

---

### Concept 2: Hero Image Tiles

**File**: `concept-2-hero-tiles.html`

**Approach**: Visual-first with large image areas. Asymmetric grid with featured tile taking 2/3 width.

**Strengths**:
- ✅ Cinematic, portfolio-quality presentation
- ✅ Large visual areas perfect for product screenshots
- ✅ Asymmetric grid creates visual interest
- ✅ All three case studies visible at once (desktop)
- ✅ Text overlays keep information accessible

**Tradeoffs**:
- ❌ Requires high-quality images for each case study
- ❌ Less text information visible at a glance
- ❌ May not work well with fewer than 3 case studies
- ❌ More complex responsive behavior

**Best For**: Portfolios with strong visual work, actual product screenshots, or when visual impact is the primary selling point

---

### Concept 3: Horizontal Scroll Carousel

**File**: `concept-3-horizontal-scroll.html`

**Approach**: Wide cards that scroll horizontally like streaming services. Each card shows detailed information.

**Strengths**:
- ✅ Immersive browsing experience that invites exploration
- ✅ Wider cards allow for richer descriptions and visuals
- ✅ Feels modern and app-like
- ✅ Natural on touch devices
- ✅ Scales to any number of case studies
- ✅ Visually distinctive from typical portfolio layouts

**Tradeoffs**:
- ❌ Horizontal scrolling is less familiar than vertical
- ❌ Not all case studies visible at once (requires interaction)
- ❌ Some users may not discover the scroll affordance
- ❌ More complex accessibility implementation needed

**Best For**: Modern, experimental portfolios targeting tech-savvy audiences who appreciate unconventional interactions

---

## Comparison Matrix

| Criteria | Concept 1<br>Minimal Cards | Concept 2<br>Hero Tiles | Concept 3<br>Horizontal Scroll |
|----------|---------------------------|-------------------------|--------------------------------|
| **Visual Impact** | Medium | High | High |
| **Information Density** | High | Medium | High |
| **Mobile Experience** | Excellent | Good | Excellent |
| **Accessibility** | Excellent | Good | Medium |
| **Implementation Complexity** | Low | Medium | High |
| **Scalability** | Excellent | Good | Excellent |
| **Brand Alignment** | Strong | Strong | Strong |
| **Discoverability** | High | High | Medium |

## Recommendation

### Primary Recommendation: **Concept 1 - Minimal Vertical Cards**

**Rationale**:
1. **Brand alignment**: Best matches the narrative scroll aesthetic — large typography, generous spacing, progressive disclosure
2. **Content-first**: Emphasizes the impact and story of each project, which aligns with the detailed case study pages
3. **Accessibility**: Vertical scrolling is familiar, works excellently with screen readers, keyboard navigation is straightforward
4. **Mobile experience**: Requires minimal adaptation, scrolling feels natural
5. **Implementation**: Lowest complexity, can be built quickly and reliably

**When to choose this**: When you want to emphasize business impact, strong writing, and content hierarchy. Best if case study screenshots aren't yet production-ready.

---

### Alternative: **Concept 2 - Hero Image Tiles**

**When to choose this**: If you have high-quality product screenshots or brand visuals for each case study. The visual-first approach makes immediate impact and works well if the work is inherently visual (UI/UX, branding, product design).

**Requirements**:
- High-resolution screenshots or imagery for each case study
- Consistent visual quality across projects
- Additional development time for responsive grid behavior

---

### Experimental Option: **Concept 3 - Horizontal Scroll**

**When to choose this**: For portfolios targeting modern tech companies or startups. Works well if you want to differentiate from traditional portfolios and signal innovation.

**Requirements**:
- Additional JavaScript for smooth drag-to-scroll
- Keyboard navigation implementation for accessibility
- Clear scroll affordances (hints, shadows, etc.)
- User testing to validate interaction patterns

---

## Implementation Notes

### Typography
All concepts use the site's existing font system:
- **DM Sans**: Headings, UI elements (weights: 400, 500, 600, 700)
- **Crimson Pro**: Body text, descriptions (weights: 300, 400, 500, 600)

### Colors
Dark theme with purple accents:
- Background: `#0a0a14` → `#050510` gradient
- Primary purple: `hsl(280, 100%, 80%)`
- Secondary purple: `hsl(276, 100%, 75%)`
- Text primary: `#fafafa`
- Text secondary: `#d0d0d0`

### Animations
- Transition timing: 300-400ms
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)`
- Hover effects: Scale (1.02-1.03), translate, opacity, border-color
- All animations should feel smooth and premium, never janky

### Responsive Breakpoints
- Desktop: 1024px+
- Tablet: 768px - 1023px
- Mobile: < 768px

---

## Next Steps

1. **Choose concept**: Review with stakeholders and select primary direction
2. **Asset preparation** (if Concept 2): Gather or create high-quality images for each case study
3. **Implementation**: Build chosen concept in React/Next.js with Tailwind CSS
4. **Testing**: Validate on multiple devices and screen sizes
5. **Accessibility audit**: Ensure keyboard navigation, screen reader support, color contrast
6. **Analytics**: Track engagement metrics (clicks, time on page, scroll depth)

---

## Files in This Batch

- `mood-board.html` - Visual design direction and component examples
- `concept-1-minimal-cards.html` - Vertical stacked cards with large typography
- `concept-2-hero-tiles.html` - Asymmetric grid with visual-first approach
- `concept-3-horizontal-scroll.html` - Horizontal carousel with wide cards
- `overview.md` - This document

---

**Last Updated**: October 28, 2025
**Created By**: Claude Code (design-concepts skill)
