import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

// Sanity client with write token for imports
export const importClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '5n331bys',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN, // Write token required for imports
  useCdn: false, // Don't use CDN for writes
})

// Helper to create or update document
export async function createOrUpdateDocument<T extends { _id?: string; _type: string }>(
  doc: T
): Promise<T> {
  if (doc._id) {
    // Update existing document
    return await importClient.createOrReplace(doc) as T
  } else {
    // Create new document
    return await importClient.create(doc) as T
  }
}

// Helper to create reference
export function createReference(id: string, type: string) {
  return {
    _type: 'reference',
    _ref: id,
  }
}

// Helper to create slug
export function createSlug(text: string) {
  return {
    _type: 'slug',
    current: text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
  }
}

console.log('Sanity import client configured')
console.log('Project ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID)
console.log('Dataset:', process.env.NEXT_PUBLIC_SANITY_DATASET)
console.log('Write token:', process.env.SANITY_WRITE_TOKEN ? '✓ Present' : '✗ Missing')
