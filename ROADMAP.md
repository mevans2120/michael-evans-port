# Implementation Roadmap
## Progressive Reveal Design Concept

**Project**: Portfolio Design Update - Inline Progressive Reveal & Horizontal Case Studies
**Design Reference**: `design-concepts/concept-refined-purple-modal.html`
**Created**: 2025-10-24
**Status**: Planning Complete - Ready for Implementation Approval

---

## Executive Summary

This roadmap implements the approved design concept featuring:
- **Inline Progressive Reveal**: AI projects expand in full-screen modal (no navigation)
- **Horizontal Case Studies**: Slideshow-style scroll-snap sections
- **Purple Gradient Aesthetic**: Existing brand colors with Manrope typography
- **Sanity CMS Integration**: Uses existing data structures

**Total Effort**: ~1.4M tokens across 20 features
**Estimated Timeline**: 4 development phases

---

## Phase 1: Core AI Projects Components
**Effort**: 330k tokens (3 features) | **Priority**: High | **Status**: Planned

### AI-001: AIProjectsGrid Component [S - 100k tokens]
**Description**: Create grid component with minimal cards, purple dot CTA, hover effects

**Key Features**:
- Responsive grid layout (1 col mobile, 2-3 cols desktop)
- Minimal card design: project number, title, description
- Purple dot CTA that grows/glows on hover
- Framer Motion staggered animations
- Click handler to open modal

**Technical Details**:
- Component: `src/components/AIProjectsGrid.tsx`
- Props: `{ projects: AIProjectData[], onProjectClick: (project) => void, limit?: number }`
- Uses existing `AIProjectData` type from Sanity
- Purple gradient: `from-accent to-purple-400`

**Acceptance Criteria**:
- [ ] Grid displays correctly on all screen sizes
- [ ] Hover effects smooth and performant
- [ ] Purple dot CTA animates on hover
- [ ] Cards clickable and fire onClick handler
- [ ] TypeScript types properly defined

---

### AI-002: AIProjectModal Component [M - 150k tokens]
**Description**: Full-screen modal with purple gradient styling and rich project details

**Key Features**:
- Full-screen overlay with backdrop blur
- ESC key and click-outside-to-close
- Body scroll lock when open
- Sticky header with gradient title
- Sections: Overview, Tech Stack, Metrics, AI Components, Achievements
- "View Live Project" CTA button
- Smooth spring animations (400ms)

**Technical Details**:
- Component: `src/components/AIProjectModal.tsx`
- Props: `{ project: AIProjectData | null, isOpen: boolean, onClose: () => void }`
- Uses AnimatePresence for enter/exit transitions
- z-index: 100 (backdrop), 101 (modal content)
- Max width: 4xl, max height: 90vh, scroll overflow

**Acceptance Criteria**:
- [ ] Modal animates in/out smoothly
- [ ] ESC key closes modal
- [ ] Click outside closes modal
- [ ] Body scroll prevented when open
- [ ] All content sections display correctly
- [ ] Purple gradient styling matches design
- [ ] Accessible (ARIA labels, focus management)

**Dependencies**: AI-001 (grid should trigger modal)

---

### AI-003: Homepage AI Section Integration [S - 80k tokens]
**Description**: Replace BentoImageBehind with new components on homepage

**Changes Required**:
- File: `src/app/page.tsx`
- Remove: `<BentoImageBehind isDarkMode={isDarkMode} />`
- Add: State management for selected project and modal open state
- Add: `useAllAIProjects()` hook to fetch data
- Add: Loading/error UI states
- Add: Limit to 6 projects on homepage
- Add: "View all AI projects" link if more than 6 exist

**Technical Details**:
```tsx
const [selectedProject, setSelectedProject] = useState<AIProjectData | null>(null);
const [isModalOpen, setIsModalOpen] = useState(false);
const { data: aiProjects, loading, error } = useAllAIProjects();

// Handlers
const handleProjectClick = (project) => {
  setSelectedProject(project);
  setIsModalOpen(true);
};
const handleCloseModal = () => {
  setIsModalOpen(false);
  setTimeout(() => setSelectedProject(null), 300);
};
```

