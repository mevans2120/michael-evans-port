# Vector DB Optimization Implementation Plan
**Date**: October 29, 2025
**Goal**: Implement all 6 core optimizations to achieve Sonnet-like quality with Haiku

## Overview

We'll implement 6 key optimizations in 3 phases, with testing after each phase to measure improvement.

**Expected Outcome**: 70-80% reduction in "I don't have information" responses while keeping Haiku's speed and cost.

## Phase 1: Foundation (30 minutes)
*Quick wins that solve the most common issues*

### 1.1 Add FAQ Chunks ✅
**Status**: File already created at `/public/chatbot-content/transcripts/faq-chunks.md`

**Action**:
```bash
npm run ingest
```

**Expected Impact**: Fixes 8-10 of the failing questions immediately

### 1.2 Query Expansion in Route
**File**: `/src/app/api/chat/route.ts`

Add query expansion function before embedding generation:
- Convert "Michael" → "Michael I my me"
- Add contextual keywords for known entities
- Expand common question patterns

**Expected Impact**: 30-40% better retrieval for biographical questions

### 1.3 Optimize Retrieval Parameters
**File**: `/src/app/api/chat/route.ts`

Adjust search parameters:
- Increase results from 20 → 30
- Tighten threshold from 0.3 → 0.25
- Lower temperature from 0.8 → 0.6

**Expected Impact**: More consistent responses

### Testing Checkpoint 1
Run quick test with 12 previously failing questions to measure improvement.

---

## Phase 2: Enhanced Search (1-2 hours)
*Add intelligence to the search process*

### 2.1 Query Preprocessing
**New File**: `/src/lib/chatbot/query-preprocessor.ts`

Implement intelligent query preprocessing:
- Remove stop words
- Normalize question formats
- Add entity recognition
- Inject known context

**Expected Impact**: Better semantic matching

### 2.2 Hybrid Search Implementation
**Files**:
- `/src/lib/chatbot/supabase.ts` (modify)
- `/src/lib/chatbot/hybrid-search.ts` (new)

Combine semantic and keyword search:
- Semantic search for meaning
- Full-text search for exact matches
- Weighted merge of results

**Expected Impact**: Catches both semantic and literal matches

### 2.3 Enhanced Chunking Strategy
**File**: `/src/scripts/ingest.ts`

Improve chunking parameters:
- Increase chunk size: 500 → 800
- Increase overlap: 50 → 200
- Preserve Q&A pairs intact
- Add context sentences

**Action**: Re-ingest all content with new parameters

### Testing Checkpoint 2
Run comprehensive test suite (55 questions) to measure cumulative improvement.

---

## Phase 3: Advanced Optimization (2-3 hours)
*Sophisticated enhancements for maximum quality*

### 3.1 Metadata Enrichment
**Files**:
- `/src/scripts/ingest.ts` (modify)
- `/src/lib/chatbot/metadata-extractor.ts` (new)

Add rich metadata to chunks:
- Extract entities (names, places, projects)
- Add topic tags
- Include keywords
- Store question variations

**Expected Impact**: Better filtering and ranking

### 3.2 Result Re-ranking
**New File**: `/src/lib/chatbot/reranker.ts`

Implement intelligent re-ranking:
- Score by multiple factors
- Boost exact matches
- Consider metadata alignment
- Apply MMR (Maximal Marginal Relevance)

**Expected Impact**: Most relevant content appears first

### 3.3 Dual Embedding Strategy (Optional)
**Files**:
- `/src/scripts/ingest.ts`
- Database schema update

Store each chunk with two embeddings:
- Content embedding (as-is)
- Question embedding (reformulated)

**Expected Impact**: Best retrieval for both statement and question queries

### Final Testing
Run full test suite and compare with baseline results.

---

## Implementation Schedule

### Hour 1: Phase 1 + Testing
- [ ] 10 min: Run FAQ ingestion
- [ ] 15 min: Implement query expansion
- [ ] 5 min: Adjust retrieval parameters
- [ ] 10 min: Test failing questions
- [ ] 20 min: Debug and refine

### Hour 2: Phase 2 Core
- [ ] 20 min: Build query preprocessor
- [ ] 30 min: Implement hybrid search
- [ ] 10 min: Update chunking parameters

### Hour 3: Phase 2 Complete + Testing
- [ ] 20 min: Re-ingest with new chunks
- [ ] 20 min: Run comprehensive tests
- [ ] 20 min: Analyze results

### Hour 4: Phase 3 (If Needed)
- [ ] 30 min: Add metadata extraction
- [ ] 20 min: Implement re-ranking
- [ ] 10 min: Final testing

---

## Success Metrics

