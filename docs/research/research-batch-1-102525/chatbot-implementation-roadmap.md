# RAG Chatbot Implementation Roadmap
## Michael Evans Portfolio Website

**Project Goal**: Implement a production-ready, $0/month RAG-powered chatbot that can answer questions about Michael Evans' professional experience, projects, and expertise.

**Tech Stack**:
- Frontend: Next.js 15 + TypeScript + Radix UI components
- AI Framework: Vercel AI SDK
- LLM: Google Gemini 1.5 Pro (free tier: 15 RPM, 1M TPM, 1500 RPD)
- Vector Database: Supabase pgvector (free tier: 500MB database, 2GB bandwidth)
- Embeddings: text-embedding-004 (Google's free embedding model)

**Timeline Estimate**: 3-4 weeks (part-time development)

---

## Phase 0: Prerequisites & Setup
**Duration**: 2-3 hours
**Dependencies**: None

### Tasks

#### 0.1 Account Setup & API Keys
- [ ] Create Google AI Studio account (ai.google.dev)
- [ ] Generate Gemini API key
- [ ] Create Supabase account (supabase.com)
- [ ] Create new Supabase project
- [ ] Generate Supabase service role key
- [ ] Store all keys in `.env.local`:
  ```
  GOOGLE_GEMINI_API_KEY=xxx
  NEXT_PUBLIC_SUPABASE_URL=xxx
  NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
  SUPABASE_SERVICE_ROLE_KEY=xxx
  ```

#### 0.2 Package Installation
- [ ] Install Vercel AI SDK: `npm install ai @ai-sdk/google`
- [ ] Install Supabase client: `npm install @supabase/supabase-js`
- [ ] Install vector similarity dependencies: `npm install pgvector`
- [ ] Verify all packages in package.json

#### 0.3 Project Structure Setup
- [ ] Create `/src/lib/ai/` directory for AI utilities
- [ ] Create `/src/lib/supabase/` directory for database client
- [ ] Create `/src/app/api/chat/` directory for API routes
- [ ] Create `/src/components/chat/` directory for UI components
- [ ] Create `/scripts/` directory for data processing scripts

**Success Criteria**:
- All API keys obtained and validated
- Development environment configured
- All dependencies installed without conflicts
- Project structure created

---

## Phase 1: Vector Database Foundation
**Duration**: 1 week
**Dependencies**: Phase 0

### Tasks

#### 1.1 Supabase Database Configuration
- [ ] Enable pgvector extension in Supabase dashboard (Database > Extensions)
- [ ] Create `documents` table with schema:
  ```sql
  CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    metadata JSONB,
    embedding VECTOR(768),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  ```
- [ ] Create index for vector similarity search:
  ```sql
  CREATE INDEX documents_embedding_idx ON documents
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);
  ```
- [ ] Create RLS (Row Level Security) policies for read access
- [ ] Test vector operations with sample data

#### 1.2 Supabase Client Setup
- [ ] Create `/src/lib/supabase/client.ts` with client initialization
- [ ] Create `/src/lib/supabase/server.ts` for server-side operations
- [ ] Implement connection pooling configuration
- [ ] Add error handling and retry logic
- [ ] Create TypeScript types for database schema

#### 1.3 Vector Operations Library
- [ ] Create `/src/lib/ai/embeddings.ts` for embedding generation
- [ ] Implement `generateEmbedding(text: string)` using Google's text-embedding-004
- [ ] Create `/src/lib/ai/vector-store.ts` for vector operations
- [ ] Implement `insertDocument(content, metadata, embedding)` function
- [ ] Implement `searchSimilarDocuments(query, limit)` function
- [ ] Implement `deleteDocument(id)` function
- [ ] Add batch operations for bulk inserts
- [ ] Add logging and monitoring utilities

**Technical Decisions**:
- **Embedding Model**: text-embedding-004 (768 dimensions, free, optimized for RAG)
- **Similarity Metric**: Cosine similarity (standard for text embeddings)
- **Index Type**: IVFFlat (good balance of speed/accuracy for small datasets)
- **Chunk Size**: 1000 tokens with 200 token overlap (optimized for Gemini context)

**Success Criteria**:
- Database schema created and tested
- Vector similarity search working with sample data
- All CRUD operations functional
- Connection pooling and error handling verified

---

## Phase 2: Data Preparation & Ingestion
**Duration**: 1 week
**Dependencies**: Phase 1

### Tasks

#### 2.1 Data Source Analysis
- [ ] Audit Sanity CMS content:
  - Profile data (bio, experience, skills)
  - Project documents (descriptions, achievements, technologies)
  - Capability documents
- [ ] Identify additional content sources:
  - Resume/CV data
  - LinkedIn profile
  - GitHub README files
  - Blog posts or articles
- [ ] Document data structure and relationships

#### 2.2 Content Extraction Scripts
- [ ] Create `/scripts/extract-sanity-data.ts`:
  - Query all profile data via Sanity client
  - Query all projects with full content
  - Query all capabilities
  - Export to JSON format
- [ ] Create `/scripts/extract-metadata.ts`:
  - Parse dates, technologies, skills
  - Create structured metadata objects
  - Validate data completeness
- [ ] Add error handling and logging

#### 2.3 Content Chunking Strategy
- [ ] Create `/scripts/chunk-content.ts`:
  - Split long documents into semantic chunks
  - Implement sliding window with overlap
  - Preserve context boundaries (paragraphs, sections)
  - Add metadata to each chunk (source, type, date)
- [ ] Implement chunking rules:
  - Max chunk size: 1000 tokens (~750 words)
  - Overlap: 200 tokens
  - Preserve markdown structure
  - Keep related content together
- [ ] Test chunking with sample content

#### 2.4 Document Formatting
- [ ] Create document templates:
  - Profile format: "Michael Evans is [role]. [bio]. Skills: [skills]..."
  - Project format: "[title]: [description]. Technologies: [tech]. Achievements: [achievements]..."
  - Experience format: "[role] at [company] ([dates]): [description]..."
- [ ] Implement template rendering function
- [ ] Add source attribution to each document
- [ ] Validate document quality and completeness

#### 2.5 Embedding Generation & Upload
- [ ] Create `/scripts/generate-embeddings.ts`:
  - Batch process all chunks
  - Generate embeddings via Google API
  - Implement rate limiting (15 RPM)
  - Add retry logic with exponential backoff
- [ ] Create `/scripts/upload-to-supabase.ts`:
  - Batch insert documents to Supabase
  - Include embeddings and metadata
  - Handle errors and partial failures
  - Log progress and statistics
- [ ] Create combined script `/scripts/ingest-all.ts`:
  - Extract -> Chunk -> Embed -> Upload pipeline
  - Progress tracking and reporting
  - Dry-run mode for testing

**Data Organization Strategy**:
```
Document Types:
- profile: Bio, skills, contact info
- experience: Work history entries
- project: Individual projects with full details
- capability: Core competencies and expertise areas
- education: Academic background
- achievement: Notable accomplishments

Metadata Structure:
{
  type: "project" | "profile" | "experience" | "capability",
  title: string,
  date: string,
  technologies?: string[],
  category?: string,
  source: "sanity" | "manual",
  source_id?: string
}
```

**Success Criteria**:
- All Sanity content successfully extracted
- Content properly chunked with preserved context
- All documents have valid embeddings
- Database populated with 100-500 document chunks
- Metadata searchable and accurate

---

## Phase 3: RAG API Implementation
**Duration**: 1 week
**Dependencies**: Phase 2

### Tasks

#### 3.1 Chat API Route
- [ ] Create `/src/app/api/chat/route.ts` (Next.js 15 Route Handler)
- [ ] Implement POST endpoint for chat messages
- [ ] Add request validation with Zod schema
- [ ] Implement rate limiting per IP (10 requests/minute)
- [ ] Add CORS headers if needed
- [ ] Implement error handling and logging

#### 3.2 RAG Pipeline Implementation
- [ ] Create `/src/lib/ai/rag-pipeline.ts`:
  - **Step 1: Query Processing**
    - Clean and normalize user query
    - Extract key entities and intent
  - **Step 2: Embedding Generation**
    - Generate query embedding
    - Use text-embedding-004 model
  - **Step 3: Vector Search**
    - Search Supabase for similar documents
    - Return top 5-10 most relevant chunks
    - Calculate similarity scores
  - **Step 4: Context Assembly**
    - Rank results by relevance
    - Format context for LLM
    - Add source citations
  - **Step 5: Response Generation**
    - Build prompt with context and query
    - Stream response from Gemini 1.5 Pro
    - Include source attribution

#### 3.3 Prompt Engineering
- [ ] Create `/src/lib/ai/prompts.ts`:
  - System prompt for chatbot personality
  - Context integration template
  - Few-shot examples for consistency
  - Guardrails against hallucination
- [ ] Design prompt structure:
  ```
  You are an AI assistant representing Michael Evans, an AI/ML engineer and creative technologist.

  Use the following context to answer questions accurately:
  {context}

  Rules:
  - Only answer based on provided context
  - Cite sources when possible
  - If information isn't in context, say so
  - Be professional yet conversational
  - Highlight relevant projects and experience

  User: {query}
  Assistant:
  ```
- [ ] Test prompt variations for quality

#### 3.4 Streaming Response Implementation
- [ ] Integrate Vercel AI SDK streaming:
  ```typescript
  import { streamText } from 'ai';
  import { google } from '@ai-sdk/google';
  ```
- [ ] Configure streaming parameters:
  - Model: gemini-1.5-pro-latest
  - Temperature: 0.7 (balanced creativity/accuracy)
  - Max tokens: 2048
  - Top-p: 0.95
- [ ] Implement token streaming to client
- [ ] Add error recovery for stream interruptions

#### 3.5 Source Citation System
- [ ] Implement citation tracking in RAG pipeline
- [ ] Format citations with document metadata
- [ ] Return citations alongside response
- [ ] Create citation display component for UI

**Technical Architecture**:
```
User Query → API Route → RAG Pipeline → Response

RAG Pipeline Flow:
1. Query → Generate Embedding (text-embedding-004)
2. Embedding → Vector Search (Supabase pgvector)
3. Similar Docs → Context Assembly (top 5 chunks)
4. Context + Query → LLM Prompt (Gemini 1.5 Pro)
5. LLM → Stream Response → Client
```

**API Response Format**:
```typescript
{
  id: string,
  message: string,
  sources: Array<{
    title: string,
    type: string,
    relevance: number
  }>,
  timestamp: number
}
```

**Success Criteria**:
- API route functional with proper error handling
- RAG pipeline returns relevant context (>0.7 similarity score)
- LLM responses are accurate and grounded in context
- Streaming works smoothly without interruptions
- Rate limiting prevents abuse
- Response time < 5 seconds for most queries

---

## Phase 4: Chat UI Components
**Duration**: 1 week
**Dependencies**: Phase 3

### Tasks

#### 4.1 Core Chat Components
- [ ] Create `/src/components/chat/chat-interface.tsx`:
  - Main chat container
  - Message list with scroll behavior
  - Input field with auto-resize
  - Send button with loading states
  - Error boundaries
- [ ] Create `/src/components/chat/message-bubble.tsx`:
  - User message styling
  - AI message styling
  - Markdown rendering for formatted responses
  - Timestamp display
  - Copy message button
- [ ] Create `/src/components/chat/typing-indicator.tsx`:
  - Animated dots for AI "thinking"
  - Loading skeleton for streamed responses
- [ ] Create `/src/components/chat/chat-input.tsx`:
  - Auto-growing textarea
  - Character limit indicator
  - Keyboard shortcuts (Enter to send, Shift+Enter for newline)
  - Submit button with states

#### 4.2 Advanced Features
- [ ] Create `/src/components/chat/source-citations.tsx`:
  - Expandable citation cards
  - Link to source documents/projects
  - Relevance score display
- [ ] Create `/src/components/chat/suggested-questions.tsx`:
  - Pre-defined question chips
  - Dynamic suggestions based on context
  - Click to populate input
- [ ] Create `/src/components/chat/chat-header.tsx`:
  - Title and description
  - Clear conversation button
  - Minimize/maximize controls
  - Info/help tooltip
- [ ] Create `/src/components/chat/empty-state.tsx`:
  - Welcome message
  - Feature highlights
  - Suggested starter questions

#### 4.3 Chat State Management
- [ ] Implement chat state with React hooks:
  ```typescript
  interface ChatState {
    messages: Message[];
    isLoading: boolean;
    error: string | null;
    sendMessage: (content: string) => Promise<void>;
    clearMessages: () => void;
  }
  ```
- [ ] Create `/src/lib/hooks/use-chat.ts`:
  - Message state management
  - API integration with streaming
  - Local storage persistence
  - Error handling
- [ ] Implement optimistic updates for UX
- [ ] Add message retry functionality

#### 4.4 Responsive Design & Accessibility
- [ ] Mobile-first responsive design:
  - Full-screen on mobile (<768px)
  - Floating widget on desktop (>768px)
  - Tablet optimizations
- [ ] Accessibility features:
  - ARIA labels for all interactive elements
  - Keyboard navigation support
  - Screen reader announcements for new messages
  - Focus management
  - High contrast mode support
- [ ] Test with assistive technologies

#### 4.5 Chat Widget Integration
- [ ] Create floating chat button for portfolio pages:
  - Fixed position bottom-right
  - Unobtrusive design
  - Notification badge for suggestions
  - Smooth open/close animations
- [ ] Implement chat modal/drawer:
  - Slide-in animation
  - Backdrop with blur
  - Responsive sizing
  - Z-index management
- [ ] Add to relevant pages (Home, About, Projects)

**Design System Integration**:
- Use existing Radix UI components (Dialog, ScrollArea, Tooltip)
- Follow Tailwind CSS utility patterns
- Match portfolio color scheme and typography
- Ensure brand consistency

**User Experience Flow**:
```
1. User clicks chat button
2. Chat drawer opens with welcome message
3. Suggested questions displayed
4. User types or clicks suggestion
5. Message sent, typing indicator shown
6. Response streams in with markdown formatting
7. Source citations displayed below response
8. User can continue conversation or close
```

**Success Criteria**:
- All components render correctly on all screen sizes
- Smooth animations and transitions
- Fast response rendering (<100ms for UI updates)
- Accessible to keyboard and screen reader users
- Message persistence across page navigation
- No UI jank or layout shifts

---

## Phase 5: Testing & Quality Assurance
**Duration**: 3-4 days
**Dependencies**: Phase 4

### Tasks

#### 5.1 Unit Testing
- [ ] Install testing dependencies:
  - `npm install -D vitest @testing-library/react @testing-library/jest-dom`
- [ ] Test vector operations:
  - Embedding generation
  - Vector search accuracy
  - Document insertion/retrieval
- [ ] Test RAG pipeline:
  - Query processing
  - Context assembly
  - Citation generation
- [ ] Test API routes:
  - Request validation
  - Error handling
  - Rate limiting
- [ ] Test React components:
  - Message rendering
  - Input handling
  - State updates
- [ ] Achieve >80% code coverage

#### 5.2 Integration Testing
- [ ] Test end-to-end RAG flow:
  - Query → Embedding → Search → Context → LLM → Response
- [ ] Test streaming functionality:
  - Token-by-token delivery
  - Error recovery
  - Connection interruptions
- [ ] Test database operations:
  - Concurrent queries
  - Connection pooling
  - Transaction rollbacks
- [ ] Test API rate limiting under load

#### 5.3 Quality & Accuracy Testing
- [ ] Create test query dataset:
  - 20-30 representative questions
  - Cover all content types (profile, projects, experience)
  - Include edge cases and tricky questions
- [ ] Evaluate RAG performance:
  - Relevance of retrieved documents (>0.7 similarity)
  - Accuracy of LLM responses (manual review)
  - Citation correctness
  - Response completeness
- [ ] Test for hallucinations:
  - Verify answers stay grounded in context
  - Check for fabricated information
  - Test "I don't know" responses
- [ ] Measure performance metrics:
  - Response time (target <5s)
  - Token usage per query
  - Database query latency
  - Embedding generation time

#### 5.4 User Experience Testing
- [ ] Manual testing checklist:
  - [ ] Chat opens/closes smoothly
  - [ ] Messages display correctly
  - [ ] Markdown renders properly
  - [ ] Citations are clickable
  - [ ] Suggested questions work
  - [ ] Error states are clear
  - [ ] Loading states are smooth
  - [ ] Mobile experience is usable
  - [ ] Keyboard navigation works
  - [ ] Screen reader compatibility
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Cross-device testing (Desktop, tablet, mobile)
- [ ] Performance testing (Lighthouse scores >90)

#### 5.5 Error Handling & Edge Cases
- [ ] Test error scenarios:
  - API key invalid/expired
  - Rate limit exceeded
  - Database connection failure
  - Embedding generation failure
  - LLM timeout/error
  - Network interruption
  - Invalid user input
  - Extremely long queries
  - Special characters and emoji
  - Concurrent requests
- [ ] Verify user-friendly error messages
- [ ] Test fallback behaviors
- [ ] Verify logging and monitoring

**Test Query Examples**:
```
1. "What is Michael Evans' background in AI?"
2. "Tell me about the PaLM API project"
3. "What technologies does Michael work with?"
4. "What is Michael's experience with machine learning?"
5. "Can you show me projects related to NLP?"
6. "What did Michael do at Google?"
7. "What are Michael's key skills?"
8. "Tell me about Michael's education"
9. "What is Michael's most impressive achievement?"
10. "How can I contact Michael?"
```

**Success Criteria**:
- All unit tests passing
- Integration tests covering critical paths
- RAG accuracy >85% on test queries
- No hallucinations detected
- Error handling graceful for all scenarios
- Performance metrics within targets
- Accessibility standards met (WCAG 2.1 AA)

---

## Phase 6: Optimization & Monitoring
**Duration**: 3-4 days
**Dependencies**: Phase 5

### Tasks

#### 6.1 Performance Optimization
- [ ] Optimize vector search:
  - Tune IVFFlat index parameters (lists count)
  - Test different similarity thresholds
  - Implement query result caching
  - Optimize SQL queries
- [ ] Optimize embedding generation:
  - Batch API calls when possible
  - Cache embeddings for repeated queries
  - Implement debouncing for user input
- [ ] Optimize LLM requests:
  - Minimize context size (only most relevant chunks)
  - Reduce system prompt length
  - Implement response caching for common queries
- [ ] Frontend optimizations:
  - Code splitting for chat components
  - Lazy loading for chat widget
  - Optimize bundle size
  - Implement virtual scrolling for long conversations

#### 6.2 Caching Strategy
- [ ] Implement Redis/in-memory cache for:
  - Popular query embeddings (1 hour TTL)
  - Frequent LLM responses (24 hour TTL)
  - User session data
- [ ] OR use Vercel KV (free tier: 256MB)
- [ ] Cache invalidation strategy for content updates
- [ ] Cache warming for common queries

#### 6.3 Rate Limiting & Cost Management
- [ ] Implement multi-level rate limiting:
  - Per IP: 10 requests/minute
  - Per session: 50 requests/hour
  - Global: 1000 requests/day (within free tier)
- [ ] Add usage tracking:
  - Count API calls to Google
  - Track token usage
  - Monitor database queries
- [ ] Create usage dashboard:
  - Daily/weekly/monthly stats
  - Alert when approaching limits
  - Visualize usage patterns
- [ ] Implement graceful degradation when limits reached

#### 6.4 Monitoring & Logging
- [ ] Set up logging infrastructure:
  - Log all chat interactions (anonymized)
  - Track error rates and types
  - Monitor response times
  - Log vector search performance
- [ ] Implement error tracking:
  - Use Vercel Analytics (free tier)
  - Set up error alerts for critical failures
  - Track error trends
- [ ] Create monitoring dashboard:
  - Real-time chat metrics
  - API response times
  - Database performance
  - LLM token usage
- [ ] Set up alerts:
  - Error rate threshold (>5%)
  - Response time threshold (>10s)
  - Free tier limit approaching (>80%)

#### 6.5 Content Update Pipeline
- [ ] Create update workflow:
  - Detect Sanity content changes
  - Regenerate embeddings for updated content
  - Update vector database
  - Clear relevant caches
- [ ] Create admin tools:
  - Manual content reindex script
  - Vector database management UI
  - Query analytics dashboard
- [ ] Document content update process
- [ ] Schedule regular content syncs (weekly or on-demand)

**Optimization Targets**:
- Response time: <3s (p95)
- Database query time: <100ms
- Embedding generation: <500ms
- LLM first token: <2s
- Total API calls: <1000/day (within free tier)
- Bundle size: <100KB for chat components

**Success Criteria**:
- Performance targets met consistently
- Caching reduces redundant API calls by 30%+
- Rate limiting prevents abuse while allowing legitimate use
- Monitoring provides visibility into system health
- Content updates are straightforward and documented
- Zero unexpected costs from API overuse

---

## Phase 7: Deployment & Documentation
**Duration**: 2-3 days
**Dependencies**: Phase 6

### Tasks

#### 7.1 Environment Configuration
- [ ] Set up production environment variables in Vercel:
  - GOOGLE_GEMINI_API_KEY
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY
  - SUPABASE_SERVICE_ROLE_KEY
  - NEXT_PUBLIC_SITE_URL
- [ ] Configure Supabase production project:
  - Enable pgvector extension
  - Run migration scripts
  - Set up RLS policies
  - Configure backups
- [ ] Set up analytics and monitoring:
  - Vercel Analytics
  - Error tracking
  - Performance monitoring

#### 7.2 Deployment Pipeline
- [ ] Configure Vercel deployment settings:
  - Build command: `npm run build`
  - Output directory: `.next`
  - Environment variables
  - Domain configuration
- [ ] Deploy to Vercel staging environment
- [ ] Run full test suite on staging
- [ ] Deploy to production
- [ ] Verify production deployment
- [ ] Test production API endpoints

#### 7.3 Data Migration to Production
- [ ] Run data ingestion scripts against production:
  ```bash
  NODE_ENV=production npm run scripts/ingest-all.ts
  ```
- [ ] Verify all documents uploaded successfully
- [ ] Test vector search in production
- [ ] Validate RAG pipeline with production data
- [ ] Monitor for any database performance issues

#### 7.4 Documentation
- [ ] Create `/docs/chatbot/README.md`:
  - Architecture overview
  - Component documentation
  - API documentation
  - Deployment guide
- [ ] Create `/docs/chatbot/MAINTENANCE.md`:
  - Content update procedures
  - Monitoring and alerts
  - Troubleshooting guide
  - Cost management
- [ ] Create `/docs/chatbot/DEVELOPMENT.md`:
  - Local setup instructions
  - Testing procedures
  - Development workflow
  - Contributing guidelines
- [ ] Document environment variables
- [ ] Create troubleshooting runbook

#### 7.5 User Documentation
- [ ] Create help/info modal in chat UI:
  - How to use the chatbot
  - What questions can be asked
  - Data sources and limitations
  - Privacy information
- [ ] Add FAQ section
- [ ] Create example queries list
- [ ] Add feedback mechanism

#### 7.6 Launch Preparation
- [ ] Create launch checklist:
  - [ ] All tests passing
  - [ ] Performance validated
  - [ ] Error handling verified
  - [ ] Mobile experience tested
  - [ ] Accessibility verified
  - [ ] Monitoring configured
  - [ ] Documentation complete
  - [ ] Rate limiting tested
  - [ ] Free tier limits confirmed
  - [ ] Fallback mechanisms verified
- [ ] Prepare rollback plan
- [ ] Schedule deployment window
- [ ] Notify stakeholders

**Deployment Checklist**:
```
Pre-Deployment:
- [ ] All code merged to main branch
- [ ] Environment variables set in Vercel
- [ ] Supabase production database ready
- [ ] Data ingestion completed
- [ ] Staging deployment tested

Deployment:
- [ ] Deploy to production
- [ ] Run smoke tests
- [ ] Verify API endpoints
- [ ] Test chat functionality
- [ ] Monitor error rates
- [ ] Check performance metrics

Post-Deployment:
- [ ] Monitor for 24 hours
- [ ] Collect user feedback
- [ ] Address any issues
- [ ] Document lessons learned
```

**Success Criteria**:
- Production deployment successful with zero downtime
- All features functional in production
- Documentation complete and accessible
- Monitoring and alerts configured
- Performance meets targets
- Ready for public use

---

## Phase 8: Post-Launch Iteration
**Duration**: Ongoing
**Dependencies**: Phase 7

### Tasks

#### 8.1 User Feedback Collection
- [ ] Implement feedback mechanism:
  - Thumbs up/down on responses
  - "Report issue" button
  - User suggestions form
- [ ] Track feedback metrics:
  - Response satisfaction rate
  - Common complaint patterns
  - Feature requests
- [ ] Review feedback weekly
- [ ] Prioritize improvements

#### 8.2 Analytics & Insights
- [ ] Analyze chat usage patterns:
  - Most common queries
  - Peak usage times
  - Average conversation length
  - Drop-off points
- [ ] Identify content gaps:
  - Questions with low-quality responses
  - Missing information requests
  - Hallucination patterns
- [ ] Create improvement roadmap based on data

#### 8.3 Content Expansion
- [ ] Add missing content identified from user queries:
  - Additional project details
  - More granular skill information
  - Recent work updates
  - Blog posts or articles
- [ ] Improve document quality:
  - Rewrite unclear chunks
  - Add more context to projects
  - Expand sparse areas
- [ ] Run content refresh pipeline
- [ ] Validate improvements with test queries

#### 8.4 Feature Enhancements
- [ ] Potential enhancements (prioritize based on feedback):
  - [ ] Conversation memory/context
  - [ ] Multi-turn clarification questions
  - [ ] Rich media in responses (images, code snippets)
  - [ ] Export conversation feature
  - [ ] Language support (if needed)
  - [ ] Voice input/output
  - [ ] Chat history search
  - [ ] Personalized suggestions
- [ ] Create feature specs
- [ ] Implement iteratively

#### 8.5 Model & Prompt Iteration
- [ ] A/B test different prompts:
  - Tone variations
  - Context formatting
  - Citation styles
- [ ] Experiment with model parameters:
  - Temperature settings
  - Context window size
  - Top-k/Top-p values
- [ ] Evaluate alternative models (if Gemini updates available)
- [ ] Document improvements and learnings

**Continuous Improvement Cycle**:
```
1. Monitor metrics and feedback
2. Identify improvement opportunities
3. Prioritize by impact/effort
4. Implement and test changes
5. Deploy incrementally
6. Measure results
7. Repeat
```

**Success Criteria**:
- User satisfaction >85%
- Continuous improvement in response quality
- Regular content updates (at least monthly)
- Feature roadmap aligned with user needs
- System maintains <5s response time as usage grows

---

## Dependencies & Critical Path

### Critical Path (Must Complete in Order):
```
Phase 0 → Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6 → Phase 7 → Phase 8
```

### Parallel Work Opportunities:
- **Phases 1 & 2**: While setting up vector database (1.2-1.3), can begin data extraction (2.1-2.2)
- **Phases 3 & 4**: Can develop UI components (4.1-4.2) while finalizing RAG pipeline (3.2-3.3)
- **Phase 5**: Testing can begin as soon as individual components are complete

### Key Dependencies:
- Phase 2 requires Phase 1 (need database before ingestion)
- Phase 3 requires Phase 2 (need data for RAG to work)
- Phase 4 requires Phase 3 (need API before UI)
- Phase 5 requires Phase 4 (need full system for testing)
- Phase 7 requires Phase 5 (must test before deployment)

---

## Risk Assessment & Mitigation

### High-Risk Items

#### 1. Free Tier Rate Limits
**Risk**: Exceeding Gemini free tier (15 RPM, 1500 RPD)
**Probability**: Medium
**Impact**: High
**Mitigation**:
- Implement aggressive rate limiting
- Use caching extensively
- Monitor usage daily
- Have fallback messaging ready
- Consider paid tier if usage grows

#### 2. Vector Search Quality
**Risk**: Poor retrieval quality leading to wrong answers
**Probability**: Medium
**Impact**: High
**Mitigation**:
- Thorough testing with diverse queries
- Implement similarity score thresholds
- Add fallback to broader search
- Continuously refine chunking strategy
- Manual review of common queries

#### 3. LLM Hallucinations
**Risk**: AI generating false information
**Probability**: Medium
**Impact**: High
**Mitigation**:
- Strong prompt engineering with guardrails
- Limit response to context only
- Add disclaimers in UI
- Regular quality audits
- User feedback mechanism

#### 4. Database Performance
**Risk**: Slow vector searches as data grows
**Probability**: Low
**Impact**: Medium
**Mitigation**:
- Optimize index configuration
- Limit result set size
- Implement query caching
- Monitor query performance
- Plan for database upgrade path

### Medium-Risk Items

#### 5. Content Staleness
**Risk**: Chatbot information becomes outdated
**Probability**: High
**Impact**: Medium
**Mitigation**:
- Create easy content update pipeline
- Schedule regular syncs
- Add "last updated" metadata
- User feedback for outdated info

#### 6. User Abuse
**Risk**: Spam or malicious queries
**Probability**: Medium
**Impact**: Medium
**Mitigation**:
- Rate limiting per IP and session
- Input validation and sanitization
- Profanity filter
- Monitoring and alerts
- CAPTCHA if needed

#### 7. API Key Exposure
**Risk**: Accidental public exposure of keys
**Probability**: Low
**Impact**: High
**Mitigation**:
- Use environment variables
- Never commit keys to git
- Regular key rotation
- Monitor for unauthorized usage
- Use `.env.local` (in .gitignore)

### Low-Risk Items

#### 8. UI/UX Issues
**Risk**: Poor user experience
**Probability**: Low
**Impact**: Low
**Mitigation**:
- User testing before launch
- Responsive design
- Accessibility standards
- Iterative improvements

---

## Success Metrics

### Launch Criteria (Phase 7)
- [ ] Response accuracy >85% on test queries
- [ ] Response time <5s (p95)
- [ ] Zero critical bugs
- [ ] Mobile experience fully functional
- [ ] Accessibility WCAG 2.1 AA compliant
- [ ] All documentation complete
- [ ] Monitoring and alerts configured

### 30-Day Post-Launch Metrics
- User engagement: >50 conversations/week
- User satisfaction: >80% positive feedback
- Average response time: <3s
- Error rate: <2%
- API costs: $0/month (within free tier)
- Content coverage: >90% of queries answered

### 90-Day Success Metrics
- User engagement: >200 conversations/week
- User satisfaction: >85% positive feedback
- Response accuracy: >90% (manual review)
- Zero downtime incidents
- Feature expansion: 2-3 new features shipped
- Content updates: 1-2 refreshes completed

---

## Resource Requirements

### Tools & Services (All Free Tier)
- **Google AI Studio**: Gemini 1.5 Pro + text-embedding-004
- **Supabase**: PostgreSQL + pgvector (500MB limit)
- **Vercel**: Hosting + serverless functions
- **GitHub**: Version control

### Development Time (Part-Time Estimation)
- **Phase 0**: 2-3 hours
- **Phase 1**: 8-10 hours
- **Phase 2**: 10-12 hours
- **Phase 3**: 10-12 hours
- **Phase 4**: 12-15 hours
- **Phase 5**: 8-10 hours
- **Phase 6**: 8-10 hours
- **Phase 7**: 6-8 hours
- **Total**: 64-80 hours (3-4 weeks part-time)

### Ongoing Maintenance
- Content updates: 2-3 hours/month
- Monitoring and optimization: 2-4 hours/month
- User feedback review: 1-2 hours/week
- Feature enhancements: As needed

---

## Technical Architecture Summary

### System Architecture
```
User Browser
    ↓
Chat UI Component (React)
    ↓
Next.js API Route (/api/chat)
    ↓
RAG Pipeline
    ├─→ Generate Query Embedding (Google text-embedding-004)
    ├─→ Vector Search (Supabase pgvector)
    ├─→ Assemble Context (Top 5 chunks)
    └─→ Generate Response (Gemini 1.5 Pro)
    ↓
Stream Response to Client
```

### Data Flow
```
Content Sources (Sanity CMS)
    ↓
Extract & Chunk Script
    ↓
Generate Embeddings (text-embedding-004)
    ↓
Store in Supabase (documents table)
    ↓
Vector Index (IVFFlat with cosine similarity)
    ↓
Available for Real-Time Queries
```

### Key Technologies
- **Frontend**: Next.js 15, React 19, TypeScript, Radix UI, Tailwind CSS
- **AI Framework**: Vercel AI SDK v4
- **LLM**: Google Gemini 1.5 Pro (free tier)
- **Embeddings**: Google text-embedding-004 (768 dimensions)
- **Vector Database**: Supabase PostgreSQL + pgvector
- **Deployment**: Vercel (serverless functions)
- **CMS**: Sanity (existing content source)

---

## Next Steps

### Immediate Actions (Start Here)
1. **Sign up for accounts** (Phase 0.1):
   - Google AI Studio: https://ai.google.dev/
   - Supabase: https://supabase.com/
2. **Generate and secure API keys** (Phase 0.1)
3. **Install dependencies** (Phase 0.2)
4. **Set up project structure** (Phase 0.3)

### First Week Focus
- Complete Phase 0 (Prerequisites)
- Complete Phase 1 (Vector Database setup)
- Begin Phase 2 (Data extraction from Sanity)

### Questions to Answer Before Starting
- [ ] Do you have access to all Sanity content already?
- [ ] Are there any additional content sources (resume, LinkedIn, etc.)?
- [ ] What's your preferred deployment timeline?
- [ ] Do you want to implement any specific features not listed here?
- [ ] Are there any particular questions the chatbot MUST be able to answer?

---

## Appendix

### Useful Resources
- **Vercel AI SDK**: https://sdk.vercel.ai/docs
- **Google Gemini API**: https://ai.google.dev/docs
- **Supabase pgvector**: https://supabase.com/docs/guides/ai
- **RAG Best Practices**: https://www.pinecone.io/learn/retrieval-augmented-generation/
- **Prompt Engineering Guide**: https://www.promptingguide.ai/

### Code Examples Location
- Vector operations: `/src/lib/ai/vector-store.ts`
- RAG pipeline: `/src/lib/ai/rag-pipeline.ts`
- API route: `/src/app/api/chat/route.ts`
- Chat UI: `/src/components/chat/`
- Data scripts: `/scripts/`

### Monitoring Dashboards
- Vercel Analytics: https://vercel.com/dashboard/analytics
- Supabase Dashboard: https://app.supabase.com/project/_/settings/api
- Google AI Studio Usage: https://aistudio.google.com/app/apikey

---

**Document Version**: 1.0
**Last Updated**: 2025-10-25
**Next Review**: After Phase 7 completion