**Acceptance Criteria**:
- [ ] Homepage loads AI projects from Sanity
- [ ] Shows max 6 projects on homepage
- [ ] Loading state displays while fetching
- [ ] Error state shows if fetch fails
- [ ] Clicking project opens modal
- [ ] Modal can be closed via ESC, click outside, X button
- [ ] Link to /ai-showcase appears if >6 projects

**Dependencies**: AI-001, AI-002

---

## Phase 2: Case Study Slideshow
**Effort**: 490k tokens (4 features) | **Priority**: High | **Status**: Planned

### CS-001: CaseStudySlideshow Component [M - 180k tokens]
**Description**: Horizontal scroll-snap slideshow with slide navigation

**Key Features**:
- CSS scroll-snap (horizontal, mandatory)
- Keyboard navigation (arrow keys, Home, End)
- Touch gesture support (swipe left/right)
- Slide progress indicator
- Smooth scroll behavior
- Auto-height or full viewport height option

**Technical Details**:
- Component: `src/components/CaseStudySlideshow.tsx`
- Props: `{ slides: ReactNode[], showProgress?: boolean, fullHeight?: boolean }`
- CSS: `scroll-snap-type: x mandatory`, `overflow-x: auto`
- Each slide: `scroll-snap-align: start`, `flex-shrink: 0`, `width: 100vw`

**Acceptance Criteria**:
- [ ] Horizontal scroll-snap works smoothly
- [ ] Arrow keys navigate slides
- [ ] Touch swipe gestures work on mobile
- [ ] Progress indicator updates on scroll
- [ ] No scroll conflicts (horizontal vs vertical)
- [ ] Works on all browsers (fallback for no scroll-snap)

---

### CS-002: Case Study Section Components [M - 150k tokens]
**Description**: Reusable section components for case study slides

**Components to Create**:
- `CaseStudyHero`: Large title, subtitle, hero image
- `CaseStudyProblem`: Problem statement, context
- `CaseStudySolution`: Solution approach, methodology
- `CaseStudyMetrics`: Key metrics in grid layout
- `CaseStudyOutcomes`: Results, achievements
- `CaseStudyGallery`: Image carousel for screenshots

**Technical Details**:
- Each section fills viewport width
- Consistent purple accent styling
- Responsive layout (stacks on mobile)
- Optional props for customization
- All use design system colors/typography

**Acceptance Criteria**:
- [ ] All 6 section components created
- [ ] Each section responsive
- [ ] Purple gradient accents applied
- [ ] TypeScript props properly typed
- [ ] Consistent spacing/padding

**Dependencies**: CS-001 (sections render inside slideshow)

---

### CS-003: Case Study Page Template [S - 100k tokens]
**Description**: Update case study page to use horizontal slideshow

**Changes Required**:
- File: `src/app/case-studies/[slug]/page.tsx`
- Replace vertical scroll layout with `CaseStudySlideshow`
- Map Sanity project data to section components
- Render sections in slide order: Hero → Problem → Solution → Metrics → Outcomes → Gallery

**Technical Details**:
```tsx
export default function CaseStudyPage({ params }) {
  const { data: project } = useProject(params.slug);

  return (
    <CaseStudySlideshow>
      <CaseStudyHero {...project} />
      <CaseStudyProblem {...project.overview} />
      <CaseStudySolution {...project.overview} />
      <CaseStudyMetrics metrics={project.metrics} />
      <CaseStudyOutcomes achievements={project.achievements} />
      <CaseStudyGallery images={project.images} />
    </CaseStudySlideshow>
  );
}
```

**Acceptance Criteria**:
- [ ] Case study pages use new slideshow layout
- [ ] All sections render with Sanity data
- [ ] Slideshow navigation works
- [ ] Falls back gracefully if data missing
- [ ] Works for all existing case studies

