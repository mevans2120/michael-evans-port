# Chatbot Link Enhancement Research

**Date**: November 4, 2025  
**Status**: Research Complete  
**Version**: 1.0  

## Executive Summary

The AI chatbot currently returns plain markdown links when recommending case studies and AI showcase projects. This research explores options to enhance these links with rich metadata (featured images, descriptions, previews) to create a more engaging and informative user experience.

**Key Findings:**
- Current implementation uses plain markdown links parsed by `react-markdown`
- Sanity schemas contain all necessary metadata (featuredImage, descriptions, summaries)
- Links are NOT directly clickable in some scenarios due to follow-up question parsing
- Multiple implementation approaches available, ranging from simple metadata to rich card components

**Recommended Approach:** Custom markdown component renderer with link preview cards (Option 3)

---

## Current State Analysis

### How Links Work Now

#### 1. Link Generation (Backend)
**Location**: `/src/app/api/chat/route.ts` (Lines 105-127)

The system prompt instructs Claude to return links in this format:

```markdown
**Follow-up questions:**
- [Question about specific project](/case-studies/project-slug)
- [Another question with link](/url) OR Plain text question

If your answer was about a specific project:
**Learn more:** [Full Project Name](/case-studies/project-slug)
```

**Hardcoded URLs in System Prompt:**
```javascript
Available URLs for linking:
• Case Studies:
  - /case-studies/virgin-america
  - /case-studies/casa-bonita
  - /case-studies/target
  - /case-studies/before-launcher
• AI Showcase: /ai-showcase
```

**Current Limitations:**
- URLs are hardcoded in system prompt (must be manually updated)
- No metadata passed with links (just URL + text)
- No images or previews included
- Claude must remember which slugs exist

#### 2. Link Parsing (Frontend)
**Location**: `/src/components/navigation/ChatSection.tsx` (Lines 140-159)

```typescript
const parseFollowUpQuestions = (text: string): { mainContent: string; questions: string[] } => {
  const followUpPattern = /\*\*Follow-up questions:\*\*\s*\n((?:- .+\n?)+)/i;
  const match = text.match(followUpPattern);
  
  // Extracts follow-up questions as plain strings
  // Includes markdown link syntax: "[Question text](/url)"
  const questions = questionsText
    .split('\n')
    .filter(line => line.trim().startsWith('-'))
    .map(line => line.trim().substring(1).trim());
  
  return { mainContent, questions };
}
```

**What Happens:**
1. Follow-up questions extracted from response
2. Each question rendered as a `<button>` with the full markdown text
3. When clicked, the markdown text is sent to the chatbot (not navigating to the link)
4. This means links in follow-up questions are NOT clickable - they're sent as questions

#### 3. Link Rendering
**Location**: `/src/components/navigation/ChatSection.tsx` (Lines 279-303)

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

**Current Rendering:**
- Uses `react-markdown` library with `remark-gfm` plugin
- Markdown links in main content ARE clickable
- Styled with: `underline hover:no-underline text-sm`
- No special handling for links (standard anchor tags)

### Current User Experience

**Scenario 1: Link in Main Content**
```markdown
Michael worked on Virgin America. **Learn more:** [Virgin America Case Study](/case-studies/virgin-america)
```
- ✅ Link IS clickable
- ❌ No preview or image
- ❌ No indication of what they'll see

**Scenario 2: Link in Follow-up Question**
```markdown
**Follow-up questions:**
- [What challenges did Michael face on Virgin America?](/case-studies/virgin-america)
```
- ❌ Link is NOT clickable (button sends text as question)
- Clicking sends the full markdown string as a message
- User doesn't navigate to the page

---

## Available Data from Sanity Schemas

### Case Study Schema (Project)
**Location**: `/sanity/schemas/project.ts`

**Available Fields:**
```typescript
{
  title: string                           // "Virgin America"
  slug: { current: string }               // "virgin-america"
  category: string                        // "Case Study"
  summary: string                         // Brief overview (deprecated but populated)
  description: string                     // Longer description (deprecated but populated)
  featuredImage: {                        // Main project image
    asset: { url: string, _id: string }
    alt: string
  }
  featuredDescription: string             // Description for featured sections
  featuredMetric: string                  // "2x revenue", "$1M saved"
  heroSection: {                          // New editorial format
    badge: string                         // "Case Study"
    title: string                         // Hero title
    subtitle: string                      // 1-2 sentence tagline
    summary: string                       // 2-3 sentence overview
  }
  metrics: Array<{
    label: string                         // "Revenue"
    value: string                         // "2x increase"
    description: string                   // Optional context
  }>
  technologies: string[]                  // ["React", "Next.js", "TypeScript"]
  overview: {
    role: string                          // "Lead Product Manager"
    company: string                       // "Work & Co"
    timeline: string                      // "~1 year (2014-2015)"
  }
}
```

