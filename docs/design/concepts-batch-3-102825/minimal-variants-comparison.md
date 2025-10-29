# Minimal Hero Concept - Image Integration Variants

**Date**: October 28, 2025
**Purpose**: Compare three distinct approaches to integrating imagery into the minimal text-focused hero

## Overview

All three variants maintain the core minimal aesthetic while integrating imagery in fundamentally different ways. Each approach creates a different relationship between content and visuals.

---

## Variant A: Visible Background Image

### Integration Approach
Image serves as a visible atmospheric background element at 25% opacity, subtly blurred and slightly desaturated. Text remains completely in the foreground while image provides context and shows the work.

### Visual Treatment
- **Image**: Full-bleed background, 25% opacity, 4px blur, 20% grayscale
- **Overlay**: Multi-directional gradient (135deg, 75-80% opacity) for text readability
- **Layout**: Pure single-column text content
- **Image Role**: Atmospheric backdrop, visible but secondary

### Strengths
✅ Shows actual work as recognizable backdrop
✅ Zero layout complexity - pure vertical flow
✅ Image visible but never competes with content
✅ Perfect text readability guaranteed
✅ Maintains minimal aesthetic with visual proof
✅ Works with any image (blur/opacity makes it forgiving)
✅ Creates depth and atmosphere

### Tradeoffs
⚠️ Less prominent than foreground image treatments
⚠️ Requires careful overlay tuning for different images
⚠️ Image may be too subtle for some stakeholders

### Best For
- Maximum focus on copy and messaging
- When you want to hint at work without making it prominent
- Extremely refined, high-end aesthetic
- When text content is exceptionally strong

### Asset Requirements
- 1 screenshot per featured case study
- Any aspect ratio works (full-bleed background)
- Lower resolution acceptable since heavily blurred
- ~1920×1080px sufficient

---

## Variant B: Offset Portrait Image

### Integration Approach
Portrait-oriented image positioned to the right side of content, creating asymmetry and visual interest through layout composition.

### Visual Treatment
- **Image**: 400px fixed width, 3:4 portrait aspect ratio (400×533px)
- **Layout**: CSS Grid (1fr + 400px) with 80px gap
- **Positioning**: Image sits 40px lower than content top for visual rhythm
- **Image Role**: Compositional element, integrated through layout

### Strengths
✅ Most dynamic composition through asymmetry
✅ Portrait orientation is distinctive and modern
✅ Image feels integrated, not appended
✅ Works great for mobile screenshots or UI details
✅ Natural responsive collapse to single column
✅ Creates visual interest without overwhelming

### Tradeoffs
⚠️ Portrait orientation may not suit all screenshots
⚠️ More complex layout (grid vs simple vertical)
⚠️ Less whitespace than other minimal variants
⚠️ Image competes for attention with title

### Best For
- When you have strong portrait-oriented screenshots (mobile UI, vertical details)
- Creating visual interest through layout composition
- Demonstrating mobile-first design work
- When you want imagery to feel architectural

### Asset Requirements
- 1 screenshot per featured case study
- Portrait orientation: 3:4 aspect ratio (e.g., 600×800px)
- Mobile screenshots work perfectly
- Could crop landscape images to portrait

---

## Variant C: Inline Image Break

### Integration Approach
Image positioned within content flow between description and CTA, acting as a visual "break" or proof point in the narrative.

### Visual Treatment
- **Image**: Max-width 680px (narrower than content), 16:10 aspect ratio
- **Positioning**: Between description and CTA with 56px margins
- **Visual Weight**: Modest size, contained treatment
- **Image Role**: Narrative pause, proof point in story progression

### Strengths
✅ Most natural narrative integration
✅ Image feels like part of the story, not decoration
✅ Perfect content progression: tell story → show proof → take action
✅ Single-column simplicity maintained
✅ Image size is modest and well-balanced
✅ Subtle hover interaction suggests clickability
✅ Vertical accent line creates visual connection

### Tradeoffs
⚠️ Image placement might feel unexpected (breaks traditional hero pattern)
⚠️ Less prominent than full-width treatments
⚠️ 16:10 aspect ratio might require cropping some screenshots

### Best For
- When you want imagery to support narrative flow
- Creating a sense of discovery and progression
- Maintaining strong single-column layout
- When image is a proof point, not the hero

### Asset Requirements
- 1 screenshot per featured case study
- Landscape orientation: 16:10 aspect ratio (e.g., 1600×1000px)
- Should be compelling enough to work at moderate size
- Desktop screenshots or key UI moments work best

---

## Side-by-Side Comparison

