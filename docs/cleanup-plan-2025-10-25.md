# Portfolio Site Cleanup Implementation Plan

**Date:** October 25, 2025
**Project:** Michael Evans Portfolio
**Based On:** Site & CMS Audit Report (site-cms-audit-2025-10-25.md)
**Status:** Ready for Implementation

---

## Executive Summary

This phased cleanup plan addresses 6 major issues identified in the site audit, including critical data integrity problems (duplicate projects, orphaned documents), unused schemas that add complexity, and legacy backup files consuming 1.7MB of disk space. The plan is divided into 3 phases with clear success criteria, time estimates, and risk assessments.

**Total Estimated Time:** 2.5 - 3.5 hours
**Risk Level:** Low to Medium (data deletion requires care)
**Recommended Executor:** User for Phase 1 (Sanity Studio tasks), Claude for Phase 2-3

---

## Phase 1: Critical Data Cleanup (REQUIRED)

**Priority:** CRITICAL
**Estimated Time:** 30-45 minutes
**Risk Level:** Medium (involves data deletion)
**Executor:** User (requires Sanity Studio access)
**Must Complete Before:** Phases 2 and 3

### Tasks

#### 1.1 Delete Duplicate Project Documents

**Status:** Critical - May cause routing conflicts
**Time Estimate:** 15 minutes
**Dependencies:** None

**Steps:**
1. Start development server: `npm run dev`
2. Open Sanity Studio: http://localhost:3000/studio
3. Navigate to "Projects" in the sidebar
4. For each duplicate pair, compare the documents:
   - **virgin-america** (2 instances)
   - **casa-bonita** (2 instances)
   - **before-launcher** (2 instances)
5. Delete the OLDER version (check `_updatedAt` field)
6. Keep the most recently updated version

**Success Criteria:**
- [ ] Only 5 unique project documents remain (down from 8)
- [ ] Each project slug is unique
- [ ] All case study URLs load correctly: `/case-studies/virgin-america`, `/case-studies/casa-bonita`, `/case-studies/before-launcher`

**Rollback Plan:**
- Documents are soft-deleted in Sanity for 30 days
- Can be restored from Sanity Studio trash if needed

**Risk Assessment:**
- **Risk:** Deleting the wrong version loses recent content updates
- **Mitigation:** Always check `_updatedAt` timestamp before deleting
- **Impact if skipped:** Potential routing conflicts, inconsistent content display

---

#### 1.2 Delete Orphaned "hero" Document

**Status:** Critical - Dead data with no schema
**Time Estimate:** 5 minutes
**Dependencies:** None

**Steps:**
1. Open Sanity Studio: http://localhost:3000/studio
2. Navigate to Vision tool (sidebar)
3. Run this GROQ query to view the orphaned document:
   ```groq
   *[_type == "hero"]
   ```
4. Delete the document using Vision's delete function OR use CLI:
   ```bash
   # Alternative: Use Sanity CLI if Vision doesn't show delete option
   npx sanity documents delete hero-main
   ```

**Success Criteria:**
- [ ] Query `*[_type == "hero"]` returns empty array
- [ ] No orphaned documents exist in database
- [ ] Sanity Studio has no errors about missing schemas

**Rollback Plan:**
- Document can be restored from trash for 30 days
- Document content was created Oct 14, 2025 (recent, likely test data)

**Risk Assessment:**
- **Risk:** Minimal - document is orphaned with no schema
- **Mitigation:** Document is in trash for 30 days if restoration needed
- **Impact if skipped:** Dead data, potential confusion, storage waste

---

#### 1.3 Decision: Unused Schemas Strategy

**Status:** Critical - Architectural decision required
**Time Estimate:** 10-15 minutes (decision + execution)
**Dependencies:** None

**Decision Required:**

You must decide whether to **CONNECT** or **DELETE** each unused schema. This plan provides recommendations based on analysis.

##### Option A: Delete All Unused Schemas (RECOMMENDED)

**Recommendation:** DELETE - Site is fully functional without these schemas. Removing them reduces complexity and maintenance burden.

**Rationale:**
- Site already has hardcoded content that works well
- Adding CMS management for these elements adds complexity
- Profile schema already handles most dynamic content needs
- No immediate business need for these features
- Can be re-added later if requirements change

