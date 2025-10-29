# Case Study Narrative Scroll - Implementation Plan
**Date:** October 29, 2025
**Objective:** Align the implemented case study page with the wireframe design (concept-1-narrative-scroll_final.html)
**Completion Target:** 100% alignment (excluding scroll indicator per request)

## Current State Assessment
- **Current Score:** 85% alignment with wireframe
- **Core Structure:** ✅ Successfully implemented
- **Missing Elements:** Typography, colors, annotations, and polish details

## Implementation Tasks

### Phase 1: Typography & Visual Foundation

#### Task 2: Update Typography System
**Priority:** High
**Effort:** Low (30 mins)

**Files to Update:**
- `/src/app/layout.tsx` - Add Google Fonts imports
- `/src/components/CaseStudyNarrative.tsx` - Update font classes
- `/src/components/CaseStudySection.tsx` - Update font classes

**Implementation:**
1. Add to layout.tsx head:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Crimson+Pro:wght@300;400;500;600&display=swap" rel="stylesheet">
```

2. Update Tailwind config:
```js
// tailwind.config.ts
fontFamily: {
  'sans': ['DM Sans', 'system-ui', 'sans-serif'],
  'serif': ['Crimson Pro', 'Georgia', 'serif'],
}
```

3. Update component classes:
- Headers: `font-sans` (DM Sans)
- Body text: `font-serif font-light` (Crimson Pro)
- Add gradient to main title: `bg-gradient-to-r from-purple-400 to-gray-100 bg-clip-text text-transparent`

---

#### Task 3: Adjust Color Values
**Priority:** High
**Effort:** Low (20 mins)

**Files to Update:**
- Create `/src/lib/colors.ts` for consistent color values
- Update all purple references in components

**Color Mapping:**
```typescript
// /src/lib/colors.ts
export const caseStudyColors = {
  primary: 'hsl(280, 100%, 80%)',      // Main purple
  secondary: 'hsl(276, 100%, 75%)',    // Secondary purple
  primaryRgb: 'rgb(199, 128, 245)',    // For opacity usage
  blur1: 'hsl(280, 100%, 70%)',        // Blur orb 1
  blur2: 'hsl(276, 100%, 75%)',        // Blur orb 2
}
```

**Update blur orbs:**
- Change from `bg-purple-500` to inline styles with exact HSL values
- Increase opacity from 0.2 to 0.15 to match wireframe

---

### Phase 2: Hero Section Enhancement

#### Task 4: Add Technology Tags to Hero
**Priority:** Medium
**Effort:** Low (20 mins)

**Files to Update:**
- `/src/components/CaseStudyNarrative.tsx`

**Implementation:**
1. Move technologies display from bottom section to hero (after subtitle)
2. Restyle as outlined badges:
```jsx
<div className="tech-tags flex flex-wrap gap-4 justify-center mt-12">
  {technologies?.map(tech => (
    <span className="px-6 py-3 bg-white/5 border border-white/10 rounded-full
                     text-sm font-sans">
      {tech}
    </span>
  ))}
</div>
```

---

### Phase 3: Content Sections Enhancement

#### Task 5: Enhance Metrics Section
**Priority:** Medium
**Effort:** Medium (45 mins)

**Files to Update:**
- `/src/components/CaseStudyNarrative.tsx` - Metrics section

**Implementation:**
```jsx
// Update metrics grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
  {metrics.map((metric, index) => (
    <div className="bg-white/3 border border-white/10 rounded-3xl p-12 text-center">
      <div className="text-7xl font-bold bg-gradient-to-r from-[hsl(276,100%,75%)]
                      to-[hsl(280,100%,80%)] bg-clip-text text-transparent mb-4">
        {metric.value}
      </div>
      <div className="text-lg font-medium text-gray-50 mb-2 font-sans">
        {metric.label}
      </div>
      {metric.description && (
        <div className="text-sm text-gray-400">
          {metric.description}
        </div>
      )}
    </div>
  ))}
</div>
```

---

#### Task 6: Add Annotation Component
**Priority:** High
**Effort:** Medium (1 hour)

**Files to Create:**
- `/src/components/CaseStudyAnnotation.tsx`

**Implementation:**
```tsx
// New component: CaseStudyAnnotation.tsx
interface AnnotationProps {
  title: string;
  content: string;
}

