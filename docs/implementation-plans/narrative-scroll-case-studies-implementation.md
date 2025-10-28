# Narrative Scroll Case Studies Implementation Plan

**Date**: October 28, 2025  
**Scope**: Implement Concept 1 (Narrative Scroll) design for all case study pages  
**Case Studies**: 5 total (Virgin America, Target, Pedal, Casa Bonita, Before Launcher)

---

## Executive Summary

This plan outlines the complete implementation of the narrative scroll design for case study pages, replacing the current horizontal slideshow with a long-form vertical scrolling experience. The work includes CMS schema updates, React component development, content migration for 5 case studies, and procurement of photo assets.

**Timeline**: 2-3 weeks (depending on asset availability)  
**Effort**: ~80-120 hours total

---

## Phase 1: Sanity CMS Schema Updates

**Goal**: Update the `project` schema to support structured narrative content with sections, screenshots, and rich text.

### 1.1 Schema Changes

**File**: `/sanity/schemas/project.ts`

**Add new fields**:

```typescript
// New fields to add to existing project schema:

defineField({
  name: 'sections',
  title: 'Case Study Sections',
  type: 'array',
  of: [
    {
      type: 'object',
      name: 'caseStudySection',
      title: 'Section',
      fields: [
        {
          name: 'sectionLabel',
          title: 'Section Label',
          type: 'string',
          description: 'e.g. "The Challenge", "Research Insights"',
        },
        {
          name: 'heading',
          title: 'Heading',
          type: 'string',
        },
        {
          name: 'content',
          title: 'Content',
          type: 'array',
          of: [
            { type: 'block' },
            {
              type: 'image',
              options: { hotspot: true },
              fields: [
                {
                  name: 'caption',
                  type: 'string',
                  title: 'Caption',
                },
              ],
            },
          ],
        },
        {
          name: 'screenshots',
          title: 'Screenshots',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'image',
                  type: 'image',
                  title: 'Screenshot',
                  options: { hotspot: true },
                },
                {
                  name: 'caption',
                  type: 'string',
                  title: 'Caption',
                },
              ],
            },
          ],
        },
      ],
      preview: {
        select: {
          title: 'heading',
          label: 'sectionLabel',
        },
        prepare({ title, label }) {
          return {
            title: title || 'Untitled Section',
            subtitle: label,
          }
        },
      },
    },
  ],
}),

defineField({
  name: 'overview',
  title: 'Project Overview',
  type: 'object',
  fields: [
    {
      name: 'role',
      title: 'Your Role',
      type: 'string',
    },
    {
      name: 'company',
      title: 'Company',
      type: 'string',
    },
    {
      name: 'timeline',
      title: 'Timeline',
      type: 'string',
    },
  ],
}),
```

**Keep existing fields** (compatible with current data):
- `title`, `slug`, `category`, `heroImage`
- `summary`, `description`
- `metrics`, `achievements`, `technologies`

### 1.2 Deploy Schema Changes

**Tasks**:
- [ ] Update `/sanity/schemas/project.ts` with new fields
- [ ] Run `npm run dev` to test schema in Sanity Studio
- [ ] Verify schema appears correctly at `http://localhost:3000/studio`
- [ ] Deploy schema to production (Sanity automatically updates)

**Time**: 1-2 hours

---

## Phase 2: Frontend React Components

**Goal**: Build new components for narrative scroll layout, replacing slideshow components.

### 2.1 Create New Components

**File**: `/src/components/CaseStudyNarrative.tsx` (new file)

Main narrative scroll component with:
- Hero section with blur orbs
- Section rendering with label + heading + rich text content
- Screenshot grid/large layouts
- Metrics grid
- Achievements list (simple bullets, no cards)

**File**: `/src/components/CaseStudySection.tsx` (new file)

Individual section component:
- Section label (small caps, purple)
- Section heading with underline accent
- Portable Text rendering
- Screenshot containers with captions

**File**: `/src/components/CaseStudyScreenshots.tsx` (new file)

Screenshot layouts:
- Grid layout (2x2, 2x1, etc.)
- Large single screenshot
- Caption styling

### 2.2 Update Page Component

**File**: `/src/app/(public)/case-studies/[slug]/page.tsx`

Replace:
- Remove `CaseStudySlideshow` import
- Remove `CaseStudySections` imports
- Add `CaseStudyNarrative` import

Update query:
```typescript
const PROJECT_QUERY = `*[_type == "project" && slug.current == $slug][0] {
  title,
  "subtitle": summary,
  category,
  heroImage {
    asset-> { url }
  },
  technologies,
  metrics[] {
    label,
    value,
    description
  },
  achievements,
  sections[] {
    sectionLabel,
    heading,
    content,
    screenshots[] {
      "image": image.asset->url,
      caption
    }
  },
  overview {
    role,
    company,
    timeline
  }
}`;
```

