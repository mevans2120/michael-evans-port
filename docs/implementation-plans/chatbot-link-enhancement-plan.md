# Chatbot Link Enhancement - Implementation Plan

**Date**: November 4, 2025
**Status**: Ready for Implementation
**Version**: 1.1
**Estimated Timeline**: 2-3 weeks

**IMPORTANT NOTE**: The chatbot's AI content recommendations are already excellent. This is purely a UI/presentation enhancement to make those existing recommendations more visually engaging with rich preview cards. No changes to AI logic or content selection.

---

## Executive Summary

### Feature Overview

**IMPORTANT**: The chatbot's AI is already doing an excellent job selecting and recommending relevant content. This is purely a UI/presentation enhancement to make those existing link recommendations more visually appealing and engaging. No changes to AI logic, prompts, or content selection are needed.

Transform plain markdown links in the AI chatbot into rich preview cards with images, descriptions, and metadata. When the chatbot recommends case studies or AI showcase projects, users will see visually engaging preview cards instead of plain text links, significantly improving the user experience and click-through rates.

**Current State:**
```markdown
Learn more: [Virgin America Case Study](/case-studies/virgin-america)
```
Renders as: Plain underlined link with no context (but the recommendation itself is already good!)

**Target State:**
```
┌─────────────────────────────────────────┐
│ [Image]  CASE STUDY                     │
│          Virgin America                  │
│          Airline website redesign that   │
│          increased engagement by 2x      │
└─────────────────────────────────────────┘
```
Renders as: Rich preview card with featured image, category badge, title, and description (same great recommendation, better presentation)

### Key Benefits

1. **Enhanced Visual Presentation (NOT Content Selection)**
   - The chatbot already recommends the right content
   - Visual previews make those good recommendations more engaging
   - Expected ~30% increase in click-through rates through better formatting
   - Users can preview content before navigating

2. **Professional Polish**
   - Showcases portfolio work with visual appeal
   - Consistent with modern web standards (Twitter/Slack link previews)
   - Leverages existing high-quality metadata and images already in Sanity
   - Demonstrates technical sophistication

3. **Better User Experience**
   - Category badges help users understand content type at a glance
   - Descriptions provide context without clicking
   - Featured images create visual hierarchy
   - No changes to AI logic or content recommendation quality needed

4. **Mobile-Optimized**
   - Works on all screen sizes
   - Touch-friendly card interface
   - No hover-dependent interactions

### Timeline Estimate

- **Phase 1**: Foundation (3-4 days)
- **Phase 2**: UI Components (3-4 days)
- **Phase 3**: Integration & Mobile (2-3 days)
- **Phase 4**: Testing & Polish (3-4 days)

**Total**: 11-15 working days (2-3 weeks)

### Resources Required

**Technical:**
- Next.js API route endpoint (`/api/link-metadata`) to fetch existing metadata
- React component (`LinkPreview`) for rich formatting
- Integration with existing ReactMarkdown rendering
- Sanity CMS queries (existing client, no schema changes)

**Data:**
- ✅ All required metadata already exists in Sanity schemas
- ✅ Featured images available for all case studies and AI showcases
- ✅ Descriptions and summaries already populated
- ✅ Chatbot already recommending the right content
- **No new content creation needed**
- **No changes to AI prompts or recommendation logic**

**Testing:**
- Unit tests for API endpoint
- Component tests for LinkPreview
- Visual regression tests
- Mobile responsiveness tests
- Cross-browser testing

---

## Phase 1: API Endpoint & Metadata Fetching

**Duration**: 3-4 days
**Dependencies**: None
**Goal**: Create backend infrastructure to fetch existing metadata from Sanity CMS for rich link formatting

**Note**: This phase fetches metadata that already exists and is already being used well by the chatbot. We're just exposing it in a format optimized for rich preview cards.

### Objectives

1. Create API endpoint that returns existing metadata for case studies and AI showcase projects
2. Implement efficient Sanity queries with optimized image URLs (no schema changes needed)
3. Add comprehensive error handling and validation
4. Set up proper caching headers for performance
5. Support both project and AI showcase content types (all data already exists)

### Deliverables

#### 1. API Route: `/src/app/api/link-metadata/route.ts`

**Specification:**

```typescript
// Request: GET /api/link-metadata?type=project&slug=virgin-america
// Response:
{
  "title": "Virgin America",
  "category": "Case Study",
  "description": "Airline website redesign that increased engagement by 2x",
  "imageUrl": "https://cdn.sanity.io/images/5n331bys/production/abc123-400x400.jpg"
}
```

**Parameters:**
- `type` (required): `"project"` or `"aiShowcase"`
- `slug` (required): Content slug (e.g., `"virgin-america"`)

**Response Codes:**
- `200`: Success with metadata
- `400`: Missing or invalid parameters
- `404`: Resource not found
- `500`: Internal server error

**Implementation:**

```typescript
// /src/app/api/link-metadata/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { client, urlFor } from '@/lib/sanity/client';

export const runtime = 'edge';
export const revalidate = 300; // 5 minutes

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const slug = searchParams.get('slug');

    // Validation
    if (!type || !slug) {
      return NextResponse.json(
        { error: 'Missing required parameters: type and slug' },
        { status: 400 }
      );
    }

    if (!['project', 'aiShowcase'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type. Must be "project" or "aiShowcase"' },
        { status: 400 }
      );
    }

    // Build query based on type
    let query;
    if (type === 'project') {
      query = `*[_type == "project" && slug.current == $slug][0] {
        title,
        category,
        featuredImage {
          asset->{url},
          alt
        },
        featuredDescription,
        heroSection {
          subtitle,
          summary
        }
      }`;
    } else {
      query = `*[_type == "aiShowcase" && slug.current == $slug][0] {
        title,
        category,
        featuredImage {
          asset->{url},
          alt
        },
        heroSection {
          subtitle,
          summary
        }
      }`;
    }

    // Fetch from Sanity
    const data = await client.fetch(query, { slug });

    if (!data) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      );
    }

    // Format response
    const metadata = {
      title: data.title,
      category: data.category || (type === 'project' ? 'Case Study' : 'AI Showcase'),
      description:
        data.featuredDescription ||
        data.heroSection?.subtitle ||
        data.heroSection?.summary ||
        '',
      imageUrl: data.featuredImage?.asset?.url
        ? urlFor(data.featuredImage)
            .width(400)
            .height(400)
            .quality(85)
            .auto('format')
            .url()
        : null,
    };

    return NextResponse.json(metadata, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error in link-metadata API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

**Key Implementation Details:**

1. **Edge Runtime**: Use Edge runtime for faster response times
2. **Image Optimization**: Use Sanity's image CDN with:
   - Fixed dimensions (400x400) for consistency
   - Quality 85 for good balance
   - Auto format (WebP where supported)
3. **Cache Headers**:
   - `s-maxage=300`: Cache for 5 minutes at CDN
   - `stale-while-revalidate=600`: Serve stale for 10 minutes while revalidating
4. **Description Priority**:
   - First: `featuredDescription` (curated for previews)
   - Second: `heroSection.subtitle` (concise tagline)
   - Third: `heroSection.summary` (longer overview)
   - Default: Empty string (handled gracefully)

#### 2. TypeScript Types: `/src/types/link-metadata.ts`

```typescript
// /src/types/link-metadata.ts
export interface LinkMetadata {
  title: string;
  category: string;
  description: string;
  imageUrl: string | null;
}

export interface LinkMetadataRequest {
  type: 'project' | 'aiShowcase';
  slug: string;
}

export interface LinkMetadataError {
  error: string;
}

