# Feature Registry
**Portfolio Enhancement Features**

This document defines the features to be added to the portfolio, organized for the project-manager skill.

---

## Feature Template

Each feature should include:
- **ID**: PM-XXX (assigned by project manager)
- **Name**: Clear, action-oriented name
- **Category**: UI, Backend, Content, Design, Infrastructure
- **Phase**: Phase 1, Phase 2, Phase 3
- **Priority**: P0 (Critical), P1 (High), P2 (Medium), P3 (Low)
- **Status**: backlog, planning, in-progress, ready-to-ship, shipped
- **Description**: Clear explanation of what this feature does
- **Dependencies**: Other PM-XXX features that must be completed first
- **Design Concepts**: Links to design documentation
- **Success Metrics**: How we'll know this succeeded

---

## Phase 1: Core Interactive Enhancements

### PM-001: Interactive Project Demos
**Category**: UI
**Priority**: P0 (Critical)
**Status**: planning
**Dependencies**: None
**Estimated Effort**: 2 weeks

**Description**:
Add interactive demonstration capabilities to project cards, allowing visitors to experience the work through live demos, video walkthroughs, and code samples.

**User Story**:
As a **technical decision-maker** (CTO, Engineering Manager), I want to **see live demos and code samples** so I can **quickly evaluate Michael's technical capabilities and implementation quality**.

**Acceptance Criteria**:
- [ ] Project cards include demo interface (tabs, overlay, or progressive reveal)
- [ ] Live demos embedded via iframe or CodeSandbox/StackBlitz
- [ ] Video walkthroughs embedded (Loom, YouTube, or Cloudinary)
- [ ] Code snippets with syntax highlighting and copy functionality
- [ ] Links to full source code repositories
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Loading states for embedded content
- [ ] Analytics tracking (demo views, video plays, code views)

**Design Concepts**:
- Option A: Tab-Based Switcher (see `design-concepts/concept-1-technical.html`)
- Option B: Immersive Overlay Modal (see `design-concepts/concept-2-immersive.html`)
- Option C: Inline Progressive Reveal (see `design-concepts/concept-3-quick.html`)

**Technical Notes**:
- Use React state for active demo type
- Lazy load iframes until activated
- Implement CSP (Content Security Policy) for embedded content
- Consider CDN for video hosting (Cloudinary or Vercel)

**Success Metrics**:
- 85% of visitors click to view at least one demo
- Average time on site increases by 60 seconds
- Contact form submissions increase by 20%

---

### PM-002: Expanded Case Study Format
**Category**: Content, UI
**Priority**: P0 (Critical)
**Status**: planning
**Dependencies**: None
**Estimated Effort**: 2 weeks

**Description**:
Transform case study pages from sparse content to rich, 6-section storytelling format that conveys problem-solving process, technical decisions, and measurable impact.

**User Story**:
As an **agency partner or hiring manager**, I want to **understand Michael's process and problem-solving approach** so I can **assess cultural fit and project execution capabilities**.

**Acceptance Criteria**:
- [ ] 6-section case study structure implemented:
  1. Hero with key visual and metrics
  2. Problem & Context
  3. Approach & Process (with diagrams/wireframes)
  4. Technical Implementation & Challenges
  5. Results & Measurable Impact
  6. Testimonials or Client Quotes
- [ ] Scroll-triggered animations reveal sections progressively
- [ ] Process diagrams or architecture visuals included
- [ ] Before/after comparisons where applicable
- [ ] Metrics visualized (charts, graphs, progress bars)
- [ ] Mobile-optimized reading experience
- [ ] Estimated read time displayed
- [ ] Social sharing meta tags configured

**Design Concepts**:
- Option A: Linear Scroll with Fixed Nav (concept-1-technical.html)
- Option B: Split-Screen Journey (concept-2-immersive.html)
- Option C: Accordion Sections (concept-3-quick.html)

