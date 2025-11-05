import { defineField, defineType } from 'sanity'

export const seoType = defineType({
  name: 'seo',
  title: 'SEO & Social',
  type: 'object',
  description: 'Search engine optimization and social media metadata',
  options: {
    collapsed: false,
    collapsible: true,
  },
  fields: [
    // SEO & Social Metadata
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description: 'Title for SEO and social sharing (50-60 characters recommended). Leave blank to use page title.',
      validation: (Rule) =>
        Rule.max(60).warning('Titles longer than 60 characters may be truncated'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      description: 'Description for SEO and social sharing (150-160 characters recommended)',
      validation: (Rule) =>
        Rule.max(160).warning('Descriptions longer than 160 characters may be truncated'),
    }),
    defineField({
      name: 'keywords',
      title: 'Keywords',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'SEO keywords (optional, less important than they used to be)',
      options: {
        layout: 'tags',
      },
    }),

    // Twitter Cards
    defineField({
      name: 'twitterCard',
      title: 'Twitter Card Type',
      type: 'string',
      description: 'The type of Twitter card to use (uses Open Graph title, description, and image)',
      options: {
        list: [
          { title: 'Summary (default)', value: 'summary' },
          { title: 'Summary with Large Image', value: 'summary_large_image' },
        ],
        layout: 'radio',
      },
      initialValue: 'summary_large_image',
    }),

    // Advanced
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL',
      type: 'url',
      description: 'The canonical URL for this page (optional, usually auto-generated)',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['http', 'https'],
        }),
    }),
    defineField({
      name: 'noIndex',
      title: 'No Index',
      type: 'boolean',
      description: 'Prevent search engines from indexing this page',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'metaTitle',
      description: 'metaDescription',
    },
    prepare({ title, description }) {
      return {
        title: title || 'No meta title set',
        subtitle: description || 'No meta description set',
      }
    },
  },
})