**Current Data Availability:**
- ✅ Featured images exist for all case studies
- ✅ Descriptions/summaries available
- ✅ Metrics and key info available
- ✅ All data accessible via Sanity API

### AI Showcase Schema
**Location**: `/sanity/schemas/aiShowcase.ts`

**Available Fields:**
```typescript
{
  title: string                           // "AI Workflow Showcase"
  slug: { current: string }               // "ai-workflow-showcase"
  category: string                        // "ai-workflow"
  featuredImage: {                        // Main showcase image
    asset: { url: string }
    alt: string
  }
  heroSection: {
    badge: string                         // "AI Workflow Showcase"
    title: string
    subtitle: string                      // Tagline
    summary: string                       // Brief overview
  }
  metrics: Array<{
    value: string                         // "1000+", "< 1 Week"
    label: string                         // "GitHub Commits"
    description: string                   // Optional context
  }>
}
```

### Image URL Generation
**Location**: `/src/lib/sanity/client.ts`

```typescript
import imageUrlBuilder from '@sanity/image-url'

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}

// Usage:
urlFor(featuredImage).width(400).height(300).url()
// Returns: "https://cdn.sanity.io/images/5n331bys/production/abc123-400x300.jpg"
```

---

## Implementation Options

### Option 1: Metadata-Only Enhancement (Simple)

**Description**: Pass metadata alongside links in the chatbot response without changing the UI

**Approach:**
1. Modify system prompt to return structured metadata
2. Parse metadata in frontend
3. Store for potential future use
4. Keep current UI (clickable links only)

**Example Response Format:**
```json
{
  "text": "Michael worked on Virgin America...",
  "links": [
    {
      "text": "Virgin America Case Study",
      "url": "/case-studies/virgin-america",
      "image": "https://cdn.sanity.io/images/...",
      "description": "Airline website redesign..."
    }
  ]
}
```

**Pros:**
- ✅ Minimal UI changes
- ✅ Data available for future enhancements
- ✅ Backward compatible

**Cons:**
- ❌ No immediate visual improvement
- ❌ Still requires manual URL maintenance
- ❌ Doesn't utilize available data

**Complexity**: Low  
**Recommendation**: ❌ Not recommended (adds complexity without user benefit)

---

### Option 2: Dynamic Link Injection (Medium)

**Description**: Fetch link metadata dynamically after Claude generates response

**Approach:**
1. Claude returns standard markdown links
2. Frontend detects case study/AI showcase URLs
3. Fetch metadata from Sanity for detected links
4. Enhance links with tooltip/preview on hover
5. Keep standard markdown rendering

**Implementation Steps:**

**Backend (`/src/app/api/chat/route.ts`):**
```typescript
// Add after response generation
async function enrichLinks(responseText: string) {
  // Extract all case study links
  const linkRegex = /\[([^\]]+)\]\(\/case-studies\/([a-z-]+)\)/g;
  const matches = [...responseText.matchAll(linkRegex)];
  
  // Fetch metadata for each unique slug
  const linkMetadata = await Promise.all(
    matches.map(async ([, text, slug]) => {
      const project = await client.fetch(
        `*[_type == "project" && slug.current == $slug][0] {
          title,
          featuredImage,
          "imageUrl": featuredImage.asset->url,
          featuredDescription,
          heroSection
        }`,
        { slug }
      );
      return { slug, metadata: project };
    })
  );
  
  return { text: responseText, links: linkMetadata };
}
```

