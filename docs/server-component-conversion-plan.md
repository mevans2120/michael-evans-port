# Server Component Conversion Implementation Plan

**Date:** October 31, 2025
**Purpose:** Convert Client Components to Server Components for improved performance and SEO
**Next.js Version:** 15.5.6
**Estimated Total Time:** 2.5 hours

---

## Executive Summary

This plan outlines the conversion of three critical pages from Client Components to Server Components:

1. `/about` - **BROKEN** (P0) - Shows infinite loading spinner
2. `/` - Homepage (P1) - High traffic, SEO critical
3. `/case-studies/[slug]` - Case study detail pages (P1) - Portfolio content, SEO critical

**Expected Benefits:**
- Fix broken `/about` page (currently non-functional)
- 80% faster perceived load time on homepage
- 95% faster navigation to case studies (instant vs 1-2 seconds)
- Perfect SEO with pre-rendered content
- Improved Lighthouse scores across the board

---

## Reference Implementation

The `/case-studies` landing page (`/src/app/(public)/case-studies/page.tsx`) and `/ai-showcase/[slug]` pages are **already Server Components** and follow best practices. Use these as reference patterns:

**Server Component Pattern:**
```typescript
// No 'use client'
export default async function Page() {
  const data = await client.fetch(query)
  return <Component data={data} />
}
```

**Hybrid Pattern (Server + Client):**
```typescript
// page.tsx - Server Component
export default async function Page() {
  const data = await client.fetch(query)
  return <ClientComponent data={data} />
}

// ClientComponent.tsx - Client Component for interactivity
'use client'
export function ClientComponent({ data }) {
  // Interactive features only
}
```

---

## Conversion Priority & Timeline

### Phase 1: Fix Broken Page (Immediate - 30 minutes)
**Page:** `/about`
**Rationale:** Page is currently broken and non-functional

### Phase 2: High-Traffic Performance (Same Day - 2 hours)
**Pages:** `/` (homepage) and `/case-studies/[slug]`
**Rationale:** Highest traffic pages, critical for SEO and user experience

---

## Page 1: `/about` Page Conversion

