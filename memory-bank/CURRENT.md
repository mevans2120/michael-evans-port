# Current Development Status

## 📍 Active Sprint: Sanity Schema Cleanup & Content Management
*Last Updated: 2025-11-07*

## 🎯 Current Focus
**Removed Duplicate Title Fields from Sanity Schemas** ✅ Complete - Eliminated duplicate heroSection.title fields from blog and project schemas to create single source of truth.

**Status**: ✅ Complete and ready to commit.

## ✅ Recent Accomplishments (November 7, 2025 - Latest)

### Sanity Schema Cleanup: Removed Duplicate Title Fields - COMPLETE 🎉

**Problem**: Blog and project content types had duplicate title fields (main `title` + `heroSection.title`), causing:
- Content editor confusion about which field to update
- Manual sync burden between two fields
- Publish errors when fields got out of sync
- The specific issue: Blog post title changes weren't appearing because heroSection.title wasn't updated

**Root Cause**: Overly flexible schema design that allowed titles to differ between main document and hero display, but in practice they were always kept in sync manually.

**Solution**: Remove `heroSection.title` field entirely and use only the main `title` field everywhere.

**Implementation**:

**Files Modified (9 files)**:

1. **Schemas (2 files)**:
   - `sanity/schemas/blog.ts` - Removed title field from heroSection
   - `sanity/schemas/project.ts` - Removed title field from heroSection

2. **TypeScript Types (1 file)**:
   - `src/types/blog.ts` - Removed `title?` from BlogHero interface

3. **Components (1 file)**:
   - `src/components/blog/BlogHero.tsx` - Changed from `fallbackTitle` prop to required `title` prop, removed fallback logic

4. **Pages (3 files)**:
   - `src/app/(public)/blog/[slug]/page.tsx` - Changed BlogHero to use `title={post.title}` directly
   - `src/app/(public)/case-studies/[slug]/page.tsx` - Updated inline interface, query, and EditorialHero to use `project.title` directly
   - `src/app/(public)/page.tsx` - Fixed homepage featured blog to use `featuredShowcase.title` instead of `heroSection.title`, also fixed image check from `asset.url` to `asset`

5. **Queries (1 file)**:
   - `src/lib/sanity/queries/blog.ts` - Removed `title` from heroSection in both `blogPostBySlugQuery` and `featuredBlogQuery`

**Key Changes**:
- Blog schemas now only have main `title` field (no heroSection.title)
- All components updated to use main title field
- Homepage featured blog now displays photo and title correctly
- Fixed image conditional check (was checking `asset.url`, now checks `asset`)

**Benefits**:
- ✅ Single source of truth for titles
- ✅ No manual sync needed between fields
- ✅ Simpler Sanity Studio UI
- ✅ Eliminates content editor confusion
- ✅ Prevents publish errors from field mismatches
- ✅ Cleaner, more maintainable schema

**Testing**:
- ✅ Build successful with zero TypeScript errors
- ✅ Homepage displays featured blog photo and title correctly
- ✅ Blog detail pages render with correct titles
- ✅ Project detail pages render with correct titles
- ✅ Dev server running without errors

**Note**: AI Showcase schema was intentionally left unchanged (still has heroSection.title) per user request to only fix blog and project.

---

### Chatbot LinkPreview Layout Fix - COMPLETE 🎉

**Problem**: LinkPreview components were rendering inside markdown `<p>` tags in chatbot messages, causing:
- React hydration errors (block-level elements `<div>`, `<h3>`, `<p>` cannot be children of `<p>`)
- Stretched/tall layout appearance due to paragraph constraints

**Root Cause**: ReactMarkdown's custom link renderer wrapped LinkPreview components directly in `<p>` tags, creating invalid HTML nesting.

**Solution**: Extract LinkPreview links from markdown content and render them separately (outside `<p>` tags), similar to how Slack/Discord handle rich media.

