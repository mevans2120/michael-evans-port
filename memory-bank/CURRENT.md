# Design System Audit & Typography Fixes (2026-01-05)

## Context
Audited the Services page against site-wide design conventions and fixed typography issues. Also consolidated redundant global styles between globals.css and layout.tsx.

## Issues Found & Fixed

### 1. Services Page Typography Reversed
**Problem:** Services page had fonts backwards compared to site-wide convention.

**Site-wide convention:**
- Headings: `font-sans` (DM Sans)
- Body copy: `font-serif` (Crimson Pro) - must be explicit

**Services page before:**
- Headings: `font-serif` (wrong)
- Body copy: no font class, inherited `font-sans` (wrong)

**Files Fixed:**
- `src/components/services/ServicesHero.tsx`
  - h1: `font-serif` → `font-sans`
  - subtitle: added `font-serif`
- `src/components/services/ServiceEntry.tsx`
  - h3: `font-serif` → `font-sans`
  - body paragraphs: added `font-serif`

### 2. Globals/Layout Redundancy
**Problem:** Body styles defined in both globals.css and layout.tsx. Also, globals.css had wrong `h1-h6 { font-serif }` rule.

**Changes to layout.tsx:**
```tsx
// html element - added bg-background
className={`${dmSans.variable} ${newsreader.variable} bg-background`}

// body element - consolidated all styles
className="font-sans font-light bg-background text-foreground overflow-hidden"
```

**Changes to globals.css:**
```css
/* Removed from html rule */
@apply bg-background;

/* Deleted entirely - was redundant */
body {
  @apply font-sans bg-background text-foreground;
  font-weight: 300;
}

/* Deleted entirely - was WRONG (opposite of site convention) */
h1, h2, h3, h4, h5, h6 {
  @apply font-serif;
}
```

## Documentation Created
- `docs/services-page-design-system-audit-2026-01-05.md` - Typography audit
- `docs/globals-layout-consolidation-audit-2026-01-05.md` - Consolidation plan
- `docs/plans/PLAN_2026-01-05_globals-layout-consolidation.md` - Implementation plan

## Documentation Updated
- `docs/design/services-page-concepts-121925/services-hifi-iteration-plan.md` - Fixed typography spec
- `docs/design/services-page-concepts-121925/services-implementation-plan.md` - Fixed typography in code examples

## Key Insight
The `body { font-sans }` in globals.css was a fallback, not a style source. Body copy must explicitly use `font-serif` - relying on inheritance doesn't work because the body element defaults to sans.

---

# Services Page Implementation - Phases 1-4 Complete (2026-01-05)

## Context
Implemented the Services page using Concept 3b (Refined Conversational) - a conversational format with optional lead-in quotes/testimonials for each service.

## What Was Implemented

### Phase 1: Sanity Schema
**File**: `/sanity/schemas/servicesPage.ts` (new)
- Singleton document type for Services page
- Fields: heroTitle, heroSubtitle, serviceEntries array, interludeText, seo
- Each serviceEntry: optional leadInText, optional leadInAttribution, serviceTitle, answerParagraphs
- Registered in `/sanity/schemas/index.ts`

### Phase 2: Data Layer
**File**: `/src/lib/sanity/queries.ts`
- Added `servicesPageQuery` - singleton fetch pattern

**File**: `/src/lib/sanity/types.ts`
- Added `ServiceEntry` and `ServicesPageData` interfaces

### Phase 3: React Components
**Directory**: `/src/components/services/` (new)
- `ServiceEntry.tsx` - Optional right-aligned lead-in quote + left-aligned service card
- `ServicesHero.tsx` - Hero section with fade-in animation
- `ServicesInterlude.tsx` - Gradient line + italic quote section

### Phase 4: Page Route
**File**: `/src/app/(public)/services/page.tsx` (new)
- Server component with `cachedSanityFetch`
- SEO metadata via `generateSanityMetadata`
- Breadcrumb structured data
- Atmospheric blur orbs (matches About page)
- Fallback content if CMS is empty

### Cache Invalidation
**File**: `/src/app/api/webhooks/sanity/route.ts`
- Added `servicesPage` case to revalidate `/services` path and `services` tag
- Updated GET handler documentation

## Design Decisions
- **Optional lead-in**: Services can have quotes/testimonials or display standalone
- **Soft launch**: Page accessible at `/services` but not linked from navigation yet
- **Design system compliance**: Uses `text-accent`, `bg-card`, `animate-in fade-in duration-700`

## Files Created
```
/sanity/schemas/servicesPage.ts
/src/components/services/ServiceEntry.tsx
/src/components/services/ServicesHero.tsx
/src/components/services/ServicesInterlude.tsx
/src/app/(public)/services/page.tsx
```

## Files Modified
```
/sanity/schemas/index.ts - Registered servicesPage schema
/src/lib/sanity/queries.ts - Added servicesPageQuery
/src/lib/sanity/types.ts - Added ServiceEntry, ServicesPageData types
/src/app/api/webhooks/sanity/route.ts - Added cache invalidation
```

## Remaining (Phase 5+)
- [ ] Test responsive behavior (mobile/tablet/desktop)
- [ ] Verify SEO metadata renders correctly
- [ ] Finalize content in Sanity
- [ ] When ready: Add "Services" to navigation

---

# Services Page Implementation Plan Updates (2026-01-05)

## Context
Updated the Services page implementation plan based on design review feedback. Two key changes: flexible lead-in format and soft launch strategy.

## Changes Made

### 1. Flexible Lead-in Format
**Changed from:** Required Q&A format with questions for every service
**Changed to:** Optional lead-in text (quotes, testimonials, or nothing)

**Rationale:** More flexibility to use client quotes when available, or show services standalone when not.

**Schema changes:**
- `dialogueExchanges` → `serviceEntries`
- `question` (required) → `leadInText` (optional)
- `questionLabel` → `leadInAttribution` (for quote attribution, e.g., "— VP Product, Fintech")

