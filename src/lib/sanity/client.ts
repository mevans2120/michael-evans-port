import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

// Get Sanity config from environment or use defaults
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID === 'your-project-id'
  ? '5n331bys'
  : (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '5n331bys');

const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET === 'production'
  ? 'production'
  : (process.env.NEXT_PUBLIC_SANITY_DATASET || 'production');

export const client = createClient({
  projectId,
  dataset,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  useCdn: true,
  perspective: 'published',
})

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}