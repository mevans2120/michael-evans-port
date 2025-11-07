# CMS Schema Cleanup Plan

**Date:** November 7, 2025  
**Project:** Michael Evans Portfolio  
**Auditor:** Claude Code  
**Status:** Ready for Review

---

## Executive Summary

This audit examined all Sanity CMS schemas to identify legacy, unused, and deprecated fields that have accumulated technical debt through multiple iterations of the portfolio site.

### Key Findings

- **Total Schemas Analyzed:** 11 document types + 1 object type
- **Deprecated Fields Identified:** 12 fields across 2 schemas (project, profile)
- **Fields with Data but Deprecated:** 6 fields (need migration)
- **Hidden Deprecated Fields:** 7 fields (safe to remove after data check)
- **Legacy Components Still in Use:** 2 components (need removal)

### Migration Status Overview

**Projects (12 total):**
- ✅ 9 projects fully migrated to `article` field (new format)
- ⚠️ 2 projects using legacy `slides` field but ALSO have `article` data
- ⚠️ 2 projects have legacy `sections`, `achievements`, `summary`, `description` data

**Profile:**
- ✅ Has `article` field (new format)
- ⚠️ Still has `sections` data (legacy format)

---

## Schema-by-Schema Analysis

### 1. Project Schema (`/sanity/schemas/project.ts`)

**Total Fields:** 24 fields (excluding nested object fields)  
**Deprecated Fields:** 7 fields  
**Impact:** High - Used in case study pages

#### Deprecated Fields Detail

| Field Name | Status | Hidden | Has Data | Currently Queried | Risk Level |
|------------|--------|--------|----------|------------------|------------|
| `heroImage` | [DEPRECATED] | ✅ Yes | ❌ No (0/12) | ❌ No | 🟢 Low |
| `summary` | [DEPRECATED] | ✅ Yes | ⚠️ Yes (2/12) | ❌ No | 🟡 Medium |
| `description` | [DEPRECATED] | ✅ Yes | ⚠️ Yes (2/12) | ❌ No | 🟡 Medium |
| `achievements` | [DEPRECATED] | ✅ Yes | ⚠️ Yes (2/12) | ❌ No | 🟡 Medium |
| `content` | [DEPRECATED] | ✅ Yes | ❌ No (0/12) | ❌ No | 🟢 Low |
| `slides` | [DEPRECATED] | ✅ Yes | ⚠️ Yes (6/12) | ✅ Yes | 🔴 High |
| `sections` | [DEPRECATED] | ✅ Yes | ⚠️ Yes (2/12) | ❌ No | 🟡 Medium |

#### Projects with Legacy Data

**Aesop (`_id: aesop`):**
- ✅ Has `article` (new format)
- ⚠️ Has `slides` (deprecated - can remove after verifying `article` is complete)
- ⚠️ Has `sections` (deprecated - very old format)
- ⚠️ Has `achievements` (deprecated)
- ⚠️ Has `summary` (deprecated)
- ⚠️ Has `description` (deprecated)

**Lyft (`_id: lyft`):**
- ✅ Has `article` (new format)
- ⚠️ Has `slides` (deprecated - can remove after verifying `article` is complete)
- ⚠️ Has `sections` (deprecated - very old format)
- ⚠️ Has `achievements` (deprecated)
- ⚠️ Has `summary` (deprecated)
- ⚠️ Has `description` (deprecated)

**Projects with `slides` only (need migration to `article`):**
- Before Launcher
- Casa Bonita
- Peddle
- Target
- Virgin America

**Note:** PostPal has `article` but no `slides` - fully migrated ✅

#### Current Query Usage

**File:** `/src/lib/sanity/queries.ts` - Line 86
```groq
slides[] {
  _key,
  sectionLabel,
  heading,
  content,
  quoteBox,
  comparisonBoxes,
  visualCards,
  annotation
}
```

**File:** `/src/app/(public)/case-studies/[slug]/page.tsx` - Line 93-119
```typescript
// Query still fetches both article AND slides
article,
slides[] { ... }

// Component logic at line 212-227 shows fallback:
{project.article && project.article.length > 0 ? (
  <FlowingArticle article={project.article} />
) : (
  project.slides?.map((slide: any) => ( ... ))
)}
```

**Interpretation:** Site prefers `article` but falls back to `slides` for legacy projects.

---

### 2. Profile Schema (`/sanity/schemas/profile.ts`)

**Total Fields:** 21 fields (excluding nested object fields)  
**Deprecated Fields:** 5 fields  
**Impact:** Medium - Used in about page

#### Deprecated Fields Detail

| Field Name | Status | Hidden | Has Data | Currently Queried | Risk Level |
|------------|--------|--------|----------|------------------|------------|
| `sections` | [DEPRECATED] | ✅ Yes | ✅ Yes (1/1) | ⚠️ Yes (scripts) | 🟡 Medium |
| `bio` | Legacy | ❌ No | ❌ No | ⚠️ Yes (types) | 🟢 Low |
| `skills` | Legacy | ❌ No | ❌ No | ⚠️ Yes (types) | 🟢 Low |
| `title` | Legacy | ❌ No | ❓ Unknown | ⚠️ Yes (queries) | 🟡 Medium |
| `tagline` | Legacy | ❌ No | ❓ Unknown | ⚠️ Yes (queries) | 🟡 Medium |

#### Current Data Status

**Profile document (_id: profile):**
- ✅ Has `article` (new format)
- ⚠️ Has `sections` (deprecated - old format)
- ❌ No `bio` data
- ❌ No `skills` data
- ❓ Need to check `title` and `tagline` usage

#### Current Query Usage

