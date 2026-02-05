# Polis Integration Exploration for mevans.space

**Date:** February 5, 2026
**Status:** Research / Pre-implementation
**Goal:** Backend-only Polis social layer alongside existing Sanity + Next.js stack

---

## 1. What Polis Actually Is (Protocol Summary)

Polis is a decentralized social protocol where identity is domain-based. Each participant:

- Owns a domain that serves as their identity
- Publishes cryptographically signed Markdown files (Ed25519 + SHA-256)
- Hosts their own content as static files over HTTPS
- Exposes a `.well-known/polis` JSON file containing their public key and metadata

There is no central server for content. A lightweight discovery service (Supabase Edge Functions) coordinates social interactions (following, comment blessing) but never holds content. The discovery service is explicitly designed to be replaceable.

### Data Formats at a Glance

| What | Format |
|------|--------|
| Posts | Markdown + YAML frontmatter (signed) |
| Identity | JSON at `/.well-known/polis` |
| Post index | JSONL at `/metadata/public.jsonl` |
| Blessed comments | JSON at `/metadata/blessed-comments.json` |
| Following list | JSON at `/metadata/following.json` |
| Manifest | JSON at `/metadata/manifest.json` |
| Signatures | SSH signature format (base64 in frontmatter) |
| Keys | OpenSSH Ed25519 |

### What a Published Post Looks Like

```markdown
---
title: My Post Title
published: 2026-02-05T12:00:00Z
generator: polis-cli-go/0.1.0
current-version: <sha256-hash>
version-history: []
signature: <base64-ssh-signature>
---

# My Post Title

Content in standard Markdown...
```

Posts live at `posts/YYYYMMDD/slug.md`. The CLI handles signing, hashing, versioning, and index generation.

---

## 2. Our Content Landscape

### What We Publish

**Blog Posts** (primary Polis candidate)
- Rich Portable Text: headings, paragraphs, bold/italic/code, links, footnotes
- Inline images with alt text, captions, and layout styles (fullWidth, floatLeft, floatRight, floatRightPortrait)
- Image grids (2-column, 2-6 images)
- Portrait image lists (horizontal scroll, 1-10 images)
- Video embeds (YouTube/Vimeo)
- Margin notes/tips
- Example prompts
- Tables (2-6 columns)
- Featured images and ASCII art alternatives
- Full SEO metadata

**Case Studies / Projects** (secondary candidate)
- Same Portable Text base as blog posts, plus:
- Stat blocks (big numbers, quotes, free text)
- Metrics arrays
- Technology tags
- Call-to-action links

**Profile / About** (not a Polis candidate - singleton content)

### How Images Work Today

Images are stored in Sanity's asset pipeline and served via CDN:

```
https://cdn.sanity.io/images/5n331bys/production/{imageId}?w=1200&q=80&auto=format
```

The project has a preset-based URL builder (`/src/lib/sanity/image-builder.ts`) that generates optimized URLs for different contexts (hero, card, article-full, article-float, grid, portrait).

Image references in Sanity look like:
```typescript
{
  asset: { _ref: "image-abc123-1200x800-jpg", url: "https://cdn.sanity.io/..." },
  crop: { top, bottom, left, right },
  hotspot: { x, y, height, width },
  alt: "Description",
  caption: "Optional caption"
}
```

### Existing Content Pipeline

```
Sanity CMS → GROQ Queries → React/Next.js → Vercel
```

Relevant queries already exist:
- `allBlogPostsQuery` - All posts ordered by date
- `blogPostBySlugQuery` - Single post with full content + dereferenced image assets
- `allBlogSlugsQuery` - All slugs (for static generation)
- Similar queries for projects

### Existing Scripts Pattern

The project has a well-established pattern for content scripts in `/scripts/`:
- Migration scripts (`migrate-about-content.ts`, `migrate-slides-to-article.ts`)
- Import scripts (`import-showcases/import-all.ts`)
- All use `tsx` runner with `.env.local` for Sanity credentials

---

## 3. The Integration: How Polis Fits

### Architecture

