import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { verifyAdminAuth, createUnauthorizedResponse } from '../admin-auth';

describe('verifyAdminAuth', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Mock console.error to avoid cluttering test output
    vi.spyOn(console, 'error').mockImplementation(() => {});

    // Set up test environment
    process.env = { ...originalEnv };
    process.env.ADMIN_API_TOKEN = 'test-token-123';
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it('returns true for valid bearer token', () => {
    const request = new Request('http://localhost:3000/api/admin/test', {
      headers: {
        'Authorization': 'Bearer test-token-123'
      }
    });

    expect(verifyAdminAuth(request)).toBe(true);
  });

  it('returns false for missing authorization header', () => {
    const request = new Request('http://localhost:3000/api/admin/test');
    expect(verifyAdminAuth(request)).toBe(false);
  });

  it('returns false for invalid token', () => {
    const request = new Request('http://localhost:3000/api/admin/test', {
      headers: {
        'Authorization': 'Bearer wrong-token'
      }
    });

    expect(verifyAdminAuth(request)).toBe(false);
  });

  it('returns false for malformed authorization header (missing Bearer)', () => {
    const request = new Request('http://localhost:3000/api/admin/test', {
      headers: {
        'Authorization': 'invalid-format'
      }
    });

    expect(verifyAdminAuth(request)).toBe(false);
  });

  it('returns false for malformed authorization header (wrong auth type)', () => {
    const request = new Request('http://localhost:3000/api/admin/test', {
      headers: {
        'Authorization': 'Basic test-token-123'
      }
    });

    expect(verifyAdminAuth(request)).toBe(false);
  });

  it('returns false when ADMIN_API_TOKEN not configured', () => {
    delete process.env.ADMIN_API_TOKEN;

    const request = new Request('http://localhost:3000/api/admin/test', {
      headers: {
        'Authorization': 'Bearer any-token'
      }
    });

    expect(verifyAdminAuth(request)).toBe(false);
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('ADMIN_API_TOKEN not configured')
    );
  });

  it('handles empty token after Bearer', () => {
    const request = new Request('http://localhost:3000/api/admin/test', {
      headers: {
        'Authorization': 'Bearer '
      }
    });

    expect(verifyAdminAuth(request)).toBe(false);
  });

  it('is case-sensitive for "Bearer" keyword', () => {
    const request = new Request('http://localhost:3000/api/admin/test', {
      headers: {
        'Authorization': 'bearer test-token-123'  // lowercase
      }
    });

    expect(verifyAdminAuth(request)).toBe(false);
  });

  it('handles authorization header with extra spaces', () => {
    const request = new Request('http://localhost:3000/api/admin/test', {
      headers: {
        'Authorization': 'Bearer  test-token-123'  // extra space
      }
    });

    // The token would be ' test-token-123' with leading space, which won't match
    expect(verifyAdminAuth(request)).toBe(false);
  });
});

describe('createUnauthorizedResponse', () => {
  it('returns 401 status', async () => {
    const response = createUnauthorizedResponse();
    expect(response.status).toBe(401);
  });

  it('returns JSON content type', () => {
    const response = createUnauthorizedResponse();
    expect(response.headers.get('Content-Type')).toBe('application/json');
  });

  it('returns error JSON with correct structure', async () => {
    const response = createUnauthorizedResponse();
    const body = await response.json();

    expect(body).toHaveProperty('error');
    expect(body).toHaveProperty('message');
    expect(body.error).toBe('Unauthorized');
    expect(body.message).toBe('Valid authentication required');
  });

  it('creates a new Response instance each time', () => {
    const response1 = createUnauthorizedResponse();
    const response2 = createUnauthorizedResponse();

    expect(response1).not.toBe(response2);
  });
});
