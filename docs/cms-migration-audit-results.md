# CMS Migration Audit Results

**Date:** November 4, 2025
**Audit Type:** Phase 1 Data Audit - Field Usage Analysis

---

## Summary

**Good News:** Most projects (5 of 7) are already using the new editorial format!

**Action Required:** Only 2 projects need migration:
- **Aesop** - Uses old fields, needs migration
- **Lyft** - Partially migrated, needs completion

---

## Detailed Results

### ✅ Fully Migrated (5 projects)

These projects already use the NEW editorial format and need NO migration:

| Project | heroSection | slides | featuredImage | Status |
|---------|-------------|--------|---------------|---------|
| **Before Launcher** | ✅ | ✅ | ❌ (needs image) | 95% complete |
| **Casa Bonita** | ✅ | ✅ | ✅ | ✅ **100% complete** |
| **Peddle** | ✅ | ✅ | ✅ | ✅ **100% complete** |
| **Target** | ✅ | ✅ | ✅ | ✅ **100% complete** |
| **Virgin America** | ✅ | ✅ | ❌ (needs image) | 95% complete |

---

### ⚠️ Needs Migration (2 projects)

#### 1. **Aesop** - Old Format (70% migration needed)

**Current State:**
```json
{
  "hasHeroSection": false,     // ❌ Missing - needs creation
  "hasSlides": false,          // ❌ Missing - needs migration from sections
  "hasFeaturedImage": true,    // ✅ Good

  // Old fields still in use:
  "hasSummary": true,          // → migrate to heroSection.summary
  "hasDescription": true,      // → migrate to heroSection.subtitle
  "hasAchievements": true,     // → migrate to metrics
  "hasSections": true          // → rename to slides
}
```

**Migration Required:**
1. Create `heroSection` object with:
   - `summary` ← copy from `summary` field
   - `subtitle` ← copy from `description` field
   - `title` ← copy from root `title` or create new
2. Rename `sections` → `slides`
3. Migrate `achievements` → `metrics` array
4. Keep `featuredImage` (already good)

---

#### 2. **Lyft** - Hybrid Format (40% migration needed)

**Current State:**
```json
{
  "hasHeroSection": true,      // ✅ Good - already has new format
  "hasSlides": false,          // ❌ Missing - needs migration from sections
  "hasFeaturedImage": true,    // ✅ Good

  // Old fields still present (might be unused):
  "hasSummary": true,          // ⚠️ Check if duplicate of heroSection.summary
  "hasDescription": true,      // ⚠️ Check if duplicate of heroSection.subtitle
  "hasAchievements": true,     // → migrate to metrics
  "hasSections": true          // → rename to slides
}
```

**Migration Required:**
1. Check if `heroSection` has content (might already be good)
2. Rename `sections` → `slides`
3. Migrate `achievements` → `metrics` array
4. Remove duplicate `summary`/`description` if they match `heroSection` values

---

### ℹ️ Minor Issues (2 projects)

#### **Before Launcher** - Missing Featured Image
- Has `heroSection` ✅
- Has `slides` ✅
- Missing `featuredImage` ❌ - should add for social sharing/thumbnails

#### **Virgin America** - Missing Featured Image
- Has `heroSection` ✅
- Has `slides` ✅
- Missing `featuredImage` ❌ - should add for social sharing/thumbnails

---

## Migration Strategy

### Phase 3 Only Needed For:

1. **Aesop** (70% work)
2. **Lyft** (40% work)

### Recommended Approach:

#### Option A: Manual Migration in Studio (Recommended)

**For Aesop:**
1. Open http://localhost:3000/studio
2. Navigate to Aesop project
3. Create `heroSection`:
   - Copy `summary` → `heroSection.summary`
   - Copy `description` → `heroSection.subtitle`
   - Set `heroSection.title` to "Aesop Global Replatform" (or similar)
4. In Sanity Studio UI:
   - Rename `sections` to `slides` (might need to copy/paste)
5. Convert `achievements` array to `metrics`:
   ```
   achievements: ["Achievement 1", "Achievement 2"]
   →
   metrics: [
     { label: "Achievement 1", value: "" },
     { label: "Achievement 2", value: "" }
   ]
   ```
6. Save

**For Lyft:**
1. Check if `heroSection` already has content
2. If `summary` matches `heroSection.summary`, can ignore
3. Rename `sections` → `slides`
4. Convert `achievements` → `metrics`
5. Save

**Time:** 15-20 minutes per project = **~40 minutes total**

---

#### Option B: Automated Script

Create migration script:

```typescript
// scripts/migrate-aesop-lyft.ts
import { client } from '@/lib/sanity/client'

async function migrateProjects() {
  // Migrate Aesop
  console.log('Migrating Aesop...')
  const aesop = await client.fetch(`*[_id == "aesop"][0]{
    _id, title, summary, description, achievements, sections
  }`)

  if (aesop) {
    await client.patch('aesop').set({
      heroSection: {
        title: aesop.title,
        subtitle: aesop.description,
        summary: aesop.summary
      },
      slides: aesop.sections, // Rename
      metrics: aesop.achievements?.map((achievement: string) => ({
        label: achievement,
        value: ''
      }))
    }).commit()
  }

  // Migrate Lyft
  console.log('Migrating Lyft...')
  const lyft = await client.fetch(`*[_id == "lyft"][0]{
    _id, achievements, sections
  }`)

  if (lyft) {
    await client.patch('lyft').set({
      slides: lyft.sections,
      metrics: lyft.achievements?.map((achievement: string) => ({
        label: achievement,
        value: ''
      }))
    }).commit()
  }

  console.log('Migration complete!')
}

migrateProjects()
```

