import { defineDocuments, defineLocations } from 'sanity/presentation'

// Tell Presentation how to navigate to document previews
// This maps URL patterns to document queries
export const mainDocuments = defineDocuments([
  {
    route: '/blog/:slug',
    filter: `_type == "blog" && slug.current == $slug`,
  },
  {
    route: '/case-studies/:slug',
    filter: `_type == "project" && slug.current == $slug`,
  },
  {
    route: '/ai-showcase/:slug',
    filter: `_type == "aiShowcase" && slug.current == $slug`,
  },
])

// Tell editors where their content is used
// This enables the "Used on X pages" banner and preview navigation
export const locations = {
  blog: defineLocations({
    select: {
      title: 'title',
      slug: 'slug.current',
    },
    resolve: (doc) => ({
      locations: [
        {
          title: doc?.title || 'Untitled',
          href: `/blog/${doc?.slug}`,
        },
      ],
    }),
  }),
  project: defineLocations({
    select: {
      title: 'title',
      slug: 'slug.current',
    },
    resolve: (doc) => ({
      locations: [
        {
          title: doc?.title || 'Untitled',
          href: `/case-studies/${doc?.slug}`,
        },
      ],
    }),
  }),
  aiShowcase: defineLocations({
    select: {
      title: 'title',
      slug: 'slug.current',
    },
    resolve: (doc) => ({
      locations: [
        {
          title: doc?.title || 'Untitled',
          href: `/ai-showcase/${doc?.slug}`,
        },
      ],
    }),
  }),
}
