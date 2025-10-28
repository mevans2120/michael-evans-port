# Case Study Page Design Concepts

**Date**: October 28, 2025
**Project**: Michael Evans Portfolio - Case Study Pages
**Example Content**: Virgin America Case Study
**Concepts Created**: 3 distinct design directions

---

## Design Challenge

**Current State**: Case studies use a horizontal slideshow with full-screen sections (Hero, Problem, Solution, Metrics, Outcomes, Gallery).

**Goal**: Explore alternative approaches for presenting case studies that:
- Maintain the site's existing design language (dark theme, purple accents, DM Sans + Crimson Pro fonts)
- Work well on mobile and desktop
- Make case studies engaging and easy to navigate
- Showcase the depth and impact of projects
- Feel professional and portfolio-worthy

---

## Key Research Insights

From reviewing the existing site:

1. **Design System**: Dark theme (gray-900/950), purple gradient accents (hsl(280 100% 80%)), DM Sans for headers, Crimson Pro for body
2. **Current Pattern**: Horizontal slideshow with keyboard navigation and progress indicators
3. **About Page Reference**: Long-form scrolling with blur orbs, gradient text, staggered animations, generous whitespace
4. **Content Depth**: Case studies have 6-8 sections with metrics, achievements, challenges, solutions, and technical details

---

## Concept 1: Narrative Scroll

**File**: [`concept-1-narrative-scroll.html`](./concept-1-narrative-scroll.html)

### Approach
Replace the horizontal slideshow with a long-form vertical scrolling experience. Similar to Apple product pages or Medium articles, this creates a cinematic narrative that unfolds as users scroll.

### Design Decisions

**Typography**:
- Headers: DM Sans (maintains brand consistency)
- Body: Crimson Pro (existing site font)
- Large, readable sizes with generous line-height

**Color Palette**:
- Dark gradients (gray-900 to gray-950)
- Purple accents (hsl(280 100% 80%))
- Maintains existing design system completely

**Visual Elements**:
- Blur orbs for atmospheric depth (matching About page)
- Gradient text for headers and metrics
- Subtle hover states on interactive elements
- Staggered section reveals on scroll

**Layout**:
- Max-width: 1200px for readability
- Alternating background colors for visual rhythm
- Generous whitespace between sections
- Annotations explain design decisions inline

### Strengths
✅ **Familiar interaction** - Scrolling is intuitive and universal  
✅ **Mobile-friendly** - Vertical scroll works perfectly on all devices  
✅ **Easy navigation** - Users can skim, jump back, use browser find  
✅ **Flexible content** - Easy to add/remove sections without breaking layout  
✅ **Brand consistent** - Uses existing fonts, colors, and visual language  
✅ **Accessible** - Natural reading order, keyboard navigation built-in

### Tradeoffs
⚠️ **Less cinematic** - Doesn't have the "presentation" feel of slideshow  
⚠️ **Requires scrolling** - Users need to scroll more to see all content  
⚠️ **Less distinct** - Feels more like a blog post than a unique experience

### Best For
- Users who want to skim and explore at their own pace
- Mobile-first audiences
- Content-heavy case studies with many sections
- Portfolios targeting readability and accessibility

---

## Concept 2: Chapter Dashboard

**File**: [`concept-2-chapter-dashboard.html`](./concept-2-chapter-dashboard.html)

### Approach
Transform case studies into a dashboard-like experience with persistent side navigation showing numbered chapters. Creates a technical, data-driven aesthetic.

### Design Decisions