### 2.3 Styling

**File**: `/src/app/globals.css` (add utilities if needed)

Ensure existing blur orb, gradient, and animation classes are available:
- `.blur-orb` (already exists)
- `.text-gradient` (already exists)
- `.shadow-elegant` (already exists)

### 2.4 Testing Checklist

- [ ] Hero section displays correctly
- [ ] Sections render with proper spacing
- [ ] Screenshots display in grid and large layouts
- [ ] Metrics cards show without hover states
- [ ] Achievements list uses simple bullets
- [ ] Mobile responsive (test on iPhone, iPad)
- [ ] Scroll performance is smooth
- [ ] Fonts load correctly (DM Sans, Crimson Pro)

**Time**: 8-12 hours

---

## Phase 3: Content Migration

**Goal**: Migrate all 5 case studies from content specs to Sanity CMS.

### 3.1 Virgin America

**Content Spec**: `/docs/content-specs/virgin-america-case-study.md`

**Sections to create**:
1. The Challenge - Understanding the Real Problem
2. Research Insights - Clicks vs. Decisions: The Key Insight
3. The Solution - A Step-by-Step Booking Flow
4. Key Metrics - Quantifiable Impact
5. Outcomes & Impact - Industry-Defining Success

**Metrics**:
- Conversion Improvement: 15-20%
- Industry First: Responsive Airline Website
- Awards Won: 3 (Webbies, UX Awards, Cannes Lions)
- Tech Stack: Angular (Largest project at time)

**Achievements**:
- Created the first responsive airline website
- Improved conversion rates by 15-20%
- Won Webbies, UX Awards, and Cannes Lions
- Pioneered the step-by-step, decision-by-decision e-commerce pattern
- Built the largest Angular project at the time
- Addressed complex data science issues with modern dashboards

**Technologies**: Angular, Sabre API, Responsive Design, Single-Page Application, RESTful APIs, Data Visualization

**Time**: 2-3 hours

---

### 3.2 Target

**Content Spec**: `/docs/content-specs/target-case-study.md`

**Sections to create**:
1. The Challenge - E-commerce at Enterprise Scale
2. Research Insights - Understanding Guest Needs
3. The Solution - Modernizing the Shopping Experience
4. Technical Implementation - Building for Scale
5. Outcomes & Impact - Results

**Metrics** (from spec):
- Scale metric (transactions, users, etc.)
- Performance improvement
- User satisfaction increase
- Technical achievement

**Technologies**: React, Node.js, Microservices, etc. (from spec)

**Time**: 2-3 hours

---

### 3.3 Pedal

**Content Spec**: `/docs/content-specs/pedal-case-study.md`

**Sections to create**:
1. The Challenge - Conversion Optimization Problem
2. Research Insights - User Behavior Analysis
3. The Solution - Streamlined Experience
4. Testing & Validation - A/B Testing Results
5. Outcomes & Impact - Conversion Improvements

**Metrics** (from spec):
- Conversion rate improvement
- User engagement metrics
- Revenue impact
- Testing iterations

**Technologies**: (from spec)

**Time**: 2-3 hours

---

### 3.4 Casa Bonita

**Content Spec**: `/docs/content-specs/casa-bonita-case-study.md`

**Sections to create**:
1. The Challenge - Reimagining a Cultural Icon
2. Research Insights - Understanding the Experience
3. The Solution - Digital + Physical Integration
4. Implementation - Building the System
5. Outcomes & Impact - Launch Results

**Metrics** (from spec):
- Reservation system performance
- Guest satisfaction
- Operational efficiency
- Digital adoption

**Technologies**: (from spec)

**Time**: 2-3 hours

---

### 3.5 Before Launcher

**Content Spec**: `/docs/content-specs/before-launcher-case-study.md`

**Sections to create**:
1. The Challenge - Product Launch Platform
2. Research Insights - Early Adopter Needs
3. The Solution - Launch Framework
4. Features - Core Capabilities
5. Outcomes & Impact - Results

**Metrics** (from spec):
- Product launches supported
- User growth
- Success rate
- Platform adoption

**Technologies**: (from spec)

**Time**: 2-3 hours

---

### 3.6 Migration Process (per case study)

**Steps**:
1. Open Sanity Studio at `http://localhost:3000/studio`
2. Navigate to Projects
3. Find/create the case study project
4. Fill in basic fields (title, slug, category, summary)
5. Add technologies array
6. Add metrics array (4 metrics per case study)
7. Add achievements array (5-6 achievements)
8. Create sections array:
   - Add section for each major content block
   - Fill in section label and heading
   - Copy content from spec into rich text editor
   - Format with bold, lists, etc. as needed
9. Save and publish

**Total Migration Time**: 10-15 hours (all 5 case studies)

---

## Phase 4: Photo Asset Procurement

