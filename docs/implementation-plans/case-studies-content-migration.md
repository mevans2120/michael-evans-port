# Case Studies Content Migration Plan

**Date:** October 28, 2025
**Status:** Ready to Execute

## Overview

Migrate all 5 case studies with rich narrative content from migration scripts to Sanity CMS. This will populate the narrative scroll layout implemented in commit `cc8b225`.

## Case Studies to Migrate

1. **Virgin America** - First Responsive Airline Website (Order: 1)
2. **Pedal** - Fitness Platform for Peloton Competitors (Order: 2)
3. **Casa Bonita** - Restaurant Revival (Order: 3)
4. **Target** - Enterprise E-commerce Transformation (Order: 4)
5. **Before Launcher** - AI-First Mobile Experience (Order: 5)

## Current Status

### ✅ What We Have
- **Migration Scripts Ready:**
  - `/scripts/migrate-virgin-america.ts` - Full Virgin America content (8 narrative sections)
  - `/scripts/migrate-all-case-studies.ts` - Target, Pedal, Casa Bonita, Before Launcher content
- **Components Ready:**
  - `CaseStudyNarrative` - Main layout component (implemented cc8b225)
  - `CaseStudySection` - Section renderer with Portable Text
  - `CaseStudyScreenshots` - Grid and large layout support
- **Schema Ready:**
  - Project schema with `sections[]` field
  - Portable Text content support
  - Screenshot objects with captions and layouts
- **Environment Variables:**
  - `NEXT_PUBLIC_SANITY_PROJECT_ID` = 5n331bys ✅
  - `NEXT_PUBLIC_SANITY_DATASET` = production ✅
  - `SANITY_AUTH_TOKEN` = exists in .env.local ⚠️

### ⚠️ Current Issue

**Permission Error:** The existing `SANITY_AUTH_TOKEN` has insufficient "update" permissions.

```
ClientError: transaction failed: Insufficient permissions; permission "update" required
```

## Prerequisites Check

### Required Values
- [x] Sanity Project ID: `5n331bys`
- [x] Sanity Dataset: `production`
- [x] Migration scripts exist and are complete
- [ ] Sanity auth token with write permissions

### Token Permissions Needed
The auth token must have these permissions:
- ✅ Read (has this)
- ❌ Create/Update (missing this)
- ❌ Delete (may need this)

## Migration Steps

### Phase 1: Fix Auth Token (Manual)

**Option A: Regenerate Token in Sanity Dashboard**
1. Go to https://www.sanity.io/manage/personal/tokens
2. Delete existing token (if visible)
3. Create new token with permissions:
   - Name: "Migration Token" or "Write Token"
   - Permissions: **Editor** (Create, Read, Update, Delete)
4. Copy new token
5. Update `.env.local`:
   ```bash
   SANITY_AUTH_TOKEN=<new-token-here>
   ```

**Option B: Create Additional Token (Safer)**
1. Go to https://www.sanity.io/manage/personal/tokens
2. Create new token (keep existing one):
   - Name: "Migration Token"
   - Permissions: **Editor**
3. Copy new token
4. Update `.env.local` temporarily for migration:
   ```bash
   SANITY_AUTH_TOKEN=<new-token-here>
   ```
5. After migration, can revert to read-only token if desired

### Phase 2: Run Migration Scripts

**Step 1: Migrate Virgin America**
```bash
npx tsx scripts/migrate-virgin-america.ts
```

Expected output:
```
🚀 Starting Virgin America migration...
✅ Successfully migrated Virgin America case study
   Document ID: virgin-america
   Document Rev: <revision-id>
   URL: http://localhost:3000/case-studies/virgin-america
```

**Step 2: Migrate All Other Case Studies**
```bash
npx tsx scripts/migrate-all-case-studies.ts
```

Expected output:
```
🚀 Starting migration of 4 case studies...

📝 Migrating Target...
✅ Successfully migrated Target
   Document ID: target
   URL: http://localhost:3000/case-studies/target

📝 Migrating Pedal...
✅ Successfully migrated Pedal
   Document ID: pedal
   URL: http://localhost:3000/case-studies/pedal

📝 Migrating Casa Bonita...
✅ Successfully migrated Casa Bonita
   Document ID: casa-bonita
   URL: http://localhost:3000/case-studies/casa-bonita

📝 Migrating Before Launcher...
✅ Successfully migrated Before Launcher
   Document ID: before-launcher
   URL: http://localhost:3000/case-studies/before-launcher

🎉 Migration complete!
```

### Phase 3: Verify in Sanity Studio

1. Open http://localhost:3000/studio
2. Navigate to **Projects**
3. Check each case study has:
   - ✅ Title, slug, category
   - ✅ Summary, description
   - ✅ Metrics (4 items each)
   - ✅ Achievements (6+ items)
   - ✅ Technologies array
   - ✅ Overview (role, company, timeline)
   - ✅ Sections array with narrative content
   - ✅ Featured fields (for homepage):
     - `featured: true/false`
     - `order: 1-5`
     - `featuredCategory`
     - `featuredMetric`
     - `featuredDescription`

### Phase 4: Test Case Study Pages