**Implementation**:
1. **Created `/src/lib/linkExtractor.ts`** (88 lines)
   - `extractInternalLinks()` - Parses markdown and extracts preview links
   - `isPreviewableLink()` - Checks if link should be extracted
   - Targets `/case-studies/`, `/ai-showcase/`, `/blog/` URLs
   - Returns cleaned text content + array of extracted links

2. **Updated `/src/components/navigation/ChatSection.tsx`**
   - Line 14: Added import for extractInternalLinks utility
   - Line 333: Extract links from mainContent before rendering
   - Line 408: Use cleanContent (text without links) in ReactMarkdown
   - Lines 412-421: Render extracted LinkPreview cards separately after message

**Files Created**:
- `/src/lib/linkExtractor.ts` (88 lines)

**Files Modified**:
- `/src/components/navigation/ChatSection.tsx` (3 changes: import, extraction, rendering)

**Key Benefits**:
- ✅ No more React hydration errors
- ✅ Proper HTML structure (cards as siblings to paragraphs, not children)
- ✅ Better layout (cards render at natural size without paragraph constraints)
- ✅ Similar UX to Slack/Discord (rich media separated from text)
- ✅ Links still appear after message text as intended
- ✅ Supports multiple links per message
- ✅ External links remain inline (unchanged)

**Technical Architecture**:
```tsx
// Before (broken):
<p>
  <LinkPreview /> {/* ❌ Block element in paragraph */}
</p>

// After (fixed):
<ReactMarkdown>{cleanContent}</ReactMarkdown>
{extractedLinks.map(link => <LinkPreview />)} {/* ✅ Siblings */}
```

**Testing**:
- ✅ Dev server running successfully
- ✅ Link metadata API fetching correctly (200 responses)
- ✅ No hydration errors in console
- ✅ Layout renders correctly with proper card height
- ✅ Multiple links per message supported

---

### Sanity Presentation Mode Fix - COMPLETE 🎉

**Problem**: Presentation mode was refreshing pages instead of updating content live. Live editing was not working seamlessly.

**Root Cause**: `browserToken: false` in `/src/sanity/lib/live.ts` completely disabled WebSocket updates.

**Solution (3 Phases)**:
1. **Phase 1 (Critical)**: Enabled `browserToken: process.env.SANITY_AUTH_TOKEN`
   - Fixed live WebSocket updates
   - Content now updates in real-time without page refreshes
2. **Phase 2 (Enhancement)**: Added location resolvers
   - Created `/src/sanity/presentation.ts` with mainDocuments and locations config
   - Updated `sanity.config.ts` to use resolvers
   - Enables "Used on X pages" banner and better document navigation
3. **Phase 3 (Optional)**: Base client stega (skipped - not needed)

**Files Changed**:
- `src/sanity/lib/live.ts` - Enabled browserToken
- `src/sanity/presentation.ts` - NEW: Location resolver configuration
- `sanity.config.ts` - Added resolve configuration to presentationTool
- `docs/sanity-presentation-mode-fix.md` - NEW: Comprehensive analysis (747 lines)
- `docs/SANITY-PRESENTATION-MODE-QUICK-FIX.md` - NEW: Quick reference guide for other projects

**Result**: ✅ Live editing works seamlessly - no page refreshes on publish or edit.

**Documentation**: Full analysis in `/docs/sanity-presentation-mode-fix.md` with root cause, technical details, and testing checklist. Quick reference guide available for applying to other projects.

---

### Content Branding: Blog → Posts

**Change**: Renamed "Blog" to "Posts" throughout the site while keeping `/blog` URL slug.

**Files Updated**:
- `sanity/schemas/blog.ts` - Title: "Blog" → "Posts" (Sanity Studio sidebar)
- `src/app/(public)/blog/page.tsx` - Heading and page title
- `src/components/navigation/NavigationMenu.tsx` - Navigation label
- `src/app/api/link-metadata/route.ts` - Category metadata

**Result**: Site displays "Posts" everywhere, URL remains `/blog` for SEO continuity.

---

### Blog System Implementation & PostPal Migration - COMPLETE 🎉

**Goal**: Transform the AI Showcase into a simple blog system and migrate PostPal to Case Studies as a full project.

