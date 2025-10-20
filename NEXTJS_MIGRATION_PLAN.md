# Next.js Migration Plan

## Overview

This document outlines a comprehensive plan for migrating the Michael Evans portfolio from React + Vite to Next.js 15 with the App Router.

## Project Current State

**Current Stack:**
- React 18.3 with TypeScript 5.8
- Vite 5.4 (port 8080)
- React Router DOM 6.30
- Tailwind CSS 3.4 with shadcn/ui components
- Sanity CMS (Project: 5n331bys, Dataset: production)
- TanStack Query 5.83
- 50+ Radix UI components via shadcn/ui

**Routes (13 total):**
- `/` - Home (HomeMinimal)
- `/about` - About page
- `/ai-showcase` - AI projects showcase
- `/ai-research` - AI research page
- `/case-studies/:slug` - Dynamic case studies
- `/ai-projects/post-pal` - PostPal project
- `/ai-projects/karuna-gatton` - Karuna Gatton project
- `/ai-projects/ai-research-agent` - AI Research Agent
- `/ai-projects/department-of-art` - Department of Art
- `/studio/*` - Embedded Sanity Studio
- `/nav-test` - Navigation test page
- `/dropdown-test` - Dropdown test page
- `/ai-showcase-design-test` - Design test page

---

## Phase 1: Project Assessment & Setup

### Key Decisions

**Router Choice:** App Router (recommended)
- Modern React Server Components
- Better performance and SEO
- Improved data fetching patterns
- Streaming and Suspense support

**Next.js Version:** 15.x (latest stable)

**Migration Strategy:** Clean Slate (Recommended)
- Start fresh Next.js project
- Copy components incrementally
- Test each section before moving on
- Deploy in parallel, switch when ready

### Tasks

1. **Create New Next.js Project**
   ```bash
   npx create-next-app@latest portfolio-nextjs
   # Select: TypeScript, ESLint, Tailwind CSS, App Router, src/ directory
   ```

2. **Configure Port 8080**
   ```javascript
   // package.json
   "scripts": {
     "dev": "next dev -p 8080"
   }
   ```

3. **Review Dependencies Compatibility**

**Dependencies to Replace:**
- `vite` → Next.js built-in bundler
- `react-router-dom` → Next.js App Router
- `@vitejs/plugin-react-swc` → Next.js built-in (uses SWC)

