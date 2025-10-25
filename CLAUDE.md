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

### Key Architectural Decisions
1. **Component Library**: Uses shadcn/ui pattern - components are copied into the codebase rather than imported from a package, allowing full customization
2. **Sanity Integration**: Embedded Sanity Studio at `/studio` route with schemas defined in `/sanity/schemas/`
3. **Routing**: Next.js App Router with file-based routing in `/src/app/`
4. **Styling**: Utility-first with Tailwind CSS, using `cn()` utility from `/src/lib/utils.ts` for conditional classes

## Sanity CMS Configuration

- **Project ID**: 5n331bys
- **Dataset**: production
- **Studio Path**: http://localhost:3000/studio
- **Schemas**: profile (singleton), project, aiProject, heroOption, capability, contact, siteSettings, homepageIntro
- **Client**: Configured in `/src/lib/sanity/client.ts`

## Development Workflow

### Adding New Features
1. Components go in `/src/components/` (use existing patterns)
2. Pages go in `/src/app/` using Next.js App Router conventions
3. Sanity schemas go in `/sanity/schemas/` and must be imported in `sanity.config.ts`

### Code Style
- TypeScript with strict type checking
- Functional components with React.FC type
- Tailwind for styling (avoid inline styles)
- Use existing UI components from `/src/components/ui/` when possible

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

## Recent Updates

**October 25, 2025:**
- Fixed profile photo not displaying on homepage
- Converted profile schema to singleton
- Created comprehensive site/CMS audit (see `/docs/site-cms-audit-2025-10-25.md`)
- Updated CLAUDE.md with documentation guidelines