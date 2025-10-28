/**
 * Chatbot Conversation Logging Service
 * Handles logging of all chatbot conversations to Supabase for analytics
 */

import { getSupabaseAdmin } from './supabase';

export interface ChatLogMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface ChatLogMetadata {
  ip_hash?: string;
  user_agent?: string;
  start_time: string;
  end_time?: string;
  duration_seconds?: number;
}

export interface ChatLogMetrics {
  total_messages: number;
  user_messages_count: number;
  assistant_messages_count: number;
  topics_discussed?: string[];
  off_topic_redirects_count?: number;
  avg_response_time?: number;
}

export interface ChatLog {
  id?: string;
  session_id: string;
  messages: ChatLogMessage[];
  metadata: ChatLogMetadata;
  metrics: ChatLogMetrics;
  created_at?: string;
  updated_at?: string;
}

/**
 * Hash IP address for privacy
 * Uses SHA-256 to create a one-way hash (Web Crypto API for edge runtime)
 */
async function hashIP(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Extract IP address from request headers
 * Handles various proxy headers (Vercel, Cloudflare, etc.)
 */
function getClientIP(request: Request): string | null {
  const headers = request.headers;

  // Try various headers in order of preference
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    // x-forwarded-for can be a comma-separated list, take the first one
    return forwardedFor.split(',')[0].trim();
  }

  const realIP = headers.get('x-real-ip');
  if (realIP) return realIP;

  const cfConnectingIP = headers.get('cf-connecting-ip');
  if (cfConnectingIP) return cfConnectingIP;

  return null;
}

/**
 * Initialize a new conversation log
 */
export async function logConversationStart(
  sessionId: string,
  request: Request
): Promise<ChatLog | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.error('Supabase admin client not available for logging');
    return null;
  }

  try {
    const clientIP = getClientIP(request);
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    const chatLog: Omit<ChatLog, 'id' | 'created_at' | 'updated_at'> = {
      session_id: sessionId,
      messages: [],
      metadata: {
        ip_hash: clientIP ? await hashIP(clientIP) : undefined,
        user_agent: userAgent,
        start_time: new Date().toISOString(),
      },
      metrics: {
        total_messages: 0,
        user_messages_count: 0,
        assistant_messages_count: 0,
        off_topic_redirects_count: 0,
      },
    };

    const { data, error } = await supabase
      .from('chat_logs')
      .insert(chatLog)
      .select()
      .single();

    if (error) {
      console.error('Error creating chat log:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in logConversationStart:', error);
    return null;
  }
}

/**
 * Append a message to an existing conversation log
 */
export async function logMessage(
  sessionId: string,
  message: ChatLogMessage,
  isOffTopicRedirect: boolean = false
): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.error('Supabase admin client not available for logging');
    return false;
  }

  try {
    // Get existing log
    const { data: existing, error: fetchError } = await supabase
      .from('chat_logs')
      .select('*')
      .eq('session_id', sessionId)
      .single();

    if (fetchError || !existing) {
      console.error('Error fetching chat log:', fetchError);
      return false;
    }

    // Append message
    const updatedMessages = [...existing.messages, message];

    // Update metrics
    const updatedMetrics = {
      ...existing.metrics,
      total_messages: updatedMessages.length,
      user_messages_count:
        existing.metrics.user_messages_count + (message.role === 'user' ? 1 : 0),
      assistant_messages_count:
        existing.metrics.assistant_messages_count + (message.role === 'assistant' ? 1 : 0),
      off_topic_redirects_count:
        (existing.metrics.off_topic_redirects_count || 0) + (isOffTopicRedirect ? 1 : 0),
    };

    // Update log
    const { error: updateError } = await supabase
      .from('chat_logs')
      .update({
        messages: updatedMessages,
        metrics: updatedMetrics,
      })
      .eq('session_id', sessionId);

    if (updateError) {
      console.error('Error updating chat log:', updateError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in logMessage:', error);
    return false;
  }
}

/**
 * Finalize a conversation log with end time and duration
 */
export async function logConversationEnd(sessionId: string): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.error('Supabase admin client not available for logging');
    return false;
  }

  try {
    // Get existing log
    const { data: existing, error: fetchError } = await supabase
      .from('chat_logs')
      .select('*')
      .eq('session_id', sessionId)
      .single();

    if (fetchError || !existing) {
      console.error('Error fetching chat log for finalization:', fetchError);
      return false;
    }

    const endTime = new Date();
    const startTime = new Date(existing.metadata.start_time);
    const durationSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);

    // Update metadata with end time and duration
    const updatedMetadata = {
      ...existing.metadata,
      end_time: endTime.toISOString(),
      duration_seconds: durationSeconds,
    };

    const { error: updateError } = await supabase
      .from('chat_logs')
      .update({
        metadata: updatedMetadata,
      })
      .eq('session_id', sessionId);

    if (updateError) {
      console.error('Error finalizing chat log:', updateError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in logConversationEnd:', error);
    return false;
  }
}

/**
 * Get all chat logs (for admin dashboard)
 */
export async function getAllChatLogs(limit: number = 100): Promise<ChatLog[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.error('Supabase admin client not available');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('chat_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching chat logs:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllChatLogs:', error);
    return [];
  }
}

/**
 * Get chat logs by date range
 */
export async function getChatLogsByDateRange(
  startDate: Date,
  endDate: Date
): Promise<ChatLog[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.error('Supabase admin client not available');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('chat_logs')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching chat logs by date:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getChatLogsByDateRange:', error);
    return [];
  }
}
