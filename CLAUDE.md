# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Michael Evans' portfolio website built with Next.js, TypeScript, and Sanity CMS. A modern, responsive portfolio showcasing AI/ML expertise, creative technology solutions, and professional case studies.

## Documentation Guidelines

**IMPORTANT: Document complex work in markdown files**

When working on tasks that involve **multiple steps, phases, or significant analysis**, create documentation in the `/docs` folder:

**Always document:**
- Audits and analysis reports
- Multi-step implementation plans
- Architecture decisions and rationale
- Migration guides and strategies
- Research findings and recommendations
- Complex debugging investigations
- Performance optimization reports

**Documentation format:**
- Use descriptive filenames: `site-cms-audit-2025-10-25.md`, `migration-plan-vite-to-nextjs.md`
- Include date in filename when relevant
- Structure with clear headings and sections
- Include actionable recommendations
- Link to related documents

**When to document:**
- If a task requires more than 5 steps → Document it
- If explaining would take >3 paragraphs → Document it
- If findings should be referenced later → Document it
- If user asks for documentation → Document it

**Example:** Instead of just listing audit findings in chat, create `/docs/site-cms-audit-2025-10-25.md` with full details, action plan, and recommendations.

## Essential Commands

```bash
# Development
npm run dev              # Start dev server on http://localhost:3000
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
```

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15.5 with React 18.3 and TypeScript 5.8
- **Build Tool**: Next.js with Turbopack
- **Styling**: Tailwind CSS 3.4 with shadcn/ui components
- **CMS**: Sanity (Project ID: 5n331bys, Dataset: production)
- **State Management**: React hooks + TanStack Query 5.90
- **Routing**: Next.js App Router
- **UI Components**: Radix UI primitives via shadcn/ui

### Project Structure
- `/src/app/` - Next.js App Router pages and layouts
- `/src/components/` - React components
- `/src/components/ui/` - shadcn/ui components (50+ pre-built components)
- `/src/lib/sanity/` - Sanity client configuration and queries
- `/sanity/schemas/` - Sanity schema definitions (project, profile, capability, etc.)
- `/docs/` - Project documentation and reports
- `@/` alias resolves to `/src/` directory

### File Organization
- Keep directories organized and follow existing patterns
- Recommend reorganization when folders become cluttered or contain unrelated files
- Group related components, utilities, and features logically

### Key Architectural Decisions
1. **Component Library**: Uses shadcn/ui pattern - components are copied into the codebase rather than imported from a package, allowing full customization
2. **Sanity Integration**: Embedded Sanity Studio at `/studio` route with schemas defined in `/sanity/schemas/`
3. **Routing**: Next.js App Router with file-based routing in `/src/app/`
4. **Styling**: Utility-first with Tailwind CSS, using `cn()` utility from `/src/lib/utils.ts` for conditional classes

## Sanity CMS Configuration

- **Project ID**: 5n331bys
- **Dataset**: production
- **Studio Path**: http://localhost:3000/studio
- **Schemas**: profile (singleton), homepageHero (singleton), project, aiShowcase, timelinePhase, workflowStep, projectCard
- **Client**: Configured in `/src/lib/sanity/client.ts`

## Content Architecture & AI Chatbot

**CRITICAL**: Understanding the content flow is essential for maintaining the AI chatbot and website content.

### Content Sources & Flow

```
PRIMARY SOURCE: Interview Transcripts
  └─ Location: docs/research/research-batch-1-102525/source-materials/transcripts/
      ↓
      ├──→ [Manual Path] Website Content
      │      1. Create migration scripts from transcripts
      │      2. Run scripts → Sanity CMS
      │      3. Sanity → Website pages (case studies, profile, etc.)
      │      4. [Automatic] Sanity webhook → Vector Database
      │
      └──→ [Manual Path] Chatbot Direct Content
             1. Copy transcripts to: public/chatbot-content/transcripts/
             2. Run: npm run ingest
             3. Transcripts → Vector Database

RESULT: Vector Database (unified search layer)
  ├─ Source 1: Sanity CMS content (auto-synced via webhooks)
  └─ Source 2: Transcript files (manually synced)
      ↓
   AI Chatbot (answers from vector DB)
```

### Key Principles

1. **Transcripts are the PRIMARY source of truth**
   - Original recordings and interviews with Michael
   - Located in `docs/research/.../transcripts/`
   - ALL content derives from these

