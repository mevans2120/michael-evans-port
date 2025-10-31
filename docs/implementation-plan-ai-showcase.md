# AI Showcase Pages Implementation Plan
**Three Scrolling Slides Pages: AI Workflow, PostPal, and Marketing Sites**

## Executive Summary

This plan outlines the implementation of three new AI showcase pages based on the scrolling slides design pattern. Each page features full-viewport scrolling sections with scroll-snap behavior, horizontal scrolling timelines/workflows, and a consistent dark purple-gradient aesthetic using Syne font for headings.

### Quick Overview
- **Timeline**: 4-6 weeks total across 5 phases
- **Approach**: Build new components from scratch (existing CMS components don't match scrolling slides design)
- **Architecture**: Sanity CMS for content management, Next.js App Router pages, new React components
- **Dependencies**: Phases must be completed sequentially due to content/schema dependencies

---

## Phase 1: Sanity Schema Design & Setup
**Duration**: 1 week | **Priority**: Critical (Foundation)

### Objectives
Create comprehensive Sanity schemas that support the scrolling slides content structure for all three showcase types.

### Tasks

#### 1.1 Create Base AI Showcase Schema (`aiShowcase.ts`)
**What**: Core schema for AI showcase pages with shared fields
**Why**: All three pages share common patterns (hero, slides, metrics, horizontal sections)

```typescript
// Key fields needed:
- title: string (required)
- slug: slug (required, source: title)
- category: 'ai-workflow' | 'healthcare-ai' | 'marketing-sites'
- featured: boolean
- order: number
- heroSection: object
  - badge: string
  - title: string
  - subtitle: string
  - summary: text
- slides: array of slideSection objects
- metrics: array of metric objects
- callToAction: object
```

#### 1.2 Create Slide Section Schema
**What**: Flexible schema for content slides with multiple layout options
**Why**: Each slide has different content types (text, quotes, metrics, images)

```typescript
// Slide types:
- Standard content slide
- Quote/pullquote slide
- Metrics grid slide
- Visual showcase slide
- Horizontal scrolling slide (timeline/workflow/projects)
```

#### 1.3 Create Horizontal Section Schemas
**What**: Specialized schemas for horizontal scrolling content
**Why**: Each showcase has unique horizontal scrolling content

**AI Workflow**: Timeline phases
```typescript
- phase: string (e.g., "Spring 2024")
- title: string
- description: text
- order: number
```

**PostPal**: Workflow steps
```typescript
- stepNumber: number
- title: string
- description: text
- icon: string (optional)
```

**Marketing Sites**: Project cards
```typescript
- projectName: string
- projectType: string
- description: text
- technologies: array of strings
- icon: string
```

#### 1.4 Create Related Schemas
**What**: Supporting content types

- `metricCard`: For metrics grids
- `quoteBox`: For pullquote sections
- `visualCard`: For image placeholders/screenshots
- `comparisonBox`: For before/after, problem/solution layouts

#### 1.5 Schema Registration
**What**: Import all schemas into `sanity.config.ts`
**Why**: Make them available in Sanity Studio

**Files to modify**:
- `/sanity/schemas/aiShowcase.ts` (new)
- `/sanity/schemas/timelinePhase.ts` (new)
- `/sanity/schemas/workflowStep.ts` (new)
- `/sanity/schemas/projectCard.ts` (new)
- `/sanity/schemas/index.ts` (update)
- `/sanity.config.ts` (update)

### Acceptance Criteria
- [ ] All schemas created with proper TypeScript types
- [ ] Schemas appear in Sanity Studio (http://localhost:3000/studio)
- [ ] Can create/edit AI showcase documents in Studio
- [ ] Field validations work (required fields, min/max values)
- [ ] Preview functionality shows correct titles/subtitles

### Dependencies
- None (foundation phase)

### Risks
- Schema changes after content import require migration
- **Mitigation**: Review content specs thoroughly before finalizing schemas

---

## Phase 2: Component Architecture
**Duration**: 1.5 weeks | **Priority**: Critical (Core UI)

### Objectives
Build reusable React components for the scrolling slides pattern and all content variations.

### Tasks

#### 2.1 Core Layout Components

**File**: `/src/components/ai-showcase/ScrollingSlidesLayout.tsx`
**Purpose**: Main page wrapper with scroll-snap, navigation dots, and atmospheric gradients

```typescript
Features:
- Full-viewport sections with scroll-snap-align: start
- Fixed navigation dots (right side, tracks active slide)
- Animated gradient orbs in background
- Smooth scroll behavior
```

**File**: `/src/components/ai-showcase/SlideNavigation.tsx`
**Purpose**: Fixed navigation dots that update on scroll

```typescript
Features:
- IntersectionObserver to track active slide
- Click to scroll to specific slide
- Active state with purple glow
- Responsive (hidden on mobile)
```

#### 2.2 Slide Type Components

**File**: `/src/components/ai-showcase/HeroSlide.tsx`
**Purpose**: Hero section (Slide 1 for all showcases)

```typescript
Features:
- Badge (pill-shaped with purple border)
- Large gradient title (Syne font, 3rem-6rem responsive)
- Subtitle (1.25rem-1.75rem)
- Summary text
- Centered layout
- Fade-in animations
```

**File**: `/src/components/ai-showcase/ContentSlide.tsx`
**Purpose**: Standard text content slides

```typescript
Features:
- Section label (uppercase, purple, with gradient line)
- Heading (Syne font, 2.5rem-4.5rem)
- Portable Text content rendering
- Optional quote box
- Optional visual grid
- Max-width 900px container
```

**File**: `/src/components/ai-showcase/MetricsSlide.tsx`
**Purpose**: Metrics grid showcase

```typescript
Features:
- Grid layout (auto-fit, min 220px)
- Metric cards with hover effects
- Large gradient numbers (Syne font)
- Label and description
- Purple gradient background on cards
```

#### 2.3 Horizontal Scrolling Components

**File**: `/src/components/ai-showcase/HorizontalTimelineSlide.tsx`
**Purpose**: Horizontal scrolling section with timeline spine

```typescript
Features:
- Horizontal scroll container with snap points
- Visual spine line (gradient)
- Timeline nodes (circular with purple glow)
- Cards that transform on hover
- Scroll hint with animated arrow
- Custom scrollbar styling
```

**File**: `/src/components/ai-showcase/TimelinePhase.tsx`
**Purpose**: Individual timeline phase card

```typescript
Features:
- Phase number/date label
- Title (Syne font)
- Description text
- Hover effects (glow, lift)
- Min-width 500px (400px tablet, 90vw mobile)
```

**File**: `/src/components/ai-showcase/WorkflowStep.tsx`
**Purpose**: Numbered workflow step card (PostPal)

```typescript
Features:
- Numbered node (1, 2, 3, 4)
- Title and description
- Same hover effects as timeline
```

**File**: `/src/components/ai-showcase/ProjectCard.tsx`
**Purpose**: Project showcase card (Marketing Sites)

```typescript
Features:
- Project icon (emoji or image)
- Project name and type
- Description
- Technology pills
- Hover effects
```

#### 2.4 Content Block Components

**File**: `/src/components/ai-showcase/QuoteBox.tsx`
**Purpose**: Pullquote with purple accent

```typescript
Features:
- Purple left border (4px)
- Light purple background
- Italic text, larger font
- Attribution line
```

**File**: `/src/components/ai-showcase/VisualGrid.tsx`
**Purpose**: Grid of visual placeholders/screenshots

```typescript
Features:
- 2-column grid (auto-fit, min 350px)
- Aspect ratio 16/10
- Purple gradient backgrounds
- Caption support
```

**File**: `/src/components/ai-showcase/ComparisonGrid.tsx`
**Purpose**: Before/after or problem/solution layout

```typescript
Features:
- 2-3 column grid (auto-fit, min 280px)
- Labeled boxes (floating label at top)
- Stat display support
- Hover effects
```

#### 2.5 Font Integration

**File**: `/src/app/layout.tsx` (modify)
**Purpose**: Add Syne font from Google Fonts

```typescript
import { Syne, Inter } from 'next/font/google'

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-syne'
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
})
```

**File**: `/tailwind.config.ts` (modify)
**Purpose**: Add Syne to theme

```typescript
fontFamily: {
  sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
  serif: ['var(--font-serif)', 'Georgia', 'serif'],
  syne: ['var(--font-syne)', 'sans-serif'], // NEW
}
```

### Acceptance Criteria
- [ ] All components render with correct styling
- [ ] Scroll-snap behavior works smoothly
- [ ] Navigation dots track active slide
- [ ] Horizontal scrolling works on all devices
- [ ] Hover effects animate smoothly
- [ ] Components are fully responsive (mobile-first)
- [ ] TypeScript types are strict and correct
- [ ] Syne font loads and displays correctly

### Dependencies
- Phase 1 (need schema structure to inform component props)

### Risks
- Scroll-snap can be buggy across browsers
- **Mitigation**: Test on Chrome, Safari, Firefox; provide fallback smooth scroll
- Horizontal scroll UX on mobile can be tricky
- **Mitigation**: Test with touch devices, ensure scroll hint is visible

---

## Phase 3: Content Import Scripts
**Duration**: 1 week | **Priority**: High (Content Migration)

### Objectives
Create scripts to import content from markdown specs into Sanity CMS.

### Tasks

#### 3.1 Create Import Script Framework

**File**: `/scripts/import-ai-showcase.ts`
**Purpose**: Main script to parse markdown and create Sanity documents

```typescript
Features:
- Read markdown content spec files
- Parse sections and extract structured data
- Map to Sanity schema format
- Upload to Sanity with validation
- Handle portable text conversion
```

#### 3.2 Content Mapping Functions

**Create mappers for**:
- Hero section → Sanity heroSection object
- Content sections → slideSection array
- Metrics → metric objects
- Timeline phases → timelinePhase objects
- Workflow steps → workflowStep objects
- Project cards → projectCard objects

#### 3.3 Import Individual Showcases

**Script 1**: Import AI Workflow Showcase
```bash
npm run import:ai-workflow
```
**Source**: `/docs/content-specs/ai-workflow-showcase.md`

**Script 2**: Import PostPal Showcase
```bash
npm run import:postpal
```
**Source**: `/docs/content-specs/postpal-showcase.md`

**Script 3**: Import Marketing Sites Showcase
```bash
npm run import:marketing-sites
```
**Source**: `/docs/content-specs/marketing-sites-showcase.md`

#### 3.4 Validation & Testing

**Create validation script**:
- Verify all required fields present
- Check portable text is valid
- Ensure images referenced exist
- Validate slide order is correct

**File**: `/scripts/validate-ai-showcase.ts`

### Files to Create
- `/scripts/import-ai-showcase.ts`
- `/scripts/utils/markdown-parser.ts`
- `/scripts/utils/sanity-mapper.ts`
- `/scripts/validate-ai-showcase.ts`
- `/package.json` (add scripts)

### Acceptance Criteria
- [ ] Scripts run without errors
- [ ] All three showcases imported to Sanity
- [ ] Content matches markdown specs
- [ ] Images/references are correctly linked
- [ ] Can view content in Sanity Studio
- [ ] Validation script passes all checks

### Dependencies
- Phase 1 (schemas must exist)

### Risks
- Markdown parsing edge cases
- **Mitigation**: Test with all three content specs, handle variations
- Portable text conversion complexity
- **Mitigation**: Use Sanity's block content tools, test rendering

---

## Phase 4: Page Implementation
**Duration**: 1.5 weeks | **Priority**: High (User-Facing)

### Objectives
Build the three Next.js pages using components and fetching content from Sanity.

### Tasks

#### 4.1 Create Page Routes

**File**: `/src/app/(public)/ai-showcase/[slug]/page.tsx`
**Purpose**: Dynamic route for all three AI showcase pages

```typescript
Features:
- Dynamic params: 'ai-workflow', 'postpal', 'marketing-sites'
- Fetch showcase data from Sanity by slug
- Render appropriate components based on content type
- Server-side rendering for SEO
- Error handling for 404
```

#### 4.2 Create Sanity Queries

**File**: `/src/lib/sanity/queries/aiShowcase.ts`
**Purpose**: GROQ queries to fetch showcase content

```typescript
Queries:
- getAiShowcaseBySlug(slug: string)
- getAiShowcaseList() // for navigation/discovery
- getTimelinePhases(showcaseId: string)
- getWorkflowSteps(showcaseId: string)
- getProjectCards(showcaseId: string)
```

#### 4.3 Implement AI Workflow Page

**Route**: `/ai-showcase/ai-workflow`

**Slides needed**:
1. Hero (title, tagline, summary)
2. "Oh Shit" Moment (content + quote)
3. Horizontal Timeline (6 phases: Early 2024 → Present)
4. Methodology (content + quote)
5. Tools (content + visual grid)
6. Impact (metrics grid)

**Components used**:
- ScrollingSlidesLayout
- HeroSlide
- ContentSlide (×3)
- HorizontalTimelineSlide
- MetricsSlide

#### 4.4 Implement PostPal Page

**Route**: `/ai-showcase/postpal`

**Slides needed**:
1. Hero
2. The Problem (content + comparison grid)
3. Horizontal Workflow (4 steps: Upload → Extract → Generate → Engage)
4. Technical Architecture (content + tech pills)
5. Innovation (comparison grid - 4 boxes)
6. Impact (metrics grid)

**Components used**:
- ScrollingSlidesLayout
- HeroSlide
- ContentSlide (×2)
- HorizontalTimelineSlide (workflow variant)
- ComparisonGrid
- MetricsSlide

#### 4.5 Implement Marketing Sites Page

**Route**: `/ai-showcase/marketing-sites`

**Slides needed**:
1. Hero
2. The Hypothesis (content + comparison grid)
3. Horizontal Projects (3 cards: DOA, Opal Creek, Karuna Gatton)
4. Process (content + quote + visual grid)
5. Human-AI Collaboration (comparison grid - 3 boxes)
6. Impact (metrics grid + visual grid)

**Components used**:
- ScrollingSlidesLayout
- HeroSlide
- ContentSlide (×2)
- HorizontalTimelineSlide (projects variant)
- ComparisonGrid
- MetricsSlide

#### 4.6 Add Navigation/Discovery

**File**: `/src/app/(public)/ai-showcase/page.tsx`
**Purpose**: Landing page listing all AI showcases

```typescript
Features:
- Grid of showcase cards
- Filter by category (optional)
- Featured sorting
- Link to individual showcases
```

**File**: Update site navigation (if needed)
**Purpose**: Add "AI Showcase" to main menu

### Acceptance Criteria
- [ ] All three pages render correctly
- [ ] Content loads from Sanity CMS
- [ ] Scroll behavior works smoothly
- [ ] Navigation dots function properly
- [ ] Horizontal sections scroll correctly
- [ ] All images/media load
- [ ] Mobile responsive on all devices
- [ ] SEO metadata present (title, description, OG tags)
- [ ] Pages are accessible (WCAG AA)

### Dependencies
- Phase 2 (components must exist)
- Phase 3 (content must be imported)

### Risks
- Performance with large images
- **Mitigation**: Use Next.js Image optimization, lazy loading
- Scroll performance on lower-end devices
- **Mitigation**: Test on older devices, optimize animations

---

## Phase 5: Testing, Polish & Launch
**Duration**: 1 week | **Priority**: Critical (Quality)

### Objectives
Ensure pages are production-ready with comprehensive testing and polish.

### Tasks

#### 5.1 Functional Testing

**Test Cases**:
- [ ] All three pages load without errors
- [ ] Scroll-snap behavior consistent across browsers
- [ ] Navigation dots highlight correctly
- [ ] Horizontal scrolling smooth and intuitive
- [ ] All links work (internal and external)
- [ ] Content renders correctly (no missing sections)
- [ ] Images load and display properly
- [ ] Metrics/stats display correctly

**Browsers to test**:
- Chrome (latest)
- Safari (macOS and iOS)
- Firefox (latest)
- Edge (latest)
- Mobile Safari (iOS)
- Mobile Chrome (Android)

#### 5.2 Performance Optimization

**Metrics to optimize**:
- Lighthouse Performance score > 90
- First Contentful Paint < 1.5s
- Largest Contentful Paint < 2.5s
- Cumulative Layout Shift < 0.1
- Time to Interactive < 3.5s

**Optimizations**:
- [ ] Optimize images (WebP, proper sizing)
- [ ] Lazy load off-screen content
- [ ] Minimize bundle size (check with `npm run build`)
- [ ] Use server components where possible
- [ ] Preload critical fonts
- [ ] Optimize scroll animations for 60fps

#### 5.3 Accessibility Testing

**WCAG AA Compliance**:
- [ ] Keyboard navigation works (tab through slides)
- [ ] Skip links present for keyboard users
- [ ] Focus indicators visible
- [ ] Color contrast ratios meet standards (4.5:1 text, 3:1 UI)
- [ ] Alt text on all images
- [ ] ARIA labels on interactive elements
- [ ] Screen reader compatibility (test with VoiceOver/NVDA)
- [ ] No auto-playing animations (respect prefers-reduced-motion)

**Tools**:
- Lighthouse accessibility audit
- axe DevTools
- Manual screen reader testing

#### 5.4 SEO Optimization

**SEO Checklist**:
- [ ] Unique title tags (< 60 chars)
- [ ] Meta descriptions (< 160 chars)
- [ ] Open Graph tags (title, description, image)
- [ ] Twitter Card tags
- [ ] Canonical URLs
- [ ] Structured data (Article schema)
- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] Internal linking strategy

**Generate sitemap entry** for:
- `/ai-showcase`
- `/ai-showcase/ai-workflow`
- `/ai-showcase/postpal`
- `/ai-showcase/marketing-sites`

#### 5.5 Content Review

**Review with stakeholder**:
- [ ] Content accuracy (compare to specs)
- [ ] Tone and voice consistent
- [ ] No typos or grammatical errors
- [ ] Metrics/stats accurate
- [ ] Images appropriate and high-quality
- [ ] CTAs clear and compelling
- [ ] Photography placeholders noted for future replacement

#### 5.6 Polish & Refinements

**Visual Polish**:
- [ ] Animation timing feels smooth
- [ ] Hover states consistent
- [ ] Spacing/padding consistent
- [ ] Typography hierarchy clear
- [ ] Color consistency (purple gradients)
- [ ] Loading states for async content
- [ ] Error states for failed loads

**UX Improvements**:
- [ ] Add scroll progress indicator (optional)
- [ ] Improve horizontal scroll hint visibility
- [ ] Test scroll behavior on trackpads vs mice
- [ ] Ensure touch scrolling works well on mobile
- [ ] Add "Back to top" functionality (optional)

#### 5.7 Documentation

**Create documentation**:
- [ ] Component usage guide (`/docs/components/ai-showcase.md`)
- [ ] Content editing guide for Sanity (`/docs/sanity/ai-showcase-editing.md`)
- [ ] Deployment checklist
- [ ] Known issues and workarounds

#### 5.8 Deployment

**Pre-deployment**:
- [ ] Run full test suite
- [ ] Build succeeds without warnings
- [ ] Environment variables configured
- [ ] Sanity dataset set to production
- [ ] Analytics tracking added (if applicable)

**Deployment steps**:
- [ ] Deploy to staging environment
- [ ] Smoke test all three pages
- [ ] Get final stakeholder approval
- [ ] Deploy to production
- [ ] Verify in production
- [ ] Monitor for errors (check logs)

### Acceptance Criteria
- [ ] All tests pass
- [ ] Performance scores meet targets
- [ ] Accessibility audit passes
- [ ] SEO fundamentals in place
- [ ] Content reviewed and approved
- [ ] Documentation complete
- [ ] Successfully deployed to production
- [ ] No critical bugs in production

### Dependencies
- Phase 4 (pages must be implemented)

### Risks
- Performance regressions hard to catch
- **Mitigation**: Automated Lighthouse CI, performance budgets
- Browser compatibility issues surface late
- **Mitigation**: Test early and often, use feature detection

---

## Technical Architecture Summary

### Component Hierarchy

```
ScrollingSlidesLayout
├─ SlideNavigation (fixed, right side)
├─ HeroSlide
├─ ContentSlide (multiple)
│  ├─ QuoteBox (optional)
│  └─ VisualGrid (optional)
├─ HorizontalTimelineSlide
│  └─ TimelinePhase / WorkflowStep / ProjectCard (multiple)
└─ MetricsSlide
   └─ MetricCard (grid of cards)
```

### Sanity Schema Hierarchy

```
aiShowcase (document)
├─ heroSection (object)
├─ slides (array of slideSection)
│  ├─ contentSlide
│  ├─ horizontalSlide
│  └─ metricsSlide
├─ horizontalContent (array, type varies by showcase)
│  ├─ timelinePhase (AI Workflow)
│  ├─ workflowStep (PostPal)
│  └─ projectCard (Marketing Sites)
└─ metadata (featured, order, etc.)
```

### Technology Stack

**Frontend**:
- Next.js 15.5 (App Router)
- React 18.3
- TypeScript 5.8
- Tailwind CSS 3.4
- Syne font (Google Fonts)
- Inter font (body text)

**CMS**:
- Sanity CMS (Project ID: 5n331bys)
- Portable Text for rich content
- Image CDN for optimized images

**Styling Approach**:
- Tailwind utility classes (preferred)
- CSS custom properties for brand colors
- CSS-in-JS for dynamic styles (scroll animations)

**Key Libraries**:
- @portabletext/react (content rendering)
- next/image (image optimization)
- Intersection Observer API (slide tracking)

---

## File Structure

```
/src/app/(public)/ai-showcase/
├─ page.tsx                          # Showcase listing page
└─ [slug]/
   └─ page.tsx                       # Dynamic showcase page

/src/components/ai-showcase/
├─ ScrollingSlidesLayout.tsx         # Main layout wrapper
├─ SlideNavigation.tsx               # Navigation dots
├─ HeroSlide.tsx                     # Hero section
├─ ContentSlide.tsx                  # Standard content
├─ MetricsSlide.tsx                  # Metrics grid
├─ HorizontalTimelineSlide.tsx       # Horizontal scrolling
├─ TimelinePhase.tsx                 # Timeline card
├─ WorkflowStep.tsx                  # Workflow step card
├─ ProjectCard.tsx                   # Project card
├─ QuoteBox.tsx                      # Pullquote
├─ VisualGrid.tsx                    # Image grid
└─ ComparisonGrid.tsx                # Comparison layout

/src/lib/sanity/queries/
└─ aiShowcase.ts                     # Sanity GROQ queries

/sanity/schemas/
├─ aiShowcase.ts                     # Main showcase schema
├─ timelinePhase.ts                  # Timeline phase
├─ workflowStep.ts                   # Workflow step
├─ projectCard.ts                    # Project card
└─ index.ts                          # Schema exports

/scripts/
├─ import-ai-showcase.ts             # Main import script
├─ utils/
│  ├─ markdown-parser.ts             # Markdown parsing
│  └─ sanity-mapper.ts               # Content mapping
└─ validate-ai-showcase.ts           # Validation

/docs/
├─ components/ai-showcase.md         # Component guide
└─ sanity/ai-showcase-editing.md     # Content editing guide
```

---

## Design Tokens

### Colors
```css
/* Purple Gradients */
--purple-gradient-light: linear-gradient(135deg, #a855f7, #f0f0f0);
--purple-gradient-dark: linear-gradient(135deg, #a855f7, #c084f5);

/* Backgrounds */
--bg-dark-primary: #0a0a14;
--bg-dark-secondary: #12101d;
--bg-dark-tertiary: #0d0a18;
--bg-purple-glow: rgba(147, 51, 234, 0.15);

/* Borders */
--border-purple: rgba(147, 51, 234, 0.3);
--border-purple-hover: rgba(147, 51, 234, 0.6);

/* Text */
--text-primary: #f0f0f0;
--text-secondary: #c0c0c0;
--text-tertiary: #a0a0a0;
--text-muted: #808080;
--text-purple: #c084f5;
```

### Typography
```css
/* Headings (Syne font) */
--font-hero: clamp(3rem, 8vw, 6rem);
--font-heading-large: clamp(2.5rem, 6vw, 4.5rem);
--font-heading-medium: clamp(2rem, 5vw, 3.5rem);

/* Body (Inter font) */
--font-subtitle: clamp(1.25rem, 3vw, 1.75rem);
--font-body-large: 1.125rem;
--font-body: 1rem;
--font-small: 0.875rem;
--font-tiny: 0.75rem;

/* Line Heights */
--line-height-tight: 1.1;
--line-height-normal: 1.6;
--line-height-relaxed: 1.8;
```

### Spacing
```css
/* Sections */
--section-padding-y: 8rem;  /* py-32 */
--section-padding-x: 2rem;  /* px-8 */

/* Cards */
--card-padding: 2.5rem;     /* p-10 */
--card-gap: 2rem;           /* gap-8 */

/* Timeline */
--timeline-gap: 4rem;       /* gap-16 */
--timeline-card-width: 500px;
```

### Animations
```css
/* Scroll Behavior */
scroll-behavior: smooth;
scroll-snap-type: y mandatory;
scroll-snap-align: start;

/* Transitions */
--transition-default: 300ms ease;
--transition-slow: 400ms ease;

/* Hover Effects */
transform: translateY(-8px);
box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
```

---

## Constraints & Considerations

### Technical Constraints
- Must work with existing Sanity setup (Project ID: 5n331bys)
- Use Next.js App Router patterns (no Pages Router)
- TypeScript strict mode required
- Must maintain existing site navigation/layout

### Design Constraints
- Follow scrolling slides pattern from HTML concepts
- Use Syne font for headings (new addition)
- Maintain purple gradient brand aesthetic
- Full-viewport slides with scroll-snap
- Horizontal scrolling sections must work on mobile

### Performance Constraints
- Core Web Vitals compliance
- Lighthouse Performance > 90
- Images optimized with Next.js Image
- Lazy load off-screen content
- Bundle size monitoring

### Accessibility Constraints
- WCAG AA compliance minimum
- Keyboard navigation support
- Screen reader compatibility
- Respect prefers-reduced-motion
- Sufficient color contrast

---

## Success Metrics

### Quantitative
- [ ] All 3 pages deployed to production
- [ ] Lighthouse Performance score > 90
- [ ] Lighthouse Accessibility score > 95
- [ ] Zero TypeScript errors
- [ ] Zero console errors in production
- [ ] Page load time < 2 seconds (LCP)
- [ ] Mobile responsiveness on iOS and Android

### Qualitative
- [ ] Design matches HTML concepts closely
- [ ] Content reflects markdown specs accurately
- [ ] Smooth, delightful scroll experience
- [ ] Professional, polished appearance
- [ ] Easy for content editors to update in Sanity
- [ ] Clear component documentation

### Business Metrics
- [ ] Showcases Michael's AI capabilities effectively
- [ ] Demonstrates technical depth and design skill
- [ ] Supports narrative arc (discovery → production)
- [ ] Encourages engagement (scroll exploration)

---

## Risk Matrix

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Scroll-snap browser bugs | Medium | High | Test early, provide fallback smooth scroll |
| Performance with large images | Medium | Medium | Next.js Image optimization, lazy loading |
| Content import complexity | Low | Medium | Start with one showcase, validate thoroughly |
| Schema changes after import | Low | High | Review specs before finalizing schemas |
| Horizontal scroll UX on mobile | Medium | Medium | Test with real devices, improve scroll hints |
| Accessibility gaps | Low | High | Use automated tools, manual testing |
| Timeline slippage | Medium | Low | Buffer time in each phase, prioritize ruthlessly |

---

## Dependencies Graph

```
Phase 1 (Schemas)
    ↓
    ├──→ Phase 2 (Components) ──┐
    │                           ↓
    └──→ Phase 3 (Import) ──→ Phase 4 (Pages)
                                ↓
                            Phase 5 (Testing)
```

**Critical Path**: Phase 1 → Phase 3 → Phase 4 → Phase 5
**Parallel Opportunity**: Phase 2 can start before Phase 3 completes

---

## Recommended Execution Order

### Week 1: Foundation
- Days 1-2: Design and implement Sanity schemas
- Days 3-4: Test schemas in Studio, iterate based on content specs
- Day 5: Begin core layout components (ScrollingSlidesLayout, SlideNavigation)

### Week 2: Components
- Days 1-2: Slide components (Hero, Content, Metrics)
- Days 3-4: Horizontal scrolling components
- Day 5: Content blocks (QuoteBox, VisualGrid, ComparisonGrid)

### Week 3: Content Import
- Days 1-2: Build import framework and parsers
- Days 3-4: Import all three showcases, validate
- Day 5: Fix import issues, verify in Sanity Studio

### Week 4: Pages
- Days 1-2: AI Workflow page
- Days 3: PostPal page
- Days 4: Marketing Sites page
- Day 5: Showcase listing page, navigation integration

### Week 5: Testing & Polish
- Days 1-2: Functional testing, browser compatibility
- Days 3: Performance optimization
- Days 4: Accessibility and SEO
- Day 5: Content review, final polish

### Week 6: Launch
- Days 1-2: Final testing, documentation
- Day 3: Staging deployment, smoke tests
- Day 4: Production deployment
- Day 5: Monitor, fix any issues, celebrate

---

## Open Questions

1. **Photography**: Content specs reference photos. Do placeholder images exist, or should we use visual cards with text descriptions?
   - **Recommendation**: Use visual cards initially, replace with actual photos when available

2. **Analytics**: Should we track scroll depth, slide engagement, or horizontal scroll interactions?
   - **Recommendation**: Add basic page view tracking initially, enhance later if needed

3. **CTA Strategy**: Should CTAs link to contact form, other showcases, or case studies?
   - **Recommendation**: Link to related showcases to encourage exploration

4. **Mobile Navigation**: Should mobile get bottom nav instead of side dots?
   - **Recommendation**: Hide dots on mobile, rely on natural scroll behavior

5. **Content Updates**: How frequently will content be updated?
   - **Recommendation**: Design for quarterly updates, prioritize ease of editing in Sanity

---

## Next Steps

1. **Review this plan** with stakeholders
2. **Prioritize features** if timeline needs compression
3. **Identify any blockers** (content, design assets, etc.)
4. **Confirm resource allocation** (developer time, content time)
5. **Set up tracking** (GitHub issues, project board)
6. **Begin Phase 1** once approved

---

## Appendix: Sample Queries

### Sanity GROQ Query for AI Showcase
```groq
*[_type == "aiShowcase" && slug.current == $slug][0] {
  title,
  slug,
  category,
  heroSection {
    badge,
    title,
    subtitle,
    summary
  },
  slides[] {
    _type,
    sectionLabel,
    heading,
    content,
    quoteBox {
      quote,
      attribution
    },
    visualGrid[] {
      image {
        asset->
      },
      caption
    }
  },
  horizontalContent[] {
    ...,
    _type == "timelinePhase" => {
      phase,
      title,
      description,
      order
    },
    _type == "workflowStep" => {
      stepNumber,
      title,
      description
    },
    _type == "projectCard" => {
      projectName,
      projectType,
      description,
      technologies,
      icon
    }
  },
  metrics[] {
    value,
    label,
    description
  },
  callToAction {
    text,
    link
  }
}
```

### Component Usage Example
```tsx
<ScrollingSlidesLayout slideCount={6}>
  <HeroSlide
    badge="AI Workflow Showcase"
    title="Building Production Software with AI"
    subtitle="From product manager to full-stack developer"
    summary="The breakthrough came while building..."
  />

  <ContentSlide
    sectionLabel="Phase 01 — Discovery"
    heading="The 'Oh Shit' Moment"
    content={portableTextContent}
    quoteBox={{
      quote: "Within an hour, we had something genuinely useful...",
      attribution: "On building Dungeon Tracker"
    }}
  />

  <HorizontalTimelineSlide
    sectionLabel="Phase 02 — Evolution"
    heading="The Journey from Discovery to Production"
    phases={timelinePhases}
  />

  {/* ... more slides ... */}
</ScrollingSlidesLayout>
```

---

**Document Version**: 1.0
**Last Updated**: 2025-10-30
**Author**: Claude Code (Strategic Planning Specialist)
**Status**: Ready for Review