**Implementation Timeline**: November 7, 2025 (7 phases completed)

#### Phase 1: Research & Planning ✅
- Created `/docs/blog-implementation-approaches.md` (600+ lines)
  - Analyzed 4 implementation approaches
  - Detailed comparison matrix with pros/cons
  - Recommended Approach #3 (New Simple Blog Schema) for true simplicity
- Created `/docs/blog-implementation-plan-approach3.md` (800+ lines)
  - Complete 8-phase implementation guide
  - PostPal migration plan included
  - Testing checklist and timeline (10-12 hours)

#### Phase 2: Schema & Types ✅
- Created `/sanity/schemas/blog.ts` (265 lines)
  - Lightweight schema vs 360+ line aiShowcase schema (3-6x simpler)
  - Key fields: title, slug, excerpt, heroSection, content (PortableText), publishedAt, author, readingTime
  - Optional: featured, order, featuredImage, seo
  - Icon: DocumentTextIcon
- Created `/src/types/blog.ts` (80 lines)
  - TypeScript interfaces: Blog, BlogListItem, BlogHero, BlogImage, BlogSEO
- Created `/src/lib/sanity/queries/blog.ts` (117 lines)
  - allBlogPostsQuery, blogPostBySlugQuery, featuredBlogQuery
- Updated `/sanity/schemas/index.ts` to export blog schema

#### Phase 3: Blog Components ✅
Created 5 components in `/src/components/blog/`:
- `BlogLayout.tsx` (35 lines) - Article wrapper with max-w-[920px]
- `BlogHero.tsx` (45 lines) - Hero section with badge, title, subtitle
- `BlogContent.tsx` (92 lines) - PortableText renderer with custom serializers
- `BlogMeta.tsx` (55 lines) - Date, author, reading time display
- `BlogPostCard.tsx` (95 lines) - Card for blog listing with click handling
- `index.ts` - Component exports

**Design System Compliance**:
- All components use semantic tokens (text-foreground, text-muted-foreground, text-accent)
- Proper dark mode support via design system
- Transition utilities (transition-smooth, duration-normal, duration-slower)
- No hardcoded colors or inline styles

#### Phase 4: Blog Routes ✅
- Created `/src/app/(public)/blog/page.tsx` (50 lines)
  - Blog listing page with server-side data fetching
  - Metadata generation with SEO support
- Created `/src/app/(public)/blog/[slug]/page.tsx` (80 lines)
  - Dynamic blog detail route
  - Static generation with generateStaticParams
  - Incremental Static Regeneration (revalidate: 3600)

#### Phase 5: Navigation Integration ✅
- Updated `/src/components/navigation/NavigationMenu.tsx`
  - Changed "AI Showcase" → "Blog" in navigation menu
- Updated `/src/app/(public)/page.tsx` (3 sections)
  - Changed import from featuredAIShowcaseQuery to featuredBlogQuery
  - Updated fetch query at line 45
  - Changed field references: slug.current, excerpt vs summary

#### Phase 6: Integration Points ✅
Updated 3 integration files:

1. **`/src/app/api/link-metadata/route.ts`:**
   - Added SanityBlog interface
   - Added 'blog' to type validation
   - Added blog query fetch logic
   - Updated description extraction for blog (uses excerpt field)
   - Updated category formatting for blog

2. **`/src/components/chatbot/LinkPreview.tsx`:**
   - Updated parseInternalLink to include 'blog' type
   - Added regex for /blog/ URLs
   - Updated documentation comments

3. **`/src/app/api/chat/route.ts`:**
   - Updated system prompt references from "AI Showcase" to "Blog"
   - Changed attribution guidelines
   - Updated available URLs section
   - Changed example links

#### Phase 7: PostPal Migration ✅
- **Created migration script**: `/scripts/migrate-postpal-to-project.ts` (206 lines)
  - Flattens slide-based content to linear article format
  - Converts quoteBox to statBlockQuote inline stat block
  - Converts comparisonBoxes to structured text content
  - Extracts techPills as technologies array
  - Adds project overview metadata (role, company, timeline)
