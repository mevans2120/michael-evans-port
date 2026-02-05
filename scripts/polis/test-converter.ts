/**
 * Test script for the Portable Text to Markdown converter.
 * Fetches real blog posts from Sanity and converts them to verify output.
 *
 * Usage: npx tsx scripts/polis/test-converter.ts
 */

import { createClient } from 'next-sanity'
import { portableTextToMarkdown } from './portable-text-to-md'

const client = createClient({
  projectId: '5n331bys',
  dataset: 'production',
  apiVersion: '2025-10-28',
  useCdn: true,
})

const query = `*[_type == "blog"] | order(publishedAt desc) {
  title,
  slug,
  publishedAt,
  content[] {
    ...,
    _type == "image" => {
      ...,
      asset->{ _id, url },
      crop, hotspot, alt, caption, style
    },
    _type == "imageGrid" => {
      ...,
      images[] { ..., asset->{ _id, url }, alt, caption }
    },
    _type == "portraitImageList" => {
      ...,
      images[] { ..., asset->{ _id, url }, alt, caption }
    }
  },
  featuredImage {
    asset->{ _id, url },
    crop, hotspot, alt, caption
  }
}`

interface Post {
  title: string
  slug: { current: string }
  publishedAt: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any[]
  featuredImage?: {
    asset?: { _id?: string; url?: string }
    alt?: string
    caption?: string
  }
}

async function main() {
  const posts: Post[] = await client.fetch(query)

  console.log(`Found ${posts.length} blog posts\n`)
  console.log('='.repeat(60))

  for (const post of posts) {
    console.log(`\n## ${post.title}`)
    console.log(`   Slug: ${post.slug.current}`)
    console.log(`   Published: ${post.publishedAt}`)
    console.log(`   Content blocks: ${post.content?.length || 0}`)

    const blockTypes = [...new Set((post.content || []).map((b) => b._type))]
    console.log(`   Block types: ${blockTypes.join(', ')}`)

    if (post.content) {
      const markdown = portableTextToMarkdown(post.content)
      const lines = markdown.split('\n').length
      const chars = markdown.length

      console.log(`   Markdown: ${lines} lines, ${chars} chars`)
      console.log('\n--- PREVIEW (first 500 chars) ---')
      console.log(markdown.slice(0, 500))
      console.log('--- END PREVIEW ---')
    }

    console.log('='.repeat(60))
  }
}

main().catch(console.error)
