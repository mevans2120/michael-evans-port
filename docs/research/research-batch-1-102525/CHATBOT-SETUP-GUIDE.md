# AI Chatbot Setup Guide

## Current Status

✅ **Complete:**
- Chatbot infrastructure built (`/src/lib/chatbot/`, `/src/components/chatbot/`, `/src/app/api/chat/`)
- Content transcripts ready (~24,000 words covering your background, projects, and AI research)
- Ingestion scripts configured (`npm run ingest`)
- Environment variables added to `.env.local`

⏳ **Pending:**
- Database schema setup in Supabase (one-time manual step)
- Content ingestion (automated once schema is ready)
- Integration into site layout

---

## Quick Start (3 Steps)

### Step 1: Set Up Database Schema

**Option A: Via Supabase Dashboard (Recommended - 2 minutes)**

1. Go to https://supabase.com/dashboard
2. Select project: `kbppccutslxshkmaaagf`
3. Click: **SQL Editor** in the left sidebar
4. Click: **New Query**
5. Open file: `src/lib/chatbot/database-schema.sql`
6. Copy the **entire contents** and paste into the SQL Editor
7. Click: **Run** (or press `Ctrl+Enter`)

You should see: ✓ Success. No rows returned

**Option B: Via DATABASE_URL (If you have database connection string)**

1. Get your database connection string from:
   - Supabase Dashboard > Project Settings > Database > Connection String (URI mode)
2. Add to `.env.local`:
   ```bash
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.kbppccutslxshkmaaagf.supabase.co:6543/postgres
   ```
3. Run: `npm run setup-db`

### Step 2: Ingest Content

Once the database schema is set up:

```bash
npm run ingest
```

This will:
- Process all 3 transcript files
- Generate 768-dimensional embeddings using Google's text-embedding-004
- Load ~50-100 chunks into Supabase vector database
- Takes ~2-3 minutes

Expected output:
```
🚀 Starting content ingestion...
📂 Found 3 content files
📖 Reading file contents...
🔄 Processing documents (chunking and generating embeddings)...
✅ Generated XX chunks with embeddings
💾 Inserting chunks into Supabase...
✅ Inserted XX chunks

📊 Ingestion Summary:
   Files processed: 3
   Chunks created: XX
   Database records: XX
```

### Step 3: Add to Site

The chatbot component is ready to use. Add it to your layout:

**File:** `src/app/layout.tsx` (or wherever you want it)

```tsx
import { Chatbot } from '@/components/chatbot/Chatbot';

export default function Layout({ children }) {
  return (
    <>
      {children}
      <Chatbot />
    </>
  );
}
```

That's it! The chatbot will appear as a floating button in the bottom-right corner.

---

## Architecture Overview

### RAG Pipeline

```
User Question
  ↓
1. Generate Embedding (Google text-embedding-004)
  ↓
2. Vector Search (Supabase pgvector, top 5 results, cosine similarity > 0.7)
  ↓
3. Build Context (relevant document chunks)
  ↓
4. LLM Generation (Google Gemini 1.5 Pro with context)
  ↓
5. Stream Response (Vercel AI SDK)
```

### Tech Stack

- **Embeddings:** Google text-embedding-004 (768 dimensions)
- **Vector DB:** Supabase pgvector (free tier: 500MB storage, 2GB bandwidth)
- **LLM:** Google Gemini 1.5 Pro (free tier: 15 RPM, 1,500/day)
- **Framework:** Next.js 15 with App Router, Edge runtime
- **UI:** Framer Motion animations, responsive design

### Cost: $0/month

All services using free tiers:
- Google Gemini: Free (well within limits for portfolio traffic)
- Supabase: Free (estimated usage: ~3MB of 500MB)
- Vercel: Free (hobby plan)

---

## Content Sources

Your chatbot is trained on:

1. **Professional Background** (`chatbot-questionnaire_Answers_1.md`)
   - Early education and first tech experiences
   - Complete career timeline (Huge, Work & Co, Beforelab, Raw Materials)
   - AI/ML journey and "oh shit" moment
   - ~8,000 words

