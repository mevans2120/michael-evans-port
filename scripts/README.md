# Sanity Migration Scripts Guide

## ⚠️ BEFORE YOU START: Script Requirements Checklist

**🔴 CRITICAL: Every script that touches Sanity data MUST load environment variables or it will fail with "Insufficient permissions"**

**The token in `.env.local` is correct. If your script fails, the script is broken, not the token.**

**REQUIRED: Add these 3 lines to EVERY script:**

```javascript
// For .js files (use node to run):
import * as dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env.local') })
```

```typescript
// For .ts files (use tsx to run):
import * as dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env.local') })
```

**Why this is REQUIRED:**
- Node.js scripts DO NOT automatically load `.env.local` (Next.js does, scripts don't)
- Without this, `process.env.SANITY_WRITE_TOKEN` will be `undefined`
- Undefined token = "Insufficient permissions" error
- The token has write permissions, the script just can't see it

**✅ Checklist for new scripts:**
- [ ] Import dotenv and path/resolve at the top
- [ ] Call `dotenv.config({ path: resolve(process.cwd(), '.env.local') })`
- [ ] Use `process.env.SANITY_WRITE_TOKEN` (not SANITY_AUTH_TOKEN)
- [ ] Set `useCdn: false` in client config
- [ ] Test the script before committing

---

## How to Write Migration Scripts (IMPORTANT!)

### Critical Requirements

When writing Sanity migration scripts, you **MUST** follow this exact pattern to avoid authentication errors:

#### 1. Environment Variable Loading (REQUIRED)

**ALWAYS use this pattern:**

```typescript
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') })
```

**❌ Don't use:**
- `import 'dotenv/config'` - won't consistently load `.env.local`
- Skipping dotenv entirely - `process.env` will be empty
- Assuming Next.js loads env vars for scripts - it doesn't!

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
- ❌ `SANITY_API_TOKEN` - Wrong variable name
- ❌ `SANITY_AUTH_TOKEN` - Wrong variable name
- ❌ `NEXT_PUBLIC_SANITY_TOKEN` - Wrong variable name
- ✅ `SANITY_WRITE_TOKEN` - Correct!

**Note:** The token itself in `.env.local` has write permissions. The variable name must be `SANITY_WRITE_TOKEN`.

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

**For TypeScript files (.ts):**
```bash
npx tsx scripts/your-migration-script.ts
```

**For JavaScript files (.js):**
```bash
node scripts/your-migration-script.js
```

### Troubleshooting

#### Error: "Insufficient permissions; permission 'update' required"

**Full error message:**
```
ClientError: transaction failed: Insufficient permissions; permission "update" required:
- Insufficient permissions; permission "update" required
```

**🔴 THE ISSUE IS ALWAYS YOUR SCRIPT, NOT THE TOKEN**

The token in `.env.local` has write permissions and is correct. If you get this error, your script is broken.

**Root cause (99% of the time):**

**Missing dotenv loading - Script doesn't load environment variables**

Your script is trying to use `process.env.SANITY_WRITE_TOKEN` but it's `undefined` because you didn't load `.env.local`.

**Solution:** Add these THREE lines at the top of your script:
```javascript
import * as dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env.local') })
```

**Why this happens:**
- Next.js automatically loads `.env.local` for the app
- Node.js scripts DO NOT automatically load `.env.local`
- You must explicitly load it with dotenv in every script
- Without it, `process.env.SANITY_WRITE_TOKEN` is undefined → authentication fails

**Quick diagnosis:**
```javascript
// Add this RIGHT AFTER dotenv.config() to verify it worked:
console.log('Token loaded:', !!process.env.SANITY_WRITE_TOKEN)
console.log('Token preview:', process.env.SANITY_WRITE_TOKEN?.substring(0, 10) + '...')

// If you see "Token loaded: false" → dotenv didn't work, check the path
// If you see "Token loaded: true" → script is correct, run it again
```

**Other causes (rare):**

1. **Wrong token variable name in script**
   - Using `process.env.SANITY_AUTH_TOKEN` instead of `process.env.SANITY_WRITE_TOKEN`
   - Solution: Use `SANITY_WRITE_TOKEN` everywhere

2. **Typo in .env.local**
   - Variable name is misspelled in `.env.local` file
   - Solution: Verify the line says exactly `SANITY_WRITE_TOKEN=sk...`

**See working examples:**
- `scripts/migrate-aesop-lyft.ts` (TypeScript)
- `scripts/delete-slides-data.js` (JavaScript)

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
