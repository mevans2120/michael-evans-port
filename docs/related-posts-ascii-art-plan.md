# Related Posts ASCII Art Implementation Plan

## Problem

The "More thoughts on software" (Related Posts) section shows blog post cards with generic document icons when posts don't have featured images. These posts may have ASCII art configured in the CMS, but the `LinkPreview` component doesn't access or display it.

**Current Flow:**
```
RelatedPosts → LinkPreview → /api/link-metadata → shows generic FileText icon
```

**Desired Flow:**
```
RelatedPosts → LinkPreview → /api/link-metadata → shows ASCII art OR featured image
```

---

## Scope Constraints

Per user requirements:
- **Blog posts only** - ASCII art rendering for blog posts
- **NOT case studies** - Continue showing featured images
- **NOT chatbot links** - Chatbot `LinkPreview` usage unchanged

---

## Current Architecture

### Components Involved

| Component | Location | Current Behavior |
|-----------|----------|------------------|
| `RelatedPosts` | `src/components/related-posts/RelatedPosts.tsx` | Server component, fetches posts by slug |
| `RelatedPostsClient` | `src/components/related-posts/RelatedPostsClient.tsx` | Renders cards using `LinkPreview` |
| `LinkPreview` | `src/components/chatbot/LinkPreview.tsx` | Fetches metadata, shows image or FileText icon |
| `/api/link-metadata` | `src/app/api/link-metadata/route.ts` | Returns title, category, description, imageUrl |

### Existing ASCII Art Support

The codebase already has ASCII art support in:
- `BlogPostCard.tsx` - Uses `AsciiArt` component with `hasAsciiArt()` check
- `BlogHero.tsx` - Uses `AsciiArt` component in hero section
- `HomepageFeaturedBlogImage.tsx` - Uses `AsciiArt` component

All use the same pattern:
```tsx
import { AsciiArt, hasAsciiArt } from '@/components/blog/AsciiArt';

if (hasAsciiArt(post.asciiArt)) {
  return <AsciiArt art={post.asciiArt} label={post.asciiArtLabel} />;
}
```

---

## Implementation Plan

### Option 1: Modify LinkPreview for Blog-Specific ASCII Art (Recommended)

Add ASCII art support directly to `LinkPreview` component, only for blog links.

**Pros:**
- Minimal changes (2 files)
- Reuses existing `AsciiArt` component
- Chatbot and case study behavior unchanged

**Cons:**
- LinkPreview becomes slightly more complex

### Option 2: Create Separate BlogLinkPreview Component

Create a dedicated component for blog post cards in Related Posts.

**Pros:**
- Clean separation of concerns
- No risk of affecting chatbot

**Cons:**
- Code duplication
- More files to maintain

**Recommendation:** Option 1 - minimal changes, same result.

---

## Implementation Steps (Option 1)

### Step 1: Update API Response

**File:** `src/app/api/link-metadata/route.ts`

Add `asciiArt` and `asciiArtLabel` to the blog query and response.

**Query change:**
```typescript
const query = `*[_type == "blog" && slug.current == $slug][0] {
  title,
  excerpt,
  heroSection {
    badge,
    title,
    subtitle
  },
  featuredImage {
    asset->{
      _id,
      url
    }
  },
  asciiArt,      // ADD
  asciiArtLabel  // ADD
}`;
```

**Interface change:**
```typescript
export interface LinkMetadata {
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  asciiArt?: string;      // ADD (blog only)
  asciiArtLabel?: string; // ADD (blog only)
}
```

**Response change:**
```typescript
const metadata: LinkMetadata = {
  title: data.title,
  category,
  description,
  imageUrl,
  // Only include ASCII art for blog posts
  ...(type === 'blog' && 'asciiArt' in data && {
    asciiArt: data.asciiArt || undefined,
    asciiArtLabel: data.asciiArtLabel || undefined,
  }),
};
```

---

