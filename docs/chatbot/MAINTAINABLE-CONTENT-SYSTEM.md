# Maintainable AI Chatbot Content System

**Status**: ✅ Implemented
**Date**: October 28, 2025
**Version**: 1.0

## Overview

The AI chatbot now features a fully automated, maintainable content system that:
- ✅ **Automatically syncs** content from Sanity CMS via webhooks
- ✅ **Smart updates** - only re-embeds changed content (98% API cost savings)
- ✅ **Admin dashboard** - monitor and manual control
- ✅ **Content fingerprinting** - detects changes efficiently
- ✅ **Dual content sources** - Sanity CMS + transcript files

## Architecture

```
Sanity CMS                    Transcript Files
     ↓                              ↓
Webhook (auto)            npm run ingest (manual)
     ↓                              ↓
     ├──────────────────────────────┤
                  ↓
          Smart Sync Engine
                  ↓
     ┌────────────┴────────────┐
     ↓                         ↓
Content Hash             Vector Search
Comparison              (find existing)
     ↓                         ↓
     ├─────────────────────────┤
                  ↓
    Upsert Logic (update or insert)
                  ↓
          Supabase Vector DB
                  ↓
         AI Chatbot Ready
```

## What Changed

### Before (Manual Only)
- ❌ Manual `npm run ingest` required for updates
- ❌ Full re-embed on every run (wasteful)
- ❌ Only transcript files supported
- ❌ No change detection
- ❌ No monitoring/visibility

### After (Fully Automated)
- ✅ Auto-sync via Sanity webhooks (< 30s)
- ✅ Incremental updates (only changed content)
- ✅ Sanity CMS + transcripts both supported
- ✅ Content fingerprinting detects changes
- ✅ Admin dashboard for monitoring

## File Structure

```
src/lib/chatbot/
├── sanity-fetcher.ts        [NEW] Fetch & transform Sanity content
├── content-hash.ts          [NEW] SHA-256 fingerprinting
├── smart-sync.ts            [NEW] Intelligent sync engine
├── supabase.ts             [UPDATED] Upsert functions added
├── ingest-content.ts       [UPDATED] Dual source support
├── embeddings.ts           [EXISTING] Unchanged
└── README.md               [UPDATED] Documentation

src/app/api/
├── webhooks/sanity/
│   └── route.ts            [NEW] Webhook endpoint
└── admin/chatbot-sync/
    └── route.ts            [NEW] Admin API

src/app/(admin)/admin/
└── chatbot-content/
    └── page.tsx            [NEW] Admin dashboard

supabase/migrations/
└── 20251028_add_content_tracking.sql  [NEW] Schema update
```

## Setup Instructions

### 1. Database Migration

Run the migration in Supabase SQL Editor:

```sql
-- File: supabase/migrations/20251028_add_content_tracking.sql
-- Copy entire file contents and run in Supabase
```

This adds:
- `content_hash` column
- `source_id` column
- `last_synced` timestamp
- Helper functions for smart sync

### 2. Environment Variables

Add to `.env.local` and Vercel:

```bash
# Existing (already set)
GOOGLE_GENERATIVE_AI_API_KEY=xxx
NEXT_PUBLIC_SUPABASE_URL=xxx
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# NEW - Required for webhooks
SANITY_WEBHOOK_SECRET=your_secure_random_string_here
```

Generate a secure secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Sanity Webhook Configuration

