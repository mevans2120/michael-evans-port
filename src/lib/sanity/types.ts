/**
 * Sanity Portable Text block types
 * These represent rich text content from Sanity CMS
 */
export interface PortableTextBlock {
  _type: string
  _key: string
  style?: string
  children?: Array<{
    _type: string
    _key: string
    text: string
    marks?: string[]
  }>
  markDefs?: Array<{
    _type: string
    _key: string
    [key: string]: unknown
  }>
  [key: string]: unknown
}

export interface SanityProject {
  _id: string
  title: string
  slug: {
    current: string
  }
  category: 'case-study' | 'ai-project' | 'research' | 'open-source'
  summary?: string
  description?: string
  heroImage?: {
    asset: {
      url: string
    }
  }
  imageUrl?: string
  metrics?: Array<{
    label: string
    value: string
  }>
  achievements?: string[]
  content?: PortableTextBlock[]
  technologies?: string[]
  liveUrl?: string
  githubUrl?: string
  publishedAt?: string
  featured?: boolean
  order?: number
}

export interface SanityProfile {
  _id: string
  name: string
  title: string
  tagline?: string
  heroHeadline?: string
  heroSubheadline?: string
  bio?: PortableTextBlock[]
  profileImage?: {
    asset: {
      url: string
    }
  }
  profileImageUrl?: string
  skills?: Array<{
    category: string
    skills: string[]
  }>
  experience?: Array<{
    company: string
    role: string
    startDate: string
    endDate?: string
    current?: boolean
    description?: string
  }>
  social?: {
    github?: string
    linkedin?: string
    twitter?: string
    bluesky?: string
    email?: string
  }
}

export interface SanityCapability {
  _id: string
  title: string
  category: string
  icon?: string
  description?: string
  skills?: string[]
  order?: number
}