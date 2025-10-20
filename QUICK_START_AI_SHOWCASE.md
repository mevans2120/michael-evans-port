# Quick Start: AI Showcase Integration

## View the Designs

```bash
npm run dev
```

Navigate to: **http://localhost:8080/ai-showcase-design-test**

## Choose Your Design

### Option 1: Bento Layout (Recommended)
Modern magazine-style with colorful gradients and varied card sizes.
```tsx
import AIShowcaseBento from '@/components/ai-showcase-variations/AIShowcaseBento';
```

### Option 2: Carousel
Horizontal scrolling with auto-advance and navigation controls.
```tsx
import AIShowcaseCarousel from '@/components/ai-showcase-variations/AIShowcaseCarousel';
```

### Option 3: Terminal
Tech-forward terminal/code editor aesthetic.
```tsx
import AIShowcaseTerminal from '@/components/ai-showcase-variations/AIShowcaseTerminal';
```

### Option 4: Featured Grid
Asymmetric layout with one large featured project.
```tsx
import AIShowcaseFeatured from '@/components/ai-showcase-variations/AIShowcaseFeatured';
```

## Integration (3 Simple Steps)

### 1. Open HomeMinimal.tsx
```bash
/src/pages/HomeMinimal.tsx
```

### 2. Add Import (top of file, around line 6)
```tsx
import AIShowcaseBento from '@/components/ai-showcase-variations/AIShowcaseBento';
// Or whichever variation you chose
```

### 3. Add Component (after Capabilities section, around line 450)
```tsx
      </section>

      {/* Optional Separator */}
      <Separator className={`mx-auto max-w-6xl ${isDarkMode ? 'bg-gray-800' : ''}`} />

      {/* AI Showcase Section */}
      <AIShowcaseBento isDarkMode={isDarkMode} />

      {/* Visual Grid Overlay Modal */}
      <AnimatePresence>
```

## That's it!

Your AI Showcase is now live on the homepage.

## File Locations

**Components:**
- `/src/components/ai-showcase-variations/AIShowcaseCarousel.tsx`
- `/src/components/ai-showcase-variations/AIShowcaseTerminal.tsx`
- `/src/components/ai-showcase-variations/AIShowcaseFeatured.tsx`
- `/src/components/ai-showcase-variations/AIShowcaseBento.tsx`

**Test Page:**
- `/src/pages/AIShowcaseDesignTest.tsx`

**Routes:**
- Test page route already added to `/src/App.tsx` (line 48)

## Need Help?

See full documentation: `AI_SHOWCASE_DESIGN_VARIATIONS.md`
