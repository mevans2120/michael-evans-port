# Design Token Migration Plan: Replace Hardcoded Purple with Design Tokens

**Date**: November 2, 2025
**Status**: Planning
**Goal**: Replace all hardcoded purple Tailwind classes with design tokens for centralized color management

## Problem Statement

Currently, there are **126 instances** of hardcoded purple Tailwind classes (`text-purple-400`, `bg-purple-500/20`, `border-purple-500`, etc.) across 38 files. This bypasses our design system and makes it impossible to:

1. Change the accent color site-wide from globals.css
2. Apply Concept 1 (Minimal Gray) color scheme
3. Maintain consistent color usage across components

## Design System (Already Exists)

We already have proper design tokens in `tailwind.config.ts`:

```typescript
colors: {
  accent: {
    DEFAULT: 'hsl(var(--accent))',
    foreground: 'hsl(var(--accent-foreground))',
    light: 'hsl(var(--accent-light))'
  },
  border: 'hsl(var(--border))',
  muted: {
    DEFAULT: 'hsl(var(--muted))',
    foreground: 'hsl(var(--muted-foreground))'
  }
}
```

## Migration Strategy

Replace hardcoded purple classes with design tokens:

| Current (Hardcoded) | New (Design Token) | Use Case |
|---------------------|-------------------|----------|
| `text-purple-400` | `text-accent` | Primary accent text |
| `text-purple-300` | `text-accent-light` | Lighter accent text |
| `bg-purple-500/20` | `bg-accent/20` | Accent backgrounds with opacity |
| `border-purple-400/10` | `border-accent/10` | Accent borders with opacity |
| `hover:text-purple-300` | `hover:text-accent-light` | Hover states |
| `focus:ring-purple-500` | `focus:ring-accent` | Focus states |
| `from-purple-400` | `from-accent` | Gradients |

**For gray replacements (Concept 1 future):**
- Decorative purple → `text-muted-foreground` or `border-border`
- Critical accents → Keep as `accent` (will be purple in nav only)

## Phased Implementation (4 Phases)

### Phase 1: High-Impact Public Pages (Priority 1)
**Impact**: Maximum user visibility
**Effort**: ~2 hours
**Files**: 8 files, ~50 instances

#### Files to Update:
1. **Homepage** (`src/app/(public)/page.tsx`) - 4 instances
2. **Case Studies Landing** (`src/components/case-studies/CaseStudiesHero.tsx`) - 4 instances
3. **Featured Case Studies** (`src/components/FeaturedCaseStudies.tsx`) - 4 instances
4. **Case Study Detail Page** (`src/app/(public)/case-studies/[slug]/page.tsx`) - 6 instances
5. **Case Study Narrative** (`src/components/CaseStudyNarrative.tsx`) - 11 instances
6. **Case Study Section** (`src/components/CaseStudySection.tsx`) - 9 instances
7. **Case Study Screenshots** (`src/components/CaseStudyScreenshots.tsx`) - 2 instances
8. **AI Showcase Landing** (`src/app/(public)/ai-showcase/page.tsx`) - 7 instances

**Validation**:
- Run visual regression tests
- Check homepage, case studies, AI showcase pages
- Verify dark mode

---

### Phase 2: About Page & Case Study Components (Priority 2)
**Impact**: High user visibility
**Effort**: ~1.5 hours
**Files**: 8 files, ~35 instances

#### Files to Update:
1. **About Page Client** (`src/components/about/AboutPageClient.tsx`) - 7 instances
2. **Case Study Annotations** (`src/components/case-studies/detail/CaseStudyAnnotation.tsx`) - 6 instances
3. **Case Study Headers** (`src/components/case-studies/detail/CaseStudySectionHeader.tsx`) - 5 instances
4. **Case Study Achievements** (`src/components/case-studies/detail/CaseStudyAchievements.tsx`) - 3 instances
5. **Case Study Metrics** (`src/components/case-studies/detail/CaseStudyMetrics.tsx`) - 1 instance
6. **Case Study CTA** (`src/components/case-studies/detail/CaseStudyCTA.tsx`) - 2 instances
7. **Case Study Section** (`src/components/case-studies/detail/CaseStudySection.tsx`) - 1 instance
8. **Section Separator** (`src/components/case-studies/SectionSeparator.tsx`) - 1 instance

**Validation**:
- Check /about page
- View case study detail pages
- Test all case study sections

---

### Phase 3: AI Showcase Components (Priority 3)
**Impact**: Medium user visibility
**Effort**: ~1.5 hours
**Files**: 11 files, ~50 instances

#### Files to Update:
1. **Timeline Phase** (`src/components/ai-showcase/TimelinePhase.tsx`) - 6 instances
2. **Project Card** (`src/components/ai-showcase/ProjectCard.tsx`) - 6 instances
3. **Workflow Step** (`src/components/ai-showcase/WorkflowStep.tsx`) - 5 instances
4. **Visual Grid** (`src/components/ai-showcase/VisualGrid.tsx`) - 5 instances
5. **Metrics Slide** (`src/components/ai-showcase/MetricsSlide.tsx`) - 5 instances
6. **Comparison Grid** (`src/components/ai-showcase/ComparisonGrid.tsx`) - 5 instances
7. **Hero Slide** (`src/components/ai-showcase/HeroSlide.tsx`) - 3 instances
8. **Content Slide** (`src/components/ai-showcase/ContentSlide.tsx`) - 3 instances
9. **Tech Pills** (`src/components/ai-showcase/TechPills.tsx`) - 3 instances
10. **Slide Navigation** (`src/components/ai-showcase/SlideNavigation.tsx`) - 3 instances
11. **Quote Box** (`src/components/ai-showcase/QuoteBox.tsx`) - 3 instances
12. **Horizontal Timeline** (`src/components/ai-showcase/HorizontalTimelineSlide.tsx`) - 2 instances
13. **AI Showcase Page Client** (`src/app/(public)/ai-showcase/[slug]/AIShowcasePageClient.tsx`) - 1 instance

