# Chat Prompts CMS Migration Plan

**Created:** November 2, 2025
**Status:** In Progress

## Overview

Move hardcoded chat suggested prompts to Sanity CMS for easier content management while maintaining performance and following design system guidelines.

## Current System Analysis

### Initial Suggested Prompts (Hardcoded)
**Location:** `/src/components/navigation/SuggestedPrompts.tsx`

**How it works:**
- Hardcoded array of 4 prompts in component
- Uses `useMemo` to randomly select 2 prompts on mount
- Displayed when chat first opens (before any user interaction)
- Current prompts:
  - "Tell me about the first responsive airline website"
  - "What's the story behind launching a restaurant with cliff diving?"
  - "Show me production AI applications you've built"
  - "How did you help thousands of people focus?"

### Follow-up Questions (AI-Generated) ✅
**Location:** `/src/components/navigation/ChatSection.tsx` + `/src/app/api/chat/route.ts`

**How it works:**
- AI generates follow-up questions in its responses
- System prompt instructs AI to suggest EXACTLY 2 follow-up questions after EVERY response
- Format: `**Follow-up questions:**\n- Question text`
- Frontend parses using regex and renders as clickable buttons
- **STATUS:** Already working perfectly - no changes needed

## Implementation Strategy

### Phase 1: Current Implementation (Client-Side Fetch)

**Approach:** Fetch prompts client-side with fallback to hardcoded values

**Why this approach:**
- ChatSection is already a client component (requires `useState`, `useChat`, etc.)
- Data is tiny (~500 bytes)
- Simple, maintainable, self-contained
- No complex prop drilling through navigation hierarchy
- Fallback ensures site works even if CMS unavailable

**Performance Impact:**
- Minimal: <50ms fetch, cacheable
- Not part of LCP (chat collapsed initially)
- Negligible Lighthouse impact for now

### Phase 2: Future Optimization (When Optimizing Lighthouse)

**Option 1: Lazy Load ChatSection**
```tsx
const ChatSection = dynamic(() => import('./ChatSection'), {
  ssr: false,
  loading: () => <Sparkles />
});
```
- Only load when user expands navigation
- Reduces initial bundle size
- **Biggest Lighthouse impact**

**Option 2: Static Generation**
```tsx
// Build-time fetch, embed in bundle
// No runtime network request
export async function getStaticChatPrompts() {
  return await client.fetch(chatPromptsQuery);
}
```
- Zero runtime network requests
- Smaller Lighthouse impact than lazy loading

**Option 3: Hybrid (Recommended for Lighthouse)**
- Static generation of prompts (no runtime fetch)
- Lazy load entire ChatSection component
- **Best Lighthouse score improvement**

## Technical Implementation

### Files Created

**1. Sanity Schema**
`/sanity/schemas/chatPrompts.ts`
- Array of prompt objects (text, order, active)
- Number of prompts to show (default: 2)
- Validation: 2-10 prompts, max 150 chars each
- Preview shows active status and order

**2. Query**
`/src/lib/sanity/queries.ts`
```typescript
export const chatPromptsQuery = `*[_type == "chatPrompts"][0] {
  prompts[active == true] | order(order asc) {
    text,
    order,
    active
  },
  numberOfPromptsToShow
}`
```

### Files Modified

**3. Schema Registration**
`/sanity/schemas/index.ts`
- Import chatPrompts schema
- Add to schemaTypes array

**4. SuggestedPrompts Component**
`/src/components/navigation/SuggestedPrompts.tsx`
- Add optional `prompts` and `numberOfPromptsToShow` props
- Accept CMS data or fallback to hardcoded
- Maintain existing randomization logic

**5. ChatSection Component**
`/src/components/navigation/ChatSection.tsx`
- Import Sanity client and query
- Fetch chat prompts on mount (useEffect)
- Pass data to SuggestedPrompts component
- Handle loading/error states gracefully

## Design System Compliance

✅ **Following all design system guidelines:**

1. **Semantic Color Tokens:**
   - Already using `text-chat-foreground/60`, `text-chat-foreground/80`
   - Background: `bg-chat-suggestion`, `bg-chat-suggestion-hover`
   - Border: `border-chat-input-border`, `hover:border-accent/50`
   - No hardcoded colors

