/**
 * Admin API Authentication Utility
 *
 * Provides Bearer token authentication for admin API routes.
 * Uses ADMIN_API_TOKEN environment variable for validation.
 */

/**
 * Verifies admin authentication from request headers
 *
 * @param request - The incoming HTTP request
 * @returns true if authenticated, false otherwise
 *
 * @example
 * ```typescript
 * export async function GET(request: Request) {
 *   if (!verifyAdminAuth(request)) {
 *     return createUnauthorizedResponse();
 *   }
 *   // ... handle authenticated request
 * }
 * ```
 */
export function verifyAdminAuth(request: Request): boolean {
  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
    return false;
  }

  // Check for Bearer token format
  const [type, token] = authHeader.split(' ');

  if (type !== 'Bearer') {
    return false;
  }

  // Compare with environment variable
  const validToken = process.env.ADMIN_API_TOKEN;

  if (!validToken) {
    console.error('[AUTH] ADMIN_API_TOKEN not configured in environment');
    return false;
  }

  return token === validToken;
}

/**
 * Creates a standardized 401 Unauthorized response
 *
 * @returns Response object with 401 status and error JSON
 */
export function createUnauthorizedResponse(): Response {
  return new Response(
    JSON.stringify({
      error: 'Unauthorized',
      message: 'Valid authentication required'
    }),
    {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}
