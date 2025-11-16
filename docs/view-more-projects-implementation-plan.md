# View More Projects Implementation Plan

## Overview
Implement a "View More Projects" component that appears at the bottom of case study pages, featuring 3 randomly selected case studies displayed using the chat card treatment (LinkPreview component) with full CMS capabilities.

## Design Decision
**Selected Approach**: Reuse the existing LinkPreview component (chat card treatment)
- **Rationale**: Maintains visual consistency with the AI chat assistant's recommendations
- **Benefits**:
  - Already handles metadata fetching, loading states, and caching
  - Familiar UI pattern for users
  - Single component to maintain
  - Proven mobile responsiveness

## Core Requirements

### Functional Requirements
1. Display 3 case studies at the bottom of each case study page
2. Random selection from all available case studies (excluding current)
3. Selection happens on server-side render (stable per page load)
4. No client-side refreshing/re-randomization
5. Full CMS control over feature settings

### Technical Requirements
1. Reuse LinkPreview component for card display
2. Server-side random selection for SEO and stability
3. Sanity CMS integration for configuration
4. Exclude current case study from recommendations
5. Graceful fallback if fewer than 3 case studies exist

## Implementation Phases

### Phase 1: CMS Schema & Configuration
**Timeline**: 1-2 hours

#### 1.1 Create Sanity Schema
Create `sanity/schemas/viewMoreProjects.ts`:
```typescript
{
  name: 'viewMoreProjectsSettings',
  title: 'View More Projects Settings',
  type: 'document',
  fields: [
    {
      name: 'enabled',
      title: 'Enable View More Projects',
      type: 'boolean',
      description: 'Show recommended projects at the bottom of case studies',
      initialValue: true
    },
    {
      name: 'heading',
      title: 'Section Heading',
      type: 'string',
      description: 'Main heading for the section',
      initialValue: 'Explore More Work'
    },
    {
      name: 'subheading',
      title: 'Section Subheading',
      type: 'text',
      rows: 2,
      description: 'Supporting text below the heading',
      initialValue: 'Each project represents a unique challenge solved through thoughtful design and technical excellence.'
    },
    {
      name: 'numberOfProjects',
      title: 'Number of Projects to Show',
      type: 'number',
      description: 'How many projects to display (recommended: 3)',
      initialValue: 3,
      validation: Rule => Rule.min(1).max(6)
    },
    {
      name: 'layoutStyle',
      title: 'Layout Style',
      type: 'string',
      options: {
        list: [
          { title: 'Grid (2 columns)', value: 'grid' },
          { title: 'List (1 column)', value: 'list' },
          { title: 'Carousel', value: 'carousel' }
        ]
      },
      initialValue: 'grid'
    },
    {
      name: 'selectionStrategy',
      title: 'Project Selection Strategy',
      type: 'string',
      options: {
        list: [
          { title: 'Random', value: 'random' },
          { title: 'Related (by category)', value: 'related' },
          { title: 'Most Recent', value: 'recent' },
          { title: 'Curated List', value: 'curated' }
        ]
      },
      initialValue: 'random'
    },
    {
      name: 'curatedProjects',
      title: 'Curated Projects',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'project' }] }],
      hidden: ({ parent }) => parent?.selectionStrategy !== 'curated',
      description: 'Select specific projects to show (only used when Selection Strategy is "Curated")'
    },
    {
      name: 'excludeFromRandom',
      title: 'Exclude from Random Selection',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'project' }] }],
      description: 'Projects to never show in recommendations'
    },
    {
      name: 'ctaButton',
      title: 'Call to Action Button',
      type: 'object',
      fields: [
        {
          name: 'enabled',
          title: 'Show CTA Button',
          type: 'boolean',
          initialValue: true
        },
        {
          name: 'text',
          title: 'Button Text',
          type: 'string',
          initialValue: 'View All Case Studies'
        },
        {
          name: 'link',
          title: 'Button Link',
          type: 'string',
          initialValue: '/case-studies'
        }
      ]
    }
  ],
  preview: {
    select: {
      title: 'heading',
      subtitle: 'enabled'
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'View More Projects',
        subtitle: subtitle ? 'Enabled' : 'Disabled'
      }
    }
  }
}
```

#### 1.2 Update Sanity Config
- Add schema to `sanity.config.ts`
- Deploy schema changes
- Create singleton document in Studio

### Phase 2: Component Development
**Timeline**: 2-3 hours

#### 2.1 Create Server Component
Create `src/components/view-more-projects/ViewMoreProjects.tsx`:
```typescript
// Server Component that fetches settings and projects
export async function ViewMoreProjects({ currentSlug }: { currentSlug: string }) {
  // Fetch CMS settings
  const settings = await getViewMoreSettings()

  if (!settings?.enabled) return null

  // Get projects based on selection strategy
  const projects = await getRecommendedProjects({
    currentSlug,
    strategy: settings.selectionStrategy,
    count: settings.numberOfProjects,
    excludeIds: settings.excludeFromRandom
  })

  return (
    <ViewMoreProjectsClient
      projects={projects}
      settings={settings}
    />
  )
}
```

#### 2.2 Create Client Component
Create `src/components/view-more-projects/ViewMoreProjectsClient.tsx`:
```typescript
'use client'

export function ViewMoreProjectsClient({ projects, settings }) {
  return (
    <section className="view-more-projects">
      <div className="container">
        {/* Section Header */}
        <header>
          <h2>{settings.heading}</h2>
          <p>{settings.subheading}</p>
        </header>

        {/* Project Cards using LinkPreview */}
        <div className={getLayoutClasses(settings.layoutStyle)}>
          {projects.map((project) => (
            <div key={project.slug} className="animate-stagger">
              <LinkPreview href={`/case-studies/${project.slug}`}>
                {project.title}
              </LinkPreview>
            </div>
          ))}
        </div>

        {/* Optional CTA Button */}
        {settings.ctaButton?.enabled && (
          <footer>
            <Link href={settings.ctaButton.link}>
              {settings.ctaButton.text}
            </Link>
          </footer>
        )}
      </div>
    </section>
  )
}
```

