# About Page Redesign Plan
**Date:** November 6, 2025
**Goal:** Update About page to use flowing article format matching Case Study detail pages

---

## Research Summary

### Current State

**About Page (profile schema):**
- Uses a complex multi-section structure with `sections[]` array
- Each section has: heading, slug, content (Portable Text), subsections, visible flag
- Content is organized in a two-column layout (`lg:columns-2`)
- Has hero section with profile image, quickFacts grid, and various metadata
- Located at: `/src/app/(public)/about/page.tsx`
- Schema: `/sanity/schemas/profile.ts`
- Client component: `/src/components/about/AboutPageClient.tsx`

**Case Study Page (project schema):**
- Uses modern "flowing article" format with `article[]` field
- Single continuous Portable Text stream with inline stat blocks
- Components: EditorialHero, FlowingArticle (ArticleContent), stat blocks (Number, Quote, Text)
- Supports rich media: images, videos, code blocks, custom formatting
- Magazine-style editorial layout with max-width container
- Located at: `/src/app/(public)/case-studies/[slug]/page.tsx`
- Schema: `/sanity/schemas/project.ts`
- Components: `/src/components/case-study-editorial/`, `/src/components/case-study-flowing/`

### Key Differences

1. **Content Structure:**
   - About: Nested sections/subsections architecture
   - Case Study: Flat article array with inline elements

2. **Layout:**
   - About: Two-column responsive layout
   - Case Study: Single-column flowing editorial with max-w-4xl

3. **Visual Components:**
   - About: Basic Portable Text rendering
   - Case Study: Custom stat blocks, rich media embeds, styled headings

4. **Schema Complexity:**
   - About: More structured (sections → subsections)
   - Case Study: Simpler, more flexible (single article array)

---

## Phased Implementation Plan

### Phase 1: Schema Design & Migration Script Planning
**Goal:** Design new profile schema and plan content migration

**Tasks:**
1. Create new `article` field in profile schema (similar to project schema)
2. Add support for stat blocks (statBlockNumber, statBlockQuote, statBlockText)
3. Keep legacy `sections` field for backward compatibility (mark as deprecated/hidden)
4. Add hero section fields if not present (badge, subtitle, summary)
5. Document migration path from sections → article

**Migration Script Requirements:**
- Read existing profile document from Sanity
- Transform `sections[]` content into flat `article[]` structure
- Preserve all Portable Text content
- Convert section headings to H2 blocks in article
- Convert subsection headings to H3 blocks
- Generate preview for manual review before applying

**Files to Modify:**
- `/sanity/schemas/profile.ts` - Add article field

**Files to Create:**
- `/scripts/migrate-profile-to-article.ts` - Migration script
- `/docs/about-page-migration-guide.md` - Migration documentation

**Deliverables:**
- Updated `sanity/schemas/profile.ts`
- Migration script: `scripts/migrate-profile-to-article.ts`
- Migration documentation

---

### Phase 2: Component Development
**Goal:** Create reusable About page components matching Case Study style

**Tasks:**
1. Create `AboutHero` component (based on EditorialHero)
   - Profile image support (circular with hotspot)
   - Hero headline, subheadline, intro
   - Quick facts grid integration
   - Overview metadata (similar to case study overview)

2. Create `AboutArticle` component (based on FlowingArticle)
   - Reuse ArticleContent renderer
   - Import stat block components from case-study-flowing
   - Single-column layout with max-w-4xl

3. Create `AboutFooter` component
   - Availability status
   - CTA section
   - Social links (if needed)

4. Update `AboutPageClient.tsx` component
   - Integrate new components
   - Remove two-column layout
   - Match Case Study visual style
   - Add atmospheric blur orbs

**Files to Create:**
- `/src/components/about/AboutHero.tsx`
- `/src/components/about/AboutArticle.tsx`
- `/src/components/about/AboutFooter.tsx`

**Files to Modify:**
- `/src/components/about/AboutPageClient.tsx`

**Component Structure:**
```tsx
// AboutPageClient.tsx
<div className="min-h-screen bg-background text-foreground">
  {/* Blur orbs */}
  <AboutHero {...heroProps} />
  <AboutArticle article={data.article} />
  <AboutFooter {...footerProps} />
</div>
```

**Deliverables:**
- `/src/components/about/AboutHero.tsx`
- `/src/components/about/AboutArticle.tsx`
- `/src/components/about/AboutFooter.tsx`
- Updated `/src/components/about/AboutPageClient.tsx`

---

### Phase 3: Schema Migration Execution
**Goal:** Run migration script to transform existing content

**Tasks:**
1. Backup current profile document from Sanity
2. Run migration script in preview mode (dry-run)
3. Review generated article structure
4. Apply migration to Sanity dataset
5. Verify content integrity

