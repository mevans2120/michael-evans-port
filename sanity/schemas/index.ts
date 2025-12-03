import project from './project'
import profile from './profile'
import homepageHero from './homepageHero'
import contactPage from './contactPage'
import blogIndexPage from './blogIndexPage'
import caseStudiesIndexPage from './caseStudiesIndexPage'
import blog from './blog'
import chatPrompts from './chatPrompts'
import footer from './footer'
import seoSettings from './seoSettings'
import viewMoreProjectsSettings from './viewMoreProjectsSettings'
import relatedPostsSettings from './relatedPostsSettings'

// Object types (reusable)
import { seoType } from './objects/seo'

export const schemaTypes = [
  // Objects
  seoType,

  // Documents
  project,
  profile,
  homepageHero,
  contactPage,
  blogIndexPage,
  caseStudiesIndexPage,
  blog,
  chatPrompts,
  footer,
  seoSettings,
  viewMoreProjectsSettings,
  relatedPostsSettings,
]