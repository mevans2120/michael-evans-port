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
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          content: string
          embedding: number[]
          metadata: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          content?: string
          embedding?: number[]
          metadata?: Json
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
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
