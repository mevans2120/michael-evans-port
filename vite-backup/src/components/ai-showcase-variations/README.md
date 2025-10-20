# AI Showcase Variations

This directory contains 4 distinct design concepts for showcasing AI projects on the homepage.

## Components

### AIShowcaseCarousel.tsx
**Style:** Premium horizontal slider with auto-advance
- Cyan/blue accent colors
- Navigation arrows + progress dots + thumbnail strip
- Auto-advance every 5 seconds
- Large single-project display
- Best for: Storytelling and guided experience

### AIShowcaseTerminal.tsx
**Style:** Technical terminal/code editor aesthetic
- Green terminal colors
- Typing animation and matrix background
- Expandable project details
- Monospace fonts throughout
- Best for: Developer audience and technical credibility

### AIShowcaseFeatured.tsx
**Style:** Asymmetric grid with hero project
- Indigo/purple accent colors
- 2x2 featured card + smaller tiles
- Click to switch featured project
- Dynamic transitions
- Best for: Highlighting best work with context

### AIShowcaseBento.tsx ⭐ RECOMMENDED
**Style:** Modern magazine/Pinterest layout
- Multi-color gradient accents
- Varied card sizes (masonry grid)
- Contemporary bento-box aesthetic
- All projects visible at once
- Best for: Visual interest and modern portfolios

## Usage

All components accept a single prop:

```tsx
interface Props {
  isDarkMode: boolean;
}
```

Example:
```tsx
import AIShowcaseBento from '@/components/ai-showcase-variations/AIShowcaseBento';

// In your component
<AIShowcaseBento isDarkMode={isDarkMode} />
```

## Integration

Add any variation to `/src/pages/HomeMinimal.tsx` after line 450 (after Capabilities section):

```tsx
// Add import at top
import AIShowcaseBento from '@/components/ai-showcase-variations/AIShowcaseBento';

// Add component after Capabilities section
<AIShowcaseBento isDarkMode={isDarkMode} />
```

## Test Page

View all variations at: http://localhost:8080/ai-showcase-design-test

## Documentation

See root directory for:
- `AI_SHOWCASE_DESIGN_VARIATIONS.md` - Full design documentation
- `QUICK_START_AI_SHOWCASE.md` - Quick integration guide
- `AI_SHOWCASE_SUMMARY.md` - Executive summary

## Features

All variations include:
- ✅ Dark mode support
- ✅ Framer Motion animations
- ✅ Fully responsive
- ✅ Status badges (Live/In Progress/Coming Soon)
- ✅ External link handling
- ✅ Accessibility features
- ✅ TypeScript types
- ✅ Tailwind CSS styling

## Project Data

All variations display these 6 AI projects:
1. This App (Live)
2. Karuna's Website (Live)
3. D&D Initiative Tracker (Live)
4. Voice Kitchen Timer (Live)
5. AI Research Agent (In Progress)
6. Department of Art (Coming Soon)

To update project data, edit the `aiProjects` array in each component.

## Recommendation

**Bento Layout** is recommended for most use cases because it:
- Shows all projects simultaneously
- Most visually distinct from case studies
- Contemporary and engaging design
- No navigation required
- Excellent mobile experience

**Terminal Style** is recommended if:
- Targeting primarily developer audience
- Want to emphasize technical/experimental nature
- Prefer unique, memorable aesthetic

---

**Created:** 2025-10-10
**Last Updated:** 2025-10-10
**Status:** Production ready
