/**
 * Supabase Client for AI Chatbot
 * Handles vector database operations for RAG (Retrieval Augmented Generation)
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/lib/supabase/database.types';

// Type for our typed Supabase client
export type TypedSupabaseClient = SupabaseClient<Database>;

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Lazy initialization - only create client when needed
export const supabase = supabaseUrl && supabaseKey
  ? createClient<Database>(supabaseUrl, supabaseKey)
  : null;

// Service role client for admin operations (embedding insertion, etc.)
// Lazy initialization to ensure environment variables are loaded
let _supabaseAdmin: TypedSupabaseClient | null = null;

export function getSupabaseAdmin(): TypedSupabaseClient | null {
  if (_supabaseAdmin) return _supabaseAdmin;

  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!supabaseServiceKey || !url) {
    return null;
  }

  _supabaseAdmin = createClient<Database>(url, supabaseServiceKey);
  return _supabaseAdmin;
}

// For backwards compatibility
export const supabaseAdmin = getSupabaseAdmin();

/**
 * Database Types
 */

export interface PortfolioDocument {
  id: string;
  content: string;
  embedding: number[];
  metadata: {
    source: string; // 'resume', 'project', 'skill', 'personal', etc.
    category?: string;
    title?: string;
    date?: string;
    [key: string]: any;
  };
  content_hash: string | null;
  source_id: string | null;
  last_synced: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: string[]; // Document IDs used for this response
}

/**
 * Vector Search
 * Finds the most relevant documents for a given query embedding
 */

export async function searchSimilarDocuments(
  embedding: number[],
  matchCount: number = 5,
  matchThreshold: number = 0.7
): Promise<PortfolioDocument[]> {
  if (!supabase) {
    throw new Error('Supabase client not initialized. Missing environment variables: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  try {
    const { data, error } = await supabase.rpc('match_documents', {
      query_embedding: embedding,
      match_count: matchCount,
      match_threshold: matchThreshold,
    });

    if (error) {
      console.error('Error searching documents:', error);
      throw error;
    }

    return (data || []).map(doc => ({
      ...doc,
      metadata: doc.metadata as unknown as PortfolioDocument['metadata'],
      content_hash: null,
      source_id: null,
      last_synced: null,
    }));
  } catch (error) {
    console.error('Error in searchSimilarDocuments:', error);
    throw error;
  }
}

/**
 * Document Management
 */

export async function insertDocument(
  content: string,
  embedding: number[],
  metadata: PortfolioDocument['metadata'],
  contentHash?: string,
  sourceId?: string
): Promise<PortfolioDocument | null> {
  const admin = getSupabaseAdmin();
  if (!admin) {
    throw new Error('Supabase admin client not initialized. Service role key required.');
  }

  try {
    const { data, error} = await admin
      .from('documents')
      .insert({
        content,
        embedding,
        metadata,
        content_hash: contentHash,
        source_id: sourceId,
        last_synced: new Date().toISOString(),
      } as any)
      .select()
      .single();

    if (error) {
      console.error('Error inserting document:', error);
      throw error;
    }

    return {
      ...data,
      metadata: data.metadata as unknown as PortfolioDocument['metadata'],
    };
  } catch (error) {
    console.error('Error in insertDocument:', error);
    throw error;
  }
}

export async function insertDocuments(
  documents: Array<{
    content: string;
    embedding: number[];
    metadata: PortfolioDocument['metadata'];
    content_hash?: string;
    source_id?: string;
  }>
): Promise<PortfolioDocument[]> {
  const admin = getSupabaseAdmin();
  if (!admin) {
    throw new Error('Supabase admin client not initialized. Service role key required.');
  }

  try {
    const docsToInsert = documents.map(doc => ({
      ...doc,
      last_synced: new Date().toISOString(),
    }));

    const { data, error } = await admin
      .from('documents')
      .insert(docsToInsert as any)
      .select();

    if (error) {
      console.error('Error inserting documents:', error);
      throw error;
    }

    return (data || []).map(doc => ({
      ...doc,
      metadata: doc.metadata as unknown as PortfolioDocument['metadata'],
    }));
  } catch (error) {
    console.error('Error in insertDocuments:', error);
    throw error;
  }
}

/**
 * Upsert a single document (update if exists by source_id, insert if new)
 */
export async function upsertDocument(
  content: string,
  embedding: number[],
  metadata: PortfolioDocument['metadata'],
  contentHash: string,
  sourceId: string
): Promise<PortfolioDocument | null> {
  const admin = getSupabaseAdmin();
  if (!admin) {
    throw new Error('Supabase admin client not initialized. Service role key required.');
  }

  try {
    // First, check if document with this source_id exists
    const { data: existing } = await admin
      .from('documents')
      .select('*')
      .eq('source_id', sourceId)
      .single();

    if (existing) {
      // Update existing document
      const { data, error } = await admin
        .from('documents')
        .update({
          content,
          embedding,
          metadata,
          content_hash: contentHash,
          last_synced: new Date().toISOString(),
        } as any)
        .eq('source_id', sourceId)
        .select()
        .single();

      if (error) throw error;

      return {
        ...data,
        metadata: data.metadata as unknown as PortfolioDocument['metadata'],
      };
    } else {
      // Insert new document
      return await insertDocument(content, embedding, metadata, contentHash, sourceId);
    }
  } catch (error) {
    console.error('Error in upsertDocument:', error);
    throw error;
  }
}

/**
 * Find documents by source_id
 */
export async function findDocumentsBySourceId(sourceId: string): Promise<PortfolioDocument[]> {
  const admin = getSupabaseAdmin();
  if (!admin) {
    throw new Error('Supabase admin client not initialized. Service role key required.');
  }

  try {
    const { data, error } = await admin
      .from('documents')
      .select('*')
      .eq('source_id', sourceId);

    if (error) throw error;

    return (data || []).map(doc => ({
      ...doc,
      metadata: doc.metadata as unknown as PortfolioDocument['metadata'],
    }));
  } catch (error) {
    console.error('Error in findDocumentsBySourceId:', error);
    throw error;
  }
}

/**
 * Delete documents by source_id
 */
export async function deleteDocumentsBySourceId(sourceId: string): Promise<number> {
  const admin = getSupabaseAdmin();
  if (!admin) {
    throw new Error('Supabase admin client not initialized. Service role key required.');
  }

  try {
    const { data, error } = await admin
      .from('documents')
      .delete()
      .eq('source_id', sourceId)
      .select();

    if (error) throw error;

    return data?.length || 0;
  } catch (error) {
    console.error('Error in deleteDocumentsBySourceId:', error);
    throw error;
  }
}

/**
 * Get sync status summary
 */
export async function getSyncStatus(): Promise<{
  totalDocuments: number;
  totalChunks: number;
  lastSync: string | null;
  sourcesCount: number;
  sanityDocuments: number;
  transcriptDocuments: number;
} | null> {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }

  try {
    const { data, error } = await supabase.rpc('get_sync_status');

    if (error) throw error;

    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Error in getSyncStatus:', error);
    return null;
  }
}

