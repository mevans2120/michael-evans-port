/**
 * Embedding Utilities for AI Chatbot
 * Handles text chunking and embedding generation using Google's Gemini API
 */

import { embed, embedMany } from 'ai';
import { google } from '@ai-sdk/google';

/**
 * Configuration
 */

const EMBEDDING_MODEL = 'text-embedding-004';
const CHUNK_SIZE = 500; // characters per chunk
const CHUNK_OVERLAP = 50; // overlap between chunks

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
    });

    return embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw new Error(`Failed to generate embedding: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate embeddings for multiple texts
 */

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  try {
    const { embeddings } = await embedMany({
      model: google.textEmbeddingModel(EMBEDDING_MODEL),
      values: texts,
    });

    return embeddings;
  } catch (error) {
    console.error('Error generating embeddings:', error);
    throw new Error(`Failed to generate embeddings: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
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
    [key: string]: any;
  };
}

export async function processDocument(
  content: string,
  metadata: {
    source: string;
    [key: string]: any;
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
    metadata: { source: string; [key: string]: any };
  }>
): Promise<ProcessedChunk[]> {
  const allChunks: ProcessedChunk[] = [];

  for (const doc of documents) {
    const chunks = await processDocument(doc.content, doc.metadata);
    allChunks.push(...chunks);
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
