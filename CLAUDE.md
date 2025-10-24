# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Michael Evans' portfolio website built with React, TypeScript, Vite, and Sanity CMS. A modern, responsive portfolio showcasing AI/ML expertise, creative technology solutions, and professional case studies.

## Essential Commands

```bash
# Development
npm run dev              # Start dev server on http://localhost:8080
npm run build            # Build for production
npm run build:dev        # Build for development
npm run preview          # Preview production build
npm run lint             # Run ESLint
npm run sanity           # Start Sanity Studio dev server
npm run migrate          # Run Sanity migration script
```

## Architecture Overview

### Tech Stack
- **Framework**: React 18.3 with TypeScript 5.8
- **Build Tool**: Vite 5.4 (configured to run on port 8080)
- **Styling**: Tailwind CSS 3.4 with shadcn/ui components
- **CMS**: Sanity (Project ID: 5n331bys, Dataset: production)
- **State Management**: TanStack Query 5.83
- **Routing**: React Router DOM 6.30
- **UI Components**: Radix UI primitives via shadcn/ui

### Project Structure
- `/src/components/ui/` - shadcn/ui components (50+ pre-built components)
- `/src/pages/` - Route components for each page
- `/src/lib/sanity/` - Sanity client configuration and queries
- `/src/sanity-schemas/` - Sanity schema definitions (project, profile, capability)
- `/sanity/` - Sanity Studio configuration
- `@/` alias resolves to `/src/` directory

### Key Architectural Decisions
1. **Component Library**: Uses shadcn/ui pattern - components are copied into the codebase rather than imported from a package, allowing full customization
2. **Sanity Integration**: Embedded Sanity Studio at `/studio` route with schemas defined in `/src/sanity-schemas/`
3. **Routing**: All routes defined in `App.tsx`, with catch-all route for 404 handling
4. **Styling**: Utility-first with Tailwind CSS, using `cn()` utility from `/src/lib/utils.ts` for conditional classes

## Sanity CMS Configuration

- **Project ID**: 5n331bys
- **Dataset**: production
- **Studio Path**: `/studio`
- **Schemas**: project, profile, capability
- **Client**: Configured in `/src/lib/sanity/client.ts`

## Development Workflow

### Adding New Features
1. Components go in `/src/components/` (use existing patterns)
2. Pages go in `/src/pages/` and must be added to routes in `App.tsx`
3. Sanity schemas go in `/src/sanity-schemas/` and must be imported in `sanity.config.ts`

### Code Style
- TypeScript with strict type checking
- Functional components with React.FC type
- Tailwind for styling (avoid inline styles)
- Use existing UI components from `/src/components/ui/` when possible

### Important Files
- `/src/App.tsx` - Main routing configuration
- `/src/sanity.config.ts` - Sanity Studio configuration
- `/vite.config.ts` - Vite build configuration (port 8080)
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
- Complete routing for all pages and case studies
- Sanity CMS integration prepared but data migration pending
- All UI components from shadcn/ui library available
- Responsive design implemented
- TypeScript throughout the codebase

## Notes for Development

- The site runs on port 8080 (configured in vite.config.ts)
- Sanity Studio is embedded at `/studio` route
- All custom routes must be defined before the catch-all `*` route in App.tsx
- Use the `cn()` utility for combining Tailwind classes with conditional logic
- Memory bank system documented in `/memory-bank/` for development continuity
- 4 please