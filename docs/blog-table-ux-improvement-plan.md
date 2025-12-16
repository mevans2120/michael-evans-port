# Blog Table UX Improvement Plan

## Problem

The current table schema separates headers from row data, making it unclear that:
1. Each row's cells must match the number of headers
2. Cell order corresponds to column order

Users naturally want to enter data "vertically" (all values for column 1, then column 2), but the schema expects "horizontal" entry (all cells for row 1, then row 2).

---

## Proposed Solution: Column-Based Data Entry

Restructure the schema so users define **columns** instead of rows. Each column contains its header and all values for that column. The component transposes this into a traditional table on render.

### Benefits
- Intuitive vertical data entry (fill in one column at a time)
- Header stays visually connected to its data
- No mismatch between header count and cell count possible
- Better Sanity Studio preview

### Data Model

**Before (row-based):**
```
headers: ["Rating", "Meaning"]
rows: [
  { cells: ["+3", "Such a good idea..."] },
  { cells: ["+2", "Such a good idea..."] },
]
```

**After (column-based):**
```
columns: [
  { header: "Rating", values: ["+3", "+2", "+1", "0", "-1", "-2", "-3"] },
  { header: "Meaning", values: ["Such a good...", "Such a good...", ...] }
]
```

---

## Implementation Steps

### Step 1: Update Sanity Schema

**File:** `sanity/schemas/blog.ts`

Replace the current `contentTable` block with:

```typescript
// Table - structured data display (column-based entry)
{
  type: 'object',
  name: 'contentTable',
  title: 'Table',
  description: 'A table for displaying structured data. Enter data by column.',
  fields: [
    {
      name: 'caption',
      type: 'string',
      title: 'Caption',
      description: 'Optional description shown below the table',
    },
    {
      name: 'columns',
      type: 'array',
      title: 'Columns',
      description: 'Add 2-6 columns. Each column has a header and values.',
      of: [
        {
          type: 'object',
          name: 'tableColumn',
          title: 'Column',
          fields: [
            {
              name: 'header',
              type: 'string',
              title: 'Column Header',
              description: 'The header label for this column',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'values',
              type: 'array',
              title: 'Column Values',
              description: 'All values for this column (one per row)',
              of: [{ type: 'string' }],
              validation: (Rule) => Rule.required().min(1),
            },
          ],
          preview: {
            select: { header: 'header', values: 'values' },
            prepare({ header, values }: { header?: string; values?: string[] }) {
              return {
                title: header || 'Untitled Column',
                subtitle: `${values?.length || 0} rows`,
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(2).max(6)
        .error('Table must have 2-6 columns'),
    },
  ],
  preview: {
    select: {
      columns: 'columns',
      caption: 'caption',
    },
    prepare({ columns, caption }: {
      columns?: Array<{ header?: string; values?: string[] }>;
      caption?: string;
    }) {
      const colCount = columns?.length || 0;
      const rowCount = columns?.[0]?.values?.length || 0;
      const headers = columns?.map(c => c.header).join(' | ') || '';
      return {
        title: caption || 'Table',
        subtitle: `${colCount} columns × ${rowCount} rows: ${headers}`,
      };
    },
  },
},
```

---

### Step 2: Update ContentTable Component

**File:** `src/components/blog/ContentTable.tsx`

Update to transpose column-based data into rows:

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

interface TableColumn {
  _key: string;
  header: string;
  values: string[];
}

interface ContentTableProps {
  caption?: string;
  columns: TableColumn[];
}

/**
 * ContentTable Component
 *
 * Renders a table within blog/case study content.
 * Accepts column-based data and transposes to rows for display.
 * Uses accent color for headers, follows design system.
 */
export function ContentTable({ caption, columns }: ContentTableProps) {
  if (!columns?.length) return null;

  // Extract headers from columns
  const headers = columns.map(col => col.header);

  // Transpose columns to rows
  // columns[0].values[0], columns[1].values[0], ... = row 0
  // columns[0].values[1], columns[1].values[1], ... = row 1
  const rowCount = Math.max(...columns.map(col => col.values?.length || 0));
  const rows: string[][] = [];

  for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
    const row = columns.map(col => col.values?.[rowIndex] || '');
    rows.push(row);
  }

  if (rows.length === 0) return null;

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
            {rows.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                className="border-border"
              >
                {row.map((cell, cellIndex) => (
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

---

### Step 3: Update BlogContent.tsx Renderer

**File:** `src/components/blog/BlogContent.tsx`

Update the props passed to ContentTable:

```typescript
// Content Table - structured data display
contentTable: ({ value }: PTValueProps) => (
  <ContentTable
    caption={value.caption}
    columns={value.columns}
  />
),
```

---

### Step 4: Migration (Existing Content)

If any tables already exist with the old schema, they'll need manual re-entry. Since this is a new feature, likely no migration needed.

---

## Sanity Studio UX After Change

**Adding a table:**
1. Click "Add Table" in content
2. Add Column → Enter "Rating" as header → Add values: "+3", "+2", "+1", "0", "-1", "-2", "-3"
3. Add Column → Enter "Meaning" as header → Add values for each rating
4. Optional: Add caption

**Preview in Studio:**
```
Table
3 columns × 7 rows: Rating | Meaning | Notes
```

---

## Validation Consideration

The column-based approach doesn't enforce equal row counts across columns. Options:

1. **Allow ragged columns** - Missing values render as empty cells (current plan)
2. **Validate equal lengths** - Add custom validation to ensure all columns have same value count

Recommendation: Allow ragged columns for flexibility. Empty cells are handled gracefully.

---

## Files to Modify

| File | Change |
|------|--------|
| `sanity/schemas/blog.ts` | Replace contentTable schema |
| `src/components/blog/ContentTable.tsx` | Update props and add transpose logic |
| `src/components/blog/BlogContent.tsx` | Update renderer props |

---

## Estimated Scope

- **Files changed:** 3
- **Lines of code:** ~80 changed
- **Breaking change:** Yes (schema structure change)
- **Migration:** Manual re-entry if existing tables exist
