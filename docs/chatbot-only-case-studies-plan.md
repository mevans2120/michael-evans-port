# Chatbot-Only Case Studies Feature Plan

**Date:** November 17, 2025
**Feature:** Hide case studies from list views and recommended cards while keeping them available for chatbot recommendations

---

## Overview

Allow certain case studies to be hidden from public-facing lists and recommendation cards, but remain accessible to the AI chatbot for recommendations. This enables "unlisted" content that users can discover through conversation.

---

## Use Cases

1. **Work-in-progress case studies** - Not ready for public display but chatbot can mention them
2. **Private/NDA projects** - Limited visibility but chatbot can discuss at high level
3. **Archived projects** - Remove from active portfolio but keep in chatbot knowledge base
4. **Easter eggs** - Hidden content users discover through chatbot conversations

---

## Technical Requirements

### 1. Sanity Schema Changes

**File:** `/sanity/schemas/project.ts`

Add new boolean field to project schema:

```typescript
{
  name: 'chatbotOnly',
  title: 'Chatbot Only',
  type: 'boolean',
  description: 'Hide from case study list and recommended cards, but keep available for chatbot recommendations',
  initialValue: false,
  validation: Rule => Rule.required()
}
```

**Optional enhancement:** Add field group for visibility settings:

```typescript
{
  name: 'visibility',
  title: 'Visibility Settings',
  type: 'object',
  fields: [
    {
      name: 'chatbotOnly',
      title: 'Chatbot Only',
      type: 'boolean',
      description: '...',
      initialValue: false
    },
    {
      name: 'draft',
      title: 'Draft',
      type: 'boolean',
      description: 'Hide from all views including chatbot',
      initialValue: false
    }
  ]
}
```

---

### 2. Case Study List Filtering

**Files to modify:**
- `/src/app/case-studies/page.tsx` - Main case studies list page
- `/src/lib/sanity/queries.ts` - GROQ queries for fetching projects

**Current query location:** Find where case studies are fetched for the list view

**Update query to exclude chatbot-only projects:**

```typescript
// Before
const query = `*[_type == "project"] | order(publishedAt desc)`

// After
const query = `*[_type == "project" && chatbotOnly != true] | order(publishedAt desc)`
```

**Alternative using visibility object:**

```typescript
const query = `*[_type == "project" && visibility.chatbotOnly != true && visibility.draft != true] | order(publishedAt desc)`
```

---

### 3. Recommended Content Cards Filtering

**Potential locations:**
- `/src/components/RecommendedContent.tsx` (if exists)
- `/src/components/CaseStudyCard.tsx` (if has related content logic)
- Check for "related projects" or "you might also like" components

**Update approach:**
1. Find all components that display recommended case studies
2. Add same filter: `chatbotOnly != true`
3. Ensure filter is applied at query level (not client-side) for performance

**Search commands to find these:**
```bash
# Find components that might show recommended content
grep -r "recommend" src/components/
grep -r "related" src/components/
grep -r "similar" src/components/

# Find where project queries are used
grep -r "_type == \"project\"" src/
```

---

### 4. Chatbot Access (No Changes Needed)

**The chatbot already has full access - no implementation required.**

The chatbot uses the vector database which syncs ALL published Sanity content automatically:

1. **Sanity webhook** (`/api/admin/sync-content`) pulls everything with `_type == "project"`
2. **No filtering** happens during vector ingestion
3. **Chatbot searches the full database** - it sees all projects regardless of `chatbotOnly` status

**This is the whole point of the feature:** List views filter content, but the chatbot doesn't. Projects marked `chatbotOnly: true` are "unlisted" but still discoverable through conversation.

**Verification (Phase 5):**
- Set a test project to `chatbotOnly: true`
- Confirm it's hidden from `/case-studies` list
- Ask chatbot about that project
- Chatbot should still recommend it and provide the case study link

---

### 5. Direct URL Access

**Decision needed:** What happens if someone visits `/case-studies/hidden-project` directly?

**Option A: Allow direct access (recommended)**
- URL still works if someone has the link
- Only hides from discovery/lists
- Simpler implementation

**Option B: Block direct access**
- Return 404 or redirect for chatbot-only projects
- Requires route-level filtering
- More complex, breaks sharing links

**Recommendation:** Option A - Allow direct access, only filter from lists/cards

---

## Implementation Steps

### Phase 1: Schema Update
- [ ] Add `chatbotOnly` field to `/sanity/schemas/project.ts`
- [ ] Deploy Sanity schema changes
- [ ] Test in Sanity Studio - toggle field on a test project

### Phase 2: Find All List Views
- [ ] Run grep commands to find all places projects are displayed
- [ ] Document each location and its purpose
- [ ] Create checklist of components to update

### Phase 3: Update Queries
- [ ] Update main case studies list query in `/src/lib/sanity/queries.ts`
- [ ] Add filter: `chatbotOnly != true`
- [ ] Update any recommended content queries
- [ ] Update any "featured projects" queries