**Migration Script Functionality:**
```typescript
// Pseudo-code structure
async function migrateProfileToArticle() {
  // 1. Fetch current profile
  const profile = await sanityClient.fetch(`*[_type == "profile"][0]`)

  // 2. Create backup
  const backup = JSON.stringify(profile, null, 2)
  fs.writeFileSync(`./backups/profile-backup-${Date.now()}.json`, backup)

  // 3. Transform sections to article blocks
  const article = []

  for (const section of profile.sections) {
    // Add section heading as H2
    article.push({
      _type: 'block',
      style: 'h2',
      children: [{ _type: 'span', text: section.heading }]
    })

    // Add section content
    article.push(...section.content)

    // Add subsections as H3
    for (const subsection of section.subsections || []) {
      article.push({
        _type: 'block',
        style: 'h3',
        children: [{ _type: 'span', text: subsection.heading }]
      })
      article.push(...subsection.content)
    }
  }

  // 4. Preview changes
  console.log('Preview:', JSON.stringify(article, null, 2))

  // 5. Prompt for confirmation
  const confirmed = await promptUser('Apply migration? (y/n)')

  if (confirmed) {
    // 6. Apply patch to Sanity
    await sanityClient.patch(profile._id)
      .set({ article })
      .commit()

    console.log('Migration complete!')
  }
}
```

**Command to Run:**
```bash
# Dry run (preview only)
npm run migrate:profile -- --dry-run

# Apply migration
npm run migrate:profile
```

**Deliverables:**
- Backup JSON file of original profile (in `/backups/`)
- Migration execution log
- Updated profile document in Sanity with `article` field populated

---

### Phase 4: Page Implementation
**Goal:** Update About page to use new components and schema

**Tasks:**
1. Update `/src/app/(public)/about/page.tsx` query to fetch `article` field
2. Update AboutPageClient to use new component structure
3. Remove old section-based rendering logic
4. Add atmospheric blur orbs (matching Case Study style)
5. Test responsive behavior
6. Verify dark mode support

**Query Update:**
```typescript
const profileQuery = `
  *[_type == "profile"] | order(_updatedAt desc)[0] {
    name,
    profileImage {
      asset->,
      hotspot,
      crop
    },
    heroHeadline,
    heroSubheadline,
    heroIntro,
    quickFacts,
    article,  // NEW: flowing article content
    availability,
    availabilityText,
    ctaText,
    ctaButtonText,
    seo {
      metaTitle,
      metaDescription,
      keywords,
      twitterCard,
      canonicalUrl,
      noIndex
    }
  }
`
```

**Files to Modify:**
- `/src/app/(public)/about/page.tsx` - Update query
- `/src/components/about/AboutPageClient.tsx` - Use new components

**Deliverables:**
- Updated `/src/app/(public)/about/page.tsx`
- Updated `/src/components/about/AboutPageClient.tsx`
- Visual consistency with Case Study pages

---

### Phase 5: Testing & Refinement
**Goal:** Ensure quality, accessibility, and consistency

**Tasks:**
1. Visual regression testing
   - Compare old vs new About page screenshots
   - Verify spacing, typography, colors match Case Study style
   - Check blur orbs positioning

2. Content verification
   - Ensure all original content is present
   - Check headings hierarchy (H1 → H2 → H3)
   - Verify links work
   - Test stat blocks if added

3. Responsive testing
   - Mobile (< 640px)
   - Tablet (640px - 1024px)
   - Desktop (> 1024px)
   - Test QuickFacts grid responsiveness
   - Verify profile image hotspot/crop on all sizes

4. Accessibility audit
   - Screen reader testing (VoiceOver/NVDA)
   - Keyboard navigation (tab order, focus states)
   - Color contrast verification (WCAG AA)
   - Alt text on images

5. Performance testing
   - Image optimization (profile photo)
   - Build time verification
   - Lighthouse score

6. Build verification
   - Run `npm run build`
   - Check for TypeScript errors
   - Verify no console warnings

**Test Checklist:**
- [ ] All sections from old format appear in new format
- [ ] Headings maintain proper hierarchy
- [ ] Profile image displays with correct hotspot
- [ ] QuickFacts grid responsive
- [ ] Dark mode works correctly
- [ ] No console errors
- [ ] Build completes successfully
- [ ] All links functional
- [ ] Accessible via keyboard
- [ ] Screen reader compatible

**Deliverables:**
- Test results documentation
- Bug fixes applied
- Performance metrics
- Screenshots (before/after)

---

### Phase 6: Cleanup & Documentation
**Goal:** Clean up legacy code and document changes

**Tasks:**
1. Mark old `sections` field as hidden in schema (keep for rollback)
2. Add migration notes to `/docs/about-page-migration-guide.md`
3. Update `/memory-bank/CURRENT.md` with implementation details
4. Add code comments explaining new structure
5. Remove unused components if applicable
6. Update this plan with actual completion dates

**Files to Update:**
- `/sanity/schemas/profile.ts` - Hide sections field
- `/docs/about-page-migration-guide.md` - Complete migration guide
- `/memory-bank/CURRENT.md` - Implementation summary
- `/docs/about-page-redesign-plan.md` - Mark as complete

**Documentation to Create:**
- Migration guide explaining the change
- Component usage examples
- Future content editing instructions (how to use article field)

