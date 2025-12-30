# Services Page: High-Fidelity Iteration Plan

**Date:** December 19, 2025
**Base Concept:** Concept 3 (Conversational)
**Status:** Concept 3b created, ready for implementation planning

---

## Decisions Made

| Question | Decision |
|----------|----------|
| Question labels | **Keep** - "Common question" labels stay |
| Card styling | **Flat with accent** - Left border using accent color, no rounded corners or elevation |
| Hero | **Keep as-is** for now |
| CTA section | **Remove** - Footer handles navigation (like About page) |
| Animation | **animate-in fade-in** - Same pattern as Homepage |
| Sanity CMS | **Yes** - Content will be CMS-driven |

---

## Concept 3b Created

**File:** `services-concept-3b-refined.html`

**Changes from Concept 3:**
- Flat cards with accent left-border (3px solid accent)
- Removed scroll hint arrow
- Removed "Recent examples" sections from all answers
- Removed CTA section entirely (footer handles it)
- Added atmospheric blur orbs (matches About page)
- animate-in fade-in on load (matches Homepage)

---

## Design System Integration

When moving to high-fidelity React, map to existing tokens:

### Colors
```
--background / --foreground          → Page background, text
--card / --card-foreground           → Answer cards
--accent / --accent-light            → Question text, card left-border
--muted-foreground                   → Question labels
```

### Typography
```
font-serif (Crimson Pro)             → Headlines, questions, answer titles
font-sans (DM Sans, weight 300)      → Body text, labels
```

### Transitions
```
.transition-smooth                   → Card hover states
.transition-colors-smooth            → Border color transitions
duration-normal (300ms)              → Standard interactions
```

### Spacing
```
Container: max-w-[700px] (narrow, focused reading)
Section padding: py-20 (80px)
Card padding: px-7 py-6 (28px x 24px)
Gap between exchanges: gap-12 (48px)
```

### Animation
```
animate-in fade-in duration-700      → Page load animation (matches Homepage)
```

---

## Implementation Approach

### Phase 1: Sanity Schema

Create CMS schema for services page content:

```typescript
// sanity/schemas/servicesPage.ts
{
  name: 'servicesPage',
  title: 'Services Page',
  type: 'document',
  fields: [
    { name: 'heroTitle', type: 'string', title: 'Hero Title' },
    { name: 'heroSubtitle', type: 'text', title: 'Hero Subtitle' },
    {
      name: 'dialogueExchanges',
      type: 'array',
      title: 'Service Q&A Exchanges',
      of: [{
        type: 'object',
        fields: [
          { name: 'question', type: 'text', title: 'Question' },
          { name: 'questionLabel', type: 'string', title: 'Label', initialValue: 'Common question' },
          { name: 'serviceTitle', type: 'string', title: 'Service Title' },
          { name: 'answerParagraphs', type: 'array', of: [{ type: 'text' }], title: 'Answer Paragraphs' }
        ]
      }]
    },
    { name: 'interludeText', type: 'string', title: 'Interlude Quote' },
    { name: 'seo', type: 'seo', title: 'SEO & Social' }
  ]
}
```

### Phase 2: React Components

```
/src/components/services/
├── ServicesPageClient.tsx     # Main client component
├── DialogueExchange.tsx       # Single Q&A exchange
├── ServicesHero.tsx           # Hero section
└── ServicesInterlude.tsx      # Interlude quote section
```

### Phase 3: Page Route

```
/src/app/(public)/services/page.tsx
```

- Server component fetches from Sanity
- Passes data to ServicesPageClient
- SEO metadata from Sanity
- Add to navigation (if desired)
- Footer already has Contact link

---

## Next Steps

1. **Review Concept 3b** in browser
2. **Approve direction** for implementation
3. **Create implementation plan** with specific tasks and file changes
