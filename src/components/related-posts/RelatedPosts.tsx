import { client } from '@/sanity/lib/client'
import { relatedPostsSettingsQuery } from '@/lib/sanity/queries/relatedPosts'
import { getRecommendedPosts, getOtherPosts } from '@/lib/blog-selection'
import { RelatedPostsClient } from './RelatedPostsClient'

interface RelatedPostsProps {
  currentSlug: string
}

interface PostReference {
  _id: string
  slug: { current: string }
}

interface BlogPost {
  slug: string | { current: string }
  title: string
}

/**
 * Server component that fetches settings and posts
 * This component runs on the server and passes data to the client component
 */
export async function RelatedPosts({ currentSlug }: RelatedPostsProps) {
  try {
    // Fetch the settings from Sanity
    const settings = await client.fetch(relatedPostsSettingsQuery)

    // If the feature is disabled or settings don't exist, don't render anything
    if (!settings?.enabled) {
      return null
    }

    // Determine how many posts to show (default to 3)
    const postCount = settings.numberOfPosts || 3

    // Get posts based on the selection strategy
    let posts = []

    if (settings.selectionStrategy === 'curated' && settings.curatedPosts?.length > 0) {
      // For curated, use the manually selected posts
      posts = settings.curatedPosts
        .filter((p: PostReference) => p && p.slug && p.slug.current !== currentSlug)
        .slice(0, postCount)
    } else {
      // For all other strategies, use the selection logic
      posts = await getRecommendedPosts({
        currentSlug,
        strategy: settings.selectionStrategy || 'recent',
        count: postCount,
        excludeIds: settings.excludeFromRandom?.map((p: PostReference) => p._id) || [],
        curatedPosts: settings.curatedPosts || [],
        priorityBoost: settings.priorityBoost || []
      })
    }

    // If we couldn't get enough posts with the selected strategy,
    // fall back to simple random selection
    if (posts.length === 0) {
      posts = await getOtherPosts(currentSlug, postCount)
    }

    // If still no posts, don't render
    if (posts.length === 0) {
      return null
    }

    // Normalize post data for the client component
    const normalizedPosts = posts.map((post: BlogPost) => ({
      slug: typeof post.slug === 'string' ? post.slug : post.slug?.current,
      title: post.title
    }))

    // Pass the settings and posts to the client component
    return (
      <RelatedPostsClient
        posts={normalizedPosts}
        settings={{
          heading: settings.heading || 'Continue Reading',
          subheading: settings.subheading || 'More thoughts on design, technology, and creative problem-solving.',
          layoutStyle: settings.layoutStyle || 'grid',
          ctaButton: settings.ctaButton,
          animation: settings.animation
        }}
      />
    )
  } catch (error) {
    console.error('Error rendering RelatedPosts:', error)
    // Don't break the page if there's an error
    return null
  }
}
