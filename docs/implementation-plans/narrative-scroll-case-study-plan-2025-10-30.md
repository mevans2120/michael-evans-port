# Narrative Scroll Case Study Layout - Implementation Plan

**Created**: October 30, 2025
**Design Concept**: `/docs/design/concepts-batch-1-102825/concept-1-narrative-scroll_final.html`
**First Implementation**: Virgin America Case Study
**Approach**: Two-phase implementation (Static → CMS-driven)

---

## Executive Summary

This plan outlines the implementation of a long-form narrative scroll case study layout to replace the existing horizontal slideshow approach. The new design provides a superior mobile experience, easier content management, and better storytelling through vertical scrolling similar to Apple product pages.

### Key Benefits
- **Mobile-first**: Natural scrolling interaction vs. problematic slideshow navigation
- **Content flexibility**: Variable-length sections without slideshow constraints
- **Better storytelling**: Atmospheric effects and clear visual hierarchy
- **Easier maintenance**: Straightforward vertical sections vs. complex slide coordination

### Success Metrics
- Mobile navigation improvement (subjective assessment)
- Reduced complexity in content structure
- Faster time-to-implement new case studies
- Visual parity with design concept (95%+ match)

---

## Phase 1: Static Implementation

**Goal**: Build and style the narrative scroll layout with hardcoded Virgin America content to validate design and user experience.

**Duration Estimate**: 6-8 hours
**Dependencies**: None - can start immediately

### Phase 1.1: Update CaseStudyNarrative Component

**File**: `/src/components/CaseStudyNarrative.tsx`

**Tasks**:
1. Update hero section styling to match design concept exactly
2. Implement alternating section backgrounds (`nth-child(even)`)
3. Add atmospheric blur orbs with exact HSL values
4. Update tech tags styling with improved spacing

**Success Criteria**:
- Hero section matches concept pixel-perfect at 1440px width
- Gradient title uses exact HSL values: `hsl(280, 100%, 80%)` to `hsl(0, 0%, 98%)`
- Mobile viewport (375px) shows proper text scaling

**Technical Specifications**:
```tsx
// Hero title gradient
background: linear-gradient(135deg, hsl(280, 100%, 80%), hsl(0, 0%, 98%));
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;

// Category badge
background: rgba(199, 128, 245, 0.1);
border: 1px solid rgba(199, 128, 245, 0.3);
```

### Phase 1.2: Create/Update CaseStudySection Component

**File**: `/src/components/CaseStudySection.tsx`

**Tasks**:
1. Create section label component (uppercase, tracked, purple accent)
2. Add heading with gradient underline decoration
3. Implement Portable Text rendering for body content
4. Add support for screenshot grids (2-column responsive)
5. Add support for large (full-width) screenshots
6. Implement annotation callout boxes
7. Add proper spacing between elements

**Component Structure**:
```tsx
<section className={alternatingBg}>
  <div className="container">
    {sectionLabel && <SectionLabel />}
    <h2 className="section-heading">{heading}</h2>
    <div className="section-content">
      <PortableText value={content} />
    </div>
    {screenshots && <Screenshots layout={layout} items={screenshots} />}
    {annotation && <Annotation />}
  </div>
</section>
```

**Success Criteria**:
- Section label styling matches concept (purple, uppercase, tracked)
- Heading has 1px gradient underline (4rem width)
- Screenshots display in grid (2-col) or large (full-width) layouts
- Annotations have purple left border and tinted background
- Proper vertical rhythm (8rem padding between sections)

### Phase 1.3: Atmospheric Blur Orbs

**Implementation**: Fixed position decorative elements

**Tasks**:
1. Create blur orb elements with exact positioning
2. Set z-index to ensure they're behind content
3. Add proper blur (100px) and opacity (0.15)
4. Ensure they work on mobile without causing scroll issues

**Specifications**:
```tsx
// Blur orb 1 (top-left)
top: 10%, left: 10%
size: 400px × 400px
color: hsl(280, 100%, 70%)
filter: blur(100px)
opacity: 0.15

// Blur orb 2 (bottom-right)
bottom: 20%, right: 10%
size: 500px × 500px
color: hsl(276, 100%, 75%)
filter: blur(100px)
opacity: 0.15
```

**Success Criteria**:
- Orbs are visible but subtle (not distracting)
- No performance issues on mobile
- Orbs stay fixed while content scrolls
- Colors match exact HSL values from design

