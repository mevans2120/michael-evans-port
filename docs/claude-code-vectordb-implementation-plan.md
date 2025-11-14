# Claude Code Vector Database - Phase 1 POC Implementation Plan

**Date**: November 13, 2025
**Status**: Ready for Implementation
**Estimated Effort**: 10-14 hours
**Confidence**: 90% (Research validated, no blockers)

---

## Executive Summary

### Goals

Enable Claude Code agents to query project documentation via a local vector database, providing instant access to architectural decisions, implementation patterns, and project context without manually reading dozens of files.

### Scope

Phase 1 POC delivers:
- ✅ ChromaDB running locally with 1,200+ doc chunks from `/docs/`
- ✅ TypeScript API library for shared vector DB access
- ✅ MCP server for Claude Code agent integration
- ✅ CLI tools for manual queries and backups
- ✅ 10+ test queries with 75%+ relevance rate
- ✅ Complete documentation

### Timeline

**Day 1**: Tasks 1-4 (6-8 hours)
**Day 2**: Tasks 5-7 (4-6 hours)
**Total**: 10-14 hours over 2 days

### Key Decisions

| Decision | Rationale |
|----------|-----------|
| **ChromaDB** over Supabase | Zero-config, file-based, git-friendly backups, excellent TypeScript support |
| **Dual-access pattern** | TypeScript API for zero-token access, MCP for agents |
| **Extend existing ingestion** | Reuse proven chunking/embedding logic from chatbot |
| **Local-first approach** | No external dependencies, works offline, full control |

### Success Criteria

**Minimum Viable**:
- ChromaDB operational with 1,200+ chunks
- MCP server responding to agent queries
- 70%+ relevance on 10 test queries
- Query time < 2 seconds

**Stretch Goals**:
- 85%+ relevance on 20 diverse queries
- Auto-sync on doc changes (git hook)
- Integration with memory bank

---

## Architecture & Design

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   CONTENT SOURCES                            │
├─────────────────────────────────────────────────────────────┤
│ /docs/ (216 markdown files)                                 │
│ ├─ architecture/        → System design docs                │
│ ├─ chatbot/            → Chatbot architecture               │
│ ├─ implementation-plans/→ Feature specs                     │
│ ├─ audits-evals/       → Analysis reports                   │
│ └─ [other categories]  → Plans, designs, guides             │
│                                                              │
│ /memory-bank/CURRENT.md → Recent development history        │
│ CLAUDE.md               → Project instructions (optional)    │
└─────────────────────────────────────────────────────────────┘
                         ↓
         ┌───────────────────────────────┐
         │   INGESTION PIPELINE          │
         │   (Modified existing script)  │
         │                               │
         │  1. Read markdown files       │
         │  2. Extract metadata          │
         │  3. Chunk (800 chars, 200 overlap) │
         │  4. Generate embeddings       │
         │  5. Insert into ChromaDB      │
         └───────────────────────────────┘
                         ↓
         ┌───────────────────────────────┐
         │      CHROMADB (LOCAL)         │
         │   ~/chromadb-data/            │
         │                               │
         │  Collection: project-docs     │
         │  Chunks: ~1,200-1,500         │
         │  Embeddings: 768 dimensions   │
         │  Storage: ~15-20 MB           │
         └───────────────────────────────┘
                         ↓
         ┌───────────────────────────────────────────────────┐
         │         TYPESCRIPT API LIBRARY                     │
         │         src/lib/vector-db/client.ts               │
         │                                                    │
         │  export class ProjectVectorDB {                   │
         │    query(text, options?)                          │
         │    searchByCategory(category, query)              │
         │    getRecentDocs(days)                           │
         │    exportBackup(path)                             │
         │    getStats()                                     │
         │  }                                                 │
         └───────────────────────────────────────────────────┘
              ↓                    ↓                    ↓
    ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐
    │  MCP SERVER     │  │ BUILD SCRIPTS   │  │  CLI TOOLS   │
    │  (for agents)   │  │ (TypeScript)    │  │  (manual)    │
    ├─────────────────┤  ├─────────────────┤  ├──────────────┤
    │ Tools:          │  │ Zero tokens!    │  │ Commands:    │
    │ • query_project │  │                 │  │ • vector:query│
    │   _context      │  │ Example:        │  │ • vector:backup│
    │ • search_       │  │ Check stale docs│  │ • vector:stats│
    │   architecture  │  │ in CI/CD        │  │              │
    │ • get_recent_   │  │                 │  │ Example:     │
    │   decisions     │  │                 │  │ Manual debug │
    └─────────────────┘  └─────────────────┘  └──────────────┘
          ↓
    ┌─────────────────┐
    │ CLAUDE CODE     │
    │ AGENTS          │
    │                 │
    │ research →      │
    │ planning →      │
    │ coding →        │
    └─────────────────┘
    (uses tokens)
```

### Dual-Access Pattern (Critical Design)

**Why Two Access Paths?**

Without this pattern, every vector DB query would require an MCP tool call → token usage. This would make non-AI code (build scripts, CLI tools, migrations) expensive.

**Solution:**

1. **TypeScript API Library** (`src/lib/vector-db/client.ts`)
   - Shared library wrapping ChromaDB
   - Exportable functions for direct use
   - **Zero tokens**: Import and call directly
   - Used by: Build scripts, migrations, CLI tools, tests

2. **MCP Server** (`~/.claude/mcp-servers/project-context/`)
   - Thin wrapper around TypeScript API
   - Exposes tools for Claude Code agents
   - **Uses tokens**: AI makes tool calls
   - Used by: Claude Code agents only

**Token Savings Example:**

```typescript
// ❌ BAD: Every query uses tokens (via MCP)
// Build script needs to check stale docs
// Claude Code → MCP call → Query → Response
// Cost: ~200-500 tokens per query

// ✅ GOOD: Direct import, zero tokens
// Build script imports library directly
import { ProjectVectorDB } from '@/lib/vector-db/client';
const db = new ProjectVectorDB('./chromadb-data');
const staleDocs = await db.getRecentDocs(90);
// Cost: 0 tokens
```

### File Structure

```
project-root/
├── src/
│   └── lib/
│       └── vector-db/
│           ├── client.ts          # NEW: TypeScript API library
│           ├── types.ts           # NEW: Shared types
│           └── index.ts           # NEW: Public exports
│
├── scripts/
│   ├── vector-query.ts            # NEW: CLI query tool
│   ├── vector-backup.ts           # NEW: JSONL export
│   ├── vector-stats.ts            # NEW: Collection stats
│   └── ingest-docs-to-chromadb.ts # NEW: Ingestion script
│
├── ~/.claude/
│   └── mcp-servers/
│       └── project-context/
│           ├── package.json       # NEW: MCP server npm package
│           ├── tsconfig.json      # NEW: TypeScript config
│           ├── src/
│           │   └── index.ts       # NEW: MCP server implementation
│           └── dist/
│               └── index.js       # GENERATED: Compiled server
│
├── ~/chromadb-data/               # NEW: ChromaDB data directory
│   └── chroma.sqlite              # GENERATED: Vector DB file
│
├── ~/Library/Application Support/Claude/
│   └── claude_desktop_config.json # MODIFIED: Add MCP server config
│
└── docs/                          # EXISTING: Documentation corpus
    └── [216 markdown files]
