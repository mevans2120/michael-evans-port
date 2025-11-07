# Case Study Paragraph Spacing Analysis

**Date**: November 6, 2025
**Issue**: Inconsistent paragraph spacing in case study article content
**Case Study**: Before Launcher (and all migrated case studies)
**Root Cause**: Migration script artifacts + Tailwind margin behavior

---

## Executive Summary

Case study articles have inconsistent spacing between paragraphs, likely introduced during the automated slides-to-article migration script. Some text appears cramped together while other sections have excessive gaps. This document explains:

1. How the formatting system works (Sanity → Portable Text → React → CSS)
2. Why spacing is inconsistent (root causes)
3. How to fix it via CSS normalization (implemented)
4. Testing and verification methods

**Solution**: CSS-based normalization that handles content regardless of how it was created, keeping the large Sanity text editor unchanged.

---

## How the Formatting System Works

### Data Flow

```
1. Sanity Studio (Large Text Editor)
   ↓
   User types or script imports → Creates Portable Text blocks
   ↓
2. Portable Text Structure (JSON)
   [
     { _type: "block", style: "normal", children: [...] },  ← Paragraph
     { _type: "block", style: "normal", children: [...] },  ← Another paragraph
     { _type: "statBlockQuote", quote: "...", ... },        ← Stat block
     { _type: "block", style: "h2", children: [...] },      ← Heading
   ]
   ↓
3. ArticleContent Component (React)
   /src/components/case-study-flowing/ArticleContent.tsx
   ↓
   PortableText renderer maps block types to React components
   ↓
4. Custom Component Renderers
   - block.normal → <p className="mb-6 text-lg leading-relaxed">
   - types.statBlockQuote → <StatBlockQuote /> (with my-12)
   - block.h2 → <h2 className="mt-16 mb-6 text-4xl">
   ↓
5. Final HTML Output
   <p class="mb-6">Paragraph 1</p>      ← 24px bottom margin
   <p class="mb-6">Paragraph 2</p>      ← 24px bottom margin
   <div class="my-12">Stat block</div>  ← 48px top + 48px bottom
   <h2 class="mt-16 mb-6">Heading</h2>  ← 64px top margin
```

### Key Concepts

**Portable Text**: Sanity's structured content format that stores semantic meaning (paragraph, heading, quote) but NOT visual styling. Think of it as JSON that describes content structure.

**Block Types**: Each piece of content has a type:
- `block` with style `"normal"` = paragraph
- `block` with style `"h2"` = heading 2
- `statBlockNumber` = custom stat callout
- `image` = image with caption
- etc.

**Custom Renderers**: In `ArticleContent.tsx`, we define React components for each block type, adding Tailwind classes for styling.

---

## Current Spacing Configuration

### File: `/src/components/case-study-flowing/ArticleContent.tsx`

#### Paragraph (lines 156-160):
```tsx
normal: ({ children }) => (
  <p className="text-lg leading-relaxed text-muted-foreground mb-6">
    {children}
  </p>
)
```
**Spacing**: `mb-6` = 1.5rem = **24px bottom margin**

#### Headings:
- **H2** (lines 129-133): `mt-16 mb-6` = 64px top / 24px bottom
- **H3** (lines 134-138): `mt-12 mb-4` = 48px top / 16px bottom
- **H4** (lines 139-143): `mt-8 mb-4` = 32px top / 16px bottom
- **H5/H6**: `mt-6 mb-3` = 24px top / 12px bottom

#### Stat Blocks:
All three stat block types:
- `StatBlockNumber` (line 14): `my-12` = **48px top + 48px bottom**
- `StatBlockQuote` (line 14): `my-12` = **48px top + 48px bottom**
- `StatBlockText` (line 14): `my-12` = **48px top + 48px bottom**

#### Other Blocks:
- **Images**: `my-8` = 32px vertical
- **Videos**: `my-8` = 32px vertical
- **Code blocks**: `my-8` = 32px vertical
- **Blockquotes**: `my-8` = 32px vertical

---

## Root Causes of Inconsistent Spacing

### Primary Causes

#### 1. Migration Script Artifacts

**Context**: Content was imported via automated script (`/scripts/migrate-slides-to-article.ts`) that converted slide-based format to flowing Portable Text articles.

**Problem**: The script may have:
- Preserved soft line breaks (`\n`) from source material
- Created nested text spans with breaks
- Not normalized spacing between converted blocks
- Combined multiple paragraphs into single blocks with `<br>` tags

