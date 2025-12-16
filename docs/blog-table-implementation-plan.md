# Blog Table Block Implementation Plan

## Overview

Add table support to blog and case study content, allowing editors to create structured data tables directly in Sanity CMS. Tables will use the accent color and follow the existing design system.

## Goals

- Enable content editors to add tables within blog post content
- Use accent color for header styling (matching design system)
- Support dark mode automatically
- Mobile-responsive with horizontal scroll
- Accessible with proper semantic HTML
- Consistent with existing content block patterns

---

## Files to Modify/Create

| File | Action | Purpose |
|------|--------|---------|
| `sanity/schemas/blog.ts` | Modify | Add table block type to content array |
| `src/components/blog/ContentTable.tsx` | Create | Table renderer component |
| `src/components/blog/BlogContent.tsx` | Modify | Register table in Portable Text types |
| `sanity/schemas/project.ts` | Modify (optional) | Add table to case study content |

---

## Implementation Steps

### Step 1: Create Table Component

**File:** `src/components/blog/ContentTable.tsx`

```tsx
'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from '@/components/ui/table';

interface TableRowData {
  _key: string;
  cells: string[];
}

interface ContentTableProps {
  caption?: string;
  headers: string[];
  rows: TableRowData[];
}

/**
 * ContentTable Component
 *
 * Renders a table within blog/case study content.
 * Uses accent color for headers, follows design system.
 */
export function ContentTable({ caption, headers, rows }: ContentTableProps) {
  if (!rows?.length) return null;

  return (
    <figure className="my-8 -mx-4 md:mx-0">
      <div className="overflow-x-auto">
        <Table>
          {caption && (
            <TableCaption className="text-muted-foreground font-serif">
              {caption}
            </TableCaption>
          )}
          <TableHeader>
            <TableRow className="border-b-2 border-accent hover:bg-transparent">
              {headers.map((header, index) => (
                <TableHead
                  key={index}
                  className="text-accent-foreground bg-accent/10 font-sans font-medium"
                >
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row._key}
                className="border-border"
              >
                {row.cells.map((cell, cellIndex) => (
                  <TableCell
                    key={cellIndex}
                    className="font-serif text-foreground"
                  >
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </figure>
  );
}
```

**Design system alignment:**
- Uses `text-accent-foreground` and `bg-accent/10` for header styling
- Uses `border-accent` for header bottom border
- Uses `text-foreground`, `text-muted-foreground` for content
- Uses `transition-colors-smooth` for hover effects
- Uses `font-serif` for body text (matches blog content)
- Uses `font-sans` for headers (matches design patterns)
- Negative margin on mobile for full-bleed effect

---

### Step 2: Add Sanity Schema Block

**File:** `sanity/schemas/blog.ts`

Add to the `content` field's `of` array (around line 357, after `examplePrompt`):

```typescript
// Table - structured data display
{
  type: 'object',
  name: 'contentTable',
  title: 'Table',
  description: 'A table for displaying structured data',
  fields: [
    {
      name: 'caption',
      type: 'string',
      title: 'Caption',
      description: 'Optional description shown below the table',
    },
    {
      name: 'headers',
      type: 'array',
      title: 'Column Headers',
      description: 'Header labels for each column',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.required().min(2).max(6)
        .error('Table must have 2-6 columns'),
    },
    {
      name: 'rows',
      type: 'array',
      title: 'Rows',
      description: 'Table data rows',
      of: [
        {
          type: 'object',
          name: 'tableRow',
          fields: [
            {
              name: 'cells',
              type: 'array',
              title: 'Cells',
              of: [{ type: 'string' }],
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: { cells: 'cells' },
            prepare({ cells }: { cells?: string[] }) {
              return {
                title: cells?.join(' | ') || 'Empty row',
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1)
        .error('Table must have at least one row'),
    },
  ],
  preview: {
    select: {
      headers: 'headers',
      caption: 'caption',
      rows: 'rows',
    },
    prepare({ headers, caption, rows }: {
      headers?: string[];
      caption?: string;
      rows?: unknown[]
    }) {
      const colCount = headers?.length || 0;
      const rowCount = rows?.length || 0;
      return {
        title: caption || 'Table',
        subtitle: `${colCount} columns, ${rowCount} rows`,
      };
    },
  },
},
```

**Schema design decisions:**
- 2-6 columns limit prevents overly wide tables
- Each row has a `_key` automatically (Sanity arrays)
- Preview shows column/row count for editor clarity
- Caption is optional for flexibility

---

### Step 3: Register in Portable Text Renderer

**File:** `src/components/blog/BlogContent.tsx`

Add import at top:
```typescript
import { ContentTable } from './ContentTable';
```

Add to the `types` object (inside `PortableTextComponents`):
```typescript
contentTable: ({ value }: PTValueProps) => (
  <ContentTable
    caption={value.caption}
    headers={value.headers}
    rows={value.rows}
  />
),
```

---

### Step 4: Add TypeScript Types (Optional but Recommended)

**File:** `src/types/blog.ts`

Add to existing types:
```typescript
export interface TableRow {
  _key: string;
  cells: string[];
}

export interface ContentTable {
  _type: 'contentTable';
  _key: string;
  caption?: string;
  headers: string[];
  rows: TableRow[];
}
```

---

## Visual Design Specification

### Header Row
- Background: `bg-accent/10` (subtle accent tint)
- Text: `text-accent-foreground`
- Border bottom: `border-b-2 border-accent` (strong accent line)
- Font: Sans-serif, medium weight

### Body Rows
- Background: transparent (inherits from card/page)
- Text: `text-foreground`, serif font
- Border: `border-border` (subtle separators)

### Caption
- Position: Below table (HTML default)
- Color: `text-muted-foreground`
- Font: Serif (matches body text)

### Responsive Behavior
- Mobile: Horizontal scroll with `-mx-4` for full-width
- Desktop: Normal margins, no scroll unless needed

### Dark Mode
All colors use semantic tokens that automatically adapt:
- `accent` colors shift appropriately
- `muted` and `border` colors adjust
- No manual dark mode classes needed

---

## Testing Checklist

- [ ] Table renders correctly with 2 columns
- [ ] Table renders correctly with 6 columns (max)
- [ ] Empty table shows nothing (graceful fallback)
- [ ] Caption displays below table when provided
- [ ] Caption hidden when not provided
- [ ] Header row uses accent styling
- [ ] Horizontal scroll works on mobile
- [ ] Dark mode colors correct
- [ ] Screen reader announces table structure
- [ ] Sanity preview shows column/row count

---

## Example Usage in Sanity

After implementation, editors can add tables like:

**Headers:** `["Feature", "Free Plan", "Pro Plan"]`

**Rows:**
1. `["Storage", "5 GB", "100 GB"]`
2. `["API Calls", "1,000/mo", "Unlimited"]`
3. `["Support", "Community", "Priority"]`

**Caption:** `"Plan comparison as of December 2024"`

---

## Future Enhancements (Not in Scope)

These could be added later if needed:
- Column alignment options (left/center/right)
- Row highlighting/striping option
- Sortable columns
- Merged cells
- Rich text in cells (links, bold)

---

## Estimated Scope

- **Files changed:** 3-4
- **New component:** 1
- **Lines of code:** ~150
- **Complexity:** Low-medium (follows existing patterns exactly)