**Dependencies to Keep (100% compatible):**
- All Radix UI components (@radix-ui/*)
- Sanity packages (with minor adjustments)
- Tailwind CSS and plugins
- shadcn/ui components
- class-variance-authority, clsx, tailwind-merge
- lucide-react icons
- framer-motion
- date-fns

**Dependencies to Evaluate:**
- `@tanstack/react-query` - Optional with Server Components
- `next-themes` - Already Next.js compatible
- All form libraries - Keep as-is

4. **Set Up Git Branch**
   ```bash
   git checkout -b migration/nextjs
   ```

### Deliverables
- [ ] Next.js project initialized
- [ ] Dependencies documented
- [ ] Migration branch created
- [ ] Development environment working

---

## Phase 2: Core Configuration

### Tasks

#### 1. TypeScript Configuration

Create/update `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

#### 2. Tailwind Configuration

Copy and adapt `tailwind.config.js`:
```javascript
import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    // Copy existing theme configuration from current project
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // Copy all custom theme extensions
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config

export default config
```

Update `globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Copy all custom CSS from current project */
@layer base {
  :root {
    /* Copy CSS variables */
  }
}
```

#### 3. Environment Variables

Create `.env.local`:
```bash
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=5n331bys
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01

# Add any other environment variables
```

**Important:** Prefix client-side variables with `NEXT_PUBLIC_`

#### 4. Next.js Configuration

Create/update `next.config.js`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.sanity.io'], // For Sanity images
    formats: ['image/avif', 'image/webp'],
  },
  // Enable React Server Components
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
```

### Deliverables
- [ ] TypeScript configured with path aliases
- [ ] Tailwind CSS working with existing theme
- [ ] Environment variables set up
- [ ] Next.js config optimized for Sanity

---

## Phase 3: Component Migration

### Tasks

#### 1. Copy Component Library

**No changes needed for most components!**

```bash
# Copy entire UI component library
cp -r src/components/ui/ [next-project]/src/components/ui/
```

**Add 'use client' directive to interactive components:**
- All Radix UI components (Dialog, Dropdown, etc.)
- Components using hooks (useState, useEffect)
- Components with event handlers
- framer-motion components

Example:
```tsx
'use client'

import * as React from "react"
import { Button } from "@/components/ui/button"

export function InteractiveComponent() {
  const [state, setState] = React.useState(false)
  return <Button onClick={() => setState(true)}>Click</Button>
}
```

#### 2. Copy Utility Functions

```bash
# Copy lib directory
cp -r src/lib/utils.ts [next-project]/src/lib/
cp -r src/lib/sanity/ [next-project]/src/lib/sanity/
```

**Update imports if needed** - path aliases should work the same

#### 3. Component Audit Checklist

Mark each component type:
- [ ] Pure presentational components (can be Server Components)
- [ ] Interactive components (need 'use client')
- [ ] Layout components (check for useRouter, usePathname)
- [ ] Form components (likely need 'use client')

#### 4. Navigation Component Update

Current: Uses `react-router-dom`
```tsx
import { Link, useLocation } from 'react-router-dom'
```

Update to:
```tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Navigation() {
  const pathname = usePathname()
  const isActive = (path: string) => pathname === path

  return (
    <nav>
      <Link href="/" className={isActive('/') ? 'active' : ''}>
        Home
      </Link>
    </nav>
  )
}
```

### Deliverables
- [ ] All shadcn/ui components copied
- [ ] Client directives added where needed
- [ ] Navigation component updated
- [ ] Utility functions migrated

---

## Phase 4: Routing Migration

### Route Mapping

**React Router → Next.js App Router:**

| Current Route | Next.js Location |
|--------------|------------------|
| `/` | `/src/app/page.tsx` |
| `/about` | `/src/app/about/page.tsx` |
| `/ai-showcase` | `/src/app/ai-showcase/page.tsx` |
| `/ai-research` | `/src/app/ai-research/page.tsx` |
| `/case-studies/:slug` | `/src/app/case-studies/[slug]/page.tsx` |
| `/ai-projects/post-pal` | `/src/app/ai-projects/post-pal/page.tsx` |
| `/ai-projects/karuna-gatton` | `/src/app/ai-projects/karuna-gatton/page.tsx` |
| `/ai-projects/ai-research-agent` | `/src/app/ai-projects/ai-research-agent/page.tsx` |
| `/ai-projects/department-of-art` | `/src/app/ai-projects/department-of-art/page.tsx` |
| `/studio/*` | `/src/app/studio/[[...index]]/page.tsx` |
| `/nav-test` | `/src/app/nav-test/page.tsx` |
| `/dropdown-test` | `/src/app/dropdown-test/page.tsx` |
| `/ai-showcase-design-test` | `/src/app/ai-showcase-design-test/page.tsx` |
| 404 | `/src/app/not-found.tsx` |

### Tasks

#### 1. Create Root Layout

`/src/app/layout.tsx`:
```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { QueryClientProvider } from '@/components/providers/query-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Michael Evans | AI/ML Portfolio',
  description: 'Portfolio showcasing AI/ML expertise and creative technology solutions',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
        >
          Skip to main content
        </a>
        <QueryClientProvider>
          {children}
          <Toaster />
          <Sonner />
        </QueryClientProvider>
      </body>
    </html>
  )
}
```

#### 2. Create Query Provider (Client Component)

`/src/components/providers/query-provider.tsx`:
```tsx
'use client'

import { QueryClient, QueryClientProvider as TanStackProvider } from '@tanstack/react-query'
import { useState } from 'react'

export function QueryClientProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <TanStackProvider client={queryClient}>
      {children}
    </TanStackProvider>
  )
}
```

#### 3. Convert Page Components

**Pattern for Static Pages:**
```tsx
// /src/app/about/page.tsx
import { AboutContent } from '@/components/about-content'

export default function AboutPage() {
  return <AboutContent />
}
```

**Pattern for Dynamic Pages:**
```tsx
// /src/app/case-studies/[slug]/page.tsx
import { client } from '@/lib/sanity/client'

interface PageProps {
  params: { slug: string }
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = params
  const project = await client.fetch(query, { slug })

  return <div>{/* Render project */}</div>
}
```

#### 4. Update Hook Usage

**React Router → Next.js:**
- `useParams()` → `params` prop
- `useNavigate()` → `useRouter()` from `next/navigation`
- `useLocation()` → `usePathname()` from `next/navigation`
- `useSearchParams()` → `useSearchParams()` from `next/navigation`

Example:
```tsx
// Before
import { useNavigate, useParams } from 'react-router-dom'

function Component() {
  const { slug } = useParams()
  const navigate = useNavigate()
  // ...
}

// After
'use client'
import { useRouter } from 'next/navigation'

function Component({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const { slug } = params
  // router.push('/path') to navigate
}
```

#### 5. Create Not Found Page

`/src/app/not-found.tsx`:
```tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/">Return Home</Link>
    </div>
  )
}
```

### Deliverables
- [ ] Root layout created with providers
- [ ] All 13 routes converted
- [ ] Dynamic routes working with params
- [ ] Navigation between pages working
- [ ] 404 page implemented

---

## Phase 5: Sanity CMS Integration

### Tasks

#### 1. Update Sanity Client

`/src/lib/sanity/client.ts`:
```typescript
import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  useCdn: false, // Set to false for server-side, or use env variable
  perspective: 'published',
})

// For generating image URLs
const builder = imageUrlBuilder(client)

export function urlForImage(source: any) {
  return builder.image(source)
}
```

#### 2. Server-Side Client (Optional)

For draft mode or server-only operations:
```typescript
// /src/lib/sanity/server-client.ts
import { createClient } from '@sanity/client'

export const serverClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // For writes/drafts
})
```

#### 3. Update Sanity Queries

Copy and adapt queries from `/src/lib/sanity/queries.ts`:
```typescript
// Add proper TypeScript types
export const projectsQuery = `*[_type == "project"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  description,
  mainImage,
  publishedAt
}`

export const projectBySlugQuery = `*[_type == "project" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  description,
  mainImage,
  body,
  publishedAt
}`
```

#### 4. Sanity Studio Integration

**Option A: Embedded Studio (Current Approach)**

`/src/app/studio/[[...index]]/page.tsx`:
```tsx
'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity.config'

export default function StudioPage() {
  return <NextStudio config={config} />
}
```

Install required package:
```bash
npm install next-sanity
```

**Option B: Separate Deployment (Recommended)**
- Keep `/sanity` folder as standalone project
- Deploy to `studio.yourdomain.com`
- Simpler Next.js setup
- Better separation of concerns

#### 5. Image Handling

Update image components to use `next/image`:
```tsx
import Image from 'next/image'
import { urlForImage } from '@/lib/sanity/client'

<Image
  src={urlForImage(image).width(800).height(600).url()}
  alt={alt}
  width={800}
  height={600}
  className="rounded-lg"
/>
```

### Deliverables
- [ ] Sanity client configured for Next.js
- [ ] Queries updated and typed
- [ ] Studio integration working
- [ ] Image optimization implemented
- [ ] Environment variables configured

---

## Phase 6: Data Fetching Migration

### Approach Decision

**Option A: Server Components (Recommended)**
- Fetch data directly in Server Components
- Better performance, SEO, and security
- Simpler code, no extra libraries needed

**Option B: Keep TanStack Query**
- Use for client-side data needs
- Good for real-time updates
- Familiar patterns

**Recommended: Hybrid Approach**
- Server Components for initial data
- TanStack Query for client-side mutations/updates

### Tasks

#### 1. Server Component Data Fetching

Example for AI Showcase page:
```tsx
// /src/app/ai-showcase/page.tsx
import { client } from '@/lib/sanity/client'
import { projectsQuery } from '@/lib/sanity/queries'

// This is a Server Component by default
export default async function AIShowcasePage() {
  const projects = await client.fetch(projectsQuery, {}, {
    next: {
      revalidate: 60, // ISR - revalidate every 60 seconds
      // or use: revalidate: false for SSG
      // or use: { revalidate: 0 } for SSR
    }
  })

  return (
    <div>
      <h1>AI Showcase</h1>
      <ProjectGrid projects={projects} />
    </div>
  )
}
```

#### 2. Dynamic Pages with Data

```tsx
// /src/app/case-studies/[slug]/page.tsx
import { client } from '@/lib/sanity/client'
import { projectBySlugQuery } from '@/lib/sanity/queries'
import { notFound } from 'next/navigation'

interface PageProps {
  params: { slug: string }
}

export async function generateStaticParams() {
  const projects = await client.fetch(`*[_type == "project"]{ "slug": slug.current }`)
  return projects.map((project: any) => ({
    slug: project.slug,
  }))
}

export default async function CaseStudyPage({ params }: PageProps) {
  const project = await client.fetch(projectBySlugQuery, { slug: params.slug })

  if (!project) {
    notFound()
  }

  return <ProjectDetail project={project} />
}
```

#### 3. Loading States

Create `loading.tsx` in route folders:
```tsx
// /src/app/ai-showcase/loading.tsx
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
    </div>
  )
}
```

#### 4. Error Boundaries

Create `error.tsx` in route folders:
```tsx
// /src/app/ai-showcase/error.tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
```

#### 5. Client-Side Data (If Needed)

For client-side data fetching, keep TanStack Query:
```tsx
'use client'

import { useQuery } from '@tanstack/react-query'

export function ClientComponent() {
  const { data, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await fetch('/api/projects')
      return response.json()
    }
  })

  // ...
}
```

### Revalidation Strategies

**Static Site Generation (SSG):**
```typescript
{ next: { revalidate: false } }
```

**Incremental Static Regeneration (ISR):**
```typescript
{ next: { revalidate: 60 } } // Revalidate every 60 seconds
```

**Server-Side Rendering (SSR):**
```typescript
{ next: { revalidate: 0 } }
```

### Deliverables
- [ ] All pages fetching data correctly
- [ ] Loading states implemented
- [ ] Error boundaries added
- [ ] ISR/SSG strategy decided and implemented
- [ ] Client-side queries working (if needed)

---

## Phase 7: Optimization

### Tasks

#### 1. Image Optimization

**Replace all `<img>` tags with `next/image`:**

Before:
```tsx
<img src={imageUrl} alt="Project" className="w-full h-auto" />
```

After:
```tsx
import Image from 'next/image'

<Image
  src={imageUrl}
  alt="Project"
  width={1200}
  height={800}
  className="w-full h-auto"
  priority={false} // Set true for above-fold images
/>
```

**Sanity Images:**
```tsx
import Image from 'next/image'
import { urlForImage } from '@/lib/sanity/client'

<Image
  src={urlForImage(project.mainImage).width(1200).height(800).url()}
  alt={project.title}
  width={1200}
  height={800}
  className="rounded-lg"
/>
```

#### 2. Metadata & SEO

**Static Metadata:**
```tsx
// /src/app/about/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About | Michael Evans',
  description: 'Learn about my background in AI/ML and creative technology',
  openGraph: {
    title: 'About | Michael Evans',
    description: 'Learn about my background in AI/ML and creative technology',
    images: ['/og-image.jpg'],
  },
}

export default function AboutPage() {
  // ...
}
```

**Dynamic Metadata:**
```tsx
// /src/app/case-studies/[slug]/page.tsx
import type { Metadata } from 'next'

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const project = await client.fetch(projectBySlugQuery, { slug: params.slug })

  return {
    title: `${project.title} | Michael Evans`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: [urlForImage(project.mainImage).width(1200).height(630).url()],
    },
  }
}
```

#### 3. Font Optimization

```tsx
// /src/app/layout.tsx
import { Inter, Roboto_Mono } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`}>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
```

#### 4. Performance Optimizations

**Streaming with Suspense:**
```tsx
import { Suspense } from 'react'