```

### Technology Stack

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Vector DB** | ChromaDB | Latest | Local vector storage |
| **Embeddings** | Google Generative AI | text-embedding-004 | 768-dim embeddings |
| **MCP SDK** | @modelcontextprotocol/sdk | 1.0+ | Agent integration |
| **Runtime** | Node.js | 18+ | Server execution |
| **Language** | TypeScript | 5.8+ | Type safety |
| **Chunking** | Custom | Existing | Reuse chatbot logic |

### Design Decisions

#### 1. Why ChromaDB over Supabase?

**Pros**:
- ✅ **Zero-config**: No server setup, no credentials
- ✅ **File-based**: All data in one SQLite file
- ✅ **Git-friendly**: Export to JSONL, commit backups
- ✅ **Offline**: No network dependency
- ✅ **Fast**: In-memory operations for < 10K chunks
- ✅ **Simple backup**: Copy file or export to JSON

**Cons**:
- ❌ No web UI (vs Supabase dashboard)
- ❌ Not shared across machines (vs cloud DB)

**Decision**: ChromaDB wins for local development. Supabase remains for chatbot (different use case).

#### 2. Extend Existing Ingestion vs New Script?

**Option A: Extend `ingest-content.ts`** ✅ **CHOSEN**
- Reuse chunking logic (800 chars, 200 overlap)
- Reuse embedding generation (proven reliable)
- Minimal code duplication
- Same quality as chatbot

**Option B: New script**
- More flexibility
- Cleaner separation
- More maintenance overhead

**Decision**: Extend existing script. Code reuse > separation for POC.

#### 3. MCP Server Location?

**Option A: In project repo** (`/mcp-server/`)
- ❌ Mixes agent infra with app code
- ❌ Unclear separation of concerns

**Option B: User directory** (`~/.claude/mcp-servers/`) ✅ **CHOSEN**
- ✅ Standard MCP pattern
- ✅ Separate from project code
- ✅ Easier to share across projects
- ✅ Claude Code expects this location

#### 4. How to Handle Metadata?

**Metadata to Extract**:
```typescript
{
  source: 'documentation',        // vs 'memory-bank', 'config'
  category: 'architecture',       // subdirectory name
  title: 'CSS Architecture',      // filename or frontmatter
  path: 'docs/architecture/css-system.md',
  lastModified: '2025-11-01T10:30:00Z',
  docType: 'analysis',           // plan, audit, guide, research
  priority: 80,                  // 0-100, higher = more important
  tags: ['css', 'tailwind']      // from frontmatter (optional)
}
```

**Priority Weighting Logic**:
```typescript
function assignPriority(category: string, docType: string): number {
  if (category === 'architecture') return 90;
  if (category === 'chatbot') return 85;
  if (docType === 'plan' || docType === 'implementation') return 80;
  if (docType === 'guide' || docType === 'reference') return 75;
  if (docType === 'audit' || docType === 'analysis') return 70;
  if (docType === 'research') return 60;
  return 50; // Default
}
```

---

## Task Breakdown (Detailed)

### Task 1: ChromaDB Setup & Testing (1 hour)

**Description**: Install ChromaDB, verify local operation, test basic CRUD operations.

**Files to Create/Modify**:
- `package.json` (add chromadb dependency)
- `scripts/test-chromadb.ts` (test script)

**Implementation Details**:

1. **Install ChromaDB**:
   ```bash
   npm install chromadb
   ```

2. **Create test script** (`scripts/test-chromadb.ts`):
   ```typescript
   import { ChromaClient } from 'chromadb';
   import path from 'path';

   async function testChromaDB() {
     console.log('🧪 Testing ChromaDB setup...\n');

     // Initialize client
     const client = new ChromaClient({
       path: path.join(process.env.HOME!, 'chromadb-data')
     });

     // Create collection
     const collection = await client.createCollection({
       name: 'test-collection',
       metadata: { description: 'Test collection' }
     });

     // Add test document
     await collection.add({
       ids: ['test-1'],
       documents: ['This is a test document about architecture.'],
       embeddings: [Array(768).fill(0.1)], // Mock embedding
       metadatas: [{ source: 'test' }]
     });

     // Query collection
     const results = await collection.query({
       queryEmbeddings: [Array(768).fill(0.1)],
       nResults: 1
     });

     console.log('✅ ChromaDB working!');
     console.log('   Results:', results.documents[0]);

     // Clean up
     await client.deleteCollection({ name: 'test-collection' });
     console.log('✅ Test complete, collection deleted\n');
   }

   testChromaDB();
   ```

3. **Test execution**:
   ```bash
   tsx scripts/test-chromadb.ts
   ```

4. **Verify file creation**:
   ```bash
   ls -la ~/chromadb-data/
   # Should see chroma.sqlite
   ```

**Dependencies**: None (first task)

**Acceptance Criteria**:
- ✅ ChromaDB npm package installed
- ✅ Test script creates collection, adds doc, queries, deletes
- ✅ `~/chromadb-data/chroma.sqlite` file exists
- ✅ No errors in console output

**Hour Estimate**: 1 hour

**Risks**:
- ⚠️ ChromaDB installation issues
- **Mitigation**: Check Node.js version (18+), clear npm cache

---

### Task 2: TypeScript API Library Development (3-4 hours)

**Description**: Build shared library wrapping ChromaDB with project-specific functions.

**Files to Create**:
- `src/lib/vector-db/client.ts` (main client class)
- `src/lib/vector-db/types.ts` (TypeScript interfaces)
- `src/lib/vector-db/index.ts` (public exports)

**Implementation Details**:

#### File: `src/lib/vector-db/types.ts`

```typescript
/**
 * Vector Database Types
 */

export interface QueryResult {
  content: string;
  metadata: DocumentMetadata;
  score: number; // Similarity score (0-1, higher = more similar)
  distance: number; // Raw distance from ChromaDB
}

export interface DocumentMetadata {
  source: 'documentation' | 'memory-bank' | 'config';
  category?: string; // architecture, chatbot, design, etc.
  title?: string;
  path: string;
  lastModified?: string; // ISO 8601
  docType?: 'plan' | 'audit' | 'guide' | 'research' | 'implementation' | 'general';
  priority?: number; // 0-100
  tags?: string[];
  [key: string]: unknown; // Allow custom metadata
}

export interface VectorDocument {
  id: string;
  content: string;
  embedding: number[];
  metadata: DocumentMetadata;
}

export interface CollectionStats {
  totalDocs: number;
  categories: Record<string, number>;
  docTypes: Record<string, number>;
  lastUpdated: string;
  oldestDoc?: string;
  newestDoc?: string;
}

export interface QueryOptions {
  limit?: number; // Number of results (default: 5)
  threshold?: number; // Minimum similarity score (default: 0.7)
  category?: string; // Filter by category
  docType?: string; // Filter by doc type
  minPriority?: number; // Filter by priority threshold
}
```

#### File: `src/lib/vector-db/client.ts`

```typescript
/**
 * Project Vector Database Client
 * Wraps ChromaDB with project-specific functionality
 */

import { ChromaClient, Collection } from 'chromadb';
import { generateEmbedding } from '@/lib/chatbot/embeddings';
import type {
  QueryResult,
  DocumentMetadata,
  VectorDocument,
  CollectionStats,
  QueryOptions
} from './types';
import * as fs from 'fs';
import * as path from 'path';

export class ProjectVectorDB {
  private client: ChromaClient;
  private collection: Collection | null = null;
  private collectionName = 'project-docs';

  constructor(chromaPath?: string) {
    const dbPath = chromaPath || path.join(process.env.HOME!, 'chromadb-data');

    this.client = new ChromaClient({
      path: dbPath
    });
  }

  /**
   * Initialize connection and get or create collection
   */
  async initialize(): Promise<void> {
    try {
      this.collection = await this.client.getCollection({
        name: this.collectionName
      });
    } catch {
      // Collection doesn't exist, create it
      this.collection = await this.client.createCollection({
        name: this.collectionName,
        metadata: {
          description: 'Project documentation for Claude Code agents',
          createdAt: new Date().toISOString()
        }
      });
    }
  }

  /**
   * Ensure collection is initialized
   */
  private ensureCollection(): Collection {
    if (!this.collection) {
      throw new Error('Collection not initialized. Call initialize() first.');
    }
    return this.collection;
  }

  /**
   * Semantic search across all project documentation
   * @param query - Natural language question
   * @param options - Search options (limit, threshold, filters)
   * @returns Relevant document chunks with scores
   */
  async query(
    query: string,
    options: QueryOptions = {}
  ): Promise<QueryResult[]> {
    const collection = this.ensureCollection();
    const {
      limit = 5,
      threshold = 0.7,
      category,
      docType,
      minPriority
    } = options;

    // Generate embedding for query
    const embedding = await generateEmbedding(query);

    // Build filter
    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (docType) where.docType = docType;
    if (minPriority) where.priority = { $gte: minPriority };

    // Query ChromaDB
    const results = await collection.query({
      queryEmbeddings: [embedding],
      nResults: limit,
      where: Object.keys(where).length > 0 ? where : undefined,
    });

    // Transform results
    const queryResults: QueryResult[] = [];

    if (results.distances && results.distances[0]) {
      for (let i = 0; i < results.distances[0].length; i++) {
        const distance = results.distances[0][i];
        const score = 1 - distance; // Convert distance to similarity

        // Filter by threshold
        if (score >= threshold) {
          queryResults.push({
            content: results.documents[0][i],
            metadata: results.metadatas[0][i] as DocumentMetadata,
            score,
            distance,
          });
        }
      }
    }

    return queryResults;
  }