**Schemas to Delete:**
1. `contact` (1 document)
2. `siteSettings` (1 document)
3. `capability` (3 documents)
4. `homepageIntro` (0 documents)

**Steps to Delete:**
1. Open Sanity Studio: http://localhost:3000/studio
2. Navigate to each schema type and delete all documents:
   - Contact Information (1 document)
   - Site Settings (1 document)
   - Capabilities (3 documents)
   - Homepage Intro (0 documents - no action needed)
3. After deleting documents, proceed to Phase 2 Task 2.3 to remove schemas from code

**Time Estimate:** 10 minutes

**Success Criteria:**
- [ ] All documents deleted from Sanity
- [ ] Ready for schema removal in Phase 2

---

##### Option B: Connect Schemas to Site (FUTURE ENHANCEMENT)

**Recommendation:** DEFER - Consider for future roadmap, not immediate cleanup

**Rationale:**
- Requires development work to integrate
- Adds complexity to codebase
- Current hardcoded content works well
- No urgent business need
- Better suited for feature planning, not cleanup

**If you choose this option:**
- See Appendix A for detailed integration plan
- Estimated effort: 4-6 hours development time
- Creates tasks for future roadmap
- **Skip this option for current cleanup** - focus on technical debt removal

---

### Phase 1 Success Criteria

- [ ] Only 5 unique project documents exist (duplicates removed)
- [ ] No orphaned "hero" document exists
- [ ] Decision made on unused schemas (recommend: delete)
- [ ] If deleting: All unused schema documents removed from Sanity
- [ ] All existing site functionality still works
- [ ] No Sanity Studio errors

**Total Time:** 30-45 minutes
**Blocker for:** Phase 2 (schema code removal)

---

## Phase 2: Code & File Optimization (REQUIRED)

**Priority:** High
**Estimated Time:** 30-45 minutes
**Risk Level:** Low (safe code cleanup)
**Executor:** Claude Code or User
**Dependencies:** Phase 1 complete

### Tasks

#### 2.1 Delete Legacy Backup Directories

**Status:** Safe cleanup - files already git-ignored
**Time Estimate:** 2 minutes
**Dependencies:** None

**Directories to Remove:**
- `/vite-backup` (1.7MB) - Old Vite setup, no longer needed
- `/old-migration-scripts` (52KB) - Migration completed successfully

**Steps:**
```bash
# Verify directories exist and check size
ls -lh vite-backup old-migration-scripts

# Delete directories
rm -rf vite-backup old-migration-scripts

# Verify deletion
ls vite-backup old-migration-scripts 2>&1
# Should see: "No such file or directory"
```

**Success Criteria:**
- [ ] `/vite-backup` directory deleted
- [ ] `/old-migration-scripts` directory deleted
- [ ] Repository size reduced by ~1.7MB
- [ ] No references to these directories in codebase

**Rollback Plan:**
- Directories are in `.gitignore`, so no git history
- If needed, can be restored from Time Machine or system backup
- Low risk - migration to Next.js is complete and stable

**Risk Assessment:**
- **Risk:** Minimal - files are backups only
- **Mitigation:** Site runs on Next.js, Vite setup no longer needed
- **Impact if skipped:** Unnecessary bloat, repository clutter

---

#### 2.2 Fix Environment Variable Configuration

**Status:** Important - prevents confusion
**Time Estimate:** 10 minutes
**Dependencies:** None

**Current State:**
- `.env` contains obsolete `VITE_*` variables
- `.env.local` has correct `NEXT_PUBLIC_*` variables (in use)
- `.env.example` shows old Vite format

**Steps:**

1. **Delete obsolete `.env` file:**
   ```bash
   # View current contents to confirm
   cat .env

   # Delete the file
   rm .env

   # Verify deletion
   ls -la .env 2>&1
   # Should see: "No such file or directory"
   ```

2. **Update `.env.example` to Next.js format:**

   Replace entire contents with:
   ```bash
   # Sanity CMS Configuration
   # Get these values from https://sanity.io/manage

   NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
   NEXT_PUBLIC_SANITY_DATASET=production
   NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01

   # Sanity Auth Token (Server-side only)
   # Required for: migrations, mutations, private datasets
   # Generate at: https://sanity.io/manage/personal/tokens

   SANITY_AUTH_TOKEN=your-auth-token-here
   ```