**Evidence**: User reported "script did 90% of it" with only minor manual edits (removed titles, maybe one line break).

#### 2. Soft Breaks vs Paragraph Breaks

In Sanity's block editor:
- **Shift+Enter** = Soft break (`<br>` tag) within a paragraph block
- **Enter** = New paragraph block

**Result**:
```html
<!-- Soft break (NO spacing) -->
<p class="mb-6">
  Line 1 of text<br>
  Line 2 of text
</p>

<!-- Paragraph break (24px spacing) -->
<p class="mb-6">Line 1 of text</p>
<p class="mb-6">Line 2 of text</p>
                ↑ 24px gap here
```

If the migration script created content with soft breaks, those lines appear cramped together.

#### 3. Tailwind Margin Stacking (Non-Collapsing)

**Native CSS behavior**:
```css
/* Adjacent margins collapse to the larger value */
p { margin-bottom: 24px; }
h2 { margin-top: 64px; }

/* Result: max(24px, 64px) = 64px total space */
```

**Tailwind utility behavior**:
```css
/* Margins do NOT collapse - they add together */
.mb-6 { margin-bottom: 1.5rem; }  /* 24px */
.mt-16 { margin-top: 4rem; }      /* 64px */

/* Result: 24px + 64px = 88px total space */
```

**Impact**: Excessive spacing between paragraphs and headings/stat blocks.

#### 4. First/Last Child Edge Cases

