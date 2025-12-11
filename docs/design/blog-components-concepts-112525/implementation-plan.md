# Blog Components Implementation Plan

**Date:** November 25, 2025
**Components:** Tip (Margin Note) + Example Prompt (Classic Italic Blockquote)
**Target:** Blog posts only (Sanity + BlogContent component)

---

## Research Findings

### Blog-Specific Architecture (Separate from Case Studies)

```
Blog Post Page
  └── BlogLayout.tsx (max-w-[920px] — already wide enough!)
        └── BlogContent.tsx (PortableText renderer, separate from case studies)
```

### Key Insight: True Tufte Margins Are Possible

**BlogLayout is already 920px** — wide enough to support:
- Content column: ~680px (comfortable reading width)
- Margin column: ~200px (for notes)
- Gap: ~40px

No need to change container width. Just restructure with CSS Grid.

### Scope: Blog Only

| File | In Scope |
|------|----------|
| `sanity/schemas/blog.ts` | Yes |
| `src/components/blog/BlogLayout.tsx` | Yes |
| `src/components/blog/BlogContent.tsx` | Yes |
| `sanity/schemas/project.ts` | No |
| `src/components/case-study-flowing/*` | No |

---

## Selected Designs

### Tip Component: Tufte Margin Note
- **Wide viewport:** Note sits in right margin column, outside content
- **Narrow viewport:** Floats right within content, text wraps
- **Style:** Line accent (left border), amber for tips, emerald for pro tips

### Example Prompt Component: Classic Italic Blockquote
- **Style:** Serif italic text with gray left border
- **Label:** "Example Prompt" in uppercase muted text
- **Full-width within content column**

---

## Phase 1: Update BlogLayout for Tufte Grid

**File:** `src/components/blog/BlogLayout.tsx`

### Current

```tsx
<article className="w-full max-w-[920px] mx-auto px-6 md:px-8 py-16 md:py-20">
  <div className="space-y-12">
    {children}
  </div>
</article>
```

### Updated

```tsx
<article className="w-full max-w-[920px] mx-auto px-6 md:px-8 py-16 md:py-20">
  <div className="blog-tufte-layout">
    {children}
  </div>
</article>
```

### CSS (add to globals.css)

```css
/* Blog Tufte Layout */
.blog-tufte-layout {
  display: block; /* Default: single column */
}

@media (min-width: 1024px) {
  .blog-tufte-layout {
    display: grid;
    grid-template-columns: minmax(0, 680px) 200px;
    gap: 40px;
  }

  /* Content stays in first column by default */
  .blog-tufte-layout > * {
    grid-column: 1;
  }

  /* Margin notes go to second column */
  .blog-tufte-layout .margin-note {
    grid-column: 2;
    grid-row: span 1;
  }
}
```

---

## Phase 2: Add Sanity Schemas (Blog Only)

**File:** `sanity/schemas/blog.ts`

### 2.1 Add Margin Note to content array

```ts
// Margin Note / Tip
{
  type: 'object',
  name: 'marginNote',
  title: 'Margin Note (Tip)',
  description: 'Appears in the right margin on desktop, inline on mobile.',
  fields: [
    {
      name: 'content',
      title: 'Note Content',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(200),
    },
    {
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Tip', value: 'tip' },
          { title: 'Pro Tip', value: 'pro' },
        ],
        layout: 'radio',
      },
      initialValue: 'tip',
    },
  ],
  preview: {
    select: { content: 'content', variant: 'variant' },
    prepare({ content, variant }) {
      return {
        title: variant === 'pro' ? '💡 Pro Tip' : '💡 Tip',
        subtitle: content?.substring(0, 50) + '...',
      };
    },
  },
},
```

### 2.2 Add Example Prompt to content array

```ts
// Example Prompt
{
  type: 'object',
  name: 'examplePrompt',
  title: 'Example Prompt',
  description: 'Displays a prompt example in italic blockquote style.',
  fields: [
    {
      name: 'prompt',
      title: 'Prompt Text',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'label',
      title: 'Label (optional)',
      type: 'string',
      description: 'Defaults to "Example Prompt"',
    },
  ],
  preview: {
    select: { prompt: 'prompt', label: 'label' },
    prepare({ prompt, label }) {
      return {
        title: `📝 ${label || 'Example Prompt'}`,
        subtitle: prompt?.substring(0, 50) + '...',
      };
    },
  },
},
```

---

## Phase 3: Create React Components

### 3.1 MarginNote Component

**File:** `src/components/blog/MarginNote.tsx`

```tsx
interface MarginNoteProps {
  content: string;
  variant?: 'tip' | 'pro';
}

export function MarginNote({ content, variant = 'tip' }: MarginNoteProps) {
  const borderColor = variant === 'pro'
    ? 'border-l-emerald-500 dark:border-l-emerald-400'
    : 'border-l-amber-500 dark:border-l-amber-400';

  const labelColor = variant === 'pro'
    ? 'text-emerald-600 dark:text-emerald-400'
    : 'text-amber-600 dark:text-amber-400';

  const label = variant === 'pro' ? 'Pro Tip' : 'Tip';

  return (
    <aside
      className={`
        margin-note
        my-4 lg:my-0
        w-full lg:w-auto
        float-right lg:float-none
        ml-6 lg:ml-0 mb-4 lg:mb-0
        max-w-[200px] lg:max-w-none
        border-l-2 ${borderColor} pl-3
      `}
      role="note"
    >
      <span className={`text-[11px] font-semibold uppercase tracking-wide ${labelColor}`}>
        {label}
      </span>
      <p className="text-[13px] text-muted-foreground leading-relaxed mt-1">
        {content}
      </p>
    </aside>
  );
}
```