3. **Verify `.env.local` is correct:**
   ```bash
   # Check current variables (don't share output publicly)
   grep "NEXT_PUBLIC" .env.local

   # Should see:
   # NEXT_PUBLIC_SANITY_PROJECT_ID=5n331bys
   # NEXT_PUBLIC_SANITY_DATASET=production
   # NEXT_PUBLIC_SANITY_API_VERSION=...
   ```

**Success Criteria:**
- [ ] `.env` file deleted
- [ ] `.env.example` updated with Next.js format
- [ ] `.env.local` uses `NEXT_PUBLIC_*` variables
- [ ] No `VITE_*` variables remain in repository
- [ ] Site still runs correctly: `npm run dev`

**Rollback Plan:**
- `.env.local` is preserved (contains working config)
- Can recreate `.env` from `.env.local` if needed
- `.env.example` changes are documentation only

**Risk Assessment:**
- **Risk:** Very low - only affects development environment
- **Mitigation:** `.env.local` (working config) is untouched
- **Impact if skipped:** Developer confusion, wrong variables in use

---

#### 2.3 Remove Unused Schemas from Codebase

**Status:** Required only if Phase 1.3 chose deletion
**Time Estimate:** 15-20 minutes
**Dependencies:** Phase 1.3 documents deleted

**Note:** Skip this task if you chose to connect schemas in Phase 1.3

**Files to Modify:**

1. **Delete schema definition files:**
   ```bash
   rm sanity/schemas/contact.ts
   rm sanity/schemas/siteSettings.ts
   rm sanity/schemas/capability.ts
   rm sanity/schemas/homepageIntro.ts
   ```

2. **Update `/sanity/schemas/index.ts`:**

   Remove these imports and exports:
   ```typescript
   // REMOVE these lines:
   import capability from './capability'
   import contact from './contact'
   import homepageIntro from './homepageIntro'
   import siteSettings from './siteSettings'
   ```

   Update schemaTypes array to:
   ```typescript
   export const schemaTypes = [
     project,
     profile,
     aiProject,
     heroOption,
   ]
   ```

3. **Update `/src/lib/sanity/queries.ts`:**

   Remove these query exports:
   ```typescript
   // REMOVE these query definitions (lines 91-111):
   export const capabilitiesQuery = groq`...`
   export const capabilitiesByCategoryQuery = groq`...`
   ```

4. **Verify no other references:**
   ```bash
   # Search for remaining references
   grep -r "capability\|contact\|siteSettings\|homepageIntro" src/ sanity/ --include="*.ts" --include="*.tsx"

   # Should only find type definitions or comments
   ```

**Success Criteria:**
- [ ] Schema files deleted
- [ ] `index.ts` updated (4 schemas remain)
- [ ] Queries removed from `queries.ts`
- [ ] No compile errors: `npm run build`
- [ ] Sanity Studio loads without errors
- [ ] TypeScript compilation succeeds

**Rollback Plan:**
- Files are in git history
- Can restore with: `git checkout HEAD -- sanity/schemas/[filename].ts`
- Documents already deleted in Phase 1, so schemas are unused

**Risk Assessment:**
- **Risk:** Low - schemas are unused
- **Mitigation:** Queries confirmed unused in codebase
- **Impact if skipped:** Dead code, increased complexity

---

### Phase 2 Success Criteria

- [ ] Backup directories deleted (1.7MB freed)
- [ ] Environment variables cleaned up (no VITE_* prefixes)
- [ ] `.env.example` updated to Next.js format
- [ ] Unused schemas removed from code (if Phase 1.3 chose deletion)
- [ ] `npm run build` succeeds with no errors
- [ ] `npm run dev` runs successfully
- [ ] Sanity Studio loads at http://localhost:3000/studio

**Total Time:** 30-45 minutes
**Blocker for:** Phase 3 (validation)

---

## Phase 3: Validation & Future Improvements (RECOMMENDED)

**Priority:** Medium
**Estimated Time:** 30-60 minutes
**Risk Level:** Very Low (verification only)
**Executor:** User or Claude
**Dependencies:** Phases 1 & 2 complete

### Tasks

#### 3.1 Comprehensive Site Validation

**Status:** Recommended verification
**Time Estimate:** 20-30 minutes
**Dependencies:** All Phase 1 & 2 tasks complete