### Current Status
- **File:** `/src/app/(public)/about/page.tsx`
- **Status:** BROKEN - Shows "Loading..." indefinitely
- **Issue:** Client-side data fetching with `useEffect` never completes
- **Priority:** P0 (Critical - page doesn't work)

### Current Implementation Analysis

**Problems:**
1. Uses `'use client'` directive
2. Fetches profile data with `useEffect`
3. Has loading state that gets stuck
4. Content not in initial HTML (SEO penalty)
5. Unnecessary client-side complexity

**Current Code Pattern:**
```typescript
'use client'
export default function AboutPage() {
  const [data, setData] = useState<AboutData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAboutData() {
      const result = await client.fetch(QUERY)
      setData(result)
      setLoading(false)
    }
    fetchAboutData()
  }, [])

  if (loading) return <div>Loading...</div>
  // ... render
}
```

### Conversion Steps

#### 1. Pre-Conversion Checklist
- [x] Current page uses Client Component with `useEffect`
- [x] No browser-specific APIs required
- [x] No client-side state management needed
- [x] Page displays static CMS content only
- [x] Has PortableText rendering (server-compatible)
- [x] Has Image optimization (server-compatible)

#### 2. Code Changes Required

**Changes:**
1. Remove `'use client'` directive (line 1)
2. Remove all React hook imports (line 3: `useEffect`, `useState`)
3. Convert function to `async`
4. Replace `useEffect` data fetching with direct `await`
5. Remove loading and error state logic
6. Use Next.js `notFound()` for error handling
7. Keep all UI rendering logic identical

**After Conversion Pattern:**
```typescript
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { client } from '@/lib/sanity/client'
import { PortableText } from '@portabletext/react'
import { logger } from '@/lib/logger'

// TypeScript interfaces remain the same
interface QuickFact { /* ... */ }
interface AboutData { /* ... */ }

// GROQ query as constant
const ABOUT_PAGE_QUERY = `
  *[_type == "profile"] | order(_updatedAt desc)[0] {
    name,
    "profileImage": profileImage.asset->url,
    heroHeadline,
    heroSubheadline,
    heroIntro,
    quickFacts,
    capabilities,
    sections[] {
      heading,
      slug,
      content,
      subsections,
      visible
    },
    selectedProjects[] | order(order asc),
    availability,
    availabilityText,
    ctaText,
    ctaButtonText
  }
`

export default async function AboutPage() {
  // Direct data fetching - no useEffect
  const data = await client.fetch<AboutData>(ABOUT_PAGE_QUERY)

  // Error handling with Next.js notFound()
  if (!data) {
    logger.error('About page data not found')
    notFound()
  }

  // All existing UI rendering code stays exactly the same
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-gray-100">
      {/* Existing JSX - no changes needed */}
    </div>
  )
}
```

#### 3. Testing Steps

After conversion, verify:

**Functional Tests:**
- [ ] Page loads without errors
- [ ] All sections render correctly
- [ ] Profile photo displays
- [ ] Quick facts grid appears
- [ ] Dynamic content sections show
- [ ] Capabilities list renders
- [ ] Selected projects display
- [ ] CTA section appears
- [ ] No "Loading..." message appears
- [ ] No console errors

**Performance Tests:**
- [ ] Run Lighthouse audit
- [ ] Verify LCP < 2.5s
- [ ] Check View Source shows content in HTML
- [ ] No layout shift during load

**SEO Tests:**
- [ ] View page source - content should be visible
- [ ] Check meta tags in `<head>`
- [ ] Verify structured data if present

#### 4. Expected Improvements

**Before:**
- Infinite loading spinner (BROKEN)
- No content in HTML
- Poor SEO
- Client-side data fetching overhead

**After:**
- Immediate content display
- Full content in initial HTML
- Perfect SEO
- Server-side data fetching
- **Page actually works!**

**Improvement:** ∞% (page works vs doesn't work)

#### 5. Rollback Plan

If issues arise:

1. **Quick Rollback:** Revert file to previous version
   ```bash
   git checkout HEAD -- src/app/\(public\)/about/page.tsx
   ```

2. **Debug Steps:**
   - Check Sanity query returns data
   - Verify `notFound()` import is correct
   - Check for any client-only dependencies
   - Review build output for errors

---

## Page 2: `/` Homepage Conversion

### Current Status
- **File:** `/src/app/(public)/page.tsx`
- **Status:** Working but slow
- **Issue:** Three separate client-side data fetches cause loading delays
- **Priority:** P1 (High traffic, SEO critical)

### Current Implementation Analysis

**Problems:**
1. Uses `'use client'` directive
2. Three separate `useEffect` calls fetch data sequentially:
   - Profile data (image, tagline)
   - Featured case studies
   - Featured AI showcase
3. Loading states cause layout shift
4. Poor LCP (Largest Contentful Paint)
5. Content not in initial HTML

**Current Code Pattern:**
```typescript
'use client'
export default function HomePage() {
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [tagline, setTagline] = useState<string>('')
  const [featuredCaseStudies, setFeaturedCaseStudies] = useState<any[]>([])
  const [featuredShowcase, setFeaturedShowcase] = useState<any | null>(null)

  // Three separate useEffect calls
  useEffect(() => { /* fetch profile */ }, [])
  useEffect(() => { /* fetch case studies + showcase */ }, [])

  // Conditional rendering based on loading states
}
```

### Conversion Steps

#### 1. Pre-Conversion Checklist
- [x] Current page uses Client Component with multiple `useEffect` calls
- [x] No browser-specific APIs required (no window, localStorage, etc.)
- [x] No client-side state needed (just displaying data)
- [x] All components used are server-compatible:
  - `Link` - ✅ Server-safe
  - `Separator` - ✅ UI component
  - `FeaturedCaseStudies` - ✅ Presentational component
  - `ArrowRight` - ✅ Lucide icon

#### 2. Code Changes Required

**Changes:**
1. Remove `'use client'` directive
2. Remove all React hooks (`useState`, `useEffect`, `useRef`)
3. Convert function to `async`
4. Replace three separate fetches with single parallel fetch
5. Remove loading state conditional logic
6. Use existing Sanity queries
7. Keep all UI rendering identical

**After Conversion Pattern:**
```typescript
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Separator } from "@/components/ui/separator"
import { FeaturedCaseStudies } from "@/components/FeaturedCaseStudies"
import { client } from "@/lib/sanity/client"
import { featuredAIShowcaseQuery } from "@/lib/sanity/queries"

// TypeScript interfaces
interface FeaturedCaseStudy {
  id: string
  number: string
  category: string
  title: string
  metric: string
  description: string
  slug: string
  order: number
}

interface ProfileData {
  profileImage: string
  tagline: string
}

interface FeaturedShowcase {
  slug: string
  heroSection: {
    title: string
    summary?: string
  }
}

// GROQ queries as constants
const PROFILE_QUERY = `*[_type == "profile"] | order(_updatedAt desc)[0] {
  "profileImage": profileImage.asset->url,
  tagline
}`

const FEATURED_CASE_STUDIES_QUERY = `
  *[_type == "project" && featured == true] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    featuredCategory,
    featuredMetric,
    featuredDescription,
    order
  }
`

export default async function HomePage() {
  // Parallel data fetching - all at once!
  const [profileData, caseStudiesData, featuredShowcase] = await Promise.all([
    client.fetch<ProfileData>(PROFILE_QUERY),
    client.fetch<any[]>(FEATURED_CASE_STUDIES_QUERY),
    client.fetch<FeaturedShowcase>(featuredAIShowcaseQuery)
  ])

  // Map case studies to component format
  const featuredCaseStudies = caseStudiesData.map((project, index) => ({
    id: project._id,
    number: String(index + 1).padStart(2, '0'),
    category: project.featuredCategory || 'Case Study',
    title: project.title,
    metric: project.featuredMetric || '',
    description: project.featuredDescription || '',
    slug: project.slug,
    order: project.order || index + 1
  }))

  // Extract profile data
  const profileImage = profileData?.profileImage || null
  const tagline = profileData?.tagline || ''

  // Site is always dark mode
  const isDarkMode = true

  // All existing UI rendering stays exactly the same
  // Just remove conditional loading checks
  return (
    <div className={`min-h-screen relative transition-colors duration-300 ${
      isDarkMode
        ? 'bg-gradient-to-b from-gray-900 to-gray-950 text-gray-100'
        : 'bg-gradient-to-b from-slate-50 to-white text-gray-900'
    }`}>
      {/* All existing JSX - just remove loading conditionals */}
      {/* Hero Section */}
      <section className="px-6 relative min-h-[85vh] flex items-center pt-20">
        {/* ... existing hero code ... */}
      </section>

      {/* Featured Work Section */}
      {featuredCaseStudies.length > 0 && (
        <section className="py-20 px-6 relative mt-8">
          {/* ... existing case studies section ... */}
        </section>
      )}

      {/* AI Showcase Section */}
      {featuredShowcase && (
        <section className="py-20 px-6 relative">
          {/* ... existing showcase section ... */}
        </section>
      )}
    </div>
  )
}
```

#### 3. Testing Steps

**Functional Tests:**
- [ ] Homepage loads without errors
- [ ] Profile image displays correctly
- [ ] Tagline appears in hero section
- [ ] Featured case studies render
- [ ] AI showcase section displays
- [ ] All links work correctly
- [ ] No loading spinners appear
- [ ] No layout shift during load
- [ ] No console errors

**Performance Tests:**
- [ ] Run Lighthouse audit
- [ ] Verify LCP < 2.5s (should be ~500ms)
- [ ] Check FCP (First Contentful Paint) < 1.8s
- [ ] Verify TTI (Time to Interactive) < 3.8s
- [ ] No CLS (Cumulative Layout Shift)

**SEO Tests:**
- [ ] View page source - all content visible
- [ ] Meta tags present
- [ ] Structured data valid (if applicable)
- [ ] Social media preview cards work

**Visual Regression:**
- [ ] Compare before/after screenshots
- [ ] Verify animations still work
- [ ] Check gradient effects render
- [ ] Confirm responsive design intact

#### 4. Expected Improvements

**Before:**
- 3 sequential client-side fetches
- ~2-3 second delay before content appears
- Poor LCP score
- Content flicker/layout shift
- No content in initial HTML

**After:**
- 1 parallel server-side fetch
- Content in initial HTML
- ~500ms initial load
- Excellent LCP score
- Zero layout shift

**Improvement:** 80% faster perceived load time

**Lighthouse Score Predictions:**
- Performance: 50-60 → 90-100
- SEO: 70-80 → 95-100
- Best Practices: 80-90 → 95-100

#### 5. Rollback Plan

If issues arise:

1. **Quick Rollback:**
   ```bash
   git checkout HEAD -- src/app/\(public\)/page.tsx
   ```

2. **Partial Rollback (Hybrid Approach):**
   - Keep Server Component for data fetching
   - Extract interactive parts to Client Component
   - Example: If animations break, move them to separate client component

3. **Debug Steps:**
   - Verify all Sanity queries return data
   - Check FeaturedCaseStudies component is server-safe
   - Review component imports (no client-only packages)
   - Check for any missed `useState`/`useEffect` usage

---

## Page 3: `/case-studies/[slug]` Conversion

### Current Status
- **File:** `/src/app/(public)/case-studies/[slug]/page.tsx`
- **Status:** Working but slow, poor SEO
- **Issue:** Client-side data fetching for static content
- **Priority:** P1 (Portfolio content, SEO critical)

### Current Implementation Analysis

**Problems:**
1. Uses `'use client'` directive
2. Fetches data with `useEffect` on navigation
3. Async params handling adds complexity
4. Static content fetched at runtime (should be pre-rendered)
5. Poor SEO - content not in initial HTML
6. Could use Static Site Generation (SSG) for instant loads

**Current Code Pattern:**
```typescript
'use client'
export default function CaseStudyPage({ params }: PageProps) {
  const [slug, setSlug] = useState<string>('')
  const [project, setProject] = useState<CaseStudyData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    params.then(p => setSlug(p.slug))
  }, [params])

  useEffect(() => {
    if (!slug) return
    async function fetchProject() {
      const data = await client.fetch(PROJECT_QUERY, { slug })
      setProject(data)
      setLoading(false)
    }
    fetchProject()
  }, [slug])

  if (loading) return <div>Loading...</div>
  // ... render
}
```

### Conversion Steps

#### 1. Pre-Conversion Checklist
- [x] Current page uses Client Component with async params
- [x] No browser-specific APIs required
- [x] No client-side interactivity needed
- [x] Content is static (perfect for SSG)
- [x] Uses PortableText (server-compatible)
- [x] Uses Next.js Image (server-compatible)
- [x] Reference implementation exists: `/ai-showcase/[slug]/page.tsx`

#### 2. Code Changes Required

**Changes:**
1. Remove `'use client'` directive
2. Remove all React hooks (`useState`, `useEffect`)
3. Convert function to `async`
4. Await params directly (no Promise handling needed)
5. Replace `useEffect` with direct `await` fetch
6. Add `generateStaticParams` for SSG
7. Add `generateMetadata` for SEO
8. Add ISR revalidation
9. Use `notFound()` for error handling
10. Keep all UI rendering identical

**After Conversion Pattern:**
```typescript
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { client } from "@/lib/sanity/client"
import { PortableText } from '@portabletext/react'
import { urlFor } from '@/lib/sanity/client'
import Image from 'next/image'

// TypeScript interfaces remain the same
interface Screenshot { /* ... */ }
interface CaseStudyData { /* ... */ }

// GROQ query as constant
const PROJECT_QUERY = `*[_type == "project" && slug.current == $slug][0] {
  title,
  "subtitle": summary,
  description,
  category,
  heroImage {
    asset-> { url }
  },
  metrics[] {
    label,
    value,
    description
  },
  achievements,
  technologies,
  overview {
    role,
    company,
    timeline,
    problem,
    solution
  },
  sections[] {
    _key,
    sectionLabel,
    heading,
    content,
    screenshots[] {
      image {
        asset-> {
          _ref,
          url
        }
      },
      caption,
      layout
    },
    annotation {
      title,
      content
    }
  }
}`

const ALL_CASE_STUDY_SLUGS_QUERY = `
  *[_type == "project" && category == "case-study"]{ "slug": slug.current }
`

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

// Generate static paths for all case studies (SSG)
export async function generateStaticParams() {
  const caseStudies = await client.fetch<{ slug: string }[]>(
    ALL_CASE_STUDY_SLUGS_QUERY
  )

  return caseStudies.map((cs) => ({
    slug: cs.slug,
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = await client.fetch<CaseStudyData>(PROJECT_QUERY, { slug })

  if (!project) {
    return {
      title: 'Case Study Not Found',
    }
  }

  return {
    title: `${project.title} | Michael Evans`,
    description: project.subtitle || project.description || project.title,
  }
}

// Revalidate every hour (ISR - Incremental Static Regeneration)
export const revalidate = 3600

// Portable Text components (same as before)
const portableTextComponents = {
  marks: {
    strong: ({ children }: any) => (
      <strong style={{ color: 'hsl(280, 100%, 80%)' }}>{children}</strong>
    ),
  },
}

export default async function CaseStudyPage({ params }: PageProps) {
  // Await params directly - no Promise handling needed
  const { slug } = await params

  // Direct data fetching - no useEffect
  const project = await client.fetch<CaseStudyData>(PROJECT_QUERY, { slug })

  // Error handling with Next.js notFound()
  if (!project) {
    notFound()
  }

  // All existing UI rendering code stays exactly the same
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a14] to-[#050510] text-white overflow-x-hidden">
      {/* All existing JSX - no changes needed */}
    </div>
  )
}
```

#### 3. Create `not-found.tsx` for Better Error Handling

Create `/src/app/(public)/case-studies/[slug]/not-found.tsx`:

```typescript
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a14] to-[#050510] text-white">
      <div className="container max-w-[1200px] mx-auto px-8 py-32">
        <Link
          href="/case-studies"
          className="text-gray-400 hover:text-white transition-colors mb-8 inline-block"
        >
          ← Back to Case Studies
        </Link>
        <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-8">
          <h1 className="text-3xl font-semibold mb-4">Case Study Not Found</h1>
          <p className="text-red-400 mb-6">
            The case study you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/case-studies"
            className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-400 text-white font-semibold rounded-lg transition-all duration-300 hover:-translate-y-1"
          >
            Browse All Case Studies
          </Link>
        </div>
      </div>
    </div>
  )
}
```

#### 4. Testing Steps

**Functional Tests:**
- [ ] Navigate to existing case study - loads correctly
- [ ] Check all sections render properly
- [ ] Verify images display
- [ ] Confirm PortableText content renders
- [ ] Test metrics section
- [ ] Test achievements section
- [ ] Test screenshots (grid and large layouts)
- [ ] Verify annotations display
- [ ] Navigate to non-existent slug - shows 404
- [ ] Check "Back to Case Studies" link works
- [ ] No console errors

**Static Generation Tests:**
- [ ] Run `npm run build`
- [ ] Check build output shows pages pre-rendered
- [ ] Look for: `├ ● /case-studies/[slug]` in build output
- [ ] Verify all case study pages listed
- [ ] Check `.next/server/app/(public)/case-studies/` contains HTML files

**Performance Tests:**
- [ ] Navigate to case study - instant load (no spinner)
- [ ] Run Lighthouse audit
- [ ] Verify LCP < 2.5s (should be near instant)
- [ ] Check TTI < 3.8s
- [ ] No layout shift (CLS = 0)

**SEO Tests:**
- [ ] View page source - all content visible
- [ ] Check `<title>` tag includes case study name
- [ ] Verify meta description present
- [ ] Test social media preview cards
- [ ] Check structured data (if applicable)

**ISR (Incremental Static Regeneration) Tests:**
- [ ] Update case study in Sanity
- [ ] Wait 1 hour (or trigger revalidation)
- [ ] Verify changes appear on site
- [ ] Confirm page still loads instantly

#### 5. Expected Improvements

**Before:**
- Client-side fetch after navigation
- ~1-2 second loading delay
- Layout shift from loading → content
- Poor SEO (no content in HTML)
- Slow navigation experience

**After:**
- Pre-rendered at build time (SSG)
- Instant page load (<100ms)
- Zero layout shift
- Perfect SEO (full content in HTML)
- ISR keeps content fresh
- Silky smooth navigation

**Improvement:** 95% faster (instant vs 1-2 seconds)

**Build Output Example:**
```
Route (app)                              Size     First Load JS
┌ ● /case-studies/[slug]                 142 B          87.2 kB
├   ├ /case-studies/karuna-gatton
├   ├ /case-studies/department-of-art
└   └ /case-studies/post-pal
```

**Lighthouse Score Predictions:**
- Performance: 60-70 → 95-100
- SEO: 75-85 → 95-100
- Best Practices: 85-90 → 95-100

#### 6. Rollback Plan

If issues arise:

1. **Quick Rollback:**
   ```bash
   git checkout HEAD -- src/app/\(public\)/case-studies/\[slug\]/page.tsx
   ```

2. **Hybrid Approach (if needed):**
   - Keep Server Component for data fetching
   - Extract any interactive parts to Client Component
   - Similar to `/ai-showcase/[slug]` pattern

3. **Debug Steps:**
   - Verify Sanity query returns data for all slugs
   - Check `generateStaticParams` returns all case studies
   - Confirm build completes without errors
   - Review build output for missing pages
   - Test with `npm run build && npm start`

---

## Implementation Sequence

### Step-by-Step Execution Order

```
1. Convert /about (30 min)
   ├─ Edit page.tsx
   ├─ Test locally
   ├─ Verify fix
   └─ Commit

2. Convert / homepage (1 hour)
   ├─ Edit page.tsx
   ├─ Test locally
   ├─ Run Lighthouse
   ├─ Verify performance
   └─ Commit

3. Convert /case-studies/[slug] (1 hour)
   ├─ Edit page.tsx
   ├─ Create not-found.tsx
   ├─ Test locally
   ├─ Run build
   ├─ Verify SSG works
   ├─ Test ISR
   └─ Commit

Total: ~2.5 hours
```

### Pre-Implementation Setup

Before starting conversions:

```bash
# Ensure dev server is running
npm run dev

# Have Lighthouse ready
# Install if needed: npm install -g @lhci/cli
# Or use Chrome DevTools

# Create a backup branch
git checkout -b backup/pre-server-component-conversion

# Create feature branch
git checkout -b feat/convert-to-server-components
```

### Post-Conversion Verification

After all conversions:

```bash
# Test production build
npm run build
npm start

# Run Lighthouse on all converted pages
# - /about
# - /
# - /case-studies/karuna-gatton (example)

# Check for any build warnings
# Review build output for SSG confirmation

# If all tests pass, merge to main
git checkout main
git merge feat/convert-to-server-components
```

---

## Performance Benchmarks

### Target Metrics

| Metric | Before | After | Goal |
|--------|--------|-------|------|
| **LCP (Largest Contentful Paint)** | 2.5-4s | <1s | <2.5s |
| **FCP (First Contentful Paint)** | 2-3s | <0.5s | <1.8s |
| **TTI (Time to Interactive)** | 3-5s | <1s | <3.8s |
| **CLS (Cumulative Layout Shift)** | 0.1-0.3 | 0 | <0.1 |
| **TBT (Total Blocking Time)** | 200-400ms | <50ms | <200ms |

### Lighthouse Score Targets

| Page | Category | Before | After | Target |
|------|----------|--------|-------|--------|
| `/about` | Performance | N/A (broken) | 95+ | 90+ |
| `/about` | SEO | N/A (broken) | 95+ | 90+ |
| `/` | Performance | 50-60 | 90+ | 90+ |
| `/` | SEO | 70-80 | 95+ | 90+ |
| `/case-studies/[slug]` | Performance | 60-70 | 95+ | 90+ |
| `/case-studies/[slug]` | SEO | 75-85 | 95+ | 90+ |

---

## Risk Assessment & Mitigation

### Potential Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Component incompatibility | Low | Medium | Test incrementally; use hybrid pattern if needed |
| Build failures | Low | High | Thorough testing before merge; maintain rollback branch |
| SEO metadata missing | Low | High | Add generateMetadata to all pages |
| ISR not working | Medium | Low | Test revalidation; document webhook setup |
| Styling differences | Low | Low | Visual regression testing |
| Third-party package issues | Low | Medium | Verify all packages are server-compatible |

### Mitigation Strategies

1. **Incremental Conversion:**
   - Convert one page at a time
   - Test thoroughly before moving to next
   - Commit after each successful conversion

2. **Testing Protocol:**
   - Local testing first
   - Production build testing
   - Lighthouse audits
   - Visual regression checks

3. **Rollback Readiness:**
   - Keep backup branch
   - Document rollback steps
   - Test rollback procedure

4. **Monitoring:**
   - Watch for console errors
   - Monitor build output
   - Check Vercel deployment logs
   - Review analytics for user impact

---

## Dependencies & Prerequisites

### Required Knowledge
- Next.js 15 App Router patterns
- Async/await syntax
- Sanity GROQ queries
- React Server Components vs Client Components

### Required Tools
- Node.js 18+
- npm/yarn
- Chrome DevTools (for Lighthouse)
- Git

### Environment Setup
```bash
# Verify Next.js version
npm list next
# Should show: next@15.5.6

# Verify dev server works
npm run dev

# Verify build works
npm run build
```

---

## Success Criteria

### Functional Requirements
✅ All pages load without errors
✅ All content displays correctly
✅ Navigation works as expected
✅ Images render properly
✅ No console errors or warnings

### Performance Requirements
✅ Homepage LCP < 1s
✅ About page loads (not broken)
✅ Case study pages instant load
✅ Lighthouse Performance score > 90
✅ Zero cumulative layout shift

### SEO Requirements
✅ Content visible in page source
✅ Meta tags properly set
✅ Lighthouse SEO score > 90
✅ Social preview cards work

### Developer Experience
✅ Simpler, cleaner code
✅ Fewer lines of code
✅ No loading state complexity
✅ Type-safe with TypeScript

---

## Code Review Checklist

Before submitting PR:

### Code Quality
- [ ] No `'use client'` directives on converted pages
- [ ] No `useState`, `useEffect`, or other React hooks in Server Components
- [ ] Proper TypeScript types on all functions
- [ ] GROQ queries extracted as named constants
- [ ] Error handling with `notFound()` implemented
- [ ] All imports necessary and used

### Next.js Best Practices
- [ ] `generateStaticParams` added for dynamic routes
- [ ] `generateMetadata` added for SEO
- [ ] ISR `revalidate` configured appropriately
- [ ] Parallel data fetching with `Promise.all()` where applicable
- [ ] No unnecessary re-renders

### Testing
- [ ] All functional tests pass
- [ ] Performance metrics meet targets
- [ ] SEO tests pass
- [ ] Visual regression checks complete
- [ ] Build completes without errors

### Documentation
- [ ] Code comments where necessary
- [ ] README updated if needed
- [ ] This implementation plan followed

---

## Maintenance & Monitoring

### Post-Deployment

1. **Monitor Vercel Analytics:**
   - Check LCP, FCP, CLS metrics
   - Compare before/after conversion
   - Watch for any regressions

2. **Review Build Logs:**
   - Verify SSG pages generated
   - Check for any build warnings
   - Monitor build time

3. **User Feedback:**
   - Monitor for bug reports
   - Check analytics for bounce rate changes
   - Review session duration metrics

### Future Optimizations

Once conversions are stable:

1. **Consider converting AI project pages:**
   - `/ai-projects/*` - Currently use `useAIProject` hook
   - Could use hybrid Server + Client pattern
   - Lower priority (less traffic)

2. **Implement On-Demand ISR:**
   - Set up Sanity webhooks
   - Trigger revalidation on content updates
   - Instant updates without waiting for revalidate timer

3. **Add Loading UI:**
   - Create `loading.tsx` for each route
   - Provide better suspense fallbacks
   - Improve perceived performance

---

## Reference Code Patterns

### Server Component with Parallel Fetches

```typescript
export default async function Page() {
  // Fetch multiple queries in parallel
  const [data1, data2, data3] = await Promise.all([
    client.fetch(query1),
    client.fetch(query2),
    client.fetch(query3)
  ])

  return <Component data={{ data1, data2, data3 }} />
}
```

### Dynamic Route with SSG

```typescript
// Generate all static paths
export async function generateStaticParams() {
  const items = await client.fetch<{ slug: string }[]>(
    `*[_type == "item"]{ "slug": slug.current }`
  )
  return items.map((item) => ({ slug: item.slug }))
}

// Generate SEO metadata
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const item = await client.fetch(query, { slug })

  return {
    title: `${item.title} | Site Name`,
    description: item.description
  }
}

// ISR - revalidate every hour
export const revalidate = 3600

// Page component
export default async function Page({ params }: PageProps) {
  const { slug } = await params
  const data = await client.fetch(query, { slug })

  if (!data) notFound()

  return <Component data={data} />
}
```

### Hybrid Server + Client Pattern

```typescript
// page.tsx - Server Component
import { ClientComponent } from './ClientComponent'

export default async function Page() {
  const data = await fetchData()
  return <ClientComponent data={data} />
}

// ClientComponent.tsx - Client Component
'use client'
export function ClientComponent({ data }: Props) {
  const [state, setState] = useState()
  // Interactive features only
  return <div>{/* UI with state */}</div>
}
```

---

## Appendix: Common Pitfalls

### Pitfall 1: Client-Only Package in Server Component
**Problem:** Importing a package that uses browser APIs
**Solution:** Use dynamic import with `ssr: false` or move to Client Component

### Pitfall 2: Forget to Await Params
**Problem:** Accessing `params.slug` directly
**Solution:** Always `await params` first: `const { slug } = await params`

### Pitfall 3: Missing Error Handling
**Problem:** Not handling null data from Sanity
**Solution:** Always check and call `notFound()` if data missing

### Pitfall 4: Forgetting generateStaticParams
**Problem:** Dynamic routes not pre-rendered
**Solution:** Add `generateStaticParams` to all `[slug]` routes

### Pitfall 5: Client Component Imports in Server
**Problem:** Importing a component marked with `'use client'`
**Solution:** Server Components can import Client Components (data flows down)

---

## Conclusion

This conversion plan provides a systematic approach to transforming three critical pages from Client Components to Server Components, resulting in:

- **Fixed functionality** (broken `/about` page)
- **Improved performance** (80-95% faster load times)
- **Better SEO** (content in initial HTML)
- **Simpler codebase** (less complexity, fewer bugs)
- **Better user experience** (instant navigation, no loading spinners)

**Total estimated time:** 2.5 hours
**Total estimated impact:** Major improvement across all metrics

The conversions follow Next.js 15 best practices and leverage the App Router's powerful Server Component capabilities for optimal performance and developer experience.

---

**Author:** Claude Code
**Date:** October 31, 2025
**Next.js Version:** 15.5.6
**Status:** Ready for implementation