### Phase 1.4: Metrics Grid

**Tasks**:
1. Update metric card styling to match design
2. Implement gradient text for metric values
3. Add proper border-radius (1.5rem) and padding
4. Ensure responsive grid (1-col mobile, 4-col desktop)

**Styling**:
```tsx
// Metric card
background: rgba(255, 255, 255, 0.03)
border: 1px solid rgba(255, 255, 255, 0.1)
border-radius: 1.5rem
padding: 3rem 2rem

// Metric value
font-size: 3.5rem
font-weight: 700
gradient: linear-gradient(135deg, hsl(276, 100%, 75%), hsl(280, 100%, 80%))
font-family: DM Sans
```

**Success Criteria**:
- Values use gradient text effect
- Grid is responsive (auto-fit, minmax(250px, 1fr))
- Spacing matches design (2rem gap)
- Text hierarchy is clear (value → label → description)

### Phase 1.5: Responsive Testing

**Test Viewports**:
- Mobile: 375px (iPhone SE)
- Tablet: 768px (iPad)
- Laptop: 1280px
- Desktop: 1440px
- Large: 1920px

**Test Cases**:
1. Hero title scales appropriately with `clamp()`
2. Metrics grid adapts (1-col → 2-col → 4-col)
3. Screenshot grids stay readable (stack on mobile)
4. Text remains readable at all sizes
5. Blur orbs don't cause horizontal scroll
6. Navigation and interactions work on touch devices

**Success Criteria**:
- All viewports render without horizontal scroll
- Text is readable without zooming on mobile
- Touch targets are at least 44px × 44px
- Images load efficiently (Next.js Image optimization)

---

## Phase 2: CMS Integration

**Goal**: Make the layout CMS-driven by extending Sanity schemas and migrating Virgin America content.

**Duration Estimate**: 4-6 hours
**Dependencies**: Phase 1 must be complete and validated

### Phase 2.1: Schema Updates

**File**: `/sanity/schemas/project.ts`

**Current State**: Schema already supports:
- `sections[]` - Array of case study sections
- `screenshots[]` - Within each section
- `layout` - 'grid' or 'large' for screenshots
- `annotation` - Design decision callouts

**Tasks**:
1. Verify annotation field exists and is properly typed
2. Test screenshot upload and preview in Sanity Studio
3. Add helper text to guide content editors
4. Consider adding a "section background" toggle field

**New/Updated Fields**:
```typescript
{
  name: 'annotation',
  title: 'Design Annotation',
  type: 'object',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Annotation Title',
      description: 'e.g., "Design Decision", "Technical Note"',
    },
    {
      name: 'content',
      type: 'text',
      title: 'Annotation Content',
      rows: 3,
    },
  ],
}
```

**Success Criteria**:
- All fields appear in Sanity Studio
- Field descriptions guide content editors
- Preview shows proper formatting
- No TypeScript errors in schema

### Phase 2.2: Content Migration Script

**File**: `/scripts/migrate-virgin-america.ts`

**Source Content**: `/docs/research/research-batch-1-102525/source-materials/transcripts/`

**Tasks**:
1. Create migration script to structure Virgin America content
2. Parse transcript content into sections
3. Structure according to design concept sections:
   - The Challenge
   - Research Insights
   - The Solution
   - Key Metrics
   - Outcomes & Impact
4. Add placeholder references for screenshots
5. Include annotation content where applicable

**Script Structure**:
```typescript
const virginAmericaContent = {
  title: "Virgin America: First Responsive Airline Website",
  slug: "virgin-america-responsive-booking",
  subtitle: "Reimagining airline booking by focusing on decisions, not clicks...",
  category: "case-study",

  metrics: [
    { label: "Conversion Improvement", value: "15-20%" },
    { label: "Responsive Airline Website", value: "Industry First" },
    { label: "Major Awards Won", value: "3", description: "Webbies, UX Awards, Cannes Lions" },
    { label: "Angular Project", value: "Largest", description: "At the time of launch" }
  ],

  achievements: [
    "Created the first responsive airline website",
    "Improved conversion rates by 15-20%",
    // ... etc
  ],

  technologies: ["Angular", "Sabre API", "Responsive Design", "Single-Page Application"],

  overview: {
    role: "Lead Product Manager & Client Lead",
    company: "Work & Co",
    timeline: "~1 year (2014-2015)"
  },

  sections: [
    {
      sectionLabel: "The Challenge",
      heading: "Understanding the Real Problem",
      content: [/* Portable Text blocks */],
      screenshots: [] // Add in Phase 2.4
    },
    // ... more sections
  ]
}
```

