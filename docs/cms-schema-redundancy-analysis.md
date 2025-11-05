# CMS Schema Redundancy Analysis

**Date:** November 4, 2025
**Schemas Analyzed:** `project.ts`, `aiShowcase.ts`
**Focus:** Internal redundancy within schemas

---

## Executive Summary

The **Project schema** contains significant internal redundancy with **6 deprecated fields** that are marked as hidden but **still actively queried** by the application. This creates:
- Confusion about which fields to use
- Maintenance burden
- Risk of data inconsistency
- Incomplete migration to the new editorial format

The **AI Showcase schema** is clean with no significant internal redundancy.

---

## Current Deprecation Strategy

### How Deprecation Works

The project schema uses a "soft deprecation" strategy:

1. **Mark fields as `[DEPRECATED]`** in the title
2. **Add `hidden: true`** to hide from Sanity Studio UI
3. **Add description** explaining what to use instead
4. **Keep fields in schema** for backward compatibility

### Example from `project.ts`:

```typescript
defineField({
  name: 'summary',
  title: '[DEPRECATED] Summary',
  type: 'text',
  description: '⚠️ Deprecated: Use heroSection.summary instead',
  hidden: true,
}),
```

### Intent of Strategy:
- Preserve existing data without breaking the site
- Gradually migrate content to new editorial format
- Eventually remove deprecated fields once migration is complete

---

## Problem: Incomplete Migration

### ❌ The Strategy is NOT Working Because:

**Queries still reference deprecated fields** in `/src/lib/sanity/queries.ts`:

| Query | Deprecated Fields Used |
|-------|------------------------|
| `projectsQuery` | `summary`, `description`, `heroImage` |
| `featuredProjectsQuery` | `summary`, `heroImage` |
| `projectQuery` | `summary`, `description`, `heroImage`, `achievements`, `content[]` |
| `projectsByCategoryQuery` | `summary`, `heroImage` |
| `featuredCaseStudyQuery` | `summary`, `description`, `heroImage` |

**This means:**
- Frontend code still expects deprecated fields
- New editorial fields (`heroSection.summary`, etc.) may not display
- Content creators are confused about which fields to populate
- Migration is stuck in limbo

---

## Redundant Fields in Project Schema

### 1. Summary Field (Duplicate)

**Location:** Lines 77-83 (deprecated) vs Lines 57-62 (active)

```typescript
// DEPRECATED (Line 77)
summary: string  // Hidden, but still queried!

// ACTIVE (Line 57)
heroSection.summary: text  // New editorial format
```

**Problem:** Both exist, queries use old one

---

### 2. Description Field (Duplicate)

**Location:** Lines 85-91 (deprecated) vs Lines 50-55 (active)

```typescript
// DEPRECATED (Line 85)
description: text  // Hidden, but still queried!

// ACTIVE (Line 50)
heroSection.subtitle: text  // New editorial format
```

**Problem:** Semantic confusion - "description" became "subtitle"

---

### 3. Hero Image Field (Duplicate)

**Location:** Lines 67-75 (deprecated) vs Lines 542-558 (active as featuredImage)

```typescript
// DEPRECATED (Line 67)
heroImage: image  // Hidden, but still queried heavily!

// ACTIVE (Line 542)
featuredImage: image  // Same purpose, different name
```

**Problem:** Same functionality, different name, queries use old one

---

### 4. Achievements Field (Deprecated)

**Location:** Lines 113-119

```typescript
// DEPRECATED (Line 113)
achievements: string[]  // Hidden, but still queried!
```

**Replacement:** Should use `metrics` array instead (Lines 93-111)

**Problem:** Old field still queried in `projectQuery`

---

### 5. Content Field (Deprecated)

**Location:** Lines 121-133

```typescript
// DEPRECATED (Line 121)
content: block[]  // Old portable text format, still queried!
```

**Replacement:** Should use `slides` array (Lines 212-389)

**Problem:** Old field still queried in `projectQuery`

---

### 6. Sections Field (Deprecated)

**Location:** Lines 412-540

```typescript
// DEPRECATED (Line 412)
sections: object[]  // Massive 128-line deprecated field!
```

**Replacement:** Renamed to `slides` (Lines 212-389)

**Problem:** Nearly identical structure, just renamed. Takes up huge space in schema.

---

## Title Field Redundancy

### Issue: Two Title Fields

```typescript
// ROOT LEVEL (Line 9)
title: string  // Document title

// HERO SECTION (Line 44)
heroSection.title: string  // Display title
```

**Comment says:** "usually same as document title"

**Problem:** Why maintain two fields if they're usually the same?

**Options:**
1. Remove `heroSection.title`, use root `title` in displays
2. Keep both for flexibility (e.g., different SEO title vs display title)

---

## AI Showcase Schema - Clean ✅

The AI Showcase schema does NOT have this problem:
- No deprecated fields
- No hidden fields
- Clean, single-purpose fields
- Queries likely match schema (would need to verify)

**Why?** Probably built after learning from Project schema issues.

---

## Options for Cleanup

### Option 1: Complete the Migration (Recommended)

**Steps:**

1. **Update all queries** in `/src/lib/sanity/queries.ts` to use new fields:
   - `summary` → `heroSection.summary`
   - `description` → `heroSection.subtitle`
   - `heroImage` → `featuredImage`
   - `achievements` → `metrics`
   - `content` → `slides`
   - `sections` → `slides`