**Time:** 10 minutes to write + test = **~10 minutes total**

---

## Updated Timeline

Given audit results:

| Phase | Original Estimate | Updated Estimate | Notes |
|-------|------------------|------------------|-------|
| Phase 1: Update Queries | 30-45 min | 30-45 min | Same |
| Phase 2: Update Components | 30-45 min | 30-45 min | Same |
| Phase 3: Migrate Data | 15 min - 1 hour | **10-40 min** | Only 2 projects! |
| Phase 4: Remove Deprecated | 15-30 min | 15-30 min | Same |
| **Total** | 1.5-3 hours | **1.5-2.5 hours** | Faster than expected |

---

## Impact Assessment

### Pages Using Deprecated Fields:

Based on queries and audit:

1. **Case Studies Landing Page (`/case-studies`)**
   - Uses `featuredCaseStudyQuery`
   - Currently fetches: `summary`, `description`, `heroImage`
   - **Affected Projects:** Aesop (if featured), Lyft (if featured)

2. **Homepage (`/`)**
   - Uses `featuredMetric`, `featuredDescription` (new fields)
   - ✅ **No impact** - already using new format

3. **Case Study Detail Pages**
   - Uses `projectQuery`
   - Fetches: `summary`, `description`, `achievements`, `content`
   - **Affected Projects:** Aesop, Lyft

### Risk Level: **LOW** 🟢

- Only 2 projects affected
- Simple data migration
- Fallback queries in Phase 1-2 protect against errors

---

## Recommendation

**Proceed with migration as planned:**

1. **Execute Phase 1** (query updates with fallbacks) - Zero risk
2. **Execute Phase 2** (component updates) - Site continues working
3. **Execute Phase 3** (migrate Aesop + Lyft manually or with script) - Quick 10-40 min
4. **Execute Phase 4** (remove deprecated fields) - Final cleanup

**Total Time: 1.5-2.5 hours**

---

## Next Steps

1. ✅ **Audit Complete** (this document)
2. ⏭️ **Ready for Phase 1** - Update queries with fallbacks
3. Would you like me to proceed with Phase 1?

---

## Appendix: Full Audit Data

```json
[
  {
    "_id": "aesop",
    "title": "Aesop",
    "hasHeroSection": false,  // ❌ NEEDS CREATION
    "hasSlides": false,       // ❌ NEEDS MIGRATION
    "hasFeaturedImage": true,
    "hasSummary": true,       // OLD
    "hasDescription": true,   // OLD
    "hasAchievements": true,  // OLD
    "hasSections": true,      // OLD
    "hasHeroImage": false,
    "hasContent": false
  },
  {
    "_id": "lyft",
    "title": "Lyft",
    "hasHeroSection": true,   // ✅ GOOD
    "hasSlides": false,       // ❌ NEEDS MIGRATION
    "hasFeaturedImage": true,
    "hasSummary": true,       // ⚠️ CHECK IF DUPLICATE
    "hasDescription": true,   // ⚠️ CHECK IF DUPLICATE
    "hasAchievements": true,  // OLD
    "hasSections": true,      // OLD
    "hasHeroImage": false,
    "hasContent": false
  },
  {
    "_id": "before-launcher",
    "title": "Before Launcher",
    "hasHeroSection": true,   // ✅ GOOD
    "hasSlides": true,        // ✅ GOOD
    "hasFeaturedImage": false, // ℹ️ MINOR: Add for social
    "hasSummary": false,
    "hasDescription": false,
    "hasAchievements": false,
    "hasSections": false,
    "hasHeroImage": false,
    "hasContent": false
  },
  {
    "_id": "casa-bonita",
    "title": "Casa Bonita",
    "hasHeroSection": true,   // ✅ GOOD
    "hasSlides": true,        // ✅ GOOD
    "hasFeaturedImage": true, // ✅ GOOD
    "hasSummary": false,
    "hasDescription": false,
    "hasAchievements": false,
    "hasSections": false,
    "hasHeroImage": false,
    "hasContent": false
  },
  {
    "_id": "peddle",
    "title": "Peddle",
    "hasHeroSection": true,   // ✅ GOOD
    "hasSlides": true,        // ✅ GOOD
    "hasFeaturedImage": true, // ✅ GOOD
    "hasSummary": false,
    "hasDescription": false,
    "hasAchievements": false,
    "hasSections": false,
    "hasHeroImage": false,
    "hasContent": false
  },
  {
    "_id": "target",
    "title": "Target",
    "hasHeroSection": true,   // ✅ GOOD
    "hasSlides": true,        // ✅ GOOD
    "hasFeaturedImage": true, // ✅ GOOD
    "hasSummary": false,
    "hasDescription": false,
    "hasAchievements": false,
    "hasSections": false,
    "hasHeroImage": false,
    "hasContent": false
  },
  {
    "_id": "virgin-america",
    "title": "Virgin America",
    "hasHeroSection": true,   // ✅ GOOD
    "hasSlides": true,        // ✅ GOOD
    "hasFeaturedImage": false, // ℹ️ MINOR: Add for social
    "hasSummary": false,
    "hasDescription": false,
    "hasAchievements": false,
    "hasSections": false,
    "hasHeroImage": false,
    "hasContent": false
  }
]
```
