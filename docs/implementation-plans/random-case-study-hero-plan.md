# Random Case Study Hero Implementation Plan

**Date**: November 5, 2025
**Context**: Replace "featured" case study selection with randomized selection on case studies page hero

## 📋 Current State Analysis

### Current Implementation
**File**: `/src/app/(public)/case-studies/page.tsx`

```typescript
const [{ data: featuredCaseStudy }, { data: allProjects }] = await Promise.all([
  sanityFetch({ query: featuredCaseStudyQuery }),  // Gets first featured project
  sanityFetch({ query: projectsQuery })
])
```

**Query**: `/src/lib/sanity/queries.ts` (line 266-267)
```groq
*[_type == "project" && featured == true] | order(order asc)[0]
```

**Current Behavior**:
- Fetches all projects where `featured == true`
- Sorts by `order` field ascending
- Returns first result `[0]`
- Always shows the same case study (deterministic)

### Current Data
Based on your projects, there are 5 case studies:
1. Virgin America
2. Before Launcher
3. Casa Bonita
4. Target
5. Peddle

All have `featured: true` in Sanity, and they're ordered by the `order` field.

---

## 🎯 Implementation Options

### Option 1: Client-Side Randomization (Recommended)
**Approach**: Fetch all eligible projects, randomly select one on the server during SSR.

**Pros**:
- ✅ Simple implementation
- ✅ No Sanity schema changes required
- ✅ Works with ISR (Incremental Static Regeneration)
- ✅ Truly random on each build/revalidation
- ✅ Can still use `featured` flag to control eligible projects

**Cons**:
- ⚠️ Same case study shown to all users during revalidation window (1 hour ISR)
- ⚠️ Not random per-user (but this is likely desired for consistency)

**How It Works**:
```typescript
// 1. Fetch ALL featured projects
const { data: allFeaturedProjects } = await sanityFetch({
  query: allFeaturedCaseStudiesQuery
})

// 2. Randomly select one
const randomIndex = Math.floor(Math.random() * allFeaturedProjects.length)
const randomCaseStudy = allFeaturedProjects[randomIndex]

// 3. Use it in hero
<CaseStudiesHero caseStudy={randomCaseStudy} />
```

---

### Option 2: GROQ Random Sampling
**Approach**: Use GROQ's built-in randomization to select one project.

**Query**:
```groq
*[_type == "project" && featured == true] | order(_createdAt)
  | [0...100] // Get all
  | order(random()) // Randomize order
  | [0] // Take first
```

**Pros**:
- ✅ Randomization happens in Sanity
- ✅ Clean, declarative query
- ✅ No additional logic in page component

**Cons**:
- ⚠️ GROQ's `random()` is not truly random (uses document ID as seed)
- ⚠️ Same result for same document set (deterministic)
- ⚠️ Doesn't solve the "different random on each build" problem

**Verdict**: Not recommended for true randomization.

---

### Option 3: Time-Based Selection
**Approach**: Rotate case studies based on time (e.g., day of year).

**Implementation**:
```typescript
const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
const selectedIndex = dayOfYear % allFeaturedProjects.length
const caseStudy = allFeaturedProjects[selectedIndex]
```

