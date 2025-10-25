-- AI Chatbot Database Schema for Supabase
-- Run this in your Supabase SQL Editor after enabling the vector extension

-- Enable the vector extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS vector;

-- Documents table: stores portfolio content chunks with embeddings
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  embedding VECTOR(768), -- Google text-embedding-004 produces 768-dimensional vectors
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat sessions table: stores conversation history
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  messages JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on embedding column for faster similarity search
CREATE INDEX IF NOT EXISTS documents_embedding_idx
ON documents
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Create index on metadata for filtering
CREATE INDEX IF NOT EXISTS documents_metadata_idx
ON documents
USING GIN (metadata);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to auto-update updated_at
DROP TRIGGER IF EXISTS update_documents_updated_at ON documents;
CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_chat_sessions_updated_at ON chat_sessions;
CREATE TRIGGER update_chat_sessions_updated_at
  BEFORE UPDATE ON chat_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Vector similarity search function
-- Finds documents similar to a query embedding
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding VECTOR(768),
  match_count INT DEFAULT 5,
  match_threshold FLOAT DEFAULT 0.7
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  embedding VECTOR(768),
  metadata JSONB,
  similarity FLOAT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    documents.id,
    documents.content,
    documents.embedding,
    documents.metadata,
    1 - (documents.embedding <=> query_embedding) AS similarity,
    documents.created_at,
    documents.updated_at
  FROM documents
  WHERE 1 - (documents.embedding <=> query_embedding) > match_threshold
  ORDER BY documents.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Row Level Security (RLS) Policies
-- Enable RLS on tables
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

-- Documents: Read access for all authenticated and anonymous users
CREATE POLICY "Documents are viewable by everyone"
  ON documents
  FOR SELECT
  USING (true);

-- Documents: Only service role can insert/update/delete
CREATE POLICY "Documents can only be modified by service role"
  ON documents
  FOR ALL
  USING (auth.role() = 'service_role');

-- Chat Sessions: Users can read and create their own sessions
CREATE POLICY "Users can view all chat sessions"
  ON chat_sessions
  FOR SELECT
  USING (true);

CREATE POLICY "Users can create chat sessions"
  ON chat_sessions
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update chat sessions"
  ON chat_sessions
  FOR UPDATE
  USING (true);

-- Helper function to get document count by source
CREATE OR REPLACE FUNCTION get_document_stats()
RETURNS TABLE (
  source TEXT,
  chunk_count BIGINT,
  total_characters BIGINT
)
LANGUAGE sql
AS $$
  SELECT
    metadata->>'source' AS source,
    COUNT(*) AS chunk_count,
    SUM(LENGTH(content)) AS total_characters
  FROM documents
  GROUP BY metadata->>'source'
  ORDER BY chunk_count DESC;
$$;

-- Comments for documentation
COMMENT ON TABLE documents IS 'Stores portfolio content chunks with vector embeddings for RAG';
COMMENT ON TABLE chat_sessions IS 'Stores conversation history for the AI chatbot';
COMMENT ON FUNCTION match_documents IS 'Finds documents similar to a query embedding using cosine similarity';
COMMENT ON FUNCTION get_document_stats IS 'Returns statistics about stored documents grouped by source';