2. **Migrate existing data** in Sanity Studio (if any projects still use old fields):
   ```javascript
   // Migration script pseudocode
   projects.forEach(project => {
     if (!project.heroSection.summary && project.summary) {
       project.heroSection.summary = project.summary
     }
     // ... repeat for other fields
   })
   ```

3. **Remove deprecated fields** from `project.ts` schema

4. **Test thoroughly** - ensure all pages render correctly

**Pros:**
- Clean schema
- Eliminates confusion
- Faster Studio load times
- Reduces maintenance burden
- Forces completion of editorial migration

**Cons:**
- Requires data migration effort
- Risk of data loss if migration has bugs
- Need to test all project pages

**Estimated Effort:** 2-4 hours (queries + data migration + testing)

---

### Option 2: Keep Deprecated Fields, Stop Querying Them

**Steps:**

1. **Update all queries** to use new fields (same as Option 1, step 1)
2. **Keep deprecated fields** in schema for safety
3. **Monitor** which fields actually have data
4. **Remove after 3-6 months** once confident migration is complete

**Pros:**
- Safety net - can roll back if needed
- Less risky than full removal
- Data preserved in case of mistakes

**Cons:**
- Schema stays bloated
- Confusion remains about which fields to use
- Postpones inevitable cleanup

**Estimated Effort:** 1-2 hours (queries only)

---

### Option 3: Hybrid Approach - Queries with Fallbacks

**Steps:**

1. **Update queries** to try new fields first, fall back to old:
   ```groq
   // In queries
   "summary": coalesce(heroSection.summary, summary),
   "description": coalesce(heroSection.subtitle, description),
   "imageUrl": coalesce(featuredImage.asset->url, heroImage.asset->url)
   ```

2. **Update CMS content gradually** at your own pace
3. **Remove deprecated fields** once all content migrated

**Pros:**
- Zero downtime or risk
- Supports gradual migration
- Works with old and new data simultaneously
- Can migrate content piece-by-piece

**Cons:**
- Query complexity increases
- Still have schema bloat temporarily
- Migration can drag on indefinitely

**Estimated Effort:** 1-2 hours (queries) + ongoing content migration

---

### Option 4: Leave As-Is (Not Recommended)

Keep everything exactly as it is.

**Pros:**
- Zero effort

**Cons:**
- New editorial format never gets used
- Deprecated fields are pointless dead code
- Confusion for content creators
- Wasted previous migration effort

**Not recommended** - defeats the purpose of having the new fields.

---

## Recommendation

**Go with Option 1: Complete the Migration**

### Why?

1. **Editorial format is already built** - the new `heroSection`, `slides`, etc. exist and work
2. **Queries are the blocker** - fixing them unlocks the full migration
3. **Clean slate** - eliminates confusion and technical debt
4. **AI Showcase proves it works** - that schema is clean and functional

### Migration Checklist

- [ ] Audit which projects in Sanity use old vs new fields
- [ ] Create data migration script (if needed)
- [ ] Update all queries in `/src/lib/sanity/queries.ts`
- [ ] Test case studies page with new queries
- [ ] Test featured projects on homepage
- [ ] Test individual project detail pages
- [ ] Verify images loading correctly (`featuredImage` vs `heroImage`)
- [ ] Remove deprecated fields from `project.ts`
- [ ] Run production build to catch any errors
- [ ] Deploy and monitor

---

## Title Field Decision

### Recommendation: Keep Both Fields

**Why?**

```typescript
title: "Aesop Global Replatform"  // SEO, URL, internal
heroSection.title: "Reimagining Luxury E-Commerce"  // Display, editorial
```

**Use cases for separate titles:**
- SEO optimization (title) vs editorial flair (heroSection.title)
- Short URL-friendly title vs long descriptive display title
- Internal naming vs public-facing naming

**Keep both** - the flexibility is valuable for editorial content.

---

## Questions to Answer Before Cleanup

1. **Do any published projects still use the old fields?**
   - Run a Sanity query to check: `*[_type == "project" && defined(heroImage)]`

2. **Is the old `content` array format used anywhere?**
   - Check: `*[_type == "project" && defined(content)]`

3. **Are case study pages rendering from `slides` or `sections`?**
   - Check the page component: `/src/app/(public)/case-studies/[slug]/page.tsx`

4. **What's the rollback plan if queries break?**
   - Git revert? Keep queries as separate commit?

---

## Next Steps

1. **Choose an option** (recommend Option 1)
2. **Answer questions above** to assess migration risk
3. **Create migration plan** with specific query changes
4. **Execute migration** with testing at each step
5. **Clean up deprecated fields** once confident

---

## Files Referenced

- `/sanity/schemas/project.ts` - Project schema with deprecated fields
- `/sanity/schemas/aiShowcase.ts` - Clean AI Showcase schema
- `/src/lib/sanity/queries.ts` - Queries that need updating
- `/src/app/(public)/case-studies/[slug]/page.tsx` - Case study rendering
- `/src/app/(public)/case-studies/page.tsx` - Case studies list

---

## Appendix: Deprecated Fields Summary

| Field | Lines | Replacement | Still Queried? |
|-------|-------|-------------|----------------|
| `heroImage` | 67-75 | `featuredImage` | ✅ Yes |
| `summary` | 77-83 | `heroSection.summary` | ✅ Yes |
| `description` | 85-91 | `heroSection.subtitle` | ✅ Yes |
| `achievements` | 113-119 | `metrics` | ✅ Yes |
| `content` | 121-133 | `slides` | ✅ Yes |
| `sections` | 412-540 | `slides` | ❌ No |

**Total deprecated code:** ~180 lines (30% of schema)
