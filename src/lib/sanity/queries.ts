import groq from 'groq'

// Get all projects
export const projectsQuery = groq`
  *[_type == "project"] | order(order asc, publishedAt desc) {
    _id,
    title,
    slug,
    category,
    summary,
    description,
    heroImage,
    technologies,
    featured,
    "imageUrl": heroImage.asset->url
  }
`

// Get featured projects for homepage
export const featuredProjectsQuery = groq`
  *[_type == "project" && featured == true] | order(order asc, publishedAt desc)[0...4] {
    _id,
    title,
    slug,
    category,
    summary,
    heroImage,
    "imageUrl": heroImage.asset->url
  }
`

// Get single project with full content
export const projectQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    category,
    summary,
    description,
    heroImage,
    "imageUrl": heroImage.asset->url,
    metrics,
    achievements,
    content[] {
      ...,
      _type == "image" => {
        "url": asset->url,
        "dimensions": asset->metadata.dimensions
      }
    },
    technologies,
    liveUrl,
    githubUrl,
    publishedAt,
    featured
  }
`

// Get projects by category
export const projectsByCategoryQuery = groq`
  *[_type == "project" && category == $category] | order(order asc, publishedAt desc) {
    _id,
    title,
    slug,
    category,
    summary,
    heroImage,
    "imageUrl": heroImage.asset->url,
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

// Get active hero options for homepage rotation
export const heroOptionsQuery = groq`
  *[_type == "heroOption" && active == true] | order(order asc) {
    _id,
    prefix,
    dropdown,
    linkType,
    "internalSlug": internalLink->slug.current,
    "internalType": internalLink->_type,
    externalLink,
    label,
    description,
    "imageUrl": image.asset->url,
    tags,
    colorGradient,
    order
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
  *[_type == "project" && category == "case-study" && featured == true] | order(order asc)[0] {
    _id,
    title,
    slug,
    summary,
    description,
    metrics[] {
      label,
      value,
      description
    },
    heroImage {
      asset->{
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      },
      alt,
      caption
    },
    order
  }
`