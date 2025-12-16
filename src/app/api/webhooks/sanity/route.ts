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
import { revalidatePath, revalidateTag } from 'next/cache';
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
    console.log('DEBUG: No signature header received');
    return false;
  }

  const computedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');

  const expected = `sha256=${computedSignature}`;

  // DEBUG logging - remove after fixing
  console.log('DEBUG Webhook Signature Check:');
  console.log('  Received signature:', signature);
  console.log('  Computed signature:', expected);
  console.log('  Secret length:', secret.length);
  console.log('  Body length:', body.length);
  console.log('  Match:', expected === signature);

  return expected === signature;
}

/**
 * Check if document is a draft
 * Drafts have IDs that start with "drafts."
 */
function isDraft(documentId: string): boolean {
  return documentId.startsWith('drafts.');
}

/**
 * Revalidate paths and tags based on document type
 * Smart, targeted revalidation - only revalidates affected paths/tags
 */
async function revalidateForDocument(
  documentType: string,
  slug?: string
): Promise<{ paths: string[]; tags: string[] }> {
  const revalidatedPaths: string[] = [];
  const revalidatedTags: string[] = [];

  try {
    // Always revalidate the global 'sanity' tag for any content change
    revalidateTag('sanity');
    revalidatedTags.push('sanity');

    switch (documentType) {
      // Case Studies (project documents with slugs)
      case 'project':
        if (slug) {
          // Revalidate the specific case study page
          revalidatePath(`/case-studies/${slug}`);
          revalidatedPaths.push(`/case-studies/${slug}`);
          // Revalidate specific tag for this case study
          revalidateTag(`case-study-${slug}`);
          revalidatedTags.push(`case-study-${slug}`);
        }
        // Always revalidate the case studies listing and related tags
        revalidatePath('/case-studies');
        revalidatedPaths.push('/case-studies');
        revalidateTag('case-studies');
        revalidatedTags.push('case-studies');
        // Case studies also appear on homepage
        revalidateTag('homepage');
        revalidatedTags.push('homepage');
        break;

      // Blog Posts
      case 'blog':
        if (slug) {
          revalidatePath(`/blog/${slug}`);
          revalidatedPaths.push(`/blog/${slug}`);
          revalidateTag(`blog-${slug}`);
          revalidatedTags.push(`blog-${slug}`);
        }
        revalidatePath('/blog');
        revalidatedPaths.push('/blog');
        revalidateTag('blog');
        revalidatedTags.push('blog');
        // Blog posts also appear on homepage
        revalidateTag('homepage');
        revalidatedTags.push('homepage');
        break;

      // Profile (singleton - only one profile page)
      case 'profile':
        revalidatePath('/about');
        revalidatedPaths.push('/about');
        revalidateTag('profile');
        revalidatedTags.push('profile');
        break;

      // Homepage Hero (singleton)
      case 'homepageHero':
        revalidatePath('/');
        revalidatedPaths.push('/');
        revalidateTag('homepage');
        revalidatedTags.push('homepage');
        break;

      // Contact Page (singleton)
      case 'contactPage':
        revalidatePath('/contact');
        revalidatedPaths.push('/contact');
        revalidateTag('contact');
        revalidatedTags.push('contact');
        break;

      // Footer (appears on all pages)
      case 'footer': {
        const mainPages = ['/', '/case-studies', '/about', '/contact', '/blog'];
        for (const path of mainPages) {
          revalidatePath(path);
          revalidatedPaths.push(path);
        }
        revalidateTag('footer');
        revalidatedTags.push('footer');
        break;
      }

      // Blog index page settings
      case 'blogIndexPage':
        revalidatePath('/blog');
        revalidatedPaths.push('/blog');
        revalidateTag('blog');
        revalidatedTags.push('blog');
        break;

      // Case studies index page settings
      case 'caseStudiesIndexPage':
        revalidatePath('/case-studies');
        revalidatedPaths.push('/case-studies');
        revalidateTag('case-studies');
        revalidatedTags.push('case-studies');
        break;

      // SEO Settings (global - revalidate all main pages)
      case 'siteSettings':
      case 'seoSettings': {
        const allPages = ['/', '/case-studies', '/about', '/contact', '/blog'];
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

  return { paths: revalidatedPaths, tags: revalidatedTags };
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
    const computedSig = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');
    const expectedSig = `sha256=${computedSig}`;

    if (!verifySignature(body, signature, webhookSecret)) {
      logger.error('Invalid webhook signature');
      // DEBUG: Return detailed info in response for diagnosis
      return NextResponse.json(
        {
          error: 'Invalid signature',
          debug: {
            receivedSignature: signature,
            expectedSignature: expectedSig,
            receivedLength: signature?.length || 0,
            expectedLength: expectedSig.length,
            secretLength: webhookSecret.length,
            bodyLength: body.length,
            bodyPreview: body.substring(0, 100) + '...',
          }
        },
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

    const documentId = payload._id;
    const documentType = payload._type;

    // Step 5: Revalidate cache for affected pages and tags
    // This runs for ALL document types that have revalidation rules
    logger.log(`   🔄 Revalidating cache...`);
    const { paths: revalidatedPaths, tags: revalidatedTags } = await revalidateForDocument(
      documentType,
      payload.slug?.current
    );

    if (revalidatedPaths.length > 0) {
      logger.log(`   ✅ Revalidated ${revalidatedPaths.length} path(s):`);
      revalidatedPaths.forEach(path => logger.log(`      - ${path}`));
    }
    if (revalidatedTags.length > 0) {
      logger.log(`   ✅ Revalidated ${revalidatedTags.length} tag(s):`);
      revalidatedTags.forEach(tag => logger.log(`      - ${tag}`));
    }
    if (revalidatedPaths.length === 0 && revalidatedTags.length === 0) {
      logger.log(`   ℹ️  No paths/tags revalidated for this document type`);
    }
    logger.log('');

    // Step 6: Sync to chatbot vector database (only for supported types)
    // Blog posts don't need chatbot sync, just cache revalidation
    const chatbotSyncTypes = ['project', 'profile', 'aiProject'];
    let syncResult = null;

    if (chatbotSyncTypes.includes(documentType)) {
      logger.log(`   🔄 Syncing ${documentType} to chatbot...`);
      syncResult = await syncSingleDocument(documentId);
      logger.log('\n');
      printSyncSummary(syncResult);
      logger.log('');
    } else {
      logger.log(`   ⏭️  Skipping chatbot sync (not needed for ${documentType})\n`);
    }

    // Step 7: Return success response
    return NextResponse.json({
      success: true,
      documentId,
      documentType,
      ...(syncResult && {
        chatbotSync: {
          added: syncResult.added,
          updated: syncResult.updated,
          deleted: syncResult.deleted,
          unchanged: syncResult.unchanged,
          totalChunks: syncResult.totalChunks,
        },
      }),
      revalidated: {
        paths: revalidatedPaths,
        tags: revalidatedTags,
      },
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
    cacheRevalidation: ['blog', 'project', 'profile', 'homepageHero', 'contactPage', 'footer', 'blogIndexPage', 'caseStudiesIndexPage', 'siteSettings', 'seoSettings'],
    chatbotSync: ['project', 'profile', 'aiProject'],
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