**Component changes:**
- `DialogueExchange.tsx` → `ServiceEntry.tsx`
- Lead-in conditionally renders only when `leadInText` is provided
- Service cards go full-width when no lead-in, staggered when there is one

### 2. Soft Launch Strategy (No Feature Flag)
**Decision:** Page will be accessible at `/services` but not linked from navigation until ready.

**Rationale:** Low traffic site, unlikely someone guesses `/services` URL. No code changes needed to launch — just add nav link when content is ready.

**Launch phases:**
1. **Development** - Build page at `/services` (unlisted)
2. **Content** - Populate Sanity, internal review via direct link
3. **Launch** - Add "Services" to navigation when ready

## Updated Implementation Plan
**File**: `docs/design/services-page-concepts-121925/services-implementation-plan.md`

### Files to Create (Updated)
```
/sanity/schemas/servicesPage.ts
/src/components/services/ServiceEntry.tsx      # Was DialogueExchange.tsx
/src/components/services/ServicesHero.tsx
/src/components/services/ServicesInterlude.tsx
/src/app/(public)/services/page.tsx
```

### New TypeScript Types
```typescript
interface ServiceEntry {
  _key: string
  leadInText?: string        // Optional quote/testimonial
  leadInAttribution?: string // Optional attribution
  serviceTitle: string
  answerParagraphs: string[]
}
```

---

# Services Page Implementation Plan (2025-12-30)

## Context
Created comprehensive implementation plan for the Services page using Concept 3b (Refined Conversational) - a Q&A dialogue format where visitor questions are paired with service-focused answers.

## Design Concept Selected
**Concept 3b: Refined Conversational**
- Services presented as Q&A dialogue mimicking a discovery conversation
- Questions appear as visitor thoughts; answers reveal services naturally
- Flat cards with accent left-border (no rounded corners, no elevation)
- Atmospheric blur orbs (matches About page)
- No CTA section (footer handles navigation)

## Implementation Plan Created
**File**: `docs/design/services-page-concepts-121925/services-implementation-plan.md`

### 7 Phases Outlined

1. **Sanity Schema** (`/sanity/schemas/servicesPage.ts`)
   - Singleton document type
   - Fields: heroTitle, heroSubtitle, dialogueExchanges array, interludeText, seo
   - Each exchange: question, questionLabel, serviceTitle, answerParagraphs

2. **GROQ Query** (add to `/src/lib/sanity/queries.ts`)
   - `servicesPageQuery` - singleton fetch pattern

3. **TypeScript Types**
   - `DialogueExchange` and `ServicesPageData` interfaces

4. **React Components**
   - `DialogueExchange.tsx` - Single Q&A pair
   - `ServicesHero.tsx` - Hero section
   - `ServicesInterlude.tsx` - Quote section

5. **Page Route** (`/src/app/(public)/services/page.tsx`)
   - Server component with `cachedSanityFetch`
   - Fallback content for empty CMS
   - Structured data (breadcrumbs)

6. **Navigation Integration** (optional)

7. **Cache Invalidation** - webhook tag setup

### Design System Compliance

All styles map to existing tokens:
- Loading animation: `animate-in fade-in duration-700` (matches Homepage)
- Staggered delays: 0s, 0.1s, 0.2s for sections
- Blur orbs: `bg-accent/15 blur-[100px]` (matches About page)
- Colors: `text-accent`, `bg-card`, `text-muted-foreground`
- Card styling: `border-l-[3px] border-accent` with `transition-colors-smooth`

### Files to Create
```
/sanity/schemas/servicesPage.ts
/src/components/services/DialogueExchange.tsx
/src/components/services/ServicesHero.tsx
/src/components/services/ServicesInterlude.tsx
/src/app/(public)/services/page.tsx
```

## Related Documentation
- `docs/design/services-page-concepts-121925/services-overview.md` - Concept comparison
- `docs/design/services-page-concepts-121925/services-hifi-iteration-plan.md` - Design decisions
- `docs/design/services-page-concepts-121925/services-concept-3b-refined.html` - Visual prototype

---

# Related Posts ASCII Art Support (2025-12-16)

## Context
Added ASCII art rendering to the Related Posts ("More thoughts on software") section on blog post pages. Previously, blog posts without featured images showed a generic document icon.

## Problem
- Related Posts component used `LinkPreview` which fetched metadata from `/api/link-metadata`
- API didn't include ASCII art data for blog posts
- Posts without featured images showed generic `FileText` icon instead of ASCII art

## Solution Implemented

### 1. Updated Link Metadata API
**File**: `src/app/api/link-metadata/route.ts`

Added `asciiArt` and `asciiArtLabel` fields to blog query and response:
```typescript
// Updated interface
export interface LinkMetadata {
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  asciiArt?: string;      // Blog posts only
  asciiArtLabel?: string; // Blog posts only
}

// Updated GROQ query for blogs
const query = `*[_type == "blog" && slug.current == $slug][0] {
  ...
  asciiArt,
  asciiArtLabel
}`;

// Response includes ASCII art for blog posts only
const metadata: LinkMetadata = {
  ...
  ...(type === 'blog' && 'asciiArt' in data && {
    asciiArt: data.asciiArt || undefined,
    asciiArtLabel: data.asciiArtLabel || undefined,
  }),
};
```

### 2. Updated LinkPreview Component
**File**: `src/components/chatbot/LinkPreview.tsx`

- Imported `AsciiArt` and `hasAsciiArt` from blog components
- Updated `LinkMetadata` interface with ASCII art fields
- Added ASCII art rendering with priority: ASCII Art → Featured Image → Generic Icon
- Font size: `text-[0.21rem] md:text-[0.24rem]` (sized to fit thumbnail area)

```tsx
{hasAsciiArt(metadata.asciiArt) ? (
  <div className="w-full md:w-32 h-48 md:h-32 rounded-lg flex-shrink-0 bg-card/50 border border-border/50 flex items-center justify-center overflow-hidden">
    <AsciiArt
      art={metadata.asciiArt}
      label={metadata.asciiArtLabel}
      className="text-[0.21rem] md:text-[0.24rem]"
    />
  </div>
) : hasImage ? (
  // Featured image...
) : (
  // Generic icon fallback...
)}
```

