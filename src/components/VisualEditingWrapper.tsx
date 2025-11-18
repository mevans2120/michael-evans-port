'use client'

import { VisualEditing } from 'next-sanity/visual-editing'

/**
 * Visual Editing Wrapper with Disabled Manual Refreshes
 *
 * This component wraps the Sanity VisualEditing component with a custom
 * refresh handler that disables all manual refresh behavior.
 *
 * **Problem**: The default VisualEditing refresh strategy revalidates the
 * root layout on every mutation, causing full page refreshes and ignoring
 * WebSocket updates from SanityLive.
 *
 * **Solution**: Disable all manual refreshes and rely on:
 * 1. SanityLive WebSocket for real-time draft updates (typing, editing)
 * 2. Webhook-triggered revalidation for published content changes
 *
 * **Behavior**:
 * - Typing in drafts: No refresh (WebSocket updates automatically)
 * - Publishing content: Webhook triggers revalidation
 * - Manual refresh button: Disabled (WebSocket keeps content in sync)
 *
 * @see /docs/sanity-presentation-revalidation-research.md - Full research and analysis
 * @see https://github.com/sanity-io/next-sanity/issues/1649 - Known issue in next-sanity v11.6.x
 */
export function VisualEditingWrapper() {
  return (
    <VisualEditing
      refresh={async () => {
        // Disable all manual refreshes - SanityLive WebSocket handles all updates automatically
        return
      }}
    />
  )
}
