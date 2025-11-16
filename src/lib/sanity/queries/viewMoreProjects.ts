import { groq } from 'next-sanity'

// Query for the View More Projects Settings
export const viewMoreProjectsSettingsQuery = groq`
  *[_type == "viewMoreProjectsSettings"][0] {
    enabled,
    heading,
    subheading,
    numberOfProjects,
    layoutStyle,
    selectionStrategy,
    curatedProjects[]-> {
      _id,
      title,
      slug,
      category
    },
    excludeFromRandom[]-> {
      _id
    },
    priorityBoost[] {
      project-> {
        _id,
        title,
        slug,
        category
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

// Query for all projects (for random/recent selection)
export const allProjectsForSelectionQuery = groq`
  *[_type == "project"] | order(_createdAt desc) {
    _id,
    title,
    slug,
    category,
    _createdAt
  }
`

// Query for related projects by category
export const relatedProjectsByCategoryQuery = groq`
  *[_type == "project" && category == $category && slug.current != $currentSlug] | order(_createdAt desc) [0...$limit] {
    _id,
    title,
    slug,
    category
  }
`

// Query to get a specific project's category
export const projectCategoryQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    category
  }
`