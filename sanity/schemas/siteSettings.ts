import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Site Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Used in browser title and metadata',
    }),
    defineField({
      name: 'siteDescription',
      title: 'Site Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(160),
      description: 'SEO meta description (160 chars max)',
    }),
    defineField({
      name: 'siteKeywords',
      title: 'Site Keywords',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      description: 'SEO keywords',
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Default social media share image (1200x630px recommended)',
    }),
    defineField({
      name: 'faviconLight',
      title: 'Favicon (Light Mode)',
      type: 'image',
      description: 'Favicon for light mode',
    }),
    defineField({
      name: 'faviconDark',
      title: 'Favicon (Dark Mode)',
      type: 'image',
      description: 'Favicon for dark mode',
    }),
    defineField({
      name: 'featuredWork',
      title: 'Featured Work',
      type: 'object',
      fields: [
        {
          name: 'heading',
          title: 'Section Heading',
          type: 'string',
          initialValue: 'Selected Work',
        },
        {
          name: 'description',
          title: 'Section Description',
          type: 'text',
          rows: 2,
          initialValue: 'Case studies and projects',
        },
        {
          name: 'projects',
          title: 'Featured Projects',
          type: 'array',
          of: [
            {
              type: 'reference',
              to: [{ type: 'project' }, { type: 'aiProject' }],
            },
          ],
          validation: (Rule) => Rule.max(8),
          description: 'Select up to 8 projects to feature on homepage',
        },
      ],
    }),
    defineField({
      name: 'navigation',
      title: 'Navigation Settings',
      type: 'object',
      fields: [
        {
          name: 'logo',
          title: 'Logo Text',
          type: 'string',
          initialValue: 'MEvans',
        },
        {
          name: 'showContact',
          title: 'Show Contact in Nav',
          type: 'boolean',
          initialValue: true,
        },
        {
          name: 'ctaText',
          title: 'CTA Button Text',
          type: 'string',
          initialValue: 'Get in Touch',
        },
        {
          name: 'ctaLink',
          title: 'CTA Button Link',
          type: 'string',
          initialValue: 'mailto:hello@mevans212.com',
        },
      ],
    }),
    defineField({
      name: 'footer',
      title: 'Footer',
      type: 'object',
      fields: [
        {
          name: 'copyrightText',
          title: 'Copyright Text',
          type: 'string',
          initialValue: '© 2024 Michael Evans. All rights reserved.',
        },
        {
          name: 'showSocialLinks',
          title: 'Show Social Links',
          type: 'boolean',
          initialValue: true,
        },
      ],
    }),
    defineField({
      name: 'analytics',
      title: 'Analytics',
      type: 'object',
      fields: [
        {
          name: 'googleAnalyticsId',
          title: 'Google Analytics ID',
          type: 'string',
          description: 'GA4 Measurement ID (e.g., G-XXXXXXXXXX)',
        },
        {
          name: 'enableTracking',
          title: 'Enable Tracking',
          type: 'boolean',
          initialValue: true,
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'siteTitle',
      subtitle: 'siteDescription',
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Site Settings',
        subtitle: subtitle || 'Configure site-wide settings',
      }
    },
  },
})