- **Migration Results**:
  - 43 content blocks created from 4 slides
  - 9 metrics preserved and displaying
  - 8 technologies extracted (Claude, Mistral, Next.js, React Native, PostgreSQL, Prisma, Supabase, TypeScript)
  - Hero section complete with badge, title, subtitle, summary
  - Project overview added (Role: Product Manager & Technical Lead, Company: PostPal (Startup), Timeline: 2024 - Present)
  - Featured image and SEO metadata preserved
  - Old aiShowcase document deleted successfully
- **PostPal now live at**: `/case-studies/postpal`

#### Phase 8: Content Migration ✅
- Created automated migration script: `/scripts/migrate-showcase-to-blog.ts` (206 lines)
  - Fetches AI Showcase posts (marketing-sites, ai-workflow)
  - Flattens slide-based structure to linear blog format
  - Converts section labels to H2 headings
  - Converts slide headings to H3 headings
  - Preserves all content blocks
  - Transforms quotes, comparisons, tech stack
  - Calculates reading time (wordCount / 200 words per minute)
- **Migration Results**:
  - `blog-marketing-sites`: 2 min read, 21 content blocks
  - `blog-ai-workflow`: 5 min read, 38 content blocks
- **Testing**: All blog pages render correctly, images load, metadata displays

**Files Created** (15 files):
- `/docs/blog-implementation-approaches.md` (600+ lines)
- `/docs/blog-implementation-plan-approach3.md` (800+ lines)
- `/sanity/schemas/blog.ts` (265 lines)
- `/src/types/blog.ts` (80 lines)
- `/src/lib/sanity/queries/blog.ts` (117 lines)
- `/src/components/blog/BlogLayout.tsx` (35 lines)
- `/src/components/blog/BlogHero.tsx` (45 lines)
- `/src/components/blog/BlogContent.tsx` (92 lines)
- `/src/components/blog/BlogMeta.tsx` (55 lines)
- `/src/components/blog/BlogPostCard.tsx` (95 lines)
- `/src/components/blog/index.ts`
- `/src/app/(public)/blog/page.tsx` (50 lines)
- `/src/app/(public)/blog/[slug]/page.tsx` (80 lines)
- `/scripts/migrate-showcase-to-blog.ts` (206 lines)
- `/scripts/migrate-postpal-to-project.ts` (206 lines)

**Files Modified** (7 files):
- `/sanity/schemas/index.ts` - Added blog schema export
- `/src/components/navigation/NavigationMenu.tsx` - Changed "AI Showcase" to "Blog"
- `/src/app/(public)/page.tsx` - Updated homepage to pull from blog
- `/src/app/api/link-metadata/route.ts` - Added blog support
- `/src/components/chatbot/LinkPreview.tsx` - Added blog link parsing
- `/src/app/api/chat/route.ts` - Updated system prompt for blog

**Key Benefits**:
- ✅ Exceptionally simple blog schema (3-6x simpler than AI Showcase)
- ✅ Linear content structure (easier to write and edit)
- ✅ Reuses ArticleContent renderer (DRY principle)
- ✅ All content migrated successfully (2 blog posts, PostPal to case studies)
- ✅ Full dark mode support
- ✅ Design system compliant (semantic tokens throughout)
- ✅ Automated migration scripts for repeatable workflow
- ✅ PostPal now has full case study treatment with metrics, overview, and technologies
- ✅ AI Showcase collection cleaned up (only 2 blog posts remain)

**Current State**:
- **Blog**: 2 posts (marketing-sites, ai-workflow) at `/blog`
- **Projects**: 8 case studies including PostPal at `/case-studies/postpal`
- **AI Showcase collection**: 2 documents (will be migrated to blog in production)
- **Navigation**: "Blog" link replaces "AI Showcase"
- **Homepage**: "Blog" section replaces "AI Showcase" section

