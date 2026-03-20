/**
 * Embedding Utilities for AI Chatbot
 * Handles text chunking and embedding generation using Google's Gemini API
 */

import { embed, embedMany } from 'ai';
import { google } from '@ai-sdk/google';
import { logger } from '@/lib/logger';

/**
 * Configuration
 */

const EMBEDDING_MODEL = 'gemini-embedding-001';
const CHUNK_SIZE = 800; // characters per chunk (increased for more context)
const CHUNK_OVERLAP = 200; // overlap between chunks (increased to ensure better continuity)

/**
 * Text Chunking
 * Splits long text into smaller chunks for embedding
 */

export function chunkText(text: string, chunkSize: number = CHUNK_SIZE, overlap: number = CHUNK_OVERLAP): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    const chunk = text.slice(start, end);

    // Only add non-empty chunks
    if (chunk.trim().length > 0) {
      chunks.push(chunk.trim());
    }

    // Move start position, accounting for overlap
    start = end - overlap;

    // Prevent infinite loop if we're at the end
    if (start >= text.length - overlap) {
      break;
    }
  }

  return chunks;
}

/**
 * Generate embedding for a single text
 */

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const { embedding } = await embed({
      model: google.textEmbeddingModel(EMBEDDING_MODEL),
      value: text,
      providerOptions: {
        google: { outputDimensionality: 768 },
      },
    });

    return embedding;
  } catch (error) {
    logger.error('Error generating embedding:', error);
    throw new Error(`Failed to generate embedding: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate embeddings for multiple texts
 * Batches requests to avoid API limits (max 100 per batch)
 */

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const BATCH_SIZE = 100; // Google API limit
  const MAX_RETRIES = 5;
  const allEmbeddings: number[][] = [];

  // Process in batches
  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);

    let lastError: Error | undefined;
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const { embeddings } = await embedMany({
          model: google.textEmbeddingModel(EMBEDDING_MODEL),
          values: batch,
          providerOptions: {
            google: { outputDimensionality: 768 },
          },
        });

        allEmbeddings.push(...embeddings);
        lastError = undefined;
        break;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        const isRateLimit = lastError.message.includes('quota') || lastError.message.includes('rate') || lastError.message.includes('429');
        if (!isRateLimit || attempt === MAX_RETRIES - 1) {
          throw new Error(`Failed to generate embeddings: ${lastError.message}`);
        }
        const backoffMs = Math.min(10000 * Math.pow(2, attempt), 60000);
        logger.log(`   ⏳ Rate limited, retrying in ${(backoffMs / 1000).toFixed(0)}s (attempt ${attempt + 1}/${MAX_RETRIES})...`);
        await new Promise(resolve => setTimeout(resolve, backoffMs));
      }
    }

    // Delay between batches to stay under free-tier rate limits
    if (i + BATCH_SIZE < texts.length) {
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  }

  return allEmbeddings;
}

/**
 * Process document into chunks with embeddings
 */

export interface ProcessedChunk {
  content: string;
  embedding: number[];
  metadata: {
    source: string;
    chunkIndex: number;
    totalChunks: number;
    [key: string]: unknown;
  };
}

export async function processDocument(
  content: string,
  metadata: {
    source: string;
    [key: string]: unknown;
  }
): Promise<ProcessedChunk[]> {
  // Split content into chunks
  const chunks = chunkText(content);

  // Generate embeddings for all chunks
  const embeddings = await generateEmbeddings(chunks);

  // Combine chunks with embeddings and metadata
  return chunks.map((chunk, index) => ({
    content: chunk,
    embedding: embeddings[index],
    metadata: {
      ...metadata,
      chunkIndex: index,
      totalChunks: chunks.length,
    },
  }));
}

/**
 * Batch process multiple documents
 */

export async function processDocuments(
  documents: Array<{
    content: string;
    metadata: { source: string; [key: string]: unknown };
  }>
): Promise<ProcessedChunk[]> {
  const allChunks: ProcessedChunk[] = [];

  for (let i = 0; i < documents.length; i++) {
    const doc = documents[i];
    const chunks = await processDocument(doc.content, doc.metadata);
    allChunks.push(...chunks);

    // Delay between documents to respect free-tier rate limits
    if (i < documents.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  return allChunks;
}

/**
 * Cosine similarity between two vectors
 * Used for manual similarity calculations if needed
 */

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length');
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    magnitudeA += a[i] * a[i];
    magnitudeB += b[i] * b[i];
  }

  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (magnitudeA * magnitudeB);
}