**Content Requirements**:
Each case study needs:
- Hero image (1920x1080)
- 3-5 process images (wireframes, diagrams, screenshots)
- 3-5 key metrics with data
- 1-2 client testimonials
- Problem statement (100-150 words)
- Solution description (200-300 words)

**Technical Notes**:
- Use Sanity CMS for case study content
- Implement PortableText for rich text sections
- Use Framer Motion for scroll-triggered animations
- Create reusable case study template component

**Success Metrics**:
- Average scroll depth increases to 70%+
- Case study click-through rate increases to 40%+
- Average time on case study page: 2-3 minutes

---

### PM-003: Project Filtering & Tagging System
**Category**: UI, UX
**Priority**: P1 (High)
**Status**: planning
**Dependencies**: None
**Estimated Effort**: 1 week

**Description**:
Add filtering/tagging system to project grid, enabling visitors to quickly find relevant work by technology, category, or project type.

**User Story**:
As a **recruiter or hiring manager**, I want to **filter projects by relevant technology stack** so I can **quickly assess if Michael has experience with our tech**.

**Acceptance Criteria**:
- [ ] Filter UI implemented (pills, dropdown, or sidebar)
- [ ] Tag taxonomy defined (AI/ML, Mobile, Web, Full-Stack, UX, etc.)
- [ ] All projects tagged in Sanity CMS
- [ ] Filtered results animate smoothly (Framer Motion)
- [ ] Active filters visually indicated
- [ ] "Clear all filters" functionality
- [ ] Filter state persists in URL query params
- [ ] Result count displayed
- [ ] Keyboard navigation support (arrow keys, Enter)
- [ ] Mobile-optimized filter UI

**Design Concepts**:
- Option A: Horizontal Pill Tags (concept-1-technical.html)
- Option B: Sidebar Faceted Search (concept-2-immersive.html)
- Option C: Dropdown Multi-Select (concept-3-quick.html)

**Tag Taxonomy**:
**Technology Tags**: AI/ML, React, TypeScript, Python, Node.js, Mobile, iOS, Android
**Category Tags**: Web App, Mobile App, API, Design System, Tool/Utility
**Role Tags**: Full-Stack, Frontend, Backend, UX/UI, AI Engineering

**Technical Notes**:
- Store tags in Sanity project schema
- Use React state or URL query params for filter state
- Implement fuzzy search for tag names
- Consider tag autocomplete for admin interface

**Success Metrics**:
- 40%+ of visitors use filters
- Average projects viewed increases by 2x
- Bounce rate decreases by 15%

---

## Phase 2: Polish & Optimization

### PM-004: Scroll Experience Enhancements
**Category**: UI, Animation
**Priority**: P2 (Medium)
**Status**: backlog
**Dependencies**: PM-001, PM-002

**Description**:
Add scroll-triggered animations, parallax effects, and progressive disclosure throughout the site to create a more engaging, premium experience.

**Acceptance Criteria**:
- [ ] Section fade-ins on scroll (Framer Motion whileInView)
- [ ] Staggered card animations on homepage
- [ ] Subtle parallax on hero section
- [ ] Smooth scroll behavior enabled
- [ ] Section transitions optimized for performance

**Success Metrics**:
- Scroll depth increases to 80%+
- Time on site increases by 30 seconds

---

### PM-005: Client Testimonials
**Category**: Content, UI
**Priority**: P2 (Medium)
**Status**: backlog
**Dependencies**: None

**Description**:
Add testimonials section to homepage and case study pages, with quotes from clients, collaborators, or colleagues.

**Acceptance Criteria**:
- [ ] Testimonial component created
- [ ] Testimonials stored in Sanity CMS
- [ ] Carousel format for multiple testimonials
- [ ] Photos/avatars for testimonial authors
- [ ] Company logos where applicable

**Success Metrics**:
- Conversion rate increases by 60% (research-backed)

---

### PM-006: About Page Upgrade
**Category**: Content, UI
**Priority**: P2 (Medium)
**Status**: backlog
**Dependencies**: None

