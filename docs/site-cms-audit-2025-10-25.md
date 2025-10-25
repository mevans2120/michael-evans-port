# Site & CMS Audit Report

**Date:** October 25, 2025
**Project:** Michael Evans Portfolio
**Auditor:** Claude Code

---

## Executive Summary

This audit examined the Sanity CMS structure, site architecture, and codebase for optimization opportunities and issues. Found **6 major areas** requiring attention, including duplicate content, unused schemas, and legacy backup files.

---

## 🔴 Critical Issues

### 1. Duplicate Project Documents in Sanity

**Status:** ❌ Requires immediate action

**Issue:**
- Found 8 project documents with the following duplicates:
  - `virgin-america` - 2 instances
  - `casa-bonita` - 2 instances
  - `before-launcher` - 2 instances

**Impact:**
- May cause routing issues on `/case-studies/[slug]` routes
- Could display wrong/inconsistent content
- Confusing for content management

**Resolution:**
1. Open Sanity Studio: http://localhost:3000/studio
2. Navigate to Projects
3. Identify and delete duplicate entries (keep the most recently updated one)
4. Verify each case study URL works correctly

---

### 2. Orphaned Document Type: "hero"

**Status:** ❌ Requires immediate action

**Issue:**
- 1 document exists with `_type: "hero"` in production database
- No corresponding schema in `/sanity/schemas/index.ts`
- Document ID: `hero-main`
- Created: October 14, 2025

**Impact:**
- Dead data consuming storage
- Cannot be edited via Studio (no schema)
- May cause confusion

**Resolution Option A (Recommended):**
Delete the orphaned document via Sanity Vision tool or CLI

**Resolution Option B:**
If content is needed, migrate to `homepageIntro` schema which serves similar purpose

---

## 🟡 Unused/Dead Schemas

### 3. Unused Sanity Schemas

**Status:** ⚠️ Should be addressed

The following schemas are fully defined but **never queried or used** in the site:

#### `contact` Schema
- **Location:** `/sanity/schemas/contact.ts`
- **Documents:** 1 in database
- **Current Usage:** Site uses hardcoded contact info
- **Fields:** email, phone, location, availability, socialLinks, cta

**Resolution Options:**
- **Option A:** Connect to site by fetching in Contact component
- **Option B:** Delete schema and document if not needed

---

#### `homepageIntro` Schema
- **Location:** `/sanity/schemas/homepageIntro.ts`
- **Documents:** 0 in database
- **Current Usage:** Homepage uses hardcoded hero section
- **Fields:** heading, subheading, description, cta, backgroundImage, profileImage, active, order

**Resolution Options:**
- **Option A:** Connect to homepage (replace hardcoded hero)
- **Option B:** Delete schema if not needed

---

#### `siteSettings` Schema
- **Location:** `/sanity/schemas/siteSettings.ts`
- **Documents:** 1 in database
- **Current Usage:** Completely unused
- **Fields:** siteTitle, siteDescription, siteKeywords, ogImage, favicon, featuredWork, navigation, footer, analytics

**Resolution Options:**
- **Option A:** Connect to site layout (recommended - useful for SEO)
- **Option B:** Delete schema and document

---

#### `capability` Schema
- **Location:** `/sanity/schemas/capability.ts`
- **Documents:** 3 in database
- **Current Usage:** Never displayed on site
- **Fields:** title, category, icon, description, skills, order

**Resolution Options:**
- **Option A:** Add capabilities section to About page
- **Option B:** Delete schema and 3 documents

---

## 🟠 Optimization Opportunities

### 4. Old Backup Directories

**Status:** 🧹 Can be cleaned up

**Directories:**
- `/vite-backup` - **1.7MB** (old Vite configuration and components)
- `/old-migration-scripts` - **52KB** (old migration utilities)

**Impact:**
- Unnecessary repository bloat
- Already excluded from git (in `.gitignore`)
- No longer needed (site migrated to Next.js)

**Resolution:**
```bash
rm -rf vite-backup old-migration-scripts
```

---

### 5. Environment Variable Inconsistency

**Status:** 🔧 Should be cleaned up

**Issue:**
- `.env` contains obsolete `VITE_*` prefixes from old Vite setup:
  ```
  VITE_SANITY_PROJECT_ID=5n331bys
  VITE_SANITY_DATASET=production
  ```
