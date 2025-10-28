-- Migration: Add Content Tracking for Smart Updates
-- Date: 2025-10-28
-- Purpose: Add fields to support incremental content updates and change detection

-- Add new columns to documents table for content tracking
ALTER TABLE documents
ADD COLUMN IF NOT EXISTS content_hash TEXT,
ADD COLUMN IF NOT EXISTS source_id TEXT,
ADD COLUMN IF NOT EXISTS last_synced TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create index on source_id for fast lookups when updating specific documents
CREATE INDEX IF NOT EXISTS documents_source_id_idx ON documents(source_id);

-- Create index on content_hash for detecting duplicates
CREATE INDEX IF NOT EXISTS documents_content_hash_idx ON documents(content_hash);

-- Create composite index for source + hash lookups
CREATE INDEX IF NOT EXISTS documents_source_hash_idx ON documents(source_id, content_hash);

-- Drop the existing function first (it has a different return type)
DROP FUNCTION IF EXISTS get_document_stats();

-- Create the updated get_document_stats function with new tracking info
CREATE FUNCTION get_document_stats()
RETURNS TABLE (
  source TEXT,
  chunk_count BIGINT,
  total_characters BIGINT,
  last_updated TIMESTAMP WITH TIME ZONE,
  unique_source_ids BIGINT
)
LANGUAGE sql
AS $$
  SELECT
    metadata->>'source' AS source,
    COUNT(*) AS chunk_count,
    SUM(LENGTH(content)) AS total_characters,
    MAX(last_synced) AS last_updated,
    COUNT(DISTINCT source_id) AS unique_source_ids
  FROM documents
  GROUP BY metadata->>'source'
  ORDER BY chunk_count DESC;
$$;

-- Create function to find documents by source_id
DROP FUNCTION IF EXISTS find_documents_by_source_id(TEXT);
CREATE FUNCTION find_documents_by_source_id(
  p_source_id TEXT
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  content_hash TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  last_synced TIMESTAMP WITH TIME ZONE
)
LANGUAGE sql
AS $$
  SELECT
    id,
    content,
    content_hash,
    metadata,
    created_at,
    updated_at,
    last_synced
  FROM documents
  WHERE source_id = p_source_id;
$$;

-- Create function to delete documents by source_id
DROP FUNCTION IF EXISTS delete_documents_by_source_id(TEXT);
CREATE FUNCTION delete_documents_by_source_id(
  p_source_id TEXT
)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM documents
  WHERE source_id = p_source_id;

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

-- Create function to get sync status summary
DROP FUNCTION IF EXISTS get_sync_status();
CREATE FUNCTION get_sync_status()
RETURNS TABLE (
  total_documents BIGINT,
  total_chunks BIGINT,
  last_sync TIMESTAMP WITH TIME ZONE,
  sources_count BIGINT,
  sanity_documents BIGINT,
  transcript_documents BIGINT
)
LANGUAGE sql
AS $$
  SELECT
    COUNT(DISTINCT source_id) AS total_documents,
    COUNT(*) AS total_chunks,
    MAX(last_synced) AS last_sync,
    COUNT(DISTINCT metadata->>'source') AS sources_count,
    COUNT(*) FILTER (WHERE metadata->>'source' LIKE 'sanity%') AS sanity_documents,
    COUNT(*) FILTER (WHERE metadata->>'source' NOT LIKE 'sanity%') AS transcript_documents
  FROM documents;
$$;

-- Comments for documentation
COMMENT ON COLUMN documents.content_hash IS 'SHA-256 hash of content for change detection';
COMMENT ON COLUMN documents.source_id IS 'Original document ID from source system (e.g., Sanity _id)';
COMMENT ON COLUMN documents.last_synced IS 'Timestamp of when this document was last synchronized';
COMMENT ON FUNCTION find_documents_by_source_id IS 'Finds all chunks belonging to a specific source document';
COMMENT ON FUNCTION delete_documents_by_source_id IS 'Deletes all chunks for a specific source document, returns count';
COMMENT ON FUNCTION get_sync_status IS 'Returns overall synchronization status and statistics';
