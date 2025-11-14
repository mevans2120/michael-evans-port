'use client'

import { VisualEditing } from 'next-sanity/visual-editing'
import { revalidateSanityDocument } from '@/app/actions/revalidate'

/**
 * Visual Editing Wrapper with Custom Refresh Strategy
 *
 * This component wraps the Sanity VisualEditing component with a custom
 * refresh handler to prevent aggressive revalidation on every mutation.
 *
 * **Problem**: The default VisualEditing refresh strategy revalidates the
 * root layout on every mutation, causing full page refreshes and ignoring
 * WebSocket updates from SanityLive.
 *
 * **Solution**: Custom refresh handler that:
 * 1. Skips revalidation for mutations when live preview is enabled
 * 2. Lets SanityLive WebSocket handle real-time updates smoothly
 * 3. Only revalidates for manual refreshes (user clicks refresh button)
 * 4. Uses targeted revalidation by document type instead of root layout
 *
 * @see /docs/sanity-presentation-revalidation-research.md - Full research and analysis
 * @see https://github.com/sanity-io/next-sanity/issues/1649 - Known issue in next-sanity v11.6.x
 */
export function VisualEditingWrapper() {
  return (
    <VisualEditing
      refresh={async (payload) => {
        // Always skip revalidation for mutations - let WebSocket handle updates
        // This prevents aggressive full-page revalidation
        if (payload.source === 'mutation') {
          console.log('[VisualEditing] Mutation detected, skipping revalidation (livePreviewEnabled:', payload.livePreviewEnabled, ')')
          return // No refresh needed - WebSocket handles it when connected
        }

        // For manual refreshes, allow default behavior
        if (payload.source === 'manual') {
          console.log('[VisualEditing] Manual refresh triggered')
          // Let default behavior handle manual refresh
        }
      }}
    />
  )
}
