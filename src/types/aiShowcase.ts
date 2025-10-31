import { PortableTextBlock } from '@portabletext/types'

export interface AIShowcaseHero {
  badge?: string
  title: string
  subtitle?: string
  summary?: string
}

export interface QuoteBox {
  quote: string
  attribution?: string
}

export interface ComparisonBox {
  label: string
  title?: string
  text: string
  stat?: string
  icon?: string
}

export interface VisualCard {
  image?: {
    url: string
    alt: string
  }
  placeholderText?: string
  caption?: string
}

export interface ContentSlide {
  _type: 'contentSlide'
  sectionLabel?: string
  heading: string
  content?: PortableTextBlock[]
  quoteBox?: QuoteBox
  comparisonBoxes?: ComparisonBox[]
  visualCards?: VisualCard[]
  techPills?: string[]
}

export interface TimelinePhase {
  _id: string
  phase: string
  title: string
  description: string
  order: number
}

export interface WorkflowStep {
  _id: string
  stepNumber: number
  title: string
  description: string
  icon?: string
}

export interface ProjectCard {
  _id: string
  projectName: string
  projectType: string
  description: string
  technologies?: string[]
  icon?: string
  order: number
}

export interface Metric {
  value: string
  label: string
  description?: string
}

export interface CallToAction {
  text: string
  link: string
}

export interface AIShowcase {
  _id: string
  title: string
  slug: {
    current: string
  }
  category: 'ai-workflow' | 'healthcare-ai' | 'marketing-sites'
  featured: boolean
  order: number
  heroSection: AIShowcaseHero
  slides?: ContentSlide[]
  horizontalSectionLabel?: string
  horizontalSectionHeading?: string
  timelinePhases?: TimelinePhase[]
  workflowSteps?: WorkflowStep[]
  projectCards?: ProjectCard[]
  metrics?: Metric[]
  callToAction?: CallToAction
}
