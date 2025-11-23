/**
 * Smart Sync Module
 * Intelligent incremental content synchronization with change detection
 */

import { fetchAllSanityContent } from './sanity-fetcher';
import { processDocuments } from './embeddings';
import { generateContentHash } from './content-hash';
import {
  findDocumentsBySourceId,
  deleteDocumentsBySourceId,
  insertDocuments,
} from './supabase';

export interface SyncResult {
  added: number;
  updated: number;
  deleted: number;
  unchanged: number;
  totalChunks: number;
  changes: Array<{
    sourceId: string;
    title: string;
    action: 'added' | 'updated' | 'deleted' | 'unchanged';
    chunkCount?: number;
  }>;
}

/**
 * Smart sync: Only sync changed content from Sanity
 */
export async function smartSyncSanityContent(): Promise<SyncResult> {
  console.log('🔄 Starting smart sync...\n');

  const result: SyncResult = {
    added: 0,
    updated: 0,
    deleted: 0,
    unchanged: 0,
    totalChunks: 0,
    changes: [],
  };

  try {
    // Step 1: Fetch current Sanity content
    console.log('📦 Fetching Sanity content...');
    const sanityDocuments = await fetchAllSanityContent();
    console.log(`✅ Found ${sanityDocuments.length} Sanity documents\n`);

    // Step 2: Process each document and compare with existing
    console.log('🔍 Checking for changes...');

    for (const doc of sanityDocuments) {
      const sourceId = doc.metadata.source_id;
      const contentHash = generateContentHash(doc.content);

      // Check if this document already exists in the database
      const existingDocs = await findDocumentsBySourceId(sourceId);

      if (existingDocs.length === 0) {
        // New document - needs to be added
        console.log(`  ✨ NEW: ${doc.metadata.title}`);

        // Process and insert
        const chunks = await processDocuments([{
          content: doc.content,
          metadata: doc.metadata,
        }]);

        await insertDocuments(
          chunks.map((chunk, index) => ({
            content: chunk.content,
            embedding: chunk.embedding,
            metadata: chunk.metadata,
            content_hash: generateContentHash(chunk.content),
            source_id: `${sourceId}_chunk_${index}`,
          }))
        );

        result.added++;
        result.totalChunks += chunks.length;
        result.changes.push({
          sourceId,
          title: doc.metadata.title,
          action: 'added',
          chunkCount: chunks.length,
        });
      } else {
        // Document exists - check if content changed
        const existingHash = existingDocs[0].content_hash;

        if (existingHash !== contentHash) {
          // Content changed - re-process
          console.log(`  🔄 UPDATED: ${doc.metadata.title}`);

          // Delete old chunks
          await deleteDocumentsBySourceId(sourceId);

          // Re-process and insert new chunks
          const chunks = await processDocuments([{
            content: doc.content,
            metadata: doc.metadata,
          }]);

          await insertDocuments(
            chunks.map((chunk, index) => ({
              content: chunk.content,
              embedding: chunk.embedding,
              metadata: chunk.metadata,
              content_hash: generateContentHash(chunk.content),
              source_id: `${sourceId}_chunk_${index}`,
            }))
          );

          result.updated++;
          result.totalChunks += chunks.length;
          result.changes.push({
            sourceId,
            title: doc.metadata.title,
            action: 'updated',
            chunkCount: chunks.length,
          });
        } else {
          // Content unchanged
          console.log(`  ✓ unchanged: ${doc.metadata.title}`);
          result.unchanged++;
          result.changes.push({
            sourceId,
            title: doc.metadata.title,
            action: 'unchanged',
          });
        }
      }
    }

    console.log('\n✅ Smart sync complete!\n');
    return result;
  } catch (error) {
    console.error('\n❌ Error during smart sync:', error);
    throw error;
  }
}

/**
 * Sync a single Sanity document by ID
 * Useful for webhook-triggered updates
 */
