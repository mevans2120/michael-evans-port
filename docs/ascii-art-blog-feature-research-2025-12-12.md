# ASCII Art Blog Feature Research

**Created:** 2025-12-12  
**Status:** Research Complete  
**Purpose:** Document current ASCII art implementation for blog posts and provide recommendations for sustainable management

---

## Executive Summary

The ASCII art feature allows blog posts to display ASCII art instead of featured images. Implemented on 2025-12-12 (commit `7b711ff`), the feature is **CMS-driven**, meaning content editors select ASCII art per post via Sanity Studio. Currently supports one ASCII art option ("filing-cabinet") with responsive sizing and accent color integration.

**Key Findings:**
- ✅ Well-architected: Registry pattern separates art storage from rendering
- ✅ Fully CMS-integrated: No code changes needed to toggle per post
- ✅ Responsive: Different font sizes for mobile/tablet/desktop
- ✅ Design system compliant: Uses `text-accent` token for dynamic theming
- ⚠️ Limited: Only 1 ASCII art option currently available
- ⚠️ Manual registry sync: Adding new art requires updating code in 3 places

---

## Current Implementation

### 1. Sanity Schema Configuration

**File:** `/Users/michaelevans/michael-evans-port-main/sanity/schemas/blog.ts` (lines 428-441)

```typescript
defineField({
  name: 'asciiArt',
  title: 'ASCII Art (Alternative to Image)',
  type: 'string',
  description: 'Display ASCII art instead of featured image. Select "None" to use featured image.',
  options: {
    list: [
      { title: 'None', value: 'none' },
      { title: 'Filing Cabinet', value: 'filing-cabinet' },
    ],
    layout: 'radio',
  },
  initialValue: 'none',
}),
```

**Field Type:** Radio button selection (string)  
**Default Value:** `'none'` (uses featured image by default)  
**Options:** `'none'` | `'filing-cabinet'`

**Schema Location:** After `featuredImage` field (line 410), before `seo` field (line 443)

---

### 2. ASCII Art Registry Component

**File:** `/Users/michaelevans/michael-evans-port-main/src/components/blog/AsciiArt.tsx`

**Architecture Pattern:** Registry-based component that maps string IDs to ASCII art configurations.

```typescript
const ASCII_ART_REGISTRY = {
  'filing-cabinet': {
    art: `   ______________________________
  /                             |
 /                             /|
/_____________________________/ |
|     [______]           (o) |  |
|     [========]             |  |
|----------------------------| /|
|     [______]               |  |
|     [========]             |  |
|----------------------------| /|
|     [______]               |  |
|     [========]             |  |
|____________________________|/
   ███                   ███`,
    label: 'ASCII art illustration of a filing cabinet',
  },
  // Add more ASCII art options here
} as const;

export type AsciiArtType = keyof typeof ASCII_ART_REGISTRY;
```

**Key Features:**
- **Registry Pattern:** Centralized storage for all ASCII art strings
- **Type Safety:** TypeScript type `AsciiArtType` derived from registry keys
- **Accessibility:** Each art has an `aria-label` for screen readers
- **Extensibility:** Comment indicates where to add new art

**Component API:**
```typescript
interface AsciiArtProps {
  type: AsciiArtType;
  className?: string;
}

export function AsciiArt({ type, className }: AsciiArtProps)
```

**Rendering:**
- Uses `<pre>` tag for whitespace preservation
- Applies `text-accent` color token (dynamic coral/purple based on time-of-day)
- Responsive font sizing via className prop
- `role="img"` for semantic HTML
- `select-none` to prevent text selection

**Helper Function:**
```typescript
export function isValidAsciiArtType(type: string | undefined): type is AsciiArtType {
  return !!type && type !== 'none' && type in ASCII_ART_REGISTRY;
}
```

This type guard validates that a CMS value is a valid ASCII art type (excluding 'none').

---

### 3. TypeScript Type Definitions

**File:** `/Users/michaelevans/michael-evans-port-main/src/types/blog.ts`

```typescript
export interface Blog {
  // ... other fields
  asciiArt?: 'none' | 'filing-cabinet';
}

export interface BlogListItem {
  // ... other fields
  asciiArt?: 'none' | 'filing-cabinet';
}
```

**Type Union:** String literal union matches Sanity schema options exactly  
**Optional Field:** Uses `?` since field may not be present on older posts