## Display Priority
1. **ASCII Art** (if `asciiArt` field has content)
2. **Featured Image** (if image asset exists)
3. **Generic Icon** (FileText fallback)

## Scope
- **Blog posts only** - Case studies and chatbot links unchanged
- Reuses existing `AsciiArt` component
- No changes to RelatedPosts or RelatedPostsClient components

## Files Modified
- `src/app/api/link-metadata/route.ts` - Added ASCII art to blog query and response
- `src/components/chatbot/LinkPreview.tsx` - Added ASCII art rendering

## Documentation Created
- `docs/related-posts-ascii-art-plan.md` - Implementation plan

---

# ASCII Art Rendering Fixes (2025-12-15)

## Context
Fixed ASCII art formatting issues where characters were misaligned on the frontend, and removed unnecessary responsive sizing.

## Problems Identified
1. **Sanity CMS text input uses proportional font** - When users paste ASCII art, they can't see proper character alignment
2. **Frontend font-mono class not explicitly defined** - Tailwind was using defaults that may not apply correctly
3. **Responsive font sizing unnecessary** - Art was shrinking on mobile when it should stay consistent

## Solutions Implemented

### 1. Custom Sanity Input Component
**File**: `src/sanity/components/AsciiArtInput.tsx` (NEW)

Created custom textarea input with monospace font for Sanity Studio:
```typescript
export function AsciiArtInput(props: AsciiArtInputProps) {
  return (
    <TextArea
      style={{
        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", "Courier New", monospace',
        fontSize: '12px',
        lineHeight: '1.2',
        whiteSpace: 'pre',
      }}
    />
  );
}
```

### 2. Updated Blog Schema
**File**: `sanity/schemas/blog.ts`

Added custom component to asciiArt field:
```typescript
defineField({
  name: 'asciiArt',
  type: 'text',
  components: {
    input: AsciiArtInput as any, // Type assertion needed for Sanity v4
  },
})
```

### 3. Explicit Mono Font in Tailwind
**File**: `tailwind.config.ts`

Added explicit `mono` fontFamily to ensure `font-mono` class works:
```typescript
fontFamily: {
  sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
  serif: ['var(--font-serif)', 'Georgia', 'serif'],
  mono: ['ui-monospace', 'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
},
```

### 4. Removed Responsive Font Sizing
**Files**: Multiple components

Changed from responsive sizing to single consistent size:
- `AsciiArt.tsx`: `text-[0.6rem]` (was `text-[0.4rem] sm:text-[0.5rem] md:text-[0.6rem]`)
- `BlogPostCard.tsx`: Removed className override entirely
- `BlogHero.tsx`: Removed className override entirely
- `HomepageFeaturedBlogImage.tsx`: Removed className override entirely

## Files Created
- `src/sanity/components/AsciiArtInput.tsx` - Custom Sanity input

## Files Modified
- `sanity/schemas/blog.ts` - Added custom input component
- `tailwind.config.ts` - Added explicit mono font family
- `src/components/blog/AsciiArt.tsx` - Simplified to single font size
- `src/components/blog/BlogPostCard.tsx` - Removed className override
- `src/components/blog/BlogHero.tsx` - Removed className override
- `src/components/HomepageFeaturedBlogImage.tsx` - Removed className override

## Documentation Created
- `docs/ascii-art-formatting-issue-research-2025-12-15.md` - Initial research
- `docs/ascii-art-tailwind-refactor-plan-2025-12-15.md` - Refactor plan

## Key Insight
The root cause was that Sanity's default text input uses a proportional font, so ASCII art that looked aligned in the editor actually had inconsistent spacing. The custom monospace input allows content editors to see true character alignment.

---

# ASCII Art CMS Text Field Migration (2025-12-12)

## Context
Migrated ASCII art storage from a hardcoded TypeScript registry to a CMS-managed text field in Sanity. Enables content editors to paste ASCII art directly into blog posts without code changes.

## Problem
- ASCII art was hardcoded in a TypeScript registry (`AsciiArt.tsx`)
- Adding new art required updating 3 files (registry, schema, types)
- No way to manage art through CMS

## Solution Implemented

### Phase 1: Sanity Schema Update
**File**: `sanity/schemas/blog.ts`

Changed from radio button selector to multiline text field with validation:
```typescript
defineField({
  name: 'asciiArt',
  title: 'ASCII Art (Alternative to Image)',
  type: 'text',
  rows: 20,
  validation: (Rule) => Rule.custom((value) => {
    if (!value) return true;
    const lines = value.split('\n');
    if (lines.length > 50) return `Too tall: ${lines.length} lines (max 50)`;
    const longestLine = Math.max(...lines.map(l => l.length));
    if (longestLine > 80) return `Line too wide: ${longestLine} chars (max 80)`;
    if (value.includes('\t')) return 'Contains tabs. Please convert to spaces.';
    return true;
  }),
}),

defineField({
  name: 'asciiArtLabel',
  title: 'ASCII Art Description',
  type: 'string',
  description: 'Accessibility label for screen readers',
  hidden: ({ parent }) => !parent?.asciiArt,
}),
```

### Phase 2: TypeScript Types
**File**: `src/types/blog.ts`

```typescript
// Before
asciiArt?: 'none' | 'filing-cabinet';

// After
asciiArt?: string | null;
asciiArtLabel?: string;
```

### Phase 3: Simplified AsciiArt Component
**File**: `src/components/blog/AsciiArt.tsx`

Removed registry pattern, now accepts raw art string:
```typescript
interface AsciiArtProps {
  art: string;
  label?: string;
  className?: string;
}

export function AsciiArt({ art, label, className }: AsciiArtProps) {
  if (!art) return null;
  return (
    <pre className={cn('text-accent font-mono...', className)}
         aria-label={label || 'ASCII art illustration'}
         role="img">
      {art}
    </pre>
  );
}

export function hasAsciiArt(art: string | null | undefined): art is string {
  return !!art && art.trim().length > 0;
}
```

