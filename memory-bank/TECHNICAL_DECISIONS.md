# Technical Decisions Record

This document records significant technical decisions made during the development of the Michael Evans Portfolio Site.

## Decision Record Format

Each decision follows the Architecture Decision Record (ADR) format:
- **Date**: When the decision was made
- **Status**: Proposed | Accepted | Deprecated | Superseded
- **Context**: The issue motivating this decision
- **Decision**: The change that we're proposing or have agreed to implement
- **Consequences**: What becomes easier or more difficult because of this change

---

## ADR-001: Adopt Memory Bank Documentation System

**Date**: 2025-09-15
**Status**: Accepted
**Context**: Need for maintaining development continuity across sessions and providing context for AI-assisted development. The portfolio site lacks structured documentation for tracking progress and decisions.
**Decision**: Implement a Memory Bank system based on the successful pattern from codymd-hacknback project, with adaptations for portfolio site needs.
**Consequences**:
- ✅ Better development continuity between sessions
- ✅ Clear progress tracking and decision documentation
- ✅ Improved context for AI assistants
- ⚠️ Requires discipline to maintain regularly
- ⚠️ Additional overhead for documentation updates

---

## ADR-002: Use Vite as Build Tool

**Date**: 2025-09-01 (Retroactive Documentation)
**Status**: Accepted
**Context**: Need for fast development server and optimized production builds for React application.
**Decision**: Use Vite instead of Create React App or Webpack for build tooling.
**Consequences**:
- ✅ Faster development server startup
- ✅ Hot module replacement
- ✅ Optimized production builds with code splitting
- ✅ Better TypeScript support
- ⚠️ Different configuration syntax from Webpack
- ⚠️ Smaller ecosystem compared to Webpack

---

## ADR-003: shadcn/ui Component Library

**Date**: 2025-09-01 (Retroactive Documentation)
**Status**: Accepted
**Context**: Need for high-quality, customizable UI components that don't lock into a specific design system.
**Decision**: Use shadcn/ui components built on Radix UI primitives with Tailwind CSS styling.
**Consequences**:
- ✅ Full control over component code
- ✅ Excellent accessibility with Radix UI
- ✅ Consistent with Tailwind CSS approach
- ✅ Components are part of codebase, not external dependency
- ⚠️ Manual updates when new versions released
- ⚠️ More initial setup compared to pre-built libraries

---

## ADR-004: Client-Side Routing with React Router

**Date**: 2025-09-01 (Retroactive Documentation)
**Status**: Accepted
**Context**: Portfolio site needs navigation between multiple pages while maintaining SPA benefits.
**Decision**: Use React Router DOM v6 for client-side routing.
**Consequences**:
- ✅ Declarative routing configuration
- ✅ Support for nested routes
- ✅ Built-in lazy loading support
- ✅ Good TypeScript support
- ⚠️ SEO requires additional configuration
- ⚠️ No built-in SSR support

---

## ADR-005: TypeScript for Type Safety

**Date**: 2025-09-01 (Retroactive Documentation)
**Status**: Accepted
**Context**: Need for type safety and better developer experience in a growing codebase.
**Decision**: Use TypeScript with strict mode enabled for all application code.
**Consequences**:
- ✅ Compile-time type checking
- ✅ Better IDE support and autocomplete
- ✅ Self-documenting code with interfaces
- ✅ Easier refactoring
- ⚠️ Additional build step
- ⚠️ Learning curve for TypeScript features

---

## ADR-006: Tailwind CSS for Styling

**Date**: 2025-09-01 (Retroactive Documentation)
**Status**: Accepted
**Context**: Need for rapid UI development with consistent design system.
**Decision**: Use Tailwind CSS as primary styling solution with custom configuration.
**Consequences**:
- ✅ Rapid prototyping with utility classes
- ✅ Consistent spacing and color system
- ✅ Small production CSS bundle with PurgeCSS
- ✅ No CSS naming conflicts
- ⚠️ HTML can become verbose with many classes
- ⚠️ Learning curve for utility-first approach

---

## ADR-007: TanStack Query for Server State

**Date**: 2025-09-01 (Retroactive Documentation)
**Status**: Accepted
**Context**: Need for robust data fetching and caching solution for future API integrations.
**Decision**: Use TanStack Query (React Query) for server state management.
**Consequences**:
- ✅ Built-in caching and synchronization
- ✅ Optimistic updates support
- ✅ Background refetching
- ✅ Request deduplication
- ⚠️ Additional abstraction layer
- ⚠️ Overkill for simple static data

