# Navigation Implementation Plan

## Overview

This document outlines the detailed plan for implementing the new collapsible navigation system from the prototype (`/public/test-nav.html`) into the production Next.js portfolio site.

## Current State

### Prototype Location
- **File**: `/public/test-nav.html`
- **Technology**: Standalone HTML with React via CDN, Tailwind CSS via CDN
- **Status**: Fully functional with desktop and mobile responsive behavior

### Production Site
- **Framework**: Next.js with React Router
- **Main Files**:
  - `/src/App.tsx` - Routing configuration
  - `/src/pages/` - Individual page components
- **Technology Stack**: React 18.3, TypeScript 5.8, Tailwind CSS 3.4, Sanity CMS

## Requirements

### 1. Navigation System

#### Desktop Behavior
- Right-side collapsible panel with purple border (`border-purple-500`)
- Two states:
  - **Expanded**: 420px width with navigation text and chat section
  - **Collapsed**: 80px width with icon-only navigation
- Close button at top of navigation (animated chevron)
- Navigation section: 66% height
- Chat section: 34% height
- Chat can expand to full height when engaged

#### Mobile Behavior
- Bottom navigation bar fixed at screen bottom
- Icon-only navigation items in horizontal layout
- Navigation items: Home, About, Case Studies, AI Showcase
- Chat section below navigation:
  - **Collapsed**: Shows only AI Assistant header
  - **Expanded**: Grows to 33vh (1/3 viewport height) when clicked
- No Close button on mobile

### 2. New Pages Required

#### Case Studies Landing Page
- **Route**: `/case-studies`
- **Purpose**: Overview/index of all case studies
- **Current State**: Only individual case study pages exist
- **Required Content**:
  - Grid or list of case study cards
  - Filtering/sorting capabilities
  - Integration with Sanity CMS to fetch all projects

#### AI Showcase Landing Page
- **Route**: `/ai-showcase`
- **Purpose**: Landing page for AI projects showcase
- **Current State**: May need verification if it exists
- **Required Content**:
  - Overview of AI projects
  - Interactive demonstrations
  - Integration with Sanity CMS

### 3. Hero Section Redesign

#### Remove
- Rotating sentence component from current homepage
- Current hero layout with rotating text

#### Implement
- Make the "Creative Technologist" section (currently second component) the new primary hero
- Move rotating sentences into AI chat as suggested prompts
- Suggested prompts should be clickable actions in the chat window

#### Chat Prompts to Implement
Convert these rotating sentences into chat prompts:
- "shipped the first responsive airline website"
- Other rotating sentences from current implementation
- Make them clickable to auto-populate chat input

## Implementation Plan

### Phase 1: Setup and Foundation (Est. 1-2 hours)

#### Task 1.1: Create Navigation Context
**File**: `/src/contexts/NavigationContext.tsx`

```typescript
import { createContext, useContext, useState, ReactNode } from 'react';

interface NavigationContextType {
  panelState: 'collapsed' | 'partial' | 'expanded';
  setPanelState: (state: 'collapsed' | 'partial' | 'expanded') => void;
  chatExpanded: boolean;
  setChatExpanded: (expanded: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [panelState, setPanelState] = useState<'collapsed' | 'partial' | 'expanded'>('expanded');
  const [chatExpanded, setChatExpanded] = useState(false);

  return (
    <NavigationContext.Provider value={{ panelState, setPanelState, chatExpanded, setChatExpanded }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
}
```

**Rationale**: Context API for state management ensures navigation state persists across route changes.

#### Task 1.2: Create useMediaQuery Hook
**File**: `/src/hooks/useMediaQuery.ts`

```typescript
import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}
```

**Rationale**: Reactive media query hook for responsive behavior in React.

### Phase 2: Component Development (Est. 2-3 hours)

#### Task 2.1: Create Navigation Panel Component
**File**: `/src/components/navigation/NavigationPanel.tsx`

**Features**:
- Responsive container (right-side desktop, bottom mobile)
- Dynamic width/height based on state
- Purple border styling
- Click-to-expand on partial state

**Props**:
```typescript
interface NavigationPanelProps {
  children: ReactNode;
}
```

#### Task 2.2: Create Navigation Menu Component
**File**: `/src/components/navigation/NavigationMenu.tsx`

**Features**:
- Navigation items with icons and conditional text
- Close button (desktop only)
- Horizontal layout on mobile, vertical on desktop
- Active route highlighting

**Items**:
- Close (desktop only, animated chevron)
- Home (`/`)
- About (`/about`)
- Case Studies (`/case-studies`)
- AI Showcase (`/ai-showcase`)

