import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'seoSettings',
  title: 'Global SEO Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      description: 'Used in Open Graph metadata and as site identifier',
      initialValue: 'Michael Evans Portfolio',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'defaultMetaDescription',
      title: 'Default Meta Description',
      type: 'text',
      rows: 3,
      description: 'Fallback description when page-specific description is not set',
      validation: (Rule) =>
        Rule.max(160).warning('Descriptions longer than 160 characters may be truncated by search engines'),
    }),
    defineField({
      name: 'defaultOgImage',
      title: 'Default Open Graph Image',
      type: 'image',
      description: 'Fallback image for social sharing (1200x630px recommended)',
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
    defineField({
      name: 'twitterHandle',
      title: 'Twitter Handle',
      type: 'string',
      description: 'Your Twitter username (without @)',
      placeholder: 'mevans212',
      validation: (Rule) =>
        Rule.custom((value) => {
          if (value && value.startsWith('@')) {
            return 'Do not include @ symbol'
          }
          return true
        }),
    }),
    defineField({
      name: 'author',
      title: 'Default Author',
      type: 'string',
      description: 'Default author name for metadata',
      initialValue: 'Michael Evans',
    }),
    defineField({
      name: 'siteUrl',
      title: 'Site URL',
      type: 'url',
      description: 'Your production site URL (e.g., https://yourdomain.com)',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['http', 'https'],
        }),
    }),
    defineField({
      name: 'googleSiteVerification',
      title: 'Google Site Verification',
      type: 'string',
      description: 'Google Search Console verification code (optional)',
    }),
    defineField({
      name: 'keywords',
      title: 'Default Keywords',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Default SEO keywords used as fallback',
      options: {
        layout: 'tags',
      },
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Global SEO Settings',
        subtitle: 'Site-wide SEO defaults and configuration',
      }
    },
  },
})
