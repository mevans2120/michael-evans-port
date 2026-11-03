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
5. **Navigation State**: Route-based initial state with user preference persistence
   - Desktop navigation starts collapsed (partial) on non-homepage routes
   - Homepage loads with expanded navigation by default
   - User's manual toggle preference saved to localStorage and takes precedence
   - Implemented in NavigationContext using `@/lib/navigation-storage` utilities
   - See `/docs/navigation-default-state-feature-research.md` for design decisions
   - See `/docs/navigation-default-state-implementation-plan.md` for implementation details

## Sanity CMS Configuration

- **Project ID**: 5n331bys
- **Dataset**: production
- **Studio Path**: http://localhost:3000/studio
- **Schemas**: profile (singleton), homepageHero (singleton), project, aiShowcase, timelinePhase, workflowStep, projectCard, blog, chatPrompts
- **Client**: Configured in `/src/lib/sanity/client.ts`

## Content Architecture & AI Chatbot

The chatbot has no vector database. The whole knowledge base (about 50k tokens) is assembled server-side and sent to Claude Haiku 4.5 as one prompt-cached system block on every request. The model answers only from that block and otherwise replies with the exact sentence "I don't have that in Michael's materials."

```
Transcripts (content/chatbot/transcripts/*.md, with `questions:` frontmatter)
   └─ npm run build:corpus (automatic via prebuild and pretest) → src/lib/chatbot/generated/transcripts.json (gitignored)
Sanity (project, blog, profile, aiProject; the first three carry a `chatbotQuestions` field)
   └─ fetched at request time, cached by tag `chatbot-corpus`, invalidated by the Sanity webhook
Both → one prompt-cached system block → Claude Haiku 4.5 → POST /api/chat
```

**Editing content:**
- **Transcripts** are the primary source. Edit the markdown files in `content/chatbot/transcripts/`. The `questions:` frontmatter on each file lists the only follow-up questions the model may suggest about it, so add only questions the file answers. A production build recompiles the corpus automatically; while `next dev` is running, run `npm run build:corpus` after editing.
- **Sanity content** needs no sync step. Publishing in the Studio triggers the webhook, which revalidates the `chatbot-corpus` tag, and the next chat request sees the change. Fill in `chatbotQuestions` on each project, post, and profile for the same reason as the frontmatter.
- **Suggested prompts** shown before the first message come from the `chatPrompts` singleton in Sanity. Every active prompt must be answerable from the corpus; `npm run validate:prompts` checks that.
- Follow-ups travel as a `FOLLOWUPS: [...]` trailer on the last line of each answer, parsed by `src/lib/chatbot/followups.ts` on both server and client.

**Commands:**

```bash
npm run build:corpus       # Compile transcripts into the generated JSON (also runs via prebuild and pretest)
npm run validate:prompts   # Post every active CMS prompt to /api/chat; fails on refusal or missing trailer
npm run eval:chat          # Fixed 8-question eval: answer length, lists, broken links, trailer; run before and after prompt edits
```

**Observability:** the route logs one JSON line per event (`chat.question`, `chat.answer`, `chat.error`, `chat.unavailable`). Read them with `vercel logs <deployment> | grep '"event":"chat.'`, which streams live logs for that deployment; add `--no-follow -n 1000` to search recent history instead. A daily GitHub Actions smoke test (`.github/workflows/chatbot-smoke.yml`) runs the prompt validation and known-answer checks against production.

**Documentation:**
- `src/lib/chatbot/README.md` - module guide, frontmatter format, caching, logs
- `docs/chatbot-functionality-audit-2026-10-09.md` - why the vector pipeline was replaced
- `docs/plans/2026-10-09-chatbot-remediation.md` - the implementation plan
- `docs/archive/chatbot-2025/` - retired Supabase-era documentation; do not follow it

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

### Code Quality & Linting

**ESLint is configured and enforced**

The project uses ESLint v9 with flat config format (`eslint.config.mjs`) for code quality enforcement.

**Running ESLint:**
```bash
npm run lint              # Check all files
npm run lint -- --fix     # Auto-fix issues where possible
npm run lint -- src/      # Lint specific directory
```

**Configuration highlights:**
- TypeScript-first with `@typescript-eslint` plugin
- Enforces consistent type imports (`import type`)
- Warns on `any` types (helps maintain type safety)
- Catches unused variables (prefix with `_` to indicate intentional)
- Allows `console.warn()` and `console.error()` (blocks other console methods)
- Relaxed rules for test files and scripts

**Common warnings you'll see:**
- `@typescript-eslint/no-unused-vars` - Remove unused variables or prefix with `_`
- `@typescript-eslint/no-explicit-any` - Replace `any` with specific types
- `@typescript-eslint/consistent-type-imports` - Use `import type` for type-only imports
- `no-console` - Replace `console.log()` with `console.warn()` or `console.error()`

