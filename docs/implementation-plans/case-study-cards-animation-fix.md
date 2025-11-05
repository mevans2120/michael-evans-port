# Case Study Cards Animation Fix Plan

**Date**: November 5, 2025
**File**: `/src/components/FeaturedCaseStudies.tsx`
**Goal**: Fix glitchy animations caused by overlapping CSS transitions

## Problem Summary

Multiple `transition-all` declarations with different timings create stuttering/janky animations when hovering over case study cards.

## Simple Solution

**Replace generic `transition-all` with specific property transitions**

### Changes Needed

#### 1. Article Element (Line 78)
**Current**: `transition-all duration-400`
**Fix**: `transition-[padding-left] duration-400`
**Why**: Only animate the padding shift, nothing else

#### 2. Accent Bar (Line 95)
**Current**: `transition-all duration-400`
**Fix**: `transition-[height] duration-400`
**Why**: Only animate the height change

#### 3. Title (Line 108)
**Current**: `transition-all duration-300`
**Fix**: `transition-colors duration-400`
**Why**: Standardize timing to 400ms, only animate color

#### 4. Metric (Line 116)
**Current**: `transition-opacity duration-300`
**Fix**: `transition-opacity duration-400`
**Why**: Standardize timing to 400ms

#### 5. Description (Line 126)
**Current**: `transition-all duration-400`
**Fix**: `transition-[max-height,opacity,margin-top] duration-400`
**Why**: Specify exact properties being animated

## Expected Result

- Smooth, synchronized animations (all 400ms)
- No stuttering or jumping
- Better performance (fewer repaints)
- Same visual behavior, just cleaner execution

## Implementation

Single file change: `/src/components/FeaturedCaseStudies.tsx`
Estimated time: 5 minutes
Risk: Low (only changing transition properties)

## Testing

1. Hover over case study cards on homepage
2. Verify smooth animation without stutter
3. Test mobile tap interaction (expand/collapse)
4. Verify description expands smoothly