### Phase 4: Updated Consuming Components
- `BlogHero.tsx` - Changed props from `asciiArtType` to `asciiArt`/`asciiArtLabel`
- `BlogPostCard.tsx` - Updated to use `hasAsciiArt()` and new props
- `HomepageFeaturedBlogImage.tsx` - Updated to use new props
- `blog/[slug]/page.tsx` - Pass new props to BlogHero
- `page.tsx` (homepage) - Pass asciiArtLabel to HomepageFeaturedBlogImage
- `blog/index.ts` - Updated exports (`hasAsciiArt` instead of `isValidAsciiArtType`)

### Phase 5: GROQ Queries
**File**: `src/lib/sanity/queries/blog.ts`

Added `asciiArtLabel` to all queries that fetch `asciiArt`:
- `allBlogPostsQuery`
- `blogPostBySlugQuery`
- `featuredBlogQuery`

## Additional Fixes

### Removed BlogHero Hover State
**File**: `src/components/blog/BlogHero.tsx`

Removed `hover:text-accent-light` from h1 title since it's not a link on individual post pages.

### Font Preloading Disabled
**File**: `src/app/layout.tsx`

Changed Newsreader font from `preload: true` to `preload: false` - preloading hurt mobile Lighthouse scores.

## Files Modified
- `sanity/schemas/blog.ts` - New text field with validation
- `src/types/blog.ts` - Updated interfaces
- `src/components/blog/AsciiArt.tsx` - Simplified component
- `src/components/blog/BlogHero.tsx` - New props + removed hover
- `src/components/blog/BlogPostCard.tsx` - New props
- `src/components/blog/index.ts` - Updated exports
- `src/components/HomepageFeaturedBlogImage.tsx` - New props
- `src/app/(public)/blog/[slug]/page.tsx` - Pass new props
- `src/app/(public)/page.tsx` - Pass asciiArtLabel, updated FeaturedBlogPost type
- `src/lib/sanity/queries/blog.ts` - Added asciiArtLabel to queries
- `src/app/layout.tsx` - Disabled Newsreader font preloading

## Documentation Created
- `docs/ascii-art-blog-feature-research-2025-12-12.md` - Research findings
- `docs/plans/PLAN_2025-12-12_ascii-art-cms-text-field.md` - Implementation plan

## Cache Note
Next.js caches Sanity data indefinitely (`revalidate: false`). After updating content in Sanity, may need to delete `.next` folder and restart dev server to see changes locally.

---

# Mobile Header Logo Alignment Fix (2025-12-09)

## Context
Fixed alignment inconsistencies between the MobileHeader and ChatSection mobile header on mobile devices. When the chat expanded, the "MEvans" logo and close button appeared at different positions than the hamburger menu header.

## Problem Analysis
- **Horizontal (X) Misalignment**: MobileHeader used `px-6` (24px) while ChatSection used `px-8` (32px) - 8px difference
- **Typography Size Mismatch**: MobileHeader used `text-xl` (20px) while ChatSection used `text-lg` (18px)
- **Height Mismatch**: MobileHeader used `h-16` (64px fixed) while ChatSection used `py-6` (variable padding)
- **Button Padding Mismatch**: Hamburger had `p-2` while close button had `p-1.5`

## Solution Implemented

### ChatSection.tsx Mobile Header Updates
**File**: `src/components/navigation/ChatSection.tsx` (line 268)

```tsx
// Before:
<div className="px-8 py-6 border-b border-chat-border flex items-center justify-between flex-shrink-0">
  <h2 className="text-lg font-medium text-chat-foreground font-serif">
    M<span className="text-gradient">Evans</span> AI Assistant
  </h2>
  <button className="p-1.5 rounded-lg transition-all text-chat-foreground hover:bg-chat-suggestion/30">
    <X className="w-5 h-5" />
  </button>
</div>

// After:
<div className="px-6 h-16 border-b border-chat-border flex items-center justify-between flex-shrink-0">
  <h2 className="text-xl font-medium text-chat-foreground font-serif">
    M<span className="text-gradient">Evans</span> AI Assistant
  </h2>
  <button className="p-2 rounded-lg transition-all text-chat-foreground hover:bg-chat-suggestion/30">
    <X className="w-5 h-5" />
  </button>
</div>
```

### Changes Summary
| Property | Before | After | Reference (MobileHeader) |
|----------|--------|-------|-------------------------|
| Padding | `px-8` (32px) | `px-6` (24px) | `px-6` |
| Height | `py-6` (variable) | `h-16` (64px) | `h-16` |
| Typography | `text-lg` (18px) | `text-xl` (20px) | `text-xl` |
| Button padding | `p-1.5` | `p-2` | `p-2` |
| Icon size | `w-5 h-5` | `w-5 h-5` | `w-6 h-6` (hamburger is larger) |

## Result
- Logo text now starts at same X position in both headers
- Headers have matching 64px height
- Typography is consistent between states
- Minor Y offset on close button remains (acceptable per user)

## Files Modified
- `src/components/navigation/ChatSection.tsx` - Multiple styling updates

## Files Created
- `docs/research/RESEARCH_2025-12-09_mobile-header-logo-alignment.md` - Research document

---

# Mobile Header Scroll Stutter Fix (2025-12-09)

## Context
Fixed mobile scroll stutter caused by JS/CSS animation competition. The scroll-to-hide header was causing jank because JavaScript state updates were triggering CSS transitions that couldn't complete before the next scroll frame.

## Problem Analysis
- **Root Cause**: `useScrollDirection` hook updated React state on every scroll frame
- **Effect**: CSS transitions (`transition-transform duration-normal`) were constantly interrupted
- **Result**: Janky, stuttering scroll experience on mobile

```
Scroll Event → JS State Update → React Re-render → CSS Class Change → CSS Transition
     ↑                                                                      ↓
     └──────────────────── Next scroll frame interrupts ←─────────────────┘
```

## Solution: Remove Scroll-to-Hide Behavior

