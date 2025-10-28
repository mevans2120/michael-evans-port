/**
 * Sanity Webhook Handler
 * Automatically syncs content when changes are made in Sanity CMS
 *
 * Setup:
 * 1. Add SANITY_WEBHOOK_SECRET to environment variables
 * 2. Configure webhook in Sanity dashboard:
 *    - URL: https://your domain.com/api/webhooks/sanity
 *    - Dataset: production
 *    - Events: create, update, delete
 *    - Secret: (same as SANITY_WEBHOOK_SECRET)
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { syncSingleDocument, deleteSanityDocument, printSyncSummary } from '@/lib/chatbot/smart-sync';

/**
 * Verify Sanity webhook signature
 * Prevents unauthorized webhook calls
 */
function verifySignature(
  body: string,
  signature: string | null,
  secret: string
): boolean {
  if (!signature) {
    return false;
  }

  const computedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');

  return `sha256=${computedSignature}` === signature;
}

/**
 * Sanity webhook payload interface
 */
interface SanityWebhookPayload {
  _id: string;
  _type: string;
  _rev: string;
  slug?: {
    current: string;
  };
  title?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Step 1: Verify webhook secret exists
    const webhookSecret = process.env.SANITY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('SANITY_WEBHOOK_SECRET not configured');
      return NextResponse.json(
        { error: 'Webhook not configured' },
        { status: 500 }
      );
    }

    // Step 2: Read and parse request body
    const body = await request.text();
    const signature = request.headers.get('sanity-webhook-signature');

    // Step 3: Verify signature
    if (!verifySignature(body, signature, webhookSecret)) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const payload: SanityWebhookPayload = JSON.parse(body);

    console.log(`\n📨 Webhook received for: ${payload._type} (${payload._id})`);
    console.log(`   Title: ${payload.title || 'N/A'}`);
    console.log(`   Slug: ${payload.slug?.current || 'N/A'}\n`);

    // Step 4: Determine action based on document type and event
    // Note: Sanity webhooks don't explicitly send the event type in the payload,
    // but we can detect deletions by checking if the document exists when we fetch it
    const documentId = payload._id;
    const documentType = payload._type;

    // Only process documents we care about
    const supportedTypes = ['project', 'profile', 'aiProject'];

    if (!supportedTypes.includes(documentType)) {
      console.log(`   ⚠️  Document type '${documentType}' not supported for chatbot sync`);
      console.log('   → Supported types: project, profile, aiProject\n');

      return NextResponse.json({
        success: true,
        message: `Document type ${documentType} not supported for sync`,
      });
    }

    // Step 5: Sync the document
    console.log(`   🔄 Syncing ${documentType}...`);

    const result = await syncSingleDocument(documentId);

    console.log('\n');
    printSyncSummary(result);
    console.log('');

    // Step 6: Return success response
    return NextResponse.json({
      success: true,
      documentId,
      documentType,
      result: {
        added: result.added,
        updated: result.updated,
        deleted: result.deleted,
        unchanged: result.unchanged,
        totalChunks: result.totalChunks,
      },
    });
  } catch (error) {
    console.error('❌ Error processing webhook:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Handle GET requests (for webhook verification/testing)
 */
export async function GET() {
  return NextResponse.json({
    message: 'Sanity webhook endpoint is active',
    supportedTypes: ['project', 'profile', 'aiProject'],
    events: ['create', 'update', 'delete'],
    setup: {
      url: '/api/webhooks/sanity',
      method: 'POST',
      headers: {
        'sanity-webhook-signature': 'sha256=<computed_signature>',
      },
      envVar: 'SANITY_WEBHOOK_SECRET',
    },
  });
}
