# ASCII Art CMS Text Field Implementation Plan

**Created:** December 12, 2025
**Status:** Draft
**Estimated Effort:** ~2 hours implementation + testing

## Overview

Migrate ASCII art storage from a hardcoded TypeScript registry to a CMS-managed text field in Sanity. This enables content editors to paste ASCII art directly into blog posts without code changes.

### Current State

- **Schema:** Radio button selector with predefined options (`none`, `filing-cabinet`)
- **Storage:** Hardcoded in `src/components/blog/AsciiArt.tsx` registry
- **Types:** Union type `'none' | 'filing-cabinet'`
- **Posts using ASCII art:** 1 (Filing Cabinet blog post)

### Target State

- **Schema:** Multiline text field with validation
- **Storage:** Directly in Sanity document
- **Types:** `string | null`
- **Validation:** Character set, dimensions, and format checks in Sanity

---

## Success Metrics

| Metric | Target | Verification Method |
|--------|--------|---------------------|
| Existing post renders correctly | Filing Cabinet art displays unchanged | Visual comparison before/after |
| Validation catches invalid art | Rejects non-ASCII, oversized art | Test in Sanity Studio |
| New art can be added | Paste → Save → Preview works | Add test art to draft post |
| Build passes | No TypeScript errors | `npm run build` succeeds |
| No regression in blog pages | All blog routes render | Manual check + existing tests |
| Accessibility preserved | Screen reader label still works | Check `aria-label` attribute |

---

## Implementation Plan

### Phase 1: Schema Changes

**File:** `sanity/schemas/blog.ts`

#### 1.1 Replace Radio Field with Text Field

**Current (lines 428-441):**
```typescript
defineField({
  name: 'asciiArt',
  title: 'ASCII Art (Alternative to Image)',
  type: 'string',
  description: 'Display ASCII art instead of featured image. Select "None" to use featured image.',
  options: {
    list: [
      { title: 'None', value: 'none' },
      { title: 'Filing Cabinet', value: 'filing-cabinet' },
    ],
    layout: 'radio',
  },
  initialValue: 'none',
}),
```

**New:**
```typescript
defineField({
  name: 'asciiArt',
  title: 'ASCII Art (Alternative to Image)',
  type: 'text',
  description: 'Paste ASCII art to display instead of featured image. Leave empty to use featured image. Max 80 chars wide, 50 lines tall.',
  rows: 20,
  validation: (Rule) => Rule.custom((value) => {
    if (!value) return true; // Empty is valid (uses featured image)

    const lines = value.split('\n');
    const maxWidth = 80;
    const maxHeight = 50;

    // Check height
    if (lines.length > maxHeight) {
      return `Too tall: ${lines.length} lines (max ${maxHeight})`;
    }

    // Check width
    const longestLine = Math.max(...lines.map(l => l.length));
    if (longestLine > maxWidth) {
      return `Line too wide: ${longestLine} chars (max ${maxWidth})`;
    }

    // Check for non-ASCII characters (allow printable ASCII + newlines)
    if (!/^[\x20-\x7E\n\r]*$/.test(value)) {
      return 'Contains non-ASCII characters. Use only standard keyboard characters.';
    }

    // Check for tabs (should use spaces)
    if (value.includes('\t')) {
      return 'Contains tabs. Please convert tabs to spaces for consistent rendering.';
    }

    return true;
  }),
}),

defineField({
  name: 'asciiArtLabel',
  title: 'ASCII Art Description',
  type: 'string',
  description: 'Accessibility label describing the ASCII art (for screen readers)',
  hidden: ({ parent }) => !parent?.asciiArt,
  validation: (Rule) => Rule.custom((value, context) => {
    const parent = context.parent as { asciiArt?: string };
    if (parent?.asciiArt && !value) {
      return 'Please provide an accessibility description for the ASCII art';
    }
    return true;
  }),
}),
```

### Phase 2: TypeScript Types

**File:** `src/types/blog.ts`

#### 2.1 Update Blog Interface

**Current (line 67):**
```typescript
asciiArt?: 'none' | 'filing-cabinet';
```

**New:**
```typescript
asciiArt?: string | null;
asciiArtLabel?: string;
```

#### 2.2 Update BlogListItem Interface

**Current (line 83):**
```typescript
asciiArt?: 'none' | 'filing-cabinet';
```

**New:**
```typescript
asciiArt?: string | null;
asciiArtLabel?: string;
```

### Phase 3: Component Updates

**File:** `src/components/blog/AsciiArt.tsx`

#### 3.1 Simplify to Accept Raw Art

**New implementation:**
```typescript
'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface AsciiArtProps {
  art: string;
  label?: string;
  className?: string;
}

/**
 * AsciiArt Component
 *
 * Renders ASCII art from CMS using the dynamic accent color.
 * Used as an alternative to featured images in blog posts.
 */
export function AsciiArt({ art, label, className }: AsciiArtProps) {
  if (!art) {
    return null;
  }

  return (
    <pre
      className={cn(
        'text-accent font-mono text-[0.4rem] sm:text-[0.5rem] md:text-[0.6rem] leading-tight whitespace-pre select-none',
        className
      )}
      aria-label={label || 'ASCII art illustration'}
      role="img"
    >
      {art}
    </pre>
  );
}

/**
 * Type guard to check if ASCII art should be displayed
 */
export function hasAsciiArt(art: string | null | undefined): art is string {
  return !!art && art.trim().length > 0;
}
```