Removed the JS-driven hide-on-scroll header entirely. Mobile header is now always visible (fixed at top).

### Changes Made

**1. Simplified MobileHeader.tsx**
- Removed `useScrollDirection` hook
- Removed `useMobileHeader` context usage
- Removed `shouldHide` logic and CSS transitions
- Header is now always visible with `position: fixed`

**2. Simplified LayoutContent.tsx**
- Removed dynamic padding logic
- Always applies `pt-16` padding on mobile
- No context dependency needed

**3. Removed Unused Files**
- `src/contexts/MobileHeaderContext.tsx` - deleted
- `src/hooks/useScrollDirection.ts` - deleted

**4. Updated layout.tsx**
- Removed `MobileHeaderProvider` wrapper

## Build Warning Fixes
Also fixed ESLint warnings:
- `AboutHero.tsx` - prefixed unused `heroSubheadline`, `heroIntro` with `_`
- `use-toast.ts` - prefixed unused `actionTypes` with `_`

## Result
- **No JS during scroll** - scroll listener removed entirely
- **No CSS transitions** - no transforms to animate
- **Consistent 60fps** - browser handles scroll natively
- **~150 lines removed** - cleaner codebase

## Files Modified
- `src/components/navigation/MobileHeader.tsx` - simplified
- `src/app/(public)/LayoutContent.tsx` - simplified
- `src/app/(public)/layout.tsx` - removed provider

## Files Deleted
- `src/contexts/MobileHeaderContext.tsx`
- `src/hooks/useScrollDirection.ts`

## Documentation
- Research: `docs/research/RESEARCH_2025-12-09_mobile-hero-animation-stutter.md`
- Plan: `docs/plans/PLAN_2025-12-09_mobile-header-sticky-refactor.md`

---

# Related Posts Component Implementation (2025-12-03)

## Context
Implemented a Related Posts section for blog detail pages, modeled after the existing ViewMoreProjects pattern on case study pages.

## Implementation Summary

### Phase 1: Sanity Schema
**File**: `sanity/schemas/relatedPostsSettings.ts`
- Created singleton document type for CMS configuration
- Fields: enabled, heading, subheading, numberOfPosts, layoutStyle, selectionStrategy, curatedPosts, excludeFromRandom, priorityBoost, ctaButton, animation
- Mirrors viewMoreProjectsSettings structure

### Phase 2: GROQ Queries & Selection Logic
**Files**:
- `src/lib/sanity/queries/relatedPosts.ts` - GROQ queries for settings and posts
- `src/lib/blog-selection.ts` - Selection algorithms (recent, random, related, featured, curated)
- Uses seeded random for consistent "random" results per slug

### Phase 3: Components
**Files**:
- `src/components/related-posts/RelatedPosts.tsx` - Server component fetching data
- `src/components/related-posts/RelatedPostsClient.tsx` - Client component rendering UI
- `src/components/related-posts/index.ts` - Exports

### Phase 4: Integration
**File**: `src/app/(public)/blog/[slug]/page.tsx`
- Added `<RelatedPosts currentSlug={slug} />` after BlogContent

### LinkPreview Simplification
**File**: `src/components/chatbot/LinkPreview.tsx`
- Removed category badge (was showing "POST" or real categories like "MARKETING SITES SHOWCASE")
- Cards now show only image, title, and description (description hidden on mobile)

## Files Created
- `sanity/schemas/relatedPostsSettings.ts`
- `src/lib/sanity/queries/relatedPosts.ts`
- `src/lib/blog-selection.ts`
- `src/components/related-posts/RelatedPosts.tsx`
- `src/components/related-posts/RelatedPostsClient.tsx`
- `src/components/related-posts/index.ts`

## Files Modified
- `sanity/schemas/index.ts` - Added relatedPostsSettings schema
- `src/sanity/structure.ts` - Added to Studio sidebar as singleton
- `src/app/(public)/blog/[slug]/page.tsx` - Integration
- `src/components/chatbot/LinkPreview.tsx` - Removed category badge

## Documentation
- Research: `docs/research/RESEARCH_2025-12-03_related-posts-component.md`
- Plan: `docs/plans/PLAN_2025-12-03_related-posts-component.md`

---

# Security Patch: CVE-2025-55182 (2025-12-03)

## Context
Critical RCE vulnerability discovered in React Server Components affecting our Next.js 15.5.6 and React 19.1.0 installation.

## Vulnerability Details
- **CVE**: CVE-2025-55182 (React) + CVE-2025-66478 (Next.js)
- **Severity**: CVSS 10.0 (Critical)
- **Type**: Remote Code Execution via malformed RSC payloads
- **Exploitability**: Near 100% reliability, unauthenticated, default configs vulnerable

## Versions Updated
| Package | Before | After |
|---------|--------|-------|
| next | 15.5.6 | 15.5.7 |
| react | 19.1.0 | 19.1.2 |
| react-dom | 19.1.0 | 19.1.2 |

## Mitigation Notes
- Vercel platform-level protections were already blocking malicious patterns
- Upgrade still recommended for defense in depth + local dev protection

## Files Modified
- `package.json` - Updated dependencies
- `package-lock.json` - Lockfile updated

## Documentation
- Research: `docs/research/RESEARCH_2025-12-03_cve-2025-55182-nextjs-vulnerability.md`

---

# Blog Fixes & SEO OG Image Priority (2025-12-03)

## Context
Session focused on fixing blog floating images, ExamplePrompt styling, and SEO ogImage priority in metadata generation.

## Changes Made

### 1. Floating Images Not Showing
**File**: `src/lib/sanity/queries/blog.ts`

GROQ query wasn't fetching `style`, `alt`, `caption` for images:
```groq
content[] {
  ...,
  _type == "image" => {
    ...,
    asset->{ _id, url },
    crop,
    hotspot,
    alt,      // Added
    caption,  // Added
    style     // Added - crucial for float styles
  }
},
```

### 2. ExamplePrompt Accent Color
**File**: `src/components/blog/ExamplePrompt.tsx`