---

### 4. GROQ Queries

**File:** `/Users/michaelevans/michael-evans-port-main/src/lib/sanity/queries/blog.ts`

ASCII art field is fetched in **all blog queries**:

1. **`allBlogPostsQuery`** (line 21) - Blog listing page
2. **`blogPostBySlugQuery`** (line 71) - Individual blog post
3. **`featuredBlogQuery`** (line 136) - Homepage featured blog

Example:
```groq
*[_type == "blog" && slug.current == $slug][0] {
  // ... other fields
  asciiArt,
  featuredImage {
    // ...
  },
  // ...
}
```

---

### 5. Component Usage

ASCII art is rendered in **3 locations** with different sizing:

#### A. Blog Hero (Individual Post Page)

**File:** `/Users/michaelevans/michael-evans-port-main/src/components/blog/BlogHero.tsx` (lines 76-81)

```tsx
{showAsciiArt ? (
  <div className="flex-shrink-0 w-full md:w-auto flex justify-center md:justify-start">
    <div className="inline-flex items-center justify-center px-20 py-6 rounded-lg bg-card/50 border border-border/50">
      <AsciiArt type={asciiArtType} className="text-[0.38rem] sm:text-[0.45rem] md:text-[0.5rem]" />
    </div>
  </div>
) : imageUrl && (
  // ... featured image fallback
)}
```

**Sizing:**
- Mobile: `text-[0.38rem]` (3.8px)
- Tablet: `text-[0.45rem]` (4.5px)
- Desktop: `text-[0.5rem]` (5px)

**Container:**
- Padding: `px-20 py-6` (80px horizontal, 24px vertical)
- Background: `bg-card/50` (50% opacity card color)
- Border: `border-border/50` (50% opacity border color)
- Rounded corners: `rounded-lg`

**Layout Position:** Right side on desktop, full-width on mobile (replaces featured image)

---

#### B. Blog Post Card (Listing Page)

**File:** `/Users/michaelevans/michael-evans-port-main/src/components/blog/BlogPostCard.tsx` (lines 48-53)

```tsx
{showAsciiArt && post.asciiArt && post.asciiArt !== 'none' ? (
  <div className="w-full md:w-1/3 flex-shrink-0">
    <div className="flex items-center justify-center px-8 py-4 rounded-lg bg-card/50 border border-border/50">
      <AsciiArt type={post.asciiArt} className="text-[0.28rem] sm:text-[0.32rem] md:text-[0.38rem]" />
    </div>
  </div>
) : post.featuredImage?.asset && (
  // ... featured image fallback
)}
```

**Sizing:**
- Mobile: `text-[0.28rem]` (2.8px)
- Tablet: `text-[0.32rem]` (3.2px)
- Desktop: `text-[0.38rem]` (3.8px)

**Container:**
- Padding: `px-8 py-4` (32px horizontal, 16px vertical)
- Smaller than hero to fit card layout

**Layout:** Alternates left/right position on desktop based on index

---

#### C. Homepage Featured Blog

**File:** `/Users/michaelevans/michael-evans-port-main/src/components/HomepageFeaturedBlogImage.tsx` (lines 32-39)

```tsx
if (showAsciiArt) {
  return (
    <div className="w-full md:w-1/3 flex-shrink-0">
      <div className="flex items-center justify-center px-8 py-4 rounded-lg bg-card/50 border border-border/50">
        <AsciiArt type={asciiArt} className="text-[0.28rem] sm:text-[0.32rem] md:text-[0.38rem]" />
      </div>
    </div>
  );
}
```

**Sizing:** Same as blog post card (2.8px → 3.2px → 3.8px)

**Note:** Separate client component created to handle ASCII art conditional rendering on homepage (server component compatibility).

---

### 6. Display Behavior

**Priority Logic:**
```
IF asciiArt field is valid (not 'none' and exists in registry)
  → Display ASCII art
ELSE IF featuredImage exists
  → Display featured image
ELSE
  → Display nothing (no placeholder)
```

**Validation:**
- Uses `isValidAsciiArtType()` helper for type-safe validation
- Checks both that value exists AND is not 'none'
- Checks that value exists in `ASCII_ART_REGISTRY`

---

## Styling & Design Integration

### Color System

**Color Token:** `text-accent`