export function CaseStudyAnnotation({ title, content }: AnnotationProps) {
  return (
    <div className="mt-16 p-8 bg-purple-500/5 border-l-4 border-[hsl(280,100%,80%)]
                    rounded-lg">
      <p className="text-gray-300 italic font-serif text-lg leading-relaxed">
        <strong className="text-[hsl(280,100%,80%)] font-sans not-italic">
          {title}:
        </strong>{' '}
        {content}
      </p>
    </div>
  );
}
```

**Add to Sanity schema:**
```js
// In project schema, add to sections:
{
  name: 'annotation',
  title: 'Design Annotation',
  type: 'object',
  fields: [
    { name: 'title', type: 'string' },
    { name: 'content', type: 'text' }
  ]
}
```

---

#### Task 7: Implement Screenshot Placeholders
**Priority:** Medium
**Effort:** Medium (45 mins)

**Files to Update:**
- `/src/components/CaseStudyScreenshots.tsx` (create if doesn't exist)

**Implementation:**
```tsx
// CaseStudyScreenshots.tsx
export function CaseStudyScreenshots({ screenshots }: Props) {
  if (!screenshots?.length) return null;

  const gridScreenshots = screenshots.filter(s => s.layout === 'grid');
  const largeScreenshots = screenshots.filter(s => s.layout === 'large');

  return (
    <>
      {/* Grid layout */}
      {gridScreenshots.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          {gridScreenshots.map((screenshot, idx) => (
            <div key={idx}>
              <div className="relative aspect-[16/10] bg-gradient-to-br
                              from-purple-500/10 to-purple-500/5
                              border border-white/10 rounded-2xl overflow-hidden">
                {screenshot.image?.asset?.url ? (
                  <Image src={screenshot.image.asset.url} alt="" fill />
                ) : (
                  <div className="flex items-center justify-center h-full p-8">
                    <span className="text-gray-500 text-sm font-sans text-center">
                      Screenshot: {screenshot.caption || `View ${idx + 1}`}
                    </span>
                  </div>
                )}
              </div>
              {screenshot.caption && (
                <p className="mt-4 text-sm text-gray-400 text-center">
                  {screenshot.caption}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Large layout */}
      {largeScreenshots.map((screenshot, idx) => (
        <div key={idx} className="max-w-6xl mx-auto mt-16">
          <div className="relative aspect-[16/9] bg-gradient-to-br
                          from-purple-500/10 to-purple-500/5
                          border border-white/10 rounded-2xl overflow-hidden">
            {screenshot.image?.asset?.url ? (
              <Image src={screenshot.image.asset.url} alt="" fill />
            ) : (
              <div className="flex items-center justify-center h-full p-8">
                <span className="text-gray-500 text-sm font-sans text-center">
                  Screenshot: {screenshot.caption || 'Full-width view'}
                </span>
              </div>
            )}
          </div>
          {screenshot.caption && (
            <p className="mt-4 text-sm text-gray-400 text-center">
              {screenshot.caption}
            </p>
          )}
        </div>
      ))}
    </>
  );
}
```

---

### Phase 4: Content & Polish

#### Task 8: Content Verification
**Priority:** High
**Effort:** Low (verification only)

**Content Checklist from Wireframe:**
✅ **Hero Content:**
- Title: "Virgin America: First Responsive Airline Website"
- Subtitle about conversion improvement
- Category badge

✅ **Section Content (from migration script):**
1. The Challenge - Understanding the Real Problem
2. Research Insights - Clicks vs. Decisions
3. The Solution - Step-by-Step Booking Flow
4. Technical Implementation - Building on Legacy Systems
5. Testing & Optimization - Data-Driven Decisions
6. Impact - Industry-Defining Success
7. Evolution - Extending the Vision
8. Reflections - Key Takeaways

✅ **Metrics:**
- 15-20% Conversion Improvement
- Industry First Responsive Airline Website
- 3+ Awards Won
- Angular Tech Stack

✅ **Achievements:**
- All 6 key achievements from wireframe

**Note:** All content is present in the migration script. Need to ensure API token is set for content updates.

---

#### Task 9: Spacing & Visual Polish
**Priority:** Low
**Effort:** Medium (30 mins)

**Updates:**
1. Increase section padding:
   - Change `py-12 md:py-16` to `py-20 md:py-32`
   - Change `mb-20 md:mb-32` to `mb-24 md:mb-40`

2. Adjust heading sizes:
   - Main title: `text-5xl md:text-6xl lg:text-7xl`
   - Section headings: `text-3xl md:text-4xl lg:text-5xl`

3. Add breathing room:
   - Increase paragraph spacing: `mb-6` to `mb-8`
   - Increase list item spacing: `space-y-3` to `space-y-6`

---

#### Task 10: Missing Visual Elements
**Priority:** Low
**Effort:** Low (20 mins)

**Add gradient underlines:**
Already present but ensure consistent:
```jsx
<span className="absolute bottom-0 left-0 w-16 h-px
                 bg-gradient-to-r from-[hsl(280,100%,80%)] to-transparent" />
```

**Enhanced button hover:**
```jsx
className="... hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(199,128,245,0.4)]
           transition-all duration-300"
```

---

## Implementation Order

### Quick Wins (Day 1 - 2 hours)
1. ✅ Task 2: Typography updates (30 mins)
2. ✅ Task 3: Color adjustments (20 mins)
3. ✅ Task 4: Hero tech tags (20 mins)
4. ✅ Task 10: Visual element fixes (20 mins)
5. ✅ Task 9: Spacing adjustments (30 mins)

### Medium Priority (Day 2 - 2.5 hours)
6. ✅ Task 5: Metrics enhancement (45 mins)
7. ✅ Task 6: Annotation component (1 hour)
8. ✅ Task 7: Screenshot placeholders (45 mins)

### Final Polish
9. ✅ Task 8: Content verification & updates
10. Testing across breakpoints
11. Performance optimization

---

## Testing Checklist

- [ ] Typography loads correctly (DM Sans & Crimson Pro)
- [ ] Colors match exact HSL values
- [ ] Blur orbs render with correct opacity
- [ ] Tech tags appear in hero section
- [ ] Metrics display with gradient text
- [ ] Annotations render with proper styling
- [ ] Screenshot placeholders display correctly
- [ ] Responsive behavior at all breakpoints
- [ ] Dark mode compatibility maintained
- [ ] Performance metrics acceptable

---

## Notes

- All content from wireframe is present in the migration script
- Need Sanity API token to run content updates
- Consider adding animation/transitions for polish
- Screenshot functionality ready for actual images when available
- Annotation system can be expanded for other case studies

## Success Criteria

The implementation will match the wireframe concept at 95-100% fidelity (excluding the scroll indicator which will be custom designed later), with all visual elements, typography, colors, and content structure aligned exactly as specified.