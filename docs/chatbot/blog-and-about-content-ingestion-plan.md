# Blog & About Content Ingestion Plan

**Date**: 2025-01-18
**Status**: Ready for Implementation
**Goal**: Add blog posts and about page content to chatbot knowledge base

## Context

Currently, the chatbot only ingests:
- **Projects** (13 case studies) - `sanity_project`
- **Profile** (background/bio) - `sanity_profile`
- **AI Projects** (AI showcase items) - `sanity_ai_project`

**Missing content:**
- **Blog posts** - Important content like "How I AI in Q4 2025" and "Marketing Sites"
- **About page** - Extended profile content with detailed article sections

This plan adds these missing content types to make the chatbot more comprehensive.

## Current Architecture Review

### Existing Content Sources
```
1. Transcripts (Manual)
   └─ public/chatbot-content/transcripts/*.txt
   └─ Ingested via: scripts/ingest-docs-to-vectordb.ts

2. Sanity CMS (Automatic)
   └─ src/lib/chatbot/sanity-fetcher.ts
   └─ Functions:
      ├─ fetchProjects() → 13 projects
      ├─ fetchProfile() → Profile + sections
      ├─ fetchAIProjects() → AI showcase items
      └─ fetchAllSanityContent() → combines all
```

### Vector Database Metadata
Each document has:
```typescript
{
  content: string,           // Plain text content
  metadata: {
    source: string,          // 'sanity_project' | 'sanity_profile' | etc.
    source_id: string,       // Sanity document ID
    title: string,           // Document title
    category?: string,       // Document category
    slug?: string,           // URL slug
    updated_at: string,      // Last update timestamp
    [key: string]: any       // Additional metadata
  }
}
```

## Implementation Plan

### Phase 1: Add Blog Post Ingestion

**File**: `src/lib/chatbot/sanity-fetcher.ts`

#### 1.1 Add Blog Interface
```typescript
interface SanityBlog {
  _id: string;
  _updatedAt: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  content?: PortableTextBlock[];  // Main blog content
  heroSection?: {
    badge?: string;
    subtitle?: string;
  };
  publishedAt?: string;
  author?: string;
  featured?: boolean;
}
```