export type LinkMetadataResponse = LinkMetadata | LinkMetadataError;
```

#### 3. Error Handling Strategy

**Error Scenarios:**

| Scenario | Response | Fallback Behavior |
|----------|----------|-------------------|
| Missing parameters | 400 with error message | Show standard link |
| Invalid type | 400 with error message | Show standard link |
| Resource not found | 404 with error message | Show standard link |
| Sanity API timeout | 500 with error message | Show standard link |
| Network error | 500 with error message | Show standard link |
| Missing image | 200 with `imageUrl: null` | Show text-only preview |

**Logging:**
```typescript
// Add structured logging for monitoring
console.error('Error in link-metadata API:', {
  type,
  slug,
  error: error instanceof Error ? error.message : 'Unknown error',
  stack: error instanceof Error ? error.stack : undefined,
  timestamp: new Date().toISOString(),
});
```

### Tasks with File Paths

1. **Create API route file**
   - Path: `/src/app/api/link-metadata/route.ts`
   - Lines: ~150
   - Dependencies: `@/lib/sanity/client`

2. **Create TypeScript types**
   - Path: `/src/types/link-metadata.ts`
   - Lines: ~20
   - Dependencies: None

3. **Test API endpoint manually**
   - Test URLs:
     - `http://localhost:3000/api/link-metadata?type=project&slug=virgin-america`
     - `http://localhost:3000/api/link-metadata?type=project&slug=casa-bonita`
     - `http://localhost:3000/api/link-metadata?type=project&slug=target`
     - `http://localhost:3000/api/link-metadata?type=project&slug=before-launcher`
   - Verify response format matches spec
   - Test error cases (missing params, invalid type, non-existent slug)

4. **Verify Sanity queries**
   - Run queries in Sanity Vision tool
   - Confirm all case studies have required fields
   - Check image URL generation

5. **Document API endpoint**
   - Add JSDoc comments
   - Document query parameters
   - Document response format

### Acceptance Criteria

- [ ] API endpoint responds with 200 for valid case study slugs
- [ ] Returns correct metadata (title, category, description, imageUrl)
- [ ] Image URLs are valid and optimized (400x400, quality 85, auto format)
- [ ] Returns 400 for missing/invalid parameters
- [ ] Returns 404 for non-existent slugs
- [ ] Returns 500 for Sanity API errors
- [ ] Cache headers are properly set (5-minute cache)
- [ ] Works for both project and aiShowcase types
- [ ] Handles missing images gracefully (`imageUrl: null`)
- [ ] Edge runtime deployed successfully

### Estimated Time

- API route implementation: 2 hours
- Type definitions: 30 minutes
- Error handling: 1 hour
- Manual testing: 1 hour
- Documentation: 30 minutes
- **Total: 5 hours (1 day)**

### Risk Mitigation

**Risk 1: Sanity API Timeout**
- **Mitigation**: Add 5-second timeout to Sanity client
- **Fallback**: Return 500 error, frontend shows standard link

**Risk 2: Image URLs Not Working**
- **Mitigation**: Test image URL builder with all case studies
- **Fallback**: Return `imageUrl: null`, show text-only preview

**Risk 3: Missing Description Fields**
- **Mitigation**: Fallback chain (featuredDescription → subtitle → summary → empty)
- **Fallback**: Empty string, component handles gracefully

---

## Phase 2: LinkPreview Component & UI

**Duration**: 3-4 days
**Dependencies**: Phase 1 complete
**Goal**: Create polished, accessible link preview component to beautifully format the chatbot's existing recommendations

**Note**: This phase is pure UI/presentation work. The chatbot already recommends the right content - we're just making those recommendations visually engaging.

### Objectives

1. Build LinkPreview component that fetches and displays existing metadata in a rich card format
2. Implement skeleton loading states for smooth UX
3. Create responsive design (mobile vertical, desktop horizontal)
4. Add proper accessibility features (alt text, ARIA labels, keyboard navigation)
5. Implement client-side caching to minimize API calls
6. Design fallback states for missing data

### Deliverables

#### 1. LinkPreview Component: `/src/components/chatbot/LinkPreview.tsx`

**Component Architecture:**

```
LinkPreview
├── Loading State (Skeleton)
├── Error State (Standard Link)
├── No Metadata State (Standard Link)
└── Rich Preview State
    ├── Image (if available)
    └── Content
        ├── Category Badge
        ├── Title
        └── Description
```

**Implementation:**

