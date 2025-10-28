/**
 * Supabase Database Types
 * Generated based on chat_logs table schema
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      chat_logs: {
        Row: {
          id: string
          session_id: string
          messages: Json
          metadata: Json
          metrics: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          session_id: string
          messages: Json
          metadata: Json
          metrics: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          messages?: Json
          metadata?: Json
          metrics?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          id: string
          content: string
          embedding: number[]
          metadata: Json
          content_hash: string | null
          source_id: string | null
          last_synced: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          content: string
          embedding: number[]
          metadata: Json
          content_hash?: string | null
          source_id?: string | null
          last_synced?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          content?: string
          embedding?: number[]
          metadata?: Json
          content_hash?: string | null
          source_id?: string | null
          last_synced?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      chat_sessions: {
        Row: {
          id: string
          messages: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          messages: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          messages?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      match_documents: {
        Args: {
          query_embedding: number[]
          match_count?: number
          match_threshold?: number
        }
        Returns: Array<{
          id: string
          content: string
          embedding: number[]
          metadata: Json
          created_at: string
          updated_at: string
          similarity?: number
        }>
      }
      get_sync_status: {
        Args: Record<string, never>
        Returns: Array<{
          totalDocuments: number
          totalChunks: number
          lastSync: string | null
          sourcesCount: number
          sanityDocuments: number
          transcriptDocuments: number
        }>
      }
      get_document_stats: {
        Args: Record<string, never>
        Returns: Array<{
          source: string
          chunk_count: number
          total_characters: number
          last_updated: string | null
          unique_source_ids: number
        }>
      }
      find_documents_by_source_id: {
        Args: {
          p_source_id: string
        }
        Returns: Array<{
          id: string
          content: string
          content_hash: string | null
          metadata: Json
          created_at: string
          updated_at: string
          last_synced: string | null
        }>
      }
      delete_documents_by_source_id: {
        Args: {
          p_source_id: string
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
