# Sanity Schema Removal Plan
## Timeline Phase, Workflow Step, and Project Card

**Date:** November 14, 2025
**Author:** Claude Code
**Status:** Ready for Review

---

## Overview

This plan outlines the complete removal of three unused Sanity schemas from the CMS while preserving all live site functionality. These schemas were created to support the deprecated AI Showcase feature and are no longer needed.

### Schemas to Remove
1. **Timeline Phase** - AI workflow evolution timeline
2. **Workflow Step** - PostPal workflow demonstration
3. **Project Card** - Marketing sites showcase

### Current Status
- **13 documents** exist in production using these schemas
- **Referenced by** archived AI Showcase documents
- **Not rendered** on any live pages
- **Safe to remove** with proper cleanup

---

## Pre-Removal Checklist

Before starting removal, complete these tasks:

- [ ] Confirm AI Showcase feature is permanently deprecated
- [ ] Create full backup of all affected documents
- [ ] Verify no future plans to use this content
- [ ] Get approval to permanently delete content
- [ ] Schedule maintenance window (15-30 minutes)

---

## Step-by-Step Removal Process

### Phase 1: Backup All Data (5 minutes)

Create backups before any destructive operations:

```bash
# Create backup directory
mkdir -p backups/schema-removal-$(date +%Y%m%d)
cd backups/schema-removal-$(date +%Y%m%d)

# Export all affected documents
npx sanity documents query '*[_type == "timelinePhase"]' \
  --dataset production > timeline-phases.json

npx sanity documents query '*[_type == "workflowStep"]' \
  --dataset production > workflow-steps.json

npx sanity documents query '*[_type == "projectCard"]' \
  --dataset production > project-cards.json

npx sanity documents query '*[_type == "aiShowcase"]' \
  --dataset production > ai-showcases.json

# Create combined backup
npx sanity documents query \
  '*[_type in ["timelinePhase", "workflowStep", "projectCard", "aiShowcase"]]' \
  --dataset production > all-affected-documents.json

echo "✅ Backup complete: $(pwd)"
```

### Phase 2: Remove References (10 minutes)

Since AI Showcase documents reference these schemas, we need to handle them first.

#### Option A: Delete AI Showcase Documents (Recommended)
Since AI Showcase is archived and not used:

```bash
# Delete the 3 AI Showcase documents
npx sanity documents delete \
  aiShowcase-ai-workflow \
  aiShowcase-postpal \
  aiShowcase-marketing-sites \
  --dataset production
```

#### Option B: Null Out References (Alternative)
If keeping AI Showcase documents for historical purposes:

```javascript
// Script to null out references
// Save as: scripts/null-showcase-references.ts

import { client } from '@/lib/sanity/client'

async function nullReferences() {
  const showcases = await client.fetch(
    `*[_type == "aiShowcase"]`
  )

  for (const showcase of showcases) {
    await client
      .patch(showcase._id)
      .unset(['timelinePhases', 'workflowSteps', 'projectCards'])
      .commit()
  }

  console.log('✅ References removed from', showcases.length, 'showcases')
}

nullReferences()
```

Run with: `npx tsx scripts/null-showcase-references.ts`

### Phase 3: Delete Content Documents (5 minutes)

After removing references, delete the actual documents:

```bash
# Delete Timeline Phase documents (6 total)
npx sanity documents delete \
  timelinePhase-experimentation \
  timelinePhase-tool-discovery \
  timelinePhase-production-ready \
  timelinePhase-skills-ecosystem \
  timelinePhase-production-projects \
  timelinePhase-continuous-evolution \
  --dataset production

# Delete Workflow Step documents (4 total)
npx sanity documents delete \
  workflowStep-provider-upload \
  workflowStep-ai-extraction \
  workflowStep-timeline-generation \
  workflowStep-patient-engagement \
  --dataset production

# Delete Project Card documents (3 total)
npx sanity documents delete \
  projectCard-doa \
  projectCard-opal-creek \
  projectCard-karuna-gatton \
  --dataset production
```

### Phase 4: Remove Schema Files (5 minutes)