```tsx
// /src/components/chatbot/LinkPreview.tsx
'use client';

import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import type { LinkMetadata } from '@/types/link-metadata';

interface LinkPreviewProps {
  href: string;
  children: React.ReactNode;
}

// Simple in-memory cache with 5-minute expiry
const cache = new Map<string, { data: LinkMetadata; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function LinkPreview({ href, children }: LinkPreviewProps) {
  const [metadata, setMetadata] = useState<LinkMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Only enhance case study and AI showcase links
    const caseStudyMatch = href.match(/^\/case-studies\/([a-z-]+)$/);
    const aiShowcaseMatch = href.match(/^\/ai-showcase\/([a-z-]+)$/);

    if (!caseStudyMatch && !aiShowcaseMatch) {
      setLoading(false);
      return;
    }

    const type = caseStudyMatch ? 'project' : 'aiShowcase';
    const slug = caseStudyMatch ? caseStudyMatch[1] : aiShowcaseMatch![1];
    const cacheKey = `${type}:${slug}`;

    // Check cache first
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setMetadata(cached.data);
      setLoading(false);
      return;
    }

    // Fetch metadata
    fetch(`/api/link-metadata?type=${type}&slug=${slug}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        cache.set(cacheKey, { data, timestamp: Date.now() });
        setMetadata(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching link metadata:', err);
        setError(true);
        setLoading(false);
      });
  }, [href]);

  // Standard link (non-case-study URL or error)
  if (!loading && (!metadata || error)) {
    return (
      <a
        href={href}
        className="underline hover:no-underline text-accent transition-colors"
      >
        {children}
      </a>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="my-4 p-4 bg-chat-suggestion/30 border border-chat-input-border rounded-lg">
        <div className="flex flex-col sm:flex-row gap-4">
          <Skeleton className="w-full sm:w-32 h-48 sm:h-32 rounded flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  // Rich preview card
  return (
    <a
      href={href}
      className="block my-4 p-3 md:p-4 bg-chat-suggestion/30 border border-chat-input-border rounded-lg hover:bg-chat-suggestion/50 hover:border-accent/50 transition-all duration-200 group"
      aria-label={`View case study: ${metadata.title}`}
    >
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        {/* Featured Image */}
        {metadata.imageUrl && (
          <div className="w-full sm:w-32 h-48 sm:h-32 flex-shrink-0 bg-chat-message rounded overflow-hidden">
            <img
              src={metadata.imageUrl}
              alt={metadata.title}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Category Badge */}
          <div className="text-xs text-accent uppercase tracking-wider mb-1">
            {metadata.category}
          </div>

          {/* Title */}
          <h4 className="font-medium text-base sm:text-sm text-chat-foreground group-hover:text-accent transition-colors mb-2">
            {metadata.title}
          </h4>

          {/* Description */}
          {metadata.description && (
            <p className="text-sm sm:text-xs text-chat-foreground/70 line-clamp-2 sm:line-clamp-3">
              {metadata.description}
            </p>
          )}
        </div>
      </div>
    </a>
  );
}
```

**Key Implementation Details:**

1. **Client-Side Caching**:
   - Cache keyed by `type:slug` (e.g., `"project:virgin-america"`)
   - 5-minute expiry (matches API cache)
   - Prevents redundant API calls when same link appears multiple times
   - Simple Map-based cache (no external dependencies)

2. **URL Pattern Matching**:
   - Detects case study links: `/case-studies/[slug]`
   - Detects AI showcase links: `/ai-showcase/[slug]`
   - Falls back to standard link for all other URLs

3. **Loading States**:
   - Skeleton loader with same layout as preview card
   - Smooth transition when data loads
   - Prevents layout shift (CLS optimization)

4. **Responsive Design**:
   - Mobile: Vertical layout (image full-width, 48px height)
   - Desktop: Horizontal layout (image 32px square, content beside)
   - Text sizes adjust for readability
   - Line clamping: 2 lines mobile, 3 lines desktop

5. **Accessibility**:
   - Semantic `<a>` element (keyboard navigable)
   - `aria-label` describing link purpose
   - Alt text for images
   - `loading="lazy"` for performance
   - `decoding="async"` to prevent blocking

6. **Visual Feedback**:
   - Hover state: Darker background + accent border
   - Group hover: Title changes to accent color
   - Transition duration: 200ms for smooth interaction

#### 2. Responsive Design Specifications

**Mobile (< 640px):**
```
┌────────────────────────────┐
│                            │
│        Image (w-full)      │
│        h-48                │
│                            │
├────────────────────────────┤
│ CASE STUDY                 │
│ Virgin America             │
│ Airline website redesign   │
│ that increased...          │
└────────────────────────────┘
```

**Desktop (≥ 640px):**
```
┌─────────────────────────────────────────┐
│ [Image]  CASE STUDY                     │
│ 32x32    Virgin America                 │
│          Airline website redesign that  │
│          increased engagement by 2x and │
│          improved conversion rates      │
└─────────────────────────────────────────┘
```

#### 3. Styling with Design System

**Color Tokens Used:**
- `bg-chat-suggestion/30` - Base card background (30% opacity)
- `bg-chat-suggestion/50` - Hover background (50% opacity)
- `border-chat-input-border` - Subtle border
- `border-accent/50` - Hover accent border (50% opacity)
- `text-accent` - Category badge and hover title
- `text-chat-foreground` - Primary text
- `text-chat-foreground/70` - Secondary text (70% opacity)
- `bg-chat-message` - Image placeholder background

**Transition Classes:**
- `transition-all` - Smooth hover transitions
- `duration-200` - 200ms timing
- `transition-colors` - Standard link color change

### Tasks with File Paths

1. **Create LinkPreview component**
   - Path: `/src/components/chatbot/LinkPreview.tsx`
   - Lines: ~150
   - Dependencies: `@/components/ui/skeleton`, `@/types/link-metadata`

2. **Verify Skeleton component exists**
   - Path: `/src/components/ui/skeleton.tsx`
   - If missing, add from shadcn/ui: `npx shadcn-ui@latest add skeleton`

3. **Create component tests**
   - Path: `/src/components/chatbot/__tests__/LinkPreview.test.tsx`
   - Test cases:
     - Renders standard link for non-case-study URLs
     - Shows loading skeleton while fetching
     - Displays rich preview when data loaded
     - Handles API errors gracefully
     - Uses cached data for repeated calls
     - Responsive layout changes

4. **Test responsive design**
   - Mobile viewport (375px, 414px, 390px)
   - Tablet viewport (768px, 820px)
   - Desktop viewport (1024px, 1440px, 1920px)
   - Verify image sizes and text clamping

5. **Test accessibility**
   - Keyboard navigation (Tab, Enter)
   - Screen reader testing (NVDA/VoiceOver)
   - Color contrast ratios
   - Focus indicators

### Acceptance Criteria

- [ ] Component renders for case study links
- [ ] Shows loading skeleton immediately
- [ ] Fetches metadata from API endpoint
- [ ] Displays rich preview card with image, title, description
- [ ] Falls back to standard link on error
- [ ] Caches metadata for 5 minutes
- [ ] Responsive design works on mobile and desktop
- [ ] Images lazy load
- [ ] Hover states work correctly
- [ ] Keyboard accessible
- [ ] Screen reader accessible
- [ ] Handles missing images (text-only preview)
- [ ] Handles missing descriptions gracefully
- [ ] No layout shift during loading (CLS = 0)

### Estimated Time

- Component implementation: 3 hours
- Skeleton loader: 1 hour
- Responsive design: 2 hours
- Accessibility: 1 hour
- Testing: 2 hours
- **Total: 9 hours (1-2 days)**

### Risk Mitigation

**Risk 1: Skeleton Component Not Installed**
- **Mitigation**: Check `/src/components/ui/skeleton.tsx` exists
- **Fallback**: Install with `npx shadcn-ui@latest add skeleton`

**Risk 2: Layout Shift During Load**
- **Mitigation**: Fixed heights for skeleton loader
- **Fallback**: Use min-height to prevent collapse

**Risk 3: Long Descriptions Breaking Layout**
- **Mitigation**: Use `line-clamp-2` and `line-clamp-3` utilities
- **Fallback**: Add `overflow-hidden` and `text-ellipsis`

---

## Phase 3: Integration & Mobile Optimization

**Duration**: 2-3 days
**Dependencies**: Phase 1 & 2 complete
**Goal**: Integrate LinkPreview into ChatSection to enhance the presentation of existing chatbot recommendations

**Note**: This phase connects the UI components to the existing chat interface. No changes to AI logic, just improving how links are displayed.

### Objectives

1. Replace default ReactMarkdown link renderer with LinkPreview for rich formatting
2. Ensure backward compatibility with existing links (internal and external)
3. Optimize mobile interaction patterns
4. Test on real devices (iOS, Android)
5. Handle follow-up question links appropriately
6. Verify performance metrics

### Deliverables

#### 1. ChatSection Integration: `/src/components/navigation/ChatSection.tsx`

**Current Code (Lines 279-303):**
```tsx
<ReactMarkdown
  remarkPlugins={[remarkGfm]}
  components={{
    a: ({ node, ...props }) => (
      <a className="underline hover:no-underline text-sm" {...props} />
    ),
  }}
>
  {mainContent}
</ReactMarkdown>
```

**Updated Code:**
```tsx
import { LinkPreview } from '@/components/chatbot/LinkPreview';

<ReactMarkdown
  remarkPlugins={[remarkGfm]}
  components={{
    h1: ({ node, ...props }) => <h1 className="text-lg font-bold" {...props} />,
    h2: ({ node, ...props }) => <h2 className="text-base font-bold" {...props} />,
    h3: ({ node, ...props }) => <h3 className="text-sm font-semibold" {...props} />,
    p: ({ node, ...props }) => <p className="text-sm" {...props} />,
    ul: ({ node, ...props }) => <ul className="list-disc pl-4 text-sm" {...props} />,
    ol: ({ node, ...props }) => <ol className="list-decimal pl-4 text-sm" {...props} />,
    li: ({ node, ...props }) => <li className="text-sm" {...props} />,
    code: ({ node, inline, className, children, ...props }: any) =>
      inline ? (
        <code className="px-1 py-0.5 rounded text-sm font-mono bg-code-block" {...props}>
          {children}
        </code>
      ) : (
        <code className="block bg-code-block p-2 rounded my-2 text-sm font-mono" {...props}>
          {children}
        </code>
      ),
    // NEW: Use LinkPreview for all links
    a: ({ node, href, children, ...props }) => (
      <LinkPreview href={href || '#'}>
        {children}
      </LinkPreview>
    ),
  }}
>
  {mainContent}
</ReactMarkdown>
```

**Key Changes:**
- Import LinkPreview component
- Replace default `<a>` renderer with `<LinkPreview>`
- Pass `href` and `children` props
- LinkPreview handles detection and rendering logic internally

#### 2. Follow-Up Questions Enhancement (Optional)

**Problem**: Follow-up question links are currently non-clickable buttons

**Current Behavior:**
```tsx
// Lines 140-159
const parseFollowUpQuestions = (text: string) => {
  // Extracts: "[Question text](/url)" as string
  // Renders as button that sends text as message
}
```

**Recommended Solution**: Parse markdown links and make them navigable

```tsx
// /src/components/navigation/ChatSection.tsx (Lines 140-159)

interface ParsedQuestion {
  text: string;
  url: string | null;
}

const parseFollowUpQuestion = (question: string): ParsedQuestion => {
  const linkMatch = question.match(/\[([^\]]+)\]\(([^)]+)\)/);
  if (linkMatch) {
    return {
      text: linkMatch[1],
      url: linkMatch[2],
    };
  }
  return { text: question, url: null };
};