This token provides **dynamic theming**:
- **Time-of-Day:** Coral (morning/afternoon) or Purple (evening/night)
- **Dark Mode:** Automatically adjusts contrast
- **Consistent:** Matches all other accent elements (headings, links, gradients)

**Defined in:** `/Users/michaelevans/michael-evans-port-main/tailwind.config.ts`

### Font Sizing Strategy

**Responsive Scaling Pattern:**

| Context | Mobile | Tablet | Desktop | Reasoning |
|---------|--------|--------|---------|-----------|
| **Blog Hero** | 0.38rem | 0.45rem | 0.5rem | Largest - hero has most space |
| **Blog Card** | 0.28rem | 0.32rem | 0.38rem | Smaller - fits card layout |
| **Homepage** | 0.28rem | 0.32rem | 0.38rem | Same as card - consistent |

**Font Properties:**
- `font-mono` - Monospace font for ASCII alignment
- `leading-tight` - Tight line-height preserves vertical spacing
- `whitespace-pre` - Preserves all whitespace characters

**Container Backgrounds:**
- `bg-card/50` - 50% opacity of card background color
- `border-border/50` - 50% opacity of border color
- Subtle containers that don't compete with content

---

## ASCII Art Storage

### Current Storage Method

**Primary Source:** Hardcoded in `ASCII_ART_REGISTRY` constant

**File Reference:** `/Users/michaelevans/michael-evans-port-main/public/filing_cabinet_ascii.txt`
- Contains the original ASCII art source
- **Not used in rendering** - reference only
- 15 lines, 769 bytes

**Pros:**
- ✅ Fast rendering (no file I/O)
- ✅ Type-safe (TypeScript can validate keys)
- ✅ No runtime dependencies
- ✅ Bundled with component code

**Cons:**
- ❌ Code changes required to add new art
- ❌ Can't preview in Sanity Studio
- ❌ No validation of CMS values at edit time
- ❌ Requires 3-file update for new art

---

## Adding New ASCII Art (Current Process)

To add a new ASCII art option, **3 files must be updated**:

### Step 1: Update Registry Component
**File:** `src/components/blog/AsciiArt.tsx`

Add new entry to `ASCII_ART_REGISTRY`:
```typescript
const ASCII_ART_REGISTRY = {
  'filing-cabinet': { /* ... */ },
  'new-art-name': {
    art: `[ASCII art string here]`,
    label: 'Accessible description for screen readers',
  },
} as const;
```

### Step 2: Update Sanity Schema
**File:** `sanity/schemas/blog.ts`

Add option to `asciiArt.options.list`:
```typescript
options: {
  list: [
    { title: 'None', value: 'none' },
    { title: 'Filing Cabinet', value: 'filing-cabinet' },
    { title: 'New Art Name', value: 'new-art-name' },
  ],
  layout: 'radio',
},
```

### Step 3: Update TypeScript Types
**File:** `src/types/blog.ts`

Add to type union:
```typescript
asciiArt?: 'none' | 'filing-cabinet' | 'new-art-name';
```

**Deployment Required:** Yes - code changes require rebuild and deploy

---

## Identified Limitations

### 1. No Preview in Sanity Studio

**Issue:** Content editors select ASCII art blind - can't preview before publishing.

**Impact:**
- Can't see what the art looks like in context
- Can't verify sizing/alignment
- Must publish to production to see result

**Workaround:** Use Sanity Presentation mode to preview live site

---

### 2. Manual Three-File Sync

**Issue:** Adding new ASCII art requires updating 3 files manually (registry, schema, types).

**Impact:**
- Error-prone (easy to forget one file)
- No compile-time validation that schema matches registry
- Can lead to runtime errors if schema and registry don't match

**Example Failure:**
```
Schema has: 'robot'
Registry has: 'filing-cabinet'
→ User selects 'robot' in CMS
→ Component receives 'robot'
→ isValidAsciiArtType() returns false
→ No art displayed (silently fails)
```

---

### 3. No Size Validation

**Issue:** ASCII art can be any size - no validation that it fits containers.

**Impact:**
- Large ASCII art could overflow containers
- Very wide art could cause horizontal scrolling
- No warning at edit time

**Current Mitigation:**
- Container has `overflow-x-auto` (allows scrolling)
- `select-none` prevents accidental text selection

---

### 4. No Format Validation

**Issue:** No validation that ASCII art is properly formatted.