### 3.2 ExamplePrompt Component

**File:** `src/components/blog/ExamplePrompt.tsx`

```tsx
interface ExamplePromptProps {
  prompt: string;
  label?: string;
}

export function ExamplePrompt({ prompt, label = 'Example Prompt' }: ExamplePromptProps) {
  return (
    <figure className="my-8 border-l-2 border-muted-foreground/30 pl-5">
      <figcaption className="text-[11px] font-medium text-muted-foreground mb-2 uppercase tracking-wide">
        {label}
      </figcaption>
      <blockquote className="font-serif text-lg italic text-foreground/85 leading-relaxed">
        "{prompt}"
      </blockquote>
    </figure>
  );
}
```

---

## Phase 4: Add to BlogContent Renderer

**File:** `src/components/blog/BlogContent.tsx`

### 4.1 Import new components

```tsx
import { MarginNote } from './MarginNote';
import { ExamplePrompt } from './ExamplePrompt';
```

### 4.2 Add to `types` object

```tsx
types: {
  // ... existing types (image, imageGrid, etc.) ...

  // Margin Note (Tip)
  marginNote: ({ value }: PTValueProps) => (
    <MarginNote
      content={value.content}
      variant={value.variant}
    />
  ),

  // Example Prompt
  examplePrompt: ({ value }: PTValueProps) => (
    <ExamplePrompt
      prompt={value.prompt}
      label={value.label}
    />
  ),
},
```

---

## Phase 5: Update BlogContent Export

**File:** `src/components/blog/index.ts`

Add exports for new components:

```ts
export { MarginNote } from './MarginNote';
export { ExamplePrompt } from './ExamplePrompt';
```

---

## Phase 6: Testing

### 6.1 Visual Testing

- [ ] Margin note sits in right column on desktop (1024px+)
- [ ] Margin note floats right on tablet/mobile (<1024px)
- [ ] Text in content column doesn't shift when margin notes are present
- [ ] Multiple margin notes stack vertically in margin column
- [ ] Example prompt italic styling renders correctly
- [ ] Both components work in light and dark mode

### 6.2 CMS Testing

- [ ] Add margin note via Sanity Studio
- [ ] Add example prompt via Sanity Studio
- [ ] Preview shows correctly in Studio
- [ ] Content renders on frontend

### 6.3 Regression Testing

- [ ] Existing blog posts still render correctly
- [ ] Case studies are NOT affected (different renderer)

### 6.4 Accessibility Testing

- [ ] Margin note has `role="note"`
- [ ] Example prompt uses semantic `<figure>`, `<figcaption>`, `<blockquote>`
- [ ] Color contrast meets WCAG AA

---

## File Summary

| File | Action |
|------|--------|
| `sanity/schemas/blog.ts` | Add marginNote and examplePrompt to content array |
| `src/components/blog/BlogLayout.tsx` | Add Tufte grid class |
| `src/components/blog/MarginNote.tsx` | Create |
| `src/components/blog/ExamplePrompt.tsx` | Create |
| `src/components/blog/BlogContent.tsx` | Add type handlers |
| `src/components/blog/index.ts` | Add exports |
| `src/app/globals.css` | Add `.blog-tufte-layout` styles |

---

## Grid Behavior Visualization

### Desktop (1024px+)

```
┌─────────────────────────────────────────────────────┐
│                   BlogLayout (920px)                │
│  ┌──────────────────────────┐  ┌─────────────────┐  │
│  │     Content (680px)      │  │  Margin (200px) │  │
│  │                          │  │                 │  │
│  │  First, I ask the agent  │  │  ┌───────────┐  │  │
│  │  to research whatever... │  │  │ 💡 Tip    │  │  │
│  │                          │  │  │ Always    │  │  │
│  │  This can happen at the  │  │  │ save...   │  │  │
│  │  beginning of a project  │  │  └───────────┘  │  │
│  │  ...                     │  │                 │  │
│  └──────────────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### Mobile (<1024px)

```
┌─────────────────────────────┐
│    Content (full width)     │
│                             │
│  First, I ask  ┌─────────┐  │
│  the agent to  │ 💡 Tip  │  │
│  research...   │ Always  │  │
│                │ save... │  │
│  This can      └─────────┘  │
│  happen at the beginning... │
└─────────────────────────────┘
```

---

## Success Metrics

| Metric | Target |
|--------|--------|
| True Tufte margin on desktop | Pass |
| Float fallback on mobile | Pass |
| Blog-only (case studies unaffected) | Pass |
| Dark mode support | Pass |
| CMS authors can add without code | Pass |
| Accessibility standards | Pass |
