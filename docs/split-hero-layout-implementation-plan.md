# Split Hero Layout Implementation Plan

**Date:** November 13, 2025
**Design Reference:** `/docs/design/cs-hero-concepts-111325/concept-2-split-layout-dark.html`
**Target Component:** `/src/components/case-study-editorial/EditorialHero.tsx`

## Overview

Replace the current subtle background image approach with a split layout featuring:
- Left side: Content (badge, title, subtitle, overview metadata)
- Right side: Featured image in a rounded card container
- Responsive: Image on top for mobile, side-by-side on desktop

## Design System Compliance

### CSS & Styling Requirements

**MUST follow these rules from `CLAUDE.md`:**

1. **Use Tailwind CSS exclusively** - No inline styles except for dynamic calculations
2. **Use semantic color tokens** - `text-accent`, `text-foreground`, `text-muted-foreground`, `border-border`, etc.
3. **Include dark mode variants** - All colors must have `dark:` variants where applicable
4. **Use semantic transition durations** - `transition-smooth`, `duration-fast`, etc. from `globals.css`
5. **Use utility classes** - Leverage `.card-base`, `.card-interactive` if applicable
6. **Follow mobile-first** - Start with mobile styles, add `md:` and `lg:` breakpoints
7. **Respect motion preferences** - Already handled by CSS system

### Key Design Tokens to Use

```tsx
// Colors (auto-handle dark mode)
text-accent              // Badge
text-foreground          // Title, metadata values
text-muted-foreground    // Subtitle, metadata labels
border-border            // Image card border
bg-background            // Default background

// Transitions
transition-smooth        // 300ms, ease-smooth
duration-fast           // 150ms

// Layout utilities
rounded-2xl             // Image container
shadow-2xl              // Image depth
ring-1 ring-border/50   // Subtle image border
```

## Implementation Steps

### Phase 1: Update Component Structure

**File:** `/src/components/case-study-editorial/EditorialHero.tsx`

#### 1.1 Replace Header Layout

**From:**
```tsx
<header className="relative overflow-hidden min-h-[70vh] flex items-center">
  {/* Background image with gradient overlay */}
</header>
```

**To:**
```tsx
<header className="min-h-[80vh] flex items-center">
  <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 w-full">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
      {/* Left: Content */}
      {/* Right: Image */}
    </div>
  </div>
</header>
```

#### 1.2 Update Content Section (Left Side)

```tsx
{/* Left: Content */}
<div className="order-2 lg:order-1">
  {badge && (
    <div className="font-sans text-xs uppercase tracking-[2px] text-accent dark:text-accent font-semibold mb-6">
      {badge}
    </div>
  )}

  <h1 className="text-[48px] md:text-[60px] lg:text-[72px] font-bold text-foreground dark:text-foreground leading-[1.05] mb-6">
    {title}
  </h1>

  {subtitle && (
    <p className="text-[20px] md:text-[24px] text-muted-foreground leading-[1.4] mb-10">
      {subtitle}
    </p>
  )}

  {overview && (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-8 border-t border-border dark:border-border">
      {/* Overview items - same as current */}
    </div>
  )}
</div>
```

#### 1.3 Add Image Section (Right Side)

```tsx
{/* Right: Image */}
{imageUrl && (
  <div className="order-1 lg:order-2">
    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-border/50">
      <img
        src={imageUrl}
        alt={backgroundImage?.alt || ""}
        className="w-full h-full object-cover"
      />
      {/* Subtle gradient overlay for depth in dark mode */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-background/10" />
    </div>
  </div>
)}
```

### Phase 2: Update TypeScript Interface

**No changes needed** - The existing `EditorialHeroProps` interface already supports all required data.

### Phase 3: Responsive Behavior

**Mobile (< 1024px):**
- Single column layout
- Content appears first (`order-2 lg:order-1`)
  - Badge, title, subtitle at top
- Image appears second (`order-1 lg:order-2`)
  - Between hero text and body content
- Smaller text sizes

**Desktop (≥ 1024px):**
- Two-column grid layout
- Content on left (`lg:order-1`)
- Image on right (`lg:order-2`)
- Larger text sizes

**Note:** The order classes create this flow:
- Mobile: Content → Image → Overview → Body
- Desktop: Content (with Overview) | Image

### Phase 4: Dark Mode Support

**Already handled via semantic tokens:**
- `text-accent` → Auto-adjusts for dark mode
- `text-foreground` → Auto-adjusts
- `text-muted-foreground` → Auto-adjusts
- `border-border` → Auto-adjusts
- `bg-background` → Auto-adjusts

**Additional dark mode gradient:**
```tsx
to-background/10  // Subtle overlay in dark mode
```

## Files to Modify

1. **`/src/components/case-study-editorial/EditorialHero.tsx`**
   - Update component structure
   - Replace background image approach with split layout
   - Keep existing props and interface unchanged

## Files to Keep Unchanged

1. **`/src/app/(public)/case-studies/[slug]/page.tsx`**
   - No changes needed - already passes correct props
   - Query already fetches `featuredImage` correctly

2. **`/sanity/schemas/project.ts`**
   - No schema changes needed

## Testing Checklist

- [ ] Image displays in rounded card on right side (desktop)
- [ ] Image displays on top (mobile)
- [ ] All text remains readable
- [ ] Dark mode colors apply correctly
- [ ] Responsive breakpoints work (mobile → desktop)
- [ ] Image respects aspect ratio (4:3)
- [ ] Shadow and border ring visible
- [ ] Overview grid wraps correctly on mobile
- [ ] No TypeScript errors
- [ ] Build succeeds (`npm run build`)

## Design System Compliance Checklist

- [ ] Uses only Tailwind CSS (no inline styles)
- [ ] Uses semantic color tokens
- [ ] Includes dark mode variants where needed
- [ ] Uses semantic transitions if applicable
- [ ] Follows mobile-first responsive approach
- [ ] No hardcoded colors or magic numbers
- [ ] Uses existing utility classes where applicable

## Rollback Plan

If issues arise, revert to previous commit:
```bash
git checkout HEAD~1 -- src/components/case-study-editorial/EditorialHero.tsx
```

## Notes

- The split layout provides better visual hierarchy
- Image is more prominent but doesn't interfere with text readability
- Maintains editorial/magazine aesthetic
- Works with existing Sanity data structure
- No migration scripts needed