// Updated rendering (around line 250)
{questions.map((question, index) => {
  const { text, url } = parseFollowUpQuestion(question);

  if (url) {
    return (
      <a
        key={index}
        href={url}
        className="text-left text-sm px-3 py-2 rounded-lg bg-chat-suggestion/50 hover:bg-chat-suggestion transition-colors block"
      >
        {text}
      </a>
    );
  }

  return (
    <button
      key={index}
      onClick={() => handlePromptClick(question)}
      className="text-left text-sm px-3 py-2 rounded-lg bg-chat-suggestion/50 hover:bg-chat-suggestion transition-colors"
    >
      {question}
    </button>
  );
})}
```

**Why This Is Optional:**
- Follow-up questions currently work as intended (send to chatbot)
- Making them navigable changes user behavior
- Requires user testing to determine preferred pattern
- Can be deferred to Phase 4 or future enhancement

#### 3. Mobile Optimization Checklist

**Touch Targets:**
- [ ] All preview cards minimum 44x44px touch area
- [ ] Adequate spacing between cards (12px minimum)
- [ ] No hover-dependent interactions

**Image Loading:**
- [ ] Images lazy load on mobile
- [ ] Use `loading="lazy"` attribute
- [ ] Consider smaller image sizes on mobile (test with slow 3G)

**Layout:**
- [ ] Vertical layout on mobile (stacked)
- [ ] Full-width images with constrained height (48px)
- [ ] Text readable without zooming (minimum 14px)
- [ ] Line clamping works correctly

**Performance:**
- [ ] First preview loads in < 1 second
- [ ] Cached previews load instantly (< 100ms)
- [ ] No jank or layout shifts
- [ ] Smooth scrolling

**Testing Devices:**
- [ ] iPhone 12/13/14 (Safari)
- [ ] iPhone SE (small screen)
- [ ] iPad (tablet view)
- [ ] Android phone (Chrome)
- [ ] Android tablet

#### 4. Performance Monitoring

**Metrics to Track:**

```typescript
// Add performance tracking to LinkPreview component
useEffect(() => {
  const startTime = performance.now();

  fetch(`/api/link-metadata?type=${type}&slug=${slug}`)
    .then(res => res.json())
    .then(data => {
      const loadTime = performance.now() - startTime;

      // Log performance metric
      console.log(`[LinkPreview] Loaded ${slug} in ${loadTime.toFixed(2)}ms`);

      // Track in analytics (if available)
      if (typeof window !== 'undefined' && window.analytics) {
        window.analytics.track('Link Preview Loaded', {
          slug,
          type,
          loadTime,
          cached: false,
        });
      }

      setMetadata(data);
    });
}, [type, slug]);
```

**Target Metrics:**
- API response time: < 200ms (P95)
- Image load time: < 500ms (P95)
- Cache hit rate: > 80%
- First contentful paint: No regression
- Cumulative layout shift: 0 (no shift)

### Tasks with File Paths

1. **Update ChatSection component**
   - Path: `/src/components/navigation/ChatSection.tsx`
   - Lines to change: ~285 (add import, update component prop)
   - Test: Verify links still work in chat responses

2. **Optional: Update follow-up question parsing**
   - Path: `/src/components/navigation/ChatSection.tsx`
   - Lines to change: 140-159, ~250
   - Test: Verify questions with links are clickable

3. **Test on development server**
   - Start server: `npm run dev`
   - Navigate to chatbot
   - Ask: "Tell me about Virgin America"
   - Verify: Link preview appears with image

4. **Mobile device testing**
   - Use BrowserStack or local devices
   - Test iOS Safari, Chrome Mobile, Firefox Mobile
   - Verify responsive layout and touch interactions

5. **Performance testing**
   - Use Chrome DevTools (Network tab, Performance tab)
   - Throttle to "Slow 3G"
   - Measure API response times
   - Check for layout shifts

6. **Cross-browser testing**
   - Chrome (latest)
   - Safari (latest)
   - Firefox (latest)
   - Edge (latest)

### Acceptance Criteria

- [ ] LinkPreview renders for all case study links in chat
- [ ] Standard links (external URLs) still work correctly
- [ ] No regressions in existing chat functionality
- [ ] Mobile layout is readable and usable
- [ ] Images load within 500ms on 3G
- [ ] No layout shift during loading
- [ ] Touch targets are 44x44px minimum
- [ ] Works on iOS Safari, Chrome Mobile, Firefox Mobile
- [ ] Performance metrics within target ranges
- [ ] No console errors or warnings

### Estimated Time

- ChatSection integration: 1 hour
- Follow-up question parsing (optional): 2 hours
- Mobile device testing: 2 hours
- Performance testing: 1 hour
- Cross-browser testing: 1 hour
- Bug fixes and polish: 1 hour
- **Total: 8 hours (1-2 days)**

### Risk Mitigation

**Risk 1: Breaking Existing Chat Functionality**
- **Mitigation**: Test thoroughly before committing
- **Fallback**: Git rollback if issues found

**Risk 2: Poor Mobile Performance**
- **Mitigation**: Test with slow 3G throttling
- **Fallback**: Disable previews on mobile (feature flag)

**Risk 3: Layout Shift on Mobile**
- **Mitigation**: Fixed heights for skeleton loader
- **Fallback**: Add min-height to prevent collapse

---

## Phase 4: Testing & Refinement

**Duration**: 3-4 days
**Dependencies**: Phase 1-3 complete
**Goal**: Comprehensive testing and production deployment preparation

**Note**: This phase validates that the UI enhancements work correctly across all scenarios. The underlying content recommendations will remain unchanged and working as they already do.

### Objectives

1. Write comprehensive test suite (unit, integration, E2E)
2. Conduct visual regression testing to ensure rich previews display correctly
3. Test edge cases and error scenarios (missing images, long titles, etc.)
4. Gather user feedback (internal testing)
5. Optimize performance based on metrics
6. Create deployment checklist
7. Document maintenance procedures

### Deliverables

#### 1. Unit Tests: `/src/app/api/link-metadata/__tests__/route.test.ts`

**Test API Endpoint:**

```typescript
// /src/app/api/link-metadata/__tests__/route.test.ts
import { describe, it, expect, vi } from 'vitest';
import { GET } from '../route';
import { NextRequest } from 'next/server';

describe('/api/link-metadata', () => {
  it('returns 400 for missing parameters', async () => {
    const req = new NextRequest('http://localhost:3000/api/link-metadata');
    const res = await GET(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('Missing required parameters');
  });

  it('returns 400 for invalid type', async () => {
    const req = new NextRequest('http://localhost:3000/api/link-metadata?type=invalid&slug=test');
    const res = await GET(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('Invalid type');
  });

  it('returns 404 for non-existent slug', async () => {
    const req = new NextRequest('http://localhost:3000/api/link-metadata?type=project&slug=non-existent');
    const res = await GET(req);
    expect(res.status).toBe(404);
  });

  it('returns metadata for valid case study', async () => {
    const req = new NextRequest('http://localhost:3000/api/link-metadata?type=project&slug=virgin-america');
    const res = await GET(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('title');
    expect(data).toHaveProperty('category');
    expect(data).toHaveProperty('description');
    expect(data).toHaveProperty('imageUrl');
    expect(data.title).toBe('Virgin America');
  });

  it('includes cache headers', async () => {
    const req = new NextRequest('http://localhost:3000/api/link-metadata?type=project&slug=virgin-america');
    const res = await GET(req);
    expect(res.headers.get('Cache-Control')).toContain('s-maxage=300');
    expect(res.headers.get('Cache-Control')).toContain('stale-while-revalidate=600');
  });
});
```

#### 2. Component Tests: `/src/components/chatbot/__tests__/LinkPreview.test.tsx`

**Test LinkPreview Component:**

```typescript
// /src/components/chatbot/__tests__/LinkPreview.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { LinkPreview } from '../LinkPreview';

describe('LinkPreview', () => {
  it('renders standard link for non-case-study URLs', () => {
    render(<LinkPreview href="https://example.com">Example</LinkPreview>);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveClass('underline');
  });

  it('shows loading skeleton for case study links', () => {
    render(<LinkPreview href="/case-studies/virgin-america">Virgin America</LinkPreview>);
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });

  it('displays rich preview when data loads', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          title: 'Virgin America',
          category: 'Case Study',
          description: 'Airline website redesign',
          imageUrl: 'https://cdn.sanity.io/image.jpg',
        }),
      })
    );

    render(<LinkPreview href="/case-studies/virgin-america">Virgin America</LinkPreview>);

    await waitFor(() => {
      expect(screen.getByText('Virgin America')).toBeInTheDocument();
      expect(screen.getByText('Airline website redesign')).toBeInTheDocument();
      expect(screen.getByText('Case Study')).toBeInTheDocument();
    });
  });

  it('falls back to standard link on error', async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('API error')));

    render(<LinkPreview href="/case-studies/virgin-america">Virgin America</LinkPreview>);

    await waitFor(() => {
      const link = screen.getByRole('link');
      expect(link).toHaveClass('underline');
    });
  });

  it('uses cached data for repeated calls', async () => {
    const fetchSpy = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          title: 'Virgin America',
          category: 'Case Study',
          description: 'Airline website redesign',
          imageUrl: 'https://cdn.sanity.io/image.jpg',
        }),
      })
    );
    global.fetch = fetchSpy;

    const { rerender } = render(<LinkPreview href="/case-studies/virgin-america">VA</LinkPreview>);
    await waitFor(() => screen.getByText('Virgin America'));

    // Unmount and remount
    rerender(<LinkPreview href="/case-studies/virgin-america">VA</LinkPreview>);

    // Should only fetch once
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});
```

#### 3. Integration Tests: `/tests/chatbot-link-preview.spec.ts`

**E2E Test with Playwright:**

```typescript
// /tests/chatbot-link-preview.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Chatbot Link Previews', () => {
  test('displays rich preview for case study link', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Open chatbot
    await page.click('[aria-label="Ask AI about Michael"]');

    // Ask about Virgin America
    await page.fill('textarea', 'Tell me about Virgin America');
    await page.press('textarea', 'Enter');

    // Wait for response
    await page.waitForSelector('.assistant-message');

    // Check for link preview
    const preview = page.locator('a[href="/case-studies/virgin-america"]');
    await expect(preview).toBeVisible();

    // Verify preview content
    await expect(preview.locator('img')).toBeVisible();
    await expect(preview.locator('text=Virgin America')).toBeVisible();
    await expect(preview.locator('text=Case Study')).toBeVisible();
  });

  test('link preview is clickable and navigates', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Open chatbot and get recommendation
    await page.click('[aria-label="Ask AI about Michael"]');
    await page.fill('textarea', 'Tell me about Virgin America');
    await page.press('textarea', 'Enter');

    // Wait for and click preview
    const preview = page.locator('a[href="/case-studies/virgin-america"]');
    await preview.click();

    // Verify navigation
    await expect(page).toHaveURL('/case-studies/virgin-america');
  });

  test('handles missing images gracefully', async ({ page }) => {
    // Test with project that has no featured image
    // Verify text-only preview displays
  });

  test('mobile layout displays correctly', async ({ page, context }) => {
    await context.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3000');

    // Test mobile vertical layout
    await page.click('[aria-label="Ask AI about Michael"]');
    await page.fill('textarea', 'Tell me about Virgin America');
    await page.press('textarea', 'Enter');

    const preview = page.locator('a[href="/case-studies/virgin-america"]');
    const image = preview.locator('img');

    // Verify full-width image on mobile
    const box = await image.boundingBox();
    expect(box?.width).toBeGreaterThan(300); // Full width
  });
});
```

#### 4. Visual Regression Tests

**Setup with Playwright Screenshots:**

```bash
# Capture baseline screenshots
npm run test:visual:baseline

