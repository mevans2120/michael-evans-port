# Case Study Landing Page - Hero Concepts Overview

**Date**: October 28, 2025
**Project**: Michael Evans Portfolio - Case Study Landing Page
**Purpose**: Evaluate three distinct hero design approaches for the case studies landing page

## Executive Summary

Three hero concepts were developed to feature Virgin America as the primary case study while transitioning to the existing `FeaturedCaseStudies` component. Each concept takes a different strategic approach to visual hierarchy, content presentation, and emotional impact.

**Quick Recommendation**: Concept 1 (Minimal Text) is recommended for immediate implementation due to its balance of elegance, accessibility, and ease of maintenance. Concept 3 (Immersive Full-Bleed) is a strong alternative if you want maximum visual impact and differentiation.

---

## Concept 1: Minimal Text Hero

### Strategic Approach
Typography-first design that lets content breathe through generous whitespace and refined hierarchy. The featured case study gets maximum prominence through scale and gradient treatment.

### Visual Characteristics
- **Hero Layout**: Vertical flow with clear hierarchy (label → title → metric → description → CTA)
- **Visual Treatment**: Purple gradient on title text, single subtle blur orb
- **Whitespace**: Generous, ~40% of viewport is empty space
- **Typography Scale**: Very large (80px max title size)
- **Visual Complexity**: Low - relies on typography and color

### Strengths
✅ **Clean and professional** - Projects confidence without being flashy
✅ **Highly accessible** - Excellent contrast, clear reading order
✅ **Mobile-friendly** - Scales beautifully on all screen sizes
✅ **Fast to implement** - No image dependencies, pure CSS
✅ **Emphasizes the work** - Content is hero, not decoration
✅ **Matches existing design system** - Natural evolution of homepage style

### Tradeoffs
⚠️ **Less visually dramatic** - Won't create a "wow" moment
⚠️ **Relies heavily on typography quality** - Design lives or dies by type choices
⚠️ **May feel understated** - Could be perceived as too minimal for some audiences

### Best For
- Portfolios emphasizing professionalism and clarity
- Audiences who value content over decoration
- Projects with strong written case studies
- Teams prioritizing accessibility and performance

### Implementation Complexity
**Low** - Can be built with existing components and Tailwind utilities. No external dependencies.

---

## Concept 2: Split Visual Hero

### Strategic Approach
Balanced 50/50 layout dividing screen real estate between compelling copy and striking visual treatment. Creates depth through layered mockup frames suggesting multi-device responsive design.

### Visual Characteristics
- **Hero Layout**: Two-column grid (content left, visual right)
- **Visual Treatment**: Layered mockup frames with 3D transforms
- **Whitespace**: Moderate, filled by visual element
- **Typography Scale**: Large (64px max title size)
- **Visual Complexity**: Medium - combines text and visuals

### Strengths
✅ **Eye-catching** - Creates visual interest through depth and layering
✅ **Clear information architecture** - Left-right split is intuitive
✅ **Suggests product quality** - 3D mockups imply polish and attention to detail
✅ **Flexible** - Visual side can accommodate screenshots or mockups
✅ **Metric display** - Stats bar creates clear value proposition

### Tradeoffs
⚠️ **Requires visual assets** - Mockup frames are placeholders, need real screenshots
⚠️ **More complex layout** - Grid system needs careful responsive handling
⚠️ **May feel "designed"** - Could appear less authentic than text-only approach
⚠️ **Higher maintenance** - Visual assets need updating as projects evolve

### Best For
- Portfolios with strong visual work (especially UI/UX)
- Projects where "showing" is as important as "telling"
- Designers wanting to demonstrate visual craft
- Case studies with compelling screenshots available

### Implementation Complexity
**Medium** - Requires CSS Grid, 3D transforms, and sourcing/preparing mockup screenshots for each featured case study.

---

## Concept 3: Immersive Full-Bleed Hero

### Strategic Approach
Bold, dramatic full-viewport experience creating maximum impact through animated gradient mesh, grid patterns, and centered content. Commands attention and creates a premium feel.

### Visual Characteristics
- **Hero Layout**: Full viewport height, centered content
- **Visual Treatment**: Animated gradient mesh + grid pattern + multiple blur orbs
- **Whitespace**: Minimal - viewport is filled with atmospheric effects
- **Typography Scale**: Massive (96px max title size)
- **Visual Complexity**: High - multiple animated layers

### Strengths
✅ **Most visually striking** - Creates strong first impression
✅ **Memorable** - Stands out from typical portfolio sites
✅ **Premium feel** - Suggests high-end work and attention to craft
✅ **Good for differentiation** - Helps portfolio stand apart
✅ **Centered layout** - Works well on all screen sizes
✅ **Multiple CTAs** - Primary and secondary actions for better conversion

### Tradeoffs
⚠️ **Potentially overwhelming** - High visual intensity may distract
⚠️ **Uses more real estate** - Takes full viewport before showing other work
⚠️ **Performance considerations** - Multiple animations and effects
⚠️ **Requires careful balance** - Easy to over-design and reduce readability
⚠️ **May not age well** - Bold styles can feel dated faster than minimal designs