**Typography**:
- Headers: JetBrains Mono (monospace for technical authority)
- Body: Satoshi (geometric sans-serif for clean readability)
- Terminal-style section headers with \`>\` prefix

**Color Palette**:
- Pure black background (#000000)
- Neon cyan accents (#00ffcc) - DIFFERENT from site's purple
- Grid pattern background (evokes data visualization)

**Visual Elements**:
- Fixed side navigation with chapter numbers
- Terminal/IDE-inspired aesthetic
- Neon glow effects (radial gradients with blur)
- Dashboard-style metric cards with hover effects
- Active chapter highlighting on scroll

**Layout**:
- Side nav: 280px fixed on left
- Main content: Scrollable with snap-to-section behavior
- Each section: Full viewport height
- Code-style annotations in monospace

### Strengths
✅ **Easy navigation** - Side nav shows all sections, jump anywhere instantly  
✅ **Technical authority** - Monospace + terminal aesthetic feels precise  
✅ **Non-linear exploration** - Users can skip around freely  
✅ **Distinctive** - Stands out from typical portfolio sites  
✅ **Dashboard feel** - Metrics feel more analytical and data-driven  
✅ **Fresh aesthetic** - Cyan instead of purple creates visual differentiation

### Tradeoffs
⚠️ **Screen real estate** - Side nav takes 280px, less space for content  
⚠️ **Mobile challenges** - Side nav becomes top nav, less effective  
⚠️ **Too technical?** - May feel overly tech-focused for non-technical projects  
⚠️ **Different from brand** - Cyan + monospace diverges from existing design system

### Best For
- Technical case studies (engineering, data science, infrastructure)
- Users who want to explore non-linearly
- Desktop-first audiences
- Portfolios targeting technical hiring managers or engineers

---

## Concept 3: Expandable Card Grid

**File**: [`concept-3-card-grid.html`](./concept-3-card-grid.html)

### Approach
Transform case studies into an interactive grid of expandable cards. Users click cards to reveal content, creating an exploratory, tool-like experience with brutalist aesthetics.

### Design Decisions

**Typography**:
- Headers: Cabinet Grotesk (bold geometric display font)
- Body: Outfit (clean geometric sans-serif)
- Ultra-bold headings (900 weight) for maximum impact

**Color Palette**:
- High contrast black/white
- Bright orange accent (#FF5722) for CTAs and highlights
- NO gradients, pure flat colors

**Visual Elements**:
- Brutalist aesthetic: sharp edges, heavy borders (3px, 8px)
- Interactive cards that expand to full width when clicked
- Grid layout on desktop, stacks on mobile
- Hover states with box shadows and transforms
- Numbered cards [01], [02], etc.

**Layout**:
- Card grid: Auto-fit columns (min 400px)
- Expanded cards: Full grid width
- Metrics: Overlapping borders creating unified grid
- No border-radius anywhere (pure brutalism)

### Strengths
✅ **Highly scannable** - See all sections at once in grid view  
✅ **User control** - Users decide what to expand and read  
✅ **Interactive** - Clicking and exploring feels engaging  
✅ **Distinctive aesthetic** - Brutalist B/W/orange is memorable  
✅ **Flexible** - Easy to add/remove cards without breaking grid  
✅ **Tablet-friendly** - Grid works well on medium screens

### Tradeoffs
⚠️ **Requires clicking** - Less passive, users must interact to see content  
⚠️ **Aggressive style** - Brutalism may feel too harsh for some projects  
⚠️ **Fragmented feel** - Grid layout can feel disconnected  
⚠️ **Brand divergence** - Completely different from existing design system  
⚠️ **Limited emotional range** - B/W/orange palette is energetic but not versatile

### Best For
- Design-focused portfolios (shows visual courage)
- Users who want to explore interactively
- Projects with distinct, modular sections
- Portfolios targeting creative/design roles

---

## Strategic Differences

These aren't just visual variations - they represent genuinely different strategic approaches:

### Information Architecture
- **Concept 1**: Linear narrative (beginning → end)
- **Concept 2**: Chapter-based navigation (jump anywhere)
- **Concept 3**: Modular exploration (expand what interests you)

### User Flow
- **Concept 1**: Passive reading (scroll and consume)
- **Concept 2**: Active navigation (choose your path)
- **Concept 3**: Interactive discovery (click to reveal)

### Visual Language
- **Concept 1**: Elegant, atmospheric (blur orbs, gradients)
- **Concept 2**: Technical, precise (terminal UI, monospace)
- **Concept 3**: Bold, aggressive (brutalism, high contrast)

---

## Recommendation

### If Brand Consistency is Priority → **Concept 1: Narrative Scroll**

**Rationale**:
- Uses existing design system (DM Sans, Crimson Pro, purple accents)
- Matches the About page aesthetic (blur orbs, gradients)
- Easiest to implement with existing components
- Most accessible and mobile-friendly

**Next Steps**:
1. Build React components for key sections
2. Add scroll-triggered animations
3. Test on mobile devices
4. Consider adding a floating "jump to section" menu

---

## Files in This Batch

\`\`\`
docs/design/concepts-batch-1-102825/
├── concept-1-narrative-scroll.html      (Safe/Refined direction)
├── concept-2-chapter-dashboard.html     (Bold/Distinctive direction)
├── concept-3-card-grid.html             (Experimental direction)
└── overview.md                          (This file)
\`\`\`

All concepts are standalone HTML files that can be opened directly in a browser for review.

---

## Next Steps

1. **Review Concepts**: Open each HTML file in browser, test on mobile
2. **Gather Feedback**: Share with stakeholders, get reactions
3. **Select Direction**: Choose one concept or hybrid approach
4. **Refine**: Iterate on chosen direction based on feedback
5. **Production Design**: Move to detailed component design and implementation