**Frontend (`/src/components/navigation/ChatSection.tsx`):**
```tsx
// Custom link component with hover preview
const LinkWithPreview = ({ href, children, metadata }: LinkProps) => {
  const [showPreview, setShowPreview] = useState(false);
  
  return (
    <span className="relative">
      <a
        href={href}
        onMouseEnter={() => setShowPreview(true)}
        onMouseLeave={() => setShowPreview(false)}
        className="underline hover:no-underline"
      >
        {children}
      </a>
      
      {showPreview && metadata && (
        <div className="absolute bottom-full left-0 mb-2 w-80 p-4 bg-card border rounded-lg shadow-lg z-50">
          {metadata.imageUrl && (
            <img src={metadata.imageUrl} alt={metadata.title} className="w-full h-40 object-cover rounded mb-2" />
          )}
          <h4 className="font-medium">{metadata.title}</h4>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {metadata.featuredDescription}
          </p>
        </div>
      )}
    </span>
  );
};
```

**Pros:**
- ✅ No system prompt changes needed
- ✅ Works with existing responses
- ✅ Hover previews enhance UX
- ✅ Automatic metadata enrichment

**Cons:**
- ❌ Additional API calls (1 per unique link)
- ❌ Hover-only (not mobile friendly)
- ❌ Complex state management
- ❌ Still requires URL parsing

**Complexity**: Medium  
**Recommendation**: ⚠️ Consider for hover-only preview enhancement

---

### Option 3: Custom Markdown Component (Recommended)

**Description**: Replace markdown link renderer with custom component that fetches and displays metadata

**Approach:**
1. Keep markdown links in responses
2. Create custom ReactMarkdown link component
3. Detect case study/AI showcase links
4. Fetch metadata and render as rich preview card
5. Fall back to standard link for other URLs

**Implementation Steps:**

**Step 1: Create Link Preview Component**
```tsx
// /src/components/chatbot/LinkPreview.tsx
import { useEffect, useState } from 'react';
import { urlFor } from '@/lib/sanity/client';

interface LinkMetadata {
  title: string;
  description: string;
  imageUrl: string;
  category: string;
}

export function LinkPreview({ href, children }: { href: string; children: React.ReactNode }) {
  const [metadata, setMetadata] = useState<LinkMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Only fetch for case study/ai showcase links
    const isCaseStudy = href.match(/^\/case-studies\/([a-z-]+)$/);
    const isAIShowcase = href.match(/^\/ai-showcase\/([a-z-]+)$/);
    
    if (!isCaseStudy && !isAIShowcase) {
      setLoading(false);
      return;
    }
    
    const slug = isCaseStudy ? isCaseStudy[1] : isAIShowcase?.[1];
    const type = isCaseStudy ? 'project' : 'aiShowcase';
    
    // Fetch metadata
    fetch(`/api/link-metadata?type=${type}&slug=${slug}`)
      .then(res => res.json())
      .then(data => {
        setMetadata(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [href]);
  
  // Standard link for non-case-study URLs or while loading
  if (loading || !metadata) {
    return (
      <a href={href} className="underline hover:no-underline text-accent">
        {children}
      </a>
    );
  }
  
  // Rich preview card
  return (
    <a
      href={href}
      className="block my-4 p-4 bg-chat-suggestion/30 border border-chat-input-border rounded-lg hover:bg-chat-suggestion/50 transition-colors group"
    >
      <div className="flex gap-4">
        {/* Featured Image */}
        {metadata.imageUrl && (
          <div className="flex-shrink-0 w-32 h-32 bg-chat-message rounded overflow-hidden">
            <img
              src={metadata.imageUrl}
              alt={metadata.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="text-xs text-accent uppercase tracking-wider mb-1">
            {metadata.category}
          </div>
          <h4 className="font-medium text-chat-foreground group-hover:text-accent transition-colors mb-2">
            {metadata.title}
          </h4>
          <p className="text-sm text-chat-foreground/70 line-clamp-2">
            {metadata.description}
          </p>
        </div>
      </div>
    </a>
  );
}
```

**Step 2: Create API Endpoint for Metadata**
```typescript
// /src/app/api/link-metadata/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { client, urlFor } from '@/lib/sanity/client';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type'); // 'project' or 'aiShowcase'
  const slug = searchParams.get('slug');
  
  if (!type || !slug) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }
  
  try {
    let query, categoryField;
    
    if (type === 'project') {
      query = `*[_type == "project" && slug.current == $slug][0] {
        title,
        category,
        featuredImage,
        featuredDescription,
        heroSection
      }`;
      categoryField = 'category';
    } else if (type === 'aiShowcase') {
      query = `*[_type == "aiShowcase" && slug.current == $slug][0] {
        title,
        category,
        featuredImage,
        heroSection
      }`;
      categoryField = 'category';
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }
    
    const data = await client.fetch(query, { slug });
    
    if (!data) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    
    // Build response
    const metadata = {
      title: data.title,
      category: data.category || 'Case Study',
      description: data.featuredDescription || data.heroSection?.subtitle || data.heroSection?.summary || '',
      imageUrl: data.featuredImage ? urlFor(data.featuredImage).width(400).height(400).url() : null,
    };
    
    return NextResponse.json(metadata);
  } catch (error) {
    console.error('Error fetching link metadata:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
```

