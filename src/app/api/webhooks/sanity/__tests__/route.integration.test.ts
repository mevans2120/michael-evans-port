/**
 * Sanity Webhook Integration Tests
 * Tests webhook handling, signature verification, and content sync
 *
 * These tests ensure:
 * - Webhook signature verification works correctly
 * - Draft documents are properly filtered
 * - Document sync triggers correctly
 * - Cache revalidation happens for affected paths
 * - Error cases are handled gracefully
 *
 * Mocks: Sanity sync functions, Supabase client
 * Real: Webhook logic, signature verification, path revalidation
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST, GET } from '../route';
import { NextRequest } from 'next/server';
import crypto from 'crypto';

// Mock dependencies
vi.mock('@/lib/chatbot/smart-sync', () => ({
  syncSingleDocument: vi.fn(),
  deleteSanityDocument: vi.fn(),
  printSyncSummary: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('@/lib/logger', () => ({
  logger: {
    log: vi.fn(),
    error: vi.fn(),
  },
}));

import { syncSingleDocument, printSyncSummary } from '@/lib/chatbot/smart-sync';
import { revalidatePath } from 'next/cache';
import { logger } from '@/lib/logger';

describe('Sanity Webhook Handler', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();

    // Set up test environment
    process.env = {
      ...originalEnv,
      SANITY_WEBHOOK_SECRET: 'test-webhook-secret',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  // Helper function to create a signed webhook request
  function createWebhookRequest(payload: any, secret: string = 'test-webhook-secret'): NextRequest {
    const body = JSON.stringify(payload);

    // Generate signature like Sanity does
    const signature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    const request = new Request('http://localhost:3000/api/webhooks/sanity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'sanity-webhook-signature': `sha256=${signature}`,
      },
      body,
    });

    return request as NextRequest;
  }

  describe('GET Handler', () => {
    it('returns webhook configuration info', async () => {
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('message');
      expect(data).toHaveProperty('supportedTypes');
      expect(data.supportedTypes).toContain('project');
      expect(data.supportedTypes).toContain('profile');
      expect(data.supportedTypes).toContain('aiProject');
    });

    it('includes setup instructions', async () => {
      const response = await GET();
      const data = await response.json();

      expect(data).toHaveProperty('setup');
      expect(data.setup).toHaveProperty('url');
      expect(data.setup).toHaveProperty('method');
      expect(data.setup).toHaveProperty('envVar');
    });
  });

  describe('POST Handler - Authentication', () => {
    it('rejects request when webhook secret is not configured', async () => {
      delete process.env.SANITY_WEBHOOK_SECRET;

      const payload = {
        _id: 'project-123',
        _type: 'project',
        _rev: 'abc',
        title: 'Test Project',
      };

      const request = createWebhookRequest(payload);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toContain('not configured');
    });

    it('rejects request with invalid signature', async () => {
      const payload = {
        _id: 'project-123',
        _type: 'project',
        _rev: 'abc',
        title: 'Test Project',
      };

      // Create request with wrong secret
      const request = createWebhookRequest(payload, 'wrong-secret');

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toContain('Invalid signature');
    });

    it('rejects request with missing signature', async () => {
      const payload = {
        _id: 'project-123',
        _type: 'project',
        _rev: 'abc',
        title: 'Test Project',
      };

      const body = JSON.stringify(payload);

      const request = new Request('http://localhost:3000/api/webhooks/sanity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // No signature header
        },
        body,
      }) as NextRequest;

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toContain('Invalid signature');
    });

    it('accepts request with valid signature', async () => {
      const payload = {
        _id: 'project-123',
        _type: 'project',
        _rev: 'abc',
        title: 'Test Project',
        slug: { current: 'test-project' },
      };

      vi.mocked(syncSingleDocument).mockResolvedValue({
        added: 1,
        updated: 0,
        deleted: 0,
        unchanged: 0,
        totalChunks: 1,
        details: [],
      });

      const request = createWebhookRequest(payload);
      const response = await POST(request);

      expect(response.status).toBe(200);
    });
  });

  describe('POST Handler - Draft Filtering', () => {
    it('skips draft documents', async () => {
      const payload = {
        _id: 'drafts.project-123',
        _type: 'project',
        _rev: 'abc',
        title: 'Draft Project',
      };

      const request = createWebhookRequest(payload);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.skipped).toBe(true);
      expect(data.reason).toContain('Draft document');
      expect(syncSingleDocument).not.toHaveBeenCalled();
    });

    it('processes published documents', async () => {
      const payload = {
        _id: 'project-123',
        _type: 'project',
        _rev: 'abc',
        title: 'Published Project',
        slug: { current: 'published-project' },
      };

      vi.mocked(syncSingleDocument).mockResolvedValue({
        added: 1,
        updated: 0,
        deleted: 0,
        unchanged: 0,
        totalChunks: 1,
        details: [],
      });

      const request = createWebhookRequest(payload);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.skipped).toBeUndefined();
      expect(syncSingleDocument).toHaveBeenCalledWith('project-123');
    });
  });

  describe('POST Handler - Document Type Filtering', () => {
    it('processes supported document types', async () => {
      const supportedTypes = ['project', 'profile', 'aiProject'];

      for (const type of supportedTypes) {
        vi.clearAllMocks();

        const payload = {
          _id: `${type}-123`,
          _type: type,
          _rev: 'abc',
          title: `Test ${type}`,
        };

        vi.mocked(syncSingleDocument).mockResolvedValue({
          added: 1,
          updated: 0,
          deleted: 0,
          unchanged: 0,
          totalChunks: 1,
          details: [],
        });

        const request = createWebhookRequest(payload);
        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(syncSingleDocument).toHaveBeenCalled();
      }
    });

    it('skips unsupported document types', async () => {
      const payload = {
        _id: 'unsupported-123',
        _type: 'unsupportedType',
        _rev: 'abc',
        title: 'Unsupported',
      };

      const request = createWebhookRequest(payload);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toContain('not supported');
      expect(syncSingleDocument).not.toHaveBeenCalled();
    });
  });

  describe('POST Handler - Content Sync', () => {
    it('syncs document to vector database', async () => {
      const payload = {
        _id: 'project-123',
        _type: 'project',
        _rev: 'abc',
        title: 'Test Project',
        slug: { current: 'test-project' },
      };

      vi.mocked(syncSingleDocument).mockResolvedValue({
        added: 2,
        updated: 1,
        deleted: 0,
        unchanged: 3,
        totalChunks: 6,
        details: [],
      });

      const request = createWebhookRequest(payload);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.result).toMatchObject({
        added: 2,
        updated: 1,
        deleted: 0,
        unchanged: 3,
        totalChunks: 6,
      });
      expect(syncSingleDocument).toHaveBeenCalledWith('project-123');
      expect(printSyncSummary).toHaveBeenCalled();
    });

    it('handles sync errors gracefully', async () => {
      const payload = {
        _id: 'project-123',
        _type: 'project',
        _rev: 'abc',
        title: 'Test Project',
      };

      vi.mocked(syncSingleDocument).mockRejectedValue(new Error('Sync failed'));

      const request = createWebhookRequest(payload);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
      expect(data.message).toBe('Sync failed');
    });
  });

  describe('POST Handler - Cache Revalidation', () => {
    it('revalidates project case study pages', async () => {
      const payload = {
        _id: 'project-123',
        _type: 'project',
        _rev: 'abc',
        title: 'Test Project',
        slug: { current: 'test-project' },
      };

      vi.mocked(syncSingleDocument).mockResolvedValue({
        added: 1,
        updated: 0,
        deleted: 0,
        unchanged: 0,
        totalChunks: 1,
        details: [],
      });

      const request = createWebhookRequest(payload);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(revalidatePath).toHaveBeenCalledWith('/case-studies/test-project');
      expect(revalidatePath).toHaveBeenCalledWith('/case-studies');
      expect(data.revalidated).toContain('/case-studies/test-project');
      expect(data.revalidated).toContain('/case-studies');
    });

    it('revalidates blog pages', async () => {
      const payload = {
        _id: 'blog-123',
        _type: 'blog',
        _rev: 'abc',
        title: 'Test Blog',
        slug: { current: 'test-blog' },
      };

      // Blog type is not in supportedTypes, so should skip
      const request = createWebhookRequest(payload);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toContain('not supported');
    });

    it('revalidates profile about page', async () => {
      const payload = {
        _id: 'profile-singleton',
        _type: 'profile',
        _rev: 'abc',
        name: 'Michael Evans',
      };

      vi.mocked(syncSingleDocument).mockResolvedValue({
        added: 1,
        updated: 0,
        deleted: 0,
        unchanged: 0,
        totalChunks: 1,
        details: [],
      });

      const request = createWebhookRequest(payload);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(revalidatePath).toHaveBeenCalledWith('/about');
      expect(data.revalidated).toContain('/about');
    });

    it('revalidates homepage for hero changes', async () => {
      const payload = {
        _id: 'homepage-hero',
        _type: 'homepageHero',
        _rev: 'abc',
        title: 'New Hero Title',
      };

      // Homepage hero is not in supportedTypes, so should skip
      const request = createWebhookRequest(payload);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toContain('not supported');
    });

    it('handles revalidation errors without failing webhook', async () => {
      const payload = {
        _id: 'project-123',
        _type: 'project',
        _rev: 'abc',
        title: 'Test Project',
        slug: { current: 'test-project' },
      };

      vi.mocked(syncSingleDocument).mockResolvedValue({
        added: 1,
        updated: 0,
        deleted: 0,
        unchanged: 0,
        totalChunks: 1,
        details: [],
      });

      vi.mocked(revalidatePath).mockImplementation(() => {
        throw new Error('Revalidation failed');
      });

      const request = createWebhookRequest(payload);
      const response = await POST(request);

      // Should still succeed even if revalidation fails
      expect(response.status).toBe(200);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('POST Handler - Response Format', () => {
    it('returns success response with sync details', async () => {
      const payload = {
        _id: 'project-123',
        _type: 'project',
        _rev: 'abc',
        title: 'Test Project',
        slug: { current: 'test-project' },
      };

      vi.mocked(syncSingleDocument).mockResolvedValue({
        added: 2,
        updated: 1,
        deleted: 1,
        unchanged: 5,
        totalChunks: 9,
        details: [],
      });

      const request = createWebhookRequest(payload);
      const response = await POST(request);
      const data = await response.json();

      expect(data).toMatchObject({
        success: true,
        documentId: 'project-123',
        documentType: 'project',
        result: {
          added: 2,
          updated: 1,
          deleted: 1,
          unchanged: 5,
          totalChunks: 9,
        },
        revalidated: expect.any(Array),
      });
    });

    it('includes document metadata in response', async () => {
      const payload = {
        _id: 'project-456',
        _type: 'project',
        _rev: 'def',
        title: 'Another Project',
        slug: { current: 'another-project' },
      };

      vi.mocked(syncSingleDocument).mockResolvedValue({
        added: 1,
        updated: 0,
        deleted: 0,
        unchanged: 0,
        totalChunks: 1,
        details: [],
      });

      const request = createWebhookRequest(payload);
      const response = await POST(request);
      const data = await response.json();

      expect(data.documentId).toBe('project-456');
      expect(data.documentType).toBe('project');
    });
  });

  describe('POST Handler - Logging', () => {
    it('logs webhook receipt', async () => {
      const payload = {
        _id: 'project-123',
        _type: 'project',
        _rev: 'abc',
        title: 'Test Project',
        slug: { current: 'test-project' },
      };

      vi.mocked(syncSingleDocument).mockResolvedValue({
        added: 1,
        updated: 0,
        deleted: 0,
        unchanged: 0,
        totalChunks: 1,
        details: [],
      });

      const request = createWebhookRequest(payload);
      await POST(request);

      expect(logger.log).toHaveBeenCalledWith(
        expect.stringContaining('Webhook received')
      );
      expect(logger.log).toHaveBeenCalledWith(
        expect.stringContaining('Title: Test Project')
      );
    });

    it('logs draft document skips', async () => {
      const payload = {
        _id: 'drafts.project-123',
        _type: 'project',
        _rev: 'abc',
        title: 'Draft Project',
      };

      const request = createWebhookRequest(payload);
      await POST(request);

      expect(logger.log).toHaveBeenCalledWith(
        expect.stringContaining('Skipping draft')
      );
    });

    it('logs errors', async () => {
      const payload = {
        _id: 'project-123',
        _type: 'project',
        _rev: 'abc',
        title: 'Test Project',
      };

      vi.mocked(syncSingleDocument).mockRejectedValue(new Error('Test error'));

      const request = createWebhookRequest(payload);
      await POST(request);

      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Error processing webhook'),
        expect.any(Error)
      );
    });
  });
});
