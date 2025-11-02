# Code Review Checklist

Use this checklist when reviewing Pull Requests to ensure code quality, consistency, and compliance with project standards.

---

## Style Compliance (Tailwind Design System)

**CRITICAL:** Verify compliance with centralized design system before merging.

### Colors & Tokens

- [ ] No inline `style` attributes with color values (except documented exceptions)
- [ ] No hardcoded hex colors (`#8B5CF6`, `#a0a0a0`, etc.)
- [ ] No hardcoded rgba values (`rgba(199, 128, 245, 0.1)`, etc.)
- [ ] No hardcoded hsl values (`hsl(280, 100%, 80%)`, etc.)
- [ ] All colors use semantic tokens from design system
  - `bg-accent`, `text-foreground`, `border-border`, `text-muted-foreground`, etc.
- [ ] Dark mode variants included on colored elements (or semantic tokens used that auto-adapt)

### Sizing & Spacing

- [ ] No inline styles for sizing (`style={{ width: '320px' }}`)
- [ ] Arbitrary Tailwind values used instead (`w-[320px]`, `text-[1.25rem]`)
- [ ] No inline font sizing (`style={{ fontSize: '3.5rem' }}`)
- [ ] No inline letter spacing (`style={{ letterSpacing: '0.15em' }}` → `tracking-[0.15em]`)

### Transitions & Animations

- [ ] No magic transition numbers (`duration-300` → use `duration-normal`)
- [ ] Semantic durations used:
  - `duration-fast` (150ms)
  - `duration-normal` (300ms)
  - `duration-slow` (400ms)
  - `duration-slower` (600ms)
- [ ] Semantic easings used: `ease-smooth`
- [ ] Utility classes used where applicable:
  - `.transition-smooth`, `.transition-fast`, `.transition-colors-smooth`
  - `.interactive-scale`, `.interactive-opacity`

### Utility Classes

- [ ] Common patterns use predefined utilities:
  - `.card-base`, `.card-interactive`, `.card-elevated`
  - `.flex-center`, `.flex-between`, `.absolute-center`
  - `.gradient-hero-title`, `.gradient-hero-badge`
  - `.metric-card`, `.meta-info-item`
  - `.focus-outline`

### Inline Style Exceptions

If inline styles are present, verify they're acceptable per `/docs/styling-exceptions.md`:

- [ ] Dynamic calculations (e.g., `style={{ width: `${percentage}%` }}`)
- [ ] Complex gradients (document with comment if not creating utility)
- [ ] Grid templates (`gridTemplateColumns: 'repeat(auto-fit, minmax(...))'`)
- [ ] All exceptions have TSDoc comments explaining why

```tsx
// Example of properly documented exception:
{/* Inline style required: Dynamic calculation based on scroll position */}
<div style={{ opacity: scrollProgress }}>
```

---

## TypeScript

- [ ] No `any` types (use `unknown` or proper types)
- [ ] Proper type definitions for component props
- [ ] No TypeScript errors in build (`npm run build`)
- [ ] Interfaces/types properly exported if reused

---

## React Best Practices

- [ ] Functional components used (not class components)
- [ ] Proper use of hooks (no hooks in conditionals/loops)
- [ ] Keys provided for list items
- [ ] Proper event handler naming (`handleClick`, not `onClick`)
- [ ] No unnecessary re-renders (proper memoization if needed)

---

## Accessibility

- [ ] Semantic HTML elements used (`button`, `nav`, `main`, etc.)
- [ ] Keyboard navigation works (tab order, focus states)
- [ ] Focus states visible (`.focus-outline` or equivalent)
- [ ] ARIA labels where necessary
- [ ] Color contrast meets WCAG standards (handled by semantic tokens)

---

## Performance

- [ ] No unnecessary dependencies imported
- [ ] Images optimized (using Next.js Image component where applicable)
- [ ] No blocking operations in render
- [ ] Proper use of `use client` directive (only when needed)