**Step 3: Update ReactMarkdown Component**
```tsx
// /src/components/navigation/ChatSection.tsx
import { LinkPreview } from '@/components/chatbot/LinkPreview';

<ReactMarkdown
  remarkPlugins={[remarkGfm]}
  components={{
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

**Pros:**
- ✅ Rich preview cards with images
- ✅ Works with existing markdown links
- ✅ Mobile-friendly (always visible)
- ✅ Automatic metadata fetching
- ✅ Graceful fallback for non-case-study links
- ✅ No system prompt changes needed

**Cons:**
- ❌ API call per unique link (cached after first load)
- ❌ Slight delay for preview to load
- ❌ More components to maintain

**Complexity**: Medium  
**Recommendation**: ✅ **RECOMMENDED** - Best balance of UX improvement and maintainability

---

### Option 4: Structured Response with Metadata (Advanced)

**Description**: Change response format to include structured link data alongside text

**Approach:**
1. Modify system prompt to return JSON with structured links
2. Update frontend to handle new format
3. Render links with full metadata from initial response
4. No additional API calls needed

**Example Response Format:**
```json
{
  "text": "Michael worked on Virgin America, leading the product strategy...",
  "references": [
    {
      "type": "case_study",
      "slug": "virgin-america",
      "title": "Virgin America",
      "description": "Airline website redesign...",
      "imageUrl": "https://cdn.sanity.io/...",
      "metric": "2x engagement",
      "position": "end" // Where to display: "inline", "end", "sidebar"
    }
  ]
}
```

**Backend Changes:**
```typescript
// Modify system prompt to output JSON
const SYSTEM_PROMPT = `...
When referencing case studies, include structured metadata:

{
  "text": "Your response text...",
  "references": [
    {
      "type": "case_study",
      "slug": "project-slug",
      "title": "Project Title",
      "position": "end"
    }
  ]
}

Available case studies: ${JSON.stringify(availableCaseStudies)}
`;

// Fetch available case studies before creating prompt
const availableCaseStudies = await client.fetch(`
  *[_type == "project"] {
    "slug": slug.current,
    title,
    featuredDescription,
    "imageUrl": featuredImage.asset->url,
    featuredMetric,
    category
  }
`);
```

**Frontend Changes:**
```tsx
// Parse structured response
const response = JSON.parse(assistantMessage);

// Render main text
<div>{response.text}</div>

