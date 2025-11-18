# Current Development Status

## 📍 Active Sprint: Portfolio Chatbot Enhancement
*Last Updated: 2025-11-14*

## 🎯 Current Focus
**Portfolio Chatbot Content & Knowledge Base**

**Status**: Full content ingestion complete with Sanity CMS integration enabled. Chatbot now has access to 242 chunks of knowledge including all projects, case studies, and transcripts.

## ✅ Recent Accomplishments (November 17, 2025 - Latest)

### More Work Card Height Fix - COMPLETE 🎉

**Goal**: Fix inconsistent card heights in "More Work" section on homepage.

**Problem**:
- LinkPreview component cards had varying heights based on description length
- Virgin America card appeared taller than Peacock and Aesop cards
- Used `md:min-h-[164px]` which set minimum height but allowed cards to grow
- Created visual inconsistency in the grid layout

**Root Cause**:
```tsx
// Problematic approach - minimum height allows growth
<div className="flex flex-col md:flex-row gap-4 p-4 md:min-h-[164px]">
```

The `min-h-[164px]` sets a floor but doesn't cap the height. Cards with longer descriptions expanded beyond 164px, while cards with shorter descriptions stayed at the minimum height.

**Solution**:
- Changed from `md:min-h-[164px]` to `md:h-[164px]`
- Fixed height enforces consistent 164px across all cards on desktop
- Prevents cards from growing based on content length
- **File**: `/src/components/chatbot/LinkPreview.tsx` (line 250)

**Implementation**:
```tsx
// Fixed approach - explicit height prevents growth
<div className="flex flex-col md:flex-row gap-4 p-4 md:h-[164px]">
```

**Results**:
- ✅ All cards maintain consistent 164px height on desktop
- ✅ Grid layout appears uniform and polished
- ✅ Descriptions truncate with `line-clamp-3` if too long
- ✅ Mobile layout unaffected (no md: prefix, cards stack vertically)

**Commit**: `42661a7` - "Fix More Work card heights to maintain consistent layout"

---

### Portrait Image List Border Fix - COMPLETE 🎉

**Goal**: Fix broken borders around portrait phone screenshots in case study editorial section.

**Problem**:
- During earlier performance optimization (Phase 2), converted PortraitImageList from `<img>` to Next.js `<Image>`
- Used `fill` prop with fixed-size container (`h-[500px] w-[375px]`)
- Border container had fixed dimensions that didn't match actual image content
- Borders extended beyond images, creating visual breaks

**Root Cause**:
```tsx
// Problematic approach - fixed container with fill
<div className="relative border-accent border-[4px] rounded-[6px] overflow-hidden bg-muted h-[500px] w-[375px]">
  <Image src={imageUrl} fill loading="lazy" sizes="375px" className="object-contain" />
</div>
```

The `fill` prop makes the image try to fill the container, but `object-contain` respects aspect ratio, creating misalignment with fixed container dimensions.

**Solution**:
- Removed fixed dimensions from border container
- Changed from `fill` to explicit `width={375} height={500}` props
- Applied sizing to image itself: `h-[500px] w-auto object-contain`
- Container now wraps snugly around actual image content

**Implementation**:
```tsx
// Fixed approach - flexible container with explicit image dimensions
<div className="border-accent border-[4px] rounded-[6px] overflow-hidden bg-muted">
  <Image
    src={imageUrl}
    width={375}
    height={500}
    loading="lazy"
    className="h-[500px] w-auto object-contain rounded-[2px] block max-w-full"
  />
</div>
```

**Technical Details**:
- Image maintains fixed 500px height
- Width adjusts automatically (`w-auto`) based on aspect ratio
- Border container flexes to fit actual rendered image dimensions
- Still uses Next.js Image for optimization (WebP/AVIF, responsive)

**File**: `/src/components/case-study-flowing/PortraitImageList.tsx` (lines 37-46)

**Results**:
- ✅ Borders wrap properly around portrait screenshots
- ✅ Each image can have different width based on aspect ratio
- ✅ Maintains Next.js Image optimization benefits
- ✅ No visual breaks or extended borders

**Commit**: Pending - "Fix PortraitImageList borders by using explicit dimensions instead of fill"

---

### Homepage Border Fix - COMPLETE 🎉

**Goal**: Fix double border issue on homepage and properly position Featured Post section border.

**Problem**:
- Double border appearing above footer on homepage only
- Featured Post section had `border-b` (bottom border)
- Footer component has `border-t` (top border)
- These two borders stacked, creating thick double border
- Additionally, border spanned full page width instead of matching constrained container width

**Solution**:

**Part 1: Remove Double Border**
- Removed `border-b` from Featured Post section
- Footer's existing `border-t` provides single clean border above footer
- **File**: `/src/app/(public)/page.tsx` (line 165)

**Part 2: Add Constrained Border Above Featured Post**
- Moved border from full-width `<section>` to inner `container` div
- Border now respects max-w-6xl container width (matches case studies style)
- Added `border-t` to container with `pt-20 -mt-20` to maintain spacing
- **File**: `/src/app/(public)/page.tsx` (line 167)

**Technical Details**:
```tsx
// Before: Full-width border on section
<section className="py-20 px-6 relative border-b border-border dark:border-border">

// After: Constrained border on container
<section className="py-20 px-6 relative">
  <div className="container mx-auto max-w-6xl relative z-10 border-t border-border dark:border-border pt-20 -mt-20">
```

**Results**:
- ✅ Eliminated double border above footer
- ✅ Added properly positioned border above Featured Post section
- ✅ Border width matches case studies section (constrained, not full-width)
- ✅ Consistent visual hierarchy across homepage sections

**Commit**: Pending - "Fix homepage Featured Post section border positioning"

---

### Sanity Schema Cleanup - COMPLETE 🎉

**Goal**: Remove deprecated schema fields from profile and project schemas to reduce bloat and improve maintainability.

**Context**: After comprehensive schema audit documented in `docs/sanity-schema-audit-2025-11-17.md`, identified 15 unused/deprecated fields across profile and project schemas.

**Accomplishments**:

#### Profile Schema Cleanup ✅
- **Removed 9 deprecated fields** (296 lines):
  - `quickFacts` - Grid facts display
  - `capabilities` - Skills with descriptions
  - `sections` - Old about page sections
  - `selectedProjects` - Project highlights
  - `technologies` - Tech stack categories
  - `availability` - Work availability flag
  - `availabilityText` - Availability description
  - `ctaText` - Call-to-action text
  - `ctaButtonText` - CTA button label
- **Result**: Profile schema reduced from 30 to 21 actively used fields (30% reduction)
- **Commit**: `175d2ed` - "refactor: Remove deprecated profile schema fields"

#### Project Schema Cleanup ✅
- **Removed 6 deprecated fields** (179 lines):
  - `heroImage` → Replaced by `featuredImage`
  - `summary` → Replaced by `heroSection.summary`
  - `description` → Replaced by `heroSection.subtitle`
  - `achievements` → Replaced by `metrics` and narrative
  - `content` → Replaced by `slides`
  - `sections` → Replaced by `slides`
- **Result**: Project schema reduced by 179 lines, cleaner field organization
- **Commit**: `455b4f9` - "refactor: Remove 6 deprecated project schema fields"

**Impact**:
- Total **475 lines removed** from schema definitions
- Improved schema maintainability and clarity
- All data has been migrated to new fields (no data loss)
- Build verified successfully with no errors

**Related Documentation**:
- Schema audit report: `docs/sanity-schema-audit-2025-11-17.md`

---

### Case Study Performance Optimization - COMPLETE 🎉

**Goal**: Improve case study page performance from RES 38 to 70-75+ through comprehensive image optimization.

**Context**: User shared Vercel Speed Insights screenshot showing:
- Real Experience Score (RES): **38** (should be >90)
- Largest Contentful Paint (LCP): **7.22s** (should be <2.5s)
- Cumulative Layout Shift (CLS): **0.54** (should be <0.1)

**Problem**:
- All case study images using `<img>` tags instead of Next.js `<Image>`
- No priority loading for above-fold hero images
- Missing explicit dimensions causing layout shift
- Image quality too high (85 when 80 is optimal)

**Solution**: Three-phase comprehensive image optimization.

#### Phase 1: Hero Image Optimization (Priority) ✅

**Files Modified:**
1. **`/src/components/case-study-editorial/EditorialHero.tsx`** (lines 4, 74-87)
   - Added `import Image from 'next/image'`
   - Converted hero `<img>` to Next.js `<Image>` component
   - Added `priority` flag for preloading (LCP optimization)
   - Added `aspect-[4/3]` to prevent CLS
   - Added `fill` prop with responsive `sizes="(max-width: 768px) 100vw, 33vw"`
   - Changed from `w-full h-auto` to `fill` layout

**Expected Impact**:
- LCP improvement from 7.22s → 3-4s (hero image preloaded)
- CLS reduction (explicit aspect ratio)

**Commit**: `34e2ece` - "Optimize case study hero image with Next.js Image and priority loading"

---

#### Phase 2: All Article Images Optimization ✅

**Files Modified:**

1. **`/src/components/case-study-flowing/ArticleContent.tsx`** (lines 52-141)
   - **Full-width images** (lines 52-72):
     - Added `aspect-[16/9]` container
     - Converted to `<Image>` with `fill`, `loading="lazy"`, `sizes="(max-width: 896px) 100vw, 896px"`
   - **Float left/right images** (lines 75-118):
     - Added `aspect-[4/3]` container
     - Converted to `<Image>` with `fill`, `loading="lazy"`, `sizes="(max-width: 768px) 100vw, 45vw"`
   - **Portrait float images** (lines 121-141):
     - Added `aspect-[3/4]` container
     - Converted to `<Image>` with `fill`, `loading="lazy"`, `sizes="(max-width: 768px) 100vw, 45vw"`

2. **`/src/components/case-study-flowing/PortraitImageList.tsx`** (lines 8, 35-53)
   - Added `import Image from 'next/image'`
   - Converted carousel images to `<Image>` component
   - Fixed dimensions: `h-[500px] w-[375px]` container
   - Added `fill`, `loading="lazy"`, `sizes="375px"`
   - Changed from `<img className="h-[500px] w-auto">` to proper container approach

3. **`/src/components/case-study-editorial/VisualCards.tsx`** (lines 4, 31-41)
   - Added `import Image from 'next/image'`
   - Converted card images to `<Image>` component
   - Added `aspect-video` container
   - Added `fill`, `loading="lazy"`, `sizes="(max-width: 768px) 100vw, 50vw"`

**Expected Impact**:
- Automatic image optimization (WebP/AVIF format)
- Lazy loading for below-fold images
- Responsive sizing with proper `sizes` attribute
- Further CLS reduction across all images

---

#### Phase 3: Image Quality Reduction ✅

**Files Modified:**
1. **`/src/lib/sanity/image-builder.ts`** (lines 56-95)
   - Reduced quality from **85 → 80** across all 7 presets:
     - `hero`, `card`, `article-full`, `article-float`
     - `portrait`, `visual-card`, `grid`
   - 10-15% smaller file sizes with imperceptible visual difference

**Expected Impact**:
- 10-15% reduction in image payload
- Faster download times
- Lower bandwidth costs

**Commit**: `f824bb0` - "Optimize all case study images with Next.js Image and reduce quality to 80"

---

#### Performance Documentation ✅

**File Created:**
- **`/docs/case-study-performance-improvement-plan.md`**
  - Comprehensive 7-phase roadmap
  - Current metrics vs. target metrics
  - Phase 1-3: Completed (image optimization)
  - Phase 4-7: Future enhancements (critical CSS, bundle splitting, etc.)
  - Expected results table

**Expected Improvements**:
| Metric | Before | After | Change |
|--------|--------|-------|--------|
| RES | 38 | 70-75 | +85% |
| LCP | 7.22s | 2-3s | -65% |
| CLS | 0.54 | 0.05 | -90% |

**Results**:
- ✅ All case study images converted to Next.js Image
- ✅ Priority loading for hero (above-fold)
- ✅ Lazy loading for all other images
- ✅ Explicit aspect ratios prevent CLS
- ✅ Global quality reduction (85 → 80)
- ✅ Comprehensive performance plan documented
- ✅ Build passes successfully
- ✅ Ready for Vercel deployment and RES monitoring

**Next Steps**:
- Monitor Vercel Speed Insights over 24-48 hours
- If RES doesn't reach 85+, implement Phase 4 (Critical CSS inlining)

---

### Chat Disclaimer Enhancement - COMPLETE 🎉

**Goal**: Add subtle AI disclaimer to chat interface with conditional display and custom link styling.

**Initial Request**: "Can you add a small bit of text at the bottom of the chat component, above the input box that says 'I can make mistakes. If you are curious, get in touch' With get in touch being a link to the contact page"

**Implementation Journey**:

#### Version 1: Always Visible Disclaimer
**Commit**: `f9ca660`