**Success Criteria**:
- Script parses transcript content correctly
- All sections map to design concept structure
- Portable Text formatting is preserved
- Script can be run multiple times safely (idempotent)

### Phase 2.3: Run Migration

**Tasks**:
1. Run migration script to create/update Virgin America project
2. Verify all content appears in Sanity Studio
3. Check preview in Studio to ensure proper rendering
4. Fix any content formatting issues

**Command**:
```bash
npm run migrate:virgin-america
# or
npx tsx scripts/migrate-virgin-america.ts
```

**Validation Checklist**:
- [ ] Project appears in Sanity Studio Projects list
- [ ] All sections are populated with content
- [ ] Metrics display in proper format
- [ ] Achievements list is complete
- [ ] Technologies array is populated
- [ ] Overview fields contain correct information

**Success Criteria**:
- Content matches transcript source material
- All required fields are populated
- No validation errors in Sanity
- Preview renders without errors

### Phase 2.4: Add Screenshots

**Tasks**:
1. Collect Virgin America project screenshots (if available)
2. Upload images to Sanity assets
3. Assign screenshots to appropriate sections
4. Add captions to each screenshot
5. Set layout (grid vs. large) for each screenshot

**Screenshot Plan** (based on design concept):
- **Research Insights Section**: 1 large screenshot (old booking flow)
- **Solution Section**: 4 grid screenshots (booking steps 1-4)
- **Outcomes Section**: 2 grid screenshots (desktop + mobile)
- **Outcomes Section**: 1 large screenshot (final product)

**Placeholder Strategy**:
If real screenshots aren't available:
- Create placeholder images in Figma
- Use descriptive labels matching design concept
- Maintain proper aspect ratios (16:10 for grid, 16:9 for large)

**Success Criteria**:
- All screenshots have captions
- Layout types are set correctly
- Images render at appropriate sizes
- Alt text is descriptive

### Phase 2.5: End-to-End Testing

**Test URL**: `http://localhost:3000/case-studies/virgin-america-responsive-booking`

**Test Cases**:
1. Page loads without errors
2. All sections render with content from Sanity
3. Metrics display correctly
4. Achievements list appears
5. Screenshots display in correct layouts
6. Annotations appear where defined
7. Back button works
8. "View More Case Studies" CTA is functional
9. Mobile experience is smooth
10. Images lazy-load properly

**Performance Checks**:
- Lighthouse score > 90 (performance)
- First Contentful Paint < 1.5s
- Largest Contentful Paint < 2.5s
- Cumulative Layout Shift < 0.1

**Success Criteria**:
- All test cases pass
- No console errors
- Performance metrics meet thresholds
- Visual comparison to design concept shows 95%+ match

---

## Quality Assurance & Evaluation

### Visual Comparison Checklist

Compare implementation to `/docs/design/concepts-batch-1-102825/concept-1-narrative-scroll_final.html`:

#### Typography
- [ ] Hero title uses correct gradient (purple to white)
- [ ] Font families match (DM Sans for headings, Crimson Pro for body)
- [ ] Font weights are accurate (600 for h1, 300 for body)
- [ ] Font sizes use clamp() for fluid typography
- [ ] Line heights match (1.1 for h1, 1.8 for body)
- [ ] Letter spacing matches on uppercased elements

#### Colors
- [ ] Background gradient: `#0a0a14` to `#050510`
- [ ] Blur orb 1: `hsl(280, 100%, 70%)` at 15% opacity
- [ ] Blur orb 2: `hsl(276, 100%, 75%)` at 15% opacity
- [ ] Purple accent: `hsl(280, 100%, 80%)`
- [ ] Text muted: `#a0a0a0`
- [ ] Border colors: `rgba(255, 255, 255, 0.1)`

#### Layout & Spacing
- [ ] Container max-width: 1200px
- [ ] Section padding: 8rem vertical
- [ ] Hero min-height: 100vh
- [ ] Metrics grid gap: 2rem
- [ ] Screenshot grid gap: 2rem
- [ ] Border radius on cards: 1.5rem