export default function Page() {
  return (
    <div>
      <Header />
      <Suspense fallback={<ProjectsSkeleton />}>
        <Projects />
      </Suspense>
    </div>
  )
}
```

**Dynamic Imports:**
```tsx
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('@/components/heavy-component'), {
  loading: () => <p>Loading...</p>,
  ssr: false, // Disable SSR if needed
})
```

#### 5. Analytics

**Vercel Analytics (if using Vercel):**
```tsx
// /src/app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

#### 6. Bundle Analysis

Add to `package.json`:
```json
{
  "scripts": {
    "analyze": "ANALYZE=true next build"
  }
}
```

Install bundle analyzer:
```bash
npm install @next/bundle-analyzer
```

Update `next.config.js`:
```javascript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(nextConfig)
```

### Deliverables
- [ ] All images optimized with next/image
- [ ] Metadata implemented (static and dynamic)
- [ ] Fonts optimized
- [ ] Streaming/Suspense implemented
- [ ] Analytics configured
- [ ] Bundle size analyzed and optimized

---

## Phase 8: Testing & Validation

### Manual Testing Checklist

#### Route Testing
- [ ] `/` - Home page loads correctly
- [ ] `/about` - About page displays
- [ ] `/ai-showcase` - Projects grid displays
- [ ] `/ai-research` - Research page loads
- [ ] `/case-studies/[slug]` - Dynamic routes work
- [ ] `/ai-projects/post-pal` - Individual project pages
- [ ] `/ai-projects/karuna-gatton`
- [ ] `/ai-projects/ai-research-agent`
- [ ] `/ai-projects/department-of-art`
- [ ] `/studio` - Sanity Studio accessible
- [ ] `/nav-test` - Test pages work
- [ ] `/dropdown-test`
- [ ] `/ai-showcase-design-test`
- [ ] `/invalid-route` - 404 page displays