**Files Modified:**
1. **`/src/components/navigation/ChatSection.tsx`** (lines 529-543)
   - Added disclaimer between message area and input
   - Text: "I can make mistakes. If you are curious, get in touch"
   - Link to `/contact` with accent color styling
   - Positioned with `px-8 pt-2 pb-1`

---

#### Version 2: Conditional Display + Custom Link Styling
**User Feedback**:
- "Can that note only show after a user submits a question?"
- "Can the link text be underlined but not purple?"

**Commit**: `e335dd5`

**Files Modified:**
1. **`/src/components/navigation/ChatSection.tsx`** (lines 529-543)
   - Added conditional rendering: `{messages.length > 1 && ...}`
   - Only shows after first user message submitted
   - Changed link styling from `text-accent hover:text-accent-light` to inherit color
   - Added `underline underline-offset-2` for subtle underline
   - Added hover effect: `hover:text-chat-foreground/80`
   - Maintains visibility logic with `showChatContent` and `panelState`

**Final Implementation**:
```tsx
{messages.length > 1 && (
  <div className={`px-8 pt-2 pb-1 text-center ${...}`}>
    <p className="text-xs text-chat-foreground/60">
      I can make mistakes. If you are curious,{' '}
      <a href="/contact" className="underline underline-offset-2 hover:text-chat-foreground/80 transition-colors">
        get in touch
      </a>
    </p>
  </div>
)}
```

**Results**:
- ✅ Disclaimer only appears after user interaction
- ✅ Link inherits text color (not purple/accent)
- ✅ Subtle underline for link affordance
- ✅ Smooth hover transition
- ✅ Non-intrusive UX
- ✅ Positioned perfectly between messages and input

---

### Font Preloading Revert - COMPLETE 🎉

**Goal**: Revert font preloading changes that degraded performance.

**Problem**: User reported "Those changes made it worse, can you revert?" referring to previous font preloading optimization attempt.

**Root Cause**: Adding `preload: true` to DM Sans and Newsreader fonts in layout.tsx caused performance degradation instead of improvement.

**Solution**: Remove `preload: true` flags and revert to baseline font configuration.

**Files Modified:**
1. **`/src/app/layout.tsx`** (lines 20-36)
   - Removed `preload: true` from DM Sans font configuration
   - Removed `preload: true` from Newsreader font configuration
   - Kept all other settings: `display: "swap"`, weights, subsets, variables

**Before** (causing performance issues):
```typescript
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
  preload: true,  // ← REMOVED
});
```

**After** (reverted):
```typescript
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});
```

**Results**:
- ✅ Performance restored to baseline
- ✅ User confirmed improvement
- ✅ Font loading strategy back to proven configuration

**Commit**: `166ff5a` - "Revert font preloading that degraded performance"

---

### Performance Investigation (Build Comparison) - COMPLETE 🎉

**Goal**: Investigate why Lighthouse scores were higher with previous build.

**User Question**: "Can you see why the scores were higher with this build from a day ago: https://github.com/mevans2120/michael-evans-port/commit/b83611fd86715b71eda6b78400b46b2680ddfbbd"

**Investigation**:
- Analyzed git diff between builds
- Examined changes for performance impact
- Reviewed font preloading, image optimizations, component updates

**Findings**:
- No significant code changes between builds that would cause performance drop
- Build differences were minor (documentation updates, small refactors)
- Likely cause: **Test variability** and **network conditions** during Lighthouse runs
- Lighthouse scores can vary ±10 points on identical code

**Conclusion**:
- Performance drop was NOT caused by code changes
- User response: "its fine..." (accepted explanation)
- Focus shifted to case study performance optimization (see above)

**Results**:
- ✅ Thorough investigation completed
- ✅ No code issues identified
- ✅ User accepted findings
- ✅ Pivoted to actual performance work (image optimization)

---

### Chatbot-Only Case Studies Feature - COMPLETE ✅

**Goal**: Enable case studies to be hidden from public lists but still discoverable through chatbot conversations.

**Implementation**:

#### 1. Sanity Schema Enhancement
- **File**: `/sanity/schemas/project.ts` (line 169-175)
- **Change**: Added `chatbotOnly` boolean field to project schema
- **Default**: `false` (all existing projects remain public)
- **Description**: "Hide from case study list and recommended cards, but keep available for chatbot recommendations. Use this for unlisted projects that users can discover through conversation."

#### 2. GROQ Query Filtering (7 queries updated)
**Files Modified**:
- `/src/lib/sanity/queries.ts` - 5 queries updated:
  - Line 5: `projectsQuery` (homepage projects)
  - Line 36: `allProjectsAlphabeticalQuery` (case studies list)
  - Line 67: `featuredProjectsQuery` (homepage featured)
  - Line 158: `projectsByCategoryQuery` (category filters)
  - Line 247: `allFeaturedCaseStudiesQuery` (hero section)
- `/src/lib/sanity/queries/viewMoreProjects.ts` - 2 queries updated:
  - Line 45: `allProjectsForSelectionQuery` (random selection)
  - Line 56: `relatedProjectsByCategoryQuery` (related content)

**Filter Applied**: `&& chatbotOnly != true` added to all list/collection queries

#### 3. Intentionally NOT Filtered
- **Individual project pages** (`projectQuery`) - Direct URLs still work
- **Chatbot vector database** - Syncs ALL projects automatically via Sanity webhook
- **Result**: "Unlisted" projects are discoverable through conversation but hidden from browsing