**Pros**:
- ✅ Deterministic but appears random
- ✅ Changes automatically each day
- ✅ Same case study shown to all users on same day (cache-friendly)
- ✅ Predictable (can preview tomorrow's selection)

**Cons**:
- ⚠️ Not truly random
- ⚠️ Predictable pattern (every 5 days, same case study shows)

**Verdict**: Good middle ground for cache-friendly "rotation" vs true randomness.

---

## ✅ Recommended Approach: Option 1 (Server-Side Random)

### Implementation Steps

#### 1. Update Sanity Query
**File**: `/src/lib/sanity/queries.ts`

**Change**:
```typescript
// OLD: Get first featured project
export const featuredCaseStudyQuery = groq`
  *[_type == "project" && featured == true] | order(order asc)[0] {
    // ... fields
  }
`

// NEW: Get ALL featured projects (rename for clarity)
export const allFeaturedCaseStudiesQuery = groq`
  *[_type == "project" && featured == true] | order(order asc) {
    _id,
    title,
    slug,
    heroSection {
      badge,
      title,
      subtitle,
      summary
    },
    metrics[] {
      label,
      value,
      description
    },
    featuredImage {
      asset->{
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      },
      alt
    }
  }
`
```

#### 2. Update Case Studies Page
**File**: `/src/app/(public)/case-studies/page.tsx`

**Before**:
```typescript
const [{ data: featuredCaseStudy }, { data: allProjects }] = await Promise.all([
  sanityFetch({ query: featuredCaseStudyQuery }),
  sanityFetch({ query: projectsQuery })
])
```

**After**:
```typescript
const [{ data: featuredProjects }, { data: allProjects }] = await Promise.all([
  sanityFetch({ query: allFeaturedCaseStudiesQuery }),
  sanityFetch({ query: projectsQuery })
])

// Randomly select one featured project
const randomCaseStudy = featuredProjects && featuredProjects.length > 0
  ? featuredProjects[Math.floor(Math.random() * featuredProjects.length)]
  : null
```

**Render**:
```typescript
{randomCaseStudy && (
  <CaseStudiesHero caseStudy={randomCaseStudy} />
)}
```

#### 3. Update Badge to Use Category Field
**File**: `/src/components/case-studies/CaseStudiesHero.tsx`

**Current** (line 62-63):
```typescript
<div className="inline-block text-sm font-semibold tracking-widest uppercase text-accent-light mb-6">
  {caseStudy.heroSection?.badge || 'Featured Case Study'}
</div>
```

**Updated** (use `category` like the list component does):
```typescript
<div className="inline-block text-sm font-semibold tracking-widest uppercase text-accent-light mb-6">
  {caseStudy.category || 'Case Study'}
</div>
```

**Rationale**:
- Matches the badge in `FeaturedCaseStudies` component (line 94: `{study.category}`)
- Uses same CMS field for consistency
- Falls back to "Case Study" if category is not set

**Note**: Need to ensure `category` is included in the Sanity query (it already is in `featuredCaseStudyQuery`).

---

#### 4. Add "Randomly Selected" Badge
**File**: `/src/components/case-studies/CaseStudiesHero.tsx`

**Location**: Bottom left of hero section

**Add before closing `</section>` tag**:
```typescript
{/* Randomly Selected Badge - Bottom Left */}
<div className="absolute bottom-8 left-8 z-20">
  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-border text-xs font-medium text-muted-foreground">
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="w-3 h-3"
    >
      <circle cx="8" cy="8" r="6" />
      <path d="M8 5v6M5 8h6" />
    </svg>
    Randomly Selected
  </div>
</div>
```

**Styling Details**:
- **Position**: Absolute bottom-left (8px/2rem padding)
- **Background**: Semi-transparent background with backdrop blur
- **Border**: Subtle border using design system `border` token
- **Text**: Small, muted color (`text-muted-foreground`)
- **Icon**: Small shuffle/random icon (plus in circle as placeholder)
- **Size**: Compact, not visually competing with hero content

**Alternative Icon** (if you prefer a shuffle icon):
```typescript
<svg
  viewBox="0 0 16 16"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
  strokeLinecap="round"
  strokeLinejoin="round"
  className="w-3 h-3"
>
  <path d="M2 8h4m4 0h4M8 4l4 4-4 4" />
</svg>
```

---

## 🧪 Testing Checklist

After implementation:

- [ ] Verify query returns all featured projects
- [ ] Refresh page multiple times (with cache cleared) to see different case studies
- [ ] Check that hero displays correctly for each case study
- [ ] Verify ISR revalidation works (hero changes after 1 hour)
- [ ] Test with `featured: false` on some projects (should not appear in hero)
- [ ] Verify build succeeds
- [ ] Check production deployment

---

## 📊 Caching Behavior

### Current Setup (ISR)
- **Revalidation**: 1 hour (from `/src/app/(public)/case-studies/[slug]/page.tsx`)
- **Effect**: Same random case study shown to all users for ~1 hour
- **Benefit**: Better performance, no flash/flicker

### If You Want Per-User Randomization
Would require:
1. Client-side randomization (bad UX - flash on load)
2. Or dynamic rendering (no ISR benefits)

**Recommendation**: Keep ISR, accept that case study changes every ~1 hour for all users.

---

## 🔄 Rollback Plan

If randomization causes issues:

1. **Revert query name**:
   ```typescript
   export const featuredCaseStudyQuery = groq`
     *[_type == "project" && featured == true] | order(order asc)[0] {
       // ... fields
     }
   `
   ```

2. **Revert page logic**:
   ```typescript
   const [{ data: featuredCaseStudy }, { data: allProjects }] = await Promise.all([
     sanityFetch({ query: featuredCaseStudyQuery }),
     sanityFetch({ query: projectsQuery })
   ])
   ```

3. **Revert badge text**: Change back to "Featured Case Study"

---

## 📝 Alternative: Weighted Randomization

If you want some case studies to appear more frequently:

**Add field to Sanity schema**: `heroWeight: number` (default: 1)

**Logic**:
```typescript
// Create weighted array (repeat projects by weight)
const weightedArray = featuredProjects.flatMap(project =>
  Array(project.heroWeight || 1).fill(project)
)

// Random selection from weighted array
const randomCaseStudy = weightedArray[
  Math.floor(Math.random() * weightedArray.length)
]
```

**Example**:
- Virgin America (weight: 3) → appears 3x more often
- Before Launcher (weight: 1) → standard frequency

---

## 🚀 Files to Modify

1. `/src/lib/sanity/queries.ts`
   - Rename `featuredCaseStudyQuery` → `allFeaturedCaseStudiesQuery`
   - Remove `[0]` to return array

2. `/src/app/(public)/case-studies/page.tsx`
   - Import new query name
   - Add randomization logic
   - Update variable name

3. `/src/components/case-studies/CaseStudiesHero.tsx`
   - Update badge to use `category` field (matching list component)
   - Add "Randomly Selected" badge in bottom-left corner

**Total Changes**: 3 files, ~20 lines of code

---

## ⏱️ Estimated Implementation Time

- **Analysis**: ✅ Complete
- **Implementation**: ~15 minutes
- **Testing**: ~10 minutes
- **Total**: ~25 minutes

---

## 💡 Future Enhancements

1. **Analytics**: Track which case studies get clicked more from hero
2. **Smart Rotation**: Ensure all case studies shown equally over time
3. **Exclusion Logic**: Don't show same case study twice in a row (requires session storage)
4. **A/B Testing**: Test conversion rates for different case studies in hero

---

## ✅ Recommendation

**Go with Option 1 (Server-Side Random)**:
- Simplest implementation
- No schema changes
- Works with existing ISR setup
- True randomness on each revalidation
- Easy to rollback

**Next Steps**:
1. Review this plan
2. Approve approach
3. Implement changes (~15 min)
4. Test locally
5. Deploy to production
