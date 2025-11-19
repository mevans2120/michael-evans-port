# Blog & About Content Ingestion + Link Recommendations (2025-01-18)

## Context
User wanted to add blog posts and About page content to the chatbot's knowledge base, and ensure the chatbot correctly suggests blog post links when answering questions about AI workflows, tools, and methodologies.

## Changes Made

### 1. Added Blog Post Ingestion
**File**: `src/lib/chatbot/sanity-fetcher.ts`

**Changes**:
- Added `SanityBlog` interface (lines 126-140)
- Created `fetchBlogPosts()` function (lines 503-567) to fetch and transform blog posts from Sanity
- Updated `SanityContentDocument` type to include `'sanity_blog'` (line 148)
- Updated `fetchAllSanityContent()` to include blog posts (lines 573-591)
- **Added explicit URLs** to blog posts: `Blog post URL: /blog/${slug}` (lines 525-528)

**Impact**:
- 2 blog posts now ingested: "How I AI in Q4 2025" and "Marketing Sites"
- 13 chunks created from blog posts (6-7 chunks per post)
- Total documents: 35 → 37
- Total chunks: 246 → 267

### 2. Enhanced About Page Content
**File**: `src/lib/chatbot/sanity-fetcher.ts`

**Changes**:
- Added `article` field to `SanityProfile` interface (line 84)
- Updated profile query to fetch `article` field (line 248)
- Added article content processing (lines 293-300) - "About / Background Details" section

**Impact**:
- About page extended content now included in profile document
- Richer context for biographical and background questions

### 3. Added Case Study URLs
**File**: `src/lib/chatbot/sanity-fetcher.ts`

**Changes**:
- Added explicit URLs to case studies: `Case study URL: /case-studies/${slug}` (lines 186-189)

**Impact**:
- Both blog posts AND case studies now have explicit URLs in searchable content
- LLM can see exact link to use when retrieving context

### 4. Updated Chatbot Link Instructions
**File**: `src/app/api/chat/route.ts`

**Changes**:
- Updated link format examples to show all three content types (lines 123-126):
  - Case study: `[Project Name](/case-studies/project-slug)`
  - Blog post: `[Post Title](/blog/post-slug)`
  - About page: `[About Michael](/about)`
- Added "Match link type to question context" section (lines 128-132):
  - AI tools/workflows/methodologies → Blog posts
  - Client projects → Case studies
  - Background/bio → About page
  - **IMPORTANT**: Look for "Blog post URL:" or "Case study URL:" in context
- Enhanced link deduplication instructions (lines 134-141)

**Impact**:
- LLM now knows WHEN to use each link type based on question context
- Explicit instruction to look for URLs in retrieved content
- Variety in link suggestions throughout conversation

### 5. Fixed Link Preview Overlap
**File**: `src/components/chatbot/LinkPreview.tsx`

**Changes**:
- Reduced description line clamping from 3 to 2 lines (line 283)

**Impact**:
- Fixed text overlap issue where description overlapped with title on link preview cards

## Documentation

**Created**: `docs/chatbot/blog-and-about-content-ingestion-plan.md`
- Comprehensive 4-phase implementation plan
- Detailed explanation of content ingestion architecture
- Testing checklist and verification steps
- Future enhancement suggestions

## Ingestion Results

**Command**: `npm run ingest`
**Script**: `src/lib/chatbot/ingest-content.ts` (uses Supabase)

**Results**:
- Documents processed: 37 (12 transcripts + 25 Sanity documents)
- Chunks created: 267 with embeddings
- Blog posts: 2 (13 chunks)
- Projects: 13 (13 chunks)
- Profile sections: 7 (24 chunks)
- AI Projects: 3 (21 chunks)

**Chunks by source**:
- general: 60
- projects: 40
- technical: 34
- research: 24
- background: 24
- sanity_profile: 24
- sanity_ai_project: 21
- agentic: 14
- sanity_project: 13
- sanity_blog: 13

## Testing & Troubleshooting

### Issue: Blog Posts Not Being Suggested
**Problem**: Chatbot was suggesting case studies instead of blog posts for AI workflow questions

**Diagnosis**:
1. Verified ingestion successful (267 chunks, 37 documents)
2. Confirmed chatbot uses Supabase (not ChromaDB)
3. Identified missing URL context in chunks

**Solutions Applied**:
1. Added explicit URLs to blog post and case study content
2. Added "Match link type to question context" instructions
3. Added instruction to look for "Blog post URL:" in context
4. Re-ingested content with URLs included

**Next Steps for User**:
- Test in fresh chat session
- Try specific queries like "Tell me about your How I AI in Q4 2025 blog post"
- Monitor if blog post links now appear for AI tools/workflows questions

## Files Modified

1. `src/lib/chatbot/sanity-fetcher.ts` - Blog ingestion, URLs, About content
2. `src/app/api/chat/route.ts` - Link format examples, context matching, deduplication
3. `src/components/chatbot/LinkPreview.tsx` - Line clamp fix
4. `docs/chatbot/blog-and-about-content-ingestion-plan.md` - Implementation plan

## Available Blog Post URLs

- `/blog/how-i-ai-in-q4-2025` - "How I AI in Q4 2025"
- `/blog/marketing-sites` - "Marketing Sites"

## Available Pages

- `/about` - About Michael (extended profile content)

## Technical Notes

- **Database**: Uses Supabase for vector search (not ChromaDB)
- **Ingestion script**: `src/lib/chatbot/ingest-content.ts` via `npm run ingest`
- **Edge Runtime**: Prompt changes take effect automatically (no server restart needed)
- **Content format**: URLs embedded as "Blog post URL: /blog/slug" and "Case study URL: /case-studies/slug"
- **Vector DB**: Supabase with hybrid search (semantic + keyword)

## Related Work

- **Previous session**: Scrollbar restoration
- **Historical**: Chatbot content system documented in `/docs/chatbot/MAINTAINABLE-CONTENT-SYSTEM.md`