Changed border and label to use accent color:
```tsx
// Before
<figure className="my-8 border-l-2 border-muted-foreground/30 pl-5">
  <figcaption className="text-[11px] font-medium text-muted-foreground ...">

// After
<figure className="my-8 border-l-2 border-accent pl-5">
  <figcaption className="text-[11px] font-medium text-accent ...">
```

### 3. SEO OG Image Priority Fix
**File**: `src/lib/sanity/metadata.ts`

Added `seo.ogImage` as first priority in social image fallback chain:
```typescript
// Priority order now:
// 1. seo.ogImage (explicit SEO override)
// 2. featuredImage (document featured image)
// 3. globalSettings.defaultOgImage (site default)
// 4. hardcoded fallback

if (seo?.ogImage?.asset) {
  socialImageUrl = urlFor(seo.ogImage).width(1200).height(630).url()
} else if (featuredImage?.asset) {
  socialImageUrl = urlFor(featuredImage).width(1200).height(630).url()
} else if (globalSettings.defaultOgImage?.asset) {
  socialImageUrl = urlFor(globalSettings.defaultOgImage).width(1200).height(630).url()
}
```

Also updated alt text fallback to include `seo?.ogImage?.alt`.

### 4. TimeThemeProvider Revert
**File**: `src/components/providers/TimeThemeProvider.tsx`

Reverted to restore SunCalc and 5-minute interval updates for sunset theme transitioning.

## Files Modified
- `src/lib/sanity/queries/blog.ts` - Added style, alt, caption to image query
- `src/components/blog/ExamplePrompt.tsx` - Accent color styling
- `src/lib/sanity/metadata.ts` - SEO ogImage priority
- `src/components/providers/TimeThemeProvider.tsx` - Reverted to restore sunset transitions

## Documentation
- Plan: `docs/plans/PLAN_2025-12-03_seo-priority.md`

---

# Blog Post Layout & UX Improvements (2025-12-02)

## Context
Session focused on multiple blog post improvements: chatbot tone, styling consistency, hero layout, and Presentation mode image fix.

## Changes Made

### 1. Chatbot Tone - Reduced Hyperbolic Language
**File**: `src/app/api/chat/route.ts`

Added guideline to avoid superlatives:
```
- Avoid superlatives and hyperbolic phrases (e.g., "absolutely crushed it", "incredibly amazing", "totally nailed it") - let the work speak for itself
```

### 2. Blog Tip/Pro-Tip - Use Accent Color
**File**: `src/components/blog/MarginNote.tsx`

Changed hardcoded amber/emerald colors to semantic `accent` token:
```tsx
// Before
const borderColor = variant === 'pro'
  ? 'border-l-emerald-500 dark:border-l-emerald-400'
  : 'border-l-amber-500 dark:border-l-amber-400';

// After
const borderColor = 'border-l-accent';
const labelColor = 'text-accent';
```

### 3. Blog Hero - Layout Refinements
**Files**:
- `src/components/blog/BlogHero.tsx` - Byline + spacing fixes
- `src/app/(public)/blog/[slug]/page.tsx` - Pass byline props, removed BlogMeta

Byline (date + author) now renders inside BlogHero with proper spacing:
- Added `publishedAt` and `author` props to BlogHero
- Removed `space-y-6` from header (was adding unwanted gap)
- Removed `md:mt-[42px]` from image (title and image tops now align)
- Byline spacing: `pt-4 pb-4 mb-12 border-b border-border`
  - `pt-4` = close to title/image
  - `pb-4` = small gap above border
  - `mb-12` = proper spacing below border before body content
- Matches case study EditorialHero pattern

### 4. Blog Images - Fixed Presentation Mode
**File**: `src/lib/sanity/queries/blog.ts`

Expanded image assets in content blocks for Presentation mode preview:
```groq
// Before
content,

// After
content[] {
  ...,
  _type == "image" => {
    ...,
    asset->{ _id, url },
    crop,
    hotspot
  }
},
```

This ensures float-left/right images show up in Sanity Presentation mode for unpublished drafts.

## Files Modified
- `src/app/api/chat/route.ts` - Chatbot tone guideline
- `src/components/blog/MarginNote.tsx` - Accent color styling
- `src/components/blog/BlogHero.tsx` - Byline rendering inside hero
- `src/app/(public)/blog/[slug]/page.tsx` - Pass byline props
- `src/lib/sanity/queries/blog.ts` - Expand image assets in content

---

# Sanity CDN Caching Architecture (2025-12-01)

## Context
Follow-up to Lighthouse optimization. Initial local testing showed score improvement from 62 to 93, but production PageSpeed still showed 63. Investigation revealed the real issue: pages weren't being cached because `sanityFetch` from `defineLive` always uses `useCdn: false`, causing every request to hit the Sanity API directly.

## Problem Analysis
- **Symptom**: Production Lighthouse score stuck at 63 despite local optimizations
- **Root Cause**: All Sanity fetches bypassed CDN caching
- **Technical Issue**: `defineLive` from `next-sanity` configures `useCdn: false` for real-time preview
- **Impact**: Every page request = fresh API call → slow TTFB → poor Lighthouse scores

## Solution: Dual Client Architecture

### Phase 1: Created Caching Infrastructure

**File**: `src/sanity/lib/client.ts`
- Added `productionClient` with `useCdn: true` for fast cached responses
- Kept existing `client` with `useCdn: false` for draft mode

**File**: `src/sanity/lib/fetch.ts` (NEW)
- Created `cachedSanityFetch` helper that:
  - Uses CDN-cached `productionClient` for regular visitors
  - Falls back to `liveSanityFetch` for editors in draft mode
  - Supports cache tags for targeted invalidation

```typescript
export async function cachedSanityFetch<T>({
  query,
  params = {},
  tags = [],
}: CachedFetchOptions): Promise<{ data: T }> {
  const isDraftMode = (await draftMode()).isEnabled

  if (isDraftMode) {
    return liveSanityFetch({ query, params })
  }

  const data = await productionClient.fetch<T>(query, params, {
    next: {
      revalidate: false,
      tags: ['sanity', ...tags],
    },
  })

  return { data }
}
```