#### Components
- [ ] Category badge styling matches
- [ ] Tech tags display correctly
- [ ] Metric cards have proper styling
- [ ] Section headings have gradient underline
- [ ] Achievement bullets are purple dots
- [ ] Annotations have left border and tinted background
- [ ] Screenshot containers have proper aspect ratios

#### Animations & Effects
- [ ] Blur orbs stay fixed during scroll
- [ ] Hover states work on interactive elements
- [ ] Page scrolls smoothly (no jank)

#### Responsive Behavior
- [ ] Hero title scales down properly on mobile
- [ ] Metrics grid becomes 1-column on mobile
- [ ] Screenshot grids stack vertically on mobile
- [ ] Text remains readable without horizontal scroll
- [ ] Touch targets are appropriately sized
- [ ] Blur orbs don't cause overflow on mobile

### Mobile vs. Slideshow Comparison

Evaluate the new narrative scroll against the old slideshow:

**Navigation**:
- Scroll vs. slide buttons: Which feels more natural on mobile?
- Progress indication: Is it clear where you are in the story?
- Skimming: Can you quickly find specific sections?

**Content Consumption**:
- Reading flow: Does vertical scroll feel better than horizontal slides?
- Image viewing: Are screenshots easier to view?
- Context retention: Is it easier to remember what you've read?

**Technical**:
- Load time: Does the page load faster?
- Maintenance: Is it easier to add/edit content?
- Flexibility: Can sections have variable lengths?

### Acceptance Criteria

**Phase 1 Complete When**:
- [ ] Static Virgin America case study renders perfectly at `/case-studies/virgin-america-responsive-booking`
- [ ] Visual comparison shows 95%+ match to design concept
- [ ] All responsive breakpoints work correctly
- [ ] Performance metrics meet thresholds
- [ ] Code review passes (clean, well-structured)

**Phase 2 Complete When**:
- [ ] Sanity Studio has all necessary fields
- [ ] Virgin America content is fully migrated
- [ ] CMS-driven page renders identically to static version
- [ ] Content can be edited in Studio and updates propagate
- [ ] Documentation exists for adding new case studies

**Project Complete When**:
- [ ] Both phases pass acceptance criteria
- [ ] User testing confirms mobile improvement
- [ ] Documentation is updated
- [ ] Plan exists for migrating other case studies
- [ ] Stakeholder approval received

---

## Risk Assessment & Mitigation

### Risk 1: Typography Not Available
**Likelihood**: Low
**Impact**: Medium
**Issue**: DM Sans or Crimson Pro might not be properly loaded
**Mitigation**: Verify font loading in app/layout.tsx, add fallbacks to sans-serif and serif

### Risk 2: Performance Issues on Mobile
**Likelihood**: Medium
**Impact**: High
**Issue**: Blur orbs or large images could cause performance degradation
**Mitigation**: Test on real devices, optimize blur effect, use Next.js Image optimization, consider removing blur orbs on mobile

### Risk 3: Content Migration Complexity
**Likelihood**: Medium
**Impact**: Medium
**Issue**: Transcript content might not structure cleanly into sections
**Mitigation**: Manual editing may be required after initial migration, prioritize accuracy over automation

### Risk 4: Screenshot Availability
**Likelihood**: High
**Impact**: Low
**Issue**: Original Virgin America screenshots may not be available
**Mitigation**: Use placeholders initially, create mockups in Figma, or use archived web screenshots

### Risk 5: Viewport Edge Cases
**Likelihood**: Medium
**Impact**: Medium
**Issue**: Unusual viewport sizes (foldables, ultra-wide) might break layout
**Mitigation**: Use container queries where applicable, test on multiple devices, add max-widths

---

## Recommended Execution Order

### Day 1: Phase 1 Foundation (3-5 hours)
1. Update CaseStudyNarrative hero section
2. Add blur orbs and atmospheric effects
3. Update metrics grid styling
4. Test on desktop viewport

### Day 2: Phase 1 Completion (2-4 hours)
1. Update/create CaseStudySection component
2. Add screenshot support (grid and large layouts)
3. Implement annotations
4. Full responsive testing
5. Visual comparison to design concept

### Day 3: Phase 2 Setup (2-3 hours)
1. Verify/update Sanity schema
2. Create content migration script
3. Structure Virgin America content
4. Initial migration run

