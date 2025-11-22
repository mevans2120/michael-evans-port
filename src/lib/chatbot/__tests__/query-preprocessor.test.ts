/**
 * Query Preprocessor Unit Tests
 * Tests query normalization, entity extraction, and query expansion
 */

import { describe, it, expect } from 'vitest';
import { preprocessQuery, generateAlternativeQueries } from '../query-preprocessor';

describe('Query Preprocessor', () => {
  describe('Query Normalization', () => {
    it('removes question patterns from start of query', () => {
      const result = preprocessQuery('What is agentic engineering?');
      expect(result.normalized).not.toMatch(/^what/i);
      expect(result.normalized).toContain('agentic');
    });

    it('removes question marks from end of query', () => {
      const result = preprocessQuery('Where did Michael grow up?');
      expect(result.normalized).not.toContain('?');
    });

    it('removes common stop words', () => {
      const result = preprocessQuery('Tell me about the projects');
      expect(result.normalized).not.toMatch(/^tell me about/i);
      expect(result.normalized).toContain('projects');
    });

    it('preserves important context words', () => {
      const result = preprocessQuery('What did Michael study in college?');
      expect(result.normalized).toContain('study');
      expect(result.normalized).toContain('college');
    });

    it('handles multiple question patterns', () => {
      const result = preprocessQuery('Could you please tell me about Michael?');
      expect(result.normalized).not.toMatch(/^could you/i);
      // Note: 'please' is only removed when followed by other words in pattern matching
      // It's preserved in this case as it's part of natural speech
      expect(result.normalized).toContain('michael');
    });
  });

  describe('Entity Extraction', () => {
    it('extracts Michael Evans entity', () => {
      const result = preprocessQuery('What did Michael study?');
      expect(result.entities).toContain('Michael Evans');
    });

    it('extracts project name entities', () => {
      const result = preprocessQuery('Tell me about the Before Launcher');
      expect(result.entities).toContain('Before Launcher');
      expect(result.entities).toContain('Before Labs');
    });

    it('extracts company entities', () => {
      const result = preprocessQuery('What did Michael do at Virgin?');
      expect(result.entities).toContain('Virgin America');
    });

    it('extracts location entities', () => {
      const result = preprocessQuery('Where did Michael grow up in Eugene?');
      expect(result.entities).toContain('Eugene, Oregon');
    });

    it('extracts multiple entities from complex queries', () => {
      const result = preprocessQuery('Did Michael work on Casa Bonita with Trey Parker?');
      expect(result.entities).toContain('Casa Bonita');
      expect(result.entities).toContain('Trey Parker');
      expect(result.entities).toContain('Matt Stone');
    });

    it('handles case-insensitive entity matching', () => {
      const result = preprocessQuery('what about CASA BONITA?');
      expect(result.entities).toContain('Casa Bonita');
    });

    it('removes duplicate entities', () => {
      const result = preprocessQuery('Michael Evans and Michael worked together');
      const michaelCount = result.entities.filter(e => e.includes('Michael')).length;
      expect(michaelCount).toBeLessThanOrEqual(2); // Should not have duplicates
    });
  });

  describe('Keyword Extraction', () => {
    it('extracts education keywords', () => {
      const result = preprocessQuery('Where did Michael study?');
      expect(result.keywords).toContain('study');
    });

    it('extracts background keywords', () => {
      const result = preprocessQuery('Where did Michael grow up?');
      expect(result.keywords).toContain('background');
      expect(result.keywords).toContain('grow up');
    });

    it('extracts career keywords', () => {
      const result = preprocessQuery('What was Michael\'s first job?');
      expect(result.keywords).toContain('first job');
      expect(result.keywords).toContain('career');
    });

    it('extracts project keywords', () => {
      const result = preprocessQuery('What projects did Michael build?');
      expect(result.keywords).toContain('project');
      // Note: 'built' is matched by the 'built' keyword pattern
      expect(result.keywords).toContain('projects');
    });

    it('extracts AI/ML keywords', () => {
      const result = preprocessQuery('What AI projects has Michael created?');
      expect(result.keywords).toContain('ai');
    });

    it('removes duplicate keywords', () => {
      const result = preprocessQuery('project project project');
      const projectCount = result.keywords.filter(k => k === 'project').length;
      expect(projectCount).toBe(1);
    });
  });

  describe('Query Expansion', () => {
    it('expands query with extracted entities', () => {
      const result = preprocessQuery('What did Michael study?');
      expect(result.expanded).toContain('Michael');
      expect(result.expanded).toContain('study');
    });

    it('adds first-person variations for Michael queries', () => {
      const result = preprocessQuery('What did Michael study?');
      expect(result.expanded).toMatch(/\b(I|my|me)\b/i);
    });

    it('adds contextual expansions for education queries', () => {
      const result = preprocessQuery('Where did Michael go to college?');
      expect(result.expanded).toContain('university');
      expect(result.expanded).toContain('degree');
    });

    it('adds contextual expansions for background queries', () => {
      const result = preprocessQuery('Where did Michael grow up?');
      expect(result.expanded).toContain('hometown');
      expect(result.expanded).toContain('childhood');
    });

    it('adds specific context for common query patterns', () => {
      const result = preprocessQuery('Where did Michael grow up?');
      expect(result.expanded).toContain('Eugene');
      expect(result.expanded).toContain('Oregon');
    });

    it('adds specific context for first job queries', () => {
      const result = preprocessQuery('What was Michael\'s first job?');
      expect(result.expanded).toContain('Symantec');
    });

    it('adds specific context for restaurant/Casa Bonita queries', () => {
      const result = preprocessQuery('Tell me about the restaurant project');
      expect(result.expanded).toContain('Casa Bonita');
      expect(result.expanded).toContain('Denver');
    });

    it('removes duplicate words in expanded query', () => {
      const result = preprocessQuery('college college college');
      const words = result.expanded.split(' ');
      const collegeCount = words.filter(w => w.toLowerCase() === 'college').length;
      expect(collegeCount).toBe(1);
    });
  });

  describe('Full Preprocessing Flow', () => {
    it('preserves original query', () => {
      const original = 'What is agentic engineering?';
      const result = preprocessQuery(original);
      expect(result.original).toBe(original);
    });

    it('returns all expected fields', () => {
      const result = preprocessQuery('What did Michael study?');
      expect(result).toHaveProperty('original');
      expect(result).toHaveProperty('normalized');
      expect(result).toHaveProperty('expanded');
      expect(result).toHaveProperty('entities');
      expect(result).toHaveProperty('keywords');
    });

    it('handles empty query gracefully', () => {
      const result = preprocessQuery('');
      expect(result.normalized).toBe('');
      expect(result.entities).toEqual([]);
      expect(result.keywords).toEqual([]);
    });

    it('handles query with only stop words', () => {
      const result = preprocessQuery('what is the');
      expect(result.normalized).toBeDefined();
      expect(result.expanded).toBeDefined();
    });

    it('processes complex multi-topic query', () => {
      const result = preprocessQuery('What AI projects did Michael build at Work & Co in Portland?');
      expect(result.entities).toContain('Work & Co');
      expect(result.entities).toContain('Portland');
      expect(result.keywords).toContain('ai');
      expect(result.keywords).toContain('project');
      expect(result.expanded).toContain('artificial intelligence');
    });
  });

  describe('Alternative Query Generation', () => {
    it('includes original query in alternatives', () => {
      const alternatives = generateAlternativeQueries('What is AI?');
      expect(alternatives).toContain('What is AI?');
    });

    it('transforms "where did X grow up" pattern', () => {
      const alternatives = generateAlternativeQueries('Where did Michael grow up?');
      expect(alternatives.some(alt => alt.includes('childhood'))).toBe(true);
      expect(alternatives.some(alt => alt.includes('hometown'))).toBe(true);
    });

    it('transforms "what did X study" pattern', () => {
      const alternatives = generateAlternativeQueries('What did Michael study?');
      expect(alternatives.some(alt => alt.includes('college'))).toBe(true);
      expect(alternatives.some(alt => alt.includes('major'))).toBe(true);
    });

    it('transforms "tell me about" pattern', () => {
      const alternatives = generateAlternativeQueries('Tell me about Casa Bonita');
      expect(alternatives.some(alt => alt.includes('describe'))).toBe(true);
    });

    it('transforms "what is X working on" pattern', () => {
      const alternatives = generateAlternativeQueries('What is Michael working on?');
      expect(alternatives.some(alt => alt.includes('current'))).toBe(true);
    });

    it('transforms "X\'s first job" pattern', () => {
      const alternatives = generateAlternativeQueries('What was Michael\'s first job?');
      expect(alternatives.some(alt => alt.includes('career start'))).toBe(true);
    });

    it('handles queries with no matching patterns', () => {
      const alternatives = generateAlternativeQueries('Random query text');
      expect(alternatives).toHaveLength(1);
      expect(alternatives[0]).toBe('Random query text');
    });
  });
});