export async function deleteAllDocuments(): Promise<void> {
  const admin = getSupabaseAdmin();
  if (!admin) {
    throw new Error('Supabase admin client not initialized. Service role key required.');
  }

  try {
    const { error } = await admin.from('documents').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    if (error) {
      console.error('Error deleting documents:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deleteAllDocuments:', error);
    throw error;
  }
}

/**
 * Chat Session Management
 */

export async function createChatSession(): Promise<ChatSession> {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }

  try {
    const { data, error } = await supabase
      .from('chat_sessions')
      .insert({
        messages: [],
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating chat session:', error);
      throw error;
    }

    return {
      ...data,
      messages: data.messages as unknown as ChatMessage[],
    };
  } catch (error) {
    console.error('Error in createChatSession:', error);
    throw error;
  }
}

export async function getChatSession(sessionId: string): Promise<ChatSession | null> {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }

  try {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (error) {
      console.error('Error getting chat session:', error);
      return null;
    }

    return data ? {
      ...data,
      messages: data.messages as unknown as ChatMessage[],
    } : null;
  } catch (error) {
    console.error('Error in getChatSession:', error);
    return null;
  }
}

export async function updateChatSession(
  sessionId: string,
  messages: ChatMessage[]
): Promise<ChatSession | null> {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }

  try {
    const { data, error } = await supabase
      .from('chat_sessions')
      .update({ messages: messages as any, updated_at: new Date().toISOString() })
      .eq('id', sessionId)
      .select()
      .single();

    if (error) {
      console.error('Error updating chat session:', error);
      throw error;
    }

    return {
      ...data,
      messages: data.messages as unknown as ChatMessage[],
    };
  } catch (error) {
    console.error('Error in updateChatSession:', error);
    throw error;
  }
}
