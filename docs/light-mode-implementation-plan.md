# Light Mode Implementation Plan

**Created:** October 31, 2025
**Status:** Planning Phase
**Estimated Effort:** 3-5 days

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Design Philosophy & Rules](#design-philosophy--rules)
3. [Color System Architecture](#color-system-architecture)
4. [Component Inventory](#component-inventory)
5. [Implementation Phases](#implementation-phases)
6. [Testing Strategy](#testing-strategy)
7. [Accessibility Requirements](#accessibility-requirements)

---

## Executive Summary

This document outlines a comprehensive plan to implement a light mode theme for the Michael Evans portfolio site while maintaining the existing dark mode aesthetic. The implementation will use Tailwind's `dark:` modifier system and CSS custom properties to create a fully accessible, user-controlled theme switching experience.

**Key Goals:**
- Maintain brand identity and visual hierarchy in both themes
- Ensure WCAG AA contrast compliance (4.5:1 for text, 3:1 for UI)
- Preserve the purple accent brand color across both themes
- Provide seamless theme switching without layout shift
- Respect user's system preference by default
- Persist user's manual theme choice

---

## Design Philosophy & Rules

### Core Principles

1. **Dark Mode is Primary**: The dark theme is the "hero" aesthetic - light mode should feel equally polished but the dark mode should never be compromised
2. **Purple is Sacred**: Purple accent (`hsl(276 100% 75%)`) must remain vibrant and prominent in both themes
3. **Progressive Enhancement**: Light mode should work for users who need it (accessibility, outdoor viewing) without being forced
4. **Consistency Over Novelty**: UI elements should behave the same way in both themes

### Color Transformation Rules

#### Background Colors
- **Dark Mode Base**: `#050510` (deep purple-blue)
- **Light Mode Base**: `#FAFAFA` (warm white)
- **Rule**: Invert luminosity while preserving hue relationships

#### Text Colors
- **Dark Mode**: White text (`#FAFAFA`) on dark backgrounds
- **Light Mode**: Dark text (`#1A1A2E`) on light backgrounds
- **Rule**: Maintain minimum 4.5:1 contrast ratio for body text, 3:1 for large text

#### Accent Colors (Purple)
- **Dark Mode**: `hsl(276 100% 75%)` - bright purple
- **Light Mode**: `hsl(276 70% 55%)` - deeper purple for better contrast
- **Rule**: Purple must "pop" in both themes but remain accessible

#### Card/Surface Colors
- **Dark Mode**: `hsl(280 25% 12%)` - dark purple-tinted surface
- **Light Mode**: `#FFFFFF` with subtle shadows - clean white surface
- **Rule**: Maintain layering hierarchy through elevation, not just color

#### Border Colors
- **Dark Mode**: `hsl(280 25% 20%)` - subtle purple border
- **Light Mode**: `hsl(280 15% 88%)` - light gray with purple tint
- **Rule**: Borders should define space without dominating

#### Muted/Secondary Text
- **Dark Mode**: `hsl(215 15% 70%)` - light gray
- **Light Mode**: `hsl(215 15% 45%)` - medium gray
- **Rule**: Secondary text should be noticeable but not compete with primary content

### Gradient Rules

1. **Primary Gradient** (used in hero headings):
   - Dark: `hsl(280 60% 60%)` → `hsl(0 0% 98%)` (purple to white)
   - Light: `hsl(280 70% 55%)` → `hsl(280 90% 25%)` (purple gradient)

2. **Purple Gradient** (used in accent elements):
   - Dark: `hsl(276 100% 75%)` → `hsl(280 100% 80%)`
   - Light: `hsl(276 70% 55%)` → `hsl(280 80% 65%)`

3. **Subtle Gradient** (used in backgrounds):
   - Dark: `hsl(215 28% 4%)` → `hsl(215 25% 8%)`
   - Light: `hsl(0 0% 98%)` → `hsl(0 0% 95%)`

### Shadow Rules

- **Dark Mode**: Use colored shadows with purple tint for depth
- **Light Mode**: Use neutral gray shadows for elevation
- **Rule**: Shadows should enhance depth perception, not distract

---

## Color System Architecture

### 1. CSS Custom Properties Update

Location: `src/app/globals.css`

```css
@layer base {
  :root {
    /* Light mode colors */
    --background: 0 0% 98%;
    --foreground: 240 20% 12%;

    --card: 0 0% 100%;
    --card-foreground: 240 20% 12%;

    --popover: 0 0% 100%;
    --popover-foreground: 240 20% 12%;

    --primary: 240 20% 12%;
    --primary-foreground: 0 0% 98%;

    --secondary: 280 15% 92%;
    --secondary-foreground: 240 20% 12%;

    --muted: 280 10% 95%;
    --muted-foreground: 215 15% 45%;

    --accent: 276 70% 55%;
    --accent-foreground: 0 0% 98%;
    --accent-light: 280 80% 65%;

    --destructive: 0 84% 45%;
    --destructive-foreground: 0 0% 98%;

    --border: 280 15% 88%;
    --input: 280 15% 88%;
    --ring: 276 70% 55%;

    --gradient-primary: linear-gradient(135deg, hsl(280 70% 55%), hsl(280 90% 25%));
    --gradient-purple: linear-gradient(135deg, hsl(276 70% 55%), hsl(280 80% 65%));
    --gradient-subtle: linear-gradient(180deg, hsl(0 0% 98%), hsl(0 0% 95%));
    --shadow-elegant: 0 10px 30px -10px hsl(240 20% 12% / 0.1);
    --shadow-card: 0 4px 20px -4px hsl(240 20% 12% / 0.08);
  }

  .dark {
    /* Existing dark mode colors remain unchanged */
    --background: 240 10% 3%;
    --foreground: 0 0% 98%;
    /* ... rest of dark mode tokens ... */
  }
}
```

### 2. Semantic Color Tokens

All components should use semantic tokens, never hardcoded colors:

**✅ Good:**
```tsx
<div className="bg-background text-foreground border-border">
```

**❌ Bad:**
```tsx
<div className="bg-[#050510] text-[#fafafa] border-[#333]">
```

### 3. Hardcoded Colors to Replace

Found in codebase:
- `bg-[#050510]` → `bg-background`
- `text-[#fafafa]` → `text-foreground`
- `bg-[#00ff88]` → Keep for terminal theme (design concept component)
- Purple color variations → Use `accent` token

---

## Component Inventory

### Pages (8 routes)

| Page | Path | Theme-Critical Elements |
|------|------|------------------------|
| Homepage | `/` | Hero section, featured case studies, gradient text |
| About | `/about` | Profile sections, long-form content |
| Case Studies Index | `/case-studies` | Card grid, hover states |
| Case Study Detail | `/case-studies/[slug]` | Hero, narrative sections, screenshots |
| AI Showcase Index | `/ai-showcase` | Project cards, tech pills |
| AI Showcase Detail | `/ai-showcase/[slug]` | Comparison grids, workflow steps |
| Design Concepts | `/design-concepts` | Concept previews (intentionally styled) |
| Admin/Studio | `/studio`, `/admin/*` | Sanity Studio (separate theme) |

### UI Components (50+ shadcn/ui)

**High Priority** (user-facing):
- `button.tsx` - Primary CTA, navigation
- `card.tsx` - Case study cards, content cards
- `input.tsx` - Contact forms, search
- `navigation-menu.tsx` - Main navigation
- `popover.tsx` - Tooltips, menus
- `sheet.tsx` - Mobile navigation
- `tabs.tsx` - Content organization
- `tooltip.tsx` - Help text

**Medium Priority** (admin/utility):
- `alert.tsx`, `alert-dialog.tsx`
- `calendar.tsx`, `command.tsx`
- `dialog.tsx`, `drawer.tsx`
- `select.tsx`, `slider.tsx`
- `switch.tsx`, `toggle.tsx`

**Low Priority** (rarely used):
- `accordion.tsx`, `aspect-ratio.tsx`
- `avatar.tsx`, `badge.tsx`
- `breadcrumb.tsx`, `chart.tsx`
- `hover-card.tsx`, `label.tsx`
- Etc.

### Custom Components (30+)

**Critical** (brand identity):
1. `FeaturedCaseStudies.tsx` - Homepage hero
   - Gradient text on hover/tap
   - Purple accent bar animation
   - Description reveal
   - Focus: Maintain hover effects, gradient must work in light mode

2. `NavigationPanel.tsx` - Side navigation
   - Purple border indicator
   - Collapsible state
   - Chat integration
   - Focus: Purple border visibility, panel backgrounds

3. `Chatbot.tsx` + related - AI chat interface
   - Message bubbles
   - User vs. assistant styling
   - Code blocks
   - Focus: Maintain message clarity, syntax highlighting

4. `CaseStudyNarrative.tsx` - Storytelling layout
   - Large typography
   - Section separators
   - Pull quotes
   - Focus: Reading experience, text hierarchy

5. `CaseStudySections.tsx` - Content sections
   - Metrics display
   - Annotations
   - Achievement lists
   - Focus: Data visualization clarity

**Important** (visual hierarchy):
6. `CaseStudiesHero.tsx` - Page hero
7. `CaseStudyBackground.tsx` - Visual storytelling
8. `SectionSeparator.tsx` - Content dividers
9. `TechPills.tsx` - Technology tags
10. `ComparisonGrid.tsx` - Before/after views

**Standard** (content display):
11. `Contact.tsx` - Contact form
12. `CaseStudyScreenshots.tsx` - Image gallery
13. `CaseStudySlideshow.tsx` - Slide deck
14. `WorkflowStep.tsx` - Process visualization
15. Etc.

### Special Considerations

**Do NOT theme:**
- `design-concepts/TerminalDark.tsx` - Intentionally themed component
- `design-concepts/MinimalProfessional.tsx` - Concept showcase
- `design-concepts/WarmDepth.tsx` - Concept showcase
- Sanity Studio UI - Uses its own theme system

---

## Implementation Phases

### Phase 0: Foundation (1 day)

**Goal**: Set up theme infrastructure

1. **Install Theme Dependencies**
   ```bash
   npm install next-themes
   ```

2. **Create Theme Provider**
   - File: `src/components/providers/theme-provider.tsx`
   - Wrap app with `<ThemeProvider>`
   - Configure: `attribute="class"`, `defaultTheme="system"`, `enableSystem`

3. **Update Root Layout**
   - File: `src/app/layout.tsx`
   - Add `suppressHydrationWarning` to `<html>` tag
   - Wrap children with `<ThemeProvider>`

4. **Create Theme Toggle Component**
   - File: `src/components/ui/theme-toggle.tsx`
   - Icon: Sun/Moon toggle button
   - Position: Top-right corner of navigation
   - States: Light / Dark / System

5. **Update CSS Custom Properties**
   - File: `src/app/globals.css`
   - Add light mode color tokens to `:root`
   - Keep dark mode tokens under `.dark` class
   - Test with browser DevTools class toggle

**Deliverable**: Theme switching works at CSS level

---

### Phase 1: Core Design System (1 day)

**Goal**: Update design tokens and verify contrast

1. **Define Light Mode Color Palette**
   - Document all HSL values
   - Test contrast ratios (use WebAIM Contrast Checker)
   - Create visual reference guide

2. **Update `globals.css`**
   - Add all light mode custom properties
   - Update gradients for light mode
   - Update shadows for light mode

3. **Update Base Styles**
   - `html` background: `dark:bg-[#050510] bg-[#FAFAFA]`
   - `body` text: `dark:text-[#fafafa] text-[#1A1A2E]`
   - Heading styles remain serif

4. **Test Typography**
   - Body text contrast: Light mode
   - Heading contrast: Light mode
   - Muted text readability: Light mode

**Deliverable**: Base page renders correctly in both themes

---

### Phase 2: Navigation & Layout (1 day)

**Goal**: Theme navigation, header, and structural elements

1. **NavigationPanel Component**
   - Update background: `bg-neutral-900` → `bg-neutral-900 dark:bg-neutral-900`
   - Update purple border: Works in both themes
   - Test collapsed/expanded states
   - Verify chevron visibility

2. **NavigationMenu Component**
   - Update link colors
   - Update hover states
   - Update active state indicator
   - Test keyboard navigation focus styles

3. **ChatSection Component**
   - Update background
   - Update suggested prompts styling
   - Verify purple accents

4. **Mobile Navigation**
   - Sheet/drawer backgrounds
   - Close button visibility
   - Overlay darkness

**Deliverable**: Navigation fully functional in both themes

---

### Phase 3: UI Component Library (1 day)

**Goal**: Theme all shadcn/ui components

1. **High Priority Components** (4 hours)
   - Button: All variants (default, destructive, outline, ghost)
   - Card: Background, border, hover state
   - Input: Border, focus ring, placeholder
   - Popover: Background, border, arrow
   - Sheet: Overlay, content background
   - Tooltip: Background, text, arrow

2. **Medium Priority Components** (3 hours)
   - Alert, AlertDialog
   - Dialog, Drawer
   - Select, Switch, Tabs
   - Command, Menubar

3. **Low Priority Components** (1 hour)
   - Remaining UI components
   - Follow same pattern
   - Test in Storybook/isolation if available

**Method:**
- Read each component
- Add `dark:` prefixes to color classes
- Test light mode rendering
- Test dark mode rendering
- Verify hover/focus/active states

**Deliverable**: All UI components themed

---

### Phase 4: Custom Components - Critical (1 day)

**Goal**: Theme high-impact custom components

1. **FeaturedCaseStudies.tsx** (3 hours)
   - Test gradient text in light mode
   - Verify purple bar visibility
   - Check hover state contrast
   - Mobile tap state
   - Focus ring visibility

2. **NavigationPanel.tsx** (2 hours)
   - Already covered in Phase 2
   - Final polish and edge cases

3. **Chatbot Components** (3 hours)
   - `Chatbot.tsx`: Main container
   - `ChatInterface.tsx`: Message list
   - `ChatMessage.tsx`: Bubble styling
   - `ChatButton.tsx`: Floating button
   - Update `chatbot.css` if needed
   - Test code block syntax highlighting
   - Verify user vs. assistant distinction

**Deliverable**: Homepage and chat experience fully themed

---

### Phase 5: Custom Components - Content (1 day)

**Goal**: Theme content display components

1. **Case Study Components** (4 hours)
   - `CaseStudyNarrative.tsx`
   - `CaseStudySections.tsx`
   - `CaseStudyBackground.tsx`
   - `CaseStudyScreenshots.tsx`
   - `CaseStudySlideshow.tsx`
   - `SectionSeparator.tsx`

2. **AI Showcase Components** (2 hours)
   - `ComparisonGrid.tsx`
   - `TechPills.tsx`
   - `WorkflowStep.tsx`
   - `VisualGrid.tsx`
   - `ProjectCard.tsx`

3. **Utility Components** (2 hours)
   - `Contact.tsx`
   - Any remaining custom components

**Deliverable**: All pages fully themed

---

### Phase 6: Testing & Polish (1 day)

**Goal**: Comprehensive testing and refinement

1. **Visual QA** (3 hours)
   - Test every page in light mode
   - Test every page in dark mode
   - Test theme toggle transitions
   - Verify no flash of unstyled content (FOUC)

2. **Accessibility Testing** (2 hours)
   - Run Lighthouse accessibility audit (both themes)
   - Check color contrast (WebAIM)
   - Test with screen reader (VoiceOver/NVDA)
   - Verify keyboard navigation

3. **Responsive Testing** (2 hours)
   - Mobile (375px, 414px)
   - Tablet (768px, 1024px)
   - Desktop (1280px, 1920px)
   - Test theme toggle on all sizes

4. **Browser Testing** (1 hour)
   - Chrome/Edge
   - Firefox
   - Safari (Mac/iOS)
   - Test system theme preference detection

**Deliverable**: Production-ready light mode

---

## Testing Strategy

### Automated Testing

1. **Visual Regression**
   - Tool: Playwright or Chromatic
   - Capture screenshots of each page in both themes
   - Compare before/after
   - Alert on unexpected changes

2. **Contrast Testing**
   - Tool: axe-core or pa11y
   - Run on every page
   - Ensure WCAG AA compliance
   - Block deployment on failures

3. **Unit Tests**
   - Test theme toggle component
   - Test localStorage persistence
   - Test system preference detection

### Manual Testing Checklist

**Per Component:**
- [ ] Renders in light mode
- [ ] Renders in dark mode
- [ ] Theme toggle switches correctly
- [ ] No layout shift on theme change
- [ ] Hover states work in both themes
- [ ] Focus states visible in both themes
- [ ] Active states work in both themes
- [ ] Text is readable in both themes
- [ ] Colors meet contrast requirements

**Per Page:**
- [ ] Hero section looks polished
- [ ] All content is readable
- [ ] Images have appropriate contrast
- [ ] CTAs are prominent
- [ ] Navigation is clear
- [ ] Footer is visible

### User Testing

1. **Internal Testing** (Team/Stakeholders)
   - 3-5 reviewers
   - Focus on brand consistency
   - Gather subjective feedback

2. **Accessibility Testing** (Users with disabilities)
   - Test with users who prefer light mode
   - Test with users with visual impairments
   - Gather feedback on readability

3. **A/B Testing** (Post-launch)
   - Track theme preference usage
   - Monitor engagement metrics by theme
   - Iterate based on data

---

## Accessibility Requirements

### WCAG 2.1 Level AA Compliance

**Contrast Ratios:**
- Normal text (< 18pt): 4.5:1 minimum
- Large text (≥ 18pt or ≥ 14pt bold): 3:1 minimum
- UI components and graphics: 3:1 minimum

**Color Usage:**
- Color is not the only visual means of conveying information
- Interactive elements have visible focus indicators
- Error states use icons + color

**User Control:**
- Theme preference persists across sessions
- System preference is respected by default
- User can override system preference

### Focus Indicators

All interactive elements must have visible focus indicators in both themes:

```tsx
// Example focus styles
className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
```

### Reduced Motion

Respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Success Criteria

### Technical Requirements
- [ ] Theme toggle component works on all pages
- [ ] Theme preference persists in localStorage
- [ ] System theme preference is detected and respected
- [ ] No FOUC (flash of unstyled content) on page load
- [ ] All colors use CSS custom properties
- [ ] No hardcoded color values remain (except intentional design concepts)

### Visual Requirements
- [ ] All text meets contrast requirements
- [ ] Purple brand color is prominent in both themes
- [ ] Gradients work effectively in both themes
- [ ] Shadows enhance depth in both themes
- [ ] Images/screenshots have appropriate framing
- [ ] Loading states are visible in both themes

### User Experience
- [ ] Theme toggle is discoverable
- [ ] Theme change feels instant (< 100ms perceived)
- [ ] No jarring color shifts
- [ ] Hover/focus states are clear
- [ ] CTAs are equally prominent in both themes

### Performance
- [ ] No performance regression from theme switching
- [ ] No additional HTTP requests for theme assets
- [ ] Theme toggle doesn't trigger unnecessary re-renders

---

## Implementation Notes

### Theme Toggle Placement

**Option 1: Navigation Panel (Recommended)**
- Position: Top of navigation panel
- Visibility: Always visible when panel is expanded
- Mobile: In mobile navigation menu

**Option 2: Floating Button**
- Position: Bottom-right corner
- Visibility: Always visible
- Consideration: May conflict with chat button

**Recommendation**: Place in navigation panel header for consistency with other navigation controls

### LocalStorage Key

```typescript
const THEME_STORAGE_KEY = 'michael-evans-portfolio-theme';
// Values: 'light' | 'dark' | 'system'
```

### Theme Provider Configuration

```tsx
<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem={true}
  disableTransitionOnChange={false}
  storageKey="michael-evans-portfolio-theme"
>
  {children}
</ThemeProvider>
```

### Testing Theme Toggle

```tsx
// Test component
import { useTheme } from 'next-themes';

export function ThemeTest() {
  const { theme, setTheme, systemTheme } = useTheme();

  return (
    <div className="p-8 bg-background text-foreground">
      <p>Current theme: {theme}</p>
      <p>System theme: {systemTheme}</p>
      <button onClick={() => setTheme('light')}>Light</button>
      <button onClick={() => setTheme('dark')}>Dark</button>
      <button onClick={() => setTheme('system')}>System</button>
    </div>
  );
}
```

---

## Rollout Strategy

### Phase 1: Internal Testing
- Deploy to staging environment
- Test with team for 1-2 days
- Gather feedback and iterate

### Phase 2: Beta Testing
- Deploy to production with feature flag
- Enable for 5-10% of users
- Monitor analytics and feedback

### Phase 3: Gradual Rollout
- Increase to 25% of users
- Increase to 50% of users
- Increase to 100% of users

### Phase 4: Default Behavior
- Keep "system" as default
- Monitor usage patterns
- Consider making light mode default if data supports it

---

## Future Enhancements

1. **Custom Theme Colors**
   - Allow users to customize accent color
   - Provide preset color schemes

2. **Time-Based Auto-Switching**
   - Automatically switch based on time of day
   - "Sunset mode" with warm colors

3. **Page-Specific Themes**
   - Some pages remain dark (e.g., design concepts)
   - Toggle available but page has preferred theme

4. **High Contrast Mode**
   - Even higher contrast for accessibility
   - Follows system `prefers-contrast` setting

5. **Reading Mode**
   - Optimized for long-form content
   - Sepia tone option
   - Adjustable font size

---

## Questions for Decision

Before implementation begins, clarify:

1. **Default Theme**: Should new users see light mode, dark mode, or system preference?
2. **Toggle Icon**: Sun/Moon icons, or text label "Light/Dark"?
3. **Toggle Animation**: Fade transition, or instant switch?
4. **Mobile Priority**: Should light mode work perfectly on mobile first?
5. **A/B Testing**: Do we want to A/B test the default theme?

---

## Resources

**Tools:**
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Tailwind Dark Mode Docs](https://tailwindcss.com/docs/dark-mode)
- [next-themes](https://github.com/pacocoursey/next-themes)
- [Color Palette Generator](https://uicolors.app/create)

**References:**
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Dark Mode Design Guidelines](https://material.io/design/color/dark-theme.html)
- [Inclusive Design Principles](https://inclusivedesignprinciples.org/)

---

## Conclusion

This plan provides a comprehensive roadmap for implementing light mode while maintaining the site's unique dark aesthetic and brand identity. The phased approach allows for iterative testing and refinement, ensuring a high-quality user experience in both themes.

**Estimated Timeline:** 5-7 working days
**Priority:** Medium (enhances accessibility and user choice)
**Risk Level:** Low (additive change, doesn't affect existing dark mode)