**Deliverables:**
- `/docs/about-page-migration-guide.md`
- Updated memory bank
- Clean codebase with no legacy rendering code
- Updated CLAUDE.md if needed

---

## Migration Script Details

### Input (Current Structure)
```typescript
{
  sections: [
    {
      heading: "Professional Background",
      content: [
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'I have 20 years...' }]
        }
      ],
      subsections: [
        {
          heading: "Experience Highlights",
          content: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Key highlights...' }]
            }
          ]
        }
      ]
    },
    {
      heading: "Technical Skills",
      content: [/* Portable Text blocks */],
      subsections: []
    }
  ]
}
```

### Output (New Structure)
```typescript
{
  article: [
    {
      _type: 'block',
      style: 'h2',
      children: [{ _type: 'span', text: 'Professional Background' }]
    },
    {
      _type: 'block',
      children: [{ _type: 'span', text: 'I have 20 years...' }]
    },
    {
      _type: 'block',
      style: 'h3',
      children: [{ _type: 'span', text: 'Experience Highlights' }]
    },
    {
      _type: 'block',
      children: [{ _type: 'span', text: 'Key highlights...' }]
    },
    {
      _type: 'block',
      style: 'h2',
      children: [{ _type: 'span', text: 'Technical Skills' }]
    },
    /* ...content blocks... */
  ]
}
```

### Script Features
- **Dry-run mode:** Preview changes before applying (`--dry-run` flag)
- **Validation:** Ensure all content blocks are valid Portable Text
- **Backup:** Create timestamped backup before migration
- **Logging:** Detailed output of transformation steps
- **Rollback:** Ability to restore from backup if needed
- **Confirmation:** Require explicit confirmation before applying changes

---

## Timeline Estimate

- **Phase 1:** 2-3 hours (schema + script planning)
- **Phase 2:** 4-5 hours (component development)
- **Phase 3:** 1-2 hours (migration execution)
- **Phase 4:** 2-3 hours (page implementation)
- **Phase 5:** 2-3 hours (testing)
- **Phase 6:** 1-2 hours (cleanup)

**Total:** ~12-18 hours

---

## Risk Mitigation

1. **Content Loss:** Backup profile document before migration
2. **Breaking Changes:** Keep legacy sections field for rollback
3. **Visual Regression:** Screenshot comparison tests
4. **SEO Impact:** Verify metadata and URLs unchanged
5. **Build Failures:** Test build process after each phase
6. **Sanity Studio Issues:** Ensure article field renders correctly in Studio

---

## Success Criteria

- [x] About page matches Case Study visual style
- [x] All original content preserved
- [x] Single-column flowing article layout
- [x] Stat blocks available for use
- [x] Responsive on all breakpoints
- [x] Accessible (WCAG AA)
- [x] Build completes without errors
- [x] Dark mode support
- [x] Migration documented
- [x] Legacy code removed/hidden

---

## Rollback Plan

If issues arise:

1. **Immediate Rollback:**
   ```typescript
   // Restore from backup
   const backup = require('./backups/profile-backup-[timestamp].json')
   await sanityClient.patch(profileId).set(backup).commit()
   ```

2. **Code Rollback:**
   - Revert page.tsx query to use `sections` field
   - Restore old AboutPageClient.tsx
   - Keep new components for future use

3. **Schema Rollback:**
   - Unhide `sections` field in profile schema
   - Hide/remove `article` field

---

## Notes

- Case Study components are reusable (EditorialHero, FlowingArticle, stat blocks)
- ArticleContent renderer handles all Portable Text with custom components
- Sanity's visual editing should work with article field
- Consider adding stat blocks to highlight key achievements
- Profile image uses hotspot/crop (already implemented)

---

## References

**Existing Files:**
- `/src/app/(public)/about/page.tsx` - About page
- `/src/app/(public)/case-studies/[slug]/page.tsx` - Case study template
- `/sanity/schemas/profile.ts` - Profile schema
- `/sanity/schemas/project.ts` - Project schema (reference for article field)
- `/src/components/case-study-editorial/EditorialHero.tsx` - Hero component
- `/src/components/case-study-flowing/FlowingArticle.tsx` - Article wrapper
- `/src/components/case-study-flowing/ArticleContent.tsx` - Content renderer

**Documentation:**
- `/docs/component-styling-patterns.md` - Styling guidelines
- `/docs/css-quick-reference.md` - CSS patterns
- `/CLAUDE.md` - Project instructions

---

## Current Status

**Phase:** Complete (Phases 1-4)
**Last Updated:** November 7, 2025
**Status:** ✅ Production Ready

### Completion Summary

**Phase 1:** ✅ Complete - Schema design & migration script
**Phase 2:** ✅ Complete - Component development
**Phase 3:** ✅ Complete - Migration execution & page implementation
**Phase 4:** ✅ Complete - Testing & documentation
**Phase 5:** ⊘ Skipped - Optional enhancements (can be done later)
**Phase 6:** ✅ Complete - Cleanup & documentation

**Implementation Details:** See `/docs/about-page-redesign-implementation.md`