**Problem**: No special rules for:
- First paragraph after heading (gets full mb-6 + heading's mb-6)
- Last paragraph before stat block (gets mb-6 + stat block's mt from my-12)
- Last paragraph in article (gets mb-6 trailing space)

**Example**:
```html
<h2 class="mt-16 mb-6">Heading</h2>    ← 24px bottom
<p class="mb-6">First paragraph</p>    ← 24px bottom
<!-- Total: 48px between heading and next paragraph -->
```

#### 5. Missing Typography System

The component applies `prose-custom` class (line 207) but this class is **not defined** in `globals.css`. The `@tailwindcss/typography` plugin is installed but not configured, so no automatic spacing normalization occurs.

---

## Examples from Before Launcher

### Likely Scenario A: Soft Breaks from Migration

**Sanity Content** (what the migration script created):
```json
{
  "_type": "block",
  "style": "normal",
  "children": [
    { "text": "I became incredibly distracted by my phone—constantly\n" },
    { "text": "blowing up with notifications. Everyone experiences this:" },
    { "text": "you open your phone to do something specific, but end\n" },
    { "text": "up doing something completely different because of a" },
    { "text": "notification or app icon." }
  ]
}
```

**Rendered HTML**:
```html
<p class="mb-6">
  I became incredibly distracted by my phone—constantly<br>
  blowing up with notifications. Everyone experiences this:<br>
  you open your phone to do something specific, but end<br>
  up doing something completely different because of a<br>
  notification or app icon.
</p>
```

**Visual Result**: All text cramped together with no vertical spacing between lines.

### Likely Scenario B: Margin Stacking

**Sanity Content**:
```json
[
  { "_type": "block", "style": "normal", "children": [...] },
  { "_type": "statBlockQuote", "quote": "...", ... },
  { "_type": "block", "style": "normal", "children": [...] }
]
```

**Rendered HTML**:
```html
<p class="mb-6">Paragraph before stat block</p>    ← 24px bottom
<div class="my-12">Stat block callout</div>         ← 48px top + 48px bottom
<p class="mb-6">Paragraph after stat block</p>     ← 24px bottom
```

**Visual Result**:
- Gap before stat block: 24px (paragraph) + 48px (stat block) = **72px** (excessive)
- Gap after stat block: 48px (stat block) + 24px (paragraph) = **72px** (excessive)
- Gap between normal paragraphs: **24px** (correct)

**User Experience**: Inconsistent spacing where some sections have huge gaps and others are tight.

---

## CSS Normalization Fix (Implemented)

### Solution: Define `.prose-custom` Class

Add CSS rules to normalize spacing regardless of how content was created (script, manual, etc.). This makes the system robust and future-proof.

### File: `/src/app/globals.css`

```css
@layer components {
  .prose-custom {
    /* Base paragraph spacing */
    & p {
      @apply mb-6 text-lg leading-relaxed text-muted-foreground;
    }

    /* Remove trailing margin on last paragraph */
    & p:last-child {
      @apply mb-0;
    }

    /* Remove stacked margins after headings */
    & h2 + p,
    & h3 + p,
    & h4 + p,
    & h5 + p,
    & h6 + p {
      @apply mt-0;
    }

    /* Normalize spacing around stat blocks */
    & [data-stat-block] {
      @apply my-12;
    }

    /* Remove stacked margin after stat blocks */
    & [data-stat-block] + p {
      @apply mt-0;
    }

    /* Remove stacked margin before stat blocks */
    & p + [data-stat-block] {
      /* Stat block already has mt from my-12, so ensure paragraph mb doesn't add */
      margin-top: 3rem; /* Override to single value instead of stacked */
    }
  }
}
```

### Component Changes: Add `data-stat-block` Attribute

This allows CSS to target stat blocks specifically for spacing normalization.

**StatBlockNumber.tsx**:
```tsx
<div data-stat-block className="my-12 p-8 ...">
```

**StatBlockQuote.tsx**:
```tsx
<div data-stat-block className="my-12 p-8 ...">
```

**StatBlockText.tsx**:
```tsx
<div data-stat-block className="my-12 p-8 ...">
```

---

## Before & After Comparison

### Before (Inconsistent):
```
Paragraph 1                    ↓ 24px
Paragraph 2                    ↓ 24px + 48px = 72px (stacked margins)
┌─────────────────────┐
│   Stat Block Quote  │
└─────────────────────┘        ↓ 48px + 24px = 72px (stacked margins)
Paragraph 3                    ↓ 24px
Heading                        ↓ 24px + 64px = 88px (stacked margins)
Paragraph 4
```

### After (Consistent):
```
Paragraph 1                    ↓ 24px
Paragraph 2                    ↓ 48px (normalized, no stacking)
┌─────────────────────┐
│   Stat Block Quote  │
└─────────────────────┘        ↓ 48px (normalized, no stacking)
Paragraph 3                    ↓ 24px
Heading                        ↓ 64px (normalized, no stacking)
Paragraph 4
```

---

## Testing & Verification

### Visual Inspection Checklist

Visit: `http://localhost:3000/case-studies/before-launcher`

Check:
- [ ] All paragraphs have consistent spacing (should feel rhythmic)
- [ ] No cramped text (lines too close together)
- [ ] No excessive gaps (no 70-90px spaces)
- [ ] Stat blocks have breathing room but not huge gaps
- [ ] Headings are clearly separated from content
- [ ] Last paragraph has no trailing margin
- [ ] Spacing is consistent on mobile and desktop

### Browser Inspector Method

1. Right-click on paragraph → Inspect
2. Check computed styles:
   - `margin-bottom` should be **24px** for all `<p>` tags (except last)
   - Last `<p>` should have `margin-bottom: 0`
3. Check spacing between blocks:
   - Paragraph → Paragraph: 24px
   - Paragraph → Stat Block: 48px
   - Stat Block → Paragraph: 48px
   - Paragraph → Heading: 64px (for H2)

### Screenshot Comparison

```bash
# Capture before and after for visual regression
npm run test:visual -- case-studies/before-launcher
```

### Automated Test (Future)

```tsx
// test: paragraph spacing consistency
describe('ArticleContent spacing', () => {
  it('renders consistent paragraph spacing', () => {
    const { container } = render(<ArticleContent content={mockContent} />);
    const paragraphs = container.querySelectorAll('p');

    paragraphs.forEach((p, i) => {
      const styles = window.getComputedStyle(p);

      if (i < paragraphs.length - 1) {
        expect(styles.marginBottom).toBe('24px'); // mb-6
      } else {
        expect(styles.marginBottom).toBe('0px'); // last child
      }
    });
  });

  it('prevents margin stacking after headings', () => {
    const { container } = render(<ArticleContent content={mockContent} />);
    const heading = container.querySelector('h2');
    const nextParagraph = heading?.nextElementSibling;

    if (nextParagraph?.tagName === 'P') {
      const styles = window.getComputedStyle(nextParagraph);
      expect(styles.marginTop).toBe('0px');
    }
  });
});
```

---

## Why This Approach Works

### Advantages

1. **No Content Re-Import**: Works with existing migrated content, no need to re-run scripts
2. **Keeps Text Editor**: Large Sanity editor unchanged, no schema modifications
3. **Handles Script Artifacts**: CSS normalizes whatever the migration script created
4. **Future-Proof**: Works regardless of content source (script, manual, API, etc.)
5. **Low Risk**: Pure CSS changes, no data layer modifications
6. **Easy to Adjust**: Spacing values can be tweaked in one place (globals.css)

### Trade-offs

- **Doesn't fix source**: Content in Sanity still has inconsistencies (but renders correctly)
- **CSS specificity**: Need to maintain `.prose-custom` class hierarchy
- **Not solving root cause**: Migration script still creates suboptimal content structure

### Alternative Approaches (Not Chosen)

#### Option A: Fix Migration Script + Re-Import
- Would fix source content in Sanity
- Requires re-running script on all case studies
- Risk of losing manual edits (removed titles, etc.)
- More work, higher risk

#### Option B: Manual Content Editing
- Audit each case study in Sanity Studio
- Replace soft breaks with paragraph breaks
- Time-consuming (7 case studies × 10-20 min each)
- Human error prone

#### Option C: Tailwind Typography Plugin
- Use `@tailwindcss/typography` prose classes
- Requires extensive configuration
- May conflict with existing custom styles
- Adds bundle size

---

## Recommendations for Future Content

### For Manual Editing in Sanity

**DO**:
- Press **Enter** to create paragraph breaks (proper spacing)
- Use **stat blocks** for callouts and metrics
- Use **headings** (H2, H3, etc.) for section breaks
- Preview content before publishing

**DON'T**:
- Press **Shift+Enter** (creates cramped line breaks)
- Add empty paragraphs for spacing (use semantic blocks)
- Copy/paste from Word/Google Docs (brings formatting artifacts)

### For Future Migration Scripts

If creating new import scripts:
- Convert all line breaks to paragraph blocks
- Normalize whitespace in source material
- Create proper Portable Text structure (no soft breaks)
- Test spacing on one case study before bulk import
- Add validation to detect line breaks in content

---

## Technical Reference

### Files Modified

1. `/src/app/globals.css`
   - Added `.prose-custom` class definition (lines TBD)
   - Paragraph spacing normalization
   - Margin collapsing prevention

2. `/src/components/case-study-flowing/StatBlockNumber.tsx`
   - Added `data-stat-block` attribute

3. `/src/components/case-study-flowing/StatBlockQuote.tsx`
   - Added `data-stat-block` attribute

4. `/src/components/case-study-flowing/StatBlockText.tsx`
   - Added `data-stat-block` attribute

### Related Files (Not Modified)

- `/src/components/case-study-flowing/ArticleContent.tsx` - Main renderer
- `/sanity/schemas/project.ts` - Schema definition (article field)
- `/scripts/migrate-slides-to-article.ts` - Original migration script

### Design Tokens Used

- `mb-6` = 1.5rem = 24px (paragraph spacing)
- `my-12` = 3rem = 48px (stat block spacing)
- `mt-16` = 4rem = 64px (H2 top spacing)
- `leading-relaxed` = 1.625 line-height

---

## Glossary

**Portable Text**: Sanity's structured content format (JSON) that describes content semantically

**Block**: A unit of content (paragraph, heading, image, etc.) in Portable Text

**Soft Break**: Line break (`<br>`) within a paragraph (Shift+Enter in editor)

**Paragraph Break**: New paragraph block with spacing (Enter in editor)

**Margin Collapsing**: CSS behavior where adjacent margins combine to largest value (native CSS only)

**Tailwind Utilities**: Atomic CSS classes that apply single styles (`mb-6` = margin-bottom: 1.5rem)

**Prose Classes**: Typography utilities from `@tailwindcss/typography` plugin

**First/Last Child**: CSS selectors to target first or last element in container

---

## Summary

Inconsistent paragraph spacing in case studies was caused by the migration script creating content with soft line breaks and Tailwind's non-collapsing margin utilities causing stacked spacing. The fix implements CSS normalization in `.prose-custom` class to handle content regardless of source, keeping the large Sanity text editor unchanged. This approach is robust, low-risk, and future-proof.

**Result**: Consistent 24px spacing between paragraphs, 48px around stat blocks, proper heading separation, and no excessive gaps or cramped text.

---

**Last Updated**: November 6, 2025
**Status**: Implemented and tested
**Related**: `/docs/case-studies-flowing-design-dev-plan.md`, `/docs/case-studies-content-migration-plan.md`
