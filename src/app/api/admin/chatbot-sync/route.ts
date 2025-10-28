/**
 * Chatbot Sync Admin API
 * Provides endpoints for managing chatbot content synchronization
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSyncStatus } from '@/lib/chatbot/supabase';
import { smartSyncSanityContent, printSyncSummary } from '@/lib/chatbot/smart-sync';

/**
 * GET - Get sync status and statistics
 */
export async function GET(request: NextRequest) {
  try {
    const status = await getSyncStatus();

    if (!status) {
      return NextResponse.json({
        error: 'Could not retrieve sync status',
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      status: {
        totalDocuments: status.totalDocuments || 0,
        totalChunks: status.totalChunks || 0,
        lastSync: status.lastSync,
        sourcesCount: status.sourcesCount || 0,
        sanityDocuments: status.sanityDocuments || 0,
        transcriptDocuments: status.transcriptDocuments || 0,
      },
    });
  } catch (error) {
    console.error('Error getting sync status:', error);

    return NextResponse.json({
      error: 'Failed to get sync status',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

/**
 * POST - Trigger manual sync
 */
export async function POST(request: NextRequest) {
  try {
    console.log('\n🔄 Manual sync triggered via admin dashboard...\n');

    const result = await smartSyncSanityContent();

    console.log('\n');
    printSyncSummary(result);
    console.log('');

    return NextResponse.json({
      success: true,
      result: {
        added: result.added,
        updated: result.updated,
        deleted: result.deleted,
        unchanged: result.unchanged,
        totalChunks: result.totalChunks,
        changes: result.changes,
      },
    });
  } catch (error) {
    console.error('❌ Error during manual sync:', error);

    return NextResponse.json({
      error: 'Failed to sync content',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
