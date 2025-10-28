# Navigation Layout Refactor Plan

**Date**: October 28, 2025
**Issue**: Navigation panel shows up on ALL pages including Sanity Studio (`/studio`) and admin pages because it's in the root layout
**Goal**: Remove navigation from admin/CMS pages while keeping it on all public pages

## Problem Statement

Currently, the root layout (`/src/app/layout.tsx`) contains:
- `NavigationProvider`
- `NavigationPanel`
- `NavigationMenu`
- `ChatSection`

This means **every route** in the app inherits this navigation, including:
- `/studio` - Sanity Studio CMS (should NOT have navigation)
- `/admin/chat-logs` - Admin pages (already has custom layout, but inherits root navigation first)
- `/test-navigation` - Test page (has minimal layout)

## Solution: Route Groups

Use Next.js 15 **Route Groups** to create separate layout hierarchies:

```
src/app/
├── layout.tsx                    # Root layout (minimal - fonts, providers, Analytics)
├── (public)/                     # Route group for public pages
│   ├── layout.tsx               # Public layout with navigation
│   ├── page.tsx                 # Homepage → /
│   ├── about/
│   │   └── page.tsx            # About → /about
│   ├── ai-projects/
│   │   └── [various]/          # AI projects → /ai-projects/*
│   ├── case-studies/
│   │   └── [slug]/             # Case studies → /case-studies/[slug]
│   ├── design-concepts/
│   │   └── page.tsx            # Design concepts → /design-concepts
│   └── ai-showcase/
│       └── page.tsx            # AI showcase → /ai-showcase
├── (admin)/                      # Route group for admin/CMS pages
│   ├── layout.tsx               # Admin layout (no navigation)
│   ├── studio/
│   │   └── [[...tool]]/
│   │       └── page.tsx        # Sanity Studio → /studio
│   ├── admin/
│   │   └── chat-logs/
│   │       ├── layout.tsx      # Keep existing password protection
│   │       └── page.tsx        # Chat logs → /admin/chat-logs
│   └── test-navigation/
│       └── page.tsx            # Test page → /test-navigation
└── api/                         # API routes (unchanged)
```

### How Route Groups Work

- Route groups use `(name)` syntax and **don't affect the URL path**
- Each route group can have its own layout
- Pages inside `(public)` still appear at root URLs like `/about`, `/ai-projects`, etc.
- Pages inside `(admin)` still appear at `/studio`, `/admin/chat-logs`, etc.

## Implementation Steps

### Phase 1: Create Route Groups and Layouts

**1.1 Create `(public)` route group layout**

File: `/src/app/(public)/layout.tsx`

```typescript
import { NavigationProvider } from "@/contexts/NavigationContext";
import { NavigationPanel, NavigationMenu, ChatSection } from "@/components/navigation";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NavigationProvider>
      <div className="flex h-screen w-screen bg-neutral-950 overflow-hidden">
        {/* Main Content Area */}
        <main
          id="main-content"
          className="flex-1 h-full overflow-y-auto transition-all duration-300 pb-[200px] md:pb-0 hide-scrollbar"
        >
          {children}
        </main>

        {/* Navigation Panel */}
        <NavigationPanel>
          <div className="flex-1 flex flex-col bg-neutral-900 relative">
            <NavigationMenu />
            <ChatSection />
          </div>
        </NavigationPanel>
      </div>
    </NavigationProvider>
  );
}
```

**1.2 Create `(admin)` route group layout**

File: `/src/app/(admin)/layout.tsx`

```typescript
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Simple passthrough - no navigation
  return (
    <div className="min-h-screen bg-neutral-950">
      {children}
    </div>
  );
}
```

**1.3 Update root layout**

File: `/src/app/layout.tsx`

Remove navigation components, keep only:
- Font configuration
- QueryProvider
- Toaster components
- Analytics
- Skip to main content link

### Phase 2: Move Pages into Route Groups

**2.1 Move public pages to `(public)` group**

Move these directories/files into `/src/app/(public)/`:
- `page.tsx` (homepage)
- `about/`
- `ai-projects/`
- `case-studies/`
- `design-concepts/`
- `ai-showcase/`

**2.2 Move admin pages to `(admin)` group**

Move these directories/files into `/src/app/(admin)/`:
- `studio/`
- `admin/`
- `test-navigation/`

**2.3 Keep existing nested layouts**

Preserve these layouts as-is (they'll continue to work):
- `/src/app/(admin)/admin/chat-logs/layout.tsx` - Password protection
- `/src/app/(admin)/test-navigation/layout.tsx` - Minimal layout

### Phase 3: Update Imports and References

**3.1 Check for absolute paths**

Search for any imports or references that might break:
```bash
grep -r "from '@/app/" src/
grep -r "import.*app/" src/
```

**3.2 Update any broken imports**

Most imports should work fine since they use `@/` alias, but check:
- Component imports
- Type imports
- Page references

### Phase 4: Testing

**4.1 Test public pages (WITH navigation)**
- [ ] `/` - Homepage
- [ ] `/about` - About page
- [ ] `/ai-projects/post-pal` - AI project page
- [ ] `/case-studies/[slug]` - Case study dynamic route
- [ ] `/design-concepts` - Design concepts
- [ ] `/ai-showcase` - AI showcase

**4.2 Test admin pages (WITHOUT navigation)**
- [ ] `/studio` - Sanity Studio (should load without navigation)
- [ ] `/admin/chat-logs` - Chat logs (password protected, no navigation)
- [ ] `/test-navigation` - Test page (no navigation)

**4.3 Test functionality**
- [ ] Navigation panel opens/closes correctly
- [ ] Chat section works
- [ ] Mobile navigation works
- [ ] All links navigate correctly
- [ ] No console errors

## Migration Checklist

- [ ] **Phase 1**: Create route group layouts
  - [ ] Create `/src/app/(public)/layout.tsx` with navigation
  - [ ] Create `/src/app/(admin)/layout.tsx` without navigation
  - [ ] Update `/src/app/layout.tsx` to remove navigation

- [ ] **Phase 2**: Move pages
  - [ ] Move public pages to `(public)` group
  - [ ] Move admin pages to `(admin)` group
  - [ ] Verify nested layouts preserved

- [ ] **Phase 3**: Update references
  - [ ] Search for broken imports
  - [ ] Fix any path issues

- [ ] **Phase 4**: Test thoroughly
  - [ ] Test all public pages
  - [ ] Test all admin pages
  - [ ] Test navigation functionality
  - [ ] Test mobile/desktop responsive

## Benefits of This Approach

1. **Clean Architecture**: Clear separation between public and admin sections
2. **Maintainable**: Easy to add new pages to either group
3. **No Conditional Logic**: No need for pathname checking or conditional rendering
4. **Follows Next.js Patterns**: Uses official Next.js route groups feature
5. **Scalable**: Easy to add more route groups in the future (e.g., `(marketing)`, `(dashboard)`)
6. **Type-Safe**: No runtime errors, just move files
7. **Zero URL Changes**: URLs remain exactly the same

## Rollback Plan

If issues arise, rollback is simple:
1. Move all pages back to `/src/app/` root
2. Restore original root layout with navigation
3. Delete route group directories

## Future Enhancements

Once this is working, consider:
- [ ] Create `(marketing)` route group for landing pages
- [ ] Add different metadata per route group
- [ ] Customize fonts or themes per route group
- [ ] Add route-specific providers

## Notes

- Route groups **do not affect URLs** - they're purely organizational
- Each route group can have completely different layouts
- Nested layouts within route groups continue to work
- API routes (`/api`) are unaffected by this change
