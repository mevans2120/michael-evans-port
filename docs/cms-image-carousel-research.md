# CMS-Driven Image Carousel Research & Implementation Assessment

**Created:** 2025-11-17  
**Status:** Research Complete  
**Purpose:** Evaluate approaches for implementing a CMS-driven image carousel with lightbox functionality

---

## Executive Summary

This document assesses three viable approaches for implementing a CMS-driven image carousel component that supports 2-6 images, with click-to-expand lightbox functionality. After analyzing the existing codebase, available libraries, and best practices, **Approach 3 (shadcn/ui Carousel + Dialog)** is recommended as the simplest solution that meets all requirements while maintaining consistency with the existing design system.

---

## 1. Current State Analysis

### 1.1 Existing Sanity Schema Support

**Good News:** The Sanity CMS already has partial support for image collections:

**In `/sanity/schemas/project.ts`:**
- ✅ `imageGrid` object type (lines 481-528) - supports 2-6 images with captions
- ✅ `portraitImageList` object type (lines 530-578) - supports 1-10 portrait images
- Both are used in the `article` field (portable text array)

**In `/sanity/schemas/blog.ts`:**
- ✅ Same `imageGrid` and `portraitImageList` types (lines 137-235)

**Current Schema Structure:**
```typescript
{
  type: 'object',
  name: 'imageGrid',
  fields: [
    {
      name: 'images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', type: 'string', validation: required },
            { name: 'caption', type: 'string' }
          ]
        }
      ],
      validation: min(2).max(6)
    }
  ]
}
```

**Image Handling Patterns:**
- Uses `@sanity/image-url` for URL generation
- Helper function: `urlFor(source)` from `/src/sanity/lib/client.ts`
- Standard pattern: `urlFor(image).url()`

### 1.2 Existing UI Components

**Available shadcn/ui Components:**
- ✅ **Carousel** (`/src/components/ui/carousel.tsx`) - Embla Carousel wrapper with:
  - Horizontal/vertical orientation
  - Keyboard navigation (arrow keys)
  - Previous/Next buttons
  - Accessible ARIA labels
  - Touch/swipe support via Embla
  
- ✅ **Dialog** (`/src/components/ui/dialog.tsx`) - Radix UI Dialog with:
  - Automatic focus trapping
  - ESC key to close
  - Backdrop overlay
  - Accessible ARIA roles
  - Built-in animations

**Existing Image Components:**
- `/src/components/case-study-flowing/ImageGrid.tsx` - 2-column grid display
- `/src/components/case-study-flowing/PortraitImageList.tsx` - Horizontal scrolling carousel
- Both use standard `<img>` tags (not Next.js `Image`)

### 1.3 Installed Dependencies

**Already Available:**
- ✅ `embla-carousel-react@8.6.0` - carousel library
- ✅ `@radix-ui/react-dialog@1.1.15` - dialog/modal primitive
- ✅ `@sanity/image-url@1.2.0` - Sanity image URL builder
- ✅ `lucide-react@0.462.0` - icons (arrows, X button)
- ✅ `framer-motion@12.23.24` - animations (if needed)

**NOT Installed:**
- ❌ `yet-another-react-lightbox` - would need to install
- ❌ `react-image-lightbox` - would need to install

### 1.4 Design System Patterns

**CSS/Styling Guidelines (from `/CLAUDE.md`):**
- Use Tailwind CSS exclusively
- Semantic color tokens (e.g., `bg-accent`, `text-foreground`)
- Dark mode variants required on colored elements
- Semantic transition durations (`transition-smooth`, `duration-fast`)
- Utility classes from `/src/app/globals.css`
- Mobile-first responsive approach

**Available Utility Classes:**
- `.transition-smooth`, `.transition-fast`, `.transition-slow`
- `.interactive-scale`, `.interactive-opacity`
- `.flex-center`, `.flex-between`, `.absolute-center`
- `.card-base`, `.card-interactive`, `.card-elevated`
- `.focus-outline`