### Step 2: Update LinkPreview Component

**File:** `src/components/chatbot/LinkPreview.tsx`

Import AsciiArt component and update the card rendering.

**Import:**
```tsx
import { AsciiArt, hasAsciiArt } from '@/components/blog/AsciiArt';
```

**Update LinkMetadata interface:**
```tsx
interface LinkMetadata {
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  asciiArt?: string;
  asciiArtLabel?: string;
}
```

**Update LinkPreviewCard render logic (around line 252-266):**
```tsx
{/* Image or ASCII Art */}
{hasAsciiArt(metadata.asciiArt) ? (
  <div className="w-full md:w-32 h-48 md:h-32 rounded-lg flex-shrink-0 bg-card/50 border border-border/50 flex items-center justify-center overflow-hidden">
    <AsciiArt
      art={metadata.asciiArt}
      label={metadata.asciiArtLabel}
      className="text-[0.35rem] md:text-[0.4rem]"
    />
  </div>
) : hasImage ? (
  <div className="relative w-full md:w-32 h-48 md:h-32 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
    <Image
      src={metadata.imageUrl}
      alt={metadata.title}
      fill
      className="object-cover group-hover:scale-105 transition-transform duration-slow"
      onError={() => setImageError(true)}
    />
  </div>
) : (
  <div className="w-full md:w-32 h-48 md:h-32 rounded-lg flex-shrink-0 bg-gradient-purple flex items-center justify-center">
    <FileText className="w-12 h-12 text-white opacity-80" aria-hidden="true" />
  </div>
)}
```

**Key styling decisions:**
- ASCII art container: `bg-card/50 border border-border/50` (matches BlogPostCard)
- Font size: `text-[0.35rem] md:text-[0.4rem]` (smaller to fit card thumbnail)
- Maintains same dimensions as image placeholder

---

### Step 3: Update Type Definitions (if shared)

If `LinkMetadata` is exported from the API route and used elsewhere, ensure consistency.

---

## Files to Modify

| File | Change |
|------|--------|
| `src/app/api/link-metadata/route.ts` | Add asciiArt fields to blog query and response |
| `src/components/chatbot/LinkPreview.tsx` | Import AsciiArt, update card rendering logic |

---

## Rendering Priority

The display priority for blog post cards:
1. **ASCII Art** (if `asciiArt` field has content)
2. **Featured Image** (if image asset exists)
3. **Generic Icon** (FileText fallback)

This matches the existing pattern in `BlogPostCard` and `BlogHero`.

---

## No Changes Required

These files remain unchanged:
- `RelatedPosts.tsx` - Still fetches posts the same way
- `RelatedPostsClient.tsx` - Still uses `LinkPreview`
- `AsciiArt.tsx` - Existing component reused as-is
- Chatbot components - No changes to their LinkPreview usage

---

## Testing Checklist

- [ ] Blog posts with ASCII art show ASCII art in Related Posts
- [ ] Blog posts with featured image (no ASCII art) show image
- [ ] Blog posts with neither show generic icon
- [ ] Case study links still show featured images (not ASCII art)
- [ ] Chatbot link previews work unchanged
- [ ] ASCII art is readable at thumbnail size
- [ ] Dark mode colors correct
- [ ] Mobile and desktop layouts work

---

## Visual Comparison

**Before:**
```
┌─────────┬────────────────────┐
│ ═══════ │  Title of Post     │
│ FileText│  Description...    │
│  Icon   │                    │
└─────────┴────────────────────┘
```

**After (with ASCII art):**
```
┌─────────┬────────────────────┐
│  ASCII  │  Title of Post     │
│   Art   │  Description...    │
│ (accent)│                    │
└─────────┴────────────────────┘
```

---

## Estimated Scope

- **Files changed:** 2
- **Lines of code:** ~30 added/modified
- **Risk:** Low (additive change, fallback preserved)
- **Breaking changes:** None
