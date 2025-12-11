# Blog Footnotes: 3 Design Concepts

**Date:** November 26, 2025
**Feature:** Blog Footnotes
**Research Type:** UX Design Concepts

---

## Executive Summary

This document presents 3 distinct approaches to implementing footnotes in the portfolio blog. Each concept addresses different user jobs-to-be-done and has specific trade-offs regarding reading flow, implementation complexity, and mobile experience.

**Current Context:**
- Blog uses `max-w-[920px]` article width
- Already has `MarginNote` component (Tip/Pro-Tip) using float-right pattern
- Content rendered via Sanity PortableText
- Mobile-first responsive design

---

## Research Insights

### Key Findings from UX Research

1. **Desktop vs Mobile Dichotomy**
   Sidenotes work excellently on desktop (1024px+) but require different treatment on mobile. The research shows footnotes should appear differently based on viewport.

2. **Reading Flow Priority**
   Traditional bottom footnotes "disrupt the reading flow far more than footnotes intend to" on the web, where scrolling replaces page-turning.

3. **Accessibility Requirements**
   - Superscript numbers alone are too small for touch targets (WCAG compliance)
   - Need visible, descriptive link text
   - Back-links should be clearly labeled

4. **Visual Differentiation**
   "Footnotes on the web need styling help—smaller size, different typeface, and lighter tone makes them easy to ignore effectively."

