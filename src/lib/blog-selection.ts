import { client } from '@/sanity/lib/client'
import {
  allBlogPostsForSelectionQuery,
  relatedPostsByBadgeQuery,
  featuredPostsQuery,
  postBadgeQuery
} from '@/lib/sanity/queries/relatedPosts'

interface PostReference {
  _id: string
  slug: { current: string }
}

interface PostSelectionOptions {
  currentSlug: string
  strategy: 'random' | 'related' | 'recent' | 'featured' | 'curated'
  count: number
  excludeIds?: string[]
  curatedPosts?: PostReference[]
  priorityBoost?: Array<{ post: PostReference; weight: number }>
}

interface BlogPost {
  _id: string
  title: string
  slug: { current: string } | string
  badge?: string
  featured?: boolean
  publishedAt?: string
}

/**
 * Simple hash function to convert string to number
 * Used for seeding the random number generator
 */
function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash)
}

/**
 * Seeded random number generator
 * Ensures consistent "random" selection for the same slug
 */
class SeededRandom {
  private seed: number

  constructor(seed: number) {
    this.seed = seed
  }

  next(): number {
    // Linear congruential generator
    this.seed = (this.seed * 1664525 + 1013904223) % 2147483647
    return this.seed / 2147483647
  }
}

/**
 * Shuffle array using seeded random for consistency
 */
function shuffleArray<T>(array: T[], rng: SeededRandom): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng.next() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * Get the slug string from various formats
 */
function normalizeSlug(slug: string | { current: string }): string {
  return typeof slug === 'string' ? slug : slug.current
}

/**
 * Main function to get recommended posts based on strategy
 */
export async function getRecommendedPosts({
  currentSlug,
  strategy,
  count,
  excludeIds = [],
  curatedPosts = [],
  priorityBoost = []
}: PostSelectionOptions): Promise<BlogPost[]> {
  try {
    switch (strategy) {
      case 'curated':
        return getCuratedPosts(curatedPosts, currentSlug, count)

      case 'related':
        return getRelatedPosts(currentSlug, count, excludeIds)

      case 'recent':
        return getRecentPosts(currentSlug, count, excludeIds)

      case 'featured':
        return getFeaturedPosts(currentSlug, count, excludeIds)

      case 'random':
      default:
        return getRandomPosts(currentSlug, count, excludeIds, priorityBoost)
    }
  } catch (error) {
    console.error('Error getting recommended posts:', error)
    // Fallback to empty array if there's an error
    return []
  }
}

/**
 * Get curated posts (manually selected)
 */
async function getCuratedPosts(
  curatedPosts: PostReference[],
  currentSlug: string,
  count: number
): Promise<BlogPost[]> {
  // Filter out the current post and limit to requested count
  const filtered = curatedPosts
    .filter(p => p && normalizeSlug(p.slug) !== currentSlug)
    .slice(0, count)

  return filtered as unknown as BlogPost[]
}

/**
 * Get related posts by badge (topic)
 */
async function getRelatedPosts(
  currentSlug: string,
  count: number,
  excludeIds: string[]
): Promise<BlogPost[]> {
  // First, get the current post's badge
  const currentPost = await client.fetch(postBadgeQuery, { slug: currentSlug })

  if (!currentPost?.badge) {
    // If no badge, fall back to recent posts
    return getRecentPosts(currentSlug, count, excludeIds)
  }

  // Get related posts by badge
  let relatedPosts = await client.fetch(relatedPostsByBadgeQuery, {
    badge: currentPost.badge,
    currentSlug,
    limit: count + excludeIds.length + 5 // Get extra in case we need to filter
  })

  // Filter out excluded posts
  if (excludeIds.length > 0) {
    relatedPosts = relatedPosts.filter(
      (p: BlogPost) => !excludeIds.includes(p._id)
    )
  }

  // If we don't have enough related posts, supplement with recent
  if (relatedPosts.length < count) {
    const recentPosts = await getRecentPosts(
      currentSlug,
      count - relatedPosts.length,
      [...excludeIds, ...relatedPosts.map((p: BlogPost) => p._id)]
    )
    relatedPosts = [...relatedPosts, ...recentPosts]
  }

  return relatedPosts.slice(0, count)
}