```
                          EXISTING (unchanged)
                    ┌──────────────────────────┐
                    │  Sanity CMS              │
                    │    ↓                     │
                    │  GROQ Queries            │
                    │    ↓                     │
                    │  Next.js Rendering       │
                    │    ↓                     │
                    │  Vercel (mevans.space)   │
                    └──────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │  NEW: Polis Layer  │
                    │                   │
  Sanity ──GROQ──→ │  Export Script     │
                    │    ↓              │
                    │  Portable Text    │
                    │  → Markdown       │
                    │    ↓              │
                    │  polis publish    │
                    │    ↓              │
                    │  Signed .md files │
                    │  + metadata/      │
                    │  + .well-known/   │
                    │    ↓              │
                    │  Committed to git │
                    │  → Deployed via   │
                    │    Vercel         │
                    └───────────────────┘
```

Sanity remains the source of truth. The Polis export is a one-way derivative. Blog content gets converted to signed Markdown and committed alongside the Next.js app. Vercel serves both the website and the Polis static files.

### What Gets Served from the Domain

| Path | Source | Purpose |
|------|--------|---------|
| `/.well-known/polis` | Polis init (static file) | Identity + public key |
| `/posts/**/*.md` | Export script + Polis sign | Signed post content |
| `/metadata/public.jsonl` | Polis CLI (auto-generated) | Post index |
| `/metadata/manifest.json` | Polis CLI (auto-generated) | Site config |
| `/metadata/following.json` | Polis CLI | Who you follow |
| `/metadata/blessed-comments.json` | Polis CLI | Approved comments |

All of these are static files that can live in the `public/` directory and be served by Vercel with zero Next.js route changes.

---

## 4. The Bridge: Portable Text to Markdown

This is the core technical challenge. Here's how each Portable Text block type maps to Markdown:

### Direct Mappings (Straightforward)

| Portable Text | Markdown |
|---------------|----------|
| `style: "normal"` | Paragraph |
| `style: "h2"` | `## Heading` |
| `style: "h3"` | `### Heading` |
| `style: "h4"` | `#### Heading` |
| `style: "blockquote"` | `> Quote` |
| Bold mark | `**bold**` |
| Italic mark | `*italic*` |
| Code mark | `` `code` `` |
| Link annotation | `[text](href)` |

### Image Handling (Key Decision)

Sanity images are already on a public CDN. The simplest approach: resolve image references to their CDN URLs during conversion.

```markdown
![Alt text](https://cdn.sanity.io/images/5n331bys/production/abc123.jpg?w=1200&q=80&auto=format)

*Caption text*
```

