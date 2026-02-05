# Polis Integration Plan for mevans.space

## The Setup

**Current stack:** Next.js + Sanity CMS, deployed on Vercel  
**Goal:** Add Polis as a decentralized social/discovery layer while keeping the existing publishing workflow intact

## The Core Tension

Polis expects markdown files on disk that it signs and publishes. Your content lives in Sanity's database and gets rendered by Next.js. Two approaches:

### Option A: Polis as Primary Publisher

Export Sanity content to markdown → Polis signs and publishes → Deploy to Vercel

This would mean rethinking your whole workflow. Polis becomes the source of truth for published content. Sanity becomes a drafting tool. Probably overkill for where you're at.

### Option B: Polis as Social Layer (Recommended)

Keep your existing Sanity → Next.js → Vercel flow. Add Polis alongside it for:
- Cryptographic signing of posts (proves authorship)
- Discovery via `.well-known/polis` 
- Following/being followed across the Polis network
- Decentralized comments (hosted on commenters' domains)

Your blog keeps working exactly as it does. Polis adds a parallel social protocol layer.

---

## Implementation Steps

### Phase 1: Install and Initialize

```bash
# Install Polis CLI
curl -fsSL https://raw.githubusercontent.com/vdibart/polis-cli/main/scripts/install.sh | bash

# Navigate to your blog repo
cd ~/path/to/mevans-space

# Initialize Polis (creates keypair and .well-known/polis)
polis init

# Set your domain
export POLIS_BASE_URL="https://mevans.space"
```

This creates:
- An Ed25519 keypair (your cryptographic identity)
- `.well-known/polis/` directory structure
- Config for your domain

### Phase 2: Bridge Sanity Content to Polis

Create a script that exports published Sanity posts to markdown for Polis to sign:

```javascript
// scripts/export-to-polis.js
import { createClient } from '@sanity/client'
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01'
})

async function exportToPolis() {
  // Fetch published posts
  const posts = await client.fetch(`
    *[_type == "post" && defined(slug.current)] {
      title,
      slug,
      publishedAt,
      body
    }
  `)

  const polisDir = './polis-posts'
  if (!fs.existsSync(polisDir)) fs.mkdirSync(polisDir)

  for (const post of posts) {
    // Convert Sanity block content to markdown
    // (You'll need to adapt this to your schema)
    const markdown = `# ${post.title}\n\n${blockToMarkdown(post.body)}`
    const filename = `${post.slug.current}.md`
    
    fs.writeFileSync(path.join(polisDir, filename), markdown)
    
    // Sign and register with Polis
    execSync(`polis post ${path.join(polisDir, filename)}`)
  }
}
```

### Phase 3: Configure Next.js for Polis Discovery

Add the `.well-known/polis` route to your Next.js app so other Polis users can discover you:

```javascript
// app/.well-known/polis/[...path]/route.js
import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(request, { params }) {
  const filePath = path.join(
    process.cwd(), 
    '.well-known/polis', 
    ...params.path
  )
  
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8')
    return new NextResponse(content, {
      headers: { 'Content-Type': 'application/json' }
    })
  }
  
  return new NextResponse('Not found', { status: 404 })
}
```

Or simpler: add `.well-known/polis/` to your `public/` directory and let Next.js serve it statically.

### Phase 4: Add to Build/Deploy Pipeline

In your Vercel build or a GitHub Action:

```yaml
# .github/workflows/polis-sync.yml
name: Sync to Polis

on:
  # Trigger on Sanity webhook or schedule
  repository_dispatch:
    types: [sanity-publish]
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Install Polis CLI
        run: curl -fsSL https://raw.githubusercontent.com/vdibart/polis-cli/main/scripts/install.sh | bash
      
      - name: Export and sign posts
        run: node scripts/export-to-polis.js
        env:
          SANITY_PROJECT_ID: ${{ secrets.SANITY_PROJECT_ID }}
          POLIS_BASE_URL: https://mevans.space
      
      - name: Commit Polis updates
        run: |
          git config user.name "Polis Bot"
          git add .well-known/polis polis-posts
          git commit -m "Update Polis signatures" || exit 0
          git push
```

---

## What You Get

Once set up:

- **Authorship proof:** Every post is cryptographically signed. Anyone can verify you wrote it.
- **Discoverability:** Other Polis users can `polis follow https://mevans.space` and see your posts in their feed.
- **Portability:** Your keypair and content belong to you. Move to any host, your identity follows.
- **Comments:** People can comment from their own domains. You decide what appears on yours.

---

## Blog Content Opportunities

This integration is a multi-post series waiting to happen:

1. **"Why I'm Adding Decentralized Social to My Blog"** — The Google Reader nostalgia angle, owning your social graph, Vinny's vision
2. **"Integrating Polis with Next.js and Sanity"** — The technical walkthrough, the bridging problem, code samples
3. **"Week One with Polis"** — Honest take on what works, what's missing, the empty network problem
4. **"The Open Web Needs More Tools Like This"** — Bigger picture piece on why this matters

---

## Open Questions

- How do Polis comments integrate with your existing site? Do you want to display them?
- Do you want Polis to be visible to readers (badge, feed link) or just backend infrastructure?
- Is there value in rendering a Polis-native version of posts alongside your styled versions?

---

## Next Steps

1. Install the CLI and run `polis init` in your repo
2. Manually test with one post: `polis post some-post.md`
3. Check what gets created in `.well-known/polis`
4. Decide on the Sanity bridge approach before automating
