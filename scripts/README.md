# Sanity Migration Scripts Guide

## How to Write Migration Scripts (IMPORTANT!)

### Critical Requirements

When writing Sanity migration scripts, you **MUST** follow this exact pattern to avoid authentication errors:

#### 1. Environment Variable Loading

**ALWAYS use this pattern:**

```typescript
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') })
```

**❌ Don't use:** `import 'dotenv/config'` - it won't consistently load `.env.local`

#### 2. Authentication Token

**ALWAYS use `SANITY_WRITE_TOKEN`:**

```typescript
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '5n331bys',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN, // ⚠️  MUST be SANITY_WRITE_TOKEN
  useCdn: false, // Never cache writes
})
```

**Common Mistakes:**
- ❌ `SANITY_API_TOKEN` - Will fail with 403 Forbidden
- ❌ `SANITY_AUTH_TOKEN` - Read-only, insufficient permissions
- ❌ `NEXT_PUBLIC_SANITY_TOKEN` - Public read-only token
- ✅ `SANITY_WRITE_TOKEN` - Correct!

### Quick Start Template

```typescript
#!/usr/bin/env tsx
import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

// Create write-enabled client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '5n331bys',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

async function migrate() {
  console.log('Starting migration...')

  // Fetch document
  const doc = await client.fetch(`*[_id == "your-doc-id"][0]`)

  if (!doc) {
    console.log('Document not found')
    return
  }

  // Update document
  await client
    .patch(doc._id)
    .set({ yourField: 'new value' })
    .commit()

  console.log('✅ Migration complete')
}

migrate()
```

### Running Migrations

```bash
npx tsx scripts/your-migration-script.ts
```

### Troubleshooting

**403 Forbidden Error:**
```
ClientError: transaction failed: Insufficient permissions; permission "update" required
```

**Solutions:**
1. Verify you're using `SANITY_WRITE_TOKEN` (not `_API_TOKEN` or `_AUTH_TOKEN`)
2. Check dotenv loading: `dotenv.config({ path: resolve(process.cwd(), '.env.local') })`
3. Confirm `.env.local` contains `SANITY_WRITE_TOKEN=...`

**See working example:** `scripts/migrate-aesop-lyft.ts`

---

## About Page Content Migration

This script populates the Sanity CMS with content for the about page based on the content spec at `/docs/content-specs/profile-about-content-spec.md`.

### Prerequisites

1. **Sanity API Token**: You need a Sanity API token with write permissions.

   **How to get your token:**
   - Go to https://www.sanity.io/manage
   - Select your project (michael-evans-port)
   - Go to "API" → "Tokens"
   - Click "Add API token"
   - Name it "Migration Script"
   - Set permissions to "Editor"
   - Copy the token

2. **Add token to your environment:**
   ```bash
   # Add this line to your .env.local file
   SANITY_API_TOKEN=your_token_here
   ```

### Running the Migration

```bash
npm run migrate:about
```

### What the Script Does

The migration script will:

1. ✅ Connect to your Sanity project
2. ✅ Fetch the existing profile document
3. ✅ Add/update these fields:
   - Hero section (headline, subheadline, intro)
   - Quick facts (6 items)
   - Capabilities (7 items including "Development" with "new" badge)
   - Selected projects (4 projects with metrics)
   - Content sections (3 main sections with subsections)
   - CTA data (availability, text, button text)
4. ✅ Preserve all existing profile data (name, image, social links, etc.)

### After Migration

- **View your about page:** http://localhost:3000/about
- **Edit in Sanity Studio:** http://localhost:3000/studio

### Troubleshooting

**"No profile document found"**
- Go to http://localhost:3000/studio
- Create a Profile document first
- Make sure Name and Profile Image are filled in
- Then run the migration

**"Authentication error"**
- Check that `SANITY_API_TOKEN` is set in `.env.local`
- Make sure the token has Editor permissions
- Restart your dev server after adding the token

**"Module not found" errors**
- The script uses the same Sanity client as the main app
- Make sure all dependencies are installed: `npm install`

### Customizing the Content

To modify the content before migrating, edit the data structures in:
`scripts/migrate-about-content.ts`

The script is structured to make it easy to:
- Add/remove quick facts
- Update capabilities
- Reorder projects
- Add more content sections

### Manual Editing After Migration

After running the migration, you can:
- Edit any field in Sanity Studio at http://localhost:3000/studio
- Add more sections, projects, or capabilities
- Toggle section visibility
- Update copy and metrics
- Add rich text formatting

The migration is a starting point - feel free to refine the content in Sanity Studio!