# Run visual regression tests
npm run test:visual
```

**Test Cases:**
- [ ] Link preview card (desktop)
- [ ] Link preview card (mobile)
- [ ] Loading skeleton state
- [ ] Error fallback state
- [ ] Text-only preview (no image)
- [ ] Multiple previews in one chat response

#### 5. Edge Case Testing

**Scenarios to Test:**

| Scenario | Expected Behavior | Test Method |
|----------|------------------|-------------|
| Very long title (100+ chars) | Title wraps or truncates | Manual test |
| Very long description | Line clamps to 2-3 lines | Manual test |
| Missing featured image | Text-only preview displays | Unit test |
| Missing description | Preview shows title only | Unit test |
| Slow API response (5s) | Loading skeleton for 5s, then preview | Network throttling |
| API timeout | Falls back to standard link | Mock API failure |
| Network offline | Falls back to standard link | DevTools offline mode |
| Multiple same links in chat | Only fetches once (cache) | Integration test |
| Mixed case study + external links | Case studies previewed, external links standard | Integration test |
| Follow-up question with link | Link is clickable (if implemented) | E2E test |

#### 6. Performance Testing

**Metrics to Measure:**

```bash
# Using Chrome DevTools Lighthouse
npm run build
npm run start
# Open Chrome DevTools > Lighthouse
# Run audit on chatbot page
```

**Targets:**
- [ ] First Contentful Paint: < 1.5s (no regression)
- [ ] Largest Contentful Paint: < 2.5s (no regression)
- [ ] Cumulative Layout Shift: 0 (no shift during preview load)
- [ ] Time to Interactive: < 3s (no regression)
- [ ] API response time (P95): < 200ms
- [ ] Image load time (P95): < 500ms
- [ ] Cache hit rate: > 80%

**Tools:**
- Chrome DevTools Performance tab
- Network tab (throttling: Slow 3G, Fast 3G)
- Lighthouse
- WebPageTest.org

#### 7. User Feedback Collection

**Internal Testing Protocol:**

1. **Beta Testing Group**:
   - Share development link with 5-10 users
   - Collect feedback via Google Form or Notion

2. **Feedback Questions**:
   - Does the preview help you understand what the link is about?
   - Would you be more likely to click a preview vs. a plain link?
   - Is the preview too large/too small on your device?
   - Any bugs or issues you encountered?
   - Suggestions for improvement?

3. **Analytics to Track**:
   - Click-through rate: Previews vs. standard links
   - Time on page after clicking preview
   - Bounce rate from preview links
   - Preview load failures

#### 8. Deployment Checklist

**Pre-Deployment:**
- [ ] All tests passing (unit, integration, E2E)
- [ ] Visual regression tests passing
- [ ] Performance metrics within targets
- [ ] Cross-browser testing complete
- [ ] Mobile device testing complete
- [ ] Code reviewed and approved
- [ ] Documentation updated

**Environment Variables:**
- [ ] `NEXT_PUBLIC_SANITY_PROJECT_ID` set (already exists)
- [ ] `NEXT_PUBLIC_SANITY_DATASET` set (already exists)
- [ ] `SANITY_API_TOKEN` set (if needed for authenticated queries)

**Deployment Steps:**
1. Merge to main branch
2. Verify production build: `npm run build`
3. Deploy to Vercel (automatic)
4. Monitor deployment logs
5. Test on production URL
6. Monitor error tracking (Sentry/Vercel Analytics)

**Post-Deployment:**
- [ ] Verify link previews work on production
- [ ] Check API response times
- [ ] Monitor error rates for 24 hours
- [ ] Collect initial user feedback
- [ ] Review analytics data after 1 week

### Tasks with File Paths

1. **Write API endpoint tests**
   - Path: `/src/app/api/link-metadata/__tests__/route.test.ts`
   - Run: `npm run test`

2. **Write component tests**
   - Path: `/src/components/chatbot/__tests__/LinkPreview.test.tsx`
   - Run: `npm run test`

3. **Write E2E tests**
   - Path: `/tests/chatbot-link-preview.spec.ts`
   - Run: `npm run test:e2e`

4. **Visual regression tests**
   - Setup: Install Playwright screenshots
   - Run: `npm run test:visual`

5. **Performance testing**
   - Use Chrome DevTools Lighthouse
   - Test on Slow 3G, Fast 3G, 4G
   - Measure and document metrics

6. **Cross-browser testing**
   - Test on Chrome, Safari, Firefox, Edge
   - Test on iOS Safari, Chrome Mobile

7. **User feedback collection**
   - Share beta link with testers
   - Create feedback form
   - Collect and analyze responses

8. **Create deployment PR**
   - Branch: `feature/chatbot-link-previews`
   - PR description with screenshots
   - Request review from team

### Acceptance Criteria

- [ ] All unit tests passing (100% coverage for API, LinkPreview)
- [ ] All integration tests passing
- [ ] All E2E tests passing
- [ ] Visual regression tests passing (no unintended changes)
- [ ] Performance metrics within targets
- [ ] Cross-browser testing complete (no major issues)
- [ ] Mobile testing complete (iOS + Android)
- [ ] User feedback collected (5+ testers)
- [ ] Documentation complete
- [ ] Deployment checklist complete
- [ ] Zero critical bugs
- [ ] Ready for production deployment

### Estimated Time

- Unit tests: 3 hours
- Component tests: 2 hours
- E2E tests: 2 hours
- Visual regression setup: 1 hour
- Performance testing: 2 hours
- Cross-browser testing: 1 hour
- User feedback collection: 1 hour (async)
- Bug fixes: 4 hours (buffer)
- Documentation: 2 hours
- Deployment preparation: 1 hour
- **Total: 19 hours (2-3 days)**

### Risk Mitigation

**Risk 1: Tests Failing in CI/CD**
- **Mitigation**: Run all tests locally before pushing
- **Fallback**: Fix tests before deploying

**Risk 2: Performance Regression**
- **Mitigation**: Monitor metrics during testing
- **Fallback**: Optimize or add feature flag to disable

**Risk 3: Production Bugs**
- **Mitigation**: Comprehensive testing + user feedback
- **Fallback**: Quick rollback capability

---

## Technical Implementation Details

### File Structure and Organization

```
/src
├── app
│   ├── api
│   │   └── link-metadata
│   │       ├── route.ts                 # API endpoint
│   │       └── __tests__
│   │           └── route.test.ts        # API tests
│   └── ...
├── components
│   ├── chatbot
│   │   ├── LinkPreview.tsx              # Main component
│   │   └── __tests__
│   │       └── LinkPreview.test.tsx     # Component tests
│   ├── navigation
│   │   └── ChatSection.tsx              # Integration point (updated)
│   └── ui
│       └── skeleton.tsx                 # Skeleton loader (existing)
├── types
│   └── link-metadata.ts                 # TypeScript types
└── lib
    └── sanity
        └── client.ts                    # Sanity client (existing)

