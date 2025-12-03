import { groq } from 'next-sanity'

// Query for the Related Posts Settings
export const relatedPostsSettingsQuery = groq`
  *[_type == "relatedPostsSettings"][0] {
    enabled,
    heading,
    subheading,
    numberOfPosts,
    layoutStyle,
    selectionStrategy,
    curatedPosts[]-> {
      _id,
      title,
      slug,
      "badge": heroSection.badge
    },
    excludeFromRandom[]-> {
      _id
    },
    priorityBoost[] {
      post-> {
        _id,
        title,
        slug,
        "badge": heroSection.badge
      },
      weight
    },
    ctaButton {
      enabled,
      text,
      link,
      style
    },
    animation {
      enableAnimation,
      staggerDelay
    }
  }
`

// Query for all blog posts (for random/recent selection)
export const allBlogPostsForSelectionQuery = groq`
  *[_type == "blog" && defined(slug.current)] | order(publishedAt desc) {
    _id,
    title,
    slug,
    "badge": heroSection.badge,
    featured,
    publishedAt
  }
`

// Query for related posts by badge (topic)
export const relatedPostsByBadgeQuery = groq`
  *[_type == "blog" && heroSection.badge == $badge && slug.current != $currentSlug && defined(slug.current)] | order(publishedAt desc) [0...$limit] {
    _id,
    title,
    slug,
    "badge": heroSection.badge
  }
`

// Query for featured posts
export const featuredPostsQuery = groq`
  *[_type == "blog" && featured == true && slug.current != $currentSlug && defined(slug.current)] | order(order asc, publishedAt desc) [0...$limit] {
    _id,
    title,
    slug,
    "badge": heroSection.badge
  }
`

// Query to get a specific post's badge
export const postBadgeQuery = groq`
  *[_type == "blog" && slug.current == $slug][0] {
    "badge": heroSection.badge
  }
`