#### 1.2 Create `fetchBlogPosts()` Function
```typescript
/**
 * Fetch all blog posts from Sanity
 */
export async function fetchBlogPosts(): Promise<SanityContentDocument[]> {
  const query = `*[_type == "blog"] {
    _id,
    _updatedAt,
    title,
    slug,
    excerpt,
    content,
    heroSection,
    publishedAt,
    author,
    featured
  }`;

  const blogPosts: SanityBlog[] = await client.fetch(query);

  return blogPosts.map((post) => {
    const contentParts: string[] = [];

    // Add title and hero info
    contentParts.push(`# ${post.title}`);

    if (post.heroSection?.badge) {
      contentParts.push(`Category: ${post.heroSection.badge}`);
    }

    if (post.heroSection?.subtitle) {
      contentParts.push(post.heroSection.subtitle);
    }

    if (post.excerpt) {
      contentParts.push(post.excerpt);
    }

    // Add main content (portable text)
    if (post.content) {
      const contentText = portableTextToPlainText(post.content);
      if (contentText) contentParts.push(contentText);
    }

    // Add metadata footer
    if (post.publishedAt) {
      const date = new Date(post.publishedAt).toLocaleDateString();
      contentParts.push(`\nPublished: ${date}`);
    }

    if (post.author) {
      contentParts.push(`Author: ${post.author}`);
    }

    return {
      content: contentParts.join('\n\n'),
      metadata: {
        source: 'sanity_blog' as const,
        source_id: post._id,
        title: post.title,
        category: post.heroSection?.badge || 'blog',
        slug: post.slug?.current,
        updated_at: post._updatedAt,
        publishedAt: post.publishedAt,
        author: post.author,
        featured: post.featured,
      },
    };
  });
}
```

#### 1.3 Update Type Definition
```typescript
export interface SanityContentDocument {
  content: string;
  metadata: {
    source: 'sanity_project' | 'sanity_profile' | 'sanity_ai_project' | 'sanity_blog';
    source_id: string;
    title: string;
    category?: string;
    updated_at: string;
    [key: string]: any;
  };
}
```

#### 1.4 Update `fetchAllSanityContent()`
```typescript
export async function fetchAllSanityContent(): Promise<SanityContentDocument[]> {
  console.log('📦 Fetching Sanity content...');

  const [projects, profile, aiProjects, blogPosts] = await Promise.all([
    fetchProjects(),
    fetchProfile(),
    fetchAIProjects(),
    fetchBlogPosts(),  // NEW
  ]);

  const allContent = [...projects, ...profile, ...aiProjects, ...blogPosts];  // Include blogPosts

  console.log(`✅ Fetched ${allContent.length} Sanity documents:`);
  console.log(`   - Projects: ${projects.length}`);
  console.log(`   - Profile sections: ${profile.length}`);
  console.log(`   - AI Projects: ${aiProjects.length}`);
  console.log(`   - Blog Posts: ${blogPosts.length}`);  // NEW

  return allContent;
}
```

**Expected Impact:**
- Add ~2-5 blog posts to chatbot knowledge (currently 2: "How I AI in Q4 2025", "Marketing Sites")
- Total documents: 35 → ~37-40
- Chatbot can answer questions about blog content and suggest blog links

---

### Phase 2: Enhance About/Profile Content

**Current state**: Profile already ingested via `fetchProfile()`, but may not include all "article" content from About page.

**File**: `src/app/(public)/about/page.tsx`
- Fetches `article` field from profile schema
- This is portable text content displayed on About page

**Action Required**: Verify if `article` field is included in current `fetchProfile()` implementation.

#### 2.1 Review Current Profile Query
Current query in `fetchProfile()` (sanity-fetcher.ts:218-233):
```typescript
const query = `*[_type == "profile"][0] {
  _id,
  _updatedAt,
  name,
  heroHeadline,
  heroSubheadline,
  heroIntro,
  quickFacts,
  capabilities,
  sections,
  selectedProjects,
  technologies,
  bio,
  skills,
  experience
}`;
```

**Issue**: Missing `article` field used by About page!

#### 2.2 Update Profile Query
```typescript
const query = `*[_type == "profile"][0] {
  _id,
  _updatedAt,
  name,
  heroHeadline,
  heroSubheadline,
  heroIntro,
  quickFacts,
  capabilities,
  sections,
  selectedProjects,
  technologies,
  bio,
  skills,
  experience,
  article  // ADD THIS
}`;
```

#### 2.3 Update Profile Interface
```typescript
interface SanityProfile {
  _id: string;
  _updatedAt: string;
  name: string;
  // ... existing fields ...
  article?: PortableTextBlock[];  // ADD THIS
}
```

#### 2.4 Update Profile Content Building
In `fetchProfile()` function, add article content:
```typescript
// After bio section (around line 273)
if (profile.article) {
  const articleText = portableTextToPlainText(profile.article);
  if (articleText) {
    mainContentParts.push('\n## About / Background');
    mainContentParts.push(articleText);
  }
}
```

**Expected Impact:**
- No new documents, but enriches existing profile document with About page content
- Better answers to questions about Michael's background, experience, and approach
- More comprehensive context for biographical questions

---

### Phase 3: Update Chatbot Route URLs

**File**: `src/app/api/chat/route.ts`

#### 3.1 Current Available URLs (lines 129-141)
```typescript
Available case study URLs:
• /case-studies/virgin-america (Virgin America)
• /case-studies/casa-bonita (Casa Bonita)
• /case-studies/target (Target)
• /case-studies/before-launcher (Before Launcher)
• /case-studies/playstation-vue (Playstation Vue)
• /case-studies/houselogic (Houselogic/NAR)
• /case-studies/peacock (Peacock)
• /case-studies/aesop (Aesop)
• /case-studies/teaching-books (Teaching Books)
• /case-studies/lyft (Lyft)
• /case-studies/peddle (Peddle)
• /case-studies/postpal (Post Pal)
```

#### 3.2 Add Blog Post URLs
```typescript
Available case study URLs:
• /case-studies/virgin-america (Virgin America)
• /case-studies/casa-bonita (Casa Bonita)
• /case-studies/target (Target)
• /case-studies/before-launcher (Before Launcher)
• /case-studies/playstation-vue (Playstation Vue)
• /case-studies/houselogic (Houselogic/NAR)
• /case-studies/peacock (Peacock)
• /case-studies/aesop (Aesop)
• /case-studies/teaching-books (Teaching Books)
• /case-studies/lyft (Lyft)
• /case-studies/peddle (Peddle)
• /case-studies/postpal (Post Pal)