**Goal**: Gather all necessary screenshots and images for each case study.

### 4.1 Virgin America - Photo Asset List

**Priority: HIGH** (flagship case study)

1. **Hero Image** (1 image)
   - Virgin America website on multiple devices (desktop, tablet, mobile)
   - Should show the homepage or booking flow
   - High resolution, professional quality
   - **Format**: 1920x1080px minimum, 16:9 aspect ratio

2. **Before Screenshot** (1 image)
   - Old Virgin America booking flow showing complexity
   - Multi-decision screen that confused users
   - **Format**: 1600x1000px, 16:10 aspect ratio
   - **Location**: After "Research Insights" section

3. **Booking Flow Steps** (4 images)
   - Step 1: Passenger selection screen
   - Step 2: Date picker screen
   - Step 3: Flight selection screen
   - Step 4: Seat selection map
   - **Format**: 1600x1000px each, 16:10 aspect ratio
   - **Layout**: 2x2 grid
   - **Location**: After "Solution" section

4. **Desktop Experience** (1 image)
   - Full desktop layout showing responsive design
   - **Format**: 1600x1000px, 16:10 aspect ratio

5. **Mobile Experience** (1 image)
   - Mobile booking flow showing touch optimization
   - **Format**: 750x1334px (iPhone dimensions) or similar

6. **Final Product Hero** (1 image)
   - Virgin America homepage across multiple devices
   - Professional marketing-quality image
   - **Format**: 1920x1080px, 16:9 aspect ratio
   - **Location**: End of case study

**Total**: 9 images for Virgin America

---

### 4.2 Target - Photo Asset List

**Priority: MEDIUM**

1. **Hero Image** (1 image)
   - Target.com on multiple devices
   - Modern e-commerce experience

2. **Product Listing Screenshots** (2-3 images)
   - Before/after or different views
   - Show scale and complexity

3. **Shopping Experience** (2-3 images)
   - Cart, checkout, or product detail pages
   - Demonstrate user improvements

4. **Mobile Commerce** (1-2 images)
   - Target app or mobile web
   - Show responsive capabilities

5. **Desktop Experience** (1 image)
   - Full desktop layout

**Total**: 7-10 images for Target

---

### 4.3 Pedal - Photo Asset List

**Priority: MEDIUM**

1. **Hero Image** (1 image)
   - Pedal interface on devices

2. **Conversion Flow Screenshots** (3-4 images)
   - Before/after comparison
   - Key conversion moments

3. **A/B Testing Results** (1-2 images)
   - Data visualization or comparison

4. **Final Product** (1-2 images)
   - Optimized experience

**Total**: 6-9 images for Pedal

---

### 4.4 Casa Bonita - Photo Asset List

**Priority: MEDIUM**

1. **Hero Image** (1 image)
   - Casa Bonita restaurant exterior or interior
   - Establishes the brand

2. **Reservation System** (2-3 images)
   - Digital booking interface
   - Guest experience flow

3. **Physical Integration** (1-2 images)
   - Digital displays, kiosks, or integration points

4. **Before/After** (1-2 images)
   - Old vs. new experience

**Total**: 5-8 images for Casa Bonita

---

### 4.5 Before Launcher - Photo Asset List

**Priority: MEDIUM**

1. **Hero Image** (1 image)
   - Before Launcher dashboard or platform

2. **Launch Dashboard** (2-3 images)
   - Platform interface
   - Key features

3. **Product Launch Flow** (2-3 images)
   - How launches work
   - User journey

4. **Results/Analytics** (1-2 images)
   - Success metrics
   - Data visualization

**Total**: 6-9 images for Before Launcher

---

### 4.6 Asset Procurement Strategy

**Option 1: Existing Assets**
- Check Work & Co portfolio/archive
- Check personal archives
- Check Wayback Machine for public screenshots
- Request from clients if relationship allows

**Option 2: Recreate/Mock**
- Recreate key screens in Figma
- Use placeholder images initially
- Replace with real assets over time

**Option 3: Screenshot Tools**
- For live projects (Target): Use browser screenshots
- Use responsive design mode for multi-device views
- Clean up with editing tools

**Asset Quality Standards**:
- Resolution: Minimum 1600x1000px for standard, 1920x1080px for hero
- Format: PNG for UI screenshots, JPG for photos
- File size: Optimize to <500KB per image
- Naming: Use descriptive names (e.g., `virgin-america-booking-step-1.png`)

**Total Asset Procurement Time**: 8-16 hours (varies by availability)

---

## Phase 5: Integration & Testing

**Goal**: Integrate assets, test all case studies, and ensure quality.

### 5.1 Asset Upload & Integration

**Steps per case study**:
1. Upload all images to Sanity
2. Assign images to appropriate sections
3. Add captions to all screenshots
4. Verify image quality and sizing
5. Test loading performance