**Dependencies**: CS-001, CS-002

---

### CS-004: Case Study Navigation UI [XS - 60k tokens]
**Description**: Add slide progress indicator and navigation controls

**Features**:
- Floating progress bar or dot indicator
- Left/right arrow buttons
- Section titles navigation (jump to specific slide)
- Keyboard shortcut hints

**Technical Details**:
- Overlay UI on slideshow (position: fixed or absolute)
- Updates based on scroll position
- Click dots/arrows to navigate
- Fade in on hover, fade out when idle

**Acceptance Criteria**:
- [ ] Progress indicator tracks current slide
- [ ] Arrow buttons navigate slides
- [ ] Section titles clickable (jump to slide)
- [ ] UI doesn't obstruct content
- [ ] Works on mobile (touch-friendly)

**Dependencies**: CS-001

---

## Phase 3: Testing & Polish
**Effort**: 490k tokens (7 features) | **Priority**: High/Medium | **Status**: Planned

### TEST-001: Component Unit Tests [S - 120k tokens]
**Description**: Unit tests for all new components

**Test Coverage**:
- AIProjectsGrid: rendering, click handlers, limit prop, animations
- AIProjectModal: open/close, ESC key, click outside, scroll lock, content sections
- CaseStudySlideshow: navigation, keyboard, scroll-snap, progress

**Technical Details**:
- Framework: Jest + React Testing Library
- Location: `src/components/__tests__/`
- Coverage target: >80%
- Test interactions, edge cases, accessibility

**Acceptance Criteria**:
- [ ] All components have unit tests
- [ ] Coverage >80%
- [ ] Tests pass in CI
- [ ] Edge cases covered

**Dependencies**: AI-001, AI-002, CS-001

---

### TEST-002: Integration Tests [M - 150k tokens]
**Description**: E2E tests for user flows

**Test Scenarios**:
- Homepage: Load projects → Click card → Modal opens → Close modal
- AI Showcase: Load all projects → Filter/search → Open modal
- Case Study: Load page → Navigate slides → Keyboard navigation → Touch gestures

**Technical Details**:
- Framework: Playwright
- Location: `tests/e2e/`
- Test on Chrome, Firefox, Safari
- Mobile viewport testing

**Acceptance Criteria**:
- [ ] All user flows tested
- [ ] Tests pass on all browsers
- [ ] Mobile tests pass
- [ ] CI integration working

**Dependencies**: AI-003, CS-003

---

### TEST-003: Accessibility Audit [S - 100k tokens]
**Description**: WCAG 2.1 AA compliance audit

**Audit Checklist**:
- Keyboard navigation (tab order, ESC, arrows)
- Screen reader compatibility (ARIA labels, roles, live regions)
- Focus management (modal traps focus, returns on close)
- Color contrast (4.5:1 minimum for text)
- Motion preferences (`prefers-reduced-motion`)

**Technical Details**:
- Tools: axe-core, NVDA, VoiceOver
- Test with keyboard only (no mouse)
- Test with screen reader enabled
- Validate ARIA attributes

**Acceptance Criteria**:
- [ ] No axe-core violations
- [ ] Keyboard navigation works fully
- [ ] Screen reader announces correctly
- [ ] Color contrast passes WCAG AA
- [ ] Motion can be reduced

**Dependencies**: ALL (tests all components)

---

### PERF-001: Animation Performance [XS - 50k tokens]
**Description**: Optimize animations for 60fps

**Optimizations**:
- Use transform/opacity only (no layout changes)
- Add `will-change` hints for animated elements
- Reduce animation complexity on low-end devices
- Profile with Chrome DevTools Performance tab

**Acceptance Criteria**:
- [ ] Animations run at 60fps
- [ ] No layout thrashing
- [ ] Smooth on mobile devices
- [ ] No janky scrolling

**Dependencies**: AI-001, AI-002, CS-001

---

### PERF-002: Lazy Loading Images [XS - 40k tokens]
**Description**: Lazy load project images