| Dimension | Variant A: Background | Variant B: Offset | Variant C: Inline |
|-----------|----------------------|-------------------|-------------------|
| **Image Visibility** | Medium (25% opacity) | High (prominent) | Medium (contained) |
| **Layout Complexity** | Lowest (single column) | Medium (2-column grid) | Low (single column) |
| **Image Prominence** | Atmospheric backdrop | Compositional element | Narrative proof point |
| **Whitespace** | Maximum | Medium | High |
| **Mobile Experience** | Excellent | Good (stacks) | Excellent |
| **Asset Flexibility** | High (any image works) | Medium (needs portrait) | Medium (needs landscape) |
| **Implementation** | Simple | Medium | Simple |
| **Text Readability** | Excellent (guaranteed) | Excellent | Excellent |
| **Visual Interest** | Medium (depth/atmosphere) | High (asymmetry) | Medium |
| **Uniqueness** | Medium-High | High | Medium-High |

---

## Recommendations

### Primary Recommendation: **Variant C (Inline Image Break)**

**Why this variant wins:**

1. **Perfect narrative integration** - Image appears exactly when reader needs proof, after hearing the story
2. **Best of both worlds** - Maintains single-column simplicity while showing compelling imagery
3. **Natural progression** - Tell → Show → Act (description → preview → CTA)
4. **Modest and balanced** - Image doesn't overpower but provides clear visual proof
5. **Unique positioning** - Less common than typical hero image placements
6. **Easy to implement** - Single column layout with standard image treatment

**This variant is ideal if you want:**
- Clean minimal aesthetic with meaningful imagery
- Natural story progression from abstract to concrete
- Single-column simplicity
- Image that supports rather than dominates

### Alternative: **Variant B (Offset Portrait)**

**Choose this if you want:**
- Maximum visual interest through layout asymmetry
- To showcase mobile screenshots or vertical UI
- More dynamic, less traditional composition
- Image as equal partner with content (not supporting role)

**Note**: Requires portrait-oriented screenshots (3:4) which may not suit all case studies.

### Alternative: **Variant A (Visible Background)**

**Choose this if you want:**
- Refined minimal aesthetic with atmospheric depth
- Maximum focus on typography and copy
- Image as visible context/backdrop, not primary feature
- Most forgiving approach (any image works due to blur/opacity)
- Simplest single-column layout

**Note**: Image is visible but atmospheric - less prominent than foreground treatments.

---

## Implementation Notes

### All Variants:
- Use existing Sanity `heroImage` field
- Maintain responsive behavior on mobile
- Include alt text for accessibility
- Lazy-load images for performance
- Add loading state/skeleton

### Variant-Specific:

**Variant A (Background):**
```css
background-image: url(heroImage);
opacity: 0.25;
filter: blur(4px) grayscale(20%);
/* Overlay gradient at 75-80% opacity for readability */
```

**Variant B (Offset):**
```css
grid-template-columns: 1fr 400px;
aspect-ratio: 3 / 4;
/* Collapse to single column at 1024px */
```

**Variant C (Inline):**
```css
max-width: 680px;
aspect-ratio: 16 / 10;
margin: 56px 0;
```

---

## Asset Preparation Guide

### Variant A Requirements:
- **Dimensions**: 1920×1080px minimum
- **Format**: JPG or WebP (compression okay, will be blurred)
- **Orientation**: Any (full-bleed background)
- **Type**: Any compelling screenshot from case study

### Variant B Requirements:
- **Dimensions**: 600×800px (3:4 ratio) or larger
- **Format**: PNG or WebP for quality
- **Orientation**: Portrait (vertical)
- **Type**: Mobile screenshots, vertical UI sections, portrait-oriented content

### Variant C Requirements:
- **Dimensions**: 1600×1000px (16:10 ratio) or larger
- **Format**: PNG or WebP for quality
- **Orientation**: Landscape (horizontal)
- **Type**: Desktop screenshots, key interactions, compelling UI moments

---

## Next Steps

1. **Review all three variants** by opening HTML files in browser
2. **Select primary approach** based on strategic goals and available assets
3. **Prepare screenshot assets** according to selected variant requirements
4. **Implement in Next.js** using selected variant's specifications
5. **Test responsive behavior** across devices
6. **A/B test if desired** - variants are distinct enough for meaningful comparison

---

## Files Reference

- `minimal-variant-a-background.html` - Subtle background image approach
- `minimal-variant-b-offset.html` - Offset portrait image approach
- `minimal-variant-c-inline.html` - Inline image break approach
- `minimal-variants-comparison.md` - This document