**Responsive Hooks:**
- `useMediaQuery(query)` - custom media query hook
- `useIsDesktop()` - checks for >= 1024px (lg breakpoint)

---

## 2. Requirements Analysis

### 2.1 Functional Requirements

**Core Functionality:**
- Support exactly 2, 4, or 6 images (defined in Sanity CMS)
- Click/tap image to open overlay/lightbox
- Lightbox shows clicked image initially
- Back/forward navigation between images
- Close button to exit overlay
- Keyboard navigation (arrows, ESC)

**Content Management:**
- Images managed in Sanity CMS
- Support for alt text (accessibility)
- Optional captions per image
- Standard Sanity image hotspot support

### 2.2 Technical Requirements

**Performance:**
- Lazy loading for images not immediately visible
- Image optimization (Sanity CDN handles this)
- Smooth animations respecting `prefers-reduced-motion`

**Accessibility:**
- WCAG 2.1 Level AA compliance
- Keyboard navigation (arrow keys, ESC, Tab, Enter)
- Focus management (trap focus in lightbox)
- Screen reader support (ARIA labels, roles, live regions)
- Descriptive alt text for all images

**Mobile/Touch:**
- Touch/swipe gestures for navigation
- Responsive sizing
- Mobile-optimized controls
- Pinch-to-zoom consideration

**Browser Support:**
- Modern browsers (per `package.json`): >0.3%, not IE11, not dead

---

## 3. Technical Approach Options

### Option 1: Yet Another React Lightbox (External Library)

**Overview:**  
Install `yet-another-react-lightbox` as a specialized lightbox solution.

**Pros:**
- ✅ Built specifically for lightbox/gallery use case
- ✅ Excellent accessibility out of the box
- ✅ Keyboard navigation included
- ✅ Touch/swipe gestures built-in
- ✅ Responsive images with resolution switching
- ✅ Plugin system for extensibility
- ✅ TypeScript support
- ✅ Active maintenance
- ✅ Next.js Image integration support
- ✅ Preloads images intelligently

**Cons:**
- ❌ Requires new dependency (~50KB gzipped)
- ❌ Additional API to learn
- ❌ May include features we don't need
- ❌ Adds another library to maintain/update
- ❌ Different styling patterns than shadcn/ui
- ❌ Potential bundle size impact

**Implementation Complexity:** Medium  
**Estimated Time:** 4-6 hours  
**Bundle Impact:** +50-70KB gzipped

**Code Example:**
```tsx
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"

function ImageCarousel({ images }) {
  const [index, setIndex] = useState(-1)
  
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        {images.map((img, i) => (
          <img 
            key={i}
            src={urlFor(img).url()}
            onClick={() => setIndex(i)}
            className="cursor-pointer"
          />
        ))}
      </div>
      
      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={images.map(img => ({
          src: urlFor(img).url(),
          alt: img.alt,
          title: img.caption
        }))}
      />
    </>
  )
}
```

### Option 2: Embla Carousel Only (Custom Lightbox)

**Overview:**  
Build custom lightbox using only Embla Carousel in fullscreen mode.

**Pros:**
- ✅ Embla already installed (zero new dependencies)
- ✅ Reuses existing carousel expertise
- ✅ Full control over styling/behavior
- ✅ Consistent with existing code patterns
- ✅ Smaller bundle (no lightbox library)

**Cons:**
- ❌ Need to build overlay/backdrop manually
- ❌ Need to implement focus trapping manually
- ❌ Need to handle ESC/keyboard manually
- ❌ More accessibility work required
- ❌ More edge cases to handle
- ❌ Higher maintenance burden
- ❌ Reinventing the wheel

**Implementation Complexity:** High  
**Estimated Time:** 8-12 hours (including testing)  
**Bundle Impact:** Minimal (+5KB custom code)

