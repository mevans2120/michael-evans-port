# Migrating Vector DB to Separate Repository

## Why Separate?
- **Clean separation of concerns** - Vector DB is independent infrastructure
- **Different deployment needs** - Website vs. AI services
- **Easier testing** - Isolate vector DB development
- **Team collaboration** - Different access requirements

## New Repository Structure

```
claude-code-vectordb/
├── src/
│   ├── lib/
│   │   ├── client.ts          # Vector DB API client
│   │   ├── types.ts           # TypeScript types
│   │   └── embeddings.ts      # Embedding functions
│   └── mcp-server/            # MCP server (Task 4)
│       ├── index.ts
│       └── package.json
├── scripts/
│   ├── ingest-docs.ts         # Document ingestion
│   ├── test-search.ts         # Search testing
│   └── test-api.ts            # API testing
├── cli/                       # CLI tools (Task 5)
│   └── vectordb-cli.ts
├── chromadb-data/             # Local DB storage
├── docs/                      # Documentation
├── .env.example               # Environment variables template
├── package.json
├── tsconfig.json
└── README.md
```

## Migration Steps

### 1. Create New Repository
```bash
# Create new directory
mkdir ~/claude-code-vectordb
cd ~/claude-code-vectordb

# Initialize git
git init
```

### 2. Copy Core Files
```bash
# From michael-evans-port-main directory
cp -r src/lib/vector-db/* ~/claude-code-vectordb/src/lib/
cp scripts/ingest-docs-to-vectordb.ts ~/claude-code-vectordb/scripts/ingest-docs.ts
cp scripts/test-vector-*.ts ~/claude-code-vectordb/scripts/
cp -r chromadb-data ~/claude-code-vectordb/
```

### 3. Create Package.json
```json
{
  "name": "claude-code-vectordb",
  "version": "1.0.0",
  "description": "Vector database for Claude Code context",
  "type": "module",
  "scripts": {
    "chromadb:start": "chroma run --path ./chromadb-data --host localhost --port 8000",
    "chromadb:stop": "pkill -f 'chroma run' || true",
    "ingest": "tsx scripts/ingest-docs.ts",
    "ingest:clear": "tsx scripts/ingest-docs.ts --clear",
    "test:search": "tsx scripts/test-search.ts",
    "test:api": "tsx scripts/test-api.ts",
    "mcp:dev": "tsx src/mcp-server/index.ts",
    "cli": "tsx cli/vectordb-cli.ts"
  },
  "dependencies": {
    "@google/generative-ai": "^0.24.1",
    "chromadb": "^3.1.4",
    "glob": "^11.0.3",
    "gray-matter": "^4.0.3"
  },
  "devDependencies": {
    "@types/node": "^20",
    "tsx": "^4.20.6",
    "typescript": "^5"
  }
}
```

### 4. Environment Variables (.env.example)
```env
# Google AI API Key for embeddings
GOOGLE_GENERATIVE_AI_API_KEY=your_key_here

# ChromaDB Configuration
CHROMADB_URL=http://localhost:8000
COLLECTION_NAME=project-docs

# Source paths for ingestion
DOCS_PATH=/path/to/michael-evans-port-main/docs
MEMORY_BANK_PATH=/path/to/michael-evans-port-main/memory-bank/CURRENT.md
CLAUDE_MD_PATH=/path/to/michael-evans-port-main/CLAUDE.md
```

### 5. Update Ingestion Script
The ingestion script should read from the website repo but store in the vector DB repo:
- Read docs from `DOCS_PATH` environment variable
- Store database in local `chromadb-data/`

## Benefits of Separation

1. **Independent Development**
   - Work on vector DB without affecting website
   - Test ingestion without website running

2. **Flexible Deployment**
   - Can deploy ChromaDB server separately
   - Scale independently from website

3. **Cleaner Testing**
   - Isolated test environment
   - No interference with website tests

4. **Easier Sharing**
   - Can open-source vector DB separately
   - Share with other Claude Code users

## Integration Points

### From Website Repo
- Documents in `/docs` folder
- `CLAUDE.md` instructions
- `memory-bank/CURRENT.md` status

### To Website Repo
- None! Website doesn't depend on vector DB
- Vector DB only reads from website

### For Claude Code
- MCP server configuration
- CLI tools for manual queries

## Quick Start After Migration

```bash
# 1. Install dependencies
cd ~/claude-code-vectordb
npm install

# 2. Copy .env.example to .env and add your API key
cp .env.example .env
# Edit .env with your GOOGLE_GENERATIVE_AI_API_KEY

# 3. Start ChromaDB
npm run chromadb:start

# 4. Run ingestion
npm run ingest:clear  # Fresh start

# 5. Test search
npm run test:search
```

## Next Steps
1. Complete ingestion (fix remaining issues)
2. Build MCP server (Task 4)
3. Create CLI tools (Task 5)
4. Configure Claude Code (Task 6)
5. Document usage patterns