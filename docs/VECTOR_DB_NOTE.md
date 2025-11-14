# Vector Database for Claude Code

## Overview
The vector database system for Claude Code has been moved to a separate repository to maintain clean separation of concerns.

**Location**: `~/claude-code-vectordb/`

## How It Works
1. The vector DB reads documentation from this project's `/docs` folder
2. It creates semantic embeddings for fast context retrieval
3. Claude Code agents query the vector DB instead of reading files directly
4. This saves ~100,000+ tokens/month

## Relationship to This Project
- **This website** provides the source documentation (read-only)
- **Vector DB** ingests and indexes the docs (separate repo)
- **No dependencies** - This website runs independently

## If Docs Are Updated
When you update documentation in this project:
1. Go to the vector DB repo: `cd ~/claude-code-vectordb/`
2. Re-run ingestion: `npm run ingest`
3. The vector DB will pick up the latest changes

## Important Notes
- The website does NOT depend on the vector DB to function
- All vector DB code has been removed from this repository
- The vector DB only reads from `/docs`, `/memory-bank/`, and `CLAUDE.md`
- ChromaDB data is stored separately in the vector DB repo

## Benefits of Separation
- Clean codebase - no mixing of concerns
- Independent deployment - can deploy website without vector DB
- Easier maintenance - update either project without affecting the other
- Reusability - vector DB can be used by other projects

---

Last updated: November 14, 2025