### Baseline (Current)
- "I don't have information" responses: 12/55 (21.8%)
- Average response time: 5.7s
- Follow-up relevance: 100%

### Target After Optimization
- "I don't have information" responses: <3/55 (<5%)
- Average response time: <6s
- Follow-up relevance: 100%

### Specific Questions to Fix

Must answer correctly after optimization:
1. ✅ Where did Michael Evans grow up?
2. ✅ What did Michael study in college?
3. ✅ How did Michael get into technology?
4. ✅ What was Michael's first job in tech?
5. ✅ What did Michael build for HBO?
6. ✅ Tell me about Michael opening the Portland office

Stretch goals (need new content):
7. ⚠️ When did Michael become interested in AI?
8. ⚠️ What AI projects has Michael built recently?
9. ⚠️ Describe the Lyft project
10. ⚠️ What is Michael working on now?

---

## Risk Mitigation

### Potential Issues & Solutions

1. **Performance degradation**
   - Monitor response times after each change
   - Keep retrieval under 30 results
   - Cache preprocessed queries

2. **Over-optimization**
   - Test working queries don't break
   - Keep changes reversible
   - Version control each phase

3. **Complexity creep**
   - Start simple, iterate
   - Measure impact of each change
   - Stop when diminishing returns

---

## Rollback Plan

Each phase is independently reversible:
- Git commits after each phase
- Original ingestion data preserved
- Route.ts changes isolated

---

## Code Snippets

### Query Expansion Implementation
```typescript
function expandQuery(query: string): string {
  // Core expansion
  let expanded = query;

  // Michael -> first person
  if (/michael(?:'s)?(?:\s+evans)?/i.test(query)) {
    expanded += ' ' + query.replace(/michael(?:'s)?(?:\s+evans)?/gi, 'I my me');
  }

  // Contextual additions
  const contextMap = {
    'restaurant': 'Casa Bonita cliff diving Trey Parker Matt Stone Denver',
    'grow up': 'childhood hometown Eugene Oregon purple house',
    'college': 'University Colorado Boulder English political science',
    'first job': 'Semantec data entry analyst tech career',
    'hbo': 'HBO Go Canadian Astral streaming',
    'portland': 'Work Co office Joe Stewart',
  };

  Object.entries(contextMap).forEach(([keyword, context]) => {
    if (query.toLowerCase().includes(keyword)) {
      expanded += ' ' + context;
    }
  });

  return expanded;
}
```

### Hybrid Search Query
```sql
-- Supabase RPC function
CREATE OR REPLACE FUNCTION hybrid_search(
  query_embedding vector,
  query_text text,
  match_count int
)
RETURNS TABLE (
  content text,
  metadata jsonb,
  similarity float,
  rank float
) AS $$
BEGIN
  RETURN QUERY
  WITH semantic AS (
    SELECT
      content,
      metadata,
      1 - (embedding <=> query_embedding) as similarity
    FROM documents
    ORDER BY embedding <=> query_embedding
    LIMIT match_count
  ),
  keyword AS (
    SELECT
      content,
      metadata,
      ts_rank(to_tsvector('english', content), plainto_tsquery('english', query_text)) as rank
    FROM documents
    WHERE to_tsvector('english', content) @@ plainto_tsquery('english', query_text)
    LIMIT match_count
  )
  SELECT DISTINCT ON (content)
    content,
    metadata,
    COALESCE(semantic.similarity, 0) as similarity,
    COALESCE(keyword.rank, 0) as rank
  FROM semantic
  FULL OUTER JOIN keyword USING (content)
  ORDER BY content, (COALESCE(semantic.similarity, 0) * 0.7 + COALESCE(keyword.rank, 0) * 0.3) DESC
  LIMIT match_count;
END;
$$ LANGUAGE plpgsql;
```

---

## Next Steps

1. **Immediate**: Start Phase 1 (FAQ ingestion + query expansion)
2. **After testing**: Proceed to Phase 2 if needed
3. **Optional**: Phase 3 only if Phase 2 doesn't achieve targets
4. **Future**: Consider Sonnet for premium users or complex queries

---

## Expected Final State

After all optimizations:
- **Query**: "Where did Michael grow up?"
- **Process**:
  1. Preprocessed: "michael grow up"
  2. Expanded: "michael grow up I my me childhood hometown Eugene Oregon purple house"
  3. FAQ chunk matches perfectly
  4. Semantic search finds relevant content
  5. Keyword search catches "Eugene Oregon"
  6. Re-ranker puts best match first
- **Result**: Clear, accurate answer with no "I don't have information"

This plan will transform the chatbot from 78% success to 95%+ success rate while maintaining Haiku's cost efficiency.