Available blog post URLs:
• /blog/how-i-ai-in-q4-2025 (How I AI in Q4 2025)
• /blog/marketing-sites (Marketing Sites)

Available pages:
• /about (About Michael)
```

#### 3.3 Update System Prompt Instructions (around line 117)
Current:
```typescript
- WHEN your answer discusses a specific project, post or case study, ALWAYS include the corresponding link at the very end of your response:

  **Follow-up questions:**
  - Question related to current topic
  - Learn more question about different topic

  **Learn more:** [Project Name](/case-studies/project-slug)
```

Enhanced:
```typescript
- WHEN your answer discusses a specific project, post, case study, or page, ALWAYS include the corresponding link at the very end of your response:

  **Follow-up questions:**
  - Question related to current topic
  - Learn more question about different topic

  **Learn more:**
  - Case Study: [Project Name](/case-studies/project-slug)
  - Blog Post: [Post Title](/blog/post-slug)
  - Page: [About Michael](/about)

- Format guidelines:
  * For case studies: Use existing format
  * For blog posts: "**Read more:** [Post Title](/blog/slug)"
  * For about page: "**Learn more:** [About Michael](/about)"
```

**Expected Impact:**
- Chatbot can link to blog posts when discussing AI workflows, site builds, etc.
- Better user journey from chat to content pages
- Ability to reference /about page for deeper biographical info

---

### Phase 4: Portable Text Enhancement (Optional)

**Current limitation**: `portableTextToPlainText()` only handles basic text blocks.

**Missing features:**
- Lists (bullet points, numbered lists)
- Links (loses URL context)
- Code blocks (loses formatting info)
- Images (completely skipped)

#### 4.1 Enhanced Portable Text Converter
```typescript
export function portableTextToPlainText(blocks: PortableTextBlock[] | undefined): string {
  if (!blocks || !Array.isArray(blocks)) return '';

  return blocks
    .map((block: any) => {
      // Handle text blocks
      if (block._type === 'block' && block.children) {
        let text = block.children
          .map((child: any) => {
            // Extract link URLs for context
            if (child.marks?.includes('link')) {
              const linkMark = block.markDefs?.find((def: any) => def._type === 'link');
              return linkMark ? `${child.text} (${linkMark.href})` : child.text;
            }
            return child.text;
          })
          .join('');

        // Add list formatting
        if (block.listItem === 'bullet') {
          text = `• ${text}`;
        } else if (block.listItem === 'number') {
          text = `${block.level || 1}. ${text}`;
        }

        return text;
      }

      // Handle code blocks
      if (block._type === 'code') {
        return `\`\`\`${block.language || ''}\n${block.code}\n\`\`\``;
      }

      // Handle images (describe but don't include)
      if (block._type === 'image') {
        return `[Image: ${block.alt || 'No description'}]`;
      }

      return '';
    })
    .filter(Boolean)
    .join('\n\n');
}
```

**Benefit**: Better content representation in vector database, preserving structure and links.

**Risk**: May need testing to ensure embeddings still work well with more formatting.

**Recommendation**: Implement in Phase 4 after confirming basic blog ingestion works.

---

## Implementation Sequence

### Week 1: Core Implementation
1. **Day 1**: Phase 1 - Add blog post fetching (1.1-1.4)
2. **Day 2**: Phase 2 - Update profile to include article field (2.1-2.4)
3. **Day 3**: Phase 3 - Update chatbot route URLs and prompt (3.1-3.3)
4. **Day 4**: Test and verify ingestion
5. **Day 5**: Deploy and monitor

### Week 2: Optional Enhancements
1. **Day 1-2**: Phase 4 - Enhanced portable text converter (if needed)
2. **Day 3-4**: Additional testing with complex blog content
3. **Day 5**: Documentation updates

---

## Testing Plan

### Before Ingestion
```bash
# Check current document count
npm run ingest
# Expected output: "246 chunks created from 35 documents"
```

### After Blog Implementation
```bash
# Re-ingest with blog posts
npm run ingest
# Expected output: "~260-280 chunks created from ~37-40 documents"
```

### Verification Steps
1. **Admin Dashboard**: Check `http://localhost:3000/admin/chatbot-content`
   - Verify blog posts appear in synced content
   - Check document count increased