**Manual Testing Checklist:**

1. **Homepage Validation:**
   - [ ] Hero section displays correctly
   - [ ] Dynamic hero rotation works (4 hero options)
   - [ ] Featured projects load
   - [ ] Profile image displays
   - [ ] All links work

2. **Case Studies Validation:**
   - [ ] `/case-studies/virgin-america` loads (no duplicates)
   - [ ] `/case-studies/casa-bonita` loads (no duplicates)
   - [ ] `/case-studies/before-launcher` loads (no duplicates)
   - [ ] All other case study pages load
   - [ ] No 404 errors for duplicate slugs

3. **AI Projects Validation:**
   - [ ] `/ai-showcase` page loads
   - [ ] All 4 AI project detail pages load
   - [ ] Images and content display correctly

4. **Sanity Studio Validation:**
   - [ ] http://localhost:3000/studio loads without errors
   - [ ] No schema errors in console
   - [ ] Only these schemas visible:
     - Projects (5 documents)
     - Profile (1 document)
     - AI Projects (4 documents)
     - Hero Options (4 documents)
   - [ ] Can create/edit existing documents
   - [ ] No orphaned document types

5. **Build & Performance:**
   ```bash
   # Production build test
   npm run build
   # Should complete with no errors

   # Start production server
   npm run start
   # Verify site works in production mode
   ```

**Success Criteria:**
- [ ] All manual tests pass
- [ ] No console errors
- [ ] No 404 pages
- [ ] Production build succeeds
- [ ] Site performance unchanged or improved

---

#### 3.2 Add Slug Uniqueness Validation (FUTURE)

**Status:** Recommended enhancement
**Time Estimate:** 15-20 minutes
**Dependencies:** Phase 1.1 complete

**Purpose:** Prevent duplicate project slugs from being created in future

**Implementation:**

Update `/sanity/schemas/project.ts` slug field:

```typescript
defineField({
  name: 'slug',
  title: 'Slug',
  type: 'slug',
  options: {
    source: 'title',
    maxLength: 96,
    isUnique: async (slug, context) => {
      const { document, getClient } = context
      const client = getClient({ apiVersion: '2024-01-01' })
      const id = document._id.replace(/^drafts\./, '')
      const params = {
        draft: `drafts.${id}`,
        published: id,
        slug,
      }
      const query = `!defined(*[_type == "project" && slug.current == $slug && !(_id in [$draft, $published])][0]._id)`
      const result = await client.fetch(query, params)
      return result
    },
  },
  validation: (Rule) => Rule.required(),
}),
```

**Also apply to `/sanity/schemas/aiProject.ts`**

**Success Criteria:**
- [ ] Cannot create duplicate slugs in Sanity Studio
- [ ] Validation shows error message if slug exists
- [ ] Existing slugs remain valid
- [ ] Studio UX improved

**Time Estimate:** 15-20 minutes
**Priority:** Medium (prevents future issues)

---

#### 3.3 Documentation Updates

**Status:** Recommended
**Time Estimate:** 10 minutes
**Dependencies:** All cleanup complete

**Files to Update:**

1. **Update `/CLAUDE.md`:**
   - Remove references to deleted schemas
   - Update schema count (4 schemas instead of 8)
   - Note cleanup completion date

2. **Update audit report if needed:**
   - Mark completed items
   - Add "COMPLETED" status to issues

3. **Update README if it references schemas:**
   - Verify accuracy of schema documentation
   - Update examples if they reference deleted schemas

**Success Criteria:**
- [ ] Documentation reflects current state
- [ ] No references to deleted schemas
- [ ] Future developers have accurate information

---

### Phase 3 Success Criteria

- [ ] All site pages load correctly
- [ ] No duplicate project issues
- [ ] Sanity Studio fully functional
- [ ] Production build succeeds
- [ ] (Optional) Slug validation implemented
- [ ] Documentation updated

**Total Time:** 30-60 minutes

---

## Overall Success Metrics

### Before Cleanup
- **Project Documents:** 8 (with 3 duplicates)
- **Orphaned Documents:** 1 (hero)
- **Total Schemas:** 8 (4 unused)
- **Backup File Size:** 1.7MB
- **Environment Files:** 2+ (.env, .env.local, mixed formats)
- **Technical Debt:** High

