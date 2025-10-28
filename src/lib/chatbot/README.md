# AI Chatbot Library

This directory contains the core utilities for the RAG-powered AI chatbot with **fully automated content synchronization**.

## ✨ Features

- ✅ **Auto-sync from Sanity CMS** via webhooks (< 30s updates)
- ✅ **Smart incremental updates** (98% API cost savings)
- ✅ **Dual content sources** (Sanity CMS + transcript files)
- ✅ **Content fingerprinting** for change detection
- ✅ **Admin dashboard** for monitoring and control
- ✅ **Zero manual intervention** in production

## Files

### `sanity-fetcher.ts` ⭐ NEW
Fetch and transform Sanity CMS content for vector database.

**Exports:**
- `fetchAllSanityContent()` - Get all projects, profile, AI projects
- `fetchProjects()` - Get case study projects
- `fetchProfile()` - Get profile and about page content
- `fetchAIProjects()` - Get AI project pages
- `portableTextToPlainText()` - Transform Sanity portable text to plain text

### `smart-sync.ts` ⭐ NEW
Intelligent content synchronization with change detection.

**Exports:**
- `smartSyncSanityContent()` - Sync all Sanity content (only changed)
- `syncSingleDocument()` - Sync one document (for webhooks)
- `deleteSanityDocument()` - Remove deleted content
- `printSyncSummary()` - Display sync results

### `content-hash.ts` ⭐ NEW
Content fingerprinting for change detection.

**Exports:**
- `generateContentHash()` - SHA-256 hash of content
- `generateDocumentHash()` - Hash content + metadata
- `hashesMatch()` - Compare two hashes
- `generateChunkId()` - Stable chunk identification

### `supabase.ts` 🔄 UPDATED
Supabase client and database operations.

**Exports:**
- `supabase` - Client for public operations
- `supabaseAdmin` - Client with service role (admin)
- `searchSimilarDocuments()` - Vector similarity search
- `insertDocument()`, `insertDocuments()` - Add content to database
- `upsertDocument()` - ⭐ Update if exists, insert if new
- `findDocumentsBySourceId()` - ⭐ Find chunks by source ID
- `deleteDocumentsBySourceId()` - ⭐ Delete by source ID
- `getSyncStatus()` - ⭐ Get sync statistics
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

### `ingest-content.ts` 🔄 UPDATED
Script to load portfolio content into the database from **multiple sources**.

**Now supports:**
- ✅ Sanity CMS content (projects, profile, AI projects)
- ✅ Transcript files (background, experience, Q&A)
- ✅ Automatic source merging

**Usage:**
```bash
# Full sync (Sanity + transcripts)
npm run ingest

# Clear and re-sync
npm run ingest -- --clear
```

**Prerequisites:**
1. API keys set in `.env.local`
2. Database schema created in Supabase
3. Supabase migration run (for smart sync features)

## Quick Start

### 1. Set Up Database

1. Create Supabase project: https://supabase.com/dashboard
2. Enable vector extension: Database → Extensions → vector
3. Run `database-schema.sql` in SQL Editor
4. Run `supabase/migrations/20251028_add_content_tracking.sql` for smart sync ⭐

### 2. Add API Keys

Add to `.env.local`:
```bash
GOOGLE_GENERATIVE_AI_API_KEY=your_key_here
NEXT_PUBLIC_SUPABASE_URL=your_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
SUPABASE_SERVICE_ROLE_KEY=your_key_here
SANITY_WEBHOOK_SECRET=your_secret_here  ⭐ NEW
```

### 3. Initial Content Sync

```bash
npm run ingest
```

This loads:
- ✅ All Sanity CMS content (projects, profile, AI projects)
- ✅ All transcript files
- ✅ Generates embeddings and stores in vector DB

### 4. Configure Auto-Sync (Production)

In Sanity dashboard:
1. Go to API → Webhooks
2. Create webhook:
   - URL: `https://yourdomain.com/api/webhooks/sanity`
   - Events: create, update, delete
   - Secret: Same as `SANITY_WEBHOOK_SECRET`

### 5. Monitor & Manage

Visit admin dashboard:
```
http://localhost:3000/admin/chatbot-content
```

- View sync status
- Manual sync button
- See recent changes
- Monitor health

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

## How Auto-Sync Works

```
1. Edit content in Sanity Studio → Publish
2. Webhook fires to /api/webhooks/sanity (< 1s)
3. Smart sync checks if content changed (hash comparison)
4. If changed: Re-embed only that document (10-30s)
5. If unchanged: Skip (no API cost)
6. Chatbot has latest content (< 30s total)
```

**API Cost Savings:**
- Old: 80 chunks × 3 syncs = 240 API calls/month
- New: 5 changed chunks = 5 API calls/month
- **Savings: 98%** 🎉

## Cost

**Free Tier:**
- Google Gemini: 1,500 requests/day
- Supabase: 500MB database, 2GB bandwidth/month
- **Total: $0/month for typical portfolio traffic**

**With smart sync**: Even MORE cost-effective (98% fewer embedding calls)

## Monitoring

### Admin Dashboard
Navigate to `/admin/chatbot-content`:
- Total documents and chunks
- Last sync timestamp
- Manual sync button
- Recent changes
- Webhook setup guide

### Logs
Check Vercel function logs:
- Webhook receipts
- Sync operations
- Change detection
- Errors and warnings

### External Dashboards
- Google AI Studio: https://aistudio.google.com
- Supabase: https://supabase.com/dashboard