#### Task 2.3: Create Chat Section Component
**File**: `/src/components/navigation/ChatSection.tsx`

**Features**:
- Collapsible chat interface
- Suggested prompts from rotating sentences
- Message history display
- Input field with send button
- Responsive height behavior

**Subcomponents**:
- `ChatHeader` - AI Assistant header with icon
- `ChatMessages` - Message display area
- `ChatInput` - Input field and send button
- `SuggestedPrompts` - Clickable prompt chips

#### Task 2.4: Create Suggested Prompts Component
**File**: `/src/components/navigation/SuggestedPrompts.tsx`

**Features**:
- Display rotating sentence content as prompts
- Clickable to populate chat input
- Smooth animations
- Mobile-friendly sizing

**Example Prompts**:
```typescript
const prompts = [
  "Tell me about the first responsive airline website",
  "Show me creative technology projects",
  "What AI/ML projects have you worked on?",
  "Explain your approach to design systems"
];
```

### Phase 3: Layout Integration (Est. 1 hour)

#### Task 3.1: Update Root Layout
**File**: `/src/App.tsx` or main layout file

**Changes**:
- Wrap with `NavigationProvider`
- Add `NavigationPanel` component
- Adjust main content area to account for navigation
- Add dynamic width calculation for content area

**Layout Structure**:
```tsx
<NavigationProvider>
  <div className="flex h-screen">
    {/* Main Content - Dynamic width based on panel state */}
    <main className="flex-1 transition-all duration-300">
      {/* Routes */}
    </main>

    {/* Navigation Panel - Right side desktop, bottom mobile */}
    <NavigationPanel>
      <NavigationMenu />
      <ChatSection />
    </NavigationPanel>
  </div>
</NavigationProvider>
```

#### Task 3.2: Update Top Bar
**File**: Component that contains logo/branding

**Changes**:
- Dynamic width based on navigation state
- Ensure proper spacing and alignment
- Maintain backdrop blur effect

### Phase 4: Hero Section Redesign (Est. 1 hour)

#### Task 4.1: Update Homepage
**File**: `/src/pages/Home.tsx` or homepage component

**Changes**:
1. Remove rotating sentence component
2. Move "Creative Technologist" section to primary hero position
3. Adjust spacing and layout
4. Extract rotating sentences for chat prompts

**Before**:
```
- Hero with rotating sentences
- Creative Technologist section
- Other sections
```

**After**:
```
- Creative Technologist hero (promoted)
- Other sections
```

#### Task 4.2: Integrate Prompts into Chat
**File**: `/src/components/navigation/ChatSection.tsx`

**Implementation**:
- Display suggested prompts when chat is empty
- Hide prompts after first message
- Make prompts clickable to populate input

### Phase 5: New Pages (Est. 1-2 hours)

#### Task 5.1: Create Case Studies Landing Page
**File**: `/src/pages/CaseStudies.tsx`

**Features**:
- Grid layout of case study cards
- Fetches all projects from Sanity CMS
- Filtering by category/technology
- Responsive design
- Links to individual case studies

**Sanity Query**:
```typescript
const query = `*[_type == "project"] | order(orderRank) {
  _id,
  title,
  slug,
  description,
  mainImage,
  tags,
  featured
}`;
```

**Layout**:
- Hero section with title "Case Studies"
- Filter bar (optional)
- Grid of cards (3 columns desktop, 1-2 mobile)
- Card content: Image, title, description, tags

#### Task 5.2: Create/Verify AI Showcase Landing Page
**File**: `/src/pages/AIShowcase.tsx`

**Action**:
1. Check if page exists
2. If not, create new page
3. Ensure route is configured in `App.tsx`

**Features**:
- Overview of AI/ML projects
- Interactive demos or previews
- Integration with Sanity CMS
- Responsive layout

#### Task 5.3: Update Routing
**File**: `/src/App.tsx`

**Ensure routes**:
```typescript
<Route path="/" element={<Home />} />
<Route path="/about" element={<About />} />
<Route path="/case-studies" element={<CaseStudies />} />
<Route path="/case-studies/:slug" element={<CaseStudyDetail />} />
<Route path="/ai-showcase" element={<AIShowcase />} />
<Route path="*" element={<NotFound />} />
```

### Phase 6: Styling and Polish (Est. 1 hour)

#### Task 6.1: Ensure Consistent Styling
**Files**: All navigation components

