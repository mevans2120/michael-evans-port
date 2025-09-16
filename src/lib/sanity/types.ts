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
  content?: any[]
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
  bio?: any[]
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