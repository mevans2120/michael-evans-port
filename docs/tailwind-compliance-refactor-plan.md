# Tailwind Style Compliance Refactor - Implementation Plan
**Michael Evans Portfolio** | November 2, 2025

---

## Overview

This plan outlines a phased approach to achieving 100% compliance with the centralized Tailwind design system. Currently at **89.5% compliance**, we'll reach **100%** through 3 focused phases over approximately 45-60 minutes of work.

**Current State:**
- 6 non-compliant files (all in case study detail components)
- 18 inline style violations
- 8 hardcoded color values

**Target State:**
- 100% compliance with tokenized design system
- Zero inline styles (except documented exceptions)
- All colors using semantic tokens
- Reusable utility classes for common patterns

---

## Phase 1: Quick Wins (15-20 minutes)

**Goal:** Fix the easiest violations for immediate compliance improvement (89.5% → 96%)

**Impact:** High visibility, low effort, immediate results

### 1.1 CaseStudySectionHeader.tsx (3 minutes)

**File:** `/src/components/case-studies/detail/CaseStudySectionHeader.tsx`

**Changes:**

```tsx
// Line 28-30: Section label
// ❌ BEFORE
<div style={{ letterSpacing: '0.15em' }} className="...">
  {sectionLabel}
</div>

// ✅ AFTER
<div className="tracking-[0.15em] ...">
  {sectionLabel}
</div>
```

```tsx
// Line 38-40: Section title
// ❌ BEFORE
<h2
  style={{
    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
    lineHeight: '1.3'
  }}
  className="..."
>

// ✅ AFTER
<h2 className="text-[clamp(2rem,5vw,3.5rem)] leading-[1.3] ...">
```

**Testing:**
```bash
# Visual check
npm run dev
# Navigate to any case study page, verify section headers look identical
```

---

### 1.2 CaseStudyAnnotation.tsx (2 minutes)

**File:** `/src/components/case-studies/detail/CaseStudyAnnotation.tsx`

**Changes:**

```tsx
// Line 32-35: Annotation text
// ❌ BEFORE
<p
  style={{
    fontSize: '0.95rem',
    lineHeight: '1.6',
    color: '#c0c0c0'
  }}
>

// ✅ AFTER
<p className="text-[0.95rem] leading-[1.6] text-muted-foreground">
```

**Testing:**
```bash
# Verify annotation text color adapts to dark mode
# Light mode: should be gray (#c0c0c0 equivalent)
# Dark mode: should be lighter (from text-muted-foreground)
```

---

### 1.3 CaseStudyAchievements.tsx (5 minutes)

**File:** `/src/components/case-studies/detail/CaseStudyAchievements.tsx`

**Changes:**

```tsx
// Line 39-44: Achievement bullet point
// ❌ BEFORE
<span
  className="absolute bg-accent rounded-full"
  style={{
    left: 0,
    top: '0.6rem',
    width: '6px',
    height: '6px'
  }}
/>

// ✅ AFTER
<span className="absolute left-0 top-[0.6rem] w-[6px] h-[6px] bg-accent rounded-full" />
```

```tsx
// Line 49-51: Achievement text
// ❌ BEFORE
<span
  style={{
    fontSize: '1.25rem',
    color: '#fafafa'
  }}
>

// ✅ AFTER
<span className="text-[1.25rem] text-foreground">
```

**Testing:**
```bash
# Check achievements section bullets and text
# Verify bullets are positioned correctly
# Verify text color adapts to theme (dark/light mode)
```

---

### Phase 1 Checkpoint

**Time:** 10-15 minutes
**Files Refactored:** 3 of 6
**New Compliance:** ~96%
**Commit Message:**
```
refactor: convert inline styles to Tailwind utilities (Phase 1)

- Replace inline letter-spacing/font-sizing in CaseStudySectionHeader
- Replace inline color in CaseStudyAnnotation with semantic token
- Replace inline positioning in CaseStudyAchievements with Tailwind classes

Part of style compliance refactor (Phase 1/3)
```

---

## Phase 2: High-Impact Refactors (20-25 minutes)

**Goal:** Fix the most visible violations with higher complexity (96% → 99%)

**Impact:** Largest visible improvements, enables time-based theming

### 2.1 Add Gradient Utilities to globals.css (5 minutes)

**File:** `/src/app/globals.css`

**Add to `@layer utilities` section (after line 285):**