**File:** `/src/lib/sanity/queries.ts` - Line 154-167
```groq
*[_type == "profile"][0] {
  _id,
  name,
  title,      // ⚠️ Legacy field still queried
  tagline,    // ⚠️ Legacy field still queried
  bio,
  profileImage,
  "profileImageUrl": profileImage.asset->url,
  skills,
  experience,
  social
}
```

**File:** `/src/scripts/check-section-content.ts` - Line 24
```typescript
profile.sections.forEach((section: any, index: number) => {
  // Script still checks sections field
})
```

---

### 3. Blog Schema (`/sanity/schemas/blog.ts`)

**Status:** ✅ Clean - No deprecated fields  
**Total Fields:** 13 fields  
**Notes:** Well-structured, uses current patterns

---

### 4. AI Showcase Schema (`/sanity/schemas/aiShowcase.ts`)

**Status:** ✅ Clean - No deprecated fields  
**Total Fields:** 13 fields  
**Notes:** Uses `slides` field but this is NOT deprecated (different purpose than project slides)

---

### 5. Other Schemas

All other schemas are clean with no deprecated fields:
- ✅ `homepageHero` - Clean
- ✅ `footer` - Clean
- ✅ `chatPrompts` - Clean
- ✅ `seoSettings` - Clean
- ✅ `timelinePhase` - Clean
- ✅ `workflowStep` - Clean
- ✅ `projectCard` - Clean
- ✅ `seo` (object type) - Clean

---

## Pattern Recognition

### Duplicate/Similar Fields

1. **Summary fields across schemas:**
   - `project.summary` (deprecated) → `project.heroSection.summary` (current)
   - Consolidated successfully

2. **Description fields:**
   - `project.description` (deprecated) → `project.heroSection.subtitle` (current)
   - Consolidated successfully

3. **Content format evolution:**
   ```
   Old format:     project.sections[]
                      ↓ (migration 1)
   Middle format:  project.slides[]
                      ↓ (migration 2)
   Current format: project.article[]
   ```

### Fields with TODO/Notes

**None found** - All deprecated fields are properly marked with `[DEPRECATED]` prefix and warning descriptions.

---

## Migration Status Assessment

### Content Migration Evidence

Checked via Sanity CLI query on production dataset:

**Projects using new `article` format:** 9/12 projects
- PostPal ✅ (article only, no legacy data)
- Virgin America ✅
- Casa Bonita ✅
- Before Launcher ✅
- Target ✅
- Peddle ✅
- Aesop ⚠️ (has article + legacy data)
- Lyft ⚠️ (has article + legacy data)
- (1 more not listed)

**Projects still using legacy `slides`:** 5 projects
- Before Launcher
- Casa Bonita  
- Peddle
- Target
- Virgin America

**Note:** All 5 projects with `slides` ALSO have `article` data, suggesting migration is complete but old data wasn't cleaned up.

**Projects with old `sections` format:** 2 projects
- Aesop
- Lyft

**Projects with NO content yet:** 3 projects
- Playstation Vue
- Houselogic (NAR)
- Peacock
- Teaching Books

---

## Risk Assessment

### High Risk: Currently Used in Live Site

| Field | Schema | Reason | Breakage Impact |
|-------|--------|--------|-----------------|
| `slides[]` | project | Queried in `/src/lib/sanity/queries.ts` and used as fallback in case study page | 5 case studies would lose content if removed without migration |

**Mitigation:** Must migrate all `slides` data to `article` format before removal.

---

### Medium Risk: Has Data But Not Actively Used

| Field | Schema | Reason | Data Migration Needed |
|-------|--------|--------|---------------------|
| `sections[]` | project | 2 projects have data (very old format) | Archive or discard (superseded by `article`) |
| `achievements[]` | project | 2 projects have data | Could extract to `article` as list blocks |
| `summary` | project | 2 projects have data | Data likely duplicated in `heroSection.summary` |
| `description` | project | 2 projects have data | Data likely duplicated in `heroSection.subtitle` |
| `sections[]` | profile | 1 profile has data | Archive or discard (superseded by `article`) |

**Mitigation:** Export data for archival before deletion, verify duplication.

---

### Low Risk: Hidden Deprecated Fields with No Data

| Field | Schema | Reason |
|-------|--------|--------|
| `heroImage` | project | No projects have data (0/12) |
| `content[]` | project | No projects have data (0/12) |
| `bio` | profile | No data in production |
| `skills` | profile | No data in production (capabilities used instead) |

**Mitigation:** Safe to remove immediately after final data verification.

---

### Low Risk: Legacy Fields (Not Marked Deprecated)

| Field | Schema | Status | Action |
|-------|--------|--------|--------|
| `title` | profile | Still queried but may be redundant | Check if `heroHeadline` replaces it |
| `tagline` | profile | Still queried but may be redundant | Check if `heroHeadline` replaces it |

**Mitigation:** Verify current usage before marking deprecated.

---

## Phased Cleanup Plan

### Phase 1: Data Verification & Export (Est. 1 hour)

**Goal:** Ensure no data loss, create backups, verify migration completeness

#### Step 1.1: Export Legacy Data for Archival

Create backup exports of all deprecated fields with data:

```bash
# Export projects with legacy data
npx sanity@latest documents query \
  '*[_type == "project" && (defined(slides) || defined(sections) || defined(achievements) || defined(summary) || defined(description))]' \
  --dataset production > backups/projects-legacy-fields-$(date +%Y%m%d).json

# Export profile sections
npx sanity@latest documents query \
  '*[_type == "profile"][0]{ sections }' \
  --dataset production > backups/profile-sections-$(date +%Y%m%d).json
```