**Description**:
Transform About page from text-heavy to visually engaging with professional photo, skills visualization, timeline, and process diagram.

**Acceptance Criteria**:
- [ ] Professional photo added (not placeholder)
- [ ] Skills visualization (bar chart or radar)
- [ ] Career timeline with milestones
- [ ] "How I Work" process diagram
- [ ] Tools/technologies grid with icons

---

### PM-007: Typography Enhancement
**Category**: Design
**Priority**: P3 (Low)
**Status**: backlog
**Dependencies**: None

**Description**:
Add serif font (Playfair Display or Instrument Serif) for headlines to create stronger visual hierarchy and contrast with Inter body text.

**Acceptance Criteria**:
- [ ] Serif font loaded (Playfair Display or Instrument Serif)
- [ ] H1/H2 updated to use serif
- [ ] Body text remains Inter
- [ ] Font weights optimized for performance

---

## Phase 3: Future Enhancements

### PM-008: Blog/Insights Section
**Category**: Content, SEO
**Priority**: P3 (Low)
**Status**: backlog
**Dependencies**: Sanity CMS

**Description**:
Add blog functionality for thought leadership content about AI/ML, development process, and technical learnings.

**Acceptance Criteria**:
- [ ] Blog schema added to Sanity
- [ ] `/insights` route created
- [ ] Blog post template component
- [ ] RSS feed generated
- [ ] Social sharing enabled

---

## Feature Dependencies Graph

```
PM-001 (Interactive Demos)
  ↓
PM-004 (Scroll Enhancements)

PM-002 (Case Studies)
  ↓
PM-004 (Scroll Enhancements)
  ↓
PM-005 (Testimonials)

PM-003 (Filtering) [Independent]

PM-006 (About Page) [Independent]

PM-007 (Typography) [Independent]

PM-008 (Blog) [Independent, requires Sanity]
```

---

## Implementation Priority

**Week 1-2**:
1. PM-001: Interactive Project Demos
2. PM-003: Project Filtering

**Week 3-4**:
3. PM-002: Expanded Case Studies
4. PM-005: Client Testimonials

**Week 5-6**:
5. PM-004: Scroll Enhancements
6. PM-006: About Page Upgrade

**Future**:
7. PM-007: Typography Enhancement
8. PM-008: Blog/Insights Section

---

## Success Metrics Summary

**Quantitative Goals**:
- Time on site: +60 seconds (baseline ~1 min → target 2-3 min)
- Scroll depth: +70%+ visitors reach Featured Work
- Click-through rate: +40%+ visitors click into case study
- Contact form submissions: +20% increase

**Qualitative Goals**:
- User feedback: "What stands out? What's missing?" from 5 test users
- Recruiter reactions: Share with 3 recruiters, gather feedback
- Peer review: Critique from 2 designer friends

---

## Next Steps for Project Manager Integration

When ready to use project-manager skill:

1. **Initialize Registry**:
   ```bash
   cd /Users/michaelevans/.project-suite/project-planner
   npx ts-node src/cli.ts registry init
   ```

2. **Import Features**:
   ```bash
   # Add each feature manually or via bulk import
   npx ts-node src/cli.ts registry add \
     --name "Interactive Project Demos" \
     --category "UI" \
     --phase "Phase 1" \
     --status "planning" \
     --priority "P0" \
     --description "Add interactive demos with live, video, and code options"
   ```

3. **Generate Roadmap**:
   ```bash
   npx ts-node src/cli.ts export roadmap \
     --format html \
     --group-by phase \
     -o docs/roadmaps/portfolio-roadmap.html
   ```

4. **Create GitHub Issues**:
   ```bash
   npx ts-node src/cli.ts create-issues \
     --from-registry \
     --status "planning" \
     --dry-run
   ```

---

**Created**: October 23, 2025
**Last Updated**: October 23, 2025
**Status**: Ready for project-manager import
