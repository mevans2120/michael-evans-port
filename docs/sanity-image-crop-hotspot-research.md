# Sanity Image Crop and Hotspot Research

**Date**: 2025-11-13  
**Research Question**: Should we pass `backgroundImage.asset` or the full `backgroundImage` object to urlFor() to preserve crops and hotspots?

## Executive Summary

**Answer: Pass the FULL image object to urlFor(), NOT just the asset reference.**

To preserve Sanity crops and hotspots, you MUST pass the complete image object (which includes crop/hotspot metadata) to `urlFor()`. Passing only the asset reference will render the image but will **ignore all crop and hotspot settings** configured in Sanity Studio.

## How Sanity Stores Crop and Hotspot Data

### Schema Level
When you enable `hotspot: true` in a Sanity image field schema:

```typescript
defineField({
  name: 'backgroundImage',
  type: 'image',
  options: {
    hotspot: true,  // Enables crop and hotspot UI in Studio
  },
})
```

### Data Structure
The image object stored in Sanity includes crop and hotspot fields alongside the asset reference:

```json
{
  "_type": "image",
  "asset": {
    "_type": "reference",
    "_ref": "image-abc123..."
  },
  "crop": {
    "top": 0.028,
    "bottom": 0.150,
    "left": 0.018,
    "right": 0.009
  },
  "hotspot": {
    "x": 0.812,
    "y": 0.279,
    "height": 0.324,
    "width": 0.281
  },
  "alt": "Description of image"
}
```

**Key Insight**: Crop and hotspot data are stored at the **image level**, NOT at the asset level. The asset is just the raw file reference.

## GROQ Query: How to Fetch Image Data Correctly

### ❌ INCORRECT: Dereferencing the asset loses crop/hotspot

```groq
featuredImage {
  asset->{
    _id,
    url
  },
  alt
}
```

**Problem**: Using `asset->{}` dereferences the asset and replaces the entire asset object with the dereferenced data, **losing the crop and hotspot fields** from the parent image object.

**Result structure**:
```typescript
{
  asset: {
    _id: "...",
    url: "..."
  },
  alt: "..."
  // ❌ crop and hotspot are LOST
}
```

### ✅ CORRECT: Keep the full image object

```groq
featuredImage {
  asset,  // Keep as reference, don't dereference
  alt,
  crop,
  hotspot
}
```

Or simply:

```groq
featuredImage  // Returns entire image object with all fields
```

**Result structure**:
```typescript
{
  asset: {
    _type: "reference",
    _ref: "image-abc123..."
  },
  alt: "...",
  crop: { top, bottom, left, right },
  hotspot: { x, y, height, width }
  // ✅ All metadata preserved
}
```

### Alternative: Dereference but preserve parent fields

```groq
featuredImage {
  ...,  // Spread existing fields (preserves crop/hotspot)
  asset-> {
    _id,
    url,
    metadata
  }
}
```

This preserves crop/hotspot while also expanding asset details.

## TypeScript Interface: Correct Structure

### ❌ INCORRECT Structure (Current Code)
```typescript
backgroundImage?: {
  asset?: {
    _id: string
    url: string
  }
  alt?: string
  // Missing crop and hotspot
}
```

### ✅ CORRECT Structure
```typescript
backgroundImage?: {
  asset?: {
    _ref: string  // Reference, not dereferenced object
    _type: 'reference'
  }
  crop?: {
    top: number
    bottom: number
    left: number
    right: number
  }
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
  alt?: string
}
```

## How urlFor() Works

From `@sanity/image-url` documentation and community answers:

> The builder accepts an image source, an asset source, or a string containing the asset's ID. If you supply the **image or asset source**, the builder will automatically default to **respecting any crop and hot-spot settings**.

**Critical Detail**: 
- Passing the **full image object** → urlFor() reads crop/hotspot metadata and applies it
- Passing only the **asset reference** → urlFor() has no crop/hotspot data to apply

### Source Code Evidence

From `/src/sanity/lib/client.ts`:
```typescript
export function urlFor(source: any) {
  return builder.image(source)
}
```

The `builder.image()` method from `@sanity/image-url` automatically:
1. Checks if source contains crop/hotspot fields
2. Applies crop first (what editor allows to be used)
3. Applies hotspot during responsive cropping (focal point for crops)
4. Returns optimized URL respecting these settings

## Codebase Audit: Current Usage Patterns

### ✅ CORRECT Examples

**EditorialHero.tsx** (line 23-33):
```typescript
const imageUrl = backgroundImage?.asset
  ? urlFor(backgroundImage).width(1920).height(1080).quality(85).url()
  //         ^^^^^^^^^^^^^^ Full object
  : null
```