---

## Testing

- [ ] Builds successfully (`npm run build`)
- [ ] No console errors or warnings
- [ ] Existing tests still pass
- [ ] New features have test coverage (or planned)

---

## Documentation

- [ ] Complex logic has comments explaining "why"
- [ ] TSDoc comments on exported functions/components
- [ ] CLAUDE.md updated if architectural changes made
- [ ] README updated if user-facing changes made

---

## Git Commit Quality

- [ ] Commit message follows conventional format
- [ ] Related changes committed together (atomic commits)
- [ ] No unrelated files in commit
- [ ] Build artifacts not committed
- [ ] `.env` files not committed

---

## Design System Resources

- **Audit Report:** `/docs/tailwind-style-compliance-audit-2025-11-02.md`
- **Exception Policy:** `/docs/styling-exceptions.md`
- **Quick Reference:** `/docs/css-quick-reference.md`
- **Animation System:** `/docs/animation-system.md`
- **Component Patterns:** `/docs/component-styling-patterns.md`

---

## Common Violations to Watch For

### ❌ Violation: Hardcoded color

```tsx
<div style={{ background: 'rgba(199, 128, 245, 0.1)' }}>
```

### ✅ Correct: Semantic token

```tsx
<div className="bg-accent/10">
```

---

### ❌ Violation: Inline sizing

```tsx
<div style={{ fontSize: '1.5rem', lineHeight: '1.3' }}>
```

### ✅ Correct: Tailwind arbitrary values

```tsx
<div className="text-[1.5rem] leading-[1.3]">
```

---

### ❌ Violation: Magic transition number

```tsx
<div className="transition-all duration-300">
```

### ✅ Correct: Semantic duration

```tsx
<div className="transition-smooth">
```

---

### ❌ Violation: Tailwind color without dark mode

```tsx
<div className="text-purple-400">
```

### ✅ Correct: With dark mode variant or semantic token

```tsx
// Option 1: Dark mode variant
<div className="text-purple-400 dark:text-purple-300">

// Option 2: Semantic token (better - auto-adapts)
<div className="text-accent">
```

---

## Reviewer Notes

When leaving review comments:

1. **Be specific:** Link to the line number and exact issue
2. **Provide fix:** Show the correct way to do it
3. **Link docs:** Reference `/docs/styling-exceptions.md` or other relevant docs
4. **Be kind:** Assume positive intent, focus on code not person

Example review comment:

> Line 42: Hardcoded color value detected
>
> ```tsx
> // Current (non-compliant)
> <div style={{ color: '#a0a0a0' }}>
>
> // Suggested fix
> <div className="text-muted-foreground">
> ```
>
> This uses a semantic token that automatically adapts to dark mode. See `/docs/styling-exceptions.md` for when inline styles are acceptable.

---

## Quick Decision Tree

**Q: Should I approve this PR?**

```
Does it have hardcoded colors?
  └─ YES → Request changes
  └─ NO → Continue

Does it have inline styles?
  └─ YES → Are they documented exceptions?
     └─ YES → Continue
     └─ NO → Request changes
  └─ NO → Continue

Does build pass?
  └─ YES → Continue
  └─ NO → Request changes

Does it follow project patterns?
  └─ YES → Approve! ✅
  └─ NO → Request changes
```

---

## For Reviewers: When in Doubt

Ask yourself:

1. **Will this work in dark mode?** (If using colors)
2. **Will this adapt to time-based theme?** (If using accent colors)
3. **Can this be found with search?** (Tailwind classes > inline styles)
4. **Is this maintainable?** (Consistent with rest of codebase)
5. **Would a new developer understand this?** (Clear, documented)

If the answer to any is "no" or "maybe," request clarification or changes.

---

*Last Updated: November 2, 2025*
*Compliance Standard: 100% (Phases 1-3 complete)*
