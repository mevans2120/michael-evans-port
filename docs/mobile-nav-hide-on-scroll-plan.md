# Mobile Navigation Hide-on-Scroll Implementation Plan

## Overview

Implement a mobile navigation that:
- Hides when scrolling down
- Reappears when scrolling up
- Works flawlessly with smooth animations
- Handles edge cases (top of page, momentum scrolling, rapid direction changes)

## Current Architecture

### Desktop Panel (Left Side)
- Fixed width navigation panel
- Always visible on desktop
- Contains logo, nav items, AI Assistant
- Located in `/src/components/navigation/DesktopNavigationPanel.tsx`

### Mobile Navigation (Top Bar)
- Fixed top bar with hamburger menu
- Always visible currently
- Located in `/src/components/navigation/MobileNavigation.tsx`
- Height: 64px (80px accounting for safe area)

## Implementation Strategy

### Phase 1: Create Scroll Detection Hook

**File**: `/src/hooks/useScrollDirection.ts`

**Purpose**: Detect scroll direction and position with debouncing for performance

**Features**:
- Track scroll direction (up/down/none)
- Track current scroll position
- Detect if at top of page (within threshold)
- Debounce for performance
- Handle momentum scrolling on iOS
- Clean event listener management

**Return Values**:
```typescript
{
  scrollDirection: 'up' | 'down' | 'none',
  scrollY: number,
  isAtTop: boolean
}
```

**Configuration**:
- Scroll threshold: 10px (minimum scroll before direction change)
- Top threshold: 50px (consider "at top" for UX)
- Debounce: 10ms (balance performance vs responsiveness)

### Phase 2: Update Mobile Navigation Component

**File**: `/src/components/navigation/MobileNavigation.tsx`

**Changes**:

1. **Import and Use Hook**
   ```typescript
   const { scrollDirection, isAtTop } = useScrollDirection()
   ```

2. **Add Visibility State**
   - Show if: scrolling up OR at top of page OR menu is open
   - Hide if: scrolling down AND not at top AND menu is closed

3. **Add CSS Classes**
   - Use existing Tailwind transition utilities
   - Transform: `translate-y-[-100%]` when hidden
   - Maintain `fixed top-0` positioning
   - Add `transition-smooth` for animation

4. **Handle Menu Open State**
   - Navigation should always be visible when menu is open
   - Prevent hiding during menu interactions

### Phase 3: Add Smooth Animations

**Tailwind Classes**:
```typescript
className={cn(
  "fixed top-0 left-0 right-0 z-50",
  "transition-transform duration-normal ease-smooth",
  shouldHide ? "-translate-y-full" : "translate-y-0"
)}
```

**Animation Timing**:
- Duration: 300ms (`duration-normal`)
- Easing: `ease-smooth` (cubic-bezier from design system)
- No delay to feel responsive

### Phase 4: Handle Edge Cases

#### 4.1 Hamburger Menu Open
- **Issue**: Nav shouldn't hide while menu is open
- **Solution**: Add `|| menuOpen` to show condition

#### 4.2 At Top of Page
- **Issue**: Nav flickering when at top
- **Solution**: Always show when `isAtTop === true`

#### 4.3 Rapid Scroll Direction Changes
- **Issue**: Jittery behavior with rapid scrolling
- **Solution**: Use scroll threshold (10px minimum movement)

#### 4.4 iOS Momentum Scrolling
- **Issue**: Scroll events continue after finger lift
- **Solution**: Track `touchstart` and `touchend` events, ignore scroll during momentum

#### 4.5 Page Load/Refresh
- **Issue**: Nav might be hidden initially
- **Solution**: Always show on mount, initial state = visible

#### 4.6 Horizontal Scrolling
- **Issue**: Horizontal scroll shouldn't trigger hide
- **Solution**: Only track `scrollY`, ignore `scrollX`

### Phase 5: Performance Optimization

**Techniques**:

1. **Debounce Scroll Events**
   - Use `requestAnimationFrame` for scroll listener
   - Prevents excessive re-renders

2. **CSS Transform Instead of Position**
   - Use `transform: translateY()` not `top`
   - GPU-accelerated, smoother animation

3. **Memoization**
   - Memoize visibility calculation
   - Prevent unnecessary re-renders of child components

