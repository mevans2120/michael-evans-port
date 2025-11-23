/**
 * Hybrid Search Unit Tests
 * Tests semantic + keyword search combination and result reranking
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { rerankResults } from '../hybrid-search';
import type { DocumentChunk } from '../hybrid-search';

describe('Hybrid Search', () => {
  describe('Result Reranking', () => {
    let mockResults: DocumentChunk[];

    beforeEach(() => {
      mockResults = [
        {
          id: '1',
          content: 'Michael worked on the Virgin America project, building innovative features.',
          metadata: { source: 'project', title: 'Virgin America' },
        },
        {
          id: '2',
          content: 'The Casa Bonita project involved working with Trey Parker and Matt Stone.',
          metadata: { source: 'project', title: 'Casa Bonita' },
        },
        {
          id: '3',
          content: 'Q: What is agentic engineering? A: Agentic engineering is about building autonomous agents.',
          metadata: { source: 'faq', title: 'FAQ' },
        },
        {
          id: '4',
          content: 'Michael studied at University of Colorado Boulder.',
          metadata: { source: 'profile', title: 'Education' },
        },
      ];
    });

    it('boosts results containing the original query', () => {
      const reranked = rerankResults(mockResults, 'Virgin America', []);

      // Virgin America result should be ranked higher (find it after sorting)
      const virginResult = reranked.find(r => r.content.includes('Virgin America'));
      expect(virginResult).toBeDefined();
      expect(virginResult!.metadata.rankScore).toBeGreaterThan(1.0);
      // Should be in top results
      const virginIndex = reranked.findIndex(r => r.content.includes('Virgin America'));
      expect(virginIndex).toBeLessThan(3);
    });

    it('boosts results containing extracted entities', () => {
      const reranked = rerankResults(mockResults, 'Tell me about Casa', ['Casa Bonita']);

      // Casa Bonita result should be highly ranked
      const casaIndex = reranked.findIndex(r => r.content.includes('Casa Bonita'));
      expect(reranked[casaIndex].metadata.rankScore).toBeGreaterThan(1.0);
    });

    it('boosts FAQ-style content with Q: prefix', () => {
      const reranked = rerankResults(mockResults, 'agentic engineering', []);

      // FAQ result should be boosted
      const faqResult = reranked.find(r => r.content.startsWith('Q:'));
      expect(faqResult).toBeDefined();
      expect(faqResult!.metadata.rankScore).toBeGreaterThan(1.0);
    });

    it('boosts results from FAQ source', () => {
      const reranked = rerankResults(mockResults, 'question', []);

      // FAQ source should get extra boost
      const faqResult = reranked.find(r => r.metadata.source === 'faq');
      expect(faqResult).toBeDefined();
      expect(faqResult!.metadata.rankScore).toBeGreaterThan(1.0);
    });

    it('applies multiple boost factors cumulatively', () => {
      const reranked = rerankResults(
        mockResults,
        'agentic engineering',
        ['agentic', 'autonomous']
      );

      // FAQ result contains query, entities, starts with Q:, and is from FAQ source
      const faqResult = reranked.find(r => r.content.startsWith('Q:'));
      expect(faqResult!.metadata.rankScore).toBeGreaterThan(2.0); // Multiple boosts applied
    });

    it('sorts results by rank score descending', () => {
      const reranked = rerankResults(
        mockResults,
        'Virgin America',
        ['Virgin America']
      );

      // Verify descending order
      for (let i = 0; i < reranked.length - 1; i++) {
        const currentScore = reranked[i].metadata.rankScore || 0;
        const nextScore = reranked[i + 1].metadata.rankScore || 0;
        expect(currentScore).toBeGreaterThanOrEqual(nextScore);
      }
    });

    it('handles case-insensitive entity matching', () => {
      const reranked = rerankResults(
        mockResults,
        'virgin',
        ['virgin america']
      );

      const virginResult = reranked.find(r => r.content.toLowerCase().includes('virgin america'));
      expect(virginResult!.metadata.rankScore).toBeGreaterThan(1.0);
    });

    it('handles empty query gracefully', () => {
      const reranked = rerankResults(mockResults, '', []);

      expect(reranked).toHaveLength(mockResults.length);
      reranked.forEach(result => {
        expect(result.metadata.rankScore).toBeDefined();
      });
    });

    it('handles empty entities array', () => {
      const reranked = rerankResults(mockResults, 'Virgin America', []);

      expect(reranked).toHaveLength(mockResults.length);
      const virginResult = reranked.find(r => r.content.includes('Virgin America'));
      expect(virginResult!.metadata.rankScore).toBeGreaterThan(1.0);
    });

    it('handles empty results array', () => {
      const reranked = rerankResults([], 'query', ['entity']);

      expect(reranked).toEqual([]);
    });

    it('preserves all original document fields', () => {
      const reranked = rerankResults(mockResults, 'test', []);

      // Results are sorted by rank score, so order may change
      // Verify all results are present and preserve their fields
      expect(reranked).toHaveLength(mockResults.length);

      reranked.forEach(result => {
        const original = mockResults.find(m => m.id === result.id);
        expect(original).toBeDefined();
        expect(result.content).toBe(original!.content);
        expect(result.metadata.source).toBe(original!.metadata.source);
        expect(result.metadata.title).toBe(original!.metadata.title);
      });
    });

    it('adds rankScore to metadata without removing existing fields', () => {
      const reranked = rerankResults(mockResults, 'test', []);

      reranked.forEach(result => {
        expect(result.metadata).toHaveProperty('rankScore');
        expect(result.metadata).toHaveProperty('source');
        expect(result.metadata).toHaveProperty('title');
      });
    });

    it('handles multiple entity matches', () => {
      const reranked = rerankResults(
        mockResults,
        'Casa Bonita',
        ['Casa Bonita', 'Trey Parker', 'Matt Stone']
      );

      const casaResult = reranked.find(r => r.content.includes('Casa Bonita'));
      // Should have boost for query + 3 entity matches
      expect(casaResult!.metadata.rankScore).toBeGreaterThan(2.0);
    });

    it('handles FAQ content with **Q: markdown format', () => {
      const faqWithMarkdown: DocumentChunk[] = [{
        id: '1',
        content: '**Q: What is AI?** A: Artificial Intelligence...',
        metadata: { source: 'faq' },
      }];

      const reranked = rerankResults(faqWithMarkdown, 'AI', []);
      expect(reranked[0].metadata.rankScore).toBeGreaterThan(1.0);
    });
  });

  describe('Score Calculation', () => {
    it('default score is 1.0 for no matches', () => {
      const results: DocumentChunk[] = [{
        id: '1',
        content: 'Unrelated content',
        metadata: { source: 'other' },
      }];

      const reranked = rerankResults(results, 'query', []);
      expect(reranked[0].metadata.rankScore).toBe(1.0);
    });

    it('query match multiplies score by 1.5', () => {
      const results: DocumentChunk[] = [{
        id: '1',
        content: 'Michael Evans worked on projects',
        metadata: { source: 'profile' },
      }];

      const reranked = rerankResults(results, 'Michael Evans', []);
      expect(reranked[0].metadata.rankScore).toBe(1.5);
    });

    it('each entity match multiplies score by 1.2', () => {
      const results: DocumentChunk[] = [{
        id: '1',
        content: 'Virgin America and Casa Bonita projects',
        metadata: { source: 'project' },
      }];

      const reranked = rerankResults(results, 'something else', ['Virgin America', 'Casa Bonita']);
      // Base 1.0 * 1.2 (Virgin) * 1.2 (Casa) = 1.44
      expect(reranked[0].metadata.rankScore).toBeCloseTo(1.44, 2);
    });

    it('FAQ Q: prefix multiplies score by 1.3', () => {
      const results: DocumentChunk[] = [{
        id: '1',
        content: 'Q: What is this?',
        metadata: { source: 'other' },
      }];

      const reranked = rerankResults(results, 'other', []);
      expect(reranked[0].metadata.rankScore).toBeCloseTo(1.3, 2);
    });

    it('FAQ source multiplies score by 1.4', () => {
      const results: DocumentChunk[] = [{
        id: '1',
        content: 'Some FAQ content',
        metadata: { source: 'faq-document' },
      }];

      const reranked = rerankResults(results, 'unrelated', []);
      expect(reranked[0].metadata.rankScore).toBeCloseTo(1.4, 2);
    });

    it('combines all boost factors multiplicatively', () => {
      const results: DocumentChunk[] = [{
        id: '1',
        content: 'Q: What about Virgin America?',
        metadata: { source: 'faq-answers' },
      }];

      const reranked = rerankResults(
        results,
        'Virgin America',
        ['Virgin America']
      );

      // Base 1.0 * 1.5 (query) * 1.2 (entity) * 1.3 (Q:) * 1.4 (faq source) = 3.276
      expect(reranked[0].metadata.rankScore).toBeCloseTo(3.276, 2);
    });
  });
});
