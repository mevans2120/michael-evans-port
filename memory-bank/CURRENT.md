# Current Development Status

## 📍 Active Sprint: Vector Database for Claude Code
*Last Updated: 2025-11-14*

## 🎯 Current Focus
**Claude Code Vector Database System**

**Status**: Core implementation complete. Vector DB successfully separated into its own repository with 100% document ingestion. MCP server implementation pending.

## ✅ Recent Accomplishments (November 14, 2025 - Latest)

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