2. **Two parallel content systems**:
   - **Website**: Transcripts → Migration scripts → Sanity CMS → Website pages
   - **Chatbot**: Transcripts → `public/chatbot-content/transcripts/` → Vector DB

3. **Vector Database is the unified search layer**
   - Contains content from BOTH Sanity CMS and transcript files
   - Sanity content auto-syncs via webhooks (see `/docs/chatbot/MAINTAINABLE-CONTENT-SYSTEM.md`)
   - Transcript content manually syncs via `npm run ingest`
   - Chatbot searches this unified database to answer questions

4. **Content updates**:
   - **Website content**: Edit in Sanity Studio → Auto-syncs to vector DB (< 30 seconds)
   - **Transcript content**: Add/edit files in `public/chatbot-content/transcripts/` → Run `npm run ingest`

### Chatbot Content Sync Commands

```bash
# Sync all content (Sanity + transcripts) to vector database
npm run ingest

# Clear and re-sync everything (use if content seems stale)
npm run ingest -- --clear

# Check sync status (admin dashboard)
open http://localhost:3000/admin/chatbot-content
```

### Important Notes

- **Never** edit vector database directly - always update source content (Sanity or transcripts)
- **Always** run `npm run ingest` after adding/editing transcript files
- **Check** admin dashboard to verify sync status
- **Sanity webhooks** handle auto-sync in production (configured in Vercel environment)
- See `/docs/chatbot/MAINTAINABLE-CONTENT-SYSTEM.md` for complete chatbot documentation

## Development Workflow

### Adding New Features
1. Components go in `/src/components/` (use existing patterns)
2. Pages go in `/src/app/` using Next.js App Router conventions
3. Sanity schemas go in `/sanity/schemas/` and must be imported in `sanity.config.ts`

### Code Style
- TypeScript with strict type checking
- Functional components with React.FC type
- **Styling: Always use Tailwind CSS**
  - Use Tailwind utility classes (including arbitrary values like `w-[320px]`)
  - No inline CSS (`style={}`) unless given explicit permission
  - Only use vanilla CSS when technically necessary
  - See CSS & Styling System section below for complete guidelines
- Use the `cn()` utility from `/src/lib/utils.ts` for combining conditional Tailwind classes
- Use existing UI components from `/src/components/ui/` when possible

### Testing Requirements
- Always plan for tests when implementing new features
- Include test files in implementation plans
- Tests don't need to be written first, but should be part of the plan

### Git Commit Guidelines

**CRITICAL: Always ask before committing**

Before making any commits:
1. **Always run `git status`** to review all modified and untracked files
2. **Ask the user which files should be committed** - don't assume
3. **Ask about files you're unsure about**, especially:
   - Documentation files (docs/)
   - Configuration files (.env.example, etc.)
   - Test files and test results
   - Generated files or build artifacts
   - Any files not directly related to the current task
4. **Commit related changes together** - all files needed for a feature should go in one atomic commit
5. **Run `npm run build`** before committing to catch type errors and build issues
6. **Never commit in pieces** - if files depend on each other, commit them together

**Example workflow:**
```bash
# 1. Check what changed
git status

# 2. Ask user: "I see these files changed: [list]. Should I commit all of them, or only specific ones?"

# 3. Build to verify
npm run build

# 4. Commit related files together
git add [files] && git commit -m "message" && git push
```

**Why this matters:**
- Incomplete commits cause production deployment failures
- Missing dependent files break the build
- Unrelated files in commits make history unclear

### Important Files
- `/src/app/layout.tsx` - Root layout with providers
- `/src/app/page.tsx` - Homepage
- `/sanity.config.ts` - Sanity Studio configuration
- `/next.config.ts` - Next.js configuration
- `/src/lib/sanity/client.ts` - Sanity API client setup

## Skills and Specialized Agents

**IMPORTANT: Prefer skills over direct implementation when appropriate:**

- **Always consider if a skill matches the task** before doing work directly
- If a task aligns with a skill's description, **use that skill** instead of working manually
- Available skills include: `project-planner`, `project-manager`, `project-analyzer`, `design-research`, `design-concepts`, `design-production`, `design-qa`, `product-research`, `quality-engineering`, `software-development`, `technical-architecture`
- When in doubt, use a skill - they provide specialized expertise and better results

**Examples of when to use skills:**
- Planning features/roadmaps → `project-planner` skill
- Design concepts/mockups → `design-concepts` skill
- Research/analysis → `product-research` or `design-research` skill
- Testing strategy → `quality-engineering` skill
- Architecture decisions → `technical-architecture` skill