2. **Projects & Current Work** (`chatbot-questionnaire_Answers_2.md`)
   - Current status (consulting + PostPal startup)
   - 7 detailed project deep dives:
     - Casa Bonita (Contentful CMS, ticket booking)
     - Virgin America (multi-year engagement, design system)
     - Before Launcher (MVP in 6 weeks, Twilio integration)
     - Peddle (marketplace rebuild, fraud prevention)
     - Target (enterprise ecommerce, performance optimization)
     - PostPal (AI-powered content scheduling)
     - Other AI projects (prototypes and experiments)
   - Example Q&As in your voice
   - Personality guidelines (dry humor, professional but casual)
   - ~12,000 words

3. **AI Research** (`ai-research-summary.md`)
   - Spring 2024 research project
   - 13 professional interviews
   - 8 major findings about AI adoption
   - Chatphone concept
   - Balanced perspective on AI future
   - ~4,000 words

---

## Testing

Once ingestion is complete, test with these questions:

**Background Questions:**
- "What's your professional background?"
- "Tell me about your experience at Work & Co"
- "How did you get into AI/ML?"

**Project Questions:**
- "What did you build for Casa Bonita?"
- "Tell me about the Virgin America project"
- "What's PostPal?"

**Technical Questions:**
- "What technologies do you work with?"
- "What's your AI research about?"
- "What's your approach to prototyping?"

The chatbot should provide specific, detailed answers grounded in your content.

---

## Troubleshooting

### Database Schema Errors

**Error:** `Could not find the table 'public.documents'`
- **Solution:** Run the SQL schema (Step 1 above)

**Error:** `extension "vector" does not exist`
- **Solution:** Enable pgvector extension in Supabase:
  - Go to: Database > Extensions
  - Search for "vector"
  - Click "Enable"
  - Then run the schema SQL

### Ingestion Errors

**Error:** `Supabase admin client not initialized`
- **Solution:** Check `.env.local` has:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`

**Error:** `Failed to generate embedding`
- **Solution:** Check `.env.local` has:
  - `GOOGLE_GENERATIVE_AI_API_KEY`

### Runtime Errors

**Error:** Chatbot button appears but doesn't respond
- **Solution:** Check browser console for API errors
- Verify API route is working: `curl http://localhost:3000/api/chat`

---

## File Structure

```
src/
├── lib/chatbot/
│   ├── supabase.ts              # Database client & vector search
│   ├── embeddings.ts            # Text chunking & embedding generation
│   ├── database-schema.sql      # Complete SQL schema
│   ├── ingest-content.ts        # Content ingestion script
│   └── setup-database.ts        # Database setup helper
├── components/chatbot/
│   ├── Chatbot.tsx              # Main component
│   ├── ChatInterface.tsx        # Chat modal UI
│   ├── ChatMessage.tsx          # Message bubbles
│   └── ChatButton.tsx           # Floating button
└── app/api/chat/
    └── route.ts                 # RAG-powered chat API

docs/research/research-batch-1-102525/
└── source-materials/transcripts/
    ├── chatbot-questionnaire_Answers_1.md
    ├── chatbot-questionnaire_Answers_2.md
    └── ai-research-summary.md
```

---

## Next Steps

1. **Set up database schema** (Step 1 above) ← **Do this now**
2. **Run ingestion:** `npm run ingest`
3. **Add to layout:** Import `<Chatbot />` component
4. **Test locally:** Ask questions and verify responses
5. **Deploy:** Push to production (Vercel will build automatically)

---

## Re-ingesting Content

If you need to update the chatbot's knowledge:

```bash
# Clear existing data and re-ingest
npm run ingest:clear

# Or just add new content (keeps existing)
npm run ingest
```

---

## Production Checklist

Before deploying:

- [ ] Database schema set up in Supabase
- [ ] Content ingested successfully
- [ ] Tested locally with multiple questions
- [ ] Environment variables added to Vercel
- [ ] Chatbot component added to layout
- [ ] Verified API route works in production
- [ ] Checked mobile responsiveness

---

## Support

If you encounter issues:

1. Check browser console for errors
2. Verify all environment variables are set
3. Test API route directly: `/api/chat`
4. Check Supabase logs for database errors
5. Verify embeddings were created: Check Supabase table browser

---

**Ready to proceed? Start with Step 1: Set up the database schema.**