  /**
   * Search within a specific category
   * @param category - Doc category (architecture, chatbot, design, etc.)
   * @param query - Search query
   */
  async searchByCategory(
    category: string,
    query: string,
    options: Omit<QueryOptions, 'category'> = {}
  ): Promise<QueryResult[]> {
    return this.query(query, { ...options, category });
  }

  /**
   * Get recently modified documents
   * @param days - Number of days to look back
   */
  async getRecentDocs(days: number): Promise<VectorDocument[]> {
    const collection = this.ensureCollection();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const results = await collection.get({
      where: {
        lastModified: { $gte: cutoffDate.toISOString() }
      }
    });

    // Transform to VectorDocument format
    return results.ids.map((id, i) => ({
      id,
      content: results.documents?.[i] || '',
      embedding: results.embeddings?.[i] || [],
      metadata: results.metadatas?.[i] as DocumentMetadata || {},
    }));
  }

  /**
   * Add documents to collection
   */
  async addDocuments(documents: VectorDocument[]): Promise<void> {
    const collection = this.ensureCollection();

    await collection.add({
      ids: documents.map(d => d.id),
      documents: documents.map(d => d.content),
      embeddings: documents.map(d => d.embedding),
      metadatas: documents.map(d => d.metadata as Record<string, unknown>),
    });
  }

  /**
   * Delete all documents in collection
   */
  async clearCollection(): Promise<void> {
    const collection = this.ensureCollection();

    // Get all IDs
    const results = await collection.get();

    if (results.ids.length > 0) {
      await collection.delete({
        ids: results.ids
      });
    }
  }

  /**
   * Export collection to JSONL for backup
   */
  async exportBackup(outputPath: string): Promise<void> {
    const collection = this.ensureCollection();

    // Get all documents
    const results = await collection.get({
      include: ['documents', 'metadatas', 'embeddings']
    });

    // Convert to JSONL (one JSON object per line)
    const lines = results.ids.map((id, i) => {
      const doc = {
        id,
        content: results.documents?.[i] || '',
        metadata: results.metadatas?.[i] || {},
        embedding: results.embeddings?.[i] || [],
      };
      return JSON.stringify(doc);
    });

    const jsonl = lines.join('\n');
    fs.writeFileSync(outputPath, jsonl, 'utf-8');

    console.log(`✅ Exported ${lines.length} documents to ${outputPath}`);
  }

  /**
   * Import collection from JSONL backup
   */
  async importBackup(inputPath: string): Promise<void> {
    const collection = this.ensureCollection();

    // Read JSONL file
    const jsonl = fs.readFileSync(inputPath, 'utf-8');
    const lines = jsonl.trim().split('\n');

    const documents: VectorDocument[] = lines.map(line => {
      const parsed = JSON.parse(line);
      return {
        id: parsed.id,
        content: parsed.content,
        embedding: parsed.embedding,
        metadata: parsed.metadata,
      };
    });

    // Add to collection
    await this.addDocuments(documents);

    console.log(`✅ Imported ${documents.length} documents from ${inputPath}`);
  }

  /**
   * Get collection statistics
   */
  async getStats(): Promise<CollectionStats> {
    const collection = this.ensureCollection();

    // Get all documents
    const results = await collection.get({
      include: ['metadatas']
    });

    // Count by category
    const categories: Record<string, number> = {};
    const docTypes: Record<string, number> = {};
    let oldestDoc: string | undefined;
    let newestDoc: string | undefined;

    results.metadatas?.forEach(meta => {
      const metadata = meta as DocumentMetadata;

      // Count categories
      const cat = metadata.category || 'uncategorized';
      categories[cat] = (categories[cat] || 0) + 1;

      // Count doc types
      const type = metadata.docType || 'general';
      docTypes[type] = (docTypes[type] || 0) + 1;

      // Track oldest/newest
      if (metadata.lastModified) {
        if (!oldestDoc || metadata.lastModified < oldestDoc) {
          oldestDoc = metadata.lastModified;
        }
        if (!newestDoc || metadata.lastModified > newestDoc) {
          newestDoc = metadata.lastModified;
        }
      }
    });

    return {
      totalDocs: results.ids.length,
      categories,
      docTypes,
      lastUpdated: new Date().toISOString(),
      oldestDoc,
      newestDoc,
    };
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      const collection = this.ensureCollection();
      await collection.count();
      return true;
    } catch {
      return false;
    }
  }
}
```

#### File: `src/lib/vector-db/index.ts`

```typescript
/**
 * Vector Database Public API
 */

export { ProjectVectorDB } from './client';
export type {
  QueryResult,
  DocumentMetadata,
  VectorDocument,
  CollectionStats,
  QueryOptions
} from './types';
```

**Dependencies**: Task 1 (ChromaDB installed)

**Acceptance Criteria**:
- ✅ TypeScript compiles without errors
- ✅ All methods have JSDoc comments
- ✅ Types exported from index.ts
- ✅ Can import and instantiate ProjectVectorDB
- ✅ Basic query test passes

**Hour Estimate**: 3-4 hours

**Risks**:
- ⚠️ ChromaDB API changes or incompatibilities
- **Mitigation**: Use official SDK, check version compatibility
- ⚠️ Embedding function integration issues
- **Mitigation**: Reuse existing `generateEmbedding` from chatbot

---

### Task 3: Documentation Ingestion (2 hours)

**Description**: Create script to ingest `/docs/` folder into ChromaDB.

**Files to Create**:
- `scripts/ingest-docs-to-chromadb.ts`

**Implementation Details**:

```typescript
/**
 * Documentation Ingestion Script
 * Processes /docs/ folder and loads into ChromaDB
 */

import * as dotenv from 'dotenv';
import { resolve } from 'path';
import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';
import matter from 'gray-matter';
import { ProjectVectorDB } from '@/lib/vector-db';
import { chunkText, generateEmbeddings } from '@/lib/chatbot/embeddings';
import type { VectorDocument } from '@/lib/vector-db';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

/**
 * Classify document type from filename
 */
function classifyDocType(filename: string): string {
  const lower = filename.toLowerCase();
  if (lower.includes('plan')) return 'plan';
  if (lower.includes('audit') || lower.includes('analysis')) return 'audit';
  if (lower.includes('guide') || lower.includes('reference')) return 'guide';
  if (lower.includes('research')) return 'research';
  if (lower.includes('implementation')) return 'implementation';
  if (lower.includes('roadmap')) return 'roadmap';
  return 'general';
}

/**
 * Assign priority based on category and doc type
 */
function assignPriority(category: string, docType: string): number {
  if (category === 'architecture') return 90;
  if (category === 'chatbot') return 85;
  if (docType === 'plan' || docType === 'implementation') return 80;
  if (docType === 'guide' || docType === 'reference') return 75;
  if (docType === 'audit' || docType === 'analysis') return 70;
  if (docType === 'research') return 60;
  return 50;
}

/**
 * Load documentation files
 */
async function loadDocumentationFiles(docsDir: string) {
  const files = glob.sync(`${docsDir}/**/*.md`, {
    ignore: ['**/node_modules/**', '**/_archive/**']
  });

  console.log(`📂 Found ${files.length} markdown files in ${docsDir}`);

  const documents: Array<{
    content: string;
    metadata: Record<string, unknown>;
  }> = [];

  for (const filePath of files) {
    // Read file
    const rawContent = fs.readFileSync(filePath, 'utf-8');

    // Parse frontmatter
    const { data: frontmatter, content } = matter(rawContent);

    // Extract metadata from path
    const relativePath = path.relative(docsDir, filePath);
    const parts = relativePath.split('/');
    const category = parts.length > 1 ? parts[0] : 'general';
    const filename = path.basename(filePath, '.md');
    const docType = classifyDocType(filename);
    const priority = assignPriority(category, docType);

    // Get file stats
    const stats = fs.statSync(filePath);

    documents.push({
      content,
      metadata: {
        source: 'documentation',
        category,
        title: frontmatter.title || filename,
        path: relativePath,
        docType,
        priority,
        lastModified: stats.mtime.toISOString(),
        tags: frontmatter.tags || [],
        ...frontmatter, // Include any other frontmatter
      }
    });
  }

  return documents;
}

/**
 * Main ingestion function
 */