**Impact:**
- Tabs vs spaces could break alignment
- Unicode characters might not render correctly
- Line endings could be inconsistent

**Current Mitigation:** Manual review before adding to registry

---

### 5. Limited Collection

**Issue:** Only 1 ASCII art option available ("filing-cabinet").

**Impact:**
- Limited creative options for blog posts
- Can't match art to post topic/theme
- Feature feels incomplete

---

## Recommendations for Sustainable Management

### Recommendation 1: Add More ASCII Art Options

**Priority:** High  
**Effort:** Low

**Suggested Art Themes:**
- `lightbulb` - For ideation/innovation posts
- `code-brackets` - For technical/development posts
- `brain` - For AI/ML posts
- `rocket` - For launch/growth posts
- `book-stack` - For learning/education posts
- `coffee-cup` - For workflow/productivity posts

**Sources:**
- [ASCII Art Archive](https://www.asciiart.eu/)
- [Text Art Generator](https://patorjk.com/software/taag/)
- Custom creation using monospace editor

**Implementation:** Follow 3-step process documented above.

---

### Recommendation 2: Improve Upload/Add Workflow

**Priority:** Medium  
**Effort:** Medium

**Current Issues:**
- No guided workflow for adding new art
- Manual process is error-prone
- No validation or testing

**Proposed Solution:** Create utility script

**File:** `scripts/add-ascii-art.ts`

```typescript
/**
 * Interactive script to add new ASCII art to the blog system
 * 
 * Usage: npm run add-ascii-art
 * 
 * Steps:
 * 1. Prompts for art name (slug format)
 * 2. Prompts for display title
 * 3. Prompts for accessibility label
 * 4. Opens editor for ASCII art input
 * 5. Validates format (dimensions, characters)
 * 6. Updates all 3 files automatically
 * 7. Runs build to verify types
 * 8. Outputs preview in terminal
 */
```

**Benefits:**
- ✅ Single command adds art to all 3 files
- ✅ Interactive prompts reduce errors
- ✅ Automatic validation catches issues
- ✅ Build verification before commit
- ✅ Terminal preview shows result

**Package Script:**
```json
{
  "scripts": {
    "add-ascii-art": "tsx scripts/add-ascii-art.ts"
  }
}
```

---

### Recommendation 3: Add Sanity Studio Preview

**Priority:** Low (nice-to-have)  
**Effort:** High

**Goal:** Show ASCII art preview directly in Sanity Studio field.

**Technical Approach:** Custom input component

**File:** `sanity/components/AsciiArtPreview.tsx`

```tsx
import { StringInputProps } from 'sanity';
import { AsciiArt } from '@/components/blog/AsciiArt'; // Import from src

export function AsciiArtPreview(props: StringInputProps) {
  const selectedValue = props.value;
  
  return (
    <>
      {/* Standard radio buttons */}
      {props.renderDefault(props)}
      
      {/* Live preview below */}
      {selectedValue && selectedValue !== 'none' && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <div className="text-sm font-semibold mb-2">Preview:</div>
          <AsciiArt type={selectedValue} />
        </div>
      )}
    </>
  );
}
```

**Schema Update:**
```typescript
defineField({
  name: 'asciiArt',
  type: 'string',
  components: {
    input: AsciiArtPreview, // Use custom component
  },
  // ... rest of config
}),
```

**Challenges:**
- Importing React component into Sanity Studio (different build context)
- Keeping registry in sync between Studio and frontend
- May require Sanity plugin architecture

**Alternative:** Use Sanity Presentation mode (already available, no code needed)

---

### Recommendation 4: Validate Sizing Constraints

**Priority:** Medium  
**Effort:** Low

**Goal:** Prevent ASCII art that's too large for containers.

**Implementation:** Add validation to registry

```typescript
interface AsciiArtConfig {
  art: string;
  label: string;
  maxWidth?: number;  // Max characters per line
  maxHeight?: number; // Max lines
}

const ASCII_ART_REGISTRY = {
  'filing-cabinet': {
    art: `...`,
    label: '...',
    maxWidth: 60,  // Fits in mobile containers
    maxHeight: 15, // Reasonable vertical space
  },
} as const;

// Validation function (dev-time)
function validateAsciiArt(config: AsciiArtConfig): void {
  const lines = config.art.split('\n');
  const maxLineLength = Math.max(...lines.map(l => l.length));
  
  if (config.maxWidth && maxLineLength > config.maxWidth) {
    console.warn(`ASCII art exceeds max width: ${maxLineLength} > ${config.maxWidth}`);
  }
  
  if (config.maxHeight && lines.length > config.maxHeight) {
    console.warn(`ASCII art exceeds max height: ${lines.length} > ${config.maxHeight}`);
  }
}
```

**Run Validation:** In development build or as part of lint script

---

### Recommendation 5: Consider Alternative Storage

**Priority:** Low (future consideration)  
**Effort:** High

**Current:** Hardcoded in registry constant  
**Alternative:** Store in Sanity CMS

**Approach:** Create `asciiArtCollection` schema type

```typescript
// sanity/schemas/asciiArtCollection.ts
export default defineType({
  name: 'asciiArtCollection',
  title: 'ASCII Art Collection',
  type: 'document',
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Name',
      description: 'Unique identifier (slug format)',
      validation: (Rule) => Rule.required()
        .regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers, and hyphens only'),
    },
    {
      name: 'title',
      type: 'string',
      title: 'Display Title',
    },
    {
      name: 'art',
      type: 'text',
      title: 'ASCII Art',
      rows: 20,
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'accessibilityLabel',
      type: 'string',
      title: 'Accessibility Label',
      description: 'Screen reader description',
    },
  ],
});
```

**Blog Schema Update:**
```typescript
{
  name: 'asciiArt',
  type: 'reference',
  to: [{ type: 'asciiArtCollection' }],
  title: 'ASCII Art',
}
```

**Pros:**
- ✅ No code deploys to add new art
- ✅ Content editors can add art themselves
- ✅ Preview in Sanity Studio
- ✅ Version history and rollback
- ✅ Can add metadata (tags, categories, etc.)

**Cons:**
- ❌ Runtime database query (slower than hardcoded)
- ❌ Requires CDN/caching strategy
- ❌ More complex implementation
- ❌ Loses compile-time type safety
- ❌ Requires migration of existing data

**Verdict:** Not recommended unless collection grows to 20+ items.

---

## Sanity Text Field Options Analysis

The current implementation uses Sanity's **string field with radio buttons**. Here are alternative field types that could improve the workflow:

### Current: String Field with Radio Options

```typescript
{
  name: 'asciiArt',
  type: 'string',
  options: {
    list: [
      { title: 'None', value: 'none' },
      { title: 'Filing Cabinet', value: 'filing-cabinet' },
    ],
    layout: 'radio',
  },
}
```

**Pros:**
- ✅ Simple and clear UI
- ✅ Easy to understand for editors
- ✅ Type-safe string values

**Cons:**
- ❌ No preview
- ❌ No context/help text per option
- ❌ Grows vertically (bad for 10+ options)

---

### Alternative 1: String Field with Dropdown

```typescript
{
  name: 'asciiArt',
  type: 'string',
  options: {
    list: [
      { title: 'None', value: 'none' },
      { title: 'Filing Cabinet', value: 'filing-cabinet' },
    ],
    layout: 'dropdown', // Instead of 'radio'
  },
}
```

**Pros:**
- ✅ Compact UI (better for 10+ options)
- ✅ Searchable dropdown

**Cons:**
- ❌ Still no preview
- ❌ Less discoverable than radio buttons

**Recommendation:** Use if collection grows beyond 5-6 options.

---

### Alternative 2: Custom Input Component

**Implementation:** See Recommendation 3 above

**Pros:**
- ✅ Can show live preview
- ✅ Can add validation UI
- ✅ Full control over UX

**Cons:**
- ❌ Requires custom component development
- ❌ More maintenance overhead

---

### Alternative 3: Text Field (Direct ASCII Input)

```typescript
{
  name: 'asciiArtCustom',
  type: 'text',
  title: 'Custom ASCII Art',
  rows: 20,
  description: 'Paste your ASCII art here',
}
```

**Pros:**
- ✅ Ultimate flexibility for editors
- ✅ No code changes needed for new art
- ✅ Can preview in Studio with custom component

**Cons:**
- ❌ No format validation
- ❌ Inconsistent sizing across posts
- ❌ Character encoding issues
- ❌ No reusability across posts
- ❌ Larger document size

**Verdict:** Not recommended for this use case.

---

## Testing & Quality Assurance

### Current Testing

**No automated tests exist** for ASCII art functionality.

**Manual Testing Checklist:**
- ✅ ASCII art displays correctly on desktop
- ✅ ASCII art displays correctly on mobile (smaller font size)
- ✅ Accent color changes with time-of-day theme (coral/purple)
- ✅ Accent color changes with light/dark mode
- ✅ Component is accessible (has aria-label)
- ✅ No layout shift when loading
- ✅ CMS field appears in Sanity Studio
- ✅ Selecting "None" shows featured image as normal
- ✅ Selecting "Filing Cabinet" shows ASCII art instead of image
- ✅ Works when featured image is also present (ASCII art takes precedence)

### Recommended Tests

**Unit Tests:**
```typescript
// src/components/blog/__tests__/AsciiArt.test.tsx
describe('AsciiArt', () => {
  it('renders ASCII art with correct aria-label', () => {
    render(<AsciiArt type="filing-cabinet" />);
    expect(screen.getByRole('img')).toHaveAttribute(
      'aria-label',
      'ASCII art illustration of a filing cabinet'
    );
  });
  
  it('returns null for invalid type', () => {
    const { container } = render(<AsciiArt type="invalid" as any />);
    expect(container.firstChild).toBeNull();
  });
});

describe('isValidAsciiArtType', () => {
  it('returns true for valid types', () => {
    expect(isValidAsciiArtType('filing-cabinet')).toBe(true);
  });
  
  it('returns false for "none"', () => {
    expect(isValidAsciiArtType('none')).toBe(false);
  });
  
  it('returns false for undefined', () => {
    expect(isValidAsciiArtType(undefined)).toBe(false);
  });
});
```

**Visual Regression Tests:**
- Screenshot tests for each ASCII art type
- Responsive size testing (mobile/tablet/desktop)
- Color testing (light/dark mode, time-of-day)

**Integration Tests:**
- Verify BlogHero switches between image and ASCII art based on CMS value
- Verify BlogPostCard renders ASCII art on listing page
- Verify Homepage featured blog shows ASCII art

---

## Performance Considerations

### Bundle Size Impact

**ASCII Art Registry Size:**
- Current: ~1KB (1 art option)
- With 10 options: ~10KB (estimated)
- Impact: Minimal (included in component bundle)

**Rendering Performance:**
- `<pre>` element: Native browser rendering (fast)
- No JavaScript animation or interaction
- Static content (no re-renders)
- Conclusion: **No performance concerns**

### Optimization Opportunities

**Current:** ASCII art is bundled with component code (always loaded)

**Alternative (if collection grows large):**
```typescript
// Dynamic import for large ASCII art
const largeAsciiArt = {
  'detailed-diagram': async () => (await import('./ascii-art/detailed-diagram')).default,
};
```

**Verdict:** Not needed for current use case (1-10 art pieces).

---

## Accessibility

### Current Implementation

**Semantic HTML:**
- ✅ `<pre>` tag preserves formatting
- ✅ `role="img"` indicates decorative/informative content
- ✅ `aria-label` provides text description

**Screen Reader Experience:**
- Announces as image: "Image: ASCII art illustration of a filing cabinet"
- Does not read ASCII characters (good - would be nonsensical)

**Keyboard Navigation:**
- ✅ `select-none` prevents accidental text selection
- ✅ No interactive elements (no tab stops)

**Color Contrast:**
- Uses `text-accent` which has verified WCAG AA contrast ratios
- Dark mode support built-in

### Recommendations

**Consider:** `aria-hidden="true"` if ASCII art is purely decorative (duplicate of featured image concept).

**Current approach is appropriate** - ASCII art conveys thematic information, so `role="img"` is correct.

---

## Content Editor Workflow

### Current Workflow (Sanity Studio)

1. **Open blog post** in Sanity Studio (`/studio`)
2. **Scroll to "ASCII Art (Alternative to Image)"** field (after Featured Image)
3. **Select radio option:**
   - **None** (default): Uses featured image
   - **Filing Cabinet**: Shows filing cabinet ASCII art
4. **Publish changes**
5. **View on site** (changes appear immediately via CDN revalidation)

**Time to Complete:** ~30 seconds

**Difficulty:** Very Easy (radio button selection)

---

### Content Editor Pain Points

**Issue 1:** "I can't see what it looks like before publishing"
- **Mitigation:** Use Presentation mode in Sanity Studio
- **Future Fix:** Add preview component (Recommendation 3)

**Issue 2:** "Only one option available - can I request more?"
- **Mitigation:** Developer adds new art via 3-file process
- **Future Fix:** Utility script (Recommendation 2)

**Issue 3:** "How do I know if ASCII art or image looks better?"
- **Mitigation:** A/B test by toggling field and viewing in Presentation mode
- **Design Guideline Needed:** Document when to use ASCII art vs. images

---

## Design Guidelines (Recommended)

### When to Use ASCII Art

**Good Use Cases:**
- Technical/developer-focused posts (coding, terminal, CLI themes)
- Retro/vintage aesthetic posts
- Minimalist design preference
- Posts where imagery would be distracting
- Conceptual/abstract topics

**Avoid ASCII Art For:**
- Posts with rich visual content (screenshots, diagrams)
- Photo-heavy posts (product showcases, portfolios)
- Posts targeting non-technical audiences
- Posts where image conveys critical information

### ASCII Art Selection Guide

**Filing Cabinet:**
- Use for: Organization, information management, data storage, archives
- Topics: Knowledge management, documentation, content systems

*[Expand this guide as more art options are added]*

---

## Files & Locations Reference

### Core Implementation Files

| File Path | Purpose | Lines | Last Modified |
|-----------|---------|-------|---------------|
| `/sanity/schemas/blog.ts` | Sanity schema field | 428-441 | 2025-12-12 |
| `/src/components/blog/AsciiArt.tsx` | Registry component | 1-73 | 2025-12-12 |
| `/src/types/blog.ts` | TypeScript types | 67, 83 | 2025-12-12 |
| `/src/lib/sanity/queries/blog.ts` | GROQ queries | 21, 71, 136 | 2025-12-12 |
| `/src/components/blog/BlogHero.tsx` | Blog post hero | 76-81 | 2025-12-12 |
| `/src/components/blog/BlogPostCard.tsx` | Blog listing card | 48-53 | 2025-12-12 |
| `/src/components/HomepageFeaturedBlogImage.tsx` | Homepage featured | 32-39 | 2025-12-12 |
| `/src/components/blog/index.ts` | Component exports | 8 | 2025-12-12 |
| `/src/app/(public)/blog/[slug]/page.tsx` | Blog post page | 109 | 2025-12-12 |

### Documentation Files

| File Path | Purpose |
|-----------|---------|
| `/docs/plans/ascii-art-blog-image-plan.md` | Original implementation plan |
| `/public/filing_cabinet_ascii.txt` | Reference file (not used in rendering) |

### Related Configuration

| File Path | Relevant Config |
|-----------|----------------|
| `/tailwind.config.ts` | `text-accent` color token definition |
| `/src/app/globals.css` | CSS utilities (if any ASCII-specific) |

---

## Git History

**Initial Implementation:**
```
commit 7b711ff1d58fc1812dfea8283dbbe620ede3cf3e
Author: Michael Evans <mevans212@gmail.com>
Date:   Fri Dec 12 10:01:41 2025 -0800

    feat(blog): add CMS-driven ASCII art alternative to featured images
    
    Allow content editors to select ASCII art display instead of featured
    image per blog post via Sanity CMS. Includes filing cabinet ASCII art
    as first option with responsive sizing and accent color support.
```

**Files Changed:**
- 12 files modified
- 446 insertions
- 21 deletions

---

## Future Enhancement Ideas

### 1. ASCII Art Categories/Tags

Add metadata to registry for better organization:

```typescript
const ASCII_ART_REGISTRY = {
  'filing-cabinet': {
    art: '...',
    label: '...',
    category: 'office',
    tags: ['organization', 'storage', 'data'],
    theme: 'productivity',
  },
};
```

Use case: Filter art options by post category/tags in CMS.

---

### 2. Animated ASCII Art

Current: Static display  
Future: Support for frame-based animations

```typescript
{
  'loading-spinner': {
    art: ['frame1', 'frame2', 'frame3'],
    label: '...',
    frameDelay: 200, // ms
  },
}
```

Implementation: Use `setInterval` to cycle frames.

**Accessibility Consideration:** Add `prefers-reduced-motion` check.

---

### 3. Color Customization

Current: Always uses `text-accent`  
Future: Per-art color configuration

```typescript
{
  'filing-cabinet': {
    art: '...',
    label: '...',
    color: 'accent', // or 'primary', 'muted', etc.
  },
}
```

---

### 4. Multi-Color ASCII Art

Current: Single color  
Future: Support for multiple colors using spans

```typescript
{
  'rainbow': {
    art: [
      { text: 'line1', color: 'red' },
      { text: 'line2', color: 'orange' },
      // ...
    ],
    label: '...',
  },
}
```

Implementation complexity: High (requires parsing and span wrapping).

---

### 5. User-Submitted ASCII Art

Allow blog readers to submit ASCII art for consideration.

**Features:**
- Submission form on blog
- Admin review queue in Sanity Studio
- Approval workflow before adding to registry

**Concerns:**
- Moderation required (inappropriate content)
- Quality control (formatting, alignment)
- Legal (copyright/attribution)

---

## Comparison with Alternative Approaches

### Approach 1: Current (Registry Pattern)

**Architecture:** Hardcoded registry in component

**Pros:**
- Fast (no DB query)
- Type-safe
- Simple to understand

**Cons:**
- Requires code deploy
- Manual sync across files

**Best For:** Small collections (<20 items)

---

### Approach 2: Sanity Document Collection

**Architecture:** ASCII art as separate document type in CMS

**Pros:**
- No code deploys
- Editor-managed
- Preview in Studio

**Cons:**
- Runtime DB query
- More complex
- Loses compile-time safety

**Best For:** Large collections (>50 items)

---

### Approach 3: Static JSON File

**Architecture:** JSON file with ASCII art data

```json
{
  "filing-cabinet": {
    "art": "...",
    "label": "..."
  }
}
```

**Pros:**
- Easier to edit than TypeScript
- Can version independently
- Can import at build time

**Cons:**
- Still requires code deploy
- No type safety unless codegen
- Extra file to manage

**Best For:** Medium collections (10-50 items)

---

### Approach 4: Image Files (PNG/SVG)

**Architecture:** Store ASCII art as images instead of text

**Pros:**
- Exact rendering control
- No font/spacing issues
- Same image pipeline as featured images

**Cons:**
- Loses "text art" aesthetic
- No color theming
- Larger file size
- Not actually ASCII art

**Best For:** Not recommended for ASCII art feature

---

## Conclusion

The ASCII art feature is **well-implemented** with a solid architecture:
- ✅ CMS-driven (no code changes to toggle)
- ✅ Responsive and accessible
- ✅ Design system compliant
- ✅ Type-safe

**Immediate Next Steps:**
1. **Add 3-5 more ASCII art options** (Recommendation 1)
2. **Create utility script** for easier additions (Recommendation 2)
3. **Document design guidelines** for when to use ASCII art

**Long-Term Considerations:**
- Monitor collection size (if >20 items, consider Sanity storage)
- Consider preview component for Studio
- Add automated testing

**Current Status:** Production-ready with room for expansion.

---

## Appendix: ASCII Art Resources

### Creation Tools

1. **[ASCII Art Generator](https://patorjk.com/software/taag/)** - Text to ASCII
2. **[ASCII Flow](https://asciiflow.com/)** - Drawing tool
3. **[Text to ASCII Art Generator](https://www.ascii-art-generator.org/)** - Image to ASCII
4. **[Monodraw](https://monodraw.helftone.com/)** (Mac) - Professional ASCII editor

### ASCII Art Libraries

1. **[ASCII Art Archive](https://www.asciiart.eu/)** - Large collection
2. **[Chris.com ASCII Art](https://www.chris.com/ascii/)** - Categorized collection
3. **[ASCII World](https://www.asciiworld.com/)** - Themed art

### Character Guidelines

**Safe Characters** (display consistently across fonts):
```
Standard: A-Z a-z 0-9
Box Drawing: ─ │ ┌ ┐ └ ┘ ├ ┤ ┬ ┴ ┼
Blocks: █ ▓ ▒ ░
Shapes: / \ | - _ = [ ] ( ) { } < >
```

**Avoid:**
- Emoji (inconsistent sizing)
- Extended Unicode (font support varies)
- Tab characters (use spaces only)

---

**End of Research Document**

*For questions or updates, see `/docs/plans/ascii-art-blog-image-plan.md` or contact development team.*
