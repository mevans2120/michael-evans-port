# Phase 4: Full Next.js Migration - Implementation Plan

**Status**: Ready to Execute
**Migration Type**: Full (Option A) - Direct migration from React Router to Next.js App Router
**Target Location**: `/Users/michaelevans/michael-evans-port-main/nextjs-app/`
**Source Location**: `/Users/michaelevans/michael-evans-port-main/src/`

---

## Executive Summary

This plan provides a step-by-step guide to migrate the remaining 9 pages and shared components from the React + Vite portfolio to Next.js 15 with App Router. The migration is 70% complete, with all infrastructure, dependencies, and UI components already in place.

**Complexity**: Medium-High
**Estimated Time**: 6-8 hours
**Risk Level**: Low-Medium (Clear patterns established, infrastructure ready)

---

## Table of Contents

1. [Current State Assessment](#current-state-assessment)
2. [Migration Overview](#migration-overview)
3. [Pre-Migration Checklist](#pre-migration-checklist)
4. [Phase 1: Core Navigation Component](#phase-1-core-navigation-component)
5. [Phase 2: Homepage (Critical Path)](#phase-2-homepage-critical-path)
6. [Phase 3: Content Pages](#phase-3-content-pages)
7. [Phase 4: Dynamic Routes](#phase-4-dynamic-routes)
8. [Phase 5: AI Project Pages](#phase-5-ai-project-pages)
9. [Phase 6: Special Pages](#phase-6-special-pages)
10. [Phase 7: Supporting Components](#phase-7-supporting-components)
11. [Phase 8: Testing & Verification](#phase-8-testing--verification)
12. [Phase 9: Cleanup & Optimization](#phase-9-cleanup--optimization)
13. [Conversion Patterns Reference](#conversion-patterns-reference)
14. [Troubleshooting Guide](#troubleshooting-guide)

---

## Current State Assessment

### ✅ Completed (Phase 1-3)
- Next.js 15 project initialized
- All dependencies installed (React 19, TanStack Query, Framer Motion, etc.)
- Tailwind CSS configured
- All 48 shadcn/ui components migrated
- Route structure created in `/src/app/`
- Root layout with QueryProvider configured
- Sanity client and queries migrated

### 🔄 In Progress (Phase 4)
- Page components migration (0/9 complete)
- Navigation component conversion (pending)
- Supporting components migration (pending)

### 📋 Pending
- Testing and verification
- Old React app removal
- Production deployment configuration

---

## Migration Overview

### Pages Priority Matrix

| Priority | Page | Complexity | Blockers | Est. Time |
|----------|------|------------|----------|-----------|
| **P0** | Navigation.tsx | Medium | None | 30 min |
| **P0** | HomeMinimal.tsx | High | Navigation | 90 min |
| **P1** | About.tsx | Low | Navigation | 30 min |
| **P1** | AIShowcase.tsx | Medium | Navigation | 45 min |
| **P2** | CaseStudy.tsx | Medium | Navigation | 45 min |
| **P2** | Studio.tsx | High | None | 60 min |
| **P3** | AI Project Pages (4x) | Low | Navigation | 60 min |
| **P3** | NotFound.tsx | Low | None | 15 min |
| **P3** | Test Pages (3x) | Low | Navigation | 30 min |

### Dependency Graph

```
Navigation Component (P0)
  ├── HomeMinimal (P0)
  ├── About (P1)
  ├── AIShowcase (P1)
  ├── CaseStudy (P2)
  ├── AI Project Pages (P3)
  └── Test Pages (P3)

Studio (P2) - Independent

NotFound (P3) - Independent
```

---

## Pre-Migration Checklist

Before starting, verify:

- [ ] Current working directory: `/Users/michaelevans/michael-evans-port-main/nextjs-app/`
- [ ] All Phase 1-3 work is complete (run `npm run dev` to verify)
- [ ] Source files are accessible at `/Users/michaelevans/michael-evans-port-main/src/`
- [ ] Git repository is clean or changes are committed
- [ ] Node.js and npm are working (`node -v`, `npm -v`)

---

## Phase 1: Core Navigation Component

**Priority**: P0 (Blocks all other pages)
**Time Estimate**: 30 minutes
**Complexity**: Medium

### Why First?
The Navigation component is imported by all pages. Converting it first unblocks all other migrations.

### Steps

#### 1.1 Create Navigation Component Directory

```bash
mkdir -p /Users/michaelevans/michael-evans-port-main/nextjs-app/src/components
```

#### 1.2 Convert Navigation Component

**Source**: `/Users/michaelevans/michael-evans-port-main/src/components/Navigation.tsx`
**Target**: `/Users/michaelevans/michael-evans-port-main/nextjs-app/src/components/Navigation.tsx`

**Required Changes**:

1. **Add 'use client' directive** (component uses useState and useEffect)
2. **Replace React Router imports** with Next.js Link
3. **Update Link components** (to → href)

**Conversion Pattern**:

```typescript
// BEFORE (React Router)
import { Link } from "react-router-dom";

<Link to="/" className="...">
  Home
</Link>

// AFTER (Next.js)
'use client'

import Link from "next/link";

<Link href="/" className="...">
  Home
</Link>
```

**Full File Conversion**:

```typescript
'use client'

import { useState, useEffect } from "react";
import Link from "next/link";  // Changed from react-router-dom
import { Menu, X } from "lucide-react";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-lg font-medium text-foreground">
            M<span className="text-gradient">Evans</span>
          </Link>

          <button
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="navigation-menu"
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {isMenuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
            <span>Menu</span>
          </button>
        </div>

        {/* Navigation Menu */}
        {isMenuOpen && (
          <div
            id="navigation-menu"
            className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border/50 shadow-lg z-40"
            role="menu"
            aria-labelledby="menu-button"
          >
            <div className="container mx-auto px-6 py-6">
              <div className="flex flex-col gap-4">
                <Link
                  href="/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                  role="menuitem"
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                  role="menuitem"
                >
                  About
                </Link>
                <div className="border-t border-border/30 pt-4 mt-2">
                  <div className="text-xs text-muted-foreground/70 mb-3 px-0 uppercase tracking-wider">Case Studies</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Link
                      href="/case-studies/casa-bonita"
                      className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Casa Bonita Platform
                    </Link>
                    <Link
                      href="/case-studies/before-launcher"
                      className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Before Launcher
                    </Link>
                    <Link
                      href="/case-studies/virgin-america"
                      className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Virgin America Digital
                    </Link>
                    <Link
                      href="/case-studies/peddle"
                      className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Peddle Marketplace
                    </Link>
                  </div>
                </div>
                <div className="border-t border-border/30 pt-4 mt-2">
                  <div className="text-xs text-muted-foreground/70 mb-3 px-0 uppercase tracking-wider">AI Projects</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Link
                      href="/ai-projects/post-pal"
                      className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Post Pal
                    </Link>
                    <Link
                      href="/ai-projects/karuna-gatton"
                      className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      KarunaGatton.com
                    </Link>
                    <Link
                      href="/ai-projects/ai-research-agent"
                      className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      AI Research Agent
                    </Link>
                    <Link
                      href="/ai-projects/department-of-art"
                      className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      DepartmentOfArt.com
                    </Link>
                  </div>
                </div>
                <a
                  href="mailto:hello@mevans212.com"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors border-t border-border/30 pt-4 mt-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
```

#### 1.3 Verify Navigation Component

```bash
cd /Users/michaelevans/michael-evans-port-main/nextjs-app
npm run dev
```

Visit http://localhost:3000 and check browser console for errors related to Navigation.

**Success Criteria**:
- [ ] No TypeScript errors
- [ ] Component compiles without warnings
- [ ] Menu opens/closes on click
- [ ] Scroll behavior works (background changes)

---

## Phase 2: Homepage (Critical Path)

**Priority**: P0
**Time Estimate**: 90 minutes
**Complexity**: High (532 lines, complex state, Framer Motion, Sanity integration)

### Why Second?
The homepage is the entry point and demonstrates all conversion patterns. It's the most complex page.

### Steps

#### 2.1 Copy Supporting Components First

Before migrating HomeMinimal, copy the BentoImageBehind component it depends on:

```bash
# Create directory
mkdir -p /Users/michaelevans/michael-evans-port-main/nextjs-app/src/components/ai-showcase-variations

# Copy BentoImageBehind component
cp /Users/michaelevans/michael-evans-port-main/src/components/ai-showcase-variations/BentoImageBehind.tsx \
   /Users/michaelevans/michael-evans-port-main/nextjs-app/src/components/ai-showcase-variations/BentoImageBehind.tsx
```

**Then convert BentoImageBehind.tsx**:
- Add `'use client'` at the top
- Replace any `Link` imports: `import { Link } from "react-router-dom"` → `import Link from "next/link"`
- Update Link props: `to` → `href`

#### 2.2 Create Homepage File

**Source**: `/Users/michaelevans/michael-evans-port-main/src/pages/HomeMinimal.tsx`
**Target**: `/Users/michaelevans/michael-evans-port-main/nextjs-app/src/app/page.tsx`

#### 2.3 Convert HomeMinimal to page.tsx

**Key Changes Required**:

1. **Add 'use client' directive** (uses useState, useEffect, interactive features)
2. **Replace React Router imports** with Next.js
3. **Replace useNavigate() hook** with Next.js useRouter()
4. **Update all Link components**

**Conversion Pattern**:

```typescript
// BEFORE
import { Link, useNavigate } from 'react-router-dom';

const navigate = useNavigate();

const handleOptionClick = (index: number) => {
  setCurrentIndex(index);
  setIsOpen(false);
  setTimeout(() => {
    navigate(heroOptions[index].link);
  }, 300);
};

<Link to="/about" className="...">
  Learn more
</Link>

// AFTER
'use client'

import Link from 'next/link';
import { useRouter } from 'next/navigation';

const router = useRouter();

const handleOptionClick = (index: number) => {
  setCurrentIndex(index);
  setIsOpen(false);
  setTimeout(() => {
    router.push(heroOptions[index].link);
  }, 300);
};

<Link href="/about" className="...">
  Learn more
</Link>
```

**Full File Structure**:

```typescript
'use client'

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';  // Changed
import { useRouter } from 'next/navigation';  // Changed
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight, Code, Briefcase, User, Sparkles, ExternalLink, X } from 'lucide-react';
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import BentoImageBehind from "@/components/ai-showcase-variations/BentoImageBehind";
import { client } from "@/lib/sanity/client";
import { heroOptionsQuery } from "@/lib/sanity/queries";
import { transformHeroOptions } from "@/lib/sanity/transforms";
import type { HeroOption } from "@/types/sanity";
import { logger } from "@/lib/logger";

// ... rest of the component code ...
// Replace all instances of:
// - `Link to=` with `Link href=`
// - `useNavigate()` with `useRouter()`
// - `navigate()` with `router.push()`

export default function HomePage() {  // Changed from `const HomeMinimal: React.FC`
  const [currentIndex, setCurrentIndex] = useState(0);
  // ... rest of state ...
  const router = useRouter();  // Changed from useNavigate

  // ... rest of component logic ...

  const handleOptionClick = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(false);
    setTimeout(() => {
      router.push(heroOptions[index].link);  // Changed from navigate()
    }, 300);
  };

  return (
    <div className="...">
      <Navigation />
      {/* ... rest of JSX ... */}
    </div>
  );
}
```

#### 2.4 Copy Required Types and Utils

```bash
# Copy types if not already copied
mkdir -p /Users/michaelevans/michael-evans-port-main/nextjs-app/src/types
cp /Users/michaelevans/michael-evans-port-main/src/types/sanity.ts \
   /Users/michaelevans/michael-evans-port-main/nextjs-app/src/types/sanity.ts

# Copy logger utility
mkdir -p /Users/michaelevans/michael-evans-port-main/nextjs-app/src/lib
cp /Users/michaelevans/michael-evans-port-main/src/lib/logger.ts \
   /Users/michaelevans/michael-evans-port-main/nextjs-app/src/lib/logger.ts
```

#### 2.5 Test Homepage

```bash
npm run dev
```

Visit http://localhost:3000

**Verification Checklist**:
- [ ] Page loads without errors
- [ ] Hero text cycles through options
- [ ] Dropdown modal opens on click
- [ ] Navigation works (all links functional)
- [ ] Sanity data loads (or fallback data displays)
- [ ] Dark mode detection works
- [ ] Animations perform smoothly
- [ ] All images load
- [ ] Responsive on mobile

---

## Phase 3: Content Pages

**Priority**: P1
**Time Estimate**: 75 minutes total
**Complexity**: Low-Medium

### 3.1 About Page (30 minutes)

**Source**: `/Users/michaelevans/michael-evans-port-main/src/pages/About.tsx`
**Target**: `/Users/michaelevans/michael-evans-port-main/nextjs-app/src/app/about/page.tsx`

**Changes Required**:

1. Add `'use client'` (uses useEffect for data fetching)
2. No routing hooks to replace (doesn't use navigation)
3. Already imports Navigation component correctly

**Conversion Template**:

```typescript
'use client'

import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";  // Verify path
import Contact from "@/components/Contact";  // Need to migrate this
import { client } from "@/lib/sanity/client";
import { PortableText } from "@portabletext/react";
import { logger } from "@/lib/logger";

// ... rest of component (no changes needed to logic) ...

export default function AboutPage() {  // Changed export
  // ... component code ...
}
```

**Additional Step**: Migrate Contact component (if not already done):

```bash
cp /Users/michaelevans/michael-evans-port-main/src/components/Contact.tsx \
   /Users/michaelevans/michael-evans-port-main/nextjs-app/src/components/Contact.tsx
```

Convert Contact.tsx:
- Add `'use client'` if it has interactivity
- Update any Link components

### 3.2 AI Showcase Page (45 minutes)

**Source**: `/Users/michaelevans/michael-evans-port-main/src/pages/AIShowcase.tsx`
**Target**: `/Users/michaelevans/michael-evans-port-main/nextjs-app/src/app/ai-showcase/page.tsx`

**Changes Required**:

1. Add `'use client'` (uses custom hook)
2. Copy and convert `useAIProject.ts` hook
3. Update window.history.back() to use router

**Conversion Steps**:

```typescript
'use client'

import { ArrowRight, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";  // Add this
import Navigation from "@/components/Navigation";
import Contact from "@/components/Contact";
import { Button } from "@/components/ui/button";
import { useAllAIProjects } from "@/hooks/useAIProject";

export default function AIShowcasePage() {  // Changed export
  const { data: projects = [], loading, error } = useAllAIProjects();
  const router = useRouter();  // Add this

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {/* ... */}
      <Button
        variant="outline"
        size="lg"
        className="group"
        onClick={() => router.back()}  // Changed from window.history.back()
      >
        <ArrowRight className="w-5 h-5 mr-2 rotate-180" />
        Back to Home
      </Button>
      {/* ... */}
    </div>
  );
}
```

**Copy Hook**:

```bash
mkdir -p /Users/michaelevans/michael-evans-port-main/nextjs-app/src/hooks
cp /Users/michaelevans/michael-evans-port-main/src/hooks/useAIProject.ts \
   /Users/michaelevans/michael-evans-port-main/nextjs-app/src/hooks/useAIProject.ts
```

---

## Phase 4: Dynamic Routes

**Priority**: P2
**Time Estimate**: 45 minutes
**Complexity**: Medium (uses route parameters)

### 4.1 Case Study Page

**Source**: `/Users/michaelevans/michael-evans-port-main/src/pages/CaseStudy.tsx`
**Target**: `/Users/michaelevans/michael-evans-port-main/nextjs-app/src/app/case-studies/[slug]/page.tsx`

**Key Difference**: Next.js App Router handles params differently

**Conversion Pattern**:

```typescript
// BEFORE (React Router)
import { useParams } from "react-router-dom";

const CaseStudy = () => {
  const { slug } = useParams<{ slug: string }>();
  // ...
}

// AFTER (Next.js App Router)
'use client'

interface PageProps {
  params: {
    slug: string;
  };
}

export default function CaseStudyPage({ params }: PageProps) {
  const { slug } = params;
  // ...
}
```

**Full Conversion**:

```typescript
'use client'

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";  // Changed
import Navigation from "@/components/Navigation";
import { client } from "@/lib/sanity/client";
import { logger } from "@/lib/logger";

interface CaseStudyData {
  title: string;
  subtitle: string;
  description: string;
  category: string;
  metrics: {
    label: string;
    value: string;
  }[];
  achievements: string[];
}

const PROJECT_QUERY = `*[_type == "project" && slug.current == $slug][0] {
  title,
  "subtitle": summary,
  description,
  category,
  metrics[] {
    label,
    value
  },
  achievements
}`;

interface PageProps {
  params: {
    slug: string;
  };
}

export default function CaseStudyPage({ params }: PageProps) {  // Changed signature
  const { slug } = params;  // Changed from useParams()
  const [project, setProject] = useState<CaseStudyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProject() {
      if (!slug) {
        setError('No project slug provided');
        setLoading(false);
        return;
      }

      try {
        logger.log(`📡 Fetching case study: ${slug}`);
        const data = await client.fetch(PROJECT_QUERY, { slug });

        if (!data) {
          setError(`Project "${slug}" not found`);
        } else {
          setProject(data);
          logger.log(`✅ Successfully loaded ${slug}`);
        }
      } catch (err) {
        logger.error('Error fetching project:', err);
        setError(err instanceof Error ? err.message : 'Failed to load project');
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [slug]);

  // ... rest of component ...

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main id="main-content" role="main" className="pt-32 pb-12 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              ← Back to Portfolio
            </Link>
          </div>
          {/* ... rest of JSX ... */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            View More Projects
            <ArrowRight size={18} />
          </Link>
        </div>
      </main>
    </div>
  );
}
```

**Note**: Replace `<a href="/">` with `<Link href="/">` throughout.

---

## Phase 5: AI Project Pages

**Priority**: P3
**Time Estimate**: 60 minutes (15 min each × 4 pages)
**Complexity**: Low (all follow same pattern)

These pages are nearly identical in structure. Convert them in batch.

### 5.1 File Locations

| Page | Source | Target |
|------|--------|--------|
| PostPal | `/src/pages/ai-projects/PostPal.tsx` | `/nextjs-app/src/app/ai-projects/post-pal/page.tsx` |
| KarunaGatton | `/src/pages/ai-projects/KarunaGatton.tsx` | `/nextjs-app/src/app/ai-projects/karuna-gatton/page.tsx` |
| AIResearchAgent | `/src/pages/ai-projects/AIResearchAgent.tsx` | `/nextjs-app/src/app/ai-projects/ai-research-agent/page.tsx` |
| DepartmentOfArt | `/src/pages/ai-projects/DepartmentOfArt.tsx` | `/nextjs-app/src/app/ai-projects/department-of-art/page.tsx` |

### 5.2 Batch Conversion Template

All four pages follow this pattern:

```typescript
'use client'

import { ArrowRight, ExternalLink, Github } from "lucide-react";
import Link from "next/link";  // Changed
import Navigation from "@/components/Navigation";
import { useAIProject } from "@/hooks/useAIProject";

export default function ProjectPage() {  // Changed from const PostPal = () =>
  const { data: project, loading, error } = useAIProject('post-pal');  // Keep slug

  // ... rest of component (no logic changes) ...

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main id="main-content" role="main" className="pt-32 pb-12 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              ← Back to Portfolio
            </Link>
          </div>
          {/* ... rest of JSX ... */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            View More Projects
            <ArrowRight size={18} />
          </Link>
        </div>
      </main>
    </div>
  );
}
```

**Changes Per File**:
1. Add `'use client'`
2. Change import: `import { Link } from "react-router-dom"` → `import Link from "next/link"`
3. Update all `<Link to="...">` to `<Link href="...">`
4. Change export: `export default PostPal` → `export default function PostPalPage()`
5. Replace `<a href="/">` with `<Link href="/">`

### 5.3 Verification

After converting all four, test each route:
- http://localhost:3000/ai-projects/post-pal
- http://localhost:3000/ai-projects/karuna-gatton
- http://localhost:3000/ai-projects/ai-research-agent
- http://localhost:3000/ai-projects/department-of-art

---

## Phase 6: Special Pages

**Priority**: P2-P3
**Time Estimate**: 75 minutes
**Complexity**: Medium-High

### 6.1 Studio Page (60 minutes)

**Source**: `/Users/michaelevans/michael-evans-port-main/src/pages/Studio.tsx`
**Target**: `/Users/michaelevans/michael-evans-port-main/nextjs-app/src/app/studio/[[...tool]]/page.tsx`

**Why Complex**: Sanity Studio requires special handling for dynamic routes and SSR avoidance.

**Conversion**:

```typescript
'use client'

import React, { useEffect, useState } from 'react'

export default function StudioPage() {  // Changed export
  const [StudioComponent, setStudioComponent] = useState<any>(null)

  useEffect(() => {
    // Dynamically import Sanity Studio to avoid SSR issues
    const loadStudio = async () => {
      try {
        const { Studio } = await import('sanity')
        const { defineConfig } = await import('sanity')
        const { structureTool } = await import('sanity/structure')
        const { visionTool } = await import('@sanity/vision')

        // Update path to schemas - adjust based on your structure
        const { schemaTypes } = await import('../../../sanity/schemas')

        const config = defineConfig({
          name: 'default',
          title: 'Michael Evans Portfolio',
          projectId: '5n331bys',
          dataset: 'production',
          plugins: [structureTool(), visionTool()],
          schema: {
            types: schemaTypes,
          },
          basePath: '/studio',
        })

        setStudioComponent(() => () => <Studio config={config} />)
      } catch (error) {
        console.error('Failed to load Sanity Studio:', error)
      }
    }

    loadStudio()
  }, [])

  if (!StudioComponent) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Loading Sanity Studio...</h2>
      </div>
    )
  }

  return (
    <div style={{ height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0, zIndex: 9999 }}>
      <StudioComponent />
    </div>
  )
}
```

**Important**: The route uses catch-all segments `[[...tool]]` to handle Sanity Studio's internal routing.

**Verify Sanity Schemas**:
Ensure your schemas are accessible at the import path. You may need to copy them:

```bash
# Check if schemas exist in nextjs-app
ls /Users/michaelevans/michael-evans-port-main/nextjs-app/sanity/schemas/

# If not, copy from old location
cp -r /Users/michaelevans/michael-evans-port-main/sanity/ \
      /Users/michaelevans/michael-evans-port-main/nextjs-app/
```

### 6.2 NotFound Page (15 minutes)

**Source**: `/Users/michaelevans/michael-evans-port-main/src/pages/NotFound.tsx`
**Target**: `/Users/michaelevans/michael-evans-port-main/nextjs-app/src/app/not-found.tsx`

**Special Note**: This is a reserved Next.js filename. Place it at app root, not in a subfolder.

**Conversion**:

```typescript
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-6xl font-light mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">Page not found</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
```

**No 'use client' needed** (static page, no interactivity).

### 6.3 Test Pages (Optional - 30 minutes)

If you want to keep test pages for development:

**Pages**:
- NavigationTest → `/nextjs-app/src/app/nav-test/page.tsx`
- DropdownTest → `/nextjs-app/src/app/dropdown-test/page.tsx`
- AIShowcaseDesignTest → `/nextjs-app/src/app/ai-showcase-design-test/page.tsx`

**Quick Conversion** (same pattern for all):
1. Add `'use client'` (all have interactivity)
2. Update imports: `Link` from react-router → next/link
3. Update all Link props: `to` → `href`
4. Change export to default function

**Recommendation**: Consider skipping these and deleting them later if not actively used.

---

## Phase 7: Supporting Components

**Priority**: P1-P2
**Time Estimate**: 30 minutes
**Complexity**: Low

### 7.1 Identify Shared Components

Run this to find all components used by pages:

```bash
cd /Users/michaelevans/michael-evans-port-main/src/components
ls -la
```

Common components likely needed:
- ✅ Navigation (already migrated)
- Contact
- BentoImageBehind (already copied)
- Any other custom components

### 7.2 Convert Contact Component

**Source**: `/Users/michaelevans/michael-evans-port-main/src/components/Contact.tsx`
**Target**: `/Users/michaelevans/michael-evans-port-main/nextjs-app/src/components/Contact.tsx`

**Pattern**:
1. Check if it has state/effects → add `'use client'`
2. Update any Link components
3. No export change needed (it's a component, not a page)

### 7.3 Batch Copy Remaining Components

```bash
# Copy all components (excluding already migrated ones)
cd /Users/michaelevans/michael-evans-port-main/src/components

# List all .tsx files
find . -name "*.tsx" -type f

# Copy each one to nextjs-app and convert as needed
```

**For each component**:
- Read the file
- Check for React Router usage
- Add `'use client'` if needed
- Update imports
- Copy to new location

---

## Phase 8: Testing & Verification

**Priority**: P0 (Must complete before deployment)
**Time Estimate**: 60 minutes
**Complexity**: Medium

### 8.1 Development Server Testing

Start the Next.js dev server:

```bash
cd /Users/michaelevans/michael-evans-port-main/nextjs-app
npm run dev
```

### 8.2 Page-by-Page Verification

Test each route manually:

| Route | URL | Checklist |
|-------|-----|-----------|
| Home | http://localhost:3000 | Hero animation, dropdown, navigation, data loading |
| About | http://localhost:3000/about | Profile loads, image displays, bio renders |
| AI Showcase | http://localhost:3000/ai-showcase | Projects load, cards display, links work |
| Case Study | http://localhost:3000/case-studies/casa-bonita | Dynamic slug works, data loads |
| PostPal | http://localhost:3000/ai-projects/post-pal | Project details, links, metrics |
| Karuna | http://localhost:3000/ai-projects/karuna-gatton | Project details load |
| AI Agent | http://localhost:3000/ai-projects/ai-research-agent | Project details load |
| Dept of Art | http://localhost:3000/ai-projects/department-of-art | Project details load |
| Studio | http://localhost:3000/studio | Sanity Studio loads and functions |
| 404 | http://localhost:3000/random-404 | 404 page displays correctly |

### 8.3 Browser Console Check

Open DevTools Console (F12) on each page and verify:
- [ ] No React errors
- [ ] No hydration mismatches
- [ ] No missing module errors
- [ ] No 404s for assets
- [ ] Sanity client connects successfully

### 8.4 Responsive Testing

Test on different screen sizes:
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

### 8.5 Functionality Testing

Test interactive features:
- [ ] Navigation menu opens/closes
- [ ] Hero dropdown modal works
- [ ] Navigation between pages smooth
- [ ] Browser back/forward buttons work
- [ ] External links open in new tabs
- [ ] Forms submit (if any)
- [ ] Animations don't lag

### 8.6 Build Testing

Test production build:

```bash
npm run build
```

**Expected output**: No errors, successful build

```bash
npm run start
```

Visit http://localhost:3000 and re-test critical paths.

### 8.7 Accessibility Testing

- [ ] Keyboard navigation works
- [ ] Screen reader announcements (use NVDA/VoiceOver)
- [ ] Focus indicators visible
- [ ] ARIA labels correct
- [ ] Color contrast sufficient

---

## Phase 9: Cleanup & Optimization

**Priority**: P3 (Post-launch)
**Time Estimate**: 30 minutes
**Complexity**: Low

### 9.1 Remove Unused Files

Once Next.js app is verified working:

```bash
# DO NOT DELETE YET - keep old app as backup until deployed
# Just document what will be removed:

# These can be removed after successful deployment:
# - /Users/michaelevans/michael-evans-port-main/src/App.tsx
# - /Users/michaelevans/michael-evans-port-main/src/main.tsx
# - /Users/michaelevans/michael-evans-port-main/src/pages/ (entire directory)
# - /Users/michaelevans/michael-evans-port-main/index.html
# - Old Vite config
```

### 9.2 Update package.json Scripts

In `/Users/michaelevans/michael-evans-port-main/package.json`, update scripts to point to Next.js app:

```json
{
  "scripts": {
    "dev": "cd nextjs-app && npm run dev",
    "build": "cd nextjs-app && npm run build",
    "start": "cd nextjs-app && npm run start",
    "lint": "cd nextjs-app && npm run lint"
  }
}
```

### 9.3 Update Documentation

Update README.md:
- [ ] Change "Vite + React" to "Next.js 15 + App Router"
- [ ] Update dev server instructions
- [ ] Update build commands
- [ ] Update deployment instructions

### 9.4 Optimize Images

Convert images to Next.js Image component for better performance:

```typescript
// BEFORE
<img src="/image.jpg" alt="Description" />

// AFTER
import Image from 'next/image'

<Image
  src="/image.jpg"
  alt="Description"
  width={600}
  height={400}
  priority // for above-the-fold images
/>
```

**Note**: This is optional but recommended for performance.

### 9.5 Add Metadata

Add SEO metadata to each page:

```typescript
// In any page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About | Michael Evans',
  description: 'Learn about Michael Evans - AI/ML expert and creative technologist',
}
```

---

## Conversion Patterns Reference

Quick reference for common conversions.

### Pattern 1: Client Components

```typescript
// Add to any file that uses:
// - useState, useEffect, useContext
// - Event handlers (onClick, onChange, etc.)
// - Browser APIs (window, document)

'use client'
```

### Pattern 2: Link Components

```typescript
// BEFORE
import { Link } from 'react-router-dom'
<Link to="/about">About</Link>

// AFTER
import Link from 'next/link'
<Link href="/about">About</Link>
```

### Pattern 3: Navigation Hook

```typescript
// BEFORE
import { useNavigate } from 'react-router-dom'
const navigate = useNavigate()
navigate('/about')

// AFTER
import { useRouter } from 'next/navigation'
const router = useRouter()
router.push('/about')
```

### Pattern 4: Route Parameters

```typescript
// BEFORE
import { useParams } from 'react-router-dom'

const Component = () => {
  const { slug } = useParams<{ slug: string }>()
}

// AFTER
interface PageProps {
  params: { slug: string }
}

export default function Page({ params }: PageProps) {
  const { slug } = params
}
```

### Pattern 5: Location/Path Detection

```typescript
// BEFORE
import { useLocation } from 'react-router-dom'
const location = useLocation()
const isActive = location.pathname === '/about'

// AFTER
'use client'
import { usePathname } from 'next/navigation'
const pathname = usePathname()
const isActive = pathname === '/about'
```

### Pattern 6: Search Params

```typescript
// BEFORE
import { useSearchParams } from 'react-router-dom'
const [searchParams] = useSearchParams()
const query = searchParams.get('q')

// AFTER
'use client'
import { useSearchParams } from 'next/navigation'
const searchParams = useSearchParams()
const query = searchParams.get('q')
```

### Pattern 7: Default Exports

```typescript
// BEFORE (React Router pages)
const MyPage = () => {
  return <div>...</div>
}
export default MyPage

// AFTER (Next.js pages)
export default function MyPage() {
  return <div>...</div>
}
```

---

## Troubleshooting Guide

### Error: "You're importing a component that needs useState..."

**Cause**: Server Component trying to use client-side hooks.

**Solution**: Add `'use client'` at the top of the file.

```typescript
'use client'

import { useState } from 'react'
```

---

### Error: "Module not found: Can't resolve '@/components/...'"

**Cause**: Path alias not configured or component not migrated.

**Solution**:
1. Check `tsconfig.json` has correct paths
2. Verify component exists at expected location
3. Copy component from old location if missing

---

### Error: "Text content does not match server-rendered HTML"

**Cause**: Hydration mismatch - server and client render different content.

**Solution**:
1. Ensure no randomness or date calculations without keys
2. Wrap dynamic content in `useEffect`
3. Use `suppressHydrationWarning` on time/date elements

```typescript
<time suppressHydrationWarning>
  {new Date().toLocaleString()}
</time>
```

---

### Error: "useRouter only works in Client Components"

**Cause**: Forgot to add `'use client'` to a component using router.

**Solution**: Add `'use client'` directive.

---

### Error: "Cannot read properties of undefined (reading 'slug')"

**Cause**: Dynamic route params not passed correctly.

**Solution**: Ensure page component receives params prop:

```typescript
export default function Page({ params }: { params: { slug: string } }) {
  // params is now available
}
```

---

### Sanity Studio doesn't load

**Causes**:
1. Schemas not found at import path
2. SSR issue with Sanity packages

**Solutions**:
1. Verify schema import path is correct
2. Ensure Studio page uses `'use client'`
3. Check Sanity packages are installed
4. Verify `projectId` and `dataset` are correct

---

### Images not loading

**Cause**: Public directory not configured or wrong path.

**Solution**:
- Next.js serves static files from `/public`
- Reference as `/image.jpg` not `/public/image.jpg`
- Move images from old `public/` to new `/nextjs-app/public/`

---

### Styles not applying

**Causes**:
1. Tailwind not configured
2. Global CSS not imported
3. Class names wrong

**Solutions**:
1. Verify `tailwind.config.ts` includes correct content paths
2. Check `globals.css` is imported in root layout
3. Run `npm run dev` to rebuild

---

### Links don't work / page doesn't navigate

**Cause**: Still using `<a>` tags or `to` prop instead of `href`.

**Solution**: Replace all:
```typescript
<a href="/about">About</a>
// with
<Link href="/about">About</Link>
```

---

### "window is not defined"

**Cause**: Trying to access browser APIs in Server Component.

**Solution**: Add `'use client'` and wrap in useEffect:

```typescript
'use client'

useEffect(() => {
  if (typeof window !== 'undefined') {
    // Browser-only code
  }
}, [])
```

---

## Risk Matrix

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Routing bugs | Medium | High | Test all routes before deployment |
| Sanity connection issues | Low | High | Test data fetching early |
| Hydration errors | Medium | Medium | Add 'use client' strategically |
| Missing dependencies | Low | High | Verify package.json complete |
| Performance regression | Low | Medium | Run Lighthouse tests |
| Styling breaks | Low | Low | Keep Tailwind config identical |

---

## Success Metrics

At completion, verify:

- [ ] **Functionality**: All 9 pages work identically to old app
- [ ] **Performance**: Lighthouse score ≥ 90 for all metrics
- [ ] **Build**: `npm run build` succeeds with no errors
- [ ] **Dev Experience**: Hot reload works correctly
- [ ] **SEO**: Metadata present on all pages
- [ ] **Accessibility**: WCAG 2.1 AA compliance
- [ ] **Mobile**: All pages responsive on mobile devices
- [ ] **Browser Support**: Works in Chrome, Firefox, Safari, Edge

---

## Estimated Timeline

| Phase | Time | Cumulative |
|-------|------|------------|
| 1. Navigation | 30 min | 30 min |
| 2. Homepage | 90 min | 2h |
| 3. Content Pages | 75 min | 3h 15m |
| 4. Dynamic Routes | 45 min | 4h |
| 5. AI Projects | 60 min | 5h |
| 6. Special Pages | 75 min | 6h 15m |
| 7. Components | 30 min | 6h 45m |
| 8. Testing | 60 min | 7h 45m |
| 9. Cleanup | 30 min | 8h 15m |
| **Total** | **~8 hours** | |

**Actual time may vary** based on:
- Number of bugs encountered
- Testing thoroughness
- Familiarity with Next.js
- Sanity schema complexity

---

## Next Steps After Completion

1. **Deploy to Vercel/Netlify**
   - Connect Git repository
   - Configure environment variables
   - Deploy Next.js app

2. **Set Up CI/CD**
   - Add GitHub Actions for automated testing
   - Configure automatic deployments

3. **Performance Optimization**
   - Convert images to Next.js Image component
   - Add route prefetching
   - Implement ISR for Sanity content

4. **SEO Enhancement**
   - Add Open Graph meta tags
   - Generate sitemap
   - Add robots.txt
   - Implement JSON-LD structured data

5. **Monitoring**
   - Set up error tracking (Sentry)
   - Add analytics (Google Analytics, Plausible)
   - Monitor Core Web Vitals

---

## Appendix A: File Checklist

Complete checklist of all files to migrate:

### Pages (9 total)

- [ ] HomeMinimal.tsx → `/app/page.tsx`
- [ ] About.tsx → `/app/about/page.tsx`
- [ ] AIShowcase.tsx → `/app/ai-showcase/page.tsx`
- [ ] CaseStudy.tsx → `/app/case-studies/[slug]/page.tsx`
- [ ] PostPal.tsx → `/app/ai-projects/post-pal/page.tsx`
- [ ] KarunaGatton.tsx → `/app/ai-projects/karuna-gatton/page.tsx`
- [ ] AIResearchAgent.tsx → `/app/ai-projects/ai-research-agent/page.tsx`
- [ ] DepartmentOfArt.tsx → `/app/ai-projects/department-of-art/page.tsx`
- [ ] Studio.tsx → `/app/studio/[[...tool]]/page.tsx`
- [ ] NotFound.tsx → `/app/not-found.tsx`

### Components

- [ ] Navigation.tsx → `/components/Navigation.tsx`
- [ ] Contact.tsx → `/components/Contact.tsx`
- [ ] BentoImageBehind.tsx → `/components/ai-showcase-variations/BentoImageBehind.tsx`
- [ ] Other custom components as needed

### Hooks

- [ ] useAIProject.ts → `/hooks/useAIProject.ts`

### Utilities

- [ ] logger.ts → `/lib/logger.ts`
- [ ] featureFlags.ts → `/lib/featureFlags.ts` (if used)

### Types

- [ ] sanity.ts → `/types/sanity.ts`
- [ ] Other type definitions as needed

### Data (if applicable)

- [ ] `/data/` directory → `/nextjs-app/src/data/`

---

## Appendix B: Command Reference

Quick copy-paste commands for the migration:

```bash
# Set base paths
OLD_APP="/Users/michaelevans/michael-evans-port-main/src"
NEW_APP="/Users/michaelevans/michael-evans-port-main/nextjs-app/src"

# Create necessary directories
mkdir -p $NEW_APP/components/ai-showcase-variations
mkdir -p $NEW_APP/hooks
mkdir -p $NEW_APP/types
mkdir -p $NEW_APP/data

# Copy components
cp $OLD_APP/components/Navigation.tsx $NEW_APP/components/
cp $OLD_APP/components/Contact.tsx $NEW_APP/components/
cp $OLD_APP/components/ai-showcase-variations/BentoImageBehind.tsx $NEW_APP/components/ai-showcase-variations/

# Copy hooks
cp $OLD_APP/hooks/useAIProject.ts $NEW_APP/hooks/

# Copy utilities
cp $OLD_APP/lib/logger.ts $NEW_APP/lib/
cp $OLD_APP/lib/featureFlags.ts $NEW_APP/lib/

# Copy types
cp $OLD_APP/types/sanity.ts $NEW_APP/types/

# Copy data (if exists)
cp -r $OLD_APP/data/* $NEW_APP/data/

# Start dev server
cd /Users/michaelevans/michael-evans-port-main/nextjs-app
npm run dev
```

---

## Appendix C: Diff Example

Example of a complete file conversion:

**BEFORE (React Router)**:
```typescript
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  return (
    <div>
      <h1>About</h1>
      <Link to="/contact">Contact</Link>
      <button onClick={handleClick}>Go Home</button>
    </div>
  );
};

export default About;
```

**AFTER (Next.js)**:
```typescript
'use client'

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AboutPage() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/");
  };

  return (
    <div>
      <h1>About</h1>
      <Link href="/contact">Contact</Link>
      <button onClick={handleClick}>Go Home</button>
    </div>
  );
}
```

**Changes Made**:
1. ✅ Added `'use client'` directive
2. ✅ Changed import: `react-router-dom` → `next/link` and `next/navigation`
3. ✅ Changed `useNavigate()` → `useRouter()`
4. ✅ Changed `navigate()` → `router.push()`
5. ✅ Changed `Link to` → `Link href`
6. ✅ Changed export: `export default About` → `export default function AboutPage()`

---

## Support & Resources

- **Next.js Documentation**: https://nextjs.org/docs
- **App Router Migration Guide**: https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration
- **React Router to Next.js**: https://nextjs.org/docs/app/building-your-application/upgrading/from-react-router
- **Sanity + Next.js**: https://www.sanity.io/docs/nextjs

---

## Conclusion

This plan provides a complete, step-by-step guide to migrate your React + Vite portfolio to Next.js 15. By following the phases in order and using the provided conversion patterns, you should complete the migration in approximately 8 hours.

Key success factors:
1. **Start with Navigation** - Unblocks all other work
2. **Test incrementally** - Verify each page works before moving on
3. **Follow patterns consistently** - All pages follow similar conversion logic
4. **Keep old app intact** - Don't delete until new app is deployed

The infrastructure is already in place from Phases 1-3, so you're starting from a solid foundation. Focus on converting components one at a time, testing thoroughly, and documenting any issues you encounter.

Good luck with the migration! 🚀