### Day 4: Phase 2 Content (2-3 hours)
1. Add screenshots (or placeholders)
2. Refine content in Sanity Studio
3. End-to-end testing
4. Performance optimization

### Day 5: QA & Documentation (2-3 hours)
1. Full QA checklist
2. Mobile vs. slideshow comparison
3. Fix any remaining issues
4. Update documentation for content editors
5. Create guide for migrating additional case studies

**Total Estimated Time**: 10-16 hours across 5 days

---

## Success Metrics & Evaluation

### Quantitative Metrics
- Visual accuracy: 95%+ match to design concept
- Performance: Lighthouse score > 90
- Load time: FCP < 1.5s, LCP < 2.5s
- Responsive: No horizontal scroll on any viewport
- Accessibility: WCAG AA compliance

### Qualitative Metrics
- Mobile experience feels natural and intuitive
- Content hierarchy is clear and easy to follow
- Visual design feels premium and polished
- Story flows better than slideshow approach
- Content editing is straightforward in Sanity

### User Testing Questions
1. Can you easily navigate through the case study?
2. Is it clear what the project accomplished?
3. Do the metrics and achievements stand out?
4. Is the mobile experience better than a slideshow?
5. Would you prefer this layout for other case studies?

---

## Future Enhancements (Out of Scope)

### Phase 3 Possibilities
- Animated scroll effects (parallax, fade-ins)
- Interactive elements (hover states on metrics)
- Video backgrounds in hero section
- Reading progress indicator
- Table of contents sidebar
- "Share this section" functionality
- Print-friendly stylesheet

### Additional Case Studies
- Prioritize which case studies to migrate next
- Consider creating templates for different project types
- Build library of reusable section patterns

### Analytics Integration
- Track scroll depth
- Measure time spent on each section
- A/B test against slideshow approach
- Heatmap analysis of interactions

---

## Documentation & Handoff

### Files to Create/Update
- [ ] This implementation plan
- [ ] Component documentation (Storybook or README)
- [ ] Content editor guide for Sanity Studio
- [ ] Migration guide for additional case studies
- [ ] Update main CLAUDE.md with case study patterns

### Knowledge Transfer
- Demo new layout to stakeholders
- Train content editors on Sanity workflow
- Document design system patterns used
- Create video walkthrough of implementation

---

## Appendix: Technical Reference

### Key Files Modified
```
/src/components/CaseStudyNarrative.tsx          (major updates)
/src/components/CaseStudySection.tsx            (new/updated)
/sanity/schemas/project.ts                      (minor updates)
/scripts/migrate-virgin-america.ts              (new)
/docs/implementation-plans/narrative-scroll-*   (this file)
```

### Design System Tokens
```css
/* Colors */
--background-primary: #0a0a14
--background-secondary: #050510
--purple-primary: hsl(280, 100%, 80%)
--purple-light: hsl(276, 100%, 75%)
--text-muted: #a0a0a0
--text-body: #d0d0d0
--text-primary: #fafafa

/* Typography */
--font-heading: 'DM Sans', sans-serif
--font-body: 'Crimson Pro', serif

/* Spacing */
--section-padding: 8rem
--container-padding: 2rem
--gap-sm: 1rem
--gap-md: 2rem
--gap-lg: 4rem
```

### Component API Reference

**CaseStudyNarrative Props**:
```typescript
interface CaseStudyNarrativeProps {
  title: string
  subtitle?: string
  category?: string
  heroImage?: string
  metrics?: Metric[]
  achievements?: string[]
  overview?: Overview
  sections?: Section[]
  technologies?: string[]
}
```

**CaseStudySection Props**:
```typescript
interface CaseStudySectionProps {
  sectionLabel?: string
  heading: string
  content: PortableTextBlock[]
  screenshots?: Screenshot[]
  annotation?: Annotation
  index: number
}
```

---

## Conclusion

This plan provides a clear, actionable path to implementing the narrative scroll case study layout. By breaking the work into two distinct phases (static implementation and CMS integration), we can validate the design and user experience before committing to the content management infrastructure.

The estimated 12-18 hours of development time is realistic for a developer familiar with the codebase, and the comprehensive QA checklist ensures the final implementation matches the design concept's quality and vision.

**Next Steps**:
1. Review and approve this plan
2. Begin Phase 1.1: Update CaseStudyNarrative component
3. Schedule regular check-ins at phase boundaries
4. Conduct user testing after Phase 1 completion
