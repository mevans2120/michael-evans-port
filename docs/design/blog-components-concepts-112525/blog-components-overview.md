# Blog Components Design Concepts

**Date:** November 25, 2025
**Feature:** Tip & Example Prompt components for blog posts
**Context:** Components for "Research → Plan → Build ↔ Test" article

---

## Design Challenge

Create reusable components for blog posts that:
1. Highlight **tips/best practices** without disrupting reading flow
2. Showcase **example prompts** as actionable takeaways
3. Extend the existing design system (Tailwind, semantic tokens, Crimson Pro + DM Sans)
4. Work in both light and dark modes

---

## Deliverables

| File | Type | Description |
|------|------|-------------|
| `blog-components-mood-board.html` | Mood Board | Visual design exploration with color, typography, and concept previews |
| `tip-concept-1-subtle-card.tsx` | Component | Refined: Left-border callout with amber accent |
| `tip-concept-2-gradient-callout.tsx` | Component | Bold: Floating badge with gradient background |
| `tip-concept-3-terminal-note.tsx` | Component | Experimental: Terminal/CLI aesthetic |
| `example-prompt-concept-1-blockquote.tsx` | Component | Refined: Classic italic blockquote |
| `example-prompt-concept-2-chat-bubble.tsx` | Component | Bold: Chat UI with user avatar |
| `example-prompt-concept-3-command-line.tsx` | Component | Experimental: Terminal window with copy button |

---

## Tip Component Concepts

### Concept 1: Subtle Card (Refined)

**Approach:** Clean, minimal card with soft background tint and left border accent.

```tsx
<TipSubtleCard>
  Always save the research and planning docs as .md files.
</TipSubtleCard>
```

**Strengths:**
- Unobtrusive, doesn't break reading flow
- Familiar pattern (Stripe, Vercel docs)
- Supports variants: default (amber), pro (emerald), warning (rose)

**Tradeoffs:**
- May be too subtle for critical tips
- Limited visual differentiation

**Best for:** Long-form articles where tips should complement, not interrupt.

---

### Concept 2: Gradient Callout (Bold)

**Approach:** Eye-catching gradient border with floating badge label using brand purple.

```tsx
<TipGradientCallout variant="pro">
  Always save the research and planning docs as .md files.
</TipGradientCallout>
```

**Strengths:**
- Highly visible, great for key takeaways
- Uses brand colors, feels integrated
- Floating badge creates visual hierarchy

**Tradeoffs:**
- More visually heavy, use sparingly
- Requires more vertical space

**Best for:** Highlighting 1-2 crucial tips per article.

---

### Concept 3: Terminal Note (Experimental)

**Approach:** Developer-focused aesthetic with terminal window chrome and monospace typography.

```tsx
<TipTerminalNote command="tip --save">
  Always save the research and planning docs as .md files.
</TipTerminalNote>
```

**Strengths:**
- Distinctive, memorable design
- Perfect for developer/technical audience
- Command syntax reinforces technical context

**Tradeoffs:**
- May feel out of place in non-technical content
- Monospace harder to read for longer text

**Best for:** Technical tutorials, developer-focused content.

---

## Example Prompt Component Concepts

### Concept 1: Blockquote Style (Refined)

**Approach:** Classic blockquote with italic serif text and subtle left border.

```tsx
<ExamplePromptBlockquote>
  Can you create a phased approach for implementing this web app monorepo?
</ExamplePromptBlockquote>
```

**Strengths:**
- Familiar pattern, easy to understand
- Works well in long-form content
- Elegant, editorial feel with Crimson Pro

**Tradeoffs:**
- May not stand out enough as "actionable"
- Italic can be harder to read at length

**Best for:** Articles with a more editorial/narrative tone.

---

### Concept 2: Chat Bubble (Bold)

**Approach:** Conversational UI with user avatar, mimicking chat interfaces.

```tsx
<ExamplePromptChatBubble>
  Can you create a phased approach for implementing this web app monorepo?
</ExamplePromptChatBubble>
```

**Strengths:**
- Immediately recognizable as "user input"
- Feels modern and contextual for AI content
- Gradient avatar reinforces brand

**Tradeoffs:**
- Takes more vertical space
- Avatar may feel redundant if used frequently

**Best for:** AI-focused content where conversational context matters.

---

### Concept 3: Command Line (Experimental)

**Approach:** Terminal window with syntax highlighting feel and copy functionality.

```tsx
<ExamplePromptCommandLine>
  Can you create a phased approach for implementing this web app monorepo?
</ExamplePromptCommandLine>
```

**Strengths:**
- Memorable, distinctive design
- Copy button adds utility
- Clear visual hierarchy

**Tradeoffs:**
- Heavier visual weight
- Monospace may be less readable for long prompts

**Best for:** Technical tutorials where prompts should be easily copied.

---

## Recommendation

For the "Research → Plan → Build ↔ Test" article, I recommend:

| Component | Recommended Concept | Rationale |
|-----------|---------------------|-----------|
| **Tip** | Concept 1 (Subtle Card) | Article has multiple tips; subtle treatment won't overwhelm |
| **Example Prompt** | Concept 2 (Chat Bubble) | Article is about AI agent workflows; chat UI reinforces context |

**Alternative pairing:** If targeting a more technical developer audience, consider **Concept 3 (Terminal)** for both components to create a cohesive CLI aesthetic.

---

## Next Steps

- [ ] Review concepts with stakeholder
- [ ] Select preferred direction for each component
- [ ] Refine chosen concepts based on feedback
- [ ] Move to production design / implementation

---

## Design System Extensions

If these components are approved, add to `globals.css`:

```css
/* Blog Component Tokens (proposed) */
--tip-bg-amber: 47 95% 55%;
--tip-bg-emerald: 142 70% 45%;
--tip-bg-rose: 0 84% 60%;
--prompt-bg-terminal: 215 28% 6%;
```

And consider adding utility classes:

```css
.blog-tip { /* base tip styles */ }
.blog-prompt { /* base prompt styles */ }
```
