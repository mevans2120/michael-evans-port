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