**Implementation**:
- Use Next.js `<Image>` component
- Set `loading="lazy"`
- Add blur placeholders
- Lazy load images in grid and slideshow

**Acceptance Criteria**:
- [ ] Images load on demand
- [ ] Blur placeholders shown
- [ ] Faster initial page load
- [ ] Lighthouse score improved

**Dependencies**: AI-001, CS-001

---

### RESP-001: Mobile Responsive Testing [S - 80k tokens]
**Description**: Test and refine responsive behavior

**Test Matrix**:
- Devices: iPhone (iOS), Android phones, tablets
- Orientations: Portrait, landscape
- Screen sizes: 320px to 1920px
- Browsers: Safari, Chrome, Firefox mobile

**Refinements Needed**:
- Grid: Adjust padding/spacing on small screens
- Modal: Ensure readable at all sizes
- Slideshow: Touch gestures work smoothly
- Typography: Scale appropriately

**Acceptance Criteria**:
- [ ] Works on iOS Safari
- [ ] Works on Android Chrome
- [ ] Works on tablets
- [ ] No horizontal overflow
- [ ] Touch gestures smooth

**Dependencies**: ALL

---

### RESP-002: Touch Gesture Support [S - 90k tokens]
**Description**: Add swipe gestures for mobile

**Features**:
- Swipe left/right on slideshow to navigate
- Swipe down on modal to dismiss
- Prevent scroll conflicts
- Velocity-based swipe detection

**Technical Details**:
- Use `touchstart`, `touchmove`, `touchend` events
- Calculate swipe velocity and direction
- Minimum swipe distance threshold
- Cancel if vertical scroll detected

**Acceptance Criteria**:
- [ ] Swipe left/right navigates slideshow
- [ ] Swipe down dismisses modal
- [ ] No scroll conflicts
- [ ] Feels native and responsive

**Dependencies**: AI-002, CS-001

---

## Phase 4: CMS & Documentation
**Effort**: 240k tokens (4 features) | **Priority**: Medium/Low | **Status**: Backlog

### SANITY-001: Sanity Schema Validation [XS - 50k tokens]
**Description**: Validate schemas support all required fields

**Schema Checks**:
- `aiProject`: Verify subtitle, metrics, aiComponents, achievements exist
- `project`: Verify images array, overview.problem, overview.solution exist
- Check image asset references work
- Validate required vs optional fields

**Acceptance Criteria**:
- [ ] All required fields present in schemas
- [ ] Fields properly typed
- [ ] Image references work
- [ ] No breaking changes needed

---

### SANITY-002: Content Migration [M - 120k tokens]
**Description**: Migrate existing content if schema changes needed

**Migration Tasks**:
- Add missing fields to existing projects
- Populate placeholder data where needed
- Update image references
- Test data in new components

**Acceptance Criteria**:
- [ ] All existing projects migrated
- [ ] No data loss
- [ ] Components display migrated data correctly

**Dependencies**: SANITY-001

---

### DOC-001: Component Documentation [XS - 40k tokens]
**Description**: Add JSDoc comments and usage examples

**Documentation Needed**:
- All component props with descriptions
- Usage examples in comments
- Edge cases and gotchas
- Integration patterns

**Acceptance Criteria**:
- [ ] All components documented
- [ ] Props described in JSDoc
- [ ] Usage examples provided
- [ ] TypeScript types exported

**Dependencies**: AI-001, AI-002, CS-001, CS-002

---

### DOC-002: Implementation Guide [XS - 30k tokens]
**Description**: Architecture guide for future developers

**Guide Contents**:
- Design decisions rationale
- How to extend/modify patterns
- Adding new modal sections
- Adding new slideshow section types
- Best practices

**Acceptance Criteria**:
- [ ] Guide created in Markdown
- [ ] Covers key architectural decisions
- [ ] Explains how to extend
- [ ] Includes code examples

**Dependencies**: ALL

---

## Implementation Strategy