### Phase 4: Update Components
- [ ] Update case studies list page `/src/app/case-studies/page.tsx`
- [ ] Update any recommendation card components
- [ ] Update any "related content" components
- [ ] Update homepage if it shows project listings

### Phase 5: Testing
- [ ] Set 1-2 test projects to `chatbotOnly: true`
- [ ] Verify they don't appear in:
  - `/case-studies` list page
  - Recommended content cards (if exists)
  - Homepage project listings (if exists)
- [ ] Verify they DO appear in:
  - Chatbot recommendations
  - Direct URL access (`/case-studies/project-slug`)
  - Sanity Studio content manager

### Phase 6: Documentation
- [ ] Update `/docs/chatbot/MAINTAINABLE-CONTENT-SYSTEM.md`
- [ ] Document when to use `chatbotOnly` vs `draft`
- [ ] Add to content editing guidelines

---

## File Locations

### Files to modify:
```
/sanity/schemas/project.ts           # Add chatbotOnly field
/src/lib/sanity/queries.ts           # Update GROQ queries
/src/app/case-studies/page.tsx       # Main case studies list
[TBD - find during Phase 2]          # Recommended content components
```

### Files to reference:
```
/docs/chatbot/MAINTAINABLE-CONTENT-SYSTEM.md  # Chatbot content sync
/src/lib/chatbot/supabase.ts                  # Vector database queries
```

---

## Edge Cases & Considerations

### 1. Search Functionality
If the site has search, should `chatbotOnly` projects appear in search results?
- **Recommendation:** Exclude from search results (consistent with list view)

### 2. Sitemap & SEO
Should `chatbotOnly` projects be in the sitemap?
- **Recommendation:** Exclude from sitemap if SEO discoverability is unwanted
- **Alternative:** Include in sitemap if direct access is okay

### 3. Analytics
Track when chatbot recommends `chatbotOnly` projects:
- Add logging in chatbot when including case study links
- Monitor which hidden projects get discovered most

### 4. Admin View
Consider adding an admin-only view showing all projects including hidden ones:
- `/admin/case-studies` - Shows all projects with visibility status
- Helps content managers audit what's hidden

---

## Testing Checklist

**Setup:**
- [ ] Create test project "Test Hidden Project"
- [ ] Set `chatbotOnly: true`
- [ ] Publish changes

**List Views:**
- [ ] Visit `/case-studies` - Hidden project should NOT appear
- [ ] Check homepage projects section - Should NOT appear
- [ ] Check any "featured projects" - Should NOT appear

**Chatbot:**
- [ ] Ask chatbot: "What projects has Michael worked on?"
- [ ] Hidden project SHOULD be mentioned if relevant
- [ ] Case study link SHOULD work when chatbot provides it

**Direct Access:**
- [ ] Visit `/case-studies/test-hidden-project` directly
- [ ] Page SHOULD load (based on Option A recommendation)

**Sanity Studio:**
- [ ] Hidden project SHOULD appear in Sanity content list
- [ ] Toggle `chatbotOnly` field and verify it saves

---

## Alternative: Draft Status

Consider if existing `draft` field could handle this:

**Current behavior (if exists):**
- `draft: true` - Hide from ALL views including chatbot

**Proposed behavior:**
- `draft: true` - Hide from all views (work in progress)
- `chatbotOnly: true` - Hide from lists, keep in chatbot

This gives three visibility states:
1. **Public** (`draft: false, chatbotOnly: false`) - Everywhere
2. **Chatbot-only** (`draft: false, chatbotOnly: true`) - Chatbot and direct URL only
3. **Draft** (`draft: true`) - Nowhere, editing in progress

---

## Success Criteria

✅ **Feature is successful when:**
1. Projects marked `chatbotOnly` don't appear in case study list
2. Projects marked `chatbotOnly` don't appear in recommended cards
3. Chatbot can still recommend and link to chatbot-only projects
4. Direct URLs to chatbot-only projects still work
5. Content editors understand when to use the field

---

## Future Enhancements

1. **Visibility scheduler** - Auto-hide/show projects based on dates
2. **Conditional visibility** - Hide from lists but show in specific contexts
3. **Password-protected case studies** - Chatbot can mention but requires password to view
4. **Limited recommendations** - Chatbot mentions project exists but can't share details

---

## Questions to Answer

Before implementing:
1. ✅ Do we have recommended content cards? (Find in Phase 2)
2. ✅ Should direct URLs work for hidden projects? (Recommendation: Yes)
3. ✅ Do we want both `draft` and `chatbotOnly`? (Recommendation: Yes, different purposes)
4. Should search include hidden projects? (Recommendation: No)
5. Should sitemap include hidden projects? (Decide based on SEO strategy)

---

## Rollback Plan

If issues arise:
1. Set all `chatbotOnly` fields to `false` in Sanity
2. Revert query changes
3. Deploy previous version
4. No data loss - field can be removed from schema later if needed