**Checklist**:
- [ ] Purple border (`border-purple-500`) on navigation panel
- [ ] Smooth transitions (300ms duration)
- [ ] Consistent padding and spacing
- [ ] Icon sizes (w-4 h-4 for nav, adjust as needed)
- [ ] Text sizing (text-lg for navigation items)
- [ ] Hover states (hover:bg-neutral-800, hover:text-white)
- [ ] Active route highlighting

#### Task 6.2: Animation Refinement
**Files**: Navigation components

**Animations**:
- Panel width transition (300ms ease-out)
- Chevron rotation (180deg on collapse)
- Chat height expansion (mobile)
- Smooth scroll in chat messages
- Prompt hover effects

#### Task 6.3: Mobile Optimization
**Files**: All navigation components

**Mobile-specific**:
- Touch-friendly tap targets (min 44x44px)
- Proper z-index stacking
- No horizontal overflow
- Smooth scroll behavior
- Keyboard accessibility

### Phase 7: Testing and Refinement (Est. 30min - 1 hour)

#### Task 7.1: Cross-browser Testing
**Browsers**: Chrome, Firefox, Safari, Edge

**Test**:
- [ ] Navigation panel collapse/expand
- [ ] Chat expansion on mobile
- [ ] Route navigation
- [ ] Suggested prompts functionality
- [ ] Responsive breakpoints
- [ ] Transitions and animations

#### Task 7.2: Responsive Testing
**Breakpoints**: 320px, 375px, 768px, 1024px, 1440px

**Test**:
- [ ] Mobile bottom navigation
- [ ] Tablet behavior
- [ ] Desktop collapsible panel
- [ ] Chat section responsiveness
- [ ] Content area width adjustment

#### Task 7.3: Accessibility Testing
**Tools**: Axe DevTools, Lighthouse

**Checklist**:
- [ ] Keyboard navigation
- [ ] Screen reader compatibility
- [ ] Focus indicators
- [ ] ARIA labels
- [ ] Color contrast (WCAG AA)
- [ ] Touch target sizes

## Component Architecture

### File Structure
```
src/
├── components/
│   └── navigation/
│       ├── NavigationPanel.tsx       # Container component
│       ├── NavigationMenu.tsx        # Navigation items
│       ├── ChatSection.tsx           # Chat interface
│       ├── ChatHeader.tsx            # Chat header
│       ├── ChatMessages.tsx          # Message display
│       ├── ChatInput.tsx             # Input field
│       └── SuggestedPrompts.tsx      # Prompt chips
├── contexts/
│   └── NavigationContext.tsx         # State management
├── hooks/
│   └── useMediaQuery.ts              # Media query hook
└── pages/
    ├── Home.tsx                      # Updated hero
    ├── CaseStudies.tsx               # New landing page
    └── AIShowcase.tsx                # Verify/create
```

### State Management

#### Navigation Context State
```typescript
{
  panelState: 'collapsed' | 'partial' | 'expanded',
  setPanelState: (state) => void,
  chatExpanded: boolean,
  setChatExpanded: (expanded: boolean) => void
}
```

#### Component State
- **NavigationPanel**: Handles window resize listener
- **ChatSection**: Local message history state
- **SuggestedPrompts**: Prompt selection state

### Props Flow
```
NavigationProvider
  └── NavigationPanel
      ├── NavigationMenu (uses navigation context)
      └── ChatSection (uses navigation context)
          ├── ChatHeader
          ├── SuggestedPrompts
          ├── ChatMessages
          └── ChatInput
```

## Technical Considerations

### 1. Prototype to Production Conversion

#### React Syntax
- **Prototype**: Uses `React.createElement()` syntax
- **Production**: Convert to JSX for readability

**Example**:
```javascript
// Prototype
React.createElement('div', { className: 'flex items-center' },
  React.createElement('span', null, 'Home')
)

// Production
<div className="flex items-center">
  <span>Home</span>
</div>
```

#### State Management
- **Prototype**: Local `useState` in single file
- **Production**: Context API for cross-route persistence

#### Media Queries
- **Prototype**: `window.innerWidth >= 768` inline checks
- **Production**: `useMediaQuery` hook for reactive updates

### 2. Routing Integration

#### React Router Considerations
- Navigation state must persist across route changes (Context API)
- Active route highlighting requires `useLocation()` hook
- Ensure navigation doesn't unmount on route changes

#### Layout Wrapper
- Navigation wraps all routes
- Main content area width adjusts based on navigation state
- Proper z-index for mobile bottom navigation

### 3. Responsive Design

#### Breakpoints
- **Mobile**: < 768px
  - Bottom navigation
  - Icon-only menu
  - Collapsible chat (header ↔ 33vh)