### After Cleanup
- **Project Documents:** 5 (all unique)
- **Orphaned Documents:** 0
- **Total Schemas:** 4 (all in use)
- **Backup File Size:** 0
- **Environment Files:** 1 (.env.local, consistent format)
- **Technical Debt:** Low

### Key Improvements
- 37.5% reduction in project documents (8 → 5)
- 50% reduction in schema complexity (8 → 4)
- 100% elimination of orphaned data
- 1.7MB disk space recovered
- Cleaner, more maintainable codebase

---

## Risk Assessment Matrix

| Task | Risk Level | Impact | Mitigation |
|------|------------|--------|------------|
| Delete duplicate projects | Medium | High | Check `_updatedAt`, 30-day trash retention |
| Delete orphaned hero | Low | Low | Trash retention, no schema dependencies |
| Delete schema documents | Low | Medium | Can recreate if needed, git history preserved |
| Delete backup directories | Very Low | Low | Not in git, external backups available |
| Remove schema code | Low | Low | Git history, TypeScript will catch issues |
| Update env files | Very Low | Low | `.env.local` preserved, easy rollback |

**Overall Risk:** LOW to MEDIUM
**Risk Mitigation:** Sanity trash retention (30 days), git history, backups

---

## Dependencies & Execution Order

```
Phase 1: Critical Data Cleanup (User)
├─ 1.1 Delete duplicate projects ────────┐
├─ 1.2 Delete orphaned hero document ────┤
└─ 1.3 Decision on unused schemas ───────┴─→ PHASE 1 COMPLETE
                                              ↓
Phase 2: Code Optimization (Claude or User)
├─ 2.1 Delete backup directories ────────┐
├─ 2.2 Fix environment variables ────────┤
└─ 2.3 Remove unused schema code ────────┴─→ PHASE 2 COMPLETE
                                              ↓
Phase 3: Validation & Improvements (User or Claude)
├─ 3.1 Comprehensive validation ─────────┐
├─ 3.2 Add slug validation (optional) ───┤
└─ 3.3 Update documentation ─────────────┴─→ CLEANUP COMPLETE
```

**Critical Path:**
1. Phase 1.3 decision determines Phase 2.3 scope
2. Phase 2.3 requires Phase 1.3 document deletion
3. Phase 3.1 requires all Phase 1 & 2 tasks complete

---

## Execution Recommendations

### Best Approach: Phased Execution

**Day 1 - Phase 1 (User):**
- User executes all Phase 1 tasks in Sanity Studio
- Decision made on unused schemas (recommend: delete)
- Time: 30-45 minutes
- User confirms completion before proceeding

**Day 1 or 2 - Phase 2 (Claude or User):**
- Claude executes code cleanup tasks
- Environment variable cleanup
- Schema removal if applicable
- Time: 30-45 minutes
- Claude confirms build succeeds

**Day 2 - Phase 3 (User + Claude):**
- User performs manual testing
- Claude adds slug validation
- Documentation updates
- Time: 30-60 minutes

**Total Execution Time:** 1.5 - 2.5 hours over 1-2 days

---

## Alternative Approach: Single Session

If you prefer to complete all at once:

1. **Allocate 2.5-3 hours of uninterrupted time**
2. **Execute phases in order** (no skipping)
3. **User handles Phase 1** (Sanity Studio)
4. **Claude handles Phase 2** (code cleanup)
5. **User handles Phase 3.1** (validation)
6. **Claude handles Phase 3.2-3.3** (enhancements)

**Benefits:** Completed in one session, immediate results
**Drawbacks:** Longer time commitment, fatigue risk

---

## Appendix A: Future Feature Integration (If Connecting Unused Schemas)

**Note:** This appendix is for reference only. Current recommendation is to DELETE unused schemas.

If you decide to connect schemas in the future, here's the integration plan:

### A.1 Contact Schema Integration

**Estimated Time:** 1.5 hours

**Steps:**
1. Mark schema as singleton
2. Create query in `/src/lib/sanity/queries.ts`:
   ```typescript
   export const contactQuery = groq`
     *[_type == "contact"][0] {
       email, phone, location, availability, socialLinks, cta
     }
   `
   ```
3. Create or update Contact page component to fetch data
4. Replace hardcoded contact info with CMS data
5. Test contact form functionality

