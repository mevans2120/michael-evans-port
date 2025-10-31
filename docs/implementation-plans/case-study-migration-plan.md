# Case Study Migration to Sanity - Implementation Plan

**Date:** October 30, 2025
**Goal:** Migrate all 5 case studies from content specs to Sanity CMS

---

## Overview

Migrate 5 fully-detailed case study content specs into Sanity CMS using automated script, creating complete case study pages ready for the narrative scroll layout.

**Note on Naming:** "Pedal" should be "Peddle" everywhere (already corrected in content spec).

---

## Case Studies to Migrate

| Order | Slug | Title | Status |
|-------|------|-------|--------|
| 1 | virgin-america | Virgin America - First Responsive Airline Website | Spec ready |
| 2 | before-launcher | Before Launcher - Helping Thousands Focus | Spec ready |
| 3 | casa-bonita | Casa Bonita - 40,000-Person Queue, 100% Capacity | Spec ready |
| 4 | target | Target - Enterprise E-commerce Transformation | Spec ready |
| 5 | peddle | Peddle - 15% Conversion Increase | Spec ready |

---

## Content Spec Structure

Each content spec contains:

### Metadata
- Title, slug, category, featured status, order
- Role, company, timeline
- Published date

### Core Content
- Hero section (title, tagline, summary)
- Key metrics (JSON array)
- Key achievements (JSON array)
- Technologies used (JSON array)

### Detailed Sections
- 7-9 content sections with:
  - Section label (optional)
  - Heading
  - Content (markdown/portable text)
  - Screenshots placeholder (will use placeholder images)
  - Annotations (optional)

### SEO
- Meta title, description, keywords

---

## Technical Approach

### Strategy: Create New Documents

**Why:** Easier to delete duplicates than update existing documents
- No risk of overwriting existing content
- Can compare side-by-side
- Simple rollback (just delete)
- Less error-prone

### Placeholder Images

**Approach:** Use Unsplash placeholder images via URL
- No upload required initially
- Can be replaced later in Sanity Studio
- Format: `https://images.unsplash.com/photo-[id]?w=1200&h=800&fit=crop`
- Will use different themed images for each case study

---

## Implementation Phases

### Phase 1: Build Migration Script ✓

**Tasks:**
1. Create `src/scripts/migrate-case-studies.ts`
2. Parse markdown content specs
3. Transform to Sanity document structure
4. Handle portable text conversion
5. Add placeholder images
6. Validate required fields

**Deliverable:** Working migration script

---

### Phase 2: Test on One Case Study

**Tasks:**
1. Run script for Virgin America only
2. Verify in Sanity Studio
3. Check case study page renders correctly
4. Validate all sections display properly
5. Fix any issues found

**Deliverable:** One working case study

---

### Phase 3: Migrate All 5 Case Studies

**Tasks:**
1. Run script for all 5 case studies
2. Quick verification in Studio for each
3. Document any issues/notes

**Deliverable:** All 5 case studies in Sanity

---

### Phase 4: Verification & Handoff

**Tasks:**
1. Check all case studies load on frontend
2. Verify featured case studies appear on homepage
3. Test navigation between case studies
4. Document placeholder images that need replacement

**Deliverable:** Ready for image replacement

---

## Script Design

### Input
- Content spec markdown files in `docs/content-specs/`

### Processing
1. Parse frontmatter-style metadata sections
2. Extract JSON blocks (metrics, achievements, technologies)
3. Convert content sections to portable text blocks
4. Generate placeholder image references
5. Build Sanity document structure

### Output
- Creates new documents via Sanity client API
- Logs success/failure for each case study
- Returns document IDs for verification

---

## Sanity Schema Mapping

| Content Spec Field | Sanity Field | Type | Notes |
|-------------------|--------------|------|-------|
| Title | title | string | |
| Tagline/Summary | summary | text | |
| Description | description | text | From hero summary |
| Category | category | string | Always "Case Study" |
| Featured | featured | boolean | From metadata |
| Order | order | number | From metadata |
| Slug | slug | slug | Auto from metadata |
| Metrics | metrics[] | array | label, value, description |
| Achievements | achievements[] | array of strings | |
| Technologies | technologies[] | array of strings | |
| Sections | sections[] | array | Complex nested structure |

### Section Structure
```typescript
{
  _key: string,
  sectionLabel?: string,
  heading: string,
  content: PortableText,
  screenshots?: [
    {
      image: { asset: { _ref: string } },
      caption?: string,
      layout: 'grid' | 'large'
    }
  ],
  annotation?: {
    title?: string,
    content?: string
  }
}
```

---

## Placeholder Image Strategy

### By Case Study Theme:

1. **Virgin America** - Airport/aviation themed
2. **Before Launcher** - Mobile/focus themed
3. **Casa Bonita** - Restaurant/dining themed
4. **Target** - Retail/shopping themed
5. **Peddle** - Automotive themed

### Layout Types:
- `grid` layout: 2-4 images per section
- `large` layout: 1 full-width image per section

---

## Success Criteria

- ✅ All 5 case studies created in Sanity
- ✅ All required fields populated
- ✅ Sections display correctly on case study pages
- ✅ Featured case studies appear on homepage
- ✅ Placeholder images in place
- ✅ Ready for real image replacement

---

## Post-Migration Tasks (For User)

1. **Replace placeholder images** in Sanity Studio
2. **Review content** for any formatting issues
3. **Delete any existing duplicate** case studies if needed
4. **Set featured toggles** if not automatically set
5. **Verify SEO metadata** in Sanity

---

## Risk Mitigation

**Risk:** Script creates duplicates
**Mitigation:** Easy to identify and delete in Studio

**Risk:** Portable text conversion fails
**Mitigation:** Keep markdown simple, test one first

**Risk:** Missing required fields
**Mitigation:** Validation before creation

**Risk:** Images don't display
**Mitigation:** Use reliable Unsplash URLs, test format

---

## Timeline

- **Phase 1:** 30-45 minutes (script development)
- **Phase 2:** 15 minutes (single case study test)
- **Phase 3:** 10 minutes (run for all 5)
- **Phase 4:** 10 minutes (verification)

**Total:** ~75 minutes

---

## Next Steps

Starting Phase 1: Building the migration script now...