/**
 * Get most recent posts
 */
async function getRecentPosts(
  currentSlug: string,
  count: number,
  excludeIds: string[]
): Promise<BlogPost[]> {
  const allPosts = await client.fetch(allBlogPostsForSelectionQuery)

  // Filter out current post and excluded ones
  const eligiblePosts = allPosts.filter(
    (p: BlogPost) =>
      normalizeSlug(p.slug) !== currentSlug &&
      !excludeIds.includes(p._id)
  )

  // Return the most recent ones (already sorted by publishedAt desc)
  return eligiblePosts.slice(0, count)
}

/**
 * Get featured posts
 */
async function getFeaturedPosts(
  currentSlug: string,
  count: number,
  excludeIds: string[]
): Promise<BlogPost[]> {
  // First try to get featured posts
  let featuredPosts = await client.fetch(featuredPostsQuery, {
    currentSlug,
    limit: count + excludeIds.length + 5
  })

  // Filter out excluded posts
  if (excludeIds.length > 0) {
    featuredPosts = featuredPosts.filter(
      (p: BlogPost) => !excludeIds.includes(p._id)
    )
  }

  // If we don't have enough featured posts, supplement with recent
  if (featuredPosts.length < count) {
    const recentPosts = await getRecentPosts(
      currentSlug,
      count - featuredPosts.length,
      [...excludeIds, ...featuredPosts.map((p: BlogPost) => p._id)]
    )
    featuredPosts = [...featuredPosts, ...recentPosts]
  }

  return featuredPosts.slice(0, count)
}

/**
 * Get random posts with stable selection based on slug
 */
async function getRandomPosts(
  currentSlug: string,
  count: number,
  excludeIds: string[],
  priorityBoost: Array<{ post: PostReference; weight: number }>
): Promise<BlogPost[]> {
  const allPosts = await client.fetch(allBlogPostsForSelectionQuery)

  // Filter out current post and excluded ones
  let eligiblePosts = allPosts.filter(
    (p: BlogPost) =>
      normalizeSlug(p.slug) !== currentSlug &&
      !excludeIds.includes(p._id)
  )

  // Apply priority boost if specified
  if (priorityBoost && priorityBoost.length > 0) {
    const weightedPosts: BlogPost[] = []

    eligiblePosts.forEach((post: BlogPost) => {
      // Check if this post has a priority boost
      const boost = priorityBoost.find(
        pb => pb.post && pb.post._id === post._id
      )

      // Add the post multiple times based on its weight
      const weight = boost ? boost.weight : 1
      for (let i = 0; i < weight; i++) {
        weightedPosts.push(post)
      }
    })

    eligiblePosts = weightedPosts
  }

  // Use current slug as seed for consistent randomization
  const seed = hashString(currentSlug)
  const rng = new SeededRandom(seed)

  // Shuffle with seeded random
  const shuffled = shuffleArray(eligiblePosts, rng) as BlogPost[]

  // Remove duplicates (important if we applied weights)
  const uniquePosts = Array.from(
    new Map(shuffled.map(p => [p._id, p])).values()
  )

  return uniquePosts.slice(0, count)
}

/**
 * Helper function to get posts excluding the current one
 * This is a simpler version for basic use cases
 */
export async function getOtherPosts(
  currentSlug: string,
  count: number = 3
): Promise<BlogPost[]> {
  const allPosts = await client.fetch(allBlogPostsForSelectionQuery)

  const otherPosts = allPosts.filter(
    (p: BlogPost) => normalizeSlug(p.slug) !== currentSlug
  )

  // Simple random selection for fallback
  const seed = hashString(currentSlug)
  const rng = new SeededRandom(seed)
  const shuffled = shuffleArray(otherPosts, rng) as BlogPost[]

  return shuffled.slice(0, count)
}
