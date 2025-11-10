import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'caseStudiesIndexPage',
  title: 'Case Studies Index Page',
  type: 'document',
  fields: [
    defineField({
      name: 'allCaseStudiesHeading',
      title: 'All Case Studies Heading',
      type: 'string',
      description: 'Heading for the case studies list section',
      initialValue: 'All Case Studies',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'allCaseStudiesDescription',
      title: 'All Case Studies Description',
      type: 'text',
      rows: 2,
      description: 'Description text below the heading',
      initialValue: 'Product launches and transformational projects',
      validation: (Rule) => Rule.required().max(300),
    }),

    // SEO
    defineField({
      name: 'seo',
      title: 'SEO & Social',
      type: 'seo',
      description: 'Search engine and social media metadata for the case studies index page',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Case Studies Index Page',
        subtitle: 'Content and SEO for /case-studies',
      }
    },
  },
})
