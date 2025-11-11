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
        // Skip revalidation for mutations when live preview is enabled
        // Let the WebSocket (SanityLive) handle updates instead
        if (payload.source === 'mutation') {
          if (payload.livePreviewEnabled) {
            return // No refresh needed - WebSocket handles it
          }
          // For mutations without live preview, revalidate by document type
          if ('document' in payload && payload.document) {
            await revalidateSanityDocument(payload.document._type)
          }
        }

        // For manual refreshes, skip revalidation (user explicitly requested refresh)
        // The default behavior will handle it
      }}
    />
  )
}