4. **Event Listener Cleanup**
   - Proper cleanup in `useEffect` return
   - Remove listeners on unmount

### Phase 6: Testing Strategy

**Manual Testing**:
- [ ] Scroll down slowly - nav hides smoothly
- [ ] Scroll up slowly - nav shows smoothly
- [ ] Rapid scroll direction changes - no jitter
- [ ] Open hamburger menu while scrolling - nav stays visible
- [ ] Scroll to top - nav always visible at top
- [ ] iOS Safari momentum scrolling - works correctly
- [ ] Quick flick scrolls - smooth behavior
- [ ] Page refresh at various scroll positions - correct initial state

**Devices to Test**:
- iPhone (various models for notch/safe area)
- Android phones (various sizes)
- iPad (if mobile nav shows on tablet breakpoint)

**Browsers**:
- Safari iOS
- Chrome Android
- Chrome iOS
- Firefox iOS/Android

## Implementation Details

### File Structure

```
/src/hooks/useScrollDirection.ts         # NEW - Scroll detection hook
/src/components/navigation/MobileNavigation.tsx  # MODIFIED - Add hide/show logic
```

### Code Organization

**Hook Logic Flow**:
```
1. Initialize state (scrollY, direction, isAtTop)
2. Add scroll event listener with RAF
3. On scroll:
   - Calculate delta from last position
   - Check if delta exceeds threshold
   - Update direction if threshold met
   - Update isAtTop based on position
   - Store current position
4. Cleanup listener on unmount
```

**Component Logic Flow**:
```
1. Get scroll data from hook
2. Get menu open state from context
3. Calculate shouldHide:
   - Hide if: scrolling down AND not at top AND menu closed
   - Show otherwise
4. Apply transform class based on shouldHide
5. Render with transition classes
```

### CSS Classes Needed

All classes already exist in the design system:
- `transition-smooth` - 300ms ease-smooth
- `duration-normal` - 300ms
- `-translate-y-full` - transform: translateY(-100%)
- `translate-y-0` - transform: translateY(0)

No new CSS required.

## Potential Issues & Solutions

### Issue 1: Z-index Conflicts
**Problem**: Nav might go behind other elements when animating
**Solution**: Mobile nav already has `z-50`, verify no conflicts

### Issue 2: Safe Area on iOS
**Problem**: Nav might not fully hide behind notch
**Solution**: Add extra padding-top equal to safe area inset

### Issue 3: Transition Interruption
**Problem**: Starting a new scroll mid-transition feels jarring
**Solution**: Use CSS transitions (not JS animation) so browser handles interruption smoothly

### Issue 4: Chat Widget Interaction
**Problem**: Chat widget might be affected by nav showing/hiding
**Solution**: Chat has independent z-index, should not conflict. Test thoroughly.

### Issue 5: Body Scroll Lock
**Problem**: Menu open with body scroll lock might cause issues
**Solution**: Verify scroll detection still works when menu open and body locked

## Success Criteria

- [ ] Navigation hides smoothly when scrolling down
- [ ] Navigation shows smoothly when scrolling up
- [ ] Always visible at top of page
- [ ] Always visible when menu is open
- [ ] No jitter or flickering
- [ ] Smooth on iOS momentum scrolling
- [ ] Performs well (60fps)
- [ ] No conflicts with chat widget
- [ ] Works across all mobile browsers
- [ ] Accessible (focus management preserved)

## Timeline Estimate

- **Phase 1** (Hook): 30 minutes
- **Phase 2** (Component): 20 minutes
- **Phase 3** (Animations): 10 minutes
- **Phase 4** (Edge Cases): 40 minutes
- **Phase 5** (Performance): 20 minutes
- **Phase 6** (Testing): 60 minutes

**Total**: ~3 hours for implementation and testing

## References

- Existing scroll hook: Check if any scroll detection exists in codebase
- Navigation context: `/src/contexts/NavigationContext.tsx`
- Mobile nav component: `/src/components/navigation/MobileNavigation.tsx`
- Design system transitions: `/src/app/globals.css`

## Notes

- This pattern is commonly used in mobile web design (Twitter, Medium, etc.)
- Must feel native and responsive, not sluggish
- Subtle but noticeable - users should barely think about it
- Always prioritize showing the nav when in doubt (better to show than hide)