---

## ADR-008: Monolithic Repository Structure

**Date**: 2025-09-15
**Status**: Accepted
**Context**: Portfolio site is a single application without need for multiple packages.
**Decision**: Maintain monolithic repository structure rather than monorepo with workspaces.
**Consequences**:
- ✅ Simpler development setup
- ✅ Easier deployment process
- ✅ No workspace configuration needed
- ⚠️ Harder to extract reusable packages later
- ⚠️ All dependencies in single package.json

---

## ADR-009: Static Deployment Strategy

**Date**: 2025-09-15
**Status**: Proposed
**Context**: Portfolio site is primarily static content without server-side requirements.
**Decision**: Deploy as static site to CDN (Vercel/Netlify/GitHub Pages).
**Consequences**:
- ✅ Zero server costs
- ✅ Excellent performance with CDN
- ✅ Simple deployment process
- ✅ High availability
- ⚠️ No server-side rendering for SEO
- ⚠️ Client-side only for dynamic features

---

## ADR-010: Component-Driven Development

**Date**: 2025-09-15
**Status**: Accepted
**Context**: Need for reusable, maintainable UI components.
**Decision**: Follow atomic design principles with clear component hierarchy.
**Consequences**:
- ✅ Reusable component library
- ✅ Consistent UI patterns
- ✅ Easier testing of components
- ✅ Better organization
- ⚠️ More upfront planning needed
- ⚠️ Can lead to over-abstraction

---

## ADR-011: Sanity CMS for Content Management

**Date**: 2025-09-15
**Status**: Proposed
**Context**: Portfolio site currently uses static content hardcoded in React components. Need for dynamic content management to easily update projects, case studies, and potentially add blog functionality without code deployments.
**Decision**: Implement Sanity CMS as the headless CMS solution for content management.
**Rationale**:
- **Free tier sufficient**: 1M API requests/month and 100GB bandwidth covers portfolio needs
- **React-based Studio**: Sanity Studio built with React aligns with existing tech stack
- **Real-time collaboration**: Live multi-user editing capabilities
- **Flexible schemas**: Schema-as-code approach provides full control
- **Image optimization**: Built-in image pipeline with on-demand transformations
- **GROQ queries**: Powerful query language for complex data fetching
- **Developer experience**: Excellent TypeScript support and documentation
**Consequences**:
- ✅ Content updates without code deployment
- ✅ Rich text editing with portable text
- ✅ Centralized media management
- ✅ Better SEO with dynamic meta tags
- ✅ Foundation for future blog functionality
- ⚠️ Additional complexity in architecture
- ⚠️ Learning curve for GROQ and portable text
- ⚠️ Dependency on external service
- ⚠️ Need to migrate existing static content

---

## ADR-012: RAG-Powered AI Chatbot with Google Gemini

**Date**: 2025-10-26
**Status**: Accepted
**Context**: Portfolio site needs an interactive way for visitors to learn about Michael's background, projects, and expertise. Traditional static content doesn't provide personalized exploration or answer specific questions. Goal is to implement chatbot with $0/month cost using free tiers.
**Decision**: Implement RAG (Retrieval Augmented Generation) architecture using Google Gemini 1.5 Pro for LLM, Google text-embedding-004 for embeddings, Supabase pgvector for vector search, and Vercel AI SDK for streaming.
**Rationale**:
- **Google Gemini free tier**: 15 RPM, 1,500 requests/day sufficient for portfolio traffic
- **text-embedding-004**: Latest Google embedding model, 768 dimensions, free tier
- **Supabase pgvector**: Free tier provides 500MB storage (only need ~3MB), 2GB bandwidth
- **RAG over fine-tuning**: More flexible, easier to update content, no training costs
- **Edge runtime**: Better performance, lower latency, streaming support
- **Vercel AI SDK**: Excellent streaming support, React hooks, framework-agnostic
**Architecture**:
- Text chunking: 500 chars with 50 char overlap (balances context/precision)
- Vector search: Top 5 results with 0.7 cosine similarity threshold
- Context assembly: Source-tagged chunks for transparency
- Streaming responses: Real-time output for better UX
**Consequences**:
- ✅ $0/month operational cost using free tiers
- ✅ Personalized visitor experience with natural language Q&A
- ✅ Easy content updates (re-run ingestion script)
- ✅ Semantic search provides relevant context
- ✅ Streaming responses feel fast and responsive
- ✅ Edge runtime for low latency worldwide
- ⚠️ Manual database setup required (Supabase REST API limitation)
- ⚠️ Need to monitor API usage to stay within free tiers
- ⚠️ Context limited to top 5 chunks (may miss some details)
- ⚠️ Requires content preparation (transcripts created)
- ⚠️ No chat history persistence (session-based only)