### Phase 2: Updated All Pages

All public pages now use `cachedSanityFetch` with appropriate cache tags:

| Page | Tags |
|------|------|
| Homepage | `['homepage']` |
| Blog listing | `['blog']` |
| Blog posts | `['blog', 'blog-${slug}']` |
| Case studies listing | `['case-studies']` |
| Case study pages | `['case-studies', 'case-study-${slug}']` |
| About page | `['profile']` |
| Contact page | `['contact']` |
| Layout footer | `['footer']` |

### Phase 3: Webhook Tag-Based Invalidation

**File**: `src/app/api/webhooks/sanity/route.ts`

Updated to use both `revalidatePath` AND `revalidateTag`:
- Added `revalidateTag` import from `next/cache`
- Global `sanity` tag revalidation on any content change
- Content-specific tags: `blog`, `case-studies`, `profile`, `contact`, `footer`
- Per-item tags for granular invalidation: `blog-${slug}`, `case-study-${slug}`

## Files Modified

### New Files
- `src/sanity/lib/fetch.ts` - Smart fetch helper

### Updated Files
- `src/sanity/lib/client.ts` - Added `productionClient`
- `src/app/(public)/page.tsx` - Homepage caching
- `src/app/(public)/layout.tsx` - Footer caching
- `src/app/(public)/about/page.tsx` - Profile caching
- `src/app/(public)/blog/page.tsx` - Blog listing caching
- `src/app/(public)/blog/[slug]/page.tsx` - Blog post caching
- `src/app/(public)/case-studies/page.tsx` - Case studies listing caching
- `src/app/(public)/case-studies/[slug]/page.tsx` - Case study caching
- `src/app/(public)/contact/page.tsx` - Contact page caching
- `src/app/api/webhooks/sanity/route.ts` - Tag-based revalidation

## Result

| Visitor Type | Behavior |
|--------------|----------|
| Regular visitors | Content served from Sanity CDN + Next.js cache → fast TTFB |
| Editors (draft mode) | Live preview via `defineLive` → real-time updates |
| Content updates | Webhook triggers targeted cache invalidation |

## Documentation
- `docs/plans/PLAN_2025-12-01_sanity-caching-architecture.md` - Implementation plan
- `docs/research/RESEARCH_2025-12-01_lighthouse-performance-optimization.md` - Initial research

---

# Initial Lighthouse Optimizations (2025-12-01)

## Context
First round of Lighthouse mobile performance optimizations. Local DevTools showed improvement from 62 to 93, but production PageSpeed still showed 63 (led to discovering the caching issue above).

## Optimizations Implemented

### 1. Font Loading Optimization
**File**: `src/app/layout.tsx:25-27`

Reduced DM_Sans preloaded weights from 5 to 2:
```typescript
// Before
weight: ["300", "400", "500", "600", "700"]

// After
weight: ["400", "600"]
```

### 2. CSS Transition Optimization
**File**: `src/app/globals.css:205-242`

Replaced universal `*` selector with selective transitions (eliminated 60ms forced reflows).

### 3. Removed Client-Side SunCalc
**File**: `src/components/providers/TimeThemeProvider.tsx`

- Removed SunCalc import from client bundle (-121KB)
- Client now reads theme from server-rendered CSS variables
- Time theme still works (server calculates, CSS variables set on `<html>`)

## Files Modified
- `src/app/layout.tsx` - Reduced font weights
- `src/app/globals.css` - Selective CSS transitions
- `src/components/providers/TimeThemeProvider.tsx` - Removed SunCalc

---

# Blog Footnotes Implementation (2025-11-27)

## Context
Implemented traditional bottom footnotes for blog posts using Sanity CMS annotations and PortableText rendering.

## Implementation

### 1. Sanity Schema Update
**File**: `sanity/schemas/blog.ts`

Added footnote annotation to blog content block (alongside existing link annotation):
```typescript
{
  name: 'footnote',
  type: 'object',
  title: 'Footnote',
  icon: BookIcon,
  fields: [
    {
      name: 'note',
      type: 'text',
      title: 'Footnote Text',
      description: 'Citation or explanatory note',
      rows: 3,
      validation: (Rule) => Rule.required(),
    },
  ],
},
```

### 2. Components Created

**FootnoteRef.tsx** - Inline superscript reference
- Wraps annotated text with clickable number link
- Styling: `text-accent text-[0.75em] align-super font-medium`
- Links to `#fn-{number}` anchor

**FootnotesSection.tsx** - Bottom notes section
- Collects and displays all footnotes at article end
- Includes back-links (`↩`) to return to reference
- Uses `:target` CSS highlighting via Tailwind `target:` variant
- `scroll-mt-24` for fixed header offset

### 3. BlogContent.tsx Updates
- Added footnote collection logic using `reduce` over PortableText blocks
- Created `footnoteNumbers` Map for `_key` to number lookup
- Added footnote mark handler in PortableText components
- Renders FootnotesSection at end of content

## How to Use
1. In Sanity Studio, edit a blog post
2. Select text to annotate
3. Click the **link icon** (🔗) in toolbar
4. Choose **"Footnote"** option
5. Enter footnote text and save

## Files Created
- `src/components/blog/FootnoteRef.tsx`
- `src/components/blog/FootnotesSection.tsx`

## Files Modified
- `sanity/schemas/blog.ts` - Added footnote annotation
- `src/components/blog/BlogContent.tsx` - Collection and rendering logic

## Technical Notes
- Footnotes use Sanity's `markDefs` annotation system (same as links)
- Auto-numbered in order of appearance via Map lookup
- Back-links use CSS `:target` pseudo-class for highlighting
- All styling uses Tailwind (including `target:` variant for `:target` state)

---

# Blog Components & Presentation Mode Fix (2025-11-26)

## Context
Implemented blog tip/margin note components and researched Sanity Presentation mode revalidation issue.

## Blog Components Implementation

