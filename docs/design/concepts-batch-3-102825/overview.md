# Case Study Landing Page - Hero Concepts Overview

**Date**: October 28, 2025
**Project**: Michael Evans Portfolio - Case Study Landing Page
**Purpose**: Evaluate three distinct hero design approaches for the case studies landing page

## Executive Summary

Three hero concepts were developed to feature Virgin America as the primary case study while transitioning to the existing `FeaturedCaseStudies` component. Each concept takes a different strategic approach to visual hierarchy, content presentation, and emotional impact.

**Quick Recommendation**: Concept 1 (Minimal Text with Featured Image) is recommended for immediate implementation due to its perfect balance of elegance, visual proof, accessibility, and ease of maintenance. It shows actual work through a single hero image while maintaining a clean, professional aesthetic. Concept 3 (Immersive Full-Bleed with Floating Mockups) is a strong alternative if you want maximum visual impact and differentiation.

---

## Concept 1: Minimal Text Hero (with Featured Image)

### Strategic Approach
Typography-first design that lets content breathe through generous whitespace and refined hierarchy. The featured case study gets maximum prominence through scale and gradient treatment. Enhanced with a single, elegantly presented hero image that provides visual proof without overwhelming the minimal aesthetic.

### Visual Characteristics
- **Hero Layout**: Vertical flow with clear hierarchy (label → title → metric → description → CTA → featured image)
- **Visual Treatment**: Purple gradient on title text, single subtle blur orb, featured screenshot with purple accent glow
- **Image Presentation**: Single 16:9 hero image, rounded corners, elevated with shadow and subtle purple border glow
- **Whitespace**: Generous, ~30% of viewport is empty space
- **Typography Scale**: Very large (80px max title size)
- **Visual Complexity**: Low-Medium - relies on typography, color, and single image

### Strengths
✅ **Clean and professional** - Projects confidence without being flashy
✅ **Highly accessible** - Excellent contrast, clear reading order
✅ **Mobile-friendly** - Scales beautifully on all screen sizes
✅ **Shows actual work** - Single hero image provides visual proof
✅ **Balanced** - Perfect ratio of text to visual content
✅ **Fast to implement** - Only requires one screenshot per featured case study
✅ **Emphasizes the work** - Content remains primary focus, image supports narrative
✅ **Matches existing design system** - Natural evolution of homepage style

### Tradeoffs
⚠️ **Requires one screenshot** - Need quality hero image for featured case study
⚠️ **Less visually dramatic than Concept 3** - More restrained than full immersive approach
⚠️ **Relies on typography quality** - Design lives or dies by type choices

### Best For
- Portfolios emphasizing professionalism and clarity
- Audiences who value content over decoration
- Projects with strong written case studies
- Teams prioritizing accessibility and performance

### Implementation Complexity
**Low** - Can be built with existing components and Tailwind utilities. Requires one quality screenshot (16:9 aspect ratio, ~1600×900px recommended) per featured case study. Upload to Sanity and reference via heroImage field.

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

## Concept 3: Immersive Full-Bleed Hero (with Floating Mockups)

### Strategic Approach
Bold, dramatic full-viewport experience creating maximum impact through animated gradient mesh, grid patterns, floating device mockups, and centered content. Commands attention, creates a premium feel, and showcases actual responsive design work through floating UI frames.

### Visual Characteristics
- **Hero Layout**: Full viewport height, centered content with floating device mockups
- **Visual Treatment**: Background screenshot (optional, blurred) + animated gradient mesh + grid pattern + 3 floating mockup frames (desktop, tablet, mobile)
- **Mockup Animation**: Independent float animations with rotation, purple glow on hover, glass-morphism styling
- **Whitespace**: Minimal - viewport is filled with atmospheric effects and UI previews
- **Typography Scale**: Massive (96px max title size)
- **Visual Complexity**: High - multiple animated layers + floating mockups with simulated browser chrome

### Strengths
✅ **Most visually striking** - Creates strong first impression with layered animations and mockups
✅ **Shows actual work** - Floating mockups provide tangible UI previews
✅ **Demonstrates expertise** - Responsive design clearly communicated through device frames
✅ **Memorable** - Stands out from typical portfolio sites
✅ **Premium feel** - Suggests high-end work and attention to craft
✅ **Good for differentiation** - Helps portfolio stand apart
✅ **Centered layout** - Works well on all screen sizes
✅ **Multiple CTAs** - Primary and secondary actions for better conversion
✅ **Performance optimized** - Mockups hidden on mobile, GPU-accelerated animations

### Tradeoffs
⚠️ **Potentially overwhelming** - High visual intensity may distract from content
⚠️ **Requires screenshot assets** - Need quality screenshots for all three mockup frames
⚠️ **Uses more real estate** - Takes full viewport before showing other work
⚠️ **More complex to maintain** - Screenshots need updating when work changes
⚠️ **Higher implementation complexity** - Multiple layers and animations need careful execution
⚠️ **May not age well** - Bold styles can feel dated faster than minimal designs

