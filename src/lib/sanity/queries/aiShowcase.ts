import { groq } from 'next-sanity'

/**
 * GROQ query to fetch all AI Showcase documents
 */
export const allAIShowcasesQuery = groq`
  *[_type == "aiShowcase"] | order(order asc) {
    _id,
    title,
    slug,
    category,
    featured,
    order,
    "heroSection": heroSection {
      badge,
      title,
      subtitle,
      summary
    }
  }
`

/**
 * GROQ query to fetch a single AI Showcase by slug with all content
 */
export const aiShowcaseBySlugQuery = groq`
  *[_type == "aiShowcase" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    category,
    featured,
    order,

    "heroSection": heroSection {
      badge,
      title,
      subtitle,
      summary
    },

    "slides": slides[] {
      _type,
      sectionLabel,
      heading,
      content,
      quoteBox,
      comparisonBoxes,
      visualCards,
      techPills
    },

    horizontalSectionLabel,
    horizontalSectionHeading,

    "timelinePhases": timelinePhases[]-> {
      _id,
      phase,
      title,
      description,
      order
    },

    "workflowSteps": workflowSteps[]-> {
      _id,
      stepNumber,
      title,
      description,
      icon
    },

    "projectCards": projectCards[]-> {
      _id,
      projectName,
      projectType,
      description,
      technologies,
      icon,
      order
    },

    "metrics": metrics[] {
      value,
      label,
      description
    },

    "callToAction": callToAction {
      text,
      link
    }
  }
`

/**
 * GROQ query to get all showcase slugs (for static generation)
 */
export const allAIShowcaseSlugsQuery = groq`
  *[_type == "aiShowcase" && defined(slug.current)] {
    "slug": slug.current
  }
`
