import groq from 'groq'

// Get all projects
export const projectsQuery = groq`
  *[_type == "project"] | order(order asc, publishedAt desc) {
    _id,
    title,
    slug,
    category,

    // Editorial format
    heroSection {
      badge,
      title,
      subtitle,
      summary
    },

    technologies,
    featured,
    featuredMetric,
    featuredDescription,

    // Featured image
    featuredImage {
      asset->{
        _id,
        url
      },
      alt
    }
  }
`

// Get featured projects for homepage
export const featuredProjectsQuery = groq`
  *[_type == "project" && featured == true] | order(order asc, publishedAt desc)[0...4] {
    _id,
    title,
    slug,
    category,

    // Editorial format
    heroSection {
      subtitle,
      summary
    },

    // Featured image
    featuredImage {
      asset->{
        _id,
        url
      }
    }
  }
`

// Get single project with full content
export const projectQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    category,

    // Editorial format
    heroSection {
      badge,
      title,
      subtitle,
      summary
    },
    overview {
      role,
      company,
      timeline
    },

    metrics[] {
      label,
      value,
      description
    },

    slides[] {
      _key,
      sectionLabel,
      heading,
      content,
      quoteBox,
      comparisonBoxes,
      visualCards,
      annotation
    },

    // Featured image
    featuredImage {
      asset->{
        _id,
        url
      },
      alt
    },

    technologies,
    liveUrl,
    githubUrl,
    publishedAt,
    featured,

    callToAction {
      text,
      link
    },

    seo {
      metaTitle,
      metaDescription,
      keywords,
      twitterCard,
      canonicalUrl,
      noIndex
    }
  }
`

// Get projects by category
export const projectsByCategoryQuery = groq`
  *[_type == "project" && category == $category] | order(order asc, publishedAt desc) {
    _id,
    title,
    slug,
    category,

    // Editorial format
    heroSection {
      summary
    },

    // Featured image
    featuredImage {
      asset->{
        _id,
        url
      }
    },

    technologies
  }
`

// Get profile information
export const profileQuery = groq`
  *[_type == "profile"][0] {
    _id,
    name,
    title,
    tagline,
    bio,
    profileImage,
    "profileImageUrl": profileImage.asset->url,
    skills,
    experience,
    social
  }
`

// Get all capabilities
export const capabilitiesQuery = groq`
  *[_type == "capability"] | order(order asc) {
    _id,
    title,
    category,
    icon,
    description,
    skills
  }
`

// Get capabilities by category
export const capabilitiesByCategoryQuery = groq`
  *[_type == "capability" && category == $category] | order(order asc) {
    _id,
    title,
    icon,
    description,
    skills
  }
`

// Get homepage content (singleton)
export const homepageHeroQuery = groq`
  *[_type == "homepageHero"][0] {
    _id,
    tagline,
    description,
    heroCta {
      text,
      linkType,
      internalLink,
      externalLink
    },
    selectedWorkSection,
    aiShowcaseSection {
      heading,
      description,
      viewAllText,
      viewAllLinkType,
      viewAllInternalLink,
      viewAllExternalLink
    },
    seo {
      metaTitle,
      metaDescription,
      keywords,
      twitterCard,
      canonicalUrl,
      noIndex
    }
  }
`

// Get all AI Showcases for landing page
export const allAIShowcasesQuery = groq`
  *[_type == "aiShowcase"] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    category,
    featured,
    order,
    heroSection {
      badge,
      title,
      subtitle,
      summary
    }
  }
`

// Get featured AI Showcase for homepage
export const featuredAIShowcaseQuery = groq`
  *[_type == "aiShowcase" && featured == true] | order(order asc)[0] {
    _id,
    title,
    "slug": slug.current,
    category,
    heroSection {
      badge,
      title,
      subtitle,
      summary
    }
  }
`

// Get featured case study for case studies landing page
export const featuredCaseStudyQuery = groq`
  *[_type == "project" && featured == true] | order(order asc)[0] {
    _id,
    title,
    slug,

    // Editorial format
    heroSection {
      badge,
      title,
      subtitle,
      summary
    },

    metrics[] {
      label,
      value,
      description
    },

    // Featured image
    featuredImage {
      asset->{
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      },
      alt
    },

    order
  }
`

// Get chat prompts for AI assistant (singleton)
export const chatPromptsQuery = groq`
  *[_type == "chatPrompts"][0] {
    prompts[active == true] | order(order asc) {
      text,
      order,
      active
    },
    numberOfPromptsToShow
  }
`

// Get footer content (singleton)
export const footerQuery = groq`
  *[_type == "footer"][0] {
    _id,
    services[] | order(order asc) {
      title,
      url,
      order
    },
    linkedinUrl,
    contactLinkType,
    contactInternalLink,
    contactExternalLink,
    weatherEnabled,
    weatherLocation
  }
`