#### Step 1.2: Verify Migration Completeness

For each project with `slides`, compare against `article` to ensure content is equivalent:

**Projects to check:**
- Aesop
- Lyft  
- Before Launcher
- Casa Bonita
- Peddle
- Target
- Virgin America

**Verification query:**
```groq
*[_type == "project" && _id == "aesop"][0]{
  title,
  "hasArticle": defined(article),
  "articleBlockCount": length(article),
  "hasSlides": defined(slides),
  "slidesCount": length(slides),
  "hasSections": defined(sections),
  "sectionsCount": length(sections)
}
```

**Manual verification in Studio:**
1. Open http://localhost:3000/studio
2. Open each project listed above
3. Compare `article` content with `slides` content visually
4. Ensure all text, images, stats are present in `article` field
5. Document any missing content

#### Step 1.3: Check for Duplicate Data

Verify that `summary`/`description` deprecated fields contain same data as `heroSection` fields:

```groq
*[_type == "project" && (defined(summary) || defined(description))][]{
  title,
  summary,
  description,
  "heroSummary": heroSection.summary,
  "heroSubtitle": heroSection.subtitle
}
```

Expected result: Deprecated fields should match current fields.

#### Step 1.4: Identify Components Using Deprecated Fields

**Known Legacy Components:**
- `/src/components/case-studies/detail/CaseStudyAchievements.tsx` - Uses `achievements[]`
- `/src/scripts/check-section-content.ts` - Uses `sections[]`

**Search for other usages:**
```bash
# Search entire codebase
grep -r "achievements" src/ --include="*.tsx" --include="*.ts"
grep -r "\.slides" src/ --include="*.tsx" --include="*.ts"  
grep -r "\.sections" src/ --include="*.tsx" --include="*.ts"
```

**Action:** Create list of files that need updating.

---

### Phase 2: Safe Removals (Est. 30 minutes)

**Goal:** Remove deprecated fields that have no data and no usage

#### Prerequisites
- ✅ Phase 1 complete
- ✅ Backups created
- ✅ Data verified as empty

#### Step 2.1: Remove Unused Hidden Fields from Project Schema

Edit `/sanity/schemas/project.ts` and **delete** these field definitions:

- `heroImage` (lines 66-75) - No data in any project
- `content` (lines 120-133) - No data in any project

**Before:**
```typescript
defineField({
  name: 'heroImage',
  title: '[DEPRECATED] Hero Image',
  type: 'image',
  // ...
  hidden: true,
}),
```

**After:** (delete entire field definition)

#### Step 2.2: Remove Unused Fields from Profile Schema  

Edit `/sanity/schemas/profile.ts` and **delete** these field definitions (if verified as unused):

- `bio` (lines 611-616) - No data, marked legacy
- `skills` (lines 617-640) - No data, marked legacy

**Verify first:**
```groq
*[_type == "profile"][0]{ "hasBio": defined(bio), "hasSkills": defined(skills) }
```

Expected: `{ "hasBio": false, "hasSkills": false }`

#### Step 2.3: Remove from TypeScript Types

Edit `/src/lib/sanity/types.ts`:

**Delete these type properties:**
```typescript
// From SanityProject interface (lines 30-43)
summary?: string          // ← DELETE
description?: string      // ← DELETE  
heroImage?: { ... }       // ← DELETE
achievements?: string[]   // ← DELETE
content?: PortableTextBlock[]  // ← DELETE

// From SanityProfile interface (lines 57, 64-67)
bio?: PortableTextBlock[]  // ← DELETE (if verified unused)
skills?: Array<{ ... }>    // ← DELETE (if verified unused)
```

#### Step 2.4: Verify Build Still Works

```bash
npm run build
```

Expected: Clean build with no type errors.

---

### Phase 3: Data Migrations (Est. 2-3 hours)

**Goal:** Migrate remaining projects from `slides` to `article` format

#### Prerequisites
- ✅ Phase 2 complete
- ✅ Verification queries confirm projects need migration

#### Projects Requiring Migration

Based on audit, these 5 projects have `slides` but may need `article` migration verification:
- Before Launcher
- Casa Bonita
- Peddle
- Target
- Virgin America

**Note:** All 5 already have `article` data. Migration may be complete, just need to verify and clean up.

#### Step 3.1: Verify Each Project's Article Content

For each project, open in Studio and verify:

1. **Open Sanity Studio:** http://localhost:3000/studio
2. **Navigate to Projects**
3. **Open project** (e.g., "Before Launcher")
4. **Check "Article Content (Flowing Editorial)" field:**
   - Is it populated?
   - Does it contain all content from the deprecated "Content Slides" field?
5. **If article is complete:**
   - Move to Phase 4 (cleanup)
6. **If article is incomplete or empty:**
   - Need manual migration (see Step 3.2)

#### Step 3.2: Manual Migration Process (If Needed)

If any project has incomplete `article` data:

1. **Open deprecated `slides` field** (it's hidden, may need to unhide temporarily)
2. **For each slide:**
   - Copy heading → Add as H2 block to `article`
   - Copy content → Add as paragraph blocks to `article`  
   - If has stat/quote → Add as Stat Block to `article`
   - If has comparison boxes → Add as text or stat blocks
   - If has visual cards → Add as image blocks to `article`
3. **Save project**
4. **Preview on site** to verify formatting
5. **Repeat for each project**

**Alternative (Automated):**

Create migration script at `/src/scripts/migrate-slides-to-article.ts`:

```typescript
// Script to convert slides[] to article[] format
// For projects that still have slides but incomplete article
```

*Note: Only create script if multiple projects need migration. For 1-2 projects, manual migration is faster.*

#### Step 3.3: Migrate Achievements Data (If Desired)

For Aesop and Lyft projects with `achievements[]` data:

**Option A: Add to Article as List**
1. Open project in Studio
2. At end of `article` field, add new paragraph block
3. Add heading: "Key Achievements"
4. Add bullet list with achievements from old field

**Option B: Discard (If Redundant)**
- If achievements are already mentioned in `article` content, simply delete deprecated field data

#### Step 3.4: Handle Profile Sections

For profile with `sections[]` data:

**Verify article field completeness:**
```groq
*[_type == "profile"][0]{
  "hasArticle": defined(article),
  "articleBlockCount": length(article),
  "hasSections": defined(sections),
  "sectionsCount": length(sections),
  sections[]{ heading }
}
```

**If sections contain content not in article:**
1. Open profile in Studio  
2. Review `sections` content
3. Add missing content to `article` field
4. Save

**If article is complete:**
- Proceed to Phase 4 cleanup

---

### Phase 4: Consolidation (Est. 1 hour)

**Goal:** Remove deprecated fields that had data but are now fully migrated

#### Prerequisites
- ✅ Phase 3 complete
- ✅ All data migrated to new format
- ✅ Verification complete

#### Step 4.1: Remove Project Deprecated Fields with Data

Edit `/sanity/schemas/project.ts` and **delete** these field definitions:

- `summary` (lines 76-83)
- `description` (lines 84-91)  
- `achievements` (lines 112-119)
- `slides` (lines 211-390)
- `sections` (lines 660-788)

**Important:** Only delete after verifying data is migrated or archived.

#### Step 4.2: Remove Profile Deprecated Sections Field

Edit `/sanity/schemas/profile.ts` and **delete**:

- `sections` (lines 373-455)

#### Step 4.3: Remove Legacy Queries

Edit `/src/lib/sanity/queries.ts`:

**Delete or update these queries:**

Line 86-95: Remove `slides[]` from `projectQuery`:
```typescript
// BEFORE
slides[] {
  _key,
  sectionLabel,
  // ... delete this entire block
},

// AFTER  
// (remove entirely)
```

Line 154-167: Update `profileQuery` to remove legacy fields:
```typescript
// BEFORE
*[_type == "profile"][0] {
  _id,
  name,
  title,      // ← Check if still needed
  tagline,    // ← Check if still needed  
  bio,        // ← DELETE
  profileImage,
  "profileImageUrl": profileImage.asset->url,
  skills,     // ← DELETE
  experience,
  social
}

// AFTER
*[_type == "profile"][0] {
  _id,
  name,
  profileImage,
  "profileImageUrl": profileImage.asset->url,
  experience,
  social
}
```

#### Step 4.4: Update Case Study Page Query

Edit `/src/app/(public)/case-studies/[slug]/page.tsx`:

**Remove `slides` query (lines 93-119):**
```typescript
// BEFORE
const EDITORIAL_PROJECT_QUERY = `*[_type == "project" && slug.current == $slug][0] {
  // ...
  article,
  slides[] {    // ← DELETE this entire block
    _key,
    // ...
  },
  // ...
}

// AFTER  
const EDITORIAL_PROJECT_QUERY = `*[_type == "project" && slug.current == $slug][0] {
  // ...
  article,    // Keep only article
  // ...
}
```

**Remove fallback logic (lines 212-227):**
```typescript
// BEFORE
{project.article && project.article.length > 0 ? (
  <FlowingArticle article={project.article} />
) : (
  project.slides?.map((slide: any) => ( ... ))  // ← DELETE this
)}

// AFTER
<FlowingArticle article={project.article} />  // Only article, no fallback
```

**Update TypeScript interface (lines 36-64):**
```typescript
// DELETE this property
slides?: Array<{ ... }>  // ← DELETE entire slides definition
```

#### Step 4.5: Remove Legacy Components

**Delete these component files:**
- `/src/components/case-studies/detail/CaseStudyAchievements.tsx` - No longer needed
- `/src/components/CaseStudySections.tsx` - If exists and unused
- `/src/components/CaseStudyNarrative.tsx` - If exists and unused

**Update index exports:**
- `/src/components/case-studies/detail/index.ts` - Remove `CaseStudyAchievements` export

**Search for remaining imports:**
```bash
grep -r "CaseStudyAchievements" src/ --include="*.tsx" --include="*.ts"
grep -r "ContentSlide" src/ --include="*.tsx" --include="*.ts"
```

**Note:** `ContentSlide` is used by AI Showcase, so don't delete if imported there.

#### Step 4.6: Remove Migration Scripts

**Delete or move to archive:**
- `/src/scripts/check-section-content.ts` - No longer needed
- `/src/scripts/migrate-case-studies.ts` - Archive (may need reference)
- `/src/scripts/export-case-studies-ndjson.ts` - Archive
- `/src/scripts/migrate-virgin-america-narrative.ts` - Archive

**Create archive directory:**
```bash
mkdir -p backups/migration-scripts-archive-$(date +%Y%m%d)
mv src/scripts/migrate-*.ts backups/migration-scripts-archive-$(date +%Y%m%d)/
mv src/scripts/export-*.ts backups/migration-scripts-archive-$(date +%Y%m%d)/
mv src/scripts/check-*.ts backups/migration-scripts-archive-$(date +%Y%m%d)/
```

#### Step 4.7: Clean Up Chatbot Fetcher Types

Edit `/src/lib/chatbot/sanity-fetcher.ts`:

**Remove deprecated type properties (lines 44-47, 122-124):**
```typescript
// DELETE
content?: PortableTextBlock[];
achievements?: string[];
```

---

### Phase 5: Verification (Est. 30 minutes)

**Goal:** Ensure site works correctly after cleanup

#### Step 5.1: Run Type Checking

```bash
npm run build
```

Expected: Clean build with no errors.

#### Step 5.2: Test Case Study Pages

**Test each case study in browser:**

1. Start dev server: `npm run dev`
2. Visit each case study:
   - http://localhost:3000/case-studies/virgin-america
   - http://localhost:3000/case-studies/casa-bonita
   - http://localhost:3000/case-studies/before-launcher
   - http://localhost:3000/case-studies/target
   - http://localhost:3000/case-studies/peddle
   - http://localhost:3000/case-studies/aesop
   - http://localhost:3000/case-studies/lyft
   - http://localhost:3000/case-studies/postpal
3. Verify:
   - ✅ Hero section displays correctly
   - ✅ Metrics display (if present)
   - ✅ Article content flows correctly
   - ✅ Stat blocks appear inline
   - ✅ Images display with captions
   - ✅ No console errors
   - ✅ Technologies section appears
   - ✅ CTA button works

#### Step 5.3: Test About Page

1. Visit: http://localhost:3000/about
2. Verify:
   - ✅ Profile data loads
   - ✅ Article content displays
   - ✅ No errors about missing fields

#### Step 5.4: Test Sanity Studio

1. Visit: http://localhost:3000/studio
2. Test each document type:
   - ✅ Projects load without errors
   - ✅ Profile loads without errors
   - ✅ No "unknown field" warnings
   - ✅ Can edit and save documents
3. Verify deprecated fields are gone:
   - ✅ No `[DEPRECATED]` fields visible
   - ✅ No hidden fields with old data

#### Step 5.5: Run GROQ Queries

**Verify no orphaned data:**
```bash
# Should return empty or expected data
npx sanity@latest documents query \
  '*[_type == "project"]{ "hasSlides": defined(slides) }' \
  --dataset production

# Expected: All projects should have "hasSlides": false
```

#### Step 5.6: Check Chatbot Ingestion

**Verify chatbot can still ingest Sanity content:**
```bash
npm run ingest
```

Expected: No errors about missing fields.

---

## Risk Matrix

| Field | Schema | Risk Level | Reason | Dependencies | Rollback Strategy |
|-------|--------|------------|--------|--------------|-------------------|
| `heroImage` | project | 🟢 Low | No data, not queried | None | Re-add field definition |
| `content` | project | 🟢 Low | No data, not queried | None | Re-add field definition |
| `summary` | project | 🟡 Medium | 2 projects have data | Verify duplication | Restore from backup |
| `description` | project | 🟡 Medium | 2 projects have data | Verify duplication | Restore from backup |
| `achievements` | project | 🟡 Medium | 2 projects have data | 1 component uses it | Keep component, restore field |
| `slides` | project | 🔴 High | 6 projects have data, actively queried | Case study page, queries | Restore query + component |
| `sections` (project) | project | 🟡 Medium | 2 projects have data (old) | None (superseded) | Restore from backup |
| `sections` (profile) | profile | 🟡 Medium | 1 profile has data | 1 script uses it | Restore from backup |
| `bio` | profile | 🟢 Low | No data | Type definitions only | Re-add field definition |
| `skills` | profile | 🟢 Low | No data | Type definitions only | Re-add field definition |

---

## Implementation Checklist

### Pre-Flight Checklist

- [ ] Review this entire plan
- [ ] Get user approval to proceed  
- [ ] Ensure git working directory is clean
- [ ] Create feature branch: `git checkout -b cleanup/cms-schema-deprecated-fields`
- [ ] Ensure Sanity Studio is accessible
- [ ] Ensure you have write access to production dataset

---

### Phase 1: Data Verification & Export

- [ ] Create backups directory: `mkdir -p backups`
- [ ] Export projects with legacy data (Step 1.1)
- [ ] Export profile sections (Step 1.1)
- [ ] Run verification query for each project (Step 1.2)
- [ ] Manually verify article vs slides content in Studio (Step 1.2)
- [ ] Document any missing content
- [ ] Run duplicate data query (Step 1.3)
- [ ] Search codebase for legacy component usage (Step 1.4)
- [ ] Create list of files to update

**Deliverable:** Backup files in `/backups` directory + verification report

---

### Phase 2: Safe Removals

- [ ] Verify `heroImage` has no data
- [ ] Delete `heroImage` field from `/sanity/schemas/project.ts`
- [ ] Verify `content` has no data  
- [ ] Delete `content` field from `/sanity/schemas/project.ts`
- [ ] Verify `bio` has no data
- [ ] Delete `bio` field from `/sanity/schemas/profile.ts` (if verified)
- [ ] Verify `skills` has no data
- [ ] Delete `skills` field from `/sanity/schemas/profile.ts` (if verified)
- [ ] Update `/src/lib/sanity/types.ts` (remove deleted fields)
- [ ] Run `npm run build` to verify

**Deliverable:** Clean build, no unused fields

---

### Phase 3: Data Migrations

- [ ] Verify Before Launcher article content (Step 3.1)
- [ ] Verify Casa Bonita article content
- [ ] Verify Peddle article content
- [ ] Verify Target article content
- [ ] Verify Virgin America article content
- [ ] If any incomplete: Perform manual migration (Step 3.2)
- [ ] Decide on achievements migration approach (Step 3.3)
- [ ] Migrate Aesop achievements (if keeping)
- [ ] Migrate Lyft achievements (if keeping)
- [ ] Verify profile article completeness (Step 3.4)
- [ ] Migrate profile sections if needed

**Deliverable:** All projects using `article` format, no content loss

---

### Phase 4: Consolidation

- [ ] Delete `summary` field from `/sanity/schemas/project.ts`
- [ ] Delete `description` field from `/sanity/schemas/project.ts`
- [ ] Delete `achievements` field from `/sanity/schemas/project.ts`
- [ ] Delete `slides` field from `/sanity/schemas/project.ts`
- [ ] Delete `sections` field from `/sanity/schemas/project.ts`
- [ ] Delete `sections` field from `/sanity/schemas/profile.ts`
- [ ] Remove `slides[]` from `/src/lib/sanity/queries.ts` (Step 4.3)
- [ ] Update profileQuery in `/src/lib/sanity/queries.ts` (Step 4.3)
- [ ] Remove `slides` query from case study page (Step 4.4)
- [ ] Remove fallback logic in case study page (Step 4.4)
- [ ] Update case study page TypeScript interface (Step 4.4)
- [ ] Delete `/src/components/case-studies/detail/CaseStudyAchievements.tsx` (Step 4.5)
- [ ] Update `/src/components/case-studies/detail/index.ts` exports
- [ ] Search for and remove remaining legacy component imports
- [ ] Archive migration scripts (Step 4.6)
- [ ] Update `/src/lib/chatbot/sanity-fetcher.ts` types (Step 4.7)
- [ ] Run `npm run build` to verify

**Deliverable:** Clean schemas, updated queries, no legacy code

---

### Phase 5: Verification

- [ ] Run `npm run build` successfully (Step 5.1)
- [ ] Test Virgin America case study (Step 5.2)
- [ ] Test Casa Bonita case study
- [ ] Test Before Launcher case study
- [ ] Test Target case study
- [ ] Test Peddle case study
- [ ] Test Aesop case study
- [ ] Test Lyft case study
- [ ] Test PostPal case study
- [ ] Test About page (Step 5.3)
- [ ] Test Sanity Studio - Projects (Step 5.4)
- [ ] Test Sanity Studio - Profile
- [ ] Verify no deprecated fields visible in Studio
- [ ] Run GROQ verification query (Step 5.5)
- [ ] Test chatbot ingestion (Step 5.6)
- [ ] Run full test suite (if exists)

**Deliverable:** All tests passing, site functioning correctly

---

### Post-Cleanup Checklist

- [ ] Review all changes
- [ ] Commit changes with descriptive message
- [ ] Push to remote branch
- [ ] Create pull request
- [ ] Request review (if applicable)
- [ ] Deploy to staging for final testing
- [ ] Deploy to production
- [ ] Monitor for errors in production
- [ ] Update this document with completion date
- [ ] Document any issues encountered
- [ ] Archive this plan in `/docs/audits-evals/`

---

## Data Preservation Strategy

### What to Keep

**Archive Location:** `/backups/cms-cleanup-YYYYMMDD/`

1. **Full JSON exports:**
   - `projects-legacy-fields.json` - All projects with deprecated field data
   - `profile-sections.json` - Profile sections field data

2. **Migration scripts:**
   - All scripts in `/backups/migration-scripts-archive-YYYYMMDD/`
   - Keep indefinitely for reference

3. **Verification queries:**
   - Document all verification queries run
   - Save results for comparison

### Retention Policy

- **Immediate backups:** Keep for 90 days minimum
- **Migration scripts:** Keep indefinitely (low storage cost)
- **Production dataset backups:** Sanity provides automatic backups (verify retention policy)

### Rollback Plan

If issues are discovered after cleanup:

1. **Restore field definitions** from git history
2. **Restore data** from JSON exports using Sanity CLI:
   ```bash
   # Restore specific field data
   npx sanity@latest dataset import backups/projects-legacy-fields.json production
   ```
3. **Restore queries** from git history
4. **Redeploy** previous version

**Rollback window:** 30 days (while backups are fresh)

---

## Testing Verification Steps

### Manual Testing Checklist

**Case Study Pages:**
- [ ] Hero section displays title, subtitle, summary
- [ ] Metrics cards display correctly  
- [ ] Article content renders with proper formatting
- [ ] Stat blocks (number, quote, text) display inline
- [ ] Images display with captions
- [ ] Code blocks render with syntax highlighting
- [ ] Videos embed correctly
- [ ] Technologies section appears
- [ ] CTA button functions
- [ ] No missing content vs. original slides

**About Page:**
- [ ] Profile information displays
- [ ] Article content flows correctly
- [ ] Stat blocks appear inline
- [ ] Quick facts display
- [ ] Capabilities list appears
- [ ] No missing content vs. original sections

**Sanity Studio:**
- [ ] No "unknown field" errors in console
- [ ] Can create new project
- [ ] Can edit existing project
- [ ] Article field editor works
- [ ] Stat block insertion works
- [ ] Image upload works
- [ ] Can save changes
- [ ] No deprecated fields visible

---

## GROQ Queries for Verification

### Check for Remaining Deprecated Field Data

```groq
// After cleanup, this should return 0 projects
*[_type == "project" && (
  defined(heroImage) || 
  defined(summary) || 
  defined(description) || 
  defined(achievements) || 
  defined(content) || 
  defined(slides) || 
  defined(sections)
)]{ 
  title, 
  "deprecatedFields": {
    "heroImage": defined(heroImage),
    "summary": defined(summary),
    "description": defined(description),
    "achievements": defined(achievements),
    "content": defined(content),
    "slides": defined(slides),
    "sections": defined(sections)
  }
}
```

### Check Profile for Deprecated Fields

```groq
*[_type == "profile"][0]{
  "deprecatedFields": {
    "sections": defined(sections),
    "bio": defined(bio),
    "skills": defined(skills)
  }
}
```

Expected result after cleanup:
```json
{
  "deprecatedFields": {
    "sections": false,
    "bio": false,
    "skills": false
  }
}
```

### Verify All Projects Have Article Field

```groq
*[_type == "project"]{ 
  title, 
  "hasArticle": defined(article), 
  "articleBlockCount": length(article) 
} | order(title asc)
```

Expected: All projects should have `hasArticle: true` and `articleBlockCount > 0`

---

## Migration Script Templates

### Template 1: Export Deprecated Fields

```bash
#!/bin/bash
# export-deprecated-fields.sh

DATE=$(date +%Y%m%d)
BACKUP_DIR="backups/cms-cleanup-$DATE"

mkdir -p "$BACKUP_DIR"

echo "Exporting deprecated project fields..."
npx sanity@latest documents query \
  '*[_type == "project" && (defined(slides) || defined(sections) || defined(achievements) || defined(summary) || defined(description))]' \
  --dataset production > "$BACKUP_DIR/projects-legacy-fields.json"

echo "Exporting profile sections..."
npx sanity@latest documents query \
  '*[_type == "profile"][0]{ sections }' \
  --dataset production > "$BACKUP_DIR/profile-sections.json"

echo "Export complete. Files saved to $BACKUP_DIR"
```

### Template 2: Verify Migration Completeness

```typescript
// verify-migration.ts
import { client } from '@/sanity/lib/client'

async function verifyMigration() {
  const projects = await client.fetch(`
    *[_type == "project"]{
      title,
      _id,
      "hasArticle": defined(article),
      "hasSlides": defined(slides),
      "articleBlockCount": length(article),
      "slidesCount": length(slides)
    }
  `)

  console.log('Migration Status:')
  console.log('=================')
  
  projects.forEach((p: any) => {
    const status = p.hasArticle ? '✅' : '❌'
    const legacy = p.hasSlides ? '⚠️  (has legacy slides)' : ''
    console.log(`${status} ${p.title} ${legacy}`)
    console.log(`   Article blocks: ${p.articleBlockCount || 0}`)
    console.log(`   Slides: ${p.slidesCount || 0}`)
  })
}

verifyMigration()
```

---

## Success Criteria

Cleanup is considered successful when:

- ✅ All deprecated field definitions removed from schemas
- ✅ All queries updated to not reference deprecated fields
- ✅ All components updated to not use deprecated fields
- ✅ `npm run build` completes successfully
- ✅ All case study pages display correctly
- ✅ About page displays correctly
- ✅ Sanity Studio has no errors or warnings
- ✅ No deprecated fields visible in Studio
- ✅ Chatbot ingestion works without errors
- ✅ All data archived in `/backups/`
- ✅ Production site functioning normally

---

## Related Documentation

- **Previous Audit:** [Site & CMS Audit (Oct 25, 2025)](/docs/audits-evals/site-cms-audit-2025-10-25.md)
- **Migration Plans:**
  - [Case Study Editorial Migration Plan](/docs/implementation-plans/case-study-editorial-migration-plan.md)
  - [AI Showcase Editorial Migration Plan](/docs/implementation-plans/ai-showcase-editorial-migration-plan-110225.md)
- **Schema Documentation:** [Sanity Schemas README](/sanity/schemas/README.md) (if exists)
- **Project Guidelines:** [CLAUDE.md](/CLAUDE.md)

---

## Notes & Observations

### Why This Cleanup Matters

1. **Reduces Confusion:** Content editors won't see deprecated fields
2. **Improves Performance:** Fewer fields to query and validate
3. **Cleaner Codebase:** Easier to maintain and understand
4. **Better TypeScript Support:** Accurate types, better autocomplete
5. **Prevents Errors:** Can't accidentally use old fields

### Lessons Learned

1. **Migration was successful but incomplete:** Most content migrated to new `article` format, but old data not cleaned up
2. **Hidden fields still take up space:** Even though hidden in UI, they exist in database
3. **Queries need updating:** Just hiding a field doesn't remove it from queries
4. **Components lag behind schemas:** Legacy components still reference old fields

### Future Prevention

1. **Migration checklist should include:**
   - [ ] Migrate data to new format
   - [ ] Update all queries
   - [ ] Update all components
   - [ ] Delete old field definitions
   - [ ] Remove from types
   - [ ] Test thoroughly
2. **Use feature flags** for gradual migration
3. **Set deprecation timeline** (e.g., "Will be removed in 30 days")
4. **Automated migration tracking** (script to check for deprecated field usage)

---

## Completion Status

- **Plan Created:** November 7, 2025
- **Plan Approved:** _Pending user review_
- **Phase 1 Complete:** _Not started_
- **Phase 2 Complete:** _Not started_
- **Phase 3 Complete:** _Not started_
- **Phase 4 Complete:** _Not started_
- **Phase 5 Complete:** _Not started_
- **Production Deployed:** _Not started_
- **Final Verification:** _Not started_

---

## Appendix A: Field Usage Summary

### Project Schema Fields

| Field | Deprecated | Hidden | Has Data (n/12) | Queried | Used in Components | Status |
|-------|-----------|--------|-----------------|---------|-------------------|---------|
| `title` | ❌ No | ❌ No | 12/12 | ✅ Yes | ✅ Yes | ✅ Keep |
| `slug` | ❌ No | ❌ No | 12/12 | ✅ Yes | ✅ Yes | ✅ Keep |
| `category` | ❌ No | ❌ No | 12/12 | ✅ Yes | ✅ Yes | ✅ Keep |
| `heroSection` | ❌ No | ❌ No | 12/12 | ✅ Yes | ✅ Yes | ✅ Keep |
| `heroImage` | ✅ Yes | ✅ Yes | 0/12 | ❌ No | ❌ No | 🗑️ Remove Phase 2 |
| `summary` | ✅ Yes | ✅ Yes | 2/12 | ❌ No | ❌ No | 🗑️ Remove Phase 4 |
| `description` | ✅ Yes | ✅ Yes | 2/12 | ❌ No | ❌ No | 🗑️ Remove Phase 4 |
| `metrics` | ❌ No | ❌ No | ~8/12 | ✅ Yes | ✅ Yes | ✅ Keep |
| `achievements` | ✅ Yes | ✅ Yes | 2/12 | ❌ No | ✅ Yes | 🗑️ Remove Phase 4 |
| `content` | ✅ Yes | ✅ Yes | 0/12 | ❌ No | ❌ No | 🗑️ Remove Phase 2 |
| `technologies` | ❌ No | ❌ No | ~10/12 | ✅ Yes | ✅ Yes | ✅ Keep |
| `liveUrl` | ❌ No | ❌ No | ~5/12 | ✅ Yes | ❌ No | ✅ Keep |
| `githubUrl` | ❌ No | ❌ No | ~3/12 | ✅ Yes | ❌ No | ✅ Keep |
| `publishedAt` | ❌ No | ❌ No | ~10/12 | ✅ Yes | ❌ No | ✅ Keep |
| `featured` | ❌ No | ❌ No | 12/12 | ✅ Yes | ✅ Yes | ✅ Keep |
| `order` | ❌ No | ❌ No | ~8/12 | ✅ Yes | ❌ No | ✅ Keep |
| `featuredMetric` | ❌ No | ❌ No | ~4/12 | ✅ Yes | ❌ No | ✅ Keep |
| `featuredDescription` | ❌ No | ❌ No | ~4/12 | ✅ Yes | ❌ No | ✅ Keep |
| `overview` | ❌ No | ❌ No | ~8/12 | ✅ Yes | ✅ Yes | ✅ Keep |
| `slides` | ✅ Yes | ✅ Yes | 6/12 | ✅ Yes | ✅ Yes | 🗑️ Remove Phase 4 |
| `article` | ❌ No | ❌ No | 9/12 | ✅ Yes | ✅ Yes | ✅ Keep |
| `callToAction` | ❌ No | ❌ No | ~6/12 | ✅ Yes | ✅ Yes | ✅ Keep |
| `sections` | ✅ Yes | ✅ Yes | 2/12 | ❌ No | ❌ No | 🗑️ Remove Phase 4 |
| `featuredImage` | ❌ No | ❌ No | ~8/12 | ✅ Yes | ✅ Yes | ✅ Keep |
| `seo` | ❌ No | ❌ No | ~12/12 | ✅ Yes | ✅ Yes | ✅ Keep |

### Profile Schema Fields

| Field | Deprecated | Hidden | Has Data | Queried | Status |
|-------|-----------|--------|----------|---------|---------|
| `name` | ❌ No | ❌ No | ✅ Yes | ✅ Yes | ✅ Keep |
| `profileImage` | ❌ No | ❌ No | ✅ Yes | ✅ Yes | ✅ Keep |
| `heroHeadline` | ❌ No | ❌ No | ✅ Yes | ❌ No | ✅ Keep |
| `heroSubheadline` | ❌ No | ❌ No | ✅ Yes | ❌ No | ✅ Keep |
| `heroIntro` | ❌ No | ❌ No | ✅ Yes | ❌ No | ✅ Keep |
| `quickFacts` | ❌ No | ❌ No | ✅ Yes | ❌ No | ✅ Keep |
| `capabilities` | ❌ No | ❌ No | ✅ Yes | ❌ No | ✅ Keep |
| `article` | ❌ No | ❌ No | ✅ Yes | ❌ No | ✅ Keep |
| `sections` | ✅ Yes | ✅ Yes | ✅ Yes | ⚠️ Scripts | 🗑️ Remove Phase 4 |
| `selectedProjects` | ❌ No | ❌ No | ✅ Yes | ❌ No | ✅ Keep |
| `technologies` | ❌ No | ❌ No | ✅ Yes | ❌ No | ✅ Keep |
| `availability` | ❌ No | ❌ No | ✅ Yes | ❌ No | ✅ Keep |
| `availabilityText` | ❌ No | ❌ No | ✅ Yes | ❌ No | ✅ Keep |
| `ctaText` | ❌ No | ❌ No | ✅ Yes | ❌ No | ✅ Keep |
| `ctaButtonText` | ❌ No | ❌ No | ✅ Yes | ❌ No | ✅ Keep |
| `title` | ⚠️ Legacy | ❌ No | ❓ Unknown | ✅ Yes | ⚠️ Review |
| `tagline` | ⚠️ Legacy | ❌ No | ❓ Unknown | ✅ Yes | ⚠️ Review |
| `bio` | ⚠️ Legacy | ❌ No | ❌ No | ⚠️ Types | 🗑️ Remove Phase 2 |
| `skills` | ⚠️ Legacy | ❌ No | ❌ No | ⚠️ Types | 🗑️ Remove Phase 2 |
| `experience` | ❌ No | ❌ No | ❓ Unknown | ✅ Yes | ✅ Keep |
| `social` | ❌ No | ❌ No | ✅ Yes | ✅ Yes | ✅ Keep |
| `seo` | ❌ No | ❌ No | ✅ Yes | ❌ No | ✅ Keep |

---

**End of Document**
