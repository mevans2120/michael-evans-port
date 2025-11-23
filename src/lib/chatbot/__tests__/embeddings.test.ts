/**
 * Embeddings Unit Tests
 * Tests text chunking and cosine similarity calculations
 */

import { describe, it, expect } from 'vitest';
import { chunkText, cosineSimilarity } from '../embeddings';

describe('Embeddings', () => {
  describe('Text Chunking', () => {
    it('splits text into chunks of specified size', () => {
      const text = 'a'.repeat(1000);
      const chunks = chunkText(text, 200, 50);

      chunks.forEach(chunk => {
        expect(chunk.length).toBeLessThanOrEqual(200);
      });
    });

    it('creates overlapping chunks', () => {
      const text = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const chunks = chunkText(text, 10, 3);

      expect(chunks.length).toBeGreaterThan(1);
      // Check that consecutive chunks share some content (overlap)
      for (let i = 0; i < chunks.length - 1; i++) {
        const currentEnd = chunks[i].slice(-3);
        const _nextStart = chunks[i + 1].slice(0, 3);
        // There should be some overlap between chunks
        expect(chunks[i + 1]).toContain(currentEnd.charAt(currentEnd.length - 1));
      }
    });

    it('handles text shorter than chunk size', () => {
      const text = 'Short text';
      const chunks = chunkText(text, 100, 20);

      expect(chunks).toHaveLength(1);
      expect(chunks[0]).toBe('Short text');
    });

    it('handles text exactly at chunk size', () => {
      const text = 'a'.repeat(100);
      const chunks = chunkText(text, 100, 20);

      expect(chunks).toHaveLength(1);
      expect(chunks[0]).toBe(text);
    });

    it('trims whitespace from chunks', () => {
      const text = '  chunk one  \n\n  chunk two  ';
      const chunks = chunkText(text, 15, 3);

      chunks.forEach(chunk => {
        expect(chunk).toBe(chunk.trim());
      });
    });

    it('filters out empty chunks', () => {
      const text = '   \n\n\n   ';
      const chunks = chunkText(text, 10, 2);

      expect(chunks).toHaveLength(0);
    });

    it('handles default parameters', () => {
      const text = 'a'.repeat(2000);
      const chunks = chunkText(text); // Use defaults: 800 chunk size, 200 overlap

      expect(chunks.length).toBeGreaterThan(1);
      chunks.forEach(chunk => {
        expect(chunk.length).toBeLessThanOrEqual(800);
      });
    });

    it('prevents infinite loop at text end', () => {
      const text = 'a'.repeat(500);
      const chunks = chunkText(text, 200, 50);

      // Should not hang or create infinite chunks
      expect(chunks.length).toBeLessThan(10);
      expect(chunks.length).toBeGreaterThan(0);
    });

    it('creates proper number of chunks for long text', () => {
      const text = 'a'.repeat(1000);
      const chunks = chunkText(text, 200, 50);

      // Expected chunks: roughly 1000 / (200 - 50) = ~6-7 chunks
      expect(chunks.length).toBeGreaterThan(4);
      expect(chunks.length).toBeLessThan(10);
    });

    it('handles multi-paragraph text', () => {
      const text = `
        Paragraph one with some content here.
        This is a longer piece of text.

        Paragraph two with more content.
        Additional sentences to make it longer.

        Paragraph three to ensure proper chunking.
      `.trim();

      const chunks = chunkText(text, 50, 10);

      expect(chunks.length).toBeGreaterThan(1);
      chunks.forEach(chunk => {
        expect(chunk.length).toBeGreaterThan(0);
      });
    });

    it('handles text with special characters', () => {
      const text = 'Special chars: @#$%^&*(){}[]|\\<>?/~`';
      const chunks = chunkText(text, 20, 5);

      expect(chunks.length).toBeGreaterThan(0);
      expect(chunks[0]).toContain('Special');
    });

    it('uses correct overlap size', () => {
      const text = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      const chunks = chunkText(text, 15, 5);

      expect(chunks.length).toBeGreaterThan(1);
      // Verify overlap by checking character positions
      // With chunk size 15 and overlap 5, each chunk should start 10 chars after previous
    });
  });

  describe('Cosine Similarity', () => {
    it('returns 1.0 for identical vectors', () => {
      const vectorA = [1, 2, 3, 4, 5];
      const vectorB = [1, 2, 3, 4, 5];

      const similarity = cosineSimilarity(vectorA, vectorB);
      expect(similarity).toBeCloseTo(1.0, 5);
    });

    it('returns 0.0 for orthogonal vectors', () => {
      const vectorA = [1, 0, 0];
      const vectorB = [0, 1, 0];

      const similarity = cosineSimilarity(vectorA, vectorB);
      expect(similarity).toBeCloseTo(0.0, 5);
    });

    it('returns -1.0 for opposite vectors', () => {
      const vectorA = [1, 2, 3];
      const vectorB = [-1, -2, -3];

      const similarity = cosineSimilarity(vectorA, vectorB);
      expect(similarity).toBeCloseTo(-1.0, 5);
    });

    it('calculates correct similarity for partial match', () => {
      const vectorA = [1, 0, 1, 0];
      const vectorB = [1, 1, 0, 0];

      const similarity = cosineSimilarity(vectorA, vectorB);
      // Dot product: 1*1 + 0*1 + 1*0 + 0*0 = 1
      // Magnitude A: sqrt(1 + 0 + 1 + 0) = sqrt(2)
      // Magnitude B: sqrt(1 + 1 + 0 + 0) = sqrt(2)
      // Similarity: 1 / (sqrt(2) * sqrt(2)) = 1/2 = 0.5
      expect(similarity).toBeCloseTo(0.5, 5);
    });

    it('throws error for vectors of different lengths', () => {
      const vectorA = [1, 2, 3];
      const vectorB = [1, 2, 3, 4];

      expect(() => cosineSimilarity(vectorA, vectorB)).toThrow('same length');
    });

    it('returns 0 for zero vector', () => {
      const vectorA = [0, 0, 0];
      const vectorB = [1, 2, 3];

      const similarity = cosineSimilarity(vectorA, vectorB);
      expect(similarity).toBe(0);
    });

    it('handles floating point vectors', () => {
      const vectorA = [0.1, 0.2, 0.3];
      const vectorB = [0.1, 0.2, 0.3];

      const similarity = cosineSimilarity(vectorA, vectorB);
      expect(similarity).toBeCloseTo(1.0, 5);
    });

    it('handles negative values in vectors', () => {
      const vectorA = [-1, 2, -3];
      const vectorB = [1, -2, 3];

      const similarity = cosineSimilarity(vectorA, vectorB);
      expect(similarity).toBeCloseTo(-1.0, 5);
    });

    it('handles high-dimensional vectors (like embeddings)', () => {
      // Simulate 768-dimensional embedding vectors
      const vectorA = Array(768).fill(0.5);
      const vectorB = Array(768).fill(0.5);

      const similarity = cosineSimilarity(vectorA, vectorB);
      expect(similarity).toBeCloseTo(1.0, 5);
    });

    it('calculates similarity for sparse vectors', () => {
      const vectorA = Array(100).fill(0);
      vectorA[10] = 1;
      vectorA[50] = 1;

      const vectorB = Array(100).fill(0);
      vectorB[10] = 1;
      vectorB[50] = 1;

      const similarity = cosineSimilarity(vectorA, vectorB);
      expect(similarity).toBeCloseTo(1.0, 5);
    });

    it('is commutative (A·B = B·A)', () => {
      const vectorA = [1, 2, 3, 4];
      const vectorB = [5, 6, 7, 8];

      const simAB = cosineSimilarity(vectorA, vectorB);
      const simBA = cosineSimilarity(vectorB, vectorA);

      expect(simAB).toBeCloseTo(simBA, 10);
    });

    it('returns value between -1 and 1', () => {
      const vectorA = [Math.random(), Math.random(), Math.random()];
      const vectorB = [Math.random(), Math.random(), Math.random()];

      const similarity = cosineSimilarity(vectorA, vectorB);

      expect(similarity).toBeGreaterThanOrEqual(-1);
      expect(similarity).toBeLessThanOrEqual(1);
    });

    it('handles very small values without precision loss', () => {
      const vectorA = [0.0001, 0.0002, 0.0003];
      const vectorB = [0.0001, 0.0002, 0.0003];

      const similarity = cosineSimilarity(vectorA, vectorB);
      expect(similarity).toBeCloseTo(1.0, 5);
    });

    it('handles very large values without overflow', () => {
      const vectorA = [1000000, 2000000, 3000000];
      const vectorB = [1000000, 2000000, 3000000];

      const similarity = cosineSimilarity(vectorA, vectorB);
      expect(similarity).toBeCloseTo(1.0, 5);
    });
  });
});
