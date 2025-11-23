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

import { type NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';
import { syncSingleDocument, printSyncSummary } from '@/lib/chatbot/smart-sync';
import { logger } from '@/lib/logger';

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
 * Check if document is a draft
 * Drafts have IDs that start with "drafts."
 */
function isDraft(documentId: string): boolean {
  return documentId.startsWith('drafts.');
}

/**
 * Revalidate paths based on document type
 * Smart, targeted revalidation - only revalidates affected paths
 */
async function revalidateForDocument(
  documentType: string,
  slug?: string
): Promise<string[]> {
  const revalidatedPaths: string[] = [];

  try {
    switch (documentType) {
      // Case Studies (project documents with slugs)
      case 'project':
        if (slug) {
          // Revalidate the specific case study page
          revalidatePath(`/case-studies/${slug}`);
          revalidatedPaths.push(`/case-studies/${slug}`);
        }
        // Always revalidate the case studies listing page
        revalidatePath('/case-studies');
        revalidatedPaths.push('/case-studies');
        break;

      // Blog Posts (if you have blog functionality)
      case 'blog':
        if (slug) {
          revalidatePath(`/blog/${slug}`);
          revalidatedPaths.push(`/blog/${slug}`);
        }
        revalidatePath('/blog');
        revalidatedPaths.push('/blog');
        break;

      // Profile (singleton - only one profile page)
      case 'profile':
        revalidatePath('/about');
        revalidatedPaths.push('/about');
        break;

      // Homepage Hero (singleton)
      case 'homepageHero':
        revalidatePath('/');
        revalidatedPaths.push('/');
        break;

      // Contact Page (singleton)
      case 'contactPage':
        revalidatePath('/contact');
        revalidatedPaths.push('/contact');
        break;

      // Footer (appears on all pages - revalidate main pages)
      case 'footer': {
        const mainPages = ['/', '/case-studies', '/about', '/contact'];
        for (const path of mainPages) {
          revalidatePath(path);
          revalidatedPaths.push(path);
        }
        break;
      }

      // SEO Settings (global - revalidate all main pages)
      case 'siteSettings':
      case 'seoSettings': {
        const allPages = ['/', '/case-studies', '/about', '/contact'];
        for (const path of allPages) {
          revalidatePath(path);
          revalidatedPaths.push(path);
        }
        break;
      }

      default:
        logger.log(`   ℹ️  No revalidation rules defined for type: ${documentType}`);
    }
  } catch (error) {
    logger.error(`   ❌ Error during revalidation:`, error);
    // Don't throw - revalidation failures shouldn't break the webhook
  }

  return revalidatedPaths;
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
      logger.error('SANITY_WEBHOOK_SECRET not configured');
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
      logger.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const payload: SanityWebhookPayload = JSON.parse(body);

    logger.log(`\n📨 Webhook received for: ${payload._type} (${payload._id})`);
    logger.log(`   Title: ${payload.title || 'N/A'}`);
    logger.log(`   Slug: ${payload.slug?.current || 'N/A'}`);

    // Step 4: Check if this is a draft document
    if (isDraft(payload._id)) {
      logger.log(`   ⏭️  Skipping draft document (not published yet)\n`);

      return NextResponse.json({
        success: true,
        skipped: true,
        reason: 'Draft document - only published content is processed',
        documentId: payload._id,
      });
    }

    logger.log(`   ✅ Published document - processing...\n`);

    // Step 5: Determine action based on document type and event
    // Note: Sanity webhooks don't explicitly send the event type in the payload,
    // but we can detect deletions by checking if the document exists when we fetch it
    const documentId = payload._id;
    const documentType = payload._type;

    // Only process documents we care about
    const supportedTypes = ['project', 'profile', 'aiProject'];

    if (!supportedTypes.includes(documentType)) {
      logger.log(`   ⚠️  Document type '${documentType}' not supported for chatbot sync`);
      logger.log('   → Supported types: project, profile, aiProject\n');

      return NextResponse.json({
        success: true,
        message: `Document type ${documentType} not supported for sync`,
      });
    }

    // Step 6: Sync the document
    logger.log(`   🔄 Syncing ${documentType}...`);

    const result = await syncSingleDocument(documentId);

    logger.log('\n');
    printSyncSummary(result);
    logger.log('');

    // Step 7: Revalidate cache for affected pages
    logger.log(`   🔄 Revalidating cache...`);
    const revalidatedPaths = await revalidateForDocument(
      documentType,
      payload.slug?.current
    );

    if (revalidatedPaths.length > 0) {
      logger.log(`   ✅ Revalidated ${revalidatedPaths.length} path(s):`);
      revalidatedPaths.forEach(path => logger.log(`      - ${path}`));
    } else {
      logger.log(`   ℹ️  No paths revalidated for this document type`);
    }
    logger.log('');

    // Step 8: Return success response
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
      revalidated: revalidatedPaths,
    });
  } catch (error) {
    logger.error('❌ Error processing webhook:', error);

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