#### Navigation Testing
- [ ] All internal links work
- [ ] Navigation highlights active page
- [ ] Browser back/forward works
- [ ] Deep linking works
- [ ] Hash links work (if any)

#### Data & CMS Testing
- [ ] Sanity data loads correctly
- [ ] Images from Sanity display
- [ ] Dynamic content updates
- [ ] Studio can create/edit content
- [ ] Changes reflect on frontend

#### Visual & Responsive Testing
- [ ] Desktop layout (1920px+)
- [ ] Laptop (1440px)
- [ ] Tablet (768px)
- [ ] Mobile (375px)
- [ ] Dark mode (if applicable)
- [ ] All components render correctly

#### Performance Testing
- [ ] Run Lighthouse audit
  - Performance > 90
  - Accessibility > 90
  - Best Practices > 90
  - SEO > 90
- [ ] Check Core Web Vitals
  - LCP < 2.5s
  - FID < 100ms
  - CLS < 0.1
- [ ] Test on 3G network
- [ ] Check bundle size

#### Browser Compatibility
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

#### Functionality Testing
- [ ] Forms submit correctly (if any)
- [ ] Client-side interactions work
- [ ] Animations/transitions smooth
- [ ] Error states display
- [ ] Loading states display
- [ ] Skip navigation works

