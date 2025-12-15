# ASCII Art Component Tailwind Refactor Plan

**Date:** December 15, 2025
**Status:** Ready for Implementation
**Related Issue:** ASCII art formatting broken on frontend

## Objective

Refactor the `AsciiArt` component to replace inline CSS with proper Tailwind classes, aligning with the project's design system guidelines and potentially fixing the whitespace collapse bug.

## Current State (Violation)

**File:** `src/components/blog/AsciiArt.tsx`

```tsx
<pre
  className={cn(
    'text-accent text-[0.4rem] sm:text-[0.5rem] md:text-[0.6rem] select-none overflow-hidden',
    className
  )}
  style={{
    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
    whiteSpace: 'pre',
    lineHeight: 1.15,
  }}
  aria-label={label || 'ASCII art illustration'}
  role="img"
>
  {art}
</pre>
```

**Problems:**
1. Uses inline `style={{}}` which violates CLAUDE.md guidelines
2. Inline styles may have specificity issues causing the whitespace bug
3. Not using the design system's font stack

## Target State

```tsx
<pre
  className={cn(
    'font-mono whitespace-pre leading-[1.15]',
    'text-accent text-[0.4rem] sm:text-[0.5rem] md:text-[0.6rem]',
    'select-none overflow-hidden',
    className
  )}
  aria-label={label || 'ASCII art illustration'}
  role="img"
>
  {art}
</pre>
```

## CSS to Tailwind Mapping

| Inline CSS | Tailwind Class | Notes |
|------------|----------------|-------|
| `fontFamily: 'ui-monospace, ...'` | `font-mono` | Uses Tailwind's default monospace stack |
| `whiteSpace: 'pre'` | `whitespace-pre` | Preserves whitespace and line breaks |
| `lineHeight: 1.15` | `leading-[1.15]` | Arbitrary value for tight line height |

## Implementation Steps

### Step 1: Verify Tailwind's Monospace Font Stack

Check `tailwind.config.ts` to see if `font-mono` is configured. If not using defaults, may need to verify the font stack is appropriate for ASCII art.

**Default Tailwind `font-mono`:**
```
ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace
```

This is nearly identical to our current inline style, so `font-mono` should work.

### Step 2: Update AsciiArt Component

Replace inline styles with Tailwind classes in `src/components/blog/AsciiArt.tsx`.

**Before:**
```tsx
style={{
  fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
  whiteSpace: 'pre',
  lineHeight: 1.15,
}}
```

**After:**
```tsx
// No style prop needed - all handled by className
className={cn(
  'font-mono whitespace-pre leading-[1.15]',
  'text-accent text-[0.4rem] sm:text-[0.5rem] md:text-[0.6rem]',
  'select-none overflow-hidden',
  className
)}
```

### Step 3: Remove 'use client' If Unnecessary

After removing inline styles, check if the component still needs to be a client component. If it only renders static content, it can be a server component.

**Current:** `'use client';` at top of file
**Check:** Does the component use any hooks or browser APIs? If not, remove the directive.

### Step 4: Test All Usage Locations

Verify ASCII art renders correctly in all three locations:

1. **Blog listing page** (`/blog`)
   - Component: `BlogPostCard.tsx`
   - Font size: `text-[0.28rem]` to `text-[0.38rem]`

2. **Blog detail hero** (`/blog/[slug]`)
   - Component: `BlogHero.tsx`
   - Font size: `text-[0.38rem]` to `text-[0.5rem]`

3. **Homepage featured blog** (`/`)
   - Component: `HomepageFeaturedBlogImage.tsx`
   - Font size: `text-[0.28rem]` to `text-[0.38rem]`

### Step 5: Visual Verification

For each location, verify:
- [ ] Multiple consecutive spaces are preserved
- [ ] Line breaks are preserved
- [ ] Characters align vertically (monospace working)
- [ ] ASCII art fits within container without clipping
- [ ] Responsive sizing works (mobile → tablet → desktop)

## Files to Modify

| File | Change |
|------|--------|
| `src/components/blog/AsciiArt.tsx` | Replace inline styles with Tailwind classes |

## Files to Test (No Changes)

| File | Test |
|------|------|
| `src/components/blog/BlogPostCard.tsx` | Verify ASCII art displays correctly |
| `src/components/blog/BlogHero.tsx` | Verify ASCII art displays correctly |
| `src/components/HomepageFeaturedBlogImage.tsx` | Verify ASCII art displays correctly |

## Rollback Plan

If the refactor doesn't fix the issue or introduces regressions:

1. Revert `AsciiArt.tsx` to previous version
2. Investigate alternative solutions from the research document
3. Consider adding explicit CSS rules in `globals.css` if Tailwind classes don't work

## Success Criteria

1. ✅ No inline `style={{}}` prop in AsciiArt component
2. ✅ ASCII art whitespace is preserved (spaces not collapsed)
3. ✅ ASCII art renders correctly in all three usage locations
4. ✅ Component follows project design system guidelines
5. ✅ No visual regressions in light/dark mode

## Estimated Scope

- **Files changed:** 1
- **Lines changed:** ~5-10
- **Risk:** Low (isolated component change)