**Validation**:
- Check AI showcase pages
- Test all slide variations
- Verify component library

---

### Phase 4: Navigation & Design Concepts (Priority 4)
**Impact**: Navigation is critical, design concepts are experimental
**Effort**: ~1 hour
**Files**: 6 files, ~20 instances

#### Files to Update:
1. **Navigation Panel** (`src/components/navigation/NavigationPanel.tsx`) - 4 instances
   - **IMPORTANT**: Keep purple on border (this is intentional for Concept 1)
2. **Chat Section** (`src/components/navigation/ChatSection.tsx`) - 2 instances
3. **Suggested Prompts** (`src/components/navigation/SuggestedPrompts.tsx`) - 1 instance
4. **Navigation Menu** (`src/components/navigation/NavigationMenu.tsx`) - 1 instance
5. **Minimal Professional Concept** (`src/components/design-concepts/MinimalProfessional.tsx`) - 8 instances
6. **Test Navigation Page** (`src/app/(admin)/test-navigation/page.tsx`) - 8 instances (admin only)

**Validation**:
- Test navigation in all states (collapsed, expanded)
- Verify purple border remains on navigation (intentional)
- Check chat functionality
- Test design concept pages

---

## Migration Steps (Per File)

For each file in a phase:

1. **Read the file** to understand context
2. **Identify purple classes**:
   ```bash
   grep -n "purple" <file>
   ```
3. **Replace with design tokens**:
   - `text-purple-400` → `text-accent`
   - `bg-purple-500/20` → `bg-accent/20`
   - `border-purple-400` → `border-accent`
4. **Update hover/focus states** to use design tokens
5. **Test visually** in browser (dark mode + light mode)
6. **Run visual regression tests**:
   ```bash
   npm run test:visual
   ```
7. **Commit changes** with clear message

## Special Cases

### Navigation Border (Keep Purple)
The navigation border should **remain purple** even in Concept 1 (Minimal Gray):

```tsx
// ✅ KEEP THIS - Intentional purple accent
<div className="border-r-2 border-accent">
```

Do not change navigation border to gray - it's a critical accent in Concept 1.

### Critical CTAs (Keep Accent)
Important call-to-action buttons should use `accent`:

```tsx
// ✅ Use accent for primary CTAs
<button className="bg-accent text-accent-foreground">
  Schedule Call
</button>
```

### Decorative Elements (Consider Gray)
For purely decorative purple elements, consider if they should use:
- `accent` (if they're intentional accents)
- `muted-foreground` or `border-border` (if they're just visual separators)

## Testing Strategy

After each phase:

1. **Visual Check**:
   - Light mode
   - Dark mode
   - All breakpoints (mobile, tablet, desktop)

2. **Automated Tests**:
   ```bash
   npm run test:visual       # Screenshot comparison
   npm run build             # Type checking
   npm run test             # Unit/integration tests
   ```

3. **Manual Verification**:
   - Navigate through affected pages
   - Test interactive elements (hover, focus, active states)
   - Check accessibility (contrast ratios)

## After Migration Complete

Once all hardcoded purple is replaced with design tokens:

### You can easily apply Concept 1 (Minimal Gray):

**Option A: Full Concept 1 (Most Purple → Gray)**
```css
.dark {
  --color-accent: 0 0% 83%;  /* Light gray #d4d4d4 for most things */
  --navigation-border: 276 85% 60%;  /* Keep purple ONLY on nav border */
}
```

**Option B: Selective Accent (Purple for CTAs only)**
```css
.dark {
  --color-accent: 276 85% 60%;  /* Darker purple */
  /* Use sparingly - only on critical elements using bg-accent */
}
```

Then manually replace decorative `accent` usage with `muted-foreground`:
```tsx
// Change decorative accents to gray
<span className="text-muted-foreground">  {/* was text-accent */}
```

## Success Metrics

- [ ] Zero hardcoded purple Tailwind classes in components
- [ ] All colors use design tokens (accent, muted, border, etc.)
- [ ] Can change site-wide accent color by editing globals.css only
- [ ] Visual regression tests pass
- [ ] No accessibility issues (contrast ratios maintained)
- [ ] Can apply Concept 1 (Minimal Gray) in < 5 minutes

## Rollback Plan

Each phase is independent:
- If Phase 1 has issues, revert just those files
- Previous phases remain stable
- Use git to revert specific files if needed

## Estimated Timeline

- **Phase 1**: 2 hours (high-impact public pages)
- **Phase 2**: 1.5 hours (about + case study components)
- **Phase 3**: 1.5 hours (AI showcase components)
- **Phase 4**: 1 hour (navigation + design concepts)

**Total**: ~6 hours of focused migration work

Can be done over 1-2 days with breaks for testing between phases.

## Next Steps

1. **Review this plan** - ensure phases align with priorities
2. **Start with Phase 1** - highest user visibility
3. **Test thoroughly** after each phase
4. **Proceed to next phase** only when previous phase is stable
5. **Apply Concept 1 colors** after all phases complete

## Notes

- This is a **code quality improvement** first, color scheme change second
- Makes future design updates trivial (change one variable vs 126 files)
- Aligns with Tailwind best practices (use design tokens, not hardcoded values)
- Sets foundation for easy theme switching in the future
