import { describe, it, expect } from 'vitest';
import { cn } from '../utils';

describe('cn (className utility)', () => {
  it('merges class names', () => {
    expect(cn('text-red-500', 'bg-blue-500')).toBe('text-red-500 bg-blue-500');
  });

  it('handles conditional classes', () => {
    const isTrue = true;
    const isFalse = false;
    expect(cn('base', isTrue && 'conditional')).toContain('conditional');
    expect(cn('base', isFalse && 'conditional')).not.toContain('conditional');
  });

  it('handles Tailwind conflicts correctly', () => {
    // tailwind-merge should resolve conflicts
    const result = cn('px-2', 'px-4');
    expect(result).toBe('px-4'); // Later value wins
  });

  it('handles undefined and null', () => {
    expect(cn('base', undefined, null)).toBe('base');
  });

  it('handles arrays', () => {
    expect(cn(['text-sm', 'font-bold'])).toContain('text-sm');
    expect(cn(['text-sm', 'font-bold'])).toContain('font-bold');
  });

  it('handles objects with conditional values', () => {
    const result = cn({
      'text-red-500': true,
      'text-blue-500': false,
      'font-bold': true,
    });
    expect(result).toContain('text-red-500');
    expect(result).not.toContain('text-blue-500');
    expect(result).toContain('font-bold');
  });

  it('merges complex Tailwind class conflicts', () => {
    // Test that tailwind-merge properly handles complex conflicts
    const result = cn('p-4 px-8', 'py-2');
    // tailwind-merge should keep px-8 and py-2 (py-2 overrides the y part of p-4)
    // The exact output depends on tailwind-merge's algorithm
    expect(result).toContain('px-8');
    expect(result).toContain('py-2');
  });

  it('handles empty inputs', () => {
    expect(cn()).toBe('');
    expect(cn('')).toBe('');
  });

  it('handles mixed input types', () => {
    const result = cn(
      'base',
      ['text-sm', 'font-bold'],
      { 'text-red-500': true, 'hidden': false },
      undefined,
      null,
      'final'
    );
    expect(result).toContain('base');
    expect(result).toContain('text-sm');
    expect(result).toContain('font-bold');
    expect(result).toContain('text-red-500');
    expect(result).not.toContain('hidden');
    expect(result).toContain('final');
  });
});