Visit each case study URL and verify:
- http://localhost:3000/case-studies/virgin-america
- http://localhost:3000/case-studies/target
- http://localhost:3000/case-studies/pedal
- http://localhost:3000/case-studies/casa-bonita
- http://localhost:3000/case-studies/before-launcher

**Check:**
- [ ] Hero section displays with category badge
- [ ] Title and subtitle render correctly
- [ ] Overview metadata shows (role, company, timeline)
- [ ] Metrics grid displays with gradient numbers
- [ ] Achievements list with purple bullet dots
- [ ] All narrative sections render with proper headings
- [ ] Portable Text content renders (bold, bullets, paragraphs)
- [ ] Technologies display as purple tags
- [ ] "View More Case Studies" CTA at bottom
- [ ] Blur orbs visible in background
- [ ] Responsive design works on mobile

### Phase 5: Update Homepage Featured Settings

For the 3 featured homepage case studies, update in Sanity Studio:

**1. Virgin America (Order: 1)**
- Featured: `true`
- Order: `1`
- Featured Category: `UX Design`
- Featured Metric: `15% conversion lift`
- Featured Description: `Created the first responsive airline website, reimagining booking flows by focusing on decisions rather than clicks — achieving industry recognition and measurable business impact.`

**2. Casa Bonita (Order: 2)**
- Featured: `true`
- Order: `2`
- Featured Category: `Experience Design`
- Featured Metric: `Cultural icon revival`
- Featured Description: `Revived a beloved Colorado landmark by reimagining the customer experience, balancing nostalgia with modern hospitality design — from reservation flows to in-venue wayfinding.`

**3. Before Launcher (Order: 3)**
- Featured: `true`
- Order: `3`
- Featured Category: `Mobile Product`
- Featured Metric: `100K+ users`
- Featured Description: `Built a minimalist Android launcher focused on intentionality over distraction, reducing phone time through thoughtful UX and becoming a finalist for App of the Year.`

**All Others:**
- Featured: `false` (Target, Pedal, and any sample projects)

## Content Details

### Virgin America Sections (8 total)
1. **The Challenge** - Understanding the Real Problem
2. **Research Insights** - Clicks vs. Decisions
3. **The Solution** - Step-by-Step Booking Flow
4. **Technical Implementation** - Building on Legacy Systems
5. **Testing & Optimization** - Data-Driven Design
6. **Impact** - Industry-Defining Success
7. **Evolution** - Extending the Vision
8. **Reflections** - Key Takeaways

### Target Sections (6 total)
1. **The Context** - Huge's Biggest Client
2. **The Challenge** - Breaking Up with Amazon
3. **Strategy** - The Power of Inspirational Strategy
4. **Innovation** - The Future of Retail
5. **Program Management** - 20 Projects, One Program
6. **Data** - Modern Analytics for Modern E-commerce

### Pedal Sections (4 total)
1. **The Vision** - Competing with Peloton
2. **The Challenge** - Building More with Less
3. **The Product** - Multi-Studio Streaming Platform
4. **Impact** - Investment and Community

### Casa Bonita Sections (4 total)
1. **The Story** - A Colorado Icon
2. **The Challenge** - Legacy System Nightmare
3. **The Solution** - Modern Reservation Platform
4. **Impact** - Successful Launch

### Before Launcher Sections (4 total)
1. **The Vision** - AI Before Chatbots
2. **The Product** - Anticipatory Computing
3. **Challenges** - Teaching Users New Patterns
4. **Impact** - Microsoft Acquisition

## Rollback Plan

If migration causes issues:

```bash
# Migration creates documents with explicit _id values
# To remove all migrated content:
sanity documents delete virgin-america target pedal casa-bonita before-launcher
```

Or manually delete in Sanity Studio.

## Success Criteria

- [ ] All 5 case studies migrated successfully
- [ ] No console errors in browser
- [ ] All case study pages render correctly
- [ ] Homepage shows correct 3 featured case studies
- [ ] Narrative scroll layout displays properly
- [ ] Content is editable in Sanity Studio
- [ ] Deployed to Vercel successfully

## Next Steps After Migration

1. **Add Screenshots:** Upload actual project screenshots to Sanity and add to sections
2. **Add Hero Images:** Upload hero images for each case study
3. **Review Content:** Edit any narrative content for accuracy/clarity
4. **SEO Metadata:** Add meta descriptions and OpenGraph images
5. **Test Production:** Verify everything works on Vercel

## Notes

- Migration scripts use `createOrReplace()` - safe to run multiple times
- Each case study has explicit `_id` for predictable updates
- Scripts preserve existing document structure
- No data loss risk - can always re-run migrations
- Consider backing up Sanity dataset before migration (optional)

## Timeline

- **Phase 1 (Fix Token):** 5 minutes (manual)
- **Phase 2 (Run Scripts):** 2 minutes (automated)
- **Phase 3 (Verify Studio):** 10 minutes (manual review)
- **Phase 4 (Test Pages):** 15 minutes (manual testing)
- **Phase 5 (Homepage Featured):** 5 minutes (manual update)

**Total:** ~37 minutes