```css
@layer utilities {
  /* ... existing utilities ... */

  /* Hero gradient utilities */
  .gradient-hero-title {
    background: linear-gradient(135deg, hsl(var(--accent-light)), hsl(var(--foreground)));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .gradient-hero-badge {
    background: linear-gradient(135deg, hsl(var(--accent) / 0.1), hsl(var(--accent) / 0.05));
  }
}
```

**Add to `@layer components` section (after line 343):**

```css
@layer components {
  /* ... existing components ... */

  /* Metric card styling */
  .metric-card {
    @apply bg-white/[0.03] border border-white/10 rounded-3xl p-8;
    @apply hover:border-white/20 transition-colors-smooth;
  }

  /* Meta info styling for case studies */
  .meta-info-item {
    @apply bg-white/[0.05] border border-white/10 px-6 py-4 rounded-2xl;
  }
}
```

---

### 2.2 CaseStudyHero.tsx (10 minutes)

**File:** `/src/components/case-studies/detail/CaseStudyHero.tsx`

**Changes:**

```tsx
// Line 35-40: Badge container
// ❌ BEFORE
<div
  style={{
    background: 'rgba(199, 128, 245, 0.1)',
    border: '1px solid rgba(199, 128, 245, 0.3)',
    color: 'hsl(280, 100%, 80%)',
    letterSpacing: '0.1em'
  }}
  className="inline-block px-6 py-3 rounded-full mb-8"
>

// ✅ AFTER
<div className="inline-block px-6 py-3 rounded-full mb-8 gradient-hero-badge border border-accent/30 text-accent-light tracking-[0.1em]">
```

```tsx
// Line 49-56: Hero title
// ❌ BEFORE
<h1
  style={{
    fontSize: 'clamp(3rem, 8vw, 5rem)',
    lineHeight: '1.1',
    background: 'linear-gradient(135deg, hsl(280, 100%, 80%), hsl(0, 0%, 98%))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  }}
  className="font-bold mb-6"
>

// ✅ AFTER
<h1 className="text-[clamp(3rem,8vw,5rem)] leading-[1.1] font-bold mb-6 gradient-hero-title">
```

```tsx
// Line 65-67: Subtitle
// ❌ BEFORE
<p
  style={{
    fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
    color: '#a0a0a0'
  }}
  className="mb-12"
>

// ✅ AFTER
<p className="text-[clamp(1.25rem,3vw,1.75rem)] text-muted-foreground mb-12">
```

```tsx
// Line 81-83: Meta info items
// ❌ BEFORE
<div
  style={{
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  }}
  className="px-6 py-4 rounded-2xl"
>

// ✅ AFTER
<div className="meta-info-item">
```

**Testing:**
```bash
# Test case study hero on multiple case studies
npm run dev
# Navigate to /case-studies/[any-slug]

# Verify:
# - Badge has proper purple/coral gradient based on time
# - Title gradient transitions smoothly between themes
# - Subtitle color adapts to light/dark mode
# - Meta info boxes look identical
```

---

### 2.3 CaseStudyMetrics.tsx (8 minutes)

**File:** `/src/components/case-studies/detail/CaseStudyMetrics.tsx`

**Changes:**

```tsx
// Line 38: Section container
// ❌ BEFORE
<section
  style={{ background: 'rgba(199, 128, 245, 0.03)' }}
  className="py-24 px-8 relative overflow-hidden"
>

// ✅ AFTER
<section className="py-24 px-8 relative overflow-hidden bg-accent/[0.03]">
```

```tsx
// Line 51-53: Metric card
// ❌ BEFORE
<div
  style={{
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  }}
  className="rounded-3xl p-8 text-center hover:border-white/20 transition-colors"
>

// ✅ AFTER
<div className="metric-card text-center">
```

```tsx
// Line 59: Metric value
// ❌ BEFORE
<div style={{ fontSize: '3.5rem' }} className="font-bold text-accent mb-2">

// ✅ AFTER
<div className="text-[3.5rem] font-bold text-accent mb-2">
```

```tsx
// Line 71: Metric label
// ❌ BEFORE
<div style={{ color: '#a0a0a0' }}>

// ✅ AFTER
<div className="text-muted-foreground">
```

**Testing:**
```bash
# Test metrics section
# Verify:
# - Section background has subtle purple tint
# - Metric cards have proper borders and hover states
# - Metric values display at correct size
# - Labels use semantic gray color
```

---

### Phase 2 Checkpoint

**Time:** 20-25 minutes
**Files Refactored:** 5 of 6
**New Compliance:** ~99%
**Commit Message:**
```
refactor: replace hardcoded colors with semantic tokens (Phase 2)

- Add gradient and metric card utilities to globals.css
- Replace all hardcoded purple/gray colors in CaseStudyHero
- Replace inline rgba colors in CaseStudyMetrics with semantic tokens
- Enable time-based theme support for hero gradients

All case study components now use centralized design system.

Part of style compliance refactor (Phase 2/3)
```