Now safe to remove schema definitions:

```bash
# Delete schema files
rm sanity/schemas/timelinePhase.ts
rm sanity/schemas/workflowStep.ts
rm sanity/schemas/projectCard.ts

# Archive instead if preferred
mkdir -p sanity/schemas/_archive
mv sanity/schemas/timelinePhase.ts sanity/schemas/_archive/
mv sanity/schemas/workflowStep.ts sanity/schemas/_archive/
mv sanity/schemas/projectCard.ts sanity/schemas/_archive/
```

### Phase 5: Update Schema Registry (2 minutes)

Edit `/sanity/schemas/index.ts`:

```typescript
// REMOVE these imports (lines 8-10)
- import timelinePhase from './timelinePhase'
- import workflowStep from './workflowStep'
- import projectCard from './projectCard'

// REMOVE from schemaTypes array (around lines 30-32)
export const schemaTypes = [
  // ... other schemas
- timelinePhase,
- workflowStep,
- projectCard,
  // ... other schemas
]
```

### Phase 6: Clean Up TypeScript Types (5 minutes)

Edit `/src/types/aiShowcase.ts`:

```typescript
// REMOVE these interfaces (lines 43-67)
- export interface TimelinePhase {
-   _id: string
-   _type: 'timelinePhase'
-   phase: string
-   title: string
-   description: string
-   order: number
- }

- export interface WorkflowStep {
-   _id: string
-   _type: 'workflowStep'
-   stepNumber: number
-   title: string
-   description: string
-   icon?: string
- }

- export interface ProjectCard {
-   _id: string
-   _type: 'projectCard'
-   projectName: string
-   projectType: string
-   description: string
-   technologies?: string[]
-   icon?: string
-   order: number
- }

// UPDATE AIShowcase interface (lines 93-95)
export interface AIShowcase {
  // ... other fields
- timelinePhases?: TimelinePhase[]
- workflowSteps?: WorkflowStep[]
- projectCards?: ProjectCard[]
}
```

### Phase 7: Verify and Test (5 minutes)

Run verification checks:

```bash
# 1. Check TypeScript compilation
npm run build

# 2. Start dev server and check for errors
npm run dev

# 3. Open Sanity Studio and verify no schema errors
open http://localhost:3000/studio

# 4. Run Sanity validation
npx sanity documents query \
  '{
    "timelinePhases": count(*[_type == "timelinePhase"]),
    "workflowSteps": count(*[_type == "workflowStep"]),
    "projectCards": count(*[_type == "projectCard"]),
    "aiShowcases": count(*[_type == "aiShowcase"])
  }' --dataset production

# Should return:
# {
#   "timelinePhases": 0,
#   "workflowSteps": 0,
#   "projectCards": 0,
#   "aiShowcases": 0 (or 3 if kept)
# }
```

### Phase 8: Deploy Changes (5 minutes)

```bash
# Commit all changes
git add -A
git commit -m "Remove unused Sanity schemas: timelinePhase, workflowStep, projectCard

- Removed schema definitions and registry entries
- Cleaned up TypeScript types
- No impact on live site functionality"

# Push to repository
git push origin main

# Deploy to production
vercel --prod
```

---

## Rollback Plan

If issues arise, follow this rollback procedure:

### Quick Rollback (< 5 minutes)

1. **Restore schema files from git:**
```bash
git revert HEAD
git push origin main
vercel --prod
```

2. **Restore documents from backup:**
```bash
npx sanity documents import backups/schema-removal-[date]/all-affected-documents.json \
  --dataset production \
  --replace
```

### Full Restoration (10 minutes)

If git revert isn't sufficient:

1. **Restore schema files from backup:**
```bash
# If archived
cp sanity/schemas/_archive/timelinePhase.ts sanity/schemas/
cp sanity/schemas/_archive/workflowStep.ts sanity/schemas/
cp sanity/schemas/_archive/projectCard.ts sanity/schemas/

# Re-add to index.ts
```

2. **Restore TypeScript types** from git history

3. **Import all documents** from backup

4. **Rebuild and deploy**

---

## Post-Removal Verification

