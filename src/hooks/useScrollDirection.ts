'use client'

import { useState, useEffect, useRef } from 'react'

type ScrollDirection = 'up' | 'down' | 'none'

interface UseScrollDirectionReturn {
  scrollDirection: ScrollDirection
  scrollY: number
  isAtTop: boolean
}

interface UseScrollDirectionOptions {
  threshold?: number
  topThreshold?: number
}

/**
 * Hook to detect scroll direction and position with performance optimizations
 *
 * @param threshold - Minimum scroll distance (px) before direction change is registered (default: 10)
 * @param topThreshold - Distance from top (px) to consider "at top" (default: 50)
 * @returns Object with scrollDirection, scrollY position, and isAtTop boolean
 *
 * Features:
 * - Debounced scroll detection using RAF
 * - Prevents jitter with scroll threshold
 * - Handles iOS momentum scrolling
 * - Properly cleans up event listeners
 */
export function useScrollDirection({
  threshold = 10,
  topThreshold = 50,
}: UseScrollDirectionOptions = {}): UseScrollDirectionReturn {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>('none')
  const [scrollY, setScrollY] = useState(0)
  const [isAtTop, setIsAtTop] = useState(true)

  const lastScrollY = useRef(0)
  const ticking = useRef(false)

  useEffect(() => {
    // Get the main content element that actually scrolls
    const mainContent = document.getElementById('main-content')

    if (!mainContent) {
      console.error('[useScrollDirection] #main-content element not found')
      return
    }

    // Initialize with current scroll position
    lastScrollY.current = mainContent.scrollTop
    setScrollY(mainContent.scrollTop)
    setIsAtTop(mainContent.scrollTop < topThreshold)

    const updateScrollDirection = () => {
      const currentScrollY = mainContent.scrollTop
      const scrollDelta = currentScrollY - lastScrollY.current

      // Always update scroll position and isAtTop
      setScrollY(currentScrollY)
      setIsAtTop(currentScrollY < topThreshold)

      // Check if we've scrolled past the threshold for direction change
      if (Math.abs(scrollDelta) > threshold) {
        const newDirection: ScrollDirection = scrollDelta > 0 ? 'down' : 'up'

        setScrollDirection(newDirection)

        // Update last position after threshold is met
        lastScrollY.current = currentScrollY
      }

      // Reset ticking flag
      ticking.current = false
    }

    const onScroll = () => {
      // Use RAF for performance - only update once per frame
      if (!ticking.current) {
        window.requestAnimationFrame(updateScrollDirection)
        ticking.current = true
      }
    }

    // Add scroll listener to main-content element
    mainContent.addEventListener('scroll', onScroll, { passive: true })

    // Cleanup
    return () => {
      mainContent.removeEventListener('scroll', onScroll)
    }
  }, [threshold, topThreshold])

  return {
    scrollDirection,
    scrollY,
    isAtTop,
  }
}