### Automated Testing

**Setup Jest for Next.js:**
```bash
npm install -D jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom
```

**Run tests:**
```bash
npm run test
```

### Performance Comparison

Create comparison document:
- Build time (Vite vs Next.js)
- Bundle size
- Initial load time
- Time to Interactive
- First Contentful Paint

### Pre-Launch Checklist

#### Configuration
- [ ] Environment variables set correctly
- [ ] Sanity credentials working
- [ ] Error tracking configured
- [ ] Analytics configured

#### SEO
- [ ] Meta tags on all pages
- [ ] Open Graph images
- [ ] Sitemap generated
- [ ] robots.txt configured

#### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader tested
- [ ] ARIA labels correct
- [ ] Color contrast passes WCAG

#### Security
- [ ] No exposed API keys
- [ ] CSP headers configured
- [ ] HTTPS enforced
- [ ] Dependencies updated

### Deliverables
- [ ] All manual tests passed
- [ ] Performance benchmarks documented
- [ ] Cross-browser testing complete
- [ ] Accessibility audit passed
- [ ] Pre-launch checklist complete

---

## Deployment

### Vercel (Recommended)

1. **Connect GitHub Repository**
   - Go to vercel.com
   - Import project
   - Connect to GitHub repo

2. **Configure Environment Variables**
   - Add all `NEXT_PUBLIC_*` variables
   - Add any secret variables