/tests
└── chatbot-link-preview.spec.ts         # E2E tests

/docs
├── implementation-plans
│   └── chatbot-link-enhancement-plan.md # This document
└── archive
    └── chatbot-2025
        └── chatbot-link-enhancement-research.md # Research document
```

### API Endpoint Specification

**Endpoint**: `GET /api/link-metadata`

**Query Parameters:**

| Parameter | Type | Required | Values | Description |
|-----------|------|----------|--------|-------------|
| `type` | string | Yes | `"project"` or `"aiShowcase"` | Content type to fetch |
| `slug` | string | Yes | Any valid slug | Content slug (e.g., `"virgin-america"`) |

**Response Format:**

```typescript
// Success (200)
{
  "title": "Virgin America",
  "category": "Case Study",
  "description": "Airline website redesign that increased engagement by 2x",
  "imageUrl": "https://cdn.sanity.io/images/5n331bys/production/abc123-400x400.jpg"
}

// Error (400, 404, 500)
{
  "error": "Error message"
}
```

**Response Headers:**

```
Cache-Control: public, s-maxage=300, stale-while-revalidate=600
Content-Type: application/json
```

**Error Codes:**

| Code | Scenario | Response |
|------|----------|----------|
| 200 | Success | Metadata object |
| 400 | Missing parameters | `{ error: "Missing required parameters: type and slug" }` |
| 400 | Invalid type | `{ error: "Invalid type. Must be 'project' or 'aiShowcase'" }` |
| 404 | Resource not found | `{ error: "Resource not found" }` |
| 500 | Sanity API error | `{ error: "Internal server error" }` |

### Component Architecture

**LinkPreview Component Flow:**

```
┌─────────────────────────────────────────┐
│          LinkPreview Component          │
└─────────────────────────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │  Parse URL Pattern   │
         │  /case-studies/[slug]│
         │  /ai-showcase/[slug] │
         └──────────────────────┘
                    │
            ┌───────┴───────┐
            │               │
    Not Matched        Matched
            │               │
            ▼               ▼
    ┌──────────────┐  ┌────────────────┐
    │ Standard Link│  │  Check Cache   │
    └──────────────┘  └────────────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
                In Cache         Not in Cache
                    │                 │
                    ▼                 ▼
            ┌──────────────┐  ┌──────────────┐
            │ Return Cached│  │Show Skeleton │
            │   Metadata   │  │  Fetch API   │
            └──────────────┘  └──────────────┘
                    │                 │
                    │          ┌──────┴──────┐
                    │          │             │
                    │      Success        Error
                    │          │             │
                    │          ▼             ▼
                    │  ┌──────────────┐  ┌──────────────┐
                    │  │  Cache Data  │  │Standard Link │
                    │  │Store Metadata│  └──────────────┘
                    │  └──────────────┘
                    │          │
                    └──────────┤
                               ▼
                    ┌──────────────────────┐
                    │  Render Rich Preview │
                    │  - Image             │
                    │  - Category Badge    │
                    │  - Title             │
                    │  - Description       │
                    └──────────────────────┘
```

### Caching Strategy

**Client-Side Cache:**

```typescript
// In-memory Map cache
const cache = new Map<string, { data: LinkMetadata; timestamp: number }>();

// Cache key format: "type:slug"
// Example: "project:virgin-america"

// Cache duration: 5 minutes (300,000ms)
const CACHE_DURATION = 5 * 60 * 1000;

// Eviction: Automatic (check timestamp on retrieval)
if (Date.now() - cached.timestamp > CACHE_DURATION) {
  cache.delete(cacheKey);
}
```

**Benefits:**
- Prevents redundant API calls for same link
- Reduces server load
- Improves perceived performance
- Syncs with API cache duration (5 minutes)

**Limitations:**
- Cache cleared on page refresh
- No shared cache between users
- No cache persistence

**Future Enhancement:**
- Use localStorage for persistence
- Share cache across chatbot instances
- Implement LRU eviction for memory management

### Error Handling Approach

**Three-Tier Fallback System:**

1. **Tier 1: Rich Preview** (Happy path)
   - Metadata fetched successfully
   - Image and description available
   - Display full preview card

2. **Tier 2: Text-Only Preview** (Partial data)
   - Metadata fetched but no image
   - Display title and description without image
   - Still better than standard link

3. **Tier 3: Standard Link** (Error/Fallback)
   - API error or timeout
   - Non-case-study URL
   - Display plain underlined link

**Error Logging:**

```typescript
// Client-side error logging
catch (err) {
  console.error('Error fetching link metadata:', {
    href,
    type,
    slug,
    error: err instanceof Error ? err.message : 'Unknown error',
  });
  setError(true);
}

// Server-side error logging
catch (error) {
  console.error('Error in link-metadata API:', {
    type,
    slug,
    error: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined,
    timestamp: new Date().toISOString(),
  });
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}
```

### Fallback Strategies for Missing Data

**Scenario 1: Missing Featured Image**

```typescript
// API returns imageUrl: null
// Component renders text-only preview

<a href={href} className="block my-4 p-3 bg-chat-suggestion/30 rounded">
  <div className="text-xs text-accent uppercase tracking-wider mb-1">
    {metadata.category}
  </div>
  <h4 className="font-medium text-chat-foreground mb-2">
    {metadata.title}
  </h4>
  <p className="text-sm text-chat-foreground/70 line-clamp-3">
    {metadata.description}
  </p>
</a>
```

**Scenario 2: Missing Description**

```typescript
// API returns description: ""
// Component renders title-only preview

<a href={href} className="block my-4 p-3 bg-chat-suggestion/30 rounded">
  <div className="flex gap-4">
    {metadata.imageUrl && <img src={metadata.imageUrl} alt={metadata.title} />}
    <div className="flex-1">
      <div className="text-xs text-accent uppercase tracking-wider mb-1">
        {metadata.category}
      </div>
      <h4 className="font-medium text-chat-foreground">
        {metadata.title}
      </h4>
    </div>
  </div>
</a>
```

**Scenario 3: Missing All Metadata**

```typescript
// API returns 404 or error
// Component renders standard link

<a href={href} className="underline hover:no-underline text-accent">
  {children}
</a>
```

---

## Testing Strategy

### Unit Tests

**Target Coverage: 90%+**

**API Endpoint Tests:**
- ✅ Returns 200 for valid requests
- ✅ Returns 400 for missing parameters
- ✅ Returns 400 for invalid type
- ✅ Returns 404 for non-existent slug
- ✅ Returns correct metadata format
- ✅ Includes proper cache headers
- ✅ Handles Sanity API errors
- ✅ Optimizes image URLs correctly

**LinkPreview Component Tests:**
- ✅ Renders standard link for external URLs
- ✅ Shows skeleton loader while fetching
- ✅ Displays rich preview when loaded
- ✅ Handles API errors gracefully
- ✅ Uses cached data for repeated calls
- ✅ Handles missing images
- ✅ Handles missing descriptions
- ✅ Responsive layout changes

### Integration Tests

**Target: All critical user flows**

**ChatSection Integration:**
- ✅ LinkPreview renders in chat responses
- ✅ Multiple previews in one response
- ✅ Mixed preview and standard links
- ✅ Follow-up questions with links (if implemented)

**Markdown Rendering:**
- ✅ ReactMarkdown parses links correctly
- ✅ LinkPreview component receives correct props
- ✅ Other markdown elements unaffected (headings, lists, code)

### E2E Tests

**Target: Core user scenarios**

**User Flows:**
1. Ask about case study → See preview → Click → Navigate to page
2. Ask general question → No previews (standard links only)
3. Multiple case study mentions → Multiple previews
4. Mobile flow → Vertical layout → Touch to navigate
5. Slow network → Skeleton loads → Preview appears → Navigate

**Test Environments:**
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x667)

### Visual Regression Tests

**Screenshot Comparison:**

```bash
# Capture baseline screenshots
npm run test:visual:baseline