**Benefits:**
- CMS-managed contact information
- Easy updates without code changes
- Centralized social links

**Effort:** Medium
**Priority:** Low (current hardcoded version works)

---

### A.2 Site Settings Integration

**Estimated Time:** 2 hours

**Steps:**
1. Mark schema as singleton
2. Create query for site settings
3. Update `/src/app/layout.tsx` metadata to use CMS:
   ```typescript
   const settings = await client.fetch(siteSettingsQuery)

   export const metadata: Metadata = {
     title: settings.siteTitle,
     description: settings.siteDescription,
     keywords: settings.siteKeywords,
     openGraph: {
       images: [settings.ogImage],
     },
   }
   ```
4. Update navigation component to use CMS data
5. Update footer component
6. Add analytics integration

**Benefits:**
- CMS-controlled SEO metadata
- Dynamic navigation/footer
- Analytics management

**Effort:** High
**Priority:** Medium (good for SEO flexibility)

---

### A.3 Capability Schema Integration

**Estimated Time:** 1.5 hours

**Steps:**
1. Create capabilities section on About page
2. Query capabilities data (query already exists)
3. Design and implement UI component
4. Group by category
5. Display with icons and descriptions

**Benefits:**
- Visual representation of skills
- Organized by category
- Easy to update

**Effort:** Medium
**Priority:** Low (nice-to-have feature)

---

### A.4 Homepage Intro Integration

**Estimated Time:** 1 hour

**Steps:**
1. Mark as singleton
2. Create query
3. Update homepage hero to use CMS data
4. Replace hardcoded hero content
5. Add image handling

**Benefits:**
- CMS-managed hero section
- Dynamic content rotation
- Easy A/B testing

**Effort:** Low
**Priority:** Very Low (current dynamic hero works well)

---

**Total Integration Effort:** 6+ hours
**Recommendation:** Defer to future roadmap, not part of cleanup

---

## Appendix B: Command Reference

### Quick Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run start            # Production server

# Sanity
npm run studio           # Alternative to /studio route
npx sanity documents delete [docId]  # Delete via CLI

# Cleanup Commands (Phase 2)
rm -rf vite-backup old-migration-scripts  # Delete backups
rm .env                                    # Remove old env file
grep -r "capability\|contact" src/        # Search for references

# Validation Commands (Phase 3)
npm run lint             # Check for code issues
npm run build            # Test production build
ls sanity/schemas/       # List schema files
```

---

## Appendix C: Rollback Procedures

### If Something Goes Wrong

**Sanity Document Deletion:**
1. Open Sanity Studio: http://localhost:3000/studio
2. Look for trash/deleted items section
3. Restore deleted documents (available for 30 days)

**Code Changes:**
```bash
# Revert all local changes
git status
git checkout -- [filename]

# Revert specific file
git checkout HEAD -- sanity/schemas/contact.ts