**CaseStudyBackground.tsx** (line 23):
```typescript
const imageUrl = urlFor(image)
  //                    ^^^^^ Full object
  .width(1920)
  .height(1080)
  .quality(75)
  .url()
```

**metadata.ts** (line 104):
```typescript
socialImageUrl = urlFor(featuredImage).width(1200).height(630).url()
  //                    ^^^^^^^^^^^^^ Full object
```

### ❌ INCORRECT Examples (Potentially)

**BlogPostCard.tsx** (line 62):
```typescript
src={urlFor(post.featuredImage.asset).width(600).height(450).url()}
  //                              ^^^^^ Only asset - may lose crop/hotspot
```

**CaseStudyScreenshots.tsx** (line 36, 68):
```typescript
urlFor(screenshot.image.asset).url()
  //                     ^^^^^ Only asset - may lose crop/hotspot
```

**Various components passing `.asset`**:
- BlogContent.tsx (line 72)
- CaseStudySection.tsx (line 96)
- ArticleContent.tsx (line 46)
- PortraitImageList.tsx (line 31)
- ImageGrid.tsx (line 25)

## Query Audit: Current GROQ Queries

### ❌ PROBLEMATIC Queries

From `/src/lib/sanity/queries.ts`:

```groq
featuredImage {
  asset->{  // ❌ Dereferences and loses crop/hotspot
    _id,
    url
  },
  alt
}
```

This pattern appears in:
- Line 24-29
- Line 55-60
- Line 79-83
- Line 126-131
- Line 170-174
- Line 267-273

### ✅ CORRECT Queries

From `/src/lib/sanity/queries/blog.ts`:

```groq
featuredImage {
  asset,  // ✅ Keeps reference, preserves crop/hotspot
  alt
}
```

This pattern appears in:
- blog.ts lines 16-19, 46-50, 85-88, 109-112

## Crop vs Hotspot: Understanding the Difference

### Crop
- Defines the **allowed area** of the image that editors want to use
- Set in Sanity Studio via crop handles
- Applied first, restricts the available image area

### Hotspot
- Defines the **focal point** within the cropped area
- Used when the image is cropped further for responsive layouts
- Ensures important content stays visible at different aspect ratios
- Values are x, y coordinates (0.0-1.0) plus height/width dimensions

**Workflow**:
1. Editor uploads image
2. Editor sets crop (what area to use)
3. Editor sets hotspot (what's most important in that area)
4. urlFor() applies crop
5. When responsive dimensions specified, urlFor() centers on hotspot

## Recommendations

### 1. Fix GROQ Queries

**Change this**:
```groq
featuredImage {
  asset->{
    _id,
    url
  },
  alt
}
```

**To this**:
```groq
featuredImage {
  asset,
  crop,
  hotspot,
  alt
}
```

Or simply:
```groq
featuredImage
```

### 2. Update TypeScript Interfaces

Add crop and hotspot fields to all image type definitions.

### 3. Pass Full Image Object to urlFor()

**Change this**:
```typescript
urlFor(image.asset)
```

**To this**:
```typescript
urlFor(image)
```

### 4. Update Components

Audit and fix all components currently passing `.asset` to urlFor():
- BlogPostCard.tsx
- CaseStudyScreenshots.tsx
- BlogContent.tsx
- CaseStudySection.tsx
- ArticleContent.tsx
- PortraitImageList.tsx
- ImageGrid.tsx

## Testing Crop/Hotspot Support

To verify crop/hotspot is working:

1. Open Sanity Studio
2. Edit an image field with hotspot enabled
3. Set a crop (reduce visible area)
4. Set a hotspot (click focal point)
5. Save document
6. Check frontend rendering
7. Verify image respects crop boundaries
8. Resize browser - verify hotspot stays centered

## References

- [Sanity Docs: Image URL Builder](https://www.sanity.io/docs/image-url)
- [Sanity Docs: Image Type](https://www.sanity.io/docs/image-type)
- [Sanity Community: imageUrlBuilder not respecting hotspot](https://www.sanity.io/answers/trouble-with-imageurlbuilder-not-respecting-hotspot-and-crop-values-in-sanity-io-)
- [DEV Community: Crop it like it's hot](https://dev.to/webby/crop-it-like-its-hot-cropping-images-in-sanity-v3-2i1e)
- [GitHub Issue: next-sanity hotspot support](https://github.com/sanity-io/next-sanity/issues/1647)

## Conclusion

**The answer is definitive**: Pass the **full image object** to urlFor(), not just the asset reference.

The current codebase has a mix of correct and incorrect patterns. The queries using `asset->{}` are dereferencing the asset and losing crop/hotspot data. These should be fixed to preserve the full image object structure.