// Render reference cards
{response.references.map(ref => (
  <CaseStudyReferenceCard
    key={ref.slug}
    title={ref.title}
    description={ref.description}
    imageUrl={ref.imageUrl}
    metric={ref.metric}
    href={`/case-studies/${ref.slug}`}
  />
))}
```

**Pros:**
- ✅ Zero additional API calls
- ✅ Full metadata in initial response
- ✅ Complete control over rendering
- ✅ Can include multiple reference cards
- ✅ Better for context length (no duplicate text)

**Cons:**
- ❌ Major system prompt changes
- ❌ Breaking change to response format
- ❌ More complex prompt engineering
- ❌ Requires regenerating all responses
- ❌ Need to maintain case study list in memory

**Complexity**: High  
**Recommendation**: ⚠️ Consider for future version 2.0

---

## Technical Considerations

### 1. Performance

**API Call Overhead:**
- **Option 2 & 3**: 1 API call per unique link
- **Solution**: Implement client-side caching
  ```typescript
  const linkMetadataCache = new Map<string, LinkMetadata>();
  
  async function fetchLinkMetadata(slug: string) {
    if (linkMetadataCache.has(slug)) {
      return linkMetadataCache.get(slug);
    }
    const data = await fetch(`/api/link-metadata?slug=${slug}`).then(r => r.json());
    linkMetadataCache.set(slug, data);
    return data;
  }
  ```

**Image Loading:**
- Use Sanity's image CDN with optimized parameters
- Lazy load images below the fold
- Provide low-quality image placeholders (LQIP)
  ```typescript
  urlFor(featuredImage)
    .width(400)
    .height(400)
    .quality(80)
    .auto('format') // Automatically serve WebP where supported
    .url()
  ```

### 2. Data Freshness

**Challenge**: Metadata might be stale if content updated in Sanity

**Solutions:**
- ✅ Short cache duration (5 minutes)
- ✅ Webhook to invalidate cache on content update
- ✅ Revalidation on window focus

```typescript
// SWR-style fetching with revalidation
useSWR(`/api/link-metadata?slug=${slug}`, fetcher, {
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  dedupingInterval: 300000, // 5 minutes
});
```

### 3. Error Handling

**Scenarios:**
1. Project not found (404)
2. API timeout
3. Missing featured image
4. Network error

**Fallback Strategy:**
```typescript
function LinkPreview({ href, children }: LinkPreviewProps) {
  const [metadata, setMetadata] = useState<LinkMetadata | null>(null);
  const [error, setError] = useState(false);
  
  // On error or missing data, render standard link
  if (error || !metadata) {
    return (
      <a href={href} className="underline hover:no-underline">
        {children}
      </a>
    );
  }
  
  // If no image, render text-only preview
  if (!metadata.imageUrl) {
    return (
      <a href={href} className="block p-3 bg-chat-suggestion/30 rounded">
        <div className="text-sm font-medium">{metadata.title}</div>
        <div className="text-xs text-muted-foreground">{metadata.description}</div>
      </a>
    );
  }
  
  // Full preview with image
  return <RichPreviewCard {...metadata} />;
}
```

### 4. Mobile Experience

**Considerations:**
- Hover states don't work on mobile
- Touch targets must be 44x44px minimum
- Preview cards should be tappable
- Images should be optimized for smaller screens

**Responsive Design:**
```tsx
<a className="block my-4 p-3 md:p-4 bg-chat-suggestion/30 rounded-lg active:bg-chat-suggestion/50">
  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
    {/* Image: Full width on mobile, fixed width on desktop */}
    <div className="w-full sm:w-32 h-48 sm:h-32 rounded overflow-hidden">
      <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
    </div>
    
    {/* Content */}
    <div className="flex-1">
      <h4 className="text-base sm:text-sm font-medium">{title}</h4>
      <p className="text-sm sm:text-xs text-muted-foreground line-clamp-2 sm:line-clamp-3">
        {description}
      </p>
    </div>
  </div>
</a>
```

### 5. Accessibility

**Requirements:**
- Alt text for all images
- Keyboard navigation support
- Screen reader announcements
- ARIA labels for interactive elements

**Implementation:**
```tsx
<a
  href={href}
  className="block..."
  aria-label={`Read case study: ${metadata.title}`}
>
  <img
    src={metadata.imageUrl}
    alt={metadata.featuredImage?.alt || `${metadata.title} preview`}
    loading="lazy"
  />
  <h4 id={`link-title-${slug}`}>{metadata.title}</h4>
  <p aria-labelledby={`link-title-${slug}`}>
    {metadata.description}
  </p>
