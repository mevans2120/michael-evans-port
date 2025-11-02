/**
 * Admin API: Chat Logs
 * Endpoint to retrieve all chat logs for the admin dashboard
 *
 * Requires authentication via Bearer token in Authorization header
 */

import { NextResponse } from 'next/server';
import { getAllChatLogs } from '@/lib/chatbot/logging';
import { verifyAdminAuth, createUnauthorizedResponse } from '@/lib/auth/admin-auth';

export const runtime = 'edge';

export async function GET(request: Request) {
  // Verify authentication
  if (!verifyAdminAuth(request)) {
    return createUnauthorizedResponse();
  }

  try {
    // Get query parameters for filtering
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '100');

    const logs = await getAllChatLogs(limit);

    return NextResponse.json({
      success: true,
      logs,
      count: logs.length,
    });
  } catch (error) {
    console.error('Error fetching chat logs:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch chat logs',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