export async function syncSingleDocument(
  sanityDocumentId: string
): Promise<SyncResult> {
  console.log(`🔄 Syncing single document: ${sanityDocumentId}...`);

  const result: SyncResult = {
    added: 0,
    updated: 0,
    deleted: 0,
    unchanged: 0,
    totalChunks: 0,
    changes: [],
  };

  try {
    // Fetch all Sanity content and find the specific document
    const allContent = await fetchAllSanityContent();
    const doc = allContent.find(d => d.metadata.source_id === sanityDocumentId);

    if (!doc) {
      // Document not found in Sanity - it may have been deleted
      console.log('  🗑️  Document not found - checking for deletion...');

      const existingDocs = await findDocumentsBySourceId(sanityDocumentId);

      if (existingDocs.length > 0) {
        const deletedCount = await deleteDocumentsBySourceId(sanityDocumentId);
        console.log(`  ✅ Deleted ${deletedCount} chunks`);

        result.deleted++;
        result.changes.push({
          sourceId: sanityDocumentId,
          title: 'Deleted document',
          action: 'deleted',
        });
      }

      return result;
    }

    // Document exists - check if changed
    const existingDocs = await findDocumentsBySourceId(sanityDocumentId);
    const contentHash = generateContentHash(doc.content);

    if (existingDocs.length === 0) {
      // New document
      console.log(`  ✨ Adding new document: ${doc.metadata.title}`);

      const chunks = await processDocuments([{
        content: doc.content,
        metadata: doc.metadata,
      }]);

      await insertDocuments(
        chunks.map((chunk, index) => ({
          content: chunk.content,
          embedding: chunk.embedding,
          metadata: chunk.metadata,
          content_hash: generateContentHash(chunk.content),
          source_id: `${sanityDocumentId}_chunk_${index}`,
        }))
      );

      result.added++;
      result.totalChunks = chunks.length;
      result.changes.push({
        sourceId: sanityDocumentId,
        title: doc.metadata.title,
        action: 'added',
        chunkCount: chunks.length,
      });
    } else {
      const existingHash = existingDocs[0].content_hash;

      if (existingHash !== contentHash) {
        // Content changed
        console.log(`  🔄 Updating document: ${doc.metadata.title}`);

        await deleteDocumentsBySourceId(sanityDocumentId);

        const chunks = await processDocuments([{
          content: doc.content,
          metadata: doc.metadata,
        }]);

        await insertDocuments(
          chunks.map((chunk, index) => ({
            content: chunk.content,
            embedding: chunk.embedding,
            metadata: chunk.metadata,
            content_hash: generateContentHash(chunk.content),
            source_id: `${sanityDocumentId}_chunk_${index}`,
          }))
        );

        result.updated++;
        result.totalChunks = chunks.length;
        result.changes.push({
          sourceId: sanityDocumentId,
          title: doc.metadata.title,
          action: 'updated',
          chunkCount: chunks.length,
        });
      } else {
        console.log(`  ✓ No changes detected`);
        result.unchanged++;
        result.changes.push({
          sourceId: sanityDocumentId,
          title: doc.metadata.title,
          action: 'unchanged',
        });
      }
    }

    console.log('✅ Single document sync complete!\n');
    return result;
  } catch (error) {
    console.error('\n❌ Error syncing single document:', error);
    throw error;
  }
}

/**
 * Delete a Sanity document from the vector database
 */
export async function deleteSanityDocument(sanityDocumentId: string): Promise<number> {
  console.log(`🗑️  Deleting document: ${sanityDocumentId}...`);

  try {
    const deletedCount = await deleteDocumentsBySourceId(sanityDocumentId);
    console.log(`✅ Deleted ${deletedCount} chunks`);
    return deletedCount;
  } catch (error) {
    console.error('❌ Error deleting document:', error);
    throw error;
  }
}

/**
 * Print sync result summary
 */
export function printSyncSummary(result: SyncResult): void {
  console.log('📊 Sync Summary:');
  console.log(`   ✨ Added: ${result.added} documents (${result.totalChunks} chunks)`);
  console.log(`   🔄 Updated: ${result.updated} documents`);
  console.log(`   🗑️  Deleted: ${result.deleted} documents`);
  console.log(`   ✓ Unchanged: ${result.unchanged} documents`);
  console.log(`\n   Total processed: ${result.added + result.updated + result.deleted + result.unchanged} documents`);

  if (result.changes.length > 0) {
    console.log('\n   Changes:');
    result.changes
      .filter(c => c.action !== 'unchanged')
      .forEach(change => {
        const icon = change.action === 'added' ? '✨' : change.action === 'updated' ? '🔄' : '🗑️';
        const chunks = change.chunkCount ? ` (${change.chunkCount} chunks)` : '';
        console.log(`     ${icon} ${change.action.toUpperCase()}: ${change.title}${chunks}`);
      });
  }
}
