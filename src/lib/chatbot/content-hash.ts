/**
 * Content Hashing Utilities
 * Generate fingerprints for content to detect changes
 */

import crypto from 'crypto';

/**
 * Generate SHA-256 hash of content
 * Used to detect if content has changed since last sync
 */
export function generateContentHash(content: string): string {
  return crypto
    .createHash('sha256')
    .update(content)
    .digest('hex');
}

/**
 * Generate hash for a document with metadata
 * Includes both content and key metadata fields to detect any changes
 */
export function generateDocumentHash(
  content: string,
  metadata?: Record<string, any>
): string {
  // Create a stable string representation
  const metadataString = metadata
    ? JSON.stringify(sortObjectKeys(metadata))
    : '';

  const combined = `${content}::${metadataString}`;

  return generateContentHash(combined);
}

/**
 * Sort object keys recursively for stable hashing
 */
function sortObjectKeys(obj: any): any {
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
    return obj;
  }

  return Object.keys(obj)
    .sort()
    .reduce((sorted: any, key) => {
      sorted[key] = sortObjectKeys(obj[key]);
      return sorted;
    }, {});
}

/**
 * Compare two hashes
 */
export function hashesMatch(hash1: string, hash2: string): boolean {
  return hash1 === hash2;
}

/**
 * Generate a unique ID for a document chunk
 * Combines source_id and chunk index for stable identification
 */
export function generateChunkId(sourceId: string, chunkIndex: number): string {
  return `${sourceId}_chunk_${chunkIndex}`;
}