### Recommended Approach

**Week 1: Phase 1 (AI Projects)**
- Day 1-2: Build AIProjectsGrid and AIProjectModal components
- Day 3: Integrate into homepage
- Day 4: Test and refine, fix any issues
- Day 5: Update /ai-showcase page

**Week 2: Phase 2 (Case Studies)**
- Day 1-2: Build CaseStudySlideshow component
- Day 3: Create section components
- Day 4: Update case study template
- Day 5: Add navigation UI

**Week 3: Phase 3 (Testing & Polish)**
- Day 1-2: Write unit and integration tests
- Day 3: Accessibility audit and fixes
- Day 4: Performance optimization
- Day 5: Responsive testing and refinement

**Week 4: Phase 4 (CMS & Docs)**
- Day 1: Validate Sanity schemas
- Day 2-3: Migrate content if needed
- Day 4: Write documentation
- Day 5: Final review and deployment

### Dependencies Graph

```
Phase 1:
AI-001 (Grid) → AI-002 (Modal) → AI-003 (Homepage) → AI-004 (Showcase)

Phase 2:
CS-001 (Slideshow) → CS-002 (Sections) → CS-003 (Template)
CS-001 → CS-004 (Navigation)

Phase 3:
AI-001,AI-002,CS-001 → TEST-001 (Unit Tests)
AI-003,CS-003 → TEST-002 (Integration Tests)
ALL → TEST-003 (Accessibility)
AI-001,AI-002,CS-001 → PERF-001 (Animation)
AI-001,CS-001 → PERF-002 (Images)
ALL → RESP-001 (Mobile)
AI-002,CS-001 → RESP-002 (Touch)

Phase 4:
SANITY-001 → SANITY-002
AI-001,AI-002,CS-001,CS-002 → DOC-001
ALL → DOC-002
```

---

## Risk Assessment

### High Risk
- **Scroll-snap browser compatibility** (CS-001)
  - Mitigation: Provide fallback navigation, test on all major browsers

- **Touch gesture conflicts with native scroll** (RESP-002)
  - Mitigation: Careful event handling, test extensively on mobile

### Medium Risk
- **Sanity schema changes breaking existing data** (SANITY-002)
  - Mitigation: Validate schema first, migrate carefully, backup data

- **Animation performance on low-end devices** (PERF-001)
  - Mitigation: Use CSS transforms only, test on older devices, provide reduced motion option

### Low Risk
- **Component reusability** (ALL)
  - Mitigation: Good TypeScript types, clear props interface, documentation

---

## Success Metrics

**User Experience**:
- Modal opens in <300ms
- Slideshow scrolls smoothly at 60fps
- No layout shift during interactions
- Lighthouse score >90

**Code Quality**:
- Test coverage >80%
- No TypeScript errors
- WCAG 2.1 AA compliant
- Zero critical accessibility violations

**Performance**:
- First Contentful Paint <1.5s
- Time to Interactive <3s
- Cumulative Layout Shift <0.1

---

## Next Steps

1. **Review and Approve**: Review this roadmap and provide feedback
2. **Prioritize**: Confirm phase priorities or adjust
3. **Start Implementation**: Begin Phase 1 when approved
4. **Track Progress**: Update feature status in `features.csv` as work progresses
5. **Regular Check-ins**: Review progress after each phase

---

## Questions for Stakeholder

Before starting implementation:

1. **Phasing**: Does the 4-phase approach work for your timeline?
2. **Priorities**: Any features to prioritize/deprioritize?
3. **Sanity Data**: Do you have AI projects and case studies ready in Sanity?
4. **Testing**: What's your preferred testing approach (manual vs automated)?
5. **Timeline**: Is the suggested 4-week timeline realistic for your needs?

---

**Feature Registry**: `features.csv` (20 features tracked)
**Design Reference**: `design-concepts/concept-refined-purple-modal.html`
**Total Effort**: ~1.4M tokens
**Completion**: 0% (Planning complete, implementation pending approval)
