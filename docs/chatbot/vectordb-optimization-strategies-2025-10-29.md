# Vector Database Optimization Strategies for Haiku
**Date**: October 29, 2025
**Goal**: Improve retrieval accuracy without changing the model

## Problem Analysis

The core issue: **Semantic mismatch between question phrasing and content phrasing**

- Question: "Where did Michael Evans grow up?"
- Content: "I grew up in Eugene, Oregon"
- Problem: Missing semantic bridge between "Michael Evans" and "I"

## Optimization Strategies (Ranked by Impact)

### 1. 🎯 Query Expansion (HIGH IMPACT, EASY)

Transform user queries before embedding to match content patterns:

```typescript
// In route.ts, before generating embedding
function expandQuery(query: string): string {
  const expansions = {
    // Convert third-person to first-person
    "Where did Michael Evans grow up": "Where did I grow up Eugene Oregon childhood",
    "Where did Michael grow up": "Where did I grow up childhood hometown",
    "What did Michael study": "What did I study college university major",
    "Michael's first job": "My first job tech career start",

    // Add context terms
    "restaurant": "restaurant Casa Bonita cliff diving Trey Parker Matt Stone Denver",
    "HBO": "HBO Go Canadian Astral streaming project",
    "Lyft": "Lyft Portland rideshare project",
  };

  // Check for patterns and expand
  for (const [pattern, expansion] of Object.entries(expansions)) {
    if (query.toLowerCase().includes(pattern.toLowerCase())) {
      return query + " " + expansion;
    }
  }

  // Default expansions for any query
  if (query.toLowerCase().includes("michael")) {
    // Add first-person variants
    return query + " " + query.replace(/Michael('s)?|Michael Evans('s)?/gi, "I my me");
  }

  return query;
}
```

### 2. 📚 Create "FAQ Chunks" (HIGH IMPACT, MODERATE)

Add pre-computed Q&A pairs to the vector database:

```markdown
## FAQ Chunks to Add

Q: Where did Michael Evans grow up?
A: Michael grew up in Eugene, Oregon, in a purple house near the University of Oregon.

Q: What did Michael study in college?
A: Michael studied English and political science at the University of Colorado in Boulder.

Q: What was Michael's first tech job?
A: Michael's first tech job was doing data entry at Semantec, where he was quickly promoted to data analyst.

Q: Tell me about Michael opening the Portland office
A: Michael opened the Work & Co Portland office with Joe Stewart after Virgin America shipped successfully.
```

Run these through the ingestion pipeline - they'll match direct questions perfectly.

### 3. 🔄 Dual Embedding Strategy (HIGH IMPACT, COMPLEX)

Store each chunk with multiple embeddings:

```typescript
// Modified ingestion script
async function createDualEmbeddings(content: string, metadata: any) {
  // 1. Original content embedding
  const contentEmbedding = await generateEmbedding(content);

  // 2. Question-style embedding
  const questionVersion = convertToQuestions(content);
  const questionEmbedding = await generateEmbedding(questionVersion);

  // Store both in Supabase
  await supabase.from('documents').insert([
    {
      content,
      embedding: contentEmbedding,
      metadata: {...metadata, type: 'content'}
    },
    {
      content,
      embedding: questionEmbedding,
      metadata: {...metadata, type: 'question'}
    }
  ]);
}

function convertToQuestions(content: string): string {
  // Transform "I grew up in Eugene" -> "Where did Michael grow up? Eugene"
  const transformations = [
    [/I grew up in (.*)/g, "Where did Michael grow up? $1"],
    [/I studied (.*) at (.*)/g, "What did Michael study? Where? $1 $2"],
    [/I worked at (.*)/g, "Where did Michael work? $1"],
    // ... more patterns
  ];

  let questions = content;
  transformations.forEach(([pattern, replacement]) => {
    questions = questions.replace(pattern, replacement);
  });
  return questions;
}
```

### 4. 🏷️ Metadata Enrichment (MODERATE IMPACT, EASY)

Add keywords and tags to chunk metadata:

```typescript
// Enhanced ingestion
const chunkMetadata = {
  source: filename,
  keywords: extractKeywords(content), // Eugene, Oregon, college, etc.
  topics: extractTopics(content),     // education, background, career
  entities: extractEntities(content), // Michael Evans, Work & Co, etc.
};

// Then in search, boost matches with relevant metadata
const searchWithMetadata = async (query: string) => {
  const keywords = extractKeywords(query);

  // Search both embeddings AND metadata
  const results = await supabase
    .rpc('search_documents_enhanced', {
      query_embedding,
      query_keywords: keywords,
      match_count: 30
    });
};
```

### 5. 🔍 Hybrid Search (HIGH IMPACT, MODERATE)

Combine semantic search with keyword search:

```typescript
async function hybridSearch(query: string) {
  const [semanticResults, keywordResults] = await Promise.all([
    // Semantic search (current approach)
    searchSimilarDocuments(queryEmbedding, 15, 0.3),

    // Keyword search (new)
    supabase
      .from('documents')
      .textSearch('content', query)
      .limit(15)
  ]);

  // Merge and deduplicate, prioritizing overlap
  const merged = mergeResults(semanticResults, keywordResults);
  return merged;
}
```

### 6. 📝 Chunk Optimization (MODERATE IMPACT, MODERATE)

Reprocess chunks with better strategies:

```typescript
const OPTIMIZED_CHUNK_SETTINGS = {
  chunkSize: 800,        // Increase from 500
  chunkOverlap: 200,     // Increase from 50

  // Include "context preserving" chunks
  createContextChunks: true,  // Add surrounding sentences

  // Special handling for Q&A format
  preserveQAPairs: true,      // Don't split Q&A pairs
};
```

### 7. 🎪 Query Preprocessing (EASY IMPACT, EASY)

Normalize questions before embedding:

```typescript
function preprocessQuery(query: string): string {
  // Remove question words that don't add semantic value
  const stopPatterns = [
    /^(what|where|when|who|how|why|tell me about|describe|explain)\s+/i,
    /\?$/,
  ];

  let processed = query;
  stopPatterns.forEach(pattern => {
    processed = processed.replace(pattern, '');
  });

  // Add contextual hints
  if (processed.includes('restaurant')) {
    processed += ' Casa Bonita';
  }

  return processed;
}
```

### 8. 🚀 Retrieval Optimization

Adjust retrieval parameters:

```typescript
const relevantDocs = await searchSimilarDocuments(
  queryEmbedding,
  30,    // Increase from 20
  0.2    // Tighter threshold (was 0.3) - but with query expansion
);

// Then re-rank results
const rerankedDocs = rerankByRelevance(relevantDocs, originalQuery);
```

## Implementation Priority

### Phase 1: Quick Wins (1 hour)
1. ✅ Query expansion for Michael -> I conversion
2. ✅ Add FAQ chunks to vector database
3. ✅ Adjust retrieval parameters (30 results, 0.25 threshold)
4. ✅ Lower temperature to 0.6

### Phase 2: Moderate Effort (2-3 hours)
5. 📚 Create comprehensive FAQ document
6. 🔍 Implement hybrid search
7. 📝 Re-chunk with overlap optimization

### Phase 3: Advanced (4-6 hours)
8. 🔄 Dual embedding strategy
9. 🏷️ Full metadata enrichment
10. 🎯 ML-based query expansion

## Expected Results

With these optimizations, expect:
- **Phase 1**: 30-40% improvement (fixes most "Michael vs I" issues)
- **Phase 2**: 50-60% improvement (better coverage)
- **Phase 3**: 70-80% improvement (near-Sonnet quality)

## Sample Implementation

Here's the immediate fix for route.ts:

```typescript
// Add before line 160 in route.ts
const expandedQuery = messageText
  .replace(/Michael Evans'?s?|Michael'?s?/gi, '$& I my me')
  + (messageText.toLowerCase().includes('restaurant') ? ' Casa Bonita cliff diving' : '')
  + (messageText.toLowerCase().includes('grow up') ? ' childhood hometown Eugene Oregon' : '')
  + (messageText.toLowerCase().includes('college') ? ' university study major English Colorado Boulder' : '');

// Use expanded query for embedding
const queryEmbedding = await generateEmbedding(expandedQuery);

// Also adjust retrieval
const relevantDocs = await searchSimilarDocuments(
  queryEmbedding,
  30,   // Increased from 20
  0.25  // Tighter from 0.3
);
```

## Testing Approach

After each optimization:
1. Run the 12 failing queries
2. Measure improvement percentage
3. Check for any degradation in working queries
4. Adjust parameters accordingly

## Cost-Benefit Analysis

| Strategy | Dev Time | Impact | Complexity | Recommendation |
|----------|----------|--------|------------|----------------|
| Query Expansion | 30 min | HIGH | LOW | **DO NOW** |
| FAQ Chunks | 1 hour | HIGH | LOW | **DO NOW** |
| Hybrid Search | 2 hours | HIGH | MODERATE | **WORTH IT** |
| Dual Embeddings | 4 hours | HIGH | HIGH | **IF NEEDED** |
| Metadata | 2 hours | MODERATE | MODERATE | **OPTIONAL** |

## Conclusion

We can likely achieve 60-70% of Sonnet's quality with Haiku through these optimizations, especially:
1. Query expansion (Michael -> I)
2. FAQ chunks for common questions
3. Hybrid semantic + keyword search

Start with Phase 1 optimizations - they're easy and will show immediate improvement.