2. **Transitions:**
   - Using `transition-colors duration-200` (standard)
   - Follows existing animation patterns

3. **Typography:**
   - Text sizes: `text-sm` (design system standard)
   - Font family: Inherits from parent (DM Sans/Newsreader)

4. **Spacing:**
   - Padding: `px-4 py-3` (consistent with chat design)
   - Gaps: `gap-2` (standard spacing scale)

5. **Disabled States:**
   - `disabled:opacity-50` (design system standard)
   - `disabled:cursor-not-allowed` (accessibility)

6. **No Inline Styles:**
   - All styling via Tailwind utilities
   - No `style={{}}` attributes

## Data Flow

```
Sanity Studio (chatPrompts document)
  ↓
Build Time: Available in Sanity dataset
  ↓
Runtime: ChatSection.tsx (client-side fetch with useEffect)
  ↓
Pass to: SuggestedPrompts component as props
  ↓
Random Selection: useMemo selects N prompts
  ↓
Render: Display as clickable buttons
```

## Fallback Strategy

**Graceful Degradation:**
1. Attempt CMS fetch
2. If fetch fails or returns empty: Use hardcoded fallback
3. If CMS unavailable: Site continues working normally
4. No error messages shown to user

## Benefits

1. **Content Control:** Update prompts without code deployment
2. **Experimentation:** A/B test different prompts easily
3. **Seasonal Updates:** Highlight different projects over time
4. **Easy Activation:** Toggle prompts on/off without deleting
5. **Prioritization:** Control which prompts appear via order field
6. **Scalability:** Add more prompts without touching code
7. **Professional:** Matches CMS-driven architecture (homepageHero pattern)

## Initial Data Seed

```json
{
  "_type": "chatPrompts",
  "prompts": [
    {
      "text": "Tell me about the first responsive airline website",
      "order": 1,
      "active": true
    },
    {
      "text": "What's the story behind launching a restaurant with cliff diving?",
      "order": 2,
      "active": true
    },
    {
      "text": "Show me production AI applications you've built",
      "order": 3,
      "active": true
    },
    {
      "text": "How did you help thousands of people focus?",
      "order": 4,
      "active": true
    }
  ],
  "numberOfPromptsToShow": 2
}
```

## Testing Checklist

- [ ] Create chatPrompts document in Sanity Studio
- [ ] Add initial 4 prompts
- [ ] Verify prompts appear in chat when opened
- [ ] Test toggling active/inactive in Sanity
- [ ] Test changing order field
- [ ] Test changing numberOfPromptsToShow (1-5)
- [ ] Verify randomization (different prompts on refresh)
- [ ] Test fallback when CMS unavailable
- [ ] Test loading states don't cause UI flicker
- [ ] Verify no console errors
- [ ] Test in light and dark modes
- [ ] Verify design system compliance (no inline styles, semantic tokens)

## Performance Considerations

**Current Impact (Phase 1):**
- Network request: ~50ms (Sanity CDN)
- Data size: ~500 bytes
- Lighthouse impact: Minimal (not LCP, async fetch)

**Future Optimization (Phase 2):**
- Lazy load ChatSection: -20-30 KB initial bundle
- Static generation: Eliminate runtime fetch
- React Query caching: Reduce repeat fetches

## Migration Steps

1. ✅ Create chatPrompts schema
2. ⏳ Register schema in index.ts
3. ⏳ Add query to queries.ts
4. ⏳ Update SuggestedPrompts component
5. ⏳ Update ChatSection with fetch logic
6. ⏳ Seed initial data in Sanity Studio
7. ⏳ Test all scenarios
8. ⏳ Deploy and verify in production

## Future Enhancements

**Potential additions (not in current scope):**

1. **Categories:** Group prompts by topic (projects, skills, experience)
2. **Analytics:** Track which prompts get clicked most
3. **Personalization:** Show different prompts based on page context
4. **A/B Testing:** Randomly assign users to prompt variants
5. **Scheduling:** Show different prompts based on time/date

## Notes

- Follow-up questions remain AI-generated (no changes needed)
- Backward compatible with hardcoded fallback
- Singleton document pattern (like homepageHero)
- No webhook needed (client-side fetch or cache strategy)
- Design system compliant (semantic tokens, no inline styles)