**Why this works well:**
- Sanity CDN URLs are permanent and publicly accessible
- No need to download, copy, or re-host images
- Polis posts just reference them like any external image
- Goldmark (Polis's Markdown renderer) handles standard `![alt](url)` syntax
- Polis has `html.WithUnsafe()` enabled, so raw `<img>` tags also work if needed

**Image layout styles** (fullWidth, floatLeft, etc.) are presentation concerns that don't translate to Markdown. The Polis version gets the image content without the styling. This is acceptable for a backend/protocol layer - the styled version lives on mevans.space.

**Image grids and portrait lists** become sequential images:

```markdown
![Image 1 alt](url1)

![Image 2 alt](url2)

![Image 3 alt](url3)
```

### Custom Block Mappings

| Portable Text Block | Markdown Representation |
|---------------------|------------------------|
| `videoEmbed` | `[Video: Caption](youtube-url)` or raw `<iframe>` (Goldmark allows unsafe HTML) |
| `marginNote` / `tip` | `> **Tip:** Content` (blockquote with bold prefix) |
| `examplePrompt` | Fenced code block with label: `` ```\nExample Prompt: ...\n``` `` |
| `table` | GFM table syntax (Goldmark has GFM extension) |
| `footnote` | Inline parenthetical or collected at bottom with `[^1]` syntax |
| `statBlock` (projects) | Bold text or blockquote depending on type |
| ASCII art | Fenced code block |

### Portable Text Serializer Approach

Rather than building from scratch, use `@portabletext/to-html` or a custom serializer:

```typescript
// scripts/polis/portable-text-to-markdown.ts

import { createClient } from '@sanity/client'
import { buildImageUrl } from '../../src/lib/sanity/image-builder'

type Block = {
  _type: string
  _key: string
  style?: string
  children?: Array<{ text: string; marks?: string[] }>
  markDefs?: Array<{ _type: string; _key: string; href?: string }>
  // ... custom block fields
}

export function portableTextToMarkdown(blocks: Block[]): string {
  return blocks.map(block => {
    switch (block._type) {
      case 'block':
        return renderTextBlock(block)
      case 'image':
        return renderImage(block)
      case 'imageGrid':
        return renderImageGrid(block)
      case 'videoEmbed':
        return renderVideo(block)
      case 'marginNote':
        return renderNote(block)
      case 'table':
        return renderTable(block)
      case 'examplePrompt':
        return renderPrompt(block)
      default:
        return ''
    }
  }).filter(Boolean).join('\n\n')
}

function renderTextBlock(block: Block): string {
  const prefix = {
    h2: '## ', h3: '### ', h4: '#### ',
    blockquote: '> ', normal: ''
  }[block.style || 'normal'] ?? ''

  const text = (block.children || []).map(child => {
    let t = child.text
    if (child.marks?.includes('strong')) t = `**${t}**`
    if (child.marks?.includes('em')) t = `*${t}*`
    if (child.marks?.includes('code')) t = `\`${t}\``
    // Handle link marks via markDefs
    const linkMark = child.marks?.find(m =>
      block.markDefs?.find(md => md._key === m && md._type === 'link')
    )
    if (linkMark) {
      const def = block.markDefs?.find(md => md._key === linkMark)
      if (def?.href) t = `[${t}](${def.href})`
    }
    return t
  }).join('')

  return prefix + text
}
```

This is a sketch - the actual implementation would handle edge cases (nested marks, empty blocks, etc.) but the shape is correct. The serializer lives in `/scripts/` alongside existing migration scripts and follows the same patterns.

---

## 5. Image Strategy (Detailed)

### Approach: Reference, Don't Copy

| Concern | Decision |
|---------|----------|
| Where do images live? | Sanity CDN (unchanged) |
| How are they referenced in Polis markdown? | Standard `![alt](cdn-url)` |
| Image optimization? | Use existing presets (`article-full` at 1200px, 80 quality) |
| Hotspot/crop? | Applied via URL parameters by the image builder |
| What if Sanity CDN goes down? | Same risk as the main site - Sanity CDN is the single source |
| Featured images? | Not included in post body markdown, but could be added as a leading image |

### URL Generation During Export

```typescript
import { buildImageUrl } from '../../src/lib/sanity/image-builder'

function renderImage(block: ImageBlock): string {
  const url = buildImageUrl(block, 'article-full')
  const alt = block.alt || ''
  const caption = block.caption ? `\n\n*${block.caption}*` : ''
  return `![${alt}](${url})${caption}`
}
```

### What About OG Images?

Polis doesn't have a metadata field for OG images. The signed markdown is the content - social previews are the website's concern. Since we're keeping the existing site unchanged, OG images continue to work through Next.js metadata as they do today.

### Featured Images

Two options:
1. **Skip them in Polis posts** - The title and content are what matter for the protocol
2. **Prepend as a leading image** - Add the featured image as the first element of the markdown body

Recommendation: Option 2, prepend when present. It makes the Polis-rendered version more complete:

```markdown
---
title: Post Title
...
---