# Run comparison tests
npm run test:visual

# Update baselines (after visual changes)
npm run test:visual:update
```

**Test Cases:**
- Link preview card (desktop)
- Link preview card (mobile)
- Loading skeleton
- Error state (standard link)
- Text-only preview (no image)
- Multiple previews in chat

**Tools:**
- Playwright screenshots
- Percy.io (optional)
- Chromatic (optional)

### Edge Cases to Cover

| Edge Case | Expected Behavior | Test Type |
|-----------|-------------------|-----------|
| Very long title | Wraps or truncates | Manual |
| Very long description | Line clamps to 2-3 lines | Unit |
| Missing featured image | Text-only preview | Unit |
| Missing description | Title-only preview | Unit |
| API timeout (5s+) | Falls back to standard link | Integration |
| Network offline | Falls back to standard link | E2E |
| Cached data expired | Refetches from API | Unit |
| Multiple same links | Only fetches once | Integration |
| 10+ previews in chat | All load without issues | E2E |
| Image load failure | Broken image icon or placeholder | Manual |
| Markdown syntax in title | Renders correctly (escaped) | Unit |
| XSS attempt in metadata | Sanitized (React escapes) | Security |

---

## Success Metrics

### User Engagement Targets

**Click-Through Rate (CTR):**
- Baseline: Current CTR on plain links
- Target: 30% increase with rich previews
- Measurement: Analytics tracking

**Time on Linked Pages:**
- Target: Users spend 20% more time on pages from previews
- Indicates better expectation setting

**Bounce Rate:**
- Target: 15% decrease in bounce rate from preview links
- Indicates better match between preview and content

**Return to Chatbot:**
- Target: Track if users return to chatbot after viewing page
- Indicates successful recommendation

### Performance Benchmarks

**API Response Time:**
- Target (P50): < 100ms
- Target (P95): < 200ms
- Target (P99): < 500ms
- Measurement: Server logs, Vercel Analytics

**Image Load Time:**
- Target (P50): < 200ms
- Target (P95): < 500ms
- Target (P99): < 1000ms
- Measurement: Browser Performance API

**Cache Hit Rate:**
- Target: > 80% of requests served from cache
- Measurement: Client-side logging

**First Contentful Paint:**
- Target: No regression from current baseline
- Measurement: Lighthouse, WebPageTest

**Cumulative Layout Shift:**
- Target: 0 (no shift during preview load)
- Measurement: Lighthouse, Chrome DevTools

### User Feedback Metrics

**Satisfaction Score:**
- Question: "How helpful are the preview cards?"
- Scale: 1-5 stars
- Target: Average 4.0+

**Preference:**
- Question: "Do you prefer preview cards or plain links?"
- Options: Preview cards, Plain links, No preference
- Target: 70%+ prefer preview cards

**Usability:**
- Question: "Are the previews easy to use on your device?"
- Options: Very easy, Easy, Neutral, Difficult, Very difficult
- Target: 80%+ say "Easy" or "Very easy"

### Technical Metrics

**Error Rate:**
- Target: < 1% of preview loads fail
- Measurement: Error tracking (Sentry, Vercel)

**API Availability:**
- Target: 99.9% uptime
- Measurement: Uptime monitoring

**Cache Invalidation:**
- Target: Stale data < 0.1% of requests
- Measurement: Manual checks after content updates

---

## Deployment Checklist

### Pre-Deployment Verification

**Code Quality:**
- [ ] All tests passing (unit, integration, E2E)
- [ ] TypeScript compilation successful
- [ ] ESLint warnings resolved
- [ ] No console errors in development
- [ ] Code reviewed and approved

**Performance:**
- [ ] Production build successful (`npm run build`)
- [ ] Lighthouse score unchanged or improved
- [ ] API response times < 200ms (P95)
- [ ] No layout shifts (CLS = 0)
- [ ] Image optimization verified

**Cross-Browser:**
- [ ] Chrome (latest) tested
- [ ] Safari (latest) tested
- [ ] Firefox (latest) tested
- [ ] Edge (latest) tested
- [ ] iOS Safari tested
- [ ] Chrome Mobile tested

**Accessibility:**
- [ ] Keyboard navigation works
- [ ] Screen reader tested (VoiceOver/NVDA)
- [ ] Color contrast ratios pass WCAG AA
- [ ] Focus indicators visible
- [ ] Alt text on all images

**Documentation:**
- [ ] README updated (if needed)
- [ ] API documentation complete
- [ ] Component docs updated
- [ ] Maintenance procedures documented

### Environment Variables Needed

**Existing (Already Configured):**
- `NEXT_PUBLIC_SANITY_PROJECT_ID`: 5n331bys
- `NEXT_PUBLIC_SANITY_DATASET`: production
- `NEXT_PUBLIC_SANITY_API_VERSION`: 2023-05-03

**New (If Needed):**
- `SANITY_API_TOKEN`: Optional, for authenticated queries (not required for public data)

**Verify in Vercel:**
```bash
# Check environment variables
vercel env ls

# Add if needed
vercel env add SANITY_API_TOKEN
```

### Database/CMS Considerations

**Sanity CMS:**
- No schema changes required (all fields exist)
- No migrations needed
- No data updates required

**Verify Data Availability:**
- [ ] All case studies have `featuredImage`
- [ ] All case studies have `featuredDescription` or `heroSection.subtitle`
- [ ] Image assets are accessible
- [ ] Slugs match system prompt URLs

**Content Updates (If Needed):**
```bash
# Log into Sanity Studio
open http://localhost:3000/studio

# Check each case study:
# - Featured Image exists
# - Featured Description populated
# - Hero Section subtitle/summary populated
```

### Deployment Steps

1. **Create Deployment Branch:**
   ```bash
   git checkout -b feature/chatbot-link-previews
   git add .
   git commit -m "Add rich link previews to chatbot"
   git push origin feature/chatbot-link-previews
   ```

2. **Create Pull Request:**
   - Title: "Add rich link previews to chatbot"
   - Description: Include screenshots, testing notes, metrics
   - Request review from team

3. **Pre-Merge Checklist:**
   - [ ] All CI/CD checks passing
   - [ ] Code review approved
   - [ ] No merge conflicts
   - [ ] Changelog updated (if applicable)

4. **Merge to Main:**
   ```bash
   git checkout main
   git pull origin main
   git merge feature/chatbot-link-previews
   git push origin main
   ```

5. **Verify Production Build:**
   ```bash
   npm run build
   # Check for errors
   ```

6. **Deploy to Vercel:**
   - Automatic deployment on push to main
   - Monitor deployment logs in Vercel dashboard
   - Verify deployment success

7. **Post-Deployment Verification:**
   - [ ] Visit production URL
   - [ ] Open chatbot
   - [ ] Ask about case study
   - [ ] Verify preview displays
   - [ ] Click preview and navigate
   - [ ] Check mobile responsiveness

8. **Monitor for Issues:**
   - [ ] Check Vercel Analytics for errors
   - [ ] Monitor API response times
   - [ ] Watch for user feedback
   - [ ] Review first 24 hours of data

### Rollback Plan

**If Critical Issues Found:**

1. **Immediate Rollback:**
   ```bash
   # Revert deployment in Vercel
   vercel rollback

   # Or revert Git commit
   git revert HEAD
   git push origin main
   ```

2. **Investigate Issue:**
   - Check error logs
   - Reproduce bug locally
   - Identify root cause

3. **Fix and Redeploy:**
   - Create hotfix branch
   - Fix issue
   - Test thoroughly
   - Deploy fix

**Non-Critical Issues:**
- Create GitHub issue
- Prioritize for next sprint
- Add to backlog

---

## Post-Launch Monitoring

### Metrics to Track (First 7 Days)

**Performance Metrics:**
- [ ] API response time (P50, P95, P99)
- [ ] API error rate
- [ ] Image load time
- [ ] Cache hit rate
- [ ] First Contentful Paint
- [ ] Cumulative Layout Shift

**Engagement Metrics:**
- [ ] Click-through rate on previews
- [ ] Time on linked pages
- [ ] Bounce rate from previews
- [ ] Return to chatbot rate

**Error Metrics:**
- [ ] Preview load failures
- [ ] API errors (400, 404, 500)
- [ ] Client-side errors
- [ ] Image load failures

**User Feedback:**
- [ ] Satisfaction ratings
- [ ] Feature preference
- [ ] Bug reports
- [ ] Feature requests

### Performance Monitoring Tools

**Vercel Analytics:**
- Real-time performance data
- Error tracking
- Function execution logs
- Bandwidth usage

**Google Analytics (If Configured):**
```javascript
// Track preview click
window.gtag('event', 'link_preview_click', {
  event_category: 'engagement',
  event_label: slug,
  value: 1,
});
```

**Sentry (If Configured):**
```javascript
// Track errors
try {
  await fetch(`/api/link-metadata?type=${type}&slug=${slug}`);
} catch (error) {
  Sentry.captureException(error, {
    tags: { feature: 'link-preview', slug },
  });
}
```

### User Feedback Collection Methods

**In-App Feedback:**
```tsx
// Optional: Add feedback button after using preview
<button onClick={() => setShowFeedback(true)}>
  Was this helpful?