## Planning vs Implementation

**CRITICAL: Follow these rules to avoid unwanted implementation:**

- When asked to "plan", "create a plan", "put together a plan", or "design an approach" → **ONLY create the plan**
- Do **NOT** implement unless explicitly asked to "implement", "build", "code", "create", or "start building"
- After presenting a plan, **ALWAYS wait for explicit approval** to proceed with implementation
- If a session is resumed and the last action was planning, **ask the user before implementing**
- When in doubt, ask: "Would you like me to proceed with implementation?"

**Preferred Planning Tools:**
- Use `project-planner` skill for feature planning and roadmap generation
- Use `planning` agent for breaking down complex tasks into actionable steps
- Use `ExitPlanMode` tool only when planning implementation steps for coding tasks

**Clear Implementation Signals:**
- "Proceed with implementation"
- "Start building this"
- "Implement the plan"
- "Let's code this"

## Current Implementation Status

The portfolio site is fully functional with:
- Complete Next.js App Router setup
- Sanity CMS fully integrated with profile, projects, AI projects, and hero options
- All UI components from shadcn/ui library available
- Responsive design implemented
- TypeScript throughout the codebase
- Profile schema configured as singleton

## Notes for Development

- The site runs on port 3000 (configured in package.json)
- Sanity Studio is embedded at `/studio` route (http://localhost:3000/studio)
- Use Next.js App Router conventions for routing
- Use the `cn()` utility for combining Tailwind classes with conditional logic
- See `/docs/` folder for detailed documentation and audit reports

## CSS & Styling System

**STATUS: Phase 4-8 Complete** (November 2, 2025)

The portfolio uses a comprehensive Tailwind-based styling system with standardized animations, dark mode support, and responsive patterns.

### Quick Reference

**TL;DR: See `/docs/css-quick-reference.md` for common patterns**

### Animation System

Use semantic durations and pre-built utility classes:

```tsx
// ✅ GOOD: Semantic names and utilities
<div className="transition-smooth hover:opacity-80">
<button className="interactive-scale focus-outline">

// ❌ AVOID: Magic numbers and manual classes
<div className="transition-all duration-300 ease-out hover:opacity-80">
```

**Available Durations:**
- `duration-fast` (150ms) - Quick interactions
- `duration-normal` (300ms) - Standard transitions
- `duration-slow` (400ms) - Noticeable changes
- `duration-slower` (600ms) - Major layout shifts

**Available Utilities:**
- `.transition-smooth`, `.transition-fast`, `.transition-slow`, `.transition-colors-smooth`
- `.interactive-scale`, `.interactive-opacity`
- `.flex-center`, `.flex-between`, `.absolute-center`
- `.card-base`, `.card-interactive`, `.card-elevated`
- `.focus-outline`

**Stagger Animations:** Use `.animate-stagger` on children (max 20 items)

### Dark Mode Support

All purple colors have dark mode variants:

```tsx
// ✅ ALWAYS include dark mode
<div className="text-purple-400 dark:text-purple-300">
<div className="bg-purple-500 dark:bg-purple-400">
<div className="border-purple-500 dark:border-purple-400">
```

**Color Mapping:**
```
Light Mode          Dark Mode
text-purple-400  →  dark:text-purple-300
text-purple-500  →  dark:text-purple-400
bg-purple-500    →  dark:bg-purple-400
border-purple-500 → dark:border-purple-400
```

### Responsive Design

**Decision Framework (Phase 7):**

**Use Tailwind CSS when:**
- Controlling visibility/layout only
- Responsive dimensions
- Simple state-based styling

```tsx
// ✅ GOOD: CSS for visibility
<div className="hidden md:block">Desktop only</div>
<div className="w-full md:w-[320px]">
```

**Use JavaScript when:**
- Different behaviors on mobile/desktop
- Complex state calculations
- Conditional event handlers

```tsx
// ✅ GOOD: JavaScript for behavior
const action = isMobile ? expandThenNavigate : navigateImmediately;
```

### Styling Guidelines

1. **Use Tailwind arbitrary values** instead of inline styles
   ```tsx
   // ✅ GOOD
   <div className="w-[320px] h-[66%]">

   // ❌ AVOID
   <div style={{ width: '320px', height: '66%' }}>
   ```

2. **Always include dark mode variants** on colored elements

3. **Use utility classes** from `globals.css` for common patterns

4. **Follow mobile-first** responsive approach
   ```tsx
   <div className="text-4xl md:text-5xl lg:text-6xl">
   ```

5. **Respect motion preferences** (handled automatically via `@media (prefers-reduced-motion)`)

### Testing

```bash
# Visual regression tests (screenshot comparison)
npm run test:visual          # Run screenshot tests
npm run test:visual:update   # Update baselines after refactoring

# Computed styles tests (CSS property validation)
npm run test:styles          # Compare against baseline
npm run test:styles:baseline # Capture new baseline

# Full test suite
npm run test:refactor        # Runs: build + visual + styles + e2e
```

### Documentation

**Comprehensive Guides:**
- `/docs/animation-system.md` - Animation utilities, durations, patterns
- `/docs/component-styling-patterns.md` - Component patterns, dark mode, best practices
- `/docs/responsive-design-guide.md` - Responsive decision framework, breakpoints
- `/docs/css-quick-reference.md` - Quick lookup for common patterns

**Historical Context:**
- `/docs/css-phase4-dark-mode-complete.md` - Dark mode refactoring
- `/docs/css-phase5-animation-standardization-progress.md` - Animation system
- `/docs/css-remaining-enhancements-plan.md` - Phase 6-8 plan and completion

### File Locations

- **Utilities**: `/src/app/globals.css` - Utility classes and design system
- **Config**: `/tailwind.config.ts` - Custom durations, easings, colors
- **Helpers**: `/src/lib/utils.ts` - `cn()` utility for conditional classes
- **Hooks**: `/src/hooks/useMediaQuery.ts` - `useIsDesktop()`, `useMediaQuery()`

## Recent Updates

**November 2, 2025:**
- **Completed Tech Debt Cleanup Phase 1 & 2** (18 changes total)
- **Phase 1 - Security & Cleanup:**
  - SECURITY: Removed password debug logging from admin layout
  - SECURITY: Added Bearer token authentication to all admin API routes
    - Created `/src/lib/auth/admin-auth.ts` utility
    - Protected `/api/admin/chat-logs` and `/api/admin/chatbot-sync` endpoints
    - Added client-side Authorization headers
  - Replaced console.log/error with logger utility in API routes
  - Cleaned up dependencies: removed 6 unused packages, added uuid
  - Deleted 7 unused shadcn/ui components (~1,400 lines removed)
- **Phase 2 - Code Quality & Consistency:**
  - Consolidated mobile detection hooks (deleted duplicate `use-mobile.tsx`)
  - Removed toast hook duplication (canonical: `hooks/use-toast.ts`)
  - Improved TypeScript types (replaced critical `any` usages):
    - Sanity: `any[]` → `PortableTextBlock[]` for content/bio
    - Supabase: `any` → `unknown` or `Json` types
    - ReactMarkdown components: proper type definitions (2 files)
  - Standardized error handling (20+ `console.error` → `logger.error`)
    - embeddings.ts, supabase.ts, ChatSection.tsx cleaned
- Updated e2e tests to work with new ChatSection structure (click chevron button)
- Documentation: `/docs/tech-debt-phase1-2-testing-plan.md`
- Implementation plan: `/docs/implementation-plans/tech-debt-cleanup-plan-2025-11-01.md`

**November 1, 2025:**
- Created visual regression testing infrastructure for CSS refactor
- Captured 24 screenshot baselines (3 viewports × light/dark modes)
- Added computed styles snapshot testing for CSS property validation
- Added `data-testid` attributes to critical components
- Fixed interactive state tests for navigation and chat
- Completed Phase 1 CSS refactor: Removed all 24 `!important` declarations from chatbot.css
- Started Phase 2: Replaced hardcoded purple border color with Tailwind `bg-accent` classes
- Fixed collapsed navigation to show minimal chat with sparkle emoji for context preservation
- Documentation: CSS refactor safety plan, quick start guide, architecture analysis

**October 29, 2025:**
- Implemented dynamic purple border on navigation panel with interactive features
- Added collapsible navigation states (56px → 320px → 455px width transitions)
- Created clickable border area with chevron toggle
- Added exit animations for chat content in collapsed state
- Optimized chat layout with reduced padding and centered messages
- Documentation: `/docs/architecture/navigation-border-css-rebuild-plan-2025-10-29.md`

**October 25, 2025:**
- Fixed profile photo not displaying on homepage
- Converted profile schema to singleton
- Created comprehensive site/CMS audit (see `/docs/site-cms-audit-2025-10-25.md`)
- Updated CLAUDE.md with documentation guidelines