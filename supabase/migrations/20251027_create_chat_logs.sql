-- Create chat_logs table for tracking all chatbot conversations
CREATE TABLE IF NOT EXISTS chat_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID UNIQUE NOT NULL,
    messages JSONB NOT NULL DEFAULT '[]'::jsonb,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    metrics JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_chat_logs_session_id ON chat_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_logs_created_at ON chat_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_logs_updated_at ON chat_logs(updated_at DESC);

-- Add comment explaining the table
COMMENT ON TABLE chat_logs IS 'Stores complete chatbot conversation logs with metadata and metrics for analytics';

-- Add column comments for clarity
COMMENT ON COLUMN chat_logs.session_id IS 'Unique identifier for this conversation session';
COMMENT ON COLUMN chat_logs.messages IS 'Array of message objects with role, content, and timestamp';
COMMENT ON COLUMN chat_logs.metadata IS 'Session metadata: ip_hash, user_agent, start_time, end_time, duration_seconds';
COMMENT ON COLUMN chat_logs.metrics IS 'Conversation metrics: message counts, topics, off_topic_redirects, avg_response_time';

-- Enable Row Level Security (RLS)
ALTER TABLE chat_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public insert (anonymous users can log conversations)
CREATE POLICY "Allow public insert" ON chat_logs
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Policy: Allow public update (to append messages to existing sessions)
CREATE POLICY "Allow public update" ON chat_logs
    FOR UPDATE
    TO anon
    USING (true)
    WITH CHECK (true);

-- Policy: Only authenticated users (admins) can read all logs
CREATE POLICY "Admins can read all logs" ON chat_logs
    FOR SELECT
    TO authenticated
    USING (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_chat_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function before update
DROP TRIGGER IF EXISTS trigger_update_chat_logs_updated_at ON chat_logs;
CREATE TRIGGER trigger_update_chat_logs_updated_at
    BEFORE UPDATE ON chat_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_chat_logs_updated_at();