async function ingestDocumentation() {
  console.log('🚀 Starting documentation ingestion to ChromaDB...\n');

  try {
    const docsDir = path.join(process.cwd(), 'docs');
    const clearExisting = process.argv.includes('--clear');

    // Initialize vector DB
    console.log('🔌 Connecting to ChromaDB...');
    const vectorDB = new ProjectVectorDB();
    await vectorDB.initialize();
    console.log('✅ Connected to ChromaDB\n');

    // Clear existing if requested
    if (clearExisting) {
      console.log('🗑️  Clearing existing documents...');
      await vectorDB.clearCollection();
      console.log('✅ Cleared existing documents\n');
    }

    // Load documentation files
    console.log('📖 Loading documentation files...');
    const documents = await loadDocumentationFiles(docsDir);
    console.log(`✅ Loaded ${documents.length} documents\n`);

    // Process documents (chunk + embed)
    console.log('🔄 Processing documents (chunking and generating embeddings)...');
    console.log('   This may take a few minutes...\n');

    const allChunks: VectorDocument[] = [];
    let docIndex = 0;

    for (const doc of documents) {
      docIndex++;
      console.log(`   [${docIndex}/${documents.length}] Processing: ${doc.metadata.title}`);

      // Chunk text
      const chunks = chunkText(doc.content);

      // Generate embeddings for all chunks
      const embeddings = await generateEmbeddings(chunks);

      // Create vector documents
      chunks.forEach((chunk, chunkIndex) => {
        const id = `${doc.metadata.path}-chunk-${chunkIndex}`;
        allChunks.push({
          id,
          content: chunk,
          embedding: embeddings[chunkIndex],
          metadata: {
            ...doc.metadata,
            chunkIndex,
            totalChunks: chunks.length,
          } as any,
        });
      });
    }

    console.log(`\n✅ Generated ${allChunks.length} chunks with embeddings\n`);

    // Insert into ChromaDB
    console.log('💾 Inserting chunks into ChromaDB...');
    await vectorDB.addDocuments(allChunks);
    console.log(`✅ Inserted ${allChunks.length} chunks\n`);

    // Get statistics
    console.log('📊 Collection Statistics:');
    const stats = await vectorDB.getStats();
    console.log(`   Total documents: ${stats.totalDocs}`);
    console.log(`   Categories: ${Object.keys(stats.categories).length}`);
    console.log(`   Oldest doc: ${stats.oldestDoc}`);
    console.log(`   Newest doc: ${stats.newestDoc}\n`);

    console.log('   Documents by category:');
    Object.entries(stats.categories)
      .sort(([, a], [, b]) => b - a)
      .forEach(([category, count]) => {
        console.log(`     - ${category}: ${count} chunks`);
      });

    console.log('\n✅ Documentation ingestion complete!');
    console.log('\n🎉 ChromaDB now contains:');
    console.log('   ✓ Project documentation (architecture, plans, audits)');
    console.log('   ✓ Ready for semantic queries via MCP or API\n');
  } catch (error) {
    console.error('\n❌ Error during ingestion:', error);
    if (error instanceof Error) {
      console.error(`   ${error.message}`);
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Run ingestion
ingestDocumentation();
```

**Package.json update**:
```json
{
  "scripts": {
    "ingest:docs": "tsx --env-file=.env.local scripts/ingest-docs-to-chromadb.ts",
    "ingest:docs:clear": "tsx --env-file=.env.local scripts/ingest-docs-to-chromadb.ts --clear"
  }
}
```

**Dependencies**: Task 2 (TypeScript API library)

**Acceptance Criteria**:
- ✅ Script processes all 216 markdown files
- ✅ Generates ~1,200-1,500 chunks
- ✅ All chunks have embeddings
- ✅ Metadata extracted correctly (category, docType, priority)
- ✅ ChromaDB contains all chunks
- ✅ No embedding API errors

**Hour Estimate**: 2 hours

**Risks**:
- ⚠️ Google API rate limits (100 embeddings/minute)
- **Mitigation**: Add delays between batches, retry logic
- ⚠️ Large files causing memory issues
- **Mitigation**: Process in batches, stream large files

---

### Task 4: MCP Server Development (2-3 hours)

**Description**: Build MCP server wrapping TypeScript API for Claude Code agents.

**Files to Create**:
- `~/.claude/mcp-servers/project-context/package.json`
- `~/.claude/mcp-servers/project-context/tsconfig.json`
- `~/.claude/mcp-servers/project-context/src/index.ts`

**Implementation Details**:

#### File: `~/.claude/mcp-servers/project-context/package.json`

```json
{
  "name": "project-context-mcp-server",
  "version": "1.0.0",
  "description": "MCP server for querying project documentation via vector DB",
  "main": "dist/index.js",
  "type": "module",
  "scripts": {
    "build": "tsc",
    "watch": "tsc --watch",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0",
    "chromadb": "^1.8.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.8.0"
  }
}
```

#### File: `~/.claude/mcp-servers/project-context/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "node",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

#### File: `~/.claude/mcp-servers/project-context/src/index.ts`

```typescript
#!/usr/bin/env node

/**
 * Project Context MCP Server
 * Exposes project documentation via MCP protocol for Claude Code agents
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { ChromaClient } from 'chromadb';

// Environment variables
const CHROMADB_PATH = process.env.CHROMADB_PATH || `${process.env.HOME}/chromadb-data`;
const GOOGLE_API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

// Validate environment
if (!GOOGLE_API_KEY) {
  console.error('❌ GOOGLE_GENERATIVE_AI_API_KEY not set');
  process.exit(1);
}

// Simple embedding function (replicates chatbot logic)
async function generateEmbedding(text: string): Promise<number[]> {
  // Import dynamically to avoid issues
  const { embed } = await import('ai');
  const { google } = await import('@ai-sdk/google');

  const { embedding } = await embed({
    model: google.textEmbeddingModel('text-embedding-004'),
    value: text,
  });

  return embedding;
}

// Initialize ChromaDB
const chromaClient = new ChromaClient({ path: CHROMADB_PATH });
let collection: any = null;

async function initializeCollection() {
  try {
    collection = await chromaClient.getCollection({ name: 'project-docs' });
    console.error('✅ Connected to project-docs collection');
  } catch (error) {
    console.error('❌ Failed to connect to ChromaDB collection:', error);
    throw error;
  }
}

// Define MCP tools
const TOOLS: Tool[] = [
  {
    name: 'query_project_context',
    description: 'Search project documentation using semantic search. Returns relevant documentation chunks for architecture, implementation patterns, decisions, and project context.',
    inputSchema: {
      type: 'object',
      properties: {
        question: {
          type: 'string',
          description: 'Natural language question or search query (e.g., "How does the styling system work?", "What are recent architectural decisions?")',
        },
        limit: {
          type: 'number',
          description: 'Number of results to return (default: 5, max: 10)',
          default: 5,
        },
        threshold: {
          type: 'number',
          description: 'Minimum similarity score (0-1, default: 0.7)',
          default: 0.7,
        },
      },
      required: ['question'],
    },
  },
  {
    name: 'search_architecture',
    description: 'Search specifically within architecture documentation. Use this when you need to understand system design, patterns, or technical architecture.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Architecture-specific search query',
        },
        limit: {
          type: 'number',
          description: 'Number of results (default: 5)',
          default: 5,
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_recent_decisions',
    description: 'Get recently modified documentation to understand recent decisions, changes, and updates to the project.',
    inputSchema: {
      type: 'object',
      properties: {
        days: {
          type: 'number',
          description: 'Number of days to look back (default: 7)',
          default: 7,
        },
      },
      required: [],
    },
  },
];

// Create MCP server
const server = new Server(
  {
    name: 'project-context',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Handle tool listing
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS,
}));

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (!collection) {
      await initializeCollection();
    }

    switch (name) {
      case 'query_project_context': {
        const { question, limit = 5, threshold = 0.7 } = args as {
          question: string;
          limit?: number;
          threshold?: number;
        };

        console.error(`🔍 Query: "${question}" (limit: ${limit}, threshold: ${threshold})`);

        // Generate embedding
        const embedding = await generateEmbedding(question);

        // Query ChromaDB
        const results = await collection.query({
          queryEmbeddings: [embedding],
          nResults: Math.min(limit, 10),
        });

        // Format results
        const formattedResults = [];
        if (results.distances && results.distances[0]) {
          for (let i = 0; i < results.distances[0].length; i++) {
            const distance = results.distances[0][i];
            const score = 1 - distance;

            if (score >= threshold) {
              formattedResults.push({
                content: results.documents[0][i],
                metadata: results.metadatas[0][i],
                score: score.toFixed(3),
              });
            }
          }
        }

        console.error(`   Found ${formattedResults.length} results above threshold`);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(formattedResults, null, 2),
            },
          ],
        };
      }

      case 'search_architecture': {
        const { query, limit = 5 } = args as { query: string; limit?: number };

        console.error(`🏗️  Architecture search: "${query}"`);

        // Generate embedding
        const embedding = await generateEmbedding(query);

        // Query with category filter
        const results = await collection.query({
          queryEmbeddings: [embedding],
          nResults: limit,
          where: { category: 'architecture' },
        });

        const formattedResults = [];
        if (results.documents && results.documents[0]) {
          for (let i = 0; i < results.documents[0].length; i++) {
            formattedResults.push({
              content: results.documents[0][i],
              metadata: results.metadatas[0][i],
              score: (1 - (results.distances?.[0]?.[i] || 0)).toFixed(3),
            });
          }
        }

        console.error(`   Found ${formattedResults.length} architecture docs`);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(formattedResults, null, 2),
            },
          ],
        };
      }

      case 'get_recent_decisions': {
        const { days = 7 } = args as { days?: number };

        console.error(`📅 Getting docs from last ${days} days`);

        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        const results = await collection.get({
          where: {
            lastModified: { $gte: cutoffDate.toISOString() },
          },
        });

        const formattedResults = results.ids.map((id: string, i: number) => ({
          id,
          content: results.documents?.[i] || '',
          metadata: results.metadatas?.[i] || {},
        }));

        console.error(`   Found ${formattedResults.length} recent documents`);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(formattedResults, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    console.error(`❌ Error handling ${name}:`, error);
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        },
      ],
      isError: true,
    };
  }
});

// Start server
async function main() {
  // Initialize collection on startup
  await initializeCollection();

  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('🚀 Project Context MCP Server started');
  console.error(`   ChromaDB path: ${CHROMADB_PATH}`);
  console.error(`   Collection: project-docs`);
  console.error('   Waiting for requests...\n');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
```

**Setup Commands**:
```bash
# Create directory
mkdir -p ~/.claude/mcp-servers/project-context/src

# Copy files (package.json, tsconfig.json, src/index.ts)

# Install dependencies
cd ~/.claude/mcp-servers/project-context
npm install

# Build
npm run build

# Test (manual)
echo '{"jsonrpc":"2.0","method":"tools/list","id":1}' | node dist/index.js
```

**Dependencies**: Task 2 (TypeScript API), Task 3 (ChromaDB populated)

**Acceptance Criteria**:
- ✅ MCP server compiles without errors
- ✅ Server responds to `tools/list` request
- ✅ All 3 tools defined (query, search_architecture, get_recent_decisions)
- ✅ Manual test query returns results
- ✅ Error handling works (invalid queries, missing collection)

**Hour Estimate**: 2-3 hours

**Risks**:
- ⚠️ MCP SDK API changes
- **Mitigation**: Use stable version, check official examples
- ⚠️ stdio transport issues
- **Mitigation**: Test with manual JSON-RPC messages first

---

### Task 5: CLI Tools Development (1 hour)

**Description**: Create command-line tools for manual vector DB access.

**Files to Create**:
- `scripts/vector-query.ts`
- `scripts/vector-backup.ts`
- `scripts/vector-stats.ts`

**Implementation Details**:

#### File: `scripts/vector-query.ts`

```typescript
/**
 * CLI Query Tool
 * Usage: npm run vector:query "How does the styling system work?"
 */

import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { ProjectVectorDB } from '@/lib/vector-db';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

async function queryVectorDB() {
  const query = process.argv[2];

  if (!query) {
    console.error('Usage: npm run vector:query "your question here"');
    process.exit(1);
  }

  console.log(`🔍 Querying: "${query}"\n`);

  try {
    const vectorDB = new ProjectVectorDB();
    await vectorDB.initialize();

    const results = await vectorDB.query(query, {
      limit: 5,
      threshold: 0.7,
    });

    console.log(`📊 Found ${results.length} results:\n`);

    results.forEach((result, i) => {
      console.log(`${i + 1}. Score: ${result.score.toFixed(3)}`);
      console.log(`   File: ${result.metadata.path}`);
      console.log(`   Category: ${result.metadata.category}`);
      console.log(`   Type: ${result.metadata.docType}`);
      console.log(`   Content: ${result.content.substring(0, 200)}...`);
      console.log('');
    });
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

queryVectorDB();
```

#### File: `scripts/vector-backup.ts`

```typescript
/**
 * Backup Tool
 * Usage: npm run vector:backup
 */

import * as dotenv from 'dotenv';
import { resolve } from 'path';
import * as path from 'path';
import { ProjectVectorDB } from '@/lib/vector-db';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

async function backupVectorDB() {
  const timestamp = new Date().toISOString().split('T')[0];
  const outputPath = path.join(
    process.cwd(),
    'backups',
    `vector-db-${timestamp}.jsonl`
  );

  console.log(`💾 Backing up ChromaDB to ${outputPath}...\n`);

  try {
    const vectorDB = new ProjectVectorDB();
    await vectorDB.initialize();

    await vectorDB.exportBackup(outputPath);

    console.log('✅ Backup complete!\n');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

backupVectorDB();
```

#### File: `scripts/vector-stats.ts`

```typescript
/**
 * Statistics Tool
 * Usage: npm run vector:stats
 */

import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { ProjectVectorDB } from '@/lib/vector-db';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

async function showStats() {
  console.log('📊 ChromaDB Statistics\n');

  try {
    const vectorDB = new ProjectVectorDB();
    await vectorDB.initialize();

    const stats = await vectorDB.getStats();

    console.log(`Total Documents: ${stats.totalDocs}`);
    console.log(`Last Updated: ${stats.lastUpdated}`);
    console.log(`Oldest Doc: ${stats.oldestDoc}`);
    console.log(`Newest Doc: ${stats.newestDoc}\n`);

    console.log('Categories:');
    Object.entries(stats.categories)
      .sort(([, a], [, b]) => b - a)
      .forEach(([category, count]) => {
        console.log(`  ${category}: ${count} chunks`);
      });

    console.log('\nDocument Types:');
    Object.entries(stats.docTypes)
      .sort(([, a], [, b]) => b - a)
      .forEach(([type, count]) => {
        console.log(`  ${type}: ${count} chunks`);
      });

    console.log('');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

showStats();
```

**Package.json update**:
```json
{
  "scripts": {
    "vector:query": "tsx --env-file=.env.local scripts/vector-query.ts",
    "vector:backup": "tsx --env-file=.env.local scripts/vector-backup.ts",
    "vector:stats": "tsx --env-file=.env.local scripts/vector-stats.ts"
  }
}
```

**Dependencies**: Task 2 (TypeScript API), Task 3 (ChromaDB populated)

**Acceptance Criteria**:
- ✅ All 3 CLI tools work
- ✅ Query tool returns formatted results
- ✅ Backup tool exports to JSONL
- ✅ Stats tool shows collection info
- ✅ Error messages are clear

**Hour Estimate**: 1 hour

**Risks**: None (straightforward scripting)

---

### Task 6: Claude Code Integration (1 hour)

**Description**: Configure Claude Code to load MCP server.

**Files to Modify**:
- `~/Library/Application Support/Claude/claude_desktop_config.json`

**Implementation Details**:

#### File: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "project-context": {
      "command": "node",
      "args": [
        "/Users/michaelevans/.claude/mcp-servers/project-context/dist/index.js"
      ],
      "env": {
        "CHROMADB_PATH": "/Users/michaelevans/chromadb-data",
        "GOOGLE_GENERATIVE_AI_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

**Setup Steps**:

1. **Locate config file**:
   ```bash
   open ~/Library/Application\ Support/Claude/
   ```

2. **Edit or create `claude_desktop_config.json`**:
   - Add MCP server configuration
   - Update paths to absolute paths
   - Add Google API key from `.env.local`

3. **Restart Claude Code**:
   - Quit Claude Code completely
   - Reopen Claude Code

4. **Verify MCP server loaded**:
   - In Claude Code chat, type `/mcp`
   - Should see `project-context` server listed
   - Should see 3 tools available

5. **Test basic query**:
   ```
   User: Use the query_project_context tool to search for "styling system"

   Agent: [Makes MCP tool call]

   Expected: Returns top 5 docs about CSS/Tailwind patterns
   ```

**Dependencies**: Task 4 (MCP server built)

**Acceptance Criteria**:
- ✅ Config file updated with correct paths
- ✅ Claude Code recognizes MCP server
- ✅ Tools are discoverable (`/mcp` command)
- ✅ Test query returns results
- ✅ No errors in Claude Code console

**Hour Estimate**: 1 hour

**Risks**:
- ⚠️ Path issues (relative vs absolute)
- **Mitigation**: Use full absolute paths, test in terminal first
- ⚠️ API key not found
- **Mitigation**: Check `.env.local`, copy correct key

---

### Task 7: Evaluation & Testing (1-2 hours)

**Description**: Test query quality with diverse test queries.

**Files to Create**:
- `docs/claude-code-vectordb-evaluation-report.md`

**Implementation Details**:

#### Test Queries (10 Diverse Scenarios)

```typescript
const TEST_QUERIES = [
  {
    id: 1,
    query: "What's the styling system and what patterns should I follow?",
    expectedCategory: 'architecture',
    expectedDocs: ['component-styling-patterns.md', 'css-quick-reference.md'],
  },
  {
    id: 2,
    query: "How does Sanity CMS integration work?",
    expectedCategory: 'chatbot',
    expectedDocs: ['MAINTAINABLE-CONTENT-SYSTEM.md', 'SANITY-CACHING-GUIDE.md'],
  },
  {
    id: 3,
    query: "What's the chatbot architecture?",
    expectedCategory: 'chatbot',
    expectedDocs: ['MAINTAINABLE-CONTENT-SYSTEM.md'],
  },
  {
    id: 4,
    query: "How do I add a new schema to Sanity?",
    expectedCategory: 'general',
    expectedDocs: ['cms-schema-cleanup-plan.md'],
  },
  {
    id: 5,
    query: "What are recent architectural decisions?",
    expectedCategory: 'architecture',
    expectedDocs: ['codebase-audit-2025-11-01.md'],
  },
  {
    id: 6,
    query: "How does the navigation system work?",
    expectedCategory: 'general',
    expectedDocs: ['mobile-nav-hide-on-scroll-plan.md'],
  },
  {
    id: 7,
    query: "What testing patterns are used?",
    expectedCategory: 'general',
    expectedDocs: ['testing-strategy-research-2025-11-04.md'],
  },
  {
    id: 8,
    query: "How is the memory bank used?",
    expectedCategory: 'general',
    expectedDocs: ['claude-code-vector-db-concept.md'],
  },
  {
    id: 9,
    query: "How is dark mode implemented?",
    expectedCategory: 'architecture',
    expectedDocs: ['css-phase4-dark-mode-complete.md'],
  },
  {
    id: 10,
    query: "What's the process for adding new features?",
    expectedCategory: 'general',
    expectedDocs: ['CLAUDE.md'],
  },
];
```

#### Evaluation Script

```typescript
// scripts/evaluate-vector-db.ts

import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { ProjectVectorDB } from '@/lib/vector-db';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const TEST_QUERIES = [...]; // From above

async function evaluateQueries() {
  console.log('🧪 Evaluating Vector DB Query Quality\n');

  const vectorDB = new ProjectVectorDB();
  await vectorDB.initialize();

  const results = [];

  for (const testCase of TEST_QUERIES) {
    console.log(`\n[${testCase.id}/10] Query: "${testCase.query}"`);

    const queryResults = await vectorDB.query(testCase.query, {
      limit: 5,
      threshold: 0.6, // Lower threshold for evaluation
    });

    // Check if expected docs are in results
    const topFiles = queryResults.map(r => r.metadata.path);
    const foundExpected = testCase.expectedDocs.some(expected =>
      topFiles.some(file => file.includes(expected))
    );

    const topScore = queryResults[0]?.score || 0;

    const evaluation = {
      query: testCase.query,
      topScore,
      resultsCount: queryResults.length,
      foundExpected,
      topFiles: topFiles.slice(0, 3),
    };

    results.push(evaluation);

    console.log(`   Top score: ${topScore.toFixed(3)}`);
    console.log(`   Results: ${queryResults.length}`);
    console.log(`   Expected found: ${foundExpected ? '✅' : '❌'}`);
  }

  // Summary
  const successRate = results.filter(r => r.foundExpected).length / results.length;
  const avgTopScore = results.reduce((sum, r) => sum + r.topScore, 0) / results.length;

  console.log('\n\n📊 Evaluation Summary:');
  console.log(`   Success rate: ${(successRate * 100).toFixed(1)}%`);
  console.log(`   Avg top score: ${avgTopScore.toFixed(3)}`);
  console.log(`   Total queries: ${results.length}`);
  console.log(`   Successful: ${results.filter(r => r.foundExpected).length}`);
  console.log(`   Failed: ${results.filter(r => !r.foundExpected).length}`);

  // Save detailed report
  const report = {
    timestamp: new Date().toISOString(),
    summary: { successRate, avgTopScore },
    results,
  };

  console.log('\n📄 Full report saved to evaluation-report.json\n');

  const fs = await import('fs');
  fs.writeFileSync(
    'evaluation-report.json',
    JSON.stringify(report, null, 2)
  );
}

evaluateQueries();
```

**Test via MCP and Direct API**:

1. **Direct API Test**:
   ```bash
   npm run evaluate-vector-db
   ```

2. **MCP Test** (manual in Claude Code):
   ```
   Test each of the 10 queries using query_project_context tool
   Rate relevance subjectively
   ```

**Dependencies**: All previous tasks

**Acceptance Criteria**:
- ✅ 10 test queries executed
- ✅ Success rate ≥ 70% (7+ queries find expected docs)
- ✅ Average top score ≥ 0.75
- ✅ Both MCP and direct API tested
- ✅ Evaluation report generated

**Hour Estimate**: 1-2 hours

**Risks**:
- ⚠️ Low relevance scores (<70%)
- **Mitigation**: Tune threshold, adjust chunking, improve metadata
- ⚠️ Missing expected docs
- **Mitigation**: Check ingestion, verify docs exist

---

## File-by-File Specifications

### src/lib/vector-db/client.ts

**Purpose**: Shared library wrapping ChromaDB with project-specific functionality

**Key Exports**:
```typescript
export class ProjectVectorDB {
  constructor(chromaPath?: string)
  async initialize(): Promise<void>
  async query(query: string, options?: QueryOptions): Promise<QueryResult[]>
  async searchByCategory(category: string, query: string): Promise<QueryResult[]>
  async getRecentDocs(days: number): Promise<VectorDocument[]>
  async addDocuments(documents: VectorDocument[]): Promise<void>
  async clearCollection(): Promise<void>
  async exportBackup(outputPath: string): Promise<void>
  async importBackup(inputPath: string): Promise<void>
  async getStats(): Promise<CollectionStats>
  async healthCheck(): Promise<boolean>
}
```

**TypeScript Interfaces**: See Task 2 for full types

**Example Usage**:
```typescript
import { ProjectVectorDB } from '@/lib/vector-db';

const db = new ProjectVectorDB();
await db.initialize();

const results = await db.query('How does styling work?', {
  limit: 5,
  threshold: 0.7
});

console.log(results[0].content);
```

### scripts/ingest-docs-to-chromadb.ts

**Purpose**: Ingest `/docs/` folder into ChromaDB

**Key Functions**:
- `classifyDocType(filename: string): string`
- `assignPriority(category: string, docType: string): number`
- `loadDocumentationFiles(docsDir: string): Promise<Document[]>`
- `ingestDocumentation(): Promise<void>`

**Example Execution**:
```bash
npm run ingest:docs
# Or clear first:
npm run ingest:docs:clear
```

### ~/.claude/mcp-servers/project-context/src/index.ts

**Purpose**: MCP server exposing vector DB tools to Claude Code agents

**MCP Tools**:
1. `query_project_context` - Semantic search
2. `search_architecture` - Category-filtered search
3. `get_recent_decisions` - Time-based retrieval

**Example MCP Call** (JSON-RPC):
```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "query_project_context",
    "arguments": {
      "question": "How does Sanity work?",
      "limit": 5
    }
  },
  "id": 1
}
```

### scripts/vector-query.ts

**Purpose**: CLI tool for manual queries

**Usage**:
```bash
npm run vector:query "How does the chatbot work?"
```

**Output**:
```
🔍 Querying: "How does the chatbot work?"

📊 Found 5 results:

1. Score: 0.892
   File: docs/chatbot/MAINTAINABLE-CONTENT-SYSTEM.md
   Category: chatbot
   Type: guide
   Content: The chatbot uses a vector database...
```

---

## Integration Points

### TypeScript API → MCP Server

**How MCP Server Uses API**:
```typescript
// MCP server imports library
import { ProjectVectorDB } from '@/lib/vector-db';

// Initializes once on startup
const vectorDB = new ProjectVectorDB();
await vectorDB.initialize();

// Tool calls delegate to library
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === 'query_project_context') {
    const { question } = request.params.arguments;

    // Direct call to library (no duplication)
    const results = await vectorDB.query(question);

    return { content: [{ type: 'text', text: JSON.stringify(results) }] };
  }
});
```

**Benefits**:
- No code duplication
- Easier to test (test library directly)
- MCP server is thin wrapper
- Can update library without touching MCP

### Ingestion → Existing Chatbot Logic

**Reuse Strategy**:
```typescript
// Import existing functions
import { chunkText, generateEmbeddings } from '@/lib/chatbot/embeddings';

// Use identical chunking
const chunks = chunkText(content); // 800 chars, 200 overlap

// Use identical embedding generation
const embeddings = await generateEmbeddings(chunks); // Google text-embedding-004
```

**Why This Matters**:
- Proven reliability (chatbot already works)
- Same quality as user-facing chatbot
- No need to tune from scratch
- Easier to maintain (one chunking strategy)

### Claude Code → MCP Server

**Connection Flow**:
```
1. User opens Claude Code
2. Claude Code reads ~/Library/Application Support/Claude/claude_desktop_config.json
3. Spawns MCP server as child process: node dist/index.js
4. Establishes stdio transport (stdin/stdout)
5. Sends tools/list request → MCP server responds with 3 tools
6. Agent makes tools/call request → MCP server queries ChromaDB → returns results
```

**Configuration**:
- Must be absolute paths (no `~`, no relative)
- Environment variables must be explicit
- Server must write logs to stderr (stdout is for JSON-RPC)

---

## Testing Strategy

### Unit Tests

**What to Test**:
- TypeScript API functions (query, searchByCategory, getRecentDocs)
- Metadata extraction (classifyDocType, assignPriority)
- Error handling (missing collection, invalid queries)

**Framework**: Vitest (already in project)

**Example Test**:
```typescript
import { describe, it, expect, beforeAll } from 'vitest';
import { ProjectVectorDB } from '@/lib/vector-db';

describe('ProjectVectorDB', () => {
  let db: ProjectVectorDB;

  beforeAll(async () => {
    db = new ProjectVectorDB();
    await db.initialize();
  });

  it('should query and return results', async () => {
    const results = await db.query('styling system', { limit: 5 });
    expect(results).toHaveLength(5);
    expect(results[0]).toHaveProperty('content');
    expect(results[0]).toHaveProperty('score');
  });

  it('should filter by category', async () => {
    const results = await db.searchByCategory('architecture', 'patterns');
    expect(results.every(r => r.metadata.category === 'architecture')).toBe(true);
  });
});
```

### Integration Tests (MCP + API)

**What to Test**:
- MCP server responds to tools/list
- MCP server handles tools/call correctly
- Results match between MCP and direct API
- Error handling (invalid requests, missing params)

**Manual Testing**:
```bash
# 1. Start MCP server manually
cd ~/.claude/mcp-servers/project-context
node dist/index.js

# 2. Send JSON-RPC via stdin
echo '{"jsonrpc":"2.0","method":"tools/list","id":1}' | node dist/index.js

# 3. Expected: {"jsonrpc":"2.0","result":{"tools":[...]}}
```

### Manual Testing (Query Quality)

**Process**:
1. Run 10 test queries (see Task 7)
2. Rate each result:
   - **Highly Relevant** (0.8-1.0): Answers question directly
   - **Relevant** (0.6-0.79): Contains useful info
   - **Somewhat Relevant** (0.4-0.59): Tangentially related
   - **Not Relevant** (< 0.4): Wrong topic
3. Calculate metrics:
   - Success rate: % with top result ≥ 0.7
   - Average top score
   - Coverage: Did we find expected docs?

**Success Criteria**:
- **Minimum**: 70% success rate (7/10 queries)
- **Target**: 85% success rate (8-9/10 queries)
- **Stretch**: 100% success rate (10/10 queries)

### Performance Testing

**Metrics to Measure**:
- Query time (embedding generation + vector search)
- Memory usage (ChromaDB collection size)
- Startup time (MCP server initialization)

**Targets**:
- Query time: < 2 seconds
- Memory: < 100 MB
- Startup: < 5 seconds

**How to Measure**:
```typescript
const start = Date.now();
const results = await vectorDB.query('test');
const elapsed = Date.now() - start;
console.log(`Query took ${elapsed}ms`);
```

---

## Rollback Plan

### What If ChromaDB Doesn't Work?

**Symptoms**:
- Installation fails
- Collection operations error
- Performance unacceptable

**Rollback Options**:

1. **Switch to local PostgreSQL + pgvector**:
   ```bash
   brew install postgresql pgvector
   # Modify client to use pg instead of chromadb
   # Same API, different backend
   ```

2. **Use Supabase for both**:
   - Add `/docs/` to existing chatbot ingestion
   - MCP server queries Supabase instead
   - Slower (network calls) but proven reliable

3. **Abandon vector DB, use grep**:
   - Fall back to `Grep` tool in Claude Code
   - Less semantic, but functional
   - No POC value, but unblocks agents

### What If Query Quality Is Poor (<70%)?

**Diagnosis**:
- Check which queries failed
- Inspect returned results (are they close but not exact?)
- Review chunk content (are chunks too small/large?)

**Fixes**:

1. **Tune match_threshold**:
   - Lower to 0.6 (more results, potentially less precise)
   - Or raise to 0.8 (fewer results, more precise)

2. **Adjust chunking**:
   - Increase chunk size to 1000 chars (more context per chunk)
   - Reduce overlap to 100 chars (less redundancy)

3. **Improve metadata**:
   - Add manual tags to critical docs
   - Boost priority of key files
   - Add aliases for common terms

4. **Hybrid search**:
   - Combine vector search with keyword filtering
   - Use multiple queries and merge results

### How to Revert Changes Safely?

**What Was Modified**:
- `package.json` (scripts added)
- `~/Library/Application Support/Claude/claude_desktop_config.json` (MCP config)
- New directories created

**Revert Steps**:
```bash
# 1. Remove MCP server config
# Edit claude_desktop_config.json, delete "project-context" entry

# 2. Delete ChromaDB data
rm -rf ~/chromadb-data

# 3. Delete MCP server
rm -rf ~/.claude/mcp-servers/project-context

# 4. Remove project files
rm -rf src/lib/vector-db
rm scripts/ingest-docs-to-chromadb.ts
rm scripts/vector-*.ts

# 5. Restore package.json
git checkout package.json

# 6. Restart Claude Code
```

**No Impact On**:
- User-facing chatbot (different DB)
- Production site (no changes)
- Existing documentation (read-only)

---

## Timeline & Milestones

### Day 1 (6-8 hours)

**Morning (3-4 hours)**:
- ☐ Task 1: ChromaDB Setup (1 hour)
  - Install, test basic operations, verify file storage
- ☐ Task 2: TypeScript API Library (3-4 hours)
  - Build client.ts, types.ts, index.ts
  - Write basic tests

**Afternoon (3-4 hours)**:
- ☐ Task 3: Documentation Ingestion (2 hours)
  - Create ingestion script
  - Run initial ingestion
  - Verify ChromaDB contains chunks
- ☐ Task 4 (partial): MCP Server Setup (1-2 hours)
  - Scaffold MCP server directory
  - Create package.json, tsconfig.json
  - Start implementation

**Day 1 Checkpoint**:
- ✅ ChromaDB operational
- ✅ TypeScript API working
- ✅ 1,200+ chunks ingested
- ✅ Can query via direct API

**Go/No-Go Decision**:
- If query quality is terrible (<50%), pause and diagnose
- If ChromaDB unstable, consider switching to Postgres
- Otherwise, proceed to Day 2

---

### Day 2 (4-6 hours)

**Morning (2-3 hours)**:
- ☐ Task 4 (complete): MCP Server (1-2 hours)
  - Finish implementation
  - Build and test manually
- ☐ Task 5: CLI Tools (1 hour)
  - Create query, backup, stats tools
  - Test each command

**Afternoon (2-3 hours)**:
- ☐ Task 6: Claude Code Integration (1 hour)
  - Update config file
  - Restart Claude Code
  - Test MCP discovery
  - Run test queries
- ☐ Task 7: Evaluation (1-2 hours)
  - Run 10 test queries
  - Measure success rate
  - Document findings
  - Tune parameters if needed

**Day 2 Checkpoint**:
- ✅ MCP server integrated
- ✅ All 3 MCP tools working
- ✅ CLI tools functional
- ✅ 10 test queries evaluated
- ✅ Success rate ≥ 70%

**Final Deliverables**:
- ✅ ChromaDB with 1,200+ chunks
- ✅ TypeScript API library
- ✅ MCP server running
- ✅ CLI tools
- ✅ Evaluation report
- ✅ Documentation (this plan + evaluation)

---

### Checkpoint Gates (Go/No-Go Decisions)

**After Task 1** (ChromaDB Setup):
- ✅ **GO**: Basic operations work, file storage verified
- ❌ **NO-GO**: Installation fails, can't create collections
  - **Action**: Switch to Postgres + pgvector

**After Task 3** (Ingestion):
- ✅ **GO**: 1,000+ chunks ingested, no errors
- ❌ **NO-GO**: Embedding failures, < 500 chunks
  - **Action**: Debug API key, check rate limits, retry

**After Task 6** (Claude Code Integration):
- ✅ **GO**: MCP server discovered, tools visible
- ❌ **NO-GO**: Server crashes, tools not found
  - **Action**: Check logs, verify paths, test stdio manually

**After Task 7** (Evaluation):
- ✅ **GO**: Success rate ≥ 70%, avg score ≥ 0.75
- 🟡 **CONDITIONAL**: Success rate 50-69%
  - **Action**: Tune threshold, adjust chunking, iterate
- ❌ **NO-GO**: Success rate < 50%
  - **Action**: Re-evaluate approach, consider hybrid search

---

## Post-POC Next Steps

### Phase 2: Production Readiness (6-8 hours)

**If POC is successful (≥70% success rate)**:

1. **Enhanced MCP Tools** (2 hours):
   - Add `search_by_tag` tool
   - Add `get_related_docs` tool (similar documents)
   - Add `search_with_date_filter` tool

2. **Improved Search Quality** (2 hours):
   - Tune match_threshold per category
   - Implement priority weighting in ranking
   - Test with 20 more diverse queries

3. **Backup & Maintenance** (1 hour):
   - Automated daily backup (cron or git hook)
   - Incremental re-ingestion (only changed files)
   - Version tracking (git commit hash in metadata)

4. **Documentation** (2 hours):
   - Setup guide for other projects
   - MCP server API reference
   - Troubleshooting guide
   - Add to CLAUDE.md

5. **Monitoring** (1 hour):
   - Usage logging (which queries, success rates)
   - Debug mode (verbose MCP output)
   - Health check endpoint

### Phase 3: Advanced Features (Optional)

**Stretch Goals (if time permits)**:

1. **Memory Bank Integration**:
   - Auto-ingest `/memory-bank/CURRENT.md` daily
   - Tag as high priority (recent context)
   - Hybrid: Vector DB for search, Memory Bank for state

2. **Git Hook Auto-Sync**:
   ```bash
   # .git/hooks/post-commit
   #!/bin/bash
   npm run ingest:docs:incremental
   ```

3. **Multi-Collection Support**:
   - Separate collections: docs, code, issues
   - Cross-collection search
   - Collection-specific thresholds

4. **Hybrid Search**:
   - Combine vector search + keyword filtering
   - BM25 + semantic similarity fusion
   - Re-ranking based on metadata

5. **Agent Feedback Loop**:
   - Log which results agents use
   - Improve ranking based on usage
   - Auto-tag frequently queried docs

---

## Success Metrics

### Quantitative Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Query Relevance** | ≥ 75% | % of queries with top result score ≥ 0.7 |
| **Query Time** | < 2 sec | Embedding + search latency |
| **Success Rate** | ≥ 70% | % of queries finding expected docs |
| **Collection Size** | 1,200-1,500 | Total chunks in ChromaDB |
| **Coverage** | 200+ docs | Markdown files ingested |
| **Uptime** | 99%+ | MCP server availability |

### Qualitative Metrics

| Metric | Assessment Method |
|--------|-------------------|
| **Agent Satisfaction** | Survey: "Did you find what you needed?" |
| **Context Quality** | Review: Did results answer the question? |
| **Developer Experience** | Ease of setup, clarity of errors |
| **Documentation Quality** | Can another developer replicate? |

### Success Criteria (MVP)

**Minimum Viable**:
- ✅ 10 test queries with 70%+ success rate
- ✅ Query time < 2 seconds average
- ✅ MCP server stable (no crashes in 1 week)
- ✅ CLI tools functional (query, backup, stats)
- ✅ Documentation complete (setup guide)

**Production-Ready**:
- ✅ All MVP criteria
- ✅ 20 test queries with 80%+ success rate
- ✅ Automated backups working
- ✅ Integration with memory bank
- ✅ Monitoring dashboard

---

## Risk Mitigation

### Risk Matrix

| Risk | Likelihood | Impact | Mitigation | Severity |
|------|------------|--------|------------|----------|
| **ChromaDB installation fails** | Low | High | Use Docker fallback, switch to Postgres | 🟡 Medium |
| **Query relevance < 70%** | Medium | High | Tune threshold, improve chunking, test extensively | 🟡 Medium |
| **MCP server crashes** | Low | Medium | Error handling, logging, auto-restart | 🟢 Low |
| **Embedding API rate limits** | Low | Low | Batch processing, delays, caching | 🟢 Low |
| **Large files cause memory issues** | Very Low | Medium | Stream processing, batch chunking | 🟢 Low |
| **Stale docs return outdated info** | Medium | Medium | Timestamp weighting, manual curation | 🟡 Medium |
| **MCP config path issues** | Medium | Low | Absolute paths, validation script | 🟢 Low |
| **Google API key expires** | Low | High | Key rotation plan, error detection | 🟡 Medium |

### Mitigation Strategies

**For Low Query Quality**:
1. Lower threshold to 0.6 (more results)
2. Increase chunk size to 1000 chars
3. Add manual tags to key docs
4. Use hybrid search (vector + keyword)
5. Re-train embeddings (different model)

**For MCP Stability**:
1. Comprehensive error handling
2. Log to stderr (debug MCP issues)
3. Graceful degradation (return empty on error)
4. Health check endpoint
5. Auto-restart on crash (systemd/launchd)

**For Maintenance Burden**:
1. Automated re-ingestion (git hook)
2. Incremental updates only
3. Backup to JSONL (git commit)
4. Clear documentation
5. CLI tools for debugging

---

## Conclusion

This implementation plan provides a **comprehensive, actionable roadmap** for building a local vector database for Claude Code agents. The design emphasizes:

- ✅ **Reuse**: Leverage existing chatbot infrastructure (90% built)
- ✅ **Dual-access**: TypeScript API for zero-token access, MCP for agents
- ✅ **Local-first**: No external dependencies, works offline
- ✅ **Git-friendly**: JSONL backups, version control
- ✅ **Incremental**: Phased approach with clear checkpoints
- ✅ **Low-risk**: Safe to experiment, easy to rollback

**Key Innovations**:
1. **Dual-access pattern**: Preserves tokens for non-AI code
2. **Shared library**: Single source of truth for vector DB logic
3. **Proven components**: Reuse chatbot chunking/embedding
4. **ChromaDB**: Zero-config, file-based, fast

**Expected Outcomes**:
- 🎯 **10-14 hours** total implementation time
- 🎯 **75-85%** query relevance rate
- 🎯 **< 2 seconds** average query time
- 🎯 **1,200+ chunks** from 216 markdown files
- 🎯 **Zero-token** access for scripts/tools

**Next Action**: Begin Task 1 (ChromaDB Setup) and proceed through tasks sequentially, validating at each checkpoint.

---

**Document Status**: ✅ Complete
**Ready for Implementation**: Yes
**Estimated Start**: Immediate
**Estimated Completion**: 2 days (10-14 hours)