- `.env.local` has correct `NEXT_PUBLIC_*` prefixes (currently in use)

**Impact:**
- Potential confusion
- Risk of using wrong variables

**Resolution:**
1. Delete `.env` file entirely
2. Keep only `.env.local` with `NEXT_PUBLIC_*` variables
3. Update `.env.example` to show correct Next.js format

**Updated `.env.example` should contain:**
```bash
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01

# Migration token (server-side only)
SANITY_AUTH_TOKEN=your-auth-token
```

---

### 6. Profile Schema - Singleton Enforcement

**Status:** ✅ **FIXED** (October 25, 2025)

**Previous Issue:**
- Multiple profile documents could be created
- Caused confusion about which profile was "active"

**Resolution Applied:**
- Added `__experimental_singleton: true` to schema
- Updated query to use `order(_updatedAt desc)[0]`
- Deleted duplicate profile document

---

## 🟢 Good Patterns Found

The following areas are well-structured and require no changes:

- ✅ **Clean page routing** - Next.js App Router properly configured
- ✅ **AI projects** - 4 documents, all properly structured and displayed
- ✅ **Hero options** - 4 documents, dynamic rotation working correctly
- ✅ **Dynamic case study routing** - `/case-studies/[slug]` pattern working
- ✅ **Profile data** - Now properly structured as singleton
- ✅ **Image handling** - Sanity CDN URLs working correctly
- ✅ **TypeScript types** - Well-defined in `/src/types/sanity.ts`

---

## 📊 Database Inventory

**Current Sanity Content Types:**

| Type | Count | Status | Used in Site |
|------|-------|--------|--------------|
| `aiProject` | 4 | ✅ Active | Yes - Homepage, AI Showcase |
| `project` | 8 | ⚠️ Has duplicates | Yes - Case Studies |
| `profile` | 1 | ✅ Active | Yes - Homepage, About |
| `heroOption` | 4 | ✅ Active | Yes - Homepage |
| `capability` | 3 | ⚠️ Unused | No |
| `contact` | 1 | ⚠️ Unused | No |
| `siteSettings` | 1 | ⚠️ Unused | No |
| `homepageIntro` | 0 | ⚠️ Unused | No |
| `hero` (orphaned) | 1 | ❌ No schema | No |

---

## 📋 Recommended Action Plan

### **Phase 1: Critical Cleanup** (30 minutes)

1. **Delete duplicate projects**
   - Open Sanity Studio
   - Delete older duplicates of virgin-america, casa-bonita, before-launcher
   - Keep most recently updated versions

2. **Delete orphaned hero document**
   - Use Sanity Vision or CLI to delete `hero-main` document

3. **Decide on unused schemas**
   - Review `contact`, `homepageIntro`, `siteSettings`, `capability`
   - Either connect to site OR delete schemas + documents

### **Phase 2: Optimization** (15 minutes)

4. **Clean up backup directories**
   ```bash
   rm -rf vite-backup old-migration-scripts
   ```

5. **Fix environment variables**
   - Delete `.env` file
   - Keep only `.env.local`
   - Update `.env.example`

### **Phase 3: Future Improvements** (Optional)

6. **Consider singleton patterns**
   - Make `contact` a singleton if used
   - Make `siteSettings` a singleton if used

7. **Add slug validation**
   - Add unique constraint to project slugs
   - Prevent duplicate slug creation

---

## 🔧 Schema Recommendations

### If Keeping Unused Schemas:

**Make these singletons:**
```typescript
// contact.ts, siteSettings.ts
export default defineType({
  name: 'contact', // or 'siteSettings'
  __experimental_singleton: true,
  // ... rest of schema
})
```

**Connect to site:**
- `contact` → Use in Contact component
- `siteSettings` → Use in layout.tsx for metadata
- `capability` → Add section to About page
- `homepageIntro` → Replace hardcoded homepage hero

---

## 📝 Notes

- All findings based on production dataset as of October 25, 2025
- No security issues found
- Site performance is good
- Next.js migration appears complete and successful

---

## 🔗 Related Documents

- [CLAUDE.md](/CLAUDE.md) - Project overview and development guidelines
- [ROADMAP.md](/ROADMAP.md) - Feature roadmap
- [README.md](/README.md) - Project setup and documentation