**Code Example:**
```tsx
function CustomCarouselLightbox({ images }) {
  const [isOpen, setIsOpen] = useState(false)
  const [startIndex, setStartIndex] = useState(0)
  
  // Manual keyboard handling
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false)
      // Arrow key handling
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
  
  // Manual focus trapping
  // Manual body scroll lock
  // etc.
  
  return (
    <>
      {/* Thumbnail grid */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/90">
          <Carousel>{/* Full-size images */}</Carousel>
        </div>
      )}
    </>
  )
}
```

### Option 3: shadcn/ui Carousel + Dialog (RECOMMENDED)

**Overview:**  
Combine existing shadcn/ui Carousel and Dialog components for a native solution.

**Pros:**
- ✅ Zero new dependencies (all components exist)
- ✅ Consistent with existing design system
- ✅ Radix Dialog handles accessibility automatically:
  - Focus trapping
  - ESC to close
  - ARIA roles/labels
  - Body scroll lock
- ✅ Embla Carousel handles navigation:
  - Touch/swipe gestures
  - Keyboard arrows
  - Smooth animations
- ✅ Full styling control via Tailwind
- ✅ Matches existing component patterns
- ✅ Team already familiar with both components
- ✅ Dark mode support built-in

**Cons:**
- ⚠️ Need to wire Dialog + Carousel together (minimal work)
- ⚠️ Need to manage initial slide index state
- ⚠️ Custom styling for fullscreen carousel layout

**Implementation Complexity:** Low-Medium  
**Estimated Time:** 3-4 hours  
**Bundle Impact:** Zero (components already loaded)

**Code Example:**
```tsx
"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { urlFor } from "@/sanity/lib/client"

interface ImageCarouselProps {
  images: Array<{
    asset: any
    alt: string
    caption?: string
  }>
}

export function ImageCarousel({ images }: ImageCarouselProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [startIndex, setStartIndex] = useState(0)

  const handleImageClick = (index: number) => {
    setStartIndex(index)
    setIsOpen(true)
  }

  return (
    <>
      {/* Thumbnail Grid */}
      <div className="grid grid-cols-2 gap-4 my-8">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => handleImageClick(index)}
            className="relative group cursor-pointer focus-outline"
            aria-label={`View ${image.alt} in fullscreen`}
          >
            <img
              src={urlFor(image).width(600).url()}
              alt={image.alt}
              className="w-full h-auto rounded-lg transition-smooth group-hover:opacity-80"
            />
            {image.caption && (
              <p className="text-sm text-muted-foreground mt-2">
                {image.caption}
              </p>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-7xl w-full h-[90vh] p-0">
          <Carousel
            opts={{ startIndex }}
            className="w-full h-full"
          >
            <CarouselContent className="h-full">
              {images.map((image, index) => (
                <CarouselItem key={index} className="flex-center h-full">
                  <img
                    src={urlFor(image).width(2000).url()}
                    alt={image.alt}
                    className="max-w-full max-h-full object-contain"
                  />
                  {image.caption && (
                    <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/70 px-4 py-2 rounded-lg">
                      {image.caption}
                    </p>
                  )}
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </DialogContent>
      </Dialog>
    </>
  )
}
```

---

## 4. Recommended Solution: Approach 3

### 4.1 Why Approach 3?

**SIMPLEST Solution:**
- Uses existing, familiar components
- Zero new dependencies
- Minimal custom code required
- Leverages battle-tested Radix UI accessibility
- Embla Carousel already proven in codebase

**Best Alignment with Project:**
- Matches shadcn/ui design system
- Follows existing patterns (ImageGrid, PortraitImageList)
- Consistent with CSS guidelines in CLAUDE.md
- Team familiarity = faster development & maintenance

**Accessibility Excellence:**
- Radix Dialog: WCAG 2.1 AA compliant out of the box
- Focus trapping, ESC handling, ARIA roles all automatic
- Embla Carousel: keyboard navigation built-in
- Just need to add proper alt text and aria-labels

**Performance:**
- No new bundle weight
- Sanity CDN handles image optimization
- Can add lazy loading easily

### 4.2 Implementation Steps