3. **Deploy**
   - Automatic deployments on push
   - Preview deployments for PRs

### Alternative Platforms

**Netlify:**
- Similar to Vercel
- Add build command: `npm run build`
- Publish directory: `.next`

**Self-Hosted:**
```bash
npm run build
npm run start
```

Use PM2 or Docker for production

---

## Migration Timeline

### Time Estimates

| Phase | Duration | Complexity |
|-------|----------|------------|
| Phase 1: Setup | 2-4 hours | Low |
| Phase 2: Configuration | 2-3 hours | Low |
| Phase 3: Components | 2-3 hours | Low-Medium |
| Phase 4: Routing | 4-6 hours | Medium-High |
| Phase 5: Sanity | 3-4 hours | Medium |
| Phase 6: Data Fetching | 3-5 hours | Medium |
| Phase 7: Optimization | 2-4 hours | Medium |
| Phase 8: Testing | 4-6 hours | Medium |
| **Total** | **22-35 hours** | **Medium** |

### Suggested Schedule

**Week 1:**
- Day 1-2: Phases 1-3 (Setup, Config, Components)
- Day 3-4: Phase 4 (Routing)
- Day 5: Phase 5 (Sanity)

**Week 2:**
- Day 1-2: Phase 6 (Data Fetching)
- Day 3: Phase 7 (Optimization)
- Day 4-5: Phase 8 (Testing & Fixes)

---

## Key Benefits

### Performance
- Server Components reduce client-side JavaScript
- Automatic code splitting per route
- Image optimization (WebP/AVIF)
- Built-in caching and revalidation

### SEO
- True server-side rendering
- Better meta tags and Open Graph
- Faster initial page load
- Automatic sitemap generation

### Developer Experience
- File-based routing (simpler)
- Built-in TypeScript support
- Hot module replacement
- Better error messages

### Production
- Optimized builds
- Edge runtime support
- Middleware capabilities
- API routes included

---

## Potential Challenges

### Learning Curve
- **Server vs Client Components** - New paradigm
- **Data fetching patterns** - Different from React Query
- **Route structure** - File-based vs config-based

**Mitigation:** Review Next.js docs, use Server Components by default

### Sanity Studio
- **Embedding complexity** - Studio requires client-side rendering
- **Build time** - Studio adds to bundle size

**Mitigation:** Consider separate deployment for Studio

### TanStack Query
- **May not be needed** - Server Components handle most cases
- **Increases bundle** - Extra library

**Mitigation:** Use Server Components, keep Query for mutations only

### Migration Time
- **Not trivial** - 20-35 hours estimated
- **Testing required** - Thorough validation needed

**Mitigation:** Incremental approach, thorough testing per phase

---

## Success Criteria

### Performance Targets
- Lighthouse Performance Score: > 90
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.5s
- Total Blocking Time: < 200ms

### Functionality
- All 13 routes working
- Sanity CMS integrated
- Navigation working
- Images optimized
- Mobile responsive

### SEO
- Meta tags on all pages
- Open Graph working
- Sitemap generated
- robots.txt configured

---

## Rollback Plan

If migration encounters critical issues:

1. **Keep Vite version running** in production
2. **Continue Next.js work** in separate branch
3. **Parallel deployment** - Test Next.js on subdomain
4. **Gradual cutover** - Route traffic gradually
5. **Quick revert** - DNS change back if needed

---

## Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)
- [Sanity + Next.js](https://www.sanity.io/docs/nextjs)
- [shadcn/ui + Next.js](https://ui.shadcn.com/docs/installation/next)

### Key Concepts
- Server Components
- Client Components ('use client')
- Streaming and Suspense
- Data fetching patterns
- Metadata API
- Image optimization

---

## Notes

- This plan assumes App Router (not Pages Router)
- Estimated timeline is for a single developer
- Testing time varies based on thoroughness
- Consider pair programming for complex sections
- Document any deviations from this plan

---

**Last Updated:** 2025-10-20
**Version:** 1.0
**Author:** Claude Code
