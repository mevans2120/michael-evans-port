import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

// Get Sanity config from environment or use defaults
// Validate projectId - must be alphanumeric with dashes only
const envProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const isValidProjectId = envProjectId &&
  envProjectId !== 'your-project-id' &&
  /^[a-z0-9-]+$/.test(envProjectId);

const projectId = isValidProjectId ? envProjectId : '5n331bys';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

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