**PostPal Migration Details**:
- **Content**: 43 article blocks (4 sections: The Problem, The Solution, The Impact, The Technology)
- **Metrics**: 9 key metrics (30-50% patient call reduction, 20-40% improved compliance, etc.)
- **Technologies**: 8 technologies displayed with pills
- **Category**: Healthcare AI
- **Featured Metric**: "AI-powered care tracking"
- **Featured Description**: "Healthcare AI product that transforms paper discharge instructions into intelligent recovery timelines, reducing patient calls by 30-50% and improving care compliance by up to 40%."

**Technical Architecture**:
```tsx
// Blog Listing
<main>
  <header>Blog</header>
  {posts.map(post => <BlogPostCard post={post} />)}
</main>

// Blog Detail
<BlogLayout>
  <BlogHero {...heroSection} fallbackTitle={title} />
  <BlogMeta {...post} />
  <BlogContent content={content} />
</BlogLayout>

// PostPal Case Study
<EditorialHero {...heroSection} overview={overview} />
<MetricsSection metrics={metrics} />
<FlowingArticle article={article} />
<TechnologiesSection technologies={technologies} />
```

**Testing**:
- ✅ Build: All pages generated successfully
- ✅ Blog listing: Displays 2 posts with cards
- ✅ Blog detail: Both posts render correctly
- ✅ PostPal case study: Renders at /case-studies/postpal
- ✅ Navigation: "Blog" link works
- ✅ Homepage: "Blog" section displays featured post
- ✅ Chatbot: Link previews work for blog posts
- ✅ Dark mode: Fully supported
- ✅ Responsive: Mobile, tablet, desktop verified

**Rollback Available**:
- Original AI Showcase schema preserved in Sanity
- Migration scripts can be re-run if needed
- PostPal backup exists in aiShowcase collection history

**Future Enhancements** (optional):
- Add more blog posts via Sanity Studio
- Add blog categories/tags for filtering
- Add related posts feature
- Set PostPal as featured on homepage
- Update chatbot content to reflect PostPal case study

---

### About Page Redesign - COMPLETE 🎉

**Goal**: Update About page to use flowing article format matching Case Study detail pages with single-column layout and editorial styling.

**Implementation Timeline**: November 6-7, 2025 (4 phases completed)

**Phase 1: Schema Design & Migration Script** ✅
- Added `article` field to profile schema (`/sanity/schemas/profile.ts`)
- Supports Portable Text with stat blocks (Number, Quote, Text), images, videos, code
- Deprecated `sections` field (hidden for backward compatibility)
- Created migration script (`/scripts/migrate-profile-to-article.ts`)
- Features: dry-run mode, automatic backup, H2/H3 heading conversion, interactive confirmation
- Added npm script: `npm run migrate:profile`

**Phase 2: Component Development** ✅
- Created `/src/components/about/AboutHero.tsx` (119 lines) - Editorial-style hero with profile image
- Created `/src/components/about/AboutArticle.tsx` (23 lines) - Wrapper for ArticleContent renderer
- Created `/src/components/about/AboutFooter.tsx` (82 lines) - Availability status and CTA
- Rewrote `/src/components/about/AboutPageClient.tsx` (169 → 86 lines) - Clean component architecture
- Build verified: ✅ 22/22 pages, no TypeScript errors

**Phase 3: Migration Execution** ✅
- Backup created: `/backups/profile-backup-2025-11-07T01-19-28.json`
- Migrated 6 sections (skipped 1 hidden) → 29 article blocks
- Content structure preserved:
  - The 50,000-Foot View (H2)
  - From Yurts to Gigahertz (H2)
  - What I Bring (H2) with 3 subsections (H3)
  - Why AI Changes Many Things (H2)
  - The Process (H2)
- Updated page query (`/src/app/(public)/about/page.tsx`) to fetch `article` field
- Preview saved: `/backups/article-preview.json`

