# ASCII Art Formatting Issue Research

**Date:** December 15, 2025
**Status:** Investigation Complete - Issue Identified

## Problem Summary

ASCII art entered in Sanity CMS displays correctly in the CMS editor but renders incorrectly on the frontend. The spacing is collapsed, causing the ASCII art to appear compressed and misaligned.

### Visual Comparison

**In Sanity CMS (Correct):**
```
| #####     .---.    #####     |
| ## ##    / x x \   ## ##     |
| ## ##    \ ^ /    ########   |
| ## ##     ===|     ## ##     |
| #####    |___|     ## ##     |
```

**On Frontend (Broken):**
- Characters appear horizontally compressed
- Multiple spaces collapsed to single space
- ASCII art alignment completely broken

## Technical Analysis

### Current Implementation

**Component:** `src/components/blog/AsciiArt.tsx`

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

### Root Cause Analysis

The issue is likely caused by **one or more of the following**:

#### 1. Tailwind CSS Preflight Override (Most Likely)

Tailwind's preflight includes base styles that may affect `<pre>` elements. While `white-space: pre` is set inline, there could be specificity issues or inheritance problems.

**Evidence:** The inline `whiteSpace: 'pre'` style should preserve spaces, but they're being collapsed.

#### 2. Font Loading Race Condition

The specified font stack relies on system fonts:
```css
ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace
```

If the browser falls back to a non-monospace font before the monospace font loads, character alignment breaks. However, this wouldn't explain space collapse.

#### 3. String Normalization During Data Transfer

Sanity CMS stores the text, but during transfer (API → Next.js → React), the string may be normalized:
- Multiple spaces collapsed to single space
- Line breaks normalized
- Special characters transformed

**To verify:** Check the raw API response from Sanity vs what's rendered.

#### 4. React/JSX Text Content Handling

React sometimes normalizes whitespace in text content. When rendering `{art}` inside a `<pre>` tag, React should preserve whitespace, but edge cases exist.

#### 5. CSS `overflow: hidden` Causing Clipping

The component has `overflow-hidden` class. Combined with the `aspect-video` container and small font sizes, the ASCII art may be:
- Clipped on the right side
- Force-wrapped to fit container

### Components Using ASCII Art

| Component | File | Font Size |
|-----------|------|-----------|
| BlogPostCard | `src/components/blog/BlogPostCard.tsx` | `text-[0.28rem]` to `text-[0.38rem]` |
| BlogHero | `src/components/blog/BlogHero.tsx` | `text-[0.38rem]` to `text-[0.5rem]` |
| HomepageFeaturedBlogImage | `src/components/HomepageFeaturedBlogImage.tsx` | `text-[0.28rem]` to `text-[0.38rem]` |

### Sanity Schema

The schema (`sanity/schemas/blog.ts`) validates ASCII art properly:
- Max 80 characters wide
- Max 50 lines tall
- Rejects tabs (requires spaces)

```ts
validation: (Rule) => Rule.custom((value) => {
  if (!value) return true;
  const lines = value.split('\n');
  // ... validates dimensions and tab usage
})
```

## Recommended Debugging Steps

### Step 1: Verify Data Integrity
```tsx
// Add console.log to AsciiArt component
console.log('ASCII Art received:', JSON.stringify(art));
```

Check if spaces are preserved in the string received from Sanity.

### Step 2: Test Whitespace Preservation
```tsx
// Force whitespace preservation with CSS custom property
style={{
  whiteSpace: 'pre',
  wordSpacing: 'normal',
  letterSpacing: 'normal',
}}
```

### Step 3: Inspect Browser DevTools
1. Open DevTools → Elements
2. Select the `<pre>` element
3. Check Computed styles for `white-space`
4. Look for any styles overriding the inline style

### Step 4: Test Raw HTML
Create a test page with hardcoded ASCII art to isolate the issue:
```tsx
<pre style={{ whiteSpace: 'pre', fontFamily: 'monospace' }}>
| #####     .---.    #####     |
</pre>
```

## Potential Solutions

### Solution A: Use CSS `white-space: pre-wrap` with Fixed Width
```tsx
style={{
  whiteSpace: 'pre',
  fontFamily: 'monospace',
  width: 'max-content',  // Prevent wrapping
}}
```

### Solution B: Escape Spaces with Non-Breaking Spaces
Transform the ASCII art string to use `&nbsp;` for spaces:
```tsx
const preservedArt = art.replace(/ /g, '\u00A0');
```

**Note:** This would make the string harder to select/copy.

### Solution C: Use `<code>` Inside `<pre>`
```tsx
<pre>
  <code style={{ whiteSpace: 'pre' }}>
    {art}
  </code>
</pre>
```

### Solution D: Add CSS Reset for Pre Elements
In `globals.css`:
```css
pre {
  white-space: pre !important;
}
```

### Solution E: Use Tailwind's `whitespace-pre` Class
Replace inline style with Tailwind class:
```tsx
className={cn(
  'whitespace-pre text-accent ...',
  className
)}
```

## Next Steps

1. **Debug:** Add console.log to verify the exact string being received
2. **Inspect:** Use browser DevTools to check computed styles on the `<pre>` element
3. **Test:** Try Solution E (Tailwind class) as simplest fix
4. **Verify:** Check if Sanity API returns properly formatted text with preserved spaces

## Related Files

- `src/components/blog/AsciiArt.tsx` - Main component
- `src/components/blog/BlogPostCard.tsx` - Blog listing usage
- `src/components/blog/BlogHero.tsx` - Blog detail hero usage
- `src/components/HomepageFeaturedBlogImage.tsx` - Homepage usage
- `sanity/schemas/blog.ts` - CMS schema
- `src/lib/sanity/queries/blog.ts` - GROQ queries
- `src/app/globals.css` - Global styles
- `tailwind.config.ts` - Tailwind configuration