# See what changed
git diff
```

**Environment Files:**
```bash
# Recreate .env from .env.local
cp .env.local .env
# Then rename variables as needed
```

**Full Project Reset:**
```bash
# WARNING: Loses all uncommitted changes
git reset --hard HEAD
npm install
npm run dev
```

---

## Appendix D: Post-Cleanup Maintenance

### Ongoing Best Practices

1. **Schema Management:**
   - Only add schemas when you'll use them immediately
   - Mark singletons as `__experimental_singleton: true`
   - Document schema purpose in comments

2. **Content Governance:**
   - Use unique slug validation on all content types
   - Regular audits (quarterly) for orphaned data
   - Delete test content promptly

3. **Environment Variables:**
   - Keep `.env.example` updated
   - Use `NEXT_PUBLIC_*` for client-side variables
   - Never commit `.env.local`

4. **Backup Strategy:**
   - Rely on git for code backups
   - Sanity handles content backups
   - Delete local backups promptly after migrations

5. **Documentation:**
   - Update CLAUDE.md when architecture changes
   - Document decisions in `/docs`
   - Keep README current

---

## Questions & Support

### Before Starting

**Q: Should I really delete the unused schemas?**
A: Yes, if you're not using them immediately. They add complexity without value. Can be re-added from git history if needed later.

**Q: What if I want to use these schemas in the future?**
A: They're preserved in git history. Can restore and integrate when there's a business need. See Appendix A for integration plan.

**Q: Is it safe to delete the backup directories?**
A: Yes. The migration to Next.js is complete and stable. Vite setup is no longer needed.

**Q: Will this break anything on the live site?**
A: No. These schemas aren't currently used. Cleanup only removes unused code and data.

### During Execution

**Q: I accidentally deleted the wrong project document!**
A: Check Sanity Studio trash within 30 days to restore it.

**Q: The build is failing after schema removal!**
A: Check that you removed all imports from `index.ts` and queries from `queries.ts`. Run `npm run build` to see specific errors.

**Q: I'm not sure which version of a duplicate to keep!**
A: Keep the one with the most recent `_updatedAt` timestamp. Preview both in Studio to compare content.

### After Completion

**Q: How do I verify everything worked?**
A: Follow Phase 3.1 validation checklist. All pages should load, no console errors, Studio works correctly.

**Q: Can I add the unused schemas back later?**
A: Yes. Restore from git history: `git log -- sanity/schemas/contact.ts` then `git checkout [commit] -- sanity/schemas/contact.ts`

**Q: Site is working but I want to revert everything!**
A: See Appendix C for rollback procedures. Sanity deletions can be restored for 30 days.

---

## Completion Checklist

Print this checklist and check off items as you complete them:

### Phase 1: Critical Data Cleanup
- [ ] Started Sanity Studio
- [ ] Deleted virgin-america duplicate
- [ ] Deleted casa-bonita duplicate
- [ ] Deleted before-launcher duplicate
- [ ] Verified 5 unique projects remain
- [ ] Deleted orphaned "hero" document
- [ ] Made decision on unused schemas (RECOMMENDED: DELETE)
- [ ] Deleted contact document (1)
- [ ] Deleted siteSettings document (1)
- [ ] Deleted capability documents (3)
- [ ] Verified no homepageIntro documents exist
- [ ] All Phase 1 tasks complete

### Phase 2: Code & File Optimization
- [ ] Deleted vite-backup directory
- [ ] Deleted old-migration-scripts directory
- [ ] Verified directories removed
- [ ] Deleted .env file
- [ ] Updated .env.example
- [ ] Verified .env.local is correct
- [ ] Deleted unused schema files (4 files)
- [ ] Updated sanity/schemas/index.ts
- [ ] Removed capability queries from queries.ts
- [ ] Ran `npm run build` successfully
- [ ] No TypeScript errors
- [ ] All Phase 2 tasks complete

### Phase 3: Validation & Improvements
- [ ] Homepage loads correctly
- [ ] All case studies load (no duplicates)
- [ ] AI projects page works
- [ ] Sanity Studio loads without errors
- [ ] Only 4 schemas visible in Studio
- [ ] Production build succeeds
- [ ] Added slug validation (optional)
- [ ] Updated documentation
- [ ] All Phase 3 tasks complete

### Final Verification
- [ ] No console errors
- [ ] No 404 pages
- [ ] All images load
- [ ] Site performance good
- [ ] Git status is clean (or committed)
- [ ] CLEANUP COMPLETE!

---

## Conclusion

This cleanup plan addresses all 6 issues identified in the October 25, 2025 audit:

1. Duplicate project documents → DELETED
2. Orphaned hero document → DELETED
3. Unused schemas → REMOVED (recommended)
4. Backup directories → DELETED
5. Environment variable inconsistency → FIXED
6. Profile singleton → Already fixed (noted in audit)

**Expected Outcomes:**
- Cleaner, more maintainable codebase
- Reduced technical debt
- Better data integrity
- Improved developer experience
- Foundation for future features

**Next Steps:**
1. Review this plan thoroughly
2. Schedule time for execution (2.5-3 hours)
3. Start with Phase 1 (User tasks in Sanity Studio)
4. Proceed to Phase 2 (Claude or User)
5. Complete with Phase 3 (Validation)
6. Celebrate a cleaner codebase!

**Questions?** Refer to Appendix D for support and rollback procedures.

---

**Document Status:** Ready for execution
**Last Updated:** October 25, 2025
**Author:** Claude Code
**Related Documents:**
- [Site & CMS Audit Report](/docs/site-cms-audit-2025-10-25.md)
- [CLAUDE.md](/CLAUDE.md)
- [README.md](/README.md)