**Phase 4: Testing & Documentation** ✅
- Production build successful (31.3s)
- All 22 pages generated, no errors
- Dev server verified (http://localhost:3000/about)
- Created comprehensive documentation:
  - `/docs/about-page-redesign-plan.md` - Planning document
  - `/docs/about-page-redesign-implementation.md` - Implementation summary

**Key Benefits**:
- ✅ Matches Case Study visual style (single-column, max-w-4xl)
- ✅ Reuses ArticleContent renderer (DRY principle)
- ✅ All content preserved (100%)
- ✅ Stat blocks available for future use
- ✅ Simpler data structure (flat vs nested)
- ✅ Backward compatibility maintained
- ✅ Full dark mode support
- ✅ Responsive design (mobile-first)

**Technical Architecture**:
```tsx
<AboutPageClient>
  {/* Blur orbs */}
  <AboutHero {...hero} />
  <AboutArticle article={data.article} />
  <AboutFooter {...footer} />
</AboutPageClient>
```

**Files Created**:
- `/src/components/about/AboutHero.tsx`
- `/src/components/about/AboutArticle.tsx`
- `/src/components/about/AboutFooter.tsx`
- `/scripts/migrate-profile-to-article.ts`
- `/docs/about-page-redesign-plan.md`
- `/docs/about-page-redesign-implementation.md`

**Files Modified**:
- `/sanity/schemas/profile.ts` - Added article field
- `/src/components/about/AboutPageClient.tsx` - Complete rewrite
- `/src/app/(public)/about/page.tsx` - Updated query
- `/package.json` - Added migrate:profile script

**Testing**:
- ✅ Build: 31.3s, 22/22 pages
- ✅ Bundle size: 3.28 kB (unchanged)
- ✅ Content: 100% preserved
- ✅ Runtime: About page loading successfully
- ✅ Dark mode: Fully supported
- ✅ Responsive: Mobile, tablet, desktop verified

**Rollback Available**: Backup at `/backups/profile-backup-2025-11-07T01-19-28.json`

**Future Enhancements** (optional):
- Add stat blocks to highlight achievements
- Add images/videos to article content
- Enhance hero section with badge/tagline

---

## ✅ Previous Accomplishments

### Desktop Footer Crow Restoration - COMPLETE 🎉

**Goal**: Restore the crow graphic to the desktop footer that was accidentally removed on November 5.

**Problem**:
- Crow graphic disappeared from desktop footer
- Was removed on November 5 during mobile footer optimization (commit `6ba61b1`)
- Commit message said "from mobile" but crow was removed entirely (both mobile and desktop)
- Crow existed from November 2-5 (3 days)

**Root Cause**:
- Crow was in first column of 4-column desktop grid layout
- Mobile footer refactor changed grid from 4 columns to 3 columns
- Crow column was deleted entirely instead of hidden on mobile only
- Layout shrunk from `grid-cols-4` to `grid-cols-3` on desktop

**Solution**: Restored original 4-column desktop layout with crow
1. Changed desktop grid back to 4 columns: `grid-cols-2 md:grid-cols-4`
2. Added crow SVG in first column (248×300, horizontally flipped)
3. Hidden on mobile with `hidden md:flex`
4. Removed extra "MEvans" logo that was off-screen
5. Preserved all mobile improvements (2-column layout)

**Implementation Details**:
- **Crow Styling**:
  - Size: 248px × 300px
  - ViewBox: `20 12 70 110` (cropped for optimal display)
  - Transform: `-scale-x-100` (horizontally flipped to face right)
  - Color: `text-navigation` (matches nav panel)
  - Opacity: 80%
  - Positioning: `self-end justify-self-start -ml-16` (bottom-left with negative margin)

- **Desktop Layout** (4 columns):
  1. Crow graphic (hidden on mobile)
  2. Services list (Research, Strategy, UX & Design, Delivery, Development)
  3. Pages navigation (Home, About, Case Studies, AI Showcase)
  4. Reach Out links (LinkedIn, Contact)

- **Mobile Layout** (2 columns, unchanged):
  1. Services list
  2. Reach Out links + "MEvans LLC." logo

**Files Modified**:
- `/src/components/Footer.tsx` - Restored crow column and 4-column grid

**Key Improvements**:
- ✅ Crow visible on desktop (≥768px width)
- ✅ Crow hidden on mobile (<768px width)
- ✅ Original desktop design restored
- ✅ All mobile improvements preserved (2-column, simplified layout)
- ✅ No extra logo text off-screen
- ✅ Build passing (22/22 pages)

---

### Sanity Visual Editor & Profile Image Hotspot - COMPLETE 🎉

**Goal**: Fix broken Sanity Presentation view (visual editor) and enable proper image hotspot/crop support for profile images.

**Problems**:
1. Sanity Presentation view showing "Unable to connect to visual editing" error
2. Network errors (ERR_QUIC_PROTOCOL_ERROR, 500 Internal Server Error)
3. React hydration mismatch error when loading pages
4. Profile image on About page cutting off top of head despite setting hotspot in Sanity
5. Module loading error for VisualEditing component causing runtime failures

**Root Causes**:
1. Missing `NEXT_PUBLIC_SITE_URL` environment variable (required for visual editor connection)
2. Conditional rendering of `<SanityLive />` vs `<VisualEditing />` causing hydration mismatches
3. Profile image query only fetching `asset->url` without hotspot/crop data
4. `VisualEditing` component not wrapped in client component causing chunk loading errors

**Solutions**:
1. **Environment Configuration**:
   - Added `NEXT_PUBLIC_SITE_URL=http://localhost:3000` to `.env.local`
   - Documented need to add production URL to Vercel environment variables

2. **Fixed Hydration Error** (`/src/app/layout.tsx:69-70`):
   - Always render `<SanityLive />` (handles live updates for all visitors)
   - Conditionally add `<VisualEditingWrapper />` only in draft mode
   - Prevents hydration mismatch between server/client rendering

3. **Profile Image Hotspot Support**:
   - Updated query (`/src/app/(public)/about/page.tsx:10-14`) to fetch complete image object:
     ```groq
     profileImage {
       asset->,
       hotspot,
       crop
     }
     ```
   - Implemented Sanity image URL builder (`/src/components/about/AboutPageClient.tsx:99`):
     ```typescript
     builder.image(data.profileImage).width(448).height(448).fit('crop').url()
     ```
   - `.fit('crop')` respects hotspot, ensuring circular crop focuses on selected area

4. **Fixed Module Loading Error**:
   - Created client component wrapper (`/src/components/VisualEditingWrapper.tsx`)
   - Wrapped `VisualEditing` in `'use client'` directive to prevent chunk loading errors
   - Updated layout to use wrapper instead of direct import

**Files Modified**:
- `/src/app/layout.tsx` - Fixed hydration and added VisualEditing wrapper
- `/src/app/(public)/about/page.tsx` - Updated query to fetch hotspot/crop data
- `/src/components/about/AboutPageClient.tsx` - Implemented image URL builder
- `/.env.local` - Added NEXT_PUBLIC_SITE_URL

**Files Created**:
- `/src/components/VisualEditingWrapper.tsx` - Client component wrapper for VisualEditing

**Testing**:
- ✅ Build passes (22/22 pages)
- ✅ Visual editor connects successfully in Sanity Presentation view
- ✅ No hydration errors
- ✅ Profile image respects hotspot adjustments made in Sanity
- ✅ No module loading errors

**Commits**:
- `0c6e568` - Fix Sanity visual editor and profile image hotspot support
- `[pending]` - Fix VisualEditing module loading error with client wrapper

---

### Case Study Article Spacing Improvements - COMPLETE 🎉

**Goal**: Fix inconsistent paragraph spacing in case study articles and reduce excessive padding between hero metadata and article content.

**Problem**:
- Inconsistent spacing between paragraphs in case study articles (some cramped, some with gaps)
- Likely caused by migration script creating soft line breaks instead of paragraph blocks
- Excessive vertical gap (128px mobile / 192px desktop) between metadata section and article content
- Tailwind margin stacking causing additional spacing issues

**Root Cause**:
- Migration script created content with soft breaks (`<br>`) that have no spacing
- Paragraph blocks had `mb-6` (24px) but no CSS normalization rules
- Tailwind margins don't collapse like native CSS, causing stacked margins
- Both EditorialHero and FlowingArticle had large padding creating huge gap

**Solution**: CSS normalization + component padding adjustments
1. Created comprehensive analysis documentation explaining the formatting system
2. Added `.prose-custom` class with spacing normalization rules
3. Added `data-stat-block` attributes to all stat block components for CSS targeting
4. Reduced paragraph spacing from `mb-6` (24px) to `mb-4` (16px)
5. Reduced component padding between hero and article by 75%

**Implementation Details**:
- **CSS Normalization** (`/src/app/globals.css`):
  - Base paragraph spacing: `mb-4` (16px between all paragraphs)
  - Remove trailing margins on last paragraph
  - Fix margin stacking after headings and stat blocks
  - 100% Tailwind utilities (no direct CSS values)

- **Component Padding Reductions**:
  - EditorialHero: `py-16 md:py-24` → `pt-16 md:pt-24 pb-4 md:pb-6`
  - FlowingArticle: `py-16 md:py-24` → `pt-4 md:pt-6 pb-16 md:pb-24`
  - Total gap reduced from 128px/192px to 32px/48px (75% smaller)

**Files Created**:
- `/docs/case-study-paragraph-spacing-analysis.md` - Comprehensive 500+ line analysis document explaining:
  - How the formatting system works (Sanity → Portable Text → React → CSS)
  - Root causes of inconsistent spacing
  - Migration script artifacts and Tailwind margin behavior
  - Testing methods and future recommendations

**Files Modified**:
- `/src/app/globals.css` - Added `.prose-custom` class with spacing normalization
- `/src/components/case-study-flowing/StatBlockNumber.tsx` - Added `data-stat-block` attribute
- `/src/components/case-study-flowing/StatBlockQuote.tsx` - Added `data-stat-block` attribute
- `/src/components/case-study-flowing/StatBlockText.tsx` - Added `data-stat-block` attribute
- `/src/components/case-study-editorial/EditorialHero.tsx` - Reduced bottom padding (pb-8 → pb-4, pb-12 → pb-6)
- `/src/components/case-study-flowing/FlowingArticle.tsx` - Reduced top padding (pt-8 → pt-4, pt-12 → pt-6)

**Key Improvements**:
- ✅ Consistent 16px spacing between all paragraphs
- ✅ No cramped text or excessive gaps
- ✅ Proper 48px spacing around stat blocks (no margin stacking)
- ✅ 75% reduction in gap between hero metadata and article content
- ✅ Works regardless of content source (migration script, manual edits, etc.)
- ✅ 100% Tailwind design system compliance
- ✅ Comprehensive documentation for future reference
- ✅ Build passing (22/22 pages)

**Design System Compliance**:
- Uses `@layer components` (matches existing patterns like `.card-base`)
- Uses `@apply` with Tailwind utilities throughout
- CSS nesting with `&` selector (standard PostCSS)
- Semantic spacing tokens (`mb-4`, `mt-12`, etc.)
- Zero inline CSS or direct values

---

## 🚀 Next Steps

### Immediate
- Commit and push blog system implementation
- Monitor blog pages in production
- Test PostPal case study page
- Update chatbot content to reflect new blog and PostPal

### Short-term
- Consider adding more blog posts via Sanity Studio
- Add blog categories/tags for filtering
- Add related posts feature
- Set PostPal as featured on homepage if desired

### Long-term
- Plan additional blog features (search, pagination, etc.)
- Optimize bundle size if needed
- Consider blog RSS feed

## 📝 Notes

**Blog System Architecture**:
- Simple, focused schema (3-6x simpler than AI Showcase)
- Linear content structure for easier writing
- Reuses ArticleContent renderer from case studies
- Full dark mode and design system compliance

**PostPal Migration**:
- Complete case study treatment with full project schema
- 43 content blocks from 4 slides
- 9 metrics, 8 technologies, project overview
- Healthcare AI category
- Ready for homepage featuring

**Production Readiness**:
- Build passing (22/22 pages + new blog pages)
- Zero breaking changes
- All content migrated successfully
- Backward compatible with existing routes
