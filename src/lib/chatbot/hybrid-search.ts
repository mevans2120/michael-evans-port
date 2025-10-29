/**
 * Hybrid Search Implementation
 * Combines semantic vector search with full-text keyword search for better retrieval
 */

import { supabase } from './supabase';

export interface DocumentChunk {
  id?: string;
  content: string;
  metadata: any;
}

interface SearchResult {
  content: string;
  metadata: any;
  similarity?: number;
  textRank?: number;
  combinedScore: number;
}

/**
 * Perform hybrid search combining semantic and keyword search
 */
export async function hybridSearch(
  queryEmbedding: number[],
  queryText: string,
  keywords: string[],
  topK = 30,
  similarityThreshold = 0.25
): Promise<DocumentChunk[]> {
  // Run searches in parallel for efficiency
  const [semanticResults, keywordResults] = await Promise.all([
    semanticSearch(queryEmbedding, topK, similarityThreshold),
    keywordSearch(queryText, keywords, topK)
  ]);

  // Combine and deduplicate results
  const combined = combineResults(semanticResults, keywordResults);

  // Sort by combined score and return top K
  return combined
    .sort((a, b) => b.combinedScore - a.combinedScore)
    .slice(0, topK)
    .map(r => ({
      id: r.content, // Using content as ID for now
      content: r.content,
      metadata: r.metadata,
    }));
}

/**
 * Semantic vector search using embeddings
 */
async function semanticSearch(
  queryEmbedding: number[],
  limit: number,
  threshold: number
): Promise<SearchResult[]> {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }

  const { data, error } = await supabase.rpc('match_documents', {
    match_count: limit,
    match_threshold: threshold,
    query_embedding: queryEmbedding,
  });

  if (error) {
    console.error('Semantic search error:', error);
    return [];
  }

  return (data || []).map((doc: any) => ({
    content: doc.content,
    metadata: doc.metadata,
    similarity: doc.similarity,
    combinedScore: doc.similarity * 0.7, // Weight semantic search at 70%
  }));
}

/**
 * Full-text keyword search
 */
async function keywordSearch(
  queryText: string,
  keywords: string[],
  limit: number
): Promise<SearchResult[]> {
  // Build search query from original text and keywords
  const searchTerms = [queryText, ...keywords].join(' ');

  if (!supabase) {
    return [];
  }

  // Use PostgreSQL full-text search
  // First, try to find exact matches for FAQ-style questions
  const { data: exactMatches, error: exactError } = await supabase
    .from('documents')
    .select('content, metadata')
    .ilike('content', `%${queryText}%`)
    .limit(5);

  if (exactError) {
    console.error('Exact match search error:', exactError);
  }

  // Then do broader keyword search
  const { data: keywordMatches, error: keywordError } = await supabase
    .from('documents')
    .select('content, metadata')
    .textSearch('content', searchTerms, {
      type: 'websearch',
      config: 'english',
    })
    .limit(limit);

  if (keywordError) {
    console.error('Keyword search error:', keywordError);
  }

  // Combine exact and keyword matches
  const allMatches = [
    ...(exactMatches || []).map((doc, idx) => ({
      ...doc,
      textRank: 1.0 - (idx * 0.1), // Higher score for exact matches
    })),
    ...(keywordMatches || []).map((doc, idx) => ({
      ...doc,
      textRank: 0.5 - (idx * 0.01), // Lower score for keyword matches
    })),
  ];

  // Deduplicate by content
  const seen = new Set<string>();
  const unique = allMatches.filter(doc => {
    if (seen.has(doc.content)) return false;
    seen.add(doc.content);
    return true;
  });

  return unique.map(doc => ({
    content: doc.content,
    metadata: doc.metadata,
    textRank: doc.textRank || 0.3,
    combinedScore: (doc.textRank || 0.3) * 0.3, // Weight keyword search at 30%
  }));
}

/**
 * Combine semantic and keyword results with deduplication
 */
function combineResults(
  semanticResults: SearchResult[],
  keywordResults: SearchResult[]
): SearchResult[] {
  const combined = new Map<string, SearchResult>();

  // Add semantic results
  semanticResults.forEach(result => {
    const key = result.content.substring(0, 100); // Use first 100 chars as key
    combined.set(key, result);
  });

  // Merge or add keyword results
  keywordResults.forEach(result => {
    const key = result.content.substring(0, 100);
    const existing = combined.get(key);

    if (existing) {
      // Boost score if found by both methods
      existing.combinedScore = (existing.combinedScore + result.combinedScore) * 1.2;
      if (result.textRank) {
        existing.textRank = result.textRank;
      }
    } else {
      combined.set(key, result);
    }
  });

  return Array.from(combined.values());
}

/**
 * Re-rank results based on multiple factors
 */
export function rerankResults(
  results: DocumentChunk[],
  originalQuery: string,
  entities: string[]
): DocumentChunk[] {
  return results.map(doc => {
    let score = 1.0;

    // Boost if content contains original query
    if (doc.content.toLowerCase().includes(originalQuery.toLowerCase())) {
      score *= 1.5;
    }

    // Boost if content contains entities
    entities.forEach(entity => {
      if (doc.content.toLowerCase().includes(entity.toLowerCase())) {
        score *= 1.2;
      }
    });

    // Boost FAQ chunks
    if (doc.content.startsWith('Q:') || doc.content.includes('**Q:')) {
      score *= 1.3;
    }

    // Boost if source is FAQ
    if (doc.metadata?.source?.includes('faq')) {
      score *= 1.4;
    }

    return {
      ...doc,
      metadata: {
        ...doc.metadata,
        rankScore: score,
      },
    };
  }).sort((a, b) =>
    (b.metadata?.rankScore || 0) - (a.metadata?.rankScore || 0)
  );
}