- **Desktop**: ≥ 768px
  - Right-side navigation
  - Collapsible (80px ↔ 420px)
  - Chat section (34% ↔ 100%)

#### Dynamic Sizing
```typescript
// Panel width calculation
const getPanelWidth = () => {
  if (!isDesktop) return '100%';
  switch (panelState) {
    case 'partial': return '80px';
    case 'expanded': return '420px';
    default: return '80px';
  }
};

// Main content width
const getContentWidth = () => {
  if (!isDesktop) return '100%';
  const panelWidth = getPanelWidth();
  return `calc(100% - ${panelWidth})`;
};
```

### 4. Performance Optimization

#### Lazy Loading
- Lazy load chat messages
- Lazy load suggested prompts
- Code split new landing pages

#### Memoization
```typescript
// Memoize navigation items
const navigationItems = useMemo(() => [
  { href: '/', label: 'Home', icon: HomeIcon },
  { href: '/about', label: 'About', icon: AboutIcon },
  // ...
], []);

// Memoize panel width calculation
const panelWidth = useMemo(() => getPanelWidth(), [panelState, isDesktop]);
```

#### Transitions
- Use CSS transitions instead of JS animations
- Hardware acceleration with `transform` and `opacity`
- Avoid layout thrashing

### 5. Sanity CMS Integration

#### Case Studies Query
```typescript
// Fetch all case studies for landing page
const query = `*[_type == "project"] | order(orderRank) {
  _id,
  title,
  slug,
  description,
  mainImage {
    asset -> {
      url,
      metadata {
        dimensions
      }
    }
  },
  tags,
  featured,
  orderRank
}`;
```

#### AI Showcase Query
```typescript
// Fetch AI projects (if using Sanity)
const query = `*[_type == "project" && "ai" in tags] | order(orderRank) {
  _id,
  title,
  slug,
  description,
  mainImage,
  tags
}`;
```

## Risk Mitigation

### Risk 1: Navigation State Loss on Route Change
**Risk**: Navigation state resets when user navigates to new page
**Impact**: Poor user experience, inconsistent behavior
**Mitigation**:
- Use Context API at app root level
- Persist state to sessionStorage as backup
- Test navigation across all routes

### Risk 2: Mobile Bottom Navigation Overlap
**Risk**: Bottom navigation overlaps with page content
**Impact**: Content hidden, poor UX
**Mitigation**:
- Add padding-bottom to main content area on mobile
- Calculate exact bottom navigation height
- Test with various content lengths

### Risk 3: Responsive Breakpoint Issues
**Risk**: Behavior glitches at breakpoint transitions
**Impact**: UI inconsistencies, broken layouts
**Mitigation**:
- Use consistent breakpoint (768px) throughout
- Test thoroughly at breakpoint boundaries
- Use `useMediaQuery` hook for reactive updates

### Risk 4: Chat State Confusion
**Risk**: Chat expanded state conflicts between desktop/mobile
**Impact**: Unexpected behavior, state bugs
**Mitigation**:
- Separate chat expansion logic for desktop/mobile
- Reset chat state on breakpoint change
- Clear state management logic

### Risk 5: Performance Degradation
**Risk**: Animations cause jank, especially on mobile
**Impact**: Poor user experience, slow interactions
**Mitigation**:
- Use CSS transitions with hardware acceleration
- Debounce resize handlers
- Lazy load non-critical components

### Risk 6: Existing Routes Breaking
**Risk**: New navigation breaks existing page functionality
**Impact**: Site unusable, major regression
**Mitigation**:
- Test all existing routes after implementation
- Maintain backward compatibility
- Feature flag for rollback capability

## Testing Checklist

### Functional Testing

#### Desktop Navigation
- [ ] Panel collapses from 420px to 80px on Close click
- [ ] Panel expands from 80px to 420px on icon click
- [ ] Chevron rotates 180deg on state change
- [ ] Navigation text shows only when expanded
- [ ] Chat section maintains 34% height when panel collapsed
- [ ] Chat expands to 100% height when engaged
- [ ] All navigation links work correctly
- [ ] Active route is highlighted
- [ ] Main content width adjusts correctly

#### Mobile Navigation
- [ ] Bottom navigation bar displays correctly
- [ ] Navigation items show only icons
- [ ] No navigation text visible
- [ ] Chat header always visible
- [ ] Chat expands to 33vh when clicked
- [ ] Chat collapses on close button click
- [ ] All navigation links work
- [ ] No overlap with page content
- [ ] Touch targets are adequate (≥44px)

