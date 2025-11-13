# Case Study Hero Design Concepts

**Date:** November 13, 2025
**Project:** Case Study Detail Page Hero Redesign
**Goal:** Add featured images to case study detail page heroes while maintaining readability and the existing design system

---

## Design Challenge

Currently, case study detail pages use a clean, text-only editorial hero (EditorialHero component). The featured images are fetched and passed to the component but not rendered. We want to explore different ways to incorporate these images to provide visual context while maintaining excellent typography and readability.

## Design System Constraints

All concepts adhere to the existing design system:
- **Colors:** HSL-based semantic tokens (background, foreground, accent, muted-foreground, border)
- **Typography:** Inter font family with established size scales
- **Spacing:** Consistent padding and margin patterns
- **Responsive:** Mobile-first approach with breakpoints at 768px (md) and 1024px (lg)
- **Accessibility:** WCAG AA color contrast standards maintained

---

## Concept 1: Subtle Background Overlay

**File:** `concept-1-subtle-background.html`

### Approach
Maintains the magazine-style editorial layout with a very subtle full-width background image behind the text. Image is barely visible (12% opacity) with a strong gradient overlay to ensure text readability.

### Layout
- Centered content (max-width 4xl)
- Full-width background image
- Strong gradient overlay (60% → 80% → 100% background)
- Vertical stacking: badge → title → subtitle → overview grid

### Strengths
- **Maintains current design integrity:** Keeps the clean, text-focused editorial style
- **Subtle visual context:** Background provides hint of project without overwhelming
- **Excellent readability:** Strong gradients ensure perfect text contrast
- **Easy implementation:** Minimal structural changes to current component
- **Safe choice:** Low risk, stakeholder-friendly

### Tradeoffs
- **Minimal visual impact:** Image is so subtle it might not feel worth adding
- **Underutilizes featured image:** Beautiful project images don't get to shine
- **Conservative approach:** Doesn't push the design forward significantly

### Best For
Teams prioritizing readability and text-first design, or when images are secondary to content hierarchy.

---

## Concept 2: Split Hero Layout

**File:** `concept-2-split-layout.html`

### Approach
Two-column layout on desktop with text on the left and a prominent, full-visibility image on the right. Image is contained in a rounded card with subtle shadow.

### Layout
- Desktop: 50/50 split (max-width 7xl container)
- Mobile: Image stacked above text
- Image in rounded container (rounded-2xl) with shadow
- Content includes all elements from current design

### Strengths
- **Balanced visual presence:** Image and text given equal weight
- **Image visibility:** Featured image displayed prominently at full opacity
- **Modern, professional aesthetic:** Clean split layout feels contemporary
- **Clear hierarchy:** Side-by-side creates natural scanning pattern
- **Flexible:** Works well with both portrait and landscape images

### Tradeoffs
- **More visual weight:** Shifts from text-first to balanced image/text
- **Requires wider container:** Uses max-width 7xl vs current 4xl
- **Higher complexity:** More layout logic for responsive behavior
- **Different aesthetic:** Departs from magazine-style editorial feel

### Best For
Projects where visual context is important and images are high-quality enough to be showcased prominently.

---

## Concept 3: Asymmetric Overlap (Wildcard)

**File:** `concept-3-asymmetric-overlap.html`

### Approach
Bold, modern layout where a large clipped background image (right 65% of viewport) is overlapped by a frosted-glass content card on the left. Breaks the grid with asymmetric composition.

### Layout
- Desktop: Image covers right 65%, angled clip-path
- Content in elevated card with backdrop-blur and transparency
- Decorative accent element (bottom-left)
- Mobile: Stacked with full-width image

### Strengths
- **Distinctive and memorable:** Unique layout that stands out
- **Premium feel:** Frosted glass card + shadows create depth and polish
- **Dynamic composition:** Asymmetry creates visual interest and energy
- **Image prominence:** Large image area without overwhelming text
- **Modern aesthetic:** Feels current and design-forward

### Tradeoffs
- **Complex implementation:** Clip-path, backdrop-blur, absolute positioning
- **Higher risk:** Bold design might not fit all project types
- **Accessibility concerns:** Frosted glass must maintain contrast
- **Potential performance:** Backdrop-blur can be expensive on some devices
- **Departure from current style:** Most different from existing design

### Best For
High-impact projects where you want the hero to make a statement, or portfolio pieces where visual design itself is part of the story.

---

## Comparison Matrix

| Criteria | Concept 1 | Concept 2 | Concept 3 |
|----------|-----------|-----------|-----------|
| **Implementation Complexity** | Low | Medium | High |
| **Visual Impact** | Subtle | Balanced | Bold |
| **Image Visibility** | 10-15% | 100% | 100% |
| **Text Readability** | Excellent | Excellent | Good |
| **Mobile Responsive** | Simple | Moderate | Complex |
| **Design Risk** | Low | Medium | High |
| **Aligns with Current Style** | High | Medium | Low |
| **Performance** | Excellent | Good | Fair |
| **Accessibility** | Excellent | Excellent | Good |

---

## Recommendation

**For Initial Implementation: Concept 2 (Split Hero Layout)**

### Rationale:
1. **Balanced approach:** Gives images meaningful presence without sacrificing readability
2. **Moderate complexity:** More substantial than Concept 1, less risky than Concept 3
3. **Flexible:** Works well across different project types and image qualities
4. **Modern but familiar:** Contemporary layout pattern users understand
5. **Room to grow:** Can be refined or adjusted based on feedback

### Implementation Path:
1. Start with Concept 2 for the initial launch
2. Monitor user engagement and feedback
3. Consider A/B testing against Concept 1 if stakeholders prefer subtle approach
4. Reserve Concept 3 for special "featured" case studies or hero moments

### Alternative Recommendations:
- **If prioritizing current design consistency:** Go with Concept 1
- **If wanting to make a bold statement:** Implement Concept 3 for flagship projects only

---

## Next Steps

1. Review concepts with stakeholders
2. Gather feedback on visual direction preferences
3. Test concepts with actual project images and content
4. Decide on final approach
5. Implement chosen concept in React with proper image optimization
6. Monitor performance metrics (LCP, CLS) after launch

---

## Files in This Batch

- `concept-1-subtle-background.html` - Magazine-style with subtle image overlay
- `concept-2-split-layout.html` - Modern split hero with prominent image
- `concept-3-asymmetric-overlap.html` - Bold asymmetric layout with overlap
- `overview.md` - This comparison document