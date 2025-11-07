import project from './project'
import profile from './profile'
import homepageHero from './homepageHero'
import aiShowcase from './aiShowcase'
import blog from './blog'
import timelinePhase from './timelinePhase'
import workflowStep from './workflowStep'
import projectCard from './projectCard'
import chatPrompts from './chatPrompts'
import footer from './footer'
import seoSettings from './seoSettings'

// Object types (reusable)
import { seoType } from './objects/seo'

export const schemaTypes = [
  // Objects
  seoType,

  // Documents
  project,
  profile,
  homepageHero,
  aiShowcase,
  blog,
  timelinePhase,
  workflowStep,
  projectCard,
  chatPrompts,
  footer,
  seoSettings,
]