### Components Created
1. **MarginNote.tsx** - Floating tip/pro-tip component
   - Floats right at all viewport sizes
   - Text wraps around naturally
   - Two variants: 'tip' (amber) and 'pro' (emerald)
   - Simple float-based approach (no CSS Grid complexity)

2. **ExamplePrompt.tsx** - Collapsible prompt example component
   - Used for showing AI prompts/code examples
   - Collapsible with copy-to-clipboard functionality

### Sanity Schema Updates
- Added `tip` and `examplePrompt` block types to blog schema
- Both render inline with blog content via PortableText

### Simplification Decision
Initially implemented Tufte-style CSS Grid layout with `:has()` selector, but simplified to float-only approach:
- Removed `.blog-tufte-layout` CSS (24 lines)
- Blog posts stay at full 920px width
- No CSS Grid, no `:has()` selector
- Much simpler and more maintainable

## Presentation Mode Turbopack Issue

### Problem
Sanity Presentation mode was causing full page reloads instead of smooth WebSocket updates during content editing.

### Root Cause Found
**Turbopack + Sanity incompatibility** in Next.js 15:
- `SanityLive` calls `revalidateTag()` on content changes (by design)
- In Turbopack mode, this triggers HMR/Fast Refresh mechanism
- Results in visible `[Fast Refresh] rebuilding` and full page rebuilds

### Known GitHub Issues
- [vercel/next.js#84294](https://github.com/vercel/next.js/issues/84294) - Turbopack Build Fails with Sanity CMS
- [vercel/next.js#64494](https://github.com/vercel/next.js/issues/64494) - Module factory HMR issue
- [vercel/next.js#78957](https://github.com/vercel/next.js/issues/78957) - Turbopack Fast Refresh issue

### Solution
Added `dev:cms` script that runs without Turbopack:
```json
"dev": "next dev -p 3000 --turbopack",     // Regular dev (fast HMR)
"dev:cms": "next dev -p 3000"               // CMS editing (no Turbopack)
```

**Note:** This is dev-mode only. Production builds work correctly.

### Documentation
Full research documented in `/docs/presentation-mode-revalidation-research-2025-11-26.md`

## Files Modified
- `src/components/blog/MarginNote.tsx` (created)
- `src/components/blog/ExamplePrompt.tsx` (created)
- `src/components/blog/BlogLayout.tsx` (simplified)
- `src/components/blog/BlogContent.tsx` (added PortableText handlers)
- `src/components/blog/index.ts` (exports)
- `sanity/schemas/blog.ts` (added tip/examplePrompt types)
- `src/app/globals.css` (removed blog-tufte-layout CSS)
- `src/app/layout.tsx` (added SanityLive refresh props)
- `package.json` (added dev:cms script)
- `docs/styling-exceptions.md` (updated documentation)
- `docs/presentation-mode-revalidation-research-2025-11-26.md` (created)

---

# Structured Data (JSON-LD) Implementation (2025-11-25)

## Context
Implemented comprehensive schema.org structured data across the portfolio site to improve SEO and enable rich search results.

## Implementation Summary

### Phases Completed
1. **Phase 1: Core Identity** - Site-wide Person + WebSite schemas in root layout
2. **Phase 2: Profile Page** - ProfilePage schema on /about
3. **Phase 3: Blog Posts** - BlogPosting schema on /blog/[slug]
4. **Phase 4: Case Studies** - Article schema on /case-studies/[slug]
5. **Phase 5: Breadcrumbs** - BreadcrumbList schema on all pages

### Files Created
- `src/lib/structured-data.ts` - Schema generator functions with TypeScript types
- `src/components/JsonLd.tsx` - Reusable JSON-LD injection component
- `docs/structured-data-research-2025-11-25.md` - Research documentation
- `docs/structured-data-implementation-plan-2025-11-25.md` - Implementation plan with CMS checklist

### Files Modified
- `src/app/layout.tsx` - Added Person + WebSite schemas (site-wide)
- `src/app/(public)/about/page.tsx` - Added ProfilePage + Breadcrumb schemas
- `src/app/(public)/blog/page.tsx` - Added Breadcrumb schema
- `src/app/(public)/blog/[slug]/page.tsx` - Added BlogPosting + Breadcrumb schemas
- `src/app/(public)/case-studies/page.tsx` - Added Breadcrumb schema
- `src/app/(public)/case-studies/[slug]/page.tsx` - Added Article + Breadcrumb schemas
- `src/lib/sanity/queries.ts` - Added structuredDataQuery
- `src/lib/sanity/queries/blog.ts` - Updated to include asset URL
- `src/lib/sanity/types.ts` - Added new profile fields
- `src/types/blog.ts` - Updated BlogImage interface
- `sanity/schemas/profile.ts` - Added bluesky social field, restored quickFacts field

### Schema Types Implemented
- **Person**: Name, jobTitle, description, image, email, sameAs (social links), knowsAbout (skills), worksFor (current employer)
- **WebSite**: Site name, URL, description, author
- **ProfilePage**: Wraps Person with page-level metadata
- **BlogPosting**: Headline, description, image, dates, author, publisher
- **Article**: Headline, description, image, dates, author, about (category)
- **BreadcrumbList**: Navigation hierarchy for each page

### CMS Fields (SEO-Only)
These fields feed structured data but don't display on pages:
- Hero Subheadline → Person `description`
- Social links (GitHub, LinkedIn, Twitter, Bluesky) → `sameAs`
- Skills array → `knowsAbout`
- Experience with `current: true` → `worksFor`

### Bug Fixes During Implementation
1. **Restored quickFacts field** - Was accidentally removed in prior schema cleanup (commit 175d2ed)
2. **Hid heroIntro display** - User requested it be SEO-only, not displayed on page
3. **Fixed null values in JSON-LD** - Created `cleanObject` utility to filter out null/undefined

### Dependencies Added
- `schema-dts` - TypeScript types for schema.org

## Validation
- Use Google Rich Results Test: https://search.google.com/test/rich-results
- Use Schema Markup Validator: https://validator.schema.org/
- Check browser DevTools for `<script type="application/ld+json">`
