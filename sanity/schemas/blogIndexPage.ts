import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'blogIndexPage',
  title: 'Blog Index Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      description: 'Main heading displayed on the blog index page',
      initialValue: 'Posts',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'description',
      title: 'Page Description',
      type: 'text',
      rows: 2,
      description: 'Subtitle text displayed below the main heading',
      initialValue: 'Insights on AI, creative technology, and building with AI-powered tools',
      validation: (Rule) => Rule.required().max(300),
    }),

    // SEO
    defineField({
      name: 'seo',
      title: 'SEO & Social',
      type: 'seo',
      description: 'Search engine and social media metadata for the blog index page',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Blog Index Page',
        subtitle: 'Content and SEO for /blog',
      }
    },
  },
})