</a>
```

---

## Recommended Implementation Plan

### Phase 1: Foundation (Week 1)

**Goal**: Set up infrastructure for link enhancement

**Tasks:**
1. Create `/api/link-metadata` endpoint
   - Support both `project` and `aiShowcase` types
   - Return title, description, image URL, category
   - Add error handling and validation

2. Create `LinkPreview` component
   - Fetch metadata on mount
   - Handle loading and error states
   - Implement fallback to standard link

3. Add client-side caching
   - Use simple Map-based cache
   - 5-minute cache duration
   - Cache per slug

**Success Criteria:**
- ✅ API endpoint returns metadata for all case studies
- ✅ Component fetches and displays data
- ✅ Graceful fallback for missing data

### Phase 2: UI Enhancement (Week 1-2)

**Goal**: Design and implement rich preview cards

**Tasks:**
1. Design preview card component
   - Desktop: Horizontal layout with image
   - Mobile: Vertical layout, full-width image
   - Include category badge, title, description
   - Hover states and transitions

2. Integrate with ReactMarkdown
   - Replace default link renderer
   - Apply only to case study/AI showcase links
   - Keep standard links unchanged

3. Optimize images
   - Use Sanity CDN parameters (width, height, quality)
   - Implement lazy loading
   - Add LQIP placeholders

**Success Criteria:**
- ✅ Preview cards display for all case study links
- ✅ Images load efficiently
- ✅ Works on mobile and desktop
- ✅ Accessible with keyboard and screen readers

### Phase 3: Polish & Optimization (Week 2)

**Goal**: Improve performance and user experience

**Tasks:**
1. Add loading states
   - Skeleton loader while fetching
   - Smooth transition when data loads
   - Progress indicators

2. Implement SWR-style caching
   - Revalidate on focus
   - Dedupe requests
   - Background updates

3. Add analytics
   - Track link clicks
   - Monitor load times
   - Identify popular case studies

4. Handle edge cases
   - Missing images
   - Very long descriptions
   - Slow network connections

**Success Criteria:**
- ✅ Fast load times (< 100ms from cache)
- ✅ No visible loading states for cached data
- ✅ Analytics tracking working

### Phase 4: Testing & Rollout (Week 2-3)

**Goal**: Verify quality and deploy to production

**Tasks:**
1. Write tests
   - Unit tests for LinkPreview component
   - Integration tests for API endpoint
   - E2E tests for user flows

2. Performance testing
   - Measure API response times
   - Check image load times
   - Verify caching behavior

3. Cross-browser testing
   - Chrome, Safari, Firefox
   - Mobile Safari, Chrome Mobile
   - Test with slow 3G connection

4. Deploy to production
   - Feature flag for gradual rollout
   - Monitor error rates
   - Gather user feedback

**Success Criteria:**
- ✅ All tests passing
- ✅ No performance regressions
- ✅ Works across all browsers
- ✅ Zero critical bugs in production

---

## Example Code Snippets

### Complete LinkPreview Component

```tsx
// /src/components/chatbot/LinkPreview.tsx
'use client';

import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LinkMetadata {
  title: string;
  description: string;
  imageUrl: string | null;
  category: string;
}

interface LinkPreviewProps {
  href: string;
  children: React.ReactNode;
}

// Simple in-memory cache
const cache = new Map<string, LinkMetadata>();

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
    if (cache.has(cacheKey)) {
      setMetadata(cache.get(cacheKey)!);
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
        cache.set(cacheKey, data);
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
        <div className="flex gap-4">
          <Skeleton className="w-32 h-32 rounded" />
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
          <p className="text-sm sm:text-xs text-chat-foreground/70 line-clamp-2 sm:line-clamp-3">
            {metadata.description}
          </p>
        </div>
      </div>
    </a>
  );
}
```

### API Endpoint

```typescript
// /src/app/api/link-metadata/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { client, urlFor } from '@/lib/sanity/client';

export const runtime = 'edge';

// Add caching headers
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

### Integration with ChatSection

```tsx
// /src/components/navigation/ChatSection.tsx (lines 279-303)
import { LinkPreview } from '@/components/chatbot/LinkPreview';

// ... existing code ...

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
    // ✅ NEW: Use LinkPreview for all links
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

---

## Potential Challenges & Mitigation

### Challenge 1: Follow-up Question Links Not Clickable

**Problem**: Links in follow-up questions are buttons that send text, not navigation links

**Current Behavior:**
```tsx
<button onClick={() => handlePromptClick(question)}>
  [What challenges did Michael face on Virgin America?](/case-studies/virgin-america)
</button>
```

**Solutions:**

**Option A: Parse and Extract URL**
```tsx
const parseFollowUpQuestion = (question: string) => {
  const linkMatch = question.match(/\[([^\]]+)\]\(([^)]+)\)/);
  if (linkMatch) {
    return {
      text: linkMatch[1],
      url: linkMatch[2],
    };
  }
  return { text: question, url: null };
};

// Render:
{questions.map((question, index) => {
  const { text, url } = parseFollowUpQuestion(question);
  
  if (url) {
    return (
      <a
        key={index}
        href={url}
        className="text-left text-sm px-3 py-2 rounded-lg bg-chat-suggestion/50 hover:bg-chat-suggestion"
      >
        {text}
      </a>
    );
  }
  
  return (
    <button
      key={index}
      onClick={() => handlePromptClick(question)}
      className="text-left text-sm px-3 py-2 rounded-lg bg-chat-suggestion/50 hover:bg-chat-suggestion"
    >
      {question}
    </button>
  );
})}
```

**Option B: Hybrid Button with Link Fallback**
```tsx
<button
  onClick={(e) => {
    const { text, url } = parseFollowUpQuestion(question);
    if (url && e.metaKey) {
      // Cmd/Ctrl+Click opens in new tab (browser default)
      window.open(url, '_blank');
    } else if (url) {
      // Regular click navigates
      router.push(url);
    } else {
      // No URL, send as question
      handlePromptClick(question);
    }
  }}
  className="text-left..."