**Time**: 1-2 hours per case study = 5-10 hours total

### 5.2 QA Testing Checklist

**Test each case study**:
- [ ] Hero image displays correctly
- [ ] All sections render with proper spacing
- [ ] Screenshots appear in correct layouts (grid vs. large)
- [ ] Captions display under screenshots
- [ ] Metrics grid shows all 4 metrics
- [ ] Achievements list displays with simple bullets
- [ ] Technology tags render correctly
- [ ] Text is readable (font sizes, line heights)
- [ ] No hover states on non-clickable content
- [ ] Blur orbs create atmospheric depth

**Mobile testing**:
- [ ] iPhone 12/13 Pro (390x844)
- [ ] iPad (768x1024)
- [ ] Android phone (360x800)

**Browser testing**:
- [ ] Chrome (primary)
- [ ] Safari (iOS)
- [ ] Firefox
- [ ] Edge

**Performance testing**:
- [ ] Page load time <3 seconds
- [ ] Images lazy load
- [ ] Smooth scrolling (60fps)
- [ ] No layout shift

**Time**: 4-6 hours

### 5.3 Accessibility Review

- [ ] Headings hierarchy (h1 → h2 → h3)
- [ ] Alt text on all images
- [ ] Proper ARIA labels
- [ ] Keyboard navigation works
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Screen reader testing

**Time**: 2-3 hours

---

## Phase 6: Deployment

**Goal**: Deploy to production and verify.

### 6.1 Pre-Deployment Checklist

- [ ] All 5 case studies migrated
- [ ] All assets uploaded and optimized
- [ ] Local testing complete
- [ ] Mobile responsive verified
- [ ] Performance optimized

### 6.2 Deployment Steps

1. **Sanity Content**:
   - Content is already live (Sanity auto-publishes)
   - Verify in production Sanity Studio

2. **Frontend Code**:
   - Commit all component changes
   - Push to GitHub
   - Vercel auto-deploys
   - Verify deployment succeeds

3. **Verification**:
   - Test all 5 case studies on production
   - Verify images load
   - Check mobile experience
   - Test from different devices/locations

### 6.3 Post-Deployment Monitoring

**Week 1**:
- Monitor analytics for case study page views
- Check for errors in Vercel logs
- Gather user feedback
- Fix any issues quickly

**Time**: 2-3 hours

---

## Timeline & Effort Summary

| Phase | Task | Effort | Duration |
|-------|------|--------|----------|
| 1 | Sanity Schema Updates | 1-2 hours | Day 1 |
| 2 | Frontend Components | 8-12 hours | Days 2-3 |
| 3 | Content Migration (5 case studies) | 10-15 hours | Days 4-5 |
| 4 | Photo Asset Procurement | 8-16 hours | Days 6-8 |
| 5 | Integration & Testing | 6-11 hours | Days 9-10 |
| 6 | Deployment | 2-3 hours | Day 11 |
| **Total** | **35-59 hours** | **~2-3 weeks** |

**Note**: Timeline assumes photo assets are available. If assets need to be recreated or requested from clients, add 1-2 weeks.

---

## Risk Mitigation

### Risk 1: Photo Assets Unavailable
**Mitigation**: 
- Start with Virgin America (flagship)
- Use placeholder images initially
- Prioritize live projects (Target) where screenshots are easy
- Create mockups in Figma if needed

### Risk 2: Content Specs Incomplete
**Mitigation**:
- Review all content specs before migration
- Flag gaps early
- Use placeholder content and iterate
- Prioritize complete case studies first

### Risk 3: Performance Issues
**Mitigation**:
- Lazy load images
- Optimize image sizes (use Next.js Image component)
- Test on slow connections
- Monitor Vercel analytics

### Risk 4: Mobile Layout Issues
**Mitigation**:
- Test mobile-first during development
- Use responsive grid layouts
- Test on real devices early
- Adjust breakpoints as needed

---

## Success Metrics

**Launch Criteria**:
- All 5 case studies migrated ✓
- All sections render correctly ✓
- Mobile responsive ✓
- Performance: <3s page load ✓
- Accessibility: WCAG AA compliance ✓

**Post-Launch Goals** (30 days):
- Case study page views increase by 20%
- Time on page increases by 30%
- Bounce rate decreases by 15%
- No critical bugs reported

---

## Next Steps

1. **Approve this plan** and prioritize phases
2. **Phase 1**: Update Sanity schema (start immediately)
3. **Phase 2**: Build components (while schema is being tested)
4. **Phase 3**: Begin Virgin America migration (priority #1)
5. **Phase 4**: Start asset procurement in parallel

**Questions**:
- Do you have access to Work & Co archives for Virgin America assets?
- Should we prioritize certain case studies over others?
- Any additional case studies to include beyond these 5?