### Sources
- [Sidenotes In Web Design - Gwern.net](https://gwern.net/sidenote)
- [Tufte CSS](https://edwardtufte.github.io/tufte-css/)
- [Littlefoot.js](https://littlefoot.js.org/)
- [Accessible Footnotes - niquette.ca](https://niquette.ca/articles/accessible-footnotes/)
- [More Notes on Notes - scottstuff.net](https://scottstuff.net/posts/2024/12/17/more-notes-on-notes/)

---

## Concept 1: Tufte Sidenotes (CSS-only)

### Overview
Traditional Tufte-style sidenotes positioned in the right margin on desktop, collapsing to expandable inline notes on mobile.

### Visual Description

**Desktop (1024px+):**
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  Main article text continues here with a               ┌──────────────┐
│  reference mark¹ that links to the sidenote.           │ ¹ Source:    │
│  The text keeps flowing while the note                 │ Smith, 2024  │
│  appears in the margin without disrupting              │ "Quote from  │
│  the reading experience.                               │ the paper"   │
│                                                        └──────────────┘
│  The next paragraph continues...                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Mobile (<768px):**
```
┌─────────────────────────────┐
│                             │
│  Main text with mark [1]    │
│                             │
│  ┌─────────────────────────┐│
│  │ [1] Source: Smith, 2024 ││
│  │ "Quote from the paper"  ││
│  └─────────────────────────┘│
│                             │
│  Next paragraph continues   │
│                             │
└─────────────────────────────┘
```

### Jobs-to-be-Done Addressed

| Job | How Addressed |
|-----|---------------|
| **Read fluidly** | Note visible without leaving context |
| **Verify sources** | Citation immediately visible |
| **Choose depth** | Can ignore notes visually (lighter styling) |

### Technical Approach

1. **Sanity Schema:** New `footnote` block type with `number` and `content` fields
2. **Component:** `<Footnote number={1}>` with CSS Grid or absolute positioning
3. **Layout:** Blog layout needs wider container to accommodate margin
4. **Mobile:** CSS `@media` query to switch from margin to inline

### Implementation Complexity

| Aspect | Complexity | Notes |
|--------|------------|-------|
| CMS Schema | Low | Single new block type |
| CSS Layout | Medium | Requires layout restructure for margin space |
| Accessibility | Medium | Need proper ARIA labels |
| Mobile UX | Low | Falls back to inline cleanly |

### Pros & Cons

**Pros:**
- Zero JavaScript required
- Matches existing `MarginNote` pattern conceptually
- Excellent desktop reading experience
- Academic/professional aesthetic

**Cons:**
- Requires layout width adjustment (current 920px may need 1200px+ container)
- Multiple sidenotes can stack awkwardly
- Not suitable for very long footnotes
- Mobile fallback less elegant than popover

### Recommendation Score: 7/10
Best for: Citation-heavy academic content, sources, brief explanations

---

## Concept 2: Inline Popover (Click-to-Expand)

### Overview
Footnote markers become interactive buttons that reveal content in a floating popover positioned near the reference point.

### Visual Description

**Initial State:**
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  Main article text continues here with a               │
│  reference mark [1] that the reader can click.         │
│  The text keeps flowing naturally.                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Expanded State (after click):**
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  Main article text continues here with a               │
│  reference mark [1] that the reader can click.         │
│              ┌──────────────────────────┐               │
│              │ Source: Smith, 2024      │               │
│              │ "This is the full quote  │               │
│              │ from the referenced      │               │
│              │ paper explaining..."     │               │
│              │                    [×]   │               │
│              └──────────────────────────┘               │
│  The text keeps flowing naturally.                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Jobs-to-be-Done Addressed

| Job | How Addressed |
|-----|---------------|
| **Read without distraction** | Notes hidden until needed |
| **Deep dive when curious** | Click to expand reveals full content |
| **Stay in context** | Popover appears at reading position |
| **Mobile friendly** | Same interaction on all devices |

### Technical Approach

**Option A: Native Popover API (Modern)**
```tsx
<button popovertarget="fn-1">[1]</button>
<div id="fn-1" popover="auto">
  Footnote content here
</div>
```

**Option B: Radix UI Popover**
```tsx
<Popover>
  <PopoverTrigger>[1]</PopoverTrigger>
  <PopoverContent>Footnote content</PopoverContent>
</Popover>
```

### Implementation Complexity

| Aspect | Complexity | Notes |
|--------|------------|-------|
| CMS Schema | Low | Same as Concept 1 |
| Component | Low | Use existing shadcn/ui Popover |
| Accessibility | Low | Radix handles ARIA automatically |
| Mobile UX | Low | Works identically on all devices |

### Pros & Cons

**Pros:**
- Clean, uncluttered reading experience
- Consistent across all viewport sizes
- Can handle long footnotes well
- Uses existing shadcn/ui components
- Progressive disclosure pattern

**Cons:**
- Requires JavaScript
- User must click to see each note
- Can't scan all footnotes at once
- Popover positioning can be tricky near edges

### Recommendation Score: 8/10
Best for: Explanatory asides, optional context, longer footnotes

---

## Concept 3: Traditional Bottom Footnotes (Enhanced)

### Overview
Classic numbered references with footnotes collected at section or article end, enhanced with smooth scroll and back-links.

### Visual Description

**In-Article:**
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  Main article text continues here with a               │
│  reference mark¹ that links to the bottom.             │
│  The text keeps flowing naturally with                 │
│  another reference² for a different source.            │
│                                                         │
│  [... more article content ...]                        │
│                                                         │
│  ─────────────────────────────────────────             │
│                                                         │
│  NOTES                                                 │
│                                                         │
│  1. Smith, J. (2024). "Research Paper Title."          │
│     Journal of Examples, 12(3), 45-67. ↩              │
│                                                         │
│  2. Jones, A. (2023). Web Design Patterns.             │
│     O'Reilly Media. ↩                                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Jobs-to-be-Done Addressed

| Job | How Addressed |
|-----|---------------|
| **Academic credibility** | Familiar citation format |
| **Reference later** | All sources in one place |
| **Print-friendly** | Works perfectly when printed |
| **Scan all sources** | Complete bibliography visible |

### Technical Approach

1. **Inline Mark:** `<sup><a href="#fn-1">[1]</a></sup>`
2. **Footer Section:** `<section aria-label="Footnotes">` with `<ol>`
3. **Back-links:** Each footnote ends with `<a href="#fnref-1">↩</a>`
4. **Scroll Behavior:** `scroll-behavior: smooth` + offset for sticky header

### Implementation Complexity

| Aspect | Complexity | Notes |
|--------|------------|-------|
| CMS Schema | Medium | Need to collect footnotes and render separately |
| Component | Medium | Auto-numbering and back-link generation |
| Accessibility | Low | Standard pattern, well-documented |
| Mobile UX | Medium | Requires scroll management |

### Pros & Cons

**Pros:**
- Most familiar pattern for readers
- Complete citation list in one place
- No JavaScript required (basic version)
- Print-friendly
- Easy to reference multiple times

**Cons:**
- Disrupts reading flow (scroll down, then back)
- Easy to lose place in long articles
- Requires maintaining two locations in sync
- Less engaging than modern alternatives

### Enhancement Options

1. **Scroll Progress:** Visual indicator of reading position
2. **Hover Preview:** Show footnote on hover (desktop only)
3. **Sticky Footer:** Mini footnote bar at bottom of viewport
4. **Section-based:** Group footnotes by section instead of article end

### Recommendation Score: 6/10
Best for: Academic papers, citation-heavy research, print-first content

---

## Comparison Matrix

| Feature | Sidenotes | Popover | Bottom |
|---------|-----------|---------|--------|
| **Reading Flow** | Excellent | Good | Poor |
| **Mobile UX** | Good | Excellent | Fair |
| **Long Content** | Poor | Excellent | Excellent |
| **Scan-ability** | Good | Poor | Excellent |
| **JavaScript** | No | Yes | Optional |
| **Accessibility** | Medium | Good | Good |
| **Implementation** | Medium | Low | Medium |
| **Print-friendly** | Good | Poor | Excellent |

---

## Recommendation

### For This Portfolio Blog: **Concept 2 (Inline Popover)**

**Rationale:**

1. **Alignment with existing patterns** - Already using shadcn/ui, Radix handles accessibility
2. **Mobile-first** - Consistent experience across devices
3. **Low friction** - Uses existing components, minimal new CSS
4. **Content flexibility** - Handles both short citations and longer explanations
5. **Modern aesthetic** - Matches the portfolio's contemporary design

### Suggested Implementation

```tsx
// Sanity schema: footnote block type
{
  name: 'footnote',
  type: 'object',
  fields: [
    { name: 'number', type: 'number' },
    { name: 'content', type: 'text' }
  ]
}

// Component using shadcn/ui Popover
export function Footnote({ number, content }: FootnoteProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="inline-flex items-center justify-center w-5 h-5
          text-[11px] font-medium rounded-full bg-accent/10 text-accent
          hover:bg-accent/20 transition-smooth align-super -translate-y-0.5">
          {number}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 text-sm">
        {content}
      </PopoverContent>
    </Popover>
  );
}
```

---

## Hybrid Approach (Future Consideration)

For maximum flexibility, consider implementing **both Sidenotes and Popovers**:

- **Desktop wide screens:** Sidenotes in margin
- **Desktop narrow/Mobile:** Popover on click
- Use CSS `@media` to switch between modes

This would require:
1. `Footnote` component that renders both DOM structures
2. CSS to show/hide based on viewport
3. JavaScript only needed for popover (mobile)

Complexity: High, but provides best-of-both-worlds UX.

---

## Next Steps

1. **Choose concept** - Review with stakeholder
2. **Create Sanity schema** - Add footnote block type
3. **Build component** - Implement chosen pattern
4. **Add to BlogContent** - Register in PortableText serializers
5. **Test accessibility** - Keyboard navigation, screen reader
6. **Document** - Add to component library docs

---

## Research Sources

- [Sidenotes In Web Design - Gwern.net](https://gwern.net/sidenote)
- [Tufte CSS](https://edwardtufte.github.io/tufte-css/)
- [Tufte CSS GitHub](https://github.com/edwardtufte/tufte-css)
- [Littlefoot.js](https://littlefoot.js.org/)
- [Accessible Footnotes - niquette.ca](https://niquette.ca/articles/accessible-footnotes/)
- [Accessible Footnotes - Leilukin](https://leilukin.com/articles/accessible-footnotes/)
- [More Notes on Notes - scottstuff.net](https://scottstuff.net/posts/2024/12/17/more-notes-on-notes/)
- [Web Experience Toolkit - Footnotes](https://wet-boew.github.io/v4.0-ci/demos/footnotes/footnotes-en.html)
- [Footnotes on the Web - V.H. Belvadi](https://vhbelvadi.com/footnotes-on-the-web)
- [Popover API - web.dev](https://web.dev/learn/css/popover-and-dialog)
- [Using the Popover API - Frontend Masters](https://frontendmasters.com/blog/using-the-popover-api-for-html-tooltips/)