#### Chat Functionality
- [ ] Suggested prompts display when chat is empty
- [ ] Prompts populate input when clicked
- [ ] Prompts hide after first message
- [ ] Messages display correctly
- [ ] Input field works
- [ ] Send button triggers message submission
- [ ] Scroll behavior is smooth
- [ ] Chat state persists across routes

#### New Pages
- [ ] Case Studies landing page loads
- [ ] Case studies fetch from Sanity correctly
- [ ] Case study cards display properly
- [ ] Links to individual case studies work
- [ ] AI Showcase landing page loads
- [ ] Content displays correctly
- [ ] All images load

### Responsive Testing

#### Breakpoints
- [ ] 320px (iPhone SE)
- [ ] 375px (iPhone 12/13)
- [ ] 390px (iPhone 14)
- [ ] 768px (iPad portrait)
- [ ] 1024px (iPad landscape)
- [ ] 1440px (Desktop)
- [ ] 1920px (Large desktop)

#### Orientation
- [ ] Portrait mode (mobile)
- [ ] Landscape mode (mobile)

### Browser Compatibility
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Safari iOS
- [ ] Chrome Android

### Accessibility
- [ ] Keyboard navigation works
- [ ] Tab order is logical
- [ ] Focus indicators visible
- [ ] Screen reader announces navigation
- [ ] ARIA labels present
- [ ] Color contrast meets WCAG AA
- [ ] Touch targets ≥44x44px
- [ ] No keyboard traps
- [ ] Skip navigation link (if applicable)

### Performance
- [ ] Lighthouse score >90
- [ ] Smooth 60fps animations
- [ ] No layout shift (CLS <0.1)
- [ ] Fast initial load
- [ ] No memory leaks
- [ ] Efficient re-renders

## Success Metrics

### Functional Success
1. ✅ Navigation collapses/expands smoothly on desktop
2. ✅ Mobile bottom navigation works correctly
3. ✅ Chat section responsive on all devices
4. ✅ All routes navigate correctly
5. ✅ Case Studies landing page functional
6. ✅ AI Showcase landing page functional
7. ✅ Hero section updated successfully
8. ✅ Suggested prompts work in chat
9. ✅ No regressions in existing functionality
10. ✅ State persists across routes

### Quality Metrics
1. ✅ Lighthouse performance score >90
2. ✅ Lighthouse accessibility score 100
3. ✅ Zero console errors
4. ✅ Responsive at all breakpoints
5. ✅ Smooth animations (60fps)

## Rollback Plan

### If Critical Issues Arise

#### Option 1: Feature Flag
- Implement feature flag to toggle new navigation
- Keep old navigation code as fallback
- Allow easy switching without deployment

#### Option 2: Git Revert
- Tag current production state before implementation
- Maintain clean commits for easy reversion
- Test revert process before going live

#### Option 3: Gradual Rollout
- Deploy to staging first
- Test thoroughly before production
- Use beta flag for select users

## Timeline Estimate

| Phase | Tasks | Estimated Time |
|-------|-------|----------------|
| 1. Setup and Foundation | Context, hooks | 1-2 hours |
| 2. Component Development | 4 components | 2-3 hours |
| 3. Layout Integration | App layout, top bar | 1 hour |
| 4. Hero Section Redesign | Homepage updates | 1 hour |
| 5. New Pages | Case Studies, AI Showcase | 1-2 hours |
| 6. Styling and Polish | Refinement | 1 hour |
| 7. Testing and Refinement | QA | 0.5-1 hour |
| **Total** | | **6-8 hours** |

## Next Steps

1. **Review this plan** - Ensure all requirements are captured
2. **Set up development branch** - Create feature branch for implementation
3. **Start with Phase 1** - Foundation and context setup
4. **Incremental implementation** - Complete one phase at a time
5. **Test continuously** - Test after each phase completion
6. **Get feedback** - Review with stakeholders before production
7. **Deploy to staging** - Full testing in staging environment
8. **Production deployment** - Deploy after approval

## Notes

- Keep prototype file (`/public/test-nav.html`) for reference
- Document any deviations from plan
- Update this document with actual implementation details
- Track issues and resolutions
- Maintain communication throughout process

## References

- Prototype: `/public/test-nav.html`
- Current App: `/src/App.tsx`
- Tailwind Docs: https://tailwindcss.com
- React Router: https://reactrouter.com
- Sanity Docs: https://www.sanity.io/docs

---

**Document Version**: 1.0
**Created**: 2025-10-27
**Last Updated**: 2025-10-27
**Status**: Ready for Implementation