![Featured image alt](https://cdn.sanity.io/images/...)

# Post Title

Post content begins...
```

---

## 6. File Serving on Vercel

### The `public/` Directory Approach

Polis generates static files. Vercel serves everything in `public/` as static assets at the root path. This is the simplest and most reliable approach:

```
public/
  .well-known/
    polis                          # Identity JSON (from polis init)
  posts/
    20260205/
      my-first-post.md            # Signed markdown
  metadata/
    public.jsonl                   # Post index
    manifest.json                  # Site config
    blessed-comments.json          # Approved comments
    following.json                 # Following list
```

**Pros:**
- Zero code changes to Next.js
- No API routes needed
- Files are served as static assets with proper caching
- Works identically in dev (`next dev`) and production (Vercel)

**Cons:**
- Files must be committed to git (increases repo size over time)
- Requires a sync step before deployment

**The repo size concern is minimal.** Signed markdown files are small (a few KB each). Even with 200+ posts, this adds maybe 1-2 MB to the repo. The images stay on Sanity CDN.

### Alternative: Next.js Route Handlers

Not recommended for this use case. Vercel's serverless functions don't have reliable filesystem access for reading static files at runtime, and these are genuinely static files that don't need server-side logic.

### `.well-known` Path Handling

Vercel serves `public/.well-known/polis` at `https://mevans.space/.well-known/polis` automatically. No special configuration needed. However, verify that Vercel doesn't strip or redirect the `.well-known` prefix - test this early.

---

## 7. Export Script Design

### Location and Pattern

Following the project's existing script conventions:

```
scripts/
  polis/
    export.ts              # Main export script
    portable-text-to-md.ts # Portable Text → Markdown converter
    config.ts              # Polis-specific config (paths, presets)
```

Run with: `npm run polis:export` (new script in package.json)

### Export Flow

```
1. Fetch all published blog posts from Sanity (GROQ)
2. For each post:
   a. Convert Portable Text body → Markdown
   b. Resolve all image references → Sanity CDN URLs
   c. Write markdown to a temp file
   d. Shell out to `polis publish <file>` (or `polis republish` if exists)
3. Polis CLI handles: signing, hashing, frontmatter, index update
4. Result: signed files in posts/, updated metadata/
```

### Detecting New vs Updated Posts

The script needs to know whether to `publish` (new) or `republish` (update):

```typescript
import { existsSync } from 'fs'
import { execSync } from 'child_process'

function syncPost(slug: string, markdown: string) {
  const tempFile = `/tmp/polis-export-${slug}.md`
  writeFileSync(tempFile, markdown)

  // Check if this slug already exists in posts/
  const existingPath = findExistingPost(slug) // scan posts/**/slug.md

  if (existingPath) {
    execSync(`polis republish ${tempFile}`, { stdio: 'inherit' })
  } else {
    execSync(`polis publish ${tempFile}`, { stdio: 'inherit' })
  }

  unlinkSync(tempFile)
}
```

### Handling the `polis publish` Title Extraction

Polis extracts the title from the first `# ` heading in the markdown. The export script should ensure the markdown starts with:

```markdown
# {post.title}
```

This means the title appears both in Polis frontmatter (auto-extracted) and as the first line of the body.

---

## 8. Build Pipeline Options

### Option A: Manual Export (Start Here)

```bash
# Developer runs locally
npm run polis:export

# Review what changed
git diff public/posts/ public/metadata/

# Commit and push (triggers normal Vercel deploy)
git add public/posts public/metadata public/.well-known
git commit -m "Polis: sync latest posts"
git push
```

**Pros:** Simple, low risk, full control. **Cons:** Manual step.

### Option B: GitHub Action (Automate Later)

```yaml
# .github/workflows/polis-sync.yml
name: Polis Sync

on:
  repository_dispatch:
    types: [sanity-publish]  # Triggered by Sanity webhook
  workflow_dispatch:          # Manual trigger
  schedule:
    - cron: '0 6 * * *'     # Daily at 6 AM

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - run: npm ci

      - name: Install Polis CLI
        run: curl -fsSL https://raw.githubusercontent.com/vdibart/polis-cli/main/scripts/install.sh | bash

      - name: Export and sign posts
        run: npm run polis:export
        env:
          SANITY_PROJECT_ID: ${{ secrets.SANITY_PROJECT_ID }}
          SANITY_DATASET: production
          POLIS_BASE_URL: https://mevans.space

      - name: Commit and push if changed
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add public/posts public/metadata public/.well-known
          git diff --staged --quiet || git commit -m "chore: polis sync $(date +%Y-%m-%d)"
          git push
```

**Key detail:** The Polis private key (`.polis/keys/id_ed25519`) needs to be stored as a GitHub secret and written to the filesystem before `polis publish` runs. Add a step:

```yaml
      - name: Setup Polis keys
        run: |
          mkdir -p .polis/keys
          echo "${{ secrets.POLIS_PRIVATE_KEY }}" > .polis/keys/id_ed25519
          chmod 600 .polis/keys/id_ed25519
          echo "${{ secrets.POLIS_PUBLIC_KEY }}" > .polis/keys/id_ed25519.pub
          chmod 644 .polis/keys/id_ed25519.pub
```

### Recommendation: Start with Option A

Run manually for the first few posts. Get a feel for the output. Move to Option B once the export script is stable and you've confirmed everything works end-to-end.

---

## 9. Key Management

The Ed25519 keypair is generated by `polis init` and stored in `.polis/keys/`. The private key never leaves the machine where it's generated (or CI secrets).

| Location | What's There | Committed to Git? |
|----------|-------------|-------------------|
| `.polis/keys/id_ed25519` | Private key | **No** (gitignored) |
| `.polis/keys/id_ed25519.pub` | Public key | **No** (gitignored) |
| `public/.well-known/polis` | Public key + metadata | **Yes** |

For CI: Store the private key as a GitHub Actions secret (`POLIS_PRIVATE_KEY`). The public key is already published in `.well-known/polis`.

Backup recommendation: Store the keypair somewhere safe (password manager, encrypted backup). If lost, you'd need `polis rotate-key` to generate a new one and re-sign all content.

---

## 10. Scope and Phasing

### Phase 1: Initialize and Verify (30 min)

1. Run `polis init` in the project root
2. Move `.well-known/polis` to `public/.well-known/polis`
3. Verify the file is served correctly on localhost: `curl http://localhost:3000/.well-known/polis`
4. Back up the keypair

### Phase 2: Build the Portable Text Converter

1. Create `scripts/polis/portable-text-to-md.ts`
2. Handle all block types from the blog schema
3. Test against 3-4 representative posts (one simple, one image-heavy, one with tables/embeds)
4. Verify output is valid Markdown

### Phase 3: Build the Export Script

1. Create `scripts/polis/export.ts`
2. Fetch posts from Sanity, convert, write temp files
3. Shell out to `polis publish` for each
4. Verify signed output in `posts/` directory
5. Move output to `public/posts/` and `public/metadata/`
6. Add `polis:export` script to package.json

### Phase 4: Deploy and Test

1. Commit Polis files to git
2. Deploy to Vercel
3. Test: `curl https://mevans.space/.well-known/polis`
4. Test: `polis follow https://mevans.space` from another machine
5. Test: Verify signatures with `polis preview`

### Phase 5: Automate (Optional, Later)

1. Set up GitHub Action for automated sync
2. Configure Sanity webhook to trigger the action
3. Add key management to CI secrets

---

## 11. What We're NOT Doing (Explicit Scope Boundaries)

- **No UI changes** to mevans.space (backend only)
- **No Polis theme/rendering** - We don't need Polis's HTML rendering since the site has its own presentation layer
- **No comment integration** yet - The blessing system works, but displaying Polis comments on the site is a future decision
- **No Polis-native pages** - Posts render through Next.js, not Polis themes
- **No image migration** - Images stay on Sanity CDN, referenced by URL
- **No real-time sync** - Export runs on demand or on schedule, not on every Sanity save

---

## 12. Open Considerations

### Content Selection
Should every blog post be published to Polis, or only selected ones? Options:
- **All posts** (simplest - export everything)
- **Opt-in** via a Sanity field (e.g., `publishToPolis: boolean`)
- **Opt-out** via a field (publish by default, skip if flagged)

Recommendation: Start with all posts. Add a filter field later if needed.

### Case Studies
Case studies have richer content (metrics, stat blocks, CTAs). Worth publishing to Polis? The conversion is more complex but the content is valuable. Could be Phase 2 if blog posts work well.

### Post URL Mapping
Polis posts live at `/posts/YYYYMMDD/slug.md`. Your blog posts live at `/blog/slug`. These are separate paths serving separate purposes:
- `/blog/slug` = the styled, full-featured website version
- `/posts/YYYYMMDD/slug.md` = the signed, portable Polis version

No conflict. Both can coexist.

### Discovery Registration
After init and first publish, run `polis register` to add mevans.space to the Polis discovery directory. This makes you findable by other Polis users. This is a one-time step.

---

## 13. Dependencies and Requirements

| Dependency | Version | Purpose | Install |
|------------|---------|---------|---------|
| Polis CLI (Go binary) | v0.45.0 | Signing, publishing, metadata | `curl -fsSL .../install.sh \| bash` |
| `@sanity/client` | (already installed) | Fetching content from Sanity | N/A |
| `tsx` | (already installed) | Running TypeScript scripts | N/A |

No new npm dependencies needed. The Polis CLI is a standalone Go binary with zero runtime dependencies.
