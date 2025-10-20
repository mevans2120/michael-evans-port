# Phase 4: Routing Migration - IN PROGRESS

**Start Date:** 2025-10-20
**Status:** Core routing structure complete, page migration in progress

---

## Completed Tasks ✅

### 1. Root Layout with Providers
- ✅ Created QueryProvider component (`/src/components/providers/query-provider.tsx`)
- ✅ Updated root layout with:
  - Inter font (matching original)
  - QueryProvider wrapper
  - Toaster components (shadcn/ui)
  - Skip navigation for accessibility
  - Proper metadata

### 2. Complete Route Structure Created
All 13 routes from React Router converted to Next.js App Router structure:

```
/                              → /src/app/page.tsx
/about                         → /src/app/about/page.tsx
/ai-showcase                   → /src/app/ai-showcase/page.tsx
/ai-research                   → /src/app/ai-research/page.tsx
/case-studies/[slug]           → /src/app/case-studies/[slug]/page.tsx
/ai-projects/post-pal          → /src/app/ai-projects/post-pal/page.tsx
/ai-projects/karuna-gatton     → /src/app/ai-projects/karuna-gatton/page.tsx
/ai-projects/ai-research-agent → /src/app/ai-projects/ai-research-agent/page.tsx
/ai-projects/department-of-art → /src/app/ai-projects/department-of-art/page.tsx
/studio/[[...index]]           → /src/app/studio/[[...index]]/page.tsx
404                            → /src/app/not-found.tsx
```

**Status:** ✅ All directory structure created

---

## Remaining Tasks 🔄

### Page Content Migration

**Source pages to migrate (~1,875 lines total):**

1. **HomeMinimal.tsx** (532 lines) - Complex interactive hero with dropdown
   - Uses React Router's `Link`, `useNavigate`
   - Fetches data from Sanity
   - Complex state management
   - Framer Motion animations

2. **About.tsx** - Professional background page

3. **AIShowcase.tsx** - AI projects showcase

4. **AIResearch.tsx** - AI research page

5. **CaseStudy.tsx** - Dynamic case study template

6. **AI Project Pages** (4 pages):
   - PostPal
   - KarunaGatton
   - AIResearchAgent
   - DepartmentOfArt

7. **Studio.tsx** - Sanity Studio embedding

8. **Test pages** (3 pages) - Can be skipped or removed

### Required Conversions

Each page needs these changes:

#### 1. Add 'use client' directive (for pages with interactivity)
```typescript
"use client"
```

#### 2. Replace React Router imports
```typescript
// Before
import { Link, useNavigate, useParams } from 'react-router-dom'

// After
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
```

#### 3. Update hook usage
```typescript
// Before
const navigate = useNavigate()
const { slug } = useParams()

// After
const router = useRouter()
// params come from props: { params }: { params: { slug: string } }
```

#### 4. Update Link components
```typescript
// Before
<Link to="/about">About</Link>

// After
<Link href="/about">About</Link>
```

#### 5. Navigation component needs updating
- Replace React Router Link with Next.js Link
- Replace useLocation with usePathname
- Add 'use client' directive

---

## Approaches for Completion

### Option A: Full Page Migration (Recommended for production)
**Estimated time:** 3-4 hours
- Copy all page files
- Convert React Router → Next.js for each
- Test all pages thoroughly
- Ensure all features work

**Pros:**
- Complete, production-ready
- All features preserved
- Thorough testing possible

**Cons:**
- Time-intensive
- Complex pages require careful conversion

### Option B: Simplified Placeholder Pages (Quick validation)
**Estimated time:** 30-45 minutes
- Create simple placeholder pages showing routing works
- Demonstrate the conversion pattern
- Full pages can be migrated later

**Pros:**
- Quick proof-of-concept
- Shows routing structure works
- Can proceed to other phases

**Cons:**
- Not production-ready
- Features not yet functional

### Option C: Hybrid Approach (Balanced)
**Estimated time:** 1-2 hours
- Fully migrate 2-3 key pages (Home, About, AI Showcase)
- Create placeholders for remaining pages
- Document conversion pattern

**Pros:**
- Demonstrates full conversion
- Shows routing works
- Reasonable time investment

**Cons:**
- Some pages still need work

---

## Current Status

### What's Working ✅
- Next.js app structure
- All dependencies installed
- All components available
- Routing structure created
- Root layout with providers
- Dev server running

### What Needs Work 🔄
- Individual page content migration
- Navigation component conversion
- Testing all routes
- Verifying data fetching works

---

## Estimated Remaining Time

- **Option A (Full):** 3-4 hours
- **Option B (Simplified):** 30-45 minutes
- **Option C (Hybrid):** 1-2 hours

---

## Next Steps

Choose an approach based on goals:

1. **For production deployment:** Option A - Full migration
2. **For quick validation:** Option B - Placeholders
3. **For balanced progress:** Option C - Hybrid

After page migration, remaining phases:
- Phase 5: Sanity CMS Integration (verify)
- Phase 6: Data Fetching (convert patterns)
- Phase 7: Optimization (images, metadata, performance)
- Phase 8: Testing & Validation

---

## Technical Notes

### React Router → Next.js Patterns

**Navigation:**
```typescript
// React Router
navigate('/about')
navigate(-1)

// Next.js
router.push('/about')
router.back()
```

**Current Path:**
```typescript
// React Router
const location = useLocation()
const isActive = location.pathname === '/about'

// Next.js
const pathname = usePathname()
const isActive = pathname === '/about'
```

**Dynamic Routes:**
```typescript
// React Router
<Route path="/case-studies/:slug" element={<CaseStudy />} />
// In component: const { slug } = useParams()

// Next.js
// File: /app/case-studies/[slug]/page.tsx
export default function CaseStudy({ params }: { params: { slug: string } }) {
  const { slug } = params
}
```

---

**Current Phase Status:** ✅ Routing structure complete, page migration pending
**Recommendation:** Discuss approach before proceeding with full page migration