**Phase 1: Core Component (2 hours)**
1. Create `/src/components/cms/ImageCarousel.tsx`
2. Implement thumbnail grid with click handlers
3. Wire up Dialog + Carousel integration
4. Add basic styling with Tailwind utilities
5. Test with sample data

**Phase 2: Accessibility & UX (1 hour)**
1. Add ARIA labels to all interactive elements
2. Test keyboard navigation (arrows, ESC, Tab, Enter)
3. Test screen reader announcements
4. Add focus-visible styles
5. Test with VoiceOver/NVDA

**Phase 3: Responsive & Mobile (0.5 hours)**
1. Test touch/swipe gestures (Embla handles this)
2. Optimize for mobile viewport sizes
3. Test on iOS Safari and Android Chrome
4. Add responsive image sizing

**Phase 4: Integration & Testing (0.5 hours)**
1. Add TypeScript types for Sanity image structure
2. Update Portable Text renderer to use new component
3. Test with real CMS data
4. Document usage in code comments

**Total Estimated Time:** 4 hours

### 4.3 Accessibility Checklist

**Keyboard Navigation:**
- [x] Arrow keys navigate between images (Embla)
- [x] ESC closes lightbox (Radix Dialog)
- [x] Tab cycles through focusable elements
- [x] Enter/Space activates thumbnail buttons

**Screen Reader Support:**
- [ ] Add `aria-label="Image gallery"` to grid
- [ ] Add `aria-label="View {alt} in fullscreen"` to thumbnails
- [ ] Add `role="dialog"` and `aria-modal="true"` (Radix provides)
- [ ] Add `aria-live="polite"` for slide changes
- [ ] Ensure alt text is descriptive

**Focus Management:**
- [x] Focus trapped in dialog when open (Radix)
- [x] Focus returns to trigger on close (Radix)
- [ ] Add visible focus indicators (`.focus-outline`)
- [ ] Ensure focus order is logical

**Visual:**
- [ ] Sufficient color contrast (4.5:1 minimum)
- [ ] Focus indicators visible in dark mode
- [ ] No information conveyed by color alone

### 4.4 Mobile/Touch Considerations

**Touch Gestures:**
- [x] Swipe left/right to navigate (Embla built-in)
- [x] Tap outside to close (Radix Dialog behavior)
- [x] Pinch-to-zoom support (native browser)

**Responsive Design:**
- Use `max-w-7xl` for lightbox on desktop
- Use `w-full h-[90vh]` for mobile full-screen feel
- Responsive image sizing via Sanity URL builder:
  - Thumbnails: `.width(600)`
  - Lightbox: `.width(2000)`
  
**Mobile-First Breakpoints:**
```tsx
// Thumbnail grid
className="grid grid-cols-2 md:grid-cols-3 gap-4"

// Lightbox controls
<CarouselPrevious className="left-2 md:left-4" />
```

### 4.5 Performance Optimizations

**Image Loading:**
1. Thumbnails: Load at 600px width
2. Lightbox: Load at 2000px width
3. Use Sanity CDN's automatic WebP/AVIF conversion
4. Add `loading="lazy"` to thumbnail images

**Optional Enhancements:**
- Preload adjacent images when lightbox opens
- Add blur placeholder using Sanity LQIP
- Debounce rapid navigation clicks

**Code Example:**
```tsx
// Thumbnail with lazy loading
<img
  src={urlFor(image).width(600).auto('format').url()}
  alt={image.alt}
  loading="lazy"
  className="..."
/>

// Lightbox with higher resolution
<img
  src={urlFor(image).width(2000).auto('format').url()}
  alt={image.alt}
  className="..."
/>
```

---

## 5. Sanity CMS Integration

### 5.1 Use Existing Schema

**No Changes Needed!** The `imageGrid` schema already supports our use case:

```typescript
// In /sanity/schemas/project.ts (line 481)
{
  type: 'object',
  name: 'imageGrid',
  title: 'Image Grid',
  description: '2-column grid for 2-6 images with captions',
  fields: [
    {
      name: 'images',
      type: 'array',
      title: 'Images',
      description: 'Add 2-6 images for the grid',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alt Text',
              validation: (Rule) => Rule.required()
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption'
            }
          ]
        }
      ],
      validation: (Rule) => Rule.min(2).max(6).required()
    }
  ]
}
```

