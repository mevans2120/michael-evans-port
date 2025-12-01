import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

import { apiVersion, dataset, projectId } from '../env'

/**
 * Base client - used for live preview and draft mode
 * useCdn: false ensures fresh content for editors
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
})

/**
 * Production client - uses Sanity CDN for fast cached responses
 * Used for regular visitors (non-draft mode)
 * Cache is invalidated via webhook when content changes
 */
export const productionClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})

// Image URL builder helper
const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}
