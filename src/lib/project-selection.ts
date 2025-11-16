import { client } from '@/sanity/lib/client'
import {
  allProjectsForSelectionQuery,
  relatedProjectsByCategoryQuery,
  projectCategoryQuery
} from '@/lib/sanity/queries/viewMoreProjects'

interface ProjectSelectionOptions {
  currentSlug: string
  strategy: 'random' | 'related' | 'recent' | 'curated'
  count: number
  excludeIds?: string[]
  curatedProjects?: any[]
  priorityBoost?: Array<{ project: any; weight: number }>
}

interface Project {
  _id: string
  title: string
  slug: { current: string } | string
  category: string
  _createdAt?: string
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
 * Main function to get recommended projects based on strategy
 */
export async function getRecommendedProjects({
  currentSlug,
  strategy,
  count,
  excludeIds = [],
  curatedProjects = [],
  priorityBoost = []
}: ProjectSelectionOptions): Promise<Project[]> {
  try {
    switch (strategy) {
      case 'curated':
        return getCuratedProjects(curatedProjects, currentSlug, count)

      case 'related':
        return getRelatedProjects(currentSlug, count, excludeIds)

      case 'recent':
        return getRecentProjects(currentSlug, count, excludeIds)

      case 'random':
      default:
        return getRandomProjects(currentSlug, count, excludeIds, priorityBoost)
    }
  } catch (error) {
    console.error('Error getting recommended projects:', error)
    // Fallback to empty array if there's an error
    return []
  }
}

/**
 * Get curated projects (manually selected)
 */
async function getCuratedProjects(
  curatedProjects: any[],
  currentSlug: string,
  count: number
): Promise<Project[]> {
  // Filter out the current project and limit to requested count
  const filtered = curatedProjects
    .filter(p => p && normalizeSlug(p.slug) !== currentSlug)
    .slice(0, count)

  return filtered
}

/**
 * Get related projects by category
 */
async function getRelatedProjects(
  currentSlug: string,
  count: number,
  excludeIds: string[]
): Promise<Project[]> {
  // First, get the current project's category
  const currentProject = await client.fetch(projectCategoryQuery, { slug: currentSlug })

  if (!currentProject?.category) {
    // If no category, fall back to recent projects
    return getRecentProjects(currentSlug, count, excludeIds)
  }

  // Get related projects by category
  let relatedProjects = await client.fetch(relatedProjectsByCategoryQuery, {
    category: currentProject.category,
    currentSlug,
    limit: count + excludeIds.length + 5 // Get extra in case we need to filter
  })

  // Filter out excluded projects
  if (excludeIds.length > 0) {
    relatedProjects = relatedProjects.filter(
      (p: Project) => !excludeIds.includes(p._id)
    )
  }

  // If we don't have enough related projects, supplement with recent
  if (relatedProjects.length < count) {
    const recentProjects = await getRecentProjects(
      currentSlug,
      count - relatedProjects.length,
      [...excludeIds, ...relatedProjects.map((p: Project) => p._id)]
    )
    relatedProjects = [...relatedProjects, ...recentProjects]
  }

  return relatedProjects.slice(0, count)
}

/**
 * Get most recent projects
 */
async function getRecentProjects(
  currentSlug: string,
  count: number,
  excludeIds: string[]
): Promise<Project[]> {
  const allProjects = await client.fetch(allProjectsForSelectionQuery)

  // Filter out current project and excluded ones
  const eligibleProjects = allProjects.filter(
    (p: Project) =>
      normalizeSlug(p.slug) !== currentSlug &&
      !excludeIds.includes(p._id)
  )

  // Return the most recent ones (already sorted by _createdAt desc)
  return eligibleProjects.slice(0, count)
}

/**
 * Get random projects with stable selection based on slug
 */
async function getRandomProjects(
  currentSlug: string,
  count: number,
  excludeIds: string[],
  priorityBoost: Array<{ project: any; weight: number }>
): Promise<Project[]> {
  const allProjects = await client.fetch(allProjectsForSelectionQuery)

  // Filter out current project and excluded ones
  let eligibleProjects = allProjects.filter(
    (p: Project) =>
      normalizeSlug(p.slug) !== currentSlug &&
      !excludeIds.includes(p._id)
  )

  // Apply priority boost if specified
  if (priorityBoost && priorityBoost.length > 0) {
    const weightedProjects: Project[] = []

    eligibleProjects.forEach((project: Project) => {
      // Check if this project has a priority boost
      const boost = priorityBoost.find(
        pb => pb.project && pb.project._id === project._id
      )

      // Add the project multiple times based on its weight
      const weight = boost ? boost.weight : 1
      for (let i = 0; i < weight; i++) {
        weightedProjects.push(project)
      }
    })

    eligibleProjects = weightedProjects
  }

  // Use current slug as seed for consistent randomization
  const seed = hashString(currentSlug)
  const rng = new SeededRandom(seed)

  // Shuffle with seeded random
  const shuffled = shuffleArray(eligibleProjects, rng) as Project[]

  // Remove duplicates (important if we applied weights)
  const uniqueProjects = Array.from(
    new Map(shuffled.map(p => [p._id, p])).values()
  )

  return uniqueProjects.slice(0, count)
}

/**
 * Helper function to get projects excluding the current one
 * This is a simpler version for basic use cases
 */
export async function getOtherProjects(
  currentSlug: string,
  count: number = 3
): Promise<Project[]> {
  const allProjects = await client.fetch(allProjectsForSelectionQuery)

  const otherProjects = allProjects.filter(
    (p: Project) => normalizeSlug(p.slug) !== currentSlug
  )

  // Simple random selection for fallback
  const seed = hashString(currentSlug)
  const rng = new SeededRandom(seed)
  const shuffled = shuffleArray(otherProjects, rng) as Project[]

  return shuffled.slice(0, count)
}