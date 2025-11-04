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
    // Basic SEO
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description: 'SEO title (50-60 characters recommended). Leave blank to use page title.',
      validation: (Rule) =>
        Rule.max(60).warning('Titles longer than 60 characters may be truncated by search engines'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      description: 'SEO description (150-160 characters recommended)',
      validation: (Rule) =>
        Rule.max(160).warning('Descriptions longer than 160 characters may be truncated by search engines'),
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

    // Open Graph (Facebook, LinkedIn, etc.)
    defineField({
      name: 'ogTitle',
      title: 'Open Graph Title',
      type: 'string',
      description: 'Title for social sharing (Facebook, LinkedIn). Leave blank to use Meta Title.',
      validation: (Rule) =>
        Rule.max(60).warning('Titles longer than 60 characters may be truncated'),
    }),
    defineField({
      name: 'ogDescription',
      title: 'Open Graph Description',
      type: 'text',
      rows: 2,
      description: 'Description for social sharing. Leave blank to use Meta Description.',
      validation: (Rule) =>
        Rule.max(200).warning('Descriptions longer than 200 characters may be truncated'),
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      description: 'Image for social sharing (1200x630px recommended). Leave blank to use Featured Image.',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for accessibility and SEO',
        },
      ],
    }),

    // Twitter Cards
    defineField({
      name: 'twitterCard',
      title: 'Twitter Card Type',
      type: 'string',
      description: 'The type of Twitter card to use',
      options: {
        list: [
          { title: 'Summary (default)', value: 'summary' },
          { title: 'Summary with Large Image', value: 'summary_large_image' },
        ],
        layout: 'radio',
      },
      initialValue: 'summary_large_image',
    }),
    defineField({
      name: 'twitterTitle',
      title: 'Twitter Title',
      type: 'string',
      description: 'Title for Twitter sharing. Leave blank to use OG Title.',
      validation: (Rule) =>
        Rule.max(70).warning('Titles longer than 70 characters may be truncated'),
    }),
    defineField({
      name: 'twitterDescription',
      title: 'Twitter Description',
      type: 'text',
      rows: 2,
      description: 'Description for Twitter sharing. Leave blank to use OG Description.',
      validation: (Rule) =>
        Rule.max(200).warning('Descriptions longer than 200 characters may be truncated'),
    }),
    defineField({
      name: 'twitterImage',
      title: 'Twitter Image',
      type: 'image',
      description: 'Image for Twitter sharing (1200x675px for summary_large_image). Leave blank to use OG Image.',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        },
      ],
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
      image: 'ogImage',
    },
    prepare({ title, description, image }) {
      return {
        title: title || 'No meta title set',
        subtitle: description || 'No meta description set',
        media: image,
      }
    },
  },
})