### Best For
- Portfolios wanting maximum differentiation
- Creative/design-forward professionals
- Projects where first impression is critical
- Audiences who value bold, confident design

### Implementation Complexity
**Medium-High** - Requires careful CSS for layered animations, gradient mesh, performance optimization, and ensuring readability across all lighting conditions.

---

## Side-by-Side Comparison

| Dimension | Concept 1: Minimal | Concept 2: Split Visual | Concept 3: Immersive |
|-----------|-------------------|------------------------|---------------------|
| **Visual Impact** | Medium | High | Very High |
| **Accessibility** | Excellent | Good | Good |
| **Mobile Experience** | Excellent | Good | Good |
| **Implementation Speed** | Fast (1-2 hours) | Medium (3-4 hours) | Medium (3-5 hours) |
| **Maintenance** | Very Low | Medium | Low-Medium |
| **Asset Dependencies** | None | Screenshots needed | None |
| **Performance** | Excellent | Good | Good (with optimization) |
| **Readability** | Excellent | Very Good | Good |
| **Differentiation** | Low | Medium | High |
| **Risk of Over-design** | Very Low | Low | Medium |

---

## Design System Consistency

All three concepts maintain consistency with the existing design system:

- **Typography**: DM Sans (body), Crimson Pro (headings)
- **Color Palette**: Purple accents (`#c084fc`, `#a855f7`), dark backgrounds (`#0f172a`, `#050510`)
- **Component Reuse**: All concepts transition seamlessly to the existing `FeaturedCaseStudies` component
- **Interaction Patterns**: Purple accent bars, gradient effects on hover, progressive disclosure

The key difference is **how prominently** each concept uses these elements, not the elements themselves.

---

## Recommendations

### Primary Recommendation: **Concept 1 (Minimal Text Hero)**

**Why this concept wins for immediate implementation:**

1. **Fastest to implement** - No external dependencies, can be built in 1-2 hours
2. **Lowest risk** - Clean, professional design that will age well
3. **Best accessibility** - Excellent contrast, clear hierarchy, semantic HTML
4. **Best performance** - Minimal CSS, no animations required
5. **Easiest to maintain** - Pure content-driven, no image asset management
6. **Natural evolution** - Feels like a natural extension of the existing homepage

**This concept is ideal if you want to:**
- Ship quickly and iterate based on feedback
- Emphasize content and professionalism
- Maintain a cohesive design language with the existing homepage
- Minimize ongoing maintenance burden

### Alternative Recommendation: **Concept 3 (Immersive Full-Bleed Hero)**

**Consider this concept if you want:**
- Maximum differentiation from other portfolio sites
- A bold, memorable first impression
- To signal high-end creative work
- To create a distinct "landing page" feel vs the homepage

**Caution**: This concept requires more careful execution to avoid feeling overwhelming. Test with representative users to ensure the visual intensity enhances rather than distracts from the content.

### When to Choose Concept 2:

Choose the split visual concept if:
- You have high-quality screenshots readily available
- Your work is highly visual (UI/UX, product design)
- You want to show actual work in the hero
- You prefer a balanced approach between text and visuals

**Note**: This concept requires the most ongoing maintenance as you'll need to update mockup screenshots whenever featured case studies change.

---

## Implementation Notes

### For Concept 1 (Recommended):
1. Create new route at `/src/app/(public)/case-studies/page.tsx`
2. Build hero section with Tailwind utilities (no custom components needed)
3. Import and render `<FeaturedCaseStudies />` below hero
4. Fetch featured case study from Sanity (query projects where `featured = true`, order by `order`)
5. Add dynamic content: title, metric, description from Sanity

### For Concept 3 (Alternative):
1. Same route structure as Concept 1
2. Create reusable `<GradientMesh />` component for background
3. Optimize animations with `will-change` and `transform` for GPU acceleration
4. Test readability across different monitor brightness levels
5. Consider reduced motion preferences (`prefers-reduced-motion`)

### For All Concepts:
- Ensure smooth scroll transition from hero to case study grid
- Add proper semantic HTML (`<section>`, `<article>`, headings hierarchy)
- Test mobile experience thoroughly (especially Concept 2's grid layout)
- Add loading states for Sanity data
- Consider adding page transitions when navigating to individual case studies

---

## Next Steps

1. **Review concepts** with stakeholders/user (you)
2. **Select primary concept** based on strategic goals
3. **Gather assets** (if choosing Concept 2)
4. **Implement selected concept** in Next.js
5. **Test across devices** and gather feedback
6. **Iterate** based on user testing

---

## Files Reference

- `concept-1-minimal-text.html` - Minimal text hero implementation
- `concept-2-split-visual.html` - Split layout with visual mockups
- `concept-3-immersive-fullbleed.html` - Full-bleed immersive experience
- `overview.md` - This document

All concepts are fully self-contained HTML files with inline CSS for easy preview in any browser.