### Best For
- Portfolios wanting maximum differentiation
- Creative/design-forward professionals showcasing UI/UX work
- Projects where showing actual work is as important as describing it
- Demonstrating responsive design expertise
- First impression is critical
- Audiences who value bold, confident design

### Implementation Complexity
**High** - Requires:
- Layered CSS animations with GPU acceleration
- Sourcing/preparing 3 device mockup screenshots per featured case study
- Gradient mesh and grid pattern optimization
- Glass-morphism and backdrop-filter effects
- Performance optimization (especially for animations)
- Responsive behavior (hiding mockups on mobile)
- Careful z-index and overlay management for readability

---

## Side-by-Side Comparison

| Dimension | Concept 1: Minimal (w/ Image) | Concept 2: Split Visual | Concept 3: Immersive (w/ Mockups) |
|-----------|-------------------|------------------------|---------------------|
| **Visual Impact** | Medium | High | Very High |
| **Shows Actual Work** | Yes (1 hero image) | Yes (1 visual) | Yes (3 device mockups) |
| **Accessibility** | Excellent | Good | Good |
| **Mobile Experience** | Excellent | Good | Good (mockups hidden) |
| **Implementation Speed** | Fast (2-3 hours) | Medium (3-4 hours) | Slow (5-7 hours) |
| **Maintenance** | Low | Medium | Medium-High |
| **Asset Dependencies** | 1 screenshot per case study | 1 screenshot per case study | 3 screenshots per case study |
| **Performance** | Excellent | Good | Good (GPU-optimized) |
| **Readability** | Excellent | Very Good | Good |
| **Differentiation** | Low-Medium | Medium | Very High |
| **Risk of Over-design** | Very Low | Low | Medium-High |

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

### Primary Recommendation: **Concept 1 (Minimal Text Hero with Featured Image)**

**Why this concept wins for immediate implementation:**

1. **Fast to implement** - Can be built in 2-3 hours, only needs one screenshot
2. **Lowest risk** - Clean, professional design that will age well
3. **Best accessibility** - Excellent contrast, clear hierarchy, semantic HTML
4. **Best performance** - Minimal CSS, no animations required
5. **Shows actual work** - Single hero image provides visual proof without overwhelming
6. **Easy to maintain** - Content-driven with single image asset per featured case study
7. **Natural evolution** - Feels like a natural extension of the existing homepage
8. **Perfect balance** - Combines clean typography with visual proof of work

**This concept is ideal if you want to:**
- Ship quickly and iterate based on feedback
- Show actual work while emphasizing content and professionalism
- Maintain a cohesive design language with the existing homepage
- Minimize ongoing maintenance burden
- Balance text and visuals without going overboard

### Alternative Recommendation: **Concept 3 (Immersive Full-Bleed Hero with Floating Mockups)**

**Consider this concept if you want:**
- Maximum differentiation from other portfolio sites
- To showcase actual responsive design work through device previews
- A bold, memorable first impression with tangible proof of work
- To signal high-end creative work and technical expertise
- To create a distinct "landing page" feel vs the homepage
- Have (or can create) quality screenshots for desktop, tablet, and mobile views

**Caution**: This concept requires:
- More careful execution to avoid feeling overwhelming
- 3 screenshots per featured case study (desktop, tablet, mobile views)
- Performance optimization for smooth animations
- Test with representative users to ensure the visual intensity enhances rather than distracts from the content

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
1. **Prepare hero screenshot**:
   - Select best screenshot of featured case study (desktop view recommended)
   - Dimensions: 1600×900px (16:9 aspect ratio) or 2x for retina (3200×1800px)
   - Export as optimized PNG or WebP
   - Upload to Sanity via heroImage field on project
2. Create new route at `/src/app/(public)/case-studies/page.tsx`
3. Build hero section with Tailwind utilities (no custom components needed)
4. Import and render `<FeaturedCaseStudies />` below hero
5. Fetch featured case study from Sanity (query projects where `featured = true`, order by `order`)
6. Add dynamic content: title, metric, description, heroImage from Sanity
7. Render hero image with proper aspect ratio and styling

### For Concept 3 (Alternative):
1. Same route structure as Concept 1
2. **Prepare screenshot assets**:
   - Desktop view: 1440×900px (or 2x for retina)
   - Tablet view: 768×1024px
   - Mobile view: 375×667px
   - Export as optimized PNGs or WebP
   - Upload to Sanity and link to project
3. Create reusable components:
   - `<GradientMesh />` for animated background
   - `<FloatingMockup />` for device frames with props for screenshot, size, animation
4. Optimize animations with `will-change` and `transform` for GPU acceleration
5. Add `prefers-reduced-motion` media query to disable animations for accessibility
6. Test readability across different monitor brightness levels
7. Lazy-load mockup screenshots for performance
8. Consider placeholder images during development (as shown in concept file)

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