After successful removal, verify:

### Sanity Studio
- [ ] No schema errors in console
- [ ] No "Unknown type" warnings
- [ ] Document list loads correctly
- [ ] Can create/edit other document types

### Website Functionality
- [ ] Homepage loads correctly
- [ ] All case studies display properly
- [ ] Navigation works
- [ ] No console errors
- [ ] Build succeeds

### Database State
- [ ] 0 timelinePhase documents
- [ ] 0 workflowStep documents
- [ ] 0 projectCard documents
- [ ] Other document types unaffected

---

## Risk Assessment

### What Could Go Wrong

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Schema validation errors | Low | Medium | Follow removal order exactly |
| Broken references | Low | Low | Remove references first |
| TypeScript errors | Medium | Low | Update types before building |
| Data loss | Very Low | High | Complete backups before starting |
| Studio crashes | Very Low | Medium | Test in development first |

### Safety Measures

1. **Complete backups** before any deletions
2. **Follow exact order** (references → documents → schemas → types)
3. **Test locally** before production
4. **Keep backups** for 30 days minimum
5. **Document everything** in git commits

---

## Alternative Approaches

### Option 1: Archive Only (Most Conservative)
- Move schemas to `_archive` folder
- Keep all documents in database
- Remove from schema registry
- **Pros:** Easy rollback, preserves data
- **Cons:** Clutters database, confusing

### Option 2: Migrate to Case Studies
- Convert AI Showcase content to regular projects
- Transform timeline phases to article content
- Preserve valuable narrative
- **Pros:** Keeps content, enhances portfolio
- **Cons:** More complex, 2-4 hours work

### Option 3: Clean Removal (Recommended)
- Complete removal as outlined above
- **Pros:** Clean, simple, reversible
- **Cons:** Permanent data deletion

---

## Content Being Removed

For reference, this content will be permanently deleted:

### Timeline Phases (6 documents)
- Spring 2024: Experimentation with Replit
- Mid 2024: Tool Discovery (Claude Code, Cursor)
- Fall 2024: Production Ready workflows
- Winter 2024: Skills Ecosystem development
- Present: Production Projects
- Ongoing: Continuous Evolution

### Workflow Steps (4 documents)
- Provider Upload
- AI Content Extraction
- Timeline Generation
- Patient Engagement

### Project Cards (3 documents)
- Department of Art (Film & TV)
- Opal Creek (Environmental org)
- Karuna Gatton (Professional services)

---

## Success Criteria

Removal is successful when:

- ✅ All 3 schemas removed from registry
- ✅ All 13 documents deleted from database
- ✅ TypeScript types updated
- ✅ No build errors
- ✅ Sanity Studio works normally
- ✅ Website functionality unchanged
- ✅ Backups safely stored

---

## Timeline

**Total Time:** 30-45 minutes

| Phase | Duration | Can Parallelize? |
|-------|----------|------------------|
| Backup | 5 min | No |
| Remove References | 10 min | No |
| Delete Documents | 5 min | No |
| Remove Schemas | 5 min | Yes* |
| Update Registry | 2 min | Yes* |
| Clean Types | 5 min | Yes* |
| Verify & Test | 5 min | No |
| Deploy | 5 min | No |

*Can be done simultaneously after documents are deleted

---

## Questions to Answer Before Starting

1. **Is AI Showcase permanently deprecated?**
   - If no, consider archiving instead of deleting

2. **Should timeline narrative be preserved?**
   - If yes, consider migration to case studies

3. **Are there any future plans for this content?**
   - If yes, export and archive externally

4. **Has this been communicated to stakeholders?**
   - If no, get approval first

---

## Contact for Issues

If problems arise during removal:

1. Check this plan's rollback section
2. Review backup files
3. Check git history for original files
4. Sanity Studio logs for schema errors

---

## Approval

Before proceeding with this plan:

- [ ] Content owner approval
- [ ] Technical review complete
- [ ] Backups verified
- [ ] Maintenance window scheduled
- [ ] Rollback plan understood

---

**End of Removal Plan**

*This document should be kept for reference and updated with actual execution notes.*