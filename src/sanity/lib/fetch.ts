import { draftMode } from 'next/headers'
import { productionClient } from './client'
import { sanityFetch as liveSanityFetch } from './live'
import type { QueryParams } from 'next-sanity'

interface CachedFetchOptions {
  query: string
  params?: QueryParams
  tags?: string[]
}

/**
 * Smart Sanity fetch helper with caching
 *
 * Behavior:
 * - Regular visitors: Uses CDN-cached responses via productionClient
 * - Editors in draft mode: Uses live fetching for real-time updates
 *
 * Caching:
 * - Production responses are cached indefinitely (revalidate: false)
 * - Cache tags allow targeted invalidation via webhook
 * - All requests tagged with 'sanity' for global invalidation
 *
 * Usage:
 * ```ts
 * const { data } = await cachedSanityFetch({
 *   query: myQuery,
 *   params: { slug },
 *   tags: ['blog']  // Optional: additional tags for targeted invalidation
 * })
 * ```
 */
export async function cachedSanityFetch<T>({
  query,
  params = {},
  tags = [],
}: CachedFetchOptions): Promise<{ data: T }> {
  const isDraftMode = (await draftMode()).isEnabled

  if (isDraftMode) {
    // Draft mode: use live fetching for real-time preview updates
    return liveSanityFetch({ query, params })
  }

  // Production: use CDN-cached client with Next.js fetch caching
  const data = await productionClient.fetch<T>(query, params, {
    next: {
      revalidate: false, // Cache indefinitely, rely on webhook for invalidation
      tags: ['sanity', ...tags], // Cache tags for targeted invalidation
    },
  })

  return { data }
}