---

## ADR-013: Google Gemini over Claude for Chatbot LLM

**Date**: 2025-10-26
**Status**: Accepted
**Context**: Need to choose LLM provider for portfolio chatbot. Options: Claude (Anthropic), GPT-4 (OpenAI), Gemini (Google).
**Decision**: Use Google Gemini 1.5 Pro (gemini-1.5-pro-002) as the LLM.
**Rationale**:
- **Cost**: Gemini has generous free tier (15 RPM, 1,500/day), Claude API requires payment
- **Performance**: Gemini 1.5 Pro comparable quality to Claude Sonnet for portfolio Q&A
- **Ecosystem**: Google provides both LLM and embeddings (text-embedding-004) in one ecosystem
- **Integration**: Vercel AI SDK has first-class support for Google models
- **Portfolio traffic**: Low expected traffic fits well within free tier limits
**Consequences**:
- ✅ $0/month LLM costs
- ✅ Consistent provider for both embeddings and generation
- ✅ Good performance for conversational Q&A
- ⚠️ Rate limits require monitoring (15 RPM)
- ⚠️ Different system prompt tuning vs Claude
- ⚠️ May need to switch to paid tier if traffic grows

---

## ADR-014: Supabase pgvector over Pinecone/Weaviate

**Date**: 2025-10-26
**Status**: Accepted
**Context**: Need vector database for semantic search in RAG pipeline. Options: Pinecone (specialized vector DB), Weaviate (open-source vector DB), Supabase pgvector (PostgreSQL extension).
**Decision**: Use Supabase with pgvector extension for vector storage and similarity search.
**Rationale**:
- **Cost**: Supabase free tier (500MB, 2GB bandwidth) sufficient for ~3MB of embeddings
- **Familiarity**: PostgreSQL database, standard SQL queries
- **Integration**: Supabase provides both database and auth in one platform
- **Functionality**: pgvector provides cosine similarity, ivfflat indexing, RLS policies
- **Scalability**: Can handle expected portfolio traffic within free tier
**Consequences**:
- ✅ $0/month vector database costs
- ✅ Standard PostgreSQL with SQL familiarity
- ✅ Built-in RLS for security
- ✅ Same platform for potential future features (auth, storage)
- ⚠️ Manual schema setup required (SQL execution)
- ⚠️ Less specialized than Pinecone for vector operations
- ⚠️ ivfflat index less efficient than HNSW for large datasets (not an issue at portfolio scale)

---

## ADR-015: Session-Based Chat vs Persistent History

**Date**: 2025-10-26
**Status**: Accepted (with future consideration)
**Context**: Chat history can be stored in browser (localStorage), database, or not persisted at all.
**Decision**: Use session-based chat history (localStorage only) without database persistence.
**Rationale**:
- **Simplicity**: No database writes, no user accounts needed
- **Privacy**: User data stays in browser, not stored server-side
- **Cost**: No storage costs for chat history
- **Use case**: Portfolio visitors typically have short sessions, don't need long-term history
- **Implementation speed**: Faster to implement, one less feature to build
**Consequences**:
- ✅ Simpler implementation
- ✅ Better privacy (no user data collection)
- ✅ Zero storage costs
- ✅ No GDPR compliance complexity
- ⚠️ Chat history lost on browser close/clear
- ⚠️ Can't provide "continue conversation" feature
- ⚠️ No analytics on common questions (would need separate implementation)
**Future Consideration**: May add optional database persistence with user consent for "save conversation" feature

---

## Future Considerations

### Pending Decisions
1. **Analytics Platform**: Google Analytics vs Privacy-focused alternatives
2. **Testing Framework**: Jest + React Testing Library vs Vitest
3. **CI/CD Platform**: GitHub Actions vs Vercel/Netlify built-in
4. **Error Tracking**: Sentry vs LogRocket vs Custom solution
5. **Performance Monitoring**: Lighthouse CI vs Custom metrics

### Technical Debt
1. No test coverage currently
2. Missing SEO optimization
3. No error boundary implementation
4. No accessibility audit performed
5. No performance benchmarks established

---

*This document is updated as new technical decisions are made.*
*For implementation details, see [ARCHITECTURE.md](../ARCHITECTURE.md)*