import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'homepageIntro',
  title: 'Homepage Intro Section',
  type: 'document',
  fields: [
    defineField({
      name: 'heading',
      title: 'Main Heading',
      type: 'string',
      validation: (Rule) => Rule.required().max(100),
      description: 'Primary hero heading (keep concise)',
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.required().max(200),
      description: 'Supporting text under main heading',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Longer description paragraph (optional)',
    }),
    defineField({
      name: 'cta',
      title: 'Call to Action',
      type: 'object',
      fields: [
        {
          name: 'primaryText',
          title: 'Primary Button Text',
          type: 'string',
          initialValue: 'View Work',
        },
        {
          name: 'primaryLink',
          title: 'Primary Button Link',
          type: 'string',
          initialValue: '#work',
        },
        {
          name: 'secondaryText',
          title: 'Secondary Button Text',
          type: 'string',
          initialValue: 'Get in Touch',
        },
        {
          name: 'secondaryLink',
          title: 'Secondary Button Link',
          type: 'string',
          initialValue: '#contact',
        },
      ],
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Optional background image for hero section',
    }),
    defineField({
      name: 'profileImage',
      title: 'Profile Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Optional profile photo',
    }),
    defineField({
      name: 'active',
      title: 'Active Hero',
      type: 'boolean',
      initialValue: true,
      description: 'Set to true to use this hero on homepage',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first (for A/B testing)',
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      subtitle: 'subheading',
      media: 'profileImage',
      active: 'active',
    },
    prepare({ title, subtitle, media, active }) {
      return {
        title: title || 'Hero Section',
        subtitle: `${active ? '✓ Active' : '○ Inactive'} • ${subtitle || 'No subheading'}`,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
})
