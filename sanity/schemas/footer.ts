import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'footer',
  title: 'Footer',
  type: 'document',
  fields: [
    // Product Management Services
    defineField({
      name: 'services',
      title: 'Product Management Services',
      type: 'array',
      description: 'List of services displayed in the footer',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              type: 'string',
              title: 'Service Title',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'url',
              type: 'string',
              title: 'URL (optional)',
              description: 'Link to service page or anchor',
            },
            {
              name: 'order',
              type: 'number',
              title: 'Display Order',
              validation: (Rule) => Rule.required().integer().min(1),
            },
          ],
          preview: {
            select: {
              title: 'title',
              order: 'order',
            },
            prepare({ title, order }) {
              return {
                title: `${order}. ${title}`,
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),

    // Social Links
    defineField({
      name: 'linkedinUrl',
      title: 'LinkedIn URL',
      type: 'url',
      description: 'Full LinkedIn profile URL',
      validation: (Rule) => Rule.required().uri({
        scheme: ['http', 'https'],
      }),
    }),

    // Contact Link
    defineField({
      name: 'contactLinkType',
      title: 'Contact Link Type',
      type: 'string',
      options: {
        list: [
          { title: 'Internal Page', value: 'internal' },
          { title: 'External URL', value: 'external' },
        ],
        layout: 'radio',
      },
      initialValue: 'internal',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'contactInternalLink',
      title: 'Contact Internal Link',
      type: 'string',
      options: {
        list: [
          { title: 'Contact Page', value: '/contact' },
          { title: 'About Page', value: '/about' },
        ],
      },
      hidden: ({ parent }) => parent?.contactLinkType !== 'internal',
      initialValue: '/contact',
      validation: (Rule) => Rule.custom((value, context) => {
        const parent = context.parent as any;
        if (parent?.contactLinkType === 'internal' && !value) {
          return 'Internal link is required when Contact Link Type is Internal';
        }
        return true;
      }),
    }),
    defineField({
      name: 'contactExternalLink',
      title: 'Contact External URL',
      type: 'url',
      description: 'Full URL starting with http:// or https://',
      hidden: ({ parent }) => parent?.contactLinkType !== 'external',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as any;
          if (parent?.contactLinkType === 'external' && !value) {
            return 'External URL is required when Contact Link Type is External';
          }
          return true;
        }).uri({
          scheme: ['http', 'https'],
        }),
    }),

    // Weather Settings
    defineField({
      name: 'weatherEnabled',
      title: 'Enable Weather Display',
      type: 'boolean',
      description: 'Show live Portland weather in footer tagline',
      initialValue: true,
    }),
    defineField({
      name: 'weatherLocation',
      title: 'Weather Location',
      type: 'string',
      description: 'City for weather display (default: Portland, OR)',
      initialValue: 'Portland, OR',
      hidden: ({ parent }) => !parent?.weatherEnabled,
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Footer',
        subtitle: 'Site footer content and links',
      }
    },
  },
})