**How it's used:**
1. Content editors add `imageGrid` block in article content
2. Upload 2-6 images with alt text and captions
3. Component automatically renders as clickable carousel

### 5.2 Optional: New Schema for Specific Use Case

If you want a carousel-specific schema (distinct from grid display):

```typescript
// Add to /sanity/schemas/project.ts in article array
{
  type: 'object',
  name: 'imageCarousel',
  title: 'Image Carousel with Lightbox',
  description: 'Interactive carousel with click-to-expand lightbox (2, 4, or 6 images)',
  fields: [
    {
      name: 'images',
      type: 'array',
      title: 'Images',
      description: 'Add exactly 2, 4, or 6 images',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alt Text',
              description: 'Describe the image for accessibility',
              validation: (Rule) => Rule.required()
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
              description: 'Optional caption shown below image'
            }
          ]
        }
      ],
      validation: (Rule) => Rule.custom((images: any[]) => {
        if (!images) return true
        const count = images.length
        if ([2, 4, 6].includes(count)) return true
        return 'Must have exactly 2, 4, or 6 images'
      })
    }
  ],
  preview: {
    select: {
      images: 'images'
    },
    prepare({ images }: any) {
      return {
        title: 'Image Carousel',
        subtitle: `${images?.length || 0} images`
      }
    }
  }
}
```

### 5.3 Portable Text Renderer Integration

Update the Portable Text renderer to use new component:

```tsx
// In case study page component
import { PortableText } from '@portabletext/react'
import { ImageCarousel } from '@/components/cms/ImageCarousel'

const portableTextComponents = {
  types: {
    imageGrid: ({ value }: any) => (
      <ImageCarousel images={value.images} />
    ),
    // Or if using new schema:
    imageCarousel: ({ value }: any) => (
      <ImageCarousel images={value.images} />
    ),
  }
}

// Usage
<PortableText 
  value={article} 
  components={portableTextComponents}
/>
```

---

## 6. Comparison Matrix

| Feature | Yet Another Lightbox | Embla Only | Carousel + Dialog ⭐ |
|---------|---------------------|------------|---------------------|
| **New Dependencies** | 1 library (~50KB) | None | None |
| **Implementation Time** | 4-6 hours | 8-12 hours | 3-4 hours |
| **Accessibility** | Excellent (built-in) | Manual work needed | Excellent (Radix) |
| **Keyboard Nav** | ✅ Built-in | ⚠️ Custom | ✅ Built-in |
| **Touch Gestures** | ✅ Built-in | ✅ Built-in | ✅ Built-in (Embla) |
| **Focus Trapping** | ✅ Built-in | ⚠️ Custom | ✅ Built-in (Radix) |
| **Design System** | ⚠️ Custom styles | ✅ Full control | ✅ shadcn/ui native |
| **Maintenance** | External updates | High (custom code) | Low (shadcn/ui) |
| **Bundle Size** | +50-70KB | +5KB | 0KB (existing) |
| **Team Familiarity** | New API | Partial | ✅ Existing patterns |
| **Dark Mode** | ⚠️ Manual | ✅ Full control | ✅ Built-in |
| **Customization** | Plugin system | ✅ Full control | ✅ Full control |

**Winner:** Carousel + Dialog (Approach 3)
- Fastest to implement
- Zero bundle impact
- Best accessibility with least effort
- Matches existing design patterns
- Lowest maintenance burden

---

## 7. Risk Assessment

### Approach 3 Risks (Low Overall Risk)

**Technical Risks:**
- ⚠️ **Low:** Initial slide index synchronization
  - Mitigation: Use Embla's `startIndex` option
- ⚠️ **Low:** Dialog content sizing edge cases
  - Mitigation: Test various image aspect ratios
