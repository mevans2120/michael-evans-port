/**
 * Query Preprocessor
 * Enhances queries before embedding for better semantic matching
 */

export interface ProcessedQuery {
  original: string;
  normalized: string;
  expanded: string;
  entities: string[];
  keywords: string[];
}

/**
 * Preprocess and enhance a query for better retrieval
 */
export function preprocessQuery(query: string): ProcessedQuery {
  // Step 1: Normalize the query
  const normalized = normalizeQuery(query);

  // Step 2: Extract entities
  const entities = extractEntities(query);

  // Step 3: Extract keywords
  const keywords = extractKeywords(normalized);

  // Step 4: Expand with contextual knowledge
  const expanded = expandQuery(normalized, entities, keywords);

  return {
    original: query,
    normalized,
    expanded,
    entities,
    keywords,
  };
}

/**
 * Normalize query by removing stop words and question patterns
 */
function normalizeQuery(query: string): string {
  let normalized = query.toLowerCase();

  // Remove common question patterns
  const questionPatterns = [
    /^(what|where|when|who|how|why|tell me about|describe|explain|can you|could you|please)\s+/i,
    /\?$/,
    /^(i want to know|i'd like to know|i need to know)\s+/i,
    /^(show me|give me|provide)\s+/i,
  ];

  questionPatterns.forEach(pattern => {
    normalized = normalized.replace(pattern, '');
  });

  // Remove articles and common stop words (but keep important context)
  const stopWords = ['the', 'a', 'an', 'is', 'are', 'was', 'were', 'has', 'have', 'had', 'does', 'do', 'did'];
  const words = normalized.split(' ');
  normalized = words
    .filter(word => !stopWords.includes(word) || word.length > 2)
    .join(' ');

  return normalized.trim();
}

/**
 * Extract named entities from the query
 */
function extractEntities(query: string): string[] {
  const entities: string[] = [];

  // Known entities
  const knownEntities = {
    'michael': ['Michael Evans', 'Michael'],
    'eugene': ['Eugene, Oregon'],
    'colorado': ['University of Colorado', 'Boulder'],
    'virgin': ['Virgin America'],
    'casa bonita': ['Casa Bonita', 'Trey Parker', 'Matt Stone'],
    'target': ['Target'],
    'hbo': ['HBO', 'HBO Go'],
    'lyft': ['Lyft'],
    'portland': ['Portland', 'Work & Co'],
    'before launcher': ['Before Launcher', 'Before Labs'],
    'huge': ['Huge'],
    'work & co': ['Work & Co'],
    'work and co': ['Work & Co'],
  };

  const lowerQuery = query.toLowerCase();
  Object.entries(knownEntities).forEach(([key, values]) => {
    if (lowerQuery.includes(key)) {
      entities.push(...values);
    }
  });

  return [...new Set(entities)]; // Remove duplicates
}

/**
 * Extract important keywords from the query
 */
function extractKeywords(normalized: string): string[] {
  const keywords: string[] = [];

  // Topic keywords that should be preserved
  const topicKeywords = {
    education: ['college', 'university', 'study', 'studied', 'degree', 'major'],
    background: ['grow up', 'grew up', 'childhood', 'hometown', 'born', 'raised'],
    career: ['first job', 'career', 'work', 'worked', 'position', 'role'],
    projects: ['project', 'built', 'created', 'developed', 'designed'],
    tech: ['technology', 'programming', 'coding', 'software', 'computer'],
    ai: ['ai', 'artificial intelligence', 'machine learning', 'ml', 'neural'],
  };

  Object.entries(topicKeywords).forEach(([topic, words]) => {
    words.forEach(word => {
      if (normalized.includes(word)) {
        keywords.push(topic);
        keywords.push(word);
      }
    });
  });

  return [...new Set(keywords)];
}

/**
 * Expand query with semantic variations and context
 */
function expandQuery(normalized: string, entities: string[], keywords: string[]): string {
  let expanded = normalized;

  // Add entities
  if (entities.length > 0) {
    expanded += ' ' + entities.join(' ');
  }

  // Convert Michael to first-person variations
  if (entities.some(e => e.includes('Michael'))) {
    const firstPerson = normalized.replace(/michael(?:'s)?(?:\s+evans)?/gi, 'I my me');
    expanded += ' ' + firstPerson;
  }

  // Add contextual expansions based on keywords
  const contextualExpansions: Record<string, string> = {
    'education': 'college university degree major studied English political science Colorado Boulder',
    'background': 'childhood hometown grew up Eugene Oregon purple house hippies raised',
    'career': 'job work position role company agency consultant',
    'projects': 'built created developed designed implementation product',
    'tech': 'technology programming coding software development computer',
    'ai': 'artificial intelligence machine learning ML neural networks AI',
  };

  keywords.forEach(keyword => {
    if (contextualExpansions[keyword]) {
      expanded += ' ' + contextualExpansions[keyword];
    }
  });

  // Add specific context for common queries
  const queryContextMap: Record<string, string> = {
    'grow up': 'Eugene Oregon childhood hometown purple house',
    'college': 'University Colorado Boulder English political science',
    'first job': 'Symantec customer data analyst business analyst first tech job career',
    'restaurant': 'Casa Bonita cliff diving Denver Trey Parker Matt Stone',
    'hbo': 'HBO Go Canadian Astral streaming mobile app',
    'portland': 'Portland office Work Co Joe Stewart opened',
    'launcher': 'Before Launcher Android home screen replacement Microsoft',
    'current': 'PostPal consulting current now working',
  };

  Object.entries(queryContextMap).forEach(([pattern, context]) => {
    if (normalized.includes(pattern)) {
      expanded += ' ' + context;
    }
  });

  // Remove duplicates and clean up
  const uniqueWords = [...new Set(expanded.split(' '))];
  return uniqueWords.join(' ').trim();
}

/**
 * Generate alternative phrasings of a query
 */
export function generateAlternativeQueries(query: string): string[] {
  const alternatives: string[] = [query];
  const lower = query.toLowerCase();

  // Pattern transformations
  const transformations: Array<[RegExp, string]> = [
    [/where did (.*) grow up/i, 'childhood hometown $1'],
    [/what did (.*) study/i, 'college major degree $1'],
    [/tell me about (.*)/i, '$1 describe explain'],
    [/what is (.*) working on/i, '$1 current projects now'],
    [/(.*)'s first job/i, 'first job career start $1'],
  ];

  transformations.forEach(([pattern, replacement]) => {
    if (pattern.test(lower)) {
      alternatives.push(lower.replace(pattern, replacement));
    }
  });

  return alternatives;
}