---

## Phase 3: Cleanup & Documentation (10-15 minutes)

**Goal:** Polish, document, and establish governance (99% → 100%)

### 3.1 WarmDepth.tsx - Document Exception (2 minutes)

**File:** `/src/components/design-concepts/WarmDepth.tsx`

**Add TSDoc comment at top of file:**

```tsx
/**
 * WarmDepth Design Concept
 *
 * NOTE: This is an experimental design concept component with a custom orange theme.
 * It intentionally uses hardcoded colors that are NOT part of the main design system.
 *
 * STATUS: Non-production, demonstration only
 *
 * If this design is promoted to production, refactor to use:
 * - Custom CSS variables in globals.css
 * - Semantic tokens in tailwind.config.ts
 * - Design system utilities
 */
```

**No code changes needed** - this component is acceptable as-is for a design concept.

---

### 3.2 Create Styling Exception Policy (3 minutes)

**File:** `/docs/styling-exceptions.md` (new file)

```markdown
# Styling Exception Policy

## When to Use Inline Styles

Inline styles should be avoided in 99% of cases. Use Tailwind utilities or design system tokens instead.

### Acceptable Exceptions

Inline styles are acceptable ONLY in these scenarios:

1. **Complex Gradients** - When a gradient composition is too complex for a utility class
   - Must document why with TSDoc comment
   - Should still use CSS variables where possible

2. **Dynamic Calculations** - When values are calculated at runtime
   - Example: `style={{ width: \`\${percentage}%\` }}`

3. **Design Concepts** - Components in `/design-concepts/` directory
   - Must include TSDoc comment explaining this is non-production
   - Must refactor before promoting to production

### How to Document Exceptions

When inline styles are necessary, add a comment:

\`\`\`tsx
{/* Inline style required: Dynamic calculation based on user data */}
<div style={{ width: \`\${percentage}%\` }}>

{/* Inline gradient required: Complex composition not suitable for utility class */}
<div style={{ background: 'linear-gradient(...)' }}>
\`\`\`

## Color Usage Policy

All colors MUST use semantic tokens from the design system:

### ✅ CORRECT
\`\`\`tsx
<div className="bg-accent text-foreground border-border">
<div className="bg-accent/10"> {/* Arbitrary opacity */}
<div className="text-muted-foreground"> {/* Semantic text color */}
\`\`\`

### ❌ INCORRECT
\`\`\`tsx
<div style={{ background: '#8B5CF6' }}> {/* Hardcoded hex */}
<div style={{ color: 'rgba(199, 128, 245, 0.3)' }}> {/* Hardcoded rgba */}
<div className="bg-purple-500"> {/* Tailwind color without dark mode variant */}
\`\`\`

## Transition Usage Policy

Use semantic duration and easing tokens:

### ✅ CORRECT
\`\`\`tsx
<div className="transition-smooth"> {/* 300ms, ease-smooth */}
<div className="transition-fast hover:scale-105"> {/* 150ms */}
<div className="duration-normal ease-smooth"> {/* Explicit tokens */}
\`\`\`

### ❌ INCORRECT
\`\`\`tsx
<div className="transition-all duration-300"> {/* Magic number */}
<div style={{ transition: 'all 0.3s ease-out' }}> {/* Inline timing */}
\`\`\`

## Enforcement

This policy is enforced through:

1. **Code Review** - PRs should be checked for violations
2. **Documentation** - This file and CLAUDE.md
3. **Periodic Audits** - Run compliance audits quarterly

## Questions?

See `/docs/tailwind-style-compliance-audit-2025-11-02.md` for examples and best practices.
\`\`\`

---

### 3.3 Update CLAUDE.md (5 minutes)

**File:** `/CLAUDE.md`

**Add new section after "CSS & Styling System" (around line 420):**

```markdown
### Style Compliance Guidelines

**IMPORTANT: Follow the centralized design system at all times**

1. **Use semantic color tokens** - Never hardcode colors
   \`\`\`tsx
   // ✅ GOOD
   <div className="bg-accent text-foreground">

   // ❌ BAD
   <div style={{ background: '#8B5CF6' }}>
   \`\`\`

2. **Use utility classes** from globals.css
   - `.transition-smooth`, `.flex-center`, `.card-base`, etc.

3. **Use Tailwind arbitrary values** instead of inline styles
   \`\`\`tsx
   // ✅ GOOD
   <div className="w-[320px] text-[1.25rem]">

   // ❌ BAD
   <div style={{ width: '320px', fontSize: '1.25rem' }}>
   \`\`\`

4. **Always include dark mode variants** on colored elements
   \`\`\`tsx
   // ✅ GOOD (but prefer semantic tokens)
   <div className="text-purple-400 dark:text-purple-300">

   // ✅ BETTER (semantic tokens handle dark mode automatically)
   <div className="text-accent">
   \`\`\`

5. **Follow the exception policy** at `/docs/styling-exceptions.md`

**Compliance Status:** 100% as of November 2, 2025
**Last Audit:** See `/docs/tailwind-style-compliance-audit-2025-11-02.md`
```

---

### 3.4 Create Pre-Commit Reminder (3 minutes)

**File:** `.github/CODE_REVIEW_CHECKLIST.md` (new file)

```markdown
# Code Review Checklist

## Style Compliance (Tailwind Design System)

Before merging, verify:

- [ ] No inline `style` attributes (except documented exceptions)
- [ ] No hardcoded hex/rgba colors
- [ ] All colors use semantic tokens (`bg-accent`, `text-foreground`, etc.)
- [ ] Transitions use semantic durations (`duration-normal`, `transition-smooth`)
- [ ] Dark mode variants included on colored elements (or semantic tokens used)
- [ ] Arbitrary Tailwind values used instead of inline sizing (`w-[320px]` not `style={{ width: '320px' }}`)

## Design System Resources

- **Audit Report:** `/docs/tailwind-style-compliance-audit-2025-11-02.md`
- **Exception Policy:** `/docs/styling-exceptions.md`
- **Quick Reference:** `/docs/css-quick-reference.md`

## Common Violations to Watch For

```tsx
// ❌ VIOLATION: Hardcoded color
<div style={{ background: 'rgba(199, 128, 245, 0.1)' }}>

// ✅ CORRECT: Semantic token
<div className="bg-accent/10">

// ❌ VIOLATION: Inline sizing
<div style={{ fontSize: '1.5rem', lineHeight: '1.3' }}>

// ✅ CORRECT: Tailwind arbitrary values
<div className="text-[1.5rem] leading-[1.3]">

// ❌ VIOLATION: Magic transition number
<div className="transition-all duration-300">

// ✅ CORRECT: Semantic duration
<div className="transition-smooth">
```

## When in Doubt

Ask: "Could this use a semantic token or utility class from the design system?"

If yes → Use the design system
If no → Document why with a TSDoc comment
```

---

### Phase 3 Checkpoint

**Time:** 10-15 minutes
**Files Created/Updated:** 4
**New Compliance:** 100% ✅
**Commit Message:**
```
docs: establish style compliance governance (Phase 3)

- Document WarmDepth.tsx as acceptable design concept exception
- Create styling exception policy at /docs/styling-exceptions.md
- Update CLAUDE.md with style compliance guidelines
- Add code review checklist for future PRs

Completes style compliance refactor. Portfolio now at 100% compliance.

Closes style compliance audit (November 2, 2025)
```

---

## Complete Implementation Timeline

### Summary

| Phase | Focus | Time | Compliance | Files |
|-------|-------|------|------------|-------|
| **Phase 1** | Quick wins (easy refactors) | 15-20 min | 89.5% → 96% | 3 files |
| **Phase 2** | High-impact (hero, metrics) | 20-25 min | 96% → 99% | 2 files + globals.css |
| **Phase 3** | Documentation & governance | 10-15 min | 99% → 100% | 4 docs |
| **Total** | Complete refactor | **45-60 min** | **100%** | **9 files** |

---

## Testing Strategy

### After Each Phase

```bash
# Build test (catches TypeScript errors)
npm run build

# Visual inspection
npm run dev

# Check these pages:
# - Homepage: /
# - Case studies list: /case-studies
# - Any case study detail: /case-studies/[slug]
# - AI showcase: /ai-showcase
```

### Visual Regression Checklist

After Phase 2 (most visible changes):

- [ ] Case study hero section looks identical
- [ ] Hero title gradient displays properly
- [ ] Badge has proper purple/coral tint
- [ ] Metrics cards have correct opacity and borders
- [ ] Hover states work on metric cards
- [ ] Dark mode shows proper contrast
- [ ] Time-based theme transitions smoothly (6am coral → 6pm purple)

### Accessibility Check

```bash
# Lighthouse audit
npm run build
npx lighthouse http://localhost:3000/case-studies/[slug] --only-categories=accessibility

# Should maintain 100% accessibility score
```

---

## Rollback Plan

If issues arise during any phase:

### Git Rollback Commands

```bash
# After Phase 1
git reset --hard HEAD~1
git clean -fd

# After Phase 2
git reset --hard HEAD~2
git clean -fd

# After Phase 3
git reset --hard HEAD~3
git clean -fd
```

### Backup Strategy

Before starting:

```bash
# Create backup branch
git checkout -b backup/pre-style-refactor
git push origin backup/pre-style-refactor

# Return to main work
git checkout main
```

---

## Success Criteria

### Phase 1 Success
- ✅ CaseStudySectionHeader uses Tailwind classes only
- ✅ CaseStudyAnnotation uses semantic text color
- ✅ CaseStudyAchievements uses Tailwind positioning
- ✅ Build succeeds with no errors
- ✅ Visual inspection shows no changes

### Phase 2 Success
- ✅ CaseStudyHero uses gradient utilities
- ✅ CaseStudyMetrics uses semantic tokens
- ✅ globals.css has new utilities
- ✅ Time-based theme works on hero gradients
- ✅ Build succeeds with no errors
- ✅ Dark mode works correctly

### Phase 3 Success
- ✅ WarmDepth.tsx documented as exception
- ✅ Styling exception policy created
- ✅ CLAUDE.md updated
- ✅ Code review checklist created
- ✅ 100% compliance achieved

---

## Post-Implementation

### Immediate Next Steps

1. **Run full build test**
   ```bash
   npm run build
   npm run start
   ```

2. **Test on all viewports**
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1920px)

3. **Test theme transitions**
   - Light → Dark mode
   - Time-based theme (morning coral → evening purple)

### Future Maintenance

1. **Quarterly Audits** - Run compliance audit every 3 months
   ```bash
   # Use the same agent that created the original audit
   ```

2. **Code Review** - Use checklist at `.github/CODE_REVIEW_CHECKLIST.md`

3. **New Component Template** - When creating components:
   - Start with semantic tokens
   - Use utility classes from globals.css
   - Check existing compliant components for patterns

---

## Reference Links

### Created During This Refactor
- **Audit Report:** `/docs/tailwind-style-compliance-audit-2025-11-02.md`
- **Implementation Plan:** `/docs/tailwind-compliance-refactor-plan.md` (this file)
- **Exception Policy:** `/docs/styling-exceptions.md` (Phase 3)
- **Review Checklist:** `.github/CODE_REVIEW_CHECKLIST.md` (Phase 3)

### Existing Documentation
- **Quick Reference:** `/docs/css-quick-reference.md`
- **Animation System:** `/docs/animation-system.md`
- **Component Patterns:** `/docs/component-styling-patterns.md`
- **Responsive Guide:** `/docs/responsive-design-guide.md`

### Design System Files
- **Utilities & Variables:** `/src/app/globals.css`
- **Tailwind Config:** `/tailwind.config.ts`
- **Helpers:** `/src/lib/utils.ts` (cn() utility)

---

## Questions & Support

### Common Questions

**Q: Can I use Tailwind color classes like `bg-purple-500`?**
A: Only if you include dark mode variant: `bg-purple-500 dark:bg-purple-400`. Better: use semantic token `bg-accent`.

**Q: When should I create a new utility class?**
A: When you use the same pattern 3+ times across different components.

**Q: What if the design requires a color not in the system?**
A: First, check if a semantic token works. If not, add it to globals.css as a CSS variable, then register in tailwind.config.ts.

**Q: Can I use inline styles for animations?**
A: Prefer Tailwind arbitrary values or keyframes in globals.css. Only use inline if the animation is truly dynamic (calculated at runtime).

---

## Appendix: File Paths

### Files to Modify

**Phase 1:**
- `/src/components/case-studies/detail/CaseStudySectionHeader.tsx`
- `/src/components/case-studies/detail/CaseStudyAnnotation.tsx`
- `/src/components/case-studies/detail/CaseStudyAchievements.tsx`

**Phase 2:**
- `/src/app/globals.css`
- `/src/components/case-studies/detail/CaseStudyHero.tsx`
- `/src/components/case-studies/detail/CaseStudyMetrics.tsx`

**Phase 3:**
- `/src/components/design-concepts/WarmDepth.tsx` (comment only)
- `/docs/styling-exceptions.md` (new)
- `/CLAUDE.md` (update)
- `.github/CODE_REVIEW_CHECKLIST.md` (new)

---

*Implementation plan created: November 2, 2025*
*Estimated total time: 45-60 minutes*
*Target compliance: 100%*