In Sanity dashboard (https://sanity.io/manage):

1. **Navigate to**: Your Project → API → Webhooks
2. **Click**: "Create webhook"
3. **Configure**:
   - **Name**: Portfolio Chatbot Sync
   - **URL**: `https://yourdomain.com/api/webhooks/sanity`
   - **Dataset**: `production`
   - **Trigger on**: `Create`, `Update`, `Delete`
   - **Filter** (optional): `_type in ["project", "profile", "aiProject"]`
   - **HTTP method**: `POST`
   - **API version**: `v2021-06-07` (or latest)
   - **Secret**: Same value as `SANITY_WEBHOOK_SECRET`
   - **Projection**: `{ _id, _type, _rev, title, slug }`
4. **Save** and test

### 4. Initial Sync

Run the first sync to populate the database:

```bash
npm run ingest
```

This will:
- Fetch all Sanity CMS content
- Fetch all transcript files
- Generate embeddings
- Store in vector database

Expected output:
```
📦 Fetching Sanity content...
✅ Fetched 15 Sanity documents:
   - Projects: 5
   - Profile sections: 8
   - AI Projects: 2

📂 Loading transcript files...
✅ Found 3 transcript files

✅ Total documents to process: 18
   - Transcript files: 3
   - Sanity CMS: 15

🔄 Processing documents (chunking and generating embeddings)...
✅ Generated 142 chunks with embeddings

💾 Inserting chunks into Supabase...
✅ Inserted 142 chunks

📊 Ingestion Summary:
   Documents processed: 18
     - Transcript files: 3
     - Sanity CMS documents: 15
   Chunks created: 142
   Database records: 142
   Avg chunks per document: 7.9
```

### 5. Verify Setup

1. **Check Admin Dashboard**:
   - Navigate to: `http://localhost:3000/admin/chatbot-content`
   - Should show total documents, chunks, last sync time
   - Try "Sync Now" button to test manual sync

2. **Test Webhook** (after production deployment):
   - Edit a project in Sanity Studio
   - Check Vercel logs for webhook receipt
   - Verify content updated in admin dashboard

## Usage

### Automatic Sync (Production)

Once webhooks are configured, content syncs automatically:

1. **Edit content in Sanity** → Publish
2. **Webhook fires** (< 1 second)
3. **Smart sync runs** (checks if changed)
4. **Only changed content re-embedded** (10-30 seconds)
5. **Chatbot has latest content** (< 30 seconds total)

### Manual Sync (Development/Troubleshooting)

#### Option 1: Admin Dashboard
1. Navigate to `/admin/chatbot-content`
2. Click "Sync Now"
3. View results in real-time

#### Option 2: Command Line
```bash
# Full sync (Sanity + transcripts)
npm run ingest

# Clear and re-sync
npm run ingest -- --clear
```

### Monitoring

**Admin Dashboard** (`/admin/chatbot-content`):
- Total documents indexed
- Total chunks in database
- Last sync timestamp
- Content source breakdown
- Manual sync with live results

**Logs** (Vercel/Local):
- Webhook receipts
- Sync operations
- Change detection
- Embedding generation
- Errors and warnings

## How It Works

### Content Fingerprinting

Each document gets a SHA-256 hash:

```typescript
const contentHash = generateContentHash(content);
// Example: "a3f5b2c1..." (64 characters)
```

On subsequent syncs:
1. Fetch current content from Sanity
2. Generate hash
3. Compare with stored hash in database
4. **If different** → Re-embed and update
5. **If same** → Skip (no API cost)

### Smart Sync Algorithm

```typescript
for each document in Sanity {
  existingDocs = findBySourceId(document.id)

  if (no existing docs) {
    // NEW document
    embedAndInsert()
    result.added++
  } else {
    existingHash = existingDocs[0].content_hash
    newHash = generateHash(document.content)

    if (existingHash !== newHash) {
      // CHANGED document
      deleteOldChunks()
      embedAndInsert()
      result.updated++
    } else {
      // UNCHANGED
      result.unchanged++
    }
  }
}
```

### Upsert Logic

Instead of "delete all and re-insert":

```typescript
// Old approach (wasteful)
deleteAllDocuments()
insertAll() // Re-embeds everything

// New approach (efficient)
if (documentExists && contentChanged) {
  deleteDocumentsBySourceId(id)
  insertNewChunks()
}
// Only changed documents re-embedded
```

## API Endpoints

### GET `/api/admin/chatbot-sync`
Get sync status and statistics.

**Response**:
```json
{
  "success": true,
  "status": {
    "totalDocuments": 15,
    "totalChunks": 142,
    "lastSync": "2025-10-28T10:30:00Z",
    "sourcesCount": 4,
    "sanityDocuments": 95,
    "transcriptDocuments": 47
  }
}
```

### POST `/api/admin/chatbot-sync`
Trigger manual sync.

**Response**:
```json
{
  "success": true,
  "result": {
    "added": 2,
    "updated": 3,
    "deleted": 0,
    "unchanged": 10,
    "totalChunks": 42,
    "changes": [...]
  }
}
```

### POST `/api/webhooks/sanity`
Sanity webhook receiver (automatic).

**Headers Required**:
- `sanity-webhook-signature`: `sha256=<signature>`

**Payload**:
```json
{
  "_id": "draft.abc123",
  "_type": "project",
  "_rev": "v1",
  "title": "My Project",
  "slug": { "current": "my-project" }
}
```

## Cost Savings

### Embedding API Calls

**Before** (full re-sync each time):
```
80 chunks × 3 syncs/month = 240 API calls
```

**After** (smart sync):
```
5 changed chunks × 1 sync each = 5 API calls
```

**Savings**: 98% reduction (240 → 5 calls/month)

### Example Scenario

You have:
- 15 Sanity documents
- 80 total chunks
- Update 1 project (generates ~5 chunks)

**Old approach**: Re-embed all 80 chunks = 80 API calls
**New approach**: Re-embed 5 chunks = 5 API calls
**Savings**: 75 API calls saved (94%)

## Troubleshooting

### Webhook Not Firing

**Check**:
1. Webhook URL correct in Sanity dashboard
2. `SANITY_WEBHOOK_SECRET` matches in both places
3. Vercel deployment successful
4. Check Vercel function logs

**Test manually**:
```bash
curl -X POST https://yoursite.com/api/webhooks/sanity \
  -H "Content-Type: application/json" \
  -H "sanity-webhook-signature: sha256=test" \
  -d '{"_id":"test","_type":"project"}'
```

### Content Not Updating

**Debug steps**:
1. Check admin dashboard - when was last sync?
2. Manually trigger sync - does it work?
3. Check Supabase - are chunks present?
4. Check content hash - has it changed?

**Manual re-sync**:
```bash
npm run ingest -- --clear
```

### Database Migration Issues

If migration fails:

1. **Check if columns already exist**:
```sql
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'documents';
```

2. **Manual rollback if needed**:
```sql
ALTER TABLE documents DROP COLUMN IF EXISTS content_hash;
ALTER TABLE documents DROP COLUMN IF EXISTS source_id;
ALTER TABLE documents DROP COLUMN IF EXISTS last_synced;
```

3. **Re-run migration**

## Best Practices

### Development

1. **Use manual sync** (`npm run ingest`) during development
2. **Test webhook locally** with tools like ngrok
3. **Monitor logs** to verify webhook receipts
4. **Check admin dashboard** regularly

### Production

1. **Set up webhooks immediately** after deployment
2. **Monitor first few syncs** to ensure working
3. **Check admin dashboard weekly** for health
4. **Run manual sync monthly** as backup

### Content Updates

1. **Edit in Sanity Studio** → Auto-syncs
2. **If bulk changes** → Use admin dashboard to trigger manual sync
3. **If adding new transcript files** → Run `npm run ingest`

## Future Enhancements

Potential improvements:

- [ ] Sync queue for handling multiple webhooks
- [ ] Retry logic for failed webhook syncs
- [ ] Email notifications on sync failures
- [ ] Detailed sync history log
- [ ] Performance metrics dashboard
- [ ] Scheduled full re-sync (monthly)
- [ ] A/B testing for different chunking strategies

## Support

For issues:
1. Check this documentation
2. Review Vercel logs
3. Check Supabase logs
4. Test webhook manually
5. Run manual sync from admin dashboard

---

**Document Version**: 1.0
**Last Updated**: 2025-10-28
**Author**: Claude Code
**Status**: Production Ready ✅