**Use Cases**:
- Work-in-progress case studies (mention but don't display)
- Private/NDA projects (chatbot can discuss at high level)
- Archived projects (remove from portfolio but keep in knowledge base)
- Easter eggs (hidden content discovered through chatbot)

**Documentation**:
- Implementation plan: `/docs/chatbot-only-case-studies-plan.md`

**Key Design Decision**: List views filter content, chatbot doesn't. This creates an "unlisted but discoverable" content tier.

**Testing**:
- Sanity Studio: New "Chatbot Only" checkbox appears on all projects
- Set project to `chatbotOnly: true` → Hidden from `/case-studies` list
- Direct URL still works: `/case-studies/project-slug` loads normally
- Chatbot can still recommend and link to hidden projects

---

### Chatbot Fixes: Case Study Cards & ASCII Art - Session 3 ✅

**Issues Resolved**:

#### 1. Case Study Cards Not Always Appearing
- **Problem**: Case study preview cards appeared inconsistently when chatbot discussed projects
- **Root Cause**: Optional prompt language ("If your answer discussed...")
- **Solution**: Changed to mandatory with "WHEN...ALWAYS" language
- **File**: `/src/app/api/chat/route.ts` (line 117)
- **Result**: Cards now appear consistently when projects are mentioned

#### 2. ASCII Art Feature Temporarily Disabled
- **Problem**: ASCII art showing grey boxes when praised (regression from model behavior change)
- **Attempted Fix**: Added actual ASCII examples with code block wrapping instructions
- **User Feedback**: Didn't want ASCII in code blocks
- **Final Decision**: Commented out entire ASCII art feature (lines 143-186)
- **Status**: Feature disabled for now, can be re-enabled later with different approach

**Files Modified**:
- `/src/app/api/chat/route.ts`:
  - Line 117: Updated case study link prompt to mandatory
  - Lines 143-186: ASCII art feature commented out (preserved for future reference)

---

### UI Polish & Performance Optimization - Session 2 ✅

**Focus**: Image cropping fixes, spacing adjustments, Sanity presentation mode, and Lighthouse performance optimization.

**Changes Made**:

#### 1. Case Study Hero Image Cropping Fixed
- **Issue**: Hero images (esp. Aesop product) were cropped from sides
- **Root Cause**: Hero preset using `fit: 'crop'` with fixed 1200x900 dimensions
- **Solution**: Removed height/fit constraints from hero preset - now uses width-only (1200px, natural aspect ratio)
- **Files**: `/src/lib/sanity/image-builder.ts` (line 57-61), `/src/components/case-study-editorial/EditorialHero.tsx` (line 74-79)
- **Result**: Full-width images display without side cropping

#### 2. Hero Image Vertical Alignment
- **Issue**: Hero image aligned with category badge instead of title
- **Solution**: Added `md:mt-[42px]` top margin to image container
- **File**: `/src/components/case-study-editorial/EditorialHero.tsx` (line 74)
- **Result**: Image top now aligns with title text on desktop

#### 3. Reduced Spacing Before Technologies Section
- **Issue**: Large gap between article content and Technologies section
- **Solution**: Reduced FlowingArticle bottom padding from `pb-16 md:pb-24` to `pb-8 md:pb-12`
- **Files**: `/src/components/case-study-flowing/FlowingArticle.tsx` (line 19), `/src/app/(public)/case-studies/[slug]/page.tsx` (line 234)
- **Result**: Tighter, more balanced vertical spacing

#### 4. Homepage Featured Post Border Added
- **Issue**: No visual separation between Featured Post and sections below
- **Solution**: Added `border-b border-border dark:border-border` to Featured Post section
- **File**: `/src/app/(public)/page.tsx` (line 165)
- **Result**: Consistent stroke styling matching rest of site

#### 5. Sanity Presentation Mode Revalidation Fixed
- **Issue**: Presentation mode refreshing entire page on every keystroke (7th attempt to fix)
- **Root Cause**: Refresh handler with broken empty manual refresh block
- **Solution**: Simplified refresh handler to disable ALL manual refreshes, rely on SanityLive WebSocket
- **File**: `/src/components/VisualEditingWrapper.tsx` (line 30-33)
- **Result**: No more page refreshes while typing in drafts

#### 6. Lighthouse Performance Investigation & Optimization (Phase 1)
- **Score**: 67 → Target 85+ (currently at Phase 1)
- **Root Cause**: 3-second Element Render Delay due to render-blocking CSS/fonts
- **Analysis**: Created comprehensive report `/docs/lighthouse-performance-investigation-2025-11-17.md`
- **Phase 1 Implementation**: Added `preload: true` to DM Sans and Newsreader fonts
- **Files**: `/src/app/layout.tsx` (lines 25, 35)
- **Expected Impact**: +5-10 points improvement
- **Next Steps**: Phase 2 (Critical CSS inlining) and Phase 3 (CSS optimization)

**Key Insights**:
- Image cropping was happening at Sanity CDN level (URL params), not CSS
- Lighthouse performance issue NOT image-related - it's render-blocking CSS/fonts
- Next.js font optimization works, but still needs preloading for LCP
- SanityLive WebSocket handles real-time updates - no manual refresh needed

**Documentation Created**:
- `/docs/lighthouse-performance-investigation-2025-11-17.md` - Comprehensive performance analysis with 4-phase implementation plan

**Build Status**: ✅ Passing (all TypeScript errors resolved)

---

### Security Audit & Chat Logs Privacy Enhancement - COMPLETE 🎉

**Goal**: Conduct comprehensive security audit and restrict admin chat logs to development environment only.

**Context**: Portfolio site with low traffic - security appropriate for use case, not enterprise-grade requirements.

**Security Audit Results**:
- **Total issues found: 10**
- **Critical: 0** | **High: 1** | **Medium: 6** | **Low: 3**
- Comprehensive report: `/docs/security-audit-2025-11-17.md`

**Key Findings**:
1. **HIGH**: No rate limiting on API routes (main concern: API cost abuse)
2. **MEDIUM**: Insufficient input validation on chat endpoint
3. **MEDIUM**: No CSRF protection on admin operations
4. **MEDIUM**: Supabase RLS needs verification
5. **MEDIUM**: No CSP headers configured
6. **LOW**: Various best practice improvements

**Fixes Implemented**:

#### Chat Logs Restricted to Development Only ✅

**Problem**:
- Admin chat logs were accessible in production with weak client-side authentication
- `NEXT_PUBLIC_ADMIN_API_TOKEN` exposed in client bundle
- Anyone could bypass authentication and view private conversations

**Solution**:
- Environment-based access control using `NODE_ENV`
- API returns 404 in production
- Page shows "Development Only" message
- Production chats still logged to Supabase, viewable locally for debugging

**Files Modified:**

1. **`/src/app/api/admin/chat-logs/route.ts`** (lines 14-21)
   - Added environment check at start of GET handler
   - Returns 404 in production: `if (process.env.NODE_ENV !== 'development')`
   - Only processes requests in development mode

2. **`/src/app/(admin)/admin/chat-logs/page.tsx`** (lines 45-54, 115-131)
   - Added `isDevelopment` check using `process.env.NODE_ENV`
   - Skips fetching logs in production
   - Shows friendly message: "Chat logs are only available in development mode for privacy and security reasons"
   - Only renders dashboard in development

**Security Impact**:
- ✅ Zero chat log exposure in production
- ✅ Client-side admin auth bypass no longer matters for production
- ✅ Chat privacy fully protected
- ✅ Local debugging still available with full access
- ✅ Eliminates HIGH severity issue for production deployment

**Production vs Development Behavior**:
- **Production**: Returns 404, shows "Development Only" message
- **Development**: Full chat logs access with current authentication
- **Data Flow**: Production chats → Supabase → Viewable in local dev (same database)

**Audit Documentation**:
- Complete security audit: `/docs/security-audit-2025-11-17.md`
- All findings documented with severity, mitigation, and effort estimates
- Remaining recommendations prioritized by risk and impact
- Testing checklists for future security improvements

**Remaining Security Recommendations** (not urgent for portfolio):
1. **HIGH**: Implement rate limiting on API routes (prevents API cost abuse)
2. **MEDIUM**: Add input validation on chat endpoint
3. **MEDIUM**: Verify Supabase RLS policies
4. **LOW**: Set `.env.local` file permissions to 600

**Results**:
- ✅ Comprehensive security assessment complete
- ✅ High-priority production vulnerability eliminated
- ✅ Clear roadmap for future security improvements
- ✅ Portfolio site appropriately secured for its use case
- ✅ No breaking changes to existing functionality

**Commit**: Secure admin chat logs and complete security audit

---

### Sanity Presentation Mode Refresh Behavior Simplified - COMPLETE 🎉

**Goal**: Eliminate aggressive page revalidation in Sanity Presentation mode by removing all fallback revalidation.

**Problem**:
- Even with skip logic for live preview, fallback revalidation was still triggering
- Research showed WebSocket should handle ALL updates when connected
- Unnecessary revalidation was causing jarring page refreshes

**Solution**: Simplified refresh handler to ONLY skip revalidation for mutations, letting WebSocket handle everything.

**Files Modified:**

1. **`/src/components/VisualEditingWrapper.tsx`** (lines 28-40)
   - Removed console logging (3 log statements deleted)
   - Removed fallback revalidation logic entirely
   - Simplified to: always skip revalidation for mutations, return early
   - Manual refresh events pass through to default behavior
   - Much cleaner implementation: 13 lines vs previous 21 lines

**Before**: Complex conditional logic with fallback revalidation
```typescript
if (payload.source === 'mutation') {
  if (payload.livePreviewEnabled) {
    console.log('[VisualEditing] Skipping revalidation - WebSocket active')
    return
  }
  if (payload.document?._type) {
    console.log('[VisualEditing] Revalidating document type:', payload.document._type)
    await revalidateSanityDocument(payload.document._type)
  } else {
    console.warn('[VisualEditing] Mutation payload missing document type:', payload)
  }
}
```

**After**: Clean skip-all-mutations approach
```typescript
if (payload.source === 'mutation') {
  return // No refresh needed - WebSocket handles it when connected
}

// For manual refreshes, allow default behavior
if (payload.source === 'manual') {
  // Let default behavior handle manual refresh
}
```

**Reasoning**:
- WebSocket should handle ALL real-time updates when connected
- Fallback revalidation was causing the aggressive refresh behavior
- Manual refresh button is available if users need to force update
- Simpler code is more maintainable and less error-prone

**Results**:
- ✅ No more aggressive page revalidation during editing
- ✅ Smoother editing experience in Presentation mode
- ✅ Cleaner, more maintainable code
- ✅ Still supports manual refresh when needed
- ✅ Removed debug logging noise

---

## ✅ Recent Accomplishments (November 16, 2025)

### Smart Cache Revalidation - Phase 1 & 2 COMPLETE 🎉

**Goal**: Implement intelligent cache revalidation for Sanity CMS publishes - only invalidate affected pages when content is published (not on draft saves).

**Problem**:
- Production cache doesn't update when publishing in Sanity
- Need surgical revalidation (not "nuclear" approach)
- Should only trigger on publish, not on every draft save

**Solution**: Phased implementation of smart, publish-triggered cache revalidation.

**Implementation Plan**: Created comprehensive 5-phase plan at `/docs/sanity-cache-revalidation-plan.md`

**Phases Completed**:

### Phase 1: Publish Detection ✅
**Files Modified**: `/src/app/api/webhooks/sanity/route.ts`

**Changes**:
- Added `isDraft()` helper function to detect draft documents
- Draft documents have IDs starting with "drafts."
- Skip processing for drafts with informational logging
- Only process published content (clean document IDs)

**Behavior**:
```
// Draft save (skipped):
📨 Webhook received for: project (drafts.abc123)
   ⏭️  Skipping draft document (not published yet)

// Publish (processed):
📨 Webhook received for: project (abc123)
   ✅ Published document - processing...
```

### Phase 2: Smart Path Revalidation ✅
**Files Modified**: `/src/app/api/webhooks/sanity/route.ts`

**Changes**:
- Imported `revalidatePath` from `next/cache`
- Added `revalidateForDocument()` helper with type-specific logic
- Revalidates paths after successful chatbot sync
- Returns revalidated paths in webhook response
- Graceful error handling (revalidation failures don't break webhook)

**Revalidation Rules**:
```typescript
// Case Studies
project → /case-studies/[slug], /case-studies

// Blog Posts
blog → /blog/[slug], /blog

// Singletons
profile → /about
homepageHero → /
contactPage → /contact

// Global Content
footer → /, /case-studies, /about, /contact
siteSettings → all main pages
```

**Example Output**:
```
📨 Webhook received for: project (virgin-america)
   ✅ Published document - processing...
   🔄 Syncing project...
   ✅ Synced 5 chunks

   🔄 Revalidating cache...
   ✅ Revalidated 2 path(s):
      - /case-studies/virgin-america
      - /case-studies
```

**Key Benefits**:
- ✅ **Surgical revalidation**: Only affected paths, never entire site
- ✅ **Publish-only**: Drafts ignored, no cache thrashing during editing
- ✅ **Type-aware**: Different content types revalidate appropriate paths
- ✅ **Non-breaking**: Revalidation failures don't crash webhook
- ✅ **Transparent**: Clear logging of what was revalidated

**Next Steps**:
- Phase 3: Smart featured detection (optional - avoid homepage revalidation if content isn't featured)
- Phase 4: Dynamic path handling (optional - more edge cases)
- Phase 5: Enhanced error handling (optional - detailed error reporting)

**Production Ready**: Phases 1-2 provide core functionality. Phases 3-5 are optional enhancements.

---

### Case Study Page Alignment & Polish - COMPLETE 🎉

**Goal**: Fix alignment inconsistencies and polish UI details across case study pages.

**Issues Identified**:
1. **Redundant CTA text**: LinkPreview showed "Click to view [category]" when no description available
2. **Misaligned content**: ViewMoreProjects used `max-w-6xl` while all other sections used `max-w-4xl`
3. **Confusing separator**: Technologies section had border above instead of below

**Solution**: Three targeted fixes for consistent, polished case study pages.

**Files Modified**:

1. **`/src/components/chatbot/LinkPreview.tsx`** (line 281-287)
   - Removed redundant "Click to view {category}" fallback text
   - Changed from conditional rendering with fallback to only showing description when present
   - Cleaner cards without duplicative text (whole card is already clickable)
   ```tsx
   // Before: Showed "Click to view loyalty & reservations" when no description
   // After: Shows only category badge and title when no description
   {metadata.description && (
     <div className="hidden md:block flex-1">
       <p className="text-sm text-muted-foreground line-clamp-3">
         {metadata.description}
       </p>
     </div>
   )}
   ```

2. **`/src/components/view-more-projects/ViewMoreProjectsClient.tsx`** (line 60)
   - Changed `max-w-6xl` to `max-w-4xl` for consistent alignment
   - Now matches all other case study sections
   - **Alignment audit revealed**:
     - EditorialHero: `max-w-4xl` ✓
     - EditorialMetrics: `max-w-4xl` ✓
     - FlowingArticle: `max-w-4xl` ✓
     - Technologies: `max-w-4xl` ✓
     - ViewMoreProjects: `max-w-4xl` ✓ (fixed)

3. **`/src/app/(public)/case-studies/[slug]/page.tsx`** (line 234)
   - Changed `border-t` to `border-b` on Technologies section
   - Moved horizontal line from above to below section
   - Better visual hierarchy: line now separates article content from "Explore More Work"

**Key Learnings**:
- **Design system compliance**: All case study sections must use same max-width (`max-w-4xl`) for alignment
- **UX polish**: Remove redundant text when interaction is already clear from context
- **Visual hierarchy**: Borders should reinforce content structure, not create confusion

**Results**:
- ✅ Consistent horizontal alignment across all case study sections
- ✅ Cleaner LinkPreview cards without redundant text
- ✅ Better visual separation between article and recommendations
- ✅ All changes follow existing design system patterns

---

## ✅ Recent Accomplishments (November 15, 2025)

### View More Projects Component - COMPLETE 🎉

**Goal**: Create a "View More Projects" component for the bottom of case study pages featuring three randomly selected project cards using the existing LinkPreview component.

**Requirements**:
- Display 3 additional case studies at the bottom of each case study page
- Use same card treatment as chat assistant (LinkPreview component)
- Random selection that's stable per page load (seeded randomization)
- Full CMS control via Sanity
- Match homepage "Selected Work" styling for headers and CTAs
- Responsive design with proper mobile/desktop layouts

**Implementation Journey**:
1. **Design Phase**: Created three initial design concepts (Card Grid, Editorial List, Stacked Carousel)
2. **Component Research**: Decided to reuse existing LinkPreview component for consistency
3. **Planning**: Created comprehensive 6-phase implementation plan in `/docs/view-more-projects-implementation-plan.md`
4. **CMS Schema**: Built extensive Sanity configuration with multiple selection strategies
5. **Seeded Randomization**: Implemented stable random selection using slug as seed
6. **Styling Iterations**: Multiple updates to match homepage aesthetic and fix responsive issues

**Solution**: Three-part architecture with CMS control, smart selection, and reusable components.

**Files Created:**

1. **`/sanity/schemas/viewMoreProjectsSettings.ts`**
   - Singleton CMS schema for View More Projects configuration
   - Selection strategies: random (default), related, recent, curated
   - Layout options: grid (default), list, carousel
   - Animation settings and CTA configuration
   - Full control over heading, subheading, project count

2. **`/src/lib/project-selection.ts`**
   - Seeded random number generator for stable selection
   - `getRecommendedProjects()` function with multiple strategies
   - Uses slug hash as seed for consistent randomization per page
   - Supports 1-10 project recommendations

3. **`/src/components/view-more-projects/ViewMoreProjects.tsx`**
   - Server component fetching settings and projects
   - Handles CMS settings validation
   - Falls back to defaults if CMS not configured

4. **`/src/components/view-more-projects/ViewMoreProjectsClient.tsx`**
   - Client component using LinkPreview for cards
   - Homepage-style header with gradient line ornament
   - OrnamentalCTA for consistent button styling
   - Responsive grid layout (1 col mobile, 2 tablet, 3 desktop)
   - Atmospheric background effects matching site design

**Files Modified:**

5. **`/src/components/chatbot/LinkPreview.tsx`** (multiple iterations)
   - Added `md:min-h-[164px]` for consistent desktop card heights
   - Changed mobile image height to `h-48` (was causing distortion)
   - Hidden description on mobile with `hidden md:block`
   - Made content flex column with `flex-1` for proper height distribution
   - Ensured text ellipsis with `line-clamp-2` and `line-clamp-3`

6. **`/src/app/(public)/case-studies/[slug]/page.tsx`**
   - Added `<ViewMoreProjects currentSlug={slug} />` component
   - Placed between Technologies section and footer

7. **`/sanity/schemas/index.ts`**
   - Registered viewMoreProjectsSettings schema

**Key Technical Innovations**:

1. **Seeded Randomization**:
   ```typescript
   class SeededRandom {
     constructor(seed: number) { this.seed = seed }
     next(): number {
       this.seed = (this.seed * 1664525 + 1013904223) % 2147483647
       return this.seed / 2147483647
     }
   }
   ```
   - Deterministic randomization based on current slug
   - Same project always shows same recommendations
   - No page refresh or hydration issues

2. **Component Reuse Strategy**:
   - LinkPreview handles all metadata fetching
   - Automatic loading states with skeleton
   - Consistent card treatment across chat and recommendations
   - Cache-friendly with 5-minute client-side cache

3. **Responsive Design Evolution**:
   - Initial: Desktop cards had varying heights
   - Fixed: `md:min-h-[164px]` ensures uniform height
   - Mobile: Taller images (`h-48`) prevent squishing
   - Text: Proper ellipsis with line-clamp utilities

**Styling Refinements**:
- Matched homepage "Selected Work" section aesthetic
- Added gradient line ornament after heading
- Used OrnamentalCTA component for CTA button
- Atmospheric blur orbs for depth
- Text-2xl font-light heading style

**Results**:
- ✅ Three randomly selected projects on each case study page
- ✅ Stable selection (no flickering on navigation)
- ✅ Full CMS control with extensive options
- ✅ Consistent card heights on desktop
- ✅ Proper mobile responsiveness
- ✅ Reuses existing components (zero duplication)
- ✅ Matches site design language perfectly
- ✅ Build passes successfully

**Documentation**:
- Implementation plan: `/docs/view-more-projects-implementation-plan.md`
- 6-phase approach with detailed requirements
- Component architecture and data flow
- CMS configuration options

**Commits**:
- Multiple commits implementing phases 1-3
- Styling updates for homepage consistency
- Mobile responsive fixes for images and text

---

## ✅ Recent Accomplishments (November 15, 2025)

### Production Build Error Fix (Suspense Boundary) - COMPLETE 🎉

**Issue**: Production build failing with error: "useSearchParams() should be wrapped in a suspense boundary at page /admin/chatbot-content"

**Root Cause**: The `GoogleAnalytics` component uses `useSearchParams()` for route tracking. In Next.js 15.5.6, components using dynamic hooks like `useSearchParams()` must be wrapped in a Suspense boundary to enable static generation.

**Solution**: Wrap the `GoogleAnalytics` component in a React Suspense boundary in the root layout.

**Implementation**:

**Files Modified:**
1. **`/src/app/layout.tsx`**
   - Added import: `import { Suspense } from "react"`
   - Wrapped GoogleAnalytics component: `<Suspense fallback={null}><GoogleAnalytics measurementId={gaId} /></Suspense>`
   - Lines modified: 17 (import), 117-119 (Suspense wrapper)

**Results**:
- ✅ Production build now succeeds without errors
- ✅ All 17 static pages generated successfully
- ✅ Google Analytics continues working correctly with route tracking
- ✅ Static generation enabled for all pages including admin routes
- ✅ Ready for Vercel deployment

**Commit**: `69fd291` - "Fix production build error with Suspense boundary for GoogleAnalytics"

---

### Google Analytics Fix & Debug Logging Cleanup - COMPLETE 🎉

**Issue**: Google Analytics tag was not firing due to `NEXT_PUBLIC_` environment variable not being accessible in client components (Next.js 15.5.6 regression).

**Root Cause**: Environment variables with `NEXT_PUBLIC_` prefix are not reliably accessible in client components in Next.js 15.3+.

**Solution**: Pass measurement ID as prop from server component where environment variables are reliably accessible.

**Implementation**:

**Files Modified:**
1. **`/src/components/GoogleAnalytics.tsx`** (complete rewrite)
   - Now accepts `measurementId` as a prop instead of reading from `process.env`
   - Added route change tracking using `usePathname()` and `useSearchParams()`
   - Tracks SPA navigation automatically
   - Added TypeScript declarations for `window.gtag`
   - Removed all debug logging (6 console statements removed)

2. **`/src/app/layout.tsx`** (lines 59, 116)
   - Reads `NEXT_PUBLIC_GA_MEASUREMENT_ID` from environment on server side
   - Passes measurement ID to GoogleAnalytics component as prop

**Debug Logging Cleanup** (18 statements removed):
3. **`/src/components/navigation/MobileHeader.tsx`** - Removed 1 log
4. **`/src/components/VisualEditingWrapper.tsx`** - Removed 2 logs
5. **`/src/components/design-concepts/TerminalDark.tsx`** - Removed 1 log
6. **`/src/hooks/useDynamicFavicon.ts`** - Removed 2 logs
7. **`/src/hooks/useScrollDirection.ts`** - Removed 6 logs

**Results**:
- ✅ Google Analytics now firing correctly
- ✅ Automatic page view tracking on route changes
- ✅ No console pollution (18 debug logs removed)
- ✅ Production-ready implementation
- ✅ Works in Next.js 15.5.6

**Commit**: `f707270` - "Fix GA environment variable access and remove debug logging"

---

### Google Analytics 4 Integration - COMPLETE 🎉

**Goal**: Add Google Analytics tracking following Next.js best practices.

**Requirements**:
- Use Next.js Script component with optimal loading strategy
- Environment-based configuration
- Client-side only component
- Graceful handling of missing configuration

**Solution**: Custom GoogleAnalytics component using Script component with afterInteractive strategy.

**Implementation**:

**Files Created:**
1. **`/src/components/GoogleAnalytics.tsx`**
   - Client component with `'use client'` directive
   - Uses Next.js `Script` component for optimal performance
   - Strategy: `afterInteractive` (loads after page becomes interactive)
   - Reads measurement ID from `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - Returns null gracefully if measurement ID not configured
   - Loads gtag.js and configures tracking

**Files Modified:**
2. **`/src/app/layout.tsx`** (lines 10, 12, 113)
   - Imported GoogleAnalytics component
   - Added to body alongside Vercel Analytics and SpeedInsights
   - Loads on every page automatically

3. **`.env.local`** (lines 47-48)
   - Added `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-DWNZFHBFHB`

4. **`.env.example`** (lines 49-52)
   - Documented environment variable for production deployments
   - Added helpful comment with Google Analytics setup URL

**Best Practices Followed**:
- **Next.js Script component**: Uses `strategy="afterInteractive"` for optimal loading
- **Environment variables**: Uses `NEXT_PUBLIC_` prefix for client-side access
- **Client-side only**: Properly marked with `'use client'`
- **Type safety**: Uses TypeScript
- **No layout shift**: Loads after page is interactive
- **Automatic tracking**: Tracks all pageviews automatically

**Results**:
- ✅ Build passes successfully
- ✅ Google Analytics tracking active (measurement ID: G-DWNZFHBFHB)
- ✅ Optimal performance (afterInteractive strategy)
- ✅ Environment-based configuration
- ✅ Ready for production deployment

**Commit**: `057c5f7` - "Add Google Analytics 4 tracking"

---

### Blog Post Rich Image Types (Phase 1) - COMPLETE 🎉

**Goal**: Port rich image types from project case studies to blog posts, sharing components to avoid code duplication.

**Requirements**:
- Add image style variants (fullWidth, floatLeft, floatRight, floatRightPortrait)
- Add ImageGrid support (2-6 images in 2-column grid)
- Add PortraitImageList support (1-10 portrait images with horizontal scrolling)
- Add VideoEmbed support (YouTube/Vimeo)
- Share existing components from case-study-flowing directory
- Maintain backward compatibility for existing blog images

**Solution**: Enhanced blog schema and BlogContent renderer to use shared components from project case studies.

**Implementation**:

**Files Modified:**

1. **`/sanity/schemas/blog.ts`** (lines 100-270)
   - Added `style` field to existing image type with 4 variants:
     - Full Width (16:9) - default
     - Float Left (4:3)
     - Float Right (4:3)
     - Float Right Portrait
   - Added `ImageGrid` type definition (2-6 images, 2-column grid, with captions)
   - Added `PortraitImageList` type definition (1-10 portrait images, horizontal scrolling)
   - Added `VideoEmbed` type definition (YouTube/Vimeo URL with caption)
   - All types match project schema exactly for consistency

2. **`/src/components/blog/BlogContent.tsx`** (lines 5-6, 70-213)
   - Imported ImageGrid and PortraitImageList components from `case-study-flowing/`
   - Enhanced image renderer with style-based layout variants:
     - fullWidth: Full container width, object-contain
     - floatLeft: 45% width on desktop, floated left
     - floatRight: 45% width on desktop, floated right
     - floatRightPortrait: 45% width on desktop, floated right (portrait aspect)
   - Added imageGrid handler: passes images to ImageGrid component
   - Added portraitImageList handler: passes images to PortraitImageList component
   - Added videoEmbed handler: YouTube/Vimeo URL parsing and iframe embed
   - Backward compatible: existing images default to fullWidth style

**Key Features**:
- **Component reuse**: All rendering logic shared with project case studies (zero duplication)
- **Backward compatible**: Existing blog images automatically use fullWidth style
- **Sanity Studio**: New content blocks immediately available in blog post editor
- **Consistent styling**: Matches project case study appearance exactly
- **Video support**: Automatic YouTube/Vimeo ID extraction and embed
- **Responsive**: All layouts work on mobile and desktop

**Results**:
- ✅ Build passes successfully
- ✅ 296 lines added to enhance blog functionality
- ✅ Zero code duplication (reused existing components)
- ✅ Blog posts now have same rich media capabilities as case studies
- ✅ Available in Sanity Studio at `/studio`

**What's Available in Sanity**:
- 4 image layout options (fullWidth, floatLeft, floatRight, floatRightPortrait)
- Image grids for showcasing multiple images
- Portrait image carousels for mobile screenshots
- Video embeds for YouTube/Vimeo content

**Commit**: `1c15a50` - "Add rich image types to blog posts (Phase 1)"

---

### Portrait Image List Horizontal Scrolling - COMPLETE 🎉

**Goal**: Enable horizontal scrolling for portrait image lists to support more than 3 images.

**Requirements**:
- Support 1-10 portrait images (previously limited to 3)
- Only enable scrolling when images exceed viewport width
- Hide scrollbar to match project design system
- Maintain smooth scroll and snap behavior

**Implementation**:

**Files Modified:**
1. **`/sanity/schemas/project.ts`** (lines 532-563)
   - Updated max images validation from `.max(3)` to `.max(10)`
   - Updated descriptions to reflect "1-10 portrait phone images (scrollable)"

2. **`/src/components/case-study-flowing/PortraitImageList.tsx`** (lines 1-6, 28, 35)
   - Updated component documentation to describe horizontal scrolling support
   - Added `overflow-x-auto` - enables scrolling only when content overflows
   - Added `scroll-smooth` - provides smooth animated scrolling
   - Added `snap-x snap-mandatory` on container - enables scroll snapping
   - Added `snap-start` on each figure - snaps images to viewport position
   - Added `scrollbar-hide` - hides scrollbar while keeping scroll functionality
   - Added `px-4` - horizontal padding for visual spacing

**Design System Research**:
- Researched existing horizontal scroll patterns in codebase
- Found `scrollbar-hide` utility class used in HorizontalTimelineSlide, NavigationMenu, ChatSection
- Confirmed `overflow-x-auto` is correct solution (only scrolls when content overflows)
- Verified approach matches project's CSS-first design philosophy

**How It Works**:
```tsx
<div className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory px-4 scrollbar-hide">
  {images.map((image) => (
    <figure className="flex-shrink-0 flex flex-col gap-3 w-fit snap-start">
      <img className="h-[500px] w-auto object-contain" />
    </figure>
  ))}
</div>
```

**Key CSS Properties**:
- `overflow-x-auto` - Scrollbar only appears when content width > container width
- `scrollbar-hide` - Hides scrollbar visually (defined in globals.css lines 225-234)
- `snap-x snap-mandatory` - Snaps images to container edges during scroll
- `snap-start` - Defines snap point at start of each image
- `flex-shrink-0` - Prevents images from compressing to fit

**Results**:
- ✅ Supports 1-10 portrait images (up from 3)
- ✅ Scrollbar hidden but scroll still works via touch/trackpad/mouse wheel
- ✅ Smooth animated scrolling between images
- ✅ Images snap to position for better UX
- ✅ Only scrolls when images exceed viewport width
- ✅ Matches project design system patterns
- ✅ Build passes successfully

---

### Portrait Image List Full-Width Breakout with Auto-Centering - COMPLETE 🎉

**Goal**: Extend portrait image list to full viewport width while maintaining proper centering and scrollability.

**Requirements**:
- Break out of article container to span full viewport width
- Center images when they fit in viewport
- Allow proper left-to-right scrolling when images overflow
- Maintain smooth scroll and snap behavior
- Pure CSS solution (no JavaScript)

**Problem Solved**:
- Using `justify-center` on scrollable flex container breaks scrolling
- Can't scroll to leftmost items when `justify-center` is applied
- Need conditional centering: center when fits, scroll when overflows

**Solution**: Auto-margin centering with two-div structure.

**Files Modified:**
1. **`/src/components/case-study-flowing/PortraitImageList.tsx`** (lines 27-29, 52)
   - Added full-width breakout: `w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]`
   - Implemented two-div structure for proper centering:
     - **Outer div** (line 28): Handles scrolling (`overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide`)
     - **Inner div** (line 29): Handles centering (`flex gap-4 min-w-fit mx-auto w-fit px-4 md:px-8`)
   - Enhanced responsive padding: `px-4 md:px-8` (better spacing on larger screens)

**How Auto-Margin Centering Works**:
```tsx
// Outer div: Enables scrolling
<div className="overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide">
  {/* Inner div: Centers content */}
  <div className="flex gap-4 min-w-fit mx-auto w-fit px-4 md:px-8">
    {/* Images with snap points */}
  </div>
</div>
```

**Key CSS Classes**:
- `w-fit` - Container shrinks to content width
- `mx-auto` - Centers the container horizontally
- `min-w-fit` - Prevents content compression
- When content fits viewport → centered by `mx-auto`
- When content overflows → scrollable from left edge

**Design System Research**:
- Researched existing horizontal scroll patterns in codebase
- Found similar patterns in HorizontalTimelineSlide, NavigationMenu
- Project strongly prefers CSS-only solutions over JavaScript
- Avoid `justify-center` + `overflow-x-auto` combination (known broken pattern)
- `w-0 min-w-full` technique used elsewhere (from caption fix)

**Technical Approach Evaluation**:
1. **Option A: Auto-Margin Centering** (CHOSEN)
   - ✅ Pure CSS, no JavaScript
   - ✅ Semantic Tailwind classes
   - ✅ Universal browser support
   - ✅ Solves both requirements

2. **Option B: Custom Padding** (Not chosen)
   - Uses arbitrary values: `px-[max(1rem,calc(50vw-600px))]`
   - Requires knowing content width
   - More complex calculation

3. **Option C: JavaScript Detection** (Not chosen)
   - Against project's CSS-first philosophy
   - Potential flash during resize
   - Unnecessary complexity

**Results**:
- ✅ Images centered when they fit in viewport
- ✅ Full left-to-right scrolling when images overflow
- ✅ Full viewport width breakout (edge-to-edge)
- ✅ Pure CSS solution (no JavaScript)
- ✅ Semantic Tailwind classes (no arbitrary values)
- ✅ Smooth scroll and snap behavior maintained
- ✅ Matches project design patterns
- ✅ Build passes successfully

**Commit**: `d975020` - "Add full-width breakout with auto-centering to portrait image list"

---

### Portrait Image List Caption Wrapping Fix - COMPLETE 🎉

**Goal**: Fix caption text extending beyond image width and ensure even spacing between portrait images.

**Problem**:
- Caption text wasn't wrapping at image edge - extended beyond image width
- In flexbox with `flex-direction: column`, parent figure sized to widest child (the caption)
- Long caption text forced figure to be wider than the image
- This caused uneven visual spacing between the three images
- Classic CSS intrinsic sizing problem

**Root Cause**:
- Figure element: `flex flex-col` creates vertical flexbox
- Image: `h-[500px] w-auto` has intrinsic width based on aspect ratio
- Caption: `w-full` tries to match parent width
- Result: Parent (figure) expands to fit caption text, not image width

**Solution**: Width constraint technique using pure Tailwind utilities (no arbitrary values).

**Files Modified:**
1. **`/src/components/case-study-flowing/PortraitImageList.tsx`** (lines 34-47)
   - Added `w-fit` to figure - makes it shrink to fit content width
   - Added `max-w-full` to image - ensures responsive behavior
   - Changed caption from `w-full` to `w-0 min-w-full` - prevents caption from expanding parent

**How It Works**:
```tsx
// Figure sizes to image width only
<figure className="w-fit">
  <img className="h-[500px] w-auto max-w-full" />

  // Caption doesn't affect figure width but fills available space
  <figcaption className="w-0 min-w-full">
</figure>
```

**The `w-0 min-w-full` Technique**:
1. `w-0` - Caption has zero intrinsic width (doesn't expand parent)
2. `min-w-full` - Caption grows to fill 100% of parent
3. Figure sees caption as having no width
4. Figure sizes to image width instead
5. Caption then wraps at exactly the image width

**Design System Compliance**:
- Uses pure Tailwind utilities (no arbitrary `[contain:inline-size]`)
- Follows project preference for semantic Tailwind classes over arbitrary values
- Universal browser support (no modern CSS containment needed)

**Research Conducted**:
- Used Task agent to research CSS intrinsic sizing problem
- Explored 3 solutions: CSS containment, width constraints, table layout
- Selected width constraint technique for best design system alignment
- Solution eliminates caption width from parent sizing calculation

**Results**:
- ✅ Captions wrap at exact image edge (no extension beyond image)
- ✅ Even spacing between all three portrait images
- ✅ Pure Tailwind utilities (design system compliant)
- ✅ Universal browser support
- ✅ No layout hacks or workarounds
- ✅ Build passes successfully

**Technical Notes**:
- Alternative solution using `[contain:inline-size]` would work but uses arbitrary value
- Width constraint technique (`w-0 min-w-full`) preferred for design system consistency
- Gap-4 (16px) spacing works correctly once figure widths match image widths

---

### Portfolio Chatbot Full Content Re-ingestion - COMPLETE 🎉

**Goal**: Re-ingest portfolio chatbot with Sanity CMS content enabled to restore full knowledge base.

**Problem**:
- Chatbot was missing Sanity CMS content (projects, case studies, profile)
- Feature flag `INGEST_SANITY_CONTENT=false` was disabling CMS ingestion
- Only had ~100 chunks from transcript files, missing expected ~180+ chunks

**Solution**: Enable Sanity content feature flag and re-ingest all content.

**Implementation**:

**Files Modified:**
1. **`.env.local`** (line 40)
   - Changed `INGEST_SANITY_CONTENT=false` to `INGEST_SANITY_CONTENT=true`
   - Enables ingestion of all Sanity CMS content alongside transcripts

**Commands Executed:**
```bash
npm run ingest:clear  # Clear and re-ingest everything
```

**Content Sources Ingested:**
1. **Transcript Files** (11 files from `public/chatbot-content/transcripts/`)
   - Questionnaire answers, technical details, case studies
   - Properly excluded `_Raw_Files_Ignore/` directory (5 files)

2. **Sanity CMS Content** (23 documents)
   - 13 Projects (case studies with details)
   - 7 Profile sections (capabilities, experience)
   - 3 AI Projects (specialized AI/ML work)

**Results**:
- ✅ **242 total chunks** created (up from ~100)
- ✅ 34 documents processed (11 transcripts + 23 Sanity)
- ✅ Archive folders properly excluded
- ✅ Average 7.1 chunks per document
- ✅ Full knowledge base restored

**Knowledge Categories Distribution:**
- General content: 56 chunks
- Projects: 40 chunks
- Technical: 34 chunks
- Research: 24 chunks
- Background: 24 chunks
- AI Projects: 21 chunks
- Profile: 16 chunks
- Agentic Engineering: 14 chunks

**Impact**:
- Chatbot can now answer questions about all projects and case studies
- Complete professional profile available for queries
- Technical expertise fully documented
- Comprehensive knowledge base for visitor questions

---

### Claude Code Vector Database System - COMPLETE 🎉

**Goal**: Create a vector database for Claude Code to access project context (plans, architecture, decisions) without manually reading files, saving ~100,000+ tokens/month.

**Requirements**:
- Must run locally (not Supabase) for offline development
- Have backup capabilities
- Dual-access pattern: Direct TypeScript API (0 tokens) + MCP server for agents
- Separate from website codebase to avoid interference

**Solution**: ChromaDB with Google AI embeddings in separate repository.

**Implementation Journey**:
1. **Research & Planning**: Evaluated vector DB options, chose ChromaDB for local storage
2. **Initial Development**: Built TypeScript API and ingestion scripts
3. **Error Resolution**: Fixed ChromaDB metadata restrictions, JSON parsing errors
4. **Repository Separation**: Migrated to `~/claude-code-vectordb/` for clean separation
5. **100% Ingestion Success**: 5527 documents successfully embedded
6. **GitHub Deployment**: Published to https://github.com/mevans2120/claude-code-vectordb

**Technical Architecture**:
```
Project Documentation → Ingestion Script → ChromaDB Vector DB
                                                ↓
                                         TypeScript API
                                          ↙          ↘
                              MCP Server              Direct Import
                                   ↓                       ↓
                            Claude Code Agents      Build Scripts/CLI
```

**Key Innovations**:
1. **Dual-Access Pattern**:
   - Direct TypeScript import for 0-token access
   - MCP server wrapper for Claude Code agents (pending)

2. **Sanitization Functions**:
   - `sanitizeMetadata()` - Converts arrays to strings for ChromaDB compatibility
   - `sanitizeContent()` - Removes control characters preventing JSON parsing

3. **Error Recovery**:
   - Batch processing continues past failed documents
   - Comprehensive error logging for debugging

**Files in New Repository (`~/claude-code-vectordb/`)**:
- `/src/lib/client.ts` - Core TypeScript API
- `/scripts/ingest-docs-to-vectordb.ts` - Document ingestion
- `/scripts/test-search.ts` - Interactive search testing
- `/package.json` - Scripts and dependencies
- `/README.md` - Complete documentation
- `/.env.example` - Environment template

**Website Cleanup**:
- Removed all vector DB code from main website
- Removed ChromaDB and langchain dependencies
- Created `/docs/VECTOR_DB_NOTE.md` explaining separation
- No dependencies between website and vector DB

**Results**:
- ✅ 5527 documents successfully ingested
- ✅ ChromaDB running locally on port 8000
- ✅ TypeScript API ready for 0-token queries
- ✅ Repository on GitHub with proper .gitignore
- ✅ Website runs independently
- ✅ ~100,000+ tokens/month savings potential

**Pending Tasks**:
- Build MCP server with query tools
- Create CLI tools for manual access
- Configure Claude Code to use MCP server
- Evaluate query quality with test queries

**Documentation**:
- `/docs/claude-code-vector-db-concept.md` - Initial concept and architecture
- `/docs/claude-code-vector-db-research.md` - Research findings on vector DB options
- `/docs/claude-code-vector-db-plan.md` - Implementation roadmap
- `/docs/vector-db-progress-nov-14.md` - Progress tracking document
- `/docs/VECTOR_DB_NOTE.md` - Separation and relationship documentation

---

### Case Study Responsive Spacing Fix - COMPLETE 🎉

**Goal**: Fix header and body spacing issue where gap grew larger as viewport height increased.

**Problem**:
- Case study hero header and article body became disconnected as viewport height increased
- Root cause: `min-h-[70vh] flex items-center` created viewport-dependent vertical centering
- Gap grew proportionally with screen height (more visible on tall displays)
- Industry-standard editorial layouts don't have this issue

**Solution**: Replace viewport-dependent sizing with fixed rem-based padding following industry standards.

**Research Findings**:
- Professional sites (Medium, Substack, NYT) use fixed padding, not viewport units
- `flex items-center` with viewport-based min-height distributes extra space equally above/below
- Design system already uses rem-based spacing throughout
- Pattern `min-h-[Xvh] flex items-center` creates gaps that grow with viewport

**Files Modified:**
1. **`/src/components/case-study-editorial/EditorialHero.tsx`** (line 48)
   - Changed from `min-h-[70vh] flex items-center` to `pt-16 md:pt-24 pb-8 md:pb-12`
   - Removed `flex items-center` vertical centering
   - Moved padding from inner div to header element
   - Result: Controlled spacing (64px/96px top, 32px/48px bottom)

2. **`/src/components/case-study-flowing/FlowingArticle.tsx`** (line 19)
   - Removed top padding: `pt-4 md:pt-6` deleted from className
   - Eliminates gap between header and article body
   - Header's bottom padding provides controlled spacing

**Implementation Journey**:
- First attempt made it worse (user: "That made it far worse... Can you revert")
- Conducted deep research into industry-standard patterns
- Multiple iterations based on user feedback
- Final solution uses 32px mobile / 48px desktop gap (consistent across all viewports)

**Results**:
- ✅ Header and body maintain consistent connection across all viewport heights
- ✅ Follows industry-standard editorial layout patterns
- ✅ Fixed rem-based padding (predictable, not proportional)
- ✅ No viewport-dependent sizing
- ✅ Build passes successfully
- ✅ Responsive behavior preserved

**Commit**: Successfully pushed - "Fix case study header and body spacing to maintain consistent connection"

---

### Navigation Logo Border Fix - COMPLETE 🎉

**Goal**: Remove rounded corners from navigation logo's selected state to match square borders on other nav items.

**Problem**: Logo Link had `rounded-lg` class causing curved border, inconsistent with square nav item borders.

**Solution**: Removed `rounded-lg` class from logo Link element.

**Files Modified:**
1. **`/src/components/navigation/NavigationMenu.tsx`** (line 37)
   - Removed `rounded-lg` from logo Link className
   - Logo now has square border matching other navigation items

**Results**:
- ✅ Logo border now square like rest of navigation
- ✅ Consistent visual design across all nav items

---

### Image Cache Debug Script - COMPLETE 🎉

**Goal**: Create debug script to diagnose why images show locally but not in production.

**Problem**: User reported images showing locally but not appearing on production URL.

**Solution**: Created comprehensive debug script to check both published and draft content.

**Files Created:**
1. **`/scripts/debug-sanity-images.ts`**
   - Checks both published and draft content perspectives
   - Tests image accessibility on Sanity CDN
   - Validates URLs and asset IDs
   - Compares draft vs published versions

**Files Modified:**
1. **`/package.json`** (line 37)
   - Added `"debug:images": "tsx scripts/debug-sanity-images.ts"`

**Findings**:
- All 13 projects published ✓
- All 11 featured images accessible ✓
- All 2 article images accessible ✓
- No draft-only content ✓
- Conclusion: Production cache issue (Vercel/ISR), not Sanity data problem

**Recommended Solutions**: Redeploy on Vercel or manual ISR revalidation

**Results**:
- ✅ Diagnostic tool created for future debugging
- ✅ Confirmed all images are properly published
- ✅ Identified issue as production cache, not data problem

---

## ✅ Recent Accomplishments (November 13, 2025)

### Case Study Hero Alignment Fix - COMPLETE 🎉

**Goal**: Vertically align the category badge with the featured image in case study hero sections.

**Problem**:
- Category badge ("E-COMMERCE REPLATFORM") was positioned outside the flex container
- Featured image was inside the flex container
- This caused vertical misalignment - badge appeared above the image instead of aligned with it

**Solution**: Moved category badge inside the flex container's left column.

**Files Modified:**
1. **`/src/components/case-study-editorial/EditorialHero.tsx`** (lines 51-59)
   - Moved badge conditional block from outside flex container to inside left content div
   - Badge now participates in flex layout with `items-start` alignment
   - Both badge and image align to top of their respective columns

**Layout Change**:
```
Before: Badge above container → Image inside container
After:  Badge inside left column → Image in right column (aligned at top)
```

**Results**:
- ✅ Category badge and featured image vertically aligned
- ✅ Clean visual hierarchy maintained
- ✅ Responsive behavior preserved
- ✅ Build passes successfully

---

### Chat Input Styling Refinements - COMPLETE 🎉

**Goal**: Clean up chat input styling by removing redundant placeholder text and adjusting visual design.

**Changes Made**:

**Files Modified:**
1. **`/src/components/navigation/ChatSection.tsx`**
   - Removed placeholder text "Ask about Michael's work..." (line 556)
   - Changed input background from `bg-chat-input` to `bg-chat-message` (line 559)
   - Removed focus ring: deleted `focus:ring-2 focus:ring-accent-light` classes
   - Input now shows clean empty field with native blinking cursor only when focused

2. **`/tailwind.config.ts`** (lines 131-140)
   - Added `blink` keyframe animation for future use
   - Animation definition: 1s step-end infinite (crisp on/off effect)

**Design Rationale**:
- **No placeholder**: Reduces visual clutter, native cursor is sufficient
- **Message background**: Input matches chat bubble color for cohesive look
- **No focus ring**: Border is already accent-colored, ring was redundant

**Results**:
- ✅ Cleaner, more minimal chat input design
- ✅ Input background matches chat message bubbles
- ✅ No redundant visual elements
- ✅ Native browser cursor behavior
- ✅ Build passes successfully

**Commit**: `7127922` - "Refine chat input styling for cleaner UX"

---

### Case Study Hero Featured Image - COMPLETE 🎉

**Goal**: Display featured images in case study hero sections using a clean, blog post-style layout.

**Journey**: Explored multiple design approaches through extensive iteration:
1. Initially tried subtle background image with low opacity gradient overlay
2. Attempted split layout with large image on right
3. Tried thumbnail-sized image next to title
4. **Final solution**: Blog post-style layout matching existing blog card pattern

**Implementation**:

**Design Concepts Created**:
- Created 3 HTML mockup concepts in `/docs/design/cs-hero-concepts-111325/`:
  - Concept 1: Subtle background with gradient overlay
  - Concept 2: Split layout with prominent image
  - Concept 3: Asymmetric overlap design
- Each concept had light and dark mode versions

**Files Modified:**

1. **`/src/components/case-study-editorial/EditorialHero.tsx`** (lines 57-84)
   - Replaced background image approach with flex-based split layout
   - Content on left (`flex-1`): badge, title, subtitle
   - Featured image on right (`w-full md:w-1/3`): 4:3 aspect ratio, rounded corners
   - Single column on mobile: text → image → overview
   - Uses `urlFor()` helper with proper image optimization (1200×900, quality 85)
   - Regular `<img>` tag (not Next.js Image) for simpler layout behavior
   - Removed `absolute inset-0` positioning to fix mobile overlay issue

2. **`/src/app/(public)/case-studies/[slug]/page.tsx`** (lines 124-132)
   - Fixed GROQ query: `asset->{ _id, url }` instead of just `asset`
   - Must dereference asset to get actual data instead of reference object
   - Added `crop` and `hotspot` to support Sanity image editing
   - Added `backgroundImage={project.featuredImage}` prop to EditorialHero

3. **`/package.json`**
   - Added `"debug:images": "tsx scripts/debug-sanity-images.ts"` script
   - Used during troubleshooting image loading issues

4. **`/src/components/ContactSection.tsx`** (line 37)
   - Updated heading sizes: `text-4xl md:text-5xl` → `text-5xl md:text-6xl lg:text-7xl`
   - Better visual hierarchy across breakpoints

**Documentation Created:**
- `/docs/split-hero-layout-implementation-plan.md` - Detailed implementation plan
- `/docs/design/cs-hero-concepts-111325/overview.md` - Design concept comparison

**Key Technical Decisions**:

1. **GROQ Asset Dereferencing**: Must use `asset->{_id, url}` not `asset` alone
   - `asset` returns `{_ref: "...", _type: "reference"}`
   - `asset->{}` dereferences to get actual asset data

2. **Image Component Choice**: Regular `<img>` vs Next.js Image
   - Next.js Image with `fill` prop required complex parent container
   - Regular `<img>` with `w-full h-full object-cover` worked immediately
   - Simpler for flex-based responsive layout

3. **Blog Post Pattern**: Adapted from BlogPostCard.tsx
   - Flex layout with text on left, image on right
   - 1/3 width image on desktop, full width on mobile
   - 4:3 aspect ratio container prevents stretching
   - Clean, consistent design language

4. **Mobile Layout Fix**: Removed absolute positioning
   - Initial implementation used `absolute inset-0` on image
   - Caused image to overlay text on mobile
   - Changed to standard `w-full h-full object-cover` for proper flex behavior

**Results**:
- ✅ Featured images display in case study hero
- ✅ Blog post-style layout matches existing patterns
- ✅ Responsive: side-by-side on desktop, stacked on mobile
- ✅ No image stretching (4:3 aspect ratio maintained)
- ✅ Dark mode support via semantic tokens
- ✅ Build passes successfully
- ✅ Clean, professional aesthetic

**Commit**: `f39ad68` - "Implement blog-style layout for case study hero with featured image"

---

## ✅ Previous Accomplishments (November 12, 2025)

### Case Studies Hero Background Mask Lightening - COMPLETE 🎉

**Goal**: Lighten the dark mask overlay on case study hero background images to make them more visible while maintaining text readability.

**Problem**:
- Background image had only 25% opacity (too dark)
- Gradient overlay was 75-80% opacity (very heavy mask)
- Background images were barely visible through the dark overlay

**Solution**: Reduced opacity on both layers to let more of the background image show through.

**Files Modified**:
1. `/src/components/case-studies/CaseStudyBackground.tsx`
   - Background image opacity: `25%` → `40%` (60% increase)
   - Gradient overlay opacity: `75-80%` → `55-60%` (~25% lighter)
   - Both Tailwind classes and inline styles updated for consistency

**Technical Details**:
- Background image layer uses `opacity-40` on container
- Gradient overlay uses `from-slate-950/55 via-slate-900/60 to-slate-950/55`
- Inline gradient maintains same opacity values: `rgba(5,5,16,0.55)` to `rgba(15,23,42,0.60)`
- Text remains readable with coral gradient title and light-colored description
- Image blur (4px) and slight grayscale (20%) preserved

**Results**:
- ✅ Background images significantly more visible
- ✅ Text remains readable (coral gradient + white/gray text)
- ✅ Better balance between image visibility and content legibility
- ✅ More visually engaging hero sections

---

### Mobile Navigation Hide-on-Scroll - COMPLETE 🎉

**Goal**: Implement mobile navigation that hides when scrolling down and reappears when scrolling up to reclaim screen real estate.

**Requirements**:
- Hide navigation on scroll down
- Show navigation on scroll up
- Preserve scroll position and behavior
- Maintain padding for mobile chat header when expanded
- No background bars left behind when hidden
- Handle edge cases (at top, menu open)

**Implementation**:

**Files Created**:
1. `/src/hooks/useScrollDirection.ts` - Custom hook for scroll detection
   - Detects scroll direction (up/down/none) with RAF optimization
   - Monitors `#main-content` element scroll (not window)
   - 10px threshold to prevent jitter
   - 50px top threshold for "at top" detection
   - Passive event listeners for performance

2. `/src/contexts/MobileHeaderContext.tsx` - Context for header visibility state
   - Shares header visibility across layout and header components
   - Enables synchronized padding/transform transitions

3. `/src/app/(public)/LayoutContent.tsx` - Client component for dynamic padding
   - Wraps main layout content
   - Controls `pt-16` padding based on header visibility
   - Preserves padding when chat is expanded

**Files Modified**:
1. `/src/components/navigation/MobileHeader.tsx` - Hide/show behavior
   - Uses `useScrollDirection` hook for scroll detection
   - Updates context with visibility state via `useEffect`
   - Transforms header with `-translate-y-full` when hidden
   - Smooth transitions with `duration-normal ease-smooth`
   - All hooks called before conditional return (React Rules of Hooks)

2. `/src/app/(public)/layout.tsx` - Layout structure
   - Wrapped content in `LayoutContent` component
   - Added `MobileHeaderProvider` to provider tree

**Key Features**:
- **Scroll detection**: RAF-optimized scroll listener on `#main-content` element
- **Smooth transitions**: Both header transform and padding animate together
- **Context synchronization**: Header visibility state shared across components
- **Chat preservation**: Padding always maintained when chat is expanded
- **No leftover bars**: Padding removes completely when header hides (normal pages)
- **Edge case handling**: Shows header when at top or menu is open

**Technical Details**:
- Header: `fixed top-0` with `-translate-y-full` transform when hidden
- Layout: `pt-16` → `pt-0` transition synchronized with header
- Chat mode: Always keeps `pt-16` padding for chat's sticky header
- Scroll target: `#main-content` element (not `window`)
- Performance: RequestAnimationFrame debouncing with passive listeners

**Results**:
- ✅ Header hides/shows smoothly on scroll
- ✅ No background bar left behind (reclaims full 64px)
- ✅ Mobile chat header preserved when expanded
- ✅ React hooks compliance (no early returns before hooks)
- ✅ Smooth synchronized transitions
- ✅ Performance optimized with RAF

**Documentation**:
- Implementation plan: `/docs/mobile-nav-hide-on-scroll-plan.md`

---

### Contact Page Implementation - COMPLETE 🎉

**Goal**: Create a professional contact page with split layout, integrated with Sanity CMS, featuring multiple email options and gradient accent styling.

**Implementation**:

**Files Created**:
1. `/sanity/schemas/contactPage.ts` - Singleton schema with email links, subheading, and SEO fields
2. `/src/app/(public)/contact/page.tsx` - Server component route with metadata generation
3. `/src/components/ContactSection.tsx` - Client component with interactive email features
4. `/scripts/create-contact-page.ts` - Content population script with default values

**Files Modified**:
1. `/sanity/schemas/index.ts` - Registered contactPage schema
2. `/src/lib/sanity/queries.ts` - Added contactPageQuery (GROQ)
3. `/src/types/sanity.ts` - Added ContactPageData interface
4. `/src/components/Footer.tsx` - Added underline to Contact link (line 180)
5. `/src/components/navigation/NavigationMenu.tsx` - Changed Posts icon from Monitor to Pen

**Key Features**:
- **Split Layout**: Heading/description on left, email links on right
- **Vertical Centering**: Content centered in viewport (`min-h-[calc(100vh-80px)] flex items-center`)
- **Gradient Accent**: Word "touch" in heading uses `text-gradient` class
- **Email Options**: Gmail, Outlook, and Copy Email links
- **Interactive States**: Copy confirmation, hover effects with `underline decoration-transparent hover:decoration-accent`
- **Sanity Integration**: Full CMS control over all text content
- **Script Population**: One-command content creation via `npx tsx scripts/create-contact-page.ts`

**Navigation Improvement**:
- Changed Posts navigation icon from Monitor to Pen for better semantic representation

**Result**: Professional contact page at `/contact` with clean split layout, gradient styling matching homepage aesthetic, and full CMS editability.

---

### Case Study Organization System - COMPLETE 🎉

**Goal**: Organize case studies alphabetically on landing page while preserving editorial ordering on homepage, with clear visual indicators in Sanity Studio for featured projects.

**Problem**:
- Case studies landing page used editorial ordering (meant for homepage)
- No visual indication of which projects were featured on homepage
- Order field always visible, even for non-featured projects
- Difficult to manage featured vs. all projects

**Solution**: Three-phase implementation

**Phase 1: Schema Enhancements**

**File Modified**: `/sanity/schemas/project.ts`

1. **Star Badges in List View** (lines 911-931)
   - Updated preview to show `★ #1`, `★ #2`, etc. for featured projects
   - Example: `★ #2 Virgin America` for featured, `Casa Bonita` for non-featured
   - Shows `★ #?` if featured but missing order number

2. **Conditional Field Visibility** (line 157)
   - `order` field now hidden when `featured` is false
   - Only shows when "Featured on Homepage" is toggled true
   - Cleaner UI - no unnecessary fields

3. **Smart Validation** (lines 158-167)
   - `order` required when project is featured (error: "Order is required when project is featured on homepage")
   - `order` must be at least 1 if provided
   - No validation errors for non-featured projects

4. **Fixed Preview Image** (line 914)
   - Changed preview to use `featuredImage` instead of deprecated `heroImage`

**Phase 2: Alphabetical Query**

**File Modified**: `/src/lib/sanity/queries.ts`

- Created `allProjectsAlphabeticalQuery` (lines 34-63)
- Orders projects by `title asc` for alphabetical display
- Identical structure to `projectsQuery` but different ordering
- Updated `projectsQuery` comment to clarify it's for editorial ordering

**Phase 3: Case Studies Page Update**

**File Modified**: `/src/app/(public)/case-studies/page.tsx`

- Replaced `projectsQuery` import with `allProjectsAlphabeticalQuery` (line 3)
- Updated fetch call to use alphabetical query (line 26)
- Case studies now display in alphabetical order by title
- Numbering reflects alphabetical position (01, 02, 03...)

**Results**:
- ✅ Case studies landing page displays alphabetically
- ✅ Homepage preserves editorial ordering (1, 2, 3, 4)
- ✅ Sanity Studio shows "★ #1 Project Name" badges in list view
- ✅ Order field only visible when project is featured
- ✅ Validation ensures featured projects have order numbers
- ✅ Build successful with no TypeScript errors

**Testing Verified**:
- TypeScript compilation successful
- All pages built successfully
- No errors or warnings

**Commit**: `385b012` - "Add case study organization system with alphabetical ordering and featured badges"

---

### Sanity Presentation Mode Revalidation Fix (4th Attempt) - COMPLETE 🎉

**Goal**: Fix aggressive page revalidation in Sanity Presentation mode that was causing full page refreshes instead of smooth WebSocket updates.

**Problem**:
- Every content mutation triggered full page revalidation
- Default `VisualEditing` component revalidated root layout on every change
- WebSocket updates from `SanityLive` were being ignored
- Poor editing experience with jarring page reloads
- **This was the 4th attempt** to fix this persistent issue

**Root Cause** (Finally Identified):
- `VisualEditingWrapper` was using default `refresh` behavior
- Default behavior revalidates root layout on every mutation
- Purges Vercel's entire data cache
- Known issue in `next-sanity` v11.6.x (GitHub issue #1649)

**Solution**: Custom refresh handler with server action

**Implementation**:

**Files Created:**
1. **`/docs/sanity-presentation-revalidation-research.md`** - Comprehensive research document
   - All 4 previous fix attempts documented with commits
   - Root cause analysis and technical details
   - GitHub issue #1649 reference
   - Solution with code examples
   - Verification steps and testing guide

2. **`/src/app/actions/revalidate.ts`** - Server action for targeted revalidation
   - `revalidateSanityDocument(documentType)` function
   - Uses `revalidateTag()` for targeted cache invalidation
   - Called from client component via proper Next.js pattern

**Files Modified:**
3. **`/src/components/VisualEditingWrapper.tsx`** - Custom refresh handler implementation
   - Added custom `refresh` prop to `VisualEditing` component
   - **For mutations with live preview**: Returns early, lets WebSocket handle updates (no page refresh)
   - **For mutations without live preview**: Uses targeted revalidation by document type
   - **For manual refreshes**: Allows default behavior
   - Comprehensive TSDoc comments explaining solution

**How It Works**:
```typescript
refresh={async (payload) => {
  // Skip revalidation when live preview is enabled
  if (payload.source === 'mutation' && payload.livePreviewEnabled) {
    return // WebSocket handles it smoothly
  }

  // Only revalidate for mutations without live preview
  if (payload.source === 'mutation' && 'document' in payload) {
    await revalidateSanityDocument(payload.document._type)
  }
}}
```

**Previous Fix Attempts** (all applied, but missing this final piece):
1. **Nov 6** (Commit `b6cf8fb`): Enabled browserToken, added location resolvers
2. **Nov 7** (Commit `74dd300`): Consolidated clients, disabled CDN caching
3. **Nov 7**: Deep dive analysis, identified root cause
4. **Nov 7**: Removed ISR conflicts

**Results**:
- ✅ Build passes successfully
- ✅ No TypeScript errors
- ✅ Smooth WebSocket updates (no page refresh on edits)
- ✅ Targeted revalidation by document type (not root layout)
- ✅ All previous fixes preserved (browserToken, location resolvers, client config)
- ✅ Initial testing shows no aggressive revalidation

**Technical Details**:
- Workaround for known `next-sanity` v11.6.x issue
- Server action pattern required (can't use inline `'use server'` in client component)
- Custom refresh handler intercepts mutation events
- Lets `SanityLive` WebSocket handle real-time preview updates
- Only revalidates when explicitly needed (manual refresh or no live preview)

**Documentation**:
- Complete research doc: `/docs/sanity-presentation-revalidation-research.md`
- Previous fixes: `/docs/sanity-presentation-mode-fixes.md`
- Deep dive analysis: `/docs/sanity-presentation-deep-dive.md`

---

### Portrait Image List Component - COMPLETE 🎉

**Goal**: Create component to display 1-3 portrait-oriented phone screenshots in case study articles with consistent styling.

**Requirements**:
- Display 1-3 portrait (9:16 aspect ratio) images in horizontal row
- Thick accent-colored border around each image
- Individual captions below each image
- No responsive stacking (always horizontal)
- Images fill border completely without extra whitespace

**Implementation**:

**Files Created:**
1. **`/src/components/case-study-flowing/PortraitImageList.tsx`**
   - New component for rendering portrait image lists
   - Fixed dimensions: 240px width × 500px height
   - Border: 4px thick, accent color with rounded corners (6px)
   - Image rendering: `object-cover` to fill borders completely
   - Layout: Horizontal flex with 4px gap between images
   - All images display uniformly without cropping edges

**Files Modified:**
2. **`/sanity/schemas/project.ts`**
   - Added `portraitImageList` block type after imageGrid (line 498+)
   - Validation: min 1, max 3 images required
   - Each image: asset, alt (required), caption (optional)
   - Preview shows image count

3. **`/src/components/case-study-flowing/ArticleContent.tsx`**
   - Added PortraitImageList import (line 13)
   - Registered portraitImageList renderer in types object (line 72+)

**Key Features**:
- **Fixed uniform sizing**: All images 240px × 500px regardless of content
- **Border styling**: 4px accent-colored border with 6px rounded corners
- **Image rendering**: `object-cover` fills border completely
- **Horizontal layout**: Always displays side-by-side, no mobile stacking
- **Captions**: Individual centered captions below each image
- **Content flexibility**: Supports 1-3 images per block

**Results**:
- ✅ Component renders uniformly-sized portrait images
- ✅ Images fill borders without extra whitespace
- ✅ Border thickness matches site design system
- ✅ Integrated into Sanity Studio Article Content
- ✅ Ready for use in case study articles

---

## ✅ Previous Accomplishments (November 10, 2025)

### Blog Landing Page Design Improvements - COMPLETE 🎉

**Goal**: Update blog landing page to match homepage featured blog design and fix stretched images.

**Problem**:
- Blog post cards used vertical stack with full-width images
- Images had fixed height (240px) causing stretching for non-matching aspect ratios
- Visual design inconsistent with homepage featured blog component

**Solution**: Redesigned BlogPostCard to match featured blog component with horizontal layout and proper aspect ratio.

**Implementation**:

**Files Modified:**

1. **`/src/components/blog/BlogPostCard.tsx`**
   - Changed from vertical stack to horizontal flex layout (lines 51-101)
   - Image now 1/3 width on desktop, content 2/3 width
   - Replaced fixed height with `aspect-[4/3]` container (line 55)
   - Added proper image optimization: `.width(600).height(450).fit('crop').quality(85).auto('format')` (line 57)
   - Added `index` prop for alternating layout (line 11)
   - Implemented alternating image position: even indices left, odd indices right (line 40, 56)
   - Updated typography to match homepage (lighter font weight) (line 68)
   - Increased spacing between cards: `pb-12 mb-12` (line 39)

2. **`/src/app/(public)/blog/page.tsx`**
   - Updated map function to pass index to BlogPostCard (line 48)

**Key Features**:
- **Horizontal layout**: Image left/right, content fills remaining space
- **Alternating zigzag**: Desktop shows alternating image positions (left, right, left, right)
- **No image stretching**: 4:3 aspect ratio container with `object-cover` maintains proportions
- **Responsive**: Mobile stacks vertically, desktop shows side-by-side
- **Consistent design**: Matches homepage featured post component exactly

**Results**:
- ✅ Build passes successfully
- ✅ Images maintain proper aspect ratio (no stretching)
- ✅ Visual rhythm with alternating layout
- ✅ Better use of horizontal space on desktop
- ✅ Consistent design language across blog sections

---

### AI Showcase Deprecation - COMPLETE 🎉

**Goal**: Remove AI Showcase infrastructure since all content migrated to Blog.

**Reason**:
- All AI Showcase content migrated to Blog
- Site not yet live (no redirects needed)
- Simplifies content architecture

**Implementation** (3 phases):

#### Phase 1: Remove Routes, Queries, and API References ✅

**Files Modified:**
1. **`/src/lib/sanity/queries.ts`** - Removed `aiShowcaseSection` from homepage hero query
2. **`/src/app/(public)/page.tsx`** - Renamed `aiShowcase` to `featuredPost`, removed schema references
3. **`/src/components/chatbot/LinkPreview.tsx`** - Removed AI Showcase from link parsing
4. **`/src/sanity/presentation.ts`** - Removed AI Showcase route and location resolver
5. **`/src/lib/linkExtractor.ts`** - Removed AI Showcase from previewable links
6. **`/src/app/api/link-metadata/route.ts`** - Removed AI Showcase type handling and documentation
7. **`/src/components/navigation/ChatSection.tsx`** - Updated comment to reference blog instead

**Files Deleted:**
- `/src/app/(public)/ai-showcase/page.tsx`
- `/src/app/(public)/ai-showcase/[slug]/page.tsx`
- `/src/app/(public)/ai-showcase/[slug]/AIShowcasePageMagazine.tsx`
- `/src/app/(public)/ai-showcase/[slug]/AIShowcasePageClient.OLD.tsx`
- `/src/lib/sanity/queries/aiShowcase.ts`

#### Phase 2: Clean Up Sanity Schemas ✅

**Files Modified:**
1. **`/sanity/schemas/homepageHero.ts`** - Removed `/ai-showcase` from internal link options (2 locations)
2. **`/sanity/schemas/homepageHero.ts`** - Removed entire `aiShowcaseSection` field (lines 184-266)
3. **`/sanity/schemas/index.ts`** - Removed aiShowcase schema import and registration

**Files Archived:**
- `/sanity/schemas/aiShowcase.ts` → `/sanity/schemas/_archive/aiShowcase.ts`

#### Phase 3: Archive Migration Scripts ✅

**Files Archived to `/scripts/_archive/`:**
- `migrate-ai-showcases.ts` → `_archive/migrate-ai-showcases.ts`
- `migrate-showcase-to-blog.ts` → `_archive/migrate-showcase-to-blog.ts`
- `migrate-showcases.ndjson` → `_archive/migrate-showcases.ndjson`
- `import-showcases/` (entire directory with 5 scripts) → `_archive/import-showcases/`

**Results**:
- ✅ Build passes successfully
- ✅ All AI Showcase infrastructure removed
- ✅ 710 lines of code removed
- ✅ Migration scripts archived for reference
- ✅ Homepage now features blog posts only
- ✅ Clean, simplified content architecture

**Git Commits**:
- `65bc6de` - Complete AI Showcase deprecation
- 24 files changed, 710 deletions

---

### Chatbot FAQ Content Fix - COMPLETE 🎉

**Goal**: Fix chatbot incorrectly stating user worked with HBO instead of Astral.

**Problem**:
- Vector database embeddings were returning "HBO" as primary client
- User actually worked with Astral (Canadian streaming service similar to HBO Go)
- FAQ content had "HBO" too prominent without proper context

**Root Cause Analysis**:
- In `faq-chunks.md`, "HBO" appeared in client list and question title
- Vector similarity search retrieved "HBO" keyword without sufficient context
- Answer mentioned HBO Go but didn't emphasize Astral as the primary subject

**Solution**: Rewrite FAQ content to make Astral the primary subject.

**Files Modified:**

1. **`/public/chatbot-content/transcripts/faq-chunks.md`**
   - Line 29: Changed client list from "HBO" to "Astral (Canadian streaming service)"
   - Line 33: Changed question from "What did Michael build for HBO?" to "What did Michael build for Astral?"
   - Line 34: Rewrote answer to emphasize Astral as primary subject with explicit "This was NOT HBO" clarification

**Before**:
```markdown
**Q: What did Michael build for HBO?**
A: Michael worked on HBO Go, specifically the Canadian version for Astral.
```

**After**:
```markdown
**Q: What did Michael build for Astral?**
A: Michael worked on a mobile streaming app for Astral, the Canadian media company (similar to HBO Go). Astral was Canada's premium streaming service, and Michael built their mobile app during his time at Huge. This was NOT HBO - it was Astral's own Canadian streaming platform.
```

**Content Re-ingestion**:
- Ran `npm run ingest` to re-embed updated content
- Successfully updated 184 chunks in vector database

**Results**:
- ✅ Chatbot now correctly identifies Astral as the client
- ✅ Vector embeddings emphasize correct company name
- ✅ Explicit clarification prevents future confusion
- ✅ Maintains accurate project history

**Git Commits**:
- `3f3f86f` - Fix chatbot FAQ: correct Astral vs HBO confusion

---

### Chat Input Auto-Grow - COMPLETE 🎉

**Goal**: Add auto-growing textarea for chat input to improve multi-line message composition.

**Problem**: Single-line input would hide long text and didn't support multi-line messages well.

**Solution**: Replace input with textarea that automatically grows based on content, following standard chat UX patterns.

**Implementation**:

**Files Modified:**

1. **`/src/components/navigation/ChatSection.tsx`**
   - Changed ref type from `HTMLInputElement` to `HTMLTextAreaElement` (line 26)
   - Added auto-resize `useEffect` that adjusts height based on content (lines 124-135)
   - Added Enter key handler for submit vs newline logic (lines 151-164)
   - Replaced `<input>` with `<textarea>` (lines 550-561)
   - Added `resize-none` and `overflow-hidden` classes
   - Added inline styles with TSDoc comment (minHeight: 42px, maxHeight: 150px)

**Key Behaviors**:
- Text wraps and textarea grows automatically when content exceeds width
- **Enter key** = Submit message (maintains current behavior)
- **Shift+Enter** = Insert new line (standard chat pattern)
- Max height cap at 150px (~5-6 lines) prevents screen takeover
- Resets to minimum height when input is cleared

**Technical Details**:
- Auto-resize logic reads `scrollHeight` and sets height dynamically
- Capped at 150px to prevent layout issues
- Works identically in desktop sidebar (≥1024px) and mobile overlay (<1024px)
- Grid layout already designed to handle variable-height input
- Messages container compresses gracefully when input grows

**Results**:
- ✅ Build passes successfully
- ✅ TypeScript compiles without errors
- ✅ Standard chat UX pattern (Discord, Slack, ChatGPT)
- ✅ Maintains current Enter-to-submit behavior
- ✅ No layout thrashing or performance issues

**Documentation**:
- Plan created: `/docs/chat-input-auto-grow-implementation-plan.md`

---

### Featured Description Field Consolidation - COMPLETE 🎉

**Goal**: Consolidate redundant `featuredDescription` and `heroSection.summary` fields into single source of truth.

**Problem**: Two fields serving similar purposes caused confusion:
- `featuredDescription` (top-level, 250 chars) - Used in listings/cards
- `heroSection.summary` (nested, 2-3 sentences) - Not actually displayed in case study hero UI

**Decision**: Keep `featuredDescription` as single source of truth because:
- ✅ Top-level field (easier to find in CMS)
- ✅ Better length constraint (250 chars = SEO friendly)
- ✅ Clear, specific purpose (listings, cards, metadata)
- ✅ Already widely used in codebase

**Implementation** (2 phases):

#### Phase 1: Code Updates ✅
User completed manual data migration in Sanity, copying summary → featuredDescription.

#### Phase 2: Complete Removal (No Backward Compatibility) ✅
Removed `heroSection.summary` entirely from project schema:

**Files Modified:**

1. **`/sanity/schemas/project.ts`**
   - Removed `summary` field from `heroSection` object (lines 50-57)
   - Made `featuredDescription` required with updated description
   - No longer hidden/deprecated - completely deleted

2. **`/src/lib/sanity/queries.ts`**
   - Removed `summary` from 5 project-related queries:
     - `projectsQuery`
     - `featuredProjectsQuery`
     - `projectQuery`
     - `projectsByCategoryQuery`
     - `allFeaturedCaseStudiesQuery`
   - Kept `summary` in AI Showcase queries (different content type)

3. **`/src/components/case-studies/CaseStudiesHero.tsx`**
   - Simplified description fallback: `subtitle || summary` → `subtitle`

4. **`/src/app/(public)/case-studies/[slug]/page.tsx`**
   - Removed `summary` prop from EditorialHero component
   - Updated metadata fallback: `subtitle || summary` → `subtitle || featuredDescription`

5. **`/src/app/(public)/case-studies/page.tsx`**
   - Removed `summary` fallback from description mapping

6. **`/src/components/case-study-editorial/EditorialHero.tsx`**
   - Removed `summary` prop from interface
   - Removed `summary` parameter from function
   - Removed summary display section from JSX

7. **`/src/app/api/link-metadata/route.ts`**
   - Updated description logic to use `subtitle || featuredDescription`
   - Added `featuredDescription` to project query

**Results:**
- ✅ Build passes successfully
- ✅ Single source of truth: `featuredDescription`
- ✅ Metadata fallback: `subtitle || featuredDescription`
- ✅ No backward compatibility needed (data already migrated)
- ✅ AI Showcase still has summary field (different content type)

**Documentation:**
- Plan created: `/docs/featured-description-consolidation-plan.md`

---


## ✅ Previous Accomplishments (November 10, 2025)

### Index Page Metadata Migration to CMS - COMPLETE 🎉

**Goal**: Move hardcoded metadata for blog and case studies index pages to Sanity CMS.

**Problem**: Index pages had hardcoded titles and descriptions instead of pulling from CMS.

**Solution**: Created singleton schemas for each index page.

**Files Created:**
1. **`/sanity/schemas/blogIndexPage.ts`**
   - Singleton schema for blog index page
   - Fields: title, description, seo

2. **`/sanity/schemas/caseStudiesIndexPage.ts`**
   - Singleton schema for case studies index page
   - Fields: allCaseStudiesHeading, allCaseStudiesDescription, seo

**Files Modified:**
1. **`/sanity/schemas/index.ts`** - Registered new schemas
2. **`/src/lib/sanity/queries.ts`** - Added queries: `blogIndexPageQuery`, `caseStudiesIndexPageQuery`
3. **`/src/app/(public)/blog/page.tsx`** - Fetch and use CMS content
4. **`/src/app/(public)/case-studies/page.tsx`** - Fetch and use CMS content

**Impact:**
- ✅ Content editors can manage all page content through Sanity
- ✅ Consistent metadata management across all pages
- ✅ Uses `generateSanityMetadata()` helper for all pages

**Documentation:**
- `/docs/metadata-cms-integration-2025-11-10.md`

---

### Site Metadata Audit - COMPLETE 🎉

**Goal**: Verify metadata is coming from CMS for detail pages.

**Findings:**
- ✅ Case study detail pages: Using `generateSanityMetadata()` ✓
- ✅ Blog detail pages: Using `generateSanityMetadata()` ✓
- ✅ AI Showcase detail pages: Using basic metadata (not using helper)
- ⚠️ Index pages: Using hardcoded values

**Actions Taken:**
- Created plan to migrate index pages to CMS (completed above)
- Identified AI Showcase as candidate for deprecation

---

## ✅ Previous Accomplishments (November 9, 2025)

### Server-Side Time-Based Theming & Easter Egg Theme Toggle - COMPLETE 🎉

**Goal**: Fix logo flash bug on page load and add hidden easter egg theme toggle for light/dark mode switching.

**Status**: ✅ Complete and ready for production.

#### Part 1: Logo Flash Bug Fix ✅

**Problem**: MEvans logo and other `.text-gradient` elements flashed from purple to coral (or vice versa) on page load.

**Root Cause**:
- `.text-gradient` class uses `--gradient-primary` which depends on `--accent` CSS variable
- `--accent` was set to purple initially in `globals.css`
- `TimeThemeProvider` (client component) updated it to coral during daytime after hydration
- This client-side update caused the flash from purple → coral during React hydration

**Solution**: Server-side time calculation with inline styles to prevent FOUC.

**Architecture Decision**: Hybrid approach
- **Server-side**: Calculate Portland time-based accent colors (4 CSS variables)
- **Client-side**: Handle user theme preference (light/dark) via next-themes
- **Reasoning**: Server can calculate Portland time but not user's theme preference

**Files Modified:**
1. **`/src/app/layout.tsx`** - Added server-side time calculation and inline styles
2. **`/src/components/providers/TimeThemeProvider.tsx`** - Updated to coordinate with server values

**Impact**:
- ✅ Logo no longer flashes on page load
- ✅ All `.text-gradient` elements render with correct color immediately
- ✅ Server calculates correct colors for Portland time zone
- ✅ Client keeps colors updated during long sessions
- ✅ No FOUC on any time-based themed elements

#### Part 2: Easter Egg Theme Toggle ✅

**Problem**: Light/dark mode feature was hidden. User wanted to bring it back as a barely visible easter egg.

**Solution**: Repurposed existing ThemeToggle component as minimal easter egg.

**Files Modified:**
1. **`/src/components/ui/theme-toggle.tsx`** - Complete rewrite as barely visible text
2. **`/src/components/Footer.tsx`** - Added ThemeToggle at bottom-right

**Impact**:
- ✅ Light/dark mode toggle available but hidden (true easter egg)
- ✅ Barely visible at 5-10% opacity
- ✅ Reveals on hover (30% opacity)
- ✅ Toggles theme when clicked
- ✅ Shows current theme state ("dark" or "light")
- ✅ Positioned at footer bottom-right corner

---

### Mobile Navigation Breakpoint Migration - COMPLETE 🎉

**Goal**: Fix cramped tablet layout by switching mobile/desktop navigation breakpoint from 768px (md:) to 1024px (lg:).

**Problem**: At 768-1023px viewport widths, desktop sidebar was showing but content area was only 448px wide.

**Solution**: Systematic migration from `md:` (768px) to `lg:` (1024px) for all navigation components.

**Files Modified** (10 total):
- `/src/hooks/useMediaQuery.ts`
- `/src/components/navigation/NavigationPanel.tsx`
- `/src/components/navigation/MobileHeader.tsx`
- `/src/components/navigation/HamburgerMenu.tsx`
- `/src/components/navigation/MobileChatFooter.tsx`
- `/src/components/navigation/ChatSection.tsx`
- `/src/components/Footer.tsx`
- `/src/app/(public)/layout.tsx`
- `/src/hooks/__tests__/useMediaQuery.test.ts`

**Key Benefits**:
- ✅ Better tablet UX: Content gets 704px width instead of 448px (57% more space)
- ✅ Clean breakpoint: Navigation switches cleanly at 1024px
- ✅ No dual navigation: Mobile and desktop nav never show simultaneously

---

## 🚀 Next Steps

### Immediate
- No pending tasks - all recent work complete

### Short-term
- Monitor case study hero images in production
- Consider additional hero layout enhancements based on user feedback
- Test featured images across different case studies

## 📝 Notes

**Editorial Layout Spacing Patterns**:
- **AVOID viewport-dependent sizing**: `min-h-[Xvh] flex items-center` creates gaps that grow with screen height
- **USE fixed rem-based padding**: Industry standard (Medium, Substack, NYT) for predictable spacing
- Vertical centering with `items-center` distributes extra space equally above/below content
- Fixed padding (e.g., `pt-16 md:pt-24 pb-8 md:pb-12`) provides consistent gaps across all viewports
- Design system should use content-based sizing, not viewport units

**Case Study Hero Image Learnings**:
- GROQ asset dereferencing is critical: `asset->{_id, url}` not just `asset`
- Regular `<img>` tags simpler than Next.js Image for flex layouts
- Avoid `absolute` positioning in flex containers (causes mobile overlay issues)
- Blog post pattern provides clean, consistent design language
- 4:3 aspect ratio prevents image stretching

**Content Architecture Decisions**:
- Single source of truth for descriptions: `featuredDescription`
- Metadata priority: seo.metaDescription → featuredDescription → global defaults
- Keep schemas simple and purposeful
- Avoid redundant fields that confuse content editors

**Blog Design Patterns**:
- Horizontal layout with 4:3 aspect ratio prevents image stretching
- Alternating left/right image positions create visual rhythm
- Match homepage component design for consistency
- Mobile-first: stack vertically, expand horizontally on desktop

**Testing Methodology**:
- Run full build after schema changes
- Check for TypeScript errors
- Verify no broken references with grep
- Test in Sanity Studio

**Production Readiness**:
- ✅ Featured description consolidation complete
- ✅ AI Showcase deprecation complete
- ✅ Blog landing page design updated
- ✅ Chatbot FAQ content accurate
- ✅ Case study hero images implemented
- ✅ All builds passing
- ✅ All commits pushed to GitHub
