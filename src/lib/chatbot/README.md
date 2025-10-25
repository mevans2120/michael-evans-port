# AI Chatbot Library

This directory contains the core utilities for the RAG-powered AI chatbot.

## Files

### `supabase.ts`
Supabase client and database operations.

**Exports:**
- `supabase` - Client for public operations
- `supabaseAdmin` - Client with service role (admin)
- `searchSimilarDocuments()` - Vector similarity search
- `insertDocument()`, `insertDocuments()` - Add content to database
- `createChatSession()`, `getChatSession()`, `updateChatSession()` - Session management

### `embeddings.ts`
Text processing and embedding generation.

**Exports:**
- `chunkText()` - Split text into chunks
- `generateEmbedding()` - Single text → embedding
- `generateEmbedding()` - Multiple texts → embeddings
- `processDocument()` - Document → chunks with embeddings
- `cosineSimilarity()` - Calculate similarity between vectors

### `database-schema.sql`
SQL schema for Supabase database.

**Tables:**
- `documents` - Content chunks with vector embeddings
- `chat_sessions` - Conversation history

**Functions:**
- `match_documents()` - Similarity search
- `get_document_stats()` - Analytics

**Run this in Supabase SQL Editor after creating your project.**

### `ingest-content.ts`
Script to load your portfolio content into the database.

**Usage:**
```bash
# Add to package.json:
"ingest": "tsx src/lib/chatbot/ingest-content.ts"

# Then run:
npm run ingest

# Or to clear existing data first:
npm run ingest -- --clear
```

**Prerequisites:**
1. API keys set in `.env.local`
2. Database schema created in Supabase
3. Transcripts in `docs/research/research-batch-1-102525/source-materials/transcripts/`

## Quick Start

### 1. Set Up Database

1. Create Supabase project: https://supabase.com/dashboard
2. Enable vector extension: Database → Extensions → vector
3. Run `database-schema.sql` in SQL Editor

### 2. Add API Keys

Add to `.env.local`:
```bash
GOOGLE_GENERATIVE_AI_API_KEY=your_key_here
NEXT_PUBLIC_SUPABASE_URL=your_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
SUPABASE_SERVICE_ROLE_KEY=your_key_here
```

### 3. Ingest Content

```bash
npm run ingest
```

### 4. Test

Chat UI will automatically use the loaded content for responses.

## Architecture

```
User Question
     ↓
Generate Embedding (Google text-embedding-004)
     ↓
Search Supabase (cosine similarity)
     ↓
Retrieve Top 5 Chunks
     ↓
Build Context
     ↓
Send to Gemini 1.5 Pro
     ↓
Stream Response
```

## Cost

**Free Tier:**
- Google Gemini: 1,500 requests/day
- Supabase: 500MB database, 2GB bandwidth/month
- **Total: $0/month for typical portfolio traffic**

## Monitoring

Check usage in dashboards:
- Google AI Studio: https://aistudio.google.com
- Supabase: https://supabase.com/dashboard

Set up billing alerts if concerned about overages.