</button>
```

**Survey (Google Form/Typeform):**
- Share with beta testers
- Include in weekly newsletter
- Prompt after 3-5 preview clicks

**Analytics Tracking:**
```javascript
// Track preview interactions
analytics.track('Link Preview Displayed', { slug });
analytics.track('Link Preview Clicked', { slug });
analytics.track('Link Preview Error', { slug, error });
```

### Weekly Review Checklist

**Week 1:**
- [ ] Review all metrics
- [ ] Identify any issues
- [ ] Collect user feedback
- [ ] Plan optimizations

**Week 2-4:**
- [ ] Track trend changes
- [ ] A/B test variations (if applicable)
- [ ] Implement minor improvements
- [ ] Document learnings

**Month 1:**
- [ ] Comprehensive performance review
- [ ] User satisfaction analysis
- [ ] ROI assessment (time vs. benefit)
- [ ] Plan future enhancements

---

## Maintenance Procedures

### Regular Maintenance Tasks

**Weekly:**
- Review error logs for new issues
- Check API performance metrics
- Monitor cache hit rate
- Review user feedback

**Monthly:**
- Update dependencies (if security patches)
- Review and optimize image sizes
- Check for stale cache issues
- Update documentation if needed

**Quarterly:**
- Performance audit
- User satisfaction survey
- Consider feature enhancements
- Review competitor implementations

### Troubleshooting Guide

**Issue: Previews Not Loading**

1. Check API endpoint:
   ```bash
   curl "http://localhost:3000/api/link-metadata?type=project&slug=virgin-america"
   ```
2. Verify Sanity connection:
   - Check `NEXT_PUBLIC_SANITY_PROJECT_ID` environment variable
   - Test Sanity Studio: `http://localhost:3000/studio`
3. Check browser console for errors
4. Verify cache isn't stale (clear cache)

**Issue: Images Not Displaying**

1. Verify image URL in API response
2. Check Sanity CDN availability
3. Verify `urlFor()` function working
4. Check CORS headers (should be none needed)

**Issue: Slow Loading**

1. Check API response time in Network tab
2. Verify cache is working (second load should be instant)
3. Check image sizes (should be 400x400)
4. Test with network throttling

**Issue: Layout Breaking on Mobile**

1. Test with DevTools mobile emulation
2. Check responsive classes (`sm:` prefixes)
3. Verify image aspect ratios
4. Test on real device

### Content Updates

**When Adding New Case Study:**

1. Add to Sanity CMS with required fields:
   - `featuredImage` (required for preview)
   - `featuredDescription` (required for preview text)
   - `heroSection.subtitle` (fallback for description)

2. Update system prompt with new URL (if needed):
   ```typescript
   // /src/app/api/chat/route.ts
   Available URLs for linking:
   • Case Studies:
     - /case-studies/virgin-america
     - /case-studies/casa-bonita
     - /case-studies/target
     - /case-studies/before-launcher
     - /case-studies/new-project-slug  // ADD NEW SLUG
   ```

3. Test preview:
   - Ask chatbot about new case study
   - Verify preview displays correctly
   - Check image and description

**When Updating Existing Case Study:**

- Preview will auto-update after 5 minutes (cache expiry)
- Or clear cache manually in development
- No code changes needed

### Future Enhancement Ideas

**Short-Term (Next 1-3 Months):**
- Add metrics to previews (e.g., "2x revenue increase")
- Show technology tags in preview
- Add "Related case studies" section
- Hover preview for desktop (keep card for mobile)

**Medium-Term (3-6 Months):**
- Structured response format (Option 4 from research)
- Prefetch likely case study data
- A/B test different preview styles
- Add analytics dashboard for link performance

**Long-Term (6+ Months):**
- AI-generated preview summaries
- Personalized recommendations
- Video previews for video-based case studies
- Interactive preview cards (expandable sections)

---

## Appendix

### Reference Documents

- **Research Document**: `/docs/archive/chatbot-2025/chatbot-link-enhancement-research.md`
- **CLAUDE.md**: `/CLAUDE.md` (project instructions)
- **Current Memory Bank**: `/memory-bank/CURRENT.md`

### Key Files Reference

| File Path | Purpose | Lines | Dependencies |
|-----------|---------|-------|--------------|
| `/src/app/api/link-metadata/route.ts` | API endpoint | ~150 | `@/lib/sanity/client` |
| `/src/components/chatbot/LinkPreview.tsx` | Main component | ~150 | `@/components/ui/skeleton`, `@/types/link-metadata` |
| `/src/components/navigation/ChatSection.tsx` | Integration point | ~350 | `@/components/chatbot/LinkPreview` |
| `/src/types/link-metadata.ts` | TypeScript types | ~20 | None |
| `/sanity/schemas/project.ts` | Project schema | ~300 | Existing |
| `/src/lib/sanity/client.ts` | Sanity client | ~50 | Existing |

### Command Reference

```bash
# Development
npm run dev                    # Start dev server

# Testing
npm run test                   # Run unit tests
npm run test:e2e              # Run E2E tests
npm run test:visual           # Run visual regression tests
npm run test:visual:baseline  # Capture baseline screenshots

# Building
npm run build                 # Production build
npm run start                 # Start production server

# Linting
npm run lint                  # Run ESLint
npm run lint:fix              # Auto-fix issues

# Deployment
git push origin main          # Auto-deploy to Vercel
vercel deploy                 # Manual deploy
vercel rollback              # Rollback deployment
```

### Timeline Summary

| Phase | Duration | Days | Cumulative |
|-------|----------|------|------------|
| Phase 1: API Endpoint | 3-4 days | 4 | 4 days |
| Phase 2: UI Components | 3-4 days | 4 | 8 days |
| Phase 3: Integration | 2-3 days | 3 | 11 days |
| Phase 4: Testing | 3-4 days | 4 | 15 days |
| **Total** | **11-15 days** | **15** | **2-3 weeks** |

### Resource Allocation

**Developer Time:**
- Backend (API): 1 day
- Frontend (Component): 2 days
- Integration: 1 day
- Testing: 2 days
- Documentation: 0.5 days
- Buffer: 1.5 days
- **Total: 8 developer days**

**Design Time:**
- Component design: 0.5 days
- Responsive specs: 0.5 days
- **Total: 1 day**

**QA Time:**
- Test planning: 0.5 days
- Manual testing: 1 day
- Bug verification: 0.5 days
- **Total: 2 days**

**Total Project Effort: ~11 days (2-3 weeks calendar time)**

---

## Document Metadata

**Document Version**: 1.1
**Author**: Claude Code
**Date**: November 4, 2025
**Status**: Ready for Implementation
**Reviewed By**: Pending
**Approved By**: Pending
**Next Review Date**: After Phase 1 completion

**Change Log:**
- 2025-11-04 v1.0: Initial version created based on research document
- 2025-11-04 v1.1: Updated to emphasize this is a UI/presentation enhancement only. Clarified that chatbot content recommendations are already excellent and no changes to AI logic, prompts, or content selection are needed.

**Related Documents:**
- Research: `/docs/archive/chatbot-2025/chatbot-link-enhancement-research.md`
- Project Instructions: `/CLAUDE.md`
- Memory Bank: `/memory-bank/CURRENT.md`

**Contact:**
For questions or clarifications about this implementation plan, contact: [Project Owner]

---

**Ready to begin implementation? Start with Phase 1: API Endpoint & Metadata Fetching**
