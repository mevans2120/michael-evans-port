# Animation Quick Reference

**Quick guide for adding animations throughout the portfolio app**

---

## TL;DR

1. **Use Framer Motion** for layout/structural animations
2. **Use Tailwind** for simple hover effects only
3. **Protect static children** with `transition-none`
4. **No mixing** animation systems on same element
5. **Use constants** from `/src/lib/animation-constants.ts`

---

## Decision Tree

```
Need to add animation?
│
├─ Simple hover effect?
│  └─ Use Tailwind: className="transition-colors hover:bg-purple-500"
│
├─ Component mounts/unmounts?
│  └─ Use AnimatePresence + motion.div
│
├─ Size or position changes?
│  └─ Use motion.div with layout prop
│
└─ Complex multi-step?
   └─ Use Framer Motion variants + orchestration
```

---

## Common Patterns

### Pattern 1: Expanding Container

```tsx
import { motion } from 'framer-motion';
import { LAYOUT_TRANSITION } from '@/lib/animation-constants';

<motion.div
  layout
  animate={{
    height: isExpanded ? '100%' : '34%',
  }}
  transition={LAYOUT_TRANSITION}
>
  <div className="transition-none">
    {/* Static content - won't animate */}
  </div>
</motion.div>
```

### Pattern 2: Modal/Overlay

```tsx
import { motion, AnimatePresence } from 'framer-motion';
import { PRESENCE_TRANSITION } from '@/lib/animation-constants';

<AnimatePresence>
  {isOpen && (
    <motion.div
      key="modal"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={PRESENCE_TRANSITION}
    >
      <ModalContent />
    </motion.div>
  )}
</AnimatePresence>
```

### Pattern 3: Staggered List

```tsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

<motion.ul variants={container} initial="hidden" animate="show">
  {items.map((item) => (
    <motion.li key={item.id} variants={item}>
      {item.content}
    </motion.li>
  ))}
</motion.ul>
```

### Pattern 4: Sequential Animations

```tsx
<motion.div
  animate={{ height: 0 }}
  onAnimationComplete={() => {
    // Run next animation
    setNextState(true);
  }}
/>
```

### Pattern 5: Simple Hover (Tailwind)

```tsx
<button className="transition-colors hover:bg-purple-500">
  Click me
</button>
```

---

## Do's and Don'ts

### DO

```tsx
// ✅ Use Framer Motion for layout
<motion.div layout animate={{ height: '100%' }}>

// ✅ Protect static children
<div className="transition-none">
  <input />
</div>

// ✅ Use animation constants
import { LAYOUT_TRANSITION } from '@/lib/animation-constants';
<motion.div transition={LAYOUT_TRANSITION}>

// ✅ Use callbacks for sequencing
<motion.div onAnimationComplete={() => setNext(true)}>

// ✅ Disable initial animation
<motion.div initial={false}>
```

### DON'T

```tsx
// ❌ Don't mix animation systems
<motion.div className="transition-all">

// ❌ Don't use transition-all on parents
<div className="transition-all">
  <input /> {/* Will animate! */}
</div>

// ❌ Don't use setTimeout for sequencing
setTimeout(() => setNext(true), 300);

// ❌ Don't animate layout without layout prop
<motion.div animate={{ height: '100%' }}> {/* Missing layout */}

// ❌ Don't use inline style transitions
<div style={{ transition: 'all 0.3s' }}>
```

---

## Animation Constants Reference

**File:** `/src/lib/animation-constants.ts`

```tsx
// Duration
ANIMATION_DURATION.fast    // 0.15s - Quick interactions
ANIMATION_DURATION.normal  // 0.3s  - Standard (default)
ANIMATION_DURATION.slow    // 0.5s  - Dramatic

// Easing
ANIMATION_EASING.easeInOut // [0.4, 0, 0.2, 1] - Standard
ANIMATION_EASING.easeOut   // [0, 0, 0.2, 1]   - Entering
ANIMATION_EASING.easeIn    // [0.4, 0, 1, 1]   - Exiting

// Presets
LAYOUT_TRANSITION     // For panels/containers
PRESENCE_TRANSITION   // For modals/tooltips
```

**Usage:**
```tsx
import { LAYOUT_TRANSITION } from '@/lib/animation-constants';

<motion.div transition={LAYOUT_TRANSITION}>
```

---

## Checklist Before Committing Animation Code

- [ ] Using Framer Motion (not CSS transitions) for layout
- [ ] Static children have `transition-none`
- [ ] Using animation constants, not magic numbers
- [ ] No setTimeout for sequencing
- [ ] No `transition-all` on parent containers
- [ ] `initial={false}` if animation on mount not desired
- [ ] Tested rapid open/close cycles
- [ ] No visual "jumps" or glitches
- [ ] Input fields remain static

---

## Performance Tips

**Fast (GPU-accelerated):**
- `transform: translate()`
- `transform: scale()`
- `opacity`

**Slow (triggers layout):**
- `width`, `height`
- `padding`, `margin`

**Solution:** Use `layout` prop when animating size
```tsx
<motion.div layout animate={{ height: '100%' }}>
```

This uses FLIP technique internally = fast!

---

## Debugging Animation Issues

### Input animates when it shouldn't
```tsx
// Add to input
className="transition-none"
style={{ transition: 'none' }}
```

### Animation feels janky
```tsx
// Ensure layout prop present
<motion.div layout>

// Check DevTools Performance tab
// Look for long frames (>16ms)
```

### Animations out of sync
```tsx
// Replace delays with callbacks
onAnimationComplete={() => setNext(true)}
```

### Animation jumps on page load
```tsx
// Disable initial animation
<motion.div initial={false}>
```

---

## Need Help?

1. Check [Animation Strategy Doc](/docs/architecture/animation-strategy.md)
2. Check [Implementation Guide](/docs/architecture/animation-implementation-guide.md)
3. Review existing working examples in codebase
4. Test with DevTools Performance tab

---

**Version:** 1.0
**Updated:** 2025-10-29