**When to ignore rules:**
```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const legacy: any = thirdPartyLib(); // Sanity API requires any
```

**Integration:**
- Runs automatically during `npm run build`
- Warnings don't block builds (by design)
- Configure in `eslint.config.mjs`
- See Phase 1 of `/docs/technical-debt-resolution-plan-2025-11-22.md` for setup details

### Testing Requirements
- Always plan for tests when implementing new features
- Include test files in implementation plans
- Tests don't need to be written first, but should be part of the plan

### Git Commit Guidelines

**CRITICAL: Always ask before pushing to remote**

Commits are local and safe. You can commit freely, but **always ask permission before running `git push`**.

**Workflow:**
1. **Run `git status`** to review all modified and untracked files
2. **Run `npm run build`** before committing to catch type errors and build issues
3. **Commit related changes together** - all files needed for a feature should go in one atomic commit
4. **Ask: "Ready to push?"** and wait for explicit approval
5. **Only run `git push` after receiving "yes"**

**Example workflow:**
```bash
# 1. Check what changed
git status

# 2. Build to verify
npm run build

# 3. Commit related files together (no need to ask)
git add [files] && git commit -m "message"

# 4. STOP - Ask before pushing
# "I've committed the navigation changes. Ready to push?"

# 5. Only after approval
git push
```

**Examples:**
- ✅ GOOD: "I've committed the changes. Ready to push?"
- ❌ BAD: Running `git commit && git push` without asking first

**Why this matters:**
- Pushes affect the remote repository and production deployments
- Local commits can be amended or reset if needed
- Premature pushes can trigger unwanted CI/CD pipelines

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

### Style Compliance Guidelines

**IMPORTANT: Follow the centralized design system at all times**

**Compliance Status:** 100% as of November 2, 2025 (Phase 1-2 refactors complete)

1. **Use semantic color tokens** - Never hardcode colors
   ```tsx
   // ✅ GOOD: Semantic tokens
   <div className="bg-accent text-foreground border-border">
   <div className="bg-accent/10"> {/* Arbitrary opacity with token */}
   <div className="text-muted-foreground"> {/* Semantic text color */}

   // ❌ BAD: Hardcoded colors
   <div style={{ background: '#8B5CF6' }}>
   <div style={{ color: 'rgba(199, 128, 245, 0.3)' }}>
   <div className="bg-purple-500"> {/* Missing dark mode variant */}
   ```

2. **Use utility classes** from `globals.css` for common patterns
   ```tsx
   // ✅ GOOD: Predefined utilities
   <div className="transition-smooth">
   <div className="card-base">
   <div className="gradient-hero-title">
   <div className="metric-card">
   ```

3. **Use Tailwind arbitrary values** instead of inline styles
   ```tsx
   // ✅ GOOD: Tailwind arbitrary values
   <div className="w-[320px] text-[1.25rem] tracking-[0.15em]">

   // ❌ BAD: Inline styles
   <div style={{ width: '320px', fontSize: '1.25rem', letterSpacing: '0.15em' }}>
   ```

4. **Always include dark mode variants** on colored elements
   ```tsx
   // ✅ GOOD (but prefer semantic tokens)
   <div className="text-purple-400 dark:text-purple-300">

   // ✅ BETTER (semantic tokens handle dark mode automatically)
   <div className="text-accent">
   ```

5. **Use semantic transition durations**
   ```tsx
   // ✅ GOOD: Semantic durations
   <div className="transition-smooth"> {/* 300ms, ease-smooth */}
   <div className="duration-fast"> {/* 150ms */}

   // ❌ BAD: Magic numbers
   <div className="transition-all duration-300">
   ```

6. **Follow the exception policy** at `/docs/styling-exceptions.md`
   - Inline styles only for: dynamic calculations, complex gradients (document why), grid templates
   - All exceptions must have TSDoc comments explaining why

**Available Semantic Tokens:**
```tsx
// Core colors
bg-background, text-foreground, border-border

// Component-specific
bg-accent, text-accent-light, text-accent-foreground
bg-card, text-card-foreground
bg-navigation, text-navigation-foreground
bg-chat, text-chat-foreground
bg-muted, text-muted-foreground

// Utilities from globals.css
.gradient-hero-title, .gradient-hero-badge
.metric-card, .meta-info-item
.transition-smooth, .transition-fast, .transition-slow
.card-base, .card-interactive, .card-elevated
.flex-center, .flex-between, .absolute-center
```

**Documentation:**
- **Compliance Audit:** `/docs/tailwind-style-compliance-audit-2025-11-02.md` - Full audit results
- **Exception Policy:** `/docs/styling-exceptions.md` - When inline styles are acceptable
- **Implementation Plan:** `/docs/tailwind-compliance-refactor-plan.md` - Phased refactor guide

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

For detailed session history and recent accomplishments, see `/memory-bank/CURRENT.md`.