#### 2.3 Random Selection Logic
Create `src/lib/project-selection.ts`:
```typescript
export async function getRecommendedProjects({
  currentSlug,
  strategy,
  count,
  excludeIds = []
}: ProjectSelectionOptions) {
  switch (strategy) {
    case 'random':
      return getRandomProjects(currentSlug, count, excludeIds)
    case 'related':
      return getRelatedProjects(currentSlug, count)
    case 'recent':
      return getRecentProjects(currentSlug, count)
    case 'curated':
      return getCuratedProjects(count)
    default:
      return getRandomProjects(currentSlug, count, excludeIds)
  }
}

// Stable random selection (seeded by slug)
function getRandomProjects(currentSlug: string, count: number, excludeIds: string[]) {
  // Use current slug as seed for consistent randomization
  const seed = hashString(currentSlug)
  const rng = seedrandom(seed)

  // Get all projects except current and excluded
  const eligibleProjects = await getEligibleProjects(currentSlug, excludeIds)

  // Shuffle with seeded random
  const shuffled = shuffleArray(eligibleProjects, rng)

  return shuffled.slice(0, count)
}
```

### Phase 3: Integration
**Timeline**: 1-2 hours

#### 3.1 Add to Case Study Page
Update `src/app/(public)/case-studies/[slug]/page.tsx`:
```typescript
import { ViewMoreProjects } from '@/components/view-more-projects/ViewMoreProjects'

export default async function CaseStudyPage({ params }) {
  const caseStudy = await getCaseStudy(params.slug)

  return (
    <main>
      {/* Existing case study content */}
      <CaseStudyContent data={caseStudy} />

      {/* New: View More Projects section */}
      <ViewMoreProjects currentSlug={params.slug} />
    </main>
  )
}
```

#### 3.2 Add Navigation Context
Since LinkPreview requires NavigationProvider, ensure it's available:
- Verify NavigationProvider is in the layout tree
- Or create a simplified version that doesn't require the context

### Phase 4: Styling & Polish
**Timeline**: 1 hour

#### 4.1 Responsive Design
- Grid layout: 2 columns on desktop, 1 on mobile
- Consistent spacing and padding
- Smooth animations using existing utilities

#### 4.2 Dark Mode Support
- Use semantic color tokens
- Ensure all elements have dark mode variants

#### 4.3 Loading States
- LinkPreview already handles loading
- Add skeleton loader for section if needed

### Phase 5: Testing & QA
**Timeline**: 1-2 hours

#### 5.1 Test Scenarios
- [ ] Verify random selection is stable per page load
- [ ] Test with fewer than 3 case studies
- [ ] Verify current case study is excluded
- [ ] Test all selection strategies
- [ ] Verify CMS settings apply correctly
- [ ] Test responsive breakpoints
- [ ] Verify dark mode appearance

#### 5.2 Edge Cases
- No other case studies available
- Only 1-2 other case studies exist
- CMS settings misconfigured
- Network failures in metadata fetching

### Phase 6: Documentation & Deployment
**Timeline**: 30 minutes

#### 6.1 Documentation
- Update component documentation
- Add usage examples
- Document CMS settings

#### 6.2 Deployment Checklist
- [ ] Deploy Sanity schema changes
- [ ] Configure initial CMS settings
- [ ] Test in staging environment
- [ ] Monitor for errors
- [ ] Verify analytics tracking

## Technical Considerations

### Performance
- Server-side rendering for SEO
- LinkPreview component already has caching
- Minimal client-side JavaScript
- Lazy load images via LinkPreview

### SEO Impact
- Increases internal linking
- Reduces bounce rate
- Improves time on site
- All links are crawlable

### Accessibility
- LinkPreview already handles ARIA labels
- Keyboard navigation supported
- Screen reader compatible
- Focus management built-in

## Success Metrics
- Reduced bounce rate on case study pages
- Increased pageviews per session
- Higher engagement with additional case studies
- Improved cross-project discovery

## Future Enhancements
1. A/B test different selection strategies
2. Add view tracking for recommendations
3. Machine learning for personalized recommendations
4. Animation options (fade, slide, etc.)
5. Multiple layout templates

## Implementation Order
1. **Week 1**: Phases 1-3 (Core functionality)
2. **Week 2**: Phases 4-5 (Polish and testing)
3. **Week 3**: Phase 6 (Documentation and deployment)

## Risk Mitigation
- **Risk**: LinkPreview performance with multiple cards
  - **Mitigation**: Leverage existing caching, limit to 3 cards
- **Risk**: Random selection not truly random
  - **Mitigation**: Use seeded random for stability, option to switch strategies
- **Risk**: CMS complexity for non-technical users
  - **Mitigation**: Smart defaults, clear descriptions, preview in Studio

## Estimated Total Time
**8-11 hours** for complete implementation including:
- CMS setup: 1-2 hours
- Component development: 2-3 hours
- Integration: 1-2 hours
- Styling: 1 hour
- Testing: 1-2 hours
- Documentation: 30 minutes

## Next Steps
1. Review and approve plan
2. Create Sanity schema
3. Implement server component with random selection
4. Integrate with case study pages
5. Test and refine
6. Deploy to production