### Phase 4: Update Consuming Components

#### 4.1 BlogHero.tsx

**File:** `src/components/blog/BlogHero.tsx`

**Changes:**
- Update import: `import { AsciiArt, hasAsciiArt } from './AsciiArt';`
- Update prop type: `asciiArt?: string | null;` and `asciiArtLabel?: string;`
- Update condition: `const showAsciiArt = hasAsciiArt(asciiArt);`
- Update component: `<AsciiArt art={asciiArt} label={asciiArtLabel} className="..." />`

#### 4.2 BlogPostCard.tsx

**File:** `src/components/blog/BlogPostCard.tsx`

**Changes:**
- Same pattern as BlogHero

#### 4.3 HomepageFeaturedBlogImage.tsx

**File:** `src/components/HomepageFeaturedBlogImage.tsx`

**Changes:**
- Same pattern as BlogHero

### Phase 5: Update GROQ Queries

**File:** `src/lib/sanity/queries/blog.ts`

Add `asciiArtLabel` to all queries that fetch `asciiArt`:

- `allBlogPostsQuery` (line 21): Add `asciiArtLabel` after `asciiArt`
- `blogPostBySlugQuery` (line 71): Add `asciiArtLabel` after `asciiArt`
- `featuredBlogQuery` (line 136): Add `asciiArtLabel` after `asciiArt`

### Phase 6: Migrate Existing Data

#### 6.1 Get Current Filing Cabinet Art

Copy from registry before removing:
```
   ______________________________
  /                             |
 /                             /|
/_____________________________/ |
|     [______]           (o) |  |
|     [========]             |  |
|----------------------------| /|
|     [______]               |  |
|     [========]             |  |
|----------------------------| /|
|     [______]               |  |
|     [========]             |  |
|____________________________|/
   ███                   ███
```

#### 6.2 Update Blog Post in Sanity

1. Open Sanity Studio: `http://localhost:3000/studio`
2. Navigate to: Blog → "A Filing Cabinet is Not the Best Collaborator"
3. Paste the filing cabinet art into the new text field
4. Add label: "ASCII art illustration of a filing cabinet"
5. Publish

### Phase 7: Cleanup

#### 7.1 Remove Old Registry Code

Delete the `ASCII_ART_REGISTRY` constant and `AsciiArtType` export from `AsciiArt.tsx`.

#### 7.2 Remove Chatbot ASCII Art Helper (if applicable)

**File:** `src/lib/chatbot/ascii-art.ts`

Check if this file references the old registry and update accordingly.

---

## File Change Summary

| File | Action | Lines Changed |
|------|--------|---------------|
| `sanity/schemas/blog.ts` | Modify | ~30 |
| `src/types/blog.ts` | Modify | ~6 |
| `src/components/blog/AsciiArt.tsx` | Rewrite | ~40 |
| `src/components/blog/BlogHero.tsx` | Modify | ~8 |
| `src/components/blog/BlogPostCard.tsx` | Modify | ~8 |
| `src/components/HomepageFeaturedBlogImage.tsx` | Modify | ~8 |
| `src/lib/sanity/queries/blog.ts` | Modify | ~3 |
| `src/lib/chatbot/ascii-art.ts` | Check/Modify | TBD |

**Total:** ~8 files, ~100 lines

---

## Testing Checklist

### Pre-Migration
- [ ] Screenshot current filing cabinet blog post (desktop + mobile)
- [ ] Note current art dimensions and appearance

### Post-Migration
- [ ] Build passes: `npm run build`
- [ ] Filing cabinet post renders identically to screenshot
- [ ] Sanity validation rejects:
  - [ ] Art wider than 80 characters
  - [ ] Art taller than 50 lines
  - [ ] Art with unicode/emoji characters
  - [ ] Art with tab characters
- [ ] Sanity validation accepts:
  - [ ] Valid ASCII art within limits
  - [ ] Empty field (shows featured image instead)
- [ ] Accessibility label appears in HTML (`aria-label`)
- [ ] New ASCII art can be added to a draft post
- [ ] Homepage featured blog displays correctly
- [ ] Blog listing page displays correctly

---

## Rollback Plan

If issues arise:

1. **Revert schema:** Restore radio button field from git history
2. **Restore types:** Revert to union type
3. **Restore component:** Revert to registry-based AsciiArt.tsx
4. **Data:** Existing post still has `asciiArt: 'filing-cabinet'` value

Low risk since the old value (`'filing-cabinet'`) remains valid as a string.

---

## Future Enhancements (Out of Scope)

- [ ] Sanity custom input component with monospace preview
- [ ] Character dimension counter in Sanity UI
- [ ] Library of pre-made ASCII art to insert
- [ ] Automatic line-length normalization

---

## Notes

- Validation limits (80 chars × 50 lines) are generous; the filing cabinet is ~35 chars × 14 lines
- The `hidden` property on `asciiArtLabel` shows it only when art is present
- `font-mono` class ensures consistent character width rendering
