# Chatbot Architecture & Portfolio Corrections

## Project Name Corrections

### Penton Media Project
**Correct Name:** Penton Media (NOT "Pentanmedia")

Penton Media is a B2B media company that Michael worked with. This is the correct spelling and should be used in all references to this client.

---

## Chatbot Architecture

### Overview
Michael's portfolio chatbot is a sophisticated RAG (Retrieval-Augmented Generation) system that combines modern AI capabilities with efficient vector search to provide accurate, context-aware answers about Michael's professional experience.

### Technology Stack

**AI Models:**
- **Claude Haiku 4.5** (`claude-haiku-4-5-20251001`) - Latest generation model from Anthropic (October 2025)
- **Google text-embedding-004** - Generates embeddings for semantic search
- **Vercel AI SDK v5** - Manages streaming responses and message formatting

**Backend Infrastructure:**
- **Supabase** - PostgreSQL database with pgvector extension for vector similarity search
- **Next.js 15 API Routes** - Edge runtime for low-latency responses
- **Server-Sent Events (SSE)** - Enables real-time streaming of AI responses

**Frontend:**
- **Next.js 15** with React 19
- **Framer Motion** - Smooth animations for chat interface
- **react-markdown** with remark-gfm - Rich markdown rendering including tables, lists, and code blocks
- **Tailwind CSS** - Styling with dark mode support

### Architecture Components

#### 1. Content Ingestion Pipeline
**Location:** `src/lib/chatbot/ingest-content.ts`

The ingestion system:
- Reads markdown files from the research directory
- Chunks content into semantic units (paragraphs, sections)
- Generates embeddings using Google's text-embedding-004 model
- Stores content chunks and embeddings in Supabase
- Includes metadata (source file, section titles) for better retrieval

**Key Features:**
- Smart chunking that preserves context
- Automatic metadata extraction
- Deduplication of similar content
- Configurable chunk size (default: 1000 tokens with 200 token overlap)

#### 2. Vector Database
**Location:** Supabase PostgreSQL with pgvector extension

**Schema:**
```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY,
  content TEXT NOT NULL,
  embedding VECTOR(768),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX ON documents USING ivfflat (embedding vector_cosine_ops);
```

**Current Stats:**
- 272+ document chunks ingested
- 768-dimensional embeddings
- Cosine similarity search with configurable thresholds

#### 3. Retrieval System
**Location:** `src/lib/chatbot/supabase.ts`

When a user asks a question:
1. Generate embedding for the user's question
2. Perform cosine similarity search in vector database
3. Retrieve top 20 most similar documents (threshold: 0.3)
4. Rank results by relevance score
5. Pass relevant context to Claude

**Optimization Settings:**
- **Match count:** 20 documents (comprehensive context)
- **Similarity threshold:** 0.3 (captures broadly relevant information)
- **Context window:** ~4000 tokens maximum

#### 4. AI Response Generation
**Location:** `src/app/api/chat/route.ts`

**Claude Haiku 4.5 Configuration:**
- Temperature: 0.8 (balanced creativity and accuracy)
- Max tokens: 4000 (allows detailed responses)
- Streaming: enabled via AI SDK v5

**System Prompt Features:**
- Concise responses (2-3 paragraphs maximum)
- Focus on work, not team composition
- Privacy protection (no team member names)
- Intelligent follow-up question generation
- Professional but friendly tone

#### 5. Follow-Up Question System
Automatically generates 2 relevant follow-up questions after each response:
- Only suggests questions it can confidently answer from retrieved context
- Questions are clickable and automatically sent when selected
- Helps users discover related information

### Data Flow

```
User Question
    ↓
Generate Embedding (Google text-embedding-004)
    ↓
Vector Search (Supabase pgvector)
    ↓
Retrieve Top 20 Relevant Documents (threshold: 0.3)
    ↓
Assemble Context + System Prompt
    ↓
Stream Response (Claude Haiku 4.5)
    ↓
Parse Follow-Up Questions
    ↓
Display in UI with Markdown Rendering
```

### Key Design Decisions

1. **Claude Haiku 4.5 over Sonnet:** Haiku 4.5 (Oct 2025) is newer than Sonnet 3.5 (Oct 2024), offers better performance, and costs 6x less
2. **Low similarity threshold (0.3):** Captures broadly relevant context to ensure comprehensive answers
3. **20 documents retrieved:** Provides extensive context for detailed, accurate responses
4. **Separate embedding model:** Google's text-embedding-004 is optimized for semantic search
5. **Edge runtime:** Reduces latency for real-time streaming responses
6. **AI SDK v5:** Modern architecture with UIMessage/ModelMessage separation for better type safety

### Performance Characteristics

**Response Time:**
- Embedding generation: ~100-200ms
- Vector search: ~50-100ms
- AI streaming: First token in ~500ms, complete response in 2-5 seconds

**Accuracy:**
- Retrieval precision: High (0.3 threshold captures all relevant docs)
- Response accuracy: Excellent (Claude Haiku 4.5 + comprehensive context)
- Follow-up relevance: High (confidence-based generation)

### Monitoring & Observability

- Server-side logging of all queries
- Vector search similarity scores logged
- Context document tracking per query
- Error handling with graceful degradation

### Deployment

**Production Environment:**
- Hosted on Vercel (Next.js 15)
- Supabase cloud database
- Environment variables for API keys (Anthropic, Google AI, Supabase)
- Edge functions for optimal global performance

### Future Enhancements

Potential improvements:
- Hybrid search (vector + keyword)
- User feedback collection
- Query analytics dashboard
- A/B testing different retrieval strategies
- Conversation memory across sessions
- Multi-turn conversation context

---

## Technical Skills Demonstrated

This chatbot showcases Michael's expertise in:
- Modern AI/ML application architecture
- Vector databases and semantic search
- Real-time streaming applications
- Full-stack development (Next.js, React, API design)
- UX design (conversational interfaces, progressive disclosure)
- Production deployment and optimization
- API integration (Anthropic, Google AI, Supabase)

The chatbot itself is a portfolio piece that demonstrates Michael's "army of one" approach—combining product strategy, UX design, technical architecture, and AI engineering.