- ⚠️ **Low:** Mobile viewport height variations
  - Mitigation: Use `dvh` units or fixed `90vh`

**Accessibility Risks:**
- ⚠️ **Low:** Missing ARIA labels
  - Mitigation: Follow accessibility checklist (Section 4.3)
- ⚠️ **Low:** Screen reader announcements for slide changes
  - Mitigation: Add `aria-live` region

**Browser Compatibility:**
- ✅ **None:** All dependencies support target browsers
- ✅ Embla Carousel: Modern browsers
- ✅ Radix Dialog: Modern browsers

**Performance Risks:**
- ⚠️ **Low:** Large images slow loading
  - Mitigation: Use Sanity CDN auto-format, lazy loading
- ⚠️ **Low:** Many images in lightbox
  - Mitigation: Only 2-6 images per carousel (controlled)

---

## 8. Next Steps

### If Proceeding with Approach 3:

**1. Create Component (1 hour)**
- [ ] Create `/src/components/cms/ImageCarousel.tsx`
- [ ] Implement thumbnail grid
- [ ] Wire Dialog + Carousel
- [ ] Add TypeScript types

**2. Accessibility (1 hour)**
- [ ] Add all ARIA labels
- [ ] Test keyboard navigation
- [ ] Test with screen reader
- [ ] Add focus styles

**3. Responsive (0.5 hours)**
- [ ] Mobile breakpoints
- [ ] Touch gesture testing
- [ ] Responsive images

**4. Integration (0.5 hours)**
- [ ] Update Portable Text renderer
- [ ] Test with Sanity data
- [ ] Add usage documentation

**5. Testing (1 hour)**
- [ ] Cross-browser testing
- [ ] Accessibility audit (axe, WAVE)
- [ ] Mobile device testing
- [ ] Edge cases (1 image, aspect ratios)

**Total:** 4 hours to production-ready component

---

## 9. Alternative Considerations

### When to Consider Yet Another Lightbox (Option 1):

**If you need:**
- Video support in lightbox
- Zoom/pan functionality
- Full-screen mode (not just dialog)
- Complex gallery features (thumbnails strip, etc.)
- Plugin ecosystem (captions, counter, etc.)

**Current requirements don't justify this.** We only need basic image viewing with navigation.

### When to Consider Custom Embla Solution (Option 2):

**If you need:**
- Highly specialized interaction patterns
- Non-standard carousel behavior
- Very specific performance optimizations
- Complete control over every pixel/interaction

**Current requirements don't justify this.** Standard carousel + dialog covers all needs.

---

## 10. Resources

### Documentation Links:
- [Embla Carousel React Docs](https://www.embla-carousel.com/get-started/react/)
- [Radix UI Dialog Docs](https://www.radix-ui.com/primitives/docs/components/dialog)
- [shadcn/ui Carousel](https://ui.shadcn.com/docs/components/carousel)
- [shadcn/ui Dialog](https://ui.shadcn.com/docs/components/dialog)
- [Sanity Image URL Builder](https://www.sanity.io/docs/image-url)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### Code References:
- Existing carousel usage: `/src/components/case-study-flowing/PortraitImageList.tsx`
- Image grid pattern: `/src/components/case-study-flowing/ImageGrid.tsx`
- Sanity image helper: `/src/sanity/lib/client.ts`
- Design system utilities: `/src/app/globals.css`

---

## Conclusion

**Recommended Approach:** Option 3 (shadcn/ui Carousel + Dialog)

**Rationale:**
1. **Simplest solution** that meets all requirements
2. **Zero new dependencies** - uses existing shadcn/ui components
3. **Excellent accessibility** - Radix Dialog handles most concerns automatically
4. **Fastest implementation** - 3-4 hours to production
5. **Consistent with design system** - matches existing patterns
6. **Low maintenance** - leverages battle-tested libraries

**Next Action:** Proceed with implementation following the 5-phase plan in Section 8.

---

**Document Version:** 1.0  
**Last Updated:** 2025-11-17  
**Author:** Claude Code Research Assistant