>
  {parseFollowUpQuestion(question).text}
</button>
```

**Recommendation**: Use Option A - cleaner separation between links and questions

### Challenge 2: Stale Metadata

**Problem**: If content updated in Sanity, chatbot might return outdated descriptions

**Mitigation:**
1. **Short cache duration** (5 minutes)
2. **Webhook invalidation** (when content updates)
3. **Revalidation strategy** (SWR)

```typescript
// Cache invalidation on Sanity webhook
export async function POST(req: Request) {
  const body = await req.json();
  
  if (body._type === 'project' || body._type === 'aiShowcase') {
    const slug = body.slug?.current;
    if (slug) {
      // Invalidate cache
      cache.delete(`${body._type}:${slug}`);
      
      // Optionally: Prefetch updated data
      await fetch(`/api/link-metadata?type=${body._type}&slug=${slug}`);
    }
  }
  
  // Continue with chatbot content sync...
}
```

### Challenge 3: Image Load Performance

**Problem**: Loading images slows down chat response time

**Mitigation:**
1. **Lazy loading** - Only load images when scrolled into view
2. **Progressive images** - Show LQIP first, then full image
3. **CDN optimization** - Use Sanity's CDN with proper parameters
4. **Preloading** - Prefetch likely case study images

```tsx
<img
  src={metadata.imageUrl}
  alt={metadata.title}
  loading="lazy"
  decoding="async"
  className="w-full h-full object-cover"
  style={{
    contentVisibility: 'auto', // Browser-level lazy rendering
  }}
/>
```

### Challenge 4: Mobile Experience

**Problem**: Preview cards take up too much space on mobile

**Mitigation:**
1. **Vertical layout** on mobile (image on top)
2. **Smaller images** on mobile (full width, but shorter height)
3. **Collapsible previews** (optional: tap to expand)

```tsx
<div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
  {/* Mobile: w-full h-48, Desktop: w-32 h-32 */}
  <div className="w-full sm:w-32 h-48 sm:h-32 rounded overflow-hidden">
    <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
  </div>
  
  <div className="flex-1">
    <h4 className="text-base sm:text-sm">{title}</h4>
    <p className="text-sm sm:text-xs line-clamp-2 sm:line-clamp-3">
      {description}
    </p>
  </div>
</div>
```

---

## Success Metrics

### User Engagement
- **Click-through rate** on enhanced links vs. plain links
- **Time spent** viewing preview cards
- **Navigation rate** to case studies from chatbot

**Target**: 30% increase in CTR with enhanced links

### Performance
- **API response time** for link metadata (target: < 100ms)
- **Image load time** (target: < 500ms)
- **Cache hit rate** (target: > 80%)

### User Satisfaction
- **Bounce rate** on linked pages
- **Return visits** to chatbot
- **User feedback** via surveys or analytics

---

## Conclusion

**Recommended Approach**: **Option 3 - Custom Markdown Component** with rich preview cards

**Why:**
- ✅ Best user experience (visual previews)
- ✅ Minimal backend changes (no system prompt updates)
- ✅ Works with existing responses
- ✅ Mobile-friendly
- ✅ Reasonable complexity
- ✅ Extensible for future enhancements

**Next Steps:**
1. Create `/api/link-metadata` endpoint
2. Build `LinkPreview` component
3. Integrate with `ReactMarkdown`
4. Test across devices
5. Deploy with feature flag
6. Monitor metrics and gather feedback

**Estimated Timeline**: 2-3 weeks for full implementation and testing

**Future Enhancements** (v2.0):
- Structured response format (Option 4)
- Related case studies suggestions
- Inline previews in text (hover cards)
- Analytics dashboard for link performance
- A/B testing different preview styles

---

**Document Version**: 1.0  
**Author**: Claude Code  
**Date**: November 4, 2025  
**Status**: ✅ Research Complete - Ready for Implementation