2. **Test Chatbot Queries**:
   - "Tell me about your blog post on AI workflows"
   - "What's your approach to marketing sites?"
   - "Tell me more about your background" (should include article content)
   - Verify blog post links appear in responses

3. **Vector Search Test**:
   - Create test script to query vector DB directly
   - Verify blog content is searchable
   - Check relevance scores for blog-related queries

---

## Files to Modify

### Phase 1: Blog Posts
1. **src/lib/chatbot/sanity-fetcher.ts**
   - Add `SanityBlog` interface
   - Add `fetchBlogPosts()` function
   - Update `SanityContentDocument` type
   - Update `fetchAllSanityContent()` to include blog posts

### Phase 2: About Content
1. **src/lib/chatbot/sanity-fetcher.ts**
   - Update profile query to include `article` field
   - Update `SanityProfile` interface
   - Add article content to profile document building

### Phase 3: Routes & Prompt
1. **src/app/api/chat/route.ts**
   - Add blog post URLs (lines 129-141)
   - Add about page URL
   - Update link formatting instructions (line 117)

### Phase 4: Enhanced Portable Text (Optional)
1. **src/lib/chatbot/sanity-fetcher.ts**
   - Enhance `portableTextToPlainText()` function

---

## Expected Outcomes

### Quantitative
- **Document Count**: 35 → ~37-40 (+2-5 blog posts)
- **Chunk Count**: 246 → ~260-280 chunks
- **Content Types**: 3 → 4 (add `sanity_blog`)
- **Linkable URLs**: 12 case studies → 12 case studies + 2-5 blog posts + 1 about page

### Qualitative
- **Richer responses** about Michael's AI workflow and process
- **Better context** for questions about approach, tools, and methodologies
- **More follow-up options** - chatbot can suggest relevant blog posts
- **Comprehensive profile** - About page content integrated into chatbot knowledge

---

## Rollback Plan

If issues arise:

1. **Blog ingestion problems**:
   - Comment out blog posts in `fetchAllSanityContent()`
   - Re-run `npm run ingest`

2. **Profile article breaking changes**:
   - Revert profile query changes
   - Re-run ingestion

3. **Prompt issues**:
   - Revert prompt changes in route.ts
   - No re-ingestion needed

---

## Success Criteria

- [ ] Blog posts successfully ingested (verify in admin dashboard)
- [ ] About page article content included in profile document
- [ ] Chatbot can answer questions about blog content
- [ ] Chatbot provides blog post links in responses
- [ ] Chatbot can reference /about page
- [ ] No regression in existing case study responses
- [ ] Build succeeds without errors
- [ ] Vector search performance maintained (no slowdown)

---

## Future Enhancements

1. **Blog categories**: Tag blog posts with categories for better follow-up suggestions
2. **Blog series**: Link related blog posts together
3. **Blog excerpts**: Use excerpts for better search relevance
4. **About page sections**: Break About page into smaller documents for more targeted retrieval
5. **Content freshness**: Prioritize recently updated content in search results

---

## Related Documentation

- **Chatbot System**: `/docs/chatbot/MAINTAINABLE-CONTENT-SYSTEM.md`
- **Current Memory**: `/memory-bank/CURRENT.md`
- **Sanity Schemas**: `/sanity/schemas/blog.ts`, `/sanity/schemas/profile.ts`
- **Blog Queries**: `/src/lib/sanity/queries/blog.ts`

---

## Notes

- Blog content is **portable text** - same format as project content
- About page uses `article` field from profile schema
- Current ingestion skips images - only text content indexed
- Sanity webhooks will auto-sync blog changes to production (after setup)
- Blog posts have `featured` flag - could